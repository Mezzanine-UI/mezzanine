import { CopyIcon, DownloadIcon, UserIcon } from '@mezzanine-ui/icons';
import { useState } from 'react';
import Icon from '../Icon';
import Input from '.';
import Typography from '../Typography';

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
        <Input placeholder="請輸入文字" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With Value
        </Typography>
        <Input value="Example" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Disabled
        </Typography>
        <Input placeholder="請輸入文字" disabled />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Error
        </Typography>
        <Input placeholder="請輸入文字" error />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Read Only
        </Typography>
        <Input placeholder="請輸入文字" value="Example" readonly />
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
          With Prefix
        </Typography>
        <Input
          type="affix"
          prefix={<Icon icon={UserIcon} />}
          placeholder="Placeholder"
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With Suffix
        </Typography>
        <Input type="affix" suffix="Suffix" placeholder="Placeholder" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With Text Prefix
        </Typography>
        <Input
          type="affix"
          prefix={<span style={{ padding: '0 8px' }}>https://</span>}
          placeholder="www.example.com"
        />
      </section>
    </div>
  );
};

export const SearchInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography variant="h2" style={typoStyle}>
        Search Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Default (with SearchIcon and clearable)
        </Typography>
        <Input type="search" placeholder="搜尋..." />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Not Clearable
        </Typography>
        <Input type="search" clearable={false} placeholder="搜尋..." />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Sizes - Main
        </Typography>
        <Input type="search" size="main" placeholder="搜尋..." />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Sizes - Sub
        </Typography>
        <Input type="search" size="sub" placeholder="搜尋..." />
      </section>
    </div>
  );
};

export const NumberInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography variant="h2" style={typoStyle}>
        Number Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Basic Number
        </Typography>
        <Input type="number" placeholder="0" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With Min/Max
        </Typography>
        <Input type="number" min={0} max={100} defaultValue="50" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input type="number" step={0.5} defaultValue="1.5" size="sub" />
      </section>
    </div>
  );
};

export const UnitInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
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
        Unit Input (Right-aligned with SpinnerButton)
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With Unit Text
        </Typography>
        <Input type="unit" unit="公斤" defaultValue="70" placeholder="0" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          With SpinnerButton (default)
        </Typography>
        <Input
          type="unit"
          unit="元"
          min={0}
          max={1000}
          step={10}
          defaultValue="100"
          onSpinUp={() => {}}
          onSpinDown={() => {}}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Without SpinnerButton
        </Typography>
        <Input type="unit" unit="cm" showSpinner={false} defaultValue="175" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Main
        </Typography>
        <Input type="unit" unit="kg" size="main" defaultValue="70" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input type="unit" unit="kg" size="sub" defaultValue="70" />
      </section>
    </div>
  );
};

export const ActionInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };

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
        Action Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Copy Action
        </Typography>
        <Input
          type="action"
          defaultValue="https://example.com/share/abc123"
          actionButton={{
            icon: CopyIcon,
            label: '複製',
            onClick: () => alert('Copied!'),
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Download Action
        </Typography>
        <Input
          type="action"
          defaultValue="report_2024.pdf"
          actionButton={{
            icon: DownloadIcon,
            label: '下載',
            onClick: () => alert('Downloading...'),
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Disabled Action Button
        </Typography>
        <Input
          type="action"
          defaultValue="content"
          actionButton={{
            icon: CopyIcon,
            label: '複製',
            onClick: () => {},
            disabled: true,
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Main
        </Typography>
        <Input
          type="action"
          size="main"
          defaultValue="example"
          actionButton={{
            icon: CopyIcon,
            label: '複製',
            onClick: () => {},
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input
          type="action"
          size="sub"
          defaultValue="example"
          actionButton={{
            icon: CopyIcon,
            label: '複製',
            onClick: () => {},
          }}
        />
      </section>
    </div>
  );
};

export const SelectInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [selectedValue, setSelectedValue] = useState('.com');

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
        Select Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Domain Selector
        </Typography>
        <Input
          type="select"
          defaultValue="https://"
          placeholder="Domain"
          selectButton={{
            value: selectedValue,
            onClick: () => {
              const domains = ['.com', '.tw', '.cn', '.net'];
              const currentIndex = domains.indexOf(selectedValue);
              const nextIndex = (currentIndex + 1) % domains.length;
              setSelectedValue(domains[nextIndex]);
            },
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Main
        </Typography>
        <Input
          type="select"
          size="main"
          placeholder="Placeholder"
          selectButton={{
            value: '.com',
            onClick: () => {},
          }}
        />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input
          type="select"
          size="sub"
          placeholder="Placeholder"
          selectButton={{
            value: '.com',
            onClick: () => {},
          }}
        />
      </section>
    </div>
  );
};

export const PasswordInput = () => {
  const containerStyle = { margin: '0 0 24px 0' };
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
        Password Input
      </Typography>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Basic Password
        </Typography>
        <Input type="password" placeholder="請輸入密碼" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Main
        </Typography>
        <Input type="password" size="main" placeholder="請輸入密碼" />
      </section>

      <section style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size Sub
        </Typography>
        <Input type="password" size="sub" placeholder="請輸入密碼" />
      </section>
    </div>
  );
};
