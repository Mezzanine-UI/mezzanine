import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { BaseCardGeneric as BaseCard, CardGroup } from '.';

const originalConsoleWarn = console.warn;

describe('<CardGroup />', () => {
  beforeEach(() => {
    console.warn = jest.fn();
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
    cleanup();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CardGroup ref={ref}>
        <BaseCard>Card 1</BaseCard>
      </CardGroup>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CardGroup className={className}>
        <BaseCard>Card 1</BaseCard>
      </CardGroup>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CardGroup>
        <BaseCard>Card 1</BaseCard>
      </CardGroup>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.group)).toBeTruthy();
  });

  it('should render multiple BaseCard children', () => {
    const { getHostHTMLElement } = render(
      <CardGroup>
        <BaseCard>Card 1</BaseCard>
        <BaseCard>Card 2</BaseCard>
        <BaseCard>Card 3</BaseCard>
      </CardGroup>,
    );
    const element = getHostHTMLElement();
    const cards = element.querySelectorAll(`.${classes.base}`);

    expect(cards.length).toBe(3);
  });

  it('should warn and filter out invalid children', () => {
    const { getHostHTMLElement } = render(
      <CardGroup>
        <BaseCard>Valid Card</BaseCard>
        <div>Invalid Child</div>
        <span>Another Invalid</span>
      </CardGroup>,
    );
    const element = getHostHTMLElement();
    const cards = element.querySelectorAll(`.${classes.base}`);

    expect(cards.length).toBe(1);
    expect(console.warn).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[CardGroup] Invalid child type'),
    );
  });

  it('should allow text nodes without warning', () => {
    const { getHostHTMLElement } = render(
      <CardGroup>
        <BaseCard>Card 1</BaseCard>
        {/* Text nodes are allowed */}
      </CardGroup>,
    );
    const element = getHostHTMLElement();

    expect(element).toBeTruthy();
  });

  it('should render empty when no children provided', () => {
    const { getHostHTMLElement } = render(<CardGroup />);
    const element = getHostHTMLElement();

    expect(element.children.length).toBe(0);
  });

  it('should handle null and undefined children gracefully', () => {
    const { getHostHTMLElement } = render(
      <CardGroup>
        {null}
        <BaseCard>Card 1</BaseCard>
        {undefined}
        <BaseCard>Card 2</BaseCard>
      </CardGroup>,
    );
    const element = getHostHTMLElement();
    const cards = element.querySelectorAll(`.${classes.base}`);

    expect(cards.length).toBe(2);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
