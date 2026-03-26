import { useState, useEffect } from 'react';
import {
  DrawerSize,
  drawerClasses as classes,
} from '@mezzanine-ui/core/drawer';
import { CloseIcon } from '@mezzanine-ui/icons';
import userEvent from '@testing-library/user-event';
import { cleanup, cleanupHook, fireEvent, render, screen, waitFor } from '../../__test-utils__';
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

      it('should render ghost action button with custom props', () => {
        const onGhostActionClick = jest.fn();

        render(
          <Drawer
            bottomGhostActionDisabled
            bottomGhostActionLoading={false}
            bottomGhostActionText="Custom Cancel"
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

        expect(buttons?.length).toBe(1);
        expect(buttons?.[0].textContent).toBe('Custom Cancel');
        expect(buttons?.[0].disabled).toBe(true);
        expect(
          buttons?.[0].classList.contains('mzn-button--base-ghost'),
        ).toBeTruthy();
      });

      it('should apply loading state to ghost action button', () => {
        const onGhostActionClick = jest.fn();

        render(
          <Drawer
            bottomGhostActionLoading
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

        expect(
          buttons?.[0].classList.contains('mzn-button--loading'),
        ).toBeTruthy();
      });

      it('should apply custom variant to ghost action button', () => {
        const onGhostActionClick = jest.fn();

        render(
          <Drawer
            bottomGhostActionText="Cancel"
            bottomGhostActionVariant="base-secondary"
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

        expect(
          buttons?.[0].classList.contains('mzn-button--base-secondary'),
        ).toBeTruthy();
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

      it('should render secondary action button with custom props', () => {
        const onSecondaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnSecondaryActionClick={onSecondaryActionClick}
            bottomSecondaryActionDisabled
            bottomSecondaryActionText="Custom Back"
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
        expect(buttons?.[0].textContent).toBe('Custom Back');
        expect(buttons?.[0].disabled).toBe(true);
        expect(
          buttons?.[0].classList.contains('mzn-button--base-secondary'),
        ).toBeTruthy();
      });

      it('should apply loading state to secondary action button', () => {
        const onSecondaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnSecondaryActionClick={onSecondaryActionClick}
            bottomSecondaryActionLoading
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

        expect(
          buttons?.[0].classList.contains('mzn-button--loading'),
        ).toBeTruthy();
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

      it('should render primary action button with custom props', () => {
        const onPrimaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnPrimaryActionClick={onPrimaryActionClick}
            bottomPrimaryActionText="Custom Submit"
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
        expect(buttons?.[0].textContent).toBe('Custom Submit');
        expect(
          buttons?.[0].classList.contains('mzn-button--base-primary'),
        ).toBeTruthy();
      });

      it('should apply disabled state to primary action button', () => {
        const onPrimaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnPrimaryActionClick={onPrimaryActionClick}
            bottomPrimaryActionDisabled
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

        expect(buttons?.[0].disabled).toBe(true);
      });

      it('should apply custom variant to primary action button', () => {
        const onPrimaryActionClick = jest.fn();

        render(
          <Drawer
            bottomOnPrimaryActionClick={onPrimaryActionClick}
            bottomPrimaryActionText="Submit"
            bottomPrimaryActionVariant="base-ghost"
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

        expect(
          buttons?.[0].classList.contains('mzn-button--base-ghost'),
        ).toBeTruthy();
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

  describe('prop: filterArea (default)', () => {
    it('should not render filter area by default when filterAreaShow is false', () => {
      render(<Drawer open>Content</Drawer>);

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );

      expect(filterAreaElement).toBe(null);
    });

    it('should render filter area when filterAreaShow is true', () => {
      render(
        <Drawer filterAreaAllRadioLabel="All" filterAreaShow open>
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );

      expect(filterAreaElement).toBeInstanceOf(Node);
    });

    it('should render RadioGroup with correct labels', () => {
      render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaReadRadioLabel="Read"
          filterAreaShow
          filterAreaShowUnreadButton
          filterAreaUnreadRadioLabel="Unread"
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const radios = filterAreaElement?.querySelectorAll('input[type="radio"]');

      expect(radios?.length).toBe(3);

      const labels = filterAreaElement?.querySelectorAll('label');
      const labelTexts = Array.from(labels || []).map(
        (label) => label.textContent,
      );

      expect(labelTexts).toContain('All');
      expect(labelTexts).toContain('Read');
      expect(labelTexts).toContain('Unread');
    });

    it('should render only 2 radios when filterAreaShowUnreadButton is false', () => {
      render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaReadRadioLabel="Read"
          filterAreaShow
          filterAreaShowUnreadButton={false}
          filterAreaUnreadRadioLabel="Unread"
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const radios = filterAreaElement?.querySelectorAll('input[type="radio"]');

      expect(radios?.length).toBe(2);
    });

    it('should render custom button with correct label', () => {
      render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaCustomButtonLabel="Clear All"
          filterAreaOnCustomButtonClick={jest.fn()}
          filterAreaShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const button = filterAreaElement?.querySelector('button');

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button?.textContent).toBe('Clear All');
      expect(button?.classList.contains('mzn-button--base-ghost')).toBeTruthy();
    });

    it('should disable custom button when filterAreaIsEmpty is true', () => {
      render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaIsEmpty
          filterAreaOnCustomButtonClick={jest.fn()}
          filterAreaShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const button = filterAreaElement?.querySelector(
        'button',
      ) as HTMLButtonElement;

      expect(button?.disabled).toBe(true);
    });

    it('should enable custom button when filterAreaIsEmpty is false', () => {
      render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaIsEmpty={false}
          filterAreaOnCustomButtonClick={jest.fn()}
          filterAreaShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const button = filterAreaElement?.querySelector(
        'button',
      ) as HTMLButtonElement;

      expect(button?.disabled).toBe(false);
    });

    it('should call filterAreaOnCustomButtonClick when custom button clicked', () => {
      const onCustomButtonClick = jest.fn();

      render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaOnCustomButtonClick={onCustomButtonClick}
          filterAreaShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const button = filterAreaElement?.querySelector(
        'button',
      ) as HTMLButtonElement;

      fireEvent.click(button);

      expect(onCustomButtonClick).toHaveBeenCalledTimes(1);
    });

    it('should call filterAreaOnRadioChange when radio selection changes', () => {
      const onRadioChange = jest.fn();

      render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaOnRadioChange={onRadioChange}
          filterAreaReadRadioLabel="Read"
          filterAreaShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const radios = filterAreaElement?.querySelectorAll(
        'input[type="radio"]',
      ) as NodeListOf<HTMLInputElement>;

      fireEvent.click(radios[1]);

      expect(onRadioChange).toHaveBeenCalledTimes(1);
    });

    it('should set default value for RadioGroup', () => {
      render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaDefaultValue="read"
          filterAreaReadRadioLabel="Read"
          filterAreaShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const radios = filterAreaElement?.querySelectorAll(
        'input[type="radio"]',
      ) as NodeListOf<HTMLInputElement>;
      const checkedRadio = Array.from(radios).find((radio) => radio.checked);

      expect(checkedRadio?.value).toBe('read');
    });

    it('should control RadioGroup value', () => {
      const { rerender } = render(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaReadRadioLabel="Read"
          filterAreaShow
          filterAreaValue="all"
          open
        >
          Content
        </Drawer>,
      );

      let drawerElement = getDrawerElement()!;
      let filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      let radios = filterAreaElement?.querySelectorAll(
        'input[type="radio"]',
      ) as NodeListOf<HTMLInputElement>;
      let checkedRadio = Array.from(radios).find((radio) => radio.checked);

      expect(checkedRadio?.value).toBe('all');

      rerender(
        <Drawer
          filterAreaAllRadioLabel="All"
          filterAreaReadRadioLabel="Read"
          filterAreaShow
          filterAreaValue="read"
          open
        >
          Content
        </Drawer>,
      );

      drawerElement = getDrawerElement()!;
      filterAreaElement = drawerElement.querySelector(`.${classes.filterArea}`);
      radios = filterAreaElement?.querySelectorAll(
        'input[type="radio"]',
      ) as NodeListOf<HTMLInputElement>;
      checkedRadio = Array.from(radios).find((radio) => radio.checked);

      expect(checkedRadio?.value).toBe('read');
    });

    it('should not render control bar when no radio labels and no button callback are provided', () => {
      render(
        <Drawer filterAreaShow open>
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );

      expect(filterAreaElement).toBe(null);
    });

    it('should render control bar with only button when no radio labels provided but button callback exists', () => {
      const onCustomButtonClick = jest.fn();

      render(
        <Drawer
          filterAreaCustomButtonLabel="Action"
          filterAreaOnCustomButtonClick={onCustomButtonClick}
          filterAreaShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const radioGroup = filterAreaElement?.querySelector('.mzn-radio-group');
      const button = filterAreaElement?.querySelector('button');

      expect(filterAreaElement).toBeInstanceOf(Node);
      expect(
        filterAreaElement?.classList.contains(classes.filterAreaButtonOnly),
      ).toBeTruthy();
      expect(radioGroup).toBe(null);
      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button?.textContent).toBe('Action');
    });

    it('should call button callback when only button is rendered', () => {
      const onCustomButtonClick = jest.fn();

      render(
        <Drawer
          filterAreaOnCustomButtonClick={onCustomButtonClick}
          filterAreaShow
          open
        >
          Content
        </Drawer>,
      );

      const drawerElement = getDrawerElement()!;
      const filterAreaElement = drawerElement.querySelector(
        `.${classes.filterArea}`,
      );
      const button = filterAreaElement?.querySelector(
        'button',
      ) as HTMLButtonElement;

      fireEvent.click(button);

      expect(onCustomButtonClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: filterAreaOptions', () => {
    it('should render icon button when filterAreaOptions is non-empty', () => {
      render(
        <Drawer
          filterAreaShow
          filterAreaOptions={[{ id: 'a', name: 'A' }]}
          open
        >
          Content
        </Drawer>,
      );

      const filterAreaElement = getDrawerElement()!.querySelector(
        `.${classes.filterArea}`,
      );
      const iconButton = filterAreaElement?.querySelector('button');

      expect(iconButton).toBeInstanceOf(Node);
      expect(iconButton?.querySelector('i[data-icon-name]')).toBeInstanceOf(Node);
    });

    it('should render plain text button when filterAreaOptions is empty', () => {
      render(
        <Drawer
          filterAreaCustomButtonLabel="Clear"
          filterAreaOnCustomButtonClick={jest.fn()}
          filterAreaShow
          filterAreaOptions={[]}
          open
        >
          Content
        </Drawer>,
      );

      const filterAreaElement = getDrawerElement()!.querySelector(
        `.${classes.filterArea}`,
      );
      const button = filterAreaElement?.querySelector('button');

      expect(button?.textContent).toBe('Clear');
    });

    it('should call filterAreaOnSelect when a dropdown option is selected', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();

      render(
        <Drawer
          filterAreaShow
          filterAreaOnSelect={onSelect}
          filterAreaOptions={[{ id: 'a', name: 'Option A' }]}
          open
        >
          Content
        </Drawer>,
      );

      const filterAreaElement = getDrawerElement()!.querySelector(
        `.${classes.filterArea}`,
      );
      const iconButton = filterAreaElement?.querySelector('button') as HTMLButtonElement;

      await user.click(iconButton);

      await waitFor(() => {
        expect(screen.getByText('Option A')).toBeTruthy();
      });

      await user.click(screen.getByText('Option A'));

      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'a' }),
      );
    });
  });

  describe('content remount behavior', () => {
    describe('prop: contentKey', () => {
      it('should remount content when contentKey changes', () => {
        const StatefulChild = () => {
          const [count, setCount] = useState(0);

          return (
            <div>
              <span data-testid="count">{count}</span>
              <button onClick={() => setCount((c) => c + 1)}>+</button>
            </div>
          );
        };

        const { rerender } = render(
          <Drawer contentKey="key1" open>
            <StatefulChild />
          </Drawer>,
        );

        const contentEl = getDrawerElement()!.querySelector(
          `.${classes.content}`,
        )!;

        fireEvent.click(contentEl.querySelector('button')!);
        expect(
          contentEl.querySelector('[data-testid="count"]')?.textContent,
        ).toBe('1');

        rerender(
          <Drawer contentKey="key2" open>
            <StatefulChild />
          </Drawer>,
        );

        const newContentEl = getDrawerElement()!.querySelector(
          `.${classes.content}`,
        )!;

        expect(
          newContentEl.querySelector('[data-testid="count"]')?.textContent,
        ).toBe('0');
      });

      it('should preserve child state when contentKey stays the same', () => {
        const StatefulChild = () => {
          const [count, setCount] = useState(0);

          return (
            <div>
              <span data-testid="count">{count}</span>
              <button onClick={() => setCount((c) => c + 1)}>+</button>
            </div>
          );
        };

        const { rerender } = render(
          <Drawer contentKey="stable" open>
            <StatefulChild />
          </Drawer>,
        );

        const contentEl = getDrawerElement()!.querySelector(
          `.${classes.content}`,
        )!;

        fireEvent.click(contentEl.querySelector('button')!);
        expect(
          contentEl.querySelector('[data-testid="count"]')?.textContent,
        ).toBe('1');

        rerender(
          <Drawer contentKey="stable" open>
            <StatefulChild />
          </Drawer>,
        );

        const sameContentEl = getDrawerElement()!.querySelector(
          `.${classes.content}`,
        )!;

        expect(
          sameContentEl.querySelector('[data-testid="count"]')?.textContent,
        ).toBe('1');
      });

      it('should accept a numeric contentKey', () => {
        const StatefulChild = () => {
          const [count, setCount] = useState(0);

          return (
            <div>
              <span data-testid="count">{count}</span>
              <button onClick={() => setCount((c) => c + 1)}>+</button>
            </div>
          );
        };

        const { rerender } = render(
          <Drawer contentKey={1} open>
            <StatefulChild />
          </Drawer>,
        );

        const contentEl = getDrawerElement()!.querySelector(
          `.${classes.content}`,
        )!;

        fireEvent.click(contentEl.querySelector('button')!);
        expect(
          contentEl.querySelector('[data-testid="count"]')?.textContent,
        ).toBe('1');

        rerender(
          <Drawer contentKey={2} open>
            <StatefulChild />
          </Drawer>,
        );

        const newContentEl = getDrawerElement()!.querySelector(
          `.${classes.content}`,
        )!;

        expect(
          newContentEl.querySelector('[data-testid="count"]')?.textContent,
        ).toBe('0');
      });
    });

    describe('auto-remount on reopen (without contentKey)', () => {
      it('should remount content when drawer reopens', () => {
        const StatefulChild = () => {
          const [count, setCount] = useState(0);

          return (
            <div>
              <span data-testid="count">{count}</span>
              <button onClick={() => setCount((c) => c + 1)}>+</button>
            </div>
          );
        };

        const { rerender } = render(
          <Drawer open>
            <StatefulChild />
          </Drawer>,
        );

        const contentEl = getDrawerElement()!.querySelector(
          `.${classes.content}`,
        )!;

        fireEvent.click(contentEl.querySelector('button')!);
        expect(
          contentEl.querySelector('[data-testid="count"]')?.textContent,
        ).toBe('1');

        rerender(
          <Drawer open={false}>
            <StatefulChild />
          </Drawer>,
        );

        rerender(
          <Drawer open>
            <StatefulChild />
          </Drawer>,
        );

        const newContentEl = getDrawerElement()!.querySelector(
          `.${classes.content}`,
        )!;

        expect(
          newContentEl.querySelector('[data-testid="count"]')?.textContent,
        ).toBe('0');
      });

      it('should increment openCount on each open, causing content remount', () => {
        let mountCount = 0;

        const Child = () => {
          useEffect(() => {
            mountCount++;
          }, []);

          return null;
        };

        const { rerender } = render(
          <Drawer open={false}>
            <Child />
          </Drawer>,
        );

        expect(mountCount).toBe(0);

        rerender(
          <Drawer open>
            <Child />
          </Drawer>,
        );

        const mountsAfterFirstOpen = mountCount;

        expect(mountsAfterFirstOpen).toBeGreaterThan(0);

        rerender(
          <Drawer open={false}>
            <Child />
          </Drawer>,
        );

        rerender(
          <Drawer open>
            <Child />
          </Drawer>,
        );

        expect(mountCount).toBeGreaterThan(mountsAfterFirstOpen);
      });
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

      render(
        <Drawer
          bottomOnPrimaryActionClick={onPrimaryActionClick}
          bottomPrimaryActionText="Submit"
          filterAreaAllRadioLabel="All"
          filterAreaShow
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
      const filterAreaElement = drawerElement.querySelector(`.${classes.filterArea}`);
      const contentElement = drawerElement.querySelector(`.${classes.content}`);
      const bottomElement = drawerElement.querySelector(`.${classes.bottom}`);

      expect(headerElement).toBeInstanceOf(Node);
      expect(filterAreaElement).toBeInstanceOf(Node);
      expect(contentElement).toBeInstanceOf(Node);
      expect(bottomElement).toBeInstanceOf(Node);

      expect(headerElement?.textContent).toContain('Complete Drawer');
      expect(contentElement?.textContent).toBe('Main Content');
    });
  });
});
