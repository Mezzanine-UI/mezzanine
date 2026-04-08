import { TestBed } from '@angular/core/testing';
import { ScrollLockService } from './scroll-lock.service';

describe('ScrollLockService', () => {
  let service: ScrollLockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollLockService);

    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set overflow to hidden on lock', () => {
    service.lock();

    expect(document.body.style.overflow).toBe('hidden');

    service.unlock();
  });

  it('should restore overflow on unlock', () => {
    document.body.style.overflow = 'auto';

    service.lock();
    service.unlock();

    expect(document.body.style.overflow).toBe('auto');
  });

  it('should support nested locks', () => {
    service.lock();
    service.lock();

    service.unlock();

    expect(document.body.style.overflow).toBe('hidden');

    service.unlock();

    expect(document.body.style.overflow).toBe('');
  });

  it('should not go below zero lock count', () => {
    service.unlock();
    service.unlock();

    expect(document.body.style.overflow).toBe('');
  });
});
