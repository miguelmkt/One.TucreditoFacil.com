import { getPostsByLang, getPosts } from '../data/posts';
import { useSEO } from '../hooks/useSEO';
import { siteCategories } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';
import { SUPPORTED_LANGS, type TranslationKey } from '../i18n/translations';
import { getCategoryI18n } from '../i18n/categories';
import ResponsiveImage from '../components/ResponsiveImage';

// banner images removed from layout — constants removed to avoid unused-variable errors

function formatDate(iso: string, lang: string) {
  const d = new Date(iso + 'T00:00:00');
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : 'es-ES';
  return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Returns a URL path respecting the current language prefix. */
function lp(lang: string, path: string) {
  return lang === 'es' ? path : `/${lang}${path}`;
}

export default function HomePage() {
  const { lang, t } = useLang();

  const hreflangAlternates = SUPPORTED_LANGS.map((l) => ({ lang: l, path: `/${l}` }));

  useSEO({
    lang,
    canonicalPath: lang === 'es' ? '/' : `/${lang}`,
    hreflangAlternates,
  });

  const posts = getPostsByLang(lang);

  const grouped = siteCategories.map((cat) => {
    const { name } = getCategoryI18n(cat.slug, lang);
    const slugForLang = cat.slugs[lang as keyof typeof cat.slugs] || cat.slug;
    return {
      rawSlug: cat.slug,
      slugForLang,
      name,
      items: posts.filter((p) => {
        const pSlug = (p.category ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
        const catSlugs = Object.values(cat.slugs);
        return p.category === cat.slug
          || p.category === cat.name
          || pSlug === cat.slug
          || catSlugs.includes(pSlug)
          || catSlugs.some((s) => pSlug.startsWith(s + '-') || s.startsWith(pSlug + '-'));
      }).slice(0, 4),
    };
  });

  // Remove top padding for sections if the first visible group is 'educacion-financiera'
  const firstVisibleGroup = grouped.find((g) => g.items.length > 0);
  const hideTopPaddingForFirstEdu = firstVisibleGroup?.rawSlug === 'educacion-financiera';
  const firstVisibleIndex = grouped.findIndex((g) => g.items.length > 0);
  const secondVisibleIndex = grouped.findIndex((g, i) => i > firstVisibleIndex && g.items.length > 0);

  return (
    <main>

      {/* Seções por categoria */}
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 ${hideTopPaddingForFirstEdu ? 'pt-0 pb-10' : 'py-10 pb-10'} space-y-12`}
      >
        {grouped.map((group, idx) => (
          group.items.length > 0 && (
            <section key={group.rawSlug}>
              {idx !== firstVisibleIndex && (
                <div className="flex items-center gap-6 mb-8">
                  <span className="hidden md:block flex-1 h-px bg-gray-300" />
                  <a
                    href={lp(lang, `/c/${group.slugForLang}`)}
                    className="text-3xl font-bold break-words hover:opacity-75 transition-opacity w-full md:w-auto text-center text-[#0D1A17]"
                  >
                    {group.rawSlug === 'educacion-financiera' ? '' : group.name}
                  </a>
                  <span className="hidden md:block flex-1 h-px bg-gray-300" />
                </div>
              )}
              {idx === firstVisibleIndex ? (
                /* ── First section: featured card + sidebar (same as CategoryPage) ── */
                <div className="flex flex-col lg:flex-row gap-6">
                  {group.items.slice(0, 1).map((post) => (
                    <a
                      key={post.slug}
                      href={lp(lang, `/p/${post.slug}`)}
                      className="group block bg-white rounded-md shadow-sm overflow-hidden flex-1 min-w-0 rounded-b-md"
                    >
                      <div className="relative flex flex-col">
                        <div className="w-full h-64 md:h-[330px] bg-gray-100 overflow-hidden flex-shrink-0 relative">
                          <ResponsiveImage
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover rounded-t-md rounded-b-none"
                            priority
                          />
                          <div className="absolute inset-0 flex items-end md:hidden">
                            <div className="w-full bg-gradient-to-t from-black/65 to-transparent p-4">
                              <h2 className="text-[26px] leading-snug text-white font-sans font-semibold">
                                {post.title}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:block p-6 lg:p-7">
                          <h2 className="leading-snug text-[24px] lg:text-[26px] text-[#0D1A17] font-sans font-semibold">
                            {post.title}
                          </h2>
                        </div>
                      </div>
                    </a>
                  ))}

                  {/* Sidebar — desktop only; mobile version renders after 2nd section */}
                  <aside className="hidden lg:block lg:w-[380px] shrink-0 lg:mt-0">
                    <div
                      className="bg-white rounded latest-articles h-full flex flex-col"
                      style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', padding: '14px' }}
                    >
                      <h3
                        className="mb-1"
                        style={{ fontSize: '21px', color: '#333333', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600 }}
                      >
                        {t('mostRead')}
                      </h3>
                      <div className="flex flex-col flex-1 gap-2 mt-2">
                      {posts.slice(1, 4).map((sidePost) => (
                        <div
                          key={sidePost.slug}
                          className="flex items-center gap-3 rounded-sm border border-gray-100 article flex-1"
                          style={{ padding: '10px' }}
                        >
                          <div className="flex-1 min-w-0">
                            <a
                              href={lp(lang, `/p/${sidePost.slug}`)}
                              className="line-clamp-3 block leading-snug hover:underline"
                              style={{ fontSize: '17px', color: '#333333', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600, marginBottom: '4px' }}
                            >
                              {sidePost.title}
                            </a>
                            <div className="flex items-center justify-between mt-1">
                              <a
                                href={lp(lang, `/p/${sidePost.slug}`)}
                                className="text-sm font-semibold hover:underline text-secondary"
                              >
                                {t('moreArticles')} →
                              </a>
                              <span className="text-sm text-gray-400">{formatDate(sidePost.date, lang)}</span>
                            </div>
                          </div>
                          <ResponsiveImage
                            src={sidePost.image}
                            alt={sidePost.title}
                            className="w-16 h-16 rounded-sm object-cover shrink-0"
                            variant="thumbnail"
                          />
                        </div>
                      ))}
                      </div>
                    </div>
                  </aside>
                </div>
              ) : (
                /* ── Other sections: regular 4-col grid ── */
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.items.map((post) => (
                    <a
                      key={post.slug}
                      href={lp(lang, `/p/${post.slug}`)}
                      className="group flex flex-col bg-white rounded shadow-sm"
                    >
                      <div className="px-[18px] pt-[18px]">
                        <div className="w-full aspect-[2/1] overflow-hidden rounded-sm bg-gray-100">
                          <ResponsiveImage
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-0"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                          />
                        </div>
                      </div>
                      <div className="p-[18px]">
                        <time className="text-[13px] text-[#888888] block mb-1.5">
                          {formatDate(post.date, lang)}
                        </time>
                        <h2
                          className="leading-snug text-[18px] text-[#0D1A17] font-sans font-semibold mb-[9px]"
                        >
                          {post.title}
                        </h2>
                      </div>
                    </a>
                  ))}
                </div>
                {/* Mobile sidebar — shown only after the 2nd visible section */}
                {idx === secondVisibleIndex && (
                  <div className="block lg:hidden mt-6">
                    <div
                      className="bg-white rounded latest-articles flex flex-col"
                      style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', padding: '14px' }}
                    >
                      <h3
                        className="mb-1"
                        style={{ fontSize: '21px', color: '#333333', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600 }}
                      >
                        {t('mostRead')}
                      </h3>
                      <div className="flex flex-col gap-2 mt-2">
                        {posts.slice(1, 4).map((sidePost) => (
                          <div
                            key={sidePost.slug}
                            className="flex items-center gap-3 rounded-sm border border-gray-100 article"
                            style={{ padding: '10px' }}
                          >
                            <div className="flex-1 min-w-0">
                              <a
                                href={lp(lang, `/p/${sidePost.slug}`)}
                                className="line-clamp-3 block leading-snug hover:underline"
                                style={{ fontSize: '17px', color: '#333333', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600, marginBottom: '4px' }}
                              >
                                {sidePost.title}
                              </a>
                              <div className="flex items-center justify-between mt-1">
                                <a href={lp(lang, `/p/${sidePost.slug}`)} className="text-sm font-semibold hover:underline text-secondary">
                                  {t('moreArticles')} →
                                </a>
                                <span className="text-sm text-gray-400">{formatDate(sidePost.date, lang)}</span>
                              </div>
                            </div>
                            <ResponsiveImage
                              src={sidePost.image}
                              alt={sidePost.title}
                              className="w-16 h-16 rounded-sm object-cover shrink-0"
                              variant="thumbnail"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                </>              )}
            </section>
          )
        ))}

        {/* Show all-language posts if no lang-specific posts found */}
        {grouped.every((g) => g.items.length === 0) && (
          <AllPostsFallback lang={lang} t={t} />
        )}
      </div>
    </main>
  );
}

/** Fallback: shows all posts (any language) when current lang has no content yet. */
function AllPostsFallback({ lang, t }: { lang: string; t: (k: TranslationKey) => string }) {
  const allPosts = getPosts().slice(0, 4);
  void allPosts; // just render simple message
  return (
    <div className="text-center py-10">
      <p className="text-gray-500 mb-4">{t('noArticles')}</p>
      <a href={lang === 'es' ? '/' : `/${lang}`} className="text-sm hover:underline text-secondary">{t('backHome')}</a>
    </div>
  );
}

export { };

