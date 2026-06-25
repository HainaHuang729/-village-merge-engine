import type Phaser from 'phaser';
import type { Grid } from '../board/Grid';
import type { PointerState } from '../types/input';

export class InputManager {
  constructor(private readonly scene: Phaser.Scene) {}

  getPrimaryPointer(): PointerState {
    const pointer = this.scene.input.activePointer;
    return {
      id: pointer.id,
      worldX: pointer.worldX,
      worldY: pointer.worldY,
      isDown: pointer.isDown,
    };
  }

  getPrimaryPointerCell(grid: Grid) {
    const pointer = this.getPrimaryPointer();
    return grid.toCell(pointer.worldX, pointer.worldY);
  }
}
