import { TestBed } from '@angular/core/testing';
import { EscapeKeyService } from './escape-key.service';

describe('EscapeKeyService', () => {
  let service: EscapeKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscapeKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call handler on Escape key press', () => {
    const handler = jest.fn();
    const cleanup = service.listen(handler);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should not call handler for other keys', () => {
    const handler = jest.fn();
    const cleanup = service.listen(handler);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    cleanup();
  });

  it('should stop listening after cleanup', () => {
    const handler = jest.fn();
    const cleanup = service.listen(handler);

    cleanup();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should prevent default on Escape key', () => {
    const handler = jest.fn();
    const cleanup = service.listen(handler);

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      cancelable: true,
    });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);

    cleanup();
  });
});
