# MERGE

Merge 系统必须数据驱动。

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

普通二合一：

```json
{
  "id": "a_a_to_b",
  "from": ["a", "a"],
  "to": "b"
}
```

未来三合一：

```json
{
  "id": "a_a_a_to_b",
  "from": ["a", "a", "a"],
  "to": "b",
  "minCount": 3
}
```

## Phase 1

只实现规则注册、规则匹配和 Merge 成功/失败事件。

不实现：

- 复杂动画时序。
- 自动 Merge。
- 延迟 Merge。
- 3/4/5 Merge 的完整 Board 交互。

## Phase 2

已实现：

- `ItemStore` 管理 ItemInstance。
- `MergeManager` 支持规则注册、规则匹配、成功/失败事件。
- `MergeRuleLoader` 支持从 JSON 字符串或配置对象加载规则。
- `MergeFlow` 支持从两个 Board Cell 触发普通二合一。
- Merge 成功后消耗两个 ItemInstance。
- Merge 成功后创建新 ItemInstance。
- 新 Item 放回目标 Cell。
- 失败时保持 Board 和 ItemStore 不变。

尚未实现：

- 3/4/5 Merge 的 Board 选择流程。
- 自动 Merge。
- 延迟 Merge。
- 动画时序。

## Phase 3

已实现：

- `BoardInteractionController` 在 Drop 时优先判断可 Merge。
- 可 Merge 时调用 `MergeFlow.mergeCells()`。
- 不可 Merge 但可 Swap 时执行 Board swap。
- 非法 Drop 发出 reject 结果，供表现层回弹。

表现层仍未实现：

- 视觉拖拽对象。
- 自动吸附动画。
- 回弹动画。
- Merge 动画时序。

## 后续能力

- 普通 Merge。
- 链式 Merge。
- 自动 Merge。
- 延迟 Merge。
- 动画 Merge。
- 3 Merge。
- 4 Merge。
- 5 Merge。

这些能力都必须围绕 `MergeRule` 扩展。
