import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { tagClasses } from '@mezzanine-ui/core/tag';
import MznTag from './tag.vue';
import MznTagGroup from './tag-group.vue';

describe('<MznTag />', () => {
  it('should render a static span carrying the label by default', () => {
    const wrapper = mount(MznTag, { props: { label: 'Design' } });

    const host = wrapper.get(`.${tagClasses.host}`);

    expect(host.element.tagName).toBe('SPAN');
    expect(host.classes()).toContain(tagClasses.type('static'));
    expect(host.classes()).toContain(tagClasses.size('main'));
    expect(wrapper.get(`.${tagClasses.label}`).text()).toBe('Design');
  });

  it('should mark the size and the state on the host', () => {
    const wrapper = mount(MznTag, {
      props: {
        active: true,
        disabled: true,
        label: 'Design',
        readOnly: true,
        size: 'sub',
        type: 'dismissable',
      },
    });

    const host = wrapper.get(`.${tagClasses.host}`);

    expect(host.classes()).toEqual(
      expect.arrayContaining([
        tagClasses.active,
        tagClasses.disabled,
        tagClasses.readOnly,
        tagClasses.size('sub'),
        tagClasses.type('dismissable'),
      ]),
    );
    expect(host.attributes('aria-disabled')).toBe('true');
  });

  describe('type: counter', () => {
    it('should render the label beside a count badge', () => {
      const wrapper = mount(MznTag, {
        props: { count: 3, label: 'Pending', type: 'counter' },
      });

      expect(wrapper.get(`.${tagClasses.label}`).text()).toBe('Pending');
      expect(wrapper.get('.mzn-badge').text()).toBe('3');
    });
  });

  describe('type: overflow-counter', () => {
    it('should render a button showing the count, not the label', async () => {
      const wrapper = mount(MznTag, {
        props: { count: 5, label: 'ignored', type: 'overflow-counter' },
      });

      const host = wrapper.get(`.${tagClasses.host}`);

      expect(host.element.tagName).toBe('BUTTON');
      expect(host.attributes('type')).toBe('button');
      expect(wrapper.get(`.${tagClasses.label}`).text()).toBe('5');

      await host.trigger('click');

      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('should be disabled when asked', () => {
      const wrapper = mount(MznTag, {
        props: { count: 5, disabled: true, type: 'overflow-counter' },
      });

      expect(wrapper.get('button').attributes('disabled')).toBeDefined();
    });
  });

  describe('type: addable', () => {
    it('should render a button showing the label', async () => {
      const wrapper = mount(MznTag, {
        props: { label: 'Add', type: 'addable' },
      });

      expect(wrapper.get(`.${tagClasses.host}`).element.tagName).toBe('BUTTON');
      expect(wrapper.get(`.${tagClasses.label}`).text()).toBe('Add');

      await wrapper.get('button').trigger('click');

      expect(wrapper.emitted('click')).toHaveLength(1);
    });
  });

  describe('type: dismissable', () => {
    it('should report a close button click', async () => {
      const wrapper = mount(MznTag, {
        props: { label: 'React', type: 'dismissable' },
      });

      await wrapper.get(`.${tagClasses.closeButton}`).trigger('click');

      expect(wrapper.emitted('close')).toHaveLength(1);
      expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('should disable the close button along with the tag', () => {
      const wrapper = mount(MznTag, {
        props: { disabled: true, label: 'React', type: 'dismissable' },
      });

      expect(
        wrapper.get(`.${tagClasses.closeButton}`).attributes('disabled'),
      ).toBeDefined();
    });
  });
});

describe('<MznTagGroup />', () => {
  it('should wrap every tag in a span inside the group host', () => {
    const wrapper = mount(MznTagGroup, {
      slots: {
        default: () => [
          h(MznTag, { label: 'One' }),
          h(MznTag, { label: 'Two' }),
        ],
      },
    });

    const host = wrapper.get(`.${tagClasses.group}`);
    const wrappers = host.element.children;

    expect(wrappers).toHaveLength(2);
    expect(Array.from(wrappers).every((el) => el.tagName === 'SPAN')).toBe(
      true,
    );
    expect(wrapper.findAll(`.${tagClasses.host}`)).toHaveLength(2);
  });

  it('should render nothing and complain about a child that is not a tag', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(MznTagGroup, {
      slots: { default: () => h('div', 'not a tag') },
    });

    expect(wrapper.find(`.${tagClasses.group}`).exists()).toBe(false);
    expect(error).toHaveBeenCalledWith(
      '<TagGroup> only accepts <Tag> or <OverflowCounterTag>',
    );

    error.mockRestore();
  });
});
