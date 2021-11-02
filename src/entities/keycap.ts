import { nanoid } from 'nanoid';
import { Container, Graphics } from 'pixi.js';
import { AppSettings, KeyCapSize, Point2D, ZMKeyApplication } from '../interfaces';
import { layoutActions } from '../store';

export interface KeyCapOptions {
  app: ZMKeyApplication;
  appSettings: AppSettings;
  position: Point2D;
  secondaryPosition?: Point2D;
  size: KeyCapSize;
  secondarySize?: KeyCapSize;
}

export class KeyCap {
  public id = nanoid();
  private _graphics = new Graphics();
  private _subscriptions: ((() => void) | undefined)[] = [];

  private _app: ZMKeyApplication;
  private _appSettings: AppSettings;
  private _position: Point2D;
  private _secondaryPosition?: Point2D;
  private _size: KeyCapSize;
  private _secondarySize?: KeyCapSize;

  public get position(): Point2D {
    return { ...this._position };
  }

  public get x(): number {
    return this._position.x;
  }

  public get y(): number {
    return this._position.y;
  }

  public get size(): KeyCapSize {
    return { ...this._size };
  }

  public get width(): number {
    return this._size.width;
  }

  public get height(): number {
    return this._size.height;
  }

  // customData - for development
  constructor(options: KeyCapOptions, public customData?: any) {
    this._app = options.app;
    this._appSettings = options.appSettings;
    this._position = options.position;
    this._size = options.size;
    this._secondaryPosition = options.secondaryPosition;
    this._secondarySize = options.secondarySize;

    this._graphics.interactive = true;
    this._graphics.cursor = 'pointer';

    this._graphics.on('pointerdown', this._onClick.bind(this));

    this._initSubscriptions();
    this._draw();
  }

  public moveBy(delta: Point2D): void {
    this._graphics.x += delta.x;
    this._graphics.y += delta.y;
  }

  private _initSubscriptions(): void {
    this._subscriptions.push(this._app.state?.layout.listen(() => this._draw()));
  }

  private _onClick(event: PointerEvent): void {
    layoutActions.selectKey(this.id);
    if (this.customData) {
      console.log(this.customData);
    }
    event.stopPropagation();
  }

  private _draw(): void {
    const unitSize = this._appSettings.unitSize;
    const cornerRadius = this._appSettings.keyCapCornerRadius;
    const isSelected = this._app.state?.layout.value?.selectedKey === this.id;

    const x = this._position.x * unitSize;
    const y = this._position.y * unitSize;
    const width = this._size.width * unitSize - 1; // 1 - is border width
    const height = this._size.height * unitSize - 1; // 1 - is border width

    this._graphics.clear();
    this._graphics.zIndex = isSelected ? 100 : 1;

    this._graphics.lineStyle({ width: 1, color: isSelected ? 0xe54803 : 0x000000 });
    this._graphics.beginFill(0xcccccc);
    this._graphics.drawRoundedRect(x, y, width, height, cornerRadius * unitSize);
    this._graphics.endFill();

    this._graphics.lineStyle({ width: 1, color: 0xb7b7b7 });
    this._graphics.beginFill(0xfcfcfc);
    this._graphics.drawRoundedRect(
      x + unitSize * 0.1,
      y + unitSize * 0.07,
      width - unitSize * 0.2,
      height - unitSize * 0.2,
      cornerRadius * unitSize * 0.8,
    );
    this._graphics.endFill();
  }

  public destroy(): void {
    this._app.stage.removeChild(this._graphics);
    this._destroySubscriptions();
  }

  private _destroySubscriptions(): void {
    for (const subscription of this._subscriptions) {
      subscription?.();
    }
  }

  public appendTo(container: Container): KeyCap {
    container.addChild(this._graphics);
    return this;
  }
}
