import type { Lang } from './translations';

/**
 * Category metadata translated per language.
 * Slugs remain the same across languages (URL consistency).
 */
export interface CategoryI18n {
  name: string;
}

export const categoryTranslations: Record<string, Record<Lang, CategoryI18n>> = {
  'educacao-financeira': {
    es: { name: 'Educación Financiera' },
    pt: { name: 'Educação Financeira' },
    en: { name: 'Financial Education' },
    fr: { name: 'Éducation Financière' },
  },
  'investimento-inteligente': {
    es: { name: 'Inversión Inteligente' },
    pt: { name: 'Investimento Inteligente' },
    en: { name: 'Smart Investing' },
    fr: { name: 'Investissement Intelligent' },
  },
  'cartoes-de-credito': {
    es: { name: 'Tarjetas de Crédito' },
    pt: { name: 'Cartões de Crédito' },
    en: { name: 'Credit Cards' },
    fr: { name: 'Cartes de Crédit' },
  },
  'emprestimos-pessoais': {
    es: { name: 'Préstamos Personales' },
    pt: { name: 'Empréstimos Pessoais' },
    en: { name: 'Personal Loans' },
    fr: { name: 'Prêts Personnels' },
  },
};

/** Returns translated category name for a given slug and language. Falls back to Spanish if not found. */
export function getCategoryI18n(slug: string, lang: Lang): CategoryI18n {
  const entry = categoryTranslations[slug];
  if (!entry) return { name: slug };
  return entry[lang] ?? entry['es'];
}
