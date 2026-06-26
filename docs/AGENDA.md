# AGENDA

本文件记录当前开发计划。每完成一步后更新。

## 当前阶段

阶段：Village Merge P3 骨架

目标：在 Reusable Merge Engine 上完成第一版可玩闭环，并准备微信小游戏适配骨架。

状态：P0-P3 第一轮已实现，等待 Review 和真机适配决策。

## 本轮计划

1. P0：补齐拖拽阈值、触摸输入、吸附/回弹表现和 Debug 信息。
2. P1：把物品、MergeRule、资源清单改为数据驱动。
3. P2：实现鸡蛋 -> 小鸡 -> 母鸡 -> 鸡舍的最小 Village 闭环。
4. P3：加入微信运行时存档、平台信息、触摸约束、构建出口和适配说明。
5. 跑完整验证。

## 已完成

- 读取现有项目结构。
- 确认当前代码仍是微信小游戏 quickstart 示例。
- 建立文档目录。
- 完成项目入口文档和设计文档初稿。
- 建立资源目录。
- 完成 MVP 占位资源生成。
- 完成资源规范、资源清单和视觉风格文档。
- 建立 `packages/merge-engine`。
- 建立 `games/village-merge`。
- 新增 Engine 文档。
- 新增 Engine 类型定义。
- 新增 Manager、Provider 和 Scene 基类。
- 新增 Demo 空棋盘。
- 新增 Village Merge 愿景文档、体验支柱、North Star、风险分析。
- 清理文档口径：Engine 与 Game 分层、MVP 鸡舍生活反馈、金币占位命名说明。
- 完成 first playable generic demo。
- 完成数据驱动 `game-content.json` 和 `asset-manifest.json`。
- 完成货车补货与拆货入口。
- 完成鸡蛋 -> 小鸡 -> 母鸡 -> 鸡舍链。
- 完成鸡舍飞入村庄并永久保存。
- 完成 Web / 微信运行时存档抽象。
- 完成 `build:wechat` 构建出口和微信适配说明。
- 完成 Game 层 TruckSystem、VillageState、内容配置一致性测试。
- 完成旧 quickstart 清理。
- 完成自动化 MVP flow 测试和 Playtest 文档。

## 下一步

等待 Review。建议下一轮进入：

1. 决定微信正式适配器方案。
2. 微信开发者工具真机预览。
3. 手玩 Review：10 分钟内能否自然完成鸡舍。
4. 根据 Review 调整拆货爽感和村庄反馈。
5. Decide 是否迁移 root `assets/` 到 `games/village-merge/assets/`。

## 暂不处理

- 不做第二条 Merge 链。
- 不做金币经济。
- 不做任务系统。
- 不做正式微信发布包。
- 不做正式美术资源生产。
- 不制作正式美术。
- 不下载网络资源。
