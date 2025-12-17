import React, { createRef } from 'react';
import { overflowTooltipClasses as tooltipClasses } from '@mezzanine-ui/core/overflow-tooltip';
import type { OverflowCounterTagProps } from './OverflowCounterTag';
import type { OverflowTooltipProps } from './OverflowTooltip';
import type { RenderResult } from '../../__test-utils__';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import OverflowCounterTag from './OverflowCounterTag';
import { resetPortals } from '../Portal/portalRegistry';

const overflowTooltipRenderArgs: OverflowTooltipProps[] = [];

jest.mock('./OverflowTooltip', () => {
  const actual = jest.requireActual('./OverflowTooltip');
  const OverflowTooltipComponent = actual.default;

  return {
    __esModule: true,
    ...actual,
    default: React.forwardRef<HTMLDivElement, OverflowTooltipProps>(
      (props, ref) => {
        overflowTooltipRenderArgs.push(props);

        return <OverflowTooltipComponent {...props} ref={ref} />;
      },
    ),
  };
});

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
  return document.body.querySelector<HTMLDivElement>(`.${tooltipClasses.host}`);
}

async function renderOverflowCounterTag(
  props: Partial<OverflowCounterTagProps> = {},
) {
  const mergedProps: OverflowCounterTagProps = {
    tags: ['Alpha', 'Beta'],
    ...props,
  } as OverflowCounterTagProps;

  let renderResult: RenderResult | undefined;

  await act(async () => {
    renderResult = render(<OverflowCounterTag {...mergedProps} />);
  });

  return {
    ...(renderResult as RenderResult),
    props: mergedProps,
  };
}

describe('<OverflowCounterTag />', () => {
  beforeEach(() => {
    cleanupPortals();
    overflowTooltipRenderArgs.length = 0;
  });

  afterEach(() => {
    cleanup();
    cleanupPortals();
  });

  it('should forward ref to trigger tag element', async () => {
    const ref = createRef<HTMLSpanElement>();

    await act(async () => {
      render(
        <OverflowCounterTag
          ref={ref}
          tags={['Alpha']}
          onTagDismiss={() => {}}
        />,
      );
    });

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('should display tag count based on tags length', async () => {
    const { getByText } = await renderOverflowCounterTag({
      tags: ['A', 'B', 'C'],
    });

    expect(getByText('3')).toBeInstanceOf(HTMLElement);
  });

  it('should toggle tooltip visibility when trigger is clicked', async () => {
    const { getHostHTMLElement } = await renderOverflowCounterTag();
    const trigger = getHostHTMLElement();

    expect(getTooltipHost()).toBeNull();

    await act(async () => {
      fireEvent.click(trigger);
    });

    expect(getTooltipHost()).not.toBeNull();
  });

  it('should close tooltip when clicking outside trigger and tooltip', async () => {
    const { getHostHTMLElement } = await renderOverflowCounterTag();
    const trigger = getHostHTMLElement();

    await act(async () => {
      fireEvent.click(trigger);
    });

    expect(getTooltipHost()).not.toBeNull();

    await act(async () => {
      fireEvent.click(document.body);
    });

    expect(getTooltipHost()).toBeNull();
  });

  it('should pass placement prop to OverflowTooltip component', async () => {
    const { getHostHTMLElement } = await renderOverflowCounterTag({
      placement: 'bottom-start',
    });
    const trigger = getHostHTMLElement();

    overflowTooltipRenderArgs.length = 0;

    await act(async () => {
      fireEvent.click(trigger);
    });

    const lastRender = overflowTooltipRenderArgs.at(-1);

    expect(lastRender?.placement).toBe('bottom-start');
  });

  it('should call onTagDismiss from tooltip items', async () => {
    const onTagDismiss = jest.fn();
    const { getHostHTMLElement, getAllByRole } = await renderOverflowCounterTag(
      {
        onTagDismiss,
      },
    );
    const trigger = getHostHTMLElement();

    await act(async () => {
      fireEvent.click(trigger);
    });

    const closeButtons = getAllByRole('button', { name: 'Dismiss tag' });

    await act(async () => {
      fireEvent.click(closeButtons[0]);
    });

    expect(onTagDismiss).toHaveBeenCalledTimes(1);
    expect(onTagDismiss).toHaveBeenCalledWith(0);
  });
});
