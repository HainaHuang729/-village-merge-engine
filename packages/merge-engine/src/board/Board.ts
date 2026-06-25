import { Cell } from './Cell';
import { Grid } from './Grid';
import { createDefaultBoardPolicies } from './BoardPolicies';
import { EngineEvent } from '../types/events';
import type { BoardPolicies } from './BoardPolicies';
import type { EventBus } from '../core/EventBus';
import type { BoardConfig, BoardPosition, BoardSnapshot } from '../types/board';
import type { EngineEventMap } from '../types/events';

export class Board {
  readonly id: string;
  readonly grid: Grid;
  private readonly cells = new Map<string, Cell>();
  private readonly policies: BoardPolicies;

  constructor(
    config: BoardConfig,
    private readonly eventBus?: EventBus<EngineEventMap>,
    policies?: Partial<BoardPolicies>,
  ) {
    this.id = config.id;
    this.grid = new Grid(config);
    this.policies = { ...createDefaultBoardPolicies(), ...policies };
    this.createCells(config.columns, config.rows);
  }

  static deserialize(
    snapshot: BoardSnapshot,
    eventBus?: EventBus<EngineEventMap>,
    policies?: Partial<BoardPolicies>,
  ): Board {
    const board = new Board(
      {
        id: snapshot.id,
        columns: snapshot.columns,
        rows: snapshot.rows,
        cellSize: snapshot.cellSize,
        originX: snapshot.originX,
        originY: snapshot.originY,
      },
      eventBus,
      policies,
    );
    board.loadSnapshot(snapshot);
    eventBus?.emit(EngineEvent.BoardDeserialized, { snapshot });
    return board;
  }

  getCell(position: BoardPosition): Cell | undefined {
    return this.cells.get(this.key(position));
  }

  getCells(): Cell[] {
    return [...this.cells.values()];
  }

  canPlace(itemId: string, position: BoardPosition): boolean {
    return this.policies.place.canPlace(this, itemId, position);
  }

  placeItem(itemId: string, position: BoardPosition): boolean {
    if (!this.canPlace(itemId, position)) {
      return false;
    }
    const cell = this.getCell(position);
    if (!cell) {
      return false;
    }
    cell.setItem(itemId);
    this.eventBus?.emit(EngineEvent.CellChanged, { position });
    return true;
  }

  canDrop(itemId: string, position: BoardPosition): boolean {
    return this.policies.drop.canDrop(this, itemId, position);
  }

  dropItem(itemId: string, position: BoardPosition): boolean {
    if (!this.canDrop(itemId, position)) {
      return false;
    }
    return this.placeItem(itemId, position);
  }

  removeItem(position: BoardPosition): string | undefined {
    const cell = this.getCell(position);
    if (!cell?.itemId) {
      return undefined;
    }
    const itemId = cell.itemId;
    cell.setItem(undefined);
    this.eventBus?.emit(EngineEvent.CellChanged, { position });
    return itemId;
  }

  canMove(from: BoardPosition, to: BoardPosition): boolean {
    return this.policies.move.canMove(this, from, to);
  }

  moveItem(from: BoardPosition, to: BoardPosition): boolean {
    if (!this.canMove(from, to)) {
      return false;
    }

    const source = this.getCell(from);
    const target = this.getCell(to);
    if (!source?.itemId || !target) {
      return false;
    }

    const itemId = source.itemId;
    source.setItem(undefined);
    target.setItem(itemId);
    this.eventBus?.emit(EngineEvent.ItemMoved, { itemId, from, to });
    this.eventBus?.emit(EngineEvent.CellChanged, { position: from });
    this.eventBus?.emit(EngineEvent.CellChanged, { position: to });
    return true;
  }

  canSwap(from: BoardPosition, to: BoardPosition): boolean {
    return this.policies.swap.canSwap(this, from, to);
  }

  swapItems(from: BoardPosition, to: BoardPosition): boolean {
    if (!this.canSwap(from, to)) {
      return false;
    }

    const source = this.getCell(from);
    const target = this.getCell(to);
    if (!source?.itemId || !target?.itemId) {
      return false;
    }

    const sourceItemId = source.itemId;
    const targetItemId = target.itemId;
    source.setItem(targetItemId);
    target.setItem(sourceItemId);

    this.eventBus?.emit(EngineEvent.ItemSwapped, {
      firstItemId: sourceItemId,
      secondItemId: targetItemId,
      first: from,
      second: to,
    });
    this.eventBus?.emit(EngineEvent.ItemMoved, { itemId: sourceItemId, from, to });
    this.eventBus?.emit(EngineEvent.ItemMoved, { itemId: targetItemId, from: to, to: from });
    this.eventBus?.emit(EngineEvent.CellChanged, { position: from });
    this.eventBus?.emit(EngineEvent.CellChanged, { position: to });
    return true;
  }

  serialize(): BoardSnapshot {
    const snapshot = {
      id: this.id,
      columns: this.grid.columns,
      rows: this.grid.rows,
      cellSize: this.grid.cellSize,
      originX: this.grid.originX,
      originY: this.grid.originY,
      cells: [...this.cells.values()].map((cell) => cell.toJSON()),
    };
    this.eventBus?.emit(EngineEvent.BoardSerialized, { snapshot });
    return snapshot;
  }

  loadSnapshot(snapshot: BoardSnapshot): void {
    snapshot.cells.forEach((state) => {
      const cell = this.getCell(state.position);
      if (!cell) {
        return;
      }
      cell.locked = state.locked ?? false;
      cell.setItem(state.itemId);
      this.eventBus?.emit(EngineEvent.CellChanged, { position: state.position });
    });
  }

  private createCells(columns: number, rows: number): void {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const position = { x, y };
        this.cells.set(this.key(position), new Cell({ id: this.key(position), position }));
      }
    }
  }

  private key(position: BoardPosition): string {
    return `${position.x}:${position.y}`;
  }
}
