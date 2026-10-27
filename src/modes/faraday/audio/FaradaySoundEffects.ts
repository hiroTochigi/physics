class FaradaySoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private thereminOsc: OscillatorNode | null = null;
  private thereminGain: GainNode | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopTheremin();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous Theremin drone mapped to electric potential \phi
   * Pitch changes smoothly with height!
   */
  public updateThereminPotential(potentialVolts: number): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Map potential (-100 to +100) to frequency (180 Hz to 750 Hz)
    const clamped = Math.max(-80, Math.min(80, potentialVolts));
    const targetFreq = 440 * Math.pow(2, clamped / 40);

    if (!this.thereminOsc || !this.thereminGain) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        this.thereminOsc = osc;
        this.thereminGain = gain;
      } catch {
        // audio context blocked by browser gesture policy
      }
    } else {
      try {
        this.thereminOsc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.05);
      } catch {}
    }
  }

  public stopTheremin(): void {
    if (this.thereminGain && this.ctx) {
      try {
        this.thereminGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
        setTimeout(() => {
          if (this.thereminOsc) {
            this.thereminOsc.stop();
            this.thereminOsc.disconnect();
            this.thereminOsc = null;
          }
          if (this.thereminGain) {
            this.thereminGain.disconnect();
            this.thereminGain = null;
          }
        }, 120);
      } catch {}
    }
  }

  /**
   * Crisp 90° Orthogonal Loupe Snap Click
   */
  public play90DegreeSnap(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  /**
   * Hose Squeeze Charge Sound: pitched whistle as tube narrows
   */
  public playHoseSqueeze(squeezeRatio: number): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // narrower tube = higher jet frequency
      const freq = 300 + (1.0 - squeezeRatio) * 900;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {}
  }

  /**
   * Ball Launch sound
   */
  public playBallLaunch(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  /**
   * Success Fanfare when 3 sniper snaps or quiz cleared
   */
  public playSuccessFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      try {
        const startTime = now + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.38);
      } catch {}
    });
  }

  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }
}

export const faradaySounds = new FaradaySoundEffects();
