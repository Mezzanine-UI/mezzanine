import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars';
import { MznTable } from './table.component';
import type { TableColumn, TableDataSource, TableSize } from './table-types';

@Component({
  standalone: true,
  imports: [MznTable],
  template: `
    <div
      mznTable
      [columns]="columns()"
      [dataSource]="dataSource()"
      [emptyText]="emptyText()"
      [expandable]="expandable()"
      [rowSelection]="rowSelection()"
      [selectedRowKeys]="selectedRowKeys()"
      [size]="size()"
      [sticky]="sticky()"
      [zebraStriping]="zebraStriping()"
      (expandedRowKeysChange)="onExpandedRowKeysChange($event)"
      (selectedRowKeysChange)="onSelectedRowKeysChange($event)"
      (sortChange)="onSortChange($event)"
    ></div>
  `,
})
class TestHostComponent {
  readonly columns = signal<readonly TableColumn[]>([
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'age', title: 'Age', dataIndex: 'age' },
  ]);

  readonly dataSource = signal<readonly TableDataSource[]>([
    { key: '1', name: 'Alice', age: 30 },
    { key: '2', name: 'Bob', age: 25 },
    { key: '3', name: 'Charlie', age: 35 },
  ]);

  readonly emptyText = signal('No data');
  readonly expandable = signal(false);
  readonly rowSelection = signal(false);
  readonly selectedRowKeys = signal<readonly string[]>([]);
  readonly size = signal<TableSize>('main');
  readonly sticky = signal(false);
  readonly zebraStriping = signal(false);

  readonly onExpandedRowKeysChange = jest.fn();
  readonly onSelectedRowKeysChange = jest.fn();
  readonly onSortChange = jest.fn();
}

function createFixture(): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  el: HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);

  fixture.detectChanges();

  return {
    fixture,
    host: fixture.componentInstance,
    el: fixture.nativeElement as HTMLElement,
  };
}

