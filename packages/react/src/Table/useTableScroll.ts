import {
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useState,
  DetailedHTMLProps,
  HTMLAttributes,
  UIEventHandler,
} from 'react';

const HEADER_DEFAULT_HEIGHT = 40; // px
const SCROLL_BAR_MIN_START_AT = 4; // px
const SCROLL_BAR_MAX_END_SPACING = 16; // px
const FETCH_MORE_TRIGGER_AT_BOTTOM = 46; // px
const SCROLL_BAR_DISPLAY_TIMES = 1500; // ms

const defaultScrollBarTrackStyle = {
  position: 'absolute',
  right: 0,
  top: `${HEADER_DEFAULT_HEIGHT}px`,
  width: 12,
  height: 0,
  opacity: '0',
  transition: '0.1s opacity ease-in',
  backgroundColor: '#F2F2F2',
} as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const defaultScrollBarStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  position: 'absolute',
  right: 0,
  top: `${SCROLL_BAR_MIN_START_AT}px`,
  width: 10,
  height: 0,
  borderRadius: 10,
  transform: 'translate3d(0, 0, 0)',
  outline: 'none',
  opacity: '0',
  transition: '0.1s opacity ease-in',
  backgroundColor: 'transparent',
} as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface TableScrollProps {
  onFetchMore?: VoidFunction;
  loading?: boolean;
  scrollBarSize?: number;
}

