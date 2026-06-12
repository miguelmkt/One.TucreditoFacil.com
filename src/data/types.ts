export interface InfoBlock {
  icon: string;
  title: string;
  description: string;
}

export interface ContentItem {
  title: string;
  description: string;
}

export interface HowToApply {
  intro: string;
  items: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Article {
  /** Identificador único. Se omitido no JSON, é derivado do slug automaticamente. */
  id?: string;
  title: string;
  slug: string;
  /** ISO 639-1 language code: 'pt' | 'en' | 'fr' | 'es'. Defaults to 'es' for legacy posts. */
  lang?: string;
  /** Links same article across languages (e.g. "save-electricity-tips"). */
  translationKey?: string;
  date: string;
  time?: string;
  image: string;
  excerpt: string;
  content: string;
  category: string;
  niche?: string;
  /** Marca artigos que pertencem ao canal "money posts" */
  isMoneyPost?: boolean;
  author?: string;
  readingTime?: number;
  infoBlocks?: InfoBlock[];
  benefits?: ContentItem[];
  whoShouldApply?: string[];
  pros?: ContentItem[];
  cons?: ContentItem[];
  howToApply?: HowToApply;
  faqs?: FAQ[];
  finalConsiderations?: string;
}
