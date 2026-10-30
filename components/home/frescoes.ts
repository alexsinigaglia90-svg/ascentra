// Animated line studies drawn into the three triptych panels.
// Ported from the "Ascentra Homepage" design handoff.

export type FrescoUpdate = (t: number, frame: number) => void;

type Attrs = Record<string, string | number>;
type Pt = [number, number];
type Vec3 = [number, number, number];

const SVG_NS = "http://www.w3.org/2000/svg";
const DEG = 57.29578;

function mk<K extends keyof SVGElementTagNameMap>(parent: Element, tag: K, attrs?: Attrs): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  if (attrs) for (const k in attrs) el.setAttribute(k, String(attrs[k]));
  parent.appendChild(el);
  return el;
}

function caption(root: Element, x: number, y: number, fill: string, txt: string) {
  const t = mk(root, "text", { x, y, fill, opacity: ".5", "font-size": "8.6", "letter-spacing": "1.6" });
  t.style.fontFamily = "var(--font-mono), monospace";
  t.textContent = txt;
  return t;
}

function gearPath(N: number, m: number, internal = false) {
  const r = (m * N) / 2;
  const p = (2 * Math.PI) / N;
  const rr = internal ? r + m : r - m * 1.15;
  const rt = internal ? r - m * 0.62 : r + m * 0.62;
  let d = "";
  for (let i = 0; i < N; i++) {
    const a = i * p;
    const q: Pt[] = [
      [rr, a - 0.3 * p],
      [rt, a - 0.125 * p],
      [rt, a + 0.125 * p],
      [rr, a + 0.3 * p],
    ];
    for (let j = 0; j < 4; j++) {
      d += (i === 0 && j === 0 ? "M" : "L") + (q[j][0] * Math.cos(q[j][1])).toFixed(1) + " " + (q[j][0] * Math.sin(q[j][1])).toFixed(1) + " ";
    }
  }
  return d + "Z";
}

function fxRoot(svg: SVGSVGElement) {
  const root = svg.querySelector("[data-fx]");
  if (!root) throw new Error("fresco: missing [data-fx] group");
  while (root.firstChild) root.removeChild(root.firstChild);
  return root;
}

