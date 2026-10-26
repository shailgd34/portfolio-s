'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { siteData } from './siteData';

export const FONTS =
  'https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wdth,wght@0,75..125,200..900;1,75..125,200..900&family=Chivo+Mono:ital,wght@0,300..600;1,300..600&display=swap';

// Token-safe alpha: color-mix keeps palette flip working
export const A = (c, a) =>
  `color-mix(in srgb, ${c} ${Math.max(0.4, Math.round(a * 1000) / 10)}%, transparent)`;
export const MIX = (a, b, t) =>
  `color-mix(in srgb, ${a} ${Math.round((1 - t) * 100)}%, ${b})`;

export const srcOf = (v, fallback) =>
  v && typeof v === 'object' && v.src
    ? String(v.src).split('?')[0]
    : typeof v === 'string' && v.trim()
    ? v.trim().split('?')[0]
    : fallback;

export const T = (s, fb) => (s && s.trim() ? s.trim() : fb);

export const onBrand = (hex) => {
  const m = String(hex || '')
    .replace('#', '')
    .match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return 'var(--mv-cloud)';
  const [r, g, b] = [m[1], m[2], m[3]].map((x) => {
    const v = parseInt(x, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.2 ? 'var(--mv-ink)' : 'var(--mv-cloud)';
};

export const cleanTel = (s) => String(s || '').replace(/[^\d+]/g, '');

export const MAXW = 'clamp(1280px, 92vw, 1520px)';

export const RS_W = [160, 320, 480, 800, 1200, 1600];

export const rsTarget = (sizes) => {
  const t =
    String(sizes || '')
      .trim()
      .split(',')
      .pop() || '';
  const px = t.match(/(\d+(?:\.\d+)?)px/);
  const vw = t.match(/(\d+(?:\.\d+)?)vw/);
  const want = px
    ? parseFloat(px[1]) * 2
    : vw
    ? (parseFloat(vw[1]) / 100) * 1600 * 1.25
    : 1600;
  return RS_W.find((w) => w >= want) || 1600;
};

export const RS = (u, sizes) => {
  const s = String(u || '');
  const b = s.split('?')[0];
  if (/framerusercontent\.com\/images\//.test(s)) {
    const w = rsTarget(sizes);
    const d = w <= 512 ? 512 : w <= 1024 ? 1024 : 2048;
    return {
      src: `${b}?scale-down-to=${d}`,
      srcSet: `${b}?scale-down-to=512 512w, ${b}?scale-down-to=1024 1024w, ${b}?scale-down-to=2048 2048w`,
      sizes,
    };
  }
  if (/images\.unsplash\.com\//.test(s)) {
    const w = rsTarget(sizes);
    const q = (n) => `${b}?w=${n}&q=70&fm=jpg&auto=format`;
    return {
      src: q(w),
      srcSet: RS_W.filter((n) => n <= Math.max(w * 2, 480))
        .map((n) => `${q(n)} ${n}w`)
        .join(', '),
      sizes,
    };
  }
  return { src: s };
};

export const famOf = (f) => {
  if (!f) return '';
  if (typeof f === 'string') return f.includes(';') ? '' : f;
  if (f.fontFamily && !String(f.fontFamily).includes(';'))
    return String(f.fontFamily);
  const sel = String(f.fontSelector || '');
  if (!sel) return '';
  const n = sel.split(';').pop() || '';
  return n
    .replace(/-(regular|italic|bold|\d{3}(italic)?)$/i, '')
    .replace(/-/g, ' ');
};

export const wOf = (f, fb) => {
  if (!f) return fb;
  if (f.fontWeight) return Number(f.fontWeight) || fb;
  const m = String(f.fontSelector || '').match(/-(\d{3})/);
  return m ? Number(m[1]) : fb;
};

export const famCss = (f) => {
  const fa = famOf(f).replace(/"/g, "'").trim();
  if (!fa) return '';
  return fa.includes(',') || fa.startsWith("'") ? fa : `'${fa}'`;
};

export const stack = (custom, f, fb, tail) => {
  const fam = custom ? famCss(f) : '';
  return `${fam ? `${fam}, ` : ''}${fb}, ${tail}`;
};

export function useFonts() {
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('mv-fonts'))
      return;
    const l = document.createElement('link');
    l.id = 'mv-fonts';
    l.rel = 'stylesheet';
    l.href = FONTS;
    document.head.appendChild(l);
  }, []);
}

export function useStill() {
  return false;
}

export function useLive() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') setLive(true);
  }, []);
  return live;
}

export function useSize(root, hint) {
  const ov = String(hint || '').toLowerCase();
  const [w, setW] = useState(
    ov === 'phone' ? 390 : ov === 'tablet' ? 810 : 1440
  );
  const [vh, setVh] = useState(
    ov === 'phone' ? 844 : ov === 'tablet' ? 1080 : 900
  );

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const x = Math.round(
        (e.borderBoxSize && e.borderBoxSize[0]
          ? e.borderBoxSize[0].inlineSize
          : 0) || el.offsetWidth
      );
      if (x > 0) setW(x);
    });
    ro.observe(el);
    const vv = () => setVh(window.innerHeight);
    vv();
    const read = () => {
      const x = Math.round(el.offsetWidth);
      if (x > 0) setW(x);
    };
    const t1 = window.setTimeout(read, 150),
      t2 = window.setTimeout(read, 700),
      t3 = window.setTimeout(read, 1600);
    window.addEventListener('resize', vv);
    window.addEventListener('load', read);
    return () => {
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener('resize', vv);
      window.removeEventListener('load', read);
    };
  }, [root]);

  return { w, vh };
}

