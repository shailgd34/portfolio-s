"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FONTS,
  colorsOf,
  fontsOf,
  siteFontCss,
  cssVars,
  useFonts,
  useLive,
  useSize,
  CSS_BASE,
} from "./scaffold";
import { siteData } from "./siteData";

const MVST = [
  {
    id: "welcome",
    t: "Welcome to the set",
    lead: "This is a complete portfolio for a designer or developer: a home page shot like a photo studio, case studies, services, a lab, writing, a résumé, uses, contact and legal pages. Every fact that repeats lives in the CMS, every colour is a Style, one switch sets the fonts. About thirty minutes from remix to launch:",
    steps: [
      "CMS → Site: type your name, role, email, city, availability, résumé link and booking link (five minutes).",
      "Rewrite the Projects, Services, Experience and Reviews rows with your own work. Their pages follow on their own.",
      "Swap the hero portrait for a cut-out of yourself (see The hero portrait) and the CMS photos for your own.",
      "Change the eight colour Styles if you want another palette; pick fonts on the Header if you want other type.",
      "Replace every sample (see Make it true), connect the contact form, delete this page, publish.",
    ],
  },
  {
    id: "layout",
    t: "How the site is built",
    lead: "Every page sits on one Site Layout (Pages panel → Layouts → Site Layout). What is on it appears on every page, so you edit it once.",
    rows: [
      [
        "Header",
        "Logo, links, the Hire me button, the phone menu, and the site-wide Custom Fonts switch.",
      ],
      [
        "Smooth scroll",
        "The soft scrolling. Leave it in place; it has no visible frame.",
      ],
      [
        "CMS Bridge layers",
        'Hidden layers named "CMS Bridge · …" hand the CMS rows to the sections on every page. Do not delete or hide them, or sections fall back to the demo text.',
      ],
      [
        "Loader · Page transition",
        "The film-leader countdown and the shutter between pages (see Loader and page transition).",
      ],
      [
        "Footer",
        "The clapperboard wrap: links, projects, socials, local time and legal links.",
      ],
    ],
    note: "Sections are code components with controls. Select one on the canvas and every word, link and colour is in the right panel — nothing is hidden in code.",
  },
  {
    id: "site",
    t: "The Site row",
    lead: "CMS → Site holds one row of facts about you. The header, hero, footer, CTA, contact page, résumé, loader and legal pages all read it — type each fact once and every page follows.",
    live: true,
    rows: [
      [
        "Name",
        "Your name: the giant hero name, header logo, loader slate, footer, résumé and page titles.",
      ],
      ["Role", "Product designer & developer — hero, résumé, footer."],
      [
        "Tagline",
        "One sentence about what you do. Hero statement and footer.",
      ],
      [
        "Email",
        "Contact page, footer, CTA copy button, legal pages and the fallback of the contact form.",
      ],
      [
        "City · Time Zone",
        "The location line and the live local clock (header menu, contact page, footer). Time Zone is an IANA name such as Europe/Berlin or America/New_York.",
      ],
      [
        "Availability",
        "The ON AIR line (Booking now for …) and the green dot in the header.",
      ],
      [
        "Resume Link",
        'Every "Download résumé" button. A PDF upload or a link; empty = /resume.',
      ],
      [
        "Socials",
        "Label:url pairs separated by commas — Dribbble:https://…, GitHub:https://…. Footer, header menu, contact page.",
      ],
      [
        "Years",
        "Years of experience, used in the intro facts and résumé.",
      ],
      [
        "Booking Link",
        'Every "Hire me" / "Start a project" button. A Cal.com or Calendly link works well; empty = /contact.',
      ],
    ],
  },
  {
    id: "cms",
    t: "The seven collections",
    lead: "Add a row and it appears wherever it belongs; Projects, Services, Lab and Posts rows also get their own page. The Order number sorts every list, and deleting a row never leaves a hole.",
    rows: [
      ["Site", "One row of facts about you (see The Site row)."],
      [
        "Projects",
        'Title, Client, Category, Year, Summary, Image, Role, Team, Outcome. The homepage contact sheet, /work, every /work/:slug case page, the footer\'s Work column and the "Projects with this" cards on service pages.',
      ],
      [
        "Services",
        "Title, Short, Body, Deliverables (a;b;c), Gel colour, Kind. The coloured gels on the homepage, /services, every /services/:slug page and the project types on the contact form.",
      ],
      [
        "Experience",
        "Role, Company, Years, Summary, Type (work, edu or award). The end-credits roll on the homepage and /about, and the /resume page.",
      ],
      [
        "Reviews",
        "Name, Role, Company, Quote, Project, Photo. The press clippings on the homepage, /work and /about; a case page shows the review whose Project matches its Title.",
      ],
      [
        "Lab",
        "Title, Kind, Year, Tools (a;b), Summary, Photo. The outtakes reel on the homepage, /lab and every /lab/:slug page.",
      ],
      [
        "Posts",
        "Title, Kicker, Date, Read, Excerpt, Body, Photo. The notebook on the homepage, /writing and every /writing/:slug article. Body takes ## headings, - lists, > quotes and **bold**.",
      ],
    ],
    note: "Detail pages (/work/:slug, /services/:slug, /lab/:slug, /writing/:slug) are one template each. Add a CMS row and its page exists; never duplicate a detail page by hand.",
  },
  {
    id: "colours",
    t: "Colours",
    lead: "Eight colour Styles repaint the whole site — every section, the header, buttons, the loader and the page transition. Assets panel → Colors → change a swatch; leave the sections bound to it.",
    swatches: true,
    rows: [
      ["Paper", "The light ground of the paper sections."],
      ["Ink", "Main text, solid buttons, lines on paper."],
      [
        "Accent",
        "The selection colour: highlighted headline words, button selections, chips, markers and progress lines. It is a surface colour; text on paper stays Ink.",
      ],
      [
        "Deep · Dark",
        "The dark grounds: the call sheet, contact sheet, credits, lab, footer, loader and page transition.",
      ],
      [
        "Line · Muted · White",
        "Hairlines, secondary text and white cards.",
      ],
    ],
    note: "The warm studio-light glow and the small red ON AIR / REC lights are fixed in code on purpose; everything else follows the Styles.",
  },
  {
    id: "fonts",
    t: "Fonts",
    lead: "One switch sets the fonts on every page. The defaults are Mona Sans (headlines, wide), Mona Sans (text) and Chivo Mono (labels, numbers, timecodes).",
    steps: [
      "Open the Site Layout and select the Header.",
      "Turn on Custom Fonts and pick a Display, Body and Mono font.",
      "Publish. Every section follows. A section's own Custom Fonts switch overrides the Header for that one section only.",
    ],
  },
  {
    id: "portrait",
    t: "The hero portrait",
    lead: "The home hero is a live portrait shoot: your cut-out stands in front of your giant name and the cursor lights it. It needs a photo with a transparent background.",
    steps: [
      "Take or pick a waist-up photo against a plain wall, well lit, looking at the camera or slightly off.",
      "Cut yourself out: remove.bg (free, one click), or on a Mac open the photo in Preview → Tools → Remove Background, or in Photos right-click → Copy Subject and paste into Preview → File → New from Clipboard.",
      "Export as PNG or WebP with transparency, about 1500 × 2000 px, under ~300 KB (squoosh.app shrinks it).",
      "Select the Hero → Portrait → upload. The backdrop colours behind you are the Hero's Backdrops control (Name:#hex; …).",
    ],
  },
  {
    id: "images",
    t: "Images",
    lead: "Upload your own photos in the CMS and in the section controls. Export WebP or JPG and keep each one under ~300 KB; the site serves smaller copies to phones on its own.",
    rows: [
      [
        "Projects",
        "CMS → Projects → Image: landscape, 1600 × 1200. Used on the contact sheet, /work and as the case page cover.",
      ],
      [
        "Reviews",
        "CMS → Reviews → Photo: square, 400 × 400 (small byline portraits).",
      ],
      [
        "Lab · Posts",
        "CMS → Lab / Posts → Photo: landscape, 1600 × 1000.",
      ],
      [
        "Section photos",
        "The Intro print, Services photo, About portrait and photo band, Uses and page-hero objects each have their own image control.",
      ],
      [
        "Demo photos",
        "The demo uses stock stand-ins. Replace every one with your own work and your own face before launch.",
      ],
    ],
  },
  {
    id: "forms",
    t: "The contact form",
    lead: "The form on /contact works the moment you publish; connect a form service when you want submissions stored.",
    rows: [
      [
        "Endpoint",
        "Select the Contact section → Form endpoint = a URL that accepts a JSON POST: Formspree, Basin, a Make or Zapier webhook, or your own API.",
      ],
      [
        "Empty endpoint",
        "The visitor's email app opens with the message filled in, addressed to the Email on the Site row.",
      ],
      [
        "Newsletter",
        "The Subscribe strip on /writing has its own endpoint control and works the same way.",
      ],
      [
        "Labels",
        "Every label, option, error and thank-you line is a control on its section.",
      ],
    ],
  },
  {
    id: "motion",
    t: "Loader and page transition",
    lead: "Both live once in the Site Layout, right under the Header, so every page gets them. Select one to change it.",
    rows: [
      [
        "Loader",
        '"The slate": a film-leader countdown 3 · 2 · 1, a clapper clap and the leader running out of the gate. First visit of a session only, under 2.4 s, and visitors can click or press any key to skip. Controls: Enabled, Slate line ({name} = your Site name), Countdown, Duration, Once per session.',
      ],
      [
        "Page transition",
        '"The cut": two shutter blades close on the clicked line, show the frame number and the page name, and open on the next page. Controls: Enabled, Shutter colour, Frame label, Kicker, Home label, Close time. Outside links, email and phone links, new tabs and #links never trigger it.',
      ],
      [
        "Turn off",
        "Switch Enabled off on either one — or delete the layer — and the site simply loads without it.",
      ],
      [
        "Reduced motion",
        "Visitors who ask their device for less motion get a still frame and a short fade instead of the loader, and no page transition.",
      ],
    ],
  },
  {
    id: "override",
    t: "The override law",
    lead: "Some section controls repeat a Site or CMS fact (an email, a name, a link, a title). They are empty on purpose.",
    rows: [
      [
        "The law",
        "A section's control only overrides the CMS when it has real text. A single space clears it.",
      ],
      [
        "Empty",
        "The section reads the CMS, so a change on the Site row or a CMS row shows up there too.",
      ],
      [
        "Typed text",
        "Wins on that one section only; every other page still reads the CMS.",
      ],
      [
        "Headlines",
        "A | starts a new line and *words* between stars get the accent selection highlight (Work I'm|*proud* of.).",
      ],
    ],
  },
  {
    id: "seo",
    t: "SEO",
    lead: "Search engines read each page's title and description, not the sections. Set them before you launch.",
    rows: [
      [
        "Page titles",
        'Each page → Page Settings → Title and Description. Write them for people searching for you: "Sheelash Singh Bhadoriya — Full Stack Developer & UI/UX Designer in Bengaluru".',
      ],
      [
        "CMS pages",
        "Detail pages use variables: Title = {{Title}} — Your Name, Description = {{Summary}} (Posts: {{Excerpt}}). Every row gets its own title.",
      ],
      [
        "Social image",
        "Site Settings → General: social image (1200 × 630) and favicon, once for the whole site.",
      ],
      [
        "This page",
        "Start here tells search engines not to index it, and nothing links to it. Delete it anyway (below).",
      ],
    ],
  },
  {
    id: "pages",
    t: "Pages",
    lead: "Every page below uses the Site Layout. The home page and the detail templates are where most of your edits land.",
    paths: [
      ["/", "Home — the studio hero and eleven sections"],
      ["/work", "All projects, sheet and list views"],
      ["/work/:slug", "One case page per Projects row"],
      ["/about", "Story, principles, credits, reviews"],
      ["/resume", "A printable résumé (Print + Download)"],
      ["/services", "Service cards, engagement types, process"],
      ["/services/:slug", "One page per Services row"],
      ["/lab", "Side projects and experiments"],
      ["/lab/:slug", "One page per Lab row"],
      ["/writing", "All notes + newsletter"],
      ["/writing/:slug", "One article per Posts row"],
      ["/uses", "Gear and software"],
      ["/contact", "Contact form, availability, booking"],
      ["/privacy · /terms", "Legal pages with sample text"],
      ["404", "The missing-frame page"],
    ],
  },
  {
    id: "honesty",
    t: "Make it true",
    lead: "Everything that reads like a fact on the demo is a sample. Replace every demo project, quote and number with your own before anyone sees it.",
    rows: [
      [
        "Projects",
        "Show real projects, verified outcomes, and technical challenges solved.",
      ],
      [
        "Quotes",
        "Use authentic endorsements and testimonials from actual collaborators.",
      ],
      [
        "Numbers",
        "Keep metrics accurate to your real-world achievements.",
      ],
      [
        "Faces and photos",
        "Use your own face, profile cutouts, and real screen captures.",
      ],
      [
        "Legal pages",
        "Privacy and Terms hold sample text for a professional portfolio. Adapt them to your jurisdiction.",
      ],
    ],
  },
  {
    id: "delete",
    t: "Delete this page before you publish",
    lead: "This guide is for you, not your visitors. It is hidden from search engines and nothing links to it, but delete it before you launch: Pages panel → Start here → Delete.",
    stamp: true,
  },
];

