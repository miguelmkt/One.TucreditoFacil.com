import { useLang } from '../i18n/LangContext';
import { authors } from '../data/authors';

export default function EspecialistasPage() {
  const { lang } = useLang();

  const pageCopy: Record<string, { heading: string; subtitle: string; authorsTitle: string }> = {
    es: { heading: 'Nuestros Especialistas', subtitle: 'Un equipo de periodistas financieros, analistas y educadores que ofrecen análisis, guías y asesoría práctica sobre finanzas personales.', authorsTitle: 'Especialistas' },
    pt: { heading: 'Nossos Especialistas', subtitle: 'Uma equipe de jornalistas financeiros, analistas e educadores que oferecem análises, guias e assessoria prática sobre finanças pessoais.', authorsTitle: 'Especialistas' },
    en: { heading: 'Our Specialists', subtitle: 'A team of financial journalists, analysts and educators providing analysis, guides and practical advice on personal finance.', authorsTitle: 'Specialists' },
    fr: { heading: 'Nos Spécialistes', subtitle: "Une équipe de journalistes financiers, d'analystes et d'éducateurs fournissant analyses, guides et conseils pratiques sur les finances personnelles.", authorsTitle: 'Spécialistes' },
  };

  const pc = pageCopy[lang] ?? pageCopy.es;

  return (
    <main className="min-h-screen py-10 px-4 bg-[var(--brand-bg-gray)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{pc.heading}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">{pc.subtitle}</p>
        </div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6 pb-4 border-b border-gray-200">{pc.authorsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {authors.map((author) => {
            const authorUrl = lang === 'es' ? `/a/${author.slug}/` : `/${lang}/a/${author.slug}/`;
            const descripcion = (author.shortBio as any)[lang] ?? author.shortBio.pt;
            return (
              <div key={author.slug} role="link" onClick={() => { window.location.href = authorUrl; }} className="bg-white rounded-sm p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f3f4f6' }}>
                <div className="rounded-full p-0.5 sm:p-1 mb-3" style={{ border: '0.5px solid #111', background: '#fff' }}>
                  <div className="w-32 h-32 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                    <img src={author.image} alt={author.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                </div>
                <p className="font-bold text-gray-900 text-base mb-1 leading-snug">{author.name}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">{descripcion}</p>
                <div className="flex items-center gap-3 mt-2 text-secondary">
                  <a href={authorUrl} target="_blank" rel="noopener noreferrer" aria-label="facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href={authorUrl} target="_blank" rel="noopener noreferrer" aria-label="instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href={authorUrl} target="_blank" rel="noopener noreferrer" aria-label="linkedin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href={authorUrl} target="_blank" rel="noopener noreferrer" aria-label="twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
