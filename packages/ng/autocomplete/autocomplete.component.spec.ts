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

@Component({
  standalone: true,
  imports: [MznAutocomplete, FormsModule],
  template: `
    <mzn-autocomplete
      [options]="options"
      [(ngModel)]="selected"
      placeholder="Search fruits"
    />
  `,
})
class TestHostComponent {
  options = MOCK_OPTIONS;
  selected = '';
}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

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

    const listbox = fixture.nativeElement.querySelector('[role="listbox"]');

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

    const items = fixture.nativeElement.querySelectorAll('[role="option"]');

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

    const items = fixture.nativeElement.querySelectorAll('[role="option"]');

    items[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.selected).toBe('apple');
  });
});
