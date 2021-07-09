import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznTabComponent } from './tab.component';
import { MznTabBodyComponent } from './tab-body.component';
import { MznTabsComponent } from './tabs.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MznTabsComponent, MznTabBodyComponent, MznTabComponent],
  exports: [MznTabsComponent, MznTabBodyComponent, MznTabComponent],
})

export class MznTabsModule {}
