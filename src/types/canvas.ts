export type CanvasElementType = 'text' | 'sticker' | 'photo' | 'shape';

export type MaskShape = 'none' | 'circle' | 'oval' | 'rounded' | 'arch';

export type AnimationEffect =
  | 'none'
  | 'fadeIn'
  | 'rise'
  | 'gentleScale'
  | 'drift'
  | 'sway'
  | 'sparkle';

export interface CanvasElementStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
  maskShape?: MaskShape;
  borderRadius?: number;
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
  shapeType?: 'rectangle' | 'circle' | 'rounded';
  fill?: string;
}

export interface CanvasElementAnimation {
  effect: AnimationEffect;
  duration?: number;
  delay?: number;
}

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  name: string;
  // Content: text string for 'text', URL/SVG path for 'sticker' or 'photo'
  content: string;
  // Normalized 0-100 or absolute canvas units (standard artboard is 480 x 680)
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  zIndex: number;
  opacity: number;
  isLocked?: boolean;
  styleProps?: CanvasElementStyle;
  animation?: CanvasElementAnimation;
  accessibilityLabel?: string;
  originalAssetUrl?: string; // Preserves uncropped photo for re-cropping
}

export interface CanvasDocument {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  elements: CanvasElement[];
}
