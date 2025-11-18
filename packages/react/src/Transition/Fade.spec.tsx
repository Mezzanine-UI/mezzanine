import { act, waitFor } from '@testing-library/react';
import { cleanup, render } from '../../__test-utils__';
import Fade from './Fade';

describe('<Fade />', () => {
  afterEach(cleanup);

  it('should render children when in is true', async () => {
    const { getHostHTMLElement } = render(
      <Fade in>
        <div data-testid="fade-content">Content</div>
      </Fade>,
    );

    await waitFor(() => {
      const element = getHostHTMLElement();

      expect(element.textContent).toBe('Content');
      expect(element.style.opacity).toBe('1');
    });
  });

  it('should support custom duration', () => {
    const customDuration = { enter: 300, exit: 200 };

    const { rerender } = render(
      <Fade duration={customDuration} in>
        <div>Content</div>
      </Fade>,
    );

    expect(() =>
      rerender(
        <Fade duration={customDuration} in={false}>
          <div>Content</div>
        </Fade>,
      ),
    ).not.toThrow();
  });

  it('should support custom easing', () => {
    const customEasing = {
      enter: 'cubic-bezier(0, 0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
    };

    const { rerender } = render(
      <Fade easing={customEasing} in>
        <div>Content</div>
      </Fade>,
    );

    expect(() =>
      rerender(
        <Fade easing={customEasing} in={false}>
          <div>Content</div>
        </Fade>,
      ),
    ).not.toThrow();
  });

  it('should call lifecycle callbacks', () => {
    const onEnter = jest.fn();
    const onEntered = jest.fn();
    const onExit = jest.fn();
    const onExited = jest.fn();

    const { rerender } = render(
      <Fade
        in
        onEnter={onEnter}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
      >
        <div>Content</div>
      </Fade>,
    );

    expect(onEnter).toHaveBeenCalled();

    act(() => {
      rerender(
        <Fade
          in={false}
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
        >
          <div>Content</div>
        </Fade>,
      );
    });

    expect(onExit).toHaveBeenCalled();
  });

  it('should support delay prop', () => {
    const { rerender } = render(
      <Fade delay={100} in>
        <div>Content</div>
      </Fade>,
    );

    expect(() =>
      rerender(
        <Fade delay={100} in={false}>
          <div>Content</div>
        </Fade>,
      ),
    ).not.toThrow();
  });
});
