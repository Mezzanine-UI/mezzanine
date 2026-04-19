import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  notificationClasses as classes,
  notificationIcons,
  NotificationSeverity,
  NotificationType,
} from '@mezzanine-ui/core/notification-center';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { CloseIcon, DotHorizontalIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { MznButton, MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import {
  buildTransitionString,
  reflow,
} from '@mezzanine-ui/ng/transition/transition-utils';

/**
 * 單項通知元件，對齊 React `<NotificationCenter />` 的 per-item render。
 *
 * 支援 `type='notification'`（浮動提示，附滑入／淡出動畫）與 `type='drawer'`
 * （抽屜列表項，附時間戳記 hover popper 與 Dropdown 操作）。元件只負責
 * 單一通知的渲染；批次顯示請搭配 `MznNotificationCenterDrawer` 或自行
 * 迭代 `*ngFor`。
 *
 * @example
 * ```html
 * import { MznNotificationCenter } from '@mezzanine-ui/ng/notification-center';
 *
 * <div mznNotificationCenter
 *   type="notification"
 *   severity="success"
 *   title="Deployment succeeded"
 *   description="Build #42 is live."
 *   confirmButtonText="View"
 *   (confirmed)="viewBuild()"
 *   (closed)="dismiss($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznNotificationCenter]',
  standalone: true,
  imports: [MznIcon, MznBadge, MznButton, MznButtonGroup, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.opacity]': 'opacityStyle()',
    '[style.transform]': 'transformStyle()',
    '[style.visibility]': 'visibilityStyle()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '[attr.appendTips]': 'null',
    '[attr.cancelButtonText]': 'null',
    '[attr.confirmButtonText]': 'null',
    '[attr.description]': 'null',
    '[attr.duration]': 'null',
    '[attr.from]': 'null',
    '[attr.options]': 'null',
    '[attr.prependTips]': 'null',
    '[attr.reference]': 'null',
    '[attr.severity]': 'null',
    '[attr.showBadge]': 'null',
    '[attr.timeStamp]': 'null',
    '[attr.timeStampLocale]': 'null',
    '[attr.title]': 'null',
    '[attr.type]': 'null',
  },
  template: `
    @if (resolvedIcon(); as icon) {
      <div [class]="iconContainerClass">
        <i mznIcon [class]="severityIconClass" [icon]="icon" [size]="32"></i>
      </div>
    }

    <div [class]="bodyClass">
      <div [class]="bodyContentClass">
        <h4 [class]="titleClass">{{ title() }}</h4>
        <p mznTypography [class]="contentClass" style="margin: 0;">{{
          description()
        }}</p>
      </div>

      @if (showActions()) {
        <div mznButtonGroup [class]="actionClass">
          @if (showCancelButton() && cancelButtonText()) {
            <button
              mznButton
              variant="base-secondary"
              size="minor"
              (click)="onCancelClick()"
            >
              {{ cancelButtonText() }}
            </button>
          }
          @if (showConfirmButton() && confirmButtonText()) {
            <button mznButton size="minor" (click)="onConfirmClick()">
              {{ confirmButtonText() }}
            </button>
          }
        </div>
      }

      @if (type() === 'drawer') {
        <span
          #timeStampRef
          mznTypography
          variant="label-secondary"
          [class]="timeStampClass"
          >{{ formattedTimeStamp() }}</span
        >
      }
    </div>

    @if (type() === 'drawer') {
      <!--
        TODO: 對齊 React 的 <Dropdown><Button>...</Button></Dropdown> 完整結構
        與 timestamp hover <Popper>。目前先渲染 dot button + 紅點徽章，
        DOM 跟 React 的 Dropdown portaled listbox 差一層，後續補上。
      -->
      <button
        mznButton
        variant="base-ghost"
        [class]="dotIconButtonClass"
        (click)="onDotButtonClick()"
      >
        @if (showBadge()) {
          <div mznBadge variant="dot-error"></div>
        }
        <i
          mznIcon
          [class]="closeIconClass"
          [clickable]="true"
          [icon]="dotHorizontalIcon"
          [size]="16"
          (click)="onBadgeClick($event)"
        ></i>
      </button>
    } @else {
      <i
        mznIcon
        [class]="closeIconClass"
        [clickable]="true"
        [icon]="closeIcon"
        [size]="16"
        (click)="onCloseClick()"
      ></i>
    }
  `,
})
export class MznNotificationCenter implements OnInit {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** 附加在項目底部的備註（僅 drawer 模式）。 */
  readonly appendTips = input<string>();

  /** 取消按鈕文字（僅 notification 模式）。@default 'Cancel' */
  readonly cancelButtonText = input<string>('Cancel');

  /** 確認按鈕文字（僅 notification 模式）。@default 'Confirm' */
  readonly confirmButtonText = input<string>('Confirm');

  /**
   * 是否顯示確認按鈕。對應 React `onConfirm` 存在時才顯示的語意 —
   * Angular 的 `output()` 無法從內部 introspect 是否有 subscriber，
   * 所以改以 explicit input 控制。
   * @default false
   */
  readonly showConfirmButton = input(false);

  /**
   * 是否顯示取消按鈕。對應 React `(onCancel || onClose)` 語意的顯式開關。
   * @default false
   */
  readonly showCancelButton = input(false);

  /** 描述內容。 */
  readonly description = input<string>('');

  /**
   * 自動關閉時間（毫秒）。設為 `false` 或省略時不自動關閉。
   * @default false
   */
  readonly duration = input<number | false>(false);

  /**
   * 進場方向（僅 notification 模式）。
   * @default 'top'
   */
  readonly from = input<'right' | 'top'>('top');

  /** drawer mode 右上角 Dropdown 選項。 */
  readonly options = input<ReadonlyArray<DropdownOption>>([]);

  /** 附加在項目頂部的時間分組標籤（僅 drawer 模式）。 */
  readonly prependTips = input<string>();

  /** 通知唯一識別（供 `closed` 事件回傳）。 */
  readonly reference = input<string | number>();

  /** 嚴重程度。@default 'info' */
  readonly severity = input<NotificationSeverity>('info');

  /** drawer mode 點點按鈕上的紅點徽章。@default false */
  readonly showBadge = input(false);

  /** 時間戳記。@default `new Date()` */
  readonly timeStamp = input<string | number | Date>(new Date());

  /** 時間戳記地區。@default 'zh-TW' */
  readonly timeStampLocale = input<string>('zh-TW');

  /** 標題。 */
  readonly title = input<string>('');

  /** 通知類型。@default 'notification' */
  readonly type = input<NotificationType>('notification');

  /** 確認按鈕被點擊。 */
  readonly confirmed = output<void>();

  /** 取消按鈕被點擊（沒傳時點 close 也會退回此事件）。 */
  readonly cancelled = output<void>();

  /** 關閉（X 或 badge 點擊）時發出，payload 為 `reference`。 */
  readonly closed = output<string | number | undefined>();

  /** drawer mode 點點按鈕被點擊。 */
  readonly badgeClicked = output<void>();

  /** drawer mode Dropdown 選項被選中。 */
  readonly badgeSelected = output<DropdownOption>();

  protected readonly closeIcon = CloseIcon;
  protected readonly dotHorizontalIcon = DotHorizontalIcon;
  protected readonly iconContainerClass = classes.iconContainer;
  protected readonly severityIconClass = classes.severityIcon;
  protected readonly bodyClass = classes.body;
  protected readonly bodyContentClass = classes.bodyContent;
  protected readonly titleClass = classes.title;
  protected readonly contentClass = classes.content;
  protected readonly actionClass = classes.action;
  protected readonly closeIconClass = classes.closeIcon;
  protected readonly dotIconButtonClass = classes.dotIconButton;
  protected readonly timeStampClass = classes.timeStamp;

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.severity(this.severity()),
      classes.type(this.type()),
    ),
  );

  protected readonly resolvedIcon = computed(
    () => notificationIcons[this.severity()],
  );

  protected readonly showActions = computed(
    (): boolean =>
      this.type() === 'notification' &&
      ((this.showConfirmButton() && !!this.confirmButtonText()) ||
        (this.showCancelButton() && !!this.cancelButtonText())),
  );

  private parsedTimeStamp = computed((): Date | null => {
    const ts = this.timeStamp();
    const d = ts instanceof Date ? ts : new Date(ts);
    return Number.isNaN(d.getTime()) ? null : d;
  });

  protected readonly formattedTimeStamp = computed((): string => {
    const d = this.parsedTimeStamp();
    const tsRaw = this.timeStamp();
    const tsText =
      typeof tsRaw === 'string'
        ? tsRaw
        : String(tsRaw instanceof Date ? '' : tsRaw);

    if (!d) return tsText;

    const now = Date.now();
    const nowDate = new Date(now);
    const nowStartOfDay = new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate(),
    );
    const tsStartOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const isToday = nowStartOfDay.getTime() === tsStartOfDay.getTime();

    if (isToday) {
      const diffInMs = d.getTime() - now;
      const diffInSeconds = Math.round(diffInMs / 1000);
      const rtf = new Intl.RelativeTimeFormat(this.timeStampLocale(), {
        numeric: 'always',
      });
      const units: Array<{
        unit: Intl.RelativeTimeFormatUnit;
        seconds: number;
      }> = [
        { unit: 'hour', seconds: 3600 },
        { unit: 'minute', seconds: 60 },
      ];
      for (const { unit, seconds } of units) {
        const value = Math.round(diffInSeconds / seconds);
        if (Math.abs(value) >= 1) return rtf.format(value, unit);
      }
      return 'now';
    }

    const hasTimeComponent =
      tsText && (/:\d{2}/.test(tsText) || tsText.includes('T'));
    if (hasTimeComponent) {
      const fmt = new Intl.DateTimeFormat(this.timeStampLocale(), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return fmt.format(d).replace(/\//g, '-');
    }
    const fmt = new Intl.DateTimeFormat(this.timeStampLocale(), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return fmt.format(d).replace(/\//g, '-');
  });

  // ─── Slide-fade transition state (type='notification') ──────────────
  private readonly state = signal<
    'entering' | 'entered' | 'exiting' | 'exited'
  >('exited');

  protected readonly opacityStyle = computed(() => {
    if (this.type() !== 'notification') return undefined;
    const s = this.state();
    return s === 'entering' || s === 'entered' ? 1 : 0;
  });

  protected readonly transformStyle = computed(() => {
    if (this.type() !== 'notification') return undefined;
    const s = this.state();
    if (s === 'entering' || s === 'entered' || s === 'exiting') {
      return 'translate3d(0, 0, 0)';
    }
    const from = this.from();
    return from === 'top'
      ? 'translate3d(0, -100%, 0)'
      : 'translate3d(100%, 0, 0)';
  });

  protected readonly visibilityStyle = computed(() => {
    if (this.type() !== 'notification') return undefined;
    const s = this.state();
    return s === 'exited' ? 'hidden' : undefined;
  });

  // ─── Dropdown state placeholder ─────────────────────────────────────
  // TODO: wire to MznDropdown + MznPopper for full React parity (drawer mode
  // dot button opens an options dropdown, and timestamp hover reveals a raw
  // timestamp popper).
  protected readonly openDropdown = signal(false);

  ngOnInit(): void {
    if (this.type() === 'notification') {
      // Trigger enter transition after first render so the browser commits
      // the initial exited paint before we flip to entering (matches React
      // Transition's slide+fade behaviour via useSetNodeTransition).
      queueMicrotask(() => this.triggerEnter());
    } else {
      this.state.set('entered');
    }

    const duration = this.duration();
    if (
      this.type() === 'notification' &&
      typeof duration === 'number' &&
      duration > 0
    ) {
      const timer = setTimeout(() => this.startExit(), duration);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    }
  }

  // TODO: when MznPopper is wired in, reinstate hover anchor tracking so the
  // raw timeStamp popper shows on hover like React's <Popper anchor={...}>.
  protected onMouseEnter(): void {
    // no-op
  }

  protected onMouseLeave(): void {
    // no-op
  }

  protected onConfirmClick(): void {
    this.confirmed.emit();
    this.startExit();
  }

  protected onCancelClick(): void {
    this.cancelled.emit();
    this.startExit();
  }

  protected onCloseClick(): void {
    this.closed.emit(this.reference());
    this.startExit();
  }

  protected onDotButtonClick(): void {
    this.closed.emit(this.reference());
  }

  protected onBadgeClick(event: Event): void {
    event.stopPropagation();
    this.badgeClicked.emit();
    if (this.options().length > 0) {
      this.openDropdown.set(true);
    }
  }

  protected onBadgeSelect(option: DropdownOption): void {
    this.badgeSelected.emit(option);
    this.openDropdown.set(false);
  }

  private triggerEnter(): void {
    const node = this.hostRef.nativeElement;
    node.style.transition = buildTransitionString('enter', ['transform'], {
      delay: 0,
      duration: {
        enter: MOTION_DURATION.slow,
        exit: MOTION_DURATION.moderate,
      },
      easing: {
        enter: MOTION_EASING.standard,
        exit: MOTION_EASING.exit,
      },
    });
    reflow(node);

    // Double rAF — let browser paint the exited state before flipping so the
    // transition actually animates (same guard MznTranslate/MznFade use).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.state.set('entering');
        const handler = (): void => {
          node.removeEventListener('transitionend', handler);
          this.state.set('entered');
          node.style.transition = '';
        };
        node.addEventListener('transitionend', handler);
      });
    });
  }

  private startExit(): void {
    if (this.type() !== 'notification') return;
    const node = this.hostRef.nativeElement;
    node.style.transition = buildTransitionString('exit', ['opacity'], {
      delay: 0,
      duration: {
        enter: MOTION_DURATION.slow,
        exit: MOTION_DURATION.moderate,
      },
      easing: {
        enter: MOTION_EASING.standard,
        exit: MOTION_EASING.exit,
      },
    });
    this.state.set('exiting');
    const handler = (): void => {
      node.removeEventListener('transitionend', handler);
      this.state.set('exited');
      node.style.transition = '';
    };
    node.addEventListener('transitionend', handler);
  }
}
