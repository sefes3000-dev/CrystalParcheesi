/* ==========================================================================
   CRYSTAL PARCHEESI STAR - MASTER BOOTSTRAP SCRIPT
   ========================================================================== */

import { ProfileManager } from './scripts/profile/ProfileManager.js';
import { InventoryManager } from './scripts/inventory/InventoryManager.js';
import { ShopManager } from './scripts/shop/ShopManager.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Crystal Parcheesi STAR Engine Initializing...');

  // 1. Initialize System Managers
  const profileManager = new ProfileManager();
  const inventoryManager = new InventoryManager(profileManager);
  const shopManager = new ShopManager(profileManager, inventoryManager);

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
    let progress = 0;
    
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

      // Step 3: Complete
      setTimeout(() => {
        loadingBar.style.width = '100%';
        loadingStatus.innerText = 'Ready!';

        setTimeout(() => {
          updateTopBarUI(profile);
          switchScreen(loadingScreen, homeScreen);
          topBar.style.display = 'flex';
          console.log('✅ Phase 1 Data Systems Ready. Profile:', profile);
        }, 400);
      }, 400);
    }, 400);
  }
});
