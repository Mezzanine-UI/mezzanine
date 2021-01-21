import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MznIconModule } from '../icon';
import { MznButtonComponent } from './button.component';
import { MznIconButtonComponent } from './icon-button.component';
import { MznButtonGroupComponent } from './button-group.component';

@NgModule({
  imports: [CommonModule, MznIconModule],
  declarations: [MznButtonComponent, MznIconButtonComponent, MznButtonGroupComponent],
  exports: [MznButtonComponent, MznIconButtonComponent, MznButtonGroupComponent],
})
export class MznButtonModule {}
