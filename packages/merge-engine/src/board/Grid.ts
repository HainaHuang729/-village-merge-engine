import type { BoardConfig, BoardPosition } from '../types/board';

export class Grid {
  readonly columns: number;
  readonly rows: number;
  readonly cellSize: number;
  readonly originX: number;
  readonly originY: number;

  constructor(config: BoardConfig) {
    this.columns = config.columns;
    this.rows = config.rows;
    this.cellSize = config.cellSize;
    this.originX = config.originX ?? 0;
    this.originY = config.originY ?? 0;
  }

  contains(position: BoardPosition): boolean {
    return position.x >= 0 && position.x < this.columns && position.y >= 0 && position.y < this.rows;
  }

  toWorld(position: BoardPosition): { x: number; y: number } {
    return {
      x: this.originX + position.x * this.cellSize,
      y: this.originY + position.y * this.cellSize,
    };
  }

  toCell(worldX: number, worldY: number): BoardPosition | undefined {
    const x = Math.floor((worldX - this.originX) / this.cellSize);
    const y = Math.floor((worldY - this.originY) / this.cellSize);
    const position = { x, y };
    return this.contains(position) ? position : undefined;
  }
}
