import { mount } from '@vue/test-utils';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import MznModalBodyForVerification from './modal-body-for-verification.vue';
import type { ModalBodyForVerificationProps } from './modal-body-for-verification.types';

function render(
  props: Partial<ModalBodyForVerificationProps> = {},
  listeners: Record<string, unknown> = {},
) {
  return mount(MznModalBodyForVerification, {
    attachTo: document.body,
    props: { ...props, ...listeners },
  });
}

describe('<MznModalBodyForVerification />', () => {
  it('should render one box per digit, seeded from the value', () => {
    const wrapper = render({ length: 4, value: '12' });

    expect(
      wrapper.findAll('input').map((input) => input.element.value),
    ).toEqual(['1', '2', '', '']);
  });

  it('should widen the row past four digits', () => {
    const four = render({ length: 4 });
    const six = render({ length: 6 });

    expect(
      four.get(`.${classes.modalBodyVerificationInputs}`).classes(),
    ).not.toContain(classes.modalBodyVerificationInputsExtended);
    expect(
      six.get(`.${classes.modalBodyVerificationInputs}`).classes(),
    ).toContain(classes.modalBodyVerificationInputsExtended);
  });

  it('should mark every box in the error state', () => {
    const wrapper = render({ error: true });

    wrapper.findAll('input').forEach((input) => {
      expect(input.classes()).toContain(
        classes.modalBodyVerificationInputError,
      );
    });
  });

  it('should keep only the last character typed and move on', async () => {
    const wrapper = render({ length: 4 });
    const inputs = wrapper.findAll('input');

    await inputs[0].setValue('ab');

    expect(wrapper.emitted('change')?.at(-1)).toEqual(['b']);
    expect(document.activeElement).toBe(inputs[1].element);
  });

  it('should report completion once every box is filled', async () => {
    const wrapper = render({ length: 2 });
    const inputs = wrapper.findAll('input');

    await inputs[0].setValue('1');
    await inputs[1].setValue('2');

    expect(wrapper.emitted('complete')).toEqual([['12']]);
  });

  it('should clear the current box on Backspace, or step back when it is empty', async () => {
    const wrapper = render({ length: 3, value: '12' });
    const inputs = wrapper.findAll('input');

    await inputs[1].trigger('keydown', { key: 'Backspace' });

    expect(wrapper.emitted('change')?.at(-1)).toEqual(['1']);

    await inputs[2].trigger('keydown', { key: 'Backspace' });

    expect(document.activeElement).toBe(inputs[1].element);
  });

  it('should walk the boxes with the arrow keys', async () => {
    const wrapper = render({ length: 3 });
    const inputs = wrapper.findAll('input');

    await inputs[1].trigger('keydown', { key: 'ArrowLeft' });

    expect(document.activeElement).toBe(inputs[0].element);

    await inputs[0].trigger('keydown', { key: 'ArrowRight' });

    expect(document.activeElement).toBe(inputs[1].element);
  });

  it('should spread a pasted code across the boxes', async () => {
    const wrapper = render({ length: 4 });

    await wrapper.findAll('input')[0].trigger('paste', {
      clipboardData: { getData: () => '9876543' },
    });

    expect(wrapper.emitted('change')).toEqual([['9876']]);
    expect(wrapper.emitted('complete')).toEqual([['9876']]);
    expect(
      wrapper.findAll('input').map((input) => input.element.value),
    ).toEqual(['9', '8', '7', '6']);
  });

  it('should offer the resend row only when someone listens for it', async () => {
    const withoutListener = render();

    expect(
      withoutListener.find(`.${classes.modalBodyVerificationResend}`).exists(),
    ).toBe(false);

    const wrapper = render({}, { onResend: () => {} });

    expect(
      wrapper.get(`.${classes.modalBodyVerificationResend}`).text(),
    ).toContain('收不到驗證碼？');

    await wrapper
      .get(`.${classes.modalBodyVerificationResendLink}`)
      .trigger('click');

    expect(wrapper.emitted('resend')).toHaveLength(1);
  });

  it('should focus the first box on mount unless it is inert', () => {
    const wrapper = render({ length: 3 });

    expect(document.activeElement).toBe(wrapper.findAll('input')[0].element);

    const disabled = render({ disabled: true, length: 3 });

    expect(document.activeElement).not.toBe(
      disabled.findAll('input')[0].element,
    );
  });

  it('should pass disabled and readOnly down to every box', () => {
    const wrapper = render({ disabled: true, readOnly: true });

    wrapper.findAll('input').forEach((input) => {
      expect(input.attributes('disabled')).toBeDefined();
      expect(input.attributes('readonly')).toBeDefined();
    });
  });
});
