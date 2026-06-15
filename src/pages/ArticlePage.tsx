import { useLocation, useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { reloadAdsSafely, attachAdSenseSpaListeners } from '../lib/adsenseSpa';
import { getPostBySlug, getPostBySlugAndLang, getPostsByLang, getArticleTranslations } from '../data/posts';
import { brandColors, siteCategories } from '../config/siteConfig';
import { useSEO } from '../hooks/useSEO';
import ArticleCard from '../components/ArticleCard';
import AuthorBox from '../components/AuthorBox';
import AdUnit from '../components/AdUnit';
import { useLang } from '../i18n/LangContext';
import { SUPPORTED_LANGS, type Lang } from '../i18n/translations';
import { authorNameToSlug } from '../data/authors';
import { getCategoryI18n } from '../i18n/categories';

declare global {
  interface Window {
    adsbygoogle: unknown[];
    initAdsForSPA?: () => void;
  }
}

declare global {
  interface Window { adsbygoogle: unknown[] }
}

function lp(lang: string, path: string) {
  return lang === 'es' ? path : `/${lang}${path}`;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLang();
  const location = useLocation();

  // Força renderização dos blocos Join Ads sempre que a página monta ou a rota muda
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.initAdsForSPA === 'function') {
      window.initAdsForSPA();
    }
    // Fallback: dispara evento para MutationObserver
    setTimeout(() => {
      const evt = document.createEvent('Event');
      evt.initEvent('spa-navigate', true, true);
      window.dispatchEvent(evt);
    }, 100);
  }, [location]);

  

  const article =
    getPostBySlugAndLang(slug ?? '', lang) ??
    getPostBySlug(slug ?? '');

  const translations = article?.translationKey
    ? getArticleTranslations(article.translationKey)
    : [];

  const hreflangAlternates = translations.length > 0
    ? translations
        .filter((p) => (SUPPORTED_LANGS as string[]).includes(p.lang as string))
        .map((p) => ({ lang: p.lang as Lang, path: `/${p.lang}/p/${p.slug}` }))
    : SUPPORTED_LANGS.map((l) => ({ lang: l, path: `/${l}/p/${slug}` }));

  function toCatSlug(raw: string): string {
    const base = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    const STOP = /-(de|del|la|el|y|los|las|des|du|le|les|of|the)-/gi;
    return base.replace(STOP, '-').replace(STOP, '-')
      .replace(/^(de|del|la|el|y|los|las|des|du|le|les|of|the)-/i, '')
      .replace(/-(de|del|la|el|y|los|las|des|du|le|les|of|the)$/i, '');
  }
  
  function getCatSlugForLang(baseSlug: string, l: string): string {
    const cat = siteCategories.find(c => c.slug === baseSlug);
    if (!cat) return baseSlug;
    return (cat.slugs as any)[l] || cat.slug;
  }
  
  const categorySlug = article?.category ? toCatSlug(article.category) : '';
  const categorySlugForLang = getCatSlugForLang(categorySlug, lang);

  const categoryDisplay = categorySlug
    ? getCategoryI18n(categorySlug, lang).name || article?.category || ''
    : (article?.category || '');

  const authorSlug = article?.author ? authorNameToSlug(article.author) : '';

  useSEO({
    title: article?.title,
    description: article?.excerpt,
    canonicalPath: article ? lp(lang, `/p/${article.slug}`) : undefined,
    lang,
    hreflangAlternates,
  });

  // Inicializa listeners SPA-safe para AdSense
  useEffect(() => {
    attachAdSenseSpaListeners();
    reloadAdsSafely();
    // Opcional: pode passar debounceMs/minAdHeight/skeleton
  }, []);

  

  

  

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  const formattedDate = new Date(article.date + 'T00:00:00').toLocaleDateString(
    lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : 'es-ES',
    { day: '2-digit', month: '2-digit', year: 'numeric' },
  );

  const latestPosts = getPostsByLang(lang)
    .filter((p) => p.slug !== slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);


 {/* Adex below topo */}
  return (

    <>
          <div className="w-screen mt-0 pt-1" style={{ backgroundColor: brandColors.bgGray }}>
            <div className="w-full sm:max-w-[640px] sm:mx-auto mt-0 pt-0">
              <AdUnit
                adId="content1"
                scriptSrc="https://script.joinads.me/myad24718.js"
                minHeight={10}
                className="w-full overflow-hidden pb-0"
                label={t('advertisement')}
              />
            </div>
          </div>
      

      <main className="w-full max-w-6xl mx-auto px-0 sm:px-6 py-0 sm:pt-4 sm:pb-0 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full m-0 p-0">

          <article
            className="w-full post-wrapper bg-white rounded-sm shadow-none border-none m-0 max-w-full overflow-x-hidden p-[18px] sm:p-[34px] text-[#333] font-sans text-[18px] pt-0 mt-0"
          >

            {/* Se for link, use a classe .article-title-link */}






            <h1 className="post-title leading-tight text-[36px] text-[#0D1A17] font-sans font-bold mb-2 mt-2 sm:mt-0">
              {article.title}
            </h1>

            <p className="text-sm text-gray-500 mb-2 flex items-center gap-2 flex-wrap">
              <time dateTime={article.date}>{formattedDate}</time>
              <span aria-hidden="true">•</span>
              {article.author && (
                <>
                  <a href={lp(lang, `/a/${authorSlug}/`)} className="article-meta-link font-medium text-gray-900">
                    {article.author}
                  </a>
                  <span aria-hidden="true">•</span>
                </>
              )}
              <a href={lp(lang, `/c/${categorySlugForLang}`)} className="article-meta-link font-medium text-gray-900">
                {categoryDisplay}
              </a>
            </p>

              <div className="bg-white overflow-hidden mb-0 pb-0">
              <img
                src='https://placehold.co/400x300/e8f0fe/6366f1?text=FF'
                alt={article.title}
                className="w-full object-cover max-w-full aspect-[2/1] block rounded-md border-4 border-white box-border"
              />
            </div>

             {/* Adex below the image */}
             
            <div className="-mx-[18px] sm:mx-0 w-[calc(100%+36px)] sm:w-full my-0 bg-white">
              <AdUnit
                adId="content2"
                scriptSrc="https://script.joinads.me/myad24718.js"
                minHeight={10}
                className="w-full overflow-hidden bg-white pb-0"
                label={t('advertisement')}
              />
            </div>

            {(() => {
              const marker = '<!-- AD4 -->';
              const idx = article.content.indexOf(marker);
              if (idx === -1) {
                return (
                  <div
                    className="post-content mt-1"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                );
              }
              const before = article.content.slice(0, idx);
              const after = article.content.slice(idx + marker.length);
              return (
                <>
                  <div
                    className="post-content mt-1"
                    dangerouslySetInnerHTML={{ __html: before }}
                  />
                  <div className="w-full my-6">
                    <div className="flex justify-center w-full">
                      <AdUnit
                        adId="content3"
                        scriptSrc="https://script.joinads.me/myad24718.js"
                        minHeight={10}
                        className="w-full max-w-[336px] overflow-hidden bg-white pb-0"
                        label={t('advertisement')}
                      />
                    </div>
                  </div>
                  <div
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: after }}
                  />
                </>
              );
            })()}

            {article.author && (
              <AuthorBox authorName={article.author} lang={lang} />
            )}

            

            <div className="mt-10">
              <a href={lang === 'es' ? '/' : `/${lang}`} className="font-medium text-sm hover:opacity-80 text-secondary">
                {t('backHome')}
              </a>
            </div>
          </article>

          {latestPosts.length > 0 && (
            <aside className="w-full lg:w-[380px] shrink-0 mt-10 lg:mt-0 self-start">
              <div
                className="bg-white rounded-sm latest-articles"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', padding: '18px' }}
              >
                <h3
                  className="mb-2"
                  style={{ fontSize: '21px', color: '#333333', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600 }}
                >
                  {t('latestPosts')}
                </h3>
                {latestPosts.map((p) => {
                  const df = new Date(p.date + 'T00:00:00').toLocaleDateString(
                    lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : 'es-ES',
                    { day: '2-digit', month: '2-digit', year: 'numeric' },
                  );
                  return (
                    <div
                      key={p.slug}
                      className="flex items-center gap-4 rounded-sm border border-gray-200 mt-3 article" style={{ padding: '15px' }}
                    >
                      <div className="flex-1 min-w-0">
                        <a
                          href={lp(lang, `/p/${p.slug}`)}
                          className="line-clamp-3 block leading-snug hover:underline"
                          style={{ fontSize: '18px', color: '#333333', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600, marginBottom: '5px' }}
                        >
                          {p.title}
                        </a>
                        <div className="flex items-center justify-between mt-1">
                          <a
                            href={lp(lang, `/p/${p.slug}`)}
                            className="text-sm font-semibold hover:underline text-secondary"
                          >
                            {t('moreArticles')} →
                          </a>
                          <span className="text-sm text-gray-400">{df}</span>
                        </div>
                      </div>
                      <img
                        src='https://placehold.co/400x300/e8f0fe/6366f1?text=FF'
                        alt={p.title}
                        loading="lazy"
                        className="w-24 h-24 rounded-sm object-cover shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
      </main>

      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 mt-10"
      >
        <h2
          className="font-bold text-gray-900 mb-6 text-[1.35rem]"
        >
          {t('moreArticles')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {latestPosts.slice(0, 4).map((p) => (
            <ArticleCard key={p.slug} article={p} lang={lang} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {latestPosts.slice(4, 8).map((p) => (
            <ArticleCard key={p.slug} article={p} lang={lang} />
          ))}
        </div>
      </section>
    </>
  );
}