export const useReduced = () => {
  const [rm, setRm] = useState(false);
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    setRm(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  return rm;
};

export function onTick(fn, read, pre) {
  if (typeof window === 'undefined') return () => {};
  const w = window;
  if (!w.__nuTick) {
    w.__nuTick = {
      pre: new Set(),
      subs: new Set(),
      reads: new Set(),
      raf: 0,
    };
    const loop = (t) => {
      const T = w.__nuTick;
      T.pre.forEach((r) => r(t));
      T.reads.forEach((r) => r(t));
      T.subs.forEach((s) => s(t));
      T.raf = requestAnimationFrame(loop);
    };
    w.__nuTick.raf = requestAnimationFrame(loop);
  }
  w.__nuTick.subs.add(fn);
  if (read) w.__nuTick.reads.add(read);
  if (pre) w.__nuTick.pre.add(pre);
  return () => {
    w.__nuTick.subs.delete(fn);
    if (read) w.__nuTick.reads.delete(read);
    if (pre) w.__nuTick.pre.delete(pre);
  };
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const easeIO = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

// ---- Palette ----
export const DEF = {
  bone: '#F1ECE4',
  ink: '#141210',
  brass: '#FF5B2E',
  pine: '#231D19',
  fog: '#DDD4C8',
  stone: '#857B70',
  cloud: '#FFFFFF',
  night: '#171311',
};

export const AMBER = '#FFB224';
export const VIOLET = '#A58BFF';

export const colorsOf = (p) => ({
  bone: p?.bone || DEF.bone,
  ink: p?.ink || DEF.ink,
  brass: p?.brass || DEF.brass,
  pine: p?.pine || DEF.pine,
  fog: p?.fog || DEF.fog,
  stone: p?.stone || DEF.stone,
  cloud: p?.cloud || DEF.cloud,
  night: p?.night || DEF.night,
});

export const cssVars = (c) => ({
  '--mv-bone': c.bone,
  '--mv-ink': c.ink,
  '--mv-brass': c.brass,
  '--mv-pine': c.pine,
  '--mv-fog': c.fog,
  '--mv-stone': c.stone,
  '--mv-cloud': c.cloud,
  '--mv-night': c.night,
});

export const NUMF = "var(--mv-font-m, 'Chivo Mono'), ui-monospace, monospace";

export const siteFontCss = (p) => {
  if (!p || !p.customFonts) return '';
  const v = [];
  const put = (k, f, w) => {
    const fam = famCss(f);
    if (fam) {
      v.push(`--mv-font-${k}:${fam}`);
      v.push(`--mv-font-${k}w:${wOf(f, w)}`);
    }
  };
  put('d', p.displayFont, 600);
  put('b', p.bodyFont, 400);
  put('m', p.monoFont, 400);
  put('a', p.accentFont, 400);
  return v.length ? `:root{${v.join(';')}}` : '';
};

export function fontsOf(p) {
  const on = !!p?.customFonts;
  const D = {
    fontFamily: stack(
      on,
      p?.displayFont,
      "var(--mv-font-d, 'Mona Sans')",
      'Inter, -apple-system, Arial, sans-serif'
    ),
    fontWeight: on ? wOf(p?.displayFont, 600) : 'var(--mv-font-dw, 600)',
    fontStyle:
      on && p?.displayFont && p.displayFont.fontStyle
        ? p.displayFont.fontStyle
        : 'normal',
  };
  const B = {
    fontFamily: stack(
      on,
      p?.bodyFont,
      "var(--mv-font-b, 'Mona Sans')",
      'Inter, system-ui, -apple-system, Arial, sans-serif'
    ),
    fontWeight: on ? wOf(p?.bodyFont, 400) : 'var(--mv-font-bw, 400)',
  };
  const M = {
    fontFamily: stack(
      on,
      p?.monoFont,
      "var(--mv-font-m, 'Chivo Mono')",
      'ui-monospace, SFMono-Regular, Menlo, monospace'
    ),
    fontWeight: on ? wOf(p?.monoFont, 400) : 'var(--mv-font-mw, 400)',
  };
  return { D, B, M };
}

// ---- Glyph icon set ----
export const Glyph = ({ k }) =>
  k === 'mail' ? (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ) : k === 'cal' ? (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  ) : k === 'play' ? (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M8 5.5v13l10.5-6.5z" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );

// Smooth jump
export function jumpTo(e, href) {
  try {
    const m = String(href || '').match(/^\/?#([\w-]+)$/);
    if (!m) return;
    const el = document.getElementById(m[1]);
    if (el) {
      if (e) e.preventDefault();
      const W = window;
      const L = W.__lenis || W.__ltLenis || W.__vcLenis || W.lenis;
      if (L && L.scrollTo) L.scrollTo(el, { offset: -20 });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      try {
        history.replaceState(null, '', '#' + m[1]);
      } catch (x) {}
    } else if (href.startsWith('#')) {
      if (e) e.preventDefault();
      window.location.href = '/' + href;
    }
  } catch (x) {}
}

// Button system: THE PING
export const Btn = ({
  href,
  label,
  kind = 'solid',
  arrow = true,
  style,
  className,
  onClick,
  ariaLabel,
  cur,
  icon,
  sub,
  target,
  rel,
  ...rest
}) => {
  const isExt = /^https?:\/\//.test(href || '');
  const isPdf = /\.pdf($|\?)/i.test(href || '');
  const effTarget = target !== undefined ? target : (isExt || isPdf ? '_blank' : undefined);
  const effRel = rel !== undefined ? rel : (isExt || isPdf ? 'noopener noreferrer' : undefined);

  return (
    <a
      className={`mv-btn mv-${kind}${arrow ? '' : ' mv-noarr'}${className ? ' ' + className : ''}`}
      data-mag
      data-cur={cur || 'go'}
      href={href}
      target={effTarget}
      rel={effRel}
      onClick={(e) => {
        if (isExt || isPdf) {
          e.stopPropagation();
        }
        if (onClick) {
          onClick(e);
        } else if (!isExt && !isPdf) {
          jumpTo(e, href);
        }
      }}
      aria-label={ariaLabel || (sub ? `${sub} ${label}` : undefined)}
      style={style}
      {...rest}
    >
      <span className="mv-face">
        <span className="mv-fill" aria-hidden />
        <span className="mv-lbl">
          <span className="mv-roll">
            <span className="mv-l1">{label}</span>
            <span className="mv-l2" aria-hidden>
              {label}
            </span>
          </span>
        </span>
        {arrow && (
          <span className="mv-arr" aria-hidden>
            <span className="mv-a1">
              <Glyph k={icon} />
            </span>
            <span className="mv-a2">
              <Glyph k={icon} />
            </span>
          </span>
        )}
      </span>
      <span className="mv-selb" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <b className="mv-dim" aria-hidden />
    </a>
  );
};

export function useMagnet(root, live) {
  useEffect(() => {
    if (
      !live ||
      !root.current ||
      !window.matchMedia('(hover:hover) and (pointer:fine)').matches
    )
      return;
    const r = root.current;
    const btns = () => Array.from(r.querySelectorAll('[data-mag]'));
    const en = (e) => {
      const b = e.target.closest?.('[data-mag]');
      if (b) {
        const d = b.querySelector('.mv-dim');
        if (d)
          d.textContent = `${Math.round(b.offsetWidth)} × ${Math.round(b.offsetHeight)}`;
      }
    };
    const mv = (e) => {
      for (const b of btns()) {
        const rc = b.getBoundingClientRect();
        const dx = e.clientX - (rc.left + rc.width / 2),
          dy = e.clientY - (rc.top + rc.height / 2);
        const d = Math.hypot(dx, dy);
        const pull = d < 150 ? (1 - d / 150) * 8 : 0;
        b.style.setProperty('--mx', `${(dx / (d || 1)) * pull}px`);
        b.style.setProperty('--my', `${(dy / (d || 1)) * pull}px`);
      }
    };
    const lv = () => {
      for (const b of btns()) {
        b.style.setProperty('--mx', '0px');
        b.style.setProperty('--my', '0px');
      }
    };
    r.addEventListener('pointermove', mv);
    r.addEventListener('pointerleave', lv);
    r.addEventListener('pointerover', en);
    r.addEventListener('focusin', en);
    return () => {
      r.removeEventListener('pointermove', mv);
      r.removeEventListener('pointerleave', lv);
      r.removeEventListener('pointerover', en);
      r.removeEventListener('focusin', en);
    };
  }, [root, live]);
}

export const CSS_BASE = `
:where(.mv){position:relative;z-index:10} .mv,.mv *{box-sizing:border-box;min-width:0} .mv-sr{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;padding:0!important;margin:-1px!important;border:0!important} :where(.mv) a{color:inherit} html,body{overflow-x:clip}
:where(a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"]),[role="button"]):focus-visible{outline:3px solid var(--mv-ink,#0D0E10)!important;outline-offset:2px!important;box-shadow:0 0 0 2px var(--mv-bone,#EEEEE8)!important} :where(.mv-dark) :where(a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])):focus-visible{outline-color:var(--mv-cloud,#FFFFFF)!important;box-shadow:0 0 0 2px var(--mv-night,#08090A)!important} :where(.mv-inring) :where(a[href],button):focus-visible{outline-offset:-4px!important;box-shadow:none!important} :where(.mv) :is(input:not([type=range]):not([type=checkbox]):not([type=radio]),textarea,select):focus-visible{outline:2px solid currentColor!important;outline-offset:2px!important;box-shadow:none!important} :where(.mv) textarea{resize:none} .mv-inring:focus-visible{outline-offset:-3px!important;box-shadow:none!important} html{scroll-padding-top:96px;scroll-padding-bottom:88px}
.mv-btn{position:relative;display:inline-flex;padding:0;min-height:54px;border-radius:6px;text-decoration:none!important;cursor:pointer;isolation:isolate;white-space:nowrap;font-size:13px;font-weight:600;letter-spacing:.005em;border:0;color:var(--fg);transition:color .35s,transform .45s cubic-bezier(.34,1.56,.64,1)}
.mv-face{position:relative;z-index:1;display:inline-flex;align-items:center;gap:14px;width:100%;min-height:inherit;padding:0 8px 0 22px;border-radius:inherit;background:var(--face);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);box-shadow:inset 0 0 0 1px var(--rim);overflow:hidden;isolation:isolate}
.mv-fill{position:absolute;z-index:0;inset:0;background:var(--fill);border-radius:inherit;clip-path:inset(0 100% 0 0);transition:clip-path .6s cubic-bezier(.7,0,.2,1)} .mv-btn:hover .mv-fill,.mv-btn:focus-visible .mv-fill{clip-path:inset(0 0 0 0)}
.mv-lbl{position:relative;z-index:1;display:inline-flex;flex-direction:column;justify-content:center;line-height:1.15;text-decoration:none!important}
.mv-roll{display:block;height:1.2em;overflow:hidden;line-height:1.2;text-decoration:none!important} .mv-l1,.mv-l2{display:block;text-decoration:none!important;transition:translate .5s cubic-bezier(.7,0,.2,1)} .mv-btn:hover .mv-l1,.mv-btn:hover .mv-l2,.mv-btn:focus-visible .mv-l1,.mv-btn:focus-visible .mv-l2{translate:0 -100%}
.mv-arr{position:relative;z-index:1;display:grid;place-items:center;width:38px;height:38px;flex:none;border-radius:5px;background:var(--chip);color:var(--chipfg);overflow:hidden;transition:background .4s,color .4s} .mv-arr>span{grid-area:1/1;display:grid;place-items:center;transition:transform .55s cubic-bezier(.7,0,.2,1)} .mv-arr svg{width:15px;height:15px} .mv-a2{transform:translate(-160%,160%)}
.mv-btn:hover .mv-a1,.mv-btn:focus-visible .mv-a1{transform:translate(160%,-160%)} .mv-btn:hover .mv-a2,.mv-btn:focus-visible .mv-a2{transform:none} .mv-btn:hover .mv-arr,.mv-btn:focus-visible .mv-arr{background:var(--chip2);color:var(--chipfg2)}
.mv-selb{position:absolute;z-index:2;inset:-5px;border-radius:8px;box-shadow:0 0 0 1.5px var(--mv-brass);pointer-events:none;opacity:0;scale:1.06;transition:opacity .25s,scale .45s cubic-bezier(.34,1.56,.64,1)}
.mv-selb i{position:absolute;width:7px;height:7px;background:var(--mv-cloud);box-shadow:0 0 0 1.5px var(--mv-brass);translate:-50% -50%} .mv-selb i:nth-child(1){left:0;top:0} .mv-selb i:nth-child(2){left:100%;top:0} .mv-selb i:nth-child(3){left:0;top:100%} .mv-selb i:nth-child(4){left:100%;top:100%}
.mv-btn:hover .mv-selb,.mv-btn:focus-visible .mv-selb{opacity:1;scale:1}
.mv-dim{position:absolute;z-index:3;left:50%;top:calc(100% + 11px);translate:-50% -4px;padding:2px 6px;border-radius:4px;background:var(--mv-brass);color:var(--mv-ink);font:500 12px/1.4 var(--mv-font-m,'Chivo Mono'),ui-monospace,monospace;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .25s,translate .35s}
.mv-btn:hover .mv-dim,.mv-btn:focus-visible .mv-dim{opacity:1;translate:-50% 0}
.mv-btn:hover,.mv-btn:focus-visible{color:var(--fg2);text-decoration:none!important}
.mv-btn.mv-noarr .mv-face{padding-right:22px}
.mv-btn.mv-solid{--face:var(--mv-brass);--rim:transparent;--fill:var(--mv-cloud);--fg:var(--mv-ink);--fg2:var(--mv-ink);--chip:var(--mv-ink);--chipfg:var(--mv-brass);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mv-btn.mv-ghost{--face:color-mix(in srgb,var(--mv-cloud) 8%,transparent);--rim:color-mix(in srgb,var(--mv-cloud) 26%,transparent);--fill:var(--mv-cloud);--fg:var(--mv-cloud);--fg2:var(--mv-ink);--chip:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--chipfg:var(--mv-cloud);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mv-btn.mv-quiet{min-height:38px;font-size:12.5px;border-radius:6px;--face:var(--mv-brass);--rim:transparent;--fill:var(--mv-cloud);--fg:var(--mv-ink);--fg2:var(--mv-ink);--chip:var(--mv-ink);--chipfg:var(--mv-brass);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)} .mv-btn.mv-quiet .mv-arr{width:26px;height:26px;border-radius:4px} .mv-btn.mv-quiet .mv-face{padding-left:14px;gap:9px;padding-right:6px} .mv-btn.mv-quiet .mv-selb{inset:-4px;border-radius:8px}
.mv-btn.mv-ghost.mv-quiet,.mv-btn.mv-quiet.mv-ghost{--face:color-mix(in srgb,var(--mv-cloud) 8%,transparent);--rim:color-mix(in srgb,var(--mv-cloud) 26%,transparent);--fill:var(--mv-cloud);--fg:var(--mv-cloud);--fg2:var(--mv-ink);--chip:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--chipfg:var(--mv-cloud);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mv:not(.mv-dark) .mv-btn.mv-solid,.mv-lt .mv-btn.mv-solid{--face:var(--mv-ink);--fill:var(--mv-brass);--fg:var(--mv-cloud);--fg2:var(--mv-ink);--chip:var(--mv-brass);--chipfg:var(--mv-ink);--chip2:var(--mv-ink);--chipfg2:var(--mv-brass)}
.mv:not(.mv-dark) .mv-btn.mv-ghost,.mv-lt .mv-btn.mv-ghost{--face:transparent;--rim:color-mix(in srgb,var(--mv-ink) 28%,transparent);--fill:var(--mv-ink);--fg:var(--mv-ink);--fg2:var(--mv-cloud);--chip:color-mix(in srgb,var(--mv-ink) 7%,transparent);--chipfg:var(--mv-ink);--chip2:var(--mv-brass);--chipfg2:var(--mv-ink)}
.mv:not(.mv-dark) .mv-selb i,.mv-lt .mv-selb i{background:var(--mv-cloud)}
.mv:not(.mv-dark) .mv-dark:not(.mv-lt) .mv-btn.mv-solid{--face:var(--mv-brass);--rim:transparent;--fill:var(--mv-cloud);--fg:var(--mv-ink);--fg2:var(--mv-ink);--chip:var(--mv-ink);--chipfg:var(--mv-brass);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mv:not(.mv-dark) .mv-dark:not(.mv-lt) .mv-btn.mv-ghost{--face:color-mix(in srgb,var(--mv-cloud) 8%,transparent);--rim:color-mix(in srgb,var(--mv-cloud) 26%,transparent);--fill:var(--mv-cloud);--fg:var(--mv-cloud);--fg2:var(--mv-ink);--chip:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--chipfg:var(--mv-cloud);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
@media (max-width:600px),(hover:none){.mv .mv-btn{white-space:normal;text-align:left;line-height:1.25;min-height:54px;max-width:100%} .mv .mv-btn.mv-quiet{min-height:40px;white-space:nowrap} .mv .mv-btn .mv-face{justify-content:space-between} .mv .mv-roll{height:auto} .mv .mv-l2{display:none} .mv .mv-btn .mv-l1{translate:none!important} .mv .mv-selb,.mv .mv-dim{display:none}}
.mv-btn:hover{transform:translate(var(--mx,0px),var(--my,0px))} .mv-btn:active{transform:translate(var(--mx,0px),var(--my,0px)) scale(.97)!important;transition-duration:.12s}
.mv{--mv-acc:var(--mv-ink);--mv-acc-lg:var(--mv-brass);--mv-hl:var(--mv-brass);--mv-mut:color-mix(in srgb,var(--mv-stone) 45%,var(--mv-ink));--mv-acc-d:var(--mv-brass)}
.mv-lt,.mv .mv-lt{--mv-acc:var(--mv-ink);--mv-acc-lg:var(--mv-brass);--mv-hl:var(--mv-brass);--mv-mut:color-mix(in srgb,var(--mv-stone) 45%,var(--mv-ink))}
.mv-dark,.mv.mv-dark{--mv-acc:var(--mv-brass);--mv-acc-lg:var(--mv-brass);--mv-hl:transparent;--mv-mut:color-mix(in srgb,var(--mv-stone) 40%,var(--mv-cloud))}
.mv-port{width:7px;height:7px;flex:none;border-radius:50%;background:#3DDC84;box-shadow:0 0 0 0 rgba(61,220,132,.6);animation:mv-live 1.8s infinite} @keyframes mv-live{0%{box-shadow:0 0 0 0 rgba(61,220,132,.55)}100%{box-shadow:0 0 0 9px rgba(61,220,132,0)}}
@media (prefers-reduced-motion:reduce){.mv *,.sth *{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`;

export const SCRUB_K = 0.18;

export function usePre(el) {
  try {
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        el.querySelectorAll('img').forEach((im) => {
          try {
            im.loading = 'eager';
            im.decode().catch(() => {});
          } catch (e) {}
        });
      },
      { rootMargin: '150% 0px 150% 0px' }
    );
    io.observe(el);
  } catch (e) {}
}

export function useScrollVars(ref, live, rm, cb) {
  useEffect(() => {
    if (!live || rm || !ref.current) return;
    const el = ref.current;
    let vis = true,
      last = -9,
      cs = -1,
      cp = -1,
      settled = false;
    usePre(el);
    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: '25% 0px 25% 0px' }
    );
    io.observe(el);
    let rt = 0,
      rh = 0,
      vh = 1,
      fresh = false;
    const read = () => {
      if (!vis && settled) {
        fresh = false;
        return;
      }
      const r = el.getBoundingClientRect();
      rt = r.top;
      rh = r.height;
      vh = window.innerHeight || 1;
      fresh = true;
    };
    const off = onTick(() => {
      if (!fresh) return;
      const sp = clamp01((vh - rt) / (vh + rh));
      const pp = rh > vh * 1.05 ? clamp01(-rt / (rh - vh)) : sp;
      if (cs < 0) {
        cs = sp;
        cp = pp;
      } else {
        cs += (sp - cs) * SCRUB_K;
        cp += (pp - cp) * SCRUB_K;
        if (Math.abs(sp - cs) < 0.0005) cs = sp;
        if (Math.abs(pp - cp) < 0.0005) cp = pp;
      }
      settled = cs === sp && cp === pp;
      if (Math.abs(cs + cp - last) < 0.0003) return;
      last = cs + cp;
      el.style.setProperty('--sp', cs.toFixed(4));
      el.style.setProperty('--pp', cp.toFixed(4));
      if (cb) cb(cs, cp);
    }, read);
    return () => {
      off();
      io.disconnect();
    };
  }, [ref, live, rm, cb]);
}

