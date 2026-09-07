import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import {
  CalendarIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from '@mezzanine-ui/icons';
import { resetPortals } from '../portal/portal-registry';
import MznBaseCard from './base-card.vue';
import MznCardGroup from './card-group.vue';
import MznFourThumbnailCard from './four-thumbnail-card.vue';
import MznQuickActionCard from './quick-action-card.vue';
import MznSingleThumbnailCard from './single-thumbnail-card.vue';
import MznThumbnail from './thumbnail.vue';

const image = () => h('img', { alt: 'sample', src: '/a.png' });

describe('<MznBaseCard />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPortals();
  });

  it('should render the header only when there is something to put in it', () => {
    const withHeader = mount(MznBaseCard, { props: { title: 'Title' } });
    const withoutHeader = mount(MznBaseCard);

    expect(withHeader.find(`.${classes.baseHeader}`).exists()).toBe(true);
    expect(withoutHeader.find(`.${classes.baseHeader}`).exists()).toBe(false);
    expect(withoutHeader.find(`.${classes.baseContent}`).exists()).toBe(true);
  });

  it('should print the title and the description', () => {
    const wrapper = mount(MznBaseCard, {
      props: { description: 'Description', title: 'Title' },
    });

    expect(wrapper.get(`.${classes.baseHeaderTitle}`).text()).toBe('Title');
    expect(wrapper.get(`.${classes.baseHeaderDescription}`).text()).toBe(
      'Description',
    );
  });

  it('should mark itself disabled and read-only', () => {
    const wrapper = mount(MznBaseCard, {
      props: { disabled: true, readOnly: true, title: 'Title' },
    });

    expect(wrapper.classes()).toContain(classes.baseDisabled);
    expect(wrapper.classes()).toContain(classes.baseReadOnly);
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('aria-readonly')).toBe('true');
  });

  it('should render as the component the attribute asks for', () => {
    const wrapper = mount(MznBaseCard, {
      attrs: { component: 'a', href: '/somewhere' },
      props: { title: 'Title' },
    });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('href')).toBe('/somewhere');
    expect(wrapper.attributes('component')).toBeUndefined();
  });

  describe('type', () => {
    it('should render no header action by default', () => {
      const wrapper = mount(MznBaseCard, { props: { title: 'Title' } });

      expect(wrapper.find(`.${classes.baseHeaderAction}`).exists()).toBe(false);
    });

    it('should render an action button that does not bubble', async () => {
      const onCardClick = vi.fn();
      const wrapper = mount(MznBaseCard, {
        attrs: { onClick: onCardClick },
        props: { actionName: 'Edit', title: 'Title', type: 'action' },
      });
      const button = wrapper.get(`.${classes.baseHeaderAction} button`);

      expect(button.text()).toBe('Edit');

      await button.trigger('click');

      expect(wrapper.emitted('actionClick')).toHaveLength(1);
      expect(onCardClick).not.toHaveBeenCalled();
    });

    it('should render a dropdown trigger', () => {
      const wrapper = mount(MznBaseCard, {
        props: {
          options: [{ id: '1', name: 'One' }],
          title: 'Title',
          type: 'overflow',
        },
      });

      expect(
        wrapper
          .get(`.${classes.baseHeaderAction} button`)
          .attributes('aria-haspopup'),
      ).toBe('listbox');
    });

    it('should render a toggle and report its change', async () => {
      const wrapper = mount(MznBaseCard, {
        props: {
          checked: false,
          title: 'Title',
          toggleLabel: 'Enabled',
          type: 'toggle',
        },
      });
      const input = wrapper.get(`.${classes.baseHeaderAction} input`);

      (input.element as HTMLInputElement).checked = true;
      await input.trigger('change');

      expect(wrapper.emitted('toggleChange')).toHaveLength(1);
      expect(wrapper.get(`.${classes.baseHeaderAction}`).text()).toContain(
        'Enabled',
      );
    });
  });
});

describe('<MznQuickActionCard />', () => {
  it('should render a button with the icon and the text', () => {
    const wrapper = mount(MznQuickActionCard, {
      props: { icon: CalendarIcon, subtitle: 'Sub', title: 'Title' },
    });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.find(`.${classes.quickActionIcon}`).exists()).toBe(true);
    expect(wrapper.get(`.${classes.quickActionTitle}`).text()).toBe('Title');
    expect(wrapper.get(`.${classes.quickActionSubtitle}`).text()).toBe('Sub');
  });

  it('should drop the content wrapper without text', () => {
    const wrapper = mount(MznQuickActionCard, {
      props: { icon: CalendarIcon },
    });

    expect(wrapper.find(`.${classes.quickActionContent}`).exists()).toBe(false);
  });

  it('should stack for the vertical mode', () => {
    expect(
      mount(MznQuickActionCard, {
        props: { mode: 'vertical', title: 'Title' },
      }).classes(),
    ).toContain(classes.quickActionVertical);
  });

  it('should mark itself disabled and read-only', () => {
    const wrapper = mount(MznQuickActionCard, {
      props: { disabled: true, readOnly: true, title: 'Title' },
    });

    expect(wrapper.classes()).toContain(classes.quickActionDisabled);
    expect(wrapper.classes()).toContain(classes.quickActionReadOnly);
  });
});

