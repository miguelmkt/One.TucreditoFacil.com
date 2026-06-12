// moneyPosts removed — provide safe stubs to avoid runtime errors while cleaning
import type { Article } from '../data/types';

export function getMoneyPosts(): Article[] { return []; }
export function getMoneyPostsByLang(_lang: string): Article[] { return []; }
export function getMoneyPostBySlug(_slug: string): Article | undefined { return undefined; }
export function getMoneyPostBySlugAndLang(_slug: string, _lang: string): Article | undefined { return undefined; }
export function getMoneyPostsByCategory(_category: string): Article[] { return []; }
export function getMoneyPostsByCategoryAndLang(_category: string, _lang: string): Article[] { return []; }
export function getMoneyArticleTranslations(_translationKey: string): Article[] { return []; }
