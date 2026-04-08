import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznPopper } from './popper.component';

@Component({
  standalone: true,
  imports: [MznPopper],
  template: `
    <button #anchor>Anchor</button>
    <mzn-popper
      [anchor]="anchorEl()"
      [open]="open"
      [placement]="placement"
      [offsetOptions]="offsetOptions"
    >
      <div class="popper-content">Popper Content</div>
    </mzn-popper>
  `,
})
class TestHostComponent {
  readonly anchorEl = viewChild.required<ElementRef<HTMLElement>>('anchor');
  open = false;
  placement: 'bottom' | 'top' | 'left' | 'right' | 'bottom-start' = 'bottom';
  offsetOptions?: { mainAxis?: number };
}

function createFixture(
  overrides: Partial<
    Pick<TestHostComponent, 'open' | 'placement' | 'offsetOptions'>
  > = {},
): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
  getPopperElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getPopperElement: () =>
      fixture.nativeElement.querySelector('mzn-popper') as HTMLElement,
  };
}

describe('MznPopper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should be hidden when open is false', () => {
    const { getPopperElement } = createFixture({ open: false });

    expect(getPopperElement().style.display).toBe('none');
  });

  it('should be visible when open is true', () => {
    const { getPopperElement } = createFixture({ open: true });
    const el = getPopperElement();

    expect(el.style.display).not.toBe('none');
  });

  it('should set data-popper-placement attribute', () => {
    const { getPopperElement } = createFixture({
      open: true,
      placement: 'bottom',
    });

    expect(
      getPopperElement().getAttribute('data-popper-placement'),
    ).toBeTruthy();
  });

  it('should render content inside popper', () => {
    const { getPopperElement } = createFixture({ open: true });

    expect(getPopperElement().querySelector('.popper-content')).toBeTruthy();
  });

  it('should update when open changes', () => {
    const { fixture, host, getPopperElement } = createFixture({ open: false });

    expect(getPopperElement().style.display).toBe('none');

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    expect(getPopperElement().style.display).not.toBe('none');
  });

  it('should clean up on destroy', () => {
    const { fixture } = createFixture({ open: true });

    expect(() => fixture.destroy()).not.toThrow();
  });
});
