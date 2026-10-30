// Drifting field of small geometric studies behind the hero mark, one hue per division.
// Ported from the "Ascentra Homepage" design handoff.

type Glyph = {
  fx: number;
  fy: number;
  s: number;
  div: number;
  m: number;
  dur: number;
  off: number;
  a0: number;
  d1: number;
  d2: number;
  vx: number;
  vy: number;
  rs: number;
  p1: number;
  p2: number;
};

const COL = [
  (a: number) => "rgba(157,183,154," + a + ")", // operis — green
  (a: number) => "rgba(143,191,224," + a + ")", // ascentra — blue
  (a: number) => "rgba(233,209,168," + a + ")", // astra — gold
];

const ez = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function buildGlyphs(): Glyph[] {
  const ag: Glyph[] = [];
  for (let gy = 0; gy < 5; gy++)
    for (let gx = 0; gx < 7; gx++) {
      const n = gy * 7 + gx;
      if (rnd(n * 41.7) < 0.14) continue;
      ag.push({
        fx: (gx + 0.5) / 7 + (rnd(n * 3.1) - 0.5) * 0.11,
        fy: (gy + 0.5) / 5 + (rnd(n * 7.7) - 0.5) * 0.13,
        s: 0.3 + rnd(n * 13.3) * 0.22,
        div: n % 3,
        m: Math.floor(rnd(n * 5.9) * 4),
        dur: 12 + rnd(n * 9.4) * 8,
        off: rnd(n * 3.7) * 10,
        a0: 0.12 + rnd(n * 11.1) * 0.08,
        d1: rnd(n * 17.9) * 6.28,
        d2: rnd(n * 23.3) * 6.28,
        vx: (rnd(n * 29.1) - 0.5) * 0.008,
        vy: (rnd(n * 31.7) - 0.5) * 0.006,
        rs: (rnd(n * 43.9) - 0.5) * 0.06,
        p1: 2 + Math.floor(rnd(n * 47.3) * 4),
        p2: 3 + Math.floor(rnd(n * 53.9) * 5),
      });
    }
  return ag;
}

function isect(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): [number, number] | null {
  const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy);
  if (!d || d > r0 + r1 || d < Math.abs(r0 - r1)) return null;
  const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r0 * r0 - a * a));
  return [x0 + (a * dx) / d - (hh * dy) / d, y0 + (a * dy) / d + (hh * dx) / d];
}

