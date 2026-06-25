# SCENE

Scene 层基于 Phaser 3。

## Engine Scene

`EngineScene` 继承 `Phaser.Scene`，预置通用 Manager：

- EventBus
- GameLoop
- AssetManager
- MergeManager
- SpawnManager
- SaveManager
- AnimationManager
- AudioManager
- InputManager
- DragDropManager
- CameraManager
- TweenManager
- DebugManager

## 基础 Scene

Engine 提供：

- `BootScene`
- `LoadingScene`
- `GameScene`
- `DebugScene`

这些是可复用基类，不包含具体游戏内容。

## Game Scene

Game 可以创建自己的 Scene：

```ts
export class MainScene extends EngineScene {}
```

Game Scene 可以组织具体 UI、内容配置和游戏流程，但不应修改 Engine 源码。

## Debug

Phase 1 DebugManager 支持：

- Grid Overlay。
- FPS。

规划支持：

- Item ID。
- Cell ID。
- Merge Log。
- Event Log。
