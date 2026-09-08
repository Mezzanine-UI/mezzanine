import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useTableDataSource } from './use-table-data-source';
import type { UseTableDataSourceOptions } from './use-table-data-source';

interface Row extends Record<string, unknown> {
  key: string;
}

const rows = (...keys: string[]): Row[] => keys.map((key) => ({ key }));

/** The composable clears its timers on unmount, so it needs an instance. */
function run(options: UseTableDataSourceOptions<Row> = {}) {
  let result!: ReturnType<typeof useTableDataSource<Row>>;

  const wrapper = mount(
    defineComponent({
      setup() {
        result = useTableDataSource<Row>(options);

        return () => h('div');
      },
    }),
  );

  return [result, wrapper] as const;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useTableDataSource', () => {
  it('should start from the initial data and nothing animating', () => {
    const [{ dataSource, transitionState }] = run({
      initialData: rows('a', 'b'),
    });

    expect(dataSource.value.map((r) => r.key)).toEqual(['a', 'b']);
    expect(transitionState.value.addingKeys.size).toBe(0);
    expect(transitionState.value.deletingKeys.size).toBe(0);
    expect(transitionState.value.fadingOutKeys.size).toBe(0);
  });

  it('should highlight an added row and let go after the highlight duration', () => {
    const [{ dataSource, transitionState, updateDataSource }] = run({
      initialData: rows('a'),
    });

    updateDataSource(rows('a', 'b'), { addedKeys: ['b'] });

    expect(dataSource.value.map((r) => r.key)).toEqual(['a', 'b']);
    expect([...transitionState.value.addingKeys]).toEqual(['b']);

    vi.advanceTimersByTime(699);
    expect([...transitionState.value.addingKeys]).toEqual(['b']);

    vi.advanceTimersByTime(1);
    expect(transitionState.value.addingKeys.size).toBe(0);
  });

  it('should not animate a row the caller did not name', () => {
    const [{ dataSource, transitionState, updateDataSource }] = run({
      initialData: rows('a'),
    });

    updateDataSource(rows('a', 'b'));

    expect(dataSource.value.map((r) => r.key)).toEqual(['a', 'b']);
    expect(transitionState.value.addingKeys.size).toBe(0);
  });

  it('should hold a removed row through highlight then fade, and only then drop it', () => {
    const [{ dataSource, transitionState, updateDataSource }] = run({
      initialData: rows('a', 'b', 'c'),
    });

    updateDataSource(rows('a', 'c'), { removedKeys: ['b'] });

    // Still there, and in its original position.
    expect(dataSource.value.map((r) => r.key)).toEqual(['a', 'b', 'c']);
    expect([...transitionState.value.deletingKeys]).toEqual(['b']);
    expect(transitionState.value.fadingOutKeys.size).toBe(0);

    vi.advanceTimersByTime(700);

    expect(transitionState.value.deletingKeys.size).toBe(0);
    expect([...transitionState.value.fadingOutKeys]).toEqual(['b']);
    expect(dataSource.value.map((r) => r.key)).toEqual(['a', 'b', 'c']);

    vi.advanceTimersByTime(150);

    expect(transitionState.value.fadingOutKeys.size).toBe(0);
    expect(dataSource.value.map((r) => r.key)).toEqual(['a', 'c']);
  });

  it('should honour custom durations', () => {
    const [{ transitionState, updateDataSource }] = run({
      fadeOutDuration: 20,
      highlightDuration: 50,
      initialData: rows('a', 'b'),
    });

    updateDataSource(rows('a'), { removedKeys: ['b'] });
    vi.advanceTimersByTime(50);

    expect([...transitionState.value.fadingOutKeys]).toEqual(['b']);

    vi.advanceTimersByTime(20);

    expect(transitionState.value.fadingOutKeys.size).toBe(0);
  });

  it('should keep a row that is mid-removal across a later refetch', () => {
    const [{ dataSource, updateDataSource }] = run({
      initialData: rows('a', 'b'),
    });

    updateDataSource(rows('a'), { removedKeys: ['b'] });
    updateDataSource(rows('a'));

    expect(dataSource.value.map((r) => r.key)).toEqual(['a', 'b']);

    vi.advanceTimersByTime(850);

    expect(dataSource.value.map((r) => r.key)).toEqual(['a']);
  });

  it('should stop animating a row that left the data without being named', () => {
    const [{ transitionState, updateDataSource }] = run({
      initialData: rows('a'),
    });

    updateDataSource(rows('a', 'b'), { addedKeys: ['b'] });

    expect([...transitionState.value.addingKeys]).toEqual(['b']);

    updateDataSource(rows('a'));

    expect(transitionState.value.addingKeys.size).toBe(0);
  });

  it('should drop every pending timer on unmount', () => {
    const [{ updateDataSource }, wrapper] = run({
      initialData: rows('a', 'b'),
    });

    updateDataSource(rows('a'), { removedKeys: ['b'] });

    expect(vi.getTimerCount()).toBeGreaterThan(0);

    wrapper.unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
