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
  public error: number = 1.5;
  public g: number = 5;

  private angles: Array<number> = [];
  private colors: Array<THREE.ColorRepresentation> = [];
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

    const target = new THREE.Vector3(
      -(this.frame.nativeElement.offsetWidth / 2 - event.offsetX) / 7,
      (this.frame.nativeElement.offsetHeight / 2 - event.offsetY) / 7,
      1
    );

    let iteration = 0;
    let error = Math.abs(target.distanceTo(this.drawLines(this.angles, false)));
    while (error > this.error && iteration < this.maxIterations) {
      const gradients = [];

      for (let i = 0; i < this.angles.length; i++) {
        const anglesPlus = this.copy(this.angles);
        const anglesMinus = this.copy(this.angles);
        anglesPlus[i] = anglesPlus[i] + this.g;
        anglesMinus[i] = anglesMinus[i] - this.g;

        const anglesPlusRes = this.drawLines(anglesPlus, false);
        const anglesMinusRes = this.drawLines(anglesMinus, false);

        gradients[i] =
          anglesPlusRes.distanceTo(target) - anglesMinusRes.distanceTo(target);
      }

      for (let i = 0; i < this.angles.length; i++)
        this.angles[i] -= gradients[i];

      ++iteration;

      this.scene.remove.apply(this.scene, this.scene.children);
      this.scene.add(dot);
      error = Math.abs(target.distanceTo(this.drawLines(this.angles)));
      this.renderer.render(this.scene, this.camera);
    }
  }

  public init(): void {
    this.frame.nativeElement.innerHTML = '';
    this.angles = new Array(this.bones).fill(0);
    this.colors = new Array<THREE.ColorRepresentation>();

    for (let i = 0; i <= this.bones; i++)
      this.colors.push(this.getRandomColor());

    this.prepareScene();
  }

  private prepareScene(): void {
    this.initRenderer();
    this.initCamera();

    this.scene = new THREE.Scene();

    this.drawLines(this.angles);
    this.renderer.render(this.scene, this.camera);
  }

  private drawLines(
    angles: Array<number>,
    draw: boolean = true
  ): THREE.Vector3 {
    if (!angles) return null!;

    let currentPosition = new THREE.Vector3(0, 0, 0);
    let currentRotation = new THREE.Euler(
      0,
      0,
      THREE.MathUtils.degToRad(angles[0]),
      'XYZ'
    );

    for (let i = 1; i <= angles.length; i++) {
      let nextPosition = new THREE.Vector3(10, 0, 0);
      nextPosition.applyEuler(currentRotation);
      nextPosition.add(currentPosition);

      let lineGeometry = new THREE.BufferGeometry();
      let positions = [currentPosition, nextPosition];
      lineGeometry.setFromPoints(positions);

      const material = new THREE.LineBasicMaterial({
        color: this.colors[i],
      });

      let line = new THREE.Line(lineGeometry, material);
      if (draw) this.scene.add(line);

      currentPosition = nextPosition;
      currentRotation.z += THREE.MathUtils.degToRad(angles[i]);
    }

    return currentPosition;
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
