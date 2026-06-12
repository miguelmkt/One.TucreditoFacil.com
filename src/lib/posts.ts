/**
 * Post Service — fonte única de verdade para todos os artigos do blog.
 *
 * Como funciona:
 *   - Cada artigo é um arquivo JSON em /src/content/posts/<slug>.json
 *   - O Vite carrega todos os arquivos via import.meta.glob em tempo de build
 *   - Scripts automáticos de geração de conteúdo só precisam criar/editar esses JSONs
 *
 * Multilingual:
 *   - Posts com `lang` field são filtrados por idioma nas funções *ByLang
 *   - Posts sem `lang` são considerados legado (lang = 'es')
 *   - `translationKey` vincula versões do mesmo artigo em idiomas diferentes
 *
 * Formato esperado dos arquivos JSON: ver interface Article em ../data/types.ts
 */

import type { Article } from '../data/types';

// Carrega todos os JSONs de /src/content/posts/ em tempo de build.
const modules = import.meta.glob<{ default: Article }>(
  '../content/posts/*.json',
  { eager: true },
);

/** Normaliza um post bruto do JSON, garantindo campos derivados. */
function normalize(raw: Article): Article {
  return {
    ...raw,
    id: raw.id ?? raw.slug,
    lang: raw.lang ?? 'es',
  };
}

/**
 * Retorna todos os posts ordenados do mais recente ao mais antigo.
 */
export function getPosts(): Article[] {
  return Object.values(modules)
    .map((m) => normalize(m.default))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Retorna todos os posts de um idioma específico, mais recentes primeiro.
 */
export function getPostsByLang(lang: string): Article[] {
  return getPosts().filter((p) => p.lang === lang);
}

/**
 * Retorna um post específico pelo slug, ou undefined se não existir.
 */
export function getPostBySlug(slug: string): Article | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/**
 * Retorna um post pelo slug dentro de um idioma específico.
 */
export function getPostBySlugAndLang(slug: string, lang: string): Article | undefined {
  return getPostsByLang(lang).find((p) => p.slug === slug);
}

/**
 * Retorna todos os posts de uma categoria, mais recentes primeiro.
 */
export function getPostsByCategory(category: string): Article[] {
  return getPosts().filter((p) => p.category === category);
}

/**
 * Retorna todos os posts de uma categoria num idioma específico.
 */
export function getPostsByCategoryAndLang(category: string, lang: string): Article[] {
  return getPostsByLang(lang).filter((p) => p.category === category);
}

/**
 * Retorna as versões traduzidas de um artigo por translationKey.
 * Útil para gerar tags hreflang.
 */
export function getArticleTranslations(translationKey: string): Article[] {
  return getPosts().filter((p) => p.translationKey === translationKey);
}
