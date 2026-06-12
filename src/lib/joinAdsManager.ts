/*
  joinAdsManager.ts
  Robust Join Ads manager for SPA + lazy loading + cleanup
*/

const LOG = '[AdUnit]';

declare global {
  interface Window {
    myadInit?: () => void;
    joinads?: { reload?: () => void } & Record<string, any>;
    __startAdsLoader?: () => void;
    __removeAdsLoader?: () => void;
  }
}

export function ensureLoaderScript(timeoutMs = 1500): Promise<void> {
  return new Promise((resolve) => {
    try {
      if ((window as any).__startAdsLoader) {
        try { (window as any).__startAdsLoader(); } catch (e) {}
        try { setTimeout(() => { try { (window as any).__removeAdsLoader && (window as any).__removeAdsLoader(); } catch (e) {} }, 5000); } catch (e) {}
        return resolve();
      }
      const existing = document.querySelector('script[data-tu-loader]');
      if (existing) {
        const poll = setInterval(() => {
          if ((window as any).__startAdsLoader) {
            clearInterval(poll);
            return resolve();
          }
        }, 150);
        setTimeout(() => {
          try { clearInterval(poll); } catch (e) {}
          return resolve();
        }, timeoutMs);
        return;
      }

      const s = document.createElement('script');
      s.src = '/js/loader.js';
      s.async = true;
      s.setAttribute('data-tu-loader', '1');
      s.onload = () => {
        try { (window as any).__startAdsLoader && (window as any).__startAdsLoader(); } catch (e) {}
        try { setTimeout(() => { try { (window as any).__removeAdsLoader && (window as any).__removeAdsLoader(); } catch (e) {} }, 5000); } catch (e) {}
        setTimeout(() => resolve(), 120);
      };
      s.onerror = () => resolve();
      document.body.appendChild(s);
      setTimeout(() => resolve(), timeoutMs);
    } catch (e) {
      resolve();
    }
  });
}

type RenderOpts = {
  scriptSrc?: string;
  adId?: string;
  minHeight?: number;
  timeoutMs?: number;
};

let globalObserver: IntersectionObserver | null = null;

function hasAdContent(el: HTMLElement) {
  try {
    if (el.querySelector('iframe')) return true;
    const children = Array.prototype.slice.call(el.children || []).filter((c: Element) => {
      const t = (c.tagName || '').toUpperCase();
      return t !== 'SCRIPT' && t !== 'LINK' && t !== 'NOSCRIPT' && t !== 'STYLE';
    });
    if (children.length > 0) return true;
    return false;
  } catch (e) {
    return false;
  }
}

function removeOldAdScripts(adId?: string) {
  try {
    const selector = adId ? `script[data-ad-script-id="${adId}"]` : 'script[data-ad-script]';
    document.querySelectorAll(selector).forEach((s) => s.remove());
  } catch (e) {
    // noop
  }
}

