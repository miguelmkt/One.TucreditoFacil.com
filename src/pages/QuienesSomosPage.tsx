import { siteConfig, siteCategories } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';

function lp(lang: string, path: string) {
  return lang === 'es' ? path : `/${lang}${path}`;
}

// Helper to get translated category slug by English name or Spanish slug
function getCategorySlugForLang(rawSlug: string, lang: string): string {
  const cat = siteCategories.find(c => c.slug === rawSlug);
  if (!cat) return rawSlug;
  return cat.slugs[lang as keyof typeof cat.slugs] || cat.slug;
}

interface AboutContent {
  heading: string; intro: string;
  mission: { h: string; p: string };
  whatYouFind: { h: string };
  howWeWork: { h: string; items: [string, string][] };
  team: { h: string; p: string };
  values: { h: string; items: [string, string][] };
  join: { h: string; p: string; link: string };
}

type WhatYouFindItem = {
  slug: string;
  title: string;
  description: string;
};

const whatYouFindDescriptions: Record<string, Record<string, string>> = {
  'educacion-financiera': {
    es: 'fundamentos de presupuesto, ahorro y salud crediticia.',
    pt: 'fundamentos de orçamento, poupança e saúde creditícia.',
    en: 'budgeting fundamentals, savings and credit health.',
    fr: 'fondamentaux du budget, de l\'épargne et de la santé financière.',
  },
  'inversion-inteligente': {
    es: 'tácticas de diversificación y gestión de riesgos.',
    pt: 'táticas de diversificação e gestão de riscos.',
    en: 'diversification tactics and risk management.',
    fr: 'tactiques de diversification et gestion des risques.',
  },
  'tarjetas-credito': {
    es: 'comparativas de costos, beneficios y estrategias de uso responsable.',
    pt: 'comparativos de custos, benefícios e estratégias de uso responsável.',
    en: 'cost comparisons, benefits and responsible use strategies.',
    fr: 'comparatifs de coûts, avantages et stratégies d\'utilisation responsable.',
  },
  'prestamos-personales': {
    es: 'guías para elegir la mejor opción y administrar la deuda.',
    pt: 'guias para escolher a melhor opção e administrar a dívida.',
    en: 'guides to choose the best option and manage debt.',
    fr: 'guides pour choisir la meilleure option et gérer la dette.',
  },
  'ahorro-inteligente': {
    es: 'calculadoras, plantillas y recursos interactivos para planificar tu futuro.',
    pt: 'calculadoras, modelos e recursos interativos para planejar seu futuro.',
    en: 'calculators, templates and interactive resources to plan your future.',
    fr: 'calculatrices, modèles et ressources interactives pour planifier votre avenir.',
  },
};

function getWhatYouFindItems(lang: string): WhatYouFindItem[] {
  return siteCategories.map((category) => {
    const description = whatYouFindDescriptions[category.slug]?.[lang] ?? whatYouFindDescriptions[category.slug]?.es ?? `contenido relacionado con ${category.name.toLowerCase()}.`;
    return {
      slug: category.slug,
      title: category.name,
      description,
    };
  });
}

