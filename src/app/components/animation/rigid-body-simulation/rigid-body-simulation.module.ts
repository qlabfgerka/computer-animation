import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RigidBodySimulationRoutingModule } from './rigid-body-simulation-routing.module';
import { RigidBodySimulationComponent } from './rigid-body-simulation.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { SettingsDialogModule } from 'src/app/shared/dialogs/settings-dialog/settings-dialog.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [RigidBodySimulationComponent],
  imports: [
    CommonModule,
    RigidBodySimulationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule,
    SettingsDialogModule,
    MatCheckboxModule,
  ],
})
export class RigidBodySimulationModule {}
