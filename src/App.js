import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { supabase } from "./supabaseClient";

// ── Global floating decorations (stars + star-circles) ────────────────────────
// These sit fixed on the screen behind everything, visible on every page.
const DECO_ITEMS = [
  // ── TOP LEFT — hero star + 1 small accent (removed the crowding mid-sizes)
  {
    size: "5.5rem",
    top: "13%",
    left: "3%",
    delay: "0s",
    opacity: 1,
    glyph: "★",
  },
  {
    size: "1.1rem",
    top: "7%",
    left: "17%",
    delay: "0.7s",
    opacity: 0.55,
    glyph: "★",
  },
  {
    size: "1.9rem",
    top: "29%",
    left: "13%",
    delay: "2s",
    opacity: 0.5,
    glyph: "★",
  },
  // ── TOP RIGHT — circles + star
  {
    size: "3.2rem",
    top: "7%",
    right: "3%",
    delay: "0.4s",
    opacity: 0.85,
    glyph: "●",
  },
  {
    size: "1rem",
    top: "4%",
    right: "12%",
    delay: "1.1s",
    opacity: 0.55,
    glyph: "●",
  },
  {
    size: "1.6rem",
    top: "17%",
    right: "2%",
    delay: "1.8s",
    opacity: 0.65,
    glyph: "★",
  },
  // ── MID LEFT — flanking the frame
  {
    size: "1.2rem",
    top: "44%",
    left: "2%",
    delay: "0.5s",
    opacity: 0.45,
    glyph: "★",
  },
  {
    size: "0.7rem",
    top: "52%",
    left: "11%",
    delay: "1.6s",
    opacity: 0.35,
    glyph: "●",
  },
  {
    size: "2.1rem",
    top: "60%",
    left: "4%",
    delay: "0.9s",
    opacity: 0.6,
    glyph: "●",
  },
  {
    size: "0.9rem",
    top: "68%",
    left: "14%",
    delay: "2.3s",
    opacity: 0.4,
    glyph: "★",
  },
  // ── MID RIGHT — flanking the frame
  {
    size: "0.8rem",
    top: "42%",
    right: "9%",
    delay: "1.4s",
    opacity: 0.4,
    glyph: "★",
  },
  {
    size: "1.8rem",
    top: "50%",
    right: "2%",
    delay: "0.3s",
    opacity: 0.55,
    glyph: "●",
  },
  {
    size: "1.1rem",
    top: "62%",
    right: "11%",
    delay: "1.9s",
    opacity: 0.45,
    glyph: "●",
  },
  {
    size: "0.65rem",
    top: "72%",
    right: "5%",
    delay: "2.6s",
    opacity: 0.3,
    glyph: "★",
  },
  // ── BOTTOM LEFT
  {
    size: "2.8rem",
    top: "80%",
    left: "3%",
    delay: "1.0s",
    opacity: 0.75,
    glyph: "★",
  },
  {
    size: "1.0rem",
    top: "88%",
    left: "13%",
    delay: "0.2s",
    opacity: 0.45,
    glyph: "●",
  },
  {
    size: "0.75rem",
    top: "93%",
    left: "6%",
    delay: "1.7s",
    opacity: 0.35,
    glyph: "★",
  },
  {
    size: "1.5rem",
    top: "76%",
    left: "18%",
    delay: "2.4s",
    opacity: 0.5,
    glyph: "●",
  },
  // ── BOTTOM RIGHT
  {
    size: "1.3rem",
    top: "78%",
    right: "4%",
    delay: "0.6s",
    opacity: 0.55,
    glyph: "●",
  },
  {
    size: "2.4rem",
    top: "85%",
    right: "2%",
    delay: "1.5s",
    opacity: 0.75,
    glyph: "★",
  },
  {
    size: "0.8rem",
    top: "91%",
    right: "13%",
    delay: "0.8s",
    opacity: 0.35,
    glyph: "●",
  },
  {
    size: "1.1rem",
    top: "96%",
    right: "6%",
    delay: "2.1s",
    opacity: 0.45,
    glyph: "★",
  },
];

function FloatingDeco() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {DECO_ITEMS.map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: d.top || "auto",
            bottom: d.bottom || "auto",
            left: d.left || "auto",
            right: d.right || "auto",
            fontSize: d.size,
            color: "var(--gold)",
            opacity: d.opacity,
            lineHeight: 1,
            filter:
              "drop-shadow(0 0 8px rgba(201,168,76,0.7)) drop-shadow(0 0 20px rgba(201,168,76,0.35))",
            animation: `starFloat 4s ease-in-out ${d.delay} infinite`,
          }}
        >
          {d.glyph}
        </span>
      ))}
    </div>
  );
}

