import { cleanup, render, waitFor } from '../../__test-utils__';
import { initializePortals, resetPortals } from '../Portal/portalRegistry';
import AlertBannerGroup from './AlertBannerGroup';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
} as any;

describe('<AlertBannerGroup />', () => {
  beforeEach(() => {
    // Clean up any existing portal containers
    document.getElementById('mzn-alert-container')?.remove();
    document.getElementById('mzn-portal-container')?.remove();
    resetPortals();
  });

  afterEach(() => {
    cleanup();
    // Clean up any existing portal containers
    document.getElementById('mzn-alert-container')?.remove();
    document.getElementById('mzn-portal-container')?.remove();
    resetPortals();
  });

  it('should return null when children is not provided', () => {
    const { container } = render(<AlertBannerGroup />);

    expect(container.firstChild).toBeNull();
  });

  it('should return null when children is null', () => {
    const { container } = render(<AlertBannerGroup>{null}</AlertBannerGroup>);

    expect(container.firstChild).toBeNull();
  });

  it('should render children to alert portal container', async () => {
    initializePortals();

    render(
      <AlertBannerGroup>
        <div>Test Content</div>
      </AlertBannerGroup>,
    );

    await waitFor(() => {
      const alertContainers = document.querySelectorAll('#mzn-alert-container');
      const lastContainer = alertContainers[alertContainers.length - 1];
      const content = lastContainer?.querySelector('.mzn-alert-banner-group');

      expect(content).toBeInstanceOf(HTMLElement);
      expect(content?.textContent).toContain('Test Content');
    });
  });

  it('should bind group class to container', async () => {
    initializePortals();

    render(
      <AlertBannerGroup>
        <div>Test Content</div>
      </AlertBannerGroup>,
    );

    await waitFor(() => {
      const alertContainers = document.querySelectorAll('#mzn-alert-container');
      const lastContainer = alertContainers[alertContainers.length - 1];
      const groupElement = lastContainer?.querySelector('.mzn-alert-banner-group');

      expect(groupElement).toBeInstanceOf(HTMLDivElement);
    });
  });

  it('should render multiple children', async () => {
    initializePortals();

    render(
      <AlertBannerGroup>
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </AlertBannerGroup>,
    );

    await waitFor(() => {
      const alertContainers = document.querySelectorAll('#mzn-alert-container');
      const lastContainer = alertContainers[alertContainers.length - 1];
      const group = lastContainer?.querySelector('.mzn-alert-banner-group');

      expect(group).toBeInstanceOf(HTMLElement);
      expect(group?.textContent).toContain('First Child');
      expect(group?.textContent).toContain('Second Child');
      expect(group?.textContent).toContain('Third Child');
    });
  });

  it('should auto-initialize portal system if not initialized', async () => {
    render(
      <AlertBannerGroup>
        <div>Test Content</div>
      </AlertBannerGroup>,
    );

    await waitFor(() => {
      const alertContainers = document.querySelectorAll('#mzn-alert-container');
      const lastContainer = alertContainers[alertContainers.length - 1];
      const content = lastContainer?.querySelector('.mzn-alert-banner-group');

      expect(lastContainer).toBeInstanceOf(Node);
      expect(content).toBeInstanceOf(HTMLElement);
      expect(content?.textContent).toContain('Test Content');
    });
  });
});

