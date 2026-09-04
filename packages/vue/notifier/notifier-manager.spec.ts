import { createNotifierManager } from './notifier-manager';
import type { NotifierData, NotifierKey } from './notifier.types';

type Entry = NotifierData & { key: NotifierKey; order?: number };

const entry = (key: NotifierKey, order?: number): Entry => ({ key, order });

describe('createNotifierManager', () => {
  it('should display what it is given, in order', () => {
    const manager = createNotifierManager<Entry>();

    manager.add(entry('a'));
    manager.add(entry('b'));

    expect(manager.displayed.value.map((n) => n.key)).toEqual(['a', 'b']);
    expect(manager.queued.value).toHaveLength(0);
  });

  it('should update in place when the key is already displayed', () => {
    const manager = createNotifierManager<Entry>();

    manager.add({ key: 'a', children: 'first' });
    manager.add({ key: 'a', children: 'second' });

    expect(manager.displayed.value).toHaveLength(1);
    expect(manager.displayed.value[0].children).toBe('second');
  });

  describe('maxCount', () => {
    it('should queue anything past the limit', () => {
      const manager = createNotifierManager<Entry>({ maxCount: 2 });

      ['a', 'b', 'c'].forEach((key) => manager.add(entry(key)));

      expect(manager.displayed.value.map((n) => n.key)).toEqual(['a', 'b']);
      expect(manager.queued.value.map((n) => n.key)).toEqual(['c']);
    });

    it('should promote from the queue when a slot frees up', () => {
      const manager = createNotifierManager<Entry>({ maxCount: 2 });

      ['a', 'b', 'c'].forEach((key) => manager.add(entry(key)));
      manager.remove('a');

      expect(manager.displayed.value.map((n) => n.key)).toEqual(['b', 'c']);
      expect(manager.queued.value).toHaveLength(0);
    });

    it('should remove from the queue too', () => {
      const manager = createNotifierManager<Entry>({ maxCount: 1 });

      ['a', 'b'].forEach((key) => manager.add(entry(key)));
      manager.remove('b');

      expect(manager.queued.value).toHaveLength(0);
      expect(manager.displayed.value.map((n) => n.key)).toEqual(['a']);
    });

    it('should display everything without a limit', () => {
      const manager = createNotifierManager<Entry>();

      ['a', 'b', 'c', 'd', 'e'].forEach((key) => manager.add(entry(key)));

      expect(manager.displayed.value).toHaveLength(5);
    });
  });

  describe('sortBeforeUpdate', () => {
    const byOrder = (notifiers: Entry[]) =>
      [...notifiers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    it('should sort what is displayed', () => {
      const manager = createNotifierManager<Entry>({
        sortBeforeUpdate: byOrder,
      });

      manager.add(entry('a', 2));
      manager.add(entry('b', 1));

      expect(manager.displayed.value.map((n) => n.key)).toEqual(['b', 'a']);
    });

    it('should sort across the boundary, so a late arrival can displace one', () => {
      const manager = createNotifierManager<Entry>({
        maxCount: 2,
        sortBeforeUpdate: byOrder,
      });

      manager.add(entry('a', 1));
      manager.add(entry('b', 3));
      manager.add(entry('c', 2));

      // Without the sort the newcomer would simply queue; with it, `b` is the
      // one pushed out, which is what React's manager does.
      expect(manager.displayed.value.map((n) => n.key)).toEqual(['a', 'c']);
      expect(manager.queued.value.map((n) => n.key)).toEqual(['b']);
    });
  });
});
