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
      es: 'Editor & Especialista en Vida con Mascotas',
      pt: 'Editor & Especialista em Vida com Pets',
      en: 'Editor & Pet Lifestyle Specialist',
      fr: 'Éditeur & Spécialiste de la Vie avec les Animaux',
    },
    bio: {
      es: `Miguel Freitas, de 38 años, es apasionado por los animales y lidera la estrategia editorial de ${siteConfig.siteName}. Con años de experiencia creando contenidos sobre vida con mascotas, inspira a tutores a disfrutar cada momento junto a sus compañeros de cuatro patas.\n\nSu misión es mostrar que convivir con animales de estimación puede ser aún más rico y placentero con las orientaciones correctas. En ${siteConfig.siteName}, Miguel reúne consejos prácticos, destinos pet friendly y tendencias para quienes quieren lo mejor para sus mascotas.`,
      pt: `Miguel Freitas, de 38 anos, é apaixonado por animais e lidera a estratégia editorial do ${siteConfig.siteName}. Com anos de experiência criando conteúdos sobre vida com pets, ele inspira tutores a aproveitarem cada momento ao lado dos seus companheiros de quatro patas.\n\nSua missão é mostrar que conviver com animais de estimação pode ser ainda mais rico e prazeroso com as orientações certas. No ${siteConfig.siteName}, Miguel reúne dicas práticas, destinos pet friendly e tendências para quem quer o melhor para seus pets.`,
      en: `Miguel Freitas, 38, is passionate about animals and leads the editorial strategy at ${siteConfig.siteName}. With years of experience creating content about life with pets, he inspires owners to enjoy every moment alongside their four-legged companions.\n\nHis mission is to show that living with pets can be even richer and more enjoyable with the right guidance. At ${siteConfig.siteName}, Miguel gathers practical tips, pet-friendly destinations and trends for those who want the best for their animals.`,
      fr: `Miguel Freitas, 38 ans, est passionné par les animaux et dirige la stratégie éditoriale de ${siteConfig.siteName}. Fort de nombreuses années d'expérience dans la création de contenus sur la vie avec les animaux, il inspire les propriétaires à profiter de chaque instant avec leurs compagnons à quatre pattes.\n\nSa mission est de montrer que cohabiter avec des animaux de compagnie peut être encore plus enrichissant avec les bons conseils. Chez ${siteConfig.siteName}, Miguel rassemble des astuces pratiques, des destinations pet friendly et les dernières tendances pour ceux qui veulent le meilleur pour leurs animaux.`,
    },
    shortBio: {
      es: `Editor y especialista en vida con mascotas en ${siteConfig.siteName}. Apasionado por compartir consejos, destinos pet friendly y tendencias para tutores.`,
      pt: `Editor e especialista em vida com pets no ${siteConfig.siteName}. Apaixonado por compartilhar dicas, destinos pet friendly e tendências para tutores.`,
      en: `Editor and pet lifestyle specialist at ${siteConfig.siteName}. Passionate about sharing tips, pet-friendly destinations and trends for pet owners.`,
      fr: `Éditeur et spécialiste de la vie avec les animaux chez ${siteConfig.siteName}. Passionné par le partage de conseils, de destinations pet friendly et de tendances pour les propriétaires d'animaux.`,
    },
    social: {},
  },
  {
    name: 'Carlos Almeida',
    slug: 'carlos-almeida',
    image: '/imagens/avatar-author/carlos-almeida.svg',
    role: {
      es: 'Especialista en Razas y Comportamiento Animal',
      pt: 'Especialista em Raças e Comportamento Animal',
      en: 'Pet Breeds & Animal Behavior Specialist',
      fr: 'Spécialiste des Races et du Comportement Animal',
    },
    bio: {
      es: `Carlos Almeida, de 41 años, es uno de los principales columnistas de ${siteConfig.siteName}, donde comparte su profundo conocimiento sobre razas, perfiles de mascotas y comportamiento animal.\n\nSu enfoque se centra en ayudar a los tutores a entender mejor a sus animales, eligiendo la raza adecuada para su estilo de vida y fomentando vínculos más fuertes y afectuosos. Carlos cree que conocer a fondo a tu mascota es el primer paso para una convivencia feliz y armoniosa.`,
      pt: `Carlos Almeida, de 41 anos, é um dos principais colunistas do ${siteConfig.siteName}, onde compartilha seu profundo conhecimento sobre raças, perfis de pets e comportamento animal.\n\nSeu foco é ajudar tutores a entender melhor seus animais, escolhendo a raça ideal para seu estilo de vida e fortalecendo vínculos mais carinhosos. Carlos acredita que conhecer a fundo o seu pet é o primeiro passo para uma convivência feliz e harmoniosa.`,
      en: `Carlos Almeida, 41, is one of the main columnists at ${siteConfig.siteName}, where he shares his deep knowledge about breeds, pet profiles and animal behavior.\n\nHis focus is on helping owners better understand their animals, choosing the right breed for their lifestyle and fostering stronger, more loving bonds. Carlos believes that truly knowing your pet is the first step toward a happy and harmonious coexistence.`,
      fr: `Carlos Almeida, 41 ans, est l'un des principaux chroniqueurs de ${siteConfig.siteName}, où il partage ses connaissances approfondies sur les races, les profils d'animaux et le comportement animal.\n\nSon objectif est d'aider les propriétaires à mieux comprendre leurs animaux, à choisir la race adaptée à leur mode de vie et à renforcer des liens plus affectueux. Carlos croit que bien connaître son animal est la première étape vers une cohabitation heureuse et harmonieuse.`,
    },
    shortBio: {
      es: `Especialista en razas y comportamiento animal en ${siteConfig.siteName}. Ayuda a tutores a elegir la mascota ideal y fortalecer el vínculo con sus animales.`,
      pt: `Especialista em raças e comportamento animal no ${siteConfig.siteName}. Ajuda tutores a escolher o pet ideal e fortalecer o vínculo com seus animais.`,
      en: `Pet breeds and animal behavior specialist at ${siteConfig.siteName}. Helps owners choose the ideal pet and strengthen their bond with animals.`,
      fr: `Spécialiste des races et du comportement animal chez ${siteConfig.siteName}. Aide les propriétaires à choisir l'animal idéal et à renforcer leur lien avec leurs compagnons.`,
    },
    social: {},
  },
  {
    name: 'Lucas Moraes',
    slug: 'lucas-moraes',
    image: '/imagens/avatar-author/lucas-moraes.svg',
    role: {
      es: 'Experto en Actividades y Diversión con Mascotas',
      pt: 'Especialista em Atividades e Diversão com Pets',
      en: 'Pet Activities & Fun Expert',
      fr: 'Expert en Activités et Amusement avec les Animaux',
    },
    bio: {
      es: `Lucas Moraes, de 34 años, es redactor en ${siteConfig.siteName}, especializado en actividades, juegos y experiencias divertidas para mascotas y sus tutores.\n\nCon una mirada siempre atenta a las novedades del mundo pet, Lucas explora parques, eventos y destinos pet friendly, trayendo sugerencias para quienes quieren ampliar las aventuras junto a sus animales. Su misión es inspirar a más personas a crear rutinas activas, estimulantes y llenas de alegría con sus mascotas.`,
      pt: `Lucas Moraes, de 34 anos, é redator no ${siteConfig.siteName}, especializado em atividades, brincadeiras e experiências divertidas para pets e seus tutores.\n\nSempre atento às novidades do mundo pet, Lucas explora parques, eventos e destinos pet friendly, trazendo sugestões para quem quer ampliar as aventuras ao lado dos animais. Sua missão é inspirar mais pessoas a criarem rotinas ativas, estimulantes e cheias de alegria com seus pets.`,
      en: `Lucas Moraes, 34, is a writer at ${siteConfig.siteName}, specialized in activities, games and fun experiences for pets and their owners.\n\nAlways keeping an eye on the latest in the pet world, Lucas explores parks, events and pet-friendly destinations, bringing suggestions for those who want to expand adventures with their animals. His mission is to inspire more people to create active, stimulating and joyful routines with their pets.`,
      fr: `Lucas Moraes, 34 ans, est rédacteur chez ${siteConfig.siteName}, spécialisé dans les activités, les jeux et les expériences amusantes pour les animaux et leurs propriétaires.\n\nToujours à l'affût des nouveautés du monde animal, Lucas explore parcs, événements et destinations pet friendly, proposant des suggestions pour ceux qui souhaitent multiplier les aventures avec leurs animaux. Sa mission est d'inspirer davantage de personnes à créer des routines actives, stimulantes et joyeuses avec leurs compagnons.`,
    },
    shortBio: {
      es: `Experto en actividades y diversión con mascotas en ${siteConfig.siteName}. Inspira a tutores a crear rutinas activas y aventureras junto a sus animales.`,
      pt: `Especialista em atividades e diversão com pets no ${siteConfig.siteName}. Inspira tutores a criarem rotinas ativas e aventureiras com seus animais.`,
      en: `Pet activities and fun expert at ${siteConfig.siteName}. Inspires owners to create active and adventurous routines with their animals.`,
      fr: `Expert en activités et amusement avec les animaux chez ${siteConfig.siteName}. Inspire les propriétaires à créer des routines actives et aventureuses avec leurs compagnons.`,
    },
    social: {},
  },
  {
    name: 'Felipe Pires',
    slug: 'felipe-pires',
    image: '/imagens/avatar-author/felipe-pires.svg',
    role: {
      es: 'Especialista en Curiosidades y Tendencias Pet',
      pt: 'Especialista em Curiosidades e Tendências Pet',
      en: 'Pet Curiosities & Trends Specialist',
      fr: 'Spécialiste des Curiosités et Tendances Animaux',
    },
    bio: {
      es: `Felipe Pires, de 37 años, es columnista en ${siteConfig.siteName}, especializado en curiosidades fascinantes y tendencias del universo de los animales de estimación.\n\nCon una mirada curiosa y apasionada, Felipe investiga comportamientos sorprendentes, hechos poco conocidos y las últimas novedades del mundo pet para traer contenidos que encantan y sorprenden a los tutores. Su objetivo es acercar a las personas a sus mascotas con más información, empatía y afecto.`,
      pt: `Felipe Pires, de 37 anos, é colunista no ${siteConfig.siteName}, especializado em curiosidades fascinantes e tendências do universo dos animais de estimação.\n\nCom um olhar curioso e apaixonado, Felipe pesquisa comportamentos surpreendentes, fatos pouco conhecidos e as últimas novidades do mundo pet para trazer conteúdos que encantam e surpreendem os tutores. Seu objetivo é aproximar as pessoas dos seus animais com mais informação, empatia e carinho.`,
      en: `Felipe Pires, 37, is a columnist at ${siteConfig.siteName}, specialized in fascinating curiosities and trends from the pet world.\n\nWith a curious and passionate eye, Felipe researches surprising behaviors, little-known facts and the latest news from the pet universe to bring content that delights and amazes pet owners. His goal is to bring people closer to their animals with more information, empathy and affection.`,
      fr: `Felipe Pires, 37 ans, est chroniqueur chez ${siteConfig.siteName}, spécialisé dans les curiosités fascinantes et les tendances du monde des animaux de compagnie.\n\nAvec un regard curieux et passionné, Felipe explore des comportements surprenants, des faits peu connus et les dernières actualités du monde animal pour proposer des contenus qui enchantent et étonnent les propriétaires. Son objectif est de rapprocher les personnes de leurs animaux grâce à plus d'informations, d'empathie et d'affection.`,
    },
    shortBio: {
      es: `Especialista en curiosidades y tendencias pet en ${siteConfig.siteName}. Apasionado por acercar a los tutores a sus mascotas con información sorprendente y actual.`,
      pt: `Especialista em curiosidades e tendências pet no ${siteConfig.siteName}. Apaixonado por aproximar tutores dos seus animais com informações surpreendentes e atuais.`,
      en: `Pet curiosities and trends specialist at ${siteConfig.siteName}. Passionate about bringing pet owners closer to their animals with surprising and up-to-date information.`,
      fr: `Spécialiste des curiosités et tendances animaux chez ${siteConfig.siteName}. Passionné pour rapprocher les propriétaires de leurs animaux grâce à des informations surprenantes et actuelles.`,
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