// ── Service data ──────────────────────────────────────────────────────────────
const SERVICE_DATA = {
  "digital artist": {
    quote: "One brushstroke at a time — all from my phone! ⸜(｡˃ ᵕ ˂ )⸝",
    tool: "ibis Paint X",
    toolIcon: "🎨",
    projects: [
      { label: "1" },
      { label: "2" },
      { label: "3" },
      { label: "4" },
      { label: "5" },
    ],
  },
  "ui/ux designer": {
    quote: "If I can imagine it, Figma helps me build it!",
    tool: "Figma + Wix",
    toolIcon: "🔷",
    projects: [
      {
        title: "portfolio",
        sub: "ui/ux design · figma prototype",
        description:
          "A personal portfolio concept designed and prototyped in Figma — mockups and clickable navigation flows built out before development began.",
        img: "/f1.png",
        link: "https://www.figma.com/proto/VeGPiK0FUfDK0qpkimExHf/kangkang?node-id=360-35&t=QppVUxLHnlqnkizB-1",
        screenshots: [
          "/portfolio-figma/1.png",
          "/portfolio-figma/2.png",
          "/portfolio-figma/3.png",
          "/portfolio-figma/4.png",
          "/portfolio-figma/5.png",
          "/portfolio-figma/6.png",
        ],
      },
      {
        title: "profile card",
        sub: "ui/ux design · figma prototype",
        description:
          "A Figma prototype for my portfolio's landing screen — combining my avatar, contact details, and a short bio into a single, focused first impression.",
        img: "/f2.png",
        link: "https://www.figma.com/proto/VeGPiK0FUfDK0qpkimExHf/kangkang?node-id=454-28&t=QppVUxLHnlqnkizB-1",
        screenshots: ["/profile_card-figma/1.png"],
      },
      {
        title: "gvc-portfolio",
        sub: "academic project · wix",
        description:
          "An academic project for my GVC subject, built as a blog-format site in Wix to compile and document all our class activities in one place.",
        img: "/s2.png",
        link: "https://belamora04.wixsite.com/ibmora0",
      },
    ],
  },
  "web developer": {
    quote: "Turning designs into real websites, one line of code at a time!",
    tool: "VS Code",
    toolIcon: "💻",
    projects: [
      {
        title: "kangkang-portfolio",
        sub: "personal portfolio · react.js · vercel",
        description:
          "My personal portfolio — a Figma mockup brought to life with React.js and CSS, deployed on Vercel. I extended the original design during development, building out the browser-frame UI and tabbed navigation myself, then refined things further until the whole site matched my own aesthetic — a star-motif, cozy-dark theme built around a mascot character I created.",
        img: "/kangkang-portfolio/1.png",
        link: "kangkang-portfolio.vercel.app",
        tools: ["React", "CSS", "Vercel", "GitHub", "VS Code"],
      },
    ],
  },
};

// ── Portfolio sections ────────────────────────────────────────────────────────
function HomeSection() {
  return (
    <div
      className="section-content hero-bg"
      style={{ backgroundImage: "url(/frame1.png)" }}
    >
      <div className="hero-overlay" />
      <div className="hero-text">
        <h1 className="hero-title">
          <span className="star-prefix">★—</span>welcome!
          <br />
          kangkang's here
        </h1>
        <p className="hero-desc">
          "mabuhay! you can call me kangkang — a digital artist and web
          developer with budding skills and a growing portfolio. i'm eager to
          learn and take on new challenges! ⸜(｡˃ ᵕ ˂ )⸝♡"
        </p>
        <a
          href="/Issabela_Mora_Resume.pdf"
          download
          className="hero-profile-link"
        >
          ↓ Download Resume
        </a>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="section-content">
      <div className="services-hero">
        <div className="services-hero-placeholder"></div>
        <div className="services-hero-text">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="star-prefix">★—</span> welcome!
            <br />a little about me
          </h2>
        </div>
      </div>
      <p className="service-quote">
        "A digital artist & web developer, having fun doing both"
      </p>

      <div className="about-details-card">
        <div className="about-columns">
          <div className="about-block">
            <div className="about-block-title">short intro</div>
            <ul className="about-list">
              <li>pronouns: she/her</li>
              <li>nationality: Filipino 🇵🇭</li>
              <li>
                personality: introverted, detail-oriented — suited for focused
                design and patient debugging
              </li>
            </ul>
          </div>
          <div className="about-block">
            <div className="about-block-title">what I do</div>
            <ul className="about-list">
              <li>character illustration</li>
              <li>UI/UX web design</li>
              <li>front-end web development</li>
              <li>software QA testing & bug tracking</li>
            </ul>
          </div>
        </div>
        <div className="divider-line" />
        <div className="about-block">
          <div className="about-block-title">why I do this</div>
          <p className="about-paragraph">
            Coding never came easy to me, but somewhere in the struggle I found
            what I actually love — designing how things should feel, and chasing
            down what's broken until it isn't. Turns out QA is my favorite part.
          </p>
        </div>
      </div>
    </div>
  );
}

