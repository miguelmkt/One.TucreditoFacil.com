import type { Lang } from './translations';

/**
 * Category metadata translated per language.
 * Slugs remain the same across languages (URL consistency).
 */
export interface CategoryI18n {
  name: string;
}

export const categoryTranslations: Record<string, Record<Lang, CategoryI18n>> = {
  'estilo-de-vida-pet': {
    es: { name: 'Estilo de Vida con Mascotas' },
    pt: { name: 'Estilo de Vida Pet' },
    en: { name: 'Pet Lifestyle' },
    fr: { name: 'Style de Vie des Animaux' },
  },
  'atividades-e-diversao-com-pets': {
    es: { name: 'Actividades y Diversión con Mascotas' },
    pt: { name: 'Atividades e Diversão com Pets' },
    en: { name: 'Activities & Fun with Pets' },
    fr: { name: 'Activités et Amusement avec les Animaux' },
  },
  'racas-e-perfis-de-pets': {
    es: { name: 'Razas y Perfiles de Mascotas' },
    pt: { name: 'Raças e Perfis de Pets' },
    en: { name: 'Pet Breeds & Profiles' },
    fr: { name: "Races et Profils d'Animaux" },
  },
  'curiosidades-sobre-animais': {
    es: { name: 'Curiosidades sobre Animales de Compañía' },
    pt: { name: 'Curiosidades Sobre Animais de Estimação' },
    en: { name: 'Fun Facts About Pets' },
    fr: { name: 'Curiosités sur les Animaux de Compagnie' },
  },
};

/** Returns translated category name for a given slug and language. Falls back to Spanish if not found. */
export function getCategoryI18n(slug: string, lang: Lang): CategoryI18n {
  const entry = categoryTranslations[slug];
  if (!entry) return { name: slug };
  return entry[lang] ?? entry['es'];
}
