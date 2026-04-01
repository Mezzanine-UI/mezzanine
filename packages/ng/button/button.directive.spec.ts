import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  ButtonIconType,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { MznButton } from './button.directive';

@Component({
  standalone: true,
  imports: [MznButton],
  template: `<button
    mznButton
    [variant]="variant"
    [size]="size"
    [disabled]="disabled"
    [loading]="loading"
    [icon]="icon"
    [iconType]="iconType"
    (click)="onClick()"
    >{{ text }}</button
  >`,
})
class TestHostComponent {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading = false;
  icon?: IconDefinition;
  iconType?: ButtonIconType;
  text = '';
  onClick = jest.fn();
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getButton: () => HTMLButtonElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getButton: (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('button')!,
  };
}

describe('MznButton', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should render with host class', () => {
    const { getButton } = createFixture();

    expect(getButton().classList.contains('mzn-button')).toBe(true);
  });

  it('should render the text content', () => {
    const { getButton } = createFixture({ text: 'Hello' });

    expect(getButton().textContent).toBe('Hello');
  });

  describe('input: variant', () => {
    it('should render variant="base-primary" by default', () => {
      const { getButton } = createFixture();

      expect(getButton().classList.contains('mzn-button--base-primary')).toBe(
        true,
      );
    });

    const variants: ButtonVariant[] = [
      'base-primary',
      'base-secondary',
      'base-tertiary',
      'base-ghost',
      'base-dashed',
      'base-text-link',
      'destructive-primary',
      'destructive-secondary',
      'destructive-ghost',
      'destructive-text-link',
      'inverse',
    ];

    variants.forEach((variant) => {
      it(`should add class if variant="${variant}"`, () => {
        const { getButton } = createFixture({ variant });

        expect(getButton().classList.contains(`mzn-button--${variant}`)).toBe(
          true,
        );
      });
    });
  });

  describe('input: size', () => {
    it('should render size="main" by default', () => {
      const { getButton } = createFixture();

      expect(getButton().classList.contains('mzn-button--main')).toBe(true);
    });

    const sizes: ButtonSize[] = ['main', 'sub', 'minor'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getButton } = createFixture({ size });

        expect(getButton().classList.contains(`mzn-button--${size}`)).toBe(
          true,
        );
      });
    });
  });

  describe('host element polymorphism', () => {
    it('should render as button tag by default', () => {
      const { getButton } = createFixture();

      expect(getButton().tagName.toLowerCase()).toBe('button');
    });

    it('should render as anchor tag when applied to <a>', () => {
      @Component({
        standalone: true,
        imports: [MznButton],
        template: `<a mznButton href="/test">Link</a>`,
      })
      class AnchorHost {}

      TestBed.configureTestingModule({ imports: [AnchorHost] });
      const fixture = TestBed.createComponent(AnchorHost);
      fixture.detectChanges();
      const el: HTMLElement =
        fixture.nativeElement.querySelector('[mznButton]');

      expect(el.tagName.toLowerCase()).toBe('a');
    });
  });

  describe('input: disabled', () => {
    it('should have disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getButton } = createFixture({ disabled });
        const el = getButton();

        expect(el.classList.contains('mzn-button--disabled')).toBe(disabled);
        expect(el.getAttribute('aria-disabled')).toBe(`${disabled}`);

        if (disabled) {
          expect(el.hasAttribute('disabled')).toBe(true);
        }
      });
    });
  });

  describe('input: loading', () => {
    [false, true].forEach((loading) => {
      const message = loading
        ? 'should add class if loading=true'
        : 'should not add class if loading=false';

      it(message, () => {
        const { getButton } = createFixture({ loading });

        expect(getButton().classList.contains('mzn-button--loading')).toBe(
          loading,
        );
      });
    });
  });

  describe('input: iconType', () => {
    it('should add leading class', () => {
      const { getButton } = createFixture({
        icon: PlusIcon,
        iconType: 'leading',
      });

      expect(getButton().classList.contains('mzn-button--icon-leading')).toBe(
        true,
      );
    });

    it('should add trailing class', () => {
      const { getButton } = createFixture({
        icon: SearchIcon,
        iconType: 'trailing',
      });

      expect(getButton().classList.contains('mzn-button--icon-trailing')).toBe(
        true,
      );
    });

    it('should add icon-only class', () => {
      const { getButton } = createFixture({
        icon: PlusIcon,
        iconType: 'icon-only',
      });

      expect(getButton().classList.contains('mzn-button--icon-only')).toBe(
        true,
      );
    });
  });

  describe('click handling', () => {
    it('should fire onClick', () => {
      const onClick = jest.fn();
      const { getButton } = createFixture({ onClick });

      getButton().click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not fire onClick if disabled', () => {
      const onClick = jest.fn();
      const { getButton } = createFixture({ disabled: true, onClick });

      getButton().click();

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not fire onClick if loading', () => {
      const onClick = jest.fn();
      const { getButton } = createFixture({ loading: true, onClick });

      getButton().click();

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('combinations', () => {
    it('should work with variant + size', () => {
      const { getButton } = createFixture({
        variant: 'destructive-primary',
        size: 'minor',
        text: 'Delete',
      });
      const el = getButton();

      expect(el.classList.contains('mzn-button--destructive-primary')).toBe(
        true,
      );
      expect(el.classList.contains('mzn-button--minor')).toBe(true);
    });

    it('should work with all states', () => {
      const { getButton } = createFixture({
        disabled: true,
        icon: SearchIcon,
        iconType: 'trailing',
        size: 'sub',
        variant: 'destructive-primary',
        text: 'Complex',
      });
      const el = getButton();

      expect(el.classList.contains('mzn-button--destructive-primary')).toBe(
        true,
      );
      expect(el.classList.contains('mzn-button--sub')).toBe(true);
      expect(el.classList.contains('mzn-button--disabled')).toBe(true);
      expect(el.classList.contains('mzn-button--icon-trailing')).toBe(true);
    });
  });
});
