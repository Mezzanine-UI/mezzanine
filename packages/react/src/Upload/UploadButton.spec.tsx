import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { UploadButton } from '.';

describe('<UploadButton />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<UploadButton ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<UploadButton className={className} />),
  );

  it('should click input while button clicked', () => {
    const onClick = jest.fn();
    const onInputClick = jest.fn();
    const { getHostHTMLElement } = render(<UploadButton onClick={onClick} />);
    const element = getHostHTMLElement();
    const inputElement = element.querySelector('input');

    inputElement!.addEventListener('click', onInputClick);
    fireEvent.click(element);

    expect(onInputClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
