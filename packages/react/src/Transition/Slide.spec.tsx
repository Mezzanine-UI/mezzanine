import { act, waitFor } from '@testing-library/react';
import { cleanup, render } from '../../__test-utils__';
import Slide from './Slide';

describe('<Slide />', () => {
  afterEach(cleanup);

  it('should render children when in is true', async () => {
    const { getHostHTMLElement } = render(
      <Slide in>
        <div data-testid="slide-content">Content</div>
      </Slide>,
    );

    await waitFor(() => {
      const element = getHostHTMLElement();

      expect(element.textContent).toBe('Content');
      expect(element.style.transform).toBe('translate3d(0, 0, 0)');
    });
  });

  it('should support custom duration', () => {
    const customDuration = { enter: 400, exit: 300 };

    expect(() =>
      render(
        <Slide duration={customDuration} in>
          <div>Content</div>
        </Slide>,
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
        <Slide easing={customEasing} in>
          <div>Content</div>
        </Slide>,
      ),
    ).not.toThrow();
  });

  it('should call lifecycle callbacks', () => {
    const onEnter = jest.fn();
    const onEntered = jest.fn();
    const onExit = jest.fn();
    const onExited = jest.fn();

    const { rerender } = render(
      <Slide
        in
        onEnter={onEnter}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
      >
        <div>Content</div>
      </Slide>,
    );

    expect(onEnter).toHaveBeenCalled();

    act(() => {
      rerender(
        <Slide
          in={false}
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
        >
          <div>Content</div>
        </Slide>,
      );
    });

    expect(onExit).toHaveBeenCalled();
  });

  it('should support delay prop', () => {
    expect(() =>
      render(
        <Slide delay={100} in>
          <div>Content</div>
        </Slide>,
      ),
    ).not.toThrow();
  });
});
