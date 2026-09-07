import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { badgeClasses } from '@mezzanine-ui/core/badge';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { CopyIcon, QuestionOutlineIcon } from '@mezzanine-ui/icons';
import MznBadge from '../badge/badge.vue';
import MznDescriptionContent from './description-content.vue';
import MznDescriptionGroup from './description-group.vue';
import MznDescriptionTitle from './description-title.vue';
import MznDescription from './description.vue';
import type { DescriptionProps } from './description.types';

const render = (props: DescriptionProps, content?: unknown) =>
  mount(MznDescription, {
    props,
    slots: content ? { default: () => content } : undefined,
  });

describe('<MznDescription />', () => {
  it('should render the title and lay the parts out horizontally', () => {
    const wrapper = render({ title: '訂購日期' });

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.classes()).toContain(classes.orientation('horizontal'));
    expect(wrapper.get(`.${classes.titleText}`).text()).toBe('訂購日期');
  });

  it('should lay the parts out vertically when asked', () => {
    const wrapper = render({ orientation: 'vertical', title: '訂購日期' });

    expect(wrapper.classes()).toContain(classes.orientation('vertical'));
  });

  it('should fill its size in on the content', () => {
    const wrapper = render(
      { size: 'sub', title: '訂購日期' },
      h(MznDescriptionContent, { children: '2025-11-03' }),
    );

    expect(wrapper.get(`.${classes.contentHost}`).classes()).toContain(
      classes.contentSize('sub'),
    );
    expect(wrapper.get(`.${classes.titleHost}`).classes()).toContain(
      classes.titleSize('sub'),
    );
  });

  it('should fill its size in on a content that cannot read the context', () => {
    const wrapper = render(
      { size: 'sub', title: '訂單狀態' },
      h(MznBadge, { text: '已出貨', variant: 'dot-success' }),
    );

    // A badge has no description context to fall back on, so the clone is the
    // only thing that can give it the size.
    expect(wrapper.getComponent(MznBadge).props('size')).toBe('sub');
  });

  it('should reach several contents through the context instead', () => {
    const wrapper = render({ size: 'sub', title: '訂購日期' }, [
      h(MznDescriptionContent, { children: '2025-11-03' }),
      h(MznDescriptionContent, { children: '2025-11-04' }),
    ]);

    // React clones only a single child, so more than one leaves the context as
    // the only route.
    wrapper.findAll(`.${classes.contentHost}`).forEach((content) => {
      expect(content.classes()).toContain(classes.contentSize('sub'));
    });
  });

  it('should leave a content that asked for its own size alone', () => {
    const wrapper = render(
      { size: 'sub', title: '訂購日期' },
      h(MznDescriptionContent, { children: '2025-11-03', size: 'main' }),
    );

    expect(wrapper.get(`.${classes.contentHost}`).classes()).toContain(
      classes.contentSize('main'),
    );
  });

  it('should hand its title props through', () => {
    const wrapper = render({
      title: '訂購日期',
      widthType: 'narrow',
    });

    expect(wrapper.get(`.${classes.titleHost}`).classes()).toContain(
      classes.titleWidth('narrow'),
    );
  });
});

describe('<MznDescriptionTitle />', () => {
  it('should render its text in a span by default', () => {
    const wrapper = mount(MznDescriptionTitle, {
      props: { children: 'Title' },
    });

    expect(wrapper.get(`.${classes.titleText}`).element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain(classes.titleWidth('stretch'));
  });

  it('should hand its text to a badge when one is asked for', () => {
    const wrapper = mount(MznDescriptionTitle, {
      props: { badge: 'dot-success', children: 'Title' },
    });

    const badge = wrapper.get(`.${badgeClasses.host}`);

    expect(badge.classes()).toContain(classes.titleText);
    expect(badge.text()).toBe('Title');
    // The badge takes the title's own text slot; nothing else carries it.
    expect(wrapper.findAll(`.${classes.titleText}`)).toHaveLength(1);
  });

  it('should render an icon without a tooltip when no tooltip is given', () => {
    const wrapper = mount(MznDescriptionTitle, {
      props: { children: 'Title', icon: QuestionOutlineIcon },
    });

    expect(wrapper.find('i').exists()).toBe(true);
  });

  it('should render no icon at all when none is given', () => {
    const wrapper = mount(MznDescriptionTitle, {
      props: { children: 'Title', tooltip: 'tooltip' },
    });

    expect(wrapper.find('i').exists()).toBe(false);
  });

  it('should take its width type', () => {
    const wrapper = mount(MznDescriptionTitle, {
      props: { children: 'Title', widthType: 'hug' },
    });

    expect(wrapper.classes()).toContain(classes.titleWidth('hug'));
  });
});

describe('<MznDescriptionContent />', () => {
  it('should render its text at the normal variant', () => {
    const wrapper = mount(MznDescriptionContent, {
      props: { children: 'rytass.com' },
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain(classes.contentVariant('normal'));
    expect(wrapper.classes()).toContain(classes.contentSize('main'));
    expect(wrapper.text()).toBe('rytass.com');
  });

  it('should put a caret in front of a trend', () => {
    const up = mount(MznDescriptionContent, {
      props: { children: '88%', variant: 'trend-up' },
    });

    expect(up.find(`.${classes.contentTrendUp}`).exists()).toBe(true);

    const down = mount(MznDescriptionContent, {
      props: { children: '88%', variant: 'trend-down' },
    });

    expect(down.find(`.${classes.contentTrendDown}`).exists()).toBe(true);
  });

  it('should report a click on its trailing icon', async () => {
    const wrapper = mount(MznDescriptionContent, {
      props: {
        children: 'rytass.com',
        icon: CopyIcon,
        onClickIcon: () => {},
        variant: 'with-icon',
      },
    });

    await wrapper.get(`.${classes.contentIcon}`).trigger('click');

    expect(wrapper.emitted('clickIcon')).toHaveLength(1);
  });

  it('should leave the icon without a handler when nobody listens', () => {
    const wrapper = mount(MznDescriptionContent, {
      props: { children: 'rytass.com', icon: CopyIcon, variant: 'with-icon' },
    });

    // An icon that has a click listener draws a pointer cursor, so the handler
    // has to be absent rather than merely inert.
    expect(
      wrapper.get(`.${classes.contentIcon}`).attributes('style'),
    ).not.toContain('pointer');
  });

  it('should render no icon outside the with-icon variant', () => {
    const wrapper = mount(MznDescriptionContent, {
      props: { children: 'rytass.com', icon: CopyIcon },
    });

    expect(wrapper.find(`.${classes.contentIcon}`).exists()).toBe(false);
  });
});

describe('<MznDescriptionGroup />', () => {
  it('should arrange the descriptions it holds', () => {
    const wrapper = mount(MznDescriptionGroup, {
      slots: {
        default: () => [
          h(MznDescription, { title: '訂購日期' }, () =>
            h(MznDescriptionContent, { children: '2025-11-03' }),
          ),
          h(MznDescription, { title: '訂單狀態' }, () =>
            h(MznBadge, { text: '已出貨', variant: 'dot-success' }),
          ),
        ],
      },
    });

    expect(wrapper.classes()).toContain(classes.groupHost);
    expect(wrapper.findAll(`.${classes.host}`)).toHaveLength(2);
  });
});
