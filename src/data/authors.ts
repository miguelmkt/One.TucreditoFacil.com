import { siteConfig } from '../config/siteConfig';

export interface AuthorData {
  name: string;
  slug: string;
  image: string;
  role: { es: string; pt: string; en: string; fr: string };
  bio: { es: string; pt: string; en: string; fr: string };
  shortBio: { es: string; pt: string; en: string; fr: string };
  social: Record<string, string>;
}

export const authors: AuthorData[] = [
  {
    name: 'Miguel Freitas',
    slug: 'miguel-freitas',
    image: '/imagens/avatar-author/miguel-freitas.svg',
    role: {
      es: 'Editor & Especialista en Finanzas Personales',
      pt: 'Editor & Especialista em Finanças Pessoais',
      en: 'Editor & Personal Finance Specialist',
      fr: 'Éditeur & Spécialiste en Finances Personnelles',
    },
    bio: {
      es: `Miguel Freitas, de 38 años, lidera la estrategia editorial de ${siteConfig.siteName} con foco en finanzas personales. Con años de experiencia produciendo guías sobre ahorro, inversión y planificación financiera, ayuda a lectores a tomar decisiones informadas para mejorar su economía personal.`,
      pt: `Miguel Freitas, de 38 anos, lidera a estratégia editorial do ${siteConfig.siteName} com foco em finanças pessoais. Com anos de experiência produzindo guias sobre poupança, investimento e planejamento financeiro, ajuda leitores a tomarem decisões informadas para melhorar sua economia pessoal.`,
      en: `Miguel Freitas, 38, leads the editorial strategy at ${siteConfig.siteName} focusing on personal finance. With years of experience creating guides on saving, investing and financial planning, he helps readers make informed decisions to improve their personal finances.`,
      fr: `Miguel Freitas, 38 ans, dirige la stratégie éditoriale de ${siteConfig.siteName} axée sur les finances personnelles. Fort de plusieurs années d'expérience dans la création de guides sur l'épargne, l'investissement et la planification financière, il aide les lecteurs à prendre des décisions éclairées pour améliorer leur budget.`,
    },
    shortBio: {
      es: `Editor y especialista en finanzas personales en ${siteConfig.siteName}. Comparte consejos prácticos sobre ahorro, inversión y tarjetas de crédito.`,
      pt: `Editor e especialista em finanças pessoais no ${siteConfig.siteName}. Compartilha dicas práticas sobre poupança, investimento e cartões de crédito.`,
      en: `Editor and personal finance specialist at ${siteConfig.siteName}. Shares practical tips on saving, investing and credit cards.`,
      fr: `Éditeur et spécialiste des finances personnelles chez ${siteConfig.siteName}. Partage conseils pratiques sur l'épargne, l'investissement et les cartes de crédit.`,
    },
    social: {},
  },
  {
    name: 'Carlos Almeida',
    slug: 'carlos-almeida',
    image: '/imagens/avatar-author/carlos-almeida.svg',
    role: {
      es: 'Especialista en Inversiones',
      pt: 'Especialista em Investimentos',
      en: 'Investment Specialist',
      fr: 'Spécialiste en Investissement',
    },
    bio: {
      es: `Carlos Almeida, de 41 años, es columnista en ${siteConfig.siteName} especializado en inversión y mercados. Aporta análisis sobre estrategias de inversión, gestión de carteras y selección de activos para distintos perfiles de riesgo.`,
      pt: `Carlos Almeida, de 41 anos, é colunista no ${siteConfig.siteName} especializado em investimento e mercados. Fornece análises sobre estratégias de investimento, gestão de carteira e seleção de ativos para diferentes perfis de risco.`,
      en: `Carlos Almeida, 41, is a columnist at ${siteConfig.siteName} specializing in investment and markets. He provides analysis on investment strategies, portfolio management and asset selection for different risk profiles.`,
      fr: `Carlos Almeida, 41 ans, est chroniqueur chez ${siteConfig.siteName} spécialisé dans l'investissement et les marchés. Il propose des analyses sur les stratégies d'investissement, la gestion de portefeuille et la sélection d'actifs.`,
    },
    shortBio: {
      es: `Especialista en inversiones en ${siteConfig.siteName}. Análisis y estrategias para invertir con sentido.`,
      pt: `Especialista em investimentos no ${siteConfig.siteName}. Análises e estratégias para investir com propósito.`,
      en: `Investment specialist at ${siteConfig.siteName}. Analysis and strategies to invest wisely.`,
      fr: `Spécialiste en investissement chez ${siteConfig.siteName}. Analyses et stratégies pour investir intelligemment.`,
    },
    social: {},
  },
  {
    name: 'Lucas Moraes',
    slug: 'lucas-moraes',
    image: '/imagens/avatar-author/lucas-moraes.svg',
    role: {
      es: 'Especialista en Educación Financiera',
      pt: 'Especialista em Educação Financeira',
      en: 'Personal Finance Education Specialist',
      fr: 'Spécialiste en Éducation Financière',
    },
    bio: {
      es: `Lucas Moraes, de 34 años, es redactor en ${siteConfig.siteName}, especializado en educación financiera y hábitos de consumo responsable. Publica guías prácticas para ahorrar, presupuestar y mejorar la salud financiera personal.`,
      pt: `Lucas Moraes, de 34 anos, é redator no ${siteConfig.siteName}, especializado em educação financeira e hábitos de consumo responsável. Publica guias práticos para poupar, orçar e melhorar a saúde financeira pessoal.`,
      en: `Lucas Moraes, 34, is a writer at ${siteConfig.siteName}, specialized in personal finance education and responsible spending habits. He publishes practical guides on saving, budgeting and improving financial health.`,
      fr: `Lucas Moraes, 34 ans, est rédacteur chez ${siteConfig.siteName}, spécialisé dans l'éducation financière et les habitudes de consommation responsables. Il publie des guides pratiques sur l'épargne, la gestion du budget et la santé financière.`,
    },
    shortBio: {
      es: `Especialista en educación financiera en ${siteConfig.siteName}. Guías prácticas para ahorrar y presupuestar.`,
      pt: `Especialista em educação financeira no ${siteConfig.siteName}. Guias práticos para poupar e orçar.`,
      en: `Personal finance education specialist at ${siteConfig.siteName}. Practical guides for saving and budgeting.`,
      fr: `Spécialiste en éducation financière chez ${siteConfig.siteName}. Guides pratiques pour épargner et gérer son budget.`,
    },
    social: {},
  },
  {
    name: 'Felipe Pires',
    slug: 'felipe-pires',
    image: '/imagens/avatar-author/felipe-pires.svg',
    role: {
      es: 'Especialista en Tendencias Financieras',
      pt: 'Especialista em Tendências Financeiras',
      en: 'Financial Trends Specialist',
      fr: 'Spécialiste des Tendances Financières',
    },
    bio: {
      es: `Felipe Pires, de 37 años, es columnista en ${siteConfig.siteName} especializado en tendencias financieras y novedades del sector bancario y fintech. Investiga productos, nuevas herramientas y comportamientos del mercado para ofrecer análisis claros y útiles.`,
      pt: `Felipe Pires, de 37 anos, é colunista no ${siteConfig.siteName}, especializado em tendências financeiras e novidades do setor bancário e fintech. Pesquisa produtos, novas ferramentas e comportamentos de mercado para oferecer análises claras e úteis.`,
      en: `Felipe Pires, 37, is a columnist at ${siteConfig.siteName} specializing in financial trends and fintech. He researches products, tools and market behaviors to provide clear and useful analysis.`,
      fr: `Felipe Pires, 37 ans, est chroniqueur chez ${siteConfig.siteName} spécialisé dans les tendances financières et la fintech. Il étudie les produits, les outils et les comportements du marché pour fournir des analyses claires et utiles.`,
    },
    shortBio: {
      es: `Especialista en tendencias financieras en ${siteConfig.siteName}. Analiza productos bancarios y fintech.`,
      pt: `Especialista em tendências financeiras no ${siteConfig.siteName}. Analisa produtos bancários e fintech.`,
      en: `Financial trends specialist at ${siteConfig.siteName}. Analyzes banking products and fintech.`,
      fr: `Spécialiste des tendances financières chez ${siteConfig.siteName}. Analyse produits bancaires et fintech.`,
    },
    social: {},
  },
];

export function getAuthorByName(name: string): AuthorData | undefined {
  return authors.find(a => a.name.toLowerCase() === name.toLowerCase() || a.slug === name);
}

export function authorNameToSlug(name: string): string {
  const a = authors.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (a) return a.slug;
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getAuthorBySlug(slug: string): AuthorData | undefined {
  return authors.find(a => a.slug === slug);
}
