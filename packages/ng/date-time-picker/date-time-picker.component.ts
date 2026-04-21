import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import { TextFieldSize, textFieldClasses } from '@mezzanine-ui/core/text-field';
import { CalendarTimeIcon } from '@mezzanine-ui/icons';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznDatePickerCalendar } from '@mezzanine-ui/ng/date-picker';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import {
  FormattedInputErrorMessages,
  MznFormattedInput,
} from '@mezzanine-ui/ng/picker';
import type {
  PopperOffsetOptions,
  PopperPlacement,
} from '@mezzanine-ui/ng/popper';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { MznTimePickerPanel } from '@mezzanine-ui/ng/time-picker';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import clsx from 'clsx';

type FocusedInput = 'left' | 'right' | null;

/**
 * Calendar 設定 bundle — 對應 React 的
 * `calendarProps?: Omit<CalendarProps, 'disableOnNext' | ...>`。
 * 為 escape hatch，用於傳遞未在 top-level flat prop 暴露的額外 CalendarProps。
 */
export interface MznDateTimePickerCalendarProps {
  /** 禁用日曆月份切換按鈕。 */
  disabledMonthSwitch?: boolean;
  /** 禁用日曆年份切換按鈕。 */
  disabledYearSwitch?: boolean;
  /** 顯示月份標題的語系。 */
  displayMonthLocale?: string;
  /** 顯示星期列標題的語系。 */
  displayWeekDayLocale?: string;
  /** 自訂單日期禁用判斷。 */
  isDateDisabled?: (date: DateType) => boolean;
  /** 自訂半年禁用判斷。 */
  isHalfYearDisabled?: (date: DateType) => boolean;
  /** 自訂月份禁用判斷。 */
  isMonthDisabled?: (date: DateType) => boolean;
  /** 自訂季度禁用判斷。 */
  isQuarterDisabled?: (date: DateType) => boolean;
  /** 自訂週禁用判斷。 */
  isWeekDisabled?: (date: DateType) => boolean;
  /** 自訂年份禁用判斷。 */
  isYearDisabled?: (date: DateType) => boolean;
  /** 日曆初始顯示的參考日期。 */
  referenceDate?: DateType;
}

/**
 * 單一 input 欄位的 escape hatch bundle — 對應 React 的
 * `inputLeftProps` / `inputRightProps`。常用欄位（placeholder / errorMessages /
 * validate）皆已於 top-level 以 `xxxLeft` / `xxxRight` 後綴暴露為 flat input；
 * 本 bundle 為 React 提供的 escape hatch，僅保留 `ariaLabel`。
 */
export interface MznDateTimePickerInputProps {
  /** aria-label 屬性（內部 `<input>`）。 */
  ariaLabel?: string;
}

/**
 * Popper 行為 bundle — 對應 React 的 `popperProps`。
 * 包含使用者需要覆寫的 floating-ui 選項。
 */
export interface MznDateTimePickerPopperProps {
  /** 彈出層位置。 @default 'bottom-start' */
  placement?: PopperPlacement;
  /** 彈出層位移。 @default { mainAxis: 4 } */
  offsetOptions?: PopperOffsetOptions;
}

/**
 * 日期時間選擇器元件，對應 React 的 `DateTimePicker`。
 *
 * 結構：左側日期輸入框 + 分隔線 + 右側時間輸入框。
 * 聚焦左側時開啟 `MznDatePickerCalendar`，聚焦右側時開啟 `MznTimePickerPanel`，
 * 兩個彈出層分別獨立管理 open 狀態（對應 React 的 `focusedInput`）。
 *
 * 本元件**遵循「鏡像 React prop shape」規範**（見
 * `.claude/skills/architecting-angular-components/SKILL.md`）：React 有 flat 的就 flat、
 * React 有 bundle 的就 bundle、兩者共存時 Angular 也共存。Angular 不自己發明抽象。
 * flat input 與 bundle input 同時提供時，flat 優先覆寫 bundle。
 *
 * @example
 * ```ts
 * // 使用端可用 flat 寫法
 * import { MznDateTimePicker } from '@mezzanine-ui/ng/date-time-picker';
 *
 * @Component({
 *   template: `
 *     <div mznDateTimePicker
 *       [(ngModel)]="dateTime"
 *       [displayMonthLocale]="'zh-TW'"
 *       [isDateDisabled]="isDisabled"
 *     ></div>
 *   `,
 * })
 * class HostFlat {
 *   dateTime?: string;
 *   isDisabled = (d: string) => d === '2026-01-01';
 * }
 * ```
 *
 * @example
 * ```ts
 * // 或使用 bundle 寫法（適合傳大量 CalendarProps）。
 * // bundle 必須 hoist 到 field/signal 避免 OnPush CD 陷阱。
 * import {
 *   MznDateTimePicker,
 *   MznDateTimePickerCalendarProps,
 * } from '@mezzanine-ui/ng/date-time-picker';
 *
 * @Component({
 *   template: `<div mznDateTimePicker [calendarProps]="calBundle"></div>`,
 * })
 * class HostBundle {
 *   readonly calBundle: MznDateTimePickerCalendarProps = {
 *     displayMonthLocale: 'zh-TW',
 *     isDateDisabled: (d) => d === '2026-01-01',
 *   };
 * }
 * ```
 */
