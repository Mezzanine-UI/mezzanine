import {
  act,
  cleanupHook,
  render,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { SelectTriggerTags } from '.';

describe('<SelectTriggerTags />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <SelectTriggerTags ref={ref} ellipsis />,
    ),
  );

  it('invoke onTagClose when click close icon of tags', async () => {
    const onTagClose = jest.fn();

    const { getHostHTMLElement } = render(
      <SelectTriggerTags
        ellipsis
        onTagClose={onTagClose}
        value={[{
          id: 'foo',
          name: 'foo',
        }]}
      />,
    );

    const tags = getHostHTMLElement().getElementsByClassName('mzn-tag');

    expect(tags.length).toBe(1);

    const firstTag = tags[0];
    const firstTagCloseIcon = firstTag.getElementsByClassName('mzn-tag__close-icon')[0];

    await act(async () => {
      fireEvent.click(firstTagCloseIcon!);
    });

    expect(onTagClose).toBeCalledTimes(1);
  });
});
