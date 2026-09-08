import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznPasswordStrengthIndicator from './password-strength-indicator.vue';
import type { PasswordStrengthIndicatorProps } from './password-strength-indicator.types';

export default {
  component: MznPasswordStrengthIndicator,
  title: 'Data Entry/Input/PasswordStrengthIndicator',
} as Meta;

type Story = StoryObj<typeof MznPasswordStrengthIndicator>;

const infoHints: PasswordStrengthIndicatorProps['hintTexts'] = [
  { severity: 'info', hint: '密碼長度應超過 8 個字元' },
  { severity: 'info', hint: '至少 2 種以上字元組合 (英文大小、數字、符號)' },
  { severity: 'info', hint: '需要包含至少一個數字' },
];

const mixedHints: PasswordStrengthIndicatorProps['hintTexts'] = [
  { severity: 'success', hint: '密碼長度應超過 8 個字元' },
  { severity: 'success', hint: '至少 2 種以上字元組合 (英文大小、數字、符號)' },
  { severity: 'info', hint: '需要包含至少一個特殊符號' },
];

const successHints: PasswordStrengthIndicatorProps['hintTexts'] = [
  { severity: 'success', hint: '密碼長度應超過 8 個字元' },
  { severity: 'success', hint: '至少 2 種以上字元組合 (英文大小、數字、符號)' },
  { severity: 'success', hint: '包含數字和特殊符號' },
];

export const Playground: Story = {
  render: () => ({
    components: { MznPasswordStrengthIndicator },
    setup: () => ({ infoHints, mixedHints, successHints }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 400px">
        <div>
          <h3 style="margin-bottom: 12px">Weak (低)</h3>
          <MznPasswordStrengthIndicator strength="weak" />
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Medium (中)</h3>
          <MznPasswordStrengthIndicator strength="medium" />
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Strong (高)</h3>
          <MznPasswordStrengthIndicator strength="strong" />
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Custom Strength Text</h3>
          <MznPasswordStrengthIndicator
            strength="strong"
            strength-text="Very Strong"
            strength-text-prefix="Password Strength: "
          />
        </div>

        <div>
          <h3 style="margin-bottom: 12px">With Hint Texts</h3>
          <MznPasswordStrengthIndicator strength="weak" :hint-texts="infoHints" />
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Medium with Mixed Hint Texts</h3>
          <MznPasswordStrengthIndicator strength="medium" :hint-texts="mixedHints" />
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Strong with Success Hints</h3>
          <MznPasswordStrengthIndicator strength="strong" :hint-texts="successHints" />
        </div>
      </div>
    `,
  }),
};
