/* ==========================================================================
   CRYSTAL PARCHEESI STAR - DIRECT EMERGENCY BOOTSTRAP
   ========================================================================== */

console.log('⚡ Direct Script Executing Successfully!');

function showScreen(screenId) {
  var screens = ['splash-screen', 'loading-screen', 'home-screen', 'game-screen'];
  screens.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.style.display = (id === screenId) ? 'flex' : 'none';
    }
  });
}

var scene, camera, renderer;

function init3D() {
  var canvas = document.getElementById('webgl-canvas');
  if (!canvas) {
    console.error('❌ Canvas #webgl-canvas missing!');
    return;
  }
  if (typeof THREE === 'undefined') {
    console.error('❌ THREE library not loaded!');
    return;
  }

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    var dirLight = new THREE.DirectionalLight(0xffd700, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Board Placeholder
    var geometry = new THREE.BoxGeometry(10, 0.5, 10);
    var material = new THREE.MeshStandardMaterial({ color: 0x00b894 });
    var boardMesh = new THREE.Mesh(geometry, material);
    scene.add(boardMesh);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    console.log('💎 3D Context Initialized Successfully!');
  } catch (err) {
    console.error('❌ Error inside 3D setup:', err);
  }
}

// Bind events directly
function setupInteractions() {
  console.log('🚀 Setting up click interactions...');
  init3D();

  var splash = document.getElementById('splash-screen');
  if (splash) {
    splash.onclick = function() {
      console.log('👉 Splash Clicked!');
      showScreen('loading-screen');

      setTimeout(function() {
        showScreen('home-screen');
        var topBar = document.getElementById('top-bar');
        if (topBar) topBar.style.display = 'flex';
      }, 400);
    };
  }

  var playBtn = document.getElementById('btn-play-now');
  if (playBtn) {
    playBtn.onclick = function(e) {
      if (e) e.stopPropagation();
      console.log('🎮 PLAY NOW Clicked!');
      
      showScreen('game-screen');

      if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setupInteractions();
} else {
  document.addEventListener('DOMContentLoaded', setupInteractions);
}
