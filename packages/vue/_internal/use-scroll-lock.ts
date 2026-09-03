import { onMounted, onScopeDispose, watch } from 'vue';

export interface ScrollLockOptions {
  /**
   * Reads whether the scroll lock is enabled.
   * @default false
   */
  enabled?: () => boolean | undefined;
  /**
   * Whether to reserve scrollbar width to prevent layout shift.
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

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  // Modern approach using userAgentData API (when available)
  if ('userAgentData' in navigator) {
    const { userAgentData } = navigator as Navigator & {
      userAgentData?: { platform?: string };
    };

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

function lock(reserveScrollBarGap = true): void {
  if (typeof document === 'undefined') return;

  const { body } = document;
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

function unlock(): void {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(lockCount - 1, 0);

  // Only restore when all locks are released
  if (lockCount === 0) {
    const { body } = document;

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

/**
 * 鎖定／解鎖頁面捲動的 composable。
 *
 * 支援多層巢狀鎖定（nested modals/overlays），保留捲軸寬度以防止版面偏移，
 * 並針對 iOS Safari 的 rubber band scrolling 進行特別處理。
 *
 * 鎖定發生在掛載之後、以及 `enabled` 改變之後的 DOM 更新階段，對應 React 版
 * 使用 layout effect 的時機。
 *
 * @example
 * ```ts
 * useScrollLock({ enabled: () => props.open });
 * ```
 */
export function useScrollLock(options: ScrollLockOptions = {}): void {
  const { enabled = () => false, reserveScrollBarGap = true } = options;
  let locked = false;

  function sync(): void {
    if (enabled() && !locked) {
      lock(reserveScrollBarGap);
      locked = true;
    } else if (!enabled() && locked) {
      unlock();
      locked = false;
    }
  }

  onMounted(sync);

  watch((): boolean | undefined => enabled(), sync, { flush: 'post' });

  onScopeDispose(() => {
    if (locked) {
      unlock();
      locked = false;
    }
  });
}
