import { Container, Graphics, Text } from 'pixi.js';
import { Point2D } from '../interfaces';

export interface RoundButtonOptions {
  radius?: number;
  position: Point2D;
  padding: number;
  borderWidth: number;
  borderColor: number;
  backgroundColor: number;
  text: string;
}

const initialOptions: RoundButtonOptions = {
  position: { x: 0, y: 0 },
  padding: 0,
  borderWidth: 0,
  borderColor: 0x000000,
  backgroundColor: 0xefefef,
  text: '',
};

export class RoundButton {
  private _graphics = new Graphics();
  private _options: RoundButtonOptions;
  constructor(_options: Partial<RoundButtonOptions>) {
    this._options = { ...initialOptions, ..._options };
    this._graphics.interactive = true;
    this._graphics.cursor = 'pointer';

    this._draw();
  }

  public appendTo(container: Container) {
    container.addChild(this._graphics);
  }

  private _draw(): void {
    this._graphics.clear();

    const text = new Text(this._options.text);
    const radius = this._options.radius
      ? this._options.radius + this._options.padding
      : Math.max(text.width, text.height) / 2 + this._options.padding;
    text.x = this._options.position.x + Math.round(radius * 2 - text.width) / 2;
    text.y = this._options.position.y + Math.round(radius * 2 - text.height) / 2;

    this._graphics.addChild(text);

    this._graphics.lineStyle(this._options.borderWidth, this._options.borderColor);
    this._graphics.beginFill(this._options.backgroundColor);
    this._graphics.drawCircle(this._options.position.x + radius, this._options.position.y + radius, radius);
    this._graphics.endFill();
  }
}
