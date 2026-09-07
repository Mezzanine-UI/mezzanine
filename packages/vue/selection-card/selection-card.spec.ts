import { mount } from '@vue/test-utils';
import { selectionCardClasses as classes } from '@mezzanine-ui/core/selection-card';
import { EditIcon } from '@mezzanine-ui/icons';
import MznSelectionCard from './selection-card.vue';
import type { SelectionCardProps } from './selection-card.types';

const base: SelectionCardProps = {
  selector: 'radio',
  supportingText: 'Supporting',
  text: 'Selection',
};

const render = (props: Partial<SelectionCardProps> = {}) =>
  mount(MznSelectionCard, { props: { ...base, ...props } });

describe('<MznSelectionCard />', () => {
  it('should render a label wrapping the content and the input', () => {
    const wrapper = render();

    expect(wrapper.element.tagName).toBe('LABEL');
    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.classes()).toContain(classes.direction('horizontal'));
    expect(wrapper.find(`.${classes.container}`).exists()).toBe(true);
    expect(wrapper.find(`.${classes.content}`).exists()).toBe(true);
    expect(wrapper.get('input').attributes('type')).toBe('radio');
  });

  it('should render the selector the type asks for', () => {
    expect(
      render({ selector: 'checkbox' }).get('input').attributes('type'),
    ).toBe('checkbox');
  });

  it('should stack the card for the vertical direction', () => {
    expect(render({ direction: 'vertical' }).classes()).toContain(
      classes.direction('vertical'),
    );
  });

  describe('prop: disabled', () => {
    it('should mark the label and the input', () => {
      const wrapper = render({ disabled: true });

      expect(wrapper.classes()).toContain(classes.disabled);
      expect(wrapper.attributes('aria-disabled')).toBe('true');
      expect(wrapper.get('input').attributes('disabled')).toBeDefined();
    });
  });

  describe('prop: readonly', () => {
    it('should drop the input entirely', () => {
      const wrapper = render({ readonly: true });

      expect(wrapper.classes()).toContain(classes.readonly);
      expect(wrapper.find('input').exists()).toBe(false);
    });
  });

  describe('the leading visual', () => {
    it('should render the image with the text as its alt', () => {
      const wrapper = render({ image: '/logo.png', imageObjectFit: 'contain' });
      const image = wrapper.get(`.${classes.selectionImage}`);

      expect(image.attributes('src')).toBe('/logo.png');
      expect(image.attributes('alt')).toBe('Selection');
      expect(image.attributes('style')).toContain('object-fit: contain');
      expect(wrapper.find(`.${classes.icon}`).exists()).toBe(false);
    });

    it('should fall back to an icon, custom when one is given', () => {
      expect(
        render().get(`.${classes.icon}`).attributes('data-icon-name'),
      ).toBe('file');
      expect(
        render({ customIcon: EditIcon })
          .get(`.${classes.icon}`)
          .attributes('data-icon-name'),
      ).toBe('edit');
    });

    it('should treat a blank image as no image', () => {
      expect(render({ image: '   ' }).find(`.${classes.icon}`).exists()).toBe(
        true,
      );
    });
  });

  describe('the text', () => {
    it('should print the text and the supporting text', () => {
      const wrapper = render();

      expect(wrapper.get(`.${classes.text}`).text()).toBe('Selection');
      expect(wrapper.get(`.${classes.supportingText}`).text()).toBe(
        'Supporting',
      );
    });

    it('should drop the supporting text and its description wiring', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapper = render({ supportingText: undefined });

      expect(wrapper.find(`.${classes.supportingText}`).exists()).toBe(false);
      expect(
        wrapper.get('input').attributes('aria-describedby'),
      ).toBeUndefined();
      expect(warn).toHaveBeenCalled();

      warn.mockRestore();
    });

    it('should cap the width when asked', () => {
      const wrapper = render({
        supportingTextMaxWidth: '144px',
        textMaxWidth: '112px',
      });

      expect(wrapper.get(`.${classes.text}`).attributes('style')).toContain(
        'max-width: 112px',
      );
      expect(
        wrapper.get(`.${classes.supportingText}`).attributes('style'),
      ).toContain('max-width: 144px');
    });
  });

  describe('accessibility wiring', () => {
    it('should point the label, the description and the input at each other', () => {
      const wrapper = render();
      const input = wrapper.get('input');
      const inputId = input.attributes('id');

      expect(wrapper.attributes('for')).toBe(inputId);
      expect(input.attributes('aria-labelledby')).toBe(
        wrapper.get(`.${classes.text}`).attributes('id'),
      );
      expect(input.attributes('aria-describedby')).toBe(
        wrapper.get(`.${classes.supportingText}`).attributes('id'),
      );
    });

    it('should build the ids from an explicit one', () => {
      const wrapper = render({ id: 'plan' });

      expect(wrapper.get('input').attributes('id')).toBe('plan');
      expect(wrapper.get(`.${classes.text}`).attributes('id')).toBe(
        'plan-text',
      );
      expect(wrapper.get(`.${classes.supportingText}`).attributes('id')).toBe(
        'plan-supporting-text',
      );
    });
  });

  describe('checked state', () => {
    it('should mirror a controlled checked into aria-checked', () => {
      const wrapper = render({ checked: true });

      expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(
        true,
      );
      expect(wrapper.get('input').attributes('aria-checked')).toBe('true');
    });

    it('should leave aria-checked off while uncontrolled', () => {
      const wrapper = render({ defaultChecked: true });

      expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(
        true,
      );
      expect(wrapper.get('input').attributes('aria-checked')).toBeUndefined();
    });
  });

  it('should report the input change and the label click', async () => {
    const wrapper = render();

    await wrapper.get('input').trigger('change');
    await wrapper.trigger('click');

    expect(wrapper.emitted('change')).toHaveLength(1);
    // The input sits inside the label, so its change bubbles a click too.
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('should render nothing and complain without a text', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(MznSelectionCard, {
      props: { selector: 'radio', text: '' },
    });

    expect(wrapper.find('label').exists()).toBe(false);
    expect(error).toHaveBeenCalledWith(
      'SelectionCard: `text` (title) is required.',
    );

    error.mockRestore();
  });
});
