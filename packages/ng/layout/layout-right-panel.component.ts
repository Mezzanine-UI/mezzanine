import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  NgZone,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import clsx from 'clsx';
import { layoutClasses } from '@mezzanine-ui/core/layout';
import { MznScrollbar } from '@mezzanine-ui/ng/scrollbar';

const MIN_PANEL_WIDTH = 240;
const CONTENT_WRAPPER_MIN_WIDTH = 480;
const ARROW_KEY_STEP = 10;

/**
 * 佈局右側可調整寬度面板。
 *
 * 包含可拖曳的分隔線（divider），使用者可透過滑鼠拖曳調整面板寬度。
 * 與 LeftPanel 鏡像配置，分隔線在左側，拖曳方向相反。
 *
 * @example
 * ```html
 * import { MznLayout, MznLayoutMain, MznLayoutRightPanel } from '@mezzanine-ui/ng/layout';
 *
 * <div mznLayout>
 *   <div mznLayoutMain>Main Content</div>
 *   <aside mznLayoutRightPanel [open]="true" [defaultWidth]="280">
 *     <p>Right panel content</p>
 *   </aside>
 * </div>
 * ```
 *
 * @see MznLayout
 * @see MznLayoutLeftPanel
 */
@Component({
  selector: '[mznLayoutRightPanel]',
  standalone: true,
  imports: [MznScrollbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.inline-size.px]': 'open() ? width() : null',
    '[attr.defaultWidth]': 'null',
    '[attr.open]': 'null',
    '[attr.scrollbarDisabled]': 'null',
    '[attr.scrollbarMaxHeight]': 'null',
    '[attr.scrollbarMaxWidth]': 'null',
  },
  template: `
    @if (open()) {
      <div
        role="separator"
        aria-orientation="vertical"
        [attr.aria-valuemin]="minPanelWidth"
        [attr.aria-valuenow]="width()"
        aria-label="Resize right panel"
        [tabIndex]="0"
        [class]="dividerClasses()"
        (mousedown)="onDividerMouseDown($event)"
        (keydown)="onDividerKeyDown($event)"
      ></div>
      <aside [class]="sidePanelContentClass">
        <div
          mznScrollbar
          [disabled]="scrollbarDisabled()"
          [maxHeight]="scrollbarMaxHeight()"
          [maxWidth]="scrollbarMaxWidth()"
        >
          <ng-content />
        </div>
      </aside>
    }
  `,
})
export class MznLayoutRightPanel implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * 面板預設寬度（px）。
   * @default 320
   */
  readonly defaultWidth = input(320);

  /**
   * 是否顯示面板。
   * @default false
   */
  readonly open = input(false);

  /**
   * 是否停用內建的捲軸元件，退回原生捲軸行為。
   * @default false
   */
  readonly scrollbarDisabled = input(false);

  /**
   * 捲軸容器最大高度。
   */
  readonly scrollbarMaxHeight = input<string>();

  /**
   * 捲軸容器最大寬度。
   */
  readonly scrollbarMaxWidth = input<string>();

  /** 寬度變更時發出的事件。 */
  readonly widthChange = output<number>();

  protected readonly minPanelWidth = MIN_PANEL_WIDTH;
  protected readonly width = signal(0);
  protected readonly isDragging = signal(false);
  protected readonly sidePanelContentClass = layoutClasses.sidePanelContent;

  protected readonly hostClasses = computed((): string =>
    clsx(layoutClasses.sidePanel, layoutClasses.sidePanelRight),
  );

  protected readonly dividerClasses = computed((): string =>
    clsx(layoutClasses.divider, {
      [layoutClasses.dividerDragging]: this.isDragging(),
    }),
  );

  private cleanupListeners: (() => void) | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.removeDragListeners();
    });
  }

  ngOnInit(): void {
    this.width.set(Math.max(MIN_PANEL_WIDTH, this.defaultWidth()));
  }

  /**
   * Computes max panel width using main content slack above CONTENT_WRAPPER_MIN_WIDTH,
   * matching React's LayoutRightPanel mainRef.current.offsetWidth - 480 algorithm.
   */
  private computeMaxWidth(currentWidth: number): number {
    const mainEl = this.document.querySelector(
      `.${layoutClasses.main}`,
    ) as HTMLElement | null;
    const mainWidth =
      mainEl?.offsetWidth ?? this.document.documentElement.clientWidth;
    return currentWidth + Math.max(0, mainWidth - CONTENT_WRAPPER_MIN_WIDTH);
  }

  protected onDividerKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();

    const maxWidth = this.computeMaxWidth(this.width());
    const step = event.key === 'ArrowLeft' ? ARROW_KEY_STEP : -ARROW_KEY_STEP;
    const newWidth = Math.max(
      MIN_PANEL_WIDTH,
      Math.min(this.width() + step, maxWidth),
    );

    this.width.set(newWidth);
    this.widthChange.emit(newWidth);
  }

  protected onDividerMouseDown(event: MouseEvent): void {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = this.width();
    const maxWidth = this.computeMaxWidth(startWidth);

    this.isDragging.set(true);

    this.ngZone.runOutsideAngular(() => {
      const onMouseMove = (moveEvent: MouseEvent): void => {
        const delta = startX - moveEvent.clientX;
        const newWidth = Math.max(
          MIN_PANEL_WIDTH,
          Math.min(startWidth + delta, maxWidth),
        );

        this.width.set(newWidth);
        this.widthChange.emit(newWidth);
      };

      const onMouseUp = (): void => {
        this.ngZone.run(() => {
          this.isDragging.set(false);
          this.widthChange.emit(this.width());
        });
        this.removeDragListeners();
      };

      this.document.addEventListener('mousemove', onMouseMove);
      this.document.addEventListener('mouseup', onMouseUp);

      this.cleanupListeners = (): void => {
        this.document.removeEventListener('mousemove', onMouseMove);
        this.document.removeEventListener('mouseup', onMouseUp);
      };
    });
  }

  private removeDragListeners(): void {
    if (this.cleanupListeners) {
      this.cleanupListeners();
      this.cleanupListeners = null;
    }
  }
}
