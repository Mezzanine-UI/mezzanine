import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import {
  toTypographyCssVars,
  typographyClasses as classes,
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographyVariant,
} from '@mezzanine-ui/core/typography';
import {
  BooleanInput,
  createChangeEffect,
  createCssVarsChangeEffect,
  EnumWithFallbackInput,
  InputBoolean,
  InputEnumWithFallback,
  HostBindingClass,
  HostBindingEnumClass,
  TypedSimpleChanges,
} from '@mezzanine-ui/ng/cdk';

interface EllipsisInfo {
  status: boolean;
  content: string | null;
}

/**
 * The ng component for `mezzanine` typography.
 */
@Component({
  selector: '[mzn-typography]',
  exportAs: 'mznTypography',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
})
export class MznTypographyComponent implements OnChanges, AfterViewChecked {
  static ngAcceptInputType_ellipsis: BooleanInput;

  static ngAcceptInputType_noWrap: BooleanInput;

  static ngAcceptInputType_variant: EnumWithFallbackInput<TypographyVariant>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  private get hostElement() {
    return this.elementRef.nativeElement;
  }

  /**
   * The css variable for `text-align`.
   */
  @HostBindingClass(classes.align)
  @Input()
  align?: TypographyAlign;

  /**
   * The color name provided by palette.
   */
  @HostBindingClass(classes.color)
  @Input()
  color?: TypographyColor;

  /**
   * The css variable for `display`.
   */
  @HostBindingClass(classes.display)
  @Input()
  display?: TypographyDisplay;

  /**
   * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   *
   * Note that text overflow can only happen with `block` or `inline-block` level elements
   * @default false
   */
  @HostBindingClass(classes.ellipsis)
  @Input()
  @InputBoolean()
  ellipsis = false;

  /**
   * If `true`, the text will not wrap.
   * @default false
   */
  @HostBindingClass(classes.noWrap)
  @Input()
  @InputBoolean()
  noWrap = false;

  /**
   * Applies the typography variant.
   * @default 'body1'
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @HostBindingEnumClass(classes.variant, [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'body1',
    'body2',
    'button1',
    'button2',
    'button3',
    'input1',
    'input2',
    'input3',
    'caption',
  ])
  @Input('mzn-typography')
  @InputEnumWithFallback<TypographyVariant>('body1')
  variant: TypographyVariant;

  private readonly changeHostCssVars = createCssVarsChangeEffect(
    this.elementRef,
    this.renderer,
    () => toTypographyCssVars({
      align: this.align,
      color: this.color,
      display: this.display,
    }),
  );

  private readonly changeTitleAttr = createChangeEffect<EllipsisInfo>(
    ({ status, content }) => {
      if (status && content) {
        this.renderer.setAttribute(this.hostElement, 'title', content);
      } else {
        this.renderer.removeAttribute(this.hostElement, 'title');
      }
    },
    (x, y) => (
      x.status === y.status &&
      x.content === y.content
    ),
  );

  ngOnChanges(changes: TypedSimpleChanges<MznTypographyComponent>) {
    const {
      align,
      color,
      display,
    } = changes;

    if (align || color || display) {
      this.changeHostCssVars();
    }
  }

  ngAfterViewChecked() {
    this.changeTitleAttr({
      status: this.ellipsis,
      content: this.hostElement.textContent,
    });
  }
}
