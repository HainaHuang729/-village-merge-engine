# WeChat Mini Game Adapter Notes

This folder records the Phase 3 WeChat target shape for `games/village-merge`.

## Current Phase 3 Scope

- Phaser game uses pointer input that works for mouse and touch.
- Save storage uses `wx.*StorageSync` when a WeChat runtime is detected.
- Runtime info reads `wx.getSystemInfoSync()` when available.
- Vite copies the root `assets/` placeholder directory into the build output.
- `pnpm --filter @merge-engine/village-merge build:wechat` emits `dist/wechat/game.js`.

## Not Yet A Final WeChat Release

The current build is still Phaser + Vite first. A production WeChat package still needs a canvas/DOM adapter such as a Phaser-compatible WeChat adapter, final DevTools project wiring, subpackage policy, and device QA.

## Validation Target

For this phase, the target is not App Store quality. The target is that game code no longer assumes Web-only storage/input/resource paths, so the real WeChat adapter can be added without rewriting gameplay systems.
