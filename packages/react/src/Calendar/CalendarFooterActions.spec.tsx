import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import CalendarFooterActions from './CalendarFooterActions';

describe('<CalendarFooterActions />', () => {
  afterEach(cleanup);

  const mockActions = {
    secondaryButtonProps: {
      children: 'Cancel',
      onClick: jest.fn(),
    },
    primaryButtonProps: {
      children: 'Confirm',
      onClick: jest.fn(),
    },
  };

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarFooterActions actions={mockActions} className={className} />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarFooterActions actions={mockActions} />,
    );
    const element = getHostHTMLElement();

    expect(
      element.classList.contains('mzn-calendar-footer-actions'),
    ).toBeTruthy();
  });

  it('should render secondary and primary buttons', () => {
    const { getByText } = render(
      <CalendarFooterActions actions={mockActions} />,
    );
    const secondaryButton = getByText('Cancel');
    const primaryButton = getByText('Confirm');

    expect(secondaryButton).toBeInstanceOf(HTMLButtonElement);
    expect(primaryButton).toBeInstanceOf(HTMLButtonElement);
  });

  describe('prop: actions', () => {
    it('should call secondary button onClick when clicked', () => {
      const actions = {
        secondaryButtonProps: {
          children: 'Cancel',
          onClick: jest.fn(),
        },
        primaryButtonProps: {
          children: 'Confirm',
          onClick: jest.fn(),
        },
      };

      const { getByText } = render(<CalendarFooterActions actions={actions} />);
      const secondaryButton = getByText('Cancel');

      fireEvent.click(secondaryButton);

      expect(actions.secondaryButtonProps.onClick).toHaveBeenCalledTimes(1);
      expect(actions.primaryButtonProps.onClick).not.toHaveBeenCalled();
    });

    it('should call primary button onClick when clicked', () => {
      const actions = {
        secondaryButtonProps: {
          children: 'Cancel',
          onClick: jest.fn(),
        },
        primaryButtonProps: {
          children: 'Confirm',
          onClick: jest.fn(),
        },
      };

      const { getByText } = render(<CalendarFooterActions actions={actions} />);
      const primaryButton = getByText('Confirm');

      fireEvent.click(primaryButton);

      expect(actions.primaryButtonProps.onClick).toHaveBeenCalledTimes(1);
      expect(actions.secondaryButtonProps.onClick).not.toHaveBeenCalled();
    });
  });
});
