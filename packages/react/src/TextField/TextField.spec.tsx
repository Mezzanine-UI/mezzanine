import { SearchIcon } from '@mezzanine-ui/icons';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import TextField from '.';
import ConfigProvider from '../Provider';

describe('<TextField />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<TextField ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<TextField className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TextField />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-text-field')).toBeTruthy();
  });

  describe('status corresponding props: active,clearable,disabled,error,full-width', () => {
    function testStatus(element: HTMLElement, status: boolean) {
      expect(element.classList.contains('mzn-text-field--active')).toBe(status);
      expect(element.classList.contains('mzn-text-field--clearable')).toBe(
        status,
      );
      expect(element.classList.contains('mzn-text-field--disabled')).toBe(
        status,
      );
      expect(element.classList.contains('mzn-text-field--error')).toBe(status);
      expect(element.classList.contains('mzn-text-field--full-width')).toBe(
        status,
      );
    }

    it('shoud render false by default', () => {
      const { getHostHTMLElement } = render(<TextField />);
      const element = getHostHTMLElement();

      testStatus(element, false);
    });

    it('should not bind classes if false', () => {
      const { getHostHTMLElement } = render(
        <TextField
          active={false}
          clearable={false}
          disabled={false}
          error={false}
          fullWidth={false}
        />,
      );
      const element = getHostHTMLElement();

      testStatus(element, false);
    });

    it('should bind classes if true', () => {
      const { getHostHTMLElement } = render(
        <TextField active clearable disabled error fullWidth />,
      );
      const element = getHostHTMLElement();

      testStatus(element, true);
    });
  });

  describe('prefix and suffix', () => {
    it('prefix and suffix elements should not renderred if not passed', () => {
      const { getHostHTMLElement } = render(<TextField />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: prefixElement,
        lastElementChild: suffixElement,
      } = element;

      expect(element.classList.contains('mzn-text-field--prefix')).toBeFalsy();
      expect(element.classList.contains('mzn-text-field--suffix')).toBeFalsy();
      expect(prefixElement).toBeNull();
      expect(suffixElement).toBeNull();
    });

    it('should wrap prefix or suffix', () => {
      const { getHostHTMLElement } = render(
        <TextField
          prefix={<Icon icon={SearchIcon} />}
          suffix={<Icon icon={SearchIcon} />}
        />,
      );
      const element = getHostHTMLElement();
      const {
        firstElementChild: prefixElement,
        lastElementChild: suffixElement,
      } = element;

      expect(element.classList.contains('mzn-text-field--prefix')).toBeTruthy();
      expect(element.classList.contains('mzn-text-field--suffix')).toBeTruthy();
      expect(prefixElement).toBeInstanceOf(HTMLElement);
      expect(suffixElement).toBeInstanceOf(HTMLElement);
      expect(prefixElement?.firstElementChild?.tagName.toLowerCase()).toBe('i');
      expect(suffixElement?.firstElementChild?.tagName.toLowerCase()).toBe('i');
    });
  });

  describe('prop: clearable', () => {
    it('should render clearable=false by default', () => {
      const { getHostHTMLElement } = render(<TextField />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-text-field--clearable'),
      ).toBeFalsy();
    });

    it('should not render close icon if clearable=false', () => {
      const { getHostHTMLElement } = render(<TextField clearable={false} />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-text-field--clearable'),
      ).toBeFalsy();
    });

    it('should render close icon if clearable=true', () => {
      const { getHostHTMLElement } = render(<TextField clearable />);
      const element = getHostHTMLElement();
      const clearIconElement = element.querySelector(
        '.mzn-text-field__clear-icon',
      );

      expect(
        element.classList.contains('mzn-text-field--clearable'),
      ).toBeTruthy();
      expect(clearIconElement?.tagName.toLowerCase()).toBe('i');
      expect(clearIconElement?.getAttribute('role')).toBe('button');
    });
  });

  describe('prop: onClear', () => {
    it('should fired if clearable=true', () => {
      const onClear = jest.fn();
      const { getHostHTMLElement } = render(
        <TextField clearable onClear={onClear} />,
      );
      const element = getHostHTMLElement();
      const clearIconElement = element.querySelector(
        '.mzn-text-field__clear-icon',
      );

      fireEvent.click(clearIconElement!);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should not fired if disabled=true', () => {
      const onClear = jest.fn();
      const { getHostHTMLElement } = render(
        <TextField clearable disabled onClear={onClear} />,
      );
      const element = getHostHTMLElement();
      const clearIconElement = element.querySelector(
        '.mzn-text-field__clear-icon',
      );

      fireEvent.click(clearIconElement!);

      expect(onClear).not.toHaveBeenCalled();
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<TextField />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--medium')).toBeTruthy();
    });

    it('should accept ConfigProvider context size changes', () => {
      const { getHostHTMLElement } = render(
        <ConfigProvider size="large">
          <TextField />
        </ConfigProvider>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--large')).toBeTruthy();
    });

    const sizes: TextFieldSize[] = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(<TextField size={size} />);
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-text-field--${size}`),
        ).toBeTruthy();
      });
    });
  });
});
