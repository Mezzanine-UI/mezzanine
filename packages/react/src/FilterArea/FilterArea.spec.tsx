import {
  FilterAreaActionsAlign,
  FilterAreaSize,
} from '@mezzanine-ui/core/filter-area';
import { FormFieldDensity, FormFieldLayout } from '@mezzanine-ui/core/form';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormField } from '../Form';
import Input from '../Input';
import Filter from './Filter';
import FilterArea, { FilterAreaProps } from './FilterArea';
import FilterLine from './FilterLine';

describe('<FilterArea />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <FilterArea ref={ref}>
        <FilterLine>
          <Filter>
            <FormField
              label="Test"
              name="test"
              density={FormFieldDensity.BASE}
              layout={FormFieldLayout.HORIZONTAL}
            >
              <Input />
            </FormField>
          </Filter>
        </FilterLine>
      </FilterArea>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <FilterArea className={className}>
        <FilterLine>
          <Filter>
            <FormField
              label="Test"
              name="test"
              density={FormFieldDensity.BASE}
              layout={FormFieldLayout.HORIZONTAL}
            >
              <Input />
            </FormField>
          </Filter>
        </FilterLine>
      </FilterArea>,
    ),
  );

  it('should render children correctly', () => {
    const { getHostHTMLElement } = render(
      <FilterArea>
        <FilterLine>
          <Filter>
            <FormField
              label="Test"
              name="test"
              density={FormFieldDensity.BASE}
              layout={FormFieldLayout.HORIZONTAL}
            >
              <Input />
            </FormField>
          </Filter>
        </FilterLine>
      </FilterArea>,
    );
    const element = getHostHTMLElement();

    expect(element.querySelector('.mzn-filter-area__line')).toBeTruthy();
  });

  describe('prop: size', () => {
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(
        <FilterArea>
          <FilterLine>
            <Filter>
              <FormField
                label="Test"
                name="test"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-filter-area--main')).toBeTruthy();
    });

    const sizes: FilterAreaSize[] = ['main', 'sub'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(
          <FilterArea size={size}>
            <FilterLine>
              <Filter>
                <FormField
                  label="Test"
                  name="test"
                  density={FormFieldDensity.BASE}
                  layout={FormFieldLayout.HORIZONTAL}
                >
                  <Input />
                </FormField>
              </Filter>
            </FilterLine>
          </FilterArea>,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-filter-area--${size}`),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: actionsAlign', () => {
    it('should render actionsAlign="end" by default', () => {
      const { getHostHTMLElement } = render(
        <FilterArea>
          <FilterLine>
            <Filter>
              <FormField
                label="Test"
                name="test"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();
      const actionsElement = element.querySelector('.mzn-filter-area__actions');

      expect(
        actionsElement?.classList.contains(
          'mzn-filter-area__actions--align-end',
        ),
      ).toBeTruthy();
    });

    const aligns: FilterAreaActionsAlign[] = ['start', 'center', 'end'];

    aligns.forEach((align) => {
      it(`should add class if actionsAlign="${align}"`, () => {
        const { getHostHTMLElement } = render(
          <FilterArea actionsAlign={align}>
            <FilterLine>
              <Filter>
                <FormField
                  label="Test"
                  name="test"
                  density={FormFieldDensity.BASE}
                  layout={FormFieldLayout.HORIZONTAL}
                >
                  <Input />
                </FormField>
              </Filter>
            </FilterLine>
          </FilterArea>,
        );
        const element = getHostHTMLElement();
        const actionsElement = element.querySelector(
          '.mzn-filter-area__actions',
        );

        expect(
          actionsElement?.classList.contains(
            `mzn-filter-area__actions--align-${align}`,
          ),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: isDirty', () => {
    it('should enable reset button by default', () => {
      const { getHostHTMLElement } = render(
        <FilterArea>
          <FilterLine>
            <Filter>
              <FormField
                label="Test"
                name="test"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();
      const resetButton = element.querySelector('button[disabled]');

      expect(resetButton).toBeFalsy();
    });

    it('should disable reset button if isDirty=false', () => {
      const { getHostHTMLElement } = render(
        <FilterArea isDirty={false}>
          <FilterLine>
            <Filter>
              <FormField
                label="Test"
                name="test"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();
      const resetButton = element.querySelector('button[disabled]');

      expect(resetButton).toBeTruthy();
    });
  });

  describe('prop: submitText and resetText', () => {
    it('should render default text', () => {
      const { getHostHTMLElement } = render(
        <FilterArea>
          <FilterLine>
            <Filter>
              <FormField
                label="Test"
                name="test"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Search');
      expect(element.textContent).toContain('Reset');
    });

    it('should render custom text', () => {
      const { getHostHTMLElement } = render(
        <FilterArea submitText="Submit" resetText="Clear">
          <FilterLine>
            <Filter>
              <FormField
                label="Test"
                name="test"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Submit');
      expect(element.textContent).toContain('Clear');
    });
  });

  describe('prop: onSubmit and onReset', () => {
    it('should call onSubmit when submit button is clicked', () => {
      const handleSubmit = jest.fn();
      const { getHostHTMLElement } = render(
        <FilterArea onSubmit={handleSubmit}>
          <FilterLine>
            <Filter>
              <FormField
                label="Test"
                name="test"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();
      const submitButton = element.querySelector('button') as HTMLButtonElement;

      submitButton?.click();

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should call onReset when reset button is clicked', () => {
      const handleReset = jest.fn();
      const { getHostHTMLElement } = render(
        <FilterArea onReset={handleReset}>
          <FilterLine>
            <Filter>
              <FormField
                label="Test"
                name="test"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const resetButton = buttons[1] as HTMLButtonElement;

      resetButton?.click();

      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: loading', () => {
    const renderWithLoading = (props: Partial<FilterAreaProps> = {}) =>
      render(
        <FilterArea {...props}>
          <FilterLine>
            <Filter>
              <FormField label="Test" name="test">
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );

    it('should not render submit button as loading by default', () => {
      const { getHostHTMLElement } = renderWithLoading();
      const submitButton = getHostHTMLElement().querySelector('button');

      expect(submitButton?.classList.contains('mzn-button--loading')).toBe(
        false,
      );
    });

    it('should render submit button as loading and ignore clicks if loading=true', () => {
      const handleSubmit = jest.fn();
      const { getHostHTMLElement } = renderWithLoading({
        loading: true,
        onSubmit: handleSubmit,
      });
      const submitButton = getHostHTMLElement().querySelector(
        'button',
      ) as HTMLButtonElement;

      fireEvent.click(submitButton);

      expect(submitButton.classList.contains('mzn-button--loading')).toBe(true);
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should not affect reset button', () => {
      const { getHostHTMLElement } = renderWithLoading({ loading: true });
      const resetButton = getHostHTMLElement().querySelectorAll('button')[1];

      expect(resetButton.classList.contains('mzn-button--loading')).toBe(false);
      expect(resetButton.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('prop: submitButtonProps and resetButtonProps', () => {
    const renderWithButtonProps = (props: Partial<FilterAreaProps> = {}) =>
      render(
        <FilterArea {...props}>
          <FilterLine>
            <Filter>
              <FormField label="Test" name="test">
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );

    it('should pass props to the submit and reset buttons', () => {
      const { getHostHTMLElement } = renderWithButtonProps({
        resetButtonProps: { className: 'reset', disabled: true },
        submitButtonProps: { className: 'submit', loading: true },
      });
      const host = getHostHTMLElement();
      const [submitButton, resetButton] = host.querySelectorAll('button');

      expect(submitButton.classList.contains('submit')).toBe(true);
      expect(submitButton.classList.contains('mzn-button--loading')).toBe(true);
      expect(resetButton.classList.contains('reset')).toBe(true);
      expect(resetButton.hasAttribute('disabled')).toBe(true);
      expect(host.hasAttribute('submitButtonProps')).toBe(false);
      expect(host.hasAttribute('resetButtonProps')).toBe(false);
    });

    it('should let loading prop override submitButtonProps.loading', () => {
      const { getHostHTMLElement } = renderWithButtonProps({
        loading: false,
        submitButtonProps: { loading: true },
      });
      const submitButton = getHostHTMLElement().querySelector('button');

      expect(submitButton?.classList.contains('mzn-button--loading')).toBe(
        false,
      );
    });

    it('should keep reset button disabled when isDirty=false', () => {
      const { getHostHTMLElement } = renderWithButtonProps({
        isDirty: false,
        resetButtonProps: { disabled: false },
      });
      const resetButton = getHostHTMLElement().querySelectorAll('button')[1];

      expect(resetButton.hasAttribute('disabled')).toBe(true);
    });

    it('should keep size, type and onClick controlled by FilterArea', () => {
      const handleSubmit = jest.fn();
      const { getHostHTMLElement } = renderWithButtonProps({
        onSubmit: handleSubmit,
        size: 'sub',
        submitButtonProps: { size: 'main', type: 'reset' },
        submitButtonType: 'submit',
      });
      const submitButton = getHostHTMLElement().querySelector(
        'button',
      ) as HTMLButtonElement;

      fireEvent.click(submitButton);

      expect(submitButton.getAttribute('type')).toBe('submit');
      expect(submitButton.classList.contains('mzn-button--sub')).toBe(true);
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('expanded state (multiple lines)', () => {
    it('should wrap actions in row when expanded so they align to the right', () => {
      const { getHostHTMLElement } = render(
        <FilterArea>
          <FilterLine>
            <Filter>
              <FormField
                label="Line1"
                name="a"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
          <FilterLine>
            <Filter>
              <FormField
                label="Line2"
                name="b"
                density={FormFieldDensity.BASE}
                layout={FormFieldLayout.HORIZONTAL}
              >
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();
      const expandButton = element.querySelector(
        '[aria-label="Expand filters"]',
      ) as HTMLButtonElement;

      expect(expandButton).toBeTruthy();
      fireEvent.click(expandButton);

      const row = element.querySelector('.mzn-filter-area__row');
      const actions = element.querySelector('.mzn-filter-area__actions');

      expect(row).toBeTruthy();
      expect(actions).toBeTruthy();
      expect(row?.contains(actions)).toBe(true);
    });
  });
});
