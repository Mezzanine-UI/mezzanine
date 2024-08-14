import { act, cleanupHook, render, fireEvent } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { SelectTrigger, SelectValue } from '.';

describe('<SelectTrigger />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<SelectTrigger ref={ref} readOnly />),
  );

  describe('props: renderValue', () => {
    const renderValue = jest.fn<string, [SelectValue | null | SelectValue[]]>(
      () => 'foobar',
    );

    it('single mode', () => {
      render(
        <SelectTrigger readOnly mode="single" renderValue={renderValue} />,
      );

      expect(renderValue).toBeCalledWith(null);
    });

    it('multiple mode', () => {
      render(
        <SelectTrigger readOnly mode="multiple" renderValue={renderValue} />,
      );

      expect(renderValue).toBeCalledWith([]);
    });
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

    await act(async () => {
      fireEvent.click(icon!);
    });

    expect(suffixAction).toBeCalledTimes(1);
  });
});
