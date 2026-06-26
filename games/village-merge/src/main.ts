import './style.css';
import { installWechatAdapter } from './platform/wechat-adapter';

installWechatAdapter();
void import('./bootstrap').then(({ startGame }) => startGame());
