/**
 * @jest-environment node
 */
import { renderToString } from 'react-dom/server';
import {
  SSR_MARKUP,
  SSR_MARKUP_DISABLE_PORTAL,
  SsrApp,
} from './__fixtures__/ssrApp';

describe('<Portal /> server rendering', () => {
  it('should run without a DOM', () => {
    expect(typeof window).toBe('undefined');
  });

  it('should emit no portal content in server markup', () => {
    expect(renderToString(<SsrApp />)).toBe(SSR_MARKUP);
  });

  it('should emit children in place when disablePortal=true', () => {
    expect(renderToString(<SsrApp disablePortal />)).toBe(
      SSR_MARKUP_DISABLE_PORTAL,
    );
  });
});
