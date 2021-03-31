import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { tabsClasses as classes } from '@mezzanine-ui/core/tabs';
import { HostBindingClass, InputNumber, NumberInput } from '@mezzanine-ui/ng/cdk';
import { MznTabComponent } from './tab.component';
@Component({
  selector: 'mzn-tabs',
  exportAs: 'mznTabs',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [class]="classes.tabBar">
      <button
        *ngFor="let tab of tabs; let i = index"
        [attr.aria-disabled]="tab.disabled"
        [attr.aria-selected]="selectedIndex == i"
        [disabled]="tab.disabled"
        [ngClass]="getTabClasses(selectedIndex === i)"
        (click)="selectTab(i, $event)"
      >
        <ng-template [ngIf]="tab.titleTemplate">
          <ng-template [ngTemplateOutlet]="tab.titleTemplate"></ng-template>
        </ng-template>

        <ng-template [ngIf]="tab.title">
          <ng-container >{{ tab.title }}</ng-container>
        </ng-template>
      </button>
    </div>
    <div
      mzn-tab-body
      *ngFor="let tab of tabs; let i = index"
      [class]="classes.pane"
      [active]="selectedIndex === i"
      [content]="tab.content"
    ></div>
  `,
})

export class MznTabsComponent {
  static ngAcceptInputType_selectedIndex: NumberInput;

  @HostBindingClass(classes.host)
  readonly bindHostClass = true;

  classes = classes;

  @ContentChildren(MznTabComponent, { descendants: true }) tabs: QueryList<MznTabComponent>;

  /** The index of the active tab. */
  @Input()
  @InputNumber()
  selectedIndex?: number = 0;

  /** Current tab's index change callback */
  /** Output to enable support for two-way binding on `[(selectedIndex)]` */
  @Output() selectedIndexChange = new EventEmitter<number>();

  /**
   * Current tab's change callback
   */
  @Output() selectChange? = new EventEmitter<MouseEvent>();

  getTabClasses(isActive?: boolean) {
    return {
      [classes.tab]: true,
      [classes.tabActive]: isActive,
    };
  }

  selectTab(index: number, e: MouseEvent) {
    const isActive = this.selectedIndex === index;

    if (!isActive) {
      this.setSelectedIndex(index);
      this.tabs.notifyOnChanges();
    }

    if (this.selectChange) {
      this.selectChange.emit(e);
    }
  }

  setSelectedIndex(index: number): void {
    this.selectedIndex = index;
    this.selectedIndexChange.emit(this.selectedIndex);
  }
}
