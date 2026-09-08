import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { selectionCardClasses as classes } from '@mezzanine-ui/core/selection-card';
import MznSelectionCardGroup from './selection-card-group.vue';
import MznSelectionCard from './selection-card.vue';
import type { SelectionCardSelection } from './selection-card-group.types';

const selections: SelectionCardSelection[] = [
  {
    name: 'plan',
    selector: 'radio',
    supportingText: '適合個人使用',
    text: '基本方案',
    value: 'basic',
  },
  {
    name: 'plan',
    selector: 'radio',
    supportingText: '適合小型團隊',
    text: '專業方案',
    value: 'professional',
  },
];

const card = (text: string) =>
  h(MznSelectionCard, {
    selector: 'radio',
    supportingText: 'Supporting',
    text,
  });

describe('<MznSelectionCardGroup />', () => {
  it('should render an empty group', () => {
    const wrapper = mount(MznSelectionCardGroup);

    expect(wrapper.classes()).toContain(classes.group);
    expect(wrapper.findAll(`.${classes.host}`)).toHaveLength(0);
  });

  it('should render the selections it is given', () => {
    const wrapper = mount(MznSelectionCardGroup, { props: { selections } });

    expect(
      wrapper.findAll(`.${classes.text}`).map((text) => text.text()),
    ).toEqual(['基本方案', '專業方案']);
  });

  it('should let the slot win over the selections', () => {
    const wrapper = mount(MznSelectionCardGroup, {
      props: { selections },
      slots: { default: () => [card('A方案'), card('B方案')] },
    });

    expect(
      wrapper.findAll(`.${classes.text}`).map((text) => text.text()),
    ).toEqual(['A方案', 'B方案']);
  });

  it('should hand a selection its change handler', async () => {
    const onChange = vi.fn();
    const wrapper = mount(MznSelectionCardGroup, {
      props: { selections: [{ ...selections[0], onChange }] },
    });

    await wrapper.get('input').trigger('change');

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
