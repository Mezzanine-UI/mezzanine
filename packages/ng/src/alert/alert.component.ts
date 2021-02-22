import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  alertClasses as classes,
  alertIcons,
  AlertSeverity,
} from '@mezzanine-ui/core/alert';
import { HostBindingEnumClass } from '../cdk';

/**
 * The ng component for `mezzanine` alert.
 */
@Component({
  selector: 'mzn-alert',
  exportAs: 'mznAlert',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <i
      [mzn-icon]="severityIcon"
      [class]="classes.icon"
      [color]="severity"
    ></i>
    <p mzn-typography="body1" [class]="classes.message">
      <ng-content></ng-content>
    </p>
    <i
      [mzn-icon]="closeIcon"
      [class]="classes.closeIcon"
      (click)="onClose($event)"
      role="button"
    ></i>
  `,
})
export class MznAlertComponent {
  @HostBinding(`class.${classes.host}`)
  readonly bindHostClass = true;

  readonly classes = classes;

  closeIcon = TimesIcon;

  get severityIcon() {
    return alertIcons[this.severity];
  }

  /**
   * The severity of alert.
   * @default 'success'
   */
  @HostBindingEnumClass(classes.severity, [
    'success',
    'warning',
    'error',
  ])
  @Input()
  severity: AlertSeverity = 'success';

  /**
   * Fired on close icon clicked.
   */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  readonly close = new EventEmitter<MouseEvent>();

  onClose(event: MouseEvent) {
    this.close.emit(event);
  }
}
