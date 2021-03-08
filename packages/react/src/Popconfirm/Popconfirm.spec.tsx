import { PlusIcon } from '@mezzanine-ui/icons';
import {
  act,
  cleanup,
  render,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Popconfirm from '.';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

describe('<Popconfirm />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<Popconfirm ref={ref} open />),
  );

  it('should bind host class', async () => {
    await act(async () => {
      await render(
        <Popconfirm
          anchor={document.body}
          open
        />,
      );
    });

    const element = getPopperContainer();

    expect(element?.classList.contains('mzn-popover')).toBeTruthy();
  });

  describe('prop: icon', () => {
    it('should render the popconfirm icon and bind icon class', async () => {
      await act(async () => {
        await render(
          <Popconfirm
            anchor={document.body}
            icon={PlusIcon}
            open
          />,
        );
      });

      const element = getPopperContainer();
      const iconElement = element!.getElementsByTagName('i')[0];

      expect(iconElement!.getAttribute('data-icon-name')).toBe('plus');
      expect(iconElement!.classList.contains('mzn-popconfirm__icon')).toBeTruthy();
    });
  });

  describe('prop: title', () => {
    it('should render the popconfirm title', async () => {
      await act(async () => {
        await render(
          <Popconfirm
            anchor={document.body}
            title="title"
            open
          />,
        );
      });

      const element = getPopperContainer();
      const {
        firstElementChild: titleElement,
      } = element!;

      expect(titleElement!.tagName.toLowerCase()).toBe('div');
      expect(titleElement!.textContent).toBe('title');
    });
  });
});