export function useStage(live) {
  const [r, setR] = useState(false);
  useEffect(() => {
    if (!live) return;
    const h = document.documentElement;
    const ok = () => !/(^|\s)mv-hold/.test(h.className);
    if (ok()) {
      setR(true);
      return;
    }
    const mo = new MutationObserver(() => {
      if (ok()) {
        mo.disconnect();
        setR(true);
      }
    });
    mo.observe(h, { attributes: true, attributeFilter: ['class'] });
    const t = window.setTimeout(() => setR(true), 2400);
    return () => {
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, [live]);
  return r;
}

export function useOn(ref, live, rm, amount = 0.16) {
  const [on, setOn] = useState(false);
  const still = useStill();
  const ready = useStage(live);
  useEffect(() => {
    if (!live) return;
    if (rm) {
      setOn(true);
      return;
    }
    if (!ready) return;
    const el = ref.current;
    if (!el) return;
    let off = () => {};
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es)
          if (e.isIntersecting) {
            io.disconnect();
            setOn(true);
          }
      },
      {
        threshold: Math.min(
          amount,
          Math.max(0.005, 72 / Math.max(1, el.offsetHeight))
        ),
        rootMargin: '0px 0px -6% 0px',
      }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      off();
    };
  }, [ref, live, rm, ready, amount]);
  return on || still;
}

