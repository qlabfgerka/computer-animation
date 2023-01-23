import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticleSystemComponent } from './particle-system.component';

const routes: Routes = [{ path: '', component: ParticleSystemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticleSystemRoutingModule {}
