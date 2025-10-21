import { ReactElement, ReactNode } from 'react';
import { queries } from '@testing-library/dom';
import {
  render as coreRender,
  RenderOptions,
  RenderResult as CoreRenderResult,
  Queries,
} from '@testing-library/react';

export * from '@testing-library/react';
export { renderHook, cleanup as cleanupHook } from '@testing-library/react';

export type RenderResult<Q extends Queries = typeof queries> =
  CoreRenderResult<Q> & {
    getHostHTMLElement<E extends Element = HTMLElement>(): E;
  };

export function render(
  ui: ReactElement<any>,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult;
export function render<Q extends Queries>(
  ui: ReactElement<any>,
  options: RenderOptions<Q>,
): RenderResult<Q>;

export function render(ui: ReactElement<any>, options?: RenderOptions): any {
  const coreResult = coreRender(ui, options);
  const result: RenderResult = {
    ...coreResult,
    getHostHTMLElement: <E extends Element = HTMLElement>() =>
      coreResult.container.firstElementChild as E,
  };

  return result;
}