// ── OPERIS · epicyclic gear train, hypocycloid, rolling cycloid, four-bar linkage ──
export function buildOperis(svg: SVGSVGElement): FrescoUpdate {
  const root = fxRoot(svg);
  const ink = "#a8c3a4";
  const g = mk(root, "g", { fill: "none", stroke: ink, "stroke-width": "1.3", "stroke-linecap": "round" });
  const cx = 230, cy = 336, m = 6.2, Ns = 30, Np = 15, Nr = 60;
  const rs = (m * Ns) / 2, rp = (m * Np) / 2, rr = (m * Nr) / 2, rc = rs + rp;

  const ring = mk(g, "g", { opacity: ".58", transform: "translate(" + cx + " " + cy + ")" });
  mk(ring, "path", { d: gearPath(Nr, m, true), "stroke-width": "1.15" });
  mk(ring, "circle", { r: (rr + m * 2.2).toFixed(1), opacity: ".6" });
  mk(ring, "circle", { r: (rr + m * 4.2).toFixed(1), opacity: ".2", "stroke-dasharray": "3 10" });

  let dA = "";
  for (let i = 0; i <= 300; i++) {
    const th = (i / 300) * Math.PI * 2;
    dA += (i ? "L" : "M") + (cx + (rr - rp) * Math.cos(th) + rp * Math.cos(3 * th)).toFixed(1) + " " + (cy + (rr - rp) * Math.sin(th) - rp * Math.sin(3 * th)).toFixed(1) + " ";
  }
  mk(g, "path", { d: dA, opacity: ".24", "stroke-width": "1", "stroke-dasharray": "2 7" });
  const trail = mk(g, "path", { opacity: ".95", "stroke-width": "1.7" });
  const head = mk(g, "circle", { r: "3.4", fill: ink, stroke: "none", opacity: ".95" });

  const arms = mk(g, "path", { opacity: ".45", "stroke-width": "1.1" });
  const sun = mk(g, "g");
  mk(sun, "path", { d: gearPath(Ns, m) });
  mk(sun, "circle", { r: (rs - m * 3).toFixed(1), opacity: ".4", "stroke-dasharray": "4 9" });
  mk(sun, "circle", { r: "17" });
  mk(sun, "circle", { r: "5.5", opacity: ".85" });
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3;
    mk(sun, "line", {
      x1: (17 * Math.cos(a)).toFixed(1),
      y1: (17 * Math.sin(a)).toFixed(1),
      x2: ((rs - m * 3) * Math.cos(a)).toFixed(1),
      y2: ((rs - m * 3) * Math.sin(a)).toFixed(1),
      opacity: ".5",
    });
  }
  const planets: SVGGElement[] = [];
  const mesh: SVGCircleElement[] = [];
  for (let k = 0; k < 3; k++) {
    const pg = mk(g, "g", { opacity: ".92" });
    mk(pg, "path", { d: gearPath(Np, m), "stroke-width": "1.15" });
    mk(pg, "circle", { r: "7" });
    mk(pg, "line", { x1: "0", y1: "0", x2: (rp - m).toFixed(1), y2: "0", opacity: ".75" });
    planets.push(pg);
    mesh.push(mk(g, "circle", { r: "2.3", fill: ink, stroke: "none" }));
  }

  const conv = mk(g, "path", { d: "M 8 566 C 104 540 158 596 234 570 C 310 544 364 598 454 568", opacity: ".3", "stroke-dasharray": "4 9" });
  const cl = conv.getTotalLength();
  const crates: SVGRectElement[] = [];
  for (let k = 0; k < 9; k++) crates.push(mk(g, "rect", { width: "8", height: "5.5", rx: "1", fill: "rgba(168,195,164,.7)", stroke: "none" }));

  const railY = 638, x0 = 58, span = 340, rw = 26;
  mk(g, "path", { d: "M 24 " + railY + " L 444 " + railY, opacity: ".28", "stroke-dasharray": "2 8" });
  const cyc = mk(g, "path", { opacity: ".5", "stroke-width": "1.05" });
  const wheel = mk(g, "g");
  mk(wheel, "circle", { r: rw, "stroke-width": "1.2" });
  mk(wheel, "circle", { r: (rw - 5).toFixed(1), opacity: ".35", "stroke-dasharray": "3 7" });
  mk(wheel, "circle", { r: "4" });
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    mk(wheel, "line", { x1: "0", y1: "0", x2: (rw * Math.cos(a)).toFixed(1), y2: (rw * Math.sin(a)).toFixed(1), opacity: ".45" });
  }
  const rim = mk(g, "circle", { r: "2.8", fill: ink, stroke: "none", opacity: ".9" });

  const A: Pt = [344, 692], D: Pt = [438, 692], la = 23, lb = 88, lc = 52;
  const ci = (p0: Pt, r0: number, p1: Pt, r1: number): Pt | null => {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], d = Math.hypot(dx, dy);
    if (d > r0 + r1 || d < Math.abs(r0 - r1) || !d) return null;
    const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r0 * r0 - a * a));
    return [p0[0] + (a * dx) / d + (hh * dy) / d, p0[1] + (a * dy) / d - (hh * dx) / d];
  };
  const fourbar = (th: number) => {
    const B: Pt = [A[0] + la * Math.cos(th), A[1] + la * Math.sin(th)];
    const C = ci(B, lb, D, lc);
    if (!C) return null;
    const ux = (C[0] - B[0]) / lb, uy = (C[1] - B[1]) / lb;
    const E: Pt = [B[0] + ux * lb * 0.56 - uy * 17, B[1] + uy * lb * 0.56 + ux * 17];
    return { B, C, E };
  };
  let dC = "", started = false;
  for (let i = 0; i <= 200; i++) {
    const s = fourbar((i / 200) * Math.PI * 2);
    if (s) {
      dC += (started ? "L" : "M") + s.E[0].toFixed(1) + " " + s.E[1].toFixed(1) + " ";
      started = true;
    }
  }
  mk(g, "path", { d: dC, opacity: ".32", "stroke-width": "1", "stroke-dasharray": "2 6" });
  const bar = mk(g, "path", { opacity: ".85", "stroke-width": "1.3" });
  const pinB = mk(g, "circle", { r: "2.5", fill: ink, stroke: "none", opacity: ".9" });
  const pinC = mk(g, "circle", { r: "2.5", fill: ink, stroke: "none", opacity: ".9" });
  mk(g, "path", { d: "M" + A[0] + " " + A[1] + "l-5 9 h10 z M" + D[0] + " " + D[1] + "l-5 9 h10 z", opacity: ".6" });

  caption(root, 24, 252, ink, "EPICYCLIC · i = 1 + Nr/Ns = 3.00");
  const c2 = caption(root, 24, 266, ink, "");
  const wc = 0.26;

  return (t, frame) => {
    const pc = t * wc;
    sun.setAttribute("transform", "translate(" + cx + " " + cy + ") rotate(" + (pc * 3 * DEG).toFixed(2) + ")");
    let ad = "";
    for (let k = 0; k < 3; k++) {
      const a = pc + k * 2.0944, px = cx + rc * Math.cos(a), py = cy + rc * Math.sin(a);
      planets[k].setAttribute("transform", "translate(" + px.toFixed(1) + " " + py.toFixed(1) + ") rotate(" + (-pc * 3 * DEG).toFixed(2) + ")");
      ad += "M" + cx + " " + cy + "L" + px.toFixed(1) + " " + py.toFixed(1) + " ";
      mesh[k].setAttribute("cx", (cx + rs * Math.cos(a)).toFixed(1));
      mesh[k].setAttribute("cy", (cy + rs * Math.sin(a)).toFixed(1));
      mesh[k].setAttribute("opacity", (0.3 + 0.4 * Math.abs(Math.sin(pc * 15 + k))).toFixed(2));
    }
    arms.setAttribute("d", ad);
    let td = "", hx = 0, hy = 0;
    for (let i = 0; i <= 40; i++) {
      const th = pc - (1 - i / 40) * 2.1;
      hx = cx + (rr - rp) * Math.cos(th) + rp * Math.cos(3 * th);
      hy = cy + (rr - rp) * Math.sin(th) - rp * Math.sin(3 * th);
      td += (i ? "L" : "M") + hx.toFixed(1) + " " + hy.toFixed(1) + " ";
    }
    trail.setAttribute("d", td);
    head.setAttribute("cx", hx.toFixed(1));
    head.setAttribute("cy", hy.toFixed(1));

    for (let k = 0; k < 9; k++) {
      const s = (t * 26 + (k * cl) / 9) % cl;
      const p = conv.getPointAtLength(s), q = conv.getPointAtLength((s + 6) % cl);
      crates[k].setAttribute("x", (p.x - 4).toFixed(1));
      crates[k].setAttribute("y", (p.y - 2.75).toFixed(1));
      crates[k].setAttribute("transform", "rotate(" + (Math.atan2(q.y - p.y, q.x - p.x) * DEG).toFixed(1) + " " + p.x.toFixed(1) + " " + p.y.toFixed(1) + ")");
    }

    const u = (t * 1.15) % (span / rw), wx = x0 + rw * u;
    wheel.setAttribute("transform", "translate(" + wx.toFixed(1) + " " + (railY - rw) + ") rotate(" + (u * DEG).toFixed(1) + ")");
    let cd = "";
    for (let i = 0; i <= 54; i++) {
      const uu = (u * i) / 54;
      cd += (i ? "L" : "M") + (x0 + rw * uu - rw * Math.sin(uu)).toFixed(1) + " " + (railY - rw + rw * Math.cos(uu)).toFixed(1) + " ";
    }
    cyc.setAttribute("d", cd);
    rim.setAttribute("cx", (x0 + rw * u - rw * Math.sin(u)).toFixed(1));
    rim.setAttribute("cy", (railY - rw + rw * Math.cos(u)).toFixed(1));

    const s4 = fourbar(t * 1.6);
    if (s4) {
      const f = (p: Pt) => p[0].toFixed(1) + " " + p[1].toFixed(1);
      bar.setAttribute("d", "M" + A[0] + " " + A[1] + "L" + f(s4.B) + "L" + f(s4.C) + "L" + D[0] + " " + D[1] + "M" + f(s4.B) + "L" + f(s4.E) + "L" + f(s4.C));
      pinB.setAttribute("cx", s4.B[0].toFixed(1));
      pinB.setAttribute("cy", s4.B[1].toFixed(1));
      pinC.setAttribute("cx", s4.C[0].toFixed(1));
      pinC.setAttribute("cy", s4.C[1].toFixed(1));
    }
    if (frame % 8 === 0) c2.textContent = "ω sun 3ω · planet −3ω · units placed " + Math.floor(((t * 26) / cl) * 9 + 148);
  };
}

