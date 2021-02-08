import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznIconModule } from '../icon';
import { MznTagComponent } from './tag.component';

@NgModule({
  imports: [CommonModule, MznIconModule],
  declarations: [MznTagComponent],
  exports: [MznTagComponent],
})
export class MznTagModule {}
