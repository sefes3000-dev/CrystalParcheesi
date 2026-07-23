/* ==========================================================================
   CRYSTAL PARCHEESI STAR - MASTER BOOTSTRAP SCRIPT (DEBUGGED FLOW)
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

window.addEventListener('error', (e) => {
  console.error('⚠️ Global Error Boundary:', e.message, 'at', e.filename, 'line:', e.lineno);
});

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Crystal Parcheesi STAR Sequence...');

  // 1. Systems Initialization
  const profileManager = new ProfileManager();
  const inventoryManager = new InventoryManager(profileManager);
  const shopManager = new ShopManager(profileManager, inventoryManager);
  const turnManager = new TurnManager();
  const gameSession = new GameSession(GAME_MODES.OFFLINE_BOTS);
  const audioManager = new AudioManager();

  // 2. 3D Engine Initialization
  const canvas3D = document.getElementById('webgl-canvas');
  let threeManager = null;
  let boardBuilder = null;
  let dice3D = null;
  const pawns = [];

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

      console.log('✅ 3D Board, Pawns & Physics Engine ready.');
    } catch (err) {
      console.error('❌ Failed to construct Three.js Scene:', err);
    }
  }

  // UI Screen References
  const splashScreen = document.getElementById('splash-screen');
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const gameScreen = document.getElementById('game-screen');
  const topBar = document.getElementById('top-bar');
  const loadingBar = document.getElementById('loading-bar');
  const loadingStatus = document.getElementById('loading-status');

  // Step Switch Helper
  function transitionScreen(fromScreen, toScreen, displayType = 'flex') {
    if (fromScreen) {
      fromScreen.classList.remove('active');
      setTimeout(() => {
        fromScreen.style.display = 'none';
      }, 300);
    }

    if (toScreen) {
      toScreen.style.display = displayType;
      setTimeout(() => {
        toScreen.classList.add('active');
      }, 50);
    }
  }

  // STEP 1: Splash Screen Click
  if (splashScreen) {
    splashScreen.addEventListener('click', () => {
      audioManager.playClick();
      transitionScreen(splashScreen, loadingScreen);
      runLoadingSequence();
    });
  }

  // STEP 2: Loading Sequence -> Main Menu
  async function runLoadingSequence() {
    if (loadingBar) loadingBar.style.width = '35%';
    if (loadingStatus) loadingStatus.innerText = 'Loading Profile Data...';
    
    await profileManager.init();
    inventoryManager.init();

    if (loadingBar) loadingBar.style.width = '70%';
    if (loadingStatus) loadingStatus.innerText = 'Preparing 3D Assets & AI...';
    await shopManager.loadShopData();

    if (loadingBar) loadingBar.style.width = '100%';
    if (loadingStatus) loadingStatus.innerText = 'Complete!';

    setTimeout(() => {
      transitionScreen(loadingScreen, homeScreen);
      if (topBar) topBar.style.display = 'flex';

      if (threeManager) {
        threeManager.startRenderLoop();
      }

      bindPlayNowButton();
    }, 400);
  }

  // STEP 3: Main Menu -> STEP 4: 3D Game Board
  function bindPlayNowButton() {
    const playBtn = document.getElementById('btn-play-now') || document.querySelector('.play-btn');

    if (playBtn) {
      playBtn.onclick = (e) => {
        e.preventDefault();
        console.log('🎮 PLAY NOW Clicked -> Launching 3D Board Viewport!');
        audioManager.playClick();

        // Hide Main Menu
        transitionScreen(homeScreen, gameScreen, 'block');

        // Force WebGL Canvas view update
        if (threeManager) {
          threeManager.onWindowResize();
        }

        // Start session logic & listeners
        gameSession.startSession();
        enableBoardInteraction();
      };
    }
  }

  let isExecuting = false;

  function enableBoardInteraction() {
    if (!canvas3D || !dice3D) return;

    window.onclick = async (e) => {
      // Ignore clicks on HUD overlay elements
      if (e.target.closest('#top-bar') || e.target.closest('.game-hud')) return;

      if (isExecuting || dice3D.isRolling) return;

      const currentPlayer = turnManager.getCurrentPlayer();

      if (!gameSession.isBotTurn(currentPlayer)) {
        isExecuting = true;
        await executeTurnCycle(currentPlayer);
        isExecuting = false;
      }
    };
  }

  async function executeTurnCycle(playerColor) {
    try {
      audioManager.playDiceRoll();

      const rollVal = Math.floor(Math.random() * 6) + 1;
      console.log(`🎲 ${playerColor} Rolled: ${rollVal}`);

      const rollResult = await dice3D.roll(rollVal);
      const turnResult = turnManager.processRoll(rollResult);

      let nextPlayer = playerColor;
      if (turnResult.action === 'MOVE_NORMAL' || turnResult.action === 'FORFEIT') {
        nextPlayer = turnManager.nextTurn();
      }

      if (gameSession.isBotTurn(nextPlayer)) {
        await executeBotCycle(nextPlayer);
      }
    } catch (err) {
      console.error('❌ Turn Execution Exception:', err);
    }
  }

  async function executeBotCycle(botColor) {
    const botAI = gameSession.getBotInstance(botColor);
    if (!botAI) return;

    console.log(`🤖 Bot (${botColor}) thinking...`);
    await botAI.simulateThinkingTime(800, 1400);

    await executeTurnCycle(botColor);
  }
});
