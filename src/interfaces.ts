import { Application } from 'pixi.js';
import { RootState } from './store';

export interface Point2D {
  x: number;
  y: number;
}

export interface KeyCapSize {
  width: number;
  height: number;
}

export interface AppSettings {
  /** Size of 1u in px */
  unitSize: number;
  /** Keycap corner radius in relative to unitSize */
  keyCapCornerRadius: number;
}

export type ZMKeyApplication = Application & { state?: RootState };
