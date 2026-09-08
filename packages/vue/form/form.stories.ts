import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import {
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import {
  CheckedOutlineIcon,
  ErrorOutlineIcon,
  InfoFilledIcon,
  InfoOutlineIcon,
  QuestionOutlineIcon,
  WarningOutlineIcon,
} from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import MznCheckAll from '../checkbox/check-all.vue';
import MznCheckbox from '../checkbox/checkbox.vue';
import MznCheckboxGroup from '../checkbox/checkbox-group.vue';
import type { CheckboxGroupChangeEvent } from '../checkbox/checkbox-group.types';
import MznInput from '../input/input.vue';
import MznRadio from '../radio/radio.vue';
import MznRadioGroup from '../radio/radio-group.vue';
import MznTextarea from '../textarea/textarea.vue';
import MznSwitch from '../toggle/toggle.vue';
import MznFormField from './form-field.vue';
import MznFormGroup from './form-group.vue';

const hintTextIconOptions = {
  none: undefined,
  InfoOutlineIcon,
  InfoFilledIcon,
  WarningOutlineIcon,
  ErrorOutlineIcon,
  CheckedOutlineIcon,
  QuestionOutlineIcon,
} satisfies Record<string, IconDefinition | undefined>;

type HintTextIconOptionKey = keyof typeof hintTextIconOptions;

export default {
  title: 'Data Entry/Form',
} as Meta;

interface PlaygroundStoryArgs {
  clearable: boolean;
  controlFieldSlotLayout: ControlFieldSlotLayout;
  counter?: string;
  counterColor: FormFieldCounterColor;
  density?: FormFieldDensity;
  disabled: boolean;
  fullWidth: boolean;
  hintText?: string;
  hintTextIcon: HintTextIconOptionKey;
  label: string;
  labelInformationText: string;
  labelSpacing: FormFieldLabelSpacing;
  layout: FormFieldLayout;
  message: string;
  name: string;
  remark: string;
  required: boolean;
  severity?: SeverityWithInfo;
  showHintTextIcon: boolean;
  showRemarkIcon: boolean;
}

export const Playground: StoryObj<PlaygroundStoryArgs> = {
  args: {
    clearable: false,
    controlFieldSlotLayout: ControlFieldSlotLayout.MAIN,
    counter: '231/232',
    counterColor: FormFieldCounterColor.INFO,
    density: FormFieldDensity.BASE,
    disabled: false,
    fullWidth: false,
    hintText: 'hint text',
    hintTextIcon: 'InfoFilledIcon',
    label: 'label',
    labelInformationText: 'This is information tooltip text',
    labelSpacing: FormFieldLabelSpacing.MAIN,
    layout: FormFieldLayout.VERTICAL,
    message: 'message',
    name: 'field-name',
    remark: 'remark',
    required: false,
    severity: 'info',
    showHintTextIcon: true,
    showRemarkIcon: false,
  },
  argTypes: {
    controlFieldSlotLayout: {
      control: {
        type: 'select',
      },
      options: Object.values(ControlFieldSlotLayout),
    },
    counterColor: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldCounterColor),
    },
    density: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldDensity),
    },
    hintTextIcon: {
      control: {
        type: 'select',
      },
      options: Object.keys(hintTextIconOptions),
    },
    labelSpacing: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldLabelSpacing),
    },
    layout: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldLayout),
    },
    severity: {
      control: {
        type: 'select',
      },
      options: ['info', 'success', 'warning', 'error'],
    },
  },
  render: (args) => ({
    components: {
      MznCheckAll,
      MznCheckbox,
      MznCheckboxGroup,
      MznFormField,
      MznInput,
      MznRadio,
      MznRadioGroup,
      MznSwitch,
      MznTextarea,
    },
    setup: () => {
      const checkAllValue = ref(['2']);

      const fieldProps = computed(() => ({
        controlFieldSlotLayout: args.controlFieldSlotLayout,
        counter: args.counter,
        counterColor: args.counterColor,
        density: args.density,
        disabled: args.disabled,
        fullWidth: args.fullWidth,
        hintText: args.hintText,
        hintTextIcon: hintTextIconOptions[args.hintTextIcon],
        label: args.label,
        labelInformationIcon: args.showRemarkIcon ? InfoOutlineIcon : undefined,
        labelInformationText: args.labelInformationText,
        labelOptionalMarker: args.remark,
        labelSpacing: args.labelSpacing,
        layout: args.layout,
        name: args.name,
        required: args.required,
        severity: args.severity,
        showHintTextIcon: args.showHintTextIcon,
      }));

      return {
        args,
        checkAllOptions: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { disabled: true, label: 'Option 3', value: '3' },
        ],
        checkAllValue,
        fieldProps,
        onCheckAllChange: (event: CheckboxGroupChangeEvent) => {
          checkAllValue.value = event.target.values;
        },
      };
    },
    // React returns a fragment here, so the template keeps every root.
    template: `
      <MznFormField v-bind="fieldProps">
        <MznInput :clearable="args.clearable" placeholder="please enter text" />
      </MznFormField>
      <br />
      <br />
      <MznFormField v-bind="fieldProps">
        <MznTextarea placeholder="please enter text" :rows="4" />
      </MznFormField>
      <br />
      <br />
      <MznFormField v-bind="fieldProps">
        <MznSwitch />
      </MznFormField>
      <br />
      <br />
      <MznFormField v-bind="fieldProps">
        <MznRadioGroup>
          <MznRadio value="1">Option 1</MznRadio>
          <MznRadio value="2">Option 2</MznRadio>
          <MznRadio disabled value="3">Option 3</MznRadio>
        </MznRadioGroup>
      </MznFormField>
      <br />
      <br />
      <MznFormField v-bind="fieldProps">
        <MznCheckboxGroup>
          <MznCheckbox value="1">Option 1</MznCheckbox>
          <MznCheckbox value="2">Option 2</MznCheckbox>
          <MznCheckbox disabled value="3">Option 3</MznCheckbox>
        </MznCheckboxGroup>
      </MznFormField>
      <br />
      <br />
      <MznFormField v-bind="fieldProps">
        <MznCheckAll label="Check All">
          <MznCheckboxGroup
            :options="checkAllOptions"
            :value="checkAllValue"
            @change="onCheckAllChange"
          />
        </MznCheckAll>
      </MznFormField>
    `,
  }),
};

