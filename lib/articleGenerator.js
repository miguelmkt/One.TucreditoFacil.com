import { generateContent } from './gemini.js'
import { slugify } from './slugify.js'
import { formatReferencesContainer } from './referenceFormatter.js'
import { removeCategoryFromTitle, ensureUniqueTitle } from './titleUtils.js'

const DELAY_MS    = 4000 // 4s entre artigos — respeita free tier (20 req/min)
const CONCURRENCY = 1    // 1 artigo por vez — evita quota 429

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function buildPrompt({ category, language, existingArticles = [] }) {
  const isSpanish = language === 'es'
  const langName =
    language === 'pt' ? 'Brazilian Portuguese'
    : language === 'es' ? 'Spanish (Latin America / Spain)'
    : language === 'fr' ? 'French'
    : 'English'

  // Assign author based on category specialty
  const CATEGORY_AUTHOR_MAP = {
    'Estilo de Vida con Mascotas':                'Miguel Freitas',
    'Actividades y Diversión con Mascotas':       'Lucas Moraes',
    'Razas y Perfiles de Mascotas':               'Carlos Almeida',
    'Curiosidades sobre Animales de Compañía':    'Felipe Pires',
  }
  const authorName = CATEGORY_AUTHOR_MAP[category] || 'Miguel Freitas'

  const authorBio =
    language === 'pt' ? `${authorName}, especialista em finanças pessoais, crédito e estratégias de investimento.`
    : language === 'es' ? `${authorName}, especialista en finanzas personales, crédito e inversiones accesibles.`
    : language === 'fr' ? `${authorName}, spécialiste en finances personnelles et stratégies d'investissement.`
    : `${authorName}, specialist in personal finance, credit and investment strategies.`

  const refsLabel       = isSpanish ? 'Referencias' : language === 'pt' ? 'Referências' : language === 'fr' ? 'Références' : 'References'
  const conclusionLabel = isSpanish ? 'Conclusión'  : language === 'pt' ? 'Conclusão'   : language === 'fr' ? 'Conclusion' : 'Conclusion'

  // Random seed so every call generates a genuinely different article
  const seed = Math.random().toString(36).slice(2, 10)

  return [
    `[seed:${seed}]`,
    `You are an expert SEO content writer. Your task has TWO steps:`,
    `STEP 1 — Choose a UNIQUE, specific SEO article TOPIC within the "${category}" category.`,
    `         The topic must be DIFFERENT from any article you have written before.`,
    `         Do NOT use the category name as the topic. Pick a concrete, original angle.`,
    `STEP 2 — Write the complete article about that topic in ${langName}.`,
    ``,
    `══ TITLE RULES (CRITICAL) ══`,
    `- The title MUST be between 40 and 65 characters — NEVER more than 65 characters`,
    `- Count every character including spaces before writing the title`,
    `- The ONLY punctuation allowed in the title is the colon : — NO other special chars`,
    `- NEVER use ¿ or ? or ! or ( or ) or / or % in the title`,
    `- Do NOT use the category name "${category}" as the title`,
    `- The title must be a different, specific angle every time — never repeat themes`,
    `- Write the title in ${langName}`,
    ``,
    `Good title examples (note: all between 40-65 chars, colon only):`,
    `  - "Como sair das dividas em 12 meses"  (35 chars — too short, make it richer)`,
    `  - "Tarjetas de credito: como usarlas sin endeudarte"  (49 chars — good)`,
    `  - "Lo que nadie te dice sobre los prestamos personales"  (52 chars — good)`,
    `  - "Inversiones: guia para empezar con poco dinero"  (47 chars — good)`,
    `  - "5 errores que destruyen tu historial crediticio"  (48 chars — good)`,
    ``,
    `══ KEYWORD & HIGHLIGHT STRATEGY ══`,
    `- Identify 4-6 keywords your topic would rank for on Google`,
    `- In the body text, wrap every important keyword or key phrase in <strong> tags:`,
    `  Example: "El <strong>historial crediticio</strong> es fundamental para obtener..."`,
    `- Highlight at least 8-12 key phrases throughout the article using <strong>`,
    `- Use the main keyword in: title, first paragraph, at least 2 h2 headings, and 3+ times in body`,
    ``,
    `══ PARAGRAPH STYLE (MANDATORY — news portal rhythm) ══`,
    `Every <p> must contain EXACTLY 1 to 2 short sentences — like a major news portal (G1, UOL, El País).`,
    `  - Maximum 2 sentences per <p> — NEVER more than 2`,
    `  - Each sentence must be short and punchy — 15 to 25 words maximum`,
    `  - Close the </p> tag immediately after the 2nd sentence`,
    `  - Open a BRAND NEW <p> for the next thought`,
    `  - The result must look like a waterfall of short blocks, easy to scan on mobile`,
    ``,
    `Example of CORRECT paragraph style (news portal):`,
    `<p>O <strong>historico de credito</strong> e um dos fatores mais decisivos na aprovacao de emprestimos.</p>`,
    ``,
    `<p>Dados do Banco Central mostram que <strong>62% dos pedidos negados</strong> envolvem score abaixo de 500.</p>`,
    ``,
    `<p>Melhorar essa pontuacao exige habitos simples, mas consistentes ao longo do tempo.</p>`,
    ``,
    `Example of WRONG paragraph style (TOO LONG — never do this):`,
    `<p>El ahorro inteligente es una de las habilidades financieras mas importantes. Muchas personas creen que ahorrar requiere grandes sacrificios, pero la realidad es diferente. Con una estrategia clara y habitos simples es posible construir un fondo.</p>`,
    ``,
    `══ ABSOLUTE FORBIDDEN ══`,
    `- NEVER use ¿ anywhere in the article`,
    `- NEVER use ( ) parentheses anywhere in the article`,
    `- NEVER use ! exclamation marks`,
    `- NEVER write a title longer than 65 characters`,
    ``,
    `═══ EXACT HTML STRUCTURE ═══`,
    ``,
    `<h1>[Title in ${langName} — max 65 chars, colon only, no ¿ no ( )]</h1>`,
    ``,
    `<p>[1-2 SHORT sentences: Hook with vivid context + surprising fact. Use <strong> on key phrases. MAX 25 words per sentence.]</p>`,
    ``,
    `<p>[1-2 SHORT sentences: Key data point or trend. Use <strong>. MAX 25 words per sentence.]</p>`,
    ``,
    `<h2>[Section 1 — specific narrative phrase, no ¿ no ( )]</h2>`,
    `<p>[1-2 SHORT sentences — specific stat or data point with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences — analysis or case example with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences — implications or context with <strong> keywords]</p>`,
    ``,
    `<h2>[Section 2 — specific narrative phrase]</h2>`,
    `<p>[1-2 SHORT sentences — clear definition or explanation with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences — how it works in practice with <strong> keywords]</p>`,
    ``,
    `<ul>`,
    `  <li><strong>[Key term]</strong>: [one concrete sentence explaining it]</li>`,
    `  <li><strong>[Key term]</strong>: [one concrete sentence explaining it]</li>`,
    `  <li><strong>[Key term]</strong>: [one concrete sentence explaining it]</li>`,
    `  <li><strong>[Key term]</strong>: [one concrete sentence explaining it]</li>`,
    `  <li><strong>[Key term]</strong>: [one concrete sentence explaining it]</li>`,
    `</ul>`,
    ``,
    `<h2>[Section 3 — specific narrative phrase]</h2>`,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<h2>[Section 4 — specific narrative phrase]</h2>`,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<ul>`,
    `  <li><strong>[Key term]</strong>: [concrete and specific]</li>`,
    `  <li><strong>[Key term]</strong>: [concrete and specific]</li>`,
    `  <li><strong>[Key term]</strong>: [concrete and specific]</li>`,
    `  <li><strong>[Key term]</strong>: [concrete and specific]</li>`,
    `</ul>`,
    ``,
    `<p>[1-2 SHORT sentences closing the section with <strong> keywords]</p>`,
    ``,
    `<h2>[Section 5 — specific narrative phrase]</h2>`,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<h2>[Section 6 — optional if topic warrants more depth]</h2>`,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences with <strong> keywords]</p>`,
    ``,
    `<h2>${conclusionLabel}: [Specific inspiring phrase — max 65 chars, no ¿ no ( )]</h2>`,
    `<p>[1-2 SHORT sentences — powerful synthesis of the article with <strong> keywords]</p>`,
    ``,
    `<p>[1-2 SHORT sentences — concrete call to action: tell the reader exactly what to do next]</p>`,
    ``,
    `<p>[1-2 SHORT sentences — final motivating thought with <strong> keywords]</p>`,
    ``,
    `<div class="article-referencias">`,
    `  <h3>${refsLabel}</h3>`,
    `  <ul>`,
    `    <li>[real URL 1 as plain text]</li>`,
    `    <li>[real URL 2 as plain text]</li>`,
    `    <li>[real URL 3 as plain text]</li>`,
    `    <li>[real URL 4 as plain text]</li>`,
    `    <li>[real URL 5 as plain text]</li>`,
    `    <li>[real URL 6 as plain text]</li>`,
    `  </ul>`,
    `</div>`,
    ``,
    `══ FINAL CHECKLIST (verify before outputting) ══`,
    `[ ] Title is between 40-65 characters — count again`,
    `[ ] Title contains NO ¿ NO ( ) NO ! NO ?`,
    `[ ] No ¿ appears anywhere in the article`,
    `[ ] No ( ) parentheses appear anywhere in the article`,
    `[ ] At least 8 <strong> keyword highlights spread through the body`,
    `[ ] Every <p> has MAXIMUM 2 SHORT sentences — like G1, UOL, El País news portals`,
    `[ ] Every sentence is short and direct — max 25 words`,
    `[ ] NO paragraph has 3 or more sentences — split if needed`,
    `[ ] Each section has multiple short <p> blocks separated by blank lines`,
    `[ ] Output starts with <h1> — no preamble or explanation`,
    `[ ] Output is ONLY raw HTML — no markdown, no code fences`,
    `[ ] Minimum 1200 words`,
    `[ ] References must be plain text full URLs starting with https://www. — NEVER use ww. or shortened URLs`,
  ].join('\n')
}

