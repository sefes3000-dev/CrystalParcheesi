/* ==========================================================================
   CRYSTAL PARCHEESI STAR - FIXED NAVIGATION & 3D SYSTEM
   ========================================================================== */

import { ThreeManager } from './scripts/three/ThreeManager.js';
import { BoardBuilder3D } from './scripts/board/BoardBuilder3D.js';
import { Pawn3D } from './scripts/board/Pawn3D.js';
import { Dice3D } from './scripts/board/Dice3D.js';
import { PLAYER_COLORS } from './scripts/board/BoardConfig.js';

function switchScreen(activeId) {
  const screens = ['splash-screen', 'loading-screen', 'home-screen', 'game-screen'];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = (id === activeId) ? 'flex' : 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App Loaded successfully.');

  let threeManager = null;

  // Initialize 3D Engine in background
  const canvas = document.getElementById('webgl-canvas');
  if (canvas) {
    try {
      threeManager = new ThreeManager(canvas);
      threeManager.init();

      const boardBuilder = new BoardBuilder3D(threeManager.scene);
      boardBuilder.buildBoard();

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
    } catch (e) {
      console.error('❌ Failed to load 3D world:', e);
    }
  }

  // 1. Splash Screen Action
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.onclick = () => {
      switchScreen('loading-screen');
      setTimeout(() => {
        switchScreen('home-screen');
        const topBar = document.getElementById('top-bar');
        if (topBar) topBar.style.display = 'flex';
      }, 500);
    };
  }

  // 2. Play Now Button Action
  const playBtn = document.getElementById('btn-play-now');
  if (playBtn) {
    playBtn.onclick = (e) => {
      e.stopPropagation();
      switchScreen('game-screen');

      if (threeManager) {
        threeManager.onWindowResize();
      }
    };
  }
});