@Component({
  selector: '[mznDateTimePicker]',
  standalone: true,
  imports: [
    MznClearActions,
    MznDatePickerCalendar,
    MznFormattedInput,
    MznIcon,
    MznTimePickerPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznDateTimePicker)],
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': '"textbox"',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(keydown)': 'onKeydown($event)',
    '[attr.calendarProps]': 'null',
    '[attr.clearable]': 'null',
    '[attr.defaultValue]': 'null',
    '[attr.disableOnDoubleNext]': 'null',
    '[attr.disableOnDoublePrev]': 'null',
    '[attr.disableOnNext]': 'null',
    '[attr.disableOnPrev]': 'null',
    '[attr.disabled]': 'null',
    '[attr.disabledMonthSwitch]': 'null',
    '[attr.disabledYearSwitch]': 'null',
    '[attr.displayMonthLocale]': 'null',
    '[attr.error]': 'null',
    '[attr.errorMessagesLeft]': 'null',
    '[attr.errorMessagesRight]': 'null',
    '[attr.forceShowClearable]': 'null',
    '[attr.formatDate]': 'null',
    '[attr.formatTime]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.hideHour]': 'null',
    '[attr.hideMinute]': 'null',
    '[attr.hideSecond]': 'null',
    '[attr.hideSuffixWhenClearable]': 'null',
    '[attr.hourStep]': 'null',
    '[attr.hoverValueLeft]': 'null',
    '[attr.inputLeftProps]': 'null',
    '[attr.inputRightProps]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.isHalfYearDisabled]': 'null',
    '[attr.isMonthDisabled]': 'null',
    '[attr.isQuarterDisabled]': 'null',
    '[attr.isWeekDisabled]': 'null',
    '[attr.isYearDisabled]': 'null',
    '[attr.minuteStep]': 'null',
    '[attr.mode]': 'null',
    '[attr.placeholderLeft]': 'null',
    '[attr.placeholderRight]': 'null',
    '[attr.popperProps]': 'null',
    '[attr.popperPropsTime]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.referenceDate]': 'null',
    '[attr.required]': 'null',
    '[attr.secondStep]': 'null',
    '[attr.size]': 'null',
    '[attr.validateLeft]': 'null',
    '[attr.validateRight]': 'null',
    '[attr.value]': 'null',
    '[attr.warning]': 'null',
  },
  template: `
    <div [class]="separatorInputsClass">
      <div [class]="separatorInputClass">
        <div
          #leftInputEl
          mznFormattedInput
          [ariaLabel]="resolvedLeftAriaLabel()"
          [ariaMultiline]="false"
          [ariaReadonly]="readOnly() || undefined"
          [ariaRequired]="required()"
          [disabled]="disabled()"
          [errorMessages]="resolvedLeftErrorMessages()"
          [format]="formatDateResolved()"
          [hoverValue]="resolvedHoverValueLeft()"
          [placeholder]="resolvedLeftPlaceholder()"
          [validate]="resolvedLeftValidate()"
          [value]="displayDateValue()"
          (inputBlurred)="onLeftBlur($event)"
          (inputFocused)="onLeftFocus($event)"
          (pasteIsoValue)="onPasteIsoValueLeft($event)"
          (valueChanged)="onLeftChanged($event)"
          (valueCleared)="onLeftCleared()"
        ></div>
      </div>
      <div [class]="separatorClass"></div>
      <div [class]="separatorInputClass">
        <div
          #rightInputEl
          mznFormattedInput
          [ariaLabel]="resolvedRightAriaLabel()"
          [ariaMultiline]="false"
          [ariaReadonly]="readOnly() || undefined"
          [ariaRequired]="required()"
          [disabled]="disabled()"
          [errorMessages]="resolvedRightErrorMessages()"
          [format]="formatTimeResolved()"
          [placeholder]="resolvedRightPlaceholder()"
          [validate]="resolvedRightValidate()"
          [value]="displayTimeValue()"
          (inputBlurred)="onRightBlur($event)"
          (inputFocused)="onRightFocus($event)"
          (pasteIsoValue)="onPasteIsoValueRight($event)"
          (valueChanged)="onRightChanged($event)"
          (valueCleared)="onRightCleared()"
        ></div>
      </div>
    </div>
    <div [class]="suffixClasses()">
      <div [class]="suffixContentClass">
        <i
          mznIcon
          aria-label="Open calendar"
          [clickable]="true"
          [icon]="calendarIcon"
          (click)="onCalendarIconClick($event)"
        ></i>
      </div>
      @if (clearable() && !readOnly()) {
        <button
          mznClearActions
          type="clearable"
          [class]="clearIconClass"
          tabindex="-1"
          (mousedown)="$event.preventDefault()"
          (clicked)="onClear($event)"
        ></button>
      }
    </div>
    @if (openCalendar()) {
      <div
        mznDatePickerCalendar
        [anchor]="hostElement"
        [open]="true"
        [mode]="mode()"
        [referenceDate]="internalReferenceDate()"
        [value]="dateValue()"
        [disabledMonthSwitch]="resolvedCalendar().disabledMonthSwitch"
        [disabledYearSwitch]="resolvedCalendar().disabledYearSwitch"
        [disableOnNext]="resolvedDisableOnNext()"
        [disableOnPrev]="resolvedDisableOnPrev()"
        [disableOnDoubleNext]="resolvedDisableOnDoubleNext()"
        [disableOnDoublePrev]="resolvedDisableOnDoublePrev()"
        [displayMonthLocale]="resolvedCalendar().displayMonthLocale"
        [displayWeekDayLocale]="resolvedCalendar().displayWeekDayLocale"
        [isDateDisabled]="resolvedCalendar().isDateDisabled"
        [isHalfYearDisabled]="resolvedCalendar().isHalfYearDisabled"
        [isMonthDisabled]="resolvedCalendar().isMonthDisabled"
        [isQuarterDisabled]="resolvedCalendar().isQuarterDisabled"
        [isWeekDisabled]="resolvedCalendar().isWeekDisabled"
        [isYearDisabled]="resolvedCalendar().isYearDisabled"
        [popperPlacement]="resolvedPopperPlacement()"
        [popperOffsetOptions]="resolvedPopperOffsetOptions()"
        (dateChanged)="onCalendarDateChange($event)"
        (hover)="onCalendarHover($event)"
        (leave)="onCalendarLeave()"
      ></div>
    }
    @if (openTimePanel()) {
      <div
        mznTimePickerPanel
        [anchor]="hostElement"
        [open]="true"
        [value]="pendingTimeValue()"
        [hideHour]="hideHour()"
        [hideMinute]="hideMinute()"
        [hideSecond]="hideSecond()"
        [hourStep]="hourStep()"
        [minuteStep]="minuteStep()"
        [secondStep]="secondStep()"
        [popperPlacement]="resolvedPopperTimePlacement()"
        [popperOffsetOptions]="resolvedPopperTimeOffsetOptions()"
        (timeChanged)="onTimePanelChange($event)"
        (confirmed)="onTimeConfirm()"
        (cancelled)="onTimeCancel()"
      ></div>
    }
  `,
})
export class MznDateTimePicker implements ControlValueAccessor, AfterViewInit {
  private readonly config = inject(MZN_CALENDAR_CONFIG);
  private readonly clickAway = inject(ClickAwayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);
  protected readonly hostElement = this.hostElRef.nativeElement;

