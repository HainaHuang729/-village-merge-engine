import { describe, expect, it } from 'vitest';
import { Board } from '../src/board/Board';
import { EventBus } from '../src/core/EventBus';
import { BoardGestureController } from '../src/input/BoardGestureController';
import { ItemStore } from '../src/items/ItemStore';
import { MergeFlow } from '../src/merge/MergeFlow';
import { MergeManager } from '../src/merge/MergeManager';
import { EngineEvent } from '../src/types/events';
import type { EngineEventMap } from '../src/types/events';

function createHarness() {
  const eventBus = new EventBus<EngineEventMap>();
  const board = new Board({ id: 'board', columns: 3, rows: 1, cellSize: 48 }, eventBus);
  const itemStore = new ItemStore(eventBus);
  const mergeManager = new MergeManager(eventBus);
  const mergeFlow = new MergeFlow(mergeManager, eventBus);
  const controller = new BoardGestureController(eventBus);
  return { board, controller, eventBus, itemStore, mergeFlow, mergeManager };
}

describe('BoardGestureController', () => {
  it('does not start dragging from an empty cell', () => {
    const { board, controller } = createHarness();

    expect(controller.beginDragAt(board, { x: 0, y: 0 })).toBeUndefined();
    expect(controller.getDragState()).toBeUndefined();
  });

  it('moves an item through a complete gesture lifecycle', () => {
    const { board, controller, eventBus, itemStore, mergeFlow } = createHarness();
    const eventNames: string[] = [];
    eventBus.on(EngineEvent.DragStarted, () => eventNames.push('start'));
    eventBus.on(EngineEvent.DragMoved, () => eventNames.push('move'));
    eventBus.on(EngineEvent.DragEnded, () => eventNames.push('end'));
    eventBus.on(EngineEvent.DropAccepted, ({ resolution }) => eventNames.push(resolution.type));

    const item = itemStore.create('a');
    board.placeItem(item.id, { x: 0, y: 0 });

    expect(controller.beginDragAt(board, { x: 0, y: 0 })?.itemId).toBe(item.id);
    expect(controller.moveDragTo({ x: 1, y: 0 })?.current).toEqual({ x: 1, y: 0 });

    const resolution = controller.endDragAt(board, itemStore, mergeFlow, { x: 1, y: 0 });

    expect(resolution?.type).toBe('move');
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBeUndefined();
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe(item.id);
    expect(eventNames).toEqual(['start', 'move', 'end', 'move']);
  });

  it('merges matching items through a complete gesture lifecycle', () => {
    const { board, controller, itemStore, mergeFlow, mergeManager } = createHarness();
    mergeManager.setRules([{ id: 'a-a-to-b', from: ['a', 'a'], to: 'b' }]);

    const source = itemStore.create('a');
    const target = itemStore.create('a');
    board.placeItem(source.id, { x: 0, y: 0 });
    board.placeItem(target.id, { x: 1, y: 0 });

    controller.beginDragAt(board, { x: 0, y: 0 });
    const resolution = controller.endDragAt(board, itemStore, mergeFlow, { x: 1, y: 0 });

    expect(resolution?.type).toBe('merge');
    expect(resolution?.mergeResult?.created.configId).toBe('b');
    expect(itemStore.all()).toHaveLength(1);
    expect(itemStore.all()[0]?.configId).toBe('b');
  });

  it('can cancel an active gesture', () => {
    const { board, controller, itemStore } = createHarness();
    const item = itemStore.create('a');
    board.placeItem(item.id, { x: 0, y: 0 });

    controller.beginDragAt(board, { x: 0, y: 0 });
    const drag = controller.cancelDrag('manual');

    expect(drag?.itemId).toBe(item.id);
    expect(controller.getDragState()).toBeUndefined();
  });
});