const aboutContent: Record<string, AboutContent> = {
  es: {
    heading: 'Sobre Nosotros',
    intro: `${siteConfig.siteName} nace para convertir la educación financiera en una herramienta cotidiana. Con análisis claros y soluciones prácticas, te guiamos para que tomes decisiones inteligentes sobre crédito, ahorro e inversión.`,
    mission: { h: 'Nuestra Misión', p: 'Facilitar el acceso a conocimiento financiero confiable y útil, empoderando a cada lector para optimizar su dinero y alcanzar metas personales.' },
    whatYouFind: { h: 'Qué Encontrarás' },
    howWeWork: { h: 'Cómo Trabajamos', items: [
      ['Investigación Profunda', 'datos de bancos centrales, estudios académicos y reportes de mercado.'],
      ['Lenguaje Simple', 'explicaciones sin tecnicismos innecesarios y ejemplos del día a día.'],
      ['Aplicación Directa', 'cada contenido termina con pasos concretos para implementar de inmediato.'],
    ]},
    team: { h: 'El Equipo', p: 'Economistas, analistas de crédito, periodistas especializados y desarrolladores fintech colaboran para ofrecer perspectivas diversas y libres de conflicto de interés.' },
    values: { h: 'Nuestros Valores', items: [
      ['Transparencia', 'citamos fuentes y declaramos posibles sesgos.'],
      ['Inclusión', 'información útil para todos los niveles de conocimiento.'],
      ['Innovación', 'adoptamos nuevas tecnologías y metodologías.'],
      ['Confianza', 'medimos nuestro éxito por tu progreso financiero.'],
    ]},
    join: { h: 'Únete a la Comunidad', p: 'Suscríbete al boletín, comparte tus dudas en los comentarios y acompáñanos en el camino hacia una', link: 'vida financiera más saludable' },
  },
  pt: {
    heading: 'Sobre Nós',
    intro: `${siteConfig.siteName} nasce para transformar a educação financeira em uma ferramenta do dia a dia. Com análises claras e soluções práticas, guiamos você para tomar decisões inteligentes sobre crédito, poupança e investimentos.`,
    mission: { h: 'Nossa Missão', p: 'Facilitar o acesso ao conhecimento financeiro confiável e útil, capacitando cada leitor para otimizar seu dinheiro e alcançar suas metas pessoais.' },
    whatYouFind: { h: 'O Que Você Encontrará' },
    howWeWork: { h: 'Como Trabalhamos', items: [
      ['Pesquisa Aprofundada', 'dados de bancos centrais, estudos acadêmicos e relatórios de mercado.'],
      ['Linguagem Simples', 'explicações sem tecnicismos desnecessários e exemplos do cotidiano.'],
      ['Aplicação Direta', 'cada conteúdo termina com passos concretos para implementar imediatamente.'],
    ]},
    team: { h: 'A Equipe', p: 'Economistas, analistas de crédito, jornalistas especializados e desenvolvedores fintech colaboram para oferecer perspectivas diversas e livres de conflito de interesse.' },
    values: { h: 'Nossos Valores', items: [
      ['Transparência', 'citamos fontes e declaramos possíveis vieses.'],
      ['Inclusão', 'informações úteis para todos os níveis de conhecimento.'],
      ['Inovação', 'adotamos novas tecnologias e metodologias.'],
      ['Confiança', 'medimos nosso sucesso pelo seu progresso financeiro.'],
    ]},
    join: { h: 'Junte-se à Comunidade', p: 'Assine o boletim, compartilhe suas dúvidas nos comentários e nos acompanhe no caminho para uma', link: 'vida financeira mais saudável' },
  },
  en: {
    heading: 'About Us',
    intro: `${siteConfig.siteName} was created to turn financial education into an everyday tool. With clear analyses and practical solutions, we guide you to make smart decisions about credit, savings and investing.`,
    mission: { h: 'Our Mission', p: 'To facilitate access to reliable and useful financial knowledge, empowering each reader to optimize their money and reach personal goals.' },
    whatYouFind: { h: 'What You Will Find' },
    howWeWork: { h: 'How We Work', items: [
      ['In-Depth Research', 'data from central banks, academic studies and market reports.'],
      ['Simple Language', 'explanations without unnecessary jargon and real-life examples.'],
      ['Direct Application', 'each article ends with concrete steps to implement right away.'],
    ]},
    team: { h: 'The Team', p: 'Economists, credit analysts, specialized journalists and fintech developers collaborate to offer diverse perspectives free from conflicts of interest.' },
    values: { h: 'Our Values', items: [
      ['Transparency', 'we cite sources and disclose possible biases.'],
      ['Inclusion', 'useful information for all knowledge levels.'],
      ['Innovation', 'we adopt new technologies and methodologies.'],
      ['Trust', 'we measure our success by your financial progress.'],
    ]},
    join: { h: 'Join the Community', p: 'Subscribe to the newsletter, share your questions in the comments and join us on the path to a', link: 'healthier financial life' },
  },
  fr: {
    heading: 'Qui Sommes-nous',
    intro: `${siteConfig.siteName} est né pour transformer l'éducation financière en outil du quotidien. Avec des analyses claires et des solutions pratiques, nous vous guidons pour prendre des décisions intelligentes sur le crédit, l'épargne et l'investissement.`,
    mission: { h: 'Notre Mission', p: "Faciliter l'accès à des connaissances financières fiables et utiles, en donnant à chaque lecteur les moyens d'optimiser son argent et d'atteindre ses objectifs personnels." },
    whatYouFind: { h: 'Ce Que Vous Trouverez' },
    howWeWork: { h: 'Comment Nous Travaillons', items: [
      ['Recherche Approfondie', "données des banques centrales, études académiques et rapports de marché."],
      ['Langage Simple', "explications sans jargon inutile et exemples du quotidien."],
      ['Application Directe', "chaque article se termine par des étapes concrètes à mettre en œuvre immédiatement."],
    ]},
    team: { h: "L'Équipe", p: "Des économistes, des analystes de crédit, des journalistes spécialisés et des développeurs fintech collaborent pour offrir des perspectives diverses et sans conflits d'intérêts." },
    values: { h: 'Nos Valeurs', items: [
      ['Transparence', 'nous citons nos sources et déclarons les biais possibles.'],
      ['Inclusion', 'informations utiles pour tous les niveaux de connaissance.'],
      ['Innovation', 'nous adoptons de nouvelles technologies et méthodologies.'],
      ['Confiance', 'nous mesurons notre succès par vos progrès financiers.'],
    ]},
    join: { h: 'Rejoignez la Communauté', p: "Abonnez-vous à la newsletter, partagez vos questions dans les commentaires et accompagnez-nous sur le chemin d'une", link: 'vie financière plus saine' },
  },
};

