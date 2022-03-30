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
import Progress from '.';
import ConfigProvider from '../Provider';

describe('<Progress />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <Progress ref={ref} />,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <Progress className={className} />,
    ),
  );

  const testProgress = (progressType : 'line' | 'circle') => {
    const icon : IconProps = { icon: PlusIcon };

    return (
      <>
        <Progress type={progressType} percent={0} />
        <Progress type={progressType} percent={100} />
        <Progress type={progressType} status="error" />
        <Progress type={progressType} status="success" successIconProps={icon} errorIconProps={icon} />
      </>
    );
  };

  describe('line type progress', () => {
    it('should render line type progress', () => {
      const { getHostHTMLElement } = render(testProgress('line'));
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-progress__line-bg')).toBeTruthy();
      expect(element.querySelector('.mzn-progress__info')).toBeTruthy();
    });
    it('should not render info if set showInfo=false', () => {
      const { getHostHTMLElement } = render(<Progress showInfo={false} />);
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-progress__info')).toBeNull();
    });
  });

  describe('circle type progress', () => {
    it('should render circle type progress', () => {
      const { getHostHTMLElement } = render(testProgress('circle'));
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-progress__circle-bg')).toBeTruthy();
      expect(element.querySelector('.mzn-progress__info')).toBeTruthy();
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<Progress />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-progress--medium')).toBeTruthy();
    });

    it('should accept ConfigProvider context size changes', () => {
      const { getHostHTMLElement } = render(
        <ConfigProvider size="large">
          <Progress />
        </ConfigProvider>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-progress--large')).toBeTruthy();
    });
  });
});
