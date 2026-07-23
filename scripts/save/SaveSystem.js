/* ==========================================================================
   CRYSTAL PARCHEESI STAR - SAVE SYSTEM MANAGER
   ========================================================================== */

import { AntiCheat } from './AntiCheat.js';

export class SaveSystem {
  static SAVE_KEY = 'CRYSTAL_PARCHEESI_SAVE_DATA';

  /**
   * Saves profile state locally.
   * @param {Object} profileData 
   */
  static saveProfile(profileData) {
    try {
      const validated = AntiCheat.validateProfile(profileData);
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(validated));
      console.log('💾 Game Progress Saved Successfully.');
      return true;
    } catch (e) {
      console.error('❌ Failed to save game data:', e);
      return false;
    }
  }

  /**
   * Loads saved profile or returns null if first launch.
   * @returns {Object|null}
   */
  static loadProfile() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return AntiCheat.validateProfile(parsed);
    } catch (e) {
      console.error('❌ Failed to load saved data:', e);
      return null;
    }
  }

  /**
   * Clears saved progress (Reset Game).
   */
  static clearSave() {
    localStorage.removeItem(this.SAVE_KEY);
    console.warn('⚠️ Game Save Data Cleared!');
  }
}
