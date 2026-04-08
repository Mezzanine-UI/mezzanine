import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznPasswordStrengthIndicator } from './password-strength-indicator.component';

export default {
  title: 'Data Entry/Input/PasswordStrengthIndicator',
  decorators: [
    moduleMetadata({
      imports: [MznPasswordStrengthIndicator],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 400px;">
        <div>
          <h3 style="margin-bottom: 12px;">Weak (低)</h3>
          <mzn-password-strength-indicator strength="weak" />
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Medium (中)</h3>
          <mzn-password-strength-indicator strength="medium" />
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Strong (高)</h3>
          <mzn-password-strength-indicator strength="strong" />
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Custom Strength Text</h3>
          <mzn-password-strength-indicator
            strength="strong"
            strengthText="Very Strong"
            strengthTextPrefix="Password Strength: "
          />
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">With Hint Texts</h3>
          <mzn-password-strength-indicator
            strength="weak"
            [hintTexts]="[
              { severity: 'info', hint: '密碼長度應超過 8 個字元' },
              { severity: 'info', hint: '至少 2 種以上字元組合 (英文大小、數字、符號)' },
              { severity: 'info', hint: '需要包含至少一個數字' }
            ]"
          />
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Medium with Mixed Hint Texts</h3>
          <mzn-password-strength-indicator
            strength="medium"
            [hintTexts]="[
              { severity: 'success', hint: '密碼長度應超過 8 個字元' },
              { severity: 'success', hint: '至少 2 種以上字元組合 (英文大小、數字、符號)' },
              { severity: 'info', hint: '需要包含至少一個特殊符號' }
            ]"
          />
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Strong with Success Hints</h3>
          <mzn-password-strength-indicator
            strength="strong"
            [hintTexts]="[
              { severity: 'success', hint: '密碼長度應超過 8 個字元' },
              { severity: 'success', hint: '至少 2 種以上字元組合 (英文大小、數字、符號)' },
              { severity: 'success', hint: '包含數字和特殊符號' }
            ]"
          />
        </div>
      </div>
    `,
  }),
};
