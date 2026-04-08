import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PlusIcon } from '@mezzanine-ui/icons';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MznIcon } from './icon.component';
import { IconColor } from '@mezzanine-ui/core/icon';

@Component({
  standalone: true,
  imports: [MznIcon],
  template: `<i
    mznIcon
    [icon]="icon"
    [clickable]="clickable"
    [color]="color"
    [size]="size"
    [spin]="spin"
    [title]="title"
  ></i>`,
})
class TestHostComponent {
  icon: IconDefinition = PlusIcon;
  clickable = false;
  color?: IconColor;
  size?: number;
  spin = false;
  title?: string;
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getIconElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getIconElement: (): HTMLElement =>
      fixture.nativeElement.querySelector('i[mznIcon]')!,
  };
}

describe('MznIcon', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should render with host class', () => {
    const { getIconElement } = createFixture();

    expect(getIconElement().classList.contains('mzn-icon')).toBe(true);
  });

  it('should set data-icon-name to name of icon', () => {
    const { getIconElement } = createFixture();

    expect(getIconElement().getAttribute('data-icon-name')).toBe(PlusIcon.name);
  });

  it('should set focusable of svg to false', () => {
    const { getIconElement } = createFixture();
    const svg = getIconElement().querySelector('svg');

    expect(svg?.getAttribute('focusable')).toBe('false');
  });

  describe('input: size', () => {
    it('should apply size class when size is given', () => {
      const { getIconElement } = createFixture({ size: 36 });

      expect(getIconElement().classList.contains('mzn-icon--size')).toBe(true);
    });

    it('should set --mzn-icon-size CSS variable when size is given', () => {
      const { getIconElement } = createFixture({ size: 36 });

      expect(getIconElement().style.getPropertyValue('--mzn-icon-size')).toBe(
        '36px',
      );
    });
  });

  describe('input: color', () => {
    const colorMaps: ([IconColor, string] | IconColor | undefined)[] = [
      undefined,
      'inherit',
      ['neutral', 'icon-neutral'],
      ['neutral-strong', 'icon-neutral-strong'],
      ['brand', 'icon-brand'],
      ['brand-strong', 'icon-brand-strong'],
      ['error', 'icon-error'],
      ['error-strong', 'icon-error-strong'],
      ['warning', 'icon-warning'],
      ['warning-strong', 'icon-warning-strong'],
      ['success', 'icon-success'],
      ['success-strong', 'icon-success-strong'],
      ['info', 'icon-info'],
      ['info-strong', 'icon-info-strong'],
    ];

    colorMaps.forEach((colorMap) => {
      let color: IconColor | undefined;

      if (Array.isArray(colorMap)) {
        color = colorMap[0];
      } else {
        color = colorMap;
      }

      const message = color
        ? `should add color class if color="${color}"`
        : 'should not add color class if color=undefined';

      it(message, () => {
        const { getIconElement } = createFixture({ color });
        const el = getIconElement();

        expect(el.classList.contains('mzn-icon--color')).toBe(!!color);

        if (color === 'inherit') {
          expect(el.style.getPropertyValue('--mzn-icon-color')).toBe('inherit');
        } else if (color) {
          expect(el.style.getPropertyValue('--mzn-icon-color')).toBeTruthy();
        }
      });
    });
  });

  describe('input: clickable', () => {
    it('should not set --mzn-icon-cursor when clickable is false', () => {
      const { getIconElement } = createFixture({ clickable: false });

      expect(getIconElement().style.getPropertyValue('--mzn-icon-cursor')).toBe(
        '',
      );
    });

    it('should set --mzn-icon-cursor to pointer when clickable is true', () => {
      const { getIconElement } = createFixture({ clickable: true });

      expect(getIconElement().style.getPropertyValue('--mzn-icon-cursor')).toBe(
        'pointer',
      );
    });
  });

  describe('input: spin', () => {
    [false, true].forEach((spin) => {
      const message = spin
        ? 'should add spin class if spin=true'
        : 'should not add spin class if spin=false';

      it(message, () => {
        const { getIconElement } = createFixture({ spin });

        expect(getIconElement().classList.contains('mzn-icon--spin')).toBe(
          spin,
        );
      });
    });
  });

  describe('svg structure', () => {
    it('should render svg with viewBox from icon definition', () => {
      const { getIconElement } = createFixture();
      const svg = getIconElement().querySelector('svg');

      expect(svg?.getAttribute('viewBox')).toBe(
        PlusIcon.definition.svg?.viewBox,
      );
    });

    it('should render path with d attribute from icon definition', () => {
      const { getIconElement } = createFixture();
      const path = getIconElement().querySelector('path');

      expect(path?.getAttribute('d')).toBe(PlusIcon.definition.path?.d);
    });
  });

  describe('input: title', () => {
    it('should render title when title input is given', () => {
      const { getIconElement } = createFixture({ title: 'foo' });
      const titleEl = getIconElement().querySelector('title');

      expect(titleEl?.textContent).toBe('foo');
    });

    it('should render definition.title when given', () => {
      const customIcon: IconDefinition = {
        ...PlusIcon,
        definition: {
          ...PlusIcon.definition,
          title: 'bar',
        },
      };
      const { getIconElement } = createFixture({ icon: customIcon });
      const titleEl = getIconElement().querySelector('title');

      expect(titleEl?.textContent).toBe('bar');
    });
  });
});
