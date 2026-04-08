import { TestBed } from '@angular/core/testing';
import { MznNotifierService, NotifierData } from './notifier.service';

describe('MznNotifierService', () => {
  let service: MznNotifierService;

  beforeEach(() => {
    service = TestBed.inject(MznNotifierService);
    service.destroy();
    service.setSortBeforeUpdate(null);
  });

  it('should add a notification', () => {
    const key = service.add({ message: 'Hello' });

    expect(key).toBeTruthy();
    expect(service.displayed().length).toBe(1);
    expect(service.displayed()[0].message).toBe('Hello');
  });

  it('should generate unique keys', () => {
    const key1 = service.add({ message: 'First' });
    const key2 = service.add({ message: 'Second' });

    expect(key1).not.toBe(key2);
  });

  it('should remove a notification', () => {
    const key = service.add({ message: 'Hello' });

    service.remove(key);

    expect(service.displayed().length).toBe(0);
  });

  it('should queue notifications when maxCount is reached', () => {
    service.config({ maxCount: 2 });
    service.add({ message: '1' });
    service.add({ message: '2' });
    service.add({ message: '3' });

    expect(service.displayed().length).toBe(2);
    expect(service.queued().length).toBe(1);
  });

  it('should dequeue when a displayed notification is removed', () => {
    service.config({ maxCount: 2 });
    const key1 = service.add({ message: '1' });

    service.add({ message: '2' });
    service.add({ message: '3' });

    service.remove(key1);

    expect(service.displayed().length).toBe(2);
    expect(service.queued().length).toBe(0);
    expect(service.displayed()[1].message).toBe('3');
  });

  it('should update in place if key exists', () => {
    service.add({ key: 'test', message: 'Original' });
    service.add({ key: 'test', message: 'Updated' });

    expect(service.displayed().length).toBe(1);
    expect(service.displayed()[0].message).toBe('Updated');
  });

  it('should destroy all notifications', () => {
    service.add({ message: '1' });
    service.add({ message: '2' });
    service.destroy();

    expect(service.displayed().length).toBe(0);
    expect(service.queued().length).toBe(0);
  });

  it('should return config', () => {
    service.config({ duration: 5000, maxCount: 10 });

    const config = service.getConfig();

    expect(config.duration).toBe(5000);
    expect(config.maxCount).toBe(10);
  });

  describe('sortBeforeUpdate', () => {
    interface SeverityNotifier extends NotifierData {
      readonly severity: 'error' | 'warning' | 'info';
      readonly createdAt: number;
    }

    // errors first, then by createdAt descending (newest first)
    const sortBySeverity = (
      items: ReadonlyArray<NotifierData>,
    ): ReadonlyArray<NotifierData> => {
      const typed = items as ReadonlyArray<SeverityNotifier>;

      return [...typed].sort((a, b) => {
        const getPriority = (s: SeverityNotifier['severity']): number =>
          s === 'info' ? 1 : 0;
        const diff = getPriority(a.severity) - getPriority(b.severity);

        if (diff !== 0) {
          return diff;
        }

        return b.createdAt - a.createdAt;
      });
    };

    beforeEach(() => {
      service.setSortBeforeUpdate(sortBySeverity);
    });

    it('should sort displayed notifications on add', () => {
      const now = Date.now();

      service.add({
        key: '1',
        severity: 'info',
        createdAt: now,
        message: 'info',
      });
      service.add({
        key: '2',
        severity: 'error',
        createdAt: now + 1,
        message: 'error',
      });
      service.add({
        key: '3',
        severity: 'warning',
        createdAt: now + 2,
        message: 'warning',
      });

      const keys = service.displayed().map((n) => n.key);

      expect(keys).toEqual(['3', '2', '1']);
    });

    it('should sort when updating an existing entry', () => {
      const now = Date.now();

      service.add({
        key: '1',
        severity: 'error',
        createdAt: now,
        message: 'error',
      });
      service.add({
        key: '2',
        severity: 'info',
        createdAt: now + 1,
        message: 'info',
      });

      // Update key '2' to become error (higher priority)
      service.add({
        key: '2',
        severity: 'error',
        createdAt: now + 1,
        message: 'error updated',
      });

      const keys = service.displayed().map((n) => n.key);

      expect(keys[0]).toBe('2');
    });

    it('should merge-sort when maxCount is reached and new item has higher priority', () => {
      const now = Date.now();

      service.config({ maxCount: 2 });
      service.add({
        key: '1',
        severity: 'info',
        createdAt: now,
        message: 'info 1',
      });
      service.add({
        key: '2',
        severity: 'info',
        createdAt: now + 1,
        message: 'info 2',
      });

      // Add an error — should displace an info from displayed
      service.add({
        key: '3',
        severity: 'error',
        createdAt: now + 2,
        message: 'error',
      });

      const displayedKeys = service.displayed().map((n) => n.key);
      const queuedKeys = service.queued().map((n) => n.key);

      expect(displayedKeys).toContain('3');
      expect(displayedKeys.length).toBe(2);
      expect(queuedKeys.length).toBe(1);
    });

    it('should sort displayed list after remove and dequeue', () => {
      const now = Date.now();

      service.config({ maxCount: 2 });
      service.add({
        key: '1',
        severity: 'info',
        createdAt: now,
        message: 'info 1',
      });
      service.add({
        key: '2',
        severity: 'info',
        createdAt: now + 1,
        message: 'info 2',
      });
      service.add({
        key: '3',
        severity: 'error',
        createdAt: now + 2,
        message: 'error (queued)',
      });

      service.remove('1');

      const displayedKeys = service.displayed().map((n) => n.key);

      expect(displayedKeys[0]).toBe('3');
      expect(displayedKeys.length).toBe(2);
      expect(service.queued().length).toBe(0);
    });
  });
});
