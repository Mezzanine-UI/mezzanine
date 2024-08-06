import { cleanup, render } from '../../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../../__test-utils__/common';
import InputTriggerPopper from '.';

describe('<InputTriggerPopper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<InputTriggerPopper ref={ref} open />),
  );

  it('should bind host class', () => {
    render(<InputTriggerPopper open />);

    const element = document.querySelector('.mzn-input-trigger-popper');

    expect(element).toBeInstanceOf(HTMLDivElement);
  });

  it('should render children', () => {
    render(<InputTriggerPopper open>foo</InputTriggerPopper>);

    const element = document.querySelector('.mzn-input-trigger-popper');

    expect(element?.textContent).toBe('foo');
  });
});
