import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InverseKinematicsRoutingModule } from './inverse-kinematics-routing.module';
import { InverseKinematicsComponent } from './inverse-kinematics.component';


@NgModule({
  declarations: [
    InverseKinematicsComponent
  ],
  imports: [
    CommonModule,
    InverseKinematicsRoutingModule
  ]
})
export class InverseKinematicsModule { }
