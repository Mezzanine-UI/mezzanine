import { defineComponent, h, inject } from 'vue';
import { mount } from '@vue/test-utils';
import {
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
  formFieldClasses as classes,
  formGroupClasses,
  formHintIcons,
} from '@mezzanine-ui/core/form';
import { PlusIcon } from '@mezzanine-ui/icons';
import { formControlKey, type FormControl } from '../_internal/form-control';
import MznFormField from './form-field.vue';
import MznFormGroup from './form-group.vue';
import MznFormHintText from './form-hint-text.vue';
import MznFormLabel from './form-label.vue';

const FormControlProbe = defineComponent({
  name: 'FormControlProbe',
  setup() {
    const formControl = inject(formControlKey, undefined);

    return () =>
      h('span', { class: 'probe' }, JSON.stringify(formControl?.value ?? null));
  },
});

describe('<MznFormField />', () => {
  it('should bind host class and default to the horizontal layout', () => {
    const wrapper = mount(MznFormField);

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.classes()).toContain(
      classes.layout(FormFieldLayout.HORIZONTAL),
    );
  });

  it('should append class name on host element', () => {
    const wrapper = mount(MznFormField, { attrs: { class: 'foo' } });

    expect(wrapper.classes()).toContain('foo');
  });

  it.each([
    ['disabled', classes.disabled],
    ['fullWidth', classes.fullWidth],
  ] as const)('should apply the %s class', (prop, expected) => {
    const wrapper = mount(MznFormField, { props: { [prop]: true } });

    expect(wrapper.classes()).toContain(expected);
  });

  it('should apply density and label spacing except in the vertical layout', () => {
    const horizontal = mount(MznFormField, {
      props: {
        density: FormFieldDensity.TIGHT,
        labelSpacing: FormFieldLabelSpacing.SUB,
        label: 'name',
      },
    });

    expect(horizontal.classes()).toContain(
      classes.density(FormFieldDensity.TIGHT),
    );
    expect(horizontal.get(`.${classes.label}`).classes()).toContain(
      classes.labelSpacing(FormFieldLabelSpacing.SUB),
    );

    const vertical = mount(MznFormField, {
      props: {
        density: FormFieldDensity.TIGHT,
        label: 'name',
        labelSpacing: FormFieldLabelSpacing.SUB,
        layout: FormFieldLayout.VERTICAL,
      },
    });

    expect(vertical.classes()).not.toContain(
      classes.density(FormFieldDensity.TIGHT),
    );
    expect(vertical.get(`.${classes.label}`).classes()).not.toContain(
      classes.labelSpacing(FormFieldLabelSpacing.SUB),
    );
  });

  it('should render the label only when given, tying it to the name', () => {
    expect(mount(MznFormField).find(`.${classes.label}`).exists()).toBe(false);

    const wrapper = mount(MznFormField, {
      props: { label: '使用者名稱', name: 'username' },
    });

    expect(wrapper.get(`.${classes.label}`).attributes('for')).toBe('username');
    expect(wrapper.get(`.${classes.label}`).text()).toContain('使用者名稱');
  });

  it('should apply the control field slot layout and columns', () => {
    const wrapper = mount(MznFormField, {
      props: {
        controlFieldSlotColumns: 3,
        controlFieldSlotLayout: ControlFieldSlotLayout.SUB,
      },
    });
    const slot = wrapper.get(
      `.${classes.controlFieldSlot}--${ControlFieldSlotLayout.SUB}`,
    );

    expect(slot.classes()).toContain(classes.controlFieldSlotColumns(3));
  });

  it('should render children into the control field slot', () => {
    const wrapper = mount(MznFormField, {
      slots: { default: () => h('input', { class: 'control' }) },
    });

    expect(
      wrapper
        .get(`.${classes.controlFieldSlot}--${ControlFieldSlotLayout.MAIN}`)
        .find('.control')
        .exists(),
    ).toBe(true);
  });

  describe('hint text and counter', () => {
    it('should render nothing when neither is given', () => {
      expect(
        mount(MznFormField).find(`.${classes.hintTextAndCounterArea}`).exists(),
      ).toBe(false);
    });

    it('should render the hint text with the field severity', () => {
      const wrapper = mount(MznFormField, {
        props: { hintText: 'bad email', severity: 'error' },
      });
      const hint = wrapper.get(`.${classes.hintText}`);

      expect(hint.text()).toBe('bad email');
      expect(hint.classes()).toContain(classes.hintTextSeverity('error'));
    });

    it('should render the counter with its color', () => {
      const wrapper = mount(MznFormField, {
        props: { counter: '50/200', counterColor: FormFieldCounterColor.ERROR },
      });
      const counter = wrapper.get(`.${classes.counter}`);

      expect(counter.text()).toBe('50/200');
      expect(counter.classes()).toContain(
        classes.counterColor(FormFieldCounterColor.ERROR),
      );
    });

    it('should align a lone counter to the right', () => {
      const withCounterOnly = mount(MznFormField, {
        props: { counter: '50/200' },
      });
      const withBoth = mount(MznFormField, {
        props: { counter: '50/200', hintText: 'hint' },
      });

      expect(
        withCounterOnly.get(`.${classes.hintTextAndCounterArea}`).classes(),
      ).toContain(`${classes.hintTextAndCounterArea}--align-right`);
      expect(
        withBoth.get(`.${classes.hintTextAndCounterArea}`).classes(),
      ).not.toContain(`${classes.hintTextAndCounterArea}--align-right`);
    });
  });

  describe('form control', () => {
    it('should provide its state to children', () => {
      const wrapper = mount(MznFormField, {
        props: {
          disabled: true,
          fullWidth: true,
          required: true,
          severity: 'warning',
        },
        slots: { default: () => h(FormControlProbe) },
      });

      expect(JSON.parse(wrapper.get('.probe').text())).toEqual({
        disabled: true,
        fullWidth: true,
        required: true,
        severity: 'warning',
      } satisfies FormControl);
    });

    it('should mark the label as required through the same state', () => {
      const wrapper = mount(MznFormField, {
        props: { label: 'name', required: true },
      });

      expect(wrapper.get(`.${classes.labelRequiredMarker}`).text()).toBe('*');
    });
  });
});

