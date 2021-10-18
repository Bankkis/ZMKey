import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { createNanoEvents } from 'nanoevents';
import { Point2D, ZMKeyApplication } from '../interfaces';
import featherIcons from 'feather-icons';
import { SVGScene } from '@pixi-essentials/svg';
import { stringToHtml } from '../lib/stringToHtml';

export interface IconButtonOptions {
  radius?: number;
  position: Point2D;
  padding: number;
  borderWidth: number;
  borderColor: number;
  backgroundColor: number;
  hoverBackgroundColor: number;
  icon: string;
  iconSize: number;
  tooltip?: string;
  tooltipSize?: number;
}

interface Events {
  click: () => void;
}

const initialOptions: IconButtonOptions = {
  position: { x: 0, y: 0 },
  padding: 0,
  borderWidth: 0,
  borderColor: 0x000000,
  backgroundColor: 0xefefef,
  hoverBackgroundColor: 0xdddddd,
  iconSize: 26,
  icon: '',
  tooltipSize: 16,
};

export class IconButton {
  private _graphics = new Graphics();
  private _icon!: SVGScene;
  private _tooltip!: Text;
  private _options: IconButtonOptions;
  private _emitter = createNanoEvents<Events>();
  private _hover = false;
  private _expandProgress = 0;
  private _tooltipMargin = 5;

  constructor(_options: Partial<IconButtonOptions>, private _app?: ZMKeyApplication) {
    this._options = { ...initialOptions, ..._options };
    this._graphics.interactive = true;
    this._graphics.cursor = 'pointer';

    this._initIcon();
    this._initTooltip();
    this._draw();
    this._initSubscriptions();
  }

  private _initIcon(): void {
    const svgIcon = featherIcons.icons[this._options.icon];
    if (!svgIcon) {
      console.warn(`Invalid icon name: ${this._options.icon}`);
      return;
    }
    const parsedIcon = stringToHtml(svgIcon.toSvg());
    if (!parsedIcon) {
      console.warn(`Unable to parse icon content: ${this._options.icon}`);
      return;
    }
    this._icon = new SVGScene(parsedIcon as SVGSVGElement, {});
    this._graphics.addChild(this._icon);

    this._icon.height = this._icon.width = this._options.iconSize;
    this._icon.position.set(
      this._options.position.x + this._options.padding,
      this._options.position.y + this._options.padding,
    );
  }

  private _initTooltip(): void {
    if (this._options.tooltip) {
      const style = new TextStyle({
        fontSize: this._options.tooltipSize,
      });

      this._tooltip = new Text(this._options.tooltip, style);
      this._graphics.addChild(this._tooltip);

      this._tooltip.visible = false;
      this._tooltip.position.set(
        this._options.position.x + this._icon.width + this._tooltipMargin + this._options.padding,
        this._options.position.y + (this._icon.height - this._tooltip.height) / 2 + this._options.padding,
      );
    }
  }

  private _initSubscriptions(): void {
    this._graphics
      .on('pointerover', () => {
        this._hover = true;
        if (this._options.tooltip) {
          this._expandTooltip();
        }
        this._draw();
      })
      .on('pointerout', () => {
        this._hover = false;
        if (this._options.tooltip) {
          this._collapseTooltip();
        }
        this._draw();
      })
      .on('pointerdown', () => {
        this._emitter.emit('click');
      });
  }

  private _expandTooltip(): void {
    // TODO animation using pixi ticker
    if (!this._app) {
      this._expandProgress = 1;
      if (this._tooltip) {
        this._tooltip.visible = true;
      }
      this._draw();
    }
  }

  private _collapseTooltip(): void {
    // TODO animation using pixi ticker
    if (!this._app) {
      this._expandProgress = 0;
      if (this._tooltip) {
        this._tooltip.visible = false;
      }
      this._draw();
    }
  }

  public appendTo(container: Container): IconButton {
    container.addChild(this._graphics);
    return this;
  }

  private _draw(): void {
    this._graphics.clear();

    const radius = this._options.iconSize / 2 + this._options.padding;
    const tooltipWidth = this._tooltip?.width || 0;

    this._graphics.lineStyle(this._options.borderWidth, this._options.borderColor);
    this._graphics.beginFill(this._hover ? this._options.hoverBackgroundColor : this._options.backgroundColor);

    const startPosition: Point2D = { x: this._options.position.x + radius, y: this._options.position.y + radius };
    const endPosition: Point2D = {
      x:
        this._options.position.x +
        radius +
        tooltipWidth * this._expandProgress +
        (this._tooltip.visible ? this._tooltipMargin * 2 : 0),
      y: this._options.position.y + radius,
    };

    this._graphics.arc(startPosition.x, startPosition.y, radius, Math.PI / 2, Math.PI * 1.5);
    this._graphics.arc(endPosition.x, endPosition.y, radius, Math.PI * 1.5, Math.PI / 2);

    this._graphics.endFill();
  }

  public on<E extends keyof Events>(event: E, callback: Events[E]) {
    return this._emitter.on(event, callback);
  }

  public destroy(): void {
    this._graphics.destroy();
  }
}
