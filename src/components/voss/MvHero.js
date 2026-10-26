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
  useStage,
  useMagnet,
  onTick,
  rise,
  plainOf,
  linkList,
  pick,
  srcOf,
  Btn,
  CSS_BASE,
  MAXW,
} from './scaffold';
import { siteData, defaultBackdrops } from './siteData';

const P_AR = 1152 / 1500;

const Mark = ({ s = 26 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 32 32"
    aria-hidden
    className="mvp-mark"
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

const lumOf = (hex) => {
  const m = String(hex || '')
    .replace('#', '')
    .match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return 0;
  const [r, g, b] = [m[1], m[2], m[3]].map((x) => {
    const v = parseInt(x, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const parseBd = (s, fb) => {
  const out = String(s || '')
    .split(';')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const [n, cc] = x.split(':').map((y) => y.trim());
      const col = /^#[0-9a-f]{6}$/i.test(cc || '') ? cc : fb;
      return { name: n || 'Backdrop', bg: col, light: lumOf(col) > 0.28 };
    });
  return out.length ? out : [{ name: 'Graphite', bg: fb, light: false }];
};

export default function MvHero(props = {}) {
  const {
    portrait = siteData.portrait || siteData.templatePortrait,
    nameText = siteData.heroDisplayName || 'SHEELASH',
    roleLine = siteData.roleLine || 'Product designer|& developer',
    statement = siteData.statement || siteData.tagline,
    primary = 'See my work',
    primaryLink = '/work',
    secondary = 'View résumé',
    secondaryLink = '/resume',
    backdrops = defaultBackdrops,

    lightLabel = 'Light',
    showNav = false,
    navLinks = 'Work:/work, About:/about, Resume:/resume, Contact:/contact',
    navCta = 'Hire me',
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
  const stage = useRef(null);
  const nameEl = useRef(null);
  const curEl = useRef(null);
  const { w, vh } = useSize(root, bpHint);
  const ready = useStage(live);
  const [inn0, setIn] = useState(false);

  useEffect(() => {
    if (!live || !ready) return;
    const t = window.setTimeout(() => setIn(true), 80);
    return () => window.clearTimeout(t);
  }, [live, ready]);

  const inn = inn0 || still || rm;
  useMagnet(root, live);

  const phone = w < 810,
    tab = w >= 810 && w < 1100;
  const H = phone ? 0 : Math.round(Math.min(Math.max(vh, 720), 1120));
  const BDS = parseBd(backdrops, '#18181B');
  const [bi, setBi] = useState(0);
  const bd = BDS[bi % BDS.length];
  const [flash, setFlash] = useState(0);
  const [hasCur, setHasCur] = useState(false);

  const name = pick(nameText, site.heroDisplayName || 'SHEELASH').toUpperCase();
  const src = srcOf(portrait, site.templatePortrait);
  const statementT = pick(statement, site.statement || site.tagline || '');
  const resume = pick(secondaryLink, site.resume || '/Sheelash Singh Bhadoriya - Resume.pdf');

  const nextRef = useRef(() => { });
  nextRef.current = () => {
    setBi((i) => (i + 1) % BDS.length);
    setFlash((f) => f + 1);
  };

  // High-performance responsive typographic scale: perfectly proportioned, zero FOVU, zero layout shift
  const chars = Array.from(name);
  const charCount = Math.max(chars.length, 1);
  const cqwTarget = Math.min(16.5, Math.max(7.0, 122 / charCount));
  const maxPx = Math.round(cqwTarget * 14.2);
  const minPx = phone ? 42 : 64;
  const fsStyle = `clamp(${minPx}px, ${cqwTarget.toFixed(2)}cqw, ${maxPx}px)`;

  // key light: pointer (or orbit when idle / touch)
  useEffect(() => {
    if (!live || !root.current || !stage.current || !nameEl.current) return;
    const r = root.current,
      st = stage.current,
      nm = nameEl.current;
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    let W = 1,
      Hh = 1,
      letters = [];

    const measure = () => {
      const a = st.getBoundingClientRect();
      W = a.width;
      Hh = a.height;
      letters = Array.from(nm.querySelectorAll('.mvp-l')).map((el) => {
        const b = el.getBoundingClientRect();
        return {
          el,
          x: b.left - a.left + b.width / 2,
          y: b.top - a.top + b.height / 2,
        };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(st);
    const t1 = window.setTimeout(measure, 900),
      t2 = window.setTimeout(measure, 2400);

    let lx = W * 0.72,
      ly = Hh * 0.22,
      tx = lx,
      ty = ly,
      last = -1e9,
      sl = 0,
      stp = 0;

    const mv = (e) => {
      const a = st.getBoundingClientRect();
      tx = e.clientX - a.left;
      ty = e.clientY - a.top;
      last = performance.now();
    };

    const dn = (e) => {
      const tg = e.target;
      if (tg.closest?.('a,button,nav,input')) return;
      if (!rm) nextRef.current();
    };

    r.addEventListener('pointermove', mv);
    r.addEventListener('pointerdown', dn);
    const t0 = performance.now();

    const off = onTick(() => {
      const now = performance.now(),
        ts = (now - t0) / 1000;
      const idle = !fine || now - last > 3000;
      if (idle) {
        const q = ts * 0.32;
        tx = W * (0.5 + 0.3 * Math.cos(q));
        ty = Hh * (0.34 + 0.2 * Math.sin(q * 1.3));
      }
      const k = idle ? 0.035 : 0.14;
      lx += (tx - lx) * k;
      ly += (ty - ly) * k;
      const cx = W * 0.5,
        cy = Hh * 0.46;
      let dx = lx - cx,
        dy = ly - cy;
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl;
      dy /= dl;
      const px = lx / W - 0.5,
        py = ly / Hh - 0.5;

      r.style.setProperty('--lx', `${lx.toFixed(1)}px`);
      r.style.setProperty('--ly', `${ly.toFixed(1)}px`);
      r.style.setProperty('--bx', `${(dx * 6).toFixed(2)}px`);
      r.style.setProperty('--by', `${(dy * 6).toFixed(2)}px`);
      r.style.setProperty('--sx', `${(-dx * 46).toFixed(1)}px`);
      r.style.setProperty('--sy', `${(-dy * 22 + 10).toFixed(1)}px`);
      r.style.setProperty('--ppx', `${(px * -18).toFixed(2)}px`);
      r.style.setProperty('--ppy', `${(py * -8).toFixed(2)}px`);
      r.style.setProperty('--wpx', `${(px * 14).toFixed(2)}px`);
      r.style.setProperty('--wpy', `${(py * 6).toFixed(2)}px`);

      const ph = Hh * (phone ? 0.96 : tab ? 0.74 : 0.94),
        pw = ph * P_AR,
        pl = W * (tab ? 0.6 : 0.5) - pw / 2;

      r.style.setProperty('--kx', `${(((lx - pl) / pw) * 100).toFixed(1)}%`);
      r.style.setProperty(
        '--ky',
        `${(((ly - (Hh - ph)) / ph) * 100).toFixed(1)}%`
      );

      const sg = W * 0.2;
      for (const L of letters) {
        const d = Math.hypot(L.x - lx, L.y - ly);
        const t = Math.exp(-(d * d) / (2 * sg * sg));
        L.el.style.setProperty('--t', t.toFixed(3));
      }

      const cu = curEl.current;
      if (cu) cu.style.opacity = idle ? '0' : '1';
      if (cu && !idle) {
        if (now - stp > 250) {
          const a = st.getBoundingClientRect();
          sl = a.left;
          stp = now;
          cu.__top = a.top;
        }
        cu.style.transform = `translate3d(${(lx + sl).toFixed(1)}px,${(ly + (cu.__top || 0)).toFixed(1)}px,0)`;
      }
    });

    return () => {
      off();
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      r.removeEventListener('pointermove', mv);
      r.removeEventListener('pointerdown', dn);
    };
  }, [live, rm, phone, tab, name]);

  useEffect(() => {
    if (
      !live ||
      phone ||
      !window.matchMedia('(hover:hover) and (pointer:fine)').matches
    )
      return;
    setHasCur(true);
  }, [live, phone]);

  const [curMode, setCurMode] = useState('light');
  const [clock, setClock] = useState('');

  useEffect(() => {
    if (!live) return;
    const f = () => {
      try {
        setClock(
          new Intl.DateTimeFormat('en-GB', {
            timeZone: site.tz || 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date())
        );
      } catch (e) { }
    };
    f();
    const id = window.setInterval(f, 20000);
    return () => window.clearInterval(id);
  }, [live, site.tz]);

  const links = linkList(navLinks);

  return (
    <section
      ref={root}
      className={`mv mvp ${bd.light ? 'mv-lt is-lightbd' : 'mv-dark'}${phone ? ' is-ph' : tab ? ' is-tab' : ''}${inn ? ' is-in' : ''}${still ? ' is-still' : ''}${rm ? ' is-rm' : ''}${hasCur ? ' has-cur' : ''}${showNav ? '' : ' no-nav'}`}
      style={{
        ...cssVars(c),
        ...B,
        '--hh': H ? `${H}px` : 'auto',
        '--bd': bd.bg,
        '--pimg': `url("${src}")`,
        '--fs': fsStyle,
        ...(props.style || {}),
      }}
      aria-label={`${site.name} — ${site.role}`}
      onPointerOver={(e) => {
        const t = e.target;
        const m = t.closest?.('a,button') ? 'btn' : 'light';
        if (m !== curMode) setCurMode(m);
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_HERO + siteFontCss(props),
        }}
      />
      {showNav && (
        <nav
          className="mvp-nav"
          aria-label="Main"
          style={rise(inn, 60, -10)}
        >
          <a
            className="mvp-logo"
            href="/"
            aria-label={`${site.name} home`}
          >
            <Mark />
            <span style={D}>{site.name}</span>
          </a>
          <ul className="mvp-links">
            {links.map((l, i) => (
              <li key={i}>
                <a href={l.h}>{l.l}</a>
              </li>
            ))}
          </ul>
          <Btn
            href={site.book || '#contact'}
            label={navCta}
            kind="quiet"
            className="mvp-navcta"
          />
        </nav>
      )}
      <div ref={stage} className="mvp-stage">
        <div className="mvp-wall" aria-hidden />
        <h1 ref={nameEl} className="mvp-name" style={D}>
          <span className="mvp-nm" aria-hidden>
            {chars.map((ch, i) =>
              ch === ' ' ? (
                phone ? (
                  <span key={i} className="mvp-br" />
                ) : (
                  <span key={i} className="mvp-sp">
                    {' '}
                  </span>
                )
              ) : (
                <span
                  key={i}
                  className="mvp-l"
                  style={{
                    transitionDelay: `${150 + i * 45}ms`,
                  }}
                >
                  <span>{ch}</span>
                </span>
              )
            )}
          </span>
          <span className="mv-sr">
            {site.name}, {plainOf(roleLine)}
          </span>
        </h1>
        <div className="mvp-shadow" aria-hidden />
        <div className="mvp-back" aria-hidden />
        <div className="mvp-person" aria-hidden>
          <i className="mvp-p" />
          <i className="mvp-key" />
        </div>
        <i className="mvp-grain" aria-hidden />
        <i
          key={flash}
          className={`mvp-flash${flash ? ' is-go' : ''}`}
          aria-hidden
        />
      </div>
      <div className="mvp-copy" style={rise(inn, 700, 16)}>
        <p className="mvp-role" style={D}>
          {String(roleLine)
            .split('|')
            .map((l, i) => (
              <span key={i}>{l}</span>
            ))}
        </p>
        {statementT && <p className="mvp-st">{statementT}</p>}
        <div className="mvp-btns">
          <Btn
            href={primaryLink || '/work'}
            label={primary}
            kind="solid"
          />
          <Btn
            href={resume}
            label={secondary}
            kind="ghost"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </div>
      <div className="mvp-meta" style={{ ...M, ...rise(inn, 850, 12) }}>
        <div className="mvp-avail-row">
          <p className="mvp-avail-tag">
            <i className="mv-port" aria-hidden />
            {site.avail || 'Available for work'}
          </p>
          <a
            href="https://www.linkedin.com/in/sheelash-singh-bhadoriya-5a941818b/"
            target="_blank"
            rel="noopener noreferrer"
            className="mvp-linkedin-badge"
            title="Sheelash Singh on LinkedIn"
            aria-label="Sheelash on LinkedIn"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
            <span className="mvp-arr-icon" aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="mvp-dim">
          {site.city}
          {clock ? ` · ${clock}` : ''}
        </p>
        {site.years && (
          <p className="mvp-dim">{site.years} years of Experience</p>
        )}
      </div>
      <div className="mvp-bar" style={{ ...M, ...rise(inn, 1000, 10) }}>
        <div
          className="mvp-sw"
          role="group"
          aria-label="Backdrop colour"
        >
          {BDS.map((b, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${b.name} backdrop`}
              aria-pressed={i === bi % BDS.length}
              className={i === bi % BDS.length ? 'is-on' : ''}
              onClick={() => {
                setBi(i);
                setFlash((f) => f + 1);
              }}
            >
              <i style={{ background: b.bg }} />
            </button>
          ))}
        </div>
      </div>
      {hasCur && (
        <div
          ref={curEl}
          className="mvp-cur"
          data-m={curMode}
          aria-hidden
        >
          <i />
          <b style={M}>{lightLabel}</b>
        </div>
      )}
    </section>
  );
}

const CSS_HERO = `
.mvp{position:relative;width:100%;height:var(--hh,100svh);min-height:680px;overflow:hidden;background:var(--bd);color:var(--mv-cloud);isolation:isolate;transition:background-color .7s cubic-bezier(.2,.8,.2,1);--nm-dim:color-mix(in srgb,var(--bd) 56%,#fff);--nm-lit:#F6F5F1;--wall-light:rgba(255,236,210,.26);--shade:rgba(0,0,0,.55)}
.mvp.is-lightbd{color:var(--mv-ink);--nm-dim:color-mix(in srgb,var(--bd) 45%,#000);--nm-lit:#0E0E10;--wall-light:rgba(255,255,255,.55);--shade:rgba(0,0,0,.34)}
.mvp.has-cur{cursor:none} .mvp.has-cur :is(a,button){cursor:pointer}
.mvp-stage{position:absolute;inset:0;z-index:0;container-type:size}
.mvp-wall{position:absolute;inset:-4%;transform:translate3d(var(--wpx,0),var(--wpy,0),0);background:radial-gradient(circle min(46vw,640px) at calc(var(--lx,72%) + 4%) calc(var(--ly,22%) + 4%),var(--wall-light),transparent 70%),radial-gradient(120% 80% at 50% 110%,rgba(0,0,0,.28),transparent 60%)}
.mvp-name{position:absolute;left:0;right:0;top:calc(64% + 10px);margin:0 auto;padding:0 clamp(20px,4vw,60px);box-sizing:border-box;max-width:100%;display:flex;justify-content:center;align-items:center;font-size:var(--fs,clamp(64px,15.25cqw,220px));line-height:.88;letter-spacing:-.03em;font-weight:900;white-space:nowrap;transform:translate3d(var(--wpx,0),var(--wpy,0),0);pointer-events:none;z-index:3;user-select:none}
.mvp-nm{display:inline-flex;align-items:baseline;justify-content:center;white-space:nowrap}
.mvp-l{display:inline-block;position:relative;overflow:hidden;vertical-align:bottom;padding:.02em .04em .06em;margin:0 -.01em;--t:0}
.mvp-l>span{display:inline-block;color:color-mix(in srgb,var(--nm-lit) calc(var(--t) * 100%),var(--nm-dim));translate:0 calc(var(--t) * -.05em);transform:translateY(115%);opacity:0;filter:blur(6px);transition:transform 1.0s cubic-bezier(.16,1,.3,1),opacity .8s ease,filter .8s ease,color .15s linear;transition-delay:inherit;will-change:transform,opacity,filter}
.mvp.is-in .mvp-l>span{transform:translateY(0%);opacity:1;filter:blur(0px)}
.mvp-sp{display:inline-block;width:.24em}
.mvp.is-still .mvp-l>span,.mvp.is-rm .mvp-l>span{transform:none!important;opacity:1!important;filter:none!important;transition:none!important;color:color-mix(in srgb,var(--nm-lit) 55%,var(--nm-dim))}
.mvp-shadow,.mvp-person,.mvp-back{position:absolute;left:50%;bottom:0;height:94%;aspect-ratio:${P_AR};translate:-50% 0}
.mvp-shadow{background:var(--shade);-webkit-mask:var(--pimg) center bottom/contain no-repeat;mask:var(--pimg) center bottom/contain no-repeat;filter:blur(14px);transform:translate3d(calc(var(--ppx,0px) + var(--sx,-30px)),calc(var(--ppy,0px) + var(--sy,10px)),0) scale(1.02);transform-origin:50% 100%;opacity:0;transition:opacity 1.4s ease .6s}
.mvp.is-in .mvp-shadow{opacity:1}
.mvp-person{transform:translate3d(var(--ppx,0),var(--ppy,0),0);opacity:0;scale:1.04;transition:opacity 1.1s ease .15s,scale 1.8s cubic-bezier(.2,.8,.2,1) .15s}
.mvp.is-in .mvp-person{opacity:1;scale:1}
.mvp-person i{position:absolute;inset:0;-webkit-mask:var(--pimg) center bottom/contain no-repeat;mask:var(--pimg) center bottom/contain no-repeat}
.mvp-person .mvp-p{background:var(--pimg) center bottom/contain no-repeat;-webkit-mask:none;mask:none;filter:brightness(.9) contrast(1.04)}
.mvp-key{background:radial-gradient(60% 60% at var(--kx,70%) var(--ky,20%),rgba(255,236,208,.55),transparent 70%);mix-blend-mode:soft-light}
.mvp-back{background:#FFE9CC;-webkit-mask:var(--pimg) center bottom/contain no-repeat;mask:var(--pimg) center bottom/contain no-repeat;filter:blur(10px);transform:translate3d(calc(var(--ppx,0px) + var(--bx,4px)),calc(var(--ppy,0px) + var(--by,-3px)),0);opacity:0;transition:opacity 1.2s ease .5s;display:none}
.mvp-grain{position:absolute;inset:0;pointer-events:none;opacity:.08;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
.mvp-flash{position:absolute;inset:0;pointer-events:none;background:#fff;opacity:0} .mvp-flash.is-go{animation:mvp-flash .55s ease-out}
@keyframes mvp-flash{0%{opacity:.75}100%{opacity:0}}
.mvp-nav{position:absolute;z-index:6;left:0;right:0;top:0;display:flex;align-items:center;gap:24px;padding:18px max(var(--mvg),calc((100% - ${MAXW})/2))}
.mvp-logo{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-size:17px;letter-spacing:-.02em;font-weight:700;font-stretch:112%}
.mvp-links{display:flex;gap:2px;list-style:none;margin:0 auto;padding:4px;border-radius:10px;background:color-mix(in srgb,var(--bd) 70%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 16%,transparent)}
.mvp-links a{display:block;padding:8px 14px;border-radius:7px;font-size:13px;text-decoration:none;transition:background .25s,color .25s} .mvp-links a:hover{background:color-mix(in srgb,currentColor 14%,transparent)}
.mvp-copy{position:absolute;z-index:5;left:max(var(--mvg),calc((100% - ${MAXW})/2));top:clamp(116px,17%,190px);width:min(380px,28vw);display:flex;flex-direction:column;gap:20px}
.mvp-role{margin:0;display:flex;flex-direction:column;font-size:clamp(28px,2.6vw,42px);line-height:1;letter-spacing:-.035em;font-weight:700;font-stretch:112%}
.mvp-st{margin:0;font-size:16px;line-height:1.55;opacity:.86}
.mvp-btns{display:flex;flex-direction:column;align-items:flex-start;gap:10px} .mvp:not(.is-ph):not(.is-tab) .mvp-btns{flex-direction:row;flex-wrap:wrap}
.mvp-meta{position:absolute;z-index:5;right:max(var(--mvg),calc((100% - ${MAXW})/2));top:clamp(120px,17.5%,194px);display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-size:12px;text-align:right} .mvp-meta p{display:flex;align-items:center;gap:8px;margin:0} .mvp-dim{opacity:.78}
.mvp-avail-row{display:flex;align-items:center;justify-content:flex-end;gap:9px;flex-wrap:wrap}
.mvp-avail-tag{display:flex;align-items:center;gap:8px;margin:0}
.mvp-linkedin-badge{display:inline-flex;align-items:center;gap:6px;padding:3.5px 10px 3.5px 8px;border-radius:999px;font-size:11.5px;font-weight:600;letter-spacing:.02em;text-decoration:none;color:inherit;background:color-mix(in srgb,var(--bd) 72%,transparent);border:1px solid color-mix(in srgb,currentColor 22%,transparent);box-shadow:0 2px 8px rgba(0,0,0,.14);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:all .22s cubic-bezier(.2,.8,.2,1);pointer-events:auto}
.mvp-linkedin-badge svg{display:block;flex-shrink:0;transition:transform .22s ease}
.mvp-linkedin-badge .mvp-arr-icon{font-size:11px;opacity:.75;transition:transform .22s ease}
.mvp-linkedin-badge:hover{background:#0A66C2;color:#FFFFFF;border-color:#0A66C2;transform:translateY(-1px);box-shadow:0 6px 18px rgba(10,102,194,.38)}
.mvp-linkedin-badge:hover svg{transform:scale(1.08)}
.mvp-linkedin-badge:hover .mvp-arr-icon{opacity:1;transform:translate(1.5px,-1.5px)}
.mvp-bar{position:absolute;z-index:5;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:0 max(var(--mvg),calc((100% - ${MAXW})/2)) 26px;font-size:12px;pointer-events:none} .mvp-bar>*{pointer-events:auto}
.mvp-hint{display:flex;align-items:center;gap:10px;margin:0;padding:7px 12px;border-radius:8px;background:color-mix(in srgb,var(--bd) 60%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)} .mvp-hint i{width:10px;height:10px;border-radius:50%;background:#FFE9C7;box-shadow:0 0 12px 3px rgba(255,226,180,.8)}
.mvp-sw{display:flex;align-items:center;gap:6px;position:absolute;left:50%;bottom:22px;translate:-50% 0;padding:5px 6px 5px 12px;border-radius:10px;background:color-mix(in srgb,var(--bd) 60%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 16%,transparent)}
.mvp-sw-l{margin-right:4px;opacity:.8}
.mvp-sw button{appearance:none;border:0;background:none;padding:4px;border-radius:7px;cursor:pointer} .mvp-sw button i{display:block;width:22px;height:22px;border-radius:5px;box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 30%,transparent)} .mvp-sw button.is-on{box-shadow:0 0 0 1.5px currentColor}
.mvp-cur{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;will-change:transform;opacity:0;transition:opacity .3s}
.mvp-cur i{position:absolute;left:0;top:0;width:18px;height:18px;translate:-50% -50%;border-radius:50%;background:#FFF1DA;box-shadow:0 0 22px 8px rgba(255,226,180,.55),0 0 0 6px rgba(255,241,218,.18);transition:scale .3s cubic-bezier(.34,1.56,.64,1)}
.mvp-cur b{position:absolute;left:16px;top:10px;padding:3px 7px;border-radius:5px;background:#FFF1DA;color:#111113;font-size:12px;font-weight:500;white-space:nowrap;transition:opacity .2s}
.mvp-cur[data-m="btn"] i{scale:.45} .mvp-cur[data-m="btn"] b{opacity:0}
.mvp.is-tab .mvp-shadow,.mvp.is-tab .mvp-person,.mvp.is-tab .mvp-back{height:74%;left:60%} .mvp.is-tab .mvp-meta{display:none} .mvp.is-tab .mvp-name{top:calc(63% + 30px)} .mvp.is-tab .mvp-links{display:none} .mvp.is-tab .mvp-navcta{margin-left:auto} .mvp.is-tab .mvp-hint{display:none} .mvp.is-tab .mvp-copy{width:min(300px,34vw)} .mvp.is-tab .mvp-role{font-size:30px} .mvp.is-tab .mvp-st{display:none}
.mvp.is-ph{height:auto;min-height:0;display:flex;flex-direction:column} .mvp.is-ph.no-nav{padding-top:54px}
.mvp.is-ph .mvp-nav{position:relative;padding:12px var(--mvg);gap:10px} .mvp.is-ph .mvp-links{display:none} .mvp.is-ph .mvp-navcta{margin-left:auto}
.mvp.is-ph .mvp-stage{position:relative;inset:auto;height:clamp(400px,56vh,520px);flex:none;overflow:hidden}
.mvp.is-ph{--nm-dim:color-mix(in srgb,var(--bd) 56%,#fff)} .mvp.is-ph.is-lightbd{--nm-dim:color-mix(in srgb,var(--bd) 45%,#000)}
.mvp.is-ph .mvp-name{position:absolute!important;left:0!important;right:0!important;top:auto!important;bottom:clamp(14px,3vh,26px)!important;line-height:.88!important;font-size:clamp(42px,14.5vw,70px)!important;padding:0 8px;box-sizing:border-box;letter-spacing:-.035em;white-space:nowrap!important;z-index:10!important;display:flex!important;justify-content:center!important;pointer-events:none;filter:drop-shadow(0 4px 18px rgba(0,0,0,0.55))}
.mvp.is-ph .mvp-nm{flex-wrap:nowrap!important;justify-content:center;white-space:nowrap!important;display:inline-flex!important}
.mvp.is-ph .mvp-shadow,.mvp.is-ph .mvp-person,.mvp.is-ph .mvp-back{height:96%;bottom:0;left:50%;translate:-50% 0}
.mvp.is-ph .mvp-copy{position:relative;left:auto;top:auto;width:auto;padding:18px var(--mvg) 10px;display:flex;flex-direction:column;gap:12px}
.mvp.is-ph .mvp-role{font-size:clamp(25px,6.8vw,32px);line-height:1.1;letter-spacing:-.03em;margin:0}
.mvp.is-ph .mvp-st{font-size:14px;line-height:1.5;opacity:.84;margin:0}
.mvp.is-ph .mvp-btns{display:flex;flex-direction:row;align-items:center;gap:10px;width:100%}
.mvp.is-ph .mvp-btns .mv-btn{flex:1 1 0;min-height:46px;width:auto}
.mvp.is-ph .mvp-meta{position:relative;right:auto;top:auto;align-items:flex-start;text-align:left;padding:12px var(--mvg) 0}
.mvp.is-ph .mvp-avail-row{justify-content:flex-start}
.mvp.is-ph .mvp-bar{position:relative;padding:12px var(--mvg) 20px} .mvp.is-ph .mvp-sw{position:static;translate:none}
@media (max-width:809px){
  .mvp{height:auto!important;min-height:0!important;display:flex!important;flex-direction:column!important}
  .mvp .mvp-stage{position:relative!important;inset:auto!important;height:clamp(400px,56vh,520px)!important;flex:none!important;overflow:hidden!important}
  .mvp .mvp-name{position:absolute!important;left:0!important;right:0!important;top:auto!important;bottom:clamp(14px,3vh,26px)!important;line-height:.88!important;font-size:clamp(42px,14.5vw,70px)!important;padding:0 8px!important;white-space:nowrap!important;z-index:10!important;display:flex!important;justify-content:center!important;filter:drop-shadow(0 4px 18px rgba(0,0,0,0.55))!important}
  .mvp .mvp-shadow,.mvp .mvp-person,.mvp .mvp-back{height:96%!important;bottom:0!important;left:50%!important;translate:-50% 0!important}
}
@media (max-width:480px){
  .mvp.is-ph .mvp-btns{flex-direction:column;align-items:stretch}
  .mvp.is-ph .mvp-btns .mv-btn{width:100%}
}
@media (max-width:1240px){.mvp-links a{padding:8px 10px}}
`;
