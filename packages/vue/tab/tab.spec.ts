import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { tabClasses } from '@mezzanine-ui/core/tab';
import { FolderIcon } from '@mezzanine-ui/icons';
import MznTab from './tab.vue';
import MznTabItem from './tab-item.vue';
import type { TabProps } from './tab.types';

const items = (count: number, keyed = true) =>
  Array.from({ length: count }, (_, i) =>
    h(MznTabItem, keyed ? { key: String(i) } : {}, () => `Tab ${i + 1}`),
  );

const mountTab = (props: TabProps = {}, count = 3, keyed = true) =>
  mount(MznTab, { props, slots: { default: () => items(count, keyed) } });

describe('MznTab', () => {
  it('should render the host, the items and the active bar', () => {
    const wrapper = mountTab({ defaultActiveKey: '0' });

    expect(wrapper.classes()).toContain(tabClasses.host);
    expect(wrapper.findAll('button')).toHaveLength(3);
    expect(wrapper.find(`.${tabClasses.tabActiveBar}`).exists()).toBe(true);
  });

  it.each([
    ['horizontal', tabClasses.tabHorizontal],
    ['vertical', tabClasses.tabVertical],
  ] as const)('applies the %s direction class', (direction, expected) => {
    expect(mountTab({ direction }).classes()).toContain(expected);
  });

  it.each([
    ['main', tabClasses.tabSizeMain],
    ['sub', tabClasses.tabSizeSub],
  ] as const)('applies the %s size class', (size, expected) => {
    expect(mountTab({ size }).classes()).toContain(expected);
  });

  describe('active item', () => {
    it('should mark the item whose key matches activeKey', () => {
      const wrapper = mountTab({ activeKey: '1' });
      const buttons = wrapper.findAll('button');

      expect(buttons[0].classes()).not.toContain(tabClasses.tabItemActive);
      expect(buttons[1].classes()).toContain(tabClasses.tabItemActive);
    });

    it('should fall back to defaultActiveKey when uncontrolled', () => {
      const wrapper = mountTab({ defaultActiveKey: '2' });

      expect(wrapper.findAll('button')[2].classes()).toContain(
        tabClasses.tabItemActive,
      );
    });

    it('should leave nothing active when the items carry no keys', () => {
      // Mirrors React: `flattenChildren` names unkeyed children `.0`, `.1`, …
      // so none of them can equal the numeric `defaultActiveKey` of 0.
      const wrapper = mountTab({}, 3, false);

      expect(wrapper.findAll(`.${tabClasses.tabItemActive}`)).toHaveLength(0);
    });
  });

  describe('change', () => {
    it('should emit the key and index when a different item is clicked', async () => {
      const wrapper = mountTab({ activeKey: '0' });

      await wrapper.findAll('button')[2].trigger('click');

      expect(wrapper.emitted('change')).toEqual([['2', 2]]);
    });

    it('should not emit when the active item is clicked', async () => {
      const wrapper = mountTab({ activeKey: '0' });

      await wrapper.findAll('button')[0].trigger('click');

      expect(wrapper.emitted('change')).toBeUndefined();
    });

    it('should move the selection when uncontrolled', async () => {
      const wrapper = mountTab({ defaultActiveKey: '0' });

      await wrapper.findAll('button')[1].trigger('click');

      expect(wrapper.findAll('button')[1].classes()).toContain(
        tabClasses.tabItemActive,
      );
    });
  });
});

describe('MznTabItem', () => {
  it('should render a disabled button that announces itself', () => {
    const wrapper = mount(MznTabItem, { props: { disabled: true } });

    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');
  });

  it('should apply the error class', () => {
    const wrapper = mount(MznTabItem, { props: { error: true } });

    expect(wrapper.classes()).toContain(tabClasses.tabItemError);
  });

  it('should render the icon when given', () => {
    const wrapper = mount(MznTabItem, { props: { icon: FolderIcon } });
    const icon = wrapper.find('i');

    expect(icon.attributes('data-icon-name')).toBe(FolderIcon.name);
    expect(icon.classes()).toContain(tabClasses.tabItemIcon);
  });

  it('should only render the badge when badgeCount is given', () => {
    expect(mount(MznTabItem).find('.mzn-badge').exists()).toBe(false);
    expect(
      mount(MznTabItem, { props: { badgeCount: 0 } })
        .find('.mzn-badge')
        .exists(),
    ).toBe(true);
  });

  it.each([
    [{ error: true }, 'mzn-badge--count-alert'],
    [{}, 'mzn-badge--count-inactive'],
  ])('picks the badge variant from state', (props, expected) => {
    const wrapper = mount(MznTabItem, { props: { badgeCount: 9, ...props } });

    expect(wrapper.find('.mzn-badge').classes()).toContain(expected);
  });
});
