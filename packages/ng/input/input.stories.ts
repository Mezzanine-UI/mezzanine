import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CopyIcon, UserIcon } from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import { MznInput } from './input.component';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * Wrapper component for SearchInput story to provide interactive state.
 */
@Component({
  selector: 'story-search-input',
  standalone: true,
  imports: [MznInput],
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;"
          >Search Input</p
        >
      </div>
      <div>
        <p style="margin: 0 0 12px 0;"
          >Default (with SearchIcon and clearable)</p
        >
        <mzn-input
          variant="search"
          [value]="searchValue"
          [clearable]="true"
          placeholder="搜尋..."
          (valueChange)="searchValue = $event"
        />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Not Clearable</p>
        <mzn-input variant="search" [clearable]="false" placeholder="搜尋..." />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Sizes - Main</p>
        <mzn-input variant="search" size="main" placeholder="搜尋..." />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Sizes - Sub</p>
        <mzn-input variant="search" size="sub" placeholder="搜尋..." />
      </div>
    </div>
  `,
})
class StorySearchInput {
  searchValue = '';
}

/**
 * Wrapper component for MeasureInput story to provide interactive spinner state.
 */
@Component({
  selector: 'story-measure-input',
  standalone: true,
  imports: [MznInput],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 300px;"
    >
      <div>
        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;"
          >Measure Input</p
        >
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Prefix</p>
        <mzn-input
          variant="measure"
          prefixText="NT"
          value="1000"
          placeholder="0"
        />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Suffix</p>
        <mzn-input
          variant="measure"
          suffixText="NT"
          [min]="0"
          [max]="10000"
          [step]="100"
          value="100"
        />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Text Only</p>
        <mzn-input variant="measure" value="175" />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Spinner</p>
        <mzn-input
          variant="measure"
          [value]="spinNumber"
          [min]="0"
          [max]="10000"
          [step]="100"
          [showSpinner]="true"
          (valueChange)="spinNumber = $event"
        />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Size Main</p>
        <mzn-input variant="measure" size="main" value="70" />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Size Sub</p>
        <mzn-input variant="measure" size="sub" value="70" />
      </div>
    </div>
  `,
})
class StoryMeasureInput {
  spinNumber = '1000';
}

/**
 * Wrapper component for PasswordInput story to provide interactive strength calculation.
 */
@Component({
  selector: 'story-password-input',
  standalone: true,
  imports: [MznInput],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 300px;"
    >
      <div>
        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;"
          >Password Input</p
        >
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Basic Password</p>
        <mzn-input variant="password" placeholder="請輸入密碼" />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">With Password Strength Indicator</p>
        <mzn-input
          variant="password"
          placeholder="請輸入密碼"
          [value]="password"
          [showPasswordStrengthIndicator]="true"
          [passwordStrengthIndicator]="passwordStrengthIndicator"
          (valueChange)="onPasswordChange($event)"
        />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Size Main</p>
        <mzn-input variant="password" size="main" placeholder="請輸入密碼" />
      </div>
      <div>
        <p style="margin: 0 0 12px 0;">Size Sub</p>
        <mzn-input variant="password" size="sub" placeholder="請輸入密碼" />
      </div>
    </div>
  `,
})
class StoryPasswordInput {
  password = '';

  passwordStrengthIndicator: {
    readonly strength: 'weak' | 'medium' | 'strong';
    readonly hintTexts: readonly {
      severity: 'success' | 'error' | 'warning' | 'info';
      hint: string;
    }[];
  } = {
    strength: 'weak',
    hintTexts: [
      { severity: 'info', hint: '至少 8 個字元' },
      { severity: 'info', hint: '包含大小寫字母' },
      { severity: 'info', hint: '包含數字或特殊符號' },
    ],
  };

  onPasswordChange(pwd: string): void {
    this.password = pwd;

    const hasMinLength = pwd.length >= 8;
    const hasMixedCase = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
    const hasNumberOrSpecial =
      /\d/.test(pwd) || /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const allCriteriaMet = hasMinLength && hasMixedCase && hasNumberOrSpecial;

    this.passwordStrengthIndicator = {
      strength: allCriteriaMet ? 'strong' : pwd.length >= 6 ? 'medium' : 'weak',
      hintTexts: [
        { severity: hasMinLength ? 'success' : 'info', hint: '至少 8 個字元' },
        { severity: hasMixedCase ? 'success' : 'info', hint: '包含大小寫字母' },
        {
          severity: hasNumberOrSpecial ? 'success' : 'info',
          hint: '包含數字或特殊符號',
        },
      ],
    };
  }
}

/**
 * Wrapper component for FormatterAndParser story.
 */
@Component({
  selector: 'story-formatter-parser',
  standalone: true,
  imports: [MznInput],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;"
    >
      <div>
        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;"
          >Formatter+Parser</p
        >
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="margin: 0 0 12px 0;">Currency Format (Thousand Separator)</p>
        <mzn-input
          variant="measure"
          placeholder="輸入金額"
          [value]="currencyValue"
          [formatter]="formatter"
          [parser]="parser"
          [showSpinner]="true"
          (valueChange)="currencyValue = $event"
        />
        <p style="margin: 0; font-size: 12px; color: #666;">
          Raw value: {{ currencyValue }}
        </p>
      </div>
    </div>
  `,
})
class StoryFormatterParser {
  currencyValue = '';

