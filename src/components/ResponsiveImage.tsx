import {
  buildCdnUrl,
  buildSrcSet,
  normalizeSrcToPath,
  SIZES_CONTENT,
  SIZES_THUMBNAIL,
} from '../lib/imageUtils';

const PLACEHOLDER = '/placeholder.svg';

export interface ResponsiveImageProps {
  /**
   * Caminho local (ex.: `/imagens/img-post/foo.png`) ou URL externa completa.
   * Strings vazias, `null` ou `undefined` exibem o placeholder automaticamente.
   */
  src?: string | null;
  alt: string;
  /** Largura intrínseca em px — evita layout shift (CLS). */
  width?: number;
  /** Altura intrínseca em px — evita layout shift (CLS). */
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Sobrescreve o atributo `sizes`.
   * Padrão: SIZES_CONTENT ou SIZES_THUMBNAIL conforme `variant`.
   */
  sizes?: string;
  /**
   * `'content'`   → imagem de conteúdo / hero (padrão)
   * `'thumbnail'` → miniaturas fixas (sidebars, listas)
   */
  variant?: 'content' | 'thumbnail';
  /**
   * `true` para a imagem principal LCP (hero, acima da dobra).
   * Ativa `loading="eager"` e `fetchpriority="high"`.
   * Padrão: `false` (lazy loading).
   */
  priority?: boolean;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

/**
 * Componente de imagem responsiva.
 *
 * Gera automaticamente `srcset` e `sizes` para os tamanhos
 * 320 / 480 / 640 / 768 / 960 / 1200 / 1600 / 1920 px, usando o
 * redimensionador em https://cdn.one.tucreditofacil.com/{width}/0/{quality}/{path}.
 *
 * Imagens externas (http/https) não passam pelo CDN.
 */
export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  sizes,
  variant = 'content',
  priority = false,
  onError,
}: ResponsiveImageProps) {
  const effectiveSrc = src && src.trim() ? src.trim() : PLACEHOLDER;
  const imagePath = normalizeSrcToPath(effectiveSrc);
  // imagePath === null significa URL externa de outro domínio
  const external = imagePath === null;

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget as HTMLImageElement;
    // Limpa srcset para o browser não continuar tentando variantes do CDN
    img.srcset = '';
    img.sizes = '';
    img.src = PLACEHOLDER;
    if (onError) onError(e);
  };

  const loadingAttr = priority ? ('eager' as const) : ('lazy' as const);
  const fetchPriorityAttr = priority ? ('high' as const) : ('auto' as const);
  const sizesAttr = sizes ?? (variant === 'thumbnail' ? SIZES_THUMBNAIL : SIZES_CONTENT);

  if (external) {
    // URLs externas de outro domínio: sem transformação pelo CDN
    return (
      <img
        src={effectiveSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        loading={loadingAttr}
        decoding="async"
        fetchPriority={fetchPriorityAttr}
        onError={handleError}
      />
    );
  }

  // Caminho local ou URL do próprio CDN: gera srcset completo
  const defaultSrc = buildCdnUrl(imagePath!, 800);
  const srcSet = buildSrcSet(imagePath!);

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet}
      sizes={sizesAttr}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={loadingAttr}
      decoding="async"
      fetchPriority={fetchPriorityAttr}
      onError={handleError}
    />
  );
}
