const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const DIST_DIR = path.join(__dirname, 'dist');
const SITE_URL = 'https://viralmia.me';
const SITE_NAME = 'Viral Mia Kitchen';
const SITE_TAGLINE = 'Quick 15-Minute Meals & Brilliant Kitchen Hacks';
const SITE_DESC = 'Tested, budget-friendly weeknight dinner recipes, 15-minute comfort food, and life-saving kitchen hacks with Mia. Simple, joyful home cooking for busy everyday lives.';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'));
  const posts = files.map(file => {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const post = JSON.parse(content);
      post.rating = post.rating || '4.9';
      post.reviewCount = post.reviewCount || Math.floor(Math.random() * 25) + 38;
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

// PRO LEVEL ANIMATIONS & VISUAL EFFECTS CSS
const GLOBAL_CSS = `
:root {
  --primary: #d94830;
  --primary-dark: #b53520;
  --primary-light: #fff2ef;
  --primary-glow: rgba(217, 72, 48, 0.25);
  --accent: #23745c;
  --accent-light: #e8f5f1;
  --gold: #f59e0b;
  --bg: #faf7f2;
  --card: #ffffff;
  --text: #1f2421;
  --text-muted: #5e656d;
  --border: #e8e2d8;
  --border-light: #f3eee7;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --shadow-sm: 0 4px 12px rgba(0,0,0,0.03);
  --shadow-md: 0 10px 30px rgba(0,0,0,0.06);
  --shadow-hover: 0 16px 40px rgba(217,72,48,0.18);
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
  color: #161917;
  line-height: 1.25;
}

a { color: inherit; text-decoration: none; transition: all 0.25s var(--ease-smooth); }
img { max-width: 100%; height: auto; display: block; }

/* Top Scroll Reading Progress Bar */
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #d94830);
  width: 0%;
  z-index: 9999;
  transition: width 0.1s ease-out;
  box-shadow: 0 2px 8px rgba(217, 72, 48, 0.5);
}

/* Announcement Banner */
.top-bar {
  background: #111413;
  color: #f7fafc;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 16px;
  text-align: center;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}
.top-bar span { color: #fbd38d; margin-right: 6px; animation: pulseSparkle 2s infinite; display: inline-block; }

@keyframes pulseSparkle {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

/* Navbar */
.navbar {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 300;
  transition: all 0.3s ease;
}
.nav-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo-group { display: flex; flex-direction: column; }
.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo span { color: var(--text); font-weight: 400; font-style: italic; }
.logo-tagline {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 1.5px;
  font-weight: 700;
  margin-top: -3px;
}
.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
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
  transition: width 0.3s var(--ease-smooth);
}
.nav-links a:hover::after { width: 100%; }
.nav-links a:hover { color: var(--primary); }

.nav-cta {
  background: var(--primary);
  color: #fff !important;
  padding: 10px 22px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(217,72,48,0.3);
  transition: all 0.3s var(--ease-spring) !important;
}
.nav-cta::after { display: none !important; }
.nav-cta:hover {
  background: var(--primary-dark);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 24px rgba(217,72,48,0.4);
}

/* Floating Soft Background Orbs */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: -1;
  pointer-events: none;
  opacity: 0.45;
  animation: floatOrb 12s infinite ease-in-out alternate;
}
.bg-orb-1 {
  width: 400px;
  height: 400px;
  background: #fde2dc;
  top: 5%;
  right: -5%;
}
.bg-orb-2 {
  width: 350px;
  height: 350px;
  background: #e2f4ed;
  top: 35%;
  left: -5%;
  animation-duration: 16s;
}

@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, 40px) scale(1.08); }
  100% { transform: translate(-20px, -30px) scale(0.95); }
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 70px 24px 44px;
  max-width: 920px;
  margin: 0 auto;
  position: relative;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 13px;
  font-weight: 800;
  padding: 7px 20px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 22px;
  box-shadow: 0 0 0 1px rgba(217,72,48,0.15);
  animation: floatHeroBadge 4s ease-in-out infinite;
}

@keyframes floatHeroBadge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.hero h1 {
  font-size: 54px;
  font-weight: 800;
  margin-bottom: 20px;
  letter-spacing: -1px;
  animation: fadeInUp 0.8s var(--ease-smooth) forwards;
}
.hero p {
  font-size: 20px;
  color: var(--text-muted);
  max-width: 740px;
  margin: 0 auto 36px;
  animation: fadeInUp 0.9s var(--ease-smooth) forwards;
}

/* Live Search Bar */
.search-wrapper {
  max-width: 620px;
  margin: 0 auto 40px;
  position: relative;
  animation: fadeInUp 1s var(--ease-smooth) forwards;
}
.search-input {
  width: 100%;
  padding: 17px 24px 17px 56px;
  border-radius: 50px;
  border: 1.5px solid var(--border);
  background: #fff;
  font-size: 16px;
  font-family: inherit;
  box-shadow: var(--shadow-sm);
  outline: none;
  transition: all 0.3s var(--ease-smooth);
}
.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 5px rgba(217,72,48,0.15);
  transform: scale(1.01);
}
.search-icon {
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 19px;
  color: var(--text-muted);
}

/* Category Filters */
.categories-bar {
  max-width: 1240px;
  margin: 0 auto 52px;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.cat-btn {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 11px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
  position: relative;
  overflow: hidden;
}
.cat-btn:hover, .cat-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(217,72,48,0.25);
}

/* Recipe Grid & Cards */
.posts-grid {
  max-width: 1240px;
  margin: 0 auto 90px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 38px;
}
.post-card {
  background: var(--card);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  transition: transform 0.4s var(--ease-spring), box-shadow 0.4s var(--ease-smooth), border-color 0.3s;
  display: flex;
  flex-direction: column;
  position: relative;
  will-change: transform;
}
.post-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(217,72,48,0.4);
}
.card-img-wrap {
  position: relative;
  overflow: hidden;
  height: 250px;
  background: #f0ebe4;
}
.post-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-smooth);
}
.post-card:hover .post-card-img { transform: scale(1.07); }
.card-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 50px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.3s var(--ease-spring);
}
.post-card:hover .card-badge { transform: translateY(-2px); }

.post-card-body {
  padding: 28px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.card-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 14px;
}
.card-rating {
  color: var(--gold);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}
.card-rating span { color: var(--text-muted); font-size: 12px; }
.post-card-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.35;
  transition: color 0.2s ease;
}
.post-card:hover .post-card-title { color: var(--primary); }
.post-card-desc {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 24px;
  flex: 1;
  line-height: 1.65;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-light);
  padding-top: 18px;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
}
.card-footer-info {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text-muted);
  font-weight: 500;
}
.view-btn-arrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s ease;
}
.post-card:hover .view-btn-arrow { transform: translateX(5px); }

/* Article / Recipe View */
.article-wrap {
  max-width: 920px;
  margin: 36px auto 90px;
  padding: 0 24px;
}
.breadcrumbs {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 26px;
}
.breadcrumbs a:hover { color: var(--primary); }
.article-header { text-align: center; margin-bottom: 34px; }
.article-header h1 {
  font-size: 48px;
  font-weight: 800;
  margin: 16px 0 20px;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.article-byline {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.article-byline strong { color: var(--text); }

/* Interactive Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--card);
  border: 1px solid var(--border);
  padding: 12px 26px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
  color: var(--text);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
}
.btn-action:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(217,72,48,0.25);
}
.btn-primary-action {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.btn-primary-action:hover { background: var(--primary-dark); }

.article-hero {
  width: 100%;
  max-height: 520px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  margin-bottom: 44px;
  box-shadow: var(--shadow-md);
  transition: transform 0.4s ease;
}
.article-hero:hover { transform: scale(1.01); }

/* Personal Diary Story Card */
.diary-card {
  background: #fdfaf6;
  border-left: 5px solid var(--primary);
  padding: 30px 36px;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin: 38px 0 52px;
  box-shadow: var(--shadow-sm);
  position: relative;
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
.diary-text { font-size: 18px; color: #374151; line-height: 1.85; }

/* THE RECIPE CARD BOX */
.recipe-card-box {
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 44px;
  margin: 50px 0;
  box-shadow: var(--shadow-md);
  position: relative;
}
.recipe-card-header {
  border-bottom: 2px dashed var(--border);
  padding-bottom: 26px;
  margin-bottom: 30px;
}
.recipe-card-header h2 { font-size: 34px; margin-bottom: 12px; font-weight: 800; }
.recipe-card-desc { font-size: 16px; color: var(--text-muted); }

/* Interactive Servings Scaler */
.servings-controller {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  background: #faf7f2;
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 50px;
  border: 1px solid var(--border);
}
.servings-controller button {
  background: var(--card);
  border: 1px solid var(--border);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: 800;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.servings-controller button:hover { background: var(--primary); color: #fff; border-color: var(--primary); }

/* Stats Bar */
.recipe-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background: var(--bg);
  padding: 22px;
  border-radius: var(--radius-md);
  margin-bottom: 38px;
  text-align: center;
}
.stat-box { display: flex; flex-direction: column; }
.stat-label { font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; }
.stat-val { font-size: 22px; font-weight: 800; color: var(--primary); margin-top: 4px; }

/* Ingredients with Animated Checkmark */
.ingredients-sec h3, .steps-sec h3 {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 18px;
}
.ingredients-list { list-style: none; margin-bottom: 40px; }
.ing-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  transition: all 0.25s ease;
  font-size: 17px;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
}
.ing-item:hover { background: #faf8f5; transform: translateX(3px); }
.ing-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
  margin-top: 3px;
  cursor: pointer;
}
.ing-item.checked {
  text-decoration: line-through;
  opacity: 0.5;
  background: #f5f5f5;
}

/* Steps List with Pulse Numbers */
.steps-sec { margin-bottom: 40px; }
.steps-list { list-style: none; counter-reset: cooking-step; }
.step-row {
  position: relative;
  padding-left: 64px;
  margin-bottom: 30px;
  font-size: 17px;
  line-height: 1.85;
}
.step-row::before {
  counter-increment: cooking-step;
  content: counter(cooking-step);
  position: absolute;
  left: 0;
  top: 0;
  width: 44px;
  height: 44px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(217,72,48,0.28);
  transition: transform 0.2s var(--ease-spring);
}
.step-row:hover::before { transform: scale(1.12); }

/* Pro Hack Banner with Shimmer Effect */
.hack-banner {
  background: linear-gradient(135deg, #eef9fe 0%, #e1f5fe 100%);
  border: 1px solid #b3e5fc;
  border-left: 6px solid #0288d1;
  border-radius: var(--radius-md);
  padding: 26px 30px;
  margin: 40px 0;
  position: relative;
  overflow: hidden;
}
.hack-banner::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 6s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  30% { left: 150%; }
  100% { left: 150%; }
}

.hack-banner-title {
  font-size: 20px;
  font-weight: 800;
  color: #0277bd;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hack-banner p { font-size: 16px; color: #01579b; margin: 0; line-height: 1.75; }

/* Nutrition Table */
.nutrition-card {
  background: var(--bg);
  border-radius: var(--radius-md);
  padding: 26px;
  margin: 40px 0;
  border: 1px solid var(--border);
}
.nutrition-card h4 {
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 16px;
  color: var(--text-muted);
}
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  text-align: center;
}
.nutri-box {
  background: #fff;
  padding: 14px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  transition: transform 0.2s ease;
}
.nutri-box:hover { transform: translateY(-3px); }
.nutri-num { font-size: 19px; font-weight: 800; color: var(--text); }
.nutri-label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-top: 3px; }

/* Interactive FAQ Accordion */
.faq-wrap { margin: 44px 0; }
.faq-wrap h3 { font-size: 28px; font-weight: 800; margin-bottom: 22px; }
.faq-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 14px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.faq-card:hover { border-color: var(--primary); }
.faq-header {
  padding: 20px 24px;
  font-weight: 800;
  font-size: 17px;
  color: var(--text);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
.faq-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}
.faq-card.open .faq-icon { transform: rotate(45deg); color: var(--primary); }
.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s var(--ease-smooth), padding 0.35s ease;
  padding: 0 24px;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.75;
}
.faq-card.open .faq-body {
  max-height: 250px;
  padding: 0 24px 20px;
}

/* Author Bio Card */
.author-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 34px;
  margin: 52px 0;
  display: flex;
  align-items: center;
  gap: 26px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;
}
.author-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.author-avatar {
  width: 96px;
  height: 96px;
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
  gap: 16px;
  padding: 26px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin: 44px 0;
  flex-wrap: wrap;
}
.share-label { font-size: 14px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  transition: all 0.25s var(--ease-spring);
}
.share-pinterest { background: #e60023; }
.share-facebook { background: #1877f2; }
.share-twitter { background: #000000; }
.share-btn:hover { opacity: 0.95; transform: translateY(-3px) scale(1.04); }

/* Floating Back To Top Button */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  border: none;
  box-shadow: 0 6px 20px rgba(217,72,48,0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s var(--ease-spring);
  z-index: 500;
}
.back-to-top.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.back-to-top:hover {
  background: var(--primary-dark);
  transform: translateY(-4px) scale(1.1);
}

/* Toast Notification */
.toast-msg {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: #1f2421;
  color: #fff;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  opacity: 0;
  transition: all 0.4s var(--ease-spring);
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 10px;
}
.toast-msg.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s var(--ease-smooth), transform 0.8s var(--ease-smooth);
}
.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Footer */
.footer {
  background: #141816;
  color: #9ca3af;
  padding: 76px 24px 38px;
  margin-top: 96px;
  position: relative;
}
.footer-wrap {
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 50px;
  border-bottom: 1px solid #262c29;
}
.footer-brand h3 { color: #fff; font-size: 28px; margin-bottom: 14px; }
.footer-col h4 { color: #fff; font-size: 16px; margin-bottom: 18px; font-weight: 700; }
.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 12px; }
.footer-col a:hover { color: var(--primary); }
.footer-bottom {
  max-width: 1240px;
  margin: 32px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

/* Print Friendly */
@media print {
  .top-bar, .navbar, .action-buttons, .hero-tag, .search-wrapper, .categories-bar, .social-share, .author-card, .footer, .back-to-top, .toast-msg {
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

/* Responsive */
@media (max-width: 768px) {
  .hero h1 { font-size: 36px; }
  .article-header h1 { font-size: 32px; }
  .recipe-card-box { padding: 26px 20px; }
  .recipe-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .nutrition-grid { grid-template-columns: repeat(3, 1fr); }
  .author-card { flex-direction: column; text-align: center; }
  .footer-wrap { grid-template-columns: 1fr; gap: 32px; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
  .nav-links { display: none; }
}
`;

// HTML Shell Template
function layout(title, content, meta = {}) {
  const metaDesc = meta.description || SITE_DESC;
  const canonical = meta.canonical || SITE_URL;
  const ogImage = meta.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80';
  const schemas = meta.schemas || [];

  const schemasHtml = schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${SITE_NAME}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="author" content="Mia">
  <meta name="theme-color" content="#d94830">

  <!-- OpenGraph -->
  <meta property="og:type" content="${meta.type || 'website'}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${title} | ${SITE_NAME}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="en_US">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} | ${SITE_NAME}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>${GLOBAL_CSS}</style>
  ${schemasHtml}
</head>
<body>

  <!-- Top Reading Progress -->
  <div class="scroll-progress-bar" id="progressBar"></div>

  <!-- Ambient Light Orbs -->
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>

  <!-- Announcement Bar -->
  <aside class="top-bar">
    <span>✨ New Recipe Alert!</span> Easy 15-Minute Meals & Kitchen Hacks Updated Daily • <a href="/#recipes" style="text-decoration: underline; color: #fff;">Explore Today's Picks &rarr;</a>
  </aside>

  <!-- Navigation -->
  <header class="navbar">
    <div class="nav-container">
      <div class="logo-group">
        <a href="/" class="logo">ViralMia <span>Kitchen</span></a>
        <span class="logo-tagline">Fast • Cozy • Simple</span>
      </div>
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/category/quick-dinners">Quick Dinners</a>
        <a href="/category/air-fryer-meals">Air Fryer</a>
        <a href="/category/kitchen-hacks">Kitchen Hacks</a>
        <a href="/about">About Mia</a>
        <a href="/contact" class="nav-cta">Say Hello 👋</a>
      </nav>
    </div>
  </header>

  ${content}

  <!-- Floating Back to Top Button -->
  <button class="back-to-top" id="backToTop" aria-label="Back to Top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">↑</button>

  <!-- Toast Notification Container -->
  <div class="toast-msg" id="toastMsg"><span>✨</span> <span id="toastText">Action completed!</span></div>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-wrap">
      <div class="footer-brand">
        <h3>ViralMia Kitchen</h3>
        <p>Real-life tested 15-minute meals, budget comfort food, and smart kitchen hacks designed for busy weeknights, tiny kitchens, and hungry hearts.</p>
        <p style="margin-top: 14px; font-size: 13px; color: #6b7280;">Made with love in our cozy apartment kitchen. ❤️</p>
      </div>
      <div class="footer-col">
        <h4>Recipe Categories</h4>
        <ul>
          <li><a href="/category/quick-dinners">Quick Dinners (15 Mins)</a></li>
          <li><a href="/category/air-fryer-meals">Air Fryer Favorites</a></li>
          <li><a href="/category/kitchen-hacks">Life-Saving Kitchen Hacks</a></li>
          <li><a href="/category/comfort-food">Cozy Comfort Meals</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>About & Legal</h4>
        <ul>
          <li><a href="/about">About Mia</a></li>
          <li><a href="/contact">Get in Touch</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/sitemap.xml">XML Sitemap</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} ViralMia.me. All rights reserved.</p>
      <p>Created for home cooks across the USA.</p>
    </div>
  </footer>

  <!-- PRO JAVASCRIPT: Scroll Animations, Live Search, Checklists, Back to Top -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Scroll Progress Bar
      const progressBar = document.getElementById('progressBar');
      const backToTop = document.getElementById('backToTop');

      window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';

        if (backToTop) {
          if (winScroll > 400) {
            backToTop.classList.add('show');
          } else {
            backToTop.classList.remove('show');
          }
        }
      });

      // 2. Intersection Observer Scroll Reveal Animation
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
      } else {
        revealElements.forEach(el => el.classList.add('revealed'));
      }

      // 3. Live Search Filter
      const searchInput = document.getElementById('recipe-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          const cards = document.querySelectorAll('.post-card');
          cards.forEach(card => {
            const title = card.querySelector('.post-card-title').textContent.toLowerCase();
            const desc = card.querySelector('.post-card-desc').textContent.toLowerCase();
            const cat = card.querySelector('.card-badge').textContent.toLowerCase();
            if (title.includes(query) || desc.includes(query) || cat.includes(query)) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      }

      // 4. Interactive Ingredient Checkbox with Strikethrough
      const ingItems = document.querySelectorAll('.ing-item');
      ingItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
              item.classList.add('checked');
            } else {
              item.classList.remove('checked');
            }
          });
        }
      });

      // 5. Interactive FAQ Accordion
      const faqHeaders = document.querySelectorAll('.faq-header');
      faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const card = header.closest('.faq-card');
          card.classList.toggle('open');
        });
      });
    });

    // Helper Toast Notification
    function showToast(msg) {
      const toast = document.getElementById('toastMsg');
      const text = document.getElementById('toastText');
      if (toast && text) {
        text.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
      }
    }
  </script>

