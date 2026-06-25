# ASSET_GUIDE

本文件定义 Village Merge 的资源目录、命名、尺寸、格式和替换规则。

## 当前阶段

阶段：Asset First + Placeholder First

目标：

- 建立稳定资源目录。
- 使用统一占位图验证资源链路。
- 保证未来正式美术可以批量替换。
- 禁止代码直接依赖具体图片路径。

## 目录结构

```text
assets/
├── backgrounds/   # 背景图与背景瓦片
├── board/         # 棋盘格、棋盘状态
├── truck/         # 货车
├── crates/        # 箱子
├── items/         # Merge 物品
├── buildings/     # 建筑图标或建筑资源
├── village/       # 村庄地块与村庄状态
├── ui/            # UI 图标与按钮资源
├── effects/       # 动画帧或简单特效图
├── particles/     # 粒子贴图
├── icons/         # 通用图标
├── audio/         # 音效
├── fonts/         # 字体
└── placeholder/   # 通用缺省资源
```

## 图片规范

统一规范：

- 格式：PNG。
- 尺寸：128x128。
- 背景：透明。
- 光照方向：左上方。
- 阴影方向：右下方。
- 描边：统一深色圆润描边。
- 风格：温暖、高饱和、圆润、治愈、卡通。

禁止：

- 同类资源尺寸不一致。
- 带不透明背景的物品图。
- 同一系列资源使用不同描边粗细。
- 图片路径直接写进玩法代码。
- 正式资源替换时改文件语义。

## 命名规范

文件名使用小写 snake_case：

```text
item_egg.png
crate_cardboard.png
building_chicken_coop.png
ui_village_button.png
effect_merge_success_01.png
```

Asset ID 使用 dot case：

```text
item.egg
crate.cardboard
building.chickenCoop
ui.villageButton
animation.mergeSuccess
```

规则：

- 文件名描述资源本身。
- Asset ID 描述代码语义。
- 代码只使用 Asset ID。
- 文件路径集中写在 Game 自己的 asset manifest，并通过 `packages/merge-engine` 的 `AssetManager` 预加载。

## AssetManager 规则

所有资源必须通过 `AssetManager` 访问：

```ts
assetManager.getImagePath('item.egg')
assetManager.getAnimationFramePaths('animation.mergeSuccess')
```

禁止在业务代码中写：

```ts
'assets/items/item_egg.png'
```

原因：

- 正式美术替换时只改 manifest。
- Web 和微信小游戏路径适配更简单。
- 可以集中做预加载、版本号和缺失资源兜底。

## MVP 资源范围

第一版只允许一条 Merge 链：

```text
鸡蛋 -> 小鸡 -> 母鸡 -> 鸡舍
```

第一版箱子：

- 普通纸箱。
- 木箱。
- 神秘箱。

第一版建筑：

- 鸡舍。

第一版村庄：

- 空地。
- 鸡舍。

第一版动画接口：

- Merge 成功。
- 建筑飞入村庄。
- 光点飞出。

说明：早期占位资源中存在 `coin` 命名，这是历史占位命名。当前设计方向不把金币作为核心资源，后续正式资源应改为“暖色光点 / 感谢反馈 / 完成反馈”等中性表现。

## 替换流程

1. 在 `ASSET_LIST.md` 中确认 Asset Name 和 AI Prompt。
2. 批量生成同风格 128x128 透明 PNG。
3. 用同名文件替换 `assets/` 下的占位图。
4. 如果新增文件，先更新对应 Game 的 asset manifest。
5. 检查所有图片尺寸和透明背景。
6. 再进入游戏内预览。

## 检查命令

可用以下命令检查图片尺寸：

```bash
find assets -name '*.png' -print0 | xargs -0 file
```

所有 PNG 都应显示 `128 x 128`。
