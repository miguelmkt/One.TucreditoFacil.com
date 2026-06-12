// moneyPosts compatibility layer removed — export safe stubs
import type { Article } from '../data/types';

export function getMoneyPosts(): Article[] { return []; }
export function getMoneyPostsByLang(_lang: string): Article[] { return []; }
export function getMoneyPostBySlug(_slug: string): Article | undefined { return undefined; }
export function getMoneyPostBySlugAndLang(_slug: string, _lang: string): Article | undefined { return undefined; }
export function getMoneyPostsByCategory(_cat: string): Article[] { return []; }
export function getMoneyPostsByCategoryAndLang(_cat: string, _lang: string): Article[] { return []; }
export function getMoneyArticleTranslations(_key: string): Article[] { return []; }

export const moneyPosts: Article[] = [];
