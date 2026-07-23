/* ==========================================================================
   CRYSTAL PARCHEESI STAR - MASTER BOOTSTRAP SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Crystal Parcheesi STAR Engine Initializing...');

  const splashScreen = document.getElementById('splash-screen');
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const topBar = document.getElementById('top-bar');
  const loadingBar = document.getElementById('loading-bar');
  const loadingStatus = document.getElementById('loading-status');

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

  function startLoadingSequence() {
    let progress = 0;
    const steps = [
      { p: 25, status: 'Loading Game Configurations...' },
      { p: 50, status: 'Initializing 3D WebGL Engine...' },
      { p: 75, status: 'Loading Cosmetic Databases...' },
      { p: 100, status: 'Ready!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        progress = steps[currentStep].p;
        loadingBar.style.width = `${progress}%`;
        loadingStatus.innerText = steps[currentStep].status;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          switchScreen(loadingScreen, homeScreen);
          topBar.style.display = 'flex';
        }, 500);
      }
    }, 400);
  }
});
