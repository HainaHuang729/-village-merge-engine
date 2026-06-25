import { describe, expect, it } from 'vitest';
import { ASSET_MANIFEST, GAME_CONTENT } from '../src/config/content';

describe('Village Merge content manifest', () => {
  it('keeps item ids, merge rules, and initial items internally consistent', () => {
    const itemIds = new Set(GAME_CONTENT.items.map((item) => item.id));

    expect(itemIds.size).toBe(GAME_CONTENT.items.length);
    expect(itemIds.has(GAME_CONTENT.truck.spawnItemId)).toBe(true);

    for (const rule of GAME_CONTENT.mergeRules) {
      expect(rule.from.every((configId) => itemIds.has(configId))).toBe(true);
      expect(itemIds.has(rule.to)).toBe(true);
    }

    for (const item of GAME_CONTENT.initialItems) {
      expect(itemIds.has(item.configId)).toBe(true);
      expect(item.position.x).toBeGreaterThanOrEqual(0);
      expect(item.position.x).toBeLessThan(GAME_CONTENT.board.columns);
      expect(item.position.y).toBeGreaterThanOrEqual(0);
      expect(item.position.y).toBeLessThan(GAME_CONTENT.board.rows);
    }
  });

  it('keeps the MVP chain limited to egg, chick, chicken, and coop', () => {
    expect(GAME_CONTENT.items.map((item) => item.id)).toEqual([
      'egg',
      'chick',
      'chicken',
      'chicken_coop',
    ]);
    expect(GAME_CONTENT.mergeRules).toHaveLength(3);
  });

  it('has an asset entry for every configured item icon', () => {
    const assetIds = new Set(ASSET_MANIFEST.assets.map((asset) => asset.id));

    for (const item of GAME_CONTENT.items) {
      expect(assetIds.has(item.icon)).toBe(true);
    }

    expect(assetIds.has('village_empty_lot')).toBe(true);
    expect(assetIds.has('village_chicken_coop')).toBe(true);
  });
});
