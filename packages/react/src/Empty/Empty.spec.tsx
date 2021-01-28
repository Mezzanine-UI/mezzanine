import { createElement } from 'react';
import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Empty from '.';

describe('<Empty />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<Empty ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Empty className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Empty>No Data</Empty>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-empty')).toBeTruthy();
  });

  it('should render the text and wrap it by description rendered by div', () => {
    const { getHostHTMLElement, getByText } = render(<Empty>No Data</Empty>);
    const element = getHostHTMLElement();
    const descriptionElement = getByText('No Data');

    expect(element.textContent).toBe('No Data');
    expect(descriptionElement.textContent).toBe('No Data');
    expect(descriptionElement.tagName.toLowerCase()).toBe('div');
  });

  describe('prop: fullHeight', () => {
    it('should contain mzn-empty--full-height class if fullHeight=true', () => {
      const { getHostHTMLElement } = render(<Empty fullHeight>No Data</Empty>);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-empty--full-height')).toBeTruthy();
    });
  });

  describe('prop: image', () => {
    it('should render default icon if none image provided', () => {
      const { getHostHTMLElement } = render(<Empty>No Data</Empty>);
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-empty__icon')).toBeInstanceOf(Node);
    });

    it('should render passed in image if provided', () => {
      const image = createElement(
        'div',
        {
          id: 'empty-test-image-prop',
        },
      );

      const { getHostHTMLElement } = render(<Empty image={image}>No Data</Empty>);
      const element = getHostHTMLElement();
      const imageNode = element.querySelector('#empty-test-image-prop');

      expect(imageNode).toBeInstanceOf(Node);
    });
  });

  describe('prop: title', () => {
    it('should render the text and wrap it by title rendered by div', () => {
      const { getByText } = render(<Empty title="title">No Data</Empty>);
      const titleElement = getByText('title');

      expect(titleElement.textContent).toBe('title');
      expect(titleElement.tagName.toLowerCase()).toBe('div');
      expect(titleElement.classList.contains('mzn-empty__title')).toBeTruthy();
    });
  });
});
