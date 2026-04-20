import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  Signal,
  signal,
} from '@angular/core';
import { stepClasses as classes } from '@mezzanine-ui/core/stepper';
import {
  CheckedOutlineIcon,
  DangerousFilledIcon,
  Item0Icon,
  Item1Icon,
  Item2Icon,
  Item3Icon,
  Item4Icon,
  Item5Icon,
  Item6Icon,
  Item7Icon,
  Item8Icon,
  Item9Icon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MZN_STEPPER_CONTEXT } from './stepper-context';

/** Step 的狀態類型。 */
export type StepStatus = 'processing' | 'pending' | 'succeeded';

/** Step 的指示器樣式。 */
export type StepType = 'dot' | 'number';

/** Step 的排列方向。 */
export type StepOrientation = 'horizontal' | 'vertical';

const indicatorNumberIconList = [
  Item0Icon,
  Item1Icon,
  Item2Icon,
  Item3Icon,
  Item4Icon,
  Item5Icon,
  Item6Icon,
  Item7Icon,
  Item8Icon,
  Item9Icon,
];

/**
 * 步驟指示元件，配合 `MznStepper` 使用，顯示各步驟的狀態與資訊。
 *
 * 會根據 `status` 自動顯示對應的圖示（數字、勾選、錯誤），
 * `type` 決定使用數字或圓點指示器。狀態資訊由父層 `MznStepper`
 * 透過 `MZN_STEPPER_CONTEXT` 以 pull-based 方式提供，無需手動綁定。
 *
 * @example
 * ```html
 * import { MznStep } from '@mezzanine-ui/ng/stepper';
 *
 * <div mznStep title="填寫資料" description="請輸入基本資訊" ></div>
 * <div mznStep title="確認內容" ></div>
 * ```
 */
@Component({
  selector: '[mznStep]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznTypography],
  host: {
    '[class]': 'hostClasses()',
    '[style.--connect-line-distance]': 'connectLineDistance()',
    '[attr.role]': 'interactive() ? "button" : null',
    '[attr.tabindex]': 'interactive() ? 0 : null',
    '(keydown.enter)': 'handleInteractiveKey($event)',
    '(keydown.space)': 'handleInteractiveKey($event)',
    '[attr.connectLineDistance]': 'null',
    '[attr.description]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.index]': 'null',
    '[attr.interactive]': 'null',
    '[attr.status]': 'null',
    '[attr.title]': 'null',
  },
  template: `
    @if (_type() === 'number') {
      @if (!error() && _status() === 'succeeded') {
        <i mznIcon [class]="statusIndicatorClass" [icon]="checkedIcon"></i>
      } @else if (_status() !== 'processing' && error()) {
        <i mznIcon [class]="statusIndicatorClass" [icon]="dangerousIcon"></i>
      } @else {
        <i mznIcon [class]="statusIndicatorClass" [icon]="numberIcon()"></i>
      }
    }
    @if (_type() === 'dot') {
      <span [class]="dotIndicatorClasses"></span>
    }
    <div [class]="textContainerClass">
      <span
        [class]="titleClass"
        mznTypography
        variant="label-primary-highlight"
      >
        {{ title() }}
        <span [class]="titleConnectLineClass"></span>
      </span>
      @if (description()) {
        <span [class]="descriptionClass" mznTypography variant="caption">{{
          description()
        }}</span>
      }
    </div>
  `,
})
export class MznStep {
  private readonly stepperCtx = inject(MZN_STEPPER_CONTEXT, { optional: true });

  protected readonly checkedIcon = CheckedOutlineIcon;
  protected readonly dangerousIcon = DangerousFilledIcon;
  protected readonly statusIndicatorClass = classes.statusIndicator;
  protected readonly dotIndicatorClasses = `${classes.statusIndicator} ${classes.statusIndicatorDot}`;
  protected readonly textContainerClass = classes.textContainer;
  protected readonly titleClass = classes.title;
  protected readonly titleConnectLineClass = classes.titleConnectLine;
  protected readonly descriptionClass = classes.description;

  /** 連接線距離（由 Stepper 父元件設定）。 */
  readonly connectLineDistance = input<string>();

  /** 步驟描述文字。 */
  readonly description = input<string>();

  /**
   * 是否禁用此步驟（僅在 status 非 processing 時生效）。
   * 禁用時步驟外觀視覺上為不可互動狀態。
   * @default false
   */
  readonly disabled = input(false);

  /** 是否為錯誤狀態（僅在 status 非 processing 時生效）。 */
  readonly error = input(false);

  /**
   * 是否為可互動步驟。啟用時加入 `role="button"` 及 `tabindex="0"`，
   * 並支援 Enter / Space 鍵觸發 click 事件。
   * @default false
   */
  readonly interactive = input(false);

  /**
   * 手動指定步驟索引（零基）。
   * 通常由父 `MznStepper` 自動注入，僅在獨立使用時需手動設定。
   */
  readonly index = input<number>();

  /**
   * 手動覆蓋步驟狀態。
   * 設定後不再依父 `MznStepper` 的 `currentStep` 自動計算。
   */
  readonly status = input<StepStatus>();

  /** 步驟標題。 */
  readonly title = input.required<string>();

  /**
   * 本步驟在父 Stepper 中的索引（零基），透過註冊模式取得。
   * @internal
   */
  readonly _index: Signal<number>;

  /**
   * 排列方向，由父 Stepper 提供。
   * @internal
   */
  readonly _orientation = computed(
    (): StepOrientation => this.stepperCtx?.orientation() ?? 'horizontal',
  );

  /**
   * 本步驟的進度狀態，根據父 Stepper 的 `currentStep` 自動計算。
   * 若有明確的 `status` 輸入則優先使用。
   * @internal
   */
  readonly _status = computed((): StepStatus => {
    const explicitStatus = this.status();

    if (explicitStatus) return explicitStatus;

    if (!this.stepperCtx) return 'pending';

    const current = this.stepperCtx.currentStep();
    const index = this.index() ?? this._index();

    if (index < current) return 'succeeded';
    if (index === current) return 'processing';

    return 'pending';
  });

  /**
   * 指示器樣式，由父 Stepper 提供。
   * @internal
   */
  readonly _type = computed(
    (): StepType => this.stepperCtx?.type() ?? 'number',
  );

  protected readonly numberIcon = computed(() => {
    const num = ((this.index() ?? this._index()) + 1) % 10;

    return indicatorNumberIconList[num];
  });

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.processing]: this._status() === 'processing',
      [classes.pending]:
        this._status() === 'pending' ||
        (this.disabled() && this._status() !== 'processing'),
      [classes.succeeded]:
        !this.error() && !this.disabled() && this._status() === 'succeeded',
      [classes.error]: this.error() && this._status() !== 'processing',
      [classes.processingError]:
        this.error() && this._status() === 'processing',
      [classes.horizontal]: this._orientation() === 'horizontal',
      [classes.vertical]: this._orientation() === 'vertical',
      [classes.dot]: this._type() === 'dot',
      [classes.number]: this._type() === 'number',
      [classes.interactive]: this.interactive(),
    }),
  );

  protected handleInteractiveKey(event: Event): void {
    if (!this.interactive()) return;

    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  }

  constructor() {
    this._index = this.stepperCtx?.register(this) ?? signal(0);

    if (this.stepperCtx) {
      const ctx = this.stepperCtx;

      inject(DestroyRef).onDestroy(() => {
        ctx.unregister(this);
      });
    }
  }
}
