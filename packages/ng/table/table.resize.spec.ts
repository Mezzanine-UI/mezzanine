import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznTable } from './table.component';
import type {
  TableColumn,
  TableDataSource,
  TableDraggable,
  TablePinnable,
} from './table-types';

const columns: readonly TableColumn[] = [
  { dataIndex: 'name', key: 'name', minWidth: 80, title: 'Name', width: 160 },
  { dataIndex: 'age', key: 'age', minWidth: 60, title: 'Age', width: 100 },
  {
    dataIndex: 'address',
    key: 'address',
    minWidth: 200,
    title: 'Address',
    width: 400,
  },
];

const dataSource: readonly TableDataSource[] = [
  { address: 'Taipei', age: 32, key: '1', name: 'John' },
];

@Component({
  standalone: true,
  imports: [MznTable],
  template: `
    @if (mounted()) {
      <div
        mznTable
        [columnWidths]="columnWidths()"
        [columns]="columns"
        [dataSource]="dataSource"
        [draggable]="draggable()"
        [expandable]="expandable()"
        [pinnable]="pinnable()"
        [resizable]="true"
        [rowSelection]="rowSelection()"
        (columnWidthsChange)="onColumnWidthsChange($event)"
      ></div>
    }
  `,
})
class ResizeHostComponent {
  readonly columnWidths = signal<Record<string, number> | undefined>(undefined);
  readonly columns = columns;
  readonly dataSource = dataSource;
  readonly draggable = signal<TableDraggable | undefined>(undefined);
  readonly expandable = signal(false);
  readonly mounted = signal(true);
  readonly onColumnWidthsChange = jest.fn<void, [Record<string, number>]>();
  readonly pinnable = signal<TablePinnable | undefined>(undefined);
  readonly rowSelection = signal(false);
}

type Fixture = ComponentFixture<ResizeHostComponent>;

const getHostEl = (fixture: Fixture): HTMLElement =>
  fixture.nativeElement as HTMLElement;

const getColWidths = (fixture: Fixture): string[] =>
  Array.from(
    getHostEl(fixture).querySelectorAll<HTMLElement>('colgroup > col'),
  ).map((col) => col.style.width);

const firePointer = (
  target: EventTarget,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  clientX: number,
): void => {
  // jsdom has no PointerEvent constructor; a MouseEvent carries clientX and
  // reaches the same `(pointerdown)` / document `pointermove` listeners.
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
  });

  Object.defineProperty(event, 'pointerId', { value: 1 });
  target.dispatchEvent(event);
};

/** Drags the n-th resize handle horizontally by `deltaX` pixels. */
const dragHandle = (fixture: Fixture, index: number, deltaX: number): void => {
  const handle = getHostEl(fixture).querySelectorAll(
    '.mzn-table__resize-handle',
  )[index];

  firePointer(handle, 'pointerdown', 0);
  firePointer(document, 'pointermove', deltaX);
  firePointer(document, 'pointerup', deltaX);
  fixture.detectChanges();
};

const render = (
  setup: (host: ResizeHostComponent) => void = () => {},
): Fixture => {
  const fixture = TestBed.createComponent(ResizeHostComponent);

  setup(fixture.componentInstance);
  fixture.detectChanges();

  return fixture;
};

let originalGetBoundingClientRect: typeof Element.prototype.getBoundingClientRect;
let originalSetPointerCapture: typeof Element.prototype.setPointerCapture;

beforeAll(() => {
  // jsdom has no layout: report each <col>'s inline width as its rendered width
  originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function getBoundingClientRect(
    this: Element,
  ): DOMRect {
    if (this instanceof HTMLTableColElement) {
      const width = parseFloat(this.style.width) || 0;

      return new DOMRect(0, 0, width, 0);
    }

    return originalGetBoundingClientRect.call(this);
  };

  // jsdom does not implement pointer capture
  originalSetPointerCapture = Element.prototype.setPointerCapture;
  Element.prototype.setPointerCapture = function setPointerCapture(): void {};
});

afterAll(() => {
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  Element.prototype.setPointerCapture = originalSetPointerCapture;
});

