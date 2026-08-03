import React, { useEffect, useRef, useState } from 'react';

type Props = {
  adId?: string;
  scriptSrc?: string;
  minHeight?: number;
  className?: string;
  label?: string;
};

const AdUnit: React.FC<Props> = ({ adId, scriptSrc, minHeight = 120, className = '', label = 'Publicidade' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const id = adId || `ad-slot-${Math.random().toString(36).slice(2, 8)}`;
    container.id = id;
    container.style.minHeight = `${minHeight}px`;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '300px',
      threshold: 0.1,
    });

    observerRef.current.observe(container);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      container.innerHTML = '';
    };
  }, [adId, minHeight]);

  useEffect(() => {
    if (!isVisible) return;

    const container = containerRef.current;
    if (!container) return;

    try {
      if (scriptSrc) {
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;
        container.appendChild(script);
      }
    } catch (error) {
      console.error('Failed to load ad script:', error);
      container.style.display = 'none';
    }
  }, [isVisible, scriptSrc]);

  return (
    <div className={`ad-unit-wrapper ${className}`} style={{ textAlign: 'center', minHeight: `${minHeight}px` }}>
      {label && (
        <div className="ad-label" style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>
          {label}
        </div>
      )}
      <div ref={containerRef} className="ad-unit" />
    </div>
  );
};

export default AdUnit;
