import { ReactNode } from 'react';
import { ButtonGroupChild, ButtonProps } from '../Button';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface BaseEmptyProps {
  /**
   * The title text for the empty state.
   * This is the main heading that describes the state.
   */
  title: string;
}

export interface PresetPictogramEmptyProps {
  /**
   * The type of empty state, which determines the icon and color theme.
   * @default 'initial-data'
   */
  type?: 'initial-data' | 'result' | 'system';
  /**
   * Custom pictogram element.
   */
  pictogram?: ReactNode;
}

export interface CustomPictogramEmptyProps {
  type?: 'notification' | 'custom';
  pictogram?: ReactNode;
}

export interface MainOrSubEmptyProps {
  /**
   * Action buttons configuration for primary and secondary actions.
   * Renders buttons in the order: secondary (left or only one), primary (right).
   */
  actions?:
    | {
        primaryButton?: ButtonProps | ButtonGroupChild;
        secondaryButton: ButtonProps | ButtonGroupChild;
      }
    | ButtonProps
    | ButtonGroupChild;
  /**
   * Optional description text displayed below the title.
   * Provides additional context or details about the empty state.
   */
  description?: string;
  /**
   * The size variant of the empty state.
   * Controls typography, spacing, and overall dimensions.
   * @default 'main'
   */
  size?: 'main' | 'sub';
}

export interface MinorEmptyProps {
  actions?: never;
  description?: never;
  size: 'minor';
}

export type EmptyProps = (MainOrSubEmptyProps | MinorEmptyProps) &
  (CustomPictogramEmptyProps | PresetPictogramEmptyProps) &
  BaseEmptyProps &
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'title'>;