describe('<MznSingleThumbnailCard />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPortals();
  });

  const render = (props = {}) =>
    mount(MznSingleThumbnailCard, {
      props: { title: 'Title', ...props } as never,
      slots: { default: image },
    });

  it('should wrap the image and the info section', () => {
    const wrapper = render({ subtitle: 'Sub' });

    expect(wrapper.classes()).toContain(classes.thumbnail);
    expect(wrapper.find(`.${classes.singleThumbnail} img`).exists()).toBe(true);
    expect(wrapper.get(`.${classes.thumbnailInfoTitle}`).text()).toBe('Title');
    expect(wrapper.get(`.${classes.thumbnailInfoSubtitle}`).text()).toBe('Sub');
  });

  it('should colour the filetype badge by category', () => {
    const wrapper = render({ filetype: 'pdf' });
    const badge = wrapper.get(`.${classes.thumbnailInfoFiletype}`);

    expect(badge.text()).toBe('PDF');
    expect(badge.classes().length).toBeGreaterThan(1);
  });

  it('should render the tag', () => {
    expect(render({ tag: 'New' }).get(`.${classes.thumbnailTag}`).text()).toBe(
      'New',
    );
  });

  describe('the personal action', () => {
    it('should stay out without an icon', () => {
      expect(
        render().find(`.${classes.thumbnailPersonalAction}`).exists(),
      ).toBe(false);
    });

    it('should swap the icon while active and report the click', async () => {
      const personalActionOnClick = vi.fn();
      const wrapper = render({
        personalActionActive: true,
        personalActionActiveIcon: StarFilledIcon,
        personalActionIcon: StarOutlineIcon,
        personalActionOnClick,
      });
      const button = wrapper.get(`.${classes.thumbnailPersonalAction}`);

      expect(button.get('.mzn-icon').attributes('data-icon-name')).toBe(
        'star-filled',
      );

      await button.trigger('click');

      expect(personalActionOnClick).toHaveBeenCalledWith(
        expect.any(MouseEvent),
        true,
      );
    });
  });

  it('should report the info action and the option select', async () => {
    const action = render({ actionName: 'Click', type: 'action' });

    await action.get(`.${classes.thumbnailInfoAction} button`).trigger('click');

    expect(action.emitted('actionClick')).toHaveLength(1);

    const overflow = render({
      options: [{ id: '1', name: 'One' }],
      type: 'overflow',
    });

    expect(
      overflow
        .get(`.${classes.thumbnailInfoAction} button`)
        .attributes('aria-haspopup'),
    ).toBe('listbox');
  });
});

describe('<MznFourThumbnailCard />', () => {
  const thumbnail = (title: string) =>
    h(MznThumbnail, { title }, { default: image });

  it('should fill the grid up to four slots', () => {
    const wrapper = mount(MznFourThumbnailCard, {
      props: { title: 'Album' },
      slots: { default: () => [thumbnail('a'), thumbnail('b')] },
    });

    expect(wrapper.findAll(`.${classes.fourThumbnailThumbnail}`)).toHaveLength(
      4,
    );
    expect(
      wrapper.findAll(`.${classes.fourThumbnailThumbnailEmpty}`),
    ).toHaveLength(2);
  });

  it('should keep only the first four and warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(MznFourThumbnailCard, {
      props: { title: 'Album' },
      slots: {
        default: () => Array.from({ length: 6 }, (_, i) => thumbnail(`${i}`)),
      },
    });

    expect(wrapper.findAll(`.${classes.fourThumbnailThumbnail}`)).toHaveLength(
      4,
    );
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });

  it('should drop a child that is not a thumbnail', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(MznFourThumbnailCard, {
      props: { title: 'Album' },
      slots: { default: () => [thumbnail('a'), h('span', 'nope')] },
    });

    expect(
      wrapper.findAll(`.${classes.fourThumbnailThumbnailEmpty}`),
    ).toHaveLength(3);
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });
});

describe('<MznThumbnail />', () => {
  it('should overlay the title', () => {
    const wrapper = mount(MznThumbnail, {
      props: { title: 'Photo' },
      slots: { default: image },
    });

    expect(wrapper.classes()).toContain(classes.fourThumbnailThumbnail);
    expect(wrapper.get(`.${classes.fourThumbnailOverlay}`).text()).toBe(
      'Photo',
    );
  });

  it('should render as the component the attribute asks for', () => {
    const wrapper = mount(MznThumbnail, {
      attrs: { component: 'a', href: '/x' },
      slots: { default: image },
    });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('component')).toBeUndefined();
  });
});

describe('<MznCardGroup />', () => {
  it('should take its min-width from the first card', () => {
    const wrapper = mount(MznCardGroup, {
      slots: {
        default: () => [
          h(MznQuickActionCard, { title: 'A' }),
          h(MznQuickActionCard, { title: 'B' }),
        ],
      },
    });

    expect(wrapper.classes()).toContain(classes.group);
    expect(wrapper.classes()).toContain(classes.groupQuickAction);
  });

  it('should drop a child that is not a card', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(MznCardGroup, {
      slots: { default: () => [h('span', 'nope')] },
    });

    expect(wrapper.element.children).toHaveLength(0);
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });

  it('should render the skeletons the loading type asks for', async () => {
    const wrapper = mount(MznCardGroup, {
      props: { loading: true, loadingCount: 2, loadingType: 'base' },
    });

    await nextTick();

    expect(wrapper.findAll(`.${classes.base}`)).toHaveLength(2);
    expect(wrapper.findAll('.mzn-skeleton').length).toBeGreaterThan(0);
  });

  it('should pass the thumbnail size on to the thumbnail skeletons', () => {
    const wrapper = mount(MznCardGroup, {
      props: {
        loading: true,
        loadingCount: 1,
        loadingThumbnailAspectRatio: '4/3',
        loadingThumbnailWidth: 160,
        loadingType: 'single-thumbnail',
      },
    });

    const skeleton = wrapper.get(`.${classes.singleThumbnail} .mzn-skeleton`);

    expect(skeleton.attributes('style')).toContain('aspect-ratio: 4/3');
    expect(skeleton.attributes('style')).toContain('width: 160px');
    expect(wrapper.classes()).toContain(classes.groupSingleThumbnail);
  });
});
