import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznStepper } from './stepper.component';
import { MznStep, StepOrientation, StepType } from './step.component';

@Component({
  standalone: true,
  imports: [MznStepper, MznStep],
  template: `
    <mzn-stepper
      [currentStep]="currentStep"
      [orientation]="orientation"
      [type]="type"
    >
      <mzn-step title="步驟一" description="描述一" />
      <mzn-step title="步驟二" />
      <mzn-step title="步驟三" [error]="hasError" />
    </mzn-stepper>
  `,
})
class TestHostComponent {
  currentStep = 0;
  hasError = false;
  orientation: StepOrientation = 'horizontal';
  type: StepType = 'number';
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getEl: () => HTMLElement;
  getSteps: () => HTMLElement[];
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getEl: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-stepper')!,
    getSteps: (): HTMLElement[] =>
      Array.from(fixture.nativeElement.querySelectorAll('mzn-step')),
  };
}

describe('MznStepper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host and horizontal classes', () => {
    const { getEl } = createFixture();
    const el = getEl();

    expect(el.classList.contains('mzn-stepper')).toBe(true);
    expect(el.classList.contains('mzn-stepper--horizontal')).toBe(true);
    expect(el.classList.contains('mzn-stepper--number')).toBe(true);
  });

  it('should apply vertical class', () => {
    const { getEl } = createFixture({ orientation: 'vertical' });

    expect(getEl().classList.contains('mzn-stepper--vertical')).toBe(true);
  });

  it('should apply dot type class', () => {
    const { getEl } = createFixture({ type: 'dot' });

    expect(getEl().classList.contains('mzn-stepper--dot')).toBe(true);
  });

  it('should render 3 steps', () => {
    const { getSteps } = createFixture();

    expect(getSteps()).toHaveLength(3);
  });

  it('should set first step as processing by default', () => {
    const { getSteps } = createFixture();
    const steps = getSteps();

    expect(steps[0].classList.contains('mzn-stepper-step--processing')).toBe(
      true,
    );
    expect(steps[1].classList.contains('mzn-stepper-step--pending')).toBe(true);
    expect(steps[2].classList.contains('mzn-stepper-step--pending')).toBe(true);
  });

  it('should update step statuses when currentStep changes', () => {
    const { fixture, host, getSteps } = createFixture();

    host.currentStep = 1;
    fixture.changeDetectorRef.detectChanges();

    const steps = getSteps();

    expect(steps[0].classList.contains('mzn-stepper-step--succeeded')).toBe(
      true,
    );
    expect(steps[1].classList.contains('mzn-stepper-step--processing')).toBe(
      true,
    );
    expect(steps[2].classList.contains('mzn-stepper-step--pending')).toBe(true);
  });

  it('should render step title', () => {
    const { getSteps } = createFixture();

    expect(getSteps()[0].textContent).toContain('步驟一');
  });

  it('should render step description when provided', () => {
    const { getSteps } = createFixture();

    expect(getSteps()[0].textContent).toContain('描述一');
    expect(
      getSteps()[1].querySelector('.mzn-stepper-step__description'),
    ).toBeNull();
  });

  it('should render number indicator icons', () => {
    const { getSteps } = createFixture();

    expect(
      getSteps()[0].querySelector('.mzn-stepper-step__status-indicator'),
    ).toBeTruthy();
  });

  it('should render dot indicator when type is dot', () => {
    const { getSteps } = createFixture({ type: 'dot' });

    expect(
      getSteps()[0].querySelector('.mzn-stepper-step__status-indicator-dot'),
    ).toBeTruthy();
  });

  it('should apply error class on step with error', () => {
    const { fixture, host, getSteps } = createFixture({ currentStep: 2 });

    host.hasError = true;
    fixture.changeDetectorRef.detectChanges();

    expect(
      getSteps()[2].classList.contains('mzn-stepper-step--processing-error'),
    ).toBe(true);
  });
});
