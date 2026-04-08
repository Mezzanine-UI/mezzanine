import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { MOTION_DURATION } from '@mezzanine-ui/system/motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznBackdrop } from '@mezzanine-ui/ng/backdrop';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import {
  mznScaleAnimation,
  mznFadeAnimation,
} from '@mezzanine-ui/ng/transition';
import { EscapeKeyService } from '@mezzanine-ui/ng/services';
import { TopStackService } from '@mezzanine-ui/ng/services';
import { ScrollLockService } from '@mezzanine-ui/ng/services';

/**
 * MediaPreviewModal displays a gallery of images with navigation controls and circular browsing.
 *
 * Supports both controlled mode (`currentIndex` + `onNext`/`onPrev`) and uncontrolled mode (`defaultIndex`).
 * Automatically preloads adjacent images for better performance, and shows a pagination indicator when there are multiple items.
 *
 * @example
 * ```html
 * import { MznMediaPreviewModal } from '@mezzanine-ui/ng/media-preview-modal';
 *
 * <mzn-media-preview-modal
 *   [open]="isOpen"
 *   [mediaItems]="['url1.jpg', 'url2.jpg', 'url3.jpg']"
 *   [defaultIndex]="0"
 *   [showPaginationIndicator]="true"
 *   (closed)="isOpen = false"
 *   (indexChange)="onIndexChange($event)"
 * />
 * ```
 *
 * Controlled mode:
 * ```html
 * <mzn-media-preview-modal
 *   [open]="isOpen"
 *   [mediaItems]="images"
 *   [currentIndex]="currentIndex"
 *   (closed)="isOpen = false"
 *   (next)="onNext()"
 *   (prev)="onPrev()"
 * />
 * ```
 */
