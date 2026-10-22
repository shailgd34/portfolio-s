'use client';

import {
  useEffect,
  useLayoutEffect,
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
  rise,
  plainOf,
  Eyebrow,
  Head,
  imgOf,
  RS,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultReviews } from './siteData';

// ---- THE CLIPPINGS: kind words as PRESS CLIPPINGS. Each review is a newspaper cut-out — off-white paper with torn top and bottom edges, a mono
// dateline over a double rule, a big pull-quote, a byline with a halftone portrait — held down on the paper ground by a strip of accent TAPE.
// Scroll: the clippings are laid down one by one onto the board as it comes into view (each drops from above with its own tilt and a small
// bounce, and its shadow lands under it); later ones overlap the earlier ones collage-style. A "filed 03 / 05" counter follows.
// Hover: the clipping straightens, lifts to the top and its tape peels up. Phone: a vertical stack, each one laid down as it enters. ----

const TILT = [-4, 3, -2.5, 2.5, -5, 4, -3, 2];

// a torn paper edge (deterministic per clipping): jagged top + bottom, cleanly cut sides
const tornOf = (seed) => {
  let s = seed * 9301 + 49297;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const top = [],
    bot = [];
  for (let i = 0; i <= 24; i++) {
    const x = (i / 24) * 100;
    top.push(`${x.toFixed(2)}% ${(r() * 7).toFixed(1)}px`);
    bot.push(`${(100 - x).toFixed(2)}% calc(100% - ${(r() * 7).toFixed(1)}px)`);
  }
  return `polygon(${top.join(',')},${bot.join(',')})`;
};

const tapeOf = (seed) => {
  const a = 1 + (seed % 3),
    b = 2 + (seed % 2);
  return `polygon(0 ${a * 8}%,${a}% 0,${100 - b}% ${b * 6}%,100% 0,${100 - a}% 100%,${b * 2}% ${100 - a * 9}%,0 100%)`;
};

