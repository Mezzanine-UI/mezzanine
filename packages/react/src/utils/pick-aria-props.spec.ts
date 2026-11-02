import { pickAriaProps, splitAriaProps } from './pick-aria-props';

describe('pickAriaProps', () => {
  it('should pick aria-* attributes and role', () => {
    expect(
      pickAriaProps({
        'aria-expanded': false,
        'aria-label': 'Email',
        className: 'foo',
        id: 'bar',
        role: 'combobox',
      }),
    ).toEqual({
      'aria-expanded': false,
      'aria-label': 'Email',
      role: 'combobox',
    });
  });

  it('should skip undefined values', () => {
    expect(pickAriaProps({ 'aria-label': undefined })).toEqual({});
  });

  it('should not mutate the source', () => {
    const source = { 'aria-label': 'Email', className: 'foo' };

    pickAriaProps(source);

    expect(source).toEqual({ 'aria-label': 'Email', className: 'foo' });
  });
});

describe('splitAriaProps', () => {
  it('should split aria-* / role from the remaining props', () => {
    const [aria, remaining] = splitAriaProps({
      'aria-controls': 'list',
      'aria-label': undefined,
      className: 'foo',
      role: 'combobox',
    });

    expect(aria).toEqual({ 'aria-controls': 'list', role: 'combobox' });
    expect(remaining).toEqual({ className: 'foo' });
  });
});
