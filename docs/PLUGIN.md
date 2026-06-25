# PLUGIN

Plugin 用于让 Game 或上层包扩展 Engine，而不是直接修改 Engine。

## Plugin 接口

```ts
interface EnginePlugin {
  id: string;
  install(): void;
  uninstall?(): void;
}
```

## 用途

- 注册自定义输入策略。
- 注册特殊 Merge 策略。
- 注册 Debug 面板。
- 注册 Asset Provider。
- 注册 Save Provider。

## 原则

- Plugin 不能依赖具体 Engine 内部私有字段。
- Plugin 通过公开 API 和 EventBus 工作。
- Plugin 可以属于 Game 包。
- 通用 Plugin 后续可以提升到 Engine 包。

## Phase 1

只提供 `MergeEnginePlugin` 注册壳。

后续再补：

- 生命周期。
- 依赖声明。
- 插件配置。
- 插件顺序。
- 插件能力权限。
