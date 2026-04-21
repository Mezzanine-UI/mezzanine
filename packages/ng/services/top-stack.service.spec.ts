import { TestBed } from '@angular/core/testing';
import { TopStackService } from './top-stack.service';

describe('TopStackService', () => {
  let service: TopStackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopStackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report single entry as top', () => {
    const entry = service.register();

    expect(entry.isTop()).toBe(true);

    entry.unregister();
  });

  it('should report latest entry as top', () => {
    const entry1 = service.register();
    const entry2 = service.register();

    expect(entry1.isTop()).toBe(false);
    expect(entry2.isTop()).toBe(true);

    entry1.unregister();
    entry2.unregister();
  });

  it('should update top after unregister', () => {
    const entry1 = service.register();
    const entry2 = service.register();

    entry2.unregister();

    expect(entry1.isTop()).toBe(true);

    entry1.unregister();
  });

  it('should handle multiple registrations and unregistrations', () => {
    const entry1 = service.register();
    const entry2 = service.register();
    const entry3 = service.register();

    expect(entry3.isTop()).toBe(true);

    entry3.unregister();

    expect(entry2.isTop()).toBe(true);

    entry2.unregister();

    expect(entry1.isTop()).toBe(true);

    entry1.unregister();
  });

  it('should handle unregistering middle entry', () => {
    const entry1 = service.register();
    const entry2 = service.register();
    const entry3 = service.register();

    entry2.unregister();

    expect(entry3.isTop()).toBe(true);
    expect(entry1.isTop()).toBe(false);

    entry1.unregister();
    entry3.unregister();
  });
});
