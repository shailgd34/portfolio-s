"use client";

import React, {
  useEffect,
  useLayoutEffect,
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
  onTick,
  clamp01,
  rise,
  RS,
  plainOf,
  Eyebrow,
  Head,
  IcoArrow,
  Glyph,
  Btn,
  CSS_BASE,
  CSS_MOTION,
} from "./scaffold";
import { siteData, defaultProjects } from "./siteData";

const WI_FILM = "#0E0D0C";
const WI_EDGE = "#F2923A";
const WI_LIGHT = "#FFF1DA";
const WI_HOLE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='26'><rect x='6' y='7' width='10' height='12' rx='2.5'/></svg>")`;

const wiCat = (r) =>
  String((r && r.f3) || "")
    .split("·")[0]
    .trim();

const wiPad = (n) => String(n).padStart(2, "0");

const WI_AR = [
  ["16/10", "16/10"],
  ["16/10", "16/10"],
];

const imgOr = (r, k = "img") => (r && r[k]) || (r && r.f6) || "";

export default function MvWorkIndex(props = {}) {
  const {
    eyebrow = "ROLL 07 — {count} projects",
    heading = "Every *frame*,|in order.",
    intro = "Filter by the kind of work, or switch to the list if you know what you're looking for.",
    filterLabel = "Show",
    allLabel = "All",
    viewLabel = "View",
    sheetLabel = "Sheet",
    listLabel = "List",
    defaultView = "sheet",
    tableLabel = "Light table · Roll 07",
    tableNote = `{count} exposures · ${siteData.name}`,
    counterLabel = "Exposed",
    filmEdge = "SB 400TX",
    roleLabel = "Role",
    openLabel = "Open case",
    colNo = "No.",
    colTitle = "Project",
    colClient = "Client",
    colCategory = "Category",
    colYear = "Year",
    emptyText = "No projects on this roll yet.",
    bpHint = "auto",
    projects: passedProjects,
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();

  const root = useRef(null);
  const board = useRef(null);
  const bar = useRef(null);
  const loupe = useRef(null);
  const tools = useRef(null);

  const { w } = useSize(root, bpHint);
  const phone = w < 810;
  const tab = w >= 810 && w < 1100;

  const on = useOn(root, live, rm, 0.06);
  useMagnet(root, live);

  const rows = passedProjects || defaultProjects;

  const ORDERED_CATS = ['UI/UX', 'WordPress', 'React / Next', 'Mobile App'];
  const rawCats = [];
  rows.forEach((r) => {
    const k = wiCat(r);
    if (k && !rawCats.includes(k)) rawCats.push(k);
  });
  const cats = ORDERED_CATS.filter((c) => rawCats.includes(c)).concat(
    rawCats.filter((c) => !ORDERED_CATS.includes(c))
  );

  const [flt, setFlt] = useState("");
  const act = flt && cats.includes(flt) ? flt : "";
  const [view, setView] = useState(defaultView === "list" ? "list" : "sheet");

  const items = rows
    .map((r, i) => ({ r, i }))
    .filter((x) => !act || wiCat(x.r) === act);

  const N = items.length;
  const anim = live && !rm && !still;
  const dfw = props.customFonts ? D.fontWeight : "var(--mv-font-dw, 720)";

  // ---- exposure: every [data-x] element gets --ex 0 -> 1 as it enters ----
  useEffect(() => {
    const bd = board.current;
    if (!anim || !bd) return;
    let vis = true;
    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: "20% 0px 20% 0px" }
    );
    io.observe(bd);

    let els = [];
    let tops = [];
    let hs = [];
    let cur = [];
    let put = [];

    const measure = () => {
      els = Array.from(bd.querySelectorAll("[data-x]"));
      tops = els.map((e) => {
        let y = 0;
        let n = e;
        while (n && n !== bd) {
          y += n.offsetTop;
          n = n.offsetParent;
        }
        return y;
      });
      hs = els.map((e) => e.offsetHeight || 1);
      cur = els.map((e) => parseFloat(e.style.getPropertyValue("--ex")) || 0);
      put = cur.slice();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(bd);
    const mo = new MutationObserver(() => measure());
    mo.observe(bd, { childList: true, subtree: true });

    let bt = 0;
    let vh = 1;
    let fresh = false;
    let lastK = -1;
    let lastM = -1;

    const read = () => {
      if (!vis) {
        fresh = false;
        return;
      }
      bt = bd.getBoundingClientRect().top;
      vh = window.innerHeight || 1;
      fresh = true;
    };

    const off = onTick(() => {
      if (!fresh || !els.length) return;
      let k = 0;
      let sum = 0;
      for (let i = 0; i < els.length; i++) {
        const t = clamp01(
          (vh * 0.96 - (bt + tops[i])) / (Math.min(hs[i], vh * 0.55) * 0.95)
        );
        cur[i] += (t - cur[i]) * 0.16;
        if (Math.abs(t - cur[i]) < 0.002) cur[i] = t;
        if (
          Math.abs(cur[i] - put[i]) > 0.003 ||
          (cur[i] === t && put[i] !== t)
        ) {
          put[i] = cur[i];
          els[i].style.setProperty("--ex", cur[i].toFixed(3));
        }
        if (cur[i] > 0.6) k++;
        sum += cur[i];
      }
      const b = bar.current;
      if (b) {
        if (k !== lastK) {
          lastK = k;
          const nb = b.querySelector("b");
          if (nb) nb.textContent = wiPad(k);
        }
        const m = Math.round((sum / els.length) * 100) / 100;
        if (m !== lastM) {
          lastM = m;
          b.style.setProperty("--m", String(m));
        }
      }
    }, read);

    return () => {
      off();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
    };
  }, [anim, view]);

  // ---- FLIP animation when filter category changes ----
  const snap = useRef(null);
  const choose = (k) => {
    if (k === act) return;
    const bd = board.current;
    if (bd && anim) {
      const m = new Map();
      bd.querySelectorAll("[data-k]").forEach((e) =>
        m.set(e.dataset.k || "", e.getBoundingClientRect())
      );
      snap.current = m;
    }
    setFlt(k);
    const tb = tools.current;
    if (tb && live) {
      const t = tb.getBoundingClientRect().top;
      if (t < 0) {
        const y = window.scrollY + t - 110;
        const L = typeof window !== "undefined" ? window.__ltLenis : null;
        if (L && L.scrollTo) L.scrollTo(y, { duration: 0.9 });
        else
          window.scrollTo({
            top: y,
            behavior: rm ? "auto" : "smooth",
          });
      }
    }
  };

  useLayoutEffect(() => {
    const m = snap.current;
    snap.current = null;
    const bd = board.current;
    if (!m || !bd) return;
    let j = 0;
    bd.querySelectorAll("[data-k]").forEach((e) => {
      const o = m.get(e.dataset.k || "");
      const n = e.getBoundingClientRect();
      if (o) {
        const dx = o.left - n.left;
        const dy = o.top - n.top;
        if (Math.abs(dx) + Math.abs(dy) > 1 && e.animate) {
          e.animate(
            [
              { transform: `translate(${dx}px,${dy}px)` },
              { transform: "translate(0,0)" },
            ],
            { duration: 760, easing: "cubic-bezier(.2,.8,.2,1)" }
          );
        }
      } else if (e.animate) {
        e.animate(
          [
            {
              opacity: 0,
              transform: "translateY(28px) scale(.97)",
            },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 650,
            delay: 90 + j++ * 70,
            easing: "cubic-bezier(.2,.8,.2,1)",
            fill: "backwards",
          }
        );
      }
    });
  }, [act]);

  const pickView = (v) => {
    if (v === view) return;
    setView(v);
    const bd = board.current;
    if (bd && anim && bd.animate) {
      window.requestAnimationFrame(() => {
        try {
          bd.animate(
            [
              { opacity: 0, transform: "translateY(16px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
          );
        } catch (e) { }
      });
    }
  };

  // ---- sheet hover: the studio light follows the pointer over a frame ----
  const hov = (e) => {
    if (e.pointerType !== "mouse") return;
    const win = e.target.closest?.(".mvwi-win");
    if (!win) return;
    const r = win.getBoundingClientRect();
    win.style.setProperty(
      "--hx",
      `${Math.round(((e.clientX - r.left) / r.width) * 100)}%`
    );
    win.style.setProperty(
      "--hy",
      `${Math.round(((e.clientY - r.top) / r.height) * 100)}%`
    );
  };

  // ---- list loupe: lens that follows the pointer and previews image ----
  const [li, setLi] = useState(-1);
  const seen = useRef(new Set());
  useEffect(() => {
    const bd = board.current;
    const L = loupe.current;
    if (
      !live ||
      view !== "list" ||
      !bd ||
      !L ||
      !window.matchMedia("(hover:hover) and (pointer:fine)").matches
    )
      return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let lx = 0;
    let on2 = false;
    let first = true;
    let cur = -1;
    let W = 1;
    let still2 = 0;

    const mv = (e) => {
      const r = bd.getBoundingClientRect();
      W = r.width;
      const row = e.target.closest?.("[data-i]");
      if (!row) {
        if (on2) {
          on2 = false;
          L.classList.remove("is-on");
        }
        return;
      }
      const i = Number(row.dataset.i);
      if (i !== cur) {
        cur = i;
        seen.current.add(i);
        setLi(i);
      }
      const S = L.offsetWidth || 220;
      tx = Math.min(W - S - 8, Math.max(8, e.clientX - r.left + 36));
      ty = e.clientY - r.top - S * 0.72;
      lx = ((e.clientX - r.left) / W - 0.5) * 2;
      if (!on2) {
        on2 = true;
        L.classList.add("is-on");
        if (first || rm) {
          x = tx;
          y = ty;
          first = false;
        }
      }
      still2 = 0;
    };

    const lv = () => {
      on2 = false;
      cur = -1;
      L.classList.remove("is-on");
      setLi(-1);
    };

    bd.addEventListener("pointermove", mv);
    bd.addEventListener("pointerleave", lv);

    const off = onTick(() => {
      if (!on2 && still2 > 40) return;
      still2++;
      const k = rm ? 1 : 0.2;
      x += (tx - x) * k;
      y += (ty - y) * k;
      L.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      L.style.setProperty("--lx", lx.toFixed(3));
    });

    return () => {
      off();
      bd.removeEventListener("pointermove", mv);
      bd.removeEventListener("pointerleave", lv);
    };
  }, [live, view, rm]);

  const cols = phone
    ? [items.map((x, n) => ({ ...x, n }))]
    : [
      items.map((x, n) => ({ ...x, n })).filter((x) => x.n % 2 === 0),
      items.map((x, n) => ({ ...x, n })).filter((x) => x.n % 2 === 1),
    ];

  const cnt = (s) => String(s || "").replace(/\{count\}/g, String(rows.length));
  const count = (k) => rows.filter((r) => wiCat(r) === k).length;

  return (
    <section
      ref={root}
      className={`mv mv-sec mv-dark mvwi${phone ? " is-ph" : tab ? " is-tab" : ""}${on ? " is-on" : ""}${anim ? " is-anim" : " is-final"}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
      aria-label={plainOf(heading) || plainOf(cnt(eyebrow))}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_WI + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvwi-top">
          <div className="mvwi-hl">
            <Eyebrow text={cnt(eyebrow)} on={on} M={M} />
            {heading && (
              <Head
                text={heading}
                on={on}
                D={D}
                size="clamp(36px,3.6vw,56px)"
                lh={0.95}
                delay={100}
                style={{ fontWeight: dfw, fontStretch: "115%" }}
              />
            )}
          </div>
          {intro && (
            <p className="mvwi-intro" style={rise(on, 300, 12)}>
              {intro}
            </p>
          )}
        </header>

        <div
          ref={tools}
          className="mvwi-tools"
          style={{ ...M, ...rise(on, 380, 12) }}
        >
          {cats.length > 1 && (
            <div
              className="mvwi-chips"
              role="group"
              aria-label={filterLabel}
              onFocus={(e) => {
                if (!phone) return;
                try {
                  e.target.scrollIntoView({
                    block: "nearest",
                    inline: "nearest",
                  });
                } catch (x) { }
              }}
            >
              <span className="mvwi-tl" aria-hidden>
                {filterLabel}
              </span>
              <button
                type="button"
                className="mvwi-chip"
                aria-pressed={!act}
                onClick={() => choose("")}
              >
                {allLabel}
                <sup>{wiPad(rows.length)}</sup>
              </button>
              {cats.map((k) => (
                <button
                  key={k}
                  type="button"
                  className="mvwi-chip"
                  aria-pressed={act === k}
                  onClick={() => choose(k)}
                >
                  {k}
                  <sup>{wiPad(count(k))}</sup>
                </button>
              ))}
            </div>
          )}

          {rows.length > 0 && (
            <div className="mvwi-view" role="group" aria-label={viewLabel}>
              <button
                type="button"
                aria-pressed={view === "sheet"}
                onClick={() => pickView("sheet")}
              >
                <svg viewBox="0 0 16 16" aria-hidden>
                  <rect x="1.5" y="1.5" width="7" height="6" rx="1" />
                  <rect x="10.5" y="1.5" width="4" height="8" rx="1" />
                  <rect x="1.5" y="9.5" width="7" height="5" rx="1" />
                  <rect x="10.5" y="11.5" width="4" height="3" rx="1" />
                </svg>
                {sheetLabel}
              </button>
              <button
                type="button"
                aria-pressed={view === "list"}
                onClick={() => pickView("list")}
              >
                <svg viewBox="0 0 16 16" aria-hidden>
                  <path d="M1.5 3.5h13M1.5 8h13M1.5 12.5h13" />
                </svg>
                {listLabel}
              </button>
            </div>
          )}
        </div>

        <div
          ref={board}
          className={`mvwi-board is-${view}`}
          onPointerMove={view === "sheet" ? hov : undefined}
        >
          {N > 0 && view === "sheet" && (
            <div className="mvwi-mw" aria-hidden>
              <div
                ref={bar}
                className="mvwi-meter"
                style={{ ...M, "--m": anim ? 0 : 1 }}
              >
                <span>{counterLabel}</span>
                <span className="mvwi-mn">
                  <b>{wiPad(anim ? 0 : N)}</b> / {wiPad(N)}
                </span>
                <i />
              </div>
            </div>
          )}

          {N === 0 && (
            <p className="mvwi-empty" style={M}>
              {emptyText}
            </p>
          )}

          {N > 0 && view === "sheet" && (
            <div className="mvwi-table">
              <p className="mvwi-note" style={M} aria-hidden>
                <span>{tableLabel}</span>
                <span>{cnt(tableNote)}</span>
              </p>
              <div className="mvwi-cols">
                {cols.map((col, ci) =>
                  col.length === 0 ? null : (
                    <div key={ci} className={`mvwi-col is-c${ci}`}>
                      <i className="mvwi-lane is-l" aria-hidden />
                      <i className="mvwi-lane is-r" aria-hidden />
                      {col.map(({ r, i, n }, j) => {
                        const ar = "16/10";
                        const im = RS(
                          imgOr(r),
                          phone
                            ? "100vw"
                            : ci === 0
                              ? "(max-width: 1099px) 55vw, 52vw"
                              : "(max-width: 1099px) 40vw, 38vw"
                        );
                        return (
                          <div
                            key={r.slug || i}
                            data-k={r.slug || String(i)}
                            className={`mvwi-cell${r.isLogo || wiCat(r) === 'Logos' ? ' is-logo' : ''}`}
                          >
                            <div
                              className="mvwi-fr"
                              data-x
                              style={{ "--ar": ar }}
                            >
                              <span className="mvwi-edge" aria-hidden>
                                <em>{wiPad(i + 1)}A ▸</em>
                                <em>
                                  {filmEdge} {i + 1}
                                </em>
                              </span>
                              <a
                                className="mvwi-win"
                                href={`/work/${r.slug || ""}`}
                                aria-label={`View ${r.f1 || "project"} case study`}
                              >
                                <img
                                  src={im.src}
                                  srcSet={im.srcSet}
                                  sizes={im.sizes}
                                  alt=""
                                  loading={n < 2 ? "eager" : "lazy"}
                                  decoding="async"
                                  draggable={false}
                                />
                                <i className="mvwi-dk" aria-hidden />
                                <i className="mvwi-sw" aria-hidden />
                                <i className="mvwi-key" aria-hidden />
                                <span className="mvwi-no" aria-hidden>
                                  {wiPad(i + 1)}A
                                </span>
                                <span className="mvwi-open" aria-hidden>
                                  {openLabel}
                                  <Glyph />
                                </span>
                              </a>
                              <span className="mvwi-cap">
                                <span className="mvwi-cl">
                                  <a
                                    href={`/work/${r.slug || ""}`}
                                    className="mvwi-t-link"
                                  >
                                    <h2
                                      className="mvwi-t"
                                      style={{
                                        ...D,
                                        fontWeight: dfw,
                                      }}
                                    >
                                      {r.f1}
                                    </h2>
                                  </a>
                                  <span className="mvwi-m">
                                    {[r.f2, r.f4].filter(Boolean).join(" · ")}
                                  </span>
                                </span>
                                <span className="mvwi-cr">
                                  {(r.f10 || r.figmaLink) && (
                                    <span className="mvwi-actions">
                                      {r.f10 && (
                                        <span className="mvwi-out">{r.f10}</span>
                                      )}
                                      {r.figmaLink && (
                                        <Btn
                                          href={r.figmaLink}
                                          label="Figma Prototype"
                                          kind="ghost"
                                          className="mv-quiet"
                                          arrow={true}
                                          sub="Prototype"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                        />
                                      )}
                                    </span>
                                  )}
                                </span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <span className="mvwi-tail" aria-hidden>
                        <em>
                          {wiPad(
                            col.length ? col[col.length - 1].i + 1 : 0
                          )}
                          A ◂ {filmEdge}
                        </em>
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {N > 0 && view === "list" && (
            <div className="mvwi-list">
              <div className="mvwi-lh" aria-hidden>
                <span>{colNo}</span>
                <span>{colTitle}</span>
                <span>{colClient}</span>
                <span>{colCategory}</span>
                <span>{colYear}</span>
                <span />
              </div>
              <ul>
                {items.map(({ r, i }) => (
                  <li key={r.slug || i} data-k={r.slug || String(i)}>
                    <a
                      className="mvwi-row"
                      href={`/work/${r.slug || ""}`}
                      data-i={i}
                      data-x
                    >
                      <span className="mvwi-rn">{wiPad(i + 1)}</span>
                      <h2
                        className="mvwi-rt"
                        style={{
                          ...D,
                          fontWeight: dfw,
                        }}
                      >
                        <span>{r.f1}</span>
                      </h2>
                      <span className="mvwi-rc">{r.f2}</span>
                      <span className="mvwi-rk">{r.f3}</span>
                      <span className="mvwi-ry">{r.f4}</span>
                      <span className="mvwi-ra" aria-hidden>
                        <IcoArrow s={16} />
                      </span>
                      <i className="mvwi-rl" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
              <div ref={loupe} className="mvwi-lp" aria-hidden>
                <span className="mvwi-lg">
                  {rows.map((r, i) =>
                    seen.current.has(i) || i === li ? (
                      <i
                        key={r.slug || i}
                        className={i === li ? "is-a" : ""}
                        style={{
                          backgroundImage: `url("${RS(imgOr(r), "480px").src}")`,
                        }}
                      />
                    ) : null
                  )}
                </span>
                <b style={M}>
                  {li >= 0 && rows[li]
                    ? `${wiPad(li + 1)}A · ${rows[li].f1 || ""}`
                    : ""}
                </b>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const CSS_WI = `
.mvwi{background:var(--mv-night);color:var(--mv-cloud);padding:clamp(72px,8vw,128px) 0 clamp(88px,9vw,140px);--hair:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--lane:clamp(26px,2.4vw,34px)}
.mvwi .mv-eb{border-radius:4px;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:6px 10px 6px 9px} .mvwi .mv-eb i{border-radius:1px}
.mvwi .mv-hd{margin-top:18px} .mvwi .mv-it{color:var(--mv-brass);font-weight:inherit}
.mvwi-top{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-bottom:clamp(32px,3.4vw,48px)}
.mvwi-intro{margin:0;max-width:380px;font-size:16px;line-height:1.55;color:var(--mv-mut)}
/* toolbar: category chips + view switch */
.mvwi-tools{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;padding:14px 0;border-top:1px solid var(--hair);margin-bottom:clamp(20px,2vw,28px)}
.mvwi-chips{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.mvwi-tl,.mvwi-view{font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.mvwi-tl{margin-right:6px;color:var(--mv-mut)}
.mvwi-chip{appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:flex-start;gap:5px;min-height:38px;padding:11px 13px 9px;border-radius:10px;background:transparent;color:var(--mv-cloud);font:inherit;font-size:12px;letter-spacing:.08em;text-transform:uppercase;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 20%,transparent);transition:background .3s,color .3s,box-shadow .3s}
.mvwi-chip sup{font-size:12px;line-height:1;opacity:.6;letter-spacing:.04em;margin-top:-2px}
.mvwi-chip:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 55%,transparent)}
.mvwi-chip[aria-pressed="true"]{background:var(--mv-brass);color:var(--mv-ink);box-shadow:none} .mvwi-chip[aria-pressed="true"] sup{opacity:1}
.mvwi-view{flex:none;display:flex;gap:2px;padding:3px;border-radius:10px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 20%,transparent)}
.mvwi-view button{appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;min-height:34px;padding:0 12px;border-radius:7px;background:transparent;color:var(--mv-mut);font:inherit;letter-spacing:inherit;text-transform:inherit;transition:background .3s,color .3s}
.mvwi-view svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.4}
.mvwi-view button:hover{color:var(--mv-cloud)} .mvwi-view button[aria-pressed="true"]{background:var(--mv-cloud);color:var(--mv-ink)}
/* the board + the exposure meter (sticky corner) */
.mvwi-board{position:relative}
.mvwi-mw{position:sticky;z-index:8;top:92px;height:0}
.mvwi-meter{position:absolute;right:clamp(12px,1.6vw,22px);top:12px;display:grid;grid-template-columns:auto auto;align-items:baseline;column-gap:14px;row-gap:7px;padding:9px 12px 10px;border-radius:8px;background:${WI_FILM};-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 16%,transparent);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvwi-mn{color:var(--mv-cloud);font-variant-numeric:tabular-nums} .mvwi-mn b{font-weight:500;color:${WI_LIGHT}}
.mvwi-meter i{grid-column:1 / -1;display:block;height:2px;background:color-mix(in srgb,var(--mv-cloud) 16%,transparent);position:relative;overflow:hidden}
.mvwi-meter i::after{content:"";position:absolute;inset:0;background:var(--mv-brass);transform-origin:0 50%;scale:var(--m,1) 1}
.mvwi-empty{margin:0;padding:48px 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut);border-top:1px solid var(--hair)}
/* the light table: a warm glowing surface, the strips lie on it */
.mvwi-table{position:relative;padding:clamp(14px,1.8vw,26px);border-radius:6px;background:radial-gradient(90% 70% at 50% 35%,#FFF8EC,${WI_LIGHT} 45%,#EBD2A8);box-shadow:0 0 0 1px rgba(255,241,218,.25),0 0 80px -10px rgba(255,226,180,.28),0 40px 80px -40px rgba(0,0,0,.8)}
.mvwi-note{position:absolute;z-index:1;right:calc(clamp(14px,1.8vw,26px) + 18px);top:clamp(64px,5vw,72px);width:calc(42% - 60px);margin:0;display:flex;flex-direction:column;gap:6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#3A2E1E}
.mvwi-note span:first-child{font-size:12.5px;letter-spacing:.1em;color:#1A140C;padding-bottom:6px;border-bottom:1px solid rgba(58,46,30,.3)}
.mvwi-cols{position:relative;z-index:2;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(20px,2.4vw,36px);align-items:stretch}
.mvwi-col{position:relative;display:flex;flex-direction:column;gap:16px;padding:16px var(--lane);background:${WI_FILM};border-radius:2px;box-shadow:0 12px 26px -12px rgba(60,40,10,.55)}
.mvwi-col.is-c1{margin-top:0}
.mvwi-tail{position:relative;flex:1 1 0;min-height:0;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;background:repeating-linear-gradient(180deg,transparent 0 120px,color-mix(in srgb,var(--mv-cloud) 5%,transparent) 120px 121px)} .mvwi-tail em{font:500 12px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;font-style:normal;letter-spacing:.14em;color:${WI_EDGE};opacity:.85;padding:8px 0}
.mvwi-lane{position:absolute;top:0;bottom:0;width:var(--lane);background:${WI_LIGHT};-webkit-mask:${WI_HOLE} center 0/22px 26px repeat-y;mask:${WI_HOLE} center 0/22px 26px repeat-y;opacity:.92}
.mvwi-lane.is-l{left:0} .mvwi-lane.is-r{right:0}
.mvwi-cell{position:relative}
.mvwi-fr{--ex:1;position:relative;display:flex;flex-direction:column;gap:10px;padding-bottom:18px;text-decoration:none;color:inherit;outline-offset:4px;border-bottom:1px solid color-mix(in srgb,var(--mv-cloud) 7%,transparent)}
.mvwi.is-anim .mvwi-fr{--ex:0}
.mvwi-col .mvwi-cell:last-child .mvwi-fr{border-bottom:0;padding-bottom:6px}
.mvwi-edge{display:flex;justify-content:space-between;gap:12px;font:500 12px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.12em;color:${WI_EDGE};opacity:calc(.8 + var(--ex) * .2)} .mvwi-edge em{font-style:normal}
.mvwi-win{position:relative;display:block;aspect-ratio:var(--ar,16/10);border-radius:3px;overflow:hidden;background:#141210;isolation:isolate}
.mvwi-win img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;scale:calc(1.04 - var(--ex) * .04);transition:scale .9s cubic-bezier(.2,.8,.2,1),filter .6s;user-select:none}
.mvwi-cell.is-logo .mvwi-win{background:#0e0d0c}
.mvwi-cell.is-logo .mvwi-win img{object-fit:contain;padding:clamp(16px,2.4vw,28px);scale:1;background:rgba(255,255,255,0.02)}
/* under-exposure: the frame starts almost black and brightens; a band of studio light passes over it while it is exposed */
.mvwi-dk{position:absolute;inset:0;z-index:1;background:radial-gradient(120% 90% at 50% 40%,rgba(8,7,6,.78),rgba(8,7,6,.94));opacity:calc((1 - var(--ex)) * .55);pointer-events:none}
.mvwi-sw{position:absolute;z-index:2;top:-20%;bottom:-20%;left:0;width:55%;background:linear-gradient(90deg,transparent,rgba(255,226,180,.18) 30%,rgba(255,241,218,.62) 50%,rgba(255,226,180,.18) 70%,transparent);mix-blend-mode:screen;transform:translate3d(calc(-110% + var(--ex) * 300%),0,0) skewX(-16deg);opacity:calc(var(--ex) * (1 - var(--ex)) * 4);pointer-events:none}
.mvwi-key{position:absolute;inset:0;z-index:2;background:radial-gradient(38% 38% at var(--hx,50%) var(--hy,40%),rgba(255,236,208,.5),transparent 70%);mix-blend-mode:soft-light;opacity:0;transition:opacity .4s;pointer-events:none}
.mvwi-no{position:absolute;z-index:3;left:10px;top:10px;padding:4px 7px;border-radius:4px;background:color-mix(in srgb,${WI_FILM} 70%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font:500 12px/1.2 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.1em;color:var(--mv-cloud)}
.mvwi-open{position:absolute;z-index:3;right:10px;bottom:10px;display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:6px;background:var(--mv-brass);color:var(--mv-ink);font:500 12px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;opacity:0;translate:0 8px;transition:opacity .3s,translate .45s cubic-bezier(.2,.8,.2,1)} .mvwi-open svg{width:13px;height:13px}
.mvwi-fr:hover .mvwi-win img,.mvwi-fr:focus-visible .mvwi-win img{scale:1.035}
.mvwi-fr:hover .mvwi-key{opacity:1} .mvwi-fr:hover .mvwi-open,.mvwi-fr:focus-visible .mvwi-open{opacity:1;translate:0 0}
.mvwi-cap{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:16px 18px 14px;background:rgba(20,18,16,.65);border:1px solid rgba(255,241,218,.08);border-radius:8px;margin-top:8px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:calc(.8 + var(--ex) * .2);translate:0 calc((1 - var(--ex)) * 10px);transition:background .3s,border-color .3s}
.mvwi-fr:hover .mvwi-cap{background:rgba(28,25,22,.85);border-color:rgba(255,241,218,.16)}
.mvwi-cl{display:flex;flex-direction:column;gap:8px;min-width:0}
.mvwi-t-link{text-decoration:none!important;color:inherit;display:inline-block;outline:none}
.mvwi-t-link:hover .mvwi-t{color:var(--mv-brass)}
.mvwi-t{margin:0;font-size:clamp(20px,1.9vw,28px);line-height:1.1;letter-spacing:-.03em;font-stretch:115%;text-decoration:none!important;transition:color .25s ease;overflow-wrap:break-word;word-break:break-word}
.mvwi-m{font:400 12px/1.3 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvwi-cr{display:flex;align-items:center;justify-content:flex-end}
.mvwi-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.mvwi-out{display:inline-flex;align-items:center;padding:7px 11px;border-radius:6px;background:var(--mv-brass);color:var(--mv-ink);font:600 11px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase}
/* LIST: an index table; the loupe follows the pointer */
.mvwi-list{position:relative}
.mvwi-lh,.mvwi-row{display:grid;grid-template-columns:64px minmax(0,1.5fr) minmax(0,1fr) minmax(0,1.1fr) 70px 40px;align-items:center;column-gap:20px}
.mvwi-lh{padding:0 0 12px;font:400 12px/1 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut);border-bottom:1px solid var(--hair)}
.mvwi-list ul{list-style:none;margin:0;padding:0}
.mvwi-list li{position:relative}
.mvwi-row{--ex:1;position:relative;padding:22px 0;text-decoration:none;color:inherit;border-bottom:1px solid var(--hair);outline-offset:-3px;opacity:calc(.8 + var(--ex) * .2);transition:background .35s}
.mvwi.is-anim .mvwi-row{--ex:0}
.mvwi-rl{position:absolute;left:0;bottom:-1px;height:1px;width:100%;background:linear-gradient(90deg,transparent,${WI_LIGHT},transparent);transform-origin:0 50%;scale:var(--ex) 1;opacity:calc(var(--ex) * (1 - var(--ex)) * 4 + .0)}
.mvwi-rn,.mvwi-rc,.mvwi-rk,.mvwi-ry{font:400 12px/1.3 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase}
.mvwi-rn{color:var(--mv-mut);transition:color .3s} .mvwi-rc{color:color-mix(in srgb,var(--mv-cloud) 86%,transparent)} .mvwi-rk,.mvwi-ry{color:var(--mv-mut)}
.mvwi-rt{margin:0;font-size:clamp(28px,2.8vw,44px);line-height:1;letter-spacing:-.04em;font-stretch:115%}
.mvwi-rt span{display:inline-block;transition:translate .5s cubic-bezier(.2,.8,.2,1),color .3s}
.mvwi-ra{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;box-shadow:inset 0 0 0 1px var(--hair);transition:background .3s,color .3s} .mvwi-ra svg{transition:rotate .45s cubic-bezier(.2,.8,.2,1)}
.mvwi-row:hover,.mvwi-row:focus-visible{background:linear-gradient(90deg,color-mix(in srgb,var(--mv-cloud) 6%,transparent),transparent 70%)}
.mvwi-row:hover .mvwi-rn,.mvwi-row:focus-visible .mvwi-rn{color:var(--mv-brass)} .mvwi-row:hover .mvwi-rt span,.mvwi-row:focus-visible .mvwi-rt span{translate:14px 0;color:${WI_LIGHT}}
.mvwi-row:hover .mvwi-ra,.mvwi-row:focus-visible .mvwi-ra{background:var(--mv-brass);color:var(--mv-ink);box-shadow:none} .mvwi-row:hover .mvwi-ra svg,.mvwi-row:focus-visible .mvwi-ra svg{rotate:-45deg}
.mvwi-lp{position:absolute;z-index:9;left:0;top:0;width:clamp(180px,17vw,250px);pointer-events:none;opacity:0;scale:.5;transition:opacity .25s,scale .45s cubic-bezier(.34,1.56,.64,1);will-change:transform}
.mvwi-lp.is-on{opacity:1;scale:1}
.mvwi-lg{position:relative;display:block;aspect-ratio:1;border-radius:50%;overflow:hidden;background:${WI_FILM};box-shadow:0 0 0 6px color-mix(in srgb,${WI_FILM} 92%,transparent),0 0 0 7px color-mix(in srgb,var(--mv-cloud) 30%,transparent),0 30px 50px -14px rgba(0,0,0,.7)}
.mvwi-lg i{position:absolute;inset:-12%;background-size:cover;background-position:center;opacity:0;transform:translate3d(calc(var(--lx,0) * -5%),0,0) scale(1.08);transition:opacity .35s}
.mvwi-lg i.is-a{opacity:1}
.mvwi-lg::after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 24%,rgba(255,241,218,.4),transparent 36%),radial-gradient(circle at 50% 50%,transparent 58%,rgba(0,0,0,.45));pointer-events:none}
.mvwi-lp b{display:block;width:max-content;max-width:100%;margin:14px auto 0;padding:5px 8px;border-radius:5px;background:${WI_FILM};text-align:center;font-weight:500;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${WI_LIGHT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* tablet */
.mvwi.is-tab .mvwi-top{flex-direction:column;align-items:flex-start;gap:20px}
.mvwi.is-tab .mvwi-lh,.mvwi.is-tab .mvwi-row{grid-template-columns:48px minmax(0,1.4fr) minmax(0,1fr) 60px 36px} .mvwi.is-tab .mvwi-lh span:nth-child(4),.mvwi.is-tab .mvwi-rk{display:none}
.mvwi.is-tab .mvwi-cap{flex-direction:column;gap:12px} .mvwi.is-tab .mvwi-cr{align-items:flex-start;text-align:left;max-width:none}
.mvwi.is-tab .mvwi-note{width:calc(42% - 50px)}
/* phone: one strip */
.mvwi.is-ph{--lane:16px}
.mvwi.is-ph .mvwi-top{flex-direction:column;align-items:flex-start;gap:18px}
.mvwi.is-ph .mvwi-tools{flex-direction:column;gap:14px}
.mvwi.is-ph .mvwi-chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:-4px -20px;padding:6px 20px;scroll-padding-inline:20px;-webkit-overflow-scrolling:touch} .mvwi.is-ph .mvwi-chips::-webkit-scrollbar{display:none} .mvwi.is-ph .mvwi-chip{flex:none} .mvwi.is-ph .mvwi-tools{align-items:stretch} .mvwi.is-ph .mvwi-tl{flex:none;margin:0 4px 0 0} .mvwi.is-ph .mvwi-view{align-self:flex-start}
.mvwi.is-ph .mvwi-cols{grid-template-columns:1fr}
.mvwi.is-ph .mvwi-table{padding:12px 6px;margin:0}
.mvwi.is-ph .mvwi-table{padding-top:64px} .mvwi.is-ph .mvwi-note{left:14px;right:auto;top:14px;width:auto;font-size:12px;gap:4px} .mvwi.is-ph .mvwi-note span:first-child{padding:0;border:0;font-size:12px}
.mvwi.is-ph .mvwi-cap{flex-direction:column;gap:12px;padding:14px} .mvwi.is-ph .mvwi-cr{align-items:flex-start;text-align:left;max-width:none}
.mvwi.is-ph .mvwi-t{font-size:clamp(19px,5vw,25px)}
.mvwi.is-ph .mvwi-mw{top:74px} .mvwi.is-ph .mvwi-meter{right:10px;top:70px}
.mvwi.is-ph .mvwi-lh{display:none}
.mvwi.is-ph .mvwi-row{grid-template-columns:34px minmax(0,1fr) 34px;grid-template-areas:"n t a" "n m a";row-gap:6px;padding:18px 0}
.mvwi.is-ph .mvwi-rn{grid-area:n;align-self:start;padding-top:6px} .mvwi.is-ph .mvwi-rt{grid-area:t;font-size:24px} .mvwi.is-ph .mvwi-rc{grid-area:m;font-size:12px} .mvwi.is-ph .mvwi-rk,.mvwi.is-ph .mvwi-ry{display:none} .mvwi.is-ph .mvwi-ra{grid-area:a;width:34px;height:34px}
.mvwi.is-ph .mvwi-lp{display:none}
@media (max-width:960px){
  .mvwi-cols{grid-template-columns:1fr!important;gap:24px!important}
  .mvwi-cap{flex-direction:column!important;align-items:stretch!important;gap:14px!important;padding:14px!important}
  .mvwi-cr{justify-content:flex-start!important;width:100%!important}
  .mvwi-actions{justify-content:flex-start!important;width:100%!important}
}
@media (max-width:640px){
  .mvwi-table{padding:12px 6px!important;margin:0!important;max-width:100%!important}
  .mvwi-col{padding:14px 10px!important}
  .mvwi-t{font-size:clamp(19px,5vw,24px)!important}
  .mvwi-open{display:none}
}
@media (hover:none){.mvwi-lp{display:none}}
@media (prefers-reduced-motion:reduce){.mvwi-fr,.mvwi-row{--ex:1!important} .mvwi-sw{display:none}}
`;
