import {
  cleanupHook,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { SelectTrigger, SelectValue } from '.';

describe('<SelectTrigger />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <SelectTrigger ref={ref} readOnly />,
    ),
  );

  describe('props: renderValue', () => {
    const renderValue = jest.fn<string, [SelectValue | null | SelectValue[]]>(() => 'foobar');

    it('single mode', () => {
      render(
        <SelectTrigger
          readOnly
          mode="single"
          renderValue={renderValue}
        />,
      );

      expect(renderValue).toBeCalledWith(null);
    });

    it('multiple mode', () => {
      render(
        <SelectTrigger
          readOnly
          mode="multiple"
          renderValue={renderValue}
        />,
      );

      expect(renderValue).toBeCalledWith([]);
    });
  });
});
