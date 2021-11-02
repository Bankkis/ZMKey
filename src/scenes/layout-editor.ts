import { Rectangle, Container, InteractionEvent, Point } from 'pixi.js';
import { KeyCap } from '../entities/keycap';
import { AppSettings, Point2D, ZMKeyApplication } from '../interfaces';
import { KLEKey, KLERows } from '../lib/kle';
import { layoutActions } from '../store';

export class LayoutEditor {
  private _container = new Container();
  private _layoutOffset: Point2D = { x: 1, y: 1 };
  private _keyCaps: KeyCap[] = [];
  private _kleFileInput: HTMLInputElement;
  private _fileReader = new FileReader();

  private _dragging = false;
  private _draggingData?: Point;

  constructor(private _app: ZMKeyApplication, private _appSettings: AppSettings) {
    this._container.hitArea = new Rectangle(0, 0, _app.view.width, _app.view.height);
    this._container.interactive = true;
    this._container.sortableChildren = true;

    this._app.stage.addChild(this._container);

    this._kleFileInput = document.getElementById('layout-editor__load-kle-input') as HTMLInputElement;

    this._handleAddButtonClick = this._handleAddButtonClick.bind(this);
    this._handleContainerClick = this._handleContainerClick.bind(this);
    this._handleLoadKLEClick = this._handleLoadKLEClick.bind(this);
    this._handleKLEFileChange = this._handleKLEFileChange.bind(this);
    this._parseKLEFile = this._parseKLEFile.bind(this);
    this._handleDragStart = this._handleDragStart.bind(this);
    this._handleDragEnd = this._handleDragEnd.bind(this);
    this._handleDragMove = this._handleDragMove.bind(this);

    this._initSubscriptions();
  }

  private _initSubscriptions(): void {
    document.getElementById('layout-editor__add-key')?.addEventListener('click', this._handleAddButtonClick);
    document.getElementById('layout-editor__load-kle')?.addEventListener('click', this._handleLoadKLEClick);
    this._kleFileInput.addEventListener('change', this._handleKLEFileChange)

    this._container.on('pointerdown', this._handleContainerClick);

    // drag container
    this._container
      .on('pointerdown', this._handleDragStart)
      .on('pointerup', this._handleDragEnd)
      .on('pointerupoutside', this._handleDragEnd)
      .on('pointermove', this._handleDragMove)
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
      new KeyCap({
        app: this._app,
        appSettings: this._appSettings,
        position: newPosition,
        size: { width: 1, height: 1 }
      }).appendTo(this._container),
    );
  }

  private _handleContainerClick(): void {
    if (this._app.state?.layout.value?.selectedKey) {
      layoutActions.selectKey(null);
    }
  }

  private _handleLoadKLEClick(): void {
    this._kleFileInput.click();
  }

  private _handleKLEFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      this._fileReader.onload = this._parseKLEFile;
      this._fileReader.readAsText(file);
    }
  }

  private _parseKLEFile(event: ProgressEvent): void {
    const reader = event.target as FileReader;
    if (reader.result) {
      const rows: KLERows = JSON.parse(reader.result as string);
      
      const keyState: KLEKey = { x: 0, y: 0, rx: 0, ry: 0, h: 1, w: 1 };
      const cluster: Point2D = { x: 0, y: 0 };
      for (const row of rows) {
        for (const key of row) {
          if (typeof key === 'object') {
            if ('rx' in key) {
              keyState.rx = cluster.x = key.rx;
              keyState.x = cluster.x;
              keyState.y = cluster.y;
            }

            if ('ry' in key) {
              keyState.ry = cluster.y = key.ry;
              keyState.x = cluster.x;
              keyState.y = cluster.y;
            }

            if (key.x) {
              keyState.x += key.x;
            }
            if (key.y) {
              keyState.y += key.y;
            }
          } else {
            const position = {
              x: keyState.x,
              y: keyState.y,
            };
            console.log(position);
            const size = {
              width: keyState.w || keyState.w2 || 1,
              height: keyState.h || keyState.h2 || 1,
            };
            const keyCap = new KeyCap({ app: this._app, appSettings: this._appSettings, position, size });

            this._keyCaps.push(keyCap.appendTo(this._container));
          }
        }
        ++keyState.y;
        keyState.x = keyState.rx;
      }
    }
  }

  private _handleDragStart(event: InteractionEvent): void {
    this._draggingData = event.data.getLocalPosition(this._container.parent);
    this._dragging = true;
  }

  private _handleDragEnd(): void {
    this._dragging = false;
    this._draggingData = undefined;
    this._container.cursor = 'default';
  }

  private _handleDragMove(event: InteractionEvent): void {
    if (this._dragging && this._draggingData) {
      this._container.cursor = 'grabbing';
      const cursorPosition = event.data.getLocalPosition(this._container.parent);

      const deltaX = cursorPosition.x - this._draggingData.x;
      const deltaY = cursorPosition.y - this._draggingData.y;

      for (const keyCap of this._keyCaps) {
        keyCap.moveBy({ x: deltaX, y: deltaY });
      }

      this._draggingData = cursorPosition;
    }
  }
}
