export type KLERows = KLERow[];

export type KLERow = (KLEKey | string)[]

export interface KLEKey {
    // Primary key rectangle
    x?: number; // absolute x position of the key in keyboard units
    y?: number; // absolute y position of the key in keyboard units
    h?: number; // height of the key, in keyboard units
    w?: number; // width of the key, in keyboard units

    // Secondary key rectangle (used to define oddly-shaped keys)
    x2?: number; // relative to x position of the key in keyboard units
    y2?: number; // relative to y position of the key in keyboard units
    h2?: number; // height of the key, in keyboard units
    w2?: number; // width of the key, in keyboard units

    t?: string; // legend text colors separated by \n

    rx?: number; // x position of center of rotation for the key
    ry?: number; // y position of center of rotation for the key
    r?: number; // specifies the angle the key is rotated (about the center of rotation)

    n?: boolean; // homing bar
    a?: number; // legends align
}
