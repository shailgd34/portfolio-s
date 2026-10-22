'use client';

import {
  useLayoutEffect,
  useRef,
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
  useMagnet,
  useScrollVars,
  clamp01,
  rise,
  listOf,
  Eyebrow,
  Head,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';

const MVUS_ICONS = {
  laptop: ['M5 6h14v9H5z', 'M3 18h18', 'M10 18l.6-1.4h2.8L14 18'],
  display: ['M3.5 4.5h17v11h-17z', 'M12 15.5V19', 'M8.5 19.5h7'],
  keyboard: [
    'M2.5 7h19v10h-19z',
    'M6 10.5h.01M9 10.5h.01M12 10.5h.01M15 10.5h.01M18 10.5h.01',
    'M7.5 14h9',
  ],
  mouse: [
    'M12 3c3.3 0 5.5 2.6 5.5 6v6c0 3.4-2.2 6-5.5 6s-5.5-2.6-5.5-6V9c0-3.4 2.2-6 5.5-6z',
    'M12 6.5v3',
  ],
  pen: ['M12 3l6 9-6 9-6-9z', 'M12 12v9', 'M12 12h.01'],
  frame: ['M8 3v18M16 3v18M3 8h18M3 16h18'],
  motion: ['M4 17c3-8 6-8 8 0s5 8 8 0', 'M4 7h3M17 7h3'],
  cube: [
    'M12 3l8 4.5v9L12 21l-8-4.5v-9z',
    'M12 12l8-4.5M12 12v9M12 12L4 7.5',
  ],
  code: ['M8.5 7L4 12l4.5 5', 'M15.5 7L20 12l-4.5 5', 'M13.5 5l-3 14'],
  atom: [
    'M12 12h.01',
    'M12 4c2 0 3.5 3.6 3.5 8s-1.5 8-3.5 8-3.5-3.6-3.5-8S10 4 12 4z',
    'M5 8c1-1.7 4.9-1.3 8.7.9s6.3 5.4 5.3 7.1-4.9 1.3-8.7-.9S4 9.7 5 8z',
  ],
  triangle: ['M12 4l9 16H3z'],
  wind: ['M3 9h11a3 3 0 1 0-3-3', 'M3 15h15a3 3 0 1 1-3 3', 'M3 12h7'],
  chair: ['M7 3h10v9H7z', 'M5 12h14v3H5z', 'M8 15l-1 6M16 15l1 6M12 15v6'],
  lamp: [
    'M5 21h8',
    'M9 21l-1-7 7-6',
    'M13.5 5.5l5-1.5 1 4.5-5 1.5z',
    'M18 9l1 3',
  ],
  book: ['M6 3h12v18H6z', 'M9 3v18', 'M12 8h4M12 11h4'],
  dot: ['M5 5h14v14H5z', 'M12 12h.01'],
};

const mvusIcon = (name, group) => {
  const s = (name + ' ').toLowerCase();
  const g = group.toLowerCase();
  if (/macbook|laptop|notebook pc|thinkpad/.test(s)) return 'laptop';
  if (/display|monitor|screen/.test(s)) return 'display';
  if (/keychron|keyboard/.test(s)) return 'keyboard';
  if (/mouse|mx |trackpad/.test(s)) return 'mouse';
  if (/rive|after effects|motion/.test(s)) return 'motion';
  if (/blender|cinema|3d/.test(s)) return 'cube';
  if (/framer/.test(s)) return 'frame';
  if (/react/.test(s)) return 'atom';
  if (/vercel|next/.test(s)) return 'triangle';
  if (/tailwind/.test(s)) return 'wind';
  if (/chair|aeron/.test(s)) return 'chair';
  if (/lamp|light/.test(s)) return 'lamp';
  if (/notebook|leuchtturm|moleskine|book/.test(s)) return 'book';
  if (/design/.test(g)) return 'pen';
  if (/code|dev/.test(g)) return 'code';
  if (/hard/.test(g)) return 'laptop';
  if (/desk/.test(g)) return 'lamp';
  return 'dot';
};

const mvusRand = (i) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export default function MvUses(props = {}) {
  const {
    eyebrow = 'FRAME 01 — The kit list',
    heading = 'Everything on|the *desk*.',
    intro = 'The hardware, apps and small things I use every day to design and build products. No sponsors — just what earned its place.',
    updated = 'Updated 2026',
    groups = 'Hardware|MacBook Pro 16 M3 Max, 4K Pro Display, Keychron Q1 Pro, MX Master 3S;Design|Figma, Framer, Adobe Photoshop, Illustrator, InDesign, Protopie, Canva;Code|VS Code, React, Next.js 15, Tailwind CSS, WordPress, Vercel;Desk|Ergonomic Chair, Anglepoise Studio Lamp, Field Notes, Sony WH-1000XM5',
    notes = '',
    mat = '#21423A',
    matPrint = 'SSB · A2 · Self-healing · 1 square = 1 cm',
    tapeLabel = 'Measured',
    unit = 'cm',
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const root = useRef(null);
  const field = useRef(null);
  const tapeN = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm);
  useMagnet(root, live);
  const final = still || rm || !live;

  const G = listOf(groups)
    .map((x) => {
      const i = x.indexOf('|');
      const t = i < 0 ? x : x.slice(0, i);
      const its = (i < 0 ? '' : x.slice(i + 1))
        .split(',')
        .map((y) => y.trim())
        .filter(Boolean);
      return { t: t.trim(), its };
    })
    .filter((g) => g.t || g.its.length);

  const NOTE = {};
  listOf(notes || MVUS_NOTES).forEach((x) => {
    const i = x.indexOf('|');
    if (i > 0)
      NOTE[x.slice(0, i).trim().toLowerCase()] = x.slice(i + 1).trim();
  });

  const C = tab ? 13 : 25,
    CW = 5,
    CH = 2,
    per = tab ? 1 : 2;
  let x = 1,
    y = 1,
    shelf = 0;
  const place = [];
  G.forEach((g) => {
    const n = Math.max(1, g.its.length);
    const cw = Math.min(per, n),
      ch = Math.ceil(n / cw);
    const W = cw * CW + (cw - 1),
      H = 1 + ch * CH + (ch - 1);
    if (x > 1 && x + W > C - 1) {
      y += shelf + 2;
      x = 1;
      shelf = 0;
    }
    place.push({ x, y, W });
    x += W + 1;
    shelf = Math.max(shelf, H);
  });
  const R = Math.max(8, y + shelf + 3);

  useLayoutEffect(() => {
    const r = root.current,
      f = field.current;
    if (!r || !f || final) return;
    const m = () => {
      const vh = window.innerHeight || 900,
        rh = r.offsetHeight || 1,
        span = vh + rh;
      const offIn = (el) => {
        let t = 0,
          n = el;
        while (n && n !== r) {
          t += n.offsetTop;
          n = n.offsetParent;
        }
        return t;
      };
      const ft = offIn(f),
        fh = f.offsetHeight;
      const ts = (ft + vh * 0.45) / span,
        te = (ft + fh + vh * 0.15) / span;
      f.style.setProperty('--ts0', ts.toFixed(4));
      f.style.setProperty('--td', Math.max(0.05, te - ts).toFixed(4));
      const d = (vh * 0.28) / span;
      f.querySelectorAll('.mvus-it').forEach((el) => {
        const g = Number(el.dataset.g) || 0,
          j = Number(el.dataset.j) || 0;
        const top = offIn(el);
        const st =
          (top -
            vh * 0.05 +
            (phone ? 0 : (g % 2) * vh * 0.03 + j * vh * 0.02)) /
          span;
        el.style.setProperty('--s0', Math.min(st, te - d).toFixed(4));
        el.style.setProperty('--d', d.toFixed(4));
      });
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(r);
    window.addEventListener('resize', m);
    const t = window.setTimeout(m, 900);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', m);
      window.clearTimeout(t);
    };
  }, [final, w, groups, phone]);

  const lastCm = useRef(-1);
  useScrollVars(root, live && !final, rm, (sp) => {
    const f = field.current;
    if (!f) return;
    const s0 = parseFloat(f.style.getPropertyValue('--ts0') || '0'),
      d = parseFloat(f.style.getPropertyValue('--td') || '1');
    const p = clamp01((sp - s0) / d);
    const cm = Math.round(p * (phone ? 30 : C) * 10) / 10;
    if (cm !== lastCm.current && tapeN.current) {
      lastCm.current = cm;
      tapeN.current.textContent = cm.toFixed(1);
    }
  });

  const cols = phone ? 0 : C;
  let k = 0;

  return (
    <section
      ref={root}
      className={`mv mv-sec mvus${phone ? ' is-ph' : tab ? ' is-tab' : ''}${final ? ' is-final' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        '--mat': mat || '#21423A',
        ...(props.style || {}),
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_MVUS + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvus-top">
          <div className="mvus-hl">
            <Eyebrow text={eyebrow} on={on} M={M} />
            <Head
              text={heading}
              on={on}
              D={D}
              size="clamp(40px,4.3vw,64px)"
              lh={0.95}
              delay={100}
              style={{
                fontWeight: props.customFonts
                  ? D.fontWeight
                  : 760,
              }}
            />
          </div>
          <div className="mvus-side" style={rise(on, 360, 14)}>
            {intro && <p className="mvus-intro">{intro}</p>}
            <ul className="mvus-legend" style={M}>
              {G.map((g, i) => (
                <li key={i}>
                  <b>{String(g.its.length).padStart(2, '0')}</b>
                  {g.t}
                </li>
              ))}
              {updated && <li className="mvus-upd">{updated}</li>}
            </ul>
          </div>
        </header>
        <div className="mvus-mat" style={rise(on, 200, 24)}>
          <div
            ref={field}
            className="mvus-field"
            style={{
              '--C': cols || 12,
              '--R': R,
              '--ts0': 0.2,
              '--td': 0.4,
            }}
          >
            <i className="mvus-grid" aria-hidden />
            {!phone && (
              <div className="mvus-rul" aria-hidden style={M}>
                {Array.from({ length: C - 1 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      left: `calc(var(--c) * ${i + 1})`,
                    }}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
            )}
            {!phone && (
              <div className="mvus-rulv" aria-hidden style={M}>
                {Array.from({ length: R - 2 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      top: `calc(var(--c) * ${i + 1})`,
                    }}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
            )}
            <p className="mvus-print" style={M} aria-hidden>
              {matPrint}
            </p>
            {G.map((g, gi) => {
              const pl = place[gi];
              return (
                <div
                  key={gi}
                  className="mvus-grp"
                  role="group"
                  aria-label={g.t}
                  style={
                    phone
                      ? undefined
                      : {
                          left: `calc(var(--c) * ${pl.x})`,
                          top: `calc(var(--c) * ${pl.y})`,
                          width: `calc(var(--c) * ${pl.W})`,
                        }
                  }
                >
                  <h3 className="mvus-tape" style={M}>
                    {g.t}
                    <b>{String(g.its.length).padStart(2, '0')}</b>
                  </h3>
                  <ul
                    className="mvus-list"
                    style={{
                      '--pc': Math.min(
                        per,
                        Math.max(1, g.its.length)
                      ),
                    }}
                  >
                    {g.its.map((it, j) => {
                      const i = k++;
                      const rr = mvusRand(i + 3),
                        r2 = mvusRand(i + 17);
                      const side = (gi + j) % 2 ? 1 : -1;
                      const note = NOTE[it.toLowerCase()] || '';
                      const ic =
                        MVUS_ICONS[mvusIcon(it, g.t)] ||
                        MVUS_ICONS.dot;
                      return (
                        <li
                          key={j}
                          className="mvus-it"
                          data-g={gi}
                          data-j={j}
                          tabIndex={note ? 0 : undefined}
                          style={{
                            '--dx': `${(side * (38 + rr * 30)).toFixed(1)}cqw`,
                            '--dy': `${((r2 - 0.3) * (phone ? 20 : 26)).toFixed(1)}cqw`,
                            '--r': (
                              side *
                              (8 + r2 * 16)
                            ).toFixed(1),
                            '--tilt': `${((rr - 0.5) * 2.4).toFixed(2)}deg`,
                          }}
                        >
                          <i
                            className="mvus-slot"
                            aria-hidden
                          />
                          <div className="mvus-card">
                            <span
                              className="mvus-ic"
                              aria-hidden
                            >
                              <svg viewBox="0 0 24 24">
                                {ic.map((d, q) => (
                                  <path
                                    key={q}
                                    d={d}
                                  />
                                ))}
                              </svg>
                            </span>
                            <span
                              className="mvus-id"
                              style={M}
                              aria-hidden
                            >
                              {String(gi + 1).padStart(2, '0')}.
                              {String(j + 1).padStart(2, '0')}
                            </span>
                            <span
                              className="mvus-nm"
                              style={D}
                            >
                              {it}
                            </span>
                            {note && (
                              <span className="mvus-note">
                                <span>{note}</span>
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            <div className="mvus-tapem" aria-hidden>
              <i className="mvus-blade" />
              <span className="mvus-case">
                <i />
              </span>
            </div>
            <p className="mvus-read" style={M}>
              {tapeLabel}{' '}
              <span ref={tapeN}>
                {final ? (phone ? 30 : C).toFixed(1) : '0.0'}
              </span>{' '}
              {unit}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const MVUS_NOTES =
  "MacBook Pro 16 M3 Max|Figma, Blender and a dev server at once — the fans stay quiet.;4K Pro Display|5K for pixel checks, and the colour matches the phones I test on.;Keychron Q1 Pro|Heavy, quiet and remapped for Figma shortcuts.;MX Master 3S|The side wheel scrubs timelines in Rive and Framer.;Figma|Flows, UI and the design system's source of truth.;Framer|Marketing sites that clients can edit on their own.;Rive|Interactive motion that ships as a tiny runtime.;Blender|3D product shots and hero renders.;VS Code|Prettier, ESLint and one calm theme.;React|Every product UI I build ends up here.;Next.js 15|App router and server components — fast by default.;Tailwind CSS|Tokens from Figma, straight into utility classes.;Vercel|A preview link on every pull request for client review.;Ergonomic Chair|Essential for long design and engineering sessions.;Anglepoise Studio Lamp|Warm light for sketching after dark.;Field Notes|Dot grid. Every project starts on paper.";

const CSS_MVUS = `
.mvus{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(88px,9vw,144px) 0 clamp(96px,10vw,160px);overflow:clip}
.mvus .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px} .mvus .mv-eb i{border-radius:1px}
.mvus .mv-hd{font-stretch:115%;margin-top:18px}
.mvus .mv-it{display:inline-block;font-weight:inherit;color:var(--mv-ink);line-height:1.02;padding:0 .07em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .72s steps(8) var(--pd,600ms)} .mvus .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvus-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.8fr);gap:clamp(32px,5vw,96px);align-items:end;margin-bottom:clamp(36px,4vw,56px)}
.mvus-side{display:flex;flex-direction:column;gap:20px}
.mvus-intro{margin:0;font-size:17px;line-height:1.55;max-width:32em;color:color-mix(in srgb,var(--mv-ink) 82%,var(--mv-bone))}
.mvus-legend{list-style:none;margin:0;padding:12px 0 0;border-top:1px solid var(--mv-fog);display:flex;flex-wrap:wrap;gap:8px 22px;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.mvus-legend b{font-weight:500;color:var(--mv-mut);margin-right:8px;font-variant-numeric:tabular-nums} .mvus-upd{margin-left:auto;color:var(--mv-mut)}
/* the cutting mat */
.mvus-mat{position:relative;border-radius:10px;background:var(--mat);container-type:inline-size;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06),inset 0 2px 30px rgba(0,0,0,.25),0 40px 70px -40px color-mix(in srgb,var(--mv-ink) 70%,transparent);isolation:isolate}
.mvus-field{position:relative;--c:calc(100cqw / var(--C));height:calc(var(--c) * var(--R));--ts0:.2;--td:.4;--tp:clamp(0,(var(--sp) - var(--ts0)) / var(--td),1)}
.mvus-grid{position:absolute;inset:0;border-radius:10px;pointer-events:none;background:
  linear-gradient(45deg,transparent calc(50% - .5px),rgba(255,255,255,.07) 50%,transparent calc(50% + .5px)) 0 0/calc(var(--c) * 10) calc(var(--c) * 10),
  linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px) 0 0/calc(var(--c) * 5) calc(var(--c) * 5),
  linear-gradient(0deg,rgba(255,255,255,.2) 1px,transparent 1px) 0 0/calc(var(--c) * 5) calc(var(--c) * 5),
  linear-gradient(90deg,rgba(255,255,255,.085) 1px,transparent 1px) 0 0/var(--c) var(--c),
  linear-gradient(0deg,rgba(255,255,255,.085) 1px,transparent 1px) 0 0/var(--c) var(--c)}
