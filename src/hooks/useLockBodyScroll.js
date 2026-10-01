import { useEffect } from 'react';

/**
 * useLockBodyScroll
 * Blochează scroll-ul paginii când un modal sau un overlay este deschis
 * și îl deblochează automat la închidere sau la demontare.
 */
export function useLockBodyScroll(isLocked = true) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}
