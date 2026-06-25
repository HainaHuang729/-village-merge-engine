export interface AudioOptions {
  loop?: boolean;
  volume?: number;
}

export interface AudioState {
  muted: boolean;
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
}