export function renderAd(container: HTMLElement, { scriptSrc, adId, minHeight = 40, timeoutMs = 4000 }: RenderOpts = {}) {
  return new Promise<boolean>((resolve) => {
    try {
      if (!container) return resolve(false);
      const key = container.id || adId || `ad-${Math.random().toString(36).slice(2, 8)}`;

      if (container.dataset.loaded === 'true') {
        console.debug(LOG, 'already loaded', key);
        return resolve(true);
      }

      if (container.dataset.rendering === 'true') {
        console.debug(LOG, 'already rendering, will wait', key);
        const waitObs = new MutationObserver(() => {
          if (hasAdContent(container) || container.dataset.loaded === 'true') {
            waitObs.disconnect();
            resolve(true);
          }
        });
        waitObs.observe(container, { childList: true, subtree: true });
        setTimeout(() => {
          try { waitObs.disconnect(); } catch (e) {}
          resolve(container.dataset.loaded === 'true');
        }, timeoutMs + 200);
        return;
      }

      console.info(LOG, 'renderAd start', key, scriptSrc);
      container.dataset.rendering = 'true';
      container.dataset.loaded = 'false';
      // remove any CSS-targeted attribute to avoid premature layout reservation
      try { container.removeAttribute('data-min-height'); } catch (e) {}
      container.innerHTML = '';
      // Reserve minHeight for the ad so the ad script can detect sizing if needed
      try { container.style.minHeight = `${minHeight}px`; } catch (e) {}
      try { if (container.parentElement) container.parentElement.style.minHeight = `${minHeight}px`; } catch (e) {}
      try {
        // ensure we record the requested minHeight so callers and CSS can
        // access it without relying on `data-min-height` (which we avoid)
        if (!container.dataset.initMinHeight) container.dataset.initMinHeight = String(minHeight);
      } catch (e) {}

      removeOldAdScripts(adId);

      const src = (scriptSrc || container.dataset.scriptSrc || '').trim();
      if (!src) {
        console.warn(LOG, 'no scriptSrc for', key);
      }

      // Ensure loader script exists (idempotent) — trigger but don't block
      try { ensureLoaderScript(800).catch(() => {}); } catch (e) {}

      const srcWithTs = src ? `${src}${src.includes('?') ? '&' : '?'}_=${Date.now()}` : `about:blank`;

      // ensure joinadscode and sizes attributes exist (some providers scan for them)
      try {
        if (!container.getAttribute('joinadscode')) {
          const joinCode = container.id || key;
          container.setAttribute('joinadscode', `${joinCode.charAt(0).toUpperCase()}${joinCode.slice(1)}`);
        }
        if (!container.getAttribute('sizes')) container.setAttribute('sizes', '[300,250], [336,280], [\'fluid\']');
      } catch (e) {}

      // preload script as the CMS does, if not already present
      try {
        if (src) {
          const linkSelector = `link[rel="preload"][href="${src}"]`;
          if (!document.querySelector(linkSelector)) {
            const l = document.createElement('link');
            l.rel = 'preload';
            l.href = src;
            l.as = 'script';
            l.crossOrigin = 'anonymous';
            (document.head || document.getElementsByTagName('head')[0]).appendChild(l);
          }
        }
      } catch (e) {}

      // Ensure module script is present and loaded before injecting per-slot script
      // Some provider code assumes analytics/gpt globals exist — ensure them to avoid TypeError
      try {
        if (typeof window !== 'undefined') {
          try { (window as any).dataLayer = (window as any).dataLayer || []; } catch (e) {}
          // preserve existing googletag but ensure cmd is an array to avoid TypeError in provider
          if (!(window as any).googletag || !Array.isArray((window as any).googletag.cmd)) {
            (window as any).googletag = (window as any).googletag || {};
            (window as any).googletag.cmd = (window as any).googletag.cmd || [];
          }
        }
      } catch (e) {}
      try {
        let moduleScript = Array.prototype.slice.call(document.querySelectorAll('script[type="module"][src]')).find((s: any) => s.src && s.src.indexOf(src) !== -1);
        let moduleLoaded = false;
        const ensureModule = new Promise((moduleResolve) => {
          try {
            if (!moduleScript) {
              moduleScript = document.createElement('script');
              moduleScript.type = 'module';
              moduleScript.async = true;
              moduleScript.crossOrigin = 'anonymous';
              moduleScript.src = src;
              moduleScript.addEventListener('load', () => { moduleLoaded = true; moduleResolve(true); });
              moduleScript.addEventListener('error', () => { moduleResolve(false); });
              (document.head || document.getElementsByTagName('head')[0] || document.body).appendChild(moduleScript);
              // fallback resolve in 1200ms in case load doesn't fire
              setTimeout(() => { if (!moduleLoaded) moduleResolve(true); }, 1200);
            } else {
              // if already present, assume it's loaded or will be soon
              moduleScript.addEventListener('load', () => { moduleLoaded = true; moduleResolve(true); });
              setTimeout(() => { moduleResolve(true); }, 400);
            }
          } catch (e) { moduleResolve(false); }
        });

        // after module is ensured (loaded or fallback), prefer calling provider init
        ensureModule.then(() => {
          try {
            // If the provider exposed a global wrapper with init(), call it to scan DOM
            try {
              if (window && (window as any).wrapper && typeof (window as any).wrapper.init === 'function') {
                try { (window as any).wrapper.init(); } catch (e) {}
                return;
              }
            } catch (e) {}

            // If provider uses a global joinads with reload(), call that
            try {
              if (window && (window as any).joinads && typeof (window as any).joinads.reload === 'function') {
                try { (window as any).joinads.reload(); } catch (e) {}
                return;
              }
            } catch (e) {}

            // Fallback: append per-slot script into the container to trigger provider behavior
            try {
              const containerScript = document.createElement('script');
              containerScript.async = true;
              containerScript.dataset.adScript = 'true';
              containerScript.dataset.adScriptId = key;
              containerScript.src = srcWithTs;
              containerScript.addEventListener('error', () => {
                console.warn(LOG, 'script error', key, containerScript.src);
                collapseOnFail('error');
              });
              containerScript.addEventListener('load', () => {
                console.info(LOG, 'script loaded', key, containerScript.src);
              });
              container.appendChild(containerScript);
            } catch (e) {
              try { container.appendChild(document.createElement('script')); } catch (e2) {}
            }
          } catch (e) {}
        }).catch(() => {
          try {
            const fallback = document.createElement('script');
            fallback.async = true;
            fallback.dataset.adScript = 'true';
            fallback.dataset.adScriptId = key;
            fallback.src = srcWithTs;
            fallback.addEventListener('error', () => { collapseOnFail('error'); });
            container.appendChild(fallback);
          } catch (e) {}
        });
      } catch (e) {
        // final fallback: append script into container
        try {
          const fallback = document.createElement('script');
          fallback.async = true;
          fallback.dataset.adScript = 'true';
          fallback.dataset.adScriptId = key;
          fallback.src = srcWithTs;
          fallback.addEventListener('error', () => { collapseOnFail('error'); });
          container.appendChild(fallback);
        } catch (e) {}
      }

      // Attach handlers and collapse quickly on immediate script error
      let settled = false;
      const collapseOnFail = (reason?: string) => {
        if (settled) return;
        settled = true;
        try { if (reason) console.debug(LOG, 'collapseOnFail reason:', reason); } catch (e) {}
        try {
          removeOldAdScripts(key);
        } catch (e) {}
        try {
          container.style.minHeight = '0px';
          container.style.height = '0px';
          container.style.display = 'none';
          if (container.parentElement) {
            container.parentElement.style.minHeight = '0px';
            container.parentElement.style.height = '0px';
          }
          container.dataset.rendering = 'false';
          container.dataset.loaded = 'false';
        } catch (e) {}
      };

      // previously appended to container; now appended to head (or fallback above)

      const mo = new MutationObserver(() => {
        if (hasAdContent(container)) {
          try {
            // mark as loaded and reveal
            container.dataset.loaded = 'true';
            container.dataset.rendering = 'false';
            // reveal the ad slot (remove inline collapse styles)
            try { container.style.display = ''; } catch (e) {}
            try { container.style.minHeight = ''; container.style.height = ''; } catch (e) {}
            if (container.parentElement) {
              try { container.parentElement.style.minHeight = ''; container.parentElement.style.height = ''; } catch (e) {}
            }
            mo.disconnect();
            settled = true;
            try { clearTimeout(timeout); } catch (e) {}
            console.info(LOG, 'ad loaded', key);
            return resolve(true);
          } catch (e) {
            // ignore
          }
        }
      });

      mo.observe(container, { childList: true, subtree: true });

      // allow a longer timeout for known external providers that may take longer to render
      let effectiveTimeout = timeoutMs;
      try { if (src && src.indexOf('joinads.me') !== -1) effectiveTimeout = Math.max(timeoutMs, 10000); } catch (e) {}

      const timeout = window.setTimeout(() => {
        try {
          mo.disconnect();
          if (!hasAdContent(container)) {
            collapseOnFail('timeout');
            console.warn(LOG, 'ad failed to render, collapsed', key);
            return resolve(false);
          }
          if (!settled) settled = true;
          resolve(true);
        } catch (e) {
          resolve(false);
        }
      }, effectiveTimeout);

    } catch (err) {
      console.error(LOG, 'renderAd exception', err);
      try { resolve(false); } catch (e) {}
    }
  });
}

