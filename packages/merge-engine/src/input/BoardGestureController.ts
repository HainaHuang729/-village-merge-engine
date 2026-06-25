import { BoardInteractionController } from './BoardInteractionController';
import { DragDropManager } from './DragDropManager';
import type { Board } from '../board/Board';
import type { EventBus } from '../core/EventBus';
import type { ItemStore } from '../items/ItemStore';
import type { MergeFlow } from '../merge/MergeFlow';
import type { BoardPosition } from '../types/board';
import type { EngineEventMap } from '../types/events';
import type { DragState, DropResolution } from '../types/input';
import type { DropResolveOptions } from './BoardInteractionController';

export class BoardGestureController {
  private readonly dragDropManager: DragDropManager;
  private readonly interactionController: BoardInteractionController;

  constructor(eventBus: EventBus<EngineEventMap>) {
    this.dragDropManager = new DragDropManager(eventBus);
    this.interactionController = new BoardInteractionController(eventBus);
  }

  beginDragAt(board: Board, position: BoardPosition): DragState | undefined {
    const cell = board.getCell(position);
    if (!cell?.itemId) {
      return undefined;
    }

    const started = this.dragDropManager.start(cell.itemId, position);
    return started ? this.dragDropManager.getState() : undefined;
  }

  moveDragTo(position: BoardPosition): DragState | undefined {
    this.dragDropManager.update(position);
    return this.dragDropManager.getState();
  }

  endDragAt(
    board: Board,
    itemStore: ItemStore,
    mergeFlow: MergeFlow,
    position: BoardPosition,
    options?: DropResolveOptions,
  ): DropResolution | undefined {
    const drag = this.dragDropManager.end(position);
    if (!drag) {
      return undefined;
    }
    return this.interactionController.resolveDrop(board, itemStore, mergeFlow, drag, position, options);
  }

  cancelDrag(reason?: string): DragState | undefined {
    return this.dragDropManager.cancel(reason);
  }

  getDragState(): DragState | undefined {
    return this.dragDropManager.getState();
  }
}
