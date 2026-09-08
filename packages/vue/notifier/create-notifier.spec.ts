import { flushPromises } from '@vue/test-utils';
import { h } from 'vue';
import { createNotifier } from './create-notifier';
import type { NotifierData, NotifierKey } from './notifier.types';

type Entry = NotifierData & { reference?: NotifierKey };

const makeNotifier = (
  overrides: Partial<Parameters<typeof createNotifier<Entry>>[0]> = {},
) =>
  createNotifier<Entry>({
    render: ({ children, key }) =>
      h('div', { class: 'notification', 'data-key': String(key) }, [children]),
    ...overrides,
  });

const notifications = () =>
  Array.from(document.body.querySelectorAll('.notification'));

describe('createNotifier', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render nothing until the first add', () => {
    makeNotifier();

    expect(document.body.children).toHaveLength(0);
  });

  it('should mount a container and render on add', async () => {
    const notifier = makeNotifier();

    notifier.add({ children: 'foo' });
    await flushPromises();

    expect(notifications()).toHaveLength(1);
    expect(notifications()[0].textContent).toBe('foo');
  });

  it('should hand the container to setRoot before mounting', async () => {
    const notifier = makeNotifier({
      setRoot: (root) => {
        root.style.position = 'fixed';
        root.id = 'notifier-root';
      },
    });

    notifier.add({ children: 'foo' });
    await flushPromises();

    const root = document.getElementById('notifier-root');

    expect(root?.style.position).toBe('fixed');
    expect(root?.querySelector('.notification')).not.toBeNull();
  });

  it('should return unique keys even within the same millisecond', () => {
    const notifier = makeNotifier();
    const keys = [
      notifier.add({ children: 'a' }),
      notifier.add({ children: 'b' }),
      notifier.add({ children: 'c' }),
    ];

    expect(new Set(keys).size).toBe(3);
  });

  it('should treat a repeated key as an update', async () => {
    const notifier = makeNotifier();

    notifier.add({ children: 'first', key: 'same' });
    notifier.add({ children: 'second', key: 'same' });
    await flushPromises();

    expect(notifications()).toHaveLength(1);
    expect(notifications()[0].textContent).toBe('second');
  });

  it('should remove by key', async () => {
    const notifier = makeNotifier();
    const key = notifier.add({ children: 'foo' });

    await flushPromises();
    notifier.remove(key);
    await flushPromises();

    expect(notifications()).toHaveLength(0);
  });

  it('should unmount and detach the container on destroy', async () => {
    const notifier = makeNotifier();

    notifier.add({ children: 'foo' });
    await flushPromises();

    notifier.destroy();
    await flushPromises();

    expect(document.body.children).toHaveLength(0);
  });

  it('should work again after being destroyed', async () => {
    const notifier = makeNotifier();

    notifier.add({ children: 'first' });
    await flushPromises();
    notifier.destroy();
    await flushPromises();

    notifier.add({ children: 'second' });
    await flushPromises();

    // React re-renders because unmounting clears its controller ref, and the
    // old notifications go with the unmounted component.
    expect(notifications()).toHaveLength(1);
    expect(notifications()[0].textContent).toBe('second');
  });

  describe('config', () => {
    it('should expose the constructor config', () => {
      const notifier = makeNotifier({ duration: 3000, maxCount: 4 });

      expect(notifier.getConfig()).toMatchObject({
        duration: 3000,
        maxCount: 4,
      });
    });

    it('should merge later config calls', () => {
      const notifier = makeNotifier({ duration: 3000, maxCount: 4 });

      notifier.config({ duration: 1000 });

      expect(notifier.getConfig()).toMatchObject({
        duration: 1000,
        maxCount: 4,
      });
    });

    it("should let a notifier's own duration win over the config", async () => {
      // Asserted per notifier rather than by call count: React re-renders the
      // whole list on every add and Vue batches, so counting renders would be
      // testing the framework, not the contract.
      const seen = new Map<unknown, number | false | undefined>();
      const notifier = createNotifier<Entry>({
        duration: 3000,
        render: ({ children, duration }) => {
          seen.set(children, duration);

          return h('div', { class: 'notification' }, [children]);
        },
      });

      notifier.add({ children: 'inherits' });
      notifier.add({ children: 'overrides', duration: 500 });
      await flushPromises();

      expect(seen.get('inherits')).toBe(3000);
      expect(seen.get('overrides')).toBe(500);
    });
  });

  describe('renderContainer', () => {
    it('should wrap the notifications', async () => {
      const notifier = makeNotifier({
        renderContainer: (children) =>
          h('section', { class: 'group' }, children),
      });

      notifier.add({ children: 'foo' });
      await flushPromises();

      expect(
        document.body.querySelector('.group .notification'),
      ).not.toBeNull();
    });

    it('should render nothing while there are no notifications', async () => {
      const notifier = makeNotifier({
        renderContainer: (children) =>
          h('section', { class: 'group' }, children),
      });

      const key = notifier.add({ children: 'foo' });

      await flushPromises();
      notifier.remove(key);
      await flushPromises();

      expect(document.body.querySelector('.group')).toBeNull();
    });
  });
});
