import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  progressClasses as classes,
  ProgressStatus,
  ProgressStatuses,
  ProgressType,
  ProgressTypes,
} from '@mezzanine-ui/core/progress';
import {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
import { TypographySemanticType } from '@mezzanine-ui/system/typography';
import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTypography } from '@mezzanine-ui/ng/typography';

export interface ProgressPercentProps {
  align?: TypographyAlign;
  color?: TypographyColor;
  display?: TypographyDisplay;
  ellipsis?: boolean;
  noWrap?: boolean;
  variant?: TypographySemanticType;
}

/**
 * 進度條元件，支援百分比文字與狀態圖示兩種顯示類型。
 *
 * `percent` 介於 0～100，未達 100 時狀態自動為 `enabled`，達到 100 時自動切換為 `success`。
 * 可強制指定 `status` 為 `error` 以顯示錯誤圖示；使用 `tick` 可在進度條上標記特定位置。
 *
 * @example
 * ```html
 * import { MznProgress } from '@mezzanine-ui/ng/progress';
 *
 * <div mznProgress [percent]="60" ></div>
 * <div mznProgress [percent]="75" type="percent" ></div>
 * <div mznProgress [percent]="40" status="error" type="icon" ></div>
 * <div mznProgress [percent]="60" [tick]="80" ></div>
 * ```
 */
@Component({
  selector: '[mznProgress]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznTypography],
  host: {
    '[class]': 'hostClasses()',
    '[attr.icons]': 'null',
    '[attr.percent]': 'null',
    '[attr.percentProps]': 'null',
    '[attr.status]': 'null',
    '[attr.tick]': 'null',
    '[attr.type]': 'null',
  },
  template: `
    <div #lineRef [class]="classes.lineVariant">
      <i [class]="classes.lineBg" [style.width.%]="percentLimited()"></i>
    </div>
    @if (type() === 'percent') {
      <span
        mznTypography
        [variant]="percentProps()?.variant ?? 'input'"
        [align]="percentProps()?.align"
        [color]="percentProps()?.color"
        [display]="percentProps()?.display"
        [ellipsis]="percentProps()?.ellipsis ?? false"
        [noWrap]="percentProps()?.noWrap ?? false"
        [class]="classes.infoPercent"
        >{{ percentLimited() }}%</span
      >
    }
    @if (isSuccessStatus() || isErrorStatus()) {
      <i mznIcon [class]="classes.infoIcon" [icon]="icon()"></i>
    }
    @if (isActiveTick() && tickLeft()) {
      <div [class]="classes.tick" [style.--tick-position]="tickLeft()"></div>
    }
  `,
})
export class MznProgress implements AfterViewInit {
  protected readonly classes = classes;

  private readonly destroyRef = inject(DestroyRef);
  private readonly lineRef = viewChild<ElementRef<HTMLDivElement>>('lineRef');
  private readonly tickLeftSignal = signal<string | undefined>(undefined);

  /**
   * 自訂狀態圖示。
   */
  readonly icons = input<{
    readonly error?: IconDefinition;
    readonly success?: IconDefinition;
  }>();

  /**
   * 進度百分比（0～100）。
   * @default 0
   */
  readonly percent = input(0);

  /**
   * 百分比文字的排版屬性（status 為 enabled 時顯示）。
   */
  readonly percentProps = input<ProgressPercentProps>();

  /**
   * 強制指定進度狀態。未設定時依 percent 自動判斷
   * （percent < 100 ⇒ `enabled`，percent = 100 ⇒ `success`）。
   */
  readonly status = input<ProgressStatus>();

  /**
   * 進度條上的標記位置（0～100）。
   * @default 0
   */
  readonly tick = input(0);

  /**
   * 進度條顯示類型。
   * @default 'progress'
   */
  readonly type = input<ProgressType>('progress');

  protected readonly percentLimited = computed((): number =>
    Math.max(0, Math.min(100, this.percent())),
  );

  protected readonly resolvedStatus = computed((): ProgressStatus => {
    const explicit = this.status();

    if (explicit) return explicit;

    return this.percent() < 100
      ? ProgressStatuses.enabled
      : ProgressStatuses.success;
  });

  protected readonly icon = computed((): IconDefinition => {
    const icons = this.icons();

    if (this.resolvedStatus() === ProgressStatuses.success) {
      return icons?.success ?? CheckedFilledIcon;
    }

    return icons?.error ?? DangerousFilledIcon;
  });

  protected readonly isSuccessStatus = computed(
    (): boolean =>
      this.resolvedStatus() === ProgressStatuses.success &&
      this.type() === ProgressTypes.icon,
  );

  protected readonly isErrorStatus = computed(
    (): boolean =>
      this.resolvedStatus() === ProgressStatuses.error &&
      this.type() === ProgressTypes.icon,
  );

  protected readonly isActiveTick = computed((): boolean => {
    const t = this.tick();

    return t !== undefined && t > 0 && t < 100;
  });

  protected readonly tickPosition = computed((): number | undefined => {
    if (!this.isActiveTick()) return undefined;

    return Math.max(0, Math.min(100, this.tick()));
  });

  protected readonly tickLeft = computed((): string | undefined =>
    this.tickLeftSignal(),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.type(this.type()),
      this.resolvedStatus() === ProgressStatuses.success && classes.success,
      this.resolvedStatus() === ProgressStatuses.error && classes.error,
    ),
  );

  ngAfterViewInit(): void {
    this.updateTickPosition();

    const onResize = (): void => {
      this.updateTickPosition();
    };

    window.addEventListener('resize', onResize);

    const lineEl = this.lineRef()?.nativeElement;
    const containerEl = lineEl?.parentElement;
    let resizeObserver: ResizeObserver | undefined;

    if (lineEl && containerEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => this.updateTickPosition());
      resizeObserver.observe(lineEl);
      resizeObserver.observe(containerEl);
    }

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
    });
  }

  private updateTickPosition(): void {
    const pos = this.tickPosition();
    const lineEl = this.lineRef()?.nativeElement;
    const containerEl = lineEl?.parentElement;

    if (!this.isActiveTick() || pos === undefined || !lineEl || !containerEl) {
      this.tickLeftSignal.set(undefined);

      return;
    }

    const lineRect = lineEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    const lineLeft = lineRect.left - containerRect.left;
    const tickOffsetInLine = (pos / 100) * lineRect.width;
    const tickAbsoluteLeft = lineLeft + tickOffsetInLine;
    const tickPercent = (tickAbsoluteLeft / containerRect.width) * 100;

    this.tickLeftSignal.set(`${tickPercent}%`);
  }
}
