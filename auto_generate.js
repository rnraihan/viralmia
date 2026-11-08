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

// Curated high quality food photography organized by category/keyword
const CURATED_FOOD_IMAGES = {
  pasta: [
    'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=80'
  ],
  chicken: [
    'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80'
  ],
  airFryer: [
    'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527477321055-436159750f24?auto=format&fit=crop&w=1200&q=80'
  ],
  soup: [
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'
  ],
  breakfast: [
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1200&q=80'
  ],
  eggs: [
    'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80'
  ],
  dessert: [
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'
  ],
  potato: [
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=1200&q=80'
  ],
  steak: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80'
  ],
  turkey: [
    'https://images.unsplash.com/photo-1514944298352-78d12e69888d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80'
  ],
  baking: [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80'
  ],
  hack: [
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1200&q=80'
  ],
  general: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
  ]
};

function selectSmartImage(topic, category) {
  const text = `${topic} ${category}`.toLowerCase();
  let pool = CURATED_FOOD_IMAGES.general;

  if (text.includes('steak') || text.includes('beef')) {
    pool = CURATED_FOOD_IMAGES.steak;
  } else if (text.includes('turkey')) {
    pool = CURATED_FOOD_IMAGES.turkey;
  } else if (text.includes('potato') || text.includes('mashed')) {
    pool = CURATED_FOOD_IMAGES.potato;
  } else if (text.includes('donut') || text.includes('crisp') || text.includes('bread') || text.includes('brie') || text.includes('casserole') || text.includes('baking')) {
    pool = CURATED_FOOD_IMAGES.baking;
  } else if (text.includes('egg') || text.includes('omelet') || text.includes('boiled')) {
    pool = CURATED_FOOD_IMAGES.eggs;
  } else if (text.includes('pasta') || text.includes('spaghetti') || text.includes('noodle') || text.includes('gnocchi') || text.includes('lasagna')) {
    pool = CURATED_FOOD_IMAGES.pasta;
  } else if (text.includes('air fryer')) {
    pool = CURATED_FOOD_IMAGES.airFryer;
  } else if (text.includes('chicken') || text.includes('bites') || text.includes('wings') || text.includes('meat') || text.includes('sausage')) {
    pool = CURATED_FOOD_IMAGES.chicken;
  } else if (text.includes('soup') || text.includes('stew') || text.includes('chili')) {
    pool = CURATED_FOOD_IMAGES.soup;
  } else if (text.includes('pancake') || text.includes('waffle') || text.includes('breakfast') || text.includes('toast') || text.includes('oat')) {
    pool = CURATED_FOOD_IMAGES.breakfast;
  } else if (text.includes('dessert') || text.includes('cookie') || text.includes('cake') || text.includes('sweet') || text.includes('chocolate')) {
    pool = CURATED_FOOD_IMAGES.dessert;
  } else if (text.includes('hack') || text.includes('fresh') || text.includes('storage') || text.includes('peel') || text.includes('freeze')) {
    pool = CURATED_FOOD_IMAGES.hack;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// 5 Distinct Post Archetypes / Human Moods
const HUMAN_PERSONA_MOODS = [
  {
    name: "The Exhausted Weeknight Save",
    guideline: "Tone: Funny, relatable, tired millennial after a chaotic 9-hour workday. Focuses on speed, shortcuts, 1-pot cleanup, and salvaging dinner when takeout was too expensive or slow."
  },
  {
    name: "The Frugal Grocery Budget Hacker",
    guideline: "Tone: Smart, practical, dollar-savvy home cook. Mentions saving money compared to restaurant takeout ($25 vs $4), utilizing everyday Aldi / Trader Joe's pantry items, and cost-effective swaps."
  },
  {
    name: "The Cozy Weekend Kitchen Journal",
    guideline: "Tone: Warm, sensory-rich, mindful cooking. Focuses on aromas, crackling sounds of butter and garlic, rain outside the window, favorite Spotify playlist, and true soul comfort food."
  },
  {
    name: "The Food Science & Kitchen Experimenter",
    guideline: "Tone: Enthusiastic, curious, 'game-changing discovery'. Explains why the hack or cooking method works scientifically (e.g. moisture control, starch emulsion, heat retention) in plain, punchy English."
  },
  {
    name: "The 1-Pan Minimalist & Dish-Hater",
    guideline: "Tone: Direct, witty, no-nonsense. Mia lives in a small apartment without a giant dishwasher and refuses to scrub multiple greasy pans after 8 PM."
  }
];

async function generateNextPost() {
  if (!fs.existsSync(TOPICS_FILE)) {
    console.error('❌ Error: topics.json not found!');
    return;
  }

  const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  const targetTopic = topics.find(t => t.status === 'pending');

  if (!targetTopic) {
    console.log('🎉 All topics have been generated and published!');
    return;
  }

  // Randomly pick one of the 5 human persona moods
  const randomMood = HUMAN_PERSONA_MOODS[Math.floor(Math.random() * HUMAN_PERSONA_MOODS.length)];
  const randomServings = [2, 3, 4, 4, 6][Math.floor(Math.random() * 5)];
  const randomRating = (4.8 + Math.random() * 0.2).toFixed(1);
  const randomReviews = Math.floor(Math.random() * 35) + 32;
  const dynamicTemp = (0.75 + Math.random() * 0.15).toFixed(2);

  console.log(`🍳 Generating Human-Style Post for: "${targetTopic.topic}"`);
  console.log(`🎭 Selected Style Mood: "${randomMood.name}" | Temp: ${dynamicTemp}`);

  const prompt = `You are "Mia", an authentic, warm, 28-year-old home cook living in a cozy apartment in the United States. You write the food journal "Viral Mia" (viralmia.me).

YOUR WRITING STYLE FOR THIS POST:
${randomMood.guideline}

STRICT ANTI-AI DETECTION & HUMAN EEAT RULES:
1. FORBIDDEN AI BUZZWORDS: Never use "delve", "testament", "symphony of flavors", "culinary masterpiece", "game-changer", "elevate your dish", "nestled", "tapestry", "embark", "mouthwatering delight". These scream AI bot.
2. NATURAL HUMAN VOICE: Write with genuine personality, humor, and casual contractions (I'd, couldn't, wasn't, honestly). Talk like you are messaging a food-loving friend.
3. REALISTIC MISTAKE / LESSON (EEAT): Include a brief, real-life cooking detail or testing lesson (e.g., "The first time I tested this, I cranked the skillet too high and burnt the garlic—keep the heat medium-low for that golden aroma!").
4. REAL US PANTRY & STORE MENTIONS: Casually reference real US grocery staples or stores (e.g., Kerrygold butter, Rao's marinara, Trader Joe's brioche, Aldi produce, kosher salt, avocado oil).
5. PRACTICAL MEASUREMENTS: Use standard US kitchen measurements (tablespoons, cups, ounces, minutes).

TOPIC TO WRITE ABOUT:
Topic: "${targetTopic.topic}"
Category: "${targetTopic.category}"
Target Keyword: "${targetTopic.keyword}"

Return a STRICT, RAW JSON object (no markdown code blocks, just raw JSON) with these exact keys:
{
  "title": "Natural, clickable, human title for American home cooks (not generic)",
  "slug": "url-friendly-lowercase-slug-without-special-characters",
  "description": "Engaging, high-CTR 140-160 character meta description for Google search",
  "category": "${targetTopic.category}",
  "date": "${new Date().toISOString().split('T')[0]}",
  "readTime": "3 min read",
  "prepTime": "e.g. 8 mins",
  "cookTime": "e.g. 14 mins",
  "servings": "${randomServings}",
  "calories": "e.g. 390 kcal",
  "rating": "${randomRating}",
  "reviewCount": ${randomReviews},
  "nutrition": {
    "calories": "390 kcal",
    "protein": "24g",
    "carbs": "36g",
    "fat": "14g",
    "fiber": "4g"
  },
  "story": "A rich, personal 140-180 word personal diary story by Mia reflecting the '${randomMood.name}' mood. Mention relatable apartment kitchen details, a busy day, and why this recipe saved dinner.",
  "ingredients": [
    "Array of 6 to 9 specific ingredients with exact US measurements and helpful notes"
  ],
  "instructions": [
    "Step 1: clear step description with sensory details (heat, aroma, color)",
    "Step 2: description",
    "Step 3: description",
    "Step 4: description"
  ],
  "proHack": "Mia's secret, genuine insider hack for this specific dish (e.g. temperature control, pre-salting, starch water, garlic timing)",
  "storage": "Specific, practical tips for storing leftovers in fridge or freezer and best way to reheat so it tastes fresh",
  "faqs": [
    {"question": "Can I substitute [ingredient] if I don't have it?", "answer": "Practical, flexible answer with 2 good pantry alternatives"},
    {"question": "How do I prevent [common cooking issue with this dish]?", "answer": "Clear troubleshooting tip"}
  ],
  "keywords": ["5", "distinct", "high-intent", "search", "keywords"]
}`;

  try {
    const recipeData = await callGeminiWithFallback(prompt, dynamicTemp);

    // Pick contextual high-res food image
    recipeData.heroImage = selectSmartImage(recipeData.title || targetTopic.topic, targetTopic.category);

    if (!recipeData.slug) {
      recipeData.slug = targetTopic.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
    const postFilePath = path.join(POSTS_DIR, `${recipeData.slug}.json`);
    fs.writeFileSync(postFilePath, JSON.stringify(recipeData, null, 2));
    console.log(`✅ Saved authentic human recipe post: posts/${recipeData.slug}.json`);

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
  // 1. Dynamically discover active models for this API key
  let models = [];
  try {
    console.log('🔍 Querying available models from Gemini ModelService...');
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const listRes = await fetch(listUrl);
    if (listRes.ok) {
      const listData = await listRes.json();
      const allModels = listData.models || [];
      const contentModels = allModels
        .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
        .map(m => m.name.replace('models/', ''));

      console.log('📋 Discovered supported models:', contentModels.join(', '));

      // Prioritize flash models, then any content models
      const flashModels = contentModels.filter(m => m.includes('flash'));
      const otherModels = contentModels.filter(m => !m.includes('flash'));
      models = [...flashModels, ...otherModels];
    } else {
      const listErr = await listRes.text();
      console.warn(`⚠️ Failed to list models (${listRes.status}):`, listErr);
    }
  } catch (err) {
    console.warn('⚠️ Could not query model list:', err.message);
  }

  // Fallback candidate list if discovery failed
  if (models.length === 0) {
    models = [
      'gemini-1.5-flash-002',
      'gemini-1.5-flash-001',
      'gemini-1.5-pro-002',
      'gemini-1.5-pro-001',
      'gemini-2.0-flash-exp',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-pro'
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
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
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
        console.log(`✨ Successfully generated recipe using active model "${model}"!`);
        return JSON.parse(text);
      }
    } catch (err) {
      console.warn(`⚠️ Exception calling model "${model}": ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error('All model fallbacks exhausted.');
}

generateNextPost();
