import type { AngularRenderer } from '@storybook/angular';
import type {
  ArgTypesEnhancer,
  StrictArgTypes,
  StrictInputType,
} from 'storybook/internal/types';

/**
 * Compodoc keeps blank lines inside JSDoc `@example` blocks as this marker in
 * `rawdescription`; Storybook renders it verbatim in `<Description>`.
 */
const COMPODOC_EMPTY_LINE = /___COMPODOC_EMPTY_LINE___/g;

/**
 * Only these sections are component API. Compodoc also reports every public
 * class member — `computed()` signals, `inject()`ed services — as
 * `properties` / `methods`, which are implementation details here.
 */
const API_CATEGORIES = new Set(['inputs', 'outputs']);

export function sanitizeCompodocJson<T>(json: T): T {
  return JSON.parse(JSON.stringify(json).replace(COMPODOC_EMPTY_LINE, ''));
}

/**
 * Storybook's `angularFilterNonInputControls` feature does the filtering but
 * drops outputs too, so this keeps both inputs and outputs instead.
 */
export const keepComponentApiArgTypes: ArgTypesEnhancer<AngularRenderer> = ({
  argTypes,
}) =>
  Object.fromEntries(
    Object.entries(argTypes)
      .filter(([, argType]) => {
        const category = argType.table?.category;

        // Story-declared argTypes carry no category; keep them as written.
        return !category || API_CATEGORIES.has(category);
      })
      .map(([name, argType]) => [name, withoutNaNDefault(argType)]),
  ) as StrictArgTypes;

/**
 * An `input<number>()` with no initializer is cast to `Number(undefined)` by
 * the Angular extractor and shows up as a `NaN` default.
 */
function withoutNaNDefault(argType: StrictInputType): StrictInputType {
  const summary = argType.table?.defaultValue?.summary;

  if (typeof summary !== 'number' || !Number.isNaN(summary)) return argType;

  return {
    ...argType,
    table: { ...argType.table, defaultValue: undefined },
  };
}
