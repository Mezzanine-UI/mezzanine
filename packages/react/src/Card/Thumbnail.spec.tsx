import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { ThumbnailGeneric as Thumbnail } from '.';

const sampleImage = <img alt="test" src="test.jpg" />;

describe('<Thumbnail />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Thumbnail ref={ref}>{sampleImage}</Thumbnail>),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Thumbnail className={className}>{sampleImage}</Thumbnail>),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Thumbnail>{sampleImage}</Thumbnail>);
    const element = getHostHTMLElement();

    expect(
      element.classList.contains(classes.fourThumbnailThumbnail),
    ).toBeTruthy();
  });

  it('should render as div by default', () => {
    const { getHostHTMLElement } = render(<Thumbnail>{sampleImage}</Thumbnail>);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('should render as anchor when component="a"', () => {
    const { getHostHTMLElement } = render(
      <Thumbnail<'a'> component="a" href="https://example.com">
        {sampleImage}
      </Thumbnail>,
    );
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element.getAttribute('href')).toBe('https://example.com');
  });

  it('should render as button when component="button"', () => {
    const handleClick = jest.fn();
    const { getHostHTMLElement } = render(
      <Thumbnail<'button'>
        component="button"
        onClick={handleClick}
        type="button"
      >
        {sampleImage}
      </Thumbnail>,
    );
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('button');

    fireEvent.click(element);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render children (image)', () => {
    const { getHostHTMLElement } = render(<Thumbnail>{sampleImage}</Thumbnail>);
    const element = getHostHTMLElement();
    const img = element.querySelector('img');

    expect(img).toBeTruthy();
    expect(img?.getAttribute('alt')).toBe('test');
  });

  it('should render overlay element', () => {
    const { getHostHTMLElement } = render(<Thumbnail>{sampleImage}</Thumbnail>);
    const element = getHostHTMLElement();
    const overlay = element.querySelector(`.${classes.fourThumbnailOverlay}`);

    expect(overlay).toBeTruthy();
  });

  describe('prop: title', () => {
    it('should render title in overlay when provided', () => {
      const { getByText } = render(
        <Thumbnail title="Photo Title">{sampleImage}</Thumbnail>,
      );

      const titleElement = getByText('Photo Title');

      expect(titleElement.tagName.toLowerCase()).toBe('span');
    });

    it('should not render title span when not provided', () => {
      const { getHostHTMLElement } = render(
        <Thumbnail>{sampleImage}</Thumbnail>,
      );
      const element = getHostHTMLElement();
      const overlay = element.querySelector(`.${classes.fourThumbnailOverlay}`);
      const span = overlay?.querySelector('span');

      expect(span).toBeNull();
    });
  });
});
