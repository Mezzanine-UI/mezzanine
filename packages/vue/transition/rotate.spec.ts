import { mount } from '@vue/test-utils';
import { h } from 'vue';
import MznRotate from './rotate.vue';

const renderRotate = (props: Record<string, unknown> = {}, style?: unknown) =>
  mount(MznRotate, {
    attachTo: document.body,
    props,
    slots: { default: () => h('i', { id: 'child', style }) },
  });

const child = () => document.getElementById('child');

describe('MznRotate', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render the child unrotated by default', () => {
    renderRotate();

    expect(child()?.style.transform).toBe('rotate(0deg)');
    expect(child()?.style.transformOrigin).toBe('center');
    expect(child()?.style.transition).toContain('transform');
  });

  it('should rotate by the given degrees when in', async () => {
    const wrapper = renderRotate({ degrees: 90 });

    await wrapper.setProps({ in: true });

    expect(child()?.style.transform).toBe('rotate(90deg)');
  });

  it('should not wrap the child in an element of its own', () => {
    const wrapper = renderRotate();

    expect(wrapper.element.tagName.toLowerCase()).toBe('i');
  });

  it('should let the child keep its own style', () => {
    renderRotate({}, { transformOrigin: 'top' });

    expect(child()?.style.transformOrigin).toBe('top');
  });
});
