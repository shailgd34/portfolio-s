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
  onTick,
  clamp01,
  rise,
  pick,
  srcOf,
  imgOr,
  RS,
  listOf,
  Eyebrow,
  Head,
  Btn,
  IcoArrow,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { siteData, defaultServices, defaultProjects } from './siteData';

const SD_PH = [
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80',
];

const sdPad = (n) => String(n).padStart(2, '0');
const sdHex = (c, i) =>
  c && c.trim()
    ? c.trim()
    : ['#FF5B2E', '#FFB224', '#3DDC84', '#22C3EE'][((i % 4) + 4) % 4];

const sdComp = (s) => {
  const p = String(s || '')
    .replace(/&/g, ' and ')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((x) => x[0].toUpperCase() + x.slice(1));
  const n = p.join('');
  return n ? (/^[0-9]/.test(n) ? 'X' + n : n) : 'Deliverable';
};

const SD_STOP = new Set(['and', 'the', 'for', 'with', 'web']);

export default function MvService(props = {}) {
  const {
    slug = '',
    crumbLabel = 'Services',
    crumbLink = '/services',
    eyebrow = 'Service {n}',
    primary = 'Start a project',
    primaryLink = '/contact',
    secondary = 'All services',
    secondaryLink = '/services',
    photo,
    photoAlt = '',
    gelLabel = 'Gel',
    stepLabel = 'Step',
    stepsEyebrow = 'What you get',
    stepsTitle = 'Everything|you *keep*.',
    stepsLead = 'Every engagement ends with these in your hands, in this order. Nothing is a surprise and nothing is left in my files.',
    includedLabel = 'Included',
    showCode = true,
    projectsTitle = 'Projects with this',
    projectsLead = 'Frames from jobs where this was the work.',
    openLabel = 'Open case',
    blankLabel = 'Your project',
    blankNote = 'Next frame · unexposed',
    othersTitle = 'Other services',
    faqEyebrow = 'Before you ask',
    faqTitle = 'Questions',
    q1 = 'How much does it cost?',
    a1 = 'Most projects land between $3k and $15k. After a first call you get a fixed quote with scope, timeline and price, so there are no surprises later.',
    q2 = 'How long does it take?',
    a2 = 'A focused design sprint takes 1–2 weeks. A full product or SaaS platform usually takes four to eight weeks from brief to production code.',
    q3 = 'Can you work with my team?',
    a3 = 'Yes. I join your Slack, work in your Figma and your GitHub repository, and pair with your developers so the handover is clean, iterative, and frictionless.',
    emptyText = 'This service is on its way.',
    services = defaultServices,
    projects = defaultProjects,
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
  const lens = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm, 0.05);
  useMagnet(root, live);

  const rows = services || defaultServices;
  const row = (slug && rows.find((r) => r.slug === slug)) || rows[0] || {};
  const idx = Math.max(0, rows.findIndex((r) => r.slug === row.slug));
  const g = sdHex(row.f5, idx);
  const dl = listOf(row.f4);
  const nd = dl.length;
  const anim = live && !rm && !still;

  const [act, setAct] = useState(-1);
  const cur = anim ? act : nd - 1;

  useEffect(() => {
    if (!anim || !list.current || !root.current || nd === 0) return;
    const el = list.current,
      r = root.current;
    let vis = true;
    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: '20% 0px 20% 0px' }
    );
    io.observe(el);
    let top = 0,
      h = 1,
      vh = 1,
      tops = [],
      fresh = false,
      f = -1,
      last = -1,
      la = -2;
    const read = () => {
      if (!vis) {
        fresh = false;
        return;
      }
      const b = el.getBoundingClientRect();
      top = b.top;
      h = b.height || 1;
      vh = window.innerHeight || 1;
      tops = Array.from(el.querySelectorAll('.mvsd-step')).map(
        (s) => s.getBoundingClientRect().top + 30
      );
      fresh = true;
    };
    const off = onTick(() => {
      if (!fresh) return;
      const line = vh * 0.62;
      const t = clamp01((line - top) / h);
      if (f < 0) f = t;
      else {
        f += (t - f) * 0.14;
        if (Math.abs(t - f) < 0.0008) f = t;
      }
      if (Math.abs(f - last) > 0.0008) {
        last = f;
        r.style.setProperty('--fill', f.toFixed(4));
      }
      let a = -1;
      tops.forEach((y, i) => {
        if (y < line) a = i;
      });
      if (a !== la) {
        la = a;
        setAct(a);
      }
    }, read);
    return () => {
      off();
      io.disconnect();
    };
  }, [anim, nd, row.slug]);

  const words = String(row.f1 || '')
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((x) => x.length > 2 && !SD_STOP.has(x));
  let rel = (projects || defaultProjects)
    .filter((p) => {
      const hay = `${p.f3 || ''} ${p.f8 || ''}`.toLowerCase();
      return words.some((x) => hay.includes(x));
    })
    .slice(0, 3);
  if (rel.length === 0) rel = (projects || defaultProjects).slice(0, 2);

  const others = rows
    .map((r, i) => ({ r, i }))
    .filter((x) => x.r.slug !== row.slug);

  const im = RS(srcOf(photo, SD_PH[idx % 4]), phone ? '100vw' : '40vw');
  const eb = String(eyebrow || '')
    .replace(/\{n\}/g, sdPad(idx + 1))
    .replace(/\{total\}/g, sdPad(rows.length));

  const faq = [
    [q1, a1],
    [q2, a2],
    [q3, a3],
  ].filter(([q]) => q && q.trim());

  const book = pick(primaryLink, site.book || '#contact');
  const curName = cur >= 0 && cur < nd ? dl[cur] : dl[0] || '';

  if (!row || !row.f1) {
    return (
      <section
        ref={root}
        className="mv mv-sec mvsd"
        style={{ ...cssVars(c), ...B }}
      >
        <link rel="stylesheet" href={FONTS} />
        <style
          dangerouslySetInnerHTML={{
            __html: CSS_BASE + CSS_MOTION + CSS_SD,
          }}
        />
        <div className="mv-wrap mvsd-empty" style={M}>
          <h1 className="mv-sr">{emptyText}</h1>
          <p>{emptyText}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      className={`mv mv-sec mvsd${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-in' : ''}${anim ? ' is-anim' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        '--gc': g,
        ...(props.style || {}),
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_SD + siteFontCss(props),
        }}
      />
      <div className="mv-wrap mvsd-grid">
        <div className="mvsd-intro">
          <nav
            className="mvsd-crumb"
            aria-label="Breadcrumb"
            style={{ ...M, ...rise(on, 0, 10) }}
          >
            <a href={crumbLink || '/services'}>{crumbLabel}</a>
            <span aria-hidden>/</span>
            <span aria-current="page">{row.f1}</span>
          </nav>
          <Eyebrow text={eb} on={on} M={M} delay={60} />
          <Head
            text={row.f1}
            tag="h1"
            on={on}
            D={D}
            size={
              phone
                ? 'clamp(46px,13vw,64px)'
                : 'clamp(56px,6.2vw,96px)'
            }
            lh={0.92}
            delay={120}
            style={{ fontStretch: '116%', fontWeight: 780 }}
          />
          {row.f2 && (
            <p
              className="mvsd-lead"
              style={{ ...D, ...rise(on, 420, 14) }}
            >
              {row.f2}
            </p>
          )}
          {row.f3 && (
            <p className="mvsd-body" style={rise(on, 500, 14)}>
              {row.f3}
            </p>
          )}
          <div className="mvsd-btns" style={rise(on, 580, 12)}>
            {primary && (
              <Btn href={book} label={primary} kind="solid" />
            )}
            {secondary && (
              <Btn
                href={secondaryLink || '/services'}
                label={secondary}
                kind="ghost"
              />
            )}
          </div>
        </div>
        <div className="mvsd-objw" style={rise(on, 300, 20)}>
          <div ref={lens} className="mvsd-obj">
            <img
              src={im.src}
              srcSet={im.srcSet}
              sizes={im.sizes}
              alt={photoAlt || ''}
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <i className="mvsd-gel" aria-hidden />
            <i className="mvsd-key" aria-hidden />
            <span className="mvsd-hold" aria-hidden>
              <i />
              <i />
              <b />
            </span>
            <p className="mvsd-read" style={M} aria-hidden>
              <b />
              {stepLabel} {sdPad(Math.max(0, cur) + 1)} /{' '}
              {sdPad(nd)}
              {curName ? ` · ${curName}` : ''}
            </p>
            <p className="mvsd-tab" style={M} aria-hidden>
              {gelLabel} {sdPad(idx + 1)} · {g.toUpperCase()}
            </p>
            <i className="mvsd-bar" aria-hidden />
          </div>
        </div>
        {nd > 0 && (
          <div className="mvsd-steps">
            <div className="mvsd-sh">
              <Eyebrow text={stepsEyebrow} on={on} M={M} />
              <Head
                text={stepsTitle}
                on={on}
                D={D}
                size={
                  phone
                    ? 'clamp(36px,10vw,48px)'
                    : 'clamp(40px,4.3vw,64px)'
                }
                lh={0.95}
                delay={100}
                style={{ fontStretch: '115%', fontWeight: 760 }}
              />
              {stepsLead && (
                <p className="mvsd-sl">{stepsLead}</p>
              )}
            </div>
            <ol ref={list} className="mvsd-list">
              <i className="mvsd-rail" aria-hidden>
                <b />
              </i>
              {dl.map((d, i) => (
                <li
                  key={i}
                  className={`mvsd-step${i <= cur ? ' is-done' : ''}${i === cur ? ' is-cur' : ''}`}
                >
                  <span className="mvsd-no" style={M}>
                    {sdPad(i + 1)}
                  </span>
                  <span className="mvsd-tick" aria-hidden>
                    <svg viewBox="0 0 40 40">
                      <rect
                        x="3"
                        y="3"
                        width="34"
                        height="34"
                        rx="6"
                        pathLength={1}
                      />
                      <path
                        d="M10 21.5c2.6 2 4.6 4.3 6.4 7.2C19.8 20.6 24.6 14 31 8.5"
                        pathLength={1}
                      />
                    </svg>
                  </span>
                  <div className="mvsd-sc">
                    <h3 style={D}>
                      <span>{d}</span>
                    </h3>
                    <p style={M}>
                      <span className="mvsd-inc">
                        {includedLabel}
                      </span>
                      {showCode && (
                        <code>{`<${sdComp(d)} />`}</code>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      {(rel.length > 0 || others.length > 0) && (
        <div className="mv-dark mvsd-band">
          <div className="mv-wrap">
            {rel.length > 0 && (
              <>
                <div className="mvsd-bh">
                  <h2 style={D}>{projectsTitle}</h2>
                  {projectsLead && (
                    <p style={M}>{projectsLead}</p>
                  )}
                </div>
                <ul
                  className="mvsd-film mv-inring"
                  style={{
                    '--n': Math.min(
                      3,
                      rel.length +
                        (blankLabel && rel.length < 3
                          ? 1
                          : 0)
                    ),
                  }}
                >
                  {rel.map((p, k) => {
                    const pi = Math.max(
                      0,
                      projects.indexOf(p)
                    );
                    const pim = RS(
                      imgOr(p),
                      phone ? '90vw' : '30vw'
                    );
                    return (
                      <li key={p.slug || k}>
                        <a
                          href={`/work/${p.slug}`}
                          className="mvsd-fr"
                          aria-label={`${openLabel}: ${p.f1}`}
                        >
                          <span
                            className="mvsd-edge"
                            style={M}
                            aria-hidden
                          >
                            <span>SSB 400</span>
                            <span>
                              {sdPad(pi + 1)}A
                            </span>
                            <span>
                              ▸ {sdPad(pi + 2)}
                            </span>
                          </span>
                          <span className="mvsd-pic">
                            <img
                              src={pim.src}
                              srcSet={pim.srcSet}
                              sizes={pim.sizes}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                            />
                            <em style={M}>
                              {openLabel} ↗
                            </em>
                          </span>
                          <span className="mvsd-cap">
                            <b style={D}>{p.f1}</b>
                            <span style={M}>
                              {[p.f2, p.f4]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                  {blankLabel &&
                    Array.from(
                      { length: rel.length < 3 ? 1 : 0 },
                      (_, k) => (
                        <li
                          key={'b' + k}
                          className="mvsd-blank"
                        >
                          <a
                            href={book}
                            className="mvsd-fr"
                          >
                            <span
                              className="mvsd-edge"
                              style={M}
                              aria-hidden
                            >
                              <span>SSB 400</span>
                              <span>
                                {sdPad(
                                  projects.length +
                                    k +
                                    1
                                )}
                                A
                              </span>
                              <span>
                                ▸{' '}
                                {sdPad(
                                  projects.length +
                                    k +
                                    2
                                )}
                              </span>
                            </span>
                            <span className="mvsd-pic mvsd-unexp">
                              <i aria-hidden />
                              <em style={M}>
                                {primary ||
                                  blankLabel}{' '}
                                ↗
                              </em>
                            </span>
                            <span className="mvsd-cap">
                              <b style={D}>
                                {blankLabel}
                              </b>
                              <span style={M}>
                                {blankNote}
                              </span>
                            </span>
                          </a>
                        </li>
                      )
                    )}
                </ul>
              </>
            )}
            {others.length > 0 && (
              <>
                <div className="mvsd-bh mvsd-bh2">
                  <h2 style={D}>{othersTitle}</h2>
                </div>
                <ul className="mvsd-others">
                  {others.map(({ r, i }) => (
                    <li
                      key={r.slug || i}
                      style={{
                        '--oc': sdHex(r.f5, i),
                      }}
                    >
                      <a href={`/services/${r.slug || i}`}>
                        <span
                          className="mvsd-sw"
                          aria-hidden
                        >
                          <i />
                          <i />
                        </span>
                        <span
                          className="mvsd-on"
                          style={M}
                        >
                          {gelLabel} {sdPad(i + 1)}
                        </span>
                        <b style={D}>{r.f1}</b>
                        <span
                          className="mvsd-oa"
                          aria-hidden
                        >
                          <IcoArrow s={16} />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
      {faq.length > 0 && (
        <div className="mv-wrap mvsd-faq">
          <div className="mvsd-fh">
            <Eyebrow text={faqEyebrow} on={on} M={M} />
            <h2 style={D}>{faqTitle}</h2>
          </div>
          <ul className="mvsd-cards">
            {faq.map(([q, a], i) => (
              <li key={i} className="mvsd-card">
                <p className="mvsd-q" style={M}>
                  Q.{sdPad(i + 1)}
                </p>
                <h3 style={D}>{q}</h3>
                {a && <p className="mvsd-a">{a}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

const CSS_SD = `
.mvsd{--fill:1;background:var(--mv-bone);color:var(--mv-ink);padding:clamp(120px,11vw,168px) 0 0}
.mvsd.is-anim{--fill:0}
.mvsd .mv-it{display:inline-block;font-weight:inherit;color:var(--mv-ink);line-height:1.02;padding:0 .07em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .72s steps(8) var(--pd,600ms)} .mvsd .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvsd-empty{padding:80px 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.mvsd-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);grid-template-areas:"intro obj" "steps obj";column-gap:clamp(40px,6vw,120px);align-items:start}
.mvsd-intro{grid-area:intro;display:flex;flex-direction:column;align-items:flex-start;gap:24px;padding-bottom:clamp(72px,8vw,128px)}
.mvsd-crumb{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)} .mvsd-crumb a{text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--mv-ink) 30%,transparent)} .mvsd-crumb a:hover{color:var(--mv-ink);border-color:var(--mv-ink)} .mvsd-crumb [aria-current]{color:var(--mv-ink)}
.mvsd-lead{margin:6px 0 0;max-width:24ch;font-size:clamp(24px,2.1vw,32px);line-height:1.12;letter-spacing:-.03em;font-stretch:110%;font-weight:600}
.mvsd-body{margin:0;max-width:54ch;font-size:18px;line-height:1.55;color:var(--mv-mut)}
.mvsd-btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
/* the object: sticky gel in its holder over a B&W still */
.mvsd-objw{grid-area:obj;position:sticky;top:max(104px,calc(50vh - min(38vh,340px)));padding-top:6px}
.mvsd-obj{position:relative;height:min(76vh,680px);border-radius:4px;overflow:hidden;isolation:isolate;background:color-mix(in srgb,var(--mv-ink) 14%,var(--mv-bone));perspective:900px}
.mvsd-obj img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.12) brightness(1.05);scale:1.08;translate:0 calc((var(--fill) - .5)*-3%);transition:scale 1.4s cubic-bezier(.2,.8,.2,1)}
.mvsd-gel{position:absolute;inset:0;z-index:1;background:var(--gc);mix-blend-mode:multiply;opacity:.9;box-shadow:inset 0 0 0 10px color-mix(in srgb,var(--mv-ink) 92%,transparent),inset 0 0 0 11px rgba(255,255,255,.22);translate:-104% 0;transform-origin:50% 100%;transition:translate 1.5s cubic-bezier(.7,0,.2,1) .35s,transform .7s cubic-bezier(.2,.8,.2,1),opacity .5s,filter .5s}
.mvsd.is-in .mvsd-gel{translate:0 0}
.mvsd-key{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(60% 50% at 76% 14%,rgba(255,241,218,.7),rgba(255,226,180,0) 70%);mix-blend-mode:screen;opacity:.4;transition:opacity .6s}
.mvsd-obj:hover .mvsd-gel{transform:rotateX(8deg) rotate(-1.5deg) translateY(-2.5%) scale(.975);opacity:.64;filter:saturate(1.25) brightness(1.12)} .mvsd-obj:hover .mvsd-key{opacity:1} .mvsd-obj:hover img{scale:1.12}
.mvsd-hold{position:absolute;inset:0;z-index:3;pointer-events:none;translate:-104% 0;transition:translate 1.5s cubic-bezier(.7,0,.2,1) .35s} .mvsd.is-in .mvsd-hold{translate:0 0}
.mvsd-hold i{position:absolute;top:-2px;width:30px;height:14px;border-radius:0 0 5px 5px;background:var(--mv-ink)} .mvsd-hold i:nth-child(1){left:24%} .mvsd-hold i:nth-child(2){right:24%}
.mvsd-hold b{position:absolute;right:-1px;top:50%;width:12px;height:64px;translate:0 -50%;border-radius:4px 0 0 4px;background:var(--mv-ink)}
.mvsd-read{position:absolute;z-index:4;left:20px;top:22px;right:20px;margin:0;display:flex;align-items:center;gap:8px;width:max-content;max-width:calc(100% - 40px);padding:6px 10px;border-radius:6px;background:color-mix(in srgb,var(--mv-bone) 92%,transparent);color:var(--mv-ink);font-size:12px;letter-spacing:.1em;text-transform:uppercase;white-space:normal;line-height:1.35;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)} .mvsd-read b{flex:none;width:10px;height:10px;border-radius:2px;background:var(--gc);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 30%,transparent)}
.mvsd-tab{position:absolute;z-index:4;left:20px;bottom:24px;margin:0;padding:4px 8px;border-radius:4px;background:var(--mv-ink);color:var(--mv-cloud);font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.mvsd-bar{position:absolute;z-index:4;left:10px;right:10px;bottom:10px;height:3px;background:color-mix(in srgb,var(--mv-cloud) 30%,transparent)} .mvsd-bar::after{content:"";position:absolute;inset:0;background:var(--mv-cloud);transform-origin:0 50%;transform:scaleX(var(--fill))}
/* what you get */
.mvsd-steps{grid-area:steps;padding-bottom:clamp(96px,10vw,160px)}
.mvsd-sh{display:flex;flex-direction:column;align-items:flex-start;gap:22px;margin-bottom:clamp(36px,4vw,56px)}
.mvsd-sl{margin:0;max-width:50ch;font-size:17px;line-height:1.55;color:var(--mv-mut)}
.mvsd-list{position:relative;list-style:none;margin:0;padding:0 0 0 0;border-top:1px solid var(--mv-fog)}
.mvsd-rail{position:absolute;left:19px;top:0;bottom:0;width:2px;background:var(--mv-fog)} .mvsd-rail b{position:absolute;inset:0;background:var(--mv-ink);transform-origin:50% 0;transform:scaleY(var(--fill))}
.mvsd-step{position:relative;display:grid;grid-template-columns:40px 56px minmax(0,1fr);align-items:center;column-gap:18px;padding:clamp(24px,2.6vw,34px) 0;border-bottom:1px solid var(--mv-fog)}
.mvsd-tick{grid-column:1;grid-row:1;position:relative;z-index:1;display:block;width:40px;height:40px;border-radius:8px;background:var(--mv-bone)}
.mvsd-tick svg{width:40px;height:40px;overflow:visible} .mvsd-tick rect{fill:none;stroke:color-mix(in srgb,var(--mv-ink) 30%,transparent);stroke-width:1.5;transition:fill .4s,stroke .4s}
.mvsd-tick path{fill:none;stroke:var(--mv-ink);stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .55s cubic-bezier(.65,0,.35,1) .1s}
.mvsd-step.is-done .mvsd-tick rect{fill:var(--mv-brass);stroke:var(--mv-ink)} .mvsd-step.is-done .mvsd-tick path{stroke-dashoffset:0}
.mvsd-no{grid-column:2;grid-row:1;font-size:12px;letter-spacing:.1em;color:var(--mv-mut)}
.mvsd-sc{grid-column:3;grid-row:1;min-width:0}
.mvsd-sc h3{margin:0;font-size:clamp(26px,2.4vw,36px);line-height:1.05;letter-spacing:-.035em;font-stretch:112%;font-weight:700;opacity:.78;transition:opacity .5s}
.mvsd-sc h3 span{padding:0 .06em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .45s steps(6);box-decoration-break:clone;-webkit-box-decoration-break:clone}
.mvsd-step.is-done h3{opacity:1} .mvsd:not(.is-anim) .mvsd-sc h3{opacity:1}
.mvsd-step:hover h3 span{background-size:100% 100%}
.mvsd-sc p{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:10px 0 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut)}
.mvsd-inc{padding:3px 7px;border-radius:4px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 18%,transparent)}
.mvsd-sc code{font:inherit;text-transform:none;letter-spacing:0;font-size:12.5px;color:var(--mv-ink);opacity:.72}
/* night band: projects as film frames + other services as gels */
.mvsd-band{position:relative;background:var(--mv-night);color:var(--mv-cloud);padding:clamp(88px,9vw,140px) 0}
.mvsd-bh{display:flex;align-items:baseline;justify-content:space-between;gap:24px;margin-bottom:clamp(28px,3vw,44px);padding-bottom:18px;border-bottom:1px solid color-mix(in srgb,var(--mv-cloud) 14%,transparent)}
.mvsd-bh h2{margin:0;font-size:clamp(34px,3.4vw,52px);line-height:1;letter-spacing:-.04em;font-stretch:114%;font-weight:740} .mvsd-bh p{margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvsd-bh2{margin-top:clamp(72px,8vw,120px)}
.mvsd-film{display:grid;grid-template-columns:repeat(var(--n,3),minmax(0,1fr));gap:0;list-style:none;margin:0;padding:0;background:#0A0A0B;border-radius:4px;overflow:hidden}
.mvsd-film li{position:relative}
.mvsd-fr{position:relative;display:flex;flex-direction:column;gap:12px;padding:30px 14px 36px;text-decoration:none;color:var(--mv-cloud);background:radial-gradient(circle at 50% 50%,#000 0 3.2px,transparent 3.6px) 0 9px/18px 12px repeat-x,radial-gradient(circle at 50% 50%,#000 0 3.2px,transparent 3.6px) 0 calc(100% - 9px)/18px 12px repeat-x,#1B1714;border-right:1px solid #000}
.mvsd-fr::before,.mvsd-fr::after{content:"";position:absolute;left:0;right:0;height:12px;background:repeating-linear-gradient(90deg,transparent 0 5px,#2C2621 5px 13px,transparent 13px 18px);top:9px;opacity:.9} .mvsd-fr::after{top:auto;bottom:9px}
.mvsd-edge{display:flex;justify-content:space-between;font-size:12px;letter-spacing:.14em;color:#F08A3C;opacity:.85;padding:0 4px}
.mvsd-pic{position:relative;display:block;aspect-ratio:4/3;border-radius:3px;overflow:hidden;background:#000}
.mvsd-pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.82) saturate(.9);transition:filter .6s,scale 1s cubic-bezier(.2,.8,.2,1)}
.mvsd-pic em{position:absolute;right:10px;bottom:10px;padding:5px 9px;border-radius:6px;background:var(--mv-brass);color:var(--mv-ink);font-style:normal;font-size:12px;letter-spacing:.1em;text-transform:uppercase;opacity:0;translate:0 6px;transition:opacity .35s,translate .45s cubic-bezier(.2,.8,.2,1)}
.mvsd-fr:hover .mvsd-pic img,.mvsd-fr:focus-visible .mvsd-pic img{filter:brightness(1.02) saturate(1.05);scale:1.05} .mvsd-fr:hover .mvsd-pic em,.mvsd-fr:focus-visible .mvsd-pic em{opacity:1;translate:0 0}
.mvsd-unexp{background:radial-gradient(90% 70% at 30% 20%,rgba(255,226,180,.22),transparent 60%),linear-gradient(160deg,#2A2320,#120F0D)} .mvsd-unexp i{position:absolute;inset:18% 22%;border:1.5px dashed color-mix(in srgb,var(--mv-cloud) 26%,transparent);border-radius:4px} .mvsd-unexp em{opacity:1;translate:0 0;background:transparent;color:var(--mv-cloud);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 40%,transparent)}
.mvsd-blank .mvsd-fr:hover .mvsd-unexp em,.mvsd-blank .mvsd-fr:focus-visible .mvsd-unexp em{background:var(--mv-brass);color:var(--mv-ink);box-shadow:none}
.mvsd-cap{display:flex;flex-direction:column;gap:5px;padding:0 4px} .mvsd-cap b{font-size:24px;line-height:1.05;letter-spacing:-.03em;font-stretch:112%;font-weight:700} .mvsd-cap span{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvsd-others{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,1.6vw,24px);list-style:none;margin:0;padding:0}
.mvsd-others a{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto;column-gap:18px;row-gap:4px;align-items:center;padding:18px;border-radius:10px;text-decoration:none;color:var(--mv-cloud);background:color-mix(in srgb,var(--mv-cloud) 5%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 14%,transparent);transition:background .35s}
.mvsd-sw{grid-row:1/3;position:relative;width:62px;height:74px}
.mvsd-sw i{position:absolute;inset:0;border-radius:3px} .mvsd-sw i:first-child{background:linear-gradient(135deg,#8a8a8a,#3a3a3a);inset:8px 0 0 8px}
.mvsd-sw i:last-child{inset:0 8px 8px 0;background:color-mix(in srgb,var(--oc) 86%,transparent);mix-blend-mode:screen;box-shadow:inset 0 0 0 4px #0B0B0C;transition:translate .5s cubic-bezier(.34,1.56,.64,1),rotate .5s cubic-bezier(.34,1.56,.64,1)}
.mvsd-on{grid-column:2;grid-row:1;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvsd-others b{grid-column:2;grid-row:2;font-size:clamp(20px,1.7vw,26px);line-height:1.08;letter-spacing:-.03em;font-stretch:112%;font-weight:700}
.mvsd-oa{grid-column:3;grid-row:1/3;display:grid;place-items:center;width:40px;height:40px;border-radius:8px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 22%,transparent);transition:background .35s,color .35s} .mvsd-oa svg{transition:rotate .45s cubic-bezier(.34,1.56,.64,1)}
.mvsd-others a:hover,.mvsd-others a:focus-visible{background:color-mix(in srgb,var(--mv-cloud) 10%,transparent)} .mvsd-others a:hover .mvsd-sw i:last-child,.mvsd-others a:focus-visible .mvsd-sw i:last-child{translate:4px -6px;rotate:-5deg}
.mvsd-others a:hover .mvsd-oa,.mvsd-others a:focus-visible .mvsd-oa{background:var(--oc);color:var(--mv-ink);box-shadow:none} .mvsd-others a:hover .mvsd-oa svg{rotate:-45deg}
/* questions as index cards */
.mvsd-faq{padding-top:clamp(88px,9vw,140px);padding-bottom:clamp(96px,10vw,160px)}
.mvsd-fh{display:flex;flex-direction:column;align-items:flex-start;gap:20px;margin-bottom:clamp(32px,4vw,52px)} .mvsd-fh h2{margin:0;font-size:clamp(40px,4.3vw,64px);line-height:.95;letter-spacing:-.042em;font-stretch:115%;font-weight:760}
.mvsd-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,2vw,28px);list-style:none;margin:0;padding:0}
.mvsd-card{position:relative;padding:26px 26px 30px;border-radius:10px;background:color-mix(in srgb,var(--mv-cloud) 70%,var(--mv-bone));box-shadow:0 1px 0 var(--mv-fog),inset 0 0 0 1px var(--mv-fog);transition:translate .45s cubic-bezier(.34,1.56,.64,1),rotate .45s cubic-bezier(.34,1.56,.64,1),box-shadow .4s}
.mvsd-card:nth-child(1){rotate:-.6deg} .mvsd-card:nth-child(3){rotate:.5deg}
.mvsd-card:hover{translate:0 -6px;rotate:0deg;box-shadow:0 22px 36px -24px rgba(0,0,0,.35),inset 0 0 0 1px var(--mv-fog)}
.mvsd-q{position:relative;margin:0 0 22px;padding-bottom:12px;font-size:12px;letter-spacing:.12em;color:var(--mv-mut)}
.mvsd-q::after{content:"";position:absolute;left:-26px;right:-26px;bottom:0;height:2px;background:var(--mv-brass)}
.mvsd-card{overflow:hidden} .mvsd-card h3{margin:0 0 12px;font-size:24px;line-height:1.1;letter-spacing:-.03em;font-stretch:110%;font-weight:700}
.mvsd-a{margin:0;font-size:16px;line-height:1.6;color:color-mix(in srgb,var(--mv-ink) 80%,transparent)}
/* tablet */
.mvsd.is-tab .mvsd-grid{grid-template-columns:minmax(0,1fr) minmax(0,.8fr);column-gap:40px} .mvsd.is-tab .mvsd-obj{height:min(60vh,520px)}
.mvsd.is-tab .mvsd-cap b{font-size:20px} .mvsd.is-tab .mvsd-others{grid-template-columns:minmax(0,1fr)} .mvsd.is-tab .mvsd-cards{grid-template-columns:minmax(0,1fr)}
/* phone: object after the intro, no sticky */
.mvsd.is-ph{padding-top:112px}
.mvsd.is-ph .mvsd-grid{grid-template-columns:minmax(0,1fr);grid-template-areas:"intro" "obj" "steps"}
.mvsd.is-ph .mvsd-intro{padding-bottom:40px;gap:20px} .mvsd.is-ph .mvsd-lead{font-size:23px} .mvsd.is-ph .mvsd-body{font-size:17px}
.mvsd.is-ph .mvsd-btns{flex-direction:column;align-items:stretch;width:100%} .mvsd.is-ph .mvsd-btns .mv-btn{width:100%}
.mvsd.is-ph .mvsd-objw{position:relative;top:auto;margin-bottom:64px} .mvsd.is-ph .mvsd-obj{height:auto;aspect-ratio:4/5}
.mvsd.is-ph .mvsd-read{left:16px;top:16px;font-size:12px} .mvsd.is-ph .mvsd-tab{left:16px;bottom:22px}
.mvsd.is-ph .mvsd-step{grid-template-columns:40px minmax(0,1fr);column-gap:16px} .mvsd.is-ph .mvsd-no{display:none} .mvsd.is-ph .mvsd-sc{grid-column:2} .mvsd.is-ph .mvsd-sc h3{font-size:26px}
.mvsd.is-ph .mvsd-bh{flex-direction:column;align-items:flex-start;gap:10px}
`;
