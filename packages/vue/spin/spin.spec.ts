import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { iconClasses as classes } from '@mezzanine-ui/core/spin';
import { backdropClasses } from '@mezzanine-ui/core/backdrop';
import { resetPortals } from '../portal/portal-registry';
import MznSpin from './spin.vue';
import type { SpinProps } from './spin.types';

const renderSpin = async (props: SpinProps = {}, nested = false) => {
  const wrapper = mount(MznSpin, {
    attachTo: document.body,
    props,
    slots: nested
      ? { default: () => h('div', { id: 'content' }, 'inner') }
      : {},
  });

  await flushPromises();

  return wrapper;
};

const spin = () => document.body.querySelector<HTMLElement>(`.${classes.spin}`);
const ring = () =>
  document.body.querySelector<HTMLElement>(`.${classes.spinnerRing}`);

describe('MznSpin', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // See PORTING-PLAYBOOK P16.
    resetPortals();
  });

  describe('prop: loading', () => {
    it('should render nothing when loading is false', async () => {
      await renderSpin();

      expect(spin()).toBeNull();
    });

    it('should render the spinner when loading is true', async () => {
      await renderSpin({ loading: true });

      expect(spin()).not.toBeNull();
      expect(ring()?.querySelector(`.${classes.spinnerTail}`)).not.toBeNull();
    });
  });

  describe('prop: description', () => {
    it('should render the description when provided', async () => {
      await renderSpin({ description: 'loading...', loading: true });

      expect(
        spin()?.querySelector(`.${classes.description}`)?.textContent?.trim(),
      ).toBe('loading...');
    });

    it('should render no description element without one', async () => {
      await renderSpin({ loading: true });

      expect(spin()?.querySelector(`.${classes.description}`)).toBeNull();
    });

    it('should append descriptionClassName', async () => {
      await renderSpin({
        description: 'loading...',
        descriptionClassName: 'foo',
        loading: true,
      });

      expect(
        spin()
          ?.querySelector(`.${classes.description}`)
          ?.classList.contains('foo'),
      ).toBe(true);
    });
  });

  describe('prop: color', () => {
    it('should set the color variable on the ring', async () => {
      await renderSpin({ color: 'red', loading: true });

      expect(ring()?.style.getPropertyValue('--mzn-spin--color')).toBe('red');
    });

    it('should leave the variable unset without a color', async () => {
      await renderSpin({ loading: true });

      expect(ring()?.style.getPropertyValue('--mzn-spin--color')).toBe('');
    });
  });

  describe('prop: trackColor', () => {
    it('should set the track color variable on the ring', async () => {
      await renderSpin({ loading: true, trackColor: 'blue' });

      expect(ring()?.style.getPropertyValue('--mzn-spin--track-color')).toBe(
        'blue',
      );
    });

    it('should leave the variable unset without a track color', async () => {
      await renderSpin({ loading: true });

      expect(ring()?.style.getPropertyValue('--mzn-spin--track-color')).toBe(
        '',
      );
    });
  });

  describe('prop: size', () => {
    it.each(['main', 'sub', 'minor'] as const)(
      'should apply the %s size class',
      async (size) => {
        await renderSpin({ loading: true, size });

        expect(spin()?.classList.contains(classes.size(size))).toBe(true);
      },
    );

    it('should default to main', async () => {
      await renderSpin({ loading: true });

      expect(spin()?.classList.contains(classes.size('main'))).toBe(true);
    });
  });

  describe('prop: stretch', () => {
    it('should stretch the spinner in basic mode', async () => {
      await renderSpin({ loading: true, stretch: true });

      expect(spin()?.classList.contains(classes.stretch)).toBe(true);
    });

    it('should stretch the host when nested', async () => {
      const wrapper = await renderSpin({ loading: true, stretch: true }, true);

      expect(wrapper.element.classList.contains(classes.host)).toBe(true);
      expect(wrapper.element.classList.contains(classes.stretch)).toBe(true);
    });
  });

  describe('nested mode', () => {
    it('should wrap the content in a host container', async () => {
      const wrapper = await renderSpin({}, true);

      expect(wrapper.element.classList.contains(classes.host)).toBe(true);
      expect(wrapper.element.querySelector('#content')?.textContent).toBe(
        'inner',
      );
    });

    it('should render the backdrop with the light variant while loading', async () => {
      const wrapper = await renderSpin({ loading: true }, true);
      const backdrop = wrapper.element.querySelector(
        `.${backdropClasses.backdrop}`,
      );

      expect(backdrop).not.toBeNull();
      expect(
        backdrop?.classList.contains(backdropClasses.backdropVariant('light')),
      ).toBe(true);
    });

    it('should keep the backdrop out of the pointer path', async () => {
      await renderSpin({ loading: true }, true);

      const host = document.body.querySelector<HTMLElement>(
        `.${backdropClasses.host}`,
      );

      expect(host?.style.pointerEvents).toBe('none');
    });

    it('should render the spinner inside the backdrop content', async () => {
      const wrapper = await renderSpin({ loading: true }, true);

      expect(
        wrapper.element
          .querySelector(`.${backdropClasses.content}`)
          ?.querySelector(`.${classes.spin}`),
      ).not.toBeNull();
    });

    it('should not render the spinner while idle', async () => {
      await renderSpin({}, true);

      expect(spin()).toBeNull();
    });

    it('should let backdropProps through', async () => {
      const wrapper = await renderSpin(
        { backdropProps: { disableScrollLock: true }, loading: true },
        true,
      );

      expect(document.body.style.overflow).toBe('');
      expect(
        wrapper.element.querySelector(`.${backdropClasses.host}`),
      ).not.toBeNull();
    });
  });

  describe('attributes', () => {
    it('should append a consumer class to the nested host', async () => {
      const wrapper = mount(MznSpin, {
        attachTo: document.body,
        attrs: { class: 'foo' },
        slots: { default: () => h('div') },
      });

      await flushPromises();

      expect(wrapper.element.classList.contains('foo')).toBe(true);
    });
  });
});
