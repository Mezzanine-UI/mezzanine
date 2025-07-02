import { cleanup, render } from '../../__test-utils__';
import { FormField } from '../Form';
import Radio, { RadioGroup } from '.';
import ConfigProvider from '../Provider';

// Mock InputCheck Component
const mockInputCheckRender = jest.fn();

jest.mock('../_internal/InputCheck/InputCheck', () => {
  return function MockInputCheck(props: any) {
    mockInputCheckRender(props);
    return <div>{props.children}</div>;
  };
});

describe('<Radio />', () => {
  beforeEach(() => {
    mockInputCheckRender.mockClear();
  });

  afterEach(cleanup);

  it('should pass children, disabled, error, size to InputCheck', () => {
    render(
      <Radio disabled error size="large">
        foo
      </Radio>,
    );

    expect(mockInputCheckRender).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'foo',
        disabled: true,
        error: true,
        size: 'large',
      }),
    );
  });

  it('should accept ConfigProvider context changes', () => {
    render(
      <ConfigProvider size="small">
        <Radio>foo</Radio>
      </ConfigProvider>,
    );

    expect(mockInputCheckRender).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'small',
      }),
    );
  });

  describe('prop: error', () => {
    it('should use severity from form control if error not passed', () => {
      render(
        <FormField severity="error">
          <Radio />
        </FormField>,
      );

      expect(mockInputCheckRender).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
        }),
      );

      render(
        <FormField severity="success">
          <Radio error={false} />
        </FormField>,
      );

      expect(mockInputCheckRender).toHaveBeenCalledWith(
        expect.objectContaining({
          error: false,
        }),
      );
    });
  });

  describe('prop: size', () => {
    it('should use size from group if size not passed', () => {
      render(
        <RadioGroup size="large">
          <Radio />
        </RadioGroup>,
      );

      expect(mockInputCheckRender).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 'large',
        }),
      );

      render(
        <RadioGroup size="large">
          <Radio size="small" />
        </RadioGroup>,
      );

      expect(mockInputCheckRender).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 'small',
        }),
      );
    });
  });
});
