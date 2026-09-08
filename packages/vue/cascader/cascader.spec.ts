import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { cascaderClasses as classes } from '@mezzanine-ui/core/cascader';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznCascader from './cascader.vue';
import type { CascaderOption, CascaderProps } from './cascader.types';

const options: CascaderOption[] = [
  {
    id: 'taiwan',
    name: '台灣',
    children: [
      {
        id: 'taipei',
        name: '台北市',
        children: [
          { id: 'daan', name: '大安區' },
          { id: 'xinyi', name: '信義區', disabled: true },
        ],
      },
      { id: 'keelung', name: '基隆市', disabled: true, children: [] },
    ],
  },
  { id: 'japan', name: '日本' },
];

const render = (props: Partial<CascaderProps> = {}) =>
  mount(MznCascader, {
    attachTo: document.body,
    props: { options, ...props },
  });

const queryAll = (selector: string): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>(selector));

const panels = (): HTMLElement[] => queryAll(`.${classes.panel}`);

const itemsOf = (panelIndex: number): HTMLElement[] =>
  Array.from(
    panels()[panelIndex]?.querySelectorAll<HTMLElement>(`.${classes.item}`) ??
      [],
  );

const openIt = async (wrapper: ReturnType<typeof render>): Promise<void> => {
  await wrapper.get('input').trigger('click');
  await nextTick();
};