export function initJoinAds({ selector = '.ad-slot', scriptSrcDefault }: { selector?: string; scriptSrcDefault?: string } = {}) {
  try {
    if ('IntersectionObserver' in window) {
      if (globalObserver) globalObserver.disconnect();
      globalObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              globalObserver?.unobserve(el);
              if (el.dataset.loaded === 'true' || el.dataset.rendering === 'true') return;
              const scriptSrc = el.dataset.scriptSrc || scriptSrcDefault;
              renderAd(el, { scriptSrc, adId: el.id, minHeight: parseInt(el.dataset.minHeight || el.dataset.initMinHeight || '40', 10) });
            }
          });
        },
        { root: null, rootMargin: '0px 0px 400px 0px', threshold: 0.01 },
      );

      document.querySelectorAll(selector).forEach((el) => {
        const e = el as HTMLElement;
        if (e.dataset.loaded === 'true') return;
        try { globalObserver?.observe(e); } catch (e) {}
      });
    } else {
      console.warn(LOG, 'IntersectionObserver not supported — rendering immediately');
      document.querySelectorAll(selector).forEach((el) => {
        const e = el as HTMLElement;
        if (e.dataset.loaded === 'true') return;
        renderAd(e, { scriptSrc: e.dataset.scriptSrc || scriptSrcDefault, adId: e.id });
      });
    }
  } catch (err) {
    console.error(LOG, 'initJoinAds error', err);
  }

  // Cleanup any leftover parent min-height from previous runs
  try {
    document.querySelectorAll(selector).forEach((el) => {
      const e = el as HTMLElement;
      try {
        const p = e.parentElement;
        if (!p) return;
        const st = e.getAttribute('style') || '';
        const empty = e.innerHTML.trim() === '' || /display:\s*none/.test(st) || /min-height:\s*0px/.test(st);
        if (empty) {
          p.style.minHeight = '0px';
          p.style.height = '0px';
        }
      } catch (err) {
        // noop
      }
    });
  } catch (err) {
    // noop
  }

  try {
    window.myadInit = function myadInit() {
      document.querySelectorAll(selector).forEach((el) => {
        const e = el as HTMLElement;
        if (e.dataset.loaded === 'true' || e.dataset.rendering === 'true') return;
        if (globalObserver) globalObserver.observe(e);
      });
    };

    window.joinads = window.joinads || {};
    window.joinads.reload = () => {
      if (typeof window.myadInit === 'function') window.myadInit();
    };
  } catch (e) {
    // ignore
  }
}

export function cleanupJoinAds() {
  try {
    if (globalObserver) {
      globalObserver.disconnect();
      globalObserver = null;
    }
    document.querySelectorAll('script[data-ad-script]').forEach((s) => s.remove());
  } catch (e) {
    // noop
  }
}

type JoinAdsManager = {
  renderAd: typeof renderAd;
  ensureLoaderScript: typeof ensureLoaderScript;
  cleanupJoinAds: typeof cleanupJoinAds;
};

const joinAdsManager: JoinAdsManager = {
  renderAd,
  ensureLoaderScript,
  cleanupJoinAds,
};

export default joinAdsManager;