  formatter = (value: string): string => {
    if (!value.trim()) return '';

    const num = Number(value);

    return Number.isFinite(num)
      ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 20 }).format(
          num,
        )
      : '';
  };

  parser = (value: string): string => {
    const normalized = value.replace(/,/g, '');

    if (!normalized.trim()) return '';

    const num = Number(normalized);

    return Number.isFinite(num) ? num.toString() : '';
  };
}

/**
 * Wrapper component for SelectInput story to provide interactive dropdown state.
 */
@Component({
  selector: 'story-select-input',
  standalone: true,
  imports: [MznInput],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;"
    >
      <div>
        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;"
          >Select Input</p
        >
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="margin: 0 0 12px 0;">Domain Selector</p>
        <mzn-input
          variant="select"
          value="https://"
          placeholder="Domain"
          [selectButton]="{ position: 'prefix', value: prefixValue }"
          [selectOptions]="domainOptions"
          (selectOptionSelected)="prefixValue = $event.id"
        />
        <mzn-input
          variant="select"
          value="https://"
          placeholder="Domain"
          [selectButton]="{ position: 'suffix', value: suffixValue }"
          [selectOptions]="domainOptions"
          (selectOptionSelected)="suffixValue = $event.id"
        />
        <mzn-input
          variant="select"
          value="https://"
          placeholder="Domain"
          [selectButton]="{ position: 'both', value: bothValue }"
          [selectOptions]="domainOptions"
          (selectOptionSelected)="bothValue = $event.id"
        />
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="margin: 0 0 12px 0;">Size Main</p>
        <mzn-input
          variant="select"
          size="main"
          placeholder="Placeholder"
          [selectButton]="{ position: 'suffix', value: sizeMainValue }"
          [selectOptions]="domainOptions"
          (selectOptionSelected)="sizeMainValue = $event.id"
        />
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="margin: 0 0 12px 0;">Size Sub</p>
        <mzn-input
          variant="select"
          size="sub"
          placeholder="Placeholder"
          [selectButton]="{ position: 'suffix', value: sizeSubValue }"
          [selectOptions]="domainOptions"
          (selectOptionSelected)="sizeSubValue = $event.id"
        />
      </div>
    </div>
  `,
})
class StorySelectInput {
  readonly domainOptions = [
    { id: '.com', name: '.com' },
    { id: '.tw', name: '.tw' },
    { id: '.cn', name: '.cn' },
    { id: '.net', name: '.net' },
  ];

  prefixValue = '.com';
  suffixValue = '.com';
  bothValue = '.com';
  sizeMainValue = '.com';
  sizeSubValue = '.com';
}

const meta: Meta<MznInput> = {
  title: 'Data Entry/Input',
  component: MznInput,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        MznInput,
        MznIcon,
        StorySearchInput,
        StoryMeasureInput,
        StoryPasswordInput,
        StorySelectInput,
        StoryFormatterParser,
      ],
    }),
  ],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: { type: 'boolean' },
      description: '是否為錯誤狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '是否撐滿寬度',
      table: { defaultValue: { summary: 'true' } },
    },
    placeholder: {
      control: { type: 'text' },
      description: '佔位文字',
    },
    variant: {
      control: { type: 'select' },
      options: [
        'base',
        'search',
        'password',
        'affix',
        'measure',
        'number',
        'action',
        'select',
      ],
      description: 'Input 變體',
      table: { defaultValue: { summary: "'base'" } },
    },
    clearable: {
      control: { type: 'boolean' },
      description: '是否顯示清除按鈕',
      table: { defaultValue: { summary: 'false' } },
    },
    prefixText: {
      control: { type: 'text' },
      description: '前綴文字（僅 affix 變體）',
    },
    suffixText: {
      control: { type: 'text' },
      description: '後綴文字（僅 affix / measure 變體）',
    },
  },
};

export default meta;

type Story = StoryObj<MznInput>;

export const BaseInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">Base Input</p>
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Normal</p>
          <mzn-input placeholder="請輸入文字" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">With Value</p>
          <mzn-input value="Example" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Error</p>
          <mzn-input placeholder="請輸入文字" [error]="true" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Disabled</p>
          <mzn-input placeholder="請輸入文字" [disabled]="true" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Read Only</p>
          <mzn-input placeholder="請輸入文字" value="Example" [readonly]="true" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Size Sub</p>
          <mzn-input size="sub" placeholder="請輸入文字" />
        </div>
      </div>
    `,
  }),
};

