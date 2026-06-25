import type Phaser from 'phaser';
import type { AnimationRequest } from '../types/animation';

export class AnimationManager {
  constructor(private readonly scene: Phaser.Scene) {}

  play(request: AnimationRequest): void {
    this.scene.events.emit('engine:animation', request);
  }
}
