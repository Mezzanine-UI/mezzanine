import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import {
  FourThumbnailCardGeneric as FourThumbnailCard,
  ThumbnailGeneric as Thumbnail,
} from '.';

const sampleImage = <img alt="test" src="test.jpg" />;

const createThumbnails = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <Thumbnail key={i} title={`Photo ${i + 1}`}>
      <img alt={`test-${i}`} src={`test-${i}.jpg`} />
    </Thumbnail>
  ));

describe('<FourThumbnailCard />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <FourThumbnailCard ref={ref} title="">
        {createThumbnails(4)}
      </FourThumbnailCard>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <FourThumbnailCard className={className} title="">
        {createThumbnails(4)}
      </FourThumbnailCard>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <FourThumbnailCard title="">{createThumbnails(4)}</FourThumbnailCard>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.thumbnail)).toBeTruthy();
  });

  it('should render as div by default', () => {
    const { getHostHTMLElement } = render(
      <FourThumbnailCard title="">{createThumbnails(4)}</FourThumbnailCard>,
    );
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('should render as anchor when component="a"', () => {
    const { getHostHTMLElement } = render(
      <FourThumbnailCard<'a'> component="a" href="https://example.com" title="">
        {createThumbnails(4)}
      </FourThumbnailCard>,
    );
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element.getAttribute('href')).toBe('https://example.com');
  });

  it('should render four thumbnail grid container', () => {
    const { getHostHTMLElement } = render(
      <FourThumbnailCard title="">{createThumbnails(4)}</FourThumbnailCard>,
    );
    const element = getHostHTMLElement();
    const gridContainer = element.querySelector(`.${classes.fourThumbnail}`);

    expect(gridContainer).toBeTruthy();
  });

  describe('children rendering', () => {
    it('should render 4 Thumbnail children', () => {
      const { getHostHTMLElement } = render(
        <FourThumbnailCard title="">{createThumbnails(4)}</FourThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const thumbnails = element.querySelectorAll(
        `.${classes.fourThumbnailThumbnail}`,
      );

      expect(thumbnails.length).toBe(4);
    });

    it('should fill empty slots when less than 4 children provided', () => {
      const { getHostHTMLElement } = render(
        <FourThumbnailCard title="">{createThumbnails(2)}</FourThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const allSlots = element.querySelectorAll(
        `.${classes.fourThumbnailThumbnail}`,
      );
      const emptySlots = element.querySelectorAll(
        `.${classes.fourThumbnailThumbnailEmpty}`,
      );

      expect(allSlots.length).toBe(4);
      expect(emptySlots.length).toBe(2);
    });

    it('should render 4 empty slots when no children provided', () => {
      const { getHostHTMLElement } = render(
        <FourThumbnailCard title="">{[]}</FourThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const emptySlots = element.querySelectorAll(
        `.${classes.fourThumbnailThumbnailEmpty}`,
      );

      expect(emptySlots.length).toBe(4);
    });

    it('should only render first 4 children when more than 4 provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const { getHostHTMLElement } = render(
        <FourThumbnailCard title="">{createThumbnails(6)}</FourThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const thumbnails = element.querySelectorAll(
        `.${classes.fourThumbnailThumbnail}`,
      );
      const emptySlots = element.querySelectorAll(
        `.${classes.fourThumbnailThumbnailEmpty}`,
      );

      expect(thumbnails.length).toBe(4);
      expect(emptySlots.length).toBe(0);

      warnSpy.mockRestore();
    });

    it('should warn in development when more than 4 children provided', () => {
      const originalEnv = process.env.NODE_ENV;

      Object.defineProperty(process.env, 'NODE_ENV', {
        configurable: true,
        value: 'development',
        writable: true,
      });

      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <FourThumbnailCard title="">{createThumbnails(6)}</FourThumbnailCard>,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Received 6 Thumbnail children'),
      );

      warnSpy.mockRestore();
      Object.defineProperty(process.env, 'NODE_ENV', {
        configurable: true,
        value: originalEnv,
        writable: true,
      });
    });

    it('should filter out non-Thumbnail children', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const { getHostHTMLElement } = render(
        <FourThumbnailCard title="">
          <Thumbnail title="Valid">{sampleImage}</Thumbnail>
          <div>Invalid child</div>
          <Thumbnail title="Valid 2">{sampleImage}</Thumbnail>
        </FourThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const thumbnails = element.querySelectorAll(
        `.${classes.fourThumbnailThumbnail}`,
      );
      const emptySlots = element.querySelectorAll(
        `.${classes.fourThumbnailThumbnailEmpty}`,
      );

      // 2 valid thumbnails + 2 empty slots = 4
      expect(thumbnails.length).toBe(4);
      expect(emptySlots.length).toBe(2);

      warnSpy.mockRestore();
    });
  });

  describe('prop: tag', () => {
    it('should render tag when provided', () => {
      const { getByText } = render(
        <FourThumbnailCard tag="Album" title="">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const tagElement = getByText('Album');

      expect(tagElement.classList.contains(classes.thumbnailTag)).toBeTruthy();
    });

    it('should not render tag when not provided', () => {
      const { getHostHTMLElement } = render(
        <FourThumbnailCard title="">{createThumbnails(4)}</FourThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const tagElement = element.querySelector(`.${classes.thumbnailTag}`);

      expect(tagElement).toBeNull();
    });
  });

  describe('prop: personalAction', () => {
    it('should render personal action button when icon is provided', () => {
      const { getByRole } = render(
        <FourThumbnailCard personalActionIcon={StarOutlineIcon} title="">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const button = getByRole('button', { name: 'Personal Action' });

      expect(button).toBeTruthy();
      expect(
        button.classList.contains(classes.thumbnailPersonalAction),
      ).toBeTruthy();
    });

    it('should not render personal action button when icon is not provided', () => {
      const { getHostHTMLElement } = render(
        <FourThumbnailCard title="">{createThumbnails(4)}</FourThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector(
        `.${classes.thumbnailPersonalAction}`,
      );

      expect(button).toBeNull();
    });

    it('should call personalActionOnClick when clicked', () => {
      const handleClick = jest.fn();
      const { getByRole } = render(
        <FourThumbnailCard
          personalActionIcon={StarOutlineIcon}
          personalActionOnClick={handleClick}
          title=""
        >
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const button = getByRole('button', { name: 'Personal Action' });

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object), false);
    });

    it('should pass active state to onClick handler', () => {
      const handleClick = jest.fn();
      const { getByRole } = render(
        <FourThumbnailCard
          personalActionActive
          personalActionIcon={StarOutlineIcon}
          personalActionOnClick={handleClick}
          title=""
        >
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const button = getByRole('button', { name: 'Personal Action' });

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object), true);
    });

    it('should use activeIcon when personalActionActive is true', () => {
      const { container } = render(
        <FourThumbnailCard
          personalActionActive
          personalActionActiveIcon={StarFilledIcon}
          personalActionIcon={StarOutlineIcon}
          title=""
        >
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const icon = container.querySelector(
        `.${classes.thumbnailPersonalAction} [data-icon-name="star-filled"]`,
      );

      expect(icon).toBeTruthy();
    });

    it('should use regular icon when personalActionActive is false', () => {
      const { container } = render(
        <FourThumbnailCard
          personalActionActive={false}
          personalActionActiveIcon={StarFilledIcon}
          personalActionIcon={StarOutlineIcon}
          title=""
        >
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const icon = container.querySelector(
        `.${classes.thumbnailPersonalAction} [data-icon-name="star-outline"]`,
      );

      expect(icon).toBeTruthy();
    });
  });

  describe('prop: title', () => {
    it('should render title in info section', () => {
      const { getByText } = render(
        <FourThumbnailCard title="Album Title">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const titleElement = getByText('Album Title');

      expect(
        titleElement.classList.contains(classes.thumbnailInfoTitle),
      ).toBeTruthy();
    });
  });

  describe('prop: subtitle', () => {
    it('should render subtitle in info section', () => {
      const { getByText } = render(
        <FourThumbnailCard subtitle="4 photos" title="">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const subtitleElement = getByText('4 photos');

      expect(
        subtitleElement.classList.contains(classes.thumbnailInfoSubtitle),
      ).toBeTruthy();
    });
  });

  describe('prop: filetype', () => {
    it('should render filetype badge', () => {
      const { getByText } = render(
        <FourThumbnailCard filetype="jpg" title="">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const filetypeElement = getByText('JPG');

      expect(
        filetypeElement.classList.contains(classes.thumbnailInfoFiletype),
      ).toBeTruthy();
    });

    it('should apply correct category class for known filetype', () => {
      const { getByText } = render(
        <FourThumbnailCard filetype="jpg" title="">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const filetypeElement = getByText('JPG');

      expect(
        filetypeElement.classList.contains(
          `${classes.thumbnailInfoFiletype}--image`,
        ),
      ).toBeTruthy();
    });
  });

  describe('prop: type', () => {
    it('should render type="default" by default (no action)', () => {
      const { getHostHTMLElement } = render(
        <FourThumbnailCard title="Title">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const infoAction = element.querySelector(
        `.${classes.thumbnailInfoAction}`,
      );

      expect(infoAction).toBeNull();
    });
  });

  describe('type: action', () => {
    it('should render action button in info section', () => {
      const { getByRole } = render(
        <FourThumbnailCard actionName="View All" title="" type="action">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const button = getByRole('button');

      expect(button).toBeTruthy();
      expect(button.textContent).toBe('View All');
    });

    it('should call onActionClick when action button is clicked', () => {
      const handleClick = jest.fn();
      const { getByRole } = render(
        <FourThumbnailCard
          actionName="View All"
          onActionClick={handleClick}
          title=""
          type="action"
        >
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const button = getByRole('button');

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('type: overflow', () => {
    const options = [
      { id: 'download', name: 'Download All' },
      { id: 'delete', name: 'Delete' },
    ];

    it('should render dropdown button in info section', () => {
      const { getByRole } = render(
        <FourThumbnailCard options={options} title="" type="overflow">
          {createThumbnails(4)}
        </FourThumbnailCard>,
      );

      const button = getByRole('button');

      expect(button).toBeTruthy();
    });
  });
});
