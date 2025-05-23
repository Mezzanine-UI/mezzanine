import { cleanup, render } from '../../__test-utils__';
import { FormField } from '../Form';
import Checkbox from './Checkbox';
import ConfigProvider from '../Provider';

const renderMockInputCheck = jest.fn();

jest.mock('../_internal/InputCheck', () => {
  return function MockInputCheck(props: any) {
    renderMockInputCheck(props);
    return <div data-testid="mock-input-check">{props.children}</div>;
  };
});

describe('<Checkbox />', () => {
  beforeEach(() => {
    renderMockInputCheck.mockClear();
  });

  afterEach(cleanup);

  it('should accept ConfigProvider context changes', () => {
    render(
      <ConfigProvider size="small">
        <Checkbox />
      </ConfigProvider>,
    );

    expect(renderMockInputCheck).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'small',
      }),
    );
  });

  it('should pass children,disabled,error,size to InputCheck', () => {
    render(
      <Checkbox disabled error size="large">
        foo
      </Checkbox>,
    );

    expect(renderMockInputCheck).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'foo',
        disabled: true,
        error: true,
        size: 'large',
      }),
    );
  });

  describe('prop: error', () => {
    it('should use severity from form control if error not passed', () => {
      render(
        <FormField severity="error">
          <Checkbox />
        </FormField>,
      );

      expect(renderMockInputCheck).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
        }),
      );

      renderMockInputCheck.mockClear();

      render(
        <FormField severity="error">
          <Checkbox error={false} />
        </FormField>,
      );

      expect(renderMockInputCheck).toHaveBeenCalledWith(
        expect.objectContaining({
          error: false,
        }),
      );
    });
  });
});
