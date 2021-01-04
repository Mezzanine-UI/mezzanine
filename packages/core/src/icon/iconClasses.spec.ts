import { iconClasses as classes } from './iconClasses';

describe('icon:iconClasses', () => {
  it('prop:host', () => {
    expect(classes.host).toBe('mzn-icon');
  });

  it('prop:color', () => {
    expect(classes.color).toBe('mzn-icon--color');
  });

  it('prop:spin', () => {
    expect(classes.spin).toBe('mzn-icon--spin');
  });
});
