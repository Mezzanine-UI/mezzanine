import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PlusIcon } from '@mezzanine-ui/icons';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MznIcon } from './icon.component';
import { IconColor } from '@mezzanine-ui/core/icon';

@Component({
  standalone: true,
  imports: [MznIcon],
  template: `<mzn-icon
    [icon]="icon"
    [color]="color"
    [size]="size"
    [spin]="spin"
    [title]="title"
  />`,
})
class TestHostComponent {
  icon: IconDefinition = PlusIcon;
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
      fixture.nativeElement.querySelector('mzn-icon')!,
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

        expect(getIconElement().classList.contains('mzn-icon--color')).toBe(
          !!color,
        );
      });
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
