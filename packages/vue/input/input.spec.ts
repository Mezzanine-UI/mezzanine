import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import {
  inputActionButtonClasses,
  inputClasses,
  inputPasswordStrengthIndicatorClasses,
  inputSelectButtonClasses,
  inputSpinnerButtonClasses,
} from '@mezzanine-ui/core/input';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznInput from './input.vue';

describe('<MznInput />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render a text input by default', () => {
    const wrapper = mount(MznInput, { props: { placeholder: 'Type here' } });

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('placeholder')).toBe('Type here');
  });

  it('should keep a controlled value while reporting the change', async () => {
    const wrapper = mount(MznInput, { props: { value: 'fixed' } });
    const input = wrapper.get('input');

    await input.setValue('typed');

    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(input.element.value).toBe('fixed');
  });

  it('should follow its own state when uncontrolled', async () => {
    const wrapper = mount(MznInput, { props: { defaultValue: 'start' } });
    const input = wrapper.get('input');

    expect(input.element.value).toBe('start');

    await input.setValue('typed');

    expect(input.element.value).toBe('typed');
  });

  describe('search variant', () => {
    it('should prepend the search icon and be clearable by default', () => {
      const wrapper = mount(MznInput, {
        props: { defaultValue: 'query', variant: 'search' },
      });

      expect(
        wrapper
          .get('.mzn-text-field__prefix .mzn-icon')
          .attributes('data-icon-name'),
      ).toBe('search');
      expect(wrapper.find('.mzn-clear-actions').exists()).toBe(true);
    });

    it('should drop the clear button when `clearable` is false', () => {
      const wrapper = mount(MznInput, {
        props: { clearable: false, defaultValue: 'query', variant: 'search' },
      });

      expect(wrapper.find('.mzn-clear-actions').exists()).toBe(false);
    });

    it('should clear the value and report it', async () => {
      const wrapper = mount(MznInput, {
        props: { defaultValue: 'query', variant: 'search' },
      });

      await wrapper.get('.mzn-clear-actions').trigger('click');

      expect(wrapper.emitted('clear')).toHaveLength(1);
      expect(wrapper.get('input').element.value).toBe('');
    });
  });

  describe('number variant', () => {
    it('should render a number input carrying min, max and step', () => {
      const wrapper = mount(MznInput, {
        props: { max: 100, min: 0, step: 5, variant: 'number' },
      });

      const input = wrapper.get('input');

      expect(input.attributes('type')).toBe('number');
      expect(input.attributes('min')).toBe('0');
      expect(input.attributes('max')).toBe('100');
      expect(input.attributes('step')).toBe('5');
    });
  });

  describe('measure variant', () => {
    it('should format the displayed value with thousand separators', () => {
      const wrapper = mount(MznInput, {
        props: { defaultValue: '1000000', variant: 'measure' },
      });

      expect(wrapper.get('input').element.value).toBe('1,000,000');
    });

    it('should report the parsed value, not the formatted one', async () => {
      const seen: string[] = [];
      const wrapper = mount(MznInput, {
        props: {
          defaultValue: '1000',
          // Read where a consumer reads it: inside the handler, before the
          // formatted value is put back on the element.
          onChange: (event: Event) =>
            seen.push((event.target as HTMLInputElement).value),
          variant: 'measure',
        },
      });

      await wrapper.get('input').setValue('2,500');

      expect(seen).toEqual(['2500']);
    });

    it('should only render the spinner when asked', () => {
      const without = mount(MznInput, { props: { variant: 'measure' } });
      const withSpinner = mount(MznInput, {
        props: { showSpinner: true, variant: 'measure' },
      });

      expect(without.find(`.${inputClasses.spinners}`).exists()).toBe(false);
      expect(
        withSpinner.findAll(`.${inputSpinnerButtonClasses.host}`),
      ).toHaveLength(2);
    });

    it('should step the value up and down within the bounds', async () => {
      const wrapper = mount(MznInput, {
        props: {
          defaultValue: '10',
          max: 12,
          min: 8,
          showSpinner: true,
          step: 2,
          variant: 'measure',
        },
      });

      const [up, down] = wrapper.findAll(`.${inputSpinnerButtonClasses.host}`);

      await up.trigger('click');
      expect(wrapper.get('input').element.value).toBe('12');
      expect(wrapper.emitted('spinUp')).toHaveLength(1);

      // 14 is past `max`, so the value stays put — the event still fires.
      await up.trigger('click');
      expect(wrapper.get('input').element.value).toBe('12');
      expect(wrapper.emitted('spinUp')).toHaveLength(2);

      await down.trigger('click');
      await down.trigger('click');
      expect(wrapper.get('input').element.value).toBe('8');
      expect(wrapper.emitted('spinDown')).toHaveLength(2);
    });
  });

  describe('password variant', () => {
    it('should hide the value until the eye is clicked', async () => {
      const wrapper = mount(MznInput, { props: { variant: 'password' } });
      const eye = wrapper.get('[role="button"]');

      expect(wrapper.get('input').attributes('type')).toBe('password');
      expect(eye.attributes('aria-label')).toBe('Show password');

      await eye.trigger('click');

      expect(wrapper.get('input').attributes('type')).toBe('text');
      expect(wrapper.get('[role="button"]').attributes('aria-label')).toBe(
        'Hide password',
      );
    });

    it('should only render the strength indicator when asked', () => {
      const wrapper = mount(MznInput, {
        props: {
          passwordStrengthIndicator: { strength: 'weak' },
          showPasswordStrengthIndicator: true,
          variant: 'password',
        },
      });

      expect(
        wrapper.find(`.${inputPasswordStrengthIndicatorClasses.host}`).exists(),
      ).toBe(true);
    });
  });

  describe('action variant', () => {
    it('should render the action button on the side it asks for', () => {
      const wrapper = mount(MznInput, {
        props: {
          actionButton: { label: 'Copy', position: 'prefix' },
          variant: 'action',
        },
      });

      const host = wrapper.get(`.${inputClasses.host}`);

      expect(host.element.firstElementChild?.className).toContain(
        inputActionButtonClasses.host,
      );
    });

    it('should disable the action button while the input is readonly', () => {
      const wrapper = mount(MznInput, {
        props: {
          actionButton: { label: 'Copy', position: 'suffix' },
          readonly: true,
          variant: 'action',
        },
      });

      expect(
        wrapper.get(`.${inputActionButtonClasses.host}`).attributes('disabled'),
      ).toBeDefined();
    });
  });

  describe('select variant', () => {
    it('should render the select button and report a pick', async () => {
      const wrapper = mount(MznInput, {
        attachTo: document.body,
        props: {
          options: [
            { id: '.com', name: '.com' },
            { id: '.tw', name: '.tw' },
          ],
          selectButton: { position: 'suffix', value: '.com' },
          selectedValue: '.com',
          variant: 'select',
        },
      });

      await wrapper.get(`.${inputSelectButtonClasses.host}`).trigger('click');
      await nextTick();

      const items = Array.from(
        document.body.querySelectorAll('.mzn-dropdown-item-card'),
      ) as HTMLElement[];

      expect(items).toHaveLength(2);

      items[1].click();
      await nextTick();

      expect(wrapper.emitted('select')?.[0]).toEqual(['.tw']);
    });
  });
});
