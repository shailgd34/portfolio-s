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
  Eyebrow,
  Head,
  Btn,
  imgOf,
  RS,
  onTick,
  clamp01,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultPosts } from './siteData';

// ---- THE NOTEBOOK: the writing index as a page of a studio notebook. A red-line MARGIN (accent) runs down the left of the list and grows with
// scroll; as each entry reaches the reading line, a pen annotation draws itself beside it (a looping arrow, a ring around the date, a star).
// Hover an entry: its cover arrives as a small straight PRINT held by a paper clip, trailing the pointer (lerp), and the title gets a
// hand-drawn underline. Phone: the print sits inline beside each entry. ----

const MvntClip = () => (
  <svg className="mvnt-clip" viewBox="0 0 22 58" aria-hidden>
    <path
      d="M7 40V9a4.5 4.5 0 0 1 9 0v34a7 7 0 0 1-14 0V14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

// pen marks (pathLength=1 → draw by dashoffset). k = 0 arrow · 1 ring around the date · 2 star
const MvntMark = ({ k }) =>
  k === 1 ? (
    <svg className="mvnt-mk mvnt-mk-ring" viewBox="0 0 132 52" aria-hidden>
      <path
        pathLength={1}
        d="M14 14C34 3 104 2 122 16c12 10-6 26-44 29-34 3-68-2-72-15C3 18 22 8 40 6"
      />
    </svg>
  ) : k === 2 ? (
    <svg className="mvnt-mk mvnt-mk-star" viewBox="0 0 70 60" aria-hidden>
      <path
        pathLength={1}
        d="M33 7l6.5 15.5 16.8 1.2-12.9 10.6 4.4 16.6L33.6 42 19 51.4l4.3-16.8L10.6 24l16.9-1.6z"
      />
      <path
        className="mvnt-mk-2"
        pathLength={1}
        d="M58 8l6-5M61 15l8-2"
      />
    </svg>
  ) : (
    <svg className="mvnt-mk mvnt-mk-arr" viewBox="0 0 86 56" aria-hidden>
      <path
        pathLength={1}
        d="M5 44C9 20 30 6 46 12c14 5 6 22-5 16-9-5 3-20 22-17 8 1 13 5 17 12"
      />
      <path className="mvnt-mk-2" pathLength={1} d="M70 18l10 5-4 11" />
    </svg>
  );

const MvntLine = () => (
  <svg
    className="mvnt-ul"
    viewBox="0 0 300 12"
    preserveAspectRatio="none"
    aria-hidden
  >
    <path pathLength={1} d="M2 8C40 4 88 9 130 6s104-4 166 1" />
  </svg>
);

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

export default function MvNotes(props = {}) {
  const {
    eyebrow = 'FRAME 09 — Writing',
    heading = 'Notes from|the *studio*.',
    button = 'All writing',
    buttonLink = '/writing',
    pageLabel = 'Notebook · Vol. 3',
    pageNote = 'Written between projects',
    readSuffix = 'read',
    figLabel = 'Fig.',
    emptyText = 'New notes are on the way.',
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const Dh = {
    ...D,
    fontWeight: props.customFonts
      ? D.fontWeight
      : 'var(--mv-font-dw, 720)',
  };

  const root = useRef(null);
  const list = useRef(null);
  const print = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  useMagnet(root, live);
  const on = useOn(root, live, rm, 0.12);
  const rows = props.rows || defaultPosts;
  const anim = live && !rm && !still;
  const [act, setAct] = useState(-1);
  const [hov, setHov] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (live)
      setFine(
        window.matchMedia('(hover:hover) and (pointer:fine)').matches
      );
  }, [live]);

  // scroll: margin grows, each entry's pen mark draws when it reaches ~70% of the viewport
  const geo = useRef({ t: [], a: 0, b: 1, span: 0.1 });
  useEffect(() => {
    if (!anim || !root.current || !list.current) return;
    const el = root.current,
      ls = list.current;
    const m = () => {
      const H = el.offsetHeight || 1,
        vh = window.innerHeight || 1,
        L = vh + H;
      const top =
        ls.getBoundingClientRect().top - el.getBoundingClientRect().top;
      const rs = Array.from(ls.querySelectorAll('.mvnt-row'));
      geo.current = {
        t: rs.map(
          (r) =>
            (vh * 0.3 + top + r.offsetTop + r.offsetHeight * 0.5) / L
        ),
        a: (vh * 0.3 + top - vh * 0.1) / L,
        b: (vh * 0.3 + top + ls.offsetHeight) / L,
        span: (vh * 0.14) / L,
      };
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    window.addEventListener('resize', m);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', m);
    };
  }, [anim, rows.length]);

  useScrollVars(root, anim, rm, (sp) => {
    const g = geo.current;
    const r = root.current;
    if (!r) return;
    r.style.setProperty(
      '--ml',
      clamp01((sp - g.a) / Math.max(0.01, g.b - g.a)).toFixed(3)
    );
    const rs = list.current ? list.current.children : null;
    if (!rs) return;
    for (let i = 0; i < rs.length; i++) {
      const d = clamp01((sp - (g.t[i] ?? 1)) / g.span);
      rs[i].style.setProperty('--d', d.toFixed(3));
    }
  });

  // the underline spans the widest title line
  useEffect(() => {
    if (!live || !list.current) return;
    const ls = list.current;
    const fit = () =>
      ls.querySelectorAll('.mvnt-title').forEach((t) => {
        const s = t.firstElementChild;
        if (!s) return;
        t.style.width = '';
        try {
          const rg = document.createRange();
          rg.selectNodeContents(s);
          let mx = 0;
          for (const q of Array.from(rg.getClientRects()))
            mx = Math.max(mx, q.width);
          if (mx > 0) t.style.width = `${Math.ceil(mx)}px`;
        } catch (e) {}
      });
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(ls);
    document.fonts?.ready?.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [live, rows]);

  // the print trails the pointer (desktop, fine pointer only)
  useEffect(() => {
    if (!live || !fine || phone || !list.current || !print.current) return;
    const ls = list.current,
      pr = print.current;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      vx = 0,
      has = false,
      lk = '';
    const mv = (e) => {
      const a = ls.getBoundingClientRect();
      tx = e.clientX - a.left;
      ty = e.clientY - a.top;
      if (!has) {
        x = tx;
        y = ty;
        has = true;
      }
    };
    ls.addEventListener('pointermove', mv);
    const off = onTick(() => {
      if (!has) return;
      const k = rm ? 1 : 0.14;
      const nx = x + (tx - x) * k;
      vx = nx - x;
      x = nx;
      y += (ty - y) * k;
      const rot = rm ? 0 : Math.max(-5, Math.min(5, vx * 0.35));
      const key = `${x.toFixed(1)}|${y.toFixed(1)}|${rot.toFixed(2)}`;
      if (key === lk) return;
      lk = key;
      pr.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg)`;
    });
    return () => {
      off();
      ls.removeEventListener('pointermove', mv);
    };
  }, [live, fine, phone, rm]);

  const cur = act >= 0 ? rows[act] : null;

  return (
    <section
      ref={root}
      id={props.id || "writing"}
      className={`mv mv-sec mvnt${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}${anim ? ' is-anim' : ''}${hov ? ' is-hov' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html:
            CSS_BASE + CSS_MOTION + CSS_NOTES + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvnt-top">
          <div className="mvnt-hd">
            <Eyebrow text={eyebrow} on={on} M={M} />
            <Head
              text={heading}
              on={on}
              D={Dh}
              size="clamp(40px,4.3vw,64px)"
              lh={0.95}
              delay={80}
            />
          </div>
          <div className="mvnt-side" style={rise(on, 260)}>
            <p className="mvnt-page" style={M}>
              <span>{pageLabel}</span>
              <span>{pageNote}</span>
            </p>
            {button && (
              <Btn
                href={buttonLink || '/writing'}
                label={button}
                kind="ghost"
              />
            )}
          </div>
        </header>
        {rows.length === 0 ? (
          emptyText ? (
            <p className="mvnt-empty" style={M}>
              {emptyText}
            </p>
          ) : null
        ) : (
          <div className="mvnt-book">
            <i className="mvnt-margin" aria-hidden />
            <ol
              ref={list}
              className="mvnt-list"
              onPointerLeave={() => {
                setHov(false);
                setAct(-1);
              }}
            >
              {rows.map((r, i) => {
                const href = `/writing/${r.slug}`;
                const src = imgOf(r);
                return (
                  <li
                    key={r.slug || i}
                    className={`mvnt-row${act === i ? ' is-act' : ''}`}
                    style={rise(on, 300 + i * 110, 18)}
                    onPointerEnter={() => {
                      setAct(i);
                      setHov(true);
                    }}
                  >
                    <a
                      className="mvnt-a"
                      href={href}
                      onFocus={() => setAct(i)}
                      onBlur={() => setAct(-1)}
                    >
                      <span className="mvnt-date" style={M}>
                        {String(r.f2 || r.f3 || '').split('·')[0].trim()}
                        {i % 3 === 1 && <MvntMark k={1} />}
                      </span>
                      <span className="mvnt-main">
                        <span className="mvnt-title" style={Dh}>
                          <span>{r.f1}</span>
                          <MvntLine />
                        </span>
                        {r.f4 && (
                          <span className="mvnt-ex">
                            {r.f4}
                          </span>
                        )}
                      </span>
                      {r.f3 && (
                        <span className="mvnt-kick" style={M}>
                          {r.f3}
                        </span>
                      )}
                      <span className="mvnt-go" aria-hidden>
                        <IcoArrow s={16} />
                      </span>
                      {phone && src && (
                        <span className="mvnt-thumb" aria-hidden>
                          <img
                            {...RS(src, '96px')}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                          <MvntClip />
                        </span>
                      )}
                    </a>
                    {i % 3 !== 1 && (
                      <span className="mvnt-gut" aria-hidden>
                        <MvntMark k={i % 3} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
            {!phone && fine && (
              <div
                ref={print}
                className={`mvnt-print${hov && cur ? ' is-on' : ''}`}
                aria-hidden
              >
                <div className="mvnt-pc">
                  <MvntClip />
                  <div className="mvnt-ph">
                    {rows.map((r, i) => {
                      const s = imgOf(r);
                      return s ? (
                        <img
                          key={r.slug || i}
                          {...RS(s, '260px')}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className={act === i ? 'is-on' : ''}
                        />
                      ) : null;
                    })}
                  </div>
                  <p style={M}>
                    <b>
                      {figLabel}{' '}
                      {String(act + 1).padStart(2, '0')}
                    </b>
                    <span>
                      /writing/{cur ? cur.slug : ''}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const CSS_NOTES = `
.mvnt{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(96px,9vw,150px) 0 clamp(96px,9vw,150px);overflow:clip;--ml:1}
.mvnt.is-anim{--ml:0}
.mvnt .mv-eb{border-radius:6px}
.mvnt .mv-hd{font-stretch:115%;letter-spacing:-.04em}
/* accent word = a text selection: an accent block wipes in left→right in 8 steps, ink text on it */
.mvnt .mv-it{font-weight:inherit;color:var(--mv-ink);padding:0 .07em;margin:0 -.03em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) 0 0/0% 100% no-repeat;transition:background-size .72s steps(8,end) var(--pd,600ms)}
.mvnt .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvnt-top{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-bottom:clamp(48px,5vw,80px)}
.mvnt-hd{display:flex;flex-direction:column;gap:24px}
.mvnt-side{display:flex;flex-direction:column;align-items:flex-end;gap:18px}
.mvnt-page{display:flex;flex-direction:column;align-items:flex-end;gap:4px;margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)} 
.mvnt-page span:first-child{color:var(--mv-ink)}
.mvnt-empty{margin:0;padding:28px 0;border-top:1px solid var(--mv-fog);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
/* the page: gutter for pen marks · accent margin line · ruled entries */
.mvnt-book{position:relative;--gut:clamp(84px,8vw,128px)}
.mvnt-margin{position:absolute;left:calc(var(--gut) - 1px);top:-28px;bottom:-28px;width:2px;background:var(--mv-brass);transform-origin:50% 0;transform:scaleY(var(--ml));pointer-events:none}
.mvnt-list{list-style:none;margin:0;padding:0;position:relative;border-top:1px solid var(--mv-fog)}
.mvnt-row{position:relative;border-bottom:1px solid var(--mv-fog);--d:1}
.mvnt.is-anim .mvnt-row{--d:0}
.mvnt-a{position:relative;display:grid;grid-template-columns:110px minmax(0,1fr) auto 48px;align-items:center;gap:clamp(20px,2.5vw,40px);padding:clamp(28px,2.6vw,40px) 0 clamp(28px,2.6vw,40px) calc(var(--gut) + clamp(20px,2vw,32px));text-decoration:none;color:inherit;outline-offset:4px}
.mvnt-date{position:relative;justify-self:start;font-size:12px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
.mvnt-main{display:flex;flex-direction:column;gap:10px}
.mvnt-title{position:relative;align-self:flex-start;display:inline-block;font-size:clamp(26px,2.4vw,38px);line-height:1.06;letter-spacing:-.022em;font-stretch:112%;text-wrap:balance;padding-bottom:6px}
.mvnt-ex{font-size:16px;line-height:1.5;color:var(--mv-mut);max-width:52ch}
.mvnt-kick{justify-self:start;padding:6px 11px;border-radius:10px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent);font-size:12px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;transition:background .35s,box-shadow .35s}
.mvnt-read{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut);white-space:nowrap}
.mvnt-go{display:grid;place-items:center;width:44px;height:44px;border-radius:10px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent);transition:background .35s,box-shadow .35s} 
.mvnt-go svg{transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.mvnt-row.is-act .mvnt-go,.mvnt-a:focus-visible .mvnt-go{background:var(--mv-brass);box-shadow:none} 
.mvnt-row.is-act .mvnt-go svg,.mvnt-a:focus-visible .mvnt-go svg{transform:rotate(-45deg)}
.mvnt-row.is-act .mvnt-kick,.mvnt-a:focus-visible .mvnt-kick{background:color-mix(in srgb,var(--mv-brass) 45%,transparent);box-shadow:inset 0 0 0 1px transparent}
/* hand-drawn underline under the title on hover */
.mvnt-ul{position:absolute;left:-2px;right:-2px;bottom:-4px;width:calc(100% + 4px);height:12px;overflow:visible}
.mvnt-ul path{fill:none;stroke:var(--mv-ink);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:1 2;stroke-dashoffset:1;transition:stroke-dashoffset .6s cubic-bezier(.6,0,.2,1)}
.mvnt-row.is-act .mvnt-ul path,.mvnt-a:focus-visible .mvnt-ul path{stroke-dashoffset:0}
/* pen marks — draw with --d (scroll) */
.mvnt-mk{overflow:visible;pointer-events:none}
.mvnt-mk path{fill:none;stroke:var(--mv-ink);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 2;stroke-dashoffset:calc(1 - var(--d))}
.mvnt-mk .mvnt-mk-2{stroke-dashoffset:calc(1 - clamp(0,(var(--d) - .72)*3.6,1))}
.mvnt-gut{position:absolute;left:0;top:50%;width:calc(var(--gut) - 18px);translate:0 -50%;display:flex;justify-content:flex-end}
.mvnt-mk-arr{width:min(78px,100%);height:auto;translate:0 -6px}
.mvnt-mk-star{width:min(58px,80%);height:auto}
.mvnt-mk-ring{position:absolute;left:-8px;top:50%;width:calc(100% + 16px);height:36px;translate:0 -50%}
/* the print on a paper clip, trailing the pointer */
.mvnt-print{position:absolute;left:0;top:0;z-index:5;pointer-events:none;will-change:transform}
.mvnt-pc{position:absolute;left:28px;top:-118px;width:clamp(200px,17vw,250px);padding:10px 10px 12px;border-radius:4px;background:var(--mv-cloud);box-shadow:0 1px 0 color-mix(in srgb,var(--mv-ink) 8%,transparent),0 22px 44px -18px rgba(0,0,0,.34),0 6px 14px -8px rgba(0,0,0,.2);opacity:0;scale:.9;translate:0 10px;transform-origin:30% 0;transition:opacity .3s ease,scale .45s cubic-bezier(.34,1.56,.64,1),translate .45s cubic-bezier(.34,1.56,.64,1)}
.mvnt-print.is-on .mvnt-pc{opacity:1;scale:1;translate:0 0}
.mvnt-ph{position:relative;aspect-ratio:4/3;border-radius:3px;overflow:hidden;background:color-mix(in srgb,var(--mv-stone) 22%,transparent)}
.mvnt-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s ease}
.mvnt-ph img.is-on{opacity:1}
.mvnt-pc p{display:flex;justify-content:space-between;gap:10px;margin:10px 2px 0;font-size:12px;letter-spacing:.06em;color:var(--mv-ink);white-space:nowrap} 
.mvnt-pc p span{overflow:hidden;text-overflow:ellipsis;color:var(--mv-mut)}
.mvnt-clip{position:absolute;z-index:2;left:22px;top:-28px;width:18px;height:auto;color:color-mix(in srgb,var(--mv-stone) 45%,var(--mv-ink));filter:drop-shadow(0 1px 0 rgba(255,255,255,.6))}
/* tablet */
.mvnt.is-tab .mvnt-a{grid-template-columns:96px minmax(0,1fr) auto 44px;gap:18px}
.mvnt.is-tab .mvnt-book{--gut:72px}
/* phone: meta line, title, excerpt; the print sits inline on the right */
.mvnt.is-ph{padding:80px 0}
.mvnt.is-ph .mvnt-top{flex-direction:column;align-items:flex-start;gap:28px;margin-bottom:40px}
.mvnt.is-ph .mvnt-side{align-items:flex-start} 
.mvnt.is-ph .mvnt-page{align-items:flex-start}
.mvnt.is-ph .mvnt-book{--gut:30px}
.mvnt.is-ph .mvnt-a{grid-template-columns:auto auto 1fr 84px;grid-template-areas:"date kick . thumb" "main main main thumb" "read read read thumb";align-items:start;gap:12px 12px;padding:26px 0 26px calc(var(--gut) + 16px)}
.mvnt.is-ph .mvnt-date{grid-area:date;align-self:center} 
.mvnt.is-ph .mvnt-kick{grid-area:kick;padding:4px 8px} 
.mvnt.is-ph .mvnt-main{grid-area:main;gap:8px} 
.mvnt.is-ph .mvnt-read{grid-area:read} 
.mvnt.is-ph .mvnt-go{display:none}
.mvnt.is-ph .mvnt-title{font-size:24px} 
.mvnt.is-ph .mvnt-ex{font-size:15px}
.mvnt-thumb{grid-area:thumb;position:relative;align-self:start;margin-top:14px;padding:5px;border-radius:4px;background:var(--mv-cloud);box-shadow:0 10px 20px -12px rgba(0,0,0,.35);rotate:2deg}
.mvnt-thumb img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:2px}
.mvnt-thumb .mvnt-clip{left:12px;top:-18px;width:12px}
.mvnt.is-ph .mvnt-gut{width:26px;top:34px;translate:0 0;justify-content:flex-start;left:-2px}
.mvnt.is-ph .mvnt-mk-arr{width:26px;translate:0 0} 
.mvnt.is-ph .mvnt-mk-star{width:24px} 
.mvnt.is-ph .mvnt-mk-ring{left:-10px;width:calc(100% + 20px);height:34px}
@media (prefers-reduced-motion:reduce){.mvnt .mv-it{background-size:100% 100%!important}}
`;
