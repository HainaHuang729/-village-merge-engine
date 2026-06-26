# Village Merge Engine

Reusable TypeScript Merge game engine built with Phaser 3, Vite, and pnpm workspace.

Village Merge is the first playable demo game. The engine must stay independent from any specific game theme, economy, story, item chain, or UI.

## Architecture

```text
project/
├── packages/
│   └── merge-engine/        # Reusable engine package
├── games/
│   └── village-merge/       # Demo game shell
├── docs/                    # Architecture and design docs
├── assets/                  # Placeholder assets served by the demo build
└── tools/                   # Utility scripts
```

The legacy WeChat quickstart files have been removed from the repository. New work should use the workspace entry points above.

## Engine Owns

- Grid, Board, Cell
- Item model and registry
- Merge rule matching
- Spawn
- Drag and drop shell
- Animation, Asset, Audio managers
- Save serialization shell
- EventBus
- ObjectPool
- GameLoop
- Input, Camera, Tween wrappers
- Scene base classes
- Plugin and Debug shells

## Game Owns

- Concrete item configs
- Merge chains
- Economy
- Events
- Quests
- UI
- Story
- Save data shape
- Any specific theme logic

## Tech Stack

- TypeScript
- Phaser 3
- Vite
- pnpm workspace
- ESLint
- Prettier

## Commands

```bash
npx pnpm@9.15.0 install
npx pnpm@9.15.0 dev
npx pnpm@9.15.0 typecheck
npx pnpm@9.15.0 lint
npx pnpm@9.15.0 test
npx pnpm@9.15.0 build
npx pnpm@9.15.0 --filter @merge-engine/village-merge build:wechat
```

The local playable demo runs at:

```text
http://localhost:5173/
```

Current MVP loop:

```text
Truck cargo -> Open cargo -> Egg -> Chick -> Chicken -> Chicken Coop -> Village
```

## Secrets

Do not commit a real WeChat AppID or AppSecret.

- Committed WeChat config uses `touristappid`.
- Personal WeChat DevTools settings belong in ignored local files such as `project.private.config.json`.
- See [SECRETS.md](docs/SECRETS.md).

## Documentation

Start here:

- [ENGINE_ARCHITECTURE.md](docs/ENGINE_ARCHITECTURE.md)
- [ENGINE_API.md](docs/ENGINE_API.md)
- [EVENTS.md](docs/EVENTS.md)
- [BOARD.md](docs/BOARD.md)
- [MERGE.md](docs/MERGE.md)
- [SAVE.md](docs/SAVE.md)
- [ASSET.md](docs/ASSET.md)
- [SCENE.md](docs/SCENE.md)
- [PLUGIN.md](docs/PLUGIN.md)
- [ROADMAP.md](docs/ROADMAP.md)
- [SECRETS.md](docs/SECRETS.md)
