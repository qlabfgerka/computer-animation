import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ``,
    loadChildren: () =>
      import(
        './components/animation/inverse-kinematics/inverse-kinematics.module'
      ).then((m) => m.InverseKinematicsModule),
  },
  {
    path: `rigid-body`,
    loadChildren: () =>
      import(
        './components/animation/rigid-body-simulation/rigid-body-simulation.module'
      ).then((m) => m.RigidBodySimulationModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
