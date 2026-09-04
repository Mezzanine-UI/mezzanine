import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { dropdownClasses } from '@mezzanine-ui/core/dropdown/dropdown';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import MznButton from '../button/button.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznDropdown from './dropdown.vue';
import type { DropdownTriggerProps } from './dropdown.types';
import MznDropdownAction from './dropdown-action.vue';
import MznDropdownStatus from './dropdown-status.vue';

const options: DropdownOption[] = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
];

function mountDropdown(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznDropdown, {
    attachTo: document.body,
    props: { options, ...props },
    slots: {
      default: (triggerProps: DropdownTriggerProps) =>
        h(MznButton, triggerProps, () => 'Trigger'),
    },
  });
}

const listbox = () => document.body.querySelector(`.${dropdownClasses.list}`);
const items = () =>
  Array.from(
    document.body.querySelectorAll(`.${dropdownClasses.card}`),
  ) as HTMLElement[];

describe('<MznDropdown />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render the trigger and keep the list closed', () => {
    const wrapper = mountDropdown();

    expect(wrapper.get('button').text()).toBe('Trigger');
    expect(listbox()).toBeNull();
  });

  it('should open on a trigger click and report the change', async () => {
    const wrapper = mountDropdown();

    await wrapper.get('button').trigger('click');
    await nextTick();

    expect(listbox()).not.toBeNull();
    expect(items()).toHaveLength(3);
    expect(wrapper.emitted('visibilityChange')?.[0]).toEqual([true]);
    expect(wrapper.emitted('open')).toHaveLength(1);
  });

  it('should disable every option when disabled', async () => {
    const wrapper = mountDropdown({ disabled: true });

    await wrapper.get('button').trigger('click');
    await nextTick();

    // `disabled` reaches the list, not the trigger: the dropdown still opens.
    expect(listbox()).not.toBeNull();
    expect(
      items().every((item) =>
        item.classList.contains(`${dropdownClasses.cardDisabled}`),
      ),
    ).toBe(true);
  });

  it('should stay where the `open` prop puts it', async () => {
    const wrapper = mountDropdown({ open: true });

    await nextTick();
    await nextTick();
    expect(listbox()).not.toBeNull();

    await wrapper.get('button').trigger('click');
    await nextTick();

    // Controlled: the click only reports, it does not close the list.
    expect(wrapper.emitted('visibilityChange')?.[0]).toEqual([false]);
    expect(listbox()).not.toBeNull();
  });

  it('should emit the option a click picks, leaving the list open', async () => {
    const wrapper = mountDropdown();

    await wrapper.get('button').trigger('click');
    await nextTick();
    items()[1].click();
    await nextTick();

    // React forwards a clicked option and leaves the open state to the caller;
    // only a keyboard pick closes the list.
    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]]);
    expect(wrapper.emitted('visibilityChange')?.at(-1)).toEqual([true]);
  });

  it('should stay open after a keyboard pick in multiple mode', async () => {
    const wrapper = mountDropdown({ mode: 'multiple', open: true, value: [] });
    const trigger = wrapper.get('button');

    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('select')).toHaveLength(1);
    expect(wrapper.emitted('visibilityChange')).toBeUndefined();
  });

  describe('keyboard', () => {
    it('should open on ArrowDown', async () => {
      const wrapper = mountDropdown();

      await wrapper.get('button').trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      expect(listbox()).not.toBeNull();
    });

    it('should walk the options and wrap around', async () => {
      const wrapper = mountDropdown({ open: true });
      const trigger = wrapper.get('button');

      // No option is active yet, so ArrowDown lands on the first and ArrowUp
      // wraps past it to the last.
      await trigger.trigger('keydown', { key: 'ArrowDown' });
      await trigger.trigger('keydown', { key: 'ArrowUp' });
      await trigger.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('select')?.[0]).toEqual([options[2]]);
      expect(wrapper.emitted('visibilityChange')?.at(-1)).toEqual([false]);
    });

    it('should close on Escape', async () => {
      const wrapper = mountDropdown();

      await wrapper.get('button').trigger('click');
      await wrapper.get('button').trigger('keydown', { key: 'Escape' });

      expect(wrapper.emitted('visibilityChange')?.at(-1)).toEqual([false]);
    });

    it('should leave navigation alone while activeIndex is controlled', async () => {
      const wrapper = mountDropdown({ activeIndex: 0, open: true });
      const trigger = wrapper.get('button');

      await trigger.trigger('keydown', { key: 'ArrowDown' });
      await trigger.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('select')).toBeUndefined();
    });
  });

  it('should show the loading status when there is nothing to list', async () => {
    const wrapper = mountDropdown({
      loadingText: 'Loading…',
      options: [],
      status: 'loading',
    });

    await wrapper.get('button').trigger('click');
    await nextTick();

    expect(items()).toHaveLength(0);
    expect(listbox()?.textContent).toContain('Loading…');
  });
});

describe('<MznDropdownStatus />', () => {
  it('should render the loading text', () => {
    const wrapper = mount(MznDropdownStatus, {
      props: { loadingText: 'Searching…', status: 'loading' },
    });

    expect(wrapper.text()).toContain('Searching…');
  });

  it('should render the empty text', () => {
    const wrapper = mount(MznDropdownStatus, {
      props: { emptyText: 'Nothing here', status: 'empty' },
    });

    expect(wrapper.text()).toContain('Nothing here');
  });
});

describe('<MznDropdownAction />', () => {
  it('should render nothing while no action is listened for', () => {
    const wrapper = mount(MznDropdownAction, { props: { showActions: true } });

    expect(wrapper.find(`.${dropdownClasses.action}`).exists()).toBe(false);
  });

  it('should render nothing while `showActions` is false', () => {
    const wrapper = mount(MznDropdownAction, {
      props: { onCancel: () => {}, onConfirm: () => {} },
    });

    expect(wrapper.find(`.${dropdownClasses.action}`).exists()).toBe(false);
  });

  it('should render cancel and confirm in the default mode', async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const wrapper = mount(MznDropdownAction, {
      props: { onCancel, onConfirm, showActions: true },
    });

    const buttons = wrapper.findAll('button');

    expect(buttons.map((button) => button.text())).toEqual([
      'Cancel',
      'Confirm',
    ]);

    await buttons[0].trigger('click');
    await buttons[1].trigger('click');

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should render only the clear button when clear is the one listener', () => {
    const wrapper = mount(MznDropdownAction, {
      props: { onClear: () => {}, showActions: true },
    });

    expect(wrapper.findAll('button')).toHaveLength(1);
    expect(wrapper.get('button').text()).toBe('Clear Options');
  });

  it('should render only the custom action when click is the one listener', () => {
    const wrapper = mount(MznDropdownAction, {
      props: { actionText: 'Do it', onClick: () => {}, showActions: true },
    });

    expect(wrapper.findAll('button')).toHaveLength(1);
    expect(wrapper.get('button').text()).toBe('Do it');
  });
});
