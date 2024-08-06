import { RefObject, useState } from 'react';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import Dropdown from '.';
import Menu, { MenuItem } from '../Menu';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

describe('<Dropdown />', () => {
  afterEach(cleanup);

  describe('prop: children', () => {
    it('should render children with its ref', () => {
      const { getHostHTMLElement } = render(
        <Dropdown>
          {(ref) => (
            <div id="bar" ref={ref as RefObject<HTMLDivElement>}>
              foo
            </div>
          )}
        </Dropdown>,
      );

      const element = getHostHTMLElement();

      expect(element.textContent).toBe('foo');
      expect(element.getAttribute('id')).toBe('bar');
    });
  });

  describe('prop: menu', () => {
    it('should render menu', async () => {
      await act(async () => {
        await render(
          <Dropdown
            menu={
              <Menu>
                <MenuItem>item 1</MenuItem>
              </Menu>
            }
            popperProps={{
              open: true,
            }}
          >
            {(ref) => <div ref={ref as RefObject<HTMLDivElement>}>foo</div>}
          </Dropdown>,
        );
      });

      const popperContainer = getPopperContainer();
      const menuElement = popperContainer!.getElementsByTagName('ul');

      expect(!!menuElement).toBeTruthy();
    });
  });

  describe('prop: onClose', () => {
    describe('click away', () => {
      it('should trigger onClose while clicked away', async () => {
        const TestComponent = () => {
          const [open, setOpen] = useState(true);

          return (
            <Dropdown
              menu={
                <Menu>
                  <MenuItem>item 1</MenuItem>
                </Menu>
              }
              onClose={() => setOpen(false)}
              popperProps={{
                open,
              }}
            >
              {(ref) => <div ref={ref as RefObject<HTMLDivElement>}>foo</div>}
            </Dropdown>
          );
        };

        await act(async () => {
          await render(<TestComponent />);
        });

        let popperContainer = getPopperContainer();

        expect(popperContainer).toBeInstanceOf(HTMLElement);

        fireEvent.click(document);
        popperContainer = getPopperContainer();
        expect(popperContainer).toBeNull();
      });

      it('should not trigger onClose if disableClickAway=true', async () => {
        const onClose = jest.fn();
        const TestComponent = () => (
          <Dropdown
            disableClickAway
            menu={
              <Menu>
                <MenuItem>item 1</MenuItem>
              </Menu>
            }
            onClose={onClose}
            popperProps={{
              open: true,
            }}
          >
            {(ref) => <div ref={ref as RefObject<HTMLDivElement>}>foo</div>}
          </Dropdown>
        );

        await act(async () => {
          await render(<TestComponent />);
        });

        const element = getPopperContainer();

        expect(element).toBeInstanceOf(HTMLElement);

        fireEvent.click(document);

        expect(onClose).not.toBeCalled();
      });
    });
  });

  describe('prop: popperProps', () => {
    it('should render popperProps', async () => {
      await act(async () => {
        await render(
          <Dropdown
            popperProps={{
              open: true,
            }}
          >
            {(ref) => <div ref={ref as RefObject<HTMLDivElement>}>foo</div>}
          </Dropdown>,
        );
      });

      const popperContainer = getPopperContainer();

      expect(!!popperContainer).toBeTruthy();
    });
  });
});
