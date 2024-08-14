import { createRef } from 'react';
import { act, cleanupHook, render, fireEvent } from '../../__test-utils__';
import Tooltip from '.';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
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
  });
});
