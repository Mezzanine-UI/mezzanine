import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import CalendarQuickSelect from './CalendarQuickSelect';

describe('<CalendarQuickSelect />', () => {
  afterEach(cleanup);

  const mockOptions = [
    { id: 'today', name: 'Today', onClick: jest.fn() },
    { id: 'yesterday', name: 'Yesterday', onClick: jest.fn() },
    { id: 'last-week', name: 'Last Week', onClick: jest.fn() },
  ];

  beforeEach(() => {
    mockOptions.forEach((option) => {
      option.onClick.mockClear();
    });
  });

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<CalendarQuickSelect options={mockOptions} className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarQuickSelect options={mockOptions} />,
    );
    const element = getHostHTMLElement();

    expect(
      element.classList.contains('mzn-calendar-quick-select'),
    ).toBeTruthy();
  });

  it('should render all option buttons', () => {
    const { getByText } = render(<CalendarQuickSelect options={mockOptions} />);

    mockOptions.forEach((option) => {
      const button = getByText(option.name);
      expect(button.parentElement).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('prop: activeId', () => {
    it('should mark option as active when its id matches activeId', () => {
      const { getByText } = render(
        <CalendarQuickSelect options={mockOptions} activeId="today" />,
      );
      const todayButton = getByText('Today').parentElement!;
      const yesterdayButton = getByText('Yesterday').parentElement!;

      expect(
        todayButton.classList.contains(
          'mzn-calendar-quick-select__button--active',
        ),
      ).toBe(true);
      expect(
        yesterdayButton.classList.contains(
          'mzn-calendar-quick-select__button--active',
        ),
      ).toBe(false);
    });

    it('should show checked icon for active option', () => {
      const { getByText } = render(
        <CalendarQuickSelect options={mockOptions} activeId="yesterday" />,
      );
      const yesterdayButton = getByText('Yesterday').parentElement!;
      const icon = yesterdayButton.querySelector('[data-icon-name="checked"]');

      expect(icon).not.toBeNull();
    });
  });

  describe('prop: options', () => {
    it('should call onClick when option button is clicked', () => {
      const { getByText } = render(
        <CalendarQuickSelect options={mockOptions} />,
      );
      const todayButton = getByText('Today').parentElement!;

      fireEvent.click(todayButton);

      expect(mockOptions[0].onClick).toHaveBeenCalledTimes(1);
      expect(mockOptions[1].onClick).not.toHaveBeenCalled();
      expect(mockOptions[2].onClick).not.toHaveBeenCalled();
    });

    it('should disable button when disabled is true', () => {
      const optionsWithDisabled = [
        { id: 'today', name: 'Today', onClick: jest.fn(), disabled: true },
        { id: 'yesterday', name: 'Yesterday', onClick: jest.fn() },
      ];

      const { getByText } = render(
        <CalendarQuickSelect options={optionsWithDisabled} />,
      );
      const todayButton = getByText('Today').parentElement as HTMLButtonElement;
      const yesterdayButton = getByText('Yesterday')
        .parentElement as HTMLButtonElement;

      expect(todayButton.disabled).toBe(true);
      expect(todayButton.getAttribute('aria-disabled')).toBe('true');
      expect(yesterdayButton.disabled).toBe(false);

      fireEvent.click(todayButton);

      expect(optionsWithDisabled[0].onClick).not.toHaveBeenCalled();
    });
  });
});
