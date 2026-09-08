import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import MznCollapse from './collapse.vue';
import { getAutoSizeDuration } from './get-auto-size-duration';

function mountCollapse(props: Record<string, unknown> = {}) {
  const shown = ref(Boolean(props.in));
  const Host = defineComponent({
    render: () =>
      h(
        MznCollapse,
        { ...props, in: shown.value, id: 'collapse' },
        { default: () => h('div', { id: 'child' }, 'content') },
      ),
  });

  const wrapper = mount(Host, { attachTo: document.body });

  return { shown, wrapper };
}

const host = () => document.getElementById('collapse');
const child = () => document.getElementById('child');

describe('getAutoSizeDuration', () => {
  it('should be zero for no height', () => {
    expect(getAutoSizeDuration(0)).toBe(0);
    expect(getAutoSizeDuration()).toBe(0);
  });

  it('should grow with the height', () => {
    expect(getAutoSizeDuration(100)).toBeGreaterThan(getAutoSizeDuration(20));
  });
});

describe('MznCollapse', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render nothing until it first enters', async () => {
    mountCollapse();
    await flushPromises();

    expect(host()).toBeNull();
  });

  it('should wrap the content in the measuring pair', async () => {
    mountCollapse({ in: true });
    await flushPromises();

    const wrapper = host()?.firstElementChild as HTMLElement;

    expect(wrapper.style.display).toBe('flex');
    expect(wrapper.style.width).toBe('100%');
    expect((wrapper.firstElementChild as HTMLElement).style.width).toBe('100%');
    expect(child()?.textContent).toBe('content');
  });

  it('should animate the height open and settle on auto', async () => {
    vi.useFakeTimers();

    const { shown } = mountCollapse();

    shown.value = true;
    await flushPromises();

    expect(host()?.style.transition).toContain('height');
    expect(host()?.style.overflow).toBe('hidden');

    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(host()?.style.height).toBe('auto');
    // `entered` stops clipping, so a popper inside is not cut off.
    expect(host()?.style.overflow).toBe('visible');

    vi.useRealTimers();
  });

  it('should animate the height shut and hide itself when kept mounted', async () => {
    vi.useFakeTimers();

    const { shown } = mountCollapse({ in: true, keepMount: true });

    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    shown.value = false;
    await flushPromises();

    expect(host()?.style.height).toBe('0px');

    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(host()).not.toBeNull();
    expect(host()?.style.visibility).toBe('hidden');

    vi.useRealTimers();
  });

  it('should keep a non-zero collapsed height mounted without being asked', async () => {
    vi.useFakeTimers();

    const { shown } = mountCollapse({ collapsedHeight: 24, in: true });

    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    shown.value = false;
    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    // `keepMount` is forced on: unmounting would take the reserved height away.
    expect(host()).not.toBeNull();
    expect(host()?.style.height).toBe('24px');
    expect(host()?.style.minHeight).toBe('24px');
    expect(host()?.style.visibility).toBe('');

    vi.useRealTimers();
  });

  it('should report every phase in React’s order', async () => {
    vi.useFakeTimers();

    const calls: string[] = [];
    const on = (name: string) => () => calls.push(name);
    const { shown } = mountCollapse({
      onEnter: on('enter'),
      onEntered: on('entered'),
      onEntering: on('entering'),
      onExit: on('exit'),
      onExited: on('exited'),
      onExiting: on('exiting'),
    });

    shown.value = true;
    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    shown.value = false;
    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(calls).toEqual([
      'enter',
      'entering',
      'entered',
      'exit',
      'exiting',
      'exited',
    ]);

    vi.useRealTimers();
  });

  it('should mount already entered when it is in and not appearing', async () => {
    mountCollapse({ appear: false, in: true });
    await flushPromises();

    expect(host()?.style.overflow).toBe('visible');
  });

  it('should honour an explicit duration', async () => {
    vi.useFakeTimers();

    const { shown } = mountCollapse({ duration: 500 });

    shown.value = true;
    await flushPromises();

    expect(host()?.style.transition).toContain('500ms');

    vi.useRealTimers();
  });
});