describe('MznTable', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create with host class', () => {
    const { el } = createFixture();
    const table = el.querySelector('[mznTable]')!;

    expect(table.classList.contains('mzn-table-host')).toBe(true);
  });

  it('should render header cells from columns', () => {
    const { el } = createFixture();
    const headers = el.querySelectorAll('.mzn-table__header__cell');

    expect(headers).toHaveLength(2);
    expect(headers[0]!.textContent).toContain('Name');
    expect(headers[1]!.textContent).toContain('Age');
  });

  it('should render body rows from dataSource', () => {
    const { el } = createFixture();
    const rows = el.querySelectorAll('.mzn-table__body__row');

    expect(rows).toHaveLength(3);
  });

  it('should show empty text when no data', () => {
    const { fixture, host, el } = createFixture();

    host.dataSource.set([]);
    fixture.detectChanges();

    const emptyCell = el.querySelector('.mzn-table__empty');

    expect(emptyCell).toBeTruthy();
    expect(emptyCell!.textContent).toContain('No data');
  });

  it('should render selection checkboxes when rowSelection enabled', () => {
    const { fixture, host, el } = createFixture();

    host.rowSelection.set(true);
    fixture.detectChanges();

    const checkboxes = el.querySelectorAll('.mzn-table__selection-checkbox');

    // 1 header + 3 rows = 4
    expect(checkboxes).toHaveLength(4);
  });

  it('should toggle row selection', () => {
    const { fixture, host, el } = createFixture();

    host.rowSelection.set(true);
    fixture.detectChanges();

    const rowCheckboxes = el.querySelectorAll(
      'tbody .mzn-table__selection-checkbox input',
    );

    (rowCheckboxes[0] as HTMLInputElement).click();
    fixture.detectChanges();

    expect(host.onSelectedRowKeysChange).toHaveBeenCalledWith(['1']);

    const selectedRows = el.querySelectorAll('.mzn-table__body__row--selected');

    expect(selectedRows).toHaveLength(1);
  });

  it('should select/deselect all', () => {
    const { fixture, host, el } = createFixture();

    host.rowSelection.set(true);
    fixture.detectChanges();

    const headerCheckbox = el.querySelector(
      'thead .mzn-table__selection-checkbox input',
    ) as HTMLInputElement;

    // Select all
    headerCheckbox.click();
    fixture.detectChanges();

    expect(host.onSelectedRowKeysChange).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '2', '3']),
    );

    // Deselect all
    headerCheckbox.click();
    fixture.detectChanges();

    expect(host.onSelectedRowKeysChange).toHaveBeenLastCalledWith([]);
  });

  it('should render sort icons when sortOrder defined', () => {
    const { fixture, host, el } = createFixture();

    host.columns.set([
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        sortOrder: null,
        onSort: (): void => {},
      },
      { key: 'age', title: 'Age', dataIndex: 'age' },
    ]);
    fixture.detectChanges();

    const sortIcons = el.querySelectorAll('.mzn-table__sort-icons');

    expect(sortIcons).toHaveLength(1);
  });

  it('should emit sortChange on sort click', () => {
    const { fixture, host, el } = createFixture();

    host.columns.set([
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        sortOrder: null,
        onSort: (): void => {},
      },
    ]);
    fixture.detectChanges();

    const sortIcon = el.querySelector('.mzn-table__sort-icons') as HTMLElement;

    sortIcon.click();
    fixture.detectChanges();

    expect(host.onSortChange).toHaveBeenCalledWith({
      key: 'name',
      order: 'ascend',
    });
  });

  it('should render expand cells when expandable', () => {
    const { fixture, host, el } = createFixture();

    host.expandable.set(true);
    fixture.detectChanges();

    const expandCells = el.querySelectorAll('.mzn-table__expand-cell');

    // 1 header + 3 rows = 4
    expect(expandCells).toHaveLength(4);
  });

  it('should toggle row expansion', () => {
    const { fixture, host, el } = createFixture();

    host.expandable.set(true);
    fixture.detectChanges();

    const expandIcons = el.querySelectorAll('tbody .mzn-table__expand-icon');

    (expandIcons[0] as HTMLElement).click();
    fixture.detectChanges();

    expect(host.onExpandedRowKeysChange).toHaveBeenCalledWith(['1']);

    const expandedRows = el.querySelectorAll('.mzn-table__expanded-row');

    expect(expandedRows).toHaveLength(1);
  });

  it('should apply zebra striping', () => {
    const { fixture, host, el } = createFixture();

    host.zebraStriping.set(true);
    fixture.detectChanges();

    const zebraRows = el.querySelectorAll('.mzn-table__body__row--zebra');

    // Odd-indexed rows (index 1) get zebra class
    expect(zebraRows).toHaveLength(1);
  });

  it('should apply size classes', () => {
    const { fixture, host, el } = createFixture();

    expect(el.querySelector('.mzn-table--main')).toBeTruthy();

    host.size.set('sub');
    fixture.detectChanges();

    expect(el.querySelector('.mzn-table--sub')).toBeTruthy();
    expect(el.querySelector('.mzn-table--main')).toBeFalsy();
  });

  it('should apply sticky class', () => {
    const { fixture, host, el } = createFixture();

    host.sticky.set(true);
    fixture.detectChanges();

    expect(el.querySelector('.mzn-table--sticky')).toBeTruthy();
  });

  it('should display custom empty text', () => {
    const { fixture, host, el } = createFixture();

    host.dataSource.set([]);
    host.emptyText.set('Nothing here');
    fixture.detectChanges();

    const emptyCell = el.querySelector('.mzn-table__empty');

    expect(emptyCell!.textContent).toContain('Nothing here');
  });
});

/**
 * MznTable is an attribute directive (`[mznTable]`), so this host wires it onto
 * a host element rather than using an element selector, which lets the row
 * actions actually render.
 */
@Component({
  standalone: true,
  imports: [MznTable],
  template: `
    <div
      mznTable
      [actions]="actions()"
      [columns]="columns()"
      [dataSource]="dataSource()"
    ></div>
  `,
})
class RowActionsHostComponent {
  readonly columns = signal<readonly TableColumn[]>([
    { key: 'name', title: 'Name', dataIndex: 'name' },
  ]);

  readonly dataSource = signal<readonly TableDataSource[]>([
    { id: '1', name: 'Alice' },
  ]);

  readonly actions = signal({
    render: () => [
      {
        key: 'more',
        type: 'dropdown' as const,
        label: 'More actions',
        options: [{ id: 'copy', name: 'Copy' }],
      },
    ],
  });
}