/** Returns a draw function. `sc` = intro scroll progress (0..1), `fd` = overall fade (0..1). */
export function createHeroField() {
  const glyphs = buildGlyphs();

  return function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, sc: number, fd: number) {
    ctx.clearRect(0, 0, w, h);
    const k = Math.min(w / 1440, h / 900);
    for (const G of glyphs) {
      const ph = t / G.dur + G.off, cyc = Math.floor(ph), c = ph - cyc;
      const m = G.div * 4 + ((G.m + cyc) % 4);
      let fx = G.fx + Math.sin(t * 0.035 + G.d1) * 0.022 + G.vx * t * 0.01;
      let fy = G.fy + Math.cos(t * 0.028 + G.d2) * 0.018 + G.vy * t * 0.01;
      fx = ((fx % 1) + 1) % 1;
      fy = ((fy % 1) + 1) % 1;
      const px = fx * w, py = fy * h;
      // keep the centre (where the mark sits) clear until the visitor scrolls
      const qE = Math.pow((px - w * 0.5) / (w * 0.26), 2) + Math.pow((py - h * 0.46) / (h * 0.5), 2);
      let aZ = clamp((qE - 1) * 1.6);
      aZ = aZ + (1 - aZ) * sc;
      if (py > h * 0.74 && px > w * 0.3 && px < w * 0.7) aZ *= 1 - clamp((py - h * 0.74) / (h * 0.05)) * (1 - sc);
      aZ *= clamp((py - h * 0.055) / (h * 0.05));
      aZ *= clamp((h * 0.97 - py) / (h * 0.04));
      const env = c < 0.09 ? ez(c / 0.09) : c > 0.9 ? 1 - ez((c - 0.9) / 0.1) : 1;
      const A = G.a0 * env * aZ * fd;
      if (A <= 0.008) continue;
      const S = k * G.s, col = COL[G.div];
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(G.rs * t + G.d1);
      ctx.scale(S, S);
      ctx.lineWidth = 1 / S;
      ctx.strokeStyle = col(A);
      if (m === 0) {
        // OPERIS · epicycloid gear curve
        const kk = G.p1 + 1, r0 = 50 / (kk + 1);
        ctx.beginPath();
        for (let i = 0; i <= 140; i++) {
          const th = (i / 140) * 6.283;
          const x = r0 * kk * Math.cos(th) + r0 * Math.cos(kk * th + t * 0.3);
          const y = r0 * kk * Math.sin(th) - r0 * Math.sin(kk * th + t * 0.3);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (m === 1) {
        // OPERIS · cycloid — rolling wheel
        ctx.strokeStyle = col(A * 0.5);
        ctx.beginPath();
        ctx.moveTo(-55, 30);
        ctx.lineTo(55, 30);
        ctx.stroke();
        ctx.strokeStyle = col(A);
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const fi = (i / 100) * 9.16;
          const x = -55 + fi * 12 - 12 * Math.sin(fi);
          if (i === 0) ctx.moveTo(x, 18 + 12 * -Math.cos(fi));
          else ctx.lineTo(x, 18 - 12 * Math.cos(fi));
        }
        ctx.stroke();
        const rc = (t * 14) % 110, fi = rc / 12;
        ctx.strokeStyle = col(A * 0.9);
        ctx.beginPath();
        ctx.arc(-55 + rc, 18, 12, 0, 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-55 + rc, 18);
        ctx.lineTo(-55 + rc + 12 * Math.sin(fi + 3.14), 18 + 12 * Math.cos(fi + 3.14));
        ctx.stroke();
        ctx.fillStyle = col(A * 1.4);
        ctx.beginPath();
        ctx.arc(-55 + rc - 12 * Math.sin(fi), 18 - 12 * Math.cos(fi), 1.6, 0, 7);
        ctx.fill();
      } else if (m === 2) {
        // OPERIS · pendulum wave
        ctx.strokeStyle = col(A * 0.5);
        ctx.beginPath();
        ctx.moveTo(-52, -52);
        ctx.lineTo(52, -52);
        ctx.stroke();
        for (let i = 0; i < 11; i++) {
          const pxp = -50 + i * 10, an = 0.42 * Math.sin(t * (1.1 + i * 0.07) + G.d2);
          const bx = pxp + 88 * Math.sin(an), by = -52 + 88 * Math.cos(an);
          ctx.strokeStyle = col(A * 0.4);
          ctx.beginPath();
          ctx.moveTo(pxp, -52);
          ctx.lineTo(bx, by);
          ctx.stroke();
          ctx.fillStyle = col(A * 1.3);
          ctx.beginPath();
          ctx.arc(bx, by, 1.8, 0, 7);
          ctx.fill();
        }
      } else if (m === 3) {
        // OPERIS · four-bar linkage coupler curve
        const Ax2 = -28, Ay2 = 34, Bx2 = 30, By2 = 34;
        const coupler = (th: number) => {
          const Cx = Ax2 + 14 * Math.cos(th), Cy = Ay2 + 14 * Math.sin(th);
          const Dp = isect(Bx2, By2, 30, Cx, Cy, 44);
          if (!Dp) return null;
          const mx2 = (Cx + Dp[0]) / 2, my2 = (Cy + Dp[1]) / 2;
          const ux = (Dp[0] - Cx) / 44, uy = (Dp[1] - Cy) / 44;
          return { Cx, Cy, Dp, Px2: mx2 - uy * 26, Py2: my2 + ux * 26 };
        };
        ctx.strokeStyle = col(A * 0.5);
        ctx.beginPath();
        ctx.moveTo(Ax2 - 10, Ay2);
        ctx.lineTo(Bx2 + 10, By2);
        ctx.stroke();
        ctx.strokeStyle = col(A * 0.7);
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 72; i++) {
          const q = coupler((i / 72) * 6.283);
          if (!q) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(q.Px2, q.Py2);
            started = true;
          } else ctx.lineTo(q.Px2, q.Py2);
        }
        ctx.stroke();
        const q = coupler(t * 0.7);
        if (q) {
          ctx.strokeStyle = col(A);
          ctx.beginPath();
          ctx.moveTo(Ax2, Ay2);
          ctx.lineTo(q.Cx, q.Cy);
          ctx.lineTo(q.Px2, q.Py2);
          ctx.lineTo(q.Dp[0], q.Dp[1]);
          ctx.lineTo(Bx2, By2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(q.Cx, q.Cy);
          ctx.lineTo(q.Dp[0], q.Dp[1]);
          ctx.stroke();
          for (const p of [[Ax2, Ay2], [Bx2, By2], [q.Cx, q.Cy], q.Dp, [q.Px2, q.Py2]]) {
            ctx.fillStyle = col(A * 1.3);
            ctx.beginPath();
            ctx.arc(p[0], p[1], 1.5, 0, 7);
            ctx.fill();
          }
        }
      } else if (m === 4) {
        // ASCENTRA · golden spiral
        for (let i = 0; i < 64; i++) {
          const th = i * 0.34 + t * 0.08, r = 3 * Math.exp(i * 0.045);
          if (r > 58) break;
          ctx.fillStyle = col(A * (0.4 + (0.6 * i) / 64));
          ctx.beginPath();
          ctx.arc(Math.cos(th) * r, Math.sin(th) * r, 0.9, 0, 7);
          ctx.fill();
        }
      } else if (m === 5) {
        // ASCENTRA · star polygon compass
        const n = 5 + G.p1, q = 2 + (G.p2 % 3);
        ctx.strokeStyle = col(A * 0.5);
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, 7);
        ctx.stroke();
        ctx.strokeStyle = col(A);
        ctx.beginPath();
        let v = 0;
        for (let i = 0; i <= n; i++) {
          const th = (v / n) * 6.283 - 1.57 + t * 0.06;
          if (i === 0) ctx.moveTo(Math.cos(th) * 50, Math.sin(th) * 50);
          else ctx.lineTo(Math.cos(th) * 50, Math.sin(th) * 50);
          v = (v + q) % n;
        }
        ctx.stroke();
      } else if (m === 6) {
        // ASCENTRA · string-art envelope
        const N = 13, sw = 0.5 + 0.5 * Math.sin(t * 0.4 + G.d1);
        ctx.strokeStyle = col(A * 0.75);
        for (let i = 0; i <= N; i++) {
          const f = (i / N) * (0.6 + 0.4 * sw);
          ctx.beginPath();
          ctx.moveTo(-52 + f * 104, 52);
          ctx.lineTo(-52, 52 - f * 104);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(52 - f * 104, -52);
          ctx.lineTo(52, -52 + f * 104);
          ctx.stroke();
        }
      } else if (m === 7) {
        // ASCENTRA · golden rectangle subdivision
        let rx = -44.5, ry = -27.5, rw = 89, rh = 55;
        ctx.strokeStyle = col(A * 0.55);
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.strokeStyle = col(A);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          if (rw > rh) {
            ctx.moveTo(rx + rh + rh, ry + rh);
            ctx.arc(rx + rh, ry + rh, rh, 0, -1.5708, true);
            ctx.moveTo(rx + rh, ry);
            ctx.lineTo(rx + rh, ry + rh);
            rx += rh;
            rw -= rh;
          } else {
            ctx.moveTo(rx + rw, ry + rw);
            ctx.arc(rx + rw, ry + rw, rw, -1.5708, -3.1416, true);
            ctx.moveTo(rx, ry + rw);
            ctx.lineTo(rx + rw, ry + rw);
            ry += rw;
            rh -= rw;
          }
        }
        ctx.stroke();
      } else if (m === 8) {
        // ASTRA · kepler orbit
        const a2 = 52, b2 = 33, cf = Math.sqrt(a2 * a2 - b2 * b2);
        ctx.save();
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = col(A * 0.7);
        ctx.beginPath();
        ctx.ellipse(0, 0, a2, b2, 0, 0, 6.283);
        ctx.stroke();
        ctx.restore();
        const E = t * 0.5 + G.d2;
        const px2 = a2 * Math.cos(E), py2 = b2 * Math.sin(E);
        ctx.fillStyle = col(A * 1.5);
        ctx.beginPath();
        ctx.arc(cf, 0, 2.2, 0, 7);
        ctx.fill();
        ctx.strokeStyle = col(A * 0.8);
        ctx.beginPath();
        ctx.moveTo(cf, 0);
        ctx.lineTo(px2, py2);
        ctx.stroke();
        ctx.fillStyle = col(A * 1.3);
        ctx.beginPath();
        ctx.arc(px2, py2, 1.7, 0, 7);
        ctx.fill();
        ctx.strokeStyle = col(A * 0.4);
        ctx.beginPath();
        ctx.moveTo(cf, 0);
        for (let i = 0; i <= 10; i++) {
          const e2 = E - 0.55 + i * 0.055;
          ctx.lineTo(a2 * Math.cos(e2), b2 * Math.sin(e2));
        }
        ctx.closePath();
        ctx.stroke();
      } else if (m === 9) {
        // ASTRA · lissajous
        ctx.beginPath();
        for (let i = 0; i <= 130; i++) {
          const s = (i / 130) * 6.283;
          const x = 52 * Math.sin(G.p1 * s + t * 0.22 + G.d2), y = 52 * Math.sin(G.p2 * s);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (m === 10) {
        // ASTRA · harmonograph
        ctx.beginPath();
        for (let i = 0; i <= 220; i++) {
          const dec = Math.exp(-i * 0.006);
          const x = 56 * dec * Math.sin(i * 0.11 + t * 0.15 + G.d1), y = 56 * dec * Math.sin(i * 0.127 + G.d2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // ASTRA · fourier synthesis
        ctx.beginPath();
        for (let i = 0; i <= 110; i++) {
          const x = -55 + (i / 110) * 110, s = (i / 110) * 4 * 3.1416 + t * 0.5;
          const y = 18 * (Math.sin(s) + Math.sin(3 * s) / 3 + Math.sin(5 * s) / 5);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  };
}
