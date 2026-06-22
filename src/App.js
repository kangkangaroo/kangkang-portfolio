import { useState } from 'react';
import './index.css';

// ── Global floating decorations (stars + star-circles) ────────────────────────
// These sit fixed on the screen behind everything, visible on every page.
const DECO_ITEMS = [
  // ── TOP LEFT — hero star + 1 small accent (removed the crowding mid-sizes)
  { size: '5.5rem', top: '13%',  left: '3%',   delay: '0s',    opacity: 1,    glyph: '★' },
  { size: '1.1rem', top: '7%',   left: '17%',  delay: '0.7s',  opacity: 0.55, glyph: '★' },
  { size: '1.9rem', top: '29%',  left: '13%',  delay: '2s',    opacity: 0.5,  glyph: '★' },
  // ── TOP RIGHT — circles + star
  { size: '3.2rem', top: '7%',   right: '3%',  delay: '0.4s',  opacity: 0.85, glyph: '●' },
  { size: '1rem',   top: '4%',   right: '12%', delay: '1.1s',  opacity: 0.55, glyph: '●' },
  { size: '1.6rem', top: '17%',  right: '2%',  delay: '1.8s',  opacity: 0.65, glyph: '★' },
  // ── MID LEFT — flanking the frame
  { size: '1.2rem', top: '44%',  left: '2%',   delay: '0.5s',  opacity: 0.45, glyph: '★' },
  { size: '0.7rem', top: '52%',  left: '11%',  delay: '1.6s',  opacity: 0.35, glyph: '●' },
  { size: '2.1rem', top: '60%',  left: '4%',   delay: '0.9s',  opacity: 0.6,  glyph: '●' },
  { size: '0.9rem', top: '68%',  left: '14%',  delay: '2.3s',  opacity: 0.4,  glyph: '★' },
  // ── MID RIGHT — flanking the frame
  { size: '0.8rem', top: '42%',  right: '9%',  delay: '1.4s',  opacity: 0.4,  glyph: '★' },
  { size: '1.8rem', top: '50%',  right: '2%',  delay: '0.3s',  opacity: 0.55, glyph: '●' },
  { size: '1.1rem', top: '62%',  right: '11%', delay: '1.9s',  opacity: 0.45, glyph: '●' },
  { size: '0.65rem',top: '72%',  right: '5%',  delay: '2.6s',  opacity: 0.3,  glyph: '★' },
  // ── BOTTOM LEFT
  { size: '2.8rem', top: '80%',  left: '3%',   delay: '1.0s',  opacity: 0.75, glyph: '★' },
  { size: '1.0rem', top: '88%',  left: '13%',  delay: '0.2s',  opacity: 0.45, glyph: '●' },
  { size: '0.75rem',top: '93%',  left: '6%',   delay: '1.7s',  opacity: 0.35, glyph: '★' },
  { size: '1.5rem', top: '76%',  left: '18%',  delay: '2.4s',  opacity: 0.5,  glyph: '●' },
  // ── BOTTOM RIGHT
  { size: '1.3rem', top: '78%',  right: '4%',  delay: '0.6s',  opacity: 0.55, glyph: '●' },
  { size: '2.4rem', top: '85%',  right: '2%',  delay: '1.5s',  opacity: 0.75, glyph: '★' },
  { size: '0.8rem', top: '91%',  right: '13%', delay: '0.8s',  opacity: 0.35, glyph: '●' },
  { size: '1.1rem', top: '96%',  right: '6%',  delay: '2.1s',  opacity: 0.45, glyph: '★' },
];

