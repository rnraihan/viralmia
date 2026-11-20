const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOPICS_FILE = path.join(__dirname, 'topics.json');
const POSTS_DIR = path.join(__dirname, 'posts');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY environment variable is missing.');
  console.error('Usage: GEMINI_API_KEY=your_key node auto_generate.js');
  process.exit(1);
}

// Verified, fast-CDN, rate-limit-free food photography pools (Unsplash + Pexels + TheMealDB)
const CURATED_FOOD_IMAGES = {
  pasta: [
    'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/wvqpwt1468339226.jpg',
    'https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg'
  ],
  chicken: [
    'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg',
    'https://www.themealdb.com/images/media/meals/cj56fs1762340001.jpg',
    'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg'
  ],
  seafood: [
    'https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg',
    'https://www.themealdb.com/images/media/meals/1548772327.jpg',
    'https://www.themealdb.com/images/media/meals/bx07m71764792853.jpg',
    'https://www.themealdb.com/images/media/meals/fpl3mv1766433431.jpg',
    'https://www.themealdb.com/images/media/meals/xxrxux1503070723.jpg'
  ],
  airFryer: [
    'https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/21yc5s1760524759.jpg',
    'https://www.themealdb.com/images/media/meals/h3ijwo1581013377.jpg'
  ],
  soup: [
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    'https://images.pexels.com/photos/31997380/pexels-photo-31997380.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://www.themealdb.com/images/media/meals/p5nzbk1782680889.jpg',
    'https://www.themealdb.com/images/media/meals/uwxqwy1483389553.jpg',
    'https://www.themealdb.com/images/media/meals/stpuws1511191310.jpg',
    'https://www.themealdb.com/images/media/meals/lx1kkj1593349302.jpg'
  ],
  breakfast: [
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg',
    'https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg',
    'https://www.themealdb.com/images/media/meals/1550441882.jpg'
  ],
  eggs: [
    'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/47y6ii1765658818.jpg'
  ],
  dessert: [
    'https://www.themealdb.com/images/media/meals/yypvst1511386427.jpg',
    'https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg',
    'https://www.themealdb.com/images/media/meals/4i5cnx1587672171.jpg',
    'https://www.themealdb.com/images/media/meals/stnxzp1784835840.jpg',
    'https://www.themealdb.com/images/media/meals/c0gmo31766594751.jpg',
    'https://www.themealdb.com/images/media/meals/y2irzl1585563479.jpg',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80'
  ],
  potato: [
    'https://images.pexels.com/photos/30485743/pexels-photo-30485743.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/z458v91763817681.jpg'
  ],
  steak: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/vussxq1511882648.jpg'
  ],
  sausage: [
    'https://images.pexels.com/photos/10794112/pexels-photo-10794112.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://www.themealdb.com/images/media/meals/st1ifa1583267248.jpg',
    'https://www.themealdb.com/images/media/meals/vxuyrx1511302687.jpg',
    'https://www.themealdb.com/images/media/meals/vc08jn1628769553.jpg'
  ],
  bread: [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/q47rkb1762324620.jpg',
    'https://images.pexels.com/photos/5202240/pexels-photo-5202240.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://www.themealdb.com/images/media/meals/lmc6r51764365554.jpg'
  ],
  veggie: [
    'https://images.pexels.com/photos/10487659/pexels-photo-10487659.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    'https://images.pexels.com/photos/7936662/pexels-photo-7936662.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://www.themealdb.com/images/media/meals/21yc5s1760524759.jpg'
  ],
  hack: [
    'https://images.pexels.com/photos/36895511/pexels-photo-36895511.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/36295521/pexels-photo-36295521.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/19813728/pexels-photo-19813728.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1200&q=80'
  ],
  general: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    'https://www.themealdb.com/images/media/meals/j8c1d51782772399.jpg',
    'https://www.themealdb.com/images/media/meals/ip5xtp1769779958.jpg'
  ]
};

