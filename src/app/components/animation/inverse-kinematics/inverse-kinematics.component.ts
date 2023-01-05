import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inverse-kinematics',
  templateUrl: './inverse-kinematics.component.html',
  styleUrls: ['./inverse-kinematics.component.scss'],
})
export class InverseKinematicsComponent implements OnInit {
  public settingsVisible: boolean = true;
  public bones: number = 0;
  public maxIterations: number = 1000;
  public error: number = 0.01;
  public g: number = 5;

  constructor() {}

  ngOnInit(): void {}

  public toggleVisibility(): void {
    this.settingsVisible = !this.settingsVisible;
  }
}
