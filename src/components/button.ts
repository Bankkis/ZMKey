import { Container, Graphics } from 'pixi.js';
import { Point2D } from '../interfaces';

export interface ButtonOptions {
  width: number;
  height: number;
  position: Point2D;
  borderWidth: number;
  borderColor: number;
  borderRadius: number;
  backgroundColor: number;
}

export class Button {
  private _graphics = new Graphics();
  constructor(private _options: ButtonOptions) {
    this._graphics.interactive = true;
    this._graphics.cursor = 'pointer';

    this._draw();
  }

  public appendTo(container: Container) {
    container.addChild(this._graphics);
  }

  private _draw(): void {
    this._graphics.clear();

    this._graphics.lineStyle({ width: this._options.borderWidth, color: this._options.borderColor });
    this._graphics.beginFill(this._options.backgroundColor);
    this._graphics.drawRoundedRect(
      this._options.position.x,
      this._options.position.y,
      this._options.width,
      this._options.height,
      this._options.borderRadius,
    );
    this._graphics.endFill();
  }
}
