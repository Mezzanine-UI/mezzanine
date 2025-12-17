import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { pageToolbarClasses as classes } from '@mezzanine-ui/core/page-toolbar';
import { PlusIcon } from '@mezzanine-ui/icons';
import Button from '../Button';
import PageToolbar from '.';
import Input from '../Input';

describe('<PageToolbar />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <PageToolbar
        actions={{
          primaryButton: { children: 'Confirm' },
        }}
        ref={ref}
      />,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <PageToolbar
        actions={{
          primaryButton: { children: 'Confirm' },
        }}
        className={className}
      />,
    ),
  );

  it('should bind host class', () => {
    const { container } = render(
      <PageToolbar
        actions={{
          primaryButton: { children: 'Confirm' },
        }}
      />,
    );
    const element = container.querySelector(`.${classes.host}`);

    expect(element).toBeInstanceOf(HTMLDivElement);
  });

  describe('prop: size', () => {
    it('should render with main size by default', () => {
      const { container } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
        />,
      );
      const element = container.querySelector(`.${classes.size('main')}`);

      expect(element).toBeInstanceOf(HTMLDivElement);
    });

    it('should render with sub size', () => {
      const { container } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
          size="sub"
        />,
      );
      const element = container.querySelector(`.${classes.size('sub')}`);

      expect(element).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('prop: actions', () => {
    it('should render primary button with base-primary variant', () => {
      const { getByText } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Submit' },
          }}
        />,
      );
      const button = getByText('Submit');

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(
        button.classList.contains('mzn-button--base-primary'),
      ).toBeTruthy();
    });

    it('should render secondary button with base-secondary variant', () => {
      const { getByText } = render(
        <PageToolbar
          actions={{
            secondaryButton: { children: 'Cancel' },
          }}
        />,
      );
      const button = getByText('Cancel');

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(
        button.classList.contains('mzn-button--base-secondary'),
      ).toBeTruthy();
    });

    it('should render destructive button with destructive-secondary variant', () => {
      const { getByText } = render(
        <PageToolbar
          actions={{
            destructiveButton: { children: 'Delete' },
          }}
        />,
      );
      const button = getByText('Delete');

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(
        button.classList.contains('mzn-button--destructive-secondary'),
      ).toBeTruthy();
    });

    it('should render all action buttons in correct order', () => {
      const { container } = render(
        <PageToolbar
          actions={{
            destructiveButton: { children: 'Delete' },
            primaryButton: { children: 'Confirm' },
            secondaryButton: { children: 'Cancel' },
          }}
        />,
      );
      const buttonGroup = container.querySelector('.mzn-button-group');
      const buttons = buttonGroup!.querySelectorAll('button');

      expect(buttons).toHaveLength(3);
      expect(buttons[0].textContent).toBe('Delete');
      expect(buttons[1].textContent).toBe('Cancel');
      expect(buttons[2].textContent).toBe('Confirm');
    });

    it('should render single button element as action', () => {
      const { getByText } = render(
        <PageToolbar actions={<Button>Custom Button</Button>} />,
      );
      const button = getByText('Custom Button');

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(
        button.classList.contains('mzn-button--base-primary'),
      ).toBeTruthy();
    });

    it('should render single button props as action', () => {
      const { getByText } = render(
        <PageToolbar actions={{ children: 'Single Action' }} />,
      );
      const button = getByText('Single Action');

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(
        button.classList.contains('mzn-button--base-primary'),
      ).toBeTruthy();
    });

    it('should apply correct size to action buttons', () => {
      const { getByText } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Submit' },
          }}
          size="sub"
        />,
      );
      const button = getByText('Submit');

      expect(button.classList.contains('mzn-button--sub')).toBeTruthy();
    });
  });

  describe('prop: filter', () => {
    it('should render filter component', () => {
      const { container } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
          filter={<Input variant="search" placeholder="Search..." />}
        />,
      );
      const input = container.querySelector('input');

      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(input!.placeholder).toBe('Search...');
    });

    it('should apply size to filter component', () => {
      const { container } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
          filter={<Input variant="search" placeholder="Search..." />}
          size="sub"
        />,
      );
      const input = container.querySelector('input');

      expect(input).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('prop: utilities', () => {
    it('should render single utility button with tooltip', () => {
      const { container } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
          utilities={
            <Button
              icon={{ position: 'icon-only', src: PlusIcon }}
              title="Add"
            />
          }
        />,
      );
      const buttonGroups = container.querySelectorAll('.mzn-button-group');
      const utilityButton = buttonGroups[1]?.querySelector('button');

      expect(utilityButton).toBeInstanceOf(HTMLButtonElement);
      expect(
        utilityButton!.classList.contains('mzn-button--icon-only'),
      ).toBeTruthy();
      expect(
        utilityButton!.classList.contains('mzn-button--base-secondary'),
      ).toBeTruthy();
    });

    it('should render multiple utility buttons with tooltips', () => {
      const { container } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
          utilities={
            <>
              <Button
                icon={{ position: 'icon-only', src: PlusIcon }}
                title="Add"
              />
              <Button
                icon={{ position: 'icon-only', src: PlusIcon }}
                title="Edit"
              />
            </>
          }
        />,
      );
      const buttonGroups = container.querySelectorAll('.mzn-button-group');
      const utilityButtons = buttonGroups[1]?.querySelectorAll('button');

      expect(utilityButtons).toHaveLength(2);
      expect(
        utilityButtons![0].classList.contains('mzn-button--icon-only'),
      ).toBeTruthy();
      expect(
        utilityButtons![1].classList.contains('mzn-button--icon-only'),
      ).toBeTruthy();
    });

    it('should apply correct size to utility buttons', () => {
      const { container } = render(
        <PageToolbar
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
          size="sub"
          utilities={
            <Button
              icon={{ position: 'icon-only', src: PlusIcon }}
              title="Add"
            />
          }
        />,
      );
      const buttonGroups = container.querySelectorAll('.mzn-button-group');
      const utilityButton = buttonGroups[1]?.querySelector('button');

      expect(utilityButton!.classList.contains('mzn-button--sub')).toBeTruthy();
    });
  });

  describe('complete layout', () => {
    it('should render all props together', () => {
      const { container, getByText } = render(
        <PageToolbar
          actions={{
            destructiveButton: { children: 'Delete' },
            primaryButton: { children: 'Confirm' },
            secondaryButton: { children: 'Cancel' },
          }}
          filter={<Input variant="search" placeholder="Search..." />}
          size="main"
          utilities={
            <>
              <Button
                icon={{ position: 'icon-only', src: PlusIcon }}
                title="Add"
              />
              <Button
                icon={{ position: 'icon-only', src: PlusIcon }}
                title="Edit"
              />
            </>
          }
        />,
      );

      expect(container.querySelector('input')).toBeInstanceOf(HTMLInputElement);
      expect(getByText('Delete')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText('Cancel')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText('Confirm')).toBeInstanceOf(HTMLButtonElement);

      const buttonGroups = container.querySelectorAll('.mzn-button-group');
      const utilityButtons = buttonGroups[1]?.querySelectorAll('button');

      expect(utilityButtons).toHaveLength(2);
    });
  });
});
