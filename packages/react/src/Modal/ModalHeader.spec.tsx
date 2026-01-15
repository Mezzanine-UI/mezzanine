import { modalStatusTypeIcons } from '@mezzanine-ui/core/modal';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Modal, { ModalHeader, ModalStatusType } from '.';

import type { JSX } from 'react';

window.scrollTo = jest.fn();

describe('<ModalHeader />', () => {
  afterEach(cleanup);

  afterAll(() => {
    jest.clearAllMocks();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ModalHeader ref={ref} modalHeaderTitle="Test" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<ModalHeader className={className} modalHeaderTitle="Test" />),
  );

  it('should bind header class and render title', () => {
    const { getHostHTMLElement } = render(<ModalHeader modalHeaderTitle="foo" />);
    const element = getHostHTMLElement();
    const titleElement = element.querySelector('.mzn-modal__header__title');

    expect(element.classList.contains('mzn-modal__header')).toBeTruthy();
    expect(titleElement).toBeTruthy();
    expect(titleElement!.textContent).toBe('foo');
  });

  describe('severity icon', () => {
    it('should render severity icon if modalHeaderShowModalStatusTypeIcon=true and bind severity icon class', () => {
      const { getHostHTMLElement } = render(<ModalHeader modalHeaderTitle="Title" modalHeaderShowModalStatusTypeIcon/>);
      const element = getHostHTMLElement();
      const iconContainer = element.querySelector('.mzn-modal__header__status-type-icon');

      expect(iconContainer).toBeTruthy();
      const iconElement = iconContainer?.querySelector('[data-icon-name]');
      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        modalStatusTypeIcons.info.name,
      );
    });

    it('should not render severity icon by default', () => {
      const { getHostHTMLElement } = render(<ModalHeader modalHeaderTitle="Title" />);
      const element = getHostHTMLElement();
      const iconContainer = element.querySelector('.mzn-modal__header__status-type-icon');

      expect(iconContainer).toBeNull();
    });

    const severities: ModalStatusType[] = ['info', 'success', 'warning', 'error', 'email', 'delete'];

    severities.forEach((severity) => {
      it(`should render ${severity} icon`, () => {
        render(
          <Modal open modalStatusType={severity} modalType="standard">
            <ModalHeader modalHeaderTitle="Title" modalHeaderShowModalStatusTypeIcon/>
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

  describe('prop: modalHeaderStatusTypeIconLayout', () => {
    it('should render vertical layout by default', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader modalHeaderTitle="Title" modalHeaderShowModalStatusTypeIcon />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-modal__header--vertical'),
      ).toBeTruthy();
    });

    it('should render horizontal layout when modalHeaderStatusTypeIconLayout="horizontal"', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader
          modalHeaderTitle="Title"
          modalHeaderShowModalStatusTypeIcon
          modalHeaderStatusTypeIconLayout="horizontal"
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-modal__header--horizontal'),
      ).toBeTruthy();
    });
  });

  describe('prop: modalHeaderSupportingText', () => {
    it('should render supporting text when provided', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader
          modalHeaderTitle="Title"
          modalHeaderSupportingText="This is supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const supportingText = element.querySelector('.mzn-modal__header__supporting-text');

      expect(supportingText?.textContent).toBe('This is supporting text');
    });

    it('should not render supporting text when not provided', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader modalHeaderTitle="Title" />,
      );
      const element = getHostHTMLElement();
      const supportingText = element.querySelector('.mzn-modal__header__supporting-text');

      expect(supportingText?.textContent).toBe('');
    });
  });

  describe('prop: modalHeaderTitleAlign', () => {
    it('should align title left by default', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader modalHeaderTitle="Title" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-modal__header--title-align-left'),
      ).toBeTruthy();
    });

    it('should align title center when modalHeaderTitleAlign="center"', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader modalHeaderTitle="Title" modalHeaderTitleAlign="center" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-modal__header--title-align-center'),
      ).toBeTruthy();
    });
  });

  describe('prop: modalHeaderSupportingTextAlign', () => {
    it('should align supporting text left by default', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader
          modalHeaderTitle="Title"
          modalHeaderSupportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const supportingText = element.querySelector('.mzn-modal__header__supporting-text');

      expect(
        supportingText?.classList.contains(
          'mzn-modal__header__supporting-text--align-left',
        ),
      ).toBeTruthy();
    });

    it('should align supporting text center when modalHeaderSupportingTextAlign="center"', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader
          modalHeaderTitle="Title"
          modalHeaderSupportingText="Supporting text"
          modalHeaderSupportingTextAlign="center"
        />,
      );
      const element = getHostHTMLElement();
      const supportingText = element.querySelector('.mzn-modal__header__supporting-text');

      expect(
        supportingText?.classList.contains(
          'mzn-modal__header__supporting-text--align-center',
        ),
      ).toBeTruthy();
    });
  });

  describe('prop: modalHeaderTitle', () => {
    it('should render title text', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader modalHeaderTitle="Test Modal Title" />,
      );
      const element = getHostHTMLElement();
      const title = element.querySelector('.mzn-modal__header__title');

      expect(title?.textContent).toBe('Test Modal Title');
    });

    it('should render title as h3 variant', () => {
      const { getHostHTMLElement } = render(
        <ModalHeader modalHeaderTitle="Test Title" />,
      );
      const element = getHostHTMLElement();
      const title = element.querySelector('.mzn-modal__header__title');

      expect(title?.tagName.toLowerCase()).toBe('h3');
    });
  });
});
