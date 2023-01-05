import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InverseKinematicsComponent } from './inverse-kinematics.component';

const routes: Routes = [{ path: '', component: InverseKinematicsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InverseKinematicsRoutingModule {}
