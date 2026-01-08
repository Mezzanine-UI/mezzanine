import { cleanup, render } from '../../__test-utils__';
import { CopyIcon } from '@mezzanine-ui/icons';
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
});
