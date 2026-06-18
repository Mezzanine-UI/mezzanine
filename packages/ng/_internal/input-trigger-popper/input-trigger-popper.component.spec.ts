import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MznInputTriggerPopper } from './input-trigger-popper.component';

@Component({
  standalone: true,
  imports: [MznInputTriggerPopper],
  template: `
    <button #anchor>Trigger</button>
    <ng-template
      mznInputTriggerPopper
      [anchor]="anchorEl()"
      [open]="open"
      [sameWidth]="sameWidth"
      [flip]="flip"
    >
      <div class="dropdown-content">Options</div>
    </ng-template>
  `,
})
class TestHostComponent {
  readonly anchorEl = viewChild.required<ElementRef<HTMLElement>>('anchor');
  open = false;
  sameWidth = false;
  flip = false;
}

function createFixture(
  overrides: Partial<
    Pick<TestHostComponent, 'open' | 'sameWidth' | 'flip'>
  > = {},
): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return { fixture, host };
}

describe('MznInputTriggerPopper', () => {
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    overlayContainerElement =
      TestBed.inject(OverlayContainer).getContainerElement();
  });

  afterEach(() => {
    TestBed.inject(OverlayContainer).ngOnDestroy();
  });

  it('should not portal content into the overlay when closed', () => {
    createFixture({ open: false });

    expect(
      overlayContainerElement.querySelector('.dropdown-content'),
    ).toBeNull();
  });

  it('should portal content into the cdk overlay when open', () => {
    createFixture({ open: true });

    expect(
      overlayContainerElement.querySelector('.dropdown-content'),
    ).toBeTruthy();
  });

  it('should apply the popper class to the overlay pane when open', () => {
    createFixture({ open: true });

    expect(
      overlayContainerElement.querySelector('.mzn-input-trigger-popper'),
    ).toBeTruthy();
  });

  it('should portal content into the cdk overlay when flip is enabled', () => {
    createFixture({ open: true, flip: true });

    expect(
      overlayContainerElement.querySelector('.dropdown-content'),
    ).toBeTruthy();
  });

  it('should detach the overlay when toggled closed', () => {
    const { fixture, host } = createFixture({ open: true });

    expect(
      overlayContainerElement.querySelector('.dropdown-content'),
    ).toBeTruthy();

    host.open = false;
    fixture.detectChanges();

    expect(
      overlayContainerElement.querySelector('.dropdown-content'),
    ).toBeNull();
  });
});
