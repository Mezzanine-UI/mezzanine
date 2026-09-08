import { mount } from '@vue/test-utils';
import { badgeClasses } from '@mezzanine-ui/core/badge';
import MznBadge from './badge.vue';

describe('MznBadge', () => {
  it('should render the count inside a span within the container', () => {
    const wrapper = mount(MznBadge, {
      props: { variant: 'count-alert', count: 5 },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain(badgeClasses.container(false));

    const badge = wrapper.find('span');

    expect(badge.classes()).toContain(badgeClasses.host);
    expect(badge.classes()).toContain(badgeClasses.variant('count-alert'));
    expect(badge.text()).toBe('5');
  });

  describe('prop: overflowCount', () => {
    it('should cap the count and suffix a plus sign', () => {
      const wrapper = mount(MznBadge, {
        props: { variant: 'count-brand', count: 120, overflowCount: 99 },
      });

      expect(wrapper.find('span').text()).toBe('99+');
    });

    it('should render the raw count when it is within the cap', () => {
      const wrapper = mount(MznBadge, {
        props: { variant: 'count-brand', count: 12, overflowCount: 99 },
      });

      expect(wrapper.find('span').text()).toBe('12');
    });
  });

  it('should hide a count badge when the count is zero', () => {
    const wrapper = mount(MznBadge, {
      props: { variant: 'count-info', count: 0 },
    });

    expect(wrapper.find('span').classes()).toContain(badgeClasses.hide);
  });

  it('should not hide a dot badge that has no count', () => {
    const wrapper = mount(MznBadge, { props: { variant: 'dot-error' } });

    expect(wrapper.find('span').classes()).not.toContain(badgeClasses.hide);
  });

  describe('text variants', () => {
    it('should render the text and the size class', () => {
      const wrapper = mount(MznBadge, {
        props: { variant: 'text-success', text: 'States', size: 'sub' },
      });
      const badge = wrapper.find('span');

      expect(badge.text()).toBe('States');
      expect(badge.classes()).toContain(badgeClasses.size('sub'));
    });

    it('should omit the size class when size is not given', () => {
      const wrapper = mount(MznBadge, {
        props: { variant: 'text-info', text: 'States' },
      });

      expect(wrapper.find('span').classes()).not.toContain(
        badgeClasses.size('main'),
      );
    });
  });

  describe('default slot', () => {
    it('should switch the container class when children are present', () => {
      const wrapper = mount(MznBadge, {
        props: { variant: 'dot-success' },
        slots: { default: '<button>bell</button>' },
      });

      expect(wrapper.classes()).toContain(badgeClasses.container(true));
      expect(wrapper.find('button').exists()).toBe(true);
    });
  });

  it('should merge fallthrough attributes onto the inner span, matching React', () => {
    const wrapper = mount(MznBadge, {
      props: { variant: 'dot-info' },
      attrs: { class: 'extra', 'data-testid': 'badge' },
    });

    expect(wrapper.classes()).not.toContain('extra');
    expect(wrapper.find('span').classes()).toContain('extra');
    expect(wrapper.find('span').attributes('data-testid')).toBe('badge');
  });
});
