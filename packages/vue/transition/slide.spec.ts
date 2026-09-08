import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import MznSlide from './slide.vue';
import type { SlideFrom } from './slide.types';

const mountSlide = (props: Record<string, unknown> = {}) => {
  const shown = ref(Boolean(props.in));
  const Host = defineComponent({
    render: () =>
      h(
        MznSlide,
        { ...props, in: shown.value },
        { default: () => h('div', { id: 'child' }, 'content') },
      ),
  });

  mount(Host, { attachTo: document.body });

  return { shown };
};

const child = () => document.getElementById('child');

describe('MznSlide', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    ['right', 'translate3d(100%, 0, 0)'],
    ['top', 'translate3d(0, -100%, 0)'],
  ] as [SlideFrom, string][])(
    'should rest off screen from %s',
    async (from, transform) => {
      mountSlide({ from, keepMount: true, lazyMount: false });
      await flushPromises();

      expect(child()?.style.transform).toBe(transform);
    },
  );

  it('should slide to the origin when entering', async () => {
    const { shown } = mountSlide();

    shown.value = true;
    await flushPromises();

    expect(child()?.style.transform).toBe('translate3d(0, 0, 0)');
    // Slide moves without fading, unlike Translate.
    expect(child()?.style.opacity).toBe('');
    expect(child()?.style.transition).toContain('transform');
    expect(child()?.style.transition).not.toContain('opacity');
  });
});
