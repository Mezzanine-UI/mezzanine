import { classes } from './classes';

describe('spacing:classes', () => {
  it('prop:level', () => {
    expect(classes.level(1)).toBe('mzn-spacing--1');
    expect(classes.level(2)).toBe('mzn-spacing--2');
    expect(classes.level(3)).toBe('mzn-spacing--3');
    expect(classes.level(4)).toBe('mzn-spacing--4');
    expect(classes.level(5)).toBe('mzn-spacing--5');
  });
});
