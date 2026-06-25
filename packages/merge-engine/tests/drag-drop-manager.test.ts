import { describe, expect, it } from 'vitest';
import { EventBus } from '../src/core/EventBus';
import { DragDropManager } from '../src/input/DragDropManager';
import { EngineEvent } from '../src/types/events';
import type { EngineEventMap } from '../src/types/events';

describe('DragDropManager', () => {
  it('tracks drag lifecycle and emits events', () => {
    const eventBus = new EventBus<EngineEventMap>();
    const events: string[] = [];
    eventBus.on(EngineEvent.DragStarted, () => events.push('started'));
    eventBus.on(EngineEvent.DragMoved, () => events.push('moved'));
    eventBus.on(EngineEvent.DragEnded, () => events.push('ended'));

    const manager = new DragDropManager(eventBus);

    expect(manager.start('item-1', { x: 0, y: 0 })).toBe(true);
    manager.update({ x: 1, y: 0 });
    const drag = manager.end({ x: 1, y: 0 });

    expect(drag).toEqual({ itemId: 'item-1', from: { x: 0, y: 0 }, current: { x: 1, y: 0 } });
    expect(manager.getState()).toBeUndefined();
    expect(events).toEqual(['started', 'moved', 'ended']);
  });

  it('cancels an active drag', () => {
    const eventBus = new EventBus<EngineEventMap>();
    const reasons: Array<string | undefined> = [];
    eventBus.on(EngineEvent.DragCancelled, ({ reason }) => reasons.push(reason));

    const manager = new DragDropManager(eventBus);
    manager.start('item-1', { x: 0, y: 0 });
    const drag = manager.cancel('rebound');

    expect(drag?.itemId).toBe('item-1');
    expect(manager.getState()).toBeUndefined();
    expect(reasons).toEqual(['rebound']);
  });
});
