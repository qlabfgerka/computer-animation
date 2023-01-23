import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsDialogRoutingModule } from './settings-dialog-routing.module';
import { SettingsDialogComponent } from './settings-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SettingsDialogComponent],
  imports: [
    CommonModule,
    SettingsDialogRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  exports: [SettingsDialogComponent],
})
export class SettingsDialogModule {}
