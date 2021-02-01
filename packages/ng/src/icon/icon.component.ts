import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import type { IconDefinition } from '@mezzanine-ui/icons';
import { iconClasses as classes, IconColor, toIconCssVars } from '@mezzanine-ui/core/icon';
import {
  BooleanInput,
  createCssVarsChangeEffect,
  InputBoolean,
  TypedSimpleChanges,
} from '../cdk';

/**
 * The ng component for `mezzanine` icon.
 */
@Component({
  selector: 'i[mzn-icon]',
  exportAs: 'mznIcon',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <svg
      [attr.focusable]="false"
      [attr.viewBox]="svg?.viewBox"
    >
      <svg:path
        *ngIf="path"
        [attr.d]="path.d"
        [attr.fill]="path.fill"
        [attr.fill-rule]="path.fillRule"
        [attr.stroke]="path.stroke"
        [attr.stroke-width]="path.strokeWidth"
        [attr.transform]="path.transform"
      >
      </svg:path>
    </svg>
  `,
})
export class MznIconComponent implements OnChanges {
  static ngAcceptInputType_spin: BooleanInput;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  @HostBinding(`class.${classes.host}`)
  readonly bindHostClass = true;

  @HostBinding('attr.aria-hidden')
  readonly bindAriaHidden = true;

  @HostBinding('attr.data-icon-name')
  get name() {
    return this.icon.name;
  }

  get svg() {
    return this.icon.definition.svg;
  }

  get path() {
    return this.icon.definition.path;
  }

  /**
   * Color name provided by palette.
   */
  @HostBinding(`class.${classes.color}`)
  @Input()
  color?: IconColor;

  /**
   * The icon provided by `@mezzanine-ui/icons` package.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mzn-icon')
  icon: IconDefinition;

  /**
   * Whether to spin the icon or not.
   * @default false
   */
  @HostBinding(`class.${classes.spin}`)
  @Input()
  @InputBoolean()
  spin = false;

  private readonly changeHostCssVars = createCssVarsChangeEffect(
    this.elementRef,
    this.renderer,
    () => toIconCssVars({
      color: this.color,
    }),
  );

  ngOnChanges(changes: TypedSimpleChanges<MznIconComponent>) {
    const { color } = changes;

    if (color) {
      this.changeHostCssVars();
    }
  }
}
