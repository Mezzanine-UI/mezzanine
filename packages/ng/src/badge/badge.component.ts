import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  badgeClasses as classes,
} from '@mezzanine-ui/core/badge';
import {
  BooleanInput,
  InputBoolean,
  InputNumber,
  NumberInput,
} from '../cdk';

/**
 * The ng component for `mezzanine` badge.
 */
@Component({
  selector: 'mzn-badge',
  exportAs: 'mznBadge',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #overflowTemplate>{{overflowCount}}+</ng-template>
    <ng-template #countTemplate>
      <ng-container *ngIf="content <= overflowCount; else overflowTemplate">{{content}}</ng-container>
    </ng-template>

    <ng-container *ngIf="!dot">
      <ng-container *ngIf="isContentAsCount; then countTemplate; else contentTemplate">
      </ng-container>
    </ng-container>
  `,
})
export class MznBadgeComponent {
  static ngAcceptInputType_dot: BooleanInput;

  static ngAcceptInputType_overflowCount: NumberInput;

  @HostBinding(`class.${classes.host}`)
  readonly bindHostClass = true;

  @HostBinding(`class.${classes.hide}`)
  get bindHideClass() {
    return !this.dot && this.content === 0;
  }

  get contentTemplate() {
    return this.content instanceof TemplateRef
      ? this.content
      : null;
  }

  get isContentAsCount() {
    return typeof this.content === 'number';
  }

  /**
   * If content is number, seen as count which will interact with overflowCount.
   * Or render the template.
   */
  @Input()
  content: TemplateRef<any> | number;

  /**
   * It `true`, ignore passed children and display as a dot.
   * @default false
   */
  @HostBinding(`class.${classes.dot}`)
  @Input()
  @InputBoolean()
  dot = false;

  /**
   * If the content is number and greater than overflowCount, it will show overflowCount suffixed with a "+".
   * @default 99
   */
  @Input()
  @InputNumber(99)
  overflowCount = 99;
}
