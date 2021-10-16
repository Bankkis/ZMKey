import './style.scss';

import { Application } from 'pixi.js';
import { AppSettings, ZMKeyApplication } from './interfaces';
import { rootState } from './store';
import { LayoutEditor } from './scenes/layout-editor';

const appContainer = document.getElementById('pixi-container');
const app: ZMKeyApplication = new Application({
  backgroundColor: 0xffffff,
  resolution: window.devicePixelRatio,
  antialias: true,
  width: appContainer?.clientWidth,
  height: appContainer?.clientHeight,
});
app.state = rootState;
app.stage.sortableChildren = true;

const appSettings: AppSettings = {
  unitSize: 70,
  keyCapCornerRadius: 0.1,
};

if (appContainer) {
  appContainer.innerHTML = ''; // For development
}
appContainer?.appendChild(app.view);

new LayoutEditor(app, appSettings);
