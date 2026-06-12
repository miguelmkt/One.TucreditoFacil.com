import type { Article } from '../data/types';

interface ArticleCardProps {
  article: Article;
  /** Language prefix for links. Defaults to 'pt'. */
  lang?: string;
}

export default function ArticleCard({ article, lang = 'pt' }: ArticleCardProps) {
  const d = new Date(article.date + 'T00:00:00');
  const locale = lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : lang === 'pt' ? 'pt-BR' : 'es-ES';
  const formattedDate = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
  const href = lang === 'es' ? `/p/${article.slug}` : `/${lang}/p/${article.slug}`;

  return (
    <a
      href={href}
      className="group flex flex-col bg-white rounded-sm"
      style={{ boxShadow: '0 2px 4px 0 rgba(0,0,0,0.06)' }}
    >
      {/* Image */}
      <div style={{ padding: '16px 16px 0 16px' }}>
        <div className="w-full aspect-[2/1] overflow-hidden rounded-sm bg-gray-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/400x300/e8f0fe/6366f1?text=FF';
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px' }}>
        <time dateTime={article.date} style={{ fontSize: '16px', color: '#888888', display: 'block', marginBottom: '7.2px' }}>
          {formattedDate}
        </time>
        <h2
          className="leading-snug"
          style={{ fontSize: '18px', color: '#0D1A17', fontFamily: '"Ubuntu Sans", sans-serif', fontWeight: 600, lineHeight: '1.4', marginBottom: '9px' }}
        >
          {article.title}
        </h2>
      </div>
    </a>
  );
}
