import { PlusIcon } from '@mezzanine-ui/icons';
import { cleanup, render, cleanupHook } from '../../__test-utils__';
import Icon from '../Icon';
import { FormField } from '../Form';
import Input from '.';
import ConfigProvider from '../Provider';

const mockRenderTextField = jest.fn();

jest.mock('../TextField', () => {
  return function MockRenderTextField(props: any) {
    mockRenderTextField(props);
    return <div data-testid="mock-text-field">{props.children}</div>;
  };
});

describe('<Input />', () => {
  beforeEach(() => {
    mockRenderTextField.mockClear();
  });

  afterEach(cleanup);

  it('props should pass to TextField', () => {
    const prefix = <Icon icon={PlusIcon} />;
    const suffix = <Icon icon={PlusIcon} />;
    render(
      <Input
        clearable
        disabled
        error
        fullWidth
        prefix={prefix}
        size="large"
        suffix={suffix}
        value="foo"
      />,
    );

    expect(mockRenderTextField).toHaveBeenCalledWith(
      expect.objectContaining({
        active: true,
        clearable: true,
        disabled: true,
        error: true,
        fullWidth: true,
        prefix,
        size: 'large',
        suffix,
      }),
    );
  });

  it('should accept ConfigProvider context changes', () => {
    render(
      <ConfigProvider size="small">
        <Input />
      </ConfigProvider>,
    );
    expect(mockRenderTextField).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'small',
      }),
    );
  });

  describe('prop: error', () => {
    beforeEach(() => {
      mockRenderTextField.mockClear();
    });

    it('should use severity from form control if error not passed', () => {
      render(
        <FormField severity="error">
          <Input />
        </FormField>,
      );

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
        }),
      );
    });
  });

  describe('prop: fullWidth', () => {
    beforeEach(() => {
      mockRenderTextField.mockClear();
    });

    it('should use fullWidth from form control if fullWidth not passed', () => {
      render(
        <FormField fullWidth>
          <Input />
        </FormField>,
      );

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          fullWidth: true,
        }),
      );
    });
  });
});

describe('<Input tags="default" />', () => {
  beforeEach(() => {
    mockRenderTextField.mockClear();
  });

  afterEach(cleanup);

  it('props should pass to TextField', () => {
    const prefix = <Icon icon={PlusIcon} />;
    const suffix = <Icon icon={PlusIcon} />;
    render(
      <Input
        clearable
        disabled
        error
        fullWidth
        mode="default"
        prefix={prefix}
        size="large"
        suffix={suffix}
        value="foo"
      />,
    );

    expect(mockRenderTextField).toHaveBeenCalledWith(
      expect.objectContaining({
        active: true,
        clearable: true,
        disabled: true,
        error: true,
        fullWidth: true,
        prefix,
        size: 'large',
        suffix,
      }),
    );
  });

  describe('prop: error', () => {
    beforeEach(() => {
      mockRenderTextField.mockClear();
    });

    it('should use severity from form control if error not passed', () => {
      render(
        <FormField severity="error">
          <Input mode="default" />
          <Input mode="default" error={false} />
        </FormField>,
      );

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
        }),
      );

      render(
        <FormField severity="error">
          <Input mode="default" error={false} />
        </FormField>,
      );

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          error: false,
        }),
      );
    });
  });

  describe('prop: fullWidth', () => {
    beforeEach(() => {
      mockRenderTextField.mockClear();
    });

    it('should use fullWidth from form control if fullWidth not passed', () => {
      render(
        <FormField fullWidth>
          <Input mode="default" />
        </FormField>,
      );

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          fullWidth: true,
        }),
      );
      render(
        <FormField fullWidth>
          <Input mode="default" fullWidth={false} />
        </FormField>,
      );

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          fullWidth: false,
        }),
      );
    });
  });
});

describe('<Input mode="tags" />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('props should pass to TextField', () => {
    const prefix = <Icon icon={PlusIcon} />;
    const suffix = <Icon icon={PlusIcon} />;
    render(
      <Input
        mode="tags"
        clearable
        disabled
        error
        fullWidth
        prefix={prefix}
        size="large"
        suffix={suffix}
        value="foo"
      />,
    );
    expect(mockRenderTextField).toHaveBeenCalledWith(
      expect.objectContaining({
        active: true,
        clearable: true,
        disabled: true,
        error: true,
        fullWidth: true,
        prefix,
        size: 'large',
        suffix,
      }),
    );
  });
});
