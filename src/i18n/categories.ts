import type { Lang } from './translations';

/**
 * Category metadata translated per language.
 * Slugs remain the same across languages (URL consistency).
 */
export interface CategoryI18n {
  name: string;
}

export const categoryTranslations: Record<string, Record<Lang, CategoryI18n>> = {
  'educacion-financiera': {
    es: { name: 'Educación Financiera' },
    pt: { name: 'Educação Financeira' },
    en: { name: 'Financial Education' },
    fr: { name: 'Éducation Financière' },
  },
  'inversion-inteligente': {
    es: { name: 'Inversión Inteligente' },
    pt: { name: 'Investimento Inteligente' },
    en: { name: 'Smart Investing' },
    fr: { name: 'Investissement Intelligent' },
  },
  'tarjetas-credito': {
    es: { name: 'Tarjetas de Crédito' },
    pt: { name: 'Cartões de Crédito' },
    en: { name: 'Credit Cards' },
    fr: { name: 'Cartes de Crédit' },
  },
  'prestamos-personales': {
    es: { name: 'Préstamos Personales' },
    pt: { name: 'Empréstimos Pessoais' },
    en: { name: 'Personal Loans' },
    fr: { name: 'Prêts Personnels' },
  },
  'financiamiento': {
    es: { name: 'Financiamiento' },
    pt: { name: 'Financiamento' },
    en: { name: 'Financing' },
    fr: { name: 'Financement' },
  },
};

/** Returns translated category name for a given slug and language. Falls back to Spanish if not found. */
export function getCategoryI18n(slug: string, lang: Lang): CategoryI18n {
  const entry = categoryTranslations[slug];
  if (!entry) return { name: slug };
  return entry[lang] ?? entry['es'];
}
