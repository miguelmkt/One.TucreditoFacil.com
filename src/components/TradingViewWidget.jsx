import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
        {
          "colorTheme": "light",
          "isTransparent": false,
          "locale": "en",
          "currencies": [
            "EUR",
            "USD",
            "JPY",
            "GBP",
            "CHF",
            "AUD",
            "CAD",
            "NZD",
            "CNY"
          ],
          "backgroundColor": "#ffffff",
          "width": 550,
          "height": 400
        }`;

    if (container.current) {
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container w-full lg:w-[550px] shrink-0" ref={container}>
      <div className="tradingview-widget-container__widget" />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/markets/currencies/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Forex market</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
