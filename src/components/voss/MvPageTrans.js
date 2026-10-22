"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import {
  FONTS,
  colorsOf,
  fontsOf,
  siteFontCss,
  cssVars,
  useFonts,
  useLive,
  useStill,
} from "./scaffold";

const MVTR_FRAME = "mv-frame";
const MVTR_OPEN = 380; // ms the blades take to open on arrival

let activeTransInstanceId = null;

export default function MvPageTrans(props = {}) {
  const {
    enabled = true,
    tone = "night",
    frameLabel = "Frame",
    kicker = "Cut to",
    homeLabel = "Home",
    speed = 0.28,
    respectRm = true,
  } = props;

  const instanceId = useId();
  const [isPrimary, setIsPrimary] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const c = colorsOf(props);
  const { D, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const still = useStill();

  const [name, setName] = useState("");
  const [fr, setFr] = useState([1, 2]);
  const [mode, setMode] = useState("idle");
  const [gen, setGen] = useState(0);

  const S = useRef({
    mode: "idle",
    t: 0,
    href: "",
    busy: false,
    bypass: false,
  });

  const tm = useRef([]);
  const Dm = Math.max(0.18, Math.min(0.36, Number(speed) || 0.28)) * 1000;

  // Primary singleton election: ensure only one active transition overlay & listener runs
  useEffect(() => {
    if (!activeTransInstanceId) {
      activeTransInstanceId = instanceId;
      setIsPrimary(true);
    } else if (activeTransInstanceId === instanceId) {
      setIsPrimary(true);
    }
    return () => {
      if (activeTransInstanceId === instanceId) {
        activeTransInstanceId = null;
      }
    };
  }, [instanceId]);

  // Clean hold classes on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("mv-hold-pt", "mvtr-arrive");
    }
  }, []);

  useEffect(() => {
    if (!live || !enabled || !isPrimary) return;
    const html = document.documentElement;

    const clearTm = () => {
      tm.current.forEach((x) => window.clearTimeout(x));
      tm.current = [];
    };

    const set = (m) => {
      S.current.mode = m;
      S.current.t = performance.now();
      setMode(m);
      if (m === "arrive") setGen((g) => g + 1);
    };

    const clearHold = () => {
      html.classList.remove("mv-hold-pt", "mvtr-arrive");
    };

    const at = (y) => {
      html.style.setProperty(
        "--mvtr-y",
        `${Math.round(Math.max(0, Math.min(window.innerHeight, y)))}px`
      );
    };

    const arrive = () => {
      clearHold();
      set("arrive");
      S.current.busy = false;

      const t1 = window.setTimeout(() => {
        if (S.current.mode === "arrive") {
          set("idle");
          clearHold();
        }
      }, MVTR_OPEN + 40);
      tm.current.push(t1);
    };

    const frameNo = () => {
      try {
        return Math.max(
          1,
          parseInt(sessionStorage.getItem(MVTR_FRAME) || "1", 10) || 1
        );
      } catch (_) {
        return 1;
      }
    };

    const rm =
      respectRm &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    S.current.href = location.href;
    clearHold();
    set("idle");

    const titleOf = (u, a) => {
      const segs = u.pathname.split("/").filter(Boolean);
      if (!segs.length) return homeLabel;
      const txt = String(
        a.getAttribute("aria-label") ||
          String(a.innerText || "")
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean)[0] ||
          ""
      )
        .replace(/[↗→↑]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (
        txt &&
        txt.length <= 28 &&
        !/^(read|learn more|open|more|view|see|details|all)\b/i.test(txt) &&
        !/\d{2}:\d{2}/.test(txt)
      )
        return txt;
      return decodeURIComponent(segs[segs.length - 1])
        .replace(/\.html?$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
    };

    const click = (e) => {
      if (
        S.current.bypass ||
        rm ||
        S.current.busy ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const a = e.target?.closest?.("a[href]");
      if (
        !a ||
        (a.target && a.target !== "_self") ||
        a.hasAttribute("download") ||
        a.closest("[data-no-trans]")
      )
        return;

      const raw = a.getAttribute("href") || "";
      if (
        !raw ||
        /^(mailto|tel|sms|javascript):/i.test(raw) ||
        raw.startsWith("#")
      )
        return;

      let u;
      try {
        u = new URL(a.href, location.href);
      } catch (_) {
        return;
      }

      if (u.origin !== location.origin) return;
      if (/\.(pdf|zip|png|jpe?g|svg|webp|gif|mp4|webm|json)$/i.test(u.pathname)) return;

      // Same page or on-page anchor
      if (u.pathname === location.pathname && u.search === location.search) {
        if (u.hash) {
          e.preventDefault();
          const target = document.querySelector(u.hash);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      S.current.busy = true;
      S.current.href = location.href;

      let y = e.clientY;
      if (!e.detail || (e.clientX === 0 && y === 0)) {
        const r = a.getBoundingClientRect();
        y = r.top + r.height / 2;
      }
      at(y);

      const f0 = frameNo();
      try {
        sessionStorage.setItem(MVTR_FRAME, String(f0 + 1));
      } catch (_) {}
      setFr([f0, f0 + 1]);
      setName(titleOf(u, a));
      set("leave");

      const dest = u.pathname + u.search + u.hash;

      clearTm();

      // Push route via Next.js client router without reloading!
      const navTimer = window.setTimeout(() => {
        router.push(dest);
      }, Dm);
      tm.current.push(navTimer);

      // Failsafe auto-arrive in case router does not trigger path change
      const failsafeTimer = window.setTimeout(() => {
        if (S.current.mode === "leave") {
          arrive();
        }
      }, Dm + 1200);
      tm.current.push(failsafeTimer);
    };

    document.addEventListener("click", click, true);

    return () => {
      clearTm();
      document.removeEventListener("click", click, true);
      clearHold();
    };
  }, [live, enabled, isPrimary, respectRm, Dm, homeLabel, router]);

  // Route change handler: when pathname changes, smoothly open blades
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (!live || !enabled || !isPrimary) return;
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
      // If we were leaving (or user navigated via back/forward), open blades cleanly
      setMode("arrive");
      S.current.busy = false;
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("mv-hold-pt", "mvtr-arrive");
      }
      const t = window.setTimeout(() => {
        setMode("idle");
      }, MVTR_OPEN + 40);
      tm.current.push(t);
    }
  }, [pathname, live, enabled, isPrimary]);

  if (still || !enabled || !isPrimary) return null;

  const cls =
    mode === "leave"
      ? "mvtr mvtr-on mvtr-leave"
      : mode === "arrive"
      ? "mvtr mvtr-on mvtr-enter"
      : "mvtr mvtr-idle";

  const p2 = (n) => String(n).padStart(2, "0");
  const blade =
    tone === "deep"
      ? "var(--mv-pine)"
      : tone === "accent"
      ? "var(--mv-brass)"
      : "var(--mv-night)";
  const fg = tone === "accent" ? "var(--mv-ink)" : "var(--mv-cloud)";

  const overlay = (
    <div
      key={mode === "arrive" ? "a" + gen : mode}
      className={cls + (tone === "accent" ? " is-acc" : "")}
      aria-hidden
      style={{
        ...cssVars(c),
        "--d": `${Dm}ms`,
        "--o": `${MVTR_OPEN}ms`,
        "--blade": blade,
        "--fg": fg,
        pointerEvents: mode === "leave" ? "auto" : "none",
      }}
    >
      <div className="mvtr-b mvtr-t">
        <i className="mvtr-edge" />
        <span className="mvtr-sp" />
      </div>
      <div className="mvtr-b mvtr-u">
        <i className="mvtr-edge" />
        <span className="mvtr-sp" />
      </div>
      <div className="mvtr-mid">
        <p className="mvtr-k" style={M}>
          {kicker ? <em>{kicker}</em> : null}
          <span>
            {frameLabel} {p2(fr[0])}
          </span>
          <i />
          <span className="mvtr-to">{p2(fr[1])}</span>
        </p>
        <p className="mvtr-name" style={D}>
          {name || homeLabel}
        </p>
      </div>
      <i className="mvtr-c mvtr-c1" />
      <i className="mvtr-c mvtr-c2" />
      <i className="mvtr-c mvtr-c3" />
      <i className="mvtr-c mvtr-c4" />
    </div>
  );

  const portal = live && typeof document !== "undefined";

  return (
    <div
      className="mvtr-anchor"
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
          __html:
            CSS_MVTR +
            siteFontCss(props) +
            (respectRm
              ? "@media (prefers-reduced-motion:reduce){.mvtr{display:none!important}}"
              : ""),
        }}
      />
      {portal ? createPortal(overlay, document.body) : overlay}
    </div>
  );
}

