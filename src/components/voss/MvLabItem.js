'use client';

import {
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
  useNearFocus,
  useScrollVars,
  rise,
  pick,
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
import { defaultLab } from './siteData';

const MVLT_RAIL = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='34'><rect x='7' y='10' width='12' height='14' rx='3'/></svg>")`;

const mvltHl = (line, k) => {
  const out = [];
  const re =
    /(\/\/.*$)|("[^"]*"|'[^']*'|`[^`]*`)|\b(const|let|var|function|return|for|of|in|if|else|new|import|from|export|await|async|while|true|false|null)\b|(\b\d+(?:\.\d+)?\b)/g;
  let last = 0,
    m,
    i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    out.push(
      <span
        key={`${k}-${i++}`}
        className={
          m[1]
            ? 'mvlt-c'
            : m[2]
            ? 'mvlt-s'
            : m[3]
            ? 'mvlt-k'
            : 'mvlt-n'
        }
      >
        {m[0]}
      </span>
    );
    last = re.lastIndex;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
};

const mvltTc = (sec, fps = 24) => {
  const f = Math.floor(sec * fps);
  const p = (x) => String(x).padStart(2, '0');
  return `${p(Math.floor(f / (fps * 3600)))}:${p(Math.floor(f / (fps * 60)) % 60)}:${p(Math.floor(f / fps) % 60)}:${p(f % fps)}`;
};

// inline markdown: **bold** and [text](/url)
const UI_Inl = (t) => {
  const out = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0,
    m,
    k = 0;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push(t.slice(last, m.index));
    out.push(
      m[1] ? (
        <strong key={k++}>{m[1]}</strong>
      ) : (
        <a key={k++} href={m[3]}>
          {m[2]}
        </a>
      )
    );
    last = re.lastIndex;
  }
  if (last < t.length) out.push(t.slice(last));
  return out;
};

