import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
} from '@angular/core';
import { filterAreaClasses as classes } from '@mezzanine-ui/core/filter-area';
import { MZN_FILTER_AREA_CONTEXT } from './filter-area-context';

/**
 * 篩選器中的單行條件列，包含一或多個 MznFilter 欄位。
 *
 * 透過 Grid 排版將 MznFilter 子元件橫向排列；
 * 需作為 MznFilterArea 的直接子元件使用。
 * 非第一行的 FilterLine 在 FilterArea 收合時會自動隱藏。
 *
 * @example
 * ```html
 * import { MznFilterLine, MznFilter } from '@mezzanine-ui/ng/filter-area';
 *
 * <div mznFilterLine>
 *   <div mznFilter [span]="2">...</div>
 *   <div mznFilter [span]="3">...</div>
 * </div>
 * ```
 *
 * @see {@link MznFilterArea} 管理多個 MznFilterLine 的容器元件
 * @see {@link MznFilter} 包裝單一篩選欄位的元件
 */
@Component({
  selector: '[mznFilterLine]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[style.display]': 'hostDisplay()',
  },
  template: '<ng-content />',
})
export class MznFilterLine {
  private readonly context = inject(MZN_FILTER_AREA_CONTEXT, {
    optional: true,
  });

  private readonly elRef = inject(ElementRef<HTMLElement>);

  protected readonly hostClass = classes.line;

  /**
   * 判斷是否為第一個 FilterLine 子元件。
   * 透過檢查前方兄弟元素是否帶有 `mzn-filter-area__line` class 來判斷。
   */
  private isFirstLine(): boolean {
    const el = this.elRef.nativeElement;
    let sibling = el.previousElementSibling;

    while (sibling) {
      if (sibling.classList.contains(classes.line)) {
        return false;
      }

      sibling = sibling.previousElementSibling;
    }

    return true;
  }

  protected readonly hostDisplay = computed((): string | null => {
    const ctx = this.context;

    if (!ctx) return null;

    const isFirst = this.isFirstLine();
    const expanded = ctx.expanded();

    return !isFirst && !expanded ? 'none' : null;
  });
}
