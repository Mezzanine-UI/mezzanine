import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import {
  PickerPopper,
} from '.';

describe('<PickerPopper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<PickerPopper ref={ref} open />),
  );

  it('should bind host class', () => {
    render(<PickerPopper open />);

    const element = document.querySelector('.mzn-picker-popper');

    expect(element).toBeInstanceOf(HTMLDivElement);
  });

  it('should render children', () => {
    render(<PickerPopper open>foo</PickerPopper>);

    const element = document.querySelector('.mzn-picker-popper');

    expect(element?.textContent).toBe('foo');
  });
});