function ServicesSection({ onPreview, onOpenGallery }) {
  const [activeService, setActiveService] = useState("digital artist");
  const svcData = SERVICE_DATA[activeService];
  const isUiUx = activeService === "ui/ux designer";
  const isWebDev = activeService === "web developer";
  const showsGalleryModal = isUiUx || isWebDev;

  return (
    <div className="section-content">
      <div className="services-hero">
        <div className="services-hero-placeholder"></div>
        <div className="services-hero-text">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="star-prefix">★—</span> welcome!
            <br />
            here's what I can do
          </h2>
        </div>
      </div>
      <div className="service-tabs">
        {Object.keys(SERVICE_DATA).map((key) => (
          <button
            key={key}
            className={`service-tab ${activeService === key ? "active" : ""}`}
            onClick={() => setActiveService(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <p className="service-quote">"{svcData.quote}"</p>

      {activeService === "digital artist" ? (
        <div className="artwork-scroll">
          {svcData.projects.map((p, i) => (
            <div
              key={i}
              className="artwork-item"
              onClick={() =>
                onPreview(
                  svcData.projects.map((_, idx) => `/${idx + 1}.png`),
                  i,
                )
              }
            >
              <img
                src={`/${i + 1}.png`}
                alt={p.label}
                className="artwork-img"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="service-scroll">
          {svcData.projects.map((p, i) => (
            <div
              key={i}
              className="service-scroll-card"
              onClick={showsGalleryModal ? () => onOpenGallery(p) : undefined}
              style={showsGalleryModal ? { cursor: "pointer" } : undefined}
            >
              {p.img && (
                <div className="service-project-cover">
                  <img src={p.img} alt={p.title} />
                </div>
              )}
              {!p.img && p.emoji && (
                <div className="service-scroll-emoji">{p.emoji}</div>
              )}
              <div className="service-project-info">
                <h4>
                  {showsGalleryModal ? (
                    p.title
                  ) : p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="service-title-link"
                    >
                      {p.title} ↗
                    </a>
                  ) : (
                    p.title
                  )}
                </h4>
                <p>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tool-badge-row">
        <div className="tool-badge">
          <span>{svcData.toolIcon}</span>
          <span>{svcData.tool}</span>
        </div>
        {activeService === "digital artist" && (
          <button
            className="btn-gold btn-gold--disabled"
            disabled
            title="Gallery link coming soon"
          >
            view gallery
          </button>
        )}
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="section-content">
      <div className="services-hero">
        <div className="services-hero-placeholder"></div>
        <div className="services-hero-text">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="star-prefix">★—</span> welcome!
            <br />
            let's talk!
          </h2>
        </div>
      </div>
      <p className="service-quote">
        "Looking for a way to contact me? I've got you!"
      </p>
      <div className="contact-group">
        <div className="contact-group-title">ways to reach me</div>
        <div className="profile-contact-item contact-item">
          <span className="profile-contact-icon contact-icon">✉</span>
          <span>
            <a href="mailto:kangkangaroooooo@gmail.com">
              kangkangaroooooo@gmail.com
            </a>
            {" / "}
            <a href="mailto:ibmora00@gmail.com">ibmora00@gmail.com</a>
          </span>
        </div>
        <div className="profile-contact-item contact-item">
          <span className="profile-contact-icon contact-icon">f</span>
          <span>
            <a href="https://www.facebook.com/profile.php?id=61591034440884">
              kang kang
            </a>
            {" / "}
            <a href="https://www.facebook.com/profile.php?id=61590355995156">
              issabela mora
            </a>
          </span>
        </div>
        <div className="profile-contact-item contact-item">
          <span className="profile-contact-icon contact-icon">@</span>
          <span>
            <a href="https://www.instagram.com/kangkangarooo?igsh=MWFudXM4d2p0NTIwZQ==">
              kangkangarooo
            </a>
          </span>
        </div>
      </div>
      <a
        href="/Issabela_Mora_Resume.pdf"
        download
        className="btn-gold"
        style={{ marginTop: "8px" }}
      >
        ↓ Download Resume
      </a>
    </div>
  );
}

// ── Portfolio shell (browser frame) ──────────────────────────────────────────
const TABS = ["home", "about me", "services", "get in touch"];
const TAB_URLS = {
  home: "@kangkang/portfolio",
  "about me": "@kangkang/about",
  services: "@kangkang/services",
  "get in touch": "@kangkang/contact",
};

function Portfolio({ onBack }) {
  const [activeTab, setActiveTab] = useState("home");
  const [lightbox, setLightbox] = useState(null);
  const [galleryModal, setGalleryModal] = useState(null);
  const openLightbox = (items, index) => setLightbox({ items, index });
  const goPrevImg = () =>
    setLightbox((p) => ({
      ...p,
      index: p.index === 0 ? p.items.length - 1 : p.index - 1,
    }));
  const goNextImg = () =>
    setLightbox((p) => ({
      ...p,
      index: p.index === p.items.length - 1 ? 0 : p.index + 1,
    }));

  const renderSection = () => {
    switch (activeTab) {
      case "home":
        return <HomeSection />;
      case "about me":
        return <AboutSection />;
      case "services":
        return (
          <ServicesSection
            onPreview={openLightbox}
            onOpenGallery={setGalleryModal}
          />
        );
      case "get in touch":
        return <ContactSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <>
      {/* Gallery modal — also outside the browser frame, no clipping */}
      {galleryModal && (
        <div className="lightbox-overlay" onClick={() => setGalleryModal(null)}>
          <div
            className="lightbox-card experience-modal experience-modal--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-card-bar modal-bar-titled">
              <span className="modal-bar-title">
                <span className="star-prefix">★</span> {galleryModal.title}
              </span>
              <button
                className="lightbox-close"
                onClick={() => setGalleryModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="experience-modal-body experience-modal-body--split experience-modal-body--split-2">
              <div className="experience-modal-details">
                <div className="profile-intern-role">{galleryModal.title}</div>
                <div className="profile-intern-company">{galleryModal.sub}</div>
                <div className="experience-modal-divider" />
                <p
                  className="about-paragraph"
                  style={{ marginTop: "10px", marginBottom: "16px" }}
                >
                  {galleryModal.description ||
                    "A short description of this project goes here — what it's about, the problem it solves, and what role I played in designing it."}
                </p>
                {galleryModal.tools && galleryModal.tools.length > 0 && (
                  <>
                    <div className="about-block-title">
                      tools &amp; software used
                    </div>
                    <p
                      className="skill-text-list skill-text-list--primary"
                      style={{ marginBottom: "16px" }}
                    >
                      {galleryModal.tools.map((t, i) => (
                        <span key={t}>
                          {t}
                          {i < galleryModal.tools.length - 1 && (
                            <span className="skill-text-dot">•</span>
                          )}
                        </span>
                      ))}
                    </p>
                  </>
                )}
                {galleryModal.link && (
                  <a
                    href={galleryModal.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold experience-demo-btn"
                  >
                    ↗ view live{" "}
                    {galleryModal.link.includes("figma") ? "prototype" : "site"}
                  </a>
                )}
              </div>
              <div className="experience-modal-gallery-col">
                <div className="screenshot-gallery">
                  <div className="screenshot-gallery-label">★ screenshots</div>
                  {galleryModal.screenshots &&
                  galleryModal.screenshots.length > 0 ? (
                    <div className="screenshot-grid">
                      {galleryModal.screenshots.map((src, i) => (
                        <button
                          key={src}
                          className="screenshot-thumb"
                          onClick={() =>
                            openLightbox(galleryModal.screenshots, i)
                          }
                        >
                          <img
                            src={src}
                            alt={`${galleryModal.title} screenshot ${i + 1}`}
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    galleryModal.img && (
                      <button
                        className="screenshot-thumb"
                        style={{ width: "100%", aspectRatio: "16 / 10" }}
                        onClick={() => openLightbox([galleryModal.img], 0)}
                      >
                        <img src={galleryModal.img} alt={galleryModal.title} />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox is NOW outside the browser frame — no clipping! */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-card-bar modal-bar-titled">
              <span className="modal-bar-title">
                <span className="star-prefix">★</span> artwork preview
              </span>
              <button
                className="lightbox-close"
                onClick={() => setLightbox(null)}
              >
                ✕
              </button>
            </div>
            <div className="lightbox-img-wrap">
              {lightbox.items.length > 1 && (
                <button
                  className="lightbox-nav-arrow lightbox-nav-arrow--prev"
                  onClick={goPrevImg}
                >
                  ‹
                </button>
              )}
              <div className="lightbox-frame">
                <img
                  src={lightbox.items[lightbox.index]}
                  alt="preview"
                  className="lightbox-img"
                />
              </div>
              {lightbox.items.length > 1 && (
                <button
                  className="lightbox-nav-arrow lightbox-nav-arrow--next"
                  onClick={goNextImg}
                >
                  ›
                </button>
              )}
              {lightbox.items.length > 1 && (
                <div className="lightbox-counter">
                  {lightbox.index + 1} / {lightbox.items.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="page single">
        <div style={{ position: "relative" }}>
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots">
                <span className="dot-red" />
                <span className="dot-yellow" />
                <span className="dot-green" />
              </div>
              <div className="browser-url">{TAB_URLS[activeTab]}</div>
              <button className="back-btn" onClick={onBack}>
                ← back
              </button>
            </div>
            <div key={activeTab} className="tab-panel">
              {renderSection()}
            </div>
            <nav className="nav-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    activeTab === tab
                      ? tab === "get in touch"
                        ? "active active-gold"
                        : "active"
                      : ""
                  }
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Profile card (landing page) ───────────────────────────────────────────────
function ProfileTab({ onViewPortfolio }) {
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .single();
      if (error) {
        console.error("profile load failed:", error);
        setLoadError(true);
      } else {
        setProfile(data);
      }
    }
    loadProfile();
  }, []);

  if (loadError)
    return <p className="experience-empty">couldn't load profile (´•̥ ω •̥`)</p>;
  if (!profile) return <p className="experience-empty">loading…</p>;

  return (
    <>
      <div className="profile-header-row">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            <img src="/kangkang.png" alt="Kangkang" />
          </div>
        </div>
        <div className="profile-header-text">
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-title">{profile.title}</p>
          <div className="profile-contacts">
            <div className="profile-contact-item">
              <span className="profile-contact-icon">✉</span>
              <span>
                <a href={`mailto:${profile.email_1}`}>{profile.email_1}</a>
                {" / "}
                <a href={`mailto:${profile.email_2}`}>{profile.email_2}</a>
              </span>
            </div>
            <a
              href={profile.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="profile-contact-item"
            >
              <span className="profile-contact-icon">@</span>
              <span>{profile.instagram_handle}</span>
            </a>
          </div>
        </div>
      </div>
      <div className="profile-about-label">
        <span>ABOUT</span>
      </div>
      <div className="profile-about-box">
        <p>{profile.about}</p>
      </div>
      <button className="profile-portfolio-btn" onClick={onViewPortfolio}>
        ✦ View My Portfolio ✦
      </button>
    </>
  );
}

function CollapsibleSkillGroup({ label, skills, isOpen, onToggle }) {
  return (
    <div className={`skills-row-card ${isOpen ? "skills-row-card--open" : ""}`}>
      <button className="skills-toggle" onClick={onToggle}>
        <span className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}>▸</span>
        {label}
      </button>
      {isOpen && (
        <p className="skill-text-list skill-text-list--primary nested-skills">
          {skills.map((s, i) => (
            <span key={s}>
              {s}
              {i < skills.length - 1 && (
                <span className="skill-text-dot">•</span>
              )}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function SkillsTab() {
  const [activeSection, setActiveSection] = useState("technical");
  const [openCategory, setOpenCategory] = useState(null);
  const [categories, setCategories] = useState(null);
  const [softSkills, setSoftSkills] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadSkills() {
      const [catRes, skillRes] = await Promise.all([
        supabase.from("skill_categories").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
      ]);
      if (catRes.error || skillRes.error) {
        console.error("skills load failed:", catRes.error || skillRes.error);
        setLoadError(true);
        return;
      }
      // group: attach each category's skills via the foreign key match
      const grouped = catRes.data.map((cat) => ({
        ...cat,
        skills: skillRes.data
          .filter((s) => s.category_id === cat.id)
          .map((s) => s.name),
      }));
      setCategories(grouped);
      setSoftSkills(
        skillRes.data.filter((s) => s.section === "soft").map((s) => s.name),
      );
    }
    loadSkills();
  }, []);

  const toggleCategory = (label) => {
    setOpenCategory((prev) => (prev === label ? null : label));
  };

  if (loadError)
    return <p className="experience-empty">couldn't load skills (´•̥ ω •̥`)</p>;
  if (!categories || !softSkills)
    return <p className="experience-empty">loading…</p>;

  return (
    <div className="profile-skills-row">
      <div className="service-tabs">
        <button
          className={`service-tab ${activeSection === "technical" ? "active" : ""}`}
          onClick={() => setActiveSection("technical")}
        >
          technical
        </button>
        <button
          className={`service-tab ${activeSection === "soft" ? "active" : ""}`}
          onClick={() => setActiveSection("soft")}
        >
          soft skills
        </button>
      </div>

      <div className="skills-panel">
        {activeSection === "technical" ? (
          <>
            {categories.map((cat) => (
              <CollapsibleSkillGroup
                key={cat.id}
                label={cat.label}
                skills={cat.skills}
                isOpen={openCategory === cat.label}
                onToggle={() => toggleCategory(cat.label)}
              />
            ))}
          </>
        ) : (
          <div className="skills-row-card">
            <p className="skill-text-list skill-text-list--soft">
              {softSkills.map((s, i) => (
                <span key={s}>
                  {s}
                  {i < softSkills.length - 1 && (
                    <span className="skill-text-dot">•</span>
                  )}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const TK_SYSTEM_SCREENSHOTS = {
  hr: {
    label: "HR",
    shots: [
      { src: "/tk-system/hr_dashboard.png", label: "dashboard" },
      { src: "/tk-system/hr_employees-profile.png", label: "employee profile" },
      { src: "/tk-system/hr_emp-201.png", label: "employee 201 file" },
      { src: "/tk-system/hr_emp-202.png", label: "employee 202 file" },
      { src: "/tk-system/hr_201.png", label: "201 file" },
      { src: "/tk-system/hr_timekeeping.png", label: "timekeeping" },
      { src: "/tk-system/hr_view-schedule.png", label: "view schedule" },
      { src: "/tk-system/hr_edit-schedule.png", label: "edit schedule" },
      { src: "/tk-system/hr_swap-schedule.png", label: "swap schedule" },
      { src: "/tk-system/hr_leave.png", label: "leave management" },
      { src: "/tk-system/hr_summary-report.png", label: "summary report" },
      { src: "/tk-system/hr_settings.png", label: "settings" },
    ],
  },
  operations: {
    label: "operations",
    shots: [
      { src: "/tk-system/login.png", label: "login" },
      { src: "/tk-system/op_dashboard.png", label: "dashboard" },
      { src: "/tk-system/op_employees.png", label: "employees" },
      { src: "/tk-system/op_roster.png", label: "roster" },
      {
        src: "/tk-system/op_roster-shifts-schedules.png",
        label: "roster shifts & schedules",
      },
      { src: "/tk-system/op_shift-presets.png", label: "shift presets" },
      {
        src: "/tk-system/op_shift-presets-shifts-schedules.png",
        label: "shift presets & schedules",
      },
    ],
  },
  superadmin: {
    label: "superadmin",
    shots: [
      { src: "/tk-system/superadmin_dashboard.png", label: "dashboard" },
      { src: "/tk-system/superadmin_analytics.png", label: "analytics" },
      { src: "/tk-system/superadmin_audit.png", label: "audit log" },
      { src: "/tk-system/superadmin_settings.png", label: "settings" },
    ],
  },
};

const TK_SYSTEM_REPORTS = [
  {
    id: "qa-finding-schedule-swap",
    label: "QA finding: schedule swap",
    pdf: "qa-finding-schedule-swap.pdf",
  },
  {
    id: "bug-report-hiring-date",
    label: "Bug report: hiring date",
    pdf: "bug-report-hiring-date.pdf",
  },
];

const EXPERIENCE_DATA = {
  internship: [
    {
      role: "Web Developer Intern",
      company: "Pasay Taft Tourist Dev Inc. (Urban Travellers Hotel)",
      period: "February 2026 – May 2026 (300 hours)",
      points: [
        "Collaborated on system design for a fully deployed employee attendance and timekeeping system, from concept through deployment.",
        "Built backend functionality in JavaScript and Node.js, integrating ZKTeco SDK/libraries for real-time communication with a biometric device serving ~70 employees.",
        "Tested system performance and identified, tracked, and resolved all reported bugs, improving reliability and uptime.",
        "Used AI-assisted tools (ChatGPT, Claude) to speed up coding and debugging.",
      ],
      // Entries can optionally include `screenshots` (grouped image data,
      // shown as a two-column gallery) and/or `demoLink` (shown as a
      // "view live demo" button when there are no screenshots to show).
      screenshots: TK_SYSTEM_SCREENSHOTS,
      reports: TK_SYSTEM_REPORTS,
      demoLink: null,
    },
  ],
  work: [],
};

const EXPERIENCE_EMPTY_MESSAGE = {
  internship: "no internship experience yet",
  work: "no work experience yet",
};

function ExperienceTab({ onReadMore }) {
  const [activeCategory, setActiveCategory] = useState("internship");
  const [currentIndex, setCurrentIndex] = useState(0);
  const entries = EXPERIENCE_DATA[activeCategory];
  const entry = entries[currentIndex];

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
  };

  const goPrev = () =>
    setCurrentIndex((i) => (i === 0 ? entries.length - 1 : i - 1));
  const goNext = () =>
    setCurrentIndex((i) => (i === entries.length - 1 ? 0 : i + 1));

  return (
    <div className="profile-skills-row">
      <div className="service-tabs">
        {Object.keys(EXPERIENCE_DATA).map((cat) => (
          <button
            key={cat}
            className={`service-tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="profile-skills-group skills-panel">
        {entries.length === 0 ? (
          <p className="experience-empty">
            {EXPERIENCE_EMPTY_MESSAGE[activeCategory]}
          </p>
        ) : (
          <div className="experience-pager">
            {entries.length > 1 && (
              <button className="experience-pager-arrow" onClick={goPrev}>
                ‹
              </button>
            )}
            <div className="experience-card">
              <div className="profile-intern-role">{entry.role}</div>
              <div className="profile-intern-company">{entry.company}</div>
              <div className="profile-intern-period">{entry.period}</div>
              <p className="experience-teaser">— {entry.points[0]}</p>
              <button
                className="experience-readmore"
                onClick={() => onReadMore(entry)}
              >
                read more →
              </button>
            </div>
            {entries.length > 1 && (
              <button className="experience-pager-arrow" onClick={goNext}>
                ›
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScreenshotGallery({ screenshots, onPreview }) {
  const roles = Object.keys(screenshots);
  const [activeRole, setActiveRole] = useState(roles[0]);
  const shots = screenshots[activeRole].shots;

  return (
    <div className="screenshot-gallery">
      <div className="screenshot-gallery-label">★ system screenshots</div>
      <div className="service-tabs">
        {roles.map((role) => (
          <button
            key={role}
            className={`service-tab ${activeRole === role ? "active" : ""}`}
            onClick={() => setActiveRole(role)}
          >
            {screenshots[role].label}
          </button>
        ))}
      </div>
      <div className="screenshot-grid">
        {shots.map((shot) => (
          <button
            key={shot.src}
            className="screenshot-thumb"
            onClick={() =>
              onPreview({
                type: "image",
                items: shots,
                index: shots.indexOf(shot),
              })
            }
          >
            <img src={shot.src} alt={shot.label} loading="lazy" />
            <span className="screenshot-thumb-label">{shot.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function QAReportsList({ reports, onPreview }) {
  return (
    <div className="qa-reports-list">
      <div className="qa-reports-label">★ QA findings &amp; reports</div>
      <div className="qa-reports-items">
        {reports.map((item) => (
          <button
            key={item.id}
            className="qa-report-row"
            onClick={() => onPreview({ ...item, type: "report" })}
          >
            <span className="qa-report-row-icon">PDF</span>
            <span className="qa-report-row-label">{item.label}</span>
            <span className="qa-report-row-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const PROFILE_TABS = ["profile", "skills", "experience"];
const PROFILE_TAB_URLS = {
  profile: "@kangkang/profile",
  skills: "@kangkang/skills",
  experience: "@kangkang/experience",
};

const COVER_HEADINGS = {
  skills: "here's what I bring to the table",
  experience: "here's my experience so far",
};

function ProfileCard({ onViewPortfolio }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const hasCover =
    activeTab === "profile" ||
    activeTab === "skills" ||
    activeTab === "experience";
  const coverHeading = COVER_HEADINGS[activeTab];

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab onViewPortfolio={onViewPortfolio} />;
      case "skills":
        return <SkillsTab />;
      case "experience":
        return <ExperienceTab onReadMore={setExpandedEntry} />;
      default:
        return <ProfileTab onViewPortfolio={onViewPortfolio} />;
    }
  };

  return (
    <div className="profile-bg">
      {expandedEntry && (
        <div
          className="lightbox-overlay"
          onClick={() => setExpandedEntry(null)}
        >
          <div
            className={`lightbox-card experience-modal ${
              expandedEntry.screenshots ? "experience-modal--wide" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-card-bar modal-bar-titled">
              <span className="modal-bar-title">
                <span className="star-prefix">★</span> experience details
              </span>
              <button
                className="lightbox-close"
                onClick={() => setExpandedEntry(null)}
              >
                ✕
              </button>
            </div>
            <div
              className={`experience-modal-body ${
                expandedEntry.screenshots
                  ? `experience-modal-body--split ${
                      expandedEntry.reports && expandedEntry.reports.length > 0
                        ? ""
                        : "experience-modal-body--split-2"
                    }`
                  : ""
              }`}
            >
              <div className="experience-modal-details">
                <div className="profile-intern-role">{expandedEntry.role}</div>
                <div className="profile-intern-company">
                  {expandedEntry.company}
                </div>
                <div className="profile-intern-period">
                  {expandedEntry.period}
                </div>
                <div className="experience-modal-divider" />
                <ul className="profile-intern-points">
                  {expandedEntry.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {!expandedEntry.screenshots && expandedEntry.demoLink && (
                  <a
                    href={expandedEntry.demoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold experience-demo-btn"
                  >
                    ↗ view live demo
                  </a>
                )}
              </div>
              {expandedEntry.screenshots && (
                <div className="experience-modal-gallery-col">
                  <ScreenshotGallery
                    screenshots={expandedEntry.screenshots}
                    onPreview={setPreviewImg}
                  />
                </div>
              )}
              {expandedEntry.reports && expandedEntry.reports.length > 0 && (
                <div className="experience-modal-qa-col">
                  <QAReportsList
                    reports={expandedEntry.reports}
                    onPreview={setPreviewImg}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {previewImg && (
        <div
          className="lightbox-overlay screenshot-preview-overlay"
          onClick={() => setPreviewImg(null)}
        >
          <div
            className={`lightbox-card ${
              previewImg.type === "report" ? "report-preview-card" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-card-bar modal-bar-titled">
              <span className="modal-bar-title">
                <span className="star-prefix">★</span>{" "}
                {previewImg.type === "report"
                  ? previewImg.label
                  : previewImg.items[previewImg.index].label}
              </span>
              <button
                className="lightbox-close"
                onClick={() => setPreviewImg(null)}
              >
                ✕
              </button>
            </div>
            {previewImg.type === "report" ? (
              <div className="report-pdf-wrap">
                <embed
                  src={previewImg.pdf}
                  type="application/pdf"
                  className="report-pdf-embed"
                />
                <a
                  href={previewImg.pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="report-pdf-fallback-link"
                >
                  having trouble viewing? open in a new tab ↗
                </a>
              </div>
            ) : (
              <div className="lightbox-img-wrap">
                {previewImg.items.length > 1 && (
                  <button
                    className="lightbox-nav-arrow lightbox-nav-arrow--prev"
                    onClick={() =>
                      setPreviewImg((p) => ({
                        ...p,
                        index: p.index === 0 ? p.items.length - 1 : p.index - 1,
                      }))
                    }
                  >
                    ‹
                  </button>
                )}
                <div className="lightbox-frame">
                  <img
                    src={previewImg.items[previewImg.index].src}
                    alt={previewImg.items[previewImg.index].label}
                    className="lightbox-img"
                  />
                </div>
                {previewImg.items.length > 1 && (
                  <button
                    className="lightbox-nav-arrow lightbox-nav-arrow--next"
                    onClick={() =>
                      setPreviewImg((p) => ({
                        ...p,
                        index: p.index === p.items.length - 1 ? 0 : p.index + 1,
                      }))
                    }
                  >
                    ›
                  </button>
                )}
                {previewImg.items.length > 1 && (
                  <div className="lightbox-counter">
                    {previewImg.index + 1} / {previewImg.items.length}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="profile-card">
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <div className="browser-url">{PROFILE_TAB_URLS[activeTab]}</div>
          {(activeTab === "skills" || activeTab === "experience") && (
            <button className="back-btn" onClick={onViewPortfolio}>
              portfolio →
            </button>
          )}
        </div>

        <div className="profile-card-body">
          {hasCover && (
            <div className="profile-cover">
              {coverHeading && (
                <div className="profile-cover-overlay">
                  <div className="profile-cover-text">
                    <h2 className="section-title" style={{ marginBottom: 0 }}>
                      <span className="star-prefix">★—</span> welcome!
                      <br />
                      {coverHeading}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          )}
          <div
            className={`profile-single-col ${!hasCover ? "no-cover" : ""}`}
            key={activeTab}
          >
            {renderTab()}
          </div>
        </div>

        <nav className="nav-tabs">
          {PROFILE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "active" : ""}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

  // ── Admin: skills manager ─────────────────────────────────────────────────────
const adminInputStyle = {
  width: "100%",
  padding: "8px 10px",
  textAlign: "left",
  border: "1px solid var(--frame-border)",
  color: "var(--text)",
  fontFamily: "Inter, sans-serif",
};

function AdminSkills() {
  const [categories, setCategories] = useState(null);
  const [skills, setSkills] = useState(null);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [msg, setMsg] = useState(null);
  const [activeSection, setActiveSection] = useState("technical");
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (label) => {
    setOpenCategory((prev) => (prev === label ? null : label));
    setNewSkillName("");
  };

  useEffect(() => {
    async function loadAll() {
      const [catRes, skillRes] = await Promise.all([
        supabase.from("skill_categories").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
      ]);
      if (!catRes.error && !skillRes.error) {
        setCategories(catRes.data);
        setSkills(skillRes.data);
      }
    }
    loadAll();
  }, []);

  const showError = (error) =>
    setMsg({ ok: false, text: `failed: ${error.message}` });

  const addCategory = async () => {
    const label = newCatLabel.trim();
    if (!label) return;
    const nextOrder =
      categories.length > 0
        ? Math.max(...categories.map((c) => c.sort_order)) + 1
        : 0;
    const { data, error } = await supabase
      .from("skill_categories")
      .insert({ label, sort_order: nextOrder })
      .select()
      .single();
    if (error) return showError(error);
    setCategories((prev) => [...prev, data]);
    setNewCatLabel("");
    setMsg({ ok: true, text: `added category "${label}" ✦` });
  };

  const addSkill = async ({ name, section, category_id = null }) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const siblings = skills.filter((s) =>
      section === "soft"
        ? s.section === "soft"
        : s.category_id === category_id,
    );
    const nextOrder =
      siblings.length > 0
        ? Math.max(...siblings.map((s) => s.sort_order)) + 1
        : 0;
    const { data, error } = await supabase
      .from("skills")
      .insert({ name: trimmed, section, category_id, sort_order: nextOrder })
      .select()
      .single();
    if (error) return showError(error);
    setSkills((prev) => [...prev, data]);
    setMsg({ ok: true, text: `added "${trimmed}" ✦` });
  };

  const deleteSkill = async (skill) => {
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", skill.id);
    if (error) return showError(error);
    setSkills((prev) => prev.filter((s) => s.id !== skill.id));
    setMsg({ ok: true, text: `deleted "${skill.name}"` });
  };

  const deleteCategory = async (cat) => {
    const catSkills = skills.filter((s) => s.category_id === cat.id);
    if (catSkills.length > 0) {
      const confirmed = window.confirm(
        `"${cat.label}" has ${catSkills.length} skill(s):\n` +
          catSkills.map((s) => `• ${s.name}`).join("\n") +
          `\n\ndelete the category AND all its skills?`,
      );
      if (!confirmed) return;
      // children first — restrict blocks the category delete otherwise
      const { error: skillErr } = await supabase
        .from("skills")
        .delete()
        .eq("category_id", cat.id);
      if (skillErr) return showError(skillErr);
    }
    const { error } = await supabase
      .from("skill_categories")
      .delete()
      .eq("id", cat.id);
    if (error) return showError(error);
    setSkills((prev) => prev.filter((s) => s.category_id !== cat.id));
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    setMsg({ ok: true, text: `deleted category "${cat.label}"` });
  };

  if (!categories || !skills)
    return <p className="experience-empty">loading skills…</p>;

  const softSkills = skills.filter((s) => s.section === "soft");

  return (
    <>
      <div className="profile-about-label" style={{ marginTop: "20px" }}>
        <span>SKILLS</span>
      </div>

      <div className="profile-skills-row">
        <div className="service-tabs">
          <button
            type="button"
            className={`service-tab ${activeSection === "technical" ? "active" : ""}`}
            onClick={() => setActiveSection("technical")}
          >
            technical
          </button>
          <button
            type="button"
            className={`service-tab ${activeSection === "soft" ? "active" : ""}`}
            onClick={() => setActiveSection("soft")}
          >
            soft skills
          </button>
        </div>

        <div className="skills-panel">
          {activeSection === "technical" ? (
            <>
              {categories.map((cat) => {
                const isOpen = openCategory === cat.label;
                const catSkills = skills.filter(
                  (s) => s.category_id === cat.id,
                );
                return (
                  <div
                    key={cat.id}
                    className={`skills-row-card ${isOpen ? "skills-row-card--open" : ""}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        className="skills-toggle"
                        style={{ width: "auto", flex: 1 }}
                        onClick={() => toggleCategory(cat.label)}
                      >
                        <span
                          className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}
                        >
                          ▸
                        </span>
                        {cat.label}
                      </button>
                      <button
                        type="button"
                        className="back-btn"
                        onClick={() => deleteCategory(cat)}
                      >
                        ✕
                      </button>
                    </div>
                    {isOpen && (
                      <div className="nested-skills">
                        {catSkills.map((s) => (
                          <div
                            key={s.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "8px",
                            }}
                          >
                            <span className="skill-text-list skill-text-list--muted">
                              {s.name}
                            </span>
                            <button
                              type="button"
                              className="back-btn"
                              onClick={() => deleteSkill(s)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            marginTop: "8px",
                          }}
                        >
                          <input
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder="add a skill…"
                            className="browser-url"
                            style={adminInputStyle}
                          />
                          <button
                            type="button"
                            className="btn-gold"
                            onClick={() =>
                              addSkill({
                                name: newSkillName,
                                section: "technical",
                                category_id: cat.id,
                              }).then(() => setNewSkillName(""))
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                <input
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="new category…"
                  className="browser-url"
                  style={adminInputStyle}
                />
                <button
                  type="button"
                  className="btn-gold"
                  onClick={addCategory}
                >
                  + add
                </button>
              </div>
            </>
          ) : (
            <div className="skills-row-card">
              {softSkills.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <span className="skill-text-list skill-text-list--soft">
                    {s.name}
                  </span>
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => deleteSkill(s)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                <input
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  placeholder="add a soft skill…"
                  className="browser-url"
                  style={adminInputStyle}
                />
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() =>
                    addSkill({ name: newSoftSkill, section: "soft" }).then(() =>
                      setNewSoftSkill(""),
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {msg && (
        <p
          className="experience-teaser"
          style={{
            color: msg.ok ? "var(--gold)" : "#ff5f57",
            marginTop: "10px",
          }}
        >
          {msg.text}
        </p>
      )}
    </>
  );
}

const ADMIN_TABS = ["profile", "skills", "experience"];
const ADMIN_TAB_URLS = {
  profile: "@kangkang/admin/profile",
  skills: "@kangkang/admin/skills",
  experience: "@kangkang/admin/experience",
};

// ── Admin (login) ─────────────────────────────────────────────────────────────
function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // check if already logged in (session survives refreshes)
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession),
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("profile")
      .select("*")
      .single()
      .then(({ data, error }) => {
        if (!error) setProfileForm(data);
      });
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthError(error.message);
    setLoading(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    const { id, ...fields } = profileForm;
    const { error } = await supabase
      .from("profile")
      .update(fields)
      .eq("id", id);
    if (error) {
      setSaveMsg({ ok: false, text: `save failed: ${error.message}` });
    } else {
      setSaveMsg({
        ok: true,
        text: "saved! ✦ refresh the main page to see it",
      });
    }
    setSaving(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  return (
    <div className="profile-bg">
      <div className="profile-card" style={{ maxWidth: "400px" }}>
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <div className="browser-url">
            {session ? ADMIN_TAB_URLS[activeTab] : "@kangkang/admin"}
          </div>
        </div>
        <div className="profile-card-body" style={{ padding: "24px 28px" }}>
          {session ? (
            <>
              <div className="profile-about-label">
                <span>ADMIN — {activeTab.toUpperCase()}</span>
              </div>
              <p className="experience-teaser">
                logged in as {session.user.email} ✦
              </p>
              {activeTab === "experience" ? (
                <p className="experience-empty">
                  experience isn't editable yet — it still lives in the code.
                  migrating it to the database is the next stage ✦
                </p>
              ) : activeTab === "skills" ? (
                <AdminSkills />
              ) : !profileForm ? (
                <p className="experience-empty">loading profile…</p>
              ) : (
                <form onSubmit={handleSaveProfile}>
                  {[
                    ["name", "name"],
                    ["title", "title"],
                    ["email_1", "email 1"],
                    ["email_2", "email 2"],
                    ["instagram_handle", "instagram handle"],
                    ["instagram_url", "instagram url"],
                  ].map(([field, label]) => (
                    <div key={field} style={{ marginBottom: "10px" }}>
                      <div className="screenshot-gallery-label">{label}</div>
                      <input
                        value={profileForm[field] || ""}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            [field]: e.target.value,
                          }))
                        }
                        className="browser-url"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          textAlign: "left",
                          border: "1px solid var(--frame-border)",
                          color: "var(--text)",
                          fontFamily: "Inter, sans-serif",
                        }}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: "14px" }}>
                    <div className="screenshot-gallery-label">about</div>
                    <textarea
                      value={profileForm.about || ""}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, about: e.target.value }))
                      }
                      rows={6}
                      className="browser-url"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        textAlign: "left",
                        border: "1px solid var(--frame-border)",
                        color: "var(--text)",
                        fontFamily: "Inter, sans-serif",
                        resize: "vertical",
                        lineHeight: 1.6,
                      }}
                    />
                  </div>
                  {saveMsg && (
                    <p
                      className="experience-teaser"
                      style={{
                        color: saveMsg.ok ? "var(--gold)" : "#ff5f57",
                        marginBottom: "10px",
                      }}
                    >
                      {saveMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn-gold"
                    disabled={saving}
                    style={{ width: "100%", marginBottom: "10px" }}
                  >
                    {saving ? "saving…" : "✦ save changes ✦"}
                  </button>
                </form>
              )}
              <button
                className="profile-portfolio-btn"
                onClick={handleLogout}
                style={{ marginTop: "20px" }}
              >
                log out
              </button>
            </>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="profile-about-label">
                <span>ADMIN LOGIN</span>
              </div>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="browser-url"
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "8px 10px",
                  textAlign: "left",
                  border: "1px solid var(--frame-border)",
                  color: "var(--text)",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="browser-url"
                style={{
                  width: "100%",
                  marginBottom: "14px",
                  padding: "8px 10px",
                  textAlign: "left",
                  border: "1px solid var(--frame-border)",
                  color: "var(--text)",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              {authError && (
                <p
                  className="experience-teaser"
                  style={{ color: "#ff5f57", marginBottom: "10px" }}
                >
                  {authError}
                </p>
              )}
              <button
                type="submit"
                className="btn-gold"
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? "logging in…" : "✦ log in ✦"}
              </button>
            </form>
          )}
        </div>
        {session && (
          <nav className="nav-tabs">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "active" : ""}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
function PublicSite() {
  const [view, setView] = useState("profile"); // 'profile' | 'portfolio'

  return view === "portfolio" ? (
    <Portfolio onBack={() => setView("profile")} />
  ) : (
    <ProfileCard onViewPortfolio={() => setView("portfolio")} />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Floating stars + circles — always visible on every page */}
      <FloatingDeco />
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