export default function MvStartHere(props = {}) {
  const {
    kicker = "Call sheet 00 · owner guide",
    heading = "Start *here*",
    intro = "How to make this portfolio yours — the whole production on one sheet. Read it top to bottom once, then keep it open while you edit. Stuck on anything? We reply fast, usually the same day.",
    production = "Portfolio production",
    call = "Owner guide — read before you edit",
    tocLabel = "Scene list",
    stampLabel = "Delete before publishing",
    supportEmail = siteData.email || "sheelashsingh93@gmail.com",
    supportLabel = "Support",
    bpHint = "auto",
  } = props;

  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const root = useRef(null);
  const { w } = useSize(root, bpHint);
  const ph = w < 810;
  const tab = w >= 810 && w < 1100;

  const [today, setToday] = useState("");
  useEffect(() => {
    if (!live) return;
    try {
      setToday(
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    } catch (_) {}
  }, [live]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let m = document.head.querySelector('meta[name="robots"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "robots";
      document.head.appendChild(m);
    }
    m.content = "noindex, nofollow";
  }, []);

  const nn = (i) => String(i + 1).padStart(2, "0");
  const mh = String(heading).match(/^(.*?)\*(.+?)\*(.*)$/);
  const pre = mh ? mh[1] : heading;
  const acc = mh ? mh[2] : "";
  const post = mh ? mh[3] : "";

  const SW = [
    ["Paper", "bone"],
    ["Ink", "ink"],
    ["Accent", "brass"],
    ["Deep", "pine"],
    ["Line", "fog"],
    ["Muted", "stone"],
    ["White", "cloud"],
    ["Dark", "night"],
  ];

  const who = siteData.name || "Sheelash Singh Bhadoriya";

  return (
    <section
      ref={root}
      className={`mv mvst${ph ? " is-ph" : tab ? " is-tab" : ""}`}
      style={{ ...cssVars(c), ...B, ...(props.style || {}) }}
    >
      <meta name="robots" content="noindex, nofollow" />
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MVST + siteFontCss(props),
        }}
      />
      <div className="mvst-doc">
        <header className="mvst-head">
          <table className="mvst-grid" style={M}>
            <tbody>
              <tr>
                <th>Production</th>
                <td>
                  {production} — {who}
                </td>
                <th>Call</th>
                <td>{call}</td>
              </tr>
              <tr>
                <th>Director</th>
                <td>You</td>
                <th>Date</th>
                <td>{today || "Today"}</td>
              </tr>
              <tr>
                <th>Contact</th>
                <td className="mvst-wrap">
                  {siteData.email || "Site row → Email"}
                </td>
                <th>Location</th>
                <td>{siteData.city || "Site row → City"}</td>
              </tr>
            </tbody>
          </table>

          <div className="mvst-title">
            <p className="mvst-k" style={M}>
              <i aria-hidden />
              {kicker}
            </p>
            <h1 className="mvst-h1" style={D}>
              {pre}
              {acc && <mark>{acc}</mark>}
              {post}
            </h1>
            <p className="mvst-intro">{intro}</p>
          </div>

          <nav className="mvst-toc" aria-label={tocLabel}>
            <p className="mvst-tl" style={M}>
              {tocLabel}
            </p>
            <ol style={M}>
              {MVST.map((s, i) => (
                <li key={s.id}>
                  <a href={`#mvst-${s.id}`}>
                    <b>Sc. {nn(i)}</b>
                    <span>{s.t}</span>
                    <i aria-hidden />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {MVST.map((s, i) => (
          <article
            key={s.id}
            id={`mvst-${s.id}`}
            className={`mvst-sec${s.stamp ? " is-stamp" : ""}`}
          >
            <div className="mvst-side">
              <span className="mvst-n" style={M}>
                Sc. {nn(i)}
              </span>
              <h2 style={D}>{s.t}</h2>
            </div>
            <div className="mvst-main">
              {s.stamp ? (
                <div className="mvst-stamp">
                  <b style={M}>{stampLabel}</b>
                  <p>{s.lead}</p>
                </div>
              ) : (
                <p className="mvst-lead">{s.lead}</p>
              )}
              {s.live ? (
                <p className="mvst-now" style={M}>
                  <span>Your Site row now reads</span>
                  <b>{who}</b>
                  {siteData.role ? <b>{siteData.role}</b> : null}
                  {siteData.email ? (
                    <b className="mvst-wrap">{siteData.email}</b>
                  ) : null}
                </p>
              ) : null}
              {s.swatches ? (
                <ul className="mvst-sw">
                  {SW.map(([t, k]) => (
                    <li key={k}>
                      <i
                        style={{
                          background: `var(--mv-${k})`,
                        }}
                      />
                      <span style={M}>{t}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {s.steps ? (
                <ol className="mvst-steps">
                  {s.steps.map((x, k) => (
                    <li key={k}>
                      <i style={M}>{nn(k)}</i>
                      <span>{x}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
              {s.paths ? (
                <ul className="mvst-paths">
                  {s.paths.map(([a, b], k) => (
                    <li key={k}>
                      <code style={M}>{a}</code>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {s.rows ? (
                <dl className="mvst-dl">
                  {s.rows.map(([a, b], k) => (
                    <div key={k}>
                      <dt style={M}>{a}</dt>
                      <dd>{b}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {s.note ? (
                <p className="mvst-note">
                  <i aria-hidden />
                  {s.note}
                </p>
              ) : null}
            </div>
          </article>
        ))}

        <footer className="mvst-foot" style={M}>
          <span>End of sheet · {MVST.length} scenes</span>
          {supportEmail ? (
            <span>
              {supportLabel} ·{" "}
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a> · we reply
              fast
            </span>
          ) : null}
        </footer>
      </div>
    </section>
  );
}

const CSS_MVST = `
.mvst{position:relative;z-index:1;width:100%;background:var(--mv-bone);color:var(--mv-ink);padding:clamp(24px,5vw,72px) clamp(12px,3vw,48px) clamp(48px,6vw,96px);--line:color-mix(in srgb,var(--mv-ink) 16%,transparent);--mut:color-mix(in srgb,var(--mv-stone) 60%,var(--mv-ink));--red:#D5402F}
.mvst a{color:inherit}
/* the sheet: typed paper on the paper ground */
.mvst-doc{position:relative;max-width:1120px;margin:0 auto;background:var(--mv-cloud);box-shadow:0 0 0 1px var(--line),0 30px 60px -40px rgba(0,0,0,.35);padding:clamp(20px,4vw,64px);border-radius:4px}
.mvst-doc::before{content:"";position:absolute;left:clamp(10px,2vw,30px);top:0;bottom:0;width:1px;background:color-mix(in srgb,var(--mv-brass) 70%,transparent)}
.mvst-grid{width:100%;border-collapse:collapse;font-size:12px;letter-spacing:.06em;text-transform:uppercase;table-layout:fixed}
.mvst-grid th,.mvst-grid td{border:1px solid var(--line);padding:10px 12px;text-align:left;vertical-align:top;line-height:1.45}
.mvst-grid th{width:13%;font-weight:500;color:var(--mut);background:color-mix(in srgb,var(--mv-ink) 3%,transparent)} .mvst-grid td{text-transform:none;letter-spacing:.01em;font-size:13px}
.mvst-wrap{overflow-wrap:anywhere}
.mvst-title{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);column-gap:clamp(24px,4vw,64px);align-items:end;padding:clamp(40px,6vw,88px) 0 clamp(28px,4vw,48px);border-bottom:2px solid var(--mv-ink)}
.mvst-k{grid-column:1/-1;justify-self:start;display:inline-flex;align-items:center;gap:9px;margin:0 0 20px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut)} .mvst-k i{width:8px;height:8px;border-radius:50%;background:var(--red)}
.mvst-h1{margin:0;font-size:clamp(64px,10vw,152px);line-height:.9;letter-spacing:-.05em;font-stretch:115%;font-weight:var(--mv-font-dw,700)}
.mvst-h1 mark{display:inline-block;color:var(--mv-ink);background:var(--mv-brass);line-height:.84;padding:.02em .06em .06em;margin-left:.02em}
.mvst-intro{margin:0;max-width:640px;font-size:clamp(17px,1.4vw,19px);line-height:1.55}
/* scene list */
.mvst-toc{padding:clamp(24px,3vw,36px) 0;border-bottom:1px solid var(--line)}
.mvst-tl{margin:0 0 14px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut)}
.mvst-toc ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:28px}
.mvst-toc a{display:grid;grid-template-columns:auto 1fr;align-items:baseline;gap:12px;padding:9px 0;border-bottom:1px dashed var(--line);text-decoration:none;font-size:13px;position:relative}
.mvst-toc b{font-weight:500;color:var(--mut);font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.mvst-toc a i{position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--mv-brass);clip-path:inset(0 100% 0 0);transition:clip-path .4s steps(8,end)} .mvst-toc a:hover i,.mvst-toc a:focus-visible i{clip-path:inset(0 0 0 0)}
/* scenes */
.mvst-sec{display:grid;grid-template-columns:minmax(0,.75fr) minmax(0,1.7fr);gap:clamp(20px,4vw,64px);padding:clamp(36px,4.4vw,64px) 0;border-bottom:1px solid var(--line);scroll-margin-top:24px}
.mvst-n{display:inline-block;margin:0 0 12px;padding:3px 8px;border-radius:3px;background:var(--mv-ink);color:var(--mv-cloud);font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.mvst-sec h2{margin:0;font-size:clamp(28px,2.8vw,40px);line-height:1;letter-spacing:-.04em;font-stretch:112%;font-weight:var(--mv-font-dw,700);text-wrap:balance}
.mvst-lead{margin:0 0 22px;max-width:720px;font-size:17px;line-height:1.6}
.mvst-dl{margin:0;display:grid;border-top:1px solid var(--line)} .mvst-dl div{display:grid;grid-template-columns:180px minmax(0,1fr);gap:20px;padding:13px 0;border-bottom:1px solid var(--line)}
.mvst-dl dt{font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding-top:3px;overflow-wrap:anywhere} .mvst-dl dd{margin:0;font-size:15.5px;line-height:1.6;overflow-wrap:anywhere}
.mvst-steps{list-style:none;margin:0;padding:0;display:grid;border-top:1px solid var(--line)} .mvst-steps li{display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:baseline;padding:13px 0;border-bottom:1px solid var(--line);font-size:15.5px;line-height:1.6}
.mvst-steps li i{font-style:normal;font-size:12px;letter-spacing:.06em;color:var(--mut)}
.mvst-now{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 22px;font-size:12px} .mvst-now span{color:var(--mut);letter-spacing:.06em;text-transform:uppercase;margin-right:4px} .mvst-now b{font-weight:500;padding:4px 8px;border-radius:3px;background:var(--mv-brass);color:var(--mv-ink)}
.mvst-sw{list-style:none;margin:0 0 22px;padding:0;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:10px} .mvst-sw li{display:flex;flex-direction:column;gap:8px} .mvst-sw i{display:block;aspect-ratio:4/3;border-radius:4px;box-shadow:inset 0 0 0 1px var(--line)} .mvst-sw span{font-size:12px;letter-spacing:.06em}
.mvst-paths{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line)} .mvst-paths li{display:grid;grid-template-columns:150px 1fr;gap:14px;padding:11px 0;border-bottom:1px solid var(--line);font-size:14.5px;line-height:1.45} .mvst-paths li:nth-child(odd){padding-right:20px}
.mvst-paths code{font-size:12.5px;overflow-wrap:anywhere}
.mvst-note{display:flex;gap:12px;align-items:flex-start;margin:20px 0 0;padding:14px 16px;border-radius:4px;background:color-mix(in srgb,var(--mv-brass) 18%,transparent);box-shadow:inset 3px 0 0 var(--mv-brass);font-size:15px;line-height:1.55} .mvst-note i{flex:none;width:8px;height:8px;margin-top:8px;border-radius:50%;background:var(--mv-ink)}
/* the stamp */
.mvst-stamp{position:relative;max-width:620px;padding:22px 24px;border:2.5px solid var(--red);border-radius:6px;color:var(--mv-ink);rotate:-1.5deg}
.mvst-stamp b{display:inline-block;margin:0 0 10px;font-weight:600;font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:var(--red)} .mvst-stamp p{margin:0;font-size:16px;line-height:1.6}
.mvst-sec.is-stamp{border-bottom:0}
.mvst-foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-top:28px;padding-top:18px;border-top:2px solid var(--mv-ink);font-size:12px;letter-spacing:.04em;color:var(--mut)} .mvst-foot a{color:var(--mv-ink)}
.mvst:is(.is-tab,.is-ph) .mvst-title{grid-template-columns:1fr} .mvst:is(.is-tab,.is-ph) .mvst-intro{margin-top:24px} .mvst.is-tab .mvst-sec{grid-template-columns:1fr;gap:16px} .mvst.is-tab .mvst-toc ol{grid-template-columns:repeat(2,minmax(0,1fr))} .mvst.is-tab .mvst-sw{grid-template-columns:repeat(4,minmax(0,1fr))} .mvst.is-tab .mvst-paths{grid-template-columns:1fr} .mvst.is-tab .mvst-paths li:nth-child(odd){padding-right:0}
.mvst.is-ph .mvst-sec{grid-template-columns:1fr;gap:14px} .mvst.is-ph .mvst-toc ol{grid-template-columns:1fr} .mvst.is-ph .mvst-dl div{grid-template-columns:1fr;gap:4px} .mvst.is-ph .mvst-sw{grid-template-columns:repeat(4,minmax(0,1fr))}
.mvst.is-ph .mvst-paths{grid-template-columns:1fr} .mvst.is-ph .mvst-paths li{grid-template-columns:1fr;gap:2px} .mvst.is-ph .mvst-paths li:nth-child(odd){padding-right:0} .mvst.is-ph .mvst-lead{font-size:16px}
.mvst.is-ph .mvst-grid,.mvst.is-ph .mvst-grid tbody{display:block} .mvst.is-ph .mvst-grid tr{display:grid;grid-template-columns:96px minmax(0,1fr)} .mvst.is-ph .mvst-grid th{width:auto} .mvst.is-ph .mvst-grid th,.mvst.is-ph .mvst-grid td{margin:0 0 -1px 0} .mvst.is-ph .mvst-grid td{margin-left:-1px}
.mvst.is-ph .mvst-doc::before{display:none} .mvst.is-ph .mvst-stamp{rotate:0deg}
@media print{.mvst{padding:0;background:#fff} .mvst-doc{box-shadow:none;padding:0} .mvst-doc::before{display:none} .mvst-sec{break-inside:avoid}}
`;
