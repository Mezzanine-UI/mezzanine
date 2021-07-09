import { Directive } from '@angular/core';
import {
  menuDividerClasses as classes,
} from '@mezzanine-ui/core/menu';
import { HostBindingClass } from '@mezzanine-ui/ng/cdk';

@Directive({
  selector: '[mznMenuDivider]',
  exportAs: 'mznMenuDivider',
})

/**
 * The ng component for `mezzanine` menu divider.
 */
export class MznMenuDividerDirective {
  @HostBindingClass(classes.host)
  readonly bindingHostClass = true;
}
