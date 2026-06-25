import { describe, expect, it } from 'vitest';
import { Board } from '../src/board/Board';
import { EventBus } from '../src/core/EventBus';
import { BoardInteractionController } from '../src/input/BoardInteractionController';
import { ItemStore } from '../src/items/ItemStore';
import { MergeFlow } from '../src/merge/MergeFlow';
import { MergeManager } from '../src/merge/MergeManager';
import { EngineEvent } from '../src/types/events';
import type { EngineEventMap } from '../src/types/events';
import type { DropResolutionType } from '../src/types/input';

function createHarness() {
  const eventBus = new EventBus<EngineEventMap>();
  const board = new Board({ id: 'board', columns: 3, rows: 1, cellSize: 48 }, eventBus);
  const itemStore = new ItemStore(eventBus);
  const mergeManager = new MergeManager(eventBus);
  const mergeFlow = new MergeFlow(mergeManager, eventBus);
  const controller = new BoardInteractionController(eventBus);
  return { board, controller, eventBus, itemStore, mergeFlow, mergeManager };
}

describe('BoardInteractionController', () => {
  it('moves a dragged item into an empty cell', () => {
    const { board, controller, eventBus, itemStore, mergeFlow } = createHarness();
    const accepted: DropResolutionType[] = [];
    eventBus.on(EngineEvent.DropAccepted, ({ resolution }) => accepted.push(resolution.type));

    const item = itemStore.create('a');
    board.placeItem(item.id, { x: 0, y: 0 });

    const resolution = controller.resolveDrop(
      board,
      itemStore,
      mergeFlow,
      { itemId: item.id, from: { x: 0, y: 0 } },
      { x: 1, y: 0 },
    );

    expect(resolution.type).toBe('move');
    expect(accepted).toEqual(['move']);
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBeUndefined();
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe(item.id);
  });

  it('merges a dragged item with a matching target before trying swap', () => {
    const { board, controller, itemStore, mergeFlow, mergeManager } = createHarness();
    mergeManager.setRules([{ id: 'a-a-to-b', from: ['a', 'a'], to: 'b' }]);

    const source = itemStore.create('a');
    const target = itemStore.create('a');
    board.placeItem(source.id, { x: 0, y: 0 });
    board.placeItem(target.id, { x: 1, y: 0 });

    const resolution = controller.resolveDrop(
      board,
      itemStore,
      mergeFlow,
      { itemId: source.id, from: { x: 0, y: 0 } },
      { x: 1, y: 0 },
    );

    expect(resolution.type).toBe('merge');
    expect(resolution.mergeResult?.created.configId).toBe('b');
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBeUndefined();
    expect(itemStore.all()).toHaveLength(1);
    expect(itemStore.all()[0]?.configId).toBe('b');
  });

  it('swaps with an occupied target when no merge rule matches', () => {
    const { board, controller, eventBus, itemStore, mergeFlow } = createHarness();
    const swapped: string[] = [];
    eventBus.on(EngineEvent.ItemSwapped, ({ firstItemId, secondItemId }) => {
      swapped.push(`${firstItemId}:${secondItemId}`);
    });

    const source = itemStore.create('a');
    const target = itemStore.create('c');
    board.placeItem(source.id, { x: 0, y: 0 });
    board.placeItem(target.id, { x: 1, y: 0 });

    const resolution = controller.resolveDrop(
      board,
      itemStore,
      mergeFlow,
      { itemId: source.id, from: { x: 0, y: 0 } },
      { x: 1, y: 0 },
    );

    expect(resolution.type).toBe('swap');
    expect(swapped).toEqual([`${source.id}:${target.id}`]);
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBe(target.id);
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe(source.id);
  });

  it('rejects an occupied target when merge and swap are unavailable', () => {
    const { board, controller, eventBus, itemStore, mergeFlow } = createHarness();
    const rejected: Array<string | undefined> = [];
    eventBus.on(EngineEvent.DropRejected, ({ resolution }) => rejected.push(resolution.reason));

    const source = itemStore.create('a');
    const target = itemStore.create('c');
    board.placeItem(source.id, { x: 0, y: 0 });
    board.placeItem(target.id, { x: 1, y: 0 });

    const resolution = controller.resolveDrop(
      board,
      itemStore,
      mergeFlow,
      { itemId: source.id, from: { x: 0, y: 0 } },
      { x: 1, y: 0 },
      { allowSwap: false },
    );

    expect(resolution.type).toBe('reject');
    expect(rejected).toEqual(['DROP_REJECTED']);
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBe(source.id);
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe(target.id);
  });
});
