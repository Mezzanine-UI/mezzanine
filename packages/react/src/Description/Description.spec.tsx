import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { Description } from '.';

describe('<Description />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Description
        ref={ref}
        titleProps={{
          children: '訂購日期',
          widthType: 'narrow',
        }}
        contentProps={{
          children: '2025-11-03',
        }}
      />,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Description
        className={className}
        titleProps={{
          children: '訂購日期',
          widthType: 'narrow',
        }}
        contentProps={{
          children: '2025-11-03',
        }}
      />,
    ),
  );
});
