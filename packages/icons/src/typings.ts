export interface IconDefinition {
  name: string;
  definition: {
    svg?: {
      viewBox?: string;
      fill?: string;
    };
    title?: string;
    path?: {
      d?: string;
      fill?: string;
      fillRule?: 'nonzero' | 'evenodd' | 'inherit';
      clipRule?: 'nonzero' | 'evenodd' | 'inherit';
      stroke?: string;
      strokeWidth?: string | number;
      strokeLinecap?: 'inherit' | 'round' | 'butt' | 'square' | undefined;
      strokeLinejoin?: 'inherit' | 'round' | 'bevel' | 'miter' | undefined;
      transform?: string;
    };
  };
}
