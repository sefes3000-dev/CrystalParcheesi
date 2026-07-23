/* ==========================================================================
   CRYSTAL PARCHEESI STAR - MASTER BOOTSTRAP SCRIPT (CRITICAL BUG FIX)
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

// Catch and display global errors to prevent silent freezes
window.addEventListener('error', (e) => {
  console.error('⚠️ Global Exception Caught:', e.message, 'at', e.filename, 'line:', e.lineno);
});

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Crystal Parcheesi STAR Engine Initializing (Debug Mode)...');

  // 1. Initialize System Managers
  const profileManager = new ProfileManager();
  const inventoryManager = new InventoryManager(profileManager);
  const shopManager = new ShopManager(profileManager, inventoryManager);
  const turnManager = new TurnManager();
  const gameSession = new GameSession(GAME_MODES.OFFLINE_BOTS);
  const audioManager = new AudioManager();

  // 2. Initialize 3D Graphics Engine
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

      console.log('✅ Three.js WebGL Scene & Pawns successfully built.');
    } catch (err) {
      console.error('❌ Failed to initialize 3D Scene:', err);
    }
  }

  // UI Elements Reference
  const splashScreen = document.getElementById('splash-screen');
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const gameScreen = document.getElementById('game-screen');
  const topBar = document.getElementById('top-bar');
  const loadingBar = document.getElementById('loading-bar');
  const loadingStatus = document.getElementById('loading-status');

  // Resource Displays
  const coinCountDisplay = document.getElementById('coin-count');
  const gemCountDisplay = document.getElementById('gem-count');
  const playerNameDisplay = document.getElementById('player-name');

  // Splash Screen Trigger
  if (splashScreen) {
    splashScreen.addEventListener('click', () => {
      audioManager.playClick();
      hideScreen(splashScreen);
      showScreen(loadingScreen);
      startLoadingSequence();
    });
  }

  function hideScreen(screen) {
    if (!screen) return;
    screen.classList.remove('active');
    screen.style.display = 'none';
  }

  function showScreen(screen, displayType = 'flex') {
    if (!screen) return;
    screen.style.display = displayType;
    setTimeout(() => {
      screen.classList.add('active');
    }, 50);
  }

  function updateTopBarUI(profile) {
    if (!profile) return;
    if (coinCountDisplay) coinCountDisplay.innerText = profile.coins.toLocaleString();
    if (gemCountDisplay) gemCountDisplay.innerText = profile.gems.toLocaleString();
    if (playerNameDisplay) playerNameDisplay.innerText = profile.username || 'Player';
  }

  async function startLoadingSequence() {
    if (loadingBar) loadingBar.style.width = '30%';
    if (loadingStatus) loadingStatus.innerText = 'Loading Profile & Assets...';
    
    const profile = await profileManager.init();
    inventoryManager.init();

    if (loadingBar) loadingBar.style.width = '70%';
    if (loadingStatus) loadingStatus.innerText = 'Initializing AI & Game Systems...';
    await shopManager.loadShopData();

    if (loadingBar) loadingBar.style.width = '100%';
    if (loadingStatus) loadingStatus.innerText = 'Ready!';

    setTimeout(() => {
      hideScreen(loadingScreen);
      showScreen(homeScreen);
      if (topBar) topBar.style.display = 'flex';

      if (threeManager) {
        threeManager.startRenderLoop();
      }

      // Bind all Play buttons on the Main Menu
      setupPlayNowNavigation();
    }, 300);
  }

  /**
   * Universal Navigation Handler for "PLAY NOW"
   */
  function setupPlayNowNavigation() {
    // Queries all possible selectors for Play buttons in Main Menu
    const playButtons = document.querySelectorAll('#btn-play-now, .play-btn, .btn-play, .mode-card, [data-action="play"]');

    const handlePlayAction = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      console.log('🎮 PLAY NOW Triggered! Transitioning to 3D Game Board...');
      audioManager.playClick();

      // 1. Hide Home Screen
      hideScreen(homeScreen);

      // 2. Display Game HUD Screen
      showScreen(gameScreen, 'block');

      // 3. Ensure WebGL Canvas is forced visible and active
      if (canvas3D) {
        canvas3D.style.display = 'block';
        canvas3D.style.visibility = 'visible';
        canvas3D.style.zIndex = '10';
        if (threeManager) {
          threeManager.onWindowResize();
        }
      }

      // 4. Start Game Session
      gameSession.startSession();

      // 5. Attach interaction listener for rolling dice & moving
      setupGameplayInteractions();
    };

    if (playButtons.length > 0) {
      playButtons.forEach(btn => {
        btn.addEventListener('click', handlePlayAction);
      });
    } else {
      console.warn('⚠️ No explicit Play buttons found. Adding fallback listener to home-screen.');
      if (homeScreen) {
        homeScreen.addEventListener('click', (e) => {
          if (e.target.closest('button') || e.target.closest('.mode-card')) {
            handlePlayAction(e);
          }
        });
      }
    }
  }

  let isTurnInProgress = false;

  function setupGameplayInteractions() {
    if (!canvas3D || !dice3D) return;

    canvas3D.onclick = async () => {
      if (isTurnInProgress || dice3D.isRolling) return;

      const currentPlayer = turnManager.getCurrentPlayer();

      if (!gameSession.isBotTurn(currentPlayer)) {
        isTurnInProgress = true;
        await handleTurnExecution(currentPlayer);
        isTurnInProgress = false;
      }
    };
  }

  async function handleTurnExecution(playerColor) {
    try {
      audioManager.playDiceRoll();

      const randomRoll = Math.floor(Math.random() * 6) + 1;
      console.log(`🎲 ${playerColor} is rolling... Result: ${randomRoll}`);

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
      console.error('❌ Error executing turn:', err);
    }
  }

  async function triggerBotTurn(botColor) {
    const botAI = gameSession.getBotInstance(botColor);
    if (!botAI) return;

    console.log(`🤖 Bot (${botColor}) thinking...`);
    await botAI.simulateThinkingTime(1000, 1500);

    await handleTurnExecution(botColor);
  }
});
