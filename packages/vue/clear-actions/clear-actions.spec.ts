import { mount } from '@vue/test-utils';
import { clearActionsClasses } from '@mezzanine-ui/core/clear-actions';
import { CloseIcon, DangerousFilledIcon } from '@mezzanine-ui/icons';
import MznClearActions from './clear-actions.vue';

describe('MznClearActions', () => {
  it('should render an accessible button of type button', () => {
    const wrapper = mount(MznClearActions);

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.attributes('aria-label')).toBe('Close');
    expect(wrapper.classes()).toContain(clearActionsClasses.host);
  });

  describe('resolved variant', () => {
    it('should default a standard button to base', () => {
      const wrapper = mount(MznClearActions);

      expect(wrapper.classes()).toContain(clearActionsClasses.type('standard'));
      expect(wrapper.classes()).toContain(clearActionsClasses.variant('base'));
    });

    it('should default an embedded button to contrast', () => {
      const wrapper = mount(MznClearActions, { props: { type: 'embedded' } });

      expect(wrapper.classes()).toContain(
        clearActionsClasses.variant('contrast'),
      );
    });

    it('should force a clearable button to default', () => {
      const wrapper = mount(MznClearActions, { props: { type: 'clearable' } });

      expect(wrapper.classes()).toContain(
        clearActionsClasses.variant('default'),
      );
    });

    it('should honour an explicit variant', () => {
      const wrapper = mount(MznClearActions, {
        props: { type: 'standard', variant: 'inverse' },
      });

      expect(wrapper.classes()).toContain(
        clearActionsClasses.variant('inverse'),
      );
    });
  });

  describe('icon', () => {
    it('should use the close icon for non-clearable types', () => {
      const wrapper = mount(MznClearActions, { props: { type: 'embedded' } });

      expect(wrapper.find('i').attributes('data-icon-name')).toBe(
        CloseIcon.name,
      );
      expect(wrapper.find('i').classes()).toContain(clearActionsClasses.icon);
    });

    it('should use the dangerous icon for the clearable type', () => {
      const wrapper = mount(MznClearActions, { props: { type: 'clearable' } });

      expect(wrapper.find('i').attributes('data-icon-name')).toBe(
        DangerousFilledIcon.name,
      );
    });
  });

  it('should emit click with the native event', async () => {
    const wrapper = mount(MznClearActions);

    await wrapper.trigger('click');

    const emitted = wrapper.emitted('click');

    expect(emitted).toHaveLength(1);
    expect(emitted?.[0][0]).toBeInstanceOf(MouseEvent);
  });
});
