import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznInputTriggerPopper } from './input-trigger-popper.component';

@Component({
  standalone: true,
  imports: [MznInputTriggerPopper],
  template: `
    <button #anchor>Trigger</button>
    <mzn-input-trigger-popper
      [anchor]="anchorEl()"
      [open]="open"
      [sameWidth]="sameWidth"
    >
      <div class="dropdown-content">Options</div>
    </mzn-input-trigger-popper>
  `,
})
class TestHostComponent {
  readonly anchorEl = viewChild.required<ElementRef<HTMLElement>>('anchor');
  open = false;
  sameWidth = false;
}

function createFixture(
  overrides: Partial<Pick<TestHostComponent, 'open' | 'sameWidth'>> = {},
): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
  getHostElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getHostElement: () =>
      fixture.nativeElement.querySelector(
        'mzn-input-trigger-popper',
      ) as HTMLElement,
  };
}

describe('MznInputTriggerPopper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render with host class', () => {
    const { getHostElement } = createFixture();

    expect(
      getHostElement().classList.contains('mzn-input-trigger-popper'),
    ).toBe(true);
  });

  it('should render content', () => {
    const { getHostElement } = createFixture({ open: true });

    expect(getHostElement().querySelector('.dropdown-content')).toBeTruthy();
  });

  it('should stop click propagation', () => {
    const { getHostElement } = createFixture({ open: true });
    const spy = jest.fn();

    document.addEventListener('click', spy);
    getHostElement().click();
    document.removeEventListener('click', spy);

    expect(spy).not.toHaveBeenCalled();
  });
});
