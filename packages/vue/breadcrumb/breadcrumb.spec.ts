import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import {
  breadcrumbClasses,
  breadcrumbItemClasses,
  breadcrumbOverflowMenuItemClasses,
} from '@mezzanine-ui/core/breadcrumb';
import { resetPortals } from '../portal/portal-registry';
import MznBreadcrumbItem from './breadcrumb-item.vue';
import MznBreadcrumb from './breadcrumb.vue';
import type { BreadcrumbItemProps } from './breadcrumb-item.types';

const items = (count: number): BreadcrumbItemProps[] =>
  Array.from({ length: count }, (_, index) => ({
    href: `/${index}`,
    id: `item-${index}`,
    name: `Item ${index}`,
  }));

const render = (props: Record<string, unknown> = {}, slot?: () => unknown) =>
  mount(MznBreadcrumb, {
    attachTo: document.body,
    props,
    slots: slot ? { default: slot } : undefined,
  });

const names = (wrapper: ReturnType<typeof render>): string[] =>
  wrapper.findAll(`.${breadcrumbItemClasses.host}`).map((item) => item.text());

describe('<MznBreadcrumb />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPortals();
  });

  it('should render a labelled nav', () => {
    const wrapper = render({ items: items(2) });

    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.attributes('aria-label')).toBe('Breadcrumb');
    expect(wrapper.classes()).toContain(breadcrumbClasses.host);
  });

  it('should separate the items and mark the last one as current', () => {
    const wrapper = render({ items: items(3) });

    expect(names(wrapper)).toEqual(['Item 0', 'Item 1', 'Item 2']);
    expect(wrapper.findAll('.mzn-icon')).toHaveLength(2);
    expect(
      wrapper
        .findAll(`.${breadcrumbItemClasses.host}`)
        .map((item) => item.classes().includes(breadcrumbItemClasses.current)),
    ).toEqual([false, false, true]);
  });

  it('should keep four items whole', () => {
    const wrapper = render({ items: items(4) });

    expect(names(wrapper)).toEqual(['Item 0', 'Item 1', 'Item 2', 'Item 3']);
    expect(wrapper.find(`.${breadcrumbClasses.iconButton}`).exists()).toBe(
      false,
    );
  });

  it('should collapse the middle past four items', () => {
    const wrapper = render({ items: items(6) });

    expect(names(wrapper)).toEqual(['Item 0', 'Item 1', 'Item 4', 'Item 5']);
    expect(wrapper.find(`.${breadcrumbClasses.iconButton}`).exists()).toBe(
      true,
    );
    expect(
      wrapper
        .findAll(`.${breadcrumbItemClasses.host}`)
        .map((item) => item.classes().includes(breadcrumbItemClasses.current)),
    ).toEqual([false, false, false, true]);
  });

  describe('prop: condensed', () => {
    it('should keep only the last two items', () => {
      const wrapper = render({ condensed: true, items: items(4) });

      expect(names(wrapper)).toEqual(['Item 2', 'Item 3']);
      expect(wrapper.find(`.${breadcrumbClasses.iconButton}`).exists()).toBe(
        true,
      );
    });

    it('should drop the overflow button at two items', () => {
      const wrapper = render({ condensed: true, items: items(2) });

      expect(names(wrapper)).toEqual(['Item 0', 'Item 1']);
      expect(wrapper.find(`.${breadcrumbClasses.iconButton}`).exists()).toBe(
        false,
      );
    });
  });

  it('should take its items from the slot as well', () => {
    const wrapper = render({}, () => [
      h(MznBreadcrumbItem, { href: '/', name: 'Home' }),
      h(MznBreadcrumbItem, { href: '/list', name: 'List' }),
      h(MznBreadcrumbItem, { name: 'Detail' }),
    ]);

    expect(names(wrapper)).toEqual(['Home', 'List', 'Detail']);
    expect(
      wrapper.findAll(`.${breadcrumbItemClasses.host}`)[2].classes(),
    ).toContain(breadcrumbItemClasses.current);
  });

  it('should open the collapsed items from the overflow button', async () => {
    const wrapper = render({ items: items(6) });

    await wrapper.get(`.${breadcrumbClasses.iconButton}`).trigger('click');
    await nextTick();

    expect(
      document.body.querySelectorAll(
        `.${breadcrumbOverflowMenuItemClasses.host}`,
      ),
    ).toHaveLength(2);
  });
});

describe('<MznBreadcrumbItem />', () => {
  const mountItem = (
    props: BreadcrumbItemProps,
    listeners: Record<string, unknown> = {},
  ) => mount(MznBreadcrumbItem, { props: { ...props, ...listeners } });

  it('should render a link when it has an href and is not current', () => {
    const wrapper = mountItem({ href: '/', name: 'Home' });
    const trigger = wrapper.get(`.${breadcrumbItemClasses.trigger}`);

    expect(trigger.element.tagName).toBe('A');
    expect(trigger.attributes('href')).toBe('/');
  });

  it('should fall back to a span for the current item', () => {
    const wrapper = mountItem({ current: true, href: '/', name: 'Home' });

    expect(
      wrapper.get(`.${breadcrumbItemClasses.trigger}`).element.tagName,
    ).toBe('SPAN');
    expect(wrapper.classes()).toContain(breadcrumbItemClasses.current);
  });

  it('should render a link for a clickable item without an href', async () => {
    const onClick = vi.fn();
    const wrapper = mountItem({ name: 'Home' }, { onClick });
    const trigger = wrapper.get(`.${breadcrumbItemClasses.trigger}`);

    expect(trigger.element.tagName).toBe('A');

    await trigger.trigger('click');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should honour an explicit component', () => {
    const wrapper = mountItem({ component: 'span', href: '/', name: 'Home' });

    expect(
      wrapper.get(`.${breadcrumbItemClasses.trigger}`).element.tagName,
    ).toBe('SPAN');
  });

  it('should put the id on the host, the way React spreads it', () => {
    const wrapper = mountItem({ id: 'home', name: 'Home' });

    expect(wrapper.attributes('id')).toBe('home');
  });

  it('should become a dropdown once it has options', () => {
    const wrapper = mountItem({
      name: 'Tab',
      options: [{ id: 'a', name: 'A' }],
    });

    expect(
      wrapper.get(`.${breadcrumbItemClasses.trigger}`).element.tagName,
    ).toBe('BUTTON');
    expect(wrapper.find(`.${breadcrumbItemClasses.icon}`).exists()).toBe(true);
  });
});
