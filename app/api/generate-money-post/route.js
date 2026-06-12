import fs from 'fs/promises'
import path from 'path'
import { generateContent } from '../../../lib/gemini.js'
import { slugify } from '../../../lib/slugify.js'
import { removeCategoryFromTitle, ensureUniqueTitle } from '../../../lib/titleUtils.js'

export const maxDuration = 120

const DATA_FILE   = path.join(process.cwd(), 'data', 'articles.json')
const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json')
const SITES_FILE  = path.join(process.cwd(), 'data', 'sites.json')

async function getSiteById(siteId) {
  try {
    const raw = await fs.readFile(SITES_FILE, 'utf-8')
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return null
    return arr.find(s => String(s.id) === String(siteId)) || null
  } catch {
    return null
  }
}

function buildSiteTemplate({ title, mainContent, ctaUrl, secondaryColor = '#62BE66', author, date, excerpt }) {
  const safeCta = ctaUrl || '#'
  return `
<p>${excerpt || ''}</p>

${mainContent}

<div class="cta-money-btn" style="margin:44px 0">
  <a href="${safeCta}" target="_blank" rel="noopener noreferrer sponsored" class="cta-money-btn" style="display:inline-flex;align-items:center;justify-content:center;gap:16px;background:${secondaryColor};color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;font-size:1.25rem;font-weight:800;padding:24px 44px;border-radius:12px;text-decoration:none !important;letter-spacing:0.8px;width:100%;box-sizing:border-box;animation:ctaBounce 1.8s ease-in-out infinite">
    <span class="cta-money-btn" style="color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;font-size:1.25rem;font-weight:800;line-height:1.3;text-align:center;letter-spacing:0.8px">ACESSAR SITE OFICIAL</span>
    <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:2.5px solid #ffffff;border-radius:50%;flex-shrink:0">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </span>
  </a>
</div>

<p style="font-size:0.9rem;color:#6b7280;line-height:1.6">Autor: <strong>${author || ''}</strong> • Atualizado em ${date || ''}</p>
`
}

async function getGeminiKeys() {
  // try env var first (comma-separated), then config.json (geminiKeys array or geminiKey)
  if (process.env.GEMINI_API_KEYS) {
    return process.env.GEMINI_API_KEYS.split(',').map(s => s.trim()).filter(Boolean)
  }
  if (process.env.GEMINI_API_KEY) return [process.env.GEMINI_API_KEY]
  try {
    const cfg = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf-8'))
    if (Array.isArray(cfg.geminiKeys) && cfg.geminiKeys.length) return cfg.geminiKeys
    if (cfg.geminiKey) return [cfg.geminiKey]
    return []
  } catch {
    return []
  }
}

