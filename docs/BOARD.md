# BOARD

Board 是 Merge Engine 的核心数据结构之一。

## 组成

```text
Board
├── Grid
├── Cell[]
└── Item references
```

## BoardConfig

```ts
interface BoardConfig {
  id: string;
  columns: number;
  rows: number;
  cellSize: number;
  originX?: number;
  originY?: number;
}
```

Phase 1 默认 Demo 使用 6x6，但 Engine 必须支持 5x5、7x7 和后续动态扩展。

## Cell

Cell 只保存通用状态：

- id
- position
- itemId
- locked

Cell 不知道物品题材，也不保存游戏经济数据。

## 操作

Board 当前提供：

- `getCell(position)`
- `getCells()`
- `canPlace(itemId, position)`
- `placeItem(itemId, position)`
- `removeItem(position)`
- `canMove(from, to)`
- `moveItem(from, to)`
- `canSwap(from, to)`
- `swapItems(from, to)`
- `canDrop(itemId, position)`
- `dropItem(itemId, position)`
- `serialize()`
- `loadSnapshot(snapshot)`
- `Board.deserialize(snapshot)`

## Policies

Board 通过策略接口控制基础行为：

- `PlacePolicy`
- `MovePolicy`
- `DropPolicy`
- `SwapPolicy`

默认策略只做最小规则：

- 空格可放。
- 空格可移入。
- 非空不可覆盖。
- 锁定 Cell 不可放入。
- 两个已占用且未锁定的 Cell 可以交换。

Swap 只做通用交换，不触发 Merge、不做动画，也不解释具体物品含义。

## Interaction Resolution

Phase 3 新增 `BoardInteractionController`，负责把一次 Drop 解析为：

- move。
- merge。
- swap。
- reject。
- noop。

Board 仍只负责数据操作。交互控制器协调 Board、ItemStore 和 MergeFlow，但不包含具体游戏规则。

同时新增 `BoardGestureController`，负责把 Cell 级输入串成 begin / move / end / cancel 生命周期。它不创建可视拖拽对象，后续 Phaser Scene 只需要把 pointer 事件转成 Cell position 后传入。

## Snapshot

Board snapshot 当前包含：

- board id。
- columns。
- rows。
- cellSize。
- originX。
- originY。
- cells。

Board snapshot 只保存 Board 状态，不保存完整 Item 数据。完整 Item 实例由 `ItemStore` snapshot 负责。

## 扩展计划

后续支持：

- Cell state tag。
- Board resize。
- Board region。
- 多 Board。
- 多层 Board。
- Board resize。

这些必须以配置或策略接口实现，不把具体游戏规则写入 Board。
