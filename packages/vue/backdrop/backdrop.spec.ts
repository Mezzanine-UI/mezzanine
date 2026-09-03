import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { backdropClasses } from '@mezzanine-ui/core/backdrop';
import { resetPortals } from '../portal/portal-registry';
import MznBackdrop from './backdrop.vue';
import type { BackdropProps } from './backdrop.types';

const renderBackdrop = async (
  props: BackdropProps = {},
  attrs: Record<string, unknown> = {},
) => {
  const wrapper = mount(MznBackdrop, {
    attachTo: document.body,
    attrs,
    props,
    slots: { default: () => h('span', 'foo') },
  });

  await flushPromises();

  return wrapper;
};

const host = () => document.body.querySelector(`.${backdropClasses.host}`);
const backdrop = () =>
  document.body.querySelector<HTMLElement>(`.${backdropClasses.backdrop}`);

describe('MznBackdrop', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    // See PORTING-PLAYBOOK P16: the registry caches its containers.
    resetPortals();
  });

  it('should render the host inside the portal container', async () => {
    await renderBackdrop();

    expect(host()).toBeInstanceOf(HTMLElement);
    expect(host()?.getAttribute('role')).toBe('presentation');
    expect(host()?.classList.contains(backdropClasses.hostAbsolute)).toBe(true);
  });

  it('should render the default slot in the content element', async () => {
    await renderBackdrop();

    expect(
      host()?.querySelector(`.${backdropClasses.content}`)?.textContent,
    ).toBe('foo');
  });

  it('should append a fallthrough class to the host', async () => {
    await renderBackdrop({}, { class: 'foo' });

    expect(host()?.classList.contains('foo')).toBe(true);
    expect(host()?.classList.contains(backdropClasses.host)).toBe(true);
  });

  describe('prop: open', () => {
    it.each([false, true])('should mark the host for open=%s', async (open) => {
      await renderBackdrop({ open });

      expect(host()?.classList.contains(backdropClasses.hostOpen)).toBe(open);
      expect(host()?.getAttribute('aria-hidden')).toBe(`${!open}`);
    });

    it.each([false, true])(
      'should render the backdrop only when open, given open=%s',
      async (open) => {
        await renderBackdrop({ open });

        expect(!!backdrop()).toBe(open);
      },
    );
  });

  describe('prop: variant', () => {
    it.each(['dark', 'light'] as const)(
      'should apply the %s variant class',
      async (variant) => {
        await renderBackdrop({ open: true, variant });

        expect(
          backdrop()?.classList.contains(
            backdropClasses.backdropVariant(variant),
          ),
        ).toBe(true);
      },
    );

    it('should default to dark', async () => {
      await renderBackdrop({ open: true });

      expect(
        backdrop()?.classList.contains(backdropClasses.backdropVariant('dark')),
      ).toBe(true);
    });
  });

  describe('clicking the backdrop', () => {
    it('should emit backdropClick', async () => {
      const wrapper = await renderBackdrop({ open: true });

      backdrop()?.click();

      expect(wrapper.emitted('backdropClick')).toHaveLength(1);
    });

    it('should emit close', async () => {
      const wrapper = await renderBackdrop({ open: true });

      backdrop()?.click();

      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('should not emit close if disableCloseOnBackdropClick=true', async () => {
      const wrapper = await renderBackdrop({
        disableCloseOnBackdropClick: true,
        open: true,
      });

      backdrop()?.click();

      expect(wrapper.emitted('close')).toBeUndefined();
      expect(wrapper.emitted('backdropClick')).toHaveLength(1);
    });
  });

  describe('scroll lock', () => {
    it('should lock body scroll while open and release it on unmount', async () => {
      const wrapper = await renderBackdrop({ open: true });

      expect(document.body.style.overflow).toBe('hidden');

      wrapper.unmount();

      expect(document.body.style.overflow).toBe('');
    });

    it('should release the lock when it closes', async () => {
      const wrapper = await renderBackdrop({ open: true });

      expect(document.body.style.overflow).toBe('hidden');

      await wrapper.setProps({ open: false });

      expect(document.body.style.overflow).toBe('');
    });

    it('should not lock when disableScrollLock=true', async () => {
      await renderBackdrop({ disableScrollLock: true, open: true });

      expect(document.body.style.overflow).toBe('');
    });
  });
});
