import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  TagSize,
  TagType,
  tagClasses as classes,
} from '@mezzanine-ui/core/tag';
import { PlusIcon, CloseIcon, IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznBadge } from '@mezzanine-ui/ng/badge';

/**
 * 標籤元件，用於分類、篩選或標記內容。
 *
 * 支援五種模式：`static`（純標籤）、`counter`（帶數字）、`dismissable`（可關閉）、
 * `addable`（可新增）及 `overflow-counter`（溢出計數）。
 *
 * @example
 * ```html
 * import { MznTag } from '@mezzanine-ui/ng/tag';
 *
 * <span mznTag type="static" label="設計" ></span>
 * <span mznTag type="counter" label="待處理" [count]="3" ></span>
 * <span mznTag type="dismissable" label="React" (close)="removeTag('React')" ></span>
 * <span mznTag type="addable" label="新增標籤" (click)="handleAdd()" ></span>
 * ```
 */
@Component({
  selector: '[mznTag]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznBadge],
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.type]': 'null',
    '[attr.label]': 'null',
    '[attr.size]': 'null',
    '[attr.count]': 'null',
    '[attr.disabled]': 'null',
    '[attr.active]': 'null',
    '[attr.readOnly]': 'null',
  },
  template: `
    @switch (type()) {
      @case ('overflow-counter') {
        <button
          type="button"
          style="display: inline-flex; align-items: center; gap: inherit; padding: 0; border: none; background: none; color: inherit; font: inherit; cursor: pointer;"
          [disabled]="disabled()"
          (click)="tagClick.emit($event)"
        >
          <i mznIcon [class]="classes.icon" [icon]="plusIcon" [size]="16"></i>
          <span [class]="classes.label">{{ count() }}</span>
        </button>
      }
      @case ('addable') {
        <button
          type="button"
          style="display: inline-flex; align-items: center; gap: inherit; padding: 0; border: none; background: none; color: inherit; font: inherit; cursor: pointer;"
          [disabled]="disabled()"
          (click)="tagClick.emit($event)"
        >
          <i mznIcon [class]="classes.icon" [icon]="plusIcon" [size]="16"></i>
          <span [class]="classes.label">{{ label() }}</span>
        </button>
      }
      @default {
        <span [class]="classes.label">{{ label() }}</span>
        @if (type() === 'counter') {
          <mzn-badge variant="count-info" [count]="count() ?? 0" />
        }
        @if (type() === 'dismissable') {
          <button
            [class]="classes.closeButton"
            type="button"
            [disabled]="disabled()"
            (click)="close.emit($event)"
          >
            <i
              mznIcon
              [class]="classes.icon"
              [icon]="closeIcon"
              [size]="16"
            ></i>
          </button>
        }
      }
    }
  `,
})
export class MznTag {
  protected readonly classes = classes;
  protected readonly plusIcon: IconDefinition = PlusIcon;
  protected readonly closeIcon: IconDefinition = CloseIcon;

  /**
   * 標籤類型。
   * @default 'static'
   */
  readonly type = input<TagType>('static');

  /** 標籤顯示的文字。 */
  readonly label = input<string>();

  /**
   * 標籤尺寸。
   * @default 'main'
   */
  readonly size = input<TagSize>('main');

  /** 計數器/溢出計數器的數字。 */
  readonly count = input<number>();

  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否啟用中。
   * @default false
   */
  readonly active = input(false);

  /**
   * 是否唯讀。
   * @default false
   */
  readonly readOnly = input(false);

  /** 可關閉標籤的關閉事件。 */
  readonly close = output<MouseEvent>();

  /** 可點擊標籤（addable/overflow-counter）的點擊事件。 */
  readonly tagClick = output<MouseEvent>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size()), classes.type(this.type()), {
      [classes.disabled]: this.disabled(),
      [classes.active]: this.active(),
      [classes.readOnly]: this.readOnly(),
    }),
  );
}
