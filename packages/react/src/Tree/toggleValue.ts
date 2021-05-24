import { TreeNodeValue } from '@mezzanine-ui/core/tree';
import castArray from 'lodash/castArray';
import xor from 'lodash/xor';

export function uniqueArray<T>(items: T[]) {
  return Array.from(new Set(items));
}

export function toggleValue(
  value: TreeNodeValue | TreeNodeValue[],
  pool: TreeNodeValue[],
): TreeNodeValue[] {
  const castedValue = castArray(value);

  return xor(castedValue, pool);
}

export function toggleValueWithStatusControl(
  existed: boolean,
  value: TreeNodeValue | TreeNodeValue[],
  pool: TreeNodeValue[],
): TreeNodeValue[] {
  const castedValue = castArray(value);

  if (!existed) {
    return uniqueArray([...pool, ...castedValue]);
  }

  return pool.filter((val) => !castedValue.includes(val));
}
