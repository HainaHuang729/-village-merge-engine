import { describe, expect, it } from 'vitest';
import { Board } from '../../../packages/merge-engine/src/board/Board';
import { EventBus } from '../../../packages/merge-engine/src/core/EventBus';
import { ItemStore } from '../../../packages/merge-engine/src/items/ItemStore';
import { MergeFlow } from '../../../packages/merge-engine/src/merge/MergeFlow';
import { MergeManager } from '../../../packages/merge-engine/src/merge/MergeManager';
import { mergeRuleLoader } from '../../../packages/merge-engine/src/merge/MergeRuleLoader';
import { GAME_CONTENT } from '../src/config/content';
import { TruckSystem } from '../src/systems/TruckSystem';
import { VillageState } from '../src/systems/VillageState';
import type { BoardPosition } from '../../../packages/merge-engine/src/types/board';

function samePosition(a: BoardPosition, b: BoardPosition): boolean {
  return a.x === b.x && a.y === b.y;
}

describe('Village Merge MVP flow', () => {
  it('can build the first chicken coop from the starting board plus truck cargo', () => {
    const eventBus = new EventBus();
    const board = new Board(GAME_CONTENT.board, eventBus);
    const itemStore = new ItemStore(eventBus);
    const mergeManager = new MergeManager(eventBus);
    const mergeFlow = new MergeFlow(mergeManager, eventBus);
    const truck = new TruckSystem(GAME_CONTENT.truck, undefined, 0);
    const village = new VillageState();

    mergeManager.setRules(mergeRuleLoader.load(GAME_CONTENT.mergeRules));

    for (const item of GAME_CONTENT.initialItems) {
      const created = itemStore.create(item.configId);
      expect(board.placeItem(created.id, item.position)).toBe(true);
    }

    const createCargoAt = (position: BoardPosition): void => {
      const configId = truck.unloadOne();
      expect(configId).toBe(GAME_CONTENT.truck.spawnItemId);
      const item = itemStore.create(configId ?? '');
      expect(board.placeItem(item.id, position)).toBe(true);
    };

    const merge = (from: BoardPosition, to: BoardPosition, expectedConfigId: string): void => {
      const result = mergeFlow.mergeCells(board, itemStore, from, to);
      expect(result?.created.configId).toBe(expectedConfigId);
      expect(samePosition(result?.position ?? { x: -1, y: -1 }, to)).toBe(true);
    };

    merge({ x: 0, y: 0 }, { x: 1, y: 0 }, 'chick');
    merge({ x: 0, y: 1 }, { x: 1, y: 1 }, 'chicken');

    createCargoAt({ x: 0, y: 0 });
    createCargoAt({ x: 0, y: 1 });
    merge({ x: 0, y: 0 }, { x: 0, y: 1 }, 'chick');

    merge({ x: 0, y: 1 }, { x: 1, y: 0 }, 'chicken');
    merge({ x: 1, y: 0 }, { x: 1, y: 1 }, 'chicken_coop');

    const coopCell = board.getCell({ x: 1, y: 1 });
    const coopItemId = coopCell?.itemId;
    expect(coopItemId).toBeDefined();
    expect(itemStore.get(coopItemId ?? '')?.configId).toBe('chicken_coop');

    expect(village.build(GAME_CONTENT.village.targetBuildingId, 100)).toBe(true);
    board.removeItem({ x: 1, y: 1 });
    itemStore.remove(coopItemId ?? '');

    expect(village.has('chicken_coop')).toBe(true);
    expect(board.getCells().some((cell) => cell.itemId === coopItemId)).toBe(false);
    expect(itemStore.get(coopItemId ?? '')).toBeUndefined();
    expect(truck.cargo).toBe(GAME_CONTENT.truck.initialCargo - 2);
  });
});
