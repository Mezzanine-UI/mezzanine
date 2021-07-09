import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: '[mzn-tab-body]',
  exportAs: 'mzn-tab-body',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="active">
      <ng-template [ngTemplateOutlet]="content"></ng-template>
    </ng-container>
   `,
})
export class MznTabBodyComponent {
  @Input() content: TemplateRef<void> | null = null;

  @Input() active = false;
}
