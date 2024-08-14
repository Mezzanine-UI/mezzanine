import { uniqueArray, toggleValue, toggleValueWithStatusControl } from '.';

describe('uniqueArray()', () => {
  it('should get unique values in the array', () => {
    const testValues = 3;
    const targetArray = [1, 2, testValues, testValues];

    const resultArray = uniqueArray(targetArray);

    expect(resultArray.every((v, i) => resultArray.indexOf(v) === i)).toBe(
      true,
    );
  });
});

describe('toggleValue()', () => {
  it('values should be toggled in the array', () => {
    const pool = [1, 2, 3, 4];
    const values = [3, 4];

    const removedArray = toggleValue(values, pool);

    values.forEach((value) => {
      expect(removedArray).not.toContain(value);
    });

    const appendedArray = toggleValue(values, removedArray);

    values.forEach((value) => {
      expect(appendedArray).toContain(value);
    });
  });

  it('single value should be toggled in the array', () => {
    const pool = [1, 2, 3, 4];
    const value = 1;

    const removedArray = toggleValue(value, pool);

    expect(removedArray).not.toContain(value);

    const appendedArray = toggleValue(value, removedArray);

    expect(appendedArray).toContain(value);
  });
});

describe('toggleValueWithStatusControl()', () => {
  it('should append values when existed set to false', () => {
    const pool = [1, 2];
    const values = [3, 4];

    const appendedArray = toggleValueWithStatusControl(false, values, pool);

    values.forEach((value) => {
      expect(appendedArray).toContain(value);
    });
  });

  it('should remove values when existed set to false', () => {
    const pool = [1, 2, 3, 4];
    const values = [3, 4];

    const removedArray = toggleValueWithStatusControl(true, values, pool);

    values.forEach((value) => {
      expect(removedArray).not.toContain(value);
    });
  });

  it('should append single value when existed set to false', () => {
    const pool = [1, 2];
    const value = 3;

    const appendedArray = toggleValueWithStatusControl(false, value, pool);

    expect(appendedArray).toContain(value);
  });

  it('should remove single value when existed set to false', () => {
    const pool = [1, 2, 3, 4];
    const value = 3;

    const removedArray = toggleValueWithStatusControl(true, value, pool);

    expect(removedArray).not.toContain(value);
  });
});
