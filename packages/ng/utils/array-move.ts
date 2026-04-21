export function arrayMove<T>(
  arr: readonly T[],
  oldIndex: number,
  newIndex: number,
): T[] {
  const temp = arr.slice(0);

  if (newIndex >= temp.length) {
    let k = newIndex - temp.length + 1;

    while ((k -= 1)) {
      temp.push(undefined as T);
    }
  }

  temp.splice(newIndex, 0, temp.splice(oldIndex, 1)[0]);

  return temp;
}
