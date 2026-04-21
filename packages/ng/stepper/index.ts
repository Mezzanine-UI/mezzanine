// Phase 5: public API aligned to React's Stepper index.ts. React exposes
// Stepper default, Step, StepProps, StepperProps, and the useStepper hook.
// NG's MZN_STEPPER_CONTEXT / StepperContext are Angular-only internal
// wiring that stays unexported. MznStepperState / MznStepperStateOptions
// serve as the signals-era alternative to React's useStepper hook and
// remain public.
export {
  MznStep,
  StepOrientation,
  StepStatus,
  StepType,
} from './step.component';
export { MznStepper } from './stepper.component';
export { MznStepperState, MznStepperStateOptions } from './stepper-state';
