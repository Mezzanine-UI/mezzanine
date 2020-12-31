import { classes } from './classes';

describe('icon:classes', () => {
  it('prop:host', () => {
    expect(classes.host).toBe('mzn-icon');
  });

  it('prop:color', () => {
    expect(classes.color).toBe('mzn-css--color');
  });

  it('prop:spin', () => {
    expect(classes.spin).toBe('mzn-icon--spin');
  });
});
