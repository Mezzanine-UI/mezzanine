import '@testing-library/jest-dom';
import { FormFieldSize } from '@mezzanine-ui/core/form';
import { createRef } from 'react';
import { cleanup, render } from '../../__test-utils__';
import ContentHeader from '../ContentHeader';
import { Filter, FilterArea, FilterLine } from '../FilterArea';
import { FormField } from '../Form';
import Input from '../Input';
import Tab, { TabItem } from '../Tab';
import Section from '.';

describe('<Section />', () => {
  afterEach(cleanup);

  it('should bind host class', () => {
    const { container } = render(<Section />);
    const element = container.firstElementChild;

    expect(element?.classList.contains('mzn-section')).toBeTruthy();
  });

  it('should render with custom className', () => {
    const { container } = render(<Section className="custom-class" />);
    const element = container.firstElementChild;

    expect(element?.classList.contains('mzn-section')).toBeTruthy();
    expect(element?.classList.contains('custom-class')).toBeTruthy();
  });

  it('should forward ref to host element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Section ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains('mzn-section')).toBeTruthy();
  });

  it('should render children', () => {
    const { getByText } = render(
      <Section>
        <div>Section Content</div>
      </Section>,
    );

    expect(getByText('Section Content')).toBeInTheDocument();
  });

  describe('contentHeader prop', () => {
    it('should render ContentHeader component', () => {
      const { getByText } = render(
        <Section contentHeader={<ContentHeader title="Test Title" />} />,
      );

      expect(getByText('Test Title')).toBeInTheDocument();
    });

    it('should pass size="sub" to ContentHeader', () => {
      const { container } = render(
        <Section contentHeader={<ContentHeader title="Test Title" />} />,
      );
      const contentHeader = container.querySelector('.mzn-content-header');

      expect(contentHeader?.classList.contains('mzn-content-header--sub')).toBeTruthy();
    });

    it('should warn when contentHeader is not a ContentHeader component', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Section contentHeader={<div>Invalid</div> as never} />);

      expect(warnSpy).toHaveBeenCalledWith(
        '[Section] The contentHeader prop only accepts a <ContentHeader /> component from @mezzanine-ui/react.',
      );

      warnSpy.mockRestore();
    });

    it('should not render invalid contentHeader', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      const { queryByText } = render(
        <Section contentHeader={<div>Invalid</div> as never} />,
      );

      expect(queryByText('Invalid')).not.toBeInTheDocument();
    });
  });

  describe('filterArea prop', () => {
    const mockFilterArea = (
      <FilterArea>
        <FilterLine>
          <Filter>
            <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
              <Input />
            </FormField>
          </Filter>
        </FilterLine>
      </FilterArea>
    );

    it('should render FilterArea component', () => {
      const { container } = render(
        <Section filterArea={mockFilterArea} />,
      );
      const filterArea = container.querySelector('.mzn-filter-area');

      expect(filterArea).toBeInTheDocument();
    });

    it('should pass size="sub" to FilterArea', () => {
      const { container } = render(
        <Section filterArea={mockFilterArea} />,
      );
      const filterArea = container.querySelector('.mzn-filter-area');

      expect(filterArea?.classList.contains('mzn-filter-area--sub')).toBeTruthy();
    });

    it('should warn when filterArea is not a FilterArea component', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Section filterArea={<div>Invalid</div> as never} />);

      expect(warnSpy).toHaveBeenCalledWith(
        '[Section] The filterArea prop only accepts a <FilterArea /> component from @mezzanine-ui/react.',
      );

      warnSpy.mockRestore();
    });

    it('should not render invalid filterArea', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      const { queryByText } = render(
        <Section filterArea={<div>Invalid</div> as never} />,
      );

      expect(queryByText('Invalid')).not.toBeInTheDocument();
    });
  });

  describe('tab prop', () => {
    it('should render Tab component', () => {
      const { container } = render(
        <Section
          tab={
            <Tab activeKey="tab1" onChange={() => {}}>
              <TabItem key="tab1">Tab 1</TabItem>
              <TabItem key="tab2">Tab 2</TabItem>
            </Tab>
          }
        />,
      );
      const tab = container.querySelector('.mzn-tab');

      expect(tab).toBeInTheDocument();
    });

    it('should warn when tab is not a Tab component', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Section tab={<div>Invalid</div> as never} />);

      expect(warnSpy).toHaveBeenCalledWith(
        '[Section] The tab prop only accepts a <Tab /> component from @mezzanine-ui/react.',
      );

      warnSpy.mockRestore();
    });

    it('should not render invalid tab', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      const { queryByText } = render(
        <Section tab={<div>Invalid</div> as never} />,
      );

      expect(queryByText('Invalid')).not.toBeInTheDocument();
    });
  });

  describe('combined props', () => {
    it('should render all sub-components together', () => {
      const { container, getByText } = render(
        <Section
          className="test-section"
          contentHeader={<ContentHeader title="Header Title" />}
          filterArea={
            <FilterArea>
              <FilterLine>
                <Filter>
                  <FormField label="Test" name="test" size={FormFieldSize.HORIZONTAL_BASE}>
                    <Input />
                  </FormField>
                </Filter>
              </FilterLine>
            </FilterArea>
          }
          tab={
            <Tab activeKey="tab1" onChange={() => {}}>
              <TabItem key="tab1">Tab 1</TabItem>
            </Tab>
          }
        >
          <div>Main Content</div>
        </Section>,
      );

      expect(container.querySelector('.mzn-section')).toBeInTheDocument();
      expect(container.querySelector('.mzn-content-header')).toBeInTheDocument();
      expect(container.querySelector('.mzn-filter-area')).toBeInTheDocument();
      expect(container.querySelector('.mzn-tab')).toBeInTheDocument();
      expect(getByText('Header Title')).toBeInTheDocument();
      expect(getByText('Main Content')).toBeInTheDocument();
    });
  });
});
