'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  FONTS,
  MAXW,
  RS,
  srcOf,
  useFonts,
  useStill,
  useLive,
  useSize,
  useReduced,
  onTick,
  clamp01,
  colorsOf,
  cssVars,
  siteFontCss,
  fontsOf,
  Btn,
  useMagnet,
  CSS_BASE,
  CSS_MOTION,
  useScrollVars,
  useOn,
  Head,
  Eyebrow,
  rise,
  listOf,
  pick,
} from './scaffold';
import {
  siteData,
  defaultAboutMoments,
  defaultAboutRules,
  defaultCurrently,
  defaultBandCaps,
} from './siteData';

// Constants for The Portrait Session
const MVAB_PORTRAIT =
  siteData.templatePortrait ||
  'https://framerusercontent.com/images/eVAFXhLhhVnioLmPGlg8sXKpA.webp';
const MVAB_AR = 1500 / 2045;
const MVAB_FILM = '#0E0D0C';
const MVAB_EDGE = '#F2923A';

const MVAB_STORY = [
  'https://framerusercontent.com/images/NvLO0PQlhNEwe9xWtvBijcoaQ.webp',
  'https://framerusercontent.com/images/Mwv6ySf9IuxC0Hmo73cSSwfXyX8.webp',
  'https://framerusercontent.com/images/Ggd9vwOGl8CgHM2nQ5WIwCrIyho.webp',
  'https://framerusercontent.com/images/IIITSxUPaHdtRoV1AzVoxzjaY0.webp',
  'https://framerusercontent.com/images/9jI95ma8pfDzFKbDFbckYGg9y4k.webp',
  'https://framerusercontent.com/images/YmJpQL1jG8ThItAouogebliWLjQ.webp',
];

const MVAB_BAND = [
  '/figma_design_system.jpg',
  '/designer_workspace.jpg',
  '/product_prototype.jpg',
];

const MVAB_RINGS = [
  'M30 60C20 34 58 12 110 10c52-2 84 20 80 48-4 30-54 44-102 40C40 94 8 80 12 52 16 28 60 14 98 16',
  'M168 22C140 8 70 6 36 22 8 36 4 72 34 90c32 18 104 16 136-4 28-18 26-56-6-70-26-12-80-10-110 0',
  'M40 18c40-12 110-10 140 8 22 14 18 52-10 68-34 20-110 20-142 0C6 78 8 42 34 26c30-18 96-20 128-8',
];

const MVAB_ICONS = [
  [
    'M16 20 7 32l9 12',
    'M48 20l9 12-9 12',
    'M32 12l8 17-8 21-8-21z',
    'M32 29v7',
    'M29.5 36.5h5',
  ],
  ['M8 50h13V38h12V26h13V14', 'M41 13.5h8.5V22', 'M49 14 38 25', 'M8 56h48'],
  [
    'M12 14h40c3 0 5 2 5 5v20c0 3-2 5-5 5H31l-11 10v-10h-8c-3 0-5-2-5-5V19c0-3 2-5 5-5z',
    'M21 29h1M31.5 29h1M42 29h1',
  ],
];

const parseMoments = (s) =>
  listOf(s).map((x) => {
    const i = x.indexOf('|');
    return i < 0
      ? { y: '', t: x }
      : { y: x.slice(0, i).trim(), t: x.slice(i + 1).trim() };
  });

const pairsOf = (s) =>
  listOf(s).map((x) => {
    const i = x.indexOf('|');
    return i < 0
      ? { k: '', v: x }
      : { k: x.slice(0, i).trim(), v: x.slice(i + 1).trim() };
  });

