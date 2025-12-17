import { cleanupHook, render, fireEvent, cleanup } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Slider from '.';

describe('<Slider />', () => {
  beforeEach(() => {
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      bottom: 100,
      height: 50,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);
  });

  afterEach(() => {
    cleanup();
    cleanupHook();
    jest.clearAllMocks();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Slider ref={ref} value={0} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Slider className={className} value={0} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Slider value={0} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-slider')).toBeTruthy();
  });

  describe('basic functionality', () => {
    it('should render with default props', () => {
      const { getHostHTMLElement } = render(<Slider value={50} />);
      const element = getHostHTMLElement();

      expect(element).toBeTruthy();
      expect(element.querySelector('.mzn-slider__rail')).toBeTruthy();
      expect(element.querySelector('.mzn-slider__track')).toBeTruthy();
      expect(element.querySelector('.mzn-slider__handler')).toBeTruthy();
    });

    it('should render range slider when value is array', () => {
      const { getHostHTMLElement } = render(<Slider value={[20, 80]} />);
      const element = getHostHTMLElement();
      const handlers = element.querySelectorAll('.mzn-slider__handler');

      expect(handlers).toHaveLength(2);
    });
  });

  describe('prop: disabled', () => {
    it('should append disabled className when disabled', () => {
      const { getHostHTMLElement } = render(<Slider disabled value={0} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-slider--disabled')).toBe(true);
    });

    it('should disable handlers when disabled', () => {
      const { getHostHTMLElement } = render(<Slider disabled value={0} />);
      const element = getHostHTMLElement();
      const handler = element.querySelector('.mzn-slider__handler');

      expect(handler?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('prop: max and min', () => {
    it('should respect max and min values', () => {
      const onChange = jest.fn();
      render(<Slider max={50} min={10} onChange={onChange} value={0} />);

      expect(onChange).toHaveBeenCalledWith(10);
    });

    it('should not initialize when min > max', () => {
      const onChange = jest.fn();
      render(<Slider max={50} min={100} onChange={onChange} value={0} />);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('prop: step', () => {
    it('should respect step value in calculations', () => {
      const { getHostHTMLElement } = render(<Slider step={5} value={0} />);
      const element = getHostHTMLElement();
      const handler = element.querySelector('.mzn-slider__handler');

      expect(handler?.getAttribute('role')).toBe('slider');
    });
  });

  describe('prop: withTick', () => {
    it('should render tick marks when withTick is number', () => {
      const { getHostHTMLElement } = render(<Slider value={0} withTick={4} />);
      const element = getHostHTMLElement();
      const ticks = element.querySelectorAll('.mzn-slider__tick');

      expect(ticks.length).toBeGreaterThan(0);
    });

    it('should render tick marks when withTick is array', () => {
      const { getHostHTMLElement } = render(
        <Slider value={0} withTick={[20, 40, 60, 80]} />,
      );
      const element = getHostHTMLElement();
      const ticks = element.querySelectorAll('.mzn-slider__tick');

      expect(ticks).toHaveLength(6);
    });
  });

  describe('event handling without onChange', () => {
    it('should not have event handlers when onChange is not provided - single', () => {
      const { getHostHTMLElement } = render(<Slider value={0} withInput />);
      const element = getHostHTMLElement();
      const railElement = element.querySelector(
        '.mzn-slider__rail',
      ) as HTMLDivElement;
      const trackElement = element.querySelector(
        '.mzn-slider__track',
      ) as HTMLDivElement;
      const inputElement = element.getElementsByTagName('input')[0];

      expect(railElement.onmousedown).toBe(null);
      expect(trackElement.onmousedown).toBe(null);
      expect(inputElement.onchange).toBe(null);
      expect(inputElement.onblur).toBe(null);
      expect(inputElement.onkeydown).toBe(null);
    });

    it('should not have event handlers when onChange is not provided - range', () => {
      const { getHostHTMLElement } = render(
        <Slider value={[0, 100]} withInput />,
      );
      const element = getHostHTMLElement();
      const railElement = element.querySelector(
        '.mzn-slider__rail',
      ) as HTMLDivElement;
      const trackElement = element.querySelector(
        '.mzn-slider__track',
      ) as HTMLDivElement;
      const [firstInputElement, secondInputElement] =
        element.getElementsByTagName('input');

      expect(railElement.onmousedown).toBe(null);
      expect(trackElement.onmousedown).toBe(null);
      expect(firstInputElement.onchange).toBe(null);
      expect(firstInputElement.onblur).toBe(null);
      expect(firstInputElement.onkeydown).toBe(null);
      expect(secondInputElement.onchange).toBe(null);
      expect(secondInputElement.onblur).toBe(null);
      expect(secondInputElement.onkeydown).toBe(null);
    });
  });

  describe('value validation', () => {
    describe('single slider', () => {
      it('should correct value when below min', () => {
        const onChange = jest.fn();
        render(<Slider max={100} min={10} onChange={onChange} value={0} />);

        expect(onChange).toHaveBeenCalledWith(10);
      });

      it('should correct value when above max', () => {
        const onChange = jest.fn();
        render(<Slider max={50} min={0} onChange={onChange} value={60} />);

        expect(onChange).toHaveBeenCalledWith(50);
      });
    });

    describe('range slider', () => {
      it('should correct start value when below min', () => {
        const onChange = jest.fn();
        render(
          <Slider max={100} min={10} onChange={onChange} value={[0, 50]} />,
        );

        expect(onChange).toHaveBeenCalledWith([10, 50]);
      });

      it('should correct both values when below min', () => {
        const onChange = jest.fn();
        render(
          <Slider max={100} min={60} onChange={onChange} value={[0, 50]} />,
        );

        expect(onChange).toHaveBeenCalledWith([60, 60]);
      });

      it('should correct end value when above max', () => {
        const onChange = jest.fn();
        render(
          <Slider max={50} min={0} onChange={onChange} value={[10, 60]} />,
        );

        expect(onChange).toHaveBeenCalledWith([10, 50]);
      });

      it('should correct both values when above max', () => {
        const onChange = jest.fn();
        render(
          <Slider max={50} min={0} onChange={onChange} value={[60, 70]} />,
        );

        expect(onChange).toHaveBeenCalledWith([50, 50]);
      });
    });
  });

  describe('mouse interactions', () => {
    describe('single slider', () => {
      it('should handle rail click', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} />,
        );
        const element = getHostHTMLElement();
        const railElement = element.querySelector('.mzn-slider__rail')!;

        fireEvent.mouseDown(railElement);

        expect(onChange).toHaveBeenCalledTimes(1);
      });

      it('should handle track click', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={50} />,
        );
        const element = getHostHTMLElement();
        const trackElement = element.querySelector('.mzn-slider__track')!;

        fireEvent.mouseDown(trackElement);

        expect(onChange).toHaveBeenCalledTimes(1);
      });

      it('should handle handle drag', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} />,
        );
        const element = getHostHTMLElement();
        const handler = element.querySelector('.mzn-slider__handler')!;

        fireEvent.mouseDown(handler);
        fireEvent.mouseMove(element, { clientX: 50 });
        fireEvent.mouseUp(element);

        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('range slider', () => {
      it('should handle rail click', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[20, 30]} />,
        );
        const element = getHostHTMLElement();
        const railElement = element.querySelector('.mzn-slider__rail')!;

        fireEvent.mouseDown(railElement);

        expect(onChange).toHaveBeenCalledTimes(1);
      });

      it('should handle track click', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[0, 100]} />,
        );
        const element = getHostHTMLElement();
        const trackElement = element.querySelector('.mzn-slider__track')!;

        fireEvent.mouseDown(trackElement);

        expect(onChange).toHaveBeenCalledTimes(1);
      });

      it('should handle both handles drag', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[0, 100]} />,
        );
        const element = getHostHTMLElement();
        const [firstHandle, secondHandle] = element.querySelectorAll(
          '.mzn-slider__handler',
        );

        fireEvent.mouseDown(firstHandle);
        fireEvent.mouseMove(element, { clientX: 25 });
        fireEvent.mouseUp(element);

        expect(onChange).toHaveBeenCalledTimes(1);
        onChange.mockClear();

        fireEvent.mouseDown(secondHandle);
        fireEvent.mouseMove(element, { clientX: 75 });
        fireEvent.mouseUp(element);

        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('touch interactions', () => {
    it('should handle touch events on handle', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Slider onChange={onChange} value={0} />,
      );
      const element = getHostHTMLElement();
      const handler = element.querySelector('.mzn-slider__handler')!;

      fireEvent.touchStart(handler);
      fireEvent.touchMove(element, { changedTouches: [{ clientX: 50 }] });
      fireEvent.touchEnd(element);

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: withInput', () => {
    describe('single slider', () => {
      it('should render input at correct position', () => {
        const { getHostHTMLElement } = render(
          <Slider onChange={jest.fn()} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByClassName(
          'mzn-input-container',
        )[0];

        expect(element.lastElementChild).toEqual(inputElement);
      });

      it('should allow typing in input', () => {
        const { getHostHTMLElement } = render(
          <Slider onChange={jest.fn()} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.change(inputElement, { target: { value: '50' } });

        expect(inputElement.value).toBe('50');
      });

      it('should handle input submission via Enter key', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.change(inputElement, { target: { value: '50' } });
        fireEvent.keyDown(inputElement, { code: 'Enter' });

        expect(onChange).toHaveBeenCalledWith(50);
      });

      it('should handle input submission via blur', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.change(inputElement, { target: { value: '70' } });
        fireEvent.blur(inputElement);

        expect(onChange).toHaveBeenCalledWith(70);
      });

      it('should prevent overflow in input values', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider max={100} min={0} onChange={onChange} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.change(inputElement, { target: { value: '1000' } });
        fireEvent.keyDown(inputElement, { code: 'Enter' });

        expect(onChange).toHaveBeenCalledWith(100);

        onChange.mockClear();

        fireEvent.change(inputElement, { target: { value: '-10' } });
        fireEvent.blur(inputElement);

        expect(onChange).toHaveBeenCalledWith(0);
      });

      it('should restore input value on Escape', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.change(inputElement, { target: { value: '50' } });
        fireEvent.keyDown(inputElement, { code: 'Escape' });

        expect(onChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe('0');
      });
    });

    describe('range slider', () => {
      it('should render inputs at correct positions', () => {
        const { getHostHTMLElement } = render(
          <Slider onChange={jest.fn()} value={[0, 100]} withInput />,
        );
        const element = getHostHTMLElement();
        const [firstInput, secondInput] = element.getElementsByClassName(
          'mzn-input-container',
        );

        expect(element.firstElementChild).toEqual(firstInput);
        expect(element.lastElementChild).toEqual(secondInput);
      });

      it('should allow typing in both inputs', () => {
        const { getHostHTMLElement } = render(
          <Slider onChange={jest.fn()} value={[0, 100]} withInput />,
        );
        const element = getHostHTMLElement();
        const [firstInput, secondInput] = element.getElementsByTagName('input');

        fireEvent.change(firstInput, { target: { value: '25' } });
        fireEvent.change(secondInput, { target: { value: '75' } });

        expect(firstInput.value).toBe('25');
        expect(secondInput.value).toBe('75');
      });

      it('should handle input submission for both inputs', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[0, 100]} withInput />,
        );
        const element = getHostHTMLElement();
        const [firstInput, secondInput] = element.getElementsByTagName('input');

        fireEvent.change(firstInput, { target: { value: '25' } });
        fireEvent.keyDown(firstInput, { code: 'Enter' });

        expect(onChange).toHaveBeenCalledWith(
          expect.arrayContaining([25, 100]),
        );

        onChange.mockClear();

        fireEvent.change(secondInput, { target: { value: '75' } });
        fireEvent.blur(secondInput);

        expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([0, 75]));
      });

      it('should prevent overflow in range inputs', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider
            max={100}
            min={0}
            onChange={onChange}
            value={[0, 100]}
            withInput
          />,
        );
        const element = getHostHTMLElement();
        const [firstInput, secondInput] = element.getElementsByTagName('input');

        fireEvent.change(firstInput, { target: { value: '150' } });
        fireEvent.keyDown(firstInput, { code: 'Enter' });

        expect(onChange).toHaveBeenCalledWith(
          expect.arrayContaining([100, 100]),
        );

        onChange.mockClear();

        fireEvent.change(secondInput, { target: { value: '-50' } });
        fireEvent.keyDown(secondInput, { code: 'Enter' });

        expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([0, 0]));
      });

      it('should maintain order when inputs cross over', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider
            max={100}
            min={0}
            onChange={onChange}
            value={[20, 30]}
            withInput
          />,
        );
        const element = getHostHTMLElement();
        const [firstInput, secondInput] = element.getElementsByTagName('input');

        fireEvent.change(firstInput, { target: { value: '40' } });
        fireEvent.keyDown(firstInput, { code: 'Enter' });

        expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([30, 40]));

        onChange.mockClear();

        fireEvent.change(secondInput, { target: { value: '10' } });
        fireEvent.keyDown(secondInput, { code: 'Enter' });

        expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([10, 20]));
      });

      it('should restore both input values on Escape', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider
            max={100}
            min={0}
            onChange={onChange}
            value={[0, 100]}
            withInput
          />,
        );
        const element = getHostHTMLElement();
        const [firstInput, secondInput] = element.getElementsByTagName('input');

        fireEvent.change(firstInput, { target: { value: '40' } });
        fireEvent.keyDown(firstInput, { code: 'Escape' });

        expect(onChange).not.toHaveBeenCalled();
        expect(firstInput.value).toBe('0');

        fireEvent.change(secondInput, { target: { value: '60' } });
        fireEvent.keyDown(secondInput, { code: 'Escape' });

        expect(onChange).not.toHaveBeenCalled();
        expect(secondInput.value).toBe('100');
      });
    });
  });

  describe('accessibility', () => {
    it('should have correct ARIA attributes', () => {
      const { getHostHTMLElement } = render(
        <Slider max={100} min={0} value={50} />,
      );
      const element = getHostHTMLElement();
      const handler = element.querySelector('.mzn-slider__handler');

      expect(handler?.getAttribute('role')).toBe('slider');
      expect(handler?.getAttribute('aria-valuemin')).toBe('0');
      expect(handler?.getAttribute('aria-valuemax')).toBe('100');
      expect(handler?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('should have proper tabIndex for keyboard navigation', () => {
      const { getHostHTMLElement } = render(<Slider value={0} />);
      const element = getHostHTMLElement();
      const handler = element.querySelector('.mzn-slider__handler');

      expect(handler?.getAttribute('tabIndex')).toBe('0');
    });
  });
});
