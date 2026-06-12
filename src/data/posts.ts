/**
 * Agregador de posts — fonte única de verdade: /src/content/posts/*.json
 *
 * Para adicionar artigos: crie um arquivo .json em src/content/posts/
 * Para integrar scripts de geração automática: os scripts devem salvar JSONs nessa pasta.
 *
 * Os arquivos legados em src/data/*Posts.ts foram substituídos por esta fonte JSON.
 */
import {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByLang,
  getPostBySlugAndLang,
  getPostsByCategoryAndLang,
  getArticleTranslations,
} from '../lib/posts';

export {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByLang,
  getPostBySlugAndLang,
  getPostsByCategoryAndLang,
  getArticleTranslations,
};

/** Array de todos os posts — mantido para compatibilidade com imports existentes. */
export const posts = getPosts();
