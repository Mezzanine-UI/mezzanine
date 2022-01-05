import { RefObject } from 'react';
import {
  act,
  waitFor,
  cleanup,
  render,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { UploadPictureWall, UploadPictureWallControl } from '.';

describe('<UploadPictureWall />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <UploadPictureWall ref={ref} />,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<UploadPictureWall className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <UploadPictureWall />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-upload-picture-wall')).toBeTruthy();
  });

  describe('prop: accept', () => {
    it('should has accept attribute', () => {
      const { getHostHTMLElement } = render(<UploadPictureWall accept="image/*" />);
      const element = getHostHTMLElement();
      const inputElement = element.querySelector('input');

      expect(inputElement?.getAttribute('accept')).toBe('image/*');
    });
  });

  describe('prop: controllerRef', () => {
    it('should get hook results', async () => {
      const controllerRef = { current: null } as RefObject<UploadPictureWallControl>;

      await act(async () => {
        await render(
          <UploadPictureWall controllerRef={controllerRef} />,
        );
      });

      expect(controllerRef?.current?.getAllData).toBeInstanceOf(Function);
      expect(controllerRef?.current?.getAllData()).toBeInstanceOf(Array);
    });
  });

  describe('prop: defaultValue', () => {
    it('should show default images', () => {
      const { getHostHTMLElement } = render(
        <UploadPictureWall
          defaultValues={['https://rytass.com/logo.png', 'https://rytass.com/logo.png', 'https://rytass.com/logo.png']}
        />,
      );

      const element = getHostHTMLElement();
      const [img1, img2, img3] = element.querySelectorAll('.mzn-upload-picture-block__preview');

      expect(img1).toBeInstanceOf(HTMLImageElement);
      expect(img1!.getAttribute('src')).toBe('https://rytass.com/logo.png');
      expect(img2).toBeInstanceOf(HTMLImageElement);
      expect(img2!.getAttribute('src')).toBe('https://rytass.com/logo.png');
      expect(img3).toBeInstanceOf(HTMLImageElement);
      expect(img3!.getAttribute('src')).toBe('https://rytass.com/logo.png');
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<UploadPictureWall disabled={disabled} />);
        const element = getHostHTMLElement();
        const buttonElement = element.querySelector('button');

        expect(buttonElement!.classList.contains('mzn-upload-picture-block--disabled')).toBe(disabled);
        expect(buttonElement!.hasAttribute('disabled')).toBe(disabled);
        expect(buttonElement!.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });
  });

  describe('prop: multiple', () => {
    it('should has multiple attributes', () => {
      [false, true].forEach((multiple) => {
        const { getHostHTMLElement } = render(<UploadPictureWall multiple={multiple} />);
        const element = getHostHTMLElement();
        const inputElement = element.querySelector('input');

        expect(inputElement!.hasAttribute('multiple')).toBe(multiple);
      });
    });
  });

  describe('prop: onDelete', () => {
    it('should be fired while click button if uploader have values', () => {
      const onDelete = jest.fn();
      const onChange = jest.fn();

      const { getHostHTMLElement } = render(
        <UploadPictureWall
          onChange={onChange}
          onDelete={onDelete}
          defaultValues={['https://rytass.com/logo.png', 'https://rytass.com/logo.png', 'https://rytass.com/logo.png']}
        />,
      );

      const element = getHostHTMLElement();
      const [firstButton] = element.querySelectorAll('.mzn-upload-picture-block');

      fireEvent.click(firstButton!);

      expect(onDelete).toBeCalledTimes(1);
      expect(onDelete).toBeCalledWith(['https://rytass.com/logo.png', 'https://rytass.com/logo.png']);
      expect(onChange).toBeCalledWith(['https://rytass.com/logo.png', 'https://rytass.com/logo.png']);
    });

    it('should not be fired if uploader have no images', () => {
      const onDelete = jest.fn();

      const { getHostHTMLElement } = render(
        <UploadPictureWall
          onDelete={onDelete}
        />,
      );

      const element = getHostHTMLElement();
      const [firstButton] = element.querySelectorAll('.mzn-upload-picture-block');

      fireEvent.click(firstButton!);

      expect(onDelete).not.toBeCalled();
    });
  });

  describe('prop: onChange, onError, onMultiUpload, onUpload, onUploadSuccess, parallel', () => {
    describe('should invoked w/ files from change event', () => {
      describe('onMultiUpload case', () => {
        it('should be fired onUploadSuccess and onChange after onMultiUpload success', async () => {
          const mockFiles = [
            new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
            new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
          ];

          const upload = jest.fn(() => new Promise<string>((resolve) => {
            resolve('https://rytass.com/logo.png');
          }));

          const onMultiUpload = jest.fn(() => Promise.all(mockFiles.map(() => upload())));
          const onUploadSuccess = jest.fn();
          const onError = jest.fn();
          const onChange = jest.fn();

          const { getHostHTMLElement } = render(
            <UploadPictureWall
              onChange={onChange}
              onMultiUpload={onMultiUpload}
              onUploadSuccess={onUploadSuccess}
              onError={onError}
            />,
          );

          const element = getHostHTMLElement();
          const inputElement = element.querySelector('input');

          await act(async () => {
            fireEvent.change(inputElement!, {
              target: {
                files: mockFiles,
              },
            });
          });

          await waitFor(() => {
            expect(onMultiUpload).toBeCalled();
            expect(onUploadSuccess).toBeCalled();
            expect(onUploadSuccess).toBeCalledWith(
              mockFiles,
              ['https://rytass.com/logo.png', 'https://rytass.com/logo.png'],
            );
            expect(onError).not.toBeCalled();
            expect(onChange).toBeCalledWith(['https://rytass.com/logo.png', 'https://rytass.com/logo.png']);
          });
        });

        it('should be fired onError but not be fired onChange after onMultiUpload failed', async () => {
          const mockFiles = [
            new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
            new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
          ];

          const upload = jest.fn(() => new Promise<string>((resolve, reject) => {
            reject();
          }));

          const onMultiUpload = jest.fn(() => Promise.all(mockFiles.map(() => upload())));
          const onUploadSuccess = jest.fn();
          const onError = jest.fn();
          const onChange = jest.fn();

          const { getHostHTMLElement } = render(
            <UploadPictureWall
              onChange={onChange}
              onMultiUpload={onMultiUpload}
              onUploadSuccess={onUploadSuccess}
              onError={onError}
            />,
          );

          const element = getHostHTMLElement();
          const inputElement = element.querySelector('input');

          await act(async () => {
            fireEvent.change(inputElement!, {
              target: {
                files: mockFiles,
              },
            });
          });

          await waitFor(() => {
            expect(onMultiUpload).toBeCalled();
            expect(onUploadSuccess).not.toBeCalled();
            expect(onError).toBeCalled();
            expect(onError).toBeCalledWith(mockFiles);
            expect(onChange).not.toBeCalled();
          });
        });
      });

      describe('onUpload case', () => {
        describe('parallel is true', () => {
          it('should be fired onUploadSuccess and onChange after onUpload success', async () => {
            const mockFiles = [
              new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
              new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
            ];

            const onUpload = jest.fn(() => new Promise<string>((resolve) => {
              resolve('https://rytass.com/logo.png');
            }));

            const onUploadSuccess = jest.fn();
            const onError = jest.fn();
            const onChange = jest.fn();

            const { getHostHTMLElement } = render(
              <UploadPictureWall
                onChange={onChange}
                onUpload={onUpload}
                onUploadSuccess={onUploadSuccess}
                onError={onError}
                parallel
              />,
            );

            const element = getHostHTMLElement();
            const inputElement = element.querySelector('input');

            await act(async () => {
              fireEvent.change(inputElement!, {
                target: {
                  files: mockFiles,
                },
              });
            });

            await waitFor(() => {
              expect(onUpload).toBeCalled();
              expect(onUploadSuccess).toBeCalledTimes(2);
              expect(onError).not.toBeCalled();
              expect(onChange).toBeCalledTimes(1);
              expect(onChange).toBeCalledWith(['https://rytass.com/logo.png', 'https://rytass.com/logo.png']);
            });
          });

          it('should be fired onError but not be fired onChange after onUpload failed', async () => {
            const mockFiles = [
              new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
              new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
            ];

            const onUpload = jest.fn(() => new Promise<string>((resolve, reject) => {
              reject();
            }));

            const onUploadSuccess = jest.fn();
            const onError = jest.fn();
            const onChange = jest.fn();

            const { getHostHTMLElement } = render(
              <UploadPictureWall
                onChange={onChange}
                onUpload={onUpload}
                onUploadSuccess={onUploadSuccess}
                onError={onError}
                parallel
              />,
            );

            const element = getHostHTMLElement();
            const inputElement = element.querySelector('input');

            await act(async () => {
              fireEvent.change(inputElement!, {
                target: {
                  files: mockFiles,
                },
              });
            });

            await waitFor(() => {
              expect(onUpload).toBeCalled();
              expect(onUploadSuccess).not.toBeCalled();
              expect(onError).toBeCalledTimes(2);
              expect(onChange).not.toBeCalled();
            });
          });
        });

        describe('parallel is false', () => {
          it('should be fired onUploadSuccess and onChange after onUpload success', async () => {
            const mockFiles = [
              new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
              new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
            ];

            const onUpload = jest.fn(() => new Promise<string>((resolve) => {
              resolve('https://rytass.com/logo.png');
            }));

            const onUploadSuccess = jest.fn();
            const onError = jest.fn();
            const onChange = jest.fn();

            const { getHostHTMLElement } = render(
              <UploadPictureWall
                onChange={onChange}
                onUpload={onUpload}
                onUploadSuccess={onUploadSuccess}
                onError={onError}
                parallel={false}
              />,
            );

            const element = getHostHTMLElement();
            const inputElement = element.querySelector('input');

            await act(async () => {
              fireEvent.change(inputElement!, {
                target: {
                  files: mockFiles,
                },
              });
            });

            await waitFor(() => {
              expect(onUpload).toBeCalled();
              expect(onUploadSuccess).toBeCalledTimes(2);
              expect(onError).not.toBeCalled();
              expect(onChange).toBeCalledTimes(2);
            });
          });

          it('should be fired onError but not be fired onChange after onUpload failed', async () => {
            const mockFiles = [
              new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
              new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
            ];

            const onUpload = jest.fn(() => new Promise<string>((resolve, reject) => {
              reject();
            }));

            const onUploadSuccess = jest.fn();
            const onError = jest.fn();
            const onChange = jest.fn();

            const { getHostHTMLElement } = render(
              <UploadPictureWall
                onChange={onChange}
                onUpload={onUpload}
                onUploadSuccess={onUploadSuccess}
                onError={onError}
                parallel={false}
              />,
            );

            const element = getHostHTMLElement();
            const inputElement = element.querySelector('input');

            await act(async () => {
              fireEvent.change(inputElement!, {
                target: {
                  files: mockFiles,
                },
              });
            });

            await waitFor(() => {
              expect(onUpload).toBeCalled();
              expect(onUploadSuccess).not.toBeCalled();
              expect(onError).toBeCalledTimes(2);
              expect(onChange).not.toBeCalled();
            });
          });
        });
      });
    });

    describe('should not invoked if there are no any files from change event', () => {
      it('onMultiUpload case', () => {
        const onMultiUpload = jest.fn();
        const { getHostHTMLElement } = render(
          <UploadPictureWall onMultiUpload={onMultiUpload} />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.querySelector('input');

        fireEvent.change(inputElement!, {
          target: {
            files: null,
          },
        });

        expect(onMultiUpload).not.toBeCalled();
      });

      it('onUpload case', () => {
        const onUpload = jest.fn();
        const { getHostHTMLElement } = render(
          <UploadPictureWall onUpload={onUpload} />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.querySelector('input');

        fireEvent.change(inputElement!, {
          target: {
            files: null,
          },
        });

        expect(onUpload).not.toBeCalled();
      });
    });
  });
});
