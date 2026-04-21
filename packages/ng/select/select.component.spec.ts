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
    <mzn-select
      [options]="options"
      [(ngModel)]="selected"
      placeholder="Choose"
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
    );

    expect(input.textContent.trim()).toBe('Choose');
  });

  it('should open dropdown on click', () => {
    const { fixture } = createFixture(TestHostComponent);
    const trigger = fixture.nativeElement.querySelector('.mzn-select-trigger');

    trigger.click();
    fixture.detectChanges();
    fixture.detectChanges();

    const listbox = fixture.nativeElement.querySelector('[role="listbox"]');

    expect(listbox).toBeTruthy();
  });

  it('should render options in dropdown', () => {
    const { fixture } = createFixture(TestHostComponent);
    const trigger = fixture.nativeElement.querySelector('.mzn-select-trigger');

    trigger.click();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[role="option"]');

    expect(items.length).toBe(3);
  });

  it('should select option and close', async () => {
    const { fixture, host } = createFixture(TestHostComponent);

    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector('.mzn-select-trigger');

    trigger.click();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[role="option"]');

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
    );

    expect(input.textContent.trim()).toBe('Apple');
  });
});
