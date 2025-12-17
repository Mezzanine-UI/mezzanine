import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Anchor from '.';

const mockList = [
  {
    id: 'foo',
    name: 'foo',
  },
  {
    id: 'bar',
    name: 'bar',
  },
];

describe('<Anchor />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Anchor ref={ref} list={mockList} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Anchor className={className} list={mockList} />),
  );
});
