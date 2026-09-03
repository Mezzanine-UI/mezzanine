export { default as MznPortal } from './portal.vue';
export type { PortalProps } from './portal.types';
export type { PortalLayer } from './portal-registry';
export {
  getContainer,
  getRootElement,
  initializePortals,
  resetPortals,
} from './portal-registry';
