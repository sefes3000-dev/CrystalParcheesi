/* ==========================================================================
   CRYSTAL PARCHEESI STAR - MASTER BOOTSTRAP SCRIPT
   ========================================================================== */

import { ProfileManager } from './scripts/profile/ProfileManager.js';
import { InventoryManager } from './scripts/inventory/InventoryManager.js';
import { ShopManager } from './scripts/shop/ShopManager.js';
import { ThreeManager } from './scripts/three/ThreeManager.js';
import { Showroom3D } from './scripts/three/Showroom3D.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Crystal Parcheesi STAR Engine Initializing...');

  // 1. Initialize System Managers
  const profileManager = new ProfileManager();
  const inventoryManager = new InventoryManager(profileManager);
  const shopManager = new ShopManager(profileManager, inventoryManager);

  // 2. Initialize 3D Graphics Engine
  const canvas3D = document.getElementById('webgl-canvas');
  let threeManager = null;
  let showroom3D = null;

  if (canvas3D) {
    threeManager = new ThreeManager(canvas3D);
    threeManager.init();
    showroom3D = new Showroom3D(threeManager);
    showroom3D.buildPlatform();
    showroom3D.loadSampleMesh('dice');
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
    loadingStatus.innerText = 'Loading Player Profile & Inventory...';
    const profile = await profileManager.init();
    inventoryManager.init();

    // Step 2: Load Shop Catalog
    setTimeout(async () => {
      loadingBar.style.width = '70%';
      loadingStatus.innerText = 'Loading Shop Database...';
      await shopManager.loadShopData();

      // Step 3: Complete & Start 3D Render Loop
      setTimeout(() => {
        loadingBar.style.width = '100%';
        loadingStatus.innerText = 'Ready!';

        setTimeout(() => {
          updateTopBarUI(profile);
          switchScreen(loadingScreen, homeScreen);
          topBar.style.display = 'flex';

          if (threeManager && showroom3D) {
            threeManager.startRenderLoop(() => {
              showroom3D.update();
            });
          }

          console.log('✅ Phase 2 Data & 3D Engine Ready. Profile:', profile);
        }, 400);
      }, 400);
    }, 400);
  }
});
