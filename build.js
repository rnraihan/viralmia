const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const DIST_DIR = path.join(__dirname, 'dist');
const SITE_URL = 'https://viralmia.me';
const SITE_NAME = 'Viral Mia Kitchen';
const SITE_TAGLINE = 'Quick 15-Minute Meals & Smart US Kitchen Hacks';
const SITE_DESC = 'Tested 15-minute weeknight dinners, viral air fryer favorites, cozy comfort food, and money-saving kitchen hacks made with everyday US grocery staples.';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function parseMinutes(timeStr) {
  if (!timeStr) return 0;
  const s = String(timeStr).toLowerCase();
  let total = 0;
  const hrMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:hr|hour)/);
  const minMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:min|m\b)/);
  if (hrMatch) total += Math.round(parseFloat(hrMatch[1]) * 60);
  if (minMatch) total += Math.round(parseFloat(minMatch[1]));
  if (!hrMatch && !minMatch) {
    const num = s.match(/(\d+)/);
    if (num) total = parseInt(num[1], 10);
  }
  return total;
}

function formatTotalTime(minutes) {
  const m = Math.max(1, Math.round(minutes || 15));
  const hrs = Math.floor(m / 60);
  const rem = m % 60;
  if (hrs > 0 && rem > 0) return `${hrs} hr ${rem} min`;
  if (hrs > 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  return `${rem} mins`;
}

function toIsoDuration(minutes) {
  const m = Math.max(0, Math.round(minutes || 0));
  const hrs = Math.floor(m / 60);
  const rem = m % 60;
  if (hrs > 0 && rem > 0) return `PT${hrs}H${rem}M`;
  if (hrs > 0) return `PT${hrs}H`;
  return `PT${rem}M`;
}

function formatUsDate(dateStr) {
  if (!dateStr) return 'Recently Updated';
  const d = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function deterministicReviewCount(slug) {
  let hash = 0;
  const str = String(slug || 'recipe');
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 38 + (Math.abs(hash) % 29);
}

function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'));
  const posts = files.map(file => {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const post = JSON.parse(content);
      post.slug = slugify(post.slug || file.replace(/\.json$/i, ''));
      post.rating = post.rating || '4.9';
      post.reviewCount = post.reviewCount || deterministicReviewCount(post.slug);
      post.prepMinutes = parseMinutes(post.prepTime) || 5;
      post.cookMinutes = parseMinutes(post.cookTime);
      post.totalMinutes = post.prepMinutes + post.cookMinutes;
      post.nutrition = post.nutrition || {
        calories: post.calories || '380 kcal',
        protein: '24g',
        carbs: '42g',
        fat: '14g',
        fiber: '4g'
      };
      return post;
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
      return null;
    }
  }).filter(Boolean);

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// EDITORIAL LUXURY US FOOD PUBLICATION CSS
const GLOBAL_CSS = `
:root {
  --primary: #c83e26;
  --primary-dark: #a32e1a;
  --primary-light: #fdf0ed;
  --primary-glow: rgba(200, 62, 38, 0.22);
  --sage: #245d4a;
  --sage-light: #eaf4f0;
  --gold: #d97706;
  --gold-soft: #fef3c7;
  --bg: #fbf8f3;
  --bg-warm: #f4eee4;
  --card: #ffffff;
  --ink: #171a18;
  --text: #272c29;
  --text-muted: #5c645f;
  --border: #e6dfd4;
  --border-light: #f1ebe1;
  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --shadow-xs: 0 2px 8px rgba(23, 26, 24, 0.04);
  --shadow-sm: 0 6px 20px rgba(23, 26, 24, 0.05);
  --shadow-md: 0 14px 40px rgba(23, 26, 24, 0.08);
  --shadow-hover: 0 22px 50px rgba(23, 26, 24, 0.13);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4, .font-serif {
  font-family: 'Playfair Display', Georgia, serif;
  color: var(--ink);
  line-height: 1.2;
}

a { color: inherit; text-decoration: none; transition: color 0.2s ease, transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease; }
img { max-width: 100%; height: auto; display: block; }
button { font-family: inherit; }

/* Top Reading Progress Bar */
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3.5px;
  background: linear-gradient(90deg, #f59e0b, #c83e26);
  width: 0%;
  z-index: 9999;
  transition: width 0.08s linear;
}

/* Editorial Top Announcement Bar */
.top-bar {
  background: #141816;
  color: #f3f4f6;
  font-size: 12.5px;
  font-weight: 600;
  padding: 9px 16px;
  text-align: center;
  letter-spacing: 0.4px;
}
.top-bar .tb-accent { color: #fbbf24; margin-right: 6px; font-weight: 800; }
.top-bar a { color: #ffffff; text-decoration: underline; text-underline-offset: 3px; font-weight: 700; }
.top-bar a:hover { color: #fbbf24; }

/* Sticky Glass Editorial Navbar */
.navbar {
  background: rgba(251, 248, 243, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 300;
}
.nav-container {
  max-width: 1260px;
  margin: 0 auto;
  padding: 13px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.logo-group { display: flex; flex-direction: column; }
.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 30px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.6px;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.logo span { color: var(--ink); font-weight: 400; font-style: italic; }
.logo-tagline {
  font-size: 10px;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 2px;
  font-weight: 700;
  margin-top: -2px;
}
.nav-links {
  display: flex;
  gap: 26px;
  align-items: center;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
}
.nav-links a {
  position: relative;
  padding: 4px 0;
}
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--primary);
  transition: width 0.25s var(--ease-smooth);
}
.nav-links a:hover::after { width: 100%; }
.nav-links a:hover { color: var(--primary); }

.nav-cta {
  background: var(--ink);
  color: #fff !important;
  padding: 10px 20px !important;
  border-radius: 50px;
  font-size: 13.5px;
  font-weight: 700;
  box-shadow: var(--shadow-xs);
}
.nav-cta::after { display: none !important; }
.nav-cta:hover {
  background: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(200, 62, 38, 0.3);
}

.mobile-menu-btn {
  display: none;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--ink);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.mobile-menu-btn:hover { border-color: var(--primary); color: var(--primary); }

/* EDITORIAL CINEMATIC HERO */
.hero-wrapper {
  position: relative;
  background-color: #121614;
  padding: 78px 24px 68px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
  pointer-events: none;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(16, 20, 18, 0.72) 0%, rgba(16, 20, 18, 0.88) 100%);
  z-index: 1;
  pointer-events: none;
}
.floating-particle {
  position: absolute;
  font-size: 30px;
  opacity: 0.45;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.45));
  pointer-events: none;
  animation: floatParticle 9s infinite ease-in-out alternate;
  z-index: 2;
  will-change: transform;
  transform: translateZ(0);
}
.fp-1 { top: 14%; left: 5%; animation-duration: 9s; }
.fp-2 { top: 18%; right: 6%; animation-duration: 8s; font-size: 34px; }
.fp-3 { bottom: 18%; left: 7%; animation-duration: 11s; }
.fp-4 { bottom: 20%; right: 8%; animation-duration: 10s; }

@keyframes floatParticle {
  0% { transform: translateY(0) rotate(0deg) translateZ(0); }
  50% { transform: translateY(-14px) rotate(6deg) translateZ(0); }
  100% { transform: translateY(10px) rotate(-5deg) translateZ(0); }
}

.hero {
  text-align: center;
  max-width: 880px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fde68a;
  font-size: 12px;
  font-weight: 800;
  padding: 8px 20px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  margin-bottom: 22px;
  border: 1px solid rgba(255, 255, 255, 0.22);
}
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
  animation: pulseGreen 2.2s infinite;
}
@keyframes pulseGreen {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 9px rgba(52, 211, 153, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
}

.hero h1 {
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 18px;
  letter-spacing: -1px;
  line-height: 1.12;
  color: #ffffff;
  text-shadow: 0 3px 20px rgba(0, 0, 0, 0.42);
}
.hero p {
  font-size: 19px;
  color: #e5e7eb;
  max-width: 700px;
  margin: 0 auto 30px;
  line-height: 1.65;
}

/* Search Bar */
.search-wrapper {
  max-width: 640px;
  margin: 0 auto 24px;
  position: relative;
}
.search-input {
  width: 100%;
  padding: 18px 24px 18px 56px;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.97);
  font-size: 15.5px;
  font-family: inherit;
  color: var(--ink);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  outline: none;
  transition: all 0.25s var(--ease-smooth);
}
.search-input:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 5px var(--primary-glow), 0 14px 36px rgba(0, 0, 0, 0.35);
}
.search-icon {
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  pointer-events: none;
}

.hero-highlights {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.highlight-pill {
  font-size: 12.5px;
  font-weight: 700;
  color: #f9fafb;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 50px;
  backdrop-filter: blur(8px);
}

/* US Kitchen Trust Strip */
.trust-strip {
  background: var(--bg-warm);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
}
.trust-strip-inner {
  max-width: 1260px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
}
.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.trust-item strong { color: var(--ink); }

/* FEATURED MAGAZINE SPOTLIGHT (HOMEPAGE) */
.featured-section {
  max-width: 1260px;
  margin: 48px auto 12px;
  padding: 0 24px;
}
.featured-card {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.35s var(--ease-smooth), box-shadow 0.35s var(--ease-smooth);
}
.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
.featured-img-wrap {
  position: relative;
  min-height: 390px;
  overflow: hidden;
  background: #ece5da;
}
.featured-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-smooth);
}
.featured-card:hover .featured-img-wrap img { transform: scale(1.04); }
.featured-ribbon {
  position: absolute;
  top: 20px;
  left: 20px;
  background: var(--ink);
  color: #fde68a;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  padding: 7px 15px;
  border-radius: 50px;
}
.featured-body {
  padding: 42px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.featured-kicker {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: var(--primary);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.featured-title {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.18;
  margin-bottom: 16px;
}
.featured-title a:hover { color: var(--primary); }
.featured-desc {
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.75;
  margin-bottom: 24px;
}
.featured-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 28px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}
.featured-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  background: var(--primary);
  color: #fff;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 14.5px;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(200, 62, 38, 0.28);
}
.featured-cta:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

/* Editorial Filter & Sort Controls */
.catalog-controls {
  max-width: 1260px;
  margin: 42px auto 24px;
  padding: 0 24px;
}
.catalog-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.catalog-title-group h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 4px;
}
.catalog-count {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 600;
}
.sort-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.sort-btn {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.sort-btn:hover, .sort-btn.active {
  background: var(--ink);
  color: #ffffff;
  border-color: var(--ink);
}
.sort-btn.saved-toggle.active {
  background: #e11d48;
  border-color: #e11d48;
  color: #ffffff;
}

/* Category Pills Bar */
.categories-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.cat-btn {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.25s var(--ease-smooth);
}
.cat-btn:hover, .cat-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(200, 62, 38, 0.22);
}

/* Recipe Cards Grid */
.posts-grid {
  max-width: 1260px;
  margin: 28px auto 84px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.post-card {
  background: var(--card);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  transition: transform 0.35s var(--ease-smooth), box-shadow 0.35s var(--ease-smooth), border-color 0.25s;
  display: flex;
  flex-direction: column;
  position: relative;
}
.post-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(200, 62, 38, 0.35);
}
.card-img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 11;
  background: #ede6dc;
}
.post-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s var(--ease-smooth);
}
.post-card:hover .post-card-img { transform: scale(1.06); }

.card-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.96);
  color: var(--primary);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 50px;
  letter-spacing: 0.6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.card-time-pill {
  position: absolute;
  bottom: 12px;
  left: 14px;
  background: rgba(20, 24, 22, 0.84);
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 50px;
  backdrop-filter: blur(6px);
}
.card-heart-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s var(--ease-spring);
}
.card-heart-btn:hover { transform: scale(1.16); }

.post-card-body {
  padding: 24px 24px 22px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.card-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: var(--text-muted);
  margin-bottom: 10px;
  font-weight: 600;
}
.card-rating {
  color: var(--gold);
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.card-rating span { color: var(--text-muted); font-weight: 600; font-size: 12px; }
.post-card-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.3;
}
.post-card:hover .post-card-title { color: var(--primary); }
.post-card-desc {
  font-size: 14.5px;
  color: var(--text-muted);
  margin-bottom: 20px;
  flex: 1;
  line-height: 1.65;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-light);
  padding-top: 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
}
.card-footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 12.5px;
}
.view-btn-arrow {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: transform 0.2s ease;
}
.post-card:hover .view-btn-arrow { transform: translateX(4px); }

/* Empty Search / Favorites State */
.search-empty-state {
  max-width: 600px;
  margin: 0 auto 80px;
  padding: 44px 28px;
  text-align: center;
  background: var(--card);
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
  color: var(--text-muted);
}
.search-empty-state h3 { font-size: 24px; margin-bottom: 8px; }

/* Newsletter Banner */
.newsletter-banner {
  background-image:
    linear-gradient(135deg, rgba(20, 25, 23, 0.93) 0%, rgba(36, 93, 74, 0.88) 100%),
    url('https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
  max-width: 1212px;
  margin: 40px auto 90px;
  padding: 58px 32px;
  text-align: center;
  color: #fff;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}
.newsletter-kicker {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #fde68a;
  margin-bottom: 12px;
}
.newsletter-banner h2 {
  color: #fff;
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 14px;
}
.newsletter-banner p {
  color: #e5e7eb;
  font-size: 17px;
  max-width: 600px;
  margin: 0 auto 28px;
}
.newsletter-form {
  display: flex;
  justify-content: center;
  gap: 10px;
  max-width: 520px;
  margin: 0 auto;
  flex-wrap: wrap;
}
.newsletter-input {
  flex: 1;
  min-width: 240px;
  padding: 15px 22px;
  border-radius: 50px;
  border: none;
  font-size: 15px;
  outline: none;
}
.newsletter-btn {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 14.5px;
  cursor: pointer;
  transition: all 0.25s var(--ease-smooth);
}
.newsletter-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

/* ARTICLE / RECIPE VIEW */
.article-wrap {
  max-width: 880px;
  margin: 34px auto 90px;
  padding: 0 24px;
}
.breadcrumbs {
  font-size: 13.5px;
  color: var(--text-muted);
  margin-bottom: 24px;
  font-weight: 600;
}
.breadcrumbs a:hover { color: var(--primary); text-decoration: underline; }
.article-header { text-align: center; margin-bottom: 30px; }
.article-header .hero-tag {
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid rgba(200, 62, 38, 0.2);
  box-shadow: none;
  margin-bottom: 16px;
}
.article-header h1 {
  font-size: 46px;
  font-weight: 800;
  margin: 0 0 16px;
  letter-spacing: -0.7px;
  line-height: 1.15;
}
.article-dek {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 700px;
  margin: 0 auto 22px;
  line-height: 1.65;
}
.article-byline {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  font-size: 13.5px;
  color: var(--text-muted);
  margin-bottom: 26px;
  flex-wrap: wrap;
}
.article-byline strong { color: var(--ink); }
.byline-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-light);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--card);
  border: 1px solid var(--border);
  padding: 11px 22px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 13.5px;
  color: var(--ink);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
}
.btn-action:hover {
  background: var(--ink);
  color: #fff;
  border-color: var(--ink);
  transform: translateY(-2px);
}
.btn-primary-action {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.btn-primary-action:hover { background: var(--primary-dark); border-color: var(--primary-dark); }

.article-hero {
  width: 100%;
  aspect-ratio: 16 / 10;
  max-height: 540px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  margin-bottom: 38px;
  box-shadow: var(--shadow-md);
}

/* Editorial Kitchen Diary */
.diary-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-left: 5px solid var(--primary);
  padding: 30px 34px;
  border-radius: var(--radius-md);
  margin: 34px 0 42px;
  box-shadow: var(--shadow-sm);
}
.diary-badge {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.diary-text { font-size: 17.5px; color: var(--text); line-height: 1.85; }

/* Official Editorial Recipe Card */
.recipe-card-box {
  background: var(--card);
  border: 1px solid var(--border);
  border-top: 6px solid var(--primary);
  border-radius: var(--radius-lg);
  padding: 42px;
  margin: 44px 0;
  box-shadow: var(--shadow-md);
}
.recipe-card-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 24px;
  margin-bottom: 26px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}
.recipe-card-header h2 { font-size: 32px; margin-bottom: 8px; font-weight: 800; }
.recipe-card-desc { font-size: 15.5px; color: var(--text-muted); max-width: 620px; }

/* Action Toolbar */
.recipe-action-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border-light);
}
.tool-btn {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--ink);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s ease;
}
.tool-btn:hover {
  background: #fff;
  border-color: var(--primary);
  color: var(--primary);
}
.tool-btn.active {
  background: var(--sage-light);
  border-color: var(--sage);
  color: var(--sage);
}

/* Recipe Stats Bar */
.recipe-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  background: var(--bg);
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  margin-bottom: 34px;
  text-align: center;
}
.stat-box { display: flex; flex-direction: column; }
.stat-label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.7px; }
.stat-val { font-size: 18px; font-weight: 800; color: var(--ink); margin-top: 4px; }

/* Ingredients + Interactive 1x/2x/3x Serving Scaler */
.ingredients-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}
.ingredients-sec h3, .steps-sec h3 {
  font-size: 25px;
  font-weight: 800;
}
.scaler-group {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 4px;
  border-radius: 50px;
}
.scaler-label {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  padding: 0 8px 0 10px;
}
.scale-btn {
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 12.5px;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 50px;
  cursor: pointer;
}
.scale-btn.active {
  background: var(--primary);
  color: #ffffff;
}

.ingredients-list { list-style: none; margin-bottom: 38px; }
.ing-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s ease, opacity 0.2s ease;
  font-size: 16.5px;
  border-bottom: 1px solid var(--border-light);
}
.ing-item:hover { background: var(--bg); }
.ing-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
  margin-top: 3px;
  cursor: pointer;
  flex-shrink: 0;
}
.ing-item label { cursor: pointer; flex: 1; }
.ing-item.checked {
  text-decoration: line-through;
  opacity: 0.48;
  background: #f5f3ef;
}

/* Interactive Step-by-Step Instructions */
.steps-sec { margin-bottom: 36px; }
.steps-sec h3 { margin-bottom: 18px; }
.steps-list { list-style: none; counter-reset: cooking-step; }
.step-row {
  position: relative;
  padding: 12px 16px 12px 62px;
  margin-bottom: 18px;
  font-size: 16.5px;
  line-height: 1.82;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}
.step-row:hover { background: var(--bg); }
.step-row::before {
  counter-increment: cooking-step;
  content: counter(cooking-step);
  position: absolute;
  left: 8px;
  top: 12px;
  width: 38px;
  height: 38px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  box-shadow: 0 4px 10px rgba(200, 62, 38, 0.25);
}
.step-row.step-done {
  opacity: 0.52;
  background: var(--sage-light);
}
.step-row.step-done::before {
  content: '✓';
  background: var(--sage);
}

/* Mia's Pro Hack Box */
.hack-banner {
  background: linear-gradient(135deg, #edf7f3 0%, #e1f0ea 100%);
  border: 1px solid #b8dfd0;
  border-left: 5px solid var(--sage);
  border-radius: var(--radius-md);
  padding: 24px 28px;
  margin: 34px 0;
}
.hack-banner-title {
  font-size: 19px;
  font-weight: 800;
  color: var(--sage);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hack-banner p { font-size: 15.5px; color: #1b4335; margin: 0; line-height: 1.75; }

/* Nutrition Table */
.nutrition-card {
  background: var(--bg);
  border-radius: var(--radius-md);
  padding: 24px;
  margin: 34px 0 0;
  border: 1px solid var(--border);
}
.nutrition-card h4 {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
  color: var(--text-muted);
}
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  text-align: center;
}
.nutri-box {
  background: #fff;
  padding: 13px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
}
.nutri-num { font-size: 18px; font-weight: 800; color: var(--ink); }
.nutri-label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-top: 2px; }

/* Interactive Star Rating Box */
.rate-recipe-box {
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px dashed var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}
.rate-recipe-box p { font-size: 14.5px; font-weight: 700; color: var(--ink); }
.star-picker { display: inline-flex; gap: 4px; }
.star-btn {
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  color: #d1d5db;
  transition: transform 0.15s ease, color 0.15s ease;
}
.star-btn.lit, .star-btn:hover { color: var(--gold); transform: scale(1.15); }

/* FAQ Accordion */
.faq-wrap { margin: 44px 0; }
.faq-wrap h3 { font-size: 28px; font-weight: 800; margin-bottom: 18px; }
.faq-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.faq-card:hover { border-color: var(--primary); }
.faq-header {
  padding: 18px 22px;
  font-weight: 800;
  font-size: 16.5px;
  color: var(--ink);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  user-select: none;
}
.faq-icon { font-size: 20px; transition: transform 0.25s ease; flex-shrink: 0; }
.faq-card.open .faq-icon { transform: rotate(45deg); color: var(--primary); }
.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s var(--ease-smooth), padding 0.35s ease;
  padding: 0 22px;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.75;
}
.faq-card.open .faq-body {
  max-height: 1200px;
  padding: 0 22px 20px;
}

/* Author Bio Card */
.author-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
  margin: 46px 0;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: var(--shadow-sm);
}
.author-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-light);
  flex-shrink: 0;
}
.author-info h4 { font-size: 21px; font-weight: 800; margin-bottom: 6px; }
.author-info p { font-size: 15px; color: var(--text-muted); line-height: 1.65; }

/* Social Share Bar */
.social-share {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 22px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin: 34px 0;
  flex-wrap: wrap;
}
.share-label { font-size: 12.5px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; }
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.share-pinterest { background: #e60023; }
.share-facebook { background: #1877f2; }
.share-twitter { background: #111827; }
.share-btn:hover { opacity: 0.92; transform: translateY(-2px); }

/* Related Recipes */
.related-recipes-wrap {
  margin-top: 52px;
  padding-top: 38px;
  border-top: 1px solid var(--border);
}
.sec-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  gap: 12px;
}
.sec-title-row h3 { font-size: 26px; font-weight: 800; }
.view-all-link { font-size: 14px; font-weight: 700; color: var(--primary); }
.view-all-link:hover { text-decoration: underline; }
.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Floating Back To Top Button */
.back-to-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 48px;
  height: 48px;
  background: var(--ink);
  color: #fff;
  border-radius: 50%;
  border: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s var(--ease-smooth);
  z-index: 500;
}
.back-to-top.show { opacity: 1; visibility: visible; }
.back-to-top:hover { background: var(--primary); transform: translateY(-3px); }

/* Toast Notification */
.toast-msg {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--ink);
  color: #fff;
  padding: 13px 26px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
  opacity: 0;
  transition: all 0.35s var(--ease-spring);
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 9px;
}
.toast-msg.show { transform: translateX(-50%) translateY(0); opacity: 1; }

/* Scroll Reveal */
.reveal-on-scroll { opacity: 1; transform: none; }
@media (prefers-reduced-motion: no-preference) {
  .js-ready .reveal-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s var(--ease-smooth), transform 0.55s var(--ease-smooth);
  }
  .js-ready .reveal-on-scroll.revealed {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Footer */
.footer {
  background: #141816;
  color: #9ca3af;
  padding: 72px 24px 34px;
  margin-top: 84px;
}
.footer-wrap {
  max-width: 1260px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 44px;
  border-bottom: 1px solid #262c29;
}
.footer-brand h3 { color: #fff; font-size: 26px; margin-bottom: 12px; }
.footer-col h4 { color: #fff; font-size: 14.5px; margin-bottom: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 11px; font-size: 14.5px; }
.footer-col a:hover { color: #fbbf24; }
.footer-bottom {
  max-width: 1260px;
  margin: 28px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13.5px;
}

/* Print Friendly */
@media print {
  .top-bar, .navbar, .action-buttons, .recipe-action-toolbar, .scaler-group, .rate-recipe-box, .social-share, .author-card, .related-recipes-wrap, .footer, .back-to-top, .toast-msg, .newsletter-banner {
    display: none !important;
  }
  body, .article-wrap, .recipe-card-box {
    background: #fff !important;
    color: #000 !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
}

/* Tablet & Mobile Responsive */
@media (max-width: 1024px) {
  .posts-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .featured-card { grid-template-columns: 1fr; }
  .featured-img-wrap { min-height: 280px; }
  .featured-body { padding: 30px 26px; }
  .footer-wrap { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .hero-wrapper { padding: 44px 18px 36px; }
  .hero h1 { font-size: 33px; }
  .hero p { font-size: 15.5px; }
  .floating-particle { display: none; }
  .trust-strip-inner { justify-content: center; text-align: center; gap: 10px; font-size: 12px; }
  .featured-title { font-size: 26px; }
  .catalog-title-group h2 { font-size: 25px; }
  .posts-grid { grid-template-columns: 1fr; gap: 22px; }
  .article-header h1 { font-size: 30px; }
  .article-dek { font-size: 16px; }
  .recipe-card-box { padding: 24px 18px; }
  .recipe-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .nutrition-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .author-card { flex-direction: column; text-align: center; }
  .footer-wrap { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
  .newsletter-banner { padding: 36px 20px; margin: 32px 16px 60px; }
  .newsletter-banner h2 { font-size: 26px; }
  .related-grid { grid-template-columns: 1fr; gap: 18px; }
  .tool-btn { flex: 1 1 auto; justify-content: center; }

  .mobile-menu-btn { display: inline-flex; }
  .nav-container { position: relative; }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 16px 24px 22px;
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    z-index: 400;
  }
  .nav-links.open { display: flex; }
  .nav-links a { padding: 11px 4px; border-bottom: 1px solid var(--border-light); }
  .nav-links a.nav-cta { text-align: center; margin-top: 10px; border-bottom: none; padding: 12px 20px !important; }
}
`;

// HTML Shell Template
function layout(title, content, meta = {}) {
  const safeTitle = escapeAttr(title);
  const metaDesc = escapeAttr(meta.description || SITE_DESC);
  const canonical = escapeAttr(meta.canonical || SITE_URL);
  const ogImage = escapeAttr(meta.image || DEFAULT_OG_IMAGE);
  const ogImageAlt = escapeAttr(meta.imageAlt || title);
  const schemas = meta.schemas || [];
  const schemasHtml = schemas.map(s => `<script type="application/ld+json">${safeJsonLd(s)}</script>`).join('\n  ');

  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} | ${SITE_NAME}</title>

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-DWE4LNEEMC"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-DWE4LNEEMC');
  </script>

  <!-- Verification & Core SEO -->
  <meta name="msvalidate.01" content="10C2D4086B957B65F94D90B4447965A6">
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en-US" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} RSS Feed" href="${SITE_URL}/feed.xml">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="author" content="Mia">
  <meta name="theme-color" content="#c83e26">

  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍳</text></svg>">
  <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍳</text></svg>">

  <!-- OpenGraph & Pinterest Rich Pins -->
  <meta property="og:type" content="${meta.type || 'website'}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${safeTitle} | ${SITE_NAME}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="800">
  <meta property="og:image:alt" content="${ogImageAlt}">
  <meta property="og:locale" content="en_US">
  ${meta.publishedTime ? `<meta property="article:published_time" content="${escapeAttr(meta.publishedTime)}">` : ''}
  ${meta.section ? `<meta property="article:section" content="${escapeAttr(meta.section)}">` : ''}

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle} | ${SITE_NAME}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- Performance Preconnect & Hero Preload -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link rel="preconnect" href="https://images.pexels.com">
  <link rel="preconnect" href="https://www.themealdb.com">
  <link rel="dns-prefetch" href="https://images.unsplash.com">
  <link rel="dns-prefetch" href="https://images.pexels.com">
  <link rel="dns-prefetch" href="https://www.themealdb.com">
  ${meta.preloadImage ? `<link rel="preload" as="image" href="${escapeAttr(meta.preloadImage)}" fetchpriority="high">` : ''}
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>${GLOBAL_CSS}</style>
  ${schemasHtml}
