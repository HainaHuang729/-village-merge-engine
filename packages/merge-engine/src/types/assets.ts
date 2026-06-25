export type AssetKind = 'image' | 'spritesheet' | 'audio' | 'json' | 'font';

export interface AssetConfig {
  id: string;
  kind: AssetKind;
  path: string;
  frameWidth?: number;
  frameHeight?: number;
  data?: Record<string, unknown>;
}

export interface AssetManifest {
  assets: AssetConfig[];
}