.mvus-rul span,.mvus-rulv span{position:absolute;font-size:12px;letter-spacing:.04em;color:rgba(255,255,255,0.78);font-variant-numeric:tabular-nums}
.mvus-rul span{top:5px;translate:-50% 0} .mvus-rulv span{left:6px;translate:0 -50%}
.mvus-rul::before{content:"";position:absolute;left:0;right:0;top:0;height:calc(var(--c) * .5);background:repeating-linear-gradient(90deg,rgba(255,255,255,.4) 0 1px,transparent 1px calc(var(--c) / 5));-webkit-mask:linear-gradient(180deg,#000 30%,transparent 30%);mask:linear-gradient(180deg,#000 30%,transparent 30%)}
.mvus-print{position:absolute;right:calc(var(--c) * 1);bottom:calc(var(--c) * .35);margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.78)}
/* clusters */
.mvus-grp{position:absolute}
.mvus-tape{position:absolute;left:-6px;top:calc(var(--c) * .18);margin:0;display:inline-flex;align-items:center;gap:12px;padding:6px 16px 6px 12px;font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--mv-ink);background:color-mix(in srgb,#EFE4C8 92%,transparent);rotate:-1.2deg;box-shadow:0 2px 6px rgba(0,0,0,.18);clip-path:polygon(0 8%,3% 0,6% 10%,9% 0,100% 0,97% 20%,100% 42%,97% 64%,100% 86%,98% 100%,0 100%,2% 76%,0 52%,3% 28%);white-space:nowrap}
.mvus-tape b{font-weight:500;opacity:.8}
.mvus-list{list-style:none;margin:0;padding:0;position:absolute;left:0;top:var(--c);width:100%;display:grid;grid-template-columns:repeat(var(--pc),calc(var(--c) * 5));column-gap:var(--c);row-gap:var(--c);grid-auto-rows:calc(var(--c) * 2)}
/* an item: slides in off the mat */
.mvus-it{position:relative;--t:clamp(0,(var(--sp) - var(--s0,.2)) / var(--d,.12),1);--u:calc(1 - var(--t));--e:calc(var(--u) * var(--u) * var(--u));z-index:calc(1 + var(--u) * 10)}
.mvus-slot{position:absolute;inset:0;border-radius:4px;border:1.5px dashed var(--mv-brass);opacity:calc(var(--t) * 1.6 - .2);pointer-events:none}
.mvus-card{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(10px,1vw,14px) clamp(12px,1.1vw,16px);border-radius:4px;background:var(--mv-cloud);color:var(--mv-ink);
  transform:translate(calc(var(--dx) * var(--e)),calc(var(--dy) * var(--e))) rotate(calc(var(--r) * var(--e) * 1deg)) scale(calc(1 + var(--u) * .06));
  box-shadow:0 calc(1px + var(--u) * 26px) calc(2px + var(--u) * 40px) rgba(0,0,0,calc(.28 + var(--u) * .1)),0 0 0 1px rgba(0,0,0,.06);
  rotate:var(--tilt,0deg);translate:0 0;transition:translate .45s cubic-bezier(.34,1.56,.64,1),rotate .45s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;cursor:default;outline:none}
.mvus-ic{display:grid;place-items:center;width:34px;height:34px;border-radius:7px;background:color-mix(in srgb,var(--mv-ink) 6%,transparent)} .mvus-ic svg{width:20px;height:20px;fill:none;stroke:var(--mv-ink);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.mvus-id{position:absolute;right:clamp(12px,1.1vw,16px);top:clamp(10px,1vw,14px);font-size:12px;letter-spacing:.1em;color:var(--mv-mut)}
.mvus-nm{font-size:clamp(15px,1.25vw,18px);line-height:1.12;letter-spacing:-.018em;font-weight:650;font-stretch:106%}
.mvus-note{position:absolute;left:10px;right:10px;top:calc(100% - 4px);z-index:-1;display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.2,.8,.2,1)}
.mvus-note>span{overflow:hidden;min-height:0;display:block;border-radius:0 0 4px 4px;background:color-mix(in srgb,#EFE4C8 96%,var(--mv-ink));font-size:13.5px;line-height:1.4;box-shadow:0 14px 20px -12px rgba(0,0,0,.5)}
.mvus-note>span::before{content:"";display:block;height:12px}
.mvus-it:is(:hover,:focus-visible){z-index:30}
.mvus-it:is(:hover,:focus-visible) .mvus-card{translate:0 -8px;rotate:calc(var(--tilt,0deg) - 1.2deg);box-shadow:0 22px 34px -14px rgba(0,0,0,.55),0 0 0 1.5px var(--mv-brass)}
.mvus-it:is(:hover,:focus-visible) .mvus-note{grid-template-rows:1fr} .mvus-it:is(:hover,:focus-visible) .mvus-note>span{padding:0 12px 11px}
.mvus-it:focus-visible{outline:2px solid var(--mv-cloud)!important;outline-offset:3px!important;box-shadow:none!important;border-radius:4px;translate:0 -8px;rotate:calc(var(--tilt,0deg) - 1.2deg);transition:translate .45s cubic-bezier(.34,1.56,.64,1),rotate .45s cubic-bezier(.34,1.56,.64,1)}
.mvus-it:focus-visible .mvus-card{translate:0 0;rotate:0deg} .mvus-it:focus-visible .mvus-slot{opacity:0}
/* measuring tape */
.mvus-tapem{position:absolute;left:calc(var(--c) * 1);right:calc(var(--c) * 1);bottom:calc(var(--c) * 1.1);height:calc(var(--c) * .5);pointer-events:none}
.mvus-blade{position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:2px;background:repeating-linear-gradient(90deg,var(--mv-ink) 0 1px,transparent 1px calc(var(--c) / 5)) 0 100%/100% 34% no-repeat,repeating-linear-gradient(90deg,var(--mv-ink) 0 1.5px,transparent 1.5px var(--c)) 0 100%/100% 62% no-repeat,var(--mv-brass);clip-path:inset(0 calc((1 - var(--tp)) * 100%) 0 0);box-shadow:0 3px 6px rgba(0,0,0,.25)}
.mvus-case{position:absolute;top:50%;left:calc(var(--tp) * 100%);width:calc(var(--c) * 1.5);height:calc(var(--c) * 1.5);translate:calc(var(--tp) * -100%) -50%;border-radius:calc(var(--c) * .35);background:linear-gradient(160deg,#2c2c30,#131315);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 8px 16px rgba(0,0,0,.45);display:grid;place-items:center}
.mvus-case i{width:36%;height:36%;border-radius:50%;background:var(--mv-brass);box-shadow:inset 0 -2px 3px rgba(0,0,0,.3)}
.mvus-read{position:absolute;left:calc(var(--c) * 1);bottom:calc(var(--c) * .3);margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.78)} .mvus-read span{display:inline-block;min-width:4ch;text-align:right;color:#fff;font-variant-numeric:tabular-nums}
.mvus.is-final .mvus-it{--t:1} .mvus.is-final .mvus-field{--tp:1}
/* tablet */
.mvus.is-tab .mvus-top{grid-template-columns:1fr;gap:24px}
/* phone */
.mvus.is-ph .mvus-top{grid-template-columns:1fr;gap:24px}
.mvus.is-ph .mvus-field{--c:34px;height:auto;padding:30px 16px 96px;display:flex;flex-direction:column;gap:40px}
.mvus.is-ph .mvus-grid{background-position:16px 30px}
.mvus.is-ph .mvus-grp{position:relative}
.mvus.is-ph .mvus-tape{position:relative;left:-4px;top:0;margin-bottom:14px}
.mvus.is-ph .mvus-list{position:relative;top:auto;display:flex;flex-direction:column;gap:12px}
.mvus.is-ph .mvus-it{min-height:0}
.mvus.is-ph .mvus-slot{display:none}
.mvus.is-ph .mvus-card{position:relative;inset:auto;display:grid;grid-template-columns:34px minmax(0,1fr);column-gap:12px;row-gap:4px;align-items:center;padding:12px 14px}
.mvus.is-ph .mvus-ic{grid-row:1 / span 2} .mvus.is-ph .mvus-nm{font-size:17px;padding-right:44px} .mvus.is-ph .mvus-id{top:12px}
.mvus.is-ph .mvus-note{position:static;display:block;grid-column:2} .mvus.is-ph .mvus-note>span{background:none;box-shadow:none;padding:0!important;font-size:14px;color:var(--mv-mut)} .mvus.is-ph .mvus-note>span::before{display:none}
.mvus.is-ph .mvus-tapem{left:16px;right:16px;bottom:48px;height:16px} .mvus.is-ph .mvus-case{width:40px;height:40px;border-radius:10px} .mvus.is-ph .mvus-read{left:16px;bottom:18px} .mvus.is-ph .mvus-print{display:none}
.mvus.is-ph .mvus-blade{background:repeating-linear-gradient(90deg,var(--mv-ink) 0 1px,transparent 1px 6px) 0 100%/100% 34% no-repeat,repeating-linear-gradient(90deg,var(--mv-ink) 0 1.5px,transparent 1.5px 30px) 0 100%/100% 62% no-repeat,var(--mv-brass)}
@media (hover:none){.mvus-note{grid-template-rows:0fr}}
`;
