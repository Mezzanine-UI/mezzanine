import { mount } from '@vue/test-utils';
import { buttonClasses } from '@mezzanine-ui/core/button';
import { pageFooterClasses as classes } from '@mezzanine-ui/core/page-footer';
import { EditIcon } from '@mezzanine-ui/icons';
import MznPageFooter from './page-footer.vue';
import type { PageFooterProps } from './page-footer.types';

const render = (props: PageFooterProps = {}) =>
  mount(MznPageFooter, { attachTo: document.body, props });

const actions: PageFooterProps['actions'] = {
  primaryButton: { children: '發佈' },
  secondaryButton: { children: '儲存草稿' },
};

describe('<MznPageFooter />', () => {
  it('should render the annotation, message and action areas', () => {
    const wrapper = render();

    expect(wrapper.element.tagName).toBe('FOOTER');
    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.find(`.${classes.annotation}`).exists()).toBe(true);
    expect(wrapper.find(`.${classes.message}`).exists()).toBe(true);
  });

  it('should append annotationClassName to the annotation wrapper', () => {
    const wrapper = render({ annotationClassName: 'foo' });

    expect(wrapper.get(`.${classes.annotation}`).classes()).toContain('foo');
  });

  describe('type: standard', () => {
    it('should render the supporting action button', async () => {
      const supportingActionOnClick = vi.fn();
      const wrapper = render({
        supportingActionName: '查看發佈紀錄',
        supportingActionOnClick,
        supportingActionType: 'button',
        supportingActionVariant: 'base-secondary',
      });

      const button = wrapper.get(`.${classes.annotation} button`);

      expect(button.text()).toBe('查看發佈紀錄');
      expect(button.attributes('type')).toBe('button');
      expect(button.classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );

      await button.trigger('click');

      expect(supportingActionOnClick).toHaveBeenCalledTimes(1);
    });

    it('should render nothing without a supporting action name', () => {
      const wrapper = render({ supportingActionOnClick: () => {} });

      expect(wrapper.find(`.${classes.annotation} button`).exists()).toBe(
        false,
      );
    });
  });

  describe('type: overflow', () => {
    it('should render an icon-only trigger for the dropdown', () => {
      const wrapper = render({
        dropdownProps: { options: [{ id: '1', name: 'Option 1' }] },
        supportingActionIcon: EditIcon,
        type: 'overflow',
      });

      const button = wrapper.get(`.${classes.annotation} button`);

      expect(button.attributes('aria-haspopup')).toBe('listbox');
      expect(button.find('.mzn-icon').attributes('data-icon-name')).toBe(
        'edit',
      );
    });

    it('should render nothing without dropdownProps', () => {
      const wrapper = render({ type: 'overflow' });

      expect(
        wrapper.get(`.${classes.annotation}`).element.children,
      ).toHaveLength(0);
    });
  });

  describe('type: information', () => {
    it('should print the annotation text', () => {
      const wrapper = render({
        annotation: '發佈後將無法編輯',
        type: 'information',
      });

      expect(wrapper.get(`.${classes.annotation}`).text()).toBe(
        '發佈後將無法編輯',
      );
    });

    it('should render nothing without an annotation', () => {
      const wrapper = render({ type: 'information' });

      expect(
        wrapper.get(`.${classes.annotation}`).element.children,
      ).toHaveLength(0);
    });
  });

  describe('prop: warningMessage', () => {
    it('should print the warning on the right', () => {
      const wrapper = render({ warningMessage: '部分內容未通過驗證' });

      expect(wrapper.get(`.${classes.message}`).text()).toBe(
        '部分內容未通過驗證',
      );
    });

    it('should leave the message area empty without one', () => {
      const wrapper = render();

      expect(wrapper.get(`.${classes.message}`).element.children).toHaveLength(
        0,
      );
    });
  });

  describe('prop: actions', () => {
    it('should render the secondary button before the primary one', () => {
      const wrapper = render({ actions });
      const buttons = wrapper.findAll(`.${buttonClasses.host}`);

      expect(buttons.map((button) => button.text())).toEqual([
        '儲存草稿',
        '發佈',
      ]);
      expect(buttons[0].classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
      expect(buttons[1].classes()).toContain(
        buttonClasses.variant('base-primary'),
      );
    });

    it('should keep the label out of the props handed to the button', () => {
      // `children` left in the spread reaches the `button` element as a prop,
      // where Vue tries to assign the read-only `Element.children` and warns.
      // It leaves no attribute behind, so the DOM alone cannot catch it.
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render({ actions });

      expect(warn).not.toHaveBeenCalled();

      warn.mockRestore();
    });

    it('should let an action override the default variant', () => {
      const wrapper = render({
        actions: {
          primaryButton: { children: 'Delete', variant: 'destructive-primary' },
        },
      });

      expect(wrapper.get(`.${buttonClasses.host}`).classes()).toContain(
        buttonClasses.variant('destructive-primary'),
      );
    });

    it('should render only the primary button when there is no secondary one', () => {
      const wrapper = render({
        actions: { primaryButton: { children: '發佈' } },
      });

      expect(wrapper.findAll(`.${buttonClasses.host}`)).toHaveLength(1);
    });
  });
});
