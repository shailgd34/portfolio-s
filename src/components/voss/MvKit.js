'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FONTS,
  colorsOf,
  cssVars,
  fontsOf,
  siteFontCss,
  useFonts,
  useLive,
  useReduced,
  useStill,
  useSize,
  useOn,
  useScrollVars,
  clamp01,
  easeIO,
  rise,
  Eyebrow,
  Head,
  onTick,
  listOf,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';

// ---- THE KIT: the tools as rental-house EQUIPMENT TAGS (a punched hole, a string, a mono label and a tiny category line).
// When the table comes into view the tags DROP onto it and pile up (a small verlet sim: every tag = 3 particles on a rigid stick,
// colliding as circles with the floor, the walls and each other; one shared rAF, sleeps when still). Past --sp ≈ sortAt the pile
// SORTS itself into two neat columns, Design / Code; scrolling back up drops them into a pile again. Drag a tag to throw it (fine pointers).
// Hover: the tag swings on its string. Phone / still / reduced motion: the sorted final state as plain lists. ----

const ktPad = (n) => String(n).padStart(2, '0');

const ktTools = (s, rk) => {
  const R = listOf(rk).map((x) => x.toLowerCase());
  return listOf(s)
    .map((x) => {
      const [a, b] = x.split('|').map((y) => (y || '').trim());
      return {
        name: a || '',
        kind: b || '',
        right: R.includes((b || '').toLowerCase()),
      };
    })
    .filter((t) => t.name)
    .slice(0, 32);
};

const KtFace = ({ t, idx, M, D }) => (
  <span className={`mvkt-ti ${t.right ? 'is-code' : 'is-design'}`}>
    <svg className="mvkt-str" viewBox="0 0 60 40" aria-hidden>
      <path d="M31 21c-8-2-13-9-17-14C10 2 5 1 1 3" />
    </svg>
    <span className="mvkt-face">
      <i className="mvkt-hole" aria-hidden />
      <span className="mvkt-lb" style={D}>
        {t.name}
      </span>
      <span className="mvkt-cat" style={M}>
        {t.kind} · {ktPad(idx + 1)}
      </span>
    </span>
  </span>
);

