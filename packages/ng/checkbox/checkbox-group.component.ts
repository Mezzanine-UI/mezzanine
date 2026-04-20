import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  input,
  output,
  signal,
  Signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  checkboxGroupClasses as classes,
  CheckboxGroupLayout,
} from '@mezzanine-ui/core/checkbox';
import { CheckboxMode, CheckboxSize } from '@mezzanine-ui/core/checkbox';
import clsx from 'clsx';
import { MZN_CHECKBOX_GROUP } from './checkbox-group-context';
import { MznCheckbox } from './checkbox.component';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * CheckboxGroup 的「全選」控制設定（對應 React `level` bundle prop）。
 *
 * 提供此設定後，group 會自動在子 checkbox 前（或 chip 模式下前置於 content
 * wrapper 內）渲染一個全選 checkbox，其 checked / indeterminate 狀態會
 * 依子 checkbox 的 disabled / 已選取狀態動態計算。
 */
export interface CheckboxGroupLevelConfig {
  /** 是否啟用全選控制。 */
  readonly active: boolean;
  /**
   * 全選 checkbox 是否 disabled。
   * @default false
   */
  readonly disabled?: boolean;
  /**
   * 全選 checkbox 的 label 文字。
   * @default ''
   */
  readonly label?: string;
  /**
   * 全選 checkbox 的模式。
   * @default 'default'
   */
  readonly mode?: CheckboxMode;
  /**
   * 自訂 onChange handler，接管預設的「全選 / 全取消」行為。
   *
   * 對應 React `level.onChange: ChangeEventHandler<HTMLInputElement>`；
   * Angular 改傳入 `boolean`（新的 checked 狀態）而非原生 Event，
   * 對齊 Angular 慣例（MznCheckbox 本身也不發 native Event output）。
   * 參見 `DEVIATIONS.md` 中 `checkbox-group` 的記錄。
   */
  readonly onChange?: (checked: boolean) => void;
}

