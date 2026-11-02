import { splitAriaAttrs } from './split-aria-attrs';

describe('splitAriaAttrs', () => {
  it('should split aria-* / role from the remaining attrs', () => {
    const source = {
      'aria-controls': 'list',
      'aria-label': undefined,
      'data-x': '1',
      role: 'combobox',
    };
    const [aria, remaining] = splitAriaAttrs(source);

    expect(aria).toEqual({ 'aria-controls': 'list', role: 'combobox' });
    expect(remaining).toEqual({ 'data-x': '1' });
    expect(source).toHaveProperty('aria-label');
  });
});
