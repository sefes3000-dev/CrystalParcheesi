/* ==========================================================================
   CRYSTAL PARCHEESI STAR - 3D PAWN & ANIMATION CONTROLLER
   ========================================================================== */

export class Pawn3D {
  constructor(id, color, initialPosition) {
    this.id = id;
    this.color = color;
    this.currentTileIndex = -1; // -1 means inside Home Nest
    this.mesh = this.createPawnMesh(color);
    this.setPosition(initialPosition.x, initialPosition.y, initialPosition.z);
  }

  createPawnMesh(color) {
    const group = new THREE.Group();

    // Base
    const baseGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.2, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.5, roughness: 0.2 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.1;
    baseMesh.castShadow = true;
    group.add(baseMesh);

    // Body
    const bodyGeo = new THREE.ConeGeometry(0.35, 0.9, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, baseMat);
    bodyMesh.position.y = 0.65;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Head Sphere
    const headGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 1.2;
    headMesh.castShadow = true;
    group.add(headMesh);

    return group;
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Jump animation to target coordinates
   */
  animateJumpTo(targetPos, duration = 300) {
    return new Promise(resolve => {
      const startPos = { ...this.mesh.position };
      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Parabolic arc for smooth jump
        const jumpHeight = Math.sin(progress * Math.PI) * 1.2;

        this.mesh.position.x = startPos.x + (targetPos.x - startPos.x) * progress;
        this.mesh.position.y = startPos.y + (targetPos.y - startPos.y) * progress + jumpHeight;
        this.mesh.position.z = startPos.z + (targetPos.z - startPos.z) * progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.mesh.position.set(targetPos.x, targetPos.y, targetPos.z);
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }
}
