import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  Optional,
  Renderer2,
  SkipSelf,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  buttonClasses as classes,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { EnumWithFallbackInput } from '@mezzanine-ui/ng/cdk';
import { MznButtonMixin } from './button.mixin';
import { MznButtonGroupControlInputs, MznButtonGroupControlInputsToken } from './button-group.tokens';

/**
 * The ng component for `mezzanine` button.
 */
@Component({
  selector: 'button[mzn-button],a[mzn-button],label[mzn-button]',
  exportAs: 'mznButton',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #prefixTemplate let-ref let-showLoading="showLoading">
      <ng-container *ngIf="loading && showLoading; else ref">
        <i
          [mzn-icon]="loadingIcon"
          spin
        ></i>
      </ng-container>
    </ng-template>

    <ng-container
      [ngTemplateOutlet]="prefixTemplate"
      [ngTemplateOutletContext]="{
        $implicit: prefix,
        showLoading: !onlySuffix
      }"
    ></ng-container>
    <span [class]="labelClass">
      <ng-content></ng-content>
    </span>
    <ng-container
      [ngTemplateOutlet]="prefixTemplate"
      [ngTemplateOutletContext]="{
        $implicit: suffix,
        showLoading: onlySuffix
      }"
    ></ng-container>
  `,
})
export class MznButtonComponent extends MznButtonMixin {
  constructor(
    elementRef: ElementRef<HTMLElement>,
    renderer: Renderer2,
    @SkipSelf()
    @Optional()
    @Inject(MznButtonGroupControlInputsToken)
    readonly buttonGroup?: MznButtonGroupControlInputs,
  ) {
    super(elementRef, renderer, buttonGroup);
  }

  @ContentChild('prefix')
  prefix?: TemplateRef<any>;

  @ContentChild('suffix')
  suffix?: TemplateRef<any>;

  get onlySuffix() {
    return !this.prefix && !!this.suffix;
  }

  readonly labelClass = classes.label;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mzn-button')
  _variant: EnumWithFallbackInput<ButtonVariant>;
}
