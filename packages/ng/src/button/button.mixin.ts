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
  EnumInput,
  InputDescriptor,
} from '../cdk';
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
  @HostBindingEnumClass(classes.color, [
    'primary',
    'secondary',
  ])
  @Input()
  @InputDescriptor<ButtonColor, MznButtonMixin>({
    get(this, color?: ButtonColor) {
      return color || this.buttonGroup?.color || 'primary';
    },
  })
  color: ButtonColor;

  /**
   * The native disabled.
   * @default false
   */
  @HostBinding('attr.aria-disabled')
  @HostBinding('disabled')
  @Input()
  @InputBoolean<MznButtonMixin>({
    get(this, disabled?: boolean) {
      return (disabled ?? this.buttonGroup?.disabled) || false;
    },
  })
  disabled: boolean;

  /**
   * If true, will use error color instead of color from props.
   * @default false
   */
  @HostBinding(`class.${classes.error}`)
  @Input()
  @InputBoolean<MznButtonMixin>({
    get(this, error?: boolean) {
      return (error ?? this.buttonGroup?.error) || false;
    },
  })
  error: boolean;

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
  @HostBindingEnumClass(classes.size, [
    'small',
    'medium',
    'large',
  ])
  @Input()
  @InputDescriptor<ButtonSize, MznButtonMixin>({
    get(this, size?: ButtonSize) {
      return size || this.buttonGroup?.size || 'medium';
    },
  })
  size: ButtonSize;

  /**
   * The variant of button.
   * @default 'text'
   */
  abstract variant: EnumInput<ButtonVariant>;

  @HostBindingEnumClass(classes.variant, [
    'contained',
    'outlined',
    'text',
  ])
  get resolvedVariant() {
    return this.variant || this.buttonGroup?.variant || 'text';
  }
}
