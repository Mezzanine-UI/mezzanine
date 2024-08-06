import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TableDataSource, TableDraggable } from '@mezzanine-ui/core/table';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import {
  DragDropContextProps,
  DropResult,
  ResponderProvided,
} from '@hello-pangea/dnd';
import { arrayMove } from '../../utils/array-move';
import { usePreviousValue } from '../../hooks/usePreviousValue';

export interface UseTableDraggable {
  dataSource: TableDataSource[];
  setDataSource: Dispatch<SetStateAction<TableDataSource[]>>;
  draggable?: TableDraggable;
}

export function useTableDraggable(props: UseTableDraggable) {
  const { dataSource, setDataSource, draggable } = props;
  const resultSnapshot = useRef<[DropResult, ResponderProvided] | null>(null);
  const dataSnapShot = useRef<TableDataSource[]>(dataSource);
  const isDragging = useRef<boolean>(false);
  const [draggingId, setDraggingId] = useState<string>('');
  const prevDataSource = usePreviousValue(dataSource);

  useEffect(() => {
    if (!isEqual(prevDataSource, dataSource)) {
      dataSnapShot.current = dataSource;
    }
  }, [prevDataSource, dataSource]);

  const onBeforeDragStart = useCallback(
    (e: { draggableId: SetStateAction<string> }) => {
      isDragging.current = true;
      setDraggingId(e.draggableId);
    },
    [],
  );

  const onDragEnd: DragDropContextProps['onDragEnd'] = useCallback(
    async (result, id) => {
      resultSnapshot.current = [result, id];
      isDragging.current = false;
      setDraggingId('');

      const temp = [...dataSnapShot.current];
      const from = result.source.index;
      const to = result.destination?.index ?? from;
      const newData = arrayMove(temp, from, to);

      dataSnapShot.current = newData;
      setDataSource(newData);
    },
    [setDataSource],
  );

  useEffect(() => {
    if (!draggable?.enabled) return () => {};

    async function onMouseUp() {
      if (isDragging.current) return;
      const args = resultSnapshot.current;

      resultSnapshot.current = null;

      if (
        !args?.[0] ||
        args?.[0]?.source.index === args?.[0]?.destination?.index
      )
        return;

      if (draggable?.onDragEnd && args) {
        draggable.onDragEnd(Array.from(dataSnapShot.current));
      }
    }

    const debouncedOnMouseUp = debounce(onMouseUp, 500);

    window.addEventListener('mouseup', debouncedOnMouseUp, false);

    return () => {
      window.removeEventListener('mouseup', debouncedOnMouseUp, false);
    };
  }, [draggable]);

  return {
    draggingId,
    onBeforeDragStart,
    onDragEnd,
  };
}
