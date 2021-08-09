/** Types */
export type TimePanelUnitValue = number;
export type TimePanelUnit = {
  value: TimePanelUnitValue;
  label: string;
};
export type TimePanelMode = 'hour' | 'minute' | 'second';

/** Classes */
export const timePanelPrefix = 'mzn-time-panel';
export const timePanelColumnsPrefix = `${timePanelPrefix}-columns`;
export const timePanelActionPrefix = `${timePanelPrefix}-action`;
export const timePanelButtonPrefix = `${timePanelPrefix}-button`;
export const timePanelColumnPrefix = `${timePanelPrefix}-column`;

export const timePanelClasses = {
  host: timePanelPrefix,

  /** Columns classes */
  columns: timePanelColumnsPrefix,

  /** Action classes */
  action: timePanelActionPrefix,

  /** Button classes */
  button: timePanelButtonPrefix,
  buttonActive: `${timePanelButtonPrefix}--active`,

  /** Column classes */
  column: timePanelColumnPrefix,
  columnPrefix: `${timePanelColumnPrefix}__prefix`,
  columnButton: `${timePanelColumnPrefix}__button`,
  columnControlButton: `${timePanelColumnPrefix}__control-button`,
  columnCells: `${timePanelColumnPrefix}__cells`,
  columnRatioBoxInner: `${timePanelColumnPrefix}__ratio-box-inner`,
};

/** Helpers */
export function getUnitLabel(
  target: string | number,
  digits: number,
  fill = '0',
) {
  const guardedString = String(target);

  if (guardedString.length < digits) {
    let result: string = guardedString;
    const remainder = digits - guardedString.length;

    for (let i = 0; i < remainder; i += 1) {
      result = `${fill}${result}`;
    }

    return result;
  }

  return guardedString;
}

export function getUnits(
  start: number,
  end: number,
  step: number,
) {
  const units: TimePanelUnit[] = [];

  for (let i = start; i <= end; i += step) {
    units.push({
      label: getUnitLabel(i, 2),
      value: i,
    });
  }

  return units;
}
