import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { overflowTooltipClasses } from '@mezzanine-ui/core/overflow-tooltip';
import { tagClasses } from '@mezzanine-ui/core/tag';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznOverflowCounterTag from './overflow-counter-tag.vue';
import MznOverflowTooltip from './overflow-tooltip.vue';

const host = () =>
  document.body.querySelector(`.${overflowTooltipClasses.host}`);
const closeButtons = () =>
  Array.from(
    document.body.querySelectorAll(`.${tagClasses.closeButton}`),
  ) as HTMLButtonElement[];

describe('<MznOverflowTooltip />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render nothing while closed', async () => {
    mount(MznOverflowTooltip, {
      attachTo: document.body,
      props: { anchor: document.body, open: false, tags: ['A'] },
    });

    await nextTick();

    expect(host()).toBeNull();
  });

  it('should render one tag per label when open', async () => {
    mount(MznOverflowTooltip, {
      attachTo: document.body,
      props: { anchor: document.body, open: true, tags: ['Alpha', 'Beta'] },
    });

    await nextTick();

    expect(host()).not.toBeNull();
    expect(host()?.textContent).toContain('Alpha');
    expect(host()?.textContent).toContain('Beta');
  });

  it('should report the index of the dismissed tag', async () => {
    const wrapper = mount(MznOverflowTooltip, {
      attachTo: document.body,
      props: { anchor: document.body, open: true, tags: ['Alpha', 'Beta'] },
    });

    await nextTick();
    closeButtons()[1].click();

    expect(wrapper.emitted('tagDismiss')?.[0]).toEqual([1]);
  });

  it('should place the popper where it is told', async () => {
    mount(MznOverflowTooltip, {
      attachTo: document.body,
      props: {
        anchor: document.body,
        open: true,
        placement: 'bottom-end',
        tags: ['A'],
      },
    });

    await nextTick();
    await nextTick();

    expect(host()?.getAttribute('data-popper-placement')).toBe('bottom-end');
  });

  describe('prop: readOnly', () => {
    it('should render static tags with no close button', async () => {
      mount(MznOverflowTooltip, {
        attachTo: document.body,
        props: {
          anchor: document.body,
          open: true,
          readOnly: true,
          tags: ['A', 'B'],
        },
      });

      await nextTick();

      expect(
        document.body.querySelectorAll(`.${tagClasses.type('static')}`),
      ).toHaveLength(2);
      expect(closeButtons()).toHaveLength(0);
    });

    it('should render dismissable tags otherwise', async () => {
      mount(MznOverflowTooltip, {
        attachTo: document.body,
        props: { anchor: document.body, open: true, tags: ['A', 'B'] },
      });

      await nextTick();

      expect(
        document.body.querySelectorAll(`.${tagClasses.type('dismissable')}`),
      ).toHaveLength(2);
      expect(closeButtons()).toHaveLength(2);
    });
  });

  it('should size every tag from `tagSize`', async () => {
    mount(MznOverflowTooltip, {
      attachTo: document.body,
      props: {
        anchor: document.body,
        open: true,
        tagSize: 'sub',
        tags: ['A', 'B'],
      },
    });

    await nextTick();

    expect(
      document.body.querySelectorAll(`.${tagClasses.size('sub')}`),
    ).toHaveLength(2);
  });

  describe('width measurement', () => {
    it('should measure the content once the popper opens', async () => {
      const raf = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((cb) => {
          cb(0);

          return 0;
        });

      mount(MznOverflowTooltip, {
        attachTo: document.body,
        props: { anchor: document.body, open: true, tags: ['A', 'B'] },
      });

      await nextTick();

      expect(raf).toHaveBeenCalled();

      raf.mockRestore();
    });

    it('should measure again when the tag size changes', async () => {
      const raf = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((cb) => {
          cb(0);

          return 0;
        });

      const wrapper = mount(MznOverflowTooltip, {
        attachTo: document.body,
        props: {
          anchor: document.body,
          open: true,
          tagSize: 'sub',
          tags: ['A', 'B'],
        },
      });

      await nextTick();

      const callsAfterMount = raf.mock.calls.length;

      await wrapper.setProps({ tagSize: 'minor' });
      await nextTick();

      expect(raf.mock.calls.length).toBeGreaterThan(callsAfterMount);

      raf.mockRestore();
    });
  });
});

describe('<MznOverflowCounterTag />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should show how many tags it stands for', () => {
    const wrapper = mount(MznOverflowCounterTag, {
      attachTo: document.body,
      props: { tags: ['A', 'B', 'C'] },
    });

    expect(wrapper.get(`.${tagClasses.label}`).text()).toBe('3');
    expect(wrapper.get('button').classes()).toContain(
      overflowTooltipClasses.counterTagHost,
    );
  });

  it('should open the tooltip on click and close it on a click outside', async () => {
    const wrapper = mount(MznOverflowCounterTag, {
      attachTo: document.body,
      props: { tags: ['Alpha', 'Beta'] },
    });

    expect(host()).toBeNull();

    await wrapper.get('button').trigger('click');
    await nextTick();

    expect(host()).not.toBeNull();

    document.body.click();
    await nextTick();

    // The popper is held in the DOM until its leave transition ends, which
    // jsdom never reports, so the closing is read off the tooltip's `open`.
    expect(wrapper.findComponent(MznOverflowTooltip).props('open')).toBe(false);
  });

  it('should not close when the click lands inside the tooltip', async () => {
    const wrapper = mount(MznOverflowCounterTag, {
      attachTo: document.body,
      props: { tags: ['Alpha', 'Beta'] },
    });

    await wrapper.get('button').trigger('click');
    await nextTick();

    // A descendant, not the host itself: the host is caught by the identity
    // check, so only a nested target exercises the containment one.
    (
      host()?.querySelector(`.${overflowTooltipClasses.content}`) as HTMLElement
    ).click();
    await nextTick();

    expect(wrapper.findComponent(MznOverflowTooltip).props('open')).toBe(true);
  });

  it('should forward a dismissed tag index', async () => {
    const wrapper = mount(MznOverflowCounterTag, {
      attachTo: document.body,
      props: { tags: ['Alpha', 'Beta'] },
    });

    await wrapper.get('button').trigger('click');
    await nextTick();

    closeButtons()[0].click();

    expect(wrapper.emitted('tagDismiss')?.[0]).toEqual([0]);
  });

  it('should close when disabled, readOnly or the tag size changes', async () => {
    const wrapper = mount(MznOverflowCounterTag, {
      attachTo: document.body,
      props: { tags: ['Alpha'] },
    });

    await wrapper.get('button').trigger('click');
    await nextTick();

    expect(wrapper.findComponent(MznOverflowTooltip).props('open')).toBe(true);

    await wrapper.setProps({ tagSize: 'sub' });

    expect(wrapper.findComponent(MznOverflowTooltip).props('open')).toBe(false);
  });
});
