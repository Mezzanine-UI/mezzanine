import { MznMessage } from './message.component';
import { MznMessageService } from './message.service';

// Family-level smoke spec — detailed behavior covered in
// message.service.spec.ts. Component is rendered via service.
describe('Message (family)', () => {
  it('should export MznMessage component', () => {
    expect(MznMessage).toBeDefined();
  });

  it('should export MznMessageService', () => {
    expect(MznMessageService).toBeDefined();
  });
});