// ── ASCENTRA · rotating sphere, loxodrome vs great circle, golden section ──
export function buildAscentra(svg: SVGSVGElement): FrescoUpdate {
  const root = fxRoot(svg);
  const ink = "#9cc4e4";
  const g = mk(root, "g", { fill: "none", stroke: ink, "stroke-width": "1.25", "stroke-linecap": "round" });
  const cx = 230, cy = 334, R = 166, PHI = 1.6180339887;

  const gold = mk(g, "g", { opacity: ".4" });
  let bx = cx - R, by = cy - R / PHI, bw = 2 * R, bh = (2 * R) / PHI;
  mk(gold, "rect", { x: bx.toFixed(1), y: by.toFixed(1), width: bw.toFixed(1), height: bh.toFixed(1), "stroke-dasharray": "6 8", opacity: ".7" });
  const arcs: SVGPathElement[] = [];
  for (let i = 0; i < 6; i++) {
    const s = Math.min(bw, bh);
    const ax = bx, ay = by;
    let sweep: string;
    if (i % 2 === 0) {
      bx += s;
      bw -= s;
      sweep = "M" + ax.toFixed(1) + " " + (ay + s).toFixed(1) + "A" + s.toFixed(1) + " " + s.toFixed(1) + " 0 0 1 " + (ax + s).toFixed(1) + " " + ay.toFixed(1);
    } else {
      by += s;
      bh -= s;
      sweep = "M" + ax.toFixed(1) + " " + ay.toFixed(1) + "A" + s.toFixed(1) + " " + s.toFixed(1) + " 0 0 1 " + (ax + s).toFixed(1) + " " + (ay + s).toFixed(1);
    }
    mk(gold, "rect", { x: ax.toFixed(1), y: ay.toFixed(1), width: s.toFixed(1), height: s.toFixed(1), opacity: ".35", "stroke-width": "1" });
    arcs.push(mk(g, "path", { d: sweep, opacity: ".25", "stroke-width": "1.4" }));
    if (bw < 6 || bh < 6) break;
  }

  const back = mk(g, "path", { opacity: ".16", "stroke-width": "1", "stroke-dasharray": "3 6" });
  const front = mk(g, "path", { opacity: ".6" });
  const loxB = mk(g, "path", { opacity: ".2", "stroke-width": "1" });
  const loxF = mk(g, "path", { opacity: ".95", "stroke-width": "1.6" });
  const gcF = mk(g, "path", { opacity: ".9", "stroke-width": "1.5", stroke: "#e9d1a8" });
  const ship = mk(g, "circle", { r: "3.6", fill: "#e9d1a8", stroke: "none" });
  const bA = mk(g, "circle", { r: "3.2", fill: ink, stroke: "none", opacity: ".9" });
  const bB = mk(g, "circle", { r: "3.2", fill: ink, stroke: "none", opacity: ".9" });
  mk(g, "circle", { cx, cy, r: R, opacity: ".5" });
  mk(g, "circle", { cx, cy, r: (R + 13).toFixed(0), opacity: ".22", "stroke-dasharray": "1.5 9" });

  const rad = Math.PI / 180;
  const sph = (la: number, lo: number): Vec3 => [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
  const curves: Vec3[][] = [];
  for (let k = 0; k < 8; k++) {
    const lo = (k * Math.PI) / 8, c: Vec3[] = [];
    for (let i = 0; i <= 44; i++) c.push(sph(-Math.PI / 2 + (i / 44) * Math.PI, lo));
    curves.push(c);
  }
  [-60, -30, 0, 30, 60].forEach((la) => {
    const c: Vec3[] = [];
    for (let i = 0; i <= 60; i++) c.push(sph(la * rad, (i / 60) * Math.PI * 2));
    curves.push(c);
  });
  const lox: Vec3[] = [], beta = 52 * rad;
  for (let i = 0; i <= 300; i++) {
    const la = (-78 + (i / 300) * 156) * rad;
    lox.push(sph(la, Math.tan(beta) * Math.log(Math.tan(Math.PI / 4 + la / 2))));
  }
  const P1 = [22 * rad, -16 * rad], P2 = [57 * rad, 44 * rad];
  const v1 = sph(P1[0], P1[1]), v2 = sph(P2[0], P2[1]);
  const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2], sig = Math.acos(Math.max(-1, Math.min(1, dot)));
  const gc: Vec3[] = [];
  for (let i = 0; i <= 90; i++) {
    const f = i / 90, s1 = Math.sin((1 - f) * sig) / Math.sin(sig), s2 = Math.sin(f * sig) / Math.sin(sig);
    gc.push([v1[0] * s1 + v2[0] * s2, v1[1] * s1 + v2[1] * s2, v1[2] * s1 + v2[2] * s2]);
  }
  const dpsi = Math.log(Math.tan(Math.PI / 4 + P2[0] / 2) / Math.tan(Math.PI / 4 + P1[0] / 2));
  const brg = Math.atan2(P2[1] - P1[1], dpsi);
  const rhumb = Math.abs((P2[0] - P1[0]) / Math.cos(brg));
  const excess = ((rhumb / sig - 1) * 100).toFixed(1);
  const brgTxt = ((brg / rad + 360) % 360).toFixed(0).padStart(3, "0");

  caption(root, 24, 252, ink, "λ = tan β · ln tan(π/4 + φ/2)");
  const c2 = caption(root, 24, 266, "#e9d1a8", "");
  caption(root, 24, 280, ink, "φ = (1+√5)/2 = 1.618034");

  return (t, frame) => {
    const yaw = t * 0.13, tilt = 0.34 + 0.08 * Math.sin(t * 0.19);
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
    const pr = (p: Vec3): Vec3 => {
      const x = p[0] * cyw + p[2] * syw, z0 = -p[0] * syw + p[2] * cyw;
      const y = p[1] * ct - z0 * st, z = p[1] * st + z0 * ct;
      return [cx + R * x, cy - R * y, z];
    };
    let fd = "", bd = "";
    for (let c = 0; c < curves.length; c++) {
      let pf = false, pb = false;
      for (let i = 0; i < curves[c].length; i++) {
        const q = pr(curves[c][i]);
        if (q[2] >= 0) {
          fd += (pf ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1) + " ";
          pf = true;
          pb = false;
        } else {
          bd += (pb ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1) + " ";
          pb = true;
          pf = false;
        }
      }
    }
    front.setAttribute("d", fd);
    back.setAttribute("d", bd);
    let lf = "", lb = "", pf = false, pb = false;
    for (let i = 0; i < lox.length; i++) {
      const q = pr(lox[i]);
      if (q[2] >= 0) {
        lf += (pf ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1) + " ";
        pf = true;
        pb = false;
      } else {
        lb += (pb ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1) + " ";
        pb = true;
        pf = false;
      }
    }
    loxF.setAttribute("d", lf);
    loxB.setAttribute("d", lb);
    let gd = "";
    pf = false;
    for (let i = 0; i < gc.length; i++) {
      const q = pr(gc[i]);
      if (q[2] >= -0.05) {
        gd += (pf ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1) + " ";
        pf = true;
      } else pf = false;
    }
    gcF.setAttribute("d", gd);
    const sq = pr(gc[Math.floor(((t * 0.11) % 1) * (gc.length - 1))]);
    ship.setAttribute("cx", sq[0].toFixed(1));
    ship.setAttribute("cy", sq[1].toFixed(1));
    ship.setAttribute("opacity", sq[2] >= 0 ? ".95" : ".2");
    const q1 = pr(v1), q2 = pr(v2);
    bA.setAttribute("cx", q1[0].toFixed(1));
    bA.setAttribute("cy", q1[1].toFixed(1));
    bA.setAttribute("opacity", q1[2] >= 0 ? ".9" : ".2");
    bB.setAttribute("cx", q2[0].toFixed(1));
    bB.setAttribute("cy", q2[1].toFixed(1));
    bB.setAttribute("opacity", q2[2] >= 0 ? ".9" : ".2");
    const hi = Math.floor(t * 0.5) % arcs.length;
    for (let i = 0; i < arcs.length; i++) arcs[i].setAttribute("opacity", i === hi ? (0.85 - 0.5 * ((t * 0.5) % 1)).toFixed(2) : ".2");
    if (frame % 8 === 0) c2.textContent = "bearing " + brgTxt + "° · rhumb +" + excess + "% vs great circle";
  };
}

