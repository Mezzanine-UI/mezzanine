import { Directive, HostBinding } from '@angular/core';
import {
  badgeClasses as classes,
} from '@mezzanine-ui/core/badge';

/**
 * The ng directive for `mezzanine` badge container.
 */
@Directive({
  selector: '[mznBadgeContainer]',
  exportAs: 'mznBadgeContainer',
})
export class MznBadgeContainerDirective {
  @HostBinding(`class.${classes.container}`)
  readonly bindContainerClass = true;
}