const UI_Md = ({ text, D, className = '' }) => {
  const lines = String(text || '')
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out = [];
  let list = [];
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={'u' + out.length}>
          {list.map((x, i) => (
            <li key={i}>{UI_Inl(x)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };
  lines.forEach((l) => {
    if (l.startsWith('- ')) {
      list.push(l.slice(2));
      return;
    }
    flush();
    if (l.startsWith('## '))
      out.push(
        <h2 key={out.length} style={D}>
          {l.slice(3)}
        </h2>
      );
    else if (l.startsWith('> '))
      out.push(
        <blockquote key={out.length} style={D}>
          {UI_Inl(l.slice(2))}
        </blockquote>
      );
    else out.push(<p key={out.length}>{UI_Inl(l)}</p>);
  });
  flush();
  return <div className={`mv-md ${className}`}>{out}</div>;
};

export default function MvLabItem(props = {}) {
  const {
    slug = '',
    title = '',
    backLabel = 'Lab',
    backLink = '/lab',
    eyebrow = 'Outtake {n} — {kind}',
    kindLabel = 'Kind',
    yearLabel = 'Year',
    toolsLabel = 'Tools',
    rollLabel = 'Roll',
    tcLabel = 'TC',
    frameLabel = 'Frame',
    edgeCode = 'SSB-16',
    demoLabel = 'Live demo',
    demoLink = 'https://codepen.io',
    sourceLabel = 'Source',
    sourceLink = 'https://github.com',
    ideaTitle = 'The idea',
    ideaBody = '',
    buildTitle = "How it's built",
    buildBody = '',
    codeName = 'loop.ts',
    code = '',
    learnTitle = 'What I learned',
    learnBody = '',
    logTitle = 'Camera report',
    moreTitle = 'More from the lab',
    moreLink = '#lab',
    moreLabel = 'All experiments',
    items = defaultLab,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const root = useRef(null);
  const tcA = useRef(null);
  const tcB = useRef(null);
  const frA = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm, 0.02);
  useMagnet(root, live);
  useNearFocus(root, live);

  const rows = items || defaultLab;
  const row = (slug && rows.find((r) => r.slug === slug)) || rows[0] || {};
  const idx = Math.max(0, rows.indexOf(row));
  const n = String(idx + 1).padStart(2, '0');
  const T1 = pick(title, row.f1 || 'Untitled experiment');
  const tools = listOf(row.f4 || '');
  const anim = live && !rm && !still;
  const RUN = 94; // seconds of film

  useScrollVars(root, anim, rm, (sp) => {
    const t = mvltTc(sp * RUN);
    const f = String(Math.floor(sp * RUN * 24)).padStart(4, '0');
    if (tcA.current && tcA.current.textContent !== t) {
      tcA.current.textContent = t;
      if (tcB.current) tcB.current.textContent = t;
    }
    if (frA.current && frA.current.textContent !== f)
      frA.current.textContent = f;
  });

  const tc0 = anim ? mvltTc(0) : mvltTc(RUN * 0.5),
    fr0 = anim ? '0000' : String(Math.floor(RUN * 12)).padStart(4, '0');
  const eb = eyebrow
    .replace(/\{n\}/g, n)
    .replace(/\{kind\}/g, row.f2 || 'Experiment');
  const others = rows.filter((r) => r !== row).slice(0, 5);
  const codeLines = String(code || MVLT_CODE)
    .replace(/\r/g, '')
    .split('\n');
  const img = imgOr(row);

  return (
    <section
      ref={root}
      className={`mv mv-sec mv-dark mvlt${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}${anim ? ' is-anim' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_LT + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvlt-top">
          <nav
            className="mvlt-crumb"
            style={{ ...M, ...rise(on, 0, 8) }}
            aria-label="Breadcrumb"
          >
            <a href={backLink || '/lab'}>
              <IcoArrow s={13} />
              <span>{backLabel}</span>
            </a>
            <i aria-hidden>/</i>
            <span>{row.f2 || ''}</span>
          </nav>
          <div className="mvlt-hg">
            <div className="mvlt-hl">
              <Eyebrow text={eb} on={on} M={M} delay={60} />
              <Head
                tag="h1"
                text={T1}
                on={on}
                D={D}
                size={
                  phone
                    ? 'clamp(44px,12vw,60px)'
                    : 'clamp(56px,6.4vw,104px)'
                }
                lh={0.9}
                delay={120}
                style={{ fontWeight: 780, fontStretch: '116%' }}
              />
            </div>
            <div className="mvlt-hr" style={rise(on, 420, 14)}>
              {row.f5 && <p className="mvlt-lead">{row.f5}</p>}
              <p className="mvlt-meta" style={M}>
                {row.f2 && <span>{row.f2}</span>}
                {row.f3 && <span>{row.f3}</span>}
                {tools.map((t, i) => (
                  <i key={i}>{t}</i>
                ))}
              </p>
              {(demoLink || sourceLink) && (
                <div className="mvlt-btns">
                  {demoLink && (
                    <Btn
                      href={demoLink}
                      label={demoLabel}
                      kind="solid"
                    />
                  )}
                  {sourceLink && (
                    <Btn
                      href={sourceLink}
                      label={sourceLabel}
                      kind="ghost"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        <figure className="mvlt-gate" style={rise(on, 300, 30)}>
          <i className="mvlt-rail" aria-hidden />
          <div className="mvlt-win">
            <img
              {...RS(img, phone ? '100vw' : '86vw')}
              alt={row.f1 || ''}
              decoding="async"
              loading="eager"
              draggable={false}
            />
            <i className="mvlt-vig" aria-hidden />
            <span
              className="mvlt-osd mvlt-osd-a"
              style={M}
              aria-hidden
            >
              <i className="mvlt-rec" />
              {tcLabel} <span ref={tcA}>{tc0}</span>
            </span>
            <span
              className="mvlt-osd mvlt-osd-b"
              style={M}
              aria-hidden
            >
              {frameLabel} <span ref={frA}>{fr0}</span>
            </span>
            <span className="mvlt-corner" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
          <i className="mvlt-rail is-r" aria-hidden />
        </figure>
        <div className="mvlt-body">
          <aside className="mvlt-log" style={M} aria-label={logTitle}>
            <p className="mvlt-logt">{logTitle}</p>
            <dl>
              <div>
                <dt>{rollLabel}</dt>
                <dd>
                  {edgeCode} / {n}A
                </dd>
              </div>
              <div>
                <dt>{tcLabel}</dt>
                <dd>
                  <span ref={tcB}>{tc0}</span>
                </dd>
              </div>
              {row.f2 && (
                <div>
                  <dt>{kindLabel}</dt>
                  <dd>{row.f2}</dd>
                </div>
              )}
              {row.f3 && (
                <div>
                  <dt>{yearLabel}</dt>
                  <dd>{row.f3}</dd>
                </div>
              )}
              {tools.length > 0 && (
                <div>
                  <dt>{toolsLabel}</dt>
                  <dd>{tools.join(', ')}</dd>
                </div>
              )}
            </dl>
          </aside>
          <article className="mvlt-art">
            <section className="mvlt-part">
              <h2 style={D}>
                <em style={M}>01</em>
                {ideaTitle}
              </h2>
              <UI_Md
                text={ideaBody || MVLT_IDEA}
                D={D}
                className="mvlt-md"
              />
            </section>
            <section className="mvlt-part">
              <h2 style={D}>
                <em style={M}>02</em>
                {buildTitle}
              </h2>
              <UI_Md
                text={buildBody || MVLT_BUILD}
                D={D}
                className="mvlt-md"
              />
              <figure className="mvlt-code" style={M}>
                <figcaption>
                  <span>
                    <i />
                    <i />
                    <i />
                  </span>
                  {codeName}
                </figcaption>
                <pre
                  tabIndex={0}
                  className="mv-inring"
                  aria-label={codeName}
                >
                  <code>
                    {codeLines.map((l, i) => (
                      <span key={i} className="mvlt-ln">
                        <b aria-hidden>{i + 1}</b>
                        <span>
                          {mvltHl(l, i)}
                          {'\n'}
                        </span>
                      </span>
                    ))}
                  </code>
                </pre>
              </figure>
            </section>
            <section className="mvlt-part">
              <h2 style={D}>
                <em style={M}>03</em>
                {learnTitle}
              </h2>
              <UI_Md
                text={learnBody || MVLT_LEARN}
                D={D}
                className="mvlt-md"
              />
            </section>
          </article>
        </div>
        {others.length > 0 && (
          <div className="mvlt-more">
            <div className="mvlt-moreh">
              <h2 style={D}>{moreTitle}</h2>
              {moreLabel && (
                <Btn
                  href={moreLink || '#lab'}
                  label={moreLabel}
                  kind="ghost"
                />
              )}
            </div>
            <ul className="mvlt-strip mv-inring">
              {others.map((r, i) => (
                <li key={r.slug || i}>
                  <a href={`#lab-${r.slug || i}`}>
                    <span className="mvlt-sf" aria-hidden>
                      <img
                        {...RS(
                          imgOr(r),
                          phone ? '60vw' : '260px'
                        )}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="mvlt-sk" style={M}>
                      {[r.f2, r.f3]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    <span className="mvlt-st" style={D}>
                      {r.f1}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

const MVLT_IDEA =
  "Every piece in the lab starts with a question I can't answer in a design file. This one was simple: what does it feel like when an interface answers back the moment you touch it?\nI gave myself one weekend, one screen and one rule — nothing goes in unless it makes the thing more fun to use. No roadmap, no stakeholders, no pixel-perfect mockups. Just a sketch, a browser and a lot of small decisions made by feel.";
const MVLT_BUILD =
  "It's a small React component with one animation loop. Pointer input goes in, a single eased value comes out, and everything on screen reads from that value through CSS variables.\n- One requestAnimationFrame loop for everything that moves\n- State lives in CSS variables, not in React renders\n- Works with a mouse, a finger and a keyboard\n- No animation library, under 4 kB gzipped";
const MVLT_CODE =
  '// one loop: read the input, ease, write a CSS variable\nlet x = 0, target = 0\naddEventListener("pointermove", (e) => {\n  target = e.clientX / innerWidth\n})\nfunction tick() {\n  x += (target - x) * 0.12   // weight, not lag\n  el.style.setProperty("--x", x.toFixed(3))\n  requestAnimationFrame(tick)\n}\ntick()';
const MVLT_LEARN =
  "Motion only feels good when it's honest about the input. Easing that trails a fraction behind the pointer reads as weight; easing that overshoots reads as a bug.\n- Tune the feel first, the look second\n- Test on a cheap phone, not on your laptop\n- Ship it small, then write down what surprised you\n> Most of what I use on client work today started as a weekend toy like this one.";

const CSS_LT = `
.mvlt{background:var(--mv-night);color:var(--mv-cloud);padding:clamp(120px,11vw,168px) 0 clamp(96px,9vw,150px);overflow:clip;--hair:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--film:color-mix(in srgb,var(--mv-night) 50%,#000);--sp:.5}
.mvlt .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px} .mvlt .mv-eb i{border-radius:1px}
.mvlt .mv-it{color:var(--mv-brass)}
.mvlt-crumb{display:flex;align-items:center;gap:10px;margin-bottom:clamp(28px,3vw,44px);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvlt-crumb a{display:inline-flex;align-items:center;gap:8px;min-height:32px;text-decoration:none;color:var(--mv-cloud)} .mvlt-crumb a svg{rotate:180deg;transition:translate .4s cubic-bezier(.34,1.56,.64,1)} .mvlt-crumb a:hover svg{translate:-4px 0}
.mvlt-hg{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(32px,5vw,96px);align-items:end}
.mvlt-hl{display:flex;flex-direction:column;gap:22px}
.mvlt-hr{display:flex;flex-direction:column;gap:22px;padding-bottom:6px}
.mvlt-lead{margin:0;font-size:clamp(18px,1.5vw,22px);line-height:1.45;color:color-mix(in srgb,var(--mv-cloud) 88%,transparent);max-width:34ch}
.mvlt-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut)}
.mvlt-meta span{color:var(--mv-cloud)} .mvlt-meta span+span::before{content:"·";margin-right:8px;color:var(--mv-mut)}
.mvlt-meta i{font-style:normal;text-transform:none;letter-spacing:.04em;padding:3px 8px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--hair);color:color-mix(in srgb,var(--mv-cloud) 84%,transparent)} .mvlt-meta span+i{margin-left:6px}
.mvlt-btns{display:flex;flex-wrap:wrap;gap:10px}
/* the gate: rails left + right, film advancing with --sp */
.mvlt-gate{position:relative;margin:clamp(48px,5vw,80px) 0 0;display:grid;grid-template-columns:44px minmax(0,1fr) 44px;border-radius:8px;background:var(--film);box-shadow:0 40px 80px -40px rgba(0,0,0,.7),0 0 0 1px color-mix(in srgb,var(--mv-cloud) 6%,transparent)}
.mvlt-rail{position:relative;display:block;overflow:hidden}
.mvlt-rail::before{content:"";position:absolute;left:50%;top:-40px;bottom:-40px;width:26px;translate:-50% 0;background:color-mix(in srgb,var(--mv-cloud) 16%,var(--mv-night));-webkit-mask:${MVLT_RAIL} 0 calc(var(--sp) * -680px)/26px 34px repeat-y;mask:${MVLT_RAIL} 0 calc(var(--sp) * -680px)/26px 34px repeat-y}
.mvlt-win{position:relative;margin:14px 0;aspect-ratio:16/9;border-radius:4px;overflow:hidden;background:#000}
.mvlt-win img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;scale:calc(1.1 - var(--sp) * .1);filter:saturate(.95) contrast(1.04)}
.mvlt-vig{position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(0,0,0,.55);background:radial-gradient(90% 80% at 50% 40%,transparent 60%,rgba(0,0,0,.35));pointer-events:none}
.mvlt-osd{position:absolute;display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:6px;background:rgba(0,0,0,.5);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#FFF1DA;font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-variant-numeric:tabular-nums}
.mvlt-osd-a{left:18px;top:18px} .mvlt-osd-b{right:18px;bottom:18px}
.mvlt-rec{width:7px;height:7px;border-radius:50%;background:#FF5A4E;box-shadow:0 0 10px #FF5A4E;animation:mvlt-rec 1.2s steps(2) infinite} @keyframes mvlt-rec{50%{opacity:.25}}
.mvlt-corner i{position:absolute;width:22px;height:22px;border:1.5px solid color-mix(in srgb,#FFF1DA 70%,transparent);pointer-events:none}
.mvlt-corner i:nth-child(1){left:12px;top:56px;border-right:0;border-bottom:0} .mvlt-corner i:nth-child(2){right:12px;top:12px;border-left:0;border-bottom:0} .mvlt-corner i:nth-child(3){left:12px;bottom:12px;border-right:0;border-top:0} .mvlt-corner i:nth-child(4){right:12px;bottom:56px;border-left:0;border-top:0}
/* write-up + sticky camera report */
.mvlt-body{display:grid;grid-template-columns:minmax(220px,1fr) minmax(0,2.2fr);gap:clamp(32px,6vw,120px);margin-top:clamp(72px,7vw,120px)}
.mvlt-log{position:sticky;top:112px;align-self:start;padding:20px 22px 22px;border-radius:10px;background:color-mix(in srgb,var(--mv-cloud) 4%,transparent);box-shadow:inset 0 0 0 1px var(--hair);font-size:12px}
.mvlt-logt{margin:0 0 14px;padding-bottom:12px;border-bottom:1px dashed var(--hair);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#FFF1DA}
.mvlt-log dl{margin:0;display:flex;flex-direction:column;gap:12px} .mvlt-log dl div{display:grid;grid-template-columns:64px 1fr;gap:12px} .mvlt-log dt{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)} .mvlt-log dd{margin:0;color:var(--mv-cloud);font-variant-numeric:tabular-nums;line-height:1.45}
.mvlt-art{display:flex;flex-direction:column;gap:clamp(56px,5vw,88px);max-width:720px}
.mvlt-part h2{display:flex;align-items:baseline;gap:14px;margin:0 0 22px;font-size:clamp(30px,3vw,44px);line-height:1;letter-spacing:-.035em;font-weight:720;font-stretch:112%}
.mvlt-part h2 em{font-style:normal;font-size:12px;letter-spacing:.1em;padding:3px 6px;border-radius:4px;background:var(--mv-brass);color:var(--mv-ink);translate:0 -.5em}
.mvlt .mv-md{font-size:17px;line-height:1.7;color:color-mix(in srgb,var(--mv-cloud) 80%,transparent)}
.mvlt .mv-md p{margin:0 0 1em} .mvlt .mv-md ul{list-style:none;margin:0 0 1.2em;padding:0;display:flex;flex-direction:column;gap:10px}
.mvlt .mv-md li{position:relative;padding-left:28px} .mvlt .mv-md li::before{content:"";position:absolute;left:0;top:.62em;width:14px;height:2px;border-radius:0;background:var(--mv-brass)}
.mvlt .mv-md blockquote{margin:1.4em 0 0;padding:22px 26px;border-radius:10px;background:color-mix(in srgb,var(--mv-brass) 14%,transparent);box-shadow:inset 3px 0 0 var(--mv-brass);color:var(--mv-cloud);font-size:clamp(19px,1.6vw,23px);line-height:1.35;letter-spacing:-.02em;font-weight:600}
.mvlt .mv-md strong{color:var(--mv-cloud)} .mvlt .mv-md a{color:var(--mv-brass)}
.mvlt-code{margin:28px 0 0;border-radius:10px;overflow:hidden;background:color-mix(in srgb,var(--mv-night) 40%,#000);box-shadow:inset 0 0 0 1px var(--hair)}
.mvlt-code figcaption{display:flex;align-items:center;gap:14px;padding:12px 16px;border-bottom:1px solid var(--hair);font-size:12px;letter-spacing:.08em;color:var(--mv-mut)} .mvlt-code figcaption span{display:flex;gap:6px} .mvlt-code figcaption i{width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--mv-cloud) 20%,transparent)}
.mvlt-code pre{margin:0;padding:18px 0;overflow-x:auto;font:inherit;font-size:13px;line-height:1.75;color:color-mix(in srgb,var(--mv-cloud) 88%,transparent);outline-offset:-3px}
.mvlt-code code{font:inherit;display:block;min-width:max-content}
.mvlt-ln{display:flex;padding-right:20px} .mvlt-ln>b{flex:none;width:44px;padding-right:16px;text-align:right;font-weight:400;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent);user-select:none} .mvlt-ln>span{white-space:pre} .mvlt.is-ph .mvlt-ln>span{white-space:pre-wrap;overflow-wrap:anywhere;min-width:0}
.mvlt-k{color:var(--mv-brass)} .mvlt-s{color:#FFD9A0} .mvlt-c{color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)} .mvlt-n{color:#FF9F7A}
/* other experiments: a short strip */
.mvlt-more{margin-top:clamp(96px,9vw,150px);padding-top:clamp(40px,4vw,64px);border-top:1px solid var(--hair)}
.mvlt-moreh{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:clamp(28px,3vw,44px)} .mvlt-moreh h2{margin:0;font-size:clamp(32px,3.4vw,52px);line-height:.95;letter-spacing:-.04em;font-weight:760;font-stretch:115%}
.mvlt-strip{list-style:none;margin:0;padding:12px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;border-radius:8px;background:var(--film);position:relative}
.mvlt-strip::before,.mvlt-strip::after{content:"";position:absolute;left:0;right:0;height:12px;background:color-mix(in srgb,var(--mv-cloud) 14%,var(--mv-night));-webkit-mask:${MVLT_RAIL.replace("width='26' height='34'", "width='22' height='12'").replace("x='7' y='10' width='12' height='14'", "x='6' y='3' width='10' height='6'")} 0 0/22px 12px repeat-x;mask:${MVLT_RAIL.replace("width='26' height='34'", "width='22' height='12'").replace("x='7' y='10' width='12' height='14'", "x='6' y='3' width='10' height='6'")} 0 0/22px 12px repeat-x} .mvlt-strip::before{top:0} .mvlt-strip::after{bottom:0}
.mvlt-strip a{display:flex;flex-direction:column;gap:10px;padding:6px 0;text-decoration:none;color:inherit;outline-offset:2px;border-radius:4px}
.mvlt-sf{position:relative;display:block;aspect-ratio:4/3;border-radius:3px;overflow:hidden;background:#000} .mvlt-sf img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.7) brightness(.7);transition:filter .5s,scale .8s cubic-bezier(.2,.8,.2,1)}
.mvlt-strip a:hover .mvlt-sf img,.mvlt-strip a:focus-visible .mvlt-sf img{filter:none;scale:1.06}
.mvlt-sk{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut);padding:0 4px} .mvlt-st{font-size:18px;line-height:1.1;letter-spacing:-.02em;font-weight:700;font-stretch:110%;padding:0 4px 4px}
/* tablet */
.mvlt.is-tab .mvlt-hg{grid-template-columns:1fr;align-items:start} .mvlt.is-tab .mvlt-body{grid-template-columns:1fr} .mvlt.is-tab .mvlt-log{position:relative;top:auto} .mvlt.is-tab .mvlt-strip{grid-template-columns:repeat(3,minmax(0,1fr))} .mvlt.is-tab .mvlt-strip li:nth-child(n+4){display:none}
/* phone */
.mvlt.is-ph{padding-top:104px}
.mvlt.is-ph .mvlt-hg{grid-template-columns:1fr;align-items:start;gap:28px}
.mvlt.is-ph .mvlt-btns{flex-direction:column} .mvlt.is-ph .mvlt-btns .mv-btn{width:100%}
.mvlt.is-ph .mvlt-gate{grid-template-columns:22px minmax(0,1fr) 22px;margin-left:-8px;margin-right:-8px} .mvlt.is-ph .mvlt-rail::before{width:14px;-webkit-mask-size:14px 20px;mask-size:14px 20px}
.mvlt.is-ph .mvlt-win{margin:8px 0;aspect-ratio:4/3} .mvlt.is-ph .mvlt-osd{font-size:12px;padding:4px 7px} .mvlt.is-ph .mvlt-osd-a{left:8px;top:8px} .mvlt.is-ph .mvlt-osd-b{right:8px;bottom:8px} .mvlt.is-ph .mvlt-corner{display:none}
.mvlt.is-ph .mvlt-body{grid-template-columns:1fr;gap:40px;margin-top:48px} .mvlt.is-ph .mvlt-log{position:relative;top:auto}
.mvlt.is-ph .mv-md{font-size:16px}
.mvlt.is-ph .mvlt-moreh{flex-direction:column;align-items:flex-start}
.mvlt.is-ph .mvlt-strip{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none} .mvlt.is-ph .mvlt-strip li{flex:none;width:62vw;scroll-snap-align:start}
@media (prefers-reduced-motion:reduce){.mvlt-rec{animation:none}}
`;
