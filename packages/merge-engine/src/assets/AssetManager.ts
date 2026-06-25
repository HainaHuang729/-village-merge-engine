import { PhaserAssetProvider } from './AssetProvider';
import type Phaser from 'phaser';
import type { AssetProvider } from './AssetProvider';
import type { AssetConfig, AssetManifest } from '../types/assets';

export class AssetManager {
  private readonly assets = new Map<string, AssetConfig>();

  constructor(private readonly provider: AssetProvider = new PhaserAssetProvider()) {}

  register(asset: AssetConfig): void {
    this.assets.set(asset.id, asset);
  }

  registerManifest(manifest: AssetManifest): void {
    manifest.assets.forEach((asset) => this.register(asset));
  }

  get(id: string): AssetConfig | undefined {
    return this.assets.get(id);
  }

  preload(loader: Phaser.Loader.LoaderPlugin): void {
    this.assets.forEach((asset) => this.provider.preload(loader, asset));
  }
}
