/* ==========================================================================
   CRYSTAL PARCHEESI STAR - GAME SESSION MANAGER (DEBUGGED & SAFE)
   ========================================================================== */

import { PLAYER_COLORS } from '../board/BoardConfig.js';
import { BotAI } from './BotAI.js';

export const GAME_MODES = {
  OFFLINE_BOTS: 'OFFLINE_BOTS',
  PASS_AND_PLAY: 'PASS_AND_PLAY',
  ONLINE_MATCH: 'ONLINE_MATCH'
};

export class GameSession {
  constructor(mode = GAME_MODES.OFFLINE_BOTS) {
    this.mode = mode;
    this.isActive = false;
    this.players = [
      { id: 'player_1', color: PLAYER_COLORS.RED, isBot: false },
      { id: 'bot_green', color: PLAYER_COLORS.GREEN, isBot: true },
      { id: 'bot_yellow', color: PLAYER_COLORS.YELLOW, isBot: true },
      { id: 'bot_blue', color: PLAYER_COLORS.BLUE, isBot: true }
    ];
    this.botInstances = new Map();
    this.initBots();
  }

  initBots() {
    this.botInstances.clear();
    this.players.forEach(player => {
      if (player.isBot) {
        this.botInstances.set(player.color, new BotAI(player.color, 'MEDIUM'));
      }
    });
  }

  start() {
    this.isActive = true;
    console.log(`🎮 Game Session Active: ${this.mode}`);
    return true;
  }

  /**
   * Safe Alias for master.js compatibility
   */
  startSession() {
    return this.start();
  }

  isBotTurn(playerColor) {
    if (!this.isActive) return false;
    const player = this.players.find(p => p.color === playerColor);
    return player ? player.isBot : false;
  }

  getBotInstance(playerColor) {
    return this.botInstances.get(playerColor) || null;
  }

  reset() {
    this.isActive = false;
    this.initBots();
  }
}
