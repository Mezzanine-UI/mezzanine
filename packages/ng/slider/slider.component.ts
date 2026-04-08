import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  findClosetValueIndex,
  fixRangeSliderValue,
  fixSingleSliderValue,
  getPercentage,
  getSliderRect,
  getValueFromClientX,
  isRangeSlider,
  RangeSliderValue,
  roundToStep,
  sliderClasses as classes,
  SliderValue,
  sortSliderValue,
  toSliderCssVars,
} from '@mezzanine-ui/core/slider';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznInput } from '@mezzanine-ui/ng/input';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 滑桿元件，支援單值與範圍選取模式。
 *
 * 實作 `ControlValueAccessor` 支援 Angular Forms（`ngModel` / `formControlName`）。
 * 可選附加前綴/後綴圖示按鈕，供使用者微調數值。
 * 支援滑鼠拖曳與觸控操作。
 *
 * @example
 * ```html
 * import { MznSlider } from '@mezzanine-ui/ng/slider';
 *
 * <!-- 單值滑桿 -->
 * <div mznSlider [(ngModel)]="volume" [min]="0" [max]="100" [step]="1" ></div>
 *
 * <!-- 範圍滑桿 -->
 * <div mznSlider [value]="[20, 80]" (valueChange)="onRangeChange($event)" ></div>
 *
 * <!-- 附加圖示 -->
 * <div mznSlider [(ngModel)]="volume" [prefixIcon]="MinusIcon" [suffixIcon]="PlusIcon" ></div>
 * ```
 */
@Component({
  selector: '[mznSlider]',
  standalone: true,
  imports: [MznIcon, MznInput],
  providers: [provideValueAccessor(MznSlider)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
    '[attr.disabled]': 'null',
    '[attr.max]': 'null',
    '[attr.min]': 'null',
    '[attr.prefixIcon]': 'null',
    '[attr.step]': 'null',
    '[attr.suffixIcon]': 'null',
    '[attr.withInput]': 'null',
    '[attr.withTick]': 'null',
    '[attr.onPrefixIconClick]': 'null',
    '[attr.onSuffixIconClick]': 'null',
  },
  template: `
    @if (withInput() && isRange()) {
      <div
        mznInput
        [class]="inputClass"
        [inputType]="'number'"
        [value]="startInputValue()"
        (valueChange)="onStartInputValueChange($event)"
        [disabled]="disabled()"
      ></div>
    }
    @if (prefixIcon()) {
      <span
        [class]="iconClass"
        [attr.role]="iconClickable() ? 'button' : null"
        [attr.tabindex]="iconClickable() ? 0 : null"
        [attr.aria-label]="iconClickable() ? 'Decrease value' : null"
        [style.cursor]="iconClickable() ? 'pointer' : null"
        (click)="onPrefixClick()"
        (keydown)="onIconKeyDown($event, 'prefix')"
      >
        <i mznIcon [icon]="prefixIcon()!"></i>
      </span>
    }
    <div [class]="controlsClass">
      <div
        #railEl
        [class]="railClass"
        (mousedown)="onRailMouseDown($event)"
        (touchstart)="onRailTouchStart($event)"
        role="presentation"
      >
        <span></span>
      </div>
      <div
        [class]="trackClass"
        (mousedown)="onRailMouseDown($event)"
        (touchstart)="onRailTouchStart($event)"
        role="presentation"
      >
        <span></span>
      </div>
      @if (isRange()) {
        <div [class]="handlerStartPositionClass">
          <div
            [class]="handlerStartClasses()"
            role="slider"
            tabindex="0"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="rangeValue()[0]"
            [attr.aria-disabled]="disabled()"
            [attr.aria-label]="'Slider Handler 0'"
            (mousedown)="onHandlerMouseDown($event, 0)"
            (touchstart)="onHandlerTouchStart($event, 0)"
          >
            <span></span>
          </div>
        </div>
        <div [class]="handlerEndPositionClass">
          <div
            [class]="handlerEndClasses()"
            role="slider"
            tabindex="0"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="rangeValue()[1]"
            [attr.aria-disabled]="disabled()"
            [attr.aria-label]="'Slider Handler 1'"
            (mousedown)="onHandlerMouseDown($event, 1)"
            (touchstart)="onHandlerTouchStart($event, 1)"
          >
            <span></span>
          </div>
        </div>
      } @else {
        <div [class]="handlerPositionClass">
          <div
            [class]="handlerClasses()"
            role="slider"
            tabindex="0"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="singleValue()"
            [attr.aria-disabled]="disabled()"
            [attr.aria-label]="'Slider Handler'"
            (mousedown)="onHandlerMouseDown($event, -1)"
            (touchstart)="onHandlerTouchStart($event, -1)"
          >
            <span></span>
          </div>
        </div>
      }
      @if (ticks().length > 0) {
        @for (tick of ticks(); track tick.percent) {
          <span
            [class]="tickClass"
            aria-hidden="true"
            [style.left.%]="tick.percent"
            >{{ tick.label }}</span
          >
        }
      }
    </div>
    @if (withInput()) {
      <div
        mznInput
        [class]="inputClass"
        [inputType]="'number'"
        [value]="endInputValue()"
        (valueChange)="onEndInputValueChange($event)"
        [disabled]="disabled()"
      ></div>
    }
    @if (suffixIcon()) {
      <span
        [class]="iconClass"
        [attr.role]="iconClickable() ? 'button' : null"
        [attr.tabindex]="iconClickable() ? 0 : null"
        [attr.aria-label]="iconClickable() ? 'Increase value' : null"
        [style.cursor]="iconClickable() ? 'pointer' : null"
        (click)="onSuffixClick()"
        (keydown)="onIconKeyDown($event, 'suffix')"
      >
        <i mznIcon [icon]="suffixIcon()!"></i>
      </span>
    }
  `,
})
export class MznSlider implements ControlValueAccessor {
  private readonly railRef = viewChild<ElementRef<HTMLDivElement>>('railEl');

