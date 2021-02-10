import { PlusIcon } from '@mezzanine-ui/icons';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import { IconButton } from '.';

describe('<IconButton />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLButtonElement,
    (ref) => render(
      <IconButton ref={ref}>
        <Icon icon={PlusIcon} />
      </IconButton>,
    ),
  );

  it('should pass children to icon of button', () => {
    const { getHostHTMLElement } = render(
      <IconButton>
        <Icon icon={PlusIcon} />
      </IconButton>,
    );
    const element = getHostHTMLElement();
    const {
      firstElementChild: iconElement,
      childElementCount,
    } = element;

    expect(childElementCount).toBe(1);
    expect(iconElement?.tagName.toLowerCase()).toBe('i');
    expect(iconElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
  });
});
