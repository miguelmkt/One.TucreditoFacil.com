import { gerarTexto } from "./ollama";

const LANG_LABELS: Record<string, string> = {
  pt: 'português',
  en: 'English',
  fr: 'français',
  es: 'español',
};

export interface GeneratePostOptions {
  title: string;
  slug: string;
  lang: string;
  translationKey: string;
  category: string;
  imageNumber: number;
  author: string;
}

export async function generatePost(opts: GeneratePostOptions) {
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

  const [excerpt, content] = await Promise.all([
    gerarTexto(excerptPrompt),
    gerarTexto(contentPrompt),
  ]);

  const date = new Date().toISOString().split('T')[0];

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
    content: (content ?? '').trim(),
  };
}
