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
  useOn,
  useMagnet,
  useScrollVars,
  clamp01,
  rise,
  RS,
  Eyebrow,
  Head,
  IcoArrow,
  Glyph,
  CSS_BASE,
  CSS_MOTION,
} from "./scaffold";
import { defaultPosts } from "./siteData";

const MvwlClip = () => (
  <svg className="mvwl-clip" viewBox="0 0 22 58" aria-hidden>
    <path
      d="M7 40V9a4.5 4.5 0 0 1 9 0v34a7 7 0 0 1-14 0V14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const MvwlLine = () => (
  <svg
    className="mvwl-ul"
    viewBox="0 0 300 12"
    preserveAspectRatio="none"
    aria-hidden
  >
    <path pathLength={1} d="M2 8C40 4 88 9 130 6s104-4 166 1" />
  </svg>
);

const imgOr = (r, k = "img") => (r && r[k]) || (r && r.f6) || "";

export default function MvWritingList(props = {}) {
  const {
    eyebrow = "NOTEBOOK — Writing",
    heading = "Notes from|the *studio*.",
    lead = "Short essays on designing and building digital products — process, systems, pricing and the small decisions that make software feel good.",
    pageLabel = "Notebook · Vol. 3",
    countLabel = "{count} notes",
    allLabel = "All",
    filterLabel = "Filter by topic",
    featuredLabel = "Latest note",
    readLabel = "Read the note",
    readSuffix = "read",
    emptyText = "The first notes are being written.",
    figLabel = "Fig.",
    pageNo = "p. 14",
    nlEyebrow = "The studio letter",
    nlTitle = "One letter a month.|No *noise*.",
    nlText = "New notes, one useful link and what I'm building — straight to your inbox.",
    nlLabel = "Your email",
    nlPlaceholder = "you@studio.com",
    nlButton = "Subscribe",
    nlNote = "No tracking. Unsubscribe any time.",
    nlEndpoint = "",
    nlDone = "Noted.",
    nlDoneText = "You're on the list — the next letter lands at the start of the month.",
    nlError = "That didn't go through. Please try again.",
    nlInvalid = "Please enter a valid email address.",
    bpHint = "auto",
    posts: passedPosts,
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
  };

  const root = useRef(null);
  const book = useRef(null);
  const { w } = useSize(root, bpHint);
  const phone = w < 810;
  const tab = w >= 810 && w < 1100;

  const on = useOn(root, live, rm, 0.02);
  useMagnet(root, live);

  const rows = passedPosts || defaultPosts;

  const kicks = [];
  rows.forEach((r) => {
    const k = String(r.f2 || "").trim();
    if (k && !kicks.includes(k)) kicks.push(k);
  });

  const [kick, setKick] = useState("");
  const kk = kicks.includes(kick) ? kick : "";
  const shown = rows.filter((r) => !kk || String(r.f2 || "").trim() === kk);
  const feat = shown[0];
  const rest = shown.slice(1);

  const anim = live && !rm && !still;
  const pad = (x) => String(x).padStart(2, "0");

  // the pen: reading line at 72% of the viewport -> margin length, ruling reveal, each entry's rule
  const G = useRef({
    H: 1,
    vh: 1,
    bt: 0,
    bh: 1,
    rs: [],
  });

  useEffect(() => {
    if (!anim || !root.current || !book.current) return;
    const el = root.current;
    const bk = book.current;
    const m = () => {
      const a = el.getBoundingClientRect();
      const b = bk.getBoundingClientRect();
      G.current = {
        H: el.offsetHeight || 1,
        vh: window.innerHeight || 1,
        bt: b.top - a.top,
        bh: b.height || 1,
        rs: Array.from(bk.querySelectorAll("[data-rule]")).map((r) => {
          const q = r.getBoundingClientRect();
          return { el: r, t: q.top - a.top, h: q.height };
        }),
      };
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    const t = window.setTimeout(m, 800);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [anim, kk, rows.length, w]);

  useScrollVars(root, anim, rm, (sp) => {
    const g = G.current;
    const r = root.current;
    if (!r) return;
    const line = sp * (g.vh + g.H) - g.vh + g.vh * 0.72;
    r.style.setProperty("--ml", clamp01((line - g.bt) / g.bh).toFixed(4));
    for (const q of g.rs) {
      const d =
        Math.round(
          clamp01((line - q.t) / Math.max(80, q.h * 0.7)) * 100
        ) / 100;
      if (q.el.__d !== d) {
        q.el.__d = d;
        q.el.style.setProperty("--d", String(d));
      }
    }
  });

  // newsletter
  const [email, setEmail] = useState("");
  const [st, setSt] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setSt("bad");
      return;
    }
    if (!nlEndpoint) {
      setSt("ok");
      return;
    }
    setSt("busy");
    try {
      const r = await fetch(nlEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "writing",
        }),
      });
      setSt(r.ok ? "ok" : "err");
    } catch (x) {
      setSt("err");
    }
  };

  const readT = (r) =>
    r.f4 ? `${r.f4}${readSuffix ? ` ${readSuffix}` : ""}` : "";

  return (
    <section
      ref={root}
      className={`mv mv-sec mvwl${phone ? " is-ph" : tab ? " is-tab" : ""}${on ? " is-on" : ""}${anim ? " is-anim" : ""}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_WL + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvwl-top">
          <div className="mvwl-hd">
            <Eyebrow text={eyebrow} on={on} M={M} />
            <Head
              tag="h1"
              text={heading}
              on={on}
              D={Dh}
              size={
                phone
                  ? "clamp(46px,13vw,64px)"
                  : "clamp(60px,7vw,112px)"
              }
              lh={0.9}
              delay={80}
              style={{ fontStretch: "116%" }}
            />
          </div>
          <div className="mvwl-side" style={rise(on, 360, 14)}>
            {lead && <p className="mvwl-lead">{lead}</p>}
            <p className="mvwl-page" style={M}>
              <span>{pageLabel}</span>
              <span>
                {countLabel.replace(/\{count\}/g, pad(rows.length))}
              </span>
            </p>
          </div>
        </header>

        {kicks.length > 1 && (
          <div
            className="mvwl-filt"
            role="group"
            aria-label={filterLabel}
            style={rise(on, 460, 10)}
          >
            {["", ...kicks].map((k) => (
              <button
                key={k || "all"}
                type="button"
                style={M}
                aria-pressed={kk === k}
                className={kk === k ? "is-on" : ""}
                onClick={() => setKick(k)}
              >
                {k || allLabel}
              </button>
            ))}
          </div>
        )}

        {rows.length === 0 ? (
          emptyText ? (
            <p className="mvwl-empty" style={M}>
              {emptyText}
            </p>
          ) : null
        ) : (
          <div ref={book} className="mvwl-book" key={kk || "all"}>
            <i className="mvwl-ruling" aria-hidden />
            <i className="mvwl-margin" aria-hidden>
              {pageNo && <b style={M}>{pageNo}</b>}
            </i>
            {feat && (
              <article
                className="mvwl-feat"
                data-rule
                style={rise(on, 520, 20)}
              >
                <a className="mvwl-fa" href={`/writing/${feat.slug || ""}`}>
                  <span className="mvwl-fcov" aria-hidden>
                    <MvwlClip />
                    <span className="mvwl-fimg">
                      <img
                        {...RS(
                          imgOr(feat),
                          phone ? "90vw" : "44vw"
                        )}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <em style={M}>
                      {figLabel} 01 — {feat.f2 || featuredLabel}
                    </em>
                  </span>
                  <span className="mvwl-ftx">
                    <span className="mvwl-fk" style={M}>
                      <b>{featuredLabel}</b>
                      {feat.f2 && <i>{feat.f2}</i>}
                    </span>
                    <h2 className="mvwl-ft" style={Dh}>
                      <span>{feat.f1}</span>
                      <MvwlLine />
                    </h2>
                    {feat.f5 && <span className="mvwl-fx">{feat.f5}</span>}
                    <span className="mvwl-fm" style={M}>
                      {[feat.f3, readT(feat)].filter(Boolean).join(" · ")}
                    </span>
                    <span className="mvwl-fgo" style={M}>
                      {readLabel}
                      <IcoArrow s={15} />
                    </span>
                  </span>
                </a>
                <i className="mvwl-rule" aria-hidden />
              </article>
            )}

            {rest.length > 0 && (
              <ol className="mvwl-list">
                {rest.map((r, i) => (
                  <li
                    key={r.slug || i}
                    className="mvwl-row"
                    data-rule
                    style={rise(on, 620 + i * 80, 16)}
                  >
                    <a className="mvwl-a" href={`/writing/${r.slug || ""}`}>
                      <span className="mvwl-no" style={M}>
                        {pad(i + 2)}
                      </span>
                      <span className="mvwl-th" aria-hidden>
                        <img
                          {...RS(imgOr(r), "120px")}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="mvwl-main">
                        <h2 className="mvwl-t" style={Dh}>
                          <span>{r.f1}</span>
                          <MvwlLine />
                        </h2>
                        {r.f5 && <span className="mvwl-x">{r.f5}</span>}
                      </span>
                      <span className="mvwl-meta" style={M}>
                        {r.f2 && <i>{r.f2}</i>}
                        <span>
                          {[r.f3, readT(r)].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <span className="mvwl-go" aria-hidden>
                        <IcoArrow s={16} />
                      </span>
                    </a>
                    <i className="mvwl-rule" aria-hidden />
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        <div className="mvwl-nl" style={rise(on, 300, 20)}>
          <div className="mvwl-nlh">
            <p className="mvwl-nle" style={M}>
              {nlEyebrow}
            </p>
            <Head
              text={nlTitle}
              on={on}
              D={Dh}
              size="clamp(34px,3.4vw,52px)"
              lh={0.95}
              delay={200}
              style={{ fontStretch: "115%" }}
            />
            {nlText && <p className="mvwl-nlt">{nlText}</p>}
          </div>

          {st === "ok" ? (
            <div className="mvwl-done" role="status">
              <span className="mvwl-stamp" style={Dh}>
                {nlDone}
              </span>
              <p>{nlDoneText}</p>
            </div>
          ) : (
            <form className="mvwl-form" onSubmit={submit} noValidate>
              <label htmlFor="mvwl-email" style={M}>
                {nlLabel}
              </label>
              <div className="mvwl-row2">
                <input
                  id="mvwl-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  placeholder={nlPlaceholder}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (st === "bad" || st === "err") setSt("");
                  }}
                  aria-invalid={st === "bad"}
                  aria-describedby="mvwl-msg"
                />
                <button
                  type="submit"
                  className="mv-btn mv-solid mvwl-sub"
                  data-mag
                  disabled={st === "busy"}
                  style={B}
                >
                  <span className="mv-face">
                    <span className="mv-fill" aria-hidden />
                    <span className="mv-lbl">
                      <span className="mv-roll">
                        <span className="mv-l1">{nlButton}</span>
                        <span className="mv-l2" aria-hidden>
                          {nlButton}
                        </span>
                      </span>
                    </span>
                    <span className="mv-arr" aria-hidden>
                      <span className="mv-a1">
                        <Glyph k="mail" />
                      </span>
                      <span className="mv-a2">
                        <Glyph k="mail" />
                      </span>
                    </span>
                  </span>
                  <span className="mv-selb" aria-hidden>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <b className="mv-dim" aria-hidden />
                </button>
              </div>
              <p
                id="mvwl-msg"
                className={`mvwl-msg${st === "bad" || st === "err" ? " is-err" : ""}`}
                style={M}
                aria-live="polite"
              >
                {st === "bad"
                  ? nlInvalid
                  : st === "err"
                  ? nlError
                  : nlNote}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const CSS_WL = `
.mvwl{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(128px,11vw,176px) 0 clamp(96px,9vw,150px);overflow:clip;--ml:1;--rl:32px}
.mvwl.is-anim{--ml:0}
.mvwl .mv-eb{border-radius:6px;text-transform:uppercase;letter-spacing:.1em;font-size:12px}
.mvwl .mv-hd{letter-spacing:-.045em}
.mvwl .mv-it{font-weight:inherit;color:var(--mv-ink);padding:0 .07em;margin:0 -.03em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) 0 0/0% 100% no-repeat;transition:background-size .72s steps(8,end) var(--pd,600ms)}
.mvwl .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvwl-top{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:40px;align-items:end;margin-bottom:clamp(40px,4vw,64px)}
.mvwl-hd{display:flex;flex-direction:column;gap:26px}
.mvwl-side{display:flex;flex-direction:column;gap:22px;padding-bottom:8px}
.mvwl-lead{margin:0;font-size:18px;line-height:1.55;color:var(--mv-mut);max-width:42ch}
.mvwl-page{display:flex;gap:18px;margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)} .mvwl-page span:first-child{color:var(--mv-ink)}
.mvwl-filt{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:clamp(28px,3vw,40px)}
.mvwl-filt button{appearance:none;border:0;cursor:pointer;min-height:40px;padding:0 14px;border-radius:10px;background:transparent;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent);color:var(--mv-ink);font-size:12px;letter-spacing:.1em;text-transform:uppercase;transition:background .3s,box-shadow .3s}
.mvwl-filt button:hover{background:color-mix(in srgb,var(--mv-ink) 6%,transparent)} .mvwl-filt button.is-on{background:var(--mv-brass);box-shadow:none}
.mvwl-empty{margin:0;padding:28px 0;border-top:1px solid var(--mv-fog);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
/* the page: ruling revealed under the pen, accent margin line, each entry's rule drawn */
.mvwl-book{position:relative;--gut:clamp(56px,6vw,96px);--in:clamp(20px,2.4vw,40px);padding-left:calc(var(--gut) + var(--in));animation:mvwl-in .6s ease both}
@keyframes mvwl-in{from{opacity:0}to{opacity:1}}
.mvwl-ruling{position:absolute;left:0;right:0;top:0;bottom:0;background:repeating-linear-gradient(180deg,transparent 0,transparent calc(var(--rl) - 1px),color-mix(in srgb,var(--mv-ink) 7%,transparent) calc(var(--rl) - 1px),color-mix(in srgb,var(--mv-ink) 7%,transparent) var(--rl));clip-path:inset(0 0 calc((1 - var(--ml)) * 100%) 0);pointer-events:none}
.mvwl-margin{position:absolute;left:var(--gut);top:-24px;bottom:-24px;width:2px;pointer-events:none}
.mvwl-margin::before{content:"";position:absolute;inset:0;background:var(--mv-brass);transform-origin:50% 0;transform:scaleY(var(--ml))}
.mvwl-margin b{position:absolute;left:50%;top:calc(var(--ml) * 100%);translate:-50% -50%;display:flex;align-items:center;justify-content:center;padding:3px 6px;border-radius:4px;background:var(--mv-ink);color:var(--mv-bone);font-size:12px;font-weight:500;letter-spacing:.08em;white-space:nowrap;opacity:calc(min(1,var(--ml) * 12) * min(1,(1 - var(--ml)) * 12))}
.mvwl:not(.is-anim) .mvwl-margin b{display:none}
.mvwl-rule{position:absolute;left:calc(var(--in) * -1);right:0;bottom:0;height:1px;background:color-mix(in srgb,var(--mv-ink) 30%,transparent);transform-origin:0 50%;transform:scaleX(var(--d,1))}
.mvwl.is-anim [data-rule]{--d:0}
/* featured page */
.mvwl-feat{position:relative;padding:0 0 clamp(40px,4vw,64px)}
.mvwl-fa{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:clamp(28px,4vw,72px);align-items:center;text-decoration:none;color:inherit;outline-offset:8px;border-radius:6px}
.mvwl-fcov{position:relative;display:block;padding:12px 12px 14px;border-radius:4px;background:var(--mv-cloud);box-shadow:0 1px 0 color-mix(in srgb,var(--mv-ink) 8%,transparent),0 30px 60px -30px rgba(0,0,0,.35);rotate:-1.2deg;transition:rotate .6s cubic-bezier(.34,1.56,.64,1),translate .6s cubic-bezier(.2,.8,.2,1)}
.mvwl-fimg{position:relative;display:block;aspect-ratio:4/3;border-radius:3px;overflow:hidden;background:color-mix(in srgb,var(--mv-stone) 22%,transparent)} .mvwl-fimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:scale 1s cubic-bezier(.2,.8,.2,1)}
.mvwl-fcov em{display:block;margin:10px 2px 0;font-style:normal;font-size:12px;letter-spacing:.08em;color:var(--mv-mut)}
.mvwl-clip{position:absolute;z-index:2;left:30px;top:-24px;width:18px;height:auto;color:color-mix(in srgb,var(--mv-stone) 45%,var(--mv-ink))}
.mvwl-fa:hover .mvwl-fcov,.mvwl-fa:focus-visible .mvwl-fcov{rotate:0deg;translate:0 -4px} .mvwl-fa:hover .mvwl-fimg img{scale:1.04}
.mvwl-ftx{display:flex;flex-direction:column;align-items:flex-start;gap:18px}
.mvwl-fk{display:flex;gap:10px;align-items:center;font-size:12px;letter-spacing:.1em;text-transform:uppercase} .mvwl-fk b{font-weight:500;padding:4px 8px;border-radius:4px;background:var(--mv-ink);color:var(--mv-bone)} .mvwl-fk i{font-style:normal;padding:4px 8px;border-radius:4px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent)}
.mvwl-ft{position:relative;margin:0;font-size:clamp(36px,3.8vw,58px);line-height:.98;letter-spacing:-.035em;font-stretch:114%;text-wrap:balance;padding-bottom:6px}
.mvwl-fx{font-size:18px;line-height:1.5;color:var(--mv-mut);max-width:40ch}
.mvwl-fm{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvwl-fgo{display:inline-flex;align-items:center;gap:10px;margin-top:6px;padding:12px 14px 12px 16px;border-radius:10px;background:var(--mv-ink);color:var(--mv-bone);font-size:12px;letter-spacing:.08em;text-transform:uppercase;transition:background .35s,color .35s} .mvwl-fgo svg{transition:translate .45s cubic-bezier(.34,1.56,.64,1)}
.mvwl-fa:hover .mvwl-fgo,.mvwl-fa:focus-visible .mvwl-fgo{background:var(--mv-brass);color:var(--mv-ink)} .mvwl-fa:hover .mvwl-fgo svg{translate:4px 0}
/* hand-drawn underline */
.mvwl-ul{position:absolute;left:-2px;bottom:-4px;width:calc(100% + 4px);height:12px;overflow:visible;pointer-events:none}
.mvwl-ul path{fill:none;stroke:var(--mv-ink);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:1 2;stroke-dashoffset:1;transition:stroke-dashoffset .6s cubic-bezier(.6,0,.2,1)}
.mvwl-fa:hover .mvwl-ul path,.mvwl-fa:focus-visible .mvwl-ul path,.mvwl-a:hover .mvwl-ul path,.mvwl-a:focus-visible .mvwl-ul path{stroke-dashoffset:0}
.mvwl-ft>span,.mvwl-t>span{position:relative}
/* ruled rows */
.mvwl-list{list-style:none;margin:0;padding:0}
.mvwl-row{position:relative}
.mvwl-a{display:grid;grid-template-columns:36px 88px minmax(0,1fr) minmax(150px,auto) 44px;gap:clamp(16px,2vw,32px);align-items:center;padding:clamp(24px,2.4vw,36px) 0;text-decoration:none;color:inherit;outline-offset:4px}
.mvwl-no{font-size:12px;letter-spacing:.08em;color:var(--mv-mut)}
.mvwl-th{position:relative;display:block;width:88px;aspect-ratio:4/5;padding:4px;border-radius:3px;background:var(--mv-cloud);box-shadow:0 10px 20px -14px rgba(0,0,0,.4);rotate:-2deg;transition:rotate .5s cubic-bezier(.34,1.56,.64,1)}
.mvwl-th img{display:block;width:100%;height:100%;object-fit:cover;border-radius:2px;filter:invert(1) hue-rotate(180deg) sepia(.35) saturate(1.4) contrast(.9);transition:filter 1.4s cubic-bezier(.2,.8,.2,1)}
.mvwl-th::after{content:"";position:absolute;inset:4px;border-radius:2px;background:rgba(255,40,20,.18);mix-blend-mode:multiply;transition:opacity 1.2s ease;pointer-events:none}
.mvwl-a:hover .mvwl-th img,.mvwl-a:focus-visible .mvwl-th img{filter:none} .mvwl-a:hover .mvwl-th::after,.mvwl-a:focus-visible .mvwl-th::after{opacity:0} .mvwl-a:hover .mvwl-th,.mvwl-a:focus-visible .mvwl-th{rotate:0deg}
.mvwl-main{display:flex;flex-direction:column;align-items:flex-start;gap:8px}
.mvwl-t{position:relative;margin:0;font-size:clamp(24px,2.3vw,34px);line-height:1.05;letter-spacing:-.025em;font-stretch:112%;text-wrap:balance;padding-bottom:4px}
.mvwl-x{font-size:16px;line-height:1.5;color:var(--mv-mut);max-width:56ch}
.mvwl-meta{display:flex;flex-direction:column;align-items:flex-start;gap:8px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut);white-space:nowrap}
.mvwl-meta i{font-style:normal;padding:4px 8px;border-radius:4px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent);color:var(--mv-ink);transition:background .3s,box-shadow .3s}
.mvwl-go{display:grid;place-items:center;width:44px;height:44px;border-radius:10px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 22%,transparent);transition:background .35s,box-shadow .35s} .mvwl-go svg{transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.mvwl-a:hover .mvwl-go,.mvwl-a:focus-visible .mvwl-go{background:var(--mv-brass);box-shadow:none} .mvwl-a:hover .mvwl-go svg,.mvwl-a:focus-visible .mvwl-go svg{transform:rotate(-45deg)}
.mvwl-a:hover .mvwl-meta i,.mvwl-a:focus-visible .mvwl-meta i{background:color-mix(in srgb,var(--mv-brass) 45%,transparent);box-shadow:none}
/* newsletter: an index card */
.mvwl-nl{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(28px,4vw,72px);align-items:end;margin-top:clamp(80px,8vw,128px);padding:clamp(32px,3.6vw,56px);border-radius:10px;background:var(--mv-cloud);box-shadow:0 1px 0 color-mix(in srgb,var(--mv-ink) 8%,transparent),0 30px 60px -40px rgba(0,0,0,.3);background-image:linear-gradient(90deg,transparent calc(clamp(32px,3.6vw,56px) - 14px),color-mix(in srgb,var(--mv-brass) 70%,transparent) calc(clamp(32px,3.6vw,56px) - 14px),color-mix(in srgb,var(--mv-brass) 70%,transparent) calc(clamp(32px,3.6vw,56px) - 12px),transparent calc(clamp(32px,3.6vw,56px) - 12px))}
.mvwl-nlh{display:flex;flex-direction:column;align-items:flex-start;gap:16px}
.mvwl-nle{margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvwl-nlt{margin:0;font-size:16px;line-height:1.55;color:var(--mv-mut);max-width:44ch}
.mvwl-form{display:flex;flex-direction:column;gap:10px}
.mvwl-form label{font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.mvwl-row2{display:flex;gap:10px}
.mvwl-row2 input{flex:1;min-width:0;height:54px;padding:0 16px;border:0;border-radius:10px;background:var(--mv-bone);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 18%,transparent);color:var(--mv-ink);font:inherit;font-size:16px}
.mvwl-row2 input[aria-invalid=true]{box-shadow:inset 0 0 0 1.5px #C7372F}
.mvwl-sub{background:none;font-family:inherit;flex:none} .mvwl-sub[disabled]{opacity:.6;cursor:progress}
.mvwl-msg{margin:0;font-size:12px;letter-spacing:.06em;color:var(--mv-mut)} .mvwl-msg.is-err{color:#B42E27}
.mvwl-done{display:flex;align-items:center;gap:22px}
.mvwl-stamp{flex:none;display:grid;place-items:center;padding:14px 20px;border-radius:10px;border:2.5px solid var(--mv-ink);font-size:32px;letter-spacing:-.03em;font-stretch:115%;rotate:-6deg;background:var(--mv-brass);animation:mvwl-stamp .5s cubic-bezier(.34,1.56,.64,1) both}
@keyframes mvwl-stamp{from{scale:1.6;opacity:0}to{scale:1;opacity:1}}
.mvwl-done p{margin:0;font-size:16px;line-height:1.5;color:var(--mv-mut)}
/* tablet */
.mvwl.is-tab .mvwl-top{grid-template-columns:1fr;align-items:start}
.mvwl.is-tab .mvwl-a{grid-template-columns:72px minmax(0,1fr) auto 44px} .mvwl.is-tab .mvwl-no{display:none} .mvwl.is-tab .mvwl-th{width:72px}
.mvwl.is-tab .mvwl-nl{grid-template-columns:1fr;align-items:start}
/* phone */
.mvwl.is-ph{padding-top:112px}
.mvwl.is-ph .mvwl-top{grid-template-columns:1fr;gap:24px}
.mvwl.is-ph .mvwl-book{--gut:14px;--in:20px}
.mvwl.is-ph .mvwl-fa{grid-template-columns:1fr;gap:28px}
.mvwl.is-ph .mvwl-ft{font-size:32px}
.mvwl.is-ph .mvwl-a{grid-template-columns:64px minmax(0,1fr);grid-template-areas:"th main" "th meta";gap:10px 16px;align-items:start}
.mvwl.is-ph .mvwl-no,.mvwl.is-ph .mvwl-go{display:none} .mvwl.is-ph .mvwl-th{grid-area:th;width:64px} .mvwl.is-ph .mvwl-main{grid-area:main} .mvwl.is-ph .mvwl-meta{grid-area:meta;flex-direction:row;flex-wrap:wrap;align-items:center;white-space:normal}
.mvwl.is-ph .mvwl-t{font-size:22px} .mvwl.is-ph .mvwl-x{font-size:15px}
.mvwl.is-ph .mvwl-th img{filter:none} .mvwl.is-ph .mvwl-th::after{opacity:0}
.mvwl.is-ph .mvwl-nl{grid-template-columns:1fr;padding:28px 22px 28px 34px;background-image:linear-gradient(90deg,transparent 20px,color-mix(in srgb,var(--mv-brass) 70%,transparent) 20px,color-mix(in srgb,var(--mv-brass) 70%,transparent) 22px,transparent 22px)}
.mvwl.is-ph .mvwl-row2{flex-direction:column} .mvwl.is-ph .mvwl-sub{width:100%}
.mvwl.is-ph .mvwl-done{flex-direction:column;align-items:flex-start}
@media (prefers-reduced-motion:reduce){.mvwl .mv-it{background-size:100% 100%!important} .mvwl-th img{transition:none}}
`;