/** The six layout/density stories differ only in what they pass. */
function layoutStory(field: Record<string, unknown>, placeholder: string) {
  return {
    render: () => ({
      components: { MznFormField, MznInput },
      setup: () => ({ field, placeholder }),
      template: `
        <MznFormField v-bind="field">
          <MznInput :placeholder="placeholder" />
        </MznFormField>
      `,
    }),
  };
}

export const HorizontalBase: StoryObj = layoutStory(
  {
    density: FormFieldDensity.BASE,
    hintText: 'Label and input on the same row with base spacing',
    hintTextIcon: InfoFilledIcon,
    label: 'Username',
    layout: FormFieldLayout.HORIZONTAL,
    name: 'username-h-base',
  },
  'Enter username',
);

export const HorizontalTight: StoryObj = layoutStory(
  {
    density: FormFieldDensity.TIGHT,
    hintText: 'Label and input on the same row with tight spacing',
    hintTextIcon: InfoFilledIcon,
    label: 'Email',
    layout: FormFieldLayout.HORIZONTAL,
    name: 'email-h-tight',
  },
  'Enter email',
);

export const HorizontalNarrow: StoryObj = layoutStory(
  {
    density: FormFieldDensity.NARROW,
    hintText: 'Label and input on the same row with narrow spacing',
    hintTextIcon: InfoFilledIcon,
    label: 'Phone',
    layout: FormFieldLayout.HORIZONTAL,
    name: 'phone-h-narrow',
  },
  'Enter phone',
);

export const HorizontalWide: StoryObj = layoutStory(
  {
    density: FormFieldDensity.WIDE,
    hintText: 'Label and input on the same row with wide spacing',
    hintTextIcon: InfoFilledIcon,
    label: 'Address',
    layout: FormFieldLayout.HORIZONTAL,
    name: 'address-h-wide',
  },
  'Enter address',
);

