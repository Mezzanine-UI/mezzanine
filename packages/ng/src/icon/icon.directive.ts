import {
  ChangeDetectionStrategy,
  Component as Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { IconColor } from '@mezzanine-ui/core/icon';
import { iconClasses as classes, toIconCssVars } from '@mezzanine-ui/core/icon';
import {
  BooleanInput,
  CssVarsRef,
  InputBoolean,
  TypedSimpleChanges,
} from '../core';

/* eslint-disable @angular-eslint/no-input-rename */

/**
 * The ng directive for `mezzanine` icon.
 */
@Directive({
  selector: 'i[mznIcon]',
  exportAs: 'mznIcon',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    [`[class.${classes.host}]`]: 'true',
    '[attr.aria-hidden]': 'true',
    '[attr.data-icon-name]': 'icon.name',
  },
  template: `
    <ng-template
      [ngTemplateOutlet]="svgTemplate"
      [ngTemplateOutletContext]="{
        $implicit: icon.definition.svg,
        path: icon.definition.path
      }"
      #svgTemplate
      let-svg
      let-path="path"
    >
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
    </ng-template>
  `,
})
export class MznIconDirective implements OnChanges {
  static ngAcceptInputType_spin: BooleanInput;

  private cssVarsRef = new CssVarsRef(this.elementRef, this.renderer);

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  /**
   * Color name provided by palette.
   */
  @HostBinding(`class.${classes.color}`)
  @Input('mznIconColor')
  color?: IconColor;

  /**
   * The icon provided by `@mezzanine-ui/icons` package.
   */
  @Input('mznIcon')
  icon: IconDefinition;

  /**
   * Whether to spin the icon or not.
   * @default false
   */
  @HostBinding(`class.${classes.spin}`)
  @Input('mznIconSpin')
  @InputBoolean()
  spin = false;

  private setCssVars() {
    this.cssVarsRef.value = toIconCssVars({
      color: this.color,
    });
  }

  ngOnChanges(changes: TypedSimpleChanges<MznIconDirective>) {
    const { color } = changes;

    if (color) {
      this.setCssVars();
    }
  }
}
