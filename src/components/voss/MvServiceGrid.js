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
  srcOf,
  RS,
  listOf,
  plainOf,
  Eyebrow,
  Btn,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { siteData, defaultServices } from './siteData';

const SG_PH = [
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80',
];

const sgPad = (n) => String(n).padStart(2, '0');
const sgHex = (s, i) =>
  /^#[0-9a-f]{6}$/i.test(String(s || '').trim())
    ? String(s).trim()
    : ['#FF5B2E', '#FFB224', '#3DDC84', '#22C3EE'][i % 4];

export default function MvServiceGrid(props = {}) {
  const {
    eyebrow = 'FRAME 01 — The gel pack',
    intro = 'Four ways I can help. Each one is scoped, priced and planned before we start, and every one ends with something shipped.',
    packLabel = '4 gels · 1 lens',
    gelLabel = 'Gel',
    countLabel = 'deliverables',
    detailsLabel = 'Details',
    emptyText = 'Services are on their way.',
    rateLabel = 'Rate card',
    rateNote = 'Three ways to work together',
    rates = 'Project|Fixed scope and price;Retainer|2–4 days a month;Sprint|One week, one problem',
    rateLink = '#contact',
    rateButton = 'Ask about rates',
    services = defaultServices,
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
  const grid = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm, 0.08);
  useMagnet(root, live);

  const rows = services || defaultServices;
  const n = rows.length;
  const anim = live && !rm && !still;
  const photos = [props.photo1, props.photo2, props.photo3, props.photo4];

  useEffect(() => {
    if (!anim || !grid.current || n === 0) return;
    const el = grid.current;
    let vis = true;
    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: '20% 0px 20% 0px' }
    );
    io.observe(el);
    let cards = [],
      tops = [],
      vh = 1,
      fresh = false;
    const cur = [],
      last = [];
    const read = () => {
      if (!vis) {
        fresh = false;
        return;
      }
      cards = Array.from(el.querySelectorAll('.mvsg-card'));
      tops = cards.map((k) => {
        const l = k.querySelector('.mvsg-lens');
        return (l || k).getBoundingClientRect().top;
      });
      vh = window.innerHeight || 1;
      fresh = true;
    };
    const off = onTick(() => {
      if (!fresh) return;
      cards.forEach((k, i) => {
        const x = clamp01((vh * 0.96 - tops[i]) / (vh * 0.44));
        const t = x * x * (3 - 2 * x);
        if (cur[i] === undefined) cur[i] = t;
        else {
          cur[i] += (t - cur[i]) * 0.12;
          if (Math.abs(t - cur[i]) < 0.001) cur[i] = t;
        }
        if (Math.abs(cur[i] - (last[i] ?? -1)) > 0.001) {
          last[i] = cur[i];
          k.style.setProperty('--g', cur[i].toFixed(4));
        }
      });
    }, read);
    return () => {
      off();
      io.disconnect();
    };
  }, [anim, n]);

  const rt = listOf(rates).map((x) => {
    const [a, b] = x.split('|');
    return { a: (a || '').trim(), b: (b || '').trim() };
  });

  return (
    <section
      ref={root}
      className={`mv mv-sec mvsg${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-in' : ''}${anim ? ' is-anim' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
      aria-label={plainOf(eyebrow) || 'Services'}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_SG + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvsg-top">
          <Eyebrow text={eyebrow} on={on} M={M} />
          {intro && (
            <p className="mvsg-intro" style={rise(on, 140, 14)}>
              {intro}
            </p>
          )}
          {packLabel && (
            <p
              className="mvsg-pack"
              style={{ ...M, ...rise(on, 220, 10) }}
            >
              <span aria-hidden>
                {rows.map((r, i) => (
                  <i
                    key={i}
                    style={{ background: sgHex(r.f5, i) }}
                  />
                ))}
              </span>
              {packLabel}
            </p>
          )}
        </header>
        {n === 0 ? (
          <p className="mvsg-empty" style={M}>
            {emptyText}
          </p>
        ) : (
          <div ref={grid} className="mvsg-grid">
            {rows.map((r, i) => {
              const g = sgHex(r.f5, i);
              const dl = listOf(r.f4);
              const im = RS(
                srcOf(photos[i], SG_PH[i % 4]),
                phone
                  ? '100vw'
                  : tab
                  ? '45vw'
                  : '(max-width: 1099px) 50vw, 46vw'
              );
              const href = `#services-${r.slug || i}`;
              return (
                <article
                  key={r.slug || i}
                  className="mvsg-card"
                  style={{
                    '--gc': g,
                    ...rise(on, 200 + i * 110, 26),
                  }}
                >
                  <a
                    className="mvsg-lens"
                    href={href}
                    tabIndex={-1}
                    aria-hidden
                  >
                    <img
                      src={im.src}
                      srcSet={im.srcSet}
                      sizes={im.sizes}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <i className="mvsg-key" />
                    <span className="mvsg-gel" />
                    <span className="mvsg-gt">
                      <span
                        className="mvsg-tab"
                        style={M}
                      >
                        {gelLabel} {sgPad(i + 1)} · {g.toUpperCase()}
                      </span>
                      <i className="mvsg-c1" />
                      <i className="mvsg-c2" />
                    </span>
                  </a>
                  <div className="mvsg-body">
                    <p className="mvsg-meta" style={M}>
                      <span>
                        {sgPad(i + 1)} / {sgPad(n)}
                      </span>
                      <i
                        className="mvsg-sw"
                        aria-hidden
                      />
                      <span>
                        {dl.length} {countLabel}
                      </span>
                    </p>
                    <h2 className="mvsg-t" style={D}>
                      <a href={href}>{r.f1}</a>
                    </h2>
                    {r.f2 && (
                      <p className="mvsg-short">{r.f2}</p>
                    )}
                    {r.f3 && (
                      <p className="mvsg-desc">{r.f3}</p>
                    )}
                    {dl.length > 0 && (
                      <ul
                        className="mvsg-tags"
                        style={M}
                        aria-label={`${r.f1} ${countLabel}`}
                      >
                        {dl.map((t, k) => (
                          <li key={k}>{t}</li>
                        ))}
                      </ul>
                    )}
                    {detailsLabel && (
                      <div className="mvsg-go">
                        <Btn
                          href={href}
                          label={detailsLabel}
                          kind="ghost"
                          ariaLabel={`${detailsLabel}: ${r.f1}`}
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {rt.length > 0 && (
          <div className="mvsg-rate" style={rise(on, 300, 16)}>
            <div className="mvsg-rl">
              <p className="mvsg-rk" style={M}>
                {rateLabel}
              </p>
              {rateNote && (
                <p className="mvsg-rn" style={D}>
                  {rateNote}
                </p>
              )}
            </div>
            <ol className="mvsg-rs">
              {rt.map((x, i) => (
                <li key={i}>
                  <span className="mvsg-ri" style={M}>
                    {sgPad(i + 1)}
                  </span>
                  <b style={D}>{x.a}</b>
                  {x.b && (
                    <span className="mvsg-rd">{x.b}</span>
                  )}
                </li>
              ))}
            </ol>
            {rateButton && (
              <div className="mvsg-rb">
                <Btn
                  href={pick(
                    rateLink,
                    site.book || '#contact'
                  )}
                  label={rateButton}
                  kind="solid"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const CSS_SG = `
.mvsg{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(72px,8vw,128px) 0 clamp(96px,9vw,150px)}
.mvsg-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) auto;align-items:start;gap:32px;padding-bottom:28px;margin-bottom:clamp(36px,4vw,56px);border-bottom:1px solid var(--mv-fog)}
.mvsg-intro{margin:0;max-width:52ch;font-size:18px;line-height:1.5}
.mvsg-pack{display:flex;align-items:center;gap:10px;margin:6px 0 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut);white-space:nowrap} .mvsg-pack span{display:flex} .mvsg-pack span i{width:14px;height:18px;border-radius:2px;margin-right:-5px;mix-blend-mode:multiply;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--mv-ink) 80%,transparent)} .mvsg-pack span i:last-child{margin-right:0}
.mvsg-empty{padding:40px 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvsg-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(40px,4vw,64px) clamp(24px,2.6vw,40px)}
.mvsg-card{--g:1;position:relative;display:flex;flex-direction:column;gap:26px}
.mvsg.is-anim .mvsg-card{--g:0}
/* the lens: B&W still + the gel in its holder */
.mvsg-lens{position:relative;display:block;aspect-ratio:16/11;border-radius:4px;overflow:hidden;isolation:isolate;background:color-mix(in srgb,var(--mv-ink) 14%,var(--mv-bone));perspective:900px}
.mvsg-lens img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.1) brightness(1.05);scale:1.06;transition:scale 1.2s cubic-bezier(.2,.8,.2,1)}
.mvsg-gel{position:absolute;inset:0;z-index:2;background:var(--gc);mix-blend-mode:multiply;opacity:.9;box-shadow:inset 0 0 0 8px color-mix(in srgb,var(--mv-ink) 90%,transparent),inset 0 0 0 9px rgba(255,255,255,.22);translate:calc((var(--g) - 1)*104%) 0;transform-origin:50% 100%;transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .5s,filter .5s;will-change:translate}
.mvsg-gel::after{content:"";position:absolute;top:0;bottom:0;right:0;width:22%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18));mix-blend-mode:screen}
.mvsg-gt{position:absolute;inset:0;z-index:4;pointer-events:none;translate:calc((var(--g) - 1)*104%) 0;transform-origin:50% 100%;transition:transform .7s cubic-bezier(.2,.8,.2,1)}
.mvsg-tab{position:absolute;left:18px;bottom:18px;padding:4px 8px;border-radius:4px;background:var(--mv-ink);color:var(--mv-cloud);font-size:12px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
.mvsg-gt i{position:absolute;top:-2px;width:26px;height:12px;border-radius:0 0 4px 4px;background:var(--mv-ink)} .mvsg-c1{left:22%} .mvsg-c2{right:22%}
.mvsg-key{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(55% 60% at 72% 20%,rgba(255,241,218,.75),rgba(255,226,180,0) 70%);mix-blend-mode:screen;opacity:.35;transition:opacity .6s}
.mvsg-card:hover :is(.mvsg-gel,.mvsg-gt),.mvsg-card:focus-within :is(.mvsg-gel,.mvsg-gt){transform:rotateX(9deg) rotate(-2deg) translateY(-3%) scale(.97)} .mvsg-card:hover .mvsg-gel,.mvsg-card:focus-within .mvsg-gel{transform:rotateX(9deg) rotate(-2deg) translateY(-3%) scale(.97);opacity:.62;filter:saturate(1.25) brightness(1.12)}
.mvsg-card:hover .mvsg-key,.mvsg-card:focus-within .mvsg-key{opacity:1} .mvsg-card:hover .mvsg-lens img{scale:1.1}
/* body */
.mvsg-body{display:flex;flex-direction:column;align-items:flex-start}
.mvsg-meta{display:flex;align-items:center;gap:12px;margin:0 0 16px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvsg-sw{width:22px;height:12px;border-radius:2px;background:var(--gc);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--mv-ink) 80%,transparent)}
.mvsg-t{margin:0;font-size:clamp(34px,3.2vw,48px);line-height:.98;letter-spacing:-.042em;font-stretch:115%;font-weight:760}
.mvsg-t a{text-decoration:none;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .5s steps(8);border-radius:2px}
.mvsg-card:hover .mvsg-t a,.mvsg-t a:focus-visible{background-size:100% 100%}
.mvsg-short{margin:16px 0 0;max-width:46ch;font-size:18px;line-height:1.45;font-weight:500}
.mvsg-desc{margin:10px 0 0;max-width:52ch;font-size:16px;line-height:1.55;color:var(--mv-mut)}
.mvsg-tags{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:22px 0 0;padding:0}
.mvsg-tags li{padding:6px 10px;border-radius:6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;background:color-mix(in srgb,var(--mv-ink) 5%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 16%,transparent)}
.mvsg-tags li:first-child{background:color-mix(in srgb,var(--gc) 32%,var(--mv-bone));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent)}
.mvsg-go{margin-top:28px}
/* rate card */
.mvsg-rate{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,2fr) auto;align-items:center;gap:clamp(24px,3vw,48px);margin-top:clamp(64px,7vw,110px);padding:26px 28px;border-radius:10px;background:color-mix(in srgb,var(--mv-ink) 4%,var(--mv-bone));box-shadow:inset 0 0 0 1px var(--mv-fog)}
.mvsg-rk{margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)} .mvsg-rn{margin:0;font-size:22px;line-height:1.1;letter-spacing:-.03em;font-stretch:112%;font-weight:700}
.mvsg-rs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));list-style:none;margin:0;padding:0}
.mvsg-rs li{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:12px;row-gap:4px;padding:4px 20px;border-left:1px solid var(--mv-fog)}
.mvsg-ri{grid-row:span 2;font-size:12px;letter-spacing:.1em;color:var(--mv-mut);padding-top:5px}
.mvsg-rs b{font-size:21px;line-height:1.15;letter-spacing:-.03em;font-stretch:112%;font-weight:700;justify-self:start;padding:0 .08em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .45s steps(6)}
.mvsg-rs li:hover b{background-size:100% 100%}
.mvsg-rd{font-size:15px;line-height:1.4;color:var(--mv-mut)}
/* tablet: one column, lens beside the copy */
.mvsg.is-tab .mvsg-top{grid-template-columns:minmax(0,1fr) auto} .mvsg.is-tab .mvsg-intro{grid-column:1/-1;grid-row:2}
.mvsg.is-tab .mvsg-grid{grid-template-columns:minmax(0,1fr)} .mvsg.is-tab .mvsg-card{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1fr);gap:32px;align-items:start} .mvsg.is-tab .mvsg-lens{aspect-ratio:4/5} .mvsg.is-tab .mvsg-t{font-size:36px}
.mvsg.is-tab .mvsg-rate{grid-template-columns:minmax(0,1fr) auto} .mvsg.is-tab .mvsg-rs{grid-column:1/-1;grid-row:2} .mvsg.is-tab .mvsg-rs li:first-child{border-left:0;padding-left:0}
/* phone */
.mvsg.is-ph .mvsg-top{grid-template-columns:minmax(0,1fr);gap:18px} .mvsg.is-ph .mvsg-intro{font-size:17px}
.mvsg.is-ph .mvsg-grid{grid-template-columns:minmax(0,1fr);gap:56px} .mvsg.is-ph .mvsg-card{gap:20px} .mvsg.is-ph .mvsg-lens{aspect-ratio:4/3} .mvsg.is-ph .mvsg-t{font-size:34px} .mvsg.is-ph .mvsg-short{font-size:17px} .mvsg.is-ph .mvsg-tab{left:14px;bottom:14px}
.mvsg.is-ph .mvsg-go,.mvsg.is-ph .mvsg-go .mv-btn{width:100%}
.mvsg.is-ph .mvsg-rate{grid-template-columns:minmax(0,1fr);padding:22px 20px;gap:20px} .mvsg.is-ph .mvsg-rs{grid-template-columns:minmax(0,1fr);gap:0} .mvsg.is-ph .mvsg-rs li{border-left:0;border-top:1px solid var(--mv-fog);padding:14px 0} .mvsg.is-ph .mvsg-rb .mv-btn{width:100%}
@media (prefers-reduced-motion:reduce){.mvsg-gel,.mvsg-gt{translate:0 0!important}}
`;
