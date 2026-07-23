/* ==========================================================================
   CRYSTAL PARCHEESI STAR - PROFILE MANAGER
   ========================================================================== */

import { SaveSystem } from '../save/SaveSystem.js';

export class ProfileManager {
  constructor() {
    this.data = null;
  }

  /**
   * Initializes profile data from storage or default JSON.
   */
  async init() {
    const saved = SaveSystem.loadProfile();
    if (saved) {
      this.data = saved;
    } else {
      const res = await fetch('data/profile.json');
      this.data = await res.json();
      SaveSystem.saveProfile(this.data);
    }
    return this.data;
  }

  addCoins(amount) {
    if (amount <= 0) return;
    this.data.coins += amount;
    SaveSystem.saveProfile(this.data);
  }

  deductCoins(amount) {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      SaveSystem.saveProfile(this.data);
      return true;
    }
    return false;
  }

  addGems(amount) {
    if (amount <= 0) return;
    this.data.gems += amount;
    SaveSystem.saveProfile(this.data);
  }

  deductGems(amount) {
    if (this.data.gems >= amount) {
      this.data.gems -= amount;
      SaveSystem.saveProfile(this.data);
      return true;
    }
    return false;
  }

  addXP(amount) {
    this.data.xp += amount;
    const requiredXP = this.data.level * 1000;
    if (this.data.xp >= requiredXP) {
      this.data.level += 1;
      this.data.xp -= requiredXP;
      console.log(`🎉 Level Up! Player reached Level ${this.data.level}`);
    }
    SaveSystem.saveProfile(this.data);
  }

  getProfile() {
    return this.data;
  }
}
