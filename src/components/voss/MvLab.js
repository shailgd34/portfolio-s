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
  useMagnet,
  useScrollVars,
  rise,
  plainOf,
  Eyebrow,
  Head,
  Btn,
  Glyph,
  imgOr,
  RS,
  onTick,
  focusTo,
  MAXW,
  listOf,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultLab } from './siteData';

// ---- THE OUTTAKES: the Lab rows as a 16mm FILM REEL. One continuous strip — sprocket holes top and bottom, edge numbers printed in the
// margin, a leader with a countdown at the head and a tail at the end — with each experiment as a frame (image window, title, kind · year,
// tools as mono chips). Scroll: the page pins and vertical scroll drives the reel sideways (--pp), with a projector FLICKER + gate weave on
// the images and a warm light leak that sweeps over the frame passing the centre of the gate. Hover a frame: it holds still, the image
// pushes in and an "Open ↗" chip shows. Phone / reduced motion / canvas: a native horizontal scroll-snap strip, no pin. ----

const EDGE_TXT = '#FFD9A0';
const SPROCKET = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='30'><rect x='7' y='8' width='12' height='14' rx='3'/></svg>")`;

export default function MvLab(props = {}) {
  const {
    eyebrow = 'FRAME 08 — Playground',
    heading = 'Outtakes,|side projects|and *experiments*.',
    intro = 'Things I make when nobody is waiting for them. Small tools, toys and tests — most of them open source.',
    button = 'Visit the lab',
    buttonLink = '/lab',
    openLabel = 'Open',
    leaderTitle = 'The lab reel',
    leaderSub = '16 mm · {count} frames',
    tailLabel = 'End of reel',
    frameLabel = 'Frame',
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
  const rows = props.rows || defaultLab;
  const N = rows.length;
  const pin = live && !rm && !still && !phone;
  const pad = (x) => String(x).padStart(2, '0');

  // geometry: where the strip starts (aligned with the header), how far it travels, where each frame's centre sits
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
      const els = Array.from(t.querySelectorAll('.mvlb-f'));
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

  // scroll → reel position; per frame: its distance from the gate centre (--d drives the light leak), the counter, the centred frame
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

  // projector: flicker + gate weave, only while the reel is on screen
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

  // flat strip (phone / reduced motion): the counter + centred frame follow the native horizontal scroll
  const reel = useRef(null);
  useEffect(() => {
    if (!live || pin || !reel.current || !track.current) return;
    const el = reel.current;
    let raf = 0;
    const f = () => {
      raf = 0;
      const els = Array.from(track.current.querySelectorAll('.mvlb-f'));
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
        (t?.closest('.mvlb-f') || t)?.scrollIntoView({
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

  return (
    <section
      ref={root}
      id={props.id || "lab"}
      className={`mv mv-sec mv-dark mvlb${pin ? ' is-pin' : ' is-flat'}${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}`}
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
          __html: CSS_BASE + CSS_MOTION + CSS_LB + siteFontCss(props),
        }}
      />
      <div className="mvlb-stick">
        <div className="mv-wrap">
          <header ref={hd} className="mvlb-top">
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
            <div className="mvlb-side" style={rise(on, 380, 14)}>
              {intro && <p className="mvlb-intro">{intro}</p>}
              <div className="mvlb-act">
                <Btn
                  href={buttonLink || '/lab'}
                  label={button}
                  kind="ghost"
                />
                {N > 0 && (
                  <p className="mvlb-cnt" style={M} aria-hidden>
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
        <div ref={reel} className="mvlb-reel" style={rise(on, 240, 24)}>
          {pin && <i className="mvlb-gate" aria-hidden />}
          <div ref={track} className="mvlb-track" role="list">
            <div className="mvlb-cell mvlb-lead" aria-hidden>
              <i className="mvlb-band" />
              <div className="mvlb-body">
                <span className="mvlb-count" style={D}>
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" />
                    <circle cx="50" cy="50" r="34" />
                    <path d="M50 2v96M2 50h96" />
                  </svg>
                  <b>{Math.min(9, Math.max(1, N))}</b>
                </span>
                <p style={D}>{leaderTitle}</p>
                <em style={M}>
                  {leaderSub.replace(/\{count\}/g, String(N))}
                </em>
              </div>
              <i className="mvlb-band is-b" />
            </div>
            {rows.map((r, i) => {
              const img = imgOr(r);
              const tools = listOf(r.f4);
              return (
                <div
                  key={r.slug || i}
                  role="listitem"
                  className="mvlb-cell mvlb-f"
                  style={{ '--d': 9 }}
                >
                  <i className="mvlb-band" aria-hidden>
                    <b style={M}>
                      {edgeCode} ▸ {pad(i + 1)}A
                    </b>
                  </i>
                  <a
                    className="mvlb-body"
                    href={`/lab/${r.slug || ''}`}
                    onFocus={(e) => focusFrame(i, e.currentTarget)}
                    aria-label={`${r.f1}${r.f2 ? `, ${r.f2}` : ''}${r.f3 ? ` ${r.f3}` : ''}`}
                  >
                    <span className="mvlb-win">
                      <img
                        {...RS(img, phone ? '80vw' : '460px')}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <i className="mvlb-fl" aria-hidden />
                      <i className="mvlb-leak" aria-hidden />
                      {r.logo && (
                        <span className="mvlb-logo-chip" aria-hidden>
                          <img src={r.logo} alt="" />
                          {r.client && <b>{r.client}</b>}
                        </span>
                      )}
                      <span className="mvlb-open" style={M} aria-hidden>
                        {openLabel}
                        <Glyph />
                      </span>
                    </span>
                    <span className="mvlb-cap">
                      <span className="mvlb-t" style={D}>
                        {r.f1}
                      </span>
                      <span className="mvlb-k" style={M}>
                        {[r.f2, r.f3].filter(Boolean).join(' · ')}
                      </span>
                      {tools.length > 0 && (
                        <span className="mvlb-tools" style={M}>
                          {tools.map((t, j) => (
                            <i key={j}>{t}</i>
                          ))}
                        </span>
                      )}
                    </span>
                  </a>
                  <i className="mvlb-band is-b" aria-hidden>
                    <b style={M}>
                      {pad(i + 1)}A ◂ {edgeCode}
                    </b>
                  </i>
                </div>
              );
            })}
            <div className="mvlb-cell mvlb-tail" aria-hidden>
              <i className="mvlb-band" />
              <div className="mvlb-body">
                <p style={M}>{tailLabel}</p>
              </div>
              <i className="mvlb-band is-b" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS_LB = `
.mvlb{background:var(--mv-pine);color:var(--mv-cloud);--film:color-mix(in srgb,var(--mv-night) 55%,#000);--hair:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--fw:clamp(250px,min(28vw,calc((100svh - 560px) * 1.3)),460px)}
.mvlb .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px}
.mvlb .mv-eb i{border-radius:1px}
.mvlb .mv-hd{margin-top:18px}
.mvlb .mv-it{color:var(--mv-brass);font-weight:inherit}
.mvlb.is-pin .mvlb-stick{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;display:flex;flex-direction:column}
.mvlb.is-flat{padding-bottom:clamp(72px,8vw,120px)}
.mvlb-top{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;padding-top:clamp(48px,7vh,88px);padding-bottom:clamp(24px,3.4vh,40px)}
.mvlb-side{display:flex;flex-direction:column;gap:22px;width:min(380px,34%)}
.mvlb-intro{margin:0;font-size:16px;line-height:1.55;color:var(--mv-mut)}
.mvlb-act{display:flex;align-items:center;justify-content:space-between;gap:16px}
.mvlb-cnt{margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvlb-cnt b{font-weight:500;color:var(--mv-cloud);font-variant-numeric:tabular-nums}
/* the reel */
.mvlb-reel{position:relative;flex:1;min-height:0;display:flex;align-items:center;overflow:clip}
.mvlb-track{display:flex;flex:none;align-items:stretch;width:max-content;will-change:transform}
.mvlb.is-pin .mvlb-track{transform:translate3d(calc(var(--x0) - var(--pp,0) * var(--tv)),0,0)}
.mvlb-gate{position:absolute;z-index:3;left:50%;top:6px;bottom:6px;width:1px;background:linear-gradient(180deg,transparent,color-mix(in srgb,#FFF1DA 45%,transparent) 12%,transparent 30%,transparent 70%,color-mix(in srgb,#FFF1DA 45%,transparent) 88%,transparent);pointer-events:none}
.mvlb-cell{position:relative;flex:none;display:flex;flex-direction:column;background:var(--film)}
.mvlb-cell:first-child{border-radius:6px 0 0 6px} 
.mvlb-cell:last-child{border-radius:0 6px 6px 0}
.mvlb-band{position:relative;display:block;height:30px;flex:none}
.mvlb-track{position:relative}
.mvlb-track::before,.mvlb-track::after{content:"";position:absolute;z-index:1;left:0;right:0;top:0;height:30px;pointer-events:none;background:var(--mv-pine);-webkit-mask:${SPROCKET} 0 0/26px 30px repeat-x;mask:${SPROCKET} 8px 0/26px 30px repeat-x} 
.mvlb-track::after{top:auto;bottom:0}
.mvlb-band b{position:absolute;z-index:2;left:18px;bottom:-2px;font-size:12px;font-weight:500;letter-spacing:.14em;color:${EDGE_TXT};opacity:.75;white-space:nowrap;background:var(--film);padding:0 6px}
.mvlb-band.is-b b{bottom:auto;top:-2px;left:auto;right:18px}
.mvlb-body{position:relative;flex:1;display:flex;flex-direction:column;gap:14px;padding:12px 12px 16px;text-decoration:none;color:inherit;border-left:2px solid color-mix(in srgb,var(--mv-cloud) 5%,transparent);outline-offset:-4px}
.mvlb-f{width:calc(var(--fw) + 24px)}
.mvlb-win{position:relative;display:block;width:var(--fw);aspect-ratio:16/10;border-radius:6px;overflow:hidden;background:color-mix(in srgb,var(--mv-cloud) 6%,transparent)}
.mvlb-win img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;transform:translate3d(var(--wx,0px),var(--wy,0px),0);transition:scale .8s cubic-bezier(.2,.8,.2,1),filter .6s;filter:saturate(.9) contrast(1.05)}
.mvlb-logo-chip{position:absolute;left:10px;top:10px;z-index:4;display:inline-flex;align-items:center;gap:7px;padding:4px 8px;border-radius:4px;background:rgba(14,13,12,.82);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),0 6px 16px rgba(0,0,0,.5);pointer-events:none}
.mvlb-logo-chip img{position:static!important;width:18px!important;height:18px!important;object-fit:contain!important;border-radius:50%!important;transform:none!important;filter:none!important;scale:1!important}
.mvlb-logo-chip b{font:600 11px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-cloud);white-space:nowrap}
.mvlb-fl{position:absolute;inset:0;background:#FFF1DA;opacity:var(--fl,0);mix-blend-mode:overlay;pointer-events:none}
.mvlb-win::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 40px rgba(0,0,0,.55);pointer-events:none}
.mvlb-leak{position:absolute;inset:-10% -40%;background:radial-gradient(40% 70% at 30% 40%,rgba(255,170,90,.75),transparent 70%),radial-gradient(30% 60% at 70% 70%,rgba(255,226,180,.55),transparent 70%);mix-blend-mode:screen;transform:translate3d(calc(var(--d,9) * -60%),0,0);opacity:calc(.9 - var(--d,9) * var(--d,9) * 2.4);pointer-events:none}
.mvlb-open{position:absolute;right:10px;top:10px;display:inline-flex;align-items:center;gap:6px;padding:6px 8px 6px 10px;border-radius:6px;background:var(--mv-brass);color:var(--mv-ink);font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:0;translate:0 -6px;transition:opacity .3s,translate .4s cubic-bezier(.2,.8,.2,1)} 
.mvlb-open svg{width:13px;height:13px}
.mvlb-body:hover .mvlb-win img,.mvlb-body:focus-visible .mvlb-win img{scale:1.05;transform:none;filter:none}
.mvlb-body:hover .mvlb-fl,.mvlb-body:focus-visible .mvlb-fl{opacity:0}
.mvlb-body:hover .mvlb-open,.mvlb-body:focus-visible .mvlb-open{opacity:1;translate:0 0}
.mvlb-cap{display:flex;flex-direction:column;gap:6px;padding:0 2px}
.mvlb-t{font-size:clamp(20px,1.6vw,24px);line-height:1.05;letter-spacing:-.03em;font-weight:720;font-stretch:112%}
.mvlb-k{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvlb-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.mvlb-tools i{font-style:normal;font-size:12px;letter-spacing:.04em;padding:3px 7px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--hair);color:color-mix(in srgb,var(--mv-cloud) 82%,transparent)}
.mvlb-f.is-c .mvlb-t{color:#FFF1DA}
/* leader + tail */
.mvlb-lead .mvlb-body{width:calc(var(--fw) * .62);align-items:center;justify-content:center;text-align:center;gap:10px}
.mvlb-count{position:relative;display:grid;place-items:center;width:min(150px,70%);aspect-ratio:1;color:#FFF1DA}
.mvlb-count svg{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:color-mix(in srgb,#FFF1DA 45%,transparent);stroke-width:1.2}
.mvlb-count b{font-size:64px;font-weight:800;font-stretch:118%;line-height:1}
.mvlb-lead p{margin:6px 0 0;font-size:20px;font-weight:720;font-stretch:112%;letter-spacing:-.03em}
.mvlb-lead em{font-style:normal;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvlb-tail .mvlb-body{width:140px;align-items:center;justify-content:center} 
.mvlb-tail p{margin:0;writing-mode:vertical-rl;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--mv-mut)}
/* flat: native horizontal strip with snap */
.mvlb.is-flat .mvlb-reel{overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;--rp:max(56px,calc((100% - ${MAXW}) / 2));padding:0 var(--rp) 6px;scroll-padding-inline:var(--rp)}
.mvlb.is-flat .mvlb-reel::-webkit-scrollbar{display:none}
.mvlb.is-flat .mvlb-cell{scroll-snap-align:start}
.mvlb.is-tab .mvlb-reel{--rp:32px} 
.mvlb.is-tab{--fw:clamp(280px,calc((100svh - 620px) * 1.3),420px)}
.mvlb.is-tab .mvlb-top,.mvlb.is-ph .mvlb-top{flex-direction:column;align-items:flex-start;gap:24px}
.mvlb.is-tab .mvlb-side,.mvlb.is-ph .mvlb-side{width:100%;max-width:520px}
.mvlb.is-ph{--fw:min(74vw,340px)}
.mvlb.is-ph .mvlb-reel{--rp:20px}
.mvlb.is-ph .mvlb-top{padding-top:64px}
.mvlb.is-ph .mvlb-act{flex-direction:column;align-items:stretch} 
.mvlb.is-ph .mvlb-act .mv-btn{width:100%}
.mvlb.is-ph .mvlb-lead .mvlb-body{width:150px} 
.mvlb.is-ph .mvlb-count b{font-size:44px}
@media (prefers-reduced-motion:reduce){.mvlb-win img{transform:none}}
`;
