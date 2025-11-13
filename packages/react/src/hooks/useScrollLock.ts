import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

interface ScrollLockOptions {
  /**
   * Whether the scroll lock is enabled
   * @default false
   */
  enabled?: boolean;
  /**
   * Whether to reserve scrollbar width to prevent layout shift
   * @default true
   */
  reserveScrollBarGap?: boolean;
}

// Keep track of multiple scroll locks (for nested modals/overlays)
let lockCount = 0;
let originalStyles: {
  overflow: string;
  paddingRight: string;
  position?: string;
  top?: string;
  width?: string;
} = {
  overflow: '',
  paddingRight: '',
};
let scrollPosition = 0;

function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0;

  // Check if there's actually a scrollbar
  if (document.documentElement.scrollHeight <= window.innerHeight) {
    return 0;
  }

  // Use window.innerWidth - documentElement.clientWidth for more accurate measurement
  return window.innerWidth - document.documentElement.clientWidth;
}

function lock(reserveScrollBarGap = true) {
  if (typeof document === 'undefined') return;

  const body = document.body;
  const scrollbarWidth = reserveScrollBarGap ? getScrollbarWidth() : 0;

  // Save original styles only on first lock
  if (lockCount === 0) {
    originalStyles = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    scrollPosition = window.scrollY || window.pageYOffset;
  }

  lockCount += 1;

  // Apply lock styles
  body.style.overflow = 'hidden';

  // Reserve scrollbar space to prevent layout shift
  if (reserveScrollBarGap && scrollbarWidth > 0) {
    const currentPaddingRight =
      parseInt(window.getComputedStyle(body).paddingRight, 10) || 0;
    body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
  }

  // For iOS Safari - prevent rubber band scrolling
  // Use position fixed to lock the scroll position
  if (isIOS()) {
    body.style.position = 'fixed';
    body.style.top = `-${scrollPosition}px`;
    body.style.width = '100%';
  }
}

function unlock() {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(lockCount - 1, 0);

  // Only restore when all locks are released
  if (lockCount === 0) {
    const body = document.body;

    // Restore original styles
    body.style.overflow = originalStyles.overflow;
    body.style.paddingRight = originalStyles.paddingRight;

    if (originalStyles.position !== undefined) {
      body.style.position = originalStyles.position;
    }
    if (originalStyles.top !== undefined) {
      body.style.top = originalStyles.top;
    }
    if (originalStyles.width !== undefined) {
      body.style.width = originalStyles.width;
    }

    // Restore scroll position for iOS
    if (isIOS() && scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }

    scrollPosition = 0;
  }
}

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  // Modern approach using userAgentData API (when available)
  if ('userAgentData' in navigator) {
    const userAgentData = (navigator as any).userAgentData;
    if (userAgentData?.platform) {
      return userAgentData.platform === 'iOS';
    }
  }

  // Fallback to userAgent string parsing
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
  const isSafariOnMac =
    /macintosh/.test(userAgent) && navigator.maxTouchPoints > 1;

  return isIOSDevice || isSafariOnMac;
}

/**
 * Hook to lock/unlock body scroll
 * Handles multiple concurrent locks (nested modals/overlays)
 * Prevents layout shift by reserving scrollbar width
 * Handles iOS rubber band scrolling
 *
 * @example
 * ```tsx
 * function Modal({ open }) {
 *   useScrollLock({ enabled: open });
 *   return <div>...</div>;
 * }
 * ```
 */
export function useScrollLock(options: ScrollLockOptions = {}) {
  const { enabled = false, reserveScrollBarGap = true } = options;
  const lockedRef = useRef(false);

  // Use layout effect to apply scroll lock before paint
  useIsomorphicLayoutEffect(() => {
    if (enabled && !lockedRef.current) {
      lock(reserveScrollBarGap);
      lockedRef.current = true;
    } else if (!enabled && lockedRef.current) {
      unlock();
      lockedRef.current = false;
    }
  }, [enabled, reserveScrollBarGap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lockedRef.current) {
        unlock();
        lockedRef.current = false;
      }
    };
  }, []);
}
