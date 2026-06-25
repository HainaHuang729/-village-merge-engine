import type Phaser from 'phaser';
import type { AssetConfig } from '../types/assets';

export interface AssetProvider {
  preload(loader: Phaser.Loader.LoaderPlugin, asset: AssetConfig): void;
}

export class PhaserAssetProvider implements AssetProvider {
  preload(loader: Phaser.Loader.LoaderPlugin, asset: AssetConfig): void {
    if (asset.kind === 'image') {
      loader.image(asset.id, asset.path);
      return;
    }
    if (asset.kind === 'spritesheet') {
      loader.spritesheet(asset.id, asset.path, {
        frameWidth: asset.frameWidth ?? 0,
        frameHeight: asset.frameHeight ?? 0,
      });
      return;
    }
    if (asset.kind === 'audio') {
      loader.audio(asset.id, asset.path);
      return;
    }
    if (asset.kind === 'json') {
      loader.json(asset.id, asset.path);
    }
  }
}
