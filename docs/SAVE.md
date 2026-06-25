# SAVE

Save 系统分为 Engine Serialize 和 Game Save Data。

## Engine 负责

- 提供 `SaveEnvelope`。
- 提供 `serialize(data)`。
- 提供 `deserialize(snapshot)`。
- 提供版本号字段。

## Game 负责

- 决定存什么。
- 决定存在哪里。
- 决定什么时候存。
- 决定云存档或本地存档。
- 决定迁移旧版本数据。

## SaveEnvelope

```ts
interface SaveEnvelope<TData = unknown> {
  version: number;
  engineVersion: string;
  data: TData;
  savedAt: number;
}
```

## 原则

- Engine 不读取具体游戏字段。
- Engine 不强制存储后端。
- Board 可以序列化自身快照。
- Game 聚合 Engine snapshot 和 Game-specific data。

## 后续计划

- Save migration registry。
- Dirty flag。
- Auto save scheduler。
- Storage provider interface。
- Compression hook。

## Phase 2

已验证：

- `SaveManager.serialize(data)` 会生成 `SaveEnvelope`。
- `SaveManager.deserialize(envelope)` 会返回 Game-owned data。
- Board snapshot 和 ItemStore snapshot 已有单元测试。

未实现：

- Storage provider。
- Save migration。
- 自动保存。
