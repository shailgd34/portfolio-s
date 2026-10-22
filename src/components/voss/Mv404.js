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
  useMagnet,
  useStage,
  useScrollVars,
  rise,
  Head,
  Btn,
  imgOr,
  RS,
  onTick,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultProjects } from './siteData';

// ---- 404 — MISSING FRAME: a 35mm strip runs across a dark studio; frames 401…407 are the Projects, but 404 is BLANK — the film burnt in the
// gate (a ragged burn hole spreads from the middle with a glowing edge). The room is dark: the pointer is the studio key light and reveals the
// strip where it falls (idle / touch: it drifts around the burnt frame). Scroll slides the strip sideways. Still / reduced motion = burnt, lit. ----

const MV4_FILM = '#0E0D0C';
const MV4_EDGE = '#F2923A';

export default function Mv404(props = {}) {
  const {
    code = 'ROLL 04 · FRAME 404 · NOT FOUND',
    note = 'Lab note: burnt in the gate',
    title = 'Missing *frame*.',
    lead = 'This page was cut in the edit, or it never made it onto the roll. Everything else on the reel is still here.',
    primary = 'Back home',
    primaryLink = '/',
    secondary = 'See my work',
    secondaryLink = '/#work',
    burnLabel = '404',
    firstFrame = 401,
    filmEdge = 'MV 400TX',
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const Dh = {
    ...D,
    fontWeight: props.customFonts
      ? D.fontWeight
      : 'var(--mv-font-dw, 720)',
    fontStretch: '115%',
  };

  const root = useRef(null);
  const burnt = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  useMagnet(root, live);
  const ready = useStage(live);
  const [in0, setIn] = useState(false);

  useEffect(() => {
    if (!live || !ready) return;
    const t = window.setTimeout(() => setIn(true), 60);
    return () => window.clearTimeout(t);
  }, [live, ready]);

  const inn = in0 || still || rm;
  const anim = live && !rm && !still;
  useScrollVars(root, live, rm);
  const projects = props.projects || defaultProjects;
  const N = 7,
    MID = 3;
  const f0 = Math.round(Number(firstFrame) || 401);

  // the key light: pointer (lerped) or an idle orbit around the burnt frame
  useEffect(() => {
    if (!anim || !root.current) return;
    const r = root.current;
    const fine = window.matchMedia(
      '(hover:hover) and (pointer:fine)'
    ).matches;
    let W = 1,
      H = 1,
      cx = 0,
      cy = 0;
    const measure = () => {
      const a = r.getBoundingClientRect();
      W = a.width;
      H = a.height;
      const b = burnt.current?.getBoundingClientRect();
      if (b) {
        cx = b.left - a.left + b.width / 2;
        cy = b.top - a.top + b.height / 2;
      } else {
        cx = W / 2;
        cy = H / 2;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(r);
    const t1 = window.setTimeout(measure, 800);
    const onS = () => measure();
    window.addEventListener('scroll', onS, { passive: true });
    let tx = cx,
      ty = cy,
      x = cx,
      y = cy,
      last = -1e9,
      lk = '';
    const mv = (e) => {
      const a = r.getBoundingClientRect();
      tx = e.clientX - a.left;
      ty = e.clientY - a.top;
      last = performance.now();
    };
    r.addEventListener('pointermove', mv);
    const t0 = performance.now();
    const off = onTick(() => {
      const now = performance.now(),
        ts = (now - t0) / 1000;
      const idle = !fine || now - last > 2400;
      if (idle) {
        tx = cx + Math.cos(ts * 0.5) * Math.min(W * 0.28, 360);
        ty = cy + Math.sin(ts * 0.8) * Math.min(H * 0.08, 60);
      }
      const k = idle ? 0.035 : 0.14;
      x += (tx - x) * k;
      y += (ty - y) * k;
      const key = `${x.toFixed(0)}|${y.toFixed(0)}`;
      if (key === lk) return;
      lk = key;
      r.style.setProperty('--lx', `${x.toFixed(1)}px`);
      r.style.setProperty('--ly', `${y.toFixed(1)}px`);
    });
    return () => {
      off();
      ro.disconnect();
      window.clearTimeout(t1);
      window.removeEventListener('scroll', onS);
      r.removeEventListener('pointermove', mv);
    };
  }, [anim, phone]);

  const holes = (n) => (
    <i className="mv4-holes" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <b key={i} />
      ))}
    </i>
  );

  return (
    <section
      ref={root}
      className={`mv mv-sec mv-dark mv4${phone ? ' is-ph' : tab ? ' is-tab' : ''}${inn ? ' is-in' : ''}${anim ? ' is-anim' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html:
            CSS_BASE + CSS_MOTION + CSS_MV4 + siteFontCss(props),
        }}
      />
      <div className="mv4-band" aria-hidden>
        <div className="mv4-strip">
          {Array.from({ length: N }, (_, i) => {
            const n = f0 + i;
            const r = projects.length
              ? projects[(i + (i > MID ? -1 : 0)) % projects.length]
              : undefined;
            const isB = i === MID;
            const im = r
              ? RS(imgOr(r), phone ? '200px' : '320px')
              : null;
            return (
              <div
                key={i}
                ref={isB ? burnt : undefined}
                className={`mv4-fr${isB ? ' is-burnt' : ''}`}
              >
                {holes(phone ? 4 : 5)}
                <div className="mv4-pic">
                  {isB ? (
                    <>
                      <svg
                        className="mv4-burn"
                        viewBox="0 0 200 150"
                        preserveAspectRatio="xMidYMid slice"
                      >
                        <defs>
                          <filter
                            id="mv4-rag"
                            x="-30%"
                            y="-30%"
                            width="160%"
                            height="160%"
                          >
                            <feTurbulence
                              type="fractalNoise"
                              baseFrequency=".055"
                              numOctaves="3"
                              seed="7"
                            />
                            <feDisplacementMap
                              in="SourceGraphic"
                              scale="22"
                            />
                          </filter>
                          <radialGradient id="mv4-sc">
                            <stop
                              offset="0"
                              stopColor="#3A1805"
                              stopOpacity=".95"
                            />
                            <stop
                              offset=".7"
                              stopColor="#8A4312"
                              stopOpacity=".55"
                            />
                            <stop
                              offset="1"
                              stopColor="#C9772E"
                              stopOpacity="0"
                            />
                          </radialGradient>
                        </defs>
                        <g filter="url(#mv4-rag)">
                          <g className="mv4-bg">
                            <circle
                              cx="100"
                              cy="75"
                              r="72"
                              fill="url(#mv4-sc)"
                            />
                            <circle
                              className="mv4-ring"
                              cx="100"
                              cy="75"
                              r="50"
                              fill="#FF8A2A"
                            />
                            <circle
                              cx="100"
                              cy="75"
                              r="44"
                              fill="#FFD9A0"
                              className="mv4-hot"
                            />
                            <circle
                              cx="100"
                              cy="75"
                              r="40"
                              fill={MV4_FILM}
                            />
                          </g>
                        </g>
                      </svg>
                      <b className="mv4-big" style={Dh}>
                        {burnLabel}
                      </b>
                    </>
                  ) : im ? (
                    <img
                      src={im.src}
                      srcSet={im.srcSet}
                      sizes={im.sizes}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  ) : null}
                </div>
                {holes(phone ? 4 : 5)}
                <em style={M}>
                  {filmEdge} · {n}
                </em>
              </div>
            );
          })}
        </div>
      </div>
      <i className="mv4-veil" aria-hidden />
      <i className="mv4-glow" aria-hidden />
      <div className="mv-wrap mv4-in">
        <div
          className="mv4-top"
          style={{ ...M, ...rise(inn, 100, -8) }}
        >
          <span>
            <i className="mv4-rec" aria-hidden />
            {code}
          </span>
          <span className="mv4-note">{note}</span>
        </div>
        <div className="mv4-bot">
          <Head
            text={title}
            on={inn}
            D={Dh}
            tag="h1"
            size={
              phone
                ? 'clamp(48px,14vw,68px)'
                : 'clamp(64px,8vw,132px)'
            }
            lh={0.9}
            delay={200}
            className="mv4-t"
          />
          <div className="mv4-say" style={rise(inn, 600, 14)}>
            {lead && <p className="mv4-lead">{lead}</p>}
            <div className="mv4-btns">
              {primary && (
                <Btn
                  href={primaryLink || '/'}
                  label={primary}
                  kind="solid"
                />
              )}
              {secondary && (
                <Btn
                  href={secondaryLink || '/#work'}
                  label={secondary}
                  kind="ghost"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS_MV4 = `
.mv4{position:relative;height:100vh;height:100svh;min-height:640px;background:var(--mv-night);color:var(--mv-cloud);overflow:hidden;overflow:clip;isolation:isolate;--lx:50%;--ly:48%}
.mv4 .mv-it{color:var(--mv-brass);font-weight:inherit}
.mv4 .mv-hd{letter-spacing:-.05em}
/* the strip */
.mv4-band{position:absolute;z-index:1;left:0;right:0;top:44%;translate:0 -50%;display:flex;justify-content:center;rotate:-2.5deg}
.mv4-strip{display:flex;flex:none;padding:0 12px;background:${MV4_FILM};box-shadow:0 40px 80px -30px rgba(0,0,0,.8);translate:calc((var(--sp,.5) - .5)*-220px) 0}
.mv4-fr{position:relative;display:flex;flex-direction:column;width:clamp(230px,21vw,320px);padding:0 8px}
.mv4-holes{display:flex;justify-content:space-around;align-items:center;height:30px} 
.mv4-holes b{width:14px;height:10px;border-radius:2px;background:color-mix(in srgb,var(--mv-cloud) 78%,var(--mv-night))}
.mv4-pic{position:relative;aspect-ratio:4/3;border-radius:3px;overflow:hidden;background:#1a1a1a}
.mv4-pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.75) contrast(1.05)}
.mv4-fr em{position:absolute;left:14px;bottom:1px;font-style:normal;font-size:12px;line-height:1;letter-spacing:.14em;color:${MV4_EDGE};opacity:.9;white-space:nowrap}
/* frame 404: overexposed blank with a burn hole */
.mv4-fr.is-burnt .mv4-pic{background:radial-gradient(120% 90% at 50% 50%,#FFF6E6,#F6E3C4 60%,#E7C895)}
.mv4-burn{position:absolute;inset:-10%;width:120%;height:120%;overflow:visible}
.mv4-bg{transform-box:fill-box;transform-origin:center;scale:.12;transition:scale 3.6s cubic-bezier(.16,.8,.3,1) .5s}
.mv4.is-in .mv4-bg{scale:1}
.mv4-ring{animation:mv4-fl 1.4s steps(3) infinite} 
.mv4-hot{animation:mv4-fl 1.1s steps(2) infinite reverse}
@keyframes mv4-fl{0%,100%{opacity:1}50%{opacity:.72}}
.mv4:not(.is-anim) .mv4-ring,.mv4:not(.is-anim) .mv4-hot{animation:none}
.mv4-big{position:absolute;left:10px;top:6px;font-size:clamp(22px,2vw,30px);letter-spacing:-.03em;color:#3A1805}
.mv4-fr.is-burnt::after{content:"";position:absolute;inset:-30px;pointer-events:none;background:radial-gradient(closest-side,rgba(255,170,90,.35),transparent);mix-blend-mode:screen;animation:mv4-fl 2.2s ease-in-out infinite}
/* the dark room + the key light (pointer) */
.mv4-veil{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(circle min(34vw,380px) at var(--lx) var(--ly),transparent 0,color-mix(in srgb,var(--mv-night) 30%,transparent) 42%,color-mix(in srgb,var(--mv-night) 90%,transparent) 100%)}
.mv4-glow{position:absolute;inset:0;z-index:2;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(circle min(20vw,240px) at var(--lx) var(--ly),rgba(255,241,218,.22),rgba(255,226,180,.06) 55%,transparent 75%)}
.mv4:not(.is-anim) .mv4-veil{background:radial-gradient(ellipse 60% 45% at 50% 44%,transparent 0,color-mix(in srgb,var(--mv-night) 30%,transparent) 50%,color-mix(in srgb,var(--mv-night) 88%,transparent) 100%)}
.mv4:not(.is-anim) .mv4-glow{background:radial-gradient(ellipse 30% 25% at 50% 44%,rgba(255,241,218,.16),transparent 75%)}
/* words */
.mv4-in{position:relative;z-index:3;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding-top:clamp(96px,13vh,128px);padding-bottom:clamp(32px,5vh,56px);pointer-events:none} 
.mv4-in a,.mv4-in button{pointer-events:auto}
.mv4-top{display:flex;justify-content:space-between;gap:20px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mv4-top>span{display:inline-flex;align-items:center;gap:10px}
.mv4-rec{width:8px;height:8px;border-radius:50%;background:#FF4D3D;box-shadow:0 0 10px 2px rgba(255,77,61,.6);animation:mv4-fl 1.6s steps(2) infinite}
.mv4-bot{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);align-items:end;gap:clamp(28px,5vw,80px)}
.mv4-say{display:flex;flex-direction:column;gap:22px;padding-bottom:10px}
.mv4-lead{margin:0;max-width:42ch;font-size:17px;line-height:1.55;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mv4-btns{display:flex;flex-wrap:wrap;gap:12px}
/* tablet + phone */
.mv4.is-tab .mv4-bot{grid-template-columns:minmax(0,1fr);gap:24px} 
.mv4.is-tab .mv4-band{top:40%}
.mv4.is-ph{height:auto;min-height:100svh}
.mv4.is-ph .mv4-in{min-height:100svh;padding-top:96px;padding-bottom:32px;gap:0}
.mv4.is-ph .mv4-top{flex-direction:column;gap:8px;font-size:12px} 
.mv4.is-ph .mv4-note{display:none}
.mv4.is-ph .mv4-band{top:34%} 
.mv4.is-ph .mv4-fr{width:168px;padding:0 6px} 
.mv4.is-ph .mv4-holes{height:22px} 
.mv4.is-ph .mv4-holes b{width:10px;height:7px} 
.mv4.is-ph .mv4-fr em{font-size:12px;bottom:0}
.mv4.is-ph .mv4-bot{grid-template-columns:minmax(0,1fr);gap:20px;margin-top:clamp(240px,62vw,300px)}
.mv4.is-ph .mv4-lead{font-size:16px}
.mv4.is-ph .mv4-btns{flex-direction:column;align-items:stretch} 
.mv4.is-ph .mv4-btns .mv-btn{width:100%}
@media (prefers-reduced-motion:reduce){
  .mv4-strip{translate:none!important} 
  .mv4-bg{scale:1!important;transition:none!important} 
  .mv4-ring,.mv4-hot,.mv4-rec,.mv4-fr.is-burnt::after{animation:none!important}
}
`;
