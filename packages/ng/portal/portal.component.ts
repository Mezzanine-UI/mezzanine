import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  EmbeddedViewRef,
  inject,
  input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MznPortalRegistry, PortalLayer } from './portal-registry.service';

/**
 * 將內容投射到指定的 DOM 容器中。
 *
 * 預設投射到 `MznPortalRegistry` 管理的全域容器。
 * 可透過 `container` 指定自訂目標元素，或設定 `disablePortal` 將內容渲染在原地。
 *
 * @example
 * ```html
 * import { MznPortal } from '@mezzanine-ui/ng/portal';
 *
 * <div mznPortal>
 *   <div>This will be rendered at document.body level</div>
 * </div>
 *
 * <div mznPortal [disablePortal]="true">
 *   <div>This stays in place</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznPortal]',
  host: {
    '[attr.container]': 'null',
    '[attr.disablePortal]': 'null',
    '[attr.layer]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class MznPortal {
  private readonly registry = inject(MznPortalRegistry);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('content', { static: true })
  private readonly contentTpl!: TemplateRef<unknown>;

  private embeddedView: EmbeddedViewRef<unknown> | null = null;

  /**
   * 自訂 Portal 容器元素。設定後將忽略 `layer`。
   */
  readonly container = input<HTMLElement>();

  /**
   * 是否禁用 Portal（內容直接渲染在原位置）。
   * @default false
   */
  readonly disablePortal = input(false);

  /**
   * Portal 層級。
   * @default 'default'
   */
  readonly layer = input<PortalLayer>('default');

  /** 解析最終的目標容器。 */
  protected readonly resolvedContainer = computed((): HTMLElement | null => {
    if (this.disablePortal()) {
      return null;
    }

    return this.container() ?? this.registry.getContainer(this.layer());
  });

  constructor() {
    effect(() => {
      const target = this.resolvedContainer();

      this.detach();

      if (target) {
        this.attachToContainer(target);
      } else {
        this.attachInPlace();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.detach();
    });
  }

  private attachToContainer(container: HTMLElement): void {
    this.embeddedView = this.viewContainerRef.createEmbeddedView(
      this.contentTpl,
    );
    this.embeddedView.detectChanges();

    for (const node of this.embeddedView.rootNodes) {
      container.appendChild(node);
    }
  }

  private attachInPlace(): void {
    this.embeddedView = this.viewContainerRef.createEmbeddedView(
      this.contentTpl,
    );
    this.embeddedView.detectChanges();
  }

  private detach(): void {
    if (this.embeddedView) {
      const index = this.viewContainerRef.indexOf(this.embeddedView);

      if (index !== -1) {
        this.viewContainerRef.remove(index);
      }

      this.embeddedView = null;
    }
  }
}
