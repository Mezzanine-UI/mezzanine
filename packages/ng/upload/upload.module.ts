import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznUploadResultComponent } from './upload-result.component';

@NgModule({
  imports: [CommonModule, MznIconModule],
  declarations: [MznUploadResultComponent],
  exports: [MznUploadResultComponent],
})
export class MznUploadResultModule {}
