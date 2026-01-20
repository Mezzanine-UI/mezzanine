import { CopyIcon, UserIcon } from '@mezzanine-ui/icons';
import { useState } from 'react';
import Input, { SelectInputProps } from '.';
import Icon from '../Icon';
import Typography from '../Typography';
import { formatNumberWithCommas } from '../utils/format-number-with-commas';
import { parseNumberWithCommas } from '../utils/parse-number-with-commas';
import { PasswordStrengthIndicatorProps } from './PasswordStrengthIndicator';

export default {
  title: 'Data Entry/Input',
};

export const BaseInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography variant="h2" style={typoStyle}>
        Base Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Normal
        </Typography>
        <Input name="input1" placeholder="請輸入文字" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With Value
        </Typography>
        <Input name="input2" value="Example" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Error
        </Typography>
        <Input name="input3" placeholder="請輸入文字" error />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Disabled
        </Typography>
        <Input name="input4" placeholder="請輸入文字" disabled />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Read Only
        </Typography>
        <Input
          name="input5"
          placeholder="請輸入文字"
          value="Example"
          readonly
        />
      </section>
    </div>
  );
};

export const WithAffixInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography variant="h2" style={typoStyle}>
        With Affix Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Icon Leading
        </Typography>
        <Input
          variant="affix"
          prefix={<Icon icon={UserIcon} />}
          placeholder="Placeholder"
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Prefix
        </Typography>
        <Input variant="affix" prefix="Prefix" placeholder="Placeholder" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Suffix
        </Typography>
        <Input variant="affix" suffix="Suffix" placeholder="Placeholder" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Prefix & Suffix
        </Typography>
        <Input
          variant="affix"
          prefix="Prefix"
          suffix="Suffix"
          placeholder="Placeholder"
        />
      </section>
    </div>
  );
};

export const SearchInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography variant="h2" style={typoStyle}>
        Search Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Default (with SearchIcon and clearable)
        </Typography>
        <Input
          variant="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="搜尋..."
          onClear={() => setSearchValue('')}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Not Clearable
        </Typography>
        <Input variant="search" clearable={false} placeholder="搜尋..." />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Sizes - Main
        </Typography>
        <Input variant="search" size="main" placeholder="搜尋..." />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Sizes - Sub
        </Typography>
        <Input variant="search" size="sub" placeholder="搜尋..." />
      </section>
    </div>
  );
};

export const NumberInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '120px',
      }}
    >
      <Typography variant="h2" style={typoStyle}>
        Number Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Basic Number
        </Typography>
        <Input variant="number" placeholder="0" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With Min/Max
        </Typography>
        <Input variant="number" min={0} max={100} defaultValue="50" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input variant="number" step={0.5} defaultValue="1.5" size="sub" />
      </section>
    </div>
  );
};

export const UnitInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

  const [spinNumber, setSpinNumber] = useState(100);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '300px',
      }}
    >
      <Typography variant="h2" style={typoStyle}>
        Unit Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Prefix
        </Typography>
        <Input variant="unit" prefix="NT" defaultValue="1000" placeholder="0" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Suffix
        </Typography>
        <Input
          variant="unit"
          suffix="NT"
          min={0}
          max={10000}
          step={100}
          defaultValue="100"
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Text Only
        </Typography>
        <Input variant="unit" defaultValue="175" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Spinner
        </Typography>
        <Input
          variant="unit"
          inputType="number"
          value={`${spinNumber}`}
          onChange={(evt) => setSpinNumber(Number(evt.target.value))}
          min={0}
          max={10000}
          step={100}
          showSpinner
          onSpinUp={() => {
            /** custom listener */
          }}
          onSpinDown={() => {
            /** custom listener */
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Main
        </Typography>
        <Input variant="unit" size="main" defaultValue="70" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input variant="unit" size="sub" defaultValue="70" />
      </section>
    </div>
  );
};

