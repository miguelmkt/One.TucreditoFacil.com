import { useState } from 'react';
import { siteConfig, siteCategories, categoryNavLines, brandColors } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';
import { getCategoryI18n } from '../i18n/categories';

export default function Header() {
  const { lang, t } = useLang();
  const [query, setQuery] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  /** Root href for the current language (logo link). */
  const homeHref = lang === 'es' ? '/' : `/${lang}`;

  /** Category link with translated slug for the current language. */
  function catHref(category: typeof siteCategories[0]): string {
    const slugForLang = category.slugs[lang as keyof typeof category.slugs] || category.slug;
    return lang === 'es' ? `/c/${slugForLang}` : `/${lang}/c/${slugForLang}`;
  }

  const navLinks = siteCategories.map((cat) => {
    const { name } = getCategoryI18n(cat.slug, lang);
    const [line1, line2] = categoryNavLines(name);
    return { line1, line2, cat };
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setMobileSearch(false);
    const base = lang === 'es' ? '' : `/${lang}`;
    
    if (q) {
      window.location.href = `${base}/?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = `${base}/`;
    }
  }

  function closeAll() {
    setMobileNav(false);
    setMobileSearch(false);
  }


  return (
    <header className="shadow-lg px-2 py-2 sm:px-6 sm:py-3" style={{ backgroundColor: brandColors.navBg }}>
      <div className="max-w-6xl mx-auto flex items-center h-[54px] lg:h-[87px] gap-5 px-3 py-0 sm:gap-8 sm:px-6 sm:py-3">

        {/* Logo */}
        <a
          href={homeHref}
          onClick={closeAll}
          className="flex items-center shrink-0"
          aria-label={`${siteConfig.siteName} - inicio`}
        >
          <img src={siteConfig.logo} alt={siteConfig.siteName} className="h-12 sm:h-16 md:h-20 w-auto object-contain" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10 flex-1 justify-center" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a
              key={link.cat.slug}
              href={catHref(link.cat)}
              className="text-white/100 transition-colors text-[16px] text-center font-medium flex flex-col items-center leading-[1.25] text-nav"
              style={{ color: brandColors.navText }}
              onMouseEnter={e => (e.currentTarget.style.color = brandColors.headerNavHover)}
              onMouseLeave={e => (e.currentTarget.style.color = brandColors.navText)}
            >
              <span className="whitespace-nowrap">{link.line1}</span>
              <span className="whitespace-nowrap">{link.line2}</span>
            </a>
          ))}
        </nav>

        {/* Desktop right - search */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-md overflow-hidden border border-gray-200 bg-white"
            role="search"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="text-gray-800 placeholder-gray-400 text-sm px-4 w-44 outline-none border-0 h-10 bg-transparent"
            />
            <button
              type="submit"
              className="text-white text-sm font-semibold px-5 h-10 transition-opacity hover:opacity-90 whitespace-nowrap bg-secondary"
            >
              {t('search')}
            </button>
          </form>
        </div>

        {/* Mobile icons */}
        <div className="lg:hidden ml-auto flex items-center gap-3">
          <button
            aria-label={t('openMenu')}
            onClick={() => { setMobileNav((v) => !v); setMobileSearch(false); }}
            className="transition-colors flex items-center"
            style={{ color: 'var(--brand-secondary)' }}
          >
            {/* SVG fornecido pelo usuário */}
            <svg viewBox="0 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" style={{display: 'block'}}>
              <path d="M3 18.667h18a1 1 0 0 1 .117 1.993l-.117.007H3a1 1 0 0 1-.117-1.994zh18zm0-6 7-.002a1 1 0 0 1 .117 1.993l-.117.007-7 .002a1 1 0 0 1-.117-1.994zl7-.002zm0-6h7a1 1 0 0 1 .117 1.993L10 8.667H3a1 1 0 0 1-.117-1.994zh7zM21 1.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 21 1.5m0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search bar */}
      {mobileSearch && (
        <div className="lg:hidden px-4 py-3 border-t border-white/10" style={{ backgroundColor: brandColors.navBg }}>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              autoFocus
              className="bg-white text-gray-800 placeholder-gray-400 text-sm px-3 rounded-l-md flex-1 outline-none h-10"
            />
            <button type="submit"
              className="text-white text-sm font-semibold px-4 h-10 rounded-r-md whitespace-nowrap bg-secondary">
              {t('search')}
            </button>
          </form>
        </div>
      )}

      {/* Mobile Nav menu */}
      {mobileNav && (
        <div className="lg:hidden border-t border-white/10 py-3" style={{ backgroundColor: brandColors.navBg }}>
          <div className="mx-auto max-w-xs flex flex-col items-center gap-0.5 px-4">
            {navLinks.map((link) => (
              <a
                key={link.cat.slug}
                href={catHref(link.cat)}
                onClick={closeAll}
                className="text-white/80 transition-colors text-base font-medium py-3 rounded-md hover:bg-white/5 text-center w-full text-nav"
                style={{ color: brandColors.navText }}
                onMouseEnter={e => (e.currentTarget.style.color = brandColors.headerNavHover)}
                onMouseLeave={e => (e.currentTarget.style.color = brandColors.navText)}
              >
                {link.line1} {link.line2}
              </a>
            ))}
          </div>
          <div className="mx-auto max-w-xs px-4">
            <form onSubmit={handleSearch} className="flex mt-3 pt-3 border-t border-white/10">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="bg-white text-gray-800 text-sm px-3 rounded-l-md flex-1 outline-none h-9"
              />
              <button type="submit" className="text-white text-sm font-semibold px-4 h-9 rounded-r-md bg-secondary">
                {t('search')}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
