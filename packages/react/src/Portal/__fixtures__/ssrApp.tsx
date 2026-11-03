import Portal from '../Portal';

export interface SsrAppProps {
  disablePortal?: boolean;
}

export function SsrApp({ disablePortal }: SsrAppProps) {
  return (
    <div>
      <p>probe</p>
      <Portal disablePortal={disablePortal}>
        <div id="portal-test">hello</div>
      </Portal>
    </div>
  );
}

/**
 * What `renderToString(<SsrApp />)` produces in Node, where there is no
 * `window`. Locked by `Portal.ssr.spec.tsx` (node environment) and hydrated by
 * `Portal.spec.tsx` (jsdom), which cannot produce it itself because jsdom
 * defines `window`.
 */
export const SSR_MARKUP = '<div><p>probe</p></div>';

export const SSR_MARKUP_DISABLE_PORTAL =
  '<div><p>probe</p><div id="portal-test">hello</div></div>';
