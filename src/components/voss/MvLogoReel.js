'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
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
  plainOf,
  Eyebrow,
  Head,
  Btn,
  Glyph,
  onTick,
  focusTo,
  MAXW,
  listOf,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { logoProjects } from './siteData';

const EDGE_TXT = '#FFD9A0';
const SPROCKET = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='30'><rect x='7' y='8' width='12' height='14' rx='3'/></svg>")`;

export default function MvLogoReel(props = {}) {
  const {
    eyebrow = 'ROLL 08 — BRAND IDENTITY',
    heading = 'Brand identities & *logomarks*.',
    intro = 'Commercial insignias, vector logotypes, and visual brand identities clipped from live client engagements and design systems.',
    button = 'All client works',
    buttonLink = '#',
    openLabel = 'Inspect',
    leaderTitle = 'The mark reel',
    leaderSub = '16 mm · {count} marks',
    tailLabel = 'End of reel',
    frameLabel = 'Mark',
    edgeCode = 'MV-16',
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const root = useRef(null);
  const hd = useRef(null);
  const track = useRef(null);
  const cnt = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm);
  useMagnet(root, live);
  const rows = props.rows || logoProjects;
  const N = rows.length;
  const pin = live && !rm && !still && !phone;
  const pad = (x) => String(x).padStart(2, '0');

  // Modal inspection state for logos
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [modalSurface, setModalSurface] = useState('dark');

  // geometry: where the strip starts, how far it travels
  const [geo, setGeo] = useState({ x0: 0, tv: 0 });
  const G = useRef({
    x0: 0,
    tv: 1,
    vw: 1440,
    cs: [],
    fw: 400,
    els: [],
  });

  useLayoutEffect(() => {
    if (!pin) return;
    const r = root.current,
      h = hd.current,
      t = track.current;
    if (!r || !h || !t) return;
    const m = () => {
      const vw = r.clientWidth;
      const x0 = Math.max(
        16,
        Math.round(
          h.getBoundingClientRect().left - r.getBoundingClientRect().left
        )
      );
      const tw = t.scrollWidth;
      const tv = Math.max(0, Math.round(tw + x0 * 2 - vw));
      const els = Array.from(t.querySelectorAll('.mvlgr-f'));
      G.current = {
        x0,
        tv: tv || 1,
        vw,
        cs: els.map((e) => e.offsetLeft + e.offsetWidth / 2),
        fw: els[0] ? els[0].offsetWidth : 400,
        els,
      };
      setGeo((o) => (o.x0 === x0 && o.tv === tv ? o : { x0, tv }));
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(r);
    ro.observe(t);
    const t1 = window.setTimeout(m, 800);
    return () => {
      ro.disconnect();
      window.clearTimeout(t1);
    };
  }, [pin, N, w]);

  // scroll → reel position; per frame: its distance from the gate centre
  const lastC = useRef(-1);
  const lastD = useRef([]);
  useScrollVars(root, pin, rm, (_sp, pp) => {
    const g = G.current;
    if (!g.els.length) return;
    const shift = g.x0 - pp * g.tv;
    let best = 0,
      bd = 1e9;
    g.els.forEach((el, i) => {
      const d = (g.cs[i] + shift - g.vw / 2) / g.fw;
      if (Math.abs(d) < bd) {
        bd = Math.abs(d);
        best = i;
      }
      const q = Math.round(d * 100) / 100;
      if (lastD.current[i] !== q) {
        lastD.current[i] = q;
        el.style.setProperty('--d', String(q));
      }
    });
    if (best !== lastC.current) {
      const prev = g.els[lastC.current];
      if (prev) prev.classList.remove('is-c');
      if (g.els[best]) g.els[best].classList.add('is-c');
      lastC.current = best;
      if (cnt.current) cnt.current.textContent = pad(best + 1);
    }
  });

  // projector: flicker + gate weave
  useEffect(() => {
    if (!pin || !root.current) return;
    const el = root.current;
    let vis = false,
      k = 0;
    const io = new IntersectionObserver((es) => {
      vis = es[0].isIntersecting;
    });
    io.observe(el);
    const off = onTick(() => {
      if (!vis || k++ & 1) return;
      const r = Math.random();
      el.style.setProperty(
        '--wx',
        `${((Math.random() - 0.5) * 1.2).toFixed(2)}px`
      );
      el.style.setProperty(
        '--wy',
        `${((Math.random() - 0.5) * 1.6).toFixed(2)}px`
      );
      el.style.setProperty(
        '--fl',
        (r > 0.93 ? 0.16 : r * 0.07).toFixed(3)
      );
    });
    return () => {
      off();
      io.disconnect();
    };
  }, [pin]);

  // flat strip (phone / mobile)
  const reel = useRef(null);
  useEffect(() => {
    if (!live || pin || !reel.current || !track.current) return;
    const el = reel.current;
    let raf = 0;
    const f = () => {
      raf = 0;
      const els = Array.from(track.current.querySelectorAll('.mvlgr-f'));
      const mid =
        el.scrollLeft + el.clientWidth * (el.scrollLeft < 8 ? 0.2 : 0.5);
      let best = 0,
        bd = 1e9;
      els.forEach((e, i) => {
        const d = Math.abs(e.offsetLeft + e.offsetWidth / 2 - mid);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      if (best !== lastC.current) {
        const prev = els[lastC.current];
        if (prev) prev.classList.remove('is-c');
        if (els[best]) els[best].classList.add('is-c');
        lastC.current = best;
        if (cnt.current) cnt.current.textContent = pad(best + 1);
      }
    };
    const on2 = () => {
      if (!raf) raf = requestAnimationFrame(f);
    };
    el.addEventListener('scroll', on2, { passive: true });
    f();
    return () => {
      el.removeEventListener('scroll', on2);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [live, pin, N]);

  const focusFrame = (i, t) => {
    if (!pin) {
      try {
        (t?.closest('.mvlgr-f') || t)?.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        });
      } catch (x) {}
      return;
    }
    const g = G.current;
    if (!g.cs[i]) return;
    focusTo(root.current, (g.cs[i] + g.x0 - g.vw / 2) / g.tv);
  };

  const handleCardClick = (e, item) => {
    e.preventDefault();
    setSelectedLogo(item);
    setModalSurface(item.logoData?.bgColor?.startsWith('#fff') ? 'light' : 'dark');
  };

  return (
    <section
      ref={root}
      id={props.id || "brand-logos"}
      className={`mv mv-sec mv-dark mvlgr${pin ? ' is-pin' : ' is-flat'}${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        '--x0': `${geo.x0}px`,
        '--tv': `${geo.tv}px`,
        ...(pin ? { height: `calc(100svh + ${geo.tv}px)` } : {}),
        ...(props.style || {}),
      }}
      aria-label={plainOf(heading)}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_LGR + siteFontCss(props),
        }}
      />
      <div className="mvlgr-stick">
        <div className="mv-wrap">
          <header ref={hd} className="mvlgr-top">
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
            <div className="mvlgr-side" style={rise(on, 380, 14)}>
              {intro && <p className="mvlgr-intro">{intro}</p>}
              <div className="mvlgr-act">
                {N > 0 && (
                  <p className="mvlgr-cnt" style={M} aria-hidden>
                    {frameLabel}{' '}
                    <b>
                      <span ref={cnt}>01</span> / {pad(N)}
                    </b>
                  </p>
                )}
              </div>
            </div>
          </header>
        </div>

        <div ref={reel} className="mvlgr-reel" style={rise(on, 240, 24)}>
          {pin && <i className="mvlgr-gate" aria-hidden />}
          <div ref={track} className="mvlgr-track" role="list">
            {/* Leader Countdown Slate */}
            <div className="mvlgr-cell mvlgr-lead" aria-hidden>
              <i className="mvlgr-band" />
              <div className="mvlgr-body">
                <span className="mvlgr-count" style={D}>
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" />
                    <circle cx="50" cy="50" r="34" />
                    <path d="M50 2v96M2 50h96" />
                  </svg>
                  <b>{Math.min(17, Math.max(1, N))}</b>
                </span>
                <p style={D}>{leaderTitle}</p>
                <em style={M}>
                  {leaderSub.replace(/\{count\}/g, String(N))}
                </em>
              </div>
              <i className="mvlgr-band is-b" />
            </div>

            {/* 17 Logo Frames */}
            {rows.map((r, i) => {
              const tools = Array.isArray(r.technology) ? r.technology : [];
              return (
                <div
                  key={r.slug || i}
                  role="listitem"
                  className="mvlgr-cell mvlgr-f"
                  style={{ '--d': 9 }}
                >
                  <i className="mvlgr-band" aria-hidden>
                    <b style={M}>
                      {edgeCode} ▸ {pad(i + 1)}A
                    </b>
                  </i>
                  <a
                    className="mvlgr-body"
                    href={r.link || `/work/${r.slug || ''}`}
                    onClick={(e) => handleCardClick(e, r)}
                    onFocus={(e) => focusFrame(i, e.currentTarget)}
                    aria-label={`${r.f1}${r.f2 ? `, ${r.f2}` : ''}${r.f3 ? ` ${r.f3}` : ''}`}
                  >
                    <span className="mvlgr-win">
                      <img
                        src={r.img}
                        alt={r.f1 || 'Logomark'}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="mvlgr-logo-img"
                      />
                      <i className="mvlgr-fl" aria-hidden />
                      <i className="mvlgr-leak" aria-hidden />

                      {r.f10 && (
                        <span className="mvlgr-tag" style={M}>
                          {r.f10}
                        </span>
                      )}

                      <span className="mvlgr-open" style={M} aria-hidden>
                        {openLabel}
                        <Glyph />
                      </span>
                    </span>
                    <span className="mvlgr-cap">
                      <span className="mvlgr-t" style={D}>
                        {r.f1}
                      </span>
                      <span className="mvlgr-k" style={M}>
                        {[r.f2, r.f3, r.f4].filter(Boolean).join(' · ')}
                      </span>
                      {tools.length > 0 && (
                        <span className="mvlgr-tools" style={M}>
                          {tools.slice(0, 3).map((t, j) => (
                            <i key={j}>{t}</i>
                          ))}
                        </span>
                      )}
                    </span>
                  </a>
                  <i className="mvlgr-band is-b" aria-hidden>
                    <b style={M}>
                      {pad(i + 1)}A ◂ {edgeCode}
                    </b>
                  </i>
                </div>
              );
            })}

            {/* Tail */}
            <div className="mvlgr-cell mvlgr-tail" aria-hidden>
              <i className="mvlgr-band" />
              <div className="mvlgr-body">
                <p style={M}>{tailLabel}</p>
              </div>
              <i className="mvlgr-band is-b" />
            </div>
          </div>
        </div>
      </div>

      {/* Retro Logomark Inspection Modal */}
      {selectedLogo && (
        <div
          className="mvlgr-modal-overlay"
          onClick={() => setSelectedLogo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="mvlgr-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mvlgr-modal-head">
              <div className="mvlgr-modal-meta" style={M}>
                <span>[ LOGOMARK DOSSIER // {selectedLogo.f1.toUpperCase()} ]</span>
                <span className="mvlgr-modal-year">YEAR {selectedLogo.f4}</span>
              </div>
              <button
                type="button"
                className="mvlgr-modal-close"
                onClick={() => setSelectedLogo(null)}
                aria-label="Close dossier"
              >
                ✕
              </button>
            </div>

            <div className="mvlgr-modal-body">
              <div className={`mvlgr-modal-canvas is-${modalSurface}`}>
                <div className="mvlgr-modal-surface-bar">
                  <span style={M}>SURFACE:</span>
                  <button
                    type="button"
                    className={modalSurface === 'dark' ? 'is-active' : ''}
                    onClick={() => setModalSurface('dark')}
                  >
                    DARK
                  </button>
                  <button
                    type="button"
                    className={modalSurface === 'light' ? 'is-active' : ''}
                    onClick={() => setModalSurface('light')}
                  >
                    LIGHT
                  </button>
                </div>
                <div className="mvlgr-modal-img-wrap">
                  <img
                    src={selectedLogo.img}
                    alt={selectedLogo.f1}
                    className="mvlgr-modal-img"
                  />
                </div>
              </div>

              <div className="mvlgr-modal-info">
                <div className="mvlgr-modal-tag" style={M}>
                  {selectedLogo.f10 || 'TRADEMARK'}
                </div>
                <h3 className="mvlgr-modal-title" style={D}>
                  {selectedLogo.f1}
                </h3>
                <p className="mvlgr-modal-client" style={M}>
                  {selectedLogo.f2} · {selectedLogo.f3}
                </p>
                <p className="mvlgr-modal-desc">
                  {selectedLogo.f5}
                </p>

                <div className="mvlgr-modal-deliverables">
                  <span className="mvlgr-deliv-head" style={M}>
                    DELIVERABLES &amp; TOOLS:
                  </span>
                  <div className="mvlgr-deliv-tags" style={M}>
                    {selectedLogo.technology?.map((t, idx) => (
                      <span key={idx}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const CSS_LGR = `
.mvlgr{background:#11100E;color:var(--mv-cloud);--film:#0B0A09;--hair:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--fw:clamp(250px,min(28vw,calc((100svh - 560px) * 1.3)),460px);border-top:1px solid rgba(255,241,218,.12)}
.mvlgr .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px}
.mvlgr .mv-eb i{border-radius:1px}
.mvlgr .mv-hd{margin-top:18px}
.mvlgr .mv-it{color:var(--mv-brass);font-weight:inherit}
.mvlgr.is-pin .mvlgr-stick{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;display:flex;flex-direction:column}
.mvlgr.is-flat{padding-bottom:clamp(72px,8vw,120px)}
.mvlgr-top{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;padding-top:clamp(48px,7vh,88px);padding-bottom:clamp(24px,3.4vh,40px)}
.mvlgr-side{display:flex;flex-direction:column;gap:22px;width:min(380px,34%)}
.mvlgr-intro{margin:0;font-size:16px;line-height:1.55;color:var(--mv-mut)}
.mvlgr-act{display:flex;align-items:center;justify-content:space-between;gap:16px}
.mvlgr-cnt{margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvlgr-cnt b{font-weight:500;color:var(--mv-cloud);font-variant-numeric:tabular-nums}
/* the reel */
.mvlgr-reel{position:relative;flex:1;min-height:0;display:flex;align-items:center;overflow:clip}
.mvlgr-track{display:flex;flex:none;align-items:stretch;width:max-content;will-change:transform}
.mvlgr.is-pin .mvlgr-track{transform:translate3d(calc(var(--x0) - var(--pp,0) * var(--tv)),0,0)}
.mvlgr-gate{position:absolute;z-index:3;left:50%;top:6px;bottom:6px;width:1px;background:linear-gradient(180deg,transparent,color-mix(in srgb,#FFF1DA 45%,transparent) 12%,transparent 30%,transparent 70%,color-mix(in srgb,#FFF1DA 45%,transparent) 88%,transparent);pointer-events:none}
.mvlgr-cell{position:relative;flex:none;display:flex;flex-direction:column;background:var(--film)}
.mvlgr-cell:first-child{border-radius:6px 0 0 6px}
.mvlgr-cell:last-child{border-radius:0 6px 6px 0}
.mvlgr-band{position:relative;display:block;height:30px;flex:none}
.mvlgr-track{position:relative}
.mvlgr-track::before,.mvlgr-track::after{content:"";position:absolute;z-index:1;left:0;right:0;top:0;height:30px;pointer-events:none;background:#11100E;-webkit-mask:${SPROCKET} 0 0/26px 30px repeat-x;mask:${SPROCKET} 8px 0/26px 30px repeat-x}
.mvlgr-track::after{top:auto;bottom:0}
.mvlgr-band b{position:absolute;z-index:2;left:18px;bottom:-2px;font-size:12px;font-weight:500;letter-spacing:.14em;color:${EDGE_TXT};opacity:.75;white-space:nowrap;background:var(--film);padding:0 6px}
.mvlgr-band.is-b b{bottom:auto;top:-2px;left:auto;right:18px}
.mvlgr-body{position:relative;flex:1;display:flex;flex-direction:column;gap:14px;padding:12px 12px 16px;text-decoration:none;color:inherit;border-left:2px solid color-mix(in srgb,var(--mv-cloud) 5%,transparent);outline-offset:-4px;cursor:pointer}
.mvlgr-f{width:calc(var(--fw) + 24px)}
.mvlgr-win{position:relative;display:block;width:var(--fw);aspect-ratio:16/10;border-radius:6px;overflow:hidden;background:#161513;border:1px solid rgba(255,241,218,.08)}
.mvlgr-logo-img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:clamp(18px,2.4vw,28px);display:block;transform:translate3d(var(--wx,0px),var(--wy,0px),0);transition:scale .7s cubic-bezier(.2,.8,.2,1),filter .5s;filter:brightness(1.02)}
.mvlgr-tag{position:absolute;left:10px;top:10px;z-index:4;padding:4px 8px;border-radius:4px;background:rgba(14,13,12,.85);color:var(--mv-brass);border:1px solid rgba(255,241,218,.14);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase}
.mvlgr-fl{position:absolute;inset:0;background:#FFF1DA;opacity:var(--fl,0);mix-blend-mode:overlay;pointer-events:none}
.mvlgr-win::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 30px rgba(0,0,0,.45);pointer-events:none}
.mvlgr-leak{position:absolute;inset:-10% -40%;background:radial-gradient(40% 70% at 30% 40%,rgba(255,170,90,.65),transparent 70%),radial-gradient(30% 60% at 70% 70%,rgba(255,226,180,.45),transparent 70%);mix-blend-mode:screen;transform:translate3d(calc(var(--d,9) * -60%),0,0);opacity:calc(.85 - var(--d,9) * var(--d,9) * 2.4);pointer-events:none}
.mvlgr-open{position:absolute;right:10px;top:10px;display:inline-flex;align-items:center;gap:6px;padding:6px 8px 6px 10px;border-radius:10px;background:var(--mv-brass);color:var(--mv-ink);font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:0;translate:0 -6px;transition:opacity .3s,translate .4s cubic-bezier(.2,.8,.2,1)}
.mvlgr-open svg{width:13px;height:13px}
.mvlgr-body:hover .mvlgr-logo-img,.mvlgr-body:focus-visible .mvlgr-logo-img{scale:1.06;filter:brightness(1.08)}
.mvlgr-body:hover .mvlgr-fl,.mvlgr-body:focus-visible .mvlgr-fl{opacity:0}
.mvlgr-body:hover .mvlgr-open,.mvlgr-body:focus-visible .mvlgr-open{opacity:1;translate:0 0}
.mvlgr-cap{display:flex;flex-direction:column;gap:6px;padding:0 2px}
.mvlgr-t{font-size:clamp(20px,1.6vw,24px);line-height:1.05;letter-spacing:-.03em;font-weight:720;font-stretch:112%}
.mvlgr-k{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvlgr-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.mvlgr-tools i{font-style:normal;font-size:12px;letter-spacing:.04em;padding:3px 7px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--hair);color:color-mix(in srgb,var(--mv-cloud) 82%,transparent)}
.mvlgr-f.is-c .mvlgr-t{color:#FFF1DA}
/* leader + tail */
.mvlgr-lead .mvlgr-body{width:calc(var(--fw) * .62);align-items:center;justify-content:center;text-align:center;gap:10px}
.mvlgr-count{position:relative;display:grid;place-items:center;width:min(150px,70%);aspect-ratio:1;color:#FFF1DA}
.mvlgr-count svg{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:color-mix(in srgb,#FFF1DA 45%,transparent);stroke-width:1.2}
.mvlgr-count b{font-size:64px;font-weight:800;font-stretch:118%;line-height:1}
.mvlgr-lead p{margin:6px 0 0;font-size:20px;font-weight:720;font-stretch:112%;letter-spacing:-.03em}
.mvlgr-lead em{font-style:normal;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvlgr-tail .mvlgr-body{width:140px;align-items:center;justify-content:center}
.mvlgr-tail p{margin:0;writing-mode:vertical-rl;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--mv-mut)}
/* flat: native horizontal strip with snap */
.mvlgr.is-flat .mvlgr-reel{overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;--rp:max(56px,calc((100% - ${MAXW}) / 2));padding:0 var(--rp) 6px;scroll-padding-inline:var(--rp)}
.mvlgr.is-flat .mvlgr-reel::-webkit-scrollbar{display:none}
.mvlgr.is-flat .mvlgr-cell{scroll-snap-align:start}
.mvlgr.is-tab .mvlgr-reel{--rp:32px}
.mvlgr.is-tab{--fw:clamp(280px,calc((100svh - 620px) * 1.3),420px)}
.mvlgr.is-tab .mvlgr-top,.mvlgr.is-ph .mvlgr-top{flex-direction:column;align-items:flex-start;gap:24px}
.mvlgr.is-tab .mvlgr-side,.mvlgr.is-ph .mvlgr-side{width:100%;max-width:520px}
.mvlgr.is-ph{--fw:min(74vw,340px)}
.mvlgr.is-ph .mvlgr-reel{--rp:20px}
.mvlgr.is-ph .mvlgr-top{padding-top:64px}
.mvlgr.is-ph .mvlgr-act{flex-direction:column;align-items:stretch}
.mvlgr.is-ph .mvlgr-lead .mvlgr-body{width:150px}
.mvlgr.is-ph .mvlgr-count b{font-size:44px}
/* modal */
.mvlgr-modal-overlay{position:fixed;inset:0;z-index:99999;background:rgba(10,9,8,.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px}
.mvlgr-modal-card{width:min(880px,96vw);background:#181614;border:1px solid rgba(255,241,218,.18);border-radius:12px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.75)}
.mvlgr-modal-head{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid rgba(255,241,218,.12);background:#13110F}
.mvlgr-modal-meta{font-size:12px;letter-spacing:.1em;color:var(--mv-brass);display:flex;gap:12px}
.mvlgr-modal-year{color:var(--mv-mut)}
.mvlgr-modal-close{background:none;border:0;color:var(--mv-cloud);font-size:18px;cursor:pointer;padding:4px 8px;border-radius:4px}
.mvlgr-modal-close:hover{background:rgba(255,255,255,.1)}
.mvlgr-modal-body{display:grid;grid-template-columns:1.2fr 1fr;gap:24px;padding:24px}
.mvlgr-modal-canvas{position:relative;aspect-ratio:16/11;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,241,218,.12)}
.mvlgr-modal-canvas.is-dark{background:#0D0C0B}
.mvlgr-modal-canvas.is-light{background:#F7F4EE}
.mvlgr-modal-surface-bar{position:absolute;top:10px;left:10px;display:flex;align-items:center;gap:6px;font-size:11px;z-index:5}
.mvlgr-modal-surface-bar span{color:rgba(120,110,100,.9);font-weight:600}
.mvlgr-modal-surface-bar button{appearance:none;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:4px;padding:3px 7px;font-size:10px;cursor:pointer}
.mvlgr-modal-surface-bar button.is-active{background:var(--mv-brass);color:#111;border-color:var(--mv-brass);font-weight:700}
.mvlgr-modal-img-wrap{position:relative;width:80%;height:80%;display:flex;align-items:center;justify-content:center}
.mvlgr-modal-img{max-width:100%;max-height:100%;object-fit:contain}
.mvlgr-modal-info{display:flex;flex-direction:column;gap:10px}
.mvlgr-modal-tag{font-size:11px;letter-spacing:.1em;color:var(--mv-brass);text-transform:uppercase}
.mvlgr-modal-title{margin:0;font-size:28px;line-height:1.1;letter-spacing:-.03em}
.mvlgr-modal-client{margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut)}
.mvlgr-modal-desc{margin:6px 0 0;font-size:14px;line-height:1.55;color:rgba(240,235,225,.85)}
.mvlgr-modal-deliverables{margin-top:12px;padding-top:12px;border-top:1px dashed rgba(255,241,218,.15)}
.mvlgr-deliv-head{font-size:11px;letter-spacing:.1em;color:var(--mv-mut);display:block;margin-bottom:8px}
.mvlgr-deliv-tags{display:flex;flex-wrap:wrap;gap:6px}
.mvlgr-deliv-tags span{font-size:11px;padding:3px 8px;border-radius:4px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:rgba(255,245,230,.9)}
@media (max-width:760px){
  .mvlgr-modal-body{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){.mvlgr-logo-img{transform:none}}
`;
