import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { buttonClasses } from '@mezzanine-ui/core/button';
import {
  accordionClasses as classes,
  accordionGroupClasses as groupClasses,
} from '@mezzanine-ui/core/accordion';
import MznButton from '../button/button.vue';
import MznTypography from '../typography/typography.vue';
import MznAccordionActions from './accordion-actions.vue';
import MznAccordionContent from './accordion-content.vue';
import MznAccordionGroup from './accordion-group.vue';
import MznAccordionTitle from './accordion-title.vue';
import MznAccordion from './accordion.vue';

describe('<MznAccordion />', () => {
  it('should render the title prop as its own title element', () => {
    const wrapper = mount(MznAccordion, {
      props: { title: '付款方式' },
    });

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.classes()).toContain(classes.size('main'));
    expect(wrapper.get(`.${classes.title}`).text()).toBe('付款方式');
  });

  it('should wrap children written without a content element', () => {
    const wrapper = mount(MznAccordion, {
      props: { defaultExpanded: true, title: '運送政策' },
      slots: { default: () => '1-3 個工作天內出貨。' },
    });

    expect(wrapper.get(`.${classes.content}`).text()).toBe(
      '1-3 個工作天內出貨。',
    );
  });

  it('should not mount the content until it is first expanded', async () => {
    const wrapper = mount(MznAccordion, {
      props: { title: '退換貨須知' },
      slots: { default: () => '七天內可申請退換貨。' },
    });

    expect(wrapper.find(`.${classes.content}`).exists()).toBe(false);

    await wrapper.get(`.${classes.titleMainPart}`).trigger('click');

    expect(wrapper.get(`.${classes.content}`).text()).toBe(
      '七天內可申請退換貨。',
    );
  });

  it('should toggle itself when nothing listens for the change', async () => {
    const wrapper = mount(MznAccordion, {
      props: { title: '付款方式' },
    });

    const button = wrapper.get(`.${classes.titleMainPart}`);

    expect(button.attributes('aria-expanded')).toBe('false');

    await button.trigger('click');

    expect(button.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get(`.${classes.title}`).classes()).toContain(
      classes.titleExpanded,
    );
  });

  it('should hand the state over to a consumer that listens', async () => {
    const onChange = vi.fn();
    const wrapper = mount(MznAccordion, {
      props: { onChange, title: '付款方式' },
    });

    const button = wrapper.get(`.${classes.titleMainPart}`);

    await button.trigger('click');

    expect(onChange).toHaveBeenCalledWith(true);
    // The listener owns the state now; the accordion keeps its own untouched.
    expect(button.attributes('aria-expanded')).toBe('false');
  });

  it('should follow the expanded prop when it is given', async () => {
    const wrapper = mount(MznAccordion, {
      props: { expanded: true, title: '付款方式' },
    });

    expect(
      wrapper.get(`.${classes.titleMainPart}`).attributes('aria-expanded'),
    ).toBe('true');

    await wrapper.setProps({ expanded: false });

    expect(
      wrapper.get(`.${classes.titleMainPart}`).attributes('aria-expanded'),
    ).toBe('false');
  });

  it('should start expanded when defaultExpanded is set', () => {
    const wrapper = mount(MznAccordion, {
      props: { defaultExpanded: true, title: '付款方式' },
    });

    expect(
      wrapper.get(`.${classes.titleMainPart}`).attributes('aria-expanded'),
    ).toBe('true');
  });

  it('should refuse to toggle while disabled', async () => {
    const onChange = vi.fn();
    const wrapper = mount(MznAccordion, {
      props: { disabled: true, onChange, title: '付款方式' },
    });

    expect(wrapper.classes()).toContain(classes.hostDisabled);

    const button = wrapper.get(`.${classes.titleMainPart}`);

    expect(button.attributes('disabled')).toBeDefined();
    expect(wrapper.get(`.${classes.title}`).classes()).toContain(
      classes.titleDisabled,
    );

    // The disabled attribute is what stops the click, here and in a browser;
    // the guard inside the handler is React's own belt and braces.
    await button.trigger('click');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should wire the title and the content together through the title id', () => {
    const wrapper = mount(MznAccordion, {
      props: { defaultExpanded: true },
      slots: {
        default: () => [
          h(MznAccordionTitle, { id: 'faq' }, () => '運送政策'),
          h(MznAccordionContent, null, () => '1-3 個工作天內出貨。'),
        ],
      },
    });

    const button = wrapper.get(`.${classes.titleMainPart}`);
    const content = wrapper.get(`.${classes.content}`);

    expect(button.attributes('aria-controls')).toBe('faq-content');
    expect(content.attributes('id')).toBe('faq-content');
    expect(content.attributes('aria-labelledby')).toBe('faq');
    expect(content.attributes('role')).toBe('region');
  });

  it('should leave the aria wiring off when the title has no id', () => {
    const wrapper = mount(MznAccordion, {
      props: { defaultExpanded: true },
      slots: {
        default: () => [
          h(MznAccordionTitle, null, () => '運送政策'),
          h(MznAccordionContent, null, () => '1-3 個工作天內出貨。'),
        ],
      },
    });

    expect(
      wrapper.get(`.${classes.titleMainPart}`).attributes('aria-controls'),
    ).toBeUndefined();
    expect(wrapper.get(`.${classes.content}`).attributes('id')).toBeUndefined();
  });

  it('should warn when more than one title or content is given', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mount(MznAccordion, {
      slots: {
        default: () => [
          h(MznAccordionTitle, null, () => 'a'),
          h(MznAccordionTitle, null, () => 'b'),
          h(MznAccordionContent, null, () => 'c'),
          h(MznAccordionContent, null, () => 'd'),
        ],
      },
    });

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Only one AccordionTitle is allowed'),
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Only one AccordionContent is allowed'),
    );

    warn.mockRestore();
  });
});

