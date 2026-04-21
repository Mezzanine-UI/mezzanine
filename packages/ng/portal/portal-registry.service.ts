import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

/** 已註冊的 Portal 層級名稱。 */
export type PortalLayer = 'default' | 'alert';

const PORTAL_CONTAINER_ID = 'mzn-portal-container';
const ALERT_CONTAINER_ID = 'mzn-alert-container';

/**
 * 管理 Portal 容器元素的全域 singleton service。
 *
 * 在 `document.body` 下建立兩層容器：
 * - `#mzn-alert-container` — alert 層（置於最前）
 * - `#mzn-portal-container` — 預設層（置於最後）
 *
 * @example
 * ```ts
 * const registry = inject(MznPortalRegistry);
 * const container = registry.getContainer('default');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class MznPortalRegistry {
  private readonly document = inject(DOCUMENT);

  private defaultContainer: HTMLElement | null = null;
  private alertContainer: HTMLElement | null = null;

  /** 取得指定層級的容器 DOM 元素。首次呼叫時自動建立。 */
  getContainer(layer: PortalLayer = 'default'): HTMLElement {
    this.ensureContainers();

    return layer === 'alert' ? this.alertContainer! : this.defaultContainer!;
  }

  private ensureContainers(): void {
    if (this.defaultContainer && this.alertContainer) {
      return;
    }

    const body = this.document.body;

    this.alertContainer =
      this.document.getElementById(ALERT_CONTAINER_ID) ??
      this.createContainer(ALERT_CONTAINER_ID, 'mzn-portal-alert');

    this.defaultContainer =
      this.document.getElementById(PORTAL_CONTAINER_ID) ??
      this.createContainer(PORTAL_CONTAINER_ID, 'mzn-portal-default');

    if (!this.alertContainer.parentElement) {
      body.insertBefore(this.alertContainer, body.firstChild);
    }

    if (!this.defaultContainer.parentElement) {
      body.appendChild(this.defaultContainer);
    }
  }

  private createContainer(id: string, className: string): HTMLElement {
    const el = this.document.createElement('div');

    el.id = id;
    el.classList.add(className);

    return el;
  }
}
