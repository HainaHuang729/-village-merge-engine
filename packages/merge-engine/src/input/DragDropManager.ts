import { EngineEvent } from '../types/events';
import type { EventBus } from '../core/EventBus';
import type { BoardPosition } from '../types/board';
import type { EngineEventMap } from '../types/events';
import type { DragState } from '../types/input';

export class DragDropManager {
  private current?: DragState;

  constructor(private readonly eventBus: EventBus<EngineEventMap>) {}

  start(itemId: string, from: BoardPosition): boolean {
    if (this.current) {
      return false;
    }
    this.current = { itemId, from };
    this.eventBus.emit(EngineEvent.DragStarted, { itemId, from, position: from });
    return true;
  }

  update(position: BoardPosition): void {
    if (this.current) {
      this.current.current = position;
      this.eventBus.emit(EngineEvent.DragMoved, {
        itemId: this.current.itemId,
        from: this.current.from,
        current: position,
      });
    }
  }

  end(position: BoardPosition): DragState | undefined {
    if (!this.current) {
      return undefined;
    }
    const drag = { ...this.current, current: position };
    this.eventBus.emit(EngineEvent.DragEnded, {
      itemId: drag.itemId,
      from: drag.from,
      to: position,
      position,
    });
    this.current = undefined;
    return drag;
  }

  cancel(reason?: string): DragState | undefined {
    if (!this.current) {
      return undefined;
    }
    const drag = this.current;
    this.eventBus.emit(EngineEvent.DragCancelled, {
      itemId: drag.itemId,
      from: drag.from,
      current: drag.current,
      reason,
    });
    this.current = undefined;
    return drag;
  }

  getState(): DragState | undefined {
    return this.current;
  }
}
