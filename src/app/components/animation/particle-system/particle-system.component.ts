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
  public amount: number = 1;
  public speed: number = 1000;

  private particles!: Array<Particle>;

  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  @HostListener('window:resize', ['$event'])
  private onResize(event: any): void {
    this.init();
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.init();
  }

  public toggleVisibility(): void {
    this.settingsVisible = !this.settingsVisible;
  }

  public init(): void {
    this.frame.nativeElement.innerHTML = '';
    this.particles = new Array<Particle>();
    this.prepareScene();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    this.createParticles();

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].mesh!.position.set(
        this.particles[i]!.position?.x!,
        this.particles[i]!.position?.y!,
        this.particles[i]!.position?.z!
      );
      this.scene.add(this.particles[i].mesh!);
    }

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  private prepareScene(): void {
    this.initRenderer();
    this.initCamera();

    this.scene = new THREE.Scene();

    this.animate();
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(20, 20, 20);
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

  private createParticle(): Particle {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.PointsMaterial({
      color: this.getRandomColor(),
      size: 1,
    });

    return {
      health: this.getRandomNumber(60, 100),
      position: new THREE.Vector3(
        this.getRandomNumber(-1, 1),
        this.getRandomNumber(-1, 1),
        0
      ),
      speed: new THREE.Vector3(
        this.getRandomNumber(-1, 1),
        this.getRandomNumber(-1, 1),
        1
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

  private createParticles(): void {
    const deadParticles: number = this.particles
      .map((particle: Particle) => particle.health as number)
      .filter((health: number) => health <= 0).length;

    const toGenerate: number = Math.ceil(this.amount / 60);
    let particle: Particle;

    for (let i = toGenerate; i >= 0; i--) {
      particle = this.createParticle();

      if (this.particles.length < this.amount) this.particles.push(particle);
      else {
        for (let j = 0; j < this.particles.length; j++) {
          if (deadParticles < toGenerate) return;
          else if (this.particles[j].health! <= 0) this.particles[j] = particle;
        }
      }
    }
  }
}
