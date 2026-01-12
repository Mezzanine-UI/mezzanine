import { cleanup, render, act, fireEvent } from '../../__test-utils__';
import { CopyIcon, QuestionOutlineIcon } from '@mezzanine-ui/icons';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { Description } from '.';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

describe('<Description />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Description
        ref={ref}
        title="title"
        contentProps={{
          children: 'content',
        }}
      />,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Description
        className={className}
        title="title"
        contentProps={{
          children: 'content',
        }}
      />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Description
        title="title"
        contentProps={{
          children: 'content',
        }}
      />,
    );
    const element = getHostHTMLElement();

    expect(element!.classList.contains('mzn-description')).toBeTruthy();
  });

  describe('title component in description', () => {
    it('give badge to title', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          badge="dot-success"
          contentProps={{
            children: 'content',
          }}
        />,
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
        <Description
          title="title"
          icon={QuestionOutlineIcon}
          contentProps={{
            children: 'content',
          }}
        />,
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
        <Description
          title="title"
          icon={QuestionOutlineIcon}
          tooltip="Hello"
          contentProps={{
            children: 'content',
          }}
        />,
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

  describe('prop: contentProps', () => {
    it('default variant of content is "normal"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            children: 'content',
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--normal',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "statistic"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            variant: 'statistic',
            children: 'content',
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--statistic',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "trend-up"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            variant: 'trend-up',
            children: 'content',
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--trend-up',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "trend-down"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            variant: 'trend-down',
            children: 'content',
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--trend-down',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "with-icon"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            variant: 'with-icon',
            icon: CopyIcon,
            children: 'content',
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName(
        'mzn-description-content--with-icon',
      );

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "badge"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            variant: 'badge',
            badge: {
              variant: 'dot-success',
              text: 'content',
            },
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName('mzn-badge');

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "button"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            variant: 'button',
            button: {
              variant: 'base-text-link',
              children: 'content',
              size: 'sub',
            },
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName('mzn-button');

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "progress"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            variant: 'progress',
            progress: {
              percent: 80,
              type: 'percent',
            },
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName('mzn-progress');

      expect(contents.length).toBe(1);
    });

    it('when variant of content is "tags"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            variant: 'tags',
            tags: [
              {
                label: 'tag',
              },
            ],
          }}
        />,
      );
      const element = getHostHTMLElement();
      const contents = element.getElementsByClassName('mzn-tag__group');

      expect(contents.length).toBe(1);
    });
  });

  describe('prop: orientation', () => {
    it('default orientation is "horizontal"', () => {
      const { getHostHTMLElement } = render(
        <Description
          title="title"
          contentProps={{
            children: 'content',
          }}
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description--horizontal'),
      ).toBeTruthy();
    });

    it('when orientation is "vertical"', () => {
      const { getHostHTMLElement } = render(
        <Description
          orientation="vertical"
          title="title"
          contentProps={{
            children: 'content',
          }}
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description--vertical'),
      ).toBeTruthy();
    });
  });
});
