import { Application, Graphics } from 'pixi.js';
import { AppSettings, KeyCapSize, Point2D } from '../interfaces';

export class KeyCap {
  private _graphics = new Graphics();

  constructor(
    private _app: Application,
    private _appSettings: AppSettings,
    private _position: Point2D,
    private _size: KeyCapSize,
  ) {
    this._app.stage.addChild(this._graphics);
    this._draw();
  }

  private _draw(): void {
    const unitSize = this._appSettings.unitSize;
    const cornerRadius = this._appSettings.keyCapCornerRadius;

    const x = this._position.x * unitSize;
    const y = this._position.y * unitSize;
    const width = this._size.width * unitSize;
    const height = this._size.height * unitSize;

    this._graphics.lineStyle({ width: 1, color: 0x000000 });
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
  }
}
