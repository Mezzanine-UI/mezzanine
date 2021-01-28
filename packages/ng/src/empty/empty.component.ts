import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { emptyClasses as classes } from '@mezzanine-ui/core/empty';
import { FolderOpenIcon } from '@mezzanine-ui/icons';
import { BooleanInput, InputBoolean } from '../core';

/**
 * The ng component for `mezzanine` empty.
 */
@Component({
  selector: 'mzn-empty',
  exportAs: 'mznEmpty',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #defaultImageTemplate>
      <i [mzn-icon]="icon" [class]="classes.icon" color="disabled"></i>
    </ng-template>

    <ng-template [ngTemplateOutlet]="image || defaultImageTemplate"></ng-template>
    <div *ngIf="title" mzn-typography="h3" [class]="classes.title" color="text-secondary">{{title}}</div>
    <div mzn-typography="body1" color="text-secondary">
      <ng-content></ng-content>
    </div>
  `,
})
export class MznEmptyComponent {
  static ngAcceptInputType_spin: BooleanInput;

  @HostBinding(`class.${classes.host}`)
  readonly bindHostClass = true;

  readonly classes = classes;

  icon = FolderOpenIcon;

  /**
   * If true, set height of host to 100%.
   */
  @HostBinding(`class.${classes.fullHeight}`)
  @Input()
  @InputBoolean()
  fullHeight = false;

  /**
   * A TemplateRef for override default icon.
   */
  @Input()
  image?: TemplateRef<any>;

  /**
   * The empty title.
   */
  @Input()
  title?: string;
}
