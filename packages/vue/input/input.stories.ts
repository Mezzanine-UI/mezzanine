import type { Meta } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import { CopyIcon, UserIcon } from '@mezzanine-ui/icons';
import { formatNumberWithCommas } from '../_internal/format-number-with-commas';
import { parseNumberWithCommas } from '../_internal/parse-number-with-commas';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import MznInput from './input.vue';
import type { InputProps } from './input.types';
import type { PasswordStrengthIndicatorProps } from './password-strength-indicator.types';

export default {
  title: 'Data Entry/Input',
} as Meta;

const containerStyle = { margin: '0 0 24px 0' };
const typoStyle = { margin: '0 0 12px 0' };
const columnContainerStyle = {
  ...containerStyle,
  display: 'flex',
  flexFlow: 'column',
  gap: '12px',
};

export const BaseInput = () => ({
  components: { MznInput, MznTypography },
  setup: () => ({ containerStyle, typoStyle }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <MznTypography variant="h2" :style="typoStyle">
        Base Input
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Normal
        </MznTypography>
        <MznInput name="input1" placeholder="請輸入文字" />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          With Value
        </MznTypography>
        <MznInput name="input2" value="Example" />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Error
        </MznTypography>
        <MznInput name="input3" placeholder="請輸入文字" error />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Disabled
        </MznTypography>
        <MznInput name="input4" placeholder="請輸入文字" disabled />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Read Only
        </MznTypography>
        <MznInput
          name="input5"
          placeholder="請輸入文字"
          value="Example"
          readonly
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Sub
        </MznTypography>
        <MznInput name="input-sub" size="sub" placeholder="請輸入文字" />
      </section>
    </div>
  `,
});

export const WithAffixInput = () => ({
  components: { MznIcon, MznInput, MznTypography },
  setup: () => ({
    UserIcon,
    containerStyle,
    sectionStyle: {
      ...containerStyle,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    typoStyle,
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <MznTypography variant="h2" :style="typoStyle">
        With Affix Input
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Icon Leading
        </MznTypography>
        <MznInput variant="affix" placeholder="Placeholder">
          <template #prefix><MznIcon :icon="UserIcon" /></template>
        </MznInput>
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Prefix
        </MznTypography>
        <MznInput variant="affix" placeholder="Placeholder">
          <template #prefix>Prefix</template>
        </MznInput>
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Suffix
        </MznTypography>
        <MznInput variant="affix" placeholder="Placeholder">
          <template #suffix>Suffix</template>
        </MznInput>
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Prefix & Suffix
        </MznTypography>
        <MznInput variant="affix" placeholder="Placeholder">
          <template #prefix>Prefix</template>
          <template #suffix>Suffix</template>
        </MznInput>
      </section>

      <section :style="sectionStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Sub
        </MznTypography>
        <MznInput variant="affix" size="sub" placeholder="Placeholder">
          <template #prefix><MznIcon :icon="UserIcon" /></template>
        </MznInput>
        <MznInput variant="affix" size="sub" placeholder="Placeholder">
          <template #prefix>Prefix</template>
        </MznInput>
        <MznInput variant="affix" size="sub" placeholder="Placeholder">
          <template #suffix>Suffix</template>
        </MznInput>
        <MznInput variant="affix" size="sub" placeholder="Placeholder">
          <template #prefix>Prefix</template>
          <template #suffix>Suffix</template>
        </MznInput>
      </section>
    </div>
  `,
});

export const SearchInput = () => ({
  components: { MznInput, MznTypography },
  setup: () => {
    const searchValue = ref('');

    return { containerStyle, searchValue, typoStyle };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <MznTypography variant="h2" :style="typoStyle">
        Search Input
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Default (with SearchIcon and clearable)
        </MznTypography>
        <MznInput
          variant="search"
          :value="searchValue"
          placeholder="搜尋..."
          @change="searchValue = $event.target.value"
          @clear="searchValue = ''"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Not Clearable
        </MznTypography>
        <MznInput variant="search" :clearable="false" placeholder="搜尋..." />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Sizes - Main
        </MznTypography>
        <MznInput variant="search" size="main" placeholder="搜尋..." />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Sizes - Sub
        </MznTypography>
        <MznInput variant="search" size="sub" placeholder="搜尋..." />
      </section>
    </div>
  `,
});

export const NumberInput = () => ({
  components: { MznInput, MznTypography },
  setup: () => ({ containerStyle, typoStyle }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 120px">
      <MznTypography variant="h2" :style="typoStyle">
        Number Input
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Basic Number
        </MznTypography>
        <MznInput variant="number" placeholder="0" />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          With Min/Max
        </MznTypography>
        <MznInput variant="number" :min="0" :max="100" default-value="50" />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Sub
        </MznTypography>
        <MznInput variant="number" :step="0.5" default-value="1.5" size="sub" />
      </section>
    </div>
  `,
});

export const MeasureInput = () => ({
  components: { MznInput, MznTypography },
  setup: () => {
    const spinNumber = ref('1000');
    const noop = (): void => {
      /** custom listener */
    };

    return { containerStyle, noop, spinNumber, typoStyle };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 300px">
      <MznTypography variant="h2" :style="typoStyle">
        Measure Input
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Prefix
        </MznTypography>
        <MznInput variant="measure" default-value="1000" placeholder="0">
          <template #prefix>NT</template>
        </MznInput>
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Suffix
        </MznTypography>
        <MznInput
          variant="measure"
          :min="0"
          :max="10000"
          :step="100"
          default-value="100"
        >
          <template #suffix>NT</template>
        </MznInput>
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Text Only
        </MznTypography>
        <MznInput variant="measure" default-value="175" />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Spinner
        </MznTypography>
        <MznInput
          variant="measure"
          :value="spinNumber"
          :min="0"
          :max="10000"
          :step="100"
          show-spinner
          @change="spinNumber = $event.target.value"
          @spin-up="noop"
          @spin-down="noop"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Main
        </MznTypography>
        <MznInput variant="measure" size="main" default-value="70" />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Sub
        </MznTypography>
        <MznInput variant="measure" size="sub" default-value="70" />
      </section>
    </div>
  `,
});

export const ActionInput = () => ({
  components: { MznInput, MznTypography },
  setup: () => ({
    containerStyle: columnContainerStyle,
    copyAction: {
      position: 'suffix' as const,
      icon: CopyIcon,
      label: '複製',
      onClick: () => alert('Copied!'),
    },
    copyActionPrefix: {
      position: 'prefix' as const,
      icon: CopyIcon,
      label: '複製',
      onClick: () => alert('Copied!'),
    },
    quietAction: {
      position: 'suffix' as const,
      icon: CopyIcon,
      label: '複製',
      onClick: () => {},
    },
    quietActionEnabled: {
      position: 'suffix' as const,
      icon: CopyIcon,
      label: '複製',
      onClick: () => {},
      disabled: false,
    },
    typoStyle,
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 300px">
      <MznTypography variant="h2" :style="typoStyle">
        Action Input
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Copy Action
        </MznTypography>
        <MznInput
          variant="action"
          default-value="https://example.com/share/abc123"
          :action-button="copyAction"
        />
        <MznInput
          variant="action"
          default-value="https://example.com/share/abc123"
          :action-button="copyActionPrefix"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Disabled Button
        </MznTypography>
        <MznInput
          variant="action"
          default-value="content"
          disabled
          :action-button="quietAction"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Readonly with Action Disabled (Default)
        </MznTypography>
        <MznInput
          variant="action"
          default-value="content"
          readonly
          :action-button="quietAction"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Readonly with Action Enabled
        </MznTypography>
        <MznInput
          variant="action"
          default-value="content"
          readonly
          :action-button="quietActionEnabled"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Main
        </MznTypography>
        <MznInput
          variant="action"
          size="main"
          default-value="example"
          :action-button="quietAction"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Sub
        </MznTypography>
        <MznInput
          variant="action"
          size="sub"
          default-value="example"
          :action-button="quietAction"
        />
      </section>
    </div>
  `,
});

export const SelectInput = () => ({
  components: { MznInput, MznTypography },
  setup: () => {
    const domainOptions = [
      { id: '.com', name: '.com' },
      { id: '.tw', name: '.tw' },
      { id: '.cn', name: '.cn' },
      { id: '.net', name: '.net' },
    ];

    const prefixValue = ref('.com');
    const suffixValue = ref('.com');
    const bothValue = ref('.com');
    const sizeMainValue = ref('.com');
    const sizeSubValue = ref('.com');
    const keepOpenValue = ref('.com');

    // Helper to create select input props, the way React's does
    const createSelectProps = (
      selectedValue: string,
      position: 'prefix' | 'suffix' | 'both',
      additionalProps?: Partial<InputProps>,
      selectButtonOverrides?: { closeOnSelect?: boolean },
    ): InputProps => ({
      variant: 'select',
      options: domainOptions,
      selectedValue,
      selectButton: {
        position,
        value: selectedValue,
        ...selectButtonOverrides,
      },
      ...additionalProps,
    });

    return {
      bothValue,
      containerStyle: columnContainerStyle,
      createSelectProps,
      keepOpenValue,
      prefixValue,
      sizeMainValue,
      sizeSubValue,
      suffixValue,
      typoStyle,
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px">
      <MznTypography variant="h2" :style="typoStyle">
        Select Input
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Domain Selector
        </MznTypography>
        <MznInput
          v-bind="createSelectProps(prefixValue, 'prefix', { defaultValue: 'https://', placeholder: 'Domain' })"
          @select="prefixValue = $event"
        />
        <MznInput
          v-bind="createSelectProps(suffixValue, 'suffix', { defaultValue: 'https://', placeholder: 'Domain' })"
          @select="suffixValue = $event"
        />
        <MznInput
          v-bind="createSelectProps(bothValue, 'both', { defaultValue: 'https://', placeholder: 'Domain' })"
          @select="bothValue = $event"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Main
        </MznTypography>
        <MznInput
          v-bind="createSelectProps(sizeMainValue, 'suffix', { size: 'main', placeholder: 'Placeholder' })"
          @select="sizeMainValue = $event"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Sub
        </MznTypography>
        <MznInput
          v-bind="createSelectProps(sizeSubValue, 'suffix', { size: 'sub', placeholder: 'Placeholder' })"
          @select="sizeSubValue = $event"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          closeOnSelect = false (dropdown stays open after selecting)
        </MznTypography>
        <MznInput
          v-bind="createSelectProps(keepOpenValue, 'suffix', { placeholder: 'Placeholder' }, { closeOnSelect: false })"
          @select="keepOpenValue = $event"
        />
      </section>
    </div>
  `,
});

export const PasswordInput = () => ({
  components: { MznInput, MznTypography },
  setup: () => {
    const password = ref('');

    const calculatePasswordStrength = (
      pwd: string,
    ): PasswordStrengthIndicatorProps => {
      const length = pwd.length;
      const hasLowerCase = /[a-z]/.test(pwd);
      const hasUpperCase = /[A-Z]/.test(pwd);
      const hasNumbers = /\d/.test(pwd);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

      const hasMinLength = length >= 8;
      const hasMixedCase = hasLowerCase && hasUpperCase;
      const hasNumberOrSpecial = hasNumbers || hasSpecialChars;

      const allCriteriaMet = hasMinLength && hasMixedCase && hasNumberOrSpecial;

      const hintTexts: PasswordStrengthIndicatorProps['hintTexts'] = [
        {
          severity: hasMinLength ? 'success' : 'info',
          hint: '至少 8 個字元',
        },
        {
          severity: hasMixedCase ? 'success' : 'info',
          hint: '包含大小寫字母',
        },
        {
          severity: hasNumberOrSpecial ? 'success' : 'info',
          hint: '包含數字或特殊符號',
        },
      ];

      return {
        strength: allCriteriaMet ? 'strong' : length >= 6 ? 'medium' : 'weak',
        hintTexts,
      };
    };

    const passwordStrengthIndicator = computed(() =>
      calculatePasswordStrength(password.value),
    );

    return { containerStyle, password, passwordStrengthIndicator, typoStyle };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 300px">
      <MznTypography variant="h2" :style="typoStyle">
        Password Input
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Basic Password
        </MznTypography>
        <MznInput variant="password" placeholder="請輸入密碼" />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          With Password Strength Indicator
        </MznTypography>
        <MznInput
          variant="password"
          placeholder="請輸入密碼"
          :value="password"
          show-password-strength-indicator
          :password-strength-indicator="passwordStrengthIndicator"
          @change="password = $event.target.value"
        />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Main
        </MznTypography>
        <MznInput variant="password" size="main" placeholder="請輸入密碼" />
      </section>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Size Sub
        </MznTypography>
        <MznInput variant="password" size="sub" placeholder="請輸入密碼" />
      </section>
    </div>
  `,
});

export const FormatterAndParser = () => ({
  components: { MznInput, MznTypography },
  setup: () => {
    const currencyValue = ref('');

    return {
      containerStyle: columnContainerStyle,
      currencyValue,
      formatter: (value: string) => formatNumberWithCommas(value),
      parser: (value: string) => parseNumberWithCommas(value)?.toString() ?? '',
      typoStyle,
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px">
      <MznTypography variant="h2" :style="typoStyle">
        Formatter+Parser
      </MznTypography>

      <section :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">
          Currency Format (Thousand Separator)
        </MznTypography>
        <MznInput
          variant="measure"
          show-spinner
          placeholder="輸入金額"
          :value="currencyValue"
          :formatter="formatter"
          :parser="parser"
          @change="currencyValue = $event.target.value"
        />
        <MznTypography variant="caption" color="text-neutral">
          Raw value: {{ currencyValue }}
        </MznTypography>
      </section>
    </div>
  `,
});
