import { TableDataSource } from '@mezzanine-ui/core/table';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../../__test-utils__';
import { useTableDraggable } from './useTableDraggable';

describe('useTableDraggable()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describe('Draggable feature enabled', () => {
    let originSources: TableDataSource[] = [];

    beforeEach(() => {
      originSources = [{
        id: 'foo',
        name: 'foo',
        age: 10,
        count: 300,
      }, {
        id: 'bar',
        name: 'bar',
        age: 15,
        count: 200,
      }, {
        id: 'bob',
        name: 'bob',
        age: 13,
        count: 250,
      }];
    });

    it('should data source changed when set source called', () => {
      const setDataSource = jest.fn<any, [any]>(() => {
        originSources = [];
      });

      const { result } = renderHook(
        () => useTableDraggable({
          draggable: {
            enabled: true,
            onDragEnd: () => {},
          },
          dataSource: originSources,
          setDataSource,
        }),
      );
    });
  });
});
