import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintsDialogComponent } from './constraints-dialog.component';

describe('ConstraintsDialogComponent', () => {
  let component: ConstraintsDialogComponent;
  let fixture: ComponentFixture<ConstraintsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstraintsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstraintsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
