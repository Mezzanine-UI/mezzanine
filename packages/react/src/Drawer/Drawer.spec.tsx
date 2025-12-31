import {
  DrawerSize,
  drawerClasses as classes,
} from '@mezzanine-ui/core/drawer';
import { CloseIcon } from '@mezzanine-ui/icons';
import { cleanup, cleanupHook, fireEvent, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Drawer from '.';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
} as any;

function getOverlayElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-backdrop');
}

function getDrawerElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-drawer');
}

function getBackdropElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-backdrop__backdrop');
}

window.scrollTo = jest.fn();

describe('<Drawer />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Drawer ref={ref} open />),
  );

  it('should bind host class and append className from prop to drawer element', () => {
    const className = 'foo';

    render(
      <Drawer className={className} open>
        Content
      </Drawer>,
    );

    const drawerElement = getDrawerElement()!;

    expect(drawerElement.classList.contains(className)).toBeTruthy();
  });

  it('should not render when open=false', () => {
    render(<Drawer open={false}>Content</Drawer>);

    const overlayElement = getOverlayElement();

    expect(overlayElement).toBe(null);
  });

  it('should render when open=true', () => {
    render(<Drawer open>Content</Drawer>);

    const overlayElement = getOverlayElement();
    const drawerElement = getDrawerElement();

    expect(overlayElement).toBeInstanceOf(Node);
    expect(drawerElement).toBeInstanceOf(Node);
  });

  it('should render children in content section', () => {
    render(<Drawer open>Test Content</Drawer>);

    const drawerElement = getDrawerElement()!;
    const contentElement = drawerElement.querySelector(`.${classes.content}`);

    expect(contentElement).toBeInstanceOf(Node);
    expect(contentElement?.textContent).toBe('Test Content');
  });

  it('should bind host class and right placement class', () => {
    render(<Drawer open>Content</Drawer>);

    const drawerElement = getDrawerElement()!;

    expect(drawerElement.classList.contains(classes.host)).toBeTruthy();
    expect(drawerElement.classList.contains(classes.right)).toBeTruthy();
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      render(<Drawer open>Content</Drawer>);

      const drawerElement = getDrawerElement()!;

      expect(
        drawerElement.classList.contains(classes.size('medium')),
      ).toBeTruthy();
    });

    const sizes: DrawerSize[] = ['narrow', 'medium', 'wide'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        render(
          <Drawer open size={size}>
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;

        expect(
          drawerElement.classList.contains(classes.size(size)),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: header', () => {
    it('should not render header by default', () => {
      render(<Drawer open>Content</Drawer>);

      const drawerElement = getDrawerElement()!;
      const headerElement = drawerElement.querySelector(`.${classes.header}`);

      expect(headerElement).toBe(null);
    });

    it('should render header with title when provided', () => {
      render(
        <Drawer headerTitle="Drawer Title" isHeaderDisplay open>
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const headerElement = drawerElement.querySelector(`.${classes.header}`);

      expect(headerElement).toBeInstanceOf(Node);
      expect(headerElement?.textContent).toContain('Drawer Title');
    });

    it('should render close icon in header', () => {
      render(
        <Drawer headerTitle="Title" isHeaderDisplay open>
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const headerElement = drawerElement.querySelector(`.${classes.header}`);
      const closeIcon = headerElement?.querySelector('i[data-icon-name]');

      expect(closeIcon).toBeInstanceOf(Node);
      expect(closeIcon?.getAttribute('data-icon-name')).toBe(CloseIcon.name);
    });

    it('should call onClose when close icon clicked', () => {
      const onClose = jest.fn();

      render(
        <Drawer headerTitle="Title" isHeaderDisplay onClose={onClose} open>
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const headerElement = drawerElement.querySelector(`.${classes.header}`);
      const clearButton = headerElement?.querySelector('button');

      fireEvent.click(clearButton!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: bottom', () => {
    it('should not render bottom actions by default', () => {
      render(<Drawer open>Content</Drawer>);

      const drawerElement = getDrawerElement()!;
      const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);

      expect(bottomElement).toBe(null);
    });

    describe('ghostAction', () => {
      it('should render ghost action button when ghostActionText and handler provided', () => {
        const onGhostActionClick = jest.fn();

        render(
          <Drawer
            bottomGhostActionText="Cancel"
            bottomOnGhostActionClick={onGhostActionClick}
            isBottomDisplay
            open
          >
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const buttons = bottomElement?.querySelectorAll('button');

        expect(bottomElement).toBeInstanceOf(Node);
        expect(buttons?.length).toBe(1);
        expect(buttons?.[0].textContent).toBe('Cancel');
        expect(
          buttons?.[0].classList.contains('mzn-button--base-ghost'),
        ).toBeTruthy();
      });

      it('should call onGhostActionClick when ghost button clicked', () => {
        const onGhostActionClick = jest.fn();

        render(
          <Drawer
            bottomGhostActionText="Cancel"
            bottomOnGhostActionClick={onGhostActionClick}
            isBottomDisplay
            open
          >
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const buttons = bottomElement?.querySelectorAll('button');

        fireEvent.click(buttons![0]);

        expect(onGhostActionClick).toHaveBeenCalledTimes(1);
      });

      it('should not render ghost button if only text provided without handler', () => {
        render(
          <Drawer bottomGhostActionText="Cancel" isBottomDisplay open>
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const buttons = bottomElement?.querySelectorAll('button');

        expect(buttons?.length).toBe(0);
      });
    });

    describe('secondaryAction', () => {
      it('should render secondary action button when secondaryActionText and handler provided', () => {
        const onSecondaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnSecondaryActionClick={onSecondaryActionClick}
            bottomSecondaryActionText="Back"
            isBottomDisplay
            open
          >
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const actionsElement = bottomElement?.querySelector(
          `.${classes['bottom__actions']}`,
        );
        const buttons = actionsElement?.querySelectorAll('button');

        expect(buttons?.length).toBe(1);
        expect(buttons?.[0].textContent).toBe('Back');
        expect(
          buttons?.[0].classList.contains('mzn-button--base-secondary'),
        ).toBeTruthy();
      });

      it('should call onSecondaryActionClick when secondary button clicked', () => {
        const onSecondaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnSecondaryActionClick={onSecondaryActionClick}
            bottomSecondaryActionText="Back"
            isBottomDisplay
            open
          >
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const actionsElement = bottomElement?.querySelector(
          `.${classes['bottom__actions']}`,
        );
        const buttons = actionsElement?.querySelectorAll('button');

        fireEvent.click(buttons![0]);

        expect(onSecondaryActionClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('primaryAction', () => {
      it('should render primary action button when primaryActionText and handler provided', () => {
        const onPrimaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnPrimaryActionClick={onPrimaryActionClick}
            bottomPrimaryActionText="Submit"
            isBottomDisplay
            open
          >
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const actionsElement = bottomElement?.querySelector(
          `.${classes['bottom__actions']}`,
        );
        const buttons = actionsElement?.querySelectorAll('button');

        expect(buttons?.length).toBe(1);
        expect(buttons?.[0].textContent).toBe('Submit');
        expect(
          buttons?.[0].classList.contains('mzn-button--base-primary'),
        ).toBeTruthy();
      });

      it('should call onPrimaryActionClick when primary button clicked', () => {
        const onPrimaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnPrimaryActionClick={onPrimaryActionClick}
            bottomPrimaryActionText="Submit"
            isBottomDisplay
            open
          >
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const actionsElement = bottomElement?.querySelector(
          `.${classes['bottom__actions']}`,
        );
        const buttons = actionsElement?.querySelectorAll('button');

        fireEvent.click(buttons![0]);

        expect(onPrimaryActionClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('multiple actions', () => {
      it('should render all three action buttons when all provided', () => {
        const onGhostActionClick = jest.fn();
        const onSecondaryActionClick = jest.fn();
        const onPrimaryActionClick = jest.fn();

        render(
          <Drawer
            bottomGhostActionText="Cancel"
            bottomOnGhostActionClick={onGhostActionClick}
            bottomOnPrimaryActionClick={onPrimaryActionClick}
            bottomOnSecondaryActionClick={onSecondaryActionClick}
            bottomPrimaryActionText="Submit"
            bottomSecondaryActionText="Back"
            isBottomDisplay
            open
          >
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const buttons = bottomElement?.querySelectorAll('button');

        expect(buttons?.length).toBe(3);
        expect(buttons?.[0].textContent).toBe('Cancel');
        expect(buttons?.[1].textContent).toBe('Back');
        expect(buttons?.[2].textContent).toBe('Submit');
      });

      it('should render ghost and primary without secondary', () => {
        const onGhostActionClick = jest.fn();
        const onPrimaryActionClick = jest.fn();

        render(
          <Drawer
            bottomGhostActionText="Cancel"
            bottomOnGhostActionClick={onGhostActionClick}
            bottomOnPrimaryActionClick={onPrimaryActionClick}
            bottomPrimaryActionText="Submit"
            isBottomDisplay
            open
          >
            Content
          </Drawer>,
        );

        const drawerElement = getDrawerElement()!;
        const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);
        const buttons = bottomElement?.querySelectorAll('button');

        expect(buttons?.length).toBe(2);
        expect(buttons?.[0].textContent).toBe('Cancel');
        expect(buttons?.[1].textContent).toBe('Submit');
      });
    });
  });

  describe('overlay props', () => {
    it('should pass disableCloseOnBackdropClick prop', () => {
      const onClose = jest.fn();

      render(
        <Drawer open onClose={onClose} disableCloseOnBackdropClick>
          Content
        </Drawer>,
      );

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should pass disableCloseOnEscapeKeyDown prop', () => {
      const onClose = jest.fn();

      render(
        <Drawer open onClose={onClose} disableCloseOnEscapeKeyDown>
          Content
        </Drawer>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should pass onBackdropClick handler', () => {
      const onBackdropClick = jest.fn();

      render(
        <Drawer open onBackdropClick={onBackdropClick}>
          Content
        </Drawer>,
      );

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onBackdropClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('combinations', () => {
    it('should render complete drawer with header, content, and bottom actions', () => {
      const onClose = jest.fn();
      const onGhostActionClick = jest.fn();
      const onSecondaryActionClick = jest.fn();
      const onPrimaryActionClick = jest.fn();

      render(
        <Drawer
          bottomGhostActionText="Cancel"
          bottomOnGhostActionClick={onGhostActionClick}
          bottomOnPrimaryActionClick={onPrimaryActionClick}
          bottomOnSecondaryActionClick={onSecondaryActionClick}
          bottomPrimaryActionText="Submit"
          bottomSecondaryActionText="Back"
          headerTitle="Complete Drawer"
          isBottomDisplay
          isHeaderDisplay
          onClose={onClose}
          open
          size="wide"
        >
          <div>Main Content</div>
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const headerElement = drawerElement.querySelector(`.${classes.header}`);
      const contentElement = drawerElement.querySelector(`.${classes.content}`);
      const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);

      expect(
        drawerElement.classList.contains(classes.size('wide')),
      ).toBeTruthy();
      expect(headerElement?.textContent).toContain('Complete Drawer');
      expect(contentElement?.textContent).toBe('Main Content');
      expect(bottomElement?.querySelectorAll('button').length).toBe(3);
    });
  });
});
