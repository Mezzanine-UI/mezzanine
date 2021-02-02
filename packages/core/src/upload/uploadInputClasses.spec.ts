import { uploadInputClasses as classes } from './uploadInputClasses';

describe('upload:uploadInputClasses', () => {
  it('prop:host', () => {
    expect(classes.host).toBe('mzn-upload-input');
  });
});
