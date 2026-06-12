import fs from 'fs/promises'
import path from 'path'
import { uploadToGithub } from '../../../lib/github'
import { formatReferencesContainer } from '../../../lib/referenceFormatter'
import { removeCategoryFromTitle, ensureUniqueTitle } from '../../../lib/titleUtils'

const DATA_FILE  = path.join(process.cwd(), 'data', 'articles.json')
const SITES_FILE = path.join(process.cwd(), 'data', 'sites.json')

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

async function writeData(data) {
  await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const data = await readData()
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    let data = await readData()
    const article = data.find(a => a.id === id)
    data = data.filter(a => a.id !== id)
    await writeData(data)

    // Se o artigo estava publicado, remove do GitHub também
    if (article?.status === 'published' && article?.slug && article?.siteId) {
      try {
        const sites = JSON.parse(await fs.readFile(SITES_FILE, 'utf-8').catch(() => '[]'))
        const site = sites.find(s => s.id === article.siteId)
        if ((site?.githubToken || process.env.GITHUB_TOKEN) && site?.githubOwner && site?.githubRepo) {
          const repoName = site.githubRepo.includes('github.com')
            ? site.githubRepo.split('/').filter(Boolean).pop()
            : site.githubRepo
          const token = site.githubToken || process.env.GITHUB_TOKEN
          const apiBase = `https://api.github.com/repos/${site.githubOwner}/${repoName}/contents`
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'gerador-de-artigo/1.0',
          }

          // 1. Remove o arquivo JSON do artigo
          const articleFileUrl = `${apiBase}/src/content/posts/${article.slug}.json`
          const checkRes = await fetch(articleFileUrl, { headers })
          if (checkRes.ok) {
            const existing = await checkRes.json()
            await fetch(articleFileUrl, {
              method: 'DELETE',
              headers,
              body: JSON.stringify({
                message: `remove artigo: ${article.slug}`,
                sha: existing.sha,
              }),
            })
          }

          // 2. Atualiza o sitemap removendo a entrada do artigo deletado
          try {
            const sitemapUrl = `${apiBase}/public/sitemap.xml`
            const sitemapRes = await fetch(sitemapUrl, { headers })
            if (sitemapRes.ok) {
              const sitemapData = await sitemapRes.json()
              const sitemapContent = Buffer.from(
                sitemapData.content.replace(/\n/g, ''),
                'base64'
              ).toString('utf-8')

              // Caminho da URL do artigo no sitemap (relativo ao domínio)
              const lang = article.language || 'es'
              const articleLocPath = lang === 'es'
                ? `/p/${article.slug}`
                : `/${lang}/p/${article.slug}`

              // Remove o bloco <url>...</url> cujo <loc> termina com esse path
              const updatedSitemap = sitemapContent.replace(
                /<url>[\s\S]*?<\/url>/g,
                (block) => {
                  const locMatch = block.match(/<loc>(.*?)<\/loc>/)
                  if (locMatch && locMatch[1].includes(articleLocPath)) return ''
                  return block
                }
              )

              if (updatedSitemap !== sitemapContent) {
                await fetch(sitemapUrl, {
                  method: 'PUT',
                  headers,
                  body: JSON.stringify({
                    message: `remove sitemap: ${article.slug}`,
                    content: Buffer.from(updatedSitemap, 'utf-8').toString('base64'),
                    sha: sitemapData.sha,
                  }),
                })
              }
            }
          } catch (sitemapErr) {
            console.error('Erro ao atualizar sitemap:', sitemapErr.message)
          }
        }
      } catch (e) {
        console.error('Erro ao remover do GitHub:', e.message)
        // Não bloqueia — artigo local já foi removido
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function PATCH(req) {
  try {
    const { id, updates } = await req.json()
    const data = await readData()
    const idx = data.findIndex(a => a.id === id)
    if (idx === -1) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    const normalizedUpdates = { ...updates }
    if (typeof normalizedUpdates.content === 'string') {
      const lang = normalizedUpdates.language || data[idx].language || 'es'
      normalizedUpdates.content = formatReferencesContainer(normalizedUpdates.content, lang)
    }
    // Sanitize title: remove category name and guarantee uniqueness
    if (typeof normalizedUpdates.title === 'string') {
      const categoryForArticle = normalizedUpdates.category || data[idx].category || ''
      normalizedUpdates.title = removeCategoryFromTitle(normalizedUpdates.title, categoryForArticle)
      // build list of other existing titles to check uniqueness
      const otherTitles = data.filter((a, i) => i !== idx).map(a => a.title || '')
      normalizedUpdates.title = ensureUniqueTitle(normalizedUpdates.title, otherTitles, 65)
    }
    data[idx] = { ...data[idx], ...normalizedUpdates }

    // Propagate imageUrl to linked P1 (presell) if this is a money-post being updated
    if (normalizedUpdates.imageUrl !== undefined) {
      const p1Id = data[idx].p1Id
      if (p1Id) {
        const p1Idx = data.findIndex(a => a.id === p1Id)
        if (p1Idx !== -1) {
          data[p1Idx] = { ...data[p1Idx], imageUrl: normalizedUpdates.imageUrl }
        }
      }
      // Also handle reverse: if this IS a P1, sync from its linked P2's imageUrl when P2 has one
      const p1Of = data[idx].p1Of
      if (p1Of && !normalizedUpdates.imageUrl) {
        const p2Idx = data.findIndex(a => a.id === p1Of)
        if (p2Idx !== -1 && data[p2Idx].imageUrl) {
          data[idx] = { ...data[idx], imageUrl: data[p2Idx].imageUrl }
        }
      }
    }

    await writeData(data)
    return new Response(JSON.stringify(data[idx]), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
}
