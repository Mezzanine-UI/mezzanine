import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { SingleThumbnailCardGeneric as SingleThumbnailCard } from '.';

const sampleImage = <img alt="test" src="test.jpg" />;

describe('<SingleThumbnailCard />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <SingleThumbnailCard ref={ref} title="">
        {sampleImage}
      </SingleThumbnailCard>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <SingleThumbnailCard className={className} title="">
        {sampleImage}
      </SingleThumbnailCard>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <SingleThumbnailCard title="">{sampleImage}</SingleThumbnailCard>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.thumbnail)).toBeTruthy();
  });

  it('should render as div by default', () => {
    const { getHostHTMLElement } = render(
      <SingleThumbnailCard title="">{sampleImage}</SingleThumbnailCard>,
    );
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('should render as anchor when component="a"', () => {
    const { getHostHTMLElement } = render(
      <SingleThumbnailCard<'a'>
        component="a"
        href="https://example.com"
        title=""
      >
        {sampleImage}
      </SingleThumbnailCard>,
    );
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element.getAttribute('href')).toBe('https://example.com');
  });

  it('should render single thumbnail container with overlay', () => {
    const { getHostHTMLElement } = render(
      <SingleThumbnailCard title="">{sampleImage}</SingleThumbnailCard>,
    );
    const element = getHostHTMLElement();
    const thumbnailContainer = element.querySelector(
      `.${classes.singleThumbnail}`,
    );
    const overlay = element.querySelector(`.${classes.singleThumbnailOverlay}`);

    expect(thumbnailContainer).toBeTruthy();
    expect(overlay).toBeTruthy();
  });

  it('should render children (image) in thumbnail container', () => {
    const { getHostHTMLElement } = render(
      <SingleThumbnailCard title="">{sampleImage}</SingleThumbnailCard>,
    );
    const element = getHostHTMLElement();
    const thumbnailContainer = element.querySelector(
      `.${classes.singleThumbnail}`,
    );
    const img = thumbnailContainer?.querySelector('img');

    expect(img).toBeTruthy();
    expect(img?.getAttribute('alt')).toBe('test');
  });

  describe('prop: tag', () => {
    it('should render tag when provided', () => {
      const { getByText } = render(
        <SingleThumbnailCard title="" tag="New">
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const tagElement = getByText('New');

      expect(tagElement.classList.contains(classes.thumbnailTag)).toBeTruthy();
    });

    it('should not render tag when not provided', () => {
      const { getHostHTMLElement } = render(
        <SingleThumbnailCard title="">{sampleImage}</SingleThumbnailCard>,
      );
      const element = getHostHTMLElement();
      const tagElement = element.querySelector(`.${classes.thumbnailTag}`);

      expect(tagElement).toBeNull();
    });
  });

  describe('prop: personalAction', () => {
    it('should render personal action button when icon is provided', () => {
      const { getByRole } = render(
        <SingleThumbnailCard title="" personalActionIcon={StarOutlineIcon}>
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const button = getByRole('button', { name: 'Personal Action' });

      expect(button).toBeTruthy();
      expect(
        button.classList.contains(classes.thumbnailPersonalAction),
      ).toBeTruthy();
    });

    it('should not render personal action button when icon is not provided', () => {
      const { getHostHTMLElement } = render(
        <SingleThumbnailCard title="">{sampleImage}</SingleThumbnailCard>,
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
        <SingleThumbnailCard
          title=""
          personalActionIcon={StarOutlineIcon}
          personalActionOnClick={handleClick}
        >
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const button = getByRole('button', { name: 'Personal Action' });

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object), false);
    });

    it('should pass active state to onClick handler', () => {
      const handleClick = jest.fn();
      const { getByRole } = render(
        <SingleThumbnailCard
          title=""
          personalActionActive
          personalActionIcon={StarOutlineIcon}
          personalActionOnClick={handleClick}
        >
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const button = getByRole('button', { name: 'Personal Action' });

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object), true);
    });

    it('should use activeIcon when personalActionActive is true', () => {
      const { container } = render(
        <SingleThumbnailCard
          title=""
          personalActionActive
          personalActionActiveIcon={StarFilledIcon}
          personalActionIcon={StarOutlineIcon}
        >
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const icon = container.querySelector(
        `.${classes.thumbnailPersonalAction} [data-icon-name="star-filled"]`,
      );

      expect(icon).toBeTruthy();
    });

    it('should use regular icon when personalActionActive is false', () => {
      const { container } = render(
        <SingleThumbnailCard
          title=""
          personalActionActive={false}
          personalActionActiveIcon={StarFilledIcon}
          personalActionIcon={StarOutlineIcon}
        >
          {sampleImage}
        </SingleThumbnailCard>,
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
        <SingleThumbnailCard title="Document Title">
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const titleElement = getByText('Document Title');

      expect(
        titleElement.classList.contains(classes.thumbnailInfoTitle),
      ).toBeTruthy();
    });
  });

  describe('prop: subtitle', () => {
    it('should render subtitle in info section', () => {
      const { getByText } = render(
        <SingleThumbnailCard title="" subtitle="2.4 MB">
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const subtitleElement = getByText('2.4 MB');

      expect(
        subtitleElement.classList.contains(classes.thumbnailInfoSubtitle),
      ).toBeTruthy();
    });
  });

  describe('prop: filetype', () => {
    it('should render filetype badge', () => {
      const { getByText } = render(
        <SingleThumbnailCard title="" filetype="pdf">
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const filetypeElement = getByText('PDF');

      expect(
        filetypeElement.classList.contains(classes.thumbnailInfoFiletype),
      ).toBeTruthy();
    });

    it('should apply correct category class for known filetype', () => {
      const { getByText } = render(
        <SingleThumbnailCard title="" filetype="jpg">
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const filetypeElement = getByText('JPG');

      expect(
        filetypeElement.classList.contains(
          `${classes.thumbnailInfoFiletype}--image`,
        ),
      ).toBeTruthy();
    });

    it('should not apply category class for unknown filetype', () => {
      const { getByText } = render(
        <SingleThumbnailCard title="" filetype="xyz">
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const filetypeElement = getByText('XYZ');

      expect(
        filetypeElement.classList.contains(classes.thumbnailInfoFiletype),
      ).toBeTruthy();
      // Should not have any category modifier class
      expect(
        filetypeElement.className.includes(
          `${classes.thumbnailInfoFiletype}--`,
        ),
      ).toBeFalsy();
    });
  });

  describe('prop: type', () => {
    it('should render type="default" by default (no action)', () => {
      const { getHostHTMLElement } = render(
        <SingleThumbnailCard title="Title">{sampleImage}</SingleThumbnailCard>,
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
        <SingleThumbnailCard title="" actionName="Download" type="action">
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const button = getByRole('button');

      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Download');
    });

    it('should call onActionClick when action button is clicked', () => {
      const handleClick = jest.fn();
      const { getByRole } = render(
        <SingleThumbnailCard
          title=""
          actionName="Download"
          onActionClick={handleClick}
          type="action"
        >
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const button = getByRole('button');

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('type: overflow', () => {
    const options = [
      { id: 'download', name: 'Download' },
      { id: 'delete', name: 'Delete' },
    ];

    it('should render dropdown button in info section', () => {
      const { getByRole } = render(
        <SingleThumbnailCard title="" options={options} type="overflow">
          {sampleImage}
        </SingleThumbnailCard>,
      );

      const button = getByRole('button');

      expect(button).toBeTruthy();
    });
  });
});
