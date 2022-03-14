import {
  cleanupHook,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { SelectTriggerTags } from '.';

describe('<SelectTriggerTags />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <SelectTriggerTags ref={ref} ellipsis />,
    ),
  );
});