export const StretchTight: StoryObj = layoutStory(
  {
    density: FormFieldDensity.TIGHT,
    hintText: 'Compact vertical spacing between label and input',
    hintTextIcon: InfoFilledIcon,
    label: 'First Name',
    layout: FormFieldLayout.STRETCH,
    name: 'firstname-s-tight',
  },
  'Enter first name',
);

export const StretchNarrow: StoryObj = layoutStory(
  {
    density: FormFieldDensity.NARROW,
    hintText: 'Standard vertical spacing between label and input',
    hintTextIcon: InfoFilledIcon,
    label: 'Last Name',
    layout: FormFieldLayout.STRETCH,
    name: 'lastname-s-narrow',
  },
  'Enter last name',
);

export const StretchWide: StoryObj = layoutStory(
  {
    density: FormFieldDensity.WIDE,
    hintText: 'Spacious vertical spacing between label and input',
    hintTextIcon: InfoFilledIcon,
    label: 'Company',
    layout: FormFieldLayout.STRETCH,
    name: 'company-s-wide',
  },
  'Enter company name',
);

export const Vertical: StoryObj = layoutStory(
  {
    hintText: 'Default vertical layout with standard spacing',
    hintTextIcon: InfoFilledIcon,
    label: 'Name',
    layout: FormFieldLayout.VERTICAL,
    name: 'name-vertical',
    required: true,
  },
  'Enter your name',
);

