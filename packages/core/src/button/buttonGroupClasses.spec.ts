import { ButtonGroupOrientation } from './typings';
import { buttonGroupClasses as classes } from './buttonGroupClasses';

describe('button:buttonGroupClasses', () => {
  it('prop:host', () => {
    expect(classes.host).toBe('mzn-button-group');
  });

  it('prop:fullWidth', () => {
    expect(classes.fullWidth).toBe('mzn-button-group--full-width');
  });

  it('prop:orientation', () => {
    const orientations: ButtonGroupOrientation[] = [
      'horizontal',
      'vertical',
    ];

    orientations.forEach((orientation) => {
      expect(classes.orientation(orientation)).toBe(`mzn-button-group--${orientation}`);
    });
  });

  it('prop:attached', () => {
    expect(classes.attached).toBe('mzn-button-group--attached');
  });
});