describe('MznTable resizable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ResizeHostComponent] });
  });

  it('should resize the dragged column and let the last column absorb it', () => {
    const fixture = render();

    dragHandle(fixture, 0, 50);

    expect(getColWidths(fixture)).toEqual(['210px', '100px', '350px']);
  });

  describe('with leading action columns', () => {
    it.each<[string, (host: ResizeHostComponent) => void]>([
      [
        'pinnable',
        (host) =>
          host.pinnable.set({
            enabled: true,
            onPinChange: () => {},
            pinnedRowKeys: [],
          }),
      ],
      ['draggable', (host) => host.draggable.set({ enabled: true })],
      ['rowSelection', (host) => host.rowSelection.set(true)],
      ['expandable', (host) => host.expandable.set(true)],
    ])('should resize the right column when %s adds a column', (_, setup) => {
      const fixture = render(setup);

      dragHandle(fixture, 0, 50);

      expect(getColWidths(fixture)).toEqual([
        '40px',
        '210px',
        '100px',
        '350px',
      ]);
    });

    it('should skip every leading action column', () => {
      const fixture = render((host) => {
        host.expandable.set(true);
        host.pinnable.set({ enabled: true, pinnedRowKeys: [] });
        host.rowSelection.set(true);
      });

      dragHandle(fixture, 1, -20);

      expect(getColWidths(fixture).slice(3)).toEqual([
        '160px',
        '80px',
        '420px',
      ]);
    });
  });

  describe('columnWidthsChange', () => {
    it('should emit resized widths keyed by column key on pointerup', () => {
      const fixture = render();
      const host = fixture.componentInstance;

      dragHandle(fixture, 0, 50);

      expect(host.onColumnWidthsChange).toHaveBeenCalledTimes(1);
      expect(host.onColumnWidthsChange).toHaveBeenCalledWith({
        address: 350,
        age: 100,
        name: 210,
      });
    });

    it('should not emit while dragging, only on pointerup', () => {
      const fixture = render();
      const host = fixture.componentInstance;
      const handle = getHostEl(fixture).querySelector(
        '.mzn-table__resize-handle',
      )!;

      firePointer(handle, 'pointerdown', 0);
      firePointer(document, 'pointermove', 30);
      fixture.detectChanges();

      expect(host.onColumnWidthsChange).not.toHaveBeenCalled();
      expect(getColWidths(fixture)).toEqual(['190px', '100px', '370px']);

      firePointer(document, 'pointerup', 30);

      expect(host.onColumnWidthsChange).toHaveBeenCalledTimes(1);
    });

    it('should emit the widths of earlier drags merged with the latest one', () => {
      const fixture = render();
      const host = fixture.componentInstance;

      dragHandle(fixture, 0, 50);
      dragHandle(fixture, 1, -20);

      expect(host.onColumnWidthsChange).toHaveBeenCalledTimes(2);
      expect(host.onColumnWidthsChange).toHaveBeenLastCalledWith({
        address: 370,
        age: 80,
        name: 210,
      });
      expect(getColWidths(fixture)).toEqual(['210px', '80px', '370px']);
    });

    it('should resize the right column when pinnable adds a handle column', () => {
      const fixture = render((host) =>
        host.pinnable.set({ enabled: true, pinnedRowKeys: [] }),
      );

      dragHandle(fixture, 0, 50);

      expect(
        fixture.componentInstance.onColumnWidthsChange,
      ).toHaveBeenCalledWith({ address: 350, age: 100, name: 210 });
    });

    it('should not emit when a drag returns to its start position', () => {
      const fixture = render();
      const host = fixture.componentInstance;
      const handle = getHostEl(fixture).querySelector(
        '.mzn-table__resize-handle',
      )!;

      firePointer(handle, 'pointerdown', 0);
      firePointer(document, 'pointermove', 40);
      firePointer(document, 'pointermove', 0);
      firePointer(document, 'pointerup', 0);
      fixture.detectChanges();

      expect(host.onColumnWidthsChange).not.toHaveBeenCalled();
      expect(getColWidths(fixture)).toEqual(['160px', '100px', '400px']);
    });

    it('should not emit when the drag is a plain click on the handle', () => {
      const fixture = render();
      const handle = getHostEl(fixture).querySelector(
        '.mzn-table__resize-handle',
      )!;

      firePointer(handle, 'pointerdown', 0);
      firePointer(document, 'pointerup', 0);

      expect(
        fixture.componentInstance.onColumnWidthsChange,
      ).not.toHaveBeenCalled();
    });

    it('should detach drag listeners and not emit when destroyed mid-drag', () => {
      const fixture = render();
      const host = fixture.componentInstance;
      const handle = getHostEl(fixture).querySelector(
        '.mzn-table__resize-handle',
      )!;
      const addSpy = jest.spyOn(document, 'addEventListener');
      const removeSpy = jest.spyOn(document, 'removeEventListener');
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        firePointer(handle, 'pointerdown', 0);
        firePointer(document, 'pointermove', 40);

        const dragListeners = addSpy.mock.calls.filter(([type]) =>
          ['pointermove', 'pointerup'].includes(type),
        );

        expect(dragListeners).toHaveLength(2);

        host.mounted.set(false);
        fixture.detectChanges();

        // Detached on destroy, before any pointerup arrives
        dragListeners.forEach(([type, listener]) => {
          expect(removeSpy).toHaveBeenCalledWith(type, listener);
        });

        firePointer(document, 'pointerup', 40);

        expect(host.onColumnWidthsChange).not.toHaveBeenCalled();
        expect(warnSpy).not.toHaveBeenCalled();
      } finally {
        addSpy.mockRestore();
        removeSpy.mockRestore();
        warnSpy.mockRestore();
      }
    });
  });

  describe('controlled columnWidths', () => {
    it('should render widths from columnWidths over column.width', () => {
      const fixture = render((host) => host.columnWidths.set({ name: 240 }));

      expect(getColWidths(fixture)).toEqual(['240px', '100px', '400px']);
    });

    it('should reset to column.width when columnWidths becomes {}', () => {
      const fixture = render((host) =>
        host.columnWidths.set({ address: 350, name: 210 }),
      );

      expect(getColWidths(fixture)).toEqual(['210px', '100px', '350px']);

      fixture.componentInstance.columnWidths.set({});
      fixture.detectChanges();

      expect(getColWidths(fixture)).toEqual(['160px', '100px', '400px']);
    });

    it('should show live drag widths, then snap back if the parent ignores the change', () => {
      const fixture = render((host) => host.columnWidths.set({}));
      const host = fixture.componentInstance;
      const handle = getHostEl(fixture).querySelector(
        '.mzn-table__resize-handle',
      )!;

      firePointer(handle, 'pointerdown', 0);
      firePointer(document, 'pointermove', 50);
      fixture.detectChanges();

      expect(getColWidths(fixture)).toEqual(['210px', '100px', '350px']);

      firePointer(document, 'pointerup', 50);
      fixture.detectChanges();

      expect(host.onColumnWidthsChange).toHaveBeenCalledWith({
        address: 350,
        age: 100,
        name: 210,
      });
      expect(getColWidths(fixture)).toEqual(['160px', '100px', '400px']);
    });

    it('should keep the drag widths when the parent writes them back', () => {
      const fixture = render((host) => {
        host.columnWidths.set({});
        host.onColumnWidthsChange.mockImplementation((widths) =>
          host.columnWidths.set(widths),
        );
      });

      dragHandle(fixture, 0, 50);

      expect(getColWidths(fixture)).toEqual(['210px', '100px', '350px']);
    });

    it('should start a drag from the controlled widths', () => {
      const fixture = render((host) =>
        host.columnWidths.set({ address: 350, name: 210 }),
      );

      dragHandle(fixture, 1, -20);

      expect(
        fixture.componentInstance.onColumnWidthsChange,
      ).toHaveBeenCalledWith({ address: 370, age: 80, name: 210 });
    });

    it('should clamp columnWidths to minWidth/maxWidth and ignore invalid values', () => {
      const fixture = render((host) =>
        host.columnWidths.set({ address: Number.NaN, age: -5, name: 10 }),
      );

      expect(getColWidths(fixture)).toEqual(['80px', '100px', '400px']);
    });
  });
});
