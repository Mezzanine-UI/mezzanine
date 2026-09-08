import type {
  CropperElementComponent,
  CropperPropsBase,
} from './cropper.types';

export interface CropperElementProps extends CropperPropsBase {
  /**
   * Override the element the drawing surface is rendered as.
   * @default 'canvas'
   */
  component?: CropperElementComponent;
}
