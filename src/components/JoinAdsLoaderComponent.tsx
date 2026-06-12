import React, { useEffect, useRef } from 'react';
import { ensureLoaderScript } from '../lib/joinAdsManager';

type Props = {
    enabled?: boolean;
    timeoutSeconds?: number; // seconds
    timeoutHomeSeconds?: number; // seconds
    idDomain?: string | number | undefined;
    loaderColor?: string;
    
    include?: boolean;
    exclude?: boolean;
    urlPatterns?: string; // newline-separated patterns
};

function escapeRegex(s: string) {
    return s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
}

const JoinAdsLoaderComponent: React.FC<Props> = ({
    enabled = true,
    timeoutSeconds = 5,
    timeoutHomeSeconds = 5,
    idDomain,
    loaderColor = '#81d742',
    
    include = false,
    exclude = false,
    urlPatterns = '',
}) => {
    const linkElsRef = useRef<HTMLLinkElement[]>([]);
    
    function urlMatches(patternsText: string) {
        if (!patternsText) return false;
        const currentUrl = (window.location.pathname || '') + (window.location.search || '');
        if (!currentUrl) return false;
        const rules = patternsText.split(/\r\n|\r|\n/).map(r => r.trim()).filter(Boolean);
        for (const rule of rules) {
            const parts = rule.split('*').map(escapeRegex);
            const regex = new RegExp('^' + parts.join('.*') + '$', 'i');
            if (regex.test(currentUrl)) return true;
        }
        return false;
    }

    function shouldDisplayLoader() {
        // Só exibe em rotas de posts/listas: /p/ /l/ /m/
        try {
            const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
            if (!/(?:\/p\/|\/l\/|\/m\/)/.test(pathname)) return false;
        } catch (e) {}

        if (!enabled) return false;
        const matched = urlMatches(urlPatterns);
        if (include) return matched;
        if (exclude) return !matched;
        return true;
    }
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!shouldDisplayLoader()) return;

        // Inject DNS prefetch and preconnect
        const hosts = ['https://pageview.joinads.me', 'https://office.joinads.me', 'https://script.joinads.me'];
        for (const h of hosts) {
            const l1 = document.createElement('link');
            l1.rel = 'dns-prefetch';
            l1.href = h;
            document.head.appendChild(l1);
            linkElsRef.current.push(l1);

            const l2 = document.createElement('link');
            l2.rel = 'preconnect';
            l2.href = h;
            document.head.appendChild(l2);
            linkElsRef.current.push(l2);
        }

        // If idDomain provided, preload the myad script (don't force the module)
        if (idDomain) {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.href = `https://script.joinads.me/myad${idDomain}.js`;
            preload.as = 'script';
            preload.crossOrigin = 'anonymous';
            document.head.appendChild(preload);
            linkElsRef.current.push(preload);
        }

        // Ensure our CSS variable for loader color is set so mapped rules pick it up
        try { document.documentElement.style.setProperty('--joinads-loader-color', loaderColor); } catch (e) {}

        // Use the site's loader script/styles when available
        let timeoutId: number | undefined;
        try {
            ensureLoaderScript(1200).then(() => {
                try { (window as any).__startAdsLoader && (window as any).__startAdsLoader(); } catch (e) {}
            }).catch(() => {});
        } catch (e) {}

        // Observe DOM to adapt Join Ads markup (ids) to site loader classes so styling applies
        const observer = new MutationObserver(() => {
            const el = document.getElementById('joinadsloader__wrapper');
            if (!el) return;
            try {
                el.classList.add('loader','loader--show');
                // ensure bar exists
                if (!el.querySelector('.loader__bar')) {
                    const bar = document.createElement('div'); bar.className = 'loader__bar'; el.insertBefore(bar, el.firstChild);
                }
                const spinner = el.querySelector('#joinadsloader__spinner');
                if (spinner) {
                    spinner.classList.add('loader__spin');
                    // wrap spinner with loader__pop if not present
                    if (!spinner.parentElement || !spinner.parentElement.classList.contains('loader__pop')) {
                        const pop = document.createElement('div'); pop.className = 'loader__pop';
                        spinner.replaceWith(pop); pop.appendChild(spinner);
                    }
                }
                if (!el.querySelector('.loader__bottom')) {
                    const bottom = document.createElement('div'); bottom.className = 'loader__bottom';
                    const badge = document.createElement('div'); badge.className = 'loader__badge';
                    const icon = document.createElement('span'); icon.className = 'loader__badge-icon'; badge.appendChild(icon); bottom.appendChild(badge);
                    el.appendChild(bottom);
                }
            } catch (e) {}
            try { observer.disconnect(); } catch (e) {}
        });
        try { observer.observe(document.body, { childList: true, subtree: true }); } catch (e) {}

        // Fallback: ensure loader removed after timeout
        const isHome = /^\/(?:[a-z]{2})?$/.test(window.location.pathname) || window.location.pathname === '/';
        const finalTimeout = isHome ? timeoutHomeSeconds * 1000 : timeoutSeconds * 1000;
        timeoutId = window.setTimeout(() => {
            try { (window as any).__removeAdsLoader && (window as any).__removeAdsLoader(); } catch (e) {}
        }, finalTimeout + 200);

        return () => {
            try {
                linkElsRef.current.forEach(l => l.remove());
                linkElsRef.current = [];
            } catch (e) {}
            if (timeoutId) clearTimeout(timeoutId);
            try { (window as any).__removeAdsLoader && (window as any).__removeAdsLoader(); } catch (e) {}
            try { observer.disconnect(); } catch (e) {}
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Loader DOM & style are provided by /js/loader.js; component renders nothing.
    return null;
};

export default JoinAdsLoaderComponent;