import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import MznFade from './fade.vue';

const mountFade = (props: Record<string, unknown> = {}) => {
  const shown = ref(Boolean(props.in));
  const Host = defineComponent({
    render: () =>
      h(
        MznFade,
        { ...props, in: shown.value },
        { default: () => h('div', { id: 'child' }, 'content') },
      ),
  });

  const wrapper = mount(Host, { attachTo: document.body });

  return { shown, wrapper };
};

const child = () => document.getElementById('child');

describe('MznFade', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should not render the child before the first enter', () => {
    mountFade();

    expect(child()).toBeNull();
  });

  it('should write the fade styles when entering', async () => {
    const { shown } = mountFade();

    shown.value = true;
    await flushPromises();

    expect(child()).not.toBeNull();
    expect(child()?.style.opacity).toBe('1');
    expect(child()?.style.transition).toContain('opacity');
  });

  it('should mount hidden when keepMount starts out exited', async () => {
    mountFade({ keepMount: true });

    await flushPromises();

    expect(child()).not.toBeNull();
    expect(child()?.style.visibility).toBe('hidden');
    expect(child()?.style.opacity).toBe('0');
  });

  it('should fade back in when keepMount re-enters', async () => {
    vi.useFakeTimers();

    const { shown } = mountFade({ keepMount: true });

    await flushPromises();

    shown.value = true;
    await flushPromises();

    expect(child()?.style.visibility).toBe('');
    expect(child()?.style.opacity).toBe('1');

    vi.advanceTimersByTime(1000);
    vi.useRealTimers();
  });

  it('should keep the child mounted and hide it when keepMount is set', async () => {
    vi.useFakeTimers();

    const { shown } = mountFade({ in: true, keepMount: true });

    await flushPromises();

    shown.value = false;
    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(child()).not.toBeNull();
    expect(child()?.style.visibility).toBe('hidden');
    expect(child()?.style.opacity).toBe('0');

    vi.useRealTimers();
  });
});
