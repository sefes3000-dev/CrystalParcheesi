/* ==========================================================================
   CRYSTAL PARCHEESI STAR - ANTI-CHEAT & DATA VALIDATION ENGINE
   ========================================================================== */

export class AntiCheat {
  static MAX_COINS = 99999999;
  static MAX_GEMS = 999999;
  static MAX_LEVEL = 100;

  /**
   * Validates user profile data against tampering.
   * @param {Object} data 
   * @returns {Object} Cleaned and verified data
   */
  static validateProfile(data) {
    if (!data || typeof data !== 'object') {
      return null;
    }

    // Sanitize Coins
    if (typeof data.coins !== 'number' || data.coins < 0 || isNaN(data.coins)) {
      data.coins = 5000;
    } else if (data.coins > this.MAX_COINS) {
      data.coins = this.MAX_COINS;
    }

    // Sanitize Gems
    if (typeof data.gems !== 'number' || data.gems < 0 || isNaN(data.gems)) {
      data.gems = 0;
    } else if (data.gems > this.MAX_GEMS) {
      data.gems = this.MAX_GEMS;
    }

    // Sanitize Level & XP
    if (typeof data.level !== 'number' || data.level < 1) {
      data.level = 1;
    } else if (data.level > this.MAX_LEVEL) {
      data.level = this.MAX_LEVEL;
    }

    if (typeof data.xp !== 'number' || data.xp < 0) {
      data.xp = 0;
    }

    return data;
  }
}
