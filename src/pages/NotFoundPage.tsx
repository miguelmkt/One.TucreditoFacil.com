import { siteConfig } from '../config/siteConfig';

const c404 = {
  es: { title: 'Página no encontrada', body: `El artículo que buscas no existe o ha sido movido. Vuelve al inicio para explorar todo el contenido de ${siteConfig.siteName}.`, btn: 'Volver al inicio', home: '/' },
  pt: { title: 'Página não encontrada', body: `O artigo que você procura não existe ou foi movido. Volte ao início para explorar todo o conteúdo de ${siteConfig.siteName}.`, btn: 'Voltar ao início', home: '/pt' },
  en: { title: 'Page not found', body: `The article you are looking for does not exist or has been moved. Go back home to explore all content from ${siteConfig.siteName}.`, btn: 'Back to home', home: '/en' },
  fr: { title: 'Page introuvable', body: `L'article que vous recherchez n'existe pas ou a été déplacé. Retournez à l'accueil pour explorer tout le contenu de ${siteConfig.siteName}.`, btn: "Retour à l'accueil", home: '/fr' },
};

export default function NotFoundPage() {
  const first = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '';
  const lang = (['pt', 'en', 'fr'] as string[]).includes(first) ? (first as keyof typeof c404) : 'es';
  const c = c404[lang];
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-8xl font-extrabold text-brand-100 select-none">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{c.title}</h1>
      <p className="text-gray-500 max-w-sm mb-8">{c.body}</p>
      <a href={c.home} className="btn-primary">{c.btn}</a>
    </main>
  );
}
