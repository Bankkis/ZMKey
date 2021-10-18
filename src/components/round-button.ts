import { Container, Graphics, Text } from 'pixi.js';
import { createNanoEvents, Emitter } from "nanoevents"
import { Point2D } from '../interfaces';

export interface RoundButtonOptions {
  radius?: number;
  position: Point2D;
  padding: number;
  borderWidth: number;
  borderColor: number;
  backgroundColor: number;
  hoverBackgroundColor: number;
  text: string;
}

interface Events {
  click: () => void
}

const initialOptions: RoundButtonOptions = {
  position: { x: 0, y: 0 },
  padding: 0,
  borderWidth: 0,
  borderColor: 0x000000,
  backgroundColor: 0xefefef,
  hoverBackgroundColor: 0xdddddd,
  text: '',
};

export class RoundButton {
  private _graphics = new Graphics();
  private _options: RoundButtonOptions;
  private _emitter = createNanoEvents<Events>();
  private _hover = false;

  constructor(_options: Partial<RoundButtonOptions>) {
    this._options = { ...initialOptions, ..._options };
    this._graphics.interactive = true;
    this._graphics.cursor = 'pointer';

    this._draw();
    this._initSubscriptions();
  }

  private _initSubscriptions(): void {
    this._graphics.on('pointerover', () => {
      this._hover = true;
      this._draw();
    }).on('pointerout', () => {
      this._hover = false;
      this._draw();
    }).on('pointerdown', () => {
      this._emitter.emit('click');
    });
  }

  public appendTo(container: Container): RoundButton {
    container.addChild(this._graphics);
    return this;
  }

  private _draw(): void {
    this._graphics.clear();
    this._graphics.removeChildren();

    const text = new Text(this._options.text);
    const radius = this._options.radius
      ? this._options.radius + this._options.padding
      : Math.max(text.width, text.height) / 2 + this._options.padding;
    text.x = this._options.position.x + Math.round(radius * 2 - text.width) / 2;
    text.y = this._options.position.y + Math.round(radius * 2 - text.height) / 2;

    this._graphics.addChild(text);

    this._graphics.lineStyle(this._options.borderWidth, this._options.borderColor);
    this._graphics.beginFill(this._hover ? this._options.hoverBackgroundColor : this._options.backgroundColor);
    this._graphics.drawCircle(this._options.position.x + radius, this._options.position.y + radius, radius);
    this._graphics.endFill();
  }
  
  public on<E extends keyof Events>(event: E, callback: Events[E]) {
    return this._emitter.on(event, callback)
  }

  public destroy(): void {
    this._graphics.destroy();
  }
}
