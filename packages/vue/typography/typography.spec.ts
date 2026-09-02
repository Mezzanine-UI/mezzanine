import { mount } from '@vue/test-utils';
import {
  toTypographyCssVars,
  typographyClasses,
} from '@mezzanine-ui/core/typography';
import MznTypography from './typography.vue';
import type { TypographyProps } from './typography.types';

describe('MznTypography', () => {
  describe('variant to tag mapping', () => {
    it.each([
      ['h1', 'H1'],
      ['h2', 'H2'],
      ['h3', 'H3'],
      ['body', 'P'],
      ['body-mono', 'P'],
      ['text-link-body', 'P'],
      ['text-link-caption', 'SPAN'],
      ['caption', 'SPAN'],
      ['label-primary', 'SPAN'],
    ] as const)('variant=%s renders <%s>', (variant, tagName) => {
      const wrapper = mount(MznTypography, { props: { variant } });

      expect(wrapper.element.tagName).toBe(tagName);
    });

    it('should default to the body variant', () => {
      const wrapper = mount(MznTypography);

      expect(wrapper.element.tagName).toBe('P');
      expect(wrapper.classes()).toContain(typographyClasses.type('body'));
    });
  });

  describe('modifier classes', () => {
    const modifierCases: [string, TypographyProps, string][] = [
      ['align', { align: 'center' }, typographyClasses.align],
      ['color', { color: 'text-error' }, typographyClasses.color],
      ['display', { display: 'block' }, typographyClasses.display],
      ['ellipsis', { ellipsis: true }, typographyClasses.ellipsis],
      ['noWrap', { noWrap: true }, typographyClasses.noWrap],
    ];

    it.each(modifierCases)('applies the %s class', (_name, props, expected) => {
      const wrapper = mount(MznTypography, { props });

      expect(wrapper.classes()).toContain(expected);
    });
  });

  it('should expose the palette colour as a css variable', () => {
    const wrapper = mount(MznTypography, { props: { color: 'text-error' } });
    // `toTypographyCssVars` always returns every key, leaving the unset ones
    // `undefined`; both React and Vue drop undefined style values, so only the
    // defined entries reach the attribute.
    const defined = Object.entries(
      toTypographyCssVars({ color: 'text-error' }),
    ).filter(([, value]) => value !== undefined);

    expect(defined).not.toHaveLength(0);

    for (const [name, value] of defined) {
      expect(wrapper.attributes('style')).toContain(`${name}: ${value}`);
    }
  });

  describe('prop: ellipsis', () => {
    it('should mirror plain text children into the title attribute', () => {
      const wrapper = mount(MznTypography, {
        props: { ellipsis: true },
        slots: { default: 'a truncated line' },
      });

      expect(wrapper.attributes('title')).toBe('a truncated line');
    });

    it('should not set title when ellipsis is off', () => {
      const wrapper = mount(MznTypography, {
        slots: { default: 'a truncated line' },
      });

      expect(wrapper.attributes('title')).toBeUndefined();
    });

    it('should not set title when the children are not plain text', () => {
      const wrapper = mount(MznTypography, {
        props: { ellipsis: true },
        slots: { default: '<b>rich</b> content' },
      });

      expect(wrapper.attributes('title')).toBeUndefined();
    });
  });
});