</head>
<body>

  <!-- Top Reading Progress -->
  <div class="scroll-progress-bar" id="progressBar"></div>

  <!-- Editorial Top Bar -->
  <aside class="top-bar">
    <span class="tb-accent">✨ FRESH DAILY FOR US KITCHENS</span> Tested 15-Minute Dinners &amp; Money-Saving Hacks • <a href="/#recipes">Browse Today's Recipes &rarr;</a>
  </aside>

  <!-- Navigation -->
  <header class="navbar">
    <div class="nav-container">
      <div class="logo-group">
        <a href="/" class="logo">ViralMia <span>Kitchen</span></a>
        <span class="logo-tagline">Fast • Cozy • Everyday US Cooking</span>
      </div>
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle navigation menu" aria-expanded="false">☰</button>
      <nav class="nav-links" id="navLinks">
        <a href="/">Home</a>
        <a href="/category/quick-dinners">Quick Dinners</a>
        <a href="/category/air-fryer-meals">Air Fryer</a>
        <a href="/category/comfort-food">Comfort Food</a>
        <a href="/category/kitchen-hacks">Kitchen Hacks</a>
        <a href="/about">About Mia</a>
        <a href="/contact" class="nav-cta">Say Hello 👋</a>
      </nav>
    </div>
  </header>

  ${content}

  <!-- Floating Back to Top Button -->
  <button class="back-to-top" id="backToTop" aria-label="Back to Top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">↑</button>

  <!-- Toast Notification -->
  <div class="toast-msg" id="toastMsg"><span>✨</span> <span id="toastText">Action completed!</span></div>

  <!-- Editorial Footer -->
  <footer class="footer">
    <div class="footer-wrap">
      <div class="footer-brand">
        <h3>ViralMia Kitchen</h3>
        <p>Real-life tested 15-minute dinners, budget comfort food, and smart kitchen hacks made with everyday US grocery staples—built for busy weeknights and minimal dishes.</p>
        <p style="margin-top: 14px; font-size: 13px; color: #6b7280;">Tested with love in Mia's apartment kitchen. ❤️</p>
      </div>
      <div class="footer-col">
        <h4>Popular Categories</h4>
        <ul>
          <li><a href="/category/quick-dinners">🍝 15-Minute Dinners</a></li>
          <li><a href="/category/air-fryer-meals">🍗 Air Fryer Favorites</a></li>
          <li><a href="/category/comfort-food">🥣 Cozy Comfort Food</a></li>
          <li><a href="/category/kitchen-hacks">💡 Smart Kitchen Hacks</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>More Collections</h4>
        <ul>
          <li><a href="/category/breakfast-brunch">🥞 Breakfast &amp; Brunch</a></li>
          <li><a href="/category/snacks-sides">🥨 Snacks &amp; Sides</a></li>
          <li><a href="/category/desserts-sweets">🍰 Easy Desserts</a></li>
          <li><a href="/feed.xml">📡 RSS Recipe Feed</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>About &amp; Legal</h4>
        <ul>
          <li><a href="/about">About Mia</a></li>
          <li><a href="/contact">Contact &amp; Press</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/sitemap.xml">XML Sitemap</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} ViralMia.me. All rights reserved.</p>
      <p>Made for everyday home cooks across the United States.</p>
    </div>
  </footer>

  <!-- Interactive Editorial JS (Zero External Dependencies, Passive rAF Scroll for 0ms INP) -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // 0. Mobile Navigation Toggle
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const navLinks = document.getElementById('navLinks');
      if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
          const isOpen = navLinks.classList.toggle('open');
          mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
        });
      }

      // 1. Scroll Progress Bar & Back To Top (Throttled with rAF + passive)
      const progressBar = document.getElementById('progressBar');
      const backToTop = document.getElementById('backToTop');
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const winScroll = window.scrollY || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height > 0 && progressBar) {
              progressBar.style.width = ((winScroll / height) * 100) + '%';
            }
            if (backToTop) {
              if (winScroll > 400) backToTop.classList.add('show');
              else backToTop.classList.remove('show');
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      // 2. Intersection Observer Scroll Reveal
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if ('IntersectionObserver' in window) {
        document.documentElement.classList.add('js-ready');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.05, rootMargin: '0px 0px 40px 0px' });
        revealElements.forEach(el => observer.observe(el));
      }

      // 3. Persistent Saved Favorites (localStorage)
      const FAV_KEY = 'viralmia_favorites';
      const getFavs = () => {
        try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
      };
      const saveFavs = (arr) => {
        try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch {}
      };
      const updateSavedCountUI = () => {
        const badge = document.getElementById('savedCountBadge');
        if (badge) badge.textContent = String(getFavs().length);
      };

      const heartBtns = document.querySelectorAll('.card-heart-btn');
      const initialFavs = getFavs();
      heartBtns.forEach(btn => {
        const slug = btn.getAttribute('data-slug');
        if (slug && initialFavs.includes(slug)) {
          btn.classList.add('liked');
          btn.textContent = '❤️';
        }
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          let favs = getFavs();
          const isLiked = btn.classList.toggle('liked');
          if (isLiked) {
            btn.textContent = '❤️';
            if (slug && !favs.includes(slug)) favs.push(slug);
            showToast('Saved to your recipe box! ❤️');
          } else {
            btn.textContent = '🤍';
            if (slug) favs = favs.filter(s => s !== slug);
            showToast('Removed from saved recipes');
          }
          saveFavs(favs);
          updateSavedCountUI();
          if (window._applyGridFilters) window._applyGridFilters();
        });
      });
      updateSavedCountUI();

      // 4. Live Search, Quick Sort & Saved Filter (with ?q= URL Support)
      const searchInput = document.getElementById('recipe-search');
      const searchEmpty = document.getElementById('search-empty');
      const recipesGrid = document.getElementById('recipes');
      const sortBtns = document.querySelectorAll('.sort-btn');
      let activeSort = 'newest';

      if (recipesGrid) {
        const applyGridFilters = () => {
          const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
          const cards = Array.from(recipesGrid.querySelectorAll('.post-card'));
          const favs = getFavs();

          // Sort cards first
          if (activeSort === 'fastest') {
            cards.sort((a, b) => Number(a.dataset.time || 999) - Number(b.dataset.time || 999));
          } else if (activeSort === 'rating') {
            cards.sort((a, b) => Number(b.dataset.rating || 0) - Number(a.dataset.rating || 0));
          } else {
            cards.sort((a, b) => Number(a.dataset.index || 0) - Number(b.dataset.index || 0));
          }
          cards.forEach(c => recipesGrid.appendChild(c));

          let visibleCount = 0;
          cards.forEach(card => {
            const title = card.querySelector('.post-card-title').textContent.toLowerCase();
            const desc = card.querySelector('.post-card-desc').textContent.toLowerCase();
            const cat = card.querySelector('.card-badge').textContent.toLowerCase();
            const slug = card.dataset.slug || '';
            const matchesQuery = !query || title.includes(query) || desc.includes(query) || cat.includes(query);
            const matchesSaved = activeSort !== 'saved' || favs.includes(slug);

            if (matchesQuery && matchesSaved) {
              card.style.display = 'flex';
              visibleCount++;
            } else {
              card.style.display = 'none';
            }
          });
          if (searchEmpty) {
            searchEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
          }
        };

        window._applyGridFilters = applyGridFilters;

        sortBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSort = btn.dataset.sort || 'newest';
            applyGridFilters();
          });
        });

        if (searchInput) {
          searchInput.addEventListener('input', applyGridFilters);
          const initialQuery = new URLSearchParams(window.location.search).get('q');
          if (initialQuery) {
            searchInput.value = initialQuery;
            applyGridFilters();
          }
        }
      }

      // 5. Ingredient Checkboxes with Strikethrough
      document.querySelectorAll('.ing-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.addEventListener('change', () => {
            item.classList.toggle('checked', checkbox.checked);
          });
        }
      });

      // 6. Interactive 1x / 2x / 3x Serving Size Scaler
      const scaleBtns = document.querySelectorAll('.scale-btn');
      if (scaleBtns.length > 0) {
        const formatNum = (val) => {
          const rounded = Math.round(val * 4) / 4;
          const whole = Math.floor(rounded);
          const frac = rounded - whole;
          const fracMap = { 0.25: '1/4', 0.5: '1/2', 0.75: '3/4' };
          if (fracMap[frac]) return whole > 0 ? whole + ' ' + fracMap[frac] : fracMap[frac];
          return Number.isInteger(rounded) ? String(rounded) : String(Math.round(val * 10) / 10);
        };
        const scaleIngredientText = (orig, mult) => {
          if (mult === 1) return orig;
          return orig.replace(/^(\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)/, (match) => {
            let num = 0;
            if (match.includes(' ')) {
              const parts = match.split(/\\s+/);
              const f = parts[1].split('/');
              num = parseFloat(parts[0]) + (parseFloat(f[0]) / parseFloat(f[1]));
            } else if (match.includes('/')) {
              const f = match.split('/');
              num = parseFloat(f[0]) / parseFloat(f[1]);
            } else {
              num = parseFloat(match);
            }
            return isNaN(num) ? match : formatNum(num * mult);
          });
        };

        const ingLabels = document.querySelectorAll('.ingredients-list label');
        ingLabels.forEach(lbl => { lbl.dataset.original = lbl.textContent.trim(); });
        const yieldEl = document.getElementById('recipeYieldVal');
        if (yieldEl) yieldEl.dataset.original = yieldEl.textContent.trim();

        scaleBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            scaleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mult = parseFloat(btn.dataset.scale || '1');
            ingLabels.forEach(lbl => {
              lbl.textContent = scaleIngredientText(lbl.dataset.original || lbl.textContent, mult);
            });
            if (yieldEl && yieldEl.dataset.original) {
              const baseNum = parseFloat(yieldEl.dataset.original);
              if (!isNaN(baseNum)) {
                yieldEl.textContent = '🍽️ ' + Math.round(baseNum * mult) + (mult > 1 ? ' (' + mult + 'x)' : '');
              }
            }
            showToast(mult === 1 ? 'Reset to original 1x servings' : 'Scaled ingredients to ' + mult + 'x batch!');
          });
        });
      }

      // 7. Interactive Step Completion (Tap a step to mark done)
      document.querySelectorAll('.step-row').forEach(step => {
        step.addEventListener('click', () => {
          step.classList.toggle('step-done');
        });
      });

      // 8. Interactive Star Rating Widget
      const starPicker = document.getElementById('starPicker');
      if (starPicker) {
        const slug = starPicker.dataset.slug || '';
        const rateKey = 'viralmia_rating_' + slug;
        const stars = starPicker.querySelectorAll('.star-btn');
        const paintStars = (val) => {
          stars.forEach(s => s.classList.toggle('lit', Number(s.dataset.val) <= val));
        };
        const savedRate = Number(localStorage.getItem(rateKey) || 0);
        if (savedRate) paintStars(savedRate);
        stars.forEach(s => {
          s.addEventListener('click', () => {
            const v = Number(s.dataset.val);
            paintStars(v);
            try { localStorage.setItem(rateKey, String(v)); } catch {}
            showToast('Thanks for rating this ' + v + '/5 stars! ⭐');
          });
        });
      }

      // 9. Interactive FAQ Accordion
      document.querySelectorAll('.faq-header').forEach(header => {
        header.addEventListener('click', () => {
          const card = header.closest('.faq-card');
          if (card) card.classList.toggle('open');
        });
      });
    });

    function showToast(msg) {
      const toast = document.getElementById('toastMsg');
      const text = document.getElementById('toastText');
      if (toast && text) {
        text.textContent = msg;
        toast.classList.add('show');
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
      }
    }

    let wakeLock = null;
    async function toggleCookMode() {
      const btn = document.getElementById('cookModeBtn');
      const txt = document.getElementById('cookModeText');
      if ('wakeLock' in navigator) {
        try {
          if (!wakeLock) {
            wakeLock = await navigator.wakeLock.request('screen');
            if (btn) btn.classList.add('active');
            if (txt) txt.textContent = 'Cook Mode: ON (Screen Awake)';
            showToast('🔥 Cook Mode ON: Screen will stay awake while cooking!');
            wakeLock.addEventListener('release', () => {
              wakeLock = null;
              if (btn) btn.classList.remove('active');
              if (txt) txt.textContent = 'Cook Mode (Keep Screen Awake)';
            });
          } else {
            await wakeLock.release();
            wakeLock = null;
            if (btn) btn.classList.remove('active');
            if (txt) txt.textContent = 'Cook Mode (Keep Screen Awake)';
            showToast('💤 Cook Mode OFF');
          }
        } catch (err) {
          showToast('Cook mode not supported on this device');
        }
      } else {
        showToast('Wake Lock API not supported in this browser');
      }
    }

    function copyIngredients() {
      const items = Array.from(document.querySelectorAll('.ingredients-list label')).map(l => '• ' + l.textContent.trim()).join('\\n');
      const title = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : 'Recipe';
      const text = title + ' - Ingredients:\\n\\n' + items + '\\n\\nSource: ' + window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('📋 Ingredients copied to clipboard!');
        }).catch(() => {
          showToast('Could not copy to clipboard');
        });
      } else {
        showToast('Clipboard not supported');
      }
    }
  </script>
