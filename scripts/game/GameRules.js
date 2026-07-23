/* ==========================================================================
   CRYSTAL PARCHEESI STAR - PARCHISI CORE RULE ENGINE
   ========================================================================== */

import { BOARD_CONFIG } from '../board/BoardConfig.js';

export class GameRules {
  /**
   * Checks if a roll allows a pawn to exit the nest.
   * Standard Parchisi rule: Roll of 5 exits a pawn.
   */
  static canExitNest(diceRoll) {
    return diceRoll === 5;
  }

  /**
   * Checks if a target tile index is a Safe Zone (Star or Globe).
   */
  static isSafeZone(tileIndex) {
    return BOARD_CONFIG.safeTiles.includes(tileIndex);
  }

  /**
   * Validates if a move results in capturing an opponent's pawn.
   */
  static isCapture(targetTileIndex, targetPawnOwner, currentPawnOwner) {
    if (this.isSafeZone(targetTileIndex)) {
      return false; // Pawns are safe on safe tiles
    }
    return targetPawnOwner !== null && targetPawnOwner !== currentPawnOwner;
  }

  /**
   * Checks if a player gets a bonus turn.
   * Standard Parchisi rule: Rolling a 6 grants a bonus turn (max 3 consecutive).
   */
  static givesBonusTurn(diceRoll, consecutiveSixes) {
    if (diceRoll === 6) {
      return consecutiveSixes < 2; // Allow up to 3 sixes before penalty
    }
    return false;
  }
}