export default function MvAbout(props = {}) {
  const {
    eyebrow = 'FRAME 00 — About',
    heading = 'Designer by trade,|developer by *habit*.',
    lead = `I'm ${siteData.name}, a Senior Product Designer & UI Architect who writes production code. For ${siteData.years} years I've taken products from a messy first brief to releases thousands use every day — without the usual gap between design and engineering.`,
    facts = `Based in ${siteData.city};${siteData.years} years in product;Design systems + Next.js`,
    primary = 'Start a project',
    primaryLink = siteData.book || '/contact',
    secondary = 'View résumé',
    secondaryLink = '/resume',
    portrait = siteData.portrait || MVAB_PORTRAIT,
    portraitAlt = `Portrait of ${siteData.name}`,
    backdrop = '#D6C5B2',
    cardLabel = 'Backdrop · Studio Light · Take 01',
    meter = 'f/2.8 · 1/125 · ISO 100',

    storyEyebrow = 'FRAME 01 — The story',
    storyHeading = 'The story,|*frame* by frame.',
    sheetLabel = 'Contact print · Roll 01',
    filmEdge = 'MV 400TX',
    moments = defaultAboutMoments,
    storyPhotos,
    howEyebrow = 'FRAME 02 — How I work',
    howHeading = 'Three rules|I *keep*.',
    p1Title = defaultAboutRules[0].title,
    p1Body = defaultAboutRules[0].body,
    p2Title = defaultAboutRules[1].title,
    p2Body = defaultAboutRules[1].body,
    p3Title = defaultAboutRules[2].title,
    p3Body = defaultAboutRules[2].body,
    bandEyebrow = 'FRAME 03 — Off set',
    band1,
    band2,
    band3,
    bandCaps = defaultBandCaps,
    curTitle = 'Currently',
    curDate = 'Updated 2026',
    curRows = defaultCurrently,
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
  const top = useRef(null);
  const story = useRef(null);
  const how = useRef(null);
  const band = useRef(null);
  const card = useRef(null);
  const sheet = useRef(null);

  const { w } = useSize(root, bpHint);
  const phone = w < 810;
  const tab = w >= 810 && w < 1100;
  const desk = w >= 1100;

  const on = useOn(top, live, rm);
  const onS = useOn(story, live, rm, 0.1);
  const onH = useOn(how, live, rm);
  const onB = useOn(band, live, rm);
  useMagnet(root, live);

  const final = still || rm || !live;
  const pin = desk && live && !rm && !still;

  const fill = (s) =>
    String(s || '')
      .replace(/\{name\}/g, site.name)
      .replace(/\{years\}/g, site.years || '')
      .replace(/\{city\}/g, site.city || '')
      .replace(/\s+/g, ' ')
      .trim();

  const MOM = parseMoments(moments);
  const n = MOM.length;
  const photos = MOM.map((_, i) =>
    srcOf(
      Array.isArray(storyPhotos) ? storyPhotos[i] : null,
      MVAB_STORY[i % MVAB_STORY.length]
    )
  );

  // (2) The contact print: pp -> which moment is circled
  const [act, setAct] = useState(final || !pin ? Math.max(0, n - 1) : 0);
  const actRef = useRef(act);
  actRef.current = act;

  useEffect(() => {
    if (!pin) setAct(Math.max(0, n - 1));
  }, [pin, n]);

  const lastK = useRef([]);
  useScrollVars(story, pin, rm, (_sp, pp) => {
    const sh = sheet.current;
    if (!sh || !n) return;
    const u = clamp01((pp - 0.05) / 0.82) * n;
    const fr = sh.querySelectorAll('.mvab-fr');
    fr.forEach((el, i) => {
      const k = clamp01((u - i) * 1.5);
      if (Math.abs((lastK.current[i] ?? -1) - k) > 0.002) {
        lastK.current[i] = k;
        el.style.setProperty('--k', k.toFixed(3));
        el.classList.toggle('is-c', k > 0.02);
      }
    });
    const a = Math.min(n - 1, Math.floor(u));
    if (a !== actRef.current) {
      actRef.current = a;
      setAct(a);
    }
    if (story.current)
      story.current.style.setProperty(
        '--u',
        (u / Math.max(1, n)).toFixed(4)
      );
  });

  // Not pinned (phone / tablet): each frame circled as it enters viewport
  useEffect(() => {
    const sh = sheet.current;
    if (!sh || pin) return;
    const fr = Array.from(sh.querySelectorAll('.mvab-fr'));
    if (final) {
      fr.forEach((el) => el.classList.add('is-c'));
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            e.target.classList.add('is-c');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -22% 0px', threshold: 0.4 }
    );
    fr.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pin, final, n, w]);

  const jump = (i) => {
    const el = story.current;
    if (!pin || !el) {
      setAct(i);
      return;
    }
    const r = el.getBoundingClientRect();
    const pp = 0.05 + ((i + 0.72) / n) * 0.82;
    const y =
      r.top + window.scrollY + pp * (el.offsetHeight - window.innerHeight);
    const L = window.__ltLenis;
    if (L && L.scrollTo) L.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // (1) Key light over the portrait card
  const [lit, setLit] = useState(false);
  const light = (e) => {
    const el = card.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const x = clamp01((e.clientX - r.left) / r.width);
    const y = clamp01((e.clientY - r.top) / r.height);
    el.style.setProperty('--lx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--ly', `${(y * 100).toFixed(1)}%`);
    el.style.setProperty('--sx', `${((0.5 - x) * 56).toFixed(1)}px`);
    el.style.setProperty('--sy', `${(8 + (0.4 - y) * 14).toFixed(1)}px`);
    const pl = 0.5 - (0.94 * MVAB_AR * r.height) / r.width / 2;
    const pw = (0.94 * MVAB_AR * r.height) / r.width;
    el.style.setProperty('--kx', `${(((x - pl) / pw) * 100).toFixed(1)}%`);
    el.style.setProperty(
      '--ky',
      `${(((y - 0.06) / 0.94) * 100).toFixed(1)}%`
    );
  };

  const pSrc = srcOf(portrait, MVAB_PORTRAIT);
  const leadT = fill(pick(lead, ''));
  const factL = listOf(fill(facts));
  const book = pick(primaryLink, site.book || '/contact');
  const resume = pick(secondaryLink, '/resume');

  const P = [
    [p1Title, p1Body],
    [p2Title, p2Body],
    [p3Title, p3Body],
  ].filter((x) => x[0]);

  const caps = listOf(bandCaps);
  const bandImgs = [
    srcOf(band1, MVAB_BAND[0]),
    srcOf(band2, MVAB_BAND[1]),
    srcOf(band3, MVAB_BAND[2]),
  ];

  const cur = pairsOf(curRows);
  const dfw = props.customFonts ? D.fontWeight : 760;
  const m = MOM[Math.min(act, n - 1)] || { y: '', t: '' };
  const strips = [];
  const per = phone ? 2 : 3;
  for (let i = 0; i < n; i += per) {
    strips.push(
      Array.from({ length: Math.min(per, n - i) }, (_, k) => i + k)
    );
  }

  return (
    <section
      ref={root}
      id="about"
      className={`mv mv-sec mvab${pin ? ' is-pin' : ' is-flat'}${phone ? ' is-ph' : tab ? ' is-tab' : ''}${final ? ' is-final' : ''}${lit ? ' is-lit' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        '--bd': backdrop || '#D6C5B2',
        '--pimg': `url("${pSrc}")`,
        ...(props.style || {}),
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_MVAB + siteFontCss(props),
        }}
      />
      {/* (1) paper: h1 + portrait on the backdrop card */}
      <div ref={top} className="mvab-top">
        <div className="mv-wrap mvab-hero">
          <div className="mvab-copy">
            <Eyebrow text={eyebrow} on={on} M={M} />
            <Head
              tag="h1"
              text={heading}
              on={on}
              D={D}
              size="clamp(46px,5.6vw,92px)"
              lh={0.93}
              delay={120}
              step={60}
              className="mvab-h1"
              style={{ fontWeight: dfw }}
            />
            {leadT && (
              <p className="mvab-lead" style={rise(on, 520, 16)}>
                {leadT}
              </p>
            )}
            {factL.length > 0 && (
              <ul className="mvab-facts" style={M}>
                {factL.map((f, i) => (
                  <li key={i} style={rise(on, 640 + i * 80, 12)}>
                    <b aria-hidden>{String(i + 1).padStart(2, '0')}</b>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <div className="mvab-btns" style={rise(on, 860, 12)}>
              {primary && (
                <Btn href={book} label={primary} kind="solid" />
              )}
              {secondary && (
                <Btn
                  href={resume}
                  label={secondary}
                  kind="ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              )}
            </div>
          </div>
          <figure className="mvab-fig" style={rise(on, 220, 28)}>
            <div
              ref={card}
              className="mvab-card"
              onPointerMove={light}
              onPointerEnter={(e) => {
                if (e.pointerType !== 'touch') setLit(true);
              }}
              onPointerLeave={() => setLit(false)}
            >
              <i className="mvab-cyc" aria-hidden />
              <i className="mvab-pool" aria-hidden />
              <div className="mvab-person">
                <i className="mvab-shadow" aria-hidden />
                <img
                  src={
                    pSrc.includes('framerusercontent')
                      ? `${pSrc}?scale-down-to=1024`
                      : pSrc
                  }
                  alt={portraitAlt || `Portrait of ${site.name}`}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
                <i className="mvab-rim" aria-hidden />
              </div>
              <i className="mvab-grain" aria-hidden />
              <i className="mvab-lamp" aria-hidden />
              {cardLabel && (
                <span className="mvab-lb mvab-lb1" style={M}>
                  <i aria-hidden />
                  {cardLabel}
                </span>
              )}
              {meter && (
                <span className="mvab-lb mvab-lb2" style={M}>
                  {meter}
                </span>
              )}

            </div>
          </figure>
        </div>
      </div>

      {/* (2) night: the contact print */}
      <div className="mvab-dk mv-dark">
        <div ref={story} className="mvab-story">
          <div className="mvab-stick">
            <div className="mv-wrap mvab-sgrid">
              <div className="mvab-side">
                <Eyebrow text={storyEyebrow} on={onS} M={M} />
                <Head
                  text={storyHeading}
                  on={onS}
                  D={D}
                  size="clamp(40px,4.3vw,64px)"
                  lh={0.95}
                  delay={100}
                  style={{ fontWeight: dfw }}
                />
                {pin && n > 0 && (
                  <div className="mvab-read" aria-live="polite">
                    <p key={`y${act}`} className="mvab-ry" style={D}>
                      {m.y}
                    </p>
                    <p key={`t${act}`} className="mvab-rt" style={D}>
                      {m.t}
                    </p>
                    <p className="mvab-rc" style={M}>
                      <b>{String(act + 1).padStart(2, '0')}</b> /{' '}
                      {String(n).padStart(2, '0')}
                      <i aria-hidden>
                        <i />
                      </i>
                    </p>
                  </div>
                )}
              </div>
              <div className="mvab-paper" style={rise(onS, 200, 24)}>
                <p className="mvab-pl" style={M}>
                  <span>{sheetLabel}</span>
                  <span>
                    {n} {n === 1 ? 'frame' : 'frames'}
                  </span>
                </p>
                <div ref={sheet} className="mvab-sheet">
                  {strips.map((row, si) => (
                    <div key={si} className="mvab-strip">
                      <div className="mvab-film">
                        <span className="mvab-holes" aria-hidden>
                          {Array.from({ length: 18 }, (_, j) => (
                            <b key={j} />
                          ))}
                        </span>
                        <div
                          className="mvab-frames"
                          style={{ '--per': per }}
                        >
                          {row.map((i) => (
                            <button
                              key={i}
                              type="button"
                              className={`mvab-fr${i === act && pin ? ' is-a' : ''}`}
                              style={{ '--k': final ? 1 : 0 }}
                              onClick={() => jump(i)}
                              aria-label={`${MOM[i].y} — ${MOM[i].t}`}
                            >
                              <span className="mvab-ph">
                                <img
                                  {...RS(
                                    photos[i],
                                    phone ? '45vw' : '18vw'
                                  )}
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                  draggable={false}
                                />
                              </span>
                              <span className="mvab-en" style={M} aria-hidden>
                                {`${i + 1}`}
                                <i>▸</i>
                                {`${i + 1}A`}
                              </span>
                              <svg
                                className="mvab-ring"
                                viewBox="0 0 200 108"
                                preserveAspectRatio="none"
                                aria-hidden
                              >
                                <path
                                  d={MVAB_RINGS[i % MVAB_RINGS.length]}
                                  pathLength={1}
                                />
                              </svg>
                            </button>
                          ))}
                        </div>
                        <span className="mvab-holes" aria-hidden>
                          {Array.from({ length: 18 }, (_, j) => (
                            <b key={j} />
                          ))}
                        </span>
                        <span className="mvab-edge" style={M} aria-hidden>
                          {filmEdge} · {String(si + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <ol className="mvab-caps" style={{ '--per': per }}>
                        {row.map((i) => (
                          <li
                            key={i}
                            className={i === act && pin ? 'is-a' : ''}
                          >
                            <b style={M}>{MOM[i].y}</b>
                            <span>{MOM[i].t}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* (3) how I work */}
        {P.length > 0 && (
          <div ref={how} className="mv-wrap mvab-how">
            <div className="mvab-hh">
              <Eyebrow text={howEyebrow} on={onH} M={M} />
              <Head
                text={howHeading}
                on={onH}
                D={D}
                size="clamp(40px,4.3vw,64px)"
                lh={0.95}
                delay={100}
                style={{ fontWeight: dfw }}
              />
            </div>
            <ol className={`mvab-pr${onH ? ' is-on' : ''}`}>
              {P.map((p, i) => (
                <li key={i} style={rise(onH, 240 + i * 120, 20)}>
                  <svg
                    className="mvab-ico"
                    viewBox="0 0 64 64"
                    aria-hidden
                  >
                    {MVAB_ICONS[i % 3].map((d, j) => (
                      <path
                        key={j}
                        d={d}
                        pathLength={1}
                        style={{
                          transitionDelay: `${500 + i * 160 + j * 140}ms`,
                        }}
                      />
                    ))}
                  </svg>
                  <span className="mvab-pn" style={M}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mvab-pt" style={D}>
                    {p[0]}
                  </h3>
                  {p[1] && <p className="mvab-pb">{p[1]}</p>}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* (4) the drying line */}
        <div ref={band} className="mv-wrap mvab-band">
          <Eyebrow text={bandEyebrow} on={onB} M={M} />
          <div className="mvab-line">
            <i className="mvab-wire" aria-hidden />
            {bandImgs.map((s, i) => (
              <figure
                key={i}
                className="mvab-print"
                style={{
                  ...rise(onB, 150 + i * 110, -30),
                  '--rot': `${[-2.2, 1.4, -1][i]}deg`,
                }}
              >
                <i className="mvab-clip" aria-hidden />
                <div className="mvab-pimg">
                  <img
                    {...RS(s, phone ? '90vw' : '26vw')}
                    alt={caps[i] || ''}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  <i className="mvab-glint" aria-hidden />
                </div>
                {caps[i] && (
                  <figcaption style={M}>{caps[i]}</figcaption>
                )}
              </figure>
            ))}
            {cur.length > 0 && (
              <div
                className="mvab-cur"
                style={{
                  ...rise(onB, 480, -30),
                  '--rot': '1.6deg',
                }}
              >
                <i className="mvab-clip" aria-hidden />
                <div className="mvab-ch">
                  <h3 style={D}>{curTitle}</h3>
                  {curDate && (
                    <span style={M}>
                      <i className="mvab-rec" aria-hidden />
                      {curDate}
                    </span>
                  )}
                </div>
                <dl>
                  {cur.map((r, i) => (
                    <div key={i} className="mvab-cr">
                      <dt style={M}>{r.k}</dt>
                      <dd style={D}>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS_MVAB = `
.mvab{background:var(--mv-bone);color:var(--mv-ink)}
.mvab .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px} .mvab .mv-eb i{border-radius:1px}
.mvab .mv-hd{font-stretch:115%}
.mvab .mv-it{display:inline-block;font-weight:inherit;color:var(--mv-ink);line-height:1.02;padding:0 .07em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .72s steps(8) var(--pd,600ms)} .mvab .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvab .mv-dark .mv-it{color:var(--mv-brass);background:none;padding:0}
/* (1) hero */
.mvab-top{padding:clamp(128px,12vw,176px) 0 clamp(88px,9vw,140px)}
.mvab-hero{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);gap:clamp(40px,6vw,112px);align-items:end}
.mvab-copy{display:flex;flex-direction:column;align-items:flex-start;gap:28px;padding-bottom:8px}
.mvab-h1{letter-spacing:-.045em!important;margin-top:4px!important}
.mvab-lead{margin:0;max-width:34em;font-size:18px;line-height:1.55;color:color-mix(in srgb,var(--mv-ink) 82%,var(--mv-bone));text-wrap:pretty}
.mvab-facts{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:0;border-top:1px solid var(--mv-fog);width:100%;max-width:640px}
.mvab-facts li{display:flex;align-items:baseline;gap:10px;padding:14px 20px 0 0;margin-right:20px;font-size:12px;letter-spacing:.1em;text-transform:uppercase} .mvab-facts b{font-weight:400;color:var(--mv-mut);font-size:12px}
.mvab-btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:6px}
.mvab-fig{margin:0;width:100%;max-width:540px;justify-self:end}
.mvab-card{--lx:74%;--ly:16%;--sx:-14px;--sy:8px;--kx:80%;--ky:12%;position:relative;aspect-ratio:4/5;border-radius:10px;overflow:hidden;background:var(--bd);isolation:isolate;box-shadow:0 40px 70px -40px color-mix(in srgb,var(--mv-ink) 60%,transparent);cursor:crosshair}
.mvab-cyc{position:absolute;inset:0;background:linear-gradient(180deg,transparent 58%,rgba(255,255,255,.14) 78%,rgba(255,255,255,.05)),radial-gradient(70% 16% at 50% 99%,rgba(0,0,0,.28),transparent 70%)}
.mvab-pool{position:absolute;inset:0;background:radial-gradient(30% 30% at var(--lx) var(--ly),rgba(255,244,226,.5),rgba(255,226,180,.14) 55%,transparent 78%);opacity:.55;transition:opacity .5s}
.mvab-card::after{content:"";position:absolute;z-index:1;inset:0;pointer-events:none;background:radial-gradient(55% 55% at var(--lx) var(--ly),transparent 30%,rgba(0,0,0,.26));opacity:0;transition:opacity .5s}
.mvab.is-lit .mvab-pool,.mvab.is-lit .mvab-card::after{opacity:1}
.mvab-lamp{position:absolute;z-index:4;left:var(--lx);top:var(--ly);width:16px;height:16px;translate:-50% -50%;border-radius:50%;background:#FFF1DA;box-shadow:0 0 22px 8px rgba(255,226,180,.55),0 0 0 6px rgba(255,241,218,.18);opacity:0;scale:.4;transition:opacity .3s,scale .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none}
.mvab.is-lit .mvab-lamp{opacity:1;scale:1} .mvab.is-lit .mvab-card{cursor:none}
.mvab-person{position:absolute;left:50%;bottom:0;height:94%;aspect-ratio:${MVAB_AR};translate:-50% 0}
.mvab-person img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:50% 100%;display:block;filter:brightness(.94) contrast(1.04);user-select:none}
.mvab-shadow,.mvab-rim{position:absolute;inset:0;-webkit-mask:var(--pimg) center bottom/contain no-repeat;mask:var(--pimg) center bottom/contain no-repeat;pointer-events:none}
.mvab-shadow{background:rgba(0,0,0,.4);filter:blur(12px);transform:translate3d(var(--sx),var(--sy),0);transition:transform .35s cubic-bezier(.2,.8,.2,1);opacity:.8}
.mvab-rim{background:radial-gradient(50% 50% at var(--kx) var(--ky),rgba(255,236,208,.5),transparent 60%);mix-blend-mode:screen;opacity:.35;transition:opacity .4s}
.mvab.is-lit .mvab-rim{opacity:1}
.mvab-grain{position:absolute;inset:0;pointer-events:none;opacity:.08;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
.mvab-lb{position:absolute;z-index:3;display:inline-flex;align-items:center;gap:8px;padding:5px 9px;border-radius:6px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-ink);background:color-mix(in srgb,var(--mv-cloud) 62%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.mvab-lb1{left:14px;top:14px} .mvab-lb1 i{width:8px;height:8px;border-radius:2px;background:var(--bd);box-shadow:0 0 0 1px color-mix(in srgb,var(--mv-ink) 30%,transparent)}
.mvab-lb2{right:14px;bottom:14px;font-variant-numeric:tabular-nums}
.mvab-lb3{left:14px;bottom:14px;opacity:1;transition:opacity .4s} .mvab-lb3 i{width:9px;height:9px;border-radius:50%;background:#FFF1DA;box-shadow:0 0 10px 3px rgba(255,226,180,.8)} .mvab.is-lit .mvab-lb3{opacity:0}
/* (2) night: the contact print */
.mvab-dk{background:var(--mv-night);color:var(--mv-cloud);--hair:color-mix(in srgb,var(--mv-cloud) 14%,transparent)}
.mvab-story{position:relative}
.mvab.is-pin .mvab-story{height:calc(var(--len,250) * 1svh);--len:250}
.mvab.is-pin .mvab-stick{position:sticky;top:0;height:100vh;height:100svh;display:flex;align-items:center;padding:clamp(48px,5.5vh,64px) 0 clamp(16px,2vh,24px);overflow:hidden}
.mvab.is-flat .mvab-stick{padding:clamp(88px,10vw,140px) 0 clamp(40px,5vw,72px)}
.mvab-sgrid{display:grid;grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);gap:clamp(32px,4.5vw,80px);align-items:center;width:100%}
.mvab-side{display:flex;flex-direction:column;align-items:flex-start;gap:18px}
.mvab-read{display:flex;flex-direction:column;gap:clamp(6px,1.2vh,12px);margin-top:clamp(8px,2vh,24px);width:100%;max-width:420px}
.mvab-ry{margin:0;font-size:clamp(52px,6.2vw,104px);line-height:.82;letter-spacing:-.05em;font-weight:800;font-stretch:118%;color:#FFF1DA;font-variant-numeric:tabular-nums;animation:mvab-in .7s cubic-bezier(.2,.8,.2,1) both}
.mvab-rt{margin:0;font-size:clamp(18px,1.5vw,24px);line-height:1.15;letter-spacing:-.025em;font-weight:680;font-stretch:108%;text-wrap:balance;animation:mvab-in .7s cubic-bezier(.2,.8,.2,1) .06s both}
@keyframes mvab-in{from{opacity:0;translate:0 18px;clip-path:inset(0 0 100% 0)}to{opacity:1;translate:0 0;clip-path:inset(0 0 -20% 0)}}
.mvab-rc{display:flex;align-items:center;gap:8px;margin:8px 0 0;font-size:12px;letter-spacing:.1em;color:var(--mv-mut);font-variant-numeric:tabular-nums} .mvab-rc b{font-weight:500;color:var(--mv-cloud)}
.mvab-rc>i{flex:1;height:1px;background:var(--hair);margin-left:10px;position:relative} .mvab-rc>i>i{position:absolute;inset:0;background:var(--mv-brass);transform-origin:0 50%;transform:scaleX(var(--u,1))}
.mvab-paper,.mvab-print,.mvab-cur{--mv-mut:color-mix(in srgb,var(--mv-stone) 60%,var(--mv-ink))}
.mvab-paper{position:relative;padding:clamp(12px,1.4vw,20px);max-height:calc(100svh - clamp(72px,8.5vh,96px));display:flex;flex-direction:column;justify-content:center;border-radius:4px;background:linear-gradient(160deg,color-mix(in srgb,var(--mv-bone) 96%,#fff),var(--mv-bone));color:var(--mv-ink);rotate:-.8deg;box-shadow:0 1px 0 rgba(0,0,0,.4),0 50px 80px -40px rgba(0,0,0,.8),0 0 0 1px rgba(0,0,0,.2)}
.mvab-paper::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(80% 60% at 30% 0%,rgba(255,241,218,.35),transparent 70%)}
.mvab-pl{position:relative;display:flex;justify-content:space-between;gap:12px;margin:0 0 10px;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvab-sheet{position:relative;display:flex;flex-direction:column;gap:clamp(8px,1vw,14px)}
.mvab-film{position:relative;display:flex;flex-direction:column;gap:4px;padding:4px 0 14px;background:${MVAB_FILM};border-radius:2px}
.mvab-holes{display:flex;justify-content:space-around;padding:0 6px} .mvab-holes b{display:block;width:9px;height:6px;border-radius:1px;background:var(--mv-bone);opacity:.92}
.mvab-edge{position:absolute;left:10px;bottom:2px;font-size:11px;letter-spacing:.12em;color:${MVAB_EDGE};opacity:.9}
.mvab-frames{display:grid;grid-template-columns:repeat(var(--per),minmax(0,1fr));gap:8px;padding:0 8px}
.mvab-fr{appearance:none;position:relative;display:block;padding:0;margin:0;border:0;background:none;color:inherit;cursor:pointer;text-align:left;--k:0}
.mvab-ph{position:relative;display:block;aspect-ratio:16/10;overflow:hidden;border-radius:2px;background:#222}
.mvab-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(.55) contrast(1.05) brightness(.82);transition:filter .6s,scale .8s cubic-bezier(.2,.8,.2,1)}
.mvab-fr.is-c .mvab-ph img{filter:grayscale(.1) brightness(.95)} .mvab-fr:hover .mvab-ph img{filter:none;scale:1.05}
.mvab-en{position:absolute;left:0;right:0;top:calc(100% + 1px);display:flex;justify-content:space-between;padding:0 2px;font-size:11px;letter-spacing:.08em;color:${MVAB_EDGE};pointer-events:none} .mvab-en i{font-style:normal;opacity:.7}
.mvab-ring{position:absolute;z-index:2;left:-9%;top:-16%;width:118%;height:132%;overflow:visible;pointer-events:none}
.mvab-ring path{fill:none;stroke:var(--mv-brass);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--k));opacity:.62;transition:opacity .4s}
.mvab-fr.is-a .mvab-ring path{opacity:1;filter:drop-shadow(0 0 6px color-mix(in srgb,var(--mv-brass) 60%,transparent))}
.mvab.is-flat .mvab-ring path{stroke-dashoffset:1;transition:stroke-dashoffset .9s cubic-bezier(.55,.1,.25,1) .1s,opacity .4s} .mvab.is-flat .mvab-fr.is-c .mvab-ring path{stroke-dashoffset:0;opacity:.95}
.mvab.is-final .mvab-ring path{transition:none}
.mvab-fr:focus-visible{outline-offset:6px!important}
.mvab-caps{list-style:none;margin:6px 0 0;padding:0 8px;display:grid;grid-template-columns:repeat(var(--per),minmax(0,1fr));gap:8px}
.mvab-caps li{display:flex;flex-direction:column;gap:2px;font-size:clamp(11.5px,0.9vw,13px);line-height:1.25;color:color-mix(in srgb,var(--mv-ink) 78%,var(--mv-bone));transition:color .3s}
.mvab-caps b{font-weight:500;font-size:11.5px;letter-spacing:.1em;color:var(--mv-mut)}
.mvab-caps li.is-a{color:var(--mv-ink)} .mvab-caps li.is-a b{color:var(--mv-ink);background:var(--mv-brass);width:max-content;padding:0 4px;margin-left:-4px;border-radius:2px}
/* (3) how I work */
.mvab-how{display:grid;grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);gap:clamp(40px,5vw,96px);padding-top:clamp(72px,8vw,128px);padding-bottom:clamp(72px,8vw,120px);border-top:1px solid var(--hair)}
.mvab-hh{display:flex;flex-direction:column;align-items:flex-start;gap:22px}
.mvab-pr{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
.mvab-pr li{position:relative;display:flex;flex-direction:column;gap:14px;padding:4px clamp(18px,2vw,32px) 0;border-left:1px solid var(--hair)}
.mvab-ico{width:64px;height:64px;margin-bottom:14px;overflow:visible} .mvab-ico path{fill:none;stroke:#FFF1DA;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .9s cubic-bezier(.55,.1,.25,1)}
.mvab-pr.is-on .mvab-ico path,.mvab.is-final .mvab-ico path{stroke-dashoffset:0}
.mvab-pr li:hover .mvab-ico path{stroke:var(--mv-brass)}
.mvab-pn{font-size:12px;letter-spacing:.12em;color:var(--mv-mut)}
.mvab-pt{margin:0;font-size:clamp(22px,1.9vw,28px);line-height:1.05;letter-spacing:-.028em;font-weight:700;font-stretch:110%;text-wrap:balance}
.mvab-pb{margin:0;font-size:16px;line-height:1.55;color:color-mix(in srgb,var(--mv-cloud) 74%,var(--mv-night))}
/* (4) drying line */
.mvab-band{display:flex;flex-direction:column;gap:32px;padding-bottom:clamp(96px,10vw,160px)}
.mvab-line{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,.9fr)) minmax(0,1.1fr);gap:clamp(20px,2.4vw,40px);align-items:start;padding-top:26px}
.mvab-wire{position:absolute;left:-2%;right:-2%;top:12px;height:1.5px;background:color-mix(in srgb,var(--mv-cloud) 34%,transparent);border-radius:2px}
.mvab-print,.mvab-cur{position:relative;margin:0;transform-origin:50% -14px;rotate:var(--rot,0deg);transition:rotate .6s cubic-bezier(.34,1.56,.64,1)}
.mvab-print{padding:10px 10px 12px;background:var(--mv-cloud);color:var(--mv-ink);border-radius:2px;box-shadow:0 30px 40px -24px rgba(0,0,0,.8)}
.mvab-print:nth-child(3){margin-top:22px} .mvab-print:nth-child(4){margin-top:8px}
.mvab-clip{position:absolute;z-index:2;left:50%;top:-20px;width:30px;height:26px;translate:-50% 0;border-radius:3px 3px 5px 5px;background:linear-gradient(180deg,#3a3a3e,#1b1b1e);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 4px 8px rgba(0,0,0,.4)}
.mvab-clip::before{content:"";position:absolute;left:5px;right:5px;top:-7px;height:10px;border:2px solid #9a9aa0;border-bottom:0;border-radius:6px 6px 0 0}
.mvab-pimg{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:1px;background:#222}
.mvab-pimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:scale 1s cubic-bezier(.2,.8,.2,1)}
.mvab-glint{position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,241,218,.5) 50%,transparent 70%);translate:-120% 0;pointer-events:none;mix-blend-mode:screen}
.mvab-print figcaption{margin-top:10px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
@media (hover:hover){.mvab-print:hover,.mvab-cur:hover{animation:mvab-swing 1.1s cubic-bezier(.3,.6,.3,1)} .mvab-print:hover img{scale:1.04} .mvab-print:hover .mvab-glint{translate:120% 0;transition:translate 1.1s cubic-bezier(.3,.6,.2,1)}}
@keyframes mvab-swing{0%{rotate:var(--rot)}25%{rotate:calc(var(--rot) + 3.5deg)}55%{rotate:calc(var(--rot) - 2deg)}80%{rotate:calc(var(--rot) + .8deg)}100%{rotate:var(--rot)}}
.mvab-cur{padding:26px 24px 22px;background:var(--mv-bone);color:var(--mv-ink);border-radius:4px;box-shadow:0 30px 40px -24px rgba(0,0,0,.8);margin-top:14px}
.mvab-ch{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--mv-fog)}
.mvab-ch h3{margin:0;font-size:28px;line-height:1;letter-spacing:-.03em;font-weight:760;font-stretch:115%}
.mvab-ch span{display:inline-flex;align-items:center;gap:7px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut);white-space:nowrap}
.mvab-rec{width:7px;height:7px;border-radius:50%;background:#E5484D;animation:mvab-rec 1.6s steps(2) infinite} @keyframes mvab-rec{50%{opacity:.25}}
.mvab-cur dl{margin:0}
.mvab-cr{position:relative;display:grid;grid-template-columns:92px minmax(0,1fr);gap:12px;padding:14px 0;border-bottom:1px solid var(--mv-fog);isolation:isolate}
.mvab-cr:last-child{border-bottom:0;padding-bottom:0}
.mvab-cr::before{content:"";position:absolute;z-index:-1;inset:6px -8px;border-radius:4px;background:var(--mv-brass);clip-path:inset(0 100% 0 0);transition:clip-path .45s steps(8)}
.mvab-cr:hover::before{clip-path:inset(0 0 0 0)}
.mvab-cr dt{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut);padding-top:3px} .mvco-cr:hover dt,.mvab-cr:hover dt{color:var(--mv-ink)}
.mvab-cr dd{margin:0;font-size:17px;line-height:1.25;letter-spacing:-.015em;font-weight:620}
/* tablet */
.mvab.is-tab .mvab-hero{grid-template-columns:minmax(0,1fr) minmax(0,.8fr);gap:40px;align-items:center}
.mvab.is-tab .mvab-sgrid,.mvab.is-tab .mvab-how{grid-template-columns:1fr;gap:36px}
.mvab.is-tab .mvab-line{grid-template-columns:repeat(3,minmax(0,1fr));row-gap:48px} .mvab.is-tab .mvab-cur{grid-column:1 / -1;max-width:520px;justify-self:center;width:100%}
/* phone */
.mvab.is-tab .mvab-lb3{display:none} :is(.mvab.is-tab,.mvab.is-ph) .mvab-cur .mvab-clip{display:none} :is(.mvab.is-tab,.mvab.is-ph) .mvab-cur{rotate:0deg}
.mvab.is-ph .mvab-top{padding:112px 0 72px}
.mvab.is-ph .mvab-hero{grid-template-columns:1fr;gap:44px}
.mvab.is-ph .mvab-h1{font-size:44px!important}
.mvab.is-ph .mvab-lead{font-size:17px}
.mvab.is-ph .mvab-facts{flex-direction:column} .mvab.is-ph .mvab-facts li{padding:12px 0;margin:0;border-bottom:1px solid var(--mv-fog)}
.mvab.is-ph .mvab-btns{flex-direction:column;align-items:stretch;width:100%} .mvab.is-ph .mvab-btns .mv-btn{width:100%}
.mvab.is-ph .mvab-fig{justify-self:stretch;max-width:none} .mvab.is-ph .mvab-lb3{display:none}
.mvab.is-ph .mvab-sgrid,.mvab.is-ph .mvab-how{grid-template-columns:1fr;gap:32px}
.mvab.is-ph .mvab-paper{rotate:0deg;padding:14px;margin:0 -6px}
.mvab.is-ph .mvab-caps li{font-size:14px}
.mvab.is-ph .mvab-pr{grid-template-columns:1fr} .mvab.is-ph .mvab-pr li{border-left:0;border-top:1px solid var(--hair);padding:24px 0 28px}
.mvab.is-ph .mvab-line{grid-template-columns:1fr 1fr;row-gap:44px;gap:18px} .mvab.is-ph .mvab-print:nth-child(4){display:none} .mvab.is-ph .mvab-cur{grid-column:1 / -1}
.mvab.is-ph .mvab-print{padding:7px 7px 9px} .mvab.is-ph .mvab-print figcaption{font-size:12px;letter-spacing:.06em}
@media (prefers-reduced-motion:reduce){.mvab-rec{animation:none} .mvab-ry,.mvab-rt{animation:none}}
`;
