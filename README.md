# Reusable Merge Engine

This project is a reusable TypeScript Merge game engine built with Phaser 3, Vite, and pnpm workspace.

Village Merge is only the first demo game. The engine must stay independent from any specific game theme, economy, story, item chain, or UI.

## Architecture

```text
project/
├── packages/
│   └── merge-engine/        # Reusable engine package
├── games/
│   └── village-merge/       # Demo game shell
├── docs/                    # Architecture and design docs
├── assets/                  # Existing placeholder assets, to be moved under game ownership later
└── tools/                   # Utility scripts
```

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

Note: `pnpm` is not currently installed on this machine. The workspace files are ready; dependency installation is the next verification step.

## Commands

After installing pnpm and dependencies:

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```

The demo game lives at:

```text
games/village-merge
```

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