export default function MvKit(props = {}) {
  const {
    eyebrow = 'FRAME 05 — Tools',
    title = 'Design *and* code,|same hands.',
    intro = 'The kit I bring to every project. Half of it draws, half of it ships — and I use all of it myself.',
    tools = 'Figma|Design;Framer|Design;Canva|Design;Adobe Photoshop|Design;Illustrator|Design;Protopie|Prototyping;InDesign|Design;Figjam|Design;MIRO|Design;AI Tools|Design;React|Code;Next.js|Code;TypeScript|Code;Tailwind|Code;Bootstrap|Code;WordPress|Code;Git|Code;hotjar|Analytics;',
    leftTitle = 'Design',
    rightTitle = 'Code',
    rightKinds = 'Code',
    tableLabel = 'Kit check · load-in',
    hint = 'Drag a tag to throw it',
    sortAt = 0.55,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();

  const root = useRef(null);
  const table = useRef(null);
  const tagEls = useRef([]);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm);

  const TL = ktTools(tools, rightKinds);
  const L = TL.filter((t) => !t.right),
    Rr = TL.filter((t) => t.right);
  const sim = live && !rm && !still && !phone && TL.length > 0;
  const spRef = useRef(0.5);

  useScrollVars(root, sim, rm, (sp) => {
    spRef.current = sp;
  });

  const [sorted, setSorted] = useState(false);
  const [geo, setGeo] = useState(null);
  const [fine, setFine] = useState(false);
  const TW = tab ? 164 : 188,
    TH = tab ? 52 : 58,
    GAP = 12;
  const sig = TL.map((t) => t.name + t.right).join(',');

  useEffect(() => {
    if (!sim || !table.current) return;
    const tb = table.current;
    const N = TL.length;
    const r = TH / 2,
      half = (TW - TH) / 2;
    const isFine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    setFine(isFine);

    // ---- geometry: two columns, each with as many sub-columns as fit ----
    let W = tb.clientWidth,
      H = 0;
    let slots = [];
    const layout = () => {
      W = tb.clientWidth;
      const pad = 28,
        mid = 36;
      const cw = (W - pad * 2 - mid) / 2;
      const per = Math.max(1, Math.min(3, Math.floor((cw + GAP) / (TW + GAP))));
      const y0 = 92;
      const rowsL = Math.ceil(L.length / per),
        rowsR = Math.ceil(Rr.length / per);
      const rows = Math.max(rowsL, rowsR, 1);
      H = Math.max(tab ? 400 : 430, y0 + rows * (TH + GAP) + 40);
      const cx = [pad, pad + cw + mid];
      let li = 0,
        ri = 0;
      slots = TL.map((t) => {
        const k = t.right ? ri++ : li++;
        const col = t.right ? 1 : 0;
        return {
          x: cx[col] + (k % per) * (TW + GAP) + TW / 2,
          y: y0 + Math.floor(k / per) * (TH + GAP) + TH / 2,
        };
      });
      setGeo({ H, hx: cx, hy: 30 });
    };
    layout();

    // ---- bodies ----
    const rnd = (a, b) => a + Math.random() * (b - a);
    const place = (cx, cy, a) =>
      [-1, 0, 1].map((s) => {
        const x = cx + Math.cos(a) * half * s,
          y = cy + Math.sin(a) * half * s;
        return { x, y, ox: x, oy: y };
      });

    const bodies = TL.map((_, i) => ({
      p: place(rnd(0.12, 0.88) * W, -TH - 30, rnd(-0.7, 0.7)),
      live: false,
      spawn: i * 95 + rnd(0, 60),
      pose: { x: 0, y: -200, a: 0 },
      tw: null,
    }));

    let mode = 'wait',
      t0 = 0,
      calm = 0,
      drag = -1,
      dx = 0,
      dy = 0,
      px = 0,
      py = 0,
      vis = true,
      lastSorted = false;

    const io = new IntersectionObserver(
      (es) => {
        const e = es[0];
        vis = e.isIntersecting;
        if (
          e.isIntersecting &&
          e.intersectionRatio > 0.22 &&
          mode === 'wait'
        ) {
          mode = 'pile';
          t0 = performance.now();
        }
      },
      { threshold: [0, 0.25, 0.5] }
    );
    io.observe(tb);

    const ro = new ResizeObserver(() => {
      if (Math.abs(tb.clientWidth - W) > 2) {
        layout();
        for (const b of bodies)
          for (const q of b.p) {
            q.x = Math.min(W - r, q.x);
            q.ox = q.x;
          }
      }
    });
    ro.observe(tb);

    const G = 0.16,
      SUB = 2;
    const step = () => {
      const fl = H - 16;
      for (let s = 0; s < SUB; s++) {
        for (const b of bodies) {
          if (!b.live) continue;
          for (const q of b.p) {
            const vx = (q.x - q.ox) * 0.994,
              vy = (q.y - q.oy) * 0.994;
            q.ox = q.x;
            q.oy = q.y;
            q.x += vx;
            q.y += vy + G;
          }
        }
        for (let it = 0; it < 5; it++) {
          for (const b of bodies) {
            if (!b.live) continue;
            const P = b.p;
            const st = (a, c2, len) => {
              const ddx = c2.x - a.x,
                ddy = c2.y - a.y;
              const d = Math.hypot(ddx, ddy) || 0.001;
              const k = ((d - len) / d) * 0.5;
              a.x += ddx * k;
              a.y += ddy * k;
              c2.x -= ddx * k;
              c2.y -= ddy * k;
            };
            st(P[0], P[1], half);
            st(P[1], P[2], half);
            st(P[0], P[2], half * 2);
          }
          for (let i = 0; i < N; i++) {
            const A = bodies[i];
            if (!A.live) continue;
            for (let j = i + 1; j < N; j++) {
              const Bb = bodies[j];
              if (!Bb.live) continue;
              if (
                Math.abs(A.p[1].x - Bb.p[1].x) > TW + 4 ||
                Math.abs(A.p[1].y - Bb.p[1].y) > TW + 4
              )
                continue;
              for (const a of A.p)
                for (const b2 of Bb.p) {
                  const ddx = b2.x - a.x,
                    ddy = b2.y - a.y;
                  const d2 = ddx * ddx + ddy * ddy;
                  if (d2 < 4 * r * r && d2 > 0.0001) {
                    const d = Math.sqrt(d2);
                    const k = ((2 * r - d) / d) * 0.5;
                    const wa = i === drag ? 0 : 1,
                      wb = j === drag ? 0 : 1;
                    const sw = wa + wb || 1;
                    a.x -= (ddx * k * 2 * wa) / sw;
                    a.y -= (ddy * k * 2 * wa) / sw;
                    b2.x += (ddx * k * 2 * wb) / sw;
                    b2.y += (ddy * k * 2 * wb) / sw;
                  }
                }
            }
          }
          for (const b of bodies) {
            if (!b.live) continue;
            for (const q of b.p) {
              if (q.y > fl - r) {
                q.y = fl - r;
                q.ox = q.x - (q.x - q.ox) * 0.7;
              }
              if (q.x < r) {
                q.x = r;
                q.ox = q.x + (q.x - q.ox) * -0.4;
              }
              if (q.x > W - r) {
                q.x = W - r;
                q.ox = q.x + (q.x - q.ox) * -0.4;
              }
            }
          }
        }
      }
    };

    const down = (e) => {
      const el = e.target.closest?.('.mvkt-tag');
      if (!el || !isFine) return;
      const i = Number(el.dataset.i);
      if (!(i >= 0)) return;
      const a = tb.getBoundingClientRect();
      px = e.clientX - a.left;
      py = e.clientY - a.top;
      const bo = bodies[i];
      const cx = mode === 'sorted' ? bo.pose.x : bo.p[1].x,
        cy = mode === 'sorted' ? bo.pose.y : bo.p[1].y;
      dx = px - cx;
      dy = py - cy;
      drag = i;
      bo.live = bo.live || mode !== 'wait';
      calm = 0;
      el.setPointerCapture?.(e.pointerId);
      tb.classList.add('is-drag');
      e.preventDefault();
    };

    const move = (e) => {
      if (drag < 0) return;
      const a = tb.getBoundingClientRect();
      px = e.clientX - a.left;
      py = e.clientY - a.top;
    };

    const up = () => {
      if (drag < 0) return;
      const bo = bodies[drag];
      if (mode === 'sorted')
        bo.tw = {
          t0: performance.now(),
          fx: bo.pose.x,
          fy: bo.pose.y,
          fa: bo.pose.a,
        };
      drag = -1;
      calm = 0;
      tb.classList.remove('is-drag');
    };

    tb.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);

    const norm = (a) => {
      let x = a % (Math.PI * 2);
      if (x > Math.PI) x -= Math.PI * 2;
      if (x < -Math.PI) x += Math.PI * 2;
      return x;
    };

    const off = onTick((now) => {
      if (!vis) return;
      const sp = spRef.current;

      // sort / unsort with a little hysteresis
      if (
        mode !== 'sorted' &&
        (sp > sortAt || (mode === 'pile' && now - t0 > 1300 && drag < 0)) &&
        (mode === 'pile' || mode === 'wait')
      ) {
        if (mode === 'wait') {
          for (const b of bodies) {
            b.p = place(rnd(0.1, 0.9) * W, H - 60, rnd(-0.3, 0.3));
          }
        }
        mode = 'sorted';
        let k = 0;
        for (const b of bodies) {
          const cx = b.live ? b.p[1].x : b.p[1].x,
            cy = b.live ? b.p[1].y : -TH * 2;
          const a = b.live
            ? norm(Math.atan2(b.p[2].y - b.p[0].y, b.p[2].x - b.p[0].x))
            : 0;
          b.pose = { x: cx, y: cy, a };
          b.tw = { t0: now + k++ * 45, fx: cx, fy: cy, fa: a };
          b.live = true;
        }
      }

      if ((mode === 'sorted') !== lastSorted) {
        lastSorted = mode === 'sorted';
        setSorted(lastSorted);
      }

      if (mode === 'pile') {
        const t = now - t0;
        for (const b of bodies)
          if (!b.live && t > b.spawn) {
            b.live = true;
            for (const q of b.p) {
              q.ox = q.x - rnd(-1.5, 1.5);
              q.oy = q.y - 2;
            }
          }
        if (drag >= 0) {
          const b = bodies[drag];
          const tx = px - dx,
            ty = py - dy;
          const mx = tx - b.p[1].x,
            my = ty - b.p[1].y;
          for (const q of b.p) {
            q.ox = q.x;
            q.oy = q.y;
            q.x += mx * 0.5;
            q.y += my * 0.5;
          }
        }
        let mv = 0;
        for (const b of bodies)
          if (b.live)
            mv +=
              Math.abs(b.p[1].x - b.p[1].ox) + Math.abs(b.p[1].y - b.p[1].oy);
        const allIn = bodies.every((b) => b.live);
        calm = mv < 0.02 * N && allIn && drag < 0 ? calm + 1 : 0;
        if (calm < 40) step();
        for (const b of bodies) {
          if (!b.live) {
            b.pose = { x: b.p[1].x, y: -TH * 2, a: 0 };
            continue;
          }
          b.pose = {
            x: b.p[1].x,
            y: b.p[1].y,
            a: Math.atan2(b.p[2].y - b.p[0].y, b.p[2].x - b.p[0].x),
          };
        }
      } else if (mode === 'sorted') {
        bodies.forEach((b, i) => {
          const sl = slots[i];
          if (!sl) return;
          if (i === drag) {
            b.pose = { x: px - dx, y: py - dy, a: b.pose.a * 0.85 };
            return;
          }
          if (b.tw) {
            const k = easeIO(clamp01((now - b.tw.t0) / 820));
            b.pose = {
              x: b.tw.fx + (sl.x - b.tw.fx) * k,
              y:
                b.tw.fy +
                (sl.y - b.tw.fy) * k -
                Math.sin(k * Math.PI) * 40,
              a: b.tw.fa * (1 - k),
            };
            if (k >= 1) b.tw = null;
          } else b.pose = { x: sl.x, y: sl.y, a: 0 };
        });
      }

      for (let i = 0; i < N; i++) {
        const el = tagEls.current[i];
        if (!el) continue;
        const p = bodies[i].pose;
        const tr = `translate3d(${(p.x - TW / 2).toFixed(1)}px,${(p.y - TH / 2).toFixed(1)}px,0) rotate(${p.a.toFixed(4)}rad)`;
        if (el.__tr !== tr) {
          el.__tr = tr;
          el.style.transform = tr;
        }
      }
    });

    return () => {
      off();
      io.disconnect();
      ro.disconnect();
      tb.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [sim, sig, TW, TH, sortAt]);

  const col = (t, arr) => (
    <div className="mvkt-col">
      <h3 className="mvkt-ch" style={D}>
        {t}
        <span style={M}>{ktPad(arr.length)}</span>
      </h3>
      <ul className="mvkt-list">
        {arr.map((x, i) => (
          <li key={i} className="mvkt-stag">
            <KtFace t={x} idx={TL.indexOf(x)} M={M} D={D} />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section
      ref={root}
      id="tools"
      className={`mv mv-sec mvkt${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-in' : ''}${sim ? ' is-sim' : ''}${sorted ? ' is-sorted' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        '--tw': `${TW}px`,
        '--th': `${TH}px`,
        ...(props.style || {}),
      }}
      aria-labelledby="mvkt-h"
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_KT + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvkt-top">
          <div className="mvkt-tl">
            <Eyebrow text={eyebrow} on={on} M={M} />
            <div id="mvkt-h">
              <Head
                text={title}
                on={on}
                D={D}
                size="clamp(40px,4.3vw,64px)"
                lh={0.95}
                delay={120}
                style={{ fontStretch: '115%', fontWeight: 760 }}
              />
            </div>
          </div>
          {intro && (
            <p className="mvkt-intro" style={rise(on, 360, 14)}>
              {intro}
            </p>
          )}
        </header>

        {TL.length > 0 &&
          (sim ? (
            <div
              ref={table}
              className="mvkt-table"
              style={{ height: geo ? geo.H : 480 }}
            >
              {geo &&
                [leftTitle, rightTitle].map((t, k) => (
                  <h3
                    key={k}
                    className="mvkt-ch mvkt-hh"
                    style={{
                      ...D,
                      left: geo.hx[k],
                      top: geo.hy,
                    }}
                  >
                    {t}
                    <span style={M}>
                      {ktPad(k ? Rr.length : L.length)}
                    </span>
                  </h3>
                ))}
              <i className="mvkt-div" aria-hidden />
              <ul
                className="mvkt-pile"
                aria-label={`${leftTitle}, ${rightTitle}`}
              >
                {TL.map((t, i) => (
                  <li
                    key={t.name + i}
                    ref={(el) => {
                      tagEls.current[i] = el;
                    }}
                    data-i={i}
                    className="mvkt-tag"
                    style={{
                      transform: 'translate3d(0,-200px,0)',
                    }}
                  >
                    <KtFace t={t} idx={i} M={M} D={D} />
                  </li>
                ))}
              </ul>
              <p className="mvkt-lab" style={M}>
                <span>
                  {tableLabel} · {ktPad(TL.length)}
                </span>
                {fine && hint && (
                  <span className="mvkt-hint">{hint}</span>
                )}
              </p>
            </div>
          ) : (
            <div className="mvkt-cols">
              {col(leftTitle, L)}
              {col(rightTitle, Rr)}
            </div>
          ))}
      </div>
    </section>
  );
}

const CSS_KT = `
.mvkt{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(96px,10vw,160px) 0}
.mvkt .mv-hd{font-stretch:115%} .mvkt .mv-it{display:inline-block;font-weight:inherit;color:var(--mv-ink);line-height:1.02;padding:0 .07em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .72s steps(8) var(--pd,600ms)} .mvkt .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvkt-top{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-bottom:clamp(40px,5vw,72px)} .mvkt-tl{display:grid;gap:22px}
.mvkt-intro{max-width:380px;margin:0;font-size:17px;line-height:1.5;color:var(--mv-mut)}
/* the table */
.mvkt-table{position:relative;overflow:hidden;border-radius:10px;background:color-mix(in srgb,var(--mv-ink) 4.5%,var(--mv-bone));box-shadow:inset 0 0 0 1px var(--mv-fog);touch-action:pan-y;user-select:none;-webkit-user-select:none}
.mvkt-table::before{content:"";position:absolute;left:0;right:0;bottom:0;height:16px;background:color-mix(in srgb,var(--mv-ink) 8%,var(--mv-bone));box-shadow:0 -1px 0 var(--mv-fog)}
.mvkt-table::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(50% 70% at 30% 0%,rgba(255,241,218,.55),rgba(255,226,180,0) 70%);mix-blend-mode:screen}
.mvkt-div{position:absolute;left:50%;top:22px;bottom:34px;width:1px;background:var(--mv-fog);opacity:0;transition:opacity .6s}
.mvkt-hh{position:absolute;opacity:0;translate:0 -8px;transition:opacity .5s .5s,translate .6s .5s} .mvkt.is-sorted .mvkt-hh,.mvkt.is-sorted .mvkt-div{opacity:1;translate:0 0}
.mvkt-pile{list-style:none;margin:0;padding:0}
.mvkt-tag{position:absolute;left:0;top:0;width:var(--tw);height:var(--th);will-change:transform;cursor:grab;z-index:1} .mvkt-table.is-drag .mvkt-tag{cursor:grabbing} .mvkt-tag:hover{z-index:3}
.mvkt-lab{position:absolute;right:20px;top:20px;display:flex;gap:18px;margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut);pointer-events:none} .mvkt.is-sorted .mvkt-lab{opacity:0} .mvkt-lab{transition:opacity .4s}
/* column heads */
.mvkt-ch{display:flex;align-items:baseline;gap:10px;margin:0;font-size:clamp(24px,2vw,30px);line-height:1;letter-spacing:-.035em;font-stretch:115%;font-weight:760} .mvkt-ch span{font-size:12px;letter-spacing:.1em;padding:3px 6px;border-radius:4px;background:var(--mv-brass);color:var(--mv-ink)}
/* the tag */
.mvkt-ti{position:relative;display:block;width:var(--tw);height:var(--th);transform-origin:20px 50%}
.mvkt-tag:hover .mvkt-ti,.mvkt-stag:hover .mvkt-ti{animation:mvkt-swing 1.5s cubic-bezier(.3,.6,.3,1)}
@keyframes mvkt-swing{0%{rotate:0deg}14%{rotate:9deg}32%{rotate:-6deg}50%{rotate:3.5deg}68%{rotate:-1.8deg}84%{rotate:.7deg}100%{rotate:0deg}}
.mvkt-face{position:absolute;inset:0;display:grid;align-content:center;gap:5px;padding:0 12px 0 40px;border-radius:4px 10px 10px 4px;clip-path:polygon(14px 0,100% 0,100% 100%,14px 100%,0 calc(100% - 14px),0 14px);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 16%,transparent)}
.mvkt-ti.is-design .mvkt-face{background:linear-gradient(180deg,var(--mv-cloud),color-mix(in srgb,var(--mv-cloud) 88%,var(--mv-stone)));color:var(--mv-ink)}
.mvkt-ti.is-design .mvkt-face::after{content:"";position:absolute;right:0;top:0;bottom:0;width:8px;background:var(--mv-brass)}
.mvkt-ti.is-code .mvkt-face{background:linear-gradient(180deg,color-mix(in srgb,var(--mv-ink) 92%,var(--mv-cloud)),var(--mv-ink));color:var(--mv-cloud);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 10%,transparent)}
.mvkt-hole{position:absolute;left:14px;top:50%;width:13px;height:13px;margin-top:-6.5px;border-radius:50%;background:color-mix(in srgb,var(--mv-ink) 4.5%,var(--mv-bone));box-shadow:0 0 0 3px color-mix(in srgb,var(--mv-stone) 45%,var(--mv-cloud)),inset 0 1px 2px rgba(0,0,0,.3)}
.mvkt-ti.is-code .mvkt-hole{box-shadow:0 0 0 3px color-mix(in srgb,var(--mv-brass) 80%,var(--mv-ink)),inset 0 1px 2px rgba(0,0,0,.5)}
.mvkt-lb{display:block;font-size:17px;line-height:1;letter-spacing:-.02em;font-stretch:112%;font-weight:680;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mvkt-cat{display:block;font-size:12px;line-height:1;letter-spacing:.1em;text-transform:uppercase;opacity:.72;white-space:nowrap}
.mvkt-str{position:absolute;left:-10px;top:50%;width:30px;height:20px;margin-top:-17px;overflow:visible;pointer-events:none} .mvkt-str path{fill:none;stroke:color-mix(in srgb,var(--mv-ink) 55%,transparent);stroke-width:1.4;stroke-linecap:round}
.mvkt-tag{filter:drop-shadow(0 6px 8px rgba(0,0,0,.14))}
/* static (phone / still / reduced motion): the sorted final state */
.mvkt-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:36px;padding:28px;border-radius:10px;background:color-mix(in srgb,var(--mv-ink) 4.5%,var(--mv-bone));box-shadow:inset 0 0 0 1px var(--mv-fog)}
.mvkt-col{display:grid;align-content:start;gap:26px} .mvkt-col+.mvkt-col{padding-left:36px;border-left:1px solid var(--mv-fog)}
.mvkt-list{display:flex;flex-wrap:wrap;gap:12px;list-style:none;margin:0;padding:0 0 0 10px}
.mvkt-stag{width:var(--tw);height:var(--th);filter:drop-shadow(0 6px 8px rgba(0,0,0,.12))}
.mvkt.is-ph .mvkt-top{flex-direction:column;align-items:flex-start;gap:22px} .mvkt.is-ph .mvkt-intro{font-size:16px}
.mvkt.is-ph .mvkt-cols{grid-template-columns:minmax(0,1fr);gap:30px;padding:22px 18px} .mvkt.is-ph .mvkt-col+.mvkt-col{padding:28px 0 0;border-left:0;border-top:1px solid var(--mv-fog)}
.mvkt.is-ph{--th:52px!important} .mvkt.is-ph .mvkt-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding-left:8px} .mvkt.is-ph .mvkt-stag,.mvkt.is-ph .mvkt-ti{width:100%} .mvkt.is-ph .mvkt-cat{font-size:12px;overflow:hidden;text-overflow:ellipsis} .mvkt.is-ph .mvkt-lb{font-size:16px} .mvkt.is-ph .mvkt-face{padding-left:36px}
@media (max-width:340px){.mvkt.is-ph .mvkt-list{grid-template-columns:minmax(0,1fr)}}
`;
