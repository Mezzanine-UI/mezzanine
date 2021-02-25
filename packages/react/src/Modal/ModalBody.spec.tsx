import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { ModalBody } from '.';

describe('<ModalBody />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<ModalBody ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<ModalBody className={className} />),
  );

  it('should bind body class and render children', () => {
    const { getHostHTMLElement } = render(
      <ModalBody>foo</ModalBody>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-modal__body')).toBeTruthy();
    expect(element.textContent).toBe('foo');
  });
});
