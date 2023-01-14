import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RigidBodySimulationComponent } from './rigid-body-simulation.component';

describe('RigidBodySimulationComponent', () => {
  let component: RigidBodySimulationComponent;
  let fixture: ComponentFixture<RigidBodySimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RigidBodySimulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RigidBodySimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
