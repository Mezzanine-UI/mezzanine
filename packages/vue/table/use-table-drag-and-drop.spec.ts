import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import MznTable from './table.vue';
import type { TableColumn, TableProps } from './table.types';

interface Row extends Record<string, unknown> {
  key: string;
  name: string;
}

const rows: Row[] = [
  { key: '1', name: 'John' },
  { key: '2', name: 'Jim' },
  { key: '3', name: 'Joe' },
];

const columns: TableColumn<Row>[] = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
];

const ROW_HEIGHT = 40;

const render = (onDragEnd = vi.fn()) => {
  const wrapper = mount(MznTable, {
    attachTo: document.body,
    props: {
      columns,
      dataSource: rows,
      draggable: { enabled: true, onDragEnd },
    } as Partial<TableProps<Row>> as never,
  });

  return { onDragEnd, wrapper };
};

type Wrapper = ReturnType<typeof render>['wrapper'];

const bodyRows = (wrapper: Wrapper) =>
  wrapper.findAll(`tbody.${classes.body} tr`);

const handles = (wrapper: Wrapper) =>
  wrapper.findAll(`span.${classes.dragOrPinHandle}`);

/** jsdom measures nothing, so the pointer path needs rects of its own. */
const stubRects = (wrapper: Wrapper): void => {
  bodyRows(wrapper).forEach((row, index) => {
    row.element.getBoundingClientRect = (): DOMRect =>
      ({
        bottom: (index + 1) * ROW_HEIGHT,
        height: ROW_HEIGHT,
        left: 0,
        right: 200,
        top: index * ROW_HEIGHT,
        width: 200,
      }) as DOMRect;
  });
};

/** The `translate` each row carries, or null when it carries none. */
const rowTransforms = (wrapper: Wrapper): (string | null)[] =>
  bodyRows(wrapper).map((row) => {
    const match = /translate\([^)]*\)/.exec(row.attributes('style') ?? '');

    return match ? match[0] : null;
  });

const mouseTo = (clientY: number): void => {
  document.dispatchEvent(new MouseEvent('mousemove', { clientY }));
};

