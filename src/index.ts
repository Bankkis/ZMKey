import './style.scss';

import { Application } from 'pixi.js';
import { KeyCap } from './entities/keycap';
import { AppSettings } from './interfaces';

const appContainer = document.getElementById('pixi-container');
const app = new Application({
  backgroundColor: 0xffffff,
  resolution: window.devicePixelRatio,
  antialias: true,
  width: appContainer?.clientWidth,
  height: appContainer?.clientHeight,
});

const appSettings: AppSettings = {
  unitSize: 70,
  keyCapCornerRadius: 0.1,
};

if (appContainer) {
  appContainer.innerHTML = ''; // For development
}
appContainer?.appendChild(app.view);

new KeyCap(app, appSettings, { x: 1, y: 1 }, { width: 1, height: 1 });
new KeyCap(app, appSettings, { x: 2, y: 1 }, { width: 2, height: 1 });
new KeyCap(app, appSettings, { x: 1, y: 2 }, { width: 1, height: 2 });
new KeyCap(app, appSettings, { x: 2, y: 2 }, { width: 6.25, height: 1 });
