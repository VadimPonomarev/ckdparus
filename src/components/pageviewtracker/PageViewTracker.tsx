'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function PageViewTracker() {
  const pathname = usePathname();
  const trackedPath = useRef('');
  const isTracking = useRef(false);

  useEffect(() => {
    const trackPageView = async () => {
      // Предотвращаем двойной трекинг
      if (trackedPath.current === pathname || isTracking.current) return;

      isTracking.current = true;

      try {
        const response = await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer || null,
          }),
        });

        if (response.ok) {
          trackedPath.current = pathname;
        }
      } catch (error) {
        console.error('Failed to track page view:', error);
      } finally {
        isTracking.current = false;
      }
    };

    // Небольшая задержка, чтобы не мешать загрузке страницы
    const timeoutId = setTimeout(trackPageView, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
