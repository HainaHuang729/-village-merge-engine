# WeChat Mini Game Adapter Notes

This folder records the Phase 3 WeChat target shape for `games/village-merge`.

## Current Phase 3 Scope

- Phaser game uses pointer input that works for mouse and touch.
- Save storage uses `wx.*StorageSync` when a WeChat runtime is detected.
- Runtime info reads `wx.getSystemInfoSync()` when available.
- Vite copies the root `assets/` placeholder directory into the build output.
- `pnpm --filter @merge-engine/village-merge build:wechat` emits `dist/wechat/game.js`.
- `build:wechat` copies `game.json` and `project.config.json` into `dist/wechat`.
- The shared config uses `touristappid`; real AppID belongs in local private DevTools config.
- `src/platform/wechat-adapter.ts` installs a minimal canvas/DOM shim before Phaser starts.

## Not Yet A Final WeChat Release

The current build is still Phaser + Vite first. A project-local minimal adapter is now included, but a production WeChat package still needs DevTools validation, real-device QA, and possibly a fuller adapter if Phaser touches APIs that the minimal shim does not cover.

Do not replace it with a random community adapter until it has been verified against Phaser 3.90 and the target WeChat base library. The adapter must provide the browser APIs Phaser touches, including canvas, image/audio loading, timing, event dispatch, and enough DOM shims for the bundled runtime.

## Validation Target

For this phase, the target is not App Store quality. The target is that game code no longer assumes Web-only storage/input/resource paths, so the real WeChat adapter can be added without rewriting gameplay systems.
