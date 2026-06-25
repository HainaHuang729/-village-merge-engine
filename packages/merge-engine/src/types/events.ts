import type { BoardPosition } from './board';
import type { DropResolution } from './input';
import type { ItemInstance } from './item';
import type { MergeResult } from './merge';

export const EngineEvent = {
  ItemCreated: 'ITEM_CREATED',
  ItemRemoved: 'ITEM_REMOVED',
  ItemMoved: 'ITEM_MOVED',
  ItemSwapped: 'ITEM_SWAPPED',
  MergeSuccess: 'MERGE_SUCCESS',
  MergeFailed: 'MERGE_FAILED',
  CellChanged: 'CELL_CHANGED',
  DragStarted: 'DRAG_STARTED',
  DragMoved: 'DRAG_MOVED',
  DragEnded: 'DRAG_ENDED',
  DragCancelled: 'DRAG_CANCELLED',
  DropAccepted: 'DROP_ACCEPTED',
  DropRejected: 'DROP_REJECTED',
  BoardSerialized: 'BOARD_SERIALIZED',
  BoardDeserialized: 'BOARD_DESERIALIZED',
} as const;

export type EngineEventName = (typeof EngineEvent)[keyof typeof EngineEvent];

export interface EngineEventMap {
  ITEM_CREATED: { item: ItemInstance; position?: BoardPosition };
  ITEM_REMOVED: { itemId: string; position?: BoardPosition };
  ITEM_MOVED: { itemId: string; from: BoardPosition; to: BoardPosition };
  ITEM_SWAPPED: {
    firstItemId: string;
    secondItemId: string;
    first: BoardPosition;
    second: BoardPosition;
  };
  MERGE_SUCCESS: { result: MergeResult };
  MERGE_FAILED: { reason: string; source?: BoardPosition; target?: BoardPosition };
  CELL_CHANGED: { position: BoardPosition };
  DRAG_STARTED: { itemId: string; from: BoardPosition; position: BoardPosition };
  DRAG_MOVED: { itemId: string; from: BoardPosition; current: BoardPosition };
  DRAG_ENDED: { itemId: string; from: BoardPosition; to: BoardPosition; position: BoardPosition };
  DRAG_CANCELLED: {
    itemId: string;
    from: BoardPosition;
    current?: BoardPosition;
    reason?: string;
  };
  DROP_ACCEPTED: { resolution: DropResolution };
  DROP_REJECTED: { resolution: DropResolution };
  BOARD_SERIALIZED: { snapshot: unknown };
  BOARD_DESERIALIZED: { snapshot: unknown };
}

export type EventHandler<TPayload> = (payload: TPayload) => void;
