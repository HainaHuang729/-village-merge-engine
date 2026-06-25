# CHANGELOG

所有重要变更记录在这里。

## 2026-06-25

### Added

- Phase 2 核心逻辑：`ItemStore`、Board policies、`MergeFlow`。
- Phase 2 核心逻辑：`SwapPolicy` 和 `MergeRuleLoader`。
- Phase 2 测试：Board、ItemStore、MergeFlow、MergeRuleLoader、SaveManager 共 14 个 Vitest 测试。
- Phase 3 交互逻辑：`BoardInteractionController`、完整 Drag 事件、Drop resolution。
- Phase 3 交互逻辑：`BoardGestureController`，提供 begin / move / end / cancel 纯逻辑编排。
- Phase 3 测试：DragDropManager、BoardInteractionController、BoardGestureController。
- First playable generic demo：`games/village-merge` 的 `MainScene` 支持拖拽、移动、交换和 `A+A=B` / `B+B=C` 合成。
- Demo 手感优化：目标格高亮、非法 drop 回弹、Merge 成功缩放/闪光、最近事件文本。
- Demo 手感优化：Drop 预判按 move / merge / swap / reject / noop 显示不同高亮颜色。
- Demo 工具优化：Reset 按钮、Debug 开关、当前 item/cell 状态文本。
- P0 手感：拖拽阈值、mouse/touch pointer 统一、目标格锁定、自动吸附和 Debug Merge Log。
- P1 数据驱动：新增 `games/village-merge/src/data/game-content.json` 和 `asset-manifest.json`。
- P2 Village MVP：新增货车拆货、鸡蛋链、鸡舍飞入村庄、村庄空地状态和本地存档。
- P3 微信准备：新增微信运行时检测、`wx.*StorageSync` 存档分支、`build:wechat` 和 `wechat/` 配置说明。
- Game 层测试：新增 TruckSystem、VillageState、内容配置一致性测试。
- 新增 root `test` 脚本和 `@merge-engine/core` Vitest 配置。
- 建立 pnpm workspace 文件。
- 新增 `packages/merge-engine` 可复用引擎包。
- 新增 `games/village-merge` Demo 包。
- 新增 TypeScript、Vite、ESLint、Prettier 配置。
- 新增 Engine 类型定义、Manager 壳、Provider 壳和基础 Scene。
- 新增 Demo `MainScene`，用于显示空 Board。
- 新增 Engine 架构文档：`ENGINE_ARCHITECTURE.md`、`ENGINE_API.md`、`EVENTS.md`、`BOARD.md`、`MERGE.md`、`SAVE.md`、`ASSET.md`、`SCENE.md`、`PLUGIN.md`、`ROADMAP.md`。
- 新增 Village Merge 愿景文档：`GAME_VISION.md`、`GAME_PILLARS.md`、`PLAYER_EXPERIENCE.md`、`NORTH_STAR.md`、`DESIGN_PRINCIPLES.md`、`DIFFERENTIATORS.md`、`LONG_TERM_GOALS.md`、`RISKS.md`。
- 建立 `docs/` 文档目录。
- 更新根 `README.md`，从微信 quickstart 示例说明改为 Village Merge 项目说明。
- 新增项目文档索引。
- 新增开发计划、路线图、玩法设计、循环设计、系统设计、Merge 系统、经济、村庄、美术、UI、任务、决策和 MVP 文档。
- 建立 `assets/` 资源目录结构。
- 生成统一 128x128 PNG 占位资源。
- 新增 `ASSET_GUIDE.md`、`ASSET_LIST.md`、`STYLE_GUIDE.md`。
- 新增 `AssetManager` 和资源 manifest。
- 新增占位资源生成脚本。

### Changed

- Board snapshot 增加 `cellSize`、`originX`、`originY`，支持 restore。
- `MergeManager` 暴露规则注册和查询接口。
- `DragDropManager` 支持 moved / ended / cancelled 生命周期事件。
- `InputManager` 增加 pointer 到 Cell 的转换接口。
- `BoardGestureController` 串联 DragDropManager 和 BoardInteractionController。
- `games/village-merge/src/scenes/MainScene.ts` 从空棋盘改为可玩通用 Engine Demo。
- `games/village-merge/src/scenes/MainScene.ts` 修正 Merge 后新物品从默认坐标飞入的问题，改为先落位再播放反馈。
- `games/village-merge/src/scenes/MainScene.ts` 从 generic A/B/C demo 升级为 Village Merge MVP 闭环。
- `games/village-merge/vite.config.ts` 增加 root `assets/` 静态资源接入、Phaser chunk 拆分和微信模式输出。
- Root `test` 脚本改为递归执行所有 workspace 包测试。
- `BOARD.md`、`MERGE.md`、`SAVE.md` 更新 Phase 2 状态。
- `EVENTS.md` 和 `TASKS.md` 更新 Phase 3 状态。
- `TASKS.md` 更新 Phase 2 完成状态。
- 将 `SYSTEM_DESIGN.md` 改为 Engine + Game 分层文档。
- 将 `MVP.md` 聚焦为鸡舍闭环和村庄生活反馈验证。
- 在 `docs/README.md` 增加权威阅读顺序。
- 将资源文档里的 `coin` 表述标记为历史占位，不作为核心经济方向。

### Notes

- 当前通过 `npx pnpm@9.15.0` 执行 workspace 脚本。
- 当前可玩内容仍是通用 Engine Demo，不包含 Village 专属玩法。
- Phaser 依赖按用户要求固定为 Phaser 3。
