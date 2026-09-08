import type {
  ClearActionsEmbeddedVariant,
  ClearActionsStandardVariant,
} from '@mezzanine-ui/core/clear-actions';

type ClearActionsStandardProps = {
  /**
   * Clear Actions Contextual type.
   * @default 'standard'
   */
  type?: 'standard';
  /**
   * Visual variant for standard type.
   */
  variant?: ClearActionsStandardVariant;
};

type ClearActionsEmbeddedProps = {
  /**
   * Clear Actions Contextual type.
   */
  type: 'embedded';
  /**
   * Visual variant for embedded type.
   */
  variant?: ClearActionsEmbeddedVariant;
};

type ClearActionsClearableProps = {
  /**
   * Clear Actions Contextual type.
   */
  type: 'clearable';
};

export type ClearActionsProps =
  | ClearActionsEmbeddedProps
  | ClearActionsStandardProps
  | ClearActionsClearableProps;
