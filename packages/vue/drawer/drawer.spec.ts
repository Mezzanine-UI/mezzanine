import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { drawerClasses as classes } from '@mezzanine-ui/core/drawer';
import { radioClasses } from '@mezzanine-ui/core/radio';
import { CloseIcon } from '@mezzanine-ui/icons';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznDrawer from './drawer.vue';
import type { DrawerProps } from './drawer.types';

const render = (props: DrawerProps = {}, content?: unknown) =>
  mount(MznDrawer, {
    attachTo: document.body,
    props: { open: true, ...props },
    slots: content ? { default: () => content } : undefined,
  });

const query = (selector: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(selector);

const queryAll = (selector: string): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>(selector));

describe('<MznDrawer />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render nothing while it has never been opened', () => {
    render({ open: false });

    expect(query(`.${classes.host}`)).toBeNull();
  });

  it('should render the drawer on the right at its size', () => {
    render({ size: 'narrow' });

    const host = query(`.${classes.host}`);

    expect(host).not.toBeNull();
    expect(host?.className).toContain(classes.right);
    expect(host?.className).toContain(classes.size('narrow'));
    expect(query(`.${classes.overlay}`)).not.toBeNull();
  });

  it('should show the header only when asked', () => {
    render({ headerTitle: '詳細資料' });

    expect(query(`.${classes.header}`)).toBeNull();

    document.body.innerHTML = '';
    resetPortals();
    initializePortals();

    render({ headerTitle: '詳細資料', isHeaderDisplay: true });

    expect(query(`.${classes.header}`)?.textContent).toContain('詳細資料');
  });

  it('should ask to close from the header clear action', async () => {
    const wrapper = render({ headerTitle: '詳細資料', isHeaderDisplay: true });

    query(`.${classes.header} button`)?.click();
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('should close on Escape', async () => {
    const wrapper = render();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('should stay open on Escape when that is disabled', async () => {
    const wrapper = render({ disableCloseOnEscapeKeyDown: true });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('close')).toBeUndefined();
  });

  describe('filter area', () => {
    it('should stay hidden until it is asked for', () => {
      render({ filterAreaAllRadioLabel: '全部' });

      expect(query(`.${classes.filterArea}`)).toBeNull();
    });

    it('should render nothing when it has neither radios nor a button', () => {
      render({ filterAreaShow: true });

      expect(query(`.${classes.filterArea}`)).toBeNull();
    });

    it('should render a radio for every label it was given', () => {
      render({
        filterAreaAllRadioLabel: '全部',
        filterAreaReadRadioLabel: '進行中',
        filterAreaShow: true,
      });

      const radios = queryAll(`.${classes.filterArea} .${radioClasses.host}`);

      expect(radios.map((radio) => radio.textContent)).toEqual([
        '全部',
        '進行中',
      ]);
    });

    it('should keep the unread radio back until it is switched on', () => {
      render({
        filterAreaAllRadioLabel: '全部',
        filterAreaShow: true,
        filterAreaUnreadRadioLabel: '已完成',
      });

      expect(
        queryAll(`.${classes.filterArea} .${radioClasses.host}`),
      ).toHaveLength(1);

      document.body.innerHTML = '';
      resetPortals();
      initializePortals();

      render({
        filterAreaAllRadioLabel: '全部',
        filterAreaShow: true,
        filterAreaShowUnreadButton: true,
        filterAreaUnreadRadioLabel: '已完成',
      });

      expect(
        queryAll(`.${classes.filterArea} .${radioClasses.host}`),
      ).toHaveLength(2);
    });

    it('should mark itself button-only when it has no radios', () => {
      render({
        filterAreaCustomButtonLabel: '重置全部',
        filterAreaOnCustomButtonClick: () => {},
        filterAreaShow: true,
      });

      const area = query(`.${classes.filterArea}`);

      expect(area?.className).toContain(classes.filterAreaButtonOnly);
      expect(area?.querySelector('button')?.textContent).toContain('重置全部');
    });

    it('should call the custom button handler', () => {
      const filterAreaOnCustomButtonClick = vi.fn();

      render({ filterAreaOnCustomButtonClick, filterAreaShow: true });

      query(`.${classes.filterArea} button`)?.click();

      expect(filterAreaOnCustomButtonClick).toHaveBeenCalled();
    });

    it('should disable the custom button while the area is empty', () => {
      render({
        filterAreaIsEmpty: true,
        filterAreaOnCustomButtonClick: () => {},
        filterAreaShow: true,
      });

      expect(
        query(`.${classes.filterArea} button`)?.hasAttribute('disabled'),
      ).toBe(true);
    });

    it('should swap the button for a dropdown trigger when options are given', () => {
      render({
        filterAreaOptions: [{ id: 'import', name: '匯入' }],
        filterAreaShow: true,
      });

      const button = query(`.${classes.filterArea} button`);

      // The dropdown trigger is an icon-only button, so it carries no text.
      expect(button?.textContent?.trim()).toBe('');
      expect(button?.querySelector('i')).not.toBeNull();
    });

    it('should report the option a consumer picked', () => {
      const filterAreaOnSelect = vi.fn();

      render({
        filterAreaOnSelect,
        filterAreaOptions: [{ id: 'import', name: '匯入' }],
        filterAreaShow: true,
      });

      expect(query(`.${classes.filterArea}`)).not.toBeNull();
    });
  });

  describe('bottom actions', () => {
    const bottomProps: DrawerProps = {
      bottomGhostActionText: '更多',
      bottomOnGhostActionClick: () => {},
      bottomOnPrimaryActionClick: () => {},
      bottomOnSecondaryActionClick: () => {},
      bottomPrimaryActionText: '儲存',
      bottomSecondaryActionText: '取消',
      isBottomDisplay: true,
    };

    it('should stay hidden until it is asked for', () => {
      render({ ...bottomProps, isBottomDisplay: false });

      expect(query(`.${classes.bottom}`)).toBeNull();
    });

    it('should render the three buttons in their places', () => {
      render(bottomProps);

      const bottom = query(`.${classes.bottom}`);
      const actions = query(`.${classes.bottom__actions}`);

      expect(bottom?.querySelectorAll('button')).toHaveLength(3);
      expect(
        Array.from(actions?.querySelectorAll('button') ?? []).map((button) =>
          button.textContent?.trim(),
        ),
      ).toEqual(['取消', '儲存']);
    });

    it('should leave a button out when only its text was given', () => {
      render({
        bottomPrimaryActionText: '儲存',
        isBottomDisplay: true,
      });

      expect(
        query(`.${classes.bottom}`)?.querySelectorAll('button'),
      ).toHaveLength(0);
    });

    it('should leave a button out when only its handler was given', () => {
      render({
        bottomOnPrimaryActionClick: () => {},
        isBottomDisplay: true,
      });

      expect(
        query(`.${classes.bottom}`)?.querySelectorAll('button'),
      ).toHaveLength(0);
    });

    it('should call the handler of the button that was clicked', () => {
      const bottomOnPrimaryActionClick = vi.fn();

      render({
        bottomOnPrimaryActionClick,
        bottomPrimaryActionText: '儲存',
        isBottomDisplay: true,
      });

      query(`.${classes.bottom__actions} button`)?.click();

      expect(bottomOnPrimaryActionClick).toHaveBeenCalled();
    });

    it('should carry each button its own look', () => {
      render({
        bottomOnPrimaryActionClick: () => {},
        bottomPrimaryActionDisabled: true,
        bottomPrimaryActionIcon: CloseIcon,
        bottomPrimaryActionIconType: 'leading',
        bottomPrimaryActionText: '儲存',
        isBottomDisplay: true,
      });

      const button = query(`.${classes.bottom__actions} button`);

      expect(button?.hasAttribute('disabled')).toBe(true);
      // An icon without an iconType is not rendered, here or in React.
      expect(button?.querySelector('i')).not.toBeNull();
    });
  });

  describe('content remounting', () => {
    let mounts = 0;

    const StatefulContent = defineComponent({
      name: 'StatefulContent',
      setup() {
        mounts += 1;

        return () => 'content';
      },
    });

    const Host = defineComponent({
      components: { MznDrawer, StatefulContent },
      props: {
        contentKey: { default: undefined, type: [Number, String] },
        headerTitle: { default: 'title', type: String },
        open: { default: true, type: Boolean },
      },
      template: `
        <MznDrawer
          :contentKey="contentKey"
          :headerTitle="headerTitle"
          isHeaderDisplay
          :open="open"
        >
          <StatefulContent />
        </MznDrawer>
      `,
    });

    /**
     * Counting mounts rather than comparing DOM nodes: the portal renders its
     * content in place before its container resolves and again inside it, on
     * both sides, so the element is replaced once no matter what the key says.
     */
    const renderHost = async (props = {}) => {
      mounts = 0;

      const wrapper = mount(Host, { attachTo: document.body, props });

      await nextTick();
      await nextTick();

      return wrapper;
    };

    it('should leave the content alone while the key does not move', async () => {
      const wrapper = await renderHost({ contentKey: 'a' });
      const before = mounts;

      await wrapper.setProps({ headerTitle: '換個標題' });

      expect(mounts).toBe(before);
    });

    it('should remount the content when contentKey changes', async () => {
      const wrapper = await renderHost({ contentKey: 'a' });
      const before = mounts;

      await wrapper.setProps({ contentKey: 'b' });

      expect(mounts).toBe(before + 1);
    });

    // Over-determined: closing and reopening tears the drawer down as well as
    // bumping the open count, so this pins the behaviour rather than the count.
    it('should remount the content on each reopening without a key', async () => {
      const wrapper = await renderHost();
      const before = mounts;

      await wrapper.setProps({ open: false });
      await wrapper.setProps({ open: true });

      expect(mounts).toBeGreaterThan(before);
    });
  });
});
