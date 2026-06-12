/**
 * DynamicLoader (incremental)
 * - loadScript(src, opts)
 * - loadWidget(container, scriptUrl, config, callback, opts)
 * - destroyWidget(container)
 * - isLoaded(target)
 *
 * Exposed as `window.DynamicLoader` and exported as default.
 * Designed to be non-intrusive, fail-silent in production and safe for SPA.
 */

type LoadScriptOptions = {
  async?: boolean;
  defer?: boolean;
  module?: boolean;
  attrs?: Record<string, string>;
  insertTo?: 'head' | 'body' | HTMLElement;
  timeout?: number;
  key?: string;
};

const isDev = typeof window !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.search.indexOf('debug=1') !== -1);

const scriptsCache = new Map<string, { promise: Promise<HTMLScriptElement | null>; script?: HTMLScriptElement }>();
const widgetsMap = new Map<HTMLElement, { key: string; script?: HTMLScriptElement; cleanup?: () => void; autoDestroy?: boolean }>();

function log(...args: any[]) {
  if (isDev) console.log('[DynamicLoader]', ...args);
}

function domReady() {
  return new Promise<void>((resolve) => {
    try {
      if (document.readyState !== 'loading') return resolve();
      document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
    } catch (e) {
      resolve();
    }
  });
}

function normalizeUrl(src: string) {
  try {
    return new URL(src, location.href).href;
  } catch (e) {
    return src;
  }
}

async function loadScript(src: string, opts: LoadScriptOptions = {}): Promise<HTMLScriptElement | null> {
  try {
    await domReady();
  } catch (e) {}
  try {
    const full = normalizeUrl(src);
    const key = opts.key || full;
    if (scriptsCache.has(key)) {
      log('script cached', key);
      return scriptsCache.get(key)!.promise;
    }

    // existing script in DOM
    const existing = Array.from(document.querySelectorAll('script[src]')).find((s) => {
      try {
        return normalizeUrl((s as HTMLScriptElement).src) === full;
      } catch (e) {
        return false;
      }
    }) as HTMLScriptElement | undefined;
    if (existing) {
      log('found existing script in DOM', full);
      const p = new Promise<HTMLScriptElement | null>((resolve) => {
        try {
          if (existing.getAttribute('data-dynamic-loader-loaded') === '1' || (existing as any).readyState === 'complete') return resolve(existing);
          existing.addEventListener('load', () => {
            try {
              existing.setAttribute('data-dynamic-loader-loaded', '1');
            } catch (e) {}
            resolve(existing);
          }, { once: true });
          existing.addEventListener('error', () => resolve(null), { once: true });
        } catch (e) {
          resolve(null);
        }
      });
      scriptsCache.set(key, { promise: p, script: existing });
      return p;
    }

    const script = document.createElement('script');
    if (opts.module) script.type = 'module';
    script.async = opts.async !== false;
    if (opts.defer) script.defer = true;
    if (opts.attrs) {
      try { Object.entries(opts.attrs).forEach(([k, v]) => script.setAttribute(k, v)); } catch (e) {}
    }
    script.src = full;
    script.setAttribute('data-dynamic-loader-key', key);

    const promise = new Promise<HTMLScriptElement | null>((resolve) => {
      try {
        let settled = false;
        const done = (el: HTMLScriptElement | null) => { if (settled) return; settled = true; try { clearTimeout(timer); } catch (e) {} resolve(el); };
        const onload = () => { try { script.setAttribute('data-dynamic-loader-loaded', '1'); } catch (e) {} done(script); };
        const onerror = () => { done(null); };
        script.addEventListener('load', onload, { once: true });
        script.addEventListener('error', onerror, { once: true });
        const timer = setTimeout(() => { done(null); }, opts.timeout ?? 12000);
        const insertTarget = (opts.insertTo === 'body' ? document.body : (opts.insertTo instanceof HTMLElement ? opts.insertTo : document.head || document.body));
        try { (insertTarget || document.head || document.body).appendChild(script); } catch (e) { try { document.head.appendChild(script); } catch (e2) {} }
      } catch (e) {
        resolve(null);
      }
    });

    scriptsCache.set(key, { promise, script });
    return promise;
  } catch (err) {
    if (isDev) console.error('[DynamicLoader] loadScript error', err);
    return null;
  }
}

