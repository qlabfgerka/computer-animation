import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-inverse-kinematics',
  templateUrl: './inverse-kinematics.component.html',
  styleUrls: ['./inverse-kinematics.component.scss'],
})
export class InverseKinematicsComponent implements AfterViewInit {
  @ViewChild('frame', { static: false }) private readonly frame!: ElementRef;

  public settingsVisible: boolean = true;
  public bones: number = 4;
  public maxIterations: number = 1000;
  public error: number = 0.01;
  public g: number = 5;

  private points: Array<THREE.Vector3> = [];
  private angles: Array<number> = [];
  private length: number = 5;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;

  @HostListener('window:resize', ['$event'])
  private onResize(event: any): void {
    this.frame.nativeElement.innerHTML = '';
    this.prepareScene();
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnInit(): void {}

  public toggleVisibility(): void {
    this.settingsVisible = !this.settingsVisible;
  }

  public init(): void {
    this.frame.nativeElement.innerHTML = '';
    this.angles = new Array(this.bones + 1).fill(0);
    console.log(this.angles);

    this.prepareScene();
  }

  private prepareScene(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.frame.nativeElement.offsetWidth - 5,
      this.frame.nativeElement.offsetHeight - 4
    );
    this.renderer.setClearColor(0xffffff);
    this.frame.nativeElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();

    for (let i = 0; i < this.angles.length; i++)
      this.points.push(new THREE.Vector3(i * this.length, 0));

    this.scene.add(this.createLines());
    this.renderer.render(this.scene, this.camera);
  }

  private drawAngles(): void {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].applyAxisAngle(new THREE.Vector3(0, 0, 1), i * 5);
    }

    this.scene.remove.apply(this.scene, this.scene.children);
    this.scene.add(this.createLines());
    this.renderer.render(this.scene, this.camera);
  }

  private createLines(): THREE.Line {
    const material = new THREE.LineBasicMaterial({
      color: 0x000000,
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);

    return new THREE.Line(geometry, material);
  }

  private copy(value: any): any {
    return JSON.parse(JSON.stringify(value));
  }
}
