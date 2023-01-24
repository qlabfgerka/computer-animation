import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Particle } from 'src/app/shared/models/particle/particle.model';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-particle-system',
  templateUrl: './particle-system.component.html',
  styleUrls: ['./particle-system.component.scss'],
})
export class ParticleSystemComponent implements AfterViewInit {
  @ViewChild('frame', { static: false }) private readonly frame!: ElementRef;

  public settingsVisible: boolean = true;
  public amount: number = 100;
  public health: number = 1;
  public speed: number = 2;
  public dampening: number = 3;
  public boundrySet: boolean = true;
  public collisions: boolean = false;

  private particles!: Array<Particle>;
  private boundingBox!: Array<THREE.Mesh>;

  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private id!: number;
  private start!: number;

  private readonly GRAVITY: number = -0.98;

  @HostListener('window:resize', ['$event'])
  private onResize(event: any): void {
    this.init();
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.init();
  }

  public boundrySetChanged(): void {
    this.init();
  }

  public collisionChanged(): void {
    this.init();
  }

  public toggleVisibility(): void {
    this.settingsVisible = !this.settingsVisible;
  }

  public init(): void {
    if (this.id) cancelAnimationFrame(this.id);
    this.frame.nativeElement.innerHTML = '';
    this.particles = new Array<Particle>();
    this.boundingBox = new Array<THREE.Mesh>();
    this.prepareScene();
  }

  private animate() {
    this.id = requestAnimationFrame(() => this.animate());

    let elapsed = Date.now() - this.start;
    this.start = Date.now();

    const toGenerate = (elapsed * this.amount) / 100;

    this.createParticles(toGenerate);
    if (this.collisions) this.handleCollision();
    this.updateParticles(elapsed);

    for (const particle of this.particles)
      if (particle.health! <= 0) this.scene.remove(particle.mesh!);

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  private prepareScene(): void {
    this.initRenderer();
    this.initCamera();

    this.scene = new THREE.Scene();

    this.prepareBoundingBox();

    this.start = Date.now();
    this.animate();
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(100, 0, 0);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.frame.nativeElement.offsetWidth,
      this.frame.nativeElement.offsetHeight
    );
    this.renderer.setClearColor(0xffffff);
    this.frame.nativeElement.appendChild(this.renderer.domElement);
  }

  private prepareBoundingBox(): void {
    let meshGeometry = new THREE.BoxGeometry(50, 1, 50);
    const x = [0, /*-25,*/ -25, 0, 0, 0];
    const y = [25, /*0,*/ 0, 0, 0, -25];
    const z = [0, /*0,*/ 0, 25, -25, 0];
    const angles = [0, /*90,*/ 90, 90, 90, 0];

    for (let i = 0; i < x.length; i++) {
      let meshMaterial = new THREE.MeshBasicMaterial({
        color: this.getRandomColor(),
      });

      const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
      mesh.position.set(x[i], y[i], z[i]);

      if (i < 2) mesh.rotateZ(THREE.MathUtils.degToRad(angles[i]));
      else mesh.rotateX(THREE.MathUtils.degToRad(angles[i]));

      this.boundingBox.push(mesh);
      this.scene.add(mesh);
    }
  }

  private createParticle(): Particle {
    const geometry = new THREE.SphereGeometry(1);
    const material = new THREE.PointsMaterial({
      color: this.getRandomColor(),
      size: 1,
    });

    return {
      health: this.getRandomNumber(60, 100),
      position: new THREE.Vector3(
        this.getRandomNumber(-10, 10),
        this.getRandomNumber(-10, 10),
        0
      ),
      speed: new THREE.Vector3(
        this.getRandomNumber(-this.speed, this.speed),
        this.getRandomNumber(-this.speed, 2 * this.speed),
        this.getRandomNumber(-this.speed, this.speed)
      ),
      mesh: new THREE.Mesh(geometry, material),
    };
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private getRandomColor(): THREE.ColorRepresentation {
    const color = new THREE.Color(0xffffff);
    color.setHex(Math.random() * 0xffffff);
    return color;
  }

  private createParticles(toGenerate: number): void {
    let particle: Particle;

    while (this.particles.length < this.amount && toGenerate >= 0) {
      particle = this.createParticle();
      this.particles.push(particle);
      --toGenerate;
    }

    for (let i = 0; i < this.particles.length; i++) {
      if (toGenerate <= 0) break;
      if (this.particles[i].health! > 0) continue;

      particle = this.createParticle();

      this.particles[i] = particle;
      --toGenerate;
    }
  }

  private updateParticles(elapsed: number): void {
    for (let i = 0; i < this.particles.length; i++) {
      if (!this.particles[i]) continue;

      this.particles[i].speed!.y =
        this.particles[i].speed?.y! + this.GRAVITY / elapsed;

      this.particles[i].mesh!.position.set(
        this.particles[i]!.position?.x! + this.particles[i]!.speed!.x / elapsed,
        this.particles[i]!.position?.y! + this.particles[i]!.speed!.y / elapsed,
        this.particles[i]!.position?.z! + this.particles[i]!.speed!.z / elapsed
      );
      this.particles[i].position = this.particles[i].mesh?.position;
      this.particles[i].health! -= this.health;

      this.scene.add(this.particles[i].mesh!);
    }
  }

  private handleCollision(): void {
    let positionDifference: THREE.Vector3;
    let speedDifference: THREE.Vector3;
    let normal: THREE.Vector3;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = 0; j < this.particles.length; j++) {
        if (i === j) continue;

        positionDifference = new THREE.Vector3().subVectors(
          this.particles[i].position!,
          this.particles[j].position!
        );
        speedDifference = new THREE.Vector3().subVectors(
          this.particles[i].speed!,
          this.particles[j].speed!
        );

        if (
          positionDifference.dot(speedDifference) < 0 &&
          positionDifference.length() < 2
        ) {
          normal = positionDifference.divideScalar(positionDifference.length());
          this.particles[i].speed = this.particles[i]!.speed?.sub(
            normal.multiply(
              this.particles[i]!.speed?.multiply(normal)?.multiplyScalar(
                1 + this.dampening
              )!
            )
          );

          this.particles[j].speed = this.particles[j]!.speed?.sub(
            normal.multiply(
              this.particles[j]!.speed?.multiply(normal)?.multiplyScalar(
                1 + this.dampening
              )!
            )
          );

          break;
        }
      }
    }
  }
}
