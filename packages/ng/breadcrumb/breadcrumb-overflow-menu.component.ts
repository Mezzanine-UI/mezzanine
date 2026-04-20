import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { breadcrumbClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { MznTranslate } from '@mezzanine-ui/ng/transition';
import { MznBreadcrumbOverflowMenuItem } from './breadcrumb-overflow-menu-item.component';
import type { BreadcrumbItemData } from './breadcrumb.component';

/**
 * Breadcrumb 中段收合項目的 overflow 按鈕 + 展開 menu。
 *
 * 由 `MznBreadcrumb` 於 `items` 數量過多或 `condensed` 模式時自動渲染。
 * 點擊按鈕展開 popper menu 列出被收合的 items，支援 click-away 關閉。
 * 目前僅支援 link / text 兩類 item，尚未移植 React 的 nested dropdown
 * item（對應 Angular `BreadcrumbItemData` 亦未支援 `options` 欄位）。
 *
 * @internal
 */
@Component({
  selector: '[mznBreadcrumbOverflowMenu]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznPopper, MznTranslate, MznBreadcrumbOverflowMenuItem],
  host: {
    '[style.display]': "'contents'",
    '[attr.collapsed]': 'null',
  },
  template: `
    <button
      #trigger
      type="button"
      aria-label="more options"
      [class]="iconButtonClass"
      (click)="toggle()"
    >
      <i mznIcon [icon]="dotIcon" [size]="14"></i>
    </button>
    <div
      #popperEl
      mznPopper
      style="z-index: 1;"
      [anchor]="trigger"
      [disableFlip]="true"
      [open]="open()"
      placement="bottom-start"
    >
      <span mznTranslate from="bottom" [in]="open()" [class]="menuClass">
        <span [class]="menuContentClass">
          @for (item of collapsed(); track item.id) {
            <span
              mznBreadcrumbOverflowMenuItem
              [href]="item.href"
              [name]="item.name"
              [target]="item.target"
              (itemClick)="handleItemClick(item)"
            ></span>
          }
        </span>
      </span>
    </div>
  `,
})
export class MznBreadcrumbOverflowMenu {
  private readonly clickAway = inject(ClickAwayService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly triggerRef =
    viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly popperElRef =
    viewChild.required<ElementRef<HTMLElement>>('popperEl');

  protected readonly iconButtonClass = classes.iconButton;
  protected readonly menuClass = classes.menu;
  protected readonly menuContentClass = classes.menuContent;
  protected readonly dotIcon = DotHorizontalIcon;

  /** 被收合的 items（已補上 id）。 */
  readonly collapsed =
    input.required<readonly (BreadcrumbItemData & { id: string })[]>();

  protected readonly open = signal(false);

  private clickAwayCleanup: (() => void) | null = null;

  protected toggle(): void {
    const next = !this.open();

    this.open.set(next);

    if (next) {
      this.registerClickAway();
    } else {
      this.disposeClickAway();
    }
  }

  protected handleItemClick(item: BreadcrumbItemData): void {
    item.onClick?.();
    this.open.set(false);
    this.disposeClickAway();
  }

  private registerClickAway(): void {
    this.disposeClickAway();

    this.clickAwayCleanup = this.clickAway.listen(
      [this.triggerRef().nativeElement, this.popperElRef().nativeElement],
      () => {
        this.open.set(false);
        this.clickAwayCleanup = null;
      },
      this.destroyRef,
    );
  }

  private disposeClickAway(): void {
    this.clickAwayCleanup?.();
    this.clickAwayCleanup = null;
  }
}
