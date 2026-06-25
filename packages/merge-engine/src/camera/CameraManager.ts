import type Phaser from 'phaser';

export class CameraManager {
  constructor(private readonly scene: Phaser.Scene) {}

  centerOn(x: number, y: number): void {
    this.scene.cameras.main.centerOn(x, y);
  }

  shake(duration = 120, intensity = 0.004): void {
    this.scene.cameras.main.shake(duration, intensity);
  }
}
