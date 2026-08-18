const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORAGE_KEY = 'utm_params';

/** Lê UTMs da URL atual e persiste no sessionStorage (não sobrescreve se já existir). */
export function captureUtm(): void {
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) found[k] = v;
  });
  if (Object.keys(found).length > 0) {
    sessionStorage.setItem(STORAGE_KEY, new URLSearchParams(found).toString());
  }
}

/** Retorna os UTMs armazenados como string de query (ex: "utm_source=fb&utm_medium=cpc"). */
function getStoredUtmString(): string {
  return sessionStorage.getItem(STORAGE_KEY) ?? '';
}

/** Anexa os UTMs armazenados a uma URL interna. Preserva query params existentes. */
export function appendUtm(url: string): string {
  const stored = getStoredUtmString();
  if (!stored) return url;

  try {
    // Suporta caminhos relativos (ex: "/p/slug") e URLs absolutas
    const isAbsolute = /^https?:\/\//.test(url);
    const base = isAbsolute ? undefined : window.location.origin;
    const parsed = new URL(url, base);

    const storedParams = new URLSearchParams(stored);
    storedParams.forEach((v, k) => {
      if (!parsed.searchParams.has(k)) parsed.searchParams.set(k, v);
    });

    return isAbsolute ? parsed.toString() : parsed.pathname + (parsed.search || '') + (parsed.hash || '');
  } catch {
    return url;
  }
}
