import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InverseKinematicsComponent } from './inverse-kinematics.component';

describe('InverseKinematicsComponent', () => {
  let component: InverseKinematicsComponent;
  let fixture: ComponentFixture<InverseKinematicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InverseKinematicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InverseKinematicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
