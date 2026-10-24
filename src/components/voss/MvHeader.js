'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import {
  FONTS,
  MAXW,
  useFonts,
  useStill,
  useLive,
  useReduced,
  onTick,
  colorsOf,
  cssVars,
  siteFontCss,
  fontsOf,
  Btn,
  CSS_BASE,
  linkList,
  pick,
  IcoArrow,
} from './scaffold';
import { siteData } from './siteData';

const MvhdMark = ({ s = 26 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 32 32"
    aria-hidden
    className="mvhd-mark"
  >
    <rect
      x="1"
      y="1"
      width="30"
      height="30"
      rx="8"
      fill="var(--mv-brass)"
    />
    <path
      d="M21.5 12 C21 9.8 18.8 8.5 16 8.5 C12.5 8.5 9.8 10.4 9.8 13.2 C9.8 15.6 12.4 16.4 16 17 C19.6 17.6 22.2 18.4 22.2 20.8 C22.2 23.6 19.5 23.5 16 23.5 C13.2 23.5 11 22.2 10.5 20"
      fill="none"
      stroke="var(--mv-ink)"
      strokeWidth="2.8"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const mvhdRgba = (s) => {
  if (!s) return null;
  let m = s.match(/^rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1]
      .split(/[\s,\/]+/)
      .filter(Boolean)
      .map(parseFloat);
    return [p[0] / 255, p[1] / 255, p[2] / 255, p.length > 3 ? p[3] : 1];
  }
  m = s.match(/^color\(srgb\s+([^)]+)\)/);
  if (m) {
    const p = m[1]
      .split(/[\s\/]+/)
      .filter(Boolean)
      .map(parseFloat);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  return null;
};

const mvhdLum = (c) => {
  const f = (v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};

function mvhdGround(x, y) {
  let els = [];
  try {
    els = document.elementsFromPoint(x, y);
  } catch (e) {
    return null;
  }
  for (const el of els) {
    if (el.closest?.('[data-mvhd]')) continue;
    const tg = el.tagName;
    if (tg === 'IMG' || tg === 'VIDEO' || tg === 'CANVAS') return 0.08;
    const c = mvhdRgba(getComputedStyle(el).backgroundColor);
    if (c && c[3] > 0.5) return mvhdLum(c);
  }
  return null;
}

export default function MvHeader(props = {}) {
  const {
    links = 'Home:/,Work:/work, About:/about, Resume:/resume, Contact:/contact',
    ctaLabel = 'Hire me',
    ctaLink = siteData.book || '/contact',
    homeLabel = 'home',
    skipLabel = 'Skip to content',
    availLabel = siteData.avail || 'Available for work',
    menuLabel = 'Menu',
    closeLabel = 'Close',
    sheetTitle = 'Call sheet',
    sheetRoll = 'Roll SB-26',
    sheetScene = 'Scene: Navigation',
    sheetTake = 'Take 01',
    emailLabel = 'Email',
    socialsLabel = 'Elsewhere',
    timeLabel = 'Local time',
    probe = true,
    hideOnScroll = true,
    bpHint = 'auto',
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();
  const still = useStill();
  const site = siteData;

  const Dh = {
    ...D,
    fontWeight: props.customFonts
      ? D.fontWeight
      : 'var(--mv-font-dw, 720)',
  };

  const anchor = useRef(null);
  const barEl = useRef(null);
  const drawer = useRef(null);
  const burger = useRef(null);

  const hintW =
    String(bpHint).toLowerCase() === 'phone'
      ? 390
      : String(bpHint).toLowerCase() === 'tablet'
      ? 810
      : 1440;
  const [vw, setVw] = useState(hintW);

  useLayoutEffect(() => {
    const f = () => setVw(window.innerWidth || hintW);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [hintW]);

  const phone = vw < 810;
  const compact = vw < 1100;

  const [host, setHost] = useState(null);
  const mounted = !!host;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const h = document.createElement('div');
    h.setAttribute('data-mvhd-host', '');
    h.style.display = 'contents';
    document.body.insertBefore(h, document.body.firstChild);
    setHost(h);
    return () => {
      try {
        h.remove();
      } catch (e) {}
    };
  }, []);

  const [lt, setLt] = useState(false);
  const [top, setTop] = useState(true);
  const [hid, setHid] = useState(false);
  const [open, setOpen] = useState(false);
  const currentPathname = usePathname();
  const path = currentPathname ? (currentPathname.replace(/\/+$/, '') || '/') : '/';

  const L = linkList(links);
  const isAct = (h) => {
    const p = (h || '').replace(/\/+$/, '') || '/';
    if (!path || /^https?:|^#|^mailto:/.test(h)) return false;
    return p === '/' ? path === '/' : path === p || path.startsWith(p + '/');
  };

  const book = pick(ctaLink, site.book || '#contact');
  const avail = pick(availLabel, site.avail || 'Available for work');

  const st = useRef({
    y: 0,
    lastY: 0,
    acc: 0,
    t: 0,
    lt: false,
    top: true,
    hid: false,
    open: false,
    force: true,
  });
  st.current.open = open;

  useEffect(() => {
    if (!live) return;
    const S = st.current;
    let probeV = null;
    let y = 0;

    const onS = () => {
      S.force = true;
    };
    window.addEventListener('scroll', onS, { passive: true });

    const read = (t) => {
      y = window.scrollY || document.documentElement.scrollTop || 0;
      if (!probe || S.open) return;
      if (!S.force && t - S.t < 160) return;
      S.t = t;
      S.force = false;
      const bar = barEl.current;
      const bh = bar ? bar.getBoundingClientRect() : null;
      const yy = bh
        ? Math.max(4, Math.min(bh.bottom - 8, bh.top + bh.height / 2))
        : 36;
      const W = window.innerWidth;
      const vals = [0.18, 0.5, 0.82]
        .map((f) => mvhdGround(W * f, yy))
        .filter((v) => v !== null);
      probeV = vals.length
        ? vals.reduce((a, b) => a + b, 0) / vals.length
        : null;
    };

    const off = onTick(() => {
      const tp = y < 40;
      if (tp !== S.top) {
        S.top = tp;
        setTop(tp);
      }
      if (probeV !== null) {
        const l = probeV > 0.45;
        if (l !== S.lt) {
          S.lt = l;
          setLt(l);
        }
      }
      const d = y - S.lastY;
      S.lastY = y;
      let h = S.hid;
      if (!hideOnScroll || rm || S.open || tp) h = false;
      else {
        if (d > 0 !== S.acc > 0) S.acc = 0;
        S.acc += d;
        if (S.acc > 12) h = true;
        else if (S.acc < -8) h = false;
      }
      if (
        h &&
        barEl.current &&
        barEl.current.contains(document.activeElement)
      )
        h = false;
      if (h !== S.hid) {
        S.hid = h;
        setHid(h);
      }
    }, read);

    return () => {
      off();
      window.removeEventListener('scroll', onS);
    };
  }, [live, probe, hideOnScroll, rm]);

  useEffect(() => {
    if (!host) return;
    const f = (e) => {
      const t = e.target;
      if (t?.closest?.('[data-mvhd]') && st.current.hid) {
        st.current.hid = false;
        st.current.acc = 0;
        setHid(false);
      }
    };
    host.addEventListener('focusin', f);
    return () => host.removeEventListener('focusin', f);
  }, [host]);

  const close = (back = true) => {
    setOpen(false);
    if (back)
      window.setTimeout(() => {
        try {
          burger.current?.focus({ preventScroll: true });
        } catch (e) {}
      }, 30);
  };

  useEffect(() => {
    if (!open) return;
    const h = document.documentElement;
    const b = document.body;
    const ph = h.style.overflow;
    const pb = b.style.overflow;
    const pp = b.style.paddingRight;
    const sbw = window.innerWidth - h.clientWidth;
    h.style.overflow = 'hidden';
    b.style.overflow = 'hidden';
    if (sbw > 0) b.style.paddingRight = `${sbw}px`;
    h.setAttribute('data-mvhd-lock', '');
    const W = window;
    try {
      W.__ltLenis?.stop?.();
    } catch (e) {}

    const focusables = () => {
      const out = [];
      const lg = barEl.current?.querySelector('.mvhd-logo');
      if (lg) out.push(lg);
      if (burger.current) out.push(burger.current);
      drawer.current
        ?.querySelectorAll('a[href],button:not([disabled])')
        .forEach((e) => out.push(e));
      return out;
    };

    const kd = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      const n = e.shiftKey
        ? i <= 0
          ? f.length - 1
          : i - 1
        : i < 0 || i >= f.length - 1
        ? 0
        : i + 1;
      f[n].focus();
    };

    document.addEventListener('keydown', kd, true);
    const t = window.setTimeout(() => {
      try {
        drawer.current
          ?.querySelector('.mvhd-dl a')
          ?.focus({ preventScroll: true });
      } catch (e) {}
    }, 60);

    return () => {
      document.removeEventListener('keydown', kd, true);
      window.clearTimeout(t);
      h.style.overflow = ph;
      b.style.overflow = pb;
      b.style.paddingRight = pp;
      h.removeAttribute('data-mvhd-lock');
      try {
        W.__ltLenis?.start?.();
      } catch (e) {}
    };
  }, [open]);

  useEffect(() => {
    if (!compact && open) setOpen(false);
  }, [compact, open]);

  const [clock, setClock] = useState('--:--');
  useEffect(() => {
    if (!live) return;
    const f = () => {
      try {
        setClock(
          new Intl.DateTimeFormat('en-GB', {
            timeZone: site.tz || 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date())
        );
      } catch (e) {}
    };
    f();
    const id = window.setInterval(f, 15000);
    return () => window.clearInterval(id);
  }, [live, site.tz]);

  const skip = (e) => {
    e.preventDefault();
    const els = Array.from(
      document.querySelectorAll('main, section.mv, section')
    ).filter((x) => !x.closest('[data-mvhd]'));
    const t = els[0];
    if (!t) return;
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
    t.scrollIntoView({ block: 'start' });
  };

  const socials = linkList(site.socials);
  const pad2 = (n) => String(n).padStart(2, '0');
  const cls = `mv mvhd${lt && !open ? ' mv-lt is-lt' : ' mv-dark'}${top && !open ? ' is-top' : ' is-glass'}${hid && !open ? ' is-hid' : ''}${open ? ' is-open' : ''}${phone ? ' is-ph' : compact ? ' is-tab' : ''}${still ? ' is-still' : ''}${rm ? ' is-rm' : ''}`;
  const vars = { ...cssVars(c), ...B };

  const bar = (
    <div data-mvhd="" className={cls} style={vars}>
      <a className="mvhd-skip" href="#main" onClick={skip} style={M}>
        {skipLabel}
      </a>
      <div ref={barEl} className="mvhd-bar">
        <div className="mvhd-in">
          <a
            className="mvhd-logo"
            href="/"
            aria-label={`${site.name} ${homeLabel}`}
            onClick={() => open && close(false)}
          >
            <MvhdMark />
            <span style={Dh}>{site.name}</span>
          </a>
          <nav className="mvhd-nav" aria-label="Main">
            <ul className="mvhd-links">
              {L.map((l, i) => (
                <li key={i}>
                  <a
                    href={l.h}
                    aria-current={isAct(l.h) ? 'page' : undefined}
                    className={isAct(l.h) ? 'is-act' : ''}
                  >
                    <span>{l.l}</span>
                    <i aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mvhd-r">
            <span
              className="mvhd-av"
              tabIndex={0}
              role="note"
              aria-label={avail}
              title={avail}
            >
              <i className="mv-port" aria-hidden />
              <em style={M}>{avail}</em>
            </span>
            {ctaLabel && (
              <Btn
                href={book}
                label={ctaLabel}
                kind="quiet"
                className="mvhd-cta"
              />
            )}
            <button
              ref={burger}
              type="button"
              className="mvhd-bg"
              aria-expanded={open}
              aria-controls="mvhd-drawer"
              aria-label={open ? closeLabel : menuLabel}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="mvhd-bgl" aria-hidden>
                <i />
                <i />
              </span>
              <span className="mvhd-bgt" style={M} aria-hidden>
                {open ? closeLabel : menuLabel}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const drawerEl = mounted ? (
    <div
      data-mvhd=""
      ref={drawer}
      id="mvhd-drawer"
      className={`mv mv-dark mvhd-dr${open ? ' is-open' : ''}${phone ? ' is-ph' : ''}`}
      style={vars}
      role="dialog"
      aria-modal="true"
      aria-label={menuLabel}
      aria-hidden={!open}
      {...(!open ? { inert: '' } : {})}
    >
      <div className="mvhd-dsc">
        <div className="mvhd-dhead" style={M}>
          <i className="mvhd-stripes" aria-hidden />
          <div className="mvhd-dmeta">
            <b>{sheetTitle}</b>
            <span>{sheetRoll}</span>
            <span>{sheetScene}</span>
            <span>{sheetTake}</span>
          </div>
        </div>
        <nav aria-label={menuLabel}>
          <ol className="mvhd-dl">
            {L.map((l, i) => (
              <li key={i} style={{ '--i': i }}>
                <a
                  href={l.h}
                  aria-current={isAct(l.h) ? 'page' : undefined}
                  className={isAct(l.h) ? 'is-act' : ''}
                  onClick={() => close(false)}
                >
                  <em style={M}>{pad2(i + 1)}</em>
                  <span style={Dh}>{l.l}</span>
                  <i aria-hidden>
                    <IcoArrow s={20} />
                  </i>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mvhd-dfoot" style={{ '--i': L.length }}>
          {ctaLabel && (
            <Btn
              href={book}
              label={ctaLabel}
              kind="solid"
              onClick={() => close(false)}
            />
          )}
          <dl className="mvhd-dgrid">
            {site.email && (
              <div>
                <dt style={M}>{emailLabel}</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
            )}
            <div>
              <dt style={M}>{timeLabel}</dt>
              <dd style={M}>
                <i className="mv-port" aria-hidden />
                {clock}
                {site.city ? ` · ${site.city}` : ''}
              </dd>
            </div>
            {socials.length > 0 && (
              <div className="is-wide">
                <dt style={M}>{socialsLabel}</dt>
                <dd className="mvhd-soc">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.h}
                      target="_blank"
                      rel="noopener"
                    >
                      {s.l}
                      <span aria-hidden> ↗</span>
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  ) : null;

  const portal = mounted && !still && typeof document !== 'undefined';

  return (
    <div
      ref={anchor}
      className="mvhd-anchor"
      style={{
        width: '100%',
        height: 0,
        ...(props.style || {}),
        position: 'relative',
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MVHD + siteFontCss(props),
        }}
      />
      {portal && host
        ? createPortal(
            <>
              {bar}
              {drawerEl}
            </>,
            host
          )
        : bar}
    </div>
  );
}

const CSS_MVHD = `
.mvhd{position:fixed;z-index:1001;left:0;right:0;top:0;height:0;color:var(--mv-cloud);font-size:13px;--pad:max(var(--mvg),calc((100% - ${MAXW})/2));--glass:color-mix(in srgb,var(--mv-night) 62%,transparent);--rim:color-mix(in srgb,var(--mv-cloud) 16%,transparent)}
.mvhd.is-lt{color:var(--mv-ink);--glass:color-mix(in srgb,var(--mv-bone) 72%,transparent);--rim:color-mix(in srgb,var(--mv-ink) 13%,transparent)}
.mvhd.is-still{position:absolute}
.mvhd-bar{position:absolute;left:0;right:0;top:0;padding:0;transition:translate .55s cubic-bezier(.7,0,.2,1)}
.mvhd.is-hid .mvhd-bar{translate:0 calc(-100% - 12px)} .mvhd.is-hid:focus-within .mvhd-bar{translate:0 0;transition-duration:0s}
.mvhd-in{display:flex;align-items:center;gap:24px;margin:0 auto;padding:18px var(--pad);border-radius:0;background:transparent;box-shadow:inset 0 0 0 1px transparent;transition:background-color .45s,box-shadow .45s,padding .5s cubic-bezier(.2,.8,.2,1),margin .5s cubic-bezier(.2,.8,.2,1),border-radius .5s,color .3s}
.mvhd.is-glass:not(.is-open) .mvhd-in{margin:10px var(--pad) 0;padding:8px 8px 8px 12px;border-radius:12px;background:var(--glass);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);box-shadow:inset 0 0 0 1px var(--rim),0 12px 34px -18px rgba(0,0,0,.45)}
.mvhd-logo{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:inherit;font-size:17px;letter-spacing:-.02em;font-stretch:112%;white-space:nowrap;border-radius:6px;min-width:0;flex-shrink:1}
.mvhd-logo span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.mvhd-mark{flex:none;transition:rotate .6s cubic-bezier(.34,1.56,.64,1)} .mvhd-logo:hover .mvhd-mark{rotate:-8deg}
/* centre: the glass link bar (the hero nav) with a selection underline */
.mvhd-nav{margin:0 auto}
.mvhd-links{display:flex;gap:2px;list-style:none;margin:0;padding:4px;border-radius:10px;background:var(--glass);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:inset 0 0 0 1px var(--rim);transition:background-color .45s,box-shadow .45s;white-space:nowrap!important}
.mvhd.is-glass .mvhd-links{background:transparent;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none}
.mvhd-links a{position:relative;display:block;padding:8px 14px;border-radius:6px;color:inherit;text-decoration:none;transition:background .25s;white-space:nowrap!important}
.mvhd-links a:hover{background:color-mix(in srgb,currentColor 12%,transparent)}
.mvhd-links a>i{position:absolute;left:14px;right:14px;bottom:3px;height:2px;background:var(--mv-brass);clip-path:inset(0 100% 0 0);transition:clip-path .45s steps(8,end)}
.mvhd-links a>i::before,.mvhd-links a>i::after{content:"";position:absolute;top:-1.5px;width:5px;height:5px;background:var(--mv-cloud);box-shadow:0 0 0 1.2px var(--mv-brass)} .mvhd-links a>i::before{left:-3px} .mvhd-links a>i::after{right:-3px}
.mvhd-links a:hover>i{clip-path:inset(0 0 0 0)} .mvhd-links a:hover>i::before,.mvhd-links a:hover>i::after{opacity:0}
.mvhd-links a.is-act>i{clip-path:inset(0 0 0 0)} .mvhd-links a.is-act>i::before,.mvhd-links a.is-act>i::after{opacity:1}
.mvhd-r{display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0}
.mvhd-nav+.mvhd-r{margin-left:0}
/* availability dot + tooltip */
.mvhd-av{position:relative;display:grid;place-items:center;width:28px;height:28px;border-radius:6px;cursor:help;flex-shrink:0}
.mvhd-av em{position:absolute;right:-6px;top:calc(100% + 10px);padding:6px 9px;border-radius:6px;background:var(--mv-ink);color:var(--mv-cloud);font-style:normal;font-size:12px;letter-spacing:.06em;white-space:nowrap;opacity:0;translate:0 -4px;pointer-events:none;transition:opacity .25s,translate .3s;box-shadow:0 10px 24px -12px rgba(0,0,0,.5)}
.mvhd.is-lt .mvhd-av em{background:var(--mv-ink)}
.mvhd-av:hover em,.mvhd-av:focus-visible em{opacity:1;translate:0 0}
/* burger → ✕ */
.mvhd-bg{appearance:none;border:0;display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:0 12px 0 10px;border-radius:6px;color:inherit;background:color-mix(in srgb,currentColor 10%,transparent);box-shadow:inset 0 0 0 1px var(--rim);cursor:pointer;font:inherit;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);white-space:nowrap!important;flex-shrink:0!important;min-width:max-content}
.mvhd-bgl{position:relative;width:18px;height:12px;flex-shrink:0} .mvhd-bgl i{position:absolute;left:0;right:0;height:2px;border-radius:1px;background:currentColor;transition:top .35s cubic-bezier(.7,0,.2,1),rotate .45s cubic-bezier(.7,0,.2,1) .1s}
.mvhd-bgl i:first-child{top:1px} .mvhd-bgl i:last-child{top:9px}
.mvhd.is-open .mvhd-bgl i{top:5px} .mvhd.is-open .mvhd-bgl i:first-child{rotate:45deg} .mvhd.is-open .mvhd-bgl i:last-child{rotate:-45deg}
.mvhd-bgt{font-size:12px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap!important;display:inline-block;line-height:1}
.mvhd.is-open{color:var(--mv-cloud)} .mvhd.is-open .mvhd-bg{background:var(--mv-brass);color:var(--mv-ink);box-shadow:none}
.mvhd.is-open .mvhd-av,.mvhd.is-open .mvhd-cta{opacity:0;pointer-events:none;visibility:hidden}
@media (max-width:1099px){
  .mvhd-nav{display:none!important}
  .mvhd-bg{display:inline-flex!important}
  .mvhd-in{justify-content:space-between!important;width:100%!important}
  .mvhd-r,.mvhd-nav+.mvhd-r{margin-left:auto!important;display:flex!important;align-items:center!important;gap:10px!important;flex-shrink:0!important}
}
@media (min-width:1100px){
  .mvhd-bg{display:none!important}
  .mvhd-nav{display:flex!important}
}
@media (max-width:809px){
  .mvhd-cta{display:none!important}
  .mvhd-in{justify-content:space-between!important;padding:8px 14px!important;gap:10px!important;width:100%!important}
  .mvhd.is-glass:not(.is-open) .mvhd-in{margin:8px 12px 0!important;padding:6px 10px!important;justify-content:space-between!important;width:calc(100% - 24px)!important}
  .mvhd-r,.mvhd-nav+.mvhd-r{margin-left:auto!important;flex-shrink:0!important;display:flex!important;align-items:center!important;gap:10px!important}
  .mvhd-logo{font-size:15px;min-width:0;flex-shrink:1}
  .mvhd-logo span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:clamp(140px,46vw,220px)}
}
.mvhd.is-ph .mvhd-in{justify-content:space-between!important;padding:8px 14px!important;gap:10px!important;width:100%!important}
.mvhd.is-ph.is-glass:not(.is-open) .mvhd-in{margin:8px 12px 0!important;padding:6px 10px!important;justify-content:space-between!important;width:calc(100% - 24px)!important}
.mvhd.is-ph .mvhd-r,.mvhd.is-ph .mvhd-nav+.mvhd-r{margin-left:auto!important;flex-shrink:0!important;display:flex!important;align-items:center!important;gap:10px!important}
.mvhd.is-ph .mvhd-logo{font-size:15px;min-width:0;flex-shrink:1}
.mvhd.is-ph .mvhd-logo span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:clamp(140px,46vw,220px)}
@media (max-width:400px){.mvhd-logo span{max-width:clamp(120px,40vw,160px)}}
@media (max-width:340px){.mvhd .mvhd-bgt{display:none} .mvhd .mvhd-bg{padding:0 8px}}
/* skip link */
.mvhd-skip{position:absolute;left:12px;top:-60px;z-index:3;padding:10px 14px;border-radius:6px;background:var(--mv-brass);color:var(--mv-ink);font-size:12px;letter-spacing:.06em;text-decoration:none}
.mvhd-skip:focus{top:10px}
/* THE DRAWER — a call sheet on the night ground */
.mvhd-dr{position:fixed;z-index:1000;inset:0;background:var(--mv-night);color:var(--mv-cloud);visibility:hidden;clip-path:inset(0 0 100% 0);transition:clip-path .7s cubic-bezier(.7,0,.2,1),visibility 0s linear .7s;--line:color-mix(in srgb,var(--mv-cloud) 14%,transparent)}
.mvhd-dr.is-open{visibility:visible;clip-path:inset(0 0 0 0);transition:clip-path .7s cubic-bezier(.7,0,.2,1),visibility 0s}
.mvhd-dr::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(90% 60% at 85% 0%,rgba(255,226,180,.10),transparent 60%)}
.mvhd-dsc{position:relative;height:100%;overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:clamp(20px,4vh,40px);padding:clamp(84px,12vh,112px) clamp(20px,5vw,48px) 28px}
.mvhd-dhead{display:flex;flex-direction:column;gap:12px;font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.mvhd-stripes{display:block;height:14px;border-radius:3px;background:repeating-linear-gradient(118deg,var(--mv-cloud) 0 18px,var(--mv-ink) 18px 36px);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--mv-cloud) 70%,transparent);transform-origin:0 100%;rotate:-6deg;transition:rotate .35s cubic-bezier(.7,0,1,.6) .5s}
.mvhd-dr.is-open .mvhd-stripes{rotate:0deg}
.mvhd-dmeta{display:flex;flex-wrap:wrap;gap:6px 18px;padding-bottom:12px;border-bottom:1.5px solid color-mix(in srgb,var(--mv-cloud) 70%,transparent);color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)} .mvhd-dmeta b{font-weight:500;color:var(--mv-brass)}
.mvhd-dl{list-style:none;margin:0;padding:0}
.mvhd-dl li{border-bottom:1px solid var(--line);overflow:hidden}
.mvhd-dl a{display:flex;align-items:baseline;gap:clamp(12px,3vw,24px);padding:clamp(8px,1.6vh,14px) 0;color:inherit;text-decoration:none;opacity:0;translate:0 70%;transition:opacity .5s ease,translate .7s cubic-bezier(.2,.85,.15,1),color .25s}
.mvhd-dr.is-open .mvhd-dl a{opacity:1;translate:0 0;transition-delay:calc(.28s + var(--i)*.06s),calc(.28s + var(--i)*.06s),0s}
.mvhd-dl em{flex:none;width:2.2em;font-style:normal;font-size:12px;letter-spacing:.1em;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvhd-dl span{font-size:clamp(34px,10vw,64px);line-height:1;letter-spacing:-.045em;font-stretch:115%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mvhd-dl i{margin-left:auto;align-self:center;opacity:.4;transition:opacity .3s,rotate .45s cubic-bezier(.34,1.56,.64,1)}
.mvhd-dl a:hover i,.mvhd-dl a:focus-visible i{opacity:1;rotate:-45deg}
.mvhd-dl a.is-act{color:var(--mv-brass)} .mvhd-dl a.is-act em{color:var(--mv-brass)}
.mvhd-dfoot{display:flex;flex-direction:column;gap:22px;opacity:0;translate:0 16px;transition:opacity .5s ease,translate .7s cubic-bezier(.2,.85,.15,1)}
.mvhd-dr.is-open .mvhd-dfoot{opacity:1;translate:0 0;transition-delay:calc(.34s + var(--i)*.06s)}
.mvhd-dfoot .mv-btn{align-self:flex-start}
.mvhd-dgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 20px;margin:0} .mvhd-dgrid .is-wide{grid-column:1/-1}
.mvhd-dgrid dt{margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--mv-cloud) 78%,transparent)}
.mvhd-dgrid dd{display:flex;align-items:center;gap:8px;margin:0;font-size:15px;overflow-wrap:anywhere} .mvhd-dgrid a{color:inherit;text-underline-offset:3px}
.mvhd-soc{flex-wrap:wrap;gap:8px 18px!important} .mvhd-soc a{text-decoration:none;padding:4px 0} .mvhd-soc a:hover{color:var(--mv-brass)}
.mvhd-dr.is-ph .mvhd-dgrid{grid-template-columns:minmax(0,1fr)}
@media (prefers-reduced-motion:reduce){.mvhd-bar,.mvhd-in,.mvhd-dr,.mvhd-dl a,.mvhd-dfoot,.mvhd-stripes,.mvhd-bgl i{transition:none!important}}
`;
