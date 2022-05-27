import { calcTakeCount } from './useSelectTriggerTags';

describe('calcTakeCount', () => {
  it('total width of tags is not longer than max width case', () => {
    const setTakeCount = jest.fn();

    calcTakeCount({
      tagsWidths: [20, 30],
      maxWidth: 200,
      ellipsisTagWidth: 60,
      setTakeCount,
    });

    expect(setTakeCount).toBeCalledWith(2);
  });

  describe('total width of tags is longer than max width case', () => {
    it('general case', () => {
      const setTakeCount = jest.fn();

      calcTakeCount({
        tagsWidths: [20, 30, 180],
        maxWidth: 200,
        ellipsisTagWidth: 60,
        setTakeCount,
      });

      expect(setTakeCount).toBeCalledWith(2);
    });

    it('total width of tags + width of ellipsis tag is longer than max width case', () => {
      const setTakeCount = jest.fn();

      calcTakeCount({
        tagsWidths: [20, 150, 180],
        maxWidth: 200,
        ellipsisTagWidth: 60,
        setTakeCount,
      });

      expect(setTakeCount).toBeCalledWith(1);
    });

    it('large options case', async () => {
      const setTakeCount = jest.fn();

      const largeOptions = Array.from(Array(110)).map(() => 150);

      calcTakeCount({
        tagsWidths: largeOptions,
        maxWidth: 200,
        ellipsisTagWidth: 60,
        setTakeCount,
      });

      expect(setTakeCount).toBeCalledWith(0);
    });
  });
});
