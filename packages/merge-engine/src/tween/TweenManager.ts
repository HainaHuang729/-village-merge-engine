import type Phaser from 'phaser';

export class TweenManager {
  constructor(private readonly scene: Phaser.Scene) {}

  add(config: Phaser.Types.Tweens.TweenBuilderConfig): Phaser.Tweens.Tween {
    return this.scene.tweens.add(config);
  }
}
