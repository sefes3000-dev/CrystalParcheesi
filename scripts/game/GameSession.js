/* ==========================================================================
   CRYSTAL PARCHEESI STAR - GAME SESSION MANAGER
   ========================================================================== */

import { BotAI } from '../ai/BotAI.js';

export const GAME_MODES = {
  OFFLINE_BOTS: 'OFFLINE_BOTS',
  PASS_AND_PLAY: 'PASS_AND_PLAY',
  ONLINE_MATCH: 'ONLINE_MATCH'
};

export class GameSession {
  constructor(mode = GAME_MODES.OFFLINE_BOTS) {
    this.mode = mode;
    this.bots = {};
    this.initSession();
  }

  initSession() {
    if (this.mode === GAME_MODES.OFFLINE_BOTS) {
      // Assign Bot AI to Green, Yellow, and Blue players
      this.bots['GREEN'] = new BotAI('MEDIUM');
      this.bots['YELLOW'] = new BotAI('MEDIUM');
      this.bots['BLUE'] = new BotAI('EASY');
    }
  }

  isBotTurn(playerColor) {
    return !!this.bots[playerColor];
  }

  getBotInstance(playerColor) {
    return this.bots[playerColor] || null;
  }
}