@Component({
  selector: 'mzn-media-preview-modal',
  standalone: true,
  imports: [MznBackdrop, MznClearActions, MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [mznScaleAnimation, mznFadeAnimation],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <mzn-backdrop
      [open]="open()"
      [disableCloseOnBackdropClick]="disableCloseOnBackdropClick()"
      [disablePortal]="disablePortal()"
      (closed)="onBackdropClose()"
    >
      @if (open()) {
        <div class="mzn-modal__content-wrapper" @mznScale>
          <div class="mzn-modal__media-preview-content">
            <div class="mzn-modal__media-preview-media-container">
              @for (idx of displayedIndices(); track idx) {
                @if (isStringItem(mediaItems()[idx])) {
                  <img
                    class="mzn-modal__media-preview-image"
                    @mznFade
                    [src]="asString(mediaItems()[idx])"
                    [alt]="'Media ' + (idx + 1)"
                    style="width: 100%; height: 100%; object-fit: contain;"
                  />
                }
              }
            </div>
          </div>
        </div>

        <mzn-clear-actions
          class="mzn-modal__media-preview-close-button"
          type="embedded"
          variant="contrast"
          ariaLabel="Close"
          (clicked)="closed.emit()"
        />

        @if (hasMultipleItems()) {
          <button
            type="button"
            class="mzn-modal__media-preview-nav-button mzn-modal__media-preview-nav-button--prev"
            [attr.aria-disabled]="isPrevDisabled()"
            aria-label="Previous media"
            [disabled]="isPrevDisabled()"
            (click)="onPrev()"
          >
            <i
              mznIcon
              [icon]="chevronLeftIcon"
              [size]="16"
              color="fixed-light"
            ></i>
          </button>

          <button
            type="button"
            class="mzn-modal__media-preview-nav-button mzn-modal__media-preview-nav-button--next"
            [attr.aria-disabled]="isNextDisabled()"
            aria-label="Next media"
            [disabled]="isNextDisabled()"
            (click)="onNext()"
          >
            <i
              mznIcon
              [icon]="chevronRightIcon"
              [size]="16"
              color="fixed-light"
            ></i>
          </button>
        }

        @if (showPaginationIndicator() && hasMultipleItems()) {
          <div
            class="mzn-modal__media-preview-pagination-indicator"
            [attr.aria-label]="
              'Page ' + (resolvedIndex() + 1) + ' of ' + mediaItems().length
            "
          >
            {{ resolvedIndex() + 1 }}/{{ mediaItems().length }}
          </div>
        }
      }
    </mzn-backdrop>
  `,
})
export class MznMediaPreviewModal {
  private readonly escapeKey = inject(EscapeKeyService);
  private readonly topStack = inject(TopStackService);
  private readonly scrollLock = inject(ScrollLockService);

  protected readonly chevronLeftIcon = ChevronLeftIcon;
  protected readonly chevronRightIcon = ChevronRightIcon;

  // ─── Inputs ───────────────────────────────────────────────────

  /** Whether the modal is open. @default false */
  readonly open = input(false);

  /** Array of media items (image URLs). */
  readonly mediaItems = input<string[]>([]);

  /** Default index when opened (uncontrolled mode). @default 0 */
  readonly defaultIndex = input(0);

  /** Current index (controlled mode). */
  readonly currentIndex = input<number>();

  /** Whether to disable the next button. @default false */
  readonly disableNext = input(false);

  /** Whether to disable the previous button. @default false */
  readonly disablePrev = input(false);

  /** Enable circular navigation (wrap around at boundaries). @default false */
  readonly enableCircularNavigation = input(false);

  /** Whether to show the pagination indicator. @default true */
  readonly showPaginationIndicator = input(true);

  /** Whether to disable closing on backdrop click. @default false */
  readonly disableCloseOnBackdropClick = input(false);

  /** Whether to disable closing on Escape key. @default false */
  readonly disableCloseOnEscapeKeyDown = input(false);

  /** Whether to disable portal rendering. @default false */
  readonly disablePortal = input(false);

  // ─── Outputs ─────────────────────────────────────────────────

  /** Emitted when the modal is closed. */
  readonly closed = output<void>();

  /** Emitted when the index changes (uncontrolled mode). */
  readonly indexChange = output<number>();

  /** Emitted when the next button is clicked (controlled mode). */
  readonly next = output<void>();

  /** Emitted when the previous button is clicked (controlled mode). */
  readonly prev = output<void>();

  // ─── Internal state ─────────────────────────────────────────────

  private readonly _internalIndex = signal(0);
  private readonly _displayedIndices = signal<number[]>([]);
  private readonly _activeIndex = signal(0);

  // ─── Computed ──────────────────────────────────────────────────

  protected readonly isControlled = computed(
    (): boolean => this.currentIndex() !== undefined,
  );

  protected readonly resolvedIndex = computed((): number =>
    this.isControlled() ? (this.currentIndex() ?? 0) : this._internalIndex(),
  );

  protected readonly hasMultipleItems = computed(
    (): boolean => this.mediaItems().length > 1,
  );

  protected readonly isNextDisabled = computed((): boolean => {
    if (this.enableCircularNavigation()) return false;
    return (
      this.disableNext() || this.resolvedIndex() >= this.mediaItems().length - 1
    );
  });

  protected readonly isPrevDisabled = computed((): boolean => {
    if (this.enableCircularNavigation()) return false;
    return this.disablePrev() || this.resolvedIndex() <= 0;
  });

  protected readonly displayedIndices = this._displayedIndices;

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.mediaPreview),
  );

  // ─── Lifecycle ─────────────────────────────────────────────────

  constructor() {
    // Manage top stack and escape key
    effect((onCleanup) => {
      const isOpen = this.open();

      if (isOpen) {
        this.scrollLock.lock();

        const entry = this.topStack.register();

        const escapeCleanup = this.escapeKey.listen(() => {
          if (!this.disableCloseOnEscapeKeyDown() && entry.isTop()) {
            this.closed.emit();
          }
        });

        onCleanup(() => {
          escapeCleanup();
          entry.unregister();
          this.scrollLock.unlock();
        });
      }
    });

    // Reset internal index when modal opens
    effect(() => {
      const isOpen = this.open();
      const isCtrl = this.isControlled();

      if (isOpen && !isCtrl) {
        this._internalIndex.set(this.defaultIndex());
        this._displayedIndices.set([this.defaultIndex()]);
        this._activeIndex.set(this.defaultIndex());
      }
    });

    // Handle index changes
    effect((onCleanup) => {
      const idx = this.resolvedIndex();
      const active = this._activeIndex();

      if (idx !== active) {
        // Add new index to displayed indices
        this._displayedIndices.update((prev) =>
          prev.includes(idx) ? prev : [...prev, idx],
        );

        // Use RAF to trigger animation
        let rafId1 = 0;
        let rafId2 = 0;

        rafId1 = requestAnimationFrame(() => {
          rafId2 = requestAnimationFrame(() => {
            this._activeIndex.set(idx);
          });
        });

        // Cleanup old images after transition
        const cleanupTimer = setTimeout(() => {
          this._displayedIndices.set([idx]);
        }, MOTION_DURATION.fast + 100);

        onCleanup(() => {
          clearTimeout(cleanupTimer);
          cancelAnimationFrame(rafId1);
          cancelAnimationFrame(rafId2);
        });
      }
    });

    // Image preloading
    effect((onCleanup) => {
      const isOpen = this.open();
      const idx = this.resolvedIndex();
      const items = this.mediaItems();

      if (!isOpen || items.length === 0) return;

      const priorityIndices = [idx - 1, idx, idx + 1].filter(
        (i): i is number => i >= 0 && i < items.length,
      );

      // Preload priority images
      priorityIndices.forEach((i) => {
        const item = items[i];
        if (item !== undefined) {
          const img = new Image();
          img.src = item;
        }
      });

      // Preload remaining images after delay
      const timer = setTimeout(() => {
        items.forEach((item, i) => {
          if (item !== undefined && !priorityIndices.includes(i)) {
            const img = new Image();
            img.src = item;
          }
        });
      }, 500);

      onCleanup(() => clearTimeout(timer));
    });
  }

  // ─── Methods ──────────────────────────────────────────────────

  protected onBackdropClose(): void {
    if (!this.disableCloseOnBackdropClick()) {
      this.closed.emit();
    }
  }

  protected onNext(): void {
    if (this.isControlled()) {
      this.next.emit();
    } else {
      const items = this.mediaItems();
      const idx = this._internalIndex();
      const nextIdx = this.enableCircularNavigation()
        ? (idx + 1) % items.length
        : Math.min(idx + 1, items.length - 1);

      this._internalIndex.set(nextIdx);
      this.indexChange.emit(nextIdx);
    }
  }

  protected onPrev(): void {
    if (this.isControlled()) {
      this.prev.emit();
    } else {
      const items = this.mediaItems();
      const idx = this._internalIndex();
      const prevIdx = this.enableCircularNavigation()
        ? (idx - 1 + items.length) % items.length
        : Math.max(idx - 1, 0);

      this._internalIndex.set(prevIdx);
      this.indexChange.emit(prevIdx);
    }
  }

  protected isStringItem(item: string | undefined): boolean {
    return typeof item === 'string';
  }

  protected asString(item: string | undefined): string {
    return item ?? '';
  }
}