</body>
</html>`;
}

// Generate Homepage
function buildHomePage(posts, currentCategory = 'All') {
  const categories = ['All', ...new Set(posts.map(p => p.category))];

  const catPills = categories.map(cat => {
    const isAct = cat === currentCategory;
    const href = cat === 'All' ? '/' : `/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return `<a href="${href}" class="cat-btn ${isAct ? 'active' : ''}">${cat}</a>`;
  }).join('');

  const postCards = posts.map(post => `
    <article class="post-card reveal-on-scroll" data-category="${post.category}">
      <div class="card-img-wrap">
        <a href="/recipes/${post.slug}">
          <img class="post-card-img" src="${post.heroImage}" alt="${post.title}" loading="lazy">
        </a>
        <span class="card-badge">${post.category}</span>
      </div>
      <div class="post-card-body">
        <div class="card-meta-row">
          <div class="card-rating">
            ★★★★★ <strong>${post.rating}</strong> <span>(${post.reviewCount})</span>
          </div>
          <span>⏱️ ${post.cookTime || '15 mins'}</span>
        </div>
        <h2 class="post-card-title">
          <a href="/recipes/${post.slug}">${post.title}</a>
        </h2>
        <p class="post-card-desc">${post.description}</p>
        <div class="card-footer">
          <div class="card-footer-info">
            <span>By Mia</span>
            <span>•</span>
            <span>${post.readTime}</span>
          </div>
          <a href="/recipes/${post.slug}" class="view-btn-arrow">View Recipe &rarr;</a>
        </div>
      </div>
    </article>
  `).join('');

  const content = `
    <section class="hero">
      <div class="hero-tag">✨ Welcome to Mia's Cozy Food Journal</div>
      <h1>Quick 15-Minute Meals & Brilliant Kitchen Hacks</h1>
      <p>Tested, budget-friendly comfort food recipes and real kitchen hacks tested in my own apartment kitchen for hungry, exhausted weeknights.</p>

      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="recipe-search" class="search-input" placeholder="Search 15-min pasta, air fryer chicken, storage hacks...">
      </div>
    </section>

    <div class="categories-bar">
      ${catPills}
    </div>

    <main class="posts-grid" id="recipes">
      ${postCards}
    </main>
  `;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": SITE_DESC,
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
    "logo": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80",
    "sameAs": [
      "https://pinterest.com/viralmiakitchen",
      "https://instagram.com/viralmiakitchen"
    ]
  };

  return layout('Quick 15-Minute Meals & Smart Kitchen Hacks', content, {
    canonical: currentCategory === 'All' ? SITE_URL : `${SITE_URL}/category/${currentCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    schemas: [websiteSchema, orgSchema]
  });
}

// Generate Single Recipe Page
function buildRecipePage(post) {
  const ingredientsHtml = post.ingredients.map(ing => `
    <li class="ing-item">
      <input type="checkbox" id="ing-${Math.random().toString(36).substr(2, 9)}">
      <label>${ing}</label>
    </li>
  `).join('');

  const stepsHtml = post.instructions.map(step => `
    <li class="step-row">${step}</li>
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

  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": post.title,
    "image": [post.heroImage],
    "author": { "@type": "Person", "name": "Mia", "url": `${SITE_URL}/about` },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": { "@type": "ImageObject", "url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80" }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "description": post.description,
    "prepTime": "PT10M",
    "cookTime": "PT15M",
    "totalTime": "PT25M",
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
    "recipeInstructions": post.instructions.map((step, idx) => ({
      "@type": "HowToStep",
      "name": `Step ${idx + 1}`,
      "text": step
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": post.category, "item": `${SITE_URL}/category/${post.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `${SITE_URL}/recipes/${post.slug}` }
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

  const schemas = [recipeSchema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);

  const shareUrl = encodeURIComponent(`${SITE_URL}/recipes/${post.slug}`);
  const shareTitle = encodeURIComponent(post.title);
  const shareImg = encodeURIComponent(post.heroImage);

  const content = `
    <article class="article-wrap">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> &rarr; 
        <a href="/category/${post.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${post.category}</a> &rarr; 
        <span>${post.title}</span>
      </nav>

      <!-- Article Header -->
      <header class="article-header reveal-on-scroll">
        <div class="hero-tag">${post.category}</div>
        <h1>${post.title}</h1>
        <div class="article-byline">
          <span>By <strong>Mia</strong></span>
          <span>•</span>
          <span>Published on ${post.date}</span>
          <span>•</span>
          <span style="color: var(--gold); font-weight: 700;">★★★★★ ${post.rating} (${post.reviewCount} Reviews)</span>
        </div>

        <!-- Jump to Recipe & Print Actions -->
        <div class="action-buttons">
          <a href="#recipe-card" class="btn-action btn-primary-action">Jump to Recipe ⬇️</a>
          <button onclick="window.print(); showToast('🖨️ Opening printable recipe card...');" class="btn-action">🖨️ Print Recipe</button>
        </div>
      </header>

      <img class="article-hero reveal-on-scroll" src="${post.heroImage}" alt="${post.title}" width="1200" height="675">

      <!-- Personal Diary Intro -->
      <div class="diary-card reveal-on-scroll">
        <div class="diary-badge">💌 Mia's Kitchen Diary</div>
        <p class="diary-text">${post.story}</p>
      </div>

      <!-- Social Sharing Bar -->
      <div class="social-share reveal-on-scroll">
        <span class="share-label">Save & Share:</span>
        <a href="https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${shareImg}&description=${shareTitle}" target="_blank" rel="noopener" class="share-btn share-pinterest" onclick="showToast('📌 Saved to Pinterest!')">📌 Save to Pinterest</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" class="share-btn share-facebook">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener" class="share-btn share-twitter">X (Twitter)</a>
      </div>

      <!-- THE OFFICIAL PRINTABLE RECIPE CARD -->
      <div class="recipe-card-box reveal-on-scroll" id="recipe-card">
        <div class="recipe-card-header">
          <h2>${post.title}</h2>
          <p class="recipe-card-desc">${post.description}</p>
          <div class="servings-controller">
            <span>Serving Size: <strong>${post.servings}</strong></span>
          </div>
        </div>

        <!-- Stats Grid -->
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
            <span class="stat-label">Yields</span>
            <span class="stat-val">🍽️ ${post.servings}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Calories</span>
            <span class="stat-val">🔥 ${post.calories}</span>
          </div>
        </div>

        <!-- Ingredients Checklist -->
        <section class="ingredients-sec">
          <h3>🛒 Ingredients Checklist</h3>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px;">Tick items off as you gather them from your fridge and pantry:</p>
          <ul class="ingredients-list">
            ${ingredientsHtml}
          </ul>
        </section>

        <!-- Step by Step Instructions -->
        <section class="steps-sec">
          <h3>👩‍🍳 Step-by-Step Cooking Instructions</h3>
          <ol class="steps-list">
            ${stepsHtml}
          </ol>
        </section>

        <!-- Mia's Secret Kitchen Hack -->
        <div class="hack-banner">
          <div class="hack-banner-title">💡 Mia's Secret Kitchen Hack</div>
          <p>${post.proHack}</p>
        </div>

        <!-- Storage & Reheating -->
        <div style="margin: 32px 0;">
          <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 10px;">🥡 How to Store & Reheat Leftovers</h3>
          <p style="font-size: 16px; color: var(--text-muted); line-height: 1.8;">${post.storage}</p>
        </div>

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
      </div>

      <!-- FAQ Section with Accordion -->
      <section class="faq-wrap reveal-on-scroll">
        <h3>❓ Frequently Asked Questions</h3>
        ${faqsHtml}
      </section>

      <!-- Author Bio Card -->
      <div class="author-card reveal-on-scroll">
        <img class="author-avatar" src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=200&q=80" alt="Mia cooking">
        <div class="author-info">
          <h4>Hi, I'm Mia! 👋</h4>
          <p>I create fast 15-minute recipes and time-saving kitchen hacks for busy home cooks who love comfort food but hate washing dishes. Have questions? Leave a comment below or tag <strong>#ViralMiaKitchen</strong> on social media!</p>
        </div>
      </div>
    </article>
  `;

  return layout(post.title, content, {
    description: post.description,
    canonical: `${SITE_URL}/recipes/${post.slug}`,
    image: post.heroImage,
    type: 'article',
    schemas
  });
}

// Generate Static Pages (About, Contact, Privacy Policy, Terms)
function buildStaticPages() {
  const aboutContent = `
    <article class="article-wrap">
      <header class="article-header">
        <div class="hero-tag">Our Mission</div>
        <h1>Meet Mia: Quick Meals for Busy Lives</h1>
      </header>
      <img class="article-hero" src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80" alt="Mia in kitchen">
      <div class="article-body" style="font-size: 18px; line-height: 1.8; color: #374151;">
        <p style="margin-bottom: 20px;">Welcome to <strong>ViralMia Kitchen</strong>! If you’re exhausted after a long day of work and the idea of spending 90 minutes over a hot stove feels impossible, you’ve found your safe haven.</p>
        <p style="margin-bottom: 20px;">I started this food journal because I love good food, but I live in a tiny apartment with limited kitchen counter space and a very busy schedule. I realized that delicious cooking doesn’t require expensive gadgets or gourmet ingredients—it requires <strong>smart hacks and reliable 15-minute formulas</strong>.</p>
        <h2 style="font-size: 28px; margin: 36px 0 16px; font-weight: 800;">Our 3 Golden Cooking Rules</h2>
        <ul style="margin-bottom: 24px; padding-left: 24px;">
          <li style="margin-bottom: 12px;"><strong>15-Minute Target:</strong> Recipes are designed to go from fridge to plate in 15-20 minutes.</li>
          <li style="margin-bottom: 12px;"><strong>Pantry-Friendly:</strong> Ingredients available at any neighborhood Walmart, Aldi, or Trader Joe’s.</li>
          <li style="margin-bottom: 12px;"><strong>Minimal Dishes:</strong> One-pot and sheet-pan meals wherever possible.</li>
        </ul>
      </div>
    </article>
  `;
  ensureDir(path.join(DIST_DIR, 'about'));
  fs.writeFileSync(path.join(DIST_DIR, 'about', 'index.html'), layout('About Mia', aboutContent, { canonical: `${SITE_URL}/about` }));

  const contactContent = `
    <article class="article-wrap">
      <header class="article-header">
        <div class="hero-tag">Say Hello</div>
        <h1>Get in Touch with Mia</h1>
        <p style="color: var(--text-muted); font-size: 18px;">Have a recipe question, cooking question, or brand collaboration?</p>
      </header>
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 40px; text-align: center; box-shadow: var(--shadow-sm);">
        <p style="font-size: 18px; margin-bottom: 16px;">We love hearing from our community of passionate home cooks!</p>
        <p style="font-size: 24px; font-weight: 800; color: var(--primary);">📧 hello@viralmia.me</p>
        <p style="margin-top: 24px; color: var(--text-muted); font-size: 15px;">For recipe licensing, brand sponsorships, or press inquiries, please mention <em>[Partnership]</em> in your email subject line.</p>
      </div>
    </article>
  `;
  ensureDir(path.join(DIST_DIR, 'contact'));
  fs.writeFileSync(path.join(DIST_DIR, 'contact', 'index.html'), layout('Contact Us', contactContent, { canonical: `${SITE_URL}/contact` }));

  const privacyContent = `
    <article class="article-wrap">
      <header class="article-header">
        <h1>Privacy Policy</h1>
        <p style="color: var(--text-muted);">Last Updated: November 2026</p>
      </header>
      <div style="font-size: 16px; line-height: 1.8; color: #374151;">
        <p style="margin-bottom: 16px;">Your privacy is critically important to us at ViralMia.me. This Privacy Policy document outlines how we collect, use, and safeguard personal information.</p>
        <h2 style="font-size: 22px; margin: 24px 0 12px; font-weight: 800;">Log Files & Analytics</h2>
        <p style="margin-bottom: 16px;">ViralMia.me follows standard procedures of using log files and privacy-focused analytics to track website visits, popular recipes, and overall traffic patterns.</p>
        <h2 style="font-size: 22px; margin: 24px 0 12px; font-weight: 800;">Google AdSense & Cookies</h2>
        <p style="margin-bottom: 16px;">Third-party advertising partners, including Google AdSense, may use cookies, web beacons, and JavaScript to serve personalized advertisements based on previous website interactions. Users may opt out of personalized advertising by visiting Google Ads Settings.</p>
      </div>
    </article>
  `;
  ensureDir(path.join(DIST_DIR, 'privacy-policy'));
  fs.writeFileSync(path.join(DIST_DIR, 'privacy-policy', 'index.html'), layout('Privacy Policy', privacyContent, { canonical: `${SITE_URL}/privacy-policy` }));

  const termsContent = `
    <article class="article-wrap">
      <header class="article-header">
        <h1>Terms of Service</h1>
        <p style="color: var(--text-muted);">Last Updated: November 2026</p>
      </header>
      <div style="font-size: 16px; line-height: 1.8; color: #374151;">
        <p style="margin-bottom: 16px;">By accessing and using ViralMia.me, you agree to comply with and be bound by the following terms of use.</p>
        <h2 style="font-size: 22px; margin: 24px 0 12px; font-weight: 800;">Recipe & Nutritional Disclaimer</h2>
        <p style="margin-bottom: 16px;">All recipes, preparation instructions, and estimated nutritional values provided on ViralMia.me are for informational and culinary enjoyment purposes only. Nutritional data is calculated based on standard US grocery averages.</p>
      </div>
    </article>
  `;
  ensureDir(path.join(DIST_DIR, 'terms'));
  fs.writeFileSync(path.join(DIST_DIR, 'terms', 'index.html'), layout('Terms of Service', termsContent, { canonical: `${SITE_URL}/terms` }));
}

// Generate Sitemap & Robots.txt
function buildSitemap(posts) {
  const staticUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/contact`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/privacy-policy`, priority: '0.5', changefreq: 'yearly' },
    { loc: `${SITE_URL}/terms`, priority: '0.5', changefreq: 'yearly' }
  ];

  const postUrls = posts.map(p => ({
    loc: `${SITE_URL}/recipes/${p.slug}`,
    lastmod: p.date,
    priority: '0.9',
    changefreq: 'weekly',
    image: p.heroImage,
    title: p.title
  }));

  const allUrls = [...staticUrls, ...postUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>`}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    ${u.image ? `
    <image:image>
      <image:loc>${u.image}</image:loc>
      <image:title>${u.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt);
}

// Main Build
function main() {
  console.log('🚀 Running Elite Pro Animation & SEO Build for Viral Mia...');
  ensureDir(DIST_DIR);

  const posts = getAllPosts();
  console.log(`Loaded ${posts.length} recipes.`);

  // 1. Home
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), buildHomePage(posts));

  // 2. Individual Recipe Pages
  posts.forEach(post => {
    const postDir = path.join(DIST_DIR, 'recipes', post.slug);
    ensureDir(postDir);
    fs.writeFileSync(path.join(postDir, 'index.html'), buildRecipePage(post));
  });

  // 3. Category Pages
  const categories = [...new Set(posts.map(p => p.category))];
  categories.forEach(cat => {
    const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const catPosts = posts.filter(p => p.category === cat);
    const catDir = path.join(DIST_DIR, 'category', catSlug);
    ensureDir(catDir);
    fs.writeFileSync(path.join(catDir, 'index.html'), buildHomePage(catPosts, cat));
  });

  // 4. Static Pages
  buildStaticPages();

  // 5. Sitemap & Robots
  buildSitemap(posts);

  console.log('✨ Elite Animation Build Completed Successfully in /dist!');
}

main();