export default function useTableScroll(props: TableScrollProps) {
  const {
    onFetchMore,
    loading,
    scrollBarSize = 4,
  } = props;

  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollBarTrackRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const scrollBarDisplayTimer = useRef<number>();

  const [scrollBarHeight, setScrollBarHeight] = useState<number>(0);
  const [pointerOffset, setPointerOffset] = useState<number>(0);
  const [isHorizontalScrolling, toggleIsHorizontalScrolling] = useState<boolean>(false);

  /** set scroll bar callback */
  const onSetScrollBarHeight = useCallback(() => {
    /** @NOTE Scroll bar 高度為可視區域的百分比 */
    if (!scrollRef.current) return;

    const {
      scrollHeight,
      clientHeight: tableHeight,
    } = scrollRef.current;

    const bodyHeight = scrollHeight - HEADER_DEFAULT_HEIGHT;
    const viewAreaHeight = tableHeight - HEADER_DEFAULT_HEIGHT;

    const nextHeight = Math.max(
      (viewAreaHeight - (SCROLL_BAR_MAX_END_SPACING * 2)) * (viewAreaHeight / bodyHeight),
      tableHeight / 10, // height should not less than this
    );

    setScrollBarHeight(nextHeight);
  }, []);

  /** display/hide scroll bar */
  const onHideScrollBar = useCallback(() => {
    if (!scrollBarRef.current) return;

    if (scrollBarDisplayTimer.current) {
      window.clearTimeout(scrollBarDisplayTimer.current);
    }

    scrollBarDisplayTimer.current = window.setTimeout(() => {
      if (scrollBarRef.current) {
        scrollBarRef.current.style.opacity = '0';
        scrollBarRef.current.style.pointerEvents = 'none';
      }

      if (scrollBarTrackRef.current) {
        scrollBarTrackRef.current.style.opacity = '0';
        scrollBarTrackRef.current.style.pointerEvents = 'none';
      }
    }, SCROLL_BAR_DISPLAY_TIMES);
  }, []);

  const onDisplayScrollBar = useCallback(() => {
    if (!scrollBarRef.current || !scrollRef.current || !scrollBarTrackRef.current) return;

    /** 觸控螢幕不需要 scroll bar */
    const isTouchEnabled = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (isTouchEnabled) return;

    scrollBarRef.current.style.opacity = '1';
    scrollBarRef.current.style.pointerEvents = 'auto';
    scrollBarTrackRef.current.style.opacity = '1';
    scrollBarTrackRef.current.style.pointerEvents = 'auto';

    if (scrollBarDisplayTimer.current) {
      window.clearTimeout(scrollBarDisplayTimer.current);
    }
  }, []);

  const resetPointerOffset = useCallback(() => setPointerOffset(0), []);

  /** scroll bar style reset when mouse leave */
  const onScrollBarLeave = useCallback(() => {
    if (scrollBarRef.current) {
      (scrollBarRef.current.childNodes[0] as HTMLDivElement).style.width = `${scrollBarSize}px`;
    }

    resetPointerOffset();
  }, []);

  /** when use mouse to drag scroll bar, get cursor position */
  const onScrollBarMouseDown = useCallback(({ clientY } : { clientY: number }) => {
    const { current: scrollBar } = scrollBarRef;

    if (!scrollBar) return;

    const { top: initScrollBarTop } = scrollBar.getBoundingClientRect();

    setPointerOffset(clientY - initScrollBarTop);
  }, []);

  const onScrollBarMouseUp = useCallback(() => resetPointerOffset(), []);

  /** 偵測 table 高度是否發生變化，有的話就要重新計算 scroll bar 長度 */
  useEffect(() => {
    const { current: table } = tableRef;

    function resizing() {
      window.requestAnimationFrame(onSetScrollBarHeight);
    }

    if (table) {
      const observer = new ResizeObserver(resizing);

      observer.observe(table);

      return () => {
        observer.disconnect();
      };
    }

    return () => {};
  }, []);

  useEffect(() => {
    const { current: body } = scrollRef;
    const { current: scrollBar } = scrollBarRef;
    const { current: scrollBarTrack } = scrollBarTrackRef;

    if (!body || !scrollBar || !scrollBarTrack) return;

    /** 游標在滾軸上長按並移動 */
    function onMouseMove({ clientY }: { clientY: number }) {
      const {
        scrollHeight,
        clientHeight: tableHeight,
      } = body as HTMLDivElement;

      if (!pointerOffset) return;

      // keep scroll bar display when moving
      window.requestAnimationFrame(onDisplayScrollBar);

      const {
        top: tableTop,
      } = (body as HTMLDivElement).getBoundingClientRect();

      /** Table 最大滾動距離 */
      const maxScrollDistance = scrollHeight - tableHeight;
      /** 游標在 scroll bar 上的位置 */
      const scrollBarCurrentPosition = clientY - (tableTop + HEADER_DEFAULT_HEIGHT) - pointerOffset;
      /** 可視區域高度 */
      const viewAreaHeight = tableHeight - HEADER_DEFAULT_HEIGHT;
      /** 最大滑動距離 */
      const maxScrollBarDistance = viewAreaHeight - scrollBarHeight - SCROLL_BAR_MAX_END_SPACING;
      /** 計算出來的距離 */
      const clampScrollBarTop = Math.min(
        Math.max(scrollBarCurrentPosition, 0), // min boundary
        maxScrollBarDistance, // max boundary
      );

      (scrollBar as HTMLDivElement).style.setProperty('transform', `translate3d(0, ${clampScrollBarTop}px, 0)`);

      (body as HTMLDivElement).scrollTop = (
        (clampScrollBarTop * maxScrollDistance) / maxScrollBarDistance
      );
    }

    /** 在滾軸滑軌上點擊，直接滾動到指定位置上 */
    function onMouseClick({ clientY }: { clientY: number }) {
      if (!scrollBar) return;

      const {
        scrollHeight,
        clientHeight: tableHeight,
      } = body as HTMLDivElement;

      // keep scroll bar display when moving
      window.requestAnimationFrame(onDisplayScrollBar);

      const {
        top: tableTop,
      } = (body as HTMLDivElement).getBoundingClientRect();

      /** Table 最大滾動距離 */
      const maxScrollDistance = scrollHeight - tableHeight;
      /** 游標在 Track 上的位置 */
      const scrollBarCurrentPosition = clientY - (tableTop + HEADER_DEFAULT_HEIGHT) - (scrollBarHeight / 2);
      /** 可視區域高度 */
      const viewAreaHeight = tableHeight - HEADER_DEFAULT_HEIGHT;
      /** 最大滑動距離 */
      const maxScrollBarDistance = viewAreaHeight - scrollBarHeight - SCROLL_BAR_MAX_END_SPACING;
      /** 計算出來的距離 */
      const clampScrollBarTop = Math.min(
        Math.max(scrollBarCurrentPosition, 0), // min boundary
        maxScrollBarDistance, // max boundary
      );

      (scrollBar as HTMLDivElement).style.setProperty('transform', `translate3d(0, ${clampScrollBarTop}px, 0)`);

      (body as HTMLDivElement).scrollTop = (
        (clampScrollBarTop * maxScrollDistance) / maxScrollBarDistance
      );
    }

    /** 游標移動到滾軸/滑軌上方時 */
    function onMouseOver() {
      (scrollBar as HTMLDivElement).style.setProperty('transition', '0s');
      onDisplayScrollBar();
    }

    /** 游標移開滾軸/滑軌上方時 */
    function onMouseLeave() {
      (scrollBar as HTMLDivElement).style.setProperty('transition', '0.1s');
      onHideScrollBar();
    }

    scrollBar.addEventListener('mousemove', onMouseMove, false);
    scrollBar.addEventListener('mouseover', onMouseOver, false);
    scrollBar.addEventListener('mouseleave', onMouseLeave, false);
    scrollBarTrack.addEventListener('mousemove', onMouseMove, false);
    scrollBarTrack.addEventListener('mouseover', onMouseOver, false);
    scrollBarTrack.addEventListener('mouseleave', onMouseLeave, false);
    scrollBarTrack.addEventListener('click', onMouseClick, false);

    return () => {
      scrollBar.removeEventListener('mousemove', onMouseMove, false);
      scrollBar.removeEventListener('mouseover', onMouseOver, false);
      scrollBar.removeEventListener('mouseleave', onMouseLeave, false);
      scrollBarTrack.removeEventListener('mousemove', onMouseMove, false);
      scrollBarTrack.removeEventListener('mouseover', onMouseOver, false);
      scrollBarTrack.removeEventListener('mouseleave', onMouseLeave, false);
      scrollBarTrack.removeEventListener('click', onMouseClick, false);
    };
  }, [scrollBarHeight, pointerOffset, onDisplayScrollBar, onHideScrollBar]);

  /** scroll bar fatter when mouse enter */
  const onScrollBarEnter = useCallback(() => {
    if (scrollBarRef.current) {
      (scrollBarRef.current.childNodes[0] as HTMLDivElement).style.width = `${scrollBarSize + 6}px`;
    }
  }, []);

  /** scroll table directly */
  const setScrollBarTop = useCallback(() => {
    if (scrollRef.current) {
      const {
        clientHeight: tableHeight,
        scrollTop,
        scrollHeight,
      } = scrollRef.current;

      /** @NOTE don't apply scroll change when use pointer dragging */
      if (scrollBarRef.current && !pointerOffset) {
        const bodyHeight = scrollHeight - HEADER_DEFAULT_HEIGHT;
        const viewAreaHeight = tableHeight - HEADER_DEFAULT_HEIGHT;
        const distance = Math.max(
          (viewAreaHeight * Math.max((scrollTop / bodyHeight), 0)),
          0,
        );

        scrollBarRef.current.style.transform = `translate3d(0, ${distance}px, 0)`;
      }

      if (scrollBarTrackRef.current) {
        scrollBarTrackRef.current.style.height = `${tableHeight - HEADER_DEFAULT_HEIGHT}px`;
      }
    }
  }, [scrollBarHeight, pointerOffset]);

  const onScroll: UIEventHandler<HTMLDivElement> = useCallback((scrollTarget) => {
    /** 使用者開始橫向滾動 */
    if ((scrollTarget.target as HTMLDivElement).scrollLeft) {
      toggleIsHorizontalScrolling(true);
    } else {
      toggleIsHorizontalScrolling(false);
    }

    if (loading) return;

    if (scrollRef.current) {
      const {
        clientHeight,
        scrollTop,
        scrollHeight,
      } = scrollRef.current;

      /** 如果不需要滾動，則不需要觸發 */
      if (clientHeight >= scrollHeight) return;

      window.requestAnimationFrame(onDisplayScrollBar);

      /** @Note safari specific bug fix for scroll bouncing */
      const belowBottom = scrollTop > (scrollHeight - clientHeight);

      if (belowBottom) return;

      window.requestAnimationFrame(setScrollBarTop);

      /** trigger fetchMore when scrolling */
      if ((scrollHeight - (scrollTop + clientHeight)) < FETCH_MORE_TRIGGER_AT_BOTTOM) {
        onFetchMore?.();
      }
    }

    window.requestAnimationFrame(onHideScrollBar);
  }, [loading, setScrollBarTop, onDisplayScrollBar, onFetchMore, onHideScrollBar]);

  const scrollBarStyle = useMemo(() => ({
    ...defaultScrollBarStyle,
    height: `${scrollBarHeight}px`,
  }), [scrollBarHeight]);

  const scrollBarTrackStyle = useMemo(() => ({
    ...defaultScrollBarTrackStyle,
    height: `${scrollRef.current?.scrollHeight ?? 0}px`,
  }), [scrollBarHeight]);

  /** composing result */
  const tableScrollContainer = {
    ref: scrollRef,
    target: tableRef,
    onScroll,
  };

  const scrollElement = {
    ref: scrollBarRef,
    trackRef: scrollBarTrackRef,
    scrollBarSize,
    onMouseDown: onScrollBarMouseDown,
    onMouseUp: onScrollBarMouseUp,
    onMouseEnter: onScrollBarEnter,
    onMouseLeave: onScrollBarLeave,
    style: scrollBarStyle,
    trackStyle: scrollBarTrackStyle,
  };

  return [tableScrollContainer, scrollElement, isHorizontalScrolling] as const;
}
