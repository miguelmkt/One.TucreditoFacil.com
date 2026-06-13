/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  CATEGORIAS DO SITE — edite em src/config/categories.json   ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Campos disponíveis por categoria:
 *   name        → Nome exibido no site (também define as 2 linhas do menu)
 *   slug        → URL da categoria:  /c/<slug>
 *   active      → true = visível | false = oculta do menu, home e URL retorna 404
 *   imageStyle  → Palavras-chave para Stable Diffusion gerar a imagem certa
 */
import rawCategories from './categories.json';

const FALLBACK_SITE_URL = 'https://zynovu.com';

function normalizeSiteUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function resolveSiteUrl(): string {
  const envSiteUrl = (import.meta as ImportMeta & {
    env?: { VITE_SITE_URL?: string };
  }).env?.VITE_SITE_URL;

  if (envSiteUrl) {
    return normalizeSiteUrl(envSiteUrl);
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeSiteUrl(window.location.origin);
  }

  return FALLBACK_SITE_URL;
}

export interface SiteCategory {
  name:        string;
  slug:        string;
  slugs:       {
    es: string;
    pt: string;
    en: string;
    fr: string;
  };
  active:      boolean;
  imageStyle:  string;
}

/** Todas as categorias cadastradas (incluindo inativas). */
export const allCategories: SiteCategory[] = rawCategories as SiteCategory[];

/** Apenas as categorias ativas — usadas no menu, home, scripts e SEO. */
export const siteCategories: SiteCategory[] = allCategories.filter((c) => c.active);

/**
 * Divide o nome em 2 linhas para o menu desktop.
 * Corta no último espaço: "Tarjetas de Crédito" → ["Tarjetas de", "Crédito"]
 */
export function categoryNavLines(name: string): [string, string] {
  const i = name.lastIndexOf(' ');
  return i === -1 ? [name, ''] : [name.slice(0, i), name.slice(i + 1)];
}

// ── Cores globais do site ────────────────────────────────────────────────────
// Altere apenas aqui para mudar as cores em todo o site
export const brandColors = {
  primary: '#000000',           // cor principal (títulos footer, hover categorias header)
  navBg: '#2C0C4B',             // fundo da header e do footer
  navText: '#ffffff',           // cor do texto das categorias no header
  footerText: '#ffffff',        // cor do texto dos títulos do footer (Sobre Nosotros, Información Legal)
  footerLink: '#80807C',        // cor fixa dos links do footer (sem hover)
  headerNavHover: '#84C002',    // cor do hover das categorias na header
  bgGray: '#f5f5f5',            // fundo cinza das páginas (Quiénes somos)
  secondary: '#84C002',         // cor secundária (botões, links, destaques, hover categorias)
} as const;

export const siteConfig = {
  siteName: 'zynovu.com',
  siteUrl: resolveSiteUrl(),
  niche: 'finanzas personales',
  language: 'es',
  description:
    'Consejos prácticos de finanzas personales para mejorar tu vida económica, ahorrar más y tomar mejores decisiones con tu dinero.',
  ctaText: 'Solicitar préstamo ahora',
  ctaUrl: `${resolveSiteUrl()}/solicitar-prestamo`,
  twitterHandle: '@zynovu',
  contactEmail: 'hola@zynovu.com',

  // Imagens — altere aqui para trocar logo e favicon em todo o site renomeie para o nome da imagem que for adicionada na pasta public/assets
  logo: '/imagens/img-principal/logo.png',
  favicon: '/imagens/img-principal/favicon02.png',
} as const;

// Autores do site — adicione ou remova nomes aqui
// A foto deve estar em imagens/avatar-author/<nome-em-kebab-case>.svg (ou .jpg/.png)
export const siteAuthors: string[] = [
  'Miguel Freitas',
  'Carlos Almeida',
  'Lucas Moraes',
  'Felipe Pires',
];


