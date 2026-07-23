/* ==========================================================================
   CRYSTAL PARCHEESI STAR - COMPLETE 3D BOARD & CAMERA SETUP
   ========================================================================== */

console.log('⚡ Starting Complete 3D Board Setup...');

let scene, camera, renderer;

function init3D() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // 1. Scene & Camera Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0e14); // خلفية سوداء كريستالية لمنع الأبيض

  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  
  // تعديل زاوية الكاميرا لترى الرقعة كاملة بحجم مثالي للموبايل
  camera.position.set(0, 22, 18);
  camera.lookAt(0, -1, 0);

  // 2. Renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffd700, 1.2);
  dirLight.position.set(10, 25, 10);
  scene.add(dirLight);

  // 4. Create Parcheesi Board Base
  const boardGroup = new THREE.Group();

  // Base Plate (الرقعة الخشبية/الداكنة الأساسية)
  const baseGeo = new THREE.BoxGeometry(16, 0.4, 16);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.3 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  boardGroup.add(baseMesh);

  // Four Corner Bases (المنازل الأربعة)
  const corners = [
    { x: -5, z: -5, color: 0xff4757 }, // أحمر
    { x: 5, z: -5, color: 0x2ed573 },  // أخضر
    { x: 5, z: 5, color: 0xffa502 },   // أصفر
    { x: -5, z: 5, color: 0x1e90ff }   // أزرق
  ];

  corners.forEach(c => {
    const geo = new THREE.BoxGeometry(5.5, 0.5, 5.5);
    const mat = new THREE.MeshStandardMaterial({ color: c.color, roughness: 0.2 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(c.x, 0.1, c.z);
    boardGroup.add(mesh);
  });

  // Cross Tracks Placeholder (المسار الأوسط)
  const trackGeo = new THREE.BoxGeometry(15, 0.45, 4.5);
  const trackMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const trackH = new THREE.Mesh(trackGeo, trackMat);
  const trackV = trackH.clone();
  trackV.rotation.y = Math.PI / 2;
  boardGroup.add(trackH);
  boardGroup.add(trackV);

  // Center Dice Box (منطقة النرد الوسطى)
  const centerGeo = new THREE.BoxGeometry(3.5, 0.6, 3.5);
  const centerMat = new THREE.MeshStandardMaterial({ color: 0x2f3542 });
  const centerMesh = new THREE.Mesh(centerGeo, centerMat);
  boardGroup.add(centerMesh);

  // Center Dice (النرد في المنتصف)
  const diceGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const diceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
  const diceMesh = new THREE.Mesh(diceGeo, diceMat);
  diceMesh.position.set(0, 1.1, 0);
  diceMesh.rotation.set(0.4, 0.5, 0.2);
  boardGroup.add(diceMesh);

  scene.add(boardGroup);

  // 5. Render Loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init3D();
} else {
  document.addEventListener('DOMContentLoaded', init3D);
}
