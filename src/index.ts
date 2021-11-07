import './style.scss';

import { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { AppSettings, ZMKeyApplication } from './interfaces';
import { rootState } from './store';
import { LayoutEditor } from './scenes/layout-editor';

const appContainer = document.getElementById('pixi-container');

const app: ZMKeyApplication = new Application({
  backgroundColor: 0xffffff,
  resolution: window.devicePixelRatio,
  antialias: true,
  autoDensity: true,
  resizeTo: appContainer,
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
  // For development
  const nodes = document.getElementsByTagName("canvas");

  for (const node of Array.from(nodes)) {
      node.parentNode?.removeChild(node);
  }
}
appContainer?.appendChild(app.view);
(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });

new LayoutEditor(app, appSettings);
