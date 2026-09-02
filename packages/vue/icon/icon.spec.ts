import { mount } from '@vue/test-utils';
import { iconClasses, toIconCssVars } from '@mezzanine-ui/core/icon';
import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import MznIcon from './icon.vue';

describe('MznIcon', () => {
  describe('attrs, aria-*, data-*', () => {
    it('should set data-icon-name to name of icon', () => {
      const wrapper = mount(MznIcon, { props: { icon: PlusIcon } });

      expect(wrapper.attributes('data-icon-name')).toBe(PlusIcon.name);
    });

    it('should set focusable of svg to false', () => {
      const wrapper = mount(MznIcon, { props: { icon: PlusIcon } });

      expect(wrapper.find('svg').attributes('focusable')).toBe('false');
    });
  });

  describe('prop: size', () => {
    it('should apply size className and css var when size is given', () => {
      const wrapper = mount(MznIcon, { props: { icon: PlusIcon, size: 24 } });

      expect(wrapper.classes()).toContain(iconClasses.size);
      expect(wrapper.attributes('style')).toContain('--mzn-icon-size: 24px');
    });

    it('should not apply size className when size is omitted', () => {
      const wrapper = mount(MznIcon, { props: { icon: PlusIcon } });

      expect(wrapper.classes()).not.toContain(iconClasses.size);
    });
  });

  describe('prop: color', () => {
    it('should apply color className and the palette css var', () => {
      const wrapper = mount(MznIcon, {
        props: { color: 'success', icon: PlusIcon },
      });
      const cssVars = toIconCssVars({ color: 'success' }) as Record<
        string,
        string
      >;

      expect(wrapper.classes()).toContain(iconClasses.color);
      expect(wrapper.attributes('style')).toContain(
        cssVars['--mzn-icon-color'],
      );
    });
  });

  describe('prop: spin', () => {
    it.each([
      [true, true],
      [false, false],
    ])('spin=%s should apply spin className: %s', (spin, expected) => {
      const wrapper = mount(MznIcon, { props: { icon: PlusIcon, spin } });

      expect(wrapper.classes().includes(iconClasses.spin)).toBe(expected);
    });
  });

  describe('prop: title', () => {
    it('should render title when props.title is given', () => {
      const wrapper = mount(MznIcon, {
        props: { icon: PlusIcon, title: 'foo' },
      });

      expect(wrapper.find('title').text()).toBe('foo');
    });

    it('should render definition.title when props.title is omitted', () => {
      const wrapper = mount(MznIcon, { props: { icon: SearchIcon } });
      const definitionTitle = SearchIcon.definition.title;

      if (definitionTitle) {
        expect(wrapper.find('title').text()).toBe(definitionTitle);
      } else {
        expect(wrapper.find('title').exists()).toBe(false);
      }
    });
  });

  describe('listeners: click, mouseover', () => {
    it('should set the cursor css var to inherit without listeners', () => {
      const wrapper = mount(MznIcon, { props: { icon: PlusIcon } });

      expect(wrapper.attributes('style')).toContain(
        '--mzn-icon-cursor: inherit',
      );
    });

    it.each(['click', 'mouseover'])(
      'should set the cursor css var to pointer when @%s is bound',
      (event) => {
        const wrapper = mount(MznIcon, {
          props: { icon: PlusIcon },
          attrs: { [`on${event[0].toUpperCase()}${event.slice(1)}`]: () => {} },
        });

        expect(wrapper.attributes('style')).toContain(
          '--mzn-icon-cursor: pointer',
        );
      },
    );
  });
});
