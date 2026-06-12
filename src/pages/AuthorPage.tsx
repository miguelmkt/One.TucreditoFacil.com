import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAuthorBySlug } from '../data/authors';
import { getPostsByLang } from '../lib/posts';
import { brandColors } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';
import { useSEO } from '../hooks/useSEO';
import { siteConfig } from '../config/siteConfig';
import ArticleCard from '../components/ArticleCard';
import type { Lang } from '../i18n/translations';

function lp(lang: string, path: string) {
  return lang === 'es' ? path : `/${lang}${path}`;
}

const pageLabels: Record<string, { articlesBy: string; noArticles: string; backHome: string; loadMore: string; next: string }> = {
  es: { articlesBy: 'Posts de', noArticles: 'No hay posts publicados aún.', backHome: '← Volver al inicio', loadMore: 'Cargar más', next: 'Siguiente ›' },
  pt: { articlesBy: 'Posts de', noArticles: 'Nenhum post publicado ainda.', backHome: '← Voltar ao início', loadMore: 'Carregar mais', next: 'Próximo ›' },
  en: { articlesBy: 'Posts by', noArticles: 'No posts published yet.', backHome: '← Back to home', loadMore: 'Load more', next: 'Next ›' },
  fr: { articlesBy: 'Posts de', noArticles: 'Aucun post publié pour le moment.', backHome: '← Retour à l\'accueil', loadMore: 'Charger plus', next: 'Suivant ›' },
};

export default function AuthorPage() {
  const { authorSlug } = useParams<{ authorSlug: string }>();
  const { lang } = useLang();

  const author = getAuthorBySlug(authorSlug ?? '');

  const hreflangAlternates: { lang: Lang; path: string }[] = author
    ? [
        { lang: 'es' as Lang, path: `/a/${author.slug}/` },
        { lang: 'pt' as Lang, path: `/pt/a/${author.slug}/` },
        { lang: 'en' as Lang, path: `/en/a/${author.slug}/` },
        { lang: 'fr' as Lang, path: `/fr/a/${author.slug}/` },
      ]
    : [];

  useSEO({
    title: author ? author.name : undefined,
    description: author ? author.shortBio[lang] : undefined,
    canonicalPath: author ? lp(lang, `/a/${author.slug}/`) : undefined,
    lang,
    hreflangAlternates,
  });

  if (!author) {
    return <Navigate to="/404" replace />;
  }

  const labels = pageLabels[lang] ?? pageLabels.es;

  const authorPosts = getPostsByLang(lang)
    .filter((p) => p.author === author.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(authorPosts.length / PAGE_SIZE));
  const visiblePosts = authorPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${siteConfig.siteUrl}${lp(lang, `/a/${author.slug}/`)}`,
    jobTitle: 'Financial Content Specialist',
    image: `${siteConfig.siteUrl}${author.image}`,
    sameAs: Object.values(author.social),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="min-h-screen py-10 px-4" style={{ backgroundColor: brandColors.bgGray }}>
        <div className="max-w-5xl mx-auto">
          {/* Centered author card at top */}
            <div className="bg-white rounded-sm px-5 py-5 mb-6 flex flex-col items-center text-center max-w-sm mx-auto" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="rounded-full p-0.5 mb-3" style={{ border: '0.5px solid #111', background: '#fff' }}>
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img src={author.image} alt={author.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{author.name}</h1>
              <p className="sr-only">{author.role[lang]}</p>
              <p className="text-gray-600 max-w-sm">{author.bio[lang].split('\n').filter(Boolean)[0]}</p>
              <div className="flex items-center gap-4 mt-3">
              <a href={lp(lang, `/a/${author.slug}/`)} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'var(--brand-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={lp(lang, `/a/${author.slug}/`)} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--brand-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href={lp(lang, `/a/${author.slug}/`)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--brand-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href={lp(lang, `/a/${author.slug}/`)} target="_blank" rel="noopener noreferrer" aria-label="Twitter" style={{ color: 'var(--brand-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Posts list */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 pb-4 border-b border-gray-200">{labels.articlesBy} {author.name}</h2>
          {authorPosts.length === 0 ? (
            <p className="text-gray-500 text-center">{labels.noArticles}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visiblePosts.map((post) => (
                  <ArticleCard key={post.slug} article={post} lang={lang} />
                ))}
              </div>

              {authorPosts.length > 12 && totalPages > 1 && (
                <div className="mt-6 text-center flex items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-md border ${pNum === page ? 'bg-secondary text-white' : 'bg-white text-gray-700'}`}
                      >
                        {pNum}
                      </button>
                    ))}
                  </div>
                  <div>
                    <button
                      onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
                      disabled={page >= totalPages}
                      className="ml-3 px-3 py-2 text-sm text-gray-700 hover:underline disabled:opacity-50"
                    >
                      {labels.next}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-6 text-center">
            <a href={lang === 'es' ? '/' : `/${lang}`} className="font-medium text-sm hover:opacity-80 text-secondary">{labels.backHome}</a>
          </div>
        </div>
      </main>
    </>
  );
}
