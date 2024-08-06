import { InfoCircleFilledIcon } from '@mezzanine-ui/icons';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import { FormField, FormLabel } from '.';

describe('<FormLabel />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLabelElement, (ref) =>
    render(<FormLabel ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<FormLabel className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<FormLabel>Hello</FormLabel>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-form-field__label')).toBeTruthy();
  });

  it('should render the text and wrap it by span', () => {
    const { getHostHTMLElement } = render(<FormLabel>Hello</FormLabel>);
    const element = getHostHTMLElement();
    const { firstElementChild: spanElement } = element;

    expect(spanElement!.textContent).toBe('Hello');
    expect(spanElement!.tagName.toLowerCase()).toBe('span');
  });

  describe('prop: remark,remarkIcon', () => {
    it('should not render span if both remark and remarkIcon not passed', () => {
      const { getHostHTMLElement } = render(<FormLabel>Hello</FormLabel>);
      const element = getHostHTMLElement();
      const { lastElementChild: notRemarkElement } = element;

      expect(
        notRemarkElement!.classList.contains('mzn-form-field__remark'),
      ).toBeFalsy();
    });

    it('should render remark by span at first child of remark span', () => {
      const { getHostHTMLElement } = render(
        <FormLabel remark="remark">Hello</FormLabel>,
      );
      const element = getHostHTMLElement();
      const { lastElementChild: remarkElement } = element;
      const { firstElementChild: remarkSpanElement } = remarkElement!;

      expect(
        remarkElement!.classList.contains('mzn-form-field__remark'),
      ).toBeTruthy();
      expect(remarkSpanElement!.tagName.toLowerCase()).toBe('span');
      expect(remarkSpanElement!.textContent).toBe('remark');
    });

    it('should render remark icon at last child of remark span', () => {
      const { getHostHTMLElement } = render(
        <FormLabel remarkIcon={<Icon icon={InfoCircleFilledIcon} />}>
          Hello
        </FormLabel>,
      );
      const element = getHostHTMLElement();
      const { lastElementChild: remarkElement } = element;
      const { lastElementChild: remarkIconElement } = remarkElement!;

      expect(
        remarkElement!.classList.contains('mzn-form-field__remark'),
      ).toBeTruthy();
      expect(remarkIconElement!.tagName.toLowerCase()).toBe('i');
      expect(remarkIconElement!.getAttribute('data-icon-name')).toBe(
        InfoCircleFilledIcon.name,
      );
    });
  });

  describe('form: required', () => {
    [false, true].forEach((required) => {
      const message = required
        ? 'should render asterisk if required=true'
        : 'should not render asterisk if required=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <FormField required={required}>
            <FormLabel>Hello</FormLabel>
          </FormField>,
        );
        const element = getHostHTMLElement();
        const labelElement = element.querySelector('.mzn-form-field__label')!;
        const asteriskElement =
          labelElement.firstElementChild!.lastElementChild;

        if (required) {
          expect(asteriskElement!.tagName.toLowerCase()).toBe('span');
          expect(asteriskElement!.textContent).toBe('*');
          expect(
            asteriskElement!.classList.contains('mzn-form-field__asterisk'),
          ).toBeTruthy();
        } else {
          expect(asteriskElement).toBeNull();
        }
      });
    });
  });
});
