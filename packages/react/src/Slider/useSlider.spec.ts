import React from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
  fireEvent,
} from '../../__test-utils__';
import {
  useSlider,
  UseSingleSliderProps,
  UseRangeSliderProps,
  UseSliderResult,
  RangeSliderValue,
} from '.';

describe('useSlider()', () => {
  beforeEach(() => {
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      clientX: 50,
      clientY: 50,
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      bottom: 50,
      left: 50,
      right: 50,
      top: 50,
      toJSON: () => {},
    } as DOMRect);
  });
  afterEach(() => {
    cleanup();
    cleanupHook();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('should not get the handler for track and rail if onChange is not provided', () => {
    const { result } = renderHook(useSlider, {
      initialProps: {
        max: 100,
        min: 0,
        step: 1,
        value: 0,
      } as unknown as UseSingleSliderProps,
    });

    expect(result.current.handleClickTrackOrRail).toBe(undefined);
  });

  describe('case: single', () => {
    it('should get handlers for the handle and be able to change value via handlers', () => {
      const railElement = document.createElement('div');

      document.body.appendChild(railElement);

      jest.spyOn(React, 'useRef').mockReturnValue({
        current: railElement,
      });

      const onChange = jest.fn();
      const { result } = renderHook(useSlider, {
        initialProps: {
          max: 100,
          min: 0,
          step: 1,
          value: 0,
          onChange,
        } as unknown as UseSingleSliderProps,
      });

      expect(result.current.handlePress).toBeInstanceOf(Function);

      TestRenderer.act(() => {
        result.current.handlePress!({ preventDefault: jest.fn() });
      });

      TestRenderer.act(() => {
        fireEvent.mouseMove(railElement, { clientX: 50 });
      });

      expect(onChange).toBeCalledTimes(1);
      onChange.mockClear();

      TestRenderer.act(() => {
        result.current.handleClickTrackOrRail!({ preventDefault: jest.fn() });
      });

      expect(onChange).toBeCalledTimes(1);
    });

    it('should not invoke onChange if railRef is not binding to HTMLElement', () => {
      const onChange = jest.fn();
      const { result } = renderHook(useSlider, {
        initialProps: {
          max: 100,
          min: 0,
          step: 1,
          value: 0,
          onChange,
        } as unknown as UseSingleSliderProps,
      });

      expect(result.current.handlePress).toBeInstanceOf(Function);

      TestRenderer.act(() => {
        result.current.handlePress!({ preventDefault: jest.fn() });
      });

      TestRenderer.act(() => {
        fireEvent.mouseMove(document.body, { clientX: 50 });
      });

      expect(onChange).toBeCalledTimes(0);

      TestRenderer.act(() => {
        result.current.handleClickTrackOrRail!({ preventDefault: jest.fn() });
      });

      expect(onChange).toBeCalledTimes(0);
    });
  });

  describe('case: range', () => {
    it('should get handlers for the handle and be able to change value via handlers', () => {
      const railElement = document.createElement('div');

      document.body.appendChild(railElement);

      jest.spyOn(React, 'useRef').mockReturnValue({
        current: railElement,
      });

      const onChange = jest.fn();
      const { result } = renderHook<UseRangeSliderProps, UseSliderResult>(useSlider, {
        initialProps: {
          max: 100,
          min: 0,
          step: 1,
          value: [0, 100] as RangeSliderValue,
          onChange,
        } as unknown as UseRangeSliderProps,
      });

      expect(result.current.handlePress).toBeInstanceOf(Function);

      TestRenderer.act(() => {
        result.current.handlePress!({ preventDefault: jest.fn() });
      });

      TestRenderer.act(() => {
        fireEvent.mouseMove(railElement, { clientX: 50 });
      });

      expect(onChange).toBeCalledTimes(1);
      onChange.mockClear();

      TestRenderer.act(() => {
        result.current.handleClickTrackOrRail!({ preventDefault: jest.fn() });
      });

      expect(onChange).toBeCalledTimes(1);
    });

    it('should not invoke onChange if railRef is not binding to HTMLElement', () => {
      const onChange = jest.fn();
      const { result } = renderHook<UseRangeSliderProps, UseSliderResult>(useSlider, {
        initialProps: {
          max: 100,
          min: 0,
          step: 1,
          value: [0, 100] as RangeSliderValue,
          onChange,
        } as unknown as UseRangeSliderProps,
      });

      expect(result.current.handlePress).toBeInstanceOf(Function);

      TestRenderer.act(() => {
        result.current.handlePress!({ preventDefault: jest.fn() });
      });

      TestRenderer.act(() => {
        fireEvent.mouseMove(document.body, { clientX: 50 });
      });

      expect(onChange).toBeCalledTimes(0);

      TestRenderer.act(() => {
        result.current.handleClickTrackOrRail!({ preventDefault: jest.fn() });
      });

      expect(onChange).toBeCalledTimes(0);
    });
  });
});
