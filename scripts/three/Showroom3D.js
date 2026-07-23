/* ==========================================================================
   CRYSTAL PARCHEESI STAR - 3D INTERACTIVE SHOWROOM PLATFORM
   ========================================================================== */

export class Showroom3D {
  constructor(threeManager) {
    this.threeManager = threeManager;
    this.platformGroup = new THREE.Group();
    this.currentItemMesh = null;
    this.isRotating = true;
  }

  buildPlatform() {
    // Rotating Podium Base
    const podiumGeo = new THREE.CylinderGeometry(3, 3.2, 0.5, 32);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x14192d,
      metalness: 0.8,
      roughness: 0.2
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.receiveShadow = true;
    podium.position.y = -1;

    // Glowing Gold Ring
    const ringGeo = new THREE.TorusGeometry(3.1, 0.08, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.74;

    this.platformGroup.add(podium);
    this.platformGroup.add(ring);
    this.threeManager.scene.add(this.platformGroup);
  }

  loadSampleMesh(type = 'dice') {
    if (this.currentItemMesh) {
      this.platformGroup.remove(this.currentItemMesh);
    }

    let geo;
    const mat = new THREE.MeshStandardMaterial({
      color: type === 'dice' ? 0x00f2fe : 0xffd700,
      metalness: 0.5,
      roughness: 0.3
    });

    if (type === 'dice') {
      geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    } else {
      geo = new THREE.CylinderGeometry(0.5, 0.8, 2, 16);
    }

    this.currentItemMesh = new THREE.Mesh(geo, mat);
    this.currentItemMesh.castShadow = true;
    this.currentItemMesh.position.y = 0.5;
    this.platformGroup.add(this.currentItemMesh);
  }

  update() {
    if (this.isRotating && this.platformGroup) {
      this.platformGroup.rotation.y += 0.01;
    }
  }
}
