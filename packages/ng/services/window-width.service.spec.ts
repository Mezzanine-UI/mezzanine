import { TestBed } from '@angular/core/testing';
import { WindowWidthService } from './window-width.service';

describe('WindowWidthService', () => {
  let service: WindowWidthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowWidthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with window.innerWidth', () => {
    expect(service.width()).toBe(window.innerWidth);
  });

  it('should update width on resize after startListening', () => {
    service.startListening();

    Object.defineProperty(window, 'innerWidth', {
      value: 500,
      configurable: true,
    });
    window.dispatchEvent(new Event('resize'));

    expect(service.width()).toBe(500);
  });

  it('should not start multiple listeners', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');

    service.startListening();
    service.startListening();

    const resizeCalls = addSpy.mock.calls.filter(
      ([event]) => event === 'resize',
    );

    expect(resizeCalls).toHaveLength(1);

    addSpy.mockRestore();
  });
});
