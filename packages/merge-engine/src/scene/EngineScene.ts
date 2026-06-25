import Phaser from 'phaser';
import { AnimationManager } from '../animation/AnimationManager';
import { AssetManager } from '../assets/AssetManager';
import { AudioManager } from '../audio/AudioManager';
import { CameraManager } from '../camera/CameraManager';
import { EventBus } from '../core/EventBus';
import { GameLoop } from '../core/GameLoop';
import { DebugManager } from '../debug/DebugManager';
import { DragDropManager } from '../input/DragDropManager';
import { InputManager } from '../input/InputManager';
import { MergeManager } from '../merge/MergeManager';
import { SaveManager } from '../save/SaveManager';
import { SpawnManager } from '../spawn/SpawnManager';
import { TweenManager } from '../tween/TweenManager';
import type { EngineEventMap } from '../types/events';
import type { EngineSceneConfig } from '../types/scene';

export class EngineScene extends Phaser.Scene {
  readonly eventBus = new EventBus<EngineEventMap>();
  readonly gameLoop = new GameLoop();
  readonly assetManager = new AssetManager();
  readonly mergeManager = new MergeManager(this.eventBus);
  readonly spawnManager = new SpawnManager(this.eventBus);
  readonly saveManager = new SaveManager('0.1.0');

  animationManager!: AnimationManager;
  audioManager!: AudioManager;
  cameraManager!: CameraManager;
  debugManager!: DebugManager;
  dragDropManager!: DragDropManager;
  inputManager!: InputManager;
  tweenManager!: TweenManager;

  constructor(config: EngineSceneConfig) {
    super(config.key);
  }

  create(): void {
    this.animationManager = new AnimationManager(this);
    this.audioManager = new AudioManager(this);
    this.cameraManager = new CameraManager(this);
    this.debugManager = new DebugManager(this);
    this.dragDropManager = new DragDropManager(this.eventBus);
    this.inputManager = new InputManager(this);
    this.tweenManager = new TweenManager(this);
  }

  override update(time: number, delta: number): void {
    this.gameLoop.update(delta, time);
    this.debugManager?.update();
  }
}
