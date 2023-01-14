import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InverseKinematicsRoutingModule } from './inverse-kinematics-routing.module';
import { InverseKinematicsComponent } from './inverse-kinematics.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConstraintsDialogModule } from 'src/app/shared/dialogs/constraints-dialog/constraints-dialog.module';

@NgModule({
  declarations: [InverseKinematicsComponent],
  imports: [
    CommonModule,
    InverseKinematicsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ConstraintsDialogModule,
  ],
})
export class InverseKinematicsModule {}
