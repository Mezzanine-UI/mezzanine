import { createRef } from 'react';
import { overflowTooltipClasses as classes } from '@mezzanine-ui/core/overflow-tooltip';
import { tagClasses } from '@mezzanine-ui/core/tag';
import type { OverflowTooltipProps } from '.';
import type { RenderResult } from '../../__test-utils__';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import OverflowTooltip from '.';
import { resetPortals } from '../Portal/portalRegistry';

// Mock ResizeObserver for portal layout adjustments
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
} as any;

function cleanupPortals() {
  document.getElementById('mzn-alert-container')?.remove();
  document.getElementById('mzn-portal-container')?.remove();
  resetPortals();
}

function getTooltipHost() {
  return document.body.querySelector<HTMLDivElement>(`.${classes.host}`);
}

async function renderOverflowTooltip(
  props: Partial<OverflowTooltipProps> = {},
) {
  const mergedProps: OverflowTooltipProps = {
    anchor: document.body,
    onTagDismiss: jest.fn(),
    open: true,
    tags: ['First', 'Second'],
    ...props,
  };

  let renderResult: RenderResult | undefined;

  await act(async () => {
    renderResult = render(<OverflowTooltip {...mergedProps} />);
  });

  return {
    ...(renderResult as RenderResult),
    props: mergedProps,
  };
}

describe('<OverflowTooltip />', () => {
  beforeEach(() => {
    cleanupPortals();
  });

  afterEach(() => {
    cleanup();
    cleanupPortals();
  });

  it('should forward ref to popper host element', async () => {
    const ref = createRef<HTMLDivElement>();

    await act(async () => {
      render(
        <OverflowTooltip
          anchor={document.body}
          onTagDismiss={jest.fn()}
          open
          ref={ref}
          tags={['only']}
        />,
      );
    });

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains(classes.host)).toBeTruthy();
  });

  it('should append custom className on host', async () => {
    const className = 'custom-tooltip-class';

    await renderOverflowTooltip({ className });

    const host = getTooltipHost();

    expect(host?.classList.contains(className)).toBeTruthy();
  });

  describe('prop: open', () => {
    it('should render nothing when open=false', async () => {
      await renderOverflowTooltip({ open: false });

      expect(getTooltipHost()).toBeNull();
    });

    it('should render content when open=true', async () => {
      await renderOverflowTooltip({ open: true });

      expect(getTooltipHost()).not.toBeNull();
    });
  });

  it('should render all provided tags', async () => {
    const tags = ['Alpha', 'Beta', 'Gamma'];
    const { getByText } = await renderOverflowTooltip({ tags });

    tags.forEach((tag) => {
      expect(getByText(tag)).toBeInstanceOf(HTMLElement);
    });
  });

  it('should fire onTagDismiss with tag index', async () => {
    const onTagDismiss = jest.fn();
    await renderOverflowTooltip({
      onTagDismiss,
      tags: ['Alpha', 'Beta'],
    });

    const closeButtons = document.querySelectorAll<HTMLButtonElement>(
      `.${tagClasses.closeButton}`,
    );

    await act(async () => {
      fireEvent.click(closeButtons[1]);
    });

    expect(onTagDismiss).toHaveBeenCalledTimes(1);
    expect(onTagDismiss).toHaveBeenCalledWith(1);
  });

  it('should respect placement prop', async () => {
    await renderOverflowTooltip({ placement: 'bottom-end' });

    const host = getTooltipHost();

    expect(host?.getAttribute('data-popper-placement')).toBe('bottom-end');
  });

  describe('prop: readOnly', () => {
    it('should render static tags without close buttons when readOnly=true', async () => {
      await renderOverflowTooltip({ readOnly: true, tags: ['A', 'B'] });

      expect(
        document.querySelectorAll(`.${tagClasses.type('static')}`).length,
      ).toBe(2);
      expect(
        document.querySelectorAll(`.${tagClasses.closeButton}`).length,
      ).toBe(0);
    });

    it('should render dismissable tags with close buttons when readOnly=false', async () => {
      await renderOverflowTooltip({ readOnly: false, tags: ['A', 'B'] });

      expect(
        document.querySelectorAll(`.${tagClasses.type('dismissable')}`).length,
      ).toBe(2);
      expect(
        document.querySelectorAll(`.${tagClasses.closeButton}`).length,
      ).toBe(2);
    });
  });

  describe('prop: tagSize', () => {
    it('should apply the given size class to all tags', async () => {
      await renderOverflowTooltip({ tagSize: 'sub', tags: ['A', 'B'] });

      expect(
        document.querySelectorAll(`.${tagClasses.size('sub')}`).length,
      ).toBe(2);
    });
  });

  describe('width measurement', () => {
    let rafSpy: jest.SpyInstance;

    beforeEach(() => {
      rafSpy = jest
        .spyOn(global, 'requestAnimationFrame')
        .mockImplementation((cb) => {
          cb(0);

          return 0;
        });
    });

    afterEach(() => {
      rafSpy.mockRestore();
    });

    it('should call requestAnimationFrame to measure content width when popperOpen becomes true', async () => {
      await renderOverflowTooltip({ tags: ['A', 'B'] });

      expect(rafSpy).toHaveBeenCalled();
    });

    it('should re-run measurement when tagSize changes', async () => {
      const { rerender } = await renderOverflowTooltip({
        tagSize: 'sub',
        tags: ['A', 'B'],
      });

      const callsAfterMount = rafSpy.mock.calls.length;

      await act(async () => {
        rerender(
          <OverflowTooltip
            anchor={document.body}
            onTagDismiss={jest.fn()}
            open
            tagSize="minor"
            tags={['A', 'B']}
          />,
        );
      });

      expect(rafSpy.mock.calls.length).toBeGreaterThan(callsAfterMount);
    });

    it('should re-run measurement when readOnly changes', async () => {
      const { rerender } = await renderOverflowTooltip({
        readOnly: false,
        tags: ['A', 'B'],
      });

      const callsAfterMount = rafSpy.mock.calls.length;

      await act(async () => {
        rerender(
          <OverflowTooltip
            anchor={document.body}
            onTagDismiss={jest.fn()}
            open
            readOnly
            tags={['A', 'B']}
          />,
        );
      });

      expect(rafSpy.mock.calls.length).toBeGreaterThan(callsAfterMount);
    });
  });
});
