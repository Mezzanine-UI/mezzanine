import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormGroup } from '.';

describe('<FormGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<FormGroup ref={ref} title="Test Group" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<FormGroup className={className} title="Test Group" />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<FormGroup title="Test Group" />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-form-group')).toBeTruthy();
  });

  describe('prop: title', () => {
    it('should render title text', () => {
      const { container } = render(<FormGroup title="Test Group Title" />);
      const titleElement = container.querySelector('.mzn-form-group__title');

      expect(titleElement).toBeTruthy();
      expect(titleElement?.textContent).toBe('Test Group Title');
    });
  });

  describe('prop: fieldsContainerClassName', () => {
    it('should apply custom className to fields container', () => {
      const { container } = render(
        <FormGroup
          fieldsContainerClassName="custom-container"
          title="Test Group"
        />,
      );
      const fieldsContainer = container.querySelector(
        '.mzn-form-group__fields-container',
      );

      expect(fieldsContainer).toBeTruthy();
      expect(
        fieldsContainer?.classList.contains('custom-container'),
      ).toBeTruthy();
    });
  });

  describe('prop: children', () => {
    it('should render children inside fields container', () => {
      const { container } = render(
        <FormGroup title="Test Group">
          <div className="test-child">Child 1</div>
          <div className="test-child">Child 2</div>
        </FormGroup>,
      );
      const fieldsContainer = container.querySelector(
        '.mzn-form-group__fields-container',
      );
      const children = fieldsContainer?.querySelectorAll('.test-child');

      expect(fieldsContainer).toBeTruthy();
      expect(children?.length).toBe(2);
      expect(children?.[0].textContent).toBe('Child 1');
      expect(children?.[1].textContent).toBe('Child 2');
    });
  });
});
