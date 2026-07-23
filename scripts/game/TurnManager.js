/* ==========================================================================
   CRYSTAL PARCHEESI STAR - TURN & STATE MANAGER
   ========================================================================== */

import { GameRules } from './GameRules.js';

export class TurnManager {
  constructor(players = ['RED', 'GREEN', 'YELLOW', 'BLUE']) {
    this.players = players;
    this.currentTurnIndex = 0;
    this.consecutiveSixes = 0;
    this.isRollPending = true;
    this.lastRollValue = null;
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  processRoll(rollValue) {
    this.lastRollValue = rollValue;

    if (rollValue === 6) {
      this.consecutiveSixes += 1;
      if (this.consecutiveSixes >= 3) {
        console.warn(`⚠️ Player ${this.getCurrentPlayer()} rolled three 6s! Turn forfeited.`);
        this.nextTurn();
        return { action: 'FORFEIT', rollValue };
      }
      return { action: 'MOVE_AND_BONUS', rollValue };
    } else {
      this.consecutiveSixes = 0;
      return { action: 'MOVE_NORMAL', rollValue };
    }
  }

  nextTurn() {
    this.consecutiveSixes = 0;
    this.isRollPending = true;
    this.lastRollValue = null;
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    console.log(`🔄 Turn changed to: ${this.getCurrentPlayer()}`);
    return this.getCurrentPlayer();
  }
}
