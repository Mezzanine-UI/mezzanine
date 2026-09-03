import { mount } from '@vue/test-utils';
import {
  inlineMessageClasses,
  inlineMessageGroupClasses,
  inlineMessageIcons,
} from '@mezzanine-ui/core/inline-message';
import { SearchIcon } from '@mezzanine-ui/icons';
import MznInlineMessage from './inline-message.vue';
import MznInlineMessageGroup from './inline-message-group.vue';
import type { InlineMessageGroupItem } from './inline-message-group.types';

const content = '系統正在處理您的請求，請稍候。';

describe('MznInlineMessage', () => {
  it('should announce itself politely by default', () => {
    const message = mount(MznInlineMessage, {
      props: { content, severity: 'info' },
    }).find(`.${inlineMessageClasses.host}`);

    expect(message.attributes('role')).toBe('status');
    expect(message.attributes('aria-live')).toBe('polite');
  });

  it('should let the consumer override the live region politeness', () => {
    const message = mount(MznInlineMessage, {
      attrs: { 'aria-live': 'assertive' },
      props: { content, severity: 'error' },
    }).find(`.${inlineMessageClasses.host}`);

    expect(message.attributes('aria-live')).toBe('assertive');
  });

  it.each(['info', 'warning', 'error'] as const)(
    'renders the %s severity class and its icon',
    (severity) => {
      const wrapper = mount(MznInlineMessage, { props: { content, severity } });
      const message = wrapper.find(`.${inlineMessageClasses.host}`);

      expect(message.exists()).toBe(true);
      expect(message.classes()).toContain(
        inlineMessageClasses.severity(severity),
      );
      expect(wrapper.find('i').attributes('data-icon-name')).toBe(
        inlineMessageIcons[severity].name,
      );
    },
  );

  it('should prefer an explicit icon over the severity icon', () => {
    const wrapper = mount(MznInlineMessage, {
      props: { content, icon: SearchIcon, severity: 'error' },
    });

    expect(wrapper.find('i').attributes('data-icon-name')).toBe(
      SearchIcon.name,
    );
  });

  it('should render the content', () => {
    const wrapper = mount(MznInlineMessage, {
      props: { content, severity: 'info' },
    });

    expect(wrapper.find(`.${inlineMessageClasses.content}`).text()).toBe(
      content,
    );
  });

  describe('close button', () => {
    it('should only be offered for the info severity', () => {
      const close = `.${'mzn-clear-actions'}`;

      expect(
        mount(MznInlineMessage, { props: { content, severity: 'info' } })
          .find(close)
          .exists(),
      ).toBe(true);
      expect(
        mount(MznInlineMessage, { props: { content, severity: 'error' } })
          .find(close)
          .exists(),
      ).toBe(false);
    });

    it('should emit close when clicked', async () => {
      const wrapper = mount(MznInlineMessage, {
        props: { content, severity: 'info' },
      });

      await wrapper.find('.mzn-clear-actions').trigger('click');

      expect(wrapper.emitted('close')).toHaveLength(1);
    });
  });
});

describe('MznInlineMessageGroup', () => {
  const items: InlineMessageGroupItem[] = [
    { key: 'a', severity: 'info', content: 'A' },
    { key: 'b', severity: 'warning', content: 'B' },
  ];

  it('should render a labelled region containing the items', () => {
    const wrapper = mount(MznInlineMessageGroup, { props: { items } });

    expect(wrapper.classes()).toContain(inlineMessageGroupClasses.host);
    expect(wrapper.attributes('role')).toBe('region');
    expect(wrapper.attributes('aria-live')).toBe('polite');
    expect(wrapper.findAll(`.${inlineMessageClasses.host}`)).toHaveLength(2);
  });

  it('should emit itemClose with the item key and call its own handler', async () => {
    const onClose = vi.fn();
    const wrapper = mount(MznInlineMessageGroup, {
      props: { items: [{ key: 'a', severity: 'info', content: 'A', onClose }] },
    });

    await wrapper.find('.mzn-clear-actions').trigger('click');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('itemClose')).toEqual([['a']]);
  });

  it('should let the slot win over items', () => {
    const wrapper = mount(MznInlineMessageGroup, {
      props: { items },
      slots: { default: '<span class="custom">custom</span>' },
    });

    expect(wrapper.find('.custom').exists()).toBe(true);
    expect(wrapper.findAll(`.${inlineMessageClasses.host}`)).toHaveLength(0);
  });
});
