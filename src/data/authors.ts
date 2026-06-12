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
      es: 'Economista & Planificador Financiero',
      pt: 'Economista & Planejador Financeiro',
      en: 'Economist & Financial Planner',
      fr: 'Économiste & Planificateur Financier',
    },
    bio: {
      es: `Miguel Freitas, de 38 años, es economista especializado en planificación financiera personal. Lidera la estrategia editorial de ${siteConfig.siteName}, ayudando a familias a crear presupuestos sólidos y planes de ahorro efectivos.\n\nCon más de una década de experiencia en el sector financiero, Miguel combina conocimiento técnico con un enfoque accesible para hacer que las finanzas personales sean comprensibles para todos. Su misión es empoderar a los lectores con herramientas prácticas para alcanzar la estabilidad económica.`,
      pt: `Miguel Freitas, de 38 anos, é economista especializado em planejamento financeiro pessoal. Lidera a estratégia editorial do ${siteConfig.siteName}, ajudando famílias a criar orçamentos sólidos e planos de poupança eficazes.\n\nCom mais de uma década de experiência no setor financeiro, Miguel combina conhecimento técnico com uma abordagem acessível para tornar as finanças pessoais compreensíveis para todos. Sua missão é empoderar os leitores com ferramentas práticas para alcançar a estabilidade econômica.`,
      en: `Miguel Freitas, 38, is an economist specialized in personal financial planning. He leads the editorial strategy at ${siteConfig.siteName}, helping families build solid budgets and effective savings plans.\n\nWith over a decade of experience in the financial sector, Miguel combines technical knowledge with an accessible approach to make personal finance understandable for everyone. His mission is to empower readers with practical tools to achieve financial stability.`,
      fr: `Miguel Freitas, 38 ans, est économiste spécialisé en planification financière personnelle. Il dirige la stratégie éditoriale de ${siteConfig.siteName}, aidant les familles à créer des budgets solides et des plans d'épargne efficaces.\n\nAvec plus d'une décennie d'expérience dans le secteur financier, Miguel combine connaissances techniques et approche accessible pour rendre les finances personnelles compréhensibles pour tous. Sa mission est de donner aux lecteurs les outils pratiques pour atteindre la stabilité économique.`,
    },
    shortBio: {
      es: `Economista y planificador financiero en ${siteConfig.siteName}. Especializado en presupuestos familiares y planes de ahorro efectivos.`,
      pt: `Economista e planejador financeiro no ${siteConfig.siteName}. Especializado em orçamentos familiares e planos de poupança eficazes.`,
      en: `Economist and financial planner at ${siteConfig.siteName}. Specialized in family budgets and effective savings plans.`,
      fr: `Économiste et planificateur financier chez ${siteConfig.siteName}. Spécialisé dans les budgets familiaux et les plans d'épargne efficaces.`,
    },
    social: {},
  },
  {
    name: 'Carlos Almeida',
    slug: 'carlos-almeida',
    image: '/imagens/avatar-author/carlos-almeida.svg',
    role: {
      es: '',
      pt: '',
      en: '',
      fr: '',
    },
    bio: {
      es: `Carlos Almeida, de 41 años, es analista financiero certificado y uno de los principales columnistas de ${siteConfig.siteName}, donde comparte sus conocimientos sobre planificación financiera, crédito personal y estrategias de inversión accesibles.\n\nSu enfoque se centra en traducir conceptos financieros complejos en consejos prácticos que cualquier persona puede aplicar. Carlos ayuda a los lectores a comprender las tendencias del mercado y tomar decisiones informadas sobre sus inversiones.`,
      pt: `Carlos Almeida, de 41 anos, é analista financeiro certificado e um dos principais colunistas do ${siteConfig.siteName}, onde compartilha seus conhecimentos sobre planejamento financeiro, crédito pessoal e estratégias de investimento acessíveis.\n\nSeu foco é traduzir conceitos financeiros complexos em conselhos práticos que qualquer pessoa pode aplicar. Carlos ajuda os leitores a compreender as tendências do mercado e tomar decisões informadas sobre seus investimentos.`,
      en: `Carlos Almeida, 41, is a certified financial analyst and one of the main columnists at ${siteConfig.siteName}, where he shares expertise on financial planning, personal credit and accessible investment strategies.\n\nHis focus is on translating complex financial concepts into practical advice that anyone can apply. Carlos helps readers understand market trends and make informed decisions about their investments.`,
      fr: `Carlos Almeida, 41 ans, est analyste financier certifié et l'un des principaux chroniqueurs de ${siteConfig.siteName}, où il partage ses connaissances en planification financière, crédit personnel et stratégies d'investissement accessibles.\n\nSon objectif est de traduire des concepts financiers complexes en conseils pratiques que chacun peut appliquer. Carlos aide les lecteurs à comprendre les tendances du marché et à prendre des décisions éclairées sur leurs investissements.`,
    },
    shortBio: {
      es: `Analista financiero certificado en ${siteConfig.siteName}. Experto en planificación financiera, crédito personal e inversiones.`,
      pt: `Analista financeiro certificado no ${siteConfig.siteName}. Especialista em planejamento financeiro, crédito pessoal e investimentos.`,
      en: `Certified financial analyst at ${siteConfig.siteName}. Expert in financial planning, personal credit and investments.`,
      fr: `Analyste financier certifié chez ${siteConfig.siteName}. Expert en planification financière, crédit personnel et investissements.`,
    },
    social: {},
  },
  {
    name: 'Lucas Moraes',
    slug: 'lucas-moraes',
    image: '/imagens/avatar-author/lucas-moraes.svg',
    role: {
      es: 'Asesor Crediticio Certificado',
      pt: 'Consultor de Crédito Certificado',
      en: 'Certified Credit Advisor',
      fr: 'Conseiller en Crédit Certifié',
    },
    bio: {
      es: `Lucas Moraes, de 34 años, es redactor en ${siteConfig.siteName}, con un enfoque especial en finanzas para familias que buscan alcanzar la independencia financiera.\n\nCon amplia experiencia en asesoría crediticia, Lucas se dedica a educar a los lectores sobre cómo aprovechar al máximo las herramientas de crédito disponibles, evitar deudas innecesarias y construir un historial crediticio sólido que abra puertas a mejores oportunidades financieras.`,
      pt: `Lucas Moraes, de 34 anos, é redator no ${siteConfig.siteName}, com foco especial em finanças para famílias que buscam alcançar a independência financeira.\n\nCom ampla experiência em consultoria de crédito, Lucas se dedica a educar os leitores sobre como aproveitar ao máximo as ferramentas de crédito disponíveis, evitar dívidas desnecessárias e construir um histórico de crédito sólido que abra portas para melhores oportunidades financeiras.`,
      en: `Lucas Moraes, 34, is a writer at ${siteConfig.siteName}, with a special focus on finances for families seeking financial independence.\n\nWith extensive experience in credit advisory, Lucas is dedicated to educating readers on how to make the most of available credit tools, avoid unnecessary debt, and build a solid credit history that opens doors to better financial opportunities.`,
      fr: `Lucas Moraes, 34 ans, est rédacteur chez ${siteConfig.siteName}, avec un focus particulier sur les finances pour les familles cherchant l'indépendance financière.\n\nAvec une vaste expérience en conseil en crédit, Lucas se consacre à éduquer les lecteurs sur la façon de tirer le meilleur parti des outils de crédit disponibles, d'éviter les dettes inutiles et de construire un historique de crédit solide ouvrant les portes à de meilleures opportunités financières.`,
    },
    shortBio: {
      es: `Asesor crediticio certificado en ${siteConfig.siteName}. Especializado en crédito personal e independencia financiera.`,
      pt: `Consultor de crédito certificado no ${siteConfig.siteName}. Especializado em crédito pessoal e independência financeira.`,
      en: `Certified credit advisor at ${siteConfig.siteName}. Specialized in personal credit and financial independence.`,
      fr: `Conseiller en crédit certifié chez ${siteConfig.siteName}. Spécialisé en crédit personnel et indépendance financière.`,
    },
    social: {},
  },
  {
    name: 'Felipe Pires',
    slug: 'felipe-pires',
    image: '/imagens/avatar-author/felipe-pires.svg',
    role: {
      es: 'Asesor Fiscal y Tributario',
      pt: 'Consultor Fiscal e Tributário',
      en: 'Tax and Fiscal Advisor',
      fr: 'Conseiller Fiscal et Tributaire',
    },
    bio: {
      es: `Felipe Pires, de 37 años, es columnista en ${siteConfig.siteName}, especializado en crédito personal, inversiones y estrategias financieras a largo plazo.\n\nSu experiencia en asesoría fiscal le permite ofrecer una perspectiva única sobre optimización tributaria y planificación patrimonial. Felipe ayuda a los lectores a entender cómo las decisiones fiscales impactan directamente su bienestar financiero y cómo aprovechar los beneficios tributarios disponibles.`,
      pt: `Felipe Pires, de 37 anos, é colunista no ${siteConfig.siteName}, especializado em crédito pessoal, investimentos e estratégias financeiras de longo prazo.\n\nSua experiência em consultoria fiscal permite oferecer uma perspectiva única sobre otimização tributária e planejamento patrimonial. Felipe ajuda os leitores a entender como as decisões fiscais impactam diretamente seu bem-estar financeiro e como aproveitar os benefícios tributários disponíveis.`,
      en: `Felipe Pires, 37, is a columnist at ${siteConfig.siteName}, specialized in personal credit, investments and long-term financial strategies.\n\nHis experience in tax advisory provides a unique perspective on tax optimization and wealth planning. Felipe helps readers understand how fiscal decisions directly impact their financial well-being and how to take advantage of available tax benefits.`,
      fr: `Felipe Pires, 37 ans, est chroniqueur chez ${siteConfig.siteName}, spécialisé en crédit personnel, investissements et stratégies financières à long terme.\n\nSon expérience en conseil fiscal lui permet d'offrir une perspective unique sur l'optimisation fiscale et la planification patrimoniale. Felipe aide les lecteurs à comprendre comment les décisions fiscales impactent directement leur bien-être financier et comment profiter des avantages fiscaux disponibles.`,
    },
    shortBio: {
      es: `Asesor fiscal y tributario en ${siteConfig.siteName}. Experto en crédito personal, inversiones y estrategias a largo plazo.`,
      pt: `Consultor fiscal e tributário no ${siteConfig.siteName}. Especialista em crédito pessoal, investimentos e estratégias de longo prazo.`,
      en: `Tax and fiscal advisor at ${siteConfig.siteName}. Expert in personal credit, investments and long-term strategies.`,
      fr: `Conseiller fiscal et tributaire chez ${siteConfig.siteName}. Expert en crédit personnel, investissements et stratégies à long terme.`,
    },
    social: {},
  },
];

/** Find author by slug */
export function getAuthorBySlug(slug: string): AuthorData | undefined {
  return authors.find((a) => a.slug === slug);
}

/** Find author by name */
export function getAuthorByName(name: string): AuthorData | undefined {
  return authors.find((a) => a.name === name);
}

/** Convert author name to slug */
export function authorNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}
