import { act, waitFor } from '@testing-library/react';
import { cleanup, render } from '../../__test-utils__';
import Translate from './Translate';

describe('<Translate />', () => {
  afterEach(cleanup);

  it('should render children when in is true', async () => {
    const { getHostHTMLElement } = render(
      <Translate in>
        <div data-testid="translate-content">Content</div>
      </Translate>,
    );

    await waitFor(() => {
      const element = getHostHTMLElement();

      expect(element.textContent).toBe('Content');
      expect(element.style.transform).toBe('translate3d(0, 0, 0)');
    });
  });

  it('should support from prop with different directions', () => {
    const directions: Array<'top' | 'bottom' | 'left' | 'right'> = [
      'top',
      'bottom',
      'left',
      'right',
    ];

    directions.forEach((direction) => {
      expect(() =>
        render(
          <Translate from={direction} in>
            <div>Content</div>
          </Translate>,
        ),
      ).not.toThrow();
    });
  });

  it('should support custom duration', () => {
    const customDuration = { enter: 400, exit: 300 };

    expect(() =>
      render(
        <Translate duration={customDuration} in>
          <div>Content</div>
        </Translate>,
      ),
    ).not.toThrow();
  });

  it('should support custom easing', () => {
    const customEasing = {
      enter: 'cubic-bezier(0, 0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
    };

    expect(() =>
      render(
        <Translate easing={customEasing} in>
          <div>Content</div>
        </Translate>,
      ),
    ).not.toThrow();
  });

  it('should support auto duration', () => {
    expect(() =>
      render(
        <Translate duration="auto" in>
          <div>Content</div>
        </Translate>,
      ),
    ).not.toThrow();
  });

  it('should call lifecycle callbacks', () => {
    const onEnter = jest.fn();
    const onEntered = jest.fn();
    const onExit = jest.fn();
    const onExited = jest.fn();

    const { rerender } = render(
      <Translate
        in
        onEnter={onEnter}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
      >
        <div>Content</div>
      </Translate>,
    );

    expect(onEnter).toHaveBeenCalled();

    act(() => {
      rerender(
        <Translate
          in={false}
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
        >
          <div>Content</div>
        </Translate>,
      );
    });

    expect(onExit).toHaveBeenCalled();
  });

  it('should support delay prop', () => {
    expect(() =>
      render(
        <Translate delay={100} in>
          <div>Content</div>
        </Translate>,
      ),
    ).not.toThrow();
  });
});
