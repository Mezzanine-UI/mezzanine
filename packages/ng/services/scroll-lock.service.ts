import { Injectable } from '@angular/core';

interface SavedStyles {
  overflow: string;
  paddingRight: string;
  position: string;
  top: string;
  width: string;
}

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  if ('userAgentData' in navigator) {
    const userAgentData = (
      navigator as Navigator & { userAgentData?: { platform?: string } }
    ).userAgentData;
    if (userAgentData?.platform) {
      return userAgentData.platform === 'iOS';
    }
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
  const isSafariOnMac =
    /macintosh/.test(userAgent) && navigator.maxTouchPoints > 1;

  return isIOSDevice || isSafariOnMac;
}

/**
 * Locks and unlocks page scrolling with nested lock support.
 *
 * Supports multiple concurrent locks (for nested modals/overlays),
 * reserves scrollbar width to prevent layout shift, and handles
 * iOS Safari rubber-band scrolling.
 */
@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private lockCount = 0;
  private originalStyles: SavedStyles = {
    overflow: '',
    paddingRight: '',
    position: '',
    top: '',
    width: '',
  };
  private scrollPosition = 0;

  lock(reserveScrollBarGap = true): void {
    if (typeof document === 'undefined') return;

    const body = document.body;

    if (this.lockCount === 0) {
      this.originalStyles = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
      };
      this.scrollPosition = window.scrollY || window.pageYOffset;
    }

    this.lockCount += 1;

    body.style.overflow = 'hidden';

    if (reserveScrollBarGap) {
      const scrollbarWidth = this.getScrollbarWidth();
      if (scrollbarWidth > 0) {
        const currentPaddingRight =
          parseInt(window.getComputedStyle(body).paddingRight, 10) || 0;
        body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
      }
    }

    if (isIOS()) {
      body.style.position = 'fixed';
      body.style.top = `-${this.scrollPosition}px`;
      body.style.width = '100%';
    }
  }

  unlock(): void {
    if (typeof document === 'undefined') return;

    this.lockCount = Math.max(this.lockCount - 1, 0);

    if (this.lockCount === 0) {
      const body = document.body;

      body.style.overflow = this.originalStyles.overflow;
      body.style.paddingRight = this.originalStyles.paddingRight;
      body.style.position = this.originalStyles.position;
      body.style.top = this.originalStyles.top;
      body.style.width = this.originalStyles.width;

      if (isIOS() && this.scrollPosition > 0) {
        window.scrollTo(0, this.scrollPosition);
      }

      this.scrollPosition = 0;
    }
  }

  private getScrollbarWidth(): number {
    if (typeof window === 'undefined') return 0;

    if (document.documentElement.scrollHeight <= window.innerHeight) {
      return 0;
    }

    return window.innerWidth - document.documentElement.clientWidth;
  }
}
