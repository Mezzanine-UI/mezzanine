import { ChevronDownIcon } from '@mezzanine-ui/icons';
import {
  cleanupHook,
  render,
  fireEvent,
  act,
} from '../../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../../__test-utils__/common';
import TableExpandable from './TableExpandable';

describe('<TableExpandable />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TableExpandable ref={ref} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TableExpandable />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__collapseAction')).toBeTruthy();
  });

  it('should display toggle icon as default', () => {
    const { getHostHTMLElement } = render(<TableExpandable />);
    const element = getHostHTMLElement();
    const icon = element.querySelector('.mzn-icon');

    expect(icon?.getAttribute('data-icon-name')).toBe(ChevronDownIcon.name);
  });

  describe('prop: showIcon', () => {
    it('should not display icon when falsy', () => {
      const { getHostHTMLElement } = render(
        <TableExpandable
          showIcon={false}
        />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-icon');

      expect(icon).toBe(null);
    });
  });

  describe('prop: expanded/setExpanded', () => {
    it('change expanded state when onClick', async () => {
      let expanded = false;

      const setExpanded = jest.fn<void, [boolean]>((value) => {
        expanded = value;
      });

      const { getHostHTMLElement } = render(
        <TableExpandable
          expanded={expanded}
          setExpanded={setExpanded}
        />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-icon');

      await act(async () => {
        fireEvent.click(icon!);
      });

      expect(expanded).toBe(true);
    });

    it('expanded remain falsy when setExpanded is not provided', async () => {
      const expanded = false;

      const { getHostHTMLElement } = render(
        <TableExpandable
          expanded={expanded}
        />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-icon');

      await act(async () => {
        fireEvent.click(icon!);
      });

      expect(expanded).toBe(false);
    });

    it('should rotate icon when expanded', () => {
      const { getHostHTMLElement } = render(
        <TableExpandable expanded />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-icon');

      const transformMatch = icon?.getAttribute('style')?.match(/rotate\(180deg\)/);

      expect(transformMatch).not.toBe(null);
    });
  });

  describe('prop: expandable', () => {
    let icon: HTMLElement;
    let expanded = false;

    const setExpanded = jest.fn<void, [boolean]>((value) => {
      expanded = value;
    });

    beforeEach(() => {
      expanded = false;

      const { getHostHTMLElement } = render(
        <TableExpandable
          expanded={expanded}
          expandable={false}
          setExpanded={setExpanded}
        />,
      );
      const element = getHostHTMLElement();

      icon = (element.querySelector('.mzn-icon') as HTMLElement);
    });

    it('should use disabled style when falsy', () => {
      const colorMatch = icon?.getAttribute('style')?.match(/--mzn-color-action-disabled/);

      expect(colorMatch).not.toBe(null);
    });

    it('should not clickable when falsy', async () => {
      await act(async () => {
        fireEvent.click(icon);
      });

      expect(expanded).toBe(false);
    });
  });
});
