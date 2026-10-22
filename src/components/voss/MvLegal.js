'use client';

import {
  useEffect,
  useLayoutEffect,
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
  useStage,
  useMagnet,
  useScrollVars,
  onTick,
  rise,
  Eyebrow,
  Head,
  Btn,
  IcoArrow,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { siteData } from './siteData';

const MVLG_PRIVACY = `## Who I am
This website is the portfolio of {name}, an independent product designer and developer based in {city}. I am responsible for the personal data collected through this site, and you can reach me at any time at the email address at the end of this page.
## What I collect
I only collect what I need to answer you and to keep the site running well.
- **Contact form:** your name, email address, company, website, budget, timeline and your message. Only your name, email and message are required.
- **Email:** if you write to me directly, I keep your address and our conversation.
- **Usage data:** anonymous statistics about page views, referring sites, device type and country, collected by a privacy-friendly analytics tool that does not use cookies or follow you across other sites.
## Why I use it
- To reply to your enquiry and, if we decide to work together, to prepare a proposal and a contract.
- To see which pages are useful, so I can improve the site.
- To meet legal duties such as bookkeeping and tax records.
The legal bases are your consent, steps taken at your request before a contract, and my legitimate interest in running a secure and useful website.
## Cookies
This site only uses cookies that are strictly needed for it to work, for example to remember that you closed a notice. There are no advertising cookies and no third-party tracking pixels. If an embedded video or booking tool wants to set its own cookies, it will ask for your permission first.
## Who I share it with
I never sell your data or share it for marketing. A few trusted services process it on my behalf: the website host, the form and email provider and the analytics tool. Each one is bound by a data processing agreement and may only use your data to provide its service. When a provider is based outside the European Economic Area, the transfer is protected by standard contractual clauses.
## How long I keep it
- Enquiries that do not become a project: deleted after 12 months.
- Client correspondence and invoices: kept as long as the law requires, which in Germany can be up to 10 years.
- Analytics: kept in aggregated form only, never linked to you.
## Your rights
You can ask me at any time to show you the personal data I hold about you, to correct it, to delete it, to restrict or object to how I use it, or to send you a copy in a portable format. Where I rely on your consent, you can withdraw it whenever you like. You also have the right to complain to your local data protection authority.
## Security
The site is served over HTTPS, my inbox and tools are protected with two-factor authentication, and I keep the data I hold to the minimum I need.
## Changes to this policy
If I change how I handle your data, I will update this page and the date at the top. Important changes stay highlighted here for at least 30 days.`;

const MVLG_TERMS = `## About these terms
These terms apply to your use of this website, the online portfolio of {name}, an independent product designer and developer based in {city}. By browsing the site you agree to them. If you do not agree, please do not use the site.
## Project work
Nothing on this website is an offer to enter into a contract. Every design or development project is agreed in a separate written proposal and contract that sets out the scope, timeline, price, payment terms, intellectual property and confidentiality. If those documents and these terms ever disagree, the project contract wins.
## Enquiries and availability
Sending a message through the contact form does not create any obligation for either of us. Availability, start dates and prices mentioned on the site are a guide only and are confirmed in writing in each proposal.
## Portfolio work
The projects shown here are real work, published with the permission of the clients involved. Some details, names and numbers have been changed or left out to protect confidential information. Client names, logos and trademarks belong to their owners and appear only to describe the work; showing them does not mean the client endorses this site. Results and figures describe past projects and are not a promise of future results.
## Using this site
You are welcome to browse, share links and quote short passages with credit. Please do not:
- copy, republish or sell the designs, case studies, images or text as your own;
- use the site in a way that could damage it or interrupt its availability;
- try to reach parts of the site or its systems that are not meant to be public;
- use automated tools to scrape its content in bulk.
## Intellectual property
Unless stated otherwise, the text, design, code, graphics and photographs on this website belong to {name} or are used under licence. Articles and lab experiments may carry their own licence, noted on the page, and short code snippets in articles may be used freely in your own projects. Client work shown here remains subject to the rights agreed with each client.
## Links to other sites
The site links to other websites, such as social profiles, client products and tools. I am not responsible for their content or their privacy practices, and a link is not an endorsement.
## Liability
I take care to keep this website accurate and available, but it is provided as it is, without a guarantee that it is always complete, current or free of errors. As far as the law allows, I am not liable for any loss that comes from using the site or relying on its content. Nothing in these terms limits liability that cannot be limited by law, such as for intent or gross negligence.
## Changes
I may update these terms from time to time. The date at the top shows the latest version, and using the site after a change means you accept the updated terms.
## Governing law
These terms are governed by applicable local and international commercial law.`;

const mvlgSlug = (s, i) =>
  `mvlg-${i + 1}-${String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)}`;

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

export default function MvLegal(props = {}) {
  const {
    kind = 'privacy',
    eyebrow = 'The small print',
    privacyTitle = 'Privacy policy',
    termsTitle = 'Terms of use',
    updated = 'Last updated 30 September 2026',
    privacyBody = MVLG_PRIVACY,
    termsBody = MVLG_TERMS,
    tocLabel = 'Contents',
    readLabel = 'Read',
    askLabel = 'Questions?',
    askText = "Write to me and I'll answer within a day, in plain words.",
    askButton = 'Email me',
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
    fontStretch: '112%',
  };

  const root = useRef(null);
  const bodyEl = useRef(null);
  const pct = useRef(null);
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
  const terms = kind === 'terms';

  const fill = (s) =>
    String(s || '')
      .replace(/\{name\}/g, site.name || '')
      .replace(/\{city\}/g, site.city || '')
      .replace(/\{email\}/g, site.email || '');

  const text = fill(terms ? termsBody : privacyBody);
  const title = terms ? termsTitle : privacyTitle;

  const heads = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('## '))
    .map((l, i) => ({ t: l.slice(3).trim(), id: mvlgSlug(l.slice(3), i) }));

  useLayoutEffect(() => {
    const el = bodyEl.current;
    if (!el) return;
    el.querySelectorAll('h2').forEach((h, i) => {
      if (heads[i]) h.id = heads[i].id;
    });
  }, [text]);

  const [cur, setCur] = useState(0);
  const curRef = useRef(0);

  useScrollVars(root, live, rm, (_sp, pp) => {
    const p = pct.current;
    const v = String(Math.round(pp * 100));
    if (p && p.textContent !== v) p.textContent = v;
  });

  useEffect(() => {
    if (!live || !bodyEl.current) return;
    let tops = [],
      vh = 1;
    const read = () => {
      const hs = bodyEl.current?.querySelectorAll('h2');
      if (!hs) return;
      vh = window.innerHeight;
      tops = Array.from(hs).map((h) => h.getBoundingClientRect().top);
    };
    const off = onTick(() => {
      if (!tops.length) return;
      let k = 0;
      for (let i = 0; i < tops.length; i++) if (tops[i] < vh * 0.32) k = i;
      if (k !== curRef.current) {
        curRef.current = k;
        setCur(k);
      }
    }, read);
    return () => off();
  }, [live, text]);

  const go = (e, id) => {
    const t = document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    const W = window;
    if (W.__ltLenis && W.__ltLenis.scrollTo)
      W.__ltLenis.scrollTo(t, { offset: -110 });
    else
      t.scrollIntoView({
        behavior: rm ? 'auto' : 'smooth',
        block: 'start',
      });
    try {
      history.replaceState(null, '', '#' + id);
    } catch (x) {}
  };

  const pad2 = (n) => String(n + 1).padStart(2, '0');
  const [detOpen, setDetOpen] = useState(false);

  const toc = (
    <ol className="mvlg-toc">
      {heads.map((h, i) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => go(e, h.id)}
            className={
              i === cur ? 'is-cur' : i < cur ? 'is-past' : ''
            }
            aria-current={i === cur ? 'location' : undefined}
          >
            <em style={M}>{pad2(i)}</em>
            <span>{h.t}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <section
      ref={root}
      className={`mv mv-sec mvlg${phone ? ' is-ph' : tab ? ' is-tab' : ''}${inn ? ' is-in' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_MVLG + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvlg-hd">
          <Eyebrow text={eyebrow} on={inn} M={M} />
          <Head
            text={title}
            on={inn}
            D={Dh}
            tag="h1"
            size={
              phone
                ? 'clamp(42px,12vw,60px)'
                : 'clamp(56px,6.4vw,100px)'
            }
            lh={0.92}
            delay={120}
          />
          {updated && (
            <p
              className="mvlg-up"
              style={{ ...M, ...rise(inn, 480, 10) }}
            >
              <i aria-hidden />
              {updated}
            </p>
          )}
        </header>
        <div className="mvlg-grid">
          <aside className="mvlg-side" style={rise(inn, 560, 14)}>
            {phone ? (
              <details
                className="mvlg-det"
                open={detOpen}
                onToggle={(e) =>
                  setDetOpen(e.currentTarget.open)
                }
              >
                <summary style={M}>
                  {tocLabel}
                  <span aria-hidden>
                    {String(heads.length).padStart(2, '0')}
                  </span>
                </summary>
                {detOpen ? toc : null}
              </details>
            ) : (
              <nav className="mvlg-nav" aria-label={tocLabel}>
                <p className="mvlg-tl" style={M}>
                  <span>{tocLabel}</span>
                  <span>
                    {readLabel} <span ref={pct}>0</span>%
                  </span>
                </p>
                <div className="mvlg-rail">
                  <i className="mvlg-fill" aria-hidden />
                  {toc}
                </div>
              </nav>
            )}
          </aside>
          <div className="mvlg-main" style={rise(inn, 640, 18)}>
            <div ref={bodyEl} className="mvlg-body">
              <UI_Md text={text} D={Dh} />
            </div>
            <div className="mvlg-ask mv-dark">
              <p className="mvlg-al" style={M}>
                <i aria-hidden />
                {askLabel}
              </p>
              <p className="mvlg-at" style={Dh}>
                {askText}
              </p>
              {site.email && (
                <a
                  className="mvlg-mail"
                  href={`mailto:${site.email}`}
                  style={Dh}
                >
                  {site.email}
                  <IcoArrow s={20} />
                </a>
              )}
              {site.email && askButton && (
                <Btn
                  href={`mailto:${site.email}`}
                  label={askButton}
                  kind="solid"
                  icon="mail"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS_MVLG = `
.mvlg{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(128px,15vh,168px) 0 clamp(88px,9vw,140px)}
.mvlg .mv-it{display:inline-block;color:var(--mv-ink);font-weight:inherit;line-height:1.02;padding:0 .07em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .72s steps(8) var(--pd,600ms)} .mvlg .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvlg-hd{display:flex;flex-direction:column;align-items:flex-start;gap:24px;padding-bottom:clamp(40px,5vw,64px);border-bottom:1px solid var(--mv-fog)}
.mvlg-up{display:inline-flex;align-items:center;gap:10px;margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvlg-up i{width:18px;height:1.5px;background:var(--mv-ink)}
.mvlg-grid{display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);gap:clamp(40px,7vw,120px);padding-top:clamp(40px,5vw,72px);align-items:start}
.mvlg-side{position:sticky;top:112px}
.mvlg-tl{display:flex;justify-content:space-between;margin:0 0 14px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvlg-rail{position:relative;padding-left:16px}
.mvlg-rail::before,.mvlg-fill{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--mv-fog)}
.mvlg-fill{background:var(--mv-brass);transform-origin:0 0;scale:1 var(--pp,0)}
.mvlg-toc{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.mvlg-toc a{display:flex;gap:12px;align-items:baseline;padding:7px 8px;margin-left:-8px;border-radius:6px;color:var(--mv-mut);text-decoration:none;font-size:14.5px;line-height:1.35;transition:color .25s}
.mvlg-toc em{flex:none;font-style:normal;font-size:12px;letter-spacing:.08em;opacity:.8}
.mvlg-toc span{padding:1px .2em;margin:-1px -.2em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .45s steps(6,end)}
.mvlg-toc a:hover{color:var(--mv-ink)} .mvlg-toc a:hover span{background-size:100% 100%;background-image:linear-gradient(color-mix(in srgb,var(--mv-brass) 35%,transparent),color-mix(in srgb,var(--mv-brass) 35%,transparent))}
.mvlg-toc a.is-past{color:color-mix(in srgb,var(--mv-ink) 78%,transparent)}
.mvlg-toc a.is-cur{color:var(--mv-ink)} .mvlg-toc a.is-cur span{background-size:100% 100%;background-image:linear-gradient(var(--mv-brass),var(--mv-brass))} .mvlg-toc a.is-cur em{opacity:1}
/* body: UI_Md restyled — Mona Sans on paper, numbered headings, selection-handle bullets */
.mvlg-main{max-width:760px}
.mvlg-body{counter-reset:mvlg}
.mvlg .mv-md{font-size:17px;line-height:1.72;color:color-mix(in srgb,var(--mv-ink) 84%,transparent)}
.mvlg .mv-md h2{counter-increment:mvlg;display:flex;align-items:baseline;gap:16px;margin:2.4em 0 .7em;padding-top:22px;border-top:1px solid var(--mv-fog);font-size:clamp(24px,2.2vw,32px);line-height:1.1;letter-spacing:-.03em;color:var(--mv-ink);scroll-margin-top:112px}
.mvlg .mv-md h2:first-child{margin-top:0}
.mvlg .mv-md h2::before{content:counter(mvlg,decimal-leading-zero);flex:none;font:500 12px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.08em;color:var(--mv-mut);translate:0 -.4em}
.mvlg .mv-md p{margin:0 0 1em}
.mvlg .mv-md ul{list-style:none;margin:0 0 1.2em;padding:0;display:flex;flex-direction:column;gap:10px}
.mvlg .mv-md li{position:relative;padding-left:28px}
.mvlg .mv-md li::before{content:"";position:absolute;left:3px;top:.62em;width:8px;height:8px;background:var(--mv-cloud);box-shadow:0 0 0 1.5px var(--mv-brass)}
.mvlg .mv-md strong{font-weight:600;color:var(--mv-ink)}
.mvlg .mv-md a{color:var(--mv-ink);text-decoration:none;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 100%/100% 2px;transition:background-size .35s steps(6,end)} .mvlg .mv-md a:hover{background-size:100% 100%}
.mvlg .mv-md blockquote{margin:1.4em 0;padding:20px 24px;border-radius:10px;border-left:3px solid var(--mv-brass);background:color-mix(in srgb,var(--mv-ink) 4%,transparent);color:var(--mv-ink);font-size:20px;line-height:1.4;letter-spacing:-.015em}
/* questions card */
.mvlg-ask{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:16px;margin-top:clamp(48px,5vw,72px);padding:clamp(24px,3vw,36px);border-radius:10px;background:var(--mv-ink);color:var(--mv-cloud)}
.mvlg .mvlg-ask .mv-btn.mv-solid{--face:var(--mv-brass);--fill:var(--mv-cloud);--fg:var(--mv-ink);--fg2:var(--mv-ink);--chip:var(--mv-ink);--chipfg:var(--mv-brass);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mvlg-al{display:inline-flex;align-items:center;gap:9px;margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)} .mvlg-al i{width:7px;height:7px;border-radius:50%;background:var(--mv-brass)}
.mvlg-at{margin:0;max-width:24ch;font-size:clamp(24px,2.3vw,34px);line-height:1.08;letter-spacing:-.03em}
.mvlg-mail{display:inline-flex;align-items:center;gap:10px;max-width:100%;color:var(--mv-brass);text-decoration:none;font-size:clamp(16px,1.6vw,22px);letter-spacing:-.01em;overflow-wrap:anywhere} .mvlg-mail svg{flex:none;transition:rotate .45s cubic-bezier(.34,1.56,.64,1)} .mvlg-mail:hover svg{rotate:-45deg}
/* tablet + phone */
.mvlg.is-tab .mvlg-grid{grid-template-columns:minmax(190px,230px) minmax(0,1fr);gap:40px}
.mvlg.is-ph{padding-top:112px}
.mvlg.is-ph .mvlg-grid{grid-template-columns:minmax(0,1fr);gap:28px;padding-top:28px}
.mvlg.is-ph .mvlg-side{position:static}
.mvlg-det{border:1px solid var(--mv-fog);border-radius:10px;padding:0 14px}
.mvlg-det summary{display:flex;justify-content:space-between;align-items:center;min-height:48px;cursor:pointer;list-style:none;font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.mvlg-det summary::-webkit-details-marker{display:none} .mvlg-det summary::after{content:"+";margin-left:12px;font-size:18px} .mvlg-det[open] summary::after{content:"–"} .mvlg-det summary span{margin-left:auto;color:var(--mv-mut)}
.mvlg-det .mvlg-toc{padding:0 0 12px}
.mvlg.is-ph .mv-md{font-size:16px}
.mvlg.is-ph .mv-md h2{font-size:24px;gap:12px}
`;
