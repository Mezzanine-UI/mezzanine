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

  /**
   * Known gap, pending a decision — see the note in COMPONENTS.md.
   *
   * `keepMount` means "stay in the DOM but animate out", and Vue's Transition
   * only runs its leave hooks when the child is actually removed. Making it
   * work needs the child rendered through `withDirectives(cloneVNode(child),
   * [[vShow, props.in]])` in a render function, since `v-show` cannot be put
   * on a slot outlet. No component in the port uses `keepMount` yet.
   */
  it.skip('should keep the child mounted and hide it when keepMount is set', async () => {
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
