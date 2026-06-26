# ROADMAP

本 Roadmap 以 Reusable Merge Engine 为主线。Village Merge 只是 Demo。

## Phase 1 - Workspace And Skeleton

目标：完成架构、文档、基础类型和可运行 Demo。

范围：

- pnpm workspace。
- TypeScript。
- Phaser 3。
- Vite Demo。
- Engine 包结构。
- Game Demo 包结构。
- Engine 文档。
- 类型定义。
- Manager 基础壳。
- 空 Board Demo。

不做：

- 具体游戏玩法。
- 完整拖拽。
- 完整 Merge 动画。
- 经济、任务、建筑。
- 微信小游戏适配。

## Phase 2 - Core Board And Merge

目标：完成纯逻辑可测试闭环。

范围：

- Board 操作策略。
- ItemStore。
- MergeRule 加载。
- 普通二合一。
- Move / Swap / Drop 策略。
- 基础单元测试。

## Phase 3 - Interaction

目标：完成可玩的拖拽手感。

范围：

- Pointer 输入。
- 拖拽对象。
- 吸附。
- 回弹。
- 交换。
- Merge 触发。
- 输入事件。

当前状态：

- 已完成 first playable generic demo。
- 已支持拖拽、移动、交换、普通二合一。
- 已完成第一版吸附、回弹、合成反馈、触摸输入和 Debug 信息。

## Phase 4 - Presentation

目标：统一表现层。

范围：

- AnimationManager 完整实现。
- Tween presets。
- AudioManager 完整实现。
- Asset manifest 加载。
- Debug overlay。

## Phase 5 - Save And Plugin

目标：让 Engine 可嵌入多个游戏。

范围：

- Save provider。
- Migration。
- Plugin 生命周期。
- 配置校验。
- 多 Scene 模板。

## Phase 6 - Game Demo

目标：把 Village Merge 作为 Engine Demo。

范围：

- 一条 Merge 链。
- 货车作为 Game 系统。
- 村庄作为 Game 系统。
- Game UI。
- Game save data。

所有具体内容必须留在 `games/village-merge`。

当前状态：

- 已完成第一版 Village MVP。
- 已完成一条鸡舍 Merge 链。
- 已完成货车拆货和村庄交付。
- 已完成 Web / 微信存档分支。
- 已完成自动化 MVP flow 测试。

## Phase 7 - WeChat Adapter Review

目标：把当前 Vite Demo 推进到微信开发者工具可预览。

范围：

- 选择并接入 Phaser 微信 canvas adapter。
- 验证 `dist/wechat/game.js` 的入口策略。
- 真机测试触摸、音频、存档和资源加载。
- 评估首包体积和分包策略。

当前状态：

- `build:wechat` 会输出 `dist/wechat/game.js` 并复制微信配置。
- 项目内最小 canvas/DOM adapter 已接入。
- 下一步需要微信开发者工具验证，记录 Phaser 仍触达的缺失 API。
