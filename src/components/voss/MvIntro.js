'use client';

import { useRef } from 'react';
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
  pick,
  srcOf,
  RS,
  Btn,
  Eyebrow,
  Head,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { siteData } from './siteData';

// THE DARKROOM: an about block beside a developing tray.
// The print starts as a NEGATIVE under the red safelight and develops into the
// positive as the section scrolls through (--dev from --sp).
const MVIN_PHOTO =
  'https://framerusercontent.com/images/R2fb4UeMhFZlfe2DqK1ITMlyrU.webp';

export default function MvIntro(props = {}) {
  const site = siteData;
  const {
    eyebrow = 'FRAME 01 — About',
    statement = '',
    facts = '',
    aboutLabel = 'More about me',
    aboutLink = '/about',
    resumeLabel = 'View résumé',
    resumeLink = '/resume',
    photo,
    photoAlt = '',
    caption = 'Print 01 · f/8 · 12s',
    devLabel = 'developing',
    doneLabel = 'fixed',
    lampLabel = 'Safelight',
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();

  const root = useRef(null);
  const pct = useRef(null);
  const word = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm);
  useMagnet(root, live);
  const final = still || rm || !live;
  const last = useRef(-1);

  useScrollVars(root, live, rm, (sp) => {
    const dev = clamp01((sp - 0.16) / 0.4);
    const el = root.current;
    if (!el) return;
    el.style.setProperty('--dev', dev.toFixed(4));
    const p = Math.round(dev * 100);
    if (p !== last.current) {
      last.current = p;
      if (pct.current) pct.current.textContent = `${p}%`;
      if (word.current)
        word.current.textContent = p >= 100 ? doneLabel : devLabel;
    }
  });

  const src = srcOf(photo, '/workspace_mockup.jpg' || MVIN_PHOTO);
  const im = RS(src, '(max-width: 809px) 100vw, 40vw');
  const defaultFacts = `${site.years || '6+'} years Experience;50+ products launched;${site.city || 'Indore'}, working worldwide`;
  const list = listOf(facts || defaultFacts);
  const text = pick(
    statement,
    `I'm ${site.name.split(' ')[0]}. For over six years I've turned complex challenges into digital products people *actually use* — designed in Figma, engineered in Next.js, shipped on time.`
  );
  const resume = pick(resumeLink, site.resume || '/shailash 2026.pdf');
  const dfw = props.customFonts ? D.fontWeight : 'var(--mv-font-dw, 700)';

  return (
    <section
      ref={root}
      id="about"
      className={`mv mv-sec mvin${phone ? ' is-ph' : tab ? ' is-tab' : ''}${final ? ' is-final' : ''}${on ? ' is-on' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        '--dev': final ? 1 : 0,
        ...(props.style || {}),
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_MVIN + siteFontCss(props),
        }}
      />
      <div className="mv-wrap mvin-grid">
        <div className="mvin-copy">
          <Eyebrow text={eyebrow} on={on} M={M} />
          <Head
            text={text}
            on={on}
            D={D}
            size="clamp(28px,2.8vw,44px)"
            lh={1.1}
            step={16}
            delay={120}
            className="mvin-st"
            style={{ fontWeight: dfw }}
          />
          {list.length > 0 && (
            <ul className="mvin-facts" style={M}>
              {list.map((f, i) => (
                <li key={i} style={rise(on, 700 + i * 90, 14)}>
                  <span className="mvin-fi" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          )}
          <div className="mvin-btns" style={rise(on, 980, 14)}>
            {aboutLabel && (
              <Btn
                href={aboutLink || '/about'}
                label={aboutLabel}
                kind="ghost"
              />
            )}
            {resumeLabel && (
              <Btn
                href={resume}
                label={resumeLabel}
                kind="quiet"
                arrow={false}
              />
            )}
          </div>
        </div>
        <figure className="mvin-fig" style={rise(on, 200, 30)}>
          <div className="mvin-tray">
            <span className="mvin-lamp" style={M}>
              <i aria-hidden />
              {lampLabel}
            </span>
            <div className="mvin-bath" aria-hidden>
              <i className="mvin-sheen" />
            </div>
            <div className="mvin-print">
              <div className="mvin-img">
                <img
                  className="mvin-neg"
                  src={im.src}
                  srcSet={im.srcSet}
                  sizes={im.sizes}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <img
                  className="mvin-pos"
                  src={im.src}
                  srcSet={im.srcSet}
                  sizes={im.sizes}
                  alt={photoAlt || `${site.name} at work`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <i className="mvin-safe" aria-hidden />
                <i className="mvin-wave" aria-hidden />
                <i className="mvin-glint" aria-hidden />
              </div>
            </div>
            <i className="mvin-glow" aria-hidden />
          </div>
          <figcaption className="mvin-cap" style={M}>
            <span>{caption}</span>
            <span className="mvin-st2">
              <span ref={word}>{final ? doneLabel : devLabel}</span>{' '}
              <b ref={pct}>{final ? '100%' : '0%'}</b>
            </span>
            <i className="mvin-bar" aria-hidden />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

const CSS_MVIN = `
.mvin{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(96px,10vw,168px) 0;--dev:0}
.mvin-grid{display:grid;grid-template-columns:minmax(0,1.18fr) minmax(0,.82fr);gap:clamp(40px,6vw,120px);align-items:center}
.mvin-copy{display:flex;flex-direction:column;align-items:flex-start;gap:30px}
.mvin .mv-hd.mvin-st{letter-spacing:-.03em;font-stretch:112%;text-wrap:pretty;max-width:22em}
.mvin .mv-it{position:relative;z-index:0;color:var(--mv-ink);font-weight:inherit;padding:0 .06em;margin:0 -.06em}
.mvin .mv-it::before{content:"";position:absolute;z-index:-1;inset:.06em 0 .02em;background:var(--mv-brass);clip-path:inset(0 100% 0 0);transition:clip-path .7s steps(8,end) var(--pd,600ms)}
.mvin .mv-hd.is-on .mv-it::before{clip-path:inset(0 0 0 0)}
.mvin .mv-hd-w.is-accw{padding-left:.08em;padding-right:.08em;margin-left:-.08em;margin-right:-.08em} .mvin .mv-hd-w.is-accw:has(+ .mv-hd-w.is-accw){padding-right:.34em;margin-right:-.34em} .mvin .mv-hd-w.is-accw:has(+ .mv-hd-w.is-accw) .mv-it::before{right:-.3em}
.mvin-facts{list-style:none;margin:6px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;width:100%;max-width:640px;border-top:1px solid var(--mv-fog)}
.mvin-facts li{display:flex;flex-direction:column;gap:10px;padding:16px 16px 0 0;font-size:12px;line-height:1.45;letter-spacing:.1em;text-transform:uppercase}
.mvin-facts li+li{padding-left:16px;border-left:1px solid var(--mv-fog)}
.mvin-fi{color:var(--mv-mut);font-size:12px}
.mvin-btns{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:8px}
.mvin-fig{margin:0;display:flex;flex-direction:column;gap:14px;width:100%;max-width:560px;justify-self:end}
.mvin-tray{position:relative;padding:9% 9% 11%;border-radius:10px;background:linear-gradient(180deg,color-mix(in srgb,var(--mv-ink) 86%,var(--mv-bone)),var(--mv-ink) 70%);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 10%,transparent),inset 0 18px 30px -18px color-mix(in srgb,var(--mv-cloud) 22%,transparent),0 40px 60px -30px color-mix(in srgb,var(--mv-ink) 55%,transparent);isolation:isolate;overflow:hidden}
.mvin-bath{position:absolute;inset:5.5%;border-radius:6px;background:radial-gradient(120% 90% at 50% 20%,color-mix(in srgb,var(--mv-ink) 70%,var(--mv-stone)),var(--mv-ink));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 8%,transparent),inset 0 10px 24px rgba(0,0,0,.5);overflow:hidden}
.mvin-sheen{position:absolute;inset:-30%;background:repeating-linear-gradient(172deg,transparent 0 22px,rgba(255,255,255,.035) 22px 24px,transparent 24px 46px);animation:mvin-ripple 9s linear infinite}
@keyframes mvin-ripple{to{transform:translate3d(0,46px,0)}}
.mvin-print{position:relative;z-index:1;padding:3.4%;background:var(--mv-cloud);border-radius:4px;rotate:-1.4deg;box-shadow:0 1px 0 rgba(0,0,0,.3),0 18px 30px -16px rgba(0,0,0,.6)}
.mvin-img{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:2px;background:var(--mv-ink)}
.mvin-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%;display:block;user-select:none}
.mvin-neg{filter:invert(1) grayscale(.4) contrast(1.15) brightness(.95);opacity:calc(1 - var(--dev) * .9)}
.mvin-pos{--L:calc(var(--dev) * 130% - 15%);-webkit-mask:linear-gradient(180deg,#000 calc(var(--L) - 16%),transparent var(--L));mask:linear-gradient(180deg,#000 calc(var(--L) - 16%),transparent var(--L));filter:grayscale(calc(1 - var(--dev))) contrast(calc(.72 + var(--dev) * .3)) brightness(calc(.72 + var(--dev) * .3)) sepia(calc((1 - var(--dev)) * .5))}
.mvin-safe{position:absolute;inset:0;background:#E3261B;mix-blend-mode:multiply;opacity:calc((1 - var(--dev)) * .62);pointer-events:none}
.mvin-wave{position:absolute;left:-4%;right:-4%;top:calc(var(--dev) * 130% - 17%);height:64px;translate:0 -50%;background:linear-gradient(180deg,transparent,rgba(255,241,218,.10) 38%,rgba(255,255,255,.42) 50%,rgba(255,241,218,.10) 62%,transparent);filter:blur(1.5px);opacity:calc((1 - var(--dev)) * 9);pointer-events:none}
.mvin-wave::after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:rgba(255,255,255,.55);border-radius:2px;transform:skewY(-2deg)}
.mvin-glint{position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,241,218,.0) 38%,rgba(255,241,218,.55) 50%,rgba(255,226,180,0) 62%,transparent 70%);translate:-120% 0;transition:translate 0s;pointer-events:none;mix-blend-mode:screen}
.mvin-print:hover .mvin-glint{translate:120% 0;transition:translate 1.2s cubic-bezier(.3,.6,.2,1)}
.mvin-glow{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(90% 70% at 85% 0%,rgba(255,60,40,.55),rgba(255,40,30,.12) 55%,transparent 80%);mix-blend-mode:screen;opacity:calc(1 - var(--dev) * .92)}
.mvin-lamp{position:absolute;z-index:3;right:5.5%;top:2%;display:inline-flex;align-items:center;gap:8px;height:5%;min-height:22px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-cloud)}
.mvin-lamp i{width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,#FF3B2F calc((1 - var(--dev)) * 100%),#FFF1DA);box-shadow:0 0 12px 3px color-mix(in srgb,rgba(255,59,47,.8) calc((1 - var(--dev)) * 100%),rgba(255,226,180,.55))}
.mvin-cap{position:relative;display:flex;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:4px;background:color-mix(in srgb,var(--mv-ink) 5%,transparent);box-shadow:inset 0 0 0 1px var(--mv-fog);font-size:12px;letter-spacing:.1em;text-transform:uppercase;overflow:hidden}
.mvin-cap b{font-weight:500;font-variant-numeric:tabular-nums;display:inline-block;min-width:4ch;text-align:right}
.mvin-st2{white-space:nowrap}
.mvin-bar{position:absolute;left:0;bottom:0;height:2px;width:100%;background:var(--mv-brass);transform-origin:0 50%;transform:scaleX(var(--dev))}
.mvin.is-tab .mvin-grid{grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:40px}
.mvin.is-tab .mvin-facts{grid-template-columns:1fr} .mvin.is-tab .mvin-facts li+li{padding-left:0;border-left:0;border-top:1px solid var(--mv-fog)} .mvin.is-tab .mvin-facts li{padding:12px 0 12px;flex-direction:row;gap:14px}
.mvin.is-ph{padding:72px 0 88px}
.mvin.is-ph .mvin-grid{grid-template-columns:1fr;gap:44px}
.mvin.is-ph .mvin-fig{order:-1;justify-self:stretch;max-width:none}
.mvin.is-ph .mv-hd.mvin-st{font-size:27px!important}
.mvin.is-ph .mvin-facts{grid-template-columns:1fr} .mvin.is-ph .mvin-facts li+li{padding-left:0;border-left:0;border-top:1px solid var(--mv-fog)} .mvin.is-ph .mvin-facts li{padding:12px 0;flex-direction:row;gap:14px}
.mvin.is-ph .mvin-btns{flex-direction:column;align-items:stretch;width:100%} .mvin.is-ph .mvin-btns .mv-btn{width:100%}
.mvin.is-ph .mvin-cap{font-size:12px;letter-spacing:.06em}
@media (prefers-reduced-motion:reduce){.mvin-sheen{animation:none}}
`;
