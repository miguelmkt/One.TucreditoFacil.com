import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { brandColors } from '../config/siteConfig';

export default function CookieBanner() {
  const { lang, t } = useLang();
  const [visible, setVisible] = useState(() => {
    return !localStorage.getItem('cookies_consent_v2');
  });

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem('cookies_consent_v2', 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookies_consent_v2', 'rejected');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl bg-white border border-gray-200 rounded-xl shadow-xl px-5 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

        {/* Ícone + texto */}
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5 shrink-0 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <path d="M8.5 8.5v.01" />
              <path d="M16 15.5v.01" />
              <path d="M12 12v.01" />
              <path d="M11 17v.01" />
              <path d="M7 14v.01" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-snug mb-1">
            {lang === 'es' ? 'Utilizamos cookies' : lang === 'pt' ? 'Utilizamos cookies' : lang === 'en' ? 'We use cookies' : 'Nous utilisons des cookies'}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('cookieMessage')}{' '}
              <a href={lang === 'es' ? '/politica-de-privacidad' : `/${lang}/politica-de-privacidade`} className="text-green-600 underline hover:text-green-700 transition-colors">
                {t('privacy')}
              </a>
              .
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <button
            onClick={handleReject}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {t('cookieDecline')}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-md text-white text-sm font-semibold transition-colors cursor-pointer"
            style={{ backgroundColor: brandColors.secondary }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = brandColors.secondary)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = brandColors.secondary)}
          >
            {t('cookieAccept')}
          </button>
        </div>
      </div>
    </div>
  );
}
