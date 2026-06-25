# EVENTS

EventBus 是 Engine 内部和 Game 扩展之间的通信中心。

## 原则

- Manager 之间不直接互相调用。
- 事件名统一大写 snake case。
- 事件 payload 必须有类型定义。
- Game 可以监听 Engine 事件。
- Game 可以发布自己的事件，但不得污染 Engine 事件命名空间。

## Engine Events

| Event | 说明 |
|---|---|
| `ITEM_CREATED` | Item 实例创建 |
| `ITEM_REMOVED` | Item 从 Board 或状态中移除 |
| `ITEM_MOVED` | Item 从一个 Cell 移到另一个 Cell |
| `ITEM_SWAPPED` | 两个 Cell 的 Item 交换 |
| `MERGE_SUCCESS` | Merge 成功 |
| `MERGE_FAILED` | Merge 失败 |
| `CELL_CHANGED` | Cell 内容或状态变化 |
| `DRAG_STARTED` | 拖拽开始 |
| `DRAG_MOVED` | 拖拽位置更新 |
| `DRAG_ENDED` | 拖拽结束 |
| `DRAG_CANCELLED` | 拖拽取消 |
| `DROP_ACCEPTED` | Drop 被解析为有效行为 |
| `DROP_REJECTED` | Drop 被拒绝，需要回弹或保持原状 |
| `BOARD_SERIALIZED` | Board 被序列化 |
| `BOARD_DESERIALIZED` | Board 被反序列化 |

## Drop Resolution

Phase 3 增加通用 Drop 解析结果：

- `move`：拖到空格，移动。
- `merge`：拖到可合成目标，合成。
- `swap`：拖到不可合成但可交换目标，交换。
- `reject`：非法 Drop。
- `noop`：拖回原格，无操作。

视觉吸附、回弹、动画表现不在 EventBus 内实现，由 Scene 或 Presentation 层监听事件后表现。

## Gesture Flow

Phase 3 增加 `BoardGestureController`，用于把 Cell 级输入编排成完整交互：

```text
beginDragAt
↓
moveDragTo
↓
endDragAt
↓
Drop Resolution
```

该控制器仍是纯逻辑层，不创建 Phaser 可视对象。

## 命名扩展

Game 自定义事件建议加前缀：

```text
GAME:...
UI:...
CONTENT:...
```

Engine 事件不应使用具体题材词。

## 事件 Payload

事件 payload 类型定义在：

```text
packages/merge-engine/src/types/events.ts
```

新增事件必须同步更新：

- `EngineEvent`
- `EngineEventMap`
- 对应文档
