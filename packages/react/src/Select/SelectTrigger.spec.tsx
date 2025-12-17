import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import SelectTrigger from './SelectTrigger';
import type { SelectTriggerTagsProps } from './SelectTriggerTags';
import type { SelectValue } from './typings';

const mockSelectTriggerTags = jest.fn();

jest.mock('./SelectTriggerTags', () => {
  const React = jest.requireActual<typeof import('react')>('react');

  return {
    __esModule: true,
    default: React.forwardRef<HTMLDivElement, SelectTriggerTagsProps>(
      (props, ref) => {
        mockSelectTriggerTags(props);

        return <div data-testid="select-trigger-tags" ref={ref} />;
      },
    ),
  };
});

describe('<SelectTrigger />', () => {
  afterEach(() => {
    cleanup();
    mockSelectTriggerTags.mockClear();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<SelectTrigger ref={ref} readOnly />),
  );

  describeHostElementClassNameAppendable(classes.trigger, (className) =>
    render(<SelectTrigger className={className} readOnly />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<SelectTrigger readOnly />);
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.trigger)).toBeTruthy();
  });

  it('should fallback to value name when renderValue not provided', () => {
    const value: SelectValue = { id: '1', name: 'Beta' };
    const { getByDisplayValue } = render(
      <SelectTrigger mode="single" readOnly value={value} />,
    );

    expect(getByDisplayValue('Beta')).toBeInstanceOf(HTMLInputElement);
  });

  it('should render SelectTriggerTags when mode is multiple with selections', () => {
    const selections: SelectValue[] = [
      { id: '1', name: 'Alpha' },
      { id: '2', name: 'Beta' },
    ];

    const { getByTestId } = render(
      <SelectTrigger
        disabled
        ellipsis
        mode="multiple"
        onTagClose={jest.fn()}
        readOnly
        value={selections}
      />,
    );

    expect(getByTestId('select-trigger-tags')).toBeInstanceOf(HTMLElement);
    expect(mockSelectTriggerTags).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        ellipsis: true,
        value: selections,
      }),
    );
  });

  it('should render native input for multiple mode without selections', () => {
    const { getByPlaceholderText, queryByTestId } = render(
      <SelectTrigger
        mode="multiple"
        placeholder="Search..."
        readOnly
        value={[]}
      />,
    );

    expect(getByPlaceholderText('Search...')).toBeInstanceOf(HTMLInputElement);
    expect(queryByTestId('select-trigger-tags')).toBeNull();
  });

  it('should not show suffix-action-icon if forceHideSuffixActionIcon is true', () => {
    const { getHostHTMLElement } = render(
      <SelectTrigger forceHideSuffixActionIcon readOnly />,
    );

    const icon = getHostHTMLElement().querySelector(
      '.mzn-select-trigger__suffix-action-icon',
    );

    expect(icon).toBe(null);
  });

  it('should invoke suffixAction if suffixAction given', async () => {
    const suffixAction = jest.fn();

    const { getHostHTMLElement } = render(
      <SelectTrigger suffixAction={suffixAction} readOnly />,
    );

    const icon = getHostHTMLElement().querySelector(
      '.mzn-select-trigger__suffix-action-icon',
    );

    fireEvent.click(icon!);

    expect(suffixAction).toHaveBeenCalledTimes(1);
  });

  it('should fallback to onClick when suffixAction not provided', () => {
    const onClick = jest.fn();

    const { getHostHTMLElement } = render(
      <SelectTrigger onClick={onClick} readOnly />,
    );

    const icon = getHostHTMLElement().querySelector(
      '.mzn-select-trigger__suffix-action-icon',
    );

    fireEvent.click(icon!);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
