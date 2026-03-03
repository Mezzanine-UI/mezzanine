import { cleanup, render, act, fireEvent } from '../../__test-utils__';
import { CopyIcon, QuestionOutlineIcon } from '@mezzanine-ui/icons';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Badge from '../Badge';
import Button from '../Button';
import Progress from '../Progress';
import Tag from '../Tag';
import TagGroup from '../Tag/TagGroup';
import { Description, DescriptionContent } from '.';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

describe('<Description />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Description ref={ref} title="title">
        <DescriptionContent>content</DescriptionContent>
      </Description>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Description className={className} title="title">
        <DescriptionContent>content</DescriptionContent>
      </Description>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Description title="title">
        <DescriptionContent>content</DescriptionContent>
      </Description>,
    );
    const element = getHostHTMLElement();

    expect(element!.classList.contains('mzn-description')).toBeTruthy();
  });

  describe('title component in description', () => {
    it('give badge to title', () => {
      const { getHostHTMLElement } = render(
        <Description title="title" badge="dot-success">
          <DescriptionContent>content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const [titleElement] = element.getElementsByClassName(
        'mzn-description-title',
      );

      expect(
        titleElement.firstElementChild!.classList.contains(
          'mzn-badge__container',
        ),
      ).toBeTruthy();
    });

    it('give icon to title', () => {
      const { getHostHTMLElement } = render(
        <Description title="title" icon={QuestionOutlineIcon}>
          <DescriptionContent>content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const [titleElement] = element.getElementsByClassName(
        'mzn-description-title',
      );

      const [iconElement] = titleElement.getElementsByTagName('i');

      expect(iconElement!.classList.contains('mzn-icon')).toBeTruthy();
    });

    it('give icon and tooltip to title', async () => {
      const { getHostHTMLElement } = render(
        <Description title="title" icon={QuestionOutlineIcon} tooltip="Hello">
          <DescriptionContent>content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const [titleElement] = element.getElementsByClassName(
        'mzn-description-title',
      );

      const [iconElement] = titleElement.getElementsByTagName('i');

      expect(iconElement!.classList.contains('mzn-icon')).toBeTruthy();

      await act(async () => {
        fireEvent.mouseEnter(iconElement);
      });

      const popperElement = getPopperContainer();

      expect(popperElement?.textContent).toBe('Hello');
    });
  });

  describe('content component in description', () => {
    it('default variant of content is "normal"', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <DescriptionContent>content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--normal',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "statistic"', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <DescriptionContent variant="statistic">content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--statistic',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "trend-up"', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <DescriptionContent variant="trend-up">content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--trend-up',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "trend-down"', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <DescriptionContent variant="trend-down">content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--trend-down',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "with-icon"', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <DescriptionContent variant="with-icon" icon={CopyIcon}>
            content
          </DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--with-icon',
      );

      expect(contents.length).toBe(1);
    });

    it('use Badge', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <Badge variant="dot-success" text="content" />
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName('mzn-badge');

      expect(contents.length).toBe(1);
    });

    it('use Button', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <Button variant="base-text-link" size="sub">
            button
          </Button>
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName('mzn-button');

      expect(contents.length).toBe(1);
    });

    it('use Progress', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <Progress percent={80} type="percent" />
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName('mzn-progress');

      expect(contents.length).toBe(1);
    });

    it('use TagGroup', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <TagGroup>
            <Tag label="tag" />
          </TagGroup>
        </Description>,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName('mzn-tag__group');

      expect(contents.length).toBe(1);
    });
  });

  describe('prop: size', () => {
    it('default size is "main", content should have mzn-description-content--main class', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <DescriptionContent>content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const [contentElement] = element.getElementsByClassName(
        'mzn-description-content',
      );

      expect(
        contentElement!.classList.contains('mzn-description-content--main'),
      ).toBeTruthy();
    });

    it('when size is "sub", content should have mzn-description-content--sub class', () => {
      const { getHostHTMLElement } = render(
        <Description size="sub" title="title">
          <DescriptionContent>content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();
      const [contentElement] = element.getElementsByClassName(
        'mzn-description-content',
      );

      expect(
        contentElement!.classList.contains('mzn-description-content--sub'),
      ).toBeTruthy();
    });
  });

  describe('prop: orientation', () => {
    it('default orientation is "horizontal"', () => {
      const { getHostHTMLElement } = render(
        <Description title="title">
          <DescriptionContent>content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description--horizontal'),
      ).toBeTruthy();
    });

    it('when orientation is "vertical"', () => {
      const { getHostHTMLElement } = render(
        <Description orientation="vertical" title="title">
          <DescriptionContent>content</DescriptionContent>
        </Description>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description--vertical'),
      ).toBeTruthy();
    });
  });
});
