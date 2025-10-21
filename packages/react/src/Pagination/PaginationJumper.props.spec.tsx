import { cleanup, render } from '../../__test-utils__';

import { PaginationJumper } from '.';

const renderMockButton = jest.fn();

jest.mock('../Button', () => {
  return function MockButton(props: any) {
    renderMockButton(props);
    return <button type="button">{props.children}</button>;
  };
});

const renderMockTypography = jest.fn();

jest.mock('../Typography', () => {
  return function MockTypography(props: any) {
    renderMockTypography(props);
    return <span>{props.children}</span>;
  };
});

const renderMockInput = jest.fn();

jest.mock('../Input', () => {
  return function MockInput(props: any) {
    renderMockInput(props);
    return <input />;
  };
});

describe('<PaginationJumper />', () => {
  beforeEach(() => {
    renderMockButton.mockClear();
    renderMockTypography.mockClear();
    renderMockInput.mockClear();
  });

  afterEach(cleanup);

  describe('prop: buttonText,hintText,inputPlaceholder', () => {
    const hintText = 'Go To';
    const buttonText = 'Go';
    const inputPlaceholder = 'Page';

    it('hintText should displayed in front of `input`', () => {
      render(
        <PaginationJumper
          hintText={hintText}
          buttonText={buttonText}
          inputPlaceholder={inputPlaceholder}
        />,
      );

      expect(renderMockTypography).toHaveBeenCalledWith(
        expect.objectContaining({
          children: hintText,
        }),
      );
    });

    it('buttonText should displayed in the `button` content', () => {
      render(
        <PaginationJumper
          hintText={hintText}
          buttonText={buttonText}
          inputPlaceholder={inputPlaceholder}
        />,
      );

      expect(renderMockButton).toHaveBeenCalledWith(
        expect.objectContaining({
          children: buttonText,
        }),
      );
    });

    it('inputPlaceholder displayed in the `input` before the user enters a value', () => {
      render(
        <PaginationJumper
          hintText={hintText}
          buttonText={buttonText}
          inputPlaceholder={inputPlaceholder}
        />,
      );

      expect(renderMockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          placeholder: inputPlaceholder,
        }),
      );
    });
  });

  describe('prop: disabled', () => {
    it('should pass disabled props to children', () => {
      render(<PaginationJumper disabled />);

      expect(renderMockTypography).toHaveBeenCalledWith(
        expect.objectContaining({
          color: 'text-disabled',
        }),
      );

      expect(renderMockInput).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        }),
      );

      expect(renderMockButton).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        }),
      );
    });
  });
});
