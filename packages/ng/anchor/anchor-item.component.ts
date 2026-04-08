import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  forwardRef,
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

/**
 * 錨點項目元件，支援巢狀層級與 hash 追蹤。
 * 此為內部元件，由 MznAnchorGroup 使用。
 */
@Component({
  selector: 'mzn-anchor-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [forwardRef(() => MznAnchorItem), MznTypography],
  template: `
    <a
      [attr.aria-disabled]="isDisabled()"
      [class]="linkClasses()"
      [href]="href()"
      [attr.title]="itemTitle() ?? null"
      [tabIndex]="isDisabled() ? -1 : null"
      (click)="handleClick($event)"
    >
      <span mznTypography variant="label-primary" color="inherit">
        {{ name() }}
      </span>
    </a>
    @if (renderableChildren(); as children) {
      <div [class]="classes.nested">
        @for (child of children; track child.id) {
          <mzn-anchor-item
            [autoScrollTo]="child.autoScrollTo"
            [className]="childClasses()"
            [disabled]="child.disabled"
            [href]="child.href"
            [itemId]="child.id"
            [level]="level() + 1"
            [name]="child.name"
            [clickHandler]="child.onClick"
            [parentAutoScrollTo]="isAutoScrollTo()"
            [parentDisabled]="isDisabled()"
            [subAnchors]="child.children"
            [itemTitle]="child.title"
          />
        }
      </div>
    }
  `,
})
export class MznAnchorItem implements OnInit {
  protected readonly classes = classes;

  private readonly destroyRef = inject(DestroyRef);
  private readonly currentHash = signal(
    typeof window !== 'undefined' ? window.location.hash : '',
  );

  /** 是否啟用平滑滾動。 */
  readonly autoScrollTo = input<boolean | undefined>();

  /** 自訂 CSS class，會合併到 `<a>` 連結上。 */
  readonly className = input<string | undefined>();

  /** 是否停用。 */
  readonly disabled = input<boolean | undefined>();

  /** 連結目標。 */
  readonly href = input.required<string>();

  /** 唯一識別碼。 */
  readonly itemId = input.required<string>();

  /** HTML title 屬性。 */
  readonly itemTitle = input<string | undefined>();

  /** 巢狀層級（1-based）。 */
  readonly level = input(1);

  /** 顯示名稱。 */
  readonly name = input.required<string>();

  /** 點擊回呼。 */
  readonly clickHandler = input<VoidFunction | undefined>();

  /** 父層是否啟用自動滾動。 */
  readonly parentAutoScrollTo = input(false);

  /** 父層是否停用。 */
  readonly parentDisabled = input(false);

  /** 子錨點。 */
  readonly subAnchors = input<readonly AnchorItemData[] | undefined>();

  protected readonly renderableChildren = computed(
    (): readonly AnchorItemData[] | undefined => {
      const children = this.subAnchors();

      if (
        !children ||
        children.length === 0 ||
        this.level() >= MAX_NESTING_LEVEL
      ) {
        return undefined;
      }

      return children.slice(0, MAX_NESTING_LEVEL);
    },
  );

  protected readonly isAutoScrollTo = computed(
    (): boolean => this.parentAutoScrollTo() || !!this.autoScrollTo(),
  );

  protected readonly isDisabled = computed(
    (): boolean => this.parentDisabled() || !!this.disabled(),
  );

  protected readonly itemHash = computed((): string => {
    const href = this.href();
    const hashIndex = href.indexOf('#');

    return hashIndex !== -1 ? href.slice(hashIndex) : '';
  });

  protected readonly isActive = computed(
    (): boolean => !!this.itemHash() && this.currentHash() === this.itemHash(),
  );

  protected readonly linkClasses = computed((): string =>
    clsx(
      classes.anchorItem,
      this.isActive() && classes.anchorItemActive,
      this.isDisabled() && classes.anchorItemDisabled,
      this.className(),
    ),
  );

  protected readonly childClasses = computed((): string =>
    clsx(
      this.level() === 1 && classes.nestedLevel1,
      this.level() === 2 && classes.nestedLevel2,
    ),
  );

  ngOnInit(): void {
    const handleHashChange = (): void => {
      this.currentHash.set(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('hashchange', handleHashChange);
    });
  }

  protected handleClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();

      return;
    }

    const hash = this.itemHash();

    if (hash && typeof window !== 'undefined') {
      event.preventDefault();

      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }

      if (this.isAutoScrollTo()) {
        const target = document.querySelector(hash);

        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    this.clickHandler()?.();
  }
}
