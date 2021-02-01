import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  Optional,
  Renderer2,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import {
  buttonClasses as classes,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { EnumWithFallbackInput } from '../cdk';
import { MznButtonMixin } from './button.mixin';
import { MznButtonGroupControlInputs, MznButtonGroupControlInputsToken } from './button-group.tokens';

/**
 * The ng component for `mezzanine` button only has icon.
 */
@Component({
  selector: 'button[mzn-icon-button],a[mzn-icon-button],label[mzn-icon-button]',
  exportAs: 'mznIconButton',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <i
      *ngIf="loading"
      [mzn-icon]="loadingIcon"
      spin
    ></i>
    <ng-content *ngIf="!loading"></ng-content>
  `,
})
export class MznIconButtonComponent extends MznButtonMixin {
  constructor(
    elementRef: ElementRef<HTMLElement>,
    renderer: Renderer2,
    @SkipSelf()
    @Optional()
    @Inject(MznButtonGroupControlInputsToken)
    protected readonly buttonGroup?: MznButtonGroupControlInputs,
  ) {
    super(elementRef, renderer, buttonGroup);
  }

  @HostBinding(`class.${classes.icon}`)
  readonly bindIconClass = true;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mzn-icon-button')
  variantInput: EnumWithFallbackInput<ButtonVariant>;
}
