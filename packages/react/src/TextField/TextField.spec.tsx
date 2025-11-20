import { SearchIcon } from '@mezzanine-ui/icons';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import TextField from '.';

describe('<TextField />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <TextField ref={ref}>
        <input type="text" />
      </TextField>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <TextField className={className}>
        <input type="text" />
      </TextField>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <TextField>
        <input type="text" />
      </TextField>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-text-field')).toBeTruthy();
  });

  describe('status corresponding props: active, clearable, disabled, error, fullWidth, readonly, typing', () => {
    it('should render with default status', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--active')).toBe(false);
      expect(element.classList.contains('mzn-text-field--clearable')).toBe(
        false,
      );
      expect(element.classList.contains('mzn-text-field--disabled')).toBe(
        false,
      );
      expect(element.classList.contains('mzn-text-field--error')).toBe(false);
      expect(element.classList.contains('mzn-text-field--full-width')).toBe(
        true,
      );
      expect(element.classList.contains('mzn-text-field--readonly')).toBe(
        false,
      );
      expect(element.classList.contains('mzn-text-field--typing')).toBe(false);
    });

    it('should bind classes when props are true', () => {
      const { getHostHTMLElement } = render(
        <TextField active clearable error fullWidth={false} onClear={jest.fn()}>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--active')).toBe(true);
      expect(element.classList.contains('mzn-text-field--clearable')).toBe(
        true,
      );
      expect(element.classList.contains('mzn-text-field--error')).toBe(true);
      expect(element.classList.contains('mzn-text-field--full-width')).toBe(
        false,
      );
    });

    it('should bind disabled class', () => {
      const { getHostHTMLElement } = render(
        <TextField disabled>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--disabled')).toBe(true);
    });

    it('should bind readonly class', () => {
      const { getHostHTMLElement } = render(
        <TextField readonly>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--readonly')).toBe(true);
    });

    it('should bind typing class', () => {
      const { getHostHTMLElement } = render(
        <TextField typing>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--typing')).toBe(true);
    });
  });

  describe('prefix and suffix', () => {
    it('prefix and suffix elements should not be rendered if not passed', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const prefixElement = element.querySelector('.mzn-text-field__prefix');
      const suffixElement = element.querySelector('.mzn-text-field__suffix');

      expect(prefixElement).toBeNull();
      expect(suffixElement).toBeNull();
    });

    it('should render prefix', () => {
      const { getHostHTMLElement } = render(
        <TextField prefix={<Icon icon={SearchIcon} />}>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const prefixElement = element.querySelector('.mzn-text-field__prefix');

      expect(prefixElement).toBeInstanceOf(HTMLElement);
      expect(prefixElement?.firstElementChild?.tagName.toLowerCase()).toBe('i');
    });

    it('should render suffix', () => {
      const { getHostHTMLElement } = render(
        <TextField suffix={<Icon icon={SearchIcon} />}>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const suffixElement = element.querySelector('.mzn-text-field__suffix');

      expect(suffixElement).toBeInstanceOf(HTMLElement);
      expect(suffixElement?.firstElementChild?.tagName.toLowerCase()).toBe('i');
    });
  });

  describe('prop: clearable', () => {
    it('should render clearable=false by default', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-text-field--clearable'),
      ).toBeFalsy();
    });

    it('should not render close icon if clearable=false', () => {
      const { getHostHTMLElement } = render(
        <TextField clearable={false}>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-text-field--clearable'),
      ).toBeFalsy();
    });

    it('should render close icon if clearable=true', () => {
      const { getHostHTMLElement } = render(
        <TextField clearable onClear={jest.fn()}>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const clearIconElement = element.querySelector(
        '.mzn-text-field__clear-icon',
      );

      expect(
        element.classList.contains('mzn-text-field--clearable'),
      ).toBeTruthy();
      expect(clearIconElement).not.toBeNull();
      expect(clearIconElement?.tagName.toLowerCase()).toBe('button');
    });
  });

  describe('prop: onClear', () => {
    it('should be fired if clearable=true', () => {
      const onClear = jest.fn();
      const { getHostHTMLElement } = render(
        <TextField clearable onClear={onClear}>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const clearIconElement = element.querySelector(
        '.mzn-text-field__clear-icon',
      );

      fireEvent.click(clearIconElement!);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should not be fired if disabled=true', () => {
      const onClear = jest.fn();
      const { getHostHTMLElement } = render(
        <TextField clearable disabled onClear={onClear}>
          <input type="text" />
        </TextField>,
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
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--main')).toBeTruthy();
    });

    const sizes: TextFieldSize[] = ['main', 'sub'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(
          <TextField size={size}>
            <input type="text" />
          </TextField>,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-text-field--${size}`),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: children function (render props)', () => {
    it('should render children as ReactNode by default', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" placeholder="test" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(input?.placeholder).toBe('test');
    });

    it('should support children as function with paddingClassName', () => {
      const { getHostHTMLElement } = render(
        <TextField size="main">
          {({ paddingClassName }) => <textarea className={paddingClassName} />}
        </TextField>,
      );
      const element = getHostHTMLElement();
      const textarea = element.querySelector('textarea');

      expect(textarea).toBeInstanceOf(HTMLTextAreaElement);
      expect(
        textarea?.classList.contains('mzn-text-field__input-padding'),
      ).toBe(true);
      expect(
        textarea?.classList.contains('mzn-text-field__input-padding--main'),
      ).toBe(true);
    });

    it('should apply noPadding class when using children function', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          {({ paddingClassName }) => (
            <input type="text" className={paddingClassName} />
          )}
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-text-field--no-padding'),
      ).toBeTruthy();
    });

    it('should not apply noPadding class when using ReactNode children', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-text-field--no-padding'),
      ).toBeFalsy();
    });
  });

  describe('prop: typing auto-detection', () => {
    it('should detect typing state on input event', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      expect(element.classList.contains('mzn-text-field--typing')).toBe(false);

      fireEvent.input(input!, { target: { value: 'test' } });

      expect(element.classList.contains('mzn-text-field--typing')).toBe(true);
    });

    it('should detect typing state on mousedown event', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      expect(element.classList.contains('mzn-text-field--typing')).toBe(false);

      fireEvent.mouseDown(input!);

      expect(element.classList.contains('mzn-text-field--typing')).toBe(true);
    });

    it('should clear typing state on blur', () => {
      const { getHostHTMLElement } = render(
        <TextField>
          <input type="text" />
        </TextField>,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      fireEvent.input(input!, { target: { value: 'test' } });
      expect(element.classList.contains('mzn-text-field--typing')).toBe(true);

      fireEvent.blur(input!);
      expect(element.classList.contains('mzn-text-field--typing')).toBe(false);
    });
  });
});
