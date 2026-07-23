/* ==========================================================================
   CRYSTAL PARCHEESI STAR - DIRECT TOUCH-READY BOOTSTRAP
   ========================================================================== */

console.log('⚡ Direct Touch Bootstrap Executing...');

// Attach event support for both Click & Touch on mobile
function bindTouchAction(elementId, callback) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const handler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`👉 Event triggered on #${elementId}`);
    callback(e);
  };

  el.addEventListener('click', handler, { passive: false });
  el.addEventListener('touchstart', handler, { passive: false });
}

function switchScreen(hideId, showId, displayMode = 'flex') {
  const hideEl = document.getElementById(hideId);
  const showEl = document.getElementById(showId);

  if (hideEl) hideEl.style.display = 'none';
  if (showEl) showEl.style.display = displayMode;
}

async function startApp() {
  console.log('🚀 DOM Ready, initializing Three.js...');

  let threeManager = null;

  try {
    const { ThreeManager } = await import('./scripts/three/ThreeManager.js');
    const { BoardBuilder3D } = await import('./scripts/board/BoardBuilder3D.js');
    const { Dice3D } = await import('./scripts/board/Dice3D.js');
    const { Pawn3D } = await import('./scripts/board/Pawn3D.js');
    const { PLAYER_COLORS } = await import('./scripts/board/BoardConfig.js');

    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
      threeManager = new ThreeManager(canvas);
      threeManager.init();

      const builder = new BoardBuilder3D(threeManager.scene);
      builder.buildBoard();

      new Dice3D(threeManager.scene);

      const pawns = [
        { id: 'r1', color: PLAYER_COLORS.RED, pos: { x: -5.5, y: 0.3, z: -5.5 } },
        { id: 'g1', color: PLAYER_COLORS.GREEN, pos: { x: 5.5, y: 0.3, z: -5.5 } },
        { id: 'y1', color: PLAYER_COLORS.YELLOW, pos: { x: 5.5, y: 0.3, z: 5.5 } },
        { id: 'b1', color: PLAYER_COLORS.BLUE, pos: { x: -5.5, y: 0.3, z: 5.5 } }
      ];

      pawns.forEach(p => {
        const pawn = new Pawn3D(p.id, p.color, p.pos);
        threeManager.scene.add(pawn.mesh);
      });

      threeManager.startRenderLoop();
      console.log('💎 3D Scene setup finished successfully.');
    }
  } catch (err) {
    console.error('⚠️ 3D Setup Exception:', err);
  }

  // 1. Splash Screen Action
  bindTouchAction('splash-screen', () => {
    switchScreen('splash-screen', 'loading-screen');

    // Fast loading simulation without blocking promises
    const bar = document.getElementById('loading-bar');
    if (bar) bar.style.width = '100%';

    setTimeout(() => {
      switchScreen('loading-screen', 'home-screen');
      const topBar = document.getElementById('top-bar');
      if (topBar) topBar.style.display = 'flex';
    }, 400);
  });

  // 2. Play Now Button Action
  bindTouchAction('btn-play-now', () => {
    console.log('🎮 PLAY NOW pressed! Opening 3D Board...');
    switchScreen('home-screen', 'game-screen', 'block');

    if (threeManager) {
      threeManager.onWindowResize();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
