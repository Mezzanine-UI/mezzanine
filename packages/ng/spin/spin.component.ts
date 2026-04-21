import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { iconClasses as classes } from '@mezzanine-ui/core/spin';
import { BackdropVariant } from '@mezzanine-ui/core/backdrop';
import { GeneralSize } from '@mezzanine-ui/system/size';
import clsx from 'clsx';
import { MznBackdrop } from '@mezzanine-ui/ng/backdrop';

export interface SpinBackdropProps {
  /** CSS class applied to the backdrop container. */
  class?: string;
  /** Whether to disable closing on backdrop click. @default true */
  disableCloseOnBackdropClick?: boolean;
  /** Whether to disable scroll lock. @default true */
  disableScrollLock?: boolean;
  /** The backdrop color variant. @default 'light' */
  variant?: BackdropVariant;
}

/**
 * 載入中旋轉指示器元件。
 *
 * 透過 `loading` 控制顯示，支援 `size` 調整大小、`color` 自訂弧線色彩、
 * `trackColor` 自訂軌道色彩，以及 `description` 顯示載入文字。
 * 使用 `ng-content` 投射子內容時，元件自動進入巢狀模式，
 * 以光照遮罩覆蓋子內容並將旋轉指示器置中顯示。
 *
 * @example
 * ```html
 * import { MznSpin } from '@mezzanine-ui/ng/spin';
 *
 * <!-- 獨立模式 -->
 * <div mznSpin [loading]="true" ></div>
 * <div mznSpin [loading]="isLoading" size="sub" description="載入中..." ></div>
 * <div mznSpin [loading]="true" color="#1890ff" trackColor="rgba(0,0,0,0.1)" ></div>
 *
 * <!-- 巢狀模式（以遮罩覆蓋子內容） -->
 * <div mznSpin [loading]="isLoading" description="載入中...">
 *   <div style="width: 300px; height: 300px;">Content here</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznSpin]',
  standalone: true,
  imports: [MznBackdrop],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.backdropProps]': 'null',
    '[attr.color]': 'null',
    '[attr.description]': 'null',
    '[attr.descriptionClassName]': 'null',
    '[attr.loading]': 'null',
    '[attr.size]': 'null',
    '[attr.stretch]': 'null',
    '[attr.trackColor]': 'null',
  },
  template: `
    <span #contentSlot style="display: contents">
      <ng-content />
    </span>
    @if (hasChildren()) {
      <div
        mznBackdrop
        [open]="loading()"
        [class]="backdropProps().class"
        [disableCloseOnBackdropClick]="
          backdropProps().disableCloseOnBackdropClick ?? true
        "
        [disablePortal]="true"
        [disableScrollLock]="backdropProps().disableScrollLock ?? true"
        [variant]="backdropProps().variant ?? 'light'"
        style="pointer-events: none;"
      >
        @if (loading()) {
          <div [class]="spinClasses()">
            <span [class]="classes.spinnerRing" [style]="ringStyles()">
              <span [class]="classes.spinnerTail"></span>
            </span>
            @if (description()) {
              <span [class]="descriptionClasses()">{{ description() }}</span>
            }
          </div>
        }
      </div>
    } @else if (loading()) {
      <div [class]="spinClasses()">
        <span [class]="classes.spinnerRing" [style]="ringStyles()">
          <span [class]="classes.spinnerTail"></span>
        </span>
        @if (description()) {
          <span [class]="descriptionClasses()">{{ description() }}</span>
        }
      </div>
    }
  `,
})
export class MznSpin implements AfterContentInit {
  @ViewChild('contentSlot', { static: true })
  protected contentSlot!: ElementRef<HTMLElement>;

  // React's Spin has two render paths: with children → nested backdrop,
  // without children → inline spinner. Detect projected content at
  // AfterContentInit so we can match the standalone path.
  protected readonly hasChildren = signal(false);

  ngAfterContentInit(): void {
    const hasNonEmpty = Array.from(
      this.contentSlot.nativeElement.childNodes,
    ).some(
      (n) =>
        n.nodeType === Node.ELEMENT_NODE ||
        (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()),
    );
    this.hasChildren.set(hasNonEmpty);
  }

  protected readonly classes = classes;

  /**
   * Custom backdrop props (controls backdrop behavior in nested mode).
   * By default, scroll lock and close-on-click are disabled, and the
   * light variant is used — matching React's nested Spin behaviour.
   */
  readonly backdropProps = input<SpinBackdropProps>({});

  /**
   * 自訂弧線動畫色彩。
   * Sets the `--mzn-spin--color` CSS variable. Accepts any valid CSS color.
   */
  readonly color = input<string>();

  /**
   * 載入描述文字。
   */
  readonly description = input<string>();

  /**
   * 套用在描述文字元素上的額外 CSS class。
   */
  readonly descriptionClassName = input<string>();

  /**
   * 是否顯示載入指示器。
   * @default false
   */
  readonly loading = input(false);

  /**
   * 元件尺寸。
   * @default 'main'
   */
  readonly size = input<GeneralSize>('main');

  /**
   * 是否伸展至容器的 100% 寬高。
   * @default false
   */
  readonly stretch = input(false);

  /**
   * 自訂軌道背景色彩。
   * Sets the `--mzn-spin--track-color` CSS variable. Accepts any valid CSS color.
   */
  readonly trackColor = input<string>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.stretch]: this.stretch(),
    }),
  );

  protected readonly spinClasses = computed((): string =>
    clsx(classes.spin, classes.size(this.size()), {
      [classes.stretch]: this.stretch(),
    }),
  );

  protected readonly descriptionClasses = computed((): string =>
    clsx(classes.description, this.descriptionClassName()),
  );

  protected readonly ringStyles = computed((): Record<string, string> => {
    const styles: Record<string, string> = {};

    const color = this.color();
    const trackColor = this.trackColor();

    if (color) {
      styles['--mzn-spin--color'] = color;
    }

    if (trackColor) {
      styles['--mzn-spin--track-color'] = trackColor;
    }

    return styles;
  });
}
