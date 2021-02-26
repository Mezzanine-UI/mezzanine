import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznTypographyModule } from '@mezzanine-ui/ng/typography';
import { MznAlertComponent } from './alert.component';

@NgModule({
  imports: [CommonModule, MznIconModule, MznTypographyModule],
  declarations: [MznAlertComponent],
  exports: [MznAlertComponent],
})
export class MznAlertModule {}
