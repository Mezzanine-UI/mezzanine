import { PlusIcon, CopyIcon } from '@mezzanine-ui/icons';
import { cleanup, render } from '../../__test-utils__';
import Icon from '../Icon';
import Input from '.';

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

  describe('variant: base', () => {
    it('props should pass to TextField', () => {
      render(
        <Input
          clearable
          disabled
          error
          fullWidth
          size="main"
          value="foo"
          onClear={jest.fn()}
        />,
      );

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          clearable: true,
          disabled: true,
          error: true,
          fullWidth: true,
          size: 'main',
        }),
      );
    });
  });

  describe('variant: affix', () => {
    it('should pass prefix and suffix to TextField', () => {
      const prefix = <Icon icon={PlusIcon} />;
      const suffix = <Icon icon={PlusIcon} />;
      render(
        <Input
          variant="affix"
          prefix={prefix}
          suffix={suffix}
          clearable
          onClear={jest.fn()}
        />,
      );

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          prefix,
          suffix,
          clearable: true,
        }),
      );
    });
  });

  describe('variant: search', () => {
    it('should render with search icon prefix', () => {
      render(<Input variant="search" />);

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          prefix: expect.anything(),
          clearable: true,
        }),
      );
    });
  });

  describe('variant: number', () => {
    it('should render number input', () => {
      render(<Input variant="number" min={0} max={100} step={5} />);

      expect(mockRenderTextField).toHaveBeenCalled();
    });
  });

  describe('variant: action', () => {
    it('should render with action button', () => {
      render(
        <Input
          variant="action"
          actionButton={{
            position: 'suffix',
            icon: CopyIcon,
            label: 'Copy',
            onClick: jest.fn(),
          }}
        />,
      );

      expect(mockRenderTextField).toHaveBeenCalled();
    });
  });

  describe('variant: password', () => {
    it('should render password input', () => {
      render(<Input variant="password" />);

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          suffix: expect.anything(),
        }),
      );
    });
  });

  describe('prop: error', () => {
    beforeEach(() => {
      mockRenderTextField.mockClear();
    });

    it('should pass error prop to TextField', () => {
      render(<Input error />);

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

    it('should pass fullWidth prop to TextField', () => {
      render(<Input fullWidth />);

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          fullWidth: true,
        }),
      );
    });

    it('should default to fullWidth true', () => {
      render(<Input />);

      expect(mockRenderTextField).toHaveBeenCalledWith(
        expect.objectContaining({
          fullWidth: true,
        }),
      );
    });
  });
});

describe('prop: size', () => {
  beforeEach(() => {
    mockRenderTextField.mockClear();
  });

  afterEach(cleanup);

  it('should support main size', () => {
    render(<Input size="main" />);

    expect(mockRenderTextField).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'main',
      }),
    );
  });

  it('should support sub size', () => {
    render(<Input size="sub" />);

    expect(mockRenderTextField).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'sub',
      }),
    );
  });
});
