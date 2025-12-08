import { Orientation } from '@mezzanine-ui/system/orientation';
import { CheckboxMode, checkboxPrefix } from './checkbox';

export type CheckboxGroupLayout = Orientation;

export interface CheckboxGroupOption {
  disabled?: boolean;
  mode?: CheckboxMode;
  label: string | number;
  value: string;
}

export const checkboxGroupPrefix = `${checkboxPrefix}-group` as const;

export const checkboxGroupClasses = {
  host: checkboxGroupPrefix,
  layout: (layout: CheckboxGroupLayout) => `${checkboxGroupPrefix}--${layout}`,
  mode: (mode: CheckboxMode) => `${checkboxGroupPrefix}--${mode}`,
  nested: `${checkboxGroupPrefix}--nested`,
  contentWrapper: `${checkboxGroupPrefix}--content-wrapper`,
  levelControlSeparator: `${checkboxGroupPrefix}--level-control-separator`,
} as const;
