import { describe, expect, it } from 'vitest';
import { Board } from '../src/board/Board';

describe('Board', () => {
  it('creates a fixed grid from config', () => {
    const board = new Board({ id: 'board', columns: 6, rows: 6, cellSize: 48 });

    expect(board.id).toBe('board');
    expect(board.grid.columns).toBe(6);
    expect(board.grid.rows).toBe(6);
    expect(board.getCells()).toHaveLength(36);
  });

  it('places items only on empty cells', () => {
    const board = new Board({ id: 'board', columns: 2, rows: 2, cellSize: 48 });

    expect(board.placeItem('item-1', { x: 0, y: 0 })).toBe(true);
    expect(board.placeItem('item-2', { x: 0, y: 0 })).toBe(false);
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBe('item-1');
  });

  it('moves items to empty cells and prevents overwrite', () => {
    const board = new Board({ id: 'board', columns: 3, rows: 1, cellSize: 48 });

    board.placeItem('item-1', { x: 0, y: 0 });
    board.placeItem('item-2', { x: 2, y: 0 });

    expect(board.moveItem({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(true);
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBeUndefined();
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe('item-1');

    expect(board.moveItem({ x: 1, y: 0 }, { x: 2, y: 0 })).toBe(false);
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe('item-1');
    expect(board.getCell({ x: 2, y: 0 })?.itemId).toBe('item-2');
  });

  it('swaps two occupied cells', () => {
    const board = new Board({ id: 'board', columns: 2, rows: 1, cellSize: 48 });

    board.placeItem('item-1', { x: 0, y: 0 });
    board.placeItem('item-2', { x: 1, y: 0 });

    expect(board.swapItems({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(true);
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBe('item-2');
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBe('item-1');
  });

  it('does not swap with an empty cell', () => {
    const board = new Board({ id: 'board', columns: 2, rows: 1, cellSize: 48 });

    board.placeItem('item-1', { x: 0, y: 0 });

    expect(board.swapItems({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(false);
    expect(board.getCell({ x: 0, y: 0 })?.itemId).toBe('item-1');
    expect(board.getCell({ x: 1, y: 0 })?.itemId).toBeUndefined();
  });

  it('serializes and restores board state', () => {
    const board = new Board({
      id: 'board',
      columns: 2,
      rows: 2,
      cellSize: 40,
      originX: 10,
      originY: 20,
    });

    board.placeItem('item-1', { x: 1, y: 1 });
    const snapshot = board.serialize();
    const restored = Board.deserialize(snapshot);

    expect(restored.id).toBe('board');
    expect(restored.grid.cellSize).toBe(40);
    expect(restored.grid.originX).toBe(10);
    expect(restored.grid.originY).toBe(20);
    expect(restored.getCell({ x: 1, y: 1 })?.itemId).toBe('item-1');
  });
});