// Load all existing posts to enforce zero duplicate images & category diversity
function getExistingPostsMeta() {
  if (!fs.existsSync(POSTS_DIR)) return { usedImages: new Set(), recentCategories: [], recentStyles: [] };
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'));
  const posts = [];
  const usedImages = new Set();

  for (const f of files) {
    try {
      const full = path.join(POSTS_DIR, f);
      const p = JSON.parse(fs.readFileSync(full, 'utf8'));
      if (p.heroImage) usedImages.add(p.heroImage);
      posts.push({ ...p, _mtime: fs.statSync(full).mtimeMs });
    } catch {}
  }

  posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0) || b._mtime - a._mtime);
  return {
    usedImages,
    recentCategories: posts.slice(0, 2).map(p => p.category),
    recentStyles: posts.slice(0, 2).map(p => p.postStyle).filter(Boolean)
  };
}

async function isImageReachable(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

// Query TheMealDB's free food photography database for an exact, unused dish photo
async function findUniqueMealDbImage(topic, usedImages) {
  const stopWords = new Set(['how', 'to', 'the', 'for', 'with', 'and', 'in', 'a', 'an', 'of', 'my', 'your', 'best', 'easy', 'quick', 'minute', 'minutes', 'viral', 'hack', 'air', 'fryer', 'one', 'pot', 'pan', 'sheet', 'crispy', 'creamy', 'homemade', 'recipe', 'recipes', 'stay', 'keep', 'fresh', 'ways', 'without', 'using', 'under', 'lazy', 'budget', 'ultimate', 'perfect', 'simple']);
  const words = topic.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !stopWords.has(w));

  // Try exact food keywords first (longest/most specific words)
  const searchTerms = [...new Set(words)].slice(0, 5);
  for (const term of searchTerms) {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`);
      if (!res.ok) continue;
      const data = await res.json();
      const meals = data.meals || [];
      for (const meal of meals) {
        if (meal.strMealThumb && !usedImages.has(meal.strMealThumb)) {
          if (await isImageReachable(meal.strMealThumb)) {
            console.log(`📸 Matched unique dish photo via TheMealDB ("${meal.strMeal}")`);
            return meal.strMealThumb;
          }
        }
      }
    } catch {}
  }
  return null;
}

async function selectUniqueSmartImage(topic, category, usedImages) {
  // 1. First try dynamic dish-specific search on TheMealDB (guarantees fresh, unique, exact-dish food photos!)
  const dynamicImg = await findUniqueMealDbImage(topic, usedImages);
  if (dynamicImg) return dynamicImg;

  // 2. Next pick strictly matched curated pool (fixed keyword precedence so "crispy" never triggers dessert!)
  const text = `${topic} ${category}`.toLowerCase();
  let pool = CURATED_FOOD_IMAGES.general;

  if (text.includes('salmon') || text.includes('shrimp') || text.includes('fish') || text.includes('tuna') || text.includes('cod')) {
    pool = CURATED_FOOD_IMAGES.seafood;
  } else if (text.includes('steak') || text.includes('beef') || text.includes('burger') || text.includes('meatball')) {
    pool = CURATED_FOOD_IMAGES.steak;
  } else if (text.includes('sausage') || text.includes('kielbasa')) {
    pool = CURATED_FOOD_IMAGES.sausage;
  } else if (text.includes('soup') || text.includes('stew') || text.includes('chili') || text.includes('chowder')) {
    pool = CURATED_FOOD_IMAGES.soup;
  } else if (text.includes('pasta') || text.includes('spaghetti') || text.includes('noodle') || text.includes('ramen') || text.includes('gnocchi') || text.includes('mac') || text.includes('lasagna')) {
    pool = CURATED_FOOD_IMAGES.pasta;
  } else if (text.includes('chicken') || text.includes('turkey') || text.includes('wings')) {
    pool = CURATED_FOOD_IMAGES.chicken;
  } else if (text.includes('carrot') || text.includes('celery') || text.includes('broccoli') || text.includes('zucchini') || text.includes('green bean') || text.includes('avocado') || text.includes('salad') || text.includes('veggie')) {
    pool = CURATED_FOOD_IMAGES.veggie;
  } else if (text.includes('potato') || text.includes('mashed')) {
    pool = CURATED_FOOD_IMAGES.potato;
  } else if (text.includes('egg') || text.includes('omelet') || text.includes('boiled')) {
    pool = CURATED_FOOD_IMAGES.eggs;
  } else if (text.includes('pancake') || text.includes('waffle') || text.includes('breakfast') || text.includes('french toast') || text.includes('oatmeal')) {
    pool = CURATED_FOOD_IMAGES.breakfast;
  } else if (text.includes('biscuit') || text.includes('bread') || text.includes('brie') || text.includes('roll') || text.includes('garlic knot')) {
    pool = CURATED_FOOD_IMAGES.bread;
  } else if (text.includes('brownie') || text.includes('cookie') || text.includes('cake') || text.includes('donut') || text.includes('apple crisp') || text.includes('pear crisp') || text.includes('crumble') || text.includes('pie') || text.includes('dessert') || text.includes('chocolate')) {
    pool = CURATED_FOOD_IMAGES.dessert;
  } else if (text.includes('air fryer')) {
    pool = CURATED_FOOD_IMAGES.airFryer;
  } else if (text.includes('hack') || text.includes('store') || text.includes('storage') || text.includes('clean') || text.includes('peel') || text.includes('freeze') || text.includes('reheat') || text.includes('chop')) {
    pool = CURATED_FOOD_IMAGES.hack;
  }

  // Strictly choose an UNUSED verified image from the matched pool first
  const unusedInPool = pool.filter(u => !usedImages.has(u));
  for (const candidate of unusedInPool) {
    if (await isImageReachable(candidate)) return candidate;
  }

  // 3. Fallback: pick ANY unused verified image across all curated pools
  const allCurated = [...new Set(Object.values(CURATED_FOOD_IMAGES).flat())].filter(u => !usedImages.has(u));
  for (const candidate of allCurated) {
    if (await isImageReachable(candidate)) return candidate;
  }

  // 4. Last-resort fallback: grab a random unused meal photo from TheMealDB
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const r = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      if (r.ok) {
        const d = await r.json();
        const thumb = d.meals?.[0]?.strMealThumb;
        if (thumb && !usedImages.has(thumb)) return thumb;
      }
    } catch {}
  }

  return pool[0];
}

// 6 Distinct Authentic Human Editorial Styles (Prevents Robotic Footprint)
const EDITORIAL_STYLES = [
  {
    id: 'weeknight-save',
    name: 'The Exhausted Weeknight Save',
    storyHeading: 'Why This Saved My Tuesday Night',
    hackHeading: 'The One Shortcut That Matters',
    storageHeading: 'Leftovers & Next-Day Lunch Tips',
    stepRange: '4 to 5 concise steps',
    faqCount: '2 or 3 practical questions',
    guideline: 'Tone: Witty, honest, tired US home cook coming home at 6:30 PM. Skip long backstory—focus on speed, one-pan practicality, and beating $35 DoorDash fees. Vary your opening sentence naturally (NEVER start with "Look, I love" or "Nothing beats").'
  },
  {
    id: 'kitchen-science',
    name: 'Test-Kitchen Food Science Breakdown',
    storyHeading: 'The Kitchen Science Behind This Method',
    hackHeading: 'Why This Technique Actually Works',
    storageHeading: 'How to Keep the Texture Perfect Later',
    stepRange: '4 to 6 precise steps',
    faqCount: '3 specific troubleshooting questions',
    guideline: 'Tone: Curious, authoritative, practical food editor (like Serious Eats meets everyday home cooking). Explain the concrete culinary science (heat transfer, Maillard browning, moisture control, emulsion, acid balance) in friendly, crystal-clear English.'
  },
  {
    id: 'budget-hacker',
    name: 'The Smart US Grocery Budget Cook',
    storyHeading: 'How to Make This for a Fraction of Takeout Cost',
    hackHeading: 'Mia\'s Pantry Stretch Trick',
    storageHeading: 'Meal-Prep & Freezer Game Plan',
    stepRange: '3 to 5 clear steps',
    faqCount: '2 or 3 substitution/budget questions',
    guideline: 'Tone: Clever, dollar-smart home cook sharing real grocery math ($3–$5 per serving vs $22 restaurant plate). Casually mention real US staples (Aldi, Trader Joe\'s, Kirkland/Costco, kosher salt, garlic powder) and easy swaps using what\'s already in the fridge.'
  },
  {
    id: 'cozy-journal',
    name: 'Cozy Home Kitchen Journal',
    storyHeading: 'Notes From Mia\'s Kitchen',
    hackHeading: 'My Favorite Flavor Upgrade',
    storageHeading: 'Storing & Reheating Without Losing Flavor',
    stepRange: '5 to 6 sensory steps',
    faqCount: '3 warm reader questions',
    guideline: 'Tone: Warm, vivid, sensory food writing focused on aroma, texture, sizzling butter, toasted spices, and cozy weeknight comfort. Include one honest trial-and-error lesson from testing the dish.'
  },
  {
    id: 'minimalist-pan',
    name: 'The Minimalist One-Pan Cook',
    storyHeading: 'Big Flavor, Almost Zero Cleanup',
    hackHeading: 'Don\'t Skip This Crucial Step',
    storageHeading: 'Fridge & Reheat Guide',
    stepRange: '3 to 5 tight steps',
    faqCount: '2 direct questions',
    guideline: 'Tone: Crisp, direct, no-fluff editorial voice for cooks who hate scrubbing piles of dishes. Emphasize smart prep order so everything lands in one skillet, sheet pan, or air fryer basket.'
  },
  {
    id: 'crowd-pleaser',
    name: 'Weekend & Family Crowd-Pleaser',
    storyHeading: 'Why Everyone Asks for This Recipe',
    hackHeading: 'Make-Ahead & Hosting Secret',
    storageHeading: 'Keeping Leftovers Fresh All Week',
    stepRange: '4 to 6 clear steps',
    faqCount: '3 or 4 helpful reader questions',
    guideline: 'Tone: Enthusiastic, generous, seasoned home host sharing a reliable crowd-pleaser for family dinners, potlucks, or lazy Sundays. Mention easy scaling and serving pairings.'
  }
];

// Pick next pending topic from a DIFFERENT category than recent posts (natural editorial variety)
function pickDiversePendingTopic(topics, recentCategories) {
  const pending = topics.filter(t => t.status === 'pending');
  if (pending.length === 0) return null;

  // Prefer a category not used in the last 2 posts
  const freshCategoryTopic = pending.find(t => !recentCategories.includes(t.category));
  if (freshCategoryTopic) return freshCategoryTopic;

  // Otherwise at least avoid the immediately preceding post's category
  const diffFromLast = pending.find(t => t.category !== recentCategories[0]);
  return diffFromLast || pending[0];
}

async function generateNextPost() {
  if (!fs.existsSync(TOPICS_FILE)) {
    console.error('❌ Error: topics.json not found!');
    return;
  }

  const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  const { usedImages, recentCategories, recentStyles } = getExistingPostsMeta();
  const targetTopic = pickDiversePendingTopic(topics, recentCategories);

  if (!targetTopic) {
    console.log('🎉 All topics have been generated and published!');
    return;
  }

  // Pick an editorial style NOT used in the last 2 posts
  const availableStyles = EDITORIAL_STYLES.filter(s => !recentStyles.includes(s.id));
  const stylePool = availableStyles.length > 0 ? availableStyles : EDITORIAL_STYLES;
  const chosenStyle = stylePool[Math.floor(Math.random() * stylePool.length)];

  const isKitchenHack = targetTopic.category === 'Kitchen Hacks';
  const randomServings = isKitchenHack ? '1 Batch' : String([2, 3, 4, 4, 6][Math.floor(Math.random() * 5)]);
  const randomRating = (4.8 + Math.random() * 0.2).toFixed(1);
  const randomReviews = Math.floor(Math.random() * 38) + 29;
  const dynamicTemp = (0.78 + Math.random() * 0.14).toFixed(2);

  console.log(`🍳 Generating Authentic Post: "${targetTopic.topic}" [${targetTopic.category}]`);
  console.log(`🎭 Style Archetype: "${chosenStyle.name}" | Temp: ${dynamicTemp}`);

  const prompt = `You are "Mia", an authentic, experienced US home cook and food writer publishing on "Viral Mia Kitchen" (viralmia.me).

EDITORIAL STYLE FOR THIS SPECIFIC POST:
- Archetype: ${chosenStyle.name}
- ${chosenStyle.guideline}
- Post Type: ${isKitchenHack ? 'Practical Kitchen Hack / Food-Science How-To Guide (NOT a full dinner recipe)' : 'Tested Everyday US Recipe'}

STRICT AUTHENTICITY & ANTI-AI FOOTPRINT RULES:
1. FORBIDDEN AI CLICHES: NEVER use "delve", "testament", "symphony of flavors", "culinary masterpiece", "game-changer", "elevate", "nestled", "tapestry", "embark", "mouthwatering delight", or open your story with "Look, I love..." or "Nothing beats...".
2. DISTINCT HUMAN VOICE: Write like a real published US food editor—natural contractions, concrete sensory details, realistic kitchen timings, and zero robotic filler.
3. REAL TEST-KITCHEN LESSON (E-E-A-T): Share one brief, specific mistake or testing discovery (e.g., exact pan temp, resting time, moisture trick, or ingredient brand insight).
4. AUTHENTIC US PANTRY & UNITS: Standard US measurements (cups, tbsp, tsp, oz, °F, mins) and natural mentions of real US staples when relevant.
5. NATURAL STRUCTURAL VARIETY: Write ${chosenStyle.stepRange} (do NOT prefix steps with "Step 1:" — just write each step directly) and ${chosenStyle.faqCount}.

TOPIC TO WRITE ABOUT:
- Topic: "${targetTopic.topic}"
- Category: "${targetTopic.category}"
- Primary Keyword: "${targetTopic.keyword}"

Return ONLY a valid raw JSON object (no markdown code fences) with these exact keys:
{
  "title": "Natural, high-CTR, human US food-blog headline (avoid generic AI phrasing)",
  "slug": "clean-lowercase-hyphenated-slug",
  "description": "Compelling 140-158 character SEO meta description for US Google searchers",
  "category": "${targetTopic.category}",
  "postStyle": "${chosenStyle.id}",
  "storyHeading": "${chosenStyle.storyHeading}",
  "hackHeading": "${chosenStyle.hackHeading}",
  "storageHeading": "${chosenStyle.storageHeading}",
  "date": "${new Date().toISOString().split('T')[0]}",
  "readTime": "${Math.floor(Math.random() * 2) + 3} min read",
  "prepTime": "${isKitchenHack ? '3 mins' : 'e.g. 8 mins'}",
  "cookTime": "${isKitchenHack ? '0 mins' : 'e.g. 14 mins'}",
  "servings": "${randomServings}",
  "calories": "${isKitchenHack ? 'N/A' : 'e.g. 385 kcal'}",
  "costPerServing": "${isKitchenHack ? 'Under $1' : 'e.g. ~$3.50 / serving'}",
  "rating": "${randomRating}",
  "reviewCount": ${randomReviews},
  "nutrition": {
    "calories": "${isKitchenHack ? 'N/A' : '385 kcal'}",
    "protein": "${isKitchenHack ? '0g' : '24g'}",
    "carbs": "${isKitchenHack ? '0g' : '34g'}",
    "fat": "${isKitchenHack ? '0g' : '15g'}",
    "fiber": "${isKitchenHack ? '0g' : '4g'}"
  },
  "story": "An authentic, fresh 130-175 word personal intro written strictly in the '${chosenStyle.name}' voice with a real testing insight.",
  "ingredients": [
    "5 to 9 specific ${isKitchenHack ? 'supplies or pantry items' : 'ingredients with exact US measurements'}"
  ],
  "instructions": [
    "Clear direct step without 'Step 1:' prefix, rich with visual/temperature cues",
    "Next step...",
    "Next step..."
  ],
  "proHack": "Mia's genuine insider trick specific to this exact dish or hack",
  "servingIdea": "${isKitchenHack ? 'Best everyday ways to use this hack during weekly meal prep' : '1-2 delicious US side dishes, toppings, or pairings that go great with this meal'}",
  "storage": "Practical fridge/freezer storage and exact reheating instructions",
  "faqs": [
    {"question": "Specific real reader question?", "answer": "Practical, direct answer"},
    {"question": "Second specific question?", "answer": "Helpful troubleshooting or swap answer"}
  ],
  "keywords": ["5", "distinct", "US-targeted", "search", "keywords"]
}`;

  try {
    const recipeData = await callGeminiWithFallback(prompt, dynamicTemp);

    // Pick a 100% UNIQUE, verified, dish-matched image (never duplicates existing posts!)
    recipeData.heroImage = await selectUniqueSmartImage(
      recipeData.title || targetTopic.topic,
      targetTopic.category,
      usedImages
    );

    // Always sanitize slug strictly
    recipeData.slug = String(recipeData.slug || targetTopic.topic)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!recipeData.slug) recipeData.slug = `recipe-${Date.now()}`;

    // Ensure required fields exist
    if (!recipeData.title || !Array.isArray(recipeData.ingredients) || !Array.isArray(recipeData.instructions)) {
      throw new Error('Generated JSON is missing required recipe fields (title, ingredients, or instructions).');
    }
    recipeData.category = recipeData.category || targetTopic.category;
    recipeData.date = recipeData.date || new Date().toISOString().split('T')[0];
    recipeData.postStyle = recipeData.postStyle || chosenStyle.id;

    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
    let finalSlug = recipeData.slug;
    let suffix = 2;
    while (fs.existsSync(path.join(POSTS_DIR, `${finalSlug}.json`))) {
      finalSlug = `${recipeData.slug}-${suffix++}`;
    }
    recipeData.slug = finalSlug;
    const postFilePath = path.join(POSTS_DIR, `${recipeData.slug}.json`);
    fs.writeFileSync(postFilePath, JSON.stringify(recipeData, null, 2));
    console.log(`✅ Saved authentic recipe post: posts/${recipeData.slug}.json`);
    console.log(`🖼️ Unique Hero Image: ${recipeData.heroImage}`);

    targetTopic.status = 'done';
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2));

    console.log('🔄 Rebuilding static site with new recipe...');
    execSync('node build.js', { stdio: 'inherit' });
    console.log('✨ Auto-generation & build finished successfully!');
  } catch (err) {
    console.error('❌ Failed to generate post:', err.message);
    process.exit(1);
  }
}

async function callGeminiWithFallback(prompt, temperature) {
  let models = [];
  try {
    console.log('🔍 Querying available models from Gemini ModelService...');
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const listRes = await fetch(listUrl);
    if (listRes.ok) {
      const listData = await listRes.json();
      const allModels = listData.models || [];
      const excludedKeywords = ['tts', 'image', 'audio', 'embedding', 'robotics', 'computer-use', 'veo', 'imagen', 'aqa', 'learnlm'];
      const contentModels = allModels
        .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
        .map(m => m.name.replace('models/', ''))
        .filter(name => !excludedKeywords.some(kw => name.toLowerCase().includes(kw)));

      console.log('📋 Discovered supported models:', contentModels.join(', '));
      const flashModels = contentModels.filter(m => m.includes('flash'));
      const otherModels = contentModels.filter(m => !m.includes('flash'));
      models = [...flashModels, ...otherModels];
    } else {
      console.warn(`⚠️ Failed to list models (${listRes.status})`);
    }
  } catch (err) {
    console.warn('⚠️ Could not query model list:', err.message);
  }

  if (models.length === 0) {
    models = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash-002',
      'gemini-1.5-pro-002',
      'gemini-1.5-flash'
    ];
  }

  let lastError = null;
  for (const model of models) {
    try {
      console.log(`🤖 Requesting Gemini API with model: "${model}"...`);
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: parseFloat(temperature)
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`⚠️ Model "${model}" returned HTTP ${response.status}:`, errText);
        lastError = new Error(`Model ${model} failed (${response.status})`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleanedJson = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleanedJson);
        console.log(`✨ Successfully generated recipe using active model "${model}"!`);
        return parsed;
      }
    } catch (err) {
      console.warn(`⚠️ Exception calling model "${model}": ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error('All model fallbacks exhausted.');
}

generateNextPost();
