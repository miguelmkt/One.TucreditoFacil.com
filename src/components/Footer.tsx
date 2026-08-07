import { siteConfig, brandColors } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';

const footerDesc: Record<string, string> = {
  es: 'Inspírate con contenidos sobre finanzas personales: ahorro, inversión, tarjetas y préstamos para mejorar tu economía.',
  pt: 'Inspire-se com conteúdos sobre finanças pessoais: poupança, investimento, cartões e empréstimos para melhorar sua economia.',
  en: 'Get inspired with content about personal finance: saving, investing, credit cards and loans to improve your finances.',
  fr: 'Inspirez-vous avec des contenus sur les finances personnelles : épargne, investissement, cartes et prêts pour améliorer votre budget.',
};

export default function Footer() {
  const { lang, t } = useLang();
  const year = new Date().getFullYear();
  const p = lang === 'es' ? '' : `/${lang}`;

  const slugs: Record<string, { aboutUs: string; specialists: string; contact: string; terms: string; privacy: string }> = {
    es: { aboutUs: '/quienes-somos', specialists: '/especialistas', contact: '/contacto', terms: '/terminos-de-uso', privacy: '/politica-de-privacidad' },
    pt: { aboutUs: `${p}/quem-somos`, specialists: `${p}/especialistas`, contact: `${p}/contato`, terms: `${p}/termos-de-uso`, privacy: `${p}/politica-de-privacidade` },
    en: { aboutUs: `${p}/about-us`, specialists: `${p}/specialists`, contact: `${p}/contact`, terms: `${p}/terms-of-use`, privacy: `${p}/privacy-policy` },
    fr: { aboutUs: `${p}/qui-sommes-nous`, specialists: `${p}/specialistes`, contact: `${p}/contact`, terms: `${p}/conditions-utilisation`, privacy: `${p}/politique-de-confidentialite` },
  };
  const sl = slugs[lang] ?? slugs.es;

  const sobreNosotros = [
    { labelKey: 'aboutUs' as const,     href: sl.aboutUs },
    { labelKey: 'specialists' as const, href: sl.specialists },
    { labelKey: 'contact' as const,     href: sl.contact },
  ];

  const infoLegal = [
    { labelKey: 'terms' as const,   href: sl.terms },
    { labelKey: 'privacy' as const, href: sl.privacy },
  ];

  return (
    <footer className="text-white/200 mt-30" style={{ backgroundColor: brandColors.navBg }}>
      <div className="max-w-6xl mx-auto px-10 sm:px-6 pt-10 pb-1">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-left items-start">

          {/* Col 1 — Brand */}
          <div className="flex flex-col items-start">
            <a href={lang === 'es' ? '/' : `/${lang}`} className="flex items-center mb-">
              <img src={siteConfig.logo} alt={siteConfig.siteName} className="h-24" />
            </a>
            <p className="text-sm leading-relaxed max-w-[260px] mb-3" style={{ color: brandColors.footerLink }}>
              &copy; {year} {siteConfig.siteName} - {footerDesc[lang] ?? footerDesc.es}
            </p>
          </div>

          {/* Col 2 — About */}
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-base mb-0 text-footer" style={{ color: brandColors.footerText }}>{t('aboutSection')}</h3>
            <ul className="space-y-0">
              {sobreNosotros.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a 
                    href={href} 
                    className="text-sm transition-colors"
                    style={{ color: brandColors.footerLink }}
                  >
                    {t(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Legal */}
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-base mb-0 text-footer" style={{ color: brandColors.footerText }}>{t('legalSection')}</h3>
            <ul className="space-y-0">
              {infoLegal.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a 
                    href={href} 
                    className="text-sm transition-colors"
                    style={{ color: brandColors.footerLink }}
                  >
                    {t(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Full-width divider */}
      <div className="border-t border-secondary" />

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-6">
          {infoLegal.map(({ labelKey, href }) => (
            <a key={labelKey} href={href} className="hover:opacity-80 transition-colors font-medium text-secondary">
              {t(labelKey)}
            </a>
          ))}
        </div>
        <span className="font-medium text-secondary flex flex-col items-center">
          <span>Mount Clair - Digital Marketing</span>
          <span>CNPJ: 62.466.660.0001-10</span>
        </span>
      </div>
    </footer>
  );
}

