/**
 * Hook useSEO — atualiza <title>, <meta name="description">, canonical e hreflang dinamicamente.
 *
 * Uso:
 *   useSEO({ title: post.title, description: post.excerpt, canonicalPath: `/pt/p/${post.slug}`, lang: 'pt',
 *            hreflangAlternates: [{ lang: 'en', path: '/en/p/slug-en' }, ...] })
 */

import { useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';
import { SUPPORTED_LANGS, type Lang } from '../i18n/translations';

interface HreflangAlternate {
  lang: Lang | 'x-default';
  path: string;
}

interface SEOMeta {
  /** Título da página — será sufixado com o nome do site. */
  title?: string;
  /** Texto para <meta name="description">. */
  description?: string;
  /** Caminho relativo (ex: /pt/p/meu-artigo) usado para <link rel="canonical">. */
  canonicalPath?: string;
  /** Idioma da página para <html lang="..."> e <meta property="og:locale">. */
  lang?: Lang;
  /** Versões alternativas para hreflang. Inclui automaticamente x-default se não passado. */
  hreflangAlternates?: HreflangAlternate[];
}

const HREFLANG_ATTR = 'data-i18n-hreflang';

export function useSEO({ title, description, canonicalPath, lang, hreflangAlternates }: SEOMeta) {
  useEffect(() => {
    // --- Title ---
    document.title = title
      ? `${title} | ${siteConfig.siteName}`
      : siteConfig.siteName;

    // --- html[lang] ---
    if (lang) document.documentElement.setAttribute('lang', lang);

    // --- Meta description ---
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description ?? siteConfig.description);

    // --- Canonical URL ---
    if (canonicalPath) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `${siteConfig.siteUrl}${canonicalPath}`);
    }

    // --- hreflang alternates ---
    // Remove previous hreflang links injected by this hook
    document
      .querySelectorAll<HTMLLinkElement>(`link[rel="alternate"][${HREFLANG_ATTR}]`)
      .forEach((el) => el.remove());

    if (hreflangAlternates && hreflangAlternates.length > 0) {
      const alternates = [...hreflangAlternates];
      // Add x-default pointing to the first supported lang if not already present
      if (!alternates.find((a) => a.lang === 'x-default')) {
        alternates.push({ lang: 'x-default', path: `/${SUPPORTED_LANGS[0]}` });
      }
      alternates.forEach(({ lang: altLang, path }) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', altLang);
        link.setAttribute('href', `${siteConfig.siteUrl}${path}`);
        link.setAttribute(HREFLANG_ATTR, 'true');
        document.head.appendChild(link);
      });
    }

    // Restaura ao desmontar
    return () => {
      document.title = siteConfig.siteName;
      const metaDescEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (metaDescEl) metaDescEl.setAttribute('content', siteConfig.description);
      document
        .querySelectorAll<HTMLLinkElement>(`link[rel="alternate"][${HREFLANG_ATTR}]`)
        .forEach((el) => el.remove());
    };
  }, [title, description, canonicalPath, lang, hreflangAlternates]);
}

