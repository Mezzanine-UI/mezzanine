import { TestBed } from '@angular/core/testing';
import { MznMessageService } from './message.service';
import { MznNotifierService } from '../notifier/notifier.service';

describe('MznMessageService', () => {
  let service: MznMessageService;
  let notifier: MznNotifierService;

  beforeEach(() => {
    service = TestBed.inject(MznMessageService);
    notifier = TestBed.inject(MznNotifierService);
    notifier.destroy();
  });

  it('should add a message', () => {
    const key = service.add({ message: 'Hello' });

    expect(key).toBeTruthy();
    expect(notifier.displayed().length).toBe(1);
  });

  it('should add success message with severity', () => {
    service.success('Done!');

    expect(notifier.displayed()[0]['severity']).toBe('success');
  });

  it('should add error message with severity', () => {
    service.error('Failed!');

    expect(notifier.displayed()[0]['severity']).toBe('error');
  });

  it('should add info message with severity', () => {
    service.info('FYI');

    expect(notifier.displayed()[0]['severity']).toBe('info');
  });

  it('should add warning message with severity', () => {
    service.warning('Careful!');

    expect(notifier.displayed()[0]['severity']).toBe('warning');
  });

  it('should add loading message with duration false', () => {
    service.loading('Processing...');

    expect(notifier.displayed()[0]['severity']).toBe('loading');
    expect(notifier.displayed()[0]['duration']).toBe(false);
  });

  it('should remove a message', () => {
    const key = service.add({ message: 'Hello' });

    service.remove(key);

    expect(notifier.displayed().length).toBe(0);
  });

  it('should destroy all messages', () => {
    service.add({ message: '1' });
    service.add({ message: '2' });
    service.destroy();

    expect(notifier.displayed().length).toBe(0);
  });

  it('should update config', () => {
    service.config({ maxCount: 10 });

    expect(notifier.getConfig().maxCount).toBe(10);
  });
});
