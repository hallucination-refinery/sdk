/**
 * Draw a rounded rectangle with the specified parameters
 */
export declare function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor: string): void;
/**
 * Wrap and draw text within the specified width
 */
export declare function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number;
/**
 * Draw an icon based on the node kind
 */
export declare function drawIcon(ctx: CanvasRenderingContext2D, kind: 'reference' | 'concept' | 'prospect' | undefined, x: number, y: number, size: number): void;
/**
 * Draw the footer section with icon and label
 */
export declare function drawFooter(ctx: CanvasRenderingContext2D, kind: 'reference' | 'concept' | 'prospect' | undefined, canvasWidth: number, canvasHeight: number): void;
/**
 * Calculate available content height (excluding footer and gaps)
 */
export declare function getContentHeight(canvasHeight: number): number;
