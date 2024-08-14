import { useRef } from 'react';
import { cleanup, render } from '../../__test-utils__';
import Portal from '.';

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
  afterEach(cleanup);

  it('should render children to body by default if provided', () => {
    render(
      <Portal>
        <div id="portal-test">hello</div>
      </Portal>,
    );

    const targetNode = document.body.querySelector('#portal-test');

    expectParentNode(targetNode, document.body);
    expectTargetNode(targetNode);
  });

  describe('prop: container', () => {
    it('should portal to target container if provided', () => {
      const { body } = document;
      const containerNode = document.createElement('div');

      containerNode.setAttribute('id', 'contianer');

      body.appendChild(containerNode);

      render(<Portal container={containerNode}>{targetElement}</Portal>);

      const targetNode = containerNode.querySelector('#portal-test');

      expectParentNode(targetNode, containerNode);
      expectTargetNode(targetNode);
    });

    it('should portal to target container if a container as function type is provided', () => {
      const { body } = document;
      const containerNode = document.createElement('div');

      containerNode.setAttribute('id', 'contianer');

      body.appendChild(containerNode);

      const container = () => containerNode;

      render(<Portal container={container}>{targetElement}</Portal>);

      const targetNode = containerNode.querySelector('#portal-test');

      expectParentNode(targetNode, containerNode);
      expectTargetNode(targetNode);
    });

    it('should portal to target container if a container as ref is provided', () => {
      const testId = 'container';
      const TestingComponent = () => {
        const containerRef = useRef<HTMLDivElement>(null);

        return (
          <>
            <div id={testId} ref={containerRef} />
            <Portal container={containerRef}>{targetElement}</Portal>,
          </>
        );
      };

      render(<TestingComponent />);

      const containerNode = document.querySelector(`#${testId}`);
      const targetNode = containerNode?.querySelector('#portal-test');

      expectParentNode(targetNode, containerNode);
      expectTargetNode(targetNode);
    });

    it('should portal to body if container is given undefined', () => {
      render(<Portal container={undefined}>{targetElement}</Portal>);

      const { body } = document;
      const targetNode = body.querySelector('#portal-test');

      expectParentNode(targetNode, body);
      expectTargetNode(targetNode);
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

      containerNode.setAttribute('id', 'contianer');

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
  });
});
