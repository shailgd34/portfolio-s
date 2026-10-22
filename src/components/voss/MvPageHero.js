"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FONTS,
  colorsOf,
  fontsOf,
  siteFontCss,
  cssVars,
  useFonts,
  useLive,
  useStill,
  useSize,
  useReduced,
  useStage,
  useMagnet,
  useScrollVars,
  onTick,
  clamp01,
  rise,
  RS,
  srcOf,
  pick,
  Eyebrow,
  Head,
  Btn,
  CSS_BASE,
  CSS_MOTION,
} from "./scaffold";
import { siteData, defaultProjects, defaultServices } from "./siteData";

const MVPH_PHOTO =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80";
const MVPH_FILM = "#0E0D0C";
const MVPH_EDGE = "#F2923A";

const imgOr = (r, k = "img") => (r && r[k]) || (r && r.f6) || "";

export default function MvPageHero(props = {}) {
  const {
    ground = "paper",
    object = "slate",
    eyebrow = "INDEX — Selected work",
    title = "Selected *work*,|2016 – 2026.",
    lead = "Eight products, from a banking app to a design system used by forty engineers. Each one designed in Figma and shipped in code.",
    primary = "Start a project",
    primaryLink = "",
    secondary = "Download résumé",
    secondaryLink = "",
    meta = "MV 400TX · Int. studio — day",
    cue = "Scroll",
    slateProd = "Portfolio 2026",
    slateScene = "Work",
    slateTake = "03",
    slateRoll = "A-01",
    prodLabel = "Prod.",
    sceneLabel = "Scene",
    takeLabel = "Take",
    rollLabel = "Roll",
    directorLabel = "Director",
    dateLabel = "Date",
    filmEdge = "MV 400TX",
    gels = "",
    gelPhoto,
    gelLabel = "Gel",
    lampLabel = "3200K",
    bpHint = "auto",
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
      : "var(--mv-font-dw, 720)",
    fontStretch: "115%",
  };

  const root = useRef(null);
  const obj = useRef(null);
  const tEl = useRef(null);
  const { w, vh } = useSize(root, bpHint);
  const phone = w < 810;
  const tab = w >= 810 && w < 1100;

  useMagnet(root, live);
  const ready = useStage(live);
  const [in0, setIn] = useState(false);
  useEffect(() => {
    if (!live || !ready) return;
    const t = window.setTimeout(() => setIn(true), 60);
    return () => window.clearTimeout(t);
  }, [live, ready]);

  const inn = in0 || still || rm;
  const dark = ground === "dark";
  const kind = ["slate", "strip", "gel", "lamp", "none"].includes(object)
    ? object
    : "slate";
  const anim = live && !rm && !still;

  // scroll: --ex = how far the hero has left the viewport
  const hRef = useRef(1);
  useEffect(() => {
    if (!root.current) return;
    const el = root.current;
    const m = () => {
      hRef.current = el.offsetHeight || 1;
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useScrollVars(root, live, rm, (sp) => {
    const el = root.current;
    if (!el) return;
    const v = window.innerHeight || 1;
    const h = hRef.current;
    const ex = clamp01((sp * (v + h) - v) / h);
    el.style.setProperty("--ex", ex.toFixed(4));
  });

  // slate: claps once the hero enters
  const [clap, setClap] = useState(false);
  const [flash, setFlash] = useState(0);
  useEffect(() => {
    if (kind !== "slate" || !anim || !inn) return;
    const t = window.setTimeout(() => {
      setClap(true);
      setFlash((f) => f + 1);
    }, 1100);
    return () => window.clearTimeout(t);
  }, [kind, anim, inn]);

  const shut = clap || !anim;
  const [today, setToday] = useState("");
  useEffect(() => {
    if (!live) return;
    try {
      setToday(
        new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
          .format(new Date())
          .replace(/\//g, ".")
      );
    } catch (e) {}
  }, [live]);

  const projects = defaultProjects;
  const services = defaultServices;

  const gelCols = (() => {
    const own = String(gels || "")
      .split(/[;,]/)
      .map((x) => x.trim())
      .filter((x) => /^#[0-9a-f]{3,8}$/i.test(x));
    if (own.length) return own.slice(0, 3);
    const s = services
      .map((r) => String(r.f5 || "").trim())
      .filter((x) => /^#[0-9a-f]{3,8}$/i.test(x));
    const fb = ["#FF5A3C", "#FFC94A", "#6C8CFF"];
    return [0, 1, 2].map((i) => s[i] || fb[i]);
  })();

  // pointer-driven objects (gel, lamp)
  useEffect(() => {
    if (!anim || (kind !== "gel" && kind !== "lamp") || !root.current)
      return;
    const r = root.current;
    const fine = window.matchMedia(
      "(hover:hover) and (pointer:fine)"
    ).matches;
    let W = 1;
    let H = 1;
    let hx = 0;
    let hy = 0;
    let tx0 = 0;
    let ty0 = 0;
    let fresh = true;

    const measure = () => {
      const a = r.getBoundingClientRect();
      W = a.width;
      H = a.height;
      const hd = r.querySelector(".mvph-lhead");
      if (hd) {
        const b = hd.getBoundingClientRect();
        hx = b.left - a.left + b.width / 2;
        hy = b.top - a.top + b.height / 2;
      }
      const t = tEl.current;
      if (t) {
        const b = t.getBoundingClientRect();
        tx0 = b.left - a.left + Math.min(b.width, 520) * 0.5;
        ty0 = b.top - a.top + b.height * 0.5;
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(r);
    const t1 = window.setTimeout(measure, 700);
    const t2 = window.setTimeout(measure, 1800);

    let tx = W * 0.4;
    let ty = H * 0.5;
    let x = tx;
    let y = ty;
    let last = -1e9;
    let px = 0;
    let py = 0;

    const mv = (e) => {
      const a = r.getBoundingClientRect();
      tx = e.clientX - a.left;
      ty = e.clientY - a.top;
      last = performance.now();
    };

    r.addEventListener("pointermove", mv);
    const onS = () => {
      fresh = true;
    };
    window.addEventListener("scroll", onS, { passive: true });

    const t0 = performance.now();
    let lastW = "";

    const off = onTick(() => {
      const now = performance.now();
      const ts = (now - t0) / 1000;
      const idle = !fine || now - last > 2600;
      if (idle) {
        if (kind === "lamp") {
          tx = tx0 + Math.cos(ts * 0.45) * Math.min(220, W * 0.16);
          ty = ty0 + Math.sin(ts * 0.6) * 40;
        } else {
          tx = W * (0.62 + 0.14 * Math.cos(ts * 0.4));
          ty = H * (0.5 + 0.18 * Math.sin(ts * 0.53));
        }
      }
      const k = idle ? 0.04 : 0.12;
      x += (tx - x) * k;
      y += (ty - y) * k;
      const key = `${x.toFixed(1)}|${y.toFixed(1)}`;
      if (key === lastW && !fresh) return;
      lastW = key;
      fresh = false;

      if (kind === "gel") {
        px = x / W - 0.5;
        py = y / H - 0.5;
        r.style.setProperty("--gx", px.toFixed(3));
        r.style.setProperty("--gy", py.toFixed(3));
        return;
      }

      const dx = x - hx;
      const dy = y - hy;
      const d = Math.hypot(dx, dy) || 1;
      const nx = -dy / d;
      const ny = dx / d;
      const R = Math.max(120, Math.min(240, W * 0.13));
      const h0 = 16;
      r.style.setProperty("--lx", `${x.toFixed(1)}px`);
      r.style.setProperty("--ly", `${y.toFixed(1)}px`);
      r.style.setProperty(
        "--la",
        `${((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(2)}deg`
      );
      r.style.setProperty(
        "--b1",
        `${(hx + nx * h0).toFixed(1)}px ${(hy + ny * h0).toFixed(1)}px`
      );
      r.style.setProperty(
        "--b2",
        `${(hx - nx * h0).toFixed(1)}px ${(hy - ny * h0).toFixed(1)}px`
      );
      r.style.setProperty(
        "--b3",
        `${(x - nx * R).toFixed(1)}px ${(y - ny * R).toFixed(1)}px`
      );
      r.style.setProperty(
        "--b4",
        `${(x + nx * R).toFixed(1)}px ${(y + ny * R).toFixed(1)}px`
      );
      r.style.setProperty("--lr", `${R}px`);
    });

    return () => {
      off();
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      r.removeEventListener("pointermove", mv);
      window.removeEventListener("scroll", onS);
    };
  }, [anim, kind, phone, tab]);

  const pLink = pick(primaryLink, siteData.book || "/contact");
  const sLink = pick(secondaryLink, siteData.resume || "/resume");
  const photo = srcOf(gelPhoto, MVPH_PHOTO);

  const F = ({ k, v, cls }) => (
    <div className={`mvph-f${cls ? " " + cls : ""}`}>
      <span style={M}>{k}</span>
      <b style={Dh}>{v}</b>
    </div>
  );

  const frames = projects.slice(0, 6);
  const loop = frames.length ? [...frames, ...frames] : [];
  const holes = (n) => (
    <i className="mvph-holes" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <b key={i} />
      ))}
    </i>
  );

  const objEl =
    kind === "slate" ? (
      <div className="mvph-slate">
        <div className="mvph-sticks" aria-hidden>
          <i className="mvph-arm">
            <b />
          </i>
          <i className="mvph-base">
            <b />
          </i>
          <i className="mvph-hinge" />
        </div>
        <div className="mvph-board">
          <F k={prodLabel} v={slateProd} cls="is-wide" />
          <div className="mvph-r3">
            <F k={sceneLabel} v={slateScene} />
            <F
              k={takeLabel}
              v={<span className="mvph-take">{slateTake}</span>}
            />
            <F k={rollLabel} v={slateRoll} />
          </div>
          <div className="mvph-r2">
            <F k={directorLabel} v={siteData.name} />
            <F k={dateLabel} v={today || "—"} />
          </div>
        </div>
        <i
          key={flash}
          className={`mvph-flash${flash ? " is-go" : ""}`}
          aria-hidden
        />
      </div>
    ) : kind === "strip" ? (
      <div className="mvph-strip" aria-hidden>
        <div className="mvph-film">
          <div className="mvph-run">
            {loop.map((r, i) => {
              const im = RS(imgOr(r), "320px");
              return (
                <div key={i} className="mvph-fr">
                  {holes(4)}
                  <div className="mvph-pic">
                    <img
                      src={im.src}
                      srcSet={im.srcSet}
                      sizes={im.sizes}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                  {holes(4)}
                  <em style={M}>
                    {filmEdge}{" "}
                    {String((i % frames.length) + 1).padStart(2, "0")}A
                  </em>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ) : kind === "gel" ? (
      <div className="mvph-gel">
        <div className="mvph-print">
          <img
            {...RS(photo, "(max-width: 809px) 90vw, 36vw")}
            alt=""
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
        {gelCols.map((g, i) => (
          <div
            key={i}
            className={`mvph-g mvph-g${i}`}
            style={{ "--gc": g }}
            aria-hidden
          >
            <i />
          </div>
        ))}
        <p className="mvph-gcap" style={M}>
          {gelCols.map((g, i) => (
            <span key={i}>
              <i style={{ background: g }} aria-hidden />
              {gelLabel} {String(i + 1).padStart(2, "0")} · {g.toUpperCase()}
            </span>
          ))}
        </p>
      </div>
    ) : kind === "lamp" ? (
      <div className="mvph-lamp" aria-hidden>
        <svg
          className="mvph-stand"
          viewBox="0 0 200 420"
          preserveAspectRatio="xMidYMax meet"
        >
          <path
            d="M100 0 V392 M100 392 L40 416 M100 392 L160 416 M100 392 V416"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect
            x="88"
            y="236"
            width="24"
            height="12"
            rx="3"
            fill="currentColor"
          />
        </svg>
        <div className="mvph-lhead">
          <svg viewBox="0 0 160 110">
            <path
              d="M18 20 h86 l34 -12 v94 l-34 -12 h-86 z"
              fill="var(--mvph-lampc)"
            />
            <rect
              x="6"
              y="28"
              width="14"
              height="54"
              rx="4"
              fill="var(--mvph-lampc)"
            />
            <rect
              x="134"
              y="4"
              width="10"
              height="102"
              rx="3"
              fill="#FFF1DA"
            />
            <path
              d="M30 34 h60 M30 55 h60 M30 76 h60"
              stroke="color-mix(in srgb,var(--mv-cloud) 22%,transparent)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <em style={M}>{lampLabel}</em>
        </div>
      </div>
    ) : null;

  return (
    <section
      ref={root}
      className={`mv mv-sec mvph${dark ? " mv-dark is-dark" : ""} is-${kind}${phone ? " is-ph" : tab ? " is-tab" : ""}${inn ? " is-in" : ""}${shut ? " is-clap" : ""}${anim ? " is-anim" : ""}`}
      style={{
        ...cssVars(c),
        ...B,
        "--vh0": `${vh}px`,
        ...(props.style || {}),
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_MVPH + siteFontCss(props),
        }}
      />
      {kind === "lamp" && !phone && (
        <>
          <i className="mvph-dim" aria-hidden />
          <i className="mvph-beam" aria-hidden />
          <i className="mvph-pool" aria-hidden />
        </>
      )}
      <div className="mv-wrap mvph-grid">
        <div ref={tEl} className="mvph-copy">
          <Eyebrow text={eyebrow} on={inn} M={M} />
          <Head
            text={title}
            on={inn}
            D={Dh}
            tag="h1"
            size={
              phone
                ? "clamp(40px,11.5vw,60px)"
                : "clamp(52px,6.2vw,100px)"
            }
            lh={0.93}
            delay={140}
            className="mvph-t"
          />
          {lead && (
            <p className="mvph-lead" style={rise(inn, 520, 16)}>
              {lead}
            </p>
          )}
          {(primary || secondary) && (
            <div className="mvph-btns" style={rise(inn, 640, 14)}>
              {primary && (
                <Btn href={pLink} label={primary} kind="solid" />
              )}
              {secondary && (
                <Btn href={sLink} label={secondary} kind="ghost" />
              )}
            </div>
          )}
        </div>
        {objEl && (
          <div ref={obj} className="mvph-obj" style={rise(inn, 300, 30)}>
            {objEl}
          </div>
        )}
      </div>
      {(meta || cue) && (
        <div className="mv-wrap">
          <div className="mvph-meta" style={{ ...M, ...rise(inn, 800, 8) }}>
            <span>{meta}</span>
            {cue && (
              <span className="mvph-cue">
                {cue}
                <i aria-hidden>↓</i>
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const CSS_MVPH = `
.mvph{--ex:0;position:relative;background:var(--mv-bone);color:var(--mv-ink);overflow:hidden;overflow:clip;isolation:isolate;min-height:max(620px,72svh);display:flex;flex-direction:column;justify-content:flex-end;padding-top:clamp(112px,14vh,150px);--line:var(--mv-fog)}
.mvph.is-dark{background:var(--mv-night);color:var(--mv-cloud);--line:color-mix(in srgb,var(--mv-cloud) 14%,transparent)}
.mvph .mv-hd{letter-spacing:-.045em}
.mvph:not(.is-dark) .mv-it{display:inline-block;color:var(--mv-ink);font-weight:inherit;line-height:1.02;padding:0 .07em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .72s steps(8) var(--pd,600ms)}
.mvph:not(.is-dark) .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvph.is-dark .mv-it{color:var(--mv-brass);font-weight:inherit}
.mvph-grid{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,.9fr);gap:clamp(32px,5vw,96px);align-items:end;padding-bottom:clamp(36px,5vh,56px)}
.mvph.is-none .mvph-grid{grid-template-columns:minmax(0,1fr)}
.mvph-copy{display:flex;flex-direction:column;align-items:flex-start;gap:24px;translate:0 calc(var(--ex)*56px)}
.mvph-t{max-width:14ch} .mvph.is-none .mvph-t{max-width:18ch}
.mvph-lead{margin:0;max-width:46ch;font-size:18px;line-height:1.55;color:var(--mv-mut)}
.mvph.is-dark .mvph-lead{color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvph-btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:4px}
.mvph-obj{position:relative;justify-self:end;width:100%;max-width:520px}
.mvph-obj>*{translate:0 calc(var(--ex)*-90px);scale:calc(1 + var(--ex)*.07)}
.mvph-meta{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:16px 0 22px;border-top:1px solid var(--line);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvph.is-dark .mvph-meta{color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvph-cue{display:inline-flex;align-items:center;gap:8px} .mvph-cue i{font-style:normal;display:inline-block;animation:mvph-cue 1.8s cubic-bezier(.6,0,.4,1) infinite} @keyframes mvph-cue{0%,100%{translate:0 -2px}50%{translate:0 3px}}
/* SLATE */
.mvph-slate{position:relative;padding-top:clamp(52px,4.6vw,68px);rotate:-3deg;color:var(--mv-cloud);--chalk:color-mix(in srgb,var(--mv-cloud) 82%,transparent);transition:rotate .6s cubic-bezier(.34,1.56,.64,1)}
.mvph-slate:hover{rotate:-1deg}
.mvph-sticks{position:absolute;left:0;right:0;top:0;height:clamp(52px,4.6vw,68px)}
.mvph-arm,.mvph-base{position:absolute;left:0;right:0;height:calc(50% - 2px);border-radius:4px 4px 2px 2px;overflow:hidden;background:var(--mv-ink);box-shadow:inset 0 0 0 1.5px var(--chalk)}
.mvph-arm b,.mvph-base b{position:absolute;inset:0;background:repeating-linear-gradient(118deg,var(--mv-cloud) 0 26px,var(--mv-ink) 26px 52px)}
.mvph-base{bottom:0} .mvph-base b{background-position:-13px 0}
.mvph-arm{top:2px;transform-origin:14px 100%;rotate:-26deg;box-shadow:inset 0 0 0 1.5px var(--chalk),0 10px 18px -8px rgba(0,0,0,.5);transition:rotate .5s cubic-bezier(.2,.8,.2,1)}
.mvph.is-clap .mvph-arm{rotate:0deg;transition:rotate .16s cubic-bezier(.7,0,1,.6)}
.mvph.is-clap .mvph-slate:hover .mvph-arm{rotate:-9deg;transition:rotate .45s cubic-bezier(.34,1.56,.64,1)}
.mvph-hinge{position:absolute;left:6px;top:calc(50% - 7px);width:14px;height:14px;border-radius:50%;background:var(--mv-cloud);box-shadow:0 0 0 3px var(--mv-ink)}
.mvph-board{position:relative;display:flex;flex-direction:column;border-radius:4px 4px 8px 8px;background:color-mix(in srgb,var(--mv-ink) 90%,#000);box-shadow:inset 0 0 0 1.5px var(--chalk),0 40px 70px -34px rgba(0,0,0,.65),0 12px 24px -16px rgba(0,0,0,.4);overflow:hidden}
.mvph-board::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 70% at 18% 0%,rgba(255,241,218,.09),transparent 60%)}
.mvph.is-anim.is-clap .mvph-board{animation:mvph-hit .32s cubic-bezier(.3,0,.2,1) .12s} @keyframes mvph-hit{35%{translate:0 3px}}
.mvph-f{display:flex;flex-direction:column;gap:6px;padding:12px 16px 14px;min-width:0}
.mvph-f>span{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvph-f b{font-size:clamp(20px,1.8vw,28px);line-height:1.05;letter-spacing:-.02em;color:var(--chalk);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mvph-r3,.mvph-r2{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.8fr) minmax(0,.9fr);border-top:1.5px solid var(--chalk)} .mvph-r2{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}
.mvph-r3>.mvph-f+.mvph-f,.mvph-r2>.mvph-f+.mvph-f{border-left:1.5px solid var(--chalk)}
.mvph-r3 .mvph-f b{font-size:clamp(24px,2.3vw,38px)} .mvph-take{color:var(--mv-brass)}
.mvph-flash{position:absolute;inset:-18px;z-index:3;border-radius:16px;pointer-events:none;background:radial-gradient(closest-side,#FFFFFF,rgba(255,241,218,.7) 45%,transparent);opacity:0}
.mvph-flash.is-go{animation:mvph-fl .5s ease-out .12s} @keyframes mvph-fl{0%{opacity:.8}100%{opacity:0}}
/* STRIP */
.mvph-strip{position:relative;aspect-ratio:5/4;display:grid;place-items:center;-webkit-mask:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);mask:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)}
.mvph-film{width:150%;rotate:-7deg;background:${MVPH_FILM};padding:0;box-shadow:0 40px 60px -30px rgba(0,0,0,.55);overflow:hidden}
.mvph-run{display:flex;width:max-content;animation:mvph-run 42s linear infinite}
.mvph-strip:hover .mvph-run{animation-play-state:paused}
@keyframes mvph-run{to{transform:translateX(-50%)}}
.mvph:not(.is-anim) .mvph-run{animation:none;transform:translateX(-8%)}
.mvph-fr{position:relative;display:flex;flex-direction:column;width:clamp(200px,17vw,250px);padding:0 7px}
.mvph-holes{display:flex;justify-content:space-around;height:26px;align-items:center} .mvph-holes b{width:12px;height:9px;border-radius:2px;background:color-mix(in srgb,var(--mv-bone) 85%,#fff)}
.mvph-pic{position:relative;aspect-ratio:4/3;border-radius:3px;overflow:hidden;background:#222}
.mvph-pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.02);transition:filter .4s,scale .6s cubic-bezier(.2,.8,.2,1)}
.mvph-fr:hover .mvph-pic img{scale:1.05;filter:saturate(1.1) brightness(1.06)}
.mvph-fr em{position:absolute;left:10px;bottom:0;font-style:normal;font-size:12px;line-height:1;letter-spacing:.14em;color:${MVPH_EDGE};opacity:.9}
/* GEL */
.mvph-gel{position:relative;aspect-ratio:4/5;width:min(100%,420px);max-height:min(52svh,520px);margin:0 4% 56px auto;--gx:0;--gy:0}
.mvph-print{position:absolute;inset:0;border-radius:4px;overflow:hidden;background:#888;box-shadow:0 40px 70px -36px rgba(0,0,0,.55)}
.mvph-print img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.12) brightness(1.02)}
.mvph-g{position:absolute;width:56%;aspect-ratio:1/1.12;padding:6px;border-radius:5px;background:color-mix(in srgb,var(--mv-ink) 88%,#000);mix-blend-mode:multiply;box-shadow:0 18px 30px -18px rgba(0,0,0,.5)}
.mvph-g i{position:absolute;inset:6px;border-radius:2px;background:var(--gc);opacity:.92}
.mvph-gcap{position:absolute;left:0;right:0;top:calc(100% + 30px);margin:0;display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;letter-spacing:.1em;color:var(--mv-mut)}
.mvph-gcap span{display:inline-flex;align-items:center;gap:7px} .mvph-gcap i{width:10px;height:10px;border-radius:2px}
.mvph.is-dark .mvph-gcap{color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvph-g0{left:-9%;top:7%;rotate:-6deg;translate:calc(var(--gx)*-46px + var(--ex)*-40px) calc(var(--gy)*-30px)}
.mvph-g1{right:-7%;top:28%;rotate:5deg;translate:calc(var(--gx)*38px + var(--ex)*40px) calc(var(--gy)*26px)}
.mvph-g2{left:20%;bottom:0%;rotate:-2deg;translate:calc(var(--gx)*22px) calc(var(--gy)*44px + var(--ex)*30px)}
.mvph-g{transform:translateY(40px);opacity:0;transition:transform 1.2s cubic-bezier(.2,.85,.15,1),opacity .8s ease} .mvph-g1{transition-delay:.12s} .mvph-g2{transition-delay:.24s}
.mvph.is-in .mvph-g{transform:none;opacity:1}
.mvph-gel:hover .mvph-g i{opacity:.72}
/* LAMP */
.mvph-lamp{position:relative;aspect-ratio:5/6;max-height:min(58svh,560px);margin-left:auto;color:color-mix(in srgb,var(--mv-ink) 82%,var(--mv-stone));--mvph-lampc:color-mix(in srgb,var(--mv-ink) 92%,#000)}
.mvph.is-dark .mvph-lamp{color:color-mix(in srgb,var(--mv-cloud) 30%,var(--mv-night));--mvph-lampc:color-mix(in srgb,var(--mv-cloud) 16%,var(--mv-night))}
.mvph-stand{position:absolute;left:30%;bottom:0;width:40%;height:70%}
.mvph-lhead{position:absolute;left:24%;top:17%;width:52%;aspect-ratio:160/110;rotate:var(--la,200deg);transition:rotate .08s linear}
.mvph:not(.is-anim) .mvph-lhead{rotate:196deg} .mvph.is-ph .mvph-lhead{rotate:235deg} .mvph.is-ph .mvph-lhead em{rotate:-235deg}
.mvph-lhead svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 16px 20px rgba(0,0,0,.3))}
.mvph-lhead em{position:absolute;left:34%;top:-26px;font-style:normal;font-size:12px;letter-spacing:.12em;color:var(--mv-mut);rotate:calc(var(--la,200deg)*-1)}
.mvph.is-dark .mvph-lhead em{color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvph-dim,.mvph-beam,.mvph-pool{position:absolute;inset:0;z-index:3;pointer-events:none} .mvph-dim{z-index:1}
.mvph-dim{background:radial-gradient(circle calc(var(--lr,200px)*1.25) at var(--lx,40%) var(--ly,55%),transparent 0,transparent 45%,color-mix(in srgb,var(--mv-ink) 8%,transparent) 100%);opacity:0;transition:opacity 1.4s ease .4s}
.mvph.is-dark .mvph-dim{background:radial-gradient(circle calc(var(--lr,200px)*1.25) at var(--lx,40%) var(--ly,55%),transparent 0,transparent 45%,rgba(0,0,0,.32) 100%)}
.mvph-beam{clip-path:polygon(var(--b1,70% 30%),var(--b2,70% 32%),var(--b3,40% 70%),var(--b4,40% 40%));background:linear-gradient(200deg,rgba(255,241,218,.55),rgba(255,226,180,.12));mix-blend-mode:soft-light;opacity:0;transition:opacity 1.4s ease .5s}
.mvph.is-dark .mvph-beam{mix-blend-mode:screen;background:linear-gradient(200deg,rgba(255,241,218,.16),rgba(255,226,180,.04))}
.mvph-pool{background:radial-gradient(circle var(--lr,200px) at var(--lx,40%) var(--ly,55%),rgba(255,241,218,.9),rgba(255,226,180,.35) 45%,transparent 72%);mix-blend-mode:soft-light;opacity:0;transition:opacity 1.4s ease .5s}
.mvph.is-dark .mvph-pool{mix-blend-mode:screen;background:radial-gradient(circle var(--lr,200px) at var(--lx,40%) var(--ly,55%),rgba(255,241,218,.28),rgba(255,226,180,.09) 45%,transparent 72%)}
.mvph.is-anim.is-in .mvph-dim,.mvph.is-anim.is-in .mvph-beam,.mvph.is-anim.is-in .mvph-pool{opacity:1}
/* tablet + phone */
.mvph.is-tab .mvph-grid{grid-template-columns:minmax(0,1.3fr) minmax(0,.8fr);gap:36px}
.mvph.is-tab .mvph-lead{font-size:17px}
.mvph.is-ph{min-height:0;padding-top:104px}
.mvph.is-ph .mvph-grid{grid-template-columns:minmax(0,1fr);gap:44px;padding-bottom:36px}
.mvph.is-ph .mvph-copy{gap:20px;translate:none}
.mvph.is-ph .mvph-lead{font-size:16.5px}
.mvph.is-ph .mvph-btns{flex-direction:column;align-items:stretch;width:100%} .mvph.is-ph .mvph-btns .mv-btn{width:100%}
.mvph.is-ph .mvph-obj{justify-self:center;max-width:min(360px,100%)} .mvph.is-ph .mvph-obj>*{translate:none;scale:1}
.mvph.is-ph .mvph-gel,.mvph.is-ph .mvph-lamp{max-height:none;width:78%;margin:0 auto} .mvph.is-ph .mvph-gel{margin-bottom:64px} .mvph.is-ph .mvph-lamp{width:62%}
.mvph.is-ph .mvph-slate{rotate:-2deg;margin:0 6px}
.mvph.is-ph .mvph-f{padding:10px 12px 12px} .mvph.is-ph .mvph-f b{font-size:18px} .mvph.is-ph .mvph-r3 .mvph-f b{font-size:22px}
.mvph.is-ph .mvph-fr{width:170px}
.mvph.is-ph .mvph-meta{font-size:12px}
@media (prefers-reduced-motion:reduce){.mvph-run,.mvph-cue i{animation:none!important} .mvph-copy,.mvph-obj>*{translate:none!important;scale:1!important}}
`;
