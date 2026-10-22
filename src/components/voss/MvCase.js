'use client';

import {
  useEffect,
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
  SCRUB_K,
  colorsOf,
  cssVars,
  siteFontCss,
  fontsOf,
  Glyph,
  Btn,
  useMagnet,
  CSS_BASE,
  CSS_MOTION,
  useOn,
  Head,
  Eyebrow,
  rise,
  listOf,
  plainOf,
  pick,
} from './scaffold';
import {
  siteData,
  defaultProjects,
  defaultReviews,
} from './siteData';
import { getProjectBySlug } from '@/data/caseStudiesData';

const CS_FILM = '#0E0D0C';
const CS_EDGE = '#F2923A';
const CS_LIGHT = '#FFF1DA';
const CS_HOLE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='24'><rect x='7' y='7' width='12' height='10' rx='2.5'/></svg>")`;
const EMPTY_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500' preserveAspectRatio='xMidYMid slice'><rect width='400' height='500' fill='#D3D8E2'/><rect x='120' y='170' width='160' height='160' rx='8' fill='none' stroke='#AEB6C6' stroke-width='1.5'/><rect x='100' y='150' width='200' height='200' rx='10' fill='none' stroke='#C3CAD8' stroke-width='1' stroke-dasharray='2 6'/></svg>"
  );

const csPad = (n) => String(Math.max(0, n)).padStart(2, '0');
const csNorm = (s) => String(s || '').trim().toLowerCase();

