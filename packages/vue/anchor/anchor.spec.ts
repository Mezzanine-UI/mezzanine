import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { anchorClasses } from '@mezzanine-ui/core/anchor';
import MznAnchor from './anchor.vue';
import MznAnchorGroup from './anchor-group.vue';
import type { AnchorItemData } from './anchor-item.types';

const anchors: AnchorItemData[] = [
  { href: '#one', id: 'one', name: 'One' },
  {
    children: [
      {
        children: [{ href: '#two-a-i', id: 'two-a-i', name: 'Two A I' }],
        href: '#two-a',
        id: 'two-a',
        name: 'Two A',
      },
    ],
    href: '#two',
    id: 'two',
    name: 'Two',
  },
];

describe('MznAnchorGroup', () => {
  it('should render the anchors passed as data', () => {
    const wrapper = mount(MznAnchorGroup, { props: { anchors } });

    expect(wrapper.classes()).toContain(anchorClasses.host);
    expect(wrapper.findAll('a')).toHaveLength(4);
    expect(wrapper.findAll('a')[0].attributes('href')).toBe('#one');
  });

  it('should parse anchors from child components', () => {
    const wrapper = mount(MznAnchorGroup, {
      slots: {
        default: () => [
          h(MznAnchor, { href: '#a', title: 'A' }, () => 'Section A'),
          h(MznAnchor, { href: '#b', title: 'B' }, () => 'Section B'),
        ],
      },
    });
    const links = wrapper.findAll('a');

    expect(links).toHaveLength(2);
    expect(links[0].attributes('href')).toBe('#a');
    expect(links[0].attributes('title')).toBe('A');
    expect(links[0].text()).toBe('Section A');
  });

  it('should ignore a child that is not an anchor', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(MznAnchorGroup, {
      slots: { default: () => [h('span', 'nope')] },
    });

    expect(wrapper.findAll('a')).toHaveLength(0);
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });

  it('should drop an anchor child without an href', () => {
    const wrapper = mount(MznAnchorGroup, {
      slots: { default: () => [h(MznAnchor, {}, () => 'no href')] },
    });

    expect(wrapper.findAll('a')).toHaveLength(0);
  });
});

describe('MznAnchor nesting', () => {
  it('should stop nesting beyond three levels', () => {
    const deep: AnchorItemData[] = [
      {
        children: [
          {
            children: [
              {
                children: [{ href: '#l4', id: 'l4', name: 'Level 4' }],
                href: '#l3',
                id: 'l3',
                name: 'Level 3',
              },
            ],
            href: '#l2',
            id: 'l2',
            name: 'Level 2',
          },
        ],
        href: '#l1',
        id: 'l1',
        name: 'Level 1',
      },
    ];
    const wrapper = mount(MznAnchorGroup, { props: { anchors: deep } });
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'));

    expect(hrefs).toEqual(['#l1', '#l2', '#l3']);
  });

  it('should propagate disabled to descendants', () => {
    const wrapper = mount(MznAnchorGroup, {
      props: {
        anchors: [
          {
            children: [{ href: '#kid', id: 'kid', name: 'Kid' }],
            disabled: true,
            href: '#parent',
            id: 'parent',
            name: 'Parent',
          },
        ],
      },
    });

    for (const link of wrapper.findAll('a')) {
      expect(link.classes()).toContain(anchorClasses.anchorItemDisabled);
      expect(link.attributes('aria-disabled')).toBe('true');
      expect(link.attributes('tabindex')).toBe('-1');
    }
  });
});

describe('MznAnchor interaction', () => {
  beforeEach(() => {
    window.history.pushState(null, '', window.location.pathname);
  });

  it('should mark the item matching the current hash as active', async () => {
    window.history.pushState(null, '', '#one');

    const wrapper = mount(MznAnchorGroup, { props: { anchors } });

    expect(wrapper.findAll('a')[0].classes()).toContain(
      anchorClasses.anchorItemActive,
    );
  });

  it('should update the hash and invoke onClick', async () => {
    const onClick = vi.fn();
    const wrapper = mount(MznAnchorGroup, {
      props: { anchors: [{ href: '#target', id: 't', name: 'T', onClick }] },
    });

    await wrapper.find('a').trigger('click');

    expect(window.location.hash).toBe('#target');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not navigate or call onClick when disabled', async () => {
    const onClick = vi.fn();
    const wrapper = mount(MznAnchorGroup, {
      props: {
        anchors: [
          { disabled: true, href: '#nope', id: 'n', name: 'N', onClick },
        ],
      },
    });

    await wrapper.find('a').trigger('click');

    expect(window.location.hash).toBe('');
    expect(onClick).not.toHaveBeenCalled();
  });
});
