import type { DescriptionOrientation } from '@mezzanine-ui/core/description';
import type { DescriptionTitleProps } from './description-title.types';

export interface DescriptionProps
  extends Omit<DescriptionTitleProps, 'children'> {
  /**
   * Define the layout direction between the title and the content
   * @default 'horizontal'
   */
  orientation?: DescriptionOrientation;
  /**
   * title text for description
   */
  title: string;
}