  // ---------------------------------------------------------------------------
  // Inputs — flat (alphabetical, prop-for-prop mirror of React)
  // ---------------------------------------------------------------------------

  /** 是否可清除。 @default true */
  readonly clearable = input(true);

  /** 預設值（非受控初始值）。 */
  readonly defaultValue = input<DateType | undefined>(undefined);

  /** 是否禁用。 @default false */
  readonly disabled = input(false);

  /** 禁用日曆的「向後跳兩格」控制。 */
  readonly disableOnDoubleNext = input<boolean | undefined>(undefined);

  /** 禁用日曆的「向前跳兩格」控制。 */
  readonly disableOnDoublePrev = input<boolean | undefined>(undefined);

  /** 禁用日曆的「向後一格」控制。 */
  readonly disableOnNext = input<boolean | undefined>(undefined);

  /** 禁用日曆的「向前一格」控制。 */
  readonly disableOnPrev = input<boolean | undefined>(undefined);

  /** 禁用日曆月份切換按鈕。 */
  readonly disabledMonthSwitch = input<boolean | undefined>(undefined);

  /** 禁用日曆年份切換按鈕。 */
  readonly disabledYearSwitch = input<boolean | undefined>(undefined);

  /** 顯示月份標題的語系。 */
  readonly displayMonthLocale = input<string | undefined>(undefined);

  /** 是否有錯誤。 @default false */
  readonly error = input(false);

  /** 左側輸入框錯誤訊息設定。 */
  readonly errorMessagesLeft = input<FormattedInputErrorMessages | undefined>(
    undefined,
  );

  /** 右側輸入框錯誤訊息設定。 */
  readonly errorMessagesRight = input<FormattedInputErrorMessages | undefined>(
    undefined,
  );

  /** 強制顯示清除按鈕（忽略 value 檢查）。 @default false */
  readonly forceShowClearable = input(false);

  /** 日期部分顯示格式（左側輸入框）。未設定時使用 config.defaultDateFormat。 */
  readonly formatDate = input<string | undefined>(undefined);

  /** 時間部分顯示格式（右側輸入框）。未設定時依 hideSecond 決定格式。 */
  readonly formatTime = input<string | undefined>(undefined);

  /** 是否全寬。 @default false */
  readonly fullWidth = input(false);

  /** 是否隱藏小時欄。 @default false */
  readonly hideHour = input(false);