</body>
</html>`;
}

// Generate Homepage & Category Pages
function buildHomePage(posts, currentCategory = 'All', allCategories = null) {
  const categoryIcons = {
    'All': '🍽️ All Recipes',
    'Quick Dinners': '🍝 Quick Dinners',
    'Air Fryer Meals': '🍗 Air Fryer Meals',
    'Kitchen Hacks': '💡 Kitchen Hacks',
    'Comfort Food': '🥣 Comfort Food',
    'Breakfast & Brunch': '🥞 Breakfast & Brunch',
    'Snacks & Sides': '🥨 Snacks & Sides',
    'Desserts & Sweets': '🍰 Desserts',
    'Quick Lunches': '🥗 Quick Lunches'
  };

  const categories = allCategories || ['All', ...new Set(posts.map(p => p.category))];
  const isCategory = currentCategory !== 'All';
  const featuredPost = (!isCategory && posts.length > 0) ? posts[0] : null;

  const catPills = categories.map(cat => {
    const isAct = cat === currentCategory;
    const href = cat === 'All' ? '/' : `/category/${slugify(cat)}`;
    const label = categoryIcons[cat] || `🍳 ${cat}`;
    return `<a href="${href}" class="cat-btn ${isAct ? 'active' : ''}">${label}</a>`;
  }).join('');

  const postCards = posts.map((post, idx) => `
    <article class="post-card" data-category="${escapeAttr(post.category)}" data-slug="${escapeAttr(post.slug)}" data-time="${post.totalMinutes || 15}" data-rating="${escapeAttr(post.rating)}" data-index="${idx}">
      <div class="card-img-wrap">
        <a href="/recipes/${post.slug}">
          <img class="post-card-img" src="${escapeAttr(post.heroImage)}" alt="${escapeAttr(post.title)}" width="600" height="412" loading="lazy" decoding="async">
        </a>
        <span class="card-badge">${post.category}</span>
        <span class="card-time-pill">⏱ ${formatTotalTime(post.totalMinutes)}</span>
        <button class="card-heart-btn" data-slug="${escapeAttr(post.slug)}" aria-label="Save recipe to favorites">🤍</button>
      </div>
      <div class="post-card-body">
        <div class="card-meta-row">
          <div class="card-rating">
            ★★★★★ <strong>${post.rating}</strong> <span>(${post.reviewCount})</span>
          </div>
          <span>${post.calories || '350 kcal'}</span>
        </div>
        <h3 class="post-card-title">
          <a href="/recipes/${post.slug}">${post.title}</a>
        </h3>
        <p class="post-card-desc">${post.description}</p>
        <div class="card-footer">
          <div class="card-footer-info">
            <span>By Mia</span>
            <span>•</span>
            <span>${post.readTime || '3 min read'}</span>
          </div>
          <a href="/recipes/${post.slug}" class="view-btn-arrow">Get Recipe &rarr;</a>
        </div>
      </div>
    </article>
  `).join('');

  const featuredHtml = featuredPost ? `
    <section class="featured-section">
      <article class="featured-card">
        <a href="/recipes/${featuredPost.slug}" class="featured-img-wrap">
          <img src="${escapeAttr(featuredPost.heroImage)}" alt="${escapeAttr(featuredPost.title)}" width="800" height="540" decoding="async">
          <span class="featured-ribbon">🔥 Editor's Pick • Trending Now</span>
        </a>
        <div class="featured-body">
          <div class="featured-kicker">
            <span>${featuredPost.category}</span>
            <span>•</span>
            <span>${formatUsDate(featuredPost.date)}</span>
          </div>
          <h2 class="featured-title">
            <a href="/recipes/${featuredPost.slug}">${featuredPost.title}</a>
          </h2>
          <p class="featured-desc">${featuredPost.description}</p>
          <div class="featured-meta">
            <span>⭐ ${featuredPost.rating} (${featuredPost.reviewCount} reviews)</span>
            <span>⏱ ${formatTotalTime(featuredPost.totalMinutes)}</span>
            <span>🔥 ${featuredPost.calories || '350 kcal'}</span>
          </div>
          <a href="/recipes/${featuredPost.slug}" class="featured-cta">Cook This Tonight &rarr;</a>
        </div>
      </article>
    </section>
  ` : '';

  const heroHeading = isCategory
    ? `${currentCategory} Recipes &amp; Smart Tips`
    : 'Quick 15-Minute Meals &amp; Smart Kitchen Hacks';
  const pageTitle = isCategory
    ? `${currentCategory} - Fast US Recipes & Kitchen Hacks`
    : 'Quick 15-Minute Meals & Smart US Kitchen Hacks';
  const pageDesc = isCategory
    ? `Browse Mia's tested ${currentCategory.toLowerCase()} recipes made with everyday US pantry staples—fast, budget-friendly, and designed for busy weeknights.`
    : SITE_DESC;
  const sectionHeading = isCategory ? `All ${currentCategory}` : 'Latest Tested Recipes &amp; Hacks';

  const content = `
    <!-- Editorial Hero -->
    <section class="hero-wrapper">
      <img
        class="hero-bg-img"
        src="/assets/hero-bg.jpg"
        alt="Cozy skillet cooking in Mia's kitchen"
        fetchpriority="high"
        decoding="async"
        loading="eager"
        width="1200"
        height="600"
      >
      <div class="hero-overlay"></div>

      <span class="floating-particle fp-1" aria-hidden="true">🍝</span>
      <span class="floating-particle fp-2" aria-hidden="true">🌿</span>
      <span class="floating-particle fp-3" aria-hidden="true">🧄</span>
      <span class="floating-particle fp-4" aria-hidden="true">🍋</span>

      <div class="hero">
        <div class="hero-tag">
          <span class="pulse-dot"></span>
          <span>Tested Daily in a Real US Kitchen</span>
        </div>
        <h1>${heroHeading}</h1>
        <p>Budget-friendly weeknight dinners, viral air fryer favorites, and practical food hacks using everyday Walmart, Aldi &amp; Trader Joe's staples.</p>

        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" id="recipe-search" class="search-input" placeholder="Search 15-min pasta, air fryer chicken, soup, storage hacks..." autocomplete="off">
        </div>

        <div class="hero-highlights">
          <span class="highlight-pill">⏱️ 15-Minute Focus</span>
          <span class="highlight-pill">💵 Budget-Friendly ($3–$8/serving)</span>
          <span class="highlight-pill">🍳 Minimal Cleanup</span>
          <span class="highlight-pill">⭐ 4.9/5 Reader Rating</span>
        </div>
      </div>
    </section>

    <!-- US Kitchen Trust & E-E-A-T Strip -->
    <div class="trust-strip">
      <div class="trust-strip-inner">
        <span class="trust-item">✅ <strong>Standard US Measurements</strong> (Cups, Tbsp &amp; °F)</span>
        <span class="trust-item">🛒 <strong>Everyday Grocery Staples</strong> (Aldi • Trader Joe's • Walmart)</span>
        <span class="trust-item">⚖️ <strong>1x / 2x / 3x Batch Scaler</strong> on Every Recipe</span>
        <span class="trust-item">🔥 <strong>${posts.length} Tested Recipes</strong> Ready to Cook</span>
      </div>
    </div>

    ${featuredHtml}

    <!-- Filter & Sort Bar -->
    <section class="catalog-controls">
      <div class="catalog-header-row">
        <div class="catalog-title-group">
          <h2>${sectionHeading}</h2>
          <span class="catalog-count">Showing ${posts.length} kitchen-tested recipes &amp; guides</span>
        </div>
        <div class="sort-pills" role="group" aria-label="Sort recipes">
          <button class="sort-btn active" data-sort="newest">Newest</button>
          <button class="sort-btn" data-sort="fastest">⚡ Fastest First</button>
          <button class="sort-btn" data-sort="rating">⭐ Top Rated</button>
          <button class="sort-btn saved-toggle" data-sort="saved">❤️ Saved (<span id="savedCountBadge">0</span>)</button>
        </div>
      </div>
      <div class="categories-bar">
        ${catPills}
      </div>
    </section>

    <!-- Main Recipe Grid -->
    <main class="posts-grid" id="recipes">
      ${postCards}
    </main>

    <!-- Empty Search / Saved State -->
    <div id="search-empty" class="search-empty-state" style="display: none;">
      <h3>🍳 No matching recipes found</h3>
      <p>Try searching another ingredient like "pasta", "chicken", "soup", or switch back to "Newest".</p>
    </div>

    <!-- Pre-Footer Newsletter -->
    <section class="newsletter-banner reveal-on-scroll">
      <span class="newsletter-kicker">FREE SUNDAY MEAL PLANNER</span>
      <h2>Never Wonder "What's For Dinner?" Again 👩‍🍳</h2>
      <p>Get Mia's 5-minute US grocery cheat-sheet &amp; 5 new 15-minute weeknight dinners delivered every Sunday morning.</p>
      <form class="newsletter-form" onsubmit="event.preventDefault(); showToast('🎉 Welcome to the kitchen! Check your inbox ✨'); this.reset();">
        <input type="email" class="newsletter-input" placeholder="Enter your email address..." required>
        <button type="submit" class="newsletter-btn">Get Free Recipes &rarr;</button>
      </form>
    </section>
  `;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": SITE_DESC,
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80"
    },
    "sameAs": [
      "https://pinterest.com/viralmiakitchen",
      "https://instagram.com/viralmiakitchen"
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isCategory ? `${currentCategory} Recipes` : `${SITE_NAME} Latest Recipes`,
    "numberOfItems": Math.min(posts.length, 12),
    "itemListElement": posts.slice(0, 12).map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${SITE_URL}/recipes/${p.slug}`,
      "name": p.title
    }))
  };

  return layout(pageTitle, content, {
    description: pageDesc,
    canonical: isCategory ? `${SITE_URL}/category/${slugify(currentCategory)}` : SITE_URL,
    schemas: [websiteSchema, orgSchema, itemListSchema],
    preloadImage: '/assets/hero-bg.jpg'
  });
}

// Generate Single Recipe or Kitchen Hack Guide Page (Dual-Mode Authentic Editorial Rendering)
function buildRecipePage(post, allPosts = []) {
  const isHackGuide = post.category === 'Kitchen Hacks';

  // Deterministic editorial heading variety so posts never look copy-pasted by a bot
  let slugHash = 0;
  for (let i = 0; i < (post.slug || '').length; i++) slugHash = (slugHash * 31 + post.slug.charCodeAt(i)) | 0;
  const variantIdx = Math.abs(slugHash);

  const recipeStoryHeadings = ["Mia's Kitchen Note", "Behind This Recipe", "Why This Works Every Time", "From Mia's Apartment Kitchen", "Notes From Testing This Dish"];
  const hackStoryHeadings = ["Why This Kitchen Trick Works", "Test-Kitchen Discovery", "Stop Wasting Time & Groceries", "The Kitchen Science Behind It"];
  const recipeHackHeadings = ["Mia's Test-Kitchen Secret", "Don't Skip This Step", "The One Shortcut That Matters", "My Favorite Flavor Upgrade"];
  const hackProHeadings = ["Key Takeaway for Best Results", "Pro Tip From Mia's Kitchen", "Avoid This Common Mistake"];
  const storageHeadings = ["Storage & Reheating Tips", "Leftovers & Make-Ahead Notes", "Keeping It Fresh Later", "Fridge & Reheat Guide"];

  const storyHeading = post.storyHeading || (isHackGuide ? hackStoryHeadings[variantIdx % hackStoryHeadings.length] : recipeStoryHeadings[variantIdx % recipeStoryHeadings.length]);
  const hackHeading = post.hackHeading || (isHackGuide ? hackProHeadings[variantIdx % hackProHeadings.length] : recipeHackHeadings[variantIdx % recipeHackHeadings.length]);
  const storageHeading = post.storageHeading || (isHackGuide ? "How Long It Lasts & Best Results" : storageHeadings[variantIdx % storageHeadings.length]);

  const ingredientsHtml = (post.ingredients || []).map((ing, idx) => `
    <li class="ing-item">
      <input type="checkbox" id="ing-${idx}">
      <label for="ing-${idx}">${ing}</label>
    </li>
  `).join('');

  const cleanSteps = (post.instructions || []).map(step =>
    String(step).replace(/^Step\s+\d+\s*[:.-]\s*/i, '').trim()
  );

  const stepsHtml = cleanSteps.map((step, idx) => `
    <li class="step-row" id="step-${idx + 1}" title="Tap to mark step complete">${step}</li>
  `).join('');

  const faqsHtml = (post.faqs || []).map(faq => `
    <div class="faq-card">
      <div class="faq-header">
        <span>❓ ${faq.question}</span>
        <span class="faq-icon">+</span>
      </div>
      <div class="faq-body">
        <p>${faq.answer}</p>
      </div>
    </div>
  `).join('');

  const prepMins = post.prepMinutes || 5;
  const cookMins = post.cookMinutes || 0;
  const totalMins = prepMins + cookMins;
  const catSlug = slugify(post.category);
  const recipeUrl = `${SITE_URL}/recipes/${post.slug}`;

  // Use genuine HowTo schema for Kitchen Hacks and Recipe schema for Recipes (Google E-E-A-T best practice!)
  const primarySchema = isHackGuide ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "mainEntityOfPage": { "@type": "WebPage", "@id": recipeUrl },
    "name": post.title,
    "description": post.description,
    "image": { "@type": "ImageObject", "url": post.heroImage, "width": 1200, "height": 800 },
    "totalTime": toIsoDuration(Math.max(1, totalMins)),
    "inLanguage": "en-US",
    "supply": (post.ingredients || []).map(item => ({ "@type": "HowToSupply", "name": item })),
    "step": cleanSteps.map((step, idx) => ({
      "@type": "HowToStep",
      "name": `Step ${idx + 1}`,
      "text": step,
      "url": `${recipeUrl}#step-${idx + 1}`
    }))
  } : {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "mainEntityOfPage": { "@type": "WebPage", "@id": recipeUrl },
    "name": post.title,
    "image": [
      {
        "@type": "ImageObject",
        "url": post.heroImage,
        "width": 1200,
        "height": 800
      }
    ],
    "author": { "@type": "Person", "name": "Mia", "url": `${SITE_URL}/about` },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": { "@type": "ImageObject", "url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80" }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "description": post.description,
    "inLanguage": "en-US",
    "prepTime": toIsoDuration(prepMins),
    "cookTime": toIsoDuration(cookMins),
    "totalTime": toIsoDuration(totalMins),
    "keywords": (post.keywords || []).join(', '),
    "recipeYield": post.servings,
    "recipeCategory": post.category,
    "recipeCuisine": "American",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": post.rating,
      "reviewCount": post.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": post.nutrition?.calories || post.calories,
      "proteinContent": post.nutrition?.protein || "24g",
      "carbohydrateContent": post.nutrition?.carbs || "42g",
      "fatContent": post.nutrition?.fat || "14g",
      "fiberContent": post.nutrition?.fiber || "4g"
    },
    "recipeIngredient": post.ingredients,
    "recipeInstructions": cleanSteps.map((step, idx) => ({
      "@type": "HowToStep",
      "name": `Step ${idx + 1}`,
      "text": step,
      "url": `${recipeUrl}#step-${idx + 1}`
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": post.category, "item": `${SITE_URL}/category/${catSlug}` },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": recipeUrl }
    ]
  };

  const faqSchema = (post.faqs && post.faqs.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  } : null;

  const schemas = [primarySchema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);

  const shareUrl = encodeURIComponent(recipeUrl);
  const shareTitle = encodeURIComponent(post.title);
  const shareImg = encodeURIComponent(post.heroImage);

  const statsGridHtml = isHackGuide ? `
        <div class="recipe-stats" style="grid-template-columns: repeat(3, 1fr);">
          <div class="stat-box">
            <span class="stat-label">Time Needed</span>
            <span class="stat-val">⏱️ ${formatTotalTime(totalMins)}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Difficulty</span>
            <span class="stat-val">✨ Super Easy</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Est. Cost</span>
            <span class="stat-val">💵 ${post.costPerServing || 'Under $1'}</span>
          </div>
        </div>
  ` : `
        <div class="recipe-stats">
          <div class="stat-box">
            <span class="stat-label">Prep Time</span>
            <span class="stat-val">⏱️ ${post.prepTime}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Cook Time</span>
            <span class="stat-val">🍳 ${post.cookTime}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Total Time</span>
            <span class="stat-val">⚡ ${formatTotalTime(totalMins)}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Servings</span>
            <span class="stat-val" id="recipeYieldVal">🍽️ ${post.servings}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Calories</span>
            <span class="stat-val">🔥 ${post.calories}</span>
          </div>
        </div>
  `;

  const servingIdeaHtml = post.servingIdea ? `
        <div style="margin: 26px 0; padding: 20px 24px; background: var(--bg); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
          <h3 style="font-size: 19px; font-weight: 800; margin-bottom: 6px;">${isHackGuide ? '✨ Best Ways to Use This Hack' : '🍷 What to Serve With This'}</h3>
          <p style="font-size: 15.5px; color: var(--text-muted); line-height: 1.75; margin: 0;">${post.servingIdea}</p>
        </div>
  ` : '';

  const nutritionHtml = isHackGuide ? '' : `
        <!-- Nutrition Facts Breakdown -->
        <div class="nutrition-card">
          <h4>Estimated Nutrition (Per Serving)</h4>
          <div class="nutrition-grid">
            <div class="nutri-box">
              <div class="nutri-num">${post.nutrition.calories}</div>
              <div class="nutri-label">Calories</div>
            </div>
            <div class="nutri-box">
              <div class="nutri-num">${post.nutrition.protein}</div>
              <div class="nutri-label">Protein</div>
            </div>
            <div class="nutri-box">
              <div class="nutri-num">${post.nutrition.carbs}</div>
              <div class="nutri-label">Carbs</div>
            </div>
            <div class="nutri-box">
              <div class="nutri-num">${post.nutrition.fat}</div>
              <div class="nutri-label">Fat</div>
            </div>
            <div class="nutri-box">
              <div class="nutri-num">${post.nutrition.fiber}</div>
              <div class="nutri-label">Fiber</div>
            </div>
          </div>
        </div>
  `;

  const content = `
    <article class="article-wrap">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo;
        <a href="/category/${catSlug}">${post.category}</a> &rsaquo;
        <span>${post.title}</span>
      </nav>

      <!-- Editorial Article Header -->
      <header class="article-header">
        <div class="hero-tag">${post.category}</div>
        <h1>${post.title}</h1>
        <p class="article-dek">${post.description}</p>
        <div class="article-byline">
          <img class="byline-avatar" src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=100&q=80" alt="Mia" width="30" height="30">
          <span>By <strong>Mia</strong></span>
          <span>•</span>
          <span>Updated ${formatUsDate(post.date)}</span>
          <span>•</span>
          <span style="color: var(--gold); font-weight: 800;">★★★★★ ${post.rating} (${post.reviewCount} Reviews)</span>
        </div>

        <div class="action-buttons">
          <a href="#recipe-card" class="btn-action btn-primary-action">${isHackGuide ? 'Jump to Guide ↓' : 'Jump to Recipe ↓'}</a>
          <button onclick="window.print(); showToast('🖨️ Opening printable card...');" class="btn-action">🖨️ ${isHackGuide ? 'Print Guide' : 'Print Recipe'}</button>
          <a href="https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${shareImg}&description=${shareTitle}" target="_blank" rel="noopener" class="btn-action" onclick="showToast('📌 Pinning to Pinterest!')">📌 Pin It</a>
        </div>
      </header>

      <img class="article-hero" src="${escapeAttr(post.heroImage)}" alt="${escapeAttr(post.title)}" width="1200" height="750" fetchpriority="high" decoding="async">

      <!-- Editorial Kitchen Intro -->
      <div class="diary-card reveal-on-scroll">
        <div class="diary-badge">💌 ${storyHeading}</div>
        <p class="diary-text">${post.story}</p>
      </div>

      <!-- Social Sharing Bar -->
      <div class="social-share reveal-on-scroll">
        <span class="share-label">Save &amp; Share:</span>
        <a href="https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${shareImg}&description=${shareTitle}" target="_blank" rel="noopener" class="share-btn share-pinterest" onclick="showToast('📌 Saved to Pinterest!')">📌 Save to Pinterest</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" class="share-btn share-facebook">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener" class="share-btn share-twitter">X (Twitter)</a>
      </div>

      <!-- OFFICIAL PRINTABLE CARD -->
      <div class="recipe-card-box reveal-on-scroll" id="recipe-card">
        <div class="recipe-card-header">
          <div>
            <h2>${post.title}</h2>
            <p class="recipe-card-desc">${post.description}</p>
          </div>
        </div>

        <!-- Cook Mode / Copy / Print Toolbar -->
        <div class="recipe-action-toolbar">
          <button id="cookModeBtn" class="tool-btn" onclick="toggleCookMode()">
            <span>💡</span> <span id="cookModeText">Cook Mode (Keep Screen Awake)</span>
          </button>
          <button class="tool-btn" onclick="copyIngredients()">
            <span>📋</span> <span>${isHackGuide ? 'Copy Checklist' : 'Copy Ingredients'}</span>
          </button>
          <button class="tool-btn" onclick="window.print()">
            <span>🖨️</span> <span>Print Card</span>
          </button>
        </div>

        ${statsGridHtml}

        <!-- Ingredients / Supplies Checklist -->
        <section class="ingredients-sec">
          <div class="ingredients-header-row">
            <h3>${isHackGuide ? '🧰 What You Need' : '🛒 Ingredients'}</h3>
            ${isHackGuide ? '' : `
            <div class="scaler-group" role="group" aria-label="Scale recipe servings">
              <span class="scaler-label">Scale:</span>
              <button class="scale-btn active" data-scale="1">1x</button>
              <button class="scale-btn" data-scale="2">2x</button>
              <button class="scale-btn" data-scale="3">3x</button>
            </div>`}
          </div>
          <p style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 12px;">${isHackGuide ? 'Gather these simple everyday kitchen items:' : 'US standard measurements • Tap any ingredient to check it off:'}</p>
          <ul class="ingredients-list">
            ${ingredientsHtml}
          </ul>
        </section>

        <!-- Step-by-Step Instructions -->
        <section class="steps-sec">
          <h3>${isHackGuide ? '⚡ Step-by-Step Method' : '👩‍🍳 Instructions'}</h3>
          <p style="font-size: 13.5px; color: var(--text-muted); margin: -10px 0 18px;">Tip: Tap any step as you go to check it off.</p>
          <ol class="steps-list">
            ${stepsHtml}
          </ol>
        </section>

        <!-- Insider Tip Box -->
        <div class="hack-banner">
          <div class="hack-banner-title">💡 ${hackHeading}</div>
          <p>${post.proHack}</p>
        </div>

        ${servingIdeaHtml}

        <!-- Storage & Results -->
        <div style="margin: 28px 0;">
          <h3 style="font-size: 21px; font-weight: 800; margin-bottom: 8px;">🥡 ${storageHeading}</h3>
          <p style="font-size: 15.5px; color: var(--text-muted); line-height: 1.8;">${post.storage}</p>
        </div>

        ${nutritionHtml}

        <!-- Interactive Star Rating -->
        <div class="rate-recipe-box">
          <p>${isHackGuide ? 'Did this hack help you? Tap to rate it:' : 'Made this recipe? Tap to rate it:'}</p>
          <div class="star-picker" id="starPicker" data-slug="${escapeAttr(post.slug)}" aria-label="Rate this post">
            <button class="star-btn" data-val="1" aria-label="1 star">★</button>
            <button class="star-btn" data-val="2" aria-label="2 stars">★</button>
            <button class="star-btn" data-val="3" aria-label="3 stars">★</button>
            <button class="star-btn" data-val="4" aria-label="4 stars">★</button>
            <button class="star-btn" data-val="5" aria-label="5 stars">★</button>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <section class="faq-wrap reveal-on-scroll">
        <h3>❓ Frequently Asked Questions</h3>
        ${faqsHtml}
      </section>

      <!-- Author Bio Card (E-E-A-T) -->
      <div class="author-card reveal-on-scroll">
        <img class="author-avatar" src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=200&q=80" alt="Mia cooking" width="88" height="88" loading="lazy">
        <div class="author-info">
          <h4>Hi, I'm Mia! 👋</h4>
          <p>I test fast 15-minute dinners and time-saving kitchen hacks in my real US apartment kitchen for busy home cooks who love comfort food without a sink full of dishes. Tag <strong>#ViralMiaKitchen</strong> when you make this!</p>
        </div>
      </div>

      <!-- Related Recipes -->
      ${(() => {
        const sameCat = allPosts.filter(p => p.slug !== post.slug && p.category === post.category);
        const otherPosts = allPosts.filter(p => p.slug !== post.slug && p.category !== post.category);
        const related = [...sameCat, ...otherPosts].slice(0, 3);
        if (related.length === 0) return '';
        return `
          <section class="related-recipes-wrap reveal-on-scroll">
            <div class="sec-title-row">
              <h3>👩‍🍳 You May Also Love</h3>
              <a href="/category/${catSlug}" class="view-all-link">See all ${post.category} &rarr;</a>
            </div>
            <div class="related-grid">
              ${related.map(r => `
                <article class="post-card">
                  <div class="card-img-wrap">
                    <a href="/recipes/${r.slug}">
                      <img class="post-card-img" src="${escapeAttr(r.heroImage)}" alt="${escapeAttr(r.title)}" width="400" height="275" loading="lazy" decoding="async">
                    </a>
                    <span class="card-badge">${r.category}</span>
                  </div>
                  <div class="post-card-body">
                    <div class="card-meta-row">
                      <div class="card-rating">★★★★★ <strong>${r.rating}</strong></div>
                      <span>⏱️ ${formatTotalTime(r.totalMinutes)}</span>
                    </div>
                    <h4 class="post-card-title">
                      <a href="/recipes/${r.slug}">${r.title}</a>
                    </h4>
                    <p class="post-card-desc">${r.description.slice(0, 95)}...</p>
                    <div class="card-footer" style="padding-top: 10px;">
                      <a href="/recipes/${r.slug}" class="view-btn-arrow">Get Recipe &rarr;</a>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </section>
        `;
      })()}
    </article>
  `;

  return layout(post.title, content, {
    description: post.description,
    canonical: recipeUrl,
    image: post.heroImage,
    imageAlt: post.title,
    preloadImage: post.heroImage,
    type: 'article',
    publishedTime: post.date,
    section: post.category,
    schemas
  });
}

// Generate Static Pages (About, Contact, Privacy Policy, Terms, 404)
function buildStaticPages(posts = []) {
  const aboutContent = `
    <article class="article-wrap">
      <header class="article-header">
        <div class="hero-tag">Our Story</div>
        <h1>Meet Mia: Fast, Cozy Cooking for Busy US Homes</h1>
      </header>
      <img class="article-hero" src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80" alt="Mia in kitchen" width="1200" height="750">
      <div class="article-body" style="font-size: 17.5px; line-height: 1.85; color: var(--text);">
        <p style="margin-bottom: 20px;">Welcome to <strong>ViralMia Kitchen</strong>! If you’re exhausted after a long workday and the idea of spending 90 minutes over a hot stove feels impossible, you’ve found your new weeknight kitchen buddy.</p>
        <p style="margin-bottom: 20px;">I started this food journal because I love bold, comforting meals, but I cook in a real apartment kitchen with limited counter space and a busy schedule. Delicious home cooking doesn’t require fancy gadgets or overpriced specialty ingredients—it requires <strong>smart techniques and reliable 15-minute formulas</strong>.</p>
        <h2 style="font-size: 28px; margin: 36px 0 16px; font-weight: 800;">Our 3 Golden Kitchen Rules</h2>
        <ul style="margin-bottom: 24px; padding-left: 24px;">
          <li style="margin-bottom: 12px;"><strong>15-Minute Focus:</strong> Most dinners are tested to go from fridge to table in 15–20 minutes.</li>
          <li style="margin-bottom: 12px;"><strong>Everyday US Grocery Staples:</strong> Ingredients easy to grab at Aldi, Trader Joe’s, Kroger, Target, or Walmart.</li>
          <li style="margin-bottom: 12px;"><strong>Minimal Dishes:</strong> One-pot, skillet, air fryer, and sheet-pan meals wherever possible.</li>
        </ul>
      </div>
    </article>
  `;
  ensureDir(path.join(DIST_DIR, 'about'));
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": `About Mia - ${SITE_NAME}`,
    "url": `${SITE_URL}/about`,
    "description": "Meet Mia: Quick 15-minute meals and kitchen hacks tested in an apartment kitchen for busy US home cooks.",
    "mainEntity": {
      "@type": "Person",
      "name": "Mia",
      "jobTitle": "Recipe Developer & Home Cook",
      "url": `${SITE_URL}/about`
    }
  };
  fs.writeFileSync(path.join(DIST_DIR, 'about', 'index.html'), layout('About Mia', aboutContent, {
    canonical: `${SITE_URL}/about`,
    description: "Meet Mia: Quick 15-minute meals, budget comfort food, and smart kitchen hacks tested for busy US home cooks.",
    schemas: [aboutSchema]
  }));

  const contactContent = `
    <article class="article-wrap">
      <header class="article-header">
        <div class="hero-tag">Say Hello</div>
        <h1>Get in Touch with Mia</h1>
        <p class="article-dek">Have a recipe substitution question, kitchen hack idea, or brand partnership inquiry?</p>
      </header>
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 44px 32px; text-align: center; box-shadow: var(--shadow-sm);">
        <p style="font-size: 18px; margin-bottom: 14px;">We love hearing from our community of everyday home cooks across the USA!</p>
        <p style="font-size: 24px; font-weight: 800; color: var(--primary);">📧 hello@viralmia.me</p>
        <p style="margin-top: 22px; color: var(--text-muted); font-size: 15px;">For recipe licensing, brand sponsorships, or press inquiries, please include <em>[Partnership]</em> in your email subject line.</p>
      </div>
    </article>
  `;
  ensureDir(path.join(DIST_DIR, 'contact'));
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": `Contact - ${SITE_NAME}`,
    "url": `${SITE_URL}/contact`,
    "description": "Get in touch with Mia for recipe questions, press, and brand sponsorships."
  };
  fs.writeFileSync(path.join(DIST_DIR, 'contact', 'index.html'), layout('Contact Us', contactContent, {
    canonical: `${SITE_URL}/contact`,
    description: "Get in touch with Mia at ViralMia Kitchen for recipe questions, press, and brand sponsorships.",
    schemas: [contactSchema]
  }));

  const privacyContent = `
    <article class="article-wrap">
      <header class="article-header">
        <div class="hero-tag">Legal</div>
        <h1>Privacy Policy</h1>
        <p style="color: var(--text-muted);">Last Updated: November 2026</p>
      </header>
      <div style="font-size: 16px; line-height: 1.85; color: var(--text);">
        <p style="margin-bottom: 16px;">Your privacy is important to us at ViralMia.me. This Privacy Policy outlines how information is collected and safeguarded when you browse our recipes.</p>
        <h2 style="font-size: 22px; margin: 24px 0 12px; font-weight: 800;">Analytics &amp; Local Preferences</h2>
        <p style="margin-bottom: 16px;">ViralMia.me uses Google Analytics and privacy-focused Cloudflare Web Analytics to understand popular recipes and improve site speed. Saved favorites and star ratings are stored locally in your browser via localStorage.</p>
        <h2 style="font-size: 22px; margin: 24px 0 12px; font-weight: 800;">Advertising Partners &amp; Cookies</h2>
        <p style="margin-bottom: 16px;">Third-party advertising partners, including Google AdSense, may use cookies or web beacons to serve relevant advertisements. You can manage or opt out of personalized ads anytime via Google Ads Settings.</p>
      </div>
    </article>
  `;
  ensureDir(path.join(DIST_DIR, 'privacy-policy'));
  fs.writeFileSync(path.join(DIST_DIR, 'privacy-policy', 'index.html'), layout('Privacy Policy', privacyContent, {
    canonical: `${SITE_URL}/privacy-policy`,
    description: "Privacy policy for ViralMia.me explaining analytics, cookies, and data protection practices.",
    schemas: [{ "@context": "https://schema.org", "@type": "WebPage", "name": `Privacy Policy - ${SITE_NAME}`, "url": `${SITE_URL}/privacy-policy` }]
  }));

  const termsContent = `
    <article class="article-wrap">
      <header class="article-header">
        <div class="hero-tag">Legal</div>
        <h1>Terms of Service</h1>
        <p style="color: var(--text-muted);">Last Updated: November 2026</p>
      </header>
      <div style="font-size: 16px; line-height: 1.85; color: var(--text);">
        <p style="margin-bottom: 16px;">By accessing and using ViralMia.me, you agree to comply with these terms of use.</p>
        <h2 style="font-size: 22px; margin: 24px 0 12px; font-weight: 800;">Recipe &amp; Nutritional Disclaimer</h2>
        <p style="margin-bottom: 16px;">All recipes, cooking times, and nutritional estimates on ViralMia.me are provided for informational purposes only and are calculated using standard US grocery averages. Always verify allergens and safe internal cooking temperatures.</p>
      </div>
    </article>
  `;
  ensureDir(path.join(DIST_DIR, 'terms'));
  fs.writeFileSync(path.join(DIST_DIR, 'terms', 'index.html'), layout('Terms of Service', termsContent, {
    canonical: `${SITE_URL}/terms`,
    description: "Terms of service and culinary disclaimer for ViralMia Kitchen.",
    schemas: [{ "@context": "https://schema.org", "@type": "WebPage", "name": `Terms of Service - ${SITE_NAME}`, "url": `${SITE_URL}/terms` }]
  }));

  // Branded 404 Page for Cloudflare Pages
  const top3 = posts.slice(0, 3);
  const notFoundContent = `
    <article class="article-wrap" style="text-align: center; padding-top: 30px;">
      <div class="hero-tag" style="background: var(--primary-light); color: var(--primary);">404 • Recipe Not Found</div>
      <h1 style="font-size: 42px; margin: 14px 0;">Oops! That dish isn't in the oven.</h1>
      <p class="article-dek">The page you're looking for may have moved, but we've got plenty of 15-minute dinners ready right now.</p>
      <div class="action-buttons">
        <a href="/" class="btn-action btn-primary-action">Browse All Recipes &rarr;</a>
        <a href="/category/quick-dinners" class="btn-action">🍝 Quick Dinners</a>
        <a href="/category/air-fryer-meals" class="btn-action">🍗 Air Fryer</a>
      </div>
      ${top3.length ? `
        <div class="related-grid" style="text-align: left; margin-top: 40px;">
          ${top3.map(r => `
            <article class="post-card">
              <div class="card-img-wrap">
                <a href="/recipes/${r.slug}">
                  <img class="post-card-img" src="${escapeAttr(r.heroImage)}" alt="${escapeAttr(r.title)}" loading="lazy">
                </a>
                <span class="card-badge">${r.category}</span>
              </div>
              <div class="post-card-body">
                <h4 class="post-card-title"><a href="/recipes/${r.slug}">${r.title}</a></h4>
                <div class="card-footer" style="padding-top: 10px;">
                  <a href="/recipes/${r.slug}" class="view-btn-arrow">Get Recipe &rarr;</a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      ` : ''}
    </article>
  `;
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), layout('Page Not Found', notFoundContent, {
    canonical: `${SITE_URL}/404`,
    description: "Page not found on ViralMia Kitchen. Explore our 15-minute dinners and kitchen hacks."
  }));
}

