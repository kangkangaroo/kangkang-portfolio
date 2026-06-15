import { useState } from 'react';
import './index.css';

// ── Service data ──────────────────────────────────────────────────────────────
const SERVICE_DATA = {
  'digital artist': {
    quote: 'I use Procreate to bring my ideas to life with the help of my mobile phone!',
    tool: 'Procreate', toolIcon: '🎨',
    projects: [
      { emoji: '🧑‍🎨', label: 'Character Art' },
      { emoji: '🌸', label: 'Illustration' },
      { emoji: '✨', label: 'Digital Painting' },
    ],
  },
  'ui/ux designer': {
    quote: 'I use Figma to visualise and bring my ideas to life!',
    tool: 'Figma', toolIcon: '🔷',
    projects: [
      { title: 'your portfolio', sub: 'ui/ux design · figma prototype', emoji: '🗂️' },
      { title: 'profile card',   sub: 'ui/ux design · figma prototype', emoji: '🪪' },
    ],
  },
  'web developer': {
    quote: 'I use Visual Studio with html, css and basic javascript, and I also design and build websites on wix.',
    tool: 'VS Code + Wix', toolIcon: '💻',
    projects: [
      { title: '8more',       sub: 'coming soon page · link in bio', emoji: '🌐' },
      { title: 'coming soon', sub: 'coming soon page',               emoji: '🚧' },
    ],
  },
};

// ── Portfolio sections ────────────────────────────────────────────────────────
function HomeSection() {
  return (
    <div className="section-content hero-bg" style={{ backgroundImage: 'url(/frame1.png)' }}>
      <div className="hero-overlay" />
      <div className="hero-text">
        <div className="hero-caption">mabuhay! you can call me Kangkang, a UI/UX designer</div>
        <h1 className="hero-title"><span className="star-prefix">★—</span>welcome!<br />kangkang's here</h1>
        <p className="hero-desc">" a digital artist and web designer with a love for anime-inspired visuals and clean, functional designs. I'm eager to learn and take on new challenges! (ᴗ ˘ᴗ) ˘ˇ "</p>
        <a href="/resume.pdf" download className="hero-profile-link">↓ Download Résumé</a>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="section-content">
      <div className="about-avatar-row">
        <div className="about-avatar-circle">🧑‍🎨</div>
        <div className="about-name">kangkang</div>
      </div>
      <p className="about-tagline">" a digital artist and web designer with a love for anime-inspired visuals and clean, functional designs. "</p>
      <div className="about-block">
        <div className="about-block-title">short intro</div>
        <ul className="about-list">
          <li>pronouns: she/her</li>
          <li>nationality: Filipino</li>
          <li>personality: introverted, and detail-oriented — I enjoy calm, and focused creative work</li>
        </ul>
      </div>
      <div className="about-block">
        <div className="about-block-title">what I do</div>
        <ul className="about-list">
          <li>character illustration</li>
          <li>UI/UX web design — wireframing &amp; prototyping</li>
          <li>front-end web development</li>
        </ul>
      </div>
    </div>
  );
}

function ServicesSection() {
  const [activeService, setActiveService] = useState('ui/ux designer');
  const svcData = SERVICE_DATA[activeService];
  return (
    <div className="section-content">
      <div className="services-hero">
        <div className="services-hero-placeholder">🎨</div>
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
        <div className="project-grid-small">
          {svcData.projects.map((p, i) => (
            <div key={i} className="project-thumb">
              <span style={{ fontSize: '2rem' }}>{p.emoji}</span>
              <div className="project-thumb-label">{p.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="service-projects-grid">
          {svcData.projects.map((p, i) => (
            <div key={i} className="service-project-card">
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{p.emoji}</div>
              <h4>{p.title}</h4><p>{p.sub}</p>
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
        <div className="contact-group-title">main and personal account</div>
        <a href="mailto:kangkangaroooooo@gmail.com" className="contact-item"><span className="contact-icon">✉</span><span>kangkangaroooooo@gmail.com</span></a>
        <a href="https://facebook.com/kangkang" target="_blank" rel="noreferrer" className="contact-item"><span className="contact-icon">f</span><span>kang kang</span></a>
        <a href="https://instagram.com/kangkangaroo" target="_blank" rel="noreferrer" className="contact-item"><span className="contact-icon">◎</span><span>kangkangaroo</span></a>
      </div>
      <a href="/resume.pdf" download className="btn-gold" style={{ marginTop: '8px' }}>↓ Download Résumé</a>
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

  const renderSection = () => {
    switch (activeTab) {
      case 'home':         return <HomeSection />;
      case 'about me':     return <AboutSection />;
      case 'services':     return <ServicesSection />;
      case 'get in touch': return <ContactSection />;
      default:             return <HomeSection />;
    }
  };

  return (
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
  );
}

// ── Profile card (landing page) ───────────────────────────────────────────────
function ProfileCard({ onViewPortfolio }) {
  return (
    <div className="profile-bg">
      {/* Decorative stars — left */}
      <div className="profile-deco-stars" aria-hidden="true">
        <span className="deco-star deco-star--xl">★</span>
        <span className="deco-star deco-star--lg">★</span>
        <span className="deco-star deco-star--sm">★</span>
        <span className="deco-star deco-star--xs">★</span>
      </div>
      {/* Decorative circles — right */}
      <div className="profile-deco-right" aria-hidden="true">
        <span className="deco-circle deco-circle--md" />
        <span className="deco-circle deco-circle--lg" />
        <span className="deco-circle deco-circle--sm" />
      </div>

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
          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              <img src="/kangkang.jpg" alt="Kangkang" style={{width: '100%', height: '100%', objectFit: 'cover',borderRadius: '50%' }} />
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
                  'XAMMP', 'My SQL Workbench', 'Microsoft Office', 'Google Workspace'
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

  if (view === 'portfolio') return <Portfolio onBack={() => setView('profile')} />;
  return <ProfileCard onViewPortfolio={() => setView('portfolio')} />;
}