/* ==========================================================================
   CRYSTAL PARCHEESI STAR - BOARD CONFIGURATION & PATH MAPPING
   ========================================================================== */

export const PLAYER_COLORS = {
  RED: 0xff3b30,
  GREEN: 0x34c759,
  YELLOW: 0xffcc00,
  BLUE: 0x007aff
};

export const BOARD_CONFIG = {
  tileSize: 1.2,
  boardSize: 15, // 15x15 Grid Layout
  safeTiles: [5, 12, 17, 22, 29, 34, 39, 44], // Global Safe/Star Position IDs
  homeEntryTiles: {
    RED: 51,
    GREEN: 12,
    YELLOW: 25,
    BLUE: 38
  }
};
