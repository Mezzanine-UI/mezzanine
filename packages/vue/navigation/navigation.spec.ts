import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import type { FunctionalComponent } from 'vue';
import { badgeClasses } from '@mezzanine-ui/core/badge';
import {
  navigationClasses as classes,
  navigationFooterClasses as footerClasses,
  navigationHeaderClasses as headerClasses,
  navigationIconButtonClasses as iconButtonClasses,
  navigationOptionCategoryClasses as categoryClasses,
  navigationOptionClasses as optionClasses,
} from '@mezzanine-ui/core/navigation';
import { HomeIcon, QuestionOutlineIcon } from '@mezzanine-ui/icons';
import MznBadge from '../badge/badge.vue';
import MznTypography from '../typography/typography.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznNavigationFooter from './navigation-footer.vue';
import MznNavigationHeader from './navigation-header.vue';
import MznNavigationIconButton from './navigation-icon-button.vue';
import MznNavigationOptionCategory from './navigation-option-category.vue';
import MznNavigationOption from './navigation-option.vue';
import MznNavigation from './navigation.vue';
import type { NavigationProps } from './navigation.types';

const option = (title: string, props: Record<string, unknown> = {}) =>
  h(MznNavigationOption, { title, ...props });

const render = (props: NavigationProps = {}, children: unknown[] = []) =>
  mount(MznNavigation, {
    attachTo: document.body,
    props,
    slots: { default: () => children },
  });

describe('<MznNavigation />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render expanded by default', () => {
    const wrapper = render({}, [option('首頁')]);

    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.classes()).toContain(classes.expand);
    expect(wrapper.classes()).not.toContain(classes.collapsed);
    expect(wrapper.get(`.${classes.list}`).text()).toContain('首頁');
  });

  it('should render collapsed when told to', () => {
    const wrapper = render({ collapsed: true }, [option('首頁')]);

    expect(wrapper.classes()).toContain(classes.collapsed);
  });

  it('should put the header first and the footer last', () => {
    const wrapper = render({}, [
      h(MznNavigationFooter),
      option('首頁'),
      h(MznNavigationHeader, { title: 'Mezzanine' }),
    ]);

    const tags = Array.from(wrapper.element.children).map(
      (el) => (el as Element).tagName,
    );

    expect(tags).toEqual(['HEADER', 'DIV', 'FOOTER']);
  });

  it('should warn about a child it does not recognise', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render({}, [h(MznTypography, null, () => '不該出現')]);

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Navigation only accepts NavigationOption'),
    );

    warn.mockRestore();
  });

  it('should collapse from the header toggle and report it', async () => {
    const wrapper = render({}, [
      h(MznNavigationHeader, { title: 'Mezzanine' }),
      option('首頁'),
    ]);

    const toggle = wrapper.get(`.${iconButtonClasses.host}`);

    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(toggle.attributes('aria-label')).toBe('Toggle navigation');

    await toggle.trigger('click');

    expect(wrapper.emitted('collapseChange')?.[0]).toEqual([true]);
    expect(wrapper.classes()).toContain(classes.collapsed);
  });

  it('should report the path of the option that was clicked', async () => {
    const wrapper = render({}, [option('首頁'), option('會員管理')]);

    await wrapper.findAll(`.${optionClasses.content}`)[1].trigger('click');

    expect(wrapper.emitted('optionClick')?.[0]).toEqual([['會員管理']]);
    expect(wrapper.findAll(`.${optionClasses.host}`)[1].classes()).toContain(
      optionClasses.active,
    );
  });

  it('should mark the option named by activatedPath', () => {
    const wrapper = render({ activatedPath: ['會員管理'] }, [
      option('首頁'),
      option('會員管理'),
    ]);

    expect(wrapper.findAll(`.${optionClasses.host}`)[1].classes()).toContain(
      optionClasses.active,
    );
  });

  it('should hide the options a filter does not match', async () => {
    const wrapper = render({ filter: true }, [
      option('首頁'),
      option('會員管理'),
    ]);

    const input = wrapper.get(`.${classes.searchInput} input`);

    await input.setValue('會員');

    const hosts = wrapper.findAll(`.${optionClasses.host}`);

    expect(hosts[0].classes()).toContain(optionClasses.hidden);
    expect(hosts[1].classes()).not.toContain(optionClasses.hidden);
  });

  it('should activate the option whose href matches the pathname', async () => {
    window.history.pushState({}, '', '/orders/pending');

    const wrapper = render({}, [
      option('首頁', { href: '/' }),
      option('訂單管理', { href: '/orders' }),
    ]);

    await nextTick();

    expect(wrapper.emitted('optionClick')?.[0]).toEqual([['訂單管理']]);

    window.history.pushState({}, '', '/');
  });

  it('should require an exact href match when asked', async () => {
    window.history.pushState({}, '', '/orders/pending');

    const wrapper = render({ exactActivatedMatch: true }, [
      option('訂單管理', { href: '/orders' }),
    ]);

    await nextTick();

    expect(wrapper.emitted('optionClick')).toBeUndefined();

    window.history.pushState({}, '', '/');
  });
});

