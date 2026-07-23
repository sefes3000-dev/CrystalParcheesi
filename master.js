/* ==========================================================================
   CRYSTAL PARCHEESI STAR - MASTER BOOTSTRAP SCRIPT (STRICT DEBUG FIX)
   ========================================================================== */

import { ProfileManager } from './scripts/profile/ProfileManager.js';
import { InventoryManager } from './scripts/inventory/InventoryManager.js';
import { ShopManager } from './scripts/shop/ShopManager.js';
import { ThreeManager } from './scripts/three/ThreeManager.js';
import { BoardBuilder3D } from './scripts/board/BoardBuilder3D.js';
import { Pawn3D } from './scripts/board/Pawn3D.js';
import { Dice3D } from './scripts/board/Dice3D.js';
import { PLAYER_COLORS } from './scripts/board/BoardConfig.js';
import { TurnManager } from './scripts/game/TurnManager.js';
import { GameSession, GAME_MODES } from './scripts/game/GameSession.js';
import { AudioManager } from './scripts/audio/AudioManager.js';

// Global Error Boundary
window.addEventListener('error', (e) => {
  console.error('⚠️ Runtime Error Captured:', e.message, 'at', e.filename, 'line:', e.lineno);
});

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Engine & Debugging Navigation Flow...');

  const profileManager = new ProfileManager();
  const inventoryManager = new InventoryManager(profileManager);
  const shopManager = new ShopManager(profileManager, inventoryManager);
  const turnManager = new TurnManager();
  const gameSession = new GameSession(GAME_MODES.OFFLINE_BOTS);
  const audioManager = new AudioManager();

  const canvas3D = document.getElementById('webgl-canvas');
  let threeManager = null;
  let boardBuilder = null;
  let dice3D = null;
  const pawns = [];

  // Initialize Three.js WebGL Engine safely
  if (canvas3D) {
    try {
      threeManager = new ThreeManager(canvas3D);
      threeManager.init();

      boardBuilder = new BoardBuilder3D(threeManager.scene);
      boardBuilder.buildBoard();

      dice3D = new Dice3D(threeManager.scene);

      const pawnPositions = [
        { id: 'red_1', color: PLAYER_COLORS.RED, pos: { x: -5.5, y: 0.3, z: -5.5 } },
        { id: 'green_1', color: PLAYER_COLORS.GREEN, pos: { x: 5.5, y: 0.3, z: -5.5 } },
        { id: 'yellow_1', color: PLAYER_COLORS.YELLOW, pos: { x: 5.5, y: 0.3, z: 5.5 } },
        { id: 'blue_1', color: PLAYER_COLORS.BLUE, pos: { x: -5.5, y: 0.3, z: 5.5 } }
      ];

      pawnPositions.forEach(p => {
        const pawn = new Pawn3D(p.id, p.color, p.pos);
        threeManager.scene.add(pawn.mesh);
        pawns.push(pawn);
      });

      console.log('✅ Three.js Scene, Board & Pawns initialized successfully.');
    } catch (err) {
      console.error('❌ Three.js Initialization Error:', err);
    }
  }

  // UI Components
  const splashScreen = document.getElementById('splash-screen');
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const gameScreen = document.getElementById('game-screen');
  const topBar = document.getElementById('top-bar');
  const loadingBar = document.getElementById('loading-bar');
  const loadingStatus = document.getElementById('loading-status');

  // Splash Screen Click Listener
  if (splashScreen) {
    splashScreen.addEventListener('click', () => {
      audioManager.playClick();
      switchScreen(splashScreen, loadingScreen);
      startLoadingSequence();
    });
  }

  function switchScreen(fromScreen, toScreen) {
    if (fromScreen) {
      fromScreen.classList.remove('active');
      fromScreen.style.display = 'none';
    }
    if (toScreen) {
      toScreen.style.display = 'flex';
      setTimeout(() => {
        toScreen.classList.add('active');
      }, 50);
    }
  }

  async function startLoadingSequence() {
    if (loadingBar) loadingBar.style.width = '30%';
    if (loadingStatus) loadingStatus.innerText = 'Loading Profile & Local Data...';
    
    const profile = await profileManager.init();
    inventoryManager.init();

    if (loadingBar) loadingBar.style.width = '70%';
    if (loadingStatus) loadingStatus.innerText = 'Optimizing Engine & Bot Logic...';
    await shopManager.loadShopData();

    if (loadingBar) loadingBar.style.width = '100%';
    if (loadingStatus) loadingStatus.innerText = 'Welcome!';

    setTimeout(() => {
      switchScreen(loadingScreen, homeScreen);
      if (topBar) topBar.style.display = 'flex';

      if (threeManager) {
        threeManager.startRenderLoop();
      }

      bindPlayButtonEvents();
    }, 300);
  }

  /**
   * Robust Play Button Binding & Navigation Controller
   */
  function bindPlayButtonEvents() {
    const playTargets = document.querySelectorAll('#btn-play-now, .play-btn, .mode-card, [data-action="play"]');
    
    if (playTargets.length === 0) {
      console.warn('⚠️ No play buttons found by ID. Attaching fallback launcher to home screen.');
    }

    const launchGameHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🎯 PLAY NOW triggered. Transitioning from Main Menu to Game Board...');
      audioManager.playClick();

      // 1. Hide Home Screen
      if (homeScreen) {
        homeScreen.classList.remove('active');
        homeScreen.style.display = 'none';
      }

      // 2. Display Game HUD Screen
      if (gameScreen) {
        gameScreen.style.display = 'block';
        gameScreen.classList.add('active');
      }

      // 3. Make WebGL Canvas visible and force resize
      if (canvas3D) {
        canvas3D.style.display = 'block';
        canvas3D.style.visibility = 'visible';
        canvas3D.style.zIndex = '10';
        if (threeManager) {
          threeManager.onWindowResize();
        }
      }

      // 4. Start Game Session (Fixed Method)
      gameSession.startSession();

      // 5. Attach board interaction events
      attachBoardInteractions();
    };

    playTargets.forEach(target => {
      target.addEventListener('click', launchGameHandler);
    });
  }

  let isProcessingTurn = false;

  function attachBoardInteractions() {
    if (!canvas3D || !dice3D) return;

    canvas3D.onclick = async () => {
      if (isProcessingTurn || dice3D.isRolling) return;

      const currentPlayer = turnManager.getCurrentPlayer();

      if (!gameSession.isBotTurn(currentPlayer)) {
        isProcessingTurn = true;
        await executeTurn(currentPlayer);
        isProcessingTurn = false;
      }
    };
  }

  async function executeTurn(playerColor) {
    try {
      audioManager.playDiceRoll();

      const randomRoll = Math.floor(Math.random() * 6) + 1;
      console.log(`🎲 ${playerColor} rolling... Result: ${randomRoll}`);

      const rollResult = await dice3D.roll(randomRoll);
      const turnResult = turnManager.processRoll(rollResult);

      let nextPlayer = playerColor;
      if (turnResult.action === 'MOVE_NORMAL' || turnResult.action === 'FORFEIT') {
        nextPlayer = turnManager.nextTurn();
      }

      if (gameSession.isBotTurn(nextPlayer)) {
        await triggerBotTurn(nextPlayer);
      }
    } catch (err) {
      console.error('❌ Error during turn execution:', err);
    }
  }

  async function triggerBotTurn(botColor) {
    const botAI = gameSession.getBotInstance(botColor);
    if (!botAI) return;

    console.log(`🤖 Bot (${botColor}) thinking...`);
    await botAI.simulateThinkingTime(800, 1500);

    await executeTurn(botColor);
  }
});
