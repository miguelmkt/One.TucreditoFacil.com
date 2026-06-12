import React, { useEffect, useRef, useState } from 'react';

interface JoinAdBlockProps {
  adId: string;
  scriptSrc: string;
  minHeight?: number;
  className?: string;
}

const getUniqueKey = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const JoinAdBlock: React.FC<JoinAdBlockProps> = ({
  adId,
  scriptSrc,
  minHeight = 120,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);
  const [key, setKey] = useState(() => getUniqueKey());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    setKey(getUniqueKey());
    setVisible(true);
    // eslint-disable-next-line
  }, [adId]);

  useEffect(() => {
    let destroyed = false;
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    container.style.display = '';
    container.style.minHeight = `${minHeight}px`;
    document.querySelectorAll(`script[data-joinad]`).forEach((el) => {
      el.parentNode?.removeChild(el);
    });
    const script = document.createElement('script');
    script.src = `${scriptSrc}?_=${Date.now()}`;
    script.async = true;
    script.setAttribute('data-joinad', adId);
    setTimeout(() => {
      if (destroyed) return;
      if (!container) return;
      container.appendChild(script);
      observerRef.current = new MutationObserver(() => {
        if (container.innerHTML.trim() !== '') {
          // Remove possíveis restrições de altura aplicadas durante o carregamento
          container.style.display = '';
          container.style.minHeight = '';
          container.style.height = '';
          if (container.parentElement) {
            container.parentElement.style.minHeight = '';
            container.parentElement.style.height = '';
          }
          setVisible(true);
          if (observerRef.current) observerRef.current.disconnect();
        }
      });
      observerRef.current.observe(container, { childList: true, subtree: true });
      timeoutRef.current = window.setTimeout(() => {
        if (container.innerHTML.trim() === '') {
          // Forçar colapso do contêiner e do pai para evitar espaço em branco
          container.style.minHeight = '0px';
          container.style.height = '0px';
          container.style.display = 'none';
          if (container.parentElement) {
            container.parentElement.style.minHeight = '0px';
            container.parentElement.style.height = '0px';
          }
          setVisible(false);
        }
        if (observerRef.current) observerRef.current.disconnect();
      }, 4000);
    }, 300);
    return () => {
      destroyed = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (observerRef.current) observerRef.current.disconnect();
      if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
        container.style.minHeight = '0px';
        container.style.height = '0px';
        if (container.parentElement) {
          container.parentElement.style.minHeight = '0px';
          container.parentElement.style.height = '0px';
        }
      }
      document.querySelectorAll(`script[data-joinad="${adId}"]`).forEach((el) => {
        el.parentNode?.removeChild(el);
      });
    };
  }, [key, adId, scriptSrc, minHeight]);

  if (!visible) return null;
  return <div id={adId} ref={containerRef} className={className} key={key} aria-label="Publicidade" />;
};
