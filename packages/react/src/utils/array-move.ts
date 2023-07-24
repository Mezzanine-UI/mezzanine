export function arrayMove(
  arr: any[],
  old_index: number,
  new_index: number,
) {
  const temp = arr.slice(0);

  if (new_index >= temp.length) {
    let k = new_index - temp.length + 1;

    while ((k -= 1)) {
      temp.push();
    }
  }

  temp.splice(new_index, 0, temp.splice(old_index, 1)[0]);

  return temp;
}