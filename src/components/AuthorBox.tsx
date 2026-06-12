import { getAuthorByName, authorNameToSlug } from '../data/authors';
import type { Lang } from '../i18n/translations';

function lp(lang: string, path: string) {
  return lang === 'es' ? path : `/${lang}${path}`;
}

interface AuthorBoxProps {
  authorName: string;
  lang: Lang;
}

export default function AuthorBox({ authorName, lang }: AuthorBoxProps) {
  const author = getAuthorByName(authorName);
  const slug = author?.slug ?? authorNameToSlug(authorName);
  const avatar = author?.image ?? `/imagens/avatar-author/${slug}.svg`;
  const bio = author?.shortBio[lang] ?? authorName;
  const authorUrl = lp(lang, `/a/${slug}/`);

  return (
    <div className="mt-8 flex items-start gap-4 rounded-sm p-4 border border-gray-200 bg-white">
      <a href={authorUrl} className="shrink-0">
        <div className="rounded-full p-0.5" style={{ border: '0.5px solid #111', background: '#fff' }}>
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              src={avatar}
              alt={authorName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                (e.currentTarget.parentElement as HTMLElement).textContent = authorName.charAt(0);
              }}
            />
          </div>
        </div>
      </a>
      <div>
        <p className="font-bold text-gray-900 mb-1 text-lg">
          <a href={authorUrl} className="hover:underline">
            {authorName}
          </a>
        </p>
        {/* role removed per request */}
        <p className="text-[16px] text-black leading-[1.6]">{bio}</p>
        <a
          href={authorUrl}
          className="inline-block mt-3 text-sm font-medium text-secondary hover:underline"
        >
          {lang === 'es' ? 'Ver todos los posts' : lang === 'pt' ? 'Ver todos os posts' : lang === 'en' ? 'View all posts' : 'Voir tous les posts'} →
        </a>
      </div>
    </div>
  );
}
