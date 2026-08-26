import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznAutocomplete } from './autocomplete.component';

const MOCK_OPTIONS: DropdownOption[] = [
  { id: 'apple', name: 'Apple' },
  { id: 'banana', name: 'Banana' },
  { id: 'cherry', name: 'Cherry' },
];

const CASE_SENSITIVE_OPTIONS: DropdownOption[] = [
  { id: 'colorado', name: 'Colorado' },
  { id: 'virginia', name: 'Virginia' },
];

@Component({
  standalone: true,
  imports: [MznAutocomplete, FormsModule],
  template: `
    <div
      mznAutocomplete
      [options]="options"
      [(ngModel)]="selected"
      placeholder="Search fruits"
    ></div>
  `,
})
class TestHostComponent {
  options = MOCK_OPTIONS;
  selected = '';
}

@Component({
  standalone: true,
  imports: [MznAutocomplete, FormsModule],
  template: `
    <div
      mznAutocomplete
      [caseSensitive]="caseSensitive"
      [options]="options"
      [(ngModel)]="selected"
      placeholder="Search states"
    ></div>
  `,
})
class CaseSensitiveFilterHostComponent {
  options = CASE_SENSITIVE_OPTIONS;
  selected = '';
  caseSensitive = false;
}

@Component({
  standalone: true,
  imports: [MznAutocomplete, FormsModule],
  template: `
    <div
      mznAutocomplete
      [addable]="true"
      [caseSensitive]="caseSensitive"
      [onInsert]="onInsert"
      [options]="options"
      [(ngModel)]="selected"
      placeholder="Search states"
    ></div>
  `,
})
class CaseSensitiveCreateHostComponent {
  options: DropdownOption[] = [{ id: 'virginia', name: 'Virginia' }];
  selected = '';
  caseSensitive = false;

  readonly onInsert = (
    text: string,
    currentOptions: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> => [
    ...currentOptions,
    { id: text.toLowerCase(), name: text },
  ];
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

describe('MznAutocomplete', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHostComponent],
    });
  });

  it('should render the trigger with input', () => {
    const { fixture } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector('input');

    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Search fruits');
  });

  it('should open dropdown on input focus', () => {
    const { fixture } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector('input');

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    fixture.detectChanges();

    const listbox = document.querySelector('[role="listbox"]');

    expect(listbox).toBeTruthy();
  });

  it('should filter options on input', () => {
    const { fixture } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    // Open and type
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    input.value = 'ban';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.detectChanges();

    const items = document.querySelectorAll('[role="option"]');

    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Banana');
  });

  it('should select option and close', async () => {
    const { fixture, host } = createFixture(TestHostComponent);

    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input');

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    fixture.detectChanges();

    const items = document.querySelectorAll<HTMLElement>('[role="option"]');

    items[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.selected).toBe('apple');
  });

  describe('caseSensitive', () => {
    it('should match case-insensitively by default ("vir" -> Virginia)', () => {
      const { fixture } = createFixture(CaseSensitiveFilterHostComponent);
      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      input.value = 'vir';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.detectChanges();

      const items = document.querySelectorAll('[role="option"]');

      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('Virginia');
    });

    it('should not match "vir" when caseSensitive is true', () => {
      const { fixture } = createFixture(CaseSensitiveFilterHostComponent, {
        caseSensitive: true,
      });

      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      input.value = 'vir';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.detectChanges();

      const items = document.querySelectorAll('[role="option"]');

      expect(items.length).toBe(0);
    });

    it('should match "Vir" when caseSensitive is true', () => {
      const { fixture } = createFixture(CaseSensitiveFilterHostComponent, {
        caseSensitive: true,
      });

      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      input.value = 'Vir';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.detectChanges();

      const items = document.querySelectorAll('[role="option"]');

      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('Virginia');
    });

    it('should hide the create action for an option already visible in the list (case-insensitive default)', () => {
      const { fixture } = createFixture(CaseSensitiveCreateHostComponent);
      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      input.value = 'virginia';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.detectChanges();

      const buttons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('button'),
      );
      const createButton = buttons.find(
        (button) => button.textContent?.trim() === '建立 "virginia"',
      );

      expect(createButton).toBeUndefined();
    });

    it('should offer to create a differently-cased duplicate when caseSensitive is true', () => {
      const { fixture } = createFixture(CaseSensitiveCreateHostComponent, {
        caseSensitive: true,
      });

      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      input.value = 'virginia';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.detectChanges();

      const buttons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('button'),
      );
      const createButton = buttons.find(
        (button) => button.textContent?.trim() === '建立 "virginia"',
      );

      expect(createButton).toBeTruthy();
    });
  });

  it('should not select when Enter is pressed during IME composition', () => {
    const { fixture, host } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    fixture.detectChanges();

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });

    Object.defineProperty(enterEvent, 'isComposing', { value: true });
    Object.defineProperty(enterEvent, 'keyCode', { value: 229 });

    input.dispatchEvent(enterEvent);
    fixture.detectChanges();

    expect(host.selected).toBe('');
  });
});