async function generateOne({ category, index, articlesPerCategory, language, geminiKey, existingArticles = [] }) {
  const lang = language
  try {
    const prompt = buildPrompt({ category, language: lang, existingArticles })
    const rawHtml = await generateContent(prompt, geminiKey)
    const m = rawHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
    let title = m ? m[1].replace(/<[^>]+>/g, '').trim() : category

    // ── Post-process title: enforce rules even if model ignores them ──────
    title = title.replace(/[¿?!()]/g, '').trim()
    if (title.length > 65) {
      title = title.slice(0, 65).replace(/\s+\S*$/, '').trim()
    }

    // ── Post-process body ─────────────────────────────────────────────────
    let cleanHtml = rawHtml
      // Remove ¿ and ( ) everywhere
      .replace(/¿/g, '')
      .replace(/[()]/g, '')
      // Fix doubled consonants inserted by Gemini (e.g. "transsacciones" → "transacciones")
      // Match any letter repeated 3+ times and reduce to 2
      .replace(/([a-záéíóúüñA-ZÁÉÍÓÚÜÑ])\1{2,}/g, '$1$1')
      // Fix doubled words (e.g. "la la", "los los", "es es")
      .replace(/\b(\w{2,})\s+\1\b/gi, '$1')
      // Fix stray spaces before closing tags
      .replace(/\s+(<\/)/g, '$1')
      // Fix broken <strong> tags from Gemini typos (e.g. <strrong>, <strrrong>)
      .replace(/<str+ong>/gi, '<strong>')
      .replace(/<\/str+ong>/gi, '</strong>')
      // Fix broken </li> tags (e.g. <lii>, </lii>)
      .replace(/<li{2,}>/gi, '<li>')
      .replace(/<\/li{2,}>/gi, '</li>')
      // Fix reference URLs with missing 'w' (ww. → www.)
      .replace(/\bww\.(\w)/g, 'www.$1')
    cleanHtml = formatReferencesContainer(cleanHtml, lang)

    // Remove any literal bullet characters left inside <li>
    cleanHtml = cleanHtml.replace(/<li>\s*[•·-]\s*/g, '<li>')

    // Ensure titles use only allowed punctuation (only colon ':' allowed) and trim to 65 chars
    title = title.replace(/[¿?!()"'\/\\\[\]{}*%<>@#^&+=~`|]/g, '').trim()
    if (title.length > 65) title = title.slice(0, 65).replace(/\s+\S*$/, '').trim()

    // Remove category name from title if present and ensure uniqueness vs existingArticles
    try {
      title = removeCategoryFromTitle(title, category)
      if (Array.isArray(existingArticles) && existingArticles.length > 0) {
        const existingTitles = existingArticles.map(a => (typeof a === 'string' ? a : (a.title || '')))
        title = ensureUniqueTitle(title, existingTitles, 65)
      }
    } catch (e) {
      // fallback: keep title as-is
    }

    const slug = slugify(title)

    return {
      ok: true,
      article: { title, slug, language: lang, category, content: cleanHtml, imageUrl: null, imageCode: null, status: 'draft', createdAt: new Date().toISOString() },
    }
  } catch (err) {
    return { ok: false, category, index, error: err.message }
  }
}

// Exported for streaming route — generates one article and returns raw result
export { generateOne, buildPrompt }

async function runConcurrent(tasks, concurrency) {
  const results = []
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(t => t()))
    results.push(...batchResults)
    if (i + concurrency < tasks.length) await sleep(DELAY_MS)
  }
  return results
}
export async function createBulkArticles({ categories, articlesPerCategory, language, geminiKey, existingArticles = [] }) {
  if (!Array.isArray(categories) || categories.length === 0) throw new Error('categories é obrigatório')
  if (!articlesPerCategory || articlesPerCategory < 1) throw new Error('articlesPerCategory deve ser >= 1')
  if (!geminiKey) throw new Error('Chave Gemini não configurada')

  const lang = (language || 'pt').toLowerCase()

  // Monta lista plana de tarefas
  const tasks = []
  for (const category of categories) {
    // slice existing articles relevant to this category and pass titles to avoid duplicates
    const existingForCategory = (existingArticles || []).filter(a => a && a.category === category).map(a => ({ title: a.title, link: a.link }))
    for (let i = 0; i < articlesPerCategory; i++) {
      tasks.push(() => generateOne({ category, index: i, articlesPerCategory, language: lang, geminiKey, existingArticles: existingForCategory }))
    }
  }

  const rawResults = await runConcurrent(tasks, CONCURRENCY)

  const articles = rawResults.filter(r => r.ok).map(r => r.article)
  const errors   = rawResults.filter(r => !r.ok).map(r => ({ category: r.category, index: r.index, error: r.error }))

  return { articles, errors }
}
