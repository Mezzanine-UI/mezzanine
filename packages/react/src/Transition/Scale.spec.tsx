import { act, waitFor } from '@testing-library/react';
import { cleanup, render } from '../../__test-utils__';
import Scale from './Scale';

describe('<Scale />', () => {
  afterEach(cleanup);

  it('should render children when in is true', async () => {
    const { getHostHTMLElement } = render(
      <Scale in>
        <div data-testid="scale-content">Content</div>
      </Scale>,
    );

    await waitFor(() => {
      const element = getHostHTMLElement();

      expect(element.textContent).toBe('Content');
    });
  });

  it('should support custom duration', () => {
    const customDuration = { enter: 400, exit: 300 };

    expect(() =>
      render(
        <Scale duration={customDuration} in>
          <div>Content</div>
        </Scale>,
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
        <Scale easing={customEasing} in>
          <div>Content</div>
        </Scale>,
      ),
    ).not.toThrow();
  });

  it('should call lifecycle callbacks', () => {
    const onEnter = jest.fn();
    const onEntered = jest.fn();
    const onExit = jest.fn();
    const onExited = jest.fn();

    const { rerender } = render(
      <Scale
        in
        onEnter={onEnter}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
      >
        <div>Content</div>
      </Scale>,
    );

    expect(onEnter).toHaveBeenCalled();

    act(() => {
      rerender(
        <Scale
          in={false}
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
        >
          <div>Content</div>
        </Scale>,
      );
    });

    expect(onExit).toHaveBeenCalled();
  });

  it('should support delay prop', () => {
    expect(() =>
      render(
        <Scale delay={100} in>
          <div>Content</div>
        </Scale>,
      ),
    ).not.toThrow();
  });
});
