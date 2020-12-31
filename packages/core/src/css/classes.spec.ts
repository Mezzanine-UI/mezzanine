import { classes } from './classes';

describe('css:classes', () => {
  it('prop:prop', () => {
    expect(classes.prop('foo')).toBe('mzn-css--foo');
  });
});
