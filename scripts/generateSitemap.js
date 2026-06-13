/**
 * generateSitemap.js — Generates multilingual sitemaps.
 *
 * Outputs:
 *   public/pt/sitemap.xml
 *   public/en/sitemap.xml
 *   public/fr/sitemap.xml
 *   public/sitemap.xml  (sitemap index)
 *
 * Run: node scripts/generateSitemap.js
 * Also runs automatically on `npm run build`.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const POSTS_DIR = join(ROOT, 'src', 'content', 'posts');
const PUBLIC_DIR = join(ROOT, 'public');

// ── Config ──────────────────────────────────────────────────────────────────
const FALLBACK_SITE_URL = 'https://zynovu.com';
const SITE_URL = normalizeSiteUrl(process.env.SITE_URL || process.env.VITE_SITE_URL || FALLBACK_SITE_URL);
const SUPPORTED_LANGS = ['es', 'pt', 'en', 'fr'];

// Load categories and use localized slugs when available
const rawCategories = JSON.parse(readFileSync(join(ROOT, 'src', 'config', 'categories.json'), 'utf8'));
const CATEGORIES = Array.isArray(rawCategories) ? rawCategories : [];

// Static pages per language (localized slugs). Keep these aligned with site routes.
const STATIC_PAGES_PER_LANG = {
  es: ['quienes-somos', 'especialistas', 'contacto', 'terminos-de-uso', 'politica-de-privacidad'],
  pt: ['quem-somos', 'especialistas', 'contato', 'termos-de-uso', 'politica-de-privacidade'],
  en: ['about-us', 'specialists', 'contact', 'terms-of-use', 'privacy-policy'],
  fr: ['qui-sommes-nous', 'specialistes', 'contact', 'conditions-utilisation', 'politique-confidentialite'],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeSiteUrl(value) {
  return value.replace(/\/+$/, '');
}

function urlEntry(loc, lastmod, priority = '0.7', changefreq = 'weekly') {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function xmlDoc(urlEntries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;
}

// ── Load posts ───────────────────────────────────────────────────────────────
if (!existsSync(POSTS_DIR)) {
  mkdirSync(POSTS_DIR, { recursive: true });
}
const allPosts = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => {
    try {
      const raw = JSON.parse(readFileSync(join(POSTS_DIR, f), 'utf8'));
      return { ...raw, lang: raw.lang ?? 'es' };
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const today = new Date().toISOString().split('T')[0];

// ── Author slugs ─────────────────────────────────────────────────────────────
const AUTHOR_SLUGS = ['miguel-freitas', 'carlos-almeida', 'lucas-moraes', 'felipe-pires'];

// ── Generate per-language sitemaps ───────────────────────────────────────────
for (const lang of SUPPORTED_LANGS) {
  const entries = [];

  // Homepage (Spanish uses root without prefix)
  const prefix = lang === 'es' ? SITE_URL : `${SITE_URL}/${lang}`;
  entries.push(urlEntry(`${prefix}`, today, '1.0', 'daily'));

  // Category pages
  for (const cat of CATEGORIES) {
    const slug = (cat.slugs && cat.slugs[lang]) || cat.slug;
    entries.push(urlEntry(`${prefix}/c/${slug}`, today, '0.8', 'daily'));
  }

  // Static pages
  const staticPages = STATIC_PAGES_PER_LANG[lang] || [];
  for (const page of staticPages) {
    entries.push(urlEntry(`${prefix}/${page}`, today, '0.4', 'monthly'));
  }

  // Author pages
  for (const authorSlug of AUTHOR_SLUGS) {
    entries.push(urlEntry(`${prefix}/a/${authorSlug}/`, today, '0.6', 'weekly'));
  }

  // Articles for this language
  const langPosts = allPosts.filter((p) => p.lang === lang);
  for (const post of langPosts) {
    const lastmod = post.date ?? today;
    entries.push(urlEntry(`${prefix}/p/${post.slug}`, lastmod, '0.7', 'weekly'));
  }

  const xml = xmlDoc(entries);
  // For Spanish (root) generate sitemap-es.xml at public/, for others use /{lang}/sitemap.xml
  if (lang === 'es') {
    // Write Spanish sitemap to the site root (no /es prefix)
    const outPath = join(PUBLIC_DIR, 'sitemap.xml');
    writeFileSync(outPath, xml, 'utf8');
    console.log(`✓ sitemap.xml (root, Spanish) — ${langPosts.length} articles`);
  } else {
    const langDir = join(PUBLIC_DIR, lang);
    if (!existsSync(langDir)) mkdirSync(langDir, { recursive: true });
    const outPath = join(langDir, 'sitemap.xml');
    writeFileSync(outPath, xml, 'utf8');
    console.log(`✓ ${lang}/sitemap.xml — ${langPosts.length} articles`);
  }
}

// Note: we intentionally do not generate a sitemap index here because
// the root `public/sitemap.xml` is the Spanish sitemap (no /es prefix).
