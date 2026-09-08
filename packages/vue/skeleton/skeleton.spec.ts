import { mount } from '@vue/test-utils';
import { skeletonClasses } from '@mezzanine-ui/core/skeleton';
import MznSkeleton from './skeleton.vue';

describe('MznSkeleton', () => {
  describe('strip form', () => {
    it('should apply the typography type class and render the background span', () => {
      const wrapper = mount(MznSkeleton, { props: { variant: 'body' } });

      expect(wrapper.classes()).toContain(skeletonClasses.host);
      expect(wrapper.classes()).toContain(skeletonClasses.type('body'));
      expect(wrapper.find('span').classes()).toContain(skeletonClasses.bg);
    });

    it('should not carry the background class on the host', () => {
      const wrapper = mount(MznSkeleton, { props: { variant: 'h1' } });

      expect(wrapper.classes()).not.toContain(skeletonClasses.bg);
    });

    it('should fall back to the block form when a height is given', () => {
      const wrapper = mount(MznSkeleton, {
        props: { variant: 'body', height: 40 },
      });

      expect(wrapper.classes()).toContain(skeletonClasses.bg);
      expect(wrapper.classes()).not.toContain(skeletonClasses.type('body'));
      expect(wrapper.find('span').exists()).toBe(false);
    });

    it('should fall back to the block form when circle is set', () => {
      const wrapper = mount(MznSkeleton, {
        props: { variant: 'body', circle: true },
      });

      expect(wrapper.classes()).toContain(skeletonClasses.circle);
      expect(wrapper.find('span').exists()).toBe(false);
    });
  });

  describe('circle and square forms', () => {
    it('should apply the circle class only when requested', () => {
      expect(
        mount(MznSkeleton, { props: { circle: true } }).classes(),
      ).toContain(skeletonClasses.circle);
      expect(mount(MznSkeleton).classes()).not.toContain(
        skeletonClasses.circle,
      );
    });
  });

  describe('dimensions', () => {
    it('should treat bare numbers as pixels, matching React', () => {
      const wrapper = mount(MznSkeleton, {
        props: { width: 120, height: 80 },
      });
      const style = wrapper.attributes('style');

      expect(style).toContain('width: 120px');
      expect(style).toContain('height: 80px');
    });

    it('should pass css length strings through unchanged', () => {
      const wrapper = mount(MznSkeleton, { props: { width: '50%' } });

      expect(wrapper.attributes('style')).toContain('width: 50%');
    });

    it('should only apply width in the strip form', () => {
      const wrapper = mount(MznSkeleton, {
        props: { variant: 'body', width: 200 },
      });
      const style = wrapper.attributes('style') ?? '';

      expect(style).toContain('width: 200px');
      expect(style).not.toContain('height');
    });
  });
});
