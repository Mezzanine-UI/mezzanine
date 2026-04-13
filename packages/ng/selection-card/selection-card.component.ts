import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  selectionCardClasses as classes,
  SelectionCardDirection,
  SelectionCardImageObjectFit,
  SelectionCardType,
} from '@mezzanine-ui/core/selection-card';
import { IconDefinition, FileIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

const SELECTION_ICON_SIZE = 26;

/**
 * 選擇卡片元件。
 *
 * 支援 radio 或 checkbox 選取模式，可顯示圖片或圖示。
 * 實作 `ControlValueAccessor` 支援 Angular Forms。
 *
 * @example
 * ```html
 * import { MznSelectionCard } from '@mezzanine-ui/ng/selection-card';
 *
 * <label mznSelectionCard
 *   selector="radio"
 *   text="選項 A"
 *   supportingText="說明文字"
 *   [(ngModel)]="selected"
 *   value="a"
 * ></label>
 * ```
 */
@Component({
  selector: '[mznSelectionCard]',
  host: {
    '[attr.checked]': 'null',
    '[attr.customIcon]': 'null',
    '[attr.defaultChecked]': 'null',
    '[attr.direction]': 'null',
    '[attr.disabled]': 'null',
    '[attr.image]': 'null',
    '[attr.imageObjectFit]': 'null',
    '[attr.name]': 'null',
    '[attr.readonly]': 'null',
    '[attr.selector]': 'null',
    '[attr.supportingText]': 'null',
    '[attr.supportingTextMaxWidth]': 'null',
    '[attr.text]': 'null',
    '[attr.textMaxWidth]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  imports: [MznIcon, MznTypography],
  providers: [provideValueAccessor(MznSelectionCard)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [class]="hostClasses()" (click)="onClick.emit($event)">
      <div [class]="containerClass">
        @if (image()) {
          <img
            [src]="image()"
            [class]="imageClass"
            [style.object-fit]="imageObjectFit()"
            alt=""
          />
        } @else {
          <i
            mznIcon
            [icon]="resolvedIcon()"
            [class]="iconClass"
            aria-hidden="true"
            color="neutral-solid"
            [size]="iconSize"
          ></i>
        }
        <div [class]="contentClass">
          <p
            mznTypography
            variant="body-highlight"
            color="text-neutral-solid"
            display="block"
            [ellipsis]="true"
            [class]="textClass"
            [style.max-width]="textMaxWidth()"
            >{{ text() }}</p
          >
          @if (supportingText()) {
            <p
              mznTypography
              variant="caption"
              color="text-neutral"
              display="block"
              [ellipsis]="true"
              [class]="supportingTextClass"
              [style.max-width]="supportingTextMaxWidth()"
              >{{ supportingText() }}</p
            >
          }
        </div>
      </div>
      @if (!readonly()) {
        <input
          [type]="selector()"
          [class]="inputClass"
          [checked]="resolvedChecked()"
          [disabled]="disabled()"
          [name]="name()"
          [value]="value()"
          (change)="onInputChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />
      }
    </label>
  `,
})
export class MznSelectionCard
  implements AfterViewInit, OnDestroy, ControlValueAccessor
{
  private readonly hostElRef = inject(ElementRef<HTMLElement>);
  private radioGroupHandler: ((e: Event) => void) | null = null;

  /** 是否勾選（受控模式，持續覆寫內部狀態）。 */
  readonly checked = input<boolean>();

  /**
   * 預設勾選狀態（非受控模式，僅設定初始值）。
   * 對應 React 的 `defaultChecked` prop。
   */
  readonly defaultChecked = input(false);

  /** 自訂圖示。 */
  readonly customIcon = input<IconDefinition>();

  /** 排列方向。 */
  readonly direction = input<SelectionCardDirection>('horizontal');

  /** 是否禁用。 */
  readonly disabled = input(false);

  /** 圖片 URL。 */
  readonly image = input<string>();

  /** 圖片 object-fit。 */
  readonly imageObjectFit = input<SelectionCardImageObjectFit>('cover');

  /** Input name。 */
  readonly name = input<string>();

  /**
   * 點擊選擇卡片時的回呼，對應 React 的 `onClick` prop。
   */
  readonly onClick = output<MouseEvent>();

  /** 是否唯讀（不渲染 input）。 */
  readonly readonly = input(false);

  /** 選取類型。 */
  readonly selector = input<SelectionCardType>('radio');

  /** 輔助說明文字。 */
  readonly supportingText = input<string>();

  /** 輔助文字最大寬度。 */
  readonly supportingTextMaxWidth = input<string>();

  /**
   * 主要文字。單張卡片模式下必填；群組模式（`selections` 提供時）可省略。
   */
  readonly text = input<string>('');

  /** 主要文字最大寬度。 */
  readonly textMaxWidth = input<string>();

  /** Input value。 */
  readonly value = input<string>('');

  private readonly internalChecked = signal(false);
  private defaultCheckedApplied = false;
  private readonly focused = signal(false);

  protected readonly resolvedChecked = computed(
    (): boolean => this.checked() ?? this.internalChecked(),
  );

  protected readonly resolvedIcon = computed(
    (): IconDefinition => this.customIcon() ?? FileIcon,
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.direction(this.direction()), {
      [classes.disabled]: this.disabled(),
      [classes.readonly]: this.readonly(),
      [classes.selected]: this.resolvedChecked(),
      [classes.focused]: this.focused(),
    }),
  );

  protected readonly containerClass = classes.container;
  protected readonly imageClass = classes.selectionImage;
  protected readonly iconClass = classes.icon;
  protected readonly iconSize = SELECTION_ICON_SIZE;
  protected readonly contentClass = classes.content;
  protected readonly textClass = classes.text;
  protected readonly supportingTextClass = classes.supportingText;
  protected readonly inputClass = classes.input;

  // CVA
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.internalChecked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngAfterViewInit(): void {
    if (!this.defaultCheckedApplied && this.defaultChecked()) {
      this.internalChecked.set(true);
      this.defaultCheckedApplied = true;
    }

    if (this.selector() === 'radio') {
      this.setupRadioGroupSync();
    }
  }

  ngOnDestroy(): void {
    this.teardownRadioGroupSync();
  }

  /**
   * Listen for change events at document level so that when ANOTHER radio
   * in the same name-group is selected, this card re-reads its native
   * input's checked state. The browser unchecks sibling radios silently
   * (no change event on the unchecked input), so we must detect it here.
   */
  private setupRadioGroupSync(): void {
    this.radioGroupHandler = (e: Event): void => {
      const target = e.target as HTMLInputElement;

      if (target.type !== 'radio' || target.name !== this.name()) {
        return;
      }

      const input = this.hostElRef.nativeElement.querySelector(
        'input[type="radio"]',
      ) as HTMLInputElement | null;

      if (input && input.checked !== this.internalChecked()) {
        this.internalChecked.set(input.checked);
      }
    };

    document.addEventListener('change', this.radioGroupHandler, true);
  }

  private teardownRadioGroupSync(): void {
    if (this.radioGroupHandler) {
      document.removeEventListener('change', this.radioGroupHandler, true);
      this.radioGroupHandler = null;
    }
  }

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.internalChecked.set(target.checked);
    this.onChange(target.checked);
  }

  protected onFocus(): void {
    this.focused.set(true);
    this.onTouched();
  }

  protected onBlur(): void {
    this.focused.set(false);
  }
}
