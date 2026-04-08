import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  cascaderClasses as classes,
  CascaderSize,
} from '@mezzanine-ui/core/cascader';
import clsx from 'clsx';

import { MznPortal } from '@mezzanine-ui/ng/portal';
import { MznSelectTrigger } from '@mezzanine-ui/ng/select';
import { MznCascaderPanel } from './cascader-panel.component';
import { CascaderOption } from './cascader-option';

interface PanelDescriptor {
  readonly activeId: string | undefined;
  readonly options: CascaderOption[];
}

/**
 * 串接式選單元件，可逐層展開樹狀選項供使用者選取。
 *
 * 點擊觸發區域開啟下拉面板，每選取一個非葉節點選項就展開下一層面板，
 * 直到選取葉節點後關閉下拉並發出 `valueChange` 事件。
 * 支援 `clearable`、`disabled`、`fullWidth`、`error` 等常見表單控制項狀態。
 *
 * @example
 * ```html
 * import { MznCascader } from '@mezzanine-ui/ng/cascader';
 *
 * <div mznCascader
 *   [options]="options"
 *   [value]="selectedPath"
 *   (valueChange)="onValueChange($event)"
 *   placeholder="請選擇"
 * ></div>
 * ```
 *
 * @see MznCascaderPanel
 */
@Component({
  selector: '[mznCascader]',
  standalone: true,
  imports: [MznCascaderPanel, MznPortal, MznSelectTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.clearable]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.globalPortal]': 'null',
    '[attr.menuMaxHeight]': 'null',
    '[attr.options]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.size]': 'null',
    '[attr.value]': 'null',
    '[attr.required]': 'null',
    '[attr.dropdownZIndex]': 'null',
  },
  template: `
    <div
      mznSelectTrigger
      [class.mzn-cascader-trigger--partial]="isPartial()"
      [active]="isOpen()"
      [clearable]="clearable() && !disabled() && !readOnly() && hasValue()"
      [disabled]="disabled()"
      [displayText]="displayValue()"
      [error]="error()"
      [hasValue]="hasValue()"
      [mode]="'single'"
      [placeholder]="placeholder() ?? ''"
      [readOnly]="readOnly()"
      [size]="size()"
      (cleared)="clear($event)"
      (triggerClicked)="toggleOpen()"
    ></div>
    <div mznPortal [disablePortal]="!(globalPortal() ?? true)">
      @if (isOpen()) {
        <div [class]="panelsClass">
          @for (panel of visiblePanels(); track $index) {
            <div
              mznCascaderPanel
              [options]="panel.options"
              [activeOptionId]="panel.activeId"
              [selectedOptionId]="selectedLeafId()"
              (optionSelect)="onOptionSelect($event, $index)"
            ></div>
          }
        </div>
      }
    </div>
  `,
})
export class MznCascader {
  /**
   * 是否顯示清除按鈕。
   * @default false
   */
  readonly clearable = input(false);

  /**
   * 是否禁用元件。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否呈現錯誤狀態。
   * @default false
   */
  readonly error = input(false);

  /**
   * 是否撐滿父容器寬度。
   * @default false
   */
  readonly fullWidth = input(false);

  /**
   * 是否將下拉面板渲染至全域 Portal（body 層級），避免被父容器 overflow 截斷。
   * @default true
   */
  readonly globalPortal = input<boolean>();

  /** 下拉面板最大高度。 */
  readonly menuMaxHeight = input<string | number>();

  /** 選項樹狀資料。 */
  readonly options = input.required<CascaderOption[]>();

  /** 無選取值時顯示的佔位文字。 */
  readonly placeholder = input<string>();

  /**
   * 是否為唯讀狀態。
   * @default false
   */
  readonly readOnly = input(false);

  /**
   * 元件尺寸。
   * @default 'main'
   */
  readonly size = input<CascaderSize>('main');

  /** 目前選取的路徑（從根到葉的 CascaderOption 陣列）。 */
  readonly value = input<CascaderOption[]>();

  /**
   * 是否為必填欄位。
   * @default false
   */
  readonly required = input(false);

  /** 下拉面板的 z-index。 */
  readonly dropdownZIndex = input<number | string | undefined>(undefined);

  /** 當選取路徑改變時發出。 */
  readonly valueChange = output<CascaderOption[]>();

  /** 當元件失焦時發出。 */
  readonly cascaderBlur = output<void>();

  /** 當元件聚焦時發出。 */
  readonly cascaderFocus = output<void>();

  /** 下拉是否展開。 */
  readonly isOpen = signal(false);

  /** 目前展開路徑（使用者逐層點選的選項）。 */
  readonly activePath = signal<CascaderOption[]>([]);

  protected readonly panelsClass = classes.dropdownPanels;
  protected readonly triggerPartialClass = classes.triggerPartial;

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.hostFullWidth]: this.fullWidth(),
    }),
  );

  protected readonly displayValue = computed((): string => {
    const val = this.value();

    if (val?.length) {
      return val.map((o) => o.name).join(' / ');
    }

    return '';
  });

  protected readonly hasValue = computed((): boolean => {
    const val = this.value();

    return !!val?.length;
  });

  protected readonly selectedLeafId = computed((): string | undefined => {
    const val = this.value();

    if (!val?.length) {
      return undefined;
    }

    const last = val[val.length - 1];

    return last?.children?.length ? undefined : last?.id;
  });

  protected readonly isPartial = computed((): boolean => {
    const path = this.activePath();

    return (
      this.isOpen() &&
      path.length > 0 &&
      !!path[path.length - 1]?.children?.length
    );
  });

  protected readonly visiblePanels = computed(
    (): readonly PanelDescriptor[] => {
      const rootOptions = this.options();
      const path = this.activePath();

      const panels: PanelDescriptor[] = [
        {
          activeId: path[0]?.id,
          options: rootOptions,
        },
      ];

      for (let i = 0; i < path.length; i++) {
        const current = path[i];

        if (current.children?.length) {
          panels.push({
            activeId: path[i + 1]?.id,
            options: current.children,
          });
        }
      }

      return panels;
    },
  );

  toggleOpen(): void {
    if (this.disabled() || this.readOnly()) {
      return;
    }

    const opening = !this.isOpen();

    this.isOpen.set(opening);

    if (opening) {
      this.initializeActivePath();
      this.cascaderFocus.emit();
    } else {
      this.cascaderBlur.emit();
    }
  }

  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.activePath.set([]);
    this.valueChange.emit([]);
  }

  onOptionSelect(option: CascaderOption, panelIndex: number): void {
    const currentPath = this.activePath();
    const newPath = [...currentPath.slice(0, panelIndex), option];

    this.activePath.set(newPath);

    if (!option.children?.length) {
      this.valueChange.emit(newPath);
      this.isOpen.set(false);
      this.cascaderBlur.emit();
    }
  }

  private initializeActivePath(): void {
    const val = this.value();

    if (val?.length) {
      this.activePath.set([...val]);
    } else {
      this.activePath.set([]);
    }
  }
}
