import { useParams, useSearchParams } from 'react-router-dom';
import { getPostsByLang } from '../data/posts';
import { allCategories, siteCategories } from '../config/siteConfig';
import { useSEO } from '../hooks/useSEO';
import { useLang } from '../i18n/LangContext';
import { SUPPORTED_LANGS } from '../i18n/translations';
import { getCategoryI18n } from '../i18n/categories';

// Set of inactive slugs for 404 handling
const INACTIVE_SLUGS = new Set(
  allCategories.filter((c) => !c.active).map((c) => c.slug),
);

function formatDate(iso: string, lang: string) {
  const d = new Date(iso + 'T00:00:00');
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : 'es-ES';
  return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Returns a URL path respecting the current language prefix. */
function lp(lang: string, path: string) {
  return lang === 'es' ? path : `/${lang}${path}`;
}

const PER_PAGE = 9;

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams] = useSearchParams();
  const { lang, t } = useLang();
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const slug = categorySlug ?? '';
  
  // Find category by matching against any slug (es/pt/en/fr) or the default slug
  const category = siteCategories.find((c) => 
    c.slug === slug || Object.values(c.slugs).includes(slug)
  );
  
  const baseSlug = category?.slug ?? slug;
  const isKnownSlug = !!category;
  const isInactive = INACTIVE_SLUGS.has(baseSlug);

  // Get translated category name
  const { name: catName } = getCategoryI18n(baseSlug, lang);

  // Get the slug for current language for hreflang
  const getSlugForLang = (l: string) => {
    if (!category) return baseSlug;
    return (category.slugs as any)[l] || category.slug;
  };

  const hreflangAlternates = SUPPORTED_LANGS.map((l) => ({
    lang: l,
    path: `/${l === 'es' ? '' : l + '/'}c/${getSlugForLang(l)}`,
  }));

  useSEO({
    title: isKnownSlug ? catName : undefined,
    canonicalPath: isKnownSlug ? lp(lang, `/c/${getSlugForLang(lang)}`) : undefined,
    lang,
    hreflangAlternates: isKnownSlug ? hreflangAlternates : undefined,
  });

  const allLangPosts = getPostsByLang(lang);
  // Match by category slug OR by Spanish category name (for legacy posts stored with name)
  const catPosts = isKnownSlug
    ? allLangPosts.filter((p) => p.category === baseSlug || p.category === catName)
    : [];

  const totalPages = Math.ceil(catPosts.length / PER_PAGE);
  const pagePosts = catPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const latestPosts = allLangPosts.slice(0, 8);

  function pageHref(p: number) {
    const slugForLang = getSlugForLang(lang);
    return p === 1
      ? lp(lang, `/c/${slugForLang}`)
      : lp(lang, `/c/${slugForLang}?page=${p}`);
  }

  if (!isKnownSlug || isInactive) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-gray-500">{t('notFound')}</p>
        <a href={lang === 'es' ? '/' : `/${lang}`} className="hover:underline text-sm mt-4 block text-secondary">
          {t('backHome')}
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{catName}</h1>

          {pagePosts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 mb-4">{t('noArticles')}</p>
              <a href={lang === 'es' ? '/' : `/${lang}`} className="hover:underline text-sm text-secondary">
                {t('backHome')}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pagePosts.map((post) => (
                <a
                  key={post.slug}
                  href={lp(lang, `/p/${post.slug}`)}
                  className="group flex flex-col bg-white rounded shadow-sm"
                >
                  <div className="px-[20px] pt-[20px]">
                    <div className="w-full aspect-[2/1] overflow-hidden rounded bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://placehold.co/400x300/e8f0fe/6366f1?text=FF';
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-5">
                    <time className="text-[13px] text-gray-400 block mb-1.5">
                      {formatDate(post.date, lang)}
                    </time>
                    <h2
                      className="leading-snug text-[18px] text-[#0D1A17] font-sans font-semibold min-h-[80px]"
                    >
                      {post.title}
                    </h2>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 mt-8">
              {page > 1 && (
                <a href={pageHref(page - 1)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded">
                  ‹ {t('prevPage')}
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={pageHref(p)}
                  className={`px-3 py-1.5 text-sm rounded-sm border ${
                    p === page
                      ? 'text-white font-semibold border-transparent bg-secondary'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {p}
                </a>
              ))}
              {page < totalPages && (
                <a href={pageHref(page + 1)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded">
                  {t('nextPage')} ›
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-[380px] shrink-0 mt-1 lg:mt-0" style={{ alignSelf: 'flex-start' }}>
          <div
            className="bg-white rounded latest-articles"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', padding: '18px' }}
          >
            <h3
              className="mb-1"
              style={{ fontSize: '21px', color: '#333333', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600 }}
            >
              {t('latestPosts')}
            </h3>
            {latestPosts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center gap-4 rounded-sm border border-gray-100 mt-3 article" style={{ padding: '15px' }}
              >
                <div className="flex-1 min-w-0">
                  <a
                    href={lp(lang, `/p/${post.slug}`)}
                    className="line-clamp-3 block leading-snug hover:underline"
                    style={{ fontSize: '18px', color: '#333333', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600, marginBottom: '5px' }}
                  >
                    {post.title}
                  </a>
                  <div className="flex items-center justify-between mt-1">
                    <a
                      href={lp(lang, `/p/${post.slug}`)}
                      className="text-sm font-semibold hover:underline text-secondary"
                    >
                      {t('moreArticles')} →
                    </a>
                    <span className="text-sm text-gray-400">{formatDate(post.date, lang)}</span>
                  </div>
                </div>
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-24 h-24 rounded-sm object-cover shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://placehold.co/64x64/e2e8f0/94a3b8?text=FF';
                  }}
                />
              </div>
            ))}
          </div>
        </aside>

      </div>
    </main>
  );
}


