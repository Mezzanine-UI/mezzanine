import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  PlusIcon,
} from '@mezzanine-ui/icons';
import Progress from '.';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

describe('<Progress />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Progress ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Progress className={className} />),
  );

  describe('basic rendering', () => {
    it('should render progress type by default', () => {
      const { getHostHTMLElement } = render(<Progress />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-progress--progress')).toBeTruthy();
      expect(element.querySelector('.mzn-progress__line-bg')).toBeTruthy();
    });

    it('should render progress with default percent 0', () => {
      const { getHostHTMLElement } = render(<Progress />);
      const element = getHostHTMLElement();
      const lineBg = element.querySelector('.mzn-progress__line-bg') as HTMLElement;

      expect(lineBg?.style.width).toBe('0%');
    });
  });

  describe('prop: percent', () => {
    it('should render correct percent value', () => {
      const { getHostHTMLElement } = render(<Progress percent={50} />);
      const element = getHostHTMLElement();
      const lineBg = element.querySelector('.mzn-progress__line-bg') as HTMLElement;

      expect(lineBg?.style.width).toBe('50%');
    });

    it('should limit percent to 0 when less than 0', () => {
      const { getHostHTMLElement } = render(<Progress percent={-10} />);
      const element = getHostHTMLElement();
      const lineBg = element.querySelector('.mzn-progress__line-bg') as HTMLElement;

      expect(lineBg?.style.width).toBe('0%');
    });

    it('should limit percent to 100 when greater than 100', () => {
      const { getHostHTMLElement } = render(<Progress percent={150} />);
      const element = getHostHTMLElement();
      const lineBg = element.querySelector('.mzn-progress__line-bg') as HTMLElement;

      expect(lineBg?.style.width).toBe('100%');
    });

    it('should display percent text when type is percent', () => {
      const { getHostHTMLElement } = render(<Progress percent={50} type="percent" />);
      const element = getHostHTMLElement();
      const infoPercent = element.querySelector('.mzn-progress__info-percent');

      expect(infoPercent?.textContent).toBe('50%');
    });
  });

  describe('prop: status', () => {
    it('should set status to enabled when percent < 100', () => {
      const { getHostHTMLElement } = render(<Progress percent={50} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-progress--success')).toBeFalsy();
      expect(element.classList.contains('mzn-progress--error')).toBeFalsy();
    });

    it('should set status to success when percent = 100', () => {
      const { getHostHTMLElement } = render(<Progress percent={100} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-progress--success')).toBeTruthy();
    });

    it('should render success icon when status is success and type is icon', () => {
      const { getHostHTMLElement } = render(<Progress percent={100} type="icon" />);
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-progress__info-icon');

      expect(icon).toBeTruthy();
      expect(icon?.getAttribute('data-icon-name')).toBe(
        CheckedFilledIcon.name,
      );
    });

    it('should render error icon when status is error and type is icon', () => {
      const { getHostHTMLElement } = render(
        <Progress percent={50} status="error" type="icon" />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-progress__info-icon');

      expect(element.classList.contains('mzn-progress--error')).toBeTruthy();
      expect(icon).toBeTruthy();
      expect(icon?.getAttribute('data-icon-name')).toBe(
        DangerousFilledIcon.name,
      );
    });

    it('should allow manual status override', () => {
      const { getHostHTMLElement } = render(
        <Progress percent={100} status="enabled" />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-progress--success')).toBeFalsy();
      expect(element.classList.contains('mzn-progress--error')).toBeFalsy();
    });

    it('should allow manual status override to error', () => {
      const { getHostHTMLElement } = render(
        <Progress percent={100} status="error" />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-progress--error')).toBeTruthy();
    });
  });


  describe('prop: icons', () => {
    it('should use custom success icon when provided', () => {
      const { getHostHTMLElement } = render(
        <Progress
          percent={100}
          type="icon"
          icons={{ success: PlusIcon }}
        />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-progress__info-icon');

      expect(icon).toBeTruthy();
      expect(icon?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });

    it('should use custom error icon when provided', () => {
      const { getHostHTMLElement } = render(
        <Progress
          percent={50}
          status="error"
          type="icon"
          icons={{ error: PlusIcon }}
        />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-progress__info-icon');

      expect(icon).toBeTruthy();
      expect(icon?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });
  });

  describe('prop: percentProps', () => {
    it('should pass props to percent Typography component', () => {
      const { getHostHTMLElement } = render(
        <Progress percent={50} type="percent" percentProps={{ variant: 'caption' }} />,
      );
      const element = getHostHTMLElement();
      const infoPercent = element.querySelector('.mzn-progress__info-percent');

      expect(infoPercent).toBeTruthy();
      expect(infoPercent?.textContent).toBe('50%');
    });
  });


  describe('prop: type', () => {
    it('should render type="progress" by default', () => {
      const { getHostHTMLElement } = render(<Progress percent={50} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-progress--progress')).toBeTruthy();
    });

    it('should render only percent when type="percent"', () => {
      const { getHostHTMLElement } = render(
        <Progress percent={75} type="percent" />,
      );
      const element = getHostHTMLElement();
      const infoPercent = element.querySelector('.mzn-progress__info-percent');
      const infoIcon = element.querySelector('.mzn-progress__info-icon');

      expect(infoPercent).toBeTruthy();
      expect(infoPercent?.textContent).toBe('75%');
      expect(infoIcon).toBeNull();
    });

    it('should render only icon when type="icon" and status is success', () => {
      const { getHostHTMLElement } = render(
        <Progress percent={100} type="icon" />,
      );
      const element = getHostHTMLElement();
      const infoPercent = element.querySelector('.mzn-progress__info-percent');
      const infoIcon = element.querySelector('.mzn-progress__info-icon');

      expect(infoPercent).toBeNull();
      expect(infoIcon).toBeTruthy();
      expect(infoIcon?.getAttribute('data-icon-name')).toBe(
        CheckedFilledIcon.name,
      );
    });

    it('should render only icon when type="icon" and status is error', () => {
      const { getHostHTMLElement } = render(
        <Progress percent={50} status="error" type="icon" />,
      );
      const element = getHostHTMLElement();
      const infoPercent = element.querySelector('.mzn-progress__info-percent');
      const infoIcon = element.querySelector('.mzn-progress__info-icon');

      expect(infoPercent).toBeNull();
      expect(infoIcon).toBeTruthy();
      expect(infoIcon?.getAttribute('data-icon-name')).toBe(
        DangerousFilledIcon.name,
      );
    });

    it('should not render icon when type="icon" and status is enabled', () => {
      const { getHostHTMLElement } = render(
        <Progress percent={50} status="enabled" type="icon" />,
      );
      const element = getHostHTMLElement();
      const infoPercent = element.querySelector('.mzn-progress__info-percent');
      const infoIcon = element.querySelector('.mzn-progress__info-icon');

      expect(infoPercent).toBeNull();
      expect(infoIcon).toBeNull();
    });
  });
});
