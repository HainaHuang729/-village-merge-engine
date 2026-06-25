import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { getRuntimeInfo } from './platform/wechat';
import './style.css';

const runtime = getRuntimeInfo();
const designWidth = 390;
const designHeight = 720;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#f2e6c8',
  width: designWidth,
  height: designHeight,
  scene: [MainScene],
  input: {
    activePointers: runtime.platform === 'wechat' ? 4 : 3,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