export default function MvPress(props = {}) {
  const {
    eyebrow = 'FRAME 07 — Kind words',
    heading = 'What clients|*say*.',
    intro = "Cut out and kept. A few words from the people I've designed and shipped with.",
    filedLabel = 'Clippings filed',
    issueLabel = 'No.',
    projectPrefix = 'Re:',
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const root = useRef(null);
  const board = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm);
  const rows = props.rows || defaultReviews;
  const N = rows.length;
  const anim = live && !rm && !still;
  const [n, setN] = useState(N);
  const nRef = useRef(N);

  const put = (k) => {
    if (k !== nRef.current) {
      nRef.current = k;
      setN(k);
    }
  };

  useLayoutEffect(() => {
    if (anim) put(0);
  }, [anim]);

  // desktop / tablet: the board's own progress through the viewport lays the clippings down in order (reversible)
  const geo = useRef({ h: 1, bt: 0, bh: 1, vh: 900 });
  useLayoutEffect(() => {
    const el = root.current,
      bd = board.current;
    if (!el || !bd) return;
    const m = () => {
      geo.current = {
        h: el.offsetHeight || 1,
        bt: bd.offsetTop,
        bh: bd.offsetHeight || 1,
        vh: window.innerHeight || 900,
      };
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    window.addEventListener('resize', m);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', m);
    };
  }, [N, phone]);

  useScrollVars(root, anim && !phone, rm, (sp) => {
    const g = geo.current;
    const top = g.vh - sp * (g.vh + g.h) + g.bt;
    const vis = (g.vh - top) / Math.min(g.bh, g.vh * 0.95);
    let k = 0;
    for (let i = 0; i < N; i++)
      if (vis > 0.16 + (N > 1 ? (i / (N - 1)) * 0.62 : 0)) k = i + 1;
    put(k);
  });

  // phone: each clipping is laid down as it enters
  const [ph, setPh] = useState({});
  useEffect(() => {
    if (!anim || !phone || !board.current) return;
    const els = Array.from(board.current.querySelectorAll('.mvps-it'));
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es)
          if (e.isIntersecting) {
            const i = Number(e.target.dataset.i);
            setPh((o) => (o[i] ? o : { ...o, [i]: 1 }));
            io.unobserve(e.target);
          }
      },
      { threshold: 0.3 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [anim, phone, N]);

  const down = (i) => !anim || (phone ? !!ph[i] : i < n);
  const filed = !anim ? N : phone ? Object.keys(ph).length : n;
  const pad = (x) => String(x).padStart(2, '0');

  return (
    <section
      ref={root}
      id={props.id || "reviews"}
      className={`mv mv-sec mvps${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}${anim ? ' is-anim' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
      aria-label={plainOf(heading)}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_PS + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvps-top">
          <div>
            <Eyebrow text={eyebrow} on={on} M={M} />
            <Head
              text={heading}
              on={on}
              D={D}
              size="clamp(40px,4.3vw,64px)"
              lh={0.95}
              delay={120}
              style={{ fontWeight: 760, fontStretch: '115%' }}
            />
          </div>
          <div className="mvps-side" style={rise(on, 360, 14)}>
            {intro && <p className="mvps-intro">{intro}</p>}
            {N > 0 && (
              <p className="mvps-filed" style={M} aria-hidden>
                <span>{filedLabel}</span>
                <b>
                  {pad(filed)} / {pad(N)}
                </b>
                <i
                  style={{
                    '--f': N ? filed / N : 0,
                  }}
                />
              </p>
            )}
          </div>
        </header>
        <div ref={board} className="mvps-board">
          {rows.map((r, i) => {
            const t = TILT[i % TILT.length] * (phone ? 0.4 : 1);
            const img = imgOf(r);
            const dl = [
              r.f3,
              r.f5 ? `${projectPrefix} ${r.f5}`.trim() : '',
            ]
              .filter(Boolean)
              .join(' · ');
            return (
              <figure
                key={r.slug || i}
                data-i={i}
                className={`mvps-it${down(i) ? ' is-down' : ''}`}
                style={{
                  '--r': `${t}deg`,
                  '--rd': `${t + (i % 2 ? 9 : -9)}deg`,
                }}
              >
                <i
                  className="mvps-tape"
                  aria-hidden
                  style={{
                    clipPath: tapeOf(i),
                    WebkitClipPath: tapeOf(i),
                    '--tr': `${(i % 2 ? 1 : -1) * (3 + (i % 3) * 2)}deg`,
                  }}
                />
                <div
                  className="mvps-paper"
                  style={{
                    clipPath: tornOf(i + 3),
                    WebkitClipPath: tornOf(i + 3),
                  }}
                >
                  <p className="mvps-dl" style={M}>
                    <span>
                      {issueLabel} {pad(i + 1)}
                    </span>
                    <span>{dl}</span>
                  </p>
                  <blockquote className="mvps-q" style={D}>
                    <span className="mvps-qm" aria-hidden>
                      “
                    </span>
                    {r.f4}
                  </blockquote>
                  <figcaption className="mvps-by">
                    <span>
                      <b>{r.f1}</b>
                      <em style={M}>
                        {[r.f2, r.f3].filter(Boolean).join(' · ')}
                      </em>
                    </span>
                  </figcaption>
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const CSS_PS = `
.mvps{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(96px,10vw,150px) 0 clamp(96px,10vw,160px);--clip:color-mix(in srgb,var(--mv-cloud) 62%,var(--mv-bone))}
.mvps .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px}
.mvps .mv-eb i{border-radius:1px}
.mvps .mv-hd{margin-top:18px}
/* accent word = a text selection: an accent block wipes in behind ink text, in steps */
.mvps .mv-it{color:var(--mv-ink);font-weight:inherit;padding:0 .06em;margin:0 -.02em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 55%/0% 86%;transition:background-size .5s steps(8) var(--pd,600ms)}
.mvps .mv-hd.is-on .mv-it{background-size:100% 86%}
.mvps-top{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-bottom:clamp(48px,5vw,80px)}
.mvps-side{display:flex;flex-direction:column;gap:22px;width:min(360px,34%);padding-bottom:6px}
.mvps-intro{margin:0;font-size:16px;line-height:1.55;color:var(--mv-mut)}
.mvps-filed{position:relative;display:flex;justify-content:space-between;align-items:baseline;margin:0;padding-top:12px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;border-top:1px solid var(--mv-fog)}
.mvps-filed b{font-weight:500;font-variant-numeric:tabular-nums;font-size:12px}
.mvps-filed i{position:absolute;left:0;top:-1px;height:2px;width:100%;background:var(--mv-brass);transform-origin:0 50%;scale:var(--f) 1;transition:scale .6s cubic-bezier(.2,.8,.2,1)}
/* the board: a 12-column collage; clippings overlap their neighbours with negative margins */
.mvps-board{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:0;align-items:start;padding-top:24px}
.mvps-it{position:relative;margin:0;z-index:1;transform:rotate(var(--r));transition:transform .5s cubic-bezier(.2,.8,.2,1),filter .5s,opacity .3s;filter:drop-shadow(0 2px 1px rgba(0,0,0,.06)) drop-shadow(0 10px 18px rgba(0,0,0,.10))}
.mvps-it:nth-child(5n+1){grid-column:1 / 5;margin-top:44px}
.mvps-it:nth-child(5n+2){grid-column:5 / 9;margin:0 -8px 0 12px}
.mvps-it:nth-child(5n+3){grid-column:9 / 13;margin:56px 0 0 -4px}
.mvps-it:nth-child(5n+4){grid-column:2 / 7;margin:-12px 20px 0 0}
.mvps-it:nth-child(5n+5){grid-column:7 / 12;margin:-6px 0 0 34px}
.mvps.is-anim .mvps-it{opacity:0;transform:translate3d(0,-150px,0) rotate(var(--rd)) scale(1.08);filter:drop-shadow(0 2px 1px rgba(0,0,0,0)) drop-shadow(0 60px 40px rgba(0,0,0,0));transition:transform .85s cubic-bezier(.3,1.5,.55,1),filter .7s ease .2s,opacity .25s ease}
.mvps.is-anim .mvps-it.is-down{opacity:1;transform:rotate(var(--r));filter:drop-shadow(0 2px 1px rgba(0,0,0,.06)) drop-shadow(0 10px 18px rgba(0,0,0,.10))}
@media (hover:hover){
  .mvps .mvps-it.is-down:hover,.mvps:not(.is-anim) .mvps-it:hover{z-index:20;transform:translate3d(0,-10px,0) rotate(0deg) scale(1.02);filter:drop-shadow(0 4px 2px rgba(0,0,0,.06)) drop-shadow(0 26px 34px rgba(0,0,0,.16));transition:transform .5s cubic-bezier(.2,.8,.2,1),filter .5s}
  .mvps-it:hover .mvps-tape{transform:translate(-50%,-6px) rotate(calc(var(--tr) + 9deg)) scaleY(.9);opacity:.72} 
  .mvps-it:hover .mvps-ph img{filter:grayscale(0) contrast(1)}
}
.mvps-paper{position:relative;padding:34px 30px 30px;background:var(--clip);background-image:linear-gradient(180deg,rgba(255,255,255,.35),rgba(0,0,0,.025)),url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>")}
.mvps-tape{position:absolute;z-index:3;left:50%;top:-12px;width:112px;height:30px;background:color-mix(in srgb,var(--mv-brass) 72%,transparent);transform:translate(-50%,0) rotate(var(--tr));transform-origin:12% 50%;box-shadow:inset 0 0 0 100px rgba(255,255,255,.12);transition:transform .5s cubic-bezier(.34,1.56,.64,1),opacity .4s;opacity:.9}
.mvps-dl{display:flex;justify-content:space-between;gap:12px;margin:0 0 18px;padding-bottom:10px;border-bottom:3px double color-mix(in srgb,var(--mv-ink) 55%,transparent);font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.mvps-dl span:last-child{text-align:right}
.mvps-q{position:relative;margin:0;font-size:clamp(22px,1.75vw,28px);line-height:1.1;letter-spacing:-.028em;font-weight:680;font-stretch:108%;text-wrap:pretty}
.mvps-qm{display:block;height:.5em;margin:0 0 .12em -.04em;font-size:2.3em;line-height:.9;font-weight:800}
.mvps-by{display:flex;align-items:center;gap:14px;margin-top:24px;padding-top:14px;border-top:1px solid color-mix(in srgb,var(--mv-ink) 16%,transparent)}
.mvps-by b{display:block;font-size:15px;font-weight:650;letter-spacing:-.01em}
.mvps-by em{display:block;margin-top:3px;font-style:normal;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut)}
.mvps-ph{position:relative;flex:none;width:56px;height:56px;border-radius:4px;overflow:hidden;background:color-mix(in srgb,var(--mv-stone) 25%,transparent)}
.mvps-ph img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(1) contrast(1.15);transition:filter .5s}
.mvps-ph::after{content:"";position:absolute;inset:0;background:radial-gradient(circle,rgba(0,0,0,.28) 0.9px,transparent 1.3px) 0 0/3px 3px;mix-blend-mode:multiply;pointer-events:none;transition:opacity .5s}
.mvps-it:hover .mvps-ph::after{opacity:0}
/* tablet: two columns, still overlapping */
.mvps.is-tab .mvps-side{width:min(320px,40%)}
.mvps.is-tab .mvps-board{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px}
.mvps.is-tab .mvps-it:nth-child(n){grid-column:auto;margin:0 0 -14px}
.mvps.is-tab .mvps-it:nth-child(even){margin-top:56px}
/* phone: a vertical stack */
.mvps.is-ph .mvps-top{flex-direction:column;align-items:stretch;gap:28px}
.mvps.is-ph .mvps-side{width:auto}
.mvps.is-ph .mvps-board{display:flex;flex-direction:column;gap:30px;padding:10px 6px 0}
.mvps.is-ph .mvps-it:nth-child(n){margin:0}
.mvps.is-ph .mvps-paper{padding:30px 22px 24px}
.mvps.is-ph .mvps-q{font-size:23px}
@media (prefers-reduced-motion:reduce){.mvps .mv-it{transition:none}}
`;
