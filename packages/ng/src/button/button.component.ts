import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
import { InputBoolean, EnumWithFallbackInput } from '../cdk';
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
    <ng-template #iconTemplate>
      <i
        *ngIf="loading"
        [mzn-icon]="loadingIcon"
        spin
      ></i>
      <ng-content *ngIf="!loading" select="[mzn-icon]"></ng-content>
    </ng-template>

    <ng-template *ngIf="!iconOnEnd" [ngTemplateOutlet]="iconTemplate"></ng-template>
    <span [class]="labelClass">
      <ng-content></ng-content>
    </span>
    <ng-template *ngIf="iconOnEnd" [ngTemplateOutlet]="iconTemplate"></ng-template>
  `,
})
export class MznButtonComponent extends MznButtonMixin {
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

  readonly labelClass = classes.label;

  /**
   * Place icon after the label.
   * @default false
   */
  @Input()
  @InputBoolean()
  iconOnEnd = false;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('mzn-button')
  variantInput: EnumWithFallbackInput<ButtonVariant>;
}
