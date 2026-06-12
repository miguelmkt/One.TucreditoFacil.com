// adsenseSpa.ts
// Solução robusta para recarregar anúncios AdSense em SPA (React/Vite)

let lastUrl = '';
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let listenersAttached = false;

export function reloadAdsSafely({ debounceMs = 350, minAdHeight = 40, skeleton = false } = {}) {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    try {
      if (!window.adsbygoogle || !Array.isArray(window.adsbygoogle)) return;

      const ads = document.querySelectorAll('ins.adsbygoogle');
      ads.forEach((ad) => {
        const adElement = ad as HTMLElement; // Conversão explícita para HTMLElement
        setTimeout(() => {
          const parent = adElement.parentElement;
          if (!adElement.querySelector('iframe')) {
            adElement.style.minHeight = '0px';
            adElement.style.height = '0px';
            if (parent && parent.classList.contains('ad-inner')) {
              parent.style.minHeight = '0px';
              parent.style.height = '0px';
            }
            if (skeleton && parent) parent.classList.add('ad-skeleton');
          }
        }, 500);
      });

      if (!listenersAttached) {
        listenersAttached = true;
        window.addEventListener('popstate', onRouteChange);
        window.addEventListener('spa-navigate', onRouteChange);
      }

      // Atualizar URL para evitar reutilização incorreta
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        console.log('URL alterada, recarregando anúncios');
      }
    } catch (error) {
      console.error('Erro ao recarregar anúncios:', error);
    }
  }, debounceMs);

  if (!listenersAttached) {
    listenersAttached = true;
    window.addEventListener('popstate', () => reloadAdsSafely({ debounceMs, minAdHeight, skeleton }));
  }
}

function onRouteChange() {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    reloadAdsSafely();
  }
}

export function attachAdSenseSpaListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  // Monkey patch pushState/replaceState
  const origPush = history.pushState;
  const origReplace = history.replaceState;
  history.pushState = function (...args) {
    origPush.apply(this, args);
    window.dispatchEvent(new Event('spa-navigate'));
  };
  history.replaceState = function (...args) {
    origReplace.apply(this, args);
    window.dispatchEvent(new Event('spa-navigate'));
  };
  window.addEventListener('popstate', onRouteChange);
  window.addEventListener('spa-navigate', onRouteChange);
  // Primeira chamada
  lastUrl = window.location.href;
}