describe('useTableDragAndDrop', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should mark the scroll container as the droppable', () => {
    const { wrapper } = render();
    const container = wrapper.get('[data-rfd-droppable-id]');

    expect(container.attributes('data-rfd-droppable-id')).toBe('mzn-table-dnd');
    expect(container.attributes('data-rfd-droppable-context-id')).toBeTruthy();
  });

  it('should tag every row and handle with its draggable id', () => {
    const { wrapper } = render();

    expect(
      bodyRows(wrapper).map((row) => row.attributes('data-rfd-draggable-id')),
    ).toEqual(['1', '2', '3']);
    expect(
      handles(wrapper).map((handle) =>
        handle.attributes('data-rfd-drag-handle-draggable-id'),
      ),
    ).toEqual(['1', '2', '3']);
  });

  it('should give each handle the button role and the shared description', () => {
    const { wrapper } = render();
    const handle = handles(wrapper)[0];
    const describedBy = handle.attributes('aria-describedby') as string;

    expect(handle.attributes('role')).toBe('button');
    expect(handle.attributes('tabindex')).toBe('0');
    expect(handle.attributes('draggable')).toBe('false');
    expect(document.getElementById(describedBy)?.textContent).toContain(
      'Press space bar to start a drag.',
    );
  });

  it('should reorder with the keyboard and report the move', async () => {
    const { onDragEnd, wrapper } = render();
    const handle = handles(wrapper)[0];

    await handle.trigger('keydown', { key: ' ' });
    await handle.trigger('keydown', { key: 'ArrowDown' });
    await handle.trigger('keydown', { key: ' ' });

    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledWith([rows[1], rows[0], rows[2]], {
      draggingId: '1',
      fromIndex: 0,
      toIndex: 1,
    });
  });

  it('should move more than one position at a time', async () => {
    const { onDragEnd, wrapper } = render();
    const handle = handles(wrapper)[0];

    await handle.trigger('keydown', { key: ' ' });
    await handle.trigger('keydown', { key: 'ArrowDown' });
    await handle.trigger('keydown', { key: 'ArrowDown' });
    await handle.trigger('keydown', { key: ' ' });

    expect(onDragEnd).toHaveBeenCalledWith([rows[1], rows[2], rows[0]], {
      draggingId: '1',
      fromIndex: 0,
      toIndex: 2,
    });
  });

  it('should refuse to move past the top of the list', async () => {
    const { onDragEnd, wrapper } = render();
    const handle = handles(wrapper)[0];
    const live = document.querySelector(
      '[aria-live="assertive"]',
    ) as HTMLElement;

    await handle.trigger('keydown', { key: ' ' });
    await handle.trigger('keydown', { key: 'ArrowUp' });

    expect(live.textContent).toContain('lifted an item in position 1');

    await handle.trigger('keydown', { key: ' ' });

    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('should refuse to move past the bottom of the list', async () => {
    const { onDragEnd, wrapper } = render();
    const handle = handles(wrapper)[2];

    await handle.trigger('keydown', { key: ' ' });
    await handle.trigger('keydown', { key: 'ArrowDown' });
    await handle.trigger('keydown', { key: ' ' });

    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('should report nothing when the row is dropped where it started', async () => {
    const { onDragEnd, wrapper } = render();
    const handle = handles(wrapper)[0];

    await handle.trigger('keydown', { key: ' ' });
    await handle.trigger('keydown', { key: 'ArrowDown' });
    await handle.trigger('keydown', { key: 'ArrowUp' });
    await handle.trigger('keydown', { key: ' ' });

    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('should abandon the move on escape', async () => {
    const { onDragEnd, wrapper } = render();
    const handle = handles(wrapper)[0];

    await handle.trigger('keydown', { key: ' ' });
    await handle.trigger('keydown', { key: 'ArrowDown' });
    await handle.trigger('keydown', { key: 'Escape' });
    await handle.trigger('keydown', { key: ' ' });
    await handle.trigger('keydown', { key: ' ' });

    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('should ignore the arrow keys until a row is lifted', async () => {
    const { wrapper } = render();
    const handle = handles(wrapper)[0];

    await handle.trigger('keydown', { key: 'ArrowDown' });

    expect(bodyRows(wrapper)[0].classes()).not.toContain(
      classes.bodyRowDragging,
    );
  });

  it('should announce each step of a keyboard drag', async () => {
    const { wrapper } = render();
    const handle = handles(wrapper)[0];
    const live = document.querySelector(
      '[aria-live="assertive"]',
    ) as HTMLElement;

    expect(live.textContent).toBe('');

    await handle.trigger('keydown', { key: ' ' });
    expect(live.textContent).toContain('lifted an item in position 1');

    await handle.trigger('keydown', { key: 'ArrowDown' });
    expect(live.textContent).toContain('moved the item to position 2');

    await handle.trigger('keydown', { key: ' ' });
    expect(live.textContent).toContain('from position 1 to 2');
  });

  it('should lift the row out of the flow while the pointer drags it', async () => {
    const { wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('mousedown', { button: 0, clientY: 10 });
    mouseTo(60);
    await nextTick();

    const dragged = bodyRows(wrapper)[0];

    expect(dragged.classes()).toContain(classes.bodyRowDragging);
    expect(dragged.attributes('style')).toContain('position: fixed');
    expect(dragged.attributes('style')).toContain('top: 50px');
  });

  it('should hold the gap open while the row has not moved yet', async () => {
    const { wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('mousedown', { button: 0, clientY: 10 });
    await nextTick();

    // Leaving the flow already pulled every later row up by one row height;
    // the transform puts them back so the row keeps its own slot open.
    expect(rowTransforms(wrapper)).toEqual([
      null,
      `translate(0px, ${ROW_HEIGHT}px)`,
      `translate(0px, ${ROW_HEIGHT}px)`,
    ]);
  });

  it('should let only the rows above the destination close the gap', async () => {
    const { wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('mousedown', { button: 0, clientY: 10 });
    mouseTo(60);
    await nextTick();

    // Dropped onto the second slot: the row it displaced moves up into the
    // vacated first slot, and the one below it stays where it is.
    expect(rowTransforms(wrapper)).toEqual([
      null,
      null,
      `translate(0px, ${ROW_HEIGHT}px)`,
    ]);
  });

  it('should not fall back to the start on an exact row boundary', async () => {
    const { wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('mousedown', { button: 0, clientY: 10 });
    // Puts the lifted row's centre exactly on the seam between two rows.
    mouseTo(70);
    await nextTick();

    expect(rowTransforms(wrapper)).toEqual([
      null,
      null,
      `translate(0px, ${ROW_HEIGHT}px)`,
    ]);
  });

  it('should keep measuring against the geometry the drag started with', async () => {
    const { wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('mousedown', { button: 0, clientY: 10 });

    // Every row now reports the lifted row's own box, which is what a live
    // re-measure during the drag would see once it goes `position: fixed`.
    bodyRows(wrapper).forEach((row) => {
      row.element.getBoundingClientRect = (): DOMRect =>
        ({ bottom: ROW_HEIGHT, height: ROW_HEIGHT, top: 0 }) as DOMRect;
    });

    mouseTo(60);
    await nextTick();

    expect(rowTransforms(wrapper)).toEqual([
      null,
      null,
      `translate(0px, ${ROW_HEIGHT}px)`,
    ]);
  });

  it('should lift the row out of the flow for a keyboard drag too', async () => {
    const { wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('keydown', { key: ' ' });
    await handles(wrapper)[0].trigger('keydown', { key: 'ArrowDown' });

    const dragged = bodyRows(wrapper)[0];

    expect(dragged.classes()).toContain(classes.bodyRowDragging);
    expect(dragged.attributes('style')).toContain('position: fixed');
    expect(dragged.attributes('style')).toContain(`top: ${ROW_HEIGHT}px`);
  });

  it('should reorder to whichever row the pointer was released over', async () => {
    const { onDragEnd, wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('mousedown', { button: 0, clientY: 10 });
    mouseTo(60);
    document.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();

    expect(onDragEnd).toHaveBeenCalledWith([rows[1], rows[0], rows[2]], {
      draggingId: '1',
      fromIndex: 0,
      toIndex: 1,
    });
  });

  it('should let go of the row once the pointer is released', async () => {
    const { wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('mousedown', { button: 0, clientY: 10 });
    mouseTo(60);
    document.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();

    expect(bodyRows(wrapper)[0].classes()).not.toContain(
      classes.bodyRowDragging,
    );
    expect(rowTransforms(wrapper)).toEqual([null, null, null]);
  });

  it('should ignore anything but the primary button', async () => {
    const { wrapper } = render();

    stubRects(wrapper);
    await handles(wrapper)[0].trigger('mousedown', { button: 2, clientY: 10 });
    mouseTo(60);
    await nextTick();

    expect(bodyRows(wrapper)[0].classes()).not.toContain(
      classes.bodyRowDragging,
    );
  });

  it('should leave a table without draggable untouched', () => {
    const wrapper = mount(MznTable, {
      attachTo: document.body,
      props: { columns, dataSource: rows } as Partial<TableProps<Row>> as never,
    });

    expect(
      bodyRows(wrapper as Wrapper)[0].attributes('data-rfd-draggable-id'),
    ).toBeUndefined();
    expect(handles(wrapper as Wrapper)).toHaveLength(0);
  });
});
