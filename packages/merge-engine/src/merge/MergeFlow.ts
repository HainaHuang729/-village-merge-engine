import { EngineEvent } from '../types/events';
import type { Board } from '../board/Board';
import type { EventBus } from '../core/EventBus';
import type { ItemStore } from '../items/ItemStore';
import type { BoardPosition } from '../types/board';
import type { EngineEventMap } from '../types/events';
import type { MergeRequest, MergeResult } from '../types/merge';
import type { MergeManager } from './MergeManager';

export class MergeFlow {
  constructor(
    private readonly mergeManager: MergeManager,
    private readonly eventBus: EventBus<EngineEventMap>,
  ) {}

  mergeCells(
    board: Board,
    itemStore: ItemStore,
    sourcePosition: BoardPosition,
    targetPosition: BoardPosition,
  ): MergeResult | undefined {
    const request = this.getMergeRequest(board, itemStore, sourcePosition, targetPosition);
    if (!request) {
      this.eventBus.emit(EngineEvent.MergeFailed, {
        reason: 'MISSING_ITEM',
        source: sourcePosition,
        target: targetPosition,
      });
      return undefined;
    }

    const result = this.mergeManager.merge(request);
    if (!result) {
      return undefined;
    }

    board.removeItem(sourcePosition);
    board.removeItem(targetPosition);
    itemStore.remove(request.source.id);
    itemStore.remove(request.target.id);
    itemStore.add(result.created);
    board.placeItem(result.created.id, targetPosition);
    return result;
  }

  canMergeCells(
    board: Board,
    itemStore: ItemStore,
    sourcePosition: BoardPosition,
    targetPosition: BoardPosition,
  ): boolean {
    const request = this.getMergeRequest(board, itemStore, sourcePosition, targetPosition);
    return request ? this.mergeManager.canMerge(request) : false;
  }

  private getMergeRequest(
    board: Board,
    itemStore: ItemStore,
    sourcePosition: BoardPosition,
    targetPosition: BoardPosition,
  ): MergeRequest | undefined {
    const sourceCell = board.getCell(sourcePosition);
    const targetCell = board.getCell(targetPosition);
    if (!sourceCell?.itemId || !targetCell?.itemId) {
      return undefined;
    }

    const source = itemStore.get(sourceCell.itemId);
    const target = itemStore.get(targetCell.itemId);
    if (!source || !target) {
      return undefined;
    }

    return {
      source,
      target,
      sourcePosition,
      targetPosition,
    };
  }
}