  /** 是否禁用。 @default false */
  readonly disabled = input(false);

  /** 最大值。 @default 100 */
  readonly max = input(100);

  /** 最小值。 @default 0 */
  readonly min = input(0);

  /** 前綴圖示。 */
  readonly prefixIcon = input<IconDefinition>();

  /** 步進值。 @default 1 */
  readonly step = input(1);

  /** 後綴圖示。 */
  readonly suffixIcon = input<IconDefinition>();

  /**
   * 是否顯示數值輸入框供使用者直接輸入。
   * @default false
   */
  readonly withInput = input(false);

  /**
   * 刻度設定。傳入數字表示刻度數量（均勻分布），傳入數字陣列指定特定刻度值。
   */
  readonly withTick = input<number | readonly number[] | undefined>(undefined);

  /**
   * 自訂前綴圖示點擊處理函式。提供時取代預設遞減行為。
   * 同時也會觸發 `prefixIconClick` output 事件。
   */
  readonly onPrefixIconClick = input<(() => void) | undefined>(undefined);

  /**
   * 自訂後綴圖示點擊處理函式。提供時取代預設遞增行為。
   * 同時也會觸發 `suffixIconClick` output 事件。
   */
  readonly onSuffixIconClick = input<(() => void) | undefined>(undefined);

  /** 前綴圖示點擊事件。 */
  readonly prefixIconClick = output<void>();

  /** 後綴圖示點擊事件。 */
  readonly suffixIconClick = output<void>();

  /** 值變更事件。 */
  readonly valueChange = output<SliderValue>();

  private readonly internalValue = signal<SliderValue>(0);
  private readonly dragging = signal(false);
  private readonly anchorValue = signal<number | undefined>(undefined);

  readonly resolvedValue = computed((): SliderValue => this.internalValue());

  readonly isRange = computed((): boolean =>
    isRangeSlider(this.resolvedValue()),
  );

  readonly singleValue = computed((): number => {
    const val = this.resolvedValue();

    return isRangeSlider(val) ? val[0] : val;
  });

  readonly rangeValue = computed((): RangeSliderValue => {
    const val = this.resolvedValue();

    return isRangeSlider(val) ? val : [val, val];
  });