describe('<MznNavigationOption />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render a leaf with an href as an anchor', () => {
    const wrapper = render({}, [option('首頁', { href: '/home' })]);

    const content = wrapper.get(`.${optionClasses.content}`);

    expect(content.element.tagName).toBe('A');
    expect(content.attributes('href')).toBe('/home');
    expect(content.attributes('role')).toBeUndefined();
    expect(wrapper.get(`.${optionClasses.host}`).classes()).toContain(
      optionClasses.basic,
    );
  });

  it('should render a group as a button-shaped div', () => {
    const wrapper = render({}, [
      h(MznNavigationOption, { title: '數據分析' }, () => [option('流量報表')]),
    ]);

    const content = wrapper.get(`.${optionClasses.content}`);

    expect(content.element.tagName).toBe('DIV');
    expect(content.attributes('role')).toBe('button');
    expect(content.attributes('aria-expanded')).toBe('false');
    expect(wrapper.get(`.${optionClasses.host}`).classes()).not.toContain(
      optionClasses.basic,
    );
  });

  it('should open a group when it is clicked', async () => {
    const wrapper = render({}, [
      h(MznNavigationOption, { title: '數據分析' }, () => [option('流量報表')]),
    ]);

    await wrapper.get(`.${optionClasses.content}`).trigger('click');

    expect(
      wrapper.get(`.${optionClasses.content}`).attributes('aria-expanded'),
    ).toBe('true');
    expect(wrapper.get(`.${optionClasses.host}`).classes()).toContain(
      optionClasses.open,
    );
  });

  it('should open a group on Enter as well', async () => {
    const wrapper = render({}, [
      h(MznNavigationOption, { title: '數據分析' }, () => [option('流量報表')]),
    ]);

    await wrapper
      .get(`.${optionClasses.content}`)
      .trigger('keydown', { key: 'Enter' });

    expect(
      wrapper.get(`.${optionClasses.content}`).attributes('aria-expanded'),
    ).toBe('true');
  });

  it('should start open when defaultOpen is set', () => {
    const wrapper = render({}, [
      h(MznNavigationOption, { defaultOpen: true, title: '數據分析' }, () => [
        option('流量報表'),
      ]),
    ]);

    expect(wrapper.get(`.${optionClasses.group}`).text()).toContain('流量報表');
  });

  it('should treat a lone badge as content, not as a sub-option', () => {
    const wrapper = render({}, [
      h(
        MznNavigationOption,
        { href: '/notifications', title: '通知中心' },
        () => [h(MznBadge, { count: 8, variant: 'count-alert' })],
      ),
    ]);

    const content = wrapper.get(`.${optionClasses.content}`);

    expect(content.element.tagName).toBe('A');
    expect(content.find(`.${badgeClasses.host}`).exists()).toBe(true);
    expect(content.find(`.${optionClasses.toggleIcon}`).exists()).toBe(false);
  });

  it('should warn about a child that is neither an option nor a badge', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render({}, [
      h(MznNavigationOption, { title: '數據分析' }, () => [
        h(MznTypography, null, () => '不該出現'),
      ]),
    ]);

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'NavigationOption only accepts NavigationOption or Badge',
      ),
    );

    warn.mockRestore();
  });

  it('should render an href leaf with the navigation own anchor component', () => {
    const MyAnchor: FunctionalComponent = (_props, { attrs, slots }) =>
      h('a', { 'data-message': 'MyAnchor', ...attrs }, slots.default?.());

    MyAnchor.inheritAttrs = false;

    const wrapper = render({ optionsAnchorComponent: MyAnchor }, [
      option('首頁', { href: '/home' }),
    ]);

    expect(
      wrapper.get(`.${optionClasses.content}`).attributes('data-message'),
    ).toBe('MyAnchor');
  });

  it('should let an option override the anchor component', () => {
    const NavAnchor: FunctionalComponent = (_props, { attrs, slots }) =>
      h('a', { 'data-message': 'nav', ...attrs }, slots.default?.());
    const OwnAnchor: FunctionalComponent = (_props, { attrs, slots }) =>
      h('a', { 'data-message': 'own', ...attrs }, slots.default?.());

    NavAnchor.inheritAttrs = false;
    OwnAnchor.inheritAttrs = false;

    const wrapper = render({ optionsAnchorComponent: NavAnchor }, [
      option('首頁', { anchorComponent: OwnAnchor, href: '/home' }),
    ]);

    expect(
      wrapper.get(`.${optionClasses.content}`).attributes('data-message'),
    ).toBe('own');
  });

  it('should nest the levels it renders at', () => {
    const wrapper = render({}, [
      h(MznNavigationOption, { defaultOpen: true, title: '數據分析' }, () => [
        option('流量報表'),
      ]),
    ]);

    const contents = wrapper.findAll(`.${optionClasses.content}`);

    expect(contents[0].classes()).toContain(optionClasses.level(1));
    expect(contents[1].classes()).toContain(optionClasses.level(2));
  });

  it('should shorten its title to two characters while collapsed without an icon', () => {
    const wrapper = render({ collapsed: true }, [option('會員管理')]);

    expect(wrapper.get(`.${optionClasses.title}`).text()).toBe('會員');
  });

  it('should drop the title while collapsed behind an icon', () => {
    const wrapper = render({ collapsed: true }, [
      option('會員管理', { icon: HomeIcon }),
    ]);

    // The icon speaks for the option, so the title fades out — and the fade
    // mounts nothing until it first enters.
    expect(wrapper.find(`.${optionClasses.title}`).exists()).toBe(false);
    expect(wrapper.find(`.${optionClasses.icon}`).exists()).toBe(true);
  });

  it('should keep the whole title once expanded', () => {
    const wrapper = render({}, [option('會員管理', { icon: HomeIcon })]);

    expect(wrapper.get(`.${optionClasses.title}`).text()).toBe('會員管理');
  });
});

