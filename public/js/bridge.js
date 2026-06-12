/*
 * myBridge - PostMessage communication bridge
 * - Isolado: não altera código existente
 * - Idempotente: evita múltiplas inicializações
 * - Seguro: aceita apenas mensagens do mesmo window e com tipo esperado
 * - Funções expostas: disableAlerts, restoreAlerts, getWindowVar, adRendered, showLoader, hideLoader
 * - Garante que `window.dispatchAdRendered()` exista (não sobrescreve comportamento anterior)
 *
 * Como usar (exemplo):
 * window.postMessage({ type: 'myBridgeRequest', requestId: 'id-1', action: 'getWindowVar', payload: { path: 'navigator.userAgent' } }, '*');
 * window.addEventListener('message', e => { if (e.data && e.data.type === 'myBridgeResponse') console.log(e.data); });
 */

(function () {
  'use strict';

  // Previna dupla execução
  try {
    if (typeof window === 'undefined') return;
    if (window.__bridgeInitialized) return;
    window.__bridgeInitialized = true;
  } catch (e) {
    return;
  }

  // Config
  var REQ_TYPE = 'myBridgeRequest';
  var RES_TYPE = 'myBridgeResponse';
  var ALLOWED = { disableAlerts: 1, restoreAlerts: 1, getWindowVar: 1, adRendered: 1, showLoader: 1, hideLoader: 1 };

  // Ambiente de debug (opcional, não obrigatório em produção)
  var isDev = (function () {
    try {
      return (location && (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.search.indexOf('debug=1') !== -1));
    } catch (e) { return false; }
  })();

  function dbg() {
    if (!isDev) return; try { console.debug.apply(console, ['[myBridge]'].concat(Array.prototype.slice.call(arguments))); } catch (e) {}
  }

  // Guardar referências originais (não sobrescrever se já existirem)
  var _origAlert = window.alert;
  var _origConfirm = window.confirm;
  var _origPrompt = window.prompt;
  var _alertsDisabled = false;

  // Desativa alert/confirm/prompt (retorna true se alterou)
  function disableAlerts() {
    try {
      if (_alertsDisabled) return false;
      try { window.alert = function () {}; } catch (e) {}
      try { window.confirm = function () { return false; }; } catch (e) {}
      try { window.prompt = function () { return null; }; } catch (e) {}
      _alertsDisabled = true;
      dbg('alerts disabled');
      return true;
    } catch (e) {
      return false;
    }
  }

  // Restaura alert/confirm/prompt (retorna true se alterou)
  function restoreAlerts() {
    try {
      if (!_alertsDisabled) return false;
      try { if (typeof _origAlert === 'function') window.alert = _origAlert; } catch (e) {}
      try { if (typeof _origConfirm === 'function') window.confirm = _origConfirm; } catch (e) {}
      try { if (typeof _origPrompt === 'function') window.prompt = _origPrompt; } catch (e) {}
      _alertsDisabled = false;
      dbg('alerts restored');
      return true;
    } catch (e) {
      return false;
    }
  }

  // Serialização segura e leve de valores retornados
  function _serialize(v) {
    try {
      if (v === undefined) return { type: 'undefined', value: null };
      if (v === null) return { type: 'null', value: null };
      var t = typeof v;
      if (t === 'string' || t === 'number' || t === 'boolean') return { type: t, value: v };
      if (t === 'function') return { type: 'function', value: v.name || '[Function]' };
      // tentativa de cópia estruturada (segura) -> fallback para JSON
      if (typeof structuredClone === 'function') {
        try { return { type: 'object', value: structuredClone(v) }; } catch (e) { /* fallback */ }
      }
      try { return { type: 'object', value: JSON.parse(JSON.stringify(v)) }; } catch (e) { return { type: 'object', value: String(v) }; }
    } catch (e) {
      return { type: 'error', value: String(e) };
    }
  }

  // Leitura segura de variáveis do window por caminho: 'navigator.userAgent'
  function getWindowVar(path) {
    if (!path || typeof path !== 'string') return { ok: false, error: 'invalid path' };
    var parts = path.split('.');
    var cur = window;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      // valida segmento para evitar acesso a prototype/constructor
      if (!/^[a-zA-Z_$][\w$-]*$/.test(part)) return { ok: false, error: 'invalid path segment' };
      if (part === '__proto__' || part === 'constructor' || part === 'prototype') return { ok: false, error: 'forbidden path' };
      try { cur = cur[part]; } catch (e) { return { ok: false, error: 'access denied' }; }
      if (typeof cur === 'undefined') return { ok: true, value: undefined, serialized: { type: 'undefined', value: null } };
    }
    return { ok: true, value: cur, serialized: _serialize(cur) };
  }

  // Heurísticas leves para localizar possíveis elementos de loader na página
  function _findLoaderElements() {
    try {
      var sels = ['[data-ad-loader]', '[data-loader]', '[data-tu-loader]', '[data-start-ads-loader]', '.ads-loader', '.loader', '#loader', '#ads-loader'];
      var out = [];
      for (var i = 0; i < sels.length; i++) {
        try {
          var nodes = document.querySelectorAll(sels[i]);
          if (nodes && nodes.length) {
            for (var j = 0; j < nodes.length; j++) out.push(nodes[j]);
          }
        } catch (e) { /* ignore selector errors */ }
      }
      return out;
    } catch (e) { return []; }
  }

  // Esconde loader imediatamente (usa classe 'hidden' ou style.display = 'none')
  function hideLoader() {
    try {
      var els = _findLoaderElements();
      if (els.length) {
        for (var i = 0; i < els.length; i++) {
          try { if (els[i].classList) els[i].classList.add('hidden'); } catch (e) {}
          try { if (els[i].style) els[i].style.display = 'none'; } catch (e) {}
        }
        return true;
      }
      // fallback leve: procura por overlays comuns
      var alt = document.querySelector('.ads-overlay, .ads-overlay--loader, [data-loader-overlay]');
      if (alt) {
        try { if (alt.classList) alt.classList.add('hidden'); } catch (e) {}
        try { if (alt.style) alt.style.display = 'none'; } catch (e) {}
        return true;
      }
      return false;
    } catch (e) { return false; }
  }

  // Mostra o loader (remove hidden / restaura display)
  function showLoader() {
    try {
      var els = _findLoaderElements();
      if (els.length) {
        for (var i = 0; i < els.length; i++) {
          try { if (els[i].classList) els[i].classList.remove('hidden'); } catch (e) {}
          try { if (els[i].style) els[i].style.display = ''; } catch (e) {}
        }
        return true;
      }
      return false;
    } catch (e) { return false; }
  }

  // Quando anúncios renderizam: remove loader imediatamente, tenta chamar global existente e dispara evento
  function _onAdRendered(payload) {
    try { hideLoader(); } catch (e) {}
    // chama função global antiga de remoção do loader se existir (compat)
    try { if (typeof window.__removeAdsLoader === 'function') { try { window.__removeAdsLoader(); } catch (e) {} } } catch (e) {}
    // marca body e dispara evento
    try { if (document.body && document.body.classList) document.body.classList.add('ads-loaded'); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('adsRendered', { detail: payload })); } catch (e) {}
  }

  // Responder via postMessage de forma controlada
  function _postResponse(requestId, ok, data) {
    try {
      window.postMessage({ type: RES_TYPE, requestId: requestId, ok: !!ok, data: data }, '*');
    } catch (e) {
      if (isDev) console.error('[myBridge] postResponse error', e);
    }
  }

  // Handler principal de mensagens
  function _onMessage(e) {
    try {
      if (!e || !e.data || typeof e.data !== 'object') return;
      // aceitar apenas mensagens postadas pelo mesmo window (evita iframes/cross-origin)
      if (e.source !== window) return;
      if (e.data.type !== REQ_TYPE) return;
      var req = e.data || {};
      var requestId = req.requestId;
      var action = req.action;
      var payload = req.payload;
      if (!requestId || typeof requestId !== 'string') return _postResponse(null, false, { error: 'missing requestId' });
      if (!ALLOWED[action]) return _postResponse(requestId, false, { error: 'action not allowed' });
      dbg('request', action, payload);
      switch (action) {
        case 'disableAlerts':
          _postResponse(requestId, true, { result: disableAlerts() });
          break;
        case 'restoreAlerts':
          _postResponse(requestId, true, { result: restoreAlerts() });
          break;
        case 'getWindowVar':
          var r = getWindowVar(payload && payload.path);
          if (r.ok) _postResponse(requestId, true, { value: r.serialized.value, type: r.serialized.type });
          else _postResponse(requestId, false, { error: r.error });
          break;
        case 'adRendered':
          try { _onAdRendered(payload); } catch (e) {}
          _postResponse(requestId, true, {});
          break;
        case 'showLoader':
          _postResponse(requestId, true, { result: showLoader() });
          break;
        case 'hideLoader':
          _postResponse(requestId, true, { result: hideLoader() });
          break;
        default:
          _postResponse(requestId, false, { error: 'unknown action' });
      }
    } catch (err) {
      try { var rid = (e && e.data && e.data.requestId) || null; _postResponse(rid, false, { error: String(err) }); } catch (ee) {}
    }
  }

  // Registrar listener uma única vez
  try { window.addEventListener('message', _onMessage, false); } catch (e) { /* ignore */ }

  // Expor função global solicitada: window.dispatchAdRendered()
  try {
    var _prev = window.dispatchAdRendered;
    window.dispatchAdRendered = function (payload) {
      try { _onAdRendered(payload); } catch (e) { /* ignore */ }
      try { if (typeof _prev === 'function') { try { _prev(payload); } catch (e) {} } } catch (e) {}
    };
  } catch (e) { /* ignore */ }

  // Expor API leve em window.myBridge para chamadas diretas se desejado
  try {
    window.myBridge = window.myBridge || {};
    window.myBridge.disableAlerts = disableAlerts;
    window.myBridge.restoreAlerts = restoreAlerts;
    window.myBridge.getWindowVar = function (p) { var r = getWindowVar(p); return r.ok ? r.serialized.value : null; };
    window.myBridge.adRendered = function (p) { try { _onAdRendered(p); } catch (e) {} };
    window.myBridge.showLoader = showLoader;
    window.myBridge.hideLoader = hideLoader;
  } catch (e) { /* ignore */ }

  // Limpeza leve (caso necessário): remove listener e referências
  try {
    window.myBridge._cleanup = function () {
      try { window.removeEventListener('message', _onMessage, false); } catch (e) {}
      try { delete window.myBridge; } catch (e) {}
      try { delete window.dispatchAdRendered; } catch (e) {}
      try { window.__bridgeInitialized = false; } catch (e) {}
    };
  } catch (e) { /* ignore */ }

  dbg('myBridge initialized');

})();
