import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import type { OverlayScrollbars } from 'overlayscrollbars';
import { useTableScroll } from './use-table-scroll';

/** The composable disconnects its observer on unmount, so it needs an instance. */
function run(enabled = true) {
  let result!: ReturnType<typeof useTableScroll>;

  const wrapper = mount(
    defineComponent({
      setup() {
        result = useTableScroll({ enabled: () => enabled });

        return () => h('div');
      },
    }),
  );

  return [result, wrapper] as const;
}

const scrollEvent = (scrollLeft: number): Event => {
  const target = document.createElement('div');

  Object.defineProperty(target, 'scrollLeft', { value: scrollLeft });

  return { target } as unknown as Event;
};

describe('useTableScroll', () => {
  it('should start with nothing measured', () => {
    const [scroll] = run();

    expect(scroll.containerRef.value).toBeNull();
    expect(scroll.containerWidth.value).toBe(0);
    expect(scroll.isContainerReady.value).toBe(false);
    expect(scroll.isScrollingHorizontally.value).toBe(false);
    expect(scroll.scrollLeft.value).toBe(0);
  });

  it('should adopt the element the scrollbar hands over', () => {
    const [scroll] = run();
    const viewport = document.createElement('div');

    scroll.handleViewportReady(viewport);

    expect(scroll.containerRef.value).toBe(viewport);
    expect(scroll.isContainerReady.value).toBe(true);
  });

  it('should adopt the plain div the disabled scrollbar falls back to', () => {
    const [scroll] = run();
    const element = document.createElement('div');

    scroll.setContainerRef(element);

    expect(scroll.containerRef.value).toBe(element);
    expect(scroll.isContainerReady.value).toBe(true);

    scroll.setContainerRef(null);

    expect(scroll.containerRef.value).toBeNull();
    expect(scroll.isContainerReady.value).toBe(false);
  });

  it('should hold the element but stay unready while disabled', () => {
    const [scroll] = run(false);
    const element = document.createElement('div');

    scroll.setContainerRef(element);

    expect(scroll.containerRef.value).toBe(element);
    expect(scroll.isContainerReady.value).toBe(false);
  });

  it('should follow the horizontal scroll position', () => {
    const [scroll] = run();
    const instance = {} as OverlayScrollbars;

    scroll.handleScrollbarScroll(instance, scrollEvent(120));

    expect(scroll.scrollLeft.value).toBe(120);
    expect(scroll.isScrollingHorizontally.value).toBe(true);

    scroll.handleScrollbarScroll(instance, scrollEvent(0));

    expect(scroll.scrollLeft.value).toBe(0);
    expect(scroll.isScrollingHorizontally.value).toBe(false);
  });

  it('should stop observing on unmount', () => {
    const disconnect = vi.fn();

    vi.stubGlobal(
      'ResizeObserver',
      class {
        disconnect = disconnect;
        observe = vi.fn();
        unobserve = vi.fn();
      },
    );

    const [scroll, wrapper] = run();

    scroll.setContainerRef(document.createElement('div'));
    wrapper.unmount();

    expect(disconnect).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
