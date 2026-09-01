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
      const TestComponent = () => (
        <Tooltip ref={ref} title="Test">
          {({ ref: targetRef, onMouseEnter, onMouseLeave }) => (
            <div
              data-testid="tooltip-trigger"
              ref={targetRef}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          )}
        </Tooltip>
      );

      await act(async () => {
        render(<TestComponent />);
      });

      const trigger = document.querySelector(
        '[data-testid="tooltip-trigger"]',
      )!;

      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await act(async () => {
        jest.runAllTimers();
      });

      const popperElement = getPopperContainer();

      expect(popperElement).toBeInstanceOf(HTMLDivElement);
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
  describe('accessibility', () => {
    const TriggerButton = ({ title }: { title: string }) => (
      <Tooltip title={title}>
        {({
          'aria-describedby': ariaDescribedBy,
          ref,
          onBlur,
          onFocus,
          onMouseEnter,
          onMouseLeave,
        }) => (
          <button
            aria-describedby={ariaDescribedBy}
            data-testid="a11y-trigger"
            onBlur={onBlur}
            onFocus={onFocus}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={ref}
            type="button"
          />
        )}
      </Tooltip>
    );

    function getTrigger() {
      return document.querySelector<HTMLButtonElement>(
        '[data-testid="a11y-trigger"]',
      )!;
    }

    it('should open on keyboard focus and close on blur', async () => {
      await act(async () => {
        render(<TriggerButton title="Delete this item" />);
      });

      expect(getPopperContainer()).toBeNull();

      // 真的把焦點移過去，`:focus-visible` 才會成立。
      // 只 dispatch focus 事件不會移動焦點，會被 gate 擋下 —— 見下方的 gate 測試。
      await act(async () => {
        getTrigger().focus();
      });

      expect(getPopperContainer()).not.toBeNull();
      expect(getPopperContainer()?.textContent).toBe('Delete this item');

      await act(async () => {
        getTrigger().blur();
      });

      expect(getPopperContainer()).toBeNull();
    });

    /**
     * 滑鼠點擊在 Chrome / Firefox 也會 focus <button>，Tooltip 因此用
     * `:focus-visible` 收斂，只有鍵盤觸發的 focus 才開啟。
     *
     * 注意 jsdom 的 `:focus-visible` 等同 `:focus`，無法區分滑鼠與鍵盤來源，
     * 所以「滑鼠點擊不該開 tooltip」這條規則沒辦法在此證明，只能在 Storybook 驗證。
     * 這裡改以「有 focus 事件但焦點不在該元素上」來釘住 gate 確實有生效。
     */
    it('should not open when a focus event fires without the element being focused', async () => {
      await act(async () => {
        render(<TriggerButton title="Delete this item" />);
      });

      await act(async () => {
        fireEvent.focus(getTrigger());
      });

      expect(document.activeElement).not.toBe(getTrigger());
      expect(getPopperContainer()).toBeNull();
    });

    it('should expose the tooltip content through role and aria-describedby', async () => {
      await act(async () => {
        render(<TriggerButton title="Delete this item" />);
      });

      expect(getTrigger().getAttribute('aria-describedby')).toBeNull();

      await act(async () => {
        getTrigger().focus();
      });

      const describedBy = getTrigger().getAttribute('aria-describedby');

      expect(describedBy).toBeTruthy();

      const tooltip = document.getElementById(describedBy!);

      expect(tooltip).not.toBeNull();
      expect(tooltip?.getAttribute('role')).toBe('tooltip');
      expect(tooltip?.textContent).toBe('Delete this item');
    });

    it('should dismiss on Escape while the pointer stays on the trigger', async () => {
      await act(async () => {
        render(<TriggerButton title="Delete this item" />);
      });

      await act(async () => {
        fireEvent.mouseEnter(getTrigger());
      });

      expect(getPopperContainer()).not.toBeNull();

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      expect(getPopperContainer()).toBeNull();
    });

    it('should reopen after an Escape dismissal once the trigger is entered again', async () => {
      await act(async () => {
        render(<TriggerButton title="Delete this item" />);
      });

      await act(async () => {
        fireEvent.mouseEnter(getTrigger());
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      expect(getPopperContainer()).toBeNull();

      await act(async () => {
        fireEvent.mouseEnter(getTrigger());
      });

      expect(getPopperContainer()).not.toBeNull();
    });

    it('should keep a controlled open tooltip visible on Escape', async () => {
      await act(async () => {
        render(
          <Tooltip open title="Always on">
            {({ ref, onMouseEnter, onMouseLeave }) => (
              <button
                data-testid="a11y-trigger"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                ref={ref}
                type="button"
              />
            )}
          </Tooltip>,
        );
      });

      expect(getPopperContainer()).not.toBeNull();

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      expect(getPopperContainer()).not.toBeNull();
    });
  });
});
