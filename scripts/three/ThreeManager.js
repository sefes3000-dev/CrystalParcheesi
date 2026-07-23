/* ==========================================================================
   CRYSTAL PARCHEESI STAR - THREE.JS ENGINE MANAGER (SAFE RENDER LOOP FIX)
   ========================================================================== */

export class ThreeManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.isRendering = false;
    this.animationFrameId = null;
  }

  init() {
    if (!this.canvas) {
      console.error('❌ ThreeManager: Canvas element is missing or null!');
      return;
    }

    // 1. Scene Setup
    this.scene = new THREE.Scene();

    // 2. Camera Setup
    const width = window.innerWidth || 300;
    const height = window.innerHeight || 300;
    const fov = 45;
    const aspect = width / height;

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
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Lighting Setup
    this.setupLighting();

    // 5. Initial Render Force (Render initial frame before animation loop starts)
    this.renderFrame();

    // 6. Handle Resize
    window.addEventListener('resize', () => this.onWindowResize());

    console.log('💎 Three.js WebGL Engine Initialized Successfully.');
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
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

  renderFrame() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  startRenderLoop(updateCallback = null) {
    if (this.isRendering) return; // Prevent duplicate requestAnimationFrame loops
    
    this.isRendering = true;

    const animate = () => {
      if (!this.isRendering) return;

      if (typeof updateCallback === 'function') {
        try {
          updateCallback();
        } catch (err) {
          console.error('⚠️ Error in render updateCallback:', err);
        }
      }

      this.renderFrame();
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  stopRenderLoop() {
    this.isRendering = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderFrame(); // Instantly update view frame on resize
  }
}
