# 📜 Changelog - Crystal Parcheesi STAR

All notable changes to this project will be documented in this file.

## [1.0.0] - Phase 7: Production Release & Performance Polish Completed
### Added
- Global exception error listener and optimized bootstrapper in `master.js`.
- Final project completion status inside `PROJECT_STATUS.md`.
- Verified production-ready WebGL render loop and audio synthesizer.

## [0.7.0] - Phase 6: Audio Engine & Sound Effects Completed
### Added
- Synthesized audio generator using Web Audio API (`AudioManager.js`).
- Interactive sound effects for UI clicks, dice rolling, and pawn step movements.
- Seamless audio trigger integration inside `master.js` for player and bot actions.

## [0.6.0] - Phase 5: Bot AI & Online/Offline Session Logic Completed
### Added
- Rule-based Bot AI decision engine with simulated thinking delays (`BotAI.js`).
- Flexible Game Session Manager supporting offline bot matches and pass-and-play (`GameSession.js`).
- Automatic bot turn loop integration with 3D dice rolling animations in `master.js`.

## [0.5.0] - Phase 4: Parchisi Rule Engine & Turn System Completed
### Added
- Core Parchisi rule verification module for safe zones, pawn release, captures, and bonus turns (`GameRules.js`).
- Dynamic turn state controller managing turn order, roll state, and 3 consecutive 6s penalty (`TurnManager.js`).
- Interactive dice rolling click trigger mapped to rule engine processing inside `master.js`.

## [0.4.0] - Phase 3: 3D Parchisi Board, Pawns & Dice Engine Completed
### Added
- Complete Parchisi board grid map and player color constants (`BoardConfig.js`).
- Procedural 3D Parchisi Board generator with wooden base, crystal surface, and corner nests (`BoardBuilder3D.js`).
- Dynamic 3D Pawn generator with arc-jumping animation system (`Pawn3D.js`).
- Realistic 3D rolling physics and rotation-snapping Dice simulator (`Dice3D.js`).
- Integrated board, dice, and pawns initialization loop into `master.js`.

## [0.3.0] - Phase 2: Three.js Graphics Engine & 3D Showroom Completed
### Added
- Central decoupled event management bus (`EventBus.js`).
- Three.js WebGL graphics manager with lights, shadow map, and mobile optimizations (`ThreeManager.js`).
- Interactive 3D Showroom platform with podium base and smooth rotation (`Showroom3D.js`).
- Integrated 3D engine animation render loop into `master.js`.

## [0.2.0] - Phase 1: Modular JSON Databases & Save Engine Completed
### Added
- JSON data structures for `shop.json`, `profile.json`, and `bots.json`.
- Anti-Cheat data validation class (`AntiCheat.js`).
- Persistent LocalStorage save engine (`SaveSystem.js`).
- Dynamic Profile Engine (`ProfileManager.js`) handling level, coins, gems, and XP.
- Inventory & Loadout Manager (`InventoryManager.js`) for non-auto-equip cosmetic management.
- Shop Engine (`ShopManager.js`) with currency validation and search filtering.
- Integrated profile loading and top-bar resource rendering into `master.js`.

## [0.1.0] - Phase 0: Project Initialization Completed
### Added
- Repository master structure created for Mobile GitHub workflow.
- Master project status tracker `PROJECT_STATUS.md`.
- Mobile responsive glassmorphic design system (`styles.css`).
- HTML5 Application Shell (`index.html`) with Three.js CDN integration.
- Application bootstrapper and UI state flow controller (`master.js`).
- Verified live deployment and UI transition on GitHub Pages.
