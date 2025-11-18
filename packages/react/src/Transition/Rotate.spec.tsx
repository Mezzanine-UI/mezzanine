import { cleanup, render } from '../../__test-utils__';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Rotate from './Rotate';

describe('<Rotate />', () => {
  afterEach(cleanup);

  it('should rotate to specified degrees when in is true', () => {
    const { getHostHTMLElement } = render(
      <Rotate degrees={180} in>
        <Icon icon={ChevronDownIcon} />
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.transform).toBe('rotate(180deg)');
  });

  it('should rotate to 0 degrees when in is false', () => {
    const { getHostHTMLElement } = render(
      <Rotate degrees={180} in={false}>
        <Icon icon={ChevronDownIcon} />
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.transform).toBe('rotate(0deg)');
  });

  it('should use default degrees of 180', () => {
    const { getHostHTMLElement } = render(
      <Rotate in>
        <Icon icon={ChevronDownIcon} />
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.transform).toBe('rotate(180deg)');
  });

  it('should apply custom transform origin', () => {
    const { getHostHTMLElement } = render(
      <Rotate in transformOrigin="top left">
        <Icon icon={ChevronDownIcon} />
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.transformOrigin).toBe('top left');
  });

  it('should use default transform origin of center', () => {
    const { getHostHTMLElement } = render(
      <Rotate in>
        <Icon icon={ChevronDownIcon} />
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.transformOrigin).toBe('center');
  });

  it('should apply transition with custom duration', () => {
    const { getHostHTMLElement } = render(
      <Rotate duration={300} in>
        <Icon icon={ChevronDownIcon} />
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.transition).toContain('300ms');
  });

  it('should apply transition with custom easing', () => {
    const customEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';
    const { getHostHTMLElement } = render(
      <Rotate easing={customEasing} in>
        <Icon icon={ChevronDownIcon} />
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.transition).toContain(customEasing);
  });

  it('should always render child element (no unmount)', () => {
    const { getHostHTMLElement, rerender } = render(
      <Rotate in>
        <div data-testid="content">Always visible</div>
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.textContent).toBe('Always visible');

    rerender(
      <Rotate in={false}>
        <div data-testid="content">Always visible</div>
      </Rotate>,
    );

    // Element should still be in DOM
    expect(element.textContent).toBe('Always visible');
    expect(element.style.visibility).not.toBe('hidden');
  });

  it('should support negative degrees', () => {
    const { getHostHTMLElement } = render(
      <Rotate degrees={-90} in>
        <Icon icon={ChevronDownIcon} />
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.transform).toBe('rotate(-90deg)');
  });

  it('should preserve child styles', () => {
    const { getHostHTMLElement } = render(
      <Rotate in>
        <div style={{ color: 'red', fontSize: '16px' }}>Content</div>
      </Rotate>,
    );

    const element = getHostHTMLElement();

    expect(element.style.color).toBe('red');
    expect(element.style.fontSize).toBe('16px');
  });
});
