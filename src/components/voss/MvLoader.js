"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  FONTS,
  colorsOf,
  fontsOf,
  siteFontCss,
  cssVars,
  useFonts,
  useLive,
  useStill,
  clamp01,
} from "./scaffold";
import { siteData } from "./siteData";

const MVLD_KEY = "mv-loaded";
const MVLD_CAP = 2600; // ms: hard ceiling from page parse to page uncovered

const mvldTc = (ms) => {
  const f = Math.floor(ms / (1000 / 24));
  const s = Math.floor(f / 24);
  const p = (n) => String(n).padStart(2, "0");
  return `00:00:${p(s % 60)}:${p(f % 24)}`;
};

const listOf = (s) =>
  String(s || "")
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean);

export default function MvLoader(props = {}) {
  const {
    enabled = true,
    slate = "Portfolio 2026 · Scene 01 · Take 1 · {name}",
    rolling = "Rolling",
    numbers = "3;2;1",
    skipLabel = "Click or press any key to skip",
    skipLabelTouch = "Tap to skip",
    duration = 2.2,
    once = true,
    respectRm = true,
  } = props;

  const c = colorsOf(props);
  const { D, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const still = useStill();

  const root = useRef(null);
  const num = useRef(null);
  const tc = useRef(null);
  const [ph, setPh] = useState("shell");
  const [touch, setTouch] = useState(false);

  const T = Math.min(2.4, Math.max(1.4, Number(duration) || 2.2)) * 1000;
  const NUMS = listOf(numbers).slice(0, 5);
  const nums = NUMS.length ? NUMS : ["3", "2", "1"];

  const line = String(slate || "").replace(
    /\{name\}/gi,
    siteData.name || "Sheelash Singh Bhadoriya"
  );

  useEffect(() => {
    if (!live) return;
    const W0 = typeof window !== "undefined" ? window : {};
    W0.__mvldLive = true;
    const html = document.documentElement;
    const tm = [];
    let raf = 0;
    let dead = false;

    const mark = () => {
      if (once) {
        try {
          sessionStorage.setItem(MVLD_KEY, "1");
        } catch (_) {}
      }
    };

    const release = () => html.classList.remove("mv-hold-ld");

    const finish = () => {
      dead = true;
      cancelAnimationFrame(raf);
      mark();
      html.classList.remove("mvld-go", "mv-hold-ld", "mvld-rm");
      setPh("gone");
    };

    if (once) {
      try {
        if (sessionStorage.getItem(MVLD_KEY)) {
          finish();
          return;
        }
      } catch (_) {}
    }

    if (!enabled) {
      finish();
      return;
    }

    // Ensure html classes are added if not already done by script tag
    html.classList.add("mvld-go", "mv-hold-ld");
    if (
      respectRm &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      html.classList.add("mvld-rm");
    }

    if (
      typeof W0.__mvld0 === "number" &&
      performance.now() - W0.__mvld0 > 2100
    ) {
      finish();
      return;
    }

    setTouch(!window.matchMedia("(hover:hover) and (pointer:fine)").matches);
    const T0 =
      typeof W0.__mvld0 === "number" ? W0.__mvld0 : performance.now();
    const now = () => performance.now() - T0;

    let skipped = false;
    const skip = () => {
      skipped = true;
    };
    const key = () => skip();

    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", key);

    const cleanup = () => {
      dead = true;
      tm.forEach((x) => window.clearTimeout(x));
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", key);
    };

    setPh("run");

    // reduced motion: last number still, then short fade
    if (html.classList.contains("mvld-rm")) {
      const el0 = () => root.current;
      const wait = Math.max(0, Math.min(380, MVLD_CAP - 420 - now()));
      const out = () => {
        mark();
        release();
        const el = el0();
        if (el) el.classList.add("is-fade");
        tm.push(window.setTimeout(finish, 400));
      };
      tm.push(window.setTimeout(out, wait));
      const sk = () => {
        tm.forEach((x) => window.clearTimeout(x));
        out();
      };
      document.addEventListener("keydown", sk, { once: true });
      document.addEventListener("pointerdown", sk, { once: true });
      return cleanup;
    }

    // the timeline
    const n = nums.length;
    const C0 = 0.05 * T;
    const C1 = 0.66 * T;
    const SLOT = (C1 - C0) / n;
    const ARM = 0.58 * T;
    const CLAP = 0.72 * T;
    const EXIT = Math.min(520, 0.24 * T);
    let tExit = Math.min(Math.max(T - EXIT, now() + 180), MVLD_CAP - EXIT);
    let exiting = false;
    let lastN = "";
    let lastTc = "";

    const frame = () => {
      if (dead) return;
      const el = root.current;
      if (!el) {
        raf = requestAnimationFrame(frame);
        return;
      }
      let t = now();
      if (skipped && !exiting) {
        tExit = Math.min(tExit, t);
        el.classList.add("is-skip");
      }
      if (!exiting && t >= tExit) {
        exiting = true;
        release();
        el.classList.add("is-exit");
      }

      // countdown
      const ct = Math.min(t, C1 - 1);
      const k = Math.max(0, Math.min(n - 1, Math.floor((ct - C0) / SLOT)));
      const u = clamp01((ct - C0 - k * SLOT) / SLOT);
      const lbl = nums[k];
      if (lbl !== lastN && num.current) {
        lastN = lbl;
        num.current.textContent = lbl;
      }
      el.style.setProperty(
        "--a",
        `${(t < C0 ? 0 : t >= C1 ? 360 : u * 360).toFixed(1)}deg`
      );

      // clapper arm
      const armIn = clamp01((t - ARM) / (0.1 * T));
      const shut = t >= CLAP ? 1 : 0;
      el.style.setProperty(
        "--arm",
        (1 - Math.pow(1 - armIn, 3)).toFixed(3)
      );
      el.style.setProperty("--shut", String(shut));
      const fl = t >= CLAP ? Math.max(0, 1 - (t - CLAP) / 200) : 0;
      el.style.setProperty("--flash", (fl * fl * 0.9).toFixed(3));

      // film running: sprockets + flicker
      el.style.setProperty("--run", `${((t * 0.9) % 96).toFixed(1)}px`);
      el.style.setProperty(
        "--flk",
        (0.94 + Math.random() * 0.06).toFixed(3)
      );
      const tcs = mvldTc(Math.max(0, t));
      if (tcs !== lastTc && tc.current) {
        lastTc = tcs;
        tc.current.textContent = tcs;
      }

      // exit: leader runs out
      if (exiting) {
        const e = clamp01((t - tExit) / EXIT);
        const ee = e * e * (3 - 2 * e);
        el.style.setProperty("--out", ee.toFixed(4));
        if (e >= 1) {
          finish();
          return;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return cleanup;
  }, [live, enabled, once, respectRm]);

  if (still || !enabled || ph === "gone") return null;

  const boot = `(function(){try{var h=document.documentElement,w=window;${once ? `if(sessionStorage.getItem('${MVLD_KEY}'))return;` : ""}w.__mvld0=performance.now();h.classList.add('mvld-go','mv-hold-ld');${respectRm ? "if(matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('mvld-rm');" : ""}setTimeout(function(){if(!w.__mvldLive)h.classList.remove('mvld-go','mv-hold-ld','mvld-rm')},${MVLD_CAP})}catch(e){}})()`;

  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
  const sprockets = Array.from({ length: 16 }, (_, i) => i);

  const overlay = (
    <div
      ref={root}
      className={`mvld is-${ph}${live && !(typeof window !== "undefined" && typeof window.__mvld0 === "number" && performance.now() - window.__mvld0 > 2100) ? " is-js" : ""}`}
      aria-hidden
      style={{ ...cssVars(c), ...(props.style || {}) }}
    >
      <div className="mvld-sheet">
        <div className="mvld-film">
          <span className="mvld-sp mvld-sp-l">
            {sprockets.map((i) => (
              <i key={i} />
            ))}
          </span>
          <span className="mvld-sp mvld-sp-r">
            {sprockets.map((i) => (
              <i key={i} />
            ))}
          </span>
          <i className="mvld-hx" />
          <i className="mvld-vx" />
          <div className="mvld-lead">
            <span className="mvld-wedge" />
            <svg className="mvld-rings" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="196" className="mvld-r1" />
              <circle cx="200" cy="200" r="160" className="mvld-r2" />
              {ticks.map((a) => (
                <line
                  key={a}
                  x1="200"
                  y1="4"
                  x2="200"
                  y2={a % 90 ? "16" : "28"}
                  transform={`rotate(${a} 200 200)`}
                />
              ))}
            </svg>
            <span className="mvld-hand" />
            <span ref={num} className="mvld-n" style={D}>
              {nums[0]}
            </span>
            <span className="mvld-arm">
              <span className="mvld-arm-b" />
            </span>
          </div>
          <div className="mvld-top" style={M}>
            <span className="mvld-slate">{line}</span>
            <span className="mvld-rec">
              <i />
              {rolling}
            </span>
          </div>
          <div className="mvld-bot" style={M}>
            <span className="mvld-sk">
              {touch ? skipLabelTouch : skipLabel}
            </span>
            <span ref={tc} className="mvld-tc">
              00:00:00:00
            </span>
          </div>
          <i className="mvld-scr mvld-scr1" />
          <i className="mvld-scr mvld-scr2" />
        </div>
        <i className="mvld-tail" />
      </div>
      <i className="mvld-flash" />
    </div>
  );

  const portal = live && typeof document !== "undefined";

  return (
    <div
      className="mvld-anchor"
      style={{
        width: "100%",
        height: 0,
        position: "relative",
        ...(props.style || {}),
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_MVLD + siteFontCss(props),
        }}
      />
      <script dangerouslySetInnerHTML={{ __html: boot }} />
      {portal ? createPortal(overlay, document.body) : overlay}
    </div>
  );
}

const CSS_MVLD = `
.mvld{display:none}html.mvld-go{overflow:hidden!important}html.mvld-go .mvld{display:block}
/* failsafe: without the script taking over, the leader fades by itself before the ceiling */
html.mvld-go .mvld:not(.is-js){animation:mvld-fb .3s ease 2.2s both}@keyframes mvld-fb{to{opacity:0;visibility:hidden}}
.mvld{position:fixed;inset:0;z-index:9999;overflow:hidden;cursor:pointer;color:var(--mv-cloud);-webkit-tap-highlight-color:transparent;--a:0deg;--arm:0;--shut:0;--flash:0;--out:0;--run:0px;--flk:1;--warm:#FFF1DA}
.mvld *{box-sizing:border-box}
.mvld-sheet{position:absolute;inset:0;translate:0 calc(var(--out)*-104%);will-change:translate}
.mvld-film{position:absolute;inset:0;overflow:hidden;background:var(--mv-night);opacity:var(--flk)}
.mvld-film::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 55% at 50% 48%,color-mix(in srgb,var(--mv-cloud) 7%,transparent),transparent 70%),radial-gradient(ellipse 120% 100% at 50% 50%,transparent 55%,rgba(0,0,0,.45))}
/* the tail of the leader: a warm light leak on the edge that runs out of the gate */
.mvld-tail{position:absolute;left:0;right:0;top:100%;height:90px;background:linear-gradient(180deg,var(--mv-night),color-mix(in srgb,var(--mv-night) 60%,transparent) 30%,rgba(255,226,180,.35) 62%,transparent);opacity:min(1,calc(var(--out)*6))}
/* sprocket edges running past */
.mvld-sp{position:absolute;top:-96px;bottom:-96px;width:clamp(18px,2.2vw,30px);display:flex;flex-direction:column;justify-content:space-between;padding:0 clamp(6px,.7vw,10px);translate:0 var(--run);border-color:color-mix(in srgb,var(--mv-cloud) 10%,transparent)}
.mvld-sp-l{left:0;border-right:1px solid color-mix(in srgb,var(--mv-cloud) 10%,transparent)} .mvld-sp-r{right:0;border-left:1px solid color-mix(in srgb,var(--mv-cloud) 10%,transparent)}
.mvld-sp i{display:block;height:34px;border-radius:3px;background:color-mix(in srgb,var(--mv-cloud) 11%,transparent)}
/* crosshair */
.mvld-hx,.mvld-vx{position:absolute;background:color-mix(in srgb,var(--mv-cloud) 16%,transparent)} .mvld-hx{left:0;right:0;top:50%;height:1px} .mvld-vx{top:0;bottom:0;left:50%;width:1px}
/* the leader dial */
.mvld-lead{position:absolute;left:50%;top:53%;width:min(56vmin,500px);aspect-ratio:1;translate:-50% -50%}
.mvld-wedge{position:absolute;inset:2%;border-radius:50%;background:conic-gradient(from 0deg,color-mix(in srgb,var(--warm) 16%,transparent) 0deg,color-mix(in srgb,var(--warm) 26%,transparent) var(--a),transparent var(--a))}
.mvld-rings{position:absolute;inset:0;width:100%;height:100%;overflow:visible} .mvld-rings circle{fill:none;stroke:color-mix(in srgb,var(--mv-cloud) 72%,transparent);stroke-width:1.5} .mvld-rings .mvld-r2{stroke:color-mix(in srgb,var(--mv-cloud) 38%,transparent);stroke-width:1} .mvld-rings line{stroke:color-mix(in srgb,var(--mv-cloud) 55%,transparent);stroke-width:1.5}
.mvld-hand{position:absolute;left:50%;top:2%;bottom:50%;width:2px;margin-left:-1px;background:linear-gradient(180deg,var(--warm),color-mix(in srgb,var(--warm) 30%,transparent));transform-origin:50% 100%;rotate:var(--a);box-shadow:0 0 14px rgba(255,226,180,.55)}
.mvld-n{position:absolute;inset:0;display:grid;place-items:center;font-size:min(31vmin,280px);line-height:1;letter-spacing:-.05em;font-stretch:112%;font-weight:var(--mv-font-dw,700);color:var(--mv-cloud);font-variant-numeric:tabular-nums;padding-bottom:.04em}
/* the clapper arm: drops in on the last number and snaps shut */
.mvld-arm{position:absolute;left:9%;right:9%;top:-17%;height:11%;opacity:var(--arm);translate:0 calc((1 - var(--arm))*-40px)}
.mvld-arm-b{position:absolute;inset:0;border-radius:4px;background:repeating-linear-gradient(-58deg,var(--mv-cloud) 0 26px,var(--mv-night) 26px 52px);box-shadow:inset 0 0 0 2px var(--mv-cloud),0 12px 30px -10px rgba(0,0,0,.6);transform-origin:3% 100%;rotate:calc((1 - var(--shut))*-17deg);transition:rotate .09s cubic-bezier(.6,0,1,1)}
.mvld-arm::after{content:"";position:absolute;left:0;right:0;top:100%;height:10px;margin-top:4px;border-radius:3px;background:repeating-linear-gradient(-58deg,var(--mv-night) 0 26px,var(--mv-cloud) 26px 52px);box-shadow:inset 0 0 0 2px var(--mv-cloud)}
/* frame rows */
.mvld-top,.mvld-bot{position:absolute;left:0;right:0;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:0 calc(clamp(18px,2.2vw,30px) + clamp(16px,2.4vw,40px));font-size:12px;letter-spacing:.14em;text-transform:uppercase;line-height:1.4}
.mvld-top{top:clamp(20px,3vw,34px)} .mvld-bot{bottom:clamp(20px,3vw,34px)}
.mvld-slate{padding:6px 10px;border-radius:4px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 30%,transparent);color:var(--mv-cloud)}
.mvld-rec{display:inline-flex;align-items:center;gap:9px;flex:none;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)} .mvld-rec i{width:8px;height:8px;border-radius:50%;background:#FF4D3D;box-shadow:0 0 10px #FF4D3D;animation:mvld-blink 1s steps(2,end) infinite} @keyframes mvld-blink{50%{opacity:.25}}
.mvld-sk{color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)} .mvld-tc{flex:none;color:var(--mv-cloud);font-variant-numeric:tabular-nums}
/* scratches */
.mvld-scr{position:absolute;top:0;bottom:0;width:1px;background:color-mix(in srgb,var(--mv-cloud) 22%,transparent);opacity:.7} .mvld-scr1{left:31%;animation:mvld-scr .9s steps(3,end) infinite} .mvld-scr2{left:74%;height:40%;top:30%;animation:mvld-scr 1.3s steps(4,end) infinite reverse}
@keyframes mvld-scr{0%{translate:0 0;opacity:.6}33%{translate:9vw 0;opacity:0}66%{translate:-6vw 0;opacity:.5}100%{translate:3vw 0;opacity:.2}}
.mvld-flash{position:absolute;inset:0;background:var(--mv-cloud);opacity:var(--flash);pointer-events:none}
.mvld.is-exit{pointer-events:none;cursor:default}
.mvld.is-exit .mvld-top,.mvld.is-exit .mvld-bot{opacity:0;transition:opacity .2s}
.mvld.is-skip .mvld-arm-b{rotate:0deg}
/* reduced motion: the "1" frame, still, then a fade */
html.mvld-rm .mvld *{animation:none!important;transition:none!important} html.mvld-rm .mvld{--a:360deg;--arm:1;--shut:1}
.mvld.is-fade{opacity:0;transition:opacity .38s ease}
@media (max-width:809px){.mvld-lead{width:min(74vw,420px)} .mvld-n{font-size:min(40vw,230px)} .mvld-top,.mvld-bot{flex-direction:column;align-items:flex-start;gap:10px;font-size:12px;letter-spacing:.1em} .mvld-bot{flex-direction:column-reverse} .mvld-slate{max-width:100%}}
`;