  protected readonly iconClickable = computed((): boolean => !this.disabled());

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, { [classes.disabled]: this.disabled() }),
  );

  protected readonly hostStyles = computed((): Record<string, string> => {
    const val = this.resolvedValue();
    const minVal = this.min();
    const maxVal = this.max();

    const fixedValue = isRangeSlider(val)
      ? fixRangeSliderValue(val, minVal, maxVal)
      : fixSingleSliderValue(val, minVal, maxVal);

    return toSliderCssVars({
      trackWidth: getPercentage(
        isRangeSlider(fixedValue)
          ? Math.abs(fixedValue[0] - fixedValue[1])
          : fixedValue - minVal,
        minVal,
        maxVal,
      ),
      trackPosition: getPercentage(
        isRangeSlider(fixedValue)
          ? Math.abs(Math.min(...fixedValue) - minVal)
          : 0,
        minVal,
        maxVal,
      ),
      handlerPosition: getPercentage(
        isRangeSlider(fixedValue) ? 0 : fixedValue - minVal,
        minVal,
        maxVal,
      ),
      handlerStartPosition: getPercentage(
        isRangeSlider(fixedValue)
          ? Math.abs(Math.min(...fixedValue) - minVal)
          : fixedValue,
        minVal,
        maxVal,
      ),
      handlerEndPosition: getPercentage(
        isRangeSlider(fixedValue)
          ? Math.abs(Math.max(...fixedValue) - minVal)
          : fixedValue,
        minVal,
        maxVal,
      ),
    }) as Record<string, string>;
  });

  private readonly activeHandleIndex = computed((): number | undefined => {
    const anchor = this.anchorValue();

    if (typeof anchor !== 'number') {
      return undefined;
    }

    const val = this.resolvedValue();

    return isRangeSlider(val) ? Math.abs(1 - val.indexOf(anchor)) : undefined;
  });

  protected readonly handlerClasses = computed((): string =>
    clsx(classes.handler, {
      [classes.handlerActive]: this.dragging(),
    }),
  );

  protected readonly handlerStartClasses = computed((): string =>
    clsx(classes.handler, {
      [classes.handlerActive]: this.activeHandleIndex() === 0,
    }),
  );

  protected readonly handlerEndClasses = computed((): string =>
    clsx(classes.handler, {
      [classes.handlerActive]: this.activeHandleIndex() === 1,
    }),
  );

  protected readonly controlsClass = classes.controls;
  protected readonly railClass = classes.rail;
  protected readonly trackClass = classes.track;
  protected readonly iconClass = classes.icon;
  protected readonly tickClass = classes.tick;
  protected readonly inputClass = classes.input;
  protected readonly handlerPositionClass = classes.handlerPosition;
  protected readonly handlerStartPositionClass = `${classes.handlerPosition} ${classes.handlerStartPosition}`;
  protected readonly handlerEndPositionClass = `${classes.handlerPosition} ${classes.handlerEndPosition}`;

  /** 起始輸入框的文字狀態（range + withInput 模式）。 */
  protected readonly startInputValue = computed((): string => {
    const val = this.resolvedValue();

    return isRangeSlider(val) ? `${val[0]}` : '';
  });

  /** 結束輸入框的文字狀態（single 或 range + withInput 模式）。 */
  protected readonly endInputValue = computed((): string => {
    const val = this.resolvedValue();

    return isRangeSlider(val) ? `${val[1]}` : `${val}`;
  });

  /** 計算刻度的資料陣列，每筆含 percent（0–100）與 label（顯示文字）。 */
  protected readonly ticks = computed(
    (): readonly { readonly percent: number; readonly label: string }[] => {
      const withTick = this.withTick();
      const minVal = this.min();
      const maxVal = this.max();
      const range = maxVal - minVal;

      if (!withTick) return [];

      const result: { percent: number; label: string }[] = [];

      // Always show min and max
      result.push({ percent: 0, label: `${minVal}` });

      if (Array.isArray(withTick)) {
        (withTick as readonly number[]).forEach((v) => {
          if (v > minVal && v < maxVal) {
            result.push({
              percent: ((v - minVal) / range) * 100,
              label: `${v}`,
            });
          }
        });
      } else {
        const count = withTick as number;

        Array.from({ length: count }, (_, i) => i + 1).forEach((i) => {
          const value = (i / (count + 1)) * range + minVal;
          result.push({
            percent: (i / (count + 1)) * 100,
            label: `${Math.round(value * 100) / 100}`,
          });
        });
      }

      result.push({ percent: 100, label: `${maxVal}` });

      return result;
    },
  );

  // ControlValueAccessor
  private onChange: (value: SliderValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: SliderValue): void {
    this.internalValue.set(value ?? 0);
  }

  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // --- Event handlers ---

  protected onRailMouseDown(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }

    this.handleClickRail(event.clientX);
  }

  protected onRailTouchStart(event: TouchEvent): void {
    if (this.disabled()) {
      return;
    }

    this.handleClickRail(event.changedTouches[0].clientX);
  }

  protected onHandlerMouseDown(event: MouseEvent, handlerIndex: number): void {
    if (this.disabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.startDrag(handlerIndex, 'mouse');
  }

  protected onHandlerTouchStart(event: TouchEvent, handlerIndex: number): void {
    if (this.disabled()) {
      return;
    }

    event.stopPropagation();
    this.startDrag(handlerIndex, 'touch');
  }

  protected onInputValueChange(rawValue: string): void {
    const parsed = Number(rawValue);

    if (Number.isNaN(parsed)) return;

    this.updateValue(this.preventOverflow(parsed));
  }

  protected onStartInputValueChange(rawValue: string): void {
    const parsed = Number(rawValue);

    if (Number.isNaN(parsed)) return;

    const val = this.resolvedValue();

    if (isRangeSlider(val)) {
      const next = this.preventOverflow(parsed);

      this.updateValue(sortSliderValue([next, val[1]]));
    }
  }

  protected onEndInputValueChange(rawValue: string): void {
    const parsed = Number(rawValue);

    if (Number.isNaN(parsed)) return;

    const val = this.resolvedValue();

    if (isRangeSlider(val)) {
      const next = this.preventOverflow(parsed);

      this.updateValue(sortSliderValue([val[0], next]));
    } else {
      this.updateValue(this.preventOverflow(parsed));
    }
  }

  protected onPrefixClick(): void {
    if (this.disabled()) {
      return;
    }

    this.prefixIconClick.emit();

    const customHandler = this.onPrefixIconClick();

    if (customHandler) {
      customHandler();

      return;
    }

    const val = this.resolvedValue();

    if (isRangeSlider(val)) {
      const next = this.preventOverflow(val[0] - this.step());

      this.updateValue(sortSliderValue([next, val[1]]));
    } else {
      this.updateValue(this.preventOverflow(val - this.step()));
    }
  }

  protected onSuffixClick(): void {
    if (this.disabled()) {
      return;
    }

    this.suffixIconClick.emit();

    const customHandler = this.onSuffixIconClick();

    if (customHandler) {
      customHandler();

      return;
    }

    const val = this.resolvedValue();

    if (isRangeSlider(val)) {
      const next = this.preventOverflow(val[1] + this.step());

      this.updateValue(sortSliderValue([val[0], next]));
    } else {
      this.updateValue(this.preventOverflow(val + this.step()));
    }
  }

  protected onIconKeyDown(
    event: KeyboardEvent,
    type: 'prefix' | 'suffix',
  ): void {
    const isActivate = event.key === 'Enter' || event.key === ' ';
    if (!isActivate) return;
    if (event.key === ' ') event.preventDefault();
    if (type === 'prefix') {
      this.onPrefixClick();
    } else {
      this.onSuffixClick();
    }
  }

  // --- Internal helpers ---

  private handleClickRail(clientX: number): void {
    const rail = this.railRef()?.nativeElement;

    if (!rail) {
      return;
    }

    const roundedNewValue = this.getRoundedValue(clientX, rail);
    const val = this.resolvedValue();

    if (isRangeSlider(val)) {
      const closestIdx = findClosetValueIndex(val, roundedNewValue);

      this.anchorValue.set(val[Math.abs(1 - closestIdx)]);

      const newRange: RangeSliderValue = [...val];

      newRange[closestIdx] = roundedNewValue;
      this.updateValue(sortSliderValue(newRange));
    } else {
      this.updateValue(roundedNewValue);
    }

    this.dragging.set(true);
  }

  private startDrag(handlerIndex: number, mode: 'mouse' | 'touch'): void {
    const val = this.resolvedValue();

    this.dragging.set(true);
    this.anchorValue.set(
      isRangeSlider(val) ? val[Math.abs(1 - handlerIndex)] : (val as number),
    );

    const onMove = (e: MouseEvent | TouchEvent): void => {
      const rail = this.railRef()?.nativeElement;

      if (!rail) {
        return;
      }

      const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
      const roundedNewValue = this.getRoundedValue(clientX, rail);
      const currentVal = this.resolvedValue();

      if (isRangeSlider(currentVal)) {
        const newRange: RangeSliderValue = [...currentVal];

        newRange[handlerIndex] = roundedNewValue;
        this.updateValue(sortSliderValue(newRange));
      } else {
        this.updateValue(roundedNewValue);
      }
    };

    const onEnd = (e: Event): void => {
      e.preventDefault();
      this.dragging.set(false);
      this.anchorValue.set(undefined);
      this.onTouched();

      if (mode === 'mouse') {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('mouseleave', onEnd);
      } else {
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        document.removeEventListener('touchcancel', onEnd);
      }
    };

    if (mode === 'mouse') {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('mouseleave', onEnd);
    } else {
      document.addEventListener('touchmove', onMove);
      document.addEventListener('touchend', onEnd);
      document.addEventListener('touchcancel', onEnd);
    }
  }

  private getRoundedValue(clientX: number, rail: HTMLDivElement): number {
    const rect = getSliderRect(rail);
    const rawValue = getValueFromClientX(clientX, rect, this.min(), this.max());

    return roundToStep(rawValue, this.step(), this.min(), this.max());
  }

  private preventOverflow(target: number): number {
    return Math.max(
      this.min(),
      Math.min(
        this.max(),
        roundToStep(target, this.step(), this.min(), this.max()),
      ),
    );
  }

  private updateValue(val: SliderValue): void {
    this.internalValue.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }
}
