// Loader script (copiado da versão embutida em index.html)
(function(){

	// Show loader in production OR when developer forces it via ?showloader=1 or localStorage
	try {
		var STATE_KEY = '__tucreditoLoaderState_v1';

		function getState(){
			if(!window[STATE_KEY]){
				window[STATE_KEY] = {
					active: false,
					removed: true,
					observer: null,
					interval: null,
					loader: null,
					startTime: 0,
					timeouts: [],
					removeLoader: null
				};
			}
			return window[STATE_KEY];
		}

		function createLoaderElement(label){
			var loader = document.createElement('div');
			loader.className = 'loader loader--show';
			loader.style.zIndex = '2147483647';
			loader.innerHTML = '<div class="loader__bar"></div><div class="loader__pop"><div class="loader__spin"></div></div><div class="loader__bottom"><div class="loader__badge"><span class="loader__badge-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18"><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.7 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z" fill="#7ddc82"/><path d="M256 0V464c-8.3 0-16.7-2-24.2-5.9C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z" fill="#51B755"/></svg></span><span class="loader__label">'+(function(){var _seg=location.pathname.split('/')[1];var _lang=['pt','en','fr'].indexOf(_seg)!==-1?_seg:'es';var _labels={es:'Cargando',pt:'Carregando',en:'Loading',fr:'Chargement'};return _labels[_lang];})()+'<span class="loader__dots"><span>.</span><span>.</span><span>.</span></span></span></div></div>';
			return loader;
		}

		function ensureStyles(){
			if(document.getElementById('tucredito-loader-styles')) return;
			var style = document.createElement('style');
			style.id = 'tucredito-loader-styles';
			style.innerHTML = `
.loader{
position:fixed;
top:0;left:0;right:0;bottom:0;
background:rgba(255,255,255,0.92);
transform:translateZ(0);
-webkit-transform:translateZ(0);
display:flex;
align-items:center;
justify-content:center;
transition:opacity .4s ease,visibility .4s ease;
}

@supports (backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px)){
.loader{
background:rgba(255,255,255,0.45);
backdrop-filter:blur(14px);
-webkit-backdrop-filter:blur(14px);
}
}

.loader:not(.loader--show){
opacity:0;
visibility:hidden;
pointer-events:none;
}

	.loader__pop{
	display:flex;
	flex-direction:column;
	align-items:center;
	gap:14px;
	}

.loader__spin{
width:54px;
height:54px;
border-radius:50%;
border:7px solid rgba(81,183,85,0.15);
border-top-color:#51B755;
animation:_lspin 2.2s linear infinite;
}

.loader__text{
margin:0;
font-family:system-ui,-apple-system,sans-serif;
font-size:12px;
font-weight:600;
letter-spacing:.18em;
text-transform:uppercase;
color:rgba(81,183,85,0.7);
}

.loader__bar{position:absolute;top:0;left:0;right:0;height:5px;background:rgba(81,183,85,0.2);overflow:hidden}
.loader__bar::after{content:'';position:absolute;top:0;left:-40%;width:50%;height:100%;background:linear-gradient(90deg,transparent,#51B755 50%,transparent);animation:_lbar 1s linear infinite}
.loader__bottom{position:absolute;bottom:48px;left:0;right:0;display:flex;justify-content:center}
.loader__badge{display:inline-flex;align-items:center;gap:9px;background:linear-gradient(135deg,#51B755 0%,#3a9c3e 100%);border-radius:14px;padding:9px 16px 9px 9px;box-shadow:0 6px 24px rgba(58,156,62,0.38),0 2px 6px rgba(0,0,0,0.10);color:#fff;font-family:system-ui,-apple-system,sans-serif;font-size:13px;font-weight:800;letter-spacing:.03em}
.loader__badge-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:7px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.10);flex-shrink:0}
.loader__label{display:inline-flex;align-items:baseline;gap:1px}
.loader__dots{display:inline;letter-spacing:.05em}
.loader__dots span{opacity:0;animation:_ldot 1.4s infinite}
.loader__dots span:nth-child(2){animation-delay:.2s}
.loader__dots span:nth-child(3){animation-delay:.4s}
@keyframes _lspin{to{transform:rotate(360deg)}}
@keyframes _ldot{0%,80%,100%{opacity:0}40%{opacity:1}}
@keyframes _lbar{0%{left:-40%}100%{left:110%}}
/* removed initial pop animation */
`;
			document.head.appendChild(style);
		}

		function startLoader(){
			var state = getState();

			// rotas permitidas
			if(!location.pathname.includes('/p/') && !location.pathname.includes('/l/') && !location.pathname.includes('/m/')){
				return;
			}

			// idioma / label
			var _seg = location.pathname.split('/')[1];
			var _lang = ['pt','en','fr'].indexOf(_seg) !== -1 ? _seg : 'es';
			var _labels = {es:'Cargando',pt:'Carregando',en:'Loading',fr:'Chargement'};
			var _label = _labels[_lang];

			// se já ativo, reusar
			if(state.active && !state.removed){
				state.startTime = Date.now();
				if(state.loader) state.loader.classList.add('loader--show');
				return;
			}

			state.active = true;
			state.removed = false;
			state.startTime = Date.now();

			ensureStyles();

			var loader = document.querySelector('.loader');
			if(!loader){
				loader = createLoaderElement(_label);
				try{ document.body.appendChild(loader); }catch(e){}
			}else{
				loader.classList.add('loader--show');
				var labelSpan = loader.querySelector('.loader__label');
				if(labelSpan) labelSpan.innerHTML = _label + '<span class="loader__dots"><span>.</span><span>.</span><span>.</span></span>';
			}
			state.loader = loader;

			var minTime = 1800;

			function removeLoader(){
				if(state.removed) return;
				var elapsed = Date.now() - state.startTime;
				var wait = Math.max(0, minTime - elapsed);

				// limpar timeouts anteriores
				state.timeouts.forEach(function(t){ clearTimeout(t); });
				state.timeouts = [];

				state.removed = true;

				var t = setTimeout(function(){
					try{ state.loader.classList.remove('loader--show'); }catch(e){}
					var t2 = setTimeout(function(){ try{ if(state.loader && state.loader.parentNode) state.loader.parentNode.removeChild(state.loader); }catch(e){} },400);
					state.timeouts.push(t2);
				}, wait);
				state.timeouts.push(t);

				if(state.interval){ clearInterval(state.interval); state.interval = null; }
				if(state.observer){ try{ state.observer.disconnect(); }catch(e){} state.observer = null; }
				state.active = false;
			}

			state.removeLoader = removeLoader;

			function checkAds(){
				var ads = document.querySelectorAll('ins.adsbygoogle');
				for(var i=0;i<ads.length;i++){
					var ad = ads[i];
					var iframe = ad.querySelector('iframe');
					if(iframe){
						var h = ad.offsetHeight || 0;
						var w = ad.offsetWidth || 0;
						if(h > 120 && w > 200){
							var t = setTimeout(function(){ removeLoader(); },800);
							state.timeouts.push(t);
							return;
						}
					}
				}

				var adexBlocks = document.querySelectorAll('[joinadscode]');
				for(var j=0;j<adexBlocks.length;j++){
					var block = adexBlocks[j];
					var iframe2 = block.querySelector('iframe');
					var hasContent = iframe2 || (block.children.length > 0 && block.innerHTML.trim() !== '');
					if(hasContent){
						var hh = block.offsetHeight || 0;
						var ww = block.offsetWidth || 0;
						if(hh > 10 && ww > 10){
							var t2 = setTimeout(function(){ removeLoader(); },800);
							state.timeouts.push(t2);
							return;
						}
					}
				}
			}

			function noAdsOnPage(){
				return document.querySelectorAll('ins.adsbygoogle').length === 0 && document.querySelectorAll('[joinadscode]').length === 0;
			}

			if(state.observer){ try{ state.observer.disconnect(); }catch(e){} }
			state.observer = new MutationObserver(function(){ checkAds(); });
			try{ state.observer.observe(document.body, { childList: true, subtree: true }); }catch(e){}

			if(state.interval) clearInterval(state.interval);
			state.interval = setInterval(function(){
				checkAds();
				if(state.removed){ clearInterval(state.interval); state.interval = null; if(state.observer){ try{ state.observer.disconnect(); }catch(e){} state.observer = null; } }
			},700);

			var fb1 = setTimeout(function(){ if(!state.removed && noAdsOnPage()) removeLoader(); },2500);
			state.timeouts.push(fb1);

			var fb2 = setTimeout(function(){ if(!state.removed) removeLoader(); },5000);
			state.timeouts.push(fb2);
		}

		// expor funções globais para SPA
		window.__startAdsLoader = function(){ try{ startLoader(); }catch(e){} };
		window.__removeAdsLoader = function(){ var s = getState(); if(s && typeof s.removeLoader === 'function'){ try{ s.removeLoader(); }catch(e){} } };

		// iniciar automaticamente quando o script for carregado
		if(document.readyState === 'loading'){
			document.addEventListener('DOMContentLoaded', function(){ try{ startLoader(); }catch(e){} });
		}else{
			try{ startLoader(); }catch(e){}
		}

	} catch (e) {
		// ignore
	}

})();
