# TASKS

本文件记录 Reusable Merge Engine 的任务拆分。Village Merge 只作为 Demo 任务出现。

## Phase 1 - Workspace And Skeleton

- [x] 建立 pnpm workspace。
- [x] 创建 `packages/merge-engine`。
- [x] 创建 `games/village-merge`。
- [x] 配置 TypeScript。
- [x] 配置 Vite。
- [x] 配置 ESLint。
- [x] 配置 Prettier。
- [x] 编写 Engine 架构文档。
- [x] 编写 Engine API 文档。
- [x] 编写 Events、Board、Merge、Save、Asset、Scene、Plugin 文档。
- [x] 创建 Engine 类型定义。
- [x] 创建 EventBus。
- [x] 创建 Board、Grid、Cell 基础类。
- [x] 创建 Item、ItemRegistry 基础类。
- [x] 创建 MergeManager 基础类。
- [x] 创建 SpawnManager 基础类。
- [x] 创建 DragDropManager 和 InputManager 基础类。
- [x] 创建 AssetManager 和 AssetProvider 基础类。
- [x] 创建 AudioManager、AnimationManager、CameraManager、TweenManager 基础类。
- [x] 创建 SaveManager 基础类。
- [x] 创建 DebugManager 基础类。
- [x] 创建 EngineScene 和基础 Scene 类。
- [x] 创建 Plugin 注册壳。
- [x] 创建 Village Merge Demo `MainScene`。
- [x] Demo 显示空 Board 和空 UI 壳。
- [x] 安装依赖。
- [x] 通过 `pnpm typecheck`。
- [x] 通过 `pnpm build`。
- [x] 通过 `pnpm lint`。
- [x] 启动 Vite dev server。

## Phase 1 - Review Required

- [ ] Review Engine API 命名。
- [ ] Review Manager 边界。
- [ ] Review EventBus 事件列表。
- [ ] Review Board 数据模型。
- [ ] Review MergeRule 扩展方向。
- [ ] Decide 是否保留旧 quickstart 微信小游戏文件。
- [ ] Decide 是否迁移 root `assets/` 到 `games/village-merge/assets/`。

## Phase 2 - Core Board And Merge

- [x] ItemStore。
- [x] Board placement policy。
- [x] Move policy。
- [x] Swap policy。
- [x] Drop policy。
- [x] MergeRule config registration。
- [x] MergeRule JSON loader。
- [x] 普通二合一完整流程。
- [x] Board + Merge 单元测试。
- [x] Board snapshot 单元测试。
- [x] ItemStore snapshot 单元测试。
- [x] SaveManager 单元测试。
- [x] Phase 2 验证：`typecheck` / `build` / `lint` / `test`。

## Phase 3 - Interaction

- [x] Pointer 到 Cell 的基础转换接口。
- [x] Board gesture 编排：begin / move / end / cancel。
- [x] Demo 拖拽可视对象。
- [x] 自动吸附视觉表现。
- [x] 回弹所需的 reject/noop 事件。
- [x] 交换触发。
- [x] Merge 触发。
- [x] Drag 事件完整化。
- [x] Drop resolution：move / merge / swap / reject / noop。
- [x] Phase 3 交互逻辑单元测试。
- [x] Phase 3 gesture 单元测试。
- [x] First playable generic demo：移动 / 交换 / 合成。

- [x] 目标格高亮。
- [x] 非法 drop 回弹动画。
- [x] Merge 成功缩放/闪光。
- [x] Drop 预判高亮：move / merge / swap / reject / noop。
- [x] Merge 新物品即时落位后再播放反馈动画。
- [x] 最近事件文本。
- [x] Reset 按钮。
- [x] Debug 开关和基础状态文本。

## Phase 3 - Still Needed For Production Feel

- [x] 自动吸附动画。
- [x] 触摸反馈调优。
- [x] Debug 面板样式整理。

## Phase 4 - Presentation

- [ ] Animation preset。
- [ ] Merge animation。
- [ ] Fly animation。
- [ ] Scale animation。
- [ ] Bounce animation。
- [ ] Shake animation。
- [ ] AudioManager BGM / SFX 完整接口。
- [x] Debug overlay：Cell ID。
- [x] Debug overlay：Item ID。
- [x] Debug overlay：Merge Log。

## Phase 5 - Plugin And Save

- [ ] Plugin lifecycle。
- [ ] Plugin dependency declaration。
- [ ] Storage provider。
- [ ] Save migration。
- [ ] Dirty flag。
- [ ] Auto save scheduler。

## P0 - Demo Feel Hardening

- [x] 拖拽阈值，降低点击误触。
- [x] Mouse / touch 统一 pointer 输入。
- [x] Drop 目标锁定，防止飞入村庄的建筑被交换。
- [x] 目标格按 move / merge / swap / reject / noop 高亮。
- [x] 自动吸附、非法回弹、Merge pop、建筑飞入村庄。
- [x] Debug 显示 Cell ID、Item ID、Merge Log。

## P1 - Data Driven Game Content

- [x] `game-content.json` 管理 Board、Truck、ItemConfig、MergeRule、初始物品。
- [x] `asset-manifest.json` 管理资源加载。
- [x] Game 层通过 `ItemRegistry` 注册内容。
- [x] Game 层通过 `MergeRuleLoader` 注册规则。
- [x] Demo 不再硬编码 A/B/C。

## Phase 6 - Village Merge Demo

进入该阶段之前，Engine 核心交互必须先稳定。

- [x] Game item configs。
- [x] Game merge chain。
- [x] Game asset manifest。
- [x] Game UI。
- [x] Game save data。
- [x] Game-specific systems。

## P2 - Village MVP

- [x] 货车容量和补货。
- [x] 拆货按钮生成鸡蛋。
- [x] 6x6 棋盘。
- [x] 鸡蛋 -> 小鸡 -> 母鸡 -> 鸡舍。
- [x] 鸡舍作为最终物品离开棋盘。
- [x] 鸡舍进入村庄。
- [x] 空地变鸡舍。
- [x] Web 本地存档。
- [x] Game 层测试：TruckSystem。
- [x] Game 层测试：VillageState。
- [x] Game 层测试：内容配置一致性。
- [x] 自动化 MVP flow 测试：初始棋盘 + 货车货物可以完成鸡舍并进入村庄。

## P3 - WeChat Mini Game Prep

- [x] 微信运行时检测。
- [x] `wx.*StorageSync` 存档分支。
- [x] `wx.getSystemInfoSync()` 平台信息分支。
- [x] Touch action CSS 约束。
- [x] Vite 静态资源目录接入 root `assets/`。
- [x] `build:wechat` 构建命令。
- [x] `build:wechat` 复制 `game.json` 和 `project.config.json` 到 `dist/wechat`。
- [x] 微信构建输出单文件 `game.js`，避免当前阶段拆出 Phaser chunk。
- [x] 微信构建关闭 Vite modulepreload polyfill。
- [x] `games/village-merge/wechat/` 适配说明和配置壳。
- [ ] 正式 Phaser 微信 canvas adapter。
- [ ] 微信开发者工具真机预览。

## Repository Hygiene

- [x] 移除旧微信 quickstart 模板文件。
- [x] 移除旧根 `audio/`、`images/`、`js/`。
- [x] 移除根 `project.config.json`，避免再次提交真实 AppID。
- [x] 新增 Secrets 文档。
