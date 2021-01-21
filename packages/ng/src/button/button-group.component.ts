import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import {
  ButtonColor,
  buttonGroupClasses as classes,
  ButtonGroupOrientation,
  ButtonGroupSpacing,
  ButtonSize,
  ButtonVariant,
  toButtonGroupCssVars,
} from '@mezzanine-ui/core/button';
import {
  createCssVarsChangeEffect,
  HostBindingEnumClass,
  InputBoolean,
  InputNotEmptyEnum,
  InputNumber,
  TypedSimpleChanges,
} from '../core';
import { MznButtonGroupControlInputs, MznButtonGroupControlInputsToken } from './button-group.tokens';

@Component({
  selector: 'mzn-button-group',
  exportAs: 'mznButtonGroup',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MznButtonGroupControlInputsToken,
      useExisting: forwardRef(() => MznButtonGroupComponent),
    },
  ],
  template: `
    <ng-content></ng-content>
  `,
})
export class MznButtonGroupComponent implements MznButtonGroupControlInputs, OnChanges, OnInit {
  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) { }

  @HostBinding(`class.${classes.host}`)
  readonly bindHostClass = true;

  /**
   * If `true`, all buttons will not have spacing between each others.
   * @default false
   */
  @HostBinding(`class.${classes.attached}`)
  @Input()
  @InputBoolean()
  attached = false;

  /**
   * If the `color` of a button inside group not provided, the `color` of group will override it.
   */
  @Input()
  color?: ButtonColor;

  /**
   * If the `disabled` of a button inside group not provided, the `disabled` of group will override it.
   */
  @Input()
  @InputBoolean()
  disabled?: boolean;

  /**
   * If the `error` of a button inside group not provided, the `error` of group will override it.
   */
  @Input()
  @InputBoolean()
  error?: boolean;

  /**
   * If `true`, set width: 100%.
   * @default false
   */
  @HostBinding(`class.${classes.fullWidth}`)
  @Input()
  @InputBoolean()
  fullWidth = false;

  /**
   * The orientation of button group.
   * @default horizontal
   */
  @HostBindingEnumClass(classes.orientation, [
    'horizontal',
    'vertical',
  ])
  @HostBinding('attr.aria-orientation')
  @Input()
  @InputNotEmptyEnum<ButtonGroupOrientation>('horizontal')
  orientation: ButtonGroupOrientation = 'horizontal';

  /**
   * Binding the `attr.role`.
   * @default 'group'
   */
  @HostBinding('attr.role')
  @Input()
  role = 'group';

  /**
   * If the `size` of a button inside group not provided, the `size` of group will override it.
   */
  @Input()
  size?: ButtonSize;

  private get _size() {
    return this.size || 'medium';
  }

  /**
   * The spacing level of button gap between each buttons.
   * Will be added on if `attached`=false.
   * @default small:3,others:4
   */
  @Input()
  @InputNumber(NaN)
  spacing?: ButtonGroupSpacing;

  private get _spacing() {
    return Number.isNaN(this.spacing) ? undefined : this.spacing;
  }

  /**
   * If the `variant` of a button inside group not provided, the `variant` of group will override it.
   */
  @Input()
  variant?: ButtonVariant;

  private readonly changeHostCssVars = createCssVarsChangeEffect(
    this.elementRef,
    this.renderer,
    () => toButtonGroupCssVars({
      spacing: this._spacing,
      size: this._size,
    }),
  );

  ngOnChanges(changes: TypedSimpleChanges<MznButtonGroupComponent>) {
    const {
      size,
      spacing,
    } = changes;

    if (size || spacing) {
      this.changeHostCssVars();
    }
  }

  ngOnInit() {
    this.changeHostCssVars();
  }
}
