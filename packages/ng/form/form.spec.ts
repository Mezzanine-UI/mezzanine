import { MznFormField } from './form-field.component';
import { MznFormGroup } from './form-group.component';
import { MznFormLabel } from './form-label.component';
import { MznFormHintText } from './form-hint-text.component';

// Family-level smoke spec — Form is a collection of layout/CVA primitives:
// MznFormField (label + control + hint container), MznFormGroup, MznFormLabel,
// MznFormHintText. Detailed behavior is in form-field.component.spec.ts.
describe('Form (family)', () => {
  it('should export MznFormField', () => {
    expect(MznFormField).toBeDefined();
  });

  it('should export MznFormGroup', () => {
    expect(MznFormGroup).toBeDefined();
  });

  it('should export MznFormLabel', () => {
    expect(MznFormLabel).toBeDefined();
  });

  it('should export MznFormHintText', () => {
    expect(MznFormHintText).toBeDefined();
  });
});
