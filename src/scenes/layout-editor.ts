import { Rectangle, Container } from 'pixi.js';
import { IconButton } from '../components/icon-button';
import { KeyCap } from '../entities/keycap';
import { AppSettings, Point2D, ZMKeyApplication } from '../interfaces';
import { layoutActions } from '../store';

export class LayoutEditor {
  private _container = new Container();
  private _layoutOffset: Point2D = { x: 1, y: 1 };
  private _keyCaps: KeyCap[] = [];

  /** UI Components */
  private _addButton!: IconButton;
  private _uploadKLEButton!: IconButton;

  constructor(private _app: ZMKeyApplication, private _appSettings: AppSettings) {
    this._container.hitArea = new Rectangle(0, 0, _app.view.width, _app.view.height);
    this._container.interactive = true;
    this._container.sortableChildren = true;

    this._app.stage.addChild(this._container);

    this._initUI();
    this._initSubscriptions();
  }

  private _initUI(): void {
    this._addButton = new IconButton({
      icon: 'plus',
      tooltip: 'Add Key',
      position: { x: 20, y: 20 },
      padding: 3,
    }).appendTo(this._container);

    this._uploadKLEButton = new IconButton({
      icon: 'download',
      tooltip: 'Load KLE layout',
      position: { x: 20, y: 60 },
      iconSize: 22,
      padding: 5,
    }).appendTo(this._container);
  }

  private _initSubscriptions(): void {
    this._container.on('pointerdown', this._handleContainerClick.bind(this));
    this._addButton.on('click', this._handleAddButtonClick.bind(this));
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