async function loadWidget(
  container: string | HTMLElement,
  scriptUrl: string,
  config?: any,
  callback?: (ok: boolean) => void,
  opts?: { appendToContainer?: boolean; key?: string; timeout?: number; autoDestroyOnNavigate?: boolean; attrs?: Record<string, string> }
): Promise<boolean> {
  try {
    await domReady();
  } catch (e) {}
  try {
    const el = typeof container === 'string' ? (document.querySelector(container) as HTMLElement) : (container as HTMLElement);
    if (!el) {
      if (isDev) console.warn('[DynamicLoader] container not found', container);
      if (callback) callback(false);
      return false;
    }

    if (widgetsMap.has(el)) {
      log('widget already registered for container');
      if (callback) callback(true);
      return true;
    }

    const normalized = normalizeUrl(scriptUrl);
    const key = opts?.key || normalized;

    const existingInContainer = Array.from(el.querySelectorAll('script[src]')).find((s) => {
      try { return normalizeUrl((s as HTMLScriptElement).src) === normalized || s.getAttribute('data-dynamic-loader-key') === key; } catch (e) { return false; }
    }) as HTMLScriptElement | undefined;
    if (existingInContainer) {
      try { el.dataset.dynamicLoaderLoaded = '1'; el.classList.add('is-loaded'); el.classList.remove('is-loading'); } catch (e) {}
      widgetsMap.set(el, { key, script: existingInContainer, autoDestroy: !!opts?.autoDestroyOnNavigate });
      if (callback) callback(true);
      return true;
    }

    try { el.classList.add('is-loading'); } catch (e) {}

    if (opts?.appendToContainer !== false) {
      const script = document.createElement('script');
      script.async = true;
      if (opts?.attrs) { try { Object.entries(opts.attrs).forEach(([k, v]) => script.setAttribute(k, v)); } catch (e) {} }
      script.src = scriptUrl;
      script.setAttribute('data-dynamic-loader-widget', '1');
      script.setAttribute('data-dynamic-loader-key', key);
      if (config && typeof config === 'object') {
        try { el.dataset.dynamicLoaderConfig = JSON.stringify(config); } catch (e) {}
      }

      const promise = new Promise<boolean>((resolve) => {
        let settled = false;
        const onLoad = () => {
          if (settled) return; settled = true; try { el.dataset.dynamicLoaderLoaded = '1'; el.classList.remove('is-loading'); el.classList.add('is-loaded'); } catch (e) {}
          resolve(true); if (callback) callback(true);
        };
        const onError = () => {
          if (settled) return; settled = true; try { el.classList.remove('is-loading'); el.classList.add('has-error'); } catch (e) {}
          resolve(false); if (callback) callback(false);
        };
        script.addEventListener('load', onLoad, { once: true });
        script.addEventListener('error', onError, { once: true });
        const to = setTimeout(() => { if (settled) return; settled = true; try { el.classList.remove('is-loading'); el.classList.add('has-error'); } catch (e) {} resolve(false); if (callback) callback(false); }, opts?.timeout ?? 12000);
        script.addEventListener('load', () => clearTimeout(to), { once: true });
        script.addEventListener('error', () => clearTimeout(to), { once: true });
      });

      try { el.appendChild(script); } catch (e) { try { document.body.appendChild(script); } catch (e2) {} }
      widgetsMap.set(el, { key, script, cleanup: () => { try { script.remove(); delete el.dataset.dynamicLoaderLoaded; delete el.dataset.dynamicLoaderConfig; el.classList.remove('is-loading','is-loaded','has-error'); } catch (e) {} }, autoDestroy: !!opts?.autoDestroyOnNavigate });
      return promise;
    } else {
      const scriptEl = await loadScript(scriptUrl, { key, timeout: opts?.timeout, attrs: opts?.attrs });
      if (scriptEl) {
        try { el.dataset.dynamicLoaderLoaded = '1'; el.classList.remove('is-loading'); el.classList.add('is-loaded'); } catch (e) {}
        widgetsMap.set(el, { key, script: scriptEl, cleanup: () => { /* do not remove shared head scripts by default */ }, autoDestroy: !!opts?.autoDestroyOnNavigate });
        if (callback) callback(true);
        return true;
      } else {
        try { el.classList.remove('is-loading'); el.classList.add('has-error'); } catch (e) {}
        if (callback) callback(false);
        return false;
      }
    }
  } catch (err) {
    if (isDev) console.error('[DynamicLoader] loadWidget exception', err);
    try { if (callback) callback(false); } catch (e) {}
    return false;
  }
}

