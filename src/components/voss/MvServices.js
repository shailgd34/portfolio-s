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
  clamp01,
  rise,
  RS,
  srcOf,
  listOf,
  Btn,
  Eyebrow,
  Head,
  onTick,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultServices } from './siteData';

// ---- THE GELS: a black-and-white studio still on the right, the services on the left.
// Every service owns a theatre GEL (its hex) in a thin holder frame;
// as the rows pass the middle of the screen the gels slide across the photo one after another (multiply), tinting it.
// The service whose gel sits in front of the lens is lit and its deliverables open as mono tags.
// Hover / focus a row = its gel swings in at once. Phone: photo band on top, sticky. ----
const SV_PHOTO =
  'https://framerusercontent.com/images/geINM5CMmcifnkxZDAyX24Jtnwc.webp';

const svPad = (n) => String(n).padStart(2, '0');
const svHex = (s, i) =>
  /^#[0-9a-f]{6}$/i.test(String(s || '').trim())
    ? String(s).trim()
    : ['#FF5B2E', '#FFB224', '#3DDC84', '#22C3EE'][i % 4];

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

export default function MvServices(props = {}) {
  const {
    eyebrow = 'FRAME 03 — Services',
    title = 'What I can|*do* for you.',
    allLabel = 'All capabilities',
    allLink = '/services',
    photo,
    photoAlt = 'A designer at a desk, lit for a studio still',
    plate = 'Plate 03 · Studio desk · f/4 · 1/125',
    gelLabel = 'Gel',
    countLabel = 'deliverables',
    emptyText = 'Services are on their way.',
    services = defaultServices,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();

  const root = useRef(null);
  const photoRef = useRef(null);
  const listRef = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm);
  useMagnet(root, live);
  useScrollVars(root, live, rm);

  const rows = services && services.length > 0 ? services : defaultServices;
  const n = rows.length;
  const fixed = still || rm || !live;

  const [act, setAct] = useState(0);
  const [hv, setHv] = useState(0);
  const hov = useRef(-1);

  const src = srcOf(photo, SV_PHOTO);
  const im = RS(src, '(max-width: 809px) 100vw, 50vw');

  // scroll → --gp (gel position, continuous): the gels hold still while a row is centred and slide between rows
  useEffect(() => {
    if (
      !live ||
      rm ||
      !root.current ||
      !photoRef.current ||
      !listRef.current ||
      n === 0
    )
      return;

    const el = root.current,
      ph = photoRef.current,
      ls = listRef.current;
    let vis = true;

    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: '20% 0px 20% 0px' }
    );
    io.observe(el);

    let cs = [],
      refY = 0,
      vhh = 1,
      gp = -9,
      last = -9,
      la = -1,
      fresh = false;

    const read = () => {
      if (!vis) {
        fresh = false;
        return;
      }
      cs = Array.from(ls.querySelectorAll('.mvsv-hd')).map((h) => {
        const r = h.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      vhh = window.innerHeight || 1;
      if (window.innerWidth < 810) {
        const pr = ph.getBoundingClientRect();
        refY = pr.bottom + (vhh - pr.bottom) * 0.38;
      } else {
        refY = vhh * 0.5;
      }
      fresh = true;
    };

    const sm = (x) => {
      const t = clamp01((x - 0.28) / 0.44);
      return t * t * (3 - 2 * t);
    };

    const off = onTick(() => {
      if (!fresh || !cs.length) return;
      let t;
      if (hov.current >= 0) {
        t = hov.current;
      } else if (refY < cs[0]) {
        t = -1 + sm(clamp01(1 - (cs[0] - refY) / (vhh * 0.55)));
      } else if (refY >= cs[cs.length - 1]) {
        t = cs.length - 1;
      } else {
        let i = 0;
        while (i < cs.length - 2 && refY >= cs[i + 1]) i++;
        t = i + sm((refY - cs[i]) / Math.max(1, cs[i + 1] - cs[i]));
      }

      if (gp < -5) {
        gp = t;
      } else {
        gp += (t - gp) * (hov.current >= 0 ? 0.2 : 0.14);
        if (Math.abs(t - gp) < 0.001) gp = t;
      }

      if (Math.abs(gp - last) > 0.0008) {
        last = gp;
        ph.style.setProperty('--gp', gp.toFixed(4));
      }

      const a = Math.max(0, Math.min(n - 1, Math.round(gp)));
      if (a !== la) {
        la = a;
        setAct(a);
      }
    }, read);

    let sy = window.scrollY;
    const onScr = () => {
      if (Math.abs(window.scrollY - sy) > 24) {
        sy = window.scrollY;
        if (
          hov.current >= 0 &&
          !(document.activeElement && ls.contains(document.activeElement))
        ) {
          hov.current = -1;
        }
      }
    };
    window.addEventListener('scroll', onScr, { passive: true });

    return () => {
      off();
      io.disconnect();
      window.removeEventListener('scroll', onScr);
    };
  }, [live, rm, n]);

  const cur = fixed ? hv : act;
  const gOn = (i) => {
    hov.current = i;
    setHv(i);
  };
  const r0 = rows[Math.min(cur, Math.max(0, n - 1))];

  return (
    <section
      ref={root}
      id="services"
      className={`mv mv-sec mvsv${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-in' : ''}${fixed ? ' is-fixed' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
      aria-labelledby="mvsv-h"
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_SV + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvsv-top">
          <div className="mvsv-tl">
            <Eyebrow text={eyebrow} on={on} M={M} />
            <div id="mvsv-h">
              <Head
                text={title}
                on={on}
                D={D}
                size="clamp(40px,4.3vw,64px)"
                lh={0.95}
                delay={120}
                style={{ fontStretch: '115%', fontWeight: 760 }}
              />
            </div>
          </div>
          {allLabel && (
            <div style={rise(on, 380, 14)}>
              <Btn
                href={allLink || '/services'}
                label={allLabel}
                kind="ghost"
              />
            </div>
          )}
        </header>

        {n === 0 ? (
          <p className="mvsv-empty" style={M}>
            {emptyText}
          </p>
        ) : (
          <div className="mvsv-grid">
            <div className="mvsv-phw">
              <div
                ref={photoRef}
                className="mvsv-ph"
                style={
                  fixed
                    ? { '--gp': hv }
                    : undefined
                }
              >
                <img
                  src={im.src}
                  srcSet={im.srcSet}
                  sizes={im.sizes}
                  alt={photoAlt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                {rows.map((r, i) => (
                  <i
                    key={r.slug || i}
                    className="mvsv-gel"
                    aria-hidden
                    style={{
                      '--gi': i,
                      '--gc': svHex(r.f5, i),
                    }}
                  />
                ))}
                <i className="mvsv-key" aria-hidden />
                {rows.map((r, i) => (
                  <span
                    key={'t' + (r.slug || i)}
                    className="mvsv-gt"
                    aria-hidden
                    style={{ '--gi': i }}
                  >
                    <b style={M}>
                      {gelLabel} {svPad(i + 1)} ·{' '}
                      {svHex(r.f5, i).toUpperCase()}
                    </b>
                  </span>
                ))}
                <span className="mvsv-hold" aria-hidden>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <p
                  className="mvsv-read"
                  style={M}
                  aria-live="off"
                >
                  <b
                    style={{
                      background: svHex(r0 && r0.f5, cur),
                    }}
                  />
                  {svPad(cur + 1)} / {svPad(n)} ·{' '}
                  {r0 ? r0.f1 : ''}
                </p>
              </div>
              {plate && (
                <p className="mvsv-plate" style={M}>
                  {plate}
                </p>
              )}
            </div>

            <ol ref={listRef} className="mvsv-list">
              {rows.map((r, i) => {
                const dl = listOf(r.f4);
                const g = svHex(r.f5, i);
                return (
                  <li
                    key={r.slug || i}
                    className={`mvsv-row${i === cur ? ' is-act' : ''}`}
                    style={{
                      '--gc': g,
                      ...rise(on, 260 + i * 90, 18),
                    }}
                    onPointerMove={(e) => {
                      if (
                        (e.movementX || e.movementY) &&
                        hov.current !== i
                      ) {
                        gOn(i);
                      }
                    }}
                    onPointerLeave={() => {
                      hov.current = -1;
                    }}
                  >
                    <div className="mvsv-meta" style={M}>
                      <span>{svPad(i + 1)}</span>
                      <i
                        className="mvsv-sw"
                        aria-hidden
                      />
                      <span>
                        {dl.length} {countLabel}
                      </span>
                    </div>
                    <a
                      className="mvsv-hd"
                      href={`/services/${r.slug}`}
                      onClick={(e) => {
                        // Smoothly highlight or jump
                        gOn(i);
                      }}
                      onFocus={() => gOn(i)}
                      onBlur={() => {
                        hov.current = -1;
                      }}
                    >
                      <h3 style={D}>{r.f1}</h3>
                      <span
                        className="mvsv-arr"
                        aria-hidden
                      >
                        <IcoArrow s={18} />
                      </span>
                    </a>
                    {r.f2 && (
                      <p className="mvsv-short">{r.f2}</p>
                    )}
                    {dl.length > 0 && (
                      <ul
                        className="mvsv-tags"
                        style={M}
                        aria-label={`${r.f1} ${countLabel}`}
                      >
                        {dl.map((t, k) => (
                          <li
                            key={k}
                            style={{
                              transitionDelay: `${80 + k * 55}ms`,
                            }}
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

const CSS_SV = `
.mvsv{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(96px,10vw,160px) 0 clamp(96px,9vw,150px)}
.mvsv .mv-hd{font-stretch:115%} .mvsv .mv-it{display:inline-block;font-weight:inherit;color:var(--mv-ink);line-height:1.02;padding:0 .07em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .72s steps(8) var(--pd,600ms)} .mvsv .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvsv-top{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;margin-bottom:clamp(48px,6vw,88px)} .mvsv-tl{display:grid;gap:22px;max-width:760px}
.mvsv-empty{padding:40px 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvsv-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.04fr);gap:clamp(32px,5vw,96px);align-items:start}
.mvsv-phw{grid-column:2;grid-row:1;position:sticky;top:max(24px,calc(50vh - min(36vh,330px) - 20px))}
.mvsv-ph{--gp:0;position:relative;height:min(72vh,660px);border-radius:4px;overflow:hidden;isolation:isolate;background:color-mix(in srgb,var(--mv-ink) 12%,var(--mv-bone))}
.mvsv-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%;filter:grayscale(1) contrast(1.12) brightness(1.06);scale:1.06;translate:0 calc((var(--sp,.5) - .5)*-4%)}
/* the gels: one sheet per service, in a thin holder frame, sliding across the lens with --gp */
.mvsv-gel{position:absolute;inset:0;z-index:1;background:var(--gc);mix-blend-mode:multiply;opacity:.9;box-shadow:inset 0 0 0 7px color-mix(in srgb,var(--mv-ink) 88%,transparent),inset 0 0 0 8px rgba(255,255,255,.2);translate:calc(clamp(-1.2,var(--gi) - var(--gp),1.2)*103%) 0;will-change:translate}
.mvsv-key{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(60% 55% at 78% 16%,rgba(255,241,218,.5),rgba(255,226,180,0) 70%);mix-blend-mode:screen}
.mvsv-gt{position:absolute;inset:0;z-index:3;pointer-events:none;translate:calc(clamp(-1.2,var(--gi) - var(--gp),1.2)*103%) 0} .mvsv-gt b{position:absolute;left:18px;bottom:16px;padding:4px 8px;border-radius:4px;background:var(--mv-ink);color:var(--mv-cloud);font-size:12px;font-weight:400;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
.mvsv-hold{position:absolute;inset:0;z-index:4;pointer-events:none} .mvsv-hold i{position:absolute;width:16px;height:16px;border:1.5px solid var(--mv-cloud);opacity:.85} .mvsv-hold i:nth-child(1){left:14px;top:14px;border-right:0;border-bottom:0} .mvsv-hold i:nth-child(2){right:14px;top:14px;border-left:0;border-bottom:0} .mvsv-hold i:nth-child(3){left:14px;bottom:14px;border-right:0;border-top:0;opacity:0} .mvsv-hold i:nth-child(4){right:14px;bottom:14px;border-left:0;border-top:0}
.mvsv-read{position:absolute;z-index:5;left:18px;top:16px;margin:0;display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:6px;background:color-mix(in srgb,var(--mv-bone) 90%,transparent);color:var(--mv-ink);font-size:12px;letter-spacing:.1em;text-transform:uppercase;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)} .mvsv-read b{width:10px;height:10px;border-radius:2px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 30%,transparent);transition:background .4s}
.mvsv-plate{margin:12px 0 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvsv-list{grid-column:1;grid-row:1;list-style:none;margin:0;padding:0;border-top:1px solid var(--mv-fog)}
.mvsv-row{position:relative;padding:clamp(34px,4.4vw,58px) 0 clamp(34px,4.4vw,58px) 26px;border-bottom:1px solid var(--mv-fog)}
.mvsv-row::before{content:"";position:absolute;left:0;top:clamp(34px,4.4vw,58px);bottom:clamp(34px,4.4vw,58px);width:4px;border-radius:2px;background:var(--gc);transform-origin:50% 0;scale:1 0;transition:scale .6s cubic-bezier(.7,0,.2,1)}
.mvsv-row.is-act::before{scale:1 1}
.mvsv-row>*:not(.mvsv-tags){transition:opacity .5s}
.mvsv:not(.is-fixed) .mvsv-row:not(.is-act):not(:focus-within) .mvsv-hd h3{color:var(--mv-mut)}
.mvsv-meta{display:flex;align-items:center;gap:12px;margin:0 0 14px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvsv-sw{width:22px;height:12px;border-radius:2px;background:var(--gc);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--mv-ink) 80%,transparent)}
.mvsv-hd{display:flex;align-items:center;justify-content:space-between;gap:18px;text-decoration:none;color:inherit;border-radius:6px}
.mvsv-hd h3{margin:0;font-size:clamp(34px,3vw,44px);line-height:1;letter-spacing:-.04em;font-stretch:112%;font-weight:720;transition:translate .5s cubic-bezier(.2,.8,.2,1)}
.mvsv-arr{display:grid;place-items:center;width:44px;height:44px;flex:none;border-radius:10px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent);transition:background .35s,box-shadow .35s}
.mvsv-row.is-act .mvsv-arr{background:var(--mv-ink);color:var(--mv-bone);box-shadow:none}
.mvsv-arr svg{transition:rotate .45s cubic-bezier(.34,1.56,.64,1)} .mvsv-hd:hover .mvsv-arr,.mvsv-hd:focus-visible .mvsv-arr{background:var(--mv-brass);color:var(--mv-ink);box-shadow:none} .mvsv-hd:hover .mvsv-arr svg,.mvsv-hd:focus-visible .mvsv-arr svg{rotate:-45deg}
.mvsv-hd:hover h3,.mvsv-hd:focus-visible h3{translate:6px 0}
.mvsv-short{margin:14px 0 0;max-width:470px;font-size:17px;line-height:1.5;color:var(--mv-mut)}
.mvsv-tags{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:20px 0 0;padding:0}
.mvsv-tags li{padding:6px 10px;border-radius:6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;background:color-mix(in srgb,var(--mv-ink) 5%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 16%,transparent);clip-path:inset(0 100% 0 0);opacity:0;transition:clip-path .5s steps(6),opacity .3s,background .4s}
.mvsv-row.is-act .mvsv-tags li,.mvsv.is-fixed .mvsv-tags li{clip-path:inset(0 0 0 0);opacity:1}
.mvsv-row.is-act .mvsv-tags li:first-child{background:var(--mv-brass);box-shadow:none}
/* tablet */
.mvsv.is-tab .mvsv-grid{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:36px} .mvsv.is-tab .mvsv-ph{height:auto;aspect-ratio:4/5} .mvsv.is-tab .mvsv-hd h3{font-size:32px} .mvsv.is-tab .mvsv-short{font-size:16px}
/* phone: the photo is a sticky band on top, rows pass under it */
.mvsv.is-ph .mvsv-top{flex-direction:column;align-items:flex-start;gap:26px;margin-bottom:34px}
.mvsv.is-ph .mvsv-grid{grid-template-columns:minmax(0,1fr);gap:0}
.mvsv.is-ph .mvsv-phw{grid-column:1;grid-row:1;top:0;z-index:3;margin:0 -20px;padding:10px 20px 12px;background:var(--mv-bone);box-shadow:0 1px 0 var(--mv-fog)}
.mvsv.is-ph .mvsv-ph{height:auto;aspect-ratio:16/10} .mvsv.is-ph .mvsv-plate{display:none}
.mvsv.is-ph .mvsv-list{grid-column:1;grid-row:2;border-top:0}
.mvsv.is-ph .mvsv-row{padding:30px 0 30px 18px} .mvsv.is-ph .mvsv-row::before{top:30px;bottom:30px}
.mvsv.is-ph .mvsv-hd h3{font-size:30px} .mvsv.is-ph .mvsv-short{font-size:16px} .mvsv.is-ph .mvsv-arr{width:40px;height:40px}
.mvsv.is-ph .mvsv-read{font-size:12px;left:12px;top:10px;padding:5px 8px} .mvsv.is-ph .mvsv-gt b{left:12px;bottom:10px}
@media (prefers-reduced-motion:reduce){.mvsv-gel,.mvsv-gt{transition:translate .01ms}}
`;
