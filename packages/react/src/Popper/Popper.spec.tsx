import { Placement, hide } from '@floating-ui/react-dom';
import { RefObject } from 'react';
import { act, cleanup, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Popper from '.';
import { PopperController } from './Popper';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

function getArrowElement(container: Element | null = document.body) {
  return container!.querySelector('svg');
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

      expect(controllerRef?.current?.refs).toBeInstanceOf(Object);
      expect(controllerRef?.current?.floatingStyles).toBeInstanceOf(Object);
      expect(controllerRef?.current?.placement).toBeDefined();
      expect(controllerRef?.current?.update).toBeInstanceOf(Function);
      expect(controllerRef?.current?.x).toBeDefined();
      expect(controllerRef?.current?.y).toBeDefined();
    });
  });

  describe('prop: options', () => {
    describe('middleware', () => {
      it('should pass middleware to useFloating', async () => {
        await act(async () => {
          await render(
            <Popper
              anchor={document.body}
              open
              options={{
                middleware: [hide()],
              }}
            >
              <div />
            </Popper>,
          );
        });

        const popperContainer = getPopperContainer();

        expect(popperContainer).toBeTruthy();
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
          const controllerRef = {
            current: null,
          } as RefObject<PopperController | null>;

          await act(async () => {
            await render(
              <Popper
                anchor={document.body}
                open
                controllerRef={controllerRef}
                options={{
                  placement,
                }}
              >
                <div />
              </Popper>,
            );
          });

          expect(controllerRef.current?.placement).toBe(placement);
        });
      });
    });
  });

  describe('prop: arrow', () => {
    it('should not render arrow by default', async () => {
      await act(async () => {
        await render(
          <Popper anchor={document.body} open>
            <div />
          </Popper>,
        );
      });

      const arrow = getArrowElement();

      expect(arrow).toBeNull();
    });

    it('should render arrow when arrow prop is provided', async () => {
      await act(async () => {
        await render(
          <Popper
            anchor={document.body}
            arrow={{
              className: 'test-arrow',
              enabled: true,
              padding: 0,
            }}
            open
          >
            <div />
          </Popper>,
        );
      });

      const arrow = getArrowElement();

      expect(arrow).not.toBeNull();
      expect(arrow?.classList.contains('test-arrow')).toBeTruthy();
    });

    it('should not render arrow when enabled is false', async () => {
      await act(async () => {
        await render(
          <Popper
            anchor={document.body}
            arrow={{
              className: 'test-arrow',
              enabled: false,
              padding: 0,
            }}
            open
          >
            <div />
          </Popper>,
        );
      });

      const arrow = getArrowElement();

      expect(arrow).toBeNull();
    });

    it('should apply padding to arrow middleware', async () => {
      const controllerRef = {
        current: null,
      } as RefObject<PopperController | null>;

      await act(async () => {
        await render(
          <Popper
            anchor={document.body}
            arrow={{
              className: 'test-arrow',
              enabled: true,
              padding: 10,
            }}
            open
            controllerRef={controllerRef}
          >
            <div />
          </Popper>,
        );
      });

      const arrow = getArrowElement();

      expect(arrow).not.toBeNull();
      expect(controllerRef.current?.middlewareData.arrow).toBeDefined();
    });
  });

  describe('prop: disablePortal', () => {
    it('should render in body by default', async () => {
      const { container } = render(
        <div id="test-container">
          <Popper anchor={document.body} open>
            <div id="content" />
          </Popper>
        </div>,
      );

      await act(async () => {
        // Wait for render
      });

      const popperInContainer = container.querySelector('#content');
      const popperInBody = document.body.querySelector('#content');

      // 預設 disablePortal 為 undefined，使用 portal 渲染到 body
      expect(popperInContainer).toBeNull();
      expect(popperInBody).not.toBeNull();
    });

    it('should render in parent when disablePortal is true', async () => {
      const { container } = render(
        <div id="test-container">
          <Popper anchor={document.body} disablePortal open>
            <div id="content" />
          </Popper>
        </div>,
      );

      await act(async () => {
        // Wait for render
      });

      const popperInContainer = container.querySelector('#content');

      // disablePortal=true，不使用 portal，渲染在父容器內
      expect(popperInContainer).not.toBeNull();
    });
  });
});
