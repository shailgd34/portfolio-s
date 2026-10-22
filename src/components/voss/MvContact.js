'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FONTS,
  MAXW,
  useFonts,
  useStill,
  useLive,
  useSize,
  useReduced,
  colorsOf,
  cssVars,
  siteFontCss,
  fontsOf,
  Glyph,
  Btn,
  useMagnet,
  CSS_BASE,
  CSS_MOTION,
  useScrollVars,
  useOn,
  Head,
  Eyebrow,
  rise,
  linkList,
  pick,
  openState,
  IcoArrow,
} from './scaffold';
import {
  siteData,
  defaultServices,
  defaultContactHours,
} from './siteData';

const coPad = (n) => String(n).padStart(2, '0');
const coEmailOk = (s) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim());

const CO_EMPTY = {
  name: '',
  email: '',
  company: '',
  subject: '',
  description: '',
  hp: '',
};

export default function MvContact(props = {}) {
  const {
    eyebrow = 'Contact — Take 1',
    title = "Let's make|something *good*.",
    lead = 'Tell me about the product, the team and the timeline. I read every brief personally and reply within one working day.',
    sheetLabel = 'Booking sheet',
    sheetNo = 'No. 0142',
    requiredNote = '* required',
    nameLabel = 'Your name',
    emailLabel = 'Email',
    companyLabel = 'Company',
    subjectLabel = 'Subject',
    descriptionLabel = 'Description',
    descriptionHint = 'Tell me about your project, requirements, and timeline...',
    errName = 'Please add your name.',
    errEmail = 'Please add an email I can reply to.',
    errSubject = 'Please add a subject.',
    errMessage = 'A couple of sentences about the project, please.',
    errSummary = 'Almost there. Check the highlighted fields.',
    sendLabel = 'Send message',
    sendingLabel = 'Sending…',
    privacyNote = 'Used only to reply to you.',
    privacyLink = '#privacy',
    privacyLinkLabel = 'Privacy',
    endpoint = '',
    mailSubject = 'New project brief',
    failText = "That didn't go through. Email me directly instead:",
    okTake = 'TAKE 1 — RECEIVED',
    okTitle = 'Got it. *Thank you.*',
    okText = 'I reply within a working day with initial thoughts and a rough roadmap.',
    okMailText = 'Your mail app opened with the brief filled in. Hit send and I will reply within a working day.',
    okAgain = 'Send another',
    okBack = 'See my work',
    okBackLink = '/#work',
    statusLabel = 'Status',
    bookingLabel = 'Booking now for',
    availOverride = '',
    signText = 'ON AIR',
    emailCardLabel = 'Email',
    copyLabel = 'Copy',
    copiedLabel = 'Copied',
    timeLabel = 'Local time',
    hours = defaultContactHours || '1-5 09:30-18:30',
    inLabel = 'In the studio now',
    outLabel = 'Off set · I reply in the morning',
    socialLabel = 'Elsewhere',
    callLabel = 'Book a 20-min intro call',
    callNote = 'Rather talk? Pick a slot, no prep needed.',
    callLink = '',
    callSubject = 'Intro call with Sheelash',
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
  const aside = useRef(null);
  const formRef = useRef(null);
  const okRef = useRef(null);

  const { w } = useSize(root, bpHint);
  const phone = w < 810;
  const tab = w >= 810 && w < 1100;
  const on = useOn(root, live, rm, 0.05);
  useMagnet(root, live);

  const anim = live && !rm && !still;

  const [f, setF] = useState(CO_EMPTY);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [state, setState] = useState('idle');

  const errs = {};
  if (!f.name.trim()) errs.name = errName;
  if (!coEmailOk(f.email)) errs.email = errEmail;
  if (!f.subject.trim()) errs.subject = errSubject;
  if (!f.description.trim()) errs.description = errMessage;

  const show = (k) => (tried || touched[k]) && errs[k];
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));
  const blur = (k) => setTouched((t) => (t[k] ? t : { ...t, [k]: true }));

  const avail = pick(availOverride, site.avail || 'Available for projects');
  const call = pick(
    callLink,
    `mailto:${site.email}?subject=${encodeURIComponent(callSubject)}`
  );
  const socials = linkList(site.socials).filter((s) => s.h && s.h !== '/');

  // Scroll variables & note drop animations
  useScrollVars(root, anim, rm);
  useEffect(() => {
    if (!anim || !aside.current) return;
    const els = Array.from(aside.current.querySelectorAll('.mvco-note'));
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-drop');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.2 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [anim]);

  // Live ticking clock in site timezone
  const [clock, setClock] = useState('');
  const [open, setOpen] = useState(null);
  const [zone, setZone] = useState('');

  useEffect(() => {
    if (!live) return;
    const tz = site.tz || 'Asia/Kolkata';
    const tick = () => {
      try {
        setClock(
          new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(new Date())
        );
        const z = new Intl.DateTimeFormat('en-GB', {
          timeZone: tz,
          timeZoneName: 'short',
        })
          .formatToParts(new Date())
          .find((p) => p.type === 'timeZoneName');
        setZone(z ? z.value : '');
        const o = openState(hours, tz);
        setOpen(o ? o.open : null);
      } catch (e) {}
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [live, site.tz, hours]);

  // Copy email action
  const [copied, setCopied] = useState(false);
  const tm = useRef(0);
  const copy = () => {
    const e = site.email || '';
    const done = () => {
      setCopied(true);
      window.clearTimeout(tm.current);
      tm.current = window.setTimeout(() => setCopied(false), 1800);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(e).then(done, () => {
          window.location.href = `mailto:${e}`;
        });
      } else {
        window.location.href = `mailto:${e}`;
      }
    } catch (x) {
      window.location.href = `mailto:${e}`;
    }
  };

  useEffect(() => () => window.clearTimeout(tm.current), []);

  useEffect(() => {
    if ((state === 'ok' || state === 'mail') && okRef.current) {
      try {
        okRef.current.focus({ preventScroll: false });
      } catch (e) {}
    }
  }, [state]);

  const lines = () =>
    [
      `${nameLabel}: ${f.name}`,
      `${emailLabel}: ${f.email}`,
      f.company && `${companyLabel}: ${f.company}`,
      `${subjectLabel}: ${f.subject}`,
      '',
      f.description,
    ].filter((x) => typeof x === 'string');

  const submit = async (e) => {
    e.preventDefault();
    setTried(true);
    if (f.hp) {
      setState('ok');
      return;
    }
    const bad = ['name', 'email', 'subject', 'description'].find((k) => errs[k]);
    if (bad) {
      const el = formRef.current?.querySelector(`[name="${bad}"]`);
      if (el) el.focus();
      return;
    }

    setState('sending');
    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
      '9d3157b3-3c20-49f9-976d-11cc49545740';
    const ep = String(endpoint || 'https://api.web3forms.com/submit').trim();

    try {
      const formData = new FormData();
      formData.append('access_key', accessKey);
      formData.append('name', f.name);
      formData.append('email', f.email);
      formData.append('company', f.company || 'Direct Client');
      formData.append('subject', f.subject || `New Client Inquiry from ${f.name}`);
      formData.append('message', f.description);
      formData.append('from_name', `${f.name} (Portfolio)`);

      const r = await fetch(ep, {
        method: 'POST',
        body: formData,
      });

      const res = await r.json();
      if (res.success || r.ok) {
        setState('ok');
        return;
      } else {
        setState('fail');
      }
    } catch (x) {
      setState('fail');
    }
  };

  const reset = () => {
    setF(CO_EMPTY);
    setTouched({});
    setTried(false);
    setState('idle');
    window.setTimeout(() => {
      formRef.current?.querySelector('[name="name"]')?.focus();
    }, 60);
  };

  const nErr = Object.keys(errs).length;
  const today = (() => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        timeZone: site.tz || 'Asia/Kolkata',
      }).format(new Date());
    } catch (e) {
      return '';
    }
  })();

  const field = (k, i, label, type, req, auto) => (
    <div className={`mvco-f${show(k) ? ' is-err' : ''}`}>
      <label htmlFor={`mvco-${k}`} style={M}>
        <span className="mvco-n">{coPad(i)}</span>
        <span className="mvco-l">
          {label}
          {req && <b aria-hidden> *</b>}
        </span>
      </label>
      <input
        id={`mvco-${k}`}
        name={k}
        type={type}
        autoComplete={auto}
        required={req}
        value={f[k]}
        onChange={(e) => set(k, e.target.value)}
        onBlur={() => blur(k)}
        aria-invalid={show(k) ? true : undefined}
        aria-describedby={show(k) ? `mvco-${k}-e` : undefined}
        inputMode={
          type === 'email' ? 'email' : type === 'url' ? 'url' : undefined
        }
      />
      {show(k) && (
        <p id={`mvco-${k}-e`} className="mvco-err" style={M}>
          <i aria-hidden>!</i>
          {errs[k]}
        </p>
      )}
    </div>
  );

  const sent = state === 'ok' || state === 'mail';

  return (
    <section
      ref={root}
      id="contact"
      className={`mv mv-sec mvco${phone ? ' is-ph' : tab ? ' is-tab' : ''}${on ? ' is-in' : ''}${anim ? ' is-anim' : ''}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + CSS_CO + siteFontCss(props),
        }}
      />
      <div className="mv-wrap">
        <header className="mvco-hd">
          <Eyebrow text={eyebrow} on={on} M={M} />
          <Head
            text={title}
            tag="h1"
            on={on}
            D={D}
            size={
              phone
                ? 'clamp(46px,13.5vw,64px)'
                : 'clamp(60px,7.4vw,116px)'
            }
            lh={0.9}
            delay={100}
            step={60}
            style={{ fontStretch: '117%', fontWeight: 780 }}
          />
          {lead && (
            <p className="mvco-lead" style={rise(on, 520, 14)}>
              {lead}
            </p>
          )}
        </header>

        <div className="mvco-grid">
          <div className="mvco-main" style={rise(on, 380, 22)}>
            {sent ? (
              <div
                ref={okRef}
                className="mvco-slate"
                tabIndex={-1}
                role="status"
                aria-live="polite"
              >
                <div className="mvco-arm" aria-hidden>
                  <i />
                </div>
                <div className="mvco-board">
                  <p className="mvco-take" style={M}>
                    {okTake}
                  </p>
                  <Head
                    text={okTitle}
                    on={true}
                    D={D}
                    tag="h2"
                    size={
                      phone
                        ? 'clamp(36px,10vw,48px)'
                        : 'clamp(40px,4.3vw,64px)'
                    }
                    lh={0.95}
                    style={{
                      fontStretch: '115%',
                      fontWeight: 760,
                    }}
                  />
                  <p className="mvco-okt">
                    {state === 'mail' ? okMailText : okText}
                  </p>
                  <dl className="mvco-fields" style={M}>
                    <div>
                      <dt>From</dt>
                      <dd>{f.name || '—'}</dd>
                    </div>
                    <div>
                      <dt>Company</dt>
                      <dd>{f.company || 'Direct'}</dd>
                    </div>
                    <div>
                      <dt>Subject</dt>
                      <dd>{f.subject || 'Inquiry'}</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>{today}</dd>
                    </div>
                  </dl>
                  <div className="mvco-okb">
                    <Btn
                      href={okBackLink || '/#work'}
                      label={okBack}
                      kind="ghost"
                    />
                    <button
                      type="button"
                      className="mvco-again"
                      style={M}
                      onClick={reset}
                    >
                      {okAgain}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                className="mvco-sheet"
                noValidate
                onSubmit={submit}
                aria-describedby="mvco-req"
              >
                <div className="mvco-sh" style={M}>
                  <span>
                    <i aria-hidden />
                    {sheetLabel}
                  </span>
                  <span>{sheetNo}</span>
                  <span id="mvco-req">{requiredNote}</span>
                </div>
                <div className="mvco-fs">
                  {field('name', 1, nameLabel, 'text', true, 'name')}
                  {field('email', 2, emailLabel, 'email', true, 'email')}
                  {field('company', 3, companyLabel, 'text', false, 'organization')}
                  {field('subject', 4, subjectLabel, 'text', true, 'off')}
                  <div
                    className={`mvco-f mvco-wide${show('description') ? ' is-err' : ''}`}
                  >
                    <label htmlFor="mvco-description" style={M}>
                      <span className="mvco-n">{coPad(5)}</span>
                      <span className="mvco-l">
                        {descriptionLabel}
                        <b aria-hidden> *</b>
                      </span>
                    </label>
                    <textarea
                      id="mvco-description"
                      name="description"
                      rows={phone ? 5 : 4}
                      required
                      value={f.description}
                      placeholder={descriptionHint}
                      onChange={(e) => set('description', e.target.value)}
                      onBlur={() => blur('description')}
                      aria-invalid={show('description') ? true : undefined}
                      aria-describedby={
                        show('description')
                          ? 'mvco-description-e'
                          : 'mvco-description-h'
                      }
                    />
                    {show('description') ? (
                      <p
                        id="mvco-description-e"
                        className="mvco-err"
                        style={M}
                      >
                        <i aria-hidden>!</i>
                        {errs.description}
                      </p>
                    ) : (
                      <p id="mvco-description-h" className="mv-sr">
                        {descriptionHint}
                      </p>
                    )}
                  </div>
                  <div className="mvco-hp" aria-hidden>
                    <label htmlFor="mvco-hp">Leave empty</label>
                    <input
                      id="mvco-hp"
                      name="company_url"
                      tabIndex={-1}
                      autoComplete="off"
                      value={f.hp}
                      onChange={(e) => set('hp', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mvco-foot">
                  <p className="mvco-live" role="alert" style={M}>
                    {tried && nErr > 0 ? (
                      errSummary
                    ) : state === 'fail' ? (
                      <>
                        {failText}{' '}
                        <a href={`mailto:${site.email}`}>{site.email}</a>
                      </>
                    ) : (
                      ''
                    )}
                  </p>
                  <div className="mvco-send-w">
                    {phone ? (
                      <>
                        <button
                          type="submit"
                          className="mv-btn mv-solid mvco-send"
                          data-mag
                          disabled={state === 'sending'}
                        >
                          <span className="mv-face">
                            <span className="mv-fill" aria-hidden />
                            <span className="mv-lbl">
                              <span className="mv-roll">
                                <span className="mv-l1">
                                  {state === 'sending'
                                    ? sendingLabel
                                    : sendLabel}
                                </span>
                                <span className="mv-l2" aria-hidden>
                                  {state === 'sending'
                                    ? sendingLabel
                                    : sendLabel}
                                </span>
                              </span>
                            </span>
                            <span className="mv-arr" aria-hidden>
                              <span className="mv-a1">
                                <Glyph />
                              </span>
                              <span className="mv-a2">
                                <Glyph />
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
                        <p className="mvco-priv" style={M}>
                          {privacyNote}
                          {privacyLink && privacyLinkLabel && (
                            <>
                              {' '}
                              <a href={privacyLink}>
                                {privacyLinkLabel} ↗
                              </a>
                            </>
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mvco-priv" style={M}>
                          {privacyNote}
                          {privacyLink && privacyLinkLabel && (
                            <>
                              {' '}
                              <a href={privacyLink}>
                                {privacyLinkLabel} ↗
                              </a>
                            </>
                          )}
                        </p>
                        <button
                          type="submit"
                          className="mv-btn mv-solid mvco-send"
                          data-mag
                          disabled={state === 'sending'}
                        >
                          <span className="mv-face">
                            <span className="mv-fill" aria-hidden />
                            <span className="mv-lbl">
                              <span className="mv-roll">
                                <span className="mv-l1">
                                  {state === 'sending'
                                    ? sendingLabel
                                    : sendLabel}
                                </span>
                                <span className="mv-l2" aria-hidden>
                                  {state === 'sending'
                                    ? sendingLabel
                                    : sendLabel}
                                </span>
                              </span>
                            </span>
                            <span className="mv-arr" aria-hidden>
                              <span className="mv-a1">
                                <Glyph />
                              </span>
                              <span className="mv-a2">
                                <Glyph />
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
                      </>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>

          <aside
            ref={aside}
            className="mvco-aside"
            aria-label={statusLabel}
          >
            <div className="mvco-note mvco-n1" style={{ '--i': 0 }}>
              <i className="mvco-tape" aria-hidden />
              <p className="mvco-k" style={M}>
                {statusLabel}
              </p>
              <div className="mvco-air">
                <span
                  className="mvco-lamp"
                  style={{ ...D, fontWeight: 800 }}
                  aria-hidden
                >
                  {signText}
                </span>
                <span className="mvco-av">
                  <em style={M}>{bookingLabel}</em>
                  <b style={D}>{avail}</b>
                </span>
              </div>
            </div>

            {site.email && (
              <div className="mvco-note mvco-n2" style={{ '--i': 1 }}>
                <i className="mvco-tape" aria-hidden />
                <p className="mvco-k" style={M}>
                  {emailCardLabel}
                </p>
                <a
                  className="mvco-mail"
                  href={`mailto:${site.email}`}
                  style={D}
                >
                  {site.email}
                </a>
                <button
                  type="button"
                  className={`mvco-copy${copied ? ' is-done' : ''}`}
                  onClick={copy}
                  style={M}
                  aria-label={`${copyLabel} ${site.email}`}
                >
                  <span className="mvco-cc" aria-live="polite">
                    <span>{copyLabel}</span>
                    <span>{copiedLabel}</span>
                  </span>
                </button>
              </div>
            )}

            <div className="mvco-note mvco-n3" style={{ '--i': 2 }}>
              <i className="mvco-tape" aria-hidden />
              <p className="mvco-k" style={M}>
                {timeLabel}
                {site.city ? ` · ${site.city}` : ''}
              </p>
              <p className="mvco-clock" style={M}>
                <span>{clock || '--:--:--'}</span>
                {zone && <em>{zone}</em>}
              </p>
              {open !== null && (
                <p
                  className={`mvco-open${open ? ' is-open' : ''}`}
                  style={M}
                >
                  <i aria-hidden />
                  {open ? inLabel : outLabel}
                </p>
              )}
            </div>

            {socials.length > 0 && (
              <div className="mvco-note mvco-n4" style={{ '--i': 3 }}>
                <i className="mvco-tape" aria-hidden />
                <p className="mvco-k" style={M}>
                  {socialLabel}
                </p>
                <ul className="mvco-soc">
                  {socials.map((s, i) => (
                    <li key={i}>
                      <a href={s.h} target="_blank" rel="noopener">
                        <span style={D}>{s.l}</span>
                        <IcoArrow s={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {callLabel && (
              <div className="mvco-note mvco-n5" style={{ '--i': 4 }}>
                <i className="mvco-tape" aria-hidden />
                {callNote && <p className="mvco-cn">{callNote}</p>}
                <Btn
                  href={call}
                  label={callLabel}
                  kind="ghost"
                  icon="cal"
                />
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

const CSS_CO = `
.mvco{background:var(--mv-bone);color:var(--mv-ink);padding:clamp(128px,11vw,172px) 0 clamp(96px,10vw,160px);--err:#C8321F}
.mvco .mv-hd .mv-it,.mvco-slate .mv-it{display:inline-block;font-weight:inherit;color:var(--mv-ink);line-height:1.02;padding:0 .07em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .72s steps(8) var(--pd,600ms)} .mvco .mv-hd.is-on .mv-it{background-size:100% 100%}
.mvco-hd{display:flex;flex-direction:column;align-items:flex-start;gap:26px;max-width:1120px;margin-bottom:clamp(56px,6vw,96px)}
.mvco-lead{margin:0;max-width:52ch;font-size:19px;line-height:1.5}
.mvco-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(300px,.62fr);gap:clamp(32px,4vw,72px);align-items:start}
/* the booking sheet */
.mvco-sheet{position:relative;border-radius:10px;background:color-mix(in srgb,var(--mv-cloud) 62%,var(--mv-bone));box-shadow:inset 0 0 0 1px var(--mv-fog),0 30px 60px -44px rgba(0,0,0,.35)}
.mvco-sh{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 22px;border-bottom:1px solid var(--mv-fog);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)} .mvco-sh span:first-child{display:flex;align-items:center;gap:9px;color:var(--mv-ink)} .mvco-sh span:first-child i{width:7px;height:7px;border-radius:50%;background:var(--mv-brass)}
.mvco-fs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:28px;row-gap:26px;padding:28px 22px 8px}
.mvco-f{position:relative;display:flex;flex-direction:column;gap:6px;min-width:0;margin:0;padding:0;border:0} .mvco-wide{grid-column:1/-1}
.mvco-f>label,.mvco-f>legend{display:flex;align-items:center;gap:10px;padding:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mv-mut)}
.mvco-n{color:var(--mv-mut);opacity:.8} .mvco-l{padding:2px 5px;margin-left:-5px;border-radius:3px;color:var(--mv-ink);background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .4s steps(6)} .mvco-l b{font-weight:400}
.mvco-f:focus-within .mvco-l{background-size:100% 100%}
.mvco-f input,.mvco-f textarea{width:100%;appearance:none;-webkit-appearance:none;border:1.5px solid color-mix(in srgb,var(--mv-ink) 28%,transparent);border-radius:8px;background:color-mix(in srgb,var(--mv-cloud) 75%,#fff);color:var(--mv-ink);font:inherit;font-size:16px;line-height:1.4;padding:12px 14px;box-shadow:0 1px 3px rgba(0,0,0,.04);transition:border-color .25s ease,background-color .25s ease,box-shadow .25s ease}
.mvco-f textarea{min-height:120px;padding:12px 14px;line-height:1.5;resize:vertical}
.mvco-f input::placeholder,.mvco-f textarea::placeholder{color:color-mix(in srgb,var(--mv-ink) 45%,transparent)}
.mvco-f input:focus,.mvco-f textarea:focus{border-color:var(--mv-ink);background:#ffffff;outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--mv-brass) 40%,transparent),0 2px 4px rgba(0,0,0,.06)}
.mvco-f.is-err input,.mvco-f.is-err textarea{border-color:var(--err);background:#fffafa;box-shadow:0 0 0 3px rgba(200,50,31,.16)}
.mvco-err{display:flex;align-items:center;gap:8px;margin:4px 0 0;font-size:12px;letter-spacing:.02em;color:var(--err)} .mvco-err i{display:grid;place-items:center;width:16px;height:16px;flex:none;border-radius:3px;background:var(--err);color:#fff;font-style:normal;font-size:12px;font-weight:600}
.mvco-hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}
.mvco-foot{display:flex;flex-direction:column;gap:14px;padding:18px 22px 22px}
.mvco-live{margin:0;min-height:1em;font-size:12px;letter-spacing:.02em;color:var(--err)} .mvco-live:empty{min-height:0} .mvco-live a{color:var(--mv-ink)}
.mvco-send-w{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-top:18px;border-top:1px solid var(--mv-fog)}
.mvco-priv{margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut)} .mvco-priv a{margin-left:6px;color:var(--mv-ink);text-underline-offset:3px}
.mvco-send{background:none;font:inherit;font-size:13px;font-weight:600} .mvco-send[disabled]{opacity:.6;cursor:progress}
/* success slate */
.mvco-slate{position:relative;outline:none;padding-top:36px}
.mvco-arm{position:absolute;left:0;right:0;top:0;height:44px;border-radius:8px 8px 2px 2px;background:var(--mv-night);transform-origin:10px 100%;animation:mvco-clap .7s cubic-bezier(.7,0,.3,1.4) .15s both;overflow:hidden}
.mvco-arm i{position:absolute;inset:8px 0;background:repeating-linear-gradient(120deg,var(--mv-cloud) 0 26px,transparent 26px 52px)}
@keyframes mvco-clap{0%{rotate:-18deg}70%{rotate:0deg}82%{rotate:-2deg}100%{rotate:0deg}}
.mvco-board{position:relative;margin-top:6px;padding:clamp(28px,3vw,44px);border-radius:4px 4px 10px 10px;background:var(--mv-night);color:var(--mv-cloud)}
.mvco-board .mv-it{color:var(--mv-brass);background:none;padding:0}
.mvco-take{margin:0 0 20px;font-size:12px;letter-spacing:.16em;color:var(--mv-brass)}
.mvco-okt{margin:18px 0 26px;max-width:44ch;font-size:18px;line-height:1.5;color:color-mix(in srgb,var(--mv-cloud) 84%,transparent)}
.mvco-fields{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin:0 0 28px;border-top:1px solid color-mix(in srgb,var(--mv-cloud) 22%,transparent);border-left:1px solid color-mix(in srgb,var(--mv-cloud) 22%,transparent)}
.mvco-fields div{padding:10px 12px;border-right:1px solid color-mix(in srgb,var(--mv-cloud) 22%,transparent);border-bottom:1px solid color-mix(in srgb,var(--mv-cloud) 22%,transparent)} .mvco-fields dt{font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.6} .mvco-fields dd{margin:4px 0 0;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mvco-okb{display:flex;flex-wrap:wrap;align-items:center;gap:18px}
.mvco .mvco-board .mv-btn.mv-ghost{--face:color-mix(in srgb,var(--mv-cloud) 8%,transparent);--rim:color-mix(in srgb,var(--mv-cloud) 26%,transparent);--fill:var(--mv-cloud);--fg:var(--mv-cloud);--fg2:var(--mv-ink);--chip:color-mix(in srgb,var(--mv-cloud) 14%,transparent);--chipfg:var(--mv-cloud);--chip2:var(--mv-ink);--chipfg2:var(--mv-cloud)}
.mvco-again{appearance:none;border:0;background:none;padding:6px 2px;color:var(--mv-cloud);font-size:12px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;box-shadow:inset 0 -1px 0 currentColor}
.mvco-board :focus-visible{outline-color:var(--mv-cloud)!important;box-shadow:0 0 0 2px var(--mv-night)!important}
/* the taped notes */
.mvco-aside{position:relative;display:flex;flex-direction:column;gap:22px;padding-top:8px}
.mvco-note{--r:0deg;position:relative;padding:22px 22px 22px;border-radius:6px;background:color-mix(in srgb,var(--mv-cloud) 78%,var(--mv-bone));box-shadow:0 1px 0 var(--mv-fog),0 18px 30px -24px rgba(0,0,0,.4),inset 0 0 0 1px color-mix(in srgb,var(--mv-ink) 7%,transparent);rotate:var(--r);translate:0 calc((var(--sp,.5) - .5)*var(--i)*-10px);transition:rotate .5s cubic-bezier(.34,1.56,.64,1)}
.mvco-n1{--r:-1.2deg} .mvco-n2{--r:.9deg} .mvco-n3{--r:-.6deg} .mvco-n4{--r:1.1deg} .mvco-n5{--r:-.8deg}
.mvco-note:hover{rotate:0deg}
.mvco.is-anim .mvco-note{opacity:0;transform:translateY(-46px) rotate(calc(var(--r)*6));transition:opacity .5s ease calc(var(--i)*110ms + 450ms),transform .8s cubic-bezier(.34,1.45,.6,1) calc(var(--i)*110ms + 450ms),rotate .5s cubic-bezier(.34,1.56,.64,1)}
.mvco.is-anim.is-in .mvco-note.is-drop{opacity:1;transform:none}
.mvco-tape{position:absolute;z-index:2;left:50%;top:-11px;width:84px;height:22px;translate:-50% 0;rotate:calc(var(--r)*-3 + 2deg);background:color-mix(in srgb,var(--mv-brass) 62%,transparent);box-shadow:0 1px 2px rgba(0,0,0,.08);clip-path:polygon(0 8%,3% 0,6% 10%,9% 0,100% 0,97% 12%,100% 25%,97% 38%,100% 50%,97% 62%,100% 75%,97% 88%,100% 100%,0 100%,3% 88%,0 75%,3% 62%,0 50%,3% 38%,0 25%)}
.mvco.is-anim .mvco-tape{opacity:0;scale:1.4;transition:opacity .3s ease calc(var(--i)*110ms + 1000ms),scale .35s cubic-bezier(.2,.8,.2,1) calc(var(--i)*110ms + 1000ms)} .mvco.is-anim.is-in .mvco-note.is-drop .mvco-tape{opacity:1;scale:1}
.mvco-k{margin:0 0 12px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)}
.mvco-air{display:flex;align-items:center;gap:16px}
.mvco-lamp{flex:none;display:grid;place-items:center;height:48px;padding:0 12px;border-radius:6px;background:#C81E17;color:#FFF1EC;font-size:18px;letter-spacing:-.01em;font-stretch:118%;box-shadow:0 0 0 4px var(--mv-ink),0 0 26px 4px rgba(255,59,47,.45);animation:mvco-flk 5s steps(1,end) infinite}
@keyframes mvco-flk{0%,91%,100%{opacity:1}92%{opacity:.5}94%{opacity:1}95%{opacity:.7}}
.mvco-av{display:flex;flex-direction:column;gap:4px;min-width:0} .mvco-av em{font-style:normal;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mv-mut)} .mvco-av b{font-size:18px;line-height:1.2;letter-spacing:-.02em;font-stretch:108%;font-weight:700}
.mvco-mail{display:block;font-size:clamp(19px,1.5vw,23px);line-height:1.2;letter-spacing:-.025em;font-stretch:108%;font-weight:700;text-decoration:none;overflow-wrap:anywhere;margin-bottom:14px} .mvco-mail:hover{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
.mvco-copy{appearance:none;border:0;padding:0;background:none;cursor:pointer;color:inherit;font-size:12px}
.mvco-cc{display:grid;height:34px;min-width:84px;padding:0 12px;border-radius:6px;background:var(--mv-ink);color:var(--mv-cloud);letter-spacing:.1em;text-transform:uppercase;overflow:hidden}
.mvco-cc>span{grid-area:1/1;display:grid;place-items:center;transition:translate .45s cubic-bezier(.7,0,.2,1)} .mvco-cc>span:last-child{translate:0 110%}
.mvco-copy.is-done .mvco-cc{background:var(--mv-brass);color:var(--mv-ink)} .mvco-copy.is-done .mvco-cc>span:first-child{translate:0 -110%} .mvco-copy.is-done .mvco-cc>span:last-child{translate:0 0}
.mvco-clock{display:flex;align-items:baseline;gap:10px;margin:0;font-size:clamp(28px,2.4vw,36px);letter-spacing:-.02em;font-variant-numeric:tabular-nums} .mvco-clock em{font-style:normal;font-size:12px;letter-spacing:.12em;color:var(--mv-mut)}
.mvco-open{display:flex;align-items:center;gap:8px;margin:10px 0 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mv-mut)} .mvco-open i{width:7px;height:7px;border-radius:50%;background:color-mix(in srgb,var(--mv-ink) 30%,transparent)} .mvco-open.is-open{color:var(--mv-ink)} .mvco-open.is-open i{background:#3DDC84;box-shadow:0 0 0 3px rgba(61,220,132,.25)}
.mvco-soc{list-style:none;margin:0;padding:0} .mvco-soc li+li{border-top:1px solid var(--mv-fog)}
.mvco-soc a{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;text-decoration:none;font-size:17px;letter-spacing:-.02em;font-weight:600} .mvco-soc a span{padding:0 .05em;background:linear-gradient(var(--mv-brass),var(--mv-brass)) no-repeat 0 0/0% 100%;transition:background-size .4s steps(6)} .mvco-soc a:hover span,.mvco-soc a:focus-visible span{background-size:100% 100%} .mvco-soc a svg{transition:translate .35s} .mvco-soc a:hover svg{translate:3px 0}
.mvco-cn{margin:0 0 14px;font-size:15px;line-height:1.45;color:var(--mv-mut)}
.mvco-n5 .mv-btn{width:100%} .mvco-n5 .mv-face{justify-content:space-between}
/* tablet */
.mvco.is-tab .mvco-grid{grid-template-columns:minmax(0,1fr)} .mvco.is-tab .mvco-aside{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:26px 22px;padding-top:24px} .mvco.is-tab .mvco-n5{grid-column:1/-1}
/* phone */
.mvco.is-ph{padding-top:112px} .mvco.is-ph .mvco-lead{font-size:17px}
.mvco.is-ph .mvco-grid{grid-template-columns:minmax(0,1fr);gap:48px}
.mvco.is-ph .mvco-sheet{margin:0 -8px}
.mvco.is-ph .mvco-sh{padding:12px 16px;flex-wrap:wrap} .mvco.is-ph .mvco-sh span:nth-child(2){display:none}
.mvco.is-ph .mvco-fs{grid-template-columns:minmax(0,1fr);row-gap:24px;padding:24px 16px 4px}
.mvco.is-ph .mvco-foot{padding:16px}
.mvco.is-ph .mvco-send-w{flex-direction:column;align-items:stretch;gap:14px} .mvco.is-ph .mvco-send{width:100%}
.mvco.is-ph .mvco-fields{grid-template-columns:repeat(2,minmax(0,1fr))}
.mvco.is-ph .mvco-okb .mv-btn{width:100%}
@media (prefers-reduced-motion:reduce){.mvco-arm,.mvco-lamp{animation:none!important}}
`;