/**
 * 核取方塊群組元件。
 *
 * 透過 DI token `MZN_CHECKBOX_GROUP` 提供共享狀態給子 `MznCheckbox`。
 * 支援 `ngModel` / `formControl` 綁定多選值陣列。提供 `level` bundle
 * 時會額外渲染全選控制 checkbox。
 *
 * @example
 * ```html
 * import { MznCheckboxGroup, MznCheckbox } from '@mezzanine-ui/ng/checkbox';
 *
 * <div mznCheckboxGroup [(ngModel)]="selectedValues" name="fruits">
 *   <div mznCheckbox value="apple">蘋果</div>
 *   <div mznCheckbox value="banana">香蕉</div>
 * </div>
 *
 * <!-- 啟用全選控制 -->
 * <div mznCheckboxGroup
 *   [(ngModel)]="selectedValues"
 *   [level]="{ active: true, label: '全選' }"
 *   name="items"
 * >
 *   <div mznCheckbox value="a">項目 A</div>
 *   <div mznCheckbox value="b">項目 B</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznCheckboxGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznCheckbox],
  providers: [
    provideValueAccessor(MznCheckboxGroup),
    {
      provide: MZN_CHECKBOX_GROUP,
      useExisting: forwardRef(() => MznCheckboxGroup),
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-orientation]': 'ariaOrientation()',
    '[attr.layout]': 'null',
    '[attr.level]': 'null',
    '[attr.mode]': 'null',
    '[attr.size]': 'null',
    '[attr.name]': 'null',
  },
  template: `
    @if (shouldRenderLevelOutside()) {
      <div
        mznCheckbox
        [checked]="levelState().checked"
        [disabled]="levelDisabled()"
        [indeterminate]="levelState().indeterminate"
        [mode]="levelMode()"
        (change)="onLevelInputChange($event)"
        >{{ levelLabel() }}</div
      >
    }
    <div [class]="contentWrapperClasses()">
      @if (shouldRenderLevelInsideContent()) {
        <div
          mznCheckbox
          [checked]="levelState().checked"
          [detached]="true"
          [disabled]="levelDisabled()"
          [indeterminate]="levelState().indeterminate"
          [mode]="levelMode()"
          (change)="onLevelInputChange($event)"
          >{{ levelLabel() }}</div
        >
        @if (isHorizontalLayout()) {
          <i [class]="levelSeparatorClass"></i>
        }
      }
      <ng-content />
    </div>
  `,
})
export class MznCheckboxGroup implements ControlValueAccessor {
  /** 是否禁用所有子 Checkbox。 */
  readonly disabled: Signal<boolean> = input(false);

  /** 佈局方向。 */
  readonly layout = input<CheckboxGroupLayout>('horizontal');

  /** 全選控制設定。 */
  readonly level = input<CheckboxGroupLevelConfig>();

  /** 顯示模式。 */
  readonly mode: Signal<CheckboxMode> = input<CheckboxMode>('default');

  /** 群組名稱。 */
  readonly name: Signal<string> = input('');

  /** 尺寸。 */
  readonly size: Signal<CheckboxSize> = input<CheckboxSize>('main');

  /** 值變更事件。 */
  readonly valueChange = output<ReadonlyArray<string>>();

  private readonly internalValue = signal<ReadonlyArray<string>>([]);

  /** 目前選取值（供子 Checkbox 讀取）。 */
  readonly value: Signal<ReadonlyArray<string>> = computed(() =>
    this.internalValue(),
  );

  /** 群組內所有 MznCheckbox（用於計算 level 狀態）。 */
  private readonly checkboxes = contentChildren(MznCheckbox, {
    descendants: true,
  });

  protected readonly isLevelActive = computed(
    (): boolean => this.level()?.active ?? false,
  );

  protected readonly isChipMode = computed(
    (): boolean => this.mode() === 'chip',
  );

  protected readonly isHorizontalLayout = computed(
    (): boolean => this.layout() === 'horizontal',
  );

  protected readonly shouldRenderLevelInsideContent = computed(
    (): boolean => this.isLevelActive() && this.isChipMode(),
  );

  protected readonly shouldRenderLevelOutside = computed(
    (): boolean => this.isLevelActive() && !this.isChipMode(),
  );

  protected readonly ariaOrientation = computed(
    (): 'vertical' | 'horizontal' =>
      this.isLevelActive() ? 'vertical' : this.layout(),
  );

  protected readonly levelLabel = computed(
    (): string => this.level()?.label ?? '',
  );

  protected readonly levelMode = computed(
    (): CheckboxMode => this.level()?.mode ?? 'default',
  );

  protected readonly levelDisabled = computed(
    (): boolean => (this.level()?.disabled ?? false) || this.disabled(),
  );

  /** 全選 checkbox 的 checked / indeterminate 狀態。 */
  protected readonly levelState = computed(
    (): { checked: boolean; indeterminate: boolean } => {
      if (!this.isLevelActive()) {
        return { checked: false, indeterminate: false };
      }

      const enabledValues = this.enabledValues();
      const currentValue = this.internalValue();
      const selectedEnabled = currentValue.filter((v) =>
        enabledValues.includes(v),
      );

      if (selectedEnabled.length === 0) {
        return { checked: false, indeterminate: false };
      }

      if (selectedEnabled.length === enabledValues.length) {
        return { checked: true, indeterminate: false };
      }

      return { checked: false, indeterminate: true };
    },
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.nested]: this.isLevelActive(),
    }),
  );

  protected readonly contentWrapperClasses = computed((): string =>
    clsx(
      classes.contentWrapper,
      classes.layout(this.layout()),
      this.mode() !== 'default' ? classes.mode(this.mode()) : undefined,
    ),
  );

  protected readonly levelSeparatorClass = classes.levelControlSeparator;

  /** 真正屬於群組的子 checkbox（排除 `detached`，即 level 自身）。 */
  private groupCheckboxes(): readonly MznCheckbox[] {
    return this.checkboxes().filter((cb) => !cb.detached());
  }

  private enabledValues(): readonly string[] {
    return this.groupCheckboxes()
      .filter((cb) => !cb.disabled())
      .map((cb) => cb.value());
  }

  private disabledValues(): readonly string[] {
    return this.groupCheckboxes()
      .filter((cb) => cb.disabled())
      .map((cb) => cb.value());
  }

  // CVA
  private onChange: (value: ReadonlyArray<string>) => void = () => {};
  private onTouched: () => void = () => {};

  /** 子 Checkbox 呼叫此方法切換勾選狀態。 */
  toggle(val: string): void {
    const current = this.internalValue();
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];

    this.setValue(next);
  }

  /**
   * 批次覆寫選取值，單次 emit。供 `MznCheckAll` 等批量操作使用，
   * 避免逐項 toggle 造成多次 valueChange / CVA onChange。
   */
  setValue(next: ReadonlyArray<string>): void {
    this.internalValue.set(next);
    this.onChange(next);
    this.onTouched();
    this.valueChange.emit(next);
  }

  protected onLevelInputChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.handleLevelControlChange(checked);
  }

  private handleLevelControlChange(checked: boolean): void {
    const lvl = this.level();

    if (!lvl?.active) {
      return;
    }

    if (lvl.onChange) {
      lvl.onChange(checked);

      return;
    }

    const enabledValues = this.enabledValues();
    const disabledValues = this.disabledValues();
    const currentValue = this.internalValue();
    const selectedDisabled = currentValue.filter((v) =>
      disabledValues.includes(v),
    );

    const next: readonly string[] = checked
      ? [...enabledValues, ...selectedDisabled]
      : selectedDisabled;

    this.setValue(next);
  }

  writeValue(value: ReadonlyArray<string> | null): void {
    this.internalValue.set(value ?? []);
  }

  registerOnChange(fn: (value: ReadonlyArray<string>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
