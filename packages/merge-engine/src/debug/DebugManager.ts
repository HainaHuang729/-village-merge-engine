import type Phaser from 'phaser';
import type { Board } from '../board/Board';

export interface DebugOptions {
  showGrid?: boolean;
  showFps?: boolean;
  showCellIds?: boolean;
  showItemIds?: boolean;
  showMergeLog?: boolean;
}

export class DebugManager {
  private graphics?: Phaser.GameObjects.Graphics;
  private fpsText?: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly options: DebugOptions = {},
  ) {}

  drawBoard(board: Board): void {
    if (!this.options.showGrid) {
      return;
    }

    this.graphics?.destroy();
    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(1, 0x8aa0b8, 0.8);

    for (let x = 0; x <= board.grid.columns; x += 1) {
      const worldX = board.grid.originX + x * board.grid.cellSize;
      this.graphics.lineBetween(
        worldX,
        board.grid.originY,
        worldX,
        board.grid.originY + board.grid.rows * board.grid.cellSize,
      );
    }

    for (let y = 0; y <= board.grid.rows; y += 1) {
      const worldY = board.grid.originY + y * board.grid.cellSize;
      this.graphics.lineBetween(
        board.grid.originX,
        worldY,
        board.grid.originX + board.grid.columns * board.grid.cellSize,
        worldY,
      );
    }
  }

  update(): void {
    if (!this.options.showFps) {
      return;
    }

    if (!this.fpsText) {
      this.fpsText = this.scene.add.text(8, 8, '', {
        color: '#1f2933',
        fontFamily: 'Arial',
        fontSize: '14px',
      });
    }
    this.fpsText.setText(`FPS ${Math.round(this.scene.game.loop.actualFps)}`);
  }
}
