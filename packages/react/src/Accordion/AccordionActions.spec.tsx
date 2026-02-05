import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import AccordionActions from './AccordionActions';
import Button from '../Button';

describe('<AccordionActions />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<AccordionActions className={className} />),
  );

  it('should render with accordion__title__actions class', () => {
    const { getHostHTMLElement } = render(<AccordionActions />);

    const host = getHostHTMLElement();

    expect(host.classList.contains('mzn-accordion__title__actions')).toBe(true);
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(
      <AccordionActions>
        <Button>Action</Button>
      </AccordionActions>,
    );

    const host = getHostHTMLElement();
    const button = host.querySelector('.mzn-button');

    expect(button).toBeInstanceOf(HTMLElement);
    expect(button?.textContent).toBe('Action');
  });

  it('should render multiple children', () => {
    const { getHostHTMLElement } = render(
      <AccordionActions>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </AccordionActions>,
    );

    const host = getHostHTMLElement();
    const buttons = host.querySelectorAll('.mzn-button');

    expect(buttons.length).toBe(2);
    expect(buttons[0]?.textContent).toBe('Edit');
    expect(buttons[1]?.textContent).toBe('Delete');
  });

  it('should apply custom className', () => {
    const { getHostHTMLElement } = render(
      <AccordionActions className="custom-class">
        <Button>Action</Button>
      </AccordionActions>,
    );

    const host = getHostHTMLElement();

    expect(host.classList.contains('custom-class')).toBe(true);
    expect(host.classList.contains('mzn-accordion__title__actions')).toBe(true);
  });
});
