import { cleanup, render } from '../../__test-utils__';
import { FormField } from '../Form';
import Radio, { RadioGroup } from '.';

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
      <Radio disabled error size="main">
        foo
      </Radio>,
    );

    expect(mockInputCheckRender).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'foo',
        disabled: true,
        error: true,
        size: 'main',
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
        <RadioGroup size="main">
          <Radio />
        </RadioGroup>,
      );

      expect(mockInputCheckRender).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 'main',
        }),
      );

      render(
        <RadioGroup size="main">
          <Radio size="sub" />
        </RadioGroup>,
      );

      expect(mockInputCheckRender).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 'sub',
        }),
      );
    });
  });
});
