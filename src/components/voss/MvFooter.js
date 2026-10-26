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
  rise,
  Head,
  useSite,
  linkList,
  onTick,
  clamp01,
  Reveal,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultProjects } from './siteData';

// ---- THE WRAP: the footer waits behind the CTA (Reveal curtain) and a production SLATE is uncovered with it. While the curtain lifts the
// clapper arm opens wider (--rv); once the footer is almost fully uncovered the arm SNAPS shut with a small white flash and the take number
// counts up (scroll back up and it re-arms for the next take). Hover the slate: the arm lifts a little. Still / reduced motion = clapped. ----

const IcoArrow = ({ s = 20 }) => (
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

const SocialIcon = ({ name = '', s = 16 }) => {
  const n = String(name).toLowerCase();
  if (n.includes('behance')) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.111 0-5-2.25-5-5.5s1.944-5.5 4.889-5.5c3.084 0 4.757 2.083 4.757 5.139 0 .417-.056.861-.083 1.111h-7.389c.083 1.361 1.056 2.361 2.5 2.361 1.25 0 1.944-.611 2.222-1.111h2.83zm-4.778-5.361c-1.167 0-1.889.722-2.028 1.861h4.111c-.028-1.028-.75-1.861-2.083-1.861zm-10.948 8.361h-8v-16h7.722c2.722 0 4.778 1.278 4.778 3.75 0 1.556-.833 2.722-2.111 3.361 1.639.583 2.611 1.944 2.611 3.861 0 3.028-2.306 5.028-5 5.028zm-4.5-9.611h3.75c1.083 0 1.944-.556 1.944-1.5 0-.944-.861-1.444-1.944-1.444h-3.75v2.944zm0 6.667h3.944c1.278 0 2.222-.611 2.222-1.722 0-1.139-.944-1.722-2.222-1.722h-3.944v3.444z" />
      </svg>
    );
  }
  if (n.includes('linkedin')) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }
  if (n.includes('whatsapp')) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.031 2c-5.502 0-9.972 4.47-9.972 9.974 0 1.757.457 3.473 1.328 4.984l-1.411 5.161 5.29-1.388c1.46.797 3.109 1.217 4.765 1.217 5.503 0 9.973-4.47 9.973-9.974 0-5.504-4.47-9.974-9.973-9.974zm0 18.254c-1.488 0-2.946-.4-4.218-1.156l-.302-.179-3.136.822.838-3.056-.197-.313c-.829-1.319-1.267-2.846-1.267-4.402 0-4.551 3.702-8.254 8.282-8.254 4.57 0 8.272 3.703 8.272 8.254 0 4.552-3.702 8.284-8.272 8.284zm4.536-6.196c-.249-.125-1.472-.727-1.7-.81-.229-.083-.395-.125-.561.125-.166.249-.644.81-.789.977-.145.166-.291.187-.54.062s-1.05-.387-2.001-1.234c-.74-.66-1.239-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.291.374-.437.125-.145.166-.249.249-.415.083-.166.042-.312-.021-.437s-.561-1.35-.769-1.849c-.202-.487-.407-.421-.561-.429l-.478-.008c-.166 0-.436.062-.664.312s-.872.852-.872 2.078 1.892 2.411 2.162 2.764c.27.353 3.693 5.64 8.948 7.91 1.25.54 2.226.863 2.986 1.104 1.256.399 2.398.343 3.301.208 1.008-.15 3.093-1.264 3.53-2.485.437-1.222.437-2.271.312-2.486-.125-.214-.457-.339-.706-.464z" />
      </svg>
    );
  }
  if (n.includes('mail') || n.includes('email')) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

