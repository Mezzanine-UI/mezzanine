import { TypographyVariant } from './typings';
import { classes } from './classes';

describe('typography:classes', () => {
  it('prop:variant', () => {
    const variants: TypographyVariant[] = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'body1',
      'body2',
      'button1',
      'button2',
      'button3',
      'input1',
      'input2',
      'input3',
      'caption',
    ];

    variants.forEach((variant) => {
      expect(classes.variant(variant)).toBe(`mzn-typography--${variant}`);
    });
  });

  it('prop:align', () => {
    expect(classes.align).toBe('mzn-css--text-align');
  });

  it('prop:color', () => {
    expect(classes.color).toBe('mzn-css--color');
  });

  it('prop:display', () => {
    expect(classes.display).toBe('mzn-css--display');
  });

  it('prop:ellipsis', () => {
    expect(classes.ellipsis).toBe('mzn-typography--ellipsis');
  });

  it('prop:noWrap', () => {
    expect(classes.noWrap).toBe('mzn-typography--nowrap');
  });
});
