import { tagClasses as classes, TagSize, TagType } from '.';

describe('tag', () => {
  describe('tagClasses', () => {
    it('props:type', () => {
      const types: Array<TagType> = [
        'static',
        'counter',
        'overflow-counter',
        'dismissable',
        'addable',
      ];

      types.forEach((type) => {
        expect(classes.type(type)).toBe(`mzn-tag--${type}`);
      });
    });

    it('prop:size', () => {
      const sizes: TagSize[] = ['main', 'sub'];

      sizes.forEach((size) => {
        expect(classes.size(size)).toBe(`mzn-tag--${size}`);
      });
    });

    it('prop:host', () => {
      expect(classes.host).toBe('mzn-tag');
    });

    it('prop:label', () => {
      expect(classes.label).toBe('mzn-tag__label');
    });

    it('prop:icon', () => {
      expect(classes.icon).toBe('mzn-tag__icon');
    });

    it('prop:active', () => {
      expect(classes.active).toBe('mzn-tag--active');
    });

    it('prop:readOnly', () => {
      expect(classes.readOnly).toBe('mzn-tag--read-only');
    });

    it('prop:disabled', () => {
      expect(classes.disabled).toBe('mzn-tag--disabled');
    });
  });
});