function FloatingDeco() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {DECO_ITEMS.map((d, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top:    d.top    || 'auto',
            bottom: d.bottom || 'auto',
            left:   d.left   || 'auto',
            right:  d.right  || 'auto',
            fontSize: d.size,
            color: 'var(--gold)',
            opacity: d.opacity,
            lineHeight: 1,
            filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.7)) drop-shadow(0 0 20px rgba(201,168,76,0.35))',
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
    'digital artist': {
      quote: 'One brushstroke at a time — all from my phone! ⸜(｡˃ ᵕ ˂ )⸝',
      tool: 'ibis Paint X', toolIcon: '🎨',
      projects: [
        { label: '1' },
        { label: '2' },
        { label: '3' },
        { label: '4' },
        { label: '5' },
      ],
    },
  'ui/ux designer': {
    quote: 'If I can imagine it, Figma helps me build it!',
    tool: 'Figma', toolIcon: '🔷',
    projects: [
      { title: 'portfolio', sub: 'ui/ux design · figma prototype', img: '/f1.png', link: 'https://www.figma.com/proto/VeGPiK0FUfDK0qpkimExHf/kangkang?node-id=360-35&t=QppVUxLHnlqnkizB-1' },
      { title: 'profile card',   sub: 'ui/ux design · figma prototype', img: '/f2.png', link: 'https://www.figma.com/proto/VeGPiK0FUfDK0qpkimExHf/kangkang?node-id=454-28&t=QppVUxLHnlqnkizB-1' },
      {title: 'expenses tracker', sub: 'ui/ux design', img: '/f3.png', link: 'https://www.figma.com/proto/bZ7kVBbwCpK7ZJa0KQ5k7m/Projects?node-id=1-2&t=vGvNRepkjiIVr6jy-1' },
    ],
  },
  'web developer': {
    quote: 'Turning designs into real websites, one line of code at a time!',
    tool: 'VS Code + Wix', toolIcon: '💻',
    projects: [
      { title: 'kangkang-portfolio',       sub: 'personal portfolio · react.js · vercel', img: '/s1.png', link: 'kangkang-portfolio.vercel.app' },
      { title: 'gvc-portfolio', sub: 'academic project · wix', img: '/s2.png', link: 'https://belamora04.wixsite.com/ibmora0' },
    ],
  },
};

// ── Portfolio sections ────────────────────────────────────────────────────────
function HomeSection() {
  return (
    <div className="section-content hero-bg" style={{ backgroundImage: 'url(/frame1.png)' }}>
      <div className="hero-overlay" />
      <div className="hero-text">
        <h1 className="hero-title"><span className="star-prefix">★—</span>welcome!<br />kangkang's here</h1>
        <p className="hero-desc">"mabuhay! you can call me kangkang — a digital artist and web designer with budding skills and a growing portfolio. i'm eager to learn and take on new challenges! ⸜(｡˃ ᵕ ˂ )⸝♡"</p>
        <a href="/Issabela_Mora_Resume.pdf" download className="hero-profile-link">↓ Download Resume</a>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="section-content">
      <div className="about-cover-strip" />
      <p className="about-tagline">" digital artist · web designer · anime-inspired visuals "</p>
      <div className="about-block">
        <div className="about-block-title">short intro</div>
        <ul className="about-list">
          <li>pronouns: she/her</li>
          <li>nationality: Filipino 🇵🇭</li>
          <li>personality: introverted, and detail-oriented — I enjoy calm, and focused creative work</li>
        </ul>
      </div>
      <div className="about-block">
        <div className="about-block-title">what I do</div>
        <ul className="about-list">
          <li>character illustration</li>
          <li>UI/UX web design</li>
          <li>front-end web development</li>
        </ul>
      </div>
        <div className="about-block">
          <div className="about-block-title">currently</div>
          <ul className="about-list">
            <li>building & deploying my portfolio with React & Vercel</li>
            <li>learning and improving every day</li>
            <li>open for commissions & collaborations</li>
          </ul>
        </div>
    </div>
  );
}