describe('MznTable row action accessibility', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RowActionsHostComponent] });
  });

  it('should name the icon-only dropdown trigger with its label', () => {
    const fixture = TestBed.createComponent(RowActionsHostComponent);
    fixture.detectChanges();

    const trigger = (fixture.nativeElement as HTMLElement).querySelector(
      '.mzn-table__cell__actions button',
    );

    // The trigger renders only an icon, so without aria-label it has no
    // accessible name at all.
    expect(trigger?.getAttribute('aria-label')).toBe('More actions');
  });
});

@Component({
  standalone: true,
  imports: [MznTable],
  template: `
    <div
      mznTable
      [columns]="columns"
      [dataSource]="dataSource"
      [nested]="nested()"
      [scrollbarOptions]="scrollbarOptions()"
    ></div>
  `,
})
class ScrollContainmentHostComponent {
  readonly columns: readonly TableColumn[] = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
  ];

  readonly dataSource: readonly TableDataSource[] = [
    { key: '1', name: 'Alice' },
  ];

  readonly nested = signal(false);
  readonly scrollbarOptions = signal<PartialOptions | undefined>(undefined);
}

describe('MznTable scroll containment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScrollContainmentHostComponent],
    });
  });

  async function render(
    setup: (host: ScrollContainmentHostComponent) => void = () => {},
  ): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(ScrollContainmentHostComponent);

    setup(fixture.componentInstance);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture.nativeElement.querySelector('[mznTable]');
  }

  function getScrollbarOptions(
    host: HTMLElement,
  ): ReturnType<OverlayScrollbars['options']> {
    const scrollHost = host.querySelector<HTMLElement>('.mzn-scrollbar');
    const instance = scrollHost ? OverlayScrollbars(scrollHost) : undefined;

    if (!instance) throw new Error('OverlayScrollbars was not initialised');

    return instance.options();
  }

  it('should keep the Scrollbar defaults when scrollbarOptions is not provided', async () => {
    const options = getScrollbarOptions(await render());

    expect(options.overflow).toEqual({ x: 'scroll', y: 'scroll' });
    expect(options.scrollbars.autoHide).toBe('scroll');
  });

  it('should forward scrollbarOptions to the inner Scrollbar', async () => {
    const options = getScrollbarOptions(
      await render((host) =>
        host.scrollbarOptions.set({
          overflow: { x: 'visible', y: 'visible' },
          scrollbars: { autoHide: 'never' },
        }),
      ),
    );

    expect(options.overflow).toEqual({ x: 'visible', y: 'visible' });
    expect(options.scrollbars.autoHide).toBe('never');
  });

  it('should contain the scroll area and render a hidden sizer', async () => {
    const host = await render();
    const sizer = host.querySelector('.mzn-table__intrinsic-sizer');

    expect(
      host.querySelector('.mzn-scrollbar.mzn-table-scroll-area'),
    ).not.toBeNull();
    expect(sizer?.tagName.toLowerCase()).toBe('svg');
    expect(sizer?.getAttribute('aria-hidden')).toBe('true');
    expect(sizer?.getAttribute('focusable')).toBe('false');
  });

  it('should skip containment and the sizer for nested tables', async () => {
    const host = await render((h) => h.nested.set(true));

    expect(host.querySelector('.mzn-table-scroll-area')).toBeNull();
    expect(host.querySelector('.mzn-table__intrinsic-sizer')).toBeNull();
  });

  it('should expose the measured table width as a CSS variable', async () => {
    const OriginalResizeObserver = globalThis.ResizeObserver;
    const callbacks: ResizeObserverCallback[] = [];

    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        callbacks.push(callback);
      }

      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    } as unknown as typeof ResizeObserver;

    try {
      const host = await render();
      const table = host.querySelector('table') as HTMLTableElement;

      Object.defineProperty(table, 'scrollWidth', { value: 1180 });
      callbacks.forEach((callback) => callback([], {} as ResizeObserver));

      expect(host.style.getPropertyValue('--mzn-table-intrinsic-width')).toBe(
        '1180px',
      );
    } finally {
      globalThis.ResizeObserver = OriginalResizeObserver;
    }
  });
});
