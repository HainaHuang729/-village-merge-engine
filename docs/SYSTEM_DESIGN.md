# SYSTEM_DESIGN

本文件只定义系统边界，不定义具体玩法数值。

当前项目采用：

```text
Reusable Merge Engine
↓
Village Merge Game
```

Engine 是可复用框架。Village Merge 是第一个 Demo 和具体游戏。

## 当前技术方向

- TypeScript。
- Phaser 3。
- Vite。
- pnpm workspace。
- 微信小游戏优先，后续可移植 Web。
- Engine + Game 双层架构。

## 目录边界

```text
packages/
└── merge-engine/        # 通用 Merge 引擎

games/
└── village-merge/       # Village Merge Demo / Game

docs/                    # 架构、玩法、资源、愿景文档
```

## Engine 系统

Engine 只负责通用能力，不允许出现 Village、Truck、Chicken、Building、Economy、Quest 等具体游戏概念。

### Board / Grid / Cell

职责：

- 固定或可扩展网格。
- Cell 状态。
- 物品放置、移动、移除的基础数据结构。
- Board snapshot。

不负责：

- 鸡舍。
- 货车。
- 村庄。
- 任务。
- 经济。

### Item

职责：

- 通用 ItemConfig。
- 通用 ItemInstance。
- ItemRegistry。

Engine 只知道：

- `id`
- `name`
- `icon`
- `level`
- `mergeTo`
- `tags`
- `category`
- `animation`
- `data`

Engine 不解释这些字段的题材意义。

### Merge

职责：

- MergeRule 注册。
- MergeRule 匹配。
- Merge 成功 / 失败事件。

MergeRule 必须数据驱动：

```json
{
  "id": "a_a_to_b",
  "from": ["a", "a"],
  "to": "b"
}
```

### Spawn

职责：

- 根据通用 config id 创建 ItemInstance。
- 发出 `ITEM_CREATED` 事件。

Spawn 不知道物品从哪里来。货车、奖励、事件、任务都属于 Game。

### Drag / Drop / Input

职责：

- Pointer 输入封装。
- Drag 状态。
- Drop intent。
- Drag 事件。

具体手感策略可以由 Game 配置或 Plugin 扩展。

### Asset

职责：

- AssetManifest。
- AssetProvider。
- Phaser Loader 封装。

禁止：

- Game 代码散落 `load.image()`。
- Engine 写具体游戏资源路径。

### Audio / Animation / Camera / Tween

职责：

- Phaser 能力统一入口。
- 通用动画请求。
- 通用音频播放接口。
- 通用镜头和 Tween 包装。

不负责：

- 某个建筑完成时应该播什么具体效果。
- 某个村庄事件的表现逻辑。

### Save

职责：

- Serialize。
- Deserialize。
- SaveEnvelope。

Game 自己决定存档内容、存档位置和版本迁移策略。

### EventBus

职责：

- Engine 系统通信。
- Game 监听 Engine 事件。
- Plugin 扩展事件响应。

所有跨系统行为优先走事件，不做 Manager 间硬依赖。

### Debug

职责：

- Grid Overlay。
- FPS。
- Cell ID。
- Item ID。
- Merge Log。

Debug 能力服务开发，不进入游戏设计核心。

## Village Merge Game 系统

以下全部属于 `games/village-merge`，不得写进 Engine。

### 货车 / 物流

职责：

- 货车补货。
- 拆货入口。
- 今天送来了什么。
- 货车如何连接外部世界。

当前实现：

- `games/village-merge/src/systems/TruckSystem.ts`。
- 只生成 MVP 链的起点物品。
- 支持容量、补货间隔、拆 1 件货和 snapshot。

设计要求：

- 货车不是体力条。
- 货车必须服务“今天村里发生了什么”。

### 村庄

职责：

- 村庄地点。
- 空地和建筑状态。
- 人物行为。
- 村庄声音。
- 村庄小事件。
- 建筑建成后的生活反馈。

村庄是 Village Merge 的真正成长系统。

当前实现：

- `games/village-merge/src/systems/VillageState.ts`。
- 只记录建筑集合和完成时间。
- 当前只支持空地 -> 鸡舍。

### 建筑

职责：

- 具体建筑配置。
- 建筑需求。
- 建筑完成后的村庄变化。

建筑不应默认是资源机器。

### Merge Chain

职责：

- 具体物品链配置。
- 具体 MergeRule JSON。
- 具体图标和表现。

MVP 只允许：

```text
鸡蛋 -> 小鸡 -> 母鸡 -> 鸡舍
```

当前实现：

- `games/village-merge/src/data/game-content.json`。
- 具体物品和 MergeRule 只存在 Game 层。

### Economy

职责：

- Village Merge 自己的资源概念。
- 消耗与回收。
- 防经济膨胀。

经济系统必须从属于村庄变化，不得成为核心留存理由。

### Quest / Event

职责：

- 村庄小事件。
- 轻量引导。
- 人物反馈。

任务不能把村民降级成订单发布器。

### UI

职责：

- Game-specific 信息展示。
- 货车状态。
- 棋盘状态。
- 村庄状态。
- 事件提示。

UI 不能绕过 Game 系统直接修改 Engine 状态。

## 数据流

推荐数据流：

```text
Game Config
↓
Engine Manager / Game System
↓
EventBus
↓
Scene / UI / Plugin
↓
Game Save Data
```

## 依赖方向

允许：

```text
Game -> Engine
Game -> Game Config
Game -> Game UI
```

禁止：

```text
Engine -> Game
Engine -> Village-specific config
Engine -> Game UI
Engine -> Economy / Quest / Building
```

## 当前优先级

1. 先保持 Engine 可复用。
2. 再验证 Village Merge 的鸡舍闭环。
3. 最后才扩展经济、事件和长期内容。

任何让 Engine 认识具体游戏题材的设计都应拒绝。
