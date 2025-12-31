import { createDropdownKeydownHandler } from './dropdownKeydownHandler';
import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';

describe('createDropdownKeydownHandler', () => {
  const mockOptions: DropdownOption[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ];

  const createMockEvent = (key: string): React.KeyboardEvent<HTMLInputElement> => {
    return {
      key,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
  };

  describe('ArrowDown', () => {
    it('should open dropdown and set activeIndex to 0 when closed', () => {
      const setOpen = jest.fn();
      const setActiveIndex = jest.fn();
      const setListboxHasVisualFocus = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: null,
        open: false,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus,
        setOpen,
      });

      const event = createMockEvent('ArrowDown');
      handler(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(setOpen).toHaveBeenCalledWith(true);
      expect(setListboxHasVisualFocus).toHaveBeenCalledWith(true);
      expect(setActiveIndex).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should move to next option when open', () => {
      const setActiveIndex = jest.fn((updater) => {
        const result = updater(0);
        expect(result).toBe(1);
      });
      const handler = createDropdownKeydownHandler({
        activeIndex: 0,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('ArrowDown');
      handler(event);

      expect(setActiveIndex).toHaveBeenCalled();
    });

    it('should wrap to first option when at last option', () => {
      const setActiveIndex = jest.fn((updater) => {
        const result = updater(2);
        expect(result).toBe(0);
      });
      const handler = createDropdownKeydownHandler({
        activeIndex: 2,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('ArrowDown');
      handler(event);

      expect(setActiveIndex).toHaveBeenCalled();
    });

    it('should set to 0 when activeIndex is null', () => {
      const setActiveIndex = jest.fn((updater) => {
        const result = updater(null);
        expect(result).toBe(0);
      });
      const handler = createDropdownKeydownHandler({
        activeIndex: null,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('ArrowDown');
      handler(event);

      expect(setActiveIndex).toHaveBeenCalled();
    });
  });

  describe('ArrowUp', () => {
    it('should open dropdown and set activeIndex to last when closed', () => {
      const setOpen = jest.fn();
      const setActiveIndex = jest.fn();
      const setListboxHasVisualFocus = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: null,
        open: false,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus,
        setOpen,
      });

      const event = createMockEvent('ArrowUp');
      handler(event);

      expect(setOpen).toHaveBeenCalledWith(true);
      expect(setListboxHasVisualFocus).toHaveBeenCalledWith(true);
      expect(setActiveIndex).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should move to previous option when open', () => {
      const setActiveIndex = jest.fn((updater) => {
        const result = updater(1);
        expect(result).toBe(0);
      });
      const handler = createDropdownKeydownHandler({
        activeIndex: 1,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('ArrowUp');
      handler(event);

      expect(setActiveIndex).toHaveBeenCalled();
    });

    it('should wrap to last option when at first option', () => {
      const setActiveIndex = jest.fn((updater) => {
        const result = updater(0);
        expect(result).toBe(2);
      });
      const handler = createDropdownKeydownHandler({
        activeIndex: 0,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('ArrowUp');
      handler(event);

      expect(setActiveIndex).toHaveBeenCalled();
    });
  });

  describe('Enter', () => {
    it('should call onEnterSelect when open and activeIndex is set', () => {
      const onEnterSelect = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: 1,
        open: true,
        options: mockOptions,
        onEnterSelect,
        setActiveIndex: jest.fn(),
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('Enter');
      handler(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(onEnterSelect).toHaveBeenCalledWith(mockOptions[1]);
    });

    it('should not call onEnterSelect when closed', () => {
      const onEnterSelect = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: 1,
        open: false,
        options: mockOptions,
        onEnterSelect,
        setActiveIndex: jest.fn(),
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('Enter');
      handler(event);

      expect(onEnterSelect).not.toHaveBeenCalled();
    });

    it('should not call onEnterSelect when activeIndex is null', () => {
      const onEnterSelect = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: null,
        open: true,
        options: mockOptions,
        onEnterSelect,
        setActiveIndex: jest.fn(),
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('Enter');
      handler(event);

      expect(onEnterSelect).not.toHaveBeenCalled();
    });
  });

  describe('Escape', () => {
    it('should call onEscape', () => {
      const onEscape = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: null,
        open: true,
        options: mockOptions,
        onEscape,
        setActiveIndex: jest.fn(),
        setListboxHasVisualFocus: jest.fn(),
        setOpen: jest.fn(),
      });

      const event = createMockEvent('Escape');
      handler(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(onEscape).toHaveBeenCalled();
    });
  });

  describe('Home, End, ArrowLeft, ArrowRight', () => {
    it('should reset visual focus and activeIndex for Home', () => {
      const setListboxHasVisualFocus = jest.fn();
      const setActiveIndex = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: 1,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus,
        setOpen: jest.fn(),
      });

      const event = createMockEvent('Home');
      handler(event);

      expect(setListboxHasVisualFocus).toHaveBeenCalledWith(false);
      expect(setActiveIndex).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should reset visual focus and activeIndex for End', () => {
      const setListboxHasVisualFocus = jest.fn();
      const setActiveIndex = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: 1,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus,
        setOpen: jest.fn(),
      });

      const event = createMockEvent('End');
      handler(event);

      expect(setListboxHasVisualFocus).toHaveBeenCalledWith(false);
      expect(setActiveIndex).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should reset visual focus and activeIndex for ArrowLeft', () => {
      const setListboxHasVisualFocus = jest.fn();
      const setActiveIndex = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: 1,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus,
        setOpen: jest.fn(),
      });

      const event = createMockEvent('ArrowLeft');
      handler(event);

      expect(setListboxHasVisualFocus).toHaveBeenCalledWith(false);
      expect(setActiveIndex).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should reset visual focus and activeIndex for ArrowRight', () => {
      const setListboxHasVisualFocus = jest.fn();
      const setActiveIndex = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: 1,
        open: true,
        options: mockOptions,
        setActiveIndex,
        setListboxHasVisualFocus,
        setOpen: jest.fn(),
      });

      const event = createMockEvent('ArrowRight');
      handler(event);

      expect(setListboxHasVisualFocus).toHaveBeenCalledWith(false);
      expect(setActiveIndex).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('empty options', () => {
    it('should return early when options array is empty', () => {
      const setOpen = jest.fn();
      const handler = createDropdownKeydownHandler({
        activeIndex: null,
        open: false,
        options: [],
        setActiveIndex: jest.fn(),
        setListboxHasVisualFocus: jest.fn(),
        setOpen,
      });

      const event = createMockEvent('ArrowDown');
      handler(event);

      expect(setOpen).not.toHaveBeenCalled();
    });
  });
});

