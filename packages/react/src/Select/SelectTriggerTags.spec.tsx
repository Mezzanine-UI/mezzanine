import { ReactNode } from 'react';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { cleanup, render, fireEvent } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import SelectTriggerTags from './SelectTriggerTags';
import type { SelectValue } from './typings';
import type {
  UseSelectTriggerTagsProps,
  UseSelectTriggerTagsValue,
} from './useSelectTriggerTags';
import type { OverflowCounterTagProps } from '../OverflowTooltip/OverflowCounterTag';

const mockRenderFakeTags = jest.fn(() => <div data-testid="fake-tags" />);
const mockUseSelectTriggerTags = jest.fn<
  UseSelectTriggerTagsValue,
  [UseSelectTriggerTagsProps]
>();
const mockOverflowCounterTag = jest.fn();

jest.mock('./useSelectTriggerTags', () => ({
  __esModule: true,
  useSelectTriggerTags: (props: any) => mockUseSelectTriggerTags(props),
}));

jest.mock('../OverflowTooltip', () => {
  return {
    __esModule: true,
    OverflowCounterTag: (props: OverflowCounterTagProps) => {
      mockOverflowCounterTag(props);

      return (
        <button
          data-testid="overflow-counter-tag"
          onClick={(event) => {
            event.stopPropagation();
            props.onTagDismiss?.(0);
          }}
          type="button"
        >
          overflow
        </button>
      );
    },
  };
});

jest.mock('../Tag/TagGroup', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => (
      <div data-testid="tag-group">{children}</div>
    ),
  };
});

function createHookValue(
  overrides: Partial<UseSelectTriggerTagsValue> = {},
): UseSelectTriggerTagsValue {
  return {
    overflowSelections: [],
    renderFakeTags: mockRenderFakeTags,
    takeCount: 0,
    visibleSelections: [],
    ...overrides,
  };
}

describe('<SelectTriggerTags />', () => {
  beforeEach(() => {
    mockRenderFakeTags.mockReturnValue(<div data-testid="fake-tags" />);
    mockUseSelectTriggerTags.mockReturnValue(createHookValue());
  });

  afterEach(() => {
    cleanup();
    mockRenderFakeTags.mockClear();
    mockUseSelectTriggerTags.mockClear();
    mockOverflowCounterTag.mockClear();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<SelectTriggerTags ref={ref} overflowStrategy="counter" />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <SelectTriggerTags overflowStrategy="wrap" />,
    );
    const host = getHostHTMLElement();

    expect(
      host.classList.contains(classes.triggerTagsInputWrapper),
    ).toBeTruthy();
  });

  it('has no tags if value not given', () => {
    const { getHostHTMLElement } = render(
      <SelectTriggerTags overflowStrategy="wrap" />,
    );

    const tags = getHostHTMLElement().getElementsByClassName('mzn-tag');

    expect(tags.length).toBe(0);
  });

  it('should call useSelectTriggerTags with ellipsis flag', () => {
    const value: SelectValue[] = [{ id: '1', name: 'Alpha' }];

    render(<SelectTriggerTags overflowStrategy="counter" value={value} />);
    let lastCall = mockUseSelectTriggerTags.mock.calls.at(-1)?.[0];
    expect(lastCall).toEqual(
      expect.objectContaining({
        enabled: true,
        value,
      }),
    );

    render(<SelectTriggerTags overflowStrategy="wrap" value={value} />);
    lastCall = mockUseSelectTriggerTags.mock.calls.at(-1)?.[0];
    expect(lastCall).toEqual(
      expect.objectContaining({
        enabled: false,
        value,
      }),
    );
  });

  describe('click close icon of tags without onTagClose', () => {
    [true, false].forEach((isEllipsis) => {
      it(`case: ellipsis="${isEllipsis}"`, () => {
        const hookValue = isEllipsis
          ? createHookValue({
              visibleSelections: [
                {
                  id: 'foo',
                  name: 'foo',
                },
              ],
            })
          : createHookValue();
        mockUseSelectTriggerTags.mockReturnValue(hookValue);

        const { getByRole } = render(
          <SelectTriggerTags
            overflowStrategy={isEllipsis ? 'counter' : 'wrap'}
            value={[
              {
                id: 'foo',
                name: 'foo',
              },
            ]}
          />,
        );

        const dismissButton = getByRole('button');

        fireEvent.click(dismissButton);

        expect(dismissButton).toBeInstanceOf(HTMLButtonElement);
      });
    });
  });

  it('invoke onTagClose when click close icon of tags', () => {
    const onTagClose = jest.fn();

    mockUseSelectTriggerTags.mockReturnValue(
      createHookValue({
        visibleSelections: [
          {
            id: 'foo',
            name: 'foo',
          },
        ],
      }),
    );

    const { getByRole } = render(
      <SelectTriggerTags
        overflowStrategy="counter"
        onTagClose={onTagClose}
        value={[
          {
            id: 'foo',
            name: 'foo',
          },
        ]}
      />,
    );

    fireEvent.click(getByRole('button'));

    expect(onTagClose).toHaveBeenCalledTimes(1);
    expect(onTagClose).toHaveBeenCalledWith({ id: 'foo', name: 'foo' });
  });

  it('should render overflow counter tag when ellipsis and overflow selections exist', () => {
    const overflowSelections: SelectValue[] = [
      { id: '2', name: 'Beta' },
      { id: '3', name: 'Gamma' },
    ];
    const visibleSelections: SelectValue[] = [{ id: '1', name: 'Alpha' }];
    mockUseSelectTriggerTags.mockReturnValue(
      createHookValue({
        overflowSelections,
        takeCount: 1,
        visibleSelections,
      }),
    );
    const onTagClose = jest.fn();

    const { getByTestId } = render(
      <SelectTriggerTags
        overflowStrategy="counter"
        onTagClose={onTagClose}
        value={visibleSelections}
      />,
    );

    expect(getByTestId('overflow-counter-tag')).toBeInstanceOf(HTMLElement);
    expect(mockOverflowCounterTag).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: overflowSelections.map((selection) => selection.name),
      }),
    );

    fireEvent.click(getByTestId('overflow-counter-tag'));

    expect(onTagClose).toHaveBeenCalledWith(overflowSelections[0]);
  });

  it('should render fake tags only when ellipsis is enabled', () => {
    const { getByTestId, rerender, queryByTestId } = render(
      <SelectTriggerTags overflowStrategy="counter" value={[]} />,
    );

    expect(mockRenderFakeTags).toHaveBeenCalled();
    expect(getByTestId('fake-tags')).toBeInstanceOf(HTMLElement);

    mockRenderFakeTags.mockClear();

    rerender(<SelectTriggerTags overflowStrategy="wrap" value={[]} />);

    expect(mockRenderFakeTags).not.toHaveBeenCalled();
    expect(queryByTestId('fake-tags')).toBeNull();
  });

  it('should render search input when showTextInputAfterTags is true', () => {
    const { getByRole } = render(
      <SelectTriggerTags
        overflowStrategy="wrap"
        inputProps={{ placeholder: 'Search here' }}
        readOnly
        required
        showTextInputAfterTags
        value={[]}
      />,
    );

    const input = getByRole('searchbox');

    expect(input.getAttribute('placeholder')).toBe('Search here');
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
  });
});
