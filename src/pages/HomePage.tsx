import { getPostsByLang, getPosts } from '../data/posts';
import { useSEO } from '../hooks/useSEO';
import { siteCategories } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';
import { SUPPORTED_LANGS, type TranslationKey } from '../i18n/translations';
import { getCategoryI18n } from '../i18n/categories';

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
      items: posts.filter((p) => p.category === cat.slug || p.category === cat.name).slice(0, 4),
    };
  });

  // Remove top padding for sections if the first visible group is 'educacion-financiera'
  const firstVisibleGroup = grouped.find((g) => g.items.length > 0);
  const hideTopPaddingForFirstEdu = firstVisibleGroup?.rawSlug === 'educacion-financiera';
  const firstVisibleIndex = grouped.findIndex((g) => g.items.length > 0);

  return (
    <main>
      {/* Banner removido */}
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 ${hideTopPaddingForFirstEdu ? 'pt-0' : 'pt-6'}`}>
        {/* Banner images removed by request */}
      </div>

      {/* Seções por categoria */}
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 ${hideTopPaddingForFirstEdu ? 'pt-0 pb-10' : 'py-10 pb-10'} space-y-12`}
      >
        {grouped.map((group, idx) => (
          group.items.length > 0 && (
            <section key={group.rawSlug}>
              <div className="flex items-center gap-6 mb-8">
                <span className="hidden md:block flex-1 h-px bg-gray-300" />
                <a
                  href={lp(lang, `/c/${group.slugForLang}`)}
                  className="text-3xl font-bold whitespace-nowrap hover:opacity-75 transition-opacity w-full md:w-auto text-center text-[#0D1A17]"
                >
                  {group.rawSlug === 'educacion-financiera' ? '' : group.name}
                </a>
                <span className="hidden md:block flex-1 h-px bg-gray-300" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(idx === firstVisibleIndex ? group.items.slice(0, 1) : group.items).map((post, i) => (
                  i === 0 && idx === firstVisibleIndex ? (
                    <a
                      key={post.slug}
                      href={lp(lang, `/p/${post.slug}`)}
                      className={`group block bg-white rounded-xl shadow-sm overflow-hidden col-span-1 sm:col-span-2 lg:col-span-3 lg:max-w-[760px] lg:justify-self-start ${idx === firstVisibleIndex ? 'rounded-b-md' : ''}`}
                    >
                      <div className="relative flex flex-col">
                        <div className="w-full h-64 md:h-[330px] bg-gray-100 overflow-hidden flex-shrink-0 relative">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-t-xl rounded-b-none"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://placehold.co/800x600/e8f0fe/6366f1?text=FF';
                            }}
                          />

                          {/* Overlay title on mobile */}
                          <div className="absolute inset-0 flex items-end md:hidden">
                            <div className="w-full bg-gradient-to-t from-black/65 to-transparent p-4">
                              <h2 className="text-[26px] leading-snug text-white font-sans font-semibold">
                                {post.title}
                              </h2>
                            </div>
                          </div>
                        </div>

                        {/* Title on desktop, placed below the image to match the featured-card layout */}
                        <div className="hidden md:block p-6 lg:p-7">
                          <h2 className="leading-snug text-[24px] lg:text-[26px] text-[#0D1A17] font-sans font-semibold">
                            {post.title}
                          </h2>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <a
                      key={post.slug}
                      href={lp(lang, `/p/${post.slug}`)}
                      className="group flex flex-col bg-white rounded shadow-sm"
                    >
                      <div className="px-[18px] pt-[18px]">
                        <div className="w-full aspect-[2/1] overflow-hidden rounded bg-gray-100">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-0"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://placehold.co/400x300/e8f0fe/6366f1?text=FF';
                            }}
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
                  )
                ))}
              </div>
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

