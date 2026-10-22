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
  clamp01,
  rise,
  Eyebrow,
  Head,
  onTick,
  listOf,
  useSite,
  CSS_BASE,
  CSS_MOTION,
} from './scaffold';

// ---- THE CALL SHEET: the process as a film production call sheet — a paper document lying slightly askew on the deep ground, typewriter mono.
// A warm studio spotlight travels down the sheet row by row with scroll; the lit row is ticked off in the margin (pencil tick draws itself) and its
// time column flips like a split-flap board; unlit rows sit at 45 %. Desktop: an "on set" status panel follows the same progress. Hover a row: it
// straightens and lifts off the sheet. Phone: sheet full width, no rotation. ----

const SCRUB_K = 0.18;

const prSteps = (s) =>
  listOf(s)
    .map((x) => {
      const [a, b, c2] = x.split('|').map((y) => (y || '').trim());
      return { name: a || '', when: b || '', what: c2 || '' };
    })
    .filter((x) => x.name);

const prPad = (n) => String(n).padStart(2, '0');

export default function MvProcess(props = {}) {
  const site = useSite();

  const {
    eyebrow = 'FRAME 04 — How I work',
    title = 'One project,|*four* days that matter.',
    sheetTitle = 'Call sheet',
    sheetSub = 'New project',
    sheetNo = 'No. 026',
    fields = `Director|{name};Location|${site.city || 'Indore'} + remote;Crew call|Mondays, 09:00`,
    colScene = 'Scene',
    colWhen = 'When',
    colWhat = 'What happens',
    steps = 'Brief|Day 1|We talk goals, telemetry, users and constraints. You get a one-page execution plan.;Explore|Week 1–2|Flows, interactive prototypes and a clickable architectural direction you can test.;Build|Week 3–6|Production UI, design system components and high-performance frontend code, reviewed weekly.;Ship|Week 7|Launch, handover docs, QA verification and dedicated post-release warranty.',
    note = 'Call times move. The Friday review does not.',
    signed = 'S. Bhadoriya',
    statusLabel = 'On set',
    sceneWord = 'Scene',
    nextWord = 'Next',
    doneText = "That's a wrap",
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();

  const root = useRef(null);
  const sheet = useRef(null);
  const body = useRef(null);
  const panel = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm);
  useMagnet(root, live);

  const S = prSteps(steps);
  const n = S.length;
  const fixed = still || rm || !live;
  const [act, setAct] = useState(fixed ? Math.max(0, n - 1) : 0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (
      !live ||
      rm ||
      !root.current ||
      !sheet.current ||
      !body.current ||
      n === 0
    )
      return;

    const el = root.current,
      sh = sheet.current,
      bd = body.current;
    let vis = true;

    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: '20% 0px 20% 0px' }
    );
    io.observe(el);

    let top = 0,
      hgt = 1,
      vh = 1,
      cs = [],
      fresh = false,
      q = -1,
      last = -1,
      la = -1,
      ld = false;

    // row centres in sheet space (offsetTop ignores the sheet's rotation), measured on resize only
    const measure = () => {
      const rs = Array.from(bd.querySelectorAll('.mvpr-row'));
      cs = rs.map((r) => r.offsetTop + r.offsetHeight / 2);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(sh);

    const read = () => {
      if (!vis) {
        fresh = false;
        return;
      }
      const r = bd.getBoundingClientRect();
      top = r.top;
      hgt = r.height;
      vh = window.innerHeight || 1;
      fresh = true;
    };

    const off = onTick(() => {
      if (!fresh || !cs.length) return;
      const t = clamp01((vh * 0.74 - top) / Math.max(1, hgt + vh * 0.36));
      if (q < 0) q = t;
      else {
        q += (t - q) * SCRUB_K;
        if (Math.abs(t - q) < 0.0005) q = t;
      }
      if (Math.abs(q - last) < 0.0004) return;
      last = q;

      const p = q * (cs.length - 1);
      const i = Math.min(cs.length - 2, Math.floor(p));
      const y =
        cs.length > 1 ? cs[i] + (cs[i + 1] - cs[i]) * (p - i) : cs[0];
      sh.style.setProperty('--ly', `${y.toFixed(1)}px`);
      el.style.setProperty('--q', q.toFixed(4));

      const a = Math.round(p);
      if (a !== la) {
        la = a;
        setAct(a);
      }
      const d = q > 0.985;
      if (d !== ld) {
        ld = d;
        setDone(d);
      }
    }, read);

    return () => {
      off();
      io.disconnect();
      ro.disconnect();
    };
  }, [live, rm, n]);

  const cur = fixed ? Math.max(0, n - 1) : act;
  const F = listOf(fields)
    .map((x) => {
      const [k, v] = x.split('|');
      return {
        k: (k || '').trim(),
        v: (v || '').trim().replace('{name}', site.name),
      };
    })
    .filter((x) => x.k);

  const st = S[cur];
  const nx = S[cur + 1];

  return (
    <section
      ref={root}
      id="process"
      className={`mv mv-sec mv-dark mvpr${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-in' : ''}${fixed ? ' is-fixed' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        ...(fixed ? { ['--q']: 1 } : {}),
        ...(props.style || {}),
      }}
      aria-labelledby="mvpr-h"
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_PR + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvpr-top">
          <Eyebrow text={eyebrow} on={on} M={M} />
          <div id="mvpr-h">
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
        </header>

        <div className="mvpr-grid">
          <div className="mvpr-desk" style={rise(on, 300, 40)}>
            <div ref={sheet} className="mvpr-sheet" style={M}>
              <i className="mvpr-holes" aria-hidden>
                <b />
                <b />
                <b />
              </i>
              <div className="mvpr-head">
                <div>
                  <p className="mvpr-ttl" style={D}>
                    {sheetTitle}
                  </p>
                  <p className="mvpr-sub">{sheetSub}</p>
                </div>
                <p className="mvpr-no">{sheetNo}</p>
              </div>

              {F.length > 0 && (
                <dl className="mvpr-fields">
                  {F.map((f, i) => (
                    <div key={i}>
                      <dt>{f.k}</dt>
                      <dd>{f.v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mvpr-cols" aria-hidden>
                <span />
                <span>{colScene}</span>
                <span>{colWhen}</span>
                <span>{colWhat}</span>
              </div>

              <ol ref={body} className="mvpr-rows">
                {S.map((s, i) => (
                  <li
                    key={i}
                    className={`mvpr-row${i === cur ? ' is-lit' : ''}${i <= cur ? ' is-done' : ''}`}
                  >
                    <svg
                      className="mvpr-tick"
                      viewBox="0 0 32 28"
                      aria-hidden
                    >
                      <path
                        pathLength={1}
                        d="M3 15.5c2.6 1.7 5.2 4.6 7.6 8.6C14.4 14.8 20.6 7.6 29 3.2"
                      />
                    </svg>
                    <span className="mvpr-n">{prPad(i + 1)}</span>
                    <h3 className="mvpr-name" style={D}>
                      {s.name}
                    </h3>
                    <span
                      className="mvpr-when"
                      aria-label={s.when}
                    >
                      {Array.from(s.when).map((ch, k) =>
                        ch === ' ' ? (
                          <i
                            key={k}
                            className="mvpr-sp"
                            aria-hidden
                          />
                        ) : (
                          <b
                            key={k}
                            aria-hidden
                            style={{
                              animationDelay: `${k * 45}ms`,
                            }}
                          >
                            {ch}
                          </b>
                        )
                      )}
                    </span>
                    <p className="mvpr-what" style={B}>
                      {s.what}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mvpr-foot">
                <p>{note}</p>
                {signed && (
                  <p className="mvpr-sig" style={D}>
                    {signed}
                  </p>
                )}
              </div>
              <i className="mvpr-lamp" aria-hidden />
            </div>
          </div>

          {!phone && !tab && n > 0 && (
            <aside
              ref={panel}
              className="mvpr-panel"
              style={{ ...M, ...rise(on, 520, 24) }}
              aria-label={statusLabel}
            >
              <p className="mvpr-pl">
                <i
                  className={`mvpr-rec${done ? ' is-off' : ''}`}
                  aria-hidden
                />
                {statusLabel}
                <span>
                  {prPad(cur + 1)} / {prPad(n)}
                </span>
              </p>
              <p className="mvpr-ps" style={D}>
                {sceneWord} {cur + 1}/{n} · {st ? st.name : ''}
              </p>
              <p className="mvpr-pw">{st ? st.when : ''}</p>
              <div className="mvpr-bar" aria-hidden>
                <i />
                {S.map((_, i) => (
                  <b
                    key={i}
                    style={{
                      left: `${n > 1 ? (i / (n - 1)) * 100 : 0}%`,
                    }}
                    className={i <= cur ? 'is-on' : ''}
                  />
                ))}
              </div>
              <p className="mvpr-nx">
                {nx ? (
                  <>
                    {nextWord}: {nx.name} · {nx.when}
                  </>
                ) : (
                  doneText
                )}
              </p>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

const CSS_PR = `
.mvpr{background:var(--mv-pine);color:var(--mv-cloud);padding:clamp(96px,10vw,160px) 0;overflow:clip;--q:0}
.mvpr .mv-hd{font-stretch:115%} .mvpr .mv-it{font-weight:inherit;color:var(--mv-brass)}
.mvpr-top{display:grid;gap:22px;max-width:900px;margin-bottom:clamp(52px,6vw,90px)}
.mvpr-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:clamp(40px,5vw,90px);align-items:start}
.mvpr-desk{position:relative;padding:0 10px}
/* the paper */
.mvpr-sheet{--ly:-400px;position:relative;overflow:hidden;rotate:-1.5deg;padding:clamp(34px,3.4vw,52px) clamp(34px,3.6vw,56px) 36px clamp(58px,5.4vw,84px);border-radius:3px;color:var(--mv-ink);
  background:linear-gradient(172deg,color-mix(in srgb,var(--mv-bone) 70%,#fff) 0%,var(--mv-bone) 55%,color-mix(in srgb,var(--mv-bone) 94%,var(--mv-stone)) 100%);
  box-shadow:0 1px 0 rgba(255,255,255,.4) inset,0 40px 80px -20px rgba(0,0,0,.55),0 12px 24px rgba(0,0,0,.25)}
.mvpr-holes{position:absolute;left:clamp(18px,2vw,28px);top:0;bottom:0;display:flex;flex-direction:column;justify-content:space-around;padding:60px 0} .mvpr-holes b{display:block;width:14px;height:14px;border-radius:50%;background:var(--mv-pine);box-shadow:inset 0 2px 3px rgba(0,0,0,.5)}
.mvpr-head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding-bottom:20px;border-bottom:2px solid var(--mv-ink)}
.mvpr-ttl{margin:0;font-size:clamp(30px,2.8vw,42px);line-height:.95;letter-spacing:-.04em;font-stretch:118%;font-weight:800;text-transform:none}
.mvpr-sub{margin:8px 0 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.mvpr-no{margin:0;padding:6px 10px;border:1.5px solid var(--mv-ink);border-radius:4px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;rotate:3deg}
.mvpr-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:0;border-bottom:1px solid color-mix(in srgb,var(--mv-ink) 30%,transparent)} .mvpr-fields div{padding:14px 12px 14px 0} .mvpr-fields div+div{padding-left:14px;border-left:1px solid color-mix(in srgb,var(--mv-ink) 20%,transparent)}
.mvpr-fields dt{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-ink) 78%,transparent)} .mvpr-fields dd{margin:4px 0 0;font-size:14px}
.mvpr-cols,.mvpr-row{display:grid;grid-template-columns:34px 40px minmax(120px,.9fr) 150px minmax(0,1.6fr);column-gap:14px;align-items:baseline}
.mvpr-cols{padding:18px 0 10px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-ink) 78%,transparent);border-bottom:1px solid color-mix(in srgb,var(--mv-ink) 30%,transparent)} .mvpr-cols span:first-child{grid-column:1 / 3}
.mvpr-rows{list-style:none;margin:0;padding:0}
.mvpr-row{position:relative;z-index:1;padding:24px 10px 24px 0;margin:0 -10px 0 0;border-bottom:1px dashed color-mix(in srgb,var(--mv-ink) 26%,transparent);border-radius:3px;transition:rotate .5s cubic-bezier(.2,.8,.2,1),translate .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s,background .5s}
.mvpr-row>:not(.mvpr-tick){transition:opacity .5s}
.mvpr:not(.is-fixed) .mvpr-row:not(.is-lit)>:not(.mvpr-tick){opacity:.8}
.mvpr-row:hover{rotate:1.5deg;translate:0 -5px;z-index:3;background:var(--mv-bone);box-shadow:0 16px 34px -14px rgba(0,0,0,.4),0 0 0 1px color-mix(in srgb,var(--mv-ink) 10%,transparent)} .mvpr-row:hover>*{opacity:1!important}
.mvpr-tick{grid-column:1;width:30px;height:26px;align-self:center;overflow:visible} .mvpr-tick path{fill:none;stroke:var(--mv-ink);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .6s cubic-bezier(.6,0,.3,1) .15s}
.mvpr-row.is-done .mvpr-tick path,.mvpr.is-fixed .mvpr-tick path{stroke-dashoffset:0}
.mvpr-n{font-size:12px;letter-spacing:.1em}
.mvpr-name{margin:0;font-size:clamp(24px,2.1vw,30px);line-height:1;letter-spacing:-.035em;font-stretch:115%;font-weight:760}
/* split-flap time */
.mvpr-when{display:flex;flex-wrap:wrap;gap:1px;font-size:13px;text-transform:uppercase;line-height:1;perspective:300px}
.mvpr-when b{position:relative;display:inline-grid;place-items:center;min-width:16px;height:26px;padding:0 2px;border-radius:2px;font-weight:500;background:color-mix(in srgb,var(--mv-ink) 7%,transparent);transform-origin:50% 50%}
.mvpr-when b::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:color-mix(in srgb,var(--mv-ink) 10%,transparent)} .mvpr-row.is-lit .mvpr-when b::after,.mvpr.is-fixed .mvpr-when b::after{background:color-mix(in srgb,var(--mv-bone) 22%,var(--mv-ink))}
.mvpr-when .mvpr-sp{width:5px}
.mvpr-row.is-lit .mvpr-when b,.mvpr.is-fixed .mvpr-when b{background:var(--mv-ink);color:var(--mv-bone)}
.mvpr:not(.is-fixed) .mvpr-row.is-lit .mvpr-when b{animation:mvpr-flap .46s cubic-bezier(.3,.7,.3,1.3) both}
@keyframes mvpr-flap{0%{transform:rotateX(-90deg)}45%{transform:rotateX(18deg)}70%{transform:rotateX(-8deg)}100%{transform:rotateX(0)}}
.mvpr-what{margin:0;font-size:15.5px;line-height:1.5}
.mvpr-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-top:24px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-ink) 78%,transparent)} .mvpr-foot p{margin:0}
.mvpr-sig{font-size:26px;letter-spacing:-.03em;text-transform:none;color:var(--mv-ink);font-stretch:125%;font-weight:300;rotate:-4deg;border-bottom:1.5px solid var(--mv-ink);padding:0 10px 2px}
/* the spotlight: warm pool on the lit row, the rest of the sheet falls into shade */
.mvpr-lamp{position:absolute;inset:0;z-index:2;pointer-events:none;mix-blend-mode:multiply;opacity:min(1,calc(var(--q)*40));
  background:radial-gradient(75% 170px at 46% var(--ly),rgba(255,226,180,.62) 0%,rgba(255,236,210,.3) 42%,color-mix(in srgb,var(--mv-pine) 13%,#fff) 100%)}
.mvpr.is-fixed .mvpr-lamp{display:none}
/* on-set panel */
.mvpr-panel{position:sticky;top:max(90px,30vh);padding:22px;border-radius:10px;background:color-mix(in srgb,var(--mv-night) 70%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 14%,transparent)}
.mvpr-pl{display:flex;align-items:center;gap:9px;margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase} .mvpr-pl span{margin-left:auto;color:var(--mv-mut)}
.mvpr-rec{width:9px;height:9px;border-radius:50%;background:#FF4D3D;box-shadow:0 0 12px 2px rgba(255,77,61,.6);animation:mvpr-rec 1.4s steps(2) infinite} .mvpr-rec.is-off{background:var(--mv-stone);box-shadow:none;animation:none} @keyframes mvpr-rec{50%{opacity:.25}}
.mvpr-ps{margin:22px 0 0;font-size:26px;line-height:1.05;letter-spacing:-.035em;font-stretch:112%;font-weight:700}
.mvpr-pw{margin:8px 0 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#FFF1DA}
.mvpr-bar{position:relative;height:2px;margin:26px 6px 0;background:color-mix(in srgb,var(--mv-cloud) 16%,transparent)} .mvpr-bar i{position:absolute;inset:0;background:var(--mv-brass);transform-origin:0 50%;scale:var(--q) 1}
.mvpr-bar b{position:absolute;top:50%;width:10px;height:10px;translate:-50% -50%;border-radius:2px;background:var(--mv-pine);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--mv-cloud) 40%,transparent);transition:background .3s,box-shadow .3s} .mvpr-bar b.is-on{background:var(--mv-brass);box-shadow:none}
.mvpr-nx{margin:22px 0 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut)}
/* tablet: sheet full width */
.mvpr.is-tab .mvpr-grid{grid-template-columns:minmax(0,1fr)} .mvpr.is-tab .mvpr-cols,.mvpr.is-tab .mvpr-row{grid-template-columns:30px 34px minmax(110px,.8fr) 130px minmax(0,1.4fr)}
/* phone: full width, no rotation, stacked rows */
.mvpr.is-ph .mvpr-grid{grid-template-columns:minmax(0,1fr)} .mvpr.is-ph .mvpr-desk{padding:0;margin:0 -8px}
.mvpr.is-ph .mvpr-sheet{rotate:0deg;padding:26px 18px 24px 40px} .mvpr.is-ph .mvpr-holes{left:13px} .mvpr.is-ph .mvpr-holes b{width:11px;height:11px}
.mvpr.is-ph .mvpr-fields{grid-template-columns:minmax(0,1fr)} .mvpr.is-ph .mvpr-fields div,.mvpr.is-ph .mvpr-fields div+div{padding:10px 0;border-left:0;border-bottom:1px dashed color-mix(in srgb,var(--mv-ink) 16%,transparent)}
.mvpr.is-ph .mvpr-cols{display:none}
.mvpr.is-ph .mvpr-row{grid-template-columns:28px minmax(0,1fr) auto;row-gap:10px;padding:20px 0;margin:0} .mvpr.is-ph .mvpr-tick{grid-row:1 / 3;align-self:start;width:24px}
.mvpr.is-ph .mvpr-n{display:none} .mvpr.is-ph .mvpr-name{grid-column:2;font-size:24px} .mvpr.is-ph .mvpr-when{grid-column:2 / 4;grid-row:2} .mvpr.is-ph .mvpr-what{grid-column:2 / 4;grid-row:3;font-size:15px} .mvpr.is-ph .mvpr-name{grid-column:2 / 4}
.mvpr.is-ph .mvpr-foot{flex-direction:column;align-items:flex-start} .mvpr.is-ph .mvpr-row:hover{rotate:0deg;translate:none}
.mvpr.is-ph .mvpr-ttl{font-size:30px} .mvpr.is-ph .mvpr-head{flex-wrap:wrap}
`;
