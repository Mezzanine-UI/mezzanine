import { useRef } from 'react';
import { cleanup, render, waitFor } from '../../__test-utils__';
import Portal from '.';
import { initializePortals, resetPortals } from './portalRegistry';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
} as any;

const targetElement = <div id="portal-test">hello</div>;

function expectParentNode(
  targetNode?: Element | null,
  parentNode?: Element | null,
) {
  expect(targetNode).toBeInstanceOf(Node);
  expect(parentNode).toBeInstanceOf(Node);
  expect(targetNode?.parentNode === parentNode).toBe(true);
}

function expectTargetNode(targetNode?: Element | null) {
  expect(targetNode).not.toBeNull();
  expect(targetNode).not.toBeUndefined();
  expect(targetNode?.textContent).toBe('hello');
  expect(targetNode?.tagName.toLowerCase()).toBe('div');
}

describe('<Portal />', () => {
  beforeEach(() => {
    // Clean up any existing portal containers
    document.getElementById('mzn-alert-container')?.remove();
    document.getElementById('mzn-portal-container')?.remove();
    // Reset portal registry state
    resetPortals();
  });

  afterEach(cleanup);

  describe('default behavior', () => {
    it('should render children to portal container by default', async () => {
      initializePortals();

      render(
        <Portal>
          <div id="portal-test">hello</div>
        </Portal>,
      );

      await waitFor(() => {
        const portalContainer = document.getElementById('mzn-portal-container');

        expect(portalContainer).toBeInstanceOf(Node);
      });

      const portalContainer = document.getElementById('mzn-portal-container');
      const targetNode = portalContainer?.querySelector('#portal-test');

      expectParentNode(targetNode, portalContainer);
      expectTargetNode(targetNode);
    });

    it('should auto-initialize portal system if not initialized', async () => {
      render(
        <Portal>
          <div id="portal-test">hello</div>
        </Portal>,
      );

      await waitFor(() => {
        const portalContainer = document.getElementById('mzn-portal-container');

        expect(portalContainer).toBeInstanceOf(Node);
      });
    });
  });

  describe('prop: container', () => {
    it('should portal to target container if provided', async () => {
      const { body } = document;
      const containerNode = document.createElement('div');

      containerNode.setAttribute('id', 'container');

      body.appendChild(containerNode);

      render(<Portal container={containerNode}>{targetElement}</Portal>);

      await waitFor(() => {
        const targetNode = containerNode.querySelector('#portal-test');

        expect(targetNode).toBeInstanceOf(Node);
      });

      const targetNode = containerNode.querySelector('#portal-test');

      expectParentNode(targetNode, containerNode);
      expectTargetNode(targetNode);
    });

    it('should portal to target container if a container as ref is provided', async () => {
      const testId = 'ref-container';
      const TestingComponent = () => {
        const containerRef = useRef<HTMLDivElement>(null);

        return (
          <>
            <div id={testId} ref={containerRef} />
            <Portal container={containerRef}>{targetElement}</Portal>
          </>
        );
      };

      render(<TestingComponent />);

      await waitFor(
        () => {
          const containerNode = document.getElementById(testId);
          const targetNode = containerNode?.querySelector('#portal-test');

          expect(targetNode).toBeInstanceOf(Node);
        },
        { timeout: 3000 },
      );

      const containerNode = document.getElementById(testId);
      const targetNode = containerNode?.querySelector('#portal-test');

      expectParentNode(targetNode, containerNode);
      expectTargetNode(targetNode);
    });

    it('should portal to default container if container is given undefined', async () => {
      initializePortals();

      render(<Portal container={undefined}>{targetElement}</Portal>);

      await waitFor(() => {
        const portalContainer = document.getElementById('mzn-portal-container');
        const targetNode = portalContainer?.querySelector('#portal-test');

        expect(targetNode).toBeInstanceOf(Node);
      });

      const portalContainer = document.getElementById('mzn-portal-container');
      const targetNode = portalContainer?.querySelector('#portal-test');

      expectParentNode(targetNode, portalContainer);
      expectTargetNode(targetNode);
    });

    it('should portal to default container if container is given null', async () => {
      initializePortals();

      render(<Portal container={null}>{targetElement}</Portal>);

      await waitFor(() => {
        const portalContainer = document.getElementById('mzn-portal-container');
        const targetNode = portalContainer?.querySelector('#portal-test');

        expect(targetNode).toBeInstanceOf(Node);
      });

      const portalContainer = document.getElementById('mzn-portal-container');
      const targetNode = portalContainer?.querySelector('#portal-test');

      expectParentNode(targetNode, portalContainer);
      expectTargetNode(targetNode);
    });
  });

  describe('prop: layer', () => {
    it('should render to alert container when layer="alert"', async () => {
      initializePortals();

      render(<Portal layer="alert">{targetElement}</Portal>);

      await waitFor(() => {
        const alertContainer = document.getElementById('mzn-alert-container');
        const targetNode = alertContainer?.querySelector('#portal-test');

        expect(targetNode).toBeInstanceOf(Node);
      });

      const alertContainer = document.getElementById('mzn-alert-container');
      const targetNode = alertContainer?.querySelector('#portal-test');

      expect(alertContainer).toBeInstanceOf(Node);
      expectParentNode(targetNode, alertContainer);
      expectTargetNode(targetNode);
    });

    it('should render to default container when layer="default"', async () => {
      initializePortals();

      render(<Portal layer="default">{targetElement}</Portal>);

      await waitFor(() => {
        const portalContainer = document.getElementById('mzn-portal-container');
        const targetNode = portalContainer?.querySelector('#portal-test');

        expect(targetNode).toBeInstanceOf(Node);
      });

      const portalContainer = document.getElementById('mzn-portal-container');
      const targetNode = portalContainer?.querySelector('#portal-test');

      expect(portalContainer).toBeInstanceOf(Node);
      expectParentNode(targetNode, portalContainer);
      expectTargetNode(targetNode);
    });

    it('should use default layer when layer prop is not provided', async () => {
      initializePortals();

      render(<Portal>{targetElement}</Portal>);

      await waitFor(() => {
        const portalContainer = document.getElementById('mzn-portal-container');
        const targetNode = portalContainer?.querySelector('#portal-test');

        expect(targetNode).toBeInstanceOf(Node);
      });

      const portalContainer = document.getElementById('mzn-portal-container');
      const targetNode = portalContainer?.querySelector('#portal-test');

      expect(portalContainer).toBeInstanceOf(Node);
      expectParentNode(targetNode, portalContainer);
      expectTargetNode(targetNode);
    });

    it('should override layer when custom container is provided', async () => {
      initializePortals();

      const { body } = document;
      const customContainer = document.createElement('div');

      customContainer.setAttribute('id', 'custom-container');
      body.appendChild(customContainer);

      render(
        <Portal container={customContainer} layer="alert">
          {targetElement}
        </Portal>,
      );

      await waitFor(() => {
        const targetNode = customContainer.querySelector('#portal-test');

        expect(targetNode).toBeInstanceOf(Node);
      });

      const targetNode = customContainer.querySelector('#portal-test');

      expectParentNode(targetNode, customContainer);
      expectTargetNode(targetNode);

      // Ensure it's not in alert container
      const alertContainer = document.getElementById('mzn-alert-container');
      const targetInAlert = alertContainer?.querySelector('#portal-test');

      expect(targetInAlert).toBeNull();
    });
  });

  describe('prop: disablePortal', () => {
    it('should not portal and return original element if disablePortal=true', () => {
      const { getHostHTMLElement } = render(
        <Portal disablePortal>
          <div data-testid="portal-test">hello</div>
        </Portal>,
      );
      const element = getHostHTMLElement();

      expect(element).toBeInstanceOf(Node);
      expect(element.tagName.toLowerCase()).toBe('div');
      expect(element.textContent).toBe('hello');
    });

    it('should not portal and return original element if disablePortal=true and when a container is provided', () => {
      const { body } = document;
      const containerNode = document.createElement('div');

      containerNode.setAttribute('id', 'container');

      body.appendChild(containerNode);

      const { getHostHTMLElement } = render(
        <Portal container={containerNode} disablePortal>
          <div data-testid="portal-test">hello</div>
        </Portal>,
      );
      const element = getHostHTMLElement();

      expect(element).toBeInstanceOf(Node);
      expect(element.tagName.toLowerCase()).toBe('div');
      expect(element.textContent).toBe('hello');
      expect(containerNode.contains(element)).toBe(false);
    });

    it('should not portal even with layer prop when disablePortal=true', () => {
      initializePortals();

      const { getHostHTMLElement } = render(
        <Portal disablePortal layer="alert">
          <div data-testid="portal-test">hello</div>
        </Portal>,
      );
      const element = getHostHTMLElement();

      expect(element).toBeInstanceOf(Node);
      expect(element.tagName.toLowerCase()).toBe('div');
      expect(element.textContent).toBe('hello');

      // Ensure it's not in alert container
      const alertContainer = document.getElementById('mzn-alert-container');
      const targetInAlert = alertContainer?.querySelector(
        '[data-testid="portal-test"]',
      );

      expect(targetInAlert).toBeNull();
    });
  });

  describe('portal containers structure', () => {
    it('should create both alert and default containers when initialized', () => {
      initializePortals();

      const alertContainer = document.getElementById('mzn-alert-container');
      const portalContainer = document.getElementById('mzn-portal-container');

      expect(alertContainer).toBeInstanceOf(HTMLDivElement);
      expect(portalContainer).toBeInstanceOf(HTMLDivElement);
      expect(alertContainer?.className).toBe('mzn-portal-alert');
      expect(portalContainer?.className).toBe('mzn-portal-default');
    });

    it('should only initialize once even when called multiple times', () => {
      initializePortals();
      initializePortals();
      initializePortals();

      const alertContainers = document.querySelectorAll('#mzn-alert-container');
      const portalContainers = document.querySelectorAll(
        '#mzn-portal-container',
      );

      expect(alertContainers.length).toBe(1);
      expect(portalContainers.length).toBe(1);
    });
  });
});
