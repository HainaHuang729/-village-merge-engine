import { describe, expect, it } from 'vitest';
import { VillageState } from '../src/systems/VillageState';

describe('VillageState', () => {
  it('builds a village building only once', () => {
    const village = new VillageState();

    expect(village.build('chicken_coop', 100)).toBe(true);
    expect(village.has('chicken_coop')).toBe(true);
    expect(village.build('chicken_coop', 200)).toBe(false);
    expect(village.all()).toEqual(['chicken_coop']);
  });

  it('serializes and restores completed buildings', () => {
    const village = new VillageState();
    village.build('chicken_coop', 100);

    const restored = new VillageState(village.serialize());

    expect(restored.has('chicken_coop')).toBe(true);
    expect(restored.serialize()).toEqual({
      buildings: ['chicken_coop'],
      completedAt: { chicken_coop: 100 },
    });
  });
});
