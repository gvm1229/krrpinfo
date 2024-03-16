/* eslint no-return-assign: 0 */

// @see https://usehooks.com/useLockBodyScroll.
import { useLayoutEffect } from 'react';

export function useLockBody() {
  useLayoutEffect((): (() => void) => {
    const originalStyle: string = window.getComputedStyle(
      document.body,
    ).overflow;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = originalStyle);
  }, []);
}
