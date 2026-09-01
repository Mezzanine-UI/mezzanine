import { Component, ElementRef, signal, viewChild } from '@angular/core';
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
    <div
      mznDropdown
      [anchor]="anchorRef()"
      [open]="open"
      [options]="options"
      [value]="value"
      [disableClickAway]="true"
      [flip]="flip"
      (select)="onSelect($event)"
      (close)="open = false"
    ></div>
  `,
})
class TestHostComponent {
  readonly anchorRef = viewChild.required<ElementRef<HTMLElement>>('anchor');
  open = false;
  options = MOCK_OPTIONS;
  value = '';
  flip = false;
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
    createFixture(TestHostComponent);

    const list = document.querySelector<HTMLElement>('[role="listbox"]');

    expect(list).toBeFalsy();
  });

  it('should render options when open', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = document.querySelectorAll<HTMLElement>('[role="option"]');

    expect(items.length).toBe(3);
  });

  it('should render options when open and flip is enabled', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    host.flip = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = document.querySelectorAll<HTMLElement>('[role="option"]');

    expect(items.length).toBe(3);
  });

  it('should display option names', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = document.querySelectorAll<HTMLElement>('[role="option"]');

    expect(items[0].textContent).toContain('Option 1');
    expect(items[1].textContent).toContain('Option 2');
  });

  it('should emit selected on option click', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = document.querySelectorAll<HTMLElement>('[role="option"]');

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

    const activeItems = document.querySelectorAll(
      '.mzn-dropdown-item-card--active',
    );

    expect(activeItems.length).toBe(1);
  });
});

/**
 * `shift` maps onto the CDK overlay's `withPush`. jsdom has no layout, so the
 * anchor rect, the overlay size and the viewport are all mocked and the pane's
 * resolved offset is measured — the same shape as the React Dropdown test.
 */
@Component({
  standalone: true,
  imports: [MznDropdown],
  template: `
    <button #anchor>Toggle</button>
    <div
      mznDropdown
      [anchor]="anchorRef()"
      [open]="true"
      [options]="options"
      [shift]="shift()"
      placement="bottom-start"
    ></div>
  `,
})
class ShiftHostComponent {
  readonly anchorRef = viewChild.required<ElementRef<HTMLElement>>('anchor');
  readonly options = MOCK_OPTIONS;
  readonly shift = signal(false);
}

describe('MznDropdown shift', () => {
  const VIEWPORT_WIDTH = 1024;
  const MENU_WIDTH = 200;
  /** anchor pressed against the right edge — the menu would run past it */
  const ANCHOR_X = 900;

  const domRect = (x: number, y: number, width: number, height: number) =>
    ({
      x,
      y,
      width,
      height,
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      toJSON: () => {},
    }) as DOMRect;

  let rectSpy: jest.SpyInstance;

  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: VIEWPORT_WIDTH,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 768,
    });
    window.innerWidth = VIEWPORT_WIDTH;
    window.innerHeight = 768;

    rectSpy = jest
      .spyOn(Element.prototype, 'getBoundingClientRect')
      .mockImplementation(function mockRect(this: Element) {
        if (this.tagName === 'BUTTON') return domRect(ANCHOR_X, 200, 32, 32);
        if (this.classList.contains('cdk-overlay-pane')) {
          return domRect(0, 0, MENU_WIDTH, 120);
        }

        return domRect(0, 0, 0, 0);
      });

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ShiftHostComponent],
    });
  });

  afterEach(() => {
    rectSpy.mockRestore();
  });

  function openAndReadPaneLeft(shift: boolean): number {
    const fixture = TestBed.createComponent(ShiftHostComponent);

    fixture.componentInstance.shift.set(shift);
    fixture.detectChanges();
    fixture.detectChanges();

    const pane = document.querySelector<HTMLElement>('.cdk-overlay-pane')!;

    expect(pane).toBeTruthy();

    return parseFloat(pane.style.left || '0');
  }

  it('should push the menu back inside the viewport when shift is enabled', () => {
    const left = openAndReadPaneLeft(true);

    expect(left + MENU_WIDTH).toBeLessThanOrEqual(VIEWPORT_WIDTH);
  });

  it('should leave the menu at the anchor when shift is off', () => {
    const left = openAndReadPaneLeft(false);

    expect(left).toBe(ANCHOR_X);
  });
});
