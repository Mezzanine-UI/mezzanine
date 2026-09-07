import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { dropdownClasses } from '@mezzanine-ui/core/dropdown/dropdown';
import { tagClasses } from '@mezzanine-ui/core/tag';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import type { SelectValue } from '../select/select.types';
import MznAutoComplete from './auto-complete.vue';

const options: SelectValue[] = [
  { id: 'apple', name: 'Apple' },
  { id: 'banana', name: 'Banana' },
  { id: 'cherry', name: 'Cherry' },
];

function mountAutoComplete(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznAutoComplete, {
    attachTo: document.body,
    props: { options, ...props },
  });
}

const items = () =>
  Array.from(
    document.body.querySelectorAll(`.${dropdownClasses.card}`),
  ) as HTMLElement[];
const itemNames = () => items().map((item) => item.textContent?.trim());
const listbox = () => document.body.querySelector(`.${dropdownClasses.list}`);

async function type(wrapper: VueWrapper, text: string): Promise<void> {
  const input = wrapper.get('input');

  input.element.value = text;
  await input.trigger('input');
  await nextTick();
}

describe('<MznAutoComplete />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render a combobox input carrying the placeholder', () => {
    const wrapper = mountAutoComplete({ placeholder: '請輸入' });

    const input = wrapper.get('input');

    expect(input.attributes('role')).toBe('combobox');
    expect(input.attributes('placeholder')).toBe('請輸入');
    expect(input.attributes('aria-expanded')).toBe('false');
  });

  it('should open the list on focus', async () => {
    const wrapper = mountAutoComplete();

    await wrapper.get('input').trigger('focus');
    await nextTick();

    expect(listbox()).not.toBeNull();
    expect(items()).toHaveLength(3);
    expect(wrapper.emitted('visibilityChange')?.[0]).toEqual([true]);
  });

  it('should filter the options by the typed text', async () => {
    const wrapper = mountAutoComplete();

    await wrapper.get('input').trigger('focus');
    await type(wrapper, 'an');
    await nextTick();

    expect(itemNames()).toEqual(['Banana']);
  });

  it('should ignore letter casing unless asked to respect it', async () => {
    const insensitive = mountAutoComplete();

    await insensitive.get('input').trigger('focus');
    await type(insensitive, 'apple');

    expect(itemNames()).toEqual(['Apple']);

    document.body.innerHTML = '';
    initializePortals();

    const sensitive = mountAutoComplete({ caseSensitive: true });

    await sensitive.get('input').trigger('focus');
    await type(sensitive, 'apple');

    expect(items()).toHaveLength(0);
  });

  it('should report every keystroke and search after the debounce', async () => {
    vi.useFakeTimers();

    const wrapper = mountAutoComplete({ searchDebounceTime: 300 });

    await wrapper.get('input').trigger('focus');
    await type(wrapper, 'ap');

    expect(wrapper.emitted('searchTextChange')?.[0]).toEqual(['ap']);
    expect(wrapper.emitted('search')).toBeUndefined();

    vi.advanceTimersByTime(300);

    expect(wrapper.emitted('search')?.at(-1)).toEqual(['ap']);

    vi.useRealTimers();
  });

  describe('single mode', () => {
    it('should report the picked option and close', async () => {
      const wrapper = mountAutoComplete();

      await wrapper.get('input').trigger('focus');
      await nextTick();
      items()[1].click();
      await nextTick();

      expect(wrapper.emitted('change')?.[0]).toEqual([options[1]]);
      expect(wrapper.emitted('visibilityChange')?.at(-1)).toEqual([false]);
    });

    it('should select the first option on Enter when nothing is highlighted', async () => {
      const wrapper = mountAutoComplete();

      await wrapper.get('input').trigger('focus');
      await nextTick();
      await wrapper.get('input').trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('change')?.[0]).toEqual([options[0]]);
    });
  });

  describe('multiple mode', () => {
    it('should add and remove the picked options', async () => {
      const wrapper = mountAutoComplete({ mode: 'multiple' });

      await wrapper.get('input').trigger('focus');
      await nextTick();

      items()[0].click();
      expect(wrapper.emitted('change')?.[0][0]).toEqual([options[0]]);

      items()[0].click();
      expect(wrapper.emitted('change')?.[1][0]).toEqual([]);
    });

    it('should drop the last tag on Backspace with an empty search', async () => {
      const wrapper = mountAutoComplete({
        mode: 'multiple',
        value: [options[0], options[1]],
      });

      await wrapper.get('input').trigger('focus');
      await wrapper.get('input').trigger('keydown', { key: 'Backspace' });

      expect(wrapper.emitted('change')?.[0][0]).toEqual([options[0]]);
    });

    it('should drop the first tag on Delete with an empty search', async () => {
      const wrapper = mountAutoComplete({
        mode: 'multiple',
        value: [options[0], options[1]],
      });

      await wrapper.get('input').trigger('focus');
      await wrapper.get('input').trigger('keydown', { key: 'Delete' });

      expect(wrapper.emitted('change')?.[0][0]).toEqual([options[1]]);
    });

    it('should render one tag per selection', () => {
      const wrapper = mountAutoComplete({
        mode: 'multiple',
        value: [options[0], options[1]],
      });

      expect(
        wrapper.findAll(`.${tagClasses.type('dismissable')}`),
      ).toHaveLength(2);
    });
  });

  describe('addable', () => {
    it('should offer the create action only for text that matches no option', async () => {
      const onInsert = vi.fn(
        (text: string, current: SelectValue[]): SelectValue[] => [
          ...current,
          { id: text, name: text },
        ],
      );
      const wrapper = mountAutoComplete({ addable: true, onInsert });

      await wrapper.get('input').trigger('focus');
      await type(wrapper, 'Apple');
      await nextTick();

      expect(document.body.textContent).not.toContain('建立 "Apple"');

      await type(wrapper, 'Durian');
      await nextTick();

      expect(document.body.textContent).toContain('建立 "Durian"');
    });

    it('should create and select the typed item on Enter', async () => {
      const onInsert = vi.fn(
        (text: string, current: SelectValue[]): SelectValue[] => [
          ...current,
          { id: text, name: text },
        ],
      );
      const wrapper = mountAutoComplete({
        addable: true,
        mode: 'multiple',
        onInsert,
      });

      await wrapper.get('input').trigger('focus');
      await type(wrapper, 'Durian');
      await wrapper.get('input').trigger('keydown', { key: 'Enter' });

      expect(onInsert).toHaveBeenCalledWith('Durian', options);
      expect(wrapper.emitted('change')?.[0][0]).toEqual([
        { id: 'Durian', name: 'Durian' },
      ]);
    });

    it('should split a bulk paste on the separators', async () => {
      const created: string[] = [];
      const onInsert = (
        text: string,
        current: SelectValue[],
      ): SelectValue[] => {
        created.push(text);

        return [...current, { id: text, name: text }];
      };
      const wrapper = mountAutoComplete({
        addable: true,
        mode: 'multiple',
        onInsert,
      });

      await wrapper.get('input').trigger('focus');
      await type(wrapper, 'Durian, Elderberry');
      await wrapper.get('input').trigger('keydown', { key: 'Enter' });

      expect(created).toEqual(['Durian', 'Elderberry']);
    });

    it('should warn when `addable` is set without a handler', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mountAutoComplete({ addable: true });

      expect(warn).toHaveBeenCalledWith(
        '[AutoComplete] `addable` 已開啟但未提供 `onInsert`，已停用建立功能。',
      );

      warn.mockRestore();
    });
  });

  describe('escape', () => {
    it('should close the list and leave the search alone in single mode', async () => {
      const wrapper = mountAutoComplete();

      await wrapper.get('input').trigger('focus');
      await nextTick();
      await wrapper.get('input').trigger('keydown', { key: 'Escape' });

      expect(wrapper.emitted('visibilityChange')?.at(-1)).toEqual([false]);
    });
  });

  it('should stay where the `open` prop puts it', async () => {
    const wrapper = mountAutoComplete({ open: true });

    await nextTick();

    expect(listbox()).not.toBeNull();

    await wrapper.get('input').trigger('keydown', { key: 'Escape' });
    await nextTick();

    // Controlled: only the report changes, the list stays put.
    expect(wrapper.emitted('visibilityChange')?.at(-1)).toEqual([false]);
    expect(listbox()).not.toBeNull();
  });

  it('should show the empty status when nothing matches', async () => {
    const wrapper = mountAutoComplete({ emptyText: '沒有符合的項目' });

    await wrapper.get('input').trigger('focus');
    await type(wrapper, 'zzz');
    await nextTick();

    expect(listbox()?.textContent).toContain('沒有符合的項目');
  });

  describe('exposed control', () => {
    it('should clear only the search text through `setSearchText`', async () => {
      const wrapper = mountAutoComplete();

      await wrapper.get('input').trigger('focus');
      await type(wrapper, 'Ban');

      expect(itemNames()).toEqual(['Banana']);

      (
        wrapper.vm as unknown as { setSearchText: (t: string) => void }
      ).setSearchText('');
      await nextTick();

      expect(itemNames()).toEqual(['Apple', 'Banana', 'Cherry']);
    });
  });
});
