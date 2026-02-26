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
import Layout, { LayoutMain, LayoutSidePanel } from '.';

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

  it('should render LayoutMain children inside main element', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div data-testid="main-content">Main</div>
        </LayoutMain>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const main = host.querySelector(`.${classes.main}`);

    expect(main?.tagName).toBe('MAIN');
    expect(main?.querySelector('[data-testid="main-content"]')).toBeTruthy();
  });

  it('should not render divider or aside when open is false', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel open={false}>
          <div>Side</div>
        </LayoutSidePanel>
      </Layout>,
    );

    const host = getHostHTMLElement();

    expect(host.querySelector(`.${classes.divider}`)).toBeNull();
    expect(host.querySelector(`.${classes.sidePanel}`)).toBeNull();
  });

  it('should render divider and aside when open is true', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel open>
          <div data-testid="side-content">Side</div>
        </LayoutSidePanel>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const divider = host.querySelector(`.${classes.divider}`);
    const aside = host.querySelector(`.${classes.sidePanel}`);

    expect(divider).toBeTruthy();
    expect(aside?.tagName).toBe('ASIDE');
    expect(aside?.querySelector('[data-testid="side-content"]')).toBeTruthy();
  });

  it('should apply hostOpen class when open is true', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel open>
          <div>Side</div>
        </LayoutSidePanel>
      </Layout>,
    );

    act(() => {});

    expect(
      getHostHTMLElement().classList.contains(classes.hostOpen),
    ).toBeTruthy();
  });

  it('should set --mzn-layout-side-panel-width from defaultSidePanelWidth (clamped to min)', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel defaultSidePanelWidth={400}>
          <div>Side</div>
        </LayoutSidePanel>
      </Layout>,
    );

    expect(
      (getHostHTMLElement() as HTMLElement).style.getPropertyValue(
        '--mzn-layout-side-panel-width',
      ),
    ).toBe('400px');
  });

  it('should clamp defaultSidePanelWidth to MIN_PANEL_WIDTH when below minimum', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel defaultSidePanelWidth={50}>
          <div>Side</div>
        </LayoutSidePanel>
      </Layout>,
    );

    expect(
      (getHostHTMLElement() as HTMLElement).style.getPropertyValue(
        '--mzn-layout-side-panel-width',
      ),
    ).toBe(`${MIN_PANEL_WIDTH}px`);
  });

  it('should render divider with correct ARIA attributes', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel defaultSidePanelWidth={320} open>
          <div>Side</div>
        </LayoutSidePanel>
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

  it('should add dragging class on mousedown and remove on mouseup', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel open>
          <div>Side</div>
        </LayoutSidePanel>
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

  it('should update side panel width and call onSidePanelWidthChange on drag', () => {
    const onSidePanelWidthChange = jest.fn();

    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel
          defaultSidePanelWidth={320}
          onSidePanelWidthChange={onSidePanelWidthChange}
          open
        >
          <div>Side</div>
        </LayoutSidePanel>
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

    expect(onSidePanelWidthChange).toHaveBeenCalledWith(370);
    expect(
      (getHostHTMLElement() as HTMLElement).style.getPropertyValue(
        '--mzn-layout-side-panel-width',
      ),
    ).toBe('370px');

    act(() => {
      fireEvent.mouseUp(document);
    });
  });

  it('should clamp width to MIN_PANEL_WIDTH when dragging past minimum', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel defaultSidePanelWidth={320} open>
          <div>Side</div>
        </LayoutSidePanel>
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

    expect(
      (getHostHTMLElement() as HTMLElement).style.getPropertyValue(
        '--mzn-layout-side-panel-width',
      ),
    ).toBe(`${MIN_PANEL_WIDTH}px`);

    act(() => {
      fireEvent.mouseUp(document);
    });
  });

  it('should resize via ArrowLeft and ArrowRight keyboard events', () => {
    const { getHostHTMLElement } = render(
      <Layout>
        <LayoutMain>
          <div>Main</div>
        </LayoutMain>
        <LayoutSidePanel defaultSidePanelWidth={320} open>
          <div>Side</div>
        </LayoutSidePanel>
      </Layout>,
    );

    const host = getHostHTMLElement() as HTMLElement;
    const divider = host.querySelector(`.${classes.divider}`) as HTMLElement;

    act(() => {
      fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    });

    expect(host.style.getPropertyValue('--mzn-layout-side-panel-width')).toBe(
      '330px',
    );

    act(() => {
      fireEvent.keyDown(divider, { key: 'ArrowRight' });
    });

    expect(host.style.getPropertyValue('--mzn-layout-side-panel-width')).toBe(
      '320px',
    );
  });
});
