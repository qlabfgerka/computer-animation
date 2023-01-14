import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RigidBodySimulationComponent } from './rigid-body-simulation.component';

const routes: Routes = [{ path: '', component: RigidBodySimulationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RigidBodySimulationRoutingModule {}
