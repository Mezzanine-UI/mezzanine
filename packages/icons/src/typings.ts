export interface IconDefinition {
  name: string;
  definition: {
    svg?: {
      viewBox?: string;
    };
    title?: string;
    path?: {
      d?: string;
      fill?: string;
      fillRule?: 'nonzero' | 'evenodd' | 'inherit';
      stroke?: string;
      strokeWidth?: string | number;
      transform?: string;
    };
  };
}
