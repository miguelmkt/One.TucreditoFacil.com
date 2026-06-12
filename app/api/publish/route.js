import { slugify } from '../../../lib/slugify'
import { uploadToGithub, commitMultipleFiles } from '../../../lib/github'
import { formatReferencesContainer } from '../../../lib/referenceFormatter'
import fs from 'fs/promises'
import path from 'path'

// Controla se a publicação deve enviar automaticamente ao GitHub.
// false = salvar localmente apenas (sem executar commits/PUT no GitHub)
// true  = comportamento atual (salvar + enviar ao GitHub)
const AUTO_PUSH = true

const ARTICLES_FILE = path.join(process.cwd(), 'data', 'articles.json')
const SITES_FILE    = path.join(process.cwd(), 'data', 'sites.json')

async function readFile(f) {
  try { return JSON.parse(await fs.readFile(f, 'utf-8')) } catch { return [] }
}
async function writeArticles(data) {
  await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(data, null, 2))
}

function articleUrl(baseUrl, slug, language, type) {
  const base = baseUrl.replace(/\/$/, '')
  const prefix = type === 'presell' ? 'l' : 'p'
  return language === 'es' ? `${base}/${prefix}/${slug}` : `${base}/${language}/${prefix}/${slug}`
}

function buildSitemap(baseUrl, articles) {
  const langPrefixes = {
    es: '/',
    pt: '/pt/',
    en: '/en/',
    fr: '/fr/',
  }
  const base = baseUrl.replace(/\/$/, '')

  // Static home URL (root) always included
  const languages = [...new Set(articles.map(a => a.language).filter(Boolean))]
  const staticUrls = [base, ...languages.map(lang => `${base}${langPrefixes[lang] || '/'}`)]

  const articleUrls = [...articles]
    .sort((a, b) => new Date(a.publishedAt || a.createdAt || 0) - new Date(b.publishedAt || b.createdAt || 0))
    .map(a => ({
    loc: articleUrl(baseUrl, a.slug, a.language || 'es', a.type),
    lastmod: (a.publishedAt || a.createdAt || new Date().toISOString()).slice(0, 10),
  }))

  // Category pages: derive slugs from published articles' category fields and also include site-provided categories when available
  const catSlugs = [...new Set(articles.map(a => {
    const c = a.category || ''
    // If category already looks like a slug (contains '-'), use it; otherwise normalize
    return c.includes('-') ? c : (c ? toCategorySlug(c) : null)
  }).filter(Boolean))]

  const categoryUrls = []
  for (const slug of catSlugs) {
    // root category page
    categoryUrls.push(`${base}/c/${slug}`)
    // language-prefixed category pages
    for (const lang of languages) {
      const prefix = langPrefixes[lang] || '/'
      categoryUrls.push(`${base}${prefix}c/${slug}`)
    }
  }

  const entries = [
    // Home pages
    ...staticUrls.map(loc => `  <url>\n    <loc>${loc}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`),
    // Category pages
    ...categoryUrls.map(loc => `  <url>\n    <loc>${loc}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`),
    // Articles
    ...articleUrls.map(({ loc, lastmod }) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`),
  ]

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n')
}

/**
 * Converts a category display name to its URL slug.
 * Removes common Spanish stopwords that are typically dropped in slugs
 * (e.g. "Tarjetas de Crédito" → "tarjetas-credito", not "tarjetas-de-credito").
 */
function toCategorySlug(name) {
  const STOPWORDS = /-(de|del|la|el|y|los|las|des|du|le|les|of|the)-/gi
  const s = slugify(name)
  // Remove stopwords between words (can run twice for consecutive stopwords)
  return s
    .replace(STOPWORDS, '-')
    .replace(STOPWORDS, '-')
    .replace(/^(de|del|la|el|y|los|las|des|du|le|les|of|the)-/gi, '')
    .replace(/-(de|del|la|el|y|los|las|des|du|le|les|of|the)$/gi, '')
}

function extractLocalImagePathsFromHtml(html) {
  if (!html) return []
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  const found = new Set()
  let match
  while ((match = regex.exec(html)) !== null) {
    const src = (match[1] || '').trim()
    if (src.startsWith('/imagens/')) found.add(src)
  }
  return [...found]
}

export async function POST(req) {
  try {
    const body = await req.json()
    const id       = body.id || body.articleId
    const title    = body.title
    const content  = body.content
    const rawSlug  = body.slug
    const siteId   = body.siteId

    // Get article record for language and category
    const articles = await readFile(ARTICLES_FILE)
    const articleRecord = articles.find(a => a.id === id)
    const language = articleRecord?.language || 'es'
    const isES = language === 'es'
    const isPresell = articleRecord?.type === 'p1' || articleRecord?.type === 'presell'

    // For non-ES: append -[lang] suffix to slug (avoids collisions, matches site convention)
    const resolvedTitle = title || articleRecord?.title || ''
    const baseSlug = rawSlug || articleRecord?.slug || slugify(resolvedTitle)
    const langSuffix = isES ? '' : `-${language}`
    const slug = baseSlug.endsWith(langSuffix) ? baseSlug : `${baseSlug}${langSuffix}`

    // Resolve site info (used for baseUrl and local paths)
    const sites = await readFile(SITES_FILE)
    const site  = siteId ? (sites.find(s => s.id === siteId) || sites[0]) : sites[0]

    // Only require GitHub credentials when AUTO_PUSH is enabled
    let token, owner, repo
    if (AUTO_PUSH) {
      token = (site && site.githubToken) || process.env.GITHUB_TOKEN
      owner = (site && site.githubOwner) || process.env.GITHUB_OWNER
      repo  = (site && site.githubRepo)  || process.env.GITHUB_REPO

      if (!token || !owner || !repo) {
        return Response.json({
          error: 'Configure as credenciais GitHub no cadastro do site (aba Sites) ou nas variáveis de ambiente (.env.local)',
        }, { status: 400 })
      }
    }

    // Extract excerpt: first <p> text content, stripped of HTML tags, max 220 chars
    const resolvedContent = content || articleRecord?.content || ''
    const excerptMatch = resolvedContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
    const rawExcerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').trim() : ''
    const excerpt = rawExcerpt.length > 220 ? rawExcerpt.slice(0, 217) + '...' : rawExcerpt

    // Extract title from <h1> if available, else use passed title
    const h1Match = resolvedContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
    const finalTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : resolvedTitle

    // Strip <h1> and <p class="meta"> from content body (title/meta rendered separately by site)
    const cleanContentBase = resolvedContent
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '')
      .replace(/<p[^>]*class=["']meta["'][^>]*>[\s\S]*?<\/p>/i, '')
      .trim()
    const cleanContent = formatReferencesContainer(cleanContentBase, language)

    // Category field:
    // - ES: display name (e.g. "Inversión Inteligente") — home filters by cat.name which is the Spanish name
    // - non-ES: URL slug (e.g. "inversion-inteligente") — home filters by cat.slug; ArticlePage resolves translated name via getCategoryI18n
    const rawCategory = articleRecord?.category || ''
    const catSlug = toCategorySlug(rawCategory)
    const categoryField = isES ? rawCategory : catSlug

    // Map each category to its specialist author
    const CATEGORY_AUTHOR_MAP = {
      'educacion-financiera':  'Miguel Freitas',
      'inversion-inteligente': 'Carlos Almeida',
      'tarjetas-credito':      'Lucas Moraes',
      'prestamos-personales':  'Felipe Pires',
      'ahorro-inteligente':    'Miguel Freitas',
    }
    const author = articleRecord?.author || CATEGORY_AUTHOR_MAP[catSlug] || 'Miguel Freitas'
    const date     = new Date().toISOString().slice(0, 10)

    // Use AI-generated image URL if available.
    // For P1: if it has no imageUrl, fall back to the linked P2's imageUrl.
    const imageNum = Math.floor(Math.random() * 100) + 1
    let resolvedImageUrl = articleRecord?.imageUrl || ''
    if (!resolvedImageUrl && isPresell && articleRecord?.p1Of) {
      const linkedP2 = articles.find(a => a.id === articleRecord.p1Of)
      if (linkedP2?.imageUrl) resolvedImageUrl = linkedP2.imageUrl
    }
    const image = resolvedImageUrl || `/imagens/img-post/${imageNum}.png`

    // If site defines a secondaryColor, apply it to CTA buttons/links in the generated HTML
    let styledContent = cleanContent
    const siteColor = site?.secondaryColor || null
    if (siteColor) {
      try {
        // Normalize color (ensure starts with #)
        const color = String(siteColor).trim()
        // Replace anchor/button that contains exact CTA text with inline styles
        // Matches: <a ...>ACESSAR SITE OFICIAL</a> or <button ...>ACESSAR SITE OFICIAL</button>
        const btnStyle = `background-color: ${color}; color: #ffffff; padding: 10px 16px; border-radius: 8px; text-decoration: none; display: inline-block;`
        styledContent = styledContent.replace(/<a([^>]*)>\s*ACESSAR SITE OFICIAL\s*<\/a>/gi, (m, g1) => {
          // add/merge style attribute
          if (/style=/.test(g1)) return `<a${g1.replace(/style=(['"])(.*?)\1/, (m2, q, s) => `style=${q}${s}; ${btnStyle}${q}`)}>ACESSAR SITE OFICIAL</a>`
          return `<a${g1} style="${btnStyle}">ACESSAR SITE OFICIAL</a>`
        })
        styledContent = styledContent.replace(/<button([^>]*)>\s*ACESSAR SITE OFICIAL\s*<\/button>/gi, (m, g1) => {
          if (/style=/.test(g1)) return `<button${g1.replace(/style=(['"])(.*?)\1/, (m2, q, s) => `style=${q}${s}; ${btnStyle}${q}`)}>ACESSAR SITE OFICIAL</button>`
          return `<button${g1} style="${btnStyle}">ACESSAR SITE OFICIAL</button>`
        })
      } catch (e) {
        console.warn('publish: failed to apply site secondaryColor to CTA:', e.message)
      }
    }

    const jsonPayload = {
      title:    finalTitle,
      slug,
      ...(isES ? {} : { lang: language }),
      category: categoryField,
      date,
      image,
      excerpt,
      author,
      content:  styledContent,
    }

    const base64   = Buffer.from(JSON.stringify(jsonPayload, null, 2), 'utf-8').toString('base64')
    const filePath = isPresell
      ? `src/content/p1/${slug}.json`
      : `src/content/posts/${slug}.json`
    const baseUrl  = site?.baseUrl ? site.baseUrl.replace(/\/$/, '') : null

    // Build sitemap if baseUrl is available
    let sitemapBase64 = null
    let sitePublishedCount = 0
    if (baseUrl) {
      try {
        // Optimistically include this article in the sitemap count
        const updatedArticles = await readFile(ARTICLES_FILE)
        const sitePublished = [
          ...updatedArticles.filter(a => a.siteId === site.id && a.status === 'published' && a.slug),
          { slug, language }, // include current article (not yet written as published)
        ]
        // Deduplicate by slug
        const seen = new Set()
        const uniquePublished = sitePublished.filter(a => {
          if (seen.has(a.slug)) return false
          seen.add(a.slug)
          return true
        })
        sitePublishedCount = uniquePublished.length
        const sitemapXml = buildSitemap(baseUrl, uniquePublished)
        sitemapBase64 = Buffer.from(sitemapXml, 'utf-8').toString('base64')
        // Always save sitemap locally so public/sitemap.xml stays up to date
        try {
          const localSitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
          await fs.mkdir(path.dirname(localSitemapPath), { recursive: true })
          await fs.writeFile(localSitemapPath, sitemapXml, 'utf-8')
        } catch (e) { console.warn('publish: falha ao salvar sitemap local:', e.message) }
      } catch (sitemapErr) {
        console.error('sitemap build failed:', sitemapErr.message)
      }
    }

    // Single commit: article + images + sitemap (sitemap always last)
    let result
    const filesToCommit = [ { path: filePath, contentBase64: base64 } ]

    // If article image is a local path (saved under public/imagens/img-post/...), include it in the commit
    try {
      const imgPath = articleRecord?.imageUrl || null
      if (imgPath && typeof imgPath === 'string' && imgPath.startsWith('/imagens/')) {
        const localPath = path.join(process.cwd(), imgPath.replace(/^\//, ''))
        try {
          const imgBuffer = await fs.readFile(localPath)
          const imgBase64 = imgBuffer.toString('base64')
          // commit at same path so it becomes available under the site's public URL
          filesToCommit.push({ path: imgPath.replace(/^\//, ''), contentBase64: imgBase64 })
        } catch (imgErr) {
          console.warn('publish: imagem local não encontrada para commitar:', localPath, imgErr.message)
        }
      }
    } catch (eImg) {
      console.warn('publish: erro ao preparar imagem para commit:', eImg.message)
    }

    // Include local inline images referenced in article content.
    try {
      const inlinePaths = extractLocalImagePathsFromHtml(cleanContent)
      for (const imgPath of inlinePaths) {
        const alreadyAdded = filesToCommit.some(f => f.path === imgPath.replace(/^\//, ''))
        if (alreadyAdded) continue
        const localPath = path.join(process.cwd(), imgPath.replace(/^\//, ''))
        try {
          const imgBuffer = await fs.readFile(localPath)
          filesToCommit.push({ path: imgPath.replace(/^\//, ''), contentBase64: imgBuffer.toString('base64') })
        } catch (imgErr) {
          console.warn('publish: imagem inline local nao encontrada para commitar:', localPath, imgErr.message)
        }
      }
    } catch (eInline) {
      console.warn('publish: erro ao processar imagens inline:', eInline.message)
    }

    // Sitemap always goes LAST in the commit
    if (sitemapBase64) filesToCommit.push({ path: 'public/sitemap.xml', contentBase64: sitemapBase64 })

    if (AUTO_PUSH) {
      if (filesToCommit.length > 1) {
        result = await commitMultipleFiles({ owner, repo, token, message: `novo artigo: ${slug}`, files: filesToCommit })
      } else {
        result = await uploadToGithub({ owner, repo, path: filePath, contentBase64: base64, token })
      }
    } else {
      // AUTO_PUSH disabled: save files locally under project paths instead of pushing to GitHub
      try {
        for (const f of filesToCommit) {
          const targetPath = path.join(process.cwd(), f.path)
          await fs.mkdir(path.dirname(targetPath), { recursive: true })
          const contentBuf = Buffer.from(f.contentBase64, 'base64')
          await fs.writeFile(targetPath, contentBuf)
        }
        result = { localSaved: true }
      } catch (localErr) {
        console.error('publish: erro ao salvar localmente:', localErr.message)
        return Response.json({ error: 'Erro ao salvar localmente' }, { status: 500 })
      }
    }

    // Update article status in local JSON
    const idx = articles.findIndex(a => a.id === id)
    const fullUrl = baseUrl
      ? isES
        ? `${baseUrl}/${isPresell ? 'l' : 'p'}/${slug}`
        : `${baseUrl}/${language}/${isPresell ? 'l' : 'p'}/${slug}`
      : null
    if (idx !== -1) {
      articles[idx].status      = 'published'
      articles[idx].slug        = slug
      articles[idx].publishedAt = new Date().toISOString()
      // If image was local and baseUrl is available, set public image URL
      const imgPath = articleRecord?.imageUrl || null
      if (imgPath && baseUrl && imgPath.startsWith('/')) {
        articles[idx].imageUrl = `${baseUrl}${imgPath}`
      } else if (articleRecord?.imageUrl) {
        articles[idx].imageUrl = articleRecord.imageUrl
      }

      articles[idx].remoteUrl   = fullUrl || result?.content?.html_url || null
      await writeArticles(articles)
    }

    return Response.json({ ok: true, path: filePath, slug, url: fullUrl || null })
  } catch (e) {
    console.error('publish error:', e)
    return Response.json({ error: e.message || 'Erro ao publicar' }, { status: 500 })
  }
}