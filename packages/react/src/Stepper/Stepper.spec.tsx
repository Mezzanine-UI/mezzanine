import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Stepper, { Step } from '.';

describe('<Stepper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Stepper ref={ref} type={'number'} orientation={'horizontal'}>
        <Step />
      </Stepper>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Stepper className={className} type={'number'} orientation={'horizontal'}>
        <Step />
      </Stepper>,
    ),
  );

  ['number', 'dot'].forEach((type) => {
    ['horizontal', 'vertical'].forEach((orientation) => {
      it(`should render correct UI when type is ${type} and orientation is ${orientation}`, () => {
        const { container } = render(
          <Stepper
            processingStep={2}
            type={type as 'number' | 'dot'}
            orientation={orientation as 'horizontal' | 'vertical'}
          >
            <Step key="step1" title="step1" />
            <Step key="step2" title="step2" />
            <Step key="step3" title="step3" />
          </Stepper>,
        );

        expect(container.firstChild).toBeTruthy();
      });
    });
  });
});
