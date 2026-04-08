import { ExtendedProperties, PickRenameMulti } from './general';

describe('general types', () => {
  it('PickRenameMulti should rename keys while preserving value types', () => {
    type Original = { a: string; b: number; c: boolean };
    type Renamed = PickRenameMulti<Original, { a: 'x'; b: 'y' }>;

    const obj: Renamed = { x: 'hello', y: 42, c: true };

    expect(obj.x).toBe('hello');
    expect(obj.y).toBe(42);
    expect(obj.c).toBe(true);
  });

  it('ExtendedProperties should preserve all properties', () => {
    type Original = { a: string; b: number };
    type Extended = ExtendedProperties<Original>;

    const obj: Extended = { a: 'hello', b: 42 };

    expect(obj.a).toBe('hello');
    expect(obj.b).toBe(42);
  });
});
