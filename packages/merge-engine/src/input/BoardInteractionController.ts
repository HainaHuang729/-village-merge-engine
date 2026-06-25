import { EngineEvent } from '../types/events';
import type { Board } from '../board/Board';
import type { EventBus } from '../core/EventBus';
import type { ItemStore } from '../items/ItemStore';
import type { MergeFlow } from '../merge/MergeFlow';
import type { BoardPosition } from '../types/board';
import type { EngineEventMap } from '../types/events';
import type { DragState, DropResolution } from '../types/input';

export interface DropResolveOptions {
  allowMerge?: boolean;
  allowSwap?: boolean;
}

export class BoardInteractionController {
  constructor(private readonly eventBus: EventBus<EngineEventMap>) {}

  resolveDrop(
    board: Board,
    itemStore: ItemStore,
    mergeFlow: MergeFlow,
    drag: DragState,
    to: BoardPosition,
    options: DropResolveOptions = {},
  ): DropResolution {
    const allowMerge = options.allowMerge ?? true;
    const allowSwap = options.allowSwap ?? true;

    if (drag.from.x === to.x && drag.from.y === to.y) {
      return this.reject({ type: 'noop', itemId: drag.itemId, from: drag.from, to });
    }

    const sourceCell = board.getCell(drag.from);
    const targetCell = board.getCell(to);
    if (!sourceCell || !targetCell) {
      return this.reject({
        type: 'reject',
        itemId: drag.itemId,
        from: drag.from,
        to,
        reason: 'OUT_OF_BOUNDS',
      });
    }

    if (sourceCell.itemId !== drag.itemId) {
      return this.reject({
        type: 'reject',
        itemId: drag.itemId,
        from: drag.from,
        to,
        reason: 'SOURCE_ITEM_MISMATCH',
      });
    }

    if (!targetCell.itemId) {
      return board.moveItem(drag.from, to)
        ? this.accept({ type: 'move', itemId: drag.itemId, from: drag.from, to })
        : this.reject({
            type: 'reject',
            itemId: drag.itemId,
            from: drag.from,
            to,
            reason: 'MOVE_REJECTED',
          });
    }

    if (allowMerge && mergeFlow.canMergeCells(board, itemStore, drag.from, to)) {
      const mergeResult = mergeFlow.mergeCells(board, itemStore, drag.from, to);
      if (mergeResult) {
        return this.accept({
          type: 'merge',
          itemId: drag.itemId,
          from: drag.from,
          to,
          mergeResult,
        });
      }
    }

    if (allowSwap && board.swapItems(drag.from, to)) {
      return this.accept({ type: 'swap', itemId: drag.itemId, from: drag.from, to });
    }

    return this.reject({
      type: 'reject',
      itemId: drag.itemId,
      from: drag.from,
      to,
      reason: 'DROP_REJECTED',
    });
  }

  private accept(resolution: DropResolution): DropResolution {
    this.eventBus.emit(EngineEvent.DropAccepted, { resolution });
    return resolution;
  }

  private reject(resolution: DropResolution): DropResolution {
    this.eventBus.emit(EngineEvent.DropRejected, { resolution });
    return resolution;
  }
}
