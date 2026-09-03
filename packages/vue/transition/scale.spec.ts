import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import MznScale from './scale.vue';

const mountScale = (props: Record<string, unknown> = {}) => {
  const shown = ref(Boolean(props.in));
  const Host = defineComponent({
    render: () =>
      h(
        MznScale,
        { ...props, in: shown.value },
        { default: () => h('div', { id: 'child' }, 'content') },
      ),
  });

  mount(Host, { attachTo: document.body });

  return { shown };
};

const child = () => document.getElementById('child');

describe('MznScale', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should scale up and fade in when entering', async () => {
    const { shown } = mountScale();

    shown.value = true;
    await flushPromises();

    expect(child()?.style.opacity).toBe('1');
    expect(child()?.style.transform).toBe('scale(1)');
    expect(child()?.style.transition).toContain('opacity');
    expect(child()?.style.transition).toContain('transform');
  });

  it('should drop the transform once entered', async () => {
    vi.useFakeTimers();

    const { shown } = mountScale();

    shown.value = true;
    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    // React swaps `scale(1)` for `none` on entered so the element stops being
    // a containing block for fixed descendants.
    expect(child()?.style.transform).toBe('none');

    vi.useRealTimers();
  });

  it('should rest scaled down and hidden while kept mounted', async () => {
    mountScale({ keepMount: true, lazyMount: false });
    await flushPromises();

    expect(child()?.style.opacity).toBe('0');
    expect(child()?.style.transform).toBe('scale(0.95)');
    expect(child()?.style.visibility).toBe('hidden');
  });

  it('should apply the transform origin', async () => {
    mountScale({
      keepMount: true,
      lazyMount: false,
      transformOrigin: 'top left',
    });
    await flushPromises();

    expect(child()?.style.transformOrigin).toBe('top left');
  });
});
