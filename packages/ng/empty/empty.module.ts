import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznTypographyModule } from '@mezzanine-ui/ng/typography';
import { MznEmptyComponent } from './empty.component';

@NgModule({
  imports: [CommonModule, MznIconModule, MznTypographyModule],
  declarations: [MznEmptyComponent],
  exports: [MznEmptyComponent],
})
export class MznEmptyModule {}
