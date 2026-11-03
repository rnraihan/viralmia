# 🍳 Viral Mia - Automated Food & Kitchen Hacks Blog

An ultra-modern, blazing-fast, automated recipe blog designed for US audiences, running on **Cloudflare Pages** and powered by **Google Gemini AI**.

## 🌟 Features
- **100% Free Hosting:** Hosted permanently on Cloudflare Pages with free SSL.
- **3x Daily Auto-Posting:** GitHub Actions workflow generates, styles, and publishes 3 new recipes/hacks every day.
- **Rich Google Recipe SEO:** Schema.org `Recipe` JSON-LD structured data on all posts for rich snippet cards on Google Search.
- **AdSense Ready:** Includes mandatory About, Contact, Privacy Policy, Terms of Service, XML Sitemap, and Robots.txt.
- **Interactive Checklists:** Recipe cards have interactive ingredients checklists that readers can tick off while cooking.
- **100 USA Recipe Topics:** Pre-loaded queue of high-search-intent weeknight meals, air fryer hacks, and food preservation tricks.

## 🚀 Setup Steps

### 1. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new) named `viralmia`.
2. Push this folder to your repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/viralmia.git
   git push -u origin main
   ```

### 2. Add Gemini API Key Secret
In your GitHub repo:
1. Go to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Name: `GEMINI_API_KEY`
4. Value: Paste your Google AI Studio API key.

### 3. Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your `viralmia` repository.
4. Set build settings:
   - **Framework preset:** `None`
   - **Build command:** `node build.js`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**.
6. Add your custom domain `viralmia.me` in the **Custom domains** tab.
