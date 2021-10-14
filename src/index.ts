import { Application, Graphics, settings } from 'pixi.js';

const app = new Application({ backgroundColor: 0xFFFFFF, resolution: window.devicePixelRatio, antialias: true });
const appContainer = document.getElementById('app-container');
const unitSize = 70;
const keyCapRadius = 0.1;

appContainer?.appendChild(app.view);

// TODO move code below into separate file
type KEYCAP_SIZES = 1 | 1.25 | 1.5 | 1.75 | 2 | 2.25 | 6 | 6.25 | 6.5;
interface Point2D {
    x: number;
    y: number;
}
interface KeyCapSize {
    width: KEYCAP_SIZES;
    height: KEYCAP_SIZES;
}
class KeyCap {    
    private _app: Application;
    private _position: Point2D;
    private _size: KeyCapSize;
    
    private _graphics = new Graphics();

    constructor(public app: Application, position: Point2D, size: KeyCapSize) {
        this._app = app;
        this._position = { ...position };
        this._size = size;

        this._app.stage.addChild(this._graphics);
        this._draw();
    }

    private _draw(): void {
        const x = this._position.x * unitSize;
        const y = this._position.y * unitSize;
        const width = this._size.width * unitSize;
        const height = this._size.height * unitSize;

        this._graphics.lineStyle({ width: 1, color: 0x000000 });
        this._graphics.beginFill(0xCCCCCC);
        this._graphics.drawRoundedRect(x, y, width, height, keyCapRadius * unitSize);
        this._graphics.endFill();

        this._graphics.lineStyle({ width: 1, color: 0xB7B7B7 });
        this._graphics.beginFill(0xFCFCFC);
        this._graphics.drawRoundedRect(x + unitSize * 0.1, y + unitSize * 0.07, width - unitSize * 0.2, height - unitSize * 0.2, keyCapRadius * unitSize * 0.8);
        this._graphics.endFill();
    }

    public destroy(): void {
        this._app.stage.removeChild(this._graphics);
    }
}

const key1 = new KeyCap(app, { x: 1, y: 1 }, { width: 1, height: 1 });
const key2 = new KeyCap(app, { x: 2, y: 1 }, { width: 2, height: 1 });
const key3 = new KeyCap(app, { x: 1, y: 2 }, { width: 1, height: 2 });
const key4 = new KeyCap(app, { x: 2, y: 2 }, { width: 6.25, height: 1 });