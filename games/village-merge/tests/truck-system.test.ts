import { describe, expect, it } from 'vitest';
import { TruckSystem } from '../src/systems/TruckSystem';
import type { TruckConfig } from '../src/config/content';

const config: TruckConfig = {
  capacity: 3,
  initialCargo: 1,
  replenishIntervalMs: 1000,
  spawnItemId: 'egg',
};

describe('TruckSystem', () => {
  it('starts with initial cargo and unloads one cargo item', () => {
    const truck = new TruckSystem(config, undefined, 0);

    expect(truck.cargo).toBe(1);
    expect(truck.unloadOne()).toBe('egg');
    expect(truck.cargo).toBe(0);
    expect(truck.unloadOne()).toBeUndefined();
  });

  it('replenishes cargo by elapsed intervals up to capacity', () => {
    const truck = new TruckSystem(config, undefined, 0);

    expect(truck.update(1000)).toBe(1);
    expect(truck.cargo).toBe(2);
    expect(truck.update(3000)).toBe(1);
    expect(truck.cargo).toBe(3);
    expect(truck.update(10000)).toBe(0);
    expect(truck.cargo).toBe(3);
  });

  it('restores from snapshot and applies offline replenishment', () => {
    const truck = new TruckSystem(
      config,
      {
        cargo: 0,
        deliveredTotal: 1,
        lastRestockedAt: 0,
      },
      2500,
    );

    expect(truck.cargo).toBe(2);
    expect(truck.serialize().deliveredTotal).toBe(3);
    expect(truck.timeToNextMs(2500)).toBe(500);
  });
});
