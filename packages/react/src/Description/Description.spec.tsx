import { cleanup, render } from '../../__test-utils__';
import { CopyIcon, QuestionOutlineIcon } from '@mezzanine-ui/icons';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { Description } from '.';

describe('<Description />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Description
        ref={ref}
        titleProps={{
          children: 'title',
        }}
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
        titleProps={{
          children: 'title',
        }}
        contentProps={{
          children: 'content',
        }}
      />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Description
        titleProps={{
          children: 'title',
        }}
        contentProps={{
          children: 'content',
        }}
      />,
    );
    const element = getHostHTMLElement();

    expect(element!.classList.contains('mzn-description')).toBeTruthy();
  });

  describe('prop: titleProps', () => {
    it('give badge to title', () => {
      const { getHostHTMLElement } = render(
        <Description
          titleProps={{
            badge: 'dot-success',
            children: 'title',
          }}
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
          titleProps={{
            icon: QuestionOutlineIcon,
            children: 'title',
          }}
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
  });

  describe('prop: contentProps', () => {
    it('default content is "normal"', () => {
      const { getHostHTMLElement } = render(
        <Description
          titleProps={{
            children: 'title',
          }}
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

    it('when content is "statistic"', () => {
      const { getHostHTMLElement } = render(
        <Description
          titleProps={{
            children: 'title',
          }}
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

    it('when content is "trend-up"', () => {
      const { getHostHTMLElement } = render(
        <Description
          titleProps={{
            children: 'title',
          }}
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

    it('when content is "trend-down"', () => {
      const { getHostHTMLElement } = render(
        <Description
          titleProps={{
            children: 'title',
          }}
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

    it('when content is "with-icon"', () => {
      const { getHostHTMLElement } = render(
        <Description
          titleProps={{
            children: 'title',
          }}
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
  });

  describe('prop: orientation', () => {
    it('default orientation is "horizontal"', () => {
      const { getHostHTMLElement } = render(
        <Description
          titleProps={{
            children: 'title',
          }}
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
          titleProps={{
            children: 'title',
          }}
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
