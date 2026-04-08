import { MznNotifierService } from './notifier.service';

// Family-level smoke spec — Notifier is a service-only entry-point with no
// component/directive of its own (it imperatively renders via overlay).
// Service behavior is fully covered in notifier.service.spec.ts.
describe('Notifier (family)', () => {
  it('should export MznNotifierService', () => {
    expect(MznNotifierService).toBeDefined();
  });
});
