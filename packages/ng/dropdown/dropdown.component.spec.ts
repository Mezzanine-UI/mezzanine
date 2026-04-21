import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznDropdown } from './dropdown.component';

const MOCK_OPTIONS: DropdownOption[] = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
];

@Component({
  standalone: true,
  imports: [MznDropdown],
  template: `
    <button #anchor>Toggle</button>
    <mzn-dropdown
      [anchor]="anchorRef()"
      [open]="open"
      [options]="options"
      [value]="value"
      [disableClickAway]="true"
      (selected)="onSelect($event)"
      (closed)="open = false"
    />
  `,
})
class TestHostComponent {
  readonly anchorRef = viewChild.required<ElementRef<HTMLElement>>('anchor');
  open = false;
  options = MOCK_OPTIONS;
  value = '';
  lastSelected: DropdownOption | null = null;

  onSelect(option: DropdownOption): void {
    this.lastSelected = option;
    this.value = option.id;
  }
}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznDropdown', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHostComponent],
    });
  });

  it('should not render when closed', () => {
    const { fixture } = createFixture(TestHostComponent);
    const list = fixture.nativeElement.querySelector('[role="listbox"]');

    expect(list).toBeFalsy();
  });

  it('should render options when open', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[role="option"]');

    expect(items.length).toBe(3);
  });

  it('should display option names', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[role="option"]');

    expect(items[0].textContent).toContain('Option 1');
    expect(items[1].textContent).toContain('Option 2');
  });

  it('should emit selected on option click', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('[role="option"]');

    items[1].click();
    fixture.detectChanges();

    expect(host.lastSelected?.id).toBe('2');
  });

  it('should mark selected option as active', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    host.value = '1';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const activeItems = fixture.nativeElement.querySelectorAll(
      '.mzn-dropdown-item-card--active',
    );

    expect(activeItems.length).toBe(1);
  });
});
