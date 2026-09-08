import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { buttonClasses } from '@mezzanine-ui/core/button';
import { contentHeaderClasses as classes } from '@mezzanine-ui/core/content-header';
import { DotHorizontalIcon, PlusIcon } from '@mezzanine-ui/icons';
import MznButton from '../button/button.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznInput from '../input/input.vue';
import MznToggle from '../toggle/toggle.vue';
import { resetPortals } from '../portal/portal-registry';
import MznContentHeaderResponsive from './content-header-responsive.vue';
import MznContentHeader from './content-header.vue';
import type { ContentHeaderProps } from './content-header.types';

const render = (
  props: Partial<ContentHeaderProps> = {},
  slot?: () => unknown,
  listeners: Record<string, unknown> = {},
) =>
  mount(MznContentHeader, {
    attachTo: document.body,
    props: { title: 'Title', ...props, ...listeners } as ContentHeaderProps,
    slots: slot ? { default: slot } : undefined,
  });

const actionLabels = (wrapper: ReturnType<typeof render>): string[] =>
  wrapper
    .get(`.${classes.actionArea}`)
    .findAll('.mzn-button-group button')
    .map((button) => button.text());

describe('<MznContentHeader />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPortals();
  });

  it('should render the title and the size class', () => {
    const wrapper = render({ description: 'Description' });

    expect(wrapper.element.tagName).toBe('HEADER');
    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.classes()).toContain(classes.size('main'));
    expect(wrapper.get(`.${classes.textGroup}`).text()).toContain('Title');
    expect(wrapper.get(`.${classes.textGroup}`).text()).toContain(
      'Description',
    );
  });

  it('should pick the title element from the size', () => {
    expect(render().get(`.${classes.textGroup} > *`).element.tagName).toBe(
      'H1',
    );
    expect(
      render({ size: 'sub' }).get(`.${classes.textGroup} > *`).element.tagName,
    ).toBe('H2');
    expect(
      render({ titleComponent: 'p' }).get(`.${classes.textGroup} > *`).element
        .tagName,
    ).toBe('P');
  });

  describe('the back button', () => {
    it('should render one when someone listens for back-click', async () => {
      const onBackClick = vi.fn();
      const wrapper = render({}, undefined, { onBackClick });

      await wrapper.get(`.${classes.backButton} button`).trigger('click');

      expect(onBackClick).toHaveBeenCalledTimes(1);
    });

    it('should take a link from the slot', () => {
      const wrapper = render({}, () => h('a', { href: '/back' }));
      const link = wrapper.get(`.${classes.backButton} a`);

      expect(link.attributes('href')).toBe('/back');
      expect(link.find(`.${buttonClasses.host}`).exists()).toBe(true);
    });

    it('should let the listener win over the link', () => {
      const wrapper = render({}, () => h('a', { href: '/back' }), {
        onBackClick: () => {},
      });

      expect(wrapper.find(`.${classes.backButton} a`).exists()).toBe(false);
      expect(wrapper.find(`.${classes.backButton} button`).exists()).toBe(true);
    });

    it('should drop the back button at sub size', () => {
      const wrapper = render({ size: 'sub' }, undefined, {
        onBackClick: () => {},
      });

      expect(wrapper.find(`.${classes.backButton}`).exists()).toBe(false);
    });
  });

  describe('actions', () => {
    it('should order the actions from the prop', () => {
      const wrapper = render({
        actions: [
          { children: 'Primary', variant: 'base-primary' },
          { children: 'Destructive', variant: 'destructive-secondary' },
          { children: 'Secondary', variant: 'base-secondary' },
        ],
      });

      expect(actionLabels(wrapper)).toEqual([
        'Destructive',
        'Secondary',
        'Primary',
      ]);
    });

    it('should drop a variant the header does not accept', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapper = render({
        actions: [
          { children: 'Ghost', variant: 'base-ghost' },
          { children: 'Primary', variant: 'base-primary' },
        ],
      });

      expect(actionLabels(wrapper)).toEqual(['Primary']);
      expect(warn).toHaveBeenCalled();

      warn.mockRestore();
    });

    it('should order the actions coming from the slot', () => {
      const wrapper = render({}, () => [
        h(MznButton, null, () => 'Primary'),
        h(MznButton, { variant: 'destructive-secondary' }, () => 'Destructive'),
        h(MznButton, { variant: 'base-secondary' }, () => 'Secondary'),
      ]);

      expect(actionLabels(wrapper)).toEqual([
        'Destructive',
        'Secondary',
        'Primary',
      ]);
    });

    it('should let the prop win over the slot', () => {
      const wrapper = render({ actions: [{ children: 'From prop' }] }, () => [
        h(MznButton, null, () => 'From slot'),
      ]);

      expect(actionLabels(wrapper)).toEqual(['From prop']);
    });
  });

  describe('the filter', () => {
    it('should render a search input from the prop, forced to the header size', () => {
      const wrapper = render({
        filter: { placeholder: 'Search', variant: 'search' },
        size: 'sub',
      });

      const input = wrapper.get(`.${classes.actionArea} input`);

      expect(input.attributes('placeholder')).toBe('Search');
      expect(wrapper.find('.mzn-text-field--sub').exists()).toBe(true);
    });

    it('should take a search input from the slot', () => {
      const wrapper = render({}, () =>
        h(MznInput, { placeholder: 'Search', variant: 'search' }),
      );

      expect(
        wrapper.get(`.${classes.actionArea} input`).attributes('placeholder'),
      ).toBe('Search');
    });

    it('should take a toggle from the slot', () => {
      const wrapper = render({}, () => h(MznToggle, { label: 'Preview' }));

      expect(wrapper.get(`.${classes.actionArea}`).text()).toContain('Preview');
    });

    it('should complain about a second filter', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render({}, () => [
        h(MznInput, { variant: 'search' }),
        h(MznToggle, { label: 'Preview' }),
      ]);

      expect(warn).toHaveBeenCalledWith(
        '[Mezzanine][ContentHeader]: ContentHeader only accepts one filter component.',
      );

      warn.mockRestore();
    });
  });

  describe('utilities', () => {
    it('should render an icon-only secondary button from the prop', () => {
      const wrapper = render({ utilities: [{ icon: PlusIcon }] });
      const button = wrapper.get(`.${classes.utilities} button`);

      expect(button.classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
      expect(button.find('.mzn-icon').attributes('data-icon-name')).toBe(
        'plus',
      );
    });

    it('should take an icon button from the slot', () => {
      const wrapper = render({}, () => h(MznButton, { icon: PlusIcon }));

      expect(wrapper.get(`.${classes.utilities} button`).classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
    });

    it('should wire a dropdown utility to its icon trigger', () => {
      const wrapper = render({}, () =>
        h(
          MznDropdown,
          { options: [{ id: '1', name: 'One' }] },
          { default: () => h(MznButton, { icon: DotHorizontalIcon }) },
        ),
      );

      const trigger = wrapper.get(`.${classes.utilities} button`);

      expect(trigger.attributes('aria-haspopup')).toBe('listbox');
      expect(trigger.classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
    });

    it('should refuse a dropdown whose child is not a button', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapper = render({}, () =>
        h(
          MznDropdown,
          { options: [{ id: '1', name: 'One' }] },
          { default: () => h('span', 'nope') },
        ),
      );

      expect(wrapper.find(`.${classes.utilities}`).exists()).toBe(false);
      expect(warn).toHaveBeenCalledWith(
        '[Mezzanine][ContentHeader]: Dropdown in utilities should have Button with icon as its children.',
      );

      warn.mockRestore();
    });
  });

  it('should tag a responsive child with its breakpoint class', () => {
    const wrapper = render({}, () =>
      h(
        MznContentHeaderResponsive,
        { breakpoint: 'above1080px' },
        { default: () => h(MznButton, null, () => 'Bulk delete') },
      ),
    );

    expect(wrapper.get('.mzn-button-group button').classes()).toContain(
      classes.breakpoint('above1080px'),
    );
  });
});