// ── ASTRA · tesseract, phyllotaxis, superformula, de Casteljau ──
export function buildAstra(svg: SVGSVGElement): FrescoUpdate {
  const root = fxRoot(svg);
  const ink = "#d8bf98";
  const g = mk(root, "g", { fill: "none", stroke: ink, "stroke-width": "1.25", "stroke-linecap": "round" });
  const GA = Math.PI * (3 - Math.sqrt(5));

  const P: Pt[] = [[20, 604], [104, 210], [350, 432], [448, 172]];
  const bezAt = (u: number): Pt => {
    const w = [(1 - u) ** 3, 3 * u * (1 - u) ** 2, 3 * u * u * (1 - u), u ** 3];
    return [P[0][0] * w[0] + P[1][0] * w[1] + P[2][0] * w[2] + P[3][0] * w[3], P[0][1] * w[0] + P[1][1] * w[1] + P[2][1] * w[2] + P[3][1] * w[3]];
  };
  mk(g, "path", { d: "M" + P.map((p) => p[0] + " " + p[1]).join("L"), opacity: ".22", "stroke-width": "1", "stroke-dasharray": "3 7" });
  let bez = "";
  for (let i = 0; i <= 80; i++) {
    const b = bezAt(i / 80);
    bez += (i ? "L" : "M") + b[0].toFixed(1) + " " + b[1].toFixed(1) + " ";
  }
  mk(g, "path", { d: bez, opacity: ".2", "stroke-width": "1" });
  const bezLive = mk(g, "path", { opacity: ".8", "stroke-width": "1.6" });
  const cast = mk(g, "path", { opacity: ".45", "stroke-width": "1", "stroke-dasharray": "2 5" });
  const castPt = mk(g, "circle", { r: "3.2", fill: ink, stroke: "none", opacity: ".95" });
  P.forEach((p) => mk(g, "rect", { x: p[0] - 2.6, y: p[1] - 2.6, width: "5.2", height: "5.2", opacity: ".55", "stroke-width": "1" }));

  const tcx = 228, tcy = 306, ts = 132;
  const verts: number[][] = [];
  for (let i = 0; i < 16; i++) verts.push([i & 1 ? 0.5 : -0.5, i & 2 ? 0.5 : -0.5, i & 4 ? 0.5 : -0.5, i & 8 ? 0.5 : -0.5]);
  const edges: Pt[] = [];
  for (let i = 0; i < 16; i++)
    for (let j = i + 1; j < 16; j++) {
      const x = i ^ j;
      if (!(x & (x - 1))) edges.push([i, j]);
    }
  const tNear = mk(g, "path", { opacity: ".85", "stroke-width": "1.35" });
  const tFar = mk(g, "path", { opacity: ".34", "stroke-width": "1.05" });
  const tDots: SVGCircleElement[] = [];
  for (let k = 0; k < 4; k++) tDots.push(mk(g, "circle", { r: "2.2", fill: ink, stroke: "none", opacity: ".8" }));

  const pcx = 108, pcy = 524, pc = 7.1, pn = 232;
  const clip = mk(root, "clipPath", { id: "astPhy" });
  const clipC = mk(clip, "circle", { cx: pcx, cy: pcy, r: "0" });
  const phy = mk(g, "g", { "clip-path": "url(#astPhy)" });
  const pts: Pt[] = [];
  for (let n = 0; n < pn; n++) {
    const r = pc * Math.sqrt(n), a = n * GA;
    pts.push([pcx + r * Math.cos(a), pcy + r * Math.sin(a)]);
  }
  pts.forEach((p, n) =>
    mk(phy, "circle", { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: (1.1 + (n / pn) * 1.5).toFixed(2), fill: ink, stroke: "none", opacity: (0.3 + (n / pn) * 0.5).toFixed(2) }),
  );
  [13, 21].forEach((fam, fi) => {
    let d = "";
    for (let s = 0; s < fam; s++) {
      let first = true;
      for (let n = s; n < pn - fam; n += fam) {
        d += (first ? "M" : "L") + pts[n][0].toFixed(1) + " " + pts[n][1].toFixed(1) + " ";
        first = false;
      }
    }
    mk(phy, "path", { d, fill: "none", stroke: ink, opacity: fi ? ".22" : ".3", "stroke-width": ".9", "stroke-dasharray": "3 8" });
  });
  mk(g, "circle", { cx: pcx, cy: pcy, r: (pc * Math.sqrt(pn) + 8).toFixed(1), opacity: ".25", "stroke-dasharray": "2 8" });

  const scx = 356, scy = 540;
  const sup = mk(g, "path", { opacity: ".8", "stroke-width": "1.3" });
  const supG = mk(g, "circle", { cx: scx, cy: scy, r: "84", opacity: ".2", "stroke-dasharray": "2 9" });

  caption(root, 24, 252, ink, "θn = n · 137.507° · r = c√n");
  const c2 = caption(root, 24, 266, ink, "");
  const fib = [3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

  return (t, frame) => {
    const al = t * 0.29, be = t * 0.21, ga = t * 0.11;
    const proj = verts.map((v) => {
      const x1 = v[0] * Math.cos(al) - v[3] * Math.sin(al), w1 = v[0] * Math.sin(al) + v[3] * Math.cos(al);
      const y1 = v[1] * Math.cos(be) - v[2] * Math.sin(be), z1 = v[1] * Math.sin(be) + v[2] * Math.cos(be);
      const x2 = x1 * Math.cos(ga) - y1 * Math.sin(ga), y2 = x1 * Math.sin(ga) + y1 * Math.cos(ga);
      const k = 2.4 / (3.2 - w1), X = x2 * k, Y = y2 * k, Z = z1 * k;
      const k2 = 2.3 / (3.0 - Z);
      return [tcx + ts * X * k2, tcy + ts * Y * k2, w1 + Z * 0.5];
    });
    let nd = "", fd = "";
    for (let e = 0; e < edges.length; e++) {
      const a = proj[edges[e][0]], b = proj[edges[e][1]];
      const seg = "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1) + " ";
      if (a[2] + b[2] > 0) nd += seg;
      else fd += seg;
    }
    tNear.setAttribute("d", nd);
    tFar.setAttribute("d", fd);
    for (let k = 0; k < 4; k++) {
      tDots[k].setAttribute("cx", proj[k * 5][0].toFixed(1));
      tDots[k].setAttribute("cy", proj[k * 5][1].toFixed(1));
    }

    const u = (Math.sin(t * 0.42) + 1) / 2;
    const L = (p: Pt, q: Pt, f: number): Pt => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
    const a1 = L(P[0], P[1], u), a2 = L(P[1], P[2], u), a3 = L(P[2], P[3], u);
    const b1 = L(a1, a2, u), b2 = L(a2, a3, u), cpt = L(b1, b2, u);
    const f = (p: Pt) => p[0].toFixed(1) + " " + p[1].toFixed(1);
    cast.setAttribute("d", "M" + f(a1) + "L" + f(a2) + "L" + f(a3) + "M" + f(b1) + "L" + f(b2));
    castPt.setAttribute("cx", cpt[0].toFixed(1));
    castPt.setAttribute("cy", cpt[1].toFixed(1));
    let bl = "";
    for (let i = 0; i <= 44; i++) bl += (i ? "L" : "M") + f(bezAt((u * i) / 44)) + " ";
    bezLive.setAttribute("d", bl);

    clipC.setAttribute("r", (pc * Math.sqrt(pn) * (0.25 + 0.75 * ((t * 0.055) % 1))).toFixed(1));
    phy.setAttribute("transform", "rotate(" + (t * 2.1).toFixed(2) + " " + pcx + " " + pcy + ")");

    const mm = 5.5 + 3 * Math.sin(t * 0.13), n1 = 0.42 + 0.3 * Math.sin(t * 0.17), n2 = 1.1 + 0.7 * Math.sin(t * 0.11 + 1);
    let sd = "", mx = 0;
    const rs: number[] = [];
    for (let i = 0; i <= 200; i++) {
      const th = (i / 200) * Math.PI * 2;
      const r = Math.pow(Math.pow(Math.abs(Math.cos((mm * th) / 4)), n2) + Math.pow(Math.abs(Math.sin((mm * th) / 4)), n2), -1 / n1);
      rs.push(isFinite(r) ? r : 0);
      if (isFinite(r) && r > mx) mx = r;
    }
    const k = mx > 0 ? 78 / mx : 1;
    for (let i = 0; i <= 200; i++) {
      const th = (i / 200) * Math.PI * 2 + t * 0.08;
      sd += (i ? "L" : "M") + (scx + rs[i] * k * Math.cos(th)).toFixed(1) + " " + (scy + rs[i] * k * Math.sin(th)).toFixed(1) + " ";
    }
    sup.setAttribute("d", sd + "Z");
    supG.setAttribute("opacity", (0.14 + 0.1 * Math.sin(t * 0.5)).toFixed(2));
    if (frame % 8 === 0) {
      const i = Math.floor(t * 0.6) % (fib.length - 1);
      c2.textContent = "F" + (i + 4) + "/F" + (i + 3) + " = " + (fib[i + 1] / fib[i]).toFixed(6) + " → φ";
    }
  };
}
