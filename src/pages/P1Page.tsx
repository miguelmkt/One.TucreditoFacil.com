import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import AdUnit from '../components/AdUnit';
import { getP1BySlug, getP1BySlugAndLang } from '../lib/p1';
import { siteConfig } from '../config/siteConfig';
import { useSEO } from '../hooks/useSEO';
import { useLang } from '../i18n/LangContext';
import ResponsiveImage from '../components/ResponsiveImage';

declare global {
  interface Window { adsbygoogle: unknown[] }
}

function lp(lang: string, path: string) {
  return lang === 'es' ? path : `/${lang}${path}`;
}

export default function P1Page() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLang();

  const p1 = getP1BySlugAndLang(slug ?? '', lang) ?? getP1BySlug(slug ?? '');

  useSEO({
    title: p1?.title,
    description: p1?.excerpt,
    canonicalPath: p1 ? lp(lang, `/l/${p1.slug}`) : undefined,
    lang,
  });

  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
  }, []);

  if (!p1) return <Navigate to="/404" replace />;

  // CTAs inside contentBefore/contentAfter already contain the correct P2 URL

  const IMAGE_MARKER = '<!-- IMAGE_HERE -->';

  // Preferir posicionamento antes do cabeçalho "Información" quando presente;
  // caso contrário, usar o marker se existir.
  // Matcha um <h1>-<h4> que contenha a palavra 'informação' em várias línguas,
  // inclusive quando há tags internas ou texto adicional dentro do heading.
  const infoHeadingRegex = /<h[1-4][^>]*>[\s\S]*?(Información|Informaci[oó]n|Informações|Informação|Information|Informations|Informacion)[\s\S]*?<\/h[1-4]>/i;

  let contentBefore = '';
  let contentAfter = '';

  const idxHeading = p1.content.search(infoHeadingRegex);
  const idxMarker = p1.content.indexOf(IMAGE_MARKER);

  if (idxHeading >= 0) {
    contentBefore = p1.content.slice(0, idxHeading);
    contentAfter = p1.content.slice(idxHeading);
  } else if (idxMarker >= 0) {
    [contentBefore, contentAfter] = p1.content.split(IMAGE_MARKER);
  } else {
    contentBefore = p1.content;
    contentAfter = '';
  }

  return (
    <>
      <main className="w-full max-w-3xl mx-auto px-0 sm:px-6 py-0 sm:pt-10 sm:pb-8 overflow-x-hidden">
        <article className="w-full bg-white rounded-sm p-[18px] sm:p-[34px] text-[#333] font-sans text-[18px]">

          {/* Title — centered */}
          <h1 className="text-center leading-tight text-[34px] text-[#0D1A17] font-bold mb-0">
            {p1.title}
          </h1>

          {/* Adex abaixo do título (formato P2) */}
          <div className="-mx-[18px] sm:mx-0 w-[calc(100%+36px)] sm:w-full mt-1 mb-0 bg-white">
            <AdUnit
              html={`<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-5353240549344602"
     data-ad-slot="2486655972"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`}
              minHeight={10}
              className="w-full overflow-hidden bg-white pb-0"
              label={t('advertisement')}
            />
          </div>

          {/* IMAGE — same as P2 money post (moved up, immediately after title) */}
          {/* (Imagem e anúncio serão renderizados após `contentBefore` para aparecer abaixo do CTA) */}

          {/* Content before image: intro paragraphs + first CTA */}
          {contentBefore && (
            <div className="post-content" dangerouslySetInnerHTML={{ __html: contentBefore }} />
          )}

          {/* Coloca imagem aqui (após o CTA do conteúdo) */}
          <div className="mt-6 mb-5">
            <ResponsiveImage
                src={p1.image}
                alt={p1.title}
                className="w-full object-cover aspect-[2/1] rounded-md block"
                priority
              />
          </div>


          {/* Content after image: short paragraph + info icons + pontos positivos + final CTA */}
          {contentAfter && (
            <div className="post-content" dangerouslySetInnerHTML={{ __html: contentAfter }} />
          )}

          {/* Site card — editorial team */}
          {(() => {
            const fallbacks: Record<string, string> = {
              pt: 'Nossos autores analisam, comparam e explicam com um objetivo claro: ajudá-lo a tomar melhores decisões financeiras.',
              es: 'Nuestros autores analizan, comparan y explican con un objetivo claro: ayudarte a tomar mejores decisiones financieras.',
              en: 'Our authors analyze, compare and explain with one clear goal: helping you make better financial decisions.',
              fr: 'Nos auteurs analysent, comparent et expliquent avec un objectif clair : vous aider à prendre de meilleures décisions financières.',
            };
            const teamLabels: Record<string, string> = { pt: 'Equipe Editorial', es: 'Equipo Editorial', en: 'Editorial Team', fr: 'Équipe Éditoriale' };
            const desc =
              (siteConfig as any)[`editorialDescription_${lang}`] ||
              (siteConfig as any).editorialDescription ||
              (siteConfig as any)[`description_${lang}`] ||
              fallbacks[lang] || fallbacks.es;
            return (
              <div className="mt-10 rounded-2xl border border-gray-200 shadow-sm bg-white p-6 flex flex-col items-center text-center gap-4">
                {((siteConfig as any).logo || siteConfig.favicon) && (
                  <img
                    src={(siteConfig as any).logo || siteConfig.favicon}
                    alt={siteConfig.siteName}
                    className="w-20 h-20 rounded-full object-contain shadow-sm bg-black"
                  />
                )}
                <div>
                  <p className="font-bold text-gray-900 text-[1.05rem] mb-1">
                    {siteConfig.siteName}{' - '}{teamLabels[lang] || teamLabels.es}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
                </div>
              </div>
            );
          })()}
        </article>
      </main>
    </>
  );
}
