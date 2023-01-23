import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticleSystemRoutingModule } from './particle-system-routing.module';
import { ParticleSystemComponent } from './particle-system.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [ParticleSystemComponent],
  imports: [
    CommonModule,
    ParticleSystemRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
})
export class ParticleSystemModule {}
