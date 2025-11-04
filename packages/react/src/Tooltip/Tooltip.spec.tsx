import { createRef } from 'react';
import { act, cleanupHook, render, fireEvent } from '../../__test-utils__';
import { tooltipClasses as classes } from '@mezzanine-ui/core/tooltip';
import Tooltip from '.';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

function getArrowElement(container: Element | null = document.body) {
  return container!.querySelector(`.${classes.arrow}`);
}

jest.useFakeTimers();

describe('<Tooltip />', () => {
  afterEach(cleanupHook);

  describe('Tooltip itself', () => {
    it('should forward ref to host element', async () => {
      const ref = createRef<HTMLDivElement>();
      const childRef = createRef<HTMLDivElement>();
      const TestComponent = () => (
        <Tooltip ref={ref} title="Test">
          {({ onMouseEnter, onMouseLeave }) => (
            <div
              ref={childRef}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )}
        </Tooltip>
      );

      await act(async () => {
        render(<TestComponent />);
      });

      await act(async () => {
        fireEvent.mouseEnter(childRef.current!);
      });

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should be invisible when title is not given', async () => {
      const childRef = createRef<HTMLDivElement>();
      const TestComponent = () => (
        <Tooltip>
          {({ onMouseEnter, onMouseLeave }) => (
            <div
              ref={childRef}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )}
        </Tooltip>
      );

      await act(async () => {
        render(<TestComponent />);
      });

      await act(async () => {
        fireEvent.mouseEnter(childRef.current!);
      });

      const element = getPopperContainer();

      expect(element).toBeNull();
    });

    describe('Tooltip shown as default', () => {
      let childElement: HTMLDivElement;

      beforeEach(async () => {
        const childRef = createRef<HTMLDivElement>();
        const TestComponent = () => (
          <Tooltip title="Hello">
            {({ onMouseEnter, onMouseLeave }) => (
              <div
                ref={childRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            )}
          </Tooltip>
        );

        await act(async () => {
          render(<TestComponent />);
        });

        await act(async () => {
          fireEvent.mouseEnter(childRef.current!);
        });

        childElement = childRef.current!;
      });

      it('should render the title text', async () => {
        const element = getPopperContainer();

        expect(element?.textContent).toBe('Hello');
      });

      it('should bind host class', async () => {
        const element = getPopperContainer();

        expect(element?.classList.contains('mzn-tooltip')).toBeTruthy();
      });

      it('should keep visible when tooltip is hovered', async () => {
        await act(async () => {
          fireEvent.mouseLeave(childElement);
        });

        const element = getPopperContainer();

        await act(async () => {
          fireEvent.mouseEnter(element!);
        });

        expect(element).not.toBeNull();
      });

      it('should render arrow by default', async () => {
        const arrow = getArrowElement();

        expect(arrow).not.toBeNull();
        expect(arrow?.classList.contains(classes.arrow)).toBeTruthy();
      });
    });

    describe('Tooltip with arrow disabled', () => {
      beforeEach(async () => {
        const childRef = createRef<HTMLDivElement>();
        const TestComponent = () => (
          <Tooltip arrow={false} title="Hello">
            {({ onMouseEnter, onMouseLeave }) => (
              <div
                ref={childRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            )}
          </Tooltip>
        );

        await act(async () => {
          render(<TestComponent />);
        });

        await act(async () => {
          fireEvent.mouseEnter(childRef.current!);
        });
      });

      it('should not render arrow when arrow is false', async () => {
        const arrow = getArrowElement();

        expect(arrow).toBeNull();
      });
    });

    describe('Tooltip with open prop', () => {
      it('should be visible when open is true', async () => {
        const anchorRef = createRef<HTMLDivElement>();
        const TestComponent = () => (
          <>
            <div ref={anchorRef}>Anchor</div>
            <Tooltip anchor={anchorRef.current} open title="Test">
              {({ onMouseEnter, onMouseLeave }) => (
                <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
              )}
            </Tooltip>
          </>
        );

        await act(async () => {
          render(<TestComponent />);
        });

        const element = getPopperContainer();

        expect(element).not.toBeNull();
        expect(element?.textContent).toBe('Test');
      });

      it('should combine open prop with hover state', async () => {
        const childRef = createRef<HTMLDivElement>();
        const TestComponent = () => (
          <Tooltip open={false} title="Test">
            {({ onMouseEnter, onMouseLeave }) => (
              <div
                ref={childRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            )}
          </Tooltip>
        );

        await act(async () => {
          render(<TestComponent />);
        });

        // open={false} 不會阻止 hover 時顯示
        await act(async () => {
          fireEvent.mouseEnter(childRef.current!);
        });

        const element = getPopperContainer();

        // 因為 isTooltipVisible = open || (visible && Boolean(title))
        // 當 open=false 但 visible=true 時，仍然會顯示
        expect(element).not.toBeNull();
      });
    });

    describe('Tooltip with different placements', () => {
      it.each([
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ] as const)('should support placement: %s', async (placement) => {
        const childRef = createRef<HTMLDivElement>();
        const TestComponent = () => (
          <Tooltip options={{ placement }} title="Test">
            {({ onMouseEnter, onMouseLeave }) => (
              <div
                ref={childRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            )}
          </Tooltip>
        );

        await act(async () => {
          render(<TestComponent />);
        });

        await act(async () => {
          fireEvent.mouseEnter(childRef.current!);
        });

        const element = getPopperContainer();

        expect(element).not.toBeNull();
        expect(element?.getAttribute('data-popper-placement')).toBe(placement);
      });
    });
  });

  describe('Tooltip child testing', () => {
    let childElement: HTMLDivElement;

    beforeEach(async () => {
      const childRef = createRef<HTMLDivElement>();
      const TestComponent = () => (
        <Tooltip title="Test">
          {({ onMouseEnter, onMouseLeave }) => (
            <div
              ref={childRef}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )}
        </Tooltip>
      );

      await act(async () => {
        render(<TestComponent />);
      });

      childElement = childRef.current!;
    });

    it('should child component mouseenter/mouseleave event works', async () => {
      await act(async () => {
        fireEvent.mouseEnter(childElement);
      });

      let element = getPopperContainer();

      expect(element).not.toBeNull();

      await act(async () => {
        fireEvent.mouseLeave(childElement);
      });
      expect(element).not.toBeNull();

      await act(async () => {
        jest.runAllTimers();
      });
      element = getPopperContainer();
      expect(element).toBeNull();
    });

    it('should respect mouseLeaveDelay prop', async () => {
      const childRef = createRef<HTMLDivElement>();
      const TestComponent = () => (
        <Tooltip mouseLeaveDelay={0.5} title="Test">
          {({ onMouseEnter, onMouseLeave }) => (
            <div
              ref={childRef}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )}
        </Tooltip>
      );

      await act(async () => {
        render(<TestComponent />);
      });

      childElement = childRef.current!;

      await act(async () => {
        fireEvent.mouseEnter(childElement);
      });

      let element = getPopperContainer();

      expect(element).not.toBeNull();

      await act(async () => {
        fireEvent.mouseLeave(childElement);
      });

      // 應該還在顯示
      element = getPopperContainer();
      expect(element).not.toBeNull();

      // 執行 timers 後應該消失
      await act(async () => {
        jest.runAllTimers();
      });

      element = getPopperContainer();
      expect(element).toBeNull();
    });
  });

  describe('Tooltip with custom className', () => {
    it('should apply custom className', async () => {
      const childRef = createRef<HTMLDivElement>();
      const TestComponent = () => (
        <Tooltip className="custom-tooltip" title="Test">
          {({ onMouseEnter, onMouseLeave }) => (
            <div
              ref={childRef}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )}
        </Tooltip>
      );

      await act(async () => {
        render(<TestComponent />);
      });

      await act(async () => {
        fireEvent.mouseEnter(childRef.current!);
      });

      const element = getPopperContainer();

      expect(element?.classList.contains('custom-tooltip')).toBeTruthy();
      expect(element?.classList.contains(classes.host)).toBeTruthy();
    });
  });

  describe('Tooltip with disablePortal', () => {
    it('should not render in body by default (disablePortal=true)', async () => {
      const childRef = createRef<HTMLDivElement>();
      const { container } = render(
        <div id="test-container">
          <Tooltip title="Test">
            {({ onMouseEnter, onMouseLeave }) => (
              <div
                ref={childRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            )}
          </Tooltip>
        </div>,
      );

      await act(async () => {
        fireEvent.mouseEnter(childRef.current!);
      });

      const tooltipInContainer = container.querySelector(
        'div[data-popper-placement]',
      );

      // disablePortal=true 表示不使用 portal，應該在容器內
      expect(tooltipInContainer).not.toBeNull();
    });

    it('should render in body when disablePortal=false', async () => {
      const childRef = createRef<HTMLDivElement>();
      render(
        <div id="test-container">
          <Tooltip disablePortal={false} title="Test">
            {({ onMouseEnter, onMouseLeave }) => (
              <div
                ref={childRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            )}
          </Tooltip>
        </div>,
      );

      await act(async () => {
        fireEvent.mouseEnter(childRef.current!);
      });

      const tooltipInBody = document.body.querySelector(
        'div[data-popper-placement]',
      );

      // disablePortal=false 表示使用 portal，應該在 body
      expect(tooltipInBody).not.toBeNull();
    });
  });
});
