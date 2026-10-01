import { useEffect } from 'react';

/**
 * useEscapeKey
 * Declanșează handler-ul la apăsarea tastei Escape.
 */
export function useEscapeKey(handler, active = true) {
  useEffect(() => {
    if (!active || typeof handler !== 'function') return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        handler();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handler, active]);
}
