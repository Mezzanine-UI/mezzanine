import type {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographyVariant,
} from '@mezzanine-ui/core/typography';
import {
  toTypographyCssVars,
  typographyClasses as classes,
} from '@mezzanine-ui/core/typography';
import {
  AfterViewChecked,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';
import {
  BooleanInput,
  InputBoolean,
  InputNotEmptyEnum,
  setElementCssVars,
  TypedSimpleChangePreviousValue,
  TypedSimpleChanges,
} from '../core';

interface EllipsisInfo {
  status: boolean;
  content: string | null;
}

/**
 * The ng directive for `mezzanine` typography.
 */
@Directive({
  selector: '[mznTypography]',
  exportAs: 'mznTypography',
})
export class MznTypographyDirective implements OnChanges, AfterViewChecked {
  static ngAcceptInputType_ellipsis: BooleanInput;

  static ngAcceptInputType_noWrap: BooleanInput;

  private get $host() {
    return this.elementRef.nativeElement;
  }

  private _ellipsisInfo: EllipsisInfo = {
    status: false,
    content: null,
  };

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  /**
   * Applies the typography variant.
   * @default 'body1'
   */
  @Input('mznTypography')
  @InputNotEmptyEnum<TypographyVariant>('body1')
  variant: TypographyVariant;

  /**
   * The css variable for `text-align`.
   */
  @HostBinding(`class.${classes.align}`)
  @Input('mznTypographyAlign')
  align?: TypographyAlign;

  /**
   * The color name provided by palette.
   */
  @HostBinding(`class.${classes.color}`)
  @Input('mznTypographyColor')
  color?: TypographyColor;

  /**
   * The css variable for `display`.
   */
  @HostBinding(`class.${classes.display}`)
  @Input('mznTypographyDisplay')
  display?: TypographyDisplay;

  /**
   * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   *
   * Note that text overflow can only happen with `block` or `inline-block` level elements
   * @default false
   */
  @HostBinding(`class.${classes.ellipsis}`)
  @Input('mznTypographyEllipsis')
  @InputBoolean()
  ellipsis = false;

  /**
   * If `true`, the text will not wrap.
   * @default false
   */
  @HostBinding(`class.${classes.noWrap}`)
  @Input('mznTypographyNoWrap')
  @InputBoolean()
  noWrap = false;

  private _setVariant(previousValue: TypedSimpleChangePreviousValue<TypographyVariant>) {
    if (previousValue !== this.variant) {
      if (previousValue) {
        this.renderer.removeClass(this.$host, classes.variant(previousValue));
      }

      this.renderer.addClass(this.$host, classes.variant(this.variant));
    }
  }

  private _setCssVars() {
    const style = toTypographyCssVars({
      align: this.align,
      color: this.color,
      display: this.display,
    });

    setElementCssVars(this.$host, this.renderer, style);
  }

  private _setTitleAttr() {
    const { status, content } = this._ellipsisInfo;

    if (status && content) {
      this.renderer.setAttribute(this.$host, 'title', content);
    } else {
      this.renderer.removeAttribute(this.$host, 'title');
    }
  }

  ngOnChanges(changes: TypedSimpleChanges<MznTypographyDirective>) {
    const {
      align,
      color,
      display,
      variant,
    } = changes;

    if (variant) {
      this._setVariant(variant.previousValue);
    }

    if (align || color || display) {
      this._setCssVars();
    }
  }

  ngAfterViewChecked() {
    const { textContent: content } = this.$host;

    if (this._ellipsisInfo.status !== this.ellipsis || this._ellipsisInfo.content !== content) {
      this._ellipsisInfo = {
        status: this.ellipsis,
        content,
      };
      this._setTitleAttr();
    }
  }
}
