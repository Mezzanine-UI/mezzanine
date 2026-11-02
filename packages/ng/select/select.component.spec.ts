import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznSelect } from './select.component';

const MOCK_OPTIONS: DropdownOption[] = [
  { id: 'apple', name: 'Apple' },
  { id: 'banana', name: 'Banana' },
  { id: 'cherry', name: 'Cherry' },
];

@Component({
  standalone: true,
  imports: [MznSelect, FormsModule],
  template: `
    <div
      mznSelect
      [options]="options"
      [(ngModel)]="selected"
      [flip]="flip"
      placeholder="Choose"
    ></div>
  `,
})
class TestHostComponent {
  options = MOCK_OPTIONS;
  selected = '';
  flip = false;
}

function createFixture<T>(
  component: new () => T,
  overrides: Partial<T> = {},
): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  // Applied before the first pass: mutating a host input afterwards trips
  // NG0100 because the change lands between the check and verify passes.
  Object.assign(fixture.componentInstance as object, overrides);
  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznSelect', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHostComponent],
    });
  });

  it('should render the trigger', () => {
    const { fixture } = createFixture(TestHostComponent);
    const trigger = fixture.nativeElement.querySelector('.mzn-select-trigger');

    expect(trigger).toBeTruthy();
  });

  it('should show placeholder when no value', () => {
    const { fixture } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector(
      '.mzn-select-trigger__input',
    ) as HTMLInputElement;

    expect(input.getAttribute('placeholder')).toBe('Choose');
  });

  it('should open dropdown on click', () => {
    const { fixture } = createFixture(TestHostComponent);
    const trigger = fixture.nativeElement.querySelector('.mzn-select-trigger');

    trigger.click();
    fixture.detectChanges();
    fixture.detectChanges();

    const listbox = document.querySelector<HTMLElement>('[role="listbox"]');

    expect(listbox).toBeTruthy();
  });

  it('should render options in dropdown', () => {
    const { fixture } = createFixture(TestHostComponent);
    const trigger = fixture.nativeElement.querySelector('.mzn-select-trigger');

    trigger.click();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = document.querySelectorAll<HTMLElement>('[role="option"]');

    expect(items.length).toBe(3);
  });

  it('should open dropdown when flip is enabled', () => {
    const { fixture } = createFixture(TestHostComponent, { flip: true });

    const trigger = fixture.nativeElement.querySelector('.mzn-select-trigger');

    trigger.click();
    fixture.detectChanges();
    fixture.detectChanges();

    const listbox = document.querySelector<HTMLElement>('[role="listbox"]');

    expect(listbox).toBeTruthy();
  });

  it('should select option and close', async () => {
    const { fixture, host } = createFixture(TestHostComponent);

    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('.mzn-select-trigger');

    trigger.click();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = document.querySelectorAll<HTMLElement>('[role="option"]');

    items[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.selected).toBe('banana');
  });

  it('should display selected option name', async () => {
    const { fixture, host } = createFixture(TestHostComponent);

    await fixture.whenStable();

    host.selected = 'apple';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      '.mzn-select-trigger__input',
    ) as HTMLInputElement;

    expect(input.value).toBe('Apple');
  });

  describe('combobox ARIA (#506)', () => {
    @Component({
      standalone: true,
      imports: [MznSelect],
      template: `
        <div mznSelect aria-label="Pick a fruit" [options]="options"></div>
      `,
    })
    class AriaHostComponent {
      options = MOCK_OPTIONS;
    }

    const getInput = (root: HTMLElement): HTMLInputElement =>
      root.querySelector('.mzn-select-trigger__input') as HTMLInputElement;

    it('should expose aria-expanded / aria-controls on the input', () => {
      const { fixture } = createFixture(TestHostComponent);
      const root = fixture.nativeElement as HTMLElement;
      const input = getInput(root);

      expect(input.getAttribute('role')).toBe('combobox');
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(input.getAttribute('aria-controls')).toBeTruthy();

      (root.querySelector('.mzn-select-trigger') as HTMLElement).click();
      fixture.detectChanges();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe('true');
    });

    it('should keep only one combobox', () => {
      const { fixture } = createFixture(TestHostComponent);
      const root = fixture.nativeElement as HTMLElement;

      expect(root.querySelectorAll('[role="combobox"]')).toHaveLength(1);
      expect(
        root.querySelector('.mzn-select-trigger')?.getAttribute('role'),
      ).toBe('presentation');
    });

    it('should forward Select-level aria-label to the input', () => {
      TestBed.configureTestingModule({ imports: [AriaHostComponent] });

      const { fixture } = createFixture(AriaHostComponent);
      const root = fixture.nativeElement as HTMLElement;

      expect(getInput(root).getAttribute('aria-label')).toBe('Pick a fruit');
      expect(
        root.querySelector('[mznSelect]')?.hasAttribute('aria-label'),
      ).toBe(false);
    });
  });
});
