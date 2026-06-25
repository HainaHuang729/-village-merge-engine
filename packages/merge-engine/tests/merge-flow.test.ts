import { describe, expect, it } from 'vitest';
import { Board } from '../src/board/Board';
import { EventBus } from '../src/core/EventBus';
import { ItemStore } from '../src/items/ItemStore';
import { MergeFlow } from '../src/merge/MergeFlow';
import { MergeManager } from '../src/merge/MergeManager';
import { EngineEvent } from '../src/types/events';
import type { EngineEventMap } from '../src/types/events';
import type { MergeResult } from '../src/types/merge';

describe('MergeFlow', () => {
  it('merges two matching items and updates board plus item store', () => {
    const eventBus = new EventBus<EngineEventMap>();
    const mergeResults: MergeResult[] = [];
    eventBus.on(EngineEvent.MergeSuccess, ({ result }) => mergeResults.push(result));

    const board = new Board({ id: 'board', columns: 2, rows: 1, cellSize: 48 }, eventBus);
    const itemStore = new ItemStore(eventBus);
    const source = itemStore.create('item-a');
    const target = itemStore.create('item-a');
    board.placeItem(source.id, { x: 0, y: 0 });
    board.placeItem(target.id, { x: 1, y: 0 });

    const mergeManager = new MergeManager(eventBus);
    mergeManager.setRules([{ id: 'a-a-to-b', from: ['item-a', 'item-a'], to: 'item-b' }]);

    const flow = new MergeFlow(mergeManager, eventBus);
    const result = flow.mergeCells(board, itemStore, { x: 0, y: 0 }, { x: 1, y: 0 });

    expect(result?.created.configId).toBe('item-b');
    expect(mergeResults).toHaveLength(1);
    expect(itemStore.get(source.id)).toBeUndefined();
    expect(itemStore.get(target.id)).toBeUndefined();
    expect(itemStore.all()).toHaveLength(1);
    expect(itemStore.all()[0]?.configId).toBe('item-b');
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBeUndefined();
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe(result?.created.id);
  });

  it('emits merge failure and preserves state when no rule matches', () => {
    const eventBus = new EventBus<EngineEventMap>();
    const failures: string[] = [];
    eventBus.on(EngineEvent.MergeFailed, ({ reason }) => failures.push(reason));

    const board = new Board({ id: 'board', columns: 2, rows: 1, cellSize: 48 }, eventBus);
    const itemStore = new ItemStore(eventBus);
    const source = itemStore.create('item-a');
    const target = itemStore.create('item-c');
    board.placeItem(source.id, { x: 0, y: 0 });
    board.placeItem(target.id, { x: 1, y: 0 });

    const mergeManager = new MergeManager(eventBus);
    mergeManager.setRules([{ id: 'a-a-to-b', from: ['item-a', 'item-a'], to: 'item-b' }]);

    const flow = new MergeFlow(mergeManager, eventBus);
    const result = flow.mergeCells(board, itemStore, { x: 0, y: 0 }, { x: 1, y: 0 });

    expect(result).toBeUndefined();
    expect(failures).toEqual(['NO_MATCHING_RULE']);
    expect(itemStore.get(source.id)).toEqual(source);
    expect(itemStore.get(target.id)).toEqual(target);
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBe(source.id);
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe(target.id);
  });
});
