import {
  inlineMessageGroupClasses,
  inlineMessageGroupPrefix,
} from '@mezzanine-ui/core/inline-message';
import InlineMessage, { InlineMessageGroup } from '.';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

describe('<InlineMessageGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<InlineMessageGroup ref={ref} />),
  );

  describeHostElementClassNameAppendable(inlineMessageGroupPrefix, (className) =>
    render(<InlineMessageGroup className={className} />),
  );

  it('should render items via props', () => {
    const message = '這是一則測試訊息';

    const { getByText } = render(
      <InlineMessageGroup
        items={[
          {
            key: 'info',
            severity: 'info',
            content: message,
          },
        ]}
      />,
    );

    expect(getByText(message)).toBeInstanceOf(HTMLElement);
  });

  it('should trigger onItemClose when message closes', () => {
    const onItemClose = jest.fn();
    const onClose = jest.fn();

    const { getByRole } = render(
      <InlineMessageGroup
        onItemClose={onItemClose}
        items={[
          {
            key: 'info',
            severity: 'info',
            content: '資訊訊息',
            onClose,
          },
        ]}
      />,
    );

    fireEvent.click(getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onItemClose).toHaveBeenCalledTimes(1);
    expect(onItemClose).toHaveBeenCalledWith('info');
  });

  it('should accept custom children', () => {
    const { getHostHTMLElement } = render(
      <InlineMessageGroup>
        <InlineMessage severity="warning">自訂訊息</InlineMessage>
      </InlineMessageGroup>,
    );

    expect(
      getHostHTMLElement().classList.contains(inlineMessageGroupClasses.host),
    ).toBeTruthy();
  });

  it('should apply type modifier class', () => {
    const { getHostHTMLElement: getMessageHost } = render(
      <InlineMessageGroup type="message" />,
    );

    expect(
      getMessageHost().classList.contains(
        inlineMessageGroupClasses.type('message'),
      ),
    ).toBeTruthy();

    const { getHostHTMLElement: getFormHost } = render(
      <InlineMessageGroup type="form" />,
    );

    expect(
      getFormHost().classList.contains(inlineMessageGroupClasses.type('form')),
    ).toBeTruthy();
  });
});

