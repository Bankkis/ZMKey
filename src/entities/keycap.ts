import { nanoid } from 'nanoid';
import { Container, Graphics } from 'pixi.js';
import { AppSettings, KeyCapSize, Point2D, ZMKeyApplication } from '../interfaces';
import { layoutActions } from '../store';

export class KeyCap {
  public id = nanoid();
  private _graphics = new Graphics();
  private _subscriptions: ((() => void) | undefined)[] = [];

  public get position(): Point2D {
    return { ...this._position };
  }

  public get size(): KeyCapSize {
    return { ...this._size };
  }

  constructor(
    private _app: ZMKeyApplication,
    private _appSettings: AppSettings,
    private _position: Point2D,
    private _size: KeyCapSize,
  ) {
    this._graphics.interactive = true;
    this._graphics.cursor = 'pointer';

    this._graphics.on('pointerdown', this._onClick.bind(this));

    this._initSubscriptions();
    this._draw();
  }

  private _initSubscriptions(): void {
    this._subscriptions.push(this._app.state?.layout.listen(() => this._draw()));
  }

  private _onClick(event: PointerEvent): void {
    layoutActions.selectKey(this.id);
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
