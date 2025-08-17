export declare const RATIOS: {
    readonly '1:1': readonly [1, 1];
    readonly '16:9': readonly [number, 1];
    readonly '2:3': readonly [number, 1];
    readonly '4:3': readonly [number, 1];
    readonly '21:9': readonly [number, 1];
};
export declare const NODE_PALETTE: {
    readonly text: {
        readonly base: "#F9F9F9";
        readonly border: "#CCCCCC";
        readonly textColor: "#000000";
    };
    readonly image: {
        readonly base: "#FFFFFF";
        readonly border: "#888888";
        readonly textColor: "#000000";
    };
    readonly longDocument: {
        readonly base: "#FFF9E6";
        readonly border: "#E6D4A3";
        readonly textColor: "#5C4B1A";
    };
    readonly pureThought: {
        readonly base: "#E6F3FF";
        readonly border: "#A3C9E6";
        readonly textColor: "#1A4B5C";
    };
};
export declare const TIER_STROKES: readonly ["#BBBBBB", "#6AA8F7", "#FFB347", "#E46DD3"];
export declare const LOD_OPACITY: {
    readonly Far: 0.6;
    readonly Mid: 1;
    readonly Close: 1;
    readonly Selected: 1;
};
export declare const TIER_BORDER_WIDTH: readonly [2, 3, 4, 5];
export type AspectRatio = keyof typeof RATIOS;
export type NodeTypeKey = keyof typeof NODE_PALETTE;
export type TierLevel = 0 | 1 | 2 | 3;
export type LODLevel = keyof typeof LOD_OPACITY;
export declare const GLOBAL_SCALE = 1.5;
export declare const CARD: {
    readonly PAD: number;
    readonly RADIUS: number;
    readonly GAP: number;
    readonly FOOTER: number;
    readonly ICON: number;
    readonly ICON_STROKE: number;
    readonly FOOTER_FONT: number;
    readonly TITLE_FONT: number;
    readonly TITLE_LH: number;
    readonly QUOTE_FONT_SQ: number;
    readonly QUOTE_FONT_BN: number;
    readonly QUOTE_LH_SQ: number;
    readonly QUOTE_LH_BN: number;
    readonly FG: "#1E1E1E";
    readonly BG: {
        readonly reference: "#FDE6DC";
        readonly concept: "#FFF4E0";
        readonly prospect: "#EBE0D7";
    };
    readonly SQUARE: {
        readonly width: number;
        readonly height: number;
    };
    readonly BANNER: {
        readonly width: number;
        readonly height: number;
    };
    readonly PORTRAIT: {
        readonly width: number;
        readonly height: number;
    };
    readonly STANDARD: {
        readonly width: number;
        readonly height: number;
    };
    readonly ULTRAWIDE: {
        readonly width: number;
        readonly height: number;
    };
};
