import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { ModalBody } from '.';

describe('<ModalBody />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ModalBody ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<ModalBody className={className} />),
  );

  describe('basic rendering', () => {
    it('should bind body class and render children', () => {
      const { getHostHTMLElement } = render(<ModalBody>foo</ModalBody>);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-modal__body')).toBeTruthy();
      expect(element.textContent).toBe('foo');
    });

    it('should render multiple children', () => {
      const { getHostHTMLElement } = render(
        <ModalBody>
          <div>child1</div>
          <div>child2</div>
        </ModalBody>,
      );
      const element = getHostHTMLElement();

      expect(element.children.length).toBe(2);
      expect(element.textContent).toBe('child1child2');
    });

    it('should render without children', () => {
      const { getHostHTMLElement } = render(<ModalBody />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-modal__body')).toBeTruthy();
      expect(element.textContent).toBe('');
    });
  });
});
