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

  describe('prop: controlBar (default)', () => {
    it('should not render control bar by default when controlBarShow is false', () => {
      render(<Drawer open>Content</Drawer>);

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );

      expect(controlBarElement).toBe(null);
    });

    it('should render control bar when controlBarShow is true', () => {
      render(
        <Drawer controlBarAllRadioLabel="All" controlBarShow open>
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );

      expect(controlBarElement).toBeInstanceOf(Node);
    });

    it('should render RadioGroup with correct labels', () => {
      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarReadRadioLabel="Read"
          controlBarShow
          controlBarShowUnreadButton
          controlBarUnreadRadioLabel="Unread"
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      const radios = controlBarElement?.querySelectorAll('input[type="radio"]');

      expect(radios?.length).toBe(3);

      const labels = controlBarElement?.querySelectorAll('label');
      const labelTexts = Array.from(labels || []).map(
        (label) => label.textContent,
      );

      expect(labelTexts).toContain('All');
      expect(labelTexts).toContain('Read');
      expect(labelTexts).toContain('Unread');
    });

    it('should render only 2 radios when controlBarShowUnreadButton is false', () => {
      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarReadRadioLabel="Read"
          controlBarShow
          controlBarShowUnreadButton={false}
          controlBarUnreadRadioLabel="Unread"
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      const radios = controlBarElement?.querySelectorAll('input[type="radio"]');

      expect(radios?.length).toBe(2);
    });

    it('should render custom button with correct label', () => {
      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarCustomButtonLabel="Clear All"
          controlBarShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      const button = controlBarElement?.querySelector('button');

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button?.textContent).toBe('Clear All');
      expect(button?.classList.contains('mzn-button--base-ghost')).toBeTruthy();
    });

    it('should disable custom button when controlBarIsEmpty is true', () => {
      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarIsEmpty
          controlBarShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      const button = controlBarElement?.querySelector(
        'button',
      ) as HTMLButtonElement;

      expect(button?.disabled).toBe(true);
    });

    it('should enable custom button when controlBarIsEmpty is false', () => {
      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarIsEmpty={false}
          controlBarShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      const button = controlBarElement?.querySelector(
        'button',
      ) as HTMLButtonElement;

      expect(button?.disabled).toBe(false);
    });

    it('should call controlBarOnCustomButtonClick when custom button clicked', () => {
      const onCustomButtonClick = jest.fn();

      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarOnCustomButtonClick={onCustomButtonClick}
          controlBarShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      const button = controlBarElement?.querySelector(
        'button',
      ) as HTMLButtonElement;

      fireEvent.click(button);

      expect(onCustomButtonClick).toHaveBeenCalledTimes(1);
    });

    it('should call controlBarOnRadioChange when radio selection changes', () => {
      const onRadioChange = jest.fn();

      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarOnRadioChange={onRadioChange}
          controlBarReadRadioLabel="Read"
          controlBarShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      const radios = controlBarElement?.querySelectorAll(
        'input[type="radio"]',
      ) as NodeListOf<HTMLInputElement>;

      fireEvent.click(radios[1]);

      expect(onRadioChange).toHaveBeenCalledTimes(1);
    });

    it('should set default value for RadioGroup', () => {
      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarDefaultValue="read"
          controlBarReadRadioLabel="Read"
          controlBarShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      const radios = controlBarElement?.querySelectorAll(
        'input[type="radio"]',
      ) as NodeListOf<HTMLInputElement>;
      const checkedRadio = Array.from(radios).find((radio) => radio.checked);

      expect(checkedRadio?.value).toBe('read');
    });

    it('should control RadioGroup value', () => {
      const { rerender } = render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarReadRadioLabel="Read"
          controlBarShow
          controlBarValue="all"
          open
        >
          Content
        </Drawer>,
      );

      let drawerElement = getDrawerElement()!;
      let controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );
      let radios = controlBarElement?.querySelectorAll(
        'input[type="radio"]',
      ) as NodeListOf<HTMLInputElement>;
      let checkedRadio = Array.from(radios).find((radio) => radio.checked);

      expect(checkedRadio?.value).toBe('all');

      rerender(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarReadRadioLabel="Read"
          controlBarShow
          controlBarValue="read"
          open
        >
          Content
        </Drawer>,
      );

      drawerElement = getDrawerElement()!;
      controlBarElement = drawerElement.querySelector(`.${classes.controlBar}`);
      radios = controlBarElement?.querySelectorAll(
        'input[type="radio"]',
      ) as NodeListOf<HTMLInputElement>;
      checkedRadio = Array.from(radios).find((radio) => radio.checked);

      expect(checkedRadio?.value).toBe('read');
    });

    it('should not render control bar when no radio labels are provided even if controlBarShow is true', () => {
      render(
        <Drawer controlBarShow open>
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );

      expect(controlBarElement).toBe(null);
    });
  });

  describe('prop: renderControlBar', () => {
    it('should not render control bar by default', () => {
      render(<Drawer open>Content</Drawer>);

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        '[data-testid="control-bar"]',
      );

      expect(controlBarElement).toBe(null);
    });

    it('should render custom control bar when renderControlBar provided', () => {
      const renderControlBar = () => (
        <div data-testid="control-bar">Custom Control Bar</div>
      );

      render(
        <Drawer open renderControlBar={renderControlBar}>
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const controlBarElement = drawerElement.querySelector(
        '[data-testid="control-bar"]',
      );

      expect(controlBarElement).toBeInstanceOf(Node);
      expect(controlBarElement?.textContent).toBe('Custom Control Bar');
    });

    it('should render control bar between header and content', () => {
      const renderControlBar = () => (
        <div data-testid="control-bar">Control Bar</div>
      );

      render(
        <Drawer
          headerTitle="Header"
          isHeaderDisplay
          open
          renderControlBar={renderControlBar}
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const headerElement = drawerElement.querySelector(`.${classes.header}`);
      const controlBarElement = drawerElement.querySelector(
        '[data-testid="control-bar"]',
      );
      const contentElement = drawerElement.querySelector(`.${classes.content}`);

      // Check all elements exist
      expect(headerElement).toBeInstanceOf(Node);
      expect(controlBarElement).toBeInstanceOf(Node);
      expect(contentElement).toBeInstanceOf(Node);

      // Check order: header should come before control bar, control bar before content
      const childNodes = Array.from(drawerElement.children);
      const headerIndex = childNodes.indexOf(headerElement as Element);
      const controlBarIndex = childNodes.indexOf(controlBarElement as Element);
      const contentIndex = childNodes.indexOf(contentElement as Element);

      expect(headerIndex).toBeLessThan(controlBarIndex);
      expect(controlBarIndex).toBeLessThan(contentIndex);
    });

    it('should call renderControlBar function', () => {
      const renderControlBar = jest.fn(() => <div>Control Bar</div>);

      render(
        <Drawer open renderControlBar={renderControlBar}>
          Content
        </Drawer>,
      );

      expect(renderControlBar).toHaveBeenCalled();
    });

    it('should use renderControlBar over default control bar when both provided', () => {
      const renderControlBar = () => (
        <div data-testid="custom-control-bar">Custom Control Bar</div>
      );

      render(
        <Drawer
          controlBarAllRadioLabel="All"
          controlBarShow
          open
          renderControlBar={renderControlBar}
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const customControlBar = drawerElement.querySelector(
        '[data-testid="custom-control-bar"]',
      );
      const defaultControlBar = drawerElement.querySelector(
        `.${classes.controlBar}`,
      );

      expect(customControlBar).toBeInstanceOf(Node);
      expect(defaultControlBar).toBe(null);
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

    it('should render complete drawer with header, control bar, content, and bottom actions', () => {
      const onClose = jest.fn();
      const onPrimaryActionClick = jest.fn();
      const renderControlBar = () => (
        <div data-testid="control-bar">Filter Control Bar</div>
      );

      render(
        <Drawer
          bottomOnPrimaryActionClick={onPrimaryActionClick}
          bottomPrimaryActionText="Submit"
          headerTitle="Complete Drawer"
          isBottomDisplay
          isHeaderDisplay
          onClose={onClose}
          open
          renderControlBar={renderControlBar}
          size="wide"
        >
          <div>Main Content</div>
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const headerElement = drawerElement.querySelector(`.${classes.header}`);
      const controlBarElement = drawerElement.querySelector(
        '[data-testid="control-bar"]',
      );
      const contentElement = drawerElement.querySelector(`.${classes.content}`);
      const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);

      expect(headerElement).toBeInstanceOf(Node);
      expect(controlBarElement).toBeInstanceOf(Node);
      expect(contentElement).toBeInstanceOf(Node);
      expect(bottomElement).toBeInstanceOf(Node);

      expect(headerElement?.textContent).toContain('Complete Drawer');
      expect(controlBarElement?.textContent).toBe('Filter Control Bar');
      expect(contentElement?.textContent).toBe('Main Content');
    });
  });
});
