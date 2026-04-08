import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznAccordion } from './accordion.component';
import { MznAccordionTitle } from './accordion-title.component';
import { MznAccordionContent } from './accordion-content.component';
import { MznAccordionGroup } from './accordion-group.component';

@Component({
  standalone: true,
  imports: [MznAccordion, MznAccordionTitle, MznAccordionContent],
  template: `
    <mzn-accordion
      [disabled]="disabled"
      [expanded]="expanded"
      [size]="size"
      (expandedChange)="onExpandedChange($event)"
    >
      <mzn-accordion-title>測試標題</mzn-accordion-title>
      <mzn-accordion-content>測試內容</mzn-accordion-content>
    </mzn-accordion>
  `,
})
class TestHostComponent {
  disabled = false;
  expanded: boolean | undefined = undefined;
  size: 'main' | 'sub' = 'main';
  onExpandedChange = jest.fn();
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getEl: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getEl: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-accordion')!,
  };
}

describe('MznAccordion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host and size classes', () => {
    const { getEl } = createFixture();
    const el = getEl();

    expect(el.classList.contains('mzn-accordion')).toBe(true);
    expect(el.classList.contains('mzn-accordion--main')).toBe(true);
  });

  it('should apply sub size class', () => {
    const { getEl } = createFixture({ size: 'sub' });

    expect(getEl().classList.contains('mzn-accordion--sub')).toBe(true);
  });

  it('should apply disabled class', () => {
    const { getEl } = createFixture({ disabled: true });

    expect(getEl().classList.contains('mzn-accordion--disabled')).toBe(true);
  });

  it('should render title', () => {
    const { getEl } = createFixture();

    expect(getEl().textContent).toContain('測試標題');
  });

  it('should hide content by default', () => {
    const { getEl } = createFixture();
    const content = getEl().querySelector(
      'mzn-accordion-content',
    ) as HTMLElement;

    expect(content.style.display).toBe('none');
  });

  it('should show content when expanded is true', () => {
    const { getEl } = createFixture({ expanded: true });
    const content = getEl().querySelector(
      'mzn-accordion-content',
    ) as HTMLElement;

    expect(content.style.display).not.toBe('none');
  });

  it('should toggle when title is clicked (uncontrolled)', () => {
    const { fixture, getEl, host } = createFixture();
    const button = getEl().querySelector('button')!;

    button.click();
    fixture.detectChanges();

    expect(host.onExpandedChange).toHaveBeenCalledWith(true);

    const content = getEl().querySelector(
      'mzn-accordion-content',
    ) as HTMLElement;

    expect(content.style.display).not.toBe('none');
  });

  it('should emit expandedChange but not toggle internally in controlled mode', () => {
    const { fixture, getEl, host } = createFixture({ expanded: false });
    const button = getEl().querySelector('button')!;

    button.click();
    fixture.detectChanges();

    expect(host.onExpandedChange).toHaveBeenCalledWith(true);

    const content = getEl().querySelector(
      'mzn-accordion-content',
    ) as HTMLElement;

    // Still hidden because expanded is controlled to false
    expect(content.style.display).toBe('none');
  });

  it('should not toggle when disabled', () => {
    const { fixture, getEl, host } = createFixture({ disabled: true });
    const button = getEl().querySelector('button')!;

    button.click();
    fixture.detectChanges();

    expect(host.onExpandedChange).not.toHaveBeenCalled();
  });
});

describe('MznAccordionGroup', () => {
  it('should create group', () => {
    TestBed.configureTestingModule({
      imports: [
        MznAccordionGroup,
        MznAccordion,
        MznAccordionTitle,
        MznAccordionContent,
      ],
    });

    const fixture = TestBed.createComponent(MznAccordionGroup);

    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('mzn-accordion-group'),
    ).toBe(true);
  });
});
