# Reusable Merge Engine 文档索引

本文档目录用于记录 Reusable Merge Engine 架构，以及 Village Merge Demo 的产品设计、资源规范和任务拆分。

当前架构原则：

- Engine + Game 双层架构。
- Engine 完全独立，不包含具体游戏题材。
- Game 通过配置、Scene 和 Plugin 使用 Engine。
- 所有核心能力数据驱动。
- 先文档，后架构，再 MVP。

## 权威阅读顺序

后续开发优先按以下顺序判断设计是否成立：

1. [NORTH_STAR.md](NORTH_STAR.md)：最高判断标准。
2. [GAME_VISION.md](GAME_VISION.md)：Village Merge 的灵魂和长期方向。
3. [GAME_PILLARS.md](GAME_PILLARS.md)：不可妥协的体验支柱。
4. [RISKS.md](RISKS.md)：主动规避普通 Merge / 经营 / 放置化。
5. [ENGINE_ARCHITECTURE.md](ENGINE_ARCHITECTURE.md)：Engine + Game 技术边界。
6. [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)：当前系统分层。
7. [MVP.md](MVP.md)：鸡舍闭环验证范围。

如果旧文档和以上文档冲突，以上文档优先。

## 文档清单

### Engine

- [ENGINE_ARCHITECTURE.md](ENGINE_ARCHITECTURE.md)：Engine + Game 架构
- [ENGINE_API.md](ENGINE_API.md)：Phase 1 API 边界
- [EVENTS.md](EVENTS.md)：EventBus 和事件规范
- [BOARD.md](BOARD.md)：Grid、Board、Cell 设计
- [MERGE.md](MERGE.md)：MergeRule 和合成系统设计
- [SAVE.md](SAVE.md)：序列化和存档边界
- [ASSET.md](ASSET.md)：AssetManager 和资源加载规范
- [SCENE.md](SCENE.md)：Phaser Scene 基类和 Debug
- [PLUGIN.md](PLUGIN.md)：Plugin 扩展机制
- [ROADMAP.md](ROADMAP.md)：Engine 路线图

### Game Demo And Content

- [AGENDA.md](AGENDA.md)：当前开发计划与阶段状态
- [NORTH_STAR.md](NORTH_STAR.md)：项目 North Star 和删除标准
- [GAME_VISION.md](GAME_VISION.md)：项目愿景和 One Sentence Vision
- [GAME_PILLARS.md](GAME_PILLARS.md)：游戏体验支柱
- [PLAYER_EXPERIENCE.md](PLAYER_EXPERIENCE.md)：玩家日常、周、月体验
- [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)：设计原则
- [DIFFERENTIATORS.md](DIFFERENTIATORS.md)：差异化和竞品边界
- [LONG_TERM_GOALS.md](LONG_TERM_GOALS.md)：长期内容目标
- [RISKS.md](RISKS.md)：失败风险和删除建议
- [GAME_DESIGN.md](GAME_DESIGN.md)：核心体验、爽点、玩家目标
- [GAME_LOOP.md](GAME_LOOP.md)：主循环、日常循环、系统循环
- [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)：系统边界与技术架构
- [MERGE_SYSTEM.md](MERGE_SYSTEM.md)：棋盘、拖动、Merge、最终物品规则
- [ECONOMY.md](ECONOMY.md)：资源、节奏、经济约束
- [VILLAGE.md](VILLAGE.md)：村庄成长与建筑规则
- [ART_STYLE.md](ART_STYLE.md)：美术方向与资产原则
- [UI_STYLE.md](UI_STYLE.md)：界面风格与交互原则
- [ASSET_GUIDE.md](ASSET_GUIDE.md)：资源命名、尺寸、格式、目录和替换规范
- [ASSET_LIST.md](ASSET_LIST.md)：当前资源与后续资源清单，含 AI Prompt
- [STYLE_GUIDE.md](STYLE_GUIDE.md)：整体视觉、色彩、线条、动画和 UI 风格
- [TASKS.md](TASKS.md)：任务拆分与优先级
- [CHANGELOG.md](CHANGELOG.md)：变更记录
- [DECISIONS.md](DECISIONS.md)：关键决策记录
- [MVP.md](MVP.md)：第一版必须做与坚决不做

## 当前状态

Phase 1 已建立 workspace、Engine 架构文档、基础类型、Manager 壳和 Village Merge Demo 壳。下一步需要 Review 后再补依赖安装和更完整的交互实现。
