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
  EnumWithFallbackInput,
} from '../cdk';
import { MznButtonGroupControlInputs } from './button-group.tokens';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class MznButtonMixin {
  constructor(
    protected readonly elementRef: ElementRef<HTMLElement>,
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
  get color() {
    return this._color || this.buttonGroup?.color || 'primary';
  }

  set color(color: ButtonColor) {
    this._color = color;
  }

  private _color?: ButtonColor;

  /**
   * The native disabled.
   * @default false
   */
  @HostBinding(`class.${classes.disabled}`)
  @HostBinding('attr.aria-disabled')
  @HostBinding('disabled')
  @Input()
  @InputBoolean()
  get disabled() {
    return (this._disabled ?? this.buttonGroup?.disabled) || false;
  }

  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  private _disabled?: boolean;

  /**
   * If true, will use error color instead of color from props.
   * @default false
   */
  @HostBinding(`class.${classes.error}`)
  @Input()
  @InputBoolean()
  get error() {
    return (this._error ?? this.buttonGroup?.error) || false;
  }

  set error(error: boolean) {
    this._error = error;
  }

  private _error?: boolean;

  /**
   * If true, add a loading icon.
   * Replace suffix if only suffix provided, or prefix.
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
  get size() {
    return this._size || this.buttonGroup?.size || 'medium';
  }

  set size(size: ButtonSize) {
    this._size = size;
  }

  private _size?: ButtonSize;

  /**
   * The variant of button.
   * @default 'text'
   */
  protected abstract _variant: EnumWithFallbackInput<ButtonVariant>;

  @HostBindingEnumClass(classes.variant, [
    'contained',
    'outlined',
    'text',
  ])
  get variant() {
    return this._variant || this.buttonGroup?.variant || 'text';
  }

  @HostBinding('click')
  protected onClick(event: MouseEvent) {
    if ((event.target as HTMLElement).tagName === 'A') {
      event.preventDefault();
    }
  }
}
