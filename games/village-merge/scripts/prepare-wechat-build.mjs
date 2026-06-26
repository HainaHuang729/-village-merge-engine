import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist/wechat');
const sourceConfig = resolve(root, 'wechat/project.config.json');
const sourceGameConfig = resolve(root, 'wechat/game.json');

await mkdir(dist, { recursive: true });
await copyFile(sourceConfig, resolve(dist, 'project.config.json'));
await copyFile(sourceGameConfig, resolve(dist, 'game.json'));
await writeFile(
  resolve(dist, 'WECHAT_RUNTIME_NOTES.txt'),
  [
    'This build includes a minimal project-local WeChat canvas/DOM adapter bootstrap.',
    'The adapter is installed before Phaser starts, but it still needs WeChat DevTools and real-device validation.',
    'Keep real AppID values in local private DevTools config, not in this repository.',
    '',
  ].join('\n'),
);
