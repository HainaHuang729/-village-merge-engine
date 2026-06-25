# ASSET

AssetManager 是资源唯一入口。

## 原则

- 禁止在 Game 代码里散落 `load.image()`。
- 禁止在 Engine 代码里写具体题材资源。
- 所有资源通过 manifest 注册。
- Engine 只理解资源类型和路径。

## AssetConfig

```ts
interface AssetConfig {
  id: string;
  kind: 'image' | 'spritesheet' | 'audio' | 'json' | 'font';
  path: string;
  frameWidth?: number;
  frameHeight?: number;
  data?: Record<string, unknown>;
}
```

## AssetManifest

```json
{
  "assets": [
    {
      "id": "item_a",
      "kind": "image",
      "path": "/assets/items/item_a.png"
    }
  ]
}
```

## Provider

`AssetProvider` 隔离 Phaser Loader。未来微信小游戏路径、远程资源、分包资源都可以通过 Provider 扩展。

## Phase 1

已创建：

- `AssetManager`
- `AssetProvider`
- `PhaserAssetProvider`

只提供基础注册和预加载框架。
