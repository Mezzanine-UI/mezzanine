import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  ErrorFilledIcon,
  InfoFilledIcon,
  QuestionFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import ResultState, { ResultStateProps } from './ResultState';

describe('<ResultState />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ResultState ref={ref} title="Test" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<ResultState className={className} title="Test" />),
  );

  describe('prop: title', () => {
    it('should render title', () => {
      const title = 'Test Title';
      const { getByText } = render(<ResultState title={title} />);
      const titleElement = getByText(title);

      expect(titleElement).toBeInstanceOf(HTMLElement);
      expect(
        titleElement.classList.contains('mzn-result-state__title'),
      ).toBeTruthy();
      expect(titleElement.tagName.toLowerCase()).toBe('h3');
    });
  });

  describe('prop: description', () => {
    it('should render description when provided', () => {
      const description = 'Test description';
      const { getByText } = render(
        <ResultState description={description} title="Test" />,
      );
      const descElement = getByText(description);

      expect(descElement).toBeInstanceOf(HTMLElement);
      expect(
        descElement.classList.contains('mzn-result-state__description'),
      ).toBeTruthy();
      expect(descElement.tagName.toLowerCase()).toBe('p');
    });

    it('should not render description element when not provided', () => {
      const { getHostHTMLElement } = render(<ResultState title="Test" />);
      const element = getHostHTMLElement();
      const descElement = element.querySelector(
        '.mzn-result-state__description',
      );

      expect(descElement).toBe(null);
    });
  });

  describe('prop: type', () => {
    it('should render type="information" by default', () => {
      const { getHostHTMLElement } = render(<ResultState title="Test" />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-result-state--information'),
      ).toBeTruthy();
    });

    const types: ResultStateProps['type'][] = [
      'information',
      'success',
      'help',
      'warning',
      'error',
      'failure',
    ];

    const iconMap = {
      information: InfoFilledIcon,
      success: CheckedFilledIcon,
      help: QuestionFilledIcon,
      warning: WarningFilledIcon,
      error: ErrorFilledIcon,
      failure: DangerousFilledIcon,
    };

    types.forEach((type) => {
      it(`should add class if type="${type}"`, () => {
        const { getHostHTMLElement } = render(
          <ResultState title="Test" type={type} />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-result-state--${type}`),
        ).toBeTruthy();
      });

      it(`should render correct icon for type="${type}"`, () => {
        const { getHostHTMLElement } = render(
          <ResultState title="Test" type={type} />,
        );
        const element = getHostHTMLElement();
        const iconElement = element.querySelector('.mzn-result-state__icon');
        const expectedIcon = iconMap[type!];

        expect(iconElement).toBeInstanceOf(HTMLElement);
        // Verify the icon is rendered with the correct icon name
        expect(iconElement?.getAttribute('data-icon-name')).toBe(
          expectedIcon.name,
        );
      });
    });
  });

  describe('prop: size', () => {
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(<ResultState title="Test" />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-result-state--main')).toBeTruthy();
    });

    const sizes: ResultStateProps['size'][] = ['main', 'sub'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(
          <ResultState size={size} title="Test" />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-result-state--${size}`),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: actions', () => {
    it('should not render actions container when actions is not provided', () => {
      const { getHostHTMLElement } = render(<ResultState title="Test" />);
      const element = getHostHTMLElement();
      const actionsElement = element.querySelector(
        '.mzn-result-state__actions',
      );

      expect(actionsElement).toBe(null);
    });

    it('should render actions container when actions is provided', () => {
      const { getHostHTMLElement } = render(
        <ResultState
          actions={{
            secondaryButton: { children: 'Secondary' },
          }}
          title="Test"
        />,
      );
      const element = getHostHTMLElement();
      const actionsElement = element.querySelector(
        '.mzn-result-state__actions',
      );

      expect(actionsElement).toBeInstanceOf(HTMLElement);
    });

    it('should render secondary button when secondaryButton is provided', () => {
      const onClick = jest.fn();
      const { getByText } = render(
        <ResultState
          actions={{
            secondaryButton: {
              children: 'Secondary Action',
              onClick,
            },
          }}
          title="Test"
        />,
      );
      const button = getByText('Secondary Action');

      expect(button).toBeInstanceOf(HTMLElement);
      expect(
        button.classList.contains('mzn-button--base-secondary'),
      ).toBeTruthy();

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render both buttons when both actions are provided', () => {
      const { getByText } = render(
        <ResultState
          actions={{
            secondaryButton: { children: 'Secondary' },
            primaryButton: { children: 'Primary' },
          }}
          title="Test"
        />,
      );

      expect(getByText('Secondary')).toBeInstanceOf(HTMLElement);
      expect(getByText('Primary')).toBeInstanceOf(HTMLElement);
    });
  });

  describe('structure', () => {
    it('should render with correct structure', () => {
      const { getHostHTMLElement } = render(
        <ResultState
          actions={{
            secondaryButton: { children: 'Action' },
          }}
          description="Description"
          title="Title"
        />,
      );
      const element = getHostHTMLElement();

      // Check container
      const container = element.querySelector('.mzn-result-state__container');
      expect(container).toBeInstanceOf(HTMLElement);

      // Check icon
      const icon = element.querySelector('.mzn-result-state__icon');
      expect(icon).toBeInstanceOf(HTMLElement);

      // Check title
      const title = element.querySelector('.mzn-result-state__title');
      expect(title).toBeInstanceOf(HTMLElement);

      // Check description
      const description = element.querySelector(
        '.mzn-result-state__description',
      );
      expect(description).toBeInstanceOf(HTMLElement);

      // Check actions
      const actions = element.querySelector('.mzn-result-state__actions');
      expect(actions).toBeInstanceOf(HTMLElement);
    });
  });
});
