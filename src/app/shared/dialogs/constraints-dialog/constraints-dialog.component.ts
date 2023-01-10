import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-constraints-dialog',
  templateUrl: './constraints-dialog.component.html',
  styleUrls: ['./constraints-dialog.component.scss'],
})
export class ConstraintsDialogComponent implements OnInit {
  public constraintsCount!: number;
  public angles!: Array<number>;
  public constraints!: Array<number>;
  public weights!: Array<number>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readonly dialogRef: MatDialogRef<ConstraintsDialogComponent>
  ) {
    if (this.data) {
      this.constraintsCount = this.data.constraintsCount;
      this.angles = this.data.angles;
      this.constraints = this.data.constraints;
      this.weights = this.data.weights;
    }
  }

  ngOnInit(): void {}

  public apply(): void {
    this.dialogRef.close({
      angles: this.angles,
      constraints: this.constraints,
      weights: this.weights,
    });
  }
}
