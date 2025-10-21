import { Placement } from '@popperjs/core';
import { RefObject } from 'react';
import { act, cleanup, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Popper from '.';
import { PopperController } from './Popper';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

describe('<Popper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Popper ref={ref} open />),
  );

  it('should wrap children by popper container', async () => {
    await act(async () => {
      await render(
        <Popper anchor={document.body} open>
          <div id="bar">foo</div>
        </Popper>,
      );
    });

    const popperContainer = getPopperContainer();
    const { firstElementChild: popperContent } = popperContainer!;

    expect(popperContent!.textContent).toBe('foo');
    expect(popperContent!.getAttribute('id')).toBe('bar');
  });

  describe('prop: open', () => {
    it('should render open=false by default', async () => {
      await act(async () => {
        await render(
          <Popper anchor={document.body}>
            <div />
          </Popper>,
        );
      });

      const popperContainer = document.body.querySelector(
        'div[data-popper-placement]',
      );

      expect(popperContainer).toBeNull();
    });

    [false, true].forEach((open) => {
      const message = open
        ? 'should show if open=true'
        : 'should hide if open=false';

      it(message, async () => {
        await act(async () => {
          await render(
            <Popper anchor={document.body} open={open}>
              <div />
            </Popper>,
          );
        });

        const popperContainer = getPopperContainer();

        expect(!!popperContainer).toBe(open);
      });
    });
  });

  describe('prop: controllerRef', () => {
    it('should get hook results', async () => {
      const controllerRef = {
        current: null,
      } as RefObject<PopperController | null>;

      await act(async () => {
        await render(
          <Popper anchor={document.body} open controllerRef={controllerRef}>
            <div />
          </Popper>,
        );
      });

      expect(controllerRef?.current?.attributes).toBeInstanceOf(Object);
      expect(controllerRef?.current?.styles).toBeInstanceOf(Object);
      expect(controllerRef?.current?.state).toBeInstanceOf(Object);
      expect(controllerRef?.current?.update).toBeInstanceOf(Function);
      expect(controllerRef?.current?.forceUpdate).toBeInstanceOf(Function);
    });
  });

  describe('prop: options', () => {
    describe('modifiers', () => {
      it('should pass modifiers to usePopper', async () => {
        await act(async () => {
          await render(
            <Popper
              anchor={document.body}
              open
              options={{
                modifiers: [
                  {
                    name: 'hide',
                    enabled: false,
                  },
                ],
              }}
            >
              <div />
            </Popper>,
          );
        });

        const popperContainer = getPopperContainer();

        expect(
          popperContainer?.hasAttribute('data-popper-reference-hidden'),
        ).toBeFalsy();
        expect(
          popperContainer?.hasAttribute('data-popper-reference-escaped'),
        ).toBeFalsy();
      });
    });

    describe('placement', () => {
      const placements: Placement[] = [
        'bottom',
        'bottom-end',
        'bottom-start',
        'left',
        'left-end',
        'left-start',
        'right',
        'right-end',
        'right-start',
        'top',
        'top-end',
        'top-start',
      ];

      placements.forEach((placement) => {
        it(`should change popper placement if placement=${placement}`, async () => {
          await act(async () => {
            await render(
              <Popper
                anchor={document.body}
                open
                options={{
                  placement,
                }}
              >
                <div />
              </Popper>,
            );
          });

          const popperContainer = getPopperContainer();

          expect(popperContainer!.getAttribute('data-popper-placement')).toBe(
            placement,
          );
        });
      });
    });
  });
});
