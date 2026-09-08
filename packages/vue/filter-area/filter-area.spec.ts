import { mount } from '@vue/test-utils';
import { h } from 'vue';
import {
  filterAreaClasses as classes,
  filterAreaPrefix,
} from '@mezzanine-ui/core/filter-area';
import MznFormField from '../form/form-field.vue';
import MznInput from '../input/input.vue';
import MznFilterArea from './filter-area.vue';
import MznFilterLine from './filter-line.vue';
import MznFilter from './filter.vue';
import type { FilterAreaProps } from './filter-area.types';

const line = (name: string) =>
  h(MznFilterLine, null, () =>
    h(MznFilter, null, () =>
      h(MznFormField, { label: 'Label', name }, () => h(MznInput)),
    ),
  );

const render = (props: FilterAreaProps = {}, lines = 1) =>
  mount(MznFilterArea, {
    props,
    slots: {
      default: () =>
        Array.from({ length: lines }, (_, index) => line(`field-${index}`)),
    },
  });

describe('<MznFilterArea />', () => {
  it('should render the host with its size', () => {
    const wrapper = render({ size: 'sub' });

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.classes()).toContain(classes.size('sub'));
  });

  it('should put the only line and the actions in one row', () => {
    const wrapper = render();

    const rows = wrapper.findAll(`.${classes.row}`);

    expect(rows).toHaveLength(1);
    expect(rows[0].classes()).toContain(classes.rowAlign('center'));
    expect(rows[0].find(`.${classes.line}`).exists()).toBe(true);
    expect(rows[0].find(`.${classes.actions}`).exists()).toBe(true);
  });

  it('should render nothing but the host when there are no lines', () => {
    const wrapper = mount(MznFilterArea);

    expect(wrapper.find(`.${classes.row}`).exists()).toBe(false);
  });

  it('should offer no toggle while there is a single line', () => {
    const wrapper = render();

    expect(wrapper.findAll('button')).toHaveLength(2);
  });

  it('should show only the first line until it is expanded', async () => {
    const wrapper = render({}, 3);

    expect(wrapper.findAll(`.${classes.line}`)).toHaveLength(1);

    const toggle = wrapper.findAll('button')[2];

    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(toggle.attributes('aria-label')).toBe('Expand filters');
    expect(toggle.attributes('title')).toBe('Expand filters');

    await toggle.trigger('click');

    expect(wrapper.findAll(`.${classes.line}`)).toHaveLength(3);
    expect(wrapper.get(`.${classes.actions}`).classes()).toContain(
      classes.actionsExpanded,
    );
    expect(wrapper.findAll('button')[2].attributes('aria-label')).toBe(
      'Collapse filters',
    );
  });

  it('should move the actions into a row of their own once expanded', async () => {
    const wrapper = render({}, 2);

    await wrapper.findAll('button')[2].trigger('click');

    const row = wrapper.get(`.${classes.row}`);

    expect(row.find(`.${classes.line}`).exists()).toBe(false);
    expect(row.find(`.${classes.actions}`).exists()).toBe(true);
  });

  it('should align the actions and the row as asked', () => {
    const wrapper = render({ actionsAlign: 'start', rowAlign: 'end' });

    expect(wrapper.get(`.${classes.actions}`).classes()).toContain(
      classes.actionsAlign('start'),
    );
    expect(wrapper.get(`.${classes.row}`).classes()).toContain(
      classes.rowAlign('end'),
    );
  });

  it('should label the buttons and give them their types', () => {
    const wrapper = render({
      resetButtonType: 'reset',
      resetText: '重設',
      submitButtonType: 'submit',
      submitText: '搜尋',
    });

    const [submit, reset] = wrapper.findAll('button');

    expect(submit.text()).toBe('搜尋');
    expect(submit.attributes('type')).toBe('submit');
    expect(reset.text()).toBe('重設');
    expect(reset.attributes('type')).toBe('reset');
  });

  it('should emit submit and reset', async () => {
    const wrapper = render();
    const [submit, reset] = wrapper.findAll('button');

    await submit.trigger('click');
    await reset.trigger('click');

    expect(wrapper.emitted('submit')).toHaveLength(1);
    expect(wrapper.emitted('reset')).toHaveLength(1);
  });

  it('should disable the reset button while the form is untouched', () => {
    const wrapper = render({ isDirty: false });

    expect(wrapper.findAll('button')[1].attributes('disabled')).toBeDefined();
  });
});

describe('<MznFilter />', () => {
  it('should take its span through a custom property', () => {
    const wrapper = mount(MznFilter, { props: { span: 4 } });

    expect(
      wrapper.element.style.getPropertyValue(
        `--${filterAreaPrefix}-filter-span`,
      ),
    ).toBe('4');
  });

  it('should drop the span once it grows', () => {
    const wrapper = mount(MznFilter, { props: { grow: true, span: 4 } });

    expect(wrapper.classes()).toContain(classes.filterGrow);
    expect(
      wrapper.element.style.getPropertyValue(
        `--${filterAreaPrefix}-filter-span`,
      ),
    ).toBe('');
  });

  it('should align itself and take a numeric minWidth as pixels', () => {
    const wrapper = mount(MznFilter, {
      props: { align: 'center', minWidth: 160 },
    });

    expect(wrapper.classes()).toContain(classes.filterAlign('center'));
    expect(wrapper.element.style.minWidth).toBe('160px');
  });

  it('should pass a string minWidth through untouched', () => {
    const wrapper = mount(MznFilter, { props: { minWidth: '50%' } });

    expect(wrapper.element.style.minWidth).toBe('50%');
  });

  it('should fill the area size in on inputs that did not ask for one', () => {
    const wrapper = mount(MznFilterArea, {
      props: { size: 'sub' },
      slots: {
        default: () =>
          h(MznFilterLine, null, () =>
            h(MznFilter, null, () =>
              h(MznFormField, { label: 'Label', name: 'name' }, () => [
                h(MznInput),
                h(MznInput, { size: 'main' }),
              ]),
            ),
          ),
      },
    });

    const inputs = wrapper.findAllComponents(MznInput);

    expect(inputs[0].props('size')).toBe('sub');
    // The one that asked for a size of its own keeps it.
    expect(inputs[1].props('size')).toBe('main');
  });
});

describe('<MznFilterLine />', () => {
  it('should render its children in a line', () => {
    const wrapper = mount(MznFilterLine, {
      slots: { default: () => h(MznFilter) },
    });

    expect(wrapper.classes()).toContain(classes.line);
    expect(wrapper.find(`.${classes.filter}`).exists()).toBe(true);
  });
});
