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
  clamp01,
  easeIO,
  rise,
  plainOf,
  RS,
  imgOr,
  Btn,
  Eyebrow,
  Head,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultProjects } from './siteData';

// THE CONTACT SHEET: 35mm contact sheet presentation
const FILM = '#0E0D0C';
const EDGE = '#F2923A';
const RING =
  'M34 58C22 34 60 12 112 10c52-2 84 18 80 46-4 30-52 44-100 42C42 96 6 80 12 52 18 28 58 16 96 16';

export default function MvWork(props = {}) {
  const {
    eyebrow = 'FRAME 02 — Selected work',
    heading = "Work I'm|*proud* of.",
    allLabel = 'All projects',
    allLink = '#projects',
    sheetLabel = 'Contact sheet · Roll 07',
    sheetNote = 'Click a frame to enlarge it',
    filmEdge = 'SSB 400TX',
    roleLabel = 'Role',
    openLabel = 'Open project',
    frameLabel = 'Frame',
    projects = defaultProjects,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();

  const rows = projects || defaultProjects;
  const n = rows.length;

  const root = useRef(null);
  const sheet = useRef(null);
  const strip = useRef(null);
  const pic = useRef(null);
  const loupe = useRef(null);
  const { w } = useSize(root, bpHint);
  const desk = w >= 1100,
    phone = w < 810;
  const pin = desk && !still && !rm && live && n >= 2;
  const on = useOn(root, live, rm, 0.08);
  useMagnet(root, live);

  const [st, setSt] = useState({ a: 0, p: -1 });
  const a = Math.min(st.a, Math.max(0, n - 1));
  const aRef = useRef(0);
  aRef.current = a;
  const nRef = useRef(n);
  nRef.current = n;

  const go = (i) => {
    if (i === aRef.current) return;
    aRef.current = i;
    setSt((s) => ({ a: i, p: s.a }));
  };

  // Strip geometry calculation
  useLayoutEffect(() => {
    const s = strip.current;
    if (!s || !desk) return;
    const m = () => {
      const f = s.querySelectorAll('.mvwk-fr');
      if (!f.length) return;
      const f0 = f[0];
      const P =
        f.length > 1 ? f[1].offsetTop - f0.offsetTop : f0.offsetHeight;
      s.style.setProperty('--f0', `${f0.offsetTop}px`);
      s.style.setProperty('--fh', `${f0.offsetHeight}px`);
      s.style.setProperty('--P', `${P}px`);
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(s);
    return () => ro.disconnect();
  }, [desk, n]);

  // Pinned scrub: scroll progress translates strip
  useScrollVars(root, pin, rm, (_sp, pp) => {
    const N = nRef.current;
    if (N < 2) return;
    const f = pp * (N - 1);
    const k = Math.min(N - 2, Math.floor(f));
    const t = f - k;
    const pos = Math.min(N - 1, k + easeIO(clamp01((t - 0.3) / 0.55)));
    if (strip.current) strip.current.style.setProperty('--pos', pos.toFixed(4));
    go(Math.round(pos));
  });

  // Non-pinned desktop fallback
  useEffect(() => {
    if (!desk || pin || !strip.current) return;
    strip.current.style.setProperty('--pos', String(a));
  }, [a, desk, pin]);

  // Circular wipe from pencil circle
  useLayoutEffect(() => {
    const pc = pic.current,
      s = strip.current;
    if (!pc || !s) return;
    const fr = s.querySelectorAll('.mvwk-fr .mvwk-th')[a];
    if (!fr) return;
    const r = pc.getBoundingClientRect(),
      q = fr.getBoundingClientRect();
    const x = q.left + q.width / 2 - r.left,
      y = q.top + q.height / 2 - r.top;
    const far = Math.max(
      ...[
        [0, 0],
        [r.width, 0],
        [0, r.height],
        [r.width, r.height],
      ].map(([u, v]) => Math.hypot(u - x, v - y))
    );
    pc.style.setProperty('--cx', `${Math.round(x)}px`);
    pc.style.setProperty('--cy', `${Math.round(y)}px`);
    pc.style.setProperty('--cr', `${Math.round(far + 20)}px`);
  }, [a, w]);

  // Mobile / tablet horizontal scroller
  useEffect(() => {
    const sc = strip.current;
    if (!sc || desk || !live) return;
    let raf = 0;
    const near = () => {
      raf = 0;
      const mid = sc.scrollLeft + sc.clientWidth / 2;
      let bi = 0,
        bd = 1e9;
      sc.querySelectorAll('.mvwk-fr').forEach((f, i) => {
        const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - mid);
        if (d < bd) {
          bd = d;
          bi = i;
        }
      });
      go(bi);
    };
    const onS = () => {
      if (!raf) raf = requestAnimationFrame(near);
    };

    let dn = false,
      sx = 0,
      sl = 0,
      moved = 0;
    const pd = (e) => {
      if (e.pointerType !== 'mouse') return;
      dn = true;
      moved = 0;
      sx = e.clientX;
      sl = sc.scrollLeft;
      sc.classList.add('is-drag');
    };
    const pm = (e) => {
      if (!dn) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      sc.scrollLeft = sl - dx;
    };
    const pu = () => {
      if (!dn) return;
      dn = false;
      sc.classList.remove('is-drag');
    };
    const ck = (e) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };

    sc.addEventListener('scroll', onS, { passive: true });
    sc.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    sc.addEventListener('click', ck, true);
    return () => {
      cancelAnimationFrame(raf);
      sc.removeEventListener('scroll', onS);
      sc.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
      sc.removeEventListener('click', ck, true);
    };
  }, [desk, live, n]);

  const jump = (i, instant = false) => {
    const el = root.current;
    if (!el) return;
    if (pin) {
      const r = el.getBoundingClientRect();
      const y =
        r.top +
        window.scrollY +
        (i / Math.max(1, n - 1)) * (el.offsetHeight - window.innerHeight) +
        2;
      const L = window.__ltLenis || window.__lenis;
      if (L && L.scrollTo)
        L.scrollTo(
          y,
          instant ? { immediate: true, force: true } : { duration: 1.2 }
        );
      else
        window.scrollTo({
          top: y,
          behavior: instant ? 'auto' : 'smooth',
        });
      return;
    }
    go(i);
    const sc = strip.current;
    if (!desk && sc) {
      const f = sc.querySelectorAll('.mvwk-fr')[i];
      if (f)
        sc.scrollTo({
          left: f.offsetLeft - (sc.clientWidth - f.offsetWidth) / 2,
          behavior: rm || instant ? 'auto' : 'smooth',
        });
    }
  };

  // Loupe magnifier interaction
  const lp = (e) => {
    const L = loupe.current,
      sh = sheet.current;
    if (!L || !sh || e.pointerType !== 'mouse') return;
    const th = e.target.closest?.('.mvwk-th');
    if (!th) {
      L.classList.remove('is-on');
      return;
    }
    const i = Number(th.dataset.i || 0);
    const r = th.getBoundingClientRect(),
      s = sh.getBoundingClientRect();
    const Z = 2.6,
      S = 150;
    const rx = clamp01((e.clientX - r.left) / r.width),
      ry = clamp01((e.clientY - r.top) / r.height);
    const inn = L.firstElementChild;
    L.style.transform = `translate3d(${Math.round(e.clientX - s.left - S / 2)}px,${Math.round(e.clientY - s.top - S / 2)}px,0)`;
    if (inn) {
      if (inn.dataset.i !== String(i)) {
        inn.dataset.i = String(i);
        inn.style.backgroundImage = `url("${RS(imgOr(rows[i]), '480px').src}")`;
      }
      inn.style.width = `${r.width * Z}px`;
      inn.style.height = `${r.height * Z}px`;
      inn.style.transform = `translate3d(${Math.round(S / 2 - rx * r.width * Z)}px,${Math.round(S / 2 - ry * r.height * Z)}px,0)`;
    }
    L.classList.add('is-on');
  };

  const info = useRef(null);
  const firstA = useRef(true);
  useLayoutEffect(() => {
    if (firstA.current) {
      firstA.current = false;
      return;
    }
    const el = info.current;
    if (!el) return;
    el.querySelectorAll(':scope > *').forEach((k) => {
      try {
        k.getAnimations().forEach((an) => {
          an.cancel();
          an.play();
        });
      } catch (x) {}
    });
  }, [a]);

  const cur = rows[a] || {};
  const pad2 = (x) => String(x).padStart(2, '0');
  const dfw = props.customFonts ? D.fontWeight : 'var(--mv-font-dw, 720)';
  const holes = () => (
    <i className="mvwk-holes" aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((h) => (
        <b key={h} />
      ))}
    </i>
  );

  return (
    <section
      ref={root}
      id="projects"
      className={`mv mv-sec mv-dark mvwk${desk ? ' is-desk' : ' is-row'}${phone ? ' is-ph' : !desk ? ' is-tab' : ''}${pin ? ' is-pin' : ''}${still || rm ? ' is-final' : ''}${on ? ' is-on' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        ...(pin ? { height: `calc(100vh + ${(n - 1) * 48}vh)` } : {}),
        ...(props.style || {}),
      }}
      aria-label={plainOf(heading)}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_MVWK + siteFontCss(props),
        }}
      />
      <div className="mvwk-stick">
        <div className="mv-wrap mvwk-grid">
          <header className="mvwk-hd">
            <div className="mvwk-hl">
              <Eyebrow text={eyebrow} on={on} M={M} />
              <Head
                text={heading}
                on={on}
                D={D}
                size="clamp(40px,4.3vw,64px)"
                lh={0.95}
                delay={120}
                style={{ fontWeight: dfw, fontStretch: '115%' }}
              />
            </div>
            {allLabel && (
              <div style={rise(on, 500, 12)}>
                <Btn
                  href={allLink || '#projects'}
                  label={allLabel}
                  kind="ghost"
                />
              </div>
            )}
          </header>
          <div
            ref={sheet}
            className="mvwk-sheet"
            style={rise(on, 150, 24)}
            onPointerMove={lp}
            onPointerLeave={() => loupe.current?.classList.remove('is-on')}
          >
            {desk && (
              <p className="mvwk-sl" style={M}>
                <span>{sheetLabel}</span>
                <span>{pad2(n)} exp.</span>
              </p>
            )}
            <div
              ref={strip}
              className="mvwk-strip"
              style={{ '--pos': a }}
              role="list"
              aria-label={sheetLabel}
            >
              {rows.map((r, i) => {
                const im = RS(imgOr(r), desk ? '260px' : '220px');
                return (
                  <div
                    key={r.slug || i}
                    role="listitem"
                    className={`mvwk-fr${i === a ? ' is-a' : ''}`}
                  >
                    <span className="mvwk-lane is-l" aria-hidden>
                      {holes()}
                      <em style={M}>{pad2(i + 1)}A</em>
                    </span>
                    <button
                      type="button"
                      className="mvwk-th"
                      data-i={i}
                      aria-label={`${frameLabel} ${pad2(i + 1)}: ${r.f1 || ''}`}
                      aria-pressed={i === a}
                      onClick={() => jump(i)}
                      onFocus={(e) => {
                        try {
                          if (
                            (pin || !desk) &&
                            e.target.matches(':focus-visible')
                          )
                            jump(i, true);
                        } catch (x) {}
                      }}
                    >
                      <img
                        src={im.src}
                        srcSet={im.srcSet}
                        sizes={im.sizes}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </button>
                    {i === a && (
                      <svg
                        key={`r${a}`}
                        className="mvwk-ring"
                        viewBox="0 0 200 110"
                        preserveAspectRatio="none"
                        aria-hidden
                      >
                        <path d={RING} pathLength={1} />
                      </svg>
                    )}
                    <span className="mvwk-lane is-r" aria-hidden>
                      {holes()}
                      <em style={M}>
                        {filmEdge} {i + 1}
                      </em>
                    </span>
                  </div>
                );
              })}
            </div>
            {desk && (
              <p className="mvwk-sn" style={M}>
                {sheetNote}
              </p>
            )}
            <div ref={loupe} className="mvwk-lp" aria-hidden>
              <i />
            </div>
          </div>
          <div className="mvwk-main" style={rise(on, 260, 24)}>
            <div className="mvwk-sel">
              <div ref={pic} className="mvwk-pic">
                {rows.map((r, i) => {
                  const im = RS(imgOr(r), '(max-width: 1099px) 100vw, 55vw');
                  return (
                    <div
                      key={r.slug || i}
                      className={`mvwk-pi${i === a ? ' is-cur' : i === st.p ? ' is-prev' : ''}`}
                    >
                      <img
                        src={im.src}
                        srcSet={im.srcSet}
                        sizes={im.sizes}
                        alt={i === a ? `${r.f1 || ''} — ${r.f2 || ''}` : ''}
                        aria-hidden={i !== a}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  );
                })}
                <span className="mvwk-tag" style={M}>
                  {frameLabel} {pad2(a + 1)}A
                </span>
              </div>
              <div className="mvwk-rail" style={M} aria-hidden>
                <p className="mvwk-cnt">
                  <b key={a}>{pad2(a + 1)}</b>
                  <span>/ {pad2(n)}</span>
                </p>
                <ol className="mvwk-ticks">
                  {rows.map((_r, i) => (
                    <li
                      key={i}
                      className={
                        i === a ? 'is-a' : i < a ? 'is-past' : ''
                      }
                    />
                  ))}
                </ol>
              </div>
            </div>
            {n > 0 && (
              <div ref={info} className="mvwk-info">
                <div className="mvwk-il">
                  <h3
                    className="mvwk-t"
                    style={{ ...D, fontWeight: dfw }}
                  >
                    {cur.f1}
                  </h3>
                  <p className="mvwk-m" style={M}>
                    {[cur.f2, cur.f3, cur.f4]
                      .filter(Boolean)
                      .join('\u00A0· ')}
                    <span className="mv-sr">
                      {' '}
                      — {pad2(a + 1)} of {pad2(n)}
                    </span>
                  </p>
                </div>
                <div className="mvwk-ir">
                  {cur.f8 && (
                    <p className="mvwk-role">
                      <span style={M}>{roleLabel}</span>
                      {cur.f8}
                    </p>
                  )}
                  {cur.f10 && (
                    <p className="mvwk-out" style={M}>
                      {cur.f10}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Btn
                      href={cur.link || `/projects#${cur.slug || ''}`}
                      label={openLabel}
                      kind="quiet"
                      sub={cur.f1}
                    />
                    {cur.figmaLink && (
                      <Btn
                        href={cur.figmaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        label="Figma Prototype"
                        kind="ghost"
                        sub="Prototype"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS_MVWK = `
.mvwk{background:var(--mv-night);color:var(--mv-cloud)}
.mvwk .mv-it{font-weight:inherit}
.mvwk-stick{position:relative;width:100%}
.mvwk.is-desk .mvwk-stick{height:100vh;height:100svh;min-height:680px;max-height:1200px}
.mvwk.is-pin .mvwk-stick{position:sticky;top:0;overflow:hidden;overflow:clip}
.mvwk-grid{height:100%;display:grid;grid-template-columns:minmax(0,38fr) minmax(0,62fr);grid-template-rows:auto minmax(0,1fr);grid-template-areas:"sheet hd" "sheet main";column-gap:clamp(36px,4vw,64px);row-gap:22px;padding-top:clamp(28px,4.4vh,48px);padding-bottom:clamp(28px,4.4vh,48px)}
.mvwk-hd{grid-area:hd;display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.mvwk-hl{display:flex;flex-direction:column;gap:16px}
.mvwk .mv-hd{text-wrap:nowrap}
.mvwk-sheet{grid-area:sheet;position:relative;overflow:hidden;overflow:clip;border-radius:4px;background:var(--mv-bone);color:var(--mv-ink);box-shadow:0 30px 60px -30px rgba(0,0,0,.7);isolation:isolate}
.mvwk-sheet::before{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;background:linear-gradient(180deg,var(--mv-bone) 0,var(--mv-bone) 7%,color-mix(in srgb,var(--mv-bone) 0.4%,transparent) 20%,color-mix(in srgb,var(--mv-bone) 0.4%,transparent) 80%,var(--mv-bone) 93%,var(--mv-bone))}
.mvwk-sl,.mvwk-sn{position:absolute;z-index:4;left:18px;right:18px;margin:0;display:flex;justify-content:space-between;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-ink) 78%,transparent)}
.mvwk-sl{top:16px} .mvwk-sn{bottom:16px}
.mvwk-strip{--sw:min(68%,340px);--lane:clamp(30px,3vw,40px);position:absolute;left:50%;top:50%;width:var(--sw);padding:22px 0;background:${FILM};border-radius:2px;transform:translate3d(-50%,calc(-1 * var(--f0,22px) - var(--fh,160px) / 2 - var(--pos,0) * var(--P,172px)),0);will-change:transform}
.mvwk.is-desk:not(.is-pin) .mvwk-strip{transition:transform .9s cubic-bezier(.7,0,.2,1)}
.mvwk-fr{position:relative;display:grid;grid-template-columns:var(--lane) minmax(0,1fr) var(--lane);align-items:stretch}
.mvwk-fr+.mvwk-fr{margin-top:12px}
.mvwk-th{appearance:none;display:block;position:relative;width:100%;aspect-ratio:3/2;padding:0;margin:0;border:0;border-radius:2px;overflow:hidden;background:#222;cursor:zoom-in}
.mvwk-th img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.6) brightness(.78);transition:filter .6s}
.mvwk-fr.is-a .mvwk-th img,.mvwk-th:hover img{filter:none}
.mvwk-lane{position:relative;display:block}
.mvwk-holes{position:absolute;top:0;bottom:0;display:flex;flex-direction:column;justify-content:space-around;width:8px}
.mvwk-lane.is-l .mvwk-holes{right:22%} .mvwk-lane.is-r .mvwk-holes{left:22%}
.mvwk-holes b{display:block;width:8px;height:10px;border-radius:2px;background:var(--mv-bone)}
.mvwk-lane em{position:absolute;top:50%;font-style:normal;font-size:12px;letter-spacing:.08em;color:${EDGE};white-space:nowrap;writing-mode:vertical-rl;translate:0 -50%;opacity:.9}
.mvwk-lane.is-l em{left:1px;rotate:180deg} .mvwk-lane.is-r em{right:1px}
.mvwk-ring{position:absolute;z-index:2;left:calc(var(--lane) - 18px);right:calc(var(--lane) - 18px);top:-14px;bottom:-14px;width:calc(100% - 2 * var(--lane) + 36px);height:calc(100% + 28px);overflow:visible;pointer-events:none}
.mvwk-ring path{fill:none;stroke:var(--mv-brass);stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;animation:mvwk-draw .75s cubic-bezier(.55,.1,.25,1) .05s forwards;filter:drop-shadow(0 0 1px color-mix(in srgb,var(--mv-brass) 60%,transparent))}
@keyframes mvwk-draw{to{stroke-dashoffset:0}}
.mvwk.is-final .mvwk-ring path{animation:none;stroke-dashoffset:0}
.mvwk-lp{position:absolute;z-index:6;left:0;top:0;width:150px;height:150px;border-radius:50%;overflow:hidden;pointer-events:none;opacity:0;scale:.6;transition:opacity .2s,scale .3s cubic-bezier(.34,1.56,.64,1);background:${FILM};box-shadow:0 0 0 5px color-mix(in srgb,var(--mv-ink) 88%,transparent),0 0 0 6px color-mix(in srgb,var(--mv-cloud) 30%,transparent),0 24px 40px -10px rgba(0,0,0,.6),inset 0 0 18px rgba(0,0,0,.35)}
.mvwk-lp.is-on{opacity:1;scale:1}
.mvwk-lp i{position:absolute;left:0;top:0;background-size:cover;background-position:center}
.mvwk-lp::after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 32% 26%,rgba(255,241,218,.35),transparent 38%)}
.mvwk-main{grid-area:main;display:flex;flex-direction:column;gap:20px;min-height:0}
.mvwk-sel{flex:1;min-height:0;display:flex;gap:clamp(16px,2vw,28px)}
.mvwk-pic{position:relative;height:100%;aspect-ratio:16/10;max-width:calc(100% - 96px);border-radius:4px;overflow:hidden;background:color-mix(in srgb,var(--mv-cloud) 6%,transparent)}
.mvwk-pi{position:absolute;inset:0;visibility:hidden}
.mvwk-pi img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.mvwk-pi.is-prev{visibility:visible;z-index:1}
.mvwk-pi.is-cur{visibility:visible;z-index:2;animation:mvwk-wipe 1s cubic-bezier(.7,0,.2,1) backwards}
.mvwk-pi.is-cur img{animation:mvwk-zoom 1.4s cubic-bezier(.2,.8,.2,1) both}
@keyframes mvwk-wipe{from{clip-path:circle(0px at var(--cx,0px) var(--cy,50%))}to{clip-path:circle(var(--cr,2000px) at var(--cx,0px) var(--cy,50%))}}
@keyframes mvwk-zoom{from{scale:1.14}to{scale:1}}
.mvwk.is-final .mvwk-pi.is-cur,.mvwk.is-final .mvwk-pi.is-cur img{animation:none}
.mvwk-tag{position:absolute;z-index:3;left:12px;top:12px;padding:5px 9px;border-radius:6px;background:color-mix(in srgb,var(--mv-night) 72%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-cloud)}
.mvwk-rail{flex:1;min-width:64px;display:flex;flex-direction:column;justify-content:space-between;padding:2px 0}
.mvwk-cnt{margin:0;display:flex;flex-direction:column;line-height:.9}
.mvwk-cnt b{font-weight:400;font-size:clamp(44px,4.4vw,68px);letter-spacing:-.04em;color:var(--mv-brass);font-variant-numeric:tabular-nums;animation:mvwk-roll .6s cubic-bezier(.2,.8,.2,1)}
.mvwk-cnt span{margin-top:10px;font-size:12px;letter-spacing:.1em;color:var(--mv-mut)}
@keyframes mvwk-roll{from{opacity:0;translate:0 40%}to{opacity:1;translate:0 0}}
.mvwk-ticks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.mvwk-ticks li{width:18px;height:2px;background:color-mix(in srgb,var(--mv-cloud) 22%,transparent);transition:width .5s cubic-bezier(.2,.8,.2,1),background .3s}
.mvwk-ticks li.is-past{background:color-mix(in srgb,var(--mv-cloud) 55%,transparent)} .mvwk-ticks li.is-a{width:40px;background:var(--mv-brass)}
.mvwk-info{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-top:18px;border-top:1px solid color-mix(in srgb,var(--mv-cloud) 14%,transparent)}
.mvwk-info>*{animation:mvwk-in .7s cubic-bezier(.2,.8,.2,1) both} .mvwk-info>*+*{animation-delay:.08s}
@keyframes mvwk-in{from{opacity:0;translate:0 14px}to{opacity:1;translate:0 0}}
.mvwk.is-final .mvwk-info>*{animation:none}
.mvwk-il{display:flex;flex-direction:column;gap:10px;min-width:0}
.mvwk-t{margin:0;font-size:clamp(32px,3vw,46px);line-height:.95;letter-spacing:-.04em;font-stretch:115%}
.mvwk-m{margin:0;text-wrap:balance;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvwk-ir{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:flex-end}
.mvwk-role{margin:0;display:flex;flex-direction:column;gap:4px;font-size:14px;line-height:1.3;max-width:200px} .mvwk-role span{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvwk-out{margin:0;padding:7px 10px;border-radius:6px;background:var(--mv-brass);color:var(--mv-ink);font-size:12px;letter-spacing:.06em;text-transform:uppercase;max-width:240px;line-height:1.35}
.mvwk.is-row{padding:clamp(72px,10vw,110px) 0}
.mvwk.is-row .mvwk-grid{display:flex;flex-direction:column;gap:28px;height:auto;padding-top:0;padding-bottom:0}
.mvwk.is-row .mvwk-hd{order:0;align-items:flex-end;flex-wrap:wrap}
.mvwk.is-row .mvwk-sheet{order:1;background:none;box-shadow:none;overflow:visible;margin:0 calc(var(--pad) * -1)}
.mvwk.is-row .mvwk-sheet::before{display:none}
.mvwk.is-row .mvwk-strip{position:relative;left:auto;top:auto;width:auto;transform:none;will-change:auto;display:flex;padding:0 calc(50% - 110px);border-radius:0;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;cursor:grab;-webkit-overflow-scrolling:touch}
.mvwk.is-row .mvwk-strip::-webkit-scrollbar{display:none} .mvwk.is-row .mvwk-strip.is-drag{cursor:grabbing;scroll-snap-type:none}
.mvwk.is-row .mvwk-fr{flex:none;width:220px;grid-template-columns:1fr;grid-template-rows:30px auto 30px;scroll-snap-align:center;padding:0 5px}
.mvwk.is-row .mvwk-fr+.mvwk-fr{margin-top:0}
.mvwk.is-row .mvwk-lane.is-l{grid-row:1} .mvwk.is-row .mvwk-th{grid-row:2} .mvwk.is-row .mvwk-lane.is-r{grid-row:3}
.mvwk.is-row .mvwk-holes{left:0;right:0;top:auto;width:auto;height:8px;flex-direction:row}
.mvwk.is-row .mvwk-lane.is-l .mvwk-holes{bottom:6px;right:0} .mvwk.is-row .mvwk-lane.is-r .mvwk-holes{top:6px;left:0}
.mvwk.is-row .mvwk-holes b{width:10px;height:8px;opacity:.9}
.mvwk.is-row .mvwk-lane em{writing-mode:horizontal-tb;rotate:0deg;top:auto;translate:none;left:6px;right:auto}
.mvwk.is-row .mvwk-lane.is-l em{top:2px} .mvwk.is-row .mvwk-lane.is-r em{bottom:2px}
.mvwk.is-row .mvwk-strip{background:${FILM}}
.mvwk.is-row .mvwk-ring{left:-6px;right:-6px;top:18px;bottom:18px;width:auto;height:auto}
.mvwk.is-row .mvwk-th{cursor:pointer}
.mvwk.is-row .mvwk-main{order:2;gap:18px}
.mvwk.is-row .mvwk-sel{flex:none;display:block}
.mvwk.is-row .mvwk-pic{height:auto;width:100%;max-width:none}
.mvwk.is-row .mvwk-rail{display:none}
.mvwk.is-row .mvwk-info{flex-direction:column;align-items:flex-start}
.mvwk.is-row .mvwk-ir{justify-content:flex-start}
.mvwk.is-row .mvwk-lp{display:none}
.mvwk.is-ph .mv-hd{text-wrap:balance}
.mvwk.is-ph .mvwk-hd .mv-btn{width:100%}
.mvwk.is-ph .mvwk-hd>div:last-child{width:100%}
.mvwk.is-ph .mvwk-t{font-size:34px}
.mvwk.is-ph .mvwk-role{max-width:none}
@media (prefers-reduced-motion:reduce){.mvwk-ring path{animation:none;stroke-dashoffset:0} .mvwk-pi.is-cur,.mvwk-pi.is-cur img,.mvwk-info>*,.mvwk-cnt b{animation:none}}
`;