function destroyWidget(container: string | HTMLElement) {
  try {
    const el = typeof container === 'string' ? (document.querySelector(container) as HTMLElement) : (container as HTMLElement);
    if (!el) return false;
    const info = widgetsMap.get(el);
    if (!info) {
      const scripts = Array.from(el.querySelectorAll('script[data-dynamic-loader-widget]'));
      scripts.forEach(s => { try { s.remove(); } catch (e) {} });
      try { el.classList.remove('is-loading','is-loaded','has-error'); delete el.dataset.dynamicLoaderLoaded; delete el.dataset.dynamicLoaderConfig; } catch (e) {}
      return true;
    }
    try { if (info.cleanup) info.cleanup(); } catch (e) {}
    widgetsMap.delete(el);
    return true;
  } catch (err) {
    if (isDev) console.error('[DynamicLoader] destroyWidget error', err);
    return false;
  }
}

function isLoaded(target: string | HTMLElement) {
  try {
    if (typeof target === 'string') {
      const normalized = normalizeUrl(target);
      if (scriptsCache.has(normalized)) {
        const rec = scriptsCache.get(normalized)!;
        if (rec.script && rec.script.getAttribute('data-dynamic-loader-loaded') === '1') return true;
      }
      const found = Array.from(document.querySelectorAll('script[src]')).some(s => {
        try { return normalizeUrl((s as HTMLScriptElement).src) === normalized && ((s as HTMLScriptElement).getAttribute('data-dynamic-loader-loaded') === '1' || (s as any).readyState === 'complete'); } catch (e) { return false; }
      });
      return found;
    } else {
      const el = target as HTMLElement;
      return !!(el.dataset && el.dataset.dynamicLoaderLoaded === '1');
    }
  } catch (e) {
    if (isDev) console.error('[DynamicLoader] isLoaded error', e);
    return false;
  }
}

// SPA navigation support: patch history methods (idempotent) and cleanup widgets marked autoDestroy
try {
  if (typeof window !== 'undefined' && !(window as any).__dynamicLoaderHistoryPatched) {
    (function () {
      const origPush = (history.pushState as any);
      const origReplace = (history.replaceState as any);
      (history as any).pushState = function (...args: any[]) { const res = origPush.apply(history, args as any); try { window.dispatchEvent(new CustomEvent('dynamicloader:navigation')); } catch (e) {} return res; };
      (history as any).replaceState = function (...args: any[]) { const res = origReplace.apply(history, args as any); try { window.dispatchEvent(new CustomEvent('dynamicloader:navigation')); } catch (e) {} return res; };
      window.addEventListener('popstate', () => { try { window.dispatchEvent(new CustomEvent('dynamicloader:navigation')); } catch (e) {} });
      (window as any).__dynamicLoaderHistoryPatched = true;
    })();

    window.addEventListener('dynamicloader:navigation', () => {
      try {
        widgetsMap.forEach((info, el) => {
          try { if (info.autoDestroy) destroyWidget(el); } catch (e) {}
        });
      } catch (e) {}
    });
  }
} catch (e) {}

const DynamicLoader = {
  loadScript,
  loadWidget,
  destroyWidget,
  isLoaded,
  // internal helpers for debug/testing (not documented for consumers)
  _internal: { scriptsCache, widgetsMap } as any,
};

try { if (typeof window !== 'undefined') (window as any).DynamicLoader = DynamicLoader; } catch (e) {}

export default DynamicLoader;