describe('<MznFormLabel />', () => {
  it('should render the text, the optional marker and the colon', () => {
    const wrapper = mount(MznFormLabel, {
      props: { labelText: '姓名', optionalMarker: '(選填)' },
    });

    expect(wrapper.text()).toBe('姓名(選填):');
    expect(wrapper.get(`.${classes.labelOptionalMarker}`).text()).toBe(
      '(選填)',
    );
    expect(wrapper.get(`.${classes.labelColon}`).text()).toBe(':');
  });

  it('should render no required marker without a form control', () => {
    const wrapper = mount(MznFormLabel, { props: { labelText: '姓名' } });

    expect(wrapper.find(`.${classes.labelRequiredMarker}`).exists()).toBe(
      false,
    );
  });

  it('should render the information icon when given', () => {
    const wrapper = mount(MznFormLabel, {
      props: {
        informationIcon: PlusIcon,
        informationText: '說明',
        labelText: '姓名',
      },
    });

    expect(
      wrapper
        .get(`.${classes.labelInformationIcon}`)
        .attributes('data-icon-name'),
    ).toBe(PlusIcon.name);
  });
});

describe('<MznFormHintText />', () => {
  it.each(['info', 'success', 'warning', 'error'] as const)(
    'should render the %s icon by default',
    (severity) => {
      const wrapper = mount(MznFormHintText, {
        props: { hintText: 'hint', severity },
      });

      expect(wrapper.classes()).toContain(classes.hintTextSeverity(severity));
      expect(
        wrapper.get(`.${classes.hintTextIcon}`).attributes('data-icon-name'),
      ).toBe(formHintIcons[severity].name);
    },
  );

  it('should let a custom icon win', () => {
    const wrapper = mount(MznFormHintText, {
      props: { hintText: 'hint', hintTextIcon: PlusIcon },
    });

    expect(
      wrapper.get(`.${classes.hintTextIcon}`).attributes('data-icon-name'),
    ).toBe(PlusIcon.name);
  });

  it('should render no icon when showHintTextIcon is false', () => {
    const wrapper = mount(MznFormHintText, {
      props: {
        hintText: 'hint',
        hintTextIcon: PlusIcon,
        showHintTextIcon: false,
      },
    });

    expect(wrapper.find(`.${classes.hintTextIcon}`).exists()).toBe(false);
    expect(wrapper.text()).toBe('hint');
  });
});

describe('<MznFormGroup />', () => {
  it('should render the title and its fields', () => {
    const wrapper = mount(MznFormGroup, {
      props: { fieldsContainerClassName: 'foo', title: '基本資料' },
      slots: { default: () => h('div', { class: 'field' }) },
    });

    expect(wrapper.classes()).toContain(formGroupClasses.host);
    expect(wrapper.get(`.${formGroupClasses.title}`).text()).toBe('基本資料');

    const container = wrapper.get(`.${formGroupClasses.fieldsContainer}`);

    expect(container.classes()).toContain('foo');
    expect(container.find('.field').exists()).toBe(true);
  });
});