export const ActionInput = () => {
  const containerStyle = {
    margin: '0 0 24px 0',
    display: 'flex',
    flexFlow: 'column',
    gap: '12px',
  };
  const typoStyle = { margin: '0 0 12px 0' };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '300px',
      }}
    >
      <Typography variant="h2" style={typoStyle}>
        Action Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Copy Action
        </Typography>
        <Input
          variant="action"
          defaultValue="https://example.com/share/abc123"
          actionButton={{
            position: 'suffix',
            icon: CopyIcon,
            label: '複製',
            onClick: () => alert('Copied!'),
          }}
        />
        <Input
          variant="action"
          defaultValue="https://example.com/share/abc123"
          actionButton={{
            position: 'prefix',
            icon: CopyIcon,
            label: '複製',
            onClick: () => alert('Copied!'),
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Disabled Action Button
        </Typography>
        <Input
          variant="action"
          defaultValue="content"
          actionButton={{
            position: 'suffix',
            icon: CopyIcon,
            label: '複製',
            onClick: () => { },
            disabled: true,
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Main
        </Typography>
        <Input
          variant="action"
          size="main"
          defaultValue="example"
          actionButton={{
            position: 'suffix',
            icon: CopyIcon,
            label: '複製',
            onClick: () => { },
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input
          variant="action"
          size="sub"
          defaultValue="example"
          actionButton={{
            position: 'suffix',
            icon: CopyIcon,
            label: '複製',
            onClick: () => { },
          }}
        />
      </section>
    </div>
  );
};

export const SelectInput = () => {
  const containerStyle = {
    margin: '0 0 24px 0',
    display: 'flex',
    flexFlow: 'column',
    gap: '12px',
  };
  const typoStyle = { margin: '0 0 12px 0' };

  const domainOptions = [
    { id: '.com', name: '.com' },
    { id: '.tw', name: '.tw' },
    { id: '.cn', name: '.cn' },
    { id: '.net', name: '.net' },
  ];

  const [prefixValue, setPrefixValue] = useState('.com');
  const [suffixValue, setSuffixValue] = useState('.com');
  const [bothValue, setBothValue] = useState('.com');
  const [sizeMainValue, setSizeMainValue] = useState('.com');
  const [sizeSubValue, setSizeSubValue] = useState('.com');

  const handlePrefixSelect = (value: string) => setPrefixValue(value);
  const handleSuffixSelect = (value: string) => setSuffixValue(value);
  const handleBothSelect = (value: string) => setBothValue(value);
  const handleSizeMainSelect = (value: string) => setSizeMainValue(value);
  const handleSizeSubSelect = (value: string) => setSizeSubValue(value);

  // Helper to create select input props with proper typing
  const createSelectProps = (
    selectedValue: string,
    onSelect: (value: string) => void,
    position: 'prefix' | 'suffix' | 'both',
    additionalProps?: Partial<Omit<SelectInputProps, 'variant' | 'options' | 'selectedValue' | 'onSelect' | 'selectButton'>>,
  ): SelectInputProps => ({
    variant: 'select',
    options: domainOptions,
    selectedValue,
    onSelect,
    selectButton: {
      position,
      value: selectedValue,
    },
    ...additionalProps,
  } as SelectInputProps);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '400px',
      }}
    >
      <Typography variant="h2" style={typoStyle}>
        Select Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Domain Selector
        </Typography>
        <Input
          {...createSelectProps(prefixValue, handlePrefixSelect, 'prefix', {
            defaultValue: 'https://',
            placeholder: 'Domain',
          })}
        />
        <Input
          {...createSelectProps(suffixValue, handleSuffixSelect, 'suffix', {
            defaultValue: 'https://',
            placeholder: 'Domain',
          })}
        />
        <Input
          {...createSelectProps(bothValue, handleBothSelect, 'both', {
            defaultValue: 'https://',
            placeholder: 'Domain',
          })}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Main
        </Typography>
        <Input
          {...createSelectProps(sizeMainValue, handleSizeMainSelect, 'suffix', {
            size: 'main',
            placeholder: 'Placeholder',
          })}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input
          {...createSelectProps(sizeSubValue, handleSizeSubSelect, 'suffix', {
            size: 'sub',
            placeholder: 'Placeholder',
          })}
        />
      </section>
    </div>
  );
};

export const PasswordInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

  const [password, setPassword] = useState('');

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

  const passwordStrengthIndicator = calculatePasswordStrength(password);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '300px',
      }}
    >
      <Typography variant="h2" style={typoStyle}>
        Password Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Basic Password
        </Typography>
        <Input variant="password" placeholder="請輸入密碼" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With Password Strength Indicator
        </Typography>
        <Input
          variant="password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordStrengthIndicator
          passwordStrengthIndicator={passwordStrengthIndicator}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Main
        </Typography>
        <Input variant="password" size="main" placeholder="請輸入密碼" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input variant="password" size="sub" placeholder="請輸入密碼" />
      </section>
    </div>
  );
};

export const FormatterAndParser = () => {
  const containerStyle = {
    margin: '0 0 24px 0',
    display: 'flex',
    flexFlow: 'column',
    gap: '12px',
  };
  const typoStyle = { margin: '0 0 12px 0' };

  const [currencyValue, setCurrencyValue] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '400px',
      }}
    >
      <Typography variant="h2" style={typoStyle}>
        Formatter+Parser
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Currency Format (Thousand Separator)
        </Typography>
        <Input
          variant="unit"
          showSpinner
          placeholder="輸入金額"
          value={currencyValue}
          onChange={(e) => {
            setCurrencyValue(e.target.value);
          }}
          formatter={(value) => formatNumberWithCommas(value)}
          parser={(value) => parseNumberWithCommas(value)?.toString() ?? ''}
        />
        <Typography variant="caption" color="text-neutral">
          Raw value: {currencyValue}
        </Typography>
      </section>
    </div>
  );
};
