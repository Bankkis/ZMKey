import { Rectangle, Container } from 'pixi.js';
import { KeyCap } from '../entities/keycap';
import { AppSettings, Point2D, ZMKeyApplication } from '../interfaces';
import { layoutActions } from '../store';

export class LayoutEditor {
  private _container = new Container();
  private _layoutOffset: Point2D = { x: 1, y: 1 };
  private _keyCaps: KeyCap[] = [];

  constructor(private _app: ZMKeyApplication, private _appSettings: AppSettings) {
    this._container.hitArea = new Rectangle(0, 0, _app.view.width, _app.view.height);
    this._container.interactive = true;
    this._container.sortableChildren = true;

    this._app.stage.addChild(this._container);

    this._handleAddButtonClick = this._handleAddButtonClick.bind(this);
    this._handleContainerClick = this._handleContainerClick.bind(this);

    this._initSubscriptions();
  }

  private _initSubscriptions(): void {
    document.getElementById('layout-editor__add-key')?.addEventListener('click', this._handleAddButtonClick);
    document.getElementById('layout-editor__load-kle')?.addEventListener('click', this._handleAddButtonClick);

    this._container.on('pointerdown', this._handleContainerClick);
  }

  private _handleAddButtonClick(): void {
    let newPosition: Point2D;
    if (this._keyCaps.length) {
      const lastKeycap = this._keyCaps[this._keyCaps.length - 1];
      const newX = lastKeycap.position.x >= 15 ? this._layoutOffset.x : lastKeycap.position.x + lastKeycap.size.width;
      const newY = lastKeycap.position.x >= 15 ? lastKeycap.position.y + lastKeycap.size.height : lastKeycap.position.y;
      newPosition = { x: newX, y: newY };
    } else {
      newPosition = { ...this._layoutOffset };
    }

    this._keyCaps.push(
      new KeyCap(this._app, this._appSettings, newPosition, { width: 1, height: 1 }).appendTo(this._container),
    );
  }

  private _handleContainerClick(): void {
    if (this._app.state?.layout.value?.selectedKey) {
      layoutActions.selectKey(null);
    }
  }
}
