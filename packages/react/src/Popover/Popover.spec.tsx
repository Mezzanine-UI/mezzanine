import { createRef, useState } from 'react';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Popover from '.';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

describe('<Popper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Popover ref={ref} open />),
  );

  it('should bind host class', async () => {
    await act(async () => {
      await render(
        <Popover anchor={document.body} open>
          content
        </Popover>,
      );
    });

    const element = getPopperContainer();

    expect(element?.classList.contains('mzn-popover')).toBeTruthy();
  });

  describe('prop: children', () => {
    it('should wrap children by content <div />', async () => {
      await act(async () => {
        await render(
          <Popover anchor={document.body} open>
            content
          </Popover>,
        );
      });

      const element = getPopperContainer();
      const { lastElementChild: contentElement } = element!;

      expect(contentElement!.textContent).toBe('content');
    });

    it('should not render content <div /> if children not passed', async () => {
      await act(async () => {
        await render(<Popover anchor={document.body} open />);
      });

      const element = getPopperContainer();
      const { childElementCount } = element!;

      expect(childElementCount).toBe(0);
    });
  });

  describe('prop: onClose', () => {
    describe('click away', () => {
      it('should trigger onClose while clicked away', async () => {
        const anchorRef = createRef<HTMLDivElement>();
        const TestComponent = () => {
          const [open, setOpen] = useState(true);

          return (
            <>
              <Popover
                anchor={anchorRef}
                title="title"
                onClose={() => setOpen(false)}
                open={open}
              >
                content
              </Popover>
              <div ref={anchorRef}>anchor</div>
            </>
          );
        };

        await act(async () => {
          await render(<TestComponent />);
        });

        let element = getPopperContainer();
        const titleElement = element!.querySelector('.mzn-popover__title');

        expect(element).toBeInstanceOf(HTMLElement);

        fireEvent.click(titleElement!);
        element = getPopperContainer();
        expect(element).toBeInstanceOf(HTMLElement);

        fireEvent.click(anchorRef.current!);
        element = getPopperContainer();
        expect(element).toBeNull();
      });

      it('should not trigger onClose if disableClickAway=true', async () => {
        const anchorRef = createRef<HTMLDivElement>();
        const onClose = jest.fn();
        const TestComponent = () => (
          <>
            <Popover
              anchor={anchorRef}
              disableClickAway
              title="title"
              onClose={onClose}
              open
            >
              content
            </Popover>
            <div ref={anchorRef}>anchor</div>
          </>
        );

        await act(async () => {
          await render(<TestComponent />);
        });

        const element = getPopperContainer();

        expect(element).toBeInstanceOf(HTMLElement);

        fireEvent.click(anchorRef.current!);

        expect(onClose).not.toBeCalled();
      });
    });
  });

  describe('prop: title', () => {
    it('should wrap title by <div />', async () => {
      await act(async () => {
        await render(
          <Popover anchor={document.body} title="title" open>
            content
          </Popover>,
        );
      });

      const element = getPopperContainer();
      const { firstElementChild: titleElement } = element!;

      expect(titleElement!.tagName.toLowerCase()).toBe('div');
      expect(titleElement!.textContent).toBe('title');
    });
  });

  it('should not render title <div /> if title not passed', async () => {
    await act(async () => {
      await render(<Popover anchor={document.body} open />);
    });

    const element = getPopperContainer();
    const { childElementCount } = element!;

    expect(childElementCount).toBe(0);
  });
});
