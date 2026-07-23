/* ==========================================================================
   CRYSTAL PARCHEESI STAR - MASTER BOOTSTRAP SCRIPT (SAFE DIAGNOSTICS)
   ========================================================================== */

console.log('⚡ master.js: Starting script execution...');

window.addEventListener('error', (e) => {
  console.error('❌ GLOBAL RUNTIME ERROR:', e.message, 'in', e.filename, 'Line:', e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ UNHANDLED PROMISE REJECTION:', e.reason);
});

async function bootEngine() {
  try {
    const { ProfileManager } = await import('./scripts/profile/ProfileManager.js');
    const { InventoryManager } = await import('./scripts/inventory/InventoryManager.js');
    const { ShopManager } = await import('./scripts/shop/ShopManager.js');
    const { ThreeManager } = await import('./scripts/three/ThreeManager.js');
    const { BoardBuilder3D } = await import('./scripts/board/BoardBuilder3D.js');
    const { Pawn3D } = await import('./scripts/board/Pawn3D.js');
    const { Dice3D } = await import('./scripts/board/Dice3D.js');
    const { PLAYER_COLORS } = await import('./scripts/board/BoardConfig.js');
    const { TurnManager } = await import('./scripts/game/TurnManager.js');
    const { GameSession, GAME_MODES } = await import('./scripts/game/GameSession.js');
    const { AudioManager } = await import('./scripts/audio/AudioManager.js');

    console.log('✅ All JS Modules imported successfully!');

    const profileManager = new ProfileManager();
    const inventoryManager = new InventoryManager(profileManager);
    const shopManager = new ShopManager(profileManager, inventoryManager);
    const turnManager = new TurnManager();
    const gameSession = new GameSession(GAME_MODES.OFFLINE_BOTS);
    const audioManager = new AudioManager();

    const canvas3D = document.getElementById('webgl-canvas');
    let threeManager = null;

    if (canvas3D) {
      threeManager = new ThreeManager(canvas3D);
      threeManager.init();

      const boardBuilder = new BoardBuilder3D(threeManager.scene);
      boardBuilder.buildBoard();

      const dice3D = new Dice3D(threeManager.scene);

      const pawnPositions = [
        { id: 'red_1', color: PLAYER_COLORS.RED, pos: { x: -5.5, y: 0.3, z: -5.5 } },
        { id: 'green_1', color: PLAYER_COLORS.GREEN, pos: { x: 5.5, y: 0.3, z: -5.5 } },
        { id: 'yellow_1', color: PLAYER_COLORS.YELLOW, pos: { x: 5.5, y: 0.3, z: 5.5 } },
        { id: 'blue_1', color: PLAYER_COLORS.BLUE, pos: { x: -5.5, y: 0.3, z: 5.5 } }
      ];

      pawnPositions.forEach(p => {
        const pawn = new Pawn3D(p.id, p.color, p.pos);
        threeManager.scene.add(pawn.mesh);
      });

      console.log('💎 3D World successfully loaded.');
    }

    const splashScreen = document.getElementById('splash-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    const topBar = document.getElementById('top-bar');

    function transitionScreen(from, to, display = 'flex') {
      if (from) {
        from.classList.remove('active');
        from.style.display = 'none';
      }
      if (to) {
        to.style.display = display;
        setTimeout(() => to.classList.add('active'), 50);
      }
    }

    if (splashScreen) {
      splashScreen.onclick = async () => {
        audioManager.playClick();
        transitionScreen(splashScreen, loadingScreen);

        await profileManager.init();
        inventoryManager.init();
        await shopManager.loadShopData();

        setTimeout(() => {
          transitionScreen(loadingScreen, homeScreen);
          if (topBar) topBar.style.display = 'flex';
          if (threeManager) threeManager.startRenderLoop();
        }, 500);
      };
    }

    const playBtn = document.getElementById('btn-play-now');
    if (playBtn) {
      playBtn.onclick = (e) => {
        e.preventDefault();
        console.log('🎮 PLAY NOW clicked!');
        audioManager.playClick();

        transitionScreen(homeScreen, gameScreen, 'block');

        if (threeManager) {
          threeManager.onWindowResize();
        }

        gameSession.startSession();
      };
    }

  } catch (err) {
    console.error('❌ CRITICAL ENGINE BOOT ERROR:', err);
  }
}

document.addEventListener('DOMContentLoaded', bootEngine);
