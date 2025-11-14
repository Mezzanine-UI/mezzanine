import { tagClasses as classes } from '@mezzanine-ui/core/tag';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Tag, { TagSize } from '.';

describe('<Tag />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<Tag label="Label" ref={ref} type="static" />),
  );

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<Tag label="Add" onAdd={() => {}} ref={ref} type="addable" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Tag className={className} label="Label" type="static" />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Tag label="Label" type="static" />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.host)).toBeTruthy();
  });

  describe('prop: size', () => {
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(
        <Tag label="Label" type="static" />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(classes.size('main'))).toBeTruthy();
    });

    const sizes: TagSize[] = ['main', 'sub'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(
          <Tag label="Label" size={size} type="static" />,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains(classes.size(size))).toBeTruthy();
      });
    });
  });

  describe('type: static', () => {
    it('should render the label inside span', () => {
      const { getByText } = render(<Tag label="Hello" type="static" />);
      const labelElement = getByText('Hello');

      expect(labelElement.tagName.toLowerCase()).toBe('span');
      expect(labelElement.classList.contains(classes.label)).toBeTruthy();
    });
  });

  describe('type: counter', () => {
    it('should render label and badge count', () => {
      const count = 8;
      const { getHostHTMLElement, getByText } = render(
        <Tag count={count} label="Inbox" type="counter" />,
      );
      const element = getHostHTMLElement();
      const labelElement = getByText('Inbox');
      const badgeElement = element.querySelector('.mzn-badge');

      expect(labelElement.classList.contains(classes.label)).toBeTruthy();
      expect(badgeElement).toBeTruthy();
      expect(badgeElement!.textContent).toBe(`${count}`);
    });
  });

  describe('type: overflow-counter', () => {
    it('should render plus icon and count label', () => {
      const { getHostHTMLElement, getByText } = render(
        <Tag count={5} type="overflow-counter" />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(`.${classes.icon}`);
      const labelElement = getByText('5');

      expect(iconElement).toBeTruthy();
      expect(labelElement.classList.contains(classes.label)).toBeTruthy();
    });
  });

  describe('type: dismissable', () => {
    it('should render label and close button', () => {
      const { getByRole, getByText } = render(
        <Tag label="Closable" onClose={jest.fn()} type="dismissable" />,
      );
      const labelElement = getByText('Closable');
      const closeButton = getByRole('button', { name: 'Dismiss tag' });

      expect(labelElement.classList.contains(classes.label)).toBeTruthy();
      expect(closeButton.querySelector(`.${classes.icon}`)).toBeTruthy();
    });

    it('should fire onClose when close button clicked', () => {
      const onClose = jest.fn();
      const { getByRole } = render(
        <Tag label="Closable" onClose={onClose} type="dismissable" />,
      );
      const closeButton = getByRole('button', { name: 'Dismiss tag' });

      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not fire onClose when disabled', () => {
      const onClose = jest.fn();
      const { getByRole, getHostHTMLElement } = render(
        <Tag disabled label="Closable" onClose={onClose} type="dismissable" />,
      );
      const element = getHostHTMLElement();
      const closeButton = getByRole('button', { name: 'Dismiss tag' });

      expect(element.getAttribute('aria-disabled')).toBe('true');
      expect(element.classList.contains(classes.disabled)).toBeTruthy();
      expect(closeButton.hasAttribute('disabled')).toBeTruthy();

      fireEvent.click(closeButton);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should mark close button as readOnly', () => {
      const onClose = jest.fn();
      const { getByRole, getHostHTMLElement } = render(
        <Tag label="Closable" onClose={onClose} readOnly type="dismissable" />,
      );
      const element = getHostHTMLElement();
      const closeButton = getByRole('button', { name: 'Dismiss tag' });

      expect(element.classList.contains(classes.readOnly)).toBeTruthy();
      expect(closeButton.hasAttribute('disabled')).toBeTruthy();
    });
  });

  describe('type: addable', () => {
    it('should render button host with label and plus icon', () => {
      const { getHostHTMLElement, getByText } = render(
        <Tag label="Add" type="addable" />,
      );
      const element = getHostHTMLElement();
      const labelElement = getByText('Add');

      expect(element.tagName.toLowerCase()).toBe('button');
      expect(element.getAttribute('type')).toBe('button');
      expect(element.querySelector(`.${classes.icon}`)).toBeTruthy();
      expect(labelElement.classList.contains(classes.label)).toBeTruthy();
    });

    it('should fire onAdd when clicked', () => {
      const onAdd = jest.fn();
      const { getHostHTMLElement } = render(
        <Tag label="Add" onAdd={onAdd} type="addable" />,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('should prevent click when disabled', () => {
      const onAdd = jest.fn();
      const { getHostHTMLElement } = render(
        <Tag disabled label="Add" onAdd={onAdd} type="addable" />,
      );
      const element = getHostHTMLElement();

      expect(element.hasAttribute('disabled')).toBeTruthy();
      expect(element.classList.contains(classes.disabled)).toBeTruthy();

      fireEvent.click(element);

      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe('prop: active', () => {
    it('should append active class on addable tags', () => {
      const { getHostHTMLElement } = render(
        <Tag active label="Add" type="addable" />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(classes.active)).toBeTruthy();
    });

    it('should append active class on dismissable tags', () => {
      const { getHostHTMLElement } = render(
        <Tag active label="Closable" onClose={jest.fn()} type="dismissable" />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(classes.active)).toBeTruthy();
    });
  });
});
