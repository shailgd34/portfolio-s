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
  useMagnet,
  useScrollVars,
  rise,
  Eyebrow,
  Glyph,
  imgOr,
  RS,
  onTick,
  clamp01,
  listOf,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultLab } from './siteData';

// ---- THE SCREENING: /lab as a wall of 16 mm outtake frames in a 3 / 2 / 1 grid, each one a film frame (sprockets, edge code) with a slate
// caption under it (frame no. · kind · year, title, summary, tools). Scroll: a PROJECTOR BEAM — a warm cone thrown from the booth above the
// viewport — swings across the wall as you scroll; every frame it touches is exposed to full colour and stays printed, the rest wait dim,
// desaturated and flickering. Hover a frame: it PLAYS (slow ken-burns push, live grain, "▶ 00:03" running timecode, Open chip).
// Kind filter chips (All first, aria-pressed) re-deal the wall. Still / reduced motion: no beam, every frame exposed. ----

const MVLI_SPROCKET = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='22'><rect x='6' y='5' width='12' height='12' rx='2.5'/></svg>")`;
const MVLI_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>")`;

export default function MvLabIndex(props = {}) {
  const {
    eyebrow = 'ROLL 02 — Every experiment',
    allLabel = 'All',
    filterLabel = 'Filter by kind',
    countLabel = '{shown} of {total} frames',
    openLabel = 'Open',
    playLabel = 'Playing',
    edgeCode = 'SSB-16',
    stockCode = '7222',
    emptyText = 'New experiments are in the darkroom. Check back soon.',
    noMatch = 'No frames of this kind yet.',
    items = defaultLab,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const root = useRef(null);
  const grid = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm, 0.05);
  useMagnet(root, live);

  const rows = items || defaultLab;
  const kinds = [];
  rows.forEach((r) => {
    const k = String(r.f2 || '').trim();
    if (k && !kinds.includes(k)) kinds.push(k);
  });

  const [kind, setKind] = useState('');
  const kk = kinds.includes(kind) ? kind : '';
  const shown = rows
    .map((r, i) => ({ r, n: i + 1 }))
    .filter((x) => !kk || String(x.r.f2 || '').trim() === kk);

  const anim = live && !rm && !still;
  const pad = (x) => String(x).padStart(2, '0');

  // exposure per frame (by slug) survives filtering; the beam only ever adds light
  const expo = useRef({});
  const G = useRef({
    W: 1,
    H: 1,
    vh: 1,
    cards: [],
  });

  useEffect(() => {
    if (!anim || !root.current || !grid.current) return;
    const el = root.current,
      gr = grid.current;
    const m = () => {
      const a = el.getBoundingClientRect();
      G.current = {
        W: el.clientWidth || 1,
        H: el.offsetHeight || 1,
        vh: window.innerHeight || 1,
        cards: Array.from(gr.querySelectorAll('.mvli-card')).map((c) => {
          const b = c.getBoundingClientRect();
          return {
            el: c,
            key: c.dataset.k || '',
            cx: b.left - a.left + b.width / 2,
            cy: b.top - a.top + b.height * 0.36,
            hw: b.width / 2,
          };
        }),
      };
      G.current.cards.forEach((c) =>
        c.el.style.setProperty('--e', String(expo.current[c.key] || 0))
      );
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    const t = window.setTimeout(m, 700);
    window.addEventListener('resize', m);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
      window.removeEventListener('resize', m);
    };
  }, [anim, kk, rows.length, w]);

  const beam = useRef(null);
  useScrollVars(root, anim, rm, (sp) => {
    const g = G.current,
      bm = beam.current;
    if (!bm) return;
    const top = g.vh - sp * (g.vh + g.H);
    const ay = -top - 60,
      ax = g.W / 2;
    const th =
      32 * Math.sin(((sp * (g.vh + g.H)) / (g.vh * 1.15)) * Math.PI); // degrees
    bm.style.transform = `translate3d(${ax.toFixed(0)}px,${ay.toFixed(0)}px,0) rotate(${th.toFixed(2)}deg)`;
    const tn = Math.tan((th * Math.PI) / 180),
      half = Math.tan((15 * Math.PI) / 180);
    for (const cd of g.cards) {
      const dep = cd.cy - ay;
      let hit = 0;
      if (dep > 0 && cd.cy > -top - 40 && cd.cy < -top + g.vh + 40) {
        const bx = ax - tn * dep;
        const d = Math.abs(cd.cx - bx) / (half * dep + cd.hw * 0.55);
        hit = clamp01(1.15 - d);
      }
      const prev = expo.current[cd.key] || 0;
      const e = Math.max(prev, Math.min(1, hit * 1.4));
      const hq = Math.round(hit * 50) / 50;
      if (e !== prev) {
        expo.current[cd.key] = e;
        cd.el.style.setProperty('--e', e.toFixed(2));
      }
      if (cd.el.__h !== hq) {
        cd.el.__h = hq;
        cd.el.style.setProperty('--hit', String(hq));
      }
    }
  });

  // projector flicker on the frames still waiting for light
  useEffect(() => {
    if (!anim || !root.current) return;
    const el = root.current;
    let vis = false,
      k = 0;
    const io = new IntersectionObserver((es) => {
      vis = es[0].isIntersecting;
    });
    io.observe(el);
    const off = onTick(() => {
      if (!vis || k++ % 3) return;
      const r = Math.random();
      el.style.setProperty(
        '--fl',
        (r > 0.9 ? 0.5 : 0.1 + r * 0.25).toFixed(2)
      );
    });
    return () => {
      off();
      io.disconnect();
    };
  }, [anim]);

  // hover = the frame plays: a running timecode
  const [play, setPlay] = useState('');
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!play) return;
    setSec(0);
    const t0 = performance.now();
    const id = window.setInterval(
      () => setSec(Math.floor((performance.now() - t0) / 1000)),
      250
    );
    return () => window.clearInterval(id);
  }, [play]);

  const expose = (key, el) => {
    expo.current[key] = 1;
    if (el) el.style.setProperty('--e', '1');
  };

  const count = countLabel
    .replace(/\{shown\}/g, pad(shown.length))
    .replace(/\{total\}/g, pad(rows.length));

  return (
    <section
      ref={root}
      className={`mv mv-sec mv-dark mvli${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}${anim ? ' is-anim' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
      aria-label={eyebrow || 'Lab'}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_LI + siteFontCss(props),
        }}
      />
      {anim && (
        <div className="mvli-beamwrap" aria-hidden>
          <div ref={beam} className="mvli-beam">
            <i />
          </div>
        </div>
      )}
      <div className="mv-wrap">
        <div className="mvli-bar">
          <Eyebrow text={eyebrow} on={on} M={M} />
          {kinds.length > 1 && (
            <div
              className="mvli-filt"
              role="group"
              aria-label={filterLabel}
              style={rise(on, 120, 10)}
            >
              {['', ...kinds].map((k) => (
                <button
                  key={k || 'all'}
                  type="button"
                  style={M}
                  aria-pressed={kk === k}
                  className={kk === k ? 'is-on' : ''}
                  onClick={() => setKind(k)}
                >
                  {k || allLabel}
                  {k ? (
                    <em>
                      {pad(
                        rows.filter(
                          (r) => String(r.f2 || '').trim() === k
                        ).length
                      )}
                    </em>
                  ) : (
                    <em>{pad(rows.length)}</em>
                  )}
                </button>
              ))}
            </div>
          )}
          {rows.length > 0 && (
            <p
              className="mvli-count"
              style={{ ...M, ...rise(on, 200, 10) }}
              aria-live="polite"
            >
              {count}
            </p>
          )}
        </div>
        {rows.length === 0 ? (
          emptyText ? (
            <p className="mvli-empty" style={M}>
              {emptyText}
            </p>
          ) : null
        ) : shown.length === 0 ? (
          <p className="mvli-empty" style={M}>
            {noMatch}
          </p>
        ) : (
          <ul ref={grid} key={kk || 'all'} className="mvli-grid">
            {shown.map(({ r, n }, i) => {
              const key = r.slug || String(n);
              const img = imgOr(r);
              const tools = listOf(r.f4);
              const pl = play === key;
              return (
                <li
                  key={key}
                  data-k={key}
                  className={`mvli-card${pl ? ' is-play' : ''}`}
                  style={{ '--i': i }}
                >
                  <a
                    className="mvli-a"
                    href={`#lab-${r.slug || n}`}
                    onPointerEnter={(e) => {
                      setPlay(key);
                      expose(key, e.currentTarget.parentElement);
                    }}
                    onPointerLeave={() => setPlay('')}
                    onFocus={(e) => {
                      setPlay(key);
                      expose(key, e.currentTarget.parentElement);
                    }}
                    onBlur={() => setPlay('')}
                  >
                    <div className="mvli-film" aria-hidden>
                      <i className="mvli-band">
                        <b style={M}>
                          {edgeCode} ▸ {pad(n)}A
                        </b>
                      </i>
                      <div className="mvli-win">
                        <img
                          {...RS(
                            img,
                            phone
                              ? '92vw'
                              : tab
                              ? '46vw'
                              : '30vw'
                          )}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                        <i className="mvli-lit" />
                        <i className="mvli-fl" />
                        <i className="mvli-grain" />
                        <span
                          className="mvli-play"
                          style={M}
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M7 5v14l12-7z"
                              fill="currentColor"
                            />
                          </svg>
                          {pl
                            ? `00:${pad(sec % 60)}`
                            : playLabel}
                        </span>
                        <span
                          className="mvli-open"
                          style={M}
                        >
                          {openLabel}
                          <Glyph />
                        </span>
                      </div>
                      <i className="mvli-band is-b">
                        <b style={M}>
                          {pad(n)}A ◂ {stockCode}
                        </b>
                      </i>
                    </div>
                    <div className="mvli-cap">
                      <p className="mvli-meta" style={M}>
                        <b>{pad(n)}</b>
                        {r.f2 && <span>{r.f2}</span>}
                        {r.f3 && <span>{r.f3}</span>}
                      </p>
                      <h2 className="mvli-t" style={D}>
                        {r.f1}
                      </h2>
                      {r.f5 && (
                        <p className="mvli-sum">
                          {r.f5}
                        </p>
                      )}
                      {tools.length > 0 && (
                        <p
                          className="mvli-tools"
                          style={M}
                        >
                          {tools.map((t, j) => (
                            <i key={j}>{t}</i>
                          ))}
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

const CSS_LI = `
.mvli{background:var(--mv-pine);color:var(--mv-cloud);padding:clamp(40px,4vw,64px) 0 clamp(96px,9vw,150px);overflow:clip;--film:color-mix(in srgb,var(--mv-night) 55%,#000);--hair:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--fl:0}
.mvli .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px} .mvli .mv-eb i{border-radius:1px}
/* toolbar: eyebrow · kind chips · count */
.mvli-bar{position:relative;z-index:2;display:flex;align-items:center;gap:16px 24px;flex-wrap:wrap;padding-bottom:clamp(28px,3vw,44px);margin-bottom:clamp(28px,3vw,44px);border-bottom:1px solid var(--hair)}
.mvli-filt{display:flex;flex-wrap:wrap;gap:6px;margin-right:auto}
.mvli-bar .mv-eb{margin-right:8px}
.mvli-filt button{appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:10px;background:color-mix(in srgb,var(--mv-cloud) 6%,transparent);box-shadow:inset 0 0 0 1px var(--hair);color:var(--mv-cloud);font-size:12px;letter-spacing:.1em;text-transform:uppercase;transition:background .3s,color .3s,box-shadow .3s}
.mvli-filt button em{font-style:normal;font-size:12px;opacity:.6}
.mvli-filt button:hover{background:color-mix(in srgb,var(--mv-cloud) 12%,transparent)}
.mvli-filt button.is-on{background:var(--mv-brass);color:var(--mv-ink);box-shadow:none} .mvli-filt button.is-on em{opacity:1}
.mvli-count{margin:0 0 0 auto;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut);white-space:nowrap}
.mvli-empty{margin:0;padding:40px 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
/* the beam: a warm cone thrown from above the viewport, rotated about its apex */
.mvli-beamwrap{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.mvli-beam{position:absolute;left:0;top:0;width:0;height:0;will-change:transform}
.mvli-beam i{position:absolute;left:0;top:0;width:calc(min(190vh,1700px) * .62);height:min(190vh,1700px);translate:-50% 0;clip-path:polygon(50% 0,100% 100%,0 100%);background:radial-gradient(60% 100% at 50% 0%,rgba(255,236,208,.3),rgba(255,226,180,.1) 50%,rgba(255,226,180,0) 85%);-webkit-mask:linear-gradient(90deg,transparent 8%,#000 38%,#000 62%,transparent 92%);mask:linear-gradient(90deg,transparent 8%,#000 38%,#000 62%,transparent 92%);mix-blend-mode:screen;filter:blur(10px)}
.mvli-beam i::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,241,218,.22),rgba(255,241,218,0) 55%);clip-path:polygon(50% 0,58% 100%,42% 100%)}
/* the wall */
.mvli-grid{position:relative;z-index:2;list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(40px,3.6vw,64px) clamp(20px,2vw,32px)}
.mvli.is-tab .mvli-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.mvli.is-ph .mvli-grid{grid-template-columns:minmax(0,1fr);gap:44px}
.mvli-card{--e:1;--hit:0} .mvli.is-anim:not(.is-on) .mvli-card{opacity:0} .mvli.is-anim.is-on .mvli-card{animation:mvli-in .8s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i) * 70ms)}
.mvli.is-anim .mvli-card{--e:0}
@keyframes mvli-in{from{opacity:0;translate:0 26px;scale:.97}to{opacity:1;translate:0 0;scale:1}}
.mvli-a{display:flex;flex-direction:column;gap:18px;text-decoration:none;color:inherit;outline-offset:6px;border-radius:6px}
.mvli-film{position:relative;display:flex;flex-direction:column;border-radius:6px;background:var(--film);padding:0 10px;box-shadow:0 0 0 1px color-mix(in srgb,var(--mv-cloud) 5%,transparent),0 0 calc(var(--hit) * 60px) calc(var(--hit) * 4px) rgba(255,214,160,calc(var(--hit) * .22));transition:translate .5s cubic-bezier(.2,.8,.2,1)}
.mvli-band{position:relative;display:block;height:22px;background:none;-webkit-mask:none;mask:none;margin:0 -10px}
.mvli-band::before{content:"";position:absolute;inset:0;background:color-mix(in srgb,var(--mv-pine) 70%,#000);-webkit-mask:${MVLI_SPROCKET} 6px 0/24px 22px repeat-x;mask:${MVLI_SPROCKET} 6px 0/24px 22px repeat-x}
.mvli-band b{position:absolute;right:16px;bottom:-3px;z-index:1;padding:0 6px;background:var(--film);font-size:12px;font-weight:500;letter-spacing:.14em;color:#FFD9A0;opacity:calc(.8 + var(--e) * .2);white-space:nowrap}
.mvli-band.is-b b{bottom:auto;top:-3px;right:auto;left:16px}
.mvli-win{position:relative;display:block;aspect-ratio:4/3;border-radius:3px;overflow:hidden;background:#000}
.mvli-win img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(calc(1 - var(--e))) brightness(calc(.42 + var(--e) * .58)) contrast(calc(1.2 - var(--e) * .15))}
.mvli-win::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 50px rgba(0,0,0,.6);pointer-events:none}
.mvli-lit{position:absolute;inset:0;background:radial-gradient(80% 70% at 50% 0%,rgba(255,236,208,.5),transparent 70%);mix-blend-mode:soft-light;opacity:var(--hit);pointer-events:none}
.mvli-fl{position:absolute;inset:0;background:#000;opacity:calc(var(--fl) * (1 - var(--e)));pointer-events:none}
.mvli-grain{position:absolute;inset:-50%;background-image:${MVLI_GRAIN};opacity:calc((1 - var(--e)) * .16);mix-blend-mode:overlay;pointer-events:none}
.mvli-play,.mvli-open{position:absolute;display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:6px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;opacity:0;transition:opacity .3s,translate .45s cubic-bezier(.2,.8,.2,1)}
.mvli-play{left:10px;top:10px;background:rgba(0,0,0,.55);color:#FFF1DA;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);translate:0 -6px;font-variant-numeric:tabular-nums} .mvli-play svg{width:10px;height:10px;color:#FF5A4E}
.mvli-open{right:10px;bottom:10px;background:var(--mv-brass);color:var(--mv-ink);border-radius:10px;translate:0 6px} .mvli-open svg{width:13px;height:13px}
/* hover / focus = the frame plays */
.mvli-card.is-play .mvli-win img{filter:none;animation:mvli-kb 7s cubic-bezier(.3,0,.3,1) both}
@keyframes mvli-kb{from{transform:scale(1.02) translate(0,0)}to{transform:scale(1.14) translate(-2.5%,-1.5%)}}
.mvli-card.is-play .mvli-grain{opacity:.22;animation:mvli-gr .5s steps(5) infinite}
@keyframes mvli-gr{0%{transform:translate(0,0)}20%{transform:translate(-7%,4%)}40%{transform:translate(5%,-6%)}60%{transform:translate(-4%,-3%)}80%{transform:translate(6%,5%)}100%{transform:translate(0,0)}}
.mvli-card.is-play .mvli-play,.mvli-card.is-play .mvli-open{opacity:1;translate:0 0}
.mvli-card.is-play .mvli-film{translate:0 -4px}
/* slate caption */
.mvli-cap{display:flex;flex-direction:column;gap:10px;padding:0 2px}
.mvli-meta{display:flex;align-items:center;gap:10px;margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvli-meta b{font-weight:500;color:var(--mv-ink);background:var(--mv-brass);padding:2px 6px;border-radius:4px}
.mvli-meta span+span::before{content:"·";margin-right:10px}
.mvli-t{align-self:flex-start;margin:0;font-size:clamp(24px,2vw,30px);line-height:1.04;letter-spacing:-.03em;font-weight:720;font-stretch:112%;color:var(--mv-cloud);text-wrap:balance}
.mvli-sum{margin:0;font-size:16px;line-height:1.5;color:var(--mv-mut);max-width:40ch}
.mvli-tools{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 0}
.mvli-tools i{font-style:normal;font-size:12px;letter-spacing:.04em;padding:3px 7px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--hair);color:color-mix(in srgb,var(--mv-cloud) 82%,transparent)}
.mvli.is-ph .mvli-bar{flex-direction:column;align-items:flex-start} .mvli.is-ph .mvli-count{margin:0}
@media (prefers-reduced-motion:reduce){.mvli-card{--e:1!important;animation:none} .mvli-card.is-play .mvli-win img,.mvli-card.is-play .mvli-grain{animation:none}}
`;
