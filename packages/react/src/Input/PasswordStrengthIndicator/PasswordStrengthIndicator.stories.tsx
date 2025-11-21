import type { Meta, StoryObj } from '@storybook/react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const meta: Meta<typeof PasswordStrengthIndicator> = {
  title: 'Data Entry/Input/PasswordStrengthIndicator',
  component: PasswordStrengthIndicator,
};

export default meta;

type Story = StoryObj<typeof PasswordStrengthIndicator>;

export const Playground: Story = {
  render: () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          maxWidth: '400px',
        }}
      >
        <div>
          <h3 style={{ marginBottom: '12px' }}>Weak (低)</h3>
          <PasswordStrengthIndicator strength="weak" />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Medium (中)</h3>
          <PasswordStrengthIndicator strength="medium" />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Strong (高)</h3>
          <PasswordStrengthIndicator strength="strong" />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Custom Strength Text</h3>
          <PasswordStrengthIndicator
            strength="strong"
            strengthText="Very Strong"
            strengthTextPrefix="Password Strength: "
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>With Hint Texts</h3>
          <PasswordStrengthIndicator
            strength="weak"
            hintTexts={[
              { severity: 'info', hint: '密碼長度應超過 8 個字元' },
              {
                severity: 'info',
                hint: '至少 2 種以上字元組合 (英文大小、數字、符號)',
              },
              { severity: 'info', hint: '需要包含至少一個數字' },
            ]}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Medium with Mixed Hint Texts</h3>
          <PasswordStrengthIndicator
            strength="medium"
            hintTexts={[
              { severity: 'success', hint: '密碼長度應超過 8 個字元' },
              {
                severity: 'success',
                hint: '至少 2 種以上字元組合 (英文大小、數字、符號)',
              },
              { severity: 'info', hint: '需要包含至少一個特殊符號' },
            ]}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Strong with Success Hints</h3>
          <PasswordStrengthIndicator
            strength="strong"
            hintTexts={[
              { severity: 'success', hint: '密碼長度應超過 8 個字元' },
              {
                severity: 'success',
                hint: '至少 2 種以上字元組合 (英文大小、數字、符號)',
              },
              { severity: 'success', hint: '包含數字和特殊符號' },
            ]}
          />
        </div>
      </div>
    );
  },
};
