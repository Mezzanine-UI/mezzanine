import { tagClasses as classes, TagSize } from '.';

describe('tag', () => {
  describe('tagClasses', () => {
    it('prop:host', () => {
      expect(classes.host).toBe('mzn-tag');
    });

    it('prop:label', () => {
      expect(classes.label).toBe('mzn-tag__label');
    });

    it('prop:closeIcon', () => {
      expect(classes.closeIcon).toBe('mzn-tag__close-icon');
    });

    it('prop:disabled', () => {
      expect(classes.disabled).toBe('mzn-tag--disabled');
    });

    it('prop:size', () => {
      const sizes: TagSize[] = [
        'small',
        'medium',
        'large',
      ];

      sizes.forEach((size) => {
        expect(classes.size(size)).toBe(`mzn-tag--${size}`);
      });
    });
  });
});
