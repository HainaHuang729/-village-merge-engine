# ENGINE_API

本文件定义 Phase 1 的公开 API 边界。API 仍处于初稿阶段，后续实现前必须先 Review。

## Package

```ts
import {
  Board,
  EventBus,
  MergeManager,
  AssetManager,
  EngineScene,
} from '@merge-engine/core';
```

## Board

```ts
const board = new Board({
  id: 'main-board',
  columns: 6,
  rows: 6,
  cellSize: 48,
});
```

职责：

- 创建固定网格。
- 查询 Cell。
- 放置、移动、移除 Item。
- 序列化 Board 状态。

不负责：

- 题材规则。
- 资源加载。
- UI 展示。
- 经济或任务。

## ItemConfig

```ts
interface ItemConfig {
  id: string;
  name: string;
  icon: string;
  level?: number;
  mergeTo?: string;
  tags?: string[];
  category?: string;
  animation?: string;
  data?: Record<string, unknown>;
}
```

所有 Item 都来自配置。Game 可以扩展 `data`，但 Engine 不解释题材含义。

## MergeRule

```ts
interface MergeRule {
  id: string;
  from: string[];
  to: string;
  minCount?: number;
  delayMs?: number;
  animation?: string;
  tags?: string[];
}
```

示例：

```json
{
  "id": "item_a_to_item_b",
  "from": ["item_a", "item_a"],
  "to": "item_b"
}
```

新增 Merge 规则只应修改配置，不应修改 `MergeManager` 源码。

## EventBus

所有系统通信必须通过事件。

```ts
eventBus.on('MERGE_SUCCESS', ({ result }) => {
  console.log(result.created.configId);
});
```

## AssetManager

资源加载必须集中：

```ts
assetManager.registerManifest(manifest);
assetManager.preload(scene.load);
```

禁止在业务代码里散落 `load.image()`。

## SaveManager

Engine 只提供封装：

```ts
const envelope = saveManager.serialize(gameData);
const data = saveManager.deserialize(envelope);
```

Game 自己决定 `gameData` 内容。

## EngineScene

`EngineScene` 是 Phaser Scene 的基础类，预置：

- EventBus
- AssetManager
- MergeManager
- SpawnManager
- SaveManager
- InputManager
- AnimationManager
- AudioManager
- DebugManager
- CameraManager
- TweenManager

Game Scene 可以继承它，但不能把 Game 逻辑写回 Engine。
