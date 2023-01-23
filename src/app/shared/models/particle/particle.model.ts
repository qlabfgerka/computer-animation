import * as THREE from 'three';

export class Particle {
  position: THREE.Vector3 | null | undefined = null;
  speed: THREE.Vector3 | null | undefined = null;
  health: number | null | undefined = null;
  mesh: THREE.Mesh | null | undefined = null;
}
