import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import {
  MenuSize,
  menuClasses as classes,
  toMenuCssVars,
} from '@mezzanine-ui/core/menu';
import {
  createCssVarsChangeEffect,
  HostBindingClass,
  HostBindingEnumClass,
  InputNumber,
  NumberInput,
  TypedSimpleChanges,
} from '@mezzanine-ui/ng/cdk';

/**
 * The ng component for `mezzanine` menu.
 */
@Component({
  selector: 'ul[mzn-menu]',
  exportAs: 'mznMenu',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
})

export class MznMenuComponent implements OnChanges, OnInit {
  static ngAcceptInputType_itemsInView: NumberInput;

  static ngAcceptInputType_maxHeight: NumberInput;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  @HostBindingClass(classes.host)
  readonly bindHostClass = true;

  private readonly changeHostCssVars = createCssVarsChangeEffect(
    this.elementRef,
    this.renderer,
    () => toMenuCssVars({
      itemsInView: this.itemsInView,
      maxHeight: this.maxHeight,
    }),
  );

  /**
   * The minimum items count in scroll container.
   * @default 4;
   */
  @Input()
  @InputNumber()
  itemsInView = 4;

  /**
   * The custom menu max height.
   */
  @Input()
  @InputNumber()
  maxHeight?: number;

  /**
   * The role of menu item.
   * @default 'menuitem'
   */
  @HostBinding('attr.role')
  @Input()
  role?: string = 'menu';

  /**
   * The size of menu.
   * @default 'medium'
   */
  @HostBindingEnumClass(classes.size, [
    'small',
    'medium',
    'large',
  ])
  @Input()
  size?: MenuSize = 'medium';

  ngOnChanges(changes: TypedSimpleChanges<MznMenuComponent>) {
    const {
      maxHeight,
      itemsInView,
      size,
    } = changes;

    if (size || maxHeight || itemsInView) {
      this.changeHostCssVars();
    }
  }

  ngOnInit() {
    this.changeHostCssVars();
  }
}
