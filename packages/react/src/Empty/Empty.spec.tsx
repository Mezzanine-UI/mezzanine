import { createElement } from 'react';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Empty from '.';

describe('<Empty />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Empty title="Test Title" ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Empty className={className} title="Test Title" />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Empty title="Test Title" />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-empty')).toBeTruthy();
  });

  describe('prop: title', () => {
    it('should render title in h3 element', () => {
      const { getByRole } = render(<Empty title="Test Title" />);
      const titleElement = getByRole('heading', { level: 3 });

      expect(titleElement.textContent).toBe('Test Title');
      expect(titleElement.classList.contains('mzn-empty__title')).toBeTruthy();
    });
  });

  describe('prop: description', () => {
    it('should render description in p element when provided', () => {
      const { getByText } = render(
        <Empty description="Test description" title="Test Title" />,
      );
      const descriptionElement = getByText('Test description');

      expect(descriptionElement.textContent).toBe('Test description');
      expect(descriptionElement.tagName.toLowerCase()).toBe('p');
      expect(
        descriptionElement.classList.contains('mzn-empty__description'),
      ).toBeTruthy();
    });

    it('should not render description when not provided', () => {
      const { container } = render(<Empty title="Test Title" />);
      const descriptionElement = container.querySelector(
        '.mzn-empty__description',
      );

      expect(descriptionElement).toBeNull();
    });
  });

  describe('prop: size', () => {
    it('should apply main size class by default', () => {
      const { getHostHTMLElement } = render(<Empty title="Test Title" />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-empty--main')).toBeTruthy();
    });

    it('should apply sub size class when size="sub"', () => {
      const { getHostHTMLElement } = render(
        <Empty size="sub" title="Test Title" />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-empty--sub')).toBeTruthy();
    });

    it('should apply minor size class when size="minor"', () => {
      const { getHostHTMLElement } = render(
        <Empty size="minor" title="Test Title" />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-empty--minor')).toBeTruthy();
    });
  });

  describe('prop: type', () => {
    it('should render initial-data icon by default', () => {
      const { container } = render(<Empty title="Test Title" />);
      const iconElement = container.querySelector('.mzn-empty__icon');

      expect(iconElement).toBeInstanceOf(Node);
    });

    it('should render result icon when type="result"', () => {
      const { container } = render(<Empty title="Test Title" type="result" />);
      const iconElement = container.querySelector('.mzn-empty__icon');

      expect(iconElement).toBeInstanceOf(Node);
    });

    it('should render system icon when type="system"', () => {
      const { container } = render(<Empty title="Test Title" type="system" />);
      const iconElement = container.querySelector('.mzn-empty__icon');

      expect(iconElement).toBeInstanceOf(Node);
    });
  });

  describe('prop: pictogram', () => {
    it('should render custom pictogram when provided', () => {
      const customPictogram = createElement('div', {
        id: 'custom-pictogram',
      });

      const { container } = render(
        <Empty pictogram={customPictogram} title="Test Title" />,
      );
      const customElement = container.querySelector('#custom-pictogram');

      expect(customElement).toBeInstanceOf(Node);
    });

    it('should wrap custom pictogram in icon container', () => {
      const customPictogram = createElement('div', {
        id: 'custom-pictogram',
      });

      const { container } = render(
        <Empty pictogram={customPictogram} title="Test Title" />,
      );
      const iconContainer = container.querySelector('.mzn-empty__icon');
      const customElement = iconContainer?.querySelector('#custom-pictogram');

      expect(customElement).toBeInstanceOf(Node);
    });
  });

  describe('prop: actions', () => {
    it('should render actions when provided', () => {
      const actions = {
        primaryButtonProps: {
          children: 'Primary Action',
        },
        secondaryButtonProps: {
          children: 'Secondary Action',
        },
      };

      const { getByText } = render(
        <Empty actions={actions} title="Test Title" />,
      );

      expect(getByText('Primary Action')).toBeInstanceOf(Node);
      expect(getByText('Secondary Action')).toBeInstanceOf(Node);
    });

    it('should render only secondary button when primary is not provided', () => {
      const actions = {
        secondaryButtonProps: {
          children: 'Secondary Action',
        },
      };

      const { getByText, queryByText } = render(
        <Empty actions={actions} title="Test Title" />,
      );

      expect(getByText('Secondary Action')).toBeInstanceOf(Node);
      expect(queryByText('Primary Action')).toBeNull();
    });

    it('should not render actions container when actions not provided', () => {
      const { container } = render(<Empty title="Test Title" />);
      const actionsElement = container.querySelector('.mzn-empty__actions');

      expect(actionsElement).toBeNull();
    });
  });
});
