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
  useOn,
  useMagnet,
  useScrollVars,
  rise,
  plainOf,
  pick,
  Btn,
  Eyebrow,
  Head,
  useSite,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';
import { defaultExperience } from './siteData';

// ---- THE CREDITS: the résumé as an END-CREDITS ROLL. A pinned film gate (rounded frame + four corner marks, reel labels) holds a centred
// two-column credits roll — role in mono caps on the right-aligned side, company in display on the left-aligned side, grouped Work / Education /
// Awards — that rolls UP with scroll (--pp), fading in at the bottom edge and out at the top, while a mono TIMECODE counts in the corner.
// It ends on the closing card "Directed & built by …". Hover a credit: the selection block snaps round it and its Summary opens underneath.
// Phone / reduced motion / canvas: no pin, the whole list in the same typography. ----

const GROUPS = [
  ['work', 'groupWork'],
  ['edu', 'groupEdu'],
  ['award', 'groupAward'],
];

const tcOf = (sec) => {
  const f = Math.floor(sec * 24);
  const ff = f % 24,
    s = Math.floor(f / 24) % 60,
    m = Math.floor(f / 1440) % 60,
    h = Math.floor(f / 86400);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(h)}:${p(m)}:${p(s)}:${p(ff)}`;
};

export default function MvCredits(props = {}) {
  const site = useSite();

  const {
    eyebrow = 'FRAME 06 — Résumé',
    heading = 'The *credits*.',
    primary = 'Download résumé',
    primaryLink = '',
    secondary = 'Contact me',
    secondaryLink = '#contact',
    opener = '{years} years in production',
    openerKicker = 'A {name} production',
    closingKicker = 'Directed & built by',
    closingName = '',
    closingLine = 'Shot on location in {city}',
    cornerTL = 'End credits',
    cornerTR = 'Reel 06 · 24 fps',
    cornerBL = 'Résumé · {name}',
    runTime = 96,
    rollLength = 260,
    experience = defaultExperience,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();

  const root = useRef(null);
  const gate = useRef(null);
  const roll = useRef(null);
  const card = useRef(null);
  const tc = useRef(null);

  const { w, vh } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm);
  useMagnet(root, live);

  const pin = live && !rm && !still && !phone;
  const rows = experience && experience.length > 0 ? experience : defaultExperience;

  const fill = (s) =>
    String(s || '')
      .replace(/\{name\}/g, site.name)
      .replace(/\{years\}/g, site.years || '6')
      .replace(/\{city\}/g, site.city || 'Indore, India')
      .replace(/\s+/g, ' ')
      .trim();

  const groups = GROUPS.map(([k, pk]) => ({
    k,
    title: String(
      props[pk] ??
        (k === 'work' ? 'Work' : k === 'edu' ? 'Education' : 'Awards')
    ),
    items: rows.filter((r) => {
      const t = String(r.f5 || 'work')
        .toLowerCase()
        .trim();
      return k === 'work' ? !['edu', 'award'].includes(t) : t === k;
    }),
  })).filter((g) => g.items.length);

  const [geo, setGeo] = useState({ r0: 0, r1: 0 });

  useLayoutEffect(() => {
    if (!pin) return;
    const g = gate.current,
      r = roll.current,
      cd = card.current;
    if (!g || !r || !cd) return;

    const m = () => {
      const gh = g.clientHeight;
      const cm = cd.offsetTop + cd.offsetHeight / 2;
      const n = { r0: Math.round(gh * 0.36), r1: Math.round(gh / 2 - cm) };
      setGeo((o) => (o.r0 === n.r0 && o.r1 === n.r1 ? o : n));
    };
    m();

    const ro = new ResizeObserver(m);
    ro.observe(g);
    ro.observe(r);
    const t = window.setTimeout(m, 900);

    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [pin, rows.length, w]);

  const lastTc = useRef('');
  useScrollVars(root, pin, rm, (_sp, pp) => {
    const s = tcOf(pp * Math.max(10, runTime || 96));
    if (s !== lastTc.current && tc.current) {
      lastTc.current = s;
      tc.current.textContent = s;
    }
  });

  const endTc = tcOf(Math.max(10, runTime || 96));
  const resume = pick(primaryLink, site.resume || '/resume');
  const name = pick(closingName, site.name);
  let k = 0;

  return (
    <section
      ref={root}
      id="experience"
      className={`mv mv-sec mv-dark mvcr${pin ? ' is-pin' : ' is-flat'}${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-on' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        '--len': `${Math.max(160, rollLength || 260)}`,
        '--r0': `${geo.r0}px`,
        '--r1': `${geo.r1}px`,
        ...(props.style || {}),
      }}
      aria-label={plainOf(heading)}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_CR + siteFontCss(props),
        }}
      />
      <div className="mvcr-stick">
        <header className="mvcr-top mv-wrap">
          <div className="mvcr-hl">
            <Eyebrow text={eyebrow} on={on} M={M} />
            <Head
              text={heading}
              on={on}
              D={D}
              size="clamp(40px,4.3vw,64px)"
              lh={0.95}
              delay={120}
              style={{ fontWeight: 760, fontStretch: '115%' }}
            />
          </div>
          <div className="mvcr-btns" style={rise(on, 380, 14)}>
            <Btn
              href={resume}
              label={primary}
              kind="solid"
              target="_blank"
              rel="noopener noreferrer"
            />
            <Btn
              href={secondaryLink || '#contact'}
              label={secondary}
              kind="ghost"
            />
          </div>
        </header>

        <div className="mvcr-gatewrap mv-wrap">
          <div
            ref={gate}
            className="mvcr-gate"
            style={rise(on, 260, 18)}
          >
            <div className="mvcr-view">
              <div ref={roll} className="mvcr-roll">
                <div className="mvcr-open">
                  {openerKicker && (
                    <p className="mvcr-ok" style={M}>
                      {fill(openerKicker)}
                    </p>
                  )}
                  {opener && (
                    <p className="mvcr-ot" style={D}>
                      {fill(opener)}
                    </p>
                  )}
                </div>

                {groups.map((g) => (
                  <div key={g.k} className="mvcr-grp">
                    <h3 className="mvcr-gh" style={M}>
                      <i aria-hidden />
                      {g.title}
                      <i aria-hidden />
                    </h3>
                    <ul className="mvcr-list">
                      {g.items.map((r) => {
                        const i = k++;
                        return (
                          <li
                            key={r.slug || i}
                            className="mvcr-row"
                            style={{
                              '--i': i,
                            }}
                          >
                            <span className="mvcr-hit">
                              <span
                                className="mvcr-sel"
                                aria-hidden
                              >
                                <i />
                                <i />
                                <i />
                                <i />
                              </span>
                              <span
                                className="mvcr-role"
                                style={M}
                              >
                                <span>{r.f1}</span>
                                {r.f3 && <em>{r.f3}</em>}
                              </span>
                              <span
                                className="mvcr-co"
                                style={D}
                              >
                                {r.f2}
                              </span>
                              {r.f4 && (
                                <span className="mvcr-sum">
                                  <span>{r.f4}</span>
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                <div ref={card} className="mvcr-card">
                  <p className="mvcr-ck" style={M}>
                    {closingKicker}
                  </p>
                  <p className="mvcr-cn" style={D}>
                    {name}
                  </p>
                  {closingLine && (
                    <p className="mvcr-cl" style={M}>
                      {fill(closingLine)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mvcr-frame" aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <span className="mvcr-lb mvcr-tl" style={M}>
                <b />
                {fill(cornerTL)}
              </span>
              <span className="mvcr-lb mvcr-tr" style={M}>
                {fill(cornerTR)}
              </span>
              <span className="mvcr-lb mvcr-bl" style={M}>
                {fill(cornerBL)}
              </span>
              <span className="mvcr-lb mvcr-br" style={M}>
                TC{' '}
                <span ref={tc}>
                  {pin ? '00:00:00:00' : endTc}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS_CR = `
.mvcr{background:var(--mv-night);color:var(--mv-cloud);--hair:color-mix(in srgb,var(--mv-cloud) 14%,transparent)}
.mvcr .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px}
.mvcr .mv-eb i{border-radius:1px}
.mvcr .mv-hd{letter-spacing:-.04em;margin-top:18px}
.mvcr .mv-it{color:var(--mv-brass);font-weight:inherit}
/* pinned: the wrapper is tall, the stage sticks for its length */
.mvcr.is-pin{height:calc(var(--len) * 1svh)}
.mvcr-stick{display:flex;flex-direction:column}
.mvcr.is-pin .mvcr-stick{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
.mvcr-top{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;padding-top:clamp(40px,6vh,72px);padding-bottom:clamp(20px,3vh,32px)}
.mvcr-btns{display:flex;gap:12px;flex-wrap:wrap;justify-content:flex-end}
.mvcr-gatewrap{flex:1;min-height:0;display:flex;padding-bottom:clamp(20px,3.4vh,40px)}
.mvcr-gate{position:relative;flex:1;min-height:0;border-radius:18px;background:radial-gradient(60% 55% at 50% 0%,rgba(255,226,180,.07),transparent 70%),color-mix(in srgb,var(--mv-cloud) 2%,transparent)}
.mvcr-view{position:absolute;inset:0;overflow:hidden;border-radius:inherit;-webkit-mask:linear-gradient(180deg,transparent 0,#000 6%,#000 94%,transparent 100%);mask:linear-gradient(180deg,transparent 0,#000 6%,#000 94%,transparent 100%)}
.mvcr-roll{position:relative;width:min(880px,100%);margin:0 auto;padding:0 24px;will-change:transform}
.mvcr.is-pin .mvcr-roll{transform:translate3d(0,calc(var(--r0) + (var(--r1) - var(--r0)) * var(--pp,0)),0)}
/* film gate overlay: hairline frame, four corner marks, reel labels */
.mvcr-frame{position:absolute;inset:0;pointer-events:none;border-radius:inherit;box-shadow:inset 0 0 0 1px var(--hair)}
.mvcr-frame>i{position:absolute;width:26px;height:26px;border:0 solid color-mix(in srgb,var(--mv-cloud) 62%,transparent)}
.mvcr-frame>i:nth-child(1){left:14px;top:14px;border-left-width:1.5px;border-top-width:1.5px;border-top-left-radius:6px}
.mvcr-frame>i:nth-child(2){right:14px;top:14px;border-right-width:1.5px;border-top-width:1.5px;border-top-right-radius:6px}
.mvcr-frame>i:nth-child(3){left:14px;bottom:14px;border-left-width:1.5px;border-bottom-width:1.5px;border-bottom-left-radius:6px}
.mvcr-frame>i:nth-child(4){right:14px;bottom:14px;border-right-width:1.5px;border-bottom-width:1.5px;border-bottom-right-radius:6px}
.mvcr-lb{position:absolute;display:flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvcr-tl{left:52px;top:20px} .mvcr-tr{right:52px;top:20px} .mvcr-bl{left:52px;bottom:20px} .mvcr-br{right:52px;bottom:20px;color:var(--mv-cloud);font-variant-numeric:tabular-nums}
.mvcr-br span{display:inline-block;min-width:11ch;padding:3px 6px;border-radius:4px;background:color-mix(in srgb,var(--mv-cloud) 8%,transparent)}
.mvcr-tl b{width:7px;height:7px;border-radius:50%;background:var(--mv-brass);box-shadow:0 0 10px var(--mv-brass);animation:mvcr-rec 1.6s steps(2) infinite}
@keyframes mvcr-rec{50%{opacity:.25}}
/* the credits */
.mvcr-open{text-align:center;padding:24px 0 40px}
.mvcr-ok{margin:0 0 14px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mv-mut)}
.mvcr-ot{margin:0;font-size:clamp(28px,2.6vw,40px);line-height:1;letter-spacing:-.035em;font-weight:720;font-stretch:115%}
.mvcr-grp{padding:34px 0 10px}
.mvcr-gh{display:flex;align-items:center;justify-content:center;gap:16px;margin:0 0 18px;font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--mv-brass)}
.mvcr-gh i{display:block;width:56px;height:1px;background:color-mix(in srgb,var(--mv-brass) 55%,transparent)}
.mvcr-list{list-style:none;margin:0;padding:0}
.mvcr-row{display:flex;justify-content:center}
.mvcr-hit{position:relative;display:grid;grid-template-columns:1fr 1fr;column-gap:36px;width:100%;padding:12px 20px;border-radius:4px;transition:background-color .25s,color .25s}
.mvcr-hit::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--mv-brass);clip-path:inset(0 100% 0 0);transition:clip-path .45s steps(8)}
.mvcr-role{position:relative;display:flex;flex-direction:column;align-items:flex-end;gap:5px;text-align:right;padding-top:.55em;font-size:12px;letter-spacing:.12em;text-transform:uppercase;line-height:1.35}
.mvcr-role em{font-style:normal;font-size:12px;letter-spacing:.08em;color:var(--mv-mut);font-variant-numeric:tabular-nums;transition:color .25s}
.mvcr-co{position:relative;font-size:clamp(24px,2.3vw,34px);line-height:1.05;letter-spacing:-.03em;font-weight:720;font-stretch:112%;text-wrap:balance}
.mvcr-sum{position:relative;grid-column:1 / -1;display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.2,.8,.2,1)}
.mvcr-sum>span{overflow:hidden;text-align:center;font-size:15px;line-height:1.5;opacity:0;transition:opacity .3s}
.mvcr-sel{position:absolute;inset:-4px;border-radius:7px;box-shadow:0 0 0 1.5px var(--mv-brass);opacity:0;scale:1.03;transition:opacity .2s,scale .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none}
.mvcr-sel i{position:absolute;width:7px;height:7px;background:var(--mv-cloud);box-shadow:0 0 0 1.5px var(--mv-brass);translate:-50% -50%} .mvcr-sel i:nth-child(1){left:0;top:0} .mvcr-sel i:nth-child(2){left:100%;top:0} .mvcr-sel i:nth-child(3){left:0;top:100%} .mvcr-sel i:nth-child(4){left:100%;top:100%}
@media (hover:hover){.mvcr-hit:hover{color:var(--mv-ink)} .mvcr-hit:hover::before{clip-path:inset(0 0 0 0)} .mvcr-hit:hover .mvcr-role em{color:color-mix(in srgb,var(--mv-ink) 78%,transparent)} .mvcr-hit:hover .mvcr-sel{opacity:1;scale:1} .mvcr-hit:hover .mvcr-sum{grid-template-rows:1fr} .mvcr-hit:hover .mvcr-sum>span{opacity:1;padding-top:10px}}
.mvcr-card{text-align:center;padding:64px 0 24px}
.mvcr-ck{margin:0 0 16px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--mv-mut)}
.mvcr-cn{margin:0;font-size:clamp(48px,6vw,92px);line-height:.9;letter-spacing:-.045em;font-weight:800;font-stretch:118%;color:#FFF1DA;text-shadow:0 0 42px rgba(255,226,180,.35)}
.mvcr-cl{margin:18px 0 0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--mv-mut)}
/* flat (phone / reduced motion / canvas): the whole roll in the same typography */
.mvcr.is-flat{padding-bottom:clamp(40px,6vw,80px)}
.mvcr.is-flat .mvcr-gate{flex:none;width:100%}
.mvcr.is-flat .mvcr-view{position:relative;-webkit-mask:none;mask:none;padding:56px 0 64px}
.mvcr.is-tab .mvcr-top{flex-direction:column;align-items:flex-start} .mvcr.is-tab .mvcr-btns{justify-content:flex-start}
.mvcr.is-ph .mvcr-top{flex-direction:column;align-items:stretch;gap:24px;padding-top:56px}
.mvcr.is-ph .mvcr-btns{flex-direction:column;align-items:stretch} .mvcr.is-ph .mvcr-btns .mv-btn{width:100%}
.mvcr.is-ph .mvcr-roll{padding:0 12px}
.mvcr.is-ph .mvcr-hit{grid-template-columns:1fr;row-gap:6px;text-align:center;padding:12px 8px}
.mvcr.is-ph .mvcr-role{align-items:center;text-align:center;padding-top:0}
.mvcr.is-ph .mvcr-co{font-size:26px}
.mvcr.is-ph .mvcr-sum{grid-template-rows:1fr} .mvcr.is-ph .mvcr-sum>span{opacity:.8;padding-top:4px;font-size:15px}
.mvcr.is-ph .mvcr-lb{font-size:12px;letter-spacing:.06em} .mvcr.is-ph .mvcr-tl,.mvcr.is-ph .mvcr-bl{left:44px} .mvcr.is-ph .mvcr-tr,.mvcr.is-ph .mvcr-br{right:44px} .mvcr.is-ph .mvcr-tr,.mvcr.is-ph .mvcr-bl{display:none}
.mvcr.is-ph .mvcr-view{padding:52px 0 56px}
@media (prefers-reduced-motion:reduce){.mvcr-tl b{animation:none}}
`;