const CSS_MVTR = `
.mvtr{position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden;color:var(--fg);display:none;--y:var(--mvtr-y,50vh);--warm:#FFF1DA}
.mvtr *{box-sizing:border-box}
.mvtr-on{display:block}
.mvtr-idle{display:none!important}
/* the blades: top covers 0 -> y, bottom covers y -> 100%; closed = each reaches the click line */
.mvtr-b{position:absolute;left:0;right:0;background:var(--blade);will-change:transform}
.mvtr-t{top:0;height:calc(var(--y) + 1px);transform-origin:50% 0}
.mvtr-u{top:var(--y);bottom:0;transform-origin:50% 100%}
.mvtr-b::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 120% at 50% var(--gy,100%),color-mix(in srgb,var(--mv-cloud) 6%,transparent),transparent 70%)}
.mvtr-u::before{--gy:0%}
/* the light slit on each blade's leading edge */
.mvtr-edge{position:absolute;left:0;right:0;height:2px;background:var(--warm);box-shadow:0 0 18px 3px rgba(255,226,180,.55),0 0 60px 8px rgba(255,226,180,.18)}
.mvtr-t .mvtr-edge{bottom:0}
.mvtr-u .mvtr-edge{top:0}
/* sprocket hint along the blades' outer sides */
.mvtr-sp{position:absolute;top:0;bottom:0;left:clamp(8px,1vw,14px);width:clamp(10px,1.1vw,16px);background:repeating-linear-gradient(180deg,color-mix(in srgb,var(--fg) 12%,transparent) 0 22px,transparent 22px 44px);border-radius:3px}
.mvtr-u .mvtr-sp{left:auto;right:clamp(8px,1vw,14px)}
.mvtr-enter .mvtr-mid{display:none}
/* leaving: blades close onto the line */
.mvtr-leave .mvtr-t{animation:mvtr-shutT var(--d) cubic-bezier(.7,0,.25,1) both}
.mvtr-leave .mvtr-u{animation:mvtr-shutU var(--d) cubic-bezier(.7,0,.25,1) both}
@keyframes mvtr-shutT{from{transform:translateY(calc(-100% - 40px))}to{transform:translateY(0)}}
@keyframes mvtr-shutU{from{transform:translateY(calc(100% + 40px))}to{transform:translateY(0)}}
.mvtr-leave .mvtr-edge{animation:mvtr-edge var(--d) linear both}
@keyframes mvtr-edge{0%{opacity:0}20%{opacity:1}85%{opacity:1}100%{opacity:.25}}
/* arriving: blades open from the same line */
.mvtr-enter .mvtr-t{animation:mvtr-openT var(--o) cubic-bezier(.7,0,.2,1) both}
.mvtr-enter .mvtr-u{animation:mvtr-openU var(--o) cubic-bezier(.7,0,.2,1) both}
@keyframes mvtr-openT{from{transform:translateY(0)}to{transform:translateY(calc(-100% - 40px))}}
@keyframes mvtr-openU{from{transform:translateY(0)}to{transform:translateY(calc(100% + 40px))}}
.mvtr-enter .mvtr-edge{animation:mvtr-flare var(--o) ease-out both}
@keyframes mvtr-flare{0%{opacity:1;transform:scaleY(2.5)}100%{opacity:.2;transform:scaleY(1)}}
/* the frame card */
.mvtr-mid{position:absolute;left:0;right:0;top:clamp(80px,var(--y),calc(100% - 180px));translate:0 -34px;padding:0 clamp(24px,5vw,80px);display:flex;flex-direction:column;align-items:center;text-align:center;gap:40px}
.mvtr-k{display:inline-flex;align-items:center;gap:10px;margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--fg) 78%,transparent);font-variant-numeric:tabular-nums;white-space:nowrap}
.mvtr-k i{width:22px;height:1px;background:currentColor;position:relative}
.mvtr-k i::after{content:"";position:absolute;right:0;top:-3px;border:3.5px solid transparent;border-left:5px solid currentColor;border-right:0}
.mvtr-to{color:var(--fg);padding:2px 6px;border-radius:3px;background:color-mix(in srgb,var(--fg) 12%,transparent)}
.mvtr-k em{font-style:normal;margin-right:10px;padding-right:12px;border-right:1px solid color-mix(in srgb,var(--fg) 30%,transparent);color:var(--fg)}
.mvtr-name{margin:0;max-width:100%;font-size:clamp(40px,6.4vw,96px);line-height:.95;letter-spacing:-.045em;font-weight:var(--mv-font-dw,700);color:var(--fg);overflow-wrap:anywhere}
.mvtr-leave .mvtr-k{animation:mvtr-in .26s cubic-bezier(.2,.8,.2,1) calc(var(--d)*.4) both}
.mvtr-leave .mvtr-name{animation:mvtr-clip .26s steps(8,end) calc(var(--d)*.5) both}
@keyframes mvtr-in{from{opacity:0;translate:0 10px}}
@keyframes mvtr-clip{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 -2% 0 0)}}
/* gate corners, visible while shut */
.mvtr-c{position:absolute;width:22px;height:22px;border:0 solid color-mix(in srgb,var(--fg) 45%,transparent);opacity:0}
.mvtr-c1{left:clamp(16px,2.4vw,36px);top:clamp(16px,2.4vw,36px);border-left-width:1.5px;border-top-width:1.5px}
.mvtr-c2{right:clamp(16px,2.4vw,36px);top:clamp(16px,2.4vw,36px);border-right-width:1.5px;border-top-width:1.5px}
.mvtr-c3{left:clamp(16px,2.4vw,36px);bottom:clamp(16px,2.4vw,36px);border-left-width:1.5px;border-bottom-width:1.5px}
.mvtr-c4{right:clamp(16px,2.4vw,36px);bottom:clamp(16px,2.4vw,36px);border-right-width:1.5px;border-bottom-width:1.5px}
.mvtr-leave .mvtr-c{animation:mvtr-in .25s ease calc(var(--d)*.7) both;opacity:1}
@media (max-width:809px){.mvtr-name{font-size:clamp(36px,11vw,60px)} .mvtr-k{font-size:12px;letter-spacing:.1em} .mvtr-k em{display:none}}
`;
