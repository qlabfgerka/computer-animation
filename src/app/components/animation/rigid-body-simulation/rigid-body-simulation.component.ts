import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as THREE from 'three';
// @ts-ignore
import * as OIMO from 'oimo';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from 'src/app/shared/dialogs/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-rigid-body-simulation',
  templateUrl: './rigid-body-simulation.component.html',
  styleUrls: ['./rigid-body-simulation.component.scss'],
})
export class RigidBodySimulationComponent implements OnInit, AfterViewInit {
  @ViewChild('frame', { static: false }) private readonly frame!: ElementRef;

  public settingsVisible: boolean = true;
  public angle: number = 12;
  public cubes: number = 10;
  public spheres: number = 10;
  public size: number = 50;

  private world: OIMO.World;
  private objects!: Array<{ body: any; mesh: THREE.Mesh }>;
  private intersected: any = null;
  private mouseClick: boolean = false;

  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  private mesh!: THREE.Mesh;
  private worldMesh: any;

  private cubeRestitution: number = 1;
  private cubeFriction: number = 0.2;
  private cubeSize: number = 5;
  private sphereRestitution: number = 1;
  private sphereFriction: number = 0.2;
  private sphereSize: number = 5;

  @HostListener('window:resize', ['$event'])
  private onResize(event: any): void {
    this.frame.nativeElement.innerHTML = '';
    this.prepareScene();
  }

  constructor(private readonly dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnInit(): void {}

  public formatLabel(value: number): string {
    return `${value}°`;
  }

  public toggleVisibility(): void {
    this.settingsVisible = !this.settingsVisible;
  }

  public init(): void {
    this.objects = [];
    this.frame.nativeElement.innerHTML = '';
    this.prepareScene();
  }

  public openCubeSettings(): void {
    const settingsDialogRef = this.dialog.open(SettingsDialogComponent, {
      data: {
        labels: ['Restitution', 'Friction', 'Size'],
        settings: [this.cubeRestitution, this.cubeFriction, this.cubeSize],
      },
    });

    settingsDialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.cubeRestitution = data.settings[0];
        this.cubeFriction = data.settings[1];
        this.cubeSize = data.settings[2];
        this.init();
      }
    });
  }

  public openSphereSettings(): void {
    const settingsDialogRef = this.dialog.open(SettingsDialogComponent, {
      data: {
        labels: ['Restitution', 'Friction', 'Size'],
        settings: [
          this.sphereRestitution,
          this.sphereFriction,
          this.sphereSize,
        ],
      },
    });

    settingsDialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.sphereRestitution = data.settings[0];
        this.sphereFriction = data.settings[1];
        this.sphereSize = data.settings[2];
        this.init();
      }
    });
  }

  public mouseMove(event: MouseEvent): void {
    if (!this.mouseClick) return;

    this.generateObject(
      this.getRandomIntInclusive(0, 1),
      -(this.frame.nativeElement.offsetWidth / 2 - event.offsetX) / 7,
      (this.frame.nativeElement.offsetHeight / 2 - event.offsetY) / 7
    );
  }

  public mouseDown(): void {
    this.mouseClick = true;
  }

  public mouseUp(): void {
    this.mouseClick = false;
  }

  private prepareScene(): void {
    this.initRenderer();
    this.initCamera();

    this.scene = new THREE.Scene();

    this.initMesh();
    this.initLight();

    this.initWorld();
    this.createObject();

    this.animate();
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(-100, 75, 120);
    this.camera.lookAt(0, 10, 0);

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //this.controls.update();
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

  private initMesh(): void {
    let meshGeometry = new THREE.BoxGeometry(this.size, 0.5, this.size);
    let meshMaterial = new THREE.MeshLambertMaterial({
      color: this.getRandomColor(),
    });
    this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
    this.mesh.position.set(0, -0.25, 0);
    this.mesh.rotateZ(THREE.MathUtils.degToRad(this.angle));
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  private initLight(): void {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 0); //default; light shining from top
    light.castShadow = true; // default false
    this.scene.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
  }

  private initWorld(): void {
    this.world = new OIMO.World({
      timestep: 1 / 60, // hitrost simulacije mora biti v skladu s hitrostjo izrisa
      iterations: 8, // več iteracij, bolj natančno
      broadphase: 2, // iskanje trkov: 1 brute force, 2 sweep and prune, 3 volume tree
      worldscale: 1, // skala, privzeta velikost objektov od 0.1 do 10
      random: true, // dodaj naključnost v simulacijo
      info: false, // izpis statistike
      gravity: [0, -9.8, 0], //fizika na Zemlji, za Mars uporabite drugačne konstante
    });

    this.worldMesh = {
      type: 'box',
      size: [this.size, 0.5, this.size],
      pos: [0, -0.25, 0],
      rot: [0, 0, this.angle],
      density: 1,
      move: false,
    };

    this.world.add(this.worldMesh);
  }

  private createObject(): void {
    for (let i = 0; i < this.cubes; i++) this.generateObject(0);
    for (let i = 0; i < this.spheres; i++) this.generateObject(1);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.world.step();

    this.objects.forEach((object) => {
      object.mesh.position.copy(object.body.getPosition());
      object.mesh.quaternion.copy(object.body.getQuaternion());

      if (object.body.getPosition().y < -100)
        object.body.resetPosition(
          this.getRandomIntInclusive(-10, 10),
          this.getRandomIntInclusive(this.size - 10, this.size + 10),
          this.getRandomIntInclusive(-10, 10)
        );
    });

    //this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  private generateObject(
    type: number,
    x: number | null = null,
    z: number | null = null
  ): void {
    let geometry: THREE.BoxGeometry | THREE.SphereGeometry;
    const material = new THREE.MeshLambertMaterial({
      color: this.getRandomColor(),
    });

    if (type === 0)
      geometry = new THREE.BoxGeometry(
        this.cubeSize,
        this.cubeSize,
        this.cubeSize
      );
    else if (type === 1)
      geometry = new THREE.SphereGeometry(
        this.sphereSize,
        this.sphereSize,
        this.sphereSize
      );

    const body = this.world.add({
      type: type === 0 ? 'box' : 'sphere', // type of shape : sphere, box, cylinder
      size:
        type === 0
          ? [this.cubeSize, this.cubeSize, this.cubeSize]
          : [this.sphereSize, this.sphereSize, this.sphereSize], // size of shape
      pos: [
        x ? x : this.getRandomIntInclusive(-10, 10),
        this.getRandomIntInclusive(this.size - 10, this.size + 10),
        z ? z : this.getRandomIntInclusive(-10, 10),
      ], // start position in meters
      rot: [0, 0, 90], // start rotation in degree
      move: true, // dynamic or static
      density: 1, // masa
      friction: type === 0 ? this.cubeFriction : this.sphereFriction,
      restitution: type === 0 ? this.cubeRestitution : this.sphereRestitution, //odbojnost
      belongsTo: 1, // The bits of the collision groups to which the shape belongs.
      collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides
    });

    const mesh = new THREE.Mesh(geometry!, material);

    mesh.castShadow = true; //default is false
    mesh.receiveShadow = false; //default

    this.scene.add(mesh);

    this.objects.push({ body, mesh });
  }

  private getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getRandomColor(): THREE.ColorRepresentation {
    const color = new THREE.Color(0xffffff);
    color.setHex(Math.random() * 0xffffff);
    return color;
  }
}
