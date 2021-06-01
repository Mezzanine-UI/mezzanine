import { PlusIcon } from '@mezzanine-ui/icons';
import { IconProps } from '../Icon';
import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Stepper, { Step } from '.';

describe('<Stepper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <Stepper ref={ref}>
        <Step />
      </Stepper>,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <Stepper className={className}>
        <Step />
      </Stepper>,
    ),
  );

  const testStepper = () => {
    const completedIconProps : IconProps = { icon: PlusIcon };

    return (
      <Stepper activeStep={1}>
        <Step key="step1" title="step1" />
        <Step key="step2" title="step2" />
        <Step key="step3" title="step3" />
        <Step key="step4" title="step4" completedIconProps={completedIconProps} completed />
      </Stepper>
    );
  };

  describe('children step', () => {
    it('should render step number and set state', () => {
      const { getHostHTMLElement } = render(testStepper());
      const element = getHostHTMLElement();

      expect(element.childNodes[0].childNodes[0].textContent).toBe('');
      expect(element.childNodes[1].childNodes[0].textContent).toBe('2');
      expect(element.childNodes[2].childNodes[0].textContent).toBe('3');
    });
    it('should render the step icon', () => {
      const { getHostHTMLElement } = render(testStepper());
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-stepper-step__completed-icon')).toBeTruthy();
    });
  });
});
