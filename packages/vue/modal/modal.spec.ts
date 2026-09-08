import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { backdropClasses } from '@mezzanine-ui/core/backdrop';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { resetPortals } from '../portal/portal-registry';
import MznModal from './modal.vue';
import type { ModalProps } from './modal.types';

const host = (): HTMLElement | null =>
  document.body.querySelector(`.${classes.host}`);

const query = (selector: string): HTMLElement | null =>
  document.body.querySelector(selector);

const queryAll = (selector: string): HTMLElement[] =>
  Array.from(document.body.querySelectorAll(selector));

async function renderModal(
  props: Partial<ModalProps> = {},
  slots?: Record<string, () => unknown>,
) {
  const wrapper = mount(MznModal, {
    attachTo: document.body,
    props: { open: true, ...props } as ModalProps,
    slots,
  });

  await flushPromises();

  return wrapper;
}

describe('<MznModal />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // See PORTING-PLAYBOOK P16: the registry caches its containers.
    resetPortals();
  });

  it('should render nothing while it has never been opened', async () => {
    await renderModal({ open: false });

    expect(host()).toBeNull();
  });

  it('should render a dialog with the status, size and close-icon classes', async () => {
    await renderModal({ modalStatusType: 'warning', size: 'wide' });

    const element = host();

    expect(element?.getAttribute('role')).toBe('dialog');
    expect(element?.getAttribute('aria-modal')).toBe('true');
    expect(
      element?.classList.contains(classes.modalStatusType('warning')),
    ).toBe(true);
    expect(element?.classList.contains(classes.size('wide'))).toBe(true);
    expect(element?.classList.contains(classes.withCloseIcon)).toBe(true);
  });

  it('should append fullScreen and drop the close icon when asked', async () => {
    await renderModal({ fullScreen: true, showDismissButton: false });

    expect(host()?.classList.contains(classes.fullScreen)).toBe(true);
    expect(host()?.classList.contains(classes.withCloseIcon)).toBe(false);
    expect(query(`.${classes.closeIcon}`)).toBeNull();
  });

  it('should emit close from the dismiss button', async () => {
    const wrapper = await renderModal();

    query(`.${classes.closeIcon}`)?.click();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  describe('header', () => {
    it('should stay out of the DOM until showModalHeader', async () => {
      await renderModal({ title: 'Title' });

      expect(query(`.${classes.modalHeader}`)).toBeNull();
    });

    it('should print the title and the supporting text', async () => {
      await renderModal({
        showModalHeader: true,
        supportingText: 'Supporting',
        title: 'Title',
      });

      expect(query(`.${classes.modalHeaderTitle}`)?.textContent).toBe('Title');
      expect(query(`.${classes.modalHeaderTitle}`)?.getAttribute('title')).toBe(
        'Title',
      );
      expect(query(`.${classes.modalHeaderSupportingText}`)?.textContent).toBe(
        'Supporting',
      );
    });

    it('should carry the layout and alignment classes', async () => {
      await renderModal({
        showModalHeader: true,
        showStatusTypeIcon: true,
        statusTypeIconLayout: 'horizontal',
        supportingTextAlign: 'center',
        title: 'Title',
        titleAlign: 'center',
      });

      const header = query(`.${classes.modalHeader}`);

      expect(
        header?.classList.contains(`${classes.modalHeader}--horizontal`),
      ).toBe(true);
      expect(
        header?.classList.contains(
          `${classes.modalHeader}--title-align-center`,
        ),
      ).toBe(true);
      expect(
        header?.classList.contains(
          `${classes.modalHeader}--show-modal-status-type-icon`,
        ),
      ).toBe(true);
      expect(
        query(`.${classes.modalHeaderSupportingText}`)?.classList.contains(
          `${classes.modalHeaderSupportingText}--align-center`,
        ),
      ).toBe(true);
      expect(query(`.${classes.modalHeaderStatusTypeIcon}`)).not.toBeNull();
    });

    it('should draw the icon the status type asks for', async () => {
      await renderModal({
        modalStatusType: 'delete',
        showModalHeader: true,
        showStatusTypeIcon: true,
        title: 'Title',
      });

      expect(
        query(`.${classes.modalHeaderStatusTypeIcon} .mzn-icon`)?.getAttribute(
          'data-icon-name',
        ),
      ).toBe('trash');
    });
  });

  describe('footer', () => {
    it('should stay out of the DOM until showModalFooter', async () => {
      await renderModal({ confirmText: 'OK' });

      expect(query(`.${classes.modalFooter}`)).toBeNull();
    });

    it('should render the cancel and confirm buttons', async () => {
      await renderModal({
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        showModalFooter: true,
      });

      const buttons = queryAll(`.${classes.modalFooterActionsButton}`);

      expect(buttons.map((button) => button.textContent?.trim())).toEqual([
        'Cancel',
        'Confirm',
      ]);
    });

    it('should drop the cancel button when showCancelButton is false', async () => {
      await renderModal({
        confirmText: 'Confirm',
        showCancelButton: false,
        showModalFooter: true,
      });

      const buttons = queryAll(`.${classes.modalFooterActionsButton}`);

      expect(buttons).toHaveLength(1);
      expect(buttons[0].textContent?.trim()).toBe('Confirm');
    });

    it('should disable the cancel button while loading', async () => {
      await renderModal({
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        loading: true,
        showModalFooter: true,
      });

      const [cancel] = queryAll(`.${classes.modalFooterActionsButton}`);

      expect(cancel.hasAttribute('disabled')).toBe(true);
    });

    it('should emit cancel and confirm from the two buttons', async () => {
      const wrapper = await renderModal({
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        showModalFooter: true,
      });

      const [cancel, confirm] = queryAll(
        `.${classes.modalFooterActionsButton}`,
      );

      cancel.click();
      confirm.click();

      expect(wrapper.emitted('cancel')).toHaveLength(1);
      expect(wrapper.emitted('confirm')).toHaveLength(1);
    });

    it('should fill the action buttons only without auxiliary content', async () => {
      await renderModal({
        actionsButtonLayout: 'fill',
        confirmText: 'Confirm',
        showModalFooter: true,
      });

      expect(
        query(
          `.${classes.modalFooterActionsButtonContainer}`,
        )?.classList.contains(
          `${classes.modalFooterActionsButtonContainer}--fill-layout`,
        ),
      ).toBe(true);

      document.body.innerHTML = '';
      resetPortals();

      await renderModal({
        actionsButtonLayout: 'fill',
        auxiliaryContentType: 'annotation',
        confirmText: 'Confirm',
        showModalFooter: true,
      });

      expect(
        query(
          `.${classes.modalFooterActionsButtonContainer}`,
        )?.classList.contains(
          `${classes.modalFooterActionsButtonContainer}--fill-layout`,
        ),
      ).toBe(false);
    });

    it('should report the auxiliary checkbox state through the prop handler', async () => {
      const auxiliaryContentOnChange = vi.fn();

      await renderModal({
        auxiliaryContentLabel: 'Do not show again',
        auxiliaryContentOnChange,
        auxiliaryContentType: 'checkbox',
        confirmText: 'Confirm',
        showModalFooter: true,
      });

      const checkbox = query(
        `.${classes.modalFooterAuxiliaryContentContainer} input`,
      ) as HTMLInputElement;

      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      expect(auxiliaryContentOnChange).toHaveBeenCalledWith(true);
    });

    it('should switch the footer into password mode', async () => {
      await renderModal({
        auxiliaryContentType: 'password',
        confirmText: 'Login',
        passwordCheckedLabel: 'Remember me',
        showModalFooter: true,
      });

      expect(
        query(`.${classes.modalFooter}`)?.classList.contains(
          `${classes.modalFooter}--password-mode`,
        ),
      ).toBe(true);
      expect(query(`.${classes.modalFooterPasswordContainer}`)).not.toBeNull();
      expect(
        query(`.${classes.modalFooterAuxiliaryContentContainer}`),
      ).toBeNull();
    });
  });

  describe('body', () => {
    it('should skip the body container without children', async () => {
      await renderModal();

      expect(query(`.${classes.modalBodyContainer}`)).toBeNull();
    });

    it('should wrap the children in the body container', async () => {
      await renderModal({}, { default: () => h('p', 'body') });

      expect(query(`.${classes.modalBodyContainer}`)?.textContent).toBe('body');
    });

    it('should always show both separators for the extended type', async () => {
      await renderModal(
        { modalType: 'extended' },
        { default: () => h('p', 'body') },
      );

      const container = query(`.${classes.modalBodyContainer}`);

      expect(
        container?.classList.contains(
          classes.modalBodyContainerWithTopSeparator,
        ),
      ).toBe(true);
      expect(
        container?.classList.contains(
          classes.modalBodyContainerWithBottomSeparator,
        ),
      ).toBe(true);
    });
  });

  describe('modalType: extendedSplit', () => {
    it('should render both sides with the footer inside the left column', async () => {
      await renderModal({
        confirmText: 'Confirm',
        extendedSplitLeftSideContent: h('span', 'left'),
        extendedSplitRightSideContent: h('span', 'right'),
        modalType: 'extendedSplit',
        showModalFooter: true,
        size: 'wide',
      });

      expect(
        query(`.${classes.modalBodyContainerExtendedSplitRight}`)?.textContent,
      ).toBe('right');
      expect(
        query(`.${classes.modalBodyContainerExtendedSplitLeftSideContent}`)
          ?.textContent,
      ).toBe('left');
      expect(
        query(
          `.${classes.modalBodyContainerExtendedSplitLeft} > .${classes.modalFooter}`,
        ),
      ).not.toBeNull();
    });

    it('should move the sidebar with extendedSplitSidebarPosition', async () => {
      await renderModal({
        extendedSplitLeftSideContent: h('span', 'left'),
        extendedSplitRightSideContent: h('span', 'right'),
        extendedSplitSidebarPosition: 'left',
        modalType: 'extendedSplit',
        size: 'wide',
      });

      expect(
        query(
          `.${classes.modalBodyContainerExtendedSplit}`,
        )?.classList.contains(
          classes.modalBodyContainerExtendedSplitSidebarLeft,
        ),
      ).toBe(true);
    });
  });

  describe('closing', () => {
    it('should close on Escape', async () => {
      const wrapper = await renderModal();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('should keep Escape from closing when disabled', async () => {
      const wrapper = await renderModal({
        disableCloseOnEscapeKeyDown: true,
      });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(wrapper.emitted('close')).toBeUndefined();
    });

    it('should close on a backdrop click and report the click either way', async () => {
      const wrapper = await renderModal();

      query(`.${backdropClasses.backdrop}`)?.click();

      expect(wrapper.emitted('close')).toHaveLength(1);
      expect(wrapper.emitted('backdropClick')).toHaveLength(1);
    });

    it('should report the backdrop click without closing when disabled', async () => {
      const wrapper = await renderModal({
        disableCloseOnBackdropClick: true,
      });

      query(`.${backdropClasses.backdrop}`)?.click();

      expect(wrapper.emitted('close')).toBeUndefined();
      expect(wrapper.emitted('backdropClick')).toHaveLength(1);
    });
  });
});
