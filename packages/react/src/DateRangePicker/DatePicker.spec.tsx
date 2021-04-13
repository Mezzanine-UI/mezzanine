// import {
//   cleanup,
//   fireEvent,
//   render,
//   TestRenderer,
// } from '../../__test-utils__';
// import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
// import Button, { ButtonProps } from '../Button';
// import ConfirmActions from '.';

// describe('<ConfirmActions />', () => {
//   afterEach(cleanup);

//   describeForwardRefToHTMLElement(
//     HTMLDivElement,
//     (ref) => render(<ConfirmActions ref={ref} />),
//   );

//   describe('cancel button', () => {
//     it('should render variant="outlined" by default', () => {
//       const testRenderer = TestRenderer.create(<ConfirmActions />);
//       const testInstance = testRenderer.root;
//       const [cancelButtonInstance] = testInstance.findAllByType(Button);

//       expect(cancelButtonInstance.props.variant).toBe('outlined');
//     });

//     describe('prop: cancelButtonProps', () => {
//       it('should be passed to the cancel button', () => {
//         const cancelButtonProps: ButtonProps = {
//           disabled: true,
//           loading: true,
//           variant: 'contained',
//         };
//         const testRenderer = TestRenderer.create(<ConfirmActions cancelButtonProps={cancelButtonProps} />);
//         const testInstance = testRenderer.root;
//         const [cancelButtonInstance] = testInstance.findAllByType(Button);

//         expect(cancelButtonInstance.props.disabled).toBe(cancelButtonProps.disabled);
//         expect(cancelButtonInstance.props.loading).toBe(cancelButtonProps.loading);
//         expect(cancelButtonInstance.props.variant).toBe(cancelButtonProps.variant);
//       });

//       it('should consider loading as disabled of cancel button if disabled of cancelButtonProps not passed', () => {
//         const testRenderer = TestRenderer.create(<ConfirmActions loading />);
//         const testInstance = testRenderer.root;
//         const [cancelButtonInstance] = testInstance.findAllByType(Button);

//         expect(cancelButtonInstance.props.disabled).toBe(true);
//       });
//     });

//     describe('prop: cancelText', () => {
//       it('should render the text of the cancel button', () => {
//         const { getHostHTMLElement } = render(<ConfirmActions cancelText="foo" />);
//         const element = getHostHTMLElement();
//         const [cancelButtonElement] = element.getElementsByTagName('button');

//         expect(cancelButtonElement.textContent).toBe('foo');
//       });
//     });

//     describe('prop: hideCancelButton', () => {
//       it('should not render cancel button', () => {
//         const onCancel = jest.fn();
//         const { getHostHTMLElement } = render(<ConfirmActions hideCancelButton onCancel={onCancel} />);
//         const element = getHostHTMLElement();
//         const [confirmButtonElement] = element.getElementsByTagName('button');

//         fireEvent.click(confirmButtonElement);

//         expect(element.childElementCount).toBe(1);
//         expect(onCancel).not.toBeCalled();
//       });
//     });

//     describe('prop: onCancel', () => {
//       it('should be fired while cancel button clicked', () => {
//         const onCancel = jest.fn();
//         const { getHostHTMLElement } = render(<ConfirmActions onCancel={onCancel} />);
//         const element = getHostHTMLElement();
//         const [cancelButtonElement] = element.getElementsByTagName('button');

//         fireEvent.click(cancelButtonElement);

//         expect(onCancel).toBeCalledTimes(1);
//       });
//     });
//   });

//   describe('confirm button', () => {
//     it('should render variant="contained" by default', () => {
//       const testRenderer = TestRenderer.create(<ConfirmActions />);
//       const testInstance = testRenderer.root;
//       const [, confirmButtonInstance] = testInstance.findAllByType(Button);

//       expect(confirmButtonInstance.props.variant).toBe('contained');
//     });

//     describe('prop: confirmButtonProps', () => {
//       it('should be passed to the confirm button', () => {
//         const confirmButtonProps: ButtonProps = {
//           disabled: true,
//           variant: 'outlined',
//         };
//         const testRenderer = TestRenderer.create(<ConfirmActions confirmButtonProps={confirmButtonProps} />);
//         const testInstance = testRenderer.root;
//         const [, confirmButtonInstance] = testInstance.findAllByType(Button);

//         expect(confirmButtonInstance.props.disabled).toBe(confirmButtonProps.disabled);
//         expect(confirmButtonInstance.props.variant).toBe(confirmButtonProps.variant);
//       });

//       it('should pass loading prop to confirm button', () => {
//         const testRenderer = TestRenderer.create(<ConfirmActions confirmButtonProps={{ loading: false }} loading />);
//         const testInstance = testRenderer.root;
//         const [, confirmButtonInstance] = testInstance.findAllByType(Button);

//         expect(confirmButtonInstance.props.loading).toBe(true);
//       });
//     });

//     describe('prop: confirmText', () => {
//       it('should render the text of the confirm button', () => {
//         const { getHostHTMLElement } = render(<ConfirmActions confirmText="foo" />);
//         const element = getHostHTMLElement();
//         const { lastElementChild: confirmButtonElement } = element;

//         expect(confirmButtonElement!.textContent).toBe('foo');
//       });
//     });

//     describe('prop: hideConfirmButton', () => {
//       it('should not render cancel button', () => {
//         const onConfirm = jest.fn();
//         const { getHostHTMLElement } = render(<ConfirmActions hideConfirmButton onConfirm={onConfirm} />);
//         const element = getHostHTMLElement();
//         const { firstElementChild: cancelButtonElement, childElementCount } = element;

//         fireEvent.click(cancelButtonElement!);

//         expect(childElementCount).toBe(1);
//         expect(onConfirm).not.toBeCalled();
//       });
//     });

//     describe('prop: onConfirm', () => {
//       it('should be fired while confirm button clicked', () => {
//         const onConfirm = jest.fn();
//         const { getHostHTMLElement } = render(<ConfirmActions onConfirm={onConfirm} />);
//         const element = getHostHTMLElement();
//         const { lastElementChild: confirmButtonElement } = element;

//         fireEvent.click(confirmButtonElement!);

//         expect(onConfirm).toBeCalledTimes(1);
//       });
//     });
//   });
// });
