import {
  cleanupHook,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { SelectTrigger } from '.';

describe('<SelectTrigger />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <SelectTrigger ref={ref} readOnly />,
    ),
  );
});
