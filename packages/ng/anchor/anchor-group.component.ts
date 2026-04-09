import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import clsx from 'clsx';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { AnchorItemData } from './typings';

const MAX_NESTING_LEVEL = 3;
const MAX_CHILDREN_PER_LEVEL = 3;

/**
 * 錨點群組元件,以資料驅動方式渲染一組錨點導航連結。
 *
 * 透過 `anchors` 陣列傳入巢狀結構(最多三層),自動追蹤 URL hash
 * 以標示當前錨點,並將 `disabled` / `autoScrollTo` 沿層遞繼承給子 anchor。
 *
 * 內部使用遞迴 `<ng-template>` 直接展開 `<a>` 與 `<div class="nested">` 兄弟節點,
 * 不引入任何 wrapper 元件,最終 DOM 結構與 React `<AnchorGroup>` 完全一致。
 *
 * @example
 * ```html
 * import { MznAnchorGroup } from '@mezzanine-ui/ng/anchor';
 *
 * <div mznAnchorGroup [anchors]="anchorData"></div>
 * ```
 *
 * ```typescript
 * anchorData: AnchorItemData[] = [
 *   { id: 'section1', name: 'Section 1', href: '#section1' },
 *   {
 *     id: 'section2',
 *     name: 'Section 2',
 *     href: '#section2',
 *     children: [
 *       { id: 'section2-1', name: 'Section 2-1', href: '#section2-1' },
 *     ],
 *   },
 * ];
 * ```
 */
@Component({
  selector: '[mznAnchorGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, MznTypography],
  host: {
    '[class]': 'hostClasses()',
    '[attr.anchors]': 'null',
    '[attr.className]': 'null',
  },
  template: `
    @for (item of anchors(); track item.id) {
      <ng-container
        *ngTemplateOutlet="
          itemTpl;
          context: {
            $implicit: item,
            level: 1,
            parentDisabled: false,
            parentAutoScroll: false,
          }
        "
      ></ng-container>
    }

    <ng-template
      #itemTpl
      let-item
      let-level="level"
      let-parentDisabled="parentDisabled"
      let-parentAutoScroll="parentAutoScroll"
    >
      <a
        [attr.aria-disabled]="isDisabled(item, parentDisabled) ? true : null"
        [class]="linkClasses(item, level, parentDisabled)"
        [href]="item.href"
        [attr.title]="item.title ?? null"
        [attr.tabindex]="isDisabled(item, parentDisabled) ? -1 : null"
        (click)="handleClick($event, item, parentDisabled, parentAutoScroll)"
      >
        <span mznTypography variant="label-primary" color="inherit">
          {{ item.name }}
        </span>
      </a>
      @if (hasRenderableChildren(item, level)) {
        <div [class]="nestedClass">
          @for (
            child of item.children.slice(0, maxChildrenPerLevel);
            track child.id
          ) {
            <ng-container
              *ngTemplateOutlet="
                itemTpl;
                context: {
                  $implicit: child,
                  level: level + 1,
                  parentDisabled: isDisabled(item, parentDisabled),
                  parentAutoScroll: isAutoScrollTo(item, parentAutoScroll),
                }
              "
            ></ng-container>
          }
        </div>
      }
    </ng-template>
  `,
})
export class MznAnchorGroup implements OnInit {
  protected readonly nestedClass = classes.nested;
  protected readonly maxChildrenPerLevel = MAX_CHILDREN_PER_LEVEL;

  private readonly destroyRef = inject(DestroyRef);
  private readonly currentHash = signal(
    typeof window !== 'undefined' ? window.location.hash : '',
  );

  /** 錨點項目資料陣列。 */
  readonly anchors = input.required<readonly AnchorItemData[]>();

  /** 附加到 host 的自訂 CSS class。 */
  readonly className = input<string>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, this.className()),
  );

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const handleHashChange = (): void => {
      this.currentHash.set(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('hashchange', handleHashChange);
    });
  }

  protected isDisabled(item: AnchorItemData, parentDisabled: boolean): boolean {
    return parentDisabled || !!item.disabled;
  }

  protected isAutoScrollTo(
    item: AnchorItemData,
    parentAutoScroll: boolean,
  ): boolean {
    return parentAutoScroll || !!item.autoScrollTo;
  }

  protected hasRenderableChildren(
    item: AnchorItemData,
    level: number,
  ): boolean {
    return (
      !!item.children && item.children.length > 0 && level < MAX_NESTING_LEVEL
    );
  }

  protected linkClasses(
    item: AnchorItemData,
    level: number,
    parentDisabled: boolean,
  ): string {
    const itemHash = this.getItemHash(item.href);
    const isActive = !!itemHash && this.currentHash() === itemHash;

    return clsx(
      classes.anchorItem,
      isActive && classes.anchorItemActive,
      this.isDisabled(item, parentDisabled) && classes.anchorItemDisabled,
      level === 2 && classes.nestedLevel1,
      level === 3 && classes.nestedLevel2,
    );
  }

  protected handleClick(
    event: MouseEvent,
    item: AnchorItemData,
    parentDisabled: boolean,
    parentAutoScroll: boolean,
  ): void {
    if (this.isDisabled(item, parentDisabled)) {
      event.preventDefault();

      return;
    }

    const hash = this.getItemHash(item.href);

    if (hash && typeof window !== 'undefined') {
      event.preventDefault();

      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }

      if (this.isAutoScrollTo(item, parentAutoScroll)) {
        const target = document.querySelector(hash);

        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    item.onClick?.();
  }

  private getItemHash(href: string): string {
    const hashIndex = href.indexOf('#');

    return hashIndex !== -1 ? href.slice(hashIndex) : '';
  }
}
