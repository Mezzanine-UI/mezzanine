import { ReactElement } from 'react';
import { queries } from '@testing-library/dom';
import {
  render as coreRender,
  RenderOptions,
  RenderResult as CoreRenderResult,
  Queries,
} from '@testing-library/react';

export * from '@testing-library/react';

export type RenderResult<Q extends Queries = typeof queries> = CoreRenderResult<Q> & {
  getHostHTMLElement(): HTMLElement;
};

export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult;
export function render<Q extends Queries>(
  ui: ReactElement,
  options: RenderOptions<Q>,
): RenderResult<Q>;

export function render(ui: ReactElement, options?: RenderOptions): any {
  const coreResult = coreRender(ui, options);
  const result: RenderResult = {
    ...coreResult,
    getHostHTMLElement: () => coreResult.container.firstElementChild as HTMLElement,
  };

  return result;
}
