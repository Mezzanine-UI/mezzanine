import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  menuItemGroupClasses as classes,
} from '@mezzanine-ui/core/menu';
import {
  HostBindingClass,
} from '@mezzanine-ui/ng/cdk';

@Component({
  selector: 'li[mzn-menu-item-group]',
  exportAs: 'mznMenuGroup',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span #labelElement [class]="classes.label">{{label}}</span>
    <ng-content></ng-content>
  `,
})

export class MznMenuItemGroupComponent implements AfterViewInit {
  constructor(
    private readonly renderer: Renderer2,
  ) {}

  @HostBindingClass(classes.host)
  readonly bindingHostClass = true;

  readonly classes = classes;

  @Input()
  label?: string | TemplateRef<void>;

  @ViewChild('labelElement') labelElement?: ElementRef;

  ngAfterViewInit(): void {
    const ulElement = this.labelElement?.nativeElement.nextElementSibling;

    if (ulElement) {
      /* add class to ul */
      this.renderer.addClass(ulElement, classes.items);
    }
  }
}
