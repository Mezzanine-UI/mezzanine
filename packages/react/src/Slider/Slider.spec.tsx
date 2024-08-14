import { cleanupHook, render, fireEvent, cleanup } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Slider from '.';

describe('<Slider />', () => {
  beforeEach(() => {
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      clientX: 50,
      clientY: 50,
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      bottom: 50,
      left: 50,
      right: 50,
      top: 50,
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

  describe('if `onChange` is not provided, the rail, track and inputs will not have event handlers', () => {
    it('case: single', () => {
      const { getHostHTMLElement } = render(<Slider value={0} withInput />);
      const element = getHostHTMLElement();
      const railElement = element.querySelector(
        '.mzn-slider__rail',
      )! as HTMLDivElement;
      const trackElement = element.querySelector(
        '.mzn-slider__track',
      )! as HTMLDivElement;
      const inputElement = element.getElementsByTagName('input')[0];

      expect(railElement.onmousedown).toBe(null);
      expect(trackElement.onmousedown).toBe(null);
      expect(inputElement.onchange).toBe(null);
      expect(inputElement.onblur).toBe(null);
      expect(inputElement.onkeydown).toBe(null);
    });

    it('case: range', () => {
      const { getHostHTMLElement } = render(
        <Slider value={[0, 100]} withInput />,
      );
      const element = getHostHTMLElement();
      const railElement = element.querySelector(
        '.mzn-slider__rail',
      )! as HTMLDivElement;
      const trackElement = element.querySelector(
        '.mzn-slider__track',
      )! as HTMLDivElement;
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

  describe('checking value is in range', () => {
    describe('case: min > max', () => {
      const onChange = jest.fn();

      render(<Slider onChange={onChange} value={0} min={100} max={50} />);

      expect(onChange).not.toBeCalled();
    });

    describe('case: single', () => {
      it('should init correct value when value < min', () => {
        const onChange = jest.fn();

        render(<Slider onChange={onChange} value={0} min={10} max={100} />);

        expect(onChange).toBeCalledWith(10);
      });

      it('should init correct value when value > max', () => {
        const onChange = jest.fn();

        render(<Slider onChange={onChange} value={60} min={0} max={50} />);

        expect(onChange).toBeCalledWith(50);
      });
    });

    describe('case: range', () => {
      it('should init correct range value when left value < min', () => {
        const onChange = jest.fn();

        render(
          <Slider onChange={onChange} value={[0, 50]} min={10} max={100} />,
        );

        expect(onChange).toBeCalledWith([10, 50]);
      });

      it('should init correct range value when both of left value and right value < min', () => {
        const onChange = jest.fn();

        render(
          <Slider onChange={onChange} value={[0, 50]} min={60} max={100} />,
        );

        expect(onChange).toBeCalledWith([60, 60]);
      });

      it('should init correct range value when right value > max', () => {
        const onChange = jest.fn();

        render(
          <Slider onChange={onChange} value={[10, 60]} min={0} max={50} />,
        );

        expect(onChange).toBeCalledWith([10, 50]);
      });

      it('should init correct range value when both of left value and right value > max', () => {
        const onChange = jest.fn();

        render(
          <Slider onChange={onChange} value={[60, 70]} min={0} max={50} />,
        );

        expect(onChange).toBeCalledWith([50, 50]);
      });
    });
  });

  describe('changing value', () => {
    describe('case: single', () => {
      it('should change value when rail mouse-down', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} />,
        );
        const element = getHostHTMLElement();
        const railElement = element.querySelector('.mzn-slider__rail')!;

        expect(railElement).toBeInstanceOf(HTMLElement);

        fireEvent.mouseDown(railElement);

        expect(onChange).toBeCalledTimes(1);
      });

      it('should change value when track mouse-down', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={50} />,
        );
        const element = getHostHTMLElement();
        const trackElement = element.querySelector('.mzn-slider__track')!;

        expect(trackElement).toBeInstanceOf(HTMLElement);

        fireEvent.mouseDown(trackElement);

        expect(onChange).toBeCalledTimes(1);
      });

      it('should change value while handle is being dragged', () => {
        jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
          clientX: 50,
          clientY: 50,
          x: 50,
          y: 50,
          width: 50,
          height: 50,
          bottom: 50,
          left: 50,
          right: 50,
          top: 50,
          toJSON: () => {},
        } as DOMRect);

        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} />,
        );
        const element = getHostHTMLElement();
        const handler = element.querySelector('.mzn-slider__handler')!;

        expect(handler).toBeInstanceOf(HTMLElement);

        fireEvent.mouseDown(handler);
        fireEvent.mouseMove(element);
        fireEvent.mouseUp(element);

        expect(onChange).toBeCalledTimes(1);
        onChange.mockClear();

        fireEvent.touchStart(handler);
        fireEvent.touchMove(element, {
          changedTouches: [{ clientX: 50 }],
        });
        fireEvent.touchEnd(element);

        expect(onChange).toBeCalledTimes(1);
      });

      it('should change value when withInput=true and the input enter key pressed or blur', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.change(inputElement, { target: { value: 50 } });
        fireEvent.keyDown(inputElement, { code: 'Enter' });

        expect(onChange).toBeCalledWith(50);

        onChange.mockClear();

        fireEvent.change(inputElement, { target: { value: 70 } });
        fireEvent.blur(inputElement);

        expect(onChange).toBeCalledWith(70);
      });

      it('should prevent overflow when input value submitted', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} min={0} max={100} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.change(inputElement, { target: { value: 1000 } });
        fireEvent.keyDown(inputElement, { code: 'Enter' });

        expect(onChange).toBeCalledWith(100);

        onChange.mockClear();

        fireEvent.change(inputElement, { target: { value: -10000 } });
        fireEvent.blur(inputElement);

        expect(onChange).toBeCalledWith(0);
      });

      it('input should restore to current value when escape key down', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.change(inputElement, { target: { value: 50 } });
        fireEvent.keyDown(inputElement, { code: 'Escape' });

        expect(onChange).not.toBeCalled();
        expect(inputElement.value).toBe('0');
      });
    });

    describe('case: range', () => {
      it('should change value when rail mouse-down', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[20, 30]} />,
        );
        const element = getHostHTMLElement();
        const railElement = element.querySelector('.mzn-slider__rail')!;

        expect(railElement).toBeInstanceOf(HTMLElement);

        fireEvent.mouseDown(railElement);

        expect(onChange).toBeCalledTimes(1);
      });

      it('should change value when track mouse-down', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[0, 100]} />,
        );
        const element = getHostHTMLElement();
        const trackElement = element.querySelector('.mzn-slider__track')!;

        expect(trackElement).toBeInstanceOf(HTMLElement);

        fireEvent.mouseDown(trackElement);

        expect(onChange).toBeCalledTimes(1);
      });

      it('should change value while handles are being dragged', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[0, 100]} />,
        );
        const element = getHostHTMLElement();
        const [firstHandleElement, SecondHandleElement] =
          element.querySelectorAll('.mzn-slider__handler')!;

        expect(firstHandleElement).toBeInstanceOf(HTMLElement);
        expect(SecondHandleElement).toBeInstanceOf(HTMLElement);

        fireEvent.mouseDown(firstHandleElement);
        fireEvent.mouseMove(element);

        expect(onChange).toBeCalledTimes(1);
        onChange.mockClear();

        fireEvent.mouseDown(SecondHandleElement);
        fireEvent.mouseMove(element);
      });

      it('should change value when withInput=true and the inputs enter key pressed or blur', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[0, 100]} withInput />,
        );
        const element = getHostHTMLElement();
        const [firstInputElement, secondInputElement] =
          element.getElementsByTagName('input');

        fireEvent.change(firstInputElement, { target: { value: 50 } });
        fireEvent.keyDown(firstInputElement, { code: 'Enter' });

        expect(onChange).toBeCalledWith(expect.arrayContaining([50, 100]));
        onChange.mockClear();

        fireEvent.change(firstInputElement, { target: { value: 70 } });
        fireEvent.blur(firstInputElement);

        expect(onChange).toBeCalledWith(expect.arrayContaining([70, 100]));
        onChange.mockClear();

        fireEvent.change(secondInputElement, { target: { value: 50 } });
        fireEvent.keyDown(secondInputElement, { code: 'Enter' });

        expect(onChange).toBeCalledWith(expect.arrayContaining([0, 50]));
        onChange.mockClear();

        fireEvent.change(secondInputElement, { target: { value: 70 } });
        fireEvent.blur(secondInputElement);

        expect(onChange).toBeCalledWith(expect.arrayContaining([0, 70]));
      });

      it('should prevent overflow when input values submitted', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider
            onChange={onChange}
            min={0}
            max={100}
            value={[0, 100]}
            withInput
          />,
        );
        const element = getHostHTMLElement();
        const [firstInputElement, secondInputElement] =
          element.getElementsByTagName('input');

        fireEvent.change(firstInputElement, { target: { value: 1000 } });
        fireEvent.keyDown(firstInputElement, { code: 'Enter' });

        expect(onChange).toBeCalledWith(expect.arrayContaining([100, 100]));
        onChange.mockClear();

        fireEvent.change(secondInputElement, { target: { value: -1000 } });
        fireEvent.keyDown(secondInputElement, { code: 'Enter' });

        expect(onChange).toBeCalledWith(expect.arrayContaining([0, 0]));
      });

      it('should guard order when input values submitted', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider
            onChange={onChange}
            min={0}
            max={100}
            value={[20, 30]}
            withInput
          />,
        );
        const element = getHostHTMLElement();
        const [firstInputElement, secondInputElement] =
          element.getElementsByTagName('input');

        fireEvent.change(firstInputElement, { target: { value: 40 } });
        fireEvent.keyDown(firstInputElement, { code: 'Enter' });

        expect(onChange).toBeCalledWith(expect.arrayContaining([30, 40]));
        onChange.mockClear();

        fireEvent.change(secondInputElement, { target: { value: 10 } });
        fireEvent.keyDown(secondInputElement, { code: 'Enter' });

        expect(onChange).toBeCalledWith(expect.arrayContaining([10, 20]));
      });

      it('inputs should restore to current value when escape key down', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider
            onChange={onChange}
            min={0}
            max={100}
            value={[0, 100]}
            withInput
          />,
        );
        const element = getHostHTMLElement();
        const [firstInputElement, secondInputElement] =
          element.getElementsByTagName('input');

        fireEvent.change(firstInputElement, { target: { value: 40 } });
        fireEvent.keyDown(firstInputElement, { code: 'Escape' });

        expect(onChange).not.toBeCalled();
        expect(firstInputElement.value).toBe('0');

        fireEvent.change(secondInputElement, { target: { value: 10 } });
        fireEvent.keyDown(secondInputElement, { code: 'Escape' });

        expect(onChange).not.toBeCalled();
        expect(secondInputElement.value).toBe('100');
      });
    });
  });

  describe('prop: disabled', () => {
    it('should append disabled classname', () => {
      const { getHostHTMLElement } = render(<Slider value={0} disabled />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-slider--disabled')).toBe(true);
    });
  });

  describe('prop: withInput', () => {
    describe('case: single', () => {
      it('should find input at the end of root', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        expect(element.lastElementChild).toEqual(inputElement.parentElement);
      });

      it('should be able to type', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={0} withInput />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        fireEvent.keyDown(inputElement, { code: '0' });
        fireEvent.change(inputElement, { target: { value: '00' } });

        expect(inputElement.value).toBe('00');
      });
    });

    describe('case: range', () => {
      it('should find inputs at the begin and end of root', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[0, 100]} withInput />,
        );
        const element = getHostHTMLElement();
        const [firstInputElement, secondInputElement] =
          element.getElementsByTagName('input');

        expect(element.lastElementChild).toEqual(
          secondInputElement.parentElement,
        );
        expect(element.firstElementChild).toEqual(
          firstInputElement.parentElement,
        );
      });

      it('should be able to type', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <Slider onChange={onChange} value={[0, 100]} withInput />,
        );
        const element = getHostHTMLElement();
        const [firstInputElement, secondInputElement] =
          element.getElementsByTagName('input');

        fireEvent.keyDown(firstInputElement, { code: '0' });
        fireEvent.change(firstInputElement, { target: { value: '00' } });

        expect(firstInputElement.value).toBe('00');

        fireEvent.keyDown(secondInputElement, { code: '0' });
        fireEvent.change(secondInputElement, { target: { value: '00' } });

        expect(secondInputElement.value).toBe('00');
      });
    });
  });
});
