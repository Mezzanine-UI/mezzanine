import { MznCollapse } from './collapse.directive';
import { MznFade } from './fade.directive';
import { MznRotate } from './rotate.directive';
import { MznScale } from './scale.directive';
import { MznSlide } from './slide.directive';
import { MznTranslate } from './translate.directive';

// Family-level smoke spec (Transition has no single root component — it is a
// collection of directives + Angular animation triggers). Animation behavior
// is covered in animations.spec.ts; per-directive integration is exercised
// indirectly through consumer components (Modal, Drawer, Accordion, ...).
describe('Transition (family)', () => {
  it('should export MznCollapse directive', () => {
    expect(MznCollapse).toBeDefined();
  });

  it('should export MznFade directive', () => {
    expect(MznFade).toBeDefined();
  });

  it('should export MznRotate directive', () => {
    expect(MznRotate).toBeDefined();
  });

  it('should export MznScale directive', () => {
    expect(MznScale).toBeDefined();
  });

  it('should export MznSlide directive', () => {
    expect(MznSlide).toBeDefined();
  });

  it('should export MznTranslate directive', () => {
    expect(MznTranslate).toBeDefined();
  });
});
