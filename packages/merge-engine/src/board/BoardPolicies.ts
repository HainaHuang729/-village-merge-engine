import type { Board } from './Board';
import type { BoardPosition } from '../types/board';

export interface PlacePolicy {
  canPlace(board: Board, itemId: string, position: BoardPosition): boolean;
}

export interface MovePolicy {
  canMove(board: Board, from: BoardPosition, to: BoardPosition): boolean;
}

export interface DropPolicy {
  canDrop(board: Board, itemId: string, position: BoardPosition): boolean;
}

export interface SwapPolicy {
  canSwap(board: Board, from: BoardPosition, to: BoardPosition): boolean;
}

export interface BoardPolicies {
  place: PlacePolicy;
  move: MovePolicy;
  drop: DropPolicy;
  swap: SwapPolicy;
}

export class DefaultPlacePolicy implements PlacePolicy {
  canPlace(board: Board, _itemId: string, position: BoardPosition): boolean {
    const cell = board.getCell(position);
    return Boolean(cell && !cell.locked && cell.isEmpty());
  }
}

export class DefaultMovePolicy implements MovePolicy {
  canMove(board: Board, from: BoardPosition, to: BoardPosition): boolean {
    if (from.x === to.x && from.y === to.y) {
      return false;
    }

    const source = board.getCell(from);
    const target = board.getCell(to);
    return Boolean(source?.itemId && target && !target.locked && target.isEmpty());
  }
}

export class DefaultDropPolicy implements DropPolicy {
  canDrop(board: Board, itemId: string, position: BoardPosition): boolean {
    return new DefaultPlacePolicy().canPlace(board, itemId, position);
  }
}

export class DefaultSwapPolicy implements SwapPolicy {
  canSwap(board: Board, from: BoardPosition, to: BoardPosition): boolean {
    if (from.x === to.x && from.y === to.y) {
      return false;
    }

    const source = board.getCell(from);
    const target = board.getCell(to);
    return Boolean(source?.itemId && target?.itemId && !source.locked && !target.locked);
  }
}

export function createDefaultBoardPolicies(): BoardPolicies {
  return {
    place: new DefaultPlacePolicy(),
    move: new DefaultMovePolicy(),
    drop: new DefaultDropPolicy(),
    swap: new DefaultSwapPolicy(),
  };
}
