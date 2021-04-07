import { modalSeverityIcons } from '@mezzanine-ui/core/modal';
import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Modal, { ModalHeader, ModalSeverity } from '.';

window.scrollTo = jest.fn();

describe('<ModalHeader />', () => {
  afterEach(cleanup);

  afterAll(() => {
    jest.clearAllMocks();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<ModalHeader ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<ModalHeader className={className} />),
  );

  describe('prop: children', () => {
    it('should render children under the title element', () => {
      const testChildren = 'foo';

      const { getHostHTMLElement, getByText } = render(
        <ModalHeader>
          {testChildren}
        </ModalHeader>,
      );

      const element = getHostHTMLElement();
      const titleElement = getByText(testChildren);

      expect(titleElement.textContent).toBe(testChildren);
      expect(titleElement.tagName.toLocaleLowerCase()).toBe('h3');
      expect(titleElement.parentElement).toEqual(element);
    });
  });

  it('should bind header class and render children as title', () => {
    const { getHostHTMLElement } = render(
      <ModalHeader>foo</ModalHeader>,
    );
    const element = getHostHTMLElement();
    const { lastElementChild: titleElement } = element;

    expect(element.classList.contains('mzn-modal__header')).toBeTruthy();
    expect(titleElement!.classList.contains('mzn-modal__title')).toBeTruthy();
    expect(titleElement!.textContent).toBe('foo');
  });

  describe('prop: titleLarge', () => {
    function testTitleComplex(ui: JSX.Element, titleLarge: boolean) {
      const { getHostHTMLElement } = render(ui);
      const element = getHostHTMLElement();
      const { lastElementChild: titleElement } = element;

      expect(titleElement!.classList.contains('mzn-modal__title--large')).toBe(titleLarge);
    }

    it('should render titleLarge=false by default', () => {
      testTitleComplex(<ModalHeader />, false);
    });

    [false, true].forEach((titleLarge) => {
      const message = titleLarge
        ? 'should bind title large class'
        : 'should not bind title large class';

      it(message, () => {
        testTitleComplex(<ModalHeader titleLarge={titleLarge} />, titleLarge);
      });
    });
  });

  describe('severity icon', () => {
    it('should render severity icon if showSeverityIcon=true and bind severity icon class', () => {
      const { getHostHTMLElement } = render(<ModalHeader showSeverityIcon />);
      const element = getHostHTMLElement();
      const { firstElementChild: iconElement } = element;

      expect(iconElement!.getAttribute('data-icon-name')).toBe(modalSeverityIcons.info.name);
      expect(iconElement!.classList.contains('mzn-modal__severity-icon'));
    });

    const severities: ModalSeverity[] = ['info', 'success', 'warning'];

    severities.forEach((severity) => {
      it(`should render ${severity} icon`, () => {
        render(
          <Modal open severity={severity}>
            <ModalHeader showSeverityIcon />
          </Modal>,
        );

        const iconElement = document.body.querySelector('.mzn-modal__severity-icon')!;
        const icon = modalSeverityIcons[severity];

        expect(iconElement!.getAttribute('data-icon-name')).toBe(icon.name);
      });
    });
  });
});
