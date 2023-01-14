import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
  public labels!: Array<string>;
  public settings!: Array<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readonly dialogRef: MatDialogRef<SettingsDialogComponent>
  ) {
    if (this.data) {
      this.labels = this.data.labels;
      this.settings = this.data.settings;
    }
  }

  ngOnInit(): void {}

  public apply(): void {
    this.dialogRef.close({
      labels: this.labels,
      settings: this.settings,
    });
  }
}