function buildMoneyPostPrompt({ category, language, customTitle, customPrompt, ctaUrl }) {
  const langName =
    language === 'pt' ? 'Portuguese (Brazilian)'
    : language === 'es' ? 'Spanish (Latin America / Spain)'
    : language === 'fr' ? 'French'
    : 'English'

  const ctaLabels = {
    pt: 'ACESSAR SITE OFICIAL',
    es: 'ACCEDER AL SITIO OFICIAL',
    en: 'ACCESS OFFICIAL SITE',
    fr: 'ACCÉDER AU SITE OFFICIEL',
  }
  const ctaLabel = ctaLabels[language] || ctaLabels.pt

  const customPromptSection = customPrompt
    ? `\n\nADDITIONAL INSTRUCTIONS FROM USER:\n${customPrompt}`
    : ''

  const safeCta = ctaUrl || '#'

  const seed = Math.random().toString(36).slice(2, 10)
  const prosCount = 5
  const consCount = 5

  return [
    `[seed:${seed}]`,
    ``,
    `You are an expert financial content writer. Generate a Money Post in ${langName} about "${category}".`,
    ``,
    `══ TITLE RULES (CRITICAL) ══`,
    customTitle
      ? `Use exactly this title: "${customTitle}". Do NOT modify it.`
      : [
          `- The title MUST be between 40 and 65 characters — NEVER more than 65 characters`,
          `- Count every character including spaces before writing the title`,
          `- The ONLY punctuation allowed in the title is the colon : — NO other special chars`,
          `- NEVER use ¿ or ? or ! or ( or ) or / or % in the title`,
          `- Do NOT use the category name "${category}" as the title`,
          `- The title must be a specific, compelling angle — SEO-optimized`,
          `- Write the title in ${langName}`,
          ``,
          `Good title examples (note: all between 40-65 chars, colon only):`,
          `  - "Financiamento BV: Seu Carro Novo Agora com Taxas Reduzidas"`,
          `  - "Tarjetas de credito: como usarlas sin endeudarte"`,
          `  - "Emprestimo pessoal: como conseguir a menor taxa do mercado"`,
          `  - "Credito consignado: o guia completo para aposentados"`,
        ].join('\n'),
    ``,
    `OUTPUT FORMAT:`,
    `- First line MUST be: <!-- TITLE: Your Generated Title Here -->`,
    `- After that, output ONLY raw HTML. No markdown. No code fences. No other preamble.`,
    `- The HTML body starts with <p> (the first introductory paragraph).`,
    `- Do NOT include <h1> tags — the title is in the comment line above.`,
    ``,
    `══ EXACT HTML TEMPLATE — REPLICATE THIS IDENTICALLY ══`,
    `Below is a REAL article from our site. Your output must follow the EXACT same HTML structure,`,
    `inline styles, class names, tags, and patterns. Replace ONLY the text content.`,
    ``,
    `*** WRITING STYLE — MANDATORY ***`,
    `- Every <p> must be SHORT: maximum 2 lines (about 120-150 characters). Like a major news portal.`,
    `- NEVER write long paragraphs. If a sentence is long, split it into 2 separate <p> tags.`,
    `- ALL <li> items MUST be wrapped in <strong>. Every single one. No exceptions.`,
    `- Tone: conversational, warm, and humanized — write as if talking directly to a person who needs this solution.`,
    `- Use second-person perspective ("você pode", "descubra como", "veja por que") to engage the reader.`,
    `- Include specific numbers, percentages, or real data whenever possible to build credibility.`,
    `- Use emotional hooks and relatable scenarios in the introduction (e.g., "Se você já foi recusado...").`,
    `- Use <b> to highlight key terms and product names inside <p> paragraphs.`,
    `- Every H2 must naturally include the main keyword or a close SEO variation.`,
    `- Use transition words for reading flow: "além disso", "por isso", "no entanto", "em outras palavras".`,
    `- Write persuasively with a conversion focus — guide the reader toward clicking the CTA.`,
    `- No filler words. Every sentence must add real value.`,
    ``,
    `--- SECTION 1: INTRODUCTION (4-5 short paragraphs + bullet list) ---`,
    `<p>[Short hook about the product. Max 2 lines.]</p>`,
    `<p>[Second short paragraph. Use <b> for key phrase. Max 2 lines.]</p>`,
    `<p>[Third short paragraph about benefits. Max 2 lines.]</p>`,
    `<p>[Fourth paragraph mentioning solutions. Max 2 lines.]</p>`,
    ``,
    `<ul>`,
    `<li><strong>[Feature 1 — one short sentence.]</strong></li>`,
    `<li><strong>[Feature 2 — one short sentence.]</strong></li>`,
    `<li><strong>[Feature 3 — one short sentence.]</strong></li>`,
    `<li><strong>[Feature 4 — one short sentence.]</strong></li>`,
    `</ul>`,
    ``,
    `<p>[Closing intro sentence inviting reader to continue. Max 2 lines.]</p>`,
    ``,
    `--- SECTION 2: BENEFITS (h2 + 5 icon blocks) ---`,
    `Each icon block MUST use this EXACT HTML with these EXACT inline styles.`,
    `Pick 5 DIFFERENT icons from: fa-percent, fa-file-invoice-dollar, fa-tasks, fa-user-friends, fa-home, fa-money-bill-wave, fa-clock, fa-shield-halved, fa-wallet, fa-chart-line, fa-piggy-bank, fa-credit-card, fa-building-columns, fa-hand-holding-dollar`,
    ``,
    `CRITICAL — [Benefit Title] rules:`,
    `- Must be a SPECIFIC action-oriented phrase (3-6 words) that summarizes the explanation below it.`,
    `- NEVER use generic category names. The title must reflect what the user actually gets.`,
    `- Examples of what NOT to do vs what TO do:`,
    `  ✗ "Programa Livelo"  →  ✓ "Acumule pontos em cada compra"`,
    `  ✗ "Descontos em Lazer"  →  ✓ "Cinema pela metade do preço"`,
    `  ✗ "Segurança Reforçada"  →  ✓ "Proteção contra perda e roubo"`,
    `  ✗ "Cartões Adicionais"  →  ✓ "Compartilhe benefícios com a família"`,
    `  ✗ "Carteiras Digitais"  →  ✓ "Pague pelo celular com Apple Pay"`,
    ``,
    `<h2>[Benefits Title]</h2>`,
    `<p>[One short intro sentence. Max 2 lines.]</p>`,
    ``,
    `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:28px">`,
    `  <i class="fa-solid fa-[icon]" style="color:#62BE66;font-size:1.5rem;min-width:26px;margin-top:2px"></i>`,
    `  <div>`,
    `    <p style="margin:0 0 6px"><strong>[Specific action-oriented benefit title]</strong></p>`,
    `    <p style="margin:0;color:#6b7280;font-size:0.95rem;line-height:1.6">[Short explanation, max 2 lines.]</p></div></div>`,
    ``,
    `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:28px">`,
    `  <i class="fa-solid fa-[icon]" style="color:#62BE66;font-size:1.5rem;min-width:26px;margin-top:2px"></i>`,
    `  <div>`,
    `    <p style="margin:0 0 6px"><strong>[Specific action-oriented benefit title]</strong></p>`,
    `    <p style="margin:0;color:#6b7280;font-size:0.95rem;line-height:1.6">[Short explanation, max 2 lines.]</p></div></div>`,
    ``,
    `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:28px">`,
    `  <i class="fa-solid fa-[icon]" style="color:#62BE66;font-size:1.5rem;min-width:26px;margin-top:2px"></i>`,
    `  <div>`,
    `    <p style="margin:0 0 6px"><strong>[Specific action-oriented benefit title]</strong></p>`,
    `    <p style="margin:0;color:#6b7280;font-size:0.95rem;line-height:1.6">[Short explanation, max 2 lines.]</p></div></div>`,
    ``,
    `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:28px">`,
    `  <i class="fa-solid fa-[icon]" style="color:#62BE66;font-size:1.5rem;min-width:26px;margin-top:2px"></i>`,
    `  <div>`,
    `    <p style="margin:0 0 6px"><strong>[Specific action-oriented benefit title]</strong></p>`,
    `    <p style="margin:0;color:#6b7280;font-size:0.95rem;line-height:1.6">[Short explanation, max 2 lines.]</p></div></div>`,
    ``,
    `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:28px">`,
    `  <i class="fa-solid fa-[icon]" style="color:#62BE66;font-size:1.5rem;min-width:26px;margin-top:2px"></i>`,
    `  <div>`,
    `    <p style="margin:0 0 6px"><strong>[Specific action-oriented benefit title]</strong></p>`,
    `    <p style="margin:0;color:#6b7280;font-size:0.95rem;line-height:1.6">[Short explanation, max 2 lines.]</p></div></div>`,
    ``,
    `--- SECTION 3: TARGET AUDIENCE (h2 + ul with 4 li) ---`,
    `<h2>[Who Is This For]</h2>`,
    `<p>[Short intro sentence. Max 2 lines.]</p>`,
    `<ul>`,
    `<li><strong>[Audience 1 — short sentence.]</strong></li>`,
    `<li><strong>[Audience 2 — short sentence.]</strong></li>`,
    `<li><strong>[Audience 3 — short sentence.]</strong></li>`,
    `<li><strong>[Audience 4 — short sentence.]</strong></li>`,
    `</ul>`,
    `<p>[Short closing sentence. Max 2 lines.]</p>`,
    ``,
    `--- SECTION 4: PROS AND CONS ---`,
    `<h2>[Pros and Cons Title]</h2>`,
    `<p>[Short intro. Max 2 lines.]</p>`,
    `<p>[Short second sentence. Max 2 lines.]</p>`,
    ``,
    `<div style="display:flex;align-items:center;gap:10px;margin:28px 0 16px">`,
    `  <i class="fa-solid fa-thumbs-up" style="color:#16a34a;font-size:1.3rem"></i>`,
    `  <h3 style="margin:0;font-size:1.2rem;font-weight:700;color:#1f2937">[Positive Points Title]</h3></div>`,
    ``,
    ...Array.from({ length: prosCount }, (_, i) => [
      `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px">`,
      `  <i class="fa-solid fa-check" style="color:#16a34a;font-size:1rem;margin-top:3px;flex-shrink:0"></i>`,
      `  <div>`,
      `    <p style="margin:0"><strong>[Pro ${i + 1} Title]</strong></p>`,
      `    <p style="margin:4px 0 0;color:#6b7280;font-size:0.93rem">[Short explanation, max 2 lines.]</p></div></div>`,
      ``,
    ]).flat(),
    `<div style="display:flex;align-items:center;gap:10px;margin:32px 0 16px">`,
    `  <i class="fa-solid fa-thumbs-down" style="color:#dc2626;font-size:1.3rem"></i>`,
    `  <h3 style="margin:0;font-size:1.2rem;font-weight:700;color:#1f2937">[Negative Points Title]</h3></div>`,
    ``,
    ...Array.from({ length: consCount }, (_, i) => [
      `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px">`,
      `  <i class="fa-solid fa-xmark" style="color:#dc2626;font-size:1rem;margin-top:3px;flex-shrink:0"></i>`,
      `  <div>`,
      `    <p style="margin:0"><strong>[Con ${i + 1} Title]</strong></p>`,
      `    <p style="margin:4px 0 0;color:#6b7280;font-size:0.93rem">[Short explanation, max 2 lines.]</p></div></div>`,
      ``,
    ]).flat(),
    `--- SECTION 5: WHY WE RECOMMEND (h2 + short paragraphs + ol) ---`,
    `<h2>[Why We Recommend Title]</h2>`,
    `<p>[Short paragraph. Max 2 lines.]</p>`,
    `<p><b>[Key phrase bold]</b> [rest of short sentence. Max 2 lines.]</p>`,
    `<ol>`,
    `<li><strong>[Reason 1 — one sentence.]</strong></li>`,
    `<li><strong>[Reason 2 — one sentence.]</strong></li>`,
    `<li><strong>[Reason 3 — one sentence.]</strong></li>`,
    `<li><strong>[Reason 4 — one sentence.]</strong></li>`,
    `</ol>`,
    ``,
    `--- SECTION 6: HOW TO APPLY (h2 + CTA button + steps) ---`,
    `<h2>[How to Apply Title]</h2>`,
    `<p>[Short intro. Max 2 lines.]</p>`,
    ``,
    `<style>@keyframes ctaBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes ctaGlow{0%,100%{box-shadow:0 6px 24px rgba(98,190,102,0.5),0 2px 8px rgba(0,0,0,0.08)}50%{box-shadow:0 12px 40px rgba(98,190,102,0.85),0 4px 16px rgba(0,0,0,0.12)}}@keyframes ctaShine{0%{background-position:0% center}100%{background-position:-200% center}}</style>`,
    `<p><a href="${safeCta}" target="_blank" rel="noopener noreferrer sponsored" class="thecta pulse" style="display:inline-flex;align-items:center;justify-content:center;gap:0.6em;padding:1.1em 1.4em;background:linear-gradient(90deg,#3CAF47 0%,#3CAF47 40%,#55be5a 50%,#3CAF47 60%,#3CAF47 100%);background-size:200% 100%;color:#fff;border-radius:16px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;width:100%;font-size:28px;text-decoration:none;line-height:1;animation:ctaBounce 1.5s ease-in-out infinite,ctaGlow 1.5s ease-in-out infinite,ctaShine 5s linear infinite">${ctaLabel} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28" fill="#fff"><path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zm395.3 11.3l-112 112c-4.6 4.6-11.5 5.9-17.4 3.5s-9.9-8.3-9.9-14.8l0-64-96 0c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32l96 0 0-64c0-6.5 3.9-12.3 9.9-14.8s12.9-1.1 17.4 3.5l112 112c6.2 6.2 6.2 16.4 0 22.6z"/></svg></a></p>`,
    ``,
    `<ul>`,
    `<li><strong>[Step 1 — short sentence.]</strong></li>`,
    `<li><strong>[Step 2 — short sentence.]</strong></li>`,
    `</ul>`,
    ``,
    `--- SECTION 7: FAQ (h2 + hr/h3/p blocks) — 4 items ---`,
    `<h2>[FAQ Title]</h2>`,
    `<hr><h3>[Question 1]</h3>`,
    `<p>[Short answer. Max 2 lines.]</p>`,
    `<hr><h3>[Question 2]</h3>`,
    `<p>[Short answer. Max 2 lines.]</p>`,
    `<hr><h3>[Question 3]</h3>`,
    `<p>[Short answer. Max 2 lines.]</p>`,
    `<hr><h3>[Question 4]</h3>`,
    `<p>[Short answer. Max 2 lines.]</p>`,
    ``,
    `--- SECTION 8: CONCLUSION (h2 + 3-4 short paragraphs — make it memorable) ---`,
    `<hr>`,
    `<h2>[Conclusion Title — e.g. "Vale a pena? Nossa opinião final"]</h2>`,
    `<p>[Recap the main value proposition in one sentence. Use <b>product name</b>. Max 2 lines.]</p>`,
    `<p>[Address any hesitation the reader might have. Be direct and reassuring. Max 2 lines.]</p>`,
    `<p>[Strong closing call-to-action sentence — tell the reader what to do next. Max 2 lines.]</p>`,
    `<p>[Optional: one final humanized sentence reinforcing trust or urgency. Max 2 lines.]</p>`,
    ``,
    `══ CRITICAL RULES ══`,
    `- EVERY paragraph <p> must be SHORT: maximum 120-150 characters (about 2 lines on screen)`,
    `- NEVER write paragraphs longer than 2 lines. Split long sentences into separate <p> tags`,
    `- Copy the HTML structure and inline styles EXACTLY as shown above`,
    `- Do NOT change any style values, class names, or HTML structure`,
    `- Do NOT add markdown, code fences, or any text outside the HTML`,
    `- Do NOT include <h1> tags — title is stored separately`,
    `- Do NOT use ¿ ? ! ( ) anywhere in titles or headings`,
    `- Use <strong> and <b> for important keywords and product names`,
    `- All icon classes must be valid Font Awesome 6 solid icons (fa-solid fa-*)`,
    `- The CTA button HTML must be included EXACTLY as provided (do not modify it)`,
    `- Write naturally and persuasively — this is a conversion-focused article`,
    `- Target 800–1000 words of QUALITY content. Every sentence must add real value. NO padding or filler.`,
    `- The conclusion MUST feel like a genuine recommendation, not a generic summary. End with conviction.`,
    `- Each benefit icon block: display:flex;align-items:flex-start;gap:16px;margin-bottom:28px`,
    `- Each benefit <i>: color:#62BE66;font-size:1.5rem;min-width:26px;margin-top:2px`,
    `- Each pro check: fa-check with color:#16a34a`,
    `- Each con xmark: fa-xmark with color:#dc2626`,
    `- FAQ uses <hr><h3>Q</h3><p>A</p> pattern — no div wrappers`,
    `${customPromptSection}`,
  ].join('\n')
}

