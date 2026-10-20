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
    <div
      mznTable
      [columns]="columns"
      [dataSource]="dataSource"
      [draggable]="draggable()"
      [expandable]="expandable()"
      [pinnable]="pinnable()"
      [resizable]="true"
      [rowSelection]="rowSelection()"
    ></div>
  `,
})
class ResizeHostComponent {
  readonly columns = columns;
  readonly dataSource = dataSource;
  readonly draggable = signal<TableDraggable | undefined>(undefined);
  readonly expandable = signal(false);
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
});
