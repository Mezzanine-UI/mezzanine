import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznBadgeContainerDirective } from './badge-container.directive';
import { MznBadgeComponent } from './badge.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MznBadgeComponent, MznBadgeContainerDirective],
  exports: [MznBadgeComponent, MznBadgeContainerDirective],
})
export class MznBadgeModule {}
