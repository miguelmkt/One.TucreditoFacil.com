/**
 * Image CDN utilities — gera URLs para o redimensionador
 *
 * Formato do CDN: https://{IMG_CDN_BASE}/{width}/{height}/{quality}/{imagePath}
 * Exemplo:        https://cdn.one.tucreditofacil.com/800/0/85/imagens/img-post/foo.png
 *
 * Para substituir o domínio, defina VITE_IMG_CDN_URL no arquivo .env
 */

/** Base URL do redimensionador. Configurável via VITE_IMG_CDN_URL. */
export const IMG_CDN_BASE: string =
  (import.meta.env?.VITE_IMG_CDN_URL as string | undefined) ??
  'https://cdn.one.tucreditofacil.com';

/** Larguras (px) usadas para gerar os descritores do srcset. */
export const SRCSET_WIDTHS = [320, 480, 640, 768, 960, 1200, 1600, 1920] as const;

/** Qualidade de compressão padrão (0–100). */
export const DEFAULT_QUALITY = 85;

/**
 * `sizes` para imagens de conteúdo (hero, imagem do artigo).
 * Ocupa 100vw em mobile, 80vw em tablets, máx. 1200px em desktop.
 */
export const SIZES_CONTENT =
  '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px';

/**
 * `sizes` para miniaturas (sidebars, listas de artigos relacionados).
 */
export const SIZES_THUMBNAIL = '(max-width: 768px) 50vw, 300px';

/** Retorna true se src for uma URL externa (http/https). */
export function isExternalUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

/**
 * Se a URL for do próprio CDN, extrai e retorna apenas o imagePath.
 * Suporta dois formatos:
 *   - Com dimensões:  https://cdn.one.tucreditofacil.com/700/350/70/one.tucreditofacil.com/foo.png  → "one.tucreditofacil.com/foo.png"
 *   - Sem dimensões:  https://cdn.one.tucreditofacil.com/one.tucreditofacil.com/foo.png             → "one.tucreditofacil.com/foo.png"
 * Retorna null se não for uma URL deste CDN.
 */
export function extractCdnPath(url: string): string | null {
  if (!url.startsWith(IMG_CDN_BASE + '/')) return null;

  // Remove o prefixo base: "one.tucreditofacil.com/700/350/70/one.tucreditofacil.com/foo.png"
  const afterBase = url.slice(IMG_CDN_BASE.length + 1);
  const segments = afterBase.split('/');

  // Verifica se os 3 primeiros segmentos são números (width/height/quality)
  if (
    segments.length >= 4 &&
    /^\d+$/.test(segments[0]) &&
    /^\d+$/.test(segments[1]) &&
    /^\d+$/.test(segments[2])
  ) {
    // Formato com dimensões: descarta width/height/quality
    return segments.slice(3).join('/');
  }

  // Formato sem dimensões: usa o path como está
  return afterBase;
}

/**
 * Normaliza qualquer valor de `src` para um imagePath relativo utilizável
 * no CDN. Retorna null se for uma URL externa não relacionada ao CDN.
 *
 * Casos tratados:
 *  - Caminho local:  /imagens/foo.png          → "imagens/foo.png"
 *  - URL CDN com dim: https://cdn.one.tucreditofacil.com/700/350/70/path → "path"
 *  - URL CDN sem dim: https://cdn.one.tucreditofacil.com/path             → "path"
 *  - URL externa:    https://outro.com/foo.png → null
 */
export function normalizeSrcToPath(src: string): string | null {
  if (!src) return null;

  // URL do próprio CDN — extrair o path
  const cdnPath = extractCdnPath(src);
  if (cdnPath !== null) return cdnPath;

  // URL externa de outro domínio — não processar
  if (isExternalUrl(src)) return null;

  // Caminho local — remover barra inicial
  const localPath = src.startsWith('/') ? src.slice(1) : src;

  // Filename puro (sem "/" nem "http") → prefixar com one.tucreditofacil.com/
  if (!localPath.includes('/')) return `one.tucreditofacil.com/${localPath}`;

  return localPath;
}

/**
 * Constrói uma URL única do CDN.
 * @param imagePath  Caminho local, ex.: `/imagens/img-post/foo.png`
 * @param width      Largura alvo em px
 * @param height     Altura alvo em px (0 = preservar proporção automaticamente)
 * @param quality    Qualidade de compressão (padrão: 85)
 */
export function buildCdnUrl(
  imagePath: string,
  width: number,
  height = 0,
  quality = DEFAULT_QUALITY,
): string {
  const path = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${IMG_CDN_BASE}/${width}/${height}/${quality}/${path}`;
}

/**
 * Constrói o atributo `srcset` completo com todos os SRCSET_WIDTHS.
 * Exemplo: "https://cdn.one.tucreditofacil.com/320/0/85/imagens/foo.png 320w, ..."
 */
export function buildSrcSet(imagePath: string, quality = DEFAULT_QUALITY): string {
  return SRCSET_WIDTHS.map(
    (w) => `${buildCdnUrl(imagePath, w, 0, quality)} ${w}w`,
  ).join(', ');
}
