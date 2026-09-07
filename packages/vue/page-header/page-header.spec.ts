import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { breadcrumbClasses } from '@mezzanine-ui/core/breadcrumb';
import { contentHeaderClasses } from '@mezzanine-ui/core/content-header';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';
import MznBreadcrumbItem from '../breadcrumb/breadcrumb-item.vue';
import MznBreadcrumb from '../breadcrumb/breadcrumb.vue';
import MznContentHeader from '../content-header/content-header.vue';
import MznTypography from '../typography/typography.vue';
import MznPageHeader from './page-header.vue';

const breadcrumb = () =>
  h(MznBreadcrumb, null, () => [
    h(MznBreadcrumbItem, { href: '/', name: 'Home' }),
  ]);

const contentHeader = (props: Record<string, unknown> = {}) =>
  h(MznContentHeader, { title: 'Page Title', ...props });

const render = (children: unknown[]) =>
  mount(MznPageHeader, { slots: { default: () => children } });

describe('<MznPageHeader />', () => {
  it('should render a header holding the breadcrumb and the content header', () => {
    const wrapper = render([breadcrumb(), contentHeader()]);

    expect(wrapper.element.tagName).toBe('HEADER');
    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.find(`.${breadcrumbClasses.host}`).exists()).toBe(true);
    expect(wrapper.find(`.${contentHeaderClasses.host}`).exists()).toBe(true);
  });

  it('should force the content header to the main size', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = render([contentHeader({ size: 'sub' })]);

    expect(wrapper.get(`.${contentHeaderClasses.host}`).classes()).toContain(
      contentHeaderClasses.size('main'),
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('size prop will be overridden'),
    );

    warn.mockRestore();
  });

  it('should not warn about a content header that already asks for main', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render([contentHeader({ size: 'main' })]);

    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it('should warn about a second breadcrumb or content header', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render([breadcrumb(), breadcrumb(), contentHeader(), contentHeader()]);

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('only accepts one Breadcrumb'),
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('only accepts one ContentHeader'),
    );

    warn.mockRestore();
  });

  it('should warn about a child it does not recognise', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = render([
      contentHeader(),
      h(MznTypography, null, () => '不該出現'),
    ]);

    expect(wrapper.text()).not.toContain('不該出現');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('only accepts Breadcrumb or ContentHeader'),
    );

    warn.mockRestore();
  });

  it('should report a missing content header as an error', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render([breadcrumb()]);

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('requires a ContentHeader'),
    );

    error.mockRestore();
  });
});
