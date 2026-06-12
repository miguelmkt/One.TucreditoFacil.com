/**
 * P1 Service — loads all P1 pages from /src/content/p1/*.json
 */
import type { Article } from '../data/types';

const modules = import.meta.glob<{ default: Article }>(
  '../content/p1/*.json',
  { eager: true },
);

function normalize(raw: Article): Article {
  return { ...raw, id: raw.id ?? raw.slug, lang: raw.lang ?? 'es' };
}

export function getP1s(): Article[] {
  return Object.values(modules)
    .map((m) => normalize(m.default))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getP1BySlug(slug: string): Article | undefined {
  return getP1s().find((p) => p.slug === slug);
}

export function getP1BySlugAndLang(slug: string, lang: string): Article | undefined {
  return getP1s().filter((p) => p.lang === lang).find((p) => p.slug === slug);
}
