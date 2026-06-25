import type Phaser from 'phaser';
import type { AudioOptions, AudioState } from '../types/audio';

export class AudioManager {
  private state: AudioState = {
    muted: false,
    masterVolume: 1,
    bgmVolume: 1,
    sfxVolume: 1,
  };

  constructor(private readonly scene: Phaser.Scene) {}

  setMuted(muted: boolean): void {
    this.state = { ...this.state, muted };
    this.scene.sound.mute = muted;
  }

  setMasterVolume(volume: number): void {
    this.state = { ...this.state, masterVolume: volume };
    this.scene.sound.volume = volume;
  }

  playSfx(key: string, options?: AudioOptions): void {
    if (!this.state.muted) {
      this.scene.sound.play(key, { volume: options?.volume ?? this.state.sfxVolume });
    }
  }

  getState(): AudioState {
    return this.state;
  }
}