export const WithAffixInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { UserIcon: UserIcon as IconDefinition },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">With Affix Input</p>
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Icon Leading</p>
          <mzn-input variant="affix" [prefixIcon]="UserIcon" placeholder="Placeholder" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Prefix</p>
          <mzn-input variant="affix" prefixText="Prefix" placeholder="Placeholder" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Suffix</p>
          <mzn-input variant="affix" suffixText="Suffix" placeholder="Placeholder" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Prefix &amp; Suffix</p>
          <mzn-input variant="affix" prefixText="Prefix" suffixText="Suffix" placeholder="Placeholder" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0 0 12px 0;">Size Sub</p>
          <mzn-input variant="affix" size="sub" [prefixIcon]="UserIcon" placeholder="Placeholder" />
          <mzn-input variant="affix" size="sub" prefixText="Prefix" placeholder="Placeholder" />
          <mzn-input variant="affix" size="sub" suffixText="Suffix" placeholder="Placeholder" />
          <mzn-input variant="affix" size="sub" prefixText="Prefix" suffixText="Suffix" placeholder="Placeholder" />
        </div>
      </div>
    `,
  }),
};

export const SearchInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-search-input />`,
  }),
};

export const NumberInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 120px;">
        <div>
          <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">Number Input</p>
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Basic Number</p>
          <mzn-input variant="number" placeholder="0" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">With Min/Max</p>
          <mzn-input variant="number" [min]="0" [max]="100" value="50" />
        </div>
        <div>
          <p style="margin: 0 0 12px 0;">Size Sub</p>
          <mzn-input variant="number" [step]="0.5" value="1.5" size="sub" />
        </div>
      </div>
    `,
  }),
};

export const MeasureInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-measure-input />`,
  }),
};

export const ActionInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      CopyIcon,
      copyAction: {
        position: 'suffix' as const,
        icon: CopyIcon,
        label: '複製',
        onClick: (): void => {
          alert('Copied!');
        },
      },
      prefixCopyAction: {
        position: 'prefix' as const,
        icon: CopyIcon,
        label: '複製',
        onClick: (): void => {
          alert('Copied!');
        },
      },
      readonlyActionEnabled: {
        position: 'suffix' as const,
        icon: CopyIcon,
        label: '複製',
        disabled: false,
        onClick: (): void => {
          alert('Copied!');
        },
      },
      readonlyActionDefault: {
        position: 'suffix' as const,
        icon: CopyIcon,
        label: '複製',
        onClick: (): void => {},
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 300px;">
        <div>
          <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">Action Input</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0 0 12px 0;">Copy Action</p>
          <mzn-input variant="action" value="https://example.com/share/abc123" [actionButton]="copyAction" />
          <mzn-input variant="action" value="https://example.com/share/abc123" [actionButton]="prefixCopyAction" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0 0 12px 0;">Disabled Button</p>
          <mzn-input variant="action" value="content" [disabled]="true" [actionButton]="copyAction" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0 0 12px 0;">Readonly with Action Disabled (Default)</p>
          <mzn-input variant="action" value="content" [readonly]="true" [actionButton]="readonlyActionDefault" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0 0 12px 0;">Readonly with Action Enabled</p>
          <mzn-input variant="action" value="content" [readonly]="true" [actionButton]="readonlyActionEnabled" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0 0 12px 0;">Size Main</p>
          <mzn-input variant="action" size="main" value="example" [actionButton]="copyAction" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0 0 12px 0;">Size Sub</p>
          <mzn-input variant="action" size="sub" value="example" [actionButton]="copyAction" />
        </div>
      </div>
    `,
  }),
};

export const SelectInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-select-input />`,
  }),
};

export const PasswordInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-password-input />`,
  }),
};

export const FormatterAndParser: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-formatter-parser />`,
  }),
};
