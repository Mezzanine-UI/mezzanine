import { tagClasses as classes } from '@mezzanine-ui/core/tag';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Tag from '.';
import OverflowCounterTag from '../OverflowTooltip/OverflowCounterTag';
import type { OverflowCounterTagProps } from '../OverflowTooltip/OverflowCounterTag';
import TagGroup from './TagGroup';

const mockOverflowCounterTagRender = jest.fn();

jest.mock('../OverflowTooltip/OverflowCounterTag', () => {
  const React =
    jest.requireActual<typeof import('react')>('react');

  return {
    __esModule: true,
    default: React.forwardRef<HTMLSpanElement, OverflowCounterTagProps>(
      function MockOverflowCounterTag(props, ref) {
        const { tags = [] } = props;
        mockOverflowCounterTagRender(tags);

        return (
          <span data-testid="overflow-counter-tag" ref={ref}>
            {tags.join(',')}
          </span>
        );
      },
    ),
  };
});

describe('<TagGroup />', () => {
  afterEach(() => {
    mockOverflowCounterTagRender.mockClear();
    cleanup();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <TagGroup ref={ref}>
        <Tag label="Tag" type="static" />
      </TagGroup>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <TagGroup className={className}>
        <Tag label="Tag" type="static" />
      </TagGroup>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <TagGroup>
        <Tag label="Tag" type="static" />
      </TagGroup>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.group)).toBeTruthy();
  });

  it('should render Tag children', () => {
    const label = 'Inbox';
    const { getByText } = render(
      <TagGroup>
        <Tag label={label} type="static" />
      </TagGroup>,
    );

    expect(getByText(label)).toBeInstanceOf(HTMLElement);
  });

  it('should render OverflowCounterTag children', () => {
    const { getByTestId } = render(
      <TagGroup>
        <OverflowCounterTag onTagDismiss={() => {}} tags={['A', 'B']} />
      </TagGroup>,
    );

    expect(getByTestId('overflow-counter-tag')).toBeInstanceOf(HTMLElement);
    expect(mockOverflowCounterTagRender).toHaveBeenCalledWith(['A', 'B']);
  });

  it('should warn and render nothing when children are invalid', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { container } = render(
      <TagGroup>
        <div>Invalid</div>
      </TagGroup>,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '<TagGroup> only accepts <Tag> or <OverflowCounterTag>',
    );
    expect(container.firstChild).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