  /** 是否隱藏分鐘欄。 @default false */
  readonly hideMinute = input(false);

  /** 是否隱藏秒鐘欄。 @default false */
  readonly hideSecond = input(false);

  /** 有 clearable 時隱藏 suffix。 @default false */
  readonly hideSuffixWhenClearable = input(false);

  /** 小時步長。 @default 1 */
  readonly hourStep = input(1);

  /** 左側輸入框 hover 預覽值（覆寫內部 hover 計算，通常無需使用）。 */
  readonly hoverValueLeft = input<string | undefined>(undefined);

  /** 自訂單日期禁用判斷。 */
  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂半年禁用判斷。 */
  readonly isHalfYearDisabled = input<
    ((date: DateType) => boolean) | undefined
  >(undefined);

  /** 自訂月份禁用判斷。 */
  readonly isMonthDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂季度禁用判斷。 */
  readonly isQuarterDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂週禁用判斷。 */
  readonly isWeekDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂年份禁用判斷。 */
  readonly isYearDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 分鐘步長。 @default 1 */
  readonly minuteStep = input(1);

  /**
   * 日曆模式。對應 React `DatePickerCalendarProps['mode']`。
   * DateTimePicker 目前僅支援 'day'。
   * @default 'day'
   */
  readonly mode = input<CalendarMode>('day');

  /** 左側輸入框佔位文字。 */
  readonly placeholderLeft = input<string | undefined>(undefined);

  /** 右側輸入框佔位文字。 */
  readonly placeholderRight = input<string | undefined>(undefined);

  /** 是否唯讀。 @default false */
  readonly readOnly = input(false);

  /** 日曆初始顯示的參考日期。 */
  readonly referenceDate = input<DateType | undefined>(undefined);

  /** 是否必填。 @default false */
  readonly required = input(false);

  /** 秒鐘步長。 @default 1 */
  readonly secondStep = input(1);

  /** 尺寸。 @default 'main' */
  readonly size = input<TextFieldSize>('main');

