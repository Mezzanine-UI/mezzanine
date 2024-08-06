import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { ModalFooter } from '.';

describe('<ModalFooter />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ModalFooter ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<ModalFooter className={className} />),
  );

  it('should bind footer class and render children', () => {
    const { getHostHTMLElement } = render(<ModalFooter>foo</ModalFooter>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-modal__footer')).toBeTruthy();
    expect(element.textContent).toBe('foo');
  });
});
