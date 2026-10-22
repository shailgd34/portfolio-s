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
  pick,
  listOf,
  Eyebrow,
  Head,
  Btn,
  Glyph,
  useSite,
  clamp01,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';

// ---- THE BOOKING: the accent band is the studio door. An ON AIR sign hangs on the right and switches ON (flicker, red glow) once the band
// is 40% through the viewport; under it the next start dates arrive as TICKET STUBS that slide in one by one with scroll and tear at the
// perforation as they land. Copy-email button + "Start a project". Hover the sign: it flickers. ----

const IcoArrow = ({ s = 15 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default function MvCta(props = {}) {
  const {
    eyebrow = 'FRAME 10 — Contact',
    heading = "Have a project?|Let's *shoot*.",
    lead = 'Tell me what you are making. I reply within a day with next steps and a rough plan.',
    button = 'Start a project',
    buttonLink = '',
    copyLabel = 'Copy',
    copiedLabel = 'Copied',
    signText = 'ON AIR',
    signTag = 'Studio 1 · Rec',
    bookingLabel = 'Current status',
    availOverride = '',
    datesLabel = 'Next start dates',
    dates = '',
    stubLabel = 'Start',
    ticketNote = 'Admit one project',
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const site = useSite();
  const Dh = {
    ...D,
    fontWeight: props.customFonts
      ? D.fontWeight
      : 'var(--mv-font-dw, 760)',
  };

  const root = useRef(null);
  const tix = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  useMagnet(root, live);
  const on = useOn(root, live, rm, 0.14);
  const anim = live && !rm && !still;
  const book = pick(buttonLink, site.book || '/contact');
  const avail = pick(availOverride, site.avail || 'Available for work — Free after 10 Oct');
  const ds = listOf(dates);

  // scroll: the sign switches on past 40%; the stubs slide in (staggered) and tear at the perforation as they land
  const air = useRef(false);
  const [airOn, setAirOn] = useState(false);
  useScrollVars(root, anim, rm, (sp) => {
    const r = root.current;
    if (!r) return;
    const a = sp > 0.4;
    if (a !== air.current) {
      air.current = a;
      setAirOn(a);
    }
    const ts = tix.current ? tix.current.children : null;
    if (!ts) return;
    for (let i = 0; i < ts.length; i++) {
      const t = clamp01((sp - 0.4 - i * 0.05) / 0.11);
      ts[i].style.setProperty('--t', t.toFixed(3));
      ts[i].style.setProperty(
        '--tr',
        clamp01((t - 0.86) / 0.14).toFixed(3)
      );
    }
  });

  const [copied, setCopied] = useState(false);
  const tm = useRef(0);
  const copy = () => {
    const e = site.email || 'shailashs79@gmail.com';
    const done = () => {
      setCopied(true);
      window.clearTimeout(tm.current);
      tm.current = window.setTimeout(() => setCopied(false), 1800);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(e).then(done, () => {
          window.location.href = `mailto:${e}`;
        });
      else window.location.href = `mailto:${e}`;
    } catch (x) {
      window.location.href = `mailto:${e}`;
    }
  };
  useEffect(() => () => window.clearTimeout(tm.current), []);

  return (
    <section
      ref={root}
      id={props.id || "contact"}
      className={`mv mv-sec mvct${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}${anim ? ' is-anim' : ''}${airOn ? ' is-air' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html:
            CSS_BASE + CSS_MOTION + CSS_CTA + siteFontCss(props),
        }}
      />
      <div className="mv-wrap mvct-grid">
        <div className="mvct-hd">
          <Eyebrow text={eyebrow} on={on} M={M} />
          <Head
            text={heading}
            on={on}
            D={Dh}
            size={
              phone
                ? 'clamp(44px,12vw,60px)'
                : 'clamp(56px,7.4vw,128px)'
            }
            lh={0.9}
            delay={80}
            step={70}
          />
        </div>
        <div className="mvct-sign" style={rise(on, 200, 14)}>
          <span className="mvct-cord" aria-hidden />
          <div
            className="mvct-box"
            role="img"
            aria-label={`${signText} — ${bookingLabel} ${avail}`}
          >
            <i className="mvct-screw" aria-hidden />
            <i className="mvct-screw" aria-hidden />
            <div className="mvct-lamp" aria-hidden>
              <span
                style={{
                  ...Dh,
                  fontWeight: props.customFonts
                    ? D.fontWeight
                    : 800,
                }}
              >
                {signText}
              </span>
            </div>
          </div>
          <p className="mvct-tag" style={M}>
            <i aria-hidden />
            {signTag}
          </p>
        </div>
        <div className="mvct-copy" style={rise(on, 420, 16)}>
          {lead && <p className="mvct-lead">{lead}</p>}
          <div className="mvct-btns">
            {button && (
              <Btn href={book} label={button} kind="solid" />
            )}
            {site.email && (
              <button
                type="button"
                className={`mvct-mail${copied ? ' is-done' : ''}`}
                onClick={copy}
                aria-label={`${copyLabel} ${site.email}`}
                data-mag
              >
                <span className="mvct-mi" aria-hidden>
                  <Glyph k="mail" />
                </span>
                <span className="mvct-ma" style={M}>
                  {site.email}
                </span>
                <span
                  className="mvct-mc"
                  style={M}
                  aria-live="polite"
                >
                  <span>{copyLabel}</span>
                  <span>{copiedLabel}</span>
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="mvct-book" style={rise(on, 520, 16)}>
          {ds.length > 0 ? (
            <>
              {avail && (
                <p className="mvct-avail">
                  <span style={M}>{bookingLabel}</span>
                  <b style={Dh}>{avail}</b>
                </p>
              )}
              <p className="mvct-dl" style={M}>
                {datesLabel}
              </p>
              <ol ref={tix} className="mvct-tix">
                {ds.map((d, i) => (
                  <li key={i} className="mvct-tk">
                    <a
                      href={book}
                      aria-label={`${stubLabel} ${d}`}
                    >
                      <span
                        className="mvct-stub"
                        style={M}
                      >
                        <em>{stubLabel}</em>
                        <b>
                          No.
                          {String(i + 1).padStart(2, '0')}
                        </b>
                      </span>
                      <span className="mvct-body">
                        <b style={Dh}>{d}</b>
                        <em style={M}>{ticketNote}</em>
                        <span
                          className="mvct-ta"
                          aria-hidden
                        >
                          <IcoArrow s={15} />
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <div className="mvct-avail-card">
              <div className="mvct-avail-badge-wrap">
                <span className="mvct-avail-pulse" aria-hidden />
                <span className="mvct-avail-k" style={M}>
                  LIVE STATUS · 2026
                </span>
              </div>
              <h3 className="mvct-avail-title" style={Dh}>
                Free for new projects after 10 Oct
              </h3>
              <p className="mvct-avail-desc">
                Currently open for UI/UX product design, high-density design systems, and full-stack React & Next.js builds.
              </p>
              <div className="mvct-avail-meta" style={M}>
                <div className="mvct-avail-mitem">
                  <em>START DATE</em>
                  <b>After 10 Oct</b>
                </div>
                <div className="mvct-avail-mitem">
                  <em>RESPONSE</em>
                  <b>Within 24 Hours</b>
                </div>
                <div className="mvct-avail-mitem">
                  <em>LOCATION</em>
                  <b>Remote · IST</b>
                </div>
              </div>
              <a href={book} className="mvct-avail-btn" style={M}>
                <span>Book Intro / Send Project Brief</span>
                <span className="mvct-avail-arr" aria-hidden>
                  <IcoArrow s={14} />
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const CSS_CTA = `
.mvct{background:var(--mv-brass);color:var(--mv-ink);padding:clamp(96px,9vw,150px) 0;overflow:clip;--red:#FF3B2F}
.mvct .mv-eb{border-radius:6px;background:color-mix(in srgb,var(--mv-ink) 8%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent)} 
.mvct .mv-eb i{background:var(--mv-ink)}
.mvct .mv-hd{font-stretch:117%;letter-spacing:-.045em}
/* accent word on the accent band = ink text + an ink bar that wipes in, stepped */
.mvct .mv-it{display:inline-block;font-weight:inherit;color:var(--mv-ink)}
.mvct .mv-it::after{content:"";position:absolute;left:.02em;right:.02em;bottom:-.04em;height:.08em;background:var(--mv-ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .72s steps(8,end) var(--pd,600ms)}
.mvct .mv-hd.is-on .mv-it::after{transform:none}
/* buttons on the accent: ink face, white fill, ink selection */
.mvct .mv-btn.mv-solid{--face:var(--mv-ink);--fill:var(--mv-cloud);--fg:var(--mv-cloud);--fg2:var(--mv-ink);--chip:var(--mv-brass);--chipfg:var(--mv-ink);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mvct .mv-selb,.mvct .mv-selb i{box-shadow:0 0 0 1.5px var(--mv-ink)} 
.mvct .mv-dim{background:var(--mv-ink);color:var(--mv-cloud)}
.mvct-grid{display:grid;grid-template-columns:minmax(0,1fr) clamp(300px,24vw,380px);grid-template-areas:"hd sign" "copy book";column-gap:clamp(40px,5vw,96px);row-gap:clamp(40px,4vw,64px)}
.mvct-hd{grid-area:hd;display:flex;flex-direction:column;gap:28px;align-self:end}
.mvct-copy{grid-area:copy;display:flex;flex-direction:column;gap:28px;align-self:start}
.mvct-lead{margin:0;max-width:40ch;font-size:18px;line-height:1.5}
.mvct-btns{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
/* copy-email button */
.mvct-mail{appearance:none;border:0;font:inherit;color:var(--mv-ink);display:inline-flex;align-items:center;gap:12px;min-height:54px;padding:0 8px 0 16px;border-radius:10px;background:transparent;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 32%,transparent);cursor:pointer;transition:background .3s,transform .45s cubic-bezier(.34,1.56,.64,1)}
.mvct-mail:hover{background:color-mix(in srgb,var(--mv-cloud) 30%,transparent);transform:translate(var(--mx,0px),var(--my,0px))}
.mvct-mi{display:grid;place-items:center;width:18px;height:18px} 
.mvct-mi svg{width:18px;height:18px}
.mvct-ma{font-size:14px;letter-spacing:.01em}
.mvct-mc{display:grid;height:38px;min-width:76px;padding:0 12px;border-radius:6px;background:var(--mv-ink);color:var(--mv-cloud);font-size:12px;letter-spacing:.1em;text-transform:uppercase;overflow:hidden}
.mvct-mc>span{grid-area:1/1;display:grid;place-items:center;transition:translate .45s cubic-bezier(.7,0,.2,1)} 
.mvct-mc>span:last-child{translate:0 110%}
.mvct-mail.is-done .mvct-mc>span:first-child{translate:0 -110%} 
.mvct-mail.is-done .mvct-mc>span:last-child{translate:0 0}
/* the ON AIR sign */
.mvct-sign{grid-area:sign;position:relative;align-self:end;display:flex;flex-direction:column;align-items:stretch;gap:12px;padding-top:44px}
.mvct-cord{position:absolute;top:-40px;left:50%;width:2px;height:88px;background:var(--mv-ink);opacity:.75}
.mvct-box{position:relative;padding:12px;border-radius:12px;background:var(--mv-ink);box-shadow:0 30px 50px -26px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.08)}
.mvct-screw{position:absolute;top:5px;width:4px;height:4px;border-radius:50%;background:color-mix(in srgb,var(--mv-cloud) 30%,transparent)} 
.mvct-screw:first-child{left:6px} 
.mvct-screw:nth-child(2){right:6px}
.mvct-lamp{position:relative;display:grid;place-items:center;height:clamp(96px,8vw,124px);border-radius:6px;background:#2A0E0C;overflow:hidden;transition:background .2s,box-shadow .3s}
.mvct-lamp::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.1),transparent 45%);pointer-events:none}
.mvct-lamp span{position:relative;font-size:clamp(46px,4.2vw,66px);line-height:1;letter-spacing:-.02em;font-stretch:118%;color:#A84A40;transition:color .2s}
/* switched ON: before JS (SSR / still / reduced motion) the sign is lit; the live band starts dark and lights past 40% */
.mvct .mvct-lamp{background:#E0231B;box-shadow:0 0 0 1px rgba(255,120,100,.4),0 0 60px 6px rgba(255,59,47,.45)} 
.mvct .mvct-lamp span{color:#FFF1EC}
.mvct.is-anim .mvct-lamp{background:#2A0E0C;box-shadow:none} 
.mvct.is-anim .mvct-lamp span{color:#A84A40}
.mvct.is-anim.is-air .mvct-lamp{background:#E0231B;box-shadow:0 0 0 1px rgba(255,120,100,.4),0 0 60px 6px rgba(255,59,47,.45);animation:mvct-flk .9s steps(1,end)} 
.mvct.is-anim.is-air .mvct-lamp span{color:#FFF1EC}
.mvct.is-anim.is-air .mvct-sign:hover .mvct-lamp,.mvct:not(.is-anim) .mvct-sign:hover .mvct-lamp{animation:mvct-flk2 .7s steps(1,end)}
@keyframes mvct-flk{0%{opacity:.25}8%{opacity:1}14%{opacity:.35}22%{opacity:1}30%{opacity:.6}38%,100%{opacity:1}}
@keyframes mvct-flk2{0%{opacity:1}12%{opacity:.45}20%{opacity:1}34%{opacity:.7}42%,100%{opacity:1}}
.mvct-tag{display:flex;align-items:center;gap:8px;margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.mvct-tag i{width:7px;height:7px;border-radius:50%;background:#54201B;transition:background .2s,box-shadow .2s} 
.mvct:not(.is-anim) .mvct-tag i,.mvct.is-air .mvct-tag i{background:var(--red);box-shadow:0 0 8px 2px rgba(255,59,47,.6)}
/* booking + ticket stubs */
.mvct-book{grid-area:book;display:flex;flex-direction:column;gap:14px;align-self:start}
.mvct-avail{display:flex;flex-direction:column;gap:6px;margin:0 0 10px} 
.mvct-avail span{font-size:12px;letter-spacing:.12em;text-transform:uppercase} 
.mvct-avail b{font-size:clamp(20px,1.7vw,26px);line-height:1.1;letter-spacing:-.025em;font-stretch:110%}
.mvct-dl{margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.8}
.mvct-tix{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.mvct-tk{--t:1;--tr:1} 
.mvct.is-anim .mvct-tk{--t:0;--tr:0}
/* keyboard: a focused stub lands at once */
.mvct-tk:focus-within{--t:1!important;--tr:1!important}
.mvct-tk a{position:relative;display:grid;grid-template-columns:78px minmax(0,1fr);text-decoration:none;color:var(--mv-ink);opacity:clamp(0,calc((var(--t) - .12)*100),1);transform:translateY(calc((1 - var(--t))*36px)) rotate(calc((1 - var(--t))*3deg));transform-origin:0 100%;filter:drop-shadow(0 10px 14px rgba(0,0,0,.14))}
.mvct-stub,.mvct-body{position:relative;background:var(--mv-bone);min-height:64px}
.mvct-stub{display:flex;flex-direction:column;justify-content:center;gap:3px;padding:0 12px;border-radius:6px 0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;transform:translate(calc(var(--tr)*-7px),calc(var(--tr)*2px)) rotate(calc(var(--tr)*-4deg));transform-origin:100% 100%;transition:transform .35s cubic-bezier(.34,1.56,.64,1);-webkit-mask:radial-gradient(circle 6px at 100% 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 6px at 100% 100%,transparent 98%,#000) bottom/100% 51% no-repeat;mask:radial-gradient(circle 6px at 100% 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 6px at 100% 100%,transparent 98%,#000) bottom/100% 51% no-repeat}
.mvct-stub em{font-style:normal;opacity:.8} 
.mvct-stub b{font-weight:500;font-size:12px}
.mvct-body{display:flex;align-items:center;gap:14px;padding:0 10px 0 18px;border-radius:0 6px 6px 0;-webkit-mask:radial-gradient(circle 6px at 0 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 6px at 0 100%,transparent 98%,#000) bottom/100% 51% no-repeat;mask:radial-gradient(circle 6px at 0 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 6px at 0 100%,transparent 98%,#000) bottom/100% 51% no-repeat}
.mvct-body{background-color:var(--mv-bone);background-image:repeating-linear-gradient(180deg,color-mix(in srgb,var(--mv-ink) 40%,transparent) 0 3px,transparent 3px 7px);background-size:1.5px 100%;background-repeat:no-repeat;background-position:0 0}
.mvct-body b{font-size:clamp(24px,2vw,30px);line-height:1;letter-spacing:-.03em;font-stretch:112%;white-space:nowrap}
.mvct-body em{flex:1;min-width:0;font-style:normal;font-size:12px;line-height:1.25;letter-spacing:.1em;text-transform:uppercase;opacity:.8;text-align:right;white-space:normal;overflow-wrap:normal} 
.mvct.is-ph .mvct-body em{display:none}
.mvct-ta{display:grid;place-items:center;width:36px;height:36px;flex:none;border-radius:6px;background:var(--mv-ink);color:var(--mv-brass);transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
.mvct-tk a:hover .mvct-body,.mvct-tk a:focus-visible .mvct-body{background-color:var(--mv-cloud)} 
.mvct-tk a:hover .mvct-stub,.mvct-tk a:focus-visible .mvct-stub{background:var(--mv-cloud)}
.mvct-tk a:hover .mvct-ta,.mvct-tk a:focus-visible .mvct-ta{transform:rotate(-45deg)}

/* modern availability card (active status) */
.mvct-avail-card{position:relative;display:flex;flex-direction:column;gap:14px;padding:22px 20px;border-radius:12px;background:var(--mv-ink);color:var(--mv-cloud);box-shadow:0 24px 44px -16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.1)}
.mvct-avail-badge-wrap{display:inline-flex;align-items:center;gap:8px}
.mvct-avail-pulse{width:8px;height:8px;border-radius:50%;background:#3DDC84;box-shadow:0 0 10px 2px rgba(61,220,132,.7);animation:mvct-beacon 2s ease-in-out infinite}
@keyframes mvct-beacon{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.85)}}
.mvct-avail-k{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,240,232,.65)}
.mvct-avail-title{margin:0;font-size:clamp(20px,1.8vw,26px);line-height:1.18;letter-spacing:-.03em;color:#fff}
.mvct-avail-desc{margin:0;font-size:13.5px;line-height:1.5;color:rgba(245,240,232,.75)}
.mvct-avail-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:12px 0;border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12)}
.mvct-avail-mitem{display:flex;flex-direction:column;gap:3px}
.mvct-avail-mitem em{font-style:normal;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:rgba(245,240,232,.5)}
.mvct-avail-mitem b{font-weight:600;font-size:11.5px;color:var(--mv-brass);white-space:nowrap}
.mvct-avail-btn{display:inline-flex;align-items:center;justify-content:space-between;gap:14px;min-height:50px;padding:0 8px 0 18px;border-radius:10px;background:var(--mv-brass);color:var(--mv-ink);text-decoration:none;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;transition:transform .25s ease,filter .25s ease}
.mvct-avail-btn:hover{transform:translateY(-2px);filter:brightness(1.08)}
.mvct-avail-arr{display:grid;place-items:center;width:34px;height:34px;flex:none;border-radius:6px;background:#141210;color:var(--mv-brass);transition:transform .35s ease}
.mvct-avail-btn:hover .mvct-avail-arr{transform:rotate(-45deg)}
.mvct.is-ph .mvct-avail-meta{grid-template-columns:1fr;gap:8px}

/* tablet + phone: stacked */
.mvct.is-tab .mvct-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:"hd hd" "copy copy" "sign book"} 
.mvct.is-ph .mvct-grid{grid-template-columns:minmax(0,1fr);grid-template-areas:"hd" "copy" "sign" "book"}
.mvct.is-tab .mvct-sign,.mvct.is-ph .mvct-sign{max-width:360px;padding-top:0} 
.mvct.is-tab .mvct-cord,.mvct.is-ph .mvct-cord{display:none}
.mvct.is-tab .mvct-sign{align-self:start}
.mvct.is-ph{padding:80px 0}
.mvct.is-ph .mvct-btns{flex-direction:column;align-items:stretch} 
.mvct.is-ph .mvct-btns .mv-btn,.mvct.is-ph .mvct-mail{width:100%} 
.mvct.is-ph .mvct-ma{flex:1;min-width:0;text-align:left;font-size:12px;letter-spacing:0;overflow-wrap:anywhere} 
.mvct.is-ph .mvct-mi{display:none} 
.mvct.is-ph .mvct-mail{gap:8px}
.mvct.is-ph .mvct-lead{font-size:17px}
@media (prefers-reduced-motion:reduce){.mvct .mv-it::after{transform:none!important}}
`;
