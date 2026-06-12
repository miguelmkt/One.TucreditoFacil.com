import { gerarTexto } from './ollama';

const LANG_LABELS: Record<string, string> = {
  pt: 'português',
  en: 'English',
  fr: 'français',
  es: 'español',
};

export interface GenerateMoneyPostOptions {
  title: string;
  slug: string;
  lang: string;
  translationKey: string;
  category: string;
  imageNumber: number;
  author: string;
}

export async function generateMoneyPost(opts: GenerateMoneyPostOptions) {
  const { title, slug, lang, translationKey, category, imageNumber, author } = opts;
  const langLabel = LANG_LABELS[lang] ?? lang;

  const excerptPrompt = `Write a single compelling SEO excerpt (2 sentences, max 160 characters) in ${langLabel} for an article titled: "${title}". Return only the excerpt text, no quotes.`;
  const contentPrompt = `Write a full SEO blog article in ${langLabel} about: "${title}"

Requirements:
- Minimum 1200 words
- Use H2 and H3 headings (no H1)
- Natural language, engaging tone
- Introduction and conclusion paragraphs
- At least one bullet list (<ul><li>)
- Optimized for AdSense
- Return only valid HTML content (p, h2, h3, ul, li tags). No markdown, no code blocks.`;

  const [excerpt, rawContent] = await Promise.all([
    gerarTexto(excerptPrompt),
    gerarTexto(contentPrompt),
  ]);

  const date = new Date().toISOString().split('T')[0];

  // Inject <!-- AD4 --> before the 2nd <h2> so the ad block appears mid-article
  function injectAd4(html: string): string {
    let count = 0;
    let pos = 0;
    while (pos < html.length) {
      const idx = html.indexOf('<h2', pos);
      if (idx === -1) break;
      count++;
      if (count === 2) {
        return html.slice(0, idx) + '\n\n<!-- AD4 -->\n\n' + html.slice(idx);
      }
      pos = idx + 3;
    }
    // Fallback: insert at 40% mark if fewer than 2 h2s
    const cut = Math.floor(html.length * 0.4);
    const nextClose = html.indexOf('>', cut);
    const insertAt = nextClose !== -1 ? nextClose + 1 : cut;
    return html.slice(0, insertAt) + '\n\n<!-- AD4 -->\n\n' + html.slice(insertAt);
  }

  const content = injectAd4((rawContent ?? '').trim());

  return {
    title,
    slug,
    lang,
    translationKey,
    category,
    date,
    image: `/imagens/img-post/${imageNumber}.png`,
    excerpt: (excerpt ?? '').trim(),
    author,
    content,
    isMoneyPost: true,
  };
}
