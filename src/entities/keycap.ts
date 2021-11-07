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
  pivot?: Point2D;
  angle?: number;
}

export class KeyCap {
  public id = nanoid();
  private _graphics = new Graphics();
  private _pivotGraphics = new Graphics();
  private _subscriptions: ((() => void) | undefined)[] = [];

  private _app: ZMKeyApplication;
  private _appSettings: AppSettings;
  private _position: Point2D;
  private _secondaryPosition?: Point2D;
  private _size: KeyCapSize;
  private _secondarySize?: KeyCapSize;
  private _pivot?: Point2D;
  private _angle: number;

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
    this._pivot = options.pivot;
    this._angle = options.angle;

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
    // for development
    if (this.customData) {
      console.log(this.customData, this);
    }
    event.stopPropagation();
  }

  private _draw(): void {
    const unitSize = this._appSettings.unitSize;
    const cornerRadius = this._appSettings.keyCapCornerRadius;
    const isSelected = this._app.state?.layout.value?.selectedKey === this.id;

    this._graphics.pivot.set(
      (this._pivot.x - this._position.x) * unitSize,
      (this._pivot.y - this._position.y) * unitSize
    );

    this._graphics.position.x = this._position.x * unitSize + this._graphics.pivot.x;
    this._graphics.position.y = this._position.y * unitSize + this._graphics.pivot.y;
    const width = this._size.width * unitSize - 1; // 1 - is border width
    const height = this._size.height * unitSize - 1; // 1 - is border width

    this._pivotGraphics.clear();
    this._graphics.clear();

    this._pivotGraphics.zIndex = this._graphics.zIndex = isSelected ? 100 : 1;

    this._pivotGraphics.beginFill(0xff0000);
    this._pivotGraphics.position.set(this._pivot.x * unitSize, this._pivot.y * unitSize);
    this._pivotGraphics.drawCircle(0, 0, 5)
    this._pivotGraphics.endFill()
    this._pivotGraphics.visible = isSelected;

    this._graphics.angle = this._angle;

    this._graphics.lineStyle({ width: 1, color: isSelected ? 0xe54803 : 0x000000 });
    this._graphics.beginFill(0xcccccc);
    this._graphics.drawRoundedRect(0, 0, width, height, cornerRadius * unitSize);
    this._graphics.endFill();

    this._graphics.lineStyle({ width: 1, color: 0xb7b7b7 });
    this._graphics.beginFill(0xfcfcfc);
    this._graphics.drawRoundedRect(
      unitSize * 0.1,
      unitSize * 0.07,
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
    container.addChild(this._pivotGraphics);
    return this;
  }
}
