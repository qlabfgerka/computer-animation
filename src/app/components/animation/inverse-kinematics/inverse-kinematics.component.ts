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

  public mouseEnter(event: MouseEvent): void {
    let dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [
          -(this.frame.nativeElement.offsetWidth / 2 - event.offsetX) / 7,
          (this.frame.nativeElement.offsetHeight / 2 - event.offsetY) / 7,
          0,
        ],
        3
      )
    );
    let dotMaterial = new THREE.PointsMaterial({ size: 5, color: 0x00ff00 });
    let dot = new THREE.Points(dotGeometry, dotMaterial);
    this.scene.add(dot);

    this.renderer.render(this.scene, this.camera);
  }

  public init(): void {
    this.frame.nativeElement.innerHTML = '';
    this.points = [];
    this.angles = new Array(this.bones).fill(0);
    console.log(this.angles);

    this.prepareScene();
  }

  private prepareScene(): void {
    this.initRenderer();
    this.initCamera();

    this.scene = new THREE.Scene();

    for (let i = 0; i < this.angles.length + 1; i++)
      this.points.push(new THREE.Vector3(i * this.length, 0));

    this.drawLines();
    this.renderer.render(this.scene, this.camera);

    this.drawAngles();
  }

  private drawAngles(): void {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].applyAxisAngle(new THREE.Vector3(0, 0, 1), i + 5);
    }

    this.scene.remove.apply(this.scene, this.scene.children);
    this.drawLines();
    this.renderer.render(this.scene, this.camera);
  }

  private drawLines(): void {
    for (let i = 0; i < this.points.length - 1; i++) {
      const points = [this.points[i], this.points[i + 1]];

      const material = new THREE.LineBasicMaterial({
        color: this.getRandomColor(),
      });

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.scene.add(new THREE.Line(geometry, material));
    }
  }

  private copy(value: any): any {
    return JSON.parse(JSON.stringify(value));
  }

  private getRandomColor(): THREE.ColorRepresentation {
    const color = new THREE.Color(0xffffff);
    color.setHex(Math.random() * 0xffffff);
    return color;
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.frame.nativeElement.offsetWidth - 5,
      this.frame.nativeElement.offsetHeight - 4
    );
    this.renderer.setClearColor(0xffffff);
    this.frame.nativeElement.appendChild(this.renderer.domElement);
  }
}
