/* ==========================================================================
   CRYSTAL PARCHEESI STAR - MASTER BOOTSTRAP SCRIPT (PRODUCTION RELEASE)
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

// Global Error Handler
window.addEventListener('error', (e) => {
  console.error('⚠️ Unhandled Exception:', e.message);
});

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Crystal Parcheesi STAR Engine Initializing (Production Mode)...');

  // 1. Initialize System Managers & Audio Engine
  const profileManager = new ProfileManager();
  const inventoryManager = new InventoryManager(profileManager);
  const shopManager = new ShopManager(profileManager, inventoryManager);
  const turnManager = new TurnManager();
  const gameSession = new GameSession(GAME_MODES.OFFLINE_BOTS);
  const audioManager = new AudioManager();

  // 2. Initialize 3D Graphics Engine & Board
  const canvas3D = document.getElementById('webgl-canvas');
  let threeManager = null;
  let boardBuilder = null;
  let dice3D = null;
  const pawns = [];

  if (canvas3D) {
    threeManager = new ThreeManager(canvas3D);
    threeManager.init();

    // Build 3D Board
    boardBuilder = new BoardBuilder3D(threeManager.scene);
    boardBuilder.buildBoard();

    // Create 3D Dice
    dice3D = new Dice3D(threeManager.scene);

    // Create Sample Pawns in Nests
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
  }

  // UI Elements
  const splashScreen = document.getElementById('splash-screen');
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const topBar = document.getElementById('top-bar');
  const loadingBar = document.getElementById('loading-bar');
  const loadingStatus = document.getElementById('loading-status');

  // Resource Displays
  const coinCountDisplay = document.getElementById('coin-count');
  const gemCountDisplay = document.getElementById('gem-count');
  const playerNameDisplay = document.getElementById('player-name');

  // Transition from Splash to Loading
  splashScreen.addEventListener('click', () => {
    audioManager.playClick();
    switchScreen(splashScreen, loadingScreen);
    startLoadingSequence();
  });

  function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    setTimeout(() => {
      toScreen.classList.add('active');
    }, 200);
  }

  function updateTopBarUI(profile) {
    if (!profile) return;
    if (coinCountDisplay) coinCountDisplay.innerText = profile.coins.toLocaleString();
    if (gemCountDisplay) gemCountDisplay.innerText = profile.gems.toLocaleString();
    if (playerNameDisplay) playerNameDisplay.innerText = profile.username || 'Player';
  }

  async function startLoadingSequence() {
    // Step 1: Load Profile & Inventory
    loadingBar.style.width = '30%';
    loadingStatus.innerText = 'Loading Profile & Local Data...';
    const profile = await profileManager.init();
    inventoryManager.init();

    // Step 2: Load Shop & Audio Engine
    setTimeout(async () => {
      loadingBar.style.width = '70%';
      loadingStatus.innerText = 'Optimizing Engine & Bot Logic...';
      await shopManager.loadShopData();

      // Step 3: Complete & Start 3D Render Loop
      setTimeout(() => {
        loadingBar.style.width = '100%';
        loadingStatus.innerText = 'Welcome!';

        setTimeout(() => {
          updateTopBarUI(profile);
          switchScreen(loadingScreen, homeScreen);
          topBar.style.display = 'flex';

          if (threeManager) {
            threeManager.startRenderLoop();
          }

          // Enable Interactive Gameplay & Turn Loop
          setupGameplayInteractions();

          console.log('🏆 Crystal Parcheesi STAR v1.0.0 Fully Operational!');
        }, 400);
      }, 400);
    }, 400);
  }

  function setupGameplayInteractions() {
    if (!canvas3D || !dice3D) return;

    canvas3D.addEventListener('click', async () => {
      const currentPlayer = turnManager.getCurrentPlayer();

      // Player turn
      if (!gameSession.isBotTurn(currentPlayer) && !dice3D.isRolling) {
        await handleTurnExecution(currentPlayer);
      }
    });
  }

  async function handleTurnExecution(playerColor) {
    if (dice3D.isRolling) return;

    audioManager.playDiceRoll();

    const randomRoll = Math.floor(Math.random() * 6) + 1;
    console.log(`🎲 ${playerColor} is rolling...`);

    const rollResult = await dice3D.roll(randomRoll);
    const turnResult = turnManager.processRoll(rollResult);

    console.log(`🎯 Rolled: ${rollResult} | Result: ${turnResult.action}`);

    let nextPlayer = playerColor;
    if (turnResult.action === 'MOVE_NORMAL' || turnResult.action === 'FORFEIT') {
      nextPlayer = turnManager.nextTurn();
    } else if (turnResult.action === 'MOVE_AND_BONUS') {
      console.log(`🎉 Bonus Turn for ${playerColor}!`);
    }

    // Trigger Bot turn automatically if next player is a Bot
    if (gameSession.isBotTurn(nextPlayer)) {
      triggerBotTurn(nextPlayer);
    }
  }

  async function triggerBotTurn(botColor) {
    const botAI = gameSession.getBotInstance(botColor);
    if (!botAI) return;

    console.log(`🤖 Bot (${botColor}) is thinking...`);
    await botAI.simulateThinkingTime(1000, 2000);

    await handleTurnExecution(botColor);
  }
});
