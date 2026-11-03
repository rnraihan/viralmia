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

// Unsplash fallback curated food photos
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
];

async function generateNextPost() {
  if (!fs.existsSync(TOPICS_FILE)) {
    console.error('❌ Error: topics.json not found!');
    return;
  }

  const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  const targetTopic = topics.find(t => t.status === 'pending');

  if (!targetTopic) {
    console.log('🎉 All 100 topics have been generated and published!');
    return;
  }

  console.log(`🍳 Generating post for: "${targetTopic.topic}" (${targetTopic.category})...`);

  const prompt = `You are "Mia", a warm, relatable, 28-year-old home cook and food blogger living in a cozy apartment in the US. You run the blog "Viral Mia" (viralmia.me).

Write an engaging, SEO-optimized, highly helpful recipe post about:
Topic: "${targetTopic.topic}"
Category: "${targetTopic.category}"
Target Keyword: "${targetTopic.keyword}"

Return a STRICT JSON object with these EXACT keys:
{
  "title": "Catchy headline for American home cooks",
  "slug": "url-friendly-slug-no-special-chars",
  "description": "Engaging 150-character meta description for Google search",
  "category": "${targetTopic.category}",
  "date": "${new Date().toISOString().split('T')[0]}",
  "readTime": "3 min read",
  "prepTime": "e.g. 10 mins",
  "cookTime": "e.g. 15 mins",
  "servings": "e.g. 4",
  "calories": "e.g. 350 kcal",
  "story": "Warm, cozy, humorous personal life story (150 words) about why Mia made this dish on a busy day, relatable to working millennials and families",
  "ingredients": ["Array of ingredients with exact US measurements (cups, oz, tbsp)"],
  "instructions": ["Step 1: description", "Step 2: description", "Step 3: description", "Step 4: description"],
  "proHack": "Mia's secret, brilliant time-saving or flavor-boosting kitchen hack for this dish",
  "storage": "How to store leftovers in fridge/freezer and best reheating tips",
  "faqs": [
    {"question": "Common cooking question 1", "answer": "Helpful answer 1"},
    {"question": "Common cooking question 2", "answer": "Helpful answer 2"}
  ],
  "keywords": ["5", "relevant", "seo", "search", "keywords"]
}`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error('No content returned from Gemini.');

    const recipeData = JSON.parse(candidate);

    // Attach high-res food image
    const randomImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    recipeData.heroImage = randomImage;

    // Ensure slug
    if (!recipeData.slug) {
      recipeData.slug = targetTopic.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Save to posts directory
    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
    const postFilePath = path.join(POSTS_DIR, `${recipeData.slug}.json`);
    fs.writeFileSync(postFilePath, JSON.stringify(recipeData, null, 2));
    console.log(`✅ Saved recipe post: posts/${recipeData.slug}.json`);

    // Mark topic as done
    targetTopic.status = 'done';
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2));

    // Rebuild static site
    console.log('🔄 Rebuilding static site...');
    execSync('node build.js', { stdio: 'inherit' });
    console.log('✨ Auto-generation & build finished successfully!');

  } catch (err) {
    console.error('❌ Failed to generate post:', err.message);
    process.exit(1);
  }
}

generateNextPost();
