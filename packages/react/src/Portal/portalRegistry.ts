export type PortalLayer = 'alert' | 'default';

interface PortalContainers {
  alert: HTMLElement | null;
  default: HTMLElement | null;
}

// Module-level state
let containers: PortalContainers = {
  alert: null,
  default: null,
};

let rootElement: HTMLElement | null = null;
let initialized = false;
let alertHeight = 0;

function findRootElement(rootProp?: string | HTMLElement): HTMLElement | null {
  if (rootProp instanceof HTMLElement) return rootProp;

  if (typeof rootProp === 'string') {
    const element = document.querySelector(rootProp);

    if (element instanceof HTMLElement) return element;
  }

  return document.body;
}

function observeAlertHeight() {
  if (!containers.alert || !containers.default) return;

  const updatePortalTop = () => {
    if (!containers.alert || !containers.default) return;

    const height = containers.alert.offsetHeight;

    if (height !== alertHeight) {
      alertHeight = height;
      containers.default.style.top = `${height}px`;
      containers.default.style.height = `calc(100% - ${height}px)`;
    }
  };

  // Use ResizeObserver to track alert container height changes
  const observer = new ResizeObserver(updatePortalTop);

  observer.observe(containers.alert);

  // Initial update
  updatePortalTop();
}

function createContainers() {
  if (!rootElement) return;

  const alertContainer = document.createElement('div');

  alertContainer.id = 'mzn-alert-container';
  alertContainer.className = 'mzn-portal-alert';

  const portalContainer = document.createElement('div');

  portalContainer.id = 'mzn-portal-container';
  portalContainer.className = 'mzn-portal-default';

  if (rootElement.parentElement) {
    rootElement.parentElement.insertBefore(alertContainer, rootElement);
  } else {
    document.body.insertBefore(alertContainer, document.body.firstChild);
  }

  rootElement.appendChild(portalContainer);

  containers = {
    alert: alertContainer,
    default: portalContainer,
  };

  // Observe alert height changes and update portal container position
  observeAlertHeight();
}

/**
 * Initialize portal containers.
 * This function can be called manually in your app's entry point,
 * or it will be called automatically when the first Portal is rendered.
 *
 * @param rootSelector - Optional root element or selector string.
 *                       Defaults to document.body
 */
export function initializePortals(rootSelector?: string | HTMLElement) {
  if (initialized || typeof window === 'undefined') return;

  initialized = true;

  rootElement = findRootElement(rootSelector);

  if (!rootElement) return;

  createContainers();
}

export function getContainer(layer: PortalLayer): HTMLElement | null {
  if (!initialized && typeof window !== 'undefined') {
    initializePortals();
  }

  return containers[layer];
}

export function getRootElement(): HTMLElement | null {
  if (!initialized && typeof window !== 'undefined') {
    initializePortals();
  }

  return rootElement;
}

/**
 * Reset portal system state. Only for testing purposes.
 * @internal
 */
export function resetPortals() {
  containers = {
    alert: null,
    default: null,
  };
  rootElement = null;
  initialized = false;
  alertHeight = 0;
}
