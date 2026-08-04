import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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

// same cover ayos as the profile card tabs — shared ng portfolio sections
function SectionCover({ coverUrl, heading, desc }) {
  return (
    <div
      className={"profile-cover" + (desc ? " profile-cover--with-desc" : "")}
      style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
    >
      <div className="profile-cover-overlay">
        <div className="profile-cover-text">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="star-prefix">★—</span> welcome!
            <br />
            {heading}
          </h2>
          {desc && <p className="hero-desc cover-desc">{desc}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Portfolio sections ────────────────────────────────────────────────────────
function HomeSection() {
  const [home, setHome] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadHome() {
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .single();
      if (error) {
        console.error("home content load failed:", error);
        setLoadError(true);
      } else {
        setHome(data);
      }
    }
    loadHome();
  }, []);

  if (loadError)
    return (
      <p className="experience-empty">couldn't load home content (´•̥ ω •̥`)</p>
    );
  if (!home) return <p className="experience-empty">loading…</p>;

  return (
    <div className="section-content">
      <SectionCover
        coverUrl={home.cover_url}
        heading={home.heading_line2}
        desc={home.hero_desc}
      />
      <a href={home.resume_url} download className="hero-resume-btn">
        ↓ Download Resume
      </a>
    </div>
  );
}

function AboutSection() {
  const [content, setContent] = useState(null);
  const [blocks, setBlocks] = useState(null);
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadAbout() {
      const [contentRes, blockRes, itemRes] = await Promise.all([
        supabase.from("about_content").select("*").single(),
        supabase.from("about_blocks").select("*").order("sort_order"),
        supabase.from("about_items").select("*").order("sort_order"),
      ]);
      if (contentRes.error || blockRes.error || itemRes.error) {
        console.error(
          "about load failed:",
          contentRes.error || blockRes.error || itemRes.error,
        );
        setLoadError(true);
        return;
      }
      setContent(contentRes.data);
      setBlocks(blockRes.data);
      setItems(itemRes.data);
    }
    loadAbout();
  }, []);

  if (loadError)
    return (
      <div className="section-content">
        <p className="experience-empty">couldn't load about me (´•̥ ω •̥`)</p>
      </div>
    );
  if (!content || !blocks || !items)
    return (
      <div className="section-content">
        <p className="experience-empty">loading…</p>
      </div>
    );

  const listBlocks = blocks.filter((b) => b.block_type === "list");
  const paragraphBlocks = blocks.filter((b) => b.block_type === "paragraph");

  return (
    <div className="section-content">
      <SectionCover coverUrl={content.cover_url} heading="a little about me" />
      {content.quote && <p className="service-quote">"{content.quote}"</p>}

      <div className="about-details-card">
        {listBlocks.length > 0 && (
          <div className="about-columns">
            {listBlocks.map((block) => (
              <div key={block.id} className="about-block">
                <div className="about-block-title">{block.title}</div>
                <ul className="about-list">
                  {items
                    .filter((i) => i.block_id === block.id)
                    .map((item) => (
                      <li key={item.id}>{item.text}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {listBlocks.length > 0 && paragraphBlocks.length > 0 && (
          <div className="divider-line" />
        )}
        {paragraphBlocks.map((block) => (
          <div key={block.id} className="about-block">
            <div className="about-block-title">{block.title}</div>
            <p className="about-paragraph">{block.paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  const navigate = useNavigate();
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    supabase
      .from("services_content")
      .select("cover_url")
      .single()
      .then(({ data, error }) => {
        if (!error && data?.cover_url) setCoverUrl(data.cover_url);
      });
  }, []);

  const services = [
    {
      key: "digital artist",
      emoji: "🎨",
      sub: "character illustrations · ibis Paint X",
      route: "/digital-artist",
    },
    {
      key: "web developer",
      emoji: "💻",
      sub: "ui/ux design · front-end dev",
      route: "/web-developer",
    },
  ];

  return (
    <div className="section-content">
      <SectionCover coverUrl={coverUrl} heading="here's what I can do" />
      <p className="service-quote">"Pick a door — art or code, I do both!"</p>

      <div className="service-scroll">
        {services.map((s) => (
          <div
            key={s.key}
            className="service-scroll-card"
            onClick={() => navigate(s.route)}
            style={{ cursor: "pointer" }}
          >
            <div className="service-scroll-emoji">{s.emoji}</div>
            <div className="service-project-info">
              <h4>{s.key} →</h4>
              <p>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSection() {
  const [content, setContent] = useState(null);
  const [groups, setGroups] = useState(null);
  const [items, setItems] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadContact() {
      const [contentRes, groupRes, itemRes, homeRes] = await Promise.all([
        supabase.from("contact_content").select("*").single(),
        supabase.from("contact_groups").select("*").order("sort_order"),
        supabase.from("contact_items").select("*").order("sort_order"),
        supabase.from("home_content").select("resume_url").single(),
      ]);
      if (contentRes.error || groupRes.error || itemRes.error) {
        console.error(
          "contact load failed:",
          contentRes.error || groupRes.error || itemRes.error,
        );
        setLoadError(true);
        return;
      }
      setContent(contentRes.data);
      setGroups(groupRes.data);
      setItems(itemRes.data);
      // resume is nice-to-have — if it fails, section still renders
      if (!homeRes.error) setResumeUrl(homeRes.data.resume_url);
    }
    loadContact();
  }, []);

  if (loadError)
    return (
      <div className="section-content">
        <p className="experience-empty">
          couldn't load contact info (´•̥ ω •̥`)
        </p>
      </div>
    );
  if (!content || !groups || !items)
    return (
      <div className="section-content">
        <p className="experience-empty">loading…</p>
      </div>
    );

  // group items into lines: same line_group = one row, joined by " / "
  const linesForGroup = (groupId) => {
    const groupItems = items.filter((i) => i.group_id === groupId);
    const lineMap = new Map();
    for (const item of groupItems) {
      if (!lineMap.has(item.line_group)) lineMap.set(item.line_group, []);
      lineMap.get(item.line_group).push(item);
    }
    return [...lineMap.values()];
  };

  return (
    <div className="section-content">
      <SectionCover coverUrl={content.cover_url} heading="let's talk!" />
      {content.quote && <p className="service-quote">"{content.quote}"</p>}

      {groups.map((group) => (
        <div key={group.id} className="contact-group">
          <div className="contact-group-title">{group.title}</div>
          {linesForGroup(group.id).map((line) => (
            <div key={line[0].id} className="profile-contact-item contact-item">
              <span className="profile-contact-icon contact-icon">
                {line[0].icon}
              </span>
              <span>
                {line.map((item, i) => (
                  <span key={item.id}>
                    <a
                      href={item.url}
                      {...(!item.url.startsWith("mailto:") && {
                        target: "_blank",
                        rel: "noreferrer",
                      })}
                    >
                      {item.label}
                    </a>
                    {i < line.length - 1 && " / "}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      ))}

      {resumeUrl && (
        <a
          href={resumeUrl}
          download
          className="btn-gold"
          style={{ marginTop: "8px" }}
        >
          ↓ Download Resume
        </a>
      )}
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
        return <ServicesSection />;
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
            <img src={profile.avatar_url || "/kangkang.png"} alt="Kangkang" />
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

const EXPERIENCE_EMPTY_MESSAGE = {
  internship: "no internship experience yet",
  work: "no work experience yet",
};

function ExperienceTab({ onReadMore }) {
  const [activeCategory, setActiveCategory] = useState("internship");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [entries, setEntries] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadExperience() {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("sort_order");
      if (error) {
        console.error("experience load failed:", error);
        setLoadError(true);
      } else {
        setEntries(data);
      }
    }
    loadExperience();
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
  };

  if (loadError)
    return (
      <p className="experience-empty">couldn't load experience (´•̥ ω •̥`)</p>
    );
  if (!entries) return <p className="experience-empty">loading…</p>;

  const shown = entries.filter((e) => e.category === activeCategory);
  const entry = shown[currentIndex];

  const goPrev = () =>
    setCurrentIndex((i) => (i === 0 ? shown.length - 1 : i - 1));
  const goNext = () =>
    setCurrentIndex((i) => (i === shown.length - 1 ? 0 : i + 1));

  return (
    <div className="profile-skills-row">
      <div className="service-tabs">
        {["internship", "work"].map((cat) => (
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
        {shown.length === 0 ? (
          <p className="experience-empty experience-empty--plain">
            {EXPERIENCE_EMPTY_MESSAGE[activeCategory]}
          </p>
        ) : (
          <div className="experience-pager">
            {shown.length > 1 && (
              <button className="experience-pager-arrow" onClick={goPrev}>
                ‹
              </button>
            )}
            <div className="experience-card">
              <div className="profile-intern-role">{entry.role}</div>
              <div className="profile-intern-company">{entry.company}</div>
              <div className="profile-intern-period">{entry.period}</div>
              <p className="experience-teaser">— {entry.points?.[0]}</p>
              <button
                className="experience-readmore"
                onClick={() => onReadMore(entry)}
              >
                read more →
              </button>
            </div>
            {shown.length > 1 && (
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
  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="screenshot-gallery">
      <div className="screenshot-gallery-label">★ system screenshots</div>
      <div className="screenshot-grid">
        {screenshots.map((shot) => (
          <button
            key={shot.src}
            className="screenshot-thumb"
            onClick={() =>
              onPreview({
                type: "image",
                items: screenshots,
                index: screenshots.indexOf(shot),
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
  const [covers, setCovers] = useState(null);

  useEffect(() => {
    supabase
      .from("profile")
      .select("cover_url, skills_cover_url, experience_cover_url")
      .single()
      .then(({ data, error }) => {
        if (!error && data) setCovers(data);
      });
  }, []);

  // per-tab cover, may fallback sa main profile cover
  const coverByTab = {
    profile: covers?.cover_url,
    skills: covers?.skills_cover_url || covers?.cover_url,
    experience: covers?.experience_cover_url || covers?.cover_url,
  };
  const coverUrl = coverByTab[activeTab];
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
              expandedEntry.screenshots?.length > 0
                ? "experience-modal--wide"
                : ""
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
                expandedEntry.screenshots?.length > 0
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
                {!(expandedEntry.screenshots?.length > 0) &&
                  expandedEntry.demoLink && (
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
              {expandedEntry.screenshots?.length > 0 && (
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
            <div
              className="profile-cover"
              style={{
                backgroundImage: `url(${coverUrl || "/frame1.png"})`,
              }}
            >
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

// ── reusable per-tab cover uploader — reads/writes one field sa profile row ──
function AdminTabCover({ field = "cover_url", kind, table = "profile", hint }) {
  const [row, setRow] = useState(null);
  const [msg, setMsg] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    supabase
      .from(table)
      .select(`id, ${field}`)
      .single()
      .then(({ data, error }) => {
        if (!error) setRow(data);
      });
  }, [field, table]);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // para pwede ulit i-select yung same file
    if (!file || !row) return;
    setMsg(null);
    const oldUrl = row[field];
    try {
      const path = `${kind}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("profile-images")
        .upload(path, file);
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage
        .from("profile-images")
        .getPublicUrl(path);
      const url = pub.publicUrl;
      const { error } = await supabase
        .from(table)
        .update({ [field]: url })
        .eq("id", row.id);
      if (error) throw error;
      setRow((r) => ({ ...r, [field]: url }));
      // cleanup: burahin yung old file para hindi mag-ipon ng basura
      if (oldUrl && oldUrl.includes("/profile-images/")) {
        const oldPath = oldUrl.split("/profile-images/")[1];
        await supabase.storage.from("profile-images").remove([oldPath]);
      }
      setMsg({
        ok: true,
        text: "cover updated ✦ refresh the public page to see it",
      });
    } catch (err) {
      setMsg({ ok: false, text: `upload failed: ${err.message}` });
    }
  };

  return (
    <div className="admin-tab-cover" style={{ marginBottom: "16px" }}>
      <div
        className="profile-cover admin-cover-preview"
        style={{
          backgroundImage: `url(${row?.[field] || "/frame1.png"})`,
        }}
        onClick={() => inputRef.current?.click()}
      />
      <p className="admin-upload-hint">
        click the cover to change it ✦{" "}
        {hint || "recommended 1400 × 350px (wide landscape)"}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      {msg && (
        <p
          className="experience-teaser"
          style={{ color: msg.ok ? "var(--gold)" : "#e05d5d" }}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}

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
      section === "soft" ? s.section === "soft" : s.category_id === category_id,
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
    const { error } = await supabase.from("skills").delete().eq("id", skill.id);
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
      <AdminTabCover field="skills_cover_url" kind="skills-cover" />
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

// ── Admin: about manager ──────────────────────────────────────────────────────
function AdminAbout() {
  const [content, setContent] = useState(null); // { id, quote }
  const [blocks, setBlocks] = useState(null);
  const [items, setItems] = useState(null);
  const [openBlock, setOpenBlock] = useState(null);
  const [newBlockTitle, setNewBlockTitle] = useState("");
  const [newBlockType, setNewBlockType] = useState("list");
  const [newItemText, setNewItemText] = useState("");
  const [msg, setMsg] = useState(null);
  const [savingQuote, setSavingQuote] = useState(false);

  useEffect(() => {
    async function loadAll() {
      const [contentRes, blockRes, itemRes] = await Promise.all([
        supabase.from("about_content").select("*").single(),
        supabase.from("about_blocks").select("*").order("sort_order"),
        supabase.from("about_items").select("*").order("sort_order"),
      ]);
      if (!contentRes.error && !blockRes.error && !itemRes.error) {
        setContent(contentRes.data);
        setBlocks(blockRes.data);
        setItems(itemRes.data);
      }
    }
    loadAll();
  }, []);

  const showError = (error) =>
    setMsg({ ok: false, text: `failed: ${error.message}` });

  const toggleBlock = (id) => {
    setOpenBlock((prev) => (prev === id ? null : id));
    setNewItemText("");
  };

  const saveQuote = async () => {
    setSavingQuote(true);
    const { error } = await supabase
      .from("about_content")
      .update({ quote: content.quote })
      .eq("id", content.id);
    if (error) showError(error);
    else setMsg({ ok: true, text: "quote saved ✦" });
    setSavingQuote(false);
  };

  const addBlock = async () => {
    const title = newBlockTitle.trim();
    if (!title) return;
    const nextOrder =
      blocks.length > 0 ? Math.max(...blocks.map((b) => b.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("about_blocks")
      .insert({ title, block_type: newBlockType, sort_order: nextOrder })
      .select()
      .single();
    if (error) return showError(error);
    setBlocks((prev) => [...prev, data]);
    setNewBlockTitle("");
    setMsg({ ok: true, text: `added block "${title}" ✦` });
  };

  const deleteBlock = async (block) => {
    const blockItems = items.filter((i) => i.block_id === block.id);
    if (blockItems.length > 0) {
      const confirmed = window.confirm(
        `"${block.title}" has ${blockItems.length} item(s):\n` +
          blockItems.map((i) => `• ${i.text}`).join("\n") +
          `\n\ndelete the block AND all its items?`,
      );
      if (!confirmed) return;
      // children first — restrict blocks the delete otherwise
      const { error: itemErr } = await supabase
        .from("about_items")
        .delete()
        .eq("block_id", block.id);
      if (itemErr) return showError(itemErr);
    } else {
      const confirmed = window.confirm(`delete block "${block.title}"?`);
      if (!confirmed) return;
    }
    const { error } = await supabase
      .from("about_blocks")
      .delete()
      .eq("id", block.id);
    if (error) return showError(error);
    setItems((prev) => prev.filter((i) => i.block_id !== block.id));
    setBlocks((prev) => prev.filter((b) => b.id !== block.id));
    setMsg({ ok: true, text: `deleted block "${block.title}"` });
  };

  const addItem = async (block) => {
    const text = newItemText.trim();
    if (!text) return;
    const siblings = items.filter((i) => i.block_id === block.id);
    const nextOrder =
      siblings.length > 0
        ? Math.max(...siblings.map((i) => i.sort_order)) + 1
        : 0;
    const { data, error } = await supabase
      .from("about_items")
      .insert({ block_id: block.id, text, sort_order: nextOrder })
      .select()
      .single();
    if (error) return showError(error);
    setItems((prev) => [...prev, data]);
    setNewItemText("");
    setMsg({ ok: true, text: `added item ✦` });
  };

  const deleteItem = async (item) => {
    const { error } = await supabase
      .from("about_items")
      .delete()
      .eq("id", item.id);
    if (error) return showError(error);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setMsg({ ok: true, text: "item deleted" });
  };

  const saveParagraph = async (block) => {
    const { error } = await supabase
      .from("about_blocks")
      .update({ paragraph: block.paragraph })
      .eq("id", block.id);
    if (error) return showError(error);
    setMsg({ ok: true, text: `paragraph saved ✦` });
  };

  if (!content || !blocks || !items)
    return <p className="experience-empty">loading about content…</p>;

  return (
    <>
      <AdminTabCover table="about_content" kind="about-cover" />
      <div className="profile-about-label" style={{ marginTop: "20px" }}>
        <span>ABOUT ME</span>
      </div>

      {/* quote */}
      <div style={{ marginBottom: "14px" }}>
        <div className="screenshot-gallery-label">quote</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            value={content.quote || ""}
            onChange={(e) =>
              setContent((p) => ({ ...p, quote: e.target.value }))
            }
            className="browser-url"
            style={adminInputStyle}
          />
          <button
            type="button"
            className="btn-gold"
            disabled={savingQuote}
            onClick={saveQuote}
          >
            {savingQuote ? "…" : "save"}
          </button>
        </div>
      </div>

      {/* blocks */}
      <div className="skills-panel">
        {blocks.map((block) => {
          const isOpen = openBlock === block.id;
          const blockItems = items.filter((i) => i.block_id === block.id);
          return (
            <div
              key={block.id}
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
                  onClick={() => toggleBlock(block.id)}
                >
                  <span
                    className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}
                  >
                    ▸
                  </span>
                  {block.title}
                  <span
                    className="skill-text-list skill-text-list--muted"
                    style={{ fontSize: "9px", marginLeft: "4px" }}
                  >
                    ({block.block_type})
                  </span>
                </button>
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => deleteBlock(block)}
                >
                  ✕
                </button>
              </div>

              {isOpen && (
                <div className="nested-skills">
                  {block.block_type === "paragraph" ? (
                    <>
                      <textarea
                        value={block.paragraph || ""}
                        onChange={(e) =>
                          setBlocks((prev) =>
                            prev.map((b) =>
                              b.id === block.id
                                ? { ...b, paragraph: e.target.value }
                                : b,
                            ),
                          )
                        }
                        rows={4}
                        className="browser-url"
                        style={{
                          ...adminInputStyle,
                          resize: "vertical",
                          lineHeight: 1.6,
                        }}
                      />
                      <button
                        type="button"
                        className="btn-gold"
                        style={{ marginTop: "8px" }}
                        onClick={() => saveParagraph(block)}
                      >
                        save paragraph
                      </button>
                    </>
                  ) : (
                    <>
                      {blockItems.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                          }}
                        >
                          <span className="skill-text-list skill-text-list--muted">
                            {item.text}
                          </span>
                          <button
                            type="button"
                            className="back-btn"
                            onClick={() => deleteItem(item)}
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
                          value={newItemText}
                          onChange={(e) => setNewItemText(e.target.value)}
                          placeholder="add an item…"
                          className="browser-url"
                          style={adminInputStyle}
                        />
                        <button
                          type="button"
                          className="btn-gold"
                          onClick={() => addItem(block)}
                        >
                          +
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* add new block */}
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <input
            value={newBlockTitle}
            onChange={(e) => setNewBlockTitle(e.target.value)}
            placeholder="new block title…"
            className="browser-url"
            style={adminInputStyle}
          />
          <select
            value={newBlockType}
            onChange={(e) => setNewBlockType(e.target.value)}
            className="browser-url"
            style={{ ...adminInputStyle, width: "auto" }}
          >
            <option value="list">list</option>
            <option value="paragraph">paragraph</option>
          </select>
          <button type="button" className="btn-gold" onClick={addBlock}>
            + add
          </button>
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

// ── Admin: web projects manager ───────────────────────────────────────────────
function AdminWebProjects() {
  const [projects, setProjects] = useState(null);
  const [title, setTitle] = useState("");
  const [sub, setSub] = useState("");
  const [description, setDescription] = useState("");
  const [toolsText, setToolsText] = useState("");
  const [link, setLink] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [shotFiles, setShotFiles] = useState([]);
const [saving, setSaving] = useState(false);
const [editingId, setEditingId] = useState(null);
const [formVersion, setFormVersion] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    supabase
      .from("web_projects")
      .select("*")
      .order("sort_order")
      .then(({ data, error }) => {
        if (!error) setProjects(data);
      });
  }, []);

  const showError = (error) =>
    setMsg({ ok: false, text: `failed: ${error.message}` });

  const uploadFile = async (file, folder) => {
    const path = `${folder}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("web-projects")
      .upload(path, file);
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("web-projects").getPublicUrl(path);
    return { src: data.publicUrl, label: file.name, path };
  };

  const resetForm = () => {
    setTitle("");
    setSub("");
    setDescription("");
    setToolsText("");
    setLink("");
    setCoverFile(null);
    setShotFiles([]);
    setFormVersion((v) => v + 1);
  };

  const startEdit = (proj) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setSub(proj.sub || "");
    setDescription(proj.description || "");
    setToolsText((proj.tools || []).join(", "));
    setLink(proj.link || "");
    setCoverFile(null);
    setShotFiles([]);
    setFormVersion((v) => v + 1);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const saveProject = async () => {
    if (!title.trim()) {
      setMsg({ ok: false, text: "title is required!" });
      return;
    }
    setSaving(true);
    try {
      const tools = toolsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (editingId) {
        // ── UPDATE existing project ──
        const current = projects.find((p) => p.id === editingId);
        let coverUpdate = {};
        if (coverFile) {
          const cover = await uploadFile(coverFile, "covers");
          coverUpdate = { cover_src: cover.src, cover_path: cover.path };
        }
        const newShots = [];
        for (const file of shotFiles) {
          newShots.push(await uploadFile(file, "screenshots"));
        }
        const updates = {
          title: title.trim(),
          sub: sub.trim(),
          description: description.trim(),
          tools,
          link: link.trim() || null,
          ...coverUpdate,
          ...(newShots.length > 0
            ? { screenshots: [...(current.screenshots || []), ...newShots] }
            : {}),
        };
        const { data, error } = await supabase
          .from("web_projects")
          .update(updates)
          .eq("id", editingId)
          .select()
          .single();
        if (error) throw error;
        // old cover cleanup — only AFTER the update succeeded
        if (coverFile && current.cover_path) {
          await supabase.storage
            .from("web-projects")
            .remove([current.cover_path]);
        }
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? data : p)),
        );
        setEditingId(null);
        resetForm();
        setMsg({ ok: true, text: `updated "${data.title}" ✦` });
      } else {
        // ── INSERT new project ──
        let cover = { src: null, path: null };
        if (coverFile) cover = await uploadFile(coverFile, "covers");
        const shots = [];
        for (const file of shotFiles) {
          shots.push(await uploadFile(file, "screenshots"));
        }
        const nextOrder =
          projects.length > 0
            ? Math.max(...projects.map((p) => p.sort_order)) + 1
            : 0;
        const { data, error } = await supabase
          .from("web_projects")
          .insert({
            title: title.trim(),
            sub: sub.trim(),
            description: description.trim(),
            tools,
            link: link.trim() || null,
            cover_src: cover.src,
            cover_path: cover.path,
            screenshots: shots,
            sort_order: nextOrder,
          })
          .select()
          .single();
        if (error) throw error;
        setProjects((prev) => [...prev, data]);
        resetForm();
        setMsg({ ok: true, text: `added "${data.title}" ✦` });
      }
    } catch (error) {
      showError(error);
    }
setSaving(false);
  };

  const deleteProject = async (proj) => {
    const confirmed = window.confirm(
      `delete "${proj.title}" and all its images?`,
    );
    if (!confirmed) return;
    const { error } = await supabase
      .from("web_projects")
      .delete()
      .eq("id", proj.id);
    if (error) return showError(error);
    const paths = [
      ...(proj.cover_path ? [proj.cover_path] : []),
      ...(proj.screenshots || []).map((s) => s.path),
    ];
    if (paths.length > 0)
      await supabase.storage.from("web-projects").remove(paths);
    setProjects((prev) => prev.filter((p) => p.id !== proj.id));
    setMsg({ ok: true, text: `deleted "${proj.title}"` });
  };

  const addShotsToProject = async (proj, files) => {
    setUploadingId(proj.id);
    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadFile(file, "screenshots"));
      }
      const nextShots = [...(proj.screenshots || []), ...uploaded];
      const { error } = await supabase
        .from("web_projects")
        .update({ screenshots: nextShots })
        .eq("id", proj.id);
      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === proj.id ? { ...p, screenshots: nextShots } : p,
        ),
      );
      setMsg({ ok: true, text: `added ${uploaded.length} screenshot(s) ✦` });
    } catch (error) {
      showError(error);
    }
    setUploadingId(null);
  };

  const removeShot = async (proj, shot) => {
    const nextShots = (proj.screenshots || []).filter(
      (s) => s.path !== shot.path,
    );
    const { error } = await supabase
      .from("web_projects")
      .update({ screenshots: nextShots })
      .eq("id", proj.id);
    if (error) return showError(error);
    await supabase.storage.from("web-projects").remove([shot.path]);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === proj.id ? { ...p, screenshots: nextShots } : p,
      ),
    );
    setMsg({ ok: true, text: "screenshot removed" });
  };

  if (!projects) return <p className="experience-empty">loading projects…</p>;

  return (
    <>
      <div className="profile-about-label" style={{ marginTop: "20px" }}>
        <span>WEB DEVELOPER — PROJECTS</span>
      </div>

      <div className="skills-panel">
        <div className="admin-exp-grid">
          <div className="admin-col-form">
            <div
              className="screenshot-gallery-label"
              style={{ marginBottom: "10px" }}
            >
              ✦ add new project
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div className="screenshot-gallery-label">project title</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. kangkang-portfolio"
                className="browser-url"
                style={adminInputStyle}
              />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div className="screenshot-gallery-label">subtitle</div>
              <input
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                placeholder="e.g. personal portfolio · react.js · vercel"
                className="browser-url"
                style={adminInputStyle}
              />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div className="screenshot-gallery-label">description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="browser-url"
                style={{
                  ...adminInputStyle,
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div className="screenshot-gallery-label">
                tools used (comma-separated)
              </div>
              <input
                value={toolsText}
                onChange={(e) => setToolsText(e.target.value)}
                placeholder="e.g. React, CSS, Vercel, GitHub"
                className="browser-url"
                style={adminInputStyle}
              />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div className="screenshot-gallery-label">
                live link (optional)
              </div>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://…"
                className="browser-url"
                style={adminInputStyle}
              />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div className="screenshot-gallery-label">cover photo</div>
              <input
                key={`cover-${formVersion}`}
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0] || null)}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <div className="screenshot-gallery-label">screenshots</div>
              <input
                key={`shots-${formVersion}`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setShotFiles(Array.from(e.target.files))}
              />
              {shotFiles.length > 0 && (
                <p className="experience-teaser">
                  {shotFiles.length} screenshot(s) ready to upload on save
                </p>
              )}
            </div>

            {editingId && (
              <p className="experience-teaser" style={{ color: "var(--gold)" }}>
                ✎ editing "{projects.find((p) => p.id === editingId)?.title}"
              </p>
            )}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                className="btn-gold"
                style={{ flex: 1 }}
                onClick={saveProject}
                disabled={saving}
              >
                {saving
                  ? "saving…"
                  : editingId
                    ? "✦ save changes ✦"
                    : "✦ add project ✦"}
              </button>
              {editingId && (
                <button type="button" className="back-btn" onClick={cancelEdit}>
                  cancel
                </button>
              )}
            </div>
          </div>

          <div className="admin-col-saved">
            <div
              className="screenshot-gallery-label"
              style={{ marginBottom: "10px" }}
            >
              ✦ saved projects
            </div>
            {projects.length === 0 && (
              <p className="experience-empty">no projects yet ✦</p>
            )}
            {projects.length > 0 && (
              <div>
                {projects.map((proj) => {
                  const isOpen = expandedId === proj.id;
                  return (
                    <div
                      key={proj.id}
                      className={`skills-row-card ${isOpen ? "skills-row-card--open" : ""}`}
                      style={{ marginBottom: "6px" }}
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
                          onClick={() => setExpandedId(isOpen ? null : proj.id)}
                        >
                          <span
                            className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}
                          >
                            ▸
                          </span>
                          <span
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <span className="profile-intern-role">
                              {proj.title}
                            </span>
                            <span className="profile-intern-company">
                              {proj.sub}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="back-btn"
                          onClick={() => startEdit(proj)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="back-btn"
                          onClick={() => deleteProject(proj)}
                        >
                          ✕
                        </button>
                      </div>

                      {isOpen && (
                        <div className="nested-skills">
                          {proj.tools && proj.tools.length > 0 && (
                            <p className="skill-text-list skill-text-list--muted">
                              {proj.tools.join(" • ")}
                            </p>
                          )}

                          <div
                            className="screenshot-gallery-label"
                            style={{ marginTop: "10px" }}
                          >
                            cover
                          </div>
                          {proj.cover_src ? (
                            <div
                              className="screenshot-thumb"
                              style={{ width: "120px" }}
                            >
                              <img src={proj.cover_src} alt="cover" />
                            </div>
                          ) : (
                            <p className="experience-teaser">no cover yet</p>
                          )}

                          <div
                            className="screenshot-gallery-label"
                            style={{ marginTop: "12px" }}
                          >
                            screenshots
                          </div>
                          {proj.screenshots && proj.screenshots.length > 0 && (
                            <div className="screenshot-grid">
                              {proj.screenshots.map((shot) => (
                                <div
                                  key={shot.path}
                                  style={{ position: "relative" }}
                                >
                                  <div className="screenshot-thumb">
                                    <img src={shot.src} alt={shot.label} />
                                  </div>
                                  <button
                                    type="button"
                                    className="back-btn"
                                    style={{
                                      position: "absolute",
                                      top: "2px",
                                      right: "2px",
                                      background: "rgba(0,0,0,0.6)",
                                    }}
                                    onClick={() => removeShot(proj, shot)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={uploadingId === proj.id}
                            onChange={(ev) => {
                              const files = Array.from(ev.target.files);
                              if (files.length > 0)
                                addShotsToProject(proj, files);
                              ev.target.value = "";
                            }}
                            style={{ marginTop: "8px" }}
                          />
                          {uploadingId === proj.id && (
                            <p className="experience-teaser">uploading…</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

// ── Admin: contact manager ────────────────────────────────────────────────────
function AdminContact() {
  const [content, setContent] = useState(null); // { id, quote }
  const [groups, setGroups] = useState(null);
  const [items, setItems] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newItem, setNewItem] = useState({
    icon: "",
    label: "",
    url: "",
    line_group: "0",
  });
  const [msg, setMsg] = useState(null);
  const [savingQuote, setSavingQuote] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemForm, setEditItemForm] = useState(null);

  useEffect(() => {
    async function loadAll() {
      const [contentRes, groupRes, itemRes] = await Promise.all([
        supabase.from("contact_content").select("*").single(),
        supabase.from("contact_groups").select("*").order("sort_order"),
        supabase.from("contact_items").select("*").order("sort_order"),
      ]);
      if (!contentRes.error && !groupRes.error && !itemRes.error) {
        setContent(contentRes.data);
        setGroups(groupRes.data);
        setItems(itemRes.data);
      }
    }
    loadAll();
  }, []);

  const showError = (error) =>
    setMsg({ ok: false, text: `failed: ${error.message}` });

  const toggleGroup = (id) => {
    setOpenGroup((prev) => (prev === id ? null : id));
    setNewItem({ icon: "", label: "", url: "", line_group: "0" });
    setEditingItemId(null);
    setEditItemForm(null);
  };

  const saveQuote = async () => {
    setSavingQuote(true);
    const { error } = await supabase
      .from("contact_content")
      .update({ quote: content.quote })
      .eq("id", content.id);
    if (error) showError(error);
    else setMsg({ ok: true, text: "quote saved ✦" });
    setSavingQuote(false);
  };

  const addGroup = async () => {
    const title = newGroupTitle.trim();
    if (!title) return;
    const nextOrder =
      groups.length > 0 ? Math.max(...groups.map((g) => g.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("contact_groups")
      .insert({ title, sort_order: nextOrder })
      .select()
      .single();
    if (error) return showError(error);
    setGroups((prev) => [...prev, data]);
    setNewGroupTitle("");
    setMsg({ ok: true, text: `added group "${title}" ✦` });
  };

  const deleteGroup = async (group) => {
    const groupItems = items.filter((i) => i.group_id === group.id);
    if (groupItems.length > 0) {
      const confirmed = window.confirm(
        `"${group.title}" has ${groupItems.length} item(s):\n` +
          groupItems.map((i) => `• ${i.label}`).join("\n") +
          `\n\ndelete the group AND all its items?`,
      );
      if (!confirmed) return;
      // children first — restrict blocks the delete otherwise
      const { error: itemErr } = await supabase
        .from("contact_items")
        .delete()
        .eq("group_id", group.id);
      if (itemErr) return showError(itemErr);
    } else {
      const confirmed = window.confirm(`delete group "${group.title}"?`);
      if (!confirmed) return;
    }
    const { error } = await supabase
      .from("contact_groups")
      .delete()
      .eq("id", group.id);
    if (error) return showError(error);
    setItems((prev) => prev.filter((i) => i.group_id !== group.id));
    setGroups((prev) => prev.filter((g) => g.id !== group.id));
    setMsg({ ok: true, text: `deleted group "${group.title}"` });
  };

  const addItem = async (group) => {
    const label = newItem.label.trim();
    const url = newItem.url.trim();
    if (!label || !url) {
      setMsg({ ok: false, text: "label and url are required!" });
      return;
    }
    const siblings = items.filter((i) => i.group_id === group.id);
    const nextOrder =
      siblings.length > 0
        ? Math.max(...siblings.map((i) => i.sort_order)) + 1
        : 0;
    const { data, error } = await supabase
      .from("contact_items")
      .insert({
        group_id: group.id,
        icon: newItem.icon.trim(),
        label,
        url,
        line_group: parseInt(newItem.line_group, 10) || 0,
        sort_order: nextOrder,
      })
      .select()
      .single();
    if (error) return showError(error);
    setItems((prev) => [...prev, data]);
    setNewItem({ icon: "", label: "", url: "", line_group: "0" });
    setMsg({ ok: true, text: `added "${label}" ✦` });
  };

  const deleteItem = async (item) => {
    const { error } = await supabase
      .from("contact_items")
      .delete()
      .eq("id", item.id);
    if (error) return showError(error);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setMsg({ ok: true, text: `deleted "${item.label}"` });
  };

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setEditItemForm({
      icon: item.icon || "",
      label: item.label,
      url: item.url,
      line_group: String(item.line_group),
    });
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditItemForm(null);
  };

  const saveEditItem = async (item) => {
    const label = editItemForm.label.trim();
    const url = editItemForm.url.trim();
    if (!label || !url) {
      setMsg({ ok: false, text: "label and url are required!" });
      return;
    }
    const updates = {
      icon: editItemForm.icon.trim(),
      label,
      url,
      line_group: parseInt(editItemForm.line_group, 10) || 0,
    };
    const { error } = await supabase
      .from("contact_items")
      .update(updates)
      .eq("id", item.id);
    if (error) return showError(error);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, ...updates } : i)),
    );
    cancelEditItem();
    setMsg({ ok: true, text: `updated "${label}" ✦` });
  };

  if (!content || !groups || !items)
    return <p className="experience-empty">loading contact content…</p>;

  return (
    <>
      <AdminTabCover table="contact_content" kind="contact-cover" />
      <div className="profile-about-label" style={{ marginTop: "20px" }}>
        <span>GET IN TOUCH</span>
      </div>

      {/* quote */}
      <div style={{ marginBottom: "14px" }}>
        <div className="screenshot-gallery-label">quote</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            value={content.quote || ""}
            onChange={(e) =>
              setContent((p) => ({ ...p, quote: e.target.value }))
            }
            className="browser-url"
            style={adminInputStyle}
          />
          <button
            type="button"
            className="btn-gold"
            disabled={savingQuote}
            onClick={saveQuote}
          >
            {savingQuote ? "…" : "save"}
          </button>
        </div>
      </div>

      {/* groups */}
      <div className="skills-panel">
        {groups.map((group) => {
          const isOpen = openGroup === group.id;
          const groupItems = items.filter((i) => i.group_id === group.id);
          return (
            <div
              key={group.id}
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
                  onClick={() => toggleGroup(group.id)}
                >
                  <span
                    className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}
                  >
                    ▸
                  </span>
                  {group.title}
                </button>
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => deleteGroup(group)}
                >
                  ✕
                </button>
              </div>

              {isOpen && (
                <div className="nested-skills">
                  {groupItems.map((item) =>
                    editingItemId === item.id ? (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          margin: "6px 0",
                          paddingBottom: "8px",
                          borderBottom: "1px dashed var(--frame-border)",
                        }}
                      >
                        <div style={{ display: "flex", gap: "6px" }}>
                          <input
                            value={editItemForm.icon}
                            onChange={(e) =>
                              setEditItemForm((p) => ({
                                ...p,
                                icon: e.target.value,
                              }))
                            }
                            placeholder="icon"
                            className="browser-url"
                            style={{ ...adminInputStyle, width: "60px" }}
                          />
                          <input
                            value={editItemForm.label}
                            onChange={(e) =>
                              setEditItemForm((p) => ({
                                ...p,
                                label: e.target.value,
                              }))
                            }
                            placeholder="label (visible text)…"
                            className="browser-url"
                            style={adminInputStyle}
                          />
                        </div>
                        <input
                          value={editItemForm.url}
                          onChange={(e) =>
                            setEditItemForm((p) => ({
                              ...p,
                              url: e.target.value,
                            }))
                          }
                          placeholder="url (mailto: or https://)…"
                          className="browser-url"
                          style={adminInputStyle}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            alignItems: "center",
                          }}
                        >
                          <span className="screenshot-gallery-label">
                            line #
                          </span>
                          <input
                            value={editItemForm.line_group}
                            onChange={(e) =>
                              setEditItemForm((p) => ({
                                ...p,
                                line_group: e.target.value,
                              }))
                            }
                            className="browser-url"
                            style={{ ...adminInputStyle, width: "60px" }}
                          />
                          <button
                            type="button"
                            className="back-btn"
                            style={{ marginLeft: "auto" }}
                            onClick={cancelEditItem}
                          >
                            cancel
                          </button>
                          <button
                            type="button"
                            className="btn-gold"
                            onClick={() => saveEditItem(item)}
                          >
                            ✦ save ✦
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                        }}
                      >
                        <span className="skill-text-list skill-text-list--muted">
                          <span style={{ color: "var(--gold)" }}>
                            {item.icon}
                          </span>{" "}
                          {item.label}
                          <span style={{ fontSize: "9px", marginLeft: "6px" }}>
                            (line {item.line_group})
                          </span>
                        </span>
                        <span style={{ display: "flex", gap: "4px" }}>
                          <button
                            type="button"
                            className="back-btn"
                            onClick={() => startEditItem(item)}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="back-btn"
                            onClick={() => deleteItem(item)}
                          >
                            ✕
                          </button>
                        </span>
                      </div>
                    ),
                  )}

                  {/* add item — mini stack */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      marginTop: "10px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input
                        value={newItem.icon}
                        onChange={(e) =>
                          setNewItem((p) => ({ ...p, icon: e.target.value }))
                        }
                        placeholder="icon"
                        className="browser-url"
                        style={{ ...adminInputStyle, width: "60px" }}
                      />
                      <input
                        value={newItem.label}
                        onChange={(e) =>
                          setNewItem((p) => ({ ...p, label: e.target.value }))
                        }
                        placeholder="label (visible text)…"
                        className="browser-url"
                        style={adminInputStyle}
                      />
                    </div>
                    <input
                      value={newItem.url}
                      onChange={(e) =>
                        setNewItem((p) => ({ ...p, url: e.target.value }))
                      }
                      placeholder="url (mailto: or https://)…"
                      className="browser-url"
                      style={adminInputStyle}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <span className="screenshot-gallery-label">line #</span>
                      <input
                        value={newItem.line_group}
                        onChange={(e) =>
                          setNewItem((p) => ({
                            ...p,
                            line_group: e.target.value,
                          }))
                        }
                        className="browser-url"
                        style={{ ...adminInputStyle, width: "60px" }}
                      />
                      <button
                        type="button"
                        className="btn-gold"
                        style={{ marginLeft: "auto" }}
                        onClick={() => addItem(group)}
                      >
                        + add item
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* add new group */}
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <input
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
            placeholder="new group title…"
            className="browser-url"
            style={adminInputStyle}
          />
          <button type="button" className="btn-gold" onClick={addGroup}>
            + add
          </button>
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

function AdminHome() {
  const [homeForm, setHomeForm] = useState(null);
const [saving, setSaving] = useState(false);
const [saveMsg, setSaveMsg] = useState(null);
const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    supabase
      .from("home_content")
      .select("*")
      .single()
      .then(({ data, error }) => {
        if (!error) setHomeForm(data);
      });
  }, []);

  const uploadResume = async (file) => {
    setUploadingResume(true);
    setSaveMsg(null);
    try {
      const path = `${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("resumes")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("resumes").getPublicUrl(path);
      setHomeForm((p) => ({ ...p, resume_url: data.publicUrl }));
      setSaveMsg({
        ok: true,
        text: "resume uploaded ✦ don't forget to hit save changes below",
      });
    } catch (error) {
      setSaveMsg({ ok: false, text: `upload failed: ${error.message}` });
    }
    setUploadingResume(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    const { id, ...fields } = homeForm;
    const { error } = await supabase
      .from("home_content")
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

  if (!homeForm)
    return <p className="experience-empty">loading home content…</p>;

  return (
    <>
      <AdminTabCover table="home_content" kind="home-cover" />
      <div className="profile-about-label" style={{ marginTop: "20px" }}>
        <span>HOME</span>
      </div>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: "10px" }}>
          <div className="screenshot-gallery-label">heading (2nd line)</div>
          <input
            value={homeForm.heading_line2 || ""}
            onChange={(e) =>
              setHomeForm((p) => ({ ...p, heading_line2: e.target.value }))
            }
            className="browser-url"
            style={adminInputStyle}
          />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <div className="screenshot-gallery-label">hero description</div>
          <textarea
            value={homeForm.hero_desc || ""}
            onChange={(e) =>
              setHomeForm((p) => ({ ...p, hero_desc: e.target.value }))
            }
            rows={5}
            className="browser-url"
            style={{ ...adminInputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <div className="screenshot-gallery-label">resume file path</div>
          <input
            value={homeForm.resume_url || ""}
            onChange={(e) =>
              setHomeForm((p) => ({ ...p, resume_url: e.target.value }))
            }
            className="browser-url"
            style={adminInputStyle}
          />
          <div style={{ marginTop: "8px" }}>
            <div className="screenshot-gallery-label">
              or upload a new resume PDF
            </div>
            <input
              type="file"
              accept="application/pdf"
              disabled={uploadingResume}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) uploadResume(file);
              }}
            />
            {uploadingResume && <p className="experience-teaser">uploading…</p>}
          </div>
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
          style={{ width: "100%" }}
          disabled={saving}
        >
          {saving ? "saving…" : "✦ save home content ✦"}
        </button>
      </form>
    </>
  );
}


// ── Bullet list with Enter-to-add / Backspace-to-remove ───────────────────────
function BulletInputs({ bullets, setBullets }) {
  const refs = useRef([]);
  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const focusBullet = (i) => {
    // wait for React to render the new input, then focus it
    requestAnimationFrame(() => refs.current[i]?.focus());
  };

  const updateBullet = (i, value) => {
    setBullets((prev) => prev.map((b, idx) => (idx === i ? value : b)));
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setBullets((prev) => {
        const next = [...prev];
        next.splice(i + 1, 0, ""); // insert empty bullet after current
        return next;
      });
      focusBullet(i + 1);
    } else if (
      e.key === "Backspace" &&
      bullets[i] === "" &&
      bullets.length > 1
    ) {
      e.preventDefault();
      setBullets((prev) => prev.filter((_, idx) => idx !== i));
      focusBullet(Math.max(0, i - 1));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {bullets.map((b, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}
        >
          <span style={{ color: "var(--gold)", fontSize: "8px" }}>✦</span>
          <textarea
            ref={(el) => {
              refs.current[i] = el;
              autoGrow(el);
            }}
            value={b}
            rows={1}
            onChange={(e) => {
              updateBullet(i, e.target.value);
              autoGrow(e.target);
            }}
            onKeyDown={(e) => handleKeyDown(e, i)}
            placeholder="type a bullet, press Enter for the next…"
            className="browser-url"
            style={{
              ...adminInputStyle,
              resize: "none",
              overflow: "hidden",
              lineHeight: 1.6,
            }}
          />
          {bullets.length > 1 && (
            <button
              type="button"
              className="back-btn"
              onClick={() =>
                setBullets((prev) => prev.filter((_, idx) => idx !== i))
              }
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Admin: experience manager ─────────────────────────────────────────────────
function AdminExperience() {
  const [entries, setEntries] = useState(null);
  const [category, setCategory] = useState("internship");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [bullets, setBullets] = useState([""]);
  const [newPhotos, setNewPhotos] = useState([]); // files staged for the new entry
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("sort_order");
      if (!error) setEntries(data);
    }
    load();
  }, []);

  const showError = (error) =>
    setMsg({ ok: false, text: `failed: ${error.message}` });

  const resetForm = () => {
    setRole("");
    setCompany("");
    setPeriod("");
    setBullets([""]);
    setNewPhotos([]);
  };

  // uploads one file to the experience-photos bucket, returns {src, label, path}
  const uploadPhoto = async (file, cat) => {
    const path = `${cat}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("experience-photos")
      .upload(path, file);
    if (upErr) throw upErr;
    const { data } = supabase.storage
      .from("experience-photos")
      .getPublicUrl(path);
    return { src: data.publicUrl, label: file.name, path };
  };

  const addEntry = async () => {
    const cleanBullets = bullets.map((b) => b.trim()).filter(Boolean);
    if (!role.trim() || !company.trim()) {
      setMsg({ ok: false, text: "position and company are required!" });
      return;
    }
    setSaving(true);
    try {
      const uploaded = [];
      for (const file of newPhotos) {
        uploaded.push(await uploadPhoto(file, category));
      }
      const siblings = entries.filter((e) => e.category === category);
      const nextOrder =
        siblings.length > 0
          ? Math.max(...siblings.map((e) => e.sort_order)) + 1
          : 0;
      const { data, error } = await supabase
        .from("experience")
        .insert({
          category,
          role: role.trim(),
          company: company.trim(),
          period: period.trim(),
          points: cleanBullets,
          screenshots: uploaded,
          sort_order: nextOrder,
        })
        .select()
        .single();
      if (error) throw error;
      setEntries((prev) => [...prev, data]);
      resetForm();
      setMsg({ ok: true, text: `added "${data.role}" ✦` });
    } catch (error) {
      showError(error);
    }
    setSaving(false);
  };

  const deleteEntry = async (entry) => {
    const confirmed = window.confirm(
      `delete "${entry.role}" @ ${entry.company}?`,
    );
    if (!confirmed) return;
    const { error } = await supabase
      .from("experience")
      .delete()
      .eq("id", entry.id);
    if (error) return showError(error);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    setMsg({ ok: true, text: `deleted "${entry.role}"` });
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditForm({
      role: entry.role,
      company: entry.company,
      period: entry.period || "",
      bullets:
        entry.points && entry.points.length > 0 ? [...entry.points] : [""],
    });
    setExpandedId(entry.id); // auto-expand pag nag-edit
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async (entry) => {
    const cleanBullets = editForm.bullets.map((b) => b.trim()).filter(Boolean);
    if (!editForm.role.trim() || !editForm.company.trim()) {
      setMsg({ ok: false, text: "position and company are required!" });
      return;
    }
    const fields = {
      role: editForm.role.trim(),
      company: editForm.company.trim(),
      period: editForm.period.trim(),
      points: cleanBullets,
    };
    const { error } = await supabase
      .from("experience")
      .update(fields)
      .eq("id", entry.id);
    if (error) return showError(error);
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, ...fields } : e)),
    );
    cancelEdit();
    setMsg({ ok: true, text: `updated "${fields.role}" ✦` });
  };

  const addPhotosToEntry = async (entry, files) => {
    setUploadingId(entry.id);
    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadPhoto(file, entry.category));
      }
      const nextScreenshots = [...(entry.screenshots || []), ...uploaded];
      const { error } = await supabase
        .from("experience")
        .update({ screenshots: nextScreenshots })
        .eq("id", entry.id);
      if (error) throw error;
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, screenshots: nextScreenshots } : e,
        ),
      );
      setMsg({ ok: true, text: `added ${uploaded.length} photo(s) ✦` });
    } catch (error) {
      showError(error);
    }
    setUploadingId(null);
  };

  const removePhoto = async (entry, photo) => {
    const nextScreenshots = (entry.screenshots || []).filter(
      (p) => p.path !== photo.path,
    );
    const { error } = await supabase
      .from("experience")
      .update({ screenshots: nextScreenshots })
      .eq("id", entry.id);
    if (error) return showError(error);
    await supabase.storage.from("experience-photos").remove([photo.path]);
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id ? { ...e, screenshots: nextScreenshots } : e,
      ),
    );
    setMsg({ ok: true, text: "photo removed" });
  };

  if (!entries) return <p className="experience-empty">loading experience…</p>;

  const shown = entries.filter((e) => e.category === category);

  return (
    <>
      <AdminTabCover field="experience_cover_url" kind="experience-cover" />
      <div className="profile-about-label" style={{ marginTop: "20px" }}>
        <span>EXPERIENCE</span>
      </div>

      <div className="profile-skills-row">
        <div className="service-tabs">
          {["internship", "work"].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`service-tab ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="skills-panel">
          <div className="admin-exp-grid">
            {/* left column — add new */}
            <div>
              <div
                className="screenshot-gallery-label"
                style={{ marginBottom: "10px" }}
              >
                ✦ add new {category}
              </div>
              {/* the form */}
              <div style={{ marginBottom: "8px" }}>
                <div className="screenshot-gallery-label">position</div>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Web Developer Intern"
                  className="browser-url"
                  style={adminInputStyle}
                />
              </div>
              <div style={{ marginBottom: "8px" }}>
                <div className="screenshot-gallery-label">company</div>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Urban Travellers Hotel"
                  className="browser-url"
                  style={adminInputStyle}
                />
              </div>
              <div style={{ marginBottom: "8px" }}>
                <div className="screenshot-gallery-label">date &amp; hours</div>
                <input
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="e.g. Feb 2026 – May 2026 (300 hours)"
                  className="browser-url"
                  style={adminInputStyle}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <div className="screenshot-gallery-label">bullet points</div>
                <BulletInputs bullets={bullets} setBullets={setBullets} />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <div className="screenshot-gallery-label">
                  photos (optional)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setNewPhotos(Array.from(e.target.files))}
                />
                {newPhotos.length > 0 && (
                  <p className="experience-teaser">
                    {newPhotos.length} photo(s) ready to upload on save
                  </p>
                )}
              </div>
              <button
                type="button"
                className="btn-gold"
                style={{ width: "100%" }}
                onClick={addEntry}
                disabled={saving}
              >
                {saving ? "saving…" : `✦ add ${category} ✦`}
              </button>
            </div>

            {/* right column — saved entries */}
            <div>
              <div
                className="screenshot-gallery-label"
                style={{ marginBottom: "10px" }}
              >
                ✦ saved entries
              </div>
              {shown.length === 0 && (
                <p className="experience-empty">no {category} entries yet ✦</p>
              )}
              {shown.length > 0 && (
                <div>
                  {shown.map((e) => {
                    const isOpen = expandedId === e.id;
                    return (
                      <div
                        key={e.id}
                        className={`skills-row-card ${isOpen ? "skills-row-card--open" : ""}`}
                        style={{ marginBottom: "6px" }}
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
                            onClick={() => setExpandedId(isOpen ? null : e.id)}
                          >
                            <span
                              className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}
                            >
                              ▸
                            </span>
                            <span
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <span className="profile-intern-role">
                                {e.role}
                              </span>
                              <span className="profile-intern-company">
                                {e.company}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            className="back-btn"
                            onClick={() =>
                              editingId === e.id ? cancelEdit() : startEdit(e)
                            }
                          >
                            {editingId === e.id ? "cancel" : "✎"}
                          </button>
                          <button
                            type="button"
                            className="back-btn"
                            onClick={() => deleteEntry(e)}
                          >
                            ✕
                          </button>
                        </div>

                        {isOpen && (
                          <div className="nested-skills">
                            {editingId === e.id ? (
                              <>
                                {[
                                  ["role", "position"],
                                  ["company", "company"],
                                  ["period", "date & hours"],
                                ].map(([field, label]) => (
                                  <div
                                    key={field}
                                    style={{ marginBottom: "8px" }}
                                  >
                                    <div className="screenshot-gallery-label">
                                      {label}
                                    </div>
                                    <input
                                      value={editForm[field]}
                                      onChange={(ev) =>
                                        setEditForm((f) => ({
                                          ...f,
                                          [field]: ev.target.value,
                                        }))
                                      }
                                      className="browser-url"
                                      style={adminInputStyle}
                                    />
                                  </div>
                                ))}
                                <div style={{ marginBottom: "10px" }}>
                                  <div className="screenshot-gallery-label">
                                    bullet points
                                  </div>
                                  <BulletInputs
                                    bullets={editForm.bullets}
                                    setBullets={(updater) =>
                                      setEditForm((f) => ({
                                        ...f,
                                        bullets:
                                          typeof updater === "function"
                                            ? updater(f.bullets)
                                            : updater,
                                      }))
                                    }
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="btn-gold"
                                  style={{
                                    width: "100%",
                                    marginBottom: "10px",
                                  }}
                                  onClick={() => saveEdit(e)}
                                >
                                  ✦ save changes ✦
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="profile-intern-period">
                                  {e.period}
                                </div>
                                <ul className="profile-intern-points">
                                  {(e.points || []).map((p, i) => (
                                    <li key={i}>{p}</li>
                                  ))}
                                </ul>
                              </>
                            )}

                            <div
                              className="screenshot-gallery-label"
                              style={{ marginTop: "12px" }}
                            >
                              photos
                            </div>
                            {e.screenshots && e.screenshots.length > 0 && (
                              <div className="screenshot-grid">
                                {e.screenshots.map((photo) => (
                                  <div
                                    key={photo.path}
                                    style={{ position: "relative" }}
                                  >
                                    <div className="screenshot-thumb">
                                      <img src={photo.src} alt={photo.label} />
                                    </div>
                                    <button
                                      type="button"
                                      className="back-btn"
                                      style={{
                                        position: "absolute",
                                        top: "2px",
                                        right: "2px",
                                        background: "rgba(0,0,0,0.6)",
                                      }}
                                      onClick={() => removePhoto(e, photo)}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              disabled={uploadingId === e.id}
                              onChange={(ev) =>
                                addPhotosToEntry(e, Array.from(ev.target.files))
                              }
                              style={{ marginTop: "8px" }}
                            />
                            {uploadingId === e.id && (
                              <p className="experience-teaser">uploading…</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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

// ── Admin: artworks manager ───────────────────────────────────────────────────
function AdminArtworks() {
  const [categories, setCategories] = useState(null);
  const [artworks, setArtworks] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [uploadingId, setUploadingId] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    async function loadAll() {
      const [catRes, artRes] = await Promise.all([
        supabase.from("artwork_categories").select("*").order("sort_order"),
        supabase.from("artworks").select("*").order("sort_order"),
      ]);
      if (!catRes.error && !artRes.error) {
        setCategories(catRes.data);
        setArtworks(artRes.data);
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
      .from("artwork_categories")
      .insert({ label, sort_order: nextOrder })
      .select()
      .single();
    if (error) return showError(error);
    setCategories((prev) => [...prev, data]);
    setNewCatLabel("");
    setMsg({ ok: true, text: `added category "${label}" ✦` });
  };

  const deleteCategory = async (cat) => {
    const catArts = artworks.filter((a) => a.category_id === cat.id);
    if (catArts.length > 0) {
      const confirmed = window.confirm(
        `"${cat.label}" has ${catArts.length} artwork(s).\n\ndelete the category AND all its artworks + files?`,
      );
      if (!confirmed) return;
      // children first — restrict blocks the category delete otherwise
      const { error: artErr } = await supabase
        .from("artworks")
        .delete()
        .eq("category_id", cat.id);
      if (artErr) return showError(artErr);
      // clean up storage files too
      await supabase.storage
        .from("artworks")
        .remove(catArts.map((a) => a.path));
    } else {
      const confirmed = window.confirm(`delete category "${cat.label}"?`);
      if (!confirmed) return;
    }
    const { error } = await supabase
      .from("artwork_categories")
      .delete()
      .eq("id", cat.id);
    if (error) return showError(error);
    setArtworks((prev) => prev.filter((a) => a.category_id !== cat.id));
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    setMsg({ ok: true, text: `deleted category "${cat.label}"` });
  };

  const uploadArtworks = async (cat, files) => {
    setUploadingId(cat.id);
    try {
      const siblings = artworks.filter((a) => a.category_id === cat.id);
      let nextOrder =
        siblings.length > 0
          ? Math.max(...siblings.map((a) => a.sort_order)) + 1
          : 0;
      const inserted = [];
      for (const file of files) {
        const path = `${cat.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage
          .from("artworks")
          .upload(path, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage
          .from("artworks")
          .getPublicUrl(path);
        const { data, error } = await supabase
          .from("artworks")
          .insert({
            category_id: cat.id,
            src: urlData.publicUrl,
            label: file.name.replace(/\.[^.]+$/, ""),
            path,
            sort_order: nextOrder++,
          })
          .select()
          .single();
        if (error) throw error;
        inserted.push(data);
      }
      setArtworks((prev) => [...prev, ...inserted]);
      setMsg({ ok: true, text: `uploaded ${inserted.length} artwork(s) ✦` });
    } catch (error) {
      showError(error);
    }
    setUploadingId(null);
  };

  const deleteArtwork = async (art) => {
    const { error } = await supabase
      .from("artworks")
      .delete()
      .eq("id", art.id);
    if (error) return showError(error);
    await supabase.storage.from("artworks").remove([art.path]);
    setArtworks((prev) => prev.filter((a) => a.id !== art.id));
    setMsg({ ok: true, text: "artwork removed" });
  };

  if (!categories || !artworks)
    return <p className="experience-empty">loading artworks…</p>;

  return (
    <>
      <div className="profile-about-label" style={{ marginTop: "20px" }}>
        <span>DIGITAL ARTIST — GALLERY</span>
      </div>

      <div className="skills-panel">
        {categories.map((cat) => {
          const isOpen = openCategory === cat.id;
          const catArts = artworks.filter((a) => a.category_id === cat.id);
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
                  onClick={() =>
                    setOpenCategory((prev) => (prev === cat.id ? null : cat.id))
                  }
                >
                  <span className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}>
                    ▸
                  </span>
                  {cat.label}
                  <span
                    className="skill-text-list skill-text-list--muted"
                    style={{ fontSize: "9px", marginLeft: "4px" }}
                  >
                    ({catArts.length})
                  </span>
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
                  {catArts.length > 0 && (
                    <div className="screenshot-grid">
                      {catArts.map((art) => (
                        <div key={art.id} style={{ position: "relative" }}>
                          <div className="screenshot-thumb">
                            <img src={art.src} alt={art.label || "artwork"} />
                          </div>
                          <button
                            type="button"
                            className="back-btn"
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                              background: "rgba(0,0,0,0.6)",
                            }}
                            onClick={() => deleteArtwork(art)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploadingId === cat.id}
                    onChange={(ev) => {
                      const files = Array.from(ev.target.files);
                      if (files.length > 0) uploadArtworks(cat, files);
                      ev.target.value = "";
                    }}
                    style={{ marginTop: "8px" }}
                  />
                  {uploadingId === cat.id && (
                    <p className="experience-teaser">uploading…</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <input
            value={newCatLabel}
            onChange={(e) => setNewCatLabel(e.target.value)}
            placeholder="new category… (e.g. chibi, portraits)"
            className="browser-url"
            style={adminInputStyle}
          />
          <button type="button" className="btn-gold" onClick={addCategory}>
            + add
          </button>
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

// ── Admin: artelier manager ───────────────────────────────────────────────────
const ARTELIER_SECTIONS = ["gallery", "terms of services", "pricing"];

function AdminArtelier() {
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("gallery");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("artelier_profile")
        .select("*")
        .eq("id", 1)
        .single();
      if (!error) setProfile(data);
    }
    load();
  }, []);

  const showError = (error) =>
    setMsg({ ok: false, text: `failed: ${error.message}` });

  const uploadAvatar = async (file) => {
    if (!file) return;
    setSaving(true);
    try {
      const path = `profile/${Date.now()}-avatar`;
      const { error: upErr } = await supabase.storage
        .from("artelier")
        .upload(path, file);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage
        .from("artelier")
        .getPublicUrl(path);
      const { error } = await supabase
        .from("artelier_profile")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", 1);
      if (error) throw error;
      setProfile((p) => ({ ...p, avatar_url: urlData.publicUrl }));
      setMsg({ ok: true, text: "profile photo updated ✦" });
    } catch (error) {
      showError(error);
    }
    setSaving(false);
  };

  const updateSocial = (i, field, value) =>
    setProfile((p) => ({
      ...p,
      socials: p.socials.map((s, idx) =>
        idx === i ? { ...s, [field]: value } : s,
      ),
    }));

  const addSocial = () =>
    setProfile((p) => ({ ...p, socials: [...p.socials, { label: "", url: "" }] }));

  const removeSocial = (i) =>
    setProfile((p) => ({
      ...p,
      socials: p.socials.filter((_, idx) => idx !== i),
    }));

  const saveProfile = async () => {
    setSaving(true);
    const cleanSocials = profile.socials.filter(
      (s) => s.label.trim() || s.url.trim(),
    );
    const { error } = await supabase
      .from("artelier_profile")
      .update({ name: profile.name.trim(), socials: cleanSocials })
      .eq("id", 1);
    setSaving(false);
    if (error) return showError(error);
    setProfile((p) => ({ ...p, socials: cleanSocials }));
    setMsg({ ok: true, text: "artelier profile saved ✦" });
  };

  if (!profile) return <p className="experience-empty">loading artelier…</p>;

  return (
    <>
      <div className="profile-about-label">
        <span>ARTELIER — PROFILE</span>
      </div>

      {/* profile row: photo + name/socials beside it */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          marginTop: "10px",
        }}
      >
        <div
          className="profile-avatar admin-avatar-preview"
          style={{ flexShrink: 0 }}
          onClick={() => avatarInputRef.current?.click()}
        >
          <img
            src={profile.avatar_url || "/kangkang.png"}
            alt="artelier avatar preview"
          />
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            uploadAvatar(e.target.files[0]);
            e.target.value = "";
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="screenshot-gallery-label">name</div>
          <input
            value={profile.name}
            onChange={(e) =>
              setProfile((p) => ({ ...p, name: e.target.value }))
            }
            className="browser-url"
            style={adminInputStyle}
          />

          <div className="screenshot-gallery-label" style={{ marginTop: "8px" }}>
            socials
          </div>
          {profile.socials.map((s, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: "6px", marginBottom: "6px" }}
            >
              <input
                value={s.label}
                onChange={(e) => updateSocial(i, "label", e.target.value)}
                placeholder="label (e.g. instagram)"
                className="browser-url"
                style={{ ...adminInputStyle, flex: "0 0 35%" }}
              />
              <input
                value={s.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                placeholder="https://…"
                className="browser-url"
                style={adminInputStyle}
              />
              <button
                type="button"
                className="back-btn"
                onClick={() => removeSocial(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
            <button type="button" className="back-btn" onClick={addSocial}>
              + add social
            </button>
            <button
              type="button"
              className="btn-gold"
              disabled={saving}
              onClick={saveProfile}
            >
              {saving ? "saving…" : "✦ save profile ✦"}
            </button>
          </div>
        </div>
      </div>

      {msg && (
        <p
          className="experience-teaser"
          style={{ color: msg.ok ? "var(--gold)" : "#ff5f57", marginTop: "10px" }}
        >
          {msg.text}
        </p>
      )}

      {/* section tabs: gallery / tos / pricing */}
      <div className="service-tabs" style={{ margin: "18px 0 10px" }}>
        {ARTELIER_SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className={`service-tab ${activeSection === s ? "active" : ""}`}
            onClick={() => setActiveSection(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {activeSection === "gallery" ? (
        <AdminArtelierGallery />
      ) : activeSection === "terms of services" ? (
        <AdminArtelierTos />
      ) : (
        <p className="experience-empty">
          🚧 pricing editor coming soon (˶ᵔ ᵕ ᵔ˶)
        </p>
      )}
    </>
  );
}

// ── Admin: artelier gallery (categories + photos, no filenames shown) ────────
function AdminArtelierGallery() {
  const [categories, setCategories] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [uploadingId, setUploadingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadAll() {
      const [catRes, photoRes] = await Promise.all([
        supabase.from("artelier_categories").select("*").order("sort_order"),
        supabase.from("artelier_photos").select("*").order("sort_order"),
      ]);
      if (!catRes.error && !photoRes.error) {
        setCategories(catRes.data);
        setPhotos(photoRes.data);
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
      .from("artelier_categories")
      .insert({ label, sort_order: nextOrder })
      .select()
      .single();
    if (error) return showError(error);
    setCategories((prev) => [...prev, data]);
    setNewCatLabel("");
    setMsg({ ok: true, text: `added category "${label}" ✦` });
  };

  const deleteCategory = async (cat) => {
    const catPhotos = photos.filter((p) => p.category_id === cat.id);
    if (catPhotos.length > 0) {
      const confirmed = window.confirm(
        `"${cat.label}" has ${catPhotos.length} photo(s).\n\ndelete the category AND all its photos + files?`,
      );
      if (!confirmed) return;
      // children first — restrict blocks the category delete otherwise
      const { error: photoErr } = await supabase
        .from("artelier_photos")
        .delete()
        .eq("category_id", cat.id);
      if (photoErr) return showError(photoErr);
      await supabase.storage
        .from("artelier")
        .remove(catPhotos.map((p) => p.path));
    } else {
      const confirmed = window.confirm(`delete category "${cat.label}"?`);
      if (!confirmed) return;
    }
    const { error } = await supabase
      .from("artelier_categories")
      .delete()
      .eq("id", cat.id);
    if (error) return showError(error);
    setPhotos((prev) => prev.filter((p) => p.category_id !== cat.id));
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    setMsg({ ok: true, text: `deleted category "${cat.label}"` });
  };

  const uploadPhotos = async (cat, files) => {
    setUploadingId(cat.id);
    try {
      const siblings = photos.filter((p) => p.category_id === cat.id);
      let nextOrder =
        siblings.length > 0
          ? Math.max(...siblings.map((p) => p.sort_order)) + 1
          : 0;
      const inserted = [];
      for (const file of files) {
        // random-ish path only — no filename stored or displayed anywhere
        const ext = file.name.split(".").pop();
        const path = `${cat.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("artelier")
          .upload(path, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage
          .from("artelier")
          .getPublicUrl(path);
        const { data, error } = await supabase
          .from("artelier_photos")
          .insert({
            category_id: cat.id,
            src: urlData.publicUrl,
            path,
            sort_order: nextOrder++,
          })
          .select()
          .single();
        if (error) throw error;
        inserted.push(data);
      }
      setPhotos((prev) => [...prev, ...inserted]);
      setMsg({ ok: true, text: `uploaded ${inserted.length} photo(s) ✦` });
    } catch (error) {
      showError(error);
    }
    setUploadingId(null);
  };

  const deletePhoto = async (photo) => {
    const { error } = await supabase
      .from("artelier_photos")
      .delete()
      .eq("id", photo.id);
    if (error) return showError(error);
    await supabase.storage.from("artelier").remove([photo.path]);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setMsg({ ok: true, text: "photo removed" });
  };

  if (!categories || !photos)
    return <p className="experience-empty">loading gallery…</p>;

  return (
    <>
      <div className="skills-panel">
        {categories.map((cat) => {
          const isOpen = openCategory === cat.id;
          const catPhotos = photos.filter((p) => p.category_id === cat.id);
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
                  onClick={() =>
                    setOpenCategory((prev) => (prev === cat.id ? null : cat.id))
                  }
                >
                  <span className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}>
                    ▸
                  </span>
                  {cat.label}
                  <span
                    className="skill-text-list skill-text-list--muted"
                    style={{ fontSize: "9px", marginLeft: "4px" }}
                  >
                    ({catPhotos.length})
                  </span>
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
                  {catPhotos.length > 0 && (
                    <div className="screenshot-grid">
                      {catPhotos.map((photo) => (
                        <div key={photo.id} style={{ position: "relative" }}>
                          <div className="screenshot-thumb">
                            <img src={photo.src} alt="artelier artwork" />
                          </div>
                          <button
                            type="button"
                            className="back-btn"
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                              background: "rgba(0,0,0,0.6)",
                            }}
                            onClick={() => deletePhoto(photo)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* hidden input + button — walang filename na lalabas ✦ */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(ev) => {
                      const files = Array.from(ev.target.files);
                      if (files.length > 0) uploadPhotos(cat, files);
                      ev.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    className="btn-gold"
                    style={{ marginTop: "8px" }}
                    disabled={uploadingId === cat.id}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingId === cat.id ? "uploading…" : "+ upload photos"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <input
            value={newCatLabel}
            onChange={(e) => setNewCatLabel(e.target.value)}
            placeholder="new category… (e.g. chibi, portraits)"
            className="browser-url"
            style={adminInputStyle}
          />
          <button type="button" className="btn-gold" onClick={addCategory}>
            + add
          </button>
        </div>
      </div>

      {msg && (
        <p
          className="experience-teaser"
          style={{ color: msg.ok ? "var(--gold)" : "#ff5f57", marginTop: "10px" }}
        >
          {msg.text}
        </p>
      )}
    </>
  );
}

// ── Admin: artelier terms of services (categories + jsonb bullets) ───────────
function AdminArtelierTos() {
  const [cats, setCats] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [editBullets, setEditBullets] = useState([""]);
  const [newLabel, setNewLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("artelier_tos")
        .select("*")
        .order("sort_order");
      if (!error) setCats(data);
    }
    load();
  }, []);

  const showError = (error) =>
    setMsg({ ok: false, text: `failed: ${error.message}` });

  const toggleCat = (cat) => {
    if (openId === cat.id) {
      setOpenId(null);
      return;
    }
    setOpenId(cat.id);
    setEditBullets(cat.bullets.length > 0 ? cat.bullets : [""]);
  };

  const addCategory = async () => {
    const label = newLabel.trim();
    if (!label) return;
    const nextOrder =
      cats.length > 0 ? Math.max(...cats.map((c) => c.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from("artelier_tos")
      .insert({ label, bullets: [], sort_order: nextOrder })
      .select()
      .single();
    if (error) return showError(error);
    setCats((prev) => [...prev, data]);
    setNewLabel("");
    setMsg({ ok: true, text: `added "${label}" ✦` });
  };

  const deleteCategory = async (cat) => {
    const confirmed = window.confirm(
      `delete TOS category "${cat.label}" and its bullets?`,
    );
    if (!confirmed) return;
    const { error } = await supabase
      .from("artelier_tos")
      .delete()
      .eq("id", cat.id);
    if (error) return showError(error);
    setCats((prev) => prev.filter((c) => c.id !== cat.id));
    if (openId === cat.id) setOpenId(null);
    setMsg({ ok: true, text: `deleted "${cat.label}"` });
  };

  const saveBullets = async (cat) => {
    setSaving(true);
    const clean = editBullets.map((b) => b.trim()).filter(Boolean);
    const { error } = await supabase
      .from("artelier_tos")
      .update({ bullets: clean })
      .eq("id", cat.id);
    setSaving(false);
    if (error) return showError(error);
    setCats((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, bullets: clean } : c)),
    );
    setMsg({ ok: true, text: `saved "${cat.label}" bullets ✦` });
  };

  if (!cats) return <p className="experience-empty">loading terms…</p>;

  return (
    <>
      <div className="skills-panel">
        {cats.map((cat) => {
          const isOpen = openId === cat.id;
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
                  onClick={() => toggleCat(cat)}
                >
                  <span className={`skills-toggle-arrow ${isOpen ? "open" : ""}`}>
                    ▸
                  </span>
                  {cat.label}
                  <span
                    className="skill-text-list skill-text-list--muted"
                    style={{ fontSize: "9px", marginLeft: "4px" }}
                  >
                    ({cat.bullets.length})
                  </span>
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
                  <div className="screenshot-gallery-label">bullet points</div>
                  <BulletInputs
                    bullets={editBullets}
                    setBullets={setEditBullets}
                  />
                  <button
                    type="button"
                    className="btn-gold"
                    style={{ marginTop: "8px" }}
                    disabled={saving}
                    onClick={() => saveBullets(cat)}
                  >
                    {saving ? "saving…" : "✦ save bullets ✦"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="new TOS category… (e.g. payment, revisions)"
            className="browser-url"
            style={adminInputStyle}
          />
          <button type="button" className="btn-gold" onClick={addCategory}>
            + add
          </button>
        </div>
      </div>

      {msg && (
        <p
          className="experience-teaser"
          style={{ color: msg.ok ? "var(--gold)" : "#ff5f57", marginTop: "10px" }}
        >
          {msg.text}
        </p>
      )}
    </>
  );
}

const ADMIN_TABS = [
  "profile",
  "skills",
  "experience",
  "home",
  "about me",
  "services",
  "get in touch",
];
const ADMIN_TAB_URLS = {
  artelier: "@kangkang/admin/artelier",
  profile: "@kangkang/admin/profile",
  skills: "@kangkang/admin/skills",
  experience: "@kangkang/admin/experience",
  home: "@kangkang/admin/home",
  "about me": "@kangkang/admin/about",
  services: "@kangkang/admin/services",
  "get in touch": "@kangkang/admin/contact",
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

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // uploads one image sa profile-images bucket, returns public URL
  const uploadProfileImage = async (file, kind) => {
    const path = `${kind}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("profile-images")
      .upload(path, file);
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleImageChange = async (e, kind) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // para pwede ulit i-select yung same file
    if (!file) return;
    setSaveMsg(null);
    const field = kind === "avatar" ? "avatar_url" : "cover_url";
    const oldUrl = profileForm[field];
    try {
      const url = await uploadProfileImage(file, kind);
      const { error } = await supabase
        .from("profile")
        .update({ [field]: url })
        .eq("id", profileForm.id);
      if (error) throw error;
      setProfileForm((p) => ({ ...p, [field]: url }));
      // cleanup: burahin yung old file para hindi mag-ipon ng basura
      if (oldUrl && oldUrl.includes("/profile-images/")) {
        const oldPath = oldUrl.split("/profile-images/")[1];
        await supabase.storage.from("profile-images").remove([oldPath]);
      }
      setSaveMsg({
        ok: true,
        text: `${kind} updated ✦ refresh the main page to see it`,
      });
    } catch (err) {
      setSaveMsg({ ok: false, text: `upload failed: ${err.message}` });
    }
  };

  return (
    <div className="profile-bg">
      {session ? (
        <div
          className={`admin-layout ${
            activeTab === "services" ? "admin-layout--wide" : ""
          }`}
        >
          {/* side nav — hiwalay sa browser-frame */}
          <nav className="admin-sidebar">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "active" : ""}
              >
                {tab}
              </button>
            ))}
            <button
              className={
                "admin-sidebar-artelier" +
                (activeTab === "artelier" ? " active" : "")
              }
              onClick={() => setActiveTab("artelier")}
            >
              ✦ artelier
            </button>
          </nav>

          {/* reused browser-frame, same as public pages */}
          <div className="browser-frame admin-frame">
            <div className="browser-bar">
              <div className="browser-dots">
                <span className="dot-red" />
                <span className="dot-yellow" />
                <span className="dot-green" />
              </div>
              <div className="browser-url">{ADMIN_TAB_URLS[activeTab]}</div>
              <button className="back-btn" onClick={handleLogout}>
                log out
              </button>
            </div>
            <div className="section-content">
              <div className="profile-about-label">
                <span>ADMIN — {activeTab.toUpperCase()}</span>
              </div>
              <p className="experience-teaser">
                logged in as {session.user.email} ✦
              </p>
              {activeTab === "experience" ? (
                <AdminExperience />
              ) : activeTab === "skills" ? (
                <AdminSkills />
              ) : activeTab === "home" ? (
                <AdminHome />
              ) : activeTab === "artelier" ? (
                <AdminArtelier />
              ) : activeTab === "about me" ? (
                <AdminAbout />
              ) : activeTab === "services" ? (
                <>
                  <AdminTabCover
                    table="services_content"
                    kind="services-cover"
                  />
                  <div className="admin-services-grid">
                    <div>
                      <AdminWebProjects />
                    </div>
                    <div>
                      <AdminArtworks />
                    </div>
                  </div>
                </>
              ) : activeTab === "get in touch" ? (
                <AdminContact />
              ) : !profileForm ? (
                <p className="experience-empty">loading profile…</p>
              ) : (
                <form onSubmit={handleSaveProfile}>
                  <div
                    className="profile-cover admin-cover-preview"
                    style={{
                      backgroundImage: `url(${profileForm.cover_url || "/frame1.png"})`,
                    }}
                    onClick={() => coverInputRef.current?.click()}
                  />
                  <div className="profile-avatar-wrap">
                    <div
                      className="profile-avatar admin-avatar-preview"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <img
                        src={profileForm.avatar_url || "/kangkang.png"}
                        alt="avatar preview"
                      />
                    </div>
                  </div>
                  <p className="admin-upload-hint">
                    click the cover or avatar to change it ✦
                    <br />
                    cover: recommended 1400 × 350px (wide landscape) · avatar:
                    400 × 400px (square)
                  </p>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e, "cover")}
                  />
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e, "avatar")}
                  />
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
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-card" style={{ maxWidth: "400px" }}>
          <div className="browser-bar">
            <div className="browser-dots">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
            </div>
            <div className="browser-url">@kangkang/admin</div>
          </div>
          <div className="profile-card-body" style={{ padding: "24px 28px" }}>
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
          </div>
        </div>
      )}
    </div>
  );
}

// ── Digital artist gallery page ───────────────────────────────────────────────
function DigitalArtistPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [artworks, setArtworks] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function load() {
      const [catRes, artRes] = await Promise.all([
        supabase.from("artwork_categories").select("*").order("sort_order"),
        supabase.from("artworks").select("*").order("sort_order"),
      ]);
      if (catRes.error || artRes.error) {
        console.error("artworks load failed:", catRes.error || artRes.error);
        setLoadError(true);
        return;
      }
      setCategories(catRes.data);
      setArtworks(artRes.data);
      if (catRes.data.length > 0) setActiveCat(catRes.data[0].id);
    }
    load();
  }, []);

  const shown = artworks
    ? artworks.filter((a) => a.category_id === activeCat)
    : [];

  const goPrev = () =>
    setLightbox((p) => ({
      ...p,
      index: p.index === 0 ? p.items.length - 1 : p.index - 1,
    }));
  const goNext = () =>
    setLightbox((p) => ({
      ...p,
      index: p.index === p.items.length - 1 ? 0 : p.index + 1,
    }));

  return (
    <div className="page single" onContextMenu={(e) => e.preventDefault()}>
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
                  onClick={goPrev}
                >
                  ‹
                </button>
              )}
              <div className="lightbox-frame">
                <img
                  src={lightbox.items[lightbox.index].src}
                  alt={lightbox.items[lightbox.index].label || "artwork"}
                  className="lightbox-img"
                  draggable={false}
                />
              </div>
              {lightbox.items.length > 1 && (
                <button
                  className="lightbox-nav-arrow lightbox-nav-arrow--next"
                  onClick={goNext}
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

      <div className="browser-frame">
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <div className="browser-url">@kangkang/digital-artist</div>
          <button className="back-btn" onClick={() => navigate("/")}>
            ← back
          </button>
        </div>
        <div className="section-content">
          <h2 className="section-title">
            <span className="star-prefix">★—</span> digital artist
          </h2>
          <p className="service-quote">
            "One brushstroke at a time — all from my phone! ⸜(｡˃ ᵕ ˂ )⸝"
          </p>

          {loadError ? (
            <p className="experience-empty">couldn't load artworks (´•̥ ω •̥`)</p>
          ) : !categories || !artworks ? (
            <p className="experience-empty">loading…</p>
          ) : categories.length === 0 ? (
            <p className="experience-empty">🚧 gallery coming soon (˶ᵔ ᵕ ᵔ˶)</p>
          ) : (
            <>
              <div className="service-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`service-tab ${activeCat === cat.id ? "active" : ""}`}
                    onClick={() => setActiveCat(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {shown.length === 0 ? (
                <p className="experience-empty">
                  no artworks in this category yet
                </p>
              ) : (
                <div className="artwork-scroll">
                  {shown.map((art, i) => (
                    <div
                      key={art.id}
                      className="artwork-item"
                      onClick={() => setLightbox({ items: shown, index: i })}
                    >
                      <img
                        src={art.src}
                        alt={art.label || "artwork"}
                        className="artwork-img"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Web developer projects page ───────────────────────────────────────────────
function WebDeveloperPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("web_projects")
        .select("*")
        .order("sort_order");
      if (error) {
        console.error("web projects load failed:", error);
        setLoadError(true);
      } else {
        setProjects(data);
      }
    }
    load();
  }, []);

  const goPrev = () =>
    setLightbox((p) => ({
      ...p,
      index: p.index === 0 ? p.items.length - 1 : p.index - 1,
    }));
  const goNext = () =>
    setLightbox((p) => ({
      ...p,
      index: p.index === p.items.length - 1 ? 0 : p.index + 1,
    }));

  return (
    <div className="page single">
      {/* project detail modal */}
      {activeProject && (
        <div
          className="lightbox-overlay"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="lightbox-card experience-modal experience-modal--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-card-bar modal-bar-titled">
              <span className="modal-bar-title">
                <span className="star-prefix">★</span> {activeProject.title}
              </span>
              <button
                className="lightbox-close"
                onClick={() => setActiveProject(null)}
              >
                ✕
              </button>
            </div>
            <div className="experience-modal-body experience-modal-body--split experience-modal-body--split-2">
              <div className="experience-modal-details">
                <div className="profile-intern-role">{activeProject.title}</div>
                <div className="profile-intern-company">
                  {activeProject.sub}
                </div>
                <div className="experience-modal-divider" />
                {activeProject.description && (
                  <p
                    className="about-paragraph"
                    style={{ marginTop: "10px", marginBottom: "16px" }}
                  >
                    {activeProject.description}
                  </p>
                )}
                {activeProject.tools && activeProject.tools.length > 0 && (
                  <>
                    <div className="about-block-title">
                      tools &amp; software used
                    </div>
                    <p
                      className="skill-text-list skill-text-list--primary"
                      style={{ marginBottom: "16px" }}
                    >
                      {activeProject.tools.map((t, i) => (
                        <span key={t}>
                          {t}
                          {i < activeProject.tools.length - 1 && (
                            <span className="skill-text-dot">•</span>
                          )}
                        </span>
                      ))}
                    </p>
                  </>
                )}
                {activeProject.link && (
                  
                    <a href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold experience-demo-btn"
                  >
                    ↗ view live site
                  </a>
                )}
              </div>
              <div className="experience-modal-gallery-col">
                <div className="screenshot-gallery">
                  <div className="screenshot-gallery-label">★ screenshots</div>
                  {activeProject.screenshots &&
                  activeProject.screenshots.length > 0 ? (
                    <div className="screenshot-grid">
                      {activeProject.screenshots.map((shot, i) => (
                        <button
                          key={shot.path}
                          className="screenshot-thumb"
                          onClick={() =>
                            setLightbox({
                              items: activeProject.screenshots,
                              index: i,
                            })
                          }
                        >
                          <img
                            src={shot.src}
                            alt={shot.label}
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    activeProject.cover_src && (
                      <button
                        className="screenshot-thumb"
                        style={{ width: "100%", aspectRatio: "16 / 10" }}
                        onClick={() =>
                          setLightbox({
                            items: [
                              {
                                src: activeProject.cover_src,
                                label: activeProject.title,
                              },
                            ],
                            index: 0,
                          })
                        }
                      >
                        <img
                          src={activeProject.cover_src}
                          alt={activeProject.title}
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* screenshot lightbox — stacks ON TOP of the modal */}
      {lightbox && (
        <div
          className="lightbox-overlay screenshot-preview-overlay"
          onClick={() => setLightbox(null)}
        >
          <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-card-bar modal-bar-titled">
              <span className="modal-bar-title">
                <span className="star-prefix">★</span>{" "}
                {lightbox.items[lightbox.index].label || "screenshot"}
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
                  onClick={goPrev}
                >
                  ‹
                </button>
              )}
              <div className="lightbox-frame">
                <img
                  src={lightbox.items[lightbox.index].src}
                  alt={lightbox.items[lightbox.index].label || "screenshot"}
                  className="lightbox-img"
                />
              </div>
              {lightbox.items.length > 1 && (
                <button
                  className="lightbox-nav-arrow lightbox-nav-arrow--next"
                  onClick={goNext}
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

      <div className="browser-frame">
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <div className="browser-url">@kangkang/web-developer</div>
          <button className="back-btn" onClick={() => navigate("/")}>
            ← back
          </button>
        </div>
        <div className="section-content">
          <h2 className="section-title">
            <span className="star-prefix">★—</span> web developer
          </h2>
          <p className="service-quote">
            "Turning designs into real websites, one line of code at a time!"
          </p>

          {loadError ? (
            <p className="experience-empty">
              couldn't load projects (´•̥ ω •̥`)
            </p>
          ) : !projects ? (
            <p className="experience-empty">loading…</p>
          ) : projects.length === 0 ? (
            <p className="experience-empty">🚧 projects coming soon (˶ᵔ ᵕ ᵔ˶)</p>
          ) : (
            <div className="service-scroll">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="service-scroll-card"
                  onClick={() => setActiveProject(proj)}
                >
                  {proj.cover_src ? (
                    <div className="service-scroll-emoji" style={{ padding: 0 }}>
                      <img
                        src={proj.cover_src}
                        alt={proj.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="service-scroll-emoji">💻</div>
                  )}
                  <div className="service-project-info">
                    <h4>{proj.title} →</h4>
                    <p>{proj.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── Artelier page (hidden route, /artelier) ───────────────────────────────────
// No links point here — reachable only by typing the URL, same idea as /admin.
// Front page: big avatar → name → socials (max 3 per row) → 3 nav buttons.
// Content is database-driven: artelier_profile (id=1), edited via /admin.
function ArtelierPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const goPrev = () =>
    setLightbox((p) => ({
      ...p,
      index: (p.index - 1 + p.items.length) % p.items.length,
    }));
  const goNext = () =>
    setLightbox((p) => ({
      ...p,
      index: (p.index + 1) % p.items.length,
    }));

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("artelier_profile")
        .select("*")
        .eq("id", 1)
        .single();
      if (error) {
        console.error("artelier profile load failed:", error);
        setLoadError(true);
      } else {
        setProfile(data);
      }
    }
    load();
  }, []);

  return (
    <div className="page single" onContextMenu={(e) => e.preventDefault()}>
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
                  onClick={goPrev}
                >
                  ‹
                </button>
              )}
              <div className="lightbox-frame">
                <img
                  src={lightbox.items[lightbox.index].src}
                  alt="artelier artwork"
                  className="lightbox-img"
                  draggable={false}
                />
              </div>
              {lightbox.items.length > 1 && (
                <button
                  className="lightbox-nav-arrow lightbox-nav-arrow--next"
                  onClick={goNext}
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
      <div className="browser-frame">
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <div className="browser-url">@kangkang/artelier</div>
        </div>

        {loadError ? (
          <div className="section-content">
            <p className="experience-empty">couldn't load artelier (´•̥ ω •̥`)</p>
          </div>
        ) : !profile ? (
          <div className="section-content">
            <p className="experience-empty">loading…</p>
          </div>
        ) : (
          <div className="section-content artelier-front">
            <div className="artelier-avatar">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} />
              ) : (
                "🎨"
              )}
            </div>
            <h2 className="section-title artelier-name">
              <span className="star-prefix">★—</span> {profile.name}
            </h2>
            {profile.socials && profile.socials.length > 0 && (
              <div className="artelier-socials">
                {profile.socials.map((s, i) => (
                  <a
                    key={`${s.label}-${i}`}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="artelier-social-link"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
            <div className="artelier-nav">
              <button
                className="btn-gold artelier-nav-btn"
                onClick={() => navigate("/artelier/gallery")}
              >
                ★ gallery
              </button>
              <button
                className="btn-gold artelier-nav-btn"
                onClick={() => navigate("/artelier/tos")}
              >
                ★ terms of service
              </button>
              <button
                className="btn-gold artelier-nav-btn"
                onClick={() => navigate("/artelier/pricelist")}
              >
                ★ pricelist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Artelier gallery page (/artelier/gallery) ─────────────────────────────────
// Header + category buttons (from artelier_categories, max 5 per row).
// Photo grid per category = next stage.
function ArtelierGalleryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function load() {
      const [catRes, photoRes] = await Promise.all([
        supabase.from("artelier_categories").select("*").order("sort_order"),
        supabase.from("artelier_photos").select("*").order("sort_order"),
      ]);
      if (catRes.error || photoRes.error) {
        console.error(
          "artelier gallery load failed:",
          catRes.error || photoRes.error,
        );
        setLoadError(true);
        return;
      }
      setCategories(catRes.data);
      setPhotos(photoRes.data);
      if (catRes.data.length > 0) setActiveCat(catRes.data[0].id);
    }
    load();
  }, []);

  const shown = photos
    ? photos.filter((p) => p.category_id === activeCat)
    : [];

  const goPrev = () =>
    setLightbox((p) => ({
      ...p,
      index: p.index === 0 ? p.items.length - 1 : p.index - 1,
    }));
  const goNext = () =>
    setLightbox((p) => ({
      ...p,
      index: p.index === p.items.length - 1 ? 0 : p.index + 1,
    }));

  return (
    <div className="page single" onContextMenu={(e) => e.preventDefault()}>
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
                  onClick={goPrev}
                >
                  ‹
                </button>
              )}
              <div className="lightbox-frame">
                <img
                  src={lightbox.items[lightbox.index].src}
                  alt="artelier artwork"
                  className="lightbox-img"
                  draggable={false}
                />
              </div>
              {lightbox.items.length > 1 && (
                <button
                  className="lightbox-nav-arrow lightbox-nav-arrow--next"
                  onClick={goNext}
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

      <div className="browser-frame">
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <div className="browser-url">@kangkang/artelier/gallery</div>
          <button className="back-btn" onClick={() => navigate("/artelier")}>
            ← back
          </button>
        </div>
        <div className="section-content">
          <h2 className="section-title">
            <span className="star-prefix">★—</span> gallery
          </h2>

          {loadError ? (
            <p className="experience-empty">
              couldn't load gallery (´•̥ ω •̥`)
            </p>
          ) : !categories || !photos ? (
            <p className="experience-empty">loading…</p>
          ) : categories.length === 0 ? (
            <p className="experience-empty">
              🚧 no categories yet (˶ᵔ ᵕ ᵔ˶)
            </p>
          ) : (
            <>
              <div className="artelier-cat-grid">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`service-tab ${activeCat === cat.id ? "active" : ""}`}
                    onClick={() => setActiveCat(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {shown.length === 0 ? (
                <p className="experience-empty">
                  no photos in this category yet
                </p>
              ) : (
                <div className="artwork-scroll">
                  {shown.map((photo, i) => (
                    <div
                      key={photo.id}
                      className="artwork-item"
                      onClick={() => setLightbox({ items: shown, index: i })}
                    >
                      <img
                        src={photo.src}
                        alt="artelier artwork"
                        className="artwork-img"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
// Portfolio is now the main route ("/"), profile card gets its own route
// ("/profile-card") — same pattern as /admin. Each wrapper just supplies the
// navigate() call as whichever prop the inner component already expects.
function PortfolioPage() {
  const navigate = useNavigate();
  return <Portfolio onBack={() => navigate("/profile-card")} />;
}

function ProfileCardPage() {
  const navigate = useNavigate();
  return <ProfileCard onViewPortfolio={() => navigate("/")} />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Floating stars + circles — always visible on every page */}
      <FloatingDeco />
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/profile-card" element={<ProfileCardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/digital-artist" element={<DigitalArtistPage />} />
        <Route path="/web-developer" element={<WebDeveloperPage />} />
        <Route path="/artelier" element={<ArtelierPage />} />
        <Route path="/artelier/gallery" element={<ArtelierGalleryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
