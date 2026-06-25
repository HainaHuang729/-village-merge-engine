import type { BoardPosition, CellState } from '../types/board';

export class Cell {
  readonly id: string;
  readonly position: BoardPosition;
  itemId?: string;
  locked: boolean;

  constructor(state: CellState) {
    this.id = state.id;
    this.position = state.position;
    this.itemId = state.itemId;
    this.locked = state.locked ?? false;
  }

  isEmpty(): boolean {
    return !this.itemId;
  }

  setItem(itemId?: string): void {
    this.itemId = itemId;
  }

  toJSON(): CellState {
    return {
      id: this.id,
      position: this.position,
      itemId: this.itemId,
      locked: this.locked,
    };
  }
}
