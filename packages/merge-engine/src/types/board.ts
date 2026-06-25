export interface BoardConfig {
  id: string;
  columns: number;
  rows: number;
  cellSize: number;
  originX?: number;
  originY?: number;
}

export interface BoardPosition {
  x: number;
  y: number;
}

export interface CellState {
  id: string;
  position: BoardPosition;
  itemId?: string;
  locked?: boolean;
}

export interface BoardSnapshot {
  id: string;
  columns: number;
  rows: number;
  cellSize: number;
  originX: number;
  originY: number;
  cells: CellState[];
}

export interface BoardOperationResult {
  ok: boolean;
  reason?: string;
}
