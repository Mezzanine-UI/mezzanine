import { ReactElement, ReactNode } from 'react';
import { ButtonProps } from '../Button';
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
  type?: 'initial-data' | 'result' | 'system' | 'notification';
  /**
   * Custom pictogram element.
   */
  pictogram?: ReactNode;
}

export interface CustomPictogramEmptyProps {
  type?: 'custom';
  pictogram?: ReactNode;
}

export interface MainOrSubEmptyProps {
  /**
   * Action buttons configuration for primary and secondary actions. <br />
   * Renders buttons in the order: secondary (left or only one), primary (right). <br />
   * If actions provided, children will be ignored. <br />
   */
  actions?:
    | {
        primaryButton?: ButtonProps;
        secondaryButton: ButtonProps;
      }
    | ButtonProps;
  /**
   * Child button elements for actions. <br />
   * Can be a single Button element or an array of one or two Button elements. <br />
   * When using children, the first Button is treated as secondary and the second as primary. <br />
   * If only one Button is provided, it is treated as secondary. <br />
   * If actions provided, children will be ignored. <br />
   */
  children?:
    | ReactElement<ButtonProps>
    | [ReactElement<ButtonProps>]
    | [ReactElement<ButtonProps>, ReactElement<ButtonProps>];
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
