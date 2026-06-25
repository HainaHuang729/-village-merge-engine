import assetManifestJson from '../data/asset-manifest.json';
import gameContentJson from '../data/game-content.json';
import type {
  AssetManifest,
  BoardConfig,
  BoardPosition,
  ItemConfig,
  MergeRule,
} from '@merge-engine/core';

export interface ItemVisualConfig {
  color: number;
  label: string;
  textColor: string;
}

export interface TruckConfig {
  capacity: number;
  initialCargo: number;
  replenishIntervalMs: number;
  spawnItemId: string;
}

export interface VillageConfig {
  targetBuildingId: string;
}

export interface InitialItemConfig {
  configId: string;
  position: BoardPosition;
}

export interface GameContentManifest {
  board: BoardConfig;
  truck: TruckConfig;
  village: VillageConfig;
  items: ItemConfig[];
  visuals: Record<string, ItemVisualConfig>;
  mergeRules: MergeRule[];
  initialItems: InitialItemConfig[];
}

export const GAME_CONTENT = gameContentJson as GameContentManifest;
export const ASSET_MANIFEST = assetManifestJson as AssetManifest;
