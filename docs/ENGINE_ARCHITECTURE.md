# ENGINE_ARCHITECTURE

Reusable Merge Engine 采用 Engine + Game 双层架构。

Engine 是完全独立的 Merge 游戏基础框架。Game 是具体产品实现。Village Merge 只是第一个 Demo，不是引擎的一部分。

## 目标

- 引擎可复用到不同 Merge 题材。
- 游戏内容完全数据驱动。
- 引擎不包含任何具体题材代码。
- 模块之间通过 EventBus 通信。
- Game 可以通过 Plugin 扩展引擎能力。

## Workspace

```text
project/
├── packages/
│   └── merge-engine/
├── games/
│   └── village-merge/
└── docs/
```

## Engine Layer

Engine 负责：

- Grid
- Board
- Cell
- Item
- Merge
- Spawn
- Drag
- Drop
- Animation
- Asset
- Audio
- Save
- EventBus
- ObjectPool
- GameLoop
- Input
- Camera
- Tween
- Utils
- Scene
- Plugin
- Debug

Engine 不允许知道任何具体游戏题材、资源名、经济模型或任务模型。

## Game Layer

Game 负责：

- 题材设定。
- 具体物品配置。
- Merge Chain 配置。
- 经济和任务。
- UI 和故事。
- 游戏存档结构。
- 具体 Scene 组合。

## 核心原则

- Low Coupling：模块只通过接口、事件和配置交互。
- High Cohesion：每个 Manager 只管理自己的领域。
- Data Driven：新增物品和合成规则优先改 JSON，不改源码。
- Plugin Friendly：Game 可以安装插件扩展行为。
- Testable：纯逻辑模块不依赖 Phaser Scene。
- Scalable：Board 尺寸、规则数量、Scene 数量都可扩展。

## 数据流

```text
Game Config
↓
Engine Manager
↓
EventBus
↓
Scene / UI / Plugin
↓
Save Serializer
```

## Phaser 边界

Phaser 是渲染、输入、声音、动画和 Scene 容器。Engine 的纯逻辑层必须尽量不依赖 Phaser。

允许依赖 Phaser：

- Scene
- AssetProvider
- AudioManager
- AnimationManager
- InputManager
- CameraManager
- TweenManager
- DebugManager

不应依赖 Phaser：

- Board 数据。
- Merge 规则匹配。
- Item 配置。
- Save 序列化。
- EventBus。

## Phase 1 范围

只完成：

- pnpm workspace。
- TypeScript 包结构。
- Engine 文档。
- 类型定义。
- Manager 基础类。
- Phaser 基础 Scene。
- Demo 空棋盘可运行。

不完成：

- 具体游戏逻辑。
- 复杂拖拽手感。
- 自动 Merge。
- 真实资源加载流程。
- 正式 UI。
- 经济、任务、建筑等 Game 功能。
