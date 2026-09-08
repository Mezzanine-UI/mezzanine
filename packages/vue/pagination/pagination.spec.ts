import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import {
  paginationClasses as classes,
  paginationItemClasses,
  paginationJumperClasses,
  paginationPageSizeClasses,
} from '@mezzanine-ui/core/pagination';
import { resetPortals } from '../portal/portal-registry';
import MznPaginationItem from './pagination-item.vue';
import MznPaginationJumper from './pagination-jumper.vue';
import MznPagination from './pagination.vue';
import type { PaginationProps } from './pagination.types';

const render = (props: Partial<PaginationProps> = {}, listeners = {}) =>
  mount(MznPagination, {
    attachTo: document.body,
    props: { ...props, ...listeners } as PaginationProps,
  });

const pageLabels = (wrapper: ReturnType<typeof render>): string[] =>
  wrapper
    .findAll(`.${classes.item}`)
    .map((item) => item.text().trim())
    .filter(Boolean);

describe('<MznPagination />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPortals();
  });

  it('should render a labelled nav with the page list', () => {
    const wrapper = render({ total: 30 });

    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.attributes('aria-label')).toBe('pagination navigation');
    expect(wrapper.classes()).toContain(classes.host);
    expect(pageLabels(wrapper)).toEqual(['1', '2', '3']);
  });

  it('should mark the current page', () => {
    const wrapper = render({ current: 2, total: 30 });
    const active = wrapper.findAll(`.${paginationItemClasses.active}`);

    expect(active).toHaveLength(1);
    expect(active[0].text()).toBe('2');
    expect(active[0].attributes('aria-current')).toBe('true');
  });

  it('should collapse the middle with an ellipsis', () => {
    const wrapper = render({ current: 10, total: 200 });

    expect(wrapper.findAll(`.${paginationItemClasses.ellipsis}`).length).toBe(
      2,
    );
    expect(pageLabels(wrapper)).toEqual(['1', '9', '10', '11', '20']);
  });

  it('should widen the window with siblingCount and boundaryCount', () => {
    const wrapper = render({
      boundaryCount: 2,
      current: 10,
      siblingCount: 2,
      total: 200,
    });

    expect(pageLabels(wrapper)).toEqual([
      '1',
      '2',
      '8',
      '9',
      '10',
      '11',
      '12',
      '19',
      '20',
    ]);
  });

  it('should report the page a click asks for', async () => {
    const onChange = vi.fn();
    const wrapper = render({ current: 2, total: 50 }, { onChange });
    const buttons = wrapper.findAll(`.${paginationItemClasses.button}`);

    // previous, 1, 2, 3, 4, 5, next
    await buttons[0].trigger('click');
    await buttons.at(-1)!.trigger('click');
    await buttons[1].trigger('click');

    expect(onChange.mock.calls.map(([page]) => page)).toEqual([1, 3, 1]);
  });

  it('should disable the arrows at each end', () => {
    const first = render({ current: 1, total: 50 });
    const last = render({ current: 5, total: 50 });

    expect(
      first
        .findAll(`.${paginationItemClasses.button}`)[0]
        .attributes('disabled'),
    ).toBeDefined();
    expect(
      last
        .findAll(`.${paginationItemClasses.button}`)
        .at(-1)!
        .attributes('disabled'),
    ).toBeDefined();
  });

  it('should disable every item at once', () => {
    const wrapper = render({ disabled: true, total: 50 });

    wrapper.findAll(`.${paginationItemClasses.button}`).forEach((button) => {
      expect(button.attributes('disabled')).toBeDefined();
    });
  });

  it('should print the result summary it is given', () => {
    const wrapper = render({
      current: 2,
      pageSize: 10,
      renderResultSummary: (from, to, total) => `${from}-${to} / ${total}`,
      total: 95,
    });

    expect(wrapper.get(`.${classes.resultSummary}`).text()).toBe('11-20 / 95');
  });

  it('should let itemRender replace the items', () => {
    const wrapper = render({
      itemRender: (item) => h('span', { class: 'custom' }, String(item.type)),
      total: 30,
    });

    expect(wrapper.findAll('.custom').length).toBeGreaterThan(0);
    expect(wrapper.find(`.${paginationItemClasses.button}`).exists()).toBe(
      false,
    );
  });

  describe('the jumper', () => {
    it('should stay out until showJumper', () => {
      expect(render({ total: 50 }).find(`.${classes.jumper}`).exists()).toBe(
        false,
      );
      expect(
        render({ showJumper: true, total: 50 })
          .find(`.${classes.jumper}`)
          .exists(),
      ).toBe(true);
    });

    it('should report a valid page and clear itself', async () => {
      const onChange = vi.fn();
      const wrapper = mount(MznPaginationJumper, {
        attachTo: document.body,
        props: { pageSize: 10, total: 100, onChange } as never,
      });
      const input = wrapper.get('input');

      await input.setValue('3');
      await wrapper.get('button').trigger('click');

      expect(onChange).toHaveBeenCalledWith(3);
      expect((input.element as HTMLInputElement).value).toBe('');
    });

    it('should refuse a page past the end', async () => {
      const onChange = vi.fn();
      const wrapper = mount(MznPaginationJumper, {
        attachTo: document.body,
        props: { pageSize: 10, total: 100, onChange } as never,
      });

      await wrapper.get('input').setValue('11');
      await wrapper.get('button').trigger('click');

      expect(onChange).not.toHaveBeenCalled();
      expect(
        wrapper
          .get(`.${paginationJumperClasses.host}`)
          .find('.mzn-text-field--error')
          .exists(),
      ).toBe(true);
    });

    it('should submit on Enter', async () => {
      const onChange = vi.fn();
      const wrapper = mount(MznPaginationJumper, {
        attachTo: document.body,
        props: { pageSize: 10, total: 100, onChange } as never,
      });

      await wrapper.get('input').setValue('4');
      await wrapper.get('input').trigger('keydown', { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(4);
    });
  });

  describe('the page size selector', () => {
    it('should stay out until showPageSizeOptions', () => {
      expect(render({ total: 50 }).find(`.${classes.pageSize}`).exists()).toBe(
        false,
      );
      expect(
        render({ showPageSizeOptions: true, total: 50 })
          .find(`.${classes.pageSize}`)
          .exists(),
      ).toBe(true);
    });

    it('should show the label and the current size', async () => {
      const wrapper = render({
        pageSize: 20,
        pageSizeLabel: '每頁顯示：',
        showPageSizeOptions: true,
        total: 50,
      });

      await nextTick();

      expect(wrapper.get(`.${classes.pageSize}`).text()).toContain(
        '每頁顯示：',
      );
      expect(
        wrapper
          .get(`.${paginationPageSizeClasses.host} input`)
          .attributes('value') ??
          (
            wrapper.get(`.${paginationPageSizeClasses.host} input`)
              .element as HTMLInputElement
          ).value,
      ).toBe('20');
    });
  });
});

describe('<MznPaginationItem />', () => {
  it('should render a page button', () => {
    const wrapper = mount(MznPaginationItem, { props: { page: 7 } });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.text()).toBe('7');
    expect(wrapper.classes()).toContain(paginationItemClasses.button);
  });

  it('should render an ellipsis as a plain div', () => {
    const wrapper = mount(MznPaginationItem, { props: { type: 'ellipsis' } });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain(paginationItemClasses.ellipsis);
    expect(wrapper.find('.mzn-icon').exists()).toBe(true);
  });

  it('should render an arrow for previous and next', () => {
    expect(
      mount(MznPaginationItem, { props: { type: 'previous' } })
        .get('.mzn-icon')
        .attributes('data-icon-name'),
    ).toBe('chevron-left');
    expect(
      mount(MznPaginationItem, { props: { type: 'next' } })
        .get('.mzn-icon')
        .attributes('data-icon-name'),
    ).toBe('chevron-right');
  });
});
