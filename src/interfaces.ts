import { Application } from 'pixi.js';
import { RootState } from './store';

export type KEYCAP_SIZES = 1 | 1.25 | 1.5 | 1.75 | 2 | 2.25 | 6 | 6.25 | 6.5;

export interface Point2D {
  x: number;
  y: number;
}

export interface KeyCapSize {
  width: KEYCAP_SIZES;
  height: KEYCAP_SIZES;
}

export interface AppSettings {
  /** Size of 1u in px */
  unitSize: number;
  /** Keycap corner radius in relative to unitSize */
  keyCapCornerRadius: number;
}

export type ZMKeyApplication = Application & { state?: RootState };
