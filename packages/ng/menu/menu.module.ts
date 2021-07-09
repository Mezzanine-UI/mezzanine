import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznIconModule } from '../icon';
import { MznMenuComponent } from './menu.component';
import { MznMenuItemGroupComponent } from './menu-item-group.component';
import { MznMenuItemComponent } from './menu-item.component';
import { MznMenuDividerDirective } from './menu-divider.directive';

@NgModule({
  imports: [CommonModule, MznIconModule],
  declarations: [
    MznMenuComponent,
    MznMenuDividerDirective,
    MznMenuItemComponent,
    MznMenuItemGroupComponent,
  ],
  exports: [
    MznMenuComponent,
    MznMenuDividerDirective,
    MznMenuItemComponent,
    MznMenuItemGroupComponent,
  ],
})

export class MznMenuModule {}
