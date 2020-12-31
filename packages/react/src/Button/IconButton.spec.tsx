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
      firstElementChild: iconStartElement,
      childElementCount,
    } = element;

    expect(childElementCount).toBe(1);
    expect(iconStartElement?.tagName.toLowerCase()).toBe('svg');
    expect(iconStartElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
  });
});