// Generate Sitemap, RSS Feed, Robots.txt, BingSiteAuth, Cloudflare _redirects & _headers
function buildSeoFiles(posts, categories = []) {
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/contact`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/privacy-policy`, priority: '0.5', changefreq: 'yearly' },
    { loc: `${SITE_URL}/terms`, priority: '0.5', changefreq: 'yearly' }
  ];

  const categoryUrls = categories.map(cat => ({
    loc: `${SITE_URL}/category/${slugify(cat)}`,
    priority: '0.8',
    changefreq: 'daily'
  }));

  const postUrls = posts.map(p => ({
    loc: `${SITE_URL}/recipes/${p.slug}`,
    lastmod: p.date,
    priority: '0.9',
    changefreq: 'weekly',
    image: p.heroImage,
    title: p.title
  }));

  const allUrls = [...staticUrls, ...categoryUrls, ...postUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.image ? `
    <image:image>
      <image:loc>${escapeXml(u.image)}</image:loc>
      <image:title>${escapeXml(u.title)}</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);

  // RSS 2.0 Feed (Pinterest Auto-Publish, Flipboard & Google Discover)
  const rssItems = posts.slice(0, 25).map(p => {
    const pubDate = new Date(`${p.date}T12:00:00Z`).toUTCString();
    const link = `${SITE_URL}/recipes/${p.slug}`;
    return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description>${escapeXml(p.description)}</description>
      <enclosure url="${escapeXml(p.heroImage)}" type="image/jpeg" />
    </item>`;
  }).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;
  fs.writeFileSync(path.join(DIST_DIR, 'feed.xml'), rssXml);

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt);

  const bingAuthXml = `<?xml version="1.0"?>
<users>
\t<user>10C2D4086B957B65F94D90B4447965A6</user>
</users>`;
  fs.writeFileSync(path.join(DIST_DIR, 'BingSiteAuth.xml'), bingAuthXml);

  // Cloudflare Pages _redirects
  const redirects = `/recipes/viral-air-fryer-apple%20cider-donuts /recipes/viral-air-fryer-apple-cider-donuts 301
`;
  fs.writeFileSync(path.join(DIST_DIR, '_redirects'), redirects);

  // Cloudflare Pages _headers (Edge Caching & Security for top Lighthouse/CWV scores)
  const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/sitemap.xml
  Cache-Control: public, max-age=3600

