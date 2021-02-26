import { Directive } from '@angular/core';
import {
  badgeClasses as classes,
} from '@mezzanine-ui/core/badge';
import { HostBindingClass } from '@mezzanine-ui/ng/cdk';

/**
 * The ng directive for `mezzanine` badge container.
 */
@Directive({
  selector: '[mznBadgeContainer]',
  exportAs: 'mznBadgeContainer',
})
export class MznBadgeContainerDirective {
  @HostBindingClass(classes.container)
  readonly bindContainerClass = true;
}
