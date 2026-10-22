'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
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
  pick,
  srcOf,
  imgOr,
  RS,
  onTick,
  clamp01,
  Head,
  Btn,
  IcoArrow,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { siteData, defaultPosts } from './siteData';

const MVPO_PORTRAIT = siteData.portrait || '/profile.png';

const mvpoTc = (sec, fps = 24) => {
  const f = Math.floor(sec * fps);
  const p = (x) => String(x).padStart(2, '0');
  return `${p(Math.floor(f / (fps * 3600)))}:${p(Math.floor(f / (fps * 60)) % 60)}:${p(Math.floor(f / fps) % 60)}:${p(f % fps)}`;
};

const mvpoBlocks = (src) => {
  const out = [];
  const parts = String(src || '')
    .replace(/\r/g, '')
    .split(/```/);
  parts.forEach((p, i) => {
    if (i % 2) {
      const nl = p.indexOf('\n');
      const lang = nl > 0 ? p.slice(0, nl).trim() : '';
      out.push({
        k: 'code',
        t: (nl >= 0 ? p.slice(nl + 1) : p).replace(/\n+$/, ''),
        lang,
      });
    } else if (p.trim()) out.push({ k: 'md', t: p });
  });
  let h = 0,
    placed = false;
  const res = [];
  for (const b of out) {
    if (placed || b.k !== 'md') {
      res.push(b);
      continue;
    }
    const lines = b.t.split('\n');
    let cut = -1;
    for (let j = 0; j < lines.length; j++) {
      if (lines[j].trim().startsWith('## ')) {
        h++;
        if (h === 2) {
          cut = j;
          break;
        }
      }
    }
    if (cut < 0) {
      res.push(b);
      continue;
    }
    const a = lines.slice(0, cut).join('\n'),
      z = lines.slice(cut).join('\n');
    if (a.trim()) res.push({ k: 'md', t: a });
    res.push({ k: 'card', t: '' });
    placed = true;
    if (z.trim()) res.push({ k: 'md', t: z });
  }
  if (!placed && res.length)
    res.splice(Math.max(1, Math.ceil(res.length / 3)), 0, {
      k: 'card',
      t: '',
    });
  return res;
};

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

const MvpoX = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.4 21H2.3l7.2-8.2L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"
    />
  </svg>
);

const MvpoIn = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4z"
    />
  </svg>
);

const MvpoLink = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6" />
    <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" />
  </svg>
);

export default function MvPost(props = {}) {
  const {
    slug = '',
    title = '',
    backLabel = 'Writing',
    backLink = '/writing',
    readSuffix = 'read',
    byLabel = 'Words by',
    authorPhoto,
    extraBody = MVPO_EXTRA,
    shareLabel = 'Share',
    xLabel = 'Share on X',
    linkedinLabel = 'Share on LinkedIn',
    copyLabel = 'Copy link',
    copiedLabel = 'Copied',
    cardEyebrow = 'Call sheet · Open',
    cardTitle = 'Need this for your product?',
    cardText = "I design and build digital products end to end — from the first sketch to production code. Tell me what you're making.",
    cardButton = "Let's talk",
    cardLink = '#contact',
    noLabel = 'No.',
    tcLabel = 'Reading',
    leftLabel = '{min} min left',
    endLabel = "That's the end",
    reelLabel = 'Reel',
    moreTitle = 'More notes',
    moreButton = 'All writing',
    moreLink = '#notes',
    posts = defaultPosts,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const site = siteData;

  const Dh = {
    ...D,
    fontWeight: props.customFonts
      ? D.fontWeight
      : 'var(--mv-font-dw, 720)',
  };

  const root = useRef(null);
  const art = useRef(null);
  const tc = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm, 0.02);
  useMagnet(root, live);

  const rows = posts || defaultPosts;
  const row = (slug && rows.find((r) => r.slug === slug)) || rows[0] || {};
  const T1 = pick(title, row.f1 || 'Untitled note');
  const mins = Math.max(
    1,
    parseFloat(String(row.f4 || '').replace(/[^\d.]/g, '')) || 6
  );
  const idx = Math.max(0, rows.indexOf(row));
  const blocks = mvpoBlocks(
    [row.f6 || '', extraBody || '']
      .filter((x) => String(x).trim())
      .join('\n\n')
  );
  const others = rows.filter((r) => r !== row).slice(0, 3);
  const anim = live && !rm && !still;

  const [dev, setDev] = useState(false);
  useEffect(() => {
    if (!on) return;
    const t = window.setTimeout(() => setDev(true), 250);
    return () => window.clearTimeout(t);
  }, [on]);
  const developed = dev || still || rm;

  const [url, setUrl] = useState('');
  useEffect(() => {
    if (live) {
      try {
        setUrl(window.location.href);
      } catch (e) {}
    }
  }, [live]);
  const shareUrl = url || `#notes-${row.slug || ''}`;

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      } catch (x) {}
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const [tcOn, setTcOn] = useState(false);
  useEffect(() => {
    if (!anim || !art.current) return;
    const a = art.current;
    let top = 0,
      h = 1,
      vh = 1,
      last = -1,
      vis = false,
      shown = false;
    const read = () => {
      const r = a.getBoundingClientRect();
      top = r.top;
      h = r.height || 1;
      vh = window.innerHeight || 1;
    };
    const off = onTick(() => {
      const p = clamp01((vh * 0.35 - top) / Math.max(1, h - vh * 0.4));
      const v = top < vh * 0.6 && top + h > vh * 0.25;
      if (v !== vis) {
        vis = v;
        if (v !== shown) {
          shown = v;
          setTcOn(v);
        }
      }
      const el = tc.current;
      if (!el) return;
      const q = Math.round(p * 1000) / 1000;
      if (q === last) return;
      last = q;
      el.style.setProperty('--rp', q.toFixed(3));
      const t = el.querySelector('[data-tc]');
      if (t) t.textContent = mvpoTc(q * mins * 60);
      const l = el.querySelector('[data-left]');
      if (l) {
        const left = Math.ceil((1 - q) * mins);
        const s =
          q > 0.985
            ? endLabel
            : leftLabel.replace(
                /\{min\}/g,
                String(Math.max(1, left))
              );
        if (l.textContent !== s) l.textContent = s;
      }
    }, read);
    return () => off();
  }, [anim, mins, leftLabel, endLabel]);

  const readT = (r) =>
    r.f4 ? `${r.f4}${readSuffix ? ` ${readSuffix}` : ''}` : '';
  const photo = srcOf(authorPhoto, MVPO_PORTRAIT);

  const rail = (
    <div className="mvpo-share" style={M}>
      <p>{shareLabel}</p>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(T1)}`}
        target="_blank"
        rel="noopener"
        aria-label={xLabel}
        title={xLabel}
      >
        <MvpoX />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener"
        aria-label={linkedinLabel}
        title={linkedinLabel}
      >
        <MvpoIn />
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : copyLabel}
        title={copyLabel}
        className={copied ? 'is-ok' : ''}
      >
        <MvpoLink />
        <span className="mvpo-cp" aria-hidden>
          {copiedLabel}
        </span>
      </button>
      <span className="mvpo-sr" role="status" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
      <a className="mvpo-back" href={backLink || '/writing'}>
        <IcoArrow s={13} />
        <span>{backLabel}</span>
      </a>
    </div>
  );

  return (
    <section
      ref={root}
      className={`mv mv-sec mvpo${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}${anim ? ' is-anim' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_PO + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvpo-top">
          <nav
            className="mvpo-crumb"
            style={{ ...M, ...rise(on, 0, 8) }}
            aria-label="Breadcrumb"
          >
            <a href={backLink || '/writing'}>
              <IcoArrow s={13} />
              <span>{backLabel}</span>
            </a>
            <i aria-hidden>/</i>
            <span>{row.f2 || ''}</span>
          </nav>
          <p
            className="mvpo-line"
            style={{ ...M, ...rise(on, 80, 8) }}
          >
            {row.f2 && <b>{row.f2}</b>}
            {row.f3 && <span>{row.f3}</span>}
            {row.f4 && <span>{readT(row)}</span>}
            <span className="mvpo-no">
              {noLabel} {String(idx + 1).padStart(2, '0')}
            </span>
          </p>
          <Head
            tag="h1"
            text={T1}
            on={on}
            D={Dh}
            size={
              phone
                ? 'clamp(38px,10.5vw,52px)'
                : 'clamp(48px,5.6vw,88px)'
            }
            lh={0.94}
            delay={120}
            step={40}
            style={{ fontStretch: '114%' }}
          />
          <div className="mvpo-sub" style={rise(on, 420, 12)}>
            {row.f5 && <p className="mvpo-lead">{row.f5}</p>}
            <p className="mvpo-by">
              <span className="mvpo-av" aria-hidden>
                <img
                  src={photo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span style={M}>{byLabel}</span>
              <b>{site.name}</b>
            </p>
          </div>
        </header>
        <figure
          className={`mvpo-cover${developed ? ' is-dev' : ''}`}
          style={rise(on, 260, 24)}
        >
          <span className="mvpo-cimg">
            <img
              {...RS(imgOr(row), '92vw')}
              alt={row.f1 || ''}
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <i className="mvpo-safe" aria-hidden />
            <i className="mvpo-devl" aria-hidden />
            <i className="mvpo-sheen" aria-hidden />
          </span>
        </figure>
        <div className="mvpo-body">
          {!phone && !tab && (
            <aside className="mvpo-rail" aria-label={shareLabel}>
              {rail}
            </aside>
          )}
          <div ref={art} className="mvpo-art">
            {blocks.map((b, i) =>
              b.k === 'md' ? (
                <UI_Md
                  key={i}
                  text={b.t}
                  D={Dh}
                  className="mvpo-md"
                />
              ) : b.k === 'code' ? (
                <figure key={i} className="mvpo-code" style={M}>
                  {b.lang && (
                    <figcaption>{b.lang}</figcaption>
                  )}
                  <pre
                    tabIndex={0}
                    className="mv-inring"
                    aria-label={b.lang || 'Code'}
                  >
                    <code>{b.t}</code>
                  </pre>
                </figure>
              ) : (
                <aside
                  key={i}
                  className="mvpo-card"
                  aria-label={cardTitle}
                >
                  <p className="mvpo-ce" style={M}>
                    <i aria-hidden />
                    {cardEyebrow}
                  </p>
                  <p className="mvpo-ct" style={Dh}>
                    {cardTitle}
                  </p>
                  {cardText && (
                    <p className="mvpo-cx">{cardText}</p>
                  )}
                  <Btn
                    href={
                      cardLink || site.book || '#contact'
                    }
                    label={cardButton}
                    kind="solid"
                  />
                </aside>
              )
            )}
            {(phone || tab) && (
              <div className="mvpo-rail is-row">{rail}</div>
            )}
          </div>
        </div>
        {others.length > 0 && (
          <div className="mvpo-more">
            <div className="mvpo-moreh">
              <h2 style={Dh}>{moreTitle}</h2>
              {moreButton && (
                <Btn
                  href={moreLink || '#notes'}
                  label={moreButton}
                  kind="ghost"
                />
              )}
            </div>
            <ol className="mvpo-list">
              {others.map((r, i) => (
                <li key={r.slug || i}>
                  <a href={`#notes-${r.slug || i}`}>
                    <span className="mvpo-ld" style={M}>
                      {r.f3}
                    </span>
                    <h3 style={Dh}>{r.f1}</h3>
                    <span className="mvpo-lk" style={M}>
                      {r.f2 && <i>{r.f2}</i>}
                      <span>{readT(r)}</span>
                    </span>
                    <span className="mvpo-lg" aria-hidden>
                      <IcoArrow s={16} />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      {anim &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tc}
            className={`mvpo-tc${tcOn ? ' is-on' : ''}${phone ? ' is-ph' : ''}`}
            style={{ ...cssVars(c), ...M }}
            aria-hidden
          >
            <span className="mvpo-tcc">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="mvpo-tc1">
              <i className="mvpo-rec" />
              {tcLabel}
              <em>
                {reelLabel} {String(idx + 1).padStart(2, '0')}
              </em>
            </span>
            <b data-tc>{mvpoTc(0)}</b>
            <span className="mvpo-bar">
              <i />
            </span>
            <span className="mvpo-tc2" data-left>
              {leftLabel.replace(/\{min\}/g, String(mins))}
            </span>
          </div>,
          document.body
        )}
    </section>
  );
}

const MVPO_EXTRA = `## Start with the decision, not the screen
Most product work stalls because nobody has written down what is being decided. Before I open a design file I write one sentence: what should a person be able to do after this ships that they can't do today? If the team can't agree on that sentence, no amount of polish will save the project.
Then I list what we already know, what we're guessing, and what would change our mind. That one page usually saves a week of meetings.
## Design in the material
Static mockups are good at showing how something looks and bad at showing how it behaves. Loading states, empty lists, long names, slow networks — those live in code. So I move into the browser early:
- Sketch the flow on paper until the steps feel obvious
- Build a rough version with **real data**, even if it's ugly
- Design the details on top of something that already works
- Put it in front of a real person before it's pretty
> The prototype is not the product. It's the cheapest way to have the argument you were going to have anyway.
## Keep the system small
A design system earns its keep when it removes decisions, not when it documents every possible one. I start with tokens — colour, type, spacing, radius — and the handful of components the product actually uses. Everything else waits until it's needed twice.
This is the kind of token file I hand over on day one:
\`\`\`tokens.css
:root {
  --ink: #111113;
  --paper: #F2F2EF;
  --accent: #FF5B2E;
  --radius: 10px;
  --space: 8px;
}
\`\`\`
Naming matters more than values. If a developer can guess a token's name without looking it up, the system will get used.
## Ship, then listen
Launch is where the useful feedback starts. In the first two weeks after a release I watch session recordings, read support tickets and sit in on at least one sales call. The fixes are usually small — a label, the order of two steps, a default that was wrong — and they matter more than anything in the original spec.
- Measure one thing that tells you people got value
- Fix the top three frictions before adding features
- Write down what surprised you, and share it with the team
## The short version
Decide first, design in the real material, keep the system small and treat launch as the beginning. It isn't a method so much as a habit — and it's the one that has made the biggest difference to every product I've worked on.`;

const CSS_PO = `
.mvpo{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(120px,11vw,168px) 0 clamp(96px,9vw,150px);overflow:clip}
.mvpo ::selection{background:var(--mv-brass);color:var(--mv-ink)}
.mvpo .mv-hd{letter-spacing:-.042em;max-width:17ch}
.mvpo-crumb{display:flex;align-items:center;gap:10px;margin-bottom:clamp(28px,3vw,40px);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvpo-crumb a{display:inline-flex;align-items:center;gap:8px;min-height:32px;text-decoration:none;color:var(--mv-ink)} .mvpo-crumb a svg{rotate:180deg;transition:translate .4s cubic-bezier(.34,1.56,.64,1)} .mvpo-crumb a:hover svg{translate:-4px 0}
.mvpo-line{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin:0 0 26px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvpo-line b{font-weight:500;padding:4px 8px;border-radius:4px;background:var(--mv-brass);color:var(--mv-ink)} .mvpo-line span+span::before{content:"·";margin-right:14px}
.mvpo-no{margin-left:auto} .mvpo-no::before{display:none}
.mvpo-sub{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;margin-top:clamp(28px,3vw,44px);padding-top:24px;border-top:1px solid var(--mv-fog)}
.mvpo-lead{margin:0;font-size:clamp(18px,1.5vw,22px);line-height:1.45;color:var(--mv-mut);max-width:46ch}
.mvpo-by{display:flex;align-items:center;gap:12px;margin:0;font-size:15px;white-space:nowrap} .mvpo-by span:not(.mvpo-av){font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvpo-av{display:block;width:40px;height:40px;border-radius:8px;overflow:hidden;background:var(--mv-brass)} .mvpo-av img{width:100%;height:100%;object-fit:cover;object-position:50% 10%;scale:1.5;translate:0 18%}
/* cover: develops from a negative */
.mvpo-cover{margin:clamp(40px,4vw,64px) 0 0}
.mvpo-cimg{position:relative;display:block;aspect-ratio:16/9;border-radius:4px;overflow:hidden;background:color-mix(in srgb,var(--mv-stone) 22%,transparent)}
.mvpo-cimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:invert(1) hue-rotate(180deg) sepia(.4) contrast(.85);scale:1.04;transition:filter 2.6s cubic-bezier(.4,0,.2,1) .2s,scale 3s cubic-bezier(.2,.8,.2,1)}
.mvpo-safe{position:absolute;inset:0;background:rgba(200,30,20,.28);mix-blend-mode:multiply;transition:opacity 2.2s ease .6s;pointer-events:none}
.mvpo-devl{position:absolute;left:0;right:0;top:-30%;height:30%;background:linear-gradient(180deg,transparent,rgba(255,241,218,.35) 70%,rgba(255,241,218,.6) 88%,transparent);pointer-events:none;opacity:0}
.mvpo-cover.is-dev .mvpo-cimg img{filter:none;scale:1} .mvpo-cover.is-dev .mvpo-safe{opacity:0} .mvpo-cover.is-dev .mvpo-devl{animation:mvpo-dev 2.4s cubic-bezier(.4,0,.2,1) .15s both}
@keyframes mvpo-dev{0%{opacity:1;translate:0 0}90%{opacity:1}100%{opacity:0;translate:0 440%}}
.mvpo-sheen{position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,241,218,.28) 50%,transparent 65%);translate:-100% 0;transition:translate 1.2s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.mvpo-cimg:hover .mvpo-sheen{translate:100% 0}
/* body: share rail + article */
.mvpo-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,700px) minmax(0,1fr);gap:clamp(32px,4vw,64px);margin-top:clamp(56px,6vw,96px)}
.mvpo-rail{position:sticky;top:112px;align-self:start;justify-self:start}
.mvpo-share{display:flex;flex-direction:column;align-items:flex-start;gap:8px}
.mvpo-share p{margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvpo-share>a:not(.mvpo-back),.mvpo-share>button{position:relative;appearance:none;border:0;cursor:pointer;display:grid;place-items:center;width:44px;height:44px;border-radius:10px;background:transparent;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 20%,transparent);color:var(--mv-ink);transition:background .3s,box-shadow .3s,translate .45s cubic-bezier(.34,1.56,.64,1)}
.mvpo-share svg{width:17px;height:17px}
.mvpo-share>a:not(.mvpo-back):hover,.mvpo-share>button:hover{background:var(--mv-brass);box-shadow:none;translate:0 -2px}
.mvpo-share>button.is-ok{background:var(--mv-ink);color:var(--mv-bone);box-shadow:none}
.mvpo-cp{position:absolute;left:calc(100% + 10px);top:50%;translate:-6px -50%;padding:4px 8px;border-radius:5px;background:var(--mv-ink);color:var(--mv-bone);font-size:12px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .25s,translate .35s}
.mvpo-share>button.is-ok .mvpo-cp{opacity:1;translate:0 -50%}
.mvpo-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.mvpo-back{display:inline-flex;align-items:center;gap:8px;margin-top:18px;min-height:32px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;color:var(--mv-ink)} .mvpo-back svg{rotate:180deg}
.mvpo-art{grid-column:2;counter-reset:mvpo}
.mvpo .mv-md{font-size:18px;line-height:1.72;color:color-mix(in srgb,var(--mv-ink) 84%,transparent)}
.mvpo .mv-md p{margin:0 0 1.1em}
.mvpo .mv-md h2{position:relative;margin:1.9em 0 .6em;font-size:clamp(28px,2.5vw,36px);line-height:1.08;letter-spacing:-.03em;font-stretch:112%;color:var(--mv-ink);counter-increment:mvpo}
.mvpo .mv-md h2::before{content:"§ " counter(mvpo,decimal-leading-zero);display:block;margin-bottom:12px;font:500 12px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.12em;color:var(--mv-mut)}
.mvpo .mv-md>h2:first-child{margin-top:0}
.mvpo .mv-md ul{list-style:none;margin:0 0 1.3em;padding:0;display:flex;flex-direction:column;gap:10px}
.mvpo .mv-md li{position:relative;padding-left:30px} .mvpo .mv-md li::before{content:"";position:absolute;left:0;top:.8em;width:16px;height:2px;border-radius:0;background:var(--mv-ink)}
.mvpo .mv-md strong{color:var(--mv-ink);font-weight:600;background:linear-gradient(transparent 62%,color-mix(in srgb,var(--mv-brass) 55%,transparent) 62%)}
.mvpo .mv-md a{color:var(--mv-ink);text-decoration-color:var(--mv-brass);text-decoration-thickness:2px;text-underline-offset:4px}
.mvpo .mv-md blockquote{position:relative;margin:1.6em 0;padding:4px 0 4px 28px;border-radius:0;background:none;color:var(--mv-ink);font-size:clamp(24px,2.2vw,32px);line-height:1.2;letter-spacing:-.03em;font-weight:700;font-stretch:112%;box-shadow:inset 4px 0 0 var(--mv-brass)}
.mvpo-code{margin:0 0 1.6em;border-radius:10px;overflow:hidden;background:var(--mv-night);color:color-mix(in srgb,var(--mv-cloud) 88%,transparent)}
.mvpo-code figcaption{padding:11px 16px;border-bottom:1px solid color-mix(in srgb,var(--mv-cloud) 12%,transparent);font-size:12px;letter-spacing:.08em;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvpo-code pre{margin:0;padding:18px 20px;overflow-x:auto;font:inherit;font-size:13.5px;line-height:1.7;white-space:pre;outline-offset:-3px} .mvpo-code code{font:inherit}
.mvpo-code pre:focus-visible{outline-color:var(--mv-cloud)!important}
/* in-article call sheet card */
.mvpo-card{position:relative;margin:2.4em 0;padding:28px 30px 30px;border-radius:10px;background:var(--mv-cloud);box-shadow:0 1px 0 color-mix(in srgb,var(--mv-ink) 8%,transparent),0 26px 50px -34px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:flex-start;gap:14px;background-image:repeating-linear-gradient(180deg,transparent 0,transparent 31px,color-mix(in srgb,var(--mv-ink) 5%,transparent) 31px,color-mix(in srgb,var(--mv-ink) 5%,transparent) 32px)}
.mvpo-card::before{content:"";position:absolute;right:26px;top:-10px;width:86px;height:22px;background:color-mix(in srgb,var(--mv-brass) 70%,transparent);rotate:4deg;border-radius:2px}
.mvpo-ce{display:flex;align-items:center;gap:8px;margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)} .mvpo-ce i{width:8px;height:8px;border-radius:50%;background:#FF5A4E;box-shadow:0 0 10px rgba(255,90,78,.7)}
.mvpo-ct{margin:0;font-size:clamp(28px,2.6vw,38px);line-height:1;letter-spacing:-.035em;font-stretch:114%}
.mvpo-cx{margin:0 0 6px;font-size:16px;line-height:1.55;color:var(--mv-mut);max-width:46ch}
/* rail as a row (tablet/phone) */
.mvpo-rail.is-row{position:relative;top:auto;margin-top:40px;padding-top:24px;border-top:1px solid var(--mv-fog)}
.mvpo-rail.is-row .mvpo-share{flex-direction:row;align-items:center;flex-wrap:wrap} .mvpo-rail.is-row .mvpo-share p{margin:0 8px 0 0} .mvpo-rail.is-row .mvpo-back{margin:0 0 0 auto}
.mvpo-rail.is-row .mvpo-cp{left:50%;top:auto;bottom:calc(100% + 8px);translate:-50% 4px} .mvpo-rail.is-row .mvpo-share>button.is-ok .mvpo-cp{translate:-50% 0}
/* more notes */
.mvpo-more{margin-top:clamp(96px,9vw,140px)}
.mvpo-moreh{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-bottom:clamp(24px,3vw,40px)} .mvpo-moreh h2{margin:0;font-size:clamp(36px,3.8vw,56px);line-height:.95;letter-spacing:-.04em;font-stretch:115%}
.mvpo-list{list-style:none;margin:0;padding:0;border-top:1px solid color-mix(in srgb,var(--mv-ink) 28%,transparent)}
.mvpo-list li{border-bottom:1px solid var(--mv-fog)}
.mvpo-list a{display:grid;grid-template-columns:120px minmax(0,1fr) auto 44px;gap:clamp(16px,2vw,32px);align-items:center;padding:26px 0;text-decoration:none;color:inherit;outline-offset:4px;transition:padding .45s cubic-bezier(.2,.8,.2,1)}
.mvpo-list a:hover{padding-left:12px}
.mvpo-ld{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvpo-list h3{margin:0;font-size:clamp(22px,2vw,30px);line-height:1.08;letter-spacing:-.025em;font-stretch:112%}
.mvpo-lk{display:flex;align-items:center;gap:12px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut);white-space:nowrap} .mvpo-lk i{font-style:normal;padding:4px 8px;border-radius:4px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent);color:var(--mv-ink)}
.mvpo-lg{display:grid;place-items:center;width:44px;height:44px;border-radius:10px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent);transition:background .35s,box-shadow .35s} .mvpo-lg svg{transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.mvpo-list a:hover .mvpo-lg,.mvpo-list a:focus-visible .mvpo-lg{background:var(--mv-brass);box-shadow:none} .mvpo-list a:hover .mvpo-lg svg,.mvpo-list a:focus-visible .mvpo-lg svg{transform:rotate(-45deg)}
/* the film-gate timecode (portalled to body) */
.mvpo-tc{position:fixed;right:clamp(16px,2vw,28px);bottom:clamp(16px,2vw,28px);z-index:900;display:flex;flex-direction:column;gap:6px;width:212px;padding:14px 16px 14px;border-radius:10px;background:color-mix(in srgb,var(--mv-night) 92%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#FFF1DA;box-shadow:0 18px 40px -18px rgba(0,0,0,.5);pointer-events:none;opacity:0;translate:0 14px;transition:opacity .4s ease,translate .5s cubic-bezier(.2,.8,.2,1);--rp:0}
.mvpo-tc.is-on{opacity:1;translate:0 0}
.mvpo-tcc i{position:absolute;width:9px;height:9px;border:1.5px solid color-mix(in srgb,#FFF1DA 55%,transparent)} .mvpo-tcc i:nth-child(1){left:6px;top:6px;border-right:0;border-bottom:0} .mvpo-tcc i:nth-child(2){right:6px;top:6px;border-left:0;border-bottom:0} .mvpo-tcc i:nth-child(3){left:6px;bottom:6px;border-right:0;border-top:0} .mvpo-tcc i:nth-child(4){right:6px;bottom:6px;border-left:0;border-top:0}
.mvpo-tc1{display:flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,#FFF1DA 78%,transparent)} .mvpo-tc1 em{font-style:normal;margin-left:auto}
.mvpo-rec{width:7px;height:7px;border-radius:50%;background:#FF5A4E;box-shadow:0 0 8px #FF5A4E;animation:mvpo-rec 1.2s steps(2) infinite} @keyframes mvpo-rec{50%{opacity:.25}}
.mvpo-tc b{font-size:22px;font-weight:500;letter-spacing:.02em;font-variant-numeric:tabular-nums;line-height:1.1}
.mvpo-bar{position:relative;display:block;height:3px;border-radius:2px;background:color-mix(in srgb,#FFF1DA 18%,transparent);overflow:hidden} .mvpo-bar i{position:absolute;inset:0;background:var(--mv-brass);transform-origin:0 50%;transform:scaleX(var(--rp))}
.mvpo-tc2{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:color-mix(in srgb,#FFF1DA 78%,transparent)}
.mvpo-tc.is-ph{width:auto;right:12px;bottom:12px;padding:8px 10px;gap:4px} .mvpo-tc.is-ph b{font-size:14px} .mvpo-tc.is-ph .mvpo-tc1,.mvpo-tc.is-ph .mvpo-tc2{display:none}
/* tablet + phone */
.mvpo.is-tab .mvpo-body,.mvpo.is-ph .mvpo-body{grid-template-columns:minmax(0,1fr)} .mvpo.is-tab .mvpo-art,.mvpo.is-ph .mvpo-art{grid-column:1;max-width:700px}
.mvpo.is-tab .mvpo-sub,.mvpo.is-ph .mvpo-sub{flex-direction:column;align-items:flex-start;gap:20px}
.mvpo.is-ph{padding-top:104px}
.mvpo.is-ph .mvpo-no{display:none}
.mvpo.is-ph .mvpo-cimg{aspect-ratio:4/3}
.mvpo.is-ph .mv-md{font-size:17px} .mvpo.is-ph .mv-md blockquote{font-size:23px;padding-left:20px}
.mvpo.is-ph .mvpo-card{padding:24px 20px} .mvpo.is-ph .mvpo-card .mv-btn{width:100%}
.mvpo.is-ph .mvpo-moreh{flex-direction:column;align-items:flex-start}
`;
