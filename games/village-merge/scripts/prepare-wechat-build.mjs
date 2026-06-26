import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist/wechat');
const sourceConfig = resolve(root, 'wechat/project.config.json');
const sourceGameConfig = resolve(root, 'wechat/game.json');
const localAppId = process.env.WECHAT_APPID?.trim();

await mkdir(dist, { recursive: true });
await copyFile(sourceGameConfig, resolve(dist, 'game.json'));

const projectConfig = JSON.parse(await readFile(sourceConfig, 'utf8'));

if (localAppId) {
  projectConfig.appid = localAppId;
}

await writeFile(resolve(dist, 'project.config.json'), `${JSON.stringify(projectConfig, null, 2)}\n`);
await writeFile(
  resolve(dist, 'WECHAT_RUNTIME_NOTES.txt'),
  [
    'This build includes a minimal project-local WeChat canvas/DOM adapter bootstrap.',
    'The adapter is installed before Phaser starts, but it still needs WeChat DevTools and real-device validation.',
    localAppId
      ? 'A local WECHAT_APPID environment value was injected into this ignored dist build.'
      : 'No WECHAT_APPID environment value was provided; dist/wechat/project.config.json keeps touristappid.',
    'Keep real AppID values in ignored local output or private DevTools config, not in this repository.',
    '',
  ].join('\n'),
);
