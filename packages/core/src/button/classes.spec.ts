import { classes } from './classes';
import { ButtonColor, ButtonSize, ButtonVariant } from './typings';

describe('button:classes', () => {
  it('prop:host', () => {
    expect(classes.host).toBe('mzn-button');
  });

  it('prop:label', () => {
    expect(classes.label).toBe('mzn-button__label');
  });

  it('prop:variant', () => {
    const variants: ButtonVariant[] = [
      'text',
      'outlined',
      'contained',
    ];

    variants.forEach((variant) => {
      const expected = variant === 'text' ? '' : `mzn-button--${variant}`;

      expect(classes.variant(variant)).toBe(expected);
    });
  });

  it('prop:color', () => {
    const colors: ButtonColor[] = [
      'primary',
      'secondary',
      'error',
    ];

    colors.forEach((color) => {
      expect(classes.color(color)).toBe(`mzn-button--${color}`);
    });
  });

  it('prop:size', () => {
    const sizes: ButtonSize[] = [
      'small',
      'medium',
      'large',
    ];

    sizes.forEach((size) => {
      expect(classes.size(size)).toBe(`mzn-button--${size}`);
    });
  });

  it('prop:icon', () => {
    expect(classes.icon).toBe('mzn-button--icon');
  });

  it('prop:loading', () => {
    expect(classes.loading).toBe('mzn-button--loading');
  });
});