function ServicesSection({ onPreview }) {
  const [activeService, setActiveService] = useState('digital artist');
  const svcData = SERVICE_DATA[activeService];

  return (
    <div className="section-content">
      <div className="services-hero" style={{ backgroundImage: 'url(/frame1.png)', backgroundSize: '120%', backgroundPosition: '90% center' }}>
        <div className="services-hero-placeholder"></div>
        <div className="services-hero-text">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="star-prefix">★—</span> welcome!<br />here's what I can do
          </h2>
        </div>
      </div>
      <div className="service-tabs">
        {Object.keys(SERVICE_DATA).map((key) => (
          <button key={key} className={`service-tab ${activeService === key ? 'active' : ''}`} onClick={() => setActiveService(key)}>{key}</button>
        ))}
      </div>
      <p className="service-quote">"{svcData.quote}"</p>

      {activeService === 'digital artist' ? (
        <div className="artwork-scroll">
          {svcData.projects.map((p, i) => (
            <div key={i} className="artwork-item" onClick={() => onPreview(`/${i + 1}.png`)}>
              <img src={`/${i + 1}.png`} alt={p.label} className="artwork-img" />
            </div>
          ))}
        </div>
        ) : (
          <div className="service-scroll">
            {svcData.projects.map((p, i) => (
              <div key={i} className="service-scroll-card">
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
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noreferrer" className="service-title-link">{p.title} ↗</a>
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

      <div className="tool-badge"><span>{svcData.toolIcon}</span><span>{svcData.tool}</span></div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="section-content">
      <h2 className="section-title"><span className="star-prefix">★—</span> get in touch with me!</h2>
      <p className="contact-intro">looking for a way to contact me? I've got you!</p>
      <div className="contact-group">
        <div className="contact-group-title">my work account</div>
            <div className="profile-contact-item contact-item">
              <span className="profile-contact-icon contact-icon">✉</span>
              <span>
                <a href="mailto:kangkangaroooooo@gmail.com">kangkangaroooooo@gmail.com</a>
                {' / '}
                <a href="mailto:ibmora00@gmail.com">ibmora00@gmail.com</a>
              </span>
            </div>
        <a href="https://www.facebook.com/profile.php?id=61590355995156" target="_blank" rel="noreferrer" className="contact-item"><span className="contact-icon">f</span><span>Issabela Mora</span></a>
        <a href="https://www.instagram.com/kangkangarooo?igsh=MWFudXM4d2p0NTIwZQ==" target="_blank" rel="noreferrer" className="contact-item"><span className="contact-icon">@</span><span>kangkangaroooooo</span></a>
      </div>
      <a href="/Issabela_Mora_Resume.pdf" download className="btn-gold" style={{ marginTop: '8px' }}>↓ Download Resume</a>
    </div>
  );
}

// ── Portfolio shell (browser frame) ──────────────────────────────────────────
const TABS = ['home', 'about me', 'services', 'get in touch'];
const TAB_URLS = {
  'home': '@kangkang/portfolio',
  'about me': '@kangkang/about',
  'services': '@kangkang/services',
  'get in touch': '@kangkang/contact',
};

function Portfolio({ onBack }) {
  const [activeTab, setActiveTab] = useState('home');
  const [lightbox, setLightbox] = useState(null);

  const renderSection = () => {
    switch (activeTab) {
      case 'home':         return <HomeSection />;
      case 'about me':     return <AboutSection />;
      case 'services':     return <ServicesSection onPreview={setLightbox} />;
      case 'get in touch': return <ContactSection />;
      default:             return <HomeSection />;
    }
  };

  return (
    <>
      {/* Lightbox is NOW outside the browser frame — no clipping! */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-card" onClick={e => e.stopPropagation()}>
            <div className="lightbox-card-bar">
              <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            </div>
            <img src={lightbox} alt="preview" className="lightbox-img" />
          </div>
        </div>
      )}

      <div className="page single">
        <div style={{ position: 'relative' }}>
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots">
                <span className="dot-red" />
                <span className="dot-yellow" />
                <span className="dot-green" />
              </div>
              <div className="browser-url">{TAB_URLS[activeTab]}</div>
              <button className="back-btn" onClick={onBack}>← back</button>
            </div>
            <div key={activeTab} className="tab-panel">{renderSection()}</div>
            <nav className="nav-tabs">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? (tab === 'get in touch' ? 'active active-gold' : 'active') : ''}>
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
function ProfileCard({ onViewPortfolio }) {
  return (
    <div className="profile-bg">
      <div className="profile-card">
        {/* Browser-style top bar */}
        <div className="profile-card-bar">
          <div className="browser-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <div className="profile-card-url">@kangkang/profile</div>
        </div>

        {/* Card body */}
        <div className="profile-card-body">

          {/* ── Cover photo ── */}
          <div className="profile-cover" />

          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              <img src="/kangkang.png" alt="Kangkang" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
          </div>

          {/* Name + title */}
          <h1 className="profile-name">KANGKANG</h1>
          <p className="profile-title">Digital Artist &nbsp;|&nbsp; Web Designer</p>

          {/* Contact row */}
          <div className="profile-contacts">
            <div className="profile-contact-item">
              <span className="profile-contact-icon">✉</span>
              <span>
                <a href="mailto:kangkangaroooooo@gmail.com">kangkangaroooooo@gmail.com</a>
                {' / '}
                <a href="mailto:ibmora00@gmail.com">ibmora00@gmail.com</a>
              </span>
            </div>
            <a href="https://instagram.com/kangkangaroooooo" target="_blank" rel="noreferrer" className="profile-contact-item">
              <span className="profile-contact-icon">@</span>
              <span>kangkangaroooooo</span>
            </a>
          </div>

          {/* Divider */}
          <div className="profile-divider">
            <span className="profile-divider-label">ABOUT</span>
          </div>

          {/* About box */}
          <div className="profile-about-box">
            <p>"Hey there! I go by Kangkang — an aspiring digital artist and web designer. I may not be a professional yet, but I pour my heart into every artwork, layout, and concept I bring to life. For me, every project is a chance to blend creativity with functionality and make something truly unique." ∧_∧</p>
          </div>

          {/* Skills */}
          <div className="profile-skills-row">
            <span className="profile-skills-label">SKILLS . .'</span>
            <div className="profile-skills-group">
              <span className="profile-skills-sublabel">technical</span>
              <div className="profile-skills">
                {['Figma', 'HTML', 'CSS', 'JavaScript', 'WIX', 'ibis Paint X',
                  'React.js', 'Vercel'
                ].map(s => (
                  <span key={s} className="profile-skill-tag">{s}</span>
                ))}
              </div>
            </div>
            <div className="profile-skills-group">
              <span className="profile-skills-sublabel">soft skills</span>
              <div className="profile-skills">
                {['Creative Thinking', 'Attention to Detail', 'Communication', 'Willingness to Learn'].map(s => (
                  <span key={s} className="profile-skill-tag profile-skill-tag--soft">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="profile-bottom-row">
            <div className="profile-bottom-deco" aria-hidden="true">
              <span className="deco-dot" />
              <span className="deco-star" style={{ fontSize: '0.85rem', position: 'static', animation: 'none' }}>★</span>
              <span className="deco-dot" />
              <span className="deco-star" style={{ fontSize: '0.85rem', position: 'static', animation: 'none' }}>★</span>
              <span className="deco-dot" />
            </div>
            <button className="profile-portfolio-btn" onClick={onViewPortfolio}>
              ┌ ✦ View My Portfolio ✦ ┐
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('profile'); // 'profile' | 'portfolio'

  return (
    <>
      {/* Floating stars + circles — always visible on every page */}
      <FloatingDeco />

      {view === 'portfolio'
        ? <Portfolio onBack={() => setView('profile')} />
        : <ProfileCard onViewPortfolio={() => setView('portfolio')} />
      }
    </>
  );
}