describe('<MznAccordionContent />', () => {
  it('should expand on its own outside an accordion', () => {
    const collapsed = mount(MznAccordionContent, {
      slots: { default: () => '1-3 個工作天內出貨。' },
    });

    expect(collapsed.find(`.${classes.content}`).exists()).toBe(false);

    const expanded = mount(MznAccordionContent, {
      props: { expanded: true },
      slots: { default: () => '1-3 個工作天內出貨。' },
    });

    expect(expanded.get(`.${classes.content}`).text()).toBe(
      '1-3 個工作天內出貨。',
    );
  });
});

describe('<MznAccordionActions />', () => {
  it('should drop anything that is not a button or a dropdown', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(MznAccordionActions, {
      slots: {
        default: () => [
          h(MznButton, null, () => '編輯'),
          h(MznTypography, null, () => '不該出現'),
        ],
      },
    });

    expect(wrapper.findAll(`.${buttonClasses.host}`)).toHaveLength(1);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Only Button or Dropdown is allowed'),
    );

    warn.mockRestore();
  });

  it('should render the buttons a config object carries in children', () => {
    const wrapper = mount(MznAccordionTitle, {
      props: { actions: { children: h(MznButton, null, () => '編輯') } },
      slots: { default: () => '篩選條件' },
    });

    expect(wrapper.get(`.${classes.titleActions}`).text()).toBe('編輯');
  });

  it('should keep an actions child out of the clickable part', () => {
    const wrapper = mount(MznAccordionTitle, {
      slots: {
        default: () => [
          '篩選條件',
          h(MznAccordionActions, null, () => h(MznButton, null, () => '編輯')),
        ],
      },
    });

    expect(wrapper.get(`.${classes.titleMainPart}`).text()).toBe('篩選條件');
    expect(wrapper.get(`.${classes.titleActions}`).text()).toBe('編輯');
  });
});

describe('<MznAccordionGroup />', () => {
  const items = ['付款方式', '運送政策', '退換貨須知'];

  const renderGroup = (
    props: Record<string, unknown> = {},
    accordionProps: Record<string, unknown>[] = [],
  ) =>
    mount(MznAccordionGroup, {
      props,
      slots: {
        default: () =>
          items.map((title, index) =>
            h(MznAccordion, { ...accordionProps[index], title }),
          ),
      },
    });

  it('should override each accordion size with its own', () => {
    const wrapper = renderGroup({ size: 'sub' }, [{ size: 'main' }]);

    expect(wrapper.classes()).toContain(groupClasses.host);
    wrapper.findAllComponents(MznAccordion).forEach((accordion) => {
      expect(accordion.classes()).toContain(classes.size('sub'));
    });
  });

  it('should leave the accordions alone when it is not exclusive', async () => {
    const wrapper = renderGroup();
    const buttons = wrapper.findAll(`.${classes.titleMainPart}`);

    await buttons[0].trigger('click');
    await buttons[1].trigger('click');

    expect(buttons[0].attributes('aria-expanded')).toBe('true');
    expect(buttons[1].attributes('aria-expanded')).toBe('true');
  });

  it('should keep only one accordion open while exclusive', async () => {
    const wrapper = renderGroup({ exclusive: true });
    const buttons = wrapper.findAll(`.${classes.titleMainPart}`);

    await buttons[0].trigger('click');

    expect(buttons[0].attributes('aria-expanded')).toBe('true');

    await buttons[1].trigger('click');
    await nextTick();

    expect(buttons[0].attributes('aria-expanded')).toBe('false');
    expect(buttons[1].attributes('aria-expanded')).toBe('true');
  });

  it('should open the accordion that asked for it by default while exclusive', () => {
    const wrapper = renderGroup({ exclusive: true }, [
      {},
      { defaultExpanded: true },
    ]);
    const buttons = wrapper.findAll(`.${classes.titleMainPart}`);

    expect(buttons[1].attributes('aria-expanded')).toBe('true');
  });

  it('should still call an accordion own change listener while exclusive', async () => {
    const onChange = vi.fn();
    const wrapper = renderGroup({ exclusive: true }, [{ onChange }]);

    await wrapper.findAll(`.${classes.titleMainPart}`)[0].trigger('click');

    // Once, not twice: the group replaces the listener rather than adding to it.
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should leave a controlled accordion out of the exclusive rotation', async () => {
    const wrapper = renderGroup({ exclusive: true }, [{ expanded: true }]);
    const buttons = wrapper.findAll(`.${classes.titleMainPart}`);

    await buttons[1].trigger('click');
    await nextTick();

    expect(buttons[0].attributes('aria-expanded')).toBe('true');
    expect(buttons[1].attributes('aria-expanded')).toBe('true');
  });
});
