import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { formGroupClasses as classes } from '@mezzanine-ui/core/form';

/**
 * 表單群組元件，將多個表單欄位歸組並加上標題。
 *
 * @example
 * ```html
 * import { MznFormGroup } from '@mezzanine-ui/ng/form';
 *
 * <div mznFormGroup title="基本資料">
 *   <div mznFormField name="name" label="姓名">...</div>
 *   <div mznFormField name="email" label="信箱">...</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznFormGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.fieldsContainerClassName]': 'null',
    '[attr.title]': 'null',
  },
  template: `
    <div [class]="titleClass">{{ title() }}</div>
    <div [class]="fieldsContainerClass()">
      <ng-content />
    </div>
  `,
})
export class MznFormGroup {
  protected readonly hostClass = classes.host;
  protected readonly titleClass = classes.title;
  protected readonly fieldsContainerClass = computed(() => {
    const extra = this.fieldsContainerClassName();
    return extra
      ? `${classes.fieldsContainer} ${extra}`
      : classes.fieldsContainer;
  });

  /** fields container div 的額外 CSS class。 */
  readonly fieldsContainerClassName = input<string>();

  /** 群組標題。 */
  readonly title = input.required<string>();
}
