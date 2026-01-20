import { modalStatusTypeIcons } from '@mezzanine-ui/core/modal';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Modal, { ModalHeader, ModalStatusType } from '.';

window.scrollTo = jest.fn();

describe('<ModalHeader />', () => {
  afterEach(cleanup);

  afterAll(() => {
    jest.clearAllMocks();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ModalHeader ref={ref} title="Test" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<ModalHeader className={className} title="Test" />),
  );

  it('should bind header class and render title', () => {
    const { getHostHTMLElement } = render(<ModalHeader title="foo" />);
    const element = getHostHTMLElement();
    const titleElement = element.querySelector('.mzn-modal__header__title');

    expect(element.classList.contains('mzn-modal__header')).toBeTruthy();
    expect(titleElement).toBeTruthy();
    expect(titleElement!.textContent).toBe('foo');
  });

  describe('severity icon', () => {
    it('should render severity icon if showStatusTypeIcon=true and bind severity icon class', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader title="Title" showStatusTypeIcon />,
      );
      const element = getHostHTMLElement();
      const iconContainer = element.querySelector(
        '.mzn-modal__header__status-type-icon',
      );

      expect(iconContainer).toBeTruthy();
      const iconElement = iconContainer?.querySelector('[data-icon-name]');
      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        modalStatusTypeIcons.info.name,
      );
    });

    it('should not render severity icon by default', () => {
      const { getHostHTMLElement } = render(<ModalHeader title="Title" />);
      const element = getHostHTMLElement();
      const iconContainer = element.querySelector(
        '.mzn-modal__header__status-type-icon',
      );

      expect(iconContainer).toBeNull();
    });

    const severities: ModalStatusType[] = [
      'info',
      'success',
      'warning',
      'error',
      'email',
      'delete',
    ];

    severities.forEach((severity) => {
      it(`should render ${severity} icon`, () => {
        render(
          <Modal open modalStatusType={severity} modalType="standard">
            <ModalHeader title="Title" showStatusTypeIcon />
          </Modal>,
        );

        const iconElement = document.body.querySelector(
          '.mzn-modal__header__status-type-icon [data-icon-name]',
        )!;
        const icon = modalStatusTypeIcons[severity];

        expect(iconElement!.getAttribute('data-icon-name')).toBe(icon.name);
      });
    });
  });

  describe('prop: statusTypeIconLayout', () => {
    it('should render vertical layout by default', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader title="Title" showStatusTypeIcon />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-modal__header--vertical'),
      ).toBeTruthy();
    });

    it('should render horizontal layout when statusTypeIconLayout="horizontal"', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader
          title="Title"
          showStatusTypeIcon
          statusTypeIconLayout="horizontal"
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-modal__header--horizontal'),
      ).toBeTruthy();
    });
  });

  describe('prop: supportingText', () => {
    it('should render supporting text when provided', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader title="Title" supportingText="This is supporting text" />,
      );
      const element = getHostHTMLElement();
      const supportingText = element.querySelector(
        '.mzn-modal__header__supporting-text',
      );

      expect(supportingText?.textContent).toBe('This is supporting text');
    });

    it('should not render supporting text when not provided', () => {
      const { getHostHTMLElement } = render(<ModalHeader title="Title" />);
      const element = getHostHTMLElement();
      const supportingText = element.querySelector(
        '.mzn-modal__header__supporting-text',
      );

      expect(supportingText?.textContent).toBe('');
    });
  });

  describe('prop: titleAlign', () => {
    it('should align title left by default', () => {
      const { getHostHTMLElement } = render(<ModalHeader title="Title" />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-modal__header--title-align-left'),
      ).toBeTruthy();
    });

    it('should align title center when titleAlign="center"', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader title="Title" titleAlign="center" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-modal__header--title-align-center'),
      ).toBeTruthy();
    });
  });

  describe('prop: supportingTextAlign', () => {
    it('should align supporting text left by default', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader title="Title" supportingText="Supporting text" />,
      );
      const element = getHostHTMLElement();
      const supportingText = element.querySelector(
        '.mzn-modal__header__supporting-text',
      );

      expect(
        supportingText?.classList.contains(
          'mzn-modal__header__supporting-text--align-left',
        ),
      ).toBeTruthy();
    });

    it('should align supporting text center when supportingTextAlign="center"', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader
          title="Title"
          supportingText="Supporting text"
          supportingTextAlign="center"
        />,
      );
      const element = getHostHTMLElement();
      const supportingText = element.querySelector(
        '.mzn-modal__header__supporting-text',
      );

      expect(
        supportingText?.classList.contains(
          'mzn-modal__header__supporting-text--align-center',
        ),
      ).toBeTruthy();
    });
  });

  describe('prop: title', () => {
    it('should render title text', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader title="Test Modal Title" />,
      );
      const element = getHostHTMLElement();
      const title = element.querySelector('.mzn-modal__header__title');

      expect(title?.textContent).toBe('Test Modal Title');
    });

    it('should render title as h3 variant', () => {
      const { getHostHTMLElement } = render(<ModalHeader title="Test Title" />);
      const element = getHostHTMLElement();
      const title = element.querySelector('.mzn-modal__header__title');

      expect(title?.tagName.toLowerCase()).toBe('h3');
    });
  });
});
