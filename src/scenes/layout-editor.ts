import { Rectangle, Container } from 'pixi.js';
import { KeyCap } from '../entities/keycap';
import { AppSettings, ZMKeyApplication } from '../interfaces';
import { layoutActions } from '../store';

export class LayoutEditor {
  private _container = new Container();
  private _keyCaps: KeyCap[] = [];

  constructor(private _app: ZMKeyApplication, private _appSettings: AppSettings) {
    this._container.hitArea = new Rectangle(0, 0, _app.view.width, _app.view.height);
    this._container.interactive = true;
    this._container.sortableChildren = true;

    this._app.stage.addChild(this._container);

    new KeyCap(this._app, this._appSettings, { x: 1, y: 1 }, { width: 1, height: 1 }).appendTo(this._container);
    new KeyCap(this._app, this._appSettings, { x: 2, y: 1 }, { width: 2, height: 1 }).appendTo(this._container);
    new KeyCap(this._app, this._appSettings, { x: 1, y: 2 }, { width: 1, height: 2 }).appendTo(this._container);
    new KeyCap(this._app, this._appSettings, { x: 2, y: 2 }, { width: 6.25, height: 1 }).appendTo(this._container);

    this._initSubscriptions();
  }

  private _initSubscriptions(): void {
    this._container.on('pointerdown', () => {
      if (this._app.state?.layout.value?.selectedKey) {
        layoutActions.selectKey(null);
      }
    });
  }
}
