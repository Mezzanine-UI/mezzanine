import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { navigationClasses } from '@mezzanine-ui/core/navigation';
import MznNavigation from '../navigation/navigation.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznLayoutLeftPanel from './layout-left-panel.vue';
import MznLayoutMain from './layout-main.vue';
import MznLayoutRightPanel from './layout-right-panel.vue';
import MznLayout from './layout.vue';
import { MIN_PANEL_WIDTH } from './use-side-panel-resize';

const render = (props = {}, children: unknown[] = []) =>
  mount(MznLayout, {
    attachTo: document.body,
    props,
    slots: { default: () => children },
  });

describe('<MznLayout />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render the host and a content wrapper', () => {
    const wrapper = render({}, [h(MznLayoutMain)]);

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.find(`.${classes.contentWrapper}`).exists()).toBe(true);
    expect(wrapper.find(`.${classes.navigation}`).exists()).toBe(false);
  });

  it('should wrap a navigation in its own container', () => {
    const wrapper = render({}, [h(MznNavigation), h(MznLayoutMain)]);

    const navigation = wrapper.get(`.${classes.navigation}`);

    expect(navigation.find(`.${navigationClasses.host}`).exists()).toBe(true);
  });

  it('should append the class names it was given', () => {
    const wrapper = render(
      { contentWrapperClassName: 'bar', navigationClassName: 'foo' },
      [h(MznNavigation), h(MznLayoutMain)],
    );

    expect(wrapper.get(`.${classes.navigation}`).classes()).toContain('foo');
    expect(wrapper.get(`.${classes.contentWrapper}`).classes()).toContain(
      'bar',
    );
  });

  it('should order the panels around the main area whatever order they were written in', () => {
    const wrapper = render({}, [
      h(MznLayoutRightPanel, { open: true }),
      h(MznLayoutMain),
      h(MznLayoutLeftPanel, { open: true }),
    ]);

    const wrapperEl = wrapper.get(`.${classes.contentWrapper}`).element;
    const order = Array.from(wrapperEl.children).map(
      (el) => (el as Element).className,
    );

    expect(order[0]).toContain(classes.sidePanelLeft);
    expect(order[1]).toContain(classes.main);
    expect(order[2]).toContain(classes.sidePanelRight);
  });
});

describe('<MznLayoutLeftPanel />', () => {
  it('should render nothing while closed', () => {
    const wrapper = mount(MznLayoutLeftPanel);

    expect(wrapper.find('aside').exists()).toBe(false);
  });

  it('should take its width in pixels', () => {
    const wrapper = mount(MznLayoutLeftPanel, {
      props: { defaultWidth: 300, open: true },
    });

    // Vue leaves a bare number invalid, so the length has to carry its unit.
    expect(wrapper.get('aside').attributes('style')).toContain('300px');
  });

  it('should never start narrower than the minimum', () => {
    const wrapper = mount(MznLayoutLeftPanel, {
      props: { defaultWidth: 100, open: true },
    });

    expect(wrapper.get('aside').attributes('style')).toContain(
      `${MIN_PANEL_WIDTH}px`,
    );
  });

  it('should describe its divider as a separator', () => {
    const wrapper = mount(MznLayoutLeftPanel, {
      props: { defaultWidth: 300, open: true },
    });

    const divider = wrapper.get(`.${classes.divider}`);

    expect(divider.attributes('role')).toBe('separator');
    expect(divider.attributes('aria-orientation')).toBe('vertical');
    expect(divider.attributes('aria-valuemin')).toBe(String(MIN_PANEL_WIDTH));
    expect(divider.attributes('aria-valuenow')).toBe('300');
    expect(divider.attributes('tabindex')).toBe('0');
  });

  it('should widen with the right arrow and narrow with the left', async () => {
    const wrapper = mount(MznLayoutLeftPanel, {
      props: { defaultWidth: 300, open: true },
    });

    const divider = wrapper.get(`.${classes.divider}`);

    await divider.trigger('keydown', { key: 'ArrowRight' });

    expect(wrapper.emitted('widthChange')?.[0]).toEqual([310]);

    await divider.trigger('keydown', { key: 'ArrowLeft' });

    expect(wrapper.emitted('widthChange')?.[1]).toEqual([300]);
  });

  it('should stop narrowing at the minimum', async () => {
    const wrapper = mount(MznLayoutLeftPanel, {
      props: { defaultWidth: MIN_PANEL_WIDTH, open: true },
    });

    await wrapper
      .get(`.${classes.divider}`)
      .trigger('keydown', { key: 'ArrowLeft' });

    expect(wrapper.emitted('widthChange')?.[0]).toEqual([MIN_PANEL_WIDTH]);
  });

  it('should mark the divider while it is being dragged', async () => {
    const wrapper = mount(MznLayoutLeftPanel, {
      attachTo: document.body,
      props: { defaultWidth: 300, open: true },
    });

    const divider = wrapper.get(`.${classes.divider}`);

    await divider.trigger('mousedown', { clientX: 0 });

    expect(divider.classes()).toContain(classes.dividerDragging);

    document.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();

    expect(divider.classes()).not.toContain(classes.dividerDragging);
  });

  it('should put its content before the divider', () => {
    const wrapper = mount(MznLayoutLeftPanel, {
      props: { defaultWidth: 300, open: true },
    });

    const children = Array.from(wrapper.get('aside').element.children);

    expect((children[0] as Element).className).toContain(
      classes.sidePanelContent,
    );
    expect((children[1] as Element).className).toContain(classes.divider);
  });
});

describe('<MznLayoutRightPanel />', () => {
  it('should put its divider before the content', () => {
    const wrapper = mount(MznLayoutRightPanel, {
      props: { defaultWidth: 300, open: true },
    });

    const children = Array.from(wrapper.get('aside').element.children);

    expect((children[0] as Element).className).toContain(classes.divider);
    expect((children[1] as Element).className).toContain(
      classes.sidePanelContent,
    );
  });

  it('should widen with the left arrow instead', async () => {
    const wrapper = mount(MznLayoutRightPanel, {
      props: { defaultWidth: 300, open: true },
    });

    await wrapper
      .get(`.${classes.divider}`)
      .trigger('keydown', { key: 'ArrowLeft' });

    expect(wrapper.emitted('widthChange')?.[0]).toEqual([310]);
  });
});
