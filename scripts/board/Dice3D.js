/* ==========================================================================
   CRYSTAL PARCHEESI STAR - 3D DICE & ROLLING SIMULATION
   ========================================================================== */

export class Dice3D {
  constructor(scene) {
    this.scene = scene;
    this.mesh = this.createDiceMesh();
    this.isRolling = false;
    this.scene.add(this.mesh);
  }

  createDiceMesh() {
    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1
    });
    const diceMesh = new THREE.Mesh(geo, mat);
    diceMesh.castShadow = true;
    diceMesh.position.set(0, 1, 0);
    return diceMesh;
  }

  roll(finalValue) {
    return new Promise(resolve => {
      if (this.isRolling) return;
      this.isRolling = true;

      const duration = 1000;
      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          // Fast random rotation during roll
          this.mesh.rotation.x += 0.3;
          this.mesh.rotation.y += 0.4;
          this.mesh.rotation.z += 0.2;

          // Bounce effect
          this.mesh.position.y = 1 + Math.abs(Math.sin(progress * Math.PI * 4)) * 1.5;

          requestAnimationFrame(animate);
        } else {
          // Snap to final value orientation
          this.setRotationForValue(finalValue);
          this.mesh.position.y = 1;
          this.isRolling = false;
          resolve(finalValue);
        }
      };

      requestAnimationFrame(animate);
    });
  }

  setRotationForValue(value) {
    const rotations = {
      1: { x: 0, y: 0, z: 0 },
      2: { x: Math.PI / 2, y: 0, z: 0 },
      3: { x: 0, y: 0, z: -Math.PI / 2 },
      4: { x: 0, y: 0, z: Math.PI / 2 },
      5: { x: -Math.PI / 2, y: 0, z: 0 },
      6: { x: Math.PI, y: 0, z: 0 }
    };
    const rot = rotations[value] || rotations[1];
    this.mesh.rotation.set(rot.x, rot.y, rot.z);
  }
}
