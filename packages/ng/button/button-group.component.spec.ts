import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  ButtonGroupOrientation,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { MznButton } from './button.directive';
import { MznButtonGroup } from './button-group.component';

@Component({
  standalone: true,
  imports: [MznButton, MznButtonGroup],
  template: `
    <mzn-button-group
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [fullWidth]="fullWidth"
      [orientation]="orientation"
    >
      <button mznButton>Button 1</button>
      <button mznButton>Button 2</button>
      <button mznButton>Button 3</button>
    </mzn-button-group>
  `,
})
class TestHostComponent {
  variant: ButtonVariant = 'base-primary';
  size: ButtonSize = 'main';
  disabled = false;
  fullWidth = false;
  orientation: ButtonGroupOrientation = 'horizontal';
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getGroup: () => HTMLElement;
  getButtons: () => NodeListOf<HTMLButtonElement>;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getGroup: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-button-group')!,
    getButtons: (): NodeListOf<HTMLButtonElement> =>
      fixture.nativeElement.querySelectorAll('[mznButton]'),
  };
}

describe('MznButtonGroup', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should render with host class', () => {
    const { getGroup } = createFixture();

    expect(getGroup().classList.contains('mzn-button-group')).toBe(true);
  });

  it('should wrap buttons', () => {
    const { getButtons } = createFixture();

    expect(getButtons().length).toBe(3);

    getButtons().forEach((btn) => {
      expect(btn.tagName.toLowerCase()).toBe('button');
    });
  });

  describe('input: variant', () => {
    it('should pass variant to child buttons via DI', () => {
      const { getButtons } = createFixture({
        variant: 'destructive-primary',
      });

      getButtons().forEach((btn) => {
        expect(btn.classList.contains('mzn-button--destructive-primary')).toBe(
          true,
        );
      });
    });

    it('should allow child to override variant', () => {
      @Component({
        standalone: true,
        imports: [MznButton, MznButtonGroup],
        template: `
          <mzn-button-group variant="base-primary">
            <button mznButton variant="destructive-primary">Override</button>
          </mzn-button-group>
        `,
      })
      class OverrideHost {}

      TestBed.configureTestingModule({ imports: [OverrideHost] });
      const fixture = TestBed.createComponent(OverrideHost);
      fixture.detectChanges();
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector('[mznButton]');

      expect(btn.classList.contains('mzn-button--destructive-primary')).toBe(
        true,
      );
    });
  });

  describe('input: size', () => {
    const sizes: ButtonSize[] = ['main', 'sub', 'minor'];

    sizes.forEach((size) => {
      it(`should pass size="${size}" to child buttons via DI`, () => {
        const { getButtons } = createFixture({ size });

        getButtons().forEach((btn) => {
          expect(btn.classList.contains(`mzn-button--${size}`)).toBe(true);
        });
      });
    });
  });

  describe('input: disabled', () => {
    it('should pass disabled to child buttons via DI', () => {
      const { getButtons } = createFixture({ disabled: true });

      getButtons().forEach((btn) => {
        expect(btn.classList.contains('mzn-button--disabled')).toBe(true);
        expect(btn.getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('should allow child to override disabled', () => {
      @Component({
        standalone: true,
        imports: [MznButton, MznButtonGroup],
        template: `
          <mzn-button-group [disabled]="true">
            <button mznButton [disabled]="false">Not Disabled</button>
          </mzn-button-group>
        `,
      })
      class DisabledOverrideHost {}

      TestBed.configureTestingModule({ imports: [DisabledOverrideHost] });
      const fixture = TestBed.createComponent(DisabledOverrideHost);
      fixture.detectChanges();
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector('[mznButton]');

      expect(btn.classList.contains('mzn-button--disabled')).toBe(false);
      expect(btn.getAttribute('aria-disabled')).toBe('false');
    });
  });

  describe('input: fullWidth', () => {
    [false, true].forEach((fullWidth) => {
      it(`should ${fullWidth ? 'add' : 'not add'} fullWidth class`, () => {
        const { getGroup } = createFixture({ fullWidth });

        expect(
          getGroup().classList.contains('mzn-button-group--full-width'),
        ).toBe(fullWidth);
      });
    });
  });

  describe('input: orientation', () => {
    const orientations: ButtonGroupOrientation[] = ['horizontal', 'vertical'];

    orientations.forEach((orientation) => {
      it(`should add class and aria-orientation for ${orientation}`, () => {
        const { getGroup } = createFixture({ orientation });
        const el = getGroup();

        expect(el.getAttribute('aria-orientation')).toBe(orientation);
        expect(el.classList.contains(`mzn-button-group--${orientation}`)).toBe(
          true,
        );
      });
    });
  });

  describe('role', () => {
    it('should render role="group" by default', () => {
      const { getGroup } = createFixture();

      expect(getGroup().getAttribute('role')).toBe('group');
    });
  });

  describe('combinations', () => {
    it('should work with all props together', () => {
      const { getGroup } = createFixture({
        variant: 'inverse',
        size: 'sub',
        disabled: true,
        fullWidth: true,
        orientation: 'vertical',
      });
      const el = getGroup();

      expect(el.classList.contains('mzn-button-group')).toBe(true);
      expect(el.classList.contains('mzn-button-group--full-width')).toBe(true);
      expect(el.classList.contains('mzn-button-group--vertical')).toBe(true);
      expect(el.getAttribute('aria-orientation')).toBe('vertical');
      expect(el.getAttribute('role')).toBe('group');
    });
  });
});
