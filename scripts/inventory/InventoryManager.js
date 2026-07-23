/* ==========================================================================
   CRYSTAL PARCHEESI STAR - INVENTORY & LOADOUT MANAGER
   ========================================================================== */

import { SaveSystem } from '../save/SaveSystem.js';

export class InventoryManager {
  constructor(profileManager) {
    this.profileManager = profileManager;
    this.ownedItems = new Set([
      'dice_classic',
      'pawn_classic',
      'frame_classic'
    ]);
  }

  init() {
    const profile = this.profileManager.getProfile();
    if (profile.ownedItems) {
      profile.ownedItems.forEach(id => this.ownedItems.add(id));
    } else {
      profile.ownedItems = Array.from(this.ownedItems);
      SaveSystem.saveProfile(profile);
    }
  }

  isOwned(itemId) {
    return this.ownedItems.has(itemId);
  }

  addItem(itemId) {
    this.ownedItems.add(itemId);
    const profile = this.profileManager.getProfile();
    profile.ownedItems = Array.from(this.ownedItems);
    SaveSystem.saveProfile(profile);
  }

  equipItem(category, itemId) {
    if (!this.isOwned(itemId)) {
      console.warn(`Cannot equip ${itemId} - Not owned!`);
      return false;
    }
    const profile = this.profileManager.getProfile();
    if (profile.loadout && profile.loadout[category] !== undefined) {
      profile.loadout[category] = itemId;
      SaveSystem.saveProfile(profile);
      console.log(`Equipped ${itemId} for category: ${category}`);
      return true;
    }
    return false;
  }

  getEquippedItem(category) {
    const profile = this.profileManager.getProfile();
    return profile.loadout ? profile.loadout[category] : null;
  }
}
