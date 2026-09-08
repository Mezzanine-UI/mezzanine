import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { contentHeaderClasses } from '@mezzanine-ui/core/content-header';
import { filterAreaClasses } from '@mezzanine-ui/core/filter-area';
import {
  sectionClasses as classes,
  sectionGroupClasses as groupClasses,
} from '@mezzanine-ui/core/section';
import { tabClasses } from '@mezzanine-ui/core/tab';
import MznContentHeader from '../content-header/content-header.vue';
import MznFilterArea from '../filter-area/filter-area.vue';
import MznTab from '../tab/tab.vue';
import MznTypography from '../typography/typography.vue';
import MznSectionGroup from './section-group.vue';
import MznSection from './section.vue';
import type { SectionProps } from './section.types';

const render = (props: SectionProps = {}, content = 'Content') =>
  mount(MznSection, { props, slots: { default: () => content } });

describe('<MznSection />', () => {
  it('should render its content inside the content box', () => {
    const wrapper = render();

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.get(`.${classes.hostContent}`).text()).toBe('Content');
  });

  it('should force the content header and the filter area to the sub size', () => {
    const wrapper = render({
      contentHeader: h(MznContentHeader, { size: 'main', title: 'Title' }),
      filterArea: h(MznFilterArea, { size: 'main' }),
    });

    expect(wrapper.get(`.${contentHeaderClasses.host}`).classes()).toContain(
      contentHeaderClasses.size('sub'),
    );
    expect(wrapper.get(`.${filterAreaClasses.host}`).classes()).toContain(
      filterAreaClasses.size('sub'),
    );
  });

  it('should leave the tab at whatever size it asked for', () => {
    const wrapper = render({ tab: h(MznTab, { size: 'main' }) });

    expect(wrapper.find(`.${tabClasses.host}`).exists()).toBe(true);
  });

  it('should order the three areas above the content', () => {
    const wrapper = render({
      contentHeader: h(MznContentHeader, { title: 'Title' }),
      filterArea: h(MznFilterArea),
      tab: h(MznTab),
    });

    const order = Array.from(wrapper.element.children).map(
      (el) => (el as Element).className,
    );

    expect(order[0]).toContain(contentHeaderClasses.host);
    expect(order[1]).toContain(filterAreaClasses.host);
    expect(order[2]).toContain(tabClasses.host);
    expect(order[3]).toContain(classes.hostContent);
  });

  it('should warn about and drop a node of the wrong kind', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = render({
      contentHeader: h(MznTypography, null, () => '不該出現'),
    });

    expect(wrapper.text()).not.toContain('不該出現');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid contentHeader type'),
    );

    warn.mockRestore();
  });

  it('should name the offending component in the warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render({ tab: h('span') });

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid tab type: <span>'),
    );

    warn.mockRestore();
  });
});

describe('<MznSectionGroup />', () => {
  it('should stack its sections vertically by default', () => {
    const wrapper = mount(MznSectionGroup, {
      slots: { default: () => [h(MznSection), h(MznSection)] },
    });

    expect(wrapper.classes()).toContain(groupClasses.host);
    expect(wrapper.classes()).not.toContain(groupClasses.hostHorizontal);
    expect(wrapper.findAll(`.${classes.host}`)).toHaveLength(2);
  });

  it('should lay them out in a row when asked', () => {
    const wrapper = mount(MznSectionGroup, {
      props: { direction: 'horizontal' },
    });

    expect(wrapper.classes()).toContain(groupClasses.hostHorizontal);
  });
});
