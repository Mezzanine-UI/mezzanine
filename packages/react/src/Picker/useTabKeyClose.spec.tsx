import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { useTabKeyClose } from '.';

describe('useTabKeyClose', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should invoke onClose when active element is last-element-in-flow', () => {
    const onClose = jest.fn();
    const inputElement = document.createElement('input');

    document.body.appendChild(inputElement);

    const inputRef = {
      current: inputElement,
    };

    renderHook(() => useTabKeyClose(onClose, inputRef));

    inputElement.focus();

    TestRenderer.act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
        }),
      );
    });

    expect(onClose).toBeCalledTimes(1);
  });

  it('should not invoke onClose when active element is not last-element-in-flow', () => {
    const onClose = jest.fn();
    const inputElement = document.createElement('input');

    document.body.appendChild(inputElement);

    const inputRef = {
      current: inputElement,
    };

    renderHook(() => useTabKeyClose(onClose, inputRef));

    TestRenderer.act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
        }),
      );
    });

    expect(onClose).toBeCalledTimes(0);
  });
});
