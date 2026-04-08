import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  computed,
  inject,
  signal,
} from '@angular/core';
import { modalClasses } from '@mezzanine-ui/core/modal';
import { MZN_MODAL_CONTEXT } from './modal-context';

/**
 * 套用在 Modal body 容器元素上的 attribute directive。
 *
 * 自動掛載 `mzn-modal__body-container` class，並依據實際捲動狀態切換上下分隔線。
 * 當父層 `<div mznModal>` 的 `modalType` 為 `extended` 時，強制兩條分隔線都顯示。
 *
 * 對應 React `Modal` 內 `handleBodyContainerRef` 的行為。Angular 因為無法
 * introspect 投影內容，所以由 consumer 顯式套用本 directive 來啟用此邏輯。
 *
 * @example
 * ```html
 * <div mznModal [open]="isOpen">
 *   <div mznModalHeader title="Title" ></div>
 *   <div mznModalBodyContainer>
 *     <p>長內容…</p>
 *   </div>
 *   <div mznModalFooter>...</div>
 * </div>
 * ```
 */
@Directive({
  selector: '[mznModalBodyContainer]',
  standalone: true,
})
export class MznModalBodyContainer implements AfterViewInit {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly context = inject(MZN_MODAL_CONTEXT, { optional: true });

  private readonly hasTopSeparator = signal(false);
  private readonly hasBottomSeparator = signal(false);

  @HostBinding('class')
  protected get hostClassName(): string {
    const isExtended = this.context?.modalType() === 'extended';
    const top = isExtended || this.hasTopSeparator();
    const bottom = isExtended || this.hasBottomSeparator();
    const parts: string[] = [modalClasses.modalBodyContainer];

    if (top) parts.push(modalClasses.modalBodyContainerWithTopSeparator);
    if (bottom) parts.push(modalClasses.modalBodyContainerWithBottomSeparator);

    return parts.join(' ');
  }

  ngAfterViewInit(): void {
    const node = this.hostRef.nativeElement;
    const checkScroll = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = node;

      this.hasTopSeparator.set(scrollTop > 0);
      this.hasBottomSeparator.set(scrollTop + clientHeight < scrollHeight);
    };

    const rafId = requestAnimationFrame(checkScroll);

    node.addEventListener('scroll', checkScroll);

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(checkScroll)
        : null;

    observer?.observe(node);

    Array.from(node.children).forEach((child) => observer?.observe(child));

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(rafId);
      node.removeEventListener('scroll', checkScroll);
      observer?.disconnect();
    });
  }
}
