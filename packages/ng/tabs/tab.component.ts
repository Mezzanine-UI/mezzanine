import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  BooleanInput,
  InputBoolean,
} from '@mezzanine-ui/ng/cdk';

@Component({
  selector: 'mzn-tab',
  exportAs: 'mznTab',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #contentTemplate><ng-content></ng-content></ng-template>
  `,
})

/**
 * The ng component for `mezzanine` tab.
 */
export class MznTabComponent {
  static ngAcceptInputType_active: BooleanInput;

  static ngAcceptInputType_disabled: BooleanInput;

  @ContentChild('titleTemplate', { static: false }) titleTemplate!: TemplateRef<any>;

  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<any>;

  /**
   * The title of the tab
   */
  @Input()
  title: string | TemplateRef<any>;

  /**
    * Whether the tab is disabled
    * @default false
    */
  @Input()
  @InputBoolean()
  disabled = false;

  get content(): TemplateRef<any> {
    return this.contentTemplate;
  }
}