export default function QuienesSomosPage() {
  const { lang } = useLang();
  const c = aboutContent[lang] ?? aboutContent.es;

  return (
    <main className="min-h-screen py-10 px-4 bg-[var(--brand-bg-gray)]">
      <div className="max-w-2xl mx-auto bg-white rounded-xl px-8 py-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{c.heading}</h1>
        <p className="text-sm text-gray-700 mb-6">{c.intro}</p>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{c.mission.h}</h2>
        <p className="text-sm text-gray-700 mb-6">{c.mission.p}</p>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{c.whatYouFind.h}</h2>
        <ul className="text-sm text-gray-700 space-y-2 mb-6">
          {getWhatYouFindItems(lang).map(({ slug, title, description }) => (
            <li key={slug}>
              <a href={lp(lang, `/c/${getCategorySlugForLang(slug, lang)}`)} className="font-bold text-[var(--brand-secondary)] hover:underline">{title}</a> – {description}
            </li>
          ))}
        </ul>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{c.howWeWork.h}</h2>
        <ol className="text-sm text-gray-700 space-y-2 mb-6 list-decimal pl-5">
          {c.howWeWork.items.map(([titulo, desc]) => (
            <li key={titulo}><strong>{titulo}</strong> – {desc}</li>
          ))}
        </ol>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{c.team.h}</h2>
        <p className="text-sm text-gray-700 mb-6">{c.team.p}</p>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{c.values.h}</h2>
        <ul className="text-sm text-gray-700 space-y-2 mb-6">
          {c.values.items.map(([titulo, desc]) => (
            <li key={titulo}><strong>{titulo}</strong> – {desc}</li>
          ))}
        </ul>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{c.join.h}</h2>
        <p className="text-sm text-gray-700">
          {c.join.p}{' '}
          <a href={lp(lang, '/contacto')} className="text-[var(--brand-secondary)] hover:underline">{c.join.link}</a>.
        </p>
      </div>
    </main>
  );
}