// Highlighted code line (comment / string / JSX tag / number / keyword)
const csHl = (line) => {
  const out = [];
  const re =
    /(\/\/.*$)|("[^"]*")|(<\/?[A-Za-z][\w.]*)|(\b\d+(?:\.\d+)?\b)|(\b(?:import|from|const|export|default|function|return)\b)/g;
  let i = 0;
  let m;
  let k = 0;
  while ((m = re.exec(line))) {
    if (m.index > i) out.push(line.slice(i, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 't' : m[4] ? 'n' : 'k';
    out.push(
      <i key={k++} className={`mvcs-hl-${cls}`}>
        {m[0]}
      </i>
    );
    i = m.index + m[0].length;
  }
  if (i < line.length) out.push(line.slice(i));
  return out;
};

// Extracts biggest stat from string ("+64% launch-week sales" -> "+64%")
const csStat = (o) => {
  const m = String(o || '').match(
    /[+\-−]?\d[\d.,]*\s?(?:%|×|x(?![a-z])|★|k(?![a-z])|K(?![a-z]))?/
  );
  return m ? m[0].trim() : '';
};

const csTC = (sec) => {
  const f = Math.floor((sec % 1) * 24);
  const s = Math.floor(sec) % 60;
  const mi = Math.floor(sec / 60) % 60;
  const h = Math.floor(sec / 3600);
  return `${csPad(h)}:${csPad(mi)}:${csPad(s)}:${csPad(f)}`;
};

const csOff = (el, root) => {
  let y = 0;
  let n = el;
  while (n && n !== root) {
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return y;
};

const imgOf = (r, k = 'img') => String((r && r[k]) || '').split('?')[0];
const imgOr = (r, k = 'img') => imgOf(r, k) || EMPTY_IMG;

export default function MvCase(props = {}) {
  const {
    slug = '',
    emptyTitle = 'Case study',
    eyebrow = 'CASE {no} — {category}',
    backLabel = 'All work',
    backLink = '/work',
    rollLabel = 'Frame',
    sheetTitle = 'Call sheet',
    sheetNo = 'Prod. No. {no}',
    sheetLabels = 'Production;Client;Category;Year;Role;Team',
    directorLabel = 'Lead Designer',
    stamp = 'Shipped {year}',
    coverTag = 'A-cam · {slug}',
    leadLabel = 'The short version',
    outcomeLabel = 'Outcome',
    briefTitle = 'The *brief*',
    briefBody = '{client} approached me with an ambitious vision and a tight release runway: build a high-density, rock-solid platform that empowers power users without cognitive overload.\n\nThe mission was clear: distill complex workflows into intuitive visual hierarchies, design a component-level system in Figma, and engineer the frontend in React & Next.js to the highest production standard. Working in rapid two-week sprints ensured what was sketched on Monday was in the live staging build by Thursday.',
    didTitle = 'What I *did*',
    didList = 'Led discovery workshops with {client} stakeholders to define core user workflows, telemetry specs and metrics for success;Architected a comprehensive multi-brand design system in Figma with semantic tokens, typography scales, and modular cards;Engineered responsive frontend in Next.js 15, React, and TypeScript with zero-friction handoff;Built custom interactive telemetry charts, real-time widgets, and physics-driven micro-interactions;Conducted end-to-end usability audits and stayed on post-launch for two sprints of performance optimization',
    codeTitle = 'Design → *code*',
    codeIntro = 'One unified mindset on both sides. The frame on the left is the Figma component architecture, and the panel on the right is what shipped to production — spacing tokens, typographic scales, and color variables map 1:1 with zero drift.',
    designLabel = 'Hero / Desktop',
    designSize = '1440 × 900',
    codeFile = '{slug}/Hero.tsx',
    codeSnippet = '// {title} — {category}\nimport { Frame, TelemetryStream, MetricPill } from "@/components/voss"\n\nexport default function CaseHero() {\n  return (\n    <Frame name="Hero / Desktop" width={1440} accent="{accent}">\n      <TelemetryStream src="/{slug}/telemetry.json" rate="sub-second" />\n      <MetricPill label="Latency" value="12ms" active />\n    </Frame>\n  )\n}',
    resultTitle = 'The *result*',
    resultBody = 'Shipped on schedule to global users, measured across millions of production events, and delivered with exhaustive component documentation so internal teams can scale effortlessly.',
    metrics = '6 wks|Sprint to Launch;140+|Tokens in System;99.9%|UI Test Coverage',
    galleryTitle = 'More *frames*',
    gallery = [],
    galleryCaption = 'Still',
    quoteLabel = 'The client',
    nextLabel = 'Next project',
    nextOpen = 'Open case',
    leaderText = 'Roll on',
    ctaLabel = 'Start a project',
    ctaLink = siteData.book || '#contact',
    soloLabel = 'Back to all work',
    hudLabel = 'Reel',
    readMinutes = 5,
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
  const codeRef = useRef(null);
  const leadRef = useRef(null);
  const hudRef = useRef(null);
  const numRef = useRef(null);

  const { w } = useSize(root, bpHint);
  const phone = w < 810;
  const tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm, 0.02);
  useMagnet(root, live);

  const rows = defaultProjects;
  const n = rows.length;

  // Determine active project row
  const activeSlug = String(slug || '').trim();
  const study = getProjectBySlug(activeSlug);

  const foundIdx = activeSlug
    ? rows.findIndex((r) => r.slug === activeSlug || (study && r.slug === study.slug))
    : -1;
  const idx = foundIdx >= 0 ? foundIdx : 0;
  const baseRow = rows[idx] || rows[0];

  const row = {
    ...baseRow,
    f1: study?.title || baseRow.f1,
    f2: study?.client || baseRow.f2,
    f3: study?.category || study?.type || baseRow.f3,
    f4: study?.year || baseRow.f4,
    f5: study?.description || study?.tagline || baseRow.f5,
    f8: study?.role || baseRow.f8,
    f9: study?.team || study?.timeline || baseRow.f9,
    img: study?.image || baseRow.img,
    figmaLink: study?.figmaLink || baseRow.figmaLink || '',
    liveLink: study?.liveLink || study?.link || baseRow.liveLink || '',
    toolsList: study?.toolsList || baseRow.technology || [],
  };
  const effectiveFigma =
    row.figmaLink ||
    (row.link && row.link.includes('figma.com') ? row.link : '') ||
    (row.liveLink && row.liveLink.includes('figma.com') ? row.liveLink : '') ||
    (study?.figmaLink ? study.figmaLink : '') ||
    'https://www.figma.com/proto/R1iGpN1hLDj7hpgVvo1xWb/neuro-kaizen?node-id=10-887';
  const nxt = n > 1 ? rows[(idx + 1) % n] : null;

  const reviews = defaultReviews;
  const quote = row.f1
    ? reviews.find((r) => csNorm(r.f5) && csNorm(r.f5).includes(csNorm(row.f1).slice(0, 4)))
    : undefined;

  const anim = live && !rm && !still;
  const tidy = (s) => s.replace(/^[\s—·/|-]+|[\s—·/|-]+$/g, '');
  const tok = (s) =>
    String(s || '').replace(/\{(\w+)\}/g, (match, k) => {
      const v = {
        title: row.f1,
        client: row.f2 || (row.f1 ? '' : 'The client'),
        category: row.f3,
        year: row.f4,
        role: row.f8,
        team: row.f9,
        outcome: row.f10,
        slug: row.slug,
        accent: row.f7,
        name: site.name,
        no: csPad(idx + 1),
      };
      return k in v ? String(v[k] || '') : match;
    });

  const title = row.f1 || emptyTitle;
  const dfw = props.customFonts ? D.fontWeight : 'var(--mv-font-dw, 720)';

  // Gallery: secondary research screens, or control images, or sibling fallback
  const studyGals = (study?.secondaryImages || []).map((img) => img.url).filter(Boolean);
  const galC = (gallery || []).map((g) => srcOf(g, '')).filter(Boolean);
  const gal = studyGals.length
    ? studyGals.slice(0, 6)
    : galC.length
    ? galC.slice(0, 6)
    : rows
        .map((_, k) => rows[(idx + 1 + k) % Math.max(1, n)])
        .filter((r) => r && r.slug !== row.slug)
        .map((r) => imgOf(r))
        .filter(Boolean)
        .slice(0, 3);

  const code = tok(codeSnippet).split('\n');
  const stat = csStat(row.f10);
  const labels = listOf(sheetLabels);
  const L = (k, fb) => labels[k] || fb;

  const sheet = [
    [L(0, 'Production'), row.f1],
    [L(1, 'Client'), row.f2],
    [L(2, 'Category'), row.f3],
    [L(3, 'Year'), row.f4],
    [L(4, 'Role'), row.f8],
    [L(5, 'Team'), row.f9],
    row.toolsList && row.toolsList.length > 0
      ? ['Stack', Array.isArray(row.toolsList) ? row.toolsList.slice(0, 4).join(', ') : row.toolsList]
      : null,
  ].filter((x) => x && x[1]);

  const activeBriefBody =
    study?.overview?.challenge || study?.problem || study?.description || briefBody;
  const activeDidList =
    study?.deliverables && study.deliverables.length > 0
      ? study.deliverables.join(';')
      : study?.overview?.solution
      ? `${study.overview.solution};Engineered atomic component architecture in Figma;Conducted end-to-end usability audits`
      : didList;

  const did = listOf(tok(activeDidList));
  const mets = listOf(metrics)
    .map((x) => {
      const [a, b] = x.split('|');
      return { v: (a || '').trim(), l: (b || '').trim() };
    })
    .filter((x) => x.v);

  const scenes = [
    plainOf(briefTitle),
    plainOf(didTitle),
    plainOf(codeTitle),
    plainOf(resultTitle),
  ];

  // One rAF loop: Reading timecode HUD + scene, code typing, leader countdown
  useEffect(() => {
    const el = root.current;
    if (!anim || !el) return;
    let vis = true;
    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: '10% 0px 10% 0px' }
    );
    io.observe(el);

    let H = 1;
    let oNx = 1e9;
    let oCode = 0;
    let hCode = 1;
    let oLead = 0;
    let hLead = 1;
    let sc = [];
    let lines = [];
    let lens = [];
    let tot = 1;
    let put = [];

    const measure = () => {
      H = el.offsetHeight || 1;
      const cd = codeRef.current;
      const ld = leadRef.current;
      if (cd) {
        oCode = csOff(cd, el);
        hCode = cd.offsetHeight || 1;
        lines = Array.from(cd.querySelectorAll('.mvcs-ln'));
        lens = lines.map((l) => Number(l.dataset.n) || 0);
        tot = Math.max(1, lens.reduce((a, b) => a + b, 0));
        put = lines.map(() => -1);
      }
      if (ld) {
        oLead = csOff(ld, el);
        hLead = ld.offsetHeight || 1;
      }
      sc = Array.from(el.querySelectorAll('[data-sc]')).map((s) => csOff(s, el));
      const nx = el.querySelector('.mvcs-nx');
      oNx = nx ? csOff(nx, el) : 1e9;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const t1 = window.setTimeout(measure, 1200);

    let hk = 0;
    let overT = false;
    let top = 0;
    let vh = 1;
    let fresh = false;
    let q = -1;
    let ct = -1;
    let lt = -1;
    let lastT = '';
    let lastS = -2;
    let lastOn = false;
    let lastTyped = -1;
    let lastCur = -1;
    let lastN = -1;
    let lastLt = -1;

    const hud = hudRef.current;
    const tcEl = hud ? hud.querySelector('.mvcs-tc') : null;
    const scEl = hud ? hud.querySelector('.mvcs-sc') : null;

    const read = () => {
      if (!vis) {
        fresh = false;
        return;
      }
      top = el.getBoundingClientRect().top;
      vh = window.innerHeight || 1;
      fresh = true;
    };

    const off = onTick(() => {
      if (!fresh) return;
      // Reading progress -> timecode, scene, bar
      const pp = clamp01(-top / Math.max(1, H - vh));
      q = q < 0 ? pp : q + (pp - q) * SCRUB_K;
      if (Math.abs(pp - q) < 0.0004) q = pp;

      if (hud) {
        if (++hk % 3 === 0) {
          const r = hud.getBoundingClientRect();
          let ot = false;
          for (let gx = 0; gx < 5 && !ot; gx++) {
            for (let gy = 0; gy < 3 && !ot; gy++) {
              const px = r.left + 4 + ((r.width - 8) * gx) / 4;
              const py = r.top + 4 + ((r.height - 8) * gy) / 2;
              for (const e of document.elementsFromPoint(px, py)) {
                if (e === document.body || e === document.documentElement) break;
                if (e.closest?.('#sf-demo-bar,.mvcs-hudw')) continue;
                if (
                  Array.prototype.some.call(
                    e.childNodes,
                    (n) => n.nodeType === 3 && (n.textContent || '').trim().length > 0
                  )
                ) {
                  ot = true;
                  break;
                }
                const cs = getComputedStyle(e);
                if (
                  cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
                  cs.backgroundImage !== 'none' ||
                  e.tagName === 'IMG'
                )
                  break;
              }
            }
          }
          if (ot !== overT) hud.classList.toggle('is-ot', ot);
          overT = ot;
        }

        const onH = pp > 0.015 && top + oNx > vh * 0.82 && !overT;
        if (onH !== lastOn) {
          lastOn = onH;
          hud.classList.toggle('is-on', onH);
        }

        const t = csTC(q * Math.max(0.5, Number(readMinutes) || 5) * 60);
        if (t !== lastT && tcEl) {
          lastT = t;
          tcEl.textContent = t;
        }
        hud.style.setProperty('--q', q.toFixed(4));

        let s = -1;
        for (let i = 0; i < sc.length; i++) {
          if (top + sc[i] < vh * 0.55) s = i;
        }
        if (s !== lastS && scEl) {
          lastS = s;
          scEl.textContent =
            s >= 0
              ? `SC ${csPad(s + 1)} · ${scenes[s] || ''}`
              : `${hudLabel} ${csPad(idx + 1)} · ${title}`;
        }
      }

      // Code: types in as panel enters viewport
      if (lines.length) {
        const tt = clamp01(
          (vh * 0.92 - (top + oCode)) /
            (Math.min(hCode, vh * 0.6) + vh * 0.1)
        );
        ct = ct < 0 ? tt : ct + (tt - ct) * 0.12;
        if (Math.abs(tt - ct) < 0.001) ct = tt;
        const typed = Math.round(ct * tot);
        if (typed !== lastTyped) {
          lastTyped = typed;
          let acc = 0;
          let cur = -1;
          for (let i = 0; i < lines.length; i++) {
            const cc = Math.max(0, Math.min(lens[i], typed - acc));
            if (cc !== put[i]) {
              put[i] = cc;
              lines[i].style.setProperty('--c', String(cc));
            }
            if (cur < 0 && cc < lens[i]) cur = i;
            acc += lens[i];
          }
          if (cur !== lastCur) {
            if (lastCur >= 0 && lines[lastCur])
              lines[lastCur].classList.remove('is-cur');
            if (cur >= 0 && lines[cur])
              lines[cur].classList.add('is-cur');
            lastCur = cur;
          }
        }
      }

      // Leader: 3 -> 2 -> 1 then iris opens onto next cover
      const ld = leadRef.current;
      if (ld) {
        const tl = clamp01(
          (vh * 0.95 - (top + oLead)) / (vh * 0.45 + hLead * 0.45)
        );
        lt = lt < 0 ? tl : lt + (tl - lt) * 0.14;
        if (Math.abs(tl - lt) < 0.001) lt = tl;
        const r4 = Math.round(lt * 1000) / 1000;
        if (r4 !== lastLt) {
          lastLt = r4;
          const ph = lt * 4;
          ld.style.setProperty(
            '--sw',
            String(ph >= 3 ? 1 : Math.round((ph % 1) * 1000) / 1000)
          );
          ld.style.setProperty('--ir', clamp01(ph - 3).toFixed(3));
        }
        const num = lt * 4 >= 3 ? 1 : 3 - Math.floor(lt * 4);
        if (num !== lastN && numRef.current) {
          lastN = num;
          numRef.current.textContent = String(num);
        }
      }
    }, read);

    return () => {
      off();
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(t1);
    };
  }, [anim, row.slug, codeSnippet, n]);

  const coverMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    t.style.setProperty(
      '--hx',
      `${Math.round(((e.clientX - r.left) / r.width) * 100)}%`
    );
    t.style.setProperty(
      '--hy',
      `${Math.round(((e.clientY - r.top) / r.height) * 100)}%`
    );
  };

  const cover = imgOf(row);
  const ci = RS(cover || EMPTY_IMG, '(max-width: 1099px) 100vw, 92vw');
  const nimg = nxt ? RS(imgOr(nxt), '(max-width: 1099px) 100vw, 60vw') : null;
  const book = pick(ctaLink, site.book || '#contact');

  const h2 = (t, i, k) => (
    <header className="mvcs-sh" data-sc={i}>
      <span className="mvcs-sn" style={M}>
        SC {csPad(i + 1)}
      </span>
      <Head
        text={t}
        on={on}
        D={D}
        size="clamp(32px,3.2vw,48px)"
        lh={0.98}
        style={{ fontWeight: dfw, fontStretch: '115%' }}
        className={k}
      />
    </header>
  );

  return (
    <section
      ref={root}
      className={`mv mv-sec mvcs${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}${anim ? ' is-anim' : ' is-final'}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
      aria-label={`${title}${row.f2 ? ` — ${row.f2}` : ''}`}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_CS + siteFontCss(props),
        }}
      />
      {anim && (
        <div className="mvcs-hudw" aria-hidden>
          <div ref={hudRef} className="mvcs-hud" style={M}>
            <i className="mvcs-gc" />
            <span className="mvcs-rec" />
            <span className="mvcs-sc">
              {hudLabel} {csPad(idx + 1)} · {title}
            </span>
            <span className="mvcs-tc">00:00:00:00</span>
            <i className="mvcs-qb" />
          </div>
        </div>
      )}

      {/* ---- Dark Top: Title + Call Sheet ---- */}
      <div className="mv-dark mvcs-dk mvcs-top">
        <div className="mv-wrap">
          <div className="mvcs-bar" style={{ ...M, ...rise(on, 0, -8) }}>
            <a className="mvcs-back" href={backLink || '/work'}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M19 12H5M11 5l-7 7 7 7" />
              </svg>
              {backLabel}
            </a>
            {n > 0 && (
              <span className="mvcs-roll">
                {rollLabel} <b>{csPad(idx + 1)}</b> / {csPad(n)}
              </span>
            )}
          </div>
          <div className="mvcs-hero">
            <div className="mvcs-hl">
              <Eyebrow
                text={tidy(tok(eyebrow))}
                on={on}
                M={M}
                delay={80}
              />
              <Head
                text={title}
                tag="h1"
                on={on}
                D={D}
                size={
                  title.length > 10
                    ? 'clamp(52px,7.4vw,128px)'
                    : 'clamp(76px,13vw,212px)'
                }
                lh={0.86}
                delay={140}
                step={80}
                style={{ fontWeight: 800, fontStretch: '118%' }}
                className="mvcs-h1"
              />
              {effectiveFigma && (
                <div className="mvcs-hero-btns" style={rise(on, 280, 16)}>
                  <Btn
                    href={effectiveFigma}
                    label="Figma Prototype"
                    kind="solid"
                    arrow={true}
                    sub="Prototype"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                  {row.liveLink && row.liveLink !== effectiveFigma && (
                    <Btn
                      href={row.liveLink}
                      label="Live Platform"
                      kind="ghost"
                      arrow={true}
                      sub="Production"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  )}
                </div>
              )}
            </div>
            {sheet.length > 0 && (
              <div
                className="mvcs-sheet"
                style={{ ...M, ...rise(on, 420, 30) }}
              >
                <i className="mvcs-holes" aria-hidden>
                  <b />
                  <b />
                  <b />
                </i>
                <p className="mvcs-sht">
                  <b>{sheetTitle}</b>
                  <span>{tidy(tok(sheetNo))}</span>
                </p>
                <dl className="mvcs-dl">
                  {sheet.map(([k, v], i) => (
                    <div key={i}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                {(effectiveFigma || row.liveLink) && (
                  <div className="mvcs-actions">
                    {effectiveFigma && (
                      <Btn
                        href={effectiveFigma}
                        label="Figma Prototype"
                        kind="quiet"
                        className="mv-ghost"
                        arrow={true}
                        sub="Prototype"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    )}
                    {row.liveLink && row.liveLink !== effectiveFigma && (
                      <Btn
                        href={row.liveLink}
                        label="Live Website"
                        kind="quiet"
                        arrow={true}
                        sub="Production"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    )}
                  </div>
                )}
                <p className="mvcs-sig">
                  <span>{directorLabel}</span>
                  <b>{site.name}</b>
                  {stamp && row.f4 !== undefined && (
                    <em className="mvcs-stamp" aria-hidden>
                      {tidy(tok(stamp))}
                    </em>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Cover on Split Ground ---- */}
      <div className="mvcs-cv">
        <div className="mv-wrap">
          <div
            className={`mvcs-cover${cover ? '' : ' is-empty'}`}
            onPointerMove={coverMove}
            style={rise(on, 260, 40)}
          >
            <img
              src={ci.src}
              srcSet={ci.srcSet}
              sizes={ci.sizes}
              alt={row.f1 ? `${row.f1}${row.f2 ? ` for ${row.f2}` : ''}` : ''}
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <i className="mvcs-sweep" aria-hidden />
            <i className="mvcs-key" aria-hidden />
            <span className="mvcs-cm" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="mvcs-ctag" style={M} aria-hidden>
              {tidy(tok(coverTag))}
            </span>
            {effectiveFigma && (
              <a
                href={effectiveFigma}
                target="_blank"
                rel="noopener noreferrer"
                className="mvcs-cover-figma-badge"
                title="View interactive Figma prototype"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 2h8a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4zm0 8h8a4 4 0 0 1 4 4v0a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4zm0 8h4a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-4z" />
                </svg>
                <span>Figma Prototype ↗</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ---- Paper Section: Lead, Outcome Stat, Scenes ---- */}
      <div className="mvcs-pp">
        <div className="mv-wrap">
          <div className="mvcs-lead">
            <div>
              <p className="mvcs-k" style={M}>
                {leadLabel}
              </p>
              <p
                className="mvcs-lt"
                style={{ ...D, fontWeight: dfw }}
              >
                {row.f5}
              </p>
            </div>
            {row.f10 && (
              <div className="mvcs-stat">
                <p className="mvcs-k" style={M}>
                  {outcomeLabel}
                </p>
                {stat ? (
                  <>
                    <p className="mvcs-big" style={{ ...D }}>
                      {stat}
                    </p>
                    <p className="mvcs-bl">{row.f10}</p>
                  </>
                ) : (
                  <p className="mvcs-big is-txt" style={D}>
                    {row.f10}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mvcs-ch">
            {h2(briefTitle, 0)}
            <div className="mvcs-body">
              {tok(activeBriefBody)
                .split(/\n\s*\n/)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          </div>

          {did.length > 0 && (
            <div className="mvcs-ch">
              {h2(didTitle, 1)}
              <ol className="mvcs-did">
                {did.map((d, i) => (
                  <li key={i}>
                    <span style={M}>{csPad(i + 1)}</span>
                    <p>{d}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mvcs-ch is-wide">
            {h2(codeTitle, 2)}
            {codeIntro && (
              <p className="mvcs-intro">{tok(codeIntro)}</p>
            )}
            <div className="mvcs-split">
              <div className="mvcs-canvas">
                <p className="mvcs-fl" style={M}>
                  <svg viewBox="0 0 12 12" aria-hidden>
                    <path d="M3 1v10M9 1v10M1 3h10M1 9h10" />
                  </svg>
                  {tok(designLabel)}
                </p>
                <div className="mvcs-frame">
                  <img
                    {...RS(
                      cover || EMPTY_IMG,
                      '(max-width: 1099px) 100vw, 46vw'
                    )}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  <span className="mvcs-grid" aria-hidden>
                    {Array.from({ length: 12 }, (_, i) => (
                      <i key={i} />
                    ))}
                  </span>
                  <span
                    className="mvcs-tl"
                    style={{ ...D, fontWeight: 800 }}
                    aria-hidden
                  >
                    {title}
                  </span>
                  <span className="mvcs-sel" aria-hidden>
                    <i />
                    <i />
                    <i />
                    <i />
                    <b style={M}>{tok(designSize)}</b>
                  </span>
                </div>
              </div>
              <div ref={codeRef} className="mvcs-code" style={M}>
                <p className="mvcs-tab">
                  <span>{tok(codeFile)}</span>
                  <em>TSX</em>
                </p>
                <pre tabIndex={0} aria-label={tok(codeFile)}>
                  {code.map((l, i) => (
                    <span
                      key={i}
                      className="mvcs-ln"
                      data-n={l.length}
                      style={{ '--n': l.length }}
                    >
                      <em aria-hidden>{i + 1}</em>
                      <code>{l ? csHl(l) : ' '}</code>
                    </span>
                  ))}
                </pre>
              </div>
            </div>
          </div>

          <div className="mvcs-ch">
            {h2(resultTitle, 3)}
            <div className="mvcs-body">
              {resultBody && <p>{tok(resultBody)}</p>}
              {mets.length > 0 && (
                <dl className="mvcs-mets">
                  {mets.map((m, i) => (
                    <div key={i}>
                      <dt style={M}>Take {i + 1}</dt>
                      <dd style={{ ...D, fontWeight: dfw }}>
                        {tok(m.v)}
                      </dd>
                      <dd className="mvcs-ml" style={M}>
                        {tok(m.l)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>

          {gal.length > 0 && (
            <div className="mvcs-gal">
              <Head
                text={galleryTitle}
                on={on}
                D={D}
                size="clamp(28px,2.6vw,40px)"
                lh={1}
                style={{ fontWeight: dfw, fontStretch: '115%' }}
              />
              <div
                className="mvcs-strip"
                role="list"
                aria-label={plainOf(galleryTitle)}
                tabIndex={phone ? 0 : undefined}
              >
                {gal.map((g, i) => (
                  <figure
                    key={i}
                    role="listitem"
                    className="mvcs-gf"
                  >
                    <span className="mvcs-gw">
                      <img
                        {...RS(g, phone ? '80vw' : '34vw')}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </span>
                    <figcaption style={M}>
                      {galleryCaption} {csPad(i + 1)}{' '}
                      <em>
                        {csPad(idx + 1)}
                        {String.fromCharCode(65 + i)}
                      </em>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {quote && (
            <figure className="mvcs-q">
              <i className="mvcs-tape" aria-hidden />
              <div className="mvcs-qp">
                <p className="mvcs-qd" style={M}>
                  <span>{quoteLabel}</span>
                  <span>
                    {[quote.f3, row.f4].filter(Boolean).join(' · ')}
                  </span>
                </p>
                <blockquote style={D}>
                  <span aria-hidden>“</span>
                  {quote.f4}
                </blockquote>
                <figcaption>
                  {imgOf(quote) && (
                    <img
                      {...RS(imgOf(quote), '64px')}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span>
                    <b>{quote.f1}</b>
                    <em style={M}>
                      {[quote.f2, quote.f3].filter(Boolean).join(' · ')}
                    </em>
                  </span>
                </figcaption>
              </div>
            </figure>
          )}
        </div>
      </div>

      {/* ---- Dark End: Next Project Behind Film Leader ---- */}
      <div className="mv-dark mvcs-dk mvcs-nx">
        <div className="mv-wrap mvcs-nxg">
          {nxt && (
            <a
              ref={leadRef}
              className="mvcs-lead3"
              href={`/work/${nxt.slug || ''}`}
              aria-label={`${nextLabel}: ${nxt.f1 || ''}`}
              style={{
                '--sw': anim ? 0 : 1,
                '--ir': anim ? 0 : 1,
              }}
            >
              <span className="mvcs-ncv">
                <img
                  src={nimg.src}
                  srcSet={nimg.srcSet}
                  sizes={nimg.sizes}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </span>
              <span className="mvcs-ldr" aria-hidden>
                <i className="mvcs-sweep2" />
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <circle cx="50" cy="50" r="30" />
                  <circle cx="50" cy="50" r="24" />
                  <path d="M50 0v100M0 50h100" />
                </svg>
                <span
                  ref={numRef}
                  className="mvcs-num"
                  style={{ ...D }}
                >
                  {anim ? 3 : 1}
                </span>
                <em style={M}>
                  {leaderText} · {csPad(((idx + 1) % n) + 1)}
                </em>
              </span>
              <span className="mvcs-open" style={M} aria-hidden>
                {nextOpen}
                <Glyph />
              </span>
            </a>
          )}
          <div className="mvcs-nt">
            {nxt ? (
              <>
                <p className="mvcs-k" style={M}>
                  {nextLabel} · {csPad(((idx + 1) % n) + 1)} / {csPad(n)}
                </p>
                <h2
                  className="mvcs-nn"
                  style={{ ...D, fontWeight: 800 }}
                >
                  {nxt.f1}
                </h2>
                <p className="mvcs-nm" style={M}>
                  {[nxt.f2, nxt.f3, nxt.f4].filter(Boolean).join(' · ')}
                </p>
                {nxt.f5 && <p className="mvcs-ns">{nxt.f5}</p>}
              </>
            ) : (
              <p className="mvcs-k" style={M}>
                {soloLabel}
              </p>
            )}
            <div className="mvcs-btns">
              {nxt ? (
                <Btn
                  href={`/work/${nxt.slug || ''}`}
                  label={nextOpen}
                  kind="ghost"
                  sub={nxt.f1}
                />
              ) : (
                <Btn
                  href={backLink || '/work'}
                  label={backLabel}
                  kind="ghost"
                />
              )}
              <Btn href={book} label={ctaLabel} kind="solid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS_CS = `
.mvcs{background:var(--mv-bone);color:var(--mv-ink);--hair:var(--mv-fog)}
.mvcs .mv-dark{color:var(--mv-cloud);--hair:color-mix(in srgb,var(--mv-cloud) 14%,transparent)}
/* dark bands inside a paper section: the dark button faces */
.mvcs .mv-dark .mv-btn.mv-solid{--face:var(--mv-brass);--rim:transparent;--fill:var(--mv-cloud);--fg:var(--mv-ink);--fg2:var(--mv-ink);--chip:var(--mv-ink);--chipfg:var(--mv-brass);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mvcs .mv-dark .mv-btn.mv-ghost{--face:color-mix(in srgb,var(--mv-cloud) 8%,transparent);--rim:color-mix(in srgb,var(--mv-cloud) 26%,transparent);--fill:var(--mv-cloud);--fg:var(--mv-cloud);--fg2:var(--mv-ink);--chip:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--chipfg:var(--mv-cloud);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mvcs .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px} .mvcs .mv-eb i{border-radius:1px}
/* accent word: a text selection on paper (block wipes in, steps), accent text on dark */
.mvcs .mv-it{position:relative;z-index:0;color:var(--mv-ink);font-weight:inherit;padding:0 .06em;margin:0 -.02em}
.mvcs .mv-it::before{content:"";position:absolute;z-index:-1;inset:.08em 0 .02em;background:var(--mv-brass);clip-path:inset(0 100% 0 0);transition:clip-path .7s steps(8,end) var(--pd,600ms)}
.mvcs .mv-hd.is-on .mv-it::before{clip-path:inset(0 0 0 0)}
.mvcs .mv-dark .mv-it{color:var(--mv-brass)} .mvcs .mv-dark .mv-it::before{display:none}
.mvcs-k{margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
/* the reading HUD: a film gate with the timecode, sticky at the bottom of the viewport while the case is on screen */
.mvcs-hudw{position:sticky;z-index:30;top:calc(100vh - 78px);top:calc(100svh - 78px);height:0;pointer-events:none}
.mvcs-hud{position:absolute;right:max(var(--mvg),calc((100% - ${MAXW})/2));top:0;display:grid;grid-template-columns:auto auto auto;align-items:center;column-gap:12px;padding:11px 14px 13px;border-radius:8px;background:${CS_FILM};-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:var(--mv-cloud);font-size:12px;letter-spacing:.1em;text-transform:uppercase;opacity:0;translate:0 12px;transition:opacity .4s,translate .5s cubic-bezier(.2,.8,.2,1);box-shadow:0 18px 40px -20px rgba(0,0,0,.6)}
.mvcs-hud.is-on{opacity:1;translate:0 0} .mvcs-hud.is-ot{opacity:0!important;transition:none!important}
.mvcs-gc{position:absolute;inset:5px;pointer-events:none;background:linear-gradient(${CS_LIGHT},${CS_LIGHT}) 0 0/8px 1px,linear-gradient(${CS_LIGHT},${CS_LIGHT}) 0 0/1px 8px,linear-gradient(${CS_LIGHT},${CS_LIGHT}) 100% 0/8px 1px,linear-gradient(${CS_LIGHT},${CS_LIGHT}) 100% 0/1px 8px,linear-gradient(${CS_LIGHT},${CS_LIGHT}) 0 100%/8px 1px,linear-gradient(${CS_LIGHT},${CS_LIGHT}) 0 100%/1px 8px,linear-gradient(${CS_LIGHT},${CS_LIGHT}) 100% 100%/8px 1px,linear-gradient(${CS_LIGHT},${CS_LIGHT}) 100% 100%/1px 8px;background-repeat:no-repeat;opacity:.55}
.mvcs-rec{width:7px;height:7px;border-radius:50%;background:#FF4D3D;box-shadow:0 0 8px 1px rgba(255,77,61,.6);animation:mvcs-rec 1.6s steps(2,jump-none) infinite}
@keyframes mvcs-rec{50%{opacity:.25}}
.mvcs-sc{max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvcs-tc{font-variant-numeric:tabular-nums;color:${CS_LIGHT};font-size:13px;letter-spacing:.06em}
.mvcs-qb{position:absolute;left:14px;right:14px;bottom:6px;height:2px;background:color-mix(in srgb,var(--mv-cloud) 14%,transparent)} .mvcs-qb::after{content:"";position:absolute;inset:0;background:var(--mv-brass);transform-origin:0 50%;scale:var(--q,0) 1}
/* dark top */
.mvcs-dk{background:var(--mv-night)}
.mvcs-top{padding:clamp(104px,11vw,150px) 0 clamp(56px,6vw,90px)}
.mvcs-bar{display:flex;justify-content:space-between;align-items:center;gap:20px;padding-bottom:18px;margin-bottom:clamp(32px,4vw,56px);border-bottom:1px solid var(--hair);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.mvcs-back{display:inline-flex;align-items:center;gap:10px;min-height:32px;text-decoration:none;color:var(--mv-cloud)} .mvcs-back svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:translate .4s cubic-bezier(.2,.8,.2,1)} .mvcs-back:hover svg{translate:-4px 0}
.mvcs-roll{color:var(--mv-mut)} .mvcs-roll b{font-weight:500;color:var(--mv-cloud)}
.mvcs-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,380px);gap:clamp(32px,4vw,72px);align-items:end}
.mvcs-hl{display:flex;flex-direction:column;gap:22px;min-width:0}
.mvcs-h1.mv-hd{letter-spacing:-.055em;text-wrap:balance;overflow-wrap:anywhere}
/* the call sheet: a paper slip, typewriter mono, slightly askew */
.mvcs-sheet{--mv-mut:color-mix(in srgb,var(--mv-stone) 60%,var(--mv-ink));position:relative;padding:22px 24px 20px 40px;border-radius:3px;background:var(--mv-bone);background-image:linear-gradient(180deg,rgba(255,255,255,.4),rgba(0,0,0,.03));color:var(--mv-ink);rotate:-1.4deg;box-shadow:0 30px 60px -26px rgba(0,0,0,.75),0 2px 0 rgba(0,0,0,.2);transition:rotate .6s cubic-bezier(.2,.8,.2,1),translate .6s cubic-bezier(.2,.8,.2,1)}
.mvcs-sheet:hover{rotate:0deg;translate:0 -6px}
.mvcs-holes{position:absolute;left:12px;top:24px;bottom:24px;display:flex;flex-direction:column;justify-content:space-between} .mvcs-holes b{display:block;width:10px;height:10px;border-radius:50%;background:var(--mv-night);box-shadow:inset 0 1px 2px rgba(0,0,0,.6)}
.mvcs-sht{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:0 0 14px;padding-bottom:10px;border-bottom:3px double color-mix(in srgb,var(--mv-ink) 60%,transparent);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.mvcs-sht b{font-size:15px;font-weight:600;letter-spacing:.14em}
.mvcs-dl{margin:0;display:flex;flex-direction:column}
.mvcs-dl div{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;padding:8px 0;border-bottom:1px dashed color-mix(in srgb,var(--mv-ink) 22%,transparent)}
.mvcs-dl dt{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut);padding-top:2px} .mvcs-dl dd{margin:0;font-size:13.5px;line-height:1.35;letter-spacing:.01em}
.mvcs-sig{position:relative;display:flex;align-items:baseline;gap:12px;margin:14px 0 0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)} .mvcs-sig b{font-weight:500;font-size:13px;letter-spacing:.04em;text-transform:none;color:var(--mv-ink)}
.mvcs-stamp{position:absolute;right:-6px;bottom:-4px;padding:5px 9px 4px;border:2px solid color-mix(in srgb,var(--mv-ink) 70%,transparent);border-radius:4px;font-style:normal;font-size:12px;font-weight:600;letter-spacing:.16em;color:color-mix(in srgb,var(--mv-ink) 78%,transparent);rotate:-9deg;mix-blend-mode:multiply;opacity:.85}
.mvcs-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;padding-top:12px;border-top:1px dashed color-mix(in srgb,var(--mv-ink) 24%,transparent)}
.mvcs-hero-btns{display:flex;align-items:center;gap:12px;margin-top:28px;flex-wrap:wrap}
.mvcs-hero-proto-btn{display:inline-flex;align-items:center;gap:9px;padding:12px 20px;border-radius:6px;background:var(--mv-brass);color:var(--mv-ink);font:600 12px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;transition:all .25s ease;box-shadow:0 10px 24px -6px rgba(0,0,0,.5)}
.mvcs-hero-proto-btn:hover{background:#FFF1DA;transform:translateY(-2px);box-shadow:0 14px 28px -4px rgba(0,0,0,.7)}
.mvcs-hero-proto-btn svg{width:14px;height:14px;flex-shrink:0}
.mvcs-hero-live-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:6px;border:1px solid rgba(255,241,218,.28);background:rgba(255,255,255,.05);color:var(--mv-cloud);font:500 12px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;transition:all .25s ease}
.mvcs-hero-live-btn:hover{background:rgba(255,255,255,.14);border-color:var(--mv-cloud);transform:translateY(-1px)}
.mvcs-ext-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:6px;font:600 11px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;font-weight:700;text-decoration:none;transition:all .2s;color:var(--mv-ink);background:rgba(0,0,0,.06);box-shadow:inset 0 0 0 1px rgba(0,0,0,.18)}
.mvcs-ext-btn.is-figma{background:var(--mv-brass);color:var(--mv-ink);box-shadow:none}
.mvcs-ext-btn.is-figma:hover{background:#FFF1DA}
.mvcs-ext-btn:hover{background:var(--mv-brass);color:var(--mv-ink);box-shadow:none;transform:translateY(-1px)}
.mvcs-ext-btn svg{width:12px;height:12px;flex-shrink:0}
/* the cover, on a split ground (dark above, paper below) */
.mvcs-cv{background:linear-gradient(180deg,var(--mv-night) 50%,var(--mv-bone) 50%)}
.mvcs-cover{--hx:60%;--hy:35%;position:relative;aspect-ratio:16/10;border-radius:8px;overflow:hidden;background:color-mix(in srgb,var(--mv-stone) 30%,var(--mv-night));isolation:isolate;box-shadow:0 40px 80px -40px rgba(0,0,0,.6)}
.mvcs-cover img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;user-select:none}
.mvcs-cover-figma-badge{position:absolute;z-index:10;right:20px;bottom:20px;display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:6px;background:var(--mv-brass);color:var(--mv-ink);font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;text-decoration:none;box-shadow:0 12px 28px -4px rgba(0,0,0,.6),0 0 0 1px rgba(0,0,0,.15);transition:all .25s ease;cursor:pointer}
.mvcs-cover-figma-badge:hover{transform:translateY(-2px);background:#FFF1DA;box-shadow:0 18px 36px -4px rgba(0,0,0,.75)}
.mvcs-sweep{position:absolute;inset:-10% -30%;z-index:1;background:linear-gradient(100deg,transparent 30%,rgba(255,226,180,.10) 42%,rgba(255,241,218,.34) 50%,rgba(255,226,180,.10) 58%,transparent 70%);mix-blend-mode:screen;animation:mvcs-sweep 11s cubic-bezier(.45,0,.55,1) infinite alternate;pointer-events:none}
@keyframes mvcs-sweep{from{transform:translate3d(-38%,0,0)}to{transform:translate3d(38%,0,0)}}
.mvcs-key{position:absolute;inset:0;z-index:1;background:radial-gradient(34% 34% at var(--hx) var(--hy),rgba(255,236,208,.5),transparent 70%);mix-blend-mode:soft-light;opacity:0;transition:opacity .5s;pointer-events:none} .mvcs-cover:hover .mvcs-key{opacity:1}
.mvcs-cm i{position:absolute;z-index:2;width:22px;height:22px;border-color:${CS_LIGHT};border-style:solid;border-width:0;opacity:.8} .mvcs-cm i:nth-child(1){left:18px;top:18px;border-left-width:1.5px;border-top-width:1.5px} .mvcs-cm i:nth-child(2){right:18px;top:18px;border-right-width:1.5px;border-top-width:1.5px} .mvcs-cm i:nth-child(3){left:18px;bottom:18px;border-left-width:1.5px;border-bottom-width:1.5px} .mvcs-cm i:nth-child(4){right:18px;bottom:18px;border-right-width:1.5px;border-bottom-width:1.5px}
.mvcs-ctag{position:absolute;z-index:2;left:48px;top:20px;padding:4px 8px;border-radius:4px;background:color-mix(in srgb,${CS_FILM} 60%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--mv-cloud);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
/* paper */
.mvcs-pp{padding:clamp(64px,7vw,110px) 0 clamp(80px,9vw,140px)}
.mvcs-lead{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:clamp(32px,5vw,96px);align-items:end;padding-bottom:clamp(56px,6vw,96px);border-bottom:1px solid var(--hair)}
.mvcs-lead>div{display:flex;flex-direction:column;gap:18px}
.mvcs-lt{margin:0;font-size:clamp(28px,2.9vw,46px);line-height:1.04;letter-spacing:-.035em;font-stretch:108%;text-wrap:balance}
.mvcs-stat{padding-left:24px;border-left:1px solid var(--hair)}
.mvcs-big{margin:0;font-size:clamp(72px,8vw,136px);line-height:.85;letter-spacing:-.06em;font-weight:800;font-stretch:118%;font-variant-numeric:tabular-nums}
.mvcs-big.is-txt{font-size:clamp(30px,2.8vw,42px);line-height:1.02;letter-spacing:-.035em}
.mvcs-bl{margin:0;font-size:15px;line-height:1.45;color:var(--mv-mut)}
/* scenes: a scene number + heading on the left, the text on the right */
.mvcs-ch{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:clamp(32px,5vw,96px);padding:clamp(56px,6vw,96px) 0;border-bottom:1px solid var(--hair)}
.mvcs-ch.is-wide{grid-template-columns:minmax(0,4fr) minmax(0,7fr)}
.mvcs-ch.is-wide .mvcs-split{grid-column:1 / -1}
.mvcs-sh{display:flex;flex-direction:column;gap:16px;align-self:start}
.mvcs-sn{font-size:12px;letter-spacing:.14em;color:var(--mv-mut)}
.mvcs-body{display:flex;flex-direction:column;gap:22px;max-width:680px}
.mvcs-body p,.mvcs-intro{margin:0;font-size:18px;line-height:1.62;color:color-mix(in srgb,var(--mv-ink) 88%,transparent)}
.mvcs-intro{max-width:680px;align-self:end}
.mvcs-did{list-style:none;margin:0;padding:0;counter-reset:d;max-width:680px}
.mvcs-did li{display:grid;grid-template-columns:44px minmax(0,1fr);gap:12px;padding:18px 0;border-top:1px solid var(--hair)} .mvcs-did li:first-child{border-top:0;padding-top:4px}
.mvcs-did span{font-size:12px;letter-spacing:.1em;padding-top:5px;color:var(--mv-mut)} .mvcs-did p{margin:0;font-size:18px;line-height:1.5}
/* design → code */
.mvcs-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(16px,1.6vw,24px);margin-top:clamp(8px,1vw,16px)}
.mvcs-canvas{position:relative;display:flex;flex-direction:column;justify-content:center;gap:10px;padding:clamp(28px,3.4vw,56px);border-radius:10px;background-color:color-mix(in srgb,var(--mv-ink) 5%,var(--mv-bone));background-image:radial-gradient(circle,color-mix(in srgb,var(--mv-ink) 16%,transparent) 1px,transparent 1.3px);background-size:18px 18px}
.mvcs-fl{display:flex;align-items:center;gap:7px;margin:0;font-size:12px;letter-spacing:.06em;color:var(--mv-mut)} .mvcs-fl svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:1.3}
.mvcs-frame{position:relative;aspect-ratio:16/10;background:var(--mv-night);box-shadow:0 20px 40px -24px rgba(0,0,0,.5)}
.mvcs-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.mvcs-frame::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05) 40%,rgba(0,0,0,.5))}
.mvcs-grid{position:absolute;inset:0 6%;z-index:1;display:grid;grid-template-columns:repeat(12,1fr);gap:2%;opacity:0;transition:opacity .4s} .mvcs-grid i{background:color-mix(in srgb,var(--mv-brass) 16%,transparent);box-shadow:inset 1px 0 0 color-mix(in srgb,var(--mv-brass) 40%,transparent),inset -1px 0 0 color-mix(in srgb,var(--mv-brass) 40%,transparent)}
.mvcs-canvas:hover .mvcs-grid{opacity:1}
.mvcs-tl{position:absolute;z-index:2;left:6%;bottom:8%;color:#fff;font-size:clamp(28px,4.4vw,68px);line-height:.85;letter-spacing:-.05em;font-stretch:118%;outline:1px dashed rgba(255,255,255,.55);outline-offset:6px;white-space:nowrap;max-width:88%;overflow:hidden;text-overflow:ellipsis}
.mvcs-sel{position:absolute;z-index:3;inset:-1px;box-shadow:0 0 0 1.5px var(--mv-brass);pointer-events:none}
.mvcs-sel i{position:absolute;width:8px;height:8px;background:var(--mv-cloud);box-shadow:0 0 0 1.5px var(--mv-brass);translate:-50% -50%} .mvcs-sel i:nth-child(1){left:0;top:0} .mvcs-sel i:nth-child(2){left:100%;top:0} .mvcs-sel i:nth-child(3){left:0;top:100%} .mvcs-sel i:nth-child(4){left:100%;top:100%}
.mvcs-sel b{position:absolute;left:50%;top:calc(100% + 10px);translate:-50% 0;padding:2px 7px;border-radius:4px;background:var(--mv-brass);color:var(--mv-ink);font-size:12px;font-weight:500;white-space:nowrap}
.mvcs-code{position:relative;display:flex;flex-direction:column;min-height:100%;border-radius:10px;background:var(--mv-night);color:color-mix(in srgb,var(--mv-cloud) 88%,transparent);overflow:hidden;box-shadow:0 30px 60px -34px rgba(0,0,0,.6)}
.mvcs-tab{display:flex;justify-content:space-between;align-items:center;margin:0;padding:12px 18px;border-bottom:1px solid color-mix(in srgb,var(--mv-cloud) 10%,transparent);font-size:12px;letter-spacing:.04em;color:var(--mv-cloud)} .mvcs-tab em{font-style:normal;font-size:12px;letter-spacing:.12em;padding:3px 6px;border-radius:4px;background:var(--mv-brass);color:var(--mv-ink)}
.mvcs-code pre{flex:1;margin:0;padding:18px 0 22px;overflow-x:auto;font:inherit;font-size:13px;line-height:1.75;scrollbar-width:thin}
.mvcs-ln{--c:999;position:relative;display:flex;padding:0 18px 0 0;white-space:pre;transition:background .2s}
.mvcs-ln:hover{background:color-mix(in srgb,var(--mv-cloud) 5%,transparent)}
.mvcs-ln em{flex:none;width:44px;padding-right:14px;text-align:right;font-style:normal;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent);user-select:none}
.mvcs-ln code{position:relative;font:inherit;clip-path:inset(-2px calc(100% - var(--c) * 1ch) -2px -2px)}
.mvcs.is-anim .mvcs-ln{--c:0}
.mvcs-ln.is-cur code::after{content:"";position:absolute;left:calc(var(--c) * 1ch);top:.2em;bottom:.2em;width:.55ch;background:var(--mv-brass);animation:mvcs-rec 1s steps(2,jump-none) infinite}
.mvcs-ln.is-cur code{clip-path:none;-webkit-mask:linear-gradient(90deg,#000 calc(var(--c) * 1ch + .6ch),transparent 0);mask:linear-gradient(90deg,#000 calc(var(--c) * 1ch + .6ch),transparent 0)}
.mvcs-hl-t{font-style:normal;color:#9BE7FF} .mvcs-hl-s{font-style:normal;color:#FFD08A} .mvcs-hl-n{font-style:normal;color:#D5C8FF} .mvcs-hl-c{font-style:normal;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)} .mvcs-hl-k{font-style:normal;color:#FF9CCB}
/* result: three takes */
.mvcs-mets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:10px 0 0;border-top:1px solid var(--mv-ink)}
.mvcs-mets div{display:flex;flex-direction:column;gap:10px;padding:18px 18px 4px 0} .mvcs-mets div+div{padding-left:18px;border-left:1px solid var(--hair)}
.mvcs-mets dt{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mv-mut)}
.mvcs-mets dd{margin:0;font-size:clamp(36px,3.6vw,56px);line-height:.9;letter-spacing:-.045em;font-stretch:115%}
.mvcs-mets dd.mvcs-ml{font-size:12px;line-height:1.4;letter-spacing:.06em;text-transform:uppercase;color:var(--mv-mut)}
/* gallery: a film strip */
.mvcs-gal{display:flex;flex-direction:column;gap:28px;padding:clamp(56px,6vw,96px) 0 0}
.mvcs-strip{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;padding:36px 14px;border-radius:6px;background:${CS_FILM}}
.mvcs-strip::before,.mvcs-strip::after{content:"";position:absolute;left:0;right:0;top:6px;height:24px;background:var(--mv-bone);-webkit-mask:${CS_HOLE} 6px 0/26px 24px repeat-x;mask:${CS_HOLE} 6px 0/26px 24px repeat-x}
.mvcs-strip::after{top:auto;bottom:6px}
.mvcs-gf{margin:0;display:flex;flex-direction:column;gap:10px}
.mvcs-gw{position:relative;display:block;width:100%;aspect-ratio:16/10;overflow:hidden;border-radius:4px;background:#1b1a18}
.mvcs-gw img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;filter:saturate(.95);transition:scale .9s cubic-bezier(.2,.8,.2,1),filter .6s}
.mvcs-gw::after{content:"";position:absolute;inset:-20%;background:radial-gradient(40% 60% at 20% 30%,rgba(255,170,90,.6),transparent 70%);mix-blend-mode:screen;opacity:0;translate:-20% 0;transition:opacity .6s,translate 1.2s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.mvcs-gf:hover .mvcs-gw img{scale:1.045;filter:none} .mvcs-gf:hover .mvcs-gw::after{opacity:.7;translate:10% 0}
.mvcs-gf figcaption{display:flex;justify-content:space-between;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)} .mvcs-gf figcaption em{font-style:normal;color:${CS_EDGE}}
/* the client's words: a press clipping */
.mvcs-q{position:relative;width:min(760px,100%);margin:clamp(72px,8vw,120px) auto 0;rotate:-1.2deg;filter:drop-shadow(0 2px 1px rgba(0,0,0,.06)) drop-shadow(0 14px 22px rgba(0,0,0,.12));transition:rotate .5s cubic-bezier(.2,.8,.2,1)}
.mvcs-q:hover{rotate:0deg}
.mvcs-tape{position:absolute;z-index:2;left:50%;top:-13px;width:120px;height:30px;background:color-mix(in srgb,var(--mv-brass) 72%,transparent);transform:translate(-50%,0) rotate(-4deg);box-shadow:inset 0 0 0 100px rgba(255,255,255,.12);clip-path:polygon(0 12%,2% 0,97% 10%,100% 0,98% 100%,4% 88%,0 100%);transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.mvcs-q:hover .mvcs-tape{transform:translate(-50%,-5px) rotate(4deg) scaleY(.92)}
.mvcs-qp{padding:40px clamp(24px,3.4vw,48px) 34px;background:color-mix(in srgb,var(--mv-cloud) 62%,var(--mv-bone));clip-path:polygon(0 4px,4% 0,9% 5px,15% 1px,22% 6px,30% 2px,38% 5px,46% 0,55% 4px,63% 1px,71% 6px,79% 2px,87% 5px,94% 0,100% 4px,100% calc(100% - 3px),95% 100%,88% calc(100% - 5px),80% calc(100% - 1px),71% calc(100% - 6px),62% calc(100% - 2px),53% 100%,44% calc(100% - 5px),35% calc(100% - 1px),26% calc(100% - 6px),17% calc(100% - 2px),9% 100%,0 calc(100% - 4px))}
.mvcs-qd{display:flex;justify-content:space-between;gap:12px;margin:0 0 20px;padding-bottom:10px;border-bottom:3px double color-mix(in srgb,var(--mv-ink) 55%,transparent);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.mvcs-q blockquote{margin:0;font-size:clamp(26px,2.5vw,38px);line-height:1.08;letter-spacing:-.03em;font-weight:700;font-stretch:108%;text-wrap:pretty} .mvcs-q blockquote span{display:block;height:.5em;font-size:2.2em;line-height:.9;font-weight:800}
.mvcs-q figcaption{display:flex;align-items:center;gap:14px;margin-top:26px;padding-top:14px;border-top:1px solid color-mix(in srgb,var(--mv-ink) 16%,transparent)}
.mvcs-q figcaption img{width:52px;height:52px;border-radius:4px;object-fit:cover;filter:grayscale(1) contrast(1.1)}
.mvcs-q figcaption b{display:block;font-size:15px;font-weight:650} .mvcs-q figcaption em{display:block;margin-top:3px;font-style:normal;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut)}
/* next project: the leader */
.mvcs-nx{padding:clamp(80px,9vw,140px) 0}
.mvcs-nxg{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(32px,4vw,72px);align-items:center}
.mvcs-lead3{--sw:0;--ir:0;position:relative;display:block;aspect-ratio:16/10;border-radius:4px;overflow:hidden;background:#1d1c1a;text-decoration:none;color:var(--mv-cloud);isolation:isolate}
.mvcs-ncv{position:absolute;inset:0;z-index:1;clip-path:circle(calc(var(--ir) * 80%) at 50% 50%)} .mvcs-ncv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;scale:calc(1.18 - var(--ir) * .18);transition:scale .9s cubic-bezier(.2,.8,.2,1)}
.mvcs-ldr{position:absolute;inset:0;z-index:2;display:grid;place-items:center;opacity:calc(1 - var(--ir) * 1.25);background:radial-gradient(circle at 50% 50%,#3a3834,#1d1c1a 72%);pointer-events:none}
.mvcs-ldr svg{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:color-mix(in srgb,${CS_LIGHT} 50%,transparent);stroke-width:.35}
.mvcs-sweep2{position:absolute;left:50%;top:50%;width:150%;aspect-ratio:1;translate:-50% -50%;background:conic-gradient(from 0deg,rgba(255,241,218,.2) 0deg,rgba(255,241,218,.2) calc(var(--sw) * 360deg),transparent calc(var(--sw) * 360deg))}
.mvcs-num{position:relative;font-size:clamp(90px,11vw,180px);line-height:1;font-weight:800;font-stretch:118%;color:${CS_LIGHT};font-variant-numeric:tabular-nums}
.mvcs-ldr em{position:absolute;left:16px;bottom:14px;font-style:normal;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,${CS_LIGHT} 78%,transparent)}
.mvcs-open{position:absolute;z-index:3;right:14px;bottom:14px;display:inline-flex;align-items:center;gap:6px;padding:8px 9px 8px 12px;border-radius:10px;background:var(--mv-brass);color:var(--mv-ink);font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:0;translate:0 8px;transition:opacity .3s,translate .45s cubic-bezier(.2,.8,.2,1)} .mvcs-open svg{width:13px;height:13px}
.mvcs-lead3:hover .mvcs-open,.mvcs-lead3:focus-visible .mvcs-open{opacity:1;translate:0 0} .mvcs-lead3:hover .mvcs-ncv img{scale:1.04}
.mvcs-nt{display:flex;flex-direction:column;gap:16px;align-items:flex-start}
.mvcs-nn{margin:0;font-size:clamp(56px,7vw,112px);line-height:.86;letter-spacing:-.055em;font-stretch:118%;overflow-wrap:anywhere}
.mvcs-nm{margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvcs-ns{margin:0;max-width:420px;font-size:16px;line-height:1.55;color:color-mix(in srgb,var(--mv-cloud) 80%,transparent)}
.mvcs-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
/* tablet */
.mvcs.is-tab .mvcs-hero{grid-template-columns:minmax(0,1fr) minmax(280px,340px)}
.mvcs.is-tab .mvcs-ch,.mvcs.is-tab .mvcs-lead{grid-template-columns:1fr;gap:28px}
.mvcs.is-tab .mvcs-stat{padding:0;border:0}
.mvcs.is-tab .mvcs-split{grid-template-columns:1fr}
.mvcs.is-tab .mvcs-nxg{grid-template-columns:1fr}
/* phone */
.mvcs.is-ph .mvcs-top{padding-top:96px}
.mvcs.is-ph .mvcs-hero{grid-template-columns:1fr;gap:36px}
.mvcs.is-ph .mvcs-sheet{rotate:0deg;padding:20px 18px 18px 34px} .mvcs.is-ph .mvcs-holes{left:10px}
.mvcs.is-ph .mvcs-dl div{grid-template-columns:84px minmax(0,1fr)}
.mvcs.is-ph .mvcs-cover{aspect-ratio:4/3}
.mvcs.is-ph .mvcs-ctag{left:44px;top:16px}
.mvcs.is-ph .mvcs-lead,.mvcs.is-ph .mvcs-ch{grid-template-columns:1fr;gap:24px}
.mvcs.is-ph .mvcs-stat{padding:0;border:0}
.mvcs.is-ph .mvcs-body p,.mvcs.is-ph .mvcs-intro,.mvcs.is-ph .mvcs-did p{font-size:16.5px}
.mvcs.is-ph .mvcs-split{grid-template-columns:1fr}
.mvcs.is-ph .mvcs-canvas{padding:22px 18px 34px}
.mvcs.is-ph .mvcs-code pre{font-size:12px} .mvcs.is-ph .mvcs-ln{white-space:pre-wrap;overflow-wrap:anywhere} .mvcs.is-ph .mvcs-ln code{min-width:0} .mvcs.is-ph .mvcs-sig{flex-wrap:wrap;align-items:center} .mvcs.is-ph .mvcs-sig>span,.mvcs.is-ph .mvcs-sig>b{flex:none} .mvcs.is-ph .mvcs-stamp{position:static;display:inline-block;margin:0 0 0 auto} @media (max-width:809px){.mvcs-hudw{display:none}}
/* keyboard: the code panel and the phone still-strip are keyboard scrollers (tab stops) — inset ring on the night ground, never the browser default */
.mvcs .mvcs-code pre:focus-visible{outline:3px solid var(--mv-cloud)!important;outline-offset:-3px!important;box-shadow:none!important}
.mvcs .mvcs-strip:focus-visible{outline:3px solid var(--mv-cloud)!important;outline-offset:-6px!important;box-shadow:inset 0 0 0 3px var(--mv-ink)!important}
.mvcs.is-ph .mvcs-ln em{width:34px;padding-right:10px}
.mvcs.is-ph .mvcs-mets{grid-template-columns:1fr} .mvcs.is-ph .mvcs-mets div+div{padding-left:0;border-left:0;border-top:1px solid var(--hair)} .mvcs.is-ph .mvcs-mets div{padding:16px 0}
.mvcs.is-ph .mvcs-strip{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 -20px;border-radius:0;padding:34px 20px;scroll-padding-inline:20px} .mvcs.is-ph .mvcs-strip::-webkit-scrollbar{display:none}
.mvcs.is-ph .mvcs-gf{flex:none;width:82vw;scroll-snap-align:start} .mvcs.is-ph .mvcs-gf .mvcs-gw{aspect-ratio:16/10;width:100%;height:auto}
.mvcs.is-ph .mvcs-q{rotate:0deg}
.mvcs.is-ph .mvcs-nxg{grid-template-columns:1fr}
.mvcs.is-ph .mvcs-btns{flex-direction:column;align-items:stretch;width:100%} .mvcs.is-ph .mvcs-btns .mv-btn{width:100%}
.mvcs.is-ph .mvcs-hud{right:12px;left:12px;grid-template-columns:auto minmax(0,1fr) auto} .mvcs.is-ph .mvcs-hudw{top:calc(100svh - 66px)}
@media (prefers-reduced-motion:reduce){.mvcs-sweep,.mvcs-rec{animation:none} .mvcs-cover img{translate:0 0}}
`;
