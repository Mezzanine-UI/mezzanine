import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  Renderer2,
} from '@angular/core';
import { SpinnerIcon } from '@mezzanine-ui/icons';
import {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  buttonClasses as classes,
} from '@mezzanine-ui/core/button';
import {
  HostBindingEnumClass,
  InputBoolean,
  NonNullEnumInput,
} from '../core';
import { MznButtonGroupControlInputs } from './button-group.tokens';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class MznButtonMixin {
  constructor(
    readonly elementRef: ElementRef<HTMLElement>,
    protected readonly renderer: Renderer2,
    protected readonly buttonGroup?: MznButtonGroupControlInputs,
  ) {}

  @HostBinding(`class.${classes.host}`)
  readonly bindHostClass = true;

  readonly loadingIcon = SpinnerIcon;

  /**
   * The color name provided by palette.
   * @default 'primary'
   */
  @Input()
  color?: ButtonColor;

  @HostBindingEnumClass(classes.color, [
    'primary',
    'secondary',
  ])
  get resolvedColor() {
    return this.color || this.buttonGroup?.color || 'primary';
  }

  /**
   * The native disabled.
   */
  @Input()
  @InputBoolean()
  disabled?: boolean;

  @HostBinding('attr.aria-disabled')
  @HostBinding('disabled')
  get resolvedDisabled() {
    return (this.disabled ?? this.buttonGroup?.disabled) || false;
  }

  /**
   * If true, will use error color instead of color from props.
   * @default false
   */
  @Input()
  @InputBoolean()
  error?: boolean;

  @HostBinding(`class.${classes.error}`)
  get resolvedError() {
    return (this.error ?? this.buttonGroup?.error) || false;
  }

  /**
   * If true, replace the original icon.
   * Replace iconEnd if only iconEnd provided, or iconStart.
   * @default false
   */
  @HostBinding(`class.${classes.loading}`)
  @Input()
  @InputBoolean()
  loading = false;

  /**
   * The size of button.
   * @default 'medium'
   */
  @Input()
  size?: ButtonSize;

  @HostBindingEnumClass(classes.size, [
    'small',
    'medium',
    'large',
  ])
  get resolvedSize() {
    return this.size || this.buttonGroup?.size || 'medium';
  }

  /**
   * The variant of button.
   * @default 'text'
   */
  abstract variant: NonNullEnumInput<ButtonVariant>;

  @HostBindingEnumClass(classes.variant, [
    'contained',
    'outlined',
  ])
  get resolvedVariant() {
    return this.variant || this.buttonGroup?.variant || 'text';
  }
}