describe('<MznNavigationOptionCategory />', () => {
  it('should label its list with its own title', () => {
    const wrapper = mount(MznNavigationOptionCategory, {
      props: { title: '主要功能' },
      slots: { default: () => [option('儀表板')] },
    });

    const titleId = wrapper.get(`.${categoryClasses.title}`).attributes('id');

    expect(wrapper.get('ul').attributes('aria-labelledby')).toBe(titleId);
    expect(wrapper.get('ul').text()).toContain('儀表板');
  });

  it('should drop anything that is not an option', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(MznNavigationOptionCategory, {
      props: { title: '主要功能' },
      slots: { default: () => [h(MznTypography, null, () => '不該出現')] },
    });

    expect(wrapper.get('ul').text()).toBe('');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'NavigationOptionCategory only accepts NavigationOption',
      ),
    );

    warn.mockRestore();
  });
});

describe('<MznNavigationHeader />', () => {
  it('should keep the brand as plain text when nobody listens', () => {
    const wrapper = mount(MznNavigationHeader, {
      props: { title: 'Mezzanine' },
    });

    expect(wrapper.get(`.${headerClasses.content}`).element.tagName).toBe(
      'SPAN',
    );
  });

  it('should turn the brand into a button for a listener', async () => {
    const onBrandClick = vi.fn();
    const wrapper = mount(MznNavigationHeader, {
      props: { onBrandClick, title: 'Mezzanine' },
    });

    const brand = wrapper.get(`.${headerClasses.content}`);

    expect(brand.element.tagName).toBe('BUTTON');
    expect(brand.attributes('type')).toBe('button');

    await brand.trigger('click');

    expect(onBrandClick).toHaveBeenCalled();
  });

  it('should mark itself as carrying a logo only when one is given', () => {
    const without = mount(MznNavigationHeader, {
      props: { title: 'Mezzanine' },
    });

    expect(without.classes()).not.toContain(headerClasses.hasChildren);

    const with_ = mount(MznNavigationHeader, {
      props: { title: 'Mezzanine' },
      slots: { default: () => h('span', { 'aria-label': 'logo' }) },
    });

    expect(with_.classes()).toContain(headerClasses.hasChildren);
  });
});

describe('<MznNavigationFooter />', () => {
  it('should gather everything but the user menu into the icons row', () => {
    const wrapper = mount(MznNavigationFooter, {
      slots: {
        default: () => [
          h(MznNavigationIconButton, {
            'aria-label': '說明',
            icon: QuestionOutlineIcon,
          }),
          h(MznNavigationIconButton, {
            'aria-label': '通知',
            icon: QuestionOutlineIcon,
          }),
        ],
      },
    });

    expect(
      wrapper.get(`.${footerClasses.icons}`).findAll('button'),
    ).toHaveLength(2);
  });
});

describe('<MznNavigationIconButton />', () => {
  it('should carry its label and its active state', () => {
    const wrapper = mount(MznNavigationIconButton, {
      props: { active: true, 'aria-label': '說明', icon: QuestionOutlineIcon },
    });

    expect(wrapper.attributes('aria-label')).toBe('說明');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.classes()).toContain(iconButtonClasses.active);
  });
});
