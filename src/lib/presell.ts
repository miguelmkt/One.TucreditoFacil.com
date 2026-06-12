/**
 * Presell Service — loads all presell pages from /src/content/presell/*.json
 */
import type { Article } from '../data/types';

const modules = import.meta.glob<{ default: Article }>(
  '../content/presell/*.json',
  { eager: true },
);

function normalize(raw: Article): Article {
  return { ...raw, id: raw.id ?? raw.slug, lang: raw.lang ?? 'es' };
}

export function getPresells(): Article[] {
  return Object.values(modules)
    .map((m) => normalize(m.default))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPresellBySlug(slug: string): Article | undefined {
  return getPresells().find((p) => p.slug === slug);
}

export function getPresellBySlugAndLang(slug: string, lang: string): Article | undefined {
  return getPresells().filter((p) => p.lang === lang).find((p) => p.slug === slug);
}