function buildP1Prompt({ category, language, moneyPostTitle, moneyPostSlug }) {
  const langName =
    language === 'pt' ? 'Portuguese (Brazilian)'
    : language === 'es' ? 'Spanish (Latin America / Spain)'
    : language === 'fr' ? 'French'
    : 'English'

  const ctaLabels = { pt: 'QUERO SABER MAIS', es: 'QUIERO SABER MÁS', en: 'LEARN MORE', fr: 'EN SAVOIR PLUS' }
  const infoTitles = { pt: 'Informações', es: 'Información', en: 'Information', fr: 'Informations' }
  const posTitles  = { pt: 'Pontos Positivos', es: 'Puntos Positivos', en: 'Positive Points', fr: 'Points Positifs' }

  const ctaLabel  = ctaLabels[language] || ctaLabels.pt
  const infoTitle = infoTitles[language] || infoTitles.pt
  const posTitle  = posTitles[language]  || posTitles.pt

  const moneyPostUrl = language === 'es'
    ? `/p/${moneyPostSlug}`
    : `/${language}/p/${moneyPostSlug}`

  const ctaAnimStyle = `@keyframes ctaBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes ctaGlow{0%,100%{box-shadow:0 6px 24px rgba(60,175,71,0.5),0 2px 8px rgba(0,0,0,0.08)}50%{box-shadow:0 14px 42px rgba(60,175,71,0.85),0 4px 16px rgba(0,0,0,0.10)}}@keyframes ctaShine{0%{background-position:0% center}100%{background-position:-200% center}}`
  const ctaBtnStyle  = `display:inline-flex;align-items:center;justify-content:center;gap:0.6em;padding:1.1em 1.4em;background:linear-gradient(90deg,#3CAF47 0%,#3CAF47 40%,#55be5a 50%,#3CAF47 60%,#3CAF47 100%);background-size:200% 100%;color:#fff;border-radius:16px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;width:100%;font-size:28px;text-decoration:none;line-height:1;animation:ctaBounce 1.5s ease-in-out infinite,ctaGlow 1.5s ease-in-out infinite,ctaShine 5s linear infinite`
  const ctaArrowSvg  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28" fill="#fff"><path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zm395.3 11.3l-112 112c-4.6 4.6-11.5 5.9-17.4 3.5s-9.9-8.3-9.9-14.8l0-64-96 0c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32l96 0 0-64c0-6.5 3.9-12.3 9.9-14.8s12.9-1.1 17.4 3.5l112 112c6.2 6.2 6.2 16.4 0 22.6z"/></svg>`
  const ctaHtml = `<style>${ctaAnimStyle}</style>\n<p><a href="${moneyPostUrl}" rel="noopener" class="thecta pulse" style="${ctaBtnStyle}">${ctaLabel} ${ctaArrowSvg}</a></p>`

  const seed = Math.random().toString(36).slice(2, 8)

  // Icon info block — title + description with inline bold
  const iconDiv = (n) =>
    `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:22px">` +
    `<i class="fa-solid fa-[icon${n}]" style="color:#62BE66;font-size:1.5rem;min-width:26px;margin-top:2px"></i>` +
    `<div>` +
    `<p style="margin:0 0 5px"><strong>[Short specific title for info point ${n} — 2-4 words, concrete noun phrase]</strong></p>` +
    `<p style="margin:0;color:#6b7280;font-size:0.92rem;line-height:1.55">[One sentence describing this specific feature/aspect. Include ONE inline <strong>keyword</strong>. Max 110 chars. Concrete, specific, no filler.]</p>` +
    `</div></div>`

  // Check block — title + supporting sentence
  const checkDiv = (n) =>
    `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px">` +
    `<i class="fa-solid fa-check" style="color:#16a34a;font-size:0.95rem;margin-top:4px;flex-shrink:0"></i>` +
    `<div><p style="margin:0"><strong>[Positive point title ${n} — 2-4 words]</strong></p>` +
    `<p style="margin:4px 0 0;color:#6b7280;font-size:0.92rem">[One supporting sentence. Specific fact or benefit. Max 90 chars.]</p></div></div>`

  return [
    `[seed:${seed}]`,
    ``,
    `You are a senior editorial writer for a financial media brand. Your task is to write a short, highly engaging P1 presell page in ${langName}.`,
    ``,
    `ARTICLE TITLE (this is what you are writing ABOUT): "${moneyPostTitle}"`,
    `FULL ARTICLE URL (CTAs must point here): ${moneyPostUrl}`,
    ``,
    `WRITING STYLE — follow these rules strictly:`,
    `- Write as if you personally analyzed and tested the product/service in the title`,
    `- Speak directly to the reader (use "você"/"usted"/"you")`,
    `- Use the PRODUCT/SERVICE NAME from the title — NEVER refer to "this category" or "this type of product"`,
    `- Use specific, concrete details: numbers, percentages, timeframes, conditions — make them plausible`,
    `- Vary vocabulary — never repeat the same word twice in the same block`,
    `- Sound like a real human editorial team, not an AI`,
    `- Every <p> max 2 lines. Split longer ideas into separate sentences.`,
    `- ALWAYS use <strong> for key terms inside <p>. NEVER use ** or __ markdown.`,
    ``,
    `OUTPUT: Raw HTML only. No markdown. No code fences. No title tag. No preamble text.`,
    `TARGET: ~280 words (excludes the fixed CTA HTML and <!-- IMAGE_HERE --> marker).`,
    ``,
    `══ EXACT HTML STRUCTURE — replicate every block, replace only bracketed text ══`,
    ``,
    `--- BLOCK 1: INTRO (2 <p> tags) ---`,
    `<p>[Describe exactly WHAT the product/service is in one sentence — be specific about what it does, who offers it, and the main advantage. Use <strong> for 1-2 key terms.]</p>`,
    `<p>[Second sentence: what the reader will discover if they read the full article. Mention one concrete benefit. Use <strong> for 1 term.]</p>`,
    ``,
    `--- BLOCK 2: FIRST CTA ---`,
    ctaHtml,
    ``,
    `--- IMAGE ---`,
    `<!-- IMAGE_HERE -->`,
    ``,
    `--- BLOCK 3: CONNECTOR PARAGRAPH ---`,
    `<p>[One sentence that bridges the image to the info section. Mention who the product/service benefits and ONE concrete advantage. Use <strong> for 1 term.]</p>`,
    ``,
    `--- BLOCK 4: INFO SECTION (h2 + 5 icon blocks) ---`,
    `<h2>${infoTitle}</h2>`,
    ``,
    iconDiv(1),
    ``,
    iconDiv(2),
    ``,
    iconDiv(3),
    ``,
    iconDiv(4),
    ``,
    iconDiv(5),
    ``,
    `--- BLOCK 5: CTA ---`,
    ctaHtml,
    ``,
    `--- BLOCK 6: ${posTitle} (header + 5 items with title + description) ---`,
    `<div style="display:flex;align-items:center;gap:10px;margin:28px 0 16px">` +
      `<i class="fa-solid fa-thumbs-up" style="color:#16a34a;font-size:1.3rem"></i>` +
      `<h3 style="margin:0;font-size:1.2rem;font-weight:700;color:#1f2937">${posTitle}</h3></div>`,
    ``,
    checkDiv(1),
    checkDiv(2),
    checkDiv(3),
    checkDiv(4),
    checkDiv(5),
    ``,
    `--- BLOCK 7: FINAL CTA ---`,
    ctaHtml,
    ``,
    `══ CRITICAL RULES ══`,
    `- Write in ${langName}`,
    `- Raw HTML ONLY — no markdown, no code fences, no preamble`,
    `- No <h1> tags`,
    `- ALWAYS <strong> for keywords — NEVER ** or __`,
    `- <!-- IMAGE_HERE --> must appear alone on its own line between BLOCK 2 and BLOCK 3`,
    `- Copy ALL inline styles EXACTLY — do not change any value`,
    `- Copy all 3 CTA blocks EXACTLY — do not modify href, label, or styles`,
    `- h2/h3 headings: no punctuation — no ? ! ¿ `,
    `- Info block descriptions: max 110 chars, must include one <strong> inline keyword`,
    `- Positive points: BOTH title and description required — no empty fields`,
    `- Never mention the word "category" — write about the specific product/service by name`,
    `- Use varied, human vocabulary — avoid repeating the same noun twice in one block`,
    `- FA icons: choose the most relevant from fa-percent, fa-file-invoice-dollar, fa-tasks, fa-user-friends, fa-home, fa-money-bill-wave, fa-clock, fa-shield-halved, fa-wallet, fa-chart-line, fa-piggy-bank, fa-credit-card, fa-building-columns, fa-hand-holding-dollar, fa-star, fa-bolt, fa-globe, fa-mobile-screen, fa-lock, fa-thumbs-up`,
  ].join('\n')
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { category, siteId = '', language, title: customTitle, prompt: customPrompt, ctaUrl,
            _p1Only, _moneyPostTitle, _moneyPostSlug, _moneyPostId } = body

    // ── P1-only retry mode ───────────────────────────────────────────────
    if (_p1Only) {
      if (!_moneyPostTitle || !_moneyPostSlug) {
        return Response.json({ error: 'Dados do money post não informados para retry de P1' }, { status: 400 })
      }
      const lang = (language || 'es').toLowerCase()
      const geminiKeys = await getGeminiKeys()
      if (!geminiKeys || geminiKeys.length === 0) {
        return Response.json({ error: 'Nenhuma chave Gemini configurada.' }, { status: 400 })
      }
      let p1Error = null
      let presell = null
      try {
        const p1PromptText = buildP1Prompt({ category, language: lang, moneyPostTitle: _moneyPostTitle, moneyPostSlug: _moneyPostSlug })
        let p1Content = await generateContent(p1PromptText, geminiKeys)
        if (p1Content && typeof p1Content === 'string') {
          p1Content = p1Content.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()
          p1Content = p1Content.replace(/<!--\s*TITLE:[^>]+-->/i, '').trim()
          const today = new Date().toISOString().split('T')[0]
          const p1ExcerptMatch = p1Content.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
          const p1Excerpt = p1ExcerptMatch ? p1ExcerptMatch[1].replace(/<[^>]+>/g, '').substring(0, 150) : _moneyPostTitle.substring(0, 150)
          presell = {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 6) + 'p1',
            slug: _moneyPostSlug,
            title: _moneyPostTitle,
            content: p1Content,
            status: 'draft',
            language: lang,
            category,
            siteId,
            imageUrl: '', imageCode: '',
            createdAt: new Date().toISOString(),
            date: today,
            excerpt: p1Excerpt,
            author: 'Miguel Freitas',
            lang,
            type: 'p1',
            p1Of: _moneyPostId || '',
            moneyPostSlug: _moneyPostSlug,
            ctaUrl: '',
          }
          let data = []
          try { data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8')) } catch { data = [] }
          data.unshift(presell)
          if (_moneyPostId) {
            const idx = data.findIndex(a => a.id === _moneyPostId)
            if (idx !== -1) data[idx].p1Id = presell.id
          }
          await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
          await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
        }
      } catch (e) {
        p1Error = e.message || 'Erro ao gerar P1'
      }
      return Response.json({ presell, p1Error })
    }

    if (!category || !String(category).trim()) {
      return Response.json({ error: 'Categoria é obrigatória' }, { status: 400 })
    }

    const lang = (language || 'es').toLowerCase()
    const validLangs = ['pt', 'en', 'fr', 'es']
    if (!validLangs.includes(lang)) {
      return Response.json({ error: 'Idioma inválido: ' + lang }, { status: 400 })
    }

    const geminiKeys = await getGeminiKeys()
    if (!geminiKeys || geminiKeys.length === 0) {
      return Response.json({ error: 'Nenhuma chave Gemini configurada. Acesse Configurações e insira sua chave Gemini.' }, { status: 400 })
    }

    const prompt = buildMoneyPostPrompt({ category, language: lang, customTitle, customPrompt, ctaUrl })

    // Call Gemini to generate content (generateContent aceita string ou array de chaves)
    let content = await generateContent(prompt, geminiKeys)
    if (!content || typeof content !== 'string') {
      return Response.json({ error: 'Erro ao gerar post: resposta inválida do Gemini' }, { status: 500 })
    }

    // Clean up any markdown fences or preamble the model might add
    content = content.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()

    // Verificar se o conteúdo está completo (deve ter conclusão e ao menos 1200 chars)
    const hasConclusion = /<\/p>\s*$/.test(content) || content.includes('</ul>') || content.includes('</ol>')
    const minExpectedLength = 1200
    if (!hasConclusion || content.length < minExpectedLength) {
      console.error(`[generate-money-post] Conteúdo gerado parece incompleto (${content.length} chars, hasConclusion=${hasConclusion}). Abortando.`)
      return Response.json({ error: 'O conteúdo gerado ficou incompleto. Tente novamente.' }, { status: 500 })
    }

    // Parse title: try <!-- TITLE: ... --> comment first, then <h1>, then markdown #
    let title = customTitle || 'Money Post'
    let mainContent = content

    const titleComment = content.match(/<!--\s*TITLE:\s*(.+?)\s*-->/i)
    if (titleComment) {
      if (!customTitle) title = titleComment[1].trim()
      mainContent = content.replace(titleComment[0], '').trim()
    } else {
      const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
      if (h1Match) {
        if (!customTitle) title = h1Match[1].replace(/<[^>]+>/g, '').trim()
        mainContent = content.replace(h1Match[0], '').trim()
      } else {
        const mdMatch = content.match(/^#\s+(.+?)(?:\n|$)/)
        if (mdMatch && !customTitle) {
          title = mdMatch[1].trim()
          mainContent = content.replace(mdMatch[0], '').trim()
        }
      }
    }

    // Clean title: enforce rules
    title = title.replace(/[¿?!()"'\/\\\[\]{}*%<>@#^&+=~`|]/g, '').trim()
    if (title.length > 65) title = title.slice(0, 65).replace(/\s+\S*$/, '').trim()

    // Remove category name from title and ensure uniqueness (same as bulk articles)
    try {
      title = removeCategoryFromTitle(title, category)
      const existingArticles = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8').catch(() => '[]'))
      const existingTitles = existingArticles.map(a => a.title || '')
      title = ensureUniqueTitle(title, existingTitles, 65)
    } catch (e) { /* keep title as-is if utils fail */ }

    // Generate slug based on title and language
    const slug = slugify(title, lang) + '-' + lang

    // Extract excerpt (first paragraph text, up to 150 chars)
    const excerptMatch = mainContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
    const excerpt = excerptMatch 
      ? excerptMatch[1].replace(/<[^>]+>/g, '').substring(0, 150) + (excerptMatch[1].replace(/<[^>]+>/g, '').length > 150 ? '...' : '')
      : title.substring(0, 150)

    // Inject <!-- AD4 --> before the 2nd <h2> so the Content4 ad block appears mid-article
    function injectAd4(html) {
      let count = 0
      let pos = 0
      while (pos < html.length) {
        const idx = html.indexOf('<h2', pos)
        if (idx === -1) break
        count++
        if (count === 2) {
          return html.slice(0, idx) + '\n\n<!-- AD4 -->\n\n' + html.slice(idx)
        }
        pos = idx + 3
      }
      // Fallback: insert at 40% mark
      const cut = Math.floor(html.length * 0.4)
      const nextClose = html.indexOf('>', cut)
      const insertAt = nextClose !== -1 ? nextClose + 1 : cut
      return html.slice(0, insertAt) + '\n\n<!-- AD4 -->\n\n' + html.slice(insertAt)
    }
    mainContent = injectAd4(mainContent)

    const today = new Date().toISOString().split('T')[0]

    const CATEGORY_AUTHOR_MAP = {
      'Educación Financiera':  'Miguel Freitas',
      'Inversión Inteligente': 'Carlos Almeida',
      'Tarjetas de Crédito':   'Lucas Moraes',
      'Préstamos Personales':  'Felipe Pires',
      'Ahorro Inteligente':    'Miguel Freitas',
    }
    const author = CATEGORY_AUTHOR_MAP[category] || 'Miguel Freitas'

    const article = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      slug,
      title,
      content: mainContent,
      status: 'draft',
      language: lang,
      category,
      siteId,
      imageUrl: '',
      imageCode: '',
      createdAt: new Date().toISOString(),
      // Money post specific fields
      date: today,
      excerpt,
      author,
      lang,
      // Store metadata for later use
      ctaUrl: ctaUrl || '',
    }

    // Save as draft in articles.json (read first, will write once at end)
    let data = []
    try { data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8')) } catch { data = [] }
    data.unshift(article)

    // ── Generate P1 (presell) ────────────────────────────────────────────
    let presell = null
    let p1Error = null
    try {
      // small delay to avoid rate-limit after P2 call
      await new Promise(r => setTimeout(r, 4000))
      const p1PromptText = buildP1Prompt({
        category,
        language: lang,
        moneyPostTitle: title,
        moneyPostSlug: slug,
      })

      let p1Content = await generateContent(p1PromptText, geminiKeys)
      if (p1Content && typeof p1Content === 'string') {
        p1Content = p1Content.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()
        // Strip any accidental title comment if model added one
        p1Content = p1Content.replace(/<!--\s*TITLE:[^>]+-->/i, '').trim()

        // P1 uses the SAME title as the money post
        const p1Title = title

        const p1ExcerptMatch = p1Content.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
        const p1Excerpt = p1ExcerptMatch
          ? p1ExcerptMatch[1].replace(/<[^>]+>/g, '').substring(0, 150)
          : p1Title.substring(0, 150)

        presell = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 6) + 'p1',
          slug,   // same slug as money post — publishes to src/content/p1/
          title: p1Title,
          content: p1Content,
          status: 'draft',
          language: lang,
          category,
          siteId,
          imageUrl: '',
          imageCode: '',
          createdAt: new Date().toISOString(),
          date: today,
          excerpt: p1Excerpt,
          author,
          lang,
          type: 'p1',
          p1Of: article.id,
          moneyPostSlug: slug,
          ctaUrl: '',
        }

        data.unshift(presell)

        // Link p1 back to money post
        const mpIdx = data.findIndex(a => a.id === article.id)
        if (mpIdx !== -1) data[mpIdx].p1Id = presell.id
      }
    } catch (p1Err) {
      p1Error = p1Err.message || 'Erro desconhecido ao gerar P1'
      console.error('[MoneyPostGenerator] P1 generation failed (continuing):', p1Error)
    }

    // Write both records at once
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))

    return Response.json({ moneyPost: article, presell, p1Error })
  } catch (error) {
    console.error('[MoneyPostGenerator] Error:', error)
    return Response.json(
      { error: error.message || 'Erro ao gerar Money Post' },
      { status: 500 }
    )
  }
}
