import { render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Step from './Step';
import Stepper from './Stepper';

describe('<Stepper />', () => {
  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Stepper ref={ref}>
        <Step />
      </Stepper>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Stepper className={className}>
        <Step />
      </Stepper>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Stepper>
        <Step />
      </Stepper>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-stepper')).toBeTruthy();
  });

  describe('basic functionality', () => {
    it('should render with default props', () => {
      const { getHostHTMLElement } = render(
        <Stepper>
          <Step />
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(element.children).toHaveLength(3);
    });

    it('should pass children as steps', () => {
      const { getHostHTMLElement } = render(
        <Stepper>
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(element.children).toHaveLength(2);
    });
  });

  describe('prop: currentStep', () => {
    it('should default to step 0', () => {
      const { getHostHTMLElement } = render(
        <Stepper>
          <Step />
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const firstStep = element.children[0];

      expect(
        firstStep.classList.contains('mzn-stepper-step--processing'),
      ).toBeTruthy();
    });

    it('should set correct step as processing', () => {
      const { getHostHTMLElement } = render(
        <Stepper currentStep={1}>
          <Step />
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const [firstStep, secondStep, thirdStep] = element.children;

      expect(
        firstStep.classList.contains('mzn-stepper-step--succeeded'),
      ).toBeTruthy();
      expect(
        secondStep.classList.contains('mzn-stepper-step--processing'),
      ).toBeTruthy();
      expect(
        thirdStep.classList.contains('mzn-stepper-step--pending'),
      ).toBeTruthy();
    });

    it('should handle currentStep beyond array length', () => {
      const { getHostHTMLElement } = render(
        <Stepper currentStep={5}>
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const [firstStep, secondStep] = element.children;

      expect(
        firstStep.classList.contains('mzn-stepper-step--succeeded'),
      ).toBeTruthy();
      expect(
        secondStep.classList.contains('mzn-stepper-step--succeeded'),
      ).toBeTruthy();
    });

    it('should handle negative currentStep', () => {
      const { getHostHTMLElement } = render(
        <Stepper currentStep={-1}>
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const [firstStep, secondStep] = element.children;

      expect(
        firstStep.classList.contains('mzn-stepper-step--pending'),
      ).toBeTruthy();
      expect(
        secondStep.classList.contains('mzn-stepper-step--pending'),
      ).toBeTruthy();
    });
  });

  describe('prop: onStepChange', () => {
    it('should call onStepChange on mount with default currentStep', () => {
      const onStepChange = jest.fn();

      render(
        <Stepper onStepChange={onStepChange}>
          <Step />
          <Step />
        </Stepper>,
      );

      expect(onStepChange).toHaveBeenCalledWith(0);
    });

    it('should call onStepChange on mount with custom currentStep', () => {
      const onStepChange = jest.fn();

      render(
        <Stepper currentStep={2} onStepChange={onStepChange}>
          <Step />
          <Step />
          <Step />
        </Stepper>,
      );

      expect(onStepChange).toHaveBeenCalledWith(2);
    });

    it('should call onStepChange when currentStep changes', () => {
      const onStepChange = jest.fn();
      const { rerender } = render(
        <Stepper currentStep={0} onStepChange={onStepChange}>
          <Step />
          <Step />
        </Stepper>,
      );

      onStepChange.mockClear();

      rerender(
        <Stepper currentStep={1} onStepChange={onStepChange}>
          <Step />
          <Step />
        </Stepper>,
      );

      expect(onStepChange).toHaveBeenCalledWith(1);
    });

    it('should not call onStepChange when other props change', () => {
      const onStepChange = jest.fn();
      const { rerender } = render(
        <Stepper
          currentStep={0}
          onStepChange={onStepChange}
          orientation="horizontal"
        >
          <Step />
          <Step />
        </Stepper>,
      );

      onStepChange.mockClear();

      rerender(
        <Stepper
          currentStep={0}
          onStepChange={onStepChange}
          orientation="vertical"
        >
          <Step />
          <Step />
        </Stepper>,
      );

      expect(onStepChange).not.toHaveBeenCalled();
    });
  });

  describe('prop: orientation', () => {
    it('should default to horizontal orientation', () => {
      const { getHostHTMLElement } = render(
        <Stepper>
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-stepper--horizontal'),
      ).toBeTruthy();
      expect(element.classList.contains('mzn-stepper--vertical')).toBeFalsy();
    });

    it('should apply horizontal class when orientation is horizontal', () => {
      const { getHostHTMLElement } = render(
        <Stepper orientation="horizontal">
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-stepper--horizontal'),
      ).toBeTruthy();
      expect(element.classList.contains('mzn-stepper--vertical')).toBeFalsy();
    });

    it('should apply vertical class when orientation is vertical', () => {
      const { getHostHTMLElement } = render(
        <Stepper orientation="vertical">
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-stepper--vertical')).toBeTruthy();
      expect(element.classList.contains('mzn-stepper--horizontal')).toBeFalsy();
    });

    it('should pass orientation to children', () => {
      const { getHostHTMLElement } = render(
        <Stepper orientation="vertical">
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const step = element.children[0];

      expect(
        step.classList.contains('mzn-stepper-step--vertical'),
      ).toBeTruthy();
    });
  });

  describe('prop: type', () => {
    it('should default to number type', () => {
      const { getHostHTMLElement } = render(
        <Stepper>
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-stepper--number')).toBeTruthy();
      expect(element.classList.contains('mzn-stepper--dot')).toBeFalsy();
    });

    it('should apply number class when type is number', () => {
      const { getHostHTMLElement } = render(
        <Stepper type="number">
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-stepper--number')).toBeTruthy();
      expect(element.classList.contains('mzn-stepper--dot')).toBeFalsy();
    });

    it('should apply dot class when type is dot', () => {
      const { getHostHTMLElement } = render(
        <Stepper type="dot">
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-stepper--dot')).toBeTruthy();
      expect(element.classList.contains('mzn-stepper--number')).toBeFalsy();
    });

    it('should pass type to children', () => {
      const { getHostHTMLElement } = render(
        <Stepper type="dot">
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const step = element.children[0];

      expect(step.classList.contains('mzn-stepper-step--dot')).toBeTruthy();
    });
  });

  describe('step status logic', () => {
    it('should set correct status for each step', () => {
      const { getHostHTMLElement } = render(
        <Stepper currentStep={2}>
          <Step />
          <Step />
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const [step1, step2, step3, step4] = element.children;

      expect(
        step1.classList.contains('mzn-stepper-step--succeeded'),
      ).toBeTruthy();
      expect(
        step2.classList.contains('mzn-stepper-step--succeeded'),
      ).toBeTruthy();
      expect(
        step3.classList.contains('mzn-stepper-step--processing'),
      ).toBeTruthy();
      expect(
        step4.classList.contains('mzn-stepper-step--pending'),
      ).toBeTruthy();
    });

    it('should handle completed stepper', () => {
      const { getHostHTMLElement } = render(
        <Stepper currentStep={3}>
          <Step />
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const [step1, step2, step3] = element.children;

      expect(
        step1.classList.contains('mzn-stepper-step--succeeded'),
      ).toBeTruthy();
      expect(
        step2.classList.contains('mzn-stepper-step--succeeded'),
      ).toBeTruthy();
      expect(
        step3.classList.contains('mzn-stepper-step--succeeded'),
      ).toBeTruthy();
    });

    it('should handle initial state stepper', () => {
      const { getHostHTMLElement } = render(
        <Stepper currentStep={0}>
          <Step />
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const [step1, step2, step3] = element.children;

      expect(
        step1.classList.contains('mzn-stepper-step--processing'),
      ).toBeTruthy();
      expect(
        step2.classList.contains('mzn-stepper-step--pending'),
      ).toBeTruthy();
      expect(
        step3.classList.contains('mzn-stepper-step--pending'),
      ).toBeTruthy();
    });
  });

  describe('step props inheritance', () => {
    it('should pass index to each step', () => {
      const TestStep1 = jest.fn((props) => <div data-index={props.index} />);
      const TestStep2 = jest.fn((props) => <div data-index={props.index} />);
      const TestStep3 = jest.fn((props) => <div data-index={props.index} />);

      const { getHostHTMLElement } = render(
        <Stepper>
          <TestStep1 />
          <TestStep2 />
          <TestStep3 />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      Array.from(element.children).forEach((step, index) => {
        expect((step as HTMLElement).dataset.index).toBe(index.toString());
      });
    });

    it('should preserve existing step props', () => {
      const { getHostHTMLElement } = render(
        <Stepper>
          <Step data-testid="custom-step" />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const step = element.children[0];

      expect(step.getAttribute('data-testid')).toBe('custom-step');
    });

    it('should apply CSS custom properties for step distances', () => {
      const { getHostHTMLElement } = render(
        <Stepper>
          <Step />
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const step = element.children[0] as HTMLElement;

      expect(
        step.style.getPropertyValue('--mzn-stepper-step-connect-line-distance'),
      ).toBeDefined();
    });

    it('should preserve existing step styles', () => {
      const { getHostHTMLElement } = render(
        <Stepper>
          <Step style={{ color: 'red' }} />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const step = element.children[0] as HTMLElement;

      expect(step.style.color).toBe('red');
    });
  });

  describe('edge cases', () => {
    it('should handle single step', () => {
      const { getHostHTMLElement } = render(
        <Stepper currentStep={0}>
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();
      const step = element.children[0];

      expect(
        step.classList.contains('mzn-stepper-step--processing'),
      ).toBeTruthy();
    });

    it('should handle changing number of steps', () => {
      const { getHostHTMLElement, rerender } = render(
        <Stepper currentStep={1}>
          <Step />
          <Step />
        </Stepper>,
      );

      rerender(
        <Stepper currentStep={1}>
          <Step />
          <Step />
          <Step />
        </Stepper>,
      );

      const element = getHostHTMLElement();
      expect(element.children).toHaveLength(3);
    });

    it('should handle non-Step children gracefully', () => {
      const { getHostHTMLElement } = render(
        <Stepper currentStep={0}>
          <Step />
          <div>Non-step content</div>
          <Step />
        </Stepper>,
      );
      const element = getHostHTMLElement();

      expect(element.children).toHaveLength(3);
    });
  });
});
