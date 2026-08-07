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
  'educacao-financeira': {
    es: 'conceptos básicos de finanzas personales, ahorro, presupuesto y gestión del dinero.',
    pt: 'conceitos básicos de finanças pessoais, poupança, orçamento e gestão do dinheiro.',
    en: 'personal finance basics, saving, budgeting and money management.',
    fr: 'notions de base en finances personnelles, épargne, budget et gestion de l\'argent.',
  },
  'investimento-inteligente': {
    es: 'estrategias de inversión, selección de activos y planificación para el largo plazo.',
    pt: 'estratégias de investimento, seleção de ativos e planeamento de longo prazo.',
    en: 'investment strategies, asset selection and long-term planning.',
    fr: 'stratégies d\'investissement, sélection d\'actifs et planification à long terme.',
  },
  'cartoes-de-credito': {
    es: 'comparativas de tarjetas, recompensas, comisiones y cómo usar el crédito responsablemente.',
    pt: 'comparativos de cartões, recompensas, taxas e como usar o crédito de forma responsável.',
    en: 'credit card comparisons, rewards, fees and how to use credit responsibly.',
    fr: 'comparaisons de cartes, récompenses, frais et comment utiliser le crédit de manière responsable.',
  },
  'emprestimos-pessoais': {
    es: 'tipos de préstamos, tasas de interés, simuladores y consejos para solicitar crédito con seguridad.',
    pt: 'tipos de empréstimos, taxas de juros, simuladores e dicas para solicitar crédito com segurança.',
    en: 'loan types, interest rates, calculators and tips for applying for credit safely.',
    fr: 'types de prêts, taux d\'intérêt, simulateurs et conseils pour demander un crédit en toute sécurité.',
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
    intro: `${siteConfig.siteName} nace para ayudar a las personas a tomar mejores decisiones financieras. Compartimos guías sobre ahorro, inversión, tarjetas de crédito y préstamos para mejorar la salud económica personal.`,
    mission: { h: 'Nuestra Misión', p: 'Acercar a las personas a buenos hábitos financieros mediante información útil, clara y con enfoque práctico, promoviendo decisiones económicas más seguras y conscientes.' },
    whatYouFind: { h: 'Qué Encontrarás' },
    howWeWork: { h: 'Cómo Trabajamos', items: [
      ['Investigación Especializada', 'contenidos basados en datos financieros, análisis de productos y buenas prácticas comprobadas.'],
      ['Lenguaje Cercano', 'textos accesibles y prácticos, pensados para cualquier persona interesada en mejorar su economía.'],
      ['Enfoque Práctico', 'cada artículo incluye pasos y herramientas que puedes aplicar para mejorar tus finanzas hoy mismo.'],
    ]},
    team: { h: 'El Equipo', p: 'Periodistas financieros, analistas y educadores colaboran para ofrecer contenidos claros, confiables y orientados a resultados personales.' },
    values: { h: 'Nuestros Valores', items: [
      ['Transparencia', 'contenido claro y fundamentado.'],
      ['Confiabilidad', 'información verificada y basada en buenas prácticas financieras.'],
      ['Accesibilidad', 'guías útiles para todos los niveles de conocimiento.'],
      ['Empoderamiento', 'ayudamos a las personas a tomar mejores decisiones con su dinero.'],
    ]},
    join: { h: 'Únete a la Comunidad', p: 'Suscríbete al boletín, comparte tus dudas en los comentarios y acompáñanos en el camino hacia', link: 'una mejor salud financiera' },
  },
  pt: {
    heading: 'Sobre Nós',
    intro: `${siteConfig.siteName} nasce para ajudar as pessoas a tomarem melhores decisões financeiras. Compartilhamos guias sobre poupança, investimento, cartões e empréstimos para melhorar a saúde econômica pessoal.`,
    mission: { h: 'Nossa Missão', p: 'Aproximar as pessoas de bons hábitos financeiros por meio de informação útil, clara e prática, promovendo decisões econômicas mais seguras e conscientes.' },
    whatYouFind: { h: 'O Que Você Encontrará' },
    howWeWork: { h: 'Como Trabalhamos', items: [
      ['Pesquisa Especializada', 'conteúdos baseados em dados financeiros, análise de produtos e boas práticas comprovadas.'],
      ['Linguagem Acessível', 'textos claros e práticos, pensados para qualquer pessoa que deseje melhorar suas finanças.'],
      ['Foco Prático', 'cada artigo inclui passos e ferramentas que você pode aplicar para melhorar suas finanças hoje mesmo.'],
    ]},
    team: { h: 'A Equipe', p: 'Jornalistas financeiros, analistas e educadores colaboram para oferecer conteúdos claros, confiáveis e orientados a resultados.' },
    values: { h: 'Nossos Valores', items: [
      ['Transparência', 'conteúdo claro e fundamentado.'],
      ['Confiabilidade', 'informação verificada baseada em boas práticas financeiras.'],
      ['Acessibilidade', 'guias úteis para todos os níveis de conhecimento.'],
      ['Empoderamento', 'ajudamos as pessoas a tomar melhores decisões com seu dinheiro.'],
    ]},
    join: { h: 'Junte-se à Comunidade', p: 'Assine a newsletter, compartilhe suas dúvidas nos comentários e nos acompanhe no caminho para', link: 'uma melhor saúde financeira' },
  },
  en: {
    heading: 'About Us',
    intro: `${siteConfig.siteName} was created to help people make better financial decisions. We publish guides on saving, investing, credit cards and loans to improve personal financial health.`,
    mission: { h: 'Our Mission', p: 'Bring people closer to healthy financial habits through useful, clear and practical information, promoting safer and more conscious financial decisions.' },
    whatYouFind: { h: 'What You Will Find' },
    howWeWork: { h: 'How We Work', items: [
      ['Specialized Research', 'content based on financial data, product analysis and proven best practices.'],
      ['Accessible Language', 'clear, practical texts designed for anyone who wants to improve their finances.'],
      ['Practical Focus', 'each article includes steps and tools you can use to improve your finances today.'],
    ]},
    team: { h: 'The Team', p: 'Financial journalists, analysts and educators collaborate to provide clear, reliable and results-oriented content.' },
    values: { h: 'Our Values', items: [
      ['Transparency', 'clear, evidence-based content.'],
      ['Reliability', 'verified information based on good financial practice.'],
      ['Accessibility', 'useful guides for all knowledge levels.'],
      ['Empowerment', 'we help people make better money decisions.'],
    ]},
    join: { h: 'Join the Community', p: 'Subscribe to the newsletter, share your questions in the comments and join us on the path to', link: 'better financial health' },
  },
  fr: {
    heading: 'Qui Sommes-nous',
    intro: `${siteConfig.siteName} vise à aider les gens à prendre de meilleures décisions financières. Nous publions des guides sur l'épargne, l'investissement, les cartes de crédit et les prêts pour améliorer la santé financière personnelle.`,
    mission: { h: 'Notre Mission', p: "Rapprocher les gens des bonnes pratiques financières avec des informations utiles, claires et pratiques, en favorisant des décisions financières plus sûres et plus responsables." },
    whatYouFind: { h: 'Ce Que Vous Trouverez' },
    howWeWork: { h: 'Comment Nous Travaillons', items: [
      ['Recherche Spécialisée', "contenus basés sur des données financières, l'analyse de produits et des bonnes pratiques éprouvées."],
      ['Langage Accessible', "textes clairs et pratiques, conçus pour toute personne souhaitant améliorer ses finances."],
      ['Focus Pratique', "chaque article inclut des étapes et des outils que vous pouvez utiliser pour améliorer vos finances dès aujourd'hui."],
    ]},
    team: { h: "L'Équipe", p: "Journalistes financiers, analystes et éducateurs collaborent pour fournir des contenus clairs, fiables et orientés vers des résultats personnels." },
    values: { h: 'Nos Valeurs', items: [
      ['Transparence', 'contenu clair et fondé sur des preuves.'],
      ['Fiabilité', 'informations vérifiées reposant sur de bonnes pratiques financières.'],
      ['Accessibilité', 'guides utiles pour tous les niveaux de connaissance.'],
      ['Autonomisation', 'nous aidons les gens à prendre de meilleures décisions avec leur argent.'],
    ]},
    join: { h: 'Rejoignez la Communauté', p: "Abonnez-vous à la newsletter, partagez vos questions dans les commentaires et rejoignez-nous sur le chemin vers", link: 'une meilleure santé financière' },
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