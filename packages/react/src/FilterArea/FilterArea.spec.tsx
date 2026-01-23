import { FilterAreaActionsAlign, FilterAreaSize } from '@mezzanine-ui/core/filter-area';
import { FormFieldSize } from '@mezzanine-ui/core/form';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormField } from '../Form';
import Input from '../Input';
import Filter from './Filter';
import FilterArea from './FilterArea';
import FilterLine from './FilterLine';

describe('<FilterArea />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <FilterArea ref={ref}>
        <FilterLine>
          <Filter>
            <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
            <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
            <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
                <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
                  <Input />
                </FormField>
              </Filter>
            </FilterLine>
          </FilterArea>,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-filter-area--${size}`)).toBeTruthy();
      });
    });
  });

  describe('prop: isPanel', () => {
    it('should not add panel class by default', () => {
      const { getHostHTMLElement } = render(
        <FilterArea>
          <FilterLine>
            <Filter>
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-filter-area--panel')).toBeFalsy();
    });

    it('should add panel class if isPanel=true', () => {
      const { getHostHTMLElement } = render(
        <FilterArea isPanel>
          <FilterLine>
            <Filter>
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-filter-area--panel')).toBeTruthy();
    });
  });

  describe('prop: actionsAlign', () => {
    it('should render actionsAlign="end" by default', () => {
      const { getHostHTMLElement } = render(
        <FilterArea>
          <FilterLine>
            <Filter>
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
                <Input />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>,
      );
      const element = getHostHTMLElement();
      const actionsElement = element.querySelector('.mzn-filter-area__actions');

      expect(actionsElement?.classList.contains('mzn-filter-area__actions--align-end')).toBeTruthy();
    });

    const aligns: FilterAreaActionsAlign[] = ['start', 'center', 'end'];

    aligns.forEach((align) => {
      it(`should add class if actionsAlign="${align}"`, () => {
        const { getHostHTMLElement } = render(
          <FilterArea actionsAlign={align}>
            <FilterLine>
              <Filter>
                <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
                  <Input />
                </FormField>
              </Filter>
            </FilterLine>
          </FilterArea>,
        );
        const element = getHostHTMLElement();
        const actionsElement = element.querySelector('.mzn-filter-area__actions');

        expect(actionsElement?.classList.contains(`mzn-filter-area__actions--align-${align}`)).toBeTruthy();
      });
    });
  });

  describe('prop: isDirty', () => {
    it('should enable reset button by default', () => {
      const { getHostHTMLElement } = render(
        <FilterArea>
          <FilterLine>
            <Filter>
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
              <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
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
});

