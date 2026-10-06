import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

export interface UIElementRef {
  ref: string; // e.g. "@e1"
  tag: string;
  role?: string;
  name?: string;
  text?: string;
  id?: string;
  selector: string;
  bounds: { x: number; y: number; width: number; height: number };
  value?: string;
}

export interface AgentDeviceSnapshot {
  timestamp: string;
  url: string;
  title: string;
  activeMode: string;
  hudInfo: Record<string, string>;
  simState: any;
  elements: UIElementRef[];
}

export class AgentDeviceWeb {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  public page: Page | null = null;
  private elementMap: Map<string, UIElementRef> = new Map();
  private reportsDir: string;

  constructor(subDir: string = '') {
    this.reportsDir = path.resolve(process.cwd(), 'agent-reports', subDir);
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  public getReportsDir(): string {
    return this.reportsDir;
  }

  public async launch(headless: boolean = true, port: number = 3000): Promise<void> {
    this.browser = await chromium.launch({
      headless,
      slowMo: 50
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2
    });
    this.page = await this.context.newPage();
    await this.page.goto(`http://localhost:${port}`);
    await this.page.waitForLoadState('networkidle');
  }

  public async close(): Promise<void> {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  /**
   * Extract interactive elements tree with @e1, @e2 references (like Callstack agent-device)
   */
  public async snapshot(): Promise<AgentDeviceSnapshot> {
    if (!this.page) throw new Error('Page not initialized');

    // 1. Gather all interactive or key informational elements
    const rawElements = await this.page.evaluate(() => {
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, [role="button"], [role="tab"], [role="slider"], .btn-micro, .mode-tab, .step-dot, canvas'
        )
      );

      return candidates
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0'
          );
        })
        .map((el) => {
          const rect = el.getBoundingClientRect();
          let selector = '';
          if (el.id) {
            selector = `#${el.id}`;
          } else if (el.getAttribute('data-target')) {
            selector = `[data-target="${el.getAttribute('data-target')}"][data-val="${el.getAttribute('data-val')}"]`;
          } else if (el.className) {
            selector = `.${el.className.trim().split(/\s+/).join('.')}`;
          } else {
            selector = el.tagName.toLowerCase();
          }

          const role = el.getAttribute('role') || el.tagName.toLowerCase();
          const name = el.getAttribute('aria-label') || el.title || (el as HTMLInputElement).placeholder || '';
          const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50);
          const value = (el as HTMLInputElement).value;

          return {
            tag: el.tagName.toLowerCase(),
            role,
            name: name || undefined,
            text: text || undefined,
            id: el.id || undefined,
            selector,
            bounds: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            },
            value: value !== undefined ? value : undefined
          };
        });
    });

    this.elementMap.clear();
    const elements: UIElementRef[] = rawElements.map((item, idx) => {
      const ref = `@e${idx + 1}`;
      const entry: UIElementRef = { ref, ...item };
      this.elementMap.set(ref, entry);
      return entry;
    });

    // 2. Extract current active mode & HUD info
    const activeMode = await this.page.evaluate(() => {
      const activeTab = document.querySelector('.mode-tab.active');
      return activeTab?.getAttribute('data-mode') || 'coulomb';
    });

    const hudInfo = await this.page.evaluate(() => {
      const hud: Record<string, string> = {};
      const fVal = document.getElementById('hud-force-val')?.textContent;
      const fType = document.getElementById('hud-force-type')?.textContent;
      const distVal = document.getElementById('hud-dist-val')?.textContent;
      if (fVal) hud['Force'] = fVal;
      if (fType) hud['Type'] = fType;
      if (distVal) hud['Distance'] = distVal;

      const poyntingW = document.getElementById('poynting-val-w')?.textContent;
      const poyntingFlux = document.getElementById('poynting-val-flux')?.textContent;
      if (poyntingW) hud['StoredEnergy'] = poyntingW;
      if (poyntingFlux) hud['PoyntingFlux'] = poyntingFlux;

      const mysteryMissing = document.getElementById('notebook-missing-val')?.textContent;
      if (mysteryMissing) hud['MysteryMissingEnergy'] = mysteryMissing;

      return hud;
    });

    const simState = await this.page.evaluate(() => {
      const s = (window as any).__SIM_STATE__;
      if (!s) return null;
      return {
        particles: s.particles?.map((p: any) => ({ label: p.label, q: p.q, x: p.x, y: p.y })),
        charge1: s.particles?.[0]?.q,
        charge2: s.particles?.[1]?.q
      };
    });

    return {
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      title: await this.page.title(),
      activeMode,
      hudInfo,
      simState,
      elements
    };
  }

  public resolveSelector(refOrSelector: string): string {
    if (refOrSelector.startsWith('@e')) {
      const elem = this.elementMap.get(refOrSelector);
      if (!elem) throw new Error(`Unknown element reference: ${refOrSelector}`);
      return elem.selector;
    }
    return refOrSelector;
  }

  public async tap(refOrSelector: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = this.resolveSelector(refOrSelector);

    // Try finding if the element is an input inside a label (like custom toggle switches)
    const isCustomToggle = await this.page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      return el.tagName.toLowerCase() === 'input' && !!el.closest('label');
    }, selector);

    if (isCustomToggle) {
      // Click the wrapping label or force click
      try {
        await this.page.locator(`label:has(${selector})`).click({ timeout: 2000 });
      } catch {
        await this.page.click(selector, { force: true });
      }
    } else {
      try {
        await this.page.click(selector, { timeout: 3000 });
      } catch {
        await this.page.click(selector, { force: true });
      }
    }
    await this.page.waitForTimeout(100);
  }

  public async fill(refOrSelector: string, text: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = this.resolveSelector(refOrSelector);
    await this.page.fill(selector, text);
  }

  public async setSlider(refOrSelector: string, value: number): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    const selector = this.resolveSelector(refOrSelector);
    await this.page.fill(selector, value.toString());
    await this.page.dispatchEvent(selector, 'input');
    await this.page.waitForTimeout(100);
  }

  public async dragCanvas(startX: number, startY: number, endX: number, endY: number): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY, { steps: 10 });
    await this.page.mouse.up();
    await this.page.waitForTimeout(100);
  }

  public async screenshot(name: string): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');
    const filename = `${name.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
    const fullPath = path.join(this.reportsDir, filename);
    await this.page.screenshot({ path: fullPath });
    return fullPath;
  }

  public formatSnapshotPrompt(snapshot: AgentDeviceSnapshot): string {
    let out = `### Screen State: [Mode: ${snapshot.activeMode.toUpperCase()}]\n`;
    out += `HUD: ${JSON.stringify(snapshot.hudInfo)}\n`;
    if (snapshot.simState) {
      out += `Simulation State: ${JSON.stringify(snapshot.simState)}\n`;
    }
    out += `\nInteractive Elements:\n`;
    for (const el of snapshot.elements) {
      const desc = [el.tag, el.role !== el.tag ? `role=${el.role}` : '', el.name ? `"${el.name}"` : '', el.text ? `text="${el.text}"` : '', el.value !== undefined ? `val="${el.value}"` : '']
        .filter(Boolean)
        .join(' ');
      out += `  ${el.ref}: ${desc} [${el.selector}]\n`;
    }
    return out;
  }
}
