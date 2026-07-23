/* ==========================================================================
   CRYSTAL PARCHEESI STAR - BOT AI DECISION ENGINE
   ========================================================================== */

import { GameRules } from '../game/GameRules.js';

export class BotAI {
  constructor(difficulty = 'MEDIUM') {
    this.difficulty = difficulty; // EASY, MEDIUM, HARD
  }

  /**
   * Evaluates available moves for a bot and selects the best pawn to move.
   */
  decideMove(availablePawns, diceRoll) {
    if (!availablePawns || availablePawns.length === 0) return null;

    // Rule 1: Priority to release a pawn from Nest on a roll of 5
    if (GameRules.canExitNest(diceRoll)) {
      const pawnInNest = availablePawns.find(p => p.isInNest);
      if (pawnInNest) return pawnInNest;
    }

    // Rule 2: Priority to capture an opponent's pawn
    const capturingPawn = availablePawns.find(p => p.canCaptureWithRoll(diceRoll));
    if (capturingPawn) return capturingPawn;

    // Rule 3: Priority to reach a Safe Zone
    const safeZonePawn = availablePawns.find(p => p.canReachSafeZone(diceRoll));
    if (safeZonePawn) return safeZonePawn;

    // Fallback: Pick the pawn closest to the finish line or first available
    return availablePawns[0];
  }

  /**
   * Simulates human thinking delay before rolling or moving.
   */
  async simulateThinkingTime(minMs = 800, maxMs = 1500) {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
