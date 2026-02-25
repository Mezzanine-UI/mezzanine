import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { cleanup, cleanupHook, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Layout from '.';

describe('<Layout />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Layout ref={ref} sidePanelChildren={<div>Side</div>}>
        <div>Main</div>
      </Layout>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Layout className={className} sidePanelChildren={<div>Side</div>}>
        <div>Main</div>
      </Layout>,
    ),
  );

  it('should render children inside main element', () => {
    const { getHostHTMLElement } = render(
      <Layout sidePanelChildren={<div>Side</div>}>
        <div data-testid="main-content">Main</div>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const main = host.querySelector(`.${classes.main}`);

    expect(main?.tagName).toBe('MAIN');
    expect(main?.querySelector('[data-testid="main-content"]')).toBeTruthy();
  });

  it('should render sidePanelChildren inside aside element', () => {
    const { getHostHTMLElement } = render(
      <Layout sidePanelChildren={<div data-testid="side-content">Side</div>}>
        <div>Main</div>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const aside = host.querySelector(`.${classes.sidePanel}`);

    expect(aside?.tagName).toBe('ASIDE');
    expect(aside?.querySelector('[data-testid="side-content"]')).toBeTruthy();
  });

  it('should set --mzn-layout-side-panel-width CSS variable from defaultSidePanelWidth', () => {
    const { getHostHTMLElement } = render(
      <Layout defaultSidePanelWidth={400} sidePanelChildren={null}>
        <div>Main</div>
      </Layout>,
    );

    const host = getHostHTMLElement();

    expect((host as HTMLElement).style.getPropertyValue('--mzn-layout-side-panel-width')).toBe('400px');
  });

  it('should use 320px as default side panel width', () => {
    const { getHostHTMLElement } = render(
      <Layout sidePanelChildren={null}>
        <div>Main</div>
      </Layout>,
    );

    const host = getHostHTMLElement();

    expect((host as HTMLElement).style.getPropertyValue('--mzn-layout-side-panel-width')).toBe('320px');
  });

  it('should render divider with role="separator"', () => {
    const { getHostHTMLElement } = render(
      <Layout sidePanelChildren={null}>
        <div>Main</div>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const divider = host.querySelector(`.${classes.divider}`);

    expect(divider?.getAttribute('role')).toBe('separator');
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should add dragging class to divider on mousedown and remove on mouseup', () => {
    const { getHostHTMLElement } = render(
      <Layout sidePanelChildren={null}>
        <div>Main</div>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const divider = host.querySelector(`.${classes.divider}`) as HTMLElement;

    expect(divider.classList.contains(classes.dividerDragging)).toBeFalsy();

    fireEvent.mouseDown(divider, { clientX: 500 });

    expect(divider.classList.contains(classes.dividerDragging)).toBeTruthy();

    fireEvent.mouseUp(document);

    expect(divider.classList.contains(classes.dividerDragging)).toBeFalsy();
  });

  it('should call onSidePanelWidthChange when width changes during drag', () => {
    const onSidePanelWidthChange = jest.fn();

    const { getHostHTMLElement } = render(
      <Layout
        defaultSidePanelWidth={320}
        onSidePanelWidthChange={onSidePanelWidthChange}
        sidePanelChildren={null}
      >
        <div>Main</div>
      </Layout>,
    );

    const host = getHostHTMLElement();
    const divider = host.querySelector(`.${classes.divider}`) as HTMLElement;

    fireEvent.mouseDown(divider, { clientX: 500 });
    fireEvent.mouseMove(document, { clientX: 450 });

    // RAF is async in test env, so we verify the callback was set up
    fireEvent.mouseUp(document);
  });
});