export default function MvFooter(props = {}) {
  const {
    reveal = true,
    layer = 9,
    heading = "That's a *wrap*.",
    lead = 'Thanks for watching to the end. Say hello, I read every message and reply within a day.',
    emailLabel = 'Write to me',
    prodLabel = 'Prod.',
    prod = 'Portfolio 2026',
    sceneLabel = 'Scene',
    scene = 'Footer',
    takeLabel = 'Take',
    take = '1',
    rollLabel = 'Roll',
    roll = 'A-09',
    directorLabel = 'Director',
    dateLabel = 'Date',
    buildLabel = 'Build',
    build = 'main · 9f3c1a',
    pagesTitle = 'Menu',
    pages = 'Work:/work, About:/about, Resume:/resume, Contact:/contact',
    workTitle = 'Selected Work',
    elsewhereTitle = 'Elsewhere',
    legal = 'Privacy:/privacy, Terms:/terms',
    timeLabel = 'Local time',
    topLabel = 'Back to top',
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
      : 'var(--mv-font-dw, 740)',
  };

  const root = useRef(null);
  const slate = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  useMagnet(root, live);
  const on = useOn(root, live, rm, 0.05);
  const projects = props.projects || defaultProjects;
  const anim = live && !rm && !still;
  const t0 = Math.max(1, parseInt(take, 10) || 1);
  const [clap, setClap] = useState(false);
  const [tk, setTk] = useState(t0);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    setTk(t0);
  }, [t0]);

  // the clap: fires once the curtain has (almost) fully lifted; re-arms when the footer is covered again
  useEffect(() => {
    if (!anim || !slate.current || !root.current) return;
    const sl = slate.current,
      el = root.current;
    let st = false,
      gate = 0,
      open = 0,
      since = 0;
    const read = () => {
      const rev = el.closest('.mv-rev');
      const act = !!(rev && rev.classList.contains('is-act'));
      const r = sl.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const vis = clamp01((vh - r.top) / Math.max(1, r.height));
      if (act && rev) {
        const rv = parseFloat(rev.style.getPropertyValue('--rv') || '0');
        gate = rv > 0.985 && vis > 0.9 ? 1 : 0;
        open = rv < 0.5 || vis < 0.1 ? 1 : 0;
      } else {
        gate = vis > 0.85 ? 1 : 0;
        open = vis < 0.08 ? 1 : 0;
      }
    };
    const off = onTick((t) => {
      if (!gate) since = 0;
      else if (!since) since = t;
      if (!st && gate && t - since > 260) {
        st = true;
        setClap(true);
        setFlash((f) => f + 1);
      } else if (st && open) {
        st = false;
        setClap(false);
        setTk((n) => n + 1);
      }
    }, read);
    return () => off();
  }, [anim]);

  const shut = clap || !anim;
  const [year, setYear] = useState('2026');
  const [now, setNow] = useState('--:--');
  const [today, setToday] = useState('');

  useEffect(() => {
    if (!live) return;
    const d = new Date();
    setYear(String(d.getFullYear()));
    try {
      setToday(
        new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
          .format(d)
          .replace(/\//g, '.')
      );
    } catch (e) {}
    const f = () => {
      try {
        setNow(
          new Intl.DateTimeFormat('en-GB', {
            timeZone: site.tz || 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date())
        );
      } catch (e) {}
    };
    f();
    const id = window.setInterval(f, 15000);
    return () => window.clearInterval(id);
  }, [live, site.tz]);

  const toTop = (e) => {
    e.preventDefault();
    const W = window;
    const L = W.__ltLenis;
    if (L && L.scrollTo) L.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
    try {
      (
        document.querySelector('.mvhd-logo') ||
        document.querySelector('a[href]:not(.mvhd-skip),button')
      )?.focus({ preventScroll: true });
    } catch (x) {}
  };

  const socials = linkList(site.socials);
  const cols = [
    {
      t: pagesTitle,
      l: linkList(pages).map((x) => ({ ...x, s: '' })),
      ext: false,
    },
    {
      t: workTitle,
      l: projects
        .slice(0, 5)
        .map((p) => ({ l: p.f1, h: `/work/${p.slug}`, s: p.f3 })),
      ext: false,
    },
    {
      t: elsewhereTitle,
      l: socials.map((x) => ({ ...x, s: '' })),
      ext: true,
    },
  ].filter((x) => x.t && x.l.length);

  const F = ({ k, v, cls }) => (
    <div className={`mvft-f${cls ? ' ' + cls : ''}`}>
      <span style={M}>{k}</span>
      <b style={Dh}>{v}</b>
    </div>
  );

  const body = (
    <section
      ref={root}
      id={props.id || "footer"}
      className={`mv mv-sec mv-dark mvft${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}${anim ? ' is-anim' : ''}${shut ? ' is-clap' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html:
            CSS_BASE + CSS_MOTION + CSS_FOOTER + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <div className="mvft-top">
          <div
            ref={slate}
            className="mvft-slate"
            style={rise(on, 0, 18)}
          >
            <div className="mvft-sticks" aria-hidden>
              <i className="mvft-arm">
                <b />
              </i>
              <i className="mvft-base">
                <b />
              </i>
              <i className="mvft-hinge" />
            </div>
            <div className="mvft-board">
              <F k={prodLabel} v={prod} cls="is-wide" />
              <div className="mvft-row3">
                <F k={sceneLabel} v={scene} />
                <F
                  k={takeLabel}
                  v={
                    <span key={tk} className="mvft-tk">
                      {tk}
                    </span>
                  }
                />
                <F k={rollLabel} v={roll} />
              </div>
              <F k={directorLabel} v={site.name} cls="is-wide" />
              <div className="mvft-row2">
                <F k={dateLabel} v={today || ' '} />
                <F
                  k={buildLabel}
                  v={
                    <span className="mvft-code" style={M}>
                      {build}
                    </span>
                  }
                />
              </div>
            </div>
            <i
              key={flash}
              className={`mvft-flash${flash ? ' is-go' : ''}`}
              aria-hidden
            />
          </div>
          <div className="mvft-say">
            <Head
              text={heading}
              on={on}
              D={Dh}
              size="clamp(40px,4.3vw,64px)"
              lh={0.95}
              delay={120}
            />
            {lead && (
              <p className="mvft-lead" style={rise(on, 260)}>
                {lead}
              </p>
            )}
            <div className="mvft-socials-dock" style={rise(on, 300)}>
              <a
                href="https://www.linkedin.com/in/sheelash-singh-bhadoriya-5a941818b/"
                target="_blank"
                rel="noopener noreferrer"
                className="mvft-dock-pill"
                title="Sheelash on LinkedIn"
                aria-label="Sheelash on LinkedIn"
              >
                <SocialIcon name="linkedin" s={14} />
                <span>LinkedIn</span>
                <span className="mvft-dock-arr">↗</span>
              </a>
              <a
                href="https://www.behance.net/prithvibhadour"
                target="_blank"
                rel="noopener noreferrer"
                className="mvft-dock-pill"
                title="Sheelash on Behance"
                aria-label="Sheelash on Behance"
              >
                <SocialIcon name="behance" s={14} />
                <span>Behance</span>
                <span className="mvft-dock-arr">↗</span>
              </a>
              <a
                href="https://wa.me/919516372235"
                target="_blank"
                rel="noopener noreferrer"
                className="mvft-dock-pill"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
              >
                <SocialIcon name="whatsapp" s={14} />
                <span>WhatsApp</span>
                <span className="mvft-dock-arr">↗</span>
              </a>
            </div>
            {site.email && (
              <p className="mvft-mailw" style={rise(on, 340)}>
                <span style={M}>{emailLabel}</span>
                <a
                  className="mvft-mail"
                  href={`mailto:${site.email}`}
                  style={Dh}
                >
                  {site.email}
                  <IcoArrow s={20} />
                </a>
              </p>
            )}
          </div>
        </div>
        <nav className="mvft-cols" aria-label="Footer">
          {cols.map((col, i) => (
            <div
              key={i}
              className="mvft-col"
              style={rise(on, 380 + i * 80)}
            >
              <h3 className="mvft-ct" style={M}>
                {col.t}
              </h3>
              <ul>
                {col.l.map((l, j) => (
                  <li key={j}>
                    <a
                      href={l.h}
                      target={col.ext ? '_blank' : undefined}
                      rel={col.ext ? 'noopener noreferrer' : undefined}
                    >
                      {col.ext && (
                        <span className="mvft-soc-ico" aria-hidden="true">
                          <SocialIcon name={l.l} s={15} />
                        </span>
                      )}
                      <span className="mvft-ll">
                        {l.l}
                      </span>
                      {l.s ? <em style={M}>{l.s}</em> : null}
                      <i aria-hidden>{col.ext ? '↗' : '→'}</i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mvft-legal" style={M}>
          <span>
            © {year} {site.name}
          </span>
          <ul>
            {linkList(legal).map((l, i) => (
              <li key={i}>
                <a href={l.h}>{l.l}</a>
              </li>
            ))}
          </ul>
          <span className="mvft-time">
            <i className="mv-port" aria-hidden />
            {timeLabel} {now}
            {site.city ? ` · ${site.city}` : ''}
          </span>
          <button
            type="button"
            className="mvft-top-btn"
            onClick={toTop}
          >
            {topLabel} <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </section>
  );

  return reveal ? (
    <Reveal on={reveal} layer={layer}>
      {body}
    </Reveal>
  ) : (
    body
  );
}

const CSS_FOOTER = `
.mvft{background:var(--mv-night);color:var(--mv-cloud);padding:clamp(88px,8vw,128px) 0 26px;overflow:clip;--line:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--chalk:color-mix(in srgb,var(--mv-cloud) 82%,transparent)}
.mvft .mv-hd{font-stretch:115%;letter-spacing:-.04em}
.mvft .mv-it{font-weight:inherit}
.mvft-top{display:grid;grid-template-columns:clamp(340px,34vw,500px) minmax(0,1fr);gap:clamp(40px,6vw,120px);align-items:end;padding-bottom:clamp(56px,6vw,96px);border-bottom:1px solid var(--line)}
/* THE SLATE */
.mvft-slate{position:relative;padding-top:clamp(52px,5vw,70px)}
.mvft-sticks{position:absolute;left:0;right:0;top:0;height:clamp(52px,5vw,70px)}
.mvft-arm,.mvft-base{position:absolute;left:0;right:0;height:calc(50% - 2px);border-radius:4px 4px 2px 2px;overflow:hidden;background:var(--mv-ink);box-shadow:inset 0 0 0 1.5px var(--chalk)}
.mvft-arm b,.mvft-base b{position:absolute;inset:0;background:repeating-linear-gradient(118deg,var(--mv-cloud) 0 28px,var(--mv-ink) 28px 56px)}
.mvft-base{bottom:0} 
.mvft-base b{background-position:-14px 0}
.mvft-arm{top:2px;transform-origin:14px 100%;rotate:-24deg;box-shadow:inset 0 0 0 1.5px var(--chalk),0 10px 18px -8px rgba(0,0,0,.6)}
/* live: the arm opens wider as the curtain lifts (--rv from Reveal), then snaps shut */
.mvft.is-anim .mvft-arm{rotate:calc(-12deg - var(--rv,1)*12deg);transition:rotate .5s cubic-bezier(.2,.8,.2,1)}
.mvft.is-clap .mvft-arm{rotate:0deg;transition:rotate .16s cubic-bezier(.7,0,1,.6)}
.mvft.is-ph:not(.is-clap) .mvft-arm{rotate:-8deg} 
.mvft.is-ph.is-anim:not(.is-clap) .mvft-arm{rotate:calc(-3deg - var(--rv,1)*5deg)}
.mvft.is-clap .mvft-slate:hover .mvft-arm{rotate:-7deg;transition:rotate .45s cubic-bezier(.34,1.56,.64,1)}
.mvft-hinge{position:absolute;left:6px;top:calc(50% - 7px);width:14px;height:14px;border-radius:50%;background:var(--mv-cloud);box-shadow:0 0 0 3px var(--mv-ink),inset 0 0 0 3px color-mix(in srgb,var(--mv-stone) 70%,var(--mv-ink))}
.mvft-board{position:relative;display:flex;flex-direction:column;border-radius:4px 4px 8px 8px;background:color-mix(in srgb,var(--mv-ink) 88%,#000);box-shadow:inset 0 0 0 1.5px var(--chalk),0 30px 60px -30px rgba(0,0,0,.8);overflow:hidden}
.mvft.is-clap.is-anim .mvft-board{animation:mvft-hit .32s cubic-bezier(.3,0,.2,1) .12s}
@keyframes mvft-hit{0%{translate:0 0}35%{translate:0 3px}100%{translate:0 0}}
.mvft-board::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 70% at 20% 0%,rgba(255,241,218,.07),transparent 60%);mix-blend-mode:screen}
.mvft-f{display:flex;flex-direction:column;gap:6px;padding:12px 16px 14px;min-width:0}
.mvft-f>span{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvft-f b{font-size:clamp(20px,1.7vw,28px);line-height:1.05;letter-spacing:-.02em;font-stretch:110%;color:var(--chalk);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mvft-f.is-wide+.mvft-row3,.mvft-row3+.mvft-f,.mvft-f.is-wide+.mvft-row2{border-top:1.5px solid var(--chalk)}
.mvft-row3,.mvft-row2{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))} 
.mvft-row2{grid-template-columns:minmax(0,1fr) minmax(0,1.3fr)}
.mvft-row3>.mvft-f+.mvft-f,.mvft-row2>.mvft-f+.mvft-f{border-left:1.5px solid var(--chalk)}
.mvft-row3 .mvft-f b{font-size:clamp(24px,2.2vw,36px)}
.mvft-tk{display:inline-block;color:var(--mv-brass);animation:mvft-tk .5s cubic-bezier(.2,.8,.2,1)} 
@keyframes mvft-tk{from{translate:0 60%;opacity:0}}
.mvft-code{font-size:13px;letter-spacing:.02em;color:var(--mv-brass)}
.mvft-flash{position:absolute;inset:-14px;z-index:3;border-radius:14px;pointer-events:none;background:radial-gradient(closest-side,#FFFFFF,rgba(255,241,218,.7) 45%,transparent);opacity:0}
.mvft-flash.is-go{animation:mvft-fl .5s ease-out .12s}
@keyframes mvft-fl{0%{opacity:.75}100%{opacity:0}}
/* the words */
.mvft-say{display:flex;flex-direction:column;gap:22px;padding-bottom:6px}
.mvft-lead{margin:0;max-width:44ch;font-size:17px;line-height:1.55;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvft-mailw{display:flex;flex-direction:column;gap:8px;margin:6px 0 0} 
.mvft-mailw>span{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvft-mail{align-self:flex-start;display:inline-flex;align-items:center;gap:12px;max-width:100%;font-size:clamp(22px,2.2vw,34px);letter-spacing:-.025em;font-stretch:110%;text-decoration:none;background:linear-gradient(var(--mv-brass),var(--mv-brass)) 0 100%/0% 2px no-repeat;padding-bottom:4px;transition:background-size .5s steps(8,end),color .3s;overflow-wrap:anywhere}
.mvft-mail svg{flex:none;transition:transform .45s cubic-bezier(.34,1.56,.64,1)} 
.mvft-mail:hover,.mvft-mail:focus-visible{background-size:100% 2px;color:var(--mv-brass)} 
.mvft-mail:hover svg{transform:rotate(-45deg)}
/* columns */
.mvft-cols{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr);gap:clamp(28px,4vw,64px);padding:clamp(48px,5vw,72px) 0}
.mvft-ct{margin:0 0 18px;font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvft-col ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.mvft-col a{position:relative;display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--line);text-decoration:none;font-size:16px;transition:color .3s}
.mvft-soc-ico{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;color:color-mix(in srgb,var(--mv-cloud) 75%,transparent);flex-shrink:0;transition:color .25s,transform .25s}
.mvft-soc-ico svg{display:block}
.mvft-col a:hover .mvft-soc-ico{color:var(--mv-brass);transform:scale(1.18)}
.mvft-socials-dock{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:4px 0}
.mvft-dock-pill{display:inline-flex;align-items:center;gap:7px;padding:6px 12px 6px 10px;border-radius:999px;font-size:12.5px;font-weight:600;letter-spacing:.02em;text-decoration:none;color:var(--mv-cloud);background:color-mix(in srgb,var(--mv-cloud) 8%,transparent);border:1px solid color-mix(in srgb,var(--mv-cloud) 16%,transparent);box-shadow:inset 0 0 0 1px rgba(255,255,255,.03);transition:all .22s cubic-bezier(.2,.8,.2,1)}
.mvft-dock-pill svg{display:block;flex-shrink:0}
.mvft-dock-pill:hover{background:var(--mv-brass);color:var(--mv-ink);border-color:var(--mv-brass);transform:translateY(-2px);box-shadow:0 6px 20px rgba(255,91,46,.3)}
.mvft-dock-arr{font-size:11px;opacity:.7;transition:transform .2s ease}
.mvft-dock-pill:hover .mvft-dock-arr{opacity:1;transform:translate(1px,-1px)}
.mvft-ll{position:relative;padding:0 .12em;margin:0 -.12em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) 0 0/0% 100% no-repeat;transition:background-size .4s steps(6,end),color .25s}
.mvft-col a:hover .mvft-ll,.mvft-col a:focus-visible .mvft-ll{background-size:100% 100%;color:var(--mv-ink)}
.mvft-col em{font-style:normal;font-size:12px;letter-spacing:.06em;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mvft-col i{margin-left:auto;font-style:normal;opacity:0;translate:-6px 0;transition:opacity .3s,translate .3s} 
.mvft-col a:hover i,.mvft-col a:focus-visible i{opacity:1;translate:0 0}
/* legal */
.mvft-legal{display:flex;flex-wrap:wrap;align-items:center;gap:14px 28px;padding-top:22px;border-top:1px solid var(--line);font-size:12px;letter-spacing:.06em;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvft-legal ul{display:flex;gap:22px;list-style:none;margin:0;padding:0} 
.mvft-legal a{text-decoration:none} 
.mvft-legal a:hover{color:var(--mv-cloud);text-decoration:underline;text-underline-offset:3px}
.mvft-time{display:inline-flex;align-items:center;gap:8px;margin-left:auto}
.mvft-top-btn{appearance:none;border:0;font:inherit;letter-spacing:inherit;color:var(--mv-cloud);display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:10px;background:color-mix(in srgb,var(--mv-cloud) 8%,transparent);box-shadow:inset 0 0 0 1px var(--line);cursor:pointer;transition:background .3s,color .3s}
.mvft-top-btn:hover{background:var(--mv-brass);color:var(--mv-ink)} 
.mvft-top-btn span{transition:translate .35s cubic-bezier(.34,1.56,.64,1)} 
.mvft-top-btn:hover span{translate:0 -3px}
/* tablet + phone */
.mvft.is-tab .mvft-top{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px}
.mvft.is-ph{padding:72px 0 22px}
.mvft.is-ph .mvft-top{grid-template-columns:minmax(0,1fr);gap:44px}
.mvft.is-ph .mvft-say{order:-1}
.mvft.is-ph .mvft-cols{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:36px 20px} 
.mvft.is-ph .mvft-col:first-child{grid-column:1/-1}
.mvft.is-ph .mvft-f{padding:10px 12px 12px} 
.mvft.is-ph .mvft-f b{font-size:20px;white-space:normal;overflow-wrap:anywhere;text-overflow:clip} 
.mvft.is-ph .mvft-row3 .mvft-f b{font-size:clamp(18px,5.6vw,24px)} 
.mvft.is-ph .mvft-mail{font-size:clamp(17px,5.6vw,22px)}
.mvft.is-ph .mvft-legal{gap:12px 20px} 
.mvft.is-ph .mvft-time{margin-left:0;width:100%}
`;
