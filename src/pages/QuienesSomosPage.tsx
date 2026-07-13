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
  'estilo-de-vida-pet': {
    es: 'convivencia, locales pet friendly, tendencias y experiencias para una rutina más agradable con tu mascota.',
    pt: 'convivência, locais pet friendly, tendências e experiências para uma rotina mais agradável com seu animal.',
    en: 'coexistence, pet-friendly places, trends and experiences for a more enjoyable routine with your pet.',
    fr: 'cohabitation, endroits pet friendly, tendances et expériences pour une routine plus agréable avec votre animal.',
  },
  'atividades-e-diversao-com-pets': {
    es: 'juegos, actividades al aire libre, eventos y aventuras para disfrutar junto a tu mascota.',
    pt: 'brincadeiras, atividades ao ar livre, eventos e aventuras para aproveitar com seu pet.',
    en: 'games, outdoor activities, events and adventures to enjoy with your pet.',
    fr: 'jeux, activités en plein air, événements et aventures à partager avec votre animal.',
  },
  'racas-e-perfis-de-pets': {
    es: 'perfiles de razas, características, temperamento y cuidados específicos para cada tipo de mascota.',
    pt: 'perfis de raças, características, temperamento e cuidados específicos para cada tipo de pet.',
    en: 'breed profiles, characteristics, temperament and specific care for each type of pet.',
    fr: 'profils de races, caractéristiques, tempérament et soins spécifiques pour chaque type d\'animal.',
  },
  'curiosidades-sobre-animais': {
    es: 'hechos sorprendentes, comportamientos curiosos y datos poco conocidos sobre animales de estimación.',
    pt: 'fatos surpreendentes, comportamentos curiosos e dados pouco conhecidos sobre animais de estimação.',
    en: 'surprising facts, curious behaviors and little-known data about pets.',
    fr: 'faits surprenants, comportements curieux et données méconnues sur les animaux de compagnie.',
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
    intro: `${siteConfig.siteName} nace para inspirar a tutores a vivir momentos más ricos y felices junto a sus mascotas. Compartimos contenidos sobre convivencia, locales pet friendly, razas, actividades y curiosidades del mundo animal.`,
    mission: { h: 'Nuestra Misión', p: 'Acercar a las personas a sus animales de estimación con información útil, entretenida y confiable, promoviendo una convivencia más consciente, activa y afectuosa.' },
    whatYouFind: { h: 'Qué Encontrarás' },
    howWeWork: { h: 'Cómo Trabajamos', items: [
      ['Investigación Especializada', 'contenidos basados en el comportamiento animal, tendencias del mundo pet y experiencias reales de tutores.'],
      ['Lenguaje Cercano', 'textos accesibles, sin tecnicismos, pensados para cualquier tutor independientemente de su experiencia.'],
      ['Enfoque Práctico', 'cada artículo termina con consejos concretos que puedes aplicar con tu mascota hoy mismo.'],
    ]},
    team: { h: 'El Equipo', p: 'Especialistas en comportamiento animal, escritores apasionados por los pets y expertos en tendencias del universo animal colaboran para ofrecerte contenidos diversos, confiables y llenos de amor por los animales.' },
    values: { h: 'Nuestros Valores', items: [
      ['Amor Animal', 'todo lo que publicamos parte de un genuino cariño por los animales.'],
      ['Confiabilidad', 'informaciones verificadas y basadas en fuentes especializadas.'],
      ['Inclusión', 'contenido para tutores de todos los tipos de mascotas y niveles de experiencia.'],
      ['Bienestar', 'promovemos el cuidado responsable y la calidad de vida de los animales.'],
    ]},
    join: { h: 'Únete a la Comunidad', p: 'Suscríbete al boletín, comparte tus experiencias en los comentarios y acompáñanos en el camino hacia una', link: 'vida más feliz junto a tu mascota' },
  },
  pt: {
    heading: 'Sobre Nós',
    intro: `${siteConfig.siteName} nasce para inspirar tutores a viverem momentos mais ricos e felizes ao lado dos seus pets. Compartilhamos conteúdos sobre convivência, locais pet friendly, raças, atividades e curiosidades do mundo animal.`,
    mission: { h: 'Nossa Missão', p: 'Aproximar pessoas dos seus animais de estimação com informações úteis, divertidas e confiáveis, promovendo uma convivência mais consciente, ativa e carinhosa.' },
    whatYouFind: { h: 'O Que Você Encontrará' },
    howWeWork: { h: 'Como Trabalhamos', items: [
      ['Pesquisa Especializada', 'conteúdos baseados em comportamento animal, tendências do mundo pet e experiências reais de tutores.'],
      ['Linguagem Acessível', 'textos sem tecnicismos, pensados para qualquer tutor independente do seu nível de experiência.'],
      ['Foco Prático', 'cada artigo termina com dicas concretas que você pode aplicar com seu pet hoje mesmo.'],
    ]},
    team: { h: 'A Equipe', p: 'Especialistas em comportamento animal, escritores apaixonados por pets e especialistas em tendências do universo animal colaboram para oferecer conteúdos diversos, confiáveis e cheios de amor pelos animais.' },
    values: { h: 'Nossos Valores', items: [
      ['Amor Animal', 'tudo que publicamos parte de um genuíno carinho pelos animais.'],
      ['Confiabilidade', 'informações verificadas e baseadas em fontes especializadas.'],
      ['Inclusão', 'conteúdo para tutores de todos os tipos de pets e níveis de experiência.'],
      ['Bem-estar', 'promovemos o cuidado responsável e a qualidade de vida dos animais.'],
    ]},
    join: { h: 'Junte-se à Comunidade', p: 'Assine o boletim, compartilhe suas experiências nos comentários e nos acompanhe no caminho para uma', link: 'vida mais feliz ao lado do seu pet' },
  },
  en: {
    heading: 'About Us',
    intro: `${siteConfig.siteName} was created to inspire pet owners to live richer and happier moments alongside their animals. We share content about coexistence, pet-friendly places, breeds, activities and animal world curiosities.`,
    mission: { h: 'Our Mission', p: 'To bring people closer to their pets with useful, fun and reliable information, promoting more conscious, active and loving coexistence.' },
    whatYouFind: { h: 'What You Will Find' },
    howWeWork: { h: 'How We Work', items: [
      ['Specialized Research', 'content based on animal behavior, pet world trends and real experiences from pet owners.'],
      ['Accessible Language', 'texts without jargon, designed for any owner regardless of their experience level.'],
      ['Practical Focus', 'each article ends with concrete tips you can apply with your pet today.'],
    ]},
    team: { h: 'The Team', p: 'Animal behavior specialists, passionate pet writers and animal world trend experts collaborate to offer diverse, reliable and animal-loving content.' },
    values: { h: 'Our Values', items: [
      ['Animal Love', 'everything we publish comes from a genuine affection for animals.'],
      ['Reliability', 'verified information based on specialized sources.'],
      ['Inclusion', 'content for owners of all types of pets and experience levels.'],
      ['Wellbeing', 'we promote responsible care and quality of life for animals.'],
    ]},
    join: { h: 'Join the Community', p: 'Subscribe to the newsletter, share your experiences in the comments and join us on the path to a', link: 'happier life alongside your pet' },
  },
  fr: {
    heading: 'Qui Sommes-nous',
    intro: `${siteConfig.siteName} est né pour inspirer les propriétaires à vivre des moments plus riches et plus heureux aux côtés de leurs animaux. Nous partageons des contenus sur la cohabitation, les endroits pet friendly, les races, les activités et les curiosités du monde animal.`,
    mission: { h: 'Notre Mission', p: "Rapprocher les personnes de leurs animaux de compagnie grâce à des informations utiles, divertissantes et fiables, en favorisant une cohabitation plus consciente, active et affectueuse." },
    whatYouFind: { h: 'Ce Que Vous Trouverez' },
    howWeWork: { h: 'Comment Nous Travaillons', items: [
      ['Recherche Spécialisée', "contenus basés sur le comportement animal, les tendances du monde pet et les expériences réelles des propriétaires."],
      ['Langage Accessible', "textes sans jargon, conçus pour tout propriétaire quel que soit son niveau d'expérience."],
      ['Focus Pratique', "chaque article se termine par des conseils concrets que vous pouvez appliquer avec votre animal dès aujourd'hui."],
    ]},
    team: { h: "L'Équipe", p: "Des spécialistes du comportement animal, des écrivains passionnés par les animaux et des experts en tendances du monde animal collaborent pour offrir des contenus diversifiés, fiables et pleins d'amour pour les animaux." },
    values: { h: 'Nos Valeurs', items: [
      ['Amour Animal', 'tout ce que nous publions part d\'un véritable amour pour les animaux.'],
      ['Fiabilité', 'informations vérifiées et basées sur des sources spécialisées.'],
      ['Inclusion', 'contenu pour les propriétaires de tous types d\'animaux et niveaux d\'expérience.'],
      ['Bien-être', 'nous promouvons les soins responsables et la qualité de vie des animaux.'],
    ]},
    join: { h: 'Rejoignez la Communauté', p: "Abonnez-vous à la newsletter, partagez vos expériences dans les commentaires et accompagnez-nous sur le chemin d'une", link: 'vie plus heureuse aux côtés de votre animal' },
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