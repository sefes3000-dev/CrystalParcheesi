/* ==========================================================================
   CRYSTAL PARCHEESI STAR - SHOP SYSTEM MANAGER
   ========================================================================== */

export class ShopManager {
  constructor(profileManager, inventoryManager) {
    this.profileManager = profileManager;
    this.inventoryManager = inventoryManager;
    this.shopItems = [];
  }

  async loadShopData() {
    try {
      const res = await fetch('data/shop.json');
      const data = await res.json();
      this.shopItems = data.items || [];
      return this.shopItems;
    } catch (e) {
      console.error('Failed to load shop items:', e);
      return [];
    }
  }

  buyItem(itemId) {
    const item = this.shopItems.find(i => i.id === itemId);
    if (!item) return { success: false, reason: 'Item not found' };

    if (this.inventoryManager.isOwned(itemId)) {
      return { success: false, reason: 'Item already owned' };
    }

    let success = false;
    if (item.currency === 'coins') {
      success = this.profileManager.deductCoins(item.price);
    } else if (item.currency === 'gems') {
      success = this.profileManager.deductGems(item.price);
    }

    if (success) {
      this.inventoryManager.addItem(itemId);
      return { success: true, item };
    } else {
      return { success: false, reason: 'Insufficient funds' };
    }
  }

  filterItems(category = 'all', rarity = 'all') {
    return this.shopItems.filter(item => {
      const matchCat = category === 'all' || item.category === category;
      const matchRarity = rarity === 'all' || item.rarity === rarity;
      return matchCat && matchRarity;
    });
  }
}
