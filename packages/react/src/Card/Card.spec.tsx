import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Card, { CardActions } from '.';

describe('<Card />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Card ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Card className={className} />),
  );

  const testActions = <CardActions confirmText="OK" cancelText="Close" />;

  describe('prop: actions', () => {
    it('should render the actions if actions is not empty', () => {
      const { getHostHTMLElement } = render(
        <Card title="title" subtitle="subtitle" actions={testActions} />,
      );
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-card-actions')).toBeTruthy();
    });
  });

  describe('prop: title, subtitle', () => {
    it('should render the header if title and subtitle is not blank', () => {
      const { getHostHTMLElement } = render(
        <Card title="title" subtitle="subtitle" />,
      );
      const element = getHostHTMLElement();
      const header = element.querySelector('.mzn-card__metaContentsHeader');

      expect(header).toBeTruthy();
    });

    it('should render the title if title is not blank', () => {
      const { getHostHTMLElement } = render(<Card title="title" />);
      const element = getHostHTMLElement();
      const header = element.querySelector('.mzn-card__metaContentsHeader');

      expect(header?.childNodes).toBeTruthy();
      expect(header?.childNodes.length).toBe(1);
      expect(header?.childNodes[0].textContent).toBe('title');
    });
  });
  describe('prop: description', () => {
    it('should render the description if description is not blank', () => {
      const { getHostHTMLElement } = render(<Card description="description" />);
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-card__metaContents')).toBeTruthy();
    });
  });
});
