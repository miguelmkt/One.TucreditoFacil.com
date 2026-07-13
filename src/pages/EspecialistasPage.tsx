import { brandColors } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';
import { authors } from '../data/authors';

interface PageMeta { h1: string; subtitle: string; authorsTitle: string; }

const pageMeta: Record<string, PageMeta> = {
  es: { h1: 'Nuestros Especialistas', subtitle: 'Apasionados por los animales, nuestros especialistas comparten contenidos sobre convivencia, razas, actividades y curiosidades para inspirar tutores en todo el mundo.', authorsTitle: 'Autores' },
  pt: { h1: 'Nossos Especialistas', subtitle: 'Apaixonados por animais, nossos especialistas compartilham conteúdos sobre convivência, raças, atividades e curiosidades para inspirar tutores ao redor do mundo.', authorsTitle: 'Autores' },
  en: { h1: 'Our Specialists', subtitle: 'Passionate about animals, our specialists share content about coexistence, breeds, activities and curiosities to inspire pet owners around the world.', authorsTitle: 'Authors' },
  fr: { h1: 'Nos Spécialistes', subtitle: 'Passionnés par les animaux, nos spécialistes partagent des contenus sur la cohabitation, les races, les activités et les curiosités pour inspirer les propriétaires du monde entier.', authorsTitle: 'Auteurs' },
};

export default function EspecialistasPage() {
  const { lang } = useLang();
  const pc = pageMeta[lang] ?? pageMeta.es;

  return (
    <main className="min-h-screen py-10 px-4" style={{ backgroundColor: brandColors.bgGray }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{pc.h1}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">{pc.subtitle}</p>
        </div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6 pb-4 border-b border-gray-200">{pc.authorsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {authors.map((author) => {
            const authorUrl = lang === 'es' ? `/a/${author.slug}/` : `/${lang}/a/${author.slug}/`;
            const titulo = author.role[lang as keyof typeof author.role] ?? author.role.es;
            const descripcion = author.shortBio[lang as keyof typeof author.shortBio] ?? author.shortBio.pt;
            return (
                <a key={author.slug} href={authorUrl} className="bg-white rounded-sm p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow no-underline" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f3f4f6' }}>
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
                </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}