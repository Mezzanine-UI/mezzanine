import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import {
  act,
  cleanup,
  cleanupHook,
  fireEvent,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Navigation from '../Navigation';
import Layout, { LayoutLeftPanel, LayoutMain, LayoutRightPanel } from '.';

const MIN_PANEL_WIDTH = 240;

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0);

    return 0;
  });
});

afterEach(() => {
  cleanup();
  cleanupHook();
  jest.restoreAllMocks();
});

describe('<Layout />', () => {
  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Layout ref={ref}>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Layout className={className}>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    ),
  );

  it('should render Navigation as the navigation node', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <Navigation />
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    );

    expect(getHostHTMLElement().querySelector('.mzn-navigation')).toBeTruthy();
  });

  it('should render LayoutMain children inside a div with the main class', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div data-testid="main-content">Main</div>
        </LayoutMain>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const main = host.querySelector(`.${classes.main}`);

    expect(main?.tagName).toBe('DIV');
    expect(main?.querySelector('[data-testid="main-content"]')).toBeTruthy();
  });

  it('should render children in order: nav → left panel → main → right panel', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutRightPanel defaultWidth={320} open>
          <div>Right</div>
        </LayoutRightPanel>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <Navigation />
        <LayoutLeftPanel defaultWidth={320} open>
          <div>Left</div>
        </LayoutLeftPanel>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const hostChildren = Array.from(host.children);

    // Navigation wrapper precedes the content wrapper at the host level
    const navWrapperIndex = hostChildren.findIndex((el) =>
      el.classList.contains(classes.navigation),
    );
    const contentWrapperIndex = hostChildren.findIndex((el) =>
      el.classList.contains(classes.contentWrapper),
    );

    expect(navWrapperIndex).toBeLessThan(contentWrapperIndex);

    // Left panel, main, right panel are ordered correctly inside the content wrapper
    const contentWrapper = host.querySelector(
      `.${classes.contentWrapper}`,
    ) as HTMLElement;
    const wrapperChildren = Array.from(contentWrapper.children);
    const leftIndex = wrapperChildren.findIndex((el) =>
      el.classList.contains(classes.sidePanelLeft),
    );
    const mainIndex = wrapperChildren.findIndex((el) =>
      el.classList.contains(classes.main),
    );
    const rightIndex = wrapperChildren.findIndex((el) =>
      el.classList.contains(classes.sidePanelRight),
    );

    expect(leftIndex).toBeLessThan(mainIndex);
    expect(mainIndex).toBeLessThan(rightIndex);
  });
});

describe('<Layout.RightPanel />', () => {
  it('should not render when open is false', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel open={false}>
          <div>Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    expect(
      getHostHTMLElement().querySelector(`.${classes.sidePanel}`),
    ).toBeNull();
  });

  it('should render aside with correct classes when open is true', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel open>
          <div data-testid="right-content">Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const aside = host.querySelector('aside');

    expect(aside).toBeTruthy();
    expect(aside?.classList.contains(classes.sidePanel)).toBeTruthy();
    expect(aside?.classList.contains(classes.sidePanelRight)).toBeTruthy();
    expect(aside?.querySelector('[data-testid="right-content"]')).toBeTruthy();
  });

  it('should render children inside the side-panel-content div', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel open>
          <div data-testid="right-content">Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    const content = getHostHTMLElement().querySelector(
      `.${classes.sidePanelContent}`,
    );

    expect(content).toBeTruthy();
    expect(
      content?.querySelector('[data-testid="right-content"]'),
    ).toBeTruthy();
  });

  it('should render divider with correct ARIA attributes', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel defaultWidth={320} open>
          <div>Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    const divider = getHostHTMLElement().querySelector(
      `.${classes.divider}`,
    ) as HTMLElement;

    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('vertical');
    expect(divider.getAttribute('aria-valuenow')).toBe('320');
    expect(divider.getAttribute('aria-valuemin')).toBe(`${MIN_PANEL_WIDTH}`);
    expect(divider.getAttribute('tabindex')).toBe('0');
  });

  it('should place divider before content in DOM (left edge)', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel open>
          <div>Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    const aside = getHostHTMLElement().querySelector('aside') as HTMLElement;
    const children = Array.from(aside.children);
    const dividerIndex = children.findIndex((el) =>
      el.classList.contains(classes.divider),
    );
    const contentIndex = children.findIndex((el) =>
      el.classList.contains(classes.sidePanelContent),
    );

    expect(dividerIndex).toBeLessThan(contentIndex);
  });

  it('should add dragging class on mousedown and remove on mouseup', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel open>
          <div>Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    const divider = getHostHTMLElement().querySelector(
      `.${classes.divider}`,
    ) as HTMLElement;

    expect(divider.classList.contains(classes.dividerDragging)).toBeFalsy();

    fireEvent.mouseDown(divider, { clientX: 500 });

    expect(divider.classList.contains(classes.dividerDragging)).toBeTruthy();

    fireEvent.mouseUp(document);

    expect(divider.classList.contains(classes.dividerDragging)).toBeFalsy();
  });

  it('should expand panel and call onWidthChange when dragging left', () => {
    const onWidthChange = jest.fn();

    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel defaultWidth={320} onWidthChange={onWidthChange} open>
          <div>Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    const divider = getHostHTMLElement().querySelector(
      `.${classes.divider}`,
    ) as HTMLElement;

    act(() => {
      fireEvent.mouseDown(divider, { clientX: 500 });
    });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 450 });
    });

    expect(onWidthChange).toHaveBeenCalledWith(370);

    act(() => {
      fireEvent.mouseUp(document);
    });
  });

  it('should clamp width to MIN_PANEL_WIDTH when dragging past minimum', () => {
    const onWidthChange = jest.fn();

    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel defaultWidth={320} onWidthChange={onWidthChange} open>
          <div>Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    const divider = getHostHTMLElement().querySelector(
      `.${classes.divider}`,
    ) as HTMLElement;

    act(() => {
      fireEvent.mouseDown(divider, { clientX: 500 });
    });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 9999 });
    });

    expect(onWidthChange).toHaveBeenCalledWith(MIN_PANEL_WIDTH);

    act(() => {
      fireEvent.mouseUp(document);
    });
  });

  it('should resize via ArrowLeft (expand) and ArrowRight (shrink) keyboard events', () => {
    const onWidthChange = jest.fn();

    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutRightPanel defaultWidth={320} onWidthChange={onWidthChange} open>
          <div>Right</div>
        </LayoutRightPanel>
      </Layout>,
    );

    const divider = getHostHTMLElement().querySelector(
      `.${classes.divider}`,
    ) as HTMLElement;

    act(() => {
      fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    });

    expect(onWidthChange).toHaveBeenLastCalledWith(330);

    act(() => {
      fireEvent.keyDown(divider, { key: 'ArrowRight' });
    });

    expect(onWidthChange).toHaveBeenLastCalledWith(320);
  });
});

