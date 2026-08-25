import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MznOverflowTooltip } from './overflow-tooltip.component';
import { MznOverflowCounterTag } from './overflow-counter-tag.component';

// ─── MznOverflowTooltip ─────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [MznOverflowTooltip],
  template: `
    <div #anchorEl class="anchor" style="width: 32px; height: 32px;"></div>
    <div
      mznOverflowTooltip
      [anchor]="anchorElRef()!"
      [open]="open()"
      [tags]="tags()"
      (tagDismiss)="lastDismissedIndex.set($event)"
    ></div>
  `,
})
class OverflowTooltipHostComponent {
  readonly anchorElRef = viewChild<ElementRef<HTMLElement>>('anchorEl');

  readonly open = signal(false);
  readonly tags = signal(['Tag 1', 'Tag 2', 'Tag 3']);
  readonly lastDismissedIndex = signal<number | null>(null);
}

describe('MznOverflowTooltip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverflowTooltipHostComponent],
      providers: [provideAnimations()],
    });
  });

  it('should create the host component without error', () => {
    expect(() =>
      TestBed.createComponent(OverflowTooltipHostComponent),
    ).not.toThrow();
  });

  it('should render tags when open is true', () => {
    const fixture = TestBed.createComponent(OverflowTooltipHostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('[mznTag]');
    expect(tags.length).toBe(3);
  });

  it('should keep the popper hidden when open is false', () => {
    const fixture = TestBed.createComponent(OverflowTooltipHostComponent);
    fixture.componentInstance.open.set(false);
    fixture.detectChanges();

    const popper = fixture.nativeElement.querySelector(
      '[mznPopper]',
    ) as HTMLElement;

    // MznPopper keeps its content mounted and hides it with display:none.
    expect(popper.style.display).toBe('none');
  });
});

// ─── MznOverflowCounterTag ──────────────────────────────────────────

@Component({
  standalone: true,
  imports: [MznOverflowCounterTag],
  template: `
    <div
      mznOverflowCounterTag
      [tags]="tags()"
      [disabled]="disabled()"
      [readOnly]="readOnly()"
      (tagDismiss)="lastDismissedIndex.set($event)"
    ></div>
  `,
})
class OverflowCounterTagHostComponent {
  readonly tags = signal(['Tag 1', 'Tag 2', 'Tag 3']);
  readonly disabled = signal(false);
  readonly readOnly = signal(false);
  readonly lastDismissedIndex = signal<number | null>(null);
}

describe('MznOverflowCounterTag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverflowCounterTagHostComponent],
      providers: [provideAnimations()],
    });
  });

  it('should create without error', () => {
    expect(() =>
      TestBed.createComponent(OverflowCounterTagHostComponent),
    ).not.toThrow();
  });

  it('should render a mzn-tag trigger', () => {
    const fixture = TestBed.createComponent(OverflowCounterTagHostComponent);
    fixture.detectChanges();

    const tag = fixture.nativeElement.querySelector('[mznTag]');
    expect(tag).toBeTruthy();
  });
});
