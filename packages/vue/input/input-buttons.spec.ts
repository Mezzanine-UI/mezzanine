import { mount } from '@vue/test-utils';
import {
  inputActionButtonClasses,
  inputPasswordStrengthIndicatorClasses,
  inputSpinnerButtonClasses,
} from '@mezzanine-ui/core/input';
import { formFieldClasses } from '@mezzanine-ui/core/form';
import { PlusIcon } from '@mezzanine-ui/icons';
import MznInputActionButton from './action-button.vue';
import MznPasswordStrengthIndicator from './password-strength-indicator.vue';
import MznInputSpinnerButton from './spinner-button.vue';

describe('<MznInputActionButton />', () => {
  it('should default to a copy icon labelled Copy', () => {
    const wrapper = mount(MznInputActionButton);

    expect(wrapper.classes()).toContain(inputActionButtonClasses.host);
    expect(wrapper.classes()).toContain(inputActionButtonClasses.main);
    expect(wrapper.attributes('title')).toBe('Copy');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.get('.mzn-icon').attributes('data-icon-name')).toBe('copy');
    expect(wrapper.get(`.${inputActionButtonClasses.text}`).text()).toBe(
      'Copy',
    );
  });

  it('should take a custom icon, label and size', () => {
    const wrapper = mount(MznInputActionButton, {
      props: { icon: PlusIcon, label: '新增', size: 'sub' },
    });

    expect(wrapper.classes()).toContain(inputActionButtonClasses.sub);
    expect(wrapper.attributes('title')).toBe('新增');
    expect(wrapper.get('.mzn-icon').attributes('data-icon-name')).toBe(
      PlusIcon.name,
    );
  });

  it('should disable the button', () => {
    const wrapper = mount(MznInputActionButton, { props: { disabled: true } });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain(inputActionButtonClasses.disabled);
  });

  it('should emit clicks through fallthrough listeners', async () => {
    const onClick = vi.fn();
    const wrapper = mount(MznInputActionButton, { attrs: { onClick } });

    await wrapper.trigger('click');

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('<MznInputSpinnerButton />', () => {
  it.each([
    ['up', 'Increase value', 'caret-up-flat'],
    ['down', 'Decrease value', 'caret-down-flat'],
  ] as const)('should render the %s button', (type, label, iconName) => {
    const wrapper = mount(MznInputSpinnerButton, { props: { type } });

    expect(wrapper.classes()).toContain(inputSpinnerButtonClasses.host);
    expect(wrapper.attributes('aria-label')).toBe(label);
    expect(wrapper.attributes('title')).toBe(label);
    expect(wrapper.get('.mzn-icon').attributes('data-icon-name')).toBe(
      iconName,
    );
  });

  it('should disable the button', () => {
    const wrapper = mount(MznInputSpinnerButton, {
      props: { disabled: true, type: 'up' },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain(inputSpinnerButtonClasses.disabled);
  });
});

describe('<MznPasswordStrengthIndicator />', () => {
  it.each([
    ['weak', '低'],
    ['medium', '中'],
    ['strong', '高'],
  ] as const)('should describe %s strength', (strength, text) => {
    const wrapper = mount(MznPasswordStrengthIndicator, {
      props: { strength },
    });

    expect(
      wrapper.get(`.${inputPasswordStrengthIndicatorClasses.bar}`).classes(),
    ).toContain(inputPasswordStrengthIndicatorClasses.barState(strength));
    expect(
      wrapper.get(`.${inputPasswordStrengthIndicatorClasses.text}`).text(),
    ).toBe(`密碼強度：${text}`);
  });

  it('should let the caller override both texts', () => {
    const wrapper = mount(MznPasswordStrengthIndicator, {
      props: { strengthText: 'ok', strengthTextPrefix: 'Strength: ' },
    });

    expect(
      wrapper.get(`.${inputPasswordStrengthIndicatorClasses.text}`).text(),
    ).toBe('Strength: ok');
  });

  it('should render hint texts with their severities', () => {
    const wrapper = mount(MznPasswordStrengthIndicator, {
      props: {
        hintTexts: [
          { hint: '至少 8 個字元', severity: 'success' },
          { hint: '需要一個數字', severity: 'error' },
        ],
      },
    });
    const hints = wrapper.findAll(`.${formFieldClasses.hintText}`);

    expect(hints.map((hint) => hint.text())).toEqual([
      '至少 8 個字元',
      '需要一個數字',
    ]);
    expect(hints[1].classes()).toContain(
      formFieldClasses.hintTextSeverity('error'),
    );
  });

  it('should render no hint group when there are none', () => {
    const wrapper = mount(MznPasswordStrengthIndicator, {
      props: { hintTexts: [] },
    });

    expect(
      wrapper
        .find(`.${inputPasswordStrengthIndicatorClasses.hintTextGroup}`)
        .exists(),
    ).toBe(false);
  });
});
