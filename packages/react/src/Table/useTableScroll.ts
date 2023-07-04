import {
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useState,
  useContext,
  DetailedHTMLProps,
  HTMLAttributes,
  MouseEvent,
} from 'react';
import { TableContext, TableDataContext } from './TableContext';
import { usePreviousValue } from '../hooks/usePreviousValue';

const defaultScrollBarTrackStyle = {
  position: 'absolute',
  right: 0,
  top: 0,
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
  top: 0,
  width: 10,
  height: 0,
  borderRadius: 10,
  outline: 'none',
  opacity: '0',
  transition: '0.1s opacity ease-in',
  backgroundColor: 'transparent',
} as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const SCROLL_BAR_MIN_START_AT = 4; // px
const SCROLL_BAR_MAX_END_SPACING = 16; // px
const FETCH_MORE_TRIGGER_AT_BOTTOM = 46; // px
const SCROLL_BAR_DISPLAY_TIMES = 1500; // ms

export default function useTableScroll() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrollBarTrackRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const scrollBarDisplayTimer = useRef<number>();

  const {
    fetchMore,
    loading,
    scrollBarSize = 4,
  } = useContext(TableContext) || {};

  const {
    dataSource = [],
  } = useContext(TableDataContext) || {};

  const [scrollBarHeight, setScrollBarHeight] = useState<number>(0);
  const [pointerOffset, setPointerOffset] = useState<number>(0);

  /** set scroll bar callback */
  const onSetScrollBarHeight = useCallback(() => {
    if (!bodyRef.current) return;

    const {
      scrollHeight,
      clientHeight: tableHeight,
    } = bodyRef.current;

    const nextHeight = Math.max(
      (tableHeight - SCROLL_BAR_MAX_END_SPACING) * (tableHeight / scrollHeight),
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
    if (!scrollBarRef.current || !bodyRef.current || !scrollBarTrackRef.current) return;

    scrollBarRef.current.style.opacity = '1';
    scrollBarRef.current.style.pointerEvents = 'auto';
    scrollBarTrackRef.current.style.opacity = '1';
    scrollBarTrackRef.current.style.pointerEvents = 'auto';

    if (scrollBarDisplayTimer.current) {
      window.clearTimeout(scrollBarDisplayTimer.current);
    }
  }, []);

  /** reset scroll bar height when sources changed */
  const prevSourceLength = usePreviousValue(dataSource.length);
  const currentSourceLength = useMemo(() => dataSource.length, [dataSource.length]);

  useEffect(() => {
    // first initial render
    onSetScrollBarHeight();
  }, []);

  useEffect(() => {
    if (prevSourceLength !== currentSourceLength) {
      onSetScrollBarHeight();
    }
  }, [prevSourceLength, currentSourceLength]);

  /** set the scroll bar default position */
  useEffect(() => {
    if (!scrollBarRef.current || !bodyRef.current) return;

    scrollBarRef.current.style.top = `${SCROLL_BAR_MIN_START_AT}px`;
  }, []);

  useEffect(() => {
    const { current: body } = bodyRef;
    const { current: scrollBar } = scrollBarRef;
    const { current: scrollBarTrack } = scrollBarTrackRef;

    if (!body || !scrollBar || !scrollBarTrack) return;

    function onMouseMove({ clientY }: { clientY: number }) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight: tableHeight,
      } = body as HTMLDivElement;

      if (!pointerOffset) return;

      // keep scroll bar display when moving
      window.requestAnimationFrame(onDisplayScrollBar);

      const {
        top: tableTop,
      } = (body as HTMLDivElement).getBoundingClientRect();

      const nextScrollBarTop = (clientY - tableTop - pointerOffset) + scrollTop;
      const maxScrollBarTop = scrollHeight - scrollBarHeight - SCROLL_BAR_MAX_END_SPACING;
      const clampScrollBarTop = Math.min(
        Math.max(nextScrollBarTop, SCROLL_BAR_MIN_START_AT), // min boundary
        maxScrollBarTop, // max boundary
      );

      (scrollBar as HTMLDivElement).style.setProperty('top', `${clampScrollBarTop}px`);

      (body as HTMLDivElement).scrollTop = (
        ((scrollHeight - tableHeight) * (clampScrollBarTop)) /
        (scrollHeight - scrollBarHeight)
      );
    }

    function onMouseOver() {
      onDisplayScrollBar();
    }

    function onMouseLeave() {
      onHideScrollBar();
    }

    scrollBar.addEventListener('mousemove', onMouseMove, false);
    scrollBar.addEventListener('mouseover', onMouseOver, false);
    scrollBar.addEventListener('mouseleave', onMouseLeave, false);
    scrollBarTrack.addEventListener('mousemove', onMouseMove, false);
    scrollBarTrack.addEventListener('mouseover', onMouseOver, false);
    scrollBarTrack.addEventListener('mouseleave', onMouseLeave, false);

    return () => {
      scrollBar.removeEventListener('mousemove', onMouseMove, false);
      scrollBar.removeEventListener('mouseover', onMouseOver, false);
      scrollBar.removeEventListener('mouseleave', onMouseLeave, false);
      scrollBarTrack.removeEventListener('mousemove', onMouseMove, false);
      scrollBarTrack.removeEventListener('mouseover', onMouseOver, false);
      scrollBarTrack.removeEventListener('mouseleave', onMouseLeave, false);
    };
  }, [scrollBarHeight, pointerOffset, onDisplayScrollBar, onHideScrollBar]);

  const resetPointerOffset = useCallback(() => setPointerOffset(0), []);

  /** scroll bar fatter when mouse enter */
  const onScrollBarEnter = useCallback(() => {
    if (scrollBarRef.current) {
      (scrollBarRef.current.childNodes[0] as HTMLDivElement).style.width = `${scrollBarSize + 6}px`;
    }
  }, []);

  /** scroll bar style reset when mouse leave */
  const onScrollBarLeave = useCallback(() => {
    if (scrollBarRef.current) {
      (scrollBarRef.current.childNodes[0] as HTMLDivElement).style.width = `${scrollBarSize}px`;
    }

    resetPointerOffset();
  }, []);

  /** when use mouse to drag scroll bar, get cursor position */
  const onScrollBarMouseDown = useCallback(({ clientY } : MouseEvent<HTMLDivElement>) => {
    const { current: scrollBar } = scrollBarRef;

    if (!scrollBar) return;

    const { top: initScrollBarTop } = scrollBar.getBoundingClientRect();

    setPointerOffset(clientY - initScrollBarTop);
  }, []);

  const onScrollBarMouseUp = useCallback(() => resetPointerOffset(), []);

  /** scroll table directly */
  const setScrollBarTop = useCallback(() => {
    if (bodyRef.current) {
      const {
        clientHeight: tableHeight,
        scrollTop,
        scrollHeight,
      } = bodyRef.current;

      /** @NOTE don't apply scroll change when use pointer dragging */
      if (scrollBarRef.current && !pointerOffset) {
        scrollBarRef.current.style.top = `${
          (scrollTop * (tableHeight - scrollBarHeight - SCROLL_BAR_MAX_END_SPACING)) /
          (scrollHeight - tableHeight) + scrollTop + SCROLL_BAR_MIN_START_AT
        }px`;
      }

      if (scrollBarTrackRef.current) {
        scrollBarTrackRef.current.style.height = `${scrollHeight}px`;
      }
    }
  }, [scrollBarHeight, pointerOffset]);

  const onScroll = useCallback(() => {
    window.requestAnimationFrame(onDisplayScrollBar);

    if (loading) return;

    if (bodyRef.current) {
      const {
        clientHeight,
        scrollTop,
        scrollHeight,
      } = bodyRef.current;

      /** @Note safari specific bug fix for scroll bouncing */
      const belowBottom = scrollTop > (scrollHeight - clientHeight);

      if (belowBottom) return;

      window.requestAnimationFrame(setScrollBarTop);

      /** trigger fetchMore when scrolling */
      if ((scrollHeight - (scrollTop + clientHeight)) < FETCH_MORE_TRIGGER_AT_BOTTOM) {
        fetchMore?.onFetchMore();
      }
    }

    window.requestAnimationFrame(onHideScrollBar);
  }, [loading, setScrollBarTop, onDisplayScrollBar, fetchMore, onHideScrollBar]);

  const scrollBarStyle = useMemo(() => ({
    ...defaultScrollBarStyle,
    height: `${scrollBarHeight}px`,
  }), [scrollBarHeight]);

  const scrollBarTrackStyle = useMemo(() => ({
    ...defaultScrollBarTrackStyle,
    height: `${bodyRef.current?.scrollHeight ?? 0}px`,
  }), [scrollBarHeight]);

  /** composing result */
  const tableBody = {
    ref: bodyRef,
    onScroll,
  };

  const scrollElement = {
    ref: scrollBarRef,
    trackRef: scrollBarTrackRef,
    onMouseDown: onScrollBarMouseDown,
    onMouseUp: onScrollBarMouseUp,
    onMouseEnter: onScrollBarEnter,
    onMouseLeave: onScrollBarLeave,
    style: scrollBarStyle,
    trackStyle: scrollBarTrackStyle,
  };

  return [tableBody, scrollElement] as const;
}
