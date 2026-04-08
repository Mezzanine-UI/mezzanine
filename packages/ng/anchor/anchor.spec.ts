import { MznAnchorGroup } from './anchor-group.component';
import { MznAnchorItem } from './anchor-item.component';

// Family-level smoke spec (Anchor has no single root component — only
// MznAnchorGroup + MznAnchorItem). Detailed behavior covered in
// anchor-group.component.spec.ts / anchor-item.component.spec.ts.
describe('Anchor (family)', () => {
  it('should export MznAnchorGroup', () => {
    expect(MznAnchorGroup).toBeDefined();
  });

  it('should export MznAnchorItem', () => {
    expect(MznAnchorItem).toBeDefined();
  });
});
