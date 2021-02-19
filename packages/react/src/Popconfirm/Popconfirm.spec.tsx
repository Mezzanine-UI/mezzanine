import { PlusIcon } from '@mezzanine-ui/icons';
import {
  act,
  cleanup,
  fireEvent,
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

  describe('prop: cancelButtonProps', () => {
    it('should render the props of the Cancel button', async () => {
      await act(async () => {
        await render(
          <Popconfirm
            anchor={document.body}
            cancelButtonProps={{
              loading: true,
            }}
            open
          />,
        );
      });

      const element = getPopperContainer();
      const cancelButtonElement = element!.getElementsByTagName('button')[0];

      expect(cancelButtonElement!.getElementsByTagName('i')).toBeTruthy();
    });
  });

  describe('prop: cancelText', () => {
    it('should render the text of the Cancel button', async () => {
      await act(async () => {
        await render(
          <Popconfirm
            anchor={document.body}
            cancelText="cancelText"
            open
          />,
        );
      });

      const element = getPopperContainer();
      const cancelButtonElement = element!.getElementsByTagName('button')[0];

      expect(cancelButtonElement!.tagName.toLowerCase()).toBe('button');
      expect(cancelButtonElement!.textContent).toBe('cancelText');
    });
  });

  describe('prop: confirmButtonProps', () => {
    it('should render the props of the confirmation button', async () => {
      await act(async () => {
        await render(
          <Popconfirm
            anchor={document.body}
            confirmButtonProps={{
              loading: true,
            }}
            open
          />,
        );
      });

      const element = getPopperContainer();
      const confirmButtonElement = element?.getElementsByTagName('button')[1];

      expect(confirmButtonElement?.getElementsByTagName('i')).toBeTruthy();
    });
  });

  describe('prop: confirmText', () => {
    it('should render the text of the Confirmation button', async () => {
      await act(async () => {
        await render(
          <Popconfirm
            anchor={document.body}
            confirmText="confirmText"
            open
          />,
        );
      });

      const element = getPopperContainer();
      const confirmButtonElement = element!.getElementsByTagName('button')[1];

      expect(confirmButtonElement!.tagName.toLowerCase()).toBe('button');
      expect(confirmButtonElement!.textContent).toBe('confirmText');
    });
  });

  describe('prop: icon', () => {
    it('should render the popconfirm icon', async () => {
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

      expect(titleElement!.tagName.toLowerCase()).toBe('h6');
      expect(titleElement!.textContent).toBe('title');
    });
  });

  describe('prop: onCancel', () => {
    it('should be fired on click event on Cancel button', async () => {
      const onCancel = jest.fn();

      await act(async () => {
        await render(
          <Popconfirm
            anchor={document.body}
            onCancel={onCancel}
            open
          />,
        );
      });

      const element = getPopperContainer();

      const cancelButtonElement = element!.getElementsByTagName('button')[0];

      fireEvent.click(cancelButtonElement);

      expect(onCancel).toBeCalled();
    });
  });

  describe('prop: onConfirm', () => {
    it('should be fired on click event on Confirmation button', async () => {
      const onConfirm = jest.fn();

      await act(async () => {
        await render(
          <Popconfirm
            anchor={document.body}
            onConfirm={onConfirm}
            open
          />,
        );
      });

      const element = getPopperContainer();

      const cancelButtonElement = element!.getElementsByTagName('button')[1];

      fireEvent.click(cancelButtonElement);

      expect(onConfirm).toBeCalled();
    });
  });
});
