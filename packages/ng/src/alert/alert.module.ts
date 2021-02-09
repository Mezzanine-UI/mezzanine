import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznIconModule } from '../icon';
import { MznTypographyModule } from '../typography';
import { MznAlertComponent } from './alert.component';

@NgModule({
  imports: [CommonModule, MznIconModule, MznTypographyModule],
  declarations: [MznAlertComponent],
  exports: [MznAlertComponent],
})
export class MznAlertModule {}
