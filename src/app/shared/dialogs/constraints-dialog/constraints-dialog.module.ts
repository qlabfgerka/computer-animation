import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstraintsDialogRoutingModule } from './constraints-dialog-routing.module';
import { ConstraintsDialogComponent } from './constraints-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ConstraintsDialogComponent],
  imports: [
    CommonModule,
    ConstraintsDialogRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  exports: [ConstraintsDialogComponent],
})
export class ConstraintsDialogModule {}