describe('<Layout.LeftPanel />', () => {
  it('should not render when open is false', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutLeftPanel open={false}>
          <div>Left</div>
        </LayoutLeftPanel>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    );

    expect(
      getHostHTMLElement().querySelector(`.${classes.sidePanel}`),
    ).toBeNull();
  });

  it('should render aside with correct classes when open is true', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutLeftPanel open>
          <div data-testid="left-content">Left</div>
        </LayoutLeftPanel>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const aside = host.querySelector('aside');

    expect(aside).toBeTruthy();
    expect(aside?.classList.contains(classes.sidePanel)).toBeTruthy();
    expect(aside?.classList.contains(classes.sidePanelLeft)).toBeTruthy();
    expect(aside?.querySelector('[data-testid="left-content"]')).toBeTruthy();
  });

  it('should place divider after content in DOM (right edge)', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutLeftPanel open>
          <div>Left</div>
        </LayoutLeftPanel>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    );

    const aside = getHostHTMLElement().querySelector('aside') as HTMLElement;
    const children = Array.from(aside.children);
    const contentIndex = children.findIndex((el) =>
      el.classList.contains(classes.sidePanelContent),
    );
    const dividerIndex = children.findIndex((el) =>
      el.classList.contains(classes.divider),
    );

    expect(contentIndex).toBeLessThan(dividerIndex);
  });

  it('should expand panel and call onWidthChange when dragging right', () => {
    const onWidthChange = jest.fn();

    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutLeftPanel defaultWidth={320} onWidthChange={onWidthChange} open>
          <div>Left</div>
        </LayoutLeftPanel>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    );

    const divider = getHostHTMLElement().querySelector(
      `.${classes.divider}`,
    ) as HTMLElement;

    act(() => {
      fireEvent.mouseDown(divider, { clientX: 320 });
    });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 370 });
    });

    expect(onWidthChange).toHaveBeenCalledWith(370);

    act(() => {
      fireEvent.mouseUp(document);
    });
  });

  it('should clamp width to MIN_PANEL_WIDTH when dragging past minimum', () => {
    const onWidthChange = jest.fn();

    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutLeftPanel defaultWidth={320} onWidthChange={onWidthChange} open>
          <div>Left</div>
        </LayoutLeftPanel>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    );

    const divider = getHostHTMLElement().querySelector(
      `.${classes.divider}`,
    ) as HTMLElement;

    act(() => {
      fireEvent.mouseDown(divider, { clientX: 320 });
    });
    act(() => {
      fireEvent.mouseMove(document, { clientX: -9999 });
    });

    expect(onWidthChange).toHaveBeenCalledWith(MIN_PANEL_WIDTH);

    act(() => {
      fireEvent.mouseUp(document);
    });
  });

  it('should resize via ArrowRight (expand) and ArrowLeft (shrink) keyboard events', () => {
    const onWidthChange = jest.fn();

    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutLeftPanel defaultWidth={320} onWidthChange={onWidthChange} open>
          <div>Left</div>
        </LayoutLeftPanel>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
      </Layout>,
    );

    const divider = getHostHTMLElement().querySelector(
      `.${classes.divider}`,
    ) as HTMLElement;

    act(() => {
      fireEvent.keyDown(divider, { key: 'ArrowRight' });
    });

    expect(onWidthChange).toHaveBeenLastCalledWith(330);

    act(() => {
      fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    });

    expect(onWidthChange).toHaveBeenLastCalledWith(320);
  });
});