export function Reveal({ on = true, layer = 9, style, children }) {
  const live = useLive();
  const rm = useReduced();
  const wrap = useRef(null);
  const inner = useRef(null);
  const sp = useRef(null);
  const [h, setH] = useState(0);
  const act = on && live && !rm && h > 0;

  useEffect(() => {
    if (!on || !live || rm || !inner.current) return;
    const el = inner.current;
    const m = () => setH(el.offsetHeight);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, [on, live, rm]);

  useEffect(() => {
    if (!act || !wrap.current) return;
    const el = wrap.current;
    let vis = true;
    let last = -1;
    const io = new IntersectionObserver(
      (es) => {
        vis = es[0].isIntersecting;
      },
      { rootMargin: '30% 0px 30% 0px' }
    );
    io.observe(el);

    let cur = -1,
      T = 0,
      vh = 1,
      top = 0,
      fresh = false;

    const read = () => {
      if (!vis) {
        fresh = false;
        return;
      }
      T = sp.current ? sp.current.offsetHeight : 0;
      vh = window.innerHeight;
      top = el.getBoundingClientRect().top;
      fresh = true;
    };

    const off = onTick(() => {
      if (!fresh || !T) return;
      const rv = clamp01((vh - T - top) / T);
      if (cur < 0) cur = rv;
      else {
        cur += (rv - cur) * SCRUB_K;
        if (Math.abs(rv - cur) < 0.0005) cur = rv;
      }
      if (Math.abs(cur - last) < 0.0004) return;
      last = cur;
      el.style.setProperty('--rv', cur.toFixed(4));
    }, read);

    return () => {
      off();
      io.disconnect();
    };
  }, [act]);

  return (
    <div
      ref={wrap}
      className={`mv-rev${act ? ' is-act' : ''}`}
      style={{
        ...(style || {}),
        '--h': `${h}px`,
        '--layer': layer,
      }}
      onFocusCapture={(e) => {
        if (!act || !wrap.current) return;
        const t = e.target;
        const w = window;
        const r = wrap.current.getBoundingClientRect();
        const T = sp.current ? sp.current.offsetHeight : 0;
        const y = Math.max(
          0,
          Math.min(
            document.documentElement.scrollHeight - window.innerHeight,
            r.top + window.scrollY - window.innerHeight + 2 * T
          )
        );
        if (Math.abs(window.scrollY - y) > 4) {
          if (w.__ltLenis)
            w.__ltLenis.scrollTo(y, {
              immediate: true,
              force: true,
            });
          else window.scrollTo(0, y);
        }
        requestAnimationFrame(() => {
          try {
            t.scrollIntoView({ block: 'nearest' });
          } catch (x) {}
        });
      }}
    >
      <div ref={inner} className="mv-rev-in">
        {children}
      </div>
      <div ref={sp} className="mv-rev-sp" aria-hidden />
    </div>
  );
}

export const splitWords = (s) =>
  String(s || '')
    .replace(/\*([^*]+)\*/g, (_m, g) =>
      g
        .trim()
        .split(/\s+/)
        .map((w) => {
          const m = w.match(/^(.*?)([.,!?;:’']*)$/);
          return m && m[1] ? `*${m[1]}*${m[2]}` : w;
        })
        .join(' ')
    )
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => {
      const m = t.match(/^\*(.+?)\*([.,!?;:’']*)$/);
      return m
        ? { t: m[1], tail: m[2], acc: true }
        : { t: t.replace(/\*/g, ''), tail: '', acc: false };
    });

export const plainOf = (s) =>
  String(s || '')
    .replace(/\*/g, '')
    .replace(/\s*\|\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const Head = ({
  text,
  on,
  D,
  tag = 'h2',
  size = 'clamp(40px,4.8vw,72px)',
  lh = 0.92,
  delay = 0,
  step = 55,
  style,
  className,
}) => {
  const Tag = tag;
  let k = 0;
  return (
    <Tag
      className={`mv-hd${on ? ' is-on' : ''}${className ? ' ' + className : ''}`}
      aria-label={plainOf(text)}
      style={{
        ...D,
        fontSize: typeof size === 'number' ? Math.max(12, size) : size,
        lineHeight: lh,
        ...(style || {}),
      }}
    >
      {String(text)
        .split('|')
        .map((line, li) => (
          <span key={li} className="mv-hd-l" aria-hidden>
            {splitWords(line).map((w, i) => {
              const d = delay + k++ * step;
              return (
                <span
                  key={i}
                  className={`mv-hd-w${w.acc ? ' is-accw' : ''}`}
                >
                  <span
                    className={`mv-hd-i${w.acc ? ' is-acc' : ''}`}
                    style={{
                      transitionDelay: `${d}ms`,
                      '--pd': `${d + 500}ms`,
                    }}
                  >
                    {w.acc ? (
                      <span className="mv-it">
                        {w.t}
                        {w.tail}
                        <svg
                          className="mv-spark"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path d="M12 1.5C12.9 8 16 11.1 22.5 12 16 12.9 12.9 16 12 22.5 11.1 16 8 12.9 1.5 12 8 11.1 11.1 8 12 1.5Z" />
                        </svg>
                      </span>
                    ) : (
                      <>
                        {w.t}
                        {w.tail}
                      </>
                    )}
                  </span>{' '}
                </span>
              );
            })}
          </span>
        ))}
    </Tag>
  );
};

export const Eyebrow = ({ text, on, M, delay = 0, style }) =>
  text ? (
    <p
      className={`mv-eb${on ? ' is-on' : ''}`}
      style={{ ...M, transitionDelay: `${delay}ms`, ...(style || {}) }}
    >
      <i aria-hidden />
      {text}
    </p>
  ) : null;

export const rise = (on, d = 0, y = 22) => ({
  opacity: on ? 1 : 0,
  translate: on ? '0 0' : `0 ${y}px`,
  transition: `opacity .9s ease ${d}ms, translate 1s cubic-bezier(.2,.8,.2,1) ${d}ms`,
});

export const SHAPES = {
  up: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'],
  down: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
  left: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
  right: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'],
  diag: [
    'polygon(0 100%,0 100%,0 100%,0 100%)',
    'polygon(0 -160%,260% 100%,0 100%,0 100%)',
  ],
  iris: ['circle(0% at 50% 55%)', 'circle(85% at 50% 55%)'],
  arch: [
    'inset(100% 0 0 0 round 999px 999px 0 0)',
    'inset(0 0 0 0 round 999px 999px 0 0)',
  ],
  slit: ['inset(0 50% 0 50%)', 'inset(0 0 0 0)'],
};

export const Um = ({
  src,
  alt = '',
  on,
  shape = 'up',
  ratio = '4/5',
  delay = 0,
  par = 1,
  focus = '50% 40%',
  radius = 4,
  sizes = '(max-width: 809px) 100vw, 50vw',
  style,
  className,
  eager = false,
}) => {
  const sh = SHAPES[shape] || SHAPES.up;
  const im = RS(src, sizes);
  return (
    <div
      className={`mv-um${on ? ' is-on' : ''}${className ? ' ' + className : ''}`}
      style={{
        aspectRatio: ratio,
        borderRadius: radius,
        clipPath: on ? sh[1] : sh[0],
        WebkitClipPath: on ? sh[1] : sh[0],
        transitionDelay: `${delay}ms`,
        '--par': par,
        ...(style || {}),
      }}
    >
      <img
        src={im.src}
        srcSet={im.srcSet}
        sizes={im.sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        style={{ objectPosition: focus, transitionDelay: `${delay}ms` }}
      />
    </div>
  );
};

export const CSS_MOTION = `
[data-kb] *,[data-kb] *::before,[data-kb] *::after{transition:none!important}
.mv-sec{position:relative;z-index:10;display:block;width:100%;--sp:.5;--pp:0}
.mv-rev{position:relative;width:100%;--rv:1} .mv-rev-in{position:relative} .mv-rev-sp{height:0}
.mv-rev.is-act{--rv:0;--t:min(var(--h),100vh);--t:min(var(--h),100svh);z-index:var(--layer,9);margin-top:calc(var(--t)*-1)}
.mv-rev.is-act>.mv-rev-in{position:sticky;top:calc(100vh - var(--t));top:calc(100svh - var(--t))} .mv-rev.is-act>.mv-rev-sp{height:var(--t)}
.mv-rev.is-act>.mv-rev-in::before{content:"";position:absolute;z-index:40;left:0;right:0;top:0;height:120px;translate:0 calc((1 - var(--rv))*var(--t));background:linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,0));opacity:min(1,calc(var(--rv)*(1 - var(--rv))*9));pointer-events:none}
.mv-rev.is-act>.mv-rev-in::after{content:"";position:absolute;z-index:39;left:0;right:0;top:0;height:var(--t);background:#000;opacity:calc((1 - var(--rv))*.16);pointer-events:none}
:root{--mvg:56px}
.mv-wrap{--pad:var(--mvg);width:100%;max-width:calc(${MAXW} + var(--pad)*2);margin:0 auto;padding-left:var(--pad);padding-right:var(--pad)}
.mv-eb{display:inline-flex;align-items:center;gap:9px;width:max-content;max-width:100%;margin:0;padding:7px 13px 7px 11px;border-radius:6px;background:color-mix(in srgb,var(--mv-ink) 6%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 12%,transparent);color:var(--mv-ink);font-size:12px;font-weight:500;letter-spacing:.06em;opacity:0;translate:0 10px;transition:opacity .8s ease,translate .9s cubic-bezier(.2,.8,.2,1)} .mv-eb.is-on{opacity:1;translate:0 0}
.mv-eb i{display:block;flex:none;order:-1;width:7px;height:7px;border-radius:50%;background:var(--mv-brass)}
.mv-dark .mv-eb{color:var(--mv-cloud);background:color-mix(in srgb,var(--mv-cloud) 9%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mv-cloud) 18%,transparent)}
.mv-hd{margin:0;letter-spacing:-.042em;text-wrap:balance;font-weight:var(--mv-font-dw,600)} .mv-hd-l{display:block}
.mv-hd-w{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .04em .12em;margin:0 -.04em -.12em;white-space:pre}
.mv-hd-i{position:relative;display:inline-block;translate:0 108%;transition:translate 1.05s cubic-bezier(.2,.85,.15,1)}
.mv-hd.is-on .mv-hd-i{translate:0 0}
.mv-hd-w.is-accw{overflow:hidden}
.mv-it{position:relative;color:var(--mv-acc);font-weight:inherit} .mv-dark .mv-it{color:var(--mv-brass)}
.mv-spark{display:none}
.mv-um{position:relative;overflow:hidden;transition:clip-path 1.35s cubic-bezier(.7,0,.2,1);background:color-mix(in srgb,var(--mv-stone) 22%,transparent)}
.mv-um img{position:absolute;left:0;top:-9%;width:100%;height:118%;display:block;object-fit:cover;scale:1.28;translate:0 calc((var(--sp,.5) - .5)*var(--par,1)*-7%);transition:scale 1.9s cubic-bezier(.16,.84,.24,1);user-select:none}
.mv-um.is-on img{scale:1}
.mv-cut-t{margin-top:calc(var(--cut,7vw)*-1);clip-path:polygon(0 var(--cut,7vw),100% 0,100% 100%,0 100%);padding-top:var(--cut,7vw)}
.mv-cut-b{margin-bottom:calc(var(--cut,7vw)*-1);padding-bottom:var(--cut,7vw)}
.mv-cut-t.mv-cut-b{clip-path:polygon(0 var(--cut,7vw),100% 0,100% calc(100% - var(--cut,7vw)),0 100%)}
.mv-cut-b:not(.mv-cut-t){clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut,7vw)),0 100%)}
@media (max-width:1099px){:root{--mvg:32px}}
@media (max-width:699px){:root{--mvg:20px}}
@media (prefers-reduced-motion:reduce){.mv-hd-i{translate:0 0!important} .mv-spark{scale:1!important;rotate:0deg!important;animation:none!important} .mv-um{clip-path:none!important} .mv-um img{scale:1!important;translate:0 0!important}}
`;

export const linkList = (s) =>
  String(s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const i = x.indexOf(':');
      return {
        l: i < 0 ? x : x.slice(0, i).trim(),
        h: i < 0 ? '/' : x.slice(i + 1).trim(),
      };
    });

export const pick = (o, fb) =>
  o !== undefined && o !== null && String(o).trim() ? String(o).trim() : fb;

export const listOf = (s) =>
  String(s || '')
    .split(';')
    .map((x) => x.trim())
    .filter(Boolean);

export const imgOf = (r, k = 'img') =>
  String((r && (r[k] || r.image || r.img)) || '').split('?')[0];

export const EMPTY_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500' preserveAspectRatio='xMidYMid slice'><rect width='400' height='500' fill='#D3D8E2'/><rect x='120' y='170' width='160' height='160' rx='8' fill='none' stroke='#AEB6C6' stroke-width='1.5'/><rect x='100' y='150' width='200' height='200' rx='10' fill='none' stroke='#C3CAD8' stroke-width='1' stroke-dasharray='2 6'/></svg>"
  );

export const imgOr = (r, k = 'img') => imgOf(r, k) || EMPTY_IMG;

export function useSite() {
  return siteData;
}

export function focusTo(el, frac) {
  if (!el || typeof window === 'undefined') return;
  if (window.innerWidth < 810) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.height <= vh * 1.05) return;
  const y =
    r.top +
    window.scrollY +
    (r.height - vh) * Math.min(1, Math.max(0, frac));
  if (Math.abs(window.scrollY - y) < 8) return;
  const w = window;
  if (w.__ltLenis) w.__ltLenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}

export function useCMS(kind, fallback = []) {
  return fallback;
}

export { siteData } from './siteData';

export const IcoArrow = ({ s = 15, style = {} }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export function useNearFocus(root, live) {
  useEffect(() => {
    if (!live || !root?.current) return;
    const el = root.current;
    const f = (e) => {
      const t = e.target;
      const sc = t.closest?.('.mv-inring');
      if (!sc) return;
      try {
        t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      } catch (x) {}
    };
    el.addEventListener('focusin', f);
    return () => el.removeEventListener('focusin', f);
  }, [live, root]);
}

export function openState(spec, tz) {
  try {
    const m = String(spec || '').match(
      /(\d)\s*-\s*(\d)\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/
    );
    if (!m) return null;
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz || 'UTC',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const g = (t) =>
      (parts.find((p) => p.type === t) || { value: '' }).value;
    const wd =
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(
        g('weekday')
      ) + 1;
    const mins = (Number(g('hour')) % 24) * 60 + Number(g('minute'));
    const d1 = Number(m[1]),
      d2 = Number(m[2]),
      a = Number(m[3]) * 60 + Number(m[4]),
      b = Number(m[5]) * 60 + Number(m[6]);
    const open = wd >= d1 && wd <= d2 && mins >= a && mins < b;
    return {
      open,
      label: open
        ? `Open · till ${String(m[5]).padStart(2, '0')}:${m[6]}`
        : `Closed · opens ${String(m[3]).padStart(2, '0')}:${m[4]}`,
    };
  } catch (e) {
    return null;
  }
}




