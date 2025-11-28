import { cleanup, render, waitFor } from '../../__test-utils__';
import { useSelectTriggerTags } from './useSelectTriggerTags';
import type { SelectValue } from './typings';
import { useCallback, useRef } from 'react';

type HarnessProps = {
  containerWidth?: number;
  enabled: boolean;
  value: SelectValue[];
};

type TestIds = 'visible' | 'overflow' | 'take-count';

const selections: SelectValue[] = [
  { id: '1', name: 'Alpha' },
  { id: '2', name: 'Beta' },
  { id: '3', name: 'Gamma' },
];

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
const originalResizeObserver = (global as typeof globalThis).ResizeObserver;

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value() {
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 60,
        bottom: 0,
        width: 60,
        height: 0,
        toJSON() {
          return {};
        },
      };
    },
  });

  (global as typeof globalThis).ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: originalGetBoundingClientRect,
  });

  (global as typeof globalThis).ResizeObserver = originalResizeObserver;
});

afterEach(() => {
  cleanup();
});

const HookHarness = ({ containerWidth = 300, enabled, value }: HarnessProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const hookValue = useSelectTriggerTags({
    containerRef,
    enabled,
    tagsRef,
    value,
  });

  const assignClientWidth = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      Object.defineProperty(node, 'clientWidth', {
        configurable: true,
        value: containerWidth,
      });
    },
    [containerWidth],
  );

  const containerCallback = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      assignClientWidth(node);
    },
    [assignClientWidth],
  );

  const tagsCallback = useCallback(
    (node: HTMLDivElement | null) => {
      tagsRef.current = node;
      assignClientWidth(node);
    },
    [assignClientWidth],
  );

  const renderResultText = (items: SelectValue[]) =>
    items.map((item) => item.name).join(',');

  return (
    <div>
      <div ref={containerCallback}>
        <div ref={tagsCallback}>{enabled ? hookValue.renderFakeTags() : null}</div>
      </div>
      <output data-testid="visible">{renderResultText(hookValue.visibleSelections)}</output>
      <output data-testid="overflow">
        {renderResultText(hookValue.overflowSelections)}
      </output>
      <output data-testid="take-count">{hookValue.takeCount}</output>
    </div>
  );
};

function getTextContent(
  element: HTMLElement,
  testId: TestIds,
) {
  return element.querySelector<HTMLElement>(`[data-testid="${testId}"]`)?.textContent;
}

describe('useSelectTriggerTags', () => {
  it('should return all selections when ellipsis disabled', () => {
    const { container } = render(
      <HookHarness enabled={false} value={selections.slice(0, 2)} />,
    );

    expect(getTextContent(container, 'visible')).toBe('Alpha,Beta');
    expect(getTextContent(container, 'overflow')).toBe('');
    expect(getTextContent(container, 'take-count')).toBe('2');
  });

  it('should calculate overflow selections when enabled', async () => {
    const { container } = render(
      <HookHarness
        containerWidth={120}
        enabled
        value={selections}
      />,
    );

    await waitFor(() => {
      expect(getTextContent(container, 'visible')).toBe('Alpha');
    });

    expect(getTextContent(container, 'overflow')).toBe('Beta,Gamma');
    expect(getTextContent(container, 'take-count')).toBe('1');
    expect(
      container.getElementsByClassName('mzn-select-trigger__fake-tag').length,
    ).toBe(selections.length);
  });

  it('should render nothing when no value provided', () => {
    const { container } = render(<HookHarness enabled value={[]} />);

    expect(getTextContent(container, 'visible')).toBe('');
    expect(getTextContent(container, 'overflow')).toBe('');
    expect(getTextContent(container, 'take-count')).toBe('0');
    expect(
      container.getElementsByClassName('mzn-select-trigger__fake-tag').length,
    ).toBe(0);
  });
});