  /** 左側輸入框自訂驗證函式。 */
  readonly validateLeft = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );

  /** 右側輸入框自訂驗證函式。 */
  readonly validateRight = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );

  /** 外部值（受控模式）。 */
  readonly value = input<DateType | undefined>(undefined);

  /** warning 狀態。 @default false */
  readonly warning = input(false);

  // ---------------------------------------------------------------------------
  // Inputs — bundles (escape hatches, React-parallel)
  // ---------------------------------------------------------------------------

  /** 日曆設定 escape hatch bundle — 對應 React `calendarProps`。 */
  readonly calendarProps = input<MznDateTimePickerCalendarProps | undefined>(
    undefined,
  );

  /** 左側輸入框 escape hatch bundle — 對應 React `inputLeftProps`。 */
  readonly inputLeftProps = input<MznDateTimePickerInputProps | undefined>(
    undefined,
  );

  /** 右側輸入框 escape hatch bundle — 對應 React `inputRightProps`。 */
  readonly inputRightProps = input<MznDateTimePickerInputProps | undefined>(
    undefined,
  );

  /** 日曆彈出層 popper 設定 bundle — 對應 React `popperProps`。 */
  readonly popperProps = input<MznDateTimePickerPopperProps | undefined>(
    undefined,
  );

  /** 時間面板彈出層 popper 設定 bundle — 對應 React `popperPropsTime`。 */
  readonly popperPropsTime = input<MznDateTimePickerPopperProps | undefined>(
    undefined,
  );

  // ---------------------------------------------------------------------------
  // Outputs — 對齊 React 命名（去 `on` 前綴、lowerCamelCase）
  // ---------------------------------------------------------------------------

  /** 日期時間值變更事件 — 對應 React `onChange`。 */
  readonly change = output<DateType | undefined>();

  /** 左側輸入框失焦。 */
  readonly blurLeft = output<FocusEvent>();

  /** 右側輸入框失焦。 */
  readonly blurRight = output<FocusEvent>();

  /** 時間面板取消事件。 */
  readonly cancel = output<void>();

  /** 左側輸入框值變更（typed input）。 */
  readonly changeLeft = output<string>();

  /** 右側輸入框值變更（typed input）。 */
  readonly changeRight = output<string>();

  /** 清除事件。 */
  readonly clear = output<MouseEvent>();

  /** 時間面板確認事件。 */
  readonly confirm = output<void>();

  /** 左側輸入框聚焦。 */
  readonly focusLeft = output<FocusEvent>();

  /** 右側輸入框聚焦。 */
  readonly focusRight = output<FocusEvent>();

  /** 日曆 hover 預覽事件（傳遞 hover 的日期）。 */
  readonly hover = output<DateType>();

  /** 日曆 mouseleave 事件。 */
  readonly leave = output<void>();

  /** 左側輸入完成（mask 填滿）事件。 */
  readonly leftComplete = output<void>();

  /** 彈出層 toggle 事件。 */
  readonly panelToggle = output<{
    open: boolean;
    focusedInput: FocusedInput;
  }>();

  /** 左側輸入框貼上有效 ISO 日期事件。 */
  readonly pasteIsoValueLeft = output<string>();

  /** 右側輸入框貼上有效 ISO 日期事件。 */
  readonly pasteIsoValueRight = output<string>();

  /** 右側輸入完成（mask 填滿）事件。 */
  readonly rightComplete = output<void>();

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------

  /** 目前聚焦的輸入框。 */
  private readonly focusedInput = signal<FocusedInput>(null);

  /** 已選取的日期部分（不含時間）。 */
  private readonly dateValueSig = signal<DateType | undefined>(undefined);

  /** 已 commit 的時間部分。 */
  private readonly timeValueSig = signal<DateType | undefined>(undefined);

  /** 時間面板暫存值：使用者在面板中調整但尚未按 Confirm 時的值。 */
  private readonly pendingTimeValueSig = signal<DateType | undefined>(
    undefined,
  );

  /** 日曆 hover 預覽日期（內部計算）。 */
  private readonly hoverDate = signal<DateType | undefined>(undefined);

  /** 日曆內部 referenceDate — 隨已選日期跟著走；預設當下日期。 */
  protected readonly internalReferenceDate = signal<DateType>(
    this.config.startOf(this.config.getNow(), 'day'),
  );

  /** Host hover state for clearable visibility. */
  private readonly isHovered = signal(false);

  // ---------------------------------------------------------------------------
  // Static class references
  // ---------------------------------------------------------------------------

  protected readonly calendarIcon = CalendarTimeIcon;
  protected readonly clearIconClass = textFieldClasses.clearIcon;
  protected readonly separatorInputsClass = pickerClasses.separatorInputs;
  protected readonly separatorInputClass = pickerClasses.separatorInput;
  protected readonly separatorClass = pickerClasses.separator;
  protected readonly suffixContentClass = textFieldClasses.suffixContent;

  // ---------------------------------------------------------------------------
  // Computed — merge flat + bundle (flat wins)
  // ---------------------------------------------------------------------------

  /**
   * 合併 flat input 與 `calendarProps` bundle 為單一 view-model。flat 優先覆寫 bundle。
   * Template 讀取時用 `resolvedCalendar().xxx`。
   */
  protected readonly resolvedCalendar = computed(
    (): MznDateTimePickerCalendarProps => {
      const bundle = this.calendarProps() ?? {};
      return {
        disabledMonthSwitch:
          this.disabledMonthSwitch() ?? bundle.disabledMonthSwitch,
        disabledYearSwitch:
          this.disabledYearSwitch() ?? bundle.disabledYearSwitch,
        displayMonthLocale:
          this.displayMonthLocale() ?? bundle.displayMonthLocale,
        // displayWeekDayLocale is only exposed via calendarProps bundle
        // (React does not Pick it into DatePickerCalendarProps).
        displayWeekDayLocale: bundle.displayWeekDayLocale,
        isDateDisabled: this.isDateDisabled() ?? bundle.isDateDisabled,
        isHalfYearDisabled:
          this.isHalfYearDisabled() ?? bundle.isHalfYearDisabled,
        isMonthDisabled: this.isMonthDisabled() ?? bundle.isMonthDisabled,
        isQuarterDisabled: this.isQuarterDisabled() ?? bundle.isQuarterDisabled,
        isWeekDisabled: this.isWeekDisabled() ?? bundle.isWeekDisabled,
        isYearDisabled: this.isYearDisabled() ?? bundle.isYearDisabled,
        referenceDate: this.referenceDate() ?? bundle.referenceDate,
      };
    },
  );

  /** disable-on-* 不屬於 calendarProps bundle（React 也沒放在 calendarProps 裡），單獨解析。 */
  protected readonly resolvedDisableOnNext = computed((): boolean | undefined =>
    this.disableOnNext(),
  );
  protected readonly resolvedDisableOnPrev = computed((): boolean | undefined =>
    this.disableOnPrev(),
  );
  protected readonly resolvedDisableOnDoubleNext = computed(
    (): boolean | undefined => this.disableOnDoubleNext(),
  );
  protected readonly resolvedDisableOnDoublePrev = computed(
    (): boolean | undefined => this.disableOnDoublePrev(),
  );

  protected readonly resolvedPopperPlacement = computed(
    (): PopperPlacement => this.popperProps()?.placement ?? 'bottom-start',
  );

  protected readonly resolvedPopperOffsetOptions = computed(
    (): PopperOffsetOptions =>
      this.popperProps()?.offsetOptions ?? { mainAxis: 4 },
  );

  protected readonly resolvedPopperTimePlacement = computed(
    (): PopperPlacement => this.popperPropsTime()?.placement ?? 'bottom-start',
  );

  protected readonly resolvedPopperTimeOffsetOptions = computed(
    (): PopperOffsetOptions =>
      this.popperPropsTime()?.offsetOptions ?? { mainAxis: 4 },
  );

  protected readonly dateValue = computed(() => this.dateValueSig());
  protected readonly pendingTimeValue = computed(() =>
    this.pendingTimeValueSig(),
  );

  protected readonly openCalendar = computed(
    (): boolean => this.focusedInput() === 'left' && !this.readOnly(),
  );

  protected readonly openTimePanel = computed(
    (): boolean => this.focusedInput() === 'right' && !this.readOnly(),
  );

  /** 任一 popover 是否開啟。 */
  protected readonly isOpen = computed(
    (): boolean => this.openCalendar() || this.openTimePanel(),
  );

  // ---------------------------------------------------------------------------
  // Computed — format & display
  // ---------------------------------------------------------------------------

  protected readonly formatDateResolved = computed(
    (): string => this.formatDate() ?? this.config.defaultDateFormat,
  );

  protected readonly formatTimeResolved = computed((): string => {
    const fmt = this.formatTime();
    if (fmt) return fmt;
    return this.hideSecond() ? 'HH:mm' : this.config.defaultTimeFormat;
  });

  protected readonly resolvedLeftPlaceholder = computed(
    (): string | undefined =>
      this.placeholderLeft() ?? this.formatDateResolved(),
  );

  protected readonly resolvedRightPlaceholder = computed(
    (): string | undefined =>
      this.placeholderRight() ?? this.formatTimeResolved(),
  );

  protected readonly resolvedLeftAriaLabel = computed(
    (): string => this.inputLeftProps()?.ariaLabel ?? 'Date input',
  );

  protected readonly resolvedRightAriaLabel = computed(
    (): string => this.inputRightProps()?.ariaLabel ?? 'Time input',
  );

  protected readonly resolvedLeftErrorMessages = computed(
    (): FormattedInputErrorMessages =>
      this.errorMessagesLeft() ?? {
        enabled: true,
        invalidInput: 'Input value is not valid.',
        invalidPaste: 'Pasted content is not valid.',
      },
  );

  protected readonly resolvedRightErrorMessages = computed(
    (): FormattedInputErrorMessages =>
      this.errorMessagesRight() ?? {
        enabled: true,
        invalidInput: 'Input value is not valid.',
        invalidPaste: 'Pasted content is not valid.',
      },
  );

  /** 左側 typed-input 驗證：使用者自訂 `validateLeft` 優先，fallback 到 isDateDisabled。 */
  protected readonly resolvedLeftValidate = computed(
    (): ((isoDate: string) => boolean) | undefined => {
      const override = this.validateLeft();
      if (override) return override;
      const isDis = this.resolvedCalendar().isDateDisabled;
      if (!isDis) return undefined;
      return (isoDate: string): boolean => {
        const c = this.config;
        const parsed = c.parseFormattedValue(
          isoDate,
          this.formatDateResolved(),
          c.locale,
        );
        if (!parsed) return false;
        return !isDis(parsed);
      };
    },
  );

  protected readonly resolvedRightValidate = computed(
    (): ((isoDate: string) => boolean) | undefined => this.validateRight(),
  );

  protected readonly displayDateValue = computed((): string | undefined => {
    const val = this.dateValueSig();
    if (!val) return undefined;
    return (
      this.config.formatToString(
        this.config.locale,
        val,
        this.formatDateResolved(),
      ) ?? undefined
    );
  });

  protected readonly displayTimeValue = computed((): string | undefined => {
    const val = this.timeValueSig();
    if (!val) return undefined;
    return (
      this.config.formatToString(
        this.config.locale,
        val,
        this.formatTimeResolved(),
      ) ?? undefined
    );
  });

  /** 內部計算的 hover preview（沒傳 `hoverValueLeft` 時使用）。 */
  private readonly internalHoverValueLeft = computed((): string | undefined => {
    const hover = this.hoverDate();
    if (!this.openCalendar() || !hover) return undefined;
    if (this.displayDateValue()) return undefined;
    return (
      this.config.formatToString(
        this.config.locale,
        hover,
        this.formatDateResolved(),
      ) ?? undefined
    );
  });

  /** 左側輸入 hover preview — flat `hoverValueLeft` 覆寫內部計算。 */
  protected readonly resolvedHoverValueLeft = computed(
    (): string | undefined =>
      this.hoverValueLeft() ?? this.internalHoverValueLeft(),
  );

  // ---------------------------------------------------------------------------
  // Computed — host classes
  // ---------------------------------------------------------------------------

  /**
   * Host classes — 完整對應 React TextField 的 host class 組合。
   */
  protected readonly hostClasses = computed((): string =>
    clsx(
      pickerClasses.host,
      pickerClasses.hostDatetime,
      textFieldClasses.host,
      this.size() === 'sub' ? textFieldClasses.sub : textFieldClasses.main,
      {
        [textFieldClasses.slimGap]: this.clearable(),
        [textFieldClasses.clearable]: !this.readOnly() && this.clearable(),
        [textFieldClasses.clearing]: this.shouldShowClearable(),
        [textFieldClasses.disabled]: this.disabled(),
        [textFieldClasses.error]: this.error(),
        [textFieldClasses.fullWidth]: this.fullWidth(),
        [textFieldClasses.readonly]: this.readOnly(),
        [textFieldClasses.warning]: this.warning(),
      },
    ),
  );

  /** Suffix wrapper classes — 固定帶 `suffix--overlay`。 */
  protected readonly suffixClasses = computed((): string =>
    clsx(textFieldClasses.suffix, {
      [textFieldClasses.suffixOverlay]: !this.readOnly() && this.clearable(),
    }),
  );

  private readonly shouldShowClearable = computed((): boolean => {
    if (this.readOnly() || !this.clearable()) return false;
    if (this.disabled()) return false;
    if (this.forceShowClearable()) {
      return this.isHovered() || this.focusedInput() !== null;
    }
    const hasValue = !!(this.dateValueSig() || this.timeValueSig());
    return hasValue && (this.isHovered() || this.focusedInput() !== null);
  });

  // ---------------------------------------------------------------------------
  // ViewChildren
  // ---------------------------------------------------------------------------

  private readonly leftInputEl = viewChild('leftInputEl', {
    read: MznFormattedInput,
  });
  private readonly rightInputEl = viewChild('rightInputEl', {
    read: MznFormattedInput,
  });

  // ---------------------------------------------------------------------------
  // CVA
  // ---------------------------------------------------------------------------

  private _onChange: ((value: DateType | undefined) => void) | null = null;
  private _onTouched: (() => void) | null = null;

  constructor() {
    // One-shot defaultValue initialization (React uncontrolled pattern).
    const initial = this.defaultValue();
    if (initial !== undefined) {
      this.dateValueSig.set(initial);
      this.timeValueSig.set(initial);
      if (initial) {
        this.internalReferenceDate.set(this.config.startOf(initial, 'day'));
      }
    }

    // Sync external `value` input (controlled mode) → internal date/time split.
    effect(() => {
      const v = this.value();
      if (v !== undefined) {
        this.dateValueSig.set(v);
        this.timeValueSig.set(v);
        if (v) {
          this.internalReferenceDate.set(this.config.startOf(v, 'day'));
        }
      }
    });

    // Sync resolved referenceDate (flat || bundle) → internalReferenceDate.
    effect(() => {
      const ref = this.resolvedCalendar().referenceDate;
      if (ref) this.internalReferenceDate.set(this.config.startOf(ref, 'day'));
    });

    // Emit panelToggle when focusedInput changes.
    effect(() => {
      const focus = this.focusedInput();
      this.panelToggle.emit({ open: focus !== null, focusedInput: focus });
    });
  }

  writeValue(value: DateType | undefined): void {
    this.dateValueSig.set(value ?? undefined);
    this.timeValueSig.set(value ?? undefined);
    if (value) {
      this.internalReferenceDate.set(this.config.startOf(value, 'day'));
    }
  }

  registerOnChange(fn: (value: DateType | undefined) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  ngAfterViewInit(): void {
    this.clickAway.listen(
      this.hostElRef.nativeElement,
      () => {
        if (this.openTimePanel()) {
          this.onTimeCancel();
        } else if (this.openCalendar()) {
          this.focusedInput.set(null);
        }
        this._onTouched?.();
      },
      this.destroyRef,
    );
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private computeCurrentTime(): DateType {
    const c = this.config;
    const now = c.getNow();
    const h = c.getHour(now);
    const m = c.getMinute(now);
    const s = c.getSecond(now);
    let result = now;
    if (!this.hideHour()) {
      result = c.setHour(
        result,
        Math.min(
          Math.round(h / (this.hourStep() || 1)) * (this.hourStep() || 1),
          23,
        ),
      );
    }
    if (!this.hideMinute()) {
      result = c.setMinute(
        result,
        Math.min(
          Math.round(m / (this.minuteStep() || 1)) * (this.minuteStep() || 1),
          59,
        ),
      );
    }
    if (!this.hideSecond()) {
      result = c.setSecond(
        result,
        Math.min(
          Math.round(s / (this.secondStep() || 1)) * (this.secondStep() || 1),
          59,
        ),
      );
    }
    return result;
  }

  private combineDateTime(
    date: DateType | undefined,
    time: DateType | undefined,
  ): DateType | undefined {
    if (!date) return undefined;
    const c = this.config;
    const timeSource = time ?? c.getNow();
    return c.setHour(
      c.setMinute(
        c.setSecond(date, c.getSecond(timeSource)),
        c.getMinute(timeSource),
      ),
      c.getHour(timeSource),
    );
  }

  private notifyChange(
    date: DateType | undefined,
    time: DateType | undefined,
  ): void {
    if (date && time) {
      const combined = this.combineDateTime(date, time);
      this._onChange?.(combined);
      this.change.emit(combined);
    }
  }

  private closeAllPanels(): void {
    this.focusedInput.set(null);
  }

  // ---------------------------------------------------------------------------
  // Host event handlers
  // ---------------------------------------------------------------------------

  protected onMouseEnter(): void {
    this.isHovered.set(true);
  }

  protected onMouseLeave(): void {
    this.isHovered.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onTimeCancel();
    }
  }

  // ---------------------------------------------------------------------------
  // Left (date) input handlers
  // ---------------------------------------------------------------------------

  protected onLeftFocus(event: FocusEvent): void {
    if (this.readOnly() || this.disabled()) return;
    this.focusedInput.set('left');
    this.focusLeft.emit(event);
  }

  protected onLeftBlur(event: FocusEvent): void {
    this.blurLeft.emit(event);
  }

  protected onLeftChanged(payload: {
    isoValue: string;
    rawDigits: string;
  }): void {
    if (!payload.isoValue) {
      this.dateValueSig.set(undefined);
      return;
    }
    if (!this.config.isValid(payload.isoValue)) return;
    const parsed = payload.isoValue;
    this.dateValueSig.set(parsed);
    this.internalReferenceDate.set(this.config.startOf(parsed, 'day'));
    this.changeLeft.emit(parsed);
    this.notifyChange(parsed, this.timeValueSig());
    this.onLeftComplete();
  }

  protected onLeftCleared(): void {
    this.dateValueSig.set(undefined);
  }

  protected onPasteIsoValueLeft(isoValue: string): void {
    this.pasteIsoValueLeft.emit(isoValue);
    if (!this.timeValueSig() && this.config.isValid(isoValue)) {
      this.timeValueSig.set(isoValue);
    }
  }

  private onLeftComplete(): void {
    this.leftComplete.emit();
    if (this.timeValueSig()) {
      this.closeAllPanels();
    } else {
      setTimeout(() => {
        this.rightInputEl()?.focus();
      }, 0);
    }
  }

  // ---------------------------------------------------------------------------
  // Right (time) input handlers
  // ---------------------------------------------------------------------------

  protected onRightFocus(event: FocusEvent): void {
    if (this.readOnly() || this.disabled()) return;
    this.pendingTimeValueSig.set(
      this.timeValueSig() ?? this.computeCurrentTime(),
    );
    this.focusedInput.set('right');
    this.focusRight.emit(event);
  }

  protected onRightBlur(event: FocusEvent): void {
    this.blurRight.emit(event);
  }

  protected onRightChanged(payload: {
    isoValue: string;
    rawDigits: string;
  }): void {
    if (!payload.isoValue) {
      this.timeValueSig.set(undefined);
      return;
    }
    if (!this.config.isValid(payload.isoValue)) return;
    const parsed = payload.isoValue;
    this.timeValueSig.set(parsed);
    this.changeRight.emit(parsed);
    this.notifyChange(this.dateValueSig(), parsed);
    this.rightComplete.emit();
  }

  protected onRightCleared(): void {
    this.timeValueSig.set(undefined);
  }

  protected onPasteIsoValueRight(isoValue: string): void {
    this.pasteIsoValueRight.emit(isoValue);
    if (!this.dateValueSig() && this.config.isValid(isoValue)) {
      this.dateValueSig.set(isoValue);
      this.internalReferenceDate.set(this.config.startOf(isoValue, 'day'));
    }
  }

  // ---------------------------------------------------------------------------
  // Calendar panel handlers
  // ---------------------------------------------------------------------------

  protected onCalendarDateChange(date: DateType): void {
    this.dateValueSig.set(date);
    this.internalReferenceDate.set(this.config.startOf(date, 'day'));
    this.notifyChange(date, this.timeValueSig());
    this.onLeftComplete();
  }

  protected onCalendarHover(date: DateType): void {
    this.hoverDate.set(date);
    this.hover.emit(date);
  }

  protected onCalendarLeave(): void {
    this.hoverDate.set(undefined);
    this.leave.emit();
  }

  // ---------------------------------------------------------------------------
  // Time panel handlers
  // ---------------------------------------------------------------------------

  protected onTimePanelChange(target: DateType): void {
    if (target) this.pendingTimeValueSig.set(target);
  }

  protected onTimeConfirm(): void {
    const pending = this.pendingTimeValueSig();
    if (pending) {
      this.timeValueSig.set(pending);
      this.notifyChange(this.dateValueSig(), pending);
    }
    this.pendingTimeValueSig.set(undefined);
    this.closeAllPanels();
    this._onTouched?.();
    this.confirm.emit();
  }

  protected onTimeCancel(): void {
    this.pendingTimeValueSig.set(undefined);
    this.closeAllPanels();
    this.cancel.emit();
  }

  // ---------------------------------------------------------------------------
  // Icon / clear handlers
  // ---------------------------------------------------------------------------

  protected onCalendarIconClick(event: Event): void {
    event.stopPropagation();
    if (this.readOnly() || this.disabled()) return;
    if (this.focusedInput() !== null) {
      this.closeAllPanels();
    } else {
      setTimeout(() => {
        this.leftInputEl()?.focus();
      }, 0);
    }
  }

  protected onClear(event: MouseEvent): void {
    this.dateValueSig.set(undefined);
    this.timeValueSig.set(undefined);
    this._onChange?.(undefined);
    this.change.emit(undefined);
    this.clear.emit(event);
    this._onTouched?.();
  }
}
