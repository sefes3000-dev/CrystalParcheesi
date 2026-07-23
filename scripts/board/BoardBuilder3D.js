/* ==========================================================================
   CRYSTAL PARCHEESI STAR - 3D BOARD GENERATOR
   ========================================================================== */

import { PLAYER_COLORS, BOARD_CONFIG } from './BoardConfig.js';

export class BoardBuilder3D {
  constructor(scene) {
    this.scene = scene;
    this.boardGroup = new THREE.Group();
  }

  buildBoard() {
    // 1. Wooden Base Frame
    const baseGeo = new THREE.BoxGeometry(18, 0.8, 18);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1c100b,
      roughness: 0.4,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.4;
    baseMesh.receiveShadow = true;
    this.boardGroup.add(baseMesh);

    // 2. Crystal Surface
    const surfaceGeo = new THREE.BoxGeometry(17.2, 0.1, 17.2);
    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8
    });
    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
    surfaceMesh.position.y = 0.05;
    surfaceMesh.receiveShadow = true;
    this.boardGroup.add(surfaceMesh);

    // 3. Build Player Corners (Home Nests)
    this.buildHomeNests();

    // 4. Center Gold Castle / Home Goal
    this.buildCenterGoal();

    this.scene.add(this.boardGroup);
    console.log('🎲 3D Parchisi Board Generated Successfully.');
  }

  buildHomeNests() {
    const corners = [
      { x: -5.5, z: -5.5, color: PLAYER_COLORS.RED },
      { x: 5.5, z: -5.5, color: PLAYER_COLORS.GREEN },
      { x: 5.5, z: 5.5, color: PLAYER_COLORS.YELLOW },
      { x: -5.5, z: 5.5, color: PLAYER_COLORS.BLUE }
    ];

    corners.forEach(corner => {
      const nestGeo = new THREE.BoxGeometry(5.2, 0.2, 5.2);
      const nestMat = new THREE.MeshStandardMaterial({
        color: corner.color,
        roughness: 0.3,
        metalness: 0.3
      });
      const nestMesh = new THREE.Mesh(nestGeo, nestMat);
      nestMesh.position.set(corner.x, 0.15, corner.z);
      nestMesh.receiveShadow = true;
      this.boardGroup.add(nestMesh);
    });
  }

  buildCenterGoal() {
    const centerGeo = new THREE.CylinderGeometry(2, 2.2, 0.3, 4);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    centerMesh.position.set(0, 0.2, 0);
    centerMesh.rotation.y = Math.PI / 4;
    centerMesh.receiveShadow = true;
    this.boardGroup.add(centerMesh);
  }
}
