'use client';

import {
  useEffect,
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
  onTick,
  clamp01,
  rise,
  pick,
  linkList,
  listOf,
  Eyebrow,
  Btn,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { siteData, defaultExperience } from './siteData';

const MvrsSec = ({ M, t, children, cls = '' }) => (
  <section className={`mvrs-sec${cls ? ' ' + cls : ''}`}>
    <h2 className="mvrs-h2" style={M}>
      <i aria-hidden />
      {t}
    </h2>
    {children}
  </section>
);

export default function MvResume(props = {}) {
  const {
    eyebrow = 'FRAME 00 — Résumé',
    updated = 'Updated 2026 · A4',
    pdfLabel = 'Download PDF',
    pdfLink = siteData.resume || '/Sheelash Singh Bhadoriya - Resume.pdf',
    printLabel = 'Print',
    sheetLeft = 'Résumé · {name}',
    sheetRight = 'Proof 01',
    nameOverride = '',
    roleOverride = 'Product Designer | UI/UX & Design Systems',
    websiteLabel = 'portfolio-s-gilt.vercel.app',
    website = 'https://portfolio-s-gilt.vercel.app',
    summaryTitle = 'Profile',
    summary = 'Product Designer and Frontend Developer with 6 years of experience creating user-centered digital products, SaaS platforms, and responsive web applications. Skilled in UX research, UI design, Figma, React, Next.js, and WordPress, focused on improving usability and delivering impactful digital experiences.',
    expTitle = 'Experience',
    moreLabel = 'Key Contributions',
    b1 = 'Led Product Discovery and Interaction Design for 4 enterprise SaaS platforms, structuring complex Information Architecture and user flows to increase task completion rates by 32% across 50,000+ users.;Architected and scaled a multi-brand Figma design system with 250+ tokens and components, establishing standardized UI patterns across 4 product squads and accelerating sprint delivery velocity by over 40%.;Executed 45+ Usability Research sessions and heuristic audits applying Design Thinking, translating user feedback into interface refinements that reduced workflow drop-off by 28% and cut support tickets by 35%.;Developed responsive, accessible web interfaces adhering strictly to Accessibility (WCAG) standards using React, Next.js, and Redux, cutting design handoff discrepancies and UI defect tickets by 35%.',
    b2 = 'Delivered Interaction Design, detailed user personas, journey maps, wireframes, and clickable interactive prototypes in Figma for 18+ international client accounts across diverse responsive web and mobile products.;Facilitated Product Discovery workshops and restructured complex Information Architecture, applying Design Thinking principles to streamline onboarding funnels and boost enterprise user retention by 25%.;Partnered closely with cross-functional engineering teams during Agile sprints to deliver pixel-accurate design specifications and token documentation, cutting frontend implementation turnaround by 30%.',
    b3 = 'Built semantic, responsive web layouts and interactive UI prototypes using HTML5, CSS3, and JavaScript, collaborating on 12+ client website launches complying with Accessibility (WCAG 2.1) standards.;Standardized reusable UI component libraries, responsive layout grids, and digital asset production guidelines, ensuring seamless cross-browser consistency and accelerating team asset delivery turnaround by 20%.',
    skillsTitle = 'Skills',
    designTitle = 'Design & Strategy',
    codeTitle = 'Frontend & Standards',
    designSkills = 'UI/UX Design;Interaction Design;Information Architecture;Wireframing;Prototyping;Design Systems;Usability Research;User Testing;Heuristic Evaluation;Product Discovery;Design Thinking',
    codeSkills = 'React;Next.js;Redux Toolkit;HTML5;CSS3;REST APIs;Accessibility (WCAG 2.1);Agile/Scrum;Developer Handoff',
    toolsTitle = 'Tools & Environment',
    tools = 'Figma;Framer;Adobe Creative Suite (Photoshop, Illustrator);Accessibility (WCAG 2.1);React;Next.js;Redux Toolkit;HTML5;CSS3;VS Code;Git',
    eduTitle = 'Education',
    awardTitle = 'Milestones & Impact',
    langTitle = 'Languages',
    languages = 'English — Fluent;Hindi — Native',
    experience = defaultExperience,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const site = siteData;

  const root = useRef(null);
  const list = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm, 0.05);
  useMagnet(root, live);

  const rows = experience || defaultExperience;
  const work = rows.filter((r) => r.f5 === 'work');
  const edu = rows.filter((r) => r.f5 === 'edu');
  const awards = rows.filter((r) => r.f5 === 'award');
  const B_ = [b1, b2, b3];

  const final = still || rm || !live;

  const fill = (s) =>
    String(s || '')
      .replace(/\{name\}/g, site.name || '')
      .replace(/\{city\}/g, site.city || '')
      .replace(/\{years\}/g, site.years || '6')
      .replace(/\{email\}/g, site.email || '');

  useEffect(() => {
    if (final || !list.current) return;
    const el = list.current;
    let tops = [],
      offs = [],
      top = 0,
      h = 1,
      vh = 1,
      vis = true,
      fresh = false,
      cur = -1;
    const pills = () => Array.from(el.querySelectorAll('.mvrs-pill'));
    const measure = () => {
      offs = pills().map((p) => {
        let y = 0,
          n = p;
        while (n && n !== el) {
          y += n.offsetTop;
          n = n.offsetParent;
        }
        return y + p.offsetHeight / 2;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: '30% 0px 30% 0px' }
    );
    io.observe(el);
    const off = onTick(
      () => {
        if (!fresh) return;
        const want = clamp01((vh * 0.62 - top) / h);
        cur = cur < 0 ? want : cur + (want - cur) * 0.16;
        if (Math.abs(want - cur) < 0.0005) cur = want;
        el.style.setProperty('--fill', cur.toFixed(4));
        const px = cur * h;
        pills().forEach((p, i) => {
          const r = px >= (offs[i] || 0) - 4;
          if (p.classList.contains('is-r') !== r)
            p.classList.toggle('is-r', r);
        });
      },
      () => {
        if (!vis && cur >= 0) {
          fresh = false;
          return;
        }
        const r = el.getBoundingClientRect();
        top = r.top;
        h = Math.max(1, r.height);
        vh = window.innerHeight;
        fresh = true;
      }
    );
    return () => {
      off();
      ro.disconnect();
      io.disconnect();
    };
  }, [final, work.length, w]);

  const pdfHref = pick(pdfLink, site.resume || '/Sheelash Singh Bhadoriya - Resume.pdf');
  const selfPdf = !pdfHref || /^\/resume\/?$/.test(pdfHref);
  const doPrint = (e) => {
    e.preventDefault();
    try {
      window.print();
    } catch (x) { }
  };

  const socials = linkList(site.socials);
  const name = pick(nameOverride, site.name),
    role = pick(roleOverride, site.role);
  const summaryT = fill(
    pick(
      summary,
      'Product designer and front-end developer with {years} years of Experience in web and mobile products. I take work from research and flows to a production-ready design system in React, so the thing that ships is the thing we designed. Based in {city}, working with teams in Europe, US, and globally.'
    )
  );

  const dS = listOf(
    designSkills ||
    'Product strategy;UX research;Interaction design;Design systems;Prototyping;Motion design'
  );
  const cS = listOf(
    codeSkills ||
    'React & Next.js;TypeScript;CSS & Tailwind;Framer Motion & GSAP;Accessibility (WCAG 2.2);Storybook & testing'
  );
  const toolL = listOf(tools || 'Figma;Framer;Rive;VS Code;Git;Linear;Notion');
  const langL = listOf(
    languages || 'English — fluent;Hindi — native'
  );
  const dfw = props.customFonts ? D.fontWeight : 780;

  return (
    <section
      ref={root}
      className={`mv mv-sec mvrs${phone ? ' is-ph' : tab ? ' is-tab' : ''}${final ? ' is-final' : ''}${on ? ' is-on' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_MVRS + siteFontCss(props),
        }}
      />
      <div className="mv-wrap mvrs-wrap">
        <div className="mvrs-bar" style={rise(on, 0, 10)}>
          <div className="mvrs-bl">
            <Eyebrow text={eyebrow} on={on} M={M} />
            {updated && (
              <span className="mvrs-up" style={M}>
                {updated}
              </span>
            )}
          </div>
          <div className="mvrs-btns">
            {printLabel && (
              <Btn
                href="#print"
                label={printLabel}
                kind="ghost"
                arrow={false}
                onClick={doPrint}
              />
            )}
            {pdfLabel && (
              <Btn
                href={selfPdf ? '#print' : pdfHref}
                label={pdfLabel}
                kind="solid"
                onClick={selfPdf ? doPrint : undefined}
              />
            )}
          </div>
        </div>
        <article className="mvrs-sheet" style={rise(on, 120, 26)}>
          <i className="mvrs-crop" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </i>
          <p className="mvrs-proof" style={M} aria-hidden>
            <span>{fill(sheetLeft)}</span>
            <span>{fill(sheetRight)}</span>
          </p>
          <header className="mvrs-head">
            <h1 className="mvrs-h1">
              <span
                className="mvrs-nm"
                style={{ ...D, fontWeight: dfw }}
              >
                {name}
              </span>
              {role && (
                <span className="mvrs-rl" style={D}>
                  {role}
                </span>
              )}
            </h1>
            <ul className="mvrs-ct" style={M}>
              {site.avail && (
                <li className="mvrs-av">
                  <i className="mv-port" aria-hidden />
                  {site.avail}
                </li>
              )}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </li>
              )}
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone.replace(/\s+/g, '')}`}>
                    {site.phone}
                  </a>
                </li>
              )}
              {site.city && <li>{site.city}</li>}
              {websiteLabel && (
                <li>
                  <a href={website || '/'}>{websiteLabel}</a>
                </li>
              )}
              {socials.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.h}
                    target="_blank"
                    rel="noopener"
                  >
                    {s.l}
                  </a>
                </li>
              ))}
            </ul>
          </header>
          {summaryT && (
            <MvrsSec M={M} t={summaryTitle} cls="mvrs-sum">
              <p className="mvrs-lede" style={D}>
                {summaryT}
              </p>
            </MvrsSec>
          )}
          <div className="mvrs-body">
            <div className="mvrs-main">
              {work.length > 0 && (
                <MvrsSec M={M} t={expTitle}>
                  <ol
                    ref={list}
                    className="mvrs-tl"
                    style={{
                      '--fill': final ? 1 : 0,
                    }}
                  >
                    <i className="mvrs-rule" aria-hidden>
                      <i />
                      <b />
                    </i>
                    {work.map((r, i) => {
                      const bl = listOf(B_[i] || '');
                      return (
                        <li
                          key={r.slug || i}
                          className="mvrs-role"
                          tabIndex={
                            bl.length
                              ? 0
                              : undefined
                          }
                        >
                          <i
                            className="mvrs-dot"
                            aria-hidden
                          />
                          <p
                            className="mvrs-pill"
                            style={M}
                          >
                            <span>{r.f3}</span>
                          </p>
                          <div className="mvrs-rc">
                            <h3
                              className="mvrs-rt"
                              style={D}
                            >
                              {r.f1}
                            </h3>
                            <p
                              className="mvrs-co"
                              style={M}
                            >
                              {r.f2}
                            </p>
                            {r.f4 && (
                              <p className="mvrs-rs">
                                {r.f4}
                              </p>
                            )}
                            {bl.length > 0 && (
                              <div className="mvrs-more">
                                <div>
                                  <p
                                    className="mvrs-hl"
                                    style={M}
                                  >
                                    {moreLabel}
                                  </p>
                                  <ul>
                                    {bl.map(
                                      (b, j) => (
                                        <li key={j}>
                                          {b}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                          {bl.length > 0 && (
                            <span
                              className="mvrs-plus"
                              style={M}
                              aria-hidden
                            >
                              +
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </MvrsSec>
              )}
              {(dS.length > 0 || cS.length > 0) && (
                <MvrsSec M={M} t={skillsTitle} cls="mvrs-skills-main">
                  <div className="mvrs-sk">
                    {dS.length > 0 && (
                      <div>
                        <h3 style={M}>{designTitle}</h3>
                        <ul>
                          {dS.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cS.length > 0 && (
                      <div>
                        <h3 style={M}>{codeTitle}</h3>
                        <ul>
                          {cS.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </MvrsSec>
              )}
            </div>
            <aside className="mvrs-aside">
              {toolL.length > 0 && (
                <MvrsSec M={M} t={toolsTitle}>
                  <ul className="mvrs-chips" style={M}>
                    {toolL.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </MvrsSec>
              )}
              {edu.length > 0 && (
                <MvrsSec M={M} t={eduTitle}>
                  <ul className="mvrs-mini">
                    {edu.map((r, i) => (
                      <li key={r.slug || i}>
                        <p
                          className="mvrs-my"
                          style={M}
                        >
                          {r.f3}
                        </p>
                        <h3 style={D}>{r.f1}</h3>
                        <p className="mvrs-mc">
                          {r.f2}
                        </p>
                        {r.f4 && (
                          <p className="mvrs-ms">
                            {r.f4}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </MvrsSec>
              )}
              {awards.length > 0 && (
                <MvrsSec M={M} t={awardTitle}>
                  <ul className="mvrs-mini">
                    {awards.map((r, i) => (
                      <li key={r.slug || i}>
                        <p
                          className="mvrs-my"
                          style={M}
                        >
                          {r.f3}
                        </p>
                        <h3 style={D}>
                          {r.f2} — {r.f1}
                        </h3>
                        {r.f4 && (
                          <p className="mvrs-ms">
                            {r.f4}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </MvrsSec>
              )}
              {langL.length > 0 && (
                <MvrsSec M={M} t={langTitle}>
                  <ul className="mvrs-lang">
                    {langL.map((s, i) => {
                      const [a, b] = s.split(/\s+[—–-]\s+/);
                      return (
                        <li key={i}>
                          <span>{a}</span>
                          {b && (
                            <span style={M}>
                              {b}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </MvrsSec>
              )}
            </aside>
          </div>
        </article>
      </div>
    </section>
  );
}

const CSS_MVRS = `
.mvrs{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(120px,11vw,164px) 0 clamp(96px,9vw,144px)}
.mvrs .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px} .mvrs .mv-eb i{border-radius:1px}
.mvrs-wrap{display:flex;flex-direction:column;align-items:center;gap:28px}
.mvrs-bar{width:100%;max-width:1120px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
.mvrs-bl{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.mvrs-up{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvrs-btns{display:flex;gap:12px;flex-wrap:wrap}
/* the sheet: a print proof on the ground */
.mvrs-sheet{position:relative;width:100%;max-width:1120px;padding:clamp(28px,4vw,64px) clamp(28px,5.4vw,80px) clamp(40px,5vw,72px);background:var(--mv-cloud);border-radius:4px;box-shadow:0 1px 0 color-mix(in srgb,var(--mv-ink) 8%,transparent),0 40px 80px -48px color-mix(in srgb,var(--mv-ink) 45%,transparent),0 0 0 1px color-mix(in srgb,var(--mv-ink) 6%,transparent)}
.mvrs-crop{position:absolute;inset:-18px;pointer-events:none}
.mvrs-crop i{position:absolute;width:14px;height:14px;border:0 solid color-mix(in srgb,var(--mv-ink) 45%,transparent)}
.mvrs-crop i:nth-child(1){left:0;top:0;border-right-width:1px;border-bottom-width:1px} .mvrs-crop i:nth-child(2){right:0;top:0;border-left-width:1px;border-bottom-width:1px}
.mvrs-crop i:nth-child(3){left:0;bottom:0;border-right-width:1px;border-top-width:1px} .mvrs-crop i:nth-child(4){right:0;bottom:0;border-left-width:1px;border-top-width:1px}
.mvrs-proof{display:flex;justify-content:space-between;gap:16px;margin:0 0 clamp(28px,3.4vw,48px);padding-bottom:10px;border-bottom:1px dashed var(--mv-fog);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvrs-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:32px;align-items:end;padding-bottom:clamp(24px,3vw,40px);border-bottom:1.5px solid var(--mv-ink)}
.mvrs-h1{margin:0;display:flex;flex-direction:column;gap:12px}
.mvrs-nm{font-size:clamp(48px,6vw,88px);line-height:.88;letter-spacing:-.05em;font-stretch:118%}
.mvrs-rl{font-size:clamp(20px,1.8vw,26px);line-height:1.1;letter-spacing:-.02em;font-weight:560;font-stretch:108%;color:color-mix(in srgb,var(--mv-ink) 72%,var(--mv-cloud))}
.mvrs-ct{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;align-items:flex-end;gap:7px;font-size:12px;letter-spacing:.04em;text-align:right}
.mvrs-ct a{text-decoration:none;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 100%/0% 100%;transition:background-size .4s steps(6);padding:0 2px} .mvrs-ct a:hover{background-size:100% 100%}
.mvrs-av{display:inline-flex;align-items:center;gap:8px;padding:4px 8px;border-radius:6px;background:color-mix(in srgb,var(--mv-ink) 5%,transparent)}
.mvrs-sec{padding-top:clamp(24px,2.8vw,40px)}
.mvrs-h2{display:flex;align-items:center;gap:10px;margin:0 0 18px;font-size:12px;font-weight:500;letter-spacing:.16em;text-transform:uppercase}
.mvrs-h2 i{width:8px;height:8px;border-radius:1px;background:var(--mv-brass)}
.mvrs-lede{margin:0;max-width:40em;font-size:clamp(19px,1.7vw,24px);line-height:1.34;letter-spacing:-.018em;font-weight:520;font-stretch:104%;text-wrap:pretty}
.mvrs-body{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:clamp(32px,4.4vw,72px)}
/* the timeline: the rule sits in the sheet's left margin */
.mvrs-tl{position:relative;list-style:none;margin:0;padding:0;--fill:0}
.mvrs-rule{position:absolute;left:calc(clamp(28px,5.4vw,80px) * -.5);top:14px;bottom:14px;width:1px;background:var(--mv-fog)}
.mvrs-rule>i{position:absolute;inset:0;background:var(--mv-ink);transform-origin:50% 0;transform:scaleY(var(--fill))}
.mvrs-rule>b{position:absolute;left:50%;top:calc(var(--fill) * 100%);width:9px;height:9px;translate:-50% -50%;border-radius:2px;background:var(--mv-brass);box-shadow:0 0 0 3px var(--mv-cloud);opacity:calc(var(--fill) * 40)}
.mvrs-role{position:relative;display:grid;grid-template-columns:132px minmax(0,1fr) 20px;gap:20px;padding:18px 0 20px;border-top:1px solid var(--mv-fog);outline:none;border-radius:2px}
.mvrs-role:first-of-type{border-top:0;padding-top:4px}
.mvrs-dot{position:absolute;left:calc(clamp(28px,5.4vw,80px) * -.5);top:calc(var(--dt,24px));width:7px;height:7px;translate:-50% -50%;border-radius:50%;background:var(--mv-cloud);box-shadow:inset 0 0 0 1.5px var(--mv-ink)}
.mvrs-role:first-of-type .mvrs-dot{--dt:10px}
.mvrs-pill{margin:0;padding-top:3px;font-size:12px;letter-spacing:.06em;font-variant-numeric:tabular-nums;white-space:nowrap}
.mvrs-pill span{display:inline-block;padding:3px 6px;margin-left:-6px;border-radius:3px;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .5s steps(8)}
.mvrs-pill.is-r span{background-size:100% 100%}
.mvrs-rt{margin:0;font-size:clamp(19px,1.6vw,22px);line-height:1.15;letter-spacing:-.02em;font-weight:680;font-stretch:108%}
.mvrs-co{margin:6px 0 0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvrs-rs{margin:10px 0 0;font-size:15.5px;line-height:1.5;max-width:38em}
.mvrs-more{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .45s cubic-bezier(.2,.8,.2,1),opacity .35s} .mvrs-more>div{overflow:hidden;min-height:0}
.mvrs-hl{margin:14px 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mv-mut)}
.mvrs-more ul{margin:0;padding:0 0 0 18px;display:flex;flex-direction:column;gap:6px;font-size:15px;line-height:1.45} .mvrs-more li::marker{content:"— ";color:var(--mv-mut)}
.mvrs-plus{align-self:start;justify-self:end;width:22px;height:22px;display:grid;place-items:center;border-radius:4px;font-size:14px;line-height:1;box-shadow:inset 0 0 0 1px var(--mv-fog);transition:rotate .4s cubic-bezier(.34,1.56,.64,1),background .3s,color .3s;color:var(--mv-mut)}
.mvrs-role{cursor:default}
.mvrs-role:is(:hover,:focus-within,:focus-visible) .mvrs-more{grid-template-rows:1fr;opacity:1}
.mvrs-role:is(:hover,:focus-within,:focus-visible) .mvrs-plus{rotate:45deg;background:var(--mv-brass);color:var(--mv-ink);box-shadow:none}
.mvrs-role:focus-visible{outline:2px solid var(--mv-ink)!important;outline-offset:6px!important;box-shadow:none!important}
/* aside & main skills */
.mvrs-skills-main{margin-bottom:24px}
.mvrs-tools-row{margin-top:20px}
.mvrs-tools-row h3{margin:0 0 10px;font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvrs-aside{display:flex;flex-direction:column}
.mvrs-aside .mvrs-sec:first-child{padding-top:clamp(24px,2.8vw,40px)}
.mvrs-sk{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.mvrs-sk h3{margin:0 0 10px;font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvrs-sk ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px;font-size:14.5px;line-height:1.3}
.mvrs-chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.mvrs-chips li{padding:5px 9px;border-radius:6px;font-size:12px;letter-spacing:.04em;box-shadow:inset 0 0 0 1px var(--mv-fog)}
.mvrs-mini{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:16px}
.mvrs-mini h3{margin:4px 0 0;font-size:17px;line-height:1.2;letter-spacing:-.015em;font-weight:660;font-stretch:106%}
.mvrs-my{margin:0;font-size:12px;letter-spacing:.08em;color:var(--mv-mut)} .mvrs-mc{margin:3px 0 0;font-size:14.5px} .mvrs-ms{margin:4px 0 0;font-size:14px;line-height:1.45;color:color-mix(in srgb,var(--mv-ink) 70%,var(--mv-cloud))}
.mvrs-lang{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.mvrs-lang li{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--mv-fog);font-size:14.5px} .mvrs-lang li span+span{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut);align-self:center}
/* tablet + phone */
.mvrs.is-tab .mvrs-body{grid-template-columns:1fr} .mvrs.is-tab .mvrs-aside{display:grid;grid-template-columns:1fr 1fr;column-gap:40px}
.mvrs.is-tab .mvrs-role{grid-template-columns:118px minmax(0,1fr) 20px}
.mvrs.is-ph{padding-top:104px}
.mvrs.is-ph .mvrs-bar{flex-direction:column;align-items:stretch} .mvrs.is-ph .mvrs-btns{flex-direction:column} .mvrs.is-ph .mvrs-btns .mv-btn{width:100%}
.mvrs.is-ph .mvrs-sheet{padding:22px 20px 32px 34px;margin:0 -8px;width:calc(100% + 16px)} .mvrs.is-ph .mvrs-crop{display:none}
.mvrs.is-ph .mvrs-head{grid-template-columns:1fr;gap:20px} .mvrs.is-ph .mvrs-ct{flex-direction:row;flex-wrap:wrap;align-items:center;column-gap:14px;row-gap:8px;text-align:left} .mvrs.is-ph .mvrs-av{flex-basis:auto} .mvrs.is-ph .mvrs-lede{font-size:18px}
.mvrs.is-ph .mvrs-nm{font-size:46px}
.mvrs.is-ph .mvrs-body{grid-template-columns:1fr;gap:0}
.mvrs.is-ph .mvrs-rule,.mvrs.is-ph .mvrs-dot{left:-19px}
.mvrs.is-ph .mvrs-role{grid-template-columns:1fr;gap:8px} .mvrs.is-ph .mvrs-plus{display:none} .mvrs.is-ph .mvrs-more{grid-template-rows:1fr} .mvrs.is-ph .mvrs-dot{--dt:26px} .mvrs.is-ph .mvrs-role:first-of-type .mvrs-dot{--dt:12px}
.mvrs.is-ph .mvrs-proof span+span{display:none}
@media (hover:none){.mvrs-more{grid-template-rows:1fr} .mvrs-plus{display:none}}
/* PRINT: only the sheet, A4, ink on white, everything open, links written out */
@media print{
  @page{size:A4;margin:13mm 14mm}
  html,body{background:#fff!important;height:auto!important;overflow:visible!important}
  body *:not(:has(.mvrs-sheet)):not(.mvrs-sheet):not(.mvrs-sheet *){display:none!important}
  :has(.mvrs-sheet){position:static!important;margin:0!important;padding:0!important;height:auto!important;min-height:0!important;max-height:none!important;transform:none!important;overflow:visible!important;background:#fff!important;box-shadow:none!important;opacity:1!important;translate:none!important}
  .mvrs-sheet{max-width:none!important;width:100%!important;padding:0!important;box-shadow:none!important;border-radius:0!important;background:#fff!important;color:var(--mv-ink)!important;opacity:1!important;translate:none!important;font-size:10pt}
  .mvrs-sheet *{animation:none!important;transition:none!important}
  .mvrs-crop,.mvrs-plus,.mvrs-rule,.mvrs-dot,.mvrs-proof{display:none!important}
  .mvrs-head{grid-template-columns:1fr!important;gap:8pt!important;padding-bottom:10pt!important}
  .mvrs-nm{font-size:30pt!important} .mvrs-rl{font-size:13pt!important} .mvrs-h1{gap:5pt!important}
  .mvrs-ct{flex-direction:row!important;flex-wrap:wrap;align-items:baseline!important;column-gap:12pt;row-gap:2pt!important;text-align:left!important;font-size:8pt!important} .mvrs-av{padding:0!important;background:none!important} .mvrs-av .mv-port{display:none}
  .mvrs-sheet a{text-decoration:none;background:none!important}
  .mvrs-sheet a[href^="http"]::after{content:" · " attr(href);color:var(--mv-mut)}
  .mvrs-sec{padding-top:10pt!important} .mvrs-h2{margin-bottom:8pt!important;font-size:8pt!important}
  .mvrs-lede{font-size:10.5pt!important;max-width:none!important}
  .mvrs-body{grid-template-columns:minmax(0,1.75fr) minmax(0,1fr)!important;gap:22pt!important} .mvrs-aside{display:flex!important}
  .mvrs-role{grid-template-columns:64pt minmax(0,1fr)!important;gap:8pt!important;padding:6pt 0 7pt!important;break-inside:avoid}
  .mvrs-role:first-of-type .mvrs-dot{--dt:6pt!important}
  .mvrs-pill{font-size:8pt!important} .mvrs-pill span{background:none!important;padding:0!important;margin:0!important}
  .mvrs-rt{font-size:11.5pt!important} .mvrs-co{font-size:7.5pt!important;margin-top:2pt!important} .mvrs-rs{font-size:9.5pt!important;margin-top:4pt!important}
  .mvrs-more{grid-template-rows:1fr!important} .mvrs-hl{display:none} .mvrs-more ul{font-size:8.6pt!important;gap:1pt!important;margin-top:3pt!important}
  .mvrs-sk ul,.mvrs-mc,.mvrs-lang li{font-size:9pt!important} .mvrs-sk ul{gap:3pt!important} .mvrs-mini h3{font-size:10pt!important} .mvrs-ms{font-size:8.5pt!important} .mvrs-mini{gap:8pt!important}
  .mvrs-chips li{font-size:8pt!important;padding:2pt 5pt!important} .mvrs-lang li{padding:4pt 0!important}
}
`;
