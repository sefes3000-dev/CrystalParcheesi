/* ==========================================================================
   CRYSTAL PARCHEESI STAR - THREE.JS ENGINE MANAGER
   ========================================================================== */

export class ThreeManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.isRendering = false;
  }

  init() {
    // 1. Scene Setup
    this.scene = new THREE.Scene();

    // 2. Camera Setup
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.set(0, 15, 20);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer Setup (Mobile Optimized)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lighting Setup
    this.setupLighting();

    // 5. Handle Resize
    window.addEventListener('resize', () => this.onWindowResize());

    console.log('💎 Three.js WebGL Engine Initialized Successfully.');
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffd700, 1.2); // Golden Directional Light
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 1, 30); // Crystal Blue Accent Light
    pointLight.position.set(-10, 10, -10);
    this.scene.add(pointLight);
  }

  startRenderLoop(updateCallback) {
    this.isRendering = true;
    const animate = () => {
      if (!this.isRendering) return;
      requestAnimationFrame(animate);
      if (updateCallback) updateCallback();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  stopRenderLoop() {
    this.isRendering = false;
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
