import { arrayMove } from './array-move';

describe('arrayMove', () => {
  it('should move an element forward', () => {
    expect(arrayMove([1, 2, 3, 4], 0, 2)).toEqual([2, 3, 1, 4]);
  });

  it('should move an element backward', () => {
    expect(arrayMove([1, 2, 3, 4], 2, 0)).toEqual([3, 1, 2, 4]);
  });

  it('should not mutate the original array', () => {
    const original = [1, 2, 3, 4];
    const result = arrayMove(original, 0, 2);

    expect(original).toEqual([1, 2, 3, 4]);
    expect(result).not.toBe(original);
  });

  it('should handle moving to the same position', () => {
    expect(arrayMove([1, 2, 3], 1, 1)).toEqual([1, 2, 3]);
  });

  it('should handle moving to a position beyond array length', () => {
    const result = arrayMove([1, 2, 3], 0, 5);

    expect(result).toContain(1);
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it('should work with string arrays', () => {
    expect(arrayMove(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  });
});
