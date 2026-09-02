import { mount } from '@vue/test-utils';
import { separatorClasses } from '@mezzanine-ui/core/separator';
import MznSeparator from './separator.vue';

describe('MznSeparator', () => {
  it('should render an <hr> with the host class', () => {
    const wrapper = mount(MznSeparator);

    expect(wrapper.element.tagName).toBe('HR');
    expect(wrapper.classes()).toContain(separatorClasses.host);
  });

  it('should default to the horizontal orientation', () => {
    const wrapper = mount(MznSeparator);

    expect(wrapper.classes()).toContain(separatorClasses.horizontal);
    expect(wrapper.attributes('aria-orientation')).toBeUndefined();
  });

  it('should announce a vertical separator via aria-orientation', () => {
    const wrapper = mount(MznSeparator, {
      props: { orientation: 'vertical' },
    });

    expect(wrapper.classes()).toContain(separatorClasses.vertical);
    expect(wrapper.attributes('aria-orientation')).toBe('vertical');
  });
});
