import type { BoardPosition } from './board';
import type { MergeResult } from './merge';

export interface PointerState {
  id: number;
  worldX: number;
  worldY: number;
  isDown: boolean;
}

export interface DragState {
  itemId: string;
  from: BoardPosition;
  current?: BoardPosition;
}

export type DropResolutionType = 'move' | 'merge' | 'swap' | 'reject' | 'noop';

export interface DropResolution {
  type: DropResolutionType;
  itemId: string;
  from: BoardPosition;
  to: BoardPosition;
  reason?: string;
  mergeResult?: MergeResult;
}
