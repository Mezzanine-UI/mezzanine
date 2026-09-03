import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import MznTranslate from './translate.vue';
import type { TranslateFrom } from './translate.types';

const mountTranslate = (props: Record<string, unknown> = {}) => {
  const shown = ref(Boolean(props.in));
  const Host = defineComponent({
    render: () =>
      h(
        MznTranslate,
        { ...props, in: shown.value },
        { default: () => h('div', { id: 'child' }, 'content') },
      ),
  });

  mount(Host, { attachTo: document.body });

  return { shown };
};

const child = () => document.getElementById('child');

describe('MznTranslate', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    ['top', 'translate3d(0, -4px, 0)'],
    ['bottom', 'translate3d(0, 4px, 0)'],
    ['left', 'translate3d(-4px, 0, 0)'],
    ['right', 'translate3d(4px, 0, 0)'],
  ] as [TranslateFrom, string][])(
    'should rest offset from %s',
    async (from, transform) => {
      mountTranslate({ from, keepMount: true });
      await flushPromises();

      expect(child()?.style.transform).toBe(transform);
      expect(child()?.style.opacity).toBe('0');
    },
  );

  it('should settle at the origin when entering', async () => {
    const { shown } = mountTranslate({ from: 'left' });

    shown.value = true;
    await flushPromises();

    expect(child()?.style.transform).toBe('translate3d(0, 0, 0)');
    expect(child()?.style.opacity).toBe('1');
  });
});