/feed.xml
  Cache-Control: public, max-age=3600
`;
  fs.writeFileSync(path.join(DIST_DIR, '_headers'), headers);
}

// Main Build
function main() {
  console.log('🚀 Running Premium Editorial & US-SEO Build for Viral Mia...');
  ensureDir(DIST_DIR);

  const distRecipesDir = path.join(DIST_DIR, 'recipes');
  const distCategoryDir = path.join(DIST_DIR, 'category');
  if (fs.existsSync(distRecipesDir)) fs.rmSync(distRecipesDir, { recursive: true, force: true });
  if (fs.existsSync(distCategoryDir)) fs.rmSync(distCategoryDir, { recursive: true, force: true });

  const localAssets = path.join(__dirname, 'assets');
  if (fs.existsSync(localAssets)) {
    const distAssets = path.join(DIST_DIR, 'assets');
    ensureDir(distAssets);
    fs.cpSync(localAssets, distAssets, { recursive: true });
  }

  const posts = getAllPosts();
  console.log(`Loaded ${posts.length} recipes.`);

  const categories = [...new Set(posts.map(p => p.category))];
  const allCategoryTabs = ['All', ...categories];

  // 1. Homepage
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), buildHomePage(posts, 'All', allCategoryTabs));

  // 2. Individual Recipe Pages
  posts.forEach(post => {
    const postDir = path.join(DIST_DIR, 'recipes', post.slug);
    ensureDir(postDir);
    fs.writeFileSync(path.join(postDir, 'index.html'), buildRecipePage(post, posts));
  });

  // 3. Category Pages
  categories.forEach(cat => {
    const catSlug = slugify(cat);
    const catPosts = posts.filter(p => p.category === cat);
    const catDir = path.join(DIST_DIR, 'category', catSlug);
    ensureDir(catDir);
    fs.writeFileSync(path.join(catDir, 'index.html'), buildHomePage(catPosts, cat, allCategoryTabs));
  });

  // 4. Static & 404 Pages
  buildStaticPages(posts);

  // 5. Sitemap, RSS Feed, Robots, Redirects & Headers
  buildSeoFiles(posts, categories);

  console.log('✨ Premium Editorial Build Completed Successfully in /dist!');
}

main();
