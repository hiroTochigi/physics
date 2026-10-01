var kd=Object.defineProperty;var Bd=(i,e,t)=>e in i?kd(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var me=(i,e,t)=>Bd(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();class tu{constructor(e,t,n,r,a=24){me(this,"id");me(this,"x");me(this,"y");me(this,"q");me(this,"radius");me(this,"isDragging",!1);me(this,"isHovered",!1);this.id=e,this.x=t,this.y=n,this.q=r,this.radius=a}get isPositive(){return this.q>0}get isNegative(){return this.q<0}get isNeutral(){return this.q===0}distanceTo(e){const t=e.x-this.x,n=e.y-this.y;return Math.sqrt(t*t+n*n)}directionTo(e){const t=e.x-this.x,n=e.y-this.y,r=Math.sqrt(t*t+n*n);return r<1e-6?{x:1,y:0}:{x:t/r,y:n/r}}}const Zi=class Zi{constructor(){me(this,"pixelsPerMeter",200);me(this,"softeningDistance",.05)}calculateForce(e,t){const n=t.x-e.x,r=t.y-e.y,a=Math.max(1,Math.sqrt(n*n+r*r)),s=a/this.pixelsPerMeter,o=e.q*1e-6,l=t.q*1e-6,c=o*l,h=c>0,u=c<0,f=s*s+this.softeningDistance*this.softeningDistance,g=Zi.K_E*Math.abs(c)/f,x=n/a,_=r/a,m=this.calculateArrowLength(g);let p=0,E=0,w=0,C=0;return h?(p=-x*m,E=-_*m,w=x*m,C=_*m):u&&(p=x*m,E=_*m,w=-x*m,C=-_*m),{magnitude:g,isRepulsion:h,isAttraction:u,distanceMeters:s,distancePixels:a,forceOnP1:{x:p,y:E},forceOnP2:{x:w,y:C}}}theoreticalForceAt(e,t,n){const r=e*1e-6,a=t*1e-6,s=n*n+this.softeningDistance*this.softeningDistance;return Zi.K_E*Math.abs(r*a)/s}calculateArrowLength(e){if(e<=1e-7)return 0;const t=15,n=160,r=Math.log10(1+e*50)*38;return Math.min(n,Math.max(t,r))}static formatForce(e){return e<1e-9?"0.00 N":e<.001?`${(e*1e6).toFixed(2)} μN (${e.toExponential(2)} N)`:e<1?`${(e*1e3).toFixed(2)} mN (${e.toFixed(3)} N)`:e<1e3?`${e.toFixed(3)} N`:`${e.toExponential(2)} N`}static formatDistance(e){return e<.1?`${(e*100).toFixed(1)} cm`:`${e.toFixed(2)} m`}calculateElectricField(e,t,n){let r=0,a=0;for(const o of n){if(Math.abs(o.q)<1e-6)continue;const l=e-o.x,c=t-o.y,h=Math.sqrt(l*l+c*c),u=h/this.pixelsPerMeter,f=u*u+this.softeningDistance*this.softeningDistance,g=o.q*1e-6,x=Zi.K_E*g/f,_=Math.max(.1,h),m=l/_,p=c/_;r+=x*m,a+=x*p}const s=Math.hypot(r,a);return{ex:r,ey:a,magnitude:s}}calculateFieldLines(e,t,n){const r=[],a=e.filter(u=>Math.abs(u.q)>.05);if(a.length===0)return r;const s=a.filter(u=>u.q>0),o=a.filter(u=>u.q<0),l=4,c=240,h=(u,f,g)=>{const x=[{x:u,y:f}];let _=u,m=f;for(let p=0;p<c;p++){const E=this.calculateElectricField(_,m,a);if(E.magnitude<1e-5)break;const w=E.ex/E.magnitude*g,C=E.ey/E.magnitude*g,F=_+w*(l*.5),I=m+C*(l*.5),P=this.calculateElectricField(F,I,a),B=Math.hypot(P.ex,P.ey);if(B<1e-5)break;const ee=P.ex/B*g,b=P.ey/B*g;if(_+=ee*l,m+=b*l,x.push({x:_,y:m}),_<-40||_>t+40||m<-40||m>n+40)break;let A=!1;for(const W of a)if(Math.hypot(_-W.x,m-W.y)<=W.radius+3){A=!0;break}if(A)break}return x};for(const u of s){const f=Math.min(24,Math.max(8,Math.round(u.q*4)));for(let g=0;g<f;g++){const x=g/f*Math.PI*2,_=u.x+Math.cos(x)*(u.radius+3),m=u.y+Math.sin(x)*(u.radius+3),p=h(_,m,1);p.length>2&&r.push(p)}}if(s.length===0)for(const u of o){const f=Math.min(24,Math.max(8,Math.round(Math.abs(u.q)*4)));for(let g=0;g<f;g++){const x=g/f*Math.PI*2,_=u.x+Math.cos(x)*(u.radius+3),m=u.y+Math.sin(x)*(u.radius+3),p=h(_,m,-1);p.length>2&&(p.reverse(),r.push(p))}}return r}calculatePotential(e,t,n){let r=0;for(const a of n){if(Math.abs(a.q)<1e-6)continue;const s=e-a.x,o=t-a.y,c=Math.sqrt(s*s+o*o)/this.pixelsPerMeter,h=Math.sqrt(c*c+this.softeningDistance*this.softeningDistance),u=a.q*1e-6;r+=Zi.K_E*u/h}return r}calculatePotentialHeight(e,t,n){let r=0;for(const a of n){if(Math.abs(a.q)<1e-6)continue;const s=e-a.x,o=t-a.y,c=Math.sqrt(s*s+o*o)/this.pixelsPerMeter,h=Math.sqrt(c*c+.08*.08);r+=a.q*18/h}return Math.max(-120,Math.min(120,r))}};me(Zi,"K_E",89875517923e-1);let li=Zi;class zd{constructor(e,t,n=.5){me(this,"x");me(this,"y");me(this,"vx",0);me(this,"vy",0);me(this,"q");me(this,"mass",.001);me(this,"trail",[]);me(this,"maxTrail",30);me(this,"isAlive",!0);me(this,"radius",7);this.x=e,this.y=t,this.q=n}update(e,t,n,r,a){if(!this.isAlive)return;const s=t.calculateElectricField(this.x,this.y,n),o=this.q*1e-6,l=o*s.ex,c=o*s.ey,h=l/this.mass*t.pixelsPerMeter,u=c/this.mass*t.pixelsPerMeter,f=Math.hypot(h,u),g=2400,x=f>g?g/f:1,_=.96;this.vx=(this.vx+h*x*e)*_,this.vy=(this.vy+u*x*e)*_;const m=Math.hypot(this.vx,this.vy),p=200;m>p&&(this.vx=this.vx/m*p,this.vy=this.vy/m*p),this.x+=this.vx*e,this.y+=this.vy*e,this.trail.push({x:this.x,y:this.y}),this.trail.length>this.maxTrail&&this.trail.shift();const E=60;(this.x<-E||this.x>r+E||this.y<-E||this.y>a+E)&&(this.isAlive=!1);for(const w of n)if(Math.hypot(this.x-w.x,this.y-w.y)<=w.radius+2){this.isAlive=!1;break}}}class Hd{constructor(e,t){me(this,"canvas");me(this,"ctx");me(this,"engine");me(this,"particles",[]);me(this,"activeDraggedParticle",null);me(this,"dragOffset",{x:0,y:0});me(this,"dpr",window.devicePixelRatio||1);me(this,"showGrid",!0);me(this,"showVectors",!0);me(this,"showEFieldGrid",!1);me(this,"showFieldLines",!0);me(this,"testParticles",[]);me(this,"testChargeSign",1);me(this,"animationRunning",!1);me(this,"lastTimestamp",0);me(this,"onStateChange");me(this,"onAnimationTick");this.canvas=e;const n=e.getContext("2d");if(!n)throw new Error("Failed to get 2D canvas context");this.ctx=n,this.engine=t,this.setupEvents(),this.handleResize(),window.addEventListener("resize",()=>this.handleResize())}setParticles(e){this.particles=e}fitParticlesToViewport(e=.28,t=.72,n=.52){var o;if(this.particles.length<2)return;const r=(o=this.canvas.parentElement)==null?void 0:o.getBoundingClientRect(),a=r&&r.width>0?r.width:this.canvas.width/this.dpr||600,s=r&&r.height>0?r.height:this.canvas.height/this.dpr||400;this.particles[0].x=a*e,this.particles[0].y=s*n,this.particles[1].x=a*t,this.particles[1].y=s*n,this.render()}clampParticles(){const e=this.canvas.width/this.dpr,t=this.canvas.height/this.dpr;if(!(e<=0||t<=0))for(const n of this.particles){const r=n.radius+15;n.x=Math.max(r,Math.min(e-r,n.x)),n.y=Math.max(r,Math.min(t-r,n.y))}}handleResize(){var t;const e=(t=this.canvas.parentElement)==null?void 0:t.getBoundingClientRect();e&&(this.dpr=window.devicePixelRatio||1,this.canvas.width=e.width*this.dpr,this.canvas.height=e.height*this.dpr,this.canvas.style.width=`${e.width}px`,this.canvas.style.height=`${e.height}px`,this.clampParticles(),this.render())}setupEvents(){const e=n=>{const r=this.canvas.getBoundingClientRect();return{x:n.clientX-r.left,y:n.clientY-r.top}};this.canvas.addEventListener("pointerdown",n=>{const r=e(n);let a=!1;for(const s of this.particles){const o=r.x-s.x,l=r.y-s.y;if(Math.hypot(o,l)<=s.radius+10){a=!0,this.activeDraggedParticle=s,s.isDragging=!0,this.dragOffset={x:o,y:l},this.canvas.setPointerCapture(n.pointerId),this.canvas.style.cursor="grabbing",this.render();break}}!a&&(n.shiftKey||n.altKey)&&this.spawnTestParticle(r.x,r.y)}),this.canvas.addEventListener("pointermove",n=>{const r=e(n);if(this.activeDraggedParticle){const a=this.activeDraggedParticle,s=this.canvas.width/this.dpr,o=this.canvas.height/this.dpr,l=a.radius+15;a.x=Math.max(l,Math.min(s-l,r.x-this.dragOffset.x)),a.y=Math.max(l,Math.min(o-l,r.y-this.dragOffset.y)),this.render(),this.onStateChange&&this.onStateChange()}else{let a=!1;for(const s of this.particles){const o=r.x-s.x,l=r.y-s.y,c=Math.hypot(o,l)<=s.radius+8;s.isHovered!==c&&(s.isHovered=c),c&&(a=!0)}this.canvas.style.cursor=a?"grab":"crosshair",this.render()}});const t=n=>{if(this.activeDraggedParticle){this.activeDraggedParticle.isDragging=!1,this.activeDraggedParticle=null;try{this.canvas.releasePointerCapture(n.pointerId)}catch{}this.canvas.style.cursor="grab",this.render(),this.onStateChange&&this.onStateChange()}};this.canvas.addEventListener("pointerup",t),this.canvas.addEventListener("pointercancel",t)}spawnTestParticle(e,t,n){const r=this.canvas.width/this.dpr,a=this.canvas.height/this.dpr,s=e??r*.5+(Math.random()-.5)*60,o=t??a*.35+(Math.random()-.5)*60,l=n??this.testChargeSign*.4,c=new zd(s,o,l);this.testParticles.push(c),this.ensureAnimationRunning(),this.render()}clearTestParticles(){this.testParticles=[],this.render()}ensureAnimationRunning(){this.animationRunning||(this.animationRunning=!0,this.lastTimestamp=performance.now(),requestAnimationFrame(e=>this.animationStep(e)))}animationStep(e){if(!this.animationRunning)return;const t=Math.min(.05,(e-this.lastTimestamp)/1e3);this.lastTimestamp=e;const n=this.canvas.width/this.dpr,r=this.canvas.height/this.dpr;for(const a of this.testParticles)a.update(t,this.engine,this.particles,n,r);this.testParticles=this.testParticles.filter(a=>a.isAlive),this.render(),this.onAnimationTick&&this.onAnimationTick(),this.testParticles.length>0?requestAnimationFrame(a=>this.animationStep(a)):(this.animationRunning=!1,this.onAnimationTick&&this.onAnimationTick())}render(){const e=this.ctx,t=this.canvas.width/this.dpr,n=this.canvas.height/this.dpr;if(e.save(),e.scale(this.dpr,this.dpr),e.clearRect(0,0,t,n),this.showGrid&&this.drawGrid(e,t,n),this.showEFieldGrid&&this.drawEFieldGrid(e,t,n),this.showFieldLines&&this.drawFieldLines(e,t,n),this.particles.length>=2){const r=this.particles[0],a=this.particles[1],s=this.engine.calculateForce(r,a);this.drawDistanceIndicator(e,r,a,s),this.showVectors&&this.drawForceVectors(e,r,a,s)}for(const r of this.particles)this.drawParticle(e,r);this.drawTestParticles(e),e.restore()}drawEFieldGrid(e,t,n){e.save();for(let s=36*.5;s<t;s+=36)for(let o=36*.5;o<n;o+=36){let l=!1;for(const I of this.particles)if(Math.hypot(s-I.x,o-I.y)<I.radius+6){l=!0;break}if(l)continue;const c=this.engine.calculateElectricField(s,o,this.particles);if(c.magnitude<1e-4)continue;const h=c.ex/c.magnitude,u=c.ey/c.magnitude,f=Math.min(1,Math.max(.12,Math.log10(1+c.magnitude/500)/4)),g=Math.min(.85,Math.max(.18,f));let x=`rgba(56, 189, 248, ${g})`;f>.65?x=`rgba(251, 191, 36, ${g})`:f>.45&&(x=`rgba(52, 211, 153, ${g})`),e.strokeStyle=x,e.fillStyle=x,e.lineWidth=1.2;const _=14*.5,m=s-h*_,p=o-u*_,E=s+h*_,w=o+u*_;e.beginPath(),e.moveTo(m,p),e.lineTo(E,w),e.stroke();const C=4,F=Math.atan2(u,h);e.beginPath(),e.moveTo(E,w),e.lineTo(E-C*Math.cos(F-Math.PI/5),w-C*Math.sin(F-Math.PI/5)),e.lineTo(E-C*Math.cos(F+Math.PI/5),w-C*Math.sin(F+Math.PI/5)),e.closePath(),e.fill()}e.restore()}drawFieldLines(e,t,n){const r=this.engine.calculateFieldLines(this.particles,t,n);if(r.length!==0){e.save(),e.lineWidth=1.4,e.strokeStyle="rgba(147, 197, 253, 0.45)",e.shadowColor="rgba(96, 165, 250, 0.3)",e.shadowBlur=4;for(const a of r){if(a.length<2)continue;e.beginPath(),e.moveTo(a[0].x,a[0].y);for(let o=1;o<a.length;o++)e.lineTo(a[o].x,a[o].y);e.stroke();const s=Math.floor(a.length*.45);if(s>0&&s<a.length-1){const o=a[s-1],l=a[s],c=a[s+1],h=c.x-o.x,u=c.y-o.y,f=Math.atan2(u,h),g=7;e.fillStyle="rgba(191, 219, 254, 0.85)",e.beginPath(),e.moveTo(l.x,l.y),e.lineTo(l.x-g*Math.cos(f-Math.PI/5),l.y-g*Math.sin(f-Math.PI/5)),e.lineTo(l.x-g*Math.cos(f+Math.PI/5),l.y-g*Math.sin(f+Math.PI/5)),e.closePath(),e.fill()}}e.restore()}}drawTestParticles(e){if(this.testParticles.length!==0){e.save();for(const t of this.testParticles){const n=t.q>0,r=n?"#f87171":"#60a5fa",a=n?"rgba(248, 113, 113,":"rgba(96, 165, 250,";if(t.trail.length>1)for(let s=1;s<t.trail.length;s++){const o=s/t.trail.length*.6;e.strokeStyle=`${a} ${o})`,e.lineWidth=s/t.trail.length*3,e.beginPath(),e.moveTo(t.trail[s-1].x,t.trail[s-1].y),e.lineTo(t.trail[s].x,t.trail[s].y),e.stroke()}e.shadowColor=r,e.shadowBlur=8,e.fillStyle=r,e.beginPath(),e.arc(t.x,t.y,t.radius,0,Math.PI*2),e.fill(),e.fillStyle="#ffffff",e.beginPath(),e.arc(t.x,t.y,t.radius*.45,0,Math.PI*2),e.fill()}e.restore()}}drawGrid(e,t,n){const r=this.engine.pixelsPerMeter*.5;e.save(),e.strokeStyle="rgba(255, 255, 255, 0.04)",e.lineWidth=1;for(let l=0;l<=t;l+=r)e.beginPath(),e.moveTo(l,0),e.lineTo(l,n),e.stroke();for(let l=0;l<=n;l+=r)e.beginPath(),e.moveTo(0,l),e.lineTo(t,l),e.stroke();const a=this.engine.pixelsPerMeter,s=n-20,o=24;e.strokeStyle="rgba(255, 255, 255, 0.7)",e.lineWidth=2,e.beginPath(),e.moveTo(o,s),e.lineTo(o+a,s),e.moveTo(o,s-4),e.lineTo(o,s+4),e.moveTo(o+a,s-4),e.lineTo(o+a,s+4),e.stroke(),e.fillStyle="#e2e8f0",e.font='bold 11px "JetBrains Mono", monospace',e.fillText("1.0 m",o+a/2-14,s-8),e.restore()}drawDistanceIndicator(e,t,n,r){e.save(),e.beginPath(),e.setLineDash([5,5]),e.strokeStyle="rgba(255, 255, 255, 0.25)",e.lineWidth=1.5,e.moveTo(t.x,t.y),e.lineTo(n.x,n.y),e.stroke(),e.setLineDash([]);const a=(t.x+n.x)/2,s=(t.y+n.y)/2,o=`r = ${li.formatDistance(r.distanceMeters)}`;e.font='bold 12px "JetBrains Mono", monospace';const c=e.measureText(o).width+18,h=24;e.fillStyle="rgba(11, 15, 25, 0.92)",e.strokeStyle="#475569",e.lineWidth=1.5;const u=a-c/2,f=s-h/2;e.beginPath(),e.roundRect(u,f,c,h,4),e.fill(),e.stroke(),e.fillStyle="#ffffff",e.textAlign="center",e.textBaseline="middle",e.fillText(o,a,s),e.restore()}drawForceVectors(e,t,n,r){if(r.magnitude<1e-9)return;e.save();const a=r.isAttraction?"#f59e0b":"#38bdf8",s=li.formatForce(r.magnitude),o=Math.atan2(r.forceOnP1.y,r.forceOnP1.x),l=t.x+Math.cos(o)*(t.radius+3),c=t.y+Math.sin(o)*(t.radius+3),h=l+r.forceOnP1.x,u=c+r.forceOnP1.y;this.drawArrow(e,l,c,h,u,a),this.drawForceLabel(e,t,`F₁₂ = ${s}`,a,o);const f=Math.atan2(r.forceOnP2.y,r.forceOnP2.x),g=n.x+Math.cos(f)*(n.radius+3),x=n.y+Math.sin(f)*(n.radius+3),_=g+r.forceOnP2.x,m=x+r.forceOnP2.y;this.drawArrow(e,g,x,_,m,a),this.drawForceLabel(e,n,`F₂₁ = ${s}`,a,f),e.restore()}drawArrow(e,t,n,r,a,s){const l=r-t,c=a-n,h=Math.atan2(c,l);Math.hypot(l,c)<8||(e.shadowColor=s,e.shadowBlur=10,e.strokeStyle=s,e.fillStyle=s,e.lineWidth=3.5,e.lineCap="round",e.beginPath(),e.moveTo(t,n),e.lineTo(r,a),e.stroke(),e.beginPath(),e.moveTo(r,a),e.lineTo(r-14*Math.cos(h-Math.PI/6),a-14*Math.sin(h-Math.PI/6)),e.lineTo(r-14*Math.cos(h+Math.PI/6),a-14*Math.sin(h+Math.PI/6)),e.closePath(),e.fill(),e.shadowBlur=0)}drawForceLabel(e,t,n,r,a){const s=Math.sin(a)>.8,o=s?t.x+t.radius+32:t.x,l=s?t.y:t.y+t.radius+18;e.font='bold 11px "JetBrains Mono", monospace';const c=e.measureText(n).width+12;e.fillStyle="rgba(11, 15, 25, 0.92)",e.strokeStyle=r,e.lineWidth=1,e.beginPath(),e.roundRect(o-c/2,l-9,c,18,4),e.fill(),e.stroke(),e.fillStyle=r,e.textAlign="center",e.fillText(n,o,l+4)}drawParticle(e,t){e.save();const n=t.isPositive,r=t.isNegative;let a="#94a3b8",s="rgba(148, 163, 184, 0.4)";n?(a="#ef4444",s="rgba(239, 68, 68, 0.5)"):r&&(a="#3b82f6",s="rgba(59, 130, 246, 0.5)"),(t.isDragging||t.isHovered)&&(e.beginPath(),e.arc(t.x,t.y,t.radius+8,0,Math.PI*2),e.fillStyle=t.isDragging?s:"rgba(255, 255, 255, 0.15)",e.fill());const o=e.createRadialGradient(t.x,t.y,t.radius*.5,t.x,t.y,t.radius*2);o.addColorStop(0,s),o.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=o,e.beginPath(),e.arc(t.x,t.y,t.radius*2,0,Math.PI*2),e.fill();const l=e.createRadialGradient(t.x-t.radius*.3,t.y-t.radius*.3,t.radius*.1,t.x,t.y,t.radius);l.addColorStop(0,"#ffffff"),l.addColorStop(.3,a),l.addColorStop(1,this.darkenColor(a,.5)),e.fillStyle=l,e.beginPath(),e.arc(t.x,t.y,t.radius,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(255, 255, 255, 0.6)",e.lineWidth=1.5,e.stroke(),e.fillStyle="#ffffff",e.font='bold 22px "Inter", sans-serif',e.textAlign="center",e.textBaseline="middle";const c=n?"+":r?"−":"0";e.fillText(c,t.x,t.y),e.font='bold 11px "JetBrains Mono", monospace';const h=`${t.id}: ${t.q>0?"+":""}${t.q.toFixed(1)} μC`,u=e.measureText(h).width+12,f=t.y-t.radius-14;e.fillStyle="rgba(11, 15, 25, 0.92)",e.strokeStyle=n?"rgba(239, 68, 68, 0.6)":r?"rgba(59, 130, 246, 0.6)":"rgba(255, 255, 255, 0.25)",e.lineWidth=1,e.beginPath(),e.roundRect(t.x-u/2,f-9,u,18,4),e.fill(),e.stroke(),e.fillStyle=n?"#fecaca":r?"#bfdbfe":"#ffffff",e.fillText(h,t.x,f),e.restore()}darkenColor(e,t){if(e.startsWith("#")){const n=parseInt(e.slice(1),16),r=Math.floor((n>>16&255)*t),a=Math.floor((n>>8&255)*t),s=Math.floor((n&255)*t);return`rgb(${r}, ${a}, ${s})`}return e}}class Gd{constructor(e,t){me(this,"canvas");me(this,"ctx");me(this,"engine");me(this,"dpr",window.devicePixelRatio||1);me(this,"currentR",1);me(this,"currentF",0);me(this,"q1",2);me(this,"q2",-2);this.canvas=e;const n=e.getContext("2d");if(!n)throw new Error("Failed to get 2D canvas context for graph");this.ctx=n,this.engine=t,this.handleResize(),window.addEventListener("resize",()=>this.handleResize())}handleResize(){var t;const e=(t=this.canvas.parentElement)==null?void 0:t.getBoundingClientRect();e&&(this.dpr=window.devicePixelRatio||1,this.canvas.width=e.width*this.dpr,this.canvas.height=e.height*this.dpr,this.canvas.style.width=`${e.width}px`,this.canvas.style.height=`${e.height}px`,this.render())}update(e,t,n,r){this.currentR=e,this.currentF=t,this.q1=n,this.q2=r,this.render()}render(){const e=this.ctx,t=this.canvas.width/this.dpr,n=this.canvas.height/this.dpr;e.save(),e.scale(this.dpr,this.dpr),e.clearRect(0,0,t,n);const r=70,a=16,s=22,o=30,l=t-r-a,c=n-s-o;if(l<=0||c<=0){e.restore();return}const h=.15,u=3,f=Math.max(1e-4,this.engine.theoreticalForceAt(this.q1,this.q2,.4)),g=Math.max(this.currentF*1.3,f*1.5),x=p=>r+(p-h)/(u-h)*l,_=p=>s+c-Math.min(p,g)/g*c;e.strokeStyle="rgba(255, 255, 255, 0.08)",e.lineWidth=1,e.font='10px "JetBrains Mono", monospace',e.fillStyle="#94a3b8",e.textAlign="center";for(let p=.5;p<=u;p+=.5){const E=x(p);E>=r&&E<=r+l&&(e.beginPath(),e.moveTo(E,s),e.lineTo(E,s+c),e.stroke(),e.fillText(`${p.toFixed(1)}m`,E,n-o+16))}e.textAlign="right";for(let p=1;p<=3;p++){const E=g/4*p,w=_(E);e.beginPath(),e.moveTo(r,w),e.lineTo(r+l,w),e.stroke(),e.fillText(li.formatForce(E),r-6,w+3)}if(e.strokeStyle="#475569",e.lineWidth=1.5,e.beginPath(),e.moveTo(r,s),e.lineTo(r,s+c),e.lineTo(r+l,s+c),e.stroke(),e.fillStyle="#cbd5e1",e.font='600 10px "Inter", sans-serif',e.textAlign="right",e.fillText("距離 r [m] →",r+l,s+c-6),e.textAlign="left",e.fillText("力 F [N] ↑",r-12,s-6),Math.abs(this.q1*this.q2)>1e-4){e.beginPath(),e.strokeStyle="#38bdf8",e.lineWidth=2.5;const p=60;let E=!0;for(let C=0;C<=p;C++){const F=h+C/p*(u-h),I=this.engine.theoreticalForceAt(this.q1,this.q2,F),P=x(F),B=_(I);E?(e.moveTo(P,B),E=!1):e.lineTo(P,B)}e.stroke(),e.lineTo(r+l,s+c),e.lineTo(x(h),s+c),e.closePath();const w=e.createLinearGradient(0,s,0,s+c);w.addColorStop(0,"rgba(56, 189, 248, 0.15)"),w.addColorStop(1,"rgba(56, 189, 248, 0.0)"),e.fillStyle=w,e.fill()}if(this.currentR>=h&&this.currentR<=u){const p=x(this.currentR),E=_(this.currentF);e.setLineDash([3,3]),e.strokeStyle="rgba(245, 158, 11, 0.5)",e.lineWidth=1,e.beginPath(),e.moveTo(p,E),e.lineTo(p,s+c),e.moveTo(p,E),e.lineTo(r,E),e.stroke(),e.setLineDash([]),e.shadowColor="#f59e0b",e.shadowBlur=8,e.fillStyle="#f59e0b",e.beginPath(),e.arc(p,E,5.5,0,Math.PI*2),e.fill(),e.shadowBlur=0,e.fillStyle="#ffffff",e.beginPath(),e.arc(p,E,2.5,0,Math.PI*2),e.fill();const w=`(${this.currentR.toFixed(2)}m, ${li.formatForce(this.currentF)})`;e.font='10px "JetBrains Mono", monospace';const C=e.measureText(w).width+12,F=Math.min(r+l-C,Math.max(r,p-C/2)),I=Math.max(s+4,E-14);e.fillStyle="rgba(15, 23, 42, 0.9)",e.strokeStyle="#f59e0b",e.lineWidth=1,e.beginPath(),e.roundRect(F,I-12,C,16,4),e.fill(),e.stroke(),e.fillStyle="#fef3c7",e.textAlign="left",e.fillText(w,F+6,I)}e.restore()}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const fl="169",Rr={ROTATE:0,DOLLY:1,PAN:2},Tr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Vd=0,Ql=1,qd=2,nu=1,Wd=2,ei=3,Ci=0,hn=1,Hn=2,Ti=0,Pr=1,ec=2,tc=3,nc=4,Xd=5,Yi=100,$d=101,Yd=102,jd=103,Kd=104,Zd=200,Jd=201,Qd=202,ef=203,n0=204,i0=205,tf=206,nf=207,rf=208,af=209,sf=210,of=211,lf=212,cf=213,hf=214,r0=0,a0=1,s0=2,Ur=3,o0=4,l0=5,c0=6,h0=7,iu=0,uf=1,df=2,Ai=0,ff=1,pf=2,mf=3,gf=4,vf=5,xf=6,_f=7,ru=300,Fr=301,Or=302,u0=303,d0=304,Ds=306,f0=1e3,Ji=1001,p0=1002,wn=1003,yf=1004,Ta=1005,In=1006,Ks=1007,Qi=1008,ci=1009,au=1010,su=1011,ua=1012,pl=1013,rr=1014,ii=1015,va=1016,ml=1017,gl=1018,kr=1020,ou=35902,lu=1021,cu=1022,Un=1023,hu=1024,uu=1025,Dr=1026,Br=1027,du=1028,vl=1029,fu=1030,xl=1031,_l=1033,cs=33776,hs=33777,us=33778,ds=33779,m0=35840,g0=35841,v0=35842,x0=35843,_0=36196,y0=37492,b0=37496,M0=37808,S0=37809,w0=37810,E0=37811,T0=37812,A0=37813,C0=37814,R0=37815,P0=37816,D0=37817,L0=37818,I0=37819,N0=37820,U0=37821,fs=36492,F0=36494,O0=36495,pu=36283,k0=36284,B0=36285,z0=36286,bf=3200,Mf=3201,mu=0,Sf=1,wi="",kn="srgb",Ni="srgb-linear",yl="display-p3",Ls="display-p3-linear",ys="linear",Mt="srgb",bs="rec709",Ms="p3",hr=7680,ic=519,wf=512,Ef=513,Tf=514,gu=515,Af=516,Cf=517,Rf=518,Pf=519,rc=35044,ac="300 es",ri=2e3,Ss=2001;class or{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let a=0,s=r.length;a<s;a++)r[a].call(this,e);e.target=null}}}const $t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ps=Math.PI/180,H0=180/Math.PI;function xa(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return($t[i&255]+$t[i>>8&255]+$t[i>>16&255]+$t[i>>24&255]+"-"+$t[e&255]+$t[e>>8&255]+"-"+$t[e>>16&15|64]+$t[e>>24&255]+"-"+$t[t&63|128]+$t[t>>8&255]+"-"+$t[t>>16&255]+$t[t>>24&255]+$t[n&255]+$t[n>>8&255]+$t[n>>16&255]+$t[n>>24&255]).toLowerCase()}function en(i,e,t){return Math.max(e,Math.min(t,i))}function Df(i,e){return(i%e+e)%e}function Zs(i,e,t){return(1-t)*i+t*e}function Zr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function on(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Lf={DEG2RAD:ps};class Ke{constructor(e=0,t=0){Ke.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(en(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),a=this.x-e.x,s=this.y-e.y;return this.x=a*n-s*r+e.x,this.y=a*r+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Je{constructor(e,t,n,r,a,s,o,l,c){Je.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,s,o,l,c)}set(e,t,n,r,a,s,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=n,h[7]=s,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,s=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],g=n[5],x=n[8],_=r[0],m=r[3],p=r[6],E=r[1],w=r[4],C=r[7],F=r[2],I=r[5],P=r[8];return a[0]=s*_+o*E+l*F,a[3]=s*m+o*w+l*I,a[6]=s*p+o*C+l*P,a[1]=c*_+h*E+u*F,a[4]=c*m+h*w+u*I,a[7]=c*p+h*C+u*P,a[2]=f*_+g*E+x*F,a[5]=f*m+g*w+x*I,a[8]=f*p+g*C+x*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*s*h-t*o*c-n*a*h+n*o*l+r*a*c-r*s*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*s-o*c,f=o*l-h*a,g=c*a-s*l,x=t*u+n*f+r*g;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=u*_,e[1]=(r*c-h*n)*_,e[2]=(o*n-r*s)*_,e[3]=f*_,e[4]=(h*t-r*l)*_,e[5]=(r*a-o*t)*_,e[6]=g*_,e[7]=(n*l-c*t)*_,e[8]=(s*t-n*a)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,a,s,o){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*s+c*o)+s+e,-r*c,r*l,-r*(-c*s+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Js.makeScale(e,t)),this}rotate(e){return this.premultiply(Js.makeRotation(-e)),this}translate(e,t){return this.premultiply(Js.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Js=new Je;function vu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ws(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function If(){const i=ws("canvas");return i.style.display="block",i}const sc={};function ms(i){i in sc||(sc[i]=!0,console.warn(i))}function Nf(i,e,t){return new Promise(function(n,r){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}function Uf(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Ff(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const oc=new Je().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),lc=new Je().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Jr={[Ni]:{transfer:ys,primaries:bs,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[kn]:{transfer:Mt,primaries:bs,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Ls]:{transfer:ys,primaries:Ms,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(lc),fromReference:i=>i.applyMatrix3(oc)},[yl]:{transfer:Mt,primaries:Ms,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(lc),fromReference:i=>i.applyMatrix3(oc).convertLinearToSRGB()}},Of=new Set([Ni,Ls]),mt={enabled:!0,_workingColorSpace:Ni,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Of.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Jr[e].toReference,r=Jr[t].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Jr[i].primaries},getTransfer:function(i){return i===wi?ys:Jr[i].transfer},getLuminanceCoefficients:function(i,e=this._workingColorSpace){return i.fromArray(Jr[e].luminanceCoefficients)}};function Lr(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Qs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ur;class kf{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ur===void 0&&(ur=ws("canvas")),ur.width=e.width,ur.height=e.height;const n=ur.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ur}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ws("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),a=r.data;for(let s=0;s<a.length;s++)a[s]=Lr(a[s]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Lr(t[n]/255)*255):t[n]=Lr(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Bf=0;class xu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=xa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let s=0,o=r.length;s<o;s++)r[s].isDataTexture?a.push(eo(r[s].image)):a.push(eo(r[s]))}else a=eo(r);n.url=a}return t||(e.images[this.uuid]=n),n}}function eo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?kf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let zf=0;class un extends or{constructor(e=un.DEFAULT_IMAGE,t=un.DEFAULT_MAPPING,n=Ji,r=Ji,a=In,s=Qi,o=Un,l=ci,c=un.DEFAULT_ANISOTROPY,h=wi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=xa(),this.name="",this.source=new xu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=a,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ke(0,0),this.repeat=new Ke(1,1),this.center=new Ke(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ru)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case f0:e.x=e.x-Math.floor(e.x);break;case Ji:e.x=e.x<0?0:1;break;case p0:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case f0:e.y=e.y-Math.floor(e.y);break;case Ji:e.y=e.y<0?0:1;break;case p0:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=ru;un.DEFAULT_ANISOTROPY=1;class Pt{constructor(e=0,t=0,n=0,r=1){Pt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r+s[12]*a,this.y=s[1]*t+s[5]*n+s[9]*r+s[13]*a,this.z=s[2]*t+s[6]*n+s[10]*r+s[14]*a,this.w=s[3]*t+s[7]*n+s[11]*r+s[15]*a,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,a;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],g=l[5],x=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(x+m)<.1&&Math.abs(c+g+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,C=(g+1)/2,F=(p+1)/2,I=(h+f)/4,P=(u+_)/4,B=(x+m)/4;return w>C&&w>F?w<.01?(n=0,r=.707106781,a=.707106781):(n=Math.sqrt(w),r=I/n,a=P/n):C>F?C<.01?(n=.707106781,r=0,a=.707106781):(r=Math.sqrt(C),n=I/r,a=B/r):F<.01?(n=.707106781,r=.707106781,a=0):(a=Math.sqrt(F),n=P/a,r=B/a),this.set(n,r,a,t),this}let E=Math.sqrt((m-x)*(m-x)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(E)<.001&&(E=1),this.x=(m-x)/E,this.y=(u-_)/E,this.z=(f-h)/E,this.w=Math.acos((c+g+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Hf extends or{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Pt(0,0,e,t),this.scissorTest=!1,this.viewport=new Pt(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:In,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new un(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const s=n.count;for(let o=0;o<s;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new xu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ar extends Hf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class _u extends un{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=wn,this.minFilter=wn,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Gf extends un{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=wn,this.minFilter=wn,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sr{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,a,s,o){let l=n[r+0],c=n[r+1],h=n[r+2],u=n[r+3];const f=a[s+0],g=a[s+1],x=a[s+2],_=a[s+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=g,e[t+2]=x,e[t+3]=_;return}if(u!==_||l!==f||c!==g||h!==x){let m=1-o;const p=l*f+c*g+h*x+u*_,E=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const F=Math.sqrt(w),I=Math.atan2(F,p*E);m=Math.sin(m*I)/F,o=Math.sin(o*I)/F}const C=o*E;if(l=l*m+f*C,c=c*m+g*C,h=h*m+x*C,u=u*m+_*C,m===1-o){const F=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=F,c*=F,h*=F,u*=F}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,a,s){const o=n[r],l=n[r+1],c=n[r+2],h=n[r+3],u=a[s],f=a[s+1],g=a[s+2],x=a[s+3];return e[t]=o*x+h*u+l*g-c*f,e[t+1]=l*x+h*f+c*u-o*g,e[t+2]=c*x+h*g+o*f-l*u,e[t+3]=h*x-o*u-l*f-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,a=e._z,s=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(r/2),u=o(a/2),f=l(n/2),g=l(r/2),x=l(a/2);switch(s){case"XYZ":this._x=f*h*u+c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u-f*g*x;break;case"YXZ":this._x=f*h*u+c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u+f*g*x;break;case"ZXY":this._x=f*h*u-c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u-f*g*x;break;case"ZYX":this._x=f*h*u-c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u+f*g*x;break;case"YZX":this._x=f*h*u+c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u-f*g*x;break;case"XZY":this._x=f*h*u-c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u+f*g*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],a=t[8],s=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){const g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(h-l)*g,this._y=(a-c)*g,this._z=(s-r)*g}else if(n>o&&n>u){const g=2*Math.sqrt(1+n-o-u);this._w=(h-l)/g,this._x=.25*g,this._y=(r+s)/g,this._z=(a+c)/g}else if(o>u){const g=2*Math.sqrt(1+o-n-u);this._w=(a-c)/g,this._x=(r+s)/g,this._y=.25*g,this._z=(l+h)/g}else{const g=2*Math.sqrt(1+u-n-o);this._w=(s-r)/g,this._x=(a+c)/g,this._y=(l+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(en(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,a=e._z,s=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+s*o+r*c-a*l,this._y=r*h+s*l+a*o-n*c,this._z=a*h+s*c+n*l-r*o,this._w=s*h-n*o-r*l-a*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,a=this._z,s=this._w;let o=s*e._w+n*e._x+r*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=s,this._x=n,this._y=r,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const g=1-t;return this._w=g*s+t*this._w,this._x=g*n+t*this._x,this._y=g*r+t*this._y,this._z=g*a+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=s*u+this._w*f,this._x=n*u+this._x*f,this._y=r*u+this._y*f,this._z=a*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,t=0,n=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(cc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(cc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*r,this.y=a[1]*t+a[4]*n+a[7]*r,this.z=a[2]*t+a[5]*n+a[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=e.elements,s=1/(a[3]*t+a[7]*n+a[11]*r+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*r+a[12])*s,this.y=(a[1]*t+a[5]*n+a[9]*r+a[13])*s,this.z=(a[2]*t+a[6]*n+a[10]*r+a[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,a=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*r-o*n),h=2*(o*t-a*r),u=2*(a*n-s*t);return this.x=t+l*c+s*u-o*h,this.y=n+l*h+o*c-a*u,this.z=r+l*u+a*h-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r,this.y=a[1]*t+a[5]*n+a[9]*r,this.z=a[2]*t+a[6]*n+a[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,a=e.z,s=t.x,o=t.y,l=t.z;return this.x=r*l-a*o,this.y=a*s-n*l,this.z=n*o-r*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return to.copy(this).projectOnVector(e),this.sub(to)}reflect(e){return this.sub(to.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(en(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const to=new H,cc=new sr;class _a{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Pn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=a.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,Pn):Pn.fromBufferAttribute(a,s),Pn.applyMatrix4(e.matrixWorld),this.expandByPoint(Pn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Aa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Aa.copy(n.boundingBox)),Aa.applyMatrix4(e.matrixWorld),this.union(Aa)}const r=e.children;for(let a=0,s=r.length;a<s;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pn),Pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qr),Ca.subVectors(this.max,Qr),dr.subVectors(e.a,Qr),fr.subVectors(e.b,Qr),pr.subVectors(e.c,Qr),mi.subVectors(fr,dr),gi.subVectors(pr,fr),Oi.subVectors(dr,pr);let t=[0,-mi.z,mi.y,0,-gi.z,gi.y,0,-Oi.z,Oi.y,mi.z,0,-mi.x,gi.z,0,-gi.x,Oi.z,0,-Oi.x,-mi.y,mi.x,0,-gi.y,gi.x,0,-Oi.y,Oi.x,0];return!no(t,dr,fr,pr,Ca)||(t=[1,0,0,0,1,0,0,0,1],!no(t,dr,fr,pr,Ca))?!1:(Ra.crossVectors(mi,gi),t=[Ra.x,Ra.y,Ra.z],no(t,dr,fr,pr,Ca))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Yn=[new H,new H,new H,new H,new H,new H,new H,new H],Pn=new H,Aa=new _a,dr=new H,fr=new H,pr=new H,mi=new H,gi=new H,Oi=new H,Qr=new H,Ca=new H,Ra=new H,ki=new H;function no(i,e,t,n,r){for(let a=0,s=i.length-3;a<=s;a+=3){ki.fromArray(i,a);const o=r.x*Math.abs(ki.x)+r.y*Math.abs(ki.y)+r.z*Math.abs(ki.z),l=e.dot(ki),c=t.dot(ki),h=n.dot(ki);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Vf=new _a,ea=new H,io=new H;class Is{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Vf.setFromPoints(e).getCenter(n);let r=0;for(let a=0,s=e.length;a<s;a++)r=Math.max(r,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ea.subVectors(e,this.center);const t=ea.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(ea,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(io.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ea.copy(e.center).add(io)),this.expandByPoint(ea.copy(e.center).sub(io))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const jn=new H,ro=new H,Pa=new H,vi=new H,ao=new H,Da=new H,so=new H;class bl{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,jn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=jn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(jn.copy(this.origin).addScaledVector(this.direction,t),jn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ro.copy(e).add(t).multiplyScalar(.5),Pa.copy(t).sub(e).normalize(),vi.copy(this.origin).sub(ro);const a=e.distanceTo(t)*.5,s=-this.direction.dot(Pa),o=vi.dot(this.direction),l=-vi.dot(Pa),c=vi.lengthSq(),h=Math.abs(1-s*s);let u,f,g,x;if(h>0)if(u=s*l-o,f=s*o-l,x=a*h,u>=0)if(f>=-x)if(f<=x){const _=1/h;u*=_,f*=_,g=u*(u+s*f+2*o)+f*(s*u+f+2*l)+c}else f=a,u=Math.max(0,-(s*f+o)),g=-u*u+f*(f+2*l)+c;else f=-a,u=Math.max(0,-(s*f+o)),g=-u*u+f*(f+2*l)+c;else f<=-x?(u=Math.max(0,-(-s*a+o)),f=u>0?-a:Math.min(Math.max(-a,-l),a),g=-u*u+f*(f+2*l)+c):f<=x?(u=0,f=Math.min(Math.max(-a,-l),a),g=f*(f+2*l)+c):(u=Math.max(0,-(s*a+o)),f=u>0?a:Math.min(Math.max(-a,-l),a),g=-u*u+f*(f+2*l)+c);else f=s>0?-a:a,u=Math.max(0,-(s*f+o)),g=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ro).addScaledVector(Pa,f),g}intersectSphere(e,t){jn.subVectors(e.center,this.origin);const n=jn.dot(this.direction),r=jn.dot(jn)-n*n,a=e.radius*e.radius;if(r>a)return null;const s=Math.sqrt(a-r),o=n-s,l=n+s;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,a,s,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),h>=0?(a=(e.min.y-f.y)*h,s=(e.max.y-f.y)*h):(a=(e.max.y-f.y)*h,s=(e.min.y-f.y)*h),n>s||a>r||((a>n||isNaN(n))&&(n=a),(s<r||isNaN(r))&&(r=s),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,jn)!==null}intersectTriangle(e,t,n,r,a){ao.subVectors(t,e),Da.subVectors(n,e),so.crossVectors(ao,Da);let s=this.direction.dot(so),o;if(s>0){if(r)return null;o=1}else if(s<0)o=-1,s=-s;else return null;vi.subVectors(this.origin,e);const l=o*this.direction.dot(Da.crossVectors(vi,Da));if(l<0)return null;const c=o*this.direction.dot(ao.cross(vi));if(c<0||l+c>s)return null;const h=-o*vi.dot(so);return h<0?null:this.at(h/s,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class At{constructor(e,t,n,r,a,s,o,l,c,h,u,f,g,x,_,m){At.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,s,o,l,c,h,u,f,g,x,_,m)}set(e,t,n,r,a,s,o,l,c,h,u,f,g,x,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=a,p[5]=s,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=g,p[7]=x,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new At().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/mr.setFromMatrixColumn(e,0).length(),a=1/mr.setFromMatrixColumn(e,1).length(),s=1/mr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,a=e.z,s=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const f=s*h,g=s*u,x=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=g+x*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=x+g*c,t[10]=s*l}else if(e.order==="YXZ"){const f=l*h,g=l*u,x=c*h,_=c*u;t[0]=f+_*o,t[4]=x*o-g,t[8]=s*c,t[1]=s*u,t[5]=s*h,t[9]=-o,t[2]=g*o-x,t[6]=_+f*o,t[10]=s*l}else if(e.order==="ZXY"){const f=l*h,g=l*u,x=c*h,_=c*u;t[0]=f-_*o,t[4]=-s*u,t[8]=x+g*o,t[1]=g+x*o,t[5]=s*h,t[9]=_-f*o,t[2]=-s*c,t[6]=o,t[10]=s*l}else if(e.order==="ZYX"){const f=s*h,g=s*u,x=o*h,_=o*u;t[0]=l*h,t[4]=x*c-g,t[8]=f*c+_,t[1]=l*u,t[5]=_*c+f,t[9]=g*c-x,t[2]=-c,t[6]=o*l,t[10]=s*l}else if(e.order==="YZX"){const f=s*l,g=s*c,x=o*l,_=o*c;t[0]=l*h,t[4]=_-f*u,t[8]=x*u+g,t[1]=u,t[5]=s*h,t[9]=-o*h,t[2]=-c*h,t[6]=g*u+x,t[10]=f-_*u}else if(e.order==="XZY"){const f=s*l,g=s*c,x=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+_,t[5]=s*h,t[9]=g*u-x,t[2]=x*u-g,t[6]=o*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qf,e,Wf)}lookAt(e,t,n){const r=this.elements;return pn.subVectors(e,t),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),xi.crossVectors(n,pn),xi.lengthSq()===0&&(Math.abs(n.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),xi.crossVectors(n,pn)),xi.normalize(),La.crossVectors(pn,xi),r[0]=xi.x,r[4]=La.x,r[8]=pn.x,r[1]=xi.y,r[5]=La.y,r[9]=pn.y,r[2]=xi.z,r[6]=La.z,r[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,s=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],g=n[13],x=n[2],_=n[6],m=n[10],p=n[14],E=n[3],w=n[7],C=n[11],F=n[15],I=r[0],P=r[4],B=r[8],ee=r[12],b=r[1],A=r[5],W=r[9],X=r[13],K=r[2],te=r[6],$=r[10],ne=r[14],Y=r[3],Se=r[7],ge=r[11],we=r[15];return a[0]=s*I+o*b+l*K+c*Y,a[4]=s*P+o*A+l*te+c*Se,a[8]=s*B+o*W+l*$+c*ge,a[12]=s*ee+o*X+l*ne+c*we,a[1]=h*I+u*b+f*K+g*Y,a[5]=h*P+u*A+f*te+g*Se,a[9]=h*B+u*W+f*$+g*ge,a[13]=h*ee+u*X+f*ne+g*we,a[2]=x*I+_*b+m*K+p*Y,a[6]=x*P+_*A+m*te+p*Se,a[10]=x*B+_*W+m*$+p*ge,a[14]=x*ee+_*X+m*ne+p*we,a[3]=E*I+w*b+C*K+F*Y,a[7]=E*P+w*A+C*te+F*Se,a[11]=E*B+w*W+C*$+F*ge,a[15]=E*ee+w*X+C*ne+F*we,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],a=e[12],s=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],g=e[14],x=e[3],_=e[7],m=e[11],p=e[15];return x*(+a*l*u-r*c*u-a*o*f+n*c*f+r*o*g-n*l*g)+_*(+t*l*g-t*c*f+a*s*f-r*s*g+r*c*h-a*l*h)+m*(+t*c*u-t*o*g-a*s*u+n*s*g+a*o*h-n*c*h)+p*(-r*o*h-t*l*u+t*o*f+r*s*u-n*s*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],g=e[11],x=e[12],_=e[13],m=e[14],p=e[15],E=u*m*c-_*f*c+_*l*g-o*m*g-u*l*p+o*f*p,w=x*f*c-h*m*c-x*l*g+s*m*g+h*l*p-s*f*p,C=h*_*c-x*u*c+x*o*g-s*_*g-h*o*p+s*u*p,F=x*u*l-h*_*l-x*o*f+s*_*f+h*o*m-s*u*m,I=t*E+n*w+r*C+a*F;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/I;return e[0]=E*P,e[1]=(_*f*a-u*m*a-_*r*g+n*m*g+u*r*p-n*f*p)*P,e[2]=(o*m*a-_*l*a+_*r*c-n*m*c-o*r*p+n*l*p)*P,e[3]=(u*l*a-o*f*a-u*r*c+n*f*c+o*r*g-n*l*g)*P,e[4]=w*P,e[5]=(h*m*a-x*f*a+x*r*g-t*m*g-h*r*p+t*f*p)*P,e[6]=(x*l*a-s*m*a-x*r*c+t*m*c+s*r*p-t*l*p)*P,e[7]=(s*f*a-h*l*a+h*r*c-t*f*c-s*r*g+t*l*g)*P,e[8]=C*P,e[9]=(x*u*a-h*_*a-x*n*g+t*_*g+h*n*p-t*u*p)*P,e[10]=(s*_*a-x*o*a+x*n*c-t*_*c-s*n*p+t*o*p)*P,e[11]=(h*o*a-s*u*a-h*n*c+t*u*c+s*n*g-t*o*g)*P,e[12]=F*P,e[13]=(h*_*r-x*u*r+x*n*f-t*_*f-h*n*m+t*u*m)*P,e[14]=(x*o*r-s*_*r-x*n*l+t*_*l+s*n*m-t*o*m)*P,e[15]=(s*u*r-h*o*r+h*n*l-t*u*l-s*n*f+t*o*f)*P,this}scale(e){const t=this.elements,n=e.x,r=e.y,a=e.z;return t[0]*=n,t[4]*=r,t[8]*=a,t[1]*=n,t[5]*=r,t[9]*=a,t[2]*=n,t[6]*=r,t[10]*=a,t[3]*=n,t[7]*=r,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),a=1-n,s=e.x,o=e.y,l=e.z,c=a*s,h=a*o;return this.set(c*s+n,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+n,h*l-r*s,0,c*l-r*o,h*l+r*s,a*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,a,s){return this.set(1,n,a,0,e,1,s,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,a=t._x,s=t._y,o=t._z,l=t._w,c=a+a,h=s+s,u=o+o,f=a*c,g=a*h,x=a*u,_=s*h,m=s*u,p=o*u,E=l*c,w=l*h,C=l*u,F=n.x,I=n.y,P=n.z;return r[0]=(1-(_+p))*F,r[1]=(g+C)*F,r[2]=(x-w)*F,r[3]=0,r[4]=(g-C)*I,r[5]=(1-(f+p))*I,r[6]=(m+E)*I,r[7]=0,r[8]=(x+w)*P,r[9]=(m-E)*P,r[10]=(1-(f+_))*P,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let a=mr.set(r[0],r[1],r[2]).length();const s=mr.set(r[4],r[5],r[6]).length(),o=mr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(a=-a),e.x=r[12],e.y=r[13],e.z=r[14],Dn.copy(this);const c=1/a,h=1/s,u=1/o;return Dn.elements[0]*=c,Dn.elements[1]*=c,Dn.elements[2]*=c,Dn.elements[4]*=h,Dn.elements[5]*=h,Dn.elements[6]*=h,Dn.elements[8]*=u,Dn.elements[9]*=u,Dn.elements[10]*=u,t.setFromRotationMatrix(Dn),n.x=a,n.y=s,n.z=o,this}makePerspective(e,t,n,r,a,s,o=ri){const l=this.elements,c=2*a/(t-e),h=2*a/(n-r),u=(t+e)/(t-e),f=(n+r)/(n-r);let g,x;if(o===ri)g=-(s+a)/(s-a),x=-2*s*a/(s-a);else if(o===Ss)g=-s/(s-a),x=-s*a/(s-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,a,s,o=ri){const l=this.elements,c=1/(t-e),h=1/(n-r),u=1/(s-a),f=(t+e)*c,g=(n+r)*h;let x,_;if(o===ri)x=(s+a)*u,_=-2*u;else if(o===Ss)x=a*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-g,l[2]=0,l[6]=0,l[10]=_,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const mr=new H,Dn=new At,qf=new H(0,0,0),Wf=new H(1,1,1),xi=new H,La=new H,pn=new H,hc=new At,uc=new sr;class Vn{constructor(e=0,t=0,n=0,r=Vn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,a=r[0],s=r[4],o=r[8],l=r[1],c=r[5],h=r[9],u=r[2],f=r[6],g=r[10];switch(t){case"XYZ":this._y=Math.asin(en(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-en(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(en(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,g),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-en(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(en(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-en(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return hc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(hc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return uc.setFromEuler(this),this.setFromQuaternion(uc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Vn.DEFAULT_ORDER="XYZ";class yu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Xf=0;const dc=new H,gr=new sr,Kn=new At,Ia=new H,ta=new H,$f=new H,Yf=new sr,fc=new H(1,0,0),pc=new H(0,1,0),mc=new H(0,0,1),gc={type:"added"},jf={type:"removed"},vr={type:"childadded",child:null},oo={type:"childremoved",child:null};class Xt extends or{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=xa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xt.DEFAULT_UP.clone();const e=new H,t=new Vn,n=new sr,r=new H(1,1,1);function a(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new At},normalMatrix:{value:new Je}}),this.matrix=new At,this.matrixWorld=new At,this.matrixAutoUpdate=Xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new yu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gr.setFromAxisAngle(e,t),this.quaternion.multiply(gr),this}rotateOnWorldAxis(e,t){return gr.setFromAxisAngle(e,t),this.quaternion.premultiply(gr),this}rotateX(e){return this.rotateOnAxis(fc,e)}rotateY(e){return this.rotateOnAxis(pc,e)}rotateZ(e){return this.rotateOnAxis(mc,e)}translateOnAxis(e,t){return dc.copy(e).applyQuaternion(this.quaternion),this.position.add(dc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(fc,e)}translateY(e){return this.translateOnAxis(pc,e)}translateZ(e){return this.translateOnAxis(mc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ia.copy(e):Ia.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),ta.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kn.lookAt(ta,Ia,this.up):Kn.lookAt(Ia,ta,this.up),this.quaternion.setFromRotationMatrix(Kn),r&&(Kn.extractRotation(r.matrixWorld),gr.setFromRotationMatrix(Kn),this.quaternion.premultiply(gr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(gc),vr.child=e,this.dispatchEvent(vr),vr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jf),oo.child=e,this.dispatchEvent(oo),oo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Kn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(gc),vr.child=e,this.dispatchEvent(vr),vr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ta,e,$f),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ta,Yf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];a(e.shapes,u)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));r.material=o}else r.material=a(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(a(e.animations,l))}}if(t){const o=s(e.geometries),l=s(e.materials),c=s(e.textures),h=s(e.images),u=s(e.shapes),f=s(e.skeletons),g=s(e.animations),x=s(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),g.length>0&&(n.animations=g),x.length>0&&(n.nodes=x)}return n.object=r,n;function s(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}Xt.DEFAULT_UP=new H(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ln=new H,Zn=new H,lo=new H,Jn=new H,xr=new H,_r=new H,vc=new H,co=new H,ho=new H,uo=new H,fo=new Pt,po=new Pt,mo=new Pt;class Nn{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Ln.subVectors(e,t),r.cross(Ln);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(e,t,n,r,a){Ln.subVectors(r,t),Zn.subVectors(n,t),lo.subVectors(e,t);const s=Ln.dot(Ln),o=Ln.dot(Zn),l=Ln.dot(lo),c=Zn.dot(Zn),h=Zn.dot(lo),u=s*c-o*o;if(u===0)return a.set(0,0,0),null;const f=1/u,g=(c*l-o*h)*f,x=(s*h-o*l)*f;return a.set(1-g-x,x,g)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Jn)===null?!1:Jn.x>=0&&Jn.y>=0&&Jn.x+Jn.y<=1}static getInterpolation(e,t,n,r,a,s,o,l){return this.getBarycoord(e,t,n,r,Jn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Jn.x),l.addScaledVector(s,Jn.y),l.addScaledVector(o,Jn.z),l)}static getInterpolatedAttribute(e,t,n,r,a,s){return fo.setScalar(0),po.setScalar(0),mo.setScalar(0),fo.fromBufferAttribute(e,t),po.fromBufferAttribute(e,n),mo.fromBufferAttribute(e,r),s.setScalar(0),s.addScaledVector(fo,a.x),s.addScaledVector(po,a.y),s.addScaledVector(mo,a.z),s}static isFrontFacing(e,t,n,r){return Ln.subVectors(n,t),Zn.subVectors(e,t),Ln.cross(Zn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ln.subVectors(this.c,this.b),Zn.subVectors(this.a,this.b),Ln.cross(Zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Nn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Nn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,a){return Nn.getInterpolation(e,this.a,this.b,this.c,t,n,r,a)}containsPoint(e){return Nn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Nn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,a=this.c;let s,o;xr.subVectors(r,n),_r.subVectors(a,n),co.subVectors(e,n);const l=xr.dot(co),c=_r.dot(co);if(l<=0&&c<=0)return t.copy(n);ho.subVectors(e,r);const h=xr.dot(ho),u=_r.dot(ho);if(h>=0&&u<=h)return t.copy(r);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return s=l/(l-h),t.copy(n).addScaledVector(xr,s);uo.subVectors(e,a);const g=xr.dot(uo),x=_r.dot(uo);if(x>=0&&g<=x)return t.copy(a);const _=g*c-l*x;if(_<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(_r,o);const m=h*x-g*u;if(m<=0&&u-h>=0&&g-x>=0)return vc.subVectors(a,r),o=(u-h)/(u-h+(g-x)),t.copy(r).addScaledVector(vc,o);const p=1/(m+_+f);return s=_*p,o=f*p,t.copy(n).addScaledVector(xr,s).addScaledVector(_r,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const bu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},Na={h:0,s:0,l:0};function go(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class at{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,mt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=mt.workingColorSpace){return this.r=e,this.g=t,this.b=n,mt.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=mt.workingColorSpace){if(e=Df(e,1),t=en(t,0,1),n=en(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,s=2*n-a;this.r=go(s,a,e+1/3),this.g=go(s,a,e),this.b=go(s,a,e-1/3)}return mt.toWorkingColorSpace(this,r),this}setStyle(e,t=kn){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=r[1],s=a.length;if(s===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kn){const n=bu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Lr(e.r),this.g=Lr(e.g),this.b=Lr(e.b),this}copyLinearToSRGB(e){return this.r=Qs(e.r),this.g=Qs(e.g),this.b=Qs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kn){return mt.fromWorkingColorSpace(Yt.copy(this),e),Math.round(en(Yt.r*255,0,255))*65536+Math.round(en(Yt.g*255,0,255))*256+Math.round(en(Yt.b*255,0,255))}getHexString(e=kn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=mt.workingColorSpace){mt.fromWorkingColorSpace(Yt.copy(this),t);const n=Yt.r,r=Yt.g,a=Yt.b,s=Math.max(n,r,a),o=Math.min(n,r,a);let l,c;const h=(o+s)/2;if(o===s)l=0,c=0;else{const u=s-o;switch(c=h<=.5?u/(s+o):u/(2-s-o),s){case n:l=(r-a)/u+(r<a?6:0);break;case r:l=(a-n)/u+2;break;case a:l=(n-r)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=mt.workingColorSpace){return mt.fromWorkingColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=kn){mt.fromWorkingColorSpace(Yt.copy(this),e);const t=Yt.r,n=Yt.g,r=Yt.b;return e!==kn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(_i),this.setHSL(_i.h+e,_i.s+t,_i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_i),e.getHSL(Na);const n=Zs(_i.h,Na.h,t),r=Zs(_i.s,Na.s,t),a=Zs(_i.l,Na.l,t);return this.setHSL(n,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*r,this.g=a[1]*t+a[4]*n+a[7]*r,this.b=a[2]*t+a[5]*n+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new at;at.NAMES=bu;let Kf=0;class qr extends or{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=xa(),this.name="",this.type="Material",this.blending=Pr,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=n0,this.blendDst=i0,this.blendEquation=Yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new at(0,0,0),this.blendAlpha=0,this.depthFunc=Ur,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ic,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hr,this.stencilZFail=hr,this.stencilZPass=hr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Pr&&(n.blending=this.blending),this.side!==Ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==n0&&(n.blendSrc=this.blendSrc),this.blendDst!==i0&&(n.blendDst=this.blendDst),this.blendEquation!==Yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ur&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ic&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(a){const s=[];for(const o in a){const l=a[o];delete l.metadata,s.push(l)}return s}if(t){const a=r(e.textures),s=r(e.images);a.length>0&&(n.textures=a),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let a=0;a!==r;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Mu extends qr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vn,this.combine=iu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const It=new H,Ua=new Ke;class Fn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=rc,this.updateRanges=[],this.gpuType=ii,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ua.fromBufferAttribute(this,t),Ua.applyMatrix3(e),this.setXY(t,Ua.x,Ua.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Zr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=on(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zr(t,this.array)),t}setX(e,t){return this.normalized&&(t=on(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zr(t,this.array)),t}setY(e,t){return this.normalized&&(t=on(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=on(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zr(t,this.array)),t}setW(e,t){return this.normalized&&(t=on(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=on(t,this.array),n=on(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=on(t,this.array),n=on(n,this.array),r=on(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,a){return e*=this.itemSize,this.normalized&&(t=on(t,this.array),n=on(n,this.array),r=on(r,this.array),a=on(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==rc&&(e.usage=this.usage),e}}class Su extends Fn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class wu extends Fn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class nn extends Fn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Zf=0;const Mn=new At,vo=new Xt,yr=new H,mn=new _a,na=new _a,qt=new H;class On extends or{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=xa(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vu(e)?wu:Su)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Je().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Mn.makeRotationFromQuaternion(e),this.applyMatrix4(Mn),this}rotateX(e){return Mn.makeRotationX(e),this.applyMatrix4(Mn),this}rotateY(e){return Mn.makeRotationY(e),this.applyMatrix4(Mn),this}rotateZ(e){return Mn.makeRotationZ(e),this.applyMatrix4(Mn),this}translate(e,t,n){return Mn.makeTranslation(e,t,n),this.applyMatrix4(Mn),this}scale(e,t,n){return Mn.makeScale(e,t,n),this.applyMatrix4(Mn),this}lookAt(e){return vo.lookAt(e),vo.updateMatrix(),this.applyMatrix4(vo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yr).negate(),this.translate(yr.x,yr.y,yr.z),this}setFromPoints(e){const t=[];for(let n=0,r=e.length;n<r;n++){const a=e[n];t.push(a.x,a.y,a.z||0)}return this.setAttribute("position",new nn(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _a);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const a=t[n];mn.setFromBufferAttribute(a),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Is);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const n=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),t)for(let a=0,s=t.length;a<s;a++){const o=t[a];na.setFromBufferAttribute(o),this.morphTargetsRelative?(qt.addVectors(mn.min,na.min),mn.expandByPoint(qt),qt.addVectors(mn.max,na.max),mn.expandByPoint(qt)):(mn.expandByPoint(na.min),mn.expandByPoint(na.max))}mn.getCenter(n);let r=0;for(let a=0,s=e.count;a<s;a++)qt.fromBufferAttribute(e,a),r=Math.max(r,n.distanceToSquared(qt));if(t)for(let a=0,s=t.length;a<s;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)qt.fromBufferAttribute(o,c),l&&(yr.fromBufferAttribute(e,c),qt.add(yr)),r=Math.max(r,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Fn(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let B=0;B<n.count;B++)o[B]=new H,l[B]=new H;const c=new H,h=new H,u=new H,f=new Ke,g=new Ke,x=new Ke,_=new H,m=new H;function p(B,ee,b){c.fromBufferAttribute(n,B),h.fromBufferAttribute(n,ee),u.fromBufferAttribute(n,b),f.fromBufferAttribute(a,B),g.fromBufferAttribute(a,ee),x.fromBufferAttribute(a,b),h.sub(c),u.sub(c),g.sub(f),x.sub(f);const A=1/(g.x*x.y-x.x*g.y);isFinite(A)&&(_.copy(h).multiplyScalar(x.y).addScaledVector(u,-g.y).multiplyScalar(A),m.copy(u).multiplyScalar(g.x).addScaledVector(h,-x.x).multiplyScalar(A),o[B].add(_),o[ee].add(_),o[b].add(_),l[B].add(m),l[ee].add(m),l[b].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let B=0,ee=E.length;B<ee;++B){const b=E[B],A=b.start,W=b.count;for(let X=A,K=A+W;X<K;X+=3)p(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const w=new H,C=new H,F=new H,I=new H;function P(B){F.fromBufferAttribute(r,B),I.copy(F);const ee=o[B];w.copy(ee),w.sub(F.multiplyScalar(F.dot(ee))).normalize(),C.crossVectors(I,ee);const A=C.dot(l[B])<0?-1:1;s.setXYZW(B,w.x,w.y,w.z,A)}for(let B=0,ee=E.length;B<ee;++B){const b=E[B],A=b.start,W=b.count;for(let X=A,K=A+W;X<K;X+=3)P(e.getX(X+0)),P(e.getX(X+1)),P(e.getX(X+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Fn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,g=n.count;f<g;f++)n.setXYZ(f,0,0,0);const r=new H,a=new H,s=new H,o=new H,l=new H,c=new H,h=new H,u=new H;if(e)for(let f=0,g=e.count;f<g;f+=3){const x=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,_),s.fromBufferAttribute(t,m),h.subVectors(s,a),u.subVectors(r,a),h.cross(u),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,g=t.count;f<g;f+=3)r.fromBufferAttribute(t,f+0),a.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),h.subVectors(s,a),u.subVectors(r,a),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let g=0,x=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?g=l[_]*o.data.stride+o.offset:g=l[_]*h;for(let p=0;p<h;p++)f[x++]=c[g++]}return new Fn(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new On,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],g=e(f,n);l.push(g)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const g=c[u];h.push(g.toJSON(e.data))}h.length>0&&(r[l]=h,a=!0)}a&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],u=a[c];for(let f=0,g=u.length;f<g;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,h=s.length;c<h;c++){const u=s[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xc=new At,Bi=new bl,Fa=new Is,_c=new H,Oa=new H,ka=new H,Ba=new H,xo=new H,za=new H,yc=new H,Ha=new H;class En extends Xt{constructor(e=new On,t=new Mu){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,a=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(a&&o){za.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],u=a[l];h!==0&&(xo.fromBufferAttribute(u,e),s?za.addScaledVector(xo,h):za.addScaledVector(xo.sub(t),h))}t.add(za)}return t}raycast(e,t){const n=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fa.copy(n.boundingSphere),Fa.applyMatrix4(a),Bi.copy(e.ray).recast(e.near),!(Fa.containsPoint(Bi.origin)===!1&&(Bi.intersectSphere(Fa,_c)===null||Bi.origin.distanceToSquared(_c)>(e.far-e.near)**2))&&(xc.copy(a).invert(),Bi.copy(e.ray).applyMatrix4(xc),!(n.boundingBox!==null&&Bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Bi)))}_computeIntersections(e,t,n){let r;const a=this.geometry,s=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,u=a.attributes.normal,f=a.groups,g=a.drawRange;if(o!==null)if(Array.isArray(s))for(let x=0,_=f.length;x<_;x++){const m=f[x],p=s[m.materialIndex],E=Math.max(m.start,g.start),w=Math.min(o.count,Math.min(m.start+m.count,g.start+g.count));for(let C=E,F=w;C<F;C+=3){const I=o.getX(C),P=o.getX(C+1),B=o.getX(C+2);r=Ga(this,p,e,n,c,h,u,I,P,B),r&&(r.faceIndex=Math.floor(C/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const x=Math.max(0,g.start),_=Math.min(o.count,g.start+g.count);for(let m=x,p=_;m<p;m+=3){const E=o.getX(m),w=o.getX(m+1),C=o.getX(m+2);r=Ga(this,s,e,n,c,h,u,E,w,C),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(s))for(let x=0,_=f.length;x<_;x++){const m=f[x],p=s[m.materialIndex],E=Math.max(m.start,g.start),w=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let C=E,F=w;C<F;C+=3){const I=C,P=C+1,B=C+2;r=Ga(this,p,e,n,c,h,u,I,P,B),r&&(r.faceIndex=Math.floor(C/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const x=Math.max(0,g.start),_=Math.min(l.count,g.start+g.count);for(let m=x,p=_;m<p;m+=3){const E=m,w=m+1,C=m+2;r=Ga(this,s,e,n,c,h,u,E,w,C),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Jf(i,e,t,n,r,a,s,o){let l;if(e.side===hn?l=n.intersectTriangle(s,a,r,!0,o):l=n.intersectTriangle(r,a,s,e.side===Ci,o),l===null)return null;Ha.copy(o),Ha.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ha);return c<t.near||c>t.far?null:{distance:c,point:Ha.clone(),object:i}}function Ga(i,e,t,n,r,a,s,o,l,c){i.getVertexPosition(o,Oa),i.getVertexPosition(l,ka),i.getVertexPosition(c,Ba);const h=Jf(i,e,t,n,Oa,ka,Ba,yc);if(h){const u=new H;Nn.getBarycoord(yc,Oa,ka,Ba,u),r&&(h.uv=Nn.getInterpolatedAttribute(r,o,l,c,u,new Ke)),a&&(h.uv1=Nn.getInterpolatedAttribute(a,o,l,c,u,new Ke)),s&&(h.normal=Nn.getInterpolatedAttribute(s,o,l,c,u,new H),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new H,materialIndex:0};Nn.getNormal(Oa,ka,Ba,f.normal),h.face=f,h.barycoord=u}return h}class ya extends On{constructor(e=1,t=1,n=1,r=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:a,depthSegments:s};const o=this;r=Math.floor(r),a=Math.floor(a),s=Math.floor(s);const l=[],c=[],h=[],u=[];let f=0,g=0;x("z","y","x",-1,-1,n,t,e,s,a,0),x("z","y","x",1,-1,n,t,-e,s,a,1),x("x","z","y",1,1,e,n,t,r,s,2),x("x","z","y",1,-1,e,n,-t,r,s,3),x("x","y","z",1,-1,e,t,n,r,a,4),x("x","y","z",-1,-1,e,t,-n,r,a,5),this.setIndex(l),this.setAttribute("position",new nn(c,3)),this.setAttribute("normal",new nn(h,3)),this.setAttribute("uv",new nn(u,2));function x(_,m,p,E,w,C,F,I,P,B,ee){const b=C/P,A=F/B,W=C/2,X=F/2,K=I/2,te=P+1,$=B+1;let ne=0,Y=0;const Se=new H;for(let ge=0;ge<$;ge++){const we=ge*A-X;for(let et=0;et<te;et++){const je=et*b-W;Se[_]=je*E,Se[m]=we*w,Se[p]=K,c.push(Se.x,Se.y,Se.z),Se[_]=0,Se[m]=0,Se[p]=I>0?1:-1,h.push(Se.x,Se.y,Se.z),u.push(et/P),u.push(1-ge/B),ne+=1}}for(let ge=0;ge<B;ge++)for(let we=0;we<P;we++){const et=f+we+te*ge,je=f+we+te*(ge+1),Z=f+(we+1)+te*(ge+1),ce=f+(we+1)+te*ge;l.push(et,je,ce),l.push(je,Z,ce),Y+=6}o.addGroup(g,Y,ee),g+=Y,f+=ne}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ya(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function zr(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Jt(i){const e={};for(let t=0;t<i.length;t++){const n=zr(i[t]);for(const r in n)e[r]=n[r]}return e}function Qf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Eu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:mt.workingColorSpace}const ep={clone:zr,merge:Jt};var tp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,np=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ri extends qr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tp,this.fragmentShader=np,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zr(e.uniforms),this.uniformsGroups=Qf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Tu extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new At,this.projectionMatrix=new At,this.projectionMatrixInverse=new At,this.coordinateSystem=ri}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const yi=new H,bc=new Ke,Mc=new Ke;class Sn extends Tu{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=H0*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ps*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return H0*2*Math.atan(Math.tan(ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(yi.x,yi.y).multiplyScalar(-e/yi.z),yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yi.x,yi.y).multiplyScalar(-e/yi.z)}getViewSize(e,t){return this.getViewBounds(e,bc,Mc),t.subVectors(Mc,bc)}setViewOffset(e,t,n,r,a,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ps*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,a=-.5*r;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;a+=s.offsetX*r/l,t-=s.offsetY*n/c,r*=s.width/l,n*=s.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const br=-90,Mr=1;class ip extends Xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Sn(br,Mr,e,t);r.layers=this.layers,this.add(r);const a=new Sn(br,Mr,e,t);a.layers=this.layers,this.add(a);const s=new Sn(br,Mr,e,t);s.layers=this.layers,this.add(s);const o=new Sn(br,Mr,e,t);o.layers=this.layers,this.add(o);const l=new Sn(br,Mr,e,t);l.layers=this.layers,this.add(l);const c=new Sn(br,Mr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,a,s,o,l]=t;for(const c of t)this.remove(c);if(e===ri)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ss)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,s,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,a),e.setRenderTarget(n,1,r),e.render(t,s),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(u,f,g),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class Au extends un{constructor(e,t,n,r,a,s,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Fr,super(e,t,n,r,a,s,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rp extends ar{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Au(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:In}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ya(5,5,5),a=new Ri({name:"CubemapFromEquirect",uniforms:zr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:hn,blending:Ti});a.uniforms.tEquirect.value=t;const s=new En(r,a),o=t.minFilter;return t.minFilter===Qi&&(t.minFilter=In),new ip(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,n,r){const a=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,r);e.setRenderTarget(a)}}const _o=new H,ap=new H,sp=new Je;class Si{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=_o.subVectors(n,t).cross(ap.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(_o),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return a<0||a>1?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||sp.getNormalMatrix(e),r=this.coplanarPoint(_o).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const zi=new Is,Va=new H;class Ml{constructor(e=new Si,t=new Si,n=new Si,r=new Si,a=new Si,s=new Si){this.planes=[e,t,n,r,a,s]}set(e,t,n,r,a,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(a),o[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ri){const n=this.planes,r=e.elements,a=r[0],s=r[1],o=r[2],l=r[3],c=r[4],h=r[5],u=r[6],f=r[7],g=r[8],x=r[9],_=r[10],m=r[11],p=r[12],E=r[13],w=r[14],C=r[15];if(n[0].setComponents(l-a,f-c,m-g,C-p).normalize(),n[1].setComponents(l+a,f+c,m+g,C+p).normalize(),n[2].setComponents(l+s,f+h,m+x,C+E).normalize(),n[3].setComponents(l-s,f-h,m-x,C-E).normalize(),n[4].setComponents(l-o,f-u,m-_,C-w).normalize(),t===ri)n[5].setComponents(l+o,f+u,m+_,C+w).normalize();else if(t===Ss)n[5].setComponents(o,u,_,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zi)}intersectsSprite(e){return zi.center.set(0,0,0),zi.radius=.7071067811865476,zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(zi)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Va.x=r.normal.x>0?e.max.x:e.min.x,Va.y=r.normal.y>0?e.max.y:e.min.y,Va.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Va)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Cu(){let i=null,e=!1,t=null,n=null;function r(a,s){t(a,s),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function op(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),o.onUploadCallback();let g;if(c instanceof Float32Array)g=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?g=i.HALF_FLOAT:g=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)g=i.SHORT;else if(c instanceof Uint32Array)g=i.UNSIGNED_INT;else if(c instanceof Int32Array)g=i.INT;else if(c instanceof Int8Array)g=i.BYTE;else if(c instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:g,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((g,x)=>g.start-x.start);let f=0;for(let g=1;g<u.length;g++){const x=u[f],_=u[g];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++f,u[f]=_)}u.length=f+1;for(let g=0,x=u.length;g<x;g++){const _=u[g];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:a,update:s}}class ba extends On{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const a=e/2,s=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,h=l+1,u=e/o,f=t/l,g=[],x=[],_=[],m=[];for(let p=0;p<h;p++){const E=p*f-s;for(let w=0;w<c;w++){const C=w*u-a;x.push(C,-E,0),_.push(0,0,1),m.push(w/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let E=0;E<o;E++){const w=E+c*p,C=E+c*(p+1),F=E+1+c*(p+1),I=E+1+c*p;g.push(w,C,I),g.push(C,F,I)}this.setIndex(g),this.setAttribute("position",new nn(x,3)),this.setAttribute("normal",new nn(_,3)),this.setAttribute("uv",new nn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ba(e.width,e.height,e.widthSegments,e.heightSegments)}}var lp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,up=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,mp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,vp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_p=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Mp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ap=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Pp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Dp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Lp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ip=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Np=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Up=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Fp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Op=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,kp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bp=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Hp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Gp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Vp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Wp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$p=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Yp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Kp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,em=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,tm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,im=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,am=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,sm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,om=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,cm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,um=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,vm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_m=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ym=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,wm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Em=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Tm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Pm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Dm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Lm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Im=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Um=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Om=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,km=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,qm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$m=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ym=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,jm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Km=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,e1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,t1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,n1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,i1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,r1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,a1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,s1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const o1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,l1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,h1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,u1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,d1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,p1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,m1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,g1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,v1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,x1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,y1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,b1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,M1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,w1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,T1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,A1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,C1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,R1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,P1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,D1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,L1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,I1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,N1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,U1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,F1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,O1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,k1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,B1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,z1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:lp,alphahash_pars_fragment:cp,alphamap_fragment:hp,alphamap_pars_fragment:up,alphatest_fragment:dp,alphatest_pars_fragment:fp,aomap_fragment:pp,aomap_pars_fragment:mp,batching_pars_vertex:gp,batching_vertex:vp,begin_vertex:xp,beginnormal_vertex:_p,bsdfs:yp,iridescence_fragment:bp,bumpmap_pars_fragment:Mp,clipping_planes_fragment:Sp,clipping_planes_pars_fragment:wp,clipping_planes_pars_vertex:Ep,clipping_planes_vertex:Tp,color_fragment:Ap,color_pars_fragment:Cp,color_pars_vertex:Rp,color_vertex:Pp,common:Dp,cube_uv_reflection_fragment:Lp,defaultnormal_vertex:Ip,displacementmap_pars_vertex:Np,displacementmap_vertex:Up,emissivemap_fragment:Fp,emissivemap_pars_fragment:Op,colorspace_fragment:kp,colorspace_pars_fragment:Bp,envmap_fragment:zp,envmap_common_pars_fragment:Hp,envmap_pars_fragment:Gp,envmap_pars_vertex:Vp,envmap_physical_pars_fragment:em,envmap_vertex:qp,fog_vertex:Wp,fog_pars_vertex:Xp,fog_fragment:$p,fog_pars_fragment:Yp,gradientmap_pars_fragment:jp,lightmap_pars_fragment:Kp,lights_lambert_fragment:Zp,lights_lambert_pars_fragment:Jp,lights_pars_begin:Qp,lights_toon_fragment:tm,lights_toon_pars_fragment:nm,lights_phong_fragment:im,lights_phong_pars_fragment:rm,lights_physical_fragment:am,lights_physical_pars_fragment:sm,lights_fragment_begin:om,lights_fragment_maps:lm,lights_fragment_end:cm,logdepthbuf_fragment:hm,logdepthbuf_pars_fragment:um,logdepthbuf_pars_vertex:dm,logdepthbuf_vertex:fm,map_fragment:pm,map_pars_fragment:mm,map_particle_fragment:gm,map_particle_pars_fragment:vm,metalnessmap_fragment:xm,metalnessmap_pars_fragment:_m,morphinstance_vertex:ym,morphcolor_vertex:bm,morphnormal_vertex:Mm,morphtarget_pars_vertex:Sm,morphtarget_vertex:wm,normal_fragment_begin:Em,normal_fragment_maps:Tm,normal_pars_fragment:Am,normal_pars_vertex:Cm,normal_vertex:Rm,normalmap_pars_fragment:Pm,clearcoat_normal_fragment_begin:Dm,clearcoat_normal_fragment_maps:Lm,clearcoat_pars_fragment:Im,iridescence_pars_fragment:Nm,opaque_fragment:Um,packing:Fm,premultiplied_alpha_fragment:Om,project_vertex:km,dithering_fragment:Bm,dithering_pars_fragment:zm,roughnessmap_fragment:Hm,roughnessmap_pars_fragment:Gm,shadowmap_pars_fragment:Vm,shadowmap_pars_vertex:qm,shadowmap_vertex:Wm,shadowmask_pars_fragment:Xm,skinbase_vertex:$m,skinning_pars_vertex:Ym,skinning_vertex:jm,skinnormal_vertex:Km,specularmap_fragment:Zm,specularmap_pars_fragment:Jm,tonemapping_fragment:Qm,tonemapping_pars_fragment:e1,transmission_fragment:t1,transmission_pars_fragment:n1,uv_pars_fragment:i1,uv_pars_vertex:r1,uv_vertex:a1,worldpos_vertex:s1,background_vert:o1,background_frag:l1,backgroundCube_vert:c1,backgroundCube_frag:h1,cube_vert:u1,cube_frag:d1,depth_vert:f1,depth_frag:p1,distanceRGBA_vert:m1,distanceRGBA_frag:g1,equirect_vert:v1,equirect_frag:x1,linedashed_vert:_1,linedashed_frag:y1,meshbasic_vert:b1,meshbasic_frag:M1,meshlambert_vert:S1,meshlambert_frag:w1,meshmatcap_vert:E1,meshmatcap_frag:T1,meshnormal_vert:A1,meshnormal_frag:C1,meshphong_vert:R1,meshphong_frag:P1,meshphysical_vert:D1,meshphysical_frag:L1,meshtoon_vert:I1,meshtoon_frag:N1,points_vert:U1,points_frag:F1,shadow_vert:O1,shadow_frag:k1,sprite_vert:B1,sprite_frag:z1},fe={common:{diffuse:{value:new at(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new Ke(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new at(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new at(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new at(16777215)},opacity:{value:1},center:{value:new Ke(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},Bn={basic:{uniforms:Jt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Jt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new at(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Jt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new at(0)},specular:{value:new at(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Jt([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new at(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Jt([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new at(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Jt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Jt([fe.points,fe.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Jt([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Jt([fe.common,fe.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Jt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Jt([fe.sprite,fe.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Jt([fe.common,fe.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Jt([fe.lights,fe.fog,{color:{value:new at(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Bn.physical={uniforms:Jt([Bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new Ke(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new at(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new Ke},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new at(0)},specularColor:{value:new at(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new Ke},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const qa={r:0,b:0,g:0},Hi=new Vn,H1=new At;function G1(i,e,t,n,r,a,s){const o=new at(0);let l=a===!0?0:1,c,h,u=null,f=0,g=null;function x(E){let w=E.isScene===!0?E.background:null;return w&&w.isTexture&&(w=(E.backgroundBlurriness>0?t:e).get(w)),w}function _(E){let w=!1;const C=x(E);C===null?p(o,l):C&&C.isColor&&(p(C,1),w=!0);const F=i.xr.getEnvironmentBlendMode();F==="additive"?n.buffers.color.setClear(0,0,0,1,s):F==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,w){const C=x(w);C&&(C.isCubeTexture||C.mapping===Ds)?(h===void 0&&(h=new En(new ya(1,1,1),new Ri({name:"BackgroundCubeMaterial",uniforms:zr(Bn.backgroundCube.uniforms),vertexShader:Bn.backgroundCube.vertexShader,fragmentShader:Bn.backgroundCube.fragmentShader,side:hn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(F,I,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Hi.copy(w.backgroundRotation),Hi.x*=-1,Hi.y*=-1,Hi.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Hi.y*=-1,Hi.z*=-1),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(H1.makeRotationFromEuler(Hi)),h.material.toneMapped=mt.getTransfer(C.colorSpace)!==Mt,(u!==C||f!==C.version||g!==i.toneMapping)&&(h.material.needsUpdate=!0,u=C,f=C.version,g=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new En(new ba(2,2),new Ri({name:"BackgroundMaterial",uniforms:zr(Bn.background.uniforms),vertexShader:Bn.background.vertexShader,fragmentShader:Bn.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=mt.getTransfer(C.colorSpace)!==Mt,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(u!==C||f!==C.version||g!==i.toneMapping)&&(c.material.needsUpdate=!0,u=C,f=C.version,g=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function p(E,w){E.getRGB(qa,Eu(i)),n.buffers.color.setClear(qa.r,qa.g,qa.b,w,s)}return{getClearColor:function(){return o},setClearColor:function(E,w=1){o.set(E),l=w,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,p(o,l)},render:_,addToRenderList:m}}function V1(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=f(null);let a=r,s=!1;function o(b,A,W,X,K){let te=!1;const $=u(X,W,A);a!==$&&(a=$,c(a.object)),te=g(b,X,W,K),te&&x(b,X,W,K),K!==null&&e.update(K,i.ELEMENT_ARRAY_BUFFER),(te||s)&&(s=!1,C(b,A,W,X),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function l(){return i.createVertexArray()}function c(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,A,W){const X=W.wireframe===!0;let K=n[b.id];K===void 0&&(K={},n[b.id]=K);let te=K[A.id];te===void 0&&(te={},K[A.id]=te);let $=te[X];return $===void 0&&($=f(l()),te[X]=$),$}function f(b){const A=[],W=[],X=[];for(let K=0;K<t;K++)A[K]=0,W[K]=0,X[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:W,attributeDivisors:X,object:b,attributes:{},index:null}}function g(b,A,W,X){const K=a.attributes,te=A.attributes;let $=0;const ne=W.getAttributes();for(const Y in ne)if(ne[Y].location>=0){const ge=K[Y];let we=te[Y];if(we===void 0&&(Y==="instanceMatrix"&&b.instanceMatrix&&(we=b.instanceMatrix),Y==="instanceColor"&&b.instanceColor&&(we=b.instanceColor)),ge===void 0||ge.attribute!==we||we&&ge.data!==we.data)return!0;$++}return a.attributesNum!==$||a.index!==X}function x(b,A,W,X){const K={},te=A.attributes;let $=0;const ne=W.getAttributes();for(const Y in ne)if(ne[Y].location>=0){let ge=te[Y];ge===void 0&&(Y==="instanceMatrix"&&b.instanceMatrix&&(ge=b.instanceMatrix),Y==="instanceColor"&&b.instanceColor&&(ge=b.instanceColor));const we={};we.attribute=ge,ge&&ge.data&&(we.data=ge.data),K[Y]=we,$++}a.attributes=K,a.attributesNum=$,a.index=X}function _(){const b=a.newAttributes;for(let A=0,W=b.length;A<W;A++)b[A]=0}function m(b){p(b,0)}function p(b,A){const W=a.newAttributes,X=a.enabledAttributes,K=a.attributeDivisors;W[b]=1,X[b]===0&&(i.enableVertexAttribArray(b),X[b]=1),K[b]!==A&&(i.vertexAttribDivisor(b,A),K[b]=A)}function E(){const b=a.newAttributes,A=a.enabledAttributes;for(let W=0,X=A.length;W<X;W++)A[W]!==b[W]&&(i.disableVertexAttribArray(W),A[W]=0)}function w(b,A,W,X,K,te,$){$===!0?i.vertexAttribIPointer(b,A,W,K,te):i.vertexAttribPointer(b,A,W,X,K,te)}function C(b,A,W,X){_();const K=X.attributes,te=W.getAttributes(),$=A.defaultAttributeValues;for(const ne in te){const Y=te[ne];if(Y.location>=0){let Se=K[ne];if(Se===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(Se=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(Se=b.instanceColor)),Se!==void 0){const ge=Se.normalized,we=Se.itemSize,et=e.get(Se);if(et===void 0)continue;const je=et.buffer,Z=et.type,ce=et.bytesPerElement,Re=Z===i.INT||Z===i.UNSIGNED_INT||Se.gpuType===pl;if(Se.isInterleavedBufferAttribute){const xe=Se.data,Ge=xe.stride,Ue=Se.offset;if(xe.isInstancedInterleavedBuffer){for(let nt=0;nt<Y.locationSize;nt++)p(Y.location+nt,xe.meshPerAttribute);b.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let nt=0;nt<Y.locationSize;nt++)m(Y.location+nt);i.bindBuffer(i.ARRAY_BUFFER,je);for(let nt=0;nt<Y.locationSize;nt++)w(Y.location+nt,we/Y.locationSize,Z,ge,Ge*ce,(Ue+we/Y.locationSize*nt)*ce,Re)}else{if(Se.isInstancedBufferAttribute){for(let xe=0;xe<Y.locationSize;xe++)p(Y.location+xe,Se.meshPerAttribute);b.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=Se.meshPerAttribute*Se.count)}else for(let xe=0;xe<Y.locationSize;xe++)m(Y.location+xe);i.bindBuffer(i.ARRAY_BUFFER,je);for(let xe=0;xe<Y.locationSize;xe++)w(Y.location+xe,we/Y.locationSize,Z,ge,we*ce,we/Y.locationSize*xe*ce,Re)}}else if($!==void 0){const ge=$[ne];if(ge!==void 0)switch(ge.length){case 2:i.vertexAttrib2fv(Y.location,ge);break;case 3:i.vertexAttrib3fv(Y.location,ge);break;case 4:i.vertexAttrib4fv(Y.location,ge);break;default:i.vertexAttrib1fv(Y.location,ge)}}}}E()}function F(){B();for(const b in n){const A=n[b];for(const W in A){const X=A[W];for(const K in X)h(X[K].object),delete X[K];delete A[W]}delete n[b]}}function I(b){if(n[b.id]===void 0)return;const A=n[b.id];for(const W in A){const X=A[W];for(const K in X)h(X[K].object),delete X[K];delete A[W]}delete n[b.id]}function P(b){for(const A in n){const W=n[A];if(W[b.id]===void 0)continue;const X=W[b.id];for(const K in X)h(X[K].object),delete X[K];delete W[b.id]}}function B(){ee(),s=!0,a!==r&&(a=r,c(a.object))}function ee(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:B,resetDefaultState:ee,dispose:F,releaseStatesOfGeometry:I,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function q1(i,e,t){let n;function r(c){n=c}function a(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function s(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x];t.update(g,n,1)}function l(c,h,u,f){if(u===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let x=0;x<c.length;x++)s(c[x],h[x],f[x]);else{g.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let x=0;for(let _=0;_<u;_++)x+=h[_];for(let _=0;_<f.length;_++)t.update(x,n,f[_])}}this.setMode=r,this.render=a,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function W1(i,e,t,n){let r;function a(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(P){return!(P!==Un&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const B=P===va&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==ci&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==ii&&!B)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(f===!0){const P=e.get("EXT_clip_control");P.clipControlEXT(P.LOWER_LEFT_EXT,P.ZERO_TO_ONE_EXT)}const g=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),C=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),F=x>0,I=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:g,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:w,maxFragmentUniforms:C,vertexTextures:F,maxSamples:I}}function X1(i){const e=this;let t=null,n=0,r=!1,a=!1;const s=new Si,o=new Je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const g=u.length!==0||f||n!==0||r;return r=f,n=u.length,g},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,g){const x=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!r||x===null||x.length===0||a&&!m)a?h(null):c();else{const E=a?0:n,w=E*4;let C=p.clippingState||null;l.value=C,C=h(x,f,w,g);for(let F=0;F!==w;++F)C[F]=t[F];p.clippingState=C,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,g,x){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,x!==!0||m===null){const p=g+_*4,E=f.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,C=g;w!==_;++w,C+=4)s.copy(u[w]).applyMatrix4(E,o),s.normal.toArray(m,C),m[C+3]=s.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function $1(i){let e=new WeakMap;function t(s,o){return o===u0?s.mapping=Fr:o===d0&&(s.mapping=Or),s}function n(s){if(s&&s.isTexture){const o=s.mapping;if(o===u0||o===d0)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new rp(l.height);return c.fromEquirectangularTexture(i,s),e.set(s,c),s.addEventListener("dispose",r),t(c.texture,s.mapping)}else return null}}return s}function r(s){const o=s.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function a(){e=new WeakMap}return{get:n,dispose:a}}class Ru extends Tu{constructor(e=-1,t=1,n=1,r=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,a,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=n-e,s=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,s=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,s,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ar=4,Sc=[.125,.215,.35,.446,.526,.582],ji=20,yo=new Ru,wc=new at;let bo=null,Mo=0,So=0,wo=!1;const Xi=(1+Math.sqrt(5))/2,Sr=1/Xi,Ec=[new H(-Xi,Sr,0),new H(Xi,Sr,0),new H(-Sr,0,Xi),new H(Sr,0,Xi),new H(0,Xi,-Sr),new H(0,Xi,Sr),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class Tc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){bo=this._renderer.getRenderTarget(),Mo=this._renderer.getActiveCubeFace(),So=this._renderer.getActiveMipmapLevel(),wo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,n,r,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(bo,Mo,So),this._renderer.xr.enabled=wo,e.scissorTest=!1,Wa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Fr||e.mapping===Or?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bo=this._renderer.getRenderTarget(),Mo=this._renderer.getActiveCubeFace(),So=this._renderer.getActiveMipmapLevel(),wo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:In,minFilter:In,generateMipmaps:!1,type:va,format:Un,colorSpace:Ni,depthBuffer:!1},r=Ac(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ac(e,t,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Y1(a)),this._blurMaterial=j1(a,e,t)}return r}_compileMaterial(e){const t=new En(this._lodPlanes[0],e);this._renderer.compile(t,yo)}_sceneToCubeUV(e,t,n,r){const o=new Sn(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(wc),h.toneMapping=Ai,h.autoClear=!1;const g=new Mu({name:"PMREM.Background",side:hn,depthWrite:!1,depthTest:!1}),x=new En(new ya,g);let _=!1;const m=e.background;m?m.isColor&&(g.color.copy(m),e.background=null,_=!0):(g.color.copy(wc),_=!0);for(let p=0;p<6;p++){const E=p%3;E===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):E===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const w=this._cubeSize;Wa(r,E*w,p>2?w:0,w,w),h.setRenderTarget(r),_&&h.render(x,o),h.render(e,o)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===Fr||e.mapping===Or;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cc());const a=r?this._cubemapMaterial:this._equirectMaterial,s=new En(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;Wa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(s,yo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let a=1;a<r;a++){const s=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Ec[(r-a-1)%Ec.length];this._blur(e,a-1,a,s,o)}t.autoClear=n}_blur(e,t,n,r,a){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,r,"latitudinal",a),this._halfBlur(s,e,n,n,r,"longitudinal",a)}_halfBlur(e,t,n,r,a,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new En(this._lodPlanes[r],c),f=c.uniforms,g=this._sizeLods[n]-1,x=isFinite(a)?Math.PI/(2*g):2*Math.PI/(2*ji-1),_=a/x,m=isFinite(a)?1+Math.floor(h*_):ji;m>ji&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ji}`);const p=[];let E=0;for(let P=0;P<ji;++P){const B=P/_,ee=Math.exp(-B*B/2);p.push(ee),P===0?E+=ee:P<m&&(E+=2*ee)}for(let P=0;P<p.length;P++)p[P]=p[P]/E;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=s==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:w}=this;f.dTheta.value=x,f.mipInt.value=w-n;const C=this._sizeLods[r],F=3*C*(r>w-Ar?r-w+Ar:0),I=4*(this._cubeSize-C);Wa(t,F,I,3*C,2*C),l.setRenderTarget(t),l.render(u,yo)}}function Y1(i){const e=[],t=[],n=[];let r=i;const a=i-Ar+1+Sc.length;for(let s=0;s<a;s++){const o=Math.pow(2,r);t.push(o);let l=1/o;s>i-Ar?l=Sc[s-i+Ar-1]:s===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],g=6,x=6,_=3,m=2,p=1,E=new Float32Array(_*x*g),w=new Float32Array(m*x*g),C=new Float32Array(p*x*g);for(let I=0;I<g;I++){const P=I%3*2/3-1,B=I>2?0:-1,ee=[P,B,0,P+2/3,B,0,P+2/3,B+1,0,P,B,0,P+2/3,B+1,0,P,B+1,0];E.set(ee,_*x*I),w.set(f,m*x*I);const b=[I,I,I,I,I,I];C.set(b,p*x*I)}const F=new On;F.setAttribute("position",new Fn(E,_)),F.setAttribute("uv",new Fn(w,m)),F.setAttribute("faceIndex",new Fn(C,p)),e.push(F),r>Ar&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Ac(i,e,t){const n=new ar(i,e,t);return n.texture.mapping=Ds,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Wa(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function j1(i,e,t){const n=new Float32Array(ji),r=new H(0,1,0);return new Ri({name:"SphericalGaussianBlur",defines:{n:ji,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ti,depthTest:!1,depthWrite:!1})}function Cc(){return new Ri({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ti,depthTest:!1,depthWrite:!1})}function Rc(){return new Ri({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ti,depthTest:!1,depthWrite:!1})}function Sl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function K1(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===u0||l===d0,h=l===Fr||l===Or;if(c||h){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Tc(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const g=o.image;return c&&g&&g.height>0||h&&g&&r(g)?(t===null&&(t=new Tc(i)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function r(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:s}}function Z1(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&ms("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function J1(i,e,t,n){const r={},a=new WeakMap;function s(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);for(const x in f.morphAttributes){const _=f.morphAttributes[x];for(let m=0,p=_.length;m<p;m++)e.remove(_[m])}f.removeEventListener("dispose",s),delete r[f.id];const g=a.get(f);g&&(e.remove(g),a.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return r[f.id]===!0||(f.addEventListener("dispose",s),r[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const x in f)e.update(f[x],i.ARRAY_BUFFER);const g=u.morphAttributes;for(const x in g){const _=g[x];for(let m=0,p=_.length;m<p;m++)e.update(_[m],i.ARRAY_BUFFER)}}function c(u){const f=[],g=u.index,x=u.attributes.position;let _=0;if(g!==null){const E=g.array;_=g.version;for(let w=0,C=E.length;w<C;w+=3){const F=E[w+0],I=E[w+1],P=E[w+2];f.push(F,I,I,P,P,F)}}else if(x!==void 0){const E=x.array;_=x.version;for(let w=0,C=E.length/3-1;w<C;w+=3){const F=w+0,I=w+1,P=w+2;f.push(F,I,I,P,P,F)}}else return;const m=new(vu(f)?wu:Su)(f,1);m.version=_;const p=a.get(u);p&&e.remove(p),a.set(u,m)}function h(u){const f=a.get(u);if(f){const g=u.index;g!==null&&f.version<g.version&&c(u)}else c(u);return a.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Q1(i,e,t){let n;function r(f){n=f}let a,s;function o(f){a=f.type,s=f.bytesPerElement}function l(f,g){i.drawElements(n,g,a,f*s),t.update(g,n,1)}function c(f,g,x){x!==0&&(i.drawElementsInstanced(n,g,a,f*s,x),t.update(g,n,x))}function h(f,g,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,g,0,a,f,0,x);let m=0;for(let p=0;p<x;p++)m+=g[p];t.update(m,n,1)}function u(f,g,x,_){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/s,g[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,g,0,a,f,0,_,0,x);let p=0;for(let E=0;E<x;E++)p+=g[E];for(let E=0;E<_.length;E++)t.update(p,n,_[E])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function eg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,s,o){switch(t.calls++,s){case i.TRIANGLES:t.triangles+=o*(a/3);break;case i.LINES:t.lines+=o*(a/2);break;case i.LINE_STRIP:t.lines+=o*(a-1);break;case i.LINE_LOOP:t.lines+=o*a;break;case i.POINTS:t.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function tg(i,e,t){const n=new WeakMap,r=new Pt;function a(s,o,l){const c=s.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let b=function(){B.dispose(),n.delete(o),o.removeEventListener("dispose",b)};var g=b;f!==void 0&&f.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let C=0;x===!0&&(C=1),_===!0&&(C=2),m===!0&&(C=3);let F=o.attributes.position.count*C,I=1;F>e.maxTextureSize&&(I=Math.ceil(F/e.maxTextureSize),F=e.maxTextureSize);const P=new Float32Array(F*I*4*u),B=new _u(P,F,I,u);B.type=ii,B.needsUpdate=!0;const ee=C*4;for(let A=0;A<u;A++){const W=p[A],X=E[A],K=w[A],te=F*I*4*A;for(let $=0;$<W.count;$++){const ne=$*ee;x===!0&&(r.fromBufferAttribute(W,$),P[te+ne+0]=r.x,P[te+ne+1]=r.y,P[te+ne+2]=r.z,P[te+ne+3]=0),_===!0&&(r.fromBufferAttribute(X,$),P[te+ne+4]=r.x,P[te+ne+5]=r.y,P[te+ne+6]=r.z,P[te+ne+7]=0),m===!0&&(r.fromBufferAttribute(K,$),P[te+ne+8]=r.x,P[te+ne+9]=r.y,P[te+ne+10]=r.z,P[te+ne+11]=K.itemSize===4?r.w:1)}}f={count:u,texture:B,size:new Ke(F,I)},n.set(o,f),o.addEventListener("dispose",b)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let x=0;for(let m=0;m<c.length;m++)x+=c[m];const _=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:a}}function ng(i,e,t,n){let r=new WeakMap;function a(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(r.get(u)!==c&&(e.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return u}function s(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:a,dispose:s}}class Pu extends un{constructor(e,t,n,r,a,s,o,l,c,h=Dr){if(h!==Dr&&h!==Br)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Dr&&(n=rr),n===void 0&&h===Br&&(n=kr),super(null,r,a,s,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:wn,this.minFilter=l!==void 0?l:wn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Du=new un,Pc=new Pu(1,1),Lu=new _u,Iu=new Gf,Nu=new Au,Dc=[],Lc=[],Ic=new Float32Array(16),Nc=new Float32Array(9),Uc=new Float32Array(4);function Wr(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let a=Dc[r];if(a===void 0&&(a=new Float32Array(r),Dc[r]=a),e!==0){n.toArray(a,0);for(let s=1,o=0;s!==e;++s)o+=t,i[s].toArray(a,o)}return a}function zt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ht(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ns(i,e){let t=Lc[e];t===void 0&&(t=new Int32Array(e),Lc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function ig(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function rg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2fv(this.addr,e),Ht(t,e)}}function ag(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(zt(t,e))return;i.uniform3fv(this.addr,e),Ht(t,e)}}function sg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4fv(this.addr,e),Ht(t,e)}}function og(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;Uc.set(n),i.uniformMatrix2fv(this.addr,!1,Uc),Ht(t,n)}}function lg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;Nc.set(n),i.uniformMatrix3fv(this.addr,!1,Nc),Ht(t,n)}}function cg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;Ic.set(n),i.uniformMatrix4fv(this.addr,!1,Ic),Ht(t,n)}}function hg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ug(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2iv(this.addr,e),Ht(t,e)}}function dg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3iv(this.addr,e),Ht(t,e)}}function fg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4iv(this.addr,e),Ht(t,e)}}function pg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function mg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2uiv(this.addr,e),Ht(t,e)}}function gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3uiv(this.addr,e),Ht(t,e)}}function vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4uiv(this.addr,e),Ht(t,e)}}function xg(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let a;this.type===i.SAMPLER_2D_SHADOW?(Pc.compareFunction=gu,a=Pc):a=Du,t.setTexture2D(e||a,r)}function _g(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Iu,r)}function yg(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Nu,r)}function bg(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Lu,r)}function Mg(i){switch(i){case 5126:return ig;case 35664:return rg;case 35665:return ag;case 35666:return sg;case 35674:return og;case 35675:return lg;case 35676:return cg;case 5124:case 35670:return hg;case 35667:case 35671:return ug;case 35668:case 35672:return dg;case 35669:case 35673:return fg;case 5125:return pg;case 36294:return mg;case 36295:return gg;case 36296:return vg;case 35678:case 36198:case 36298:case 36306:case 35682:return xg;case 35679:case 36299:case 36307:return _g;case 35680:case 36300:case 36308:case 36293:return yg;case 36289:case 36303:case 36311:case 36292:return bg}}function Sg(i,e){i.uniform1fv(this.addr,e)}function wg(i,e){const t=Wr(e,this.size,2);i.uniform2fv(this.addr,t)}function Eg(i,e){const t=Wr(e,this.size,3);i.uniform3fv(this.addr,t)}function Tg(i,e){const t=Wr(e,this.size,4);i.uniform4fv(this.addr,t)}function Ag(i,e){const t=Wr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Cg(i,e){const t=Wr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Rg(i,e){const t=Wr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Pg(i,e){i.uniform1iv(this.addr,e)}function Dg(i,e){i.uniform2iv(this.addr,e)}function Lg(i,e){i.uniform3iv(this.addr,e)}function Ig(i,e){i.uniform4iv(this.addr,e)}function Ng(i,e){i.uniform1uiv(this.addr,e)}function Ug(i,e){i.uniform2uiv(this.addr,e)}function Fg(i,e){i.uniform3uiv(this.addr,e)}function Og(i,e){i.uniform4uiv(this.addr,e)}function kg(i,e,t){const n=this.cache,r=e.length,a=Ns(t,r);zt(n,a)||(i.uniform1iv(this.addr,a),Ht(n,a));for(let s=0;s!==r;++s)t.setTexture2D(e[s]||Du,a[s])}function Bg(i,e,t){const n=this.cache,r=e.length,a=Ns(t,r);zt(n,a)||(i.uniform1iv(this.addr,a),Ht(n,a));for(let s=0;s!==r;++s)t.setTexture3D(e[s]||Iu,a[s])}function zg(i,e,t){const n=this.cache,r=e.length,a=Ns(t,r);zt(n,a)||(i.uniform1iv(this.addr,a),Ht(n,a));for(let s=0;s!==r;++s)t.setTextureCube(e[s]||Nu,a[s])}function Hg(i,e,t){const n=this.cache,r=e.length,a=Ns(t,r);zt(n,a)||(i.uniform1iv(this.addr,a),Ht(n,a));for(let s=0;s!==r;++s)t.setTexture2DArray(e[s]||Lu,a[s])}function Gg(i){switch(i){case 5126:return Sg;case 35664:return wg;case 35665:return Eg;case 35666:return Tg;case 35674:return Ag;case 35675:return Cg;case 35676:return Rg;case 5124:case 35670:return Pg;case 35667:case 35671:return Dg;case 35668:case 35672:return Lg;case 35669:case 35673:return Ig;case 5125:return Ng;case 36294:return Ug;case 36295:return Fg;case 36296:return Og;case 35678:case 36198:case 36298:case 36306:case 35682:return kg;case 35679:case 36299:case 36307:return Bg;case 35680:case 36300:case 36308:case 36293:return zg;case 36289:case 36303:case 36311:case 36292:return Hg}}class Vg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Mg(t.type)}}class qg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Gg(t.type)}}class Wg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let a=0,s=r.length;a!==s;++a){const o=r[a];o.setValue(e,t[o.id],n)}}}const Eo=/(\w+)(\])?(\[|\.)?/g;function Fc(i,e){i.seq.push(e),i.map[e.id]=e}function Xg(i,e,t){const n=i.name,r=n.length;for(Eo.lastIndex=0;;){const a=Eo.exec(n),s=Eo.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===r){Fc(t,c===void 0?new Vg(o,i,e):new qg(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Wg(o),Fc(t,u)),t=u}}}class gs{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const a=e.getActiveUniform(t,r),s=e.getUniformLocation(t,a.name);Xg(a,s,this)}}setValue(e,t,n,r){const a=this.map[t];a!==void 0&&a.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let a=0,s=t.length;a!==s;++a){const o=t[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,a=e.length;r!==a;++r){const s=e[r];s.id in t&&n.push(s)}return n}}function Oc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const $g=37297;let Yg=0;function jg(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let s=r;s<a;s++){const o=s+1;n.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return n.join(`
`)}function Kg(i){const e=mt.getPrimaries(mt.workingColorSpace),t=mt.getPrimaries(i);let n;switch(e===t?n="":e===Ms&&t===bs?n="LinearDisplayP3ToLinearSRGB":e===bs&&t===Ms&&(n="LinearSRGBToLinearDisplayP3"),i){case Ni:case Ls:return[n,"LinearTransferOETF"];case kn:case yl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function kc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const s=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+jg(i.getShaderSource(e),s)}else return r}function Zg(i,e){const t=Kg(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Jg(i,e){let t;switch(e){case ff:t="Linear";break;case pf:t="Reinhard";break;case mf:t="Cineon";break;case gf:t="ACESFilmic";break;case xf:t="AgX";break;case _f:t="Neutral";break;case vf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Xa=new H;function Qg(){mt.getLuminanceCoefficients(Xa);const i=Xa.x.toFixed(4),e=Xa.y.toFixed(4),t=Xa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function e2(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ra).join(`
`)}function t2(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function n2(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const a=i.getActiveAttrib(e,r),s=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),t[s]={type:a.type,location:i.getAttribLocation(e,s),locationSize:o}}return t}function ra(i){return i!==""}function Bc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function zc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const i2=/^[ \t]*#include +<([\w\d./]+)>/gm;function G0(i){return i.replace(i2,a2)}const r2=new Map;function a2(i,e){let t=Ze[e];if(t===void 0){const n=r2.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return G0(t)}const s2=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hc(i){return i.replace(s2,o2)}function o2(i,e,t,n){let r="";for(let a=parseInt(e);a<parseInt(t);a++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function Gc(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function l2(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nu?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Wd?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ei&&(e="SHADOWMAP_TYPE_VSM"),e}function c2(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Fr:case Or:e="ENVMAP_TYPE_CUBE";break;case Ds:e="ENVMAP_TYPE_CUBE_UV";break}return e}function h2(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Or:e="ENVMAP_MODE_REFRACTION";break}return e}function u2(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case iu:e="ENVMAP_BLENDING_MULTIPLY";break;case uf:e="ENVMAP_BLENDING_MIX";break;case df:e="ENVMAP_BLENDING_ADD";break}return e}function d2(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function f2(i,e,t,n){const r=i.getContext(),a=t.defines;let s=t.vertexShader,o=t.fragmentShader;const l=l2(t),c=c2(t),h=h2(t),u=u2(t),f=d2(t),g=e2(t),x=t2(a),_=r.createProgram();let m,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ra).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ra).join(`
`),p.length>0&&(p+=`
`)):(m=[Gc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ra).join(`
`),p=[Gc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ai?"#define TONE_MAPPING":"",t.toneMapping!==Ai?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Ai?Jg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,Zg("linearToOutputTexel",t.outputColorSpace),Qg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ra).join(`
`)),s=G0(s),s=Bc(s,t),s=zc(s,t),o=G0(o),o=Bc(o,t),o=zc(o,t),s=Hc(s),o=Hc(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===ac?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ac?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=E+m+s,C=E+p+o,F=Oc(r,r.VERTEX_SHADER,w),I=Oc(r,r.FRAGMENT_SHADER,C);r.attachShader(_,F),r.attachShader(_,I),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function P(A){if(i.debug.checkShaderErrors){const W=r.getProgramInfoLog(_).trim(),X=r.getShaderInfoLog(F).trim(),K=r.getShaderInfoLog(I).trim();let te=!0,$=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(te=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,F,I);else{const ne=kc(r,F,"vertex"),Y=kc(r,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+W+`
`+ne+`
`+Y)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(X===""||K==="")&&($=!1);$&&(A.diagnostics={runnable:te,programLog:W,vertexShader:{log:X,prefix:m},fragmentShader:{log:K,prefix:p}})}r.deleteShader(F),r.deleteShader(I),B=new gs(r,_),ee=n2(r,_)}let B;this.getUniforms=function(){return B===void 0&&P(this),B};let ee;this.getAttributes=function(){return ee===void 0&&P(this),ee};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(_,$g)),b},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Yg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=F,this.fragmentShader=I,this}let p2=0;class m2{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(a)===!1&&(s.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new g2(e),t.set(e,n)),n}}class g2{constructor(e){this.id=p2++,this.code=e,this.usedTimes=0}}function v2(i,e,t,n,r,a,s){const o=new yu,l=new m2,c=new Set,h=[],u=r.logarithmicDepthBuffer,f=r.reverseDepthBuffer,g=r.vertexTextures;let x=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(b){return c.add(b),b===0?"uv":`uv${b}`}function p(b,A,W,X,K){const te=X.fog,$=K.geometry,ne=b.isMeshStandardMaterial?X.environment:null,Y=(b.isMeshStandardMaterial?t:e).get(b.envMap||ne),Se=Y&&Y.mapping===Ds?Y.image.height:null,ge=_[b.type];b.precision!==null&&(x=r.getMaxPrecision(b.precision),x!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",x,"instead."));const we=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,et=we!==void 0?we.length:0;let je=0;$.morphAttributes.position!==void 0&&(je=1),$.morphAttributes.normal!==void 0&&(je=2),$.morphAttributes.color!==void 0&&(je=3);let Z,ce,Re,xe;if(ge){const sn=Bn[ge];Z=sn.vertexShader,ce=sn.fragmentShader}else Z=b.vertexShader,ce=b.fragmentShader,l.update(b),Re=l.getVertexShaderID(b),xe=l.getFragmentShaderID(b);const Ge=i.getRenderTarget(),Ue=K.isInstancedMesh===!0,nt=K.isBatchedMesh===!0,ht=!!b.map,it=!!b.matcap,N=!!Y,Vt=!!b.aoMap,rt=!!b.lightMap,st=!!b.bumpMap,ke=!!b.normalMap,vt=!!b.displacementMap,Be=!!b.emissiveMap,R=!!b.metalnessMap,M=!!b.roughnessMap,G=b.anisotropy>0,J=b.clearcoat>0,se=b.dispersion>0,Q=b.iridescence>0,Le=b.sheen>0,pe=b.transmission>0,_e=G&&!!b.anisotropyMap,tt=J&&!!b.clearcoatMap,ue=J&&!!b.clearcoatNormalMap,Ae=J&&!!b.clearcoatRoughnessMap,Ve=Q&&!!b.iridescenceMap,qe=Q&&!!b.iridescenceThicknessMap,Ce=Le&&!!b.sheenColorMap,ot=Le&&!!b.sheenRoughnessMap,Ye=!!b.specularMap,yt=!!b.specularColorMap,O=!!b.specularIntensityMap,Ee=pe&&!!b.transmissionMap,j=pe&&!!b.thicknessMap,ie=!!b.gradientMap,ye=!!b.alphaMap,Te=b.alphaTest>0,lt=!!b.alphaHash,Lt=!!b.extensions;let an=Ai;b.toneMapped&&(Ge===null||Ge.isXRRenderTarget===!0)&&(an=i.toneMapping);const ut={shaderID:ge,shaderType:b.type,shaderName:b.name,vertexShader:Z,fragmentShader:ce,defines:b.defines,customVertexShaderID:Re,customFragmentShaderID:xe,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:x,batching:nt,batchingColor:nt&&K._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&K.instanceColor!==null,instancingMorph:Ue&&K.morphTexture!==null,supportsVertexTextures:g,outputColorSpace:Ge===null?i.outputColorSpace:Ge.isXRRenderTarget===!0?Ge.texture.colorSpace:Ni,alphaToCoverage:!!b.alphaToCoverage,map:ht,matcap:it,envMap:N,envMapMode:N&&Y.mapping,envMapCubeUVHeight:Se,aoMap:Vt,lightMap:rt,bumpMap:st,normalMap:ke,displacementMap:g&&vt,emissiveMap:Be,normalMapObjectSpace:ke&&b.normalMapType===Sf,normalMapTangentSpace:ke&&b.normalMapType===mu,metalnessMap:R,roughnessMap:M,anisotropy:G,anisotropyMap:_e,clearcoat:J,clearcoatMap:tt,clearcoatNormalMap:ue,clearcoatRoughnessMap:Ae,dispersion:se,iridescence:Q,iridescenceMap:Ve,iridescenceThicknessMap:qe,sheen:Le,sheenColorMap:Ce,sheenRoughnessMap:ot,specularMap:Ye,specularColorMap:yt,specularIntensityMap:O,transmission:pe,transmissionMap:Ee,thicknessMap:j,gradientMap:ie,opaque:b.transparent===!1&&b.blending===Pr&&b.alphaToCoverage===!1,alphaMap:ye,alphaTest:Te,alphaHash:lt,combine:b.combine,mapUv:ht&&m(b.map.channel),aoMapUv:Vt&&m(b.aoMap.channel),lightMapUv:rt&&m(b.lightMap.channel),bumpMapUv:st&&m(b.bumpMap.channel),normalMapUv:ke&&m(b.normalMap.channel),displacementMapUv:vt&&m(b.displacementMap.channel),emissiveMapUv:Be&&m(b.emissiveMap.channel),metalnessMapUv:R&&m(b.metalnessMap.channel),roughnessMapUv:M&&m(b.roughnessMap.channel),anisotropyMapUv:_e&&m(b.anisotropyMap.channel),clearcoatMapUv:tt&&m(b.clearcoatMap.channel),clearcoatNormalMapUv:ue&&m(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&m(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ve&&m(b.iridescenceMap.channel),iridescenceThicknessMapUv:qe&&m(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&m(b.sheenColorMap.channel),sheenRoughnessMapUv:ot&&m(b.sheenRoughnessMap.channel),specularMapUv:Ye&&m(b.specularMap.channel),specularColorMapUv:yt&&m(b.specularColorMap.channel),specularIntensityMapUv:O&&m(b.specularIntensityMap.channel),transmissionMapUv:Ee&&m(b.transmissionMap.channel),thicknessMapUv:j&&m(b.thicknessMap.channel),alphaMapUv:ye&&m(b.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(ke||G),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!$.attributes.uv&&(ht||ye),fog:!!te,useFog:b.fog===!0,fogExp2:!!te&&te.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:f,skinning:K.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:je,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&W.length>0,shadowMapType:i.shadowMap.type,toneMapping:an,decodeVideoTexture:ht&&b.map.isVideoTexture===!0&&mt.getTransfer(b.map.colorSpace)===Mt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Hn,flipSided:b.side===hn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Lt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&b.extensions.multiDraw===!0||nt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ut.vertexUv1s=c.has(1),ut.vertexUv2s=c.has(2),ut.vertexUv3s=c.has(3),c.clear(),ut}function E(b){const A=[];if(b.shaderID?A.push(b.shaderID):(A.push(b.customVertexShaderID),A.push(b.customFragmentShaderID)),b.defines!==void 0)for(const W in b.defines)A.push(W),A.push(b.defines[W]);return b.isRawShaderMaterial===!1&&(w(A,b),C(A,b),A.push(i.outputColorSpace)),A.push(b.customProgramCacheKey),A.join()}function w(b,A){b.push(A.precision),b.push(A.outputColorSpace),b.push(A.envMapMode),b.push(A.envMapCubeUVHeight),b.push(A.mapUv),b.push(A.alphaMapUv),b.push(A.lightMapUv),b.push(A.aoMapUv),b.push(A.bumpMapUv),b.push(A.normalMapUv),b.push(A.displacementMapUv),b.push(A.emissiveMapUv),b.push(A.metalnessMapUv),b.push(A.roughnessMapUv),b.push(A.anisotropyMapUv),b.push(A.clearcoatMapUv),b.push(A.clearcoatNormalMapUv),b.push(A.clearcoatRoughnessMapUv),b.push(A.iridescenceMapUv),b.push(A.iridescenceThicknessMapUv),b.push(A.sheenColorMapUv),b.push(A.sheenRoughnessMapUv),b.push(A.specularMapUv),b.push(A.specularColorMapUv),b.push(A.specularIntensityMapUv),b.push(A.transmissionMapUv),b.push(A.thicknessMapUv),b.push(A.combine),b.push(A.fogExp2),b.push(A.sizeAttenuation),b.push(A.morphTargetsCount),b.push(A.morphAttributeCount),b.push(A.numDirLights),b.push(A.numPointLights),b.push(A.numSpotLights),b.push(A.numSpotLightMaps),b.push(A.numHemiLights),b.push(A.numRectAreaLights),b.push(A.numDirLightShadows),b.push(A.numPointLightShadows),b.push(A.numSpotLightShadows),b.push(A.numSpotLightShadowsWithMaps),b.push(A.numLightProbes),b.push(A.shadowMapType),b.push(A.toneMapping),b.push(A.numClippingPlanes),b.push(A.numClipIntersection),b.push(A.depthPacking)}function C(b,A){o.disableAll(),A.supportsVertexTextures&&o.enable(0),A.instancing&&o.enable(1),A.instancingColor&&o.enable(2),A.instancingMorph&&o.enable(3),A.matcap&&o.enable(4),A.envMap&&o.enable(5),A.normalMapObjectSpace&&o.enable(6),A.normalMapTangentSpace&&o.enable(7),A.clearcoat&&o.enable(8),A.iridescence&&o.enable(9),A.alphaTest&&o.enable(10),A.vertexColors&&o.enable(11),A.vertexAlphas&&o.enable(12),A.vertexUv1s&&o.enable(13),A.vertexUv2s&&o.enable(14),A.vertexUv3s&&o.enable(15),A.vertexTangents&&o.enable(16),A.anisotropy&&o.enable(17),A.alphaHash&&o.enable(18),A.batching&&o.enable(19),A.dispersion&&o.enable(20),A.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reverseDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.alphaToCoverage&&o.enable(20),b.push(o.mask)}function F(b){const A=_[b.type];let W;if(A){const X=Bn[A];W=ep.clone(X.uniforms)}else W=b.uniforms;return W}function I(b,A){let W;for(let X=0,K=h.length;X<K;X++){const te=h[X];if(te.cacheKey===A){W=te,++W.usedTimes;break}}return W===void 0&&(W=new f2(i,A,b,a),h.push(W)),W}function P(b){if(--b.usedTimes===0){const A=h.indexOf(b);h[A]=h[h.length-1],h.pop(),b.destroy()}}function B(b){l.remove(b)}function ee(){l.dispose()}return{getParameters:p,getProgramCacheKey:E,getUniforms:F,acquireProgram:I,releaseProgram:P,releaseShaderCache:B,programs:h,dispose:ee}}function x2(){let i=new WeakMap;function e(s){return i.has(s)}function t(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function n(s){i.delete(s)}function r(s,o,l){i.get(s)[o]=l}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:a}}function _2(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Vc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function qc(){const i=[];let e=0;const t=[],n=[],r=[];function a(){e=0,t.length=0,n.length=0,r.length=0}function s(u,f,g,x,_,m){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:g,groupOrder:x,renderOrder:u.renderOrder,z:_,group:m},i[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=g,p.groupOrder=x,p.renderOrder=u.renderOrder,p.z=_,p.group=m),e++,p}function o(u,f,g,x,_,m){const p=s(u,f,g,x,_,m);g.transmission>0?n.push(p):g.transparent===!0?r.push(p):t.push(p)}function l(u,f,g,x,_,m){const p=s(u,f,g,x,_,m);g.transmission>0?n.unshift(p):g.transparent===!0?r.unshift(p):t.unshift(p)}function c(u,f){t.length>1&&t.sort(u||_2),n.length>1&&n.sort(f||Vc),r.length>1&&r.sort(f||Vc)}function h(){for(let u=e,f=i.length;u<f;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:r,init:a,push:o,unshift:l,finish:h,sort:c}}function y2(){let i=new WeakMap;function e(n,r){const a=i.get(n);let s;return a===void 0?(s=new qc,i.set(n,[s])):r>=a.length?(s=new qc,a.push(s)):s=a[r],s}function t(){i=new WeakMap}return{get:e,dispose:t}}function b2(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new at};break;case"SpotLight":t={position:new H,direction:new H,color:new at,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new at,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new at,groundColor:new at};break;case"RectAreaLight":t={color:new at,position:new H,halfWidth:new H,halfHeight:new H};break}return i[e.id]=t,t}}}function M2(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let S2=0;function w2(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function E2(i){const e=new b2,t=M2(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new H);const r=new H,a=new At,s=new At;function o(c){let h=0,u=0,f=0;for(let ee=0;ee<9;ee++)n.probe[ee].set(0,0,0);let g=0,x=0,_=0,m=0,p=0,E=0,w=0,C=0,F=0,I=0,P=0;c.sort(w2);for(let ee=0,b=c.length;ee<b;ee++){const A=c[ee],W=A.color,X=A.intensity,K=A.distance,te=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=W.r*X,u+=W.g*X,f+=W.b*X;else if(A.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(A.sh.coefficients[$],X);P++}else if(A.isDirectionalLight){const $=e.get(A);if($.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ne=A.shadow,Y=t.get(A);Y.shadowIntensity=ne.intensity,Y.shadowBias=ne.bias,Y.shadowNormalBias=ne.normalBias,Y.shadowRadius=ne.radius,Y.shadowMapSize=ne.mapSize,n.directionalShadow[g]=Y,n.directionalShadowMap[g]=te,n.directionalShadowMatrix[g]=A.shadow.matrix,E++}n.directional[g]=$,g++}else if(A.isSpotLight){const $=e.get(A);$.position.setFromMatrixPosition(A.matrixWorld),$.color.copy(W).multiplyScalar(X),$.distance=K,$.coneCos=Math.cos(A.angle),$.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),$.decay=A.decay,n.spot[_]=$;const ne=A.shadow;if(A.map&&(n.spotLightMap[F]=A.map,F++,ne.updateMatrices(A),A.castShadow&&I++),n.spotLightMatrix[_]=ne.matrix,A.castShadow){const Y=t.get(A);Y.shadowIntensity=ne.intensity,Y.shadowBias=ne.bias,Y.shadowNormalBias=ne.normalBias,Y.shadowRadius=ne.radius,Y.shadowMapSize=ne.mapSize,n.spotShadow[_]=Y,n.spotShadowMap[_]=te,C++}_++}else if(A.isRectAreaLight){const $=e.get(A);$.color.copy(W).multiplyScalar(X),$.halfWidth.set(A.width*.5,0,0),$.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=$,m++}else if(A.isPointLight){const $=e.get(A);if($.color.copy(A.color).multiplyScalar(A.intensity),$.distance=A.distance,$.decay=A.decay,A.castShadow){const ne=A.shadow,Y=t.get(A);Y.shadowIntensity=ne.intensity,Y.shadowBias=ne.bias,Y.shadowNormalBias=ne.normalBias,Y.shadowRadius=ne.radius,Y.shadowMapSize=ne.mapSize,Y.shadowCameraNear=ne.camera.near,Y.shadowCameraFar=ne.camera.far,n.pointShadow[x]=Y,n.pointShadowMap[x]=te,n.pointShadowMatrix[x]=A.shadow.matrix,w++}n.point[x]=$,x++}else if(A.isHemisphereLight){const $=e.get(A);$.skyColor.copy(A.color).multiplyScalar(X),$.groundColor.copy(A.groundColor).multiplyScalar(X),n.hemi[p]=$,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const B=n.hash;(B.directionalLength!==g||B.pointLength!==x||B.spotLength!==_||B.rectAreaLength!==m||B.hemiLength!==p||B.numDirectionalShadows!==E||B.numPointShadows!==w||B.numSpotShadows!==C||B.numSpotMaps!==F||B.numLightProbes!==P)&&(n.directional.length=g,n.spot.length=_,n.rectArea.length=m,n.point.length=x,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=C,n.spotShadowMap.length=C,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=C+F-I,n.spotLightMap.length=F,n.numSpotLightShadowsWithMaps=I,n.numLightProbes=P,B.directionalLength=g,B.pointLength=x,B.spotLength=_,B.rectAreaLength=m,B.hemiLength=p,B.numDirectionalShadows=E,B.numPointShadows=w,B.numSpotShadows=C,B.numSpotMaps=F,B.numLightProbes=P,n.version=S2++)}function l(c,h){let u=0,f=0,g=0,x=0,_=0;const m=h.matrixWorldInverse;for(let p=0,E=c.length;p<E;p++){const w=c[p];if(w.isDirectionalLight){const C=n.directional[u];C.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(m),u++}else if(w.isSpotLight){const C=n.spot[g];C.position.setFromMatrixPosition(w.matrixWorld),C.position.applyMatrix4(m),C.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(m),g++}else if(w.isRectAreaLight){const C=n.rectArea[x];C.position.setFromMatrixPosition(w.matrixWorld),C.position.applyMatrix4(m),s.identity(),a.copy(w.matrixWorld),a.premultiply(m),s.extractRotation(a),C.halfWidth.set(w.width*.5,0,0),C.halfHeight.set(0,w.height*.5,0),C.halfWidth.applyMatrix4(s),C.halfHeight.applyMatrix4(s),x++}else if(w.isPointLight){const C=n.point[f];C.position.setFromMatrixPosition(w.matrixWorld),C.position.applyMatrix4(m),f++}else if(w.isHemisphereLight){const C=n.hemi[_];C.direction.setFromMatrixPosition(w.matrixWorld),C.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Wc(i){const e=new E2(i),t=[],n=[];function r(h){c.camera=h,t.length=0,n.length=0}function a(h){t.push(h)}function s(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:s}}function T2(i){let e=new WeakMap;function t(r,a=0){const s=e.get(r);let o;return s===void 0?(o=new Wc(i),e.set(r,[o])):a>=s.length?(o=new Wc(i),s.push(o)):o=s[a],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class A2 extends qr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=bf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class C2 extends qr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const R2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,P2=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function D2(i,e,t){let n=new Ml;const r=new Ke,a=new Ke,s=new Pt,o=new A2({depthPacking:Mf}),l=new C2,c={},h=t.maxTextureSize,u={[Ci]:hn,[hn]:Ci,[Hn]:Hn},f=new Ri({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ke},radius:{value:4}},vertexShader:R2,fragmentShader:P2}),g=f.clone();g.defines.HORIZONTAL_PASS=1;const x=new On;x.setAttribute("position",new Fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new En(x,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nu;let p=this.type;this.render=function(I,P,B){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||I.length===0)return;const ee=i.getRenderTarget(),b=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),W=i.state;W.setBlending(Ti),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const X=p!==ei&&this.type===ei,K=p===ei&&this.type!==ei;for(let te=0,$=I.length;te<$;te++){const ne=I[te],Y=ne.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",ne,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;r.copy(Y.mapSize);const Se=Y.getFrameExtents();if(r.multiply(Se),a.copy(Y.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(a.x=Math.floor(h/Se.x),r.x=a.x*Se.x,Y.mapSize.x=a.x),r.y>h&&(a.y=Math.floor(h/Se.y),r.y=a.y*Se.y,Y.mapSize.y=a.y)),Y.map===null||X===!0||K===!0){const we=this.type!==ei?{minFilter:wn,magFilter:wn}:{};Y.map!==null&&Y.map.dispose(),Y.map=new ar(r.x,r.y,we),Y.map.texture.name=ne.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const ge=Y.getViewportCount();for(let we=0;we<ge;we++){const et=Y.getViewport(we);s.set(a.x*et.x,a.y*et.y,a.x*et.z,a.y*et.w),W.viewport(s),Y.updateMatrices(ne,we),n=Y.getFrustum(),C(P,B,Y.camera,ne,this.type)}Y.isPointLightShadow!==!0&&this.type===ei&&E(Y,B),Y.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(ee,b,A)};function E(I,P){const B=e.update(_);f.defines.VSM_SAMPLES!==I.blurSamples&&(f.defines.VSM_SAMPLES=I.blurSamples,g.defines.VSM_SAMPLES=I.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new ar(r.x,r.y)),f.uniforms.shadow_pass.value=I.map.texture,f.uniforms.resolution.value=I.mapSize,f.uniforms.radius.value=I.radius,i.setRenderTarget(I.mapPass),i.clear(),i.renderBufferDirect(P,null,B,f,_,null),g.uniforms.shadow_pass.value=I.mapPass.texture,g.uniforms.resolution.value=I.mapSize,g.uniforms.radius.value=I.radius,i.setRenderTarget(I.map),i.clear(),i.renderBufferDirect(P,null,B,g,_,null)}function w(I,P,B,ee){let b=null;const A=B.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(A!==void 0)b=A;else if(b=B.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const W=b.uuid,X=P.uuid;let K=c[W];K===void 0&&(K={},c[W]=K);let te=K[X];te===void 0&&(te=b.clone(),K[X]=te,P.addEventListener("dispose",F)),b=te}if(b.visible=P.visible,b.wireframe=P.wireframe,ee===ei?b.side=P.shadowSide!==null?P.shadowSide:P.side:b.side=P.shadowSide!==null?P.shadowSide:u[P.side],b.alphaMap=P.alphaMap,b.alphaTest=P.alphaTest,b.map=P.map,b.clipShadows=P.clipShadows,b.clippingPlanes=P.clippingPlanes,b.clipIntersection=P.clipIntersection,b.displacementMap=P.displacementMap,b.displacementScale=P.displacementScale,b.displacementBias=P.displacementBias,b.wireframeLinewidth=P.wireframeLinewidth,b.linewidth=P.linewidth,B.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const W=i.properties.get(b);W.light=B}return b}function C(I,P,B,ee,b){if(I.visible===!1)return;if(I.layers.test(P.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&b===ei)&&(!I.frustumCulled||n.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,I.matrixWorld);const X=e.update(I),K=I.material;if(Array.isArray(K)){const te=X.groups;for(let $=0,ne=te.length;$<ne;$++){const Y=te[$],Se=K[Y.materialIndex];if(Se&&Se.visible){const ge=w(I,Se,ee,b);I.onBeforeShadow(i,I,P,B,X,ge,Y),i.renderBufferDirect(B,null,X,ge,I,Y),I.onAfterShadow(i,I,P,B,X,ge,Y)}}}else if(K.visible){const te=w(I,K,ee,b);I.onBeforeShadow(i,I,P,B,X,te,null),i.renderBufferDirect(B,null,X,te,I,null),I.onAfterShadow(i,I,P,B,X,te,null)}}const W=I.children;for(let X=0,K=W.length;X<K;X++)C(W[X],P,B,ee,b)}function F(I){I.target.removeEventListener("dispose",F);for(const B in c){const ee=c[B],b=I.target.uuid;b in ee&&(ee[b].dispose(),delete ee[b])}}}const L2={[r0]:a0,[s0]:c0,[o0]:h0,[Ur]:l0,[a0]:r0,[c0]:s0,[h0]:o0,[l0]:Ur};function I2(i){function e(){let O=!1;const Ee=new Pt;let j=null;const ie=new Pt(0,0,0,0);return{setMask:function(ye){j!==ye&&!O&&(i.colorMask(ye,ye,ye,ye),j=ye)},setLocked:function(ye){O=ye},setClear:function(ye,Te,lt,Lt,an){an===!0&&(ye*=Lt,Te*=Lt,lt*=Lt),Ee.set(ye,Te,lt,Lt),ie.equals(Ee)===!1&&(i.clearColor(ye,Te,lt,Lt),ie.copy(Ee))},reset:function(){O=!1,j=null,ie.set(-1,0,0,0)}}}function t(){let O=!1,Ee=!1,j=null,ie=null,ye=null;return{setReversed:function(Te){Ee=Te},setTest:function(Te){Te?Re(i.DEPTH_TEST):xe(i.DEPTH_TEST)},setMask:function(Te){j!==Te&&!O&&(i.depthMask(Te),j=Te)},setFunc:function(Te){if(Ee&&(Te=L2[Te]),ie!==Te){switch(Te){case r0:i.depthFunc(i.NEVER);break;case a0:i.depthFunc(i.ALWAYS);break;case s0:i.depthFunc(i.LESS);break;case Ur:i.depthFunc(i.LEQUAL);break;case o0:i.depthFunc(i.EQUAL);break;case l0:i.depthFunc(i.GEQUAL);break;case c0:i.depthFunc(i.GREATER);break;case h0:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ie=Te}},setLocked:function(Te){O=Te},setClear:function(Te){ye!==Te&&(i.clearDepth(Te),ye=Te)},reset:function(){O=!1,j=null,ie=null,ye=null}}}function n(){let O=!1,Ee=null,j=null,ie=null,ye=null,Te=null,lt=null,Lt=null,an=null;return{setTest:function(ut){O||(ut?Re(i.STENCIL_TEST):xe(i.STENCIL_TEST))},setMask:function(ut){Ee!==ut&&!O&&(i.stencilMask(ut),Ee=ut)},setFunc:function(ut,sn,$n){(j!==ut||ie!==sn||ye!==$n)&&(i.stencilFunc(ut,sn,$n),j=ut,ie=sn,ye=$n)},setOp:function(ut,sn,$n){(Te!==ut||lt!==sn||Lt!==$n)&&(i.stencilOp(ut,sn,$n),Te=ut,lt=sn,Lt=$n)},setLocked:function(ut){O=ut},setClear:function(ut){an!==ut&&(i.clearStencil(ut),an=ut)},reset:function(){O=!1,Ee=null,j=null,ie=null,ye=null,Te=null,lt=null,Lt=null,an=null}}}const r=new e,a=new t,s=new n,o=new WeakMap,l=new WeakMap;let c={},h={},u=new WeakMap,f=[],g=null,x=!1,_=null,m=null,p=null,E=null,w=null,C=null,F=null,I=new at(0,0,0),P=0,B=!1,ee=null,b=null,A=null,W=null,X=null;const K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let te=!1,$=0;const ne=i.getParameter(i.VERSION);ne.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(ne)[1]),te=$>=1):ne.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),te=$>=2);let Y=null,Se={};const ge=i.getParameter(i.SCISSOR_BOX),we=i.getParameter(i.VIEWPORT),et=new Pt().fromArray(ge),je=new Pt().fromArray(we);function Z(O,Ee,j,ie){const ye=new Uint8Array(4),Te=i.createTexture();i.bindTexture(O,Te),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let lt=0;lt<j;lt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(Ee,0,i.RGBA,1,1,ie,0,i.RGBA,i.UNSIGNED_BYTE,ye):i.texImage2D(Ee+lt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ye);return Te}const ce={};ce[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),ce[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ce[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),s.setClear(0),Re(i.DEPTH_TEST),a.setFunc(Ur),rt(!1),st(Ql),Re(i.CULL_FACE),N(Ti);function Re(O){c[O]!==!0&&(i.enable(O),c[O]=!0)}function xe(O){c[O]!==!1&&(i.disable(O),c[O]=!1)}function Ge(O,Ee){return h[O]!==Ee?(i.bindFramebuffer(O,Ee),h[O]=Ee,O===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Ee),O===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Ee),!0):!1}function Ue(O,Ee){let j=f,ie=!1;if(O){j=u.get(Ee),j===void 0&&(j=[],u.set(Ee,j));const ye=O.textures;if(j.length!==ye.length||j[0]!==i.COLOR_ATTACHMENT0){for(let Te=0,lt=ye.length;Te<lt;Te++)j[Te]=i.COLOR_ATTACHMENT0+Te;j.length=ye.length,ie=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,ie=!0);ie&&i.drawBuffers(j)}function nt(O){return g!==O?(i.useProgram(O),g=O,!0):!1}const ht={[Yi]:i.FUNC_ADD,[$d]:i.FUNC_SUBTRACT,[Yd]:i.FUNC_REVERSE_SUBTRACT};ht[jd]=i.MIN,ht[Kd]=i.MAX;const it={[Zd]:i.ZERO,[Jd]:i.ONE,[Qd]:i.SRC_COLOR,[n0]:i.SRC_ALPHA,[sf]:i.SRC_ALPHA_SATURATE,[rf]:i.DST_COLOR,[tf]:i.DST_ALPHA,[ef]:i.ONE_MINUS_SRC_COLOR,[i0]:i.ONE_MINUS_SRC_ALPHA,[af]:i.ONE_MINUS_DST_COLOR,[nf]:i.ONE_MINUS_DST_ALPHA,[of]:i.CONSTANT_COLOR,[lf]:i.ONE_MINUS_CONSTANT_COLOR,[cf]:i.CONSTANT_ALPHA,[hf]:i.ONE_MINUS_CONSTANT_ALPHA};function N(O,Ee,j,ie,ye,Te,lt,Lt,an,ut){if(O===Ti){x===!0&&(xe(i.BLEND),x=!1);return}if(x===!1&&(Re(i.BLEND),x=!0),O!==Xd){if(O!==_||ut!==B){if((m!==Yi||w!==Yi)&&(i.blendEquation(i.FUNC_ADD),m=Yi,w=Yi),ut)switch(O){case Pr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ec:i.blendFunc(i.ONE,i.ONE);break;case tc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case nc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Pr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ec:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case tc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case nc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}p=null,E=null,C=null,F=null,I.set(0,0,0),P=0,_=O,B=ut}return}ye=ye||Ee,Te=Te||j,lt=lt||ie,(Ee!==m||ye!==w)&&(i.blendEquationSeparate(ht[Ee],ht[ye]),m=Ee,w=ye),(j!==p||ie!==E||Te!==C||lt!==F)&&(i.blendFuncSeparate(it[j],it[ie],it[Te],it[lt]),p=j,E=ie,C=Te,F=lt),(Lt.equals(I)===!1||an!==P)&&(i.blendColor(Lt.r,Lt.g,Lt.b,an),I.copy(Lt),P=an),_=O,B=!1}function Vt(O,Ee){O.side===Hn?xe(i.CULL_FACE):Re(i.CULL_FACE);let j=O.side===hn;Ee&&(j=!j),rt(j),O.blending===Pr&&O.transparent===!1?N(Ti):N(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);const ie=O.stencilWrite;s.setTest(ie),ie&&(s.setMask(O.stencilWriteMask),s.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),s.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),vt(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?Re(i.SAMPLE_ALPHA_TO_COVERAGE):xe(i.SAMPLE_ALPHA_TO_COVERAGE)}function rt(O){ee!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),ee=O)}function st(O){O!==Vd?(Re(i.CULL_FACE),O!==b&&(O===Ql?i.cullFace(i.BACK):O===qd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):xe(i.CULL_FACE),b=O}function ke(O){O!==A&&(te&&i.lineWidth(O),A=O)}function vt(O,Ee,j){O?(Re(i.POLYGON_OFFSET_FILL),(W!==Ee||X!==j)&&(i.polygonOffset(Ee,j),W=Ee,X=j)):xe(i.POLYGON_OFFSET_FILL)}function Be(O){O?Re(i.SCISSOR_TEST):xe(i.SCISSOR_TEST)}function R(O){O===void 0&&(O=i.TEXTURE0+K-1),Y!==O&&(i.activeTexture(O),Y=O)}function M(O,Ee,j){j===void 0&&(Y===null?j=i.TEXTURE0+K-1:j=Y);let ie=Se[j];ie===void 0&&(ie={type:void 0,texture:void 0},Se[j]=ie),(ie.type!==O||ie.texture!==Ee)&&(Y!==j&&(i.activeTexture(j),Y=j),i.bindTexture(O,Ee||ce[O]),ie.type=O,ie.texture=Ee)}function G(){const O=Se[Y];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function J(){try{i.compressedTexImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function se(){try{i.compressedTexImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Q(){try{i.texSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Le(){try{i.texSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function pe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function _e(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function tt(){try{i.texStorage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ue(){try{i.texStorage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ae(){try{i.texImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ve(){try{i.texImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function qe(O){et.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),et.copy(O))}function Ce(O){je.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),je.copy(O))}function ot(O,Ee){let j=l.get(Ee);j===void 0&&(j=new WeakMap,l.set(Ee,j));let ie=j.get(O);ie===void 0&&(ie=i.getUniformBlockIndex(Ee,O.name),j.set(O,ie))}function Ye(O,Ee){const ie=l.get(Ee).get(O);o.get(Ee)!==ie&&(i.uniformBlockBinding(Ee,ie,O.__bindingPointIndex),o.set(Ee,ie))}function yt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},Y=null,Se={},h={},u=new WeakMap,f=[],g=null,x=!1,_=null,m=null,p=null,E=null,w=null,C=null,F=null,I=new at(0,0,0),P=0,B=!1,ee=null,b=null,A=null,W=null,X=null,et.set(0,0,i.canvas.width,i.canvas.height),je.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),s.reset()}return{buffers:{color:r,depth:a,stencil:s},enable:Re,disable:xe,bindFramebuffer:Ge,drawBuffers:Ue,useProgram:nt,setBlending:N,setMaterial:Vt,setFlipSided:rt,setCullFace:st,setLineWidth:ke,setPolygonOffset:vt,setScissorTest:Be,activeTexture:R,bindTexture:M,unbindTexture:G,compressedTexImage2D:J,compressedTexImage3D:se,texImage2D:Ae,texImage3D:Ve,updateUBOMapping:ot,uniformBlockBinding:Ye,texStorage2D:tt,texStorage3D:ue,texSubImage2D:Q,texSubImage3D:Le,compressedTexSubImage2D:pe,compressedTexSubImage3D:_e,scissor:qe,viewport:Ce,reset:yt}}function Xc(i,e,t,n){const r=N2(n);switch(t){case lu:return i*e;case hu:return i*e;case uu:return i*e*2;case du:return i*e/r.components*r.byteLength;case vl:return i*e/r.components*r.byteLength;case fu:return i*e*2/r.components*r.byteLength;case xl:return i*e*2/r.components*r.byteLength;case cu:return i*e*3/r.components*r.byteLength;case Un:return i*e*4/r.components*r.byteLength;case _l:return i*e*4/r.components*r.byteLength;case cs:case hs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case us:case ds:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case g0:case x0:return Math.max(i,16)*Math.max(e,8)/4;case m0:case v0:return Math.max(i,8)*Math.max(e,8)/2;case _0:case y0:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case b0:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case M0:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case S0:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case w0:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case E0:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case T0:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case A0:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case C0:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case R0:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case P0:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case D0:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case L0:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case I0:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case N0:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case U0:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case fs:case F0:case O0:return Math.ceil(i/4)*Math.ceil(e/4)*16;case pu:case k0:return Math.ceil(i/4)*Math.ceil(e/4)*8;case B0:case z0:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function N2(i){switch(i){case ci:case au:return{byteLength:1,components:1};case ua:case su:case va:return{byteLength:2,components:1};case ml:case gl:return{byteLength:2,components:4};case rr:case pl:case ii:return{byteLength:4,components:1};case ou:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function U2(i,e,t,n,r,a,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ke,h=new WeakMap;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,M){return g?new OffscreenCanvas(R,M):ws("canvas")}function _(R,M,G){let J=1;const se=Be(R);if((se.width>G||se.height>G)&&(J=G/Math.max(se.width,se.height)),J<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Q=Math.floor(J*se.width),Le=Math.floor(J*se.height);u===void 0&&(u=x(Q,Le));const pe=M?x(Q,Le):u;return pe.width=Q,pe.height=Le,pe.getContext("2d").drawImage(R,0,0,Q,Le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+Q+"x"+Le+")."),pe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==wn&&R.minFilter!==In}function p(R){i.generateMipmap(R)}function E(R,M,G,J,se=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Q=M;if(M===i.RED&&(G===i.FLOAT&&(Q=i.R32F),G===i.HALF_FLOAT&&(Q=i.R16F),G===i.UNSIGNED_BYTE&&(Q=i.R8)),M===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Q=i.R8UI),G===i.UNSIGNED_SHORT&&(Q=i.R16UI),G===i.UNSIGNED_INT&&(Q=i.R32UI),G===i.BYTE&&(Q=i.R8I),G===i.SHORT&&(Q=i.R16I),G===i.INT&&(Q=i.R32I)),M===i.RG&&(G===i.FLOAT&&(Q=i.RG32F),G===i.HALF_FLOAT&&(Q=i.RG16F),G===i.UNSIGNED_BYTE&&(Q=i.RG8)),M===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Q=i.RG8UI),G===i.UNSIGNED_SHORT&&(Q=i.RG16UI),G===i.UNSIGNED_INT&&(Q=i.RG32UI),G===i.BYTE&&(Q=i.RG8I),G===i.SHORT&&(Q=i.RG16I),G===i.INT&&(Q=i.RG32I)),M===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),G===i.UNSIGNED_INT&&(Q=i.RGB32UI),G===i.BYTE&&(Q=i.RGB8I),G===i.SHORT&&(Q=i.RGB16I),G===i.INT&&(Q=i.RGB32I)),M===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),G===i.UNSIGNED_INT&&(Q=i.RGBA32UI),G===i.BYTE&&(Q=i.RGBA8I),G===i.SHORT&&(Q=i.RGBA16I),G===i.INT&&(Q=i.RGBA32I)),M===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),M===i.RGBA){const Le=se?ys:mt.getTransfer(J);G===i.FLOAT&&(Q=i.RGBA32F),G===i.HALF_FLOAT&&(Q=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Q=Le===Mt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function w(R,M){let G;return R?M===null||M===rr||M===kr?G=i.DEPTH24_STENCIL8:M===ii?G=i.DEPTH32F_STENCIL8:M===ua&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===rr||M===kr?G=i.DEPTH_COMPONENT24:M===ii?G=i.DEPTH_COMPONENT32F:M===ua&&(G=i.DEPTH_COMPONENT16),G}function C(R,M){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==wn&&R.minFilter!==In?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function F(R){const M=R.target;M.removeEventListener("dispose",F),P(M),M.isVideoTexture&&h.delete(M)}function I(R){const M=R.target;M.removeEventListener("dispose",I),ee(M)}function P(R){const M=n.get(R);if(M.__webglInit===void 0)return;const G=R.source,J=f.get(G);if(J){const se=J[M.__cacheKey];se.usedTimes--,se.usedTimes===0&&B(R),Object.keys(J).length===0&&f.delete(G)}n.remove(R)}function B(R){const M=n.get(R);i.deleteTexture(M.__webglTexture);const G=R.source,J=f.get(G);delete J[M.__cacheKey],s.memory.textures--}function ee(R){const M=n.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(M.__webglFramebuffer[J]))for(let se=0;se<M.__webglFramebuffer[J].length;se++)i.deleteFramebuffer(M.__webglFramebuffer[J][se]);else i.deleteFramebuffer(M.__webglFramebuffer[J]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[J])}else{if(Array.isArray(M.__webglFramebuffer))for(let J=0;J<M.__webglFramebuffer.length;J++)i.deleteFramebuffer(M.__webglFramebuffer[J]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let J=0;J<M.__webglColorRenderbuffer.length;J++)M.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[J]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const G=R.textures;for(let J=0,se=G.length;J<se;J++){const Q=n.get(G[J]);Q.__webglTexture&&(i.deleteTexture(Q.__webglTexture),s.memory.textures--),n.remove(G[J])}n.remove(R)}let b=0;function A(){b=0}function W(){const R=b;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),b+=1,R}function X(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function K(R,M){const G=n.get(R);if(R.isVideoTexture&&ke(R),R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){const J=R.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{je(G,R,M);return}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+M)}function te(R,M){const G=n.get(R);if(R.version>0&&G.__version!==R.version){je(G,R,M);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+M)}function $(R,M){const G=n.get(R);if(R.version>0&&G.__version!==R.version){je(G,R,M);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+M)}function ne(R,M){const G=n.get(R);if(R.version>0&&G.__version!==R.version){Z(G,R,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+M)}const Y={[f0]:i.REPEAT,[Ji]:i.CLAMP_TO_EDGE,[p0]:i.MIRRORED_REPEAT},Se={[wn]:i.NEAREST,[yf]:i.NEAREST_MIPMAP_NEAREST,[Ta]:i.NEAREST_MIPMAP_LINEAR,[In]:i.LINEAR,[Ks]:i.LINEAR_MIPMAP_NEAREST,[Qi]:i.LINEAR_MIPMAP_LINEAR},ge={[wf]:i.NEVER,[Pf]:i.ALWAYS,[Ef]:i.LESS,[gu]:i.LEQUAL,[Tf]:i.EQUAL,[Rf]:i.GEQUAL,[Af]:i.GREATER,[Cf]:i.NOTEQUAL};function we(R,M){if(M.type===ii&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===In||M.magFilter===Ks||M.magFilter===Ta||M.magFilter===Qi||M.minFilter===In||M.minFilter===Ks||M.minFilter===Ta||M.minFilter===Qi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,Y[M.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,Y[M.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,Y[M.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Se[M.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Se[M.minFilter]),M.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ge[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===wn||M.minFilter!==Ta&&M.minFilter!==Qi||M.type===ii&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function et(R,M){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",F));const J=M.source;let se=f.get(J);se===void 0&&(se={},f.set(J,se));const Q=X(M);if(Q!==R.__cacheKey){se[Q]===void 0&&(se[Q]={texture:i.createTexture(),usedTimes:0},s.memory.textures++,G=!0),se[Q].usedTimes++;const Le=se[R.__cacheKey];Le!==void 0&&(se[R.__cacheKey].usedTimes--,Le.usedTimes===0&&B(M)),R.__cacheKey=Q,R.__webglTexture=se[Q].texture}return G}function je(R,M,G){let J=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(J=i.TEXTURE_3D);const se=et(R,M),Q=M.source;t.bindTexture(J,R.__webglTexture,i.TEXTURE0+G);const Le=n.get(Q);if(Q.version!==Le.__version||se===!0){t.activeTexture(i.TEXTURE0+G);const pe=mt.getPrimaries(mt.workingColorSpace),_e=M.colorSpace===wi?null:mt.getPrimaries(M.colorSpace),tt=M.colorSpace===wi||pe===_e?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);let ue=_(M.image,!1,r.maxTextureSize);ue=vt(M,ue);const Ae=a.convert(M.format,M.colorSpace),Ve=a.convert(M.type);let qe=E(M.internalFormat,Ae,Ve,M.colorSpace,M.isVideoTexture);we(J,M);let Ce;const ot=M.mipmaps,Ye=M.isVideoTexture!==!0,yt=Le.__version===void 0||se===!0,O=Q.dataReady,Ee=C(M,ue);if(M.isDepthTexture)qe=w(M.format===Br,M.type),yt&&(Ye?t.texStorage2D(i.TEXTURE_2D,1,qe,ue.width,ue.height):t.texImage2D(i.TEXTURE_2D,0,qe,ue.width,ue.height,0,Ae,Ve,null));else if(M.isDataTexture)if(ot.length>0){Ye&&yt&&t.texStorage2D(i.TEXTURE_2D,Ee,qe,ot[0].width,ot[0].height);for(let j=0,ie=ot.length;j<ie;j++)Ce=ot[j],Ye?O&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,Ce.width,Ce.height,Ae,Ve,Ce.data):t.texImage2D(i.TEXTURE_2D,j,qe,Ce.width,Ce.height,0,Ae,Ve,Ce.data);M.generateMipmaps=!1}else Ye?(yt&&t.texStorage2D(i.TEXTURE_2D,Ee,qe,ue.width,ue.height),O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue.width,ue.height,Ae,Ve,ue.data)):t.texImage2D(i.TEXTURE_2D,0,qe,ue.width,ue.height,0,Ae,Ve,ue.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ye&&yt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ee,qe,ot[0].width,ot[0].height,ue.depth);for(let j=0,ie=ot.length;j<ie;j++)if(Ce=ot[j],M.format!==Un)if(Ae!==null)if(Ye){if(O)if(M.layerUpdates.size>0){const ye=Xc(Ce.width,Ce.height,M.format,M.type);for(const Te of M.layerUpdates){const lt=Ce.data.subarray(Te*ye/Ce.data.BYTES_PER_ELEMENT,(Te+1)*ye/Ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,Te,Ce.width,Ce.height,1,Ae,lt,0,0)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,Ce.width,Ce.height,ue.depth,Ae,Ce.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,qe,Ce.width,Ce.height,ue.depth,0,Ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ye?O&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,Ce.width,Ce.height,ue.depth,Ae,Ve,Ce.data):t.texImage3D(i.TEXTURE_2D_ARRAY,j,qe,Ce.width,Ce.height,ue.depth,0,Ae,Ve,Ce.data)}else{Ye&&yt&&t.texStorage2D(i.TEXTURE_2D,Ee,qe,ot[0].width,ot[0].height);for(let j=0,ie=ot.length;j<ie;j++)Ce=ot[j],M.format!==Un?Ae!==null?Ye?O&&t.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,Ce.width,Ce.height,Ae,Ce.data):t.compressedTexImage2D(i.TEXTURE_2D,j,qe,Ce.width,Ce.height,0,Ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?O&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,Ce.width,Ce.height,Ae,Ve,Ce.data):t.texImage2D(i.TEXTURE_2D,j,qe,Ce.width,Ce.height,0,Ae,Ve,Ce.data)}else if(M.isDataArrayTexture)if(Ye){if(yt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ee,qe,ue.width,ue.height,ue.depth),O)if(M.layerUpdates.size>0){const j=Xc(ue.width,ue.height,M.format,M.type);for(const ie of M.layerUpdates){const ye=ue.data.subarray(ie*j/ue.data.BYTES_PER_ELEMENT,(ie+1)*j/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ie,ue.width,ue.height,1,Ae,Ve,ye)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Ae,Ve,ue.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,qe,ue.width,ue.height,ue.depth,0,Ae,Ve,ue.data);else if(M.isData3DTexture)Ye?(yt&&t.texStorage3D(i.TEXTURE_3D,Ee,qe,ue.width,ue.height,ue.depth),O&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Ae,Ve,ue.data)):t.texImage3D(i.TEXTURE_3D,0,qe,ue.width,ue.height,ue.depth,0,Ae,Ve,ue.data);else if(M.isFramebufferTexture){if(yt)if(Ye)t.texStorage2D(i.TEXTURE_2D,Ee,qe,ue.width,ue.height);else{let j=ue.width,ie=ue.height;for(let ye=0;ye<Ee;ye++)t.texImage2D(i.TEXTURE_2D,ye,qe,j,ie,0,Ae,Ve,null),j>>=1,ie>>=1}}else if(ot.length>0){if(Ye&&yt){const j=Be(ot[0]);t.texStorage2D(i.TEXTURE_2D,Ee,qe,j.width,j.height)}for(let j=0,ie=ot.length;j<ie;j++)Ce=ot[j],Ye?O&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,Ae,Ve,Ce):t.texImage2D(i.TEXTURE_2D,j,qe,Ae,Ve,Ce);M.generateMipmaps=!1}else if(Ye){if(yt){const j=Be(ue);t.texStorage2D(i.TEXTURE_2D,Ee,qe,j.width,j.height)}O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ae,Ve,ue)}else t.texImage2D(i.TEXTURE_2D,0,qe,Ae,Ve,ue);m(M)&&p(J),Le.__version=Q.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Z(R,M,G){if(M.image.length!==6)return;const J=et(R,M),se=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+G);const Q=n.get(se);if(se.version!==Q.__version||J===!0){t.activeTexture(i.TEXTURE0+G);const Le=mt.getPrimaries(mt.workingColorSpace),pe=M.colorSpace===wi?null:mt.getPrimaries(M.colorSpace),_e=M.colorSpace===wi||Le===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const tt=M.isCompressedTexture||M.image[0].isCompressedTexture,ue=M.image[0]&&M.image[0].isDataTexture,Ae=[];for(let ie=0;ie<6;ie++)!tt&&!ue?Ae[ie]=_(M.image[ie],!0,r.maxCubemapSize):Ae[ie]=ue?M.image[ie].image:M.image[ie],Ae[ie]=vt(M,Ae[ie]);const Ve=Ae[0],qe=a.convert(M.format,M.colorSpace),Ce=a.convert(M.type),ot=E(M.internalFormat,qe,Ce,M.colorSpace),Ye=M.isVideoTexture!==!0,yt=Q.__version===void 0||J===!0,O=se.dataReady;let Ee=C(M,Ve);we(i.TEXTURE_CUBE_MAP,M);let j;if(tt){Ye&&yt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ee,ot,Ve.width,Ve.height);for(let ie=0;ie<6;ie++){j=Ae[ie].mipmaps;for(let ye=0;ye<j.length;ye++){const Te=j[ye];M.format!==Un?qe!==null?Ye?O&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ye,0,0,Te.width,Te.height,qe,Te.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ye,ot,Te.width,Te.height,0,Te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ye?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ye,0,0,Te.width,Te.height,qe,Ce,Te.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ye,ot,Te.width,Te.height,0,qe,Ce,Te.data)}}}else{if(j=M.mipmaps,Ye&&yt){j.length>0&&Ee++;const ie=Be(Ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ee,ot,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(ue){Ye?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Ae[ie].width,Ae[ie].height,qe,Ce,Ae[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,ot,Ae[ie].width,Ae[ie].height,0,qe,Ce,Ae[ie].data);for(let ye=0;ye<j.length;ye++){const lt=j[ye].image[ie].image;Ye?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ye+1,0,0,lt.width,lt.height,qe,Ce,lt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ye+1,ot,lt.width,lt.height,0,qe,Ce,lt.data)}}else{Ye?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,qe,Ce,Ae[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,ot,qe,Ce,Ae[ie]);for(let ye=0;ye<j.length;ye++){const Te=j[ye];Ye?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ye+1,0,0,qe,Ce,Te.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ye+1,ot,qe,Ce,Te.image[ie])}}}m(M)&&p(i.TEXTURE_CUBE_MAP),Q.__version=se.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function ce(R,M,G,J,se,Q){const Le=a.convert(G.format,G.colorSpace),pe=a.convert(G.type),_e=E(G.internalFormat,Le,pe,G.colorSpace);if(!n.get(M).__hasExternalTextures){const ue=Math.max(1,M.width>>Q),Ae=Math.max(1,M.height>>Q);se===i.TEXTURE_3D||se===i.TEXTURE_2D_ARRAY?t.texImage3D(se,Q,_e,ue,Ae,M.depth,0,Le,pe,null):t.texImage2D(se,Q,_e,ue,Ae,0,Le,pe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),st(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,se,n.get(G).__webglTexture,0,rt(M)):(se===i.TEXTURE_2D||se>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,se,n.get(G).__webglTexture,Q),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Re(R,M,G){if(i.bindRenderbuffer(i.RENDERBUFFER,R),M.depthBuffer){const J=M.depthTexture,se=J&&J.isDepthTexture?J.type:null,Q=w(M.stencilBuffer,se),Le=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=rt(M);st(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe,Q,M.width,M.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,Q,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,Q,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Le,i.RENDERBUFFER,R)}else{const J=M.textures;for(let se=0;se<J.length;se++){const Q=J[se],Le=a.convert(Q.format,Q.colorSpace),pe=a.convert(Q.type),_e=E(Q.internalFormat,Le,pe,Q.colorSpace),tt=rt(M);G&&st(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,tt,_e,M.width,M.height):st(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,tt,_e,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,_e,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xe(R,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),K(M.depthTexture,0);const J=n.get(M.depthTexture).__webglTexture,se=rt(M);if(M.depthTexture.format===Dr)st(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(M.depthTexture.format===Br)st(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Ge(R){const M=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const J=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),J){const se=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,J.removeEventListener("dispose",se)};J.addEventListener("dispose",se),M.__depthDisposeCallback=se}M.__boundDepthTexture=J}if(R.depthTexture&&!M.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");xe(M.__webglFramebuffer,R)}else if(G){M.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[J]),M.__webglDepthbuffer[J]===void 0)M.__webglDepthbuffer[J]=i.createRenderbuffer(),Re(M.__webglDepthbuffer[J],R,!1);else{const se=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=M.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,Q)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),Re(M.__webglDepthbuffer,R,!1);else{const J=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,se),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,se)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(R,M,G){const J=n.get(R);M!==void 0&&ce(J.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Ge(R)}function nt(R){const M=R.texture,G=n.get(R),J=n.get(M);R.addEventListener("dispose",I);const se=R.textures,Q=R.isWebGLCubeRenderTarget===!0,Le=se.length>1;if(Le||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=M.version,s.memory.textures++),Q){G.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer[pe]=[];for(let _e=0;_e<M.mipmaps.length;_e++)G.__webglFramebuffer[pe][_e]=i.createFramebuffer()}else G.__webglFramebuffer[pe]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer=[];for(let pe=0;pe<M.mipmaps.length;pe++)G.__webglFramebuffer[pe]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(Le)for(let pe=0,_e=se.length;pe<_e;pe++){const tt=n.get(se[pe]);tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture(),s.memory.textures++)}if(R.samples>0&&st(R)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let pe=0;pe<se.length;pe++){const _e=se[pe];G.__webglColorRenderbuffer[pe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[pe]);const tt=a.convert(_e.format,_e.colorSpace),ue=a.convert(_e.type),Ae=E(_e.internalFormat,tt,ue,_e.colorSpace,R.isXRRenderTarget===!0),Ve=rt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ve,Ae,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,G.__webglColorRenderbuffer[pe])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),Re(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),we(i.TEXTURE_CUBE_MAP,M);for(let pe=0;pe<6;pe++)if(M.mipmaps&&M.mipmaps.length>0)for(let _e=0;_e<M.mipmaps.length;_e++)ce(G.__webglFramebuffer[pe][_e],R,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,_e);else ce(G.__webglFramebuffer[pe],R,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);m(M)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Le){for(let pe=0,_e=se.length;pe<_e;pe++){const tt=se[pe],ue=n.get(tt);t.bindTexture(i.TEXTURE_2D,ue.__webglTexture),we(i.TEXTURE_2D,tt),ce(G.__webglFramebuffer,R,tt,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,0),m(tt)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let pe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,J.__webglTexture),we(pe,M),M.mipmaps&&M.mipmaps.length>0)for(let _e=0;_e<M.mipmaps.length;_e++)ce(G.__webglFramebuffer[_e],R,M,i.COLOR_ATTACHMENT0,pe,_e);else ce(G.__webglFramebuffer,R,M,i.COLOR_ATTACHMENT0,pe,0);m(M)&&p(pe),t.unbindTexture()}R.depthBuffer&&Ge(R)}function ht(R){const M=R.textures;for(let G=0,J=M.length;G<J;G++){const se=M[G];if(m(se)){const Q=R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Le=n.get(se).__webglTexture;t.bindTexture(Q,Le),p(Q),t.unbindTexture()}}}const it=[],N=[];function Vt(R){if(R.samples>0){if(st(R)===!1){const M=R.textures,G=R.width,J=R.height;let se=i.COLOR_BUFFER_BIT;const Q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Le=n.get(R),pe=M.length>1;if(pe)for(let _e=0;_e<M.length;_e++)t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Le.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglFramebuffer);for(let _e=0;_e<M.length;_e++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(se|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(se|=i.STENCIL_BUFFER_BIT)),pe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Le.__webglColorRenderbuffer[_e]);const tt=n.get(M[_e]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,tt,0)}i.blitFramebuffer(0,0,G,J,0,0,G,J,se,i.NEAREST),l===!0&&(it.length=0,N.length=0,it.push(i.COLOR_ATTACHMENT0+_e),R.depthBuffer&&R.resolveDepthBuffer===!1&&(it.push(Q),N.push(Q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,N)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,it))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pe)for(let _e=0;_e<M.length;_e++){t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,Le.__webglColorRenderbuffer[_e]);const tt=n.get(M[_e]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,tt,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const M=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function rt(R){return Math.min(r.maxSamples,R.samples)}function st(R){const M=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ke(R){const M=s.render.frame;h.get(R)!==M&&(h.set(R,M),R.update())}function vt(R,M){const G=R.colorSpace,J=R.format,se=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==Ni&&G!==wi&&(mt.getTransfer(G)===Mt?(J!==Un||se!==ci)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),M}function Be(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=A,this.setTexture2D=K,this.setTexture2DArray=te,this.setTexture3D=$,this.setTextureCube=ne,this.rebindTextures=Ue,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=Vt,this.setupDepthRenderbuffer=Ge,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=st}function F2(i,e){function t(n,r=wi){let a;const s=mt.getTransfer(r);if(n===ci)return i.UNSIGNED_BYTE;if(n===ml)return i.UNSIGNED_SHORT_4_4_4_4;if(n===gl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ou)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===au)return i.BYTE;if(n===su)return i.SHORT;if(n===ua)return i.UNSIGNED_SHORT;if(n===pl)return i.INT;if(n===rr)return i.UNSIGNED_INT;if(n===ii)return i.FLOAT;if(n===va)return i.HALF_FLOAT;if(n===lu)return i.ALPHA;if(n===cu)return i.RGB;if(n===Un)return i.RGBA;if(n===hu)return i.LUMINANCE;if(n===uu)return i.LUMINANCE_ALPHA;if(n===Dr)return i.DEPTH_COMPONENT;if(n===Br)return i.DEPTH_STENCIL;if(n===du)return i.RED;if(n===vl)return i.RED_INTEGER;if(n===fu)return i.RG;if(n===xl)return i.RG_INTEGER;if(n===_l)return i.RGBA_INTEGER;if(n===cs||n===hs||n===us||n===ds)if(s===Mt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===cs)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===hs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===us)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ds)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===cs)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===hs)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===us)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ds)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===m0||n===g0||n===v0||n===x0)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===m0)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===g0)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===v0)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===x0)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===_0||n===y0||n===b0)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===_0||n===y0)return s===Mt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===b0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===M0||n===S0||n===w0||n===E0||n===T0||n===A0||n===C0||n===R0||n===P0||n===D0||n===L0||n===I0||n===N0||n===U0)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===M0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===S0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===w0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===E0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===T0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===A0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===C0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===R0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===P0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===D0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===L0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===I0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===N0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===U0)return s===Mt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===fs||n===F0||n===O0)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===fs)return s===Mt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===F0)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===O0)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===pu||n===k0||n===B0||n===z0)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===fs)return a.COMPRESSED_RED_RGTC1_EXT;if(n===k0)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===B0)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===z0)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===kr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class O2 extends Sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class $a extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const k2={type:"move"};class To{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $a,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $a,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $a,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,a=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),g=.02,x=.005;c.inputState.pinching&&f>g+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=g-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&a!==null&&(r=a),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(k2)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new $a;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const B2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,z2=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class H2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new un,a=e.properties.get(r);a.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ri({vertexShader:B2,fragmentShader:z2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new En(new ba(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class G2 extends or{constructor(e,t){super();const n=this;let r=null,a=1,s=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,g=null,x=null;const _=new H2,m=t.getContextAttributes();let p=null,E=null;const w=[],C=[],F=new Ke;let I=null;const P=new Sn;P.layers.enable(1),P.viewport=new Pt;const B=new Sn;B.layers.enable(2),B.viewport=new Pt;const ee=[P,B],b=new O2;b.layers.enable(1),b.layers.enable(2);let A=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ce=w[Z];return ce===void 0&&(ce=new To,w[Z]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(Z){let ce=w[Z];return ce===void 0&&(ce=new To,w[Z]=ce),ce.getGripSpace()},this.getHand=function(Z){let ce=w[Z];return ce===void 0&&(ce=new To,w[Z]=ce),ce.getHandSpace()};function X(Z){const ce=C.indexOf(Z.inputSource);if(ce===-1)return;const Re=w[ce];Re!==void 0&&(Re.update(Z.inputSource,Z.frame,c||s),Re.dispatchEvent({type:Z.type,data:Z.inputSource}))}function K(){r.removeEventListener("select",X),r.removeEventListener("selectstart",X),r.removeEventListener("selectend",X),r.removeEventListener("squeeze",X),r.removeEventListener("squeezestart",X),r.removeEventListener("squeezeend",X),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",te);for(let Z=0;Z<w.length;Z++){const ce=C[Z];ce!==null&&(C[Z]=null,w[Z].disconnect(ce))}A=null,W=null,_.reset(),e.setRenderTarget(p),g=null,f=null,u=null,r=null,E=null,je.stop(),n.isPresenting=!1,e.setPixelRatio(I),e.setSize(F.width,F.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return u},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",X),r.addEventListener("selectstart",X),r.addEventListener("selectend",X),r.addEventListener("squeeze",X),r.addEventListener("squeezestart",X),r.addEventListener("squeezeend",X),r.addEventListener("end",K),r.addEventListener("inputsourceschange",te),m.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(F),r.renderState.layers===void 0){const ce={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};g=new XRWebGLLayer(r,t,ce),r.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),E=new ar(g.framebufferWidth,g.framebufferHeight,{format:Un,type:ci,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ce=null,Re=null,xe=null;m.depth&&(xe=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ce=m.stencil?Br:Dr,Re=m.stencil?kr:rr);const Ge={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:a};u=new XRWebGLBinding(r,t),f=u.createProjectionLayer(Ge),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),E=new ar(f.textureWidth,f.textureHeight,{format:Un,type:ci,depthTexture:new Pu(f.textureWidth,f.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await r.requestReferenceSpace(o),je.setContext(r),je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function te(Z){for(let ce=0;ce<Z.removed.length;ce++){const Re=Z.removed[ce],xe=C.indexOf(Re);xe>=0&&(C[xe]=null,w[xe].disconnect(Re))}for(let ce=0;ce<Z.added.length;ce++){const Re=Z.added[ce];let xe=C.indexOf(Re);if(xe===-1){for(let Ue=0;Ue<w.length;Ue++)if(Ue>=C.length){C.push(Re),xe=Ue;break}else if(C[Ue]===null){C[Ue]=Re,xe=Ue;break}if(xe===-1)break}const Ge=w[xe];Ge&&Ge.connect(Re)}}const $=new H,ne=new H;function Y(Z,ce,Re){$.setFromMatrixPosition(ce.matrixWorld),ne.setFromMatrixPosition(Re.matrixWorld);const xe=$.distanceTo(ne),Ge=ce.projectionMatrix.elements,Ue=Re.projectionMatrix.elements,nt=Ge[14]/(Ge[10]-1),ht=Ge[14]/(Ge[10]+1),it=(Ge[9]+1)/Ge[5],N=(Ge[9]-1)/Ge[5],Vt=(Ge[8]-1)/Ge[0],rt=(Ue[8]+1)/Ue[0],st=nt*Vt,ke=nt*rt,vt=xe/(-Vt+rt),Be=vt*-Vt;if(ce.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Be),Z.translateZ(vt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Ge[10]===-1)Z.projectionMatrix.copy(ce.projectionMatrix),Z.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{const R=nt+vt,M=ht+vt,G=st-Be,J=ke+(xe-Be),se=it*ht/M*R,Q=N*ht/M*R;Z.projectionMatrix.makePerspective(G,J,se,Q,R,M),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function Se(Z,ce){ce===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ce.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let ce=Z.near,Re=Z.far;_.texture!==null&&(_.depthNear>0&&(ce=_.depthNear),_.depthFar>0&&(Re=_.depthFar)),b.near=B.near=P.near=ce,b.far=B.far=P.far=Re,(A!==b.near||W!==b.far)&&(r.updateRenderState({depthNear:b.near,depthFar:b.far}),A=b.near,W=b.far);const xe=Z.parent,Ge=b.cameras;Se(b,xe);for(let Ue=0;Ue<Ge.length;Ue++)Se(Ge[Ue],xe);Ge.length===2?Y(b,P,B):b.projectionMatrix.copy(P.projectionMatrix),ge(Z,b,xe)};function ge(Z,ce,Re){Re===null?Z.matrix.copy(ce.matrixWorld):(Z.matrix.copy(Re.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ce.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ce.projectionMatrix),Z.projectionMatrixInverse.copy(ce.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=H0*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&g===null))return l},this.setFoveation=function(Z){l=Z,f!==null&&(f.fixedFoveation=Z),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)};let we=null;function et(Z,ce){if(h=ce.getViewerPose(c||s),x=ce,h!==null){const Re=h.views;g!==null&&(e.setRenderTargetFramebuffer(E,g.framebuffer),e.setRenderTarget(E));let xe=!1;Re.length!==b.cameras.length&&(b.cameras.length=0,xe=!0);for(let Ue=0;Ue<Re.length;Ue++){const nt=Re[Ue];let ht=null;if(g!==null)ht=g.getViewport(nt);else{const N=u.getViewSubImage(f,nt);ht=N.viewport,Ue===0&&(e.setRenderTargetTextures(E,N.colorTexture,f.ignoreDepthValues?void 0:N.depthStencilTexture),e.setRenderTarget(E))}let it=ee[Ue];it===void 0&&(it=new Sn,it.layers.enable(Ue),it.viewport=new Pt,ee[Ue]=it),it.matrix.fromArray(nt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(nt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(ht.x,ht.y,ht.width,ht.height),Ue===0&&(b.matrix.copy(it.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),xe===!0&&b.cameras.push(it)}const Ge=r.enabledFeatures;if(Ge&&Ge.includes("depth-sensing")){const Ue=u.getDepthInformation(Re[0]);Ue&&Ue.isValid&&Ue.texture&&_.init(e,Ue,r.renderState)}}for(let Re=0;Re<w.length;Re++){const xe=C[Re],Ge=w[Re];xe!==null&&Ge!==void 0&&Ge.update(xe,ce,c||s)}we&&we(Z,ce),ce.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ce}),x=null}const je=new Cu;je.setAnimationLoop(et),this.setAnimationLoop=function(Z){we=Z},this.dispose=function(){}}}const Gi=new Vn,V2=new At;function q2(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Eu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,E,w,C){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),u(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),f(m,p),p.isMeshPhysicalMaterial&&g(m,p,C)):p.isMeshMatcapMaterial?(a(m,p),x(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),_(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(s(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,E,w):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===hn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===hn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const E=e.get(p),w=E.envMap,C=E.envMapRotation;w&&(m.envMap.value=w,Gi.copy(C),Gi.x*=-1,Gi.y*=-1,Gi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Gi.y*=-1,Gi.z*=-1),m.envMapRotation.value.setFromMatrix4(V2.makeRotationFromEuler(Gi)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function s(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,E,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=w*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function g(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===hn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const E=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function W2(i,e,t,n){let r={},a={},s=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,w){const C=w.program;n.uniformBlockBinding(E,C)}function c(E,w){let C=r[E.id];C===void 0&&(x(E),C=h(E),r[E.id]=C,E.addEventListener("dispose",m));const F=w.program;n.updateUBOMapping(E,F);const I=e.render.frame;a[E.id]!==I&&(f(E),a[E.id]=I)}function h(E){const w=u();E.__bindingPointIndex=w;const C=i.createBuffer(),F=E.__size,I=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,C),i.bufferData(i.UNIFORM_BUFFER,F,I),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,C),C}function u(){for(let E=0;E<o;E++)if(s.indexOf(E)===-1)return s.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){const w=r[E.id],C=E.uniforms,F=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let I=0,P=C.length;I<P;I++){const B=Array.isArray(C[I])?C[I]:[C[I]];for(let ee=0,b=B.length;ee<b;ee++){const A=B[ee];if(g(A,I,ee,F)===!0){const W=A.__offset,X=Array.isArray(A.value)?A.value:[A.value];let K=0;for(let te=0;te<X.length;te++){const $=X[te],ne=_($);typeof $=="number"||typeof $=="boolean"?(A.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,W+K,A.__data)):$.isMatrix3?(A.__data[0]=$.elements[0],A.__data[1]=$.elements[1],A.__data[2]=$.elements[2],A.__data[3]=0,A.__data[4]=$.elements[3],A.__data[5]=$.elements[4],A.__data[6]=$.elements[5],A.__data[7]=0,A.__data[8]=$.elements[6],A.__data[9]=$.elements[7],A.__data[10]=$.elements[8],A.__data[11]=0):($.toArray(A.__data,K),K+=ne.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(E,w,C,F){const I=E.value,P=w+"_"+C;if(F[P]===void 0)return typeof I=="number"||typeof I=="boolean"?F[P]=I:F[P]=I.clone(),!0;{const B=F[P];if(typeof I=="number"||typeof I=="boolean"){if(B!==I)return F[P]=I,!0}else if(B.equals(I)===!1)return B.copy(I),!0}return!1}function x(E){const w=E.uniforms;let C=0;const F=16;for(let P=0,B=w.length;P<B;P++){const ee=Array.isArray(w[P])?w[P]:[w[P]];for(let b=0,A=ee.length;b<A;b++){const W=ee[b],X=Array.isArray(W.value)?W.value:[W.value];for(let K=0,te=X.length;K<te;K++){const $=X[K],ne=_($),Y=C%F,Se=Y%ne.boundary,ge=Y+Se;C+=Se,ge!==0&&F-ge<ne.storage&&(C+=F-ge),W.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=C,C+=ne.storage}}}const I=C%F;return I>0&&(C+=F-I),E.__size=C,E.__cache={},this}function _(E){const w={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(w.boundary=4,w.storage=4):E.isVector2?(w.boundary=8,w.storage=8):E.isVector3||E.isColor?(w.boundary=16,w.storage=12):E.isVector4?(w.boundary=16,w.storage=16):E.isMatrix3?(w.boundary=48,w.storage=48):E.isMatrix4?(w.boundary=64,w.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),w}function m(E){const w=E.target;w.removeEventListener("dispose",m);const C=s.indexOf(w.__bindingPointIndex);s.splice(C,1),i.deleteBuffer(r[w.id]),delete r[w.id],delete a[w.id]}function p(){for(const E in r)i.deleteBuffer(r[E]);s=[],r={},a={}}return{bind:l,update:c,dispose:p}}class X2{constructor(e={}){const{canvas:t=If(),context:n=null,depth:r=!0,stencil:a=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=s;const g=new Uint32Array(4),x=new Int32Array(4);let _=null,m=null;const p=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kn,this.toneMapping=Ai,this.toneMappingExposure=1;const w=this;let C=!1,F=0,I=0,P=null,B=-1,ee=null;const b=new Pt,A=new Pt;let W=null;const X=new at(0);let K=0,te=t.width,$=t.height,ne=1,Y=null,Se=null;const ge=new Pt(0,0,te,$),we=new Pt(0,0,te,$);let et=!1;const je=new Ml;let Z=!1,ce=!1;const Re=new At,xe=new At,Ge=new H,Ue=new Pt,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ht=!1;function it(){return P===null?ne:1}let N=n;function Vt(T,k){return t.getContext(T,k)}try{const T={alpha:!0,depth:r,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${fl}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",ye,!1),t.addEventListener("webglcontextcreationerror",Te,!1),N===null){const k="webgl2";if(N=Vt(k,T),N===null)throw Vt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let rt,st,ke,vt,Be,R,M,G,J,se,Q,Le,pe,_e,tt,ue,Ae,Ve,qe,Ce,ot,Ye,yt,O;function Ee(){rt=new Z1(N),rt.init(),Ye=new F2(N,rt),st=new W1(N,rt,e,Ye),ke=new I2(N),st.reverseDepthBuffer&&ke.buffers.depth.setReversed(!0),vt=new eg(N),Be=new x2,R=new U2(N,rt,ke,Be,st,Ye,vt),M=new $1(w),G=new K1(w),J=new op(N),yt=new V1(N,J),se=new J1(N,J,vt,yt),Q=new ng(N,se,J,vt),qe=new tg(N,st,R),ue=new X1(Be),Le=new v2(w,M,G,rt,st,yt,ue),pe=new q2(w,Be),_e=new y2,tt=new T2(rt),Ve=new G1(w,M,G,ke,Q,f,l),Ae=new D2(w,Q,st),O=new W2(N,vt,st,ke),Ce=new q1(N,rt,vt),ot=new Q1(N,rt,vt),vt.programs=Le.programs,w.capabilities=st,w.extensions=rt,w.properties=Be,w.renderLists=_e,w.shadowMap=Ae,w.state=ke,w.info=vt}Ee();const j=new G2(w,N);this.xr=j,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const T=rt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=rt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(T){T!==void 0&&(ne=T,this.setSize(te,$,!1))},this.getSize=function(T){return T.set(te,$)},this.setSize=function(T,k,V=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}te=T,$=k,t.width=Math.floor(T*ne),t.height=Math.floor(k*ne),V===!0&&(t.style.width=T+"px",t.style.height=k+"px"),this.setViewport(0,0,T,k)},this.getDrawingBufferSize=function(T){return T.set(te*ne,$*ne).floor()},this.setDrawingBufferSize=function(T,k,V){te=T,$=k,ne=V,t.width=Math.floor(T*V),t.height=Math.floor(k*V),this.setViewport(0,0,T,k)},this.getCurrentViewport=function(T){return T.copy(b)},this.getViewport=function(T){return T.copy(ge)},this.setViewport=function(T,k,V,q){T.isVector4?ge.set(T.x,T.y,T.z,T.w):ge.set(T,k,V,q),ke.viewport(b.copy(ge).multiplyScalar(ne).round())},this.getScissor=function(T){return T.copy(we)},this.setScissor=function(T,k,V,q){T.isVector4?we.set(T.x,T.y,T.z,T.w):we.set(T,k,V,q),ke.scissor(A.copy(we).multiplyScalar(ne).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(T){ke.setScissorTest(et=T)},this.setOpaqueSort=function(T){Y=T},this.setTransparentSort=function(T){Se=T},this.getClearColor=function(T){return T.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor.apply(Ve,arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha.apply(Ve,arguments)},this.clear=function(T=!0,k=!0,V=!0){let q=0;if(T){let z=!1;if(P!==null){const de=P.texture.format;z=de===_l||de===xl||de===vl}if(z){const de=P.texture.type,be=de===ci||de===rr||de===ua||de===kr||de===ml||de===gl,Pe=Ve.getClearColor(),De=Ve.getClearAlpha(),ze=Pe.r,He=Pe.g,Ie=Pe.b;be?(g[0]=ze,g[1]=He,g[2]=Ie,g[3]=De,N.clearBufferuiv(N.COLOR,0,g)):(x[0]=ze,x[1]=He,x[2]=Ie,x[3]=De,N.clearBufferiv(N.COLOR,0,x))}else q|=N.COLOR_BUFFER_BIT}k&&(q|=N.DEPTH_BUFFER_BIT,N.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),V&&(q|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",ye,!1),t.removeEventListener("webglcontextcreationerror",Te,!1),_e.dispose(),tt.dispose(),Be.dispose(),M.dispose(),G.dispose(),Q.dispose(),yt.dispose(),O.dispose(),Le.dispose(),j.dispose(),j.removeEventListener("sessionstart",Wl),j.removeEventListener("sessionend",Xl),Fi.stop()};function ie(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function ye(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const T=vt.autoReset,k=Ae.enabled,V=Ae.autoUpdate,q=Ae.needsUpdate,z=Ae.type;Ee(),vt.autoReset=T,Ae.enabled=k,Ae.autoUpdate=V,Ae.needsUpdate=q,Ae.type=z}function Te(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function lt(T){const k=T.target;k.removeEventListener("dispose",lt),Lt(k)}function Lt(T){an(T),Be.remove(T)}function an(T){const k=Be.get(T).programs;k!==void 0&&(k.forEach(function(V){Le.releaseProgram(V)}),T.isShaderMaterial&&Le.releaseShaderCache(T))}this.renderBufferDirect=function(T,k,V,q,z,de){k===null&&(k=nt);const be=z.isMesh&&z.matrixWorld.determinant()<0,Pe=Nd(T,k,V,q,z);ke.setMaterial(q,be);let De=V.index,ze=1;if(q.wireframe===!0){if(De=se.getWireframeAttribute(V),De===void 0)return;ze=2}const He=V.drawRange,Ie=V.attributes.position;let gt=He.start*ze,bt=(He.start+He.count)*ze;de!==null&&(gt=Math.max(gt,de.start*ze),bt=Math.min(bt,(de.start+de.count)*ze)),De!==null?(gt=Math.max(gt,0),bt=Math.min(bt,De.count)):Ie!=null&&(gt=Math.max(gt,0),bt=Math.min(bt,Ie.count));const Ct=bt-gt;if(Ct<0||Ct===1/0)return;yt.setup(z,q,Pe,V,De);let dn,ft=Ce;if(De!==null&&(dn=J.get(De),ft=ot,ft.setIndex(dn)),z.isMesh)q.wireframe===!0?(ke.setLineWidth(q.wireframeLinewidth*it()),ft.setMode(N.LINES)):ft.setMode(N.TRIANGLES);else if(z.isLine){let Ne=q.linewidth;Ne===void 0&&(Ne=1),ke.setLineWidth(Ne*it()),z.isLineSegments?ft.setMode(N.LINES):z.isLineLoop?ft.setMode(N.LINE_LOOP):ft.setMode(N.LINE_STRIP)}else z.isPoints?ft.setMode(N.POINTS):z.isSprite&&ft.setMode(N.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)ft.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(rt.get("WEBGL_multi_draw"))ft.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Ne=z._multiDrawStarts,Wt=z._multiDrawCounts,pt=z._multiDrawCount,Rn=De?J.get(De).bytesPerElement:1,cr=Be.get(q).currentProgram.getUniforms();for(let fn=0;fn<pt;fn++)cr.setValue(N,"_gl_DrawID",fn),ft.render(Ne[fn]/Rn,Wt[fn])}else if(z.isInstancedMesh)ft.renderInstances(gt,Ct,z.count);else if(V.isInstancedBufferGeometry){const Ne=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Wt=Math.min(V.instanceCount,Ne);ft.renderInstances(gt,Ct,Wt)}else ft.render(gt,Ct)};function ut(T,k,V){T.transparent===!0&&T.side===Hn&&T.forceSinglePass===!1?(T.side=hn,T.needsUpdate=!0,Ea(T,k,V),T.side=Ci,T.needsUpdate=!0,Ea(T,k,V),T.side=Hn):Ea(T,k,V)}this.compile=function(T,k,V=null){V===null&&(V=T),m=tt.get(V),m.init(k),E.push(m),V.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),T!==V&&T.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),m.setupLights();const q=new Set;return T.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const de=z.material;if(de)if(Array.isArray(de))for(let be=0;be<de.length;be++){const Pe=de[be];ut(Pe,V,z),q.add(Pe)}else ut(de,V,z),q.add(de)}),E.pop(),m=null,q},this.compileAsync=function(T,k,V=null){const q=this.compile(T,k,V);return new Promise(z=>{function de(){if(q.forEach(function(be){Be.get(be).currentProgram.isReady()&&q.delete(be)}),q.size===0){z(T);return}setTimeout(de,10)}rt.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let sn=null;function $n(T){sn&&sn(T)}function Wl(){Fi.stop()}function Xl(){Fi.start()}const Fi=new Cu;Fi.setAnimationLoop($n),typeof self<"u"&&Fi.setContext(self),this.setAnimationLoop=function(T){sn=T,j.setAnimationLoop(T),T===null?Fi.stop():Fi.start()},j.addEventListener("sessionstart",Wl),j.addEventListener("sessionend",Xl),this.render=function(T,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(k),k=j.getCamera()),T.isScene===!0&&T.onBeforeRender(w,T,k,P),m=tt.get(T,E.length),m.init(k),E.push(m),xe.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),je.setFromProjectionMatrix(xe),ce=this.localClippingEnabled,Z=ue.init(this.clippingPlanes,ce),_=_e.get(T,p.length),_.init(),p.push(_),j.enabled===!0&&j.isPresenting===!0){const de=w.xr.getDepthSensingMesh();de!==null&&Xs(de,k,-1/0,w.sortObjects)}Xs(T,k,0,w.sortObjects),_.finish(),w.sortObjects===!0&&_.sort(Y,Se),ht=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,ht&&Ve.addToRenderList(_,T),this.info.render.frame++,Z===!0&&ue.beginShadows();const V=m.state.shadowsArray;Ae.render(V,T,k),Z===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=_.opaque,z=_.transmissive;if(m.setupLights(),k.isArrayCamera){const de=k.cameras;if(z.length>0)for(let be=0,Pe=de.length;be<Pe;be++){const De=de[be];Yl(q,z,T,De)}ht&&Ve.render(T);for(let be=0,Pe=de.length;be<Pe;be++){const De=de[be];$l(_,T,De,De.viewport)}}else z.length>0&&Yl(q,z,T,k),ht&&Ve.render(T),$l(_,T,k);P!==null&&(R.updateMultisampleRenderTarget(P),R.updateRenderTargetMipmap(P)),T.isScene===!0&&T.onAfterRender(w,T,k),yt.resetDefaultState(),B=-1,ee=null,E.pop(),E.length>0?(m=E[E.length-1],Z===!0&&ue.setGlobalState(w.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function Xs(T,k,V,q){if(T.visible===!1)return;if(T.layers.test(k.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(k);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||je.intersectsSprite(T)){q&&Ue.setFromMatrixPosition(T.matrixWorld).applyMatrix4(xe);const be=Q.update(T),Pe=T.material;Pe.visible&&_.push(T,be,Pe,V,Ue.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||je.intersectsObject(T))){const be=Q.update(T),Pe=T.material;if(q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ue.copy(T.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),Ue.copy(be.boundingSphere.center)),Ue.applyMatrix4(T.matrixWorld).applyMatrix4(xe)),Array.isArray(Pe)){const De=be.groups;for(let ze=0,He=De.length;ze<He;ze++){const Ie=De[ze],gt=Pe[Ie.materialIndex];gt&&gt.visible&&_.push(T,be,gt,V,Ue.z,Ie)}}else Pe.visible&&_.push(T,be,Pe,V,Ue.z,null)}}const de=T.children;for(let be=0,Pe=de.length;be<Pe;be++)Xs(de[be],k,V,q)}function $l(T,k,V,q){const z=T.opaque,de=T.transmissive,be=T.transparent;m.setupLightsView(V),Z===!0&&ue.setGlobalState(w.clippingPlanes,V),q&&ke.viewport(b.copy(q)),z.length>0&&wa(z,k,V),de.length>0&&wa(de,k,V),be.length>0&&wa(be,k,V),ke.buffers.depth.setTest(!0),ke.buffers.depth.setMask(!0),ke.buffers.color.setMask(!0),ke.setPolygonOffset(!1)}function Yl(T,k,V,q){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[q.id]===void 0&&(m.state.transmissionRenderTarget[q.id]=new ar(1,1,{generateMipmaps:!0,type:rt.has("EXT_color_buffer_half_float")||rt.has("EXT_color_buffer_float")?va:ci,minFilter:Qi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:mt.workingColorSpace}));const de=m.state.transmissionRenderTarget[q.id],be=q.viewport||b;de.setSize(be.z,be.w);const Pe=w.getRenderTarget();w.setRenderTarget(de),w.getClearColor(X),K=w.getClearAlpha(),K<1&&w.setClearColor(16777215,.5),w.clear(),ht&&Ve.render(V);const De=w.toneMapping;w.toneMapping=Ai;const ze=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),m.setupLightsView(q),Z===!0&&ue.setGlobalState(w.clippingPlanes,q),wa(T,V,q),R.updateMultisampleRenderTarget(de),R.updateRenderTargetMipmap(de),rt.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let Ie=0,gt=k.length;Ie<gt;Ie++){const bt=k[Ie],Ct=bt.object,dn=bt.geometry,ft=bt.material,Ne=bt.group;if(ft.side===Hn&&Ct.layers.test(q.layers)){const Wt=ft.side;ft.side=hn,ft.needsUpdate=!0,jl(Ct,V,q,dn,ft,Ne),ft.side=Wt,ft.needsUpdate=!0,He=!0}}He===!0&&(R.updateMultisampleRenderTarget(de),R.updateRenderTargetMipmap(de))}w.setRenderTarget(Pe),w.setClearColor(X,K),ze!==void 0&&(q.viewport=ze),w.toneMapping=De}function wa(T,k,V){const q=k.isScene===!0?k.overrideMaterial:null;for(let z=0,de=T.length;z<de;z++){const be=T[z],Pe=be.object,De=be.geometry,ze=q===null?be.material:q,He=be.group;Pe.layers.test(V.layers)&&jl(Pe,k,V,De,ze,He)}}function jl(T,k,V,q,z,de){T.onBeforeRender(w,k,V,q,z,de),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),z.onBeforeRender(w,k,V,q,T,de),z.transparent===!0&&z.side===Hn&&z.forceSinglePass===!1?(z.side=hn,z.needsUpdate=!0,w.renderBufferDirect(V,k,q,z,T,de),z.side=Ci,z.needsUpdate=!0,w.renderBufferDirect(V,k,q,z,T,de),z.side=Hn):w.renderBufferDirect(V,k,q,z,T,de),T.onAfterRender(w,k,V,q,z,de)}function Ea(T,k,V){k.isScene!==!0&&(k=nt);const q=Be.get(T),z=m.state.lights,de=m.state.shadowsArray,be=z.state.version,Pe=Le.getParameters(T,z.state,de,k,V),De=Le.getProgramCacheKey(Pe);let ze=q.programs;q.environment=T.isMeshStandardMaterial?k.environment:null,q.fog=k.fog,q.envMap=(T.isMeshStandardMaterial?G:M).get(T.envMap||q.environment),q.envMapRotation=q.environment!==null&&T.envMap===null?k.environmentRotation:T.envMapRotation,ze===void 0&&(T.addEventListener("dispose",lt),ze=new Map,q.programs=ze);let He=ze.get(De);if(He!==void 0){if(q.currentProgram===He&&q.lightsStateVersion===be)return Zl(T,Pe),He}else Pe.uniforms=Le.getUniforms(T),T.onBeforeCompile(Pe,w),He=Le.acquireProgram(Pe,De),ze.set(De,He),q.uniforms=Pe.uniforms;const Ie=q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ie.clippingPlanes=ue.uniform),Zl(T,Pe),q.needsLights=Fd(T),q.lightsStateVersion=be,q.needsLights&&(Ie.ambientLightColor.value=z.state.ambient,Ie.lightProbe.value=z.state.probe,Ie.directionalLights.value=z.state.directional,Ie.directionalLightShadows.value=z.state.directionalShadow,Ie.spotLights.value=z.state.spot,Ie.spotLightShadows.value=z.state.spotShadow,Ie.rectAreaLights.value=z.state.rectArea,Ie.ltc_1.value=z.state.rectAreaLTC1,Ie.ltc_2.value=z.state.rectAreaLTC2,Ie.pointLights.value=z.state.point,Ie.pointLightShadows.value=z.state.pointShadow,Ie.hemisphereLights.value=z.state.hemi,Ie.directionalShadowMap.value=z.state.directionalShadowMap,Ie.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ie.spotShadowMap.value=z.state.spotShadowMap,Ie.spotLightMatrix.value=z.state.spotLightMatrix,Ie.spotLightMap.value=z.state.spotLightMap,Ie.pointShadowMap.value=z.state.pointShadowMap,Ie.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=He,q.uniformsList=null,He}function Kl(T){if(T.uniformsList===null){const k=T.currentProgram.getUniforms();T.uniformsList=gs.seqWithValue(k.seq,T.uniforms)}return T.uniformsList}function Zl(T,k){const V=Be.get(T);V.outputColorSpace=k.outputColorSpace,V.batching=k.batching,V.batchingColor=k.batchingColor,V.instancing=k.instancing,V.instancingColor=k.instancingColor,V.instancingMorph=k.instancingMorph,V.skinning=k.skinning,V.morphTargets=k.morphTargets,V.morphNormals=k.morphNormals,V.morphColors=k.morphColors,V.morphTargetsCount=k.morphTargetsCount,V.numClippingPlanes=k.numClippingPlanes,V.numIntersection=k.numClipIntersection,V.vertexAlphas=k.vertexAlphas,V.vertexTangents=k.vertexTangents,V.toneMapping=k.toneMapping}function Nd(T,k,V,q,z){k.isScene!==!0&&(k=nt),R.resetTextureUnits();const de=k.fog,be=q.isMeshStandardMaterial?k.environment:null,Pe=P===null?w.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Ni,De=(q.isMeshStandardMaterial?G:M).get(q.envMap||be),ze=q.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,He=!!V.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ie=!!V.morphAttributes.position,gt=!!V.morphAttributes.normal,bt=!!V.morphAttributes.color;let Ct=Ai;q.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Ct=w.toneMapping);const dn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ft=dn!==void 0?dn.length:0,Ne=Be.get(q),Wt=m.state.lights;if(Z===!0&&(ce===!0||T!==ee)){const bn=T===ee&&q.id===B;ue.setState(q,T,bn)}let pt=!1;q.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==Wt.state.version||Ne.outputColorSpace!==Pe||z.isBatchedMesh&&Ne.batching===!1||!z.isBatchedMesh&&Ne.batching===!0||z.isBatchedMesh&&Ne.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Ne.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Ne.instancing===!1||!z.isInstancedMesh&&Ne.instancing===!0||z.isSkinnedMesh&&Ne.skinning===!1||!z.isSkinnedMesh&&Ne.skinning===!0||z.isInstancedMesh&&Ne.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ne.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ne.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ne.instancingMorph===!1&&z.morphTexture!==null||Ne.envMap!==De||q.fog===!0&&Ne.fog!==de||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==ue.numPlanes||Ne.numIntersection!==ue.numIntersection)||Ne.vertexAlphas!==ze||Ne.vertexTangents!==He||Ne.morphTargets!==Ie||Ne.morphNormals!==gt||Ne.morphColors!==bt||Ne.toneMapping!==Ct||Ne.morphTargetsCount!==ft)&&(pt=!0):(pt=!0,Ne.__version=q.version);let Rn=Ne.currentProgram;pt===!0&&(Rn=Ea(q,k,z));let cr=!1,fn=!1,$s=!1;const Dt=Rn.getUniforms(),pi=Ne.uniforms;if(ke.useProgram(Rn.program)&&(cr=!0,fn=!0,$s=!0),q.id!==B&&(B=q.id,fn=!0),cr||ee!==T){st.reverseDepthBuffer?(Re.copy(T.projectionMatrix),Uf(Re),Ff(Re),Dt.setValue(N,"projectionMatrix",Re)):Dt.setValue(N,"projectionMatrix",T.projectionMatrix),Dt.setValue(N,"viewMatrix",T.matrixWorldInverse);const bn=Dt.map.cameraPosition;bn!==void 0&&bn.setValue(N,Ge.setFromMatrixPosition(T.matrixWorld)),st.logarithmicDepthBuffer&&Dt.setValue(N,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Dt.setValue(N,"isOrthographic",T.isOrthographicCamera===!0),ee!==T&&(ee=T,fn=!0,$s=!0)}if(z.isSkinnedMesh){Dt.setOptional(N,z,"bindMatrix"),Dt.setOptional(N,z,"bindMatrixInverse");const bn=z.skeleton;bn&&(bn.boneTexture===null&&bn.computeBoneTexture(),Dt.setValue(N,"boneTexture",bn.boneTexture,R))}z.isBatchedMesh&&(Dt.setOptional(N,z,"batchingTexture"),Dt.setValue(N,"batchingTexture",z._matricesTexture,R),Dt.setOptional(N,z,"batchingIdTexture"),Dt.setValue(N,"batchingIdTexture",z._indirectTexture,R),Dt.setOptional(N,z,"batchingColorTexture"),z._colorsTexture!==null&&Dt.setValue(N,"batchingColorTexture",z._colorsTexture,R));const Ys=V.morphAttributes;if((Ys.position!==void 0||Ys.normal!==void 0||Ys.color!==void 0)&&qe.update(z,V,Rn),(fn||Ne.receiveShadow!==z.receiveShadow)&&(Ne.receiveShadow=z.receiveShadow,Dt.setValue(N,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(pi.envMap.value=De,pi.flipEnvMap.value=De.isCubeTexture&&De.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&k.environment!==null&&(pi.envMapIntensity.value=k.environmentIntensity),fn&&(Dt.setValue(N,"toneMappingExposure",w.toneMappingExposure),Ne.needsLights&&Ud(pi,$s),de&&q.fog===!0&&pe.refreshFogUniforms(pi,de),pe.refreshMaterialUniforms(pi,q,ne,$,m.state.transmissionRenderTarget[T.id]),gs.upload(N,Kl(Ne),pi,R)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(gs.upload(N,Kl(Ne),pi,R),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Dt.setValue(N,"center",z.center),Dt.setValue(N,"modelViewMatrix",z.modelViewMatrix),Dt.setValue(N,"normalMatrix",z.normalMatrix),Dt.setValue(N,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const bn=q.uniformsGroups;for(let js=0,Od=bn.length;js<Od;js++){const Jl=bn[js];O.update(Jl,Rn),O.bind(Jl,Rn)}}return Rn}function Ud(T,k){T.ambientLightColor.needsUpdate=k,T.lightProbe.needsUpdate=k,T.directionalLights.needsUpdate=k,T.directionalLightShadows.needsUpdate=k,T.pointLights.needsUpdate=k,T.pointLightShadows.needsUpdate=k,T.spotLights.needsUpdate=k,T.spotLightShadows.needsUpdate=k,T.rectAreaLights.needsUpdate=k,T.hemisphereLights.needsUpdate=k}function Fd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(T,k,V){Be.get(T.texture).__webglTexture=k,Be.get(T.depthTexture).__webglTexture=V;const q=Be.get(T);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=V===void 0,q.__autoAllocateDepthBuffer||rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,k){const V=Be.get(T);V.__webglFramebuffer=k,V.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(T,k=0,V=0){P=T,F=k,I=V;let q=!0,z=null,de=!1,be=!1;if(T){const De=Be.get(T);if(De.__useDefaultFramebuffer!==void 0)ke.bindFramebuffer(N.FRAMEBUFFER,null),q=!1;else if(De.__webglFramebuffer===void 0)R.setupRenderTarget(T);else if(De.__hasExternalTextures)R.rebindTextures(T,Be.get(T.texture).__webglTexture,Be.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ie=T.depthTexture;if(De.__boundDepthTexture!==Ie){if(Ie!==null&&Be.has(Ie)&&(T.width!==Ie.image.width||T.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(T)}}const ze=T.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(be=!0);const He=Be.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(He[k])?z=He[k][V]:z=He[k],de=!0):T.samples>0&&R.useMultisampledRTT(T)===!1?z=Be.get(T).__webglMultisampledFramebuffer:Array.isArray(He)?z=He[V]:z=He,b.copy(T.viewport),A.copy(T.scissor),W=T.scissorTest}else b.copy(ge).multiplyScalar(ne).floor(),A.copy(we).multiplyScalar(ne).floor(),W=et;if(ke.bindFramebuffer(N.FRAMEBUFFER,z)&&q&&ke.drawBuffers(T,z),ke.viewport(b),ke.scissor(A),ke.setScissorTest(W),de){const De=Be.get(T.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+k,De.__webglTexture,V)}else if(be){const De=Be.get(T.texture),ze=k||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,De.__webglTexture,V||0,ze)}B=-1},this.readRenderTargetPixels=function(T,k,V,q,z,de,be){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=Be.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&be!==void 0&&(Pe=Pe[be]),Pe){ke.bindFramebuffer(N.FRAMEBUFFER,Pe);try{const De=T.texture,ze=De.format,He=De.type;if(!st.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!st.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=T.width-q&&V>=0&&V<=T.height-z&&N.readPixels(k,V,q,z,Ye.convert(ze),Ye.convert(He),de)}finally{const De=P!==null?Be.get(P).__webglFramebuffer:null;ke.bindFramebuffer(N.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(T,k,V,q,z,de,be){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=Be.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&be!==void 0&&(Pe=Pe[be]),Pe){const De=T.texture,ze=De.format,He=De.type;if(!st.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!st.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=T.width-q&&V>=0&&V<=T.height-z){ke.bindFramebuffer(N.FRAMEBUFFER,Pe);const Ie=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Ie),N.bufferData(N.PIXEL_PACK_BUFFER,de.byteLength,N.STREAM_READ),N.readPixels(k,V,q,z,Ye.convert(ze),Ye.convert(He),0);const gt=P!==null?Be.get(P).__webglFramebuffer:null;ke.bindFramebuffer(N.FRAMEBUFFER,gt);const bt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Nf(N,bt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Ie),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,de),N.deleteBuffer(Ie),N.deleteSync(bt),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,k=null,V=0){T.isTexture!==!0&&(ms("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,T=arguments[1]);const q=Math.pow(2,-V),z=Math.floor(T.image.width*q),de=Math.floor(T.image.height*q),be=k!==null?k.x:0,Pe=k!==null?k.y:0;R.setTexture2D(T,0),N.copyTexSubImage2D(N.TEXTURE_2D,V,0,0,be,Pe,z,de),ke.unbindTexture()},this.copyTextureToTexture=function(T,k,V=null,q=null,z=0){T.isTexture!==!0&&(ms("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,T=arguments[1],k=arguments[2],z=arguments[3]||0,V=null);let de,be,Pe,De,ze,He;V!==null?(de=V.max.x-V.min.x,be=V.max.y-V.min.y,Pe=V.min.x,De=V.min.y):(de=T.image.width,be=T.image.height,Pe=0,De=0),q!==null?(ze=q.x,He=q.y):(ze=0,He=0);const Ie=Ye.convert(k.format),gt=Ye.convert(k.type);R.setTexture2D(k,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,k.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,k.unpackAlignment);const bt=N.getParameter(N.UNPACK_ROW_LENGTH),Ct=N.getParameter(N.UNPACK_IMAGE_HEIGHT),dn=N.getParameter(N.UNPACK_SKIP_PIXELS),ft=N.getParameter(N.UNPACK_SKIP_ROWS),Ne=N.getParameter(N.UNPACK_SKIP_IMAGES),Wt=T.isCompressedTexture?T.mipmaps[z]:T.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,Wt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Wt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Pe),N.pixelStorei(N.UNPACK_SKIP_ROWS,De),T.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,z,ze,He,de,be,Ie,gt,Wt.data):T.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,z,ze,He,Wt.width,Wt.height,Ie,Wt.data):N.texSubImage2D(N.TEXTURE_2D,z,ze,He,de,be,Ie,gt,Wt),N.pixelStorei(N.UNPACK_ROW_LENGTH,bt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ct),N.pixelStorei(N.UNPACK_SKIP_PIXELS,dn),N.pixelStorei(N.UNPACK_SKIP_ROWS,ft),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ne),z===0&&k.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),ke.unbindTexture()},this.copyTextureToTexture3D=function(T,k,V=null,q=null,z=0){T.isTexture!==!0&&(ms("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,q=arguments[1]||null,T=arguments[2],k=arguments[3],z=arguments[4]||0);let de,be,Pe,De,ze,He,Ie,gt,bt;const Ct=T.isCompressedTexture?T.mipmaps[z]:T.image;V!==null?(de=V.max.x-V.min.x,be=V.max.y-V.min.y,Pe=V.max.z-V.min.z,De=V.min.x,ze=V.min.y,He=V.min.z):(de=Ct.width,be=Ct.height,Pe=Ct.depth,De=0,ze=0,He=0),q!==null?(Ie=q.x,gt=q.y,bt=q.z):(Ie=0,gt=0,bt=0);const dn=Ye.convert(k.format),ft=Ye.convert(k.type);let Ne;if(k.isData3DTexture)R.setTexture3D(k,0),Ne=N.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)R.setTexture2DArray(k,0),Ne=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,k.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,k.unpackAlignment);const Wt=N.getParameter(N.UNPACK_ROW_LENGTH),pt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Rn=N.getParameter(N.UNPACK_SKIP_PIXELS),cr=N.getParameter(N.UNPACK_SKIP_ROWS),fn=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Ct.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ct.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,De),N.pixelStorei(N.UNPACK_SKIP_ROWS,ze),N.pixelStorei(N.UNPACK_SKIP_IMAGES,He),T.isDataTexture||T.isData3DTexture?N.texSubImage3D(Ne,z,Ie,gt,bt,de,be,Pe,dn,ft,Ct.data):k.isCompressedArrayTexture?N.compressedTexSubImage3D(Ne,z,Ie,gt,bt,de,be,Pe,dn,Ct.data):N.texSubImage3D(Ne,z,Ie,gt,bt,de,be,Pe,dn,ft,Ct),N.pixelStorei(N.UNPACK_ROW_LENGTH,Wt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,pt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Rn),N.pixelStorei(N.UNPACK_SKIP_ROWS,cr),N.pixelStorei(N.UNPACK_SKIP_IMAGES,fn),z===0&&k.generateMipmaps&&N.generateMipmap(Ne),ke.unbindTexture()},this.initRenderTarget=function(T){Be.get(T).__webglFramebuffer===void 0&&R.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?R.setTextureCube(T,0):T.isData3DTexture?R.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?R.setTexture2DArray(T,0):R.setTexture2D(T,0),ke.unbindTexture()},this.resetState=function(){F=0,I=0,P=null,ke.reset(),yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===yl?"display-p3":"srgb",t.unpackColorSpace=mt.workingColorSpace===Ls?"display-p3":"srgb"}}class $2 extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Vn,this.environmentIntensity=1,this.environmentRotation=new Vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class wl extends qr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new at(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Es=new H,Ts=new H,$c=new At,ia=new bl,Ya=new Is,Ao=new H,Yc=new H;class Y2 extends Xt{constructor(e=new On,t=new wl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,a=t.count;r<a;r++)Es.fromBufferAttribute(t,r-1),Ts.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=Es.distanceTo(Ts);e.setAttribute("lineDistance",new nn(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,a=e.params.Line.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ya.copy(n.boundingSphere),Ya.applyMatrix4(r),Ya.radius+=a,e.ray.intersectsSphere(Ya)===!1)return;$c.copy(r).invert(),ia.copy(e.ray).applyMatrix4($c);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const g=Math.max(0,s.start),x=Math.min(h.count,s.start+s.count);for(let _=g,m=x-1;_<m;_+=c){const p=h.getX(_),E=h.getX(_+1),w=ja(this,e,ia,l,p,E);w&&t.push(w)}if(this.isLineLoop){const _=h.getX(x-1),m=h.getX(g),p=ja(this,e,ia,l,_,m);p&&t.push(p)}}else{const g=Math.max(0,s.start),x=Math.min(f.count,s.start+s.count);for(let _=g,m=x-1;_<m;_+=c){const p=ja(this,e,ia,l,_,_+1);p&&t.push(p)}if(this.isLineLoop){const _=ja(this,e,ia,l,x-1,g);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function ja(i,e,t,n,r,a){const s=i.geometry.attributes.position;if(Es.fromBufferAttribute(s,r),Ts.fromBufferAttribute(s,a),t.distanceSqToSegment(Es,Ts,Ao,Yc)>n)return;Ao.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ao);if(!(l<e.near||l>e.far))return{distance:l,point:Yc.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}const jc=new H,Kc=new H;class Uu extends Y2{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,a=t.count;r<a;r+=2)jc.fromBufferAttribute(t,r),Kc.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+jc.distanceTo(Kc);e.setAttribute("lineDistance",new nn(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class As extends On{constructor(e=1,t=32,n=16,r=0,a=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:a,thetaStart:s,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(s+o,Math.PI);let c=0;const h=[],u=new H,f=new H,g=[],x=[],_=[],m=[];for(let p=0;p<=n;p++){const E=[],w=p/n;let C=0;p===0&&s===0?C=.5/t:p===n&&l===Math.PI&&(C=-.5/t);for(let F=0;F<=t;F++){const I=F/t;u.x=-e*Math.cos(r+I*a)*Math.sin(s+w*o),u.y=e*Math.cos(s+w*o),u.z=e*Math.sin(r+I*a)*Math.sin(s+w*o),x.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(I+C,1-w),E.push(c++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<t;E++){const w=h[p][E+1],C=h[p][E],F=h[p+1][E],I=h[p+1][E+1];(p!==0||s>0)&&g.push(w,C,I),(p!==n-1||l<Math.PI)&&g.push(C,F,I)}this.setIndex(g),this.setAttribute("position",new nn(x,3)),this.setAttribute("normal",new nn(_,3)),this.setAttribute("uv",new nn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new As(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Zc extends On{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,r=new H,a=new H;if(e.index!==null){const s=e.attributes.position,o=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const u=l[c],f=u.start,g=u.count;for(let x=f,_=f+g;x<_;x+=3)for(let m=0;m<3;m++){const p=o.getX(x+m),E=o.getX(x+(m+1)%3);r.fromBufferAttribute(s,p),a.fromBufferAttribute(s,E),Jc(r,a,n)===!0&&(t.push(r.x,r.y,r.z),t.push(a.x,a.y,a.z))}}}else{const s=e.attributes.position;for(let o=0,l=s.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,u=3*o+(c+1)%3;r.fromBufferAttribute(s,h),a.fromBufferAttribute(s,u),Jc(r,a,n)===!0&&(t.push(r.x,r.y,r.z),t.push(a.x,a.y,a.z))}}this.setAttribute("position",new nn(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Jc(i,e,t){const n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)===!0||t.has(r)===!0?!1:(t.add(n),t.add(r),!0)}class Co extends qr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new at(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mu,this.normalScale=new Ke(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Fu extends Xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new at(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Ro=new At,Qc=new H,eh=new H;class j2{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ke(512,512),this.map=null,this.mapPass=null,this.matrix=new At,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ml,this._frameExtents=new Ke(1,1),this._viewportCount=1,this._viewports=[new Pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Qc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Qc),eh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(eh),t.updateMatrixWorld(),Ro.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ro),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ro)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class K2 extends j2{constructor(){super(new Ru(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class th extends Fu{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new K2}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Z2 extends Fu{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class nh{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(en(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class J2 extends Uu{constructor(e=10,t=10,n=4473924,r=8947848){n=new at(n),r=new at(r);const a=t/2,s=e/t,o=e/2,l=[],c=[];for(let f=0,g=0,x=-o;f<=t;f++,x+=s){l.push(-o,0,x,o,0,x),l.push(x,0,-o,x,0,o);const _=f===a?n:r;_.toArray(c,g),g+=3,_.toArray(c,g),g+=3,_.toArray(c,g),g+=3,_.toArray(c,g),g+=3}const h=new On;h.setAttribute("position",new nn(l,3)),h.setAttribute("color",new nn(c,3));const u=new wl({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Q2 extends or{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fl);const ih={type:"change"},El={type:"start"},Ou={type:"end"},Ka=new bl,rh=new Si,e4=Math.cos(70*Lf.DEG2RAD),kt=new H,ln=2*Math.PI,xt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Po=1e-6;class t4 extends Q2{constructor(e,t=null){super(e,t),this.state=xt.NONE,this.enabled=!0,this.target=new H,this.cursor=new H,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Rr.ROTATE,MIDDLE:Rr.DOLLY,RIGHT:Rr.PAN},this.touches={ONE:Tr.ROTATE,TWO:Tr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new H,this._lastQuaternion=new sr,this._lastTargetPosition=new H,this._quat=new sr().setFromUnitVectors(e.up,new H(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new nh,this._sphericalDelta=new nh,this._scale=1,this._panOffset=new H,this._rotateStart=new Ke,this._rotateEnd=new Ke,this._rotateDelta=new Ke,this._panStart=new Ke,this._panEnd=new Ke,this._panDelta=new Ke,this._dollyStart=new Ke,this._dollyEnd=new Ke,this._dollyDelta=new Ke,this._dollyDirection=new H,this._mouse=new Ke,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=i4.bind(this),this._onPointerDown=n4.bind(this),this._onPointerUp=r4.bind(this),this._onContextMenu=u4.bind(this),this._onMouseWheel=o4.bind(this),this._onKeyDown=l4.bind(this),this._onTouchStart=c4.bind(this),this._onTouchMove=h4.bind(this),this._onMouseDown=a4.bind(this),this._onMouseMove=s4.bind(this),this._interceptControlDown=d4.bind(this),this._interceptControlUp=f4.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ih),this.update(),this.state=xt.NONE}update(e=null){const t=this.object.position;kt.copy(t).sub(this.target),kt.applyQuaternion(this._quat),this._spherical.setFromVector3(kt),this.autoRotate&&this.state===xt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=ln:n>Math.PI&&(n-=ln),r<-Math.PI?r+=ln:r>Math.PI&&(r-=ln),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const s=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=s!=this._spherical.radius}if(kt.setFromSpherical(this._spherical),kt.applyQuaternion(this._quatInverse),t.copy(this.target).add(kt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let s=null;if(this.object.isPerspectiveCamera){const o=kt.length();s=this._clampDistance(o*this._scale);const l=o-s;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),a=!!l}else if(this.object.isOrthographicCamera){const o=new H(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=l!==this.object.zoom;const c=new H(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),s=kt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;s!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(s).add(this.object.position):(Ka.origin.copy(this.object.position),Ka.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ka.direction))<e4?this.object.lookAt(this.target):(rh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ka.intersectPlane(rh,this.target))))}else if(this.object.isOrthographicCamera){const s=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),s!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>Po||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Po||this._lastTargetPosition.distanceToSquared(this.target)>Po?(this.dispatchEvent(ih),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ln/60*this.autoRotateSpeed*e:ln/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){kt.setFromMatrixColumn(t,0),kt.multiplyScalar(-e),this._panOffset.add(kt)}_panUp(e,t){this.screenSpacePanning===!0?kt.setFromMatrixColumn(t,1):(kt.setFromMatrixColumn(t,0),kt.crossVectors(this.object.up,kt)),kt.multiplyScalar(e),this._panOffset.add(kt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;kt.copy(r).sub(this.target);let a=kt.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*a/n.clientHeight,this.object.matrix),this._panUp(2*t*a/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),r=e-n.left,a=t-n.top,s=n.width,o=n.height;this._mouse.x=r/s*2-1,this._mouse.y=-(a/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ln*this._rotateDelta.x/t.clientHeight),this._rotateUp(ln*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(ln*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-ln*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(ln*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-ln*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,a=Math.sqrt(n*n+r*r);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),r=.5*(e.pageX+n.x),a=.5*(e.pageY+n.y);this._rotateEnd.set(r,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ln*this._rotateDelta.x/t.clientHeight),this._rotateUp(ln*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,a=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const s=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(s,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ke,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function n4(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function i4(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function r4(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ou),this.state=xt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function a4(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Rr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=xt.DOLLY;break;case Rr.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=xt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=xt.ROTATE}break;case Rr.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=xt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=xt.PAN}break;default:this.state=xt.NONE}this.state!==xt.NONE&&this.dispatchEvent(El)}function s4(i){switch(this.state){case xt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case xt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case xt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function o4(i){this.enabled===!1||this.enableZoom===!1||this.state!==xt.NONE||(i.preventDefault(),this.dispatchEvent(El),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Ou))}function l4(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function c4(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Tr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=xt.TOUCH_ROTATE;break;case Tr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=xt.TOUCH_PAN;break;default:this.state=xt.NONE}break;case 2:switch(this.touches.TWO){case Tr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=xt.TOUCH_DOLLY_PAN;break;case Tr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=xt.TOUCH_DOLLY_ROTATE;break;default:this.state=xt.NONE}break;default:this.state=xt.NONE}this.state!==xt.NONE&&this.dispatchEvent(El)}function h4(i){switch(this._trackPointer(i),this.state){case xt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case xt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case xt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case xt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=xt.NONE}}function u4(i){this.enabled!==!1&&i.preventDefault()}function d4(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function f4(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class p4{constructor(e,t,n){me(this,"container");me(this,"canvas");me(this,"engine");me(this,"particles",[]);me(this,"scene");me(this,"camera");me(this,"renderer");me(this,"controls");me(this,"surfaceMesh");me(this,"wireframeMesh");me(this,"geometry");me(this,"particleMeshes",[]);me(this,"testParticleMeshes",[]);me(this,"planeWidth",320);me(this,"planeHeight",220);me(this,"segmentsX",70);me(this,"segmentsY",50);me(this,"showWireframe",!0);me(this,"autoRotate",!1);me(this,"animationId",null);me(this,"isDestroyed",!1);this.container=e,this.canvas=t,this.engine=n,this.scene=new $2,this.scene.background=new at(527380);const r=this.container.getBoundingClientRect(),a=(r.width||600)/(r.height||400);this.camera=new Sn(45,a,1,2e3),this.camera.position.set(0,180,280),this.renderer=new X2({canvas:this.canvas,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(r.width||600,r.height||400),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.controls=new t4(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.maxPolarAngle=Math.PI/2-.05,this.controls.minDistance=60,this.controls.maxDistance=600,this.controls.addEventListener("change",()=>this.render3D());const s=new Z2(16777215,.7);this.scene.add(s);const o=new th(16777215,1.2);o.position.set(100,250,150),this.scene.add(o);const l=new th(3718648,.5);l.position.set(-100,-100,-100),this.scene.add(l);const c=new J2(360,24,3359061,1976635);c.position.y=-.5,this.scene.add(c),this.geometry=new ba(this.planeWidth,this.planeHeight,this.segmentsX,this.segmentsY),this.geometry.rotateX(-Math.PI/2);const h=this.geometry.attributes.position.count,u=new Float32Array(h*3);this.geometry.setAttribute("color",new Fn(u,3));const f=new Co({vertexColors:!0,roughness:.35,metalness:.15,side:Hn});this.surfaceMesh=new En(this.geometry,f),this.scene.add(this.surfaceMesh);const g=new Zc(this.geometry),x=new wl({color:6583435,transparent:!0,opacity:.25});this.wireframeMesh=new Uu(g,x),this.scene.add(this.wireframeMesh),window.addEventListener("resize",()=>this.handleResize())}setParticles(e){this.particles=e,this.updateParticleMeshes(),this.updateSurface()}updateParticleMeshes(){for(const e of this.particleMeshes)this.scene.remove(e),e.geometry.dispose(),e.material.dispose();this.particleMeshes=[];for(const e of this.particles){const t=e.q>0,n=e.q<0,r=t?15680580:n?3900150:9741240,a=new As(7,24,24),s=new Co({color:r,roughness:.2,metalness:.3,emissive:r,emissiveIntensity:.35}),o=new En(a,s);this.scene.add(o),this.particleMeshes.push(o)}}updateSurface(){const e=this.geometry.attributes.position,t=this.geometry.attributes.color,n=this.container.getBoundingClientRect(),r=n.width||600,a=n.height||400,s=e.count;for(let o=0;o<s;o++){const l=e.getX(o),c=e.getZ(o),h=(l/this.planeWidth+.5)*r,u=(c/this.planeHeight+.5)*a,f=this.engine.calculatePotentialHeight(h,u,this.particles);e.setY(o,f);let g=.15,x=.22,_=.35;const m=90;if(f>0){const p=Math.min(1,f/m);g=.15+p*.85,x=.22+p*(p>.6?.6:.1),_=.35*(1-p*.8)}else if(f<0){const p=Math.min(1,-f/m);g=.15*(1-p*.7),x=.22+p*.35,_=.35+p*.65}t.setXYZ(o,g,x,_)}e.needsUpdate=!0,t.needsUpdate=!0,this.geometry.computeVertexNormals(),this.wireframeMesh.geometry.dispose(),this.wireframeMesh.geometry=new Zc(this.geometry),this.wireframeMesh.visible=this.showWireframe;for(let o=0;o<this.particles.length;o++){const l=this.particles[o],c=this.particleMeshes[o];if(!c)continue;const h=(l.x/r-.5)*this.planeWidth,u=(l.y/a-.5)*this.planeHeight,f=this.engine.calculatePotentialHeight(l.x,l.y,this.particles);c.position.set(h,f+(l.q>=0?8:-8),u)}this.render3D()}render3D(){if(this.isDestroyed)return;const e=this.container.getBoundingClientRect();!e||e.width<=0||e.height<=0||this.renderer.render(this.scene,this.camera)}handleResize(){if(this.isDestroyed)return;const e=this.container.getBoundingClientRect();!e||e.width<=0||e.height<=0||(this.camera.aspect=e.width/e.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(e.width,e.height),this.render3D())}setAutoRotate(e){this.autoRotate=e,e?this.startLoop():(this.stopLoop(),this.scene.rotation.y=0,this.render3D())}startLoop(){if(this.animationId!==null)return;const e=()=>{if(this.isDestroyed||!this.autoRotate){this.stopLoop();return}this.scene.rotation.y+=.005,this.controls.update(),this.render3D(),this.animationId=requestAnimationFrame(e)};this.animationId=requestAnimationFrame(e)}stopLoop(){this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null)}updateTestParticles(e,t,n){if(!this.isDestroyed){for(;this.testParticleMeshes.length<e.length;){const r=new As(5.5,16,16),a=new Co({color:16436245,emissive:16436245,emissiveIntensity:.95,roughness:.1,metalness:.2}),s=new En(r,a);this.scene.add(s),this.testParticleMeshes.push(s)}for(;this.testParticleMeshes.length>e.length;){const r=this.testParticleMeshes.pop();r&&(this.scene.remove(r),r.geometry.dispose(),r.material.dispose())}for(let r=0;r<e.length;r++){const a=e[r],s=this.testParticleMeshes[r];if(!s)continue;const o=(a.x/t-.5)*this.planeWidth,l=(a.y/n-.5)*this.planeHeight,c=this.engine.calculatePotentialHeight(a.x,a.y,this.particles);s.position.set(o,c+5.5,l);const h=a.q>0,u=s.material,f=h?16436245:440020;u.color.setHex(f),u.emissive.setHex(f),s.scale.setScalar(a.isAlive?1:.3)}this.render3D()}}clearTestParticleMeshes(){for(const e of this.testParticleMeshes)this.scene.remove(e),e.geometry.dispose(),e.material.dispose();this.testParticleMeshes=[],this.render3D()}setOptimalSplitCamera(){this.camera.position.set(0,160,240),this.controls.target.set(0,-5,0),this.controls.update(),this.render3D()}resetCamera(){this.camera.position.set(0,180,280),this.controls.target.set(0,0,0),this.controls.update(),this.render3D()}destroy(){this.isDestroyed=!0,this.stopLoop(),this.controls.dispose(),this.renderer.dispose()}}const Za=[{stepIndex:1,title:"引力・斥力と「作用・反作用」の発見",badge:"Step 1: 直感の獲得",goal:"符号による力の向きの違いと、電荷量が違っても受ける力は完全に等しい（ニュートン第3法則）ことを発見しよう！",narrative:"電荷には「プラス」と「マイナス」があります。プリセットの「異符号（引力）」や「同符号（斥力）」を試してみましょう。さらに「電荷差（+4μC & +1μC）」を選ぶと、電荷量が大きく違っても矢印の長さ（力の大きさ）が両方とも全く同じであることに気づくはずです！",recommendedAction:"「電荷差（+4μC & +1μC）」プリセットを押して、2つの力ベクトルの矢印の長さを見比べてみよう。",highlightSelector:".quick-presets",autoSetup:{q1:4,q2:1,view:"2d",vectors:!0,fieldLines:!1,efield:!1}},{stepIndex:2,title:"逆二乗則（距離と力）の急激な変化を体感",badge:"Step 2: 逆二乗則の核心",goal:"粒子をドラッグして、距離を2倍にすると力は1/4、距離を半分にすると力は4倍になる「急激なカーブ」を観察しよう！",narrative:"クーロンの法則の最大の特徴は「距離の2乗に反比例（1/r²）」することです。右上の「F(r) リアルタイムプロット」を見ながら一方の電荷を近づけたり遠ざけたりしてみましょう。距離を2倍に離すと、力は半分ではなく「1/4（0.25倍）」に激減します！",recommendedAction:"キャンバス上の青い電荷（q₂）をドラッグして距離 r を 1.0m や 2.0m に合わせ、グラフの青い動作点の動きを見よう。",highlightSelector:".graph-card",autoSetup:{q1:2,q2:-2,view:"2d",vectors:!0}},{stepIndex:3,title:"見えない「場」と「3D電位（山と谷）」の空間イメージ",badge:"Step 3: 空間イメージの獲得",goal:"電気力線と3D電位曲面（正電荷は山、負電荷は谷）を見て、なぜ遠隔で力が伝わるのかを直感的に理解しよう！",narrative:"電荷は周りの空間を歪ませて「電位の山や谷」を作ります。正電荷は急峻な「山」、負電荷は深い「すり鉢状の谷」です。テスト電荷を置くと、重力でボールが山から谷へ転がり落ちるようにスーッと流れていきます！",recommendedAction:"「スプリット表示」にして「⚡ テスト電荷を放出」を押してみよう。山から谷へ転がる感覚を味わえます。",highlightSelector:"#btn-spawn-test",autoSetup:{q1:3,q2:-3,view:"split",fieldLines:!0,vectors:!0}},{stepIndex:4,title:"手計算チャレンジ！シミュレーターで答え合わせ",badge:"Step 4: 自力計算のマスター",goal:"公式 F = k·|q₁q₂| / r² を使って紙とペンで手計算し、シミュレーターの計測値とピッタリ一致させよう！",narrative:"概念をマスターしたら、いよいよテストで解ける計算力を手に入れます！「演習課題」パネルから課題を選び、μC（マイクロクーロン）を 10⁻⁶ C に変換して計算してみましょう。入力して判定を押せば、正解判定と詳しい手計算ステップが見られます！",recommendedAction:"「演習課題」から課題1を選び、計算した数値を入力して「判定する」を押してみよう。",highlightSelector:"#challenges-panel",autoSetup:{q1:2,q2:-3,view:"2d",vectors:!0}}];class m4{constructor(){me(this,"currentStepIndex",0);me(this,"isActive",!1);me(this,"onStepChangeCallbacks",[]);me(this,"onModeToggleCallbacks",[])}getSteps(){return Za}getCurrentStep(){return Za[this.currentStepIndex]}getCurrentStepIndex(){return this.currentStepIndex}isLearningModeActive(){return this.isActive}start(){this.isActive=!0,this.currentStepIndex=0,this.notifyModeToggle(),this.notifyStepChange()}exit(){this.isActive=!1,this.notifyModeToggle()}toggle(){return this.isActive?this.exit():this.start(),this.isActive}nextStep(){return this.currentStepIndex<Za.length-1?(this.currentStepIndex++,this.notifyStepChange(),!0):!1}prevStep(){return this.currentStepIndex>0?(this.currentStepIndex--,this.notifyStepChange(),!0):!1}goToStep(e){e>=0&&e<Za.length&&(this.currentStepIndex=e,this.notifyStepChange())}onStepChange(e){this.onStepChangeCallbacks.push(e)}onModeToggle(e){this.onModeToggleCallbacks.push(e)}notifyStepChange(){const e=this.getCurrentStep();this.onStepChangeCallbacks.forEach(t=>t(e))}notifyModeToggle(){this.onModeToggleCallbacks.forEach(e=>e(this.isActive))}}const Ps=class Ps{constructor(){me(this,"presetChallenges",[{id:"challenge-1",title:"課題 1: 異符号の引力と基本計算",difficulty:"入門",summary:"q₁ = +2.0 μC, q₂ = -3.0 μC, 距離 r = 1.00 m",description:"真空中において、電荷 $q_1 = +2.0\\,\\mu\\mathrm{C}$ と $q_2 = -3.0\\,\\mu\\mathrm{C}$ が距離 $r = 1.00\\,\\mathrm{m}$ 離れて固定されている。2つの電荷の間に働く力の大きさ $F\\,\\mathrm{[N]}$ を求め、引力か斥力かを答えよ。（クーロンの比例定数 $k = 9.0 \\times 10^9\\,\\mathrm{N\\cdot m^2/C^2}$ を用いて計算せよ）",q1_uC:2,q2_uC:-3,r_m:1,answerForce_N:.0539,isAttraction:!0,solutionSteps:[{stepNumber:1,title:"力の向き（引力か斥力か）の判定",explanation:"電荷 $q_1 > 0$（正）と $q_2 < 0$（負）は**異符号**です。異なる符号の電荷同士は引き合うため、働く力は **引力** です。",formulaLatex:"q_1 \\cdot q_2 < 0 \\implies \\text{引力（引き合う）}"},{stepNumber:2,title:"単位の変換（μC から C へ）",explanation:"マイクロ（$\\mu$）は $10^{-6}$ 倍を表します。公式に代入する前に基本単位 クーロン $\\mathrm{[C]}$ に換算します。",formulaLatex:"q_1 = 2.0 \\times 10^{-6}\\,\\mathrm{C},\\quad |q_2| = 3.0 \\times 10^{-6}\\,\\mathrm{C}"},{stepNumber:3,title:"クーロンの法則への代入",explanation:"クーロンの法則の公式 $F = k \\frac{|q_1 q_2|}{r^2}$ に数値を代入します。",formulaLatex:"F = (9.0 \\times 10^9) \\times \\frac{(2.0 \\times 10^{-6}) \\times (3.0 \\times 10^{-6})}{(1.00)^2}"},{stepNumber:4,title:"「係数」と「10の指数」の分離計算",explanation:"ミスを防ぐため、数字部分と指数の部分を分けてまとめます。",formulaLatex:"\\text{係数: } 9.0 \\times 2.0 \\times 3.0 = 54,\\quad \\text{指数: } 10^9 \\times 10^{-6} \\times 10^{-6} = 10^{-3}"},{stepNumber:5,title:"最終計算結果",explanation:"数値を掛け合わせ、有効数字2桁でまとめます。",formulaLatex:"F = 54 \\times 10^{-3}\\,\\mathrm{N} = 0.054\\,\\mathrm{N}\\ \\left(5.4 \\times 10^{-2}\\,\\mathrm{N}\\right)"}]},{id:"challenge-2",title:"課題 2: 同符号の斥力と逆二乗則",difficulty:"基本",summary:"q₁ = +4.0 μC, q₂ = +2.0 μC, 距離 r = 2.00 m",description:"真空中において、電荷 $q_1 = +4.0\\,\\mu\\mathrm{C}$ と $q_2 = +2.0\\,\\mu\\mathrm{C}$ が距離 $r = 2.00\\,\\mathrm{m}$ 離れて置かれている。2つの電荷の間に働く力の大きさ $F\\,\\mathrm{[N]}$ を求め、引力か斥力かを判定せよ。",q1_uC:4,q2_uC:2,r_m:2,answerForce_N:.018,isAttraction:!1,solutionSteps:[{stepNumber:1,title:"力の向きの判定",explanation:"両方の電荷とも正（$q_1 > 0, q_2 > 0$）で**同符号**です。同じ符号の電荷同士は互いに押し合うため、働く力は **斥力（反発力）** です。",formulaLatex:"q_1 \\cdot q_2 > 0 \\implies \\text{斥力（反発する）}"},{stepNumber:2,title:"クーロンの法則の立式と分母の二乗",explanation:"距離 $r = 2.00\\,\\mathrm{m}$ なので分母は $r^2 = 2.00^2 = 4.00\\,\\mathrm{m^2}$ となります。",formulaLatex:"F = (9.0 \\times 10^9) \\times \\frac{(4.0 \\times 10^{-6}) \\times (2.0 \\times 10^{-6})}{(2.00)^2}"},{stepNumber:3,title:"計算の実行",explanation:"分子の $4.0$ と分母の $4.0$ が約分できるため、計算が非常に簡単になります。",formulaLatex:"F = (9.0 \\times 10^9) \\times \\frac{8.0 \\times 10^{-12}}{4.0} = 9.0 \\times 2.0 \\times 10^{-3} = 0.018\\,\\mathrm{N}"}]},{id:"challenge-3",title:"課題 3: 距離が半分（0.50m）になったときの力の跳ね上がり",difficulty:"応用",summary:"課題2の配置から距離を半分（r = 0.50 m）に近づけたときの力",description:"課題2と同じ電荷（$q_1 = +4.0\\,\\mu\\mathrm{C}, q_2 = +2.0\\,\\mu\\mathrm{C}$）の距離を $r = 2.00\\,\\mathrm{m}$ から $1/4$ の距離である $r = 0.50\\,\\mathrm{m}$ まで近づけた。このとき働く力の大きさ $F\\,\\mathrm{[N]}$ はいくらになるか。",q1_uC:4,q2_uC:2,r_m:.5,answerForce_N:.288,isAttraction:!1,solutionSteps:[{stepNumber:1,title:"逆二乗則の比率による解法（スマートな考え方）",explanation:"距離が $2.00\\,\\mathrm{m}$ から $0.50\\,\\mathrm{m}$ へと $\\frac{1}{4}$ 倍になったとき、力は距離の2乗に反比例するため $4^2 = 16$ 倍になります。",formulaLatex:"F_{new} = F_{old} \\times \\left(\\frac{2.00}{0.50}\\right)^2 = 0.018\\,\\mathrm{N} \\times 16 = 0.288\\,\\mathrm{N}"},{stepNumber:2,title:"公式への直接代入による検証",explanation:"分母が $(0.50)^2 = 0.25 = \\frac{1}{4}$ となるため、分子に4を掛ける計算と同じになります。",formulaLatex:"F = (9.0 \\times 10^9) \\times \\frac{8.0 \\times 10^{-12}}{0.25} = 72 \\times 4 \\times 10^{-3} = 0.288\\,\\mathrm{N}"}]},{id:"challenge-4",title:"課題 4: 極端な電荷差と作用・反作用の法則",difficulty:"発展",summary:"q₁ = +10.0 μC, q₂ = +1.0 μC, 距離 r = 1.50 m",description:"電荷 $q_1 = +10.0\\,\\mu\\mathrm{C}$ と $q_2 = +1.0\\,\\mu\\mathrm{C}$ が距離 $r = 1.50\\,\\mathrm{m}$ 離れている。電荷 $q_1$ が受ける力 $F_1$ と電荷 $q_2$ が受ける力 $F_2$ の関係として正しいものを選び、その力の大きさ $F\\,\\mathrm{[N]}$ を計算せよ。",q1_uC:10,q2_uC:1,r_m:1.5,answerForce_N:.04,isAttraction:!1,solutionSteps:[{stepNumber:1,title:"作用・反作用の法則（F₁ と F₂ の関係）",explanation:"電荷の大きさが10倍違っても、二者間に働く力はニュートンの第3法則（作用・反作用）により **常に同じ大きさ・逆向き** になります。すなわち $|F_1| = |F_2|$ です。",formulaLatex:"\\vec{F}_{1 \\to 2} = -\\vec{F}_{2 \\to 1}"},{stepNumber:2,title:"クーロンの法則による計算",explanation:"積 $|q_1 q_2| = (10.0 \\times 10^{-6}) \\times (1.0 \\times 10^{-6}) = 10.0 \\times 10^{-12}\\,\\mathrm{C^2}$、分母は $1.50^2 = 2.25$ です。",formulaLatex:"F = (9.0 \\times 10^9) \\times \\frac{10.0 \\times 10^{-12}}{2.25} = \\frac{90 \\times 10^{-3}}{2.25} = 0.040\\,\\mathrm{N}"}]}]);me(this,"currentChallenge");this.currentChallenge=this.presetChallenges[0]}getPresetChallenges(){return this.presetChallenges}getCurrentChallenge(){return this.currentChallenge}selectChallengeById(e){const t=this.presetChallenges.find(n=>n.id===e);return t?(this.currentChallenge=t,t):null}generateRandomChallenge(){const e=(E,w)=>{let C=0;for(;C===0;)C=Math.floor(Math.random()*(w-E+1))+E;return C},t=e(-8,8);let n=e(-8,8);const r=Math.random()>.5;(r&&t*n>0||!r&&t*n<0)&&(n=-n);const a=[.5,.75,1,1.25,1.5,2],s=a[Math.floor(Math.random()*a.length)],o=t*n<0,l=t*1e-6,c=n*1e-6,h=Ps.K_TEXTBOOK*Math.abs(l*c)/(s*s),u=t>0?`+${t.toFixed(1)}`:t.toFixed(1),f=n>0?`+${n.toFixed(1)}`:n.toFixed(1),g=(9*Math.abs(t*n)).toFixed(2),x=(s*s).toFixed(4).replace(/0+$/,"").replace(/\.$/,""),_=h>=.01?h.toFixed(3):h.toExponential(2),m=[{stepNumber:1,title:"力の向きの判定",explanation:`符号は $q_1 = ${u}\\,\\mu\\mathrm{C}$、$q_2 = ${f}\\,\\mu\\mathrm{C}$ です。${o?"異符号のため引き合う「引力」":"同符号のため反発する「斥力」"}になります。`,formulaLatex:o?"q_1 \\cdot q_2 < 0 \\implies \\text{引力}":"q_1 \\cdot q_2 > 0 \\implies \\text{斥力}"},{stepNumber:2,title:"単位換算と公式への代入",explanation:"$\\mu\\mathrm{C}$ を $10^{-6}\\,\\mathrm{C}$ に変換し、クーロンの法則に代入します。",formulaLatex:`F = (9.0 \\times 10^9) \\times \\frac{(${Math.abs(t).toFixed(1)} \\times 10^{-6}) \\times (${Math.abs(n).toFixed(1)} \\times 10^{-6})}{(${s.toFixed(2)})^2}`},{stepNumber:3,title:"指数の整理と計算実行",explanation:"数字部と指数部を計算します。",formulaLatex:`F = \\frac{${g} \\times 10^{-3}}{${x}} \\approx ${_}\\,\\mathrm{N}`}],p={id:`random-${Date.now()}`,title:"🎲 ランダム生成課題",difficulty:"ランダム",summary:`q₁ = ${u} μC, q₂ = ${f} μC, r = ${s.toFixed(2)} m`,description:`真空中において、$q_1 = ${u}\\,\\mu\\mathrm{C}$ と $q_2 = ${f}\\,\\mu\\mathrm{C}$ の2つの電荷が距離 $r = ${s.toFixed(2)}\\,\\mathrm{m}$ 離れて置かれている。2つの電荷の間に働く力の大きさ $F\\,\\mathrm{[N]}$ を求め、引力か斥力かを判定せよ。`,q1_uC:t,q2_uC:n,r_m:s,answerForce_N:h,isAttraction:o,solutionSteps:m};return this.currentChallenge=p,p}evaluateAnswer(e,t){const n=parseFloat(e.trim());if(isNaN(n)||n<=0)return{isCorrect:!1,forceCorrect:!1,directionCorrect:!1,userForce:0,expectedForce:this.currentChallenge.answerForce_N,message:"力の大きさには正の数値を入力してください（例: 0.054 または 5.4e-2）。"};const r=this.currentChallenge.answerForce_N,a=Math.abs(n-r)/r,s=a<=.06,o=this.currentChallenge.isAttraction?"attract":"repel",l=t===o,c=s&&l;let h="";return c?h="🎉 正解です！力の大きさと引力・斥力の判定が完全に一致しました！":!s&&!l?h="❌ 力の大きさと引力・斥力の判定の両方に誤りがあります。ステップ解説を確認してみましょう。":s?h="❌ 力の大きさは合っていますが、引力・斥力の判定が逆です。電荷のプラス・マイナスを確認しましょう。":h=`❌ 引力・斥力の判定は合っていますが、力の大きさの計算が違います（誤差: ${(a*100).toFixed(1)}%）。指数の扱いや分母の2乗を確認してください。`,{isCorrect:c,forceCorrect:s,directionCorrect:l,userForce:n,expectedForce:r,message:h}}};me(Ps,"K_TEXTBOOK",898755e4);let V0=Ps;class oe extends Error{constructor(e,t){var n="KaTeX parse error: "+e,r,a,s=t&&t.loc;if(s&&s.start<=s.end){var o=s.lexer.input;r=s.start,a=s.end,r===o.length?n+=" at end of input: ":n+=" at position "+(r+1)+": ";var l=o.slice(r,a).replace(/[^]/g,"$&̲"),c;r>15?c="…"+o.slice(r-15,r):c=o.slice(0,r);var h;a+15<o.length?h=o.slice(a,a+15)+"…":h=o.slice(a),n+=c+l+h}super(n),this.name="ParseError",this.position=void 0,this.length=void 0,this.rawMessage=void 0,Object.setPrototypeOf(this,oe.prototype),this.position=r,r!=null&&a!=null&&(this.length=a-r),this.rawMessage=e}}var g4=/([A-Z])/g,v4=i=>i.replace(g4,"-$1").toLowerCase(),x4={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"},_4=/[&><"']/g,jt=i=>String(i).replace(_4,e=>x4[e]),vs=i=>i.type==="ordgroup"||i.type==="color"?i.body.length===1?vs(i.body[0]):i:i.type==="font"?vs(i.body):i,y4=new Set(["mathord","textord","atom"]),ui=i=>y4.has(vs(i).type),b4=i=>{var e=/^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(i);return e?e[2]!==":"||!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(e[1])?null:e[1].toLowerCase():"_relative"},q0={displayMode:{type:"boolean",description:"Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",cli:"-d, --display-mode"},output:{type:{enum:["htmlAndMathml","html","mathml"]},description:"Determines the markup language of the output.",cli:"-F, --format <type>"},leqno:{type:"boolean",description:"Render display math in leqno style (left-justified tags)."},fleqn:{type:"boolean",description:"Render display math flush left."},throwOnError:{type:"boolean",default:!0,cli:"-t, --no-throw-on-error",cliDescription:"Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."},errorColor:{type:"string",default:"#cc0000",cli:"-c, --error-color <color>",cliDescription:"A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",cliProcessor:i=>"#"+i},macros:{type:"object",cli:"-m, --macro <def>",cliDescription:"Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",cliDefault:[],cliProcessor:(i,e)=>(e.push(i),e)},minRuleThickness:{type:"number",description:"Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",processor:i=>Math.max(0,i),cli:"--min-rule-thickness <size>",cliProcessor:parseFloat},colorIsTextColor:{type:"boolean",description:"Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",cli:"-b, --color-is-text-color"},strict:{type:[{enum:["warn","ignore","error"]},"boolean","function"],description:"Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",cli:"-S, --strict",cliDefault:!1},trust:{type:["boolean","function"],description:"Trust the input, enabling all HTML features such as \\url.",cli:"-T, --trust"},maxSize:{type:"number",default:1/0,description:"If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",processor:i=>Math.max(0,i),cli:"-s, --max-size <n>",cliProcessor:parseInt},maxExpand:{type:"number",default:1e3,description:"Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",processor:i=>Math.max(0,i),cli:"-e, --max-expand <n>",cliProcessor:i=>i==="Infinity"?1/0:parseInt(i)},globalGroup:{type:"boolean",cli:!1}};function M4(i){if(typeof i!="string")return i.enum[0];switch(i){case"boolean":return!1;case"string":return"";case"number":return 0;case"object":return{};default:throw new Error("Unexpected schema type; settings must declare an explicit default.")}}function S4(i){if(Object.prototype.hasOwnProperty.call(i,"default")&&i.default!==void 0)return i.default;var e=Array.isArray(i.type)?i.type[0]:i.type;return M4(e)}function w4(i,e,t,n){var r=Object.prototype.hasOwnProperty.call(t,e)?t[e]:void 0,a=Object.prototype.hasOwnProperty.call(n,"processor")?n.processor:void 0;i[e]=r!==void 0?a?a(r):r:S4(n)}class Tl{constructor(e){e===void 0&&(e={}),this.displayMode=void 0,this.output=void 0,this.leqno=void 0,this.fleqn=void 0,this.throwOnError=void 0,this.errorColor=void 0,this.macros=void 0,this.minRuleThickness=void 0,this.colorIsTextColor=void 0,this.strict=void 0,this.trust=void 0,this.maxSize=void 0,this.maxExpand=void 0,this.globalGroup=void 0,e=e||{};for(var t of Object.keys(q0)){var n=q0[t];n&&w4(this,t,e,n)}}reportNonstrict(e,t,n){var r=this.strict;if(typeof r=="function"&&(r=r(e,t,n)),!(!r||r==="ignore")){if(r===!0||r==="error")throw new oe("LaTeX-incompatible input and strict mode is set to 'error': "+(t+" ["+e+"]"),n);r==="warn"?typeof console<"u"&&console.warn("LaTeX-incompatible input and strict mode is set to 'warn': "+(t+" ["+e+"]")):typeof console<"u"&&console.warn("LaTeX-incompatible input and strict mode is set to "+("unrecognized '"+r+"': "+t+" ["+e+"]"))}}useStrictBehavior(e,t,n){var r=this.strict;if(typeof r=="function")try{r=r(e,t,n)}catch{r="error"}return!r||r==="ignore"?!1:r===!0||r==="error"?!0:r==="warn"?(typeof console<"u"&&console.warn("LaTeX-incompatible input and strict mode is set to 'warn': "+(t+" ["+e+"]")),!1):(typeof console<"u"&&console.warn("LaTeX-incompatible input and strict mode is set to "+("unrecognized '"+r+"': "+t+" ["+e+"]")),!1)}isTrusted(e){if("url"in e&&e.url&&!e.protocol){var t=b4(e.url);if(t==null)return!1;e.protocol=t}var n=typeof this.trust=="function"?this.trust(e):this.trust;return!!n}}class bi{constructor(e,t,n){this.id=void 0,this.size=void 0,this.cramped=void 0,this.id=e,this.size=t,this.cramped=n}sup(){return zn[E4[this.id]]}sub(){return zn[T4[this.id]]}fracNum(){return zn[A4[this.id]]}fracDen(){return zn[C4[this.id]]}cramp(){return zn[R4[this.id]]}text(){return zn[P4[this.id]]}isTight(){return this.size>=2}}var Al=0,Cs=1,Ir=2,ai=3,da=4,Tn=5,Hr=6,tn=7,zn=[new bi(Al,0,!1),new bi(Cs,0,!0),new bi(Ir,1,!1),new bi(ai,1,!0),new bi(da,2,!1),new bi(Tn,2,!0),new bi(Hr,3,!1),new bi(tn,3,!0)],E4=[da,Tn,da,Tn,Hr,tn,Hr,tn],T4=[Tn,Tn,Tn,Tn,tn,tn,tn,tn],A4=[Ir,ai,da,Tn,Hr,tn,Hr,tn],C4=[ai,ai,Tn,Tn,tn,tn,tn,tn],R4=[Cs,Cs,ai,ai,Tn,Tn,tn,tn],P4=[Al,Cs,Ir,ai,Ir,ai,Ir,ai],Xe={DISPLAY:zn[Al],TEXT:zn[Ir],SCRIPT:zn[da],SCRIPTSCRIPT:zn[Hr]},W0=[{name:"latin",blocks:[[256,591],[768,879]]},{name:"cyrillic",blocks:[[1024,1279]]},{name:"armenian",blocks:[[1328,1423]]},{name:"brahmic",blocks:[[2304,4255]]},{name:"georgian",blocks:[[4256,4351]]},{name:"cjk",blocks:[[12288,12543],[19968,40879],[65280,65376]]},{name:"hangul",blocks:[[44032,55215]]}];function D4(i){for(var e=0;e<W0.length;e++)for(var t=W0[e],n=0;n<t.blocks.length;n++){var r=t.blocks[n];if(i>=r[0]&&i<=r[1])return t.name}return null}var xs=[];W0.forEach(i=>i.blocks.forEach(e=>xs.push(...e)));function ku(i){for(var e=0;e<xs.length;e+=2)if(i>=xs[e]&&i<=xs[e+1])return!0;return!1}var Bt=i=>i+" "+i,wr=80,L4=function(e,t){return"M95,"+(622+e+t)+`
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l`+e/2.075+" -"+e+`
c5.3,-9.3,12,-14,20,-14
H400000v`+(40+e)+`H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M`+(834+e)+" "+t+"h400000v"+(40+e)+"h-400000z"},I4=function(e,t){return"M263,"+(601+e+t)+`c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l`+e/2.084+" -"+e+`
c4.7,-7.3,11,-11,19,-11
H40000v`+(40+e)+`H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M`+(1001+e)+" "+t+"h400000v"+(40+e)+"h-400000z"},N4=function(e,t){return"M983 "+(10+e+t)+`
l`+e/3.13+" -"+e+`
c4,-6.7,10,-10,18,-10 H400000v`+(40+e)+`
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M`+(1001+e)+" "+t+"h400000v"+(40+e)+"h-400000z"},U4=function(e,t){return"M424,"+(2398+e+t)+`
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l`+e/4.223+" -"+e+`c4,-6.7,10,-10,18,-10 H400000
v`+(40+e)+`H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M`+(1001+e)+" "+t+`
h400000v`+(40+e)+"h-400000z"},F4=function(e,t){return"M473,"+(2713+e+t)+`
c339.3,-1799.3,509.3,-2700,510,-2702 l`+e/5.298+" -"+e+`
c3.3,-7.3,9.3,-11,18,-11 H400000v`+(40+e)+`H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM`+(1001+e)+" "+t+"h400000v"+(40+e)+"H1017.7z"},O4=function(e){var t=e/2;return"M400000 "+e+" H0 L"+t+" 0 l65 45 L145 "+(e-80)+" H400000z"},k4=function(e,t,n){var r=n-54-t-e;return"M702 "+(e+t)+"H400000"+(40+e)+`
H742v`+r+`l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 `+t+"H400000v"+(40+e)+"H742z"},B4=function(e,t,n){t=1e3*t;var r="";switch(e){case"sqrtMain":r=L4(t,wr);break;case"sqrtSize1":r=I4(t,wr);break;case"sqrtSize2":r=N4(t,wr);break;case"sqrtSize3":r=U4(t,wr);break;case"sqrtSize4":r=F4(t,wr);break;case"sqrtTall":r=k4(t,wr,n)}return r},z4=function(e,t){switch(e){case"⎜":return Bt("M291 0 H417 V"+t+" H291z");case"∣":return Bt("M145 0 H188 V"+t+" H145z");case"∥":return Bt("M145 0 H188 V"+t+" H145z")+Bt("M367 0 H410 V"+t+" H367z");case"⎟":return Bt("M457 0 H583 V"+t+" H457z");case"⎢":return Bt("M319 0 H403 V"+t+" H319z");case"⎥":return Bt("M263 0 H347 V"+t+" H263z");case"⎪":return Bt("M384 0 H504 V"+t+" H384z");case"⏐":return Bt("M312 0 H355 V"+t+" H312z");case"‖":return Bt("M257 0 H300 V"+t+" H257z")+Bt("M478 0 H521 V"+t+" H478z");default:return""}},ah={doubleleftarrow:`M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,doublerightarrow:`M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,leftarrow:`M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,leftbrace:`M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,leftbraceunder:`M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,leftgroup:`M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,leftgroupunder:`M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,leftharpoon:`M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,leftharpoonplus:`M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,leftharpoondown:`M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,leftharpoondownplus:`M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,lefthook:`M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,leftlinesegment:Bt("M40 281 V428 H0 V94 H40 V241 H400000 v40z"),leftbracketunder:Bt("M0 0 h120 V290 H399995 v120 H0z"),leftbracketover:Bt("M0 440 h120 V150 H399995 v-120 H0z"),leftmapsto:Bt("M40 281 V448H0V74H40V241H400000v40z"),leftToFrom:`M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,longequal:Bt("M0 50 h400000 v40H0z m0 194h40000v40H0z"),midbrace:`M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,midbraceunder:`M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,oiintSize1:`M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,oiintSize2:`M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,oiiintSize1:`M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,oiiintSize2:`M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,rightarrow:`M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,rightbrace:`M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,rightbraceunder:`M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,rightgroup:`M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,rightgroupunder:`M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,rightharpoon:`M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,rightharpoonplus:`M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,rightharpoondown:`M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,rightharpoondownplus:`M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,righthook:`M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,rightlinesegment:Bt("M399960 241 V94 h40 V428 h-40 V281 H0 v-40z"),rightbracketunder:Bt("M399995 0 h-120 V290 H0 v120 H400000z"),rightbracketover:Bt("M399995 440 h-120 V150 H0 v-120 H399995z"),rightToFrom:`M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,twoheadleftarrow:`M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,twoheadrightarrow:`M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,tilde1:`M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,tilde2:`M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,tilde3:`M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,tilde4:`M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,vec:`M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,widehat1:`M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,widehat2:`M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widehat3:`M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widehat4:`M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widecheck1:`M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,widecheck2:`M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,widecheck3:`M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,widecheck4:`M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,baraboveleftarrow:`M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,rightarrowabovebar:`M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,baraboveshortleftharpoon:`M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,rightharpoonaboveshortbar:`M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,shortbaraboveleftharpoon:`M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,shortrightharpoonabovebar:`M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`},H4=function(e,t){switch(e){case"lbrack":return"M403 1759 V84 H666 V0 H319 V1759 v"+t+` v1759 v84 h347 v-84
H403z M403 1759 V0 H319 V1759 v`+t+" v1759 v84 h84z";case"rbrack":return"M347 1759 V0 H0 V84 H263 V1759 v"+t+` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v`+t+" v1759 h84z";case"vert":return"M145 15 v585 v"+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v`+t+" v585 h43z";case"doublevert":return"M145 15 v585 v"+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v`+t+` v585 h43z
M367 15 v585 v`+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v`+t+" v585 h43z";case"lfloor":return"M319 602 V0 H403 V602 v"+t+` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v`+t+" v1715 H319z";case"rfloor":return"M319 602 V0 H403 V602 v"+t+` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v`+t+" v1715 H319z";case"lceil":return"M403 1759 V84 H666 V0 H319 V1759 v"+t+` v602 h84z
M403 1759 V0 H319 V1759 v`+t+" v602 h84z";case"rceil":return"M347 1759 V0 H0 V84 H263 V1759 v"+t+` v602 h84z
M347 1759 V0 h-84 V1759 v`+t+" v602 h84z";case"lparen":return`M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,`+(t+84)+`c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-`+(t+92)+`c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`;case"rparen":return`M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,`+(t+9)+`
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-`+(t+144)+`c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`;default:throw new Error("Unknown stretchy delimiter.")}};function G4(i){return"toText"in i}class Xr{constructor(e){this.children=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,this.children=e,this.classes=[],this.height=0,this.depth=0,this.maxFontSize=0,this.style={}}hasClass(e){return this.classes.includes(e)}toNode(){for(var e=document.createDocumentFragment(),t=0;t<this.children.length;t++)e.appendChild(this.children[t].toNode());return e}toMarkup(){for(var e="",t=0;t<this.children.length;t++)e+=this.children[t].toMarkup();return e}toText(){return this.children.map(e=>{if(G4(e))return e.toText();throw new Error("Expected MathDomNode with toText, got "+e.constructor.name)}).join("")}}var X0={pt:1,mm:7227/2540,cm:7227/254,in:72.27,bp:803/800,pc:12,dd:1238/1157,cc:14856/1157,nd:685/642,nc:1370/107,sp:1/65536,px:803/800},V4={ex:!0,em:!0,mu:!0},Bu=function(e){return typeof e!="string"&&(e=e.unit),e in X0||e in V4||e==="ex"},Tt=function(e,t){var n;if(e.unit in X0)n=X0[e.unit]/t.fontMetrics().ptPerEm/t.sizeMultiplier;else if(e.unit==="mu")n=t.fontMetrics().cssEmPerMu;else{var r;if(t.style.isTight()?r=t.havingStyle(t.style.text()):r=t,e.unit==="ex")n=r.fontMetrics().xHeight;else if(e.unit==="em")n=r.fontMetrics().quad;else throw new oe("Invalid unit: '"+e.unit+"'");r!==t&&(n*=r.sizeMultiplier/t.sizeMultiplier)}return Math.min(e.number*n,t.maxSize)},he=function(e){return+e.toFixed(4)+"em"},Pi=function(e){return e.filter(t=>t).join(" ")},Cl=function(e){var t="";for(var n of Object.keys(e)){var r=e[n];r!==void 0&&(t+=v4(n)+":"+r+";")}return t},zu=function(e,t,n){if(this.classes=e||[],this.attributes={},this.height=0,this.depth=0,this.maxFontSize=0,this.style=n||{},t){t.style.isTight()&&this.classes.push("mtight");var r=t.getColor();r&&(this.style.color=r)}},Hu=function(e){var t=document.createElement(e);t.className=Pi(this.classes),Object.assign(t.style,this.style);for(var n of Object.keys(this.attributes))t.setAttribute(n,this.attributes[n]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t},q4=/[\s"'>/=\x00-\x1f]/,Gu=function(e){var t="<"+e;this.classes.length&&(t+=' class="'+jt(Pi(this.classes))+'"');var n=Cl(this.style);n&&(t+=' style="'+jt(n)+'"');for(var r of Object.keys(this.attributes)){if(q4.test(r))throw new oe("Invalid attribute name '"+r+"'");t+=" "+r+'="'+jt(this.attributes[r])+'"'}t+=">";for(var a=0;a<this.children.length;a++)t+=this.children[a].toMarkup();return t+="</"+e+">",t};class $r{constructor(e,t,n,r){this.children=void 0,this.attributes=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.width=void 0,this.maxFontSize=void 0,this.style=void 0,this.italic=void 0,zu.call(this,e,n,r),this.children=t||[]}setAttribute(e,t){this.attributes[e]=t}hasClass(e){return this.classes.includes(e)}toNode(){return Hu.call(this,"span")}toMarkup(){return Gu.call(this,"span")}}class Us{constructor(e,t,n,r){this.children=void 0,this.attributes=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,zu.call(this,t,r),this.children=n||[],this.setAttribute("href",e)}setAttribute(e,t){this.attributes[e]=t}hasClass(e){return this.classes.includes(e)}toNode(){return Hu.call(this,"a")}toMarkup(){return Gu.call(this,"a")}}class W4{constructor(e,t,n){this.src=void 0,this.alt=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,this.alt=t,this.src=e,this.classes=["mord"],this.height=0,this.depth=0,this.maxFontSize=0,this.style=n}hasClass(e){return this.classes.includes(e)}toNode(){var e=document.createElement("img");return e.src=this.src,e.alt=this.alt,e.className="mord",Object.assign(e.style,this.style),e}toMarkup(){var e='<img src="'+jt(this.src)+'"'+(' alt="'+jt(this.alt)+'"'),t=Cl(this.style);return t&&(e+=' style="'+jt(t)+'"'),e+="'/>",e}}var X4={î:"ı̂",ï:"ı̈",í:"ı́",ì:"ı̀"};class xn{constructor(e,t,n,r,a,s,o,l){this.text=void 0,this.height=void 0,this.depth=void 0,this.italic=void 0,this.skew=void 0,this.width=void 0,this.maxFontSize=void 0,this.classes=void 0,this.style=void 0,this.text=e,this.height=t||0,this.depth=n||0,this.italic=r||0,this.skew=a||0,this.width=s||0,this.classes=o||[],this.style=l||{},this.maxFontSize=0;var c=D4(this.text.charCodeAt(0));c&&this.classes.push(c+"_fallback"),/[îïíì]/.test(this.text)&&(this.text=X4[this.text])}hasClass(e){return this.classes.includes(e)}toNode(){var e=document.createTextNode(this.text),t=null;return this.italic>0&&(t=document.createElement("span"),t.style.marginRight=he(this.italic)),this.classes.length>0&&(t=t||document.createElement("span"),t.className=Pi(this.classes)),Object.keys(this.style).length>0&&(t=t||document.createElement("span"),Object.assign(t.style,this.style)),t?(t.appendChild(e),t):e}toMarkup(){var e=!1,t="<span";this.classes.length&&(e=!0,t+=' class="',t+=jt(Pi(this.classes)),t+='"');var n="";this.italic>0&&(n+="margin-right:"+he(this.italic)+";"),n+=Cl(this.style),n&&(e=!0,t+=' style="'+jt(n)+'"');var r=jt(this.text);return e?(t+=">",t+=r,t+="</span>",t):r}}class hi{constructor(e,t){this.children=void 0,this.attributes=void 0,this.children=e||[],this.attributes=t||{}}toNode(){var e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"svg");for(var n of Object.keys(this.attributes))t.setAttribute(n,this.attributes[n]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t}toMarkup(){var e='<svg xmlns="http://www.w3.org/2000/svg"';for(var t of Object.keys(this.attributes))e+=" "+t+'="'+jt(this.attributes[t])+'"';e+=">";for(var n=0;n<this.children.length;n++)e+=this.children[n].toMarkup();return e+="</svg>",e}}class Di{constructor(e,t){this.pathName=void 0,this.alternate=void 0,this.pathName=e,this.alternate=t}toNode(){var e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"path");return this.alternate?t.setAttribute("d",this.alternate):t.setAttribute("d",ah[this.pathName]),t}toMarkup(){return this.alternate?'<path d="'+jt(this.alternate)+'"/>':'<path d="'+jt(ah[this.pathName])+'"/>'}}class $0{constructor(e){this.attributes=void 0,this.attributes=e||{}}toNode(){var e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"line");for(var n of Object.keys(this.attributes))t.setAttribute(n,this.attributes[n]);return t}toMarkup(){var e="<line";for(var t of Object.keys(this.attributes))e+=" "+t+'="'+jt(this.attributes[t])+'"';return e+="/>",e}}function $4(i){if(i instanceof xn)return i;throw new Error("Expected symbolNode but got "+String(i)+".")}function Y4(i){if(i instanceof $r)return i;throw new Error("Expected span<HtmlDomNode> but got "+String(i)+".")}var j4=i=>i instanceof $r||i instanceof Us||i instanceof Xr,Gn={"AMS-Regular":{32:[0,0,0,0,.25],65:[0,.68889,0,0,.72222],66:[0,.68889,0,0,.66667],67:[0,.68889,0,0,.72222],68:[0,.68889,0,0,.72222],69:[0,.68889,0,0,.66667],70:[0,.68889,0,0,.61111],71:[0,.68889,0,0,.77778],72:[0,.68889,0,0,.77778],73:[0,.68889,0,0,.38889],74:[.16667,.68889,0,0,.5],75:[0,.68889,0,0,.77778],76:[0,.68889,0,0,.66667],77:[0,.68889,0,0,.94445],78:[0,.68889,0,0,.72222],79:[.16667,.68889,0,0,.77778],80:[0,.68889,0,0,.61111],81:[.16667,.68889,0,0,.77778],82:[0,.68889,0,0,.72222],83:[0,.68889,0,0,.55556],84:[0,.68889,0,0,.66667],85:[0,.68889,0,0,.72222],86:[0,.68889,0,0,.72222],87:[0,.68889,0,0,1],88:[0,.68889,0,0,.72222],89:[0,.68889,0,0,.72222],90:[0,.68889,0,0,.66667],107:[0,.68889,0,0,.55556],160:[0,0,0,0,.25],165:[0,.675,.025,0,.75],174:[.15559,.69224,0,0,.94666],240:[0,.68889,0,0,.55556],295:[0,.68889,0,0,.54028],710:[0,.825,0,0,2.33334],732:[0,.9,0,0,2.33334],770:[0,.825,0,0,2.33334],771:[0,.9,0,0,2.33334],989:[.08167,.58167,0,0,.77778],1008:[0,.43056,.04028,0,.66667],8245:[0,.54986,0,0,.275],8463:[0,.68889,0,0,.54028],8487:[0,.68889,0,0,.72222],8498:[0,.68889,0,0,.55556],8502:[0,.68889,0,0,.66667],8503:[0,.68889,0,0,.44445],8504:[0,.68889,0,0,.66667],8513:[0,.68889,0,0,.63889],8592:[-.03598,.46402,0,0,.5],8594:[-.03598,.46402,0,0,.5],8602:[-.13313,.36687,0,0,1],8603:[-.13313,.36687,0,0,1],8606:[.01354,.52239,0,0,1],8608:[.01354,.52239,0,0,1],8610:[.01354,.52239,0,0,1.11111],8611:[.01354,.52239,0,0,1.11111],8619:[0,.54986,0,0,1],8620:[0,.54986,0,0,1],8621:[-.13313,.37788,0,0,1.38889],8622:[-.13313,.36687,0,0,1],8624:[0,.69224,0,0,.5],8625:[0,.69224,0,0,.5],8630:[0,.43056,0,0,1],8631:[0,.43056,0,0,1],8634:[.08198,.58198,0,0,.77778],8635:[.08198,.58198,0,0,.77778],8638:[.19444,.69224,0,0,.41667],8639:[.19444,.69224,0,0,.41667],8642:[.19444,.69224,0,0,.41667],8643:[.19444,.69224,0,0,.41667],8644:[.1808,.675,0,0,1],8646:[.1808,.675,0,0,1],8647:[.1808,.675,0,0,1],8648:[.19444,.69224,0,0,.83334],8649:[.1808,.675,0,0,1],8650:[.19444,.69224,0,0,.83334],8651:[.01354,.52239,0,0,1],8652:[.01354,.52239,0,0,1],8653:[-.13313,.36687,0,0,1],8654:[-.13313,.36687,0,0,1],8655:[-.13313,.36687,0,0,1],8666:[.13667,.63667,0,0,1],8667:[.13667,.63667,0,0,1],8669:[-.13313,.37788,0,0,1],8672:[-.064,.437,0,0,1.334],8674:[-.064,.437,0,0,1.334],8705:[0,.825,0,0,.5],8708:[0,.68889,0,0,.55556],8709:[.08167,.58167,0,0,.77778],8717:[0,.43056,0,0,.42917],8722:[-.03598,.46402,0,0,.5],8724:[.08198,.69224,0,0,.77778],8726:[.08167,.58167,0,0,.77778],8733:[0,.69224,0,0,.77778],8736:[0,.69224,0,0,.72222],8737:[0,.69224,0,0,.72222],8738:[.03517,.52239,0,0,.72222],8739:[.08167,.58167,0,0,.22222],8740:[.25142,.74111,0,0,.27778],8741:[.08167,.58167,0,0,.38889],8742:[.25142,.74111,0,0,.5],8756:[0,.69224,0,0,.66667],8757:[0,.69224,0,0,.66667],8764:[-.13313,.36687,0,0,.77778],8765:[-.13313,.37788,0,0,.77778],8769:[-.13313,.36687,0,0,.77778],8770:[-.03625,.46375,0,0,.77778],8774:[.30274,.79383,0,0,.77778],8776:[-.01688,.48312,0,0,.77778],8778:[.08167,.58167,0,0,.77778],8782:[.06062,.54986,0,0,.77778],8783:[.06062,.54986,0,0,.77778],8785:[.08198,.58198,0,0,.77778],8786:[.08198,.58198,0,0,.77778],8787:[.08198,.58198,0,0,.77778],8790:[0,.69224,0,0,.77778],8791:[.22958,.72958,0,0,.77778],8796:[.08198,.91667,0,0,.77778],8806:[.25583,.75583,0,0,.77778],8807:[.25583,.75583,0,0,.77778],8808:[.25142,.75726,0,0,.77778],8809:[.25142,.75726,0,0,.77778],8812:[.25583,.75583,0,0,.5],8814:[.20576,.70576,0,0,.77778],8815:[.20576,.70576,0,0,.77778],8816:[.30274,.79383,0,0,.77778],8817:[.30274,.79383,0,0,.77778],8818:[.22958,.72958,0,0,.77778],8819:[.22958,.72958,0,0,.77778],8822:[.1808,.675,0,0,.77778],8823:[.1808,.675,0,0,.77778],8828:[.13667,.63667,0,0,.77778],8829:[.13667,.63667,0,0,.77778],8830:[.22958,.72958,0,0,.77778],8831:[.22958,.72958,0,0,.77778],8832:[.20576,.70576,0,0,.77778],8833:[.20576,.70576,0,0,.77778],8840:[.30274,.79383,0,0,.77778],8841:[.30274,.79383,0,0,.77778],8842:[.13597,.63597,0,0,.77778],8843:[.13597,.63597,0,0,.77778],8847:[.03517,.54986,0,0,.77778],8848:[.03517,.54986,0,0,.77778],8858:[.08198,.58198,0,0,.77778],8859:[.08198,.58198,0,0,.77778],8861:[.08198,.58198,0,0,.77778],8862:[0,.675,0,0,.77778],8863:[0,.675,0,0,.77778],8864:[0,.675,0,0,.77778],8865:[0,.675,0,0,.77778],8872:[0,.69224,0,0,.61111],8873:[0,.69224,0,0,.72222],8874:[0,.69224,0,0,.88889],8876:[0,.68889,0,0,.61111],8877:[0,.68889,0,0,.61111],8878:[0,.68889,0,0,.72222],8879:[0,.68889,0,0,.72222],8882:[.03517,.54986,0,0,.77778],8883:[.03517,.54986,0,0,.77778],8884:[.13667,.63667,0,0,.77778],8885:[.13667,.63667,0,0,.77778],8888:[0,.54986,0,0,1.11111],8890:[.19444,.43056,0,0,.55556],8891:[.19444,.69224,0,0,.61111],8892:[.19444,.69224,0,0,.61111],8901:[0,.54986,0,0,.27778],8903:[.08167,.58167,0,0,.77778],8905:[.08167,.58167,0,0,.77778],8906:[.08167,.58167,0,0,.77778],8907:[0,.69224,0,0,.77778],8908:[0,.69224,0,0,.77778],8909:[-.03598,.46402,0,0,.77778],8910:[0,.54986,0,0,.76042],8911:[0,.54986,0,0,.76042],8912:[.03517,.54986,0,0,.77778],8913:[.03517,.54986,0,0,.77778],8914:[0,.54986,0,0,.66667],8915:[0,.54986,0,0,.66667],8916:[0,.69224,0,0,.66667],8918:[.0391,.5391,0,0,.77778],8919:[.0391,.5391,0,0,.77778],8920:[.03517,.54986,0,0,1.33334],8921:[.03517,.54986,0,0,1.33334],8922:[.38569,.88569,0,0,.77778],8923:[.38569,.88569,0,0,.77778],8926:[.13667,.63667,0,0,.77778],8927:[.13667,.63667,0,0,.77778],8928:[.30274,.79383,0,0,.77778],8929:[.30274,.79383,0,0,.77778],8934:[.23222,.74111,0,0,.77778],8935:[.23222,.74111,0,0,.77778],8936:[.23222,.74111,0,0,.77778],8937:[.23222,.74111,0,0,.77778],8938:[.20576,.70576,0,0,.77778],8939:[.20576,.70576,0,0,.77778],8940:[.30274,.79383,0,0,.77778],8941:[.30274,.79383,0,0,.77778],8994:[.19444,.69224,0,0,.77778],8995:[.19444,.69224,0,0,.77778],9416:[.15559,.69224,0,0,.90222],9484:[0,.69224,0,0,.5],9488:[0,.69224,0,0,.5],9492:[0,.37788,0,0,.5],9496:[0,.37788,0,0,.5],9585:[.19444,.68889,0,0,.88889],9586:[.19444,.74111,0,0,.88889],9632:[0,.675,0,0,.77778],9633:[0,.675,0,0,.77778],9650:[0,.54986,0,0,.72222],9651:[0,.54986,0,0,.72222],9654:[.03517,.54986,0,0,.77778],9660:[0,.54986,0,0,.72222],9661:[0,.54986,0,0,.72222],9664:[.03517,.54986,0,0,.77778],9674:[.11111,.69224,0,0,.66667],9733:[.19444,.69224,0,0,.94445],10003:[0,.69224,0,0,.83334],10016:[0,.69224,0,0,.83334],10731:[.11111,.69224,0,0,.66667],10846:[.19444,.75583,0,0,.61111],10877:[.13667,.63667,0,0,.77778],10878:[.13667,.63667,0,0,.77778],10885:[.25583,.75583,0,0,.77778],10886:[.25583,.75583,0,0,.77778],10887:[.13597,.63597,0,0,.77778],10888:[.13597,.63597,0,0,.77778],10889:[.26167,.75726,0,0,.77778],10890:[.26167,.75726,0,0,.77778],10891:[.48256,.98256,0,0,.77778],10892:[.48256,.98256,0,0,.77778],10901:[.13667,.63667,0,0,.77778],10902:[.13667,.63667,0,0,.77778],10933:[.25142,.75726,0,0,.77778],10934:[.25142,.75726,0,0,.77778],10935:[.26167,.75726,0,0,.77778],10936:[.26167,.75726,0,0,.77778],10937:[.26167,.75726,0,0,.77778],10938:[.26167,.75726,0,0,.77778],10949:[.25583,.75583,0,0,.77778],10950:[.25583,.75583,0,0,.77778],10955:[.28481,.79383,0,0,.77778],10956:[.28481,.79383,0,0,.77778],57350:[.08167,.58167,0,0,.22222],57351:[.08167,.58167,0,0,.38889],57352:[.08167,.58167,0,0,.77778],57353:[0,.43056,.04028,0,.66667],57356:[.25142,.75726,0,0,.77778],57357:[.25142,.75726,0,0,.77778],57358:[.41951,.91951,0,0,.77778],57359:[.30274,.79383,0,0,.77778],57360:[.30274,.79383,0,0,.77778],57361:[.41951,.91951,0,0,.77778],57366:[.25142,.75726,0,0,.77778],57367:[.25142,.75726,0,0,.77778],57368:[.25142,.75726,0,0,.77778],57369:[.25142,.75726,0,0,.77778],57370:[.13597,.63597,0,0,.77778],57371:[.13597,.63597,0,0,.77778]},"Caligraphic-Regular":{32:[0,0,0,0,.25],65:[0,.68333,0,.19445,.79847],66:[0,.68333,.03041,.13889,.65681],67:[0,.68333,.05834,.13889,.52653],68:[0,.68333,.02778,.08334,.77139],69:[0,.68333,.08944,.11111,.52778],70:[0,.68333,.09931,.11111,.71875],71:[.09722,.68333,.0593,.11111,.59487],72:[0,.68333,.00965,.11111,.84452],73:[0,.68333,.07382,0,.54452],74:[.09722,.68333,.18472,.16667,.67778],75:[0,.68333,.01445,.05556,.76195],76:[0,.68333,0,.13889,.68972],77:[0,.68333,0,.13889,1.2009],78:[0,.68333,.14736,.08334,.82049],79:[0,.68333,.02778,.11111,.79611],80:[0,.68333,.08222,.08334,.69556],81:[.09722,.68333,0,.11111,.81667],82:[0,.68333,0,.08334,.8475],83:[0,.68333,.075,.13889,.60556],84:[0,.68333,.25417,0,.54464],85:[0,.68333,.09931,.08334,.62583],86:[0,.68333,.08222,0,.61278],87:[0,.68333,.08222,.08334,.98778],88:[0,.68333,.14643,.13889,.7133],89:[.09722,.68333,.08222,.08334,.66834],90:[0,.68333,.07944,.13889,.72473],160:[0,0,0,0,.25]},"Fraktur-Regular":{32:[0,0,0,0,.25],33:[0,.69141,0,0,.29574],34:[0,.69141,0,0,.21471],38:[0,.69141,0,0,.73786],39:[0,.69141,0,0,.21201],40:[.24982,.74947,0,0,.38865],41:[.24982,.74947,0,0,.38865],42:[0,.62119,0,0,.27764],43:[.08319,.58283,0,0,.75623],44:[0,.10803,0,0,.27764],45:[.08319,.58283,0,0,.75623],46:[0,.10803,0,0,.27764],47:[.24982,.74947,0,0,.50181],48:[0,.47534,0,0,.50181],49:[0,.47534,0,0,.50181],50:[0,.47534,0,0,.50181],51:[.18906,.47534,0,0,.50181],52:[.18906,.47534,0,0,.50181],53:[.18906,.47534,0,0,.50181],54:[0,.69141,0,0,.50181],55:[.18906,.47534,0,0,.50181],56:[0,.69141,0,0,.50181],57:[.18906,.47534,0,0,.50181],58:[0,.47534,0,0,.21606],59:[.12604,.47534,0,0,.21606],61:[-.13099,.36866,0,0,.75623],63:[0,.69141,0,0,.36245],65:[0,.69141,0,0,.7176],66:[0,.69141,0,0,.88397],67:[0,.69141,0,0,.61254],68:[0,.69141,0,0,.83158],69:[0,.69141,0,0,.66278],70:[.12604,.69141,0,0,.61119],71:[0,.69141,0,0,.78539],72:[.06302,.69141,0,0,.7203],73:[0,.69141,0,0,.55448],74:[.12604,.69141,0,0,.55231],75:[0,.69141,0,0,.66845],76:[0,.69141,0,0,.66602],77:[0,.69141,0,0,1.04953],78:[0,.69141,0,0,.83212],79:[0,.69141,0,0,.82699],80:[.18906,.69141,0,0,.82753],81:[.03781,.69141,0,0,.82699],82:[0,.69141,0,0,.82807],83:[0,.69141,0,0,.82861],84:[0,.69141,0,0,.66899],85:[0,.69141,0,0,.64576],86:[0,.69141,0,0,.83131],87:[0,.69141,0,0,1.04602],88:[0,.69141,0,0,.71922],89:[.18906,.69141,0,0,.83293],90:[.12604,.69141,0,0,.60201],91:[.24982,.74947,0,0,.27764],93:[.24982,.74947,0,0,.27764],94:[0,.69141,0,0,.49965],97:[0,.47534,0,0,.50046],98:[0,.69141,0,0,.51315],99:[0,.47534,0,0,.38946],100:[0,.62119,0,0,.49857],101:[0,.47534,0,0,.40053],102:[.18906,.69141,0,0,.32626],103:[.18906,.47534,0,0,.5037],104:[.18906,.69141,0,0,.52126],105:[0,.69141,0,0,.27899],106:[0,.69141,0,0,.28088],107:[0,.69141,0,0,.38946],108:[0,.69141,0,0,.27953],109:[0,.47534,0,0,.76676],110:[0,.47534,0,0,.52666],111:[0,.47534,0,0,.48885],112:[.18906,.52396,0,0,.50046],113:[.18906,.47534,0,0,.48912],114:[0,.47534,0,0,.38919],115:[0,.47534,0,0,.44266],116:[0,.62119,0,0,.33301],117:[0,.47534,0,0,.5172],118:[0,.52396,0,0,.5118],119:[0,.52396,0,0,.77351],120:[.18906,.47534,0,0,.38865],121:[.18906,.47534,0,0,.49884],122:[.18906,.47534,0,0,.39054],160:[0,0,0,0,.25],8216:[0,.69141,0,0,.21471],8217:[0,.69141,0,0,.21471],58112:[0,.62119,0,0,.49749],58113:[0,.62119,0,0,.4983],58114:[.18906,.69141,0,0,.33328],58115:[.18906,.69141,0,0,.32923],58116:[.18906,.47534,0,0,.50343],58117:[0,.69141,0,0,.33301],58118:[0,.62119,0,0,.33409],58119:[0,.47534,0,0,.50073]},"Main-Bold":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.35],34:[0,.69444,0,0,.60278],35:[.19444,.69444,0,0,.95833],36:[.05556,.75,0,0,.575],37:[.05556,.75,0,0,.95833],38:[0,.69444,0,0,.89444],39:[0,.69444,0,0,.31944],40:[.25,.75,0,0,.44722],41:[.25,.75,0,0,.44722],42:[0,.75,0,0,.575],43:[.13333,.63333,0,0,.89444],44:[.19444,.15556,0,0,.31944],45:[0,.44444,0,0,.38333],46:[0,.15556,0,0,.31944],47:[.25,.75,0,0,.575],48:[0,.64444,0,0,.575],49:[0,.64444,0,0,.575],50:[0,.64444,0,0,.575],51:[0,.64444,0,0,.575],52:[0,.64444,0,0,.575],53:[0,.64444,0,0,.575],54:[0,.64444,0,0,.575],55:[0,.64444,0,0,.575],56:[0,.64444,0,0,.575],57:[0,.64444,0,0,.575],58:[0,.44444,0,0,.31944],59:[.19444,.44444,0,0,.31944],60:[.08556,.58556,0,0,.89444],61:[-.10889,.39111,0,0,.89444],62:[.08556,.58556,0,0,.89444],63:[0,.69444,0,0,.54305],64:[0,.69444,0,0,.89444],65:[0,.68611,0,0,.86944],66:[0,.68611,0,0,.81805],67:[0,.68611,0,0,.83055],68:[0,.68611,0,0,.88194],69:[0,.68611,0,0,.75555],70:[0,.68611,0,0,.72361],71:[0,.68611,0,0,.90416],72:[0,.68611,0,0,.9],73:[0,.68611,0,0,.43611],74:[0,.68611,0,0,.59444],75:[0,.68611,0,0,.90138],76:[0,.68611,0,0,.69166],77:[0,.68611,0,0,1.09166],78:[0,.68611,0,0,.9],79:[0,.68611,0,0,.86388],80:[0,.68611,0,0,.78611],81:[.19444,.68611,0,0,.86388],82:[0,.68611,0,0,.8625],83:[0,.68611,0,0,.63889],84:[0,.68611,0,0,.8],85:[0,.68611,0,0,.88472],86:[0,.68611,.01597,0,.86944],87:[0,.68611,.01597,0,1.18888],88:[0,.68611,0,0,.86944],89:[0,.68611,.02875,0,.86944],90:[0,.68611,0,0,.70277],91:[.25,.75,0,0,.31944],92:[.25,.75,0,0,.575],93:[.25,.75,0,0,.31944],94:[0,.69444,0,0,.575],95:[.31,.13444,.03194,0,.575],97:[0,.44444,0,0,.55902],98:[0,.69444,0,0,.63889],99:[0,.44444,0,0,.51111],100:[0,.69444,0,0,.63889],101:[0,.44444,0,0,.52708],102:[0,.69444,.10903,0,.35139],103:[.19444,.44444,.01597,0,.575],104:[0,.69444,0,0,.63889],105:[0,.69444,0,0,.31944],106:[.19444,.69444,0,0,.35139],107:[0,.69444,0,0,.60694],108:[0,.69444,0,0,.31944],109:[0,.44444,0,0,.95833],110:[0,.44444,0,0,.63889],111:[0,.44444,0,0,.575],112:[.19444,.44444,0,0,.63889],113:[.19444,.44444,0,0,.60694],114:[0,.44444,0,0,.47361],115:[0,.44444,0,0,.45361],116:[0,.63492,0,0,.44722],117:[0,.44444,0,0,.63889],118:[0,.44444,.01597,0,.60694],119:[0,.44444,.01597,0,.83055],120:[0,.44444,0,0,.60694],121:[.19444,.44444,.01597,0,.60694],122:[0,.44444,0,0,.51111],123:[.25,.75,0,0,.575],124:[.25,.75,0,0,.31944],125:[.25,.75,0,0,.575],126:[.35,.34444,0,0,.575],160:[0,0,0,0,.25],163:[0,.69444,0,0,.86853],168:[0,.69444,0,0,.575],172:[0,.44444,0,0,.76666],176:[0,.69444,0,0,.86944],177:[.13333,.63333,0,0,.89444],184:[.17014,0,0,0,.51111],198:[0,.68611,0,0,1.04166],215:[.13333,.63333,0,0,.89444],216:[.04861,.73472,0,0,.89444],223:[0,.69444,0,0,.59722],230:[0,.44444,0,0,.83055],247:[.13333,.63333,0,0,.89444],248:[.09722,.54167,0,0,.575],305:[0,.44444,0,0,.31944],338:[0,.68611,0,0,1.16944],339:[0,.44444,0,0,.89444],567:[.19444,.44444,0,0,.35139],710:[0,.69444,0,0,.575],711:[0,.63194,0,0,.575],713:[0,.59611,0,0,.575],714:[0,.69444,0,0,.575],715:[0,.69444,0,0,.575],728:[0,.69444,0,0,.575],729:[0,.69444,0,0,.31944],730:[0,.69444,0,0,.86944],732:[0,.69444,0,0,.575],733:[0,.69444,0,0,.575],915:[0,.68611,0,0,.69166],916:[0,.68611,0,0,.95833],920:[0,.68611,0,0,.89444],923:[0,.68611,0,0,.80555],926:[0,.68611,0,0,.76666],928:[0,.68611,0,0,.9],931:[0,.68611,0,0,.83055],933:[0,.68611,0,0,.89444],934:[0,.68611,0,0,.83055],936:[0,.68611,0,0,.89444],937:[0,.68611,0,0,.83055],8211:[0,.44444,.03194,0,.575],8212:[0,.44444,.03194,0,1.14999],8216:[0,.69444,0,0,.31944],8217:[0,.69444,0,0,.31944],8220:[0,.69444,0,0,.60278],8221:[0,.69444,0,0,.60278],8224:[.19444,.69444,0,0,.51111],8225:[.19444,.69444,0,0,.51111],8242:[0,.55556,0,0,.34444],8407:[0,.72444,.15486,0,.575],8463:[0,.69444,0,0,.66759],8465:[0,.69444,0,0,.83055],8467:[0,.69444,0,0,.47361],8472:[.19444,.44444,0,0,.74027],8476:[0,.69444,0,0,.83055],8501:[0,.69444,0,0,.70277],8592:[-.10889,.39111,0,0,1.14999],8593:[.19444,.69444,0,0,.575],8594:[-.10889,.39111,0,0,1.14999],8595:[.19444,.69444,0,0,.575],8596:[-.10889,.39111,0,0,1.14999],8597:[.25,.75,0,0,.575],8598:[.19444,.69444,0,0,1.14999],8599:[.19444,.69444,0,0,1.14999],8600:[.19444,.69444,0,0,1.14999],8601:[.19444,.69444,0,0,1.14999],8636:[-.10889,.39111,0,0,1.14999],8637:[-.10889,.39111,0,0,1.14999],8640:[-.10889,.39111,0,0,1.14999],8641:[-.10889,.39111,0,0,1.14999],8656:[-.10889,.39111,0,0,1.14999],8657:[.19444,.69444,0,0,.70277],8658:[-.10889,.39111,0,0,1.14999],8659:[.19444,.69444,0,0,.70277],8660:[-.10889,.39111,0,0,1.14999],8661:[.25,.75,0,0,.70277],8704:[0,.69444,0,0,.63889],8706:[0,.69444,.06389,0,.62847],8707:[0,.69444,0,0,.63889],8709:[.05556,.75,0,0,.575],8711:[0,.68611,0,0,.95833],8712:[.08556,.58556,0,0,.76666],8715:[.08556,.58556,0,0,.76666],8722:[.13333,.63333,0,0,.89444],8723:[.13333,.63333,0,0,.89444],8725:[.25,.75,0,0,.575],8726:[.25,.75,0,0,.575],8727:[-.02778,.47222,0,0,.575],8728:[-.02639,.47361,0,0,.575],8729:[-.02639,.47361,0,0,.575],8730:[.18,.82,0,0,.95833],8733:[0,.44444,0,0,.89444],8734:[0,.44444,0,0,1.14999],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.31944],8741:[.25,.75,0,0,.575],8743:[0,.55556,0,0,.76666],8744:[0,.55556,0,0,.76666],8745:[0,.55556,0,0,.76666],8746:[0,.55556,0,0,.76666],8747:[.19444,.69444,.12778,0,.56875],8764:[-.10889,.39111,0,0,.89444],8768:[.19444,.69444,0,0,.31944],8771:[.00222,.50222,0,0,.89444],8773:[.027,.638,0,0,.894],8776:[.02444,.52444,0,0,.89444],8781:[.00222,.50222,0,0,.89444],8801:[.00222,.50222,0,0,.89444],8804:[.19667,.69667,0,0,.89444],8805:[.19667,.69667,0,0,.89444],8810:[.08556,.58556,0,0,1.14999],8811:[.08556,.58556,0,0,1.14999],8826:[.08556,.58556,0,0,.89444],8827:[.08556,.58556,0,0,.89444],8834:[.08556,.58556,0,0,.89444],8835:[.08556,.58556,0,0,.89444],8838:[.19667,.69667,0,0,.89444],8839:[.19667,.69667,0,0,.89444],8846:[0,.55556,0,0,.76666],8849:[.19667,.69667,0,0,.89444],8850:[.19667,.69667,0,0,.89444],8851:[0,.55556,0,0,.76666],8852:[0,.55556,0,0,.76666],8853:[.13333,.63333,0,0,.89444],8854:[.13333,.63333,0,0,.89444],8855:[.13333,.63333,0,0,.89444],8856:[.13333,.63333,0,0,.89444],8857:[.13333,.63333,0,0,.89444],8866:[0,.69444,0,0,.70277],8867:[0,.69444,0,0,.70277],8868:[0,.69444,0,0,.89444],8869:[0,.69444,0,0,.89444],8900:[-.02639,.47361,0,0,.575],8901:[-.02639,.47361,0,0,.31944],8902:[-.02778,.47222,0,0,.575],8968:[.25,.75,0,0,.51111],8969:[.25,.75,0,0,.51111],8970:[.25,.75,0,0,.51111],8971:[.25,.75,0,0,.51111],8994:[-.13889,.36111,0,0,1.14999],8995:[-.13889,.36111,0,0,1.14999],9651:[.19444,.69444,0,0,1.02222],9657:[-.02778,.47222,0,0,.575],9661:[.19444,.69444,0,0,1.02222],9667:[-.02778,.47222,0,0,.575],9711:[.19444,.69444,0,0,1.14999],9824:[.12963,.69444,0,0,.89444],9825:[.12963,.69444,0,0,.89444],9826:[.12963,.69444,0,0,.89444],9827:[.12963,.69444,0,0,.89444],9837:[0,.75,0,0,.44722],9838:[.19444,.69444,0,0,.44722],9839:[.19444,.69444,0,0,.44722],10216:[.25,.75,0,0,.44722],10217:[.25,.75,0,0,.44722],10815:[0,.68611,0,0,.9],10927:[.19667,.69667,0,0,.89444],10928:[.19667,.69667,0,0,.89444],57376:[.19444,.69444,0,0,0]},"Main-BoldItalic":{32:[0,0,0,0,.25],33:[0,.69444,.11417,0,.38611],34:[0,.69444,.07939,0,.62055],35:[.19444,.69444,.06833,0,.94444],37:[.05556,.75,.12861,0,.94444],38:[0,.69444,.08528,0,.88555],39:[0,.69444,.12945,0,.35555],40:[.25,.75,.15806,0,.47333],41:[.25,.75,.03306,0,.47333],42:[0,.75,.14333,0,.59111],43:[.10333,.60333,.03306,0,.88555],44:[.19444,.14722,0,0,.35555],45:[0,.44444,.02611,0,.41444],46:[0,.14722,0,0,.35555],47:[.25,.75,.15806,0,.59111],48:[0,.64444,.13167,0,.59111],49:[0,.64444,.13167,0,.59111],50:[0,.64444,.13167,0,.59111],51:[0,.64444,.13167,0,.59111],52:[.19444,.64444,.13167,0,.59111],53:[0,.64444,.13167,0,.59111],54:[0,.64444,.13167,0,.59111],55:[.19444,.64444,.13167,0,.59111],56:[0,.64444,.13167,0,.59111],57:[0,.64444,.13167,0,.59111],58:[0,.44444,.06695,0,.35555],59:[.19444,.44444,.06695,0,.35555],61:[-.10889,.39111,.06833,0,.88555],63:[0,.69444,.11472,0,.59111],64:[0,.69444,.09208,0,.88555],65:[0,.68611,0,0,.86555],66:[0,.68611,.0992,0,.81666],67:[0,.68611,.14208,0,.82666],68:[0,.68611,.09062,0,.87555],69:[0,.68611,.11431,0,.75666],70:[0,.68611,.12903,0,.72722],71:[0,.68611,.07347,0,.89527],72:[0,.68611,.17208,0,.8961],73:[0,.68611,.15681,0,.47166],74:[0,.68611,.145,0,.61055],75:[0,.68611,.14208,0,.89499],76:[0,.68611,0,0,.69777],77:[0,.68611,.17208,0,1.07277],78:[0,.68611,.17208,0,.8961],79:[0,.68611,.09062,0,.85499],80:[0,.68611,.0992,0,.78721],81:[.19444,.68611,.09062,0,.85499],82:[0,.68611,.02559,0,.85944],83:[0,.68611,.11264,0,.64999],84:[0,.68611,.12903,0,.7961],85:[0,.68611,.17208,0,.88083],86:[0,.68611,.18625,0,.86555],87:[0,.68611,.18625,0,1.15999],88:[0,.68611,.15681,0,.86555],89:[0,.68611,.19803,0,.86555],90:[0,.68611,.14208,0,.70888],91:[.25,.75,.1875,0,.35611],93:[.25,.75,.09972,0,.35611],94:[0,.69444,.06709,0,.59111],95:[.31,.13444,.09811,0,.59111],97:[0,.44444,.09426,0,.59111],98:[0,.69444,.07861,0,.53222],99:[0,.44444,.05222,0,.53222],100:[0,.69444,.10861,0,.59111],101:[0,.44444,.085,0,.53222],102:[.19444,.69444,.21778,0,.4],103:[.19444,.44444,.105,0,.53222],104:[0,.69444,.09426,0,.59111],105:[0,.69326,.11387,0,.35555],106:[.19444,.69326,.1672,0,.35555],107:[0,.69444,.11111,0,.53222],108:[0,.69444,.10861,0,.29666],109:[0,.44444,.09426,0,.94444],110:[0,.44444,.09426,0,.64999],111:[0,.44444,.07861,0,.59111],112:[.19444,.44444,.07861,0,.59111],113:[.19444,.44444,.105,0,.53222],114:[0,.44444,.11111,0,.50167],115:[0,.44444,.08167,0,.48694],116:[0,.63492,.09639,0,.385],117:[0,.44444,.09426,0,.62055],118:[0,.44444,.11111,0,.53222],119:[0,.44444,.11111,0,.76777],120:[0,.44444,.12583,0,.56055],121:[.19444,.44444,.105,0,.56166],122:[0,.44444,.13889,0,.49055],126:[.35,.34444,.11472,0,.59111],160:[0,0,0,0,.25],168:[0,.69444,.11473,0,.59111],176:[0,.69444,0,0,.94888],184:[.17014,0,0,0,.53222],198:[0,.68611,.11431,0,1.02277],216:[.04861,.73472,.09062,0,.88555],223:[.19444,.69444,.09736,0,.665],230:[0,.44444,.085,0,.82666],248:[.09722,.54167,.09458,0,.59111],305:[0,.44444,.09426,0,.35555],338:[0,.68611,.11431,0,1.14054],339:[0,.44444,.085,0,.82666],567:[.19444,.44444,.04611,0,.385],710:[0,.69444,.06709,0,.59111],711:[0,.63194,.08271,0,.59111],713:[0,.59444,.10444,0,.59111],714:[0,.69444,.08528,0,.59111],715:[0,.69444,0,0,.59111],728:[0,.69444,.10333,0,.59111],729:[0,.69444,.12945,0,.35555],730:[0,.69444,0,0,.94888],732:[0,.69444,.11472,0,.59111],733:[0,.69444,.11472,0,.59111],915:[0,.68611,.12903,0,.69777],916:[0,.68611,0,0,.94444],920:[0,.68611,.09062,0,.88555],923:[0,.68611,0,0,.80666],926:[0,.68611,.15092,0,.76777],928:[0,.68611,.17208,0,.8961],931:[0,.68611,.11431,0,.82666],933:[0,.68611,.10778,0,.88555],934:[0,.68611,.05632,0,.82666],936:[0,.68611,.10778,0,.88555],937:[0,.68611,.0992,0,.82666],8211:[0,.44444,.09811,0,.59111],8212:[0,.44444,.09811,0,1.18221],8216:[0,.69444,.12945,0,.35555],8217:[0,.69444,.12945,0,.35555],8220:[0,.69444,.16772,0,.62055],8221:[0,.69444,.07939,0,.62055]},"Main-Italic":{32:[0,0,0,0,.25],33:[0,.69444,.12417,0,.30667],34:[0,.69444,.06961,0,.51444],35:[.19444,.69444,.06616,0,.81777],37:[.05556,.75,.13639,0,.81777],38:[0,.69444,.09694,0,.76666],39:[0,.69444,.12417,0,.30667],40:[.25,.75,.16194,0,.40889],41:[.25,.75,.03694,0,.40889],42:[0,.75,.14917,0,.51111],43:[.05667,.56167,.03694,0,.76666],44:[.19444,.10556,0,0,.30667],45:[0,.43056,.02826,0,.35778],46:[0,.10556,0,0,.30667],47:[.25,.75,.16194,0,.51111],48:[0,.64444,.13556,0,.51111],49:[0,.64444,.13556,0,.51111],50:[0,.64444,.13556,0,.51111],51:[0,.64444,.13556,0,.51111],52:[.19444,.64444,.13556,0,.51111],53:[0,.64444,.13556,0,.51111],54:[0,.64444,.13556,0,.51111],55:[.19444,.64444,.13556,0,.51111],56:[0,.64444,.13556,0,.51111],57:[0,.64444,.13556,0,.51111],58:[0,.43056,.0582,0,.30667],59:[.19444,.43056,.0582,0,.30667],61:[-.13313,.36687,.06616,0,.76666],63:[0,.69444,.1225,0,.51111],64:[0,.69444,.09597,0,.76666],65:[0,.68333,0,0,.74333],66:[0,.68333,.10257,0,.70389],67:[0,.68333,.14528,0,.71555],68:[0,.68333,.09403,0,.755],69:[0,.68333,.12028,0,.67833],70:[0,.68333,.13305,0,.65277],71:[0,.68333,.08722,0,.77361],72:[0,.68333,.16389,0,.74333],73:[0,.68333,.15806,0,.38555],74:[0,.68333,.14028,0,.525],75:[0,.68333,.14528,0,.76888],76:[0,.68333,0,0,.62722],77:[0,.68333,.16389,0,.89666],78:[0,.68333,.16389,0,.74333],79:[0,.68333,.09403,0,.76666],80:[0,.68333,.10257,0,.67833],81:[.19444,.68333,.09403,0,.76666],82:[0,.68333,.03868,0,.72944],83:[0,.68333,.11972,0,.56222],84:[0,.68333,.13305,0,.71555],85:[0,.68333,.16389,0,.74333],86:[0,.68333,.18361,0,.74333],87:[0,.68333,.18361,0,.99888],88:[0,.68333,.15806,0,.74333],89:[0,.68333,.19383,0,.74333],90:[0,.68333,.14528,0,.61333],91:[.25,.75,.1875,0,.30667],93:[.25,.75,.10528,0,.30667],94:[0,.69444,.06646,0,.51111],95:[.31,.12056,.09208,0,.51111],97:[0,.43056,.07671,0,.51111],98:[0,.69444,.06312,0,.46],99:[0,.43056,.05653,0,.46],100:[0,.69444,.10333,0,.51111],101:[0,.43056,.07514,0,.46],102:[.19444,.69444,.21194,0,.30667],103:[.19444,.43056,.08847,0,.46],104:[0,.69444,.07671,0,.51111],105:[0,.65536,.1019,0,.30667],106:[.19444,.65536,.14467,0,.30667],107:[0,.69444,.10764,0,.46],108:[0,.69444,.10333,0,.25555],109:[0,.43056,.07671,0,.81777],110:[0,.43056,.07671,0,.56222],111:[0,.43056,.06312,0,.51111],112:[.19444,.43056,.06312,0,.51111],113:[.19444,.43056,.08847,0,.46],114:[0,.43056,.10764,0,.42166],115:[0,.43056,.08208,0,.40889],116:[0,.61508,.09486,0,.33222],117:[0,.43056,.07671,0,.53666],118:[0,.43056,.10764,0,.46],119:[0,.43056,.10764,0,.66444],120:[0,.43056,.12042,0,.46389],121:[.19444,.43056,.08847,0,.48555],122:[0,.43056,.12292,0,.40889],126:[.35,.31786,.11585,0,.51111],160:[0,0,0,0,.25],168:[0,.66786,.10474,0,.51111],176:[0,.69444,0,0,.83129],184:[.17014,0,0,0,.46],198:[0,.68333,.12028,0,.88277],216:[.04861,.73194,.09403,0,.76666],223:[.19444,.69444,.10514,0,.53666],230:[0,.43056,.07514,0,.71555],248:[.09722,.52778,.09194,0,.51111],338:[0,.68333,.12028,0,.98499],339:[0,.43056,.07514,0,.71555],710:[0,.69444,.06646,0,.51111],711:[0,.62847,.08295,0,.51111],713:[0,.56167,.10333,0,.51111],714:[0,.69444,.09694,0,.51111],715:[0,.69444,0,0,.51111],728:[0,.69444,.10806,0,.51111],729:[0,.66786,.11752,0,.30667],730:[0,.69444,0,0,.83129],732:[0,.66786,.11585,0,.51111],733:[0,.69444,.1225,0,.51111],915:[0,.68333,.13305,0,.62722],916:[0,.68333,0,0,.81777],920:[0,.68333,.09403,0,.76666],923:[0,.68333,0,0,.69222],926:[0,.68333,.15294,0,.66444],928:[0,.68333,.16389,0,.74333],931:[0,.68333,.12028,0,.71555],933:[0,.68333,.11111,0,.76666],934:[0,.68333,.05986,0,.71555],936:[0,.68333,.11111,0,.76666],937:[0,.68333,.10257,0,.71555],8211:[0,.43056,.09208,0,.51111],8212:[0,.43056,.09208,0,1.02222],8216:[0,.69444,.12417,0,.30667],8217:[0,.69444,.12417,0,.30667],8220:[0,.69444,.1685,0,.51444],8221:[0,.69444,.06961,0,.51444],8463:[0,.68889,0,0,.54028]},"Main-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.27778],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.77778],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.19444,.10556,0,0,.27778],45:[0,.43056,0,0,.33333],46:[0,.10556,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.64444,0,0,.5],49:[0,.64444,0,0,.5],50:[0,.64444,0,0,.5],51:[0,.64444,0,0,.5],52:[0,.64444,0,0,.5],53:[0,.64444,0,0,.5],54:[0,.64444,0,0,.5],55:[0,.64444,0,0,.5],56:[0,.64444,0,0,.5],57:[0,.64444,0,0,.5],58:[0,.43056,0,0,.27778],59:[.19444,.43056,0,0,.27778],60:[.0391,.5391,0,0,.77778],61:[-.13313,.36687,0,0,.77778],62:[.0391,.5391,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.77778],65:[0,.68333,0,0,.75],66:[0,.68333,0,0,.70834],67:[0,.68333,0,0,.72222],68:[0,.68333,0,0,.76389],69:[0,.68333,0,0,.68056],70:[0,.68333,0,0,.65278],71:[0,.68333,0,0,.78472],72:[0,.68333,0,0,.75],73:[0,.68333,0,0,.36111],74:[0,.68333,0,0,.51389],75:[0,.68333,0,0,.77778],76:[0,.68333,0,0,.625],77:[0,.68333,0,0,.91667],78:[0,.68333,0,0,.75],79:[0,.68333,0,0,.77778],80:[0,.68333,0,0,.68056],81:[.19444,.68333,0,0,.77778],82:[0,.68333,0,0,.73611],83:[0,.68333,0,0,.55556],84:[0,.68333,0,0,.72222],85:[0,.68333,0,0,.75],86:[0,.68333,.01389,0,.75],87:[0,.68333,.01389,0,1.02778],88:[0,.68333,0,0,.75],89:[0,.68333,.025,0,.75],90:[0,.68333,0,0,.61111],91:[.25,.75,0,0,.27778],92:[.25,.75,0,0,.5],93:[.25,.75,0,0,.27778],94:[0,.69444,0,0,.5],95:[.31,.12056,.02778,0,.5],97:[0,.43056,0,0,.5],98:[0,.69444,0,0,.55556],99:[0,.43056,0,0,.44445],100:[0,.69444,0,0,.55556],101:[0,.43056,0,0,.44445],102:[0,.69444,.07778,0,.30556],103:[.19444,.43056,.01389,0,.5],104:[0,.69444,0,0,.55556],105:[0,.66786,0,0,.27778],106:[.19444,.66786,0,0,.30556],107:[0,.69444,0,0,.52778],108:[0,.69444,0,0,.27778],109:[0,.43056,0,0,.83334],110:[0,.43056,0,0,.55556],111:[0,.43056,0,0,.5],112:[.19444,.43056,0,0,.55556],113:[.19444,.43056,0,0,.52778],114:[0,.43056,0,0,.39167],115:[0,.43056,0,0,.39445],116:[0,.61508,0,0,.38889],117:[0,.43056,0,0,.55556],118:[0,.43056,.01389,0,.52778],119:[0,.43056,.01389,0,.72222],120:[0,.43056,0,0,.52778],121:[.19444,.43056,.01389,0,.52778],122:[0,.43056,0,0,.44445],123:[.25,.75,0,0,.5],124:[.25,.75,0,0,.27778],125:[.25,.75,0,0,.5],126:[.35,.31786,0,0,.5],160:[0,0,0,0,.25],163:[0,.69444,0,0,.76909],167:[.19444,.69444,0,0,.44445],168:[0,.66786,0,0,.5],172:[0,.43056,0,0,.66667],176:[0,.69444,0,0,.75],177:[.08333,.58333,0,0,.77778],182:[.19444,.69444,0,0,.61111],184:[.17014,0,0,0,.44445],198:[0,.68333,0,0,.90278],215:[.08333,.58333,0,0,.77778],216:[.04861,.73194,0,0,.77778],223:[0,.69444,0,0,.5],230:[0,.43056,0,0,.72222],247:[.08333,.58333,0,0,.77778],248:[.09722,.52778,0,0,.5],305:[0,.43056,0,0,.27778],338:[0,.68333,0,0,1.01389],339:[0,.43056,0,0,.77778],567:[.19444,.43056,0,0,.30556],710:[0,.69444,0,0,.5],711:[0,.62847,0,0,.5],713:[0,.56778,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.66786,0,0,.27778],730:[0,.69444,0,0,.75],732:[0,.66786,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.68333,0,0,.625],916:[0,.68333,0,0,.83334],920:[0,.68333,0,0,.77778],923:[0,.68333,0,0,.69445],926:[0,.68333,0,0,.66667],928:[0,.68333,0,0,.75],931:[0,.68333,0,0,.72222],933:[0,.68333,0,0,.77778],934:[0,.68333,0,0,.72222],936:[0,.68333,0,0,.77778],937:[0,.68333,0,0,.72222],8211:[0,.43056,.02778,0,.5],8212:[0,.43056,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5],8224:[.19444,.69444,0,0,.44445],8225:[.19444,.69444,0,0,.44445],8230:[0,.123,0,0,1.172],8242:[0,.55556,0,0,.275],8407:[0,.71444,.15382,0,.5],8463:[0,.68889,0,0,.54028],8465:[0,.69444,0,0,.72222],8467:[0,.69444,0,.11111,.41667],8472:[.19444,.43056,0,.11111,.63646],8476:[0,.69444,0,0,.72222],8501:[0,.69444,0,0,.61111],8592:[-.13313,.36687,0,0,1],8593:[.19444,.69444,0,0,.5],8594:[-.13313,.36687,0,0,1],8595:[.19444,.69444,0,0,.5],8596:[-.13313,.36687,0,0,1],8597:[.25,.75,0,0,.5],8598:[.19444,.69444,0,0,1],8599:[.19444,.69444,0,0,1],8600:[.19444,.69444,0,0,1],8601:[.19444,.69444,0,0,1],8614:[.011,.511,0,0,1],8617:[.011,.511,0,0,1.126],8618:[.011,.511,0,0,1.126],8636:[-.13313,.36687,0,0,1],8637:[-.13313,.36687,0,0,1],8640:[-.13313,.36687,0,0,1],8641:[-.13313,.36687,0,0,1],8652:[.011,.671,0,0,1],8656:[-.13313,.36687,0,0,1],8657:[.19444,.69444,0,0,.61111],8658:[-.13313,.36687,0,0,1],8659:[.19444,.69444,0,0,.61111],8660:[-.13313,.36687,0,0,1],8661:[.25,.75,0,0,.61111],8704:[0,.69444,0,0,.55556],8706:[0,.69444,.05556,.08334,.5309],8707:[0,.69444,0,0,.55556],8709:[.05556,.75,0,0,.5],8711:[0,.68333,0,0,.83334],8712:[.0391,.5391,0,0,.66667],8715:[.0391,.5391,0,0,.66667],8722:[.08333,.58333,0,0,.77778],8723:[.08333,.58333,0,0,.77778],8725:[.25,.75,0,0,.5],8726:[.25,.75,0,0,.5],8727:[-.03472,.46528,0,0,.5],8728:[-.05555,.44445,0,0,.5],8729:[-.05555,.44445,0,0,.5],8730:[.2,.8,0,0,.83334],8733:[0,.43056,0,0,.77778],8734:[0,.43056,0,0,1],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.27778],8741:[.25,.75,0,0,.5],8743:[0,.55556,0,0,.66667],8744:[0,.55556,0,0,.66667],8745:[0,.55556,0,0,.66667],8746:[0,.55556,0,0,.66667],8747:[.19444,.69444,.11111,0,.41667],8764:[-.13313,.36687,0,0,.77778],8768:[.19444,.69444,0,0,.27778],8771:[-.03625,.46375,0,0,.77778],8773:[-.022,.589,0,0,.778],8776:[-.01688,.48312,0,0,.77778],8781:[-.03625,.46375,0,0,.77778],8784:[-.133,.673,0,0,.778],8801:[-.03625,.46375,0,0,.77778],8804:[.13597,.63597,0,0,.77778],8805:[.13597,.63597,0,0,.77778],8810:[.0391,.5391,0,0,1],8811:[.0391,.5391,0,0,1],8826:[.0391,.5391,0,0,.77778],8827:[.0391,.5391,0,0,.77778],8834:[.0391,.5391,0,0,.77778],8835:[.0391,.5391,0,0,.77778],8838:[.13597,.63597,0,0,.77778],8839:[.13597,.63597,0,0,.77778],8846:[0,.55556,0,0,.66667],8849:[.13597,.63597,0,0,.77778],8850:[.13597,.63597,0,0,.77778],8851:[0,.55556,0,0,.66667],8852:[0,.55556,0,0,.66667],8853:[.08333,.58333,0,0,.77778],8854:[.08333,.58333,0,0,.77778],8855:[.08333,.58333,0,0,.77778],8856:[.08333,.58333,0,0,.77778],8857:[.08333,.58333,0,0,.77778],8866:[0,.69444,0,0,.61111],8867:[0,.69444,0,0,.61111],8868:[0,.69444,0,0,.77778],8869:[0,.69444,0,0,.77778],8872:[.249,.75,0,0,.867],8900:[-.05555,.44445,0,0,.5],8901:[-.05555,.44445,0,0,.27778],8902:[-.03472,.46528,0,0,.5],8904:[.005,.505,0,0,.9],8942:[.03,.903,0,0,.278],8943:[-.19,.313,0,0,1.172],8945:[-.1,.823,0,0,1.282],8968:[.25,.75,0,0,.44445],8969:[.25,.75,0,0,.44445],8970:[.25,.75,0,0,.44445],8971:[.25,.75,0,0,.44445],8994:[-.14236,.35764,0,0,1],8995:[-.14236,.35764,0,0,1],9136:[.244,.744,0,0,.412],9137:[.244,.745,0,0,.412],9651:[.19444,.69444,0,0,.88889],9657:[-.03472,.46528,0,0,.5],9661:[.19444,.69444,0,0,.88889],9667:[-.03472,.46528,0,0,.5],9711:[.19444,.69444,0,0,1],9824:[.12963,.69444,0,0,.77778],9825:[.12963,.69444,0,0,.77778],9826:[.12963,.69444,0,0,.77778],9827:[.12963,.69444,0,0,.77778],9837:[0,.75,0,0,.38889],9838:[.19444,.69444,0,0,.38889],9839:[.19444,.69444,0,0,.38889],10216:[.25,.75,0,0,.38889],10217:[.25,.75,0,0,.38889],10222:[.244,.744,0,0,.412],10223:[.244,.745,0,0,.412],10229:[.011,.511,0,0,1.609],10230:[.011,.511,0,0,1.638],10231:[.011,.511,0,0,1.859],10232:[.024,.525,0,0,1.609],10233:[.024,.525,0,0,1.638],10234:[.024,.525,0,0,1.858],10236:[.011,.511,0,0,1.638],10815:[0,.68333,0,0,.75],10927:[.13597,.63597,0,0,.77778],10928:[.13597,.63597,0,0,.77778],57376:[.19444,.69444,0,0,0]},"Math-BoldItalic":{32:[0,0,0,0,.25],48:[0,.44444,0,0,.575],49:[0,.44444,0,0,.575],50:[0,.44444,0,0,.575],51:[.19444,.44444,0,0,.575],52:[.19444,.44444,0,0,.575],53:[.19444,.44444,0,0,.575],54:[0,.64444,0,0,.575],55:[.19444,.44444,0,0,.575],56:[0,.64444,0,0,.575],57:[.19444,.44444,0,0,.575],65:[0,.68611,0,0,.86944],66:[0,.68611,.04835,0,.8664],67:[0,.68611,.06979,0,.81694],68:[0,.68611,.03194,0,.93812],69:[0,.68611,.05451,0,.81007],70:[0,.68611,.15972,0,.68889],71:[0,.68611,0,0,.88673],72:[0,.68611,.08229,0,.98229],73:[0,.68611,.07778,0,.51111],74:[0,.68611,.10069,0,.63125],75:[0,.68611,.06979,0,.97118],76:[0,.68611,0,0,.75555],77:[0,.68611,.11424,0,1.14201],78:[0,.68611,.11424,0,.95034],79:[0,.68611,.03194,0,.83666],80:[0,.68611,.15972,0,.72309],81:[.19444,.68611,0,0,.86861],82:[0,.68611,.00421,0,.87235],83:[0,.68611,.05382,0,.69271],84:[0,.68611,.15972,0,.63663],85:[0,.68611,.11424,0,.80027],86:[0,.68611,.25555,0,.67778],87:[0,.68611,.15972,0,1.09305],88:[0,.68611,.07778,0,.94722],89:[0,.68611,.25555,0,.67458],90:[0,.68611,.06979,0,.77257],97:[0,.44444,0,0,.63287],98:[0,.69444,0,0,.52083],99:[0,.44444,0,0,.51342],100:[0,.69444,0,0,.60972],101:[0,.44444,0,0,.55361],102:[.19444,.69444,.11042,0,.56806],103:[.19444,.44444,.03704,0,.5449],104:[0,.69444,0,0,.66759],105:[0,.69326,0,0,.4048],106:[.19444,.69326,.0622,0,.47083],107:[0,.69444,.01852,0,.6037],108:[0,.69444,.0088,0,.34815],109:[0,.44444,0,0,1.0324],110:[0,.44444,0,0,.71296],111:[0,.44444,0,0,.58472],112:[.19444,.44444,0,0,.60092],113:[.19444,.44444,.03704,0,.54213],114:[0,.44444,.03194,0,.5287],115:[0,.44444,0,0,.53125],116:[0,.63492,0,0,.41528],117:[0,.44444,0,0,.68102],118:[0,.44444,.03704,0,.56666],119:[0,.44444,.02778,0,.83148],120:[0,.44444,0,0,.65903],121:[.19444,.44444,.03704,0,.59028],122:[0,.44444,.04213,0,.55509],160:[0,0,0,0,.25],915:[0,.68611,.15972,0,.65694],916:[0,.68611,0,0,.95833],920:[0,.68611,.03194,0,.86722],923:[0,.68611,0,0,.80555],926:[0,.68611,.07458,0,.84125],928:[0,.68611,.08229,0,.98229],931:[0,.68611,.05451,0,.88507],933:[0,.68611,.15972,0,.67083],934:[0,.68611,0,0,.76666],936:[0,.68611,.11653,0,.71402],937:[0,.68611,.04835,0,.8789],945:[0,.44444,0,0,.76064],946:[.19444,.69444,.03403,0,.65972],947:[.19444,.44444,.06389,0,.59003],948:[0,.69444,.03819,0,.52222],949:[0,.44444,0,0,.52882],950:[.19444,.69444,.06215,0,.50833],951:[.19444,.44444,.03704,0,.6],952:[0,.69444,.03194,0,.5618],953:[0,.44444,0,0,.41204],954:[0,.44444,0,0,.66759],955:[0,.69444,0,0,.67083],956:[.19444,.44444,0,0,.70787],957:[0,.44444,.06898,0,.57685],958:[.19444,.69444,.03021,0,.50833],959:[0,.44444,0,0,.58472],960:[0,.44444,.03704,0,.68241],961:[.19444,.44444,0,0,.6118],962:[.09722,.44444,.07917,0,.42361],963:[0,.44444,.03704,0,.68588],964:[0,.44444,.13472,0,.52083],965:[0,.44444,.03704,0,.63055],966:[.19444,.44444,0,0,.74722],967:[.19444,.44444,0,0,.71805],968:[.19444,.69444,.03704,0,.75833],969:[0,.44444,.03704,0,.71782],977:[0,.69444,0,0,.69155],981:[.19444,.69444,0,0,.7125],982:[0,.44444,.03194,0,.975],1009:[.19444,.44444,0,0,.6118],1013:[0,.44444,0,0,.48333],57649:[0,.44444,0,0,.39352],57911:[.19444,.44444,0,0,.43889]},"Math-Italic":{32:[0,0,0,0,.25],48:[0,.43056,0,0,.5],49:[0,.43056,0,0,.5],50:[0,.43056,0,0,.5],51:[.19444,.43056,0,0,.5],52:[.19444,.43056,0,0,.5],53:[.19444,.43056,0,0,.5],54:[0,.64444,0,0,.5],55:[.19444,.43056,0,0,.5],56:[0,.64444,0,0,.5],57:[.19444,.43056,0,0,.5],65:[0,.68333,0,.13889,.75],66:[0,.68333,.05017,.08334,.75851],67:[0,.68333,.07153,.08334,.71472],68:[0,.68333,.02778,.05556,.82792],69:[0,.68333,.05764,.08334,.7382],70:[0,.68333,.13889,.08334,.64306],71:[0,.68333,0,.08334,.78625],72:[0,.68333,.08125,.05556,.83125],73:[0,.68333,.07847,.11111,.43958],74:[0,.68333,.09618,.16667,.55451],75:[0,.68333,.07153,.05556,.84931],76:[0,.68333,0,.02778,.68056],77:[0,.68333,.10903,.08334,.97014],78:[0,.68333,.10903,.08334,.80347],79:[0,.68333,.02778,.08334,.76278],80:[0,.68333,.13889,.08334,.64201],81:[.19444,.68333,0,.08334,.79056],82:[0,.68333,.00773,.08334,.75929],83:[0,.68333,.05764,.08334,.6132],84:[0,.68333,.13889,.08334,.58438],85:[0,.68333,.10903,.02778,.68278],86:[0,.68333,.22222,0,.58333],87:[0,.68333,.13889,0,.94445],88:[0,.68333,.07847,.08334,.82847],89:[0,.68333,.22222,0,.58056],90:[0,.68333,.07153,.08334,.68264],97:[0,.43056,0,0,.52859],98:[0,.69444,0,0,.42917],99:[0,.43056,0,.05556,.43276],100:[0,.69444,0,.16667,.52049],101:[0,.43056,0,.05556,.46563],102:[.19444,.69444,.10764,.16667,.48959],103:[.19444,.43056,.03588,.02778,.47697],104:[0,.69444,0,0,.57616],105:[0,.65952,0,0,.34451],106:[.19444,.65952,.05724,0,.41181],107:[0,.69444,.03148,0,.5206],108:[0,.69444,.01968,.08334,.29838],109:[0,.43056,0,0,.87801],110:[0,.43056,0,0,.60023],111:[0,.43056,0,.05556,.48472],112:[.19444,.43056,0,.08334,.50313],113:[.19444,.43056,.03588,.08334,.44641],114:[0,.43056,.02778,.05556,.45116],115:[0,.43056,0,.05556,.46875],116:[0,.61508,0,.08334,.36111],117:[0,.43056,0,.02778,.57246],118:[0,.43056,.03588,.02778,.48472],119:[0,.43056,.02691,.08334,.71592],120:[0,.43056,0,.02778,.57153],121:[.19444,.43056,.03588,.05556,.49028],122:[0,.43056,.04398,.05556,.46505],160:[0,0,0,0,.25],915:[0,.68333,.13889,.08334,.61528],916:[0,.68333,0,.16667,.83334],920:[0,.68333,.02778,.08334,.76278],923:[0,.68333,0,.16667,.69445],926:[0,.68333,.07569,.08334,.74236],928:[0,.68333,.08125,.05556,.83125],931:[0,.68333,.05764,.08334,.77986],933:[0,.68333,.13889,.05556,.58333],934:[0,.68333,0,.08334,.66667],936:[0,.68333,.11,.05556,.61222],937:[0,.68333,.05017,.08334,.7724],945:[0,.43056,.0037,.02778,.6397],946:[.19444,.69444,.05278,.08334,.56563],947:[.19444,.43056,.05556,0,.51773],948:[0,.69444,.03785,.05556,.44444],949:[0,.43056,0,.08334,.46632],950:[.19444,.69444,.07378,.08334,.4375],951:[.19444,.43056,.03588,.05556,.49653],952:[0,.69444,.02778,.08334,.46944],953:[0,.43056,0,.05556,.35394],954:[0,.43056,0,0,.57616],955:[0,.69444,0,0,.58334],956:[.19444,.43056,0,.02778,.60255],957:[0,.43056,.06366,.02778,.49398],958:[.19444,.69444,.04601,.11111,.4375],959:[0,.43056,0,.05556,.48472],960:[0,.43056,.03588,0,.57003],961:[.19444,.43056,0,.08334,.51702],962:[.09722,.43056,.07986,.08334,.36285],963:[0,.43056,.03588,0,.57141],964:[0,.43056,.1132,.02778,.43715],965:[0,.43056,.03588,.02778,.54028],966:[.19444,.43056,0,.08334,.65417],967:[.19444,.43056,0,.05556,.62569],968:[.19444,.69444,.03588,.11111,.65139],969:[0,.43056,.03588,0,.62245],977:[0,.69444,0,.08334,.59144],981:[.19444,.69444,0,.08334,.59583],982:[0,.43056,.02778,0,.82813],1009:[.19444,.43056,0,.08334,.51702],1013:[0,.43056,0,.05556,.4059],57649:[0,.43056,0,.02778,.32246],57911:[.19444,.43056,0,.08334,.38403]},"SansSerif-Bold":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.36667],34:[0,.69444,0,0,.55834],35:[.19444,.69444,0,0,.91667],36:[.05556,.75,0,0,.55],37:[.05556,.75,0,0,1.02912],38:[0,.69444,0,0,.83056],39:[0,.69444,0,0,.30556],40:[.25,.75,0,0,.42778],41:[.25,.75,0,0,.42778],42:[0,.75,0,0,.55],43:[.11667,.61667,0,0,.85556],44:[.10556,.13056,0,0,.30556],45:[0,.45833,0,0,.36667],46:[0,.13056,0,0,.30556],47:[.25,.75,0,0,.55],48:[0,.69444,0,0,.55],49:[0,.69444,0,0,.55],50:[0,.69444,0,0,.55],51:[0,.69444,0,0,.55],52:[0,.69444,0,0,.55],53:[0,.69444,0,0,.55],54:[0,.69444,0,0,.55],55:[0,.69444,0,0,.55],56:[0,.69444,0,0,.55],57:[0,.69444,0,0,.55],58:[0,.45833,0,0,.30556],59:[.10556,.45833,0,0,.30556],61:[-.09375,.40625,0,0,.85556],63:[0,.69444,0,0,.51945],64:[0,.69444,0,0,.73334],65:[0,.69444,0,0,.73334],66:[0,.69444,0,0,.73334],67:[0,.69444,0,0,.70278],68:[0,.69444,0,0,.79445],69:[0,.69444,0,0,.64167],70:[0,.69444,0,0,.61111],71:[0,.69444,0,0,.73334],72:[0,.69444,0,0,.79445],73:[0,.69444,0,0,.33056],74:[0,.69444,0,0,.51945],75:[0,.69444,0,0,.76389],76:[0,.69444,0,0,.58056],77:[0,.69444,0,0,.97778],78:[0,.69444,0,0,.79445],79:[0,.69444,0,0,.79445],80:[0,.69444,0,0,.70278],81:[.10556,.69444,0,0,.79445],82:[0,.69444,0,0,.70278],83:[0,.69444,0,0,.61111],84:[0,.69444,0,0,.73334],85:[0,.69444,0,0,.76389],86:[0,.69444,.01528,0,.73334],87:[0,.69444,.01528,0,1.03889],88:[0,.69444,0,0,.73334],89:[0,.69444,.0275,0,.73334],90:[0,.69444,0,0,.67223],91:[.25,.75,0,0,.34306],93:[.25,.75,0,0,.34306],94:[0,.69444,0,0,.55],95:[.35,.10833,.03056,0,.55],97:[0,.45833,0,0,.525],98:[0,.69444,0,0,.56111],99:[0,.45833,0,0,.48889],100:[0,.69444,0,0,.56111],101:[0,.45833,0,0,.51111],102:[0,.69444,.07639,0,.33611],103:[.19444,.45833,.01528,0,.55],104:[0,.69444,0,0,.56111],105:[0,.69444,0,0,.25556],106:[.19444,.69444,0,0,.28611],107:[0,.69444,0,0,.53056],108:[0,.69444,0,0,.25556],109:[0,.45833,0,0,.86667],110:[0,.45833,0,0,.56111],111:[0,.45833,0,0,.55],112:[.19444,.45833,0,0,.56111],113:[.19444,.45833,0,0,.56111],114:[0,.45833,.01528,0,.37222],115:[0,.45833,0,0,.42167],116:[0,.58929,0,0,.40417],117:[0,.45833,0,0,.56111],118:[0,.45833,.01528,0,.5],119:[0,.45833,.01528,0,.74445],120:[0,.45833,0,0,.5],121:[.19444,.45833,.01528,0,.5],122:[0,.45833,0,0,.47639],126:[.35,.34444,0,0,.55],160:[0,0,0,0,.25],168:[0,.69444,0,0,.55],176:[0,.69444,0,0,.73334],180:[0,.69444,0,0,.55],184:[.17014,0,0,0,.48889],305:[0,.45833,0,0,.25556],567:[.19444,.45833,0,0,.28611],710:[0,.69444,0,0,.55],711:[0,.63542,0,0,.55],713:[0,.63778,0,0,.55],728:[0,.69444,0,0,.55],729:[0,.69444,0,0,.30556],730:[0,.69444,0,0,.73334],732:[0,.69444,0,0,.55],733:[0,.69444,0,0,.55],915:[0,.69444,0,0,.58056],916:[0,.69444,0,0,.91667],920:[0,.69444,0,0,.85556],923:[0,.69444,0,0,.67223],926:[0,.69444,0,0,.73334],928:[0,.69444,0,0,.79445],931:[0,.69444,0,0,.79445],933:[0,.69444,0,0,.85556],934:[0,.69444,0,0,.79445],936:[0,.69444,0,0,.85556],937:[0,.69444,0,0,.79445],8211:[0,.45833,.03056,0,.55],8212:[0,.45833,.03056,0,1.10001],8216:[0,.69444,0,0,.30556],8217:[0,.69444,0,0,.30556],8220:[0,.69444,0,0,.55834],8221:[0,.69444,0,0,.55834]},"SansSerif-Italic":{32:[0,0,0,0,.25],33:[0,.69444,.05733,0,.31945],34:[0,.69444,.00316,0,.5],35:[.19444,.69444,.05087,0,.83334],36:[.05556,.75,.11156,0,.5],37:[.05556,.75,.03126,0,.83334],38:[0,.69444,.03058,0,.75834],39:[0,.69444,.07816,0,.27778],40:[.25,.75,.13164,0,.38889],41:[.25,.75,.02536,0,.38889],42:[0,.75,.11775,0,.5],43:[.08333,.58333,.02536,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,.01946,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,.13164,0,.5],48:[0,.65556,.11156,0,.5],49:[0,.65556,.11156,0,.5],50:[0,.65556,.11156,0,.5],51:[0,.65556,.11156,0,.5],52:[0,.65556,.11156,0,.5],53:[0,.65556,.11156,0,.5],54:[0,.65556,.11156,0,.5],55:[0,.65556,.11156,0,.5],56:[0,.65556,.11156,0,.5],57:[0,.65556,.11156,0,.5],58:[0,.44444,.02502,0,.27778],59:[.125,.44444,.02502,0,.27778],61:[-.13,.37,.05087,0,.77778],63:[0,.69444,.11809,0,.47222],64:[0,.69444,.07555,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,.08293,0,.66667],67:[0,.69444,.11983,0,.63889],68:[0,.69444,.07555,0,.72223],69:[0,.69444,.11983,0,.59722],70:[0,.69444,.13372,0,.56945],71:[0,.69444,.11983,0,.66667],72:[0,.69444,.08094,0,.70834],73:[0,.69444,.13372,0,.27778],74:[0,.69444,.08094,0,.47222],75:[0,.69444,.11983,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,.08094,0,.875],78:[0,.69444,.08094,0,.70834],79:[0,.69444,.07555,0,.73611],80:[0,.69444,.08293,0,.63889],81:[.125,.69444,.07555,0,.73611],82:[0,.69444,.08293,0,.64584],83:[0,.69444,.09205,0,.55556],84:[0,.69444,.13372,0,.68056],85:[0,.69444,.08094,0,.6875],86:[0,.69444,.1615,0,.66667],87:[0,.69444,.1615,0,.94445],88:[0,.69444,.13372,0,.66667],89:[0,.69444,.17261,0,.66667],90:[0,.69444,.11983,0,.61111],91:[.25,.75,.15942,0,.28889],93:[.25,.75,.08719,0,.28889],94:[0,.69444,.0799,0,.5],95:[.35,.09444,.08616,0,.5],97:[0,.44444,.00981,0,.48056],98:[0,.69444,.03057,0,.51667],99:[0,.44444,.08336,0,.44445],100:[0,.69444,.09483,0,.51667],101:[0,.44444,.06778,0,.44445],102:[0,.69444,.21705,0,.30556],103:[.19444,.44444,.10836,0,.5],104:[0,.69444,.01778,0,.51667],105:[0,.67937,.09718,0,.23889],106:[.19444,.67937,.09162,0,.26667],107:[0,.69444,.08336,0,.48889],108:[0,.69444,.09483,0,.23889],109:[0,.44444,.01778,0,.79445],110:[0,.44444,.01778,0,.51667],111:[0,.44444,.06613,0,.5],112:[.19444,.44444,.0389,0,.51667],113:[.19444,.44444,.04169,0,.51667],114:[0,.44444,.10836,0,.34167],115:[0,.44444,.0778,0,.38333],116:[0,.57143,.07225,0,.36111],117:[0,.44444,.04169,0,.51667],118:[0,.44444,.10836,0,.46111],119:[0,.44444,.10836,0,.68334],120:[0,.44444,.09169,0,.46111],121:[.19444,.44444,.10836,0,.46111],122:[0,.44444,.08752,0,.43472],126:[.35,.32659,.08826,0,.5],160:[0,0,0,0,.25],168:[0,.67937,.06385,0,.5],176:[0,.69444,0,0,.73752],184:[.17014,0,0,0,.44445],305:[0,.44444,.04169,0,.23889],567:[.19444,.44444,.04169,0,.26667],710:[0,.69444,.0799,0,.5],711:[0,.63194,.08432,0,.5],713:[0,.60889,.08776,0,.5],714:[0,.69444,.09205,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,.09483,0,.5],729:[0,.67937,.07774,0,.27778],730:[0,.69444,0,0,.73752],732:[0,.67659,.08826,0,.5],733:[0,.69444,.09205,0,.5],915:[0,.69444,.13372,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,.07555,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,.12816,0,.66667],928:[0,.69444,.08094,0,.70834],931:[0,.69444,.11983,0,.72222],933:[0,.69444,.09031,0,.77778],934:[0,.69444,.04603,0,.72222],936:[0,.69444,.09031,0,.77778],937:[0,.69444,.08293,0,.72222],8211:[0,.44444,.08616,0,.5],8212:[0,.44444,.08616,0,1],8216:[0,.69444,.07816,0,.27778],8217:[0,.69444,.07816,0,.27778],8220:[0,.69444,.14205,0,.5],8221:[0,.69444,.00316,0,.5]},"SansSerif-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.31945],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.75834],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,0,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.65556,0,0,.5],49:[0,.65556,0,0,.5],50:[0,.65556,0,0,.5],51:[0,.65556,0,0,.5],52:[0,.65556,0,0,.5],53:[0,.65556,0,0,.5],54:[0,.65556,0,0,.5],55:[0,.65556,0,0,.5],56:[0,.65556,0,0,.5],57:[0,.65556,0,0,.5],58:[0,.44444,0,0,.27778],59:[.125,.44444,0,0,.27778],61:[-.13,.37,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,0,0,.66667],67:[0,.69444,0,0,.63889],68:[0,.69444,0,0,.72223],69:[0,.69444,0,0,.59722],70:[0,.69444,0,0,.56945],71:[0,.69444,0,0,.66667],72:[0,.69444,0,0,.70834],73:[0,.69444,0,0,.27778],74:[0,.69444,0,0,.47222],75:[0,.69444,0,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,0,0,.875],78:[0,.69444,0,0,.70834],79:[0,.69444,0,0,.73611],80:[0,.69444,0,0,.63889],81:[.125,.69444,0,0,.73611],82:[0,.69444,0,0,.64584],83:[0,.69444,0,0,.55556],84:[0,.69444,0,0,.68056],85:[0,.69444,0,0,.6875],86:[0,.69444,.01389,0,.66667],87:[0,.69444,.01389,0,.94445],88:[0,.69444,0,0,.66667],89:[0,.69444,.025,0,.66667],90:[0,.69444,0,0,.61111],91:[.25,.75,0,0,.28889],93:[.25,.75,0,0,.28889],94:[0,.69444,0,0,.5],95:[.35,.09444,.02778,0,.5],97:[0,.44444,0,0,.48056],98:[0,.69444,0,0,.51667],99:[0,.44444,0,0,.44445],100:[0,.69444,0,0,.51667],101:[0,.44444,0,0,.44445],102:[0,.69444,.06944,0,.30556],103:[.19444,.44444,.01389,0,.5],104:[0,.69444,0,0,.51667],105:[0,.67937,0,0,.23889],106:[.19444,.67937,0,0,.26667],107:[0,.69444,0,0,.48889],108:[0,.69444,0,0,.23889],109:[0,.44444,0,0,.79445],110:[0,.44444,0,0,.51667],111:[0,.44444,0,0,.5],112:[.19444,.44444,0,0,.51667],113:[.19444,.44444,0,0,.51667],114:[0,.44444,.01389,0,.34167],115:[0,.44444,0,0,.38333],116:[0,.57143,0,0,.36111],117:[0,.44444,0,0,.51667],118:[0,.44444,.01389,0,.46111],119:[0,.44444,.01389,0,.68334],120:[0,.44444,0,0,.46111],121:[.19444,.44444,.01389,0,.46111],122:[0,.44444,0,0,.43472],126:[.35,.32659,0,0,.5],160:[0,0,0,0,.25],168:[0,.67937,0,0,.5],176:[0,.69444,0,0,.66667],184:[.17014,0,0,0,.44445],305:[0,.44444,0,0,.23889],567:[.19444,.44444,0,0,.26667],710:[0,.69444,0,0,.5],711:[0,.63194,0,0,.5],713:[0,.60889,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.67937,0,0,.27778],730:[0,.69444,0,0,.66667],732:[0,.67659,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.69444,0,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,0,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,0,0,.66667],928:[0,.69444,0,0,.70834],931:[0,.69444,0,0,.72222],933:[0,.69444,0,0,.77778],934:[0,.69444,0,0,.72222],936:[0,.69444,0,0,.77778],937:[0,.69444,0,0,.72222],8211:[0,.44444,.02778,0,.5],8212:[0,.44444,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5]},"Script-Regular":{32:[0,0,0,0,.25],65:[0,.7,.22925,0,.80253],66:[0,.7,.04087,0,.90757],67:[0,.7,.1689,0,.66619],68:[0,.7,.09371,0,.77443],69:[0,.7,.18583,0,.56162],70:[0,.7,.13634,0,.89544],71:[0,.7,.17322,0,.60961],72:[0,.7,.29694,0,.96919],73:[0,.7,.19189,0,.80907],74:[.27778,.7,.19189,0,1.05159],75:[0,.7,.31259,0,.91364],76:[0,.7,.19189,0,.87373],77:[0,.7,.15981,0,1.08031],78:[0,.7,.3525,0,.9015],79:[0,.7,.08078,0,.73787],80:[0,.7,.08078,0,1.01262],81:[0,.7,.03305,0,.88282],82:[0,.7,.06259,0,.85],83:[0,.7,.19189,0,.86767],84:[0,.7,.29087,0,.74697],85:[0,.7,.25815,0,.79996],86:[0,.7,.27523,0,.62204],87:[0,.7,.27523,0,.80532],88:[0,.7,.26006,0,.94445],89:[0,.7,.2939,0,.70961],90:[0,.7,.24037,0,.8212],160:[0,0,0,0,.25]},"Size1-Regular":{32:[0,0,0,0,.25],40:[.35001,.85,0,0,.45834],41:[.35001,.85,0,0,.45834],47:[.35001,.85,0,0,.57778],91:[.35001,.85,0,0,.41667],92:[.35001,.85,0,0,.57778],93:[.35001,.85,0,0,.41667],123:[.35001,.85,0,0,.58334],125:[.35001,.85,0,0,.58334],160:[0,0,0,0,.25],710:[0,.72222,0,0,.55556],732:[0,.72222,0,0,.55556],770:[0,.72222,0,0,.55556],771:[0,.72222,0,0,.55556],8214:[-99e-5,.601,0,0,.77778],8593:[1e-5,.6,0,0,.66667],8595:[1e-5,.6,0,0,.66667],8657:[1e-5,.6,0,0,.77778],8659:[1e-5,.6,0,0,.77778],8719:[.25001,.75,0,0,.94445],8720:[.25001,.75,0,0,.94445],8721:[.25001,.75,0,0,1.05556],8730:[.35001,.85,0,0,1],8739:[-.00599,.606,0,0,.33333],8741:[-.00599,.606,0,0,.55556],8747:[.30612,.805,.19445,0,.47222],8748:[.306,.805,.19445,0,.47222],8749:[.306,.805,.19445,0,.47222],8750:[.30612,.805,.19445,0,.47222],8896:[.25001,.75,0,0,.83334],8897:[.25001,.75,0,0,.83334],8898:[.25001,.75,0,0,.83334],8899:[.25001,.75,0,0,.83334],8968:[.35001,.85,0,0,.47222],8969:[.35001,.85,0,0,.47222],8970:[.35001,.85,0,0,.47222],8971:[.35001,.85,0,0,.47222],9168:[-99e-5,.601,0,0,.66667],10216:[.35001,.85,0,0,.47222],10217:[.35001,.85,0,0,.47222],10752:[.25001,.75,0,0,1.11111],10753:[.25001,.75,0,0,1.11111],10754:[.25001,.75,0,0,1.11111],10756:[.25001,.75,0,0,.83334],10758:[.25001,.75,0,0,.83334]},"Size2-Regular":{32:[0,0,0,0,.25],40:[.65002,1.15,0,0,.59722],41:[.65002,1.15,0,0,.59722],47:[.65002,1.15,0,0,.81111],91:[.65002,1.15,0,0,.47222],92:[.65002,1.15,0,0,.81111],93:[.65002,1.15,0,0,.47222],123:[.65002,1.15,0,0,.66667],125:[.65002,1.15,0,0,.66667],160:[0,0,0,0,.25],710:[0,.75,0,0,1],732:[0,.75,0,0,1],770:[0,.75,0,0,1],771:[0,.75,0,0,1],8719:[.55001,1.05,0,0,1.27778],8720:[.55001,1.05,0,0,1.27778],8721:[.55001,1.05,0,0,1.44445],8730:[.65002,1.15,0,0,1],8747:[.86225,1.36,.44445,0,.55556],8748:[.862,1.36,.44445,0,.55556],8749:[.862,1.36,.44445,0,.55556],8750:[.86225,1.36,.44445,0,.55556],8896:[.55001,1.05,0,0,1.11111],8897:[.55001,1.05,0,0,1.11111],8898:[.55001,1.05,0,0,1.11111],8899:[.55001,1.05,0,0,1.11111],8968:[.65002,1.15,0,0,.52778],8969:[.65002,1.15,0,0,.52778],8970:[.65002,1.15,0,0,.52778],8971:[.65002,1.15,0,0,.52778],10216:[.65002,1.15,0,0,.61111],10217:[.65002,1.15,0,0,.61111],10752:[.55001,1.05,0,0,1.51112],10753:[.55001,1.05,0,0,1.51112],10754:[.55001,1.05,0,0,1.51112],10756:[.55001,1.05,0,0,1.11111],10758:[.55001,1.05,0,0,1.11111]},"Size3-Regular":{32:[0,0,0,0,.25],40:[.95003,1.45,0,0,.73611],41:[.95003,1.45,0,0,.73611],47:[.95003,1.45,0,0,1.04445],91:[.95003,1.45,0,0,.52778],92:[.95003,1.45,0,0,1.04445],93:[.95003,1.45,0,0,.52778],123:[.95003,1.45,0,0,.75],125:[.95003,1.45,0,0,.75],160:[0,0,0,0,.25],710:[0,.75,0,0,1.44445],732:[0,.75,0,0,1.44445],770:[0,.75,0,0,1.44445],771:[0,.75,0,0,1.44445],8730:[.95003,1.45,0,0,1],8968:[.95003,1.45,0,0,.58334],8969:[.95003,1.45,0,0,.58334],8970:[.95003,1.45,0,0,.58334],8971:[.95003,1.45,0,0,.58334],10216:[.95003,1.45,0,0,.75],10217:[.95003,1.45,0,0,.75]},"Size4-Regular":{32:[0,0,0,0,.25],40:[1.25003,1.75,0,0,.79167],41:[1.25003,1.75,0,0,.79167],47:[1.25003,1.75,0,0,1.27778],91:[1.25003,1.75,0,0,.58334],92:[1.25003,1.75,0,0,1.27778],93:[1.25003,1.75,0,0,.58334],123:[1.25003,1.75,0,0,.80556],125:[1.25003,1.75,0,0,.80556],160:[0,0,0,0,.25],710:[0,.825,0,0,1.8889],732:[0,.825,0,0,1.8889],770:[0,.825,0,0,1.8889],771:[0,.825,0,0,1.8889],8730:[1.25003,1.75,0,0,1],8968:[1.25003,1.75,0,0,.63889],8969:[1.25003,1.75,0,0,.63889],8970:[1.25003,1.75,0,0,.63889],8971:[1.25003,1.75,0,0,.63889],9115:[.64502,1.155,0,0,.875],9116:[1e-5,.6,0,0,.875],9117:[.64502,1.155,0,0,.875],9118:[.64502,1.155,0,0,.875],9119:[1e-5,.6,0,0,.875],9120:[.64502,1.155,0,0,.875],9121:[.64502,1.155,0,0,.66667],9122:[-99e-5,.601,0,0,.66667],9123:[.64502,1.155,0,0,.66667],9124:[.64502,1.155,0,0,.66667],9125:[-99e-5,.601,0,0,.66667],9126:[.64502,1.155,0,0,.66667],9127:[1e-5,.9,0,0,.88889],9128:[.65002,1.15,0,0,.88889],9129:[.90001,0,0,0,.88889],9130:[0,.3,0,0,.88889],9131:[1e-5,.9,0,0,.88889],9132:[.65002,1.15,0,0,.88889],9133:[.90001,0,0,0,.88889],9143:[.88502,.915,0,0,1.05556],10216:[1.25003,1.75,0,0,.80556],10217:[1.25003,1.75,0,0,.80556],57344:[-.00499,.605,0,0,1.05556],57345:[-.00499,.605,0,0,1.05556],57680:[0,.12,0,0,.45],57681:[0,.12,0,0,.45],57682:[0,.12,0,0,.45],57683:[0,.12,0,0,.45]},"Typewriter-Regular":{32:[0,0,0,0,.525],33:[0,.61111,0,0,.525],34:[0,.61111,0,0,.525],35:[0,.61111,0,0,.525],36:[.08333,.69444,0,0,.525],37:[.08333,.69444,0,0,.525],38:[0,.61111,0,0,.525],39:[0,.61111,0,0,.525],40:[.08333,.69444,0,0,.525],41:[.08333,.69444,0,0,.525],42:[0,.52083,0,0,.525],43:[-.08056,.53055,0,0,.525],44:[.13889,.125,0,0,.525],45:[-.08056,.53055,0,0,.525],46:[0,.125,0,0,.525],47:[.08333,.69444,0,0,.525],48:[0,.61111,0,0,.525],49:[0,.61111,0,0,.525],50:[0,.61111,0,0,.525],51:[0,.61111,0,0,.525],52:[0,.61111,0,0,.525],53:[0,.61111,0,0,.525],54:[0,.61111,0,0,.525],55:[0,.61111,0,0,.525],56:[0,.61111,0,0,.525],57:[0,.61111,0,0,.525],58:[0,.43056,0,0,.525],59:[.13889,.43056,0,0,.525],60:[-.05556,.55556,0,0,.525],61:[-.19549,.41562,0,0,.525],62:[-.05556,.55556,0,0,.525],63:[0,.61111,0,0,.525],64:[0,.61111,0,0,.525],65:[0,.61111,0,0,.525],66:[0,.61111,0,0,.525],67:[0,.61111,0,0,.525],68:[0,.61111,0,0,.525],69:[0,.61111,0,0,.525],70:[0,.61111,0,0,.525],71:[0,.61111,0,0,.525],72:[0,.61111,0,0,.525],73:[0,.61111,0,0,.525],74:[0,.61111,0,0,.525],75:[0,.61111,0,0,.525],76:[0,.61111,0,0,.525],77:[0,.61111,0,0,.525],78:[0,.61111,0,0,.525],79:[0,.61111,0,0,.525],80:[0,.61111,0,0,.525],81:[.13889,.61111,0,0,.525],82:[0,.61111,0,0,.525],83:[0,.61111,0,0,.525],84:[0,.61111,0,0,.525],85:[0,.61111,0,0,.525],86:[0,.61111,0,0,.525],87:[0,.61111,0,0,.525],88:[0,.61111,0,0,.525],89:[0,.61111,0,0,.525],90:[0,.61111,0,0,.525],91:[.08333,.69444,0,0,.525],92:[.08333,.69444,0,0,.525],93:[.08333,.69444,0,0,.525],94:[0,.61111,0,0,.525],95:[.09514,0,0,0,.525],96:[0,.61111,0,0,.525],97:[0,.43056,0,0,.525],98:[0,.61111,0,0,.525],99:[0,.43056,0,0,.525],100:[0,.61111,0,0,.525],101:[0,.43056,0,0,.525],102:[0,.61111,0,0,.525],103:[.22222,.43056,0,0,.525],104:[0,.61111,0,0,.525],105:[0,.61111,0,0,.525],106:[.22222,.61111,0,0,.525],107:[0,.61111,0,0,.525],108:[0,.61111,0,0,.525],109:[0,.43056,0,0,.525],110:[0,.43056,0,0,.525],111:[0,.43056,0,0,.525],112:[.22222,.43056,0,0,.525],113:[.22222,.43056,0,0,.525],114:[0,.43056,0,0,.525],115:[0,.43056,0,0,.525],116:[0,.55358,0,0,.525],117:[0,.43056,0,0,.525],118:[0,.43056,0,0,.525],119:[0,.43056,0,0,.525],120:[0,.43056,0,0,.525],121:[.22222,.43056,0,0,.525],122:[0,.43056,0,0,.525],123:[.08333,.69444,0,0,.525],124:[.08333,.69444,0,0,.525],125:[.08333,.69444,0,0,.525],126:[0,.61111,0,0,.525],127:[0,.61111,0,0,.525],160:[0,0,0,0,.525],176:[0,.61111,0,0,.525],184:[.19445,0,0,0,.525],305:[0,.43056,0,0,.525],567:[.22222,.43056,0,0,.525],711:[0,.56597,0,0,.525],713:[0,.56555,0,0,.525],714:[0,.61111,0,0,.525],715:[0,.61111,0,0,.525],728:[0,.61111,0,0,.525],730:[0,.61111,0,0,.525],770:[0,.61111,0,0,.525],771:[0,.61111,0,0,.525],776:[0,.61111,0,0,.525],915:[0,.61111,0,0,.525],916:[0,.61111,0,0,.525],920:[0,.61111,0,0,.525],923:[0,.61111,0,0,.525],926:[0,.61111,0,0,.525],928:[0,.61111,0,0,.525],931:[0,.61111,0,0,.525],933:[0,.61111,0,0,.525],934:[0,.61111,0,0,.525],936:[0,.61111,0,0,.525],937:[0,.61111,0,0,.525],8216:[0,.61111,0,0,.525],8217:[0,.61111,0,0,.525],8242:[0,.61111,0,0,.525],9251:[.11111,.21944,0,0,.525]}},Do={slant:[.25,.25,.25],space:[0,0,0],stretch:[0,0,0],shrink:[0,0,0],xHeight:[.431,.431,.431],quad:[1,1.171,1.472],extraSpace:[0,0,0],num1:[.677,.732,.925],num2:[.394,.384,.387],num3:[.444,.471,.504],denom1:[.686,.752,1.025],denom2:[.345,.344,.532],sup1:[.413,.503,.504],sup2:[.363,.431,.404],sup3:[.289,.286,.294],sub1:[.15,.143,.2],sub2:[.247,.286,.4],supDrop:[.386,.353,.494],subDrop:[.05,.071,.1],delim1:[2.39,1.7,1.98],delim2:[1.01,1.157,1.42],axisHeight:[.25,.25,.25],defaultRuleThickness:[.04,.049,.049],bigOpSpacing1:[.111,.111,.111],bigOpSpacing2:[.166,.166,.166],bigOpSpacing3:[.2,.2,.2],bigOpSpacing4:[.6,.611,.611],bigOpSpacing5:[.1,.143,.143],sqrtRuleThickness:[.04,.04,.04],ptPerEm:[10,10,10],doubleRuleSep:[.2,.2,.2],arrayRuleWidth:[.04,.04,.04],fboxsep:[.3,.3,.3],fboxrule:[.04,.04,.04]},sh={Å:"A",Ð:"D",Þ:"o",å:"a",ð:"d",þ:"o",А:"A",Б:"B",В:"B",Г:"F",Д:"A",Е:"E",Ж:"K",З:"3",И:"N",Й:"N",К:"K",Л:"N",М:"M",Н:"H",О:"O",П:"N",Р:"P",С:"C",Т:"T",У:"y",Ф:"O",Х:"X",Ц:"U",Ч:"h",Ш:"W",Щ:"W",Ъ:"B",Ы:"X",Ь:"B",Э:"3",Ю:"X",Я:"R",а:"a",б:"b",в:"a",г:"r",д:"y",е:"e",ж:"m",з:"e",и:"n",й:"n",к:"n",л:"n",м:"m",н:"n",о:"o",п:"n",р:"p",с:"c",т:"o",у:"y",ф:"b",х:"x",ц:"n",ч:"n",ш:"w",щ:"w",ъ:"a",ы:"m",ь:"a",э:"e",ю:"m",я:"r"};function K4(i,e){Gn[i]=e}function Rl(i,e,t){if(!Gn[e])throw new Error("Font metrics not found for font: "+e+".");var n=i.charCodeAt(0),r=Gn[e][n];if(!r&&i[0]in sh&&(n=sh[i[0]].charCodeAt(0),r=Gn[e][n]),!r&&t==="text"&&ku(n)&&(r=Gn[e][77]),r)return{depth:r[0],height:r[1],italic:r[2],skew:r[3],width:r[4]}}var Lo={};function Z4(i){var e;if(i>=5?e=0:i>=3?e=1:e=2,!Lo[e]){var t=Lo[e]={cssEmPerMu:Do.quad[e]/18};for(var n of Object.keys(Do))t[n]=Do[n][e]}return Lo[e]}var St={math:{},text:{}};function d(i,e,t,n,r,a){St[i][r]={font:e,group:t,replace:n},a&&n&&(St[i][n]=St[i][r])}var v="math",re="text",y="main",D="ams",wt="accent-token",Me="bin",rn="close",Yr="inner",Fe="mathord",Ot="op-token",_n="open",Ma="punct",L="rel",di="spacing",U="textord";d(v,y,L,"≡","\\equiv",!0);d(v,y,L,"≺","\\prec",!0);d(v,y,L,"≻","\\succ",!0);d(v,y,L,"∼","\\sim",!0);d(v,y,L,"⊥","\\perp");d(v,y,L,"⪯","\\preceq",!0);d(v,y,L,"⪰","\\succeq",!0);d(v,y,L,"≃","\\simeq",!0);d(v,y,L,"∣","\\mid",!0);d(v,y,L,"≪","\\ll",!0);d(v,y,L,"≫","\\gg",!0);d(v,y,L,"≍","\\asymp",!0);d(v,y,L,"∥","\\parallel");d(v,y,L,"⋈","\\bowtie",!0);d(v,y,L,"⌣","\\smile",!0);d(v,y,L,"⊑","\\sqsubseteq",!0);d(v,y,L,"⊒","\\sqsupseteq",!0);d(v,y,L,"≐","\\doteq",!0);d(v,y,L,"⌢","\\frown",!0);d(v,y,L,"∋","\\ni",!0);d(v,y,L,"∝","\\propto",!0);d(v,y,L,"⊢","\\vdash",!0);d(v,y,L,"⊣","\\dashv",!0);d(v,y,L,"∋","\\owns");d(v,y,Ma,".","\\ldotp");d(v,y,Ma,"⋅","\\cdotp");d(v,y,Ma,"⋅","·");d(re,y,U,"⋅","·");d(v,y,U,"#","\\#");d(re,y,U,"#","\\#");d(v,y,U,"&","\\&");d(re,y,U,"&","\\&");d(v,y,U,"ℵ","\\aleph",!0);d(v,y,U,"∀","\\forall",!0);d(v,y,U,"ℏ","\\hbar",!0);d(v,y,U,"∃","\\exists",!0);d(v,y,U,"∇","\\nabla",!0);d(v,y,U,"♭","\\flat",!0);d(v,y,U,"ℓ","\\ell",!0);d(v,y,U,"♮","\\natural",!0);d(v,y,U,"♣","\\clubsuit",!0);d(v,y,U,"℘","\\wp",!0);d(v,y,U,"♯","\\sharp",!0);d(v,y,U,"♢","\\diamondsuit",!0);d(v,y,U,"ℜ","\\Re",!0);d(v,y,U,"♡","\\heartsuit",!0);d(v,y,U,"ℑ","\\Im",!0);d(v,y,U,"♠","\\spadesuit",!0);d(v,y,U,"§","\\S",!0);d(re,y,U,"§","\\S");d(v,y,U,"¶","\\P",!0);d(re,y,U,"¶","\\P");d(v,y,U,"†","\\dag");d(re,y,U,"†","\\dag");d(re,y,U,"†","\\textdagger");d(v,y,U,"‡","\\ddag");d(re,y,U,"‡","\\ddag");d(re,y,U,"‡","\\textdaggerdbl");d(v,y,rn,"⎱","\\rmoustache",!0);d(v,y,_n,"⎰","\\lmoustache",!0);d(v,y,rn,"⟯","\\rgroup",!0);d(v,y,_n,"⟮","\\lgroup",!0);d(v,y,Me,"∓","\\mp",!0);d(v,y,Me,"⊖","\\ominus",!0);d(v,y,Me,"⊎","\\uplus",!0);d(v,y,Me,"⊓","\\sqcap",!0);d(v,y,Me,"∗","\\ast");d(v,y,Me,"⊔","\\sqcup",!0);d(v,y,Me,"◯","\\bigcirc",!0);d(v,y,Me,"∙","\\bullet",!0);d(v,y,Me,"‡","\\ddagger");d(v,y,Me,"≀","\\wr",!0);d(v,y,Me,"⨿","\\amalg");d(v,y,Me,"&","\\And");d(v,y,L,"⟵","\\longleftarrow",!0);d(v,y,L,"⇐","\\Leftarrow",!0);d(v,y,L,"⟸","\\Longleftarrow",!0);d(v,y,L,"⟶","\\longrightarrow",!0);d(v,y,L,"⇒","\\Rightarrow",!0);d(v,y,L,"⟹","\\Longrightarrow",!0);d(v,y,L,"↔","\\leftrightarrow",!0);d(v,y,L,"⟷","\\longleftrightarrow",!0);d(v,y,L,"⇔","\\Leftrightarrow",!0);d(v,y,L,"⟺","\\Longleftrightarrow",!0);d(v,y,L,"↦","\\mapsto",!0);d(v,y,L,"⟼","\\longmapsto",!0);d(v,y,L,"↗","\\nearrow",!0);d(v,y,L,"↩","\\hookleftarrow",!0);d(v,y,L,"↪","\\hookrightarrow",!0);d(v,y,L,"↘","\\searrow",!0);d(v,y,L,"↼","\\leftharpoonup",!0);d(v,y,L,"⇀","\\rightharpoonup",!0);d(v,y,L,"↙","\\swarrow",!0);d(v,y,L,"↽","\\leftharpoondown",!0);d(v,y,L,"⇁","\\rightharpoondown",!0);d(v,y,L,"↖","\\nwarrow",!0);d(v,y,L,"⇌","\\rightleftharpoons",!0);d(v,D,L,"≮","\\nless",!0);d(v,D,L,"","\\@nleqslant");d(v,D,L,"","\\@nleqq");d(v,D,L,"⪇","\\lneq",!0);d(v,D,L,"≨","\\lneqq",!0);d(v,D,L,"","\\@lvertneqq");d(v,D,L,"⋦","\\lnsim",!0);d(v,D,L,"⪉","\\lnapprox",!0);d(v,D,L,"⊀","\\nprec",!0);d(v,D,L,"⋠","\\npreceq",!0);d(v,D,L,"⋨","\\precnsim",!0);d(v,D,L,"⪹","\\precnapprox",!0);d(v,D,L,"≁","\\nsim",!0);d(v,D,L,"","\\@nshortmid");d(v,D,L,"∤","\\nmid",!0);d(v,D,L,"⊬","\\nvdash",!0);d(v,D,L,"⊭","\\nvDash",!0);d(v,D,L,"⋪","\\ntriangleleft");d(v,D,L,"⋬","\\ntrianglelefteq",!0);d(v,D,L,"⊊","\\subsetneq",!0);d(v,D,L,"","\\@varsubsetneq");d(v,D,L,"⫋","\\subsetneqq",!0);d(v,D,L,"","\\@varsubsetneqq");d(v,D,L,"≯","\\ngtr",!0);d(v,D,L,"","\\@ngeqslant");d(v,D,L,"","\\@ngeqq");d(v,D,L,"⪈","\\gneq",!0);d(v,D,L,"≩","\\gneqq",!0);d(v,D,L,"","\\@gvertneqq");d(v,D,L,"⋧","\\gnsim",!0);d(v,D,L,"⪊","\\gnapprox",!0);d(v,D,L,"⊁","\\nsucc",!0);d(v,D,L,"⋡","\\nsucceq",!0);d(v,D,L,"⋩","\\succnsim",!0);d(v,D,L,"⪺","\\succnapprox",!0);d(v,D,L,"≆","\\ncong",!0);d(v,D,L,"","\\@nshortparallel");d(v,D,L,"∦","\\nparallel",!0);d(v,D,L,"⊯","\\nVDash",!0);d(v,D,L,"⋫","\\ntriangleright");d(v,D,L,"⋭","\\ntrianglerighteq",!0);d(v,D,L,"","\\@nsupseteqq");d(v,D,L,"⊋","\\supsetneq",!0);d(v,D,L,"","\\@varsupsetneq");d(v,D,L,"⫌","\\supsetneqq",!0);d(v,D,L,"","\\@varsupsetneqq");d(v,D,L,"⊮","\\nVdash",!0);d(v,D,L,"⪵","\\precneqq",!0);d(v,D,L,"⪶","\\succneqq",!0);d(v,D,L,"","\\@nsubseteqq");d(v,D,Me,"⊴","\\unlhd");d(v,D,Me,"⊵","\\unrhd");d(v,D,L,"↚","\\nleftarrow",!0);d(v,D,L,"↛","\\nrightarrow",!0);d(v,D,L,"⇍","\\nLeftarrow",!0);d(v,D,L,"⇏","\\nRightarrow",!0);d(v,D,L,"↮","\\nleftrightarrow",!0);d(v,D,L,"⇎","\\nLeftrightarrow",!0);d(v,D,L,"△","\\vartriangle");d(v,D,U,"ℏ","\\hslash");d(v,D,U,"▽","\\triangledown");d(v,D,U,"◊","\\lozenge");d(v,D,U,"Ⓢ","\\circledS");d(v,D,U,"®","\\circledR");d(re,D,U,"®","\\circledR");d(v,D,U,"∡","\\measuredangle",!0);d(v,D,U,"∄","\\nexists");d(v,D,U,"℧","\\mho");d(v,D,U,"Ⅎ","\\Finv",!0);d(v,D,U,"⅁","\\Game",!0);d(v,D,U,"‵","\\backprime");d(v,D,U,"▲","\\blacktriangle");d(v,D,U,"▼","\\blacktriangledown");d(v,D,U,"■","\\blacksquare");d(v,D,U,"⧫","\\blacklozenge");d(v,D,U,"★","\\bigstar");d(v,D,U,"∢","\\sphericalangle",!0);d(v,D,U,"∁","\\complement",!0);d(v,D,U,"ð","\\eth",!0);d(re,y,U,"ð","ð");d(v,D,U,"╱","\\diagup");d(v,D,U,"╲","\\diagdown");d(v,D,U,"□","\\square");d(v,D,U,"□","\\Box");d(v,D,U,"◊","\\Diamond");d(v,D,U,"¥","\\yen",!0);d(re,D,U,"¥","\\yen",!0);d(v,D,U,"✓","\\checkmark",!0);d(re,D,U,"✓","\\checkmark");d(v,D,U,"ℶ","\\beth",!0);d(v,D,U,"ℸ","\\daleth",!0);d(v,D,U,"ℷ","\\gimel",!0);d(v,D,U,"ϝ","\\digamma",!0);d(v,D,U,"ϰ","\\varkappa");d(v,D,_n,"┌","\\@ulcorner",!0);d(v,D,rn,"┐","\\@urcorner",!0);d(v,D,_n,"└","\\@llcorner",!0);d(v,D,rn,"┘","\\@lrcorner",!0);d(v,D,L,"≦","\\leqq",!0);d(v,D,L,"⩽","\\leqslant",!0);d(v,D,L,"⪕","\\eqslantless",!0);d(v,D,L,"≲","\\lesssim",!0);d(v,D,L,"⪅","\\lessapprox",!0);d(v,D,L,"≊","\\approxeq",!0);d(v,D,Me,"⋖","\\lessdot");d(v,D,L,"⋘","\\lll",!0);d(v,D,L,"≶","\\lessgtr",!0);d(v,D,L,"⋚","\\lesseqgtr",!0);d(v,D,L,"⪋","\\lesseqqgtr",!0);d(v,D,L,"≑","\\doteqdot");d(v,D,L,"≓","\\risingdotseq",!0);d(v,D,L,"≒","\\fallingdotseq",!0);d(v,D,L,"∽","\\backsim",!0);d(v,D,L,"⋍","\\backsimeq",!0);d(v,D,L,"⫅","\\subseteqq",!0);d(v,D,L,"⋐","\\Subset",!0);d(v,D,L,"⊏","\\sqsubset",!0);d(v,D,L,"≼","\\preccurlyeq",!0);d(v,D,L,"⋞","\\curlyeqprec",!0);d(v,D,L,"≾","\\precsim",!0);d(v,D,L,"⪷","\\precapprox",!0);d(v,D,L,"⊲","\\vartriangleleft");d(v,D,L,"⊴","\\trianglelefteq");d(v,D,L,"⊨","\\vDash",!0);d(v,D,L,"⊪","\\Vvdash",!0);d(v,D,L,"⌣","\\smallsmile");d(v,D,L,"⌢","\\smallfrown");d(v,D,L,"≏","\\bumpeq",!0);d(v,D,L,"≎","\\Bumpeq",!0);d(v,D,L,"≧","\\geqq",!0);d(v,D,L,"⩾","\\geqslant",!0);d(v,D,L,"⪖","\\eqslantgtr",!0);d(v,D,L,"≳","\\gtrsim",!0);d(v,D,L,"⪆","\\gtrapprox",!0);d(v,D,Me,"⋗","\\gtrdot");d(v,D,L,"⋙","\\ggg",!0);d(v,D,L,"≷","\\gtrless",!0);d(v,D,L,"⋛","\\gtreqless",!0);d(v,D,L,"⪌","\\gtreqqless",!0);d(v,D,L,"≖","\\eqcirc",!0);d(v,D,L,"≗","\\circeq",!0);d(v,D,L,"≜","\\triangleq",!0);d(v,D,L,"∼","\\thicksim");d(v,D,L,"≈","\\thickapprox");d(v,D,L,"⫆","\\supseteqq",!0);d(v,D,L,"⋑","\\Supset",!0);d(v,D,L,"⊐","\\sqsupset",!0);d(v,D,L,"≽","\\succcurlyeq",!0);d(v,D,L,"⋟","\\curlyeqsucc",!0);d(v,D,L,"≿","\\succsim",!0);d(v,D,L,"⪸","\\succapprox",!0);d(v,D,L,"⊳","\\vartriangleright");d(v,D,L,"⊵","\\trianglerighteq");d(v,D,L,"⊩","\\Vdash",!0);d(v,D,L,"∣","\\shortmid");d(v,D,L,"∥","\\shortparallel");d(v,D,L,"≬","\\between",!0);d(v,D,L,"⋔","\\pitchfork",!0);d(v,D,L,"∝","\\varpropto");d(v,D,L,"◀","\\blacktriangleleft");d(v,D,L,"∴","\\therefore",!0);d(v,D,L,"∍","\\backepsilon");d(v,D,L,"▶","\\blacktriangleright");d(v,D,L,"∵","\\because",!0);d(v,D,L,"⋘","\\llless");d(v,D,L,"⋙","\\gggtr");d(v,D,Me,"⊲","\\lhd");d(v,D,Me,"⊳","\\rhd");d(v,D,L,"≂","\\eqsim",!0);d(v,y,L,"⋈","\\Join");d(v,D,L,"≑","\\Doteq",!0);d(v,D,Me,"∔","\\dotplus",!0);d(v,D,Me,"∖","\\smallsetminus");d(v,D,Me,"⋒","\\Cap",!0);d(v,D,Me,"⋓","\\Cup",!0);d(v,D,Me,"⩞","\\doublebarwedge",!0);d(v,D,Me,"⊟","\\boxminus",!0);d(v,D,Me,"⊞","\\boxplus",!0);d(v,D,Me,"⋇","\\divideontimes",!0);d(v,D,Me,"⋉","\\ltimes",!0);d(v,D,Me,"⋊","\\rtimes",!0);d(v,D,Me,"⋋","\\leftthreetimes",!0);d(v,D,Me,"⋌","\\rightthreetimes",!0);d(v,D,Me,"⋏","\\curlywedge",!0);d(v,D,Me,"⋎","\\curlyvee",!0);d(v,D,Me,"⊝","\\circleddash",!0);d(v,D,Me,"⊛","\\circledast",!0);d(v,D,Me,"⋅","\\centerdot");d(v,D,Me,"⊺","\\intercal",!0);d(v,D,Me,"⋒","\\doublecap");d(v,D,Me,"⋓","\\doublecup");d(v,D,Me,"⊠","\\boxtimes",!0);d(v,D,L,"⇢","\\dashrightarrow",!0);d(v,D,L,"⇠","\\dashleftarrow",!0);d(v,D,L,"⇇","\\leftleftarrows",!0);d(v,D,L,"⇆","\\leftrightarrows",!0);d(v,D,L,"⇚","\\Lleftarrow",!0);d(v,D,L,"↞","\\twoheadleftarrow",!0);d(v,D,L,"↢","\\leftarrowtail",!0);d(v,D,L,"↫","\\looparrowleft",!0);d(v,D,L,"⇋","\\leftrightharpoons",!0);d(v,D,L,"↶","\\curvearrowleft",!0);d(v,D,L,"↺","\\circlearrowleft",!0);d(v,D,L,"↰","\\Lsh",!0);d(v,D,L,"⇈","\\upuparrows",!0);d(v,D,L,"↿","\\upharpoonleft",!0);d(v,D,L,"⇃","\\downharpoonleft",!0);d(v,y,L,"⊶","\\origof",!0);d(v,y,L,"⊷","\\imageof",!0);d(v,D,L,"⊸","\\multimap",!0);d(v,D,L,"↭","\\leftrightsquigarrow",!0);d(v,D,L,"⇉","\\rightrightarrows",!0);d(v,D,L,"⇄","\\rightleftarrows",!0);d(v,D,L,"↠","\\twoheadrightarrow",!0);d(v,D,L,"↣","\\rightarrowtail",!0);d(v,D,L,"↬","\\looparrowright",!0);d(v,D,L,"↷","\\curvearrowright",!0);d(v,D,L,"↻","\\circlearrowright",!0);d(v,D,L,"↱","\\Rsh",!0);d(v,D,L,"⇊","\\downdownarrows",!0);d(v,D,L,"↾","\\upharpoonright",!0);d(v,D,L,"⇂","\\downharpoonright",!0);d(v,D,L,"⇝","\\rightsquigarrow",!0);d(v,D,L,"⇝","\\leadsto");d(v,D,L,"⇛","\\Rrightarrow",!0);d(v,D,L,"↾","\\restriction");d(v,y,U,"‘","`");d(v,y,U,"$","\\$");d(re,y,U,"$","\\$");d(re,y,U,"$","\\textdollar");d(v,y,U,"%","\\%");d(re,y,U,"%","\\%");d(v,y,U,"_","\\_");d(re,y,U,"_","\\_");d(re,y,U,"_","\\textunderscore");d(v,y,U,"∠","\\angle",!0);d(v,y,U,"∞","\\infty",!0);d(v,y,U,"′","\\prime");d(v,y,U,"△","\\triangle");d(v,y,U,"Γ","\\Gamma",!0);d(v,y,U,"Δ","\\Delta",!0);d(v,y,U,"Θ","\\Theta",!0);d(v,y,U,"Λ","\\Lambda",!0);d(v,y,U,"Ξ","\\Xi",!0);d(v,y,U,"Π","\\Pi",!0);d(v,y,U,"Σ","\\Sigma",!0);d(v,y,U,"Υ","\\Upsilon",!0);d(v,y,U,"Φ","\\Phi",!0);d(v,y,U,"Ψ","\\Psi",!0);d(v,y,U,"Ω","\\Omega",!0);d(v,y,U,"A","Α");d(v,y,U,"B","Β");d(v,y,U,"E","Ε");d(v,y,U,"Z","Ζ");d(v,y,U,"H","Η");d(v,y,U,"I","Ι");d(v,y,U,"K","Κ");d(v,y,U,"M","Μ");d(v,y,U,"N","Ν");d(v,y,U,"O","Ο");d(v,y,U,"P","Ρ");d(v,y,U,"T","Τ");d(v,y,U,"X","Χ");d(v,y,U,"¬","\\neg",!0);d(v,y,U,"¬","\\lnot");d(v,y,U,"⊤","\\top");d(v,y,U,"⊥","\\bot");d(v,y,U,"∅","\\emptyset");d(v,D,U,"∅","\\varnothing");d(v,y,Fe,"α","\\alpha",!0);d(v,y,Fe,"β","\\beta",!0);d(v,y,Fe,"γ","\\gamma",!0);d(v,y,Fe,"δ","\\delta",!0);d(v,y,Fe,"ϵ","\\epsilon",!0);d(v,y,Fe,"ζ","\\zeta",!0);d(v,y,Fe,"η","\\eta",!0);d(v,y,Fe,"θ","\\theta",!0);d(v,y,Fe,"ι","\\iota",!0);d(v,y,Fe,"κ","\\kappa",!0);d(v,y,Fe,"λ","\\lambda",!0);d(v,y,Fe,"μ","\\mu",!0);d(v,y,Fe,"ν","\\nu",!0);d(v,y,Fe,"ξ","\\xi",!0);d(v,y,Fe,"ο","\\omicron",!0);d(v,y,Fe,"π","\\pi",!0);d(v,y,Fe,"ρ","\\rho",!0);d(v,y,Fe,"σ","\\sigma",!0);d(v,y,Fe,"τ","\\tau",!0);d(v,y,Fe,"υ","\\upsilon",!0);d(v,y,Fe,"ϕ","\\phi",!0);d(v,y,Fe,"χ","\\chi",!0);d(v,y,Fe,"ψ","\\psi",!0);d(v,y,Fe,"ω","\\omega",!0);d(v,y,Fe,"ε","\\varepsilon",!0);d(v,y,Fe,"ϑ","\\vartheta",!0);d(v,y,Fe,"ϖ","\\varpi",!0);d(v,y,Fe,"ϱ","\\varrho",!0);d(v,y,Fe,"ς","\\varsigma",!0);d(v,y,Fe,"φ","\\varphi",!0);d(v,y,Me,"∗","*",!0);d(v,y,Me,"+","+");d(v,y,Me,"−","-",!0);d(v,y,Me,"⋅","\\cdot",!0);d(v,y,Me,"∘","\\circ",!0);d(v,y,Me,"÷","\\div",!0);d(v,y,Me,"±","\\pm",!0);d(v,y,Me,"×","\\times",!0);d(v,y,Me,"∩","\\cap",!0);d(v,y,Me,"∪","\\cup",!0);d(v,y,Me,"∖","\\setminus",!0);d(v,y,Me,"∧","\\land");d(v,y,Me,"∨","\\lor");d(v,y,Me,"∧","\\wedge",!0);d(v,y,Me,"∨","\\vee",!0);d(v,y,U,"√","\\surd");d(v,y,_n,"⟨","\\langle",!0);d(v,y,_n,"∣","\\lvert");d(v,y,_n,"∥","\\lVert");d(v,y,rn,"?","?");d(v,y,rn,"!","!");d(v,y,rn,"⟩","\\rangle",!0);d(v,y,rn,"∣","\\rvert");d(v,y,rn,"∥","\\rVert");d(v,y,L,"=","=");d(v,y,L,":",":");d(v,y,L,"≈","\\approx",!0);d(v,y,L,"≅","\\cong",!0);d(v,y,L,"≥","\\ge");d(v,y,L,"≥","\\geq",!0);d(v,y,L,"←","\\gets");d(v,y,L,">","\\gt",!0);d(v,y,L,"∈","\\in",!0);d(v,y,L,"","\\@not");d(v,y,L,"⊂","\\subset",!0);d(v,y,L,"⊃","\\supset",!0);d(v,y,L,"⊆","\\subseteq",!0);d(v,y,L,"⊇","\\supseteq",!0);d(v,D,L,"⊈","\\nsubseteq",!0);d(v,D,L,"⊉","\\nsupseteq",!0);d(v,y,L,"⊨","\\models");d(v,y,L,"←","\\leftarrow",!0);d(v,y,L,"≤","\\le");d(v,y,L,"≤","\\leq",!0);d(v,y,L,"<","\\lt",!0);d(v,y,L,"→","\\rightarrow",!0);d(v,y,L,"→","\\to");d(v,D,L,"≱","\\ngeq",!0);d(v,D,L,"≰","\\nleq",!0);d(v,y,di," ","\\ ");d(v,y,di," ","\\space");d(v,y,di," ","\\nobreakspace");d(re,y,di," ","\\ ");d(re,y,di," "," ");d(re,y,di," ","\\space");d(re,y,di," ","\\nobreakspace");d(v,y,di,"","\\nobreak");d(v,y,di,"","\\allowbreak");d(v,y,Ma,",",",");d(v,y,Ma,";",";");d(v,D,Me,"⊼","\\barwedge",!0);d(v,D,Me,"⊻","\\veebar",!0);d(v,y,Me,"⊙","\\odot",!0);d(v,y,Me,"⊕","\\oplus",!0);d(v,y,Me,"⊗","\\otimes",!0);d(v,y,U,"∂","\\partial",!0);d(v,y,Me,"⊘","\\oslash",!0);d(v,D,Me,"⊚","\\circledcirc",!0);d(v,D,Me,"⊡","\\boxdot",!0);d(v,y,Me,"△","\\bigtriangleup");d(v,y,Me,"▽","\\bigtriangledown");d(v,y,Me,"†","\\dagger");d(v,y,Me,"⋄","\\diamond");d(v,y,Me,"⋆","\\star");d(v,y,Me,"◃","\\triangleleft");d(v,y,Me,"▹","\\triangleright");d(v,y,_n,"{","\\{");d(re,y,U,"{","\\{");d(re,y,U,"{","\\textbraceleft");d(v,y,rn,"}","\\}");d(re,y,U,"}","\\}");d(re,y,U,"}","\\textbraceright");d(v,y,_n,"{","\\lbrace");d(v,y,rn,"}","\\rbrace");d(v,y,_n,"[","\\lbrack",!0);d(re,y,U,"[","\\lbrack",!0);d(v,y,rn,"]","\\rbrack",!0);d(re,y,U,"]","\\rbrack",!0);d(v,y,_n,"(","\\lparen",!0);d(v,y,rn,")","\\rparen",!0);d(re,y,U,"<","\\textless",!0);d(re,y,U,">","\\textgreater",!0);d(v,y,_n,"⌊","\\lfloor",!0);d(v,y,rn,"⌋","\\rfloor",!0);d(v,y,_n,"⌈","\\lceil",!0);d(v,y,rn,"⌉","\\rceil",!0);d(v,y,U,"\\","\\backslash");d(v,y,U,"∣","|");d(v,y,U,"∣","\\vert");d(re,y,U,"|","\\textbar",!0);d(v,y,U,"∥","\\|");d(v,y,U,"∥","\\Vert");d(re,y,U,"∥","\\textbardbl");d(re,y,U,"~","\\textasciitilde");d(re,y,U,"\\","\\textbackslash");d(re,y,U,"^","\\textasciicircum");d(v,y,L,"↑","\\uparrow",!0);d(v,y,L,"⇑","\\Uparrow",!0);d(v,y,L,"↓","\\downarrow",!0);d(v,y,L,"⇓","\\Downarrow",!0);d(v,y,L,"↕","\\updownarrow",!0);d(v,y,L,"⇕","\\Updownarrow",!0);d(v,y,Ot,"∐","\\coprod");d(v,y,Ot,"⋁","\\bigvee");d(v,y,Ot,"⋀","\\bigwedge");d(v,y,Ot,"⨄","\\biguplus");d(v,y,Ot,"⋂","\\bigcap");d(v,y,Ot,"⋃","\\bigcup");d(v,y,Ot,"∫","\\int");d(v,y,Ot,"∫","\\intop");d(v,y,Ot,"∬","\\iint");d(v,y,Ot,"∭","\\iiint");d(v,y,Ot,"∏","\\prod");d(v,y,Ot,"∑","\\sum");d(v,y,Ot,"⨂","\\bigotimes");d(v,y,Ot,"⨁","\\bigoplus");d(v,y,Ot,"⨀","\\bigodot");d(v,y,Ot,"∮","\\oint");d(v,y,Ot,"∯","\\oiint");d(v,y,Ot,"∰","\\oiiint");d(v,y,Ot,"⨆","\\bigsqcup");d(v,y,Ot,"∫","\\smallint");d(re,y,Yr,"…","\\textellipsis");d(v,y,Yr,"…","\\mathellipsis");d(re,y,Yr,"…","\\ldots",!0);d(v,y,Yr,"…","\\ldots",!0);d(v,y,Yr,"⋯","\\@cdots",!0);d(v,y,Yr,"⋱","\\ddots",!0);d(v,y,U,"⋮","\\varvdots");d(re,y,U,"⋮","\\varvdots");d(v,y,wt,"ˊ","\\acute");d(v,y,wt,"ˋ","\\grave");d(v,y,wt,"¨","\\ddot");d(v,y,wt,"~","\\tilde");d(v,y,wt,"ˉ","\\bar");d(v,y,wt,"˘","\\breve");d(v,y,wt,"ˇ","\\check");d(v,y,wt,"^","\\hat");d(v,y,wt,"⃗","\\vec");d(v,y,wt,"˙","\\dot");d(v,y,wt,"˚","\\mathring");d(v,y,Fe,"","\\@imath");d(v,y,Fe,"","\\@jmath");d(v,y,U,"ı","ı");d(v,y,U,"ȷ","ȷ");d(re,y,U,"ı","\\i",!0);d(re,y,U,"ȷ","\\j",!0);d(re,y,U,"ß","\\ss",!0);d(re,y,U,"æ","\\ae",!0);d(re,y,U,"œ","\\oe",!0);d(re,y,U,"ø","\\o",!0);d(re,y,U,"Æ","\\AE",!0);d(re,y,U,"Œ","\\OE",!0);d(re,y,U,"Ø","\\O",!0);d(re,y,wt,"ˊ","\\'");d(re,y,wt,"ˋ","\\`");d(re,y,wt,"ˆ","\\^");d(re,y,wt,"˜","\\~");d(re,y,wt,"ˉ","\\=");d(re,y,wt,"˘","\\u");d(re,y,wt,"˙","\\.");d(re,y,wt,"¸","\\c");d(re,y,wt,"˚","\\r");d(re,y,wt,"ˇ","\\v");d(re,y,wt,"¨",'\\"');d(re,y,wt,"˝","\\H");d(re,y,wt,"◯","\\textcircled");var Vu={"--":!0,"---":!0,"``":!0,"''":!0};d(re,y,U,"–","--",!0);d(re,y,U,"–","\\textendash");d(re,y,U,"—","---",!0);d(re,y,U,"—","\\textemdash");d(re,y,U,"‘","`",!0);d(re,y,U,"‘","\\textquoteleft");d(re,y,U,"’","'",!0);d(re,y,U,"’","\\textquoteright");d(re,y,U,"“","``",!0);d(re,y,U,"“","\\textquotedblleft");d(re,y,U,"”","''",!0);d(re,y,U,"”","\\textquotedblright");d(v,y,U,"°","\\degree",!0);d(re,y,U,"°","\\degree");d(re,y,U,"°","\\textdegree",!0);d(v,y,U,"£","\\pounds");d(v,y,U,"£","\\mathsterling",!0);d(re,y,U,"£","\\pounds");d(re,y,U,"£","\\textsterling",!0);d(v,D,U,"✠","\\maltese");d(re,D,U,"✠","\\maltese");var oh='0123456789/@."';for(var Io=0;Io<oh.length;Io++){var lh=oh.charAt(Io);d(v,y,U,lh,lh)}var ch='0123456789!@*()-=+";:?/.,';for(var No=0;No<ch.length;No++){var hh=ch.charAt(No);d(re,y,U,hh,hh)}var Rs="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";for(var Uo=0;Uo<Rs.length;Uo++){var Ja=Rs.charAt(Uo);d(v,y,Fe,Ja,Ja),d(re,y,U,Ja,Ja)}d(v,D,U,"C","ℂ");d(re,D,U,"C","ℂ");d(v,D,U,"H","ℍ");d(re,D,U,"H","ℍ");d(v,D,U,"N","ℕ");d(re,D,U,"N","ℕ");d(v,D,U,"P","ℙ");d(re,D,U,"P","ℙ");d(v,D,U,"Q","ℚ");d(re,D,U,"Q","ℚ");d(v,D,U,"R","ℝ");d(re,D,U,"R","ℝ");d(v,D,U,"Z","ℤ");d(re,D,U,"Z","ℤ");d(v,y,Fe,"h","ℎ");d(re,y,Fe,"h","ℎ");var Oe;for(var Zt=0;Zt<Rs.length;Zt++){var Rt=Rs.charAt(Zt);Oe=String.fromCharCode(55349,56320+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56372+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56424+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56580+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56684+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56736+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56788+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56840+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56944+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Zt<26&&(Oe=String.fromCharCode(55349,56632+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe),Oe=String.fromCharCode(55349,56476+Zt),d(v,y,Fe,Rt,Oe),d(re,y,U,Rt,Oe))}Oe="𝕜";d(v,y,Fe,"k",Oe);d(re,y,U,"k",Oe);for(var Vi=0;Vi<10;Vi++){var Mi=Vi.toString();Oe=String.fromCharCode(55349,57294+Vi),d(v,y,Fe,Mi,Oe),d(re,y,U,Mi,Oe),Oe=String.fromCharCode(55349,57314+Vi),d(v,y,Fe,Mi,Oe),d(re,y,U,Mi,Oe),Oe=String.fromCharCode(55349,57324+Vi),d(v,y,Fe,Mi,Oe),d(re,y,U,Mi,Oe),Oe=String.fromCharCode(55349,57334+Vi),d(v,y,Fe,Mi,Oe),d(re,y,U,Mi,Oe)}var Y0="ÐÞþ";for(var Fo=0;Fo<Y0.length;Fo++){var Qa=Y0.charAt(Fo);d(v,y,Fe,Qa,Qa),d(re,y,U,Qa,Qa)}var j0={mathClass:"mathbf",textClass:"textbf",font:"Main-Bold"},uh={mathClass:"mathnormal",textClass:"textit",font:"Math-Italic"},dh={mathClass:"boldsymbol",textClass:"boldsymbol",font:"Main-BoldItalic"},J4={mathClass:"mathscr",textClass:"textscr",font:"Script-Regular"},Ki={mathClass:"",textClass:"",font:""},fh={mathClass:"mathfrak",textClass:"textfrak",font:"Fraktur-Regular"},ph={mathClass:"mathbb",textClass:"textbb",font:"AMS-Regular"},mh={mathClass:"mathboldfrak",textClass:"textboldfrak",font:"Fraktur-Regular"},K0={mathClass:"mathsf",textClass:"textsf",font:"SansSerif-Regular"},Z0={mathClass:"mathboldsf",textClass:"textboldsf",font:"SansSerif-Bold"},gh={mathClass:"mathitsf",textClass:"textitsf",font:"SansSerif-Italic"},J0={mathClass:"mathtt",textClass:"texttt",font:"Typewriter-Regular"},vh=[j0,j0,uh,uh,dh,dh,J4,Ki,Ki,Ki,fh,fh,ph,ph,mh,mh,K0,K0,Z0,Z0,gh,gh,Ki,Ki,J0,J0],Q4=[j0,Ki,K0,Z0,J0],ev=i=>{var e=i.charCodeAt(0),t=i.charCodeAt(1),n=(e-55296)*1024+(t-56320)+65536;if(119808<=n&&n<120484){var r=Math.floor((n-119808)/26);return vh[r]}else if(120782<=n&&n<=120831){var a=Math.floor((n-120782)/10);return Q4[a]}else{if(n===120485||n===120486)return vh[0];if(120486<n&&n<120782)return Ki;throw new oe("Unsupported character: "+i)}},Fs=function(e,t,n){if(St[n][e]){var r=St[n][e].replace;r&&(e=r)}return{value:e,metrics:Rl(e,t,n)}},Qt=function(e,t,n,r,a){var s=Fs(e,t,n),o=s.metrics;e=s.value;var l;if(o){var c=o.italic;(n==="text"||r&&r.font==="mathit")&&(c=0),l=new xn(e,o.height,o.depth,c,o.skew,o.width,a)}else typeof console<"u"&&console.warn("No character metrics "+("for '"+e+"' in style '"+t+"' and mode '"+n+"'")),l=new xn(e,0,0,0,0,0,a);if(r){l.maxFontSize=r.sizeMultiplier,r.style.isTight()&&l.classes.push("mtight");var h=r.getColor();h&&(l.style.color=h)}return l},Pl=function(e,t,n,r){return r===void 0&&(r=[]),n.font==="boldsymbol"&&Fs(e,"Main-Bold",t).metrics?Qt(e,"Main-Bold",t,n,r.concat(["mathbf"])):e==="\\"||St[t][e].font==="main"?Qt(e,"Main-Regular",t,n,r):Qt(e,"AMS-Regular",t,n,r.concat(["amsrm"]))},tv=function(e,t,n){return n!=="textord"&&Fs(e,"Math-BoldItalic",t).metrics?{fontName:"Math-BoldItalic",fontClass:"boldsymbol"}:{fontName:"Main-Bold",fontClass:"mathbf"}},Os=function(e,t){var n=e.type==="mathord"?"mathord":"textord",r=e.mode,a=e.text,s=["mord"],o=t.font,l=t.fontFamily,c=t.fontWeight,h=t.fontShape,u=r==="math"||r==="text"&&!!o,f=u?o:l,g="",x="";if(a.charCodeAt(0)===55349){var _=ev(a);g=_.font,x=_[r+"Class"]}if(g)return Qt(a,g,r,t,s.concat(x));if(f){var m,p;if(f==="boldsymbol"){var E=tv(a,r,n);m=E.fontName,p=[E.fontClass]}else u?(m=Q0[o].fontName,p=[o]):(m=es(l,c,h),p=[l,c,h]);if(Fs(a,m,r).metrics)return Qt(a,m,r,t,s.concat(p));if(Object.prototype.hasOwnProperty.call(Vu,a)&&m.slice(0,10)==="Typewriter"){for(var w=[],C=0;C<a.length;C++)w.push(Qt(a[C],m,r,t,s.concat(p)));return fi(w)}}if(n==="mathord")return Qt(a,"Math-Italic",r,t,s.concat(["mathnormal"]));if(n==="textord"){var F=St[r][a]&&St[r][a].font;if(F==="ams"){var I=es("amsrm",c,h);return Qt(a,I,r,t,s.concat("amsrm",c,h))}else if(F==="main"||!F){var P=es("textrm",c,h);return Qt(a,P,r,t,s.concat(c,h))}else{var B=es(F,c,h);return Qt(a,B,r,t,s.concat(B,c,h))}}else throw new Error("unexpected type: "+n+" in makeOrd")},nv=(i,e)=>{if(Pi(i.classes)!==Pi(e.classes)||i.skew!==e.skew||i.maxFontSize!==e.maxFontSize||i.italic!==0&&i.hasClass("mathnormal"))return!1;if(i.classes.length===1){var t=i.classes[0];if(t==="mbin"||t==="mord")return!1}for(var n of Object.keys(i.style))if(i.style[n]!==e.style[n])return!1;for(var r of Object.keys(e.style))if(i.style[r]!==e.style[r])return!1;return!0},qu=i=>{for(var e=0;e<i.length-1;e++){var t=i[e],n=i[e+1];t instanceof xn&&n instanceof xn&&nv(t,n)&&(t.text+=n.text,t.height=Math.max(t.height,n.height),t.depth=Math.max(t.depth,n.depth),t.italic=n.italic,i.splice(e+1,1),e--)}return i},Dl=function(e){for(var t=0,n=0,r=0,a=0;a<e.children.length;a++){var s=e.children[a];s.height>t&&(t=s.height),s.depth>n&&(n=s.depth),s.maxFontSize>r&&(r=s.maxFontSize)}e.height=t,e.depth=n,e.maxFontSize=r},ae=function(e,t,n,r){var a=new $r(e,t,n,r);return Dl(a),a},Li=(i,e,t,n)=>new $r(i,e,t,n),Gr=function(e,t,n){var r=ae([e],[],t);return r.height=Math.max(n||t.fontMetrics().defaultRuleThickness,t.minRuleThickness),r.style.borderBottomWidth=he(r.height),r.maxFontSize=1,r},iv=function(e,t,n,r){var a=new Us(e,t,n,r);return Dl(a),a},fi=function(e){var t=new Xr(e);return Dl(t),t},Vr=function(e,t){return e instanceof Xr?ae([],[e],t):e},rv=function(e){if(e.positionType==="individualShift"){for(var t=e.children,n=[t[0]],r=-t[0].shift-t[0].elem.depth,a=r,s=1;s<t.length;s++){var o=-t[s].shift-a-t[s].elem.depth,l=o-(t[s-1].elem.height+t[s-1].elem.depth);a=a+o,n.push({type:"kern",size:l}),n.push(t[s])}return{children:n,depth:r}}var c;if(e.positionType==="top"){for(var h=e.positionData,u=0;u<e.children.length;u++){var f=e.children[u];h-=f.type==="kern"?f.size:f.elem.height+f.elem.depth}c=h}else if(e.positionType==="bottom")c=-e.positionData;else{var g=e.children[0];if(g.type!=="elem")throw new Error('First child must have type "elem".');if(e.positionType==="shift")c=-g.elem.depth-e.positionData;else if(e.positionType==="firstBaseline")c=-g.elem.depth;else throw new Error("Invalid positionType "+e.positionType+".")}return{children:e.children,depth:c}},dt=function(e,t){for(var n=rv(e),r=n.children,a=n.depth,s=0,o=0;o<r.length;o++){var l=r[o];if(l.type==="elem"){var c=l.elem;s=Math.max(s,c.maxFontSize,c.height)}}s+=2;var h=ae(["pstrut"],[]);h.style.height=he(s);for(var u=[],f=a,g=a,x=a,_=0;_<r.length;_++){var m=r[_];if(m.type==="kern")x+=m.size;else{var p=m.elem,E=m.wrapperClasses||[],w=m.wrapperStyle||{},C=ae(E,[h,p],void 0,w);C.style.top=he(-s-x-p.depth),m.marginLeft&&(C.style.marginLeft=m.marginLeft),m.marginRight&&(C.style.marginRight=m.marginRight),u.push(C),x+=p.height+p.depth}f=Math.min(f,x),g=Math.max(g,x)}var F=ae(["vlist"],u);F.style.height=he(g);var I;if(f<0){var P=ae([],[]),B=ae(["vlist"],[P]);B.style.height=he(-f);var ee=ae(["vlist-s"],[new xn("​")]);I=[ae(["vlist-r"],[F,ee]),ae(["vlist-r"],[B])]}else I=[ae(["vlist-r"],[F])];var b=ae(["vlist-t"],I);return I.length===2&&b.classes.push("vlist-t2"),b.height=g,b.depth=-f,b},Wu=(i,e)=>{var t=ae(["mspace"],[],e),n=Tt(i,e);return t.style.marginRight=he(n),t},es=(i,e,t)=>{var n,r;switch(i){case"amsrm":n="AMS";break;case"textrm":n="Main";break;case"textsf":n="SansSerif";break;case"texttt":n="Typewriter";break;default:n=i}return e==="textbf"&&t==="textit"?r="BoldItalic":e==="textbf"?r="Bold":t==="textit"?r="Italic":r="Regular",n+"-"+r},Q0={mathbf:{variant:"bold",fontName:"Main-Bold"},mathrm:{variant:"normal",fontName:"Main-Regular"},textit:{variant:"italic",fontName:"Main-Italic"},mathit:{variant:"italic",fontName:"Main-Italic"},mathnormal:{variant:"italic",fontName:"Math-Italic"},mathsfit:{variant:"sans-serif-italic",fontName:"SansSerif-Italic"},mathbb:{variant:"double-struck",fontName:"AMS-Regular"},mathcal:{variant:"script",fontName:"Caligraphic-Regular"},mathfrak:{variant:"fraktur",fontName:"Fraktur-Regular"},mathscr:{variant:"script",fontName:"Script-Regular"},mathsf:{variant:"sans-serif",fontName:"SansSerif-Regular"},mathtt:{variant:"monospace",fontName:"Typewriter-Regular"}},Xu={vec:["vec",.471,.714],oiintSize1:["oiintSize1",.957,.499],oiintSize2:["oiintSize2",1.472,.659],oiiintSize1:["oiiintSize1",1.304,.499],oiiintSize2:["oiiintSize2",1.98,.659]},$u=function(e,t){var n=Xu[e],r=n[0],a=n[1],s=n[2],o=new Di(r),l=new hi([o],{width:he(a),height:he(s),style:"width:"+he(a),viewBox:"0 0 "+1e3*a+" "+1e3*s,preserveAspectRatio:"xMinYMin"}),c=Li(["katex-overlay"],[l],t);return c.height=s,c.style.height=he(s),c.style.width=he(a),c},Et={number:3,unit:"mu"},qi={number:4,unit:"mu"},Qn={number:5,unit:"mu"},av={mord:{mop:Et,mbin:qi,mrel:Qn,minner:Et},mop:{mord:Et,mop:Et,mrel:Qn,minner:Et},mbin:{mord:qi,mop:qi,mopen:qi,minner:qi},mrel:{mord:Qn,mop:Qn,mopen:Qn,minner:Qn},mopen:{},mclose:{mop:Et,mbin:qi,mrel:Qn,minner:Et},mpunct:{mord:Et,mop:Et,mrel:Qn,mopen:Et,mclose:Et,mpunct:Et,minner:Et},minner:{mord:Et,mop:Et,mbin:qi,mrel:Qn,mopen:Et,mpunct:Et,minner:Et}},sv={mord:{mop:Et},mop:{mord:Et,mop:Et},mbin:{},mrel:{},mopen:{},mclose:{mop:Et},mpunct:{},minner:{mop:Et}},Yu={},fa={},pa={};function ve(i){for(var e=i.type,t=i.names,n=i.htmlBuilder,r=i.mathmlBuilder,a=0;a<t.length;++a)Yu[t[a]]=i;e&&(n&&(fa[e]=n),r&&(pa[e]=r))}function lr(i){var e=i.type,t=i.htmlBuilder,n=i.mathmlBuilder;t&&(fa[e]=t),n&&(pa[e]=n)}var ma=function(e){return e.type==="ordgroup"&&e.body.length===1?e.body[0]:e},Nt=function(e){return e.type==="ordgroup"?e.body:[e]},ov=new Set(["leftmost","mbin","mopen","mrel","mop","mpunct"]),lv=new Set(["rightmost","mrel","mclose","mpunct"]),cv={display:Xe.DISPLAY,text:Xe.TEXT,script:Xe.SCRIPT,scriptscript:Xe.SCRIPTSCRIPT},hv={mord:"mord",mop:"mop",mbin:"mbin",mrel:"mrel",mopen:"mopen",mclose:"mclose",mpunct:"mpunct",minner:"minner"},Gt=function(e,t,n,r){r===void 0&&(r=[null,null]);for(var a=[],s=0;s<e.length;s++){var o=ct(e[s],t);if(o instanceof Xr){var l=o.children;a.push(...l)}else a.push(o)}if(qu(a),!n)return a;var c=t;if(e.length===1){var h=e[0];h.type==="sizing"?c=t.havingSize(h.size):h.type==="styling"&&(c=t.havingStyle(cv[h.style]))}var u=ae([r[0]||"leftmost"],[],t),f=ae([r[1]||"rightmost"],[],t),g=n==="root";return el(a,(x,_)=>{var m=_.classes[0],p=x.classes[0];m==="mbin"&&lv.has(p)?_.classes[0]="mord":p==="mbin"&&ov.has(m)&&(x.classes[0]="mord")},{node:u},f,g),el(a,(x,_)=>{var m,p,E=nl(_),w=nl(x),C=E&&w?x.hasClass("mtight")?(m=sv[E])==null?void 0:m[w]:(p=av[E])==null?void 0:p[w]:null;if(C)return Wu(C,c)},{node:u},f,g),a},el=function(e,t,n,r,a){r&&e.push(r);for(var s=0;s<e.length;s++){var o=e[s],l=ju(o);if(l){el(l.children,t,n,null,a);continue}var c=!o.hasClass("mspace");if(c){var h=t(o,n.node);h&&(n.insertAfter?n.insertAfter(h):(e.unshift(h),s++))}c?n.node=o:a&&o.hasClass("katex-newline")&&(n.node=ae(["leftmost"])),n.insertAfter=(u=>f=>{e.splice(u+1,0,f),s++})(s)}r&&e.pop()},ju=function(e){return e instanceof Xr||e instanceof Us||e instanceof $r&&e.hasClass("enclosing")?e:null},tl=function(e,t){var n=ju(e);if(n){var r=n.children;if(r.length){if(t==="right")return tl(r[r.length-1],"right");if(t==="left")return tl(r[0],"left")}}return e},nl=function(e,t){if(!e)return null;t&&(e=tl(e,t));var n=e.classes[0];return hv[n]||null},ga=function(e,t){var n=["nulldelimiter"].concat(e.baseSizingClasses());return ae(t.concat(n))},ct=function(e,t,n){if(!e)return ae();if(fa[e.type]){var r=fa[e.type](e,t);if(n&&t.size!==n.size){r=ae(t.sizingClasses(n),[r],t);var a=t.sizeMultiplier/n.sizeMultiplier;r.height*=a,r.depth*=a}return r}else throw new oe("Got group of unknown type: '"+e.type+"'")};function ts(i,e){var t=ae(["katex-base"],i,e),n=ae(["katex-strut"]);return n.style.height=he(t.height+t.depth),t.depth&&(n.style.verticalAlign=he(-t.depth)),t.children.unshift(n),t}function il(i,e){var t=null;i.length===1&&i[0].type==="tag"&&(t=i[0].tag,i=i[0].body);var n=Gt(i,e,"root"),r;n.length===2&&n[1].hasClass("katex-tag")&&(r=n.pop());for(var a=[],s=[],o=0;o<n.length;o++)if(s.push(n[o]),n[o].hasClass("mbin")||n[o].hasClass("mrel")||n[o].hasClass("allowbreak")){for(var l=!1;o<n.length-1&&n[o+1].hasClass("mspace")&&!n[o+1].hasClass("katex-newline");)o++,s.push(n[o]),n[o].hasClass("nobreak")&&(l=!0);l||(a.push(ts(s,e)),s=[])}else n[o].hasClass("katex-newline")&&(s.pop(),s.length>0&&(a.push(ts(s,e)),s=[]),a.push(n[o]));s.length>0&&a.push(ts(s,e));var c;t?(c=ts(Gt(t,e,!0),e),c.classes=["katex-tag"],a.push(c)):r&&a.push(r);var h=ae(["katex-html"],a);if(h.setAttribute("aria-hidden","true"),c){var u=c.children[0];u.style.height=he(h.height+h.depth),h.depth&&(u.style.verticalAlign=he(-h.depth))}return h}function Ku(i){return new Xr(i)}class le{constructor(e,t,n){this.type=void 0,this.attributes=void 0,this.children=void 0,this.classes=void 0,this.type=e,this.attributes={},this.children=t||[],this.classes=n||[]}setAttribute(e,t){this.attributes[e]=t}getAttribute(e){return this.attributes[e]}toNode(){var e=document.createElementNS("http://www.w3.org/1998/Math/MathML",this.type);for(var t of Object.entries(this.attributes)){var n=t[0],r=t[1];e.setAttribute(n,r)}this.classes.length>0&&(e.className=Pi(this.classes));for(var a=0;a<this.children.length;a++)if(this.children[a]instanceof Ut&&this.children[a+1]instanceof Ut){for(var s=this.children[a].toText()+this.children[++a].toText();this.children[a+1]instanceof Ut;)s+=this.children[++a].toText();e.appendChild(new Ut(s).toNode())}else e.appendChild(this.children[a].toNode());return e}toMarkup(){var e="<"+this.type;for(var t of Object.entries(this.attributes)){var n=t[0],r=t[1];e+=" "+n+'="',e+=jt(r),e+='"'}this.classes.length>0&&(e+=' class ="'+jt(Pi(this.classes))+'"'),e+=">";for(var a=0;a<this.children.length;a++)e+=this.children[a].toMarkup();return e+="</"+this.type+">",e}toText(){return this.children.map(e=>e.toText()).join("")}}class Ut{constructor(e){this.text=void 0,this.text=e}toNode(){return document.createTextNode(this.text)}toMarkup(){return jt(this.toText())}toText(){return this.text}}class Zu{constructor(e){this.width=void 0,this.character=void 0,this.width=e,e>=.05555&&e<=.05556?this.character=" ":e>=.1666&&e<=.1667?this.character=" ":e>=.2222&&e<=.2223?this.character=" ":e>=.2777&&e<=.2778?this.character="  ":e>=-.05556&&e<=-.05555?this.character=" ⁣":e>=-.1667&&e<=-.1666?this.character=" ⁣":e>=-.2223&&e<=-.2222?this.character=" ⁣":e>=-.2778&&e<=-.2777?this.character=" ⁣":this.character=null}toNode(){if(this.character)return document.createTextNode(this.character);var e=document.createElementNS("http://www.w3.org/1998/Math/MathML","mspace");return e.setAttribute("width",he(this.width)),e}toMarkup(){return this.character?"<mtext>"+this.character+"</mtext>":'<mspace width="'+he(this.width)+'"/>'}toText(){return this.character?this.character:" "}}var uv=new Set(["\\imath","\\jmath"]),dv=new Set(["mrow","mtable"]),Cn=function(e,t,n){var r,a;return St[t][e]&&St[t][e].replace&&e.charCodeAt(0)!==55349&&!(Object.prototype.hasOwnProperty.call(Vu,e)&&((n==null||(r=n.fontFamily)==null?void 0:r.slice(4,6))==="tt"||(n==null||(a=n.font)==null?void 0:a.slice(4,6))==="tt"))&&(e=St[t][e].replace),new Ut(e)},Ll=function(e){return e.length===1?e[0]:new le("mrow",e)},fv={mathit:"italic",boldsymbol:i=>i.type==="textord"?"bold":"bold-italic",mathbf:"bold",mathbb:"double-struck",mathsfit:"sans-serif-italic",mathfrak:"fraktur",mathscr:"script",mathcal:"script",mathsf:"sans-serif",mathtt:"monospace"},Il=(i,e)=>{if(i.mode==="text"){if(e.fontFamily==="texttt")return"monospace";if(e.fontFamily==="textsf")return e.fontShape==="textit"&&e.fontWeight==="textbf"?"sans-serif-bold-italic":e.fontShape==="textit"?"sans-serif-italic":e.fontWeight==="textbf"?"bold-sans-serif":"sans-serif";if(e.fontShape==="textit"&&e.fontWeight==="textbf")return"bold-italic";if(e.fontShape==="textit")return"italic";if(e.fontWeight==="textbf")return"bold"}var t=e.font;if(!t||t==="mathnormal")return null;var n=i.mode,r=fv[t];if(r)return typeof r=="function"?r(i):r;var a=i.text;if(uv.has(a))return null;if(St[n][a]){var s=St[n][a].replace;s&&(a=s)}var o=Q0[t].fontName;return Rl(a,o,n)?Q0[t].variant:null};function Oo(i){if(!i)return!1;if(i.type==="mi"&&i.children.length===1){var e=i.children[0];return e instanceof Ut&&e.text==="."}else if(i.type==="mo"&&i.children.length===1&&i.getAttribute("separator")==="true"&&i.getAttribute("lspace")==="0em"&&i.getAttribute("rspace")==="0em"){var t=i.children[0];return t instanceof Ut&&t.text===","}else return!1}var yn=function(e,t,n){if(e.length===1){var r=_t(e[0],t);return n&&r instanceof le&&r.type==="mo"&&(r.setAttribute("lspace","0em"),r.setAttribute("rspace","0em")),[r]}for(var a=[],s,o=0;o<e.length;o++){var l=_t(e[o],t);if(l instanceof le&&s instanceof le){if(l.type==="mtext"&&s.type==="mtext"&&l.getAttribute("mathvariant")===s.getAttribute("mathvariant")){s.children.push(...l.children);continue}else if(l.type==="mn"&&s.type==="mn"){s.children.push(...l.children);continue}else if(Oo(l)&&s.type==="mn"){s.children.push(...l.children);continue}else if(l.type==="mn"&&Oo(s))l.children=[...s.children,...l.children],a.pop();else if((l.type==="msup"||l.type==="msub")&&l.children.length>=1&&(s.type==="mn"||Oo(s))){var c=l.children[0];c instanceof le&&c.type==="mn"&&(c.children=[...s.children,...c.children],a.pop())}else if(s.type==="mi"&&s.children.length===1){var h=s.children[0];if(h instanceof Ut&&h.text==="̸"&&(l.type==="mo"||l.type==="mi"||l.type==="mn")){var u=l.children[0];u instanceof Ut&&u.text.length>0&&(u.text=u.text.slice(0,1)+"̸"+u.text.slice(1),a.pop())}}}a.push(l),s=l}return a},Ii=function(e,t,n){return Ll(yn(e,t,n))},_t=function(e,t){if(!e)return new le("mrow");if(pa[e.type])return pa[e.type](e,t);throw new oe("Got group of unknown type: '"+e.type+"'")};function xh(i,e,t,n,r){var a=yn(i,t),s;a.length===1&&a[0]instanceof le&&dv.has(a[0].type)?s=a[0]:s=new le("mrow",a);var o=new le("annotation",[new Ut(e)]);o.setAttribute("encoding","application/x-tex");var l=new le("semantics",[s,o]),c=new le("math",[l]);c.setAttribute("xmlns","http://www.w3.org/1998/Math/MathML"),n&&c.setAttribute("display","block");var h=r?"katex":"katex-mathml";return ae([h],[c])}var pv=[[1,1,1],[2,1,1],[3,1,1],[4,2,1],[5,2,1],[6,3,1],[7,4,2],[8,6,3],[9,7,6],[10,8,7],[11,10,9]],_h=[.5,.6,.7,.8,.9,1,1.2,1.44,1.728,2.074,2.488],yh=function(e,t){return t.size<2?e:pv[e-1][t.size-1]};class ni{constructor(e){this.style=void 0,this.color=void 0,this.size=void 0,this.textSize=void 0,this.phantom=void 0,this.font=void 0,this.fontFamily=void 0,this.fontWeight=void 0,this.fontShape=void 0,this.sizeMultiplier=void 0,this.maxSize=void 0,this.minRuleThickness=void 0,this._fontMetrics=void 0,this.style=e.style,this.color=e.color,this.size=e.size||ni.BASESIZE,this.textSize=e.textSize||this.size,this.phantom=!!e.phantom,this.font=e.font||"",this.fontFamily=e.fontFamily||"",this.fontWeight=e.fontWeight||"",this.fontShape=e.fontShape||"",this.sizeMultiplier=_h[this.size-1],this.maxSize=e.maxSize,this.minRuleThickness=e.minRuleThickness,this._fontMetrics=void 0}extend(e){var t={style:this.style,size:this.size,textSize:this.textSize,color:this.color,phantom:this.phantom,font:this.font,fontFamily:this.fontFamily,fontWeight:this.fontWeight,fontShape:this.fontShape,maxSize:this.maxSize,minRuleThickness:this.minRuleThickness};return Object.assign(t,e),new ni(t)}havingStyle(e){return this.style===e?this:this.extend({style:e,size:yh(this.textSize,e)})}havingCrampedStyle(){return this.havingStyle(this.style.cramp())}havingSize(e){return this.size===e&&this.textSize===e?this:this.extend({style:this.style.text(),size:e,textSize:e,sizeMultiplier:_h[e-1]})}havingBaseStyle(e){e=e||this.style.text();var t=yh(ni.BASESIZE,e);return this.size===t&&this.textSize===ni.BASESIZE&&this.style===e?this:this.extend({style:e,size:t})}havingBaseSizing(){var e;switch(this.style.id){case 4:case 5:e=3;break;case 6:case 7:e=1;break;default:e=6}return this.extend({style:this.style.text(),size:e})}withColor(e){return this.extend({color:e})}withPhantom(){return this.extend({phantom:!0})}withFont(e){return this.extend({font:e})}withTextFontFamily(e){return this.extend({fontFamily:e,font:""})}withTextFontWeight(e){return this.extend({fontWeight:e,font:""})}withTextFontShape(e){return this.extend({fontShape:e,font:""})}sizingClasses(e){return e.size!==this.size?["katex-sizing","reset-size"+e.size,"size"+this.size]:[]}baseSizingClasses(){return this.size!==ni.BASESIZE?["katex-sizing","reset-size"+this.size,"size"+ni.BASESIZE]:[]}fontMetrics(){return this._fontMetrics||(this._fontMetrics=Z4(this.size)),this._fontMetrics}getColor(){return this.phantom?"transparent":this.color}}ni.BASESIZE=6;var Ju=function(e){return new ni({style:e.displayMode?Xe.DISPLAY:Xe.TEXT,maxSize:e.maxSize,minRuleThickness:e.minRuleThickness})},Qu=function(e,t){if(t.displayMode){var n=["katex-display"];t.leqno&&n.push("leqno"),t.fleqn&&n.push("fleqn"),e=ae(n,[e])}return e},mv=function(e,t,n){var r=Ju(n),a;if(n.output==="mathml")return xh(e,t,r,n.displayMode,!0);if(n.output==="html"){var s=il(e,r);a=ae(["katex"],[s])}else{var o=xh(e,t,r,n.displayMode,!1),l=il(e,r);a=ae(["katex"],[o,l])}return Qu(a,n)},gv=function(e,t,n){var r=Ju(n),a=il(e,r),s=ae(["katex"],[a]);return Qu(s,n)},vv={widehat:"^",widecheck:"ˇ",widetilde:"~",utilde:"~",overleftarrow:"←",underleftarrow:"←",xleftarrow:"←",overrightarrow:"→",underrightarrow:"→",xrightarrow:"→",underbrace:"⏟",overbrace:"⏞",underbracket:"⎵",overbracket:"⎴",overgroup:"⏠",undergroup:"⏡",overleftrightarrow:"↔",underleftrightarrow:"↔",xleftrightarrow:"↔",Overrightarrow:"⇒",xRightarrow:"⇒",overleftharpoon:"↼",xleftharpoonup:"↼",overrightharpoon:"⇀",xrightharpoonup:"⇀",xLeftarrow:"⇐",xLeftrightarrow:"⇔",xhookleftarrow:"↩",xhookrightarrow:"↪",xmapsto:"↦",xrightharpoondown:"⇁",xleftharpoondown:"↽",xrightleftharpoons:"⇌",xleftrightharpoons:"⇋",xtwoheadleftarrow:"↞",xtwoheadrightarrow:"↠",xlongequal:"=",xtofrom:"⇄",xrightleftarrows:"⇄",xrightequilibrium:"⇌",xleftequilibrium:"⇋","\\cdrightarrow":"→","\\cdleftarrow":"←","\\cdlongequal":"="},ks=function(e){var t=new le("mo",[new Ut(vv[e.replace(/^\\/,"")])]);return t.setAttribute("stretchy","true"),t},xv={overrightarrow:[["rightarrow"],.888,522,"xMaxYMin"],overleftarrow:[["leftarrow"],.888,522,"xMinYMin"],underrightarrow:[["rightarrow"],.888,522,"xMaxYMin"],underleftarrow:[["leftarrow"],.888,522,"xMinYMin"],xrightarrow:[["rightarrow"],1.469,522,"xMaxYMin"],"\\cdrightarrow":[["rightarrow"],3,522,"xMaxYMin"],xleftarrow:[["leftarrow"],1.469,522,"xMinYMin"],"\\cdleftarrow":[["leftarrow"],3,522,"xMinYMin"],Overrightarrow:[["doublerightarrow"],.888,560,"xMaxYMin"],xRightarrow:[["doublerightarrow"],1.526,560,"xMaxYMin"],xLeftarrow:[["doubleleftarrow"],1.526,560,"xMinYMin"],overleftharpoon:[["leftharpoon"],.888,522,"xMinYMin"],xleftharpoonup:[["leftharpoon"],.888,522,"xMinYMin"],xleftharpoondown:[["leftharpoondown"],.888,522,"xMinYMin"],overrightharpoon:[["rightharpoon"],.888,522,"xMaxYMin"],xrightharpoonup:[["rightharpoon"],.888,522,"xMaxYMin"],xrightharpoondown:[["rightharpoondown"],.888,522,"xMaxYMin"],xlongequal:[["longequal"],.888,334,"xMinYMin"],"\\cdlongequal":[["longequal"],3,334,"xMinYMin"],xtwoheadleftarrow:[["twoheadleftarrow"],.888,334,"xMinYMin"],xtwoheadrightarrow:[["twoheadrightarrow"],.888,334,"xMaxYMin"],overleftrightarrow:[["leftarrow","rightarrow"],.888,522],overbrace:[["leftbrace","midbrace","rightbrace"],1.6,548],underbrace:[["leftbraceunder","midbraceunder","rightbraceunder"],1.6,548],underleftrightarrow:[["leftarrow","rightarrow"],.888,522],xleftrightarrow:[["leftarrow","rightarrow"],1.75,522],xLeftrightarrow:[["doubleleftarrow","doublerightarrow"],1.75,560],xrightleftharpoons:[["leftharpoondownplus","rightharpoonplus"],1.75,716],xleftrightharpoons:[["leftharpoonplus","rightharpoondownplus"],1.75,716],xhookleftarrow:[["leftarrow","righthook"],1.08,522],xhookrightarrow:[["lefthook","rightarrow"],1.08,522],overlinesegment:[["leftlinesegment","rightlinesegment"],.888,522],underlinesegment:[["leftlinesegment","rightlinesegment"],.888,522],overbracket:[["leftbracketover","rightbracketover"],1.6,440],underbracket:[["leftbracketunder","rightbracketunder"],1.6,410],overgroup:[["leftgroup","rightgroup"],.888,342],undergroup:[["leftgroupunder","rightgroupunder"],.888,342],xmapsto:[["leftmapsto","rightarrow"],1.5,522],xtofrom:[["leftToFrom","rightToFrom"],1.75,528],xrightleftarrows:[["baraboveleftarrow","rightarrowabovebar"],1.75,901],xrightequilibrium:[["baraboveshortleftharpoon","rightharpoonaboveshortbar"],1.75,716],xleftequilibrium:[["shortbaraboveleftharpoon","shortrightharpoonabovebar"],1.75,716]},_v=new Set(["widehat","widecheck","widetilde","utilde"]),Bs=function(e,t){function n(){var l=4e5,c=e.label.slice(1);if(_v.has(c)&&"base"in e){var h=e.base.type==="ordgroup"?e.base.body.length:1,u,f,g;if(h>5)c==="widehat"||c==="widecheck"?(u=420,l=2364,g=.42,f=c+"4"):(u=312,l=2340,g=.34,f="tilde4");else{var x=[1,1,2,2,3,3][h];c==="widehat"||c==="widecheck"?(l=[0,1062,2364,2364,2364][x],u=[0,239,300,360,420][x],g=[0,.24,.3,.3,.36,.42][x],f=c+x):(l=[0,600,1033,2339,2340][x],u=[0,260,286,306,312][x],g=[0,.26,.286,.3,.306,.34][x],f="tilde"+x)}var _=new Di(f),m=new hi([_],{width:"100%",height:he(g),viewBox:"0 0 "+l+" "+u,preserveAspectRatio:"none"});return{span:Li([],[m],t),minWidth:0,height:g}}else{var p=[],E=xv[c];if(!E)throw new Error('No SVG data for "'+c+'".');var w=E[0],C=E[1],F=E[2],I=F/1e3,P=w.length,B,ee;if(P===1){if(E.length!==4)throw new Error('Expected 4-tuple for single-path SVG data "'+c+'".');B=["hide-tail"],ee=[E[3]]}else if(P===2)B=["halfarrow-left","halfarrow-right"],ee=["xMinYMin","xMaxYMin"];else if(P===3)B=["brace-left","brace-center","brace-right"],ee=["xMinYMin","xMidYMin","xMaxYMin"];else throw new Error(`Correct katexImagesData or update code here to support
                    `+P+" children.");for(var b=0;b<P;b++){var A=new Di(w[b]),W=new hi([A],{width:"400em",height:he(I),viewBox:"0 0 "+l+" "+F,preserveAspectRatio:ee[b]+" slice"}),X=Li([B[b]],[W],t);if(P===1)return{span:X,minWidth:C,height:I};X.style.height=he(I),p.push(X)}return{span:ae(["katex-stretchy"],p,t),minWidth:C,height:I}}}var r=n(),a=r.span,s=r.minWidth,o=r.height;return a.height=o,a.style.height=he(o),s>0&&(a.style.minWidth=he(s)),a},yv=function(e,t,n,r,a){var s,o=e.height+e.depth+n+r;if(/fbox|color|angl/.test(t)){if(s=ae(["katex-stretchy",t],[],a),t==="fbox"){var l=a.color&&a.getColor();l&&(s.style.borderColor=l)}}else{var c=[];/^[bx]cancel$/.test(t)&&c.push(new $0({x1:"0",y1:"0",x2:"100%",y2:"100%","stroke-width":"0.046em"})),/^x?cancel$/.test(t)&&c.push(new $0({x1:"0",y1:"100%",x2:"100%",y2:"0","stroke-width":"0.046em"}));var h=new hi(c,{width:"100%",height:he(o)});s=Li([],[h],a)}return s.height=o,s.style.height=he(o),s},bv=["bin","close","inner","open","punct","rel"],Mv=["accent-token","mathord","op-token","spacing","textord"],Sv=new Set(bv),wv=new Set(Mv);function Ev(i){return Sv.has(i)}function Qe(i,e){if(!i||i.type!==e)throw new Error("Expected node of type "+e+", but got "+(i?"node of type "+i.type:String(i)));return i}function zs(i){var e=Hs(i);if(!e)throw new Error("Expected node of symbol group type, but got "+(i?"node of type "+i.type:String(i)));return e}function Hs(i){return i.type==="atom"||wv.has(i.type)?i:null}function Nl(i,e,t){var n="";for(var r of i.body)if(r.type==="textord")n+=r.text;else if(t&&r.type==="spacing"&&r.text===" ")n+=" ";else throw new oe(e,i);return n}var ed=i=>{if(i instanceof xn)return i;if(j4(i)&&i.children.length===1)return ed(i.children[0])},td=(i,e)=>{var t,n,r;i&&i.type==="supsub"?(n=Qe(i.base,"accent"),t=n.base,i.base=t,r=Y4(ct(i,e)),i.base=n):(n=Qe(i,"accent"),t=n.base);var a=ct(t,e.havingCrampedStyle()),s=n.isShifty&&ui(t),o=0;if(s){var l,c;o=(l=(c=ed(a))==null?void 0:c.skew)!=null?l:0}var h=n.label==="\\c",u=h?a.height+a.depth:Math.min(a.height,e.fontMetrics().xHeight),f;if(n.isStretchy)f=Bs(n,e),f=dt({positionType:"firstBaseline",children:[{type:"elem",elem:a},{type:"elem",elem:f,wrapperClasses:["svg-align"],wrapperStyle:o>0?{width:"calc(100% - "+he(2*o)+")",marginLeft:he(2*o)}:void 0}]});else{var g,x;n.label==="\\vec"?(g=$u("vec",e),x=Xu.vec[1]):(g=Os({type:"textord",mode:n.mode,text:n.label},e),g=$4(g),g.italic=0,x=g.width,h&&(u+=g.depth)),f=ae(["accent-body"],[g]);var _=n.label==="\\textcircled";_&&(f.classes.push("accent-full"),u=a.height);var m=o;_||(m-=x/2),f.style.left=he(m),n.label==="\\textcircled"&&(f.style.top=".2em"),f=dt({positionType:"firstBaseline",children:[{type:"elem",elem:a},{type:"kern",size:-u},{type:"elem",elem:f}]})}var p=ae(["mord","katex-accent"],[f],e);return r?(r.children[0]=p,r.height=Math.max(p.height,r.height),r.classes[0]="mord",r):p},Tv=(i,e)=>{var t=i.isStretchy?ks(i.label):new le("mo",[Cn(i.label,i.mode)]),n=new le("mover",[_t(i.base,e),t]);return n.setAttribute("accent","true"),n},Av=new RegExp(["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot","\\mathring"].map(i=>"\\"+i).join("|"));ve({type:"accent",names:["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot","\\mathring","\\widecheck","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\Overrightarrow","\\overleftrightarrow","\\overgroup","\\overlinesegment","\\overleftharpoon","\\overrightharpoon"],numArgs:1,handler:(i,e)=>{var t=ma(e[0]),n=!Av.test(i.funcName),r=!n||i.funcName==="\\widehat"||i.funcName==="\\widetilde"||i.funcName==="\\widecheck";return{type:"accent",mode:i.parser.mode,label:i.funcName,isStretchy:n,isShifty:r,base:t}},htmlBuilder:td,mathmlBuilder:Tv});ve({type:"accent",names:["\\'","\\`","\\^","\\~","\\=","\\u","\\.",'\\"',"\\c","\\r","\\H","\\v","\\textcircled"],numArgs:1,allowedInText:!0,allowedInMath:!0,argTypes:["primitive"],handler:(i,e)=>{var t=e[0],n=i.parser.mode;return n==="math"&&(i.parser.settings.reportNonstrict("mathVsTextAccents","LaTeX's accent "+i.funcName+" works only in text mode"),n="text"),{type:"accent",mode:n,label:i.funcName,isStretchy:!1,isShifty:!0,base:t}}});ve({type:"accentUnder",names:["\\underleftarrow","\\underrightarrow","\\underleftrightarrow","\\undergroup","\\underlinesegment","\\utilde"],numArgs:1,handler:(i,e)=>{var t=i.parser,n=i.funcName,r=e[0];return{type:"accentUnder",mode:t.mode,label:n,base:r}},htmlBuilder:(i,e)=>{var t=ct(i.base,e),n=Bs(i,e),r=i.label==="\\utilde"?.12:0,a=dt({positionType:"top",positionData:t.height,children:[{type:"elem",elem:n,wrapperClasses:["svg-align"]},{type:"kern",size:r},{type:"elem",elem:t}]});return ae(["mord","accentunder"],[a],e)},mathmlBuilder:(i,e)=>{var t=ks(i.label),n=new le("munder",[_t(i.base,e),t]);return n.setAttribute("accentunder","true"),n}});var ns=i=>{var e=new le("mpadded",i?[i]:[]);return e.setAttribute("width","+0.6em"),e.setAttribute("lspace","0.3em"),e};ve({type:"xArrow",names:["\\xleftarrow","\\xrightarrow","\\xLeftarrow","\\xRightarrow","\\xleftrightarrow","\\xLeftrightarrow","\\xhookleftarrow","\\xhookrightarrow","\\xmapsto","\\xrightharpoondown","\\xrightharpoonup","\\xleftharpoondown","\\xleftharpoonup","\\xrightleftharpoons","\\xleftrightharpoons","\\xlongequal","\\xtwoheadrightarrow","\\xtwoheadleftarrow","\\xtofrom","\\xrightleftarrows","\\xrightequilibrium","\\xleftequilibrium","\\\\cdrightarrow","\\\\cdleftarrow","\\\\cdlongequal"],numArgs:1,numOptionalArgs:1,handler(i,e,t){var n=i.parser,r=i.funcName;return{type:"xArrow",mode:n.mode,label:r,body:e[0],below:t[0]}},htmlBuilder(i,e){var t=e.style,n=e.havingStyle(t.sup()),r=Vr(ct(i.body,n,e),e),a=i.label.slice(0,2)==="\\x"?"x":"cd";r.classes.push(a+"-arrow-pad");var s;i.below&&(n=e.havingStyle(t.sub()),s=Vr(ct(i.below,n,e),e),s.classes.push(a+"-arrow-pad"));var o=Bs(i,e),l=-e.fontMetrics().axisHeight+.5*o.height,c=-e.fontMetrics().axisHeight-.5*o.height-.111;(r.depth>.25||i.label==="\\xleftequilibrium")&&(c-=r.depth);var h;if(s){var u=-e.fontMetrics().axisHeight+s.height+.5*o.height+.111;h=dt({positionType:"individualShift",children:[{type:"elem",elem:r,shift:c},{type:"elem",elem:o,shift:l,wrapperClasses:["svg-align"]},{type:"elem",elem:s,shift:u}]})}else h=dt({positionType:"individualShift",children:[{type:"elem",elem:r,shift:c},{type:"elem",elem:o,shift:l,wrapperClasses:["svg-align"]}]});return ae(["mrel","x-arrow"],[h],e)},mathmlBuilder(i,e){var t=ks(i.label);t.setAttribute("minsize",i.label.charAt(0)==="x"?"1.75em":"3.0em");var n;if(i.body){var r=ns(_t(i.body,e));if(i.below){var a=ns(_t(i.below,e));n=new le("munderover",[t,a,r])}else n=new le("mover",[t,r])}else if(i.below){var s=ns(_t(i.below,e));n=new le("munder",[t,s])}else n=ns(),n=new le("mover",[t,n]);return n}});function Cv(i,e){var t=Gt(i.body,e,!0);return ae([i.mclass],t,e)}function Rv(i,e){var t,n=yn(i.body,e);return i.mclass==="minner"?t=new le("mpadded",n):i.mclass==="mord"?i.isCharacterBox?(t=n[0],t.type="mi"):t=new le("mi",n):(i.isCharacterBox?(t=n[0],t.type="mo"):t=new le("mo",n),i.mclass==="mbin"?(t.attributes.lspace="0.22em",t.attributes.rspace="0.22em"):i.mclass==="mpunct"?(t.attributes.lspace="0em",t.attributes.rspace="0.17em"):(i.mclass==="mopen"||i.mclass==="mclose")&&(t.attributes.lspace="0em",t.attributes.rspace="0em")),t}ve({type:"mclass",names:["\\mathord","\\mathbin","\\mathrel","\\mathopen","\\mathclose","\\mathpunct","\\mathinner"],numArgs:1,primitive:!0,handler(i,e){var t=i.parser,n=i.funcName,r=e[0];return{type:"mclass",mode:t.mode,mclass:"m"+n.slice(5),body:Nt(r),isCharacterBox:ui(r)}},htmlBuilder:Cv,mathmlBuilder:Rv});var Gs=i=>{var e=i.type==="ordgroup"&&i.body.length?i.body[0]:i;return e.type==="atom"&&(e.family==="bin"||e.family==="rel")?"m"+e.family:"mord"};ve({type:"mclass",names:["\\@binrel"],numArgs:2,handler(i,e){var t=i.parser;return{type:"mclass",mode:t.mode,mclass:Gs(e[0]),body:Nt(e[1]),isCharacterBox:ui(e[1])}}});ve({type:"mclass",names:["\\stackrel","\\overset","\\underset"],numArgs:2,handler(i,e){var t=i.parser,n=i.funcName,r=e[1],a=e[0],s;n!=="\\stackrel"?s=Gs(r):s="mrel";var o={type:"op",mode:r.mode,limits:!0,alwaysHandleSupSub:!0,parentIsSupSub:!1,symbol:!1,suppressBaseShift:n!=="\\stackrel",body:Nt(r)},l=n==="\\underset"?{type:"supsub",mode:a.mode,base:o,sub:a}:{type:"supsub",mode:a.mode,base:o,sup:a};return{type:"mclass",mode:t.mode,mclass:s,body:[l],isCharacterBox:ui(l)}}});ve({type:"pmb",names:["\\pmb"],numArgs:1,allowedInText:!0,handler(i,e){var t=i.parser;return{type:"pmb",mode:t.mode,mclass:Gs(e[0]),body:Nt(e[0])}},htmlBuilder(i,e){var t=Gt(i.body,e,!0),n=ae([i.mclass],t,e);return n.style.textShadow="0.02em 0.01em 0.04px",n},mathmlBuilder(i,e){var t=yn(i.body,e),n=new le("mstyle",t);return n.setAttribute("style","text-shadow: 0.02em 0.01em 0.04px"),n}});var Pv={">":"\\\\cdrightarrow","<":"\\\\cdleftarrow","=":"\\\\cdlongequal",A:"\\uparrow",V:"\\downarrow","|":"\\Vert",".":"no arrow"},bh=()=>({type:"styling",body:[],mode:"math",style:"display",resetFont:!0}),Mh=i=>i.type==="textord"&&i.text==="@",Dv=(i,e)=>(i.type==="mathord"||i.type==="atom")&&i.text===e;function Lv(i,e,t){var n=Pv[i];switch(n){case"\\\\cdrightarrow":case"\\\\cdleftarrow":return t.callFunction(n,[e[0]],[e[1]]);case"\\uparrow":case"\\downarrow":{var r=t.callFunction("\\\\cdleft",[e[0]],[]),a={type:"atom",text:n,mode:"math",family:"rel"},s=t.callFunction("\\Big",[a],[]),o=t.callFunction("\\\\cdright",[e[1]],[]),l={type:"ordgroup",mode:"math",body:[r,s,o]};return t.callFunction("\\\\cdparent",[l],[])}case"\\\\cdlongequal":return t.callFunction("\\\\cdlongequal",[],[]);case"\\Vert":{var c={type:"textord",text:"\\Vert",mode:"math"};return t.callFunction("\\Big",[c],[])}default:return{type:"textord",text:" ",mode:"math"}}}function Iv(i){var e=[];for(i.gullet.beginGroup(),i.gullet.macros.set("\\cr","\\\\\\relax"),i.gullet.beginGroup();;){e.push(i.parseExpression(!1,"\\\\")),i.gullet.endGroup(),i.gullet.beginGroup();var t=i.fetch().text;if(t==="&"||t==="\\\\")i.consume();else if(t==="\\end"){e[e.length-1].length===0&&e.pop();break}else throw new oe("Expected \\\\ or \\cr or \\end",i.nextToken)}for(var n=[],r=[n],a=0;a<e.length;a++){for(var s=e[a],o=bh(),l=0;l<s.length;l++)if(!Mh(s[l]))o.body.push(s[l]);else{n.push(o),l+=1;var c=zs(s[l]).text,h=new Array(2);if(h[0]={type:"ordgroup",mode:"math",body:[]},h[1]={type:"ordgroup",mode:"math",body:[]},!"=|.".includes(c))if("<>AV".includes(c))for(var u=0;u<2;u++){for(var f=!0,g=l+1;g<s.length;g++){if(Dv(s[g],c)){f=!1,l=g;break}if(Mh(s[g]))throw new oe("Missing a "+c+" character to complete a CD arrow.",s[g]);h[u].body.push(s[g])}if(f)throw new oe("Missing a "+c+" character to complete a CD arrow.",s[l])}else throw new oe('Expected one of "<>AV=|." after @',s[l]);var x=Lv(c,h,i),_={type:"styling",body:[x],mode:"math",style:"display",resetFont:!0};n.push(_),o=bh()}a%2===0?n.push(o):n.shift(),n=[],r.push(n)}i.gullet.endGroup(),i.gullet.endGroup();var m=new Array(r[0].length).fill({type:"align",align:"c",pregap:.25,postgap:.25});return{type:"array",mode:"math",body:r,arraystretch:1,addJot:!0,rowGaps:[null],cols:m,colSeparationType:"CD",hLinesBeforeRow:new Array(r.length+1).fill([])}}ve({type:"cdlabel",names:["\\\\cdleft","\\\\cdright"],numArgs:1,handler(i,e){var t=i.parser,n=i.funcName;return{type:"cdlabel",mode:t.mode,side:n.slice(4),label:e[0]}},htmlBuilder(i,e){var t=e.havingStyle(e.style.sup()),n=Vr(ct(i.label,t,e),e);return n.classes.push("cd-label-"+i.side),n.style.bottom=he(.8-n.depth),n.height=0,n.depth=0,n},mathmlBuilder(i,e){var t=new le("mrow",[_t(i.label,e)]);return t=new le("mpadded",[t]),t.setAttribute("width","0"),i.side==="left"&&t.setAttribute("lspace","-1width"),t.setAttribute("voffset","0.7em"),t=new le("mstyle",[t]),t.setAttribute("displaystyle","false"),t.setAttribute("scriptlevel","1"),t}});ve({type:"cdlabelparent",names:["\\\\cdparent"],numArgs:1,handler(i,e){var t=i.parser;return{type:"cdlabelparent",mode:t.mode,fragment:e[0]}},htmlBuilder(i,e){var t=Vr(ct(i.fragment,e),e);return t.classes.push("cd-vert-arrow"),t},mathmlBuilder(i,e){return new le("mrow",[_t(i.fragment,e)])}});ve({type:"textord",names:["\\@char"],numArgs:1,allowedInText:!0,handler(i,e){var t=i.parser,n=Qe(e[0],"ordgroup"),r=Nl(n,"\\@char has non-numeric argument"),a=parseInt(r),s;if(isNaN(a))throw new oe("\\@char has non-numeric argument "+r);if(a<0||a>1114111)throw new oe("\\@char with invalid code point "+r);return a<=65535?s=String.fromCharCode(a):(a-=65536,s=String.fromCharCode((a>>10)+55296,(a&1023)+56320)),{type:"textord",mode:t.mode,text:s}}});var Nv=(i,e)=>{var t=Gt(i.body,e.withColor(i.color),!1);return fi(t)},Uv=(i,e)=>{var t=yn(i.body,e.withColor(i.color)),n=new le("mstyle",t);return n.setAttribute("mathcolor",i.color),n};ve({type:"color",names:["\\textcolor"],numArgs:2,allowedInText:!0,argTypes:["color","original"],handler(i,e){var t=i.parser,n=Qe(e[0],"color-token").color,r=e[1];return{type:"color",mode:t.mode,color:n,body:Nt(r)}},htmlBuilder:Nv,mathmlBuilder:Uv});ve({type:"color",names:["\\color"],numArgs:1,allowedInText:!0,argTypes:["color"],handler(i,e){var t=i.parser,n=i.breakOnTokenText,r=Qe(e[0],"color-token").color;t.gullet.macros.set("\\current@color",r);var a=t.parseExpression(!0,n);return{type:"color",mode:t.mode,color:r,body:a}}});ve({type:"cr",names:["\\\\"],numArgs:0,numOptionalArgs:0,allowedInText:!0,handler(i,e,t){var n=i.parser,r=n.gullet.future().text==="["?n.parseSizeGroup(!0):null,a=!n.settings.displayMode||!n.settings.useStrictBehavior("newLineInDisplayMode","In LaTeX, \\\\ or \\newline does nothing in display mode");return{type:"cr",mode:n.mode,newLine:a,size:r&&Qe(r,"size").value}},htmlBuilder(i,e){var t=ae(["mspace"],[],e);return i.newLine&&(t.classes.push("katex-newline"),i.size&&(t.style.marginTop=he(Tt(i.size,e)))),t},mathmlBuilder(i,e){var t=new le("mspace");return i.newLine&&(t.setAttribute("linebreak","newline"),i.size&&t.setAttribute("height",he(Tt(i.size,e)))),t}});var rl={"\\global":"\\global","\\long":"\\\\globallong","\\\\globallong":"\\\\globallong","\\def":"\\gdef","\\gdef":"\\gdef","\\edef":"\\xdef","\\xdef":"\\xdef","\\let":"\\\\globallet","\\futurelet":"\\\\globalfuture"},nd=i=>{var e=i.text;if(/^(?:[\\{}$&#^_]|EOF)$/.test(e))throw new oe("Expected a control sequence",i);return e},Fv=i=>{var e=i.gullet.popToken();return e.text==="="&&(e=i.gullet.popToken(),e.text===" "&&(e=i.gullet.popToken())),e},id=(i,e,t,n)=>{var r=i.gullet.macros.get(t.text);r==null&&(t.noexpand=!0,r={tokens:[t],numArgs:0,unexpandable:!i.gullet.isExpandable(t.text)}),i.gullet.macros.set(e,r,n)};ve({type:"internal",names:["\\global","\\long","\\\\globallong"],numArgs:0,allowedInText:!0,handler(i){var e=i.parser,t=i.funcName;e.consumeSpaces();var n=e.fetch();if(rl[n.text])return(t==="\\global"||t==="\\\\globallong")&&(n.text=rl[n.text]),Qe(e.parseFunction(),"internal");throw new oe("Invalid token after macro prefix",n)}});ve({type:"internal",names:["\\def","\\gdef","\\edef","\\xdef"],numArgs:0,allowedInText:!0,primitive:!0,handler(i){var e=i.parser,t=i.funcName,n=e.gullet.popToken(),r=n.text;if(/^(?:[\\{}$&#^_]|EOF)$/.test(r))throw new oe("Expected a control sequence",n);for(var a=0,s,o=[[]];e.gullet.future().text!=="{";)if(n=e.gullet.popToken(),n.text==="#"){if(e.gullet.future().text==="{"){s=e.gullet.future(),o[a].push("{");break}if(n=e.gullet.popToken(),!/^[1-9]$/.test(n.text))throw new oe('Invalid argument number "'+n.text+'"');if(parseInt(n.text)!==a+1)throw new oe('Argument number "'+n.text+'" out of order');a++,o.push([])}else{if(n.text==="EOF")throw new oe("Expected a macro definition");o[a].push(n.text)}var l=e.gullet.consumeArg(),c=l.tokens;return s&&c.unshift(s),(t==="\\edef"||t==="\\xdef")&&(c=e.gullet.expandTokens(c),c.reverse()),e.gullet.macros.set(r,{tokens:c,numArgs:a,delimiters:o},t===rl[t]),{type:"internal",mode:e.mode}}});ve({type:"internal",names:["\\let","\\\\globallet"],numArgs:0,allowedInText:!0,primitive:!0,handler(i){var e=i.parser,t=i.funcName,n=nd(e.gullet.popToken());e.gullet.consumeSpaces();var r=Fv(e);return id(e,n,r,t==="\\\\globallet"),{type:"internal",mode:e.mode}}});ve({type:"internal",names:["\\futurelet","\\\\globalfuture"],numArgs:0,allowedInText:!0,primitive:!0,handler(i){var e=i.parser,t=i.funcName,n=nd(e.gullet.popToken()),r=e.gullet.popToken(),a=e.gullet.popToken();return id(e,n,a,t==="\\\\globalfuture"),e.gullet.pushToken(a),e.gullet.pushToken(r),{type:"internal",mode:e.mode}}});var aa=function(e,t,n){var r=St.math[e]&&St.math[e].replace,a=Rl(r||e,t,n);if(!a)throw new Error("Unsupported symbol "+e+" and font size "+t+".");return a},Ul=function(e,t,n,r){var a=n.havingBaseStyle(t),s=ae(r.concat(a.sizingClasses(n)),[e],n),o=a.sizeMultiplier/n.sizeMultiplier;return s.height*=o,s.depth*=o,s.maxFontSize=a.sizeMultiplier,s},rd=function(e,t,n){var r=t.havingBaseStyle(n),a=(1-t.sizeMultiplier/r.sizeMultiplier)*t.fontMetrics().axisHeight;e.classes.push("delimcenter"),e.style.top=he(a),e.height-=a,e.depth+=a},Ov=function(e,t,n,r,a,s){var o=Qt(e,"Main-Regular",a,r),l=Ul(o,t,r,s);return rd(l,r,t),l},kv=function(e,t,n,r){return Qt(e,"Size"+t+"-Regular",n,r)},ad=function(e,t,n,r,a,s){var o=kv(e,t,a,r),l=Ul(ae(["delimsizing","size"+t],[o],r),Xe.TEXT,r,s);return n&&rd(l,r,Xe.TEXT),l},ko=function(e,t,n){var r;t==="Size1-Regular"?r="delim-size1":r="delim-size4";var a=ae(["delimsizinginner",r],[ae([],[Qt(e,t,n)])]);return{type:"elem",elem:a}},Bo=function(e,t,n){var r=Gn["Size4-Regular"][e.charCodeAt(0)]?Gn["Size4-Regular"][e.charCodeAt(0)][4]:Gn["Size1-Regular"][e.charCodeAt(0)][4],a=new Di("inner",z4(e,Math.round(1e3*t))),s=new hi([a],{width:he(r),height:he(t),style:"width:"+he(r),viewBox:"0 0 "+1e3*r+" "+Math.round(1e3*t),preserveAspectRatio:"xMinYMin"}),o=Li([],[s],n);return o.height=t,o.style.height=he(t),o.style.width=he(r),{type:"elem",elem:o}},al=.008,is={type:"kern",size:-1*al},Bv=new Set(["|","\\lvert","\\rvert","\\vert"]),zv=new Set(["\\|","\\lVert","\\rVert","\\Vert"]),sd=function(e,t,n,r,a,s){var o,l,c,h,u="",f=0;o=c=h=e,l=null;var g="Size1-Regular";e==="\\uparrow"?c=h="⏐":e==="\\Uparrow"?c=h="‖":e==="\\downarrow"?o=c="⏐":e==="\\Downarrow"?o=c="‖":e==="\\updownarrow"?(o="\\uparrow",c="⏐",h="\\downarrow"):e==="\\Updownarrow"?(o="\\Uparrow",c="‖",h="\\Downarrow"):Bv.has(e)?(c="∣",u="vert",f=333):zv.has(e)?(c="∥",u="doublevert",f=556):e==="["||e==="\\lbrack"?(o="⎡",c="⎢",h="⎣",g="Size4-Regular",u="lbrack",f=667):e==="]"||e==="\\rbrack"?(o="⎤",c="⎥",h="⎦",g="Size4-Regular",u="rbrack",f=667):e==="\\lfloor"||e==="⌊"?(c=o="⎢",h="⎣",g="Size4-Regular",u="lfloor",f=667):e==="\\lceil"||e==="⌈"?(o="⎡",c=h="⎢",g="Size4-Regular",u="lceil",f=667):e==="\\rfloor"||e==="⌋"?(c=o="⎥",h="⎦",g="Size4-Regular",u="rfloor",f=667):e==="\\rceil"||e==="⌉"?(o="⎤",c=h="⎥",g="Size4-Regular",u="rceil",f=667):e==="("||e==="\\lparen"?(o="⎛",c="⎜",h="⎝",g="Size4-Regular",u="lparen",f=875):e===")"||e==="\\rparen"?(o="⎞",c="⎟",h="⎠",g="Size4-Regular",u="rparen",f=875):e==="\\{"||e==="\\lbrace"?(o="⎧",l="⎨",h="⎩",c="⎪",g="Size4-Regular"):e==="\\}"||e==="\\rbrace"?(o="⎫",l="⎬",h="⎭",c="⎪",g="Size4-Regular"):e==="\\lgroup"||e==="⟮"?(o="⎧",h="⎩",c="⎪",g="Size4-Regular"):e==="\\rgroup"||e==="⟯"?(o="⎫",h="⎭",c="⎪",g="Size4-Regular"):e==="\\lmoustache"||e==="⎰"?(o="⎧",h="⎭",c="⎪",g="Size4-Regular"):(e==="\\rmoustache"||e==="⎱")&&(o="⎫",h="⎩",c="⎪",g="Size4-Regular");var x=aa(o,g,a),_=x.height+x.depth,m=aa(c,g,a),p=m.height+m.depth,E=aa(h,g,a),w=E.height+E.depth,C=0,F=1;if(l!==null){var I=aa(l,g,a);C=I.height+I.depth,F=2}var P=_+w+C,B=Math.max(0,Math.ceil((t-P)/(F*p))),ee=P+B*F*p,b=r.fontMetrics().axisHeight;n&&(b*=r.sizeMultiplier);var A=ee/2-b,W=[];if(u.length>0){var X=ee-_-w,K=Math.round(ee*1e3),te=H4(u,Math.round(X*1e3)),$=new Di(u,te),ne=he(f/1e3),Y=he(K/1e3),Se=new hi([$],{width:ne,height:Y,viewBox:"0 0 "+f+" "+K}),ge=Li([],[Se],r);ge.height=K/1e3,ge.style.width=ne,ge.style.height=Y,W.push({type:"elem",elem:ge})}else{if(W.push(ko(h,g,a)),W.push(is),l===null){var we=ee-_-w+2*al;W.push(Bo(c,we,r))}else{var et=(ee-_-w-C)/2+2*al;W.push(Bo(c,et,r)),W.push(is),W.push(ko(l,g,a)),W.push(is),W.push(Bo(c,et,r))}W.push(is),W.push(ko(o,g,a))}var je=r.havingBaseStyle(Xe.TEXT),Z=dt({positionType:"bottom",positionData:A,children:W});return Ul(ae(["delimsizing","mult"],[Z],je),Xe.TEXT,r,s)},zo=80,Ho=.08,Go=function(e,t,n,r,a){var s=B4(e,r,n),o=new Di(e,s),l=new hi([o],{width:"400em",height:he(t),viewBox:"0 0 400000 "+n,preserveAspectRatio:"xMinYMin slice"});return Li(["hide-tail"],[l],a)},Hv=function(e,t){var n=t.havingBaseSizing(),r=ud("\\surd",e*n.sizeMultiplier,hd,n),a=n.sizeMultiplier,s=Math.max(0,t.minRuleThickness-t.fontMetrics().sqrtRuleThickness),o,l,c,h,u;return r.type==="small"?(h=1e3+1e3*s+zo,e<1?a=1:e<1.4&&(a=.7),l=(1+s+Ho)/a,c=(1+s)/a,o=Go("sqrtMain",l,h,s,t),o.style.minWidth="0.853em",u=.833/a):r.type==="large"?(h=(1e3+zo)*sa[r.size],c=(sa[r.size]+s)/a,l=(sa[r.size]+s+Ho)/a,o=Go("sqrtSize"+r.size,l,h,s,t),o.style.minWidth="1.02em",u=1/a):(l=e+s+Ho,c=e+s,h=Math.floor(1e3*e+s)+zo,o=Go("sqrtTall",l,h,s,t),o.style.minWidth="0.742em",u=1.056),o.height=c,o.style.height=he(l),{span:o,advanceWidth:u,ruleWidth:(t.fontMetrics().sqrtRuleThickness+s)*a}},od=new Set(["(","\\lparen",")","\\rparen","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","⌊","⌋","\\lceil","\\rceil","⌈","⌉","\\surd"]),Gv=new Set(["\\uparrow","\\downarrow","\\updownarrow","\\Uparrow","\\Downarrow","\\Updownarrow","|","\\|","\\vert","\\Vert","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","⟮","⟯","\\lmoustache","\\rmoustache","⎰","⎱"]),ld=new Set(["<",">","\\langle","\\rangle","/","\\backslash","\\lt","\\gt"]),sa=[0,1.2,1.8,2.4,3],cd=function(e,t,n,r,a){if(e==="<"||e==="\\lt"||e==="⟨"?e="\\langle":(e===">"||e==="\\gt"||e==="⟩")&&(e="\\rangle"),od.has(e)||ld.has(e))return ad(e,t,!1,n,r,a);if(Gv.has(e))return sd(e,sa[t],!1,n,r,a);throw new oe("Illegal delimiter: '"+e+"'")},Vv=[{type:"small",style:Xe.SCRIPTSCRIPT},{type:"small",style:Xe.SCRIPT},{type:"small",style:Xe.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4}],qv=[{type:"small",style:Xe.SCRIPTSCRIPT},{type:"small",style:Xe.SCRIPT},{type:"small",style:Xe.TEXT},{type:"stack"}],hd=[{type:"small",style:Xe.SCRIPTSCRIPT},{type:"small",style:Xe.SCRIPT},{type:"small",style:Xe.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4},{type:"stack"}],Wv=function(e){if(e.type==="small")return"Main-Regular";if(e.type==="large")return"Size"+e.size+"-Regular";if(e.type==="stack")return"Size4-Regular";var t=e.type;throw new Error("Add support for delim type '"+t+"' here.")},ud=function(e,t,n,r){for(var a=Math.min(2,3-r.style.size),s=a;s<n.length;s++){var o=n[s];if(o.type==="stack")break;var l=aa(e,Wv(o),"math"),c=l.height+l.depth;if(o.type==="small"){var h=r.havingBaseStyle(o.style);c*=h.sizeMultiplier}if(c>t)return o}return n[n.length-1]},sl=function(e,t,n,r,a,s){e==="<"||e==="\\lt"||e==="⟨"?e="\\langle":(e===">"||e==="\\gt"||e==="⟩")&&(e="\\rangle");var o;ld.has(e)?o=Vv:od.has(e)?o=hd:o=qv;var l=ud(e,t,o,r);return l.type==="small"?Ov(e,l.style,n,r,a,s):l.type==="large"?ad(e,l.size,n,r,a,s):sd(e,t,n,r,a,s)},Vo=function(e,t,n,r,a,s){var o=r.fontMetrics().axisHeight*r.sizeMultiplier,l=901,c=5/r.fontMetrics().ptPerEm,h=Math.max(t-o,n+o),u=Math.max(h/500*l,2*h-c);return sl(e,u,!0,r,a,s)},Sh={"\\bigl":{mclass:"mopen",size:1},"\\Bigl":{mclass:"mopen",size:2},"\\biggl":{mclass:"mopen",size:3},"\\Biggl":{mclass:"mopen",size:4},"\\bigr":{mclass:"mclose",size:1},"\\Bigr":{mclass:"mclose",size:2},"\\biggr":{mclass:"mclose",size:3},"\\Biggr":{mclass:"mclose",size:4},"\\bigm":{mclass:"mrel",size:1},"\\Bigm":{mclass:"mrel",size:2},"\\biggm":{mclass:"mrel",size:3},"\\Biggm":{mclass:"mrel",size:4},"\\big":{mclass:"mord",size:1},"\\Big":{mclass:"mord",size:2},"\\bigg":{mclass:"mord",size:3},"\\Bigg":{mclass:"mord",size:4}},Xv=new Set(["(","\\lparen",")","\\rparen","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","⌊","⌋","\\lceil","\\rceil","⌈","⌉","<",">","\\langle","⟨","\\rangle","⟩","\\lt","\\gt","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","⟮","⟯","\\lmoustache","\\rmoustache","⎰","⎱","/","\\backslash","|","\\vert","\\|","\\Vert","\\uparrow","\\Uparrow","\\downarrow","\\Downarrow","\\updownarrow","\\Updownarrow","."]);function wh(i){return"isMiddle"in i}function Vs(i,e){var t=Hs(i);if(t&&Xv.has(t.text))return t;throw t?new oe("Invalid delimiter '"+t.text+"' after '"+e.funcName+"'",i):new oe("Invalid delimiter type '"+i.type+"'",i)}ve({type:"delimsizing",names:["\\bigl","\\Bigl","\\biggl","\\Biggl","\\bigr","\\Bigr","\\biggr","\\Biggr","\\bigm","\\Bigm","\\biggm","\\Biggm","\\big","\\Big","\\bigg","\\Bigg"],numArgs:1,argTypes:["primitive"],handler:(i,e)=>{var t=Vs(ma(e[0]),i);return{type:"delimsizing",mode:i.parser.mode,size:Sh[i.funcName].size,mclass:Sh[i.funcName].mclass,delim:t.text}},htmlBuilder:(i,e)=>i.delim==="."?ae([i.mclass]):cd(i.delim,i.size,e,i.mode,[i.mclass]),mathmlBuilder:i=>{var e=[];i.delim!=="."&&e.push(Cn(i.delim,i.mode));var t=new le("mo",e);i.mclass==="mopen"||i.mclass==="mclose"?t.setAttribute("fence","true"):t.setAttribute("fence","false"),t.setAttribute("stretchy","true");var n=he(sa[i.size]);return t.setAttribute("minsize",n),t.setAttribute("maxsize",n),t}});function Eh(i){if(!i.body)throw new Error("Bug: The leftright ParseNode wasn't fully parsed.")}ve({type:"leftright-right",names:["\\right"],numArgs:1,primitive:!0,handler:(i,e)=>{var t=i.parser.gullet.macros.get("\\current@color");if(t&&typeof t!="string")throw new oe("\\current@color set to non-string in \\right");return{type:"leftright-right",mode:i.parser.mode,delim:Vs(e[0],i).text,color:t}}});ve({type:"leftright",names:["\\left"],numArgs:1,primitive:!0,handler:(i,e)=>{var t=Vs(e[0],i),n=i.parser;++n.leftrightDepth;var r=n.parseExpression(!1);--n.leftrightDepth,n.expect("\\right",!1);var a=Qe(n.parseFunction(),"leftright-right");return{type:"leftright",mode:n.mode,body:r,left:t.text,right:a.delim,rightColor:a.color}},htmlBuilder:(i,e)=>{Eh(i);for(var t=Gt(i.body,e,!0,["mopen","mclose"]),n=0,r=0,a=!1,s=0;s<t.length;s++){var o=t[s];wh(o)?a=!0:(n=Math.max(t[s].height,n),r=Math.max(t[s].depth,r))}n*=e.sizeMultiplier,r*=e.sizeMultiplier;var l;if(i.left==="."?l=ga(e,["mopen"]):l=Vo(i.left,n,r,e,i.mode,["mopen"]),t.unshift(l),a)for(var c=1;c<t.length;c++){var h=t[c];if(wh(h)){var u=h.isMiddle;t[c]=Vo(u.delim,n,r,u.options,i.mode,[])}}var f;if(i.right===".")f=ga(e,["mclose"]);else{var g=i.rightColor?e.withColor(i.rightColor):e;f=Vo(i.right,n,r,g,i.mode,["mclose"])}return t.push(f),ae(["minner"],t,e)},mathmlBuilder:(i,e)=>{Eh(i);var t=yn(i.body,e);if(i.left!=="."){var n=new le("mo",[Cn(i.left,i.mode)]);n.setAttribute("fence","true"),t.unshift(n)}if(i.right!=="."){var r=new le("mo",[Cn(i.right,i.mode)]);r.setAttribute("fence","true"),i.rightColor&&r.setAttribute("mathcolor",i.rightColor),t.push(r)}return Ll(t)}});ve({type:"middle",names:["\\middle"],numArgs:1,primitive:!0,handler:(i,e)=>{var t=Vs(e[0],i);if(!i.parser.leftrightDepth)throw new oe("\\middle without preceding \\left",t);return{type:"middle",mode:i.parser.mode,delim:t.text}},htmlBuilder:(i,e)=>{var t;return i.delim==="."?t=ga(e,[]):(t=cd(i.delim,1,e,i.mode,[]),t.isMiddle={delim:i.delim,options:e}),t},mathmlBuilder:(i,e)=>{var t=i.delim==="\\vert"||i.delim==="|"?Cn("|","text"):Cn(i.delim,i.mode),n=new le("mo",[t]);return n.setAttribute("fence","true"),n.setAttribute("lspace","0.05em"),n.setAttribute("rspace","0.05em"),n}});var $v=(i,e)=>{var t=Vr(ct(i.body,e),e),n=i.label.slice(1),r=e.sizeMultiplier,a,s,o=ui(i.body);if(n==="sout")a=ae(["katex-stretchy","katex-sout"]),a.height=e.fontMetrics().defaultRuleThickness/r,s=-.5*e.fontMetrics().xHeight;else if(n==="phase"){var l=Tt({number:.6,unit:"pt"},e),c=Tt({number:.35,unit:"ex"},e),h=e.havingBaseSizing();r=r/h.sizeMultiplier;var u=t.height+t.depth+l+c;t.style.paddingLeft=he(u/2+l);var f=Math.floor(1e3*u*r),g=O4(f),x=new hi([new Di("phase",g)],{width:"400em",height:he(f/1e3),viewBox:"0 0 400000 "+f,preserveAspectRatio:"xMinYMin slice"});a=Li(["hide-tail"],[x],e),a.style.height=he(u),s=t.depth+l+c}else{/cancel/.test(n)?o||t.classes.push("cancel-pad"):n==="angl"?t.classes.push("anglpad"):t.classes.push("boxpad");var _,m,p=0;/box/.test(n)?(p=Math.max(e.fontMetrics().fboxrule,e.minRuleThickness),_=e.fontMetrics().fboxsep+(n==="colorbox"?0:p),m=_):n==="angl"?(p=Math.max(e.fontMetrics().defaultRuleThickness,e.minRuleThickness),_=4*p,m=Math.max(0,.25-t.depth)):(_=o?.2:0,m=_),a=yv(t,n,_,m,e),/fbox|boxed|fcolorbox/.test(n)?(a.style.borderStyle="solid",a.style.borderWidth=he(p)):n==="angl"&&p!==.049&&(a.style.borderTopWidth=he(p),a.style.borderRightWidth=he(p)),s=t.depth+m,i.backgroundColor&&(a.style.backgroundColor=i.backgroundColor,i.borderColor&&(a.style.borderColor=i.borderColor))}var E;if(i.backgroundColor)E=dt({positionType:"individualShift",children:[{type:"elem",elem:a,shift:s},{type:"elem",elem:t,shift:0}]});else{var w=/cancel|phase/.test(n)?["svg-align"]:[];E=dt({positionType:"individualShift",children:[{type:"elem",elem:t,shift:0},{type:"elem",elem:a,shift:s,wrapperClasses:w}]})}return/cancel/.test(n)&&(E.height=t.height,E.depth=t.depth),/cancel/.test(n)&&!o?ae(["mord","cancel-lap"],[E],e):ae(["mord"],[E],e)},Yv=(i,e)=>{var t,n=new le(i.label.includes("colorbox")?"mpadded":"menclose",[_t(i.body,e)]);switch(i.label){case"\\cancel":n.setAttribute("notation","updiagonalstrike");break;case"\\bcancel":n.setAttribute("notation","downdiagonalstrike");break;case"\\phase":n.setAttribute("notation","phasorangle");break;case"\\sout":n.setAttribute("notation","horizontalstrike");break;case"\\fbox":n.setAttribute("notation","box");break;case"\\angl":n.setAttribute("notation","actuarial");break;case"\\fcolorbox":case"\\colorbox":if(t=e.fontMetrics().fboxsep*e.fontMetrics().ptPerEm,n.setAttribute("width","+"+2*t+"pt"),n.setAttribute("height","+"+2*t+"pt"),n.setAttribute("lspace",t+"pt"),n.setAttribute("voffset",t+"pt"),i.label==="\\fcolorbox"){var r=Math.max(e.fontMetrics().fboxrule,e.minRuleThickness);n.setAttribute("style","border: "+he(r)+" solid "+i.borderColor)}break;case"\\xcancel":n.setAttribute("notation","updiagonalstrike downdiagonalstrike");break}return i.backgroundColor&&n.setAttribute("mathbackground",i.backgroundColor),n};ve({type:"enclose",names:["\\colorbox"],numArgs:2,allowedInText:!0,argTypes:["color","hbox"],handler(i,e,t){var n=i.parser,r=i.funcName,a=Qe(e[0],"color-token").color,s=e[1];return{type:"enclose",mode:n.mode,label:r,backgroundColor:a,body:s}},htmlBuilder:$v,mathmlBuilder:Yv});ve({type:"enclose",names:["\\fcolorbox"],numArgs:3,allowedInText:!0,argTypes:["color","color","hbox"],handler(i,e,t){var n=i.parser,r=i.funcName,a=Qe(e[0],"color-token").color,s=Qe(e[1],"color-token").color,o=e[2];return{type:"enclose",mode:n.mode,label:r,backgroundColor:s,borderColor:a,body:o}}});ve({type:"enclose",names:["\\fbox"],numArgs:1,argTypes:["hbox"],allowedInText:!0,handler(i,e){var t=i.parser;return{type:"enclose",mode:t.mode,label:"\\fbox",body:e[0]}}});ve({type:"enclose",names:["\\cancel","\\bcancel","\\xcancel","\\phase"],numArgs:1,handler(i,e){var t=i.parser,n=i.funcName,r=e[0];return{type:"enclose",mode:t.mode,label:n,body:r}}});ve({type:"enclose",names:["\\sout"],numArgs:1,allowedInText:!0,handler(i,e){var t=i.parser,n=i.funcName;t.mode==="math"&&t.settings.reportNonstrict("mathVsSout","LaTeX's \\sout works only in text mode");var r=e[0];return{type:"enclose",mode:t.mode,label:n,body:r}}});ve({type:"enclose",names:["\\angl"],numArgs:1,argTypes:["hbox"],allowedInText:!1,handler(i,e){var t=i.parser;return{type:"enclose",mode:t.mode,label:"\\angl",body:e[0]}}});var dd={};function qn(i){for(var e=i.type,t=i.names,n=i.props,r=i.handler,a=i.htmlBuilder,s=i.mathmlBuilder,o={type:e,numArgs:n.numArgs||0,allowedInText:!1,numOptionalArgs:0,handler:r},l=0;l<t.length;++l)dd[t[l]]=o;a&&(fa[e]=a),s&&(pa[e]=s)}var fd={};function S(i,e){fd[i]=e}class cn{constructor(e,t,n){this.lexer=void 0,this.start=void 0,this.end=void 0,this.lexer=e,this.start=t,this.end=n}static range(e,t){return t?!e||!e.loc||!t.loc||e.loc.lexer!==t.loc.lexer?null:new cn(e.loc.lexer,e.loc.start,t.loc.end):e&&e.loc}}class vn{constructor(e,t){this.text=void 0,this.loc=void 0,this.noexpand=void 0,this.treatAsRelax=void 0,this.text=e,this.loc=t}range(e,t){return new vn(t,cn.range(this,e))}}function Th(i){var e=[];i.consumeSpaces();var t=i.fetch().text;for(t==="\\relax"&&(i.consume(),i.consumeSpaces(),t=i.fetch().text);t==="\\hline"||t==="\\hdashline";)i.consume(),e.push(t==="\\hdashline"),i.consumeSpaces(),t=i.fetch().text;return e}var qs=i=>{var e=i.parser.settings;if(!e.displayMode)throw new oe("{"+i.envName+"} can be used only in display mode.")},jv=new Set(["gather","gather*"]);function Fl(i){if(!i.includes("ed"))return!i.includes("*")}function Ui(i,e,t){var n=e.hskipBeforeAndAfter,r=e.addJot,a=e.cols,s=e.arraystretch,o=e.colSeparationType,l=e.autoTag,c=e.singleRow,h=e.emptySingleRow,u=e.maxNumCols,f=e.leqno;if(i.gullet.beginGroup(),c||i.gullet.macros.set("\\cr","\\\\\\relax"),!s){var g=i.gullet.expandMacroAsText("\\arraystretch");if(g==null)s=1;else if(s=parseFloat(g),!s||s<0)throw new oe("Invalid \\arraystretch: "+g)}i.gullet.beginGroup();var x=[],_=[x],m=[],p=[],E=l!=null?[]:void 0;function w(){l&&i.gullet.macros.set("\\@eqnsw","1",!0)}function C(){E&&(i.gullet.macros.get("\\df@tag")?(E.push(i.subparse([new vn("\\df@tag")])),i.gullet.macros.set("\\df@tag",void 0,!0)):E.push(!!l&&i.gullet.macros.get("\\@eqnsw")==="1"))}for(w(),p.push(Th(i));;){var F=i.parseExpression(!1,c?"\\end":"\\\\");i.gullet.endGroup(),i.gullet.beginGroup();var I={type:"ordgroup",mode:i.mode,body:F};t&&(I={type:"styling",mode:i.mode,style:t,resetFont:!0,body:[I]}),x.push(I);var P=i.fetch().text;if(P==="&"){if(u&&x.length===u){if(c||o)throw new oe("Too many tab characters: &",i.nextToken);i.settings.reportNonstrict("textEnv","Too few columns specified in the {array} column argument.")}i.consume()}else if(P==="\\end"){C(),x.length===1&&I.type==="styling"&&I.body.length===1&&I.body[0].type==="ordgroup"&&I.body[0].body.length===0&&(_.length>1||!h)&&!Array.isArray(E==null?void 0:E[E.length-1])&&!(l&&(E==null?void 0:E[E.length-1])===!0)&&_.pop(),p.length<_.length+1&&p.push([]);break}else if(P==="\\\\"){i.consume();var B=void 0;i.gullet.future().text!==" "&&(B=i.parseSizeGroup(!0)),m.push(B?B.value:null),C(),p.push(Th(i)),x=[],_.push(x),w()}else throw new oe("Expected & or \\\\ or \\cr or \\end",i.nextToken)}return i.gullet.endGroup(),i.gullet.endGroup(),{type:"array",mode:i.mode,addJot:r,arraystretch:s,body:_,cols:a,rowGaps:m,hskipBeforeAndAfter:n,hLinesBeforeRow:p,colSeparationType:o,tags:E,leqno:f}}function Ol(i){return i.slice(0,1)==="d"?"display":"text"}var Wn=function(e,t){var n,r,a=e.body.length,s=e.hLinesBeforeRow,o=0,l=new Array(a),c=[],h=Math.max(t.fontMetrics().arrayRuleWidth,t.minRuleThickness),u=1/t.fontMetrics().ptPerEm,f=5*u;if(e.colSeparationType&&e.colSeparationType==="small"){var g=t.havingStyle(Xe.SCRIPT).sizeMultiplier;f=.2778*(g/t.sizeMultiplier)}var x=e.colSeparationType==="CD"?Tt({number:3,unit:"ex"},t):12*u,_=3*u,m=e.arraystretch*x,p=.7*m,E=.3*m,w=0;function C(_e){for(var tt=0;tt<_e.length;++tt)tt>0&&(w+=.25),c.push({pos:w,isDashed:_e[tt]})}for(C(s[0]),n=0;n<e.body.length;++n){var F=e.body[n],I=p,P=E;o<F.length&&(o=F.length);var B={cells:new Array(F.length),height:0,depth:0,pos:0};for(r=0;r<F.length;++r){var ee=ct(F[r],t);P<ee.depth&&(P=ee.depth),I<ee.height&&(I=ee.height),B.cells[r]=ee}var b=e.rowGaps[n],A=0;b&&(A=Tt(b,t),A>0&&(A+=E,P<A&&(P=A),A=0)),e.addJot&&n<e.body.length-1&&(P+=_),B.height=I,B.depth=P,w+=I,B.pos=w,w+=P+A,l[n]=B,C(s[n+1])}var W=w/2+t.fontMetrics().axisHeight,X=e.cols||[],K=[],te,$,ne=[];if(e.tags&&e.tags.some(_e=>_e))for(n=0;n<a;++n){var Y=l[n],Se=Y.pos-W,ge=e.tags[n],we=void 0;ge===!0?we=ae(["eqn-num"],[],t):ge===!1?we=ae([],[],t):we=ae([],Gt(ge,t,!0),t),we.depth=Y.depth,we.height=Y.height,ne.push({type:"elem",elem:we,shift:Se})}for(r=0,$=0;r<o||$<X.length;++r,++$){for(var et,je=X[$],Z=!0;((ce=je)==null?void 0:ce.type)==="separator";){var ce;if(Z||(te=ae(["arraycolsep"],[]),te.style.width=he(t.fontMetrics().doubleRuleSep),K.push(te)),je.separator==="|"||je.separator===":"){var Re=je.separator==="|"?"solid":"dashed",xe=ae(["vertical-separator"],[],t);xe.style.height=he(w),xe.style.borderRightWidth=he(h),xe.style.borderRightStyle=Re,xe.style.margin="0 "+he(-h/2);var Ge=w-W;Ge&&(xe.style.verticalAlign=he(-Ge)),K.push(xe)}else throw new oe("Invalid separator type: "+je.separator);$++,je=X[$],Z=!1}if(!(r>=o)){var Ue=void 0;if(r>0||e.hskipBeforeAndAfter){var nt,ht;Ue=(nt=(ht=je)==null?void 0:ht.pregap)!=null?nt:f,Ue!==0&&(te=ae(["arraycolsep"],[]),te.style.width=he(Ue),K.push(te))}var it=[];for(n=0;n<a;++n){var N=l[n],Vt=N.cells[r];if(Vt){var rt=N.pos-W;Vt.depth=N.depth,Vt.height=N.height,it.push({type:"elem",elem:Vt,shift:rt})}}var st=dt({positionType:"individualShift",children:it}),ke=ae(["col-align-"+(((et=je)==null?void 0:et.align)||"c")],[st]);if(K.push(ke),r<o-1||e.hskipBeforeAndAfter){var vt,Be;Ue=(vt=(Be=je)==null?void 0:Be.postgap)!=null?vt:f,Ue!==0&&(te=ae(["arraycolsep"],[]),te.style.width=he(Ue),K.push(te))}}}var R=ae(["mtable"],K);if(c.length>0){for(var M=Gr("katex-hline",t,h),G=Gr("katex-hdashline",t,h),J=[{type:"elem",elem:R,shift:0}];c.length>0;){var se=c.pop(),Q=se.pos-W;se.isDashed?J.push({type:"elem",elem:G,shift:Q}):J.push({type:"elem",elem:M,shift:Q})}R=dt({positionType:"individualShift",children:J})}if(ne.length===0)return ae(["mord"],[R],t);var Le=dt({positionType:"individualShift",children:ne}),pe=ae(["katex-tag"],[Le],t);return fi([R,pe])},Kv={c:"center ",l:"left ",r:"right "},Xn=function(e,t){for(var n=[],r=new le("mtd",[],["mtr-glue"]),a=new le("mtd",[],["mml-eqn-num"]),s=0;s<e.body.length;s++){for(var o=e.body[s],l=[],c=0;c<o.length;c++)l.push(new le("mtd",[_t(o[c],t)]));e.tags&&e.tags[s]&&(l.unshift(r),l.push(r),e.leqno?l.unshift(a):l.push(a)),n.push(new le("mtr",l))}var h=new le("mtable",n),u=e.arraystretch===.5?.1:.16+e.arraystretch-1+(e.addJot?.09:0);h.setAttribute("rowspacing",he(u));var f="",g="";if(e.cols&&e.cols.length>0){var x=e.cols,_="",m=!1,p=0,E=x.length;x[0].type==="separator"&&(f+="top ",p=1),x[x.length-1].type==="separator"&&(f+="bottom ",E-=1);for(var w=p;w<E;w++){var C=x[w];C.type==="align"?(g+=Kv[C.align],m&&(_+="none "),m=!0):C.type==="separator"&&m&&(_+=C.separator==="|"?"solid ":"dashed ",m=!1)}h.setAttribute("columnalign",g.trim()),/[sd]/.test(_)&&h.setAttribute("columnlines",_.trim())}if(e.colSeparationType==="align"){for(var F=e.cols||[],I="",P=1;P<F.length;P++)I+=P%2?"0em ":"1em ";h.setAttribute("columnspacing",I.trim())}else e.colSeparationType==="alignat"||e.colSeparationType==="gather"?h.setAttribute("columnspacing","0em"):e.colSeparationType==="small"?h.setAttribute("columnspacing","0.2778em"):e.colSeparationType==="CD"?h.setAttribute("columnspacing","0.5em"):h.setAttribute("columnspacing","1em");var B="",ee=e.hLinesBeforeRow;f+=ee[0].length>0?"left ":"",f+=ee[ee.length-1].length>0?"right ":"";for(var b=1;b<ee.length-1;b++)B+=ee[b].length===0?"none ":ee[b][0]?"dashed ":"solid ";return/[sd]/.test(B)&&h.setAttribute("rowlines",B.trim()),f!==""&&(h=new le("menclose",[h]),h.setAttribute("notation",f.trim())),e.arraystretch&&e.arraystretch<1&&(h=new le("mstyle",[h]),h.setAttribute("scriptlevel","1")),h},pd=function(e,t){e.envName.includes("ed")||qs(e);var n=[],r=e.envName==="split",a=Ui(e.parser,{cols:n,addJot:!0,autoTag:r?void 0:Fl(e.envName),emptySingleRow:!0,colSeparationType:e.envName.includes("at")?"alignat":"align",maxNumCols:r?2:void 0,leqno:e.parser.settings.leqno},"display"),s=0,o=0,l={type:"ordgroup",mode:e.mode,body:[]};if(t[0]&&t[0].type==="ordgroup"){var c="Number of columns should be a positive integer",h=Nl(t[0],c);if(!/^[0-9]+$/.test(h)||Number(h)<1)throw new oe(c,t[0]);s=Number(h),o=s*2}var u=!o;a.body.forEach(function(_){for(var m=1;m<_.length;m+=2){var p=Qe(_[m],"styling"),E=Qe(p.body[0],"ordgroup");E.body.unshift(l)}if(u)o<_.length&&(o=_.length);else{var w=_.length/2;if(s<w)throw new oe("Too many math in a row: "+("expected "+s+", but got "+w),_[0])}});for(var f=0;f<o;++f){var g="r",x=0;f%2===1?g="l":f>0&&u&&(x=1),n[f]={type:"align",align:g,pregap:x,postgap:0}}return a.colSeparationType=u?"align":"alignat",a};qn({type:"array",names:["array","darray"],props:{numArgs:1},handler(i,e){var t=Hs(e[0]),n=t?[e[0]]:Qe(e[0],"ordgroup").body,r=n.map(function(s){var o=zs(s),l=o.text;if("lcr".includes(l))return{type:"align",align:l};if(l==="|")return{type:"separator",separator:"|"};if(l===":")return{type:"separator",separator:":"};throw new oe("Unknown column alignment: "+l,s)}),a={cols:r,hskipBeforeAndAfter:!0,maxNumCols:r.length};return Ui(i.parser,a,Ol(i.envName))},htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["matrix","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix","matrix*","pmatrix*","bmatrix*","Bmatrix*","vmatrix*","Vmatrix*"],props:{numArgs:0},handler(i){var e={matrix:null,pmatrix:["(",")"],bmatrix:["[","]"],Bmatrix:["\\{","\\}"],vmatrix:["|","|"],Vmatrix:["\\Vert","\\Vert"]}[i.envName.replace("*","")],t="c",n={hskipBeforeAndAfter:!1,cols:[{type:"align",align:t}]};if(i.envName.charAt(i.envName.length-1)==="*"){var r=i.parser;if(r.consumeSpaces(),r.fetch().text==="["){if(r.consume(),r.consumeSpaces(),t=r.fetch().text,!"lcr".includes(t))throw new oe("Expected l or c or r",r.nextToken);r.consume(),r.consumeSpaces(),r.expect("]"),r.consume(),n.cols=[{type:"align",align:t}]}}var a=Ui(i.parser,n,Ol(i.envName)),s=Math.max(0,...a.body.map(o=>o.length));return a.cols=new Array(s).fill({type:"align",align:t}),e?{type:"leftright",mode:i.mode,body:[a],left:e[0],right:e[1],rightColor:void 0}:a},htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["smallmatrix"],props:{numArgs:0},handler(i){var e={arraystretch:.5},t=Ui(i.parser,e,"script");return t.colSeparationType="small",t},htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["subarray"],props:{numArgs:1},handler(i,e){var t=Hs(e[0]),n=t?[e[0]]:Qe(e[0],"ordgroup").body,r=n.map(function(o){var l=zs(o),c=l.text;if("lc".includes(c))return{type:"align",align:c};throw new oe("Unknown column alignment: "+c,o)});if(r.length>1)throw new oe("{subarray} can contain only one column");var a={cols:r,hskipBeforeAndAfter:!1,arraystretch:.5},s=Ui(i.parser,a,"script");if(s.body.length>0&&s.body[0].length>1)throw new oe("{subarray} can contain only one column");return s},htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["cases","dcases","rcases","drcases"],props:{numArgs:0},handler(i){var e={arraystretch:1.2,cols:[{type:"align",align:"l",pregap:0,postgap:1},{type:"align",align:"l",pregap:0,postgap:0}]},t=Ui(i.parser,e,Ol(i.envName));return{type:"leftright",mode:i.mode,body:[t],left:i.envName.includes("r")?".":"\\{",right:i.envName.includes("r")?"\\}":".",rightColor:void 0}},htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["align","align*","aligned","split"],props:{numArgs:0},handler:pd,htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["gathered","gather","gather*"],props:{numArgs:0},handler(i){jv.has(i.envName)&&qs(i);var e={cols:[{type:"align",align:"c"}],addJot:!0,colSeparationType:"gather",autoTag:Fl(i.envName),emptySingleRow:!0,leqno:i.parser.settings.leqno};return Ui(i.parser,e,"display")},htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["alignat","alignat*","alignedat"],props:{numArgs:1},handler:pd,htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["equation","equation*"],props:{numArgs:0},handler(i){qs(i);var e={autoTag:Fl(i.envName),emptySingleRow:!0,singleRow:!0,maxNumCols:1,leqno:i.parser.settings.leqno};return Ui(i.parser,e,"display")},htmlBuilder:Wn,mathmlBuilder:Xn});qn({type:"array",names:["CD"],props:{numArgs:0},handler(i){return qs(i),Iv(i.parser)},htmlBuilder:Wn,mathmlBuilder:Xn});S("\\nonumber","\\gdef\\@eqnsw{0}");S("\\notag","\\nonumber");ve({type:"text",names:["\\hline","\\hdashline"],numArgs:0,allowedInText:!0,allowedInMath:!0,handler(i,e){throw new oe(i.funcName+" valid only within array environment")}});var Ah=dd;ve({type:"environment",names:["\\begin","\\end"],numArgs:1,argTypes:["text"],handler(i,e){var t=i.parser,n=i.funcName,r=e[0];if(r.type!=="ordgroup")throw new oe("Invalid environment name",r);var a=Nl(r,"Environment name should contain only text characters and spaces",!0);if(n==="\\begin"){if(!Object.prototype.hasOwnProperty.call(Ah,a))throw new oe("No such environment: "+a,r);var s=Ah[a],o=t.parseArguments("\\begin{"+a+"}",s),l=o.args,c=o.optArgs,h={mode:t.mode,envName:a,parser:t},u=s.handler(h,l,c);t.expect("\\end",!1);var f=t.nextToken,g=Qe(t.parseFunction(),"environment");if(g.name!==a)throw new oe("Mismatch: \\begin{"+a+"} matched by \\end{"+g.name+"}",f);return u}return{type:"environment",mode:t.mode,name:a,nameGroup:r}}});var Zv=(i,e)=>{var t=i.font,n=e.withFont(t);return ct(i.body,n)},Jv=(i,e)=>{var t=i.font,n=e.withFont(t);return _t(i.body,n)},Ch={"\\Bbb":"\\mathbb","\\bold":"\\mathbf","\\frak":"\\mathfrak"};ve({type:"font",names:["\\mathrm","\\mathit","\\mathbf","\\mathnormal","\\mathsfit","\\mathbb","\\mathcal","\\mathfrak","\\mathscr","\\mathsf","\\mathtt","\\Bbb","\\bold","\\frak"],numArgs:1,allowedInArgument:!0,handler:(i,e)=>{var t=i.parser,n=i.funcName,r=ma(e[0]),a=n in Ch?Ch[n]:n;return{type:"font",mode:t.mode,font:a.slice(1),body:r}},htmlBuilder:Zv,mathmlBuilder:Jv});ve({type:"mclass",names:["\\boldsymbol","\\bm"],numArgs:1,handler:(i,e)=>{var t=i.parser,n=e[0];return{type:"mclass",mode:t.mode,mclass:Gs(n),body:[{type:"font",mode:t.mode,font:"boldsymbol",body:n}],isCharacterBox:ui(n)}}});ve({type:"font",names:["\\rm","\\sf","\\tt","\\bf","\\it","\\cal"],numArgs:0,allowedInText:!0,handler:(i,e)=>{var t=i.parser,n=i.funcName,r=i.breakOnTokenText,a=t.mode,s=t.parseExpression(!0,r);return{type:"font",mode:a,font:"math"+n.slice(1),body:{type:"ordgroup",mode:t.mode,body:s}}}});var Qv=(i,e)=>{var t=e.style,n=t.fracNum(),r=t.fracDen(),a;a=e.havingStyle(n);var s=ct(i.numer,a,e);if(i.continued){var o=8.5/e.fontMetrics().ptPerEm,l=3.5/e.fontMetrics().ptPerEm;s.height=s.height<o?o:s.height,s.depth=s.depth<l?l:s.depth}a=e.havingStyle(r);var c=ct(i.denom,a,e),h,u,f;i.hasBarLine?(i.barSize?(u=Tt(i.barSize,e),h=Gr("frac-line",e,u)):h=Gr("frac-line",e),u=h.height,f=h.height):(h=null,u=0,f=e.fontMetrics().defaultRuleThickness);var g,x,_;t.size===Xe.DISPLAY.size?(g=e.fontMetrics().num1,u>0?x=3*f:x=7*f,_=e.fontMetrics().denom1):(u>0?(g=e.fontMetrics().num2,x=f):(g=e.fontMetrics().num3,x=3*f),_=e.fontMetrics().denom2);var m;if(h){var E=e.fontMetrics().axisHeight;g-s.depth-(E+.5*u)<x&&(g+=x-(g-s.depth-(E+.5*u))),E-.5*u-(c.height-_)<x&&(_+=x-(E-.5*u-(c.height-_)));var w=-(E-.5*u);m=dt({positionType:"individualShift",children:[{type:"elem",elem:c,shift:_},{type:"elem",elem:h,shift:w},{type:"elem",elem:s,shift:-g}]})}else{var p=g-s.depth-(c.height-_);p<x&&(g+=.5*(x-p),_+=.5*(x-p)),m=dt({positionType:"individualShift",children:[{type:"elem",elem:c,shift:_},{type:"elem",elem:s,shift:-g}]})}a=e.havingStyle(t),m.height*=a.sizeMultiplier/e.sizeMultiplier,m.depth*=a.sizeMultiplier/e.sizeMultiplier;var C;t.size===Xe.DISPLAY.size?C=e.fontMetrics().delim1:t.size===Xe.SCRIPTSCRIPT.size?C=e.havingStyle(Xe.SCRIPT).fontMetrics().delim2:C=e.fontMetrics().delim2;var F,I;return i.leftDelim==null?F=ga(e,["mopen"]):F=sl(i.leftDelim,C,!0,e.havingStyle(t),i.mode,["mopen"]),i.continued?I=ae([]):i.rightDelim==null?I=ga(e,["mclose"]):I=sl(i.rightDelim,C,!0,e.havingStyle(t),i.mode,["mclose"]),ae(["mord"].concat(a.sizingClasses(e)),[F,ae(["mfrac"],[m]),I],e)},e3=(i,e)=>{var t=new le("mfrac",[_t(i.numer,e),_t(i.denom,e)]);if(!i.hasBarLine)t.setAttribute("linethickness","0px");else if(i.barSize){var n=Tt(i.barSize,e);t.setAttribute("linethickness",he(n))}if(i.leftDelim!=null||i.rightDelim!=null){var r=[];if(i.leftDelim!=null){var a=new le("mo",[new Ut(i.leftDelim.replace("\\",""))]);a.setAttribute("fence","true"),r.push(a)}if(r.push(t),i.rightDelim!=null){var s=new le("mo",[new Ut(i.rightDelim.replace("\\",""))]);s.setAttribute("fence","true"),r.push(s)}return Ll(r)}return t},md=(i,e)=>{if(!e)return i;var t={type:"styling",mode:i.mode,style:e,body:[i]};return t};ve({type:"genfrac",names:["\\cfrac","\\dfrac","\\frac","\\tfrac","\\dbinom","\\binom","\\tbinom","\\\\atopfrac","\\\\bracefrac","\\\\brackfrac"],numArgs:2,allowedInArgument:!0,handler:(i,e)=>{var t=i.parser,n=i.funcName,r=e[0],a=e[1],s,o=null,l=null;switch(n){case"\\cfrac":case"\\dfrac":case"\\frac":case"\\tfrac":s=!0;break;case"\\\\atopfrac":s=!1;break;case"\\dbinom":case"\\binom":case"\\tbinom":s=!1,o="(",l=")";break;case"\\\\bracefrac":s=!1,o="\\{",l="\\}";break;case"\\\\brackfrac":s=!1,o="[",l="]";break;default:throw new Error("Unrecognized genfrac command")}var c=n==="\\cfrac",h=null;return c||n.startsWith("\\d")?h="display":n.startsWith("\\t")&&(h="text"),md({type:"genfrac",mode:t.mode,numer:r,denom:a,continued:c,hasBarLine:s,leftDelim:o,rightDelim:l,barSize:null},h)},htmlBuilder:Qv,mathmlBuilder:e3});ve({type:"infix",names:["\\over","\\choose","\\atop","\\brace","\\brack"],numArgs:0,infix:!0,handler(i){var e=i.parser,t=i.funcName,n=i.token,r;switch(t){case"\\over":r="\\frac";break;case"\\choose":r="\\binom";break;case"\\atop":r="\\\\atopfrac";break;case"\\brace":r="\\\\bracefrac";break;case"\\brack":r="\\\\brackfrac";break;default:throw new Error("Unrecognized infix genfrac command")}return{type:"infix",mode:e.mode,replaceWith:r,token:n}}});var Rh=["display","text","script","scriptscript"],Ph=function(e){var t=null;return e.length>0&&(t=e,t=t==="."?null:t),t};ve({type:"genfrac",names:["\\genfrac"],numArgs:6,allowedInArgument:!0,argTypes:["math","math","size","text","math","math"],handler(i,e){var t=i.parser,n=e[4],r=e[5],a=ma(e[0]),s=a.type==="atom"&&a.family==="open"?Ph(a.text):null,o=ma(e[1]),l=o.type==="atom"&&o.family==="close"?Ph(o.text):null,c=Qe(e[2],"size"),h,u=null;c.isBlank?h=!0:(u=c.value,h=u.number>0);var f=null,g=e[3];if(g.type==="ordgroup"){if(g.body.length>0){var x=Qe(g.body[0],"textord");f=Rh[Number(x.text)]}}else g=Qe(g,"textord"),f=Rh[Number(g.text)];return md({type:"genfrac",mode:t.mode,numer:n,denom:r,continued:!1,hasBarLine:h,barSize:u,leftDelim:s,rightDelim:l},f)}});ve({type:"infix",names:["\\above"],numArgs:1,argTypes:["size"],infix:!0,handler(i,e){var t=i.parser;i.funcName;var n=i.token;return{type:"infix",mode:t.mode,replaceWith:"\\\\abovefrac",size:Qe(e[0],"size").value,token:n}}});ve({type:"genfrac",names:["\\\\abovefrac"],numArgs:3,argTypes:["math","size","math"],handler:(i,e)=>{var t=i.parser;i.funcName;var n=e[0],r=Qe(e[1],"infix").size;if(!r)throw new Error("\\\\abovefrac expected size, but got "+String(r));var a=e[2],s=r.number>0;return{type:"genfrac",mode:t.mode,numer:n,denom:a,continued:!1,hasBarLine:s,barSize:r,leftDelim:null,rightDelim:null}}});var gd=(i,e)=>{var t=e.style,n,r;i.type==="supsub"?(n=i.sup?ct(i.sup,e.havingStyle(t.sup()),e):ct(i.sub,e.havingStyle(t.sub()),e),r=Qe(i.base,"horizBrace")):r=Qe(i,"horizBrace");var a=ct(r.base,e.havingBaseStyle(Xe.DISPLAY)),s=Bs(r,e),o;if(r.isOver?o=dt({positionType:"firstBaseline",children:[{type:"elem",elem:a},{type:"kern",size:.1},{type:"elem",elem:s,wrapperClasses:["svg-align"]}]}):o=dt({positionType:"bottom",positionData:a.depth+.1+s.height,children:[{type:"elem",elem:s,wrapperClasses:["svg-align"]},{type:"kern",size:.1},{type:"elem",elem:a}]}),n){var l=ae(["minner",r.isOver?"mover":"munder"],[o],e);r.isOver?o=dt({positionType:"firstBaseline",children:[{type:"elem",elem:l},{type:"kern",size:.2},{type:"elem",elem:n}]}):o=dt({positionType:"bottom",positionData:l.depth+.2+n.height+n.depth,children:[{type:"elem",elem:n},{type:"kern",size:.2},{type:"elem",elem:l}]})}return ae(["minner",r.isOver?"mover":"munder"],[o],e)},t3=(i,e)=>{var t=ks(i.label);return new le(i.isOver?"mover":"munder",[_t(i.base,e),t])};ve({type:"horizBrace",names:["\\overbrace","\\underbrace","\\overbracket","\\underbracket"],numArgs:1,handler(i,e){var t=i.parser,n=i.funcName;return{type:"horizBrace",mode:t.mode,label:n,isOver:n.includes("\\over"),base:e[0]}},htmlBuilder:gd,mathmlBuilder:t3});ve({type:"href",names:["\\href"],numArgs:2,argTypes:["url","original"],allowedInText:!0,handler:(i,e)=>{var t=i.parser,n=e[1],r=Qe(e[0],"url").url;return t.settings.isTrusted({command:"\\href",url:r})?{type:"href",mode:t.mode,href:r,body:Nt(n)}:t.formatUnsupportedCmd("\\href")},htmlBuilder:(i,e)=>{var t=Gt(i.body,e,!1);return iv(i.href,[],t,e)},mathmlBuilder:(i,e)=>{var t=Ii(i.body,e);return t instanceof le||(t=new le("mrow",[t])),t.setAttribute("href",i.href),t}});ve({type:"href",names:["\\url"],numArgs:1,argTypes:["url"],allowedInText:!0,handler:(i,e)=>{var t=i.parser,n=Qe(e[0],"url").url;if(!t.settings.isTrusted({command:"\\url",url:n}))return t.formatUnsupportedCmd("\\url");for(var r=[],a=0;a<n.length;a++){var s=n[a];s==="~"&&(s="\\textasciitilde"),r.push({type:"textord",mode:"text",text:s})}var o={type:"text",mode:t.mode,font:"\\texttt",body:r};return{type:"href",mode:t.mode,href:n,body:Nt(o)}}});ve({type:"hbox",names:["\\hbox"],numArgs:1,argTypes:["text"],allowedInText:!0,primitive:!0,handler(i,e){var t=i.parser;return{type:"hbox",mode:t.mode,body:Nt(e[0])}},htmlBuilder(i,e){var t=Gt(i.body,e.withFont(""),!1);return fi(t)},mathmlBuilder(i,e){return new le("mrow",yn(i.body,e.withFont("")))}});ve({type:"html",names:["\\htmlClass","\\htmlId","\\htmlStyle","\\htmlData"],numArgs:2,argTypes:["raw","original"],allowedInText:!0,handler:(i,e)=>{var t=i.parser,n=i.funcName;i.token;var r=Qe(e[0],"raw").string,a=e[1];t.settings.strict&&t.settings.reportNonstrict("htmlExtension","HTML extension is disabled on strict mode");var s,o={};switch(n){case"\\htmlClass":o.class=r,s={command:"\\htmlClass",class:r};break;case"\\htmlId":o.id=r,s={command:"\\htmlId",id:r};break;case"\\htmlStyle":o.style=r,s={command:"\\htmlStyle",style:r};break;case"\\htmlData":{for(var l="{,}",c=[],h="",u=0;u<r.length;u++)r.startsWith(l,u)?(h+=",",u+=l.length-1):r[u]===","?(c.push(h),h=""):h+=r[u];c.push(h);for(var f=0;f<c.length;f++){var g=c[f],x=g.indexOf("=");if(x<0)throw new oe("\\htmlData key/value '"+g+"' missing equals sign");var _=g.slice(0,x),m=g.slice(x+1);o["data-"+_.trim()]=m}s={command:"\\htmlData",attributes:o};break}default:throw new Error("Unrecognized html command")}return t.settings.isTrusted(s)?{type:"html",mode:t.mode,attributes:o,body:Nt(a)}:t.formatUnsupportedCmd(n)},htmlBuilder:(i,e)=>{var t=Gt(i.body,e,!1),n=["enclosing"];i.attributes.class&&n.push(...i.attributes.class.trim().split(/\s+/));var r=ae(n,t,e);for(var a of Object.entries(i.attributes)){var s=a[0],o=a[1];s!=="class"&&r.setAttribute(s,o)}return r},mathmlBuilder:(i,e)=>Ii(i.body,e)});ve({type:"htmlmathml",names:["\\html@mathml"],numArgs:2,allowedInArgument:!0,allowedInText:!0,handler:(i,e)=>{var t=i.parser;return{type:"htmlmathml",mode:t.mode,html:Nt(e[0]),mathml:Nt(e[1])}},htmlBuilder:(i,e)=>{var t=Gt(i.html,e,!1);return fi(t)},mathmlBuilder:(i,e)=>Ii(i.mathml,e)});var qo=function(e){if(/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e))return{number:+e,unit:"bp"};var t=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);if(!t)throw new oe("Invalid size: '"+e+"' in \\includegraphics");var n={number:+(t[1]+t[2]),unit:t[3]};if(!Bu(n))throw new oe("Invalid unit: '"+n.unit+"' in \\includegraphics.");return n};ve({type:"includegraphics",names:["\\includegraphics"],numArgs:1,numOptionalArgs:1,argTypes:["raw","url"],allowedInText:!1,handler:(i,e,t)=>{var n=i.parser,r={number:0,unit:"em"},a={number:.9,unit:"em"},s={number:0,unit:"em"},o="";if(t[0])for(var l=Qe(t[0],"raw").string,c=l.split(","),h=0;h<c.length;h++){var u=c[h].split("=");if(u.length===2){var f=u[1].trim();switch(u[0].trim()){case"alt":o=f;break;case"width":r=qo(f);break;case"height":a=qo(f);break;case"totalheight":s=qo(f);break;default:throw new oe("Invalid key: '"+u[0]+"' in \\includegraphics.")}}}var g=Qe(e[0],"url").url;return o===""&&(o=g,o=o.replace(/^.*[\\/]/,""),o=o.substring(0,o.lastIndexOf("."))),n.settings.isTrusted({command:"\\includegraphics",url:g})?{type:"includegraphics",mode:n.mode,alt:o,width:r,height:a,totalheight:s,src:g}:n.formatUnsupportedCmd("\\includegraphics")},htmlBuilder:(i,e)=>{var t=Tt(i.height,e),n=0;i.totalheight.number>0&&(n=Tt(i.totalheight,e)-t);var r=0;i.width.number>0&&(r=Tt(i.width,e));var a={height:he(t+n)};r>0&&(a.width=he(r)),n>0&&(a.verticalAlign=he(-n));var s=new W4(i.src,i.alt,a);return s.height=t,s.depth=n,s},mathmlBuilder:(i,e)=>{var t=new le("mglyph",[]);t.setAttribute("alt",i.alt);var n=Tt(i.height,e),r=0;if(i.totalheight.number>0&&(r=Tt(i.totalheight,e)-n,t.setAttribute("valign",he(-r))),t.setAttribute("height",he(n+r)),i.width.number>0){var a=Tt(i.width,e);t.setAttribute("width",he(a))}return t.setAttribute("src",i.src),t}});ve({type:"kern",names:["\\kern","\\mkern","\\hskip","\\mskip"],numArgs:1,argTypes:["size"],primitive:!0,allowedInText:!0,handler(i,e){var t=i.parser,n=i.funcName,r=Qe(e[0],"size");if(t.settings.strict){var a=n[1]==="m",s=r.value.unit==="mu";a?(s||t.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" supports only mu units, "+("not "+r.value.unit+" units")),t.mode!=="math"&&t.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" works only in math mode")):s&&t.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" doesn't support mu units")}return{type:"kern",mode:t.mode,dimension:r.value}},htmlBuilder(i,e){return Wu(i.dimension,e)},mathmlBuilder(i,e){var t=Tt(i.dimension,e);return new Zu(t)}});ve({type:"lap",names:["\\mathllap","\\mathrlap","\\mathclap"],numArgs:1,allowedInText:!0,handler:(i,e)=>{var t=i.parser,n=i.funcName,r=e[0];return{type:"lap",mode:t.mode,alignment:n.slice(5),body:r}},htmlBuilder:(i,e)=>{var t;i.alignment==="clap"?(t=ae([],[ct(i.body,e)]),t=ae(["katex-inner"],[t],e)):t=ae(["katex-inner"],[ct(i.body,e)]);var n=ae(["katex-fix"],[]),r=ae([i.alignment],[t,n],e),a=ae(["katex-strut"]);return a.style.height=he(r.height+r.depth),r.depth&&(a.style.verticalAlign=he(-r.depth)),r.children.unshift(a),r=ae(["katex-thinbox"],[r],e),ae(["mord","katex-vbox"],[r],e)},mathmlBuilder:(i,e)=>{var t=new le("mpadded",[_t(i.body,e)]);if(i.alignment!=="rlap"){var n=i.alignment==="llap"?"-1":"-0.5";t.setAttribute("lspace",n+"width")}return t.setAttribute("width","0px"),t}});ve({type:"styling",names:["\\(","$"],numArgs:0,allowedInText:!0,allowedInMath:!1,handler(i,e){var t=i.funcName,n=i.parser,r=n.mode;n.switchMode("math");var a=t==="\\("?"\\)":"$",s=n.parseExpression(!1,a);return n.expect(a),n.switchMode(r),{type:"styling",mode:n.mode,style:"text",resetFont:!0,body:s}}});ve({type:"text",names:["\\)","\\]"],numArgs:0,allowedInText:!0,allowedInMath:!1,handler(i,e){throw new oe("Mismatched "+i.funcName)}});var Dh=(i,e)=>{switch(e.style.size){case Xe.DISPLAY.size:return i.display;case Xe.TEXT.size:return i.text;case Xe.SCRIPT.size:return i.script;case Xe.SCRIPTSCRIPT.size:return i.scriptscript;default:return i.text}};ve({type:"mathchoice",names:["\\mathchoice"],numArgs:4,primitive:!0,handler:(i,e)=>{var t=i.parser;return{type:"mathchoice",mode:t.mode,display:Nt(e[0]),text:Nt(e[1]),script:Nt(e[2]),scriptscript:Nt(e[3])}},htmlBuilder:(i,e)=>{var t=Dh(i,e),n=Gt(t,e,!1);return fi(n)},mathmlBuilder:(i,e)=>{var t=Dh(i,e);return Ii(t,e)}});var vd=(i,e,t,n,r,a,s)=>{i=ae([],[i]);var o=t&&ui(t),l,c;if(e){var h=ct(e,n.havingStyle(r.sup()),n);c={elem:h,kern:Math.max(n.fontMetrics().bigOpSpacing1,n.fontMetrics().bigOpSpacing3-h.depth)}}if(t){var u=ct(t,n.havingStyle(r.sub()),n);l={elem:u,kern:Math.max(n.fontMetrics().bigOpSpacing2,n.fontMetrics().bigOpSpacing4-u.height)}}var f;if(c&&l){var g=n.fontMetrics().bigOpSpacing5+l.elem.height+l.elem.depth+l.kern+i.depth+s;f=dt({positionType:"bottom",positionData:g,children:[{type:"kern",size:n.fontMetrics().bigOpSpacing5},{type:"elem",elem:l.elem,marginLeft:he(-a)},{type:"kern",size:l.kern},{type:"elem",elem:i},{type:"kern",size:c.kern},{type:"elem",elem:c.elem,marginLeft:he(a)},{type:"kern",size:n.fontMetrics().bigOpSpacing5}]})}else if(l){var x=i.height-s;f=dt({positionType:"top",positionData:x,children:[{type:"kern",size:n.fontMetrics().bigOpSpacing5},{type:"elem",elem:l.elem,marginLeft:he(-a)},{type:"kern",size:l.kern},{type:"elem",elem:i}]})}else if(c){var _=i.depth+s;f=dt({positionType:"bottom",positionData:_,children:[{type:"elem",elem:i},{type:"kern",size:c.kern},{type:"elem",elem:c.elem,marginLeft:he(a)},{type:"kern",size:n.fontMetrics().bigOpSpacing5}]})}else return i;var m=[f];if(l&&a!==0&&!o){var p=ae(["mspace"],[],n);p.style.marginRight=he(a),m.unshift(p)}return ae(["mop","op-limits"],m,n)},xd=new Set(["\\smallint"]),_d=(i,e)=>{var t,n,r=!1,a;i.type==="supsub"?(t=i.sup,n=i.sub,a=Qe(i.base,"op"),r=!0):a=Qe(i,"op");var s=e.style,o=!1;s.size===Xe.DISPLAY.size&&a.symbol&&!xd.has(a.name)&&(o=!0);var l,c;if(a.symbol){var h=o?"Size2-Regular":"Size1-Regular",u="";if((a.name==="\\oiint"||a.name==="\\oiiint")&&(u=a.name.slice(1),a.name=u==="oiint"?"\\iint":"\\iiint"),l=Qt(a.name,h,"math",e,["mop","op-symbol",o?"large-op":"small-op"]),c=l.italic,u.length>0){var f=$u(u+"Size"+(o?"2":"1"),e);l=dt({positionType:"individualShift",children:[{type:"elem",elem:l,shift:0},{type:"elem",elem:f,shift:o?.08:0}]}),a.name="\\"+u,l.classes.unshift("mop"),l.italic=c}}else if(a.body){var g=Gt(a.body,e,!0);g.length===1&&g[0]instanceof xn?(l=g[0],l.classes[0]="mop"):l=ae(["mop"],g,e)}else{for(var x=[],_=1;_<a.name.length;_++)x.push(Pl(a.name[_],a.mode,e));l=ae(["mop"],x,e)}var m=0,p=0;if((l instanceof xn||a.name==="\\oiint"||a.name==="\\oiiint")&&!a.suppressBaseShift){var E;m=(l.height-l.depth)/2-e.fontMetrics().axisHeight,p=(E=l.italic)!=null?E:0}return r?vd(l,t,n,e,s,p,m):(m&&(l.style.position="relative",l.style.top=he(m)),l)},n3=(i,e)=>{var t;if(i.symbol)t=new le("mo",[Cn(i.name,i.mode)]),xd.has(i.name)&&t.setAttribute("largeop","false");else if(i.body)t=new le("mo",yn(i.body,e));else{t=new le("mi",[new Ut(i.name.slice(1))]);var n=new le("mo",[Cn("⁡","text")]);i.parentIsSupSub?t=new le("mrow",[t,n]):t=Ku([t,n])}return t},i3={"∏":"\\prod","∐":"\\coprod","∑":"\\sum","⋀":"\\bigwedge","⋁":"\\bigvee","⋂":"\\bigcap","⋃":"\\bigcup","⨀":"\\bigodot","⨁":"\\bigoplus","⨂":"\\bigotimes","⨄":"\\biguplus","⨆":"\\bigsqcup"};ve({type:"op",names:["\\coprod","\\bigvee","\\bigwedge","\\biguplus","\\bigcap","\\bigcup","\\intop","\\prod","\\sum","\\bigotimes","\\bigoplus","\\bigodot","\\bigsqcup","\\smallint","∏","∐","∑","⋀","⋁","⋂","⋃","⨀","⨁","⨂","⨄","⨆"],numArgs:0,handler:(i,e)=>{var t=i.parser,n=i.funcName,r=n;return r.length===1&&(r=i3[r]),{type:"op",mode:t.mode,limits:!0,parentIsSupSub:!1,symbol:!0,name:r}},htmlBuilder:_d,mathmlBuilder:n3});ve({type:"op",names:["\\mathop"],numArgs:1,primitive:!0,handler:(i,e)=>{var t=i.parser,n=e[0];return{type:"op",mode:t.mode,limits:!1,parentIsSupSub:!1,symbol:!1,body:Nt(n)}}});var r3={"∫":"\\int","∬":"\\iint","∭":"\\iiint","∮":"\\oint","∯":"\\oiint","∰":"\\oiiint"};ve({type:"op",names:["\\arcsin","\\arccos","\\arctan","\\arctg","\\arcctg","\\arg","\\ch","\\cos","\\cosec","\\cosh","\\cot","\\cotg","\\coth","\\csc","\\ctg","\\cth","\\deg","\\dim","\\exp","\\hom","\\ker","\\lg","\\ln","\\log","\\sec","\\sin","\\sinh","\\sh","\\tan","\\tanh","\\tg","\\th"],numArgs:0,handler(i){var e=i.parser,t=i.funcName;return{type:"op",mode:e.mode,limits:!1,parentIsSupSub:!1,symbol:!1,name:t}}});ve({type:"op",names:["\\det","\\gcd","\\inf","\\lim","\\max","\\min","\\Pr","\\sup"],numArgs:0,handler(i){var e=i.parser,t=i.funcName;return{type:"op",mode:e.mode,limits:!0,parentIsSupSub:!1,symbol:!1,name:t}}});ve({type:"op",names:["\\int","\\iint","\\iiint","\\oint","\\oiint","\\oiiint","∫","∬","∭","∮","∯","∰"],numArgs:0,allowedInArgument:!0,handler(i){var e=i.parser,t=i.funcName,n=t;return n.length===1&&(n=r3[n]),{type:"op",mode:e.mode,limits:!1,parentIsSupSub:!1,symbol:!0,name:n}}});var yd=(i,e)=>{var t,n,r=!1,a;i.type==="supsub"?(t=i.sup,n=i.sub,a=Qe(i.base,"operatorname"),r=!0):a=Qe(i,"operatorname");var s;if(a.body.length>0){for(var o=a.body.map(u=>{var f="text"in u?u.text:void 0;return typeof f=="string"?{type:"textord",mode:u.mode,text:f}:u}),l=Gt(o,e.withFont("mathrm"),!0),c=0;c<l.length;c++){var h=l[c];h instanceof xn&&(h.text=h.text.replace(/\u2212/,"-").replace(/\u2217/,"*"))}s=ae(["mop"],l,e)}else s=ae(["mop"],[],e);return r?vd(s,t,n,e,e.style,0,0):s},a3=(i,e)=>{for(var t=yn(i.body,e.withFont("mathrm")),n=!0,r=0;r<t.length;r++){var a=t[r];if(!(a instanceof Zu))if(a instanceof le)switch(a.type){case"mi":case"mn":case"mspace":case"mtext":break;case"mo":{var s=a.children[0];a.children.length===1&&s instanceof Ut?s.text=s.text.replace(/\u2212/,"-").replace(/\u2217/,"*"):n=!1;break}default:n=!1}else n=!1}if(n){var o=t.map(h=>h.toText()).join("");t=[new Ut(o)]}var l=new le("mi",t);l.setAttribute("mathvariant","normal");var c=new le("mo",[Cn("⁡","text")]);return i.parentIsSupSub?new le("mrow",[l,c]):Ku([l,c])};ve({type:"operatorname",names:["\\operatorname@","\\operatornamewithlimits"],numArgs:1,handler:(i,e)=>{var t=i.parser,n=i.funcName,r=e[0];return{type:"operatorname",mode:t.mode,body:Nt(r),alwaysHandleSupSub:n==="\\operatornamewithlimits",limits:!1,parentIsSupSub:!1}},htmlBuilder:yd,mathmlBuilder:a3});S("\\operatorname","\\@ifstar\\operatornamewithlimits\\operatorname@");lr({type:"ordgroup",htmlBuilder(i,e){return i.semisimple?fi(Gt(i.body,e,!1)):ae(["mord"],Gt(i.body,e,!0),e)},mathmlBuilder(i,e){return Ii(i.body,e,!0)}});ve({type:"overline",names:["\\overline"],numArgs:1,handler(i,e){var t=i.parser,n=e[0];return{type:"overline",mode:t.mode,body:n}},htmlBuilder(i,e){var t=ct(i.body,e.havingCrampedStyle()),n=Gr("overline-line",e),r=e.fontMetrics().defaultRuleThickness,a=dt({positionType:"firstBaseline",children:[{type:"elem",elem:t},{type:"kern",size:3*r},{type:"elem",elem:n},{type:"kern",size:r}]});return ae(["mord","katex-overline"],[a],e)},mathmlBuilder(i,e){var t=new le("mo",[new Ut("‾")]);t.setAttribute("stretchy","true");var n=new le("mover",[_t(i.body,e),t]);return n.setAttribute("accent","true"),n}});ve({type:"phantom",names:["\\phantom"],numArgs:1,allowedInText:!0,handler:(i,e)=>{var t=i.parser,n=e[0];return{type:"phantom",mode:t.mode,body:Nt(n)}},htmlBuilder:(i,e)=>{var t=Gt(i.body,e.withPhantom(),!1);return fi(t)},mathmlBuilder:(i,e)=>{var t=yn(i.body,e);return new le("mphantom",t)}});S("\\hphantom","\\smash{\\phantom{#1}}");ve({type:"vphantom",names:["\\vphantom"],numArgs:1,allowedInText:!0,handler:(i,e)=>{var t=i.parser,n=e[0];return{type:"vphantom",mode:t.mode,body:n}},htmlBuilder:(i,e)=>{var t=ae(["katex-inner"],[ct(i.body,e.withPhantom())]),n=ae(["katex-fix"],[]);return ae(["mord","rlap"],[t,n],e)},mathmlBuilder:(i,e)=>{var t=yn(Nt(i.body),e),n=new le("mphantom",t),r=new le("mpadded",[n]);return r.setAttribute("width","0px"),r}});ve({type:"raisebox",names:["\\raisebox"],numArgs:2,argTypes:["size","hbox"],allowedInText:!0,handler(i,e){var t=i.parser,n=Qe(e[0],"size").value,r=e[1];return{type:"raisebox",mode:t.mode,dy:n,body:r}},htmlBuilder(i,e){var t=ct(i.body,e),n=Tt(i.dy,e);return dt({positionType:"shift",positionData:-n,children:[{type:"elem",elem:t}]})},mathmlBuilder(i,e){var t=new le("mpadded",[_t(i.body,e)]),n=i.dy.number+i.dy.unit;return t.setAttribute("voffset",n),t}});var bd=(i,e)=>{var t=i.parser;return{type:"reflectbox",mode:t.mode,body:e[0]}};ve({type:"reflectbox",names:["\\reflectbox"],numArgs:1,argTypes:["hbox"],allowedInText:!0,handler:bd,htmlBuilder(i,e){return ae(["mord","reflectbox"],[ct(i.body,e)],e)},mathmlBuilder(i,e){return _t(i.body,e)}});ve({type:"reflectbox",names:["\\mathreflectbox"],numArgs:1,argTypes:["math"],handler:bd});ve({type:"internal",names:["\\relax"],numArgs:0,allowedInText:!0,allowedInArgument:!0,handler(i){var e=i.parser;return{type:"internal",mode:e.mode}}});ve({type:"rule",names:["\\rule"],numArgs:2,numOptionalArgs:1,allowedInText:!0,allowedInMath:!0,argTypes:["size","size","size"],handler(i,e,t){var n=i.parser,r=t[0],a=Qe(e[0],"size"),s=Qe(e[1],"size");return{type:"rule",mode:n.mode,shift:r&&Qe(r,"size").value,width:a.value,height:s.value}},htmlBuilder(i,e){var t=ae(["mord","katex-rule"],[],e),n=Tt(i.width,e),r=Tt(i.height,e),a=i.shift?Tt(i.shift,e):0;return t.style.borderRightWidth=he(n),t.style.borderTopWidth=he(r),t.style.bottom=he(a),t.width=n,t.height=r+a,t.depth=-a,t.maxFontSize=r*1.125*e.sizeMultiplier,t},mathmlBuilder(i,e){var t=Tt(i.width,e),n=Tt(i.height,e),r=i.shift?Tt(i.shift,e):0,a=e.color&&e.getColor()||"black",s=new le("mspace");s.setAttribute("mathbackground",a),s.setAttribute("width",he(t)),s.setAttribute("height",he(n));var o=new le("mpadded",[s]);return r>=0?o.setAttribute("height",he(r)):(o.setAttribute("height",he(r)),o.setAttribute("depth",he(-r))),o.setAttribute("voffset",he(r)),o}});function Md(i,e,t){for(var n=Gt(i,e,!1),r=e.sizeMultiplier/t.sizeMultiplier,a=0;a<n.length;a++){var s=n[a].classes.indexOf("katex-sizing");s<0?Array.prototype.push.apply(n[a].classes,e.sizingClasses(t)):n[a].classes[s+1]==="reset-size"+e.size&&(n[a].classes[s+1]="reset-size"+t.size),n[a].height*=r,n[a].depth*=r}return fi(n)}var Lh=["\\tiny","\\sixptsize","\\scriptsize","\\footnotesize","\\small","\\normalsize","\\large","\\Large","\\LARGE","\\huge","\\Huge"],s3=(i,e)=>{var t=e.havingSize(i.size);return Md(i.body,t,e)};ve({type:"sizing",names:Lh,numArgs:0,allowedInText:!0,handler:(i,e)=>{var t=i.breakOnTokenText,n=i.funcName,r=i.parser,a=r.parseExpression(!1,t);return{type:"sizing",mode:r.mode,size:Lh.indexOf(n)+1,body:a}},htmlBuilder:s3,mathmlBuilder:(i,e)=>{var t=e.havingSize(i.size),n=yn(i.body,t),r=new le("mstyle",n);return r.setAttribute("mathsize",he(t.sizeMultiplier)),r}});ve({type:"smash",names:["\\smash"],numArgs:1,numOptionalArgs:1,allowedInText:!0,handler:(i,e,t)=>{var n=i.parser,r=!1,a=!1,s=t[0]&&Qe(t[0],"ordgroup");if(s)for(var o,l=0;l<s.body.length;++l){var c=s.body[l];if(o=zs(c).text,o==="t")r=!0;else if(o==="b")a=!0;else{r=!1,a=!1;break}}else r=!0,a=!0;var h=e[0];return{type:"smash",mode:n.mode,body:h,smashHeight:r,smashDepth:a}},htmlBuilder:(i,e)=>{var t=ae([],[ct(i.body,e)]);if(!i.smashHeight&&!i.smashDepth)return t;if(i.smashHeight&&(t.height=0),i.smashDepth&&(t.depth=0),i.smashHeight&&i.smashDepth)return ae(["mord","katex-smash"],[t],e);if(t.children)for(var n=0;n<t.children.length;n++)i.smashHeight&&(t.children[n].height=0),i.smashDepth&&(t.children[n].depth=0);var r=dt({positionType:"firstBaseline",children:[{type:"elem",elem:t}]});return ae(["mord"],[r],e)},mathmlBuilder:(i,e)=>{var t=new le("mpadded",[_t(i.body,e)]);return i.smashHeight&&t.setAttribute("height","0px"),i.smashDepth&&t.setAttribute("depth","0px"),t}});ve({type:"sqrt",names:["\\sqrt"],numArgs:1,numOptionalArgs:1,handler(i,e,t){var n=i.parser,r=t[0],a=e[0];return{type:"sqrt",mode:n.mode,body:a,index:r}},htmlBuilder(i,e){var t=ct(i.body,e.havingCrampedStyle());t.height===0&&(t.height=e.fontMetrics().xHeight),t=Vr(t,e);var n=e.fontMetrics(),r=n.defaultRuleThickness,a=r;e.style.id<Xe.TEXT.id&&(a=e.fontMetrics().xHeight);var s=r+a/4,o=t.height+t.depth+s+r,l=Hv(o,e),c=l.span,h=l.ruleWidth,u=l.advanceWidth,f=c.height-h;f>t.height+t.depth+s&&(s=(s+f-t.height-t.depth)/2);var g=c.height-t.height-s-h;t.style.paddingLeft=he(u);var x=dt({positionType:"firstBaseline",children:[{type:"elem",elem:t,wrapperClasses:["svg-align"]},{type:"kern",size:-(t.height+g)},{type:"elem",elem:c},{type:"kern",size:h}]});if(i.index){var _=e.havingStyle(Xe.SCRIPTSCRIPT),m=ct(i.index,_,e),p=.6*(x.height-x.depth),E=dt({positionType:"shift",positionData:-p,children:[{type:"elem",elem:m}]}),w=ae(["katex-root"],[E]);return ae(["mord","sqrt"],[w,x],e)}else return ae(["mord","sqrt"],[x],e)},mathmlBuilder(i,e){var t=i.body,n=i.index;return n?new le("mroot",[_t(t,e),_t(n,e)]):new le("msqrt",[_t(t,e)])}});var ol={display:Xe.DISPLAY,text:Xe.TEXT,script:Xe.SCRIPT,scriptscript:Xe.SCRIPTSCRIPT};function o3(i){return i in ol}ve({type:"styling",names:["\\displaystyle","\\textstyle","\\scriptstyle","\\scriptscriptstyle"],numArgs:0,allowedInText:!0,primitive:!0,handler(i,e){var t=i.breakOnTokenText,n=i.funcName,r=i.parser,a=r.parseExpression(!0,t),s=n.slice(1,n.length-5);if(!o3(s))throw new Error("Unknown style: "+s);return{type:"styling",mode:r.mode,style:s,body:a}},htmlBuilder(i,e){var t=ol[i.style],n=e.havingStyle(t);return i.resetFont&&(n=n.withFont("")),Md(i.body,n,e)},mathmlBuilder(i,e){var t=ol[i.style],n=e.havingStyle(t);i.resetFont&&(n=n.withFont(""));var r=yn(i.body,n),a=new le("mstyle",r),s={display:["0","true"],text:["0","false"],script:["1","false"],scriptscript:["2","false"]},o=s[i.style];return a.setAttribute("scriptlevel",o[0]),a.setAttribute("displaystyle",o[1]),a}});var l3=function(e,t){var n=e.base;if(n)if(n.type==="op"){var r=n.limits&&(t.style.size===Xe.DISPLAY.size||n.alwaysHandleSupSub);return r?_d:null}else if(n.type==="operatorname"){var a=n.alwaysHandleSupSub&&(t.style.size===Xe.DISPLAY.size||n.limits);return a?yd:null}else{if(n.type==="accent")return ui(n.base)?td:null;if(n.type==="horizBrace"){var s=!e.sub;return s===n.isOver?gd:null}else return null}else return null};lr({type:"supsub",htmlBuilder(i,e){var t=l3(i,e);if(t)return t(i,e);var n=i.base,r=i.sup,a=i.sub,s=ct(n,e),o,l,c=e.fontMetrics(),h=0,u=0,f=n&&ui(n);if(r){var g=e.havingStyle(e.style.sup());o=ct(r,g,e),f||(h=s.height-g.fontMetrics().supDrop*g.sizeMultiplier/e.sizeMultiplier)}if(a){var x=e.havingStyle(e.style.sub());l=ct(a,x,e),f||(u=s.depth+x.fontMetrics().subDrop*x.sizeMultiplier/e.sizeMultiplier)}var _;e.style===Xe.DISPLAY?_=c.sup1:e.style.cramped?_=c.sup3:_=c.sup2;var m=e.sizeMultiplier,p=he(.5/c.ptPerEm/m),E=null;if(l){var w=i.base&&i.base.type==="op"&&i.base.name&&(i.base.name==="\\oiint"||i.base.name==="\\oiiint");if(s instanceof xn||w){var C;E=he(-((C=s.italic)!=null?C:0))}}var F;if(o&&l){h=Math.max(h,_,o.depth+.25*c.xHeight),u=Math.max(u,c.sub2);var I=c.defaultRuleThickness,P=4*I;if(h-o.depth-(l.height-u)<P){u=P-(h-o.depth)+l.height;var B=.8*c.xHeight-(h-o.depth);B>0&&(h+=B,u-=B)}var ee=[{type:"elem",elem:l,shift:u,marginRight:p,marginLeft:E},{type:"elem",elem:o,shift:-h,marginRight:p}];F=dt({positionType:"individualShift",children:ee})}else if(l){u=Math.max(u,c.sub1,l.height-.8*c.xHeight);var b=[{type:"elem",elem:l,marginLeft:E,marginRight:p}];F=dt({positionType:"shift",positionData:u,children:b})}else if(o)h=Math.max(h,_,o.depth+.25*c.xHeight),F=dt({positionType:"shift",positionData:-h,children:[{type:"elem",elem:o,marginRight:p}]});else throw new Error("supsub must have either sup or sub.");var A=nl(s,"right")||"mord";return ae([A],[s,ae(["msupsub"],[F])],e)},mathmlBuilder(i,e){var t=!1,n,r;i.base&&i.base.type==="horizBrace"&&(r=!!i.sup,r===i.base.isOver&&(t=!0,n=i.base.isOver)),i.base&&(i.base.type==="op"||i.base.type==="operatorname")&&(i.base.parentIsSupSub=!0);var a=[_t(i.base,e)];i.sub&&a.push(_t(i.sub,e)),i.sup&&a.push(_t(i.sup,e));var s;if(t)s=n?"mover":"munder";else if(i.sub)if(i.sup){var c=i.base;c&&c.type==="op"&&c.limits&&e.style===Xe.DISPLAY||c&&c.type==="operatorname"&&c.alwaysHandleSupSub&&(e.style===Xe.DISPLAY||c.limits)?s="munderover":s="msubsup"}else{var l=i.base;l&&l.type==="op"&&l.limits&&(e.style===Xe.DISPLAY||l.alwaysHandleSupSub)||l&&l.type==="operatorname"&&l.alwaysHandleSupSub&&(l.limits||e.style===Xe.DISPLAY)?s="munder":s="msub"}else{var o=i.base;o&&o.type==="op"&&o.limits&&(e.style===Xe.DISPLAY||o.alwaysHandleSupSub)||o&&o.type==="operatorname"&&o.alwaysHandleSupSub&&(o.limits||e.style===Xe.DISPLAY)?s="mover":s="msup"}return new le(s,a)}});lr({type:"atom",htmlBuilder(i,e){return Pl(i.text,i.mode,e,["m"+i.family])},mathmlBuilder(i,e){var t=new le("mo",[Cn(i.text,i.mode)]);if(i.family==="bin"){var n=Il(i,e);n==="bold-italic"&&t.setAttribute("mathvariant",n)}else i.family==="punct"?t.setAttribute("separator","true"):(i.family==="open"||i.family==="close")&&t.setAttribute("stretchy","false");return t}});var Sd={mi:"italic",mn:"normal",mtext:"normal"};lr({type:"mathord",htmlBuilder(i,e){return Os(i,e)},mathmlBuilder(i,e){var t=new le("mi",[Cn(i.text,i.mode,e)]),n=Il(i,e)||"italic";return n!==Sd[t.type]&&t.setAttribute("mathvariant",n),t}});lr({type:"textord",htmlBuilder(i,e){return Os(i,e)},mathmlBuilder(i,e){var t=Cn(i.text,i.mode,e),n=Il(i,e)||"normal",r;return i.mode==="text"?r=new le("mtext",[t]):/[0-9]/.test(i.text)?r=new le("mn",[t]):i.text==="\\prime"?r=new le("mo",[t]):r=new le("mi",[t]),n!==Sd[r.type]&&r.setAttribute("mathvariant",n),r}});var Ih=new Map([["\\nobreak","nobreak"],["\\allowbreak","allowbreak"]]),Nh=new Map([[" ",{}],["\\ ",{}],["~",{className:"nobreak"}],["\\space",{}],["\\nobreakspace",{className:"nobreak"}]]);lr({type:"spacing",htmlBuilder(i,e){var t=Nh.get(i.text),n=Ih.get(i.text);if(t){var r=t.className||"";if(i.mode==="text"){var a=Os(i,e);return a.classes.push(r),a}else return ae(["mspace",r],[Pl(i.text,i.mode,e)],e)}else{if(n)return ae(["mspace",n],[],e);throw new oe('Unknown type of space "'+i.text+'"')}},mathmlBuilder(i,e){var t;if(Nh.has(i.text))t=new le("mtext",[new Ut(" ")]);else{if(Ih.has(i.text))return new le("mspace");throw new oe('Unknown type of space "'+i.text+'"')}return t}});var Uh=()=>{var i=new le("mtd",[]);return i.setAttribute("width","50%"),i};lr({type:"tag",mathmlBuilder(i,e){var t=new le("mtable",[new le("mtr",[Uh(),new le("mtd",[Ii(i.body,e)]),Uh(),new le("mtd",[Ii(i.tag,e)])])]);return t.setAttribute("width","100%"),t}});var Fh={"\\text":void 0,"\\textrm":"textrm","\\textsf":"textsf","\\texttt":"texttt","\\textnormal":"textrm"},Oh={"\\textbf":"textbf","\\textmd":"textmd"},c3={"\\textit":"textit","\\textup":"textup"},kh=(i,e)=>{var t=i.font;if(t){if(Fh[t])return e.withTextFontFamily(Fh[t]);if(Oh[t])return e.withTextFontWeight(Oh[t]);if(t==="\\emph")return e.fontShape==="textit"?e.withTextFontShape("textup"):e.withTextFontShape("textit")}else return e;return e.withTextFontShape(c3[t])};ve({type:"text",names:["\\text","\\textrm","\\textsf","\\texttt","\\textnormal","\\textbf","\\textmd","\\textit","\\textup","\\emph"],numArgs:1,argTypes:["text"],allowedInArgument:!0,allowedInText:!0,handler(i,e){var t=i.parser,n=i.funcName,r=e[0];return{type:"text",mode:t.mode,body:Nt(r),font:n}},htmlBuilder(i,e){var t=kh(i,e),n=Gt(i.body,t,!0);return ae(["mord","text"],n,t)},mathmlBuilder(i,e){var t=kh(i,e);return Ii(i.body,t)}});ve({type:"underline",names:["\\underline"],numArgs:1,allowedInText:!0,handler(i,e){var t=i.parser;return{type:"underline",mode:t.mode,body:e[0]}},htmlBuilder(i,e){var t=ct(i.body,e),n=Gr("underline-line",e),r=e.fontMetrics().defaultRuleThickness,a=dt({positionType:"top",positionData:t.height,children:[{type:"kern",size:r},{type:"elem",elem:n},{type:"kern",size:3*r},{type:"elem",elem:t}]});return ae(["mord","katex-underline"],[a],e)},mathmlBuilder(i,e){var t=new le("mo",[new Ut("‾")]);t.setAttribute("stretchy","true");var n=new le("munder",[_t(i.body,e),t]);return n.setAttribute("accentunder","true"),n}});ve({type:"vcenter",names:["\\vcenter"],numArgs:1,argTypes:["original"],allowedInText:!1,handler(i,e){var t=i.parser;return{type:"vcenter",mode:t.mode,body:e[0]}},htmlBuilder(i,e){var t=ct(i.body,e),n=e.fontMetrics().axisHeight,r=.5*(t.height-n-(t.depth+n));return dt({positionType:"shift",positionData:r,children:[{type:"elem",elem:t}]})},mathmlBuilder(i,e){var t=new le("mpadded",[_t(i.body,e)],["vcenter"]);return new le("mrow",[t])}});ve({type:"verb",names:["\\verb"],numArgs:0,allowedInText:!0,handler(i,e,t){throw new oe("\\verb ended by end of line instead of matching delimiter")},htmlBuilder(i,e){for(var t=Bh(i),n=[],r=e.havingStyle(e.style.text()),a=0;a<t.length;a++){var s=t[a];s==="~"&&(s="\\textasciitilde"),n.push(Qt(s,"Typewriter-Regular",i.mode,r,["mord","texttt"]))}return ae(["mord","text"].concat(r.sizingClasses(e)),qu(n),r)},mathmlBuilder(i,e){var t=new Ut(Bh(i)),n=new le("mtext",[t]);return n.setAttribute("mathvariant","monospace"),n}});var Bh=i=>i.body.replace(/ /g,i.star?"␣":" "),Ei=Yu,wd=`[ \r
	]`,h3="\\\\[a-zA-Z@]+",u3="\\\\[^\uD800-\uDFFF]",d3="("+h3+")"+wd+"*",f3=`\\\\(
|[ \r	]+
?)[ \r	]*`,ll="[̀-ͯ]",p3=new RegExp(ll+"+$"),m3="("+wd+"+)|"+(f3+"|")+"([!-\\[\\]-‧‪-퟿豈-￿]"+(ll+"*")+"|[\uD800-\uDBFF][\uDC00-\uDFFF]"+(ll+"*")+"|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5"+("|"+d3)+("|"+u3+")");class zh{constructor(e,t){this.input=void 0,this.settings=void 0,this.tokenRegex=void 0,this.catcodes=void 0,this.input=e,this.settings=t,this.tokenRegex=new RegExp(m3,"g"),this.catcodes={"%":14,"~":13}}setCatcode(e,t){this.catcodes[e]=t}lex(){var e=this.input,t=this.tokenRegex.lastIndex;if(t===e.length)return new vn("EOF",new cn(this,t,t));var n=this.tokenRegex.exec(e);if(n===null||n.index!==t)throw new oe("Unexpected character: '"+e[t]+"'",new vn(e[t],new cn(this,t,t+1)));var r=n[6]||n[3]||(n[2]?"\\ ":" ");if(this.catcodes[r]===14){var a=e.indexOf(`
`,this.tokenRegex.lastIndex);return a===-1?(this.tokenRegex.lastIndex=e.length,this.settings.reportNonstrict("commentAtEnd","% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)")):this.tokenRegex.lastIndex=a+1,this.lex()}return new vn(r,new cn(this,t,this.tokenRegex.lastIndex))}}class g3{constructor(e,t){e===void 0&&(e={}),t===void 0&&(t={}),this.current=void 0,this.builtins=void 0,this.undefStack=void 0,this.current=t,this.builtins=e,this.undefStack=[]}beginGroup(){this.undefStack.push({})}endGroup(){if(this.undefStack.length===0)throw new oe("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");var e=this.undefStack.pop();for(var t of Object.keys(e))e[t]===void 0?delete this.current[t]:this.current[t]=e[t]}endGroups(){for(;this.undefStack.length>0;)this.endGroup()}has(e){return Object.prototype.hasOwnProperty.call(this.current,e)||Object.prototype.hasOwnProperty.call(this.builtins,e)}get(e){return Object.prototype.hasOwnProperty.call(this.current,e)?this.current[e]:Object.prototype.hasOwnProperty.call(this.builtins,e)?this.builtins[e]:void 0}set(e,t,n){if(n===void 0&&(n=!1),n){for(var r=0;r<this.undefStack.length;r++)delete this.undefStack[r][e];this.undefStack.length>0&&(this.undefStack[this.undefStack.length-1][e]=t)}else{var a=this.undefStack[this.undefStack.length-1];a&&!Object.prototype.hasOwnProperty.call(a,e)&&(a[e]=Object.prototype.hasOwnProperty.call(this.current,e)?this.current[e]:void 0)}t==null?delete this.current[e]:this.current[e]=t}}var v3=fd;S("\\noexpand",function(i){var e=i.popToken();return i.isExpandable(e.text)&&(e.noexpand=!0,e.treatAsRelax=!0),{tokens:[e],numArgs:0}});S("\\expandafter",function(i){var e=i.popToken();return i.expandOnce(!0),{tokens:[e],numArgs:0}});S("\\@firstoftwo",function(i){var e=i.consumeArgs(2);return{tokens:e[0],numArgs:0}});S("\\@secondoftwo",function(i){var e=i.consumeArgs(2);return{tokens:e[1],numArgs:0}});S("\\@ifnextchar",function(i){var e=i.consumeArgs(3);i.consumeSpaces();var t=i.future();return e[0].length===1&&e[0][0].text===t.text?{tokens:e[1],numArgs:0}:{tokens:e[2],numArgs:0}});S("\\@ifstar","\\@ifnextchar *{\\@firstoftwo{#1}}");S("\\TextOrMath",function(i){var e=i.consumeArgs(2);return i.mode==="text"?{tokens:e[0],numArgs:0}:{tokens:e[1],numArgs:0}});var Hh={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,A:10,b:11,B:11,c:12,C:12,d:13,D:13,e:14,E:14,f:15,F:15};S("\\char",function(i){var e=i.popToken(),t,n=0;if(e.text==="'")t=8,e=i.popToken();else if(e.text==='"')t=16,e=i.popToken();else if(e.text==="`")if(e=i.popToken(),e.text[0]==="\\")n=e.text.charCodeAt(1);else{if(e.text==="EOF")throw new oe("\\char` missing argument");n=e.text.charCodeAt(0)}else t=10;if(t){if(n=Hh[e.text],n==null||n>=t)throw new oe("Invalid base-"+t+" digit "+e.text);for(var r;(r=Hh[i.future().text])!=null&&r<t;)n*=t,n+=r,i.popToken()}return"\\@char{"+n+"}"});var kl=(i,e,t,n)=>{var r=i.consumeArg().tokens;if(r.length!==1)throw new oe("\\newcommand's first argument must be a macro name");var a=r[0].text,s=i.isDefined(a);if(s&&!e)throw new oe("\\newcommand{"+a+"} attempting to redefine "+(a+"; use \\renewcommand"));if(!s&&!t)throw new oe("\\renewcommand{"+a+"} when command "+a+" does not yet exist; use \\newcommand");var o=0;if(r=i.consumeArg().tokens,r.length===1&&r[0].text==="["){for(var l="",c=i.expandNextToken();c.text!=="]"&&c.text!=="EOF";)l+=c.text,c=i.expandNextToken();if(!l.match(/^\s*[0-9]+\s*$/))throw new oe("Invalid number of arguments: "+l);o=parseInt(l),r=i.consumeArg().tokens}return s&&n||i.macros.set(a,{tokens:r,numArgs:o}),""};S("\\newcommand",i=>kl(i,!1,!0,!1));S("\\renewcommand",i=>kl(i,!0,!1,!1));S("\\providecommand",i=>kl(i,!0,!0,!0));S("\\message",i=>{var e=i.consumeArgs(1)[0];return console.log(e.reverse().map(t=>t.text).join("")),""});S("\\errmessage",i=>{var e=i.consumeArgs(1)[0];return console.error(e.reverse().map(t=>t.text).join("")),""});S("\\show",i=>{var e=i.popToken(),t=e.text;return console.log(e,i.macros.get(t),Ei[t],St.math[t],St.text[t]),""});S("\\bgroup","{");S("\\egroup","}");S("~","\\nobreakspace");S("\\lq","`");S("\\rq","'");S("\\aa","\\r a");S("\\AA","\\r A");S("\\textcopyright","\\html@mathml{\\textcircled{c}}{\\char`©}");S("\\copyright","\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");S("\\textregistered","\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}");S("ℬ","\\mathscr{B}");S("ℰ","\\mathscr{E}");S("ℱ","\\mathscr{F}");S("ℋ","\\mathscr{H}");S("ℐ","\\mathscr{I}");S("ℒ","\\mathscr{L}");S("ℳ","\\mathscr{M}");S("ℛ","\\mathscr{R}");S("ℭ","\\mathfrak{C}");S("ℌ","\\mathfrak{H}");S("ℨ","\\mathfrak{Z}");S("\\Bbbk","\\Bbb{k}");S("\\llap","\\mathllap{\\textrm{#1}}");S("\\rlap","\\mathrlap{\\textrm{#1}}");S("\\clap","\\mathclap{\\textrm{#1}}");S("\\mathstrut","\\vphantom{(}");S("\\underbar","\\underline{\\text{#1}}");S("\\not",'\\html@mathml{\\mathrel{\\mathrlap\\@not}\\nobreak}{\\char"338}');S("\\neq","\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}");S("\\ne","\\neq");S("≠","\\neq");S("\\notin","\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}");S("∉","\\notin");S("≘","\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}");S("≙","\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}");S("≚","\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}");S("≛","\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}");S("≝","\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}");S("≞","\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}");S("≟","\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}");S("⟂","\\perp");S("‼","\\mathclose{!\\mkern-0.8mu!}");S("∌","\\notni");S("⌜","\\ulcorner");S("⌝","\\urcorner");S("⌞","\\llcorner");S("⌟","\\lrcorner");S("©","\\copyright");S("®","\\textregistered");S("\\ulcorner",'\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}');S("\\urcorner",'\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}');S("\\llcorner",'\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}');S("\\lrcorner",'\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}');S("\\vdots","{\\varvdots\\rule{0pt}{15pt}}");S("⋮","\\vdots");S("\\varGamma","\\mathit{\\Gamma}");S("\\varDelta","\\mathit{\\Delta}");S("\\varTheta","\\mathit{\\Theta}");S("\\varLambda","\\mathit{\\Lambda}");S("\\varXi","\\mathit{\\Xi}");S("\\varPi","\\mathit{\\Pi}");S("\\varSigma","\\mathit{\\Sigma}");S("\\varUpsilon","\\mathit{\\Upsilon}");S("\\varPhi","\\mathit{\\Phi}");S("\\varPsi","\\mathit{\\Psi}");S("\\varOmega","\\mathit{\\Omega}");S("\\substack","\\begin{subarray}{c}#1\\end{subarray}");S("\\colon","\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");S("\\boxed","\\fbox{$\\displaystyle{#1}$}");S("\\iff","\\DOTSB\\;\\Longleftrightarrow\\;");S("\\implies","\\DOTSB\\;\\Longrightarrow\\;");S("\\impliedby","\\DOTSB\\;\\Longleftarrow\\;");S("\\dddot","{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");S("\\ddddot","{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");var Gh={",":"\\dotsc","\\not":"\\dotsb","+":"\\dotsb","=":"\\dotsb","<":"\\dotsb",">":"\\dotsb","-":"\\dotsb","*":"\\dotsb",":":"\\dotsb","\\DOTSB":"\\dotsb","\\coprod":"\\dotsb","\\bigvee":"\\dotsb","\\bigwedge":"\\dotsb","\\biguplus":"\\dotsb","\\bigcap":"\\dotsb","\\bigcup":"\\dotsb","\\prod":"\\dotsb","\\sum":"\\dotsb","\\bigotimes":"\\dotsb","\\bigoplus":"\\dotsb","\\bigodot":"\\dotsb","\\bigsqcup":"\\dotsb","\\And":"\\dotsb","\\longrightarrow":"\\dotsb","\\Longrightarrow":"\\dotsb","\\longleftarrow":"\\dotsb","\\Longleftarrow":"\\dotsb","\\longleftrightarrow":"\\dotsb","\\Longleftrightarrow":"\\dotsb","\\mapsto":"\\dotsb","\\longmapsto":"\\dotsb","\\hookrightarrow":"\\dotsb","\\doteq":"\\dotsb","\\mathbin":"\\dotsb","\\mathrel":"\\dotsb","\\relbar":"\\dotsb","\\Relbar":"\\dotsb","\\xrightarrow":"\\dotsb","\\xleftarrow":"\\dotsb","\\DOTSI":"\\dotsi","\\int":"\\dotsi","\\oint":"\\dotsi","\\iint":"\\dotsi","\\iiint":"\\dotsi","\\iiiint":"\\dotsi","\\idotsint":"\\dotsi","\\DOTSX":"\\dotsx"},x3=new Set(["bin","rel"]);S("\\dots",function(i){var e="\\dotso",t=i.expandAfterFuture().text;return t in Gh?e=Gh[t]:(t.slice(0,4)==="\\not"||t in St.math&&x3.has(St.math[t].group))&&(e="\\dotsb"),e});var Bl={")":!0,"]":!0,"\\rbrack":!0,"\\}":!0,"\\rbrace":!0,"\\rangle":!0,"\\rceil":!0,"\\rfloor":!0,"\\rgroup":!0,"\\rmoustache":!0,"\\right":!0,"\\bigr":!0,"\\biggr":!0,"\\Bigr":!0,"\\Biggr":!0,$:!0,";":!0,".":!0,",":!0};S("\\dotso",function(i){var e=i.future().text;return e in Bl?"\\ldots\\,":"\\ldots"});S("\\dotsc",function(i){var e=i.future().text;return e in Bl&&e!==","?"\\ldots\\,":"\\ldots"});S("\\cdots",function(i){var e=i.future().text;return e in Bl?"\\@cdots\\,":"\\@cdots"});S("\\dotsb","\\cdots");S("\\dotsm","\\cdots");S("\\dotsi","\\!\\cdots");S("\\dotsx","\\ldots\\,");S("\\DOTSI","\\relax");S("\\DOTSB","\\relax");S("\\DOTSX","\\relax");S("\\tmspace","\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");S("\\,","\\tmspace+{3mu}{.1667em}");S("\\thinspace","\\,");S("\\>","\\mskip{4mu}");S("\\:","\\tmspace+{4mu}{.2222em}");S("\\medspace","\\:");S("\\;","\\tmspace+{5mu}{.2777em}");S("\\thickspace","\\;");S("\\!","\\tmspace-{3mu}{.1667em}");S("\\negthinspace","\\!");S("\\negmedspace","\\tmspace-{4mu}{.2222em}");S("\\negthickspace","\\tmspace-{5mu}{.277em}");S("\\enspace","\\kern.5em ");S("\\enskip","\\hskip.5em\\relax");S("\\quad","\\hskip1em\\relax");S("\\qquad","\\hskip2em\\relax");S("\\tag","\\@ifstar\\tag@literal\\tag@paren");S("\\tag@paren","\\tag@literal{({#1})}");S("\\tag@literal",i=>{if(i.macros.get("\\df@tag"))throw new oe("Multiple \\tag");return"\\gdef\\df@tag{\\text{#1}}"});S("\\bmod","\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");S("\\pod","\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");S("\\pmod","\\pod{{\\rm mod}\\mkern6mu#1}");S("\\mod","\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");S("\\newline","\\\\\\relax");S("\\TeX","\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");var Ed=he(Gn["Main-Regular"][84][1]-.7*Gn["Main-Regular"][65][1]);S("\\LaTeX","\\textrm{\\html@mathml{"+("L\\kern-.36em\\raisebox{"+Ed+"}{\\scriptstyle A}")+"\\kern-.15em\\TeX}{LaTeX}}");S("\\KaTeX","\\textrm{\\html@mathml{"+("K\\kern-.17em\\raisebox{"+Ed+"}{\\scriptstyle A}")+"\\kern-.15em\\TeX}{KaTeX}}");S("\\hspace","\\@ifstar\\@hspacer\\@hspace");S("\\@hspace","\\hskip #1\\relax");S("\\@hspacer","\\rule{0pt}{0pt}\\hskip #1\\relax");S("\\ordinarycolon",":");S("\\vcentcolon","\\mathrel{\\mathop\\ordinarycolon}");S("\\dblcolon",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}');S("\\coloneqq",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}');S("\\Coloneqq",'\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}');S("\\coloneq",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}');S("\\Coloneq",'\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}');S("\\eqqcolon",'\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}');S("\\Eqqcolon",'\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}');S("\\eqcolon",'\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}');S("\\Eqcolon",'\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}');S("\\colonapprox",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}');S("\\Colonapprox",'\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}');S("\\colonsim",'\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}');S("\\Colonsim",'\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}');S("∷","\\dblcolon");S("∹","\\eqcolon");S("≔","\\coloneqq");S("≕","\\eqqcolon");S("⩴","\\Coloneqq");S("\\ratio","\\vcentcolon");S("\\coloncolon","\\dblcolon");S("\\colonequals","\\coloneqq");S("\\coloncolonequals","\\Coloneqq");S("\\equalscolon","\\eqqcolon");S("\\equalscoloncolon","\\Eqqcolon");S("\\colonminus","\\coloneq");S("\\coloncolonminus","\\Coloneq");S("\\minuscolon","\\eqcolon");S("\\minuscoloncolon","\\Eqcolon");S("\\coloncolonapprox","\\Colonapprox");S("\\coloncolonsim","\\Colonsim");S("\\simcolon","\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");S("\\simcoloncolon","\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");S("\\approxcolon","\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");S("\\approxcoloncolon","\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");S("\\notni","\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}");S("\\limsup","\\DOTSB\\operatorname*{lim\\,sup}");S("\\liminf","\\DOTSB\\operatorname*{lim\\,inf}");S("\\injlim","\\DOTSB\\operatorname*{inj\\,lim}");S("\\projlim","\\DOTSB\\operatorname*{proj\\,lim}");S("\\varlimsup","\\DOTSB\\operatorname*{\\overline{lim}}");S("\\varliminf","\\DOTSB\\operatorname*{\\underline{lim}}");S("\\varinjlim","\\DOTSB\\operatorname*{\\underrightarrow{lim}}");S("\\varprojlim","\\DOTSB\\operatorname*{\\underleftarrow{lim}}");S("\\gvertneqq","\\html@mathml{\\@gvertneqq}{≩}");S("\\lvertneqq","\\html@mathml{\\@lvertneqq}{≨}");S("\\ngeqq","\\html@mathml{\\@ngeqq}{≱}");S("\\ngeqslant","\\html@mathml{\\@ngeqslant}{≱}");S("\\nleqq","\\html@mathml{\\@nleqq}{≰}");S("\\nleqslant","\\html@mathml{\\@nleqslant}{≰}");S("\\nshortmid","\\html@mathml{\\@nshortmid}{∤}");S("\\nshortparallel","\\html@mathml{\\@nshortparallel}{∦}");S("\\nsubseteqq","\\html@mathml{\\@nsubseteqq}{⊈}");S("\\nsupseteqq","\\html@mathml{\\@nsupseteqq}{⊉}");S("\\varsubsetneq","\\html@mathml{\\@varsubsetneq}{⊊}");S("\\varsubsetneqq","\\html@mathml{\\@varsubsetneqq}{⫋}");S("\\varsupsetneq","\\html@mathml{\\@varsupsetneq}{⊋}");S("\\varsupsetneqq","\\html@mathml{\\@varsupsetneqq}{⫌}");S("\\imath","\\html@mathml{\\@imath}{ı}");S("\\jmath","\\html@mathml{\\@jmath}{ȷ}");S("\\llbracket","\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}");S("\\rrbracket","\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}");S("⟦","\\llbracket");S("⟧","\\rrbracket");S("\\lBrace","\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}");S("\\rBrace","\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}");S("↤","\\mapsfrom");S("\\mapsfrom","\\html@mathml{\\mathrel{\\mathreflectbox{\\mapsto}}}{\\mathrel{\\char`↤}}");S("⦃","\\lBrace");S("⦄","\\rBrace");S("\\minuso","\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}");S("⦵","\\minuso");S("\\darr","\\downarrow");S("\\dArr","\\Downarrow");S("\\Darr","\\Downarrow");S("\\lang","\\langle");S("\\rang","\\rangle");S("\\uarr","\\uparrow");S("\\uArr","\\Uparrow");S("\\Uarr","\\Uparrow");S("\\N","\\mathbb{N}");S("\\R","\\mathbb{R}");S("\\Z","\\mathbb{Z}");S("\\alef","\\aleph");S("\\alefsym","\\aleph");S("\\Alpha","\\mathrm{A}");S("\\Beta","\\mathrm{B}");S("\\bull","\\bullet");S("\\Chi","\\mathrm{X}");S("\\clubs","\\clubsuit");S("\\cnums","\\mathbb{C}");S("\\Complex","\\mathbb{C}");S("\\Dagger","\\ddagger");S("\\diamonds","\\diamondsuit");S("\\empty","\\emptyset");S("\\Epsilon","\\mathrm{E}");S("\\Eta","\\mathrm{H}");S("\\exist","\\exists");S("\\harr","\\leftrightarrow");S("\\hArr","\\Leftrightarrow");S("\\Harr","\\Leftrightarrow");S("\\hearts","\\heartsuit");S("\\image","\\Im");S("\\infin","\\infty");S("\\Iota","\\mathrm{I}");S("\\isin","\\in");S("\\Kappa","\\mathrm{K}");S("\\larr","\\leftarrow");S("\\lArr","\\Leftarrow");S("\\Larr","\\Leftarrow");S("\\lrarr","\\leftrightarrow");S("\\lrArr","\\Leftrightarrow");S("\\Lrarr","\\Leftrightarrow");S("\\Mu","\\mathrm{M}");S("\\natnums","\\mathbb{N}");S("\\Nu","\\mathrm{N}");S("\\Omicron","\\mathrm{O}");S("\\plusmn","\\pm");S("\\rarr","\\rightarrow");S("\\rArr","\\Rightarrow");S("\\Rarr","\\Rightarrow");S("\\real","\\Re");S("\\reals","\\mathbb{R}");S("\\Reals","\\mathbb{R}");S("\\Rho","\\mathrm{P}");S("\\sdot","\\cdot");S("\\sect","\\S");S("\\spades","\\spadesuit");S("\\sub","\\subset");S("\\sube","\\subseteq");S("\\supe","\\supseteq");S("\\Tau","\\mathrm{T}");S("\\thetasym","\\vartheta");S("\\weierp","\\wp");S("\\Zeta","\\mathrm{Z}");S("\\argmin","\\DOTSB\\operatorname*{arg\\,min}");S("\\argmax","\\DOTSB\\operatorname*{arg\\,max}");S("\\plim","\\DOTSB\\mathop{\\operatorname{plim}}\\limits");S("\\bra","\\mathinner{\\langle{#1}|}");S("\\ket","\\mathinner{|{#1}\\rangle}");S("\\braket","\\mathinner{\\langle{#1}\\rangle}");S("\\Bra","\\left\\langle#1\\right|");S("\\Ket","\\left|#1\\right\\rangle");var Td=i=>e=>{var t=e.consumeArg().tokens,n=e.consumeArg().tokens,r=e.consumeArg().tokens,a=e.consumeArg().tokens,s=e.macros.get("|"),o=e.macros.get("\\|");e.macros.beginGroup();var l=u=>f=>{i&&(f.macros.set("|",s),r.length&&f.macros.set("\\|",o));var g=u;if(!u&&r.length){var x=f.future();x.text==="|"&&(f.popToken(),g=!0)}return{tokens:g?r:n,numArgs:0}};e.macros.set("|",l(!1)),r.length&&e.macros.set("\\|",l(!0));var c=e.consumeArg().tokens,h=e.expandTokens([...a,...c,...t]);return e.macros.endGroup(),{tokens:h.reverse(),numArgs:0}};S("\\bra@ket",Td(!1));S("\\bra@set",Td(!0));S("\\Braket","\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");S("\\Set","\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");S("\\set","\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");S("\\angln","{\\angl n}");S("\\blue","\\textcolor{##6495ed}{#1}");S("\\orange","\\textcolor{##ffa500}{#1}");S("\\pink","\\textcolor{##ff00af}{#1}");S("\\red","\\textcolor{##df0030}{#1}");S("\\green","\\textcolor{##28ae7b}{#1}");S("\\gray","\\textcolor{gray}{#1}");S("\\purple","\\textcolor{##9d38bd}{#1}");S("\\blueA","\\textcolor{##ccfaff}{#1}");S("\\blueB","\\textcolor{##80f6ff}{#1}");S("\\blueC","\\textcolor{##63d9ea}{#1}");S("\\blueD","\\textcolor{##11accd}{#1}");S("\\blueE","\\textcolor{##0c7f99}{#1}");S("\\tealA","\\textcolor{##94fff5}{#1}");S("\\tealB","\\textcolor{##26edd5}{#1}");S("\\tealC","\\textcolor{##01d1c1}{#1}");S("\\tealD","\\textcolor{##01a995}{#1}");S("\\tealE","\\textcolor{##208170}{#1}");S("\\greenA","\\textcolor{##b6ffb0}{#1}");S("\\greenB","\\textcolor{##8af281}{#1}");S("\\greenC","\\textcolor{##74cf70}{#1}");S("\\greenD","\\textcolor{##1fab54}{#1}");S("\\greenE","\\textcolor{##0d923f}{#1}");S("\\goldA","\\textcolor{##ffd0a9}{#1}");S("\\goldB","\\textcolor{##ffbb71}{#1}");S("\\goldC","\\textcolor{##ff9c39}{#1}");S("\\goldD","\\textcolor{##e07d10}{#1}");S("\\goldE","\\textcolor{##a75a05}{#1}");S("\\redA","\\textcolor{##fca9a9}{#1}");S("\\redB","\\textcolor{##ff8482}{#1}");S("\\redC","\\textcolor{##f9685d}{#1}");S("\\redD","\\textcolor{##e84d39}{#1}");S("\\redE","\\textcolor{##bc2612}{#1}");S("\\maroonA","\\textcolor{##ffbde0}{#1}");S("\\maroonB","\\textcolor{##ff92c6}{#1}");S("\\maroonC","\\textcolor{##ed5fa6}{#1}");S("\\maroonD","\\textcolor{##ca337c}{#1}");S("\\maroonE","\\textcolor{##9e034e}{#1}");S("\\purpleA","\\textcolor{##ddd7ff}{#1}");S("\\purpleB","\\textcolor{##c6b9fc}{#1}");S("\\purpleC","\\textcolor{##aa87ff}{#1}");S("\\purpleD","\\textcolor{##7854ab}{#1}");S("\\purpleE","\\textcolor{##543b78}{#1}");S("\\mintA","\\textcolor{##f5f9e8}{#1}");S("\\mintB","\\textcolor{##edf2df}{#1}");S("\\mintC","\\textcolor{##e0e5cc}{#1}");S("\\grayA","\\textcolor{##f6f7f7}{#1}");S("\\grayB","\\textcolor{##f0f1f2}{#1}");S("\\grayC","\\textcolor{##e3e5e6}{#1}");S("\\grayD","\\textcolor{##d6d8da}{#1}");S("\\grayE","\\textcolor{##babec2}{#1}");S("\\grayF","\\textcolor{##888d93}{#1}");S("\\grayG","\\textcolor{##626569}{#1}");S("\\grayH","\\textcolor{##3b3e40}{#1}");S("\\grayI","\\textcolor{##21242c}{#1}");S("\\kaBlue","\\textcolor{##314453}{#1}");S("\\kaGreen","\\textcolor{##71B307}{#1}");var Ad={"^":!0,_:!0,"\\limits":!0,"\\nolimits":!0};class _3{constructor(e,t,n){this.settings=void 0,this.expansionCount=void 0,this.lexer=void 0,this.macros=void 0,this.stack=void 0,this.mode=void 0,this.settings=t,this.expansionCount=0,this.feed(e),this.macros=new g3(v3,t.macros),this.mode=n,this.stack=[]}feed(e){this.lexer=new zh(e,this.settings)}switchMode(e){this.mode=e}beginGroup(){this.macros.beginGroup()}endGroup(){this.macros.endGroup()}endGroups(){this.macros.endGroups()}future(){return this.stack.length===0&&this.pushToken(this.lexer.lex()),this.stack[this.stack.length-1]}popToken(){return this.future(),this.stack.pop()}pushToken(e){this.stack.push(e)}pushTokens(e){this.stack.push(...e)}scanArgument(e){var t,n,r;if(e){if(this.consumeSpaces(),this.future().text!=="[")return null;t=this.popToken();var a=this.consumeArg(["]"]);r=a.tokens,n=a.end}else{var s=this.consumeArg();r=s.tokens,t=s.start,n=s.end}return this.pushToken(new vn("EOF",n.loc)),this.pushTokens(r),new vn("",cn.range(t,n))}consumeSpaces(){for(;;){var e=this.future();if(e.text===" ")this.stack.pop();else break}}consumeArg(e){var t=[],n=e&&e.length>0;n||this.consumeSpaces();var r=this.future(),a,s=0,o=0;do{if(a=this.popToken(),t.push(a),a.text==="{")++s;else if(a.text==="}"){if(--s,s===-1)throw new oe("Extra }",a)}else if(a.text==="EOF")throw new oe("Unexpected end of input in a macro argument, expected '"+(e&&n?e[o]:"}")+"'",a);if(e&&n)if((s===0||s===1&&e[o]==="{")&&a.text===e[o]){if(++o,o===e.length){t.splice(-o,o);break}}else o=0}while(s!==0||n);return r.text==="{"&&t[t.length-1].text==="}"&&(t.pop(),t.shift()),t.reverse(),{tokens:t,start:r,end:a}}consumeArgs(e,t){if(t){if(t.length!==e+1)throw new oe("The length of delimiters doesn't match the number of args!");for(var n=t[0],r=0;r<n.length;r++){var a=this.popToken();if(n[r]!==a.text)throw new oe("Use of the macro doesn't match its definition",a)}}for(var s=[],o=0;o<e;o++)s.push(this.consumeArg(t&&t[o+1]).tokens);return s}countExpansion(e){if(this.expansionCount+=e,this.expansionCount>this.settings.maxExpand)throw new oe("Too many expansions: infinite loop or need to increase maxExpand setting")}expandOnce(e){var t=this.popToken(),n=t.text,r=t.noexpand?null:this._getExpansion(n);if(r==null||e&&r.unexpandable){if(e&&r==null&&n[0]==="\\"&&!this.isDefined(n))throw new oe("Undefined control sequence: "+n);return this.pushToken(t),!1}this.countExpansion(1);var a=r.tokens,s=this.consumeArgs(r.numArgs,r.delimiters);if(r.numArgs){a=a.slice();for(var o=a.length-1;o>=0;--o){var l=a[o];if(l.text==="#"){if(o===0)throw new oe("Incomplete placeholder at end of macro body",l);if(l=a[--o],l.text==="#")a.splice(o+1,1);else if(/^[1-9]$/.test(l.text))a.splice(o,2,...s[+l.text-1]);else throw new oe("Not a valid argument number",l)}}}return this.pushTokens(a),a.length}expandAfterFuture(){return this.expandOnce(),this.future()}expandNextToken(){for(;;)if(this.expandOnce()===!1){var e=this.stack.pop();return e.treatAsRelax&&(e.text="\\relax"),e}}expandMacro(e){return this.macros.has(e)?this.expandTokens([new vn(e)]):void 0}expandTokens(e){var t=[],n=this.stack.length;for(this.pushTokens(e);this.stack.length>n;)if(this.expandOnce(!0)===!1){var r=this.stack.pop();r.treatAsRelax&&(r.noexpand=!1,r.treatAsRelax=!1),t.push(r)}return this.countExpansion(t.length),t}expandMacroAsText(e){var t=this.expandMacro(e);return t&&t.map(n=>n.text).join("")}_getExpansion(e){var t=this.macros.get(e);if(t==null)return t;if(e.length===1){var n=this.lexer.catcodes[e];if(n!=null&&n!==13)return}var r=typeof t=="function"?t(this):t;if(typeof r=="string"){var a=0;if(r.includes("#"))for(var s=r.replace(/##/g,"");s.includes("#"+(a+1));)++a;for(var o=new zh(r,this.settings),l=[],c=o.lex();c.text!=="EOF";)l.push(c),c=o.lex();l.reverse();var h={tokens:l,numArgs:a};return h}return r}isDefined(e){return this.macros.has(e)||Object.prototype.hasOwnProperty.call(Ei,e)||Object.prototype.hasOwnProperty.call(St.math,e)||Object.prototype.hasOwnProperty.call(St.text,e)||Object.prototype.hasOwnProperty.call(Ad,e)}isExpandable(e){var t=this.macros.get(e);return t!=null?typeof t=="string"||typeof t=="function"||!t.unexpandable:Object.prototype.hasOwnProperty.call(Ei,e)&&!Ei[e].primitive}}var Vh=/^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/,rs=Object.freeze({"₊":"+","₋":"-","₌":"=","₍":"(","₎":")","₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9","ₐ":"a","ₑ":"e","ₕ":"h","ᵢ":"i","ⱼ":"j","ₖ":"k","ₗ":"l","ₘ":"m","ₙ":"n","ₒ":"o","ₚ":"p","ᵣ":"r","ₛ":"s","ₜ":"t","ᵤ":"u","ᵥ":"v","ₓ":"x","ᵦ":"β","ᵧ":"γ","ᵨ":"ρ","ᵩ":"ϕ","ᵪ":"χ","⁺":"+","⁻":"-","⁼":"=","⁽":"(","⁾":")","⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","ᴬ":"A","ᴮ":"B","ᴰ":"D","ᴱ":"E","ᴳ":"G","ᴴ":"H","ᴵ":"I","ᴶ":"J","ᴷ":"K","ᴸ":"L","ᴹ":"M","ᴺ":"N","ᴼ":"O","ᴾ":"P","ᴿ":"R","ᵀ":"T","ᵁ":"U","ⱽ":"V","ᵂ":"W","ᵃ":"a","ᵇ":"b","ᶜ":"c","ᵈ":"d","ᵉ":"e","ᶠ":"f","ᵍ":"g",ʰ:"h","ⁱ":"i",ʲ:"j","ᵏ":"k",ˡ:"l","ᵐ":"m",ⁿ:"n","ᵒ":"o","ᵖ":"p",ʳ:"r",ˢ:"s","ᵗ":"t","ᵘ":"u","ᵛ":"v",ʷ:"w",ˣ:"x",ʸ:"y","ᶻ":"z","ᵝ":"β","ᵞ":"γ","ᵟ":"δ","ᵠ":"ϕ","ᵡ":"χ","ᶿ":"θ"}),Wo={"́":{text:"\\'",math:"\\acute"},"̀":{text:"\\`",math:"\\grave"},"̈":{text:'\\"',math:"\\ddot"},"̃":{text:"\\~",math:"\\tilde"},"̄":{text:"\\=",math:"\\bar"},"̆":{text:"\\u",math:"\\breve"},"̌":{text:"\\v",math:"\\check"},"̂":{text:"\\^",math:"\\hat"},"̇":{text:"\\.",math:"\\dot"},"̊":{text:"\\r",math:"\\mathring"},"̋":{text:"\\H"},"̧":{text:"\\c"}},qh={á:"á",à:"à",ä:"ä",ǟ:"ǟ",ã:"ã",ā:"ā",ă:"ă",ắ:"ắ",ằ:"ằ",ẵ:"ẵ",ǎ:"ǎ",â:"â",ấ:"ấ",ầ:"ầ",ẫ:"ẫ",ȧ:"ȧ",ǡ:"ǡ",å:"å",ǻ:"ǻ",ḃ:"ḃ",ć:"ć",ḉ:"ḉ",č:"č",ĉ:"ĉ",ċ:"ċ",ç:"ç",ď:"ď",ḋ:"ḋ",ḑ:"ḑ",é:"é",è:"è",ë:"ë",ẽ:"ẽ",ē:"ē",ḗ:"ḗ",ḕ:"ḕ",ĕ:"ĕ",ḝ:"ḝ",ě:"ě",ê:"ê",ế:"ế",ề:"ề",ễ:"ễ",ė:"ė",ȩ:"ȩ",ḟ:"ḟ",ǵ:"ǵ",ḡ:"ḡ",ğ:"ğ",ǧ:"ǧ",ĝ:"ĝ",ġ:"ġ",ģ:"ģ",ḧ:"ḧ",ȟ:"ȟ",ĥ:"ĥ",ḣ:"ḣ",ḩ:"ḩ",í:"í",ì:"ì",ï:"ï",ḯ:"ḯ",ĩ:"ĩ",ī:"ī",ĭ:"ĭ",ǐ:"ǐ",î:"î",ǰ:"ǰ",ĵ:"ĵ",ḱ:"ḱ",ǩ:"ǩ",ķ:"ķ",ĺ:"ĺ",ľ:"ľ",ļ:"ļ",ḿ:"ḿ",ṁ:"ṁ",ń:"ń",ǹ:"ǹ",ñ:"ñ",ň:"ň",ṅ:"ṅ",ņ:"ņ",ó:"ó",ò:"ò",ö:"ö",ȫ:"ȫ",õ:"õ",ṍ:"ṍ",ṏ:"ṏ",ȭ:"ȭ",ō:"ō",ṓ:"ṓ",ṑ:"ṑ",ŏ:"ŏ",ǒ:"ǒ",ô:"ô",ố:"ố",ồ:"ồ",ỗ:"ỗ",ȯ:"ȯ",ȱ:"ȱ",ő:"ő",ṕ:"ṕ",ṗ:"ṗ",ŕ:"ŕ",ř:"ř",ṙ:"ṙ",ŗ:"ŗ",ś:"ś",ṥ:"ṥ",š:"š",ṧ:"ṧ",ŝ:"ŝ",ṡ:"ṡ",ş:"ş",ẗ:"ẗ",ť:"ť",ṫ:"ṫ",ţ:"ţ",ú:"ú",ù:"ù",ü:"ü",ǘ:"ǘ",ǜ:"ǜ",ǖ:"ǖ",ǚ:"ǚ",ũ:"ũ",ṹ:"ṹ",ū:"ū",ṻ:"ṻ",ŭ:"ŭ",ǔ:"ǔ",û:"û",ů:"ů",ű:"ű",ṽ:"ṽ",ẃ:"ẃ",ẁ:"ẁ",ẅ:"ẅ",ŵ:"ŵ",ẇ:"ẇ",ẘ:"ẘ",ẍ:"ẍ",ẋ:"ẋ",ý:"ý",ỳ:"ỳ",ÿ:"ÿ",ỹ:"ỹ",ȳ:"ȳ",ŷ:"ŷ",ẏ:"ẏ",ẙ:"ẙ",ź:"ź",ž:"ž",ẑ:"ẑ",ż:"ż",Á:"Á",À:"À",Ä:"Ä",Ǟ:"Ǟ",Ã:"Ã",Ā:"Ā",Ă:"Ă",Ắ:"Ắ",Ằ:"Ằ",Ẵ:"Ẵ",Ǎ:"Ǎ",Â:"Â",Ấ:"Ấ",Ầ:"Ầ",Ẫ:"Ẫ",Ȧ:"Ȧ",Ǡ:"Ǡ",Å:"Å",Ǻ:"Ǻ",Ḃ:"Ḃ",Ć:"Ć",Ḉ:"Ḉ",Č:"Č",Ĉ:"Ĉ",Ċ:"Ċ",Ç:"Ç",Ď:"Ď",Ḋ:"Ḋ",Ḑ:"Ḑ",É:"É",È:"È",Ë:"Ë",Ẽ:"Ẽ",Ē:"Ē",Ḗ:"Ḗ",Ḕ:"Ḕ",Ĕ:"Ĕ",Ḝ:"Ḝ",Ě:"Ě",Ê:"Ê",Ế:"Ế",Ề:"Ề",Ễ:"Ễ",Ė:"Ė",Ȩ:"Ȩ",Ḟ:"Ḟ",Ǵ:"Ǵ",Ḡ:"Ḡ",Ğ:"Ğ",Ǧ:"Ǧ",Ĝ:"Ĝ",Ġ:"Ġ",Ģ:"Ģ",Ḧ:"Ḧ",Ȟ:"Ȟ",Ĥ:"Ĥ",Ḣ:"Ḣ",Ḩ:"Ḩ",Í:"Í",Ì:"Ì",Ï:"Ï",Ḯ:"Ḯ",Ĩ:"Ĩ",Ī:"Ī",Ĭ:"Ĭ",Ǐ:"Ǐ",Î:"Î",İ:"İ",Ĵ:"Ĵ",Ḱ:"Ḱ",Ǩ:"Ǩ",Ķ:"Ķ",Ĺ:"Ĺ",Ľ:"Ľ",Ļ:"Ļ",Ḿ:"Ḿ",Ṁ:"Ṁ",Ń:"Ń",Ǹ:"Ǹ",Ñ:"Ñ",Ň:"Ň",Ṅ:"Ṅ",Ņ:"Ņ",Ó:"Ó",Ò:"Ò",Ö:"Ö",Ȫ:"Ȫ",Õ:"Õ",Ṍ:"Ṍ",Ṏ:"Ṏ",Ȭ:"Ȭ",Ō:"Ō",Ṓ:"Ṓ",Ṑ:"Ṑ",Ŏ:"Ŏ",Ǒ:"Ǒ",Ô:"Ô",Ố:"Ố",Ồ:"Ồ",Ỗ:"Ỗ",Ȯ:"Ȯ",Ȱ:"Ȱ",Ő:"Ő",Ṕ:"Ṕ",Ṗ:"Ṗ",Ŕ:"Ŕ",Ř:"Ř",Ṙ:"Ṙ",Ŗ:"Ŗ",Ś:"Ś",Ṥ:"Ṥ",Š:"Š",Ṧ:"Ṧ",Ŝ:"Ŝ",Ṡ:"Ṡ",Ş:"Ş",Ť:"Ť",Ṫ:"Ṫ",Ţ:"Ţ",Ú:"Ú",Ù:"Ù",Ü:"Ü",Ǘ:"Ǘ",Ǜ:"Ǜ",Ǖ:"Ǖ",Ǚ:"Ǚ",Ũ:"Ũ",Ṹ:"Ṹ",Ū:"Ū",Ṻ:"Ṻ",Ŭ:"Ŭ",Ǔ:"Ǔ",Û:"Û",Ů:"Ů",Ű:"Ű",Ṽ:"Ṽ",Ẃ:"Ẃ",Ẁ:"Ẁ",Ẅ:"Ẅ",Ŵ:"Ŵ",Ẇ:"Ẇ",Ẍ:"Ẍ",Ẋ:"Ẋ",Ý:"Ý",Ỳ:"Ỳ",Ÿ:"Ÿ",Ỹ:"Ỹ",Ȳ:"Ȳ",Ŷ:"Ŷ",Ẏ:"Ẏ",Ź:"Ź",Ž:"Ž",Ẑ:"Ẑ",Ż:"Ż",ά:"ά",ὰ:"ὰ",ᾱ:"ᾱ",ᾰ:"ᾰ",έ:"έ",ὲ:"ὲ",ή:"ή",ὴ:"ὴ",ί:"ί",ὶ:"ὶ",ϊ:"ϊ",ΐ:"ΐ",ῒ:"ῒ",ῑ:"ῑ",ῐ:"ῐ",ό:"ό",ὸ:"ὸ",ύ:"ύ",ὺ:"ὺ",ϋ:"ϋ",ΰ:"ΰ",ῢ:"ῢ",ῡ:"ῡ",ῠ:"ῠ",ώ:"ώ",ὼ:"ὼ",Ύ:"Ύ",Ὺ:"Ὺ",Ϋ:"Ϋ",Ῡ:"Ῡ",Ῠ:"Ῠ",Ώ:"Ώ",Ὼ:"Ὼ"};class Ws{constructor(e,t){this.mode=void 0,this.gullet=void 0,this.settings=void 0,this.leftrightDepth=void 0,this.nextToken=void 0,this.mode="math",this.gullet=new _3(e,t,this.mode),this.settings=t,this.leftrightDepth=0,this.nextToken=null}expect(e,t){if(t===void 0&&(t=!0),this.fetch().text!==e)throw new oe("Expected '"+e+"', got '"+this.fetch().text+"'",this.fetch());t&&this.consume()}consume(){this.nextToken=null}fetch(){return this.nextToken==null&&(this.nextToken=this.gullet.expandNextToken()),this.nextToken}switchMode(e){this.mode=e,this.gullet.switchMode(e)}parse(){this.settings.globalGroup||this.gullet.beginGroup(),this.settings.colorIsTextColor&&this.gullet.macros.set("\\color","\\textcolor");try{var e=this.parseExpression(!1);return this.expect("EOF"),this.settings.globalGroup||this.gullet.endGroup(),e}finally{this.gullet.endGroups()}}subparse(e){var t=this.nextToken;this.consume(),this.gullet.pushToken(new vn("}")),this.gullet.pushTokens(e);var n=this.parseExpression(!1);return this.expect("}"),this.nextToken=t,n}parseExpression(e,t){for(var n=[];;){this.mode==="math"&&this.consumeSpaces();var r=this.fetch();if(Ws.endOfExpression.has(r.text)||t&&r.text===t||e&&Ei[r.text]&&Ei[r.text].infix)break;var a=this.parseAtom(t);if(a){if(a.type==="internal")continue}else break;n.push(a)}return this.mode==="text"&&this.formLigatures(n),this.handleInfixNodes(n)}handleInfixNodes(e){for(var t=-1,n,r=0;r<e.length;r++){var a=e[r];if(a.type==="infix"){if(t!==-1)throw new oe("only one infix operator per group",a.token);t=r,n=a.replaceWith}}if(t!==-1&&n){var s,o,l=e.slice(0,t),c=e.slice(t+1);l.length===1&&l[0].type==="ordgroup"?s=l[0]:s={type:"ordgroup",mode:this.mode,body:l},c.length===1&&c[0].type==="ordgroup"?o=c[0]:o={type:"ordgroup",mode:this.mode,body:c};var h;return n==="\\\\abovefrac"?h=this.callFunction(n,[s,e[t],o],[]):h=this.callFunction(n,[s,o],[]),[h]}else return e}handleSupSubscript(e){var t=this.fetch(),n=t.text;this.consume(),this.consumeSpaces();var r;do{var a;r=this.parseGroup(e)}while(((a=r)==null?void 0:a.type)==="internal");if(!r)throw new oe("Expected group after '"+n+"'",t);return r}formatUnsupportedCmd(e){for(var t=[],n=0;n<e.length;n++)t.push({type:"textord",mode:"text",text:e[n]});var r={type:"text",mode:this.mode,body:t},a={type:"color",mode:this.mode,color:this.settings.errorColor,body:[r]};return a}parseAtom(e){var t=this.parseGroup("atom",e);if((t==null?void 0:t.type)==="internal"||this.mode==="text")return t;for(var n,r;;){this.consumeSpaces();var a=this.fetch();if(a.text==="\\limits"||a.text==="\\nolimits"){if(t&&t.type==="op")t.limits=a.text==="\\limits",t.alwaysHandleSupSub=!0;else if(t&&t.type==="operatorname")t.alwaysHandleSupSub&&(t.limits=a.text==="\\limits");else throw new oe("Limit controls must follow a math operator",a);this.consume()}else if(a.text==="^"){if(n)throw new oe("Double superscript",a);n=this.handleSupSubscript("superscript")}else if(a.text==="_"){if(r)throw new oe("Double subscript",a);r=this.handleSupSubscript("subscript")}else if(a.text==="'"){if(n)throw new oe("Double superscript",a);var s={type:"textord",mode:this.mode,text:"\\prime"},o=[s];for(this.consume();this.fetch().text==="'";)o.push(s),this.consume();this.fetch().text==="^"&&o.push(this.handleSupSubscript("superscript")),n={type:"ordgroup",mode:this.mode,body:o}}else if(rs[a.text]){var l=Vh.test(a.text),c=[];for(c.push(new vn(rs[a.text])),this.consume();;){var h=this.fetch().text;if(!rs[h]||Vh.test(h)!==l)break;c.unshift(new vn(rs[h])),this.consume()}var u=this.subparse(c);l?r={type:"ordgroup",mode:"math",body:u}:n={type:"ordgroup",mode:"math",body:u}}else break}return n&&r?{type:"supsub",mode:this.mode,base:t,sup:n,sub:r}:n?{type:"supsub",mode:this.mode,base:t,sup:n}:r?{type:"supsub",mode:this.mode,base:t,sub:r}:t}parseFunction(e,t){var n=this.fetch(),r=n.text,a=Ei[r];if(!a)return null;if(this.consume(),t&&t!=="atom"&&!a.allowedInArgument)throw new oe("Got function '"+r+"' with no arguments"+(t?" as "+t:""),n);if(this.mode==="text"&&!a.allowedInText)throw new oe("Can't use function '"+r+"' in text mode",n);if(this.mode==="math"&&a.allowedInMath===!1)throw new oe("Can't use function '"+r+"' in math mode",n);var s=this.parseArguments(r,a),o=s.args,l=s.optArgs;return this.callFunction(r,o,l,n,e)}callFunction(e,t,n,r,a){var s={funcName:e,parser:this,token:r,breakOnTokenText:a},o=Ei[e];if(o&&o.handler)return o.handler(s,t,n);throw new oe("No function handler for "+e)}parseArguments(e,t){var n,r=(n=t.numOptionalArgs)!=null?n:0,a=t.numArgs+r;if(a===0)return{args:[],optArgs:[]};for(var s=[],o=[],l=0;l<a;l++){var c,h=(c=t.argTypes)==null?void 0:c[l],u=l<r;("primitive"in t&&t.primitive&&h==null||t.type==="sqrt"&&l===1&&o[0]==null)&&(h="primitive");var f=this.parseGroupOfType("argument to '"+e+"'",h,u);if(u)o.push(f);else if(f!=null)s.push(f);else throw new oe("Null argument, please report this as a bug")}return{args:s,optArgs:o}}parseGroupOfType(e,t,n){switch(t){case"color":return this.parseColorGroup(n);case"size":return this.parseSizeGroup(n);case"url":return this.parseUrlGroup(n);case"math":case"text":return this.parseArgumentGroup(n,t);case"hbox":{var r=this.parseArgumentGroup(n,"text");return r!=null?{type:"styling",mode:r.mode,body:[r],style:"text",resetFont:!0}:null}case"raw":{var a=this.parseStringGroup(n);return a!=null?{type:"raw",mode:"text",string:a.text}:null}case"primitive":{if(n)throw new oe("A primitive argument cannot be optional");var s=this.parseGroup(e);if(s==null)throw new oe("Expected group as "+e,this.fetch());return s}case"original":case void 0:return this.parseArgumentGroup(n);default:throw new oe("Unknown group type as "+e,this.fetch())}}consumeSpaces(){for(;this.fetch().text===" ";)this.consume()}parseStringGroup(e){var t=this.gullet.scanArgument(e);if(t==null)return null;for(var n="",r;(r=this.fetch()).text!=="EOF";)n+=r.text,this.consume();return this.consume(),t.text=n,t}parseRegexGroup(e,t){for(var n=this.fetch(),r=n,a="",s;(s=this.fetch()).text!=="EOF"&&e.test(a+s.text);)r=s,a+=r.text,this.consume();if(a==="")throw new oe("Invalid "+t+": '"+n.text+"'",n);return n.range(r,a)}parseColorGroup(e){var t=this.parseStringGroup(e);if(t==null)return null;var n=/^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);if(!n)throw new oe("Invalid color: '"+t.text+"'",t);var r=n[0];return/^[0-9a-f]{6}$/i.test(r)&&(r="#"+r),{type:"color-token",mode:this.mode,color:r}}parseSizeGroup(e){var t,n=!1;if(this.gullet.consumeSpaces(),!e&&this.gullet.future().text!=="{"?t=this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,"size"):t=this.parseStringGroup(e),!t)return null;!e&&t.text.length===0&&(t.text="0pt",n=!0);var r=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);if(!r)throw new oe("Invalid size: '"+t.text+"'",t);var a={number:+(r[1]+r[2]),unit:r[3]};if(!Bu(a))throw new oe("Invalid unit: '"+a.unit+"'",t);return{type:"size",mode:this.mode,value:a,isBlank:n}}parseUrlGroup(e){this.gullet.lexer.setCatcode("%",13),this.gullet.lexer.setCatcode("~",12);var t=this.parseStringGroup(e);if(this.gullet.lexer.setCatcode("%",14),this.gullet.lexer.setCatcode("~",13),t==null)return null;var n=t.text.replace(/\\([#$%&~_^{}])/g,"$1");return{type:"url",mode:this.mode,url:n}}parseArgumentGroup(e,t){var n=this.gullet.scanArgument(e);if(n==null)return null;var r=this.mode;t&&this.switchMode(t),this.gullet.beginGroup();var a=this.parseExpression(!1,"EOF");this.expect("EOF"),this.gullet.endGroup();var s={type:"ordgroup",mode:this.mode,loc:n.loc,body:a};return t&&this.switchMode(r),s}parseGroup(e,t){var n=this.fetch(),r=n.text,a;if(r==="{"||r==="\\begingroup"){this.consume();var s=r==="{"?"}":"\\endgroup";this.gullet.beginGroup();var o=this.parseExpression(!1,s),l=this.fetch();this.expect(s),this.gullet.endGroup(),a={type:"ordgroup",mode:this.mode,loc:cn.range(n,l),body:o,semisimple:r==="\\begingroup"||void 0}}else if(a=this.parseFunction(t,e)||this.parseSymbol(),a==null&&r[0]==="\\"&&!Object.prototype.hasOwnProperty.call(Ad,r)){if(this.settings.throwOnError)throw new oe("Undefined control sequence: "+r,n);a=this.formatUnsupportedCmd(r),this.consume()}return a}formLigatures(e){for(var t=e.length-1,n=0;n<t;++n){var r=e[n];if(r.type==="textord"){var a=r.text,s=e[n+1];if(!(!s||s.type!=="textord")){if(a==="-"&&s.text==="-"){var o=e[n+2];n+1<t&&o&&o.type==="textord"&&o.text==="-"?(e.splice(n,3,{type:"textord",mode:"text",loc:cn.range(r,o),text:"---"}),t-=2):(e.splice(n,2,{type:"textord",mode:"text",loc:cn.range(r,s),text:"--"}),t-=1)}(a==="'"||a==="`")&&s.text===a&&(e.splice(n,2,{type:"textord",mode:"text",loc:cn.range(r,s),text:a+a}),t-=1)}}}}parseSymbol(){var e=this.fetch(),t=e.text;if(/^\\verb[^a-zA-Z]/.test(t)){this.consume();var n=t.slice(5),r=n.charAt(0)==="*";if(r&&(n=n.slice(1)),n.length<2||n.charAt(0)!==n.slice(-1))throw new oe(`\\verb assertion failed --
                    please report what input caused this bug`);return n=n.slice(1,-1),{type:"verb",mode:"text",body:n,star:r}}Object.prototype.hasOwnProperty.call(qh,t[0])&&!St[this.mode][t[0]]&&(this.settings.strict&&this.mode==="math"&&this.settings.reportNonstrict("unicodeTextInMathMode",'Accented Unicode text character "'+t[0]+'" used in math mode',e),t=qh[t[0]]+t.slice(1));var a=p3.exec(t);a&&(t=t.substring(0,a.index),t==="i"?t="ı":t==="j"&&(t="ȷ"));var s;if(St[this.mode][t]){this.settings.strict&&this.mode==="math"&&Y0.includes(t)&&this.settings.reportNonstrict("unicodeTextInMathMode",'Latin-1/Unicode text character "'+t[0]+'" used in math mode',e);var o=St[this.mode][t].group,l=cn.range(e),c;Ev(o)?c={type:"atom",mode:this.mode,family:o,loc:l,text:t}:c={type:o,mode:this.mode,loc:l,text:t},s=c}else if(t.charCodeAt(0)>=128)this.settings.strict&&(ku(t.charCodeAt(0))?this.mode==="math"&&this.settings.reportNonstrict("unicodeTextInMathMode",'Unicode text character "'+t[0]+'" used in math mode',e):this.settings.reportNonstrict("unknownSymbol",'Unrecognized Unicode character "'+t[0]+'"'+(" ("+t.charCodeAt(0)+")"),e)),s={type:"textord",mode:"text",loc:cn.range(e),text:t};else return null;if(this.consume(),a)for(var h=0;h<a[0].length;h++){var u=a[0][h];if(!Wo[u])throw new oe("Unknown accent ' "+u+"'",e);var f=Wo[u][this.mode]||Wo[u].text;if(!f)throw new oe("Accent "+u+" unsupported in "+this.mode+" mode",e);s={type:"accent",mode:this.mode,loc:cn.range(e),label:f,isStretchy:!1,isShifty:!0,base:s}}return s}}Ws.endOfExpression=new Set(["}","\\endgroup","\\end","\\right","&"]);var zl=function(e,t){if(!(typeof e=="string"||e instanceof String))throw new TypeError("KaTeX can only parse string typed expression");var n=new Ws(e,t);delete n.gullet.macros.current["\\df@tag"];var r=n.parse();if(delete n.gullet.macros.current["\\current@color"],delete n.gullet.macros.current["\\color"],n.gullet.macros.get("\\df@tag")){if(!t.displayMode)throw new oe("\\tag works only in display equations");r=[{type:"tag",mode:"text",body:r,tag:n.subparse([new vn("\\df@tag")])}]}return r},Cd=function(e,t,n){t.textContent="";var r=Hl(e,n).toNode();t.appendChild(r)};typeof document<"u"&&document.compatMode!=="CSS1Compat"&&(typeof console<"u"&&console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."),Cd=function(){throw new oe("KaTeX doesn't work in quirks mode.")});var y3=function(e,t){var n=Hl(e,t).toMarkup();return n},b3=function(e,t){var n=new Tl(t);return zl(e,n)},Rd=function(e,t,n){if(n.throwOnError||!(e instanceof oe))throw e;var r=ae(["katex-error"],[new xn(t)]);return r.setAttribute("title",e.toString()),r.setAttribute("style","color:"+n.errorColor),r},Hl=function(e,t){var n=new Tl(t);try{var r=zl(e,n);return mv(r,e,n)}catch(a){return Rd(a,e,n)}},M3=function(e,t){var n=new Tl(t);try{var r=zl(e,n);return gv(r,e,n)}catch(a){return Rd(a,e,n)}},S3="0.18.10",w3={Span:$r,Anchor:Us,SymbolNode:xn,SvgNode:hi,PathNode:Di,LineNode:$0},er={version:S3,render:Cd,renderToString:y3,ParseError:oe,SETTINGS_SCHEMA:q0,__parse:b3,__renderToDomTree:Hl,__renderToHTMLTree:M3,__setFontMetrics:K4,__defineSymbol:d,__defineFunction:ve,__defineMacro:S,__domTree:w3},E3=function(e,t,n){for(var r=n,a=0,s=e.length;r<t.length;){var o=t[r];if(a<=0&&t.slice(r,r+s)===e)return r;o==="\\"?r++:o==="{"?a++:o==="}"&&a--,r++}return-1},T3=function(e){return e.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")},A3=/^\\begin{/,C3=function(e,t){for(var n,r=[],a=new RegExp("("+t.map(c=>T3(c.left)).join("|")+")");n=e.search(a),n!==-1;){n>0&&(r.push({type:"text",data:e.slice(0,n)}),e=e.slice(n));var s=t.findIndex(c=>e.startsWith(c.left));if(n=E3(t[s].right,e,t[s].left.length),n===-1)break;var o=e.slice(0,n+t[s].right.length),l=A3.test(o)?o:e.slice(t[s].left.length,n);r.push({type:"math",data:l,rawData:o,display:t[s].display}),e=e.slice(n+t[s].right.length)}return e!==""&&r.push({type:"text",data:e}),r},R3=function(e,t){var n=C3(e,t.delimiters);if(n.length===1&&n[0].type==="text")return null;for(var r=document.createDocumentFragment(),a=0;a<n.length;a++)if(n[a].type==="text")r.appendChild(document.createTextNode(n[a].data));else{var s=document.createElement("span"),o=n[a].data;t.displayMode=n[a].display;try{t.preProcess&&(o=t.preProcess(o)),er.render(o,s,t)}catch(l){if(!(l instanceof er.ParseError))throw l;t.errorCallback("KaTeX auto-render: Failed to parse `"+n[a].data+"` with ",l),r.appendChild(document.createTextNode(n[a].rawData));continue}r.appendChild(s)}return r},Pd=function(e,t){for(var n=function(s){var o=e.childNodes[s];if(o.nodeType===3){for(var l,c=(l=o.textContent)!=null?l:"",h=o.nextSibling,u=0;h&&h.nodeType===Node.TEXT_NODE;){var f;c+=(f=h.textContent)!=null?f:"",h=h.nextSibling,u++}var g=R3(c,t);if(g){for(var x=0;x<u;x++)o.nextSibling.remove();s+=g.childNodes.length-1,e.replaceChild(g,o)}else s+=u}else if(o.nodeType===1){var _=" "+o.className+" ",m=!t.ignoredTags.has(o.nodeName.toLowerCase())&&t.ignoredClasses.every(p=>!_.includes(" "+p+" "));m&&Pd(o,t)}r=s},r=0;r<e.childNodes.length;r++)n(r)},Gl=function(e,t){if(!e)throw new Error("No element provided to render");var n={};Object.assign(n,t),n.delimiters=n.delimiters||[{left:"$$",right:"$$",display:!0},{left:"\\(",right:"\\)",display:!1},{left:"\\begin{equation}",right:"\\end{equation}",display:!0},{left:"\\begin{align}",right:"\\end{align}",display:!0},{left:"\\begin{alignat}",right:"\\end{alignat}",display:!0},{left:"\\begin{gather}",right:"\\end{gather}",display:!0},{left:"\\begin{CD}",right:"\\end{CD}",display:!0},{left:"\\[",right:"\\]",display:!0}],n.ignoredTags=new Set((t==null?void 0:t.ignoredTags)||["script","noscript","style","textarea","pre","code","option"]),n.ignoredClasses=n.ignoredClasses||[],n.errorCallback=n.errorCallback||console.error,n.macros=n.macros||{},Pd(e,n)};const jr=new li,P3=document.getElementById("canvas-wrapper"),si=document.getElementById("sim-canvas"),Dd=document.getElementById("graph-canvas"),D3=document.getElementById("pane-3d"),L3=document.getElementById("potential-canvas-3d");if(!si||!Dd)throw new Error("Canvas elements not found in DOM");const I3=new tu("q₁",260,260,2,26),N3=new tu("q₂",520,260,-2,26),$e=[I3,N3],We=new Hd(si,jr);We.setParticles($e);const Vl=new Gd(Dd,jr),Ft=new p4(D3,L3,jr);Ft.setParticles($e);const U3=document.getElementById("hud-force-val"),Er=document.getElementById("hud-force-type"),F3=document.getElementById("hud-dist-val"),Xo=document.getElementById("func-formula-display"),$o=document.getElementById("formula-dynamic"),cl=document.getElementById("q1-slider"),hl=document.getElementById("q2-slider"),O3=document.getElementById("q1-val-display"),k3=document.getElementById("q2-val-display"),B3=document.getElementById("q1-badge"),z3=document.getElementById("q2-badge"),Wh=document.getElementById("chk-grid"),ul=document.getElementById("chk-vectors"),oa=document.getElementById("chk-field-lines"),la=document.getElementById("chk-efield"),as=document.getElementById("btn-test-pos"),ss=document.getElementById("btn-test-neg"),Xh=document.getElementById("btn-spawn-test"),$h=document.getElementById("btn-clear-test"),H3=document.getElementById("preset-attract"),G3=document.getElementById("preset-repel"),V3=document.getElementById("preset-ratio"),q3=document.getElementById("preset-reset"),W3=document.getElementById("q1-toggle-sign"),X3=document.getElementById("q2-toggle-sign");function Kt(){const i=$e[0],e=$e[1],t=jr.calculateForce(i,e);U3.textContent=li.formatForce(t.magnitude),F3.textContent=li.formatDistance(t.distanceMeters),i.q===0||e.q===0?(Er.textContent="力なし (中性)",Er.className="hud-type"):t.isAttraction?(Er.textContent="引力（引き合う）",Er.className="hud-type attract"):(Er.textContent="斥力（反発する）",Er.className="hud-type repel"),cl.value=i.q.toString(),O3.textContent=`${i.q>0?"+":""}${i.q.toFixed(1)} μC`,Yh(B3,i.q,"1"),hl.value=e.q.toString(),k3.textContent=`${e.q>0?"+":""}${e.q.toFixed(1)} μC`,Yh(z3,e.q,"2"),$3(),Vl.update(t.distanceMeters,t.magnitude,i.q,e.q);const n=Math.abs(i.q*e.q),r=.00898755*n;if(Xo)if(n===0)er.render("F(r) = 0\\ \\mathrm{[N]}",Xo,{displayMode:!1,throwOnError:!1});else{const a=r>=.01?r.toFixed(4):r.toExponential(3);er.render(`F(r) = \\frac{${a}}{r^2}\\ \\mathrm{[N]}`,Xo,{displayMode:!1,throwOnError:!1})}if($o)if(n===0)er.render("\\text{現在の関数式: } F(r) = 0\\ \\mathrm{[N]}\\quad(\\text{中性})",$o,{displayMode:!1,throwOnError:!1});else{const a=r>=.01?r.toFixed(4):r.toExponential(3);er.render(`\\text{現在の関数式: } F(r) = \\frac{${a}}{r^2}\\ \\mathrm{[N]}`,$o,{displayMode:!1,throwOnError:!1})}Ft.updateSurface()}function Yh(i,e,t){const n=i.querySelector(".badge-symbol"),r=i.querySelectorAll("span")[1];e>0?(i.className="charge-badge positive",n.textContent="+"):e<0?(i.className="charge-badge negative",n.textContent="−"):(i.className="charge-badge",i.style.background="rgba(255, 255, 255, 0.1)",i.style.color="#cbd5e1",i.style.border="1px solid rgba(255, 255, 255, 0.2)",n.textContent="0"),r.textContent=`電荷 ${t} (q${t==="1"?"₁":"₂"})`}function $3(){document.querySelectorAll(".btn-micro[data-target]").forEach(i=>{const e=i.getAttribute("data-target"),t=parseFloat(i.getAttribute("data-val")||"0"),n=e==="q1"?$e[0]:$e[1];Math.abs(n.q-t)<.05?i.classList.add("active"):i.classList.remove("active")})}We.onStateChange=()=>{Kt()};cl.addEventListener("input",()=>{$e[0].q=parseFloat(cl.value),We.render(),Kt()});hl.addEventListener("input",()=>{$e[1].q=parseFloat(hl.value),We.render(),Kt()});W3.addEventListener("click",()=>{$e[0].q=-$e[0].q,We.render(),Kt()});X3.addEventListener("click",()=>{$e[1].q=-$e[1].q,We.render(),Kt()});document.querySelectorAll(".btn-micro[data-target]").forEach(i=>{i.addEventListener("click",()=>{const e=i.getAttribute("data-target"),t=parseFloat(i.getAttribute("data-val")||"0");e==="q1"?$e[0].q=t:$e[1].q=t,We.render(),Kt()})});H3.addEventListener("click",()=>{$e[0].q=2,$e[1].q=-2,We.render(),Kt()});G3.addEventListener("click",()=>{$e[0].q=2,$e[1].q=2,We.render(),Kt()});V3.addEventListener("click",()=>{$e[0].q=4,$e[1].q=1,We.render(),Kt()});q3.addEventListener("click",()=>{var n;const i=(n=si.parentElement)==null?void 0:n.getBoundingClientRect(),e=i?i.width:600,t=i?i.height:400;$e[0].x=e*.35,$e[0].y=t*.5,$e[0].q=2,$e[1].x=e*.65,$e[1].y=t*.5,$e[1].q=-2,We.render(),Kt()});Wh.addEventListener("change",()=>{We.showGrid=Wh.checked,We.render()});ul.addEventListener("change",()=>{We.showVectors=ul.checked,We.render()});oa&&oa.addEventListener("change",()=>{We.showFieldLines=oa.checked,We.render()});la&&la.addEventListener("change",()=>{We.showEFieldGrid=la.checked,We.render()});as&&ss&&(as.addEventListener("click",()=>{We.testChargeSign=1,as.classList.add("active"),ss.classList.remove("active")}),ss.addEventListener("click",()=>{We.testChargeSign=-1,ss.classList.add("active"),as.classList.remove("active")}));Xh&&Xh.addEventListener("click",()=>{We.spawnTestParticle()});$h&&$h.addEventListener("click",()=>{We.clearTestParticles(),Ft.clearTestParticleMeshes()});We.onAnimationTick=()=>{var n;const i=(n=si.parentElement)==null?void 0:n.getBoundingClientRect(),e=i&&i.width>0?i.width:si.width/(window.devicePixelRatio||1),t=i&&i.height>0?i.height:si.height/(window.devicePixelRatio||1);Ft.updateTestParticles(We.testParticles,e,t)};const tr=document.getElementById("tab-view-2d"),nr=document.getElementById("tab-view-3d"),ir=document.getElementById("tab-view-split"),Sa=i=>{if(P3.className=`canvas-wrapper view-${i}`,[tr,nr,ir].forEach(e=>e==null?void 0:e.classList.remove("active")),i==="2d"&&(tr==null||tr.classList.add("active")),i==="3d"&&(nr==null||nr.classList.add("active")),i==="split"&&(ir==null||ir.classList.add("active")),We.handleResize(),Ft.handleResize(),i==="split")We.fitParticlesToViewport(.28,.72,.52),Ft.setOptimalSplitCamera();else if(i==="2d"){const e=si.width/(window.devicePixelRatio||1);e>0&&Math.abs($e[1].x-$e[0].x)<e*.25&&We.fitParticlesToViewport(.35,.65,.5)}We.render(),Ft.updateSurface(),Kt()};tr==null||tr.addEventListener("click",()=>Sa("2d"));nr==null||nr.addEventListener("click",()=>Sa("3d"));ir==null||ir.addEventListener("click",()=>Sa("split"));const os=document.getElementById("btn-3d-wireframe"),ls=document.getElementById("btn-3d-autorotate"),Yo=document.getElementById("btn-3d-reset-cam");os==null||os.addEventListener("click",()=>{Ft.showWireframe=!Ft.showWireframe,Ft.updateSurface(),os.classList.toggle("active",Ft.showWireframe)});ls==null||ls.addEventListener("click",()=>{const i=!Ft.autoRotate;Ft.setAutoRotate(i),ls.classList.toggle("active",i)});Yo==null||Yo.addEventListener("click",()=>{Ft.resetCamera()});window.addEventListener("load",()=>{var e;const i=(e=si.parentElement)==null?void 0:e.getBoundingClientRect();i&&i.width>0&&($e[0].x=Math.max(100,i.width*.35),$e[0].y=i.height*.5,$e[1].x=Math.min(i.width-100,i.width*.65),$e[1].y=i.height*.5),We.handleResize(),Vl.handleResize(),Ft.handleResize(),We.render(),Kt()});Kt();We.render();Ft.updateSurface();const An=new m4,Kr=new V0,gn=document.getElementById("btn-toggle-learning"),$i=document.getElementById("learning-stepper-banner"),ca=document.getElementById("btn-prev-step"),Nr=document.getElementById("btn-next-step"),jo=document.getElementById("btn-exit-learning"),jh=document.getElementById("step-badge"),Kh=document.getElementById("step-title"),Zh=document.getElementById("step-goal"),Jh=document.getElementById("step-narrative"),Qh=document.getElementById("step-action-text"),dl=document.querySelectorAll(".btn-challenge-tab"),Ko=document.getElementById("btn-random-challenge"),Wi=document.getElementById("challenge-diff"),eu=document.getElementById("challenge-title"),Zo=document.getElementById("challenge-desc"),ha=document.getElementById("input-challenge-force"),Jo=document.getElementById("btn-submit-answer"),Qo=document.getElementById("btn-sync-to-stage"),ti=document.getElementById("btn-toggle-solution"),oi=document.getElementById("challenge-feedback"),Cr=document.getElementById("challenge-solution-drawer"),e0=document.getElementById("solution-steps-list");let _s=null;function Ld(){_s&&(_s.classList.remove("tutorial-highlight"),_s=null)}function Y3(i){if(!$i)return;if(jh&&(jh.textContent=i.badge),Kh&&(Kh.textContent=i.title),Zh&&(Zh.textContent=`🎯 目標: ${i.goal}`),Jh&&(Jh.textContent=i.narrative),Qh&&(Qh.textContent=i.recommendedAction),document.querySelectorAll(".step-dot").forEach((n,r)=>{n.classList.remove("active","completed"),r===i.stepIndex-1?n.classList.add("active"):r<i.stepIndex-1&&n.classList.add("completed")}),ca&&(ca.disabled=i.stepIndex===1),Nr&&(i.stepIndex===An.getSteps().length?Nr.textContent="🎉 学習完了！":Nr.innerHTML="次のステップ &rarr;"),Ld(),i.highlightSelector){const n=document.querySelector(i.highlightSelector);n&&(n.classList.add("tutorial-highlight"),_s=n)}i.autoSetup&&(i.autoSetup.view&&Sa(i.autoSetup.view),i.autoSetup.q1!==void 0&&($e[0].q=i.autoSetup.q1),i.autoSetup.q2!==void 0&&($e[1].q=i.autoSetup.q2),i.autoSetup.vectors!==void 0&&(We.showVectors=i.autoSetup.vectors,ul.checked=i.autoSetup.vectors),i.autoSetup.fieldLines!==void 0&&oa&&(We.showFieldLines=i.autoSetup.fieldLines,oa.checked=i.autoSetup.fieldLines),i.autoSetup.efield!==void 0&&la&&(We.showEFieldGrid=i.autoSetup.efield,la.checked=i.autoSetup.efield),We.render(),Kt());const t=document.getElementById("btn-banner-action");t&&(t.style.display=i.stepIndex===3?"inline-flex":"none"),i.stepIndex===3&&(We.fitParticlesToViewport(.28,.72,.52),Ft.setOptimalSplitCamera(),Ft.updateSurface(),setTimeout(()=>{We.clearTestParticles(),Ft.clearTestParticleMeshes();const n=$e[0];We.spawnTestParticle(n.x+40,n.y-18,.4),We.spawnTestParticle(n.x+35,n.y+18,.4),We.spawnTestParticle(n.x+50,n.y,.4)},120))}const t0=document.getElementById("btn-banner-action");t0==null||t0.addEventListener("click",()=>{const i=$e[0];We.spawnTestParticle(i.x+35,i.y-15,.4),We.spawnTestParticle(i.x+35,i.y+15,.4)});An.onModeToggle(i=>{i?($i==null||$i.classList.remove("hidden"),gn==null||gn.classList.add("active"),gn&&(gn.textContent="✕ 学習モード中")):($i==null||$i.classList.add("hidden"),gn==null||gn.classList.remove("active"),gn&&(gn.innerHTML='<span class="icon">🎓</span> 探究学習モード'),Ld())});An.onStepChange(i=>{Y3(i)});gn==null||gn.addEventListener("click",()=>{An.toggle()});jo==null||jo.addEventListener("click",()=>{An.exit()});ca==null||ca.addEventListener("click",()=>{An.prevStep()});Nr==null||Nr.addEventListener("click",()=>{if(An.getCurrentStepIndex()===An.getSteps().length-1){An.exit();const i=document.getElementById("challenges-card");i==null||i.scrollIntoView({behavior:"smooth"})}else An.nextStep()});document.querySelectorAll(".step-dot").forEach(i=>{i.addEventListener("click",()=>{const e=parseInt(i.getAttribute("data-step")||"0",10);An.goToStep(e)})});function ql(i){if(Wi&&(Wi.textContent=i.difficulty,i.difficulty==="入門"?Wi.style.background="#0284c7":i.difficulty==="基本"?Wi.style.background="#2563eb":i.difficulty==="応用"?Wi.style.background="#d97706":i.difficulty==="発展"?Wi.style.background="#7c3aed":Wi.style.background="#059669"),eu&&(eu.textContent=i.title),Zo){Zo.innerHTML=i.description;try{Gl(Zo,{delimiters:[{left:"$$",right:"$$",display:!0},{left:"$",right:"$",display:!1}],throwOnError:!1})}catch(e){console.warn("Math render error in challenge description:",e)}}ha&&(ha.value=""),oi&&(oi.className="challenge-feedback hidden",oi.textContent=""),Cr&&(Cr.classList.add("hidden"),ti&&(ti.textContent="📖 手計算解説を見る")),j3(i)}function j3(i){e0&&(e0.innerHTML="",i.solutionSteps.forEach(e=>{const t=document.createElement("div");t.className="solution-step-item";const n=document.createElement("div");n.className="solution-step-title",n.textContent=`Step ${e.stepNumber}: ${e.title}`,t.appendChild(n);const r=document.createElement("div");if(r.className="solution-step-body",r.innerHTML=e.explanation,t.appendChild(r),e.formulaLatex){const a=document.createElement("div");a.className="solution-step-math";try{er.render(e.formulaLatex,a,{displayMode:!0,throwOnError:!1})}catch{a.textContent=e.formulaLatex}t.appendChild(a)}try{Gl(r,{delimiters:[{left:"$$",right:"$$",display:!0},{left:"$",right:"$",display:!1}],throwOnError:!1})}catch{}e0.appendChild(t)}))}function Id(i){var o;$e[0].q=i.q1_uC,$e[1].q=i.q2_uC;const e=(o=si.parentElement)==null?void 0:o.getBoundingClientRect(),t=e&&e.width>0?e.width:600,n=e&&e.height>0?e.height:400,r=t/2,a=n/2,s=i.r_m*jr.pixelsPerMeter;$e[0].x=Math.max(60,r-s/2),$e[0].y=a,$e[1].x=Math.min(t-60,r+s/2),$e[1].y=a,We.render(),Kt(),oi&&(oi.className="challenge-feedback success",oi.innerHTML=`🔬 シミュレーターの電荷を <strong>q₁ = ${i.q1_uC>0?"+":""}${i.q1_uC} μC</strong>, <strong>q₂ = ${i.q2_uC>0?"+":""}${i.q2_uC} μC</strong>, 距離 <strong>r = ${i.r_m.toFixed(2)} m</strong> に配置しました！左上のHUDと矢印を確認してみよう。`)}dl.forEach(i=>{i.addEventListener("click",()=>{dl.forEach(n=>n.classList.remove("active")),i.classList.add("active");const e=i.getAttribute("data-id")||"challenge-1",t=Kr.selectChallengeById(e);t&&ql(t)})});Ko==null||Ko.addEventListener("click",()=>{dl.forEach(e=>e.classList.remove("active"));const i=Kr.generateRandomChallenge();ql(i)});Jo==null||Jo.addEventListener("click",()=>{const i=(ha==null?void 0:ha.value)||"",e=document.querySelector('input[name="challenge-dir"]:checked'),t=e?e.value:"attract",n=Kr.evaluateAnswer(i,t);oi&&(oi.className=`challenge-feedback ${n.isCorrect?"success":"error"}`,oi.textContent=n.message)});Qo==null||Qo.addEventListener("click",()=>{const i=Kr.getCurrentChallenge();Id(i)});ti==null||ti.addEventListener("click",()=>{if(!Cr)return;Cr.classList.contains("hidden")?(Cr.classList.remove("hidden"),ti&&(ti.textContent="✕ 解説を閉じる")):(Cr.classList.add("hidden"),ti&&(ti.textContent="📖 手計算解説を見る"))});ql(Kr.getCurrentChallenge());try{Gl(document.body,{delimiters:[{left:"$$",right:"$$",display:!0},{left:"$",right:"$",display:!1}],throwOnError:!1})}catch(i){console.warn("KaTeX auto-render error:",i)}typeof window<"u"&&(window.__SIM_STATE__={particles:$e,engine:jr,canvasView:We,graphView:Vl,threeView:Ft,learningScenario:An,challengeManager:Kr,switchView:Sa,updateUI:Kt,applyChallengeToSimulator:Id});
