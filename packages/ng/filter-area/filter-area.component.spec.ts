import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FilterAreaSize } from '@mezzanine-ui/core/filter-area';
import { MznFilterArea } from './filter-area.component';
import { MznFilterLine } from './filter-line.component';
import { MznFilter } from './filter.component';

@Component({
  standalone: true,
  imports: [MznFilterArea, MznFilterLine, MznFilter],
  template: `
    <mzn-filter-area
      [actionsAlign]="actionsAlign"
      [isDirty]="isDirty()"
      [resetText]="resetText"
      [size]="size"
      [submitText]="submitText"
      (filterReset)="onReset()"
      (filterSubmit)="onSubmit()"
    >
      <mzn-filter-line>
        <mzn-filter [span]="2">Field A</mzn-filter>
        <mzn-filter [span]="2">Field B</mzn-filter>
      </mzn-filter-line>
    </mzn-filter-area>
  `,
})
class SingleLineHost {
  actionsAlign: 'start' | 'center' | 'end' = 'end';
  isDirty = signal(true);
  resetText = 'Reset';
  size: FilterAreaSize = 'main';
  submitText = 'Search';
  onReset = jest.fn();
  onSubmit = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznFilterArea, MznFilterLine, MznFilter],
  template: `
    <mzn-filter-area
      [isDirty]="isDirty()"
      (filterReset)="onReset()"
      (filterSubmit)="onSubmit()"
    >
      <mzn-filter-line>
        <mzn-filter [span]="2">Field A</mzn-filter>
        <mzn-filter [span]="2">Field B</mzn-filter>
      </mzn-filter-line>
      <mzn-filter-line>
        <mzn-filter [span]="3">Field C</mzn-filter>
        <mzn-filter [span]="3">Field D</mzn-filter>
      </mzn-filter-line>
    </mzn-filter-area>
  `,
})
class MultiLineHost {
  isDirty = signal(true);
  onReset = jest.fn();
  onSubmit = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznFilterArea, MznFilterLine, MznFilter],
  template: `
    <mzn-filter-area size="sub">
      <mzn-filter-line>
        <mzn-filter [span]="2">Field</mzn-filter>
      </mzn-filter-line>
    </mzn-filter-area>
  `,
})
class SubSizeHost {}

describe('MznFilterArea', () => {
  describe('single line', () => {
    let fixture: ComponentFixture<SingleLineHost>;
    let host: SingleLineHost;

    const getHost = (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-filter-area')!;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SingleLineHost],
      }).compileComponents();

      fixture = TestBed.createComponent(SingleLineHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      // Second detectChanges to stabilize contentChildren signal
      fixture.detectChanges();
    });

    it('should create with host class', () => {
      expect(getHost().classList.contains('mzn-filter-area')).toBe(true);
      expect(getHost().classList.contains('mzn-filter-area--main')).toBe(true);
    });

    it('should render filter lines', () => {
      const lines = getHost().querySelectorAll('mzn-filter-line');

      expect(lines.length).toBe(1);
      expect(lines[0].classList.contains('mzn-filter-area__line')).toBe(true);
    });

    it('should render submit/reset buttons', () => {
      const buttons = getHost().querySelectorAll('button[mznbutton]');

      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent?.trim()).toBe('Search');
      expect(buttons[1].textContent?.trim()).toBe('Reset');
    });

    it('should disable reset when isDirty is false', () => {
      host.isDirty.set(false);
      fixture.detectChanges();

      const resetBtn = getHost().querySelectorAll(
        'button[mznbutton]',
      )[1] as HTMLButtonElement;

      expect(resetBtn.getAttribute('aria-disabled')).toBe('true');
    });

    it('should emit filterSubmit on submit button click', () => {
      const submitBtn = getHost().querySelectorAll(
        'button[mznbutton]',
      )[0] as HTMLButtonElement;

      submitBtn.click();

      expect(host.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should emit filterReset on reset button click', () => {
      const resetBtn = getHost().querySelectorAll(
        'button[mznbutton]',
      )[1] as HTMLButtonElement;

      resetBtn.click();

      expect(host.onReset).toHaveBeenCalledTimes(1);
    });

    it('should apply default size class (main)', () => {
      expect(getHost().classList.contains('mzn-filter-area--main')).toBe(true);
    });

    it('should not show expand button with single line', () => {
      const expandBtn = getHost().querySelector(
        'button[aria-label="Expand filters"]',
      );

      expect(expandBtn).toBeNull();
    });
  });

  describe('multiple lines', () => {
    let fixture: ComponentFixture<MultiLineHost>;

    const getHost = (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-filter-area')!;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MultiLineHost],
      }).compileComponents();

      fixture = TestBed.createComponent(MultiLineHost);
      fixture.detectChanges();
      // Second detectChanges to stabilize contentChildren signal
      fixture.detectChanges();
    });

    it('should show expand button when multiple lines', () => {
      const expandBtn = getHost().querySelector(
        'button[aria-label="Expand filters"]',
      );

      expect(expandBtn).not.toBeNull();
    });

    it('should hide non-first lines when collapsed', () => {
      const lines = getHost().querySelectorAll<HTMLElement>('mzn-filter-line');

      expect(lines[0].style.display).not.toBe('none');
      expect(lines[1].style.display).toBe('none');
    });

    it('should toggle expanded state', () => {
      const secondLine = getHost().querySelectorAll(
        'mzn-filter-line',
      )[1] as HTMLElement;

      expect(secondLine.style.display).toBe('none');

      // Click expand
      const expandBtn = getHost().querySelector(
        'button[aria-label="Expand filters"]',
      ) as HTMLButtonElement;

      expandBtn.click();
      fixture.detectChanges();

      expect(secondLine.style.display).not.toBe('none');

      // Verify collapse button appears
      const collapseBtn = getHost().querySelector(
        'button[aria-label="Collapse filters"]',
      );

      expect(collapseBtn).not.toBeNull();
    });

    it('should show all lines when expanded', () => {
      const expandBtn = getHost().querySelector(
        'button[aria-label="Expand filters"]',
      ) as HTMLButtonElement;

      expandBtn.click();
      fixture.detectChanges();

      const lines = getHost().querySelectorAll('mzn-filter-line');

      lines.forEach((line) => {
        expect((line as HTMLElement).style.display).not.toBe('none');
      });
    });
  });

  describe('sub size', () => {
    it('should apply sub size class', async () => {
      await TestBed.configureTestingModule({
        imports: [SubSizeHost],
      }).compileComponents();

      const subFixture = TestBed.createComponent(SubSizeHost);

      subFixture.detectChanges();

      const el: HTMLElement =
        subFixture.nativeElement.querySelector('mzn-filter-area');

      expect(el.classList.contains('mzn-filter-area--sub')).toBe(true);
    });
  });
});
