import { mount } from '@vue/test-utils';
import { scrollbarClasses } from '@mezzanine-ui/core/scrollbar';
import MznScrollbar from './scrollbar.vue';

describe('MznScrollbar', () => {
  describe('prop: disabled', () => {
    it('should render a plain div without the host class', () => {
      const wrapper = mount(MznScrollbar, {
        props: { disabled: true },
        slots: { default: '<p>content</p>' },
      });

      expect(wrapper.element.tagName).toBe('DIV');
      expect(wrapper.classes()).not.toContain(scrollbarClasses.host);
      expect(wrapper.find('p').text()).toBe('content');
    });

    it('should emit viewportReady with the plain element', () => {
      const wrapper = mount(MznScrollbar, { props: { disabled: true } });
      const emitted = wrapper.emitted('viewportReady');

      expect(emitted).toHaveLength(1);
      expect(emitted?.[0][0]).toBe(wrapper.element);
    });
  });

  describe('max dimensions', () => {
    it('should treat a bare number as pixels, matching React', () => {
      const wrapper = mount(MznScrollbar, {
        props: { disabled: true, maxHeight: 300, maxWidth: 500 },
      });
      const style = wrapper.attributes('style');

      expect(style).toContain('max-height: 300px');
      expect(style).toContain('max-width: 500px');
    });

    it('should pass a css length string through unchanged', () => {
      const wrapper = mount(MznScrollbar, {
        props: { disabled: true, maxHeight: '50vh' },
      });

      expect(wrapper.attributes('style')).toContain('max-height: 50vh');
    });

    it('should omit the declarations when unset', () => {
      const wrapper = mount(MznScrollbar, { props: { disabled: true } });
      const style = wrapper.attributes('style') ?? '';

      expect(style).not.toContain('max-height');
      expect(style).not.toContain('max-width');
    });
  });

  it('should forward fallthrough attributes in the disabled branch', () => {
    const wrapper = mount(MznScrollbar, {
      props: { disabled: true },
      attrs: { 'data-testid': 'scroller' },
    });

    expect(wrapper.attributes('data-testid')).toBe('scroller');
  });
});