describe('<MznCascader />', () => {
  beforeEach(() => {
    resetPortals();
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render the trigger with the placeholder and no panels', () => {
    const wrapper = render({ placeholder: '國家 / 城市 / 區域' });

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.get('input').attributes('placeholder')).toBe(
      '國家 / 城市 / 區域',
    );
    expect(panels()).toHaveLength(0);
  });

  it('should take the full width when asked', () => {
    expect(render({ fullWidth: true }).classes()).toContain(
      classes.hostFullWidth,
    );
  });

  it('should open the first panel and announce the focus', async () => {
    const wrapper = render();

    await openIt(wrapper);

    expect(panels()).toHaveLength(1);
    expect(itemsOf(0).map((item) => item.textContent)).toEqual([
      '台灣',
      '日本',
    ]);
    expect(wrapper.emitted('focus')).toHaveLength(1);
  });

  it('should stay closed while disabled or read-only', async () => {
    const disabled = render({ disabled: true });

    await openIt(disabled);

    expect(panels()).toHaveLength(0);

    resetPortals();
    document.body.innerHTML = '';
    initializePortals();

    const readOnly = render({ readOnly: true });

    await openIt(readOnly);

    expect(panels()).toHaveLength(0);
  });

  it('should open the next panel when a branch is chosen', async () => {
    const wrapper = render();

    await openIt(wrapper);
    itemsOf(0)[0].click();
    await nextTick();

    expect(panels()).toHaveLength(2);
    expect(itemsOf(0)[0].className).toContain(classes.itemActive);
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('should settle on a leaf, report it and close', async () => {
    const wrapper = render();

    await openIt(wrapper);
    itemsOf(0)[0].click();
    await nextTick();
    itemsOf(1)[0].click();
    await nextTick();
    itemsOf(2)[0].click();
    await nextTick();

    expect(wrapper.emitted('change')?.[0][0]).toEqual([
      expect.objectContaining({ id: 'taiwan' }),
      expect.objectContaining({ id: 'taipei' }),
      expect.objectContaining({ id: 'daan' }),
    ]);
    expect(panels()).toHaveLength(0);
    expect(wrapper.emitted('blur')).toHaveLength(1);
    expect(wrapper.get('input').element.value).toBe('台灣 / 台北市 / 大安區');
  });

  it('should ignore a disabled option', async () => {
    const wrapper = render();

    await openIt(wrapper);

    const keelung = itemsOf(0)[0];

    keelung.click();
    await nextTick();

    const disabledItem = itemsOf(1)[1];

    expect(disabledItem.className).toContain(classes.itemDisabled);
    expect(disabledItem.getAttribute('aria-disabled')).toBe('true');

    disabledItem.click();
    await nextTick();

    expect(panels()).toHaveLength(2);
  });

  it('should mark a leaf as selected only in its own panel', async () => {
    const wrapper = render({
      value: [
        { id: 'taiwan', name: '台灣' },
        { id: 'taipei', name: '台北市' },
        { id: 'daan', name: '大安區' },
      ],
    });

    await openIt(wrapper);

    expect(itemsOf(0)[0].className).not.toContain(classes.itemSelected);
    expect(itemsOf(2)[0].className).toContain(classes.itemSelected);
    expect(itemsOf(2)[0].getAttribute('aria-selected')).toBe('true');
  });

  it('should show the branch arrow and the leaf check', async () => {
    const wrapper = render({
      value: [
        { id: 'taiwan', name: '台灣' },
        { id: 'taipei', name: '台北市' },
        { id: 'daan', name: '大安區' },
      ],
    });

    await openIt(wrapper);

    expect(
      itemsOf(0)[0].querySelector(`.${classes.itemAppend} i`),
    ).not.toBeNull();
    expect(itemsOf(0)[0].getAttribute('aria-expanded')).toBe('true');
    // A leaf that is not the selected one shows nothing at all.
    expect(itemsOf(2)[1].querySelector(`.${classes.itemAppend} i`)).toBeNull();
  });

  it('should walk the panel with the arrow keys and pick with Enter', async () => {
    const wrapper = render();

    await openIt(wrapper);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await nextTick();

    expect(itemsOf(0)[0].className).toContain(classes.itemFocused);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await nextTick();

    expect(panels()).toHaveLength(2);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await nextTick();

    expect(panels()).toHaveLength(1);
  });

  it('should skip disabled options while moving down', async () => {
    const wrapper = render();

    await openIt(wrapper);
    itemsOf(0)[0].click();
    await nextTick();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await nextTick();

    expect(itemsOf(1)[0].className).toContain(classes.itemFocused);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await nextTick();

    // 基隆市 is disabled, so the focus has nowhere to go and stays put.
    expect(itemsOf(1)[0].className).toContain(classes.itemFocused);
    expect(itemsOf(1)[1].className).not.toContain(classes.itemFocused);
  });

  it('should close on Escape', async () => {
    const wrapper = render();

    await openIt(wrapper);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(panels()).toHaveLength(0);
  });

  it('should close when the click lands outside', async () => {
    const wrapper = render();

    await openIt(wrapper);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(panels()).toHaveLength(0);
  });

  it('should mark the trigger partial while a branch is open', async () => {
    const wrapper = render();

    await openIt(wrapper);
    itemsOf(0)[0].click();
    await nextTick();

    expect(document.querySelector(`.${classes.triggerPartial}`)).not.toBeNull();
  });

  it('should show the value while closed and the walked path while open', async () => {
    const wrapper = render({
      value: [
        { id: 'taiwan', name: '台灣' },
        { id: 'taipei', name: '台北市' },
        { id: 'daan', name: '大安區' },
      ],
    });

    expect(wrapper.get('input').element.value).toBe('台灣 / 台北市 / 大安區');

    await openIt(wrapper);
    itemsOf(0)[0].click();
    await nextTick();

    expect(wrapper.get('input').element.value).toBe('台灣');
  });

  it('should clear the value and report it', async () => {
    const wrapper = render({
      clearable: true,
      value: [
        { id: 'taiwan', name: '台灣' },
        { id: 'japan', name: '日本' },
      ],
    });

    await wrapper.get('button').trigger('click');
    await nextTick();

    expect(wrapper.emitted('change')?.[0][0]).toEqual([]);
  });

  it('should keep an uncontrolled default value', () => {
    const wrapper = render({
      defaultValue: [
        { id: 'taiwan', name: '台灣' },
        { id: 'japan', name: '日本' },
      ],
    });

    expect(wrapper.get('input').element.value).toBe('台灣 / 日本');
  });

  it('should give each panel the max height it was told', async () => {
    const wrapper = render({ menuMaxHeight: 200 });

    await openIt(wrapper);

    expect(panels()[0].style.maxHeight).toBe('200px');
  });
});
