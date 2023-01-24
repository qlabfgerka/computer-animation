import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticleSystemComponent } from './particle-system.component';

describe('ParticleSystemComponent', () => {
  let component: ParticleSystemComponent;
  let fixture: ComponentFixture<ParticleSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticleSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticleSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
