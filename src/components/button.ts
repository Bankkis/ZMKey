import { Container, Graphics, Text } from 'pixi.js';
import { Point2D } from '../interfaces';

export interface ButtonOptions {
  width?: number;
  height?: number;
  position: Point2D;
  padding: Point2D;
  borderWidth: number;
  borderColor: number;
  borderRadius: number;
  backgroundColor: number;
  text: string;
}

const initialOptions: ButtonOptions = {
  position: { x: 0, y: 0 },
  padding: { x: 0, y: 0 },
  borderWidth: 0,
  borderColor: 0x000000,
  borderRadius: 0,
  backgroundColor: 0xefefef,
  text: '',
};

export class Button {
  private _graphics = new Graphics();
  private _options: ButtonOptions;
  constructor(_options: Partial<ButtonOptions>) {
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
    const width = (this._options.width || text.width) + this._options.padding.x;
    const height = (this._options.height || text.height) + this._options.padding.y;
    text.x = this._options.position.x + this._options.padding.x / 2;
    text.y = this._options.position.y + this._options.padding.y / 2;

    this._graphics.addChild(text);

    this._graphics.lineStyle({ width: this._options.borderWidth, color: this._options.borderColor });
    this._graphics.beginFill(this._options.backgroundColor);
    this._graphics.drawRoundedRect(
      this._options.position.x,
      this._options.position.y,
      width,
      height,
      this._options.borderRadius,
    );
    this._graphics.endFill();
  }
}
