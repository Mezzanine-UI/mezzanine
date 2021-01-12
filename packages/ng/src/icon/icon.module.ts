import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznIconDirective } from './icon.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [MznIconDirective],
  exports: [MznIconDirective],
})
export class MznIconModule {}
