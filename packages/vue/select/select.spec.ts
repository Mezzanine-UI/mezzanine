import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { dropdownClasses } from '@mezzanine-ui/core/dropdown/dropdown';
import { selectClasses } from '@mezzanine-ui/core/select';
import { tagClasses } from '@mezzanine-ui/core/tag';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznSelect from './select.vue';
import type { SelectValue } from './select.types';

const options: DropdownOption[] = [
  { id: '1', name: 'item1' },
  { id: '2', name: 'item2' },
  { id: '3', name: 'item3' },
];

const treeOptions: DropdownOption[] = [
  {
    id: 'frontend',
    name: '前端',
    children: [
      { id: 'vue', name: 'Vue' },
      { id: 'react', name: 'React' },
    ],
  },
];

function mountSelect(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznSelect, {
    attachTo: document.body,
    props: { options, ...props },
  });
}

const items = () =>
  Array.from(
    document.body.querySelectorAll(`.${dropdownClasses.card}`),
  ) as HTMLElement[];
const listbox = () => document.body.querySelector(`.${dropdownClasses.list}`);

describe('<MznSelect />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render a readonly combobox input showing the placeholder', () => {
    const wrapper = mountSelect({ placeholder: '請選擇' });

    const input = wrapper.get('input');

    expect(input.attributes('placeholder')).toBe('請選擇');
    expect(input.attributes('readonly')).toBeDefined();
    expect(input.attributes('role')).toBe('combobox');
  });

  it('should mark the host with the mode and the full width', () => {
    const wrapper = mountSelect({ fullWidth: true, mode: 'multiple' });

    const host = wrapper.get(`.${selectClasses.host}`);

    expect(host.classes()).toContain(selectClasses.hostFullWidth);
    expect(host.classes()).toContain(selectClasses.hostMode('multiple'));
  });

  it('should show the selected name in the input', () => {
    const wrapper = mountSelect({ value: { id: '2', name: 'item2' } });

    expect(wrapper.get('input').element.value).toBe('item2');
  });

  it('should let `renderValue` decide the displayed text', () => {
    const wrapper = mountSelect({
      renderValue: (value: SelectValue | null) => `#${value?.id ?? '-'}`,
      value: { id: '2', name: 'item2' },
    });

    expect(wrapper.get('input').element.value).toBe('#2');
  });

  describe('opening', () => {
    it('should open on a trigger click and report the focus', async () => {
      const wrapper = mountSelect();

      await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
      await nextTick();

      expect(listbox()).not.toBeNull();
      expect(items()).toHaveLength(3);
      expect(wrapper.emitted('focus')).toHaveLength(1);
    });

    it('should stay closed when readOnly', async () => {
      const wrapper = mountSelect({ readOnly: true });

      await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
      await nextTick();

      expect(listbox()).toBeNull();
      expect(wrapper.emitted('focus')).toBeUndefined();
    });

    it('should open on an arrow key and close on Tab', async () => {
      const wrapper = mountSelect();
      const trigger = wrapper.get(`.${selectClasses.trigger}`);

      await trigger.trigger('keydown', { code: 'ArrowDown' });
      await nextTick();

      expect(listbox()).not.toBeNull();

      await trigger.trigger('keydown', { code: 'Tab' });

      expect(wrapper.emitted('blur')).toHaveLength(1);
    });
  });

  describe('single mode', () => {
    it('should report the picked option and close', async () => {
      const wrapper = mountSelect();

      await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
      await nextTick();
      items()[1].click();
      await nextTick();

      expect(wrapper.emitted('change')?.[0]).toEqual([
        { id: '2', name: 'item2' },
      ]);
      // Twice, as React does: the value control closes on a single pick, and
      // the select's own select handler closes again.
      expect(wrapper.emitted('blur')).toHaveLength(2);
      expect(wrapper.get('input').element.value).toBe('item2');
    });
  });

  describe('multiple mode', () => {
    it('should render one tag per selection', () => {
      const wrapper = mountSelect({
        mode: 'multiple',
        overflowStrategy: 'wrap',
        value: [
          { id: '1', name: 'item1' },
          { id: '2', name: 'item2' },
        ],
      });

      expect(wrapper.findAll(`.${tagClasses.host}`)).toHaveLength(2);
    });

    it('should add a picked option and remove one already picked', async () => {
      const wrapper = mountSelect({
        defaultValue: [{ id: '1', name: 'item1' }],
        mode: 'multiple',
      });

      await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
      await nextTick();

      items()[1].click();
      expect(wrapper.emitted('change')?.[0][0]).toEqual([
        { id: '1', name: 'item1' },
        { id: '2', name: 'item2' },
      ]);

      items()[0].click();
      expect(wrapper.emitted('change')?.[1][0]).toEqual([
        { id: '2', name: 'item2' },
      ]);
    });

    it('should stay open after a pick', async () => {
      const wrapper = mountSelect({ mode: 'multiple' });

      await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
      await nextTick();
      items()[0].click();
      await nextTick();

      expect(wrapper.emitted('blur')).toBeUndefined();
    });

    it('should drop a selection through the tag close button', async () => {
      const wrapper = mountSelect({
        defaultValue: [{ id: '1', name: 'item1' }],
        mode: 'multiple',
        overflowStrategy: 'wrap',
      });

      await wrapper.get(`.${tagClasses.closeButton}`).trigger('click');

      expect(wrapper.emitted('change')?.[0][0]).toEqual([]);
    });
  });

  describe('tree options', () => {
    it('should select every leaf under the picked branch', async () => {
      const wrapper = mountSelect({ mode: 'multiple', options: treeOptions });

      await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
      await nextTick();

      // Clicking the row itself expands the branch; the checkbox selects it.
      const checkbox = items()[0].querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;

      checkbox.click();

      expect(wrapper.emitted('change')?.[0][0]).toEqual([
        { id: 'vue', name: 'Vue' },
        { id: 'react', name: 'React' },
      ]);
    });

    it('should deselect every leaf when the branch is already full', async () => {
      const wrapper = mountSelect({
        mode: 'multiple',
        options: treeOptions,
        value: [
          { id: 'vue', name: 'Vue' },
          { id: 'react', name: 'React' },
        ],
      });

      await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
      await nextTick();

      (
        items()[0].querySelector('input[type="checkbox"]') as HTMLInputElement
      ).click();

      expect(wrapper.emitted('change')?.[0][0]).toEqual([]);
    });

    it('should give every tree option a prefixed checkbox', async () => {
      const wrapper = mountSelect({ mode: 'multiple', options: treeOptions });

      await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
      await nextTick();

      expect(
        document.body.querySelectorAll('input[type="checkbox"]').length,
      ).toBeGreaterThan(0);
    });
  });

  describe('clearing', () => {
    it('should only offer the clear button once a multiple select holds something', () => {
      const single = mountSelect({
        clearable: true,
        value: { id: '1', name: 'item1' },
      });
      const empty = mountSelect({
        clearable: true,
        mode: 'multiple',
        value: [],
      });

      // React gates it on `clearable && mode === 'multiple' && value.length`.
      expect(single.find('.mzn-clear-actions').exists()).toBe(false);
      expect(empty.find('.mzn-clear-actions').exists()).toBe(false);
    });

    it('should empty the selection and report it', async () => {
      const wrapper = mountSelect({
        clearable: true,
        mode: 'multiple',
        value: [{ id: '1', name: 'item1' }],
      });

      await wrapper.get('.mzn-clear-actions').trigger('click');

      expect(wrapper.emitted('change')?.[0]).toEqual([[]]);
      expect(wrapper.emitted('clear')).toHaveLength(1);
    });
  });

  it('should show the loading status instead of the options', async () => {
    const wrapper = mountSelect({
      loading: true,
      loadingText: '載入中',
      options: [],
    });

    await wrapper.get(`.${selectClasses.trigger}`).trigger('click');
    await nextTick();

    expect(listbox()?.textContent).toContain('載入中');
  });
});