export const ControlFieldSlotColumnsExample: StoryObj = {
  render: () => ({
    components: { MznFormField, MznInput },
    setup: () => ({ FormFieldLayout }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px">
        <MznFormField
          label="持卡人姓名："
          :layout="FormFieldLayout.VERTICAL"
          name="cardholder-name"
        >
          <MznInput placeholder="請輸入姓名" />
        </MznFormField>
        <MznFormField
          :control-field-slot-columns="4"
          label="信用卡號："
          :layout="FormFieldLayout.VERTICAL"
          name="card-number"
        >
          <MznInput placeholder="0000" />
          <MznInput placeholder="0000" />
          <MznInput placeholder="0000" />
          <MznInput placeholder="0000" />
        </MznFormField>
        <MznFormField
          :control-field-slot-columns="2"
          label="信用卡到期日："
          :layout="FormFieldLayout.VERTICAL"
          name="card-expiry"
        >
          <MznInput placeholder="mm" />
          <MznInput placeholder="yy" />
        </MznFormField>
        <MznFormField
          label="信用卡檢查碼："
          :layout="FormFieldLayout.VERTICAL"
          name="card-cvv"
        >
          <MznInput placeholder="請輸入檢查碼" />
        </MznFormField>
      </div>
    `,
  }),
};

export const CreditCardRecipeExample: StoryObj = {
  render: () => ({
    components: { MznFormField, MznFormGroup, MznInput },
    setup: () => {
      const cardSegments = ref(['', '', '', '']);
      const expireMonth = ref('');
      const expireYear = ref('');
      const cvv = ref('');
      const name = ref('');
      const submitted = ref(false);

      const cardInputs = ref<InstanceType<typeof MznInput>[]>([]);
      const expireYearInput = ref<InstanceType<typeof MznInput> | null>(null);
      const cvvInput = ref<InstanceType<typeof MznInput> | null>(null);

      const digitsOnly = (value: string, max: number): string =>
        value.replace(/\D/g, '').slice(0, max);

      const isCardComplete = computed((): boolean =>
        cardSegments.value.every((segment) => segment.length === 4),
      );
      const isExpireComplete = computed(
        (): boolean =>
          expireMonth.value.length === 2 && expireYear.value.length === 2,
      );
      const isCvvComplete = computed((): boolean => cvv.value.length >= 3);
      const isNameComplete = computed(
        (): boolean => name.value.trim().length > 0,
      );

      const severity = (complete: boolean): SeverityWithInfo =>
        submitted.value && !complete ? 'error' : 'info';

      return {
        FormFieldLayout,
        cardInputs,
        cardSegments,
        cvv,
        cvvInput,
        cvvSeverity: computed(() => severity(isCvvComplete.value)),
        cardSeverity: computed(() => severity(isCardComplete.value)),
        expireMonth,
        expireSeverity: computed(() => severity(isExpireComplete.value)),
        expireYear,
        expireYearInput,
        handleCardSegmentChange: (index: number, event: Event): void => {
          const value = digitsOnly((event.target as HTMLInputElement).value, 4);
          const next = [...cardSegments.value];

          next[index] = value;
          cardSegments.value = next;

          if (value.length === 4 && index < 3) {
            cardInputs.value[index + 1]?.input?.focus();
          }
        },
        handleCvvChange: (event: Event): void => {
          cvv.value = digitsOnly((event.target as HTMLInputElement).value, 4);
        },
        handleExpireMonthChange: (event: Event): void => {
          expireMonth.value = digitsOnly(
            (event.target as HTMLInputElement).value,
            2,
          );

          if (expireMonth.value.length === 2) {
            expireYearInput.value?.input?.focus();
          }
        },
        handleExpireYearChange: (event: Event): void => {
          expireYear.value = digitsOnly(
            (event.target as HTMLInputElement).value,
            2,
          );

          if (expireYear.value.length === 2) {
            cvvInput.value?.input?.focus();
          }
        },
        isCardComplete,
        isCvvComplete,
        isExpireComplete,
        isNameComplete,
        name,
        nameSeverity: computed(() => severity(isNameComplete.value)),
        submitted,
      };
    },
    template: `
      <div style="max-width: 480px">
        <MznFormGroup title="信用卡資訊">
          <MznFormField
            :hint-text="submitted && !isNameComplete ? '請輸入持卡人姓名' : undefined"
            label="持卡人姓名："
            :layout="FormFieldLayout.VERTICAL"
            name="cardholder-name"
            :severity="nameSeverity"
          >
            <MznInput
              placeholder="請輸入姓名"
              :value="name"
              @change="name = $event.target.value"
            />
          </MznFormField>
          <MznFormField
            :control-field-slot-columns="4"
            :hint-text="submitted && !isCardComplete ? '請輸入完整卡號' : undefined"
            label="信用卡號："
            :layout="FormFieldLayout.VERTICAL"
            name="card-number"
            :severity="cardSeverity"
          >
            <MznInput
              v-for="(segment, i) in cardSegments"
              :key="i"
              :ref="(element) => { cardInputs[i] = element; }"
              placeholder="0000"
              :value="segment"
              @change="handleCardSegmentChange(i, $event)"
            />
          </MznFormField>
          <MznFormField
            :control-field-slot-columns="2"
            :hint-text="submitted && !isExpireComplete ? '請輸入有效期限' : undefined"
            label="有效期限："
            :layout="FormFieldLayout.VERTICAL"
            name="card-expiry"
            :severity="expireSeverity"
          >
            <MznInput
              placeholder="MM"
              :value="expireMonth"
              @change="handleExpireMonthChange"
            />
            <MznInput
              ref="expireYearInput"
              placeholder="YY"
              :value="expireYear"
              @change="handleExpireYearChange"
            />
          </MznFormField>
          <MznFormField
            :hint-text="submitted && !isCvvComplete ? '請輸入 CVV' : undefined"
            label="檢查碼："
            :layout="FormFieldLayout.VERTICAL"
            name="card-cvv"
            :severity="cvvSeverity"
          >
            <MznInput
              ref="cvvInput"
              placeholder="CVV"
              :value="cvv"
              @change="handleCvvChange"
            />
          </MznFormField>
        </MznFormGroup>
        <div style="margin-top: 16px">
          <button type="button" @click="submitted = true">送出</button>
          <span
            v-if="submitted && isCardComplete && isExpireComplete && isCvvComplete && isNameComplete"
            style="margin-left: 12px; color: green"
          >✓ 驗證通過</span>
        </div>
      </div>
    `,
  }),
};
