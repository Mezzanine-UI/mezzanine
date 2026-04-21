import { TestBed } from '@angular/core/testing';
import { ClickAwayService } from './click-away.service';

describe('ClickAwayService', () => {
  let service: ClickAwayService;
  let rafCallbacks: Array<FrameRequestCallback>;
  let originalRaf: typeof requestAnimationFrame;

  beforeEach(() => {
    rafCallbacks = [];
    originalRaf = window.requestAnimationFrame;

    window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      rafCallbacks.push(cb);

      return rafCallbacks.length;
    };

    TestBed.configureTestingModule({});
    service = TestBed.inject(ClickAwayService);
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRaf;
  });

  function flushRaf(): void {
    const cbs = [...rafCallbacks];

    rafCallbacks.length = 0;
    cbs.forEach((cb) => cb(performance.now()));
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call handler when clicking outside the container', () => {
    const container = document.createElement('div');
    const outside = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(outside);

    const handler = jest.fn();

    service.listen(container, handler);
    flushRaf();

    outside.click();

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it('should not call handler when clicking inside the container', () => {
    const container = document.createElement('div');
    const child = document.createElement('span');

    container.appendChild(child);
    document.body.appendChild(container);

    const handler = jest.fn();

    service.listen(container, handler);
    flushRaf();

    child.click();

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('should stop listening after cleanup is called', () => {
    const container = document.createElement('div');
    const outside = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(outside);

    const handler = jest.fn();
    const cleanup = service.listen(container, handler);

    flushRaf();
    cleanup();
    outside.click();

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it('should not register listeners if cleanup is called before rAF fires', () => {
    const container = document.createElement('div');
    const outside = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(outside);

    const handler = jest.fn();
    const cleanup = service.listen(container, handler);

    cleanup();
    flushRaf();
    outside.click();

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it('should not fire for the click that triggered listen (deferred registration)', () => {
    const container = document.createElement('div');
    const trigger = document.createElement('button');

    document.body.appendChild(container);
    document.body.appendChild(trigger);

    const handler = jest.fn();

    // Simulate: click handler calls listen, then click bubbles to document
    trigger.addEventListener('click', () => {
      service.listen(container, handler);
    });

    trigger.click();

    // rAF has not fired yet, so the document listener is not registered
    expect(handler).not.toHaveBeenCalled();

    // Now flush rAF and click outside
    flushRaf();
    trigger.click();
    // After flushing, the second listen is also deferred, but the first listen's
    // listener is now active — trigger is outside container
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
    document.body.removeChild(trigger);
  });
